/* Rutekort: viser lastbilruter paa et Leaflet-kort med SVG-fallback (offline). */
(function () {
  'use strict';
  var LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
  var LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
  var NS = 'http://www.w3.org/2000/svg';

  var el = null, map = null, layer = null, mode = null; // mode: 'leaflet' | 'svg'
  var sidsteRuter = [];
  var tileOk = 0, tileFejl = 0, tileTimer = null;

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = res; s.onerror = function () { rej(new Error('script')); };
      document.head.appendChild(s);
    });
  }
  function loadCss(href) {
    if (document.querySelector('link[data-rutekort]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href; l.setAttribute('data-rutekort', '1');
    document.head.appendChild(l);
  }
  function medTimeout(p, ms) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { rej(new Error('timeout')); }, ms);
      p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }

  function init(element) {
    el = element;
    return new Promise(function (resolve) {
      function fald() { try { visSvg(); } catch (e) {} resolve(); }
      var klar = window.L ? Promise.resolve() :
        (loadCss(LEAFLET_CSS), medTimeout(loadScript(LEAFLET_JS), 8000));
      klar.then(function () {
        if (!window.L || !window.L.map) throw new Error('ingen leaflet');
        try {
          startLeaflet();
        } catch (e) { fald(); return; }
        resolve();
      }).catch(fald);
    });
  }

  function startLeaflet() {
    el.innerHTML = '';
    mode = 'leaflet';
    map = L.map(el, { zoomControl: true, attributionControl: true }).setView([50, 12], 4);
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bidragsydere'
    });
    tileOk = 0; tileFejl = 0;
    tiles.on('tileload', function () { tileOk++; });
    tiles.on('tileerror', function () {
      tileFejl++;
      if (tileOk === 0 && tileFejl >= 3) skiftTilSvg();
    });
    tiles.addTo(map);
    layer = L.layerGroup().addTo(map);
    // Hvis ingen flise er indlaest efter 8 sek, brug fallback
    tileTimer = setTimeout(function () { if (tileOk === 0) skiftTilSvg(); }, 8000);
    if (sidsteRuter.length) tegnLeaflet(sidsteRuter);
  }

  function skiftTilSvg() {
    if (mode !== 'leaflet') return;
    clearTimeout(tileTimer);
    mode = 'svg';
    var gammel = map;
    map = null; layer = null;
    // vent lidt, saa Leaflet naar at blive faerdig med det den er i gang med
    setTimeout(function () {
      try { gammel.stop(); gammel.remove(); } catch (e) {}
      visSvg();
      if (sidsteRuter.length) tegnSvg(sidsteRuter);
    }, 50);
  }

  function visSvg() {
    mode = 'svg';
    el.innerHTML = '';
    el.style.background = '#eef3f7';
    el.style.position = 'relative';
  }

  function tegn(ruter) {
    sidsteRuter = ruter || [];
    if (!el) return;
    try {
      if (mode === 'leaflet' && map) tegnLeaflet(sidsteRuter);
      else if (mode === 'svg') tegnSvg(sidsteRuter);
    } catch (e) { /* aldrig i stykker for resten af siden */ }
  }

  function tegnLeaflet(ruter) {
    layer.clearLayers();
    var bounds = [];
    ruter.forEach(function (r) {
      var pts = (r.linje && r.linje.length > 1) ? r.linje : [[r.fra.lat, r.fra.lon], [r.til.lat, r.til.lon]];
      var stiplet = !(r.linje && r.linje.length > 1);
      var opt = {
        color: r.farve || '#1d6fdc',
        weight: r.fremhaev ? 7 : 5,
        opacity: r.fremhaev ? 1 : (ruter.some(function (x) { return x.fremhaev; }) ? 0.55 : 0.85)
      };
      if (stiplet) opt.dashArray = '8 10';
      L.polyline(pts, opt).addTo(layer);
      [r.fra, r.til].forEach(function (p) {
        L.circleMarker([p.lat, p.lon], {
          radius: 7, color: '#ffffff', weight: 2, fillColor: r.farve || '#1d6fdc', fillOpacity: 1
        }).bindTooltip(p.navn, { permanent: false, direction: 'top' }).addTo(layer);
      });
      pts.forEach(function (p) { bounds.push(p); });
    });
    if (bounds.length) map.fitBounds(bounds, { padding: [30, 30], animate: false });
  }

  function tegnSvg(ruter) {
    el.innerHTML = '';
    var W = el.clientWidth || 600, H = el.clientHeight || 400;
    var alle = [];
    ruter.forEach(function (r) {
      (r.linje && r.linje.length > 1 ? r.linje : [[r.fra.lat, r.fra.lon], [r.til.lat, r.til.lon]])
        .forEach(function (p) { alle.push(p); });
    });
    if (!alle.length) return;
    var minLa = 90, maxLa = -90, minLo = 180, maxLo = -180;
    alle.forEach(function (p) {
      minLa = Math.min(minLa, p[0]); maxLa = Math.max(maxLa, p[0]);
      minLo = Math.min(minLo, p[1]); maxLo = Math.max(maxLo, p[1]);
    });
    var kos = Math.cos(((minLa + maxLa) / 2) * Math.PI / 180);
    var bredde = Math.max((maxLo - minLo) * kos, 1e-6), hoejde = Math.max(maxLa - minLa, 1e-6);
    var pad = 50;
    var sk = Math.min((W - 2 * pad) / bredde, (H - 2 * pad) / hoejde);
    var offX = (W - bredde * sk) / 2, offY = (H - hoejde * sk) / 2;
    function xy(p) { return [offX + (p[1] - minLo) * kos * sk, offY + (maxLa - p[0]) * sk]; }

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Simpelt rutekort (uden baggrundskort)');
    svg.style.display = 'block';
    function mk(tag, attrs, txt) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (txt != null) n.textContent = txt;
      svg.appendChild(n); return n;
    }
    var harFrem = ruter.some(function (x) { return x.fremhaev; });
    var byer = {};
    ruter.forEach(function (r) {
      var har = r.linje && r.linje.length > 1;
      var pts = (har ? r.linje : [[r.fra.lat, r.fra.lon], [r.til.lat, r.til.lon]]).map(xy);
      var a = { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '),
        fill: 'none', stroke: r.farve || '#1d6fdc', 'stroke-width': r.fremhaev ? 7 : 5,
        'stroke-linejoin': 'round', 'stroke-linecap': 'round',
        opacity: r.fremhaev ? 1 : (harFrem ? 0.55 : 0.85) };
      if (!har) a['stroke-dasharray'] = '8 10';
      mk('polyline', a);
      byer[r.fra.navn] = r.fra; byer[r.til.navn] = r.til;
    });
    Object.keys(byer).forEach(function (n) {
      var p = xy([byer[n].lat, byer[n].lon]);
      mk('circle', { cx: p[0], cy: p[1], r: 7, fill: '#ffffff', stroke: '#222', 'stroke-width': 2.5 });
      var venstre = p[0] > W - 90;
      mk('text', { x: p[0] + (venstre ? -12 : 12), y: p[1] + 5, 'text-anchor': venstre ? 'end' : 'start',
        'font-size': 14, 'font-family': 'sans-serif', 'font-weight': 'bold', fill: '#222',
        stroke: '#eef3f7', 'stroke-width': 3, 'paint-order': 'stroke' }, n);
    });
    mk('text', { x: 8, y: H - 8, 'font-size': 11, 'font-family': 'sans-serif', fill: '#555' },
      'Forenklet kort. Baggrundskortet kunne ikke indlæses.');
    el.appendChild(svg);
  }

  // ---------- find en ny rute ----------
  function hentJson(url, ms) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 15000);
    return fetch(url, ctrl ? { signal: ctrl.signal, headers: { Accept: 'application/json' } } : {})
      .then(function (r) { clearTimeout(t); if (!r.ok) throw new Error('http ' + r.status); return r.json(); },
        function (e) { clearTimeout(t); throw e; });
  }
  function geokod(navn) {
    return hentJson('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(navn))
      .then(function (arr) {
        if (!arr || !arr.length) throw new Error('Kunne ikke finde stedet ' + navn);
        return { navn: navn, lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon) };
      }, function () { throw new Error('Stedsopslag svarer ikke lige nu. Prøv igen om lidt'); });
  }
  function dp(pts, eps) {
    var keep = new Array(pts.length).fill(false); keep[0] = keep[pts.length - 1] = true;
    var st = [[0, pts.length - 1]];
    while (st.length) {
      var s = st.pop(), a = s[0], b = s[1];
      var dx = pts[b][1] - pts[a][1], dy = pts[b][0] - pts[a][0], L2 = Math.sqrt(dx * dx + dy * dy) || 1e-12;
      var m = -1, mi = -1;
      for (var i = a + 1; i < b; i++) {
        var d = Math.abs(dy * (pts[i][1] - pts[a][1]) - dx * (pts[i][0] - pts[a][0])) / L2;
        if (d > m) { m = d; mi = i; }
      }
      if (m > eps) { keep[mi] = true; st.push([a, mi]); st.push([mi, b]); }
    }
    return pts.filter(function (_, i) { return keep[i]; });
  }
  function forenkl(pts, max) {
    max = max || 250;
    if (pts.length <= max) return pts;
    var e = 0.0005, r = dp(pts, e);
    while (r.length > max) { e *= 1.25; r = dp(pts, e); }
    return r;
  }
  function find(fraNavn, tilNavn) {
    return geokod(fraNavn).then(function (fra) {
      return geokod(tilNavn).then(function (til) {
        var url = 'https://router.project-osrm.org/route/v1/driving/' + fra.lon + ',' + fra.lat + ';' +
          til.lon + ',' + til.lat + '?overview=full&geometries=geojson';
        return hentJson(url, 30000).then(function (d) {
          if (!d || d.code !== 'Ok' || !d.routes || !d.routes.length)
            throw new Error('Der findes ingen kørevej mellem ' + fraNavn + ' og ' + tilNavn);
          var r = d.routes[0];
          var pts = r.geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
          return {
            fra: fra, til: til,
            km: Math.round(r.distance / 1000),
            timer: Math.round(r.duration / 3600 * 10) / 10,
            linje: forenkl(pts, 250).map(function (p) { return [Math.round(p[0] * 1e5) / 1e5, Math.round(p[1] * 1e5) / 1e5]; })
          };
        }, function (e) {
          if (e && /^Der findes/.test(e.message)) throw e;
          throw new Error('Rutetjenesten svarer ikke lige nu. Prøv igen om lidt');
        });
      });
    });
  }

  function rutedata() {
    return (window.RUTEDATA && window.RUTEDATA.ruter) || {};
  }

  window.Rutekort = { init: init, tegn: tegn, find: find, rutedata: rutedata };
})();
