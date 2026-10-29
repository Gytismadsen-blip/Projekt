/* ---------------- FORMULA INJECTION ---------------- */
const FORMULAS = {
  eoq: 'Q* = √(2·D·S / H)',
  poq: 'Q* = √( 2·D·S / (H·(1 − d/p)) )',
  rop: 'ROP = d̄·LT + Z·σ_d·√LT   |   Sikkerhedslager = Z·σ_d·√LT',
  turn: 'Omsætningshastighed = Vareforbrug (år) / Gns. lagerværdi',
  tco: 'TCO = Indkøbspris + Transport/told + Lager/håndtering + Kvalitet/spild',
  fr: 'Pris pr. enhed = Total fragtomk. / Antal enheder   |   Pris pr. km = Total fragtomk. / Afstand',
  route: 'Reelle vejdata (OpenStreetMap/OSRM) — ikke en fast formel, men henter faktisk rute',
  dh: 'Pause: 45 min for hver 4,5 t kørsel   |   Døgnhvile: min. 11 t   |   Maks. køretid/dag: normalt 9 t (10 t højst 2×/uge)',
  tr: 'Ledig vægtkapacitet = Tilladt totalvægt − Egenvægt − Godsvægt   |   Volumenudnyttelse = Godsvolumen / Trailervolumen',
  cog: 'X* = Σ(wᵢ·xᵢ) / Σwᵢ      Y* = Σ(wᵢ·yᵢ) / Σwᵢ',
  lg1: 'Likviditetsgrad 1 = Omsætningsaktiver / Kortfristet gæld × 100',
  lg2: 'Likviditetsgrad 2 = (Omsætningsaktiver − Varelager) / Kortfristet gæld × 100',
  sol: 'Soliditetsgrad = Egenkapital / Aktiver i alt × 100',
  roe: 'ROE = Årets resultat / Egenkapital × 100',
  roa: 'ROA = EBIT / Aktiver i alt × 100',
  og: 'Overskudsgrad = EBIT / Omsætning × 100',
  at: 'Aktivomsætningshastighed = Omsætning / Aktiver i alt',
  be: 'Break-even (stk) = Faste omk. / (Salgspris − Var. omk. pr. stk)',
  db: 'DB pr. stk = Salgspris − Var. omk.   |   DB i alt = DB pr. stk × antal solgt',
  rb: 'Resultat = Omsætning − (Omsætning × Var.omk.%) − Faste omkostninger',
  cb: 'Likvid beholdning ultimo = Primo + Indbetalinger − Udbetalinger',
  lon: 'Lønomkostning = Bruttoløn × (1 + Feriepenge% + Pension%) + ATP/AES',
  cap: 'Kapacitetsudnyttelse = Faktisk output / Maks. kapacitet × 100',
  lt: "Little's Law: Gennemløbstid = WIP / Gennemløbsrate",
  stat: 'x̄ = Σx / n     Median = midterste værdi i sorteret datasæt',
  sd: 'σ = √( Σ(x − x̄)² / n )     s = √( Σ(x − x̄)² / (n−1) )',
  nd: 'Z = (x − μ) / σ  →  P(X ≤ x) findes fra Z i normalfordelingen'
};

function injectFormulas() {
  Object.keys(FORMULAS).forEach(key => {
    const btn = document.getElementById(key + '-btn');
    if (!btn) return;
    const line = document.createElement('p');
    line.className = 'text-[11px] font-mono text-slate-400 dark:text-slate-500 mb-3 mt-1';
    line.textContent = 'Formel: ' + FORMULAS[key];
    btn.parentElement.insertBefore(line, btn);
  });
}

/* Accessibility: associate every .f-label with its input/select via for/id,
   so screen readers announce the label and clicking it focuses the field. */
function linkLabelsToInputs() {
  document.querySelectorAll('label.f-label').forEach(label => {
    const field = label.parentElement ? label.parentElement.querySelector('input, select, textarea') : null;
    if (field && field.id) label.setAttribute('for', field.id);
  });
}

