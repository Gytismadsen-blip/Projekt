/* ================= TRANSPORT ================= */
function calcFreight() {
  const cost = num('fr-cost'), units = num('fr-units'), km = num('fr-km');
  if (!cost || !units) return alert('Udfyld omkostning og antal enheder.');
  const perUnit = cost / units;
  const perKm = km ? cost / km : 0;
  renderResult('fr-result', [
    { label: 'Pris pr. enhed', value: fmt(perUnit, 2) + ' kr' },
    { label: 'Pris pr. km', value: km ? fmt(perKm, 2) + ' kr' : '–' }
  ], `Hver enhed koster ${fmt(perUnit, 2)} kr i fragt. Brug dette til at sammenligne forskellige transportformer, ruter eller udbydere på tværs af samme enhed.`);
}

const TRAILER_PRESETS = {
  box: { l: 13.6, w: 2.48, h: 2.7, tare: 14500, maxweight: 44000, note: 'Standard gardin-/boxtrailer — almindeligt stykgods på paller.' },
  tank: { l: 13.6, w: 2.5, h: 2.6, tare: 17000, maxweight: 44000, note: 'Tanktrailer — angiv godsvolumen i m³ (1 m³ = 1000 liter). Højere egenvægt pga. selve tanken giver mindre nyttelast.' },
  reefer: { l: 13.4, w: 2.4, h: 2.5, tare: 15500, maxweight: 44000, note: 'Køletrailer — isolerede vægge reducerer det interne lasterum lidt ift. en standardtrailer.' },
  flatbed: { l: 13.6, w: 2.48, h: 2.8, tare: 12500, maxweight: 44000, note: 'Ladtrailer/flatbed — lavere egenvægt end en boxtrailer, ofte brugt til langt/tungt gods uden krav om overdækning.' },
  container40: { l: 12.19, w: 2.44, h: 2.59, tare: 16000, maxweight: 44000, note: '40 fods containerchassis — dimensioner følger selve 40 fods containeren.' }
};

function applyTrailerPreset() {
  const type = document.getElementById('tr-type').value;
  const p = TRAILER_PRESETS[type];
  if (!p) return;
  document.getElementById('tr-l').value = p.l;
  document.getElementById('tr-w').value = p.w;
  document.getElementById('tr-h').value = p.h;
  document.getElementById('tr-tare').value = p.tare;
  document.getElementById('tr-maxweight').value = p.maxweight;
}

