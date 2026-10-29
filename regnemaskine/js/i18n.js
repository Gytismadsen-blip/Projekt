/* ---------------- LANGUAGE / I18N ---------------- */
const LANG_KEY = 'regnemaskine_lang';

const TRANSLATIONS = {
  en: {
    // Header / chrome
    'Logistik & Økonomi · Studieprojekt': 'Logistics & Finance · Study Project',
    'Aktiv Virksomhedscase': 'Active Business Case',
    'Mine foretrukne værktøjer': 'My Favorite Tools',
    // Categories
    'Lager & Indkøb': 'Inventory & Purchasing',
    'Transport': 'Transport',
    'Økonomi & Nøgletal': 'Finance & Key Ratios',
    'Budget & Løn': 'Budget & Payroll',
    'Produktion': 'Production',
    'Statistik & Sandsynlighed': 'Statistics & Probability',
    // Buttons
    'Beregn / Calculate': 'Calculate',
    'Tilføj lokation / Add location': 'Add location',
    'Eksportér PDF-rapport': 'Export PDF Report',
    'Overfør Standardafvigelse til Sikkerhedslager': 'Transfer Std. Dev. to Safety Stock',
    'Datasikkerhed: De fleste beregninger udføres lokalt i din browser, og beregningsdata gemmes ikke på LogistikCalcs server. Nogle funktioner, eksempelvis ruteplanlægning, anvender eksterne tjenester — her kan nødvendige oplysninger såsom indtastede lokationer blive sendt til den eksterne tjeneste for at gennemføre beregningen. Eksporterede filer gemmes kun, hvor du selv vælger at gemme dem.': 'Data privacy: Most calculations run locally in your browser, and calculation data is not stored on LogistikCalc\'s server. Some features, such as route planning, use external services — when using these, necessary information such as entered locations may be sent to the external service to perform the calculation. Exported files are only saved where you choose to save them.',
    // Card titles
    'Afkastningsgrad': 'Return on Assets',
    'Aktivernes omsætningshastighed': 'Asset Turnover',
    'Break-even analyse': 'Break-even Analysis',
    'Chaufførens Køre- & Hviletid': "Driver's Hours",
    'Dækningsbidrag': 'Contribution Margin',
    'EOQ — Optimal ordrestørrelse': 'EOQ — Optimal Order Quantity',
    'Egenkapitalforrentning': 'Return on Equity',
    'Fragtomkostning': 'Freight Cost',
    'Gennemløbstid': 'Throughput Time',
    'Incoterms 2020 — Risiko- & Omkostningsfordeling': 'Incoterms 2020 — Risk & Cost Allocation',
    'Kapacitetsudnyttelse': 'Capacity Utilization',
    'Lageromsætningshastighed': 'Inventory Turnover',
    'Estimeret lastbil- & trailerkapacitet': 'Estimated Truck & Trailer Capacity',
    'Likviditetsbudget': 'Cash Budget',
    'Likviditetsgrad 1': 'Current Ratio',
    'Likviditetsgrad 2': 'Quick Ratio',
    'Lønomkostning (arbejdsgiver)': 'Payroll Cost (Employer)',
    'Middelværdi, Median & Typetal': 'Mean, Median & Mode',
    'Normalfordeling — Sandsynlighed': 'Normal Distribution — Probability',
    'Optimal lagerplacering': 'Optimal Warehouse Location',
    'Overskudsgrad': 'Profit Margin',
    'POQ / EPQ — Optimal produktionsstørrelse': 'POQ / EPQ — Optimal Production Quantity',
    'Resultatbudget': 'Income Budget',
    'Ruteafstand & Køretid': 'Route Distance & Drive Time',
    'Sikkerhedslager & ROP': 'Safety Stock & Reorder Point',
    'Soliditetsgrad': 'Equity Ratio',
    'Standardafvigelse & Varians': 'Standard Deviation & Variance',
    'Dynamic Warehouse Capacity & Flow Simulator (WMS)': 'Dynamic Warehouse Capacity & Flow Simulator (WMS)',
    // Field labels
    'ATP + AES m.m./md. (kr)': 'ATP + AES etc./month (DKK)',
    'Afstand (km)': 'Distance (km)',
    'Antal enheder/paller': 'Units/pallets',
    'Antal i proces, WIP': 'Units in process (WIP)',
    'Bruttoløn/måned (kr)': 'Gross salary/month (DKK)',
    'Datasæt': 'Data set',
    'Egenkapital (kr)': 'Equity (DKK)',
    'Faktisk output': 'Actual output',
    'Faste omk./år (kr)': 'Fixed costs/year (DKK)',
    'Faste omkostninger (kr)': 'Fixed costs (DKK)',
    'Feriepenge (%)': 'Holiday pay (%)',
    'Forventede indbetalinger (kr)': 'Expected cash inflows (DKK)',
    'Forventede udbetalinger (kr)': 'Expected cash outflows (DKK)',
    'Forventet omsætning (kr)': 'Expected revenue (DKK)',
    'Forventet salg (stk)': 'Expected sales (units)',
    'Fra by': 'From city',
    'Gennemløbsrate (stk/time)': 'Throughput rate (units/hour)',
    'Gns. dagligt forbrug': 'Avg. daily demand',
    'Gns. lagerværdi (kr)': 'Avg. inventory value (DKK)',
    'Godsets volumen (m³)': 'Cargo volume (m³)',
    'Godsets vægt (kg)': 'Cargo weight (kg)',
    'Indkøbspris (kr)': 'Purchase price (DKK)',
    'Kortfristet gæld (kr)': 'Current liabilities (DKK)',
    'Kvalitet & spild (kr)': 'Quality & waste (DKK)',
    'Køretøj': 'Vehicle',
    'Køretøjets egenvægt (kg)': 'Vehicle tare weight (kg)',
    'Lager & håndtering (kr)': 'Storage & handling (DKK)',
    'Lageromk./stk H (kr)': 'Holding cost/unit H (DKK)',
    'Leveringstid (dage)': 'Lead time (days)',
    'Likvid beholdning, primo (kr)': 'Opening cash balance (DKK)',
    'Maks. kapacitet': 'Max capacity',
    'Maks. køretid pr. dag (timer)': 'Max driving time/day (hours)',
    'Middelværdi μ': 'Mean μ',
    'Omstillingsomk. S (kr)': 'Setup cost S (DKK)',
    'Omsætning (kr)': 'Revenue (DKK)',
    'Omsætningsaktiver (kr)': 'Current assets (DKK)',
    'Ordreomk. S (kr)': 'Order cost S (DKK)',
    'Pension, arbejdsgiver (%)': 'Employer pension (%)',
    'Produktionsrate p (stk/år)': 'Production rate p (units/year)',
    'Resultat før renter (kr)': 'EBIT (DKK)',
    'Salgspris/stk (kr)': 'Selling price/unit (DKK)',
    'Samlede aktiver (kr)': 'Total assets (DKK)',
    'Servicegrad': 'Service level',
    'Std.afv. i forbrug': 'Std.dev. of demand',
    'Std.afvigelse σ': 'Std.dev. σ',
    'Til by': 'To city',
    'Tilladt totalvægt, vogntog (kg)': 'Max gross weight, combination (kg)',
    'Total fragtomk. (kr)': 'Total freight cost (DKK)',
    'Trailer længde × bredde × højde (m)': 'Trailer L×W×H (m)',
    'Transport & told (kr)': 'Freight & duty (DKK)',
    'Vareforbrug/år (kr)': 'COGS/year (DKK)',
    'Varelager (kr)': 'Inventory (DKK)',
    'Variabel omk./stk (kr)': 'Variable cost/unit (DKK)',
    'Variable omk. (% af oms.)': 'Variable costs (% of revenue)',
    'Værdi x': 'Value x',
    'Årets resultat (kr)': 'Net income (DKK)',
    'Årsforbrug D (stk)': 'Annual demand D (units)',
    'Ønsket køretid i alt (timer)': 'Total desired driving time (hours)',
    // Explain paragraphs
    'Bruges når varer produceres selv (ikke købes) — produktionsraten p er højere end forbrugsraten d.': 'Used when goods are produced in-house (not purchased) — the production rate p is higher than the demand rate d.',
    'Den reelle omkostning ved et indkøb — ikke kun indkøbsprisen.': 'The real cost of a purchase — not just the purchase price.',
    'EU\'s køre- og hviletidsregler for erhvervschauffører: pause hver 4½ time, maks. køretid pr. dag, og krav om døgnhvile.': "The EU's driving and rest time rules for professional drivers: a break every 4.5 hours, max. daily driving time, and a requirement for daily rest.",
    'Et simpelt budget for forventet resultat i en periode.': 'A simple budget for the expected result in a period.',
    'Finder det vægtede "tyngdepunkt" for et lager/distributionscenter ud fra kundelokationer (X,Y) og efterspørgsel.': 'Finds the weighted "center of gravity" for a warehouse/distribution center based on customer locations (X,Y) and demand.',
    'Hvad ejerne får i afkast af deres investerede kapital.': "What return the owners get on their invested capital.",
    'Hvad en medarbejder reelt koster virksomheden — ikke kun bruttolønnen.': 'What an employee actually costs the company — not just the gross salary.',
    'Hvad hver solgte enhed reelt bidrager med til at dække faste omkostninger og overskud.': 'What each unit sold actually contributes to covering fixed costs and profit.',
    'Hvor effektivt virksomhedens samlede aktiver skaber overskud — uafhængigt af finansiering.': "How efficiently the company's total assets generate profit — independent of financing.",
    'Hvor lang tid en enhed i gennemsnit er "i systemet".': 'How long a unit spends "in the system" on average.',
    'Hvor mange enheder der skal sælges, før virksomheden hverken taber eller tjener penge.': 'How many units must be sold before the company neither loses nor earns money.',
    'Hvor mange gange lageret bliver "vendt rundt" på et år. Høj = effektiv, lav = kapitalbinding.': 'How many times inventory is "turned over" in a year. High = efficient, low = capital tied up.',
    'Hvor mange kroner omsætning hver krone i aktiver genererer.': 'How many kroner of revenue each krone in assets generates.',
    'Hvor meget dataene i gennemsnit spreder sig omkring middelværdien.': 'How much the data, on average, spreads out around the mean.',
    'Hvor meget ekstra lager der skal ligge som buffer, og hvornår der skal genbestilles.': 'How much extra stock should be kept as a buffer, and when to reorder.',
    'Beregn om godset umiddelbart kan være inden for køretøjets angivne vægt- og volumenkapacitet. Vigtig begrænsning: beregningen er vejledende og tager ikke automatisk højde for bl.a. akseltryk, vægtfordeling, køretøjets registrerede specifikationer, nationale vægtgrænser, lastsikring eller særlige vejrestriktioner. Et resultat under den samlede vægtgrænse er derfor ikke i sig selv dokumentation for, at transporten er lovlig.': 'Calculate whether the cargo appears to fit within the vehicle\'s stated weight and volume capacity. Important limitation: the calculation is indicative and does not automatically account for axle load, weight distribution, the vehicle\'s registered specifications, national weight limits, load securing, or special road restrictions, among other things. A result below the total weight limit is therefore not, by itself, proof that the transport is legal.',
    'Hvor stor en andel af virksomheden der er finansieret med egne penge frem for gæld.': 'How large a share of the company is financed with own funds rather than debt.',
    'Hvor stor en del af den maksimale kapacitet der reelt bliver brugt.': 'How much of the maximum capacity is actually being used.',
    'Hvor stor en del af omsætningen der bliver til overskud, før renter.': 'How much of revenue turns into profit, before interest.',
    'Indtast tal adskilt med komma, fx: 12, 15, 15, 18, 20, 22, 30': 'Enter numbers separated by commas, e.g.: 12, 15, 15, 18, 20, 22, 30',
    'Kan virksomheden dække sin kortfristede gæld med sine omsætningsaktiver?': 'Can the company cover its current liabilities with its current assets?',
    'Klik på et leveringsbetingelse for at se, hvor på ruten omkostninger og risiko går fra sælger til køber.': 'Click a delivery term to see where along the route costs and risk pass from seller to buyer.',
    'Pris pr. enhed og pr. km — godt til at sammenligne transportformer/ruter.': 'Price per unit and per km — useful for comparing transport modes/routes.',
    'Sandsynligheden for at en værdi ligger under/over x, givet middelværdi og spredning (bruges bl.a. til servicegrad).': 'The probability that a value lies below/above x, given the mean and standard deviation (used e.g. for service levels).',
    'Som Likviditetsgrad 1, men uden varelager (det mest "usikre" aktiv at omsætte hurtigt).': 'Like Current Ratio, but excluding inventory (the most "uncertain" asset to convert quickly).',
    'Viser om der er penge nok i kassen — uafhængigt af om der er overskud på papiret.': "Shows whether there is enough cash on hand — regardless of whether there's a profit on paper.",
    'Wilson-modellen. Finder den ordrestørrelse der minimerer summen af ordre- og lageromkostninger.': 'The Wilson model. Finds the order quantity that minimizes the sum of ordering and holding costs.',
    'Søg efter en beregner… (fx EOQ, likviditet, ROE, freight, payroll)': 'Search for a calculator… (e.g. EOQ, liquidity, ROE, freight, payroll)',
    'Simulerer din lagerudnyttelse denne uge ud fra forventet ind- og udgående varestrøm.': 'Simulates your warehouse utilization this week based on expected inbound and outbound flow.',
    'Total lagerkapacitet (pallepladser)': 'Total warehouse capacity (pallet spaces)',
    'Nuværende lagerbeholdning': 'Current inventory',
    'Inbound denne uge': 'Inbound this week',
    'Outbound denne uge': 'Outbound this week',
    'Trailertype': 'Trailer type',
    'Datasikkerhed: De fleste beregninger udføres lokalt i din browser, og beregningsdata gemmes ikke på LogistikCalcs server. Nogle funktioner, eksempelvis ruteplanlægning, anvender eksterne tjenester — her kan nødvendige oplysninger såsom indtastede lokationer blive sendt til den eksterne tjeneste for at gennemføre beregningen. Eksporterede filer gemmes kun, hvor du selv vælger at gemme dem, og backups du eksporterer beskyttes med en adgangskode efter eget valg.': 'Data privacy: Most calculations run locally in your browser, and calculation data is not stored on LogistikCalc\'s server. Some features, such as route planning, use external services — when using these, necessary information such as entered locations may be sent to the external service to perform the calculation. Exported files are only saved where you choose to save them, and backups you export are protected with a password of your choice.',
    'Backup virksomhedsdata': 'Backup Business Data',
    'Importér virksomhedsdata': 'Import Business Data',
    'Excel-eksport (Redigerbar)': 'Excel Export (Editable)',
    'Formel- & Excel-guide': 'Formula & Excel Guide',
    'Lær hvordan hver beregning virker på papir — og hvordan du selv bygger den i Excel.': 'Learn how each calculation works on paper — and how to build it yourself in Excel.',
    'AI Case & Document Scanner': 'AI Case & Document Scanner',
    'Upload et Word- (.docx) eller PDF-casedokument. Systemet scanner teksten for kendte nøgletal (efterspørgsel, salgspris, lagerkapacitet m.m.) og udfylder de relevante moduler automatisk.': 'Upload a Word (.docx) or PDF case document. The system scans the text for known key figures (demand, price, warehouse capacity, etc.) and automatically fills in the relevant modules.',
    'Klik for at vælge fil, eller træk den herned': 'Click to select a file, or drag it here',
    'Total Master-Eksport': 'Total Master Export',
    'Eksportér Samlet PDF-Rapport': 'Export Combined PDF Report',
    'Eksportér Redigerbart Excel-Ark (.xlsx)': 'Export Editable Excel Sheet (.xlsx)',
    'Eksportér Word-beregningsrapport (.docx)': 'Export Word Calculation Report (.docx)',
    'Bemærk: Alle felter er forudfyldt med eksempeldata til demonstration. Erstat med dine egne tal, før du bruger resultaterne.': 'Note: All fields are pre-filled with example data for demonstration. Replace with your own figures before using the results.'
  },
  lt: {
    'Logistik & Økonomi · Studieprojekt': 'Logistika ir ekonomika · Studijų projektas',
    'Aktiv Virksomhedscase': 'Aktyvus verslo atvejis',
    'Mine foretrukne værktøjer': 'Mano mėgstamiausi įrankiai',
    'Lager & Indkøb': 'Atsargos ir pirkimai',
    'Transport': 'Transportas',
    'Økonomi & Nøgletal': 'Finansai ir rodikliai',
    'Budget & Løn': 'Biudžetas ir atlyginimai',
    'Produktion': 'Gamyba',
    'Statistik & Sandsynlighed': 'Statistika ir tikimybės',
    'Beregn / Calculate': 'Skaičiuoti',
    'Tilføj lokation / Add location': 'Pridėti vietą',
    'Eksportér PDF-rapport': 'Eksportuoti PDF ataskaitą',
    'Overfør Standardafvigelse til Sikkerhedslager': 'Perkelti standartinį nuokrypį į saugos atsargas',
    'Datasikkerhed: De fleste beregninger udføres lokalt i din browser, og beregningsdata gemmes ikke på LogistikCalcs server. Nogle funktioner, eksempelvis ruteplanlægning, anvender eksterne tjenester — her kan nødvendige oplysninger såsom indtastede lokationer blive sendt til den eksterne tjeneste for at gennemføre beregningen. Eksporterede filer gemmes kun, hvor du selv vælger at gemme dem.': 'Duomenų sauga: dauguma skaičiavimų atliekami jūsų naršyklėje, o skaičiavimo duomenys nesaugomi „LogistikCalc" serveryje. Kai kurios funkcijos, pavyzdžiui, maršruto planavimas, naudoja išorines paslaugas — jas naudojant reikalinga informacija, pvz., įvestos vietovės, gali būti siunčiama į išorinę paslaugą, kad būtų atliktas skaičiavimas. Eksportuoti failai išsaugomi tik ten, kur patys pasirenkate juos išsaugoti.',
    'Afkastningsgrad': 'Turto pelningumas',
    'Aktivernes omsætningshastighed': 'Turto apyvartumas',
    'Break-even analyse': 'Lūžio taško analizė',
    'Chaufførens Køre- & Hviletid': 'Vairuotojo vairavimo ir poilsio laikas',
    'Dækningsbidrag': 'Padengimo suma',
    'EOQ — Optimal ordrestørrelse': 'EOQ — Optimalus užsakymo dydis',
    'Egenkapitalforrentning': 'Nuosavo kapitalo pelningumas',
    'Fragtomkostning': 'Krovinių vežimo sąnaudos',
    'Gennemløbstid': 'Proceso trukmė',
    'Incoterms 2020 — Risiko- & Omkostningsfordeling': 'Incoterms 2020 — rizikos ir sąnaudų paskirstymas',
    'Kapacitetsudnyttelse': 'Pajėgumų išnaudojimas',
    'Lageromsætningshastighed': 'Atsargų apyvartumas',
    'Estimeret lastbil- & trailerkapacitet': 'Numatoma sunkvežimio ir priekabos talpa',
    'Likviditetsbudget': 'Likvidumo biudžetas',
    'Likviditetsgrad 1': 'Likvidumo rodiklis 1',
    'Likviditetsgrad 2': 'Likvidumo rodiklis 2',
    'Lønomkostning (arbejdsgiver)': 'Darbo užmokesčio sąnaudos (darbdaviui)',
    'Middelværdi, Median & Typetal': 'Vidurkis, mediana ir moda',
    'Normalfordeling — Sandsynlighed': 'Normalusis skirstinys — tikimybė',
    'Optimal lagerplacering': 'Optimali sandėlio vieta',
    'Overskudsgrad': 'Pelno marža',
    'POQ / EPQ — Optimal produktionsstørrelse': 'POQ / EPQ — Optimalus gamybos dydis',
    'Resultatbudget': 'Pelno biudžetas',
    'Ruteafstand & Køretid': 'Maršruto atstumas ir kelionės laikas',
    'Sikkerhedslager & ROP': 'Saugos atsargos ir užsakymo taškas',
    'Soliditetsgrad': 'Nuosavo kapitalo rodiklis',
    'Standardafvigelse & Varians': 'Standartinis nuokrypis ir dispersija',
    'Dynamic Warehouse Capacity & Flow Simulator (WMS)': 'Sandėlio talpos ir srauto simuliatorius (WMS)',
    'ATP + AES m.m./md. (kr)': 'ATP + AES ir kt./mėn. (DKK)',
    'Afstand (km)': 'Atstumas (km)',
    'Antal enheder/paller': 'Vienetų/padėklų skaičius',
    'Antal i proces, WIP': 'Vienetų skaičius procese (WIP)',
    'Bruttoløn/måned (kr)': 'Bruto atlyginimas/mėn. (DKK)',
    'Datasæt': 'Duomenų rinkinys',
    'Egenkapital (kr)': 'Nuosavas kapitalas (DKK)',
    'Faktisk output': 'Faktinė gamyba',
    'Faste omk./år (kr)': 'Pastovios sąnaudos/metai (DKK)',
    'Faste omkostninger (kr)': 'Pastovios sąnaudos (DKK)',
    'Feriepenge (%)': 'Atostoginiai (%)',
    'Forventede indbetalinger (kr)': 'Numatomos įplaukos (DKK)',
    'Forventede udbetalinger (kr)': 'Numatomos išmokos (DKK)',
    'Forventet omsætning (kr)': 'Numatoma apyvarta (DKK)',
    'Forventet salg (stk)': 'Numatomas pardavimas (vnt.)',
    'Fra by': 'Iš miesto',
    'Gennemløbsrate (stk/time)': 'Pralaidumo sparta (vnt./val.)',
    'Gns. dagligt forbrug': 'Vid. paros suvartojimas',
    'Gns. lagerværdi (kr)': 'Vid. atsargų vertė (DKK)',
    'Godsets volumen (m³)': 'Krovinio tūris (m³)',
    'Godsets vægt (kg)': 'Krovinio svoris (kg)',
    'Indkøbspris (kr)': 'Pirkimo kaina (DKK)',
    'Kortfristet gæld (kr)': 'Trumpalaikiai įsipareigojimai (DKK)',
    'Kvalitet & spild (kr)': 'Kokybė ir nuostoliai (DKK)',
    'Køretøj': 'Transporto priemonė',
    'Køretøjets egenvægt (kg)': 'Transporto priemonės tara (kg)',
    'Lager & håndtering (kr)': 'Sandėliavimas ir tvarkymas (DKK)',
    'Lageromk./stk H (kr)': 'Saugojimo sąnaudos/vnt. H (DKK)',
    'Leveringstid (dage)': 'Pristatymo laikas (dienomis)',
    'Likvid beholdning, primo (kr)': 'Pinigų likutis pradžioje (DKK)',
    'Maks. kapacitet': 'Maks. pajėgumas',
    'Maks. køretid pr. dag (timer)': 'Maks. vairavimo laikas per dieną (val.)',
    'Middelværdi μ': 'Vidurkis μ',
    'Omstillingsomk. S (kr)': 'Perderinimo sąnaudos S (DKK)',
    'Omsætning (kr)': 'Apyvarta (DKK)',
    'Omsætningsaktiver (kr)': 'Trumpalaikis turtas (DKK)',
    'Ordreomk. S (kr)': 'Užsakymo sąnaudos S (DKK)',
    'Pension, arbejdsgiver (%)': 'Darbdavio pensijų įmoka (%)',
    'Produktionsrate p (stk/år)': 'Gamybos sparta p (vnt./metai)',
    'Resultat før renter (kr)': 'Pelnas prieš palūkanas, EBIT (DKK)',
    'Salgspris/stk (kr)': 'Pardavimo kaina/vnt. (DKK)',
    'Samlede aktiver (kr)': 'Visas turtas (DKK)',
    'Servicegrad': 'Aptarnavimo lygis',
    'Std.afv. i forbrug': 'Suvartojimo standartinis nuokrypis',
    'Std.afvigelse σ': 'Standartinis nuokrypis σ',
    'Til by': 'Į miestą',
    'Tilladt totalvægt, vogntog (kg)': 'Leidžiama pilna masė, junginys (kg)',
    'Total fragtomk. (kr)': 'Bendros vežimo sąnaudos (DKK)',
    'Trailer længde × bredde × højde (m)': 'Priekabos I×P×A (m)',
    'Transport & told (kr)': 'Transportas ir muitai (DKK)',
    'Vareforbrug/år (kr)': 'Prekių sąnaudos/metai (DKK)',
    'Varelager (kr)': 'Atsargos (DKK)',
    'Variabel omk./stk (kr)': 'Kintamos sąnaudos/vnt. (DKK)',
    'Variable omk. (% af oms.)': 'Kintamos sąnaudos (% nuo apyvartos)',
    'Værdi x': 'Reikšmė x',
    'Årets resultat (kr)': 'Grynasis pelnas (DKK)',
    'Årsforbrug D (stk)': 'Metinis poreikis D (vnt.)',
    'Ønsket køretid i alt (timer)': 'Norimas bendras vairavimo laikas (val.)',
    'Bruges når varer produceres selv (ikke købes) — produktionsraten p er højere end forbrugsraten d.': 'Naudojama, kai prekės gaminamos pačios įmonės (ne perkamos) — gamybos sparta p yra didesnė už suvartojimo spartą d.',
    'Den reelle omkostning ved et indkøb — ikke kun indkøbsprisen.': 'Tikroji pirkimo savikaina — ne vien pirkimo kaina.',
    'EU\'s køre- og hviletidsregler for erhvervschauffører: pause hver 4½ time, maks. køretid pr. dag, og krav om døgnhvile.': 'ES vairavimo ir poilsio laiko taisyklės profesionaliems vairuotojams: pertrauka kas 4,5 val., maks. vairavimo laikas per dieną ir privalomas paros poilsis.',
    'Et simpelt budget for forventet resultat i en periode.': 'Paprastas laikotarpio numatomo rezultato biudžetas.',
    'Finder det vægtede "tyngdepunkt" for et lager/distributionscenter ud fra kundelokationer (X,Y) og efterspørgsel.': 'Randa svertinį sandėlio/paskirstymo centro "gravitacijos tašką" pagal klientų vietas (X,Y) ir paklausą.',
    'Hvad ejerne får i afkast af deres investerede kapital.': 'Koks yra savininkų investuoto kapitalo pelningumas.',
    'Hvad en medarbejder reelt koster virksomheden — ikke kun bruttolønnen.': 'Kiek darbuotojas iš tikrųjų kainuoja įmonei — ne vien bruto atlyginimas.',
    'Hvad hver solgte enhed reelt bidrager med til at dække faste omkostninger og overskud.': 'Kiek kiekvienas parduotas vienetas realiai prisideda prie pastovių sąnaudų padengimo ir pelno.',
    'Hvor effektivt virksomhedens samlede aktiver skaber overskud — uafhængigt af finansiering.': 'Kaip efektyviai įmonės visas turtas generuoja pelną — nepriklausomai nuo finansavimo.',
    'Hvor lang tid en enhed i gennemsnit er "i systemet".': 'Kiek laiko vienetas vidutiniškai praleidžia "sistemoje".',
    'Hvor mange enheder der skal sælges, før virksomheden hverken taber eller tjener penge.': 'Kiek vienetų reikia parduoti, kad įmonė nei uždirbtų, nei prarastų pinigų.',
    'Hvor mange gange lageret bliver "vendt rundt" på et år. Høj = effektiv, lav = kapitalbinding.': 'Kiek kartų per metus "apsisuka" atsargos. Aukštas = efektyvu, žemas = įšaldytas kapitalas.',
    'Hvor mange kroner omsætning hver krone i aktiver genererer.': 'Kiek kronų apyvartos sugeneruoja kiekviena turto krona.',
    'Hvor meget dataene i gennemsnit spreder sig omkring middelværdien.': 'Kiek vidutiniškai duomenys išsibarstę aplink vidurkį.',
    'Hvor meget ekstra lager der skal ligge som buffer, og hvornår der skal genbestilles.': 'Kiek papildomų atsargų reikia laikyti kaip buferį ir kada reikia užsisakyti iš naujo.',
    'Beregn om godset umiddelbart kan være inden for køretøjets angivne vægt- og volumenkapacitet. Vigtig begrænsning: beregningen er vejledende og tager ikke automatisk højde for bl.a. akseltryk, vægtfordeling, køretøjets registrerede specifikationer, nationale vægtgrænser, lastsikring eller særlige vejrestriktioner. Et resultat under den samlede vægtgrænse er derfor ikke i sig selv dokumentation for, at transporten er lovlig.': 'Apskaičiuokite, ar krovinys tilptų į transporto priemonės nurodytą svorio ir tūrio talpą. Svarbus apribojimas: skaičiavimas yra orientacinis ir automatiškai neatsižvelgia į ašies apkrovą, svorio pasiskirstymą, transporto priemonės registruotas specifikacijas, nacionalinius svorio apribojimus, krovinio tvirtinimą ar specialius kelio apribojimus. Rezultatas, mažesnis už bendrą svorio ribą, savaime nėra įrodymas, kad vežimas yra teisėtas.',
    'Hvor stor en andel af virksomheden der er finansieret med egne penge frem for gæld.': 'Kokia įmonės dalis finansuojama nuosavomis lėšomis, o ne skola.',
    'Hvor stor en del af den maksimale kapacitet der reelt bliver brugt.': 'Kiek iš maksimalaus pajėgumo realiai išnaudojama.',
    'Hvor stor en del af omsætningen der bliver til overskud, før renter.': 'Kokia apyvartos dalis virsta pelnu prieš palūkanas.',
    'Indtast tal adskilt med komma, fx: 12, 15, 15, 18, 20, 22, 30': 'Įveskite skaičius, atskirtus kableliais, pvz.: 12, 15, 15, 18, 20, 22, 30',
    'Kan virksomheden dække sin kortfristede gæld med sine omsætningsaktiver?': 'Ar įmonė gali padengti trumpalaikius įsipareigojimus trumpalaikiu turtu?',
    'Klik på et leveringsbetingelse for at se, hvor på ruten omkostninger og risiko går fra sælger til køber.': 'Spustelėkite pristatymo sąlygą, kad pamatytumėte, kur maršrute sąnaudos ir rizika pereina iš pardavėjo pirkėjui.',
    'Pris pr. enhed og pr. km — godt til at sammenligne transportformer/ruter.': 'Kaina už vienetą ir už km — naudinga lyginant transporto rūšis/maršrutus.',
    'Sandsynligheden for at en værdi ligger under/over x, givet middelværdi og spredning (bruges bl.a. til servicegrad).': 'Tikimybė, kad reikšmė yra mažesnė/didesnė už x, esant nurodytam vidurkiui ir sklaidai (naudojama, pvz., aptarnavimo lygiui nustatyti).',
    'Som Likviditetsgrad 1, men uden varelager (det mest "usikre" aktiv at omsætte hurtigt).': 'Kaip likvidumo rodiklis 1, bet neįskaitant atsargų (turto, kurį greičiausiai konvertuoti į pinigus yra sudėtingiausia).',
    'Viser om der er penge nok i kassen — uafhængigt af om der er overskud på papiret.': 'Parodo, ar užtenka pinigų kasoje — nepriklausomai nuo to, ar popieriuje rodomas pelnas.',
    'Wilson-modellen. Finder den ordrestørrelse der minimerer summen af ordre- og lageromkostninger.': 'Wilsono modelis. Randa užsakymo dydį, kuris minimizuoja užsakymo ir saugojimo sąnaudų sumą.',
    'Søg efter en beregner… (fx EOQ, likviditet, ROE, freight, payroll)': 'Ieškoti skaičiuoklės… (pvz., EOQ, likvidumas, ROE, krovinys, atlyginimas)',
    'Simulerer din lagerudnyttelse denne uge ud fra forventet ind- og udgående varestrøm.': 'Simuliuoja jūsų sandėlio užpildymą šią savaitę pagal numatomą įvežimo ir išvežimo srautą.',
    'Total lagerkapacitet (pallepladser)': 'Bendra sandėlio talpa (padėklų vietos)',
    'Nuværende lagerbeholdning': 'Dabartinės atsargos',
    'Inbound denne uge': 'Įvežimas šią savaitę',
    'Outbound denne uge': 'Išvežimas šią savaitę',
    'Trailertype': 'Priekabos tipas',
    'Datasikkerhed: De fleste beregninger udføres lokalt i din browser, og beregningsdata gemmes ikke på LogistikCalcs server. Nogle funktioner, eksempelvis ruteplanlægning, anvender eksterne tjenester — her kan nødvendige oplysninger såsom indtastede lokationer blive sendt til den eksterne tjeneste for at gennemføre beregningen. Eksporterede filer gemmes kun, hvor du selv vælger at gemme dem, og backups du eksporterer beskyttes med en adgangskode efter eget valg.': 'Duomenų sauga: dauguma skaičiavimų atliekami jūsų naršyklėje, o skaičiavimo duomenys nesaugomi „LogistikCalc" serveryje. Kai kurios funkcijos, pavyzdžiui, maršruto planavimas, naudoja išorines paslaugas — jas naudojant reikalinga informacija, pvz., įvestos vietovės, gali būti siunčiama į išorinę paslaugą, kad būtų atliktas skaičiavimas. Eksportuoti failai išsaugomi tik ten, kur patys pasirenkate juos išsaugoti, o eksportuojamos atsarginės kopijos apsaugotos jūsų pasirinktu slaptažodžiu.',
    'Backup virksomhedsdata': 'Kurti atsarginę kopiją',
    'Importér virksomhedsdata': 'Importuoti duomenis',
    'Excel-eksport (Redigerbar)': 'Excel eksportas (redaguojamas)',
    'Formel- & Excel-guide': 'Formulių ir Excel vadovas',
    'Lær hvordan hver beregning virker på papir — og hvordan du selv bygger den i Excel.': 'Sužinokite, kaip kiekvienas skaičiavimas veikia popieriuje — ir kaip pačiam sukurti jį Excel programoje.',
    'AI Case & Document Scanner': 'AI atvejo ir dokumentų skaitytuvas',
    'Upload et Word- (.docx) eller PDF-casedokument. Systemet scanner teksten for kendte nøgletal (efterspørgsel, salgspris, lagerkapacitet m.m.) og udfylder de relevante moduler automatisk.': 'Įkelkite Word (.docx) arba PDF atvejo dokumentą. Sistema nuskaito tekstą, ieškodama žinomų rodiklių (paklausos, kainos, sandėlio talpos ir kt.), ir automatiškai užpildo atitinkamus modulius.',
    'Klik for at vælge fil, eller træk den herned': 'Spustelėkite, kad pasirinktumėte failą, arba nutempkite jį čia',
    'Total Master-Eksport': 'Bendras pagrindinis eksportas',
    'Eksportér Samlet PDF-Rapport': 'Eksportuoti bendrą PDF ataskaitą',
    'Eksportér Redigerbart Excel-Ark (.xlsx)': 'Eksportuoti redaguojamą Excel failą (.xlsx)',
    'Eksportér Word-beregningsrapport (.docx)': 'Eksportuoti Word skaičiavimų ataskaitą (.docx)',
    'Bemærk: Alle felter er forudfyldt med eksempeldata til demonstration. Erstat med dine egne tal, før du bruger resultaterne.': 'Pastaba: visi laukai iš anksto užpildyti pavyzdiniais duomenimis demonstracijai. Prieš naudodami rezultatus, pakeiskite juos savo skaičiais.'
  }
};

