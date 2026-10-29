/* ---------------- LANDING PAGE ---------------- */
const LANDING_CONTENT = {
  hero: {
    title: { da: 'LogistikCalc', en: 'LogistikCalc', lt: 'LogistikCalc' },
    subtitle: { da: 'Beregn lager, transport, kapacitet og økonomi ét sted — og eksportér dokumenterede resultater til Excel, PDF eller Word.', en: 'Calculate inventory, transport, capacity and finance in one place — and export documented results to Excel, PDF or Word.', lt: 'Skaičiuokite atsargas, transportą, talpą ir finansus vienoje vietoje — ir eksportuokite dokumentuotus rezultatus į Excel, PDF ar Word.' },
    disclaimer: { da: 'LogistikCalc er en tidlig prototype og studieprojekt — ikke et færdigt kommercielt system. Beregningerne bygger på forenklede modeller; se forudsætninger og kilder under hvert modul.', en: 'LogistikCalc is an early prototype and study project — not a finished commercial system. Calculations are based on simplified models; see assumptions and sources under each module.', lt: 'LogistikCalc yra ankstyvas prototipas ir studijų projektas — ne baigta komercinė sistema. Skaičiavimai grindžiami supaprastintais modeliais; prielaidos ir šaltiniai nurodyti prie kiekvieno modulio.' },
    cta: { da: 'Start beregning', en: 'Start Calculating', lt: 'Pradėti skaičiuoti' }
  },
  quickCats: {
    title: { da: 'Eller gå direkte til en kategori', en: 'Or jump straight to a category', lt: 'Arba pereikite tiesiai prie kategorijos' },
    items: [
      { cat: 'lager', icon: '📦', title: { da: 'Lager & Indkøb', en: 'Inventory & Purchasing', lt: 'Atsargos ir pirkimai' }, text: { da: 'Optimér ordrestørrelse, sikkerhedslager og leverandørers totalomkostning (TCO).', en: 'Optimize order quantity, safety stock and supplier total cost of ownership (TCO).', lt: 'Optimizuokite užsakymo dydį, saugos atsargas ir tiekėjų bendrą nuosavybės sąnaudą (TCO).' } },
      { cat: 'transport', icon: '🚛', title: { da: 'Transport', en: 'Transport', lt: 'Transportas' }, text: { da: 'Ruteafstand, køre- & hviletid, trailerkapacitet og fragtomkostninger.', en: 'Route distance, driving/rest time, trailer capacity and freight cost.', lt: 'Maršruto atstumas, vairavimo/poilsio laikas, priekabos talpa ir vežimo sąnaudos.' } },
      { cat: 'okonomi', icon: '📊', title: { da: 'Økonomi & Nøgletal', en: 'Finance & Ratios', lt: 'Finansai ir rodikliai' }, text: { da: 'Se hvordan logistiske beslutninger påvirker nøgletal, likviditet og break-even.', en: 'See how logistics decisions affect ratios, liquidity and break-even.', lt: 'Sužinokite, kaip logistikos sprendimai veikia rodiklius, likvidumą ir lūžio tašką.' } },
      { cat: 'budget', icon: '💰', title: { da: 'Budget & Løn', en: 'Budget & Payroll', lt: 'Biudžetas ir atlyginimai' }, text: { da: 'Resultatbudget, likviditetsbudget og lønomkostninger.', en: 'Income budget, cash budget and payroll costs.', lt: 'Pelno biudžetas, pinigų srautų biudžetas ir darbo užmokesčio sąnaudos.' } }
    ]
  },
  featuresTitle: { da: 'Hvad kan man med dette værktøj?', en: 'What can this tool do?', lt: 'Ką gali šis įrankis?' },
  features: [
    {
      icon: '📦', title: { da: 'Lageroptimering & Kapacitetssimulering', en: 'Inventory Optimization & Capacity Simulation', lt: 'Atsargų optimizavimas ir talpos simuliacija' },
      what: { da: 'Beregner optimal ordrestørrelse (Wilson/EOQ) og produktionsstørrelse (POQ) ud fra klassiske, forenklede modeller. Simulerer lagerkapacitet og ugentlige varestrømme samt sikkerhedslager og genbestillingspunkt (ROP).', en: 'Calculates optimal order quantity (Wilson/EOQ) and production quantity (POQ) using classic, simplified models. Simulates warehouse capacity and weekly flows, plus safety stock and reorder point (ROP).', lt: 'Apskaičiuoja optimalų užsakymo dydį (Wilson/EOQ) ir gamybos dydį (POQ) pagal klasikinius, supaprastintus modelius. Simuliuoja sandėlio talpą, savaitės srautus, saugos atsargas ir užsakymo tašką (ROP).' },
      value: { da: 'Kan hjælpe med at synliggøre kapitalbinding og pege på risiko for flaskehalse eller kapacitetspres — som beslutningsstøtte, ikke facit.', en: 'Can help visualize tied-up capital and flag risk of bottlenecks or capacity pressure — as decision support, not a definitive answer.', lt: 'Padeda įžvelgti įšaldytą kapitalą ir kliūčių ar talpos spaudimo riziką — kaip sprendimų pagalbą, ne galutinį atsakymą.' }
    },
    {
      icon: '🚛', title: { da: 'Transport, Ruteplanlægning & Regler', en: 'Transport, Route Planning & Regulations', lt: 'Transportas, maršrutai ir taisyklės' },
      what: { da: 'Henter vejdata mellem byer via en ekstern korttjeneste (OpenStreetMap), beregner fragtomkostninger pr. enhed/km og viser EU køre- og hviletidsregler samt trailerkapacitet.', en: 'Fetches road data between cities via an external map service (OpenStreetMap), calculates freight cost per unit/km, and shows EU driving/rest time rules and trailer capacity.', lt: 'Gauna kelių duomenis tarp miestų per išorinę žemėlapių paslaugą (OpenStreetMap), apskaičiuoja vežimo sąnaudas ir rodo ES vairavimo/poilsio taisykles bei priekabos talpą.' },
      value: { da: 'Giver overblik over omkostninger og regler til brug som beslutningsstøtte. Ikke juridisk rådgivning — tjek altid gældende lovgivning.', en: 'Gives an overview of costs and rules for decision support. Not legal advice — always check current legislation.', lt: 'Suteikia sąnaudų ir taisyklių apžvalgą sprendimams paremti. Tai nėra teisinė konsultacija — visada tikrinkite galiojančius teisės aktus.' }
    },
    {
      icon: '📊', title: { da: 'Erhvervsøkonomi & Nøgletalsanalyse', en: 'Business Finance & Ratio Analysis', lt: 'Verslo ekonomika ir rodiklių analizė' },
      what: { da: 'Nøgletalsberegninger (ROA, ROE, Soliditet, Likviditetsgrader) samt resultatbudgetter, likviditetsbudgetter og Break-even analyser efter standard-definitioner.', en: 'Ratio calculations (ROA, ROE, Equity Ratio, Liquidity Ratios), plus income budgets, cash budgets, and break-even analysis using standard definitions.', lt: 'Rodiklių skaičiavimai (ROA, ROE, nuosavo kapitalo ir likvidumo rodikliai), pelno ir likvidumo biudžetai bei lūžio taško analizė pagal standartinius apibrėžimus.' },
      value: { da: 'Giver et hurtigt finansielt øjebliksbillede — suppler altid med det pensum-materiale og de definitioner, din uddannelse bruger.', en: 'Gives a quick financial snapshot — always supplement with the syllabus material and definitions your programme uses.', lt: 'Suteikia greitą finansinį vaizdą — visada papildykite programos medžiaga ir apibrėžimais.' }
    },
    {
      icon: '🤖', title: { da: 'Dokument-Scanner & Multi-Case Styring', en: 'Document Scanner & Multi-Case Management', lt: 'Dokumentų skaitytuvas ir kelių atvejų valdymas' },
      what: { da: 'Genkender kendte nøgletal (fx "efterspørgsel på 12.000 stk") i Word- og PDF-dokumenter via tekstgenkendelse (regex) og udfylder relevante felter automatisk. Skift frit mellem uafhængige case-arbejdsrum.', en: 'Recognizes known key figures (e.g. "demand: 12,000 units") in Word and PDF documents via text pattern matching (regex) and fills in relevant fields automatically. Freely switch between independent case workspaces.', lt: 'Atpažįsta žinomus rodiklius (pvz., "paklausa: 12000 vnt.") Word ir PDF dokumentuose naudojant teksto atpažinimą (regex) ir automatiškai užpildo laukus. Laisvai perjunkite tarp nepriklausomų atvejų.' },
      value: { da: 'Kan spare tid ved caseløsning — men gennemgå altid de udfyldte tal, da genkendelsen er tekstmønster-baseret og ikke ufejlbarlig.', en: 'Can save time when solving cases — but always review the filled-in numbers, since recognition is pattern-based and not infallible.', lt: 'Gali sutaupyti laiko sprendžiant atvejus — bet visada peržiūrėkite užpildytus skaičius, nes atpažinimas grįstas šablonais ir nėra neklystantis.' }
    }
  ],
  audienceTitle: { da: 'Hvordan hjælper det dig?', en: 'How does it help you?', lt: 'Kaip tai jums padeda?' },
  audiences: [
    {
      icon: '🏢', title: { da: 'For virksomheder', en: 'For businesses', lt: 'Verslui' },
      points: {
        da: ['Et hurtigt supplement til manuelle Excel-beregninger — ikke en erstatning for et fuldt ERP-system.', 'Genererer rapporter (PDF) og redigerbare regneark (Excel), som kan bruges som udgangspunkt for videre arbejde.', 'Indtastede tal gemmes kun lokalt i din browser. Bemærk: ruteopslag mellem byer sender bynavne til en ekstern korttjeneste.'],
        en: ['A quick supplement to manual Excel calculations — not a replacement for a full ERP system.', 'Generates reports (PDF) and editable spreadsheets (Excel) that can be used as a starting point for further work.', 'Entered figures are only stored locally in your browser. Note: route lookups between cities send city names to an external map service.'],
        lt: ['Greitas papildymas rankiniams Excel skaičiavimams — ne visaverčio ERP sistemos pakaitalas.', 'Generuoja ataskaitas (PDF) ir redaguojamas lenteles (Excel), kurias galima naudoti kaip tolesnio darbo pagrindą.', 'Įvesti skaičiai saugomi tik jūsų naršyklėje. Pastaba: maršrutų paieška tarp miestų siunčia miestų pavadinimus į išorinę žemėlapių paslaugą.']
      }
    },
    {
      icon: '🎓', title: { da: 'For elever & studerende (UCL)', en: 'For students (UCL)', lt: 'Studentams (UCL)' },
      points: {
        da: ['Udviklet som et lærings- og træningsværktøj til undervisning og opgaveløsning.', 'Integreret Formel- & Excel-guide, der viser hvordan man selv bygger formlerne.', 'Husk at følge de præcise definitioner og forudsætninger, din uddannelse og dine undervisere bruger.'],
        en: ['Developed as a learning and training tool for teaching and assignment work.', 'Integrated Formula & Excel Guide showing exactly how to build the formulas yourself.', 'Remember to follow the exact definitions and assumptions used by your programme and instructors.'],
        lt: ['Sukurtas kaip mokymosi ir treniravimosi įrankis mokymui ir užduočių sprendimui.', 'Integruotas formulių ir Excel vadovas, rodantis, kaip pačiam sukurti formules.', 'Nepamirškite laikytis tikslių apibrėžimų ir prielaidų, kurias naudoja jūsų programa ir dėstytojai.']
      }
    }
  ],
  about: {
    title: { da: 'Om projektet', en: 'About the project', lt: 'Apie projektą' },
    text: {
      da: 'LogistikCalc er udviklet som et selvstændigt lærings- og udviklingsprojekt med fokus på logistik, transport og virksomhedsøkonomi. Formålet er at gøre faglige beregninger lettere at gennemføre og forstå ved at kombinere formler, mellemregninger, resultater og forklaringer.\n\nVærktøjet er primært udviklet til undervisning og læring. Beregningerne skal altid vurderes i forhold til den konkrete situation, og resultaterne bør ikke anvendes som eneste beslutningsgrundlag i juridiske, økonomiske eller driftskritiske situationer.',
      en: 'LogistikCalc is developed as an independent learning and development project focused on logistics, transport and business finance. The purpose is to make academic calculations easier to perform and understand by combining formulas, intermediate steps, results and explanations.\n\nThe tool is primarily developed for teaching and learning. Calculations should always be assessed against the specific situation, and results should not be used as the sole basis for decisions in legal, financial or operationally critical situations.',
      lt: 'LogistikCalc sukurta kaip savarankiškas mokymosi ir plėtros projektas, orientuotas į logistiką, transportą ir verslo ekonomiką. Tikslas — palengvinti akademinių skaičiavimų atlikimą ir supratimą, sujungiant formules, tarpinius skaičiavimus, rezultatus ir paaiškinimus.\n\nĮrankis pirmiausia sukurtas mokymui ir mokymuisi. Skaičiavimai visada turi būti vertinami atsižvelgiant į konkrečią situaciją, o rezultatai neturėtų būti vienintelis sprendimų pagrindas teisiniais, finansiniais ar veiklai kritiniais klausimais.'
    }
  },
  sources: {
    title: { da: 'Kilder & metode', en: 'Sources & Methodology', lt: 'Šaltiniai ir metodika' },
    intro: {
      da: 'Beregningerne bygger på klassiske, forenklede modeller fra logistik- og erhvervsøkonomi-pensum. Se forudsætninger under hvert modul.',
      en: 'The calculations are based on classic, simplified models from logistics and business economics curricula. See assumptions under each module.',
      lt: 'Skaičiavimai grindžiami klasikiniais, supaprastintais logistikos ir verslo ekonomikos programų modeliais. Prielaidos nurodytos prie kiekvieno modulio.'
    },
    rows: [
      { model: 'EOQ / Wilson-modellen', source: { da: 'Standard lærebogsmodel (klassisk lagerstyringsteori)', en: 'Standard textbook model (classic inventory theory)', lt: 'Standartinis vadovėlio modelis' } },
      { model: 'POQ / EPQ', source: { da: 'Standard lærebogsmodel (Economic Production Quantity)', en: 'Standard textbook model (Economic Production Quantity)', lt: 'Standartinis vadovėlio modelis' } },
      { model: 'Sikkerhedslager & ROP', source: { da: 'Standard lærebogsmodel (efterspørgselsvariation)', en: 'Standard textbook model (demand variability)', lt: 'Standartinis vadovėlio modelis' } },
      { model: 'Nøgletal (ROA, ROE, Soliditet m.fl.)', source: { da: 'Standard regnskabsanalyse — følg altid din uddannelses egne definitioner', en: 'Standard financial statement analysis — always follow your programme\'s own definitions', lt: 'Standartinė finansinė analizė — visada laikykitės savo programos apibrėžimų' } },
      { model: 'Køre- & hviletid', source: { da: 'EU-forordning (EF) nr. 561/2006 (forenklet gengivelse)', en: 'EU Regulation (EC) No 561/2006 (simplified)', lt: 'ES reglamentas (EB) Nr. 561/2006 (supaprastintas)' } },
      { model: 'Incoterms 2020', source: { da: 'Incoterms® 2020, International Chamber of Commerce (ICC)', en: 'Incoterms® 2020, International Chamber of Commerce (ICC)', lt: 'Incoterms® 2020, Tarptautiniai prekybos rūmai (ICC)' } },
      { model: 'Ruteafstand & -tid', source: { da: 'OpenStreetMap (Nominatim) & OSRM — offentlige, gratis tjenester', en: 'OpenStreetMap (Nominatim) & OSRM — public, free services', lt: 'OpenStreetMap (Nominatim) ir OSRM — vieša, nemokama paslauga' } }
    ],
    lastReviewed: { da: 'Senest fagligt gennemgået', en: 'Last academically reviewed', lt: 'Paskutinį kartą peržiūrėta' }
  }
};

