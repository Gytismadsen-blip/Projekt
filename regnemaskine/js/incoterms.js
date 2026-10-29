/* ---------------- INCOTERMS 2020 ---------------- */
const INCOTERMS = {
  EXW: { cost: 2, risk: 2,
    da: { name: 'Ex Works', mode: 'Alle transportformer', mainCarriage: 'Køber', exportCustoms: 'Køber', importCustoms: 'Køber', insurance: 'Ingen krav (køber kan selv vælge)', note: 'Minimal forpligtelse for sælger — varen stilles blot til rådighed på sælgers adresse. Køber står for alt: transport, told (både ud og ind) og risiko fra dag ét.' },
    en: { name: 'Ex Works', mode: 'All modes of transport', mainCarriage: 'Buyer', exportCustoms: 'Buyer', importCustoms: 'Buyer', insurance: 'No requirement (buyer\'s choice)', note: 'Minimal obligation for the seller — the goods are simply made available at the seller\'s premises. The buyer handles everything: transport, customs (both export and import) and risk from day one.' },
    lt: { name: 'Ex Works', mode: 'Visos transporto rūšys', mainCarriage: 'Pirkėjas', exportCustoms: 'Pirkėjas', importCustoms: 'Pirkėjas', insurance: 'Nereikalaujama (pirkėjas gali pasirinkti)', note: 'Minimalus pardavėjo įsipareigojimas — prekė tiesiog paruošiama pardavėjo patalpose. Pirkėjas rūpinasi viskuo: transportu, muitais (išvežimo ir įvežimo) bei rizika nuo pat pirmos dienos.' } },
  FCA: { cost: 15, risk: 15,
    da: { name: 'Free Carrier', mode: 'Alle transportformer', mainCarriage: 'Køber', exportCustoms: 'Sælger', importCustoms: 'Køber', insurance: 'Ingen krav', note: 'Sælger afleverer varen til den transportør, køber har udpeget, og klarer eksporttolden. Herfra overtager køber.' },
    en: { name: 'Free Carrier', mode: 'All modes of transport', mainCarriage: 'Buyer', exportCustoms: 'Seller', importCustoms: 'Buyer', insurance: 'No requirement', note: 'The seller hands the goods to the carrier named by the buyer and clears export customs. The buyer takes over from there.' },
    lt: { name: 'Free Carrier', mode: 'Visos transporto rūšys', mainCarriage: 'Pirkėjas', exportCustoms: 'Pardavėjas', importCustoms: 'Pirkėjas', insurance: 'Nereikalaujama', note: 'Pardavėjas perduoda prekę pirkėjo nurodytam vežėjui ir sutvarko eksporto muitinės formalumus. Nuo šio momento atsakomybę perima pirkėjas.' } },
  FOB: { cost: 30, risk: 30,
    da: { name: 'Free On Board', mode: 'Kun sø-/indlandssejlads', mainCarriage: 'Køber', exportCustoms: 'Sælger', importCustoms: 'Køber', insurance: 'Ingen krav', note: 'Risiko og omkostning overgår, når varen er lastet om bord på skibet i afskibningshavnen.' },
    en: { name: 'Free On Board', mode: 'Sea/inland waterway only', mainCarriage: 'Buyer', exportCustoms: 'Seller', importCustoms: 'Buyer', insurance: 'No requirement', note: 'Risk and cost transfer once the goods are loaded on board the vessel at the port of shipment.' },
    lt: { name: 'Free On Board', mode: 'Tik jūrų/vidaus vandenų transportas', mainCarriage: 'Pirkėjas', exportCustoms: 'Pardavėjas', importCustoms: 'Pirkėjas', insurance: 'Nereikalaujama', note: 'Rizika ir sąnaudos pereina, kai prekė pakraunama į laivą išsiuntimo uoste.' } },
  CFR: { cost: 90, risk: 30,
    da: { name: 'Cost and Freight', mode: 'Kun sø-/indlandssejlads', mainCarriage: 'Sælger (betaler fragt til destination)', exportCustoms: 'Sælger', importCustoms: 'Køber', insurance: 'Ingen krav', note: 'Vigtigt: Risikoen skifter allerede ved indskibning (som FOB), men sælger betaler fragten hele vejen til destinationshavnen.' },
    en: { name: 'Cost and Freight', mode: 'Sea/inland waterway only', mainCarriage: 'Seller (pays freight to destination)', exportCustoms: 'Seller', importCustoms: 'Buyer', insurance: 'No requirement', note: 'Important: risk transfers at shipment (as with FOB), but the seller pays the freight all the way to the destination port.' },
    lt: { name: 'Cost and Freight', mode: 'Tik jūrų/vidaus vandenų transportas', mainCarriage: 'Pardavėjas (apmoka vežimą iki paskirties)', exportCustoms: 'Pardavėjas', importCustoms: 'Pirkėjas', insurance: 'Nereikalaujama', note: 'Svarbu: rizika pereina jau pakrovimo metu (kaip ir FOB atveju), tačiau pardavėjas apmoka vežimą iki paskirties uosto.' } },
  CIF: { cost: 90, risk: 30,
    da: { name: 'Cost, Insurance and Freight', mode: 'Kun sø-/indlandssejlads', mainCarriage: 'Sælger', exportCustoms: 'Sælger', importCustoms: 'Køber', insurance: 'Sælger skal tegne (min. dækning, Institute Cargo Clauses C)', note: 'Som CFR, men sælger skal desuden tegne en minimumsforsikring til fordel for køber.' },
    en: { name: 'Cost, Insurance and Freight', mode: 'Sea/inland waterway only', mainCarriage: 'Seller', exportCustoms: 'Seller', importCustoms: 'Buyer', insurance: 'Seller must arrange (min. cover, Institute Cargo Clauses C)', note: 'Like CFR, but the seller must also arrange minimum insurance for the buyer\'s benefit.' },
    lt: { name: 'Cost, Insurance and Freight', mode: 'Tik jūrų/vidaus vandenų transportas', mainCarriage: 'Pardavėjas', exportCustoms: 'Pardavėjas', importCustoms: 'Pirkėjas', insurance: 'Pardavėjas privalo apdrausti (min. draudimas, Institute Cargo Clauses C)', note: 'Kaip ir CFR, tačiau pardavėjas papildomai privalo sudaryti minimalų draudimą pirkėjo naudai.' } },
  CPT: { cost: 90, risk: 15,
    da: { name: 'Carriage Paid To', mode: 'Alle transportformer', mainCarriage: 'Sælger (betaler transport til destination)', exportCustoms: 'Sælger', importCustoms: 'Køber', insurance: 'Ingen krav', note: 'Risikoen skifter allerede når varen afleveres til den FØRSTE transportør — men sælger betaler transporten hele vejen.' },
    en: { name: 'Carriage Paid To', mode: 'All modes of transport', mainCarriage: 'Seller (pays carriage to destination)', exportCustoms: 'Seller', importCustoms: 'Buyer', insurance: 'No requirement', note: 'Risk transfers already when the goods are handed to the FIRST carrier — but the seller pays for carriage the whole way.' },
    lt: { name: 'Carriage Paid To', mode: 'Visos transporto rūšys', mainCarriage: 'Pardavėjas (apmoka vežimą iki paskirties)', exportCustoms: 'Pardavėjas', importCustoms: 'Pirkėjas', insurance: 'Nereikalaujama', note: 'Rizika pereina jau perdavus prekę PIRMAJAM vežėjui — tačiau pardavėjas apmoka visą vežimą.' } },
  CIP: { cost: 90, risk: 15,
    da: { name: 'Carriage and Insurance Paid To', mode: 'Alle transportformer', mainCarriage: 'Sælger', exportCustoms: 'Sælger', importCustoms: 'Køber', insurance: 'Sælger skal tegne (høj dækning, Institute Cargo Clauses A)', note: 'Som CPT, men med krav om omfattende forsikring fra sælgers side — bruges ofte for værdifulde varer.' },
    en: { name: 'Carriage and Insurance Paid To', mode: 'All modes of transport', mainCarriage: 'Seller', exportCustoms: 'Seller', importCustoms: 'Buyer', insurance: 'Seller must arrange (high cover, Institute Cargo Clauses A)', note: 'Like CPT, but with a requirement for extensive insurance from the seller — often used for high-value goods.' },
    lt: { name: 'Carriage and Insurance Paid To', mode: 'Visos transporto rūšys', mainCarriage: 'Pardavėjas', exportCustoms: 'Pardavėjas', importCustoms: 'Pirkėjas', insurance: 'Pardavėjas privalo apdrausti (didelė dangos, Institute Cargo Clauses A)', note: 'Kaip ir CPT, tačiau reikalaujama platesnio pardavėjo draudimo — dažnai naudojama vertingoms prekėms.' } },
  DAP: { cost: 92, risk: 92,
    da: { name: 'Delivered At Place', mode: 'Alle transportformer', mainCarriage: 'Sælger', exportCustoms: 'Sælger', importCustoms: 'Køber', insurance: 'Ingen krav', note: 'Sælger bærer alt frem til den aftalte destination — klar til aflæsning, men IKKE aflæsset. Køber står for import-fortoldning.' },
    en: { name: 'Delivered At Place', mode: 'All modes of transport', mainCarriage: 'Seller', exportCustoms: 'Seller', importCustoms: 'Buyer', insurance: 'No requirement', note: 'The seller bears everything to the agreed destination — ready for unloading, but NOT unloaded. The buyer handles import customs clearance.' },
    lt: { name: 'Delivered At Place', mode: 'Visos transporto rūšys', mainCarriage: 'Pardavėjas', exportCustoms: 'Pardavėjas', importCustoms: 'Pirkėjas', insurance: 'Nereikalaujama', note: 'Pardavėjas atsako už viską iki sutartos paskirties vietos — paruošta iškrovimui, bet NEIŠKRAUTA. Pirkėjas tvarko importo muitinės formalumus.' } },
  DPU: { cost: 96, risk: 96,
    da: { name: 'Delivered at Place Unloaded', mode: 'Alle transportformer', mainCarriage: 'Sælger', exportCustoms: 'Sælger', importCustoms: 'Køber', insurance: 'Ingen krav', note: 'Den eneste Incoterm, hvor sælger også skal AFLÆSSE varen på destinationen. Køber klarer stadig importtolden.' },
    en: { name: 'Delivered at Place Unloaded', mode: 'All modes of transport', mainCarriage: 'Seller', exportCustoms: 'Seller', importCustoms: 'Buyer', insurance: 'No requirement', note: 'The only Incoterm where the seller must also UNLOAD the goods at the destination. The buyer still handles import customs.' },
    lt: { name: 'Delivered at Place Unloaded', mode: 'Visos transporto rūšys', mainCarriage: 'Pardavėjas', exportCustoms: 'Pardavėjas', importCustoms: 'Pirkėjas', insurance: 'Nereikalaujama', note: 'Vienintelė Incoterms sąlyga, kai pardavėjas taip pat privalo IŠKRAUTI prekę paskirties vietoje. Importo muitinę vis tiek tvarko pirkėjas.' } },
  DDP: { cost: 100, risk: 100,
    da: { name: 'Delivered Duty Paid', mode: 'Alle transportformer', mainCarriage: 'Sælger', exportCustoms: 'Sælger', importCustoms: 'Sælger', insurance: 'Ingen krav', note: 'Maksimal forpligtelse for sælger: leverer helt frem til køber, inkl. betalt importtold og afgifter. Køber skal reelt kun modtage varen.' },
    en: { name: 'Delivered Duty Paid', mode: 'All modes of transport', mainCarriage: 'Seller', exportCustoms: 'Seller', importCustoms: 'Seller', insurance: 'No requirement', note: 'Maximum obligation for the seller: delivers all the way to the buyer, including paid import duty and taxes. The buyer essentially only needs to receive the goods.' },
    lt: { name: 'Delivered Duty Paid', mode: 'Visos transporto rūšys', mainCarriage: 'Pardavėjas', exportCustoms: 'Pardavėjas', importCustoms: 'Pardavėjas', insurance: 'Nereikalaujama', note: 'Didžiausias pardavėjo įsipareigojimas: pristato prekę tiesiai pirkėjui, įskaitant apmokėtus importo muitus ir mokesčius. Pirkėjui belieka tik priimti prekę.' } }
};

