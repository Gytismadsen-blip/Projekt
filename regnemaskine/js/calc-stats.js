/* ================= STATISTIK & SANDSYNLIGHED ================= */
function parseDataset(id) {
  return document.getElementById(id).value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}

function calcStats() {
  const data = parseDataset('stat-data');
  if (data.length < 1) return alert('Indtast mindst ét tal.');
  const sorted = [...data].sort((a, b) => a - b);
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const freq = {};
  data.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
  const modeText = maxFreq > 1 ? modes.join(', ') : 'ingen (alle værdier optræder lige ofte)';

  renderResult('stat-result', [
    { label: 'Antal observationer (n)', value: data.length },
    { label: 'Middelværdi (x̄)', value: fmt(mean, 2) },
    { label: 'Median', value: fmt(median, 2) },
    { label: 'Typetal (mode)', value: modeText },
    { label: 'Min / Maks', value: fmt(sorted[0]) + ' / ' + fmt(sorted[sorted.length - 1]) }
  ], `Middelværdien (${fmt(mean, 2)}) og medianen (${fmt(median, 2)}) ligger ${Math.abs(mean - median) < 0.05 * mean ? 'tæt på hinanden, hvilket tyder på en nogenlunde symmetrisk fordeling' : 'et stykke fra hinanden, hvilket tyder på skæve/ekstreme værdier i datasættet (medianen er mere robust over for ekstremværdier end middelværdien)'}.`);
}

let lastStdDev = null;
function calcSD() {
  const data = parseDataset('sd-data');
  if (data.length < 2) return alert('Indtast mindst to tal.');
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const sqDiffs = data.map(x => (x - mean) ** 2);
  const sumSq = sqDiffs.reduce((a, b) => a + b, 0);
  const popVar = sumSq / data.length;
  const sampleVar = sumSq / (data.length - 1);
  lastStdDev = Math.sqrt(popVar);
  renderResult('sd-result', [
    { label: 'Middelværdi', value: fmt(mean, 2) },
    { label: 'Varians (population)', value: fmt(popVar, 2) },
    { label: 'Std.afvigelse (population, σ)', value: fmt(Math.sqrt(popVar), 2) },
    { label: 'Std.afvigelse (stikprøve, s)', value: fmt(Math.sqrt(sampleVar), 2) }
  ], `En standardafvigelse på ${fmt(Math.sqrt(popVar), 2)} betyder, at datapunkterne typisk ligger ca. ${fmt(Math.sqrt(popVar), 2)} fra middelværdien. Jo større tal, jo mere spredte/uensartede er observationerne. Brug stikprøve-varianten (s) når data kun er et udsnit af en større population.`);
  document.getElementById('sd-transfer-btn').classList.remove('hidden');
}

function transferStdDevToROP() {
  if (lastStdDev === null) return;
  const input = document.getElementById('rop-std');
  input.value = lastStdDev.toFixed(2);
  const ropCard = document.getElementById('card-rop');
  ropCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  input.classList.add('flash-highlight');
  ropCard.classList.add('flash-highlight');
  setTimeout(() => { input.classList.remove('flash-highlight'); ropCard.classList.remove('flash-highlight'); }, 1200);
}

function calcND() {
  const x = num('nd-x'), mean = num('nd-mean'), std = num('nd-std');
  if (!std) return alert('Standardafvigelsen skal være over 0.');
  const { z, p } = normalCDF(x, mean, std);
  renderResult('nd-result', [
    { label: 'Z-score', value: fmt(z, 2) },
    { label: 'P(X ≤ x)', value: fmt(p * 100, 1) + '%' },
    { label: 'P(X > x)', value: fmt((1 - p) * 100, 1) + '%' }
  ], `Værdien x=${fmt(x)} ligger ${fmt(Math.abs(z), 2)} standardafvigelser ${z >= 0 ? 'over' : 'under'} middelværdien. Der er ${fmt(p * 100, 1)}% sandsynlighed for at observere en værdi på ${fmt(x)} eller derunder — det bruges bl.a. til at fastsætte servicegrader og sikkerhedslagre.`);
}