function showApp() {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
}
function showLanding() {
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('landing-page').classList.remove('hidden');
}

function renderLanguageGate() {
  const landing = document.getElementById('landing-page');
  landing.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 p-6">
      <div class="max-w-sm w-full text-center">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 mb-6">
          <i data-lucide="calculator" class="w-7 h-7"></i>
        </div>
        <h1 class="font-display font-extrabold text-lg mb-6">Choose your language<br/>Vælg sprog · Pasirinkite kalbą</h1>
        <div class="grid grid-cols-1 gap-3">
          <button data-lang="da" class="gate-lang-btn px-6 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold text-base transition">🇩🇰 Dansk</button>
          <button data-lang="en" class="gate-lang-btn px-6 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold text-base transition">🇬🇧 English</button>
          <button data-lang="lt" class="gate-lang-btn px-6 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold text-base transition">🇱🇹 Lietuvių</button>
        </div>
      </div>
    </div>`;
  landing.querySelectorAll('.gate-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const select = document.getElementById('lang-select');
      if (select) select.value = btn.dataset.lang;
      applyLanguage(btn.dataset.lang);
    });
  });
  if (window.lucide) lucide.createIcons();
}

function renderLanding() {
  if (!localStorage.getItem(LANG_KEY)) { renderLanguageGate(); return; }
  const lang = localStorage.getItem(LANG_KEY) || 'da';
  const t = (obj) => obj[lang] || obj.da;
  const c = LANDING_CONTENT;

  const landing = document.getElementById('landing-page');
  landing.innerHTML = `
    <div class="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <header class="max-w-6xl mx-auto px-5 pt-8 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <i data-lucide="calculator" class="w-5 h-5"></i>
          </div>
          <p class="font-display font-extrabold text-sm tracking-tight flex items-center gap-1.5">LogistikCalc <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 tracking-wide">BETA</span></p>
        </div>
        <div class="flex items-center gap-2">
          <select id="landing-lang-select" class="!mt-0 !w-auto px-2 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
            <option value="da">🇩🇰 Dansk</option>
            <option value="en">🇬🇧 English</option>
            <option value="lt">🇱🇹 Lietuvių</option>
          </select>
          <button id="landing-theme-toggle" class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
            <i data-lucide="moon" class="w-4 h-4" id="landing-theme-icon"></i>
          </button>
        </div>
      </header>

      <section class="max-w-4xl mx-auto px-5 pt-16 pb-20 text-center">
        <h1 class="font-display font-extrabold text-3xl sm:text-5xl tracking-tight mb-5">${escapeHTML(t(c.hero.title))}</h1>
        <p class="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">${escapeHTML(t(c.hero.subtitle))}</p>
        <button id="landing-cta-btn" class="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform">
          ${escapeHTML(t(c.hero.cta))}
        </button>
        <p class="text-xs text-slate-400 dark:text-slate-500 max-w-xl mx-auto mt-6 flex items-start gap-1.5 text-left sm:text-center sm:items-center sm:justify-center">
          <i data-lucide="info" class="w-3.5 h-3.5 flex-shrink-0 mt-0.5 sm:mt-0"></i> ${escapeHTML(t(c.hero.disclaimer))}
        </p>
      </section>

      <section class="max-w-6xl mx-auto px-5 pb-16">
        <h2 class="font-display font-bold text-lg text-center mb-6 text-slate-500 dark:text-slate-400">${escapeHTML(t(c.quickCats.title))}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${c.quickCats.items.map(q => `
            <button data-quickcat="${q.cat}" class="quickcat-btn card p-5 text-left hover:border-blue-400 dark:hover:border-blue-500 transition">
              <div class="text-2xl mb-2">${q.icon}</div>
              <h3 class="font-bold mb-1.5">${escapeHTML(t(q.title))}</h3>
              <p class="explain">${escapeHTML(t(q.text))}</p>
            </button>`).join('')}
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-5 pb-16">
        <h2 class="font-display font-bold text-2xl text-center mb-8">${escapeHTML(t(c.featuresTitle))}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          ${c.features.map(f => `
            <div class="card p-6">
              <div class="text-3xl mb-3">${f.icon}</div>
              <h3 class="font-bold mb-2">${escapeHTML(t(f.title))}</h3>
              <p class="explain mb-2"><strong>${lang === 'en' ? 'Capabilities:' : lang === 'lt' ? 'Galimybės:' : 'Hvad kan den?'}</strong> ${escapeHTML(t(f.what))}</p>
              <p class="explain text-emerald-600 dark:text-emerald-400"><strong>${lang === 'en' ? 'Value:' : lang === 'lt' ? 'Nauda:' : 'Værdi:'}</strong> ${escapeHTML(t(f.value))}</p>
            </div>`).join('')}
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-5 pb-24">
        <h2 class="font-display font-bold text-2xl text-center mb-8">${escapeHTML(t(c.audienceTitle))}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          ${c.audiences.map(a => `
            <div class="card p-6">
              <div class="text-3xl mb-3">${a.icon}</div>
              <h3 class="font-bold mb-3">${escapeHTML(t(a.title))}</h3>
              <ul class="space-y-2">
                ${(a.points[lang] || a.points.da).map(p => `<li class="explain flex items-start gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"></i><span>${escapeHTML(p)}</span></li>`).join('')}
              </ul>
            </div>`).join('')}
        </div>
      </section>

      <section class="max-w-3xl mx-auto px-5 pb-16">
        <div class="card p-6">
          <h2 class="font-display font-bold text-xl mb-3 flex items-center gap-2"><i data-lucide="info" class="w-5 h-5 text-slate-400"></i> ${escapeHTML(t(c.about.title))}</h2>
          ${t(c.about.text).split('\n\n').map(para => `<p class="explain mb-3">${escapeHTML(para)}</p>`).join('')}
        </div>
      </section>

      <section class="max-w-3xl mx-auto px-5 pb-16">
        <div class="card p-6">
          <h2 class="font-display font-bold text-xl mb-2 flex items-center gap-2"><i data-lucide="book-marked" class="w-5 h-5 text-slate-400"></i> ${escapeHTML(t(c.sources.title))}</h2>
          <p class="explain mb-4">${escapeHTML(t(c.sources.intro))}</p>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <tbody>
                ${c.sources.rows.map(r => `
                  <tr class="border-t border-slate-200 dark:border-slate-800">
                    <td class="py-2 pr-4 font-medium">${escapeHTML(r.model)}</td>
                    <td class="py-2 text-slate-500 dark:text-slate-400">${escapeHTML(r.source[lang] || r.source.da)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
          <p class="text-[11px] text-slate-400 mt-4">${escapeHTML(t(c.sources.lastReviewed))}: 21.08.2026</p>
        </div>
      </section>

      <p class="text-center text-xs text-slate-400 pb-8">${escapeHTML(t({ da: 'De fleste beregninger udføres lokalt i din browser. Indtastede beregningsdata gemmes ikke på vores server. Ved brug af ruteværktøjet sendes de indtastede lokationer til eksterne kort- og rutetjenester.', en: 'Most calculations run locally in your browser. Entered calculation data is not stored on our server. When using the route tool, the entered locations are sent to external map and routing services.', lt: 'Dauguma skaičiavimų atliekami jūsų naršyklėje. Įvesti skaičiavimo duomenys nesaugomi mūsų serveryje. Naudojant maršruto įrankį, įvestos vietovės siunčiamos į išorines žemėlapių ir maršrutų paslaugas.' }))}</p>
    </div>`;

  document.getElementById('landing-cta-btn').addEventListener('click', showApp);
  landing.querySelectorAll('.quickcat-btn').forEach(btn => {
    btn.addEventListener('click', () => { showApp(); setCategory(btn.dataset.quickcat); });
  });
  const landingLangSelect = document.getElementById('landing-lang-select');
  landingLangSelect.value = lang;
  landingLangSelect.addEventListener('change', () => { applyLanguage(landingLangSelect.value); document.getElementById('lang-select').value = landingLangSelect.value; });
  document.getElementById('landing-theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('regnemaskine_theme', next);
    applyTheme(next);
    renderLanding();
  });
  applyTheme(localStorage.getItem('regnemaskine_theme') || 'light');
  if (window.lucide) lucide.createIcons();
}

function initLandingToggle() {
  document.getElementById('home-btn').addEventListener('click', showLanding);
  showLanding(); // always show the landing page first, on every visit
}

/* ---------------- CATEGORY NAV & SEARCH ---------------- */
function setCategory(cat) {
  document.querySelectorAll('.cat-panel').forEach(p => p.classList.toggle('active', p.id === 'cat-' + cat));
  document.querySelectorAll('.cat-btn').forEach(btn => {
    const active = btn.dataset.cat === cat;
    btn.classList.toggle('bg-blue-600', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('border-blue-600', active);
    btn.classList.toggle('bg-white', !active);
    btn.classList.toggle('dark:bg-slate-900', !active);
    btn.classList.toggle('border-slate-200', !active);
    btn.classList.toggle('dark:border-slate-700', !active);
  });
  localStorage.setItem('regnemaskine_cat', cat);
}

function initSearch() {
  const box = document.getElementById('search-box');
  box.addEventListener('input', () => {
    const q = box.value.trim().toLowerCase();
    if (!q) {
      document.querySelectorAll('.calc-card').forEach(c => c.classList.remove('hidden'));
      return;
    }
    // search across all categories, show only matches, switch to a virtual "all" view
    document.querySelectorAll('.cat-panel').forEach(p => p.classList.add('active'));
    document.querySelectorAll('.calc-card').forEach(card => {
      const text = (card.textContent + ' ' + (card.dataset.keywords || '')).toLowerCase();
      card.classList.toggle('hidden', !text.includes(q));
    });
    if (!box.value) setCategory(localStorage.getItem('regnemaskine_cat') || 'lager');
  });
  box.addEventListener('blur', () => {
    if (!box.value.trim()) setCategory(localStorage.getItem('regnemaskine_cat') || 'lager');
  });
}