function renderIncotermsGrid() {
  const grid = document.getElementById('incoterms-grid');
  grid.innerHTML = Object.keys(INCOTERMS).map(code => `
    <button data-term="${code}" class="incoterm-btn text-xs font-bold py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-500">${code}</button>`).join('');
  grid.querySelectorAll('.incoterm-btn').forEach(btn => btn.addEventListener('click', () => selectIncoterm(btn.dataset.term)));
  selectIncoterm('FOB');
}

const INCOTERM_UI_STRINGS = {
  da: { costLabel: 'Omkostninger — Sælger betaler indtil:', riskLabel: 'Risiko — Sælger bærer risikoen indtil:', origin: 'Sælgers fabrik', dest: 'Købers lager', mainCarriage: 'Hovedtransport', exportCustoms: 'Eksporttold', importCustoms: 'Importtold', insurance: 'Forsikring' },
  en: { costLabel: 'Costs — Seller pays until:', riskLabel: 'Risk — Seller bears risk until:', origin: "Seller's factory", dest: "Buyer's warehouse", mainCarriage: 'Main carriage', exportCustoms: 'Export customs', importCustoms: 'Import customs', insurance: 'Insurance' },
  lt: { costLabel: 'Sąnaudos — pardavėjas apmoka iki:', riskLabel: 'Rizika — pardavėjas atsako iki:', origin: 'Pardavėjo gamykla', dest: 'Pirkėjo sandėlis', mainCarriage: 'Pagrindinis vežimas', exportCustoms: 'Eksporto muitai', importCustoms: 'Importo muitai', insurance: 'Draudimas' }
};

