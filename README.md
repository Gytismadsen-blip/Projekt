# Fragtkalkulator

Værktøj til transportøkonomi: fragtpligtig vægt, transportpris og totalomkostning for luft-, sø-, bane- og vejfragt.
Bygget til faget Distribution på logistikøkonomuddannelsen, men lavet så det kan bruges på en hvilken som helst case.

Alt kører i browseren. Ingen server, ingen database, ingen AI. Intet forlader maskinen.

## Hvad kan den

**1. Case og bilag**
Upload casen og bilagene som PDF, Word, Excel, PowerPoint eller tekst. Siden læser teksten og finder tallene
med faste søgemønstre — mål på kolli, vægt, Q-satser, minimumssats, tillæg, THC, BAF, CAF, valutakurser,
vareværdi og transporttid. Hvert fund vises med det tekststykke, det stammer fra, så det kan kontrolleres.
Du sætter selv flueben ved det, der skal med, og trykker derefter Sæt ind i beregningen.

Fund der er usikre, er markeret og fravalgt på forhånd. Finder siden flere forskellige værdier for det samme,
fx fem transporttider fordi casen stiller fem tilbud op mod hinanden, markeres de, og kun den første er valgt.

**2. Beregning**
- Rumfang ud fra kollienes mål, eller m³ skrevet direkte
- Fragtpligtig vægt efter w/m-reglen med redigerbar omregningsfaktor
- Grundfragt som trappesats pr. kg, pris pr. w/m eller fast pris pr. container
- Automatisk break-point: alle vægtklasser prøves, og den billigste vælges
- Tillæg som faste beløb, pr. kg, pr. 100 kg, pr. m³, pr. w/m, pr. kolli, højeste af to satser, eller procent af valgte poster
- Valutakurstabel man selv kan udvide

**3. Nøgletal og faglig vurdering**
Pris pr. kg og pr. m³, fragtrate i procent af vareværdien, værdi pr. kg, tillæggenes andel, CO2 og landed cost
med kapitalbinding under transporten. Dertil automatiske kommentarer, der peger på det, der plejer at koste point:
volumenvægt der styrer prisen, uudnyttede break-points, minimumssats der slår igennem, manglende valutakurs,
kurs angivet pr. 100 enheder, og faktoruoverensstemmelsen for bane og international vejfragt.

**4. Sammenlign**
Gem flere muligheder og stil dem op mod hinanden på pris, kapitalbinding, transporttid, frekvens,
leveringssikkerhed og CO2. Vægtet pointmodel hvor man selv sætter kriteriernes vægt.

**Teori**
w/m-faktorer, break-point, ordbog over tillæg, kriterier for valg af transportform og CO2-faktorer.

## Indbyggede cases

Air Birgers Møbler, Sea Birgers Møbler (tre transportmuligheder) og DanMeat kan indlæses direkte fra menuen
øverst og bruges som eksempel eller kontrol.

## Kilder

Omregningsfaktorer og w/m-metode fra kompendiet *International Transport Planning*, afsnittet
Weight/Measure Calculation. Tillægsordbog og luftfragtprissætning fra *Handbook of Logistics and
Distribution Management*.

Bemærk: kompendiets to kolonner for bane og international vejfragt strider mod hinanden
(1 ton = 3,33 m³ mod 1 m³ = 333,3 kg). Kalkulatoren bruger 333,33 kg pr. m³ og gør opmærksom på forskellen.
Omregningsfaktoren kan altid rettes.

## Teknik

Én statisk `index.html`. Vanilla JavaScript og Tailwind fra CDN. JSZip læser Office-filer, pdf.js læser PDF.
Gemte muligheder ligger i browserens localStorage.
