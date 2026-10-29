/* ================= LAGER & INDKØB ================= */
let lastEOQData = null;
function calcEOQ() {
  const D = num('eoq-d'), S = num('eoq-s'), H = num('eoq-h');
  if (D <= 0 || S <= 0 || H <= 0) return alert('Alle felter skal være positive tal (større end 0).');
  const q = Math.sqrt((2 * D * S) / H);
  const orderCost = (D / q) * S, holdCost = (q / 2) * H, total = orderCost + holdCost;
  lastEOQData = { q, ordersPerYear: D / q, total };
  renderResult('eoq-result', [
    { label: 'Optimal ordrestørrelse Q*', value: fmt(q) + ' stk' },
    { label: 'Ordrer pr. år', value: fmt(D / q, 1) },
    { label: 'Total årlig omk.', value: fmt(total) + ' kr' }
  ], `Ved at bestille ${fmt(q)} stk ad gangen minimeres de samlede ordre- og lageromkostninger til ${fmt(total)} kr/år. Bestiller du mindre ad gangen stiger ordreomkostningerne; bestiller du mere, stiger lageromkostningerne.`);
  drawLineChart('eoq-chart', q, qq => (D / qq) * S, qq => (qq / 2) * H, 'Ordrestørrelse (Q)');
}

function calcPOQ() {
  const D = num('poq-d'), S = num('poq-s'), H = num('poq-h'), p = num('poq-p');
  if (D <= 0 || S <= 0 || H <= 0 || p <= 0) return alert('Alle felter skal være positive tal (større end 0).');
  if (p <= D) return alert('Produktionsraten (p) skal være højere end årsforbruget (D) — ellers kan virksomheden ikke følge med efterspørgslen.');
  const q = Math.sqrt((2 * D * S) / (H * (1 - D / p)));
  const maxInv = q * (1 - D / p);
  renderResult('poq-result', [
    { label: 'Optimal produktionsstørrelse Q*', value: fmt(q) + ' stk' },
    { label: 'Maks. lagerbeholdning', value: fmt(maxInv) + ' stk' },
    { label: 'Produktionskørsler/år', value: fmt(D / q, 1) }
  ], `Fordi virksomheden selv producerer med rate p=${fmt(p)}/år mens der forbruges D=${fmt(D)}/år, bygges lageret gradvist op under produktion i stedet for at ankomme på én gang som ved EOQ. Det giver et lavere maks-lager (${fmt(maxInv)} stk) end selve ordrestørrelsen.`);
}

function calcROP() {
  const d = num('rop-demand'), lt = num('rop-lt'), std = num('rop-std'), z = parseFloat(document.getElementById('rop-z').value);
  if (d <= 0 || lt <= 0) return alert('Forbrug og leveringstid skal være positive tal (større end 0).');
  if (std < 0) return alert('Standardafvigelsen kan ikke være negativ.');
  const ss = z * std * Math.sqrt(lt);
  const rop = d * lt + ss;
  renderResult('rop-result', [
    { label: 'Sikkerhedslager', value: fmt(ss) + ' stk' },
    { label: 'Genbestillingspunkt (ROP)', value: fmt(rop) + ' stk' }
  ], `Når lagerbeholdningen falder til ${fmt(rop)} stk, skal der bestilles nyt. De ${fmt(ss)} stk i sikkerhedslager er bufferen mod udsving i forbrug og leveringstid ved den valgte servicegrad.`);
}

function calcTurnover() {
  const cogs = num('turn-cogs'), inv = num('turn-inv');
  if (!cogs || !inv) return alert('Udfyld begge felter.');
  const rate = cogs / inv;
  const days = 365 / rate;
  const text = bucket(rate, [4, 8], [
    'Det er relativt lavt — pengene ligger "stille" i varelageret i lang tid (kapitalbinding), hvilket koster i form af renter/alternative investeringer.',
    'Det er et fornuftigt niveau for de fleste brancher.',
    'Det er højt — lageret bliver hurtigt omsat, hvilket typisk er effektivt, men kan også indebære risiko for at løbe tør for varer (stock-out).'
  ]);
  renderResult('turn-result', [
    { label: 'Omsætningshastighed', value: fmt(rate, 1) + ' gange/år' },
    { label: 'Gns. liggetid', value: fmt(days, 0) + ' dage' }
  ], text);
}

function calcTCO() {
  const price = num('tco-price'), freight = num('tco-freight'), hold = num('tco-hold'), qual = num('tco-qual');
  if (price <= 0) return alert('Indkøbsprisen skal være et positivt tal (større end 0).');
  if (freight < 0 || hold < 0 || qual < 0) return alert('Omkostninger kan ikke være negative.');
  const total = price + freight + hold + qual;
  const extraPct = ((total - price) / price) * 100;
  renderResult('tco-result', [
    { label: 'Indkøbspris', value: fmt(price) + ' kr' },
    { label: 'Total ejeromkostning (TCO)', value: fmt(total) + ' kr' },
    { label: 'Skjulte omk. udover pris', value: '+' + fmt(extraPct, 1) + '%' }
  ], `Den "billige" indkøbspris på ${fmt(price)} kr dækker kun en del af den reelle omkostning. Når transport, lager og kvalitetsomkostninger tælles med, er den samlede pris ${fmt(extraPct, 1)}% højere. Et lavt tilbud kan derfor stadig være det dyreste valg i praksis.`);
}

