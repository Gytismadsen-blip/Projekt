/* ---------------- MODULE REGISTRY (for master export) ---------------- */
const MODULE_REGISTRY = [
  { key: 'eoq', title: 'EOQ — Optimal ordrestørrelse (Wilson)', resultId: 'eoq-result', chartId: 'eoq-chart',
    inputs: [{ id: 'eoq-d', label: 'Årsforbrug D (stk)' }, { id: 'eoq-s', label: 'Ordreomk. S (kr)' }, { id: 'eoq-h', label: 'Lageromk./stk H (kr)' }] },
  { key: 'poq', title: 'POQ / EPQ — Optimal produktionsstørrelse', resultId: 'poq-result',
    inputs: [{ id: 'poq-d', label: 'Årsforbrug D (stk)' }, { id: 'poq-s', label: 'Omstillingsomk. S (kr)' }, { id: 'poq-h', label: 'Lageromk./stk H (kr)' }, { id: 'poq-p', label: 'Produktionsrate p (stk/år)' }] },
  { key: 'rop', title: 'Sikkerhedslager & ROP', resultId: 'rop-result',
    inputs: [{ id: 'rop-demand', label: 'Gns. dagligt forbrug' }, { id: 'rop-lt', label: 'Leveringstid (dage)' }, { id: 'rop-std', label: 'Std.afv. i forbrug' }] },
  { key: 'turn', title: 'Lageromsætningshastighed', resultId: 'turn-result',
    inputs: [{ id: 'turn-cogs', label: 'Vareforbrug/år (kr)' }, { id: 'turn-inv', label: 'Gns. lagerværdi (kr)' }] },
  { key: 'tco', title: 'TCO — Total Cost of Ownership', resultId: 'tco-result',
    inputs: [{ id: 'tco-price', label: 'Indkøbspris (kr)' }, { id: 'tco-freight', label: 'Transport & told (kr)' }, { id: 'tco-hold', label: 'Lager & håndtering (kr)' }, { id: 'tco-qual', label: 'Kvalitet & spild (kr)' }] },
  { key: 'fr', title: 'Fragtomkostning pr. enhed', resultId: 'fr-result',
    inputs: [{ id: 'fr-cost', label: 'Total fragtomk. (kr)' }, { id: 'fr-units', label: 'Antal enheder' }, { id: 'fr-km', label: 'Afstand (km)' }] },
  { key: 'tr', title: 'Estimeret lastbil- & trailerkapacitet', resultId: 'tr-result',
    inputs: [{ id: 'tr-maxweight', label: 'Tilladt totalvægt (kg)' }, { id: 'tr-tare', label: 'Egenvægt (kg)' }, { id: 'tr-cargo', label: 'Godsvægt (kg)' }] },
  { key: 'lg1', title: 'Likviditetsgrad 1', resultId: 'lg1-result',
    inputs: [{ id: 'lg1-oa', label: 'Omsætningsaktiver (kr)' }, { id: 'lg1-kg', label: 'Kortfristet gæld (kr)' }] },
  { key: 'lg2', title: 'Likviditetsgrad 2', resultId: 'lg2-result',
    inputs: [{ id: 'lg2-oa', label: 'Omsætningsaktiver (kr)' }, { id: 'lg2-lager', label: 'Varelager (kr)' }, { id: 'lg2-kg', label: 'Kortfristet gæld (kr)' }] },
  { key: 'sol', title: 'Soliditetsgrad', resultId: 'sol-result',
    inputs: [{ id: 'sol-ek', label: 'Egenkapital (kr)' }, { id: 'sol-aktiver', label: 'Aktiver i alt (kr)' }] },
  { key: 'roe', title: 'ROE — Egenkapitalforrentning', resultId: 'roe-result',
    inputs: [{ id: 'roe-res', label: 'Årets resultat (kr)' }, { id: 'roe-ek', label: 'Egenkapital (kr)' }] },
  { key: 'roa', title: 'ROA — Afkastningsgrad', resultId: 'roa-result',
    inputs: [{ id: 'roa-ebit', label: 'EBIT (kr)' }, { id: 'roa-aktiver', label: 'Aktiver i alt (kr)' }] },
  { key: 'og', title: 'Overskudsgrad', resultId: 'og-result',
    inputs: [{ id: 'og-ebit', label: 'EBIT (kr)' }, { id: 'og-oms', label: 'Omsætning (kr)' }] },
  { key: 'at', title: 'Aktivernes omsætningshastighed', resultId: 'at-result',
    inputs: [{ id: 'at-oms', label: 'Omsætning (kr)' }, { id: 'at-aktiver', label: 'Aktiver i alt (kr)' }] },
  { key: 'be', title: 'Break-even Analyse', resultId: 'be-result', chartId: 'be-chart',
    inputs: [{ id: 'be-fixed', label: 'Faste omk./år (kr)' }, { id: 'be-price', label: 'Salgspris/stk (kr)' }, { id: 'be-var', label: 'Variabel omk./stk (kr)' }] },
  { key: 'db', title: 'Dækningsbidrag', resultId: 'db-result',
    inputs: [{ id: 'db-price', label: 'Salgspris/stk (kr)' }, { id: 'db-var', label: 'Variabel omk./stk (kr)' }, { id: 'db-units', label: 'Forventet salg (stk)' }] },
  { key: 'rb', title: 'Resultatbudget', resultId: 'rb-result',
    inputs: [{ id: 'rb-oms', label: 'Forventet omsætning (kr)' }, { id: 'rb-varpct', label: 'Variable omk. (%)' }, { id: 'rb-fixed', label: 'Faste omkostninger (kr)' }] },
  { key: 'cb', title: 'Likviditetsbudget', resultId: 'cb-result',
    inputs: [{ id: 'cb-open', label: 'Primo (kr)' }, { id: 'cb-in', label: 'Indbetalinger (kr)' }, { id: 'cb-out', label: 'Udbetalinger (kr)' }] },
  { key: 'lon', title: 'Lønomkostning', resultId: 'lon-result',
    inputs: [{ id: 'lon-brutto', label: 'Bruttoløn/md. (kr)' }, { id: 'lon-ferie', label: 'Feriepenge (%)' }, { id: 'lon-pension', label: 'Pension (%)' }] },
  { key: 'cap', title: 'Kapacitetsudnyttelse', resultId: 'cap-result',
    inputs: [{ id: 'cap-actual', label: 'Faktisk output' }, { id: 'cap-max', label: 'Maks. kapacitet' }] },
  { key: 'lt', title: 'Gennemløbstid', resultId: 'lt-result',
    inputs: [{ id: 'lt-wip', label: 'WIP' }, { id: 'lt-rate', label: 'Gennemløbsrate' }] },
  { key: 'stat', title: 'Middelværdi, Median & Typetal', resultId: 'stat-result',
    inputs: [{ id: 'stat-data', label: 'Datasæt' }] },
  { key: 'sd', title: 'Standardafvigelse & Varians', resultId: 'sd-result',
    inputs: [{ id: 'sd-data', label: 'Datasæt' }] },
  { key: 'nd', title: 'Normalfordeling', resultId: 'nd-result',
    inputs: [{ id: 'nd-x', label: 'Værdi x' }, { id: 'nd-mean', label: 'Middelværdi' }, { id: 'nd-std', label: 'Std.afvigelse' }] },
  { key: 'wms', title: 'WMS — Warehouse Capacity & Flow', resultId: 'wms-result', chartId: 'wms-chart',
    inputs: [{ id: 'wmsMaxCapacity', label: 'Total kapacitet' }, { id: 'wmsCurrentStock', label: 'Nuværende beholdning' }, { id: 'wmsInbound', label: 'Inbound' }, { id: 'wmsOutbound', label: 'Outbound' }, { id: 'wmsExternalCost', label: 'Ekstern lagerleje/palle/dag' }] }
];