function prepareI18nTargets() {
  const selectors = ['.calc-card > h3', '.f-label', 'p.explain', '.cat-btn', 'button', '#fav-section h3', 'header p', '.i18n-privacy'];
  document.querySelectorAll(selectors.join(', ')).forEach(el => {
    if (el.dataset.i18nDone) return;
    el.dataset.i18nDone = '1';
    let target = null;
    for (const node of el.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim().length > 0) { target = node; break; }
    }
    if (!target) return;
    const span = document.createElement('span');
    span.className = 'i18n-text';
    span.dataset.da = target.textContent.trim();
    span.textContent = target.textContent;
    el.replaceChild(span, target);
  });
}

function applyLanguage(lang) {
  document.querySelectorAll('.i18n-text').forEach(span => {
    const da = span.dataset.da;
    if (lang === 'da') { span.textContent = da; return; }
    const dict = TRANSLATIONS[lang];
    span.textContent = (dict && dict[da]) || da;
  });

  const searchBox = document.getElementById('search-box');
  if (!searchBox.dataset.da) searchBox.dataset.da = searchBox.getAttribute('placeholder');
  const dict = TRANSLATIONS[lang];
  searchBox.setAttribute('placeholder', (lang !== 'da' && dict && dict[searchBox.dataset.da]) || searchBox.dataset.da);

  // Hide the secondary "/ English term" sublabels in every language now that
  // full translation exists — showing both at once (even under Danish) was
  // redundant and cluttered the UI.
  document.querySelectorAll('h3 > span.font-normal.text-slate-400, label.f-label > span.text-slate-400').forEach(sub => {
    sub.style.display = 'none';
  });

  localStorage.setItem(LANG_KEY, lang);
  if (document.getElementById('incoterms-panel').innerHTML) {
    const active = document.querySelector('.incoterm-btn.bg-blue-600');
    selectIncoterm(active ? active.dataset.term : 'FOB');
  }
  renderGuide();
  if (!document.getElementById('landing-page').classList.contains('hidden')) renderLanding();
  if (window.lucide) lucide.createIcons();
}

function initLanguage() {
  prepareI18nTargets();
  const select = document.getElementById('lang-select');
  const saved = localStorage.getItem(LANG_KEY);
  if (saved) {
    select.value = saved;
    applyLanguage(saved);
  }
  select.addEventListener('change', () => applyLanguage(select.value));
}

