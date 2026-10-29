/* ================= ØKONOMI & NØGLETAL ================= */
function calcLG1() {
  const oa = num('lg1-oa'), kg = num('lg1-kg');
  if (!kg) return alert('Kortfristet gæld skal være over 0.');
  const v = (oa / kg) * 100;
  const text = bucket(v, [100, 150], [
    'Under 100% — virksomheden har IKKE nok omsætningsaktiver til at dække den kortfristede gæld. Det er en advarsel om risiko for likviditetsproblemer/betalingsstandsning.',
    'Mellem 100-150% — en acceptabel, men lidt stram likviditet. Der er dækning, men ikke meget luft.',
    'Over 150% — solid likviditet. Virksomheden kan sagtens dække sin kortfristede gæld (er den meget høj, kan det dog betyde, at for meget kapital ligger "unyttigt" i omsætningsaktiver).'
  ]);
  renderResult('lg1-result', [{ label: 'Likviditetsgrad 1', value: fmt(v, 1) + '%' }], text);
}

function calcLG2() {
  const oa = num('lg2-oa'), lager = num('lg2-lager'), kg = num('lg2-kg');
  if (!kg) return alert('Kortfristet gæld skal være over 0.');
  const v = ((oa - lager) / kg) * 100;
  const text = bucket(v, [75, 125], [
    'Under 75% — uden at kunne sælge varelageret ville virksomheden have svært ved at betale sin kortfristede gæld hurtigt.',
    'Mellem 75-125% — en fornuftig "hurtig" likviditet uden at regne varelageret med.',
    'Over 125% — virksomheden kan dække sin kortfristede gæld selv uden at sælge ud af varelageret. Meget solidt.'
  ]);
  renderResult('lg2-result', [{ label: 'Likviditetsgrad 2', value: fmt(v, 1) + '%' }], text);
}

function calcSol() {
  const ek = num('sol-ek'), aktiver = num('sol-aktiver');
  if (!aktiver) return alert('Aktiver skal være over 0.');
  const v = (ek / aktiver) * 100;
  const text = bucket(v, [15, 30], [
    'Under 15% — kritisk lav soliditet. Virksomheden er stærkt afhængig af fremmedkapital (gæld) og har lille "buffer" til at modstå tab. Høj finansiel risiko.',
    'Mellem 15-30% — moderat soliditet, almindeligt for mange virksomheder, men tab kan hurtigt presse egenkapitalen.',
    'Over 30% — stærk soliditet. Virksomheden er godt polstret til at modstå underskud uden at komme i finansielle problemer.'
  ]);
  renderResult('sol-result', [{ label: 'Soliditetsgrad', value: fmt(v, 1) + '%' }], text);
  renderGauge('sol-gauge', v, [15, 30], 50, ['Kritisk', 'Moderat', 'Stærk soliditet']);
}

function calcROE() {
  const res = num('roe-res'), ek = num('roe-ek');
  if (!ek) return alert('Egenkapital skal være over 0.');
  const v = (res / ek) * 100;
  const text = bucket(v, [5, 15], [
    'Lavt afkast til ejerne — under det man typisk kunne forvente ved alternative investeringer. Kan indikere lav indtjening eller stor egenkapital ift. resultatet.',
    'Et fornuftigt afkast til ejerne af den investerede kapital.',
    'Højt afkast — ejerne får en attraktiv forrentning af deres investerede kapital.'
  ]);
  renderResult('roe-result', [{ label: 'ROE — Egenkapitalforrentning', value: fmt(v, 1) + '%' }], text);
}

function calcROA() {
  const ebit = num('roa-ebit'), aktiver = num('roa-aktiver');
  if (!aktiver) return alert('Aktiver skal være over 0.');
  const v = (ebit / aktiver) * 100;
  const text = bucket(v, [5, 12], [
    'Lav afkastningsgrad — aktiverne genererer relativt lidt indtjening. Kan skyldes lav overskudsgrad, lav omsætningshastighed, eller begge dele.',
    'Et acceptabelt niveau for de fleste brancher.',
    'Høj afkastningsgrad — virksomheden er god til at skabe overskud ud fra sine aktiver, uafhængigt af hvordan de er finansieret.'
  ]);
  renderResult('roa-result', [{ label: 'ROA — Afkastningsgrad', value: fmt(v, 1) + '%' }], text);
}

function calcOG() {
  const ebit = num('og-ebit'), oms = num('og-oms');
  if (!oms) return alert('Omsætning skal være over 0.');
  const v = (ebit / oms) * 100;
  const text = bucket(v, [5, 10], [
    'Under 5% — lav overskudsgrad. Omkostningerne æder det meste af omsætningen op, og der er lidt "luft" til prisfald eller stigende omkostninger.',
    'Mellem 5-10% — et fornuftigt niveau i de fleste brancher.',
    'Over 10% — høj overskudsgrad. Virksomheden er god til at omsætte salg til overskud.'
  ]);
  renderResult('og-result', [{ label: 'Overskudsgrad', value: fmt(v, 1) + '%' }], text);
  renderGauge('og-gauge', v, [5, 10], 20, ['Rød zone', 'Gul zone', 'Grøn zone']);
}

