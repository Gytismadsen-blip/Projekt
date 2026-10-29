/* ---------------- EXCEL EXPORT (SheetJS) ---------------- */
function extractResultRows(resultElId) {
  const resultBox = document.getElementById(resultElId);
  const rows = [];
  resultBox.querySelectorAll('.grid > div').forEach(div => {
    const label = div.children[0]?.textContent?.trim();
    const value = div.children[1]?.textContent?.trim();
    if (label && value) rows.push([label, value]);
  });
  return rows;
}

// resultFormulas (optional): array parallel to the result rows on-screen, one entry per row:
// { formula: (inputCells, resultCells) => 'Excel formula string using those cell refs',
//   numericValue: <cached number so Excel shows a value before recalculating>, numFmt }
// Rows without a matching entry fall back to plain extracted text (not a live formula).
function exportExcel(title, inputDefs, resultElId, filename, chartCanvasId, resultFormulas) {
  if (!window.ExcelJS) { alert('Excel-biblioteket kunne ikke indlæses. Tjek din internetforbindelse.'); return; }
  const resultBox = document.getElementById(resultElId);
  if (resultBox.classList.contains('hidden')) { alert('Beregn resultatet først, før du eksporterer til Excel.'); return; }

  const caseName = getActiveCase();
  const dateStr = new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });
  const resultRows = extractResultRows(resultElId);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Rapport');
  ws.getColumn(1).width = 38;
  ws.getColumn(2).width = 18;

  ws.getCell('A1').value = caseName;
  ws.getCell('A1').font = { bold: true };
  ws.getCell('A2').value = title;
  ws.getCell('A2').font = { bold: true, color: { argb: 'FF1D4ED8' } };
  ws.getCell('B2').value = dateStr;

  const inputStartRow = 5;
  ws.getCell(`A${inputStartRow - 1}`).value = 'Input-parametre (kan ændres)';
  ws.getCell(`A${inputStartRow - 1}`).font = { bold: true };
  const inputCells = inputDefs.map((d, i) => `B${inputStartRow + i}`);
  inputDefs.forEach((d, i) => {
    const row = inputStartRow + i;
    ws.getCell(`A${row}`).value = d.label;
    ws.getCell(`B${row}`).value = parseFloat(document.getElementById(d.id).value) || document.getElementById(d.id).value;
  });

  const resultsHeaderRow = inputStartRow + inputDefs.length + 1;
  ws.getCell(`A${resultsHeaderRow}`).value = "Beregnede resultater / KPI'er";
  ws.getCell(`A${resultsHeaderRow}`).font = { bold: true };
  const resultStartRow = resultsHeaderRow + 1;
  const resultCells = resultRows.map((_, i) => `B${resultStartRow + i}`);
  resultRows.forEach(([label, displayText], i) => {
    const row = resultStartRow + i;
    ws.getCell(`A${row}`).value = label;
    const cell = ws.getCell(`B${row}`);
    const fdef = resultFormulas && resultFormulas[i];
    if (fdef && Number.isFinite(fdef.numericValue)) {
      cell.value = { formula: fdef.formula(inputCells, resultCells), result: fdef.numericValue };
      if (fdef.numFmt) cell.numFmt = fdef.numFmt;
      cell.font = { bold: true };
    } else {
      cell.value = displayText;
      cell.font = { bold: true };
    }
  });

  let nextRow = resultStartRow + resultRows.length + 2;
  if (chartCanvasId && chartInstances[chartCanvasId]) {
    ws.getCell(`A${nextRow}`).value = 'Graf';
    ws.getCell(`A${nextRow}`).font = { bold: true };
    const imgId = wb.addImage({ base64: chartInstances[chartCanvasId].toBase64Image(), extension: 'png' });
    ws.addImage(imgId, { tl: { col: 0, row: nextRow }, ext: { width: 520, height: 280 } });
  }

  wb.xlsx.writeBuffer().then(buf => {
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }).catch(() => alert('Der opstod en fejl under generering af Excel-filen.'));
}

