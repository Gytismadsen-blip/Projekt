/* ================= WMS — WAREHOUSE CAPACITY & FLOW ================= */
function wmsBarColor(pct) {
  if (pct < 75) return '#34d399';
  if (pct <= 90) return '#fbbf24';
  return '#dc2626';
}
function wmsTextClasses(pct) {
  if (pct < 75) return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
  if (pct <= 90) return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300';
  return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300';
}

const WMS_MESSAGES = {
  da: {
    breach: n => `🚨 Kapacitetsbrud! Du mangler plads til ${fmt(n)} paller. Iværksæt straks nød-omdirigering til eksternt cross-docking lager.`,
  riskCost: (n, pricePerDay, weeklyCost) => `🚨 Økonomisk risiko: Forventet ekstraomkostning til eksternt lager grundet kapacitetsbrud: ${fmt(weeklyCost)} DKK/uge (${fmt(n)} paller × ${fmt(pricePerDay)} DKK/dag × 7 dage).`,
    highRisk: '⚠️ Advarsel: Kritisk høj belægning ved ugeafslutning. Overvej at bremse inbound-ordrer, øge outbound-hastigheden eller leje ekstern bufferkapacitet.',
    lowUtil: '💡 Ledig kapacitet identificeret. Lageret kan håndtere yderligere bulk-indkøb eller konsolidering af varer.',
    ok: '✅ Sund kapacitetsudnyttelse — ingen handling påkrævet lige nu.',
    chartLabels: ['Total kapacitet', 'Nuværende beholdning', 'Forventet beholdning (ugeafslutning)']
  },
  en: {
    breach: n => `🚨 Capacity breach! You are short of space for ${fmt(n)} pallets. Initiate emergency redirection to external cross-docking immediately.`,
    riskCost: (n, pricePerDay, weeklyCost) => `🚨 Financial risk: Expected extra cost for external storage due to capacity breach: ${fmt(weeklyCost)} DKK/week (${fmt(n)} pallets × ${fmt(pricePerDay)} DKK/day × 7 days).`,
    highRisk: '⚠️ Warning: Critically high occupancy by end of week. Consider slowing inbound orders, speeding up outbound, or renting external buffer capacity.',
    lowUtil: '💡 Spare capacity identified. The warehouse can handle additional bulk purchasing or consolidation of goods.',
    ok: '✅ Healthy capacity utilization — no action needed right now.',
    chartLabels: ['Total capacity', 'Current inventory', 'Expected inventory (end of week)']
  },
  lt: {
    breach: n => `🚨 Talpos viršijimas! Trūksta vietos ${fmt(n)} padėklams. Nedelsiant nukreipkite krovinį į išorinį cross-docking sandėlį.`,
    riskCost: (n, pricePerDay, weeklyCost) => `🚨 Finansinė rizika: dėl talpos viršijimo numatoma papildoma išorinio sandėliavimo sąnaudos: ${fmt(weeklyCost)} DKK/sav. (${fmt(n)} padėklai × ${fmt(pricePerDay)} DKK/d. × 7 dienos).`,
    highRisk: '⚠️ Įspėjimas: kritiškai didelis užpildymas savaitės pabaigoje. Apsvarstykite įvežimo mažinimą, išvežimo spartinimą arba išorinio buferio nuomą.',
    lowUtil: '💡 Nustatyta laisva talpa. Sandėlis gali priimti papildomus stambius pirkimus arba prekių konsolidaciją.',
    ok: '✅ Sveikas talpos išnaudojimas — jokių veiksmų šiuo metu nereikia.',
    chartLabels: ['Bendra talpa', 'Dabartinės atsargos', 'Numatomos atsargos (savaitės pabaigoje)']
  }
};

