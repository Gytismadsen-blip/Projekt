/* ---------------- AI CASE & DOCUMENT SCANNER ---------------- */
const SEP = '[^\\d]{0,30}'; // flexible separator: up to 30 non-digit chars between keyword and number (handles "(paklausa): 12000", "er på 450.000 kr", "demand: 12000" etc.)
const SCAN_PATTERNS = [
  { targetId: 'eoq-d', calc: () => window.calcEOQ && calcEOQ(), label: 'Årsforbrug (D) → EOQ/Wilson',
    regexes: [new RegExp('efterspørgsel' + SEP + '([\\d.,]+)', 'i'), new RegExp('(?:årsforbrug|forbrug)' + SEP + '([\\d.,]+)', 'i'), new RegExp('demand' + SEP + '([\\d.,]+)', 'i'), new RegExp('paklausa' + SEP + '([\\d.,]+)', 'i'), new RegExp('poreikis' + SEP + '([\\d.,]+)', 'i')] },
  { targetId: 'be-price', calc: () => window.calcBE && calcBE(), label: 'Salgspris → Break-even',
    regexes: [new RegExp('salgspris' + SEP + '([\\d.,]+)\\s*kr', 'i'), new RegExp('\\bpris' + SEP + '([\\d.,]+)\\s*kr', 'i'), new RegExp('price' + SEP + '([\\d.,]+)', 'i'), new RegExp('kaina' + SEP + '([\\d.,]+)', 'i'), new RegExp('parduodama' + SEP + '([\\d.,]+)', 'i')] },
  { targetId: 'wmsMaxCapacity', calc: () => window.calcWMS && calcWMS(), label: 'Lagerkapacitet → WMS',
    regexes: [new RegExp('lagerkapacitet' + SEP + '([\\d.,]+)\\s*pal', 'i'), new RegExp('kapacitet' + SEP + '([\\d.,]+)\\s*pal', 'i'), new RegExp('capacity' + SEP + '([\\d.,]+)', 'i'), new RegExp('talpa' + SEP + '([\\d.,]+)', 'i')] },
  { targetId: 'be-var', calc: () => window.calcBE && calcBE(), label: 'Variabel omk. → Break-even',
    regexes: [new RegExp('variab(?:el|le)\\s*omkostning(?:er)?' + SEP + '([\\d.,]+)\\s*kr', 'i'), new RegExp('variable\\s*cost' + SEP + '([\\d.,]+)', 'i'), new RegExp('kintam\\w*\\s*s[aą]naud\\w*' + SEP + '([\\d.,]+)', 'i')] },
  { targetId: 'be-fixed', calc: () => window.calcBE && calcBE(), label: 'Faste omk. → Break-even',
    regexes: [new RegExp('faste\\s*omkostninger' + SEP + '([\\d.,]+)\\s*kr', 'i'), new RegExp('fixed\\s*cost' + SEP + '([\\d.,]+)', 'i'), new RegExp('pastovi\\w*\\s*s[aą]naud\\w*' + SEP + '([\\d.,]+)', 'i')] },
  { targetId: 'rop-lt', calc: () => window.calcROP && calcROP(), label: 'Leveringstid → ROP',
    regexes: [new RegExp('leveringstid' + SEP + '([\\d.,]+)\\s*dage', 'i'), new RegExp('lead\\s*time' + SEP + '([\\d.,]+)', 'i'), new RegExp('pristatymo\\s*laik\\w*' + SEP + '([\\d.,]+)', 'i')] },
  { targetId: 'wmsCurrentStock', calc: () => window.calcWMS && calcWMS(), label: 'Nuværende beholdning → WMS',
    regexes: [new RegExp('nuværende\\s*(?:lagerbeholdning|beholdning)' + SEP + '([\\d.,]+)', 'i'), new RegExp('current\\s*(?:stock|inventory)' + SEP + '([\\d.,]+)', 'i'), new RegExp('dabartin\\w*\\s*atsarg\\w*' + SEP + '([\\d.,]+)', 'i')] }
];

function parseNumberFromMatch(str) {
  let clean = str.trim();
  if (/^\d{1,3}(\.\d{3})+$/.test(clean)) clean = clean.replace(/\./g, '');
  else if (/^\d{1,3}(,\d{3})+$/.test(clean)) clean = clean.replace(/,/g, '');
  else clean = clean.replace(',', '.');
  return parseFloat(clean);
}

function scanTextForValues(text) {
  const found = [];
  SCAN_PATTERNS.forEach(p => {
    for (const re of p.regexes) {
      const m = text.match(re);
      if (m && m[1]) {
        const val = parseNumberFromMatch(m[1]);
        if (!isNaN(val)) { found.push({ ...p, value: val }); break; }
      }
    }
  });
  return found;
}