/* ---------------- FORMEL- & EXCEL-GUIDE ---------------- */
const GUIDE_GROUPS = [
  {
    icon: '📊',
    label: { da: 'Økonomi & Nøgletal', en: 'Finance & Key Ratios', lt: 'Finansai ir rodikliai' },
    items: [
      {
        title: { da: 'ROA — Afkastningsgrad', en: 'ROA — Return on Assets', lt: 'ROA — Turto pelningumas' },
        explain: {
          da: 'Viser hvor effektivt virksomhedens samlede aktiver skaber overskud, uanset hvordan de er finansieret. Bruges til at sammenligne virksomheder på tværs af branchen.',
          en: 'Shows how efficiently a company\'s total assets generate profit, regardless of financing. Used to compare companies across an industry.',
          lt: 'Rodo, kaip efektyviai įmonės turtas generuoja pelną, nepriklausomai nuo finansavimo. Naudojama įmonėms lyginti tarp šakos.'
        },
        formula: 'ROA = EBIT / Aktiver i alt × 100',
        excel: { da: '=B2/B3*100', en: '=B2/B3*100' }
      },
      {
        title: { da: 'ROE — Egenkapitalforrentning', en: 'ROE — Return on Equity', lt: 'ROE — Nuosavo kapitalo pelningumas' },
        explain: {
          da: 'Viser hvad ejerne får i afkast af de penge, de selv har investeret i virksomheden — det vigtigste nøgletal for en investor.',
          en: 'Shows the return owners get on the money they have personally invested in the company — the key metric for an investor.',
          lt: 'Rodo, kokį pelną savininkai gauna nuo pačių investuotų pinigų — svarbiausias rodiklis investuotojui.'
        },
        formula: 'ROE = Årets resultat / Egenkapital × 100',
        excel: { da: '=B2/B3*100', en: '=B2/B3*100' }
      },
      {
        title: { da: 'Soliditetsgrad', en: 'Equity Ratio', lt: 'Nuosavo kapitalo rodiklis' },
        explain: {
          da: 'Viser hvor stor en andel af virksomheden der er finansieret med egenkapital frem for gæld. Høj soliditet = lav finansiel risiko.',
          en: 'Shows how large a share of the company is financed with equity rather than debt. High equity ratio = low financial risk.',
          lt: 'Rodo, kokia įmonės dalis finansuojama nuosavu kapitalu, o ne skola. Aukštas rodiklis = maža finansinė rizika.'
        },
        formula: 'Soliditetsgrad = Egenkapital / Aktiver i alt × 100',
        excel: { da: '=B2/B3*100', en: '=B2/B3*100' }
      },
      {
        title: { da: 'Break-even analyse', en: 'Break-even Analysis', lt: 'Lūžio taško analizė' },
        explain: {
          da: 'Finder det antal enheder, en virksomhed skal sælge, før de faste omkostninger er dækket, og der begynder at komme overskud.',
          en: 'Finds the number of units a company must sell before fixed costs are covered and profit begins.',
          lt: 'Nustato, kiek vienetų reikia parduoti, kad būtų padengtos pastovios sąnaudos ir prasidėtų pelnas.'
        },
        formula: 'Break-even (stk) = Faste omk. / (Salgspris − Var. omk. pr. stk)',
        excel: { da: '=B2/(B3-B4)', en: '=B2/(B3-B4)' }
      }
    ]
  },
  {
    icon: '📦',
    label: { da: 'Lager & Indkøb', en: 'Inventory & Purchasing', lt: 'Atsargos ir pirkimai' },
    items: [
      {
        title: { da: 'EOQ / Wilson-modellen', en: 'EOQ / Wilson Model', lt: 'EOQ / Wilsono modelis' },
        explain: {
          da: 'Beregner den ordrestørrelse, der minimerer de samlede ordre- og lageromkostninger. Grundformlen i al lagerstyring.',
          en: 'Calculates the order quantity that minimizes total ordering and holding costs. The foundational formula in inventory management.',
          lt: 'Apskaičiuoja užsakymo dydį, minimizuojantį bendras užsakymo ir saugojimo sąnaudas. Pagrindinė atsargų valdymo formulė.'
        },
        formula: 'EOQ = √(2 × D × S / H)',
        excel: { da: '=KVADRATROD((2*B2*B3)/B4)', en: '=SQRT((2*B2*B3)/B4)' }
      },
      {
        title: { da: 'POQ / EPQ — Produktionsstørrelse', en: 'POQ / EPQ — Production Quantity', lt: 'POQ / EPQ — Gamybos dydis' },
        explain: {
          da: 'Som EOQ, men bruges når virksomheden selv producerer varen i stedet for at købe den — tager højde for produktionsraten.',
          en: 'Like EOQ, but used when the company produces the item in-house instead of buying it — accounts for the production rate.',
          lt: 'Kaip EOQ, bet naudojama, kai įmonė pati gamina prekę — atsižvelgiama į gamybos spartą.'
        },
        formula: 'POQ = √( 2DS / (H × (1 − D/p)) )',
        excel: { da: '=KVADRATROD((2*B2*B3)/(B4*(1-B2/B5)))', en: '=SQRT((2*B2*B3)/(B4*(1-B2/B5)))' }
      },
      {
        title: { da: 'Sikkerhedslager & ROP', en: 'Safety Stock & Reorder Point', lt: 'Saugos atsargos ir užsakymo taškas' },
        explain: {
          da: 'Sikkerhedslageret er bufferen mod udsving i forbrug og leveringstid. ROP er niveauet, hvor der skal genbestilles.',
          en: 'Safety stock is the buffer against fluctuations in demand and lead time. ROP is the level at which to reorder.',
          lt: 'Saugos atsargos — buferis nuo paklausos ir pristatymo laiko svyravimų. ROP — lygis, kada reikia užsisakyti iš naujo.'
        },
        formula: 'ROP = d̄ × LT + Z × σ_d × √LT',
        excel: { da: '=B2*B3+B5*B4*KVADRATROD(B3)', en: '=B2*B3+B5*B4*SQRT(B3)' }
      }
    ]
  },
  {
    icon: '🚛',
    label: { da: 'Transport & Fragtomkostninger', en: 'Transport & Freight Costs', lt: 'Transportas ir vežimo sąnaudos' },
    items: [
      {
        title: { da: 'Fragtomkostning pr. enhed', en: 'Freight Cost per Unit', lt: 'Vežimo sąnaudos vienetui' },
        explain: {
          da: 'Fordeler den samlede fragtregning ud på antal enheder, så man kan sammenligne priser på tværs af transportformer og ruter.',
          en: 'Divides the total freight bill across the number of units, so prices can be compared across transport modes and routes.',
          lt: 'Paskirsto bendrą vežimo sąskaitą pagal vienetų skaičių, kad būtų galima lyginti kainas tarp transporto rūšių ir maršrutų.'
        },
        formula: 'Pris/enhed = Total fragtomk. / Antal enheder',
        excel: { da: '=B2/B3', en: '=B2/B3' }
      },
      {
        title: { da: 'Køre- & hviletid (EU-reglerne)', en: "Driver's Hours (EU Rules)", lt: 'Vairavimo ir poilsio laikas (ES taisyklės)' },
        explain: {
          da: 'Beregner hvor mange lovpligtige pauser (45 min. for hver 4½ times kørsel) en chaufførtur kræver.',
          en: 'Calculates how many mandatory breaks (45 min. per 4.5 hours of driving) a driving trip requires.',
          lt: 'Apskaičiuoja, kiek privalomų pertraukų (45 min. kas 4,5 val. vairavimo) reikia kelionei.'
        },
        formula: 'Antal pauser = AFRUND.NED(Køretid / 4,5 ; 0)',
        excel: { da: '=AFRUND.NED(B2/4,5;0)', en: '=ROUNDDOWN(B2/4.5,0)' }
      }
    ]
  },
  {
    icon: '📈',
    label: { da: 'Statistik', en: 'Statistics', lt: 'Statistika' },
    items: [
      {
        title: { da: 'Middelværdi (Gennemsnit)', en: 'Mean (Average)', lt: 'Vidurkis' },
        explain: {
          da: 'Det simple gennemsnit af et datasæt — summen af alle tal delt med antallet af observationer.',
          en: 'The simple average of a data set — the sum of all numbers divided by the number of observations.',
          lt: 'Paprastas duomenų rinkinio vidurkis — visų skaičių suma padalinta iš stebėjimų skaičiaus.'
        },
        formula: 'x̄ = Σx / n',
        excel: { da: '=MIDDEL(A2:A10)', en: '=AVERAGE(A2:A10)' }
      },
      {
        title: { da: 'Standardafvigelse', en: 'Standard Deviation', lt: 'Standartinis nuokrypis' },
        explain: {
          da: 'Måler hvor meget dataene typisk spreder sig omkring middelværdien. Bruges bl.a. til at beregne sikkerhedslager.',
          en: 'Measures how much the data typically spreads around the mean. Used, among other things, to calculate safety stock.',
          lt: 'Matuoja, kiek duomenys paprastai išsibarsto aplink vidurkį. Naudojama, be kita ko, saugos atsargoms apskaičiuoti.'
        },
        formula: 's = √( Σ(x − x̄)² / (n−1) )',
        excel: { da: '=STDAFV.S(A2:A10)', en: '=STDEV.S(A2:A10)' }
      }
    ]
  }
];

