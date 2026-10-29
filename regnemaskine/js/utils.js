/* =========================================================
   LogistikCalc — app.js
   Alle beregnere: Lager & Indkøb, Transport, Økonomi & Nøgletal,
   Budget & Løn, Produktion, Statistik & Sandsynlighed.
   ========================================================= */

/* ---------------- HELPERS ---------------- */
function num(id) { return parseFloat(document.getElementById(id).value) || 0; }
function fmt(n, decimals = 0) { return n.toLocaleString('da-DK', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); }
// Escaper ogsaa anfoerselstegn, saa teksten er sikker baade i indhold og i attributter
function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderResult(id, stats, explanation) {
  const box = document.getElementById(id);
  box.classList.remove('hidden');
  box.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70">
      ${stats.map(s => `<div><p class="text-[11px] text-slate-500">${s.label}</p><p class="text-lg font-bold ${s.class || ''}">${s.value}</p></div>`).join('')}
    </div>
    <div class="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 explain flex gap-2">
      <i data-lucide="info" class="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5"></i>
      <p>${explanation}</p>
    </div>`;
  if (window.lucide) lucide.createIcons();
}

/* Rule-of-thumb interpretation helper: pick a text bucket by thresholds */
function bucket(value, thresholds, texts) {
  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) return texts[i];
  }
  return texts[texts.length - 1];
}

/* Normal CDF via Abramowitz-Stegun erf approximation */
function normalCDF(x, mean, std) {
  const z = (x - mean) / std;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return { z, p };
}

