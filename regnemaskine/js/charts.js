/* ---------------- CHART HELPER (EOQ / Break-even) ---------------- */
let chartInstances = {};

function isDark() { return document.documentElement.classList.contains('dark'); }
function chartTextColor() { return isDark() ? '#cbd5e1' : '#334155'; }
function chartGridColor() { return isDark() ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.12)'; }

function chartBaseOptions(xLabel) {
  const textColor = chartTextColor(), gridColor = chartGridColor();
  return {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 }, color: textColor } } },
    scales: {
      x: { title: { display: true, text: xLabel, font: { size: 10 }, color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } },
      y: { title: { display: true, text: 'kr', font: { size: 10 }, color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } }
    }
  };
}

function drawLineChart(canvasId, optimum, fn1, fn2, xLabel, isTotalMinusFixed) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return;
  const maxQ = optimum * 2.2;
  const points = 24;
  const step = maxQ / points;

  // build x values, then splice in the exact optimum so it lands on an axis tick
  let xs = [];
  for (let i = 1; i <= points; i++) xs.push(step * i);
  xs.push(optimum);
  xs = [...new Set(xs)].sort((a, b) => a - b);
  const optIndex = xs.indexOf(optimum);

  const labels = xs.map(q => q.toFixed(0));
  const series1 = [], series2 = [], total = [];
  xs.forEach(q => {
    const v1 = fn1(q), v2 = fn2(q);
    series1.push(v1);
    series2.push(v2);
    total.push(isTotalMinusFixed ? v1 : v1 + v2);
  });

  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

  const markerData = (isTotalMinusFixed ? total : total).map((v, i) => i === optIndex ? v : null);
  const optimumLabel = isTotalMinusFixed ? 'Break-even punkt' : 'EOQ (optimum)';

  const datasets = isTotalMinusFixed
    ? [
        { label: 'Total omkostning', data: series1, borderColor: '#f59e0b', tension: 0.15, pointRadius: 0, borderWidth: 2 },
        { label: 'Omsætning', data: series2, borderColor: '#2563eb', tension: 0.15, pointRadius: 0, borderWidth: 2 },
        { label: optimumLabel, data: markerData, borderColor: 'transparent', backgroundColor: '#dc2626', pointRadius: 7, pointHoverRadius: 8, showLine: false }
      ]
    : [
        { label: 'Ordreomk.', data: series1, borderColor: '#f59e0b', tension: 0.15, pointRadius: 0, borderWidth: 2 },
        { label: 'Lageromk.', data: series2, borderColor: '#10b981', tension: 0.15, pointRadius: 0, borderWidth: 2 },
        { label: 'Total', data: total, borderColor: '#2563eb', tension: 0.15, pointRadius: 0, borderWidth: 3 },
        { label: optimumLabel, data: markerData, borderColor: 'transparent', backgroundColor: '#dc2626', pointRadius: 7, pointHoverRadius: 8, showLine: false }
      ];

  chartInstances[canvasId] = new Chart(ctx, { type: 'line', data: { labels, datasets }, options: chartBaseOptions(xLabel) });
}

/* ---------------- THEME ---------------- */
function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
  if (window.lucide) lucide.createIcons();
}

/* ---------------- KPI GAUGE ---------------- */
function renderGauge(id, value, thresholds, maxScale, zoneLabels) {
  const box = document.getElementById(id);
  box.classList.remove('hidden');
  const [t1, t2] = thresholds;
  const w1 = Math.min(t1 / maxScale, 1) * 100;
  const w2 = Math.min(t2 / maxScale, 1) * 100 - w1;
  const w3 = 100 - w1 - w2;
  const pos = Math.min(Math.max(value / maxScale, 0), 1) * 100;
  const zone = value < t1 ? 0 : value < t2 ? 1 : 2;
  const zoneColors = ['#dc2626', '#d97706', '#059669'];

  box.innerHTML = `
    <div class="relative pt-4">
      <div class="flex h-3 rounded-full overflow-hidden">
        <div style="width:${w1}%; background:#f87171"></div>
        <div style="width:${w2}%; background:#fbbf24"></div>
        <div style="width:${w3}%; background:#34d399"></div>
      </div>
      <div class="absolute -top-0.5 flex flex-col items-center" style="left:${pos}%; transform: translateX(-50%);">
        <div class="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent" style="border-top-color:${zoneColors[zone]}"></div>
      </div>
      <div class="flex justify-between text-[10px] text-slate-400 mt-1.5">
        <span>${zoneLabels[0]}</span><span>${zoneLabels[1]}</span><span>${zoneLabels[2]}</span>
      </div>
    </div>`;
}