function calcTruck() {
  const maxW = num('tr-maxweight'), tare = num('tr-tare'), cargo = num('tr-cargo');
  const l = num('tr-l'), w = num('tr-w'), h = num('tr-h'), cargoVol = num('tr-cargovol');
  const availWeight = maxW - tare;
  const weightLeft = availWeight - cargo;
  const weightUtil = (cargo / availWeight) * 100;
  const trailerVol = l * w * h;
  const volUtil = trailerVol ? (cargoVol / trailerVol) * 100 : 0;
  const overloaded = weightLeft < 0;

  renderResult('tr-result', [
    { label: 'Ledig lasteevne (vægt)', value: fmt(availWeight) + ' kg' },
    { label: 'Restkapacitet', value: fmt(weightLeft) + ' kg', class: overloaded ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Vægtudnyttelse', value: fmt(weightUtil, 1) + '%' },
    { label: 'Trailervolumen', value: fmt(trailerVol, 1) + ' m³' },
    { label: 'Volumenudnyttelse', value: fmt(volUtil, 1) + '%' }
  ], (overloaded
    ? `⚠️ Overlæs! Godset vejer ${fmt(Math.abs(weightLeft))} kg for meget i forhold til den tilladte totalvægt. Det er ulovligt at køre med og skal enten fordeles på flere ture eller et tungere køretøj.`
    : `Der er ${fmt(weightLeft)} kg vægtkapacitet tilbage (${fmt(100 - weightUtil, 1)}% ledig). ${volUtil > weightUtil ? 'Traileren løber tør for plads (volumen), før den løber tør for vægt — typisk for "lette, store" varer.' : 'Traileren løber tør for vægt før plads — typisk for "tunge, kompakte" varer.'}`
  ) + ' ' + (TRAILER_PRESETS[document.getElementById('tr-type').value]?.note || ''));
}

let cogChart = null, cogRowCount = 0;
function addCogRow(name, x, y, w) {
  cogRowCount++;
  const row = document.createElement('div');
  row.className = 'flex items-center gap-1.5 cog-row';
  row.innerHTML = `
    <input type="text" placeholder="Navn" value="${escapeHTML(name || 'Kunde ' + cogRowCount)}" class="cog-name flex-1 !mt-0" />
    <input type="number" placeholder="X" value="${x ?? ''}" class="cog-x w-20 !mt-0" />
    <input type="number" placeholder="Y" value="${y ?? ''}" class="cog-y w-20 !mt-0" />
    <input type="number" placeholder="Vægt" value="${w ?? ''}" class="cog-w w-20 !mt-0" />
    <button class="cog-remove text-slate-400 hover:text-red-500 flex-shrink-0"><i data-lucide="x" class="w-4 h-4"></i></button>`;
  row.querySelector('.cog-remove').addEventListener('click', () => row.remove());
  document.getElementById('cog-rows').appendChild(row);
  if (window.lucide) lucide.createIcons();
}

function calcCOG() {
  const rows = Array.from(document.querySelectorAll('.cog-row')).map(row => ({
    name: row.querySelector('.cog-name').value || 'Lokation',
    x: parseFloat(row.querySelector('.cog-x').value) || 0,
    y: parseFloat(row.querySelector('.cog-y').value) || 0,
    w: parseFloat(row.querySelector('.cog-w').value) || 0
  })).filter(r => r.w > 0);

  if (rows.length < 2) return alert('Tilføj mindst 2 lokationer med vægt/efterspørgsel.');

  const totalW = rows.reduce((s, r) => s + r.w, 0);
  const x = rows.reduce((s, r) => s + r.x * r.w, 0) / totalW;
  const y = rows.reduce((s, r) => s + r.y * r.w, 0) / totalW;

  renderResult('cog-result', [
    { label: 'Optimal X-koordinat', value: fmt(x, 1) },
    { label: 'Optimal Y-koordinat', value: fmt(y, 1) }
  ], `Det vægtede tyngdepunkt af dine ${rows.length} lokationer ligger ved (${fmt(x, 1)}, ${fmt(y, 1)}). Et lager placeret her minimerer den samlede vægtede transportafstand til alle kunder — jo tungere efterspørgsel en lokation har, jo mere "trækker" den tyngdepunktet mod sig.`);

  if (cogChart) cogChart.destroy();
  cogChart = new Chart(document.getElementById('cog-chart'), {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Kundelokationer', data: rows.map(r => ({ x: r.x, y: r.y })), backgroundColor: '#94a3b8', pointRadius: rows.map(r => 4 + Math.sqrt(r.w) / 3) },
        { label: 'Optimal placering', data: [{ x, y }], backgroundColor: '#2563eb', pointRadius: 8, pointStyle: 'rectRot' }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 }, color: chartTextColor() } } },
      scales: {
        x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } },
        y: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } }
      }
    }
  });
}

/* ================= RUTE, AFSTAND & CHAUFFØRTID ================= */
async function geocode(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('geocode failed');
  const data = await res.json();
  if (!data.length) throw new Error('not found');
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name };
}