function copyFormula(text, btn) {
  navigator.clipboard?.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i>';
    if (window.lucide) lucide.createIcons();
    setTimeout(() => { btn.innerHTML = original; if (window.lucide) lucide.createIcons(); }, 1200);
  }).catch(() => alert(text));
}

function renderGuide() {
  const lang = localStorage.getItem(LANG_KEY) || 'da';
  const excelLang = lang === 'da' ? 'da' : 'en'; // Excel formulas shown in Danish or English syntax; Lithuanian Excel commonly used in English
  const container = document.getElementById('guide-content');
  if (!container) return;

  container.innerHTML = GUIDE_GROUPS.map((group, gi) => `
    <div class="card p-5">
      <h4 class="font-bold mb-3 flex items-center gap-2">${group.icon} ${escapeHTML(group.label[lang] || group.label.da)}</h4>
      <div class="space-y-2">
        ${group.items.map((item, ii) => `
          <details class="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <summary class="cursor-pointer list-none flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-sm font-medium">
              <span>${escapeHTML(item.title[lang] || item.title.da)}</span>
              <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180"></i>
            </summary>
            <div class="px-4 pb-4 pt-1 space-y-3">
              <p class="explain">${escapeHTML(item.explain[lang] || item.explain.da)}</p>
              <div>
                <p class="text-[11px] font-semibold text-slate-500 mb-1">${lang === 'en' ? 'Formula' : lang === 'lt' ? 'Formulė' : 'Matematisk formel'}</p>
                <p class="font-mono text-sm px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800">${escapeHTML(item.formula)}</p>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-slate-500 mb-1">Excel</p>
                <div class="flex items-center gap-2">
                  <code class="flex-1 font-mono text-sm px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 overflow-x-auto">${escapeHTML(item.excel[excelLang] || item.excel.en)}</code>
                  <button class="guide-copy-btn flex-shrink-0 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" data-formula="${escapeHTML(item.excel[excelLang] || item.excel.en)}" title="${lang === 'en' ? 'Copy formula' : lang === 'lt' ? 'Kopijuoti formulę' : 'Kopier formel'}">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            </div>
          </details>`).join('')}
      </div>
    </div>`).join('');

  container.querySelectorAll('.guide-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => copyFormula(btn.dataset.formula, btn));
  });
  if (window.lucide) lucide.createIcons();
}

