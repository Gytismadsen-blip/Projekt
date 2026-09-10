# FragtAnalyse

Værktøj til transportøkonomi: fragtpligtig vægt, transportpris og totalomkostning for luft-, sø-, bane- og vejfragt.
Bygget til faget Distribution på logistikøkonomuddannelsen, men lavet så det kan bruges på en hvilken som helst case.

Alt kører i browseren. Ingen server, ingen database, ingen AI. Intet forlader maskinen.

## Hvad kan den

**1. Case og bilag**
Upload casen og bilagene som PDF, Word, Excel, PowerPoint eller tekst. Siden læser teksten og finder tallene
med faste søgemønstre — mål på kolli, vægt, Q-satser, minimumssats, tillæg, THC, BAF, CAF, valutakurser,
vareværdi og transporttid. Hvert fund vises med det tekststykke, det stammer fra, så det kan kontrolleres.
Du sætter selv flueben ved det, der skal med, og trykker derefter Sæt ind i beregningen.

Casen deles op i transportmuligheder, hvis den stiller flere tilbud op mod hinanden, og hver mulighed
regnes for sig. Passer opdelingen ikke, kan du med ét klik vælge at regne det hele som én beregning.

En tjekliste viser hvad der mangler: rumfang, vægt, grundfragt, valutakurs, tillæg og vareværdi.
Siden gætter ikke stiltiende. Er kursen ikke oplyst i casen, siger den det, i stedet for at bruge en
standardkurs uden at nævne det.

Fund der er usikre, er markeret og fravalgt på forhånd. Finder siden flere forskellige værdier for det samme,
fx fem transporttider fordi casen stiller fem tilbud op mod hinanden, markeres de, og kun den første er valgt.

Har du løst en case, kan du gemme den med knappen Gem case. Teksten, de fundne værdier og alle
beregnede muligheder gemmes samlet, så du kan hente dem frem igen. Der gemmes kun når du selv trykker,
aldrig automatisk, og alt bliver i din egen browser.

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

## Kontrolberegninger med kendt facit

Siden testes automatisk mod rigtige casefiler. Resultaterne skal ramme præcis disse tal:

| Case | Resultat |
|---|---|
| Air Birgers Møbler | 447 kg fragtpligtig vægt, break-point til 500 kg, i alt 9.842,84 DKK |
| Sea Birgers Møbler, mulighed 1 | 4 × 5.996,32 = 23.985,28 DKK pr. måned |
| Sea Birgers Møbler, mulighed 2 | 18.950,80 DKK |
| Sea Birgers Møbler, mulighed 3 | 25.240,60 DKK |
| DanMeat | 448 kg fragtpligtig vægt, break-point til 500 kg, grundfragt 1.650 EUR |

Volumenvægten for luftfragt regnes med 1 ton = 6 m³ præcist. Air Birgers giver derfor 446,60 kg, og DanMeat giver 448 kg og ikke 449, som en afrundet faktor på 166,67 ville give.

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