async function calcRoute() {
  const fromQ = document.getElementById('route-from').value.trim();
  const toQ = document.getElementById('route-to').value.trim();
  const vehicleFactor = parseFloat(document.getElementById('route-vehicle').value);
  const box = document.getElementById('route-result');
  if (!fromQ || !toQ) return alert('Udfyld begge byer.');

  box.classList.remove('hidden');
  box.innerHTML = '<p class="explain flex items-center gap-2"><span class="animate-spin inline-block w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"></span> Henter rute...</p>';

  try {
    const [from, to] = await Promise.all([geocode(fromQ), geocode(toQ)]);
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('route failed');
    const data = await res.json();
    if (!data.routes || !data.routes.length) throw new Error('no route');

    const km = data.routes[0].distance / 1000;
    const carHours = data.routes[0].duration / 3600;
    const truckHours = carHours * vehicleFactor;
    const hh = Math.floor(truckHours), mm = Math.round((truckHours - hh) * 60);

    renderResult('route-result', [
      { label: 'Afstand', value: fmt(km, 0) + ' km' },
      { label: 'Anslået køretid', value: `${hh} t ${mm} min` },
      { label: 'Gns. hastighed', value: fmt(km / truckHours, 0) + ' km/t' }
    ], `Rute fra ${escapeHTML(fromQ)} til ${escapeHTML(toQ)}: ca. ${fmt(km, 0)} km og ${hh} t ${mm} min køretid (uden pauser). Tallet er sat ned til realistisk lastbilhastighed. Brug "Chaufførens Køre- & Hviletid" herunder til at lægge et vejledende estimat af kørepauser oveni.`);

    const dhInput = document.getElementById('dh-hours');
    dhInput.value = truckHours.toFixed(1);
  } catch (e) {
    box.innerHTML = `<div class="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 explain text-red-600 dark:text-red-400">Kunne ikke hente rute lige nu (gratis kort-tjeneste kan være midlertidigt optaget). Prøv igen om lidt, eller tjek at bynavnene er stavet korrekt.</div>`;
  }
}

function calcDriverHours() {
  const totalHours = num('dh-hours'), maxDaily = num('dh-maxday') || 9;
  if (!totalHours) return alert('Indtast køretid.');

  let remaining = totalHours, days = 0, totalBreakMin = 0;
  while (remaining > 0) {
    days++;
    const dayDrive = Math.min(remaining, maxDaily);
    const breaksToday = Math.floor(dayDrive / 4.5);
    totalBreakMin += breaksToday * 45;
    remaining -= dayDrive;
  }
  const nights = Math.max(days - 1, 0);
  const totalTripHours = totalHours + totalBreakMin / 60;

  renderResult('dh-result', [
    { label: 'Antal køredage', value: days },
    { label: 'Lovpligtige pauser (45 min)', value: Math.round(totalBreakMin / 45) },
    { label: 'Samlet pausetid', value: fmt(totalBreakMin) + ' min' },
    { label: 'Rejsetid inkl. pauser', value: fmt(totalTripHours, 1) + ' t' },
    { label: 'Overnatninger (min. 11 t hvile)', value: nights }
  ], days > 1
    ? `Turen kan ikke køres på én dag inden for reglerne. Der skal ${nights} overnatning(er) med mindst 11 timers sammenhængende hviletid, samt ${Math.round(totalBreakMin / 45)} pauser af 45 minutter undervejs (efter hver 4½ times kørsel).`
    : `Turen kan gennemføres på én dag. Der skal dog holdes ${Math.round(totalBreakMin / 45)} pause(r) af 45 minutter efter hver 4½ times sammenhængende kørsel — reglerne gælder, uanset hvor kort eller lang turen er.`);
}

/* ================= PRODUKTION ================= */
function calcCap() {
  const actual = num('cap-actual'), max = num('cap-max');
  if (!max) return alert('Maks. kapacitet skal være over 0.');
  const v = (actual / max) * 100;
  const text = bucket(v, [70, 95], [
    'Lav udnyttelse — der er ledig kapacitet, som enten kan bruges til at tage flere ordrer ind, eller som koster penge at have stående ubrugt.',
    'Sund udnyttelse med lidt buffer til udsving i efterspørgslen.',
    'Meget høj udnyttelse — tæt på fuld kapacitet. Godt for effektiviteten, men giver lidt albuerum ved uforudsete stigninger i efterspørgslen eller nedbrud.'
  ]);
  renderResult('cap-result', [{ label: 'Kapacitetsudnyttelse', value: fmt(v, 1) + '%' }], text);
}

function calcLT() {
  const wip = num('lt-wip'), rate = num('lt-rate');
  if (!rate) return alert('Gennemløbsrate skal være over 0.');
  const time = wip / rate;
  renderResult('lt-result', [{ label: 'Gennemløbstid', value: fmt(time, 1) + ' timer' }],
    `I gennemsnit bruger en enhed ${fmt(time, 1)} timer i systemet fra start til slut. Ifølge Little's Law kan gennemløbstiden kun reduceres ved enten at sænke antallet af enheder i proces (WIP) eller øge gennemløbsraten.`);
}

