// Kør: node turberegner/test.js  (kræver jsdom)
const { JSDOM } = require('jsdom');
const path = require('path');
let fejl = 0;
function ok(navn, cond, info) {
  if (cond) console.log('OK    ' + navn);
  else { fejl++; console.log('FEJL  ' + navn + (info !== undefined ? '  →  ' + info : '')); }
}

(async () => {
  const dom = await JSDOM.fromFile(path.join(__dirname, 'index.html'),
    { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true });
  const w = dom.window, d = w.document, T = w.Turberegner;
  ok('siden lever og har regnemotor', !!T);

  // ---- Milano: facit fra tavlen ----
  const ex = T.eksempler();
  const m = T.beregn(ex[0]);
  ok('Milano nyttelast 27,5 t', m.nyttelast === 27.5, m.nyttelast);
  ok('Milano 4 læs', m.laes === 4, m.laes);
  ok('Milano pris pr. tur 12.463,97', m.tur === 12463.97, m.tur);
  ok('Milano samlet 49.855,88', m.total === 49855.88, m.total);
  ok('Milano advarer om næsten ingen luft', m.msg.some(x => /Næsten ingen luft/.test(x.t)));
  ok('Milano advarer om hele plader (5 læs)', m.msg.some(x => /5 læs/.test(x.t)), JSON.stringify(m.msg));
  ok('Milano 229 plader pr. læs', m.pladerPrLaes === 229, m.pladerPrLaes);
  ok('Milano åben trailer-advarsel', m.msg.some(x => /Chassis er åben/.test(x.t)));

  // ---- Budapest lastbil, Euro 3 (regnet i hånden) ----
  const b = T.beregn(ex[1]);
  ok('Budapest 9 læs', b.laes === 9, b.laes);
  ok('Budapest kilometerpris 9.868,50', b.km === 9868.5, b.km);
  ok('Budapest olietillæg 1.578,96', b.olieKr === 1578.96, b.olieKr);
  ok('Budapest Maut 618,55 (0,89 × 695)', b.maut === 618.55, b.maut);
  ok('Budapest pris pr. tur 12.066,01', b.tur === 12066.01, b.tur);
  ok('Budapest samlet 108.594,09', b.total === 108594.09, b.total);

  // ---- Budapest Euro 4 ----
  const e4 = Object.assign({}, ex[1], { euro: 4, mautSats: T.mautSatsFor(4, 5), tilgaengelig: 18 });
  const b4 = T.beregn(e4);
  ok('Euro 4 Maut-sats 0,74', T.mautSatsFor(4, 5) === 0.74);
  ok('Euro 4 samlet 107.655,84', b4.total === 107655.84, b4.total);
  ok('Euro 4: 9 læs mod 18 trækkere er ok', !b4.msg.some(x => x.n === 'fejl'));

  // ---- Container og pram ----
  const c = T.beregn(ex[2]);
  ok('Container 10 stk.', c.laes === 10, c.laes);
  ok('Container samlet 116.000', c.total === 116000, c.total);
  ok('Container sidste fremme dag 43', c.ankomst === 43, c.ankomst);
  ok('Container for sent (frist 35)', c.fristOk === false);
  ok('Container højst 152,4 t inden frist', c.maxTon === 152.4, c.maxTon);
  const c2 = T.beregn(Object.assign({}, ex[2], { prAfgang: 2 }));
  ok('2 containere pr. afgang når frem dag 33', c2.ankomst === 33 && c2.fristOk === true, c2.ankomst);

  // ---- kanttilfælde ----
  const tung = T.beregn(Object.assign({}, ex[0], { traekEgen: 30, trailEgen: 15 }));
  ok('Ingen nyttelast giver fejl, ikke uendeligt læs', tung.fejl && tung.laes === null);
  const over = T.beregn(Object.assign({}, ex[0], { graense: 44 }));
  ok('44 t på 5 aksler giver fejl', over.msg.some(x => x.n === 'fejl' && /44/.test(x.t)));
  const stor = T.beregn(Object.assign({}, ex[0], { pladeL: 15 }));
  ok('Plade på 15 m passer ikke', stor.msg.some(x => x.n === 'fejl' && /passer ikke/.test(x.t)));
  const faa = T.beregn(Object.assign({}, ex[0], { tilgaengelig: 3 }));
  ok('For få trækkere giver fejl', faa.msg.some(x => x.n === 'fejl' && /kun 3/.test(x.t)));
  const nul = T.beregn(Object.assign({}, ex[0], { tonnage: 0 }));
  ok('0 ton giver fejl', nul.fejl);
  const ek = T.beregn(Object.assign({}, ex[0], { ekstra: 0.5 }));
  ok('0,5 t ekstra vægt pr. læs giver 5 læs', ek.laes === 5, ek.laes);

  // ---- dårlige input (fundet af uafhængig tester) ----
  const neg = T.beregn(Object.assign({}, ex[0], { kmPris: -3 }));
  ok('Negativ kilometerpris afvises, ingen pris', neg.fejl && neg.total === null);
  const negT = T.beregn(Object.assign({}, ex[0], { traekEgen: -3 }));
  ok('Negativ trækker-egenvægt afvises', negT.fejl && negT.laes === null);
  const tomPris = T.beregn(Object.assign({}, ex[0], { kmPris: 0 }));
  ok('Kilometerpris 0 afvises', tomPris.fejl && tomPris.total === null);
  const tomEgen = T.beregn(Object.assign({}, ex[0], { trailEgen: 0 }));
  ok('Trailer-egenvægt 0 afvises', tomEgen.fejl);
  const enorm = T.beregn(Object.assign({}, ex[0], { tonnage: 1e99 }));
  ok('Enormt tal giver fejl uden e+97-tal', enorm.fejl && enorm.laes === null);
  const i0 = T.beregn(Object.assign({}, ex[2], { intervalDage: 0 }));
  ok('Afgang hver 0 dage afvises', i0.fejl && i0.total === null);
  const kn = T.beregn(Object.assign({}, ex[2], { klarDage: -4 }));
  ok('Klar efter -4 dage afvises', kn.fejl && kn.total === null);
  const pa = T.beregn(Object.assign({}, ex[2], { prAfgang: 1.5 }));
  ok('1,5 containere pr. afgang afvises', pa.fejl && pa.total === null);
  const pa0 = T.beregn(Object.assign({}, ex[2], { prAfgang: 0 }));
  ok('0 containere pr. afgang afvises uden pris', pa0.fejl && pa0.total === null);
  ok('parse 7,4,4 er ikke et tal', T.parseTal('7,4,4') === 0 && T.erTal('7,4,4') === false);
  ok('erTal 7,4 og tom er ok', T.erTal('7,4') && T.erTal(''));

  // ---- tal-læsning ----
  ok('parse 7,4', T.parseTal('7,4') === 7.4);
  ok('parse 7.4', T.parseTal('7.4') === 7.4);
  ok('parse 1.452', T.parseTal('1.452') === 1452);
  ok('parse 1.452,50', T.parseTal('1.452,50') === 1452.5);
  ok('parse tom', T.parseTal('') === 0);
  ok('parse rod', T.parseTal('abc') === 0);

  // ---- SIDEN: klik og skriv ----
  const cards = d.querySelectorAll('.card');
  ok('3 kort ved start', cards.length === 3, cards.length);
  ok('Milano vises på siden med 49.855,88', /49\.855,88/.test(cards[0].textContent));
  ok('Sammenligning viser alle tre', d.querySelectorAll('#cmp tbody tr').length === 3);
  ok('Billigst uden fejl er markeret', d.querySelectorAll('#cmp td.best').length === 1);
  ok('Antagelser står på siden', d.querySelectorAll('#ant li').length >= 8);
  ok('Mellemregninger står på siden', cards[0].querySelectorAll('.steps tr').length >= 8);

  function skriv(el, v) { el.value = v; el.dispatchEvent(new w.Event('input', { bubbles: true })); }
  skriv(d.querySelector('#f0-tonnage'), '120');
  ok('Skift tonnage til 120 → 5 læs på siden', /5\s*\n?\s*læs/.test(d.querySelector('.card').textContent) ||
     d.querySelector('.card .big .n').textContent.trim() === '5', d.querySelector('.card .big .n').textContent);
  skriv(d.querySelector('#f0-kmPris'), '8,5');
  ok('Skift kilometerpris med komma virker', /12\.365|12\.[0-9]{3},/.test(d.querySelector('.card').textContent) && T.parseTal('8,5') === 8.5);
  const gem = w.localStorage.getItem('turberegner.v2');
  ok('Ændringer gemmes', gem && JSON.parse(gem)[0].tonnage === 120);

  // vælg Euro 4 på kort 2 → Maut-sats skifter, uden at ændre kode
  const sel = d.querySelector('#f1-euro');
  sel.value = '4'; sel.dispatchEvent(new w.Event('change', { bubbles: true }));
  const sats = d.querySelector('#f1-mautSats').value;
  ok('Euro 4 sætter Maut-sats til 0,74 på siden', sats === '0,74', sats);
  ok('Euro 4 sætter trækkere til 18', d.querySelector('#f1-tilgaengelig').value === '18');

  // vælg gardintrailer 2 aksler → 4 aksler → 36 t
  const tt = d.querySelector('#f1-trailerType');
  tt.value = 'gardin2'; tt.dispatchEvent(new w.Event('change', { bubbles: true }));
  ok('Trailer med 2 aksler giver 36 t', d.querySelector('#f1-graense').value === '36', d.querySelector('#f1-graense').value);
  ok('… og trailerens egenvægt 6,2', d.querySelector('#f1-trailEgen').value === '6,2');

  // ny rute og slet
  d.getElementById('add-lastbil').click();
  ok('Ny rute giver 4 kort', d.querySelectorAll('.card').length === 4);
  d.querySelectorAll('.card')[3].querySelector('[data-act="slet"]').click();
  ok('Slet giver 3 kort', d.querySelectorAll('.card').length === 3);
  d.getElementById('add-container').click();
  ok('Ny container-rute virker', d.querySelectorAll('.card').length === 4 && /containere/.test(d.querySelectorAll('.card')[3].textContent));

  // nulstil
  d.getElementById('reset').click();
  ok('Nulstil giver 3 kort og Milano igen', d.querySelectorAll('.card').length === 3 && /49\.855,88/.test(d.querySelector('.card').textContent));


  // ---- NY SIDE: faner, kort-data og konklusion ----
  {
    const dom2 = await JSDOM.fromFile(path.join(__dirname, 'index.html'), { runScripts: 'dangerously', url: 'file:///' + path.join(__dirname, 'index.html').split(String.fromCharCode(92)).join('/'), pretendToBeVisual: true, resources: 'usable' });
    await new Promise(r => setTimeout(r, 400));
    const w2 = dom2.window, d2 = w2.document, UI = w2.TurberegnerUI;
    ok('UI-objektet findes', !!UI);
    ok('rutedata er indlæst med Milano og Budapest', !!(w2.RUTEDATA && w2.RUTEDATA.ruter.milano && w2.RUTEDATA.ruter.budapest));
    ok('Milano-ruten har en rigtig linje (over 100 punkter)', w2.RUTEDATA.ruter.milano.linje.length > 100);
    ok('rutepanel viser 2 ruter', d2.querySelectorAll('#rutepanel .rute').length === 2, d2.querySelectorAll('#rutepanel .rute').length);
    ok('rutepanel viser kort-km og case-km', /1\.456 km/.test(d2.getElementById('rutepanel').textContent) && /1\.452 km/.test(d2.getElementById('rutepanel').textContent));
    ok('kun Rute-fanen er synlig ved start', !d2.getElementById('fane-rute').hidden && d2.getElementById('fane-konklusion').hidden);
    UI.visFane('konklusion');
    ok('Konklusion-fanen vises', !d2.getElementById('fane-konklusion').hidden && d2.getElementById('fane-rute').hidden);
    const k = UI.konklusionTekst();
    ok('konklusion: Milano 4 læs og 49.855,88', /Det giver 4 vogntog/.test(k) && /49\.855,88/.test(k));
    ok('konklusion: anbefaler 5 vogntog og 62.319,85 til Milano', /Anbefaling: regn med 5 vogntog og 62\.319,85/.test(k), k.slice(0, 400));
    ok('konklusion: anbefaler Budapest lastbil', /Anbefaling: Budapest, lastbil/.test(k));
    ok('konklusion: Euro 4 sparer 938,25 kr', /938,25/.test(k));
    ok('konklusion: nævner 18 af 258', /18 Euro 4-trækkere af 258/.test(k));
    ok('konklusion: stuvning 3 stakke Milano og 2 stakke Budapest', /3 stakke/.test(k) && /2 stakke/.test(k));
    ok('konklusion: uden "Jeg"', !/\bJeg\b/.test(k));
    // konklusionen følger tallene
    const kort2 = d2.querySelector('#f1-tonnage'); kort2.value = '100'; kort2.dispatchEvent(new w2.Event('input', { bubbles: true }));
    ok('konklusion opdaterer når tal ændres (100 t Budapest giver 4 vogntog)', /Godset er 100,00 ton/.test(UI.konklusionTekst()) && /Det giver 4 vogntog/.test(UI.konklusionTekst().split('Budapest, lastbil')[1] || ''));
    ok('sammenlign-stolper findes', d2.querySelectorAll('#bars .barrow').length === 3);
    ok('euro-tabel viser -80 % partikler', /−80 %/.test(d2.getElementById('euro').textContent));
    ok('ordbog og antagelser findes', d2.querySelectorAll('#ant li').length >= 8);
  }

  console.log(fejl ? '\n' + fejl + ' FEJL' : '\nAlle tests bestået');
  process.exit(fejl ? 1 : 0);
})();