let wmsChart = null;
let lastWMSData = null;
function calcWMS() {
  const max = num('wmsMaxCapacity'), current = num('wmsCurrentStock'), inbound = num('wmsInbound'), outbound = num('wmsOutbound');
  const externalCost = num('wmsExternalCost');
  if (!max) return alert('Total lagerkapacitet skal være over 0.');

  const lang = localStorage.getItem(LANG_KEY) || 'da';
  const msg = WMS_MESSAGES[lang] || WMS_MESSAGES.da;

  const nowPct = (current / max) * 100;
  const netFlow = inbound - outbound;
  const endStatus = current + netFlow;
  const futurePct = (endStatus / max) * 100;
  const free = max - endStatus;
  const breach = endStatus > max;
  const overflowPallets = breach ? endStatus - max : 0;
  const weeklyRiskCost = overflowPallets * externalCost * 7;

  lastWMSData = { max, current, inbound, outbound, externalCost, nowPct, netFlow, endStatus, futurePct, free, breach, overflowPallets, weeklyRiskCost };

  document.getElementById('wms-result').classList.remove('hidden');
  document.getElementById('wms-now-label').textContent = `${fmt(current)} / ${fmt(max)} (${fmt(nowPct, 1)}%)`;
  const nowBar = document.getElementById('wms-now-bar');
  nowBar.style.width = Math.min(nowPct, 100) + '%';
  nowBar.style.background = wmsBarColor(nowPct);
  nowBar.classList.toggle('wms-blink', nowPct > 100);

  document.getElementById('wms-future-label').textContent = `${fmt(endStatus)} / ${fmt(max)} (${fmt(futurePct, 1)}%)`;
  const futureBar = document.getElementById('wms-future-bar');
  futureBar.style.width = Math.min(Math.max(futurePct, 0), 100) + '%';
  futureBar.style.background = wmsBarColor(futurePct);
  futureBar.classList.toggle('wms-blink', futurePct > 100);

  document.getElementById('wms-netflow').textContent = (netFlow >= 0 ? '+' : '') + fmt(netFlow) + ' pl.';
  document.getElementById('wms-endstatus').textContent = fmt(endStatus) + ' pl.';
  document.getElementById('wms-free').textContent = fmt(free) + ' pl.';
  document.getElementById('wms-futurepct').textContent = fmt(futurePct, 1) + '%';

  const kpiBox = document.getElementById('wms-result').querySelector('.grid');
  kpiBox.className = 'grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg text-sm ' + wmsTextClasses(futurePct);

  const warningBox = document.getElementById('wms-warning');
  if (breach) {
    warningBox.classList.remove('hidden');
    warningBox.className = 'mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm font-medium flex flex-col gap-2 wms-blink';
    let html = `<div class="flex items-start gap-2"><i data-lucide="alert-triangle" class="w-4 h-4 flex-shrink-0 mt-0.5"></i><span>${msg.breach(Math.abs(free))}</span></div>`;
    if (externalCost > 0) {
      html += `<div class="flex items-start gap-2"><i data-lucide="circle-dollar-sign" class="w-4 h-4 flex-shrink-0 mt-0.5"></i><span>${msg.riskCost(overflowPallets, externalCost, weeklyRiskCost)}</span></div>`;
    }
    warningBox.innerHTML = html;
  } else {
    warningBox.classList.add('hidden');
  }

  const adviceBox = document.getElementById('wms-advice');
  let adviceText, adviceIcon, adviceClass;
  if (breach) {
    adviceText = null; // already shown in warningBox
    adviceBox.classList.add('hidden');
  } else if (futurePct > 90 && netFlow > 0) {
    adviceText = msg.highRisk; adviceIcon = 'alert-triangle'; adviceClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300';
  } else if (futurePct < 50) {
    adviceText = msg.lowUtil; adviceIcon = 'lightbulb'; adviceClass = 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300';
  } else {
    adviceText = msg.ok; adviceIcon = 'check-circle-2'; adviceClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
  }
  if (adviceText) {
    adviceBox.classList.remove('hidden');
    adviceBox.className = 'p-3 rounded-lg text-sm font-medium flex items-start gap-2 ' + adviceClass;
    adviceBox.innerHTML = `<i data-lucide="${adviceIcon}" class="w-4 h-4 flex-shrink-0 mt-0.5"></i><span>${adviceText}</span>`;
  }

  if (wmsChart) wmsChart.destroy();
  wmsChart = new Chart(document.getElementById('wms-chart'), {
    type: 'bar',
    data: {
      labels: msg.chartLabels,
      datasets: [{
        data: [max, current, endStatus],
        backgroundColor: ['#94a3b8', wmsBarColor(nowPct), breach ? '#dc2626' : wmsBarColor(futurePct)],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: chartTextColor(), font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() }, title: { display: true, text: 'Pallepladser', color: chartTextColor(), font: { size: 10 } } }
      }
    }
  });

  chartInstances['wms-chart'] = wmsChart;
  if (window.lucide) lucide.createIcons();
}

function initWMS() {
  document.getElementById('wms-btn').addEventListener('click', calcWMS);
}