function getSolvedModules() {
  return MODULE_REGISTRY.filter(m => {
    const el = document.getElementById(m.resultId);
    return el && !el.classList.contains('hidden');
  });
}

/* ---------------- MASTER EXPORT (PDF / Excel / Word) ---------------- */
function exportMasterPDF() {
  const modules = getSolvedModules();
  if (!modules.length) { alert('Beregn mindst ét modul, før du eksporterer den samlede rapport.'); return; }

  const caseName = getActiveCase();
  const dateStr = new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });

  const sections = modules.map(m => {
    const resultBox = document.getElementById(m.resultId);
    let chartImg = '';
    if (m.chartId && chartInstances[m.chartId]) {
      chartImg = `<img src="${chartInstances[m.chartId].toBase64Image()}" style="max-width:100%; margin: 6px 0 12px;" />`;
    } else if (m.key === 'wms' && wmsChart) {
      chartImg = `<img src="${document.getElementById('wms-chart').toDataURL('image/png', 1.0)}" style="max-width:100%; margin: 6px 0 12px;" />`;
    }
    return `<h3>${escapeHTML(m.title)}</h3>${resultBox.innerHTML}${chartImg}`;
  }).join('<hr style="margin:18px 0; border-color:#ddd;" />');

  const printArea = document.getElementById('print-area');
  printArea.innerHTML = `
    <h1>BUSINESS MANAGEMENT REPORT — PREPARED FOR: ${escapeHTML(caseName.toUpperCase())}</h1>
    <h2>Samlet rapport — ${modules.length} løste moduler</h2>
    <p class="meta">Dato: ${dateStr} &nbsp;·&nbsp; Genereret af LogistikCalc — Logistik &amp; Økonomi</p>
    ${sections}`;

  printWhenReady();
}

