'use strict';
var assert = require('assert');
var cp = require('child_process');
var Casefil = require('./casefil.js');

var DOCX = 'C:\\Users\\Gytis\\Desktop\\Claude 2\\3. semester\\3 semester Distribution\\19.8.2026 Landevejstransport\\Road Topstans.docx';
var xml = cp.execFileSync('unzip', ['-p', DOCX, 'word/document.xml'], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
var tekst = Casefil._docxXmlTilTekst(xml);
var r = Casefil.find(tekst);
if (process.argv.indexOf('--json') > -1) { console.log(JSON.stringify({ ordrer: r.ordrer, flaade: r.flaade, maut: r.maut, emission: r.emission }, null, 1)); }
if (process.argv.indexOf('--fund') > -1) { r.fund.forEach(function (f) { console.log(f.felt, '|', f.vaerdi, f.enhed, f.sikker ? '' : '(usikker)', '|', f.udsnit); }); }

var ok = 0, fejl = 0;
function test(navn, fn) {
  try { fn(); ok++; console.log('OK   ' + navn); }
  catch (e) { fejl++; console.log('FEJL ' + navn + ': ' + e.message); }
}
function ordre(type, by) {
  return r.ordrer.filter(function (o) { return o.type === type && o.navn.indexOf(by) > -1; })[0];
}

test('Milano lastbil', function () {
  var o = ordre('lastbil', 'Milano'); assert.ok(o, 'ordre findes');
  assert.strictEqual(o.tonnage, 110); assert.strictEqual(o.pladeVaegt, 120);
  assert.strictEqual(o.pladeB, 2); assert.strictEqual(o.pladeL, 4);
  assert.strictEqual(o.afstand, 1452); assert.strictEqual(o.kmPris, 7.4); assert.strictEqual(o.olie, 16);
  assert.strictEqual(o.klarDage, 2); assert.strictEqual(o.leveringDage, 3);
  assert.ok(o.kilde.tonnage.indexOf('110') > -1);
});
test('Budapest lastbil', function () {
  var o = ordre('lastbil', 'Budapest'); assert.ok(o, 'ordre findes');
  assert.strictEqual(o.tonnage, 230); assert.strictEqual(o.pladeVaegt, 320);
  assert.strictEqual(o.pladeB, 2); assert.strictEqual(o.pladeL, 5);
  assert.strictEqual(o.afstand, 1462); assert.strictEqual(o.kmPris, 6.75); assert.strictEqual(o.olie, 16);
  assert.strictEqual(o.mautKm, 695); assert.strictEqual(o.klarDage, 4); assert.strictEqual(o.leveringDage, 35);
});
test('Budapest container', function () {
  var o = ordre('container', 'Budapest'); assert.ok(o, 'ordre findes');
  assert.strictEqual(o.tonnage, 230); assert.strictEqual(o.contNyttelast, 25.4); assert.strictEqual(o.contPris, 11600);
  assert.strictEqual(o.transitDage, 21); assert.strictEqual(o.intervalDage, 2);
  assert.strictEqual(o.klarDage, 4); assert.strictEqual(o.fristDage, 35);
});
test('Kun 3 ordrer', function () { assert.strictEqual(r.ordrer.length, 3); });
test('Flaade', function () {
  var f = r.flaade;
  assert.strictEqual(f.traekEgen, 7.4); assert.strictEqual(f.graense4, 36); assert.strictEqual(f.graense5, 40);
  assert.deepStrictEqual(f.euroTraekkere, { 2: 48, 3: 192, 4: 18 });
  assert.strictEqual(f.trailere.chassis3.egen, 5.1);
});
test('Trailere ekstra', function () {
  var t = r.flaade.trailere;
  assert.strictEqual(t.gardin2.egen, 6.2); assert.strictEqual(t.gardin3.egen, 6.8);
  assert.strictEqual(t.boks2.egen, 7.8); assert.strictEqual(t.boks3.egen, 8.6);
  assert.strictEqual(t.koel2.egen, 8.2); assert.strictEqual(t.koel3.egen, 8.8);
  assert.strictEqual(t.chassis3.antal, 120); assert.strictEqual(t.gardin3.antal, 90);
});
test('Maut', function () {
  assert.strictEqual(r.maut['2-3'].lang, 0.89); assert.strictEqual(r.maut['4-5'].lang, 0.74);
  assert.strictEqual(r.maut['2-3'].kort, 0.82); assert.strictEqual(r.maut['4-5'].kort, 0.67);
  assert.strictEqual(r.maut['0-1'].lang, 1.04);
});
test('Fund har udsnit', function () {
  assert.ok(r.fund.length > 30);
  r.fund.forEach(function (f) { assert.ok(f.felt && f.label && f.vaerdi !== undefined && typeof f.sikker === 'boolean'); });
  var med = r.fund.filter(function (f) { return f.udsnit && f.udsnit.length > 5; });
  assert.ok(med.length > r.fund.length * 0.9);
});
test('Tom tekst', function () {
  [Casefil.find(''), Casefil.find('tilfældig tekst uden tal'), Casefil.find(undefined)].forEach(function (x) {
    assert.deepStrictEqual(x.ordrer, []); assert.deepStrictEqual(x.fund, []);
    assert.deepStrictEqual(x.maut, {}); assert.deepStrictEqual(x.flaade, {});
  });
});
test('Dansk mini-case', function () {
  var x = Casefil.find('Ordren er 50 ton. Afstanden er 800 km og prisen er 8,50 kr pr. km plus 12 % olietillæg.');
  var o = x.ordrer[0]; assert.ok(o);
  assert.strictEqual(o.tonnage, 50); assert.strictEqual(o.afstand, 800); assert.strictEqual(o.kmPris, 8.5); assert.strictEqual(o.olie, 12);
});
test('Ukendt filtype afvises', function () {
  return Casefil.laes({ name: 'x.xlsx' }).then(function () { throw new Error('skulle afvise'); }, function (e) {
    assert.strictEqual(e.message, 'Filtypen understøttes ikke. Brug Word, PDF eller tekst.');
  });
});

setTimeout(function () {
  console.log('\n' + ok + ' ok, ' + fejl + ' fejl');
  process.exit(fejl ? 1 : 0);
}, 100);