function calcAT() {
  const oms = num('at-oms'), aktiver = num('at-aktiver');
  if (!aktiver) return alert('Aktiver skal være over 0.');
  const v = oms / aktiver;
  const text = bucket(v, [1, 2], [
    'Lav omsætningshastighed — virksomheden er "kapitaltung": der skal mange aktiver til at skabe omsætningen. Typisk for kapitalintensive brancher (fx produktion, logistik med eget lager).',
    'Middel niveau.',
    'Høj omsætningshastighed — hver krone i aktiver genererer meget omsætning. Typisk for "lette" servicevirksomheder.'
  ]);
  renderResult('at-result', [{ label: 'Aktivomsætningshastighed', value: fmt(v, 2) + ' gange' }],
    `${text} Bemærk: ROA = Overskudsgrad × Aktivomsætningshastighed — de to nøgletal hænger sammen.`);
}

function calcBE() {
  const fixed = num('be-fixed'), price = num('be-price'), varc = num('be-var');
  if (fixed < 0 || price < 0 || varc < 0) return alert('Omkostninger og pris kan ikke være negative.');
  if (price <= varc) return alert('Salgsprisen skal være højere end den variable omkostning.');
  const dbPerUnit = price - varc;
  const beUnits = fixed / dbPerUnit;
  const beRevenue = beUnits * price;
  renderResult('be-result', [
    { label: 'Break-even mængde', value: fmt(beUnits, 0) + ' stk' },
    { label: 'Break-even omsætning', value: fmt(beRevenue) + ' kr' },
    { label: 'DB pr. stk', value: fmt(dbPerUnit) + ' kr' }
  ], `Ved salg af ${fmt(beUnits, 0)} stk (svarende til ${fmt(beRevenue)} kr i omsætning) er de faste omkostninger lige akkurat dækket. Sælges færre enheder, gives underskud; sælges flere, gives overskud.`);
  drawLineChart('be-chart', beUnits, q => fixed + q * varc, q => q * price, 'Antal solgte enheder', true);
}

function calcDB() {
  const price = num('db-price'), varc = num('db-var'), units = num('db-units');
  const dbUnit = price - varc;
  const dbTotal = dbUnit * units;
  const dbPct = (dbUnit / price) * 100;
  renderResult('db-result', [
    { label: 'DB pr. enhed', value: fmt(dbUnit) + ' kr' },
    { label: 'DB i alt', value: fmt(dbTotal) + ' kr' },
    { label: 'Dækningsgrad', value: fmt(dbPct, 1) + '%' }
  ], `Hver solgt enhed bidrager med ${fmt(dbUnit)} kr til at dække faste omkostninger og skabe overskud. Med ${fmt(units)} solgte enheder giver det et samlet dækningsbidrag på ${fmt(dbTotal)} kr, før de faste omkostninger trækkes fra.`);
}

/* ================= BUDGET & LØN ================= */
function calcRB() {
  const oms = num('rb-oms'), varPct = num('rb-varpct'), fixed = num('rb-fixed');
  const varCost = oms * (varPct / 100);
  const db = oms - varCost;
  const result = db - fixed;
  renderResult('rb-result', [
    { label: 'Dækningsbidrag', value: fmt(db) + ' kr' },
    { label: 'Budgetteret resultat', value: fmt(result) + ' kr', class: result < 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400' }
  ], result < 0
    ? `Budgettet viser et underskud på ${fmt(Math.abs(result))} kr. Enten skal omsætningen op, de variable omkostninger ned, eller de faste omkostninger reduceres.`
    : `Budgettet viser et forventet overskud på ${fmt(result)} kr i perioden.`);
}

function calcCB() {
  const open = num('cb-open'), cin = num('cb-in'), cout = num('cb-out');
  const close = open + cin - cout;
  renderResult('cb-result', [
    { label: 'Likvid beholdning, ultimo', value: fmt(close) + ' kr', class: close < 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400' }
  ], close < 0
    ? `⚠️ Kassebeholdningen bliver negativ (${fmt(close)} kr) — virksomheden mangler likviditet i perioden, selvom den måske er overskudsgivende på papiret. Der er brug for kassekredit, udskudte betalinger eller lavere udbetalinger.`
    : `Der er ${fmt(close)} kr i kassen ved periodens slutning — nok til at dække de forventede udbetalinger.`);
}

function calcLon() {
  const brutto = num('lon-brutto'), feriePct = num('lon-ferie'), pensionPct = num('lon-pension'), atp = num('lon-atp');
  const feriepenge = brutto * (feriePct / 100);
  const pension = brutto * (pensionPct / 100);
  const monthly = brutto + feriepenge + pension + atp;
  const yearly = monthly * 12;
  const extraPct = ((monthly - brutto) / brutto) * 100;
  renderResult('lon-result', [
    { label: 'Bruttoløn/md.', value: fmt(brutto) + ' kr' },
    { label: 'Total lønomk./md.', value: fmt(monthly) + ' kr' },
    { label: 'Total lønomk./år', value: fmt(yearly) + ' kr' },
    { label: 'Ekstra oveni brutto', value: '+' + fmt(extraPct, 1) + '%' }
  ], `Selvom medarbejderen har en bruttoløn på ${fmt(brutto)} kr/md., koster medarbejderen reelt ${fmt(monthly)} kr/md. (${fmt(extraPct, 1)}% mere) for arbejdsgiveren, når feriepenge, pension og bidrag lægges oveni.`);
}