function selectIncoterm(code) {
  const lang = localStorage.getItem(LANG_KEY) || 'da';
  const t = INCOTERMS[code][lang] || INCOTERMS[code].da;
  const cost = INCOTERMS[code].cost, risk = INCOTERMS[code].risk;
  const ui = INCOTERM_UI_STRINGS[lang] || INCOTERM_UI_STRINGS.da;

  document.querySelectorAll('.incoterm-btn').forEach(btn => {
    const active = btn.dataset.term === code;
    btn.classList.toggle('bg-blue-600', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('border-blue-600', active);
  });

  const panel = document.getElementById('incoterms-panel');
  panel.innerHTML = `
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 fade-in">
      <p class="font-bold text-sm mb-0.5">${code} — ${escapeHTML(t.name)}</p>
      <p class="text-[11px] text-slate-400 mb-3">${escapeHTML(t.mode)}</p>

      <p class="text-[11px] font-semibold text-slate-500 mb-1">${escapeHTML(ui.costLabel)}</p>
      <div class="flex h-2.5 rounded-full overflow-hidden mb-1">
        <div style="width:${cost}%; background:#2563eb"></div>
        <div style="width:${100 - cost}%; background:#cbd5e1"></div>
      </div>
      <div class="flex justify-between text-[10px] text-slate-400 mb-3"><span>${escapeHTML(ui.origin)}</span><span>${escapeHTML(ui.dest)}</span></div>

      <p class="text-[11px] font-semibold text-slate-500 mb-1">${escapeHTML(ui.riskLabel)}</p>
      <div class="flex h-2.5 rounded-full overflow-hidden mb-1">
        <div style="width:${risk}%; background:#dc2626"></div>
        <div style="width:${100 - risk}%; background:#cbd5e1"></div>
      </div>
      <div class="flex justify-between text-[10px] text-slate-400 mb-4"><span>${escapeHTML(ui.origin)}</span><span>${escapeHTML(ui.dest)}</span></div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
        <div><p class="text-[10px] text-slate-400">${escapeHTML(ui.mainCarriage)}</p><p class="font-medium">${escapeHTML(t.mainCarriage)}</p></div>
        <div><p class="text-[10px] text-slate-400">${escapeHTML(ui.exportCustoms)}</p><p class="font-medium">${escapeHTML(t.exportCustoms)}</p></div>
        <div><p class="text-[10px] text-slate-400">${escapeHTML(ui.importCustoms)}</p><p class="font-medium">${escapeHTML(t.importCustoms)}</p></div>
        <div><p class="text-[10px] text-slate-400">${escapeHTML(ui.insurance)}</p><p class="font-medium">${escapeHTML(t.insurance)}</p></div>
      </div>
      <p class="explain">${escapeHTML(t.note)}</p>
    </div>`;
  if (window.lucide) lucide.createIcons();
}