async function extractTextFromFile(file) {
  const buf = await file.arrayBuffer();
  if (file.name.toLowerCase().endsWith('.docx')) {
    if (!window.mammoth) throw new Error('mammoth-missing');
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value;
  } else if (file.name.toLowerCase().endsWith('.pdf')) {
    if (!window.pdfjsLib) throw new Error('pdfjs-missing');
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(it => it.str).join(' ') + '\n';
    }
    return text;
  }
  throw new Error('unsupported-file');
}

async function handleScannerFile(file) {
  const statusBox = document.getElementById('scanner-status');
  const resultsBox = document.getElementById('scanner-results');
  statusBox.classList.remove('hidden');
  resultsBox.classList.add('hidden');
  statusBox.className = 'mt-4 text-sm flex items-center gap-2 text-indigo-600 dark:text-indigo-400';
  statusBox.innerHTML = '<span class="animate-spin inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full"></span> Analyserer case-dokument og uddrager finansielle/logistiske variable…';

  try {
    const text = await extractTextFromFile(file);
    await new Promise(r => setTimeout(r, 1400));

    const found = scanTextForValues(text);
    if (found.length === 0) {
      statusBox.className = 'mt-4 text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400';
      statusBox.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4"></i><span>Ingen genkendelige nøgletal fundet i dokumentet. Prøv et andet dokument, eller udfyld felterne manuelt.</span>';
      if (window.lucide) lucide.createIcons();
      return;
    }

    found.forEach(f => {
      const el = document.getElementById(f.targetId);
      if (el) {
        el.value = f.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    // Deliberately not auto-calculating: a module's other fields may still hold the
    // pre-filled example data, so silently showing a "result" here would mix a real
    // scanned number with a stale default without the user noticing. Fields are only
    // filled — the user must check every field and press "Beregn" themselves.

    statusBox.className = 'mt-4 text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400';
    statusBox.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4"></i><span>${found.length} værdi(er) foreslået og sat ind i felterne. De øvrige felter i samme beregner kan stadig indeholde eksempeldata — tjek alle felter, og tryk selv "Beregn".</span>`;

    resultsBox.classList.remove('hidden');
    resultsBox.innerHTML = found.map(f => `
      <div class="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
        <span>Fundet ${escapeHTML(f.label)}</span><span class="font-bold">${fmt(f.value)}</span>
      </div>`).join('') + `<p class="text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-1.5 mt-1"><i data-lucide="alert-triangle" class="w-3.5 h-3.5 flex-shrink-0 mt-0.5"></i><span>Tekstgenkendelsen kan tage fejl — tjek altid de indsatte tal mod dokumentet, før du bruger resultaterne.</span></p>`;

    found.forEach(f => {
      const el = document.getElementById(f.targetId);
      const card = el?.closest ? el.closest('.calc-card') : null;
      if (card) { card.classList.add('flash-highlight'); setTimeout(() => card.classList.remove('flash-highlight'), 1200); }
    });

    document.getElementById('scanner-export').classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  } catch (e) {
    statusBox.className = 'mt-4 text-sm flex items-center gap-2 text-red-600 dark:text-red-400';
    const reason = e.message === 'mammoth-missing' || e.message === 'pdfjs-missing'
      ? 'Et nødvendigt bibliotek kunne ikke indlæses (tjek internetforbindelsen).'
      : e.message === 'unsupported-file'
      ? 'Filtypen understøttes ikke — brug .docx eller .pdf.'
      : 'Kunne ikke læse dokumentet. Er filen beskadiget eller adgangskodebeskyttet?';
    statusBox.innerHTML = `<i data-lucide="alert-triangle" class="w-4 h-4"></i><span>${reason}</span>`;
    if (window.lucide) lucide.createIcons();
  }
}

function initScannerModal() {
  const modal = document.getElementById('scanner-modal');
  const openBtn = document.getElementById('scanner-open-btn');
  if (openBtn) openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  document.getElementById('scanner-close-btn').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

  const dropzone = document.getElementById('scanner-dropzone');
  const input = document.getElementById('scanner-file-input');
  dropzone.addEventListener('click', () => input.click());
  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('border-indigo-400'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-indigo-400'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('border-indigo-400');
    if (e.dataTransfer.files[0]) handleScannerFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files[0]) handleScannerFile(input.files[0]); });

  document.getElementById('master-pdf-btn').addEventListener('click', exportMasterPDF);
  document.getElementById('master-xlsx-btn').addEventListener('click', exportMasterExcel);
  document.getElementById('master-doc-btn').addEventListener('click', exportMasterWord);
}