function exportWMSExcel() {
  if (!window.ExcelJS) { alert('Excel-biblioteket kunne ikke indlæses. Tjek din internetforbindelse.'); return; }
  if (!lastWMSData) { alert('Beregn WMS-simuleringen først, før du eksporterer til Excel.'); return; }
  const d = lastWMSData;
  const caseName = getActiveCase();
  const dateStr = new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Lager_Flow_Rapport');
  ws.getColumn(1).width = 42;
  ws.getColumn(2).width = 22;

  ws.getCell('A1').value = caseName;
  ws.getCell('A1').font = { bold: true };
  ws.getCell('A2').value = 'Dynamic Warehouse Capacity & Flow Simulator (WMS)';
  ws.getCell('A2').font = { bold: true, color: { argb: 'FF1D4ED8' } };
  ws.getCell('B2').value = dateStr;

  ws.getCell('A4').value = 'Input-parametre (kan ændres)';
  ws.getCell('A4').font = { bold: true };
  const inputs = [
    ['Total lagerkapacitet (pallepladser)', d.max],
    ['Nuværende lagerbeholdning', d.current],
    ['Inbound denne uge', d.inbound],
    ['Outbound denne uge', d.outbound],
    ['Estimeret ekstern lagerleje pr. palle/dag (DKK)', d.externalCost]
  ];
  inputs.forEach((row, i) => {
    ws.getCell(`A${5 + i}`).value = row[0];
    ws.getCell(`B${5 + i}`).value = row[1];
  });
  // B5=max, B6=current, B7=inbound, B8=outbound, B9=externalCost

  const resultsHeaderRow = 11;
  ws.getCell(`A${resultsHeaderRow}`).value = "Beregnede resultater / KPI'er";
  ws.getCell(`A${resultsHeaderRow}`).font = { bold: true };

  const results = [
    ['Nuværende udnyttelse (%)', { formula: 'B6/B5*100', result: d.nowPct }, '0.0"%"'],
    ['Netto-flow (paller)', { formula: 'B7-B8', result: d.netFlow }, '+0" pl."'],
    ['Status ved ugeafslutning (paller)', { formula: 'B6+B13', result: d.endStatus }, '0" pl."'],
    ['Forventet udnyttelse ved ugeafslutning (%)', { formula: 'B14/B5*100', result: d.futurePct }, '0.0"%"'],
    ['Ledige pladser efter flow', { formula: 'B5-B14', result: d.free }, '0" pl."'],
    ['Kapacitetsbrud', { formula: 'IF(B14>B5,"JA","NEJ")', result: d.breach ? 'JA' : 'NEJ' }, null],
    ['Overskydende paller', { formula: 'IF(B14>B5,B14-B5,0)', result: d.overflowPallets }, '0" pl."'],
    ['Estimeret ekstraomkostning (DKK/uge)', { formula: 'B18*B9*7', result: d.weeklyRiskCost }, '#,##0" DKK"']
  ];
  results.forEach((row, i) => {
    const r = resultsHeaderRow + 1 + i;
    ws.getCell(`A${r}`).value = row[0];
    const cell = ws.getCell(`B${r}`);
    cell.value = row[1];
    cell.font = { bold: true };
    if (row[2]) cell.numFmt = row[2];
  });

  const chartRow = resultsHeaderRow + 1 + results.length + 1;
  if (chartInstances['wms-chart']) {
    ws.getCell(`A${chartRow}`).value = 'Graf';
    ws.getCell(`A${chartRow}`).font = { bold: true };
    const imgId = wb.addImage({ base64: chartInstances['wms-chart'].toBase64Image(), extension: 'png' });
    ws.addImage(imgId, { tl: { col: 0, row: chartRow }, ext: { width: 520, height: 280 } });
  }

  wb.xlsx.writeBuffer().then(buf => {
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Lager_Flow_Rapport.xlsx';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }).catch(() => alert('Der opstod en fejl under generering af Excel-filen.'));
}

function exportWMSReport() {
  if (!lastWMSData) { alert('Beregn WMS-simuleringen først, før du eksporterer rapporten.'); return; }
  const d = lastWMSData;
  const caseName = getActiveCase();
  const dateStr = new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });

  let chartImg = '';
  const canvas = document.getElementById('wms-chart');
  if (canvas && wmsChart) {
    chartImg = `<img src="${canvas.toDataURL('image/png', 1.0)}" style="max-width:100%; margin: 10px 0 16px;" />`;
  }

  const riskRow = d.breach
    ? `<tr><td>Overskydende paller</td><td>${fmt(d.overflowPallets)} pl.</td></tr>
       <tr><td>Estimeret ekstraomkostning (ekstern leje)</td><td>${fmt(d.weeklyRiskCost)} DKK/uge</td></tr>`
    : `<tr><td>Kapacitetsrisiko</td><td>Ingen — inden for kapacitet</td></tr>`;

  const printArea = document.getElementById('print-area');
  printArea.innerHTML = `
    <h1>BUSINESS MANAGEMENT REPORT — PREPARED FOR: ${escapeHTML(caseName.toUpperCase())}</h1>
    <h2>Warehouse Capacity &amp; Risk Assessment Report</h2>
    <p class="meta">Dato: ${dateStr} &nbsp;·&nbsp; Genereret af LogistikCalc — Logistik &amp; Økonomi</p>
    <h3>Input-værdier</h3>
    <table><tbody>
      <tr><td>Total lagerkapacitet</td><td>${fmt(d.max)} pl.</td></tr>
      <tr><td>Nuværende lagerbeholdning</td><td>${fmt(d.current)} pl.</td></tr>
      <tr><td>Inbound denne uge</td><td>${fmt(d.inbound)} pl.</td></tr>
      <tr><td>Outbound denne uge</td><td>${fmt(d.outbound)} pl.</td></tr>
      <tr><td>Ekstern lagerleje pr. palle/dag</td><td>${fmt(d.externalCost)} DKK</td></tr>
    </tbody></table>
    <h3>Resultat &amp; risikovurdering</h3>
    <table><tbody>
      <tr><td>Nuværende udnyttelse</td><td>${fmt(d.nowPct, 1)}%</td></tr>
      <tr><td>Netto-flow denne uge</td><td>${(d.netFlow >= 0 ? '+' : '') + fmt(d.netFlow)} pl.</td></tr>
      <tr><td>Status ved ugeafslutning</td><td>${fmt(d.endStatus)} pl.</td></tr>
      <tr><td>Forventet udnyttelse ved ugeafslutning</td><td>${fmt(d.futurePct, 1)}%</td></tr>
      <tr><td>Ledige pladser efter flow</td><td>${fmt(d.free)} pl.</td></tr>
      ${riskRow}
    </tbody></table>
    ${chartImg}`;

  printWhenReady();
}

