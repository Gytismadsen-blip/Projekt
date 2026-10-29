/* ---------------- PDF EXPORT ---------------- */
// #print-area is display:none until the print stylesheet activates, so an <img> chart
// inserted into it right before window.print() may not be decoded/painted yet in some
// browsers, producing a blank chart in the printed/saved PDF. Wait for every image inside
// it to finish decoding, then give the browser two paint frames before printing.
function printWhenReady() {
  const printArea = document.getElementById('print-area');
  const images = Array.from(printArea.querySelectorAll('img'));
  const waitForImages = Promise.all(images.map(img =>
    img.decode ? img.decode().catch(() => {}) : new Promise(resolve => {
      if (img.complete) resolve();
      else { img.onload = resolve; img.onerror = resolve; }
    })
  ));
  waitForImages.then(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  });
}

function exportPDF(title, inputDefs, resultElId, chartCanvasId) {
  const resultBox = document.getElementById(resultElId);
  if (resultBox.classList.contains('hidden')) { alert('Beregn resultatet først, før du eksporterer rapporten.'); return; }

  const rows = inputDefs.map(d => `<tr><td>${escapeHTML(d.label)}</td><td>${escapeHTML(document.getElementById(d.id).value)}</td></tr>`).join('');
  const dateStr = new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });
  const caseName = getActiveCase();

  let chartImg = '';
  if (chartCanvasId && chartInstances[chartCanvasId]) {
    chartImg = `<h3>Graf</h3><img src="${chartInstances[chartCanvasId].toBase64Image()}" style="max-width:100%; margin: 4px 0 16px;" />`;
  }

  const printArea = document.getElementById('print-area');
  printArea.innerHTML = `
    <h1>BUSINESS MANAGEMENT REPORT — PREPARED FOR: ${escapeHTML(caseName.toUpperCase())}</h1>
    <h2>${escapeHTML(title)}</h2>
    <p class="meta">Dato: ${dateStr} &nbsp;·&nbsp; Genereret af LogistikCalc — Logistik &amp; Økonomi</p>
    <h3>Input-værdier</h3>
    <table><tbody>${rows}</tbody></table>
    <h3>Resultat</h3>
    ${resultBox.innerHTML}
    ${chartImg}`;

  printWhenReady();
}

