/* ---------------- INIT ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(localStorage.getItem('regnemaskine_theme') || 'light');
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('regnemaskine_theme', next);
    applyTheme(next);
  });

  document.querySelectorAll('.cat-btn').forEach(btn => btn.addEventListener('click', () => setCategory(btn.dataset.cat)));
  setCategory(localStorage.getItem('regnemaskine_cat') || 'lager');
  initSearch();

  // Lager & Indkøb
  document.getElementById('eoq-btn').addEventListener('click', calcEOQ);
  document.getElementById('poq-btn').addEventListener('click', calcPOQ);
  document.getElementById('rop-btn').addEventListener('click', calcROP);
  document.getElementById('turn-btn').addEventListener('click', calcTurnover);
  document.getElementById('tco-btn').addEventListener('click', calcTCO);

  // Transport
  document.getElementById('fr-btn').addEventListener('click', calcFreight);
  document.getElementById('tr-btn').addEventListener('click', calcTruck);
  document.getElementById('tr-type').addEventListener('change', applyTrailerPreset);
  document.getElementById('route-btn').addEventListener('click', calcRoute);
  document.getElementById('dh-btn').addEventListener('click', calcDriverHours);
  document.getElementById('cog-add-btn').addEventListener('click', () => addCogRow());
  document.getElementById('cog-btn').addEventListener('click', calcCOG);
  addCogRow('København', 0, 0, 400);
  addCogRow('Aarhus', -50, 120, 250);
  addCogRow('Odense', -20, 40, 180);

  // Økonomi & Nøgletal
  document.getElementById('lg1-btn').addEventListener('click', calcLG1);
  document.getElementById('lg2-btn').addEventListener('click', calcLG2);
  document.getElementById('sol-btn').addEventListener('click', calcSol);
  document.getElementById('roe-btn').addEventListener('click', calcROE);
  document.getElementById('roa-btn').addEventListener('click', calcROA);
  document.getElementById('og-btn').addEventListener('click', calcOG);
  document.getElementById('at-btn').addEventListener('click', calcAT);
  document.getElementById('be-btn').addEventListener('click', calcBE);
  document.getElementById('db-btn').addEventListener('click', calcDB);

  // Budget & Løn
  document.getElementById('rb-btn').addEventListener('click', calcRB);
  document.getElementById('cb-btn').addEventListener('click', calcCB);
  document.getElementById('lon-btn').addEventListener('click', calcLon);

  // Produktion
  document.getElementById('cap-btn').addEventListener('click', calcCap);
  document.getElementById('lt-btn').addEventListener('click', calcLT);

  // Statistik & Sandsynlighed
  document.getElementById('stat-btn').addEventListener('click', calcStats);
  document.getElementById('sd-btn').addEventListener('click', calcSD);
  document.getElementById('nd-btn').addEventListener('click', calcND);
  document.getElementById('sd-transfer-btn').addEventListener('click', transferStdDevToROP);

  // PDF & Excel export
  const eoqInputs = [
    { id: 'eoq-d', label: 'Årsforbrug D (stk)' },
    { id: 'eoq-s', label: 'Ordreomk. S (kr)' },
    { id: 'eoq-h', label: 'Lageromk./stk H (kr)' }
  ];
  const tcoInputs = [
    { id: 'tco-price', label: 'Indkøbspris (kr)' },
    { id: 'tco-freight', label: 'Transport & told (kr)' },
    { id: 'tco-hold', label: 'Lager & håndtering (kr)' },
    { id: 'tco-qual', label: 'Kvalitet & spild (kr)' }
  ];
  const rbInputs = [
    { id: 'rb-oms', label: 'Forventet omsætning (kr)' },
    { id: 'rb-varpct', label: 'Variable omkostninger (% af omsætning)' },
    { id: 'rb-fixed', label: 'Faste omkostninger (kr)' }
  ];
  const beInputs = [
    { id: 'be-fixed', label: 'Faste omkostninger pr. år (kr)' },
    { id: 'be-price', label: 'Salgspris pr. enhed (kr)' },
    { id: 'be-var', label: 'Variabel omkostning pr. enhed (kr)' }
  ];

  document.getElementById('eoq-pdf-btn').addEventListener('click', () => exportPDF('EOQ — Optimal ordrestørrelse (Wilson-modellen)', eoqInputs, 'eoq-result', 'eoq-chart'));
  document.getElementById('eoq-xlsx-btn').addEventListener('click', () => exportExcel('EOQ — Optimal ordrestørrelse', eoqInputs, 'eoq-result', 'EOQ_Wilson_Rapport.xlsx', 'eoq-chart', lastEOQData ? [
    { formula: (inp) => `SQRT(2*${inp[0]}*${inp[1]}/${inp[2]})`, numericValue: lastEOQData.q, numFmt: '0.0" stk"' },
    { formula: (inp, res) => `${inp[0]}/${res[0]}`, numericValue: lastEOQData.ordersPerYear, numFmt: '0.0' },
    { formula: (inp, res) => `(${inp[0]}/${res[0]})*${inp[1]}+(${res[0]}/2)*${inp[2]}`, numericValue: lastEOQData.total, numFmt: '#,##0" kr"' }
  ] : null));

  document.getElementById('tco-pdf-btn').addEventListener('click', () => exportPDF('TCO — Total Cost of Ownership', tcoInputs, 'tco-result'));
  document.getElementById('tco-xlsx-btn').addEventListener('click', () => {
    const price = parseFloat(document.getElementById('tco-price').value) || 0;
    const freight = parseFloat(document.getElementById('tco-freight').value) || 0;
    const hold = parseFloat(document.getElementById('tco-hold').value) || 0;
    const qual = parseFloat(document.getElementById('tco-qual').value) || 0;
    const total = price + freight + hold + qual;
    const extraPct = price ? ((total - price) / price) * 100 : 0;
    exportExcel('TCO — Total Cost of Ownership', tcoInputs, 'tco-result', 'TCO_Rapport.xlsx', null, [
      { formula: (inp) => `${inp[0]}`, numericValue: price, numFmt: '#,##0" kr"' },
      { formula: (inp) => `${inp[0]}+${inp[1]}+${inp[2]}+${inp[3]}`, numericValue: total, numFmt: '#,##0" kr"' },
      { formula: (inp, res) => `((${res[1]}-${inp[0]})/${inp[0]})*100`, numericValue: extraPct, numFmt: '+0.0"%"' }
    ]);
  });

  document.getElementById('rb-pdf-btn').addEventListener('click', () => exportPDF('Resultatbudget', rbInputs, 'rb-result'));
  document.getElementById('rb-xlsx-btn').addEventListener('click', () => {
    const oms = parseFloat(document.getElementById('rb-oms').value) || 0;
    const varPct = parseFloat(document.getElementById('rb-varpct').value) || 0;
    const fixed = parseFloat(document.getElementById('rb-fixed').value) || 0;
    const db = oms - oms * (varPct / 100);
    const result = db - fixed;
    exportExcel('Resultatbudget', rbInputs, 'rb-result', 'Resultatbudget_Rapport.xlsx', null, [
      { formula: (inp) => `${inp[0]}-${inp[0]}*(${inp[1]}/100)`, numericValue: db, numFmt: '#,##0" kr"' },
      { formula: (inp, res) => `${res[0]}-${inp[2]}`, numericValue: result, numFmt: '#,##0" kr"' }
    ]);
  });

  document.getElementById('wms-pdf-btn').addEventListener('click', exportWMSReport);
  document.getElementById('wms-xlsx-btn').addEventListener('click', exportWMSExcel);

  document.getElementById('be-pdf-btn').addEventListener('click', () => exportPDF('Break-even Analyse', beInputs, 'be-result', 'be-chart'));
  document.getElementById('be-xlsx-btn').addEventListener('click', () => {
    const fixed = parseFloat(document.getElementById('be-fixed').value) || 0;
    const price = parseFloat(document.getElementById('be-price').value) || 0;
    const varc = parseFloat(document.getElementById('be-var').value) || 0;
    const dbPerUnit = price - varc;
    const beUnits = dbPerUnit ? fixed / dbPerUnit : 0;
    const beRevenue = beUnits * price;
    exportExcel('Break-even Analyse', beInputs, 'be-result', 'Break_Even_Rapport.xlsx', 'be-chart', [
      { formula: (inp) => `${inp[0]}/(${inp[1]}-${inp[2]})`, numericValue: beUnits, numFmt: '0" stk"' },
      { formula: (inp, res) => `${res[0]}*${inp[1]}`, numericValue: beRevenue, numFmt: '#,##0" kr"' },
      { formula: (inp) => `${inp[1]}-${inp[2]}`, numericValue: dbPerUnit, numFmt: '#,##0" kr"' }
    ]);
  });

  renderIncotermsGrid();
  initCaseSwitcher();
  initBackup();
  initLandingToggle();
  renderLanding();
  initScannerModal();
  injectFormulas();
  linkLabelsToInputs();
  initFavorites();
  initWMS();
  initLanguage();
  if (window.lucide) lucide.createIcons();
});