function exportMasterExcel() {
  if (!window.XLSX) { alert('Excel-biblioteket kunne ikke indlæses.'); return; }
  const modules = getSolvedModules();
  if (!modules.length) { alert('Beregn mindst ét modul, før du eksporterer til Excel.'); return; }

  const caseName = getActiveCase();
  const dateStr = new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });
  const wb = XLSX.utils.book_new();

  const overview = [[caseName], ['Samlet rapport', dateStr], [], ['Løste moduler:'], ...modules.map(m => [m.title])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overview), 'Oversigt');

  modules.forEach(m => {
    const inputRows = m.inputs.map(d => {
      const el = document.getElementById(d.id);
      return [d.label, el ? (parseFloat(el.value) || el.value) : ''];
    });
    const resultRows = extractResultRows(m.resultId);
    const sheetData = [[caseName], [m.title, dateStr], [], ['Input-parametre (Redigerbare)'], ...inputRows, [], ["Beregnede resultater / KPI'er"], ...resultRows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!cols'] = [{ wch: 34 }, { wch: 16 }];
    const sheetName = m.key.slice(0, 28).replace(/[\\/?*[\]:]/g, '');
    XLSX.utils.book_append_sheet(wb, ws, sheetName || m.key);
  });

  XLSX.writeFile(wb, 'LogistikCalc_Samlet_Rapport.xlsx');
}

function exportMasterWord() {
  const modules = getSolvedModules();
  if (!modules.length) { alert('Beregn mindst ét modul, før du eksporterer Word-svararket.'); return; }

  const caseName = getActiveCase();
  const dateStr = new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });

  const body = modules.map(m => {
    const inputList = m.inputs.map(d => {
      const el = document.getElementById(d.id);
      return `<li>${escapeHTML(d.label)}: <strong>${el ? escapeHTML(el.value) : ''}</strong></li>`;
    }).join('');
    const resultRows = extractResultRows(m.resultId).map(([label, value]) => `<li>${escapeHTML(label)}: <strong>${escapeHTML(value)}</strong></li>`).join('');
    const explainEl = document.getElementById(m.resultId).querySelector('.explain');
    const advice = explainEl ? `<p><em>${escapeHTML(explainEl.textContent)}</em></p>` : '';
    return `<h2>${escapeHTML(m.title)}</h2>
      <p><strong>Input:</strong></p><ul>${inputList}</ul>
      <p><strong>Resultat:</strong></p><ul>${resultRows}</ul>
      ${advice}`;
  }).join('<hr/>');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Word-beregningsrapport</title>
    <style>
      body{font-family:Calibri,Arial,sans-serif;color:#111;} h1{font-size:20pt;} h2{font-size:14pt;color:#1d4ed8;margin-top:20px;}
      ul{margin:4px 0 12px;} li{margin-bottom:2px;} .meta{color:#555;font-size:10pt;margin-bottom:20px;}
    </style></head><body>
    <h1>Beregningsrapport</h1>
    <p class="meta">Case: ${escapeHTML(caseName)} &nbsp;|&nbsp; Dato: ${dateStr}</p>
    ${body}
    </body></html>`;

  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Svararket.doc';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

