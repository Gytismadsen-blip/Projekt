/* Casefil: laes en casefil (Word, PDF, tekst) og find tal til transportberegneren.
   Kun faste regulaere udtryk. Ingen AI. Virker i browser (window.Casefil) og Node (module.exports). */
(function (root) {
  'use strict';

  // ---------- Filindlaesning ----------
  var JSZIP_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  var PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  function indlaesScript(url) {
    return new Promise(function (ok, fejl) {
      var s = document.createElement('script');
      s.src = url;
      s.onload = function () { ok(); };
      s.onerror = function () { fejl(new Error('Kunne ikke indlæse ' + url)); };
      document.head.appendChild(s);
    });
  }

  function afkodEntiteter(s) {
    return s.replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCodePoint(parseInt(h, 16)); })
      .replace(/&#(\d+);/g, function (_, d) { return String.fromCodePoint(parseInt(d, 10)); })
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  }

  function docxXmlTilTekst(xml) {
    var t = xml.replace(/<\/w:p>/g, '\n').replace(/<\/w:tc>/g, ' ')
      .replace(/<w:br\s*\/?>/g, '\n').replace(/<w:tab\s*\/?>/g, ' ')
      .replace(/<[^>]*>/g, '');
    return afkodEntiteter(t);
  }

  function laesDocx(fil) {
    var klar = (typeof window !== 'undefined' && window.JSZip) ? Promise.resolve() : indlaesScript(JSZIP_URL);
    return klar.then(function () { return fil.arrayBuffer(); })
      .then(function (buf) { return window.JSZip.loadAsync(buf); })
      .then(function (zip) {
        var f = zip.file('word/document.xml');
        if (!f) throw new Error('Word-filen mangler word/document.xml.');
        return f.async('string');
      })
      .then(docxXmlTilTekst);
  }

  function laesPdf(fil) {
    var klar = (typeof window !== 'undefined' && window.pdfjsLib) ? Promise.resolve() : indlaesScript(PDFJS_URL);
    return klar.then(function () {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      return fil.arrayBuffer();
    }).then(function (buf) {
      return window.pdfjsLib.getDocument({ data: buf }).promise;
    }).then(function (pdf) {
      var sider = [];
      for (var n = 1; n <= pdf.numPages; n++) sider.push(n);
      return sider.reduce(function (kaede, n) {
        return kaede.then(function (ud) {
          return pdf.getPage(n).then(function (side) { return side.getTextContent(); }).then(function (tc) {
            ud.push(pdfSideTilTekst(tc.items));
            return ud;
          });
        });
      }, Promise.resolve([])).then(function (ud) { return ud.join('\n'); });
    });
  }

  // Saml pdf.js-elementer til linjer (efter y), og saml linjer til afsnit.
  function pdfSideTilTekst(items) {
    var linjer = [], cur = null;
    items.forEach(function (it) {
      if (typeof it.str !== 'string') return;
      var y = it.transform ? it.transform[5] : 0;
      var h = it.height || 10;
      if (!cur || Math.abs(cur.y - y) > h * 0.5) {
        cur = { y: y, h: h, t: '' };
        linjer.push(cur);
      }
      cur.t += it.str;
      if (it.hasEOL) cur = null;
    });
    var ud = '', prev = null;
    linjer.forEach(function (l) {
      var t = l.t.replace(/\s+/g, ' ').trim();
      if (!t) return;
      if (prev === null) ud = t;
      else {
        var gap = Math.abs(prev.y - l.y);
        var nyt = gap > prev.h * 1.7 || /[.:?!]$/.test(prev.t);
        ud += (nyt ? '\n' : ' ') + t;
      }
      prev = { y: l.y, h: l.h, t: t };
    });
    return ud;
  }

  function laes(fil) {
    var navn = String((fil && fil.name) || '').toLowerCase();
    var afvis = function () { return Promise.reject(new Error('Filtypen understøttes ikke. Brug Word, PDF eller tekst.')); };
    if (/\.(txt|csv)$/.test(navn)) return Promise.resolve(fil.text());
    if (/\.docx$/.test(navn)) return laesDocx(fil);
    if (/\.pdf$/.test(navn)) return laesPdf(fil);
    return afvis();
  }

  // ---------- Hjaelpere til find ----------
  // Tal: "7.40" og "8,50" er decimaler, "11,600" og "1.452" er tusindtal.
  function tal(s, mode) {
    s = String(s).replace(/\s/g, '');
    var c = (s.match(/,/g) || []).length, d = (s.match(/\./g) || []).length;
    if (!c && !d) return parseFloat(s);
    if (c && d) {
      if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
      else s = s.replace(/,/g, '');
      return parseFloat(s);
    }
    var sep = c ? ',' : '.';
    var parts = s.split(sep);
    if (parts.length > 2) return parseFloat(parts.join(''));
    if (mode !== 'dec' && parts[1].length === 3 && parts[0] !== '0' && parts[0].length <= 3) return parseFloat(parts.join(''));
    return parseFloat(parts[0] + '.' + parts[1]);
  }

  function afr(x) { return Math.round(x * 1000) / 1000; }

  var N = '(\\d+(?:[.,]\\d+)*)';
  var TON = N + '\\s*(?:tons?|tonnes?|ton|t)\\b';
  var ENHED_TID = '(days?|dage?|weeks?|uger?|uge)';

  function tilDage(n, enhed) { return /^[wu]/i.test(enhed) ? n * 7 : n; }

  function snip(text, idx, len) {
    var s = Math.max(0, idx - 30), e = Math.min(text.length, idx + len + 40);
    return text.slice(s, e).replace(/\s+/g, ' ').trim();
  }

  function soeg(paras, re) {
    for (var i = 0; i < paras.length; i++) {
      var m = re.exec(paras[i].t);
      if (m) return { m: m, idx: paras[i].start + m.index, len: m[0].length };
    }
    return null;
  }

  var ORDRE_ORD = /\b(?:plates?|plade\w*|materials?|materiale\w*|orders?|ordre\w*|råvare\w*|goods|gods)\b/i;
  var CONT_ORD = /container|barge|pram\b|prammen|flodpram/i;
  var STOP = /^\s*(?:(?:maut|toll|vejafgift)s?\s+(?:tolls?|tabel|table|satser|\()|environment|miljø|task\b|opgave)/i;

  function erOrdreHoved(t) {
    return new RegExp(TON, 'i').test(t) && ORDRE_ORD.test(t) && !CONT_ORD.test(t);
  }

  // ---------- Hovedfunktion ----------
  function find(tekst) {
    tekst = (typeof tekst === 'string' ? tekst : '').replace(/\r\n?/g, '\n').replace(/ /g, ' ');
    var res = { ordrer: [], flaade: {}, maut: {}, fund: [] };
    if (!tekst.trim()) return res;
    var fund = res.fund;

    function add(felt, label, vaerdi, enhed, udsnit, sikker) {
      fund.push({ felt: felt, label: label, vaerdi: vaerdi, enhed: enhed || '', udsnit: udsnit || '', sikker: sikker !== false });
    }

    var paras = [], pos = 0;
    tekst.split('\n').forEach(function (l) {
      var t = l.trim();
      if (t) paras.push({ t: t, start: pos + l.indexOf(t) });
      pos += l.length + 1;
    });

    findOrdrer(tekst, paras, res, add);
    findFlaade(tekst, res, add);
    findTrailere(tekst, res, add);
    findMaut(tekst, res, add);
    findEmission(tekst, res, add);
    return res;
  }

  function findOrdrer(tekst, paras, res, add) {
    var heads = [];
    paras.forEach(function (p, i) { if (erOrdreHoved(p.t)) heads.push(i); });
    var prevOlie = null, nr = 0;

    heads.forEach(function (hi, k) {
      nr++;
      var end = k + 1 < heads.length ? heads[k + 1] : paras.length;
      var grp = [paras[hi]], cont = [];
      for (var j = hi + 1; j < end && j <= hi + 8; j++) {
        if (STOP.test(paras[j].t)) break;
        if (CONT_ORD.test(paras[j].t)) cont.push(paras[j]); else grp.push(paras[j]);
      }
      var head = [paras[hi]];
      var idx = res.ordrer.length;

      var by = soeg(head, /\b(?:in|from|fra|i|ved)\s+([A-ZÆØÅ][A-Za-zÀ-ÿæøåÆØÅ\-]+)/);
      var by_ = by ? by.m[1] : null;
      var bogst = soeg(head, /(?:[Rr]aw\s+material|[Rr]åvare|[Mm]ateriale?)\s+([A-Z0-9])\b/);
      var navn = bogst ? 'Råvare ' + bogst.m[1] + (by_ ? ', ' + by_ : '') : (by_ || 'Ordre ' + nr);

      var lb = { type: 'lastbil', navn: navn, kilde: {} };
      function sæt(o, felt, label, enhed, v, r, sikker) {
        o[felt] = v;
        o.kilde[felt] = snip(tekst, r.idx, r.len);
        add('ordrer.' + o._i + '.' + felt, o.navn + ': ' + label, v, enhed, o.kilde[felt], sikker);
      }
      lb._i = idx;

      var r = soeg(head, new RegExp(TON, 'i'));
      var tonnage = tal(r.m[1]);
      sæt(lb, 'tonnage', 'tonnage', 't', tonnage, r);

      var pl = soeg(grp, /(\d+(?:[.,]\d+)?)\s*(?:x|×|\*)\s*(\d+(?:[.,]\d+)?)\s*m\b/i);
      if (pl) {
        var a = tal(pl.m[1], 'dec'), b = tal(pl.m[2], 'dec');
        sæt(lb, 'pladeB', 'plade bredde', 'm', Math.min(a, b), pl);
        sæt(lb, 'pladeL', 'plade længde', 'm', Math.max(a, b), pl);
      }
      var pv = soeg(grp, new RegExp('(?:weigh\\w*|vejede|vejer|vægt\\w*|weight)[^.\\n]{0,20}?' + N + '\\s*kg', 'i'));
      if (pv) sæt(lb, 'pladeVaegt', 'pladevægt', 'kg', tal(pv.m[1], 'kg'), pv);

      var truckGrp = grp;
      var af = soeg(truckGrp, new RegExp('(?:distance|afstand|strækning|kørsel)\\w*[^.\\n]{0,30}?' + N + '\\s*km', 'i'));
      var km = soeg(truckGrp, new RegExp(N + '\\s*(?:dkk|kr\\b\\.?|kroner|,-)\\s*(?:per|pr\\.?|\\/)\\s*(?:km|kilometer)', 'i'));
      var mk = soeg(truckGrp, new RegExp('(?:maut|toll|vejafgift)\\w*[^.\\n]{0,30}?' + N + '\\s*km', 'i'));
      if (km) sæt(lb, 'kmPris', 'pris pr. km', 'kr', tal(km.m[1], 'dec'), km);
      if (mk) sæt(lb, 'mautKm', 'Maut-km', 'km', tal(mk.m[1]), mk);
      if (af) sæt(lb, 'afstand', 'afstand', 'km', tal(af.m[1]), af);
      else if (km) {
        var alle = [], re2 = new RegExp(N + '\\s*km\\b', 'gi'), mm;
        truckGrp.forEach(function (p) {
          re2.lastIndex = 0;
          while ((mm = re2.exec(p.t))) { var v = tal(mm[1]); if (v !== lb.mautKm) alle.push({ v: v, idx: p.start + mm.index, len: mm[0].length }); }
        });
        if (alle.length) {
          alle.sort(function (x, y) { return y.v - x.v; });
          sæt(lb, 'afstand', 'afstand', 'km', alle[0].v, alle[0], false);
        }
      }

      var ol = soeg(grp, new RegExp(N + '\\s*(?:%|percent|procent|pct)\\s*(?:oil|olie|fuel|brændstof|diesel)', 'i')) ||
        soeg(grp, new RegExp('(?:oil|olie|fuel|diesel|brændstof|bunker)\\w*[^%\\n.]{0,40}?' + N + '\\s*(?:%|percent|procent|pct)', 'i'));
      if (ol) {
        prevOlie = tal(ol.m[1], 'dec');
        sæt(lb, 'olie', 'olietillæg', '%', prevOlie, ol);
      } else if (prevOlie !== null && soeg(grp, /\b(?:oil|olie|fuel|brændstof)\w*/i)) {
        var ok = soeg(grp, /\b(?:oil|olie|fuel|brændstof)\w*/i);
        sæt(lb, 'olie', 'olietillæg (uden procent i afsnittet, taget fra forrige ordre)', '%', prevOlie, ok, false);
      }

      var kl = soeg(grp, new RegExp('(?:ready|klar\\w*)[^.\\n]{0,40}?(\\d+)\\s*' + ENHED_TID, 'i'));
      var le = soeg(grp, new RegExp('(?:delivered|used|leveres|leveret|brugt|bruges|frist|deadline)[^.\\n]{0,40}?(\\d+)\\s*' + ENHED_TID, 'i'));
      var klarD = kl ? tilDage(tal(kl.m[1]), kl.m[2]) : null;
      var leveringD = le ? tilDage(tal(le.m[1]), le.m[2]) : null;
      if (kl) sæt(lb, 'klarDage', 'klar til afsendelse om', 'dage', klarD, kl);
      if (le) sæt(lb, 'leveringDage', 'leveringsfrist', 'dage', leveringD, le);

      var harLb = lb.kmPris !== undefined || lb.afstand !== undefined || !cont.length;
      // Container-loesninger hoerer til samme ordre
      var conts = [];
      cont.forEach(function (p) {
        var pris = soeg([p], new RegExp('(?:pr\\.?|per|each|pro|for hver)\\s*container[^.\\n]{0,40}?' + N + '\\s*(?:dkk|kr\\b\\.?|kroner)', 'i')) ||
          soeg([p], new RegExp(N + '\\s*(?:dkk|kr\\b\\.?|kroner)\\s*(?:pr\\.?|per)\\s*container', 'i'));
        var last = soeg([p], new RegExp('(?:each|hver|per)\\s+container[^.\\n]{0,30}?(?:load|carry|hold|laste|rumme|bære)\\w*\\s+' + TON, 'i'));
        var lastSikker = true;
        if (!last) { last = soeg([p], new RegExp(TON, 'i')); lastSikker = false; }
        if (!pris) return;
        var c = { type: 'container', navn: (by_ || navn) + ' (container)', kilde: {}, _i: res.ordrer.length + (harLb ? 1 : 0) + conts.length };
        sæt(c, 'tonnage', 'tonnage (hele ordren)', 't', tonnage, r);
        if (last) sæt(c, 'contNyttelast', 'nyttelast pr. container', 't', tal(last.m[1]), last, lastSikker);
        sæt(c, 'contPris', 'pris pr. container', 'kr', tal(pris.m[1]), pris);
        var tr = soeg([p], new RegExp('(?:transport\\s*-?\\s*t?i(?:me|d)\\w*|transit\\w*|sejltid)[^.\\n]{0,30}?(\\d+)\\s*' + ENHED_TID, 'i'));
        if (tr) sæt(c, 'transitDage', 'transporttid', 'dage', tilDage(tal(tr.m[1]), tr.m[2]), tr);
        var iv = soeg([p], /(?:every|hver)\s+(second|other|anden|andet|third|tredje|\d+)\.?\s*(?:day|dag)/i);
        var ivU = iv ? null : soeg([p], /(?:every|hver)\s+(day|dag|week|uge)\b/i);
        if (iv) {
          var w = iv.m[1].toLowerCase();
          var iv_n = /second|other|anden|andet/.test(w) ? 2 : /third|tredje/.test(w) ? 3 : parseInt(w, 10);
          sæt(c, 'intervalDage', 'afgang hver', 'dage', iv_n, iv);
        } else if (ivU) {
          sæt(c, 'intervalDage', 'afgang hver', 'dage', /^w|^u/i.test(ivU.m[1]) ? 7 : 1, ivU);
        }
        if (klarD !== null) sæt(c, 'klarDage', 'klar til afsendelse om', 'dage', klarD, kl);
        if (leveringD !== null) sæt(c, 'fristDage', 'frist (skal bruges om)', 'dage', leveringD, le);
        conts.push(c);
      });

      var harLastbil = harLb || !conts.length;
      if (harLastbil) res.ordrer.push(lb);
      conts.forEach(function (c) { res.ordrer.push(c); });
    });

    res.ordrer.forEach(function (o) { delete o._i; });
  }

  function findFlaade(tekst, res, add) {
    var fl = res.flaade;
    var lines = [{ t: tekst, start: 0 }];
    var ta = soeg(lines, /(\d+)\s*(?:motor\s*vehicles?|motorkøretøj\w*|trækkere|lastbiler|tractors?)/i);
    var antal = null;
    if (ta) { antal = parseInt(ta.m[1], 10); fl.traekAntal = antal; add('flaade.traekAntal', 'antal motorkøretøjer', antal, 'stk', snip(tekst, ta.idx, ta.len)); }

    var tv = soeg(lines, new RegExp('(?:motor\\s*vehicles?|motorkøretøj\\w*|trækkere|tractors?|lastbil\\w*)[^.\\n]{0,30}?(?:weigh\\w*|vejede|vejer|vægt\\w*)[^.\\n\\d]{0,20}' + N + '(?:\\s*(?:and|og|to|til|-|–)\\s*' + N + ')?\\s*kg', 'i'));
    if (tv) {
      var lo = tal(tv.m[1], 'kg'), hi = tv.m[2] ? tal(tv.m[2], 'kg') : lo;
      var mn = Math.min(lo, hi), mx = Math.max(lo, hi);
      fl.traekEgen = afr(mn / 1000);
      add('flaade.traekEgen', 'motorkøretøjets egenvægt' + (mx !== mn ? ' (laveste af interval)' : ''), fl.traekEgen, 't', snip(tekst, tv.idx, tv.len), mx === mn);
      if (mx !== mn) add('flaade.traekEgenMax', 'motorkøretøjets egenvægt (højeste)', afr(mx / 1000), 't', snip(tekst, tv.idx, tv.len), false);
    }
    var sl = soeg(lines, new RegExp('(?:pressure on the (?:stool|saddle|fifth wheel)|sadeltryk|sadeltræk\\w*|støttelast|saddellast)[^.\\n\\d]{0,20}' + N + '\\s*kg', 'i'));
    if (sl) { fl.saddellast = afr(tal(sl.m[1], 'kg') / 1000); add('flaade.saddellast', 'tilladt sadellast', fl.saddellast, 't', snip(tekst, sl.idx, sl.len)); }

    var gr = /\b(\d)(?:\s*(?:eller|or|og|and|\/|-)\s*(\d))?\s*(?:axe?ls?|akslet?|aksler|aks\.?)\b[^\n]{0,70}?(\d{2})\s*(?:T\b|ton)(?:[^\n]{0,20}?\((\d{2})\s*(?:T\b|ton))?/gi;
    var g;
    while ((g = gr.exec(tekst))) {
      var a1 = parseInt(g[1], 10), a2 = g[2] ? parseInt(g[2], 10) : a1, gv = parseInt(g[3], 10);
      var u = snip(tekst, g.index, g[0].length);
      if (a1 === 4 && fl.graense4 === undefined) { fl.graense4 = gv; add('flaade.graense4', 'vægtgrænse 4 aksler', gv, 't', u); }
      else if ((a1 >= 5 || a2 >= 5) && fl.graense5 === undefined) {
        fl.graense5 = gv; add('flaade.graense5', 'vægtgrænse 5-6 aksler', gv, 't', u);
        if (g[4]) { fl.graense5Container = parseInt(g[4], 10); add('flaade.graense5Container', 'vægtgrænse 5-6 aksler med 40" container', fl.graense5Container, 't', u); }
      }
    }

    var er = /euro\s*([0-6])\s*[:=]?\s*(\d+)(?!\d|[.,]\d|-)/gi, e, eu = {}, sum = 0, antalEuro = 0;
    while ((e = er.exec(tekst))) {
      var lv = e[1];
      if (eu[lv] === undefined) { eu[lv] = parseInt(e[2], 10); sum += eu[lv]; antalEuro++; }
    }
    if (antalEuro) {
      fl.euroTraekkere = eu;
      var sik = antal === null || antal === sum;
      Object.keys(eu).forEach(function (lv) {
        var m = new RegExp('euro\\s*' + lv + '\\s*[:=]?\\s*' + eu[lv] + '(?!\\d)', 'i').exec(tekst);
        add('flaade.euroTraekkere.' + lv, 'antal Euro ' + lv + ' motorkøretøjer', eu[lv], 'stk', m ? snip(tekst, m.index, m[0].length) : '', sik);
      });
    }
  }

  var TYPE_RE = /^\s*(chassis|curtain\s*trailers?|gardin\w*|box\s*trailers?|kasse\w*|reefer\s*trailers?|køle\w*|kølet\w*)\s*$/i;
  function typeKey(s) {
    s = s.toLowerCase();
    if (/chassis/.test(s)) return 'chassis';
    if (/curtain|gardin/.test(s)) return 'gardin';
    if (/box|kasse/.test(s)) return 'boks';
    return 'koel';
  }
  var TYPE_NAVN = { chassis: 'Chassis', gardin: 'Gardintrailer', boks: 'Kassetrailer', koel: 'Køletrailer' };
  var RAEKKE_RE = /^\s*[-–•]?\s*(number|antal|stk|int\.?\s*meas\w*|indv\w*|inner\w*|tare|egenv\w*)\b/i;
  var CELLE_RE = /^(?:[\d.,]+(?:\s*(?:kg|t|ton\w*))?|\d+(?:[.,]\d+)?\s*[x×]\s*\d+(?:[.,]\d+)?)$/i;

  function findTrailere(tekst, res, add) {
    var lines = tekst.split('\n');
    var forste = -1;
    for (var i = 0; i < lines.length; i++) if (TYPE_RE.test(lines[i])) { forste = i; break; }
    if (forste < 0) return;
    var cols = [];
    for (var k = Math.max(0, forste - 6); k < forste; k++) {
      var m = /^\s*(\d)\s*(?:axe?ls?|aksler|akslet)\s*$/i.exec(lines[k]);
      if (m) cols.push(parseInt(m[1], 10));
    }
    if (!cols.length) cols = [2, 3];
    var ncols = cols.length;
    var typ = null, tr = {};
    for (i = forste; i < lines.length; i++) {
      var l = lines[i];
      if (TYPE_RE.test(l)) { typ = typeKey(l); continue; }
      var rm = RAEKKE_RE.exec(l);
      if (!typ || !rm) continue;
      var kind = /^(number|antal|stk)/i.test(rm[1]) ? 'antal' : /^(int|indv|inner)/i.test(rm[1]) ? 'maal' : 'egen';
      var tokens = [];
      for (var j = i + 1; j < lines.length && tokens.length < ncols; j++) {
        var t = lines[j].trim();
        if (t === '') tokens.push('');
        else if (CELLE_RE.test(t)) tokens.push(t);
        else break;
      }
      while (tokens.length && tokens[tokens.length - 1] === '') tokens.pop();
      var gaet = false;
      if (tokens.length === 1 && ncols > 1) { tokens = new Array(ncols - 1).fill('').concat(tokens); gaet = true; }
      tokens.forEach(function (tk, c) {
        if (tk === '' || c >= ncols) return;
        var aks = cols[c], key = typ + aks;
        var o = tr[key] || (tr[key] = { aks: aks });
        var u = TYPE_NAVN[typ] + ' ' + rm[1].trim() + ': ' + tk;
        if (kind === 'antal') { o.antal = tal(tk); add('flaade.trailere.' + key + '.antal', TYPE_NAVN[typ] + ' ' + aks + ' aks: antal', o.antal, 'stk', u, !gaet); }
        else if (kind === 'egen') {
          var nt = /^[\d.,]+/.exec(tk)[0], v; if (/\bt(on\w*)?$/i.test(tk)) v = tal(nt, 'dec'); else v = tal(nt, 'kg') / 1000;
          o.egen = afr(v); add('flaade.trailere.' + key + '.egen', TYPE_NAVN[typ] + ' ' + aks + ' aks: egenvægt', o.egen, 't', u, !gaet);
        } else {
          var mm = /([\d.,]+)\s*[x×]\s*([\d.,]+)/i.exec(tk);
          if (mm) { o.indvendigB = tal(mm[1], 'dec'); o.indvendigL = tal(mm[2], 'dec'); add('flaade.trailere.' + key + '.maal', TYPE_NAVN[typ] + ' ' + aks + ' aks: indvendigt mål', o.indvendigB + ' x ' + o.indvendigL, 'm', u, !gaet); }
        }
      });
    }
    // ret rækkefølge og fjern tomme
    Object.keys(tr).forEach(function (k2) { if (tr[k2].egen !== undefined || tr[k2].antal !== undefined) { res.flaade.trailere = res.flaade.trailere || {}; res.flaade.trailere[k2] = tr[k2]; } });
  }

  function findMaut(tekst, res, add) {
    var start = tekst.search(/maut\s+tolls?|maut[- ]?(?:tabel|satser)|road\s*toll|vejafgift\w*\s*\(/i);
    var sek = tekst.slice(start >= 0 ? start : 0);
    var hr = /euro\s*(\d\s*[-–]\s*\d)/gi, h, cols = [];
    while ((h = hr.exec(sek)) && cols.length < 6) {
      var c = h[1].replace(/\s/g, '').replace('–', '-');
      if (cols.indexOf(c) < 0) cols.push(c); else break;
    }
    if (!cols.length) return;
    var rr = /(?:(\d)\s*[-–]\s*(\d)\s*(?:axe?ls?|akslet?|aksler|aks\.?)|(\d)\s*(?:or\s+more|eller\s+flere|\+|or\s+over|and\s+more)\s*(?:axe?ls?|aksler|aks\.?))\s+((?:\d+[.,]\d+\s*){2,})/gi, r;
    while ((r = rr.exec(sek))) {
      var vals = r[4].match(/\d+[.,]\d+/g) || [];
      var felt = r[3] ? 'lang' : (parseInt(r[2], 10) >= 4 ? 'lang' : 'kort');
      var lab = r[3] ? (r[3] + ' eller flere aksler') : (r[1] + '-' + r[2] + ' aksler');
      for (var i = 0; i < cols.length && i < vals.length; i++) {
        res.maut[cols[i]] = res.maut[cols[i]] || {};
        var v = tal(vals[i], 'dec');
        res.maut[cols[i]][felt] = v;
        add('maut.' + cols[i] + '.' + felt, 'Maut Euro ' + cols[i] + ', ' + lab, v, 'kr/km', snip(sek, r.index, Math.min(r[0].length, 60)));
      }
    }
    if (!Object.keys(res.maut).length) res.maut = {};
  }

  function findEmission(tekst, res, add) {
    var er = /euro\s*([0-6])\s+(\d+[.,]\d+)\s+(\d+[.,]\d+)\s+(\d+[.,]\d+)\s+(\d+[.,]\d+)/gi, m;
    while ((m = er.exec(tekst))) {
      res.emission = res.emission || {};
      var o = { nox: tal(m[2], 'dec'), hc: tal(m[3], 'dec'), co: tal(m[4], 'dec'), pm: tal(m[5], 'dec') };
      res.emission[m[1]] = o;
      add('emission.' + m[1], 'Udledning Euro ' + m[1] + ' (NOx / HC / CO / PM)', o.nox + ' / ' + o.hc + ' / ' + o.co + ' / ' + o.pm, 'g/kWh', snip(tekst, m.index, m[0].length));
    }
  }

  var Casefil = { laes: laes, find: find, _docxXmlTilTekst: docxXmlTilTekst, _tal: tal };
  if (typeof module !== 'undefined' && module.exports) module.exports = Casefil;
  else root.Casefil = Casefil;
})(typeof window !== 'undefined' ? window : this);
