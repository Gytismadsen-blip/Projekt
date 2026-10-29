/* ---------------- CASE SWITCHER ---------------- */
const CASES_KEY = 'regnemaskine_cases';
const ACTIVE_CASE_KEY = 'regnemaskine_active_case';
const DEFAULT_CASE = 'Standard Workspace';

function loadCases() { try { return JSON.parse(localStorage.getItem(CASES_KEY)) || { [DEFAULT_CASE]: {} }; } catch (e) { return { [DEFAULT_CASE]: {} }; } }
function saveCases(cases) { localStorage.setItem(CASES_KEY, JSON.stringify(cases)); }
function getActiveCase() { return localStorage.getItem(ACTIVE_CASE_KEY) || DEFAULT_CASE; }
function setActiveCase(name) { localStorage.setItem(ACTIVE_CASE_KEY, name); }

function getPersistableFields() {
  return Array.from(document.querySelectorAll('main input[id], main select[id]')).filter(el => el.id !== 'search-box');
}

function saveFieldToActiveCase(id, value) {
  const cases = loadCases();
  const active = getActiveCase();
  if (!cases[active]) cases[active] = {};
  cases[active][id] = value;
  saveCases(cases);
  if (typeof scheduleCloudPush === 'function') scheduleCloudPush();
}

function applyCaseToFields(caseName) {
  const cases = loadCases();
  const data = cases[caseName] || {};
  getPersistableFields().forEach(el => {
    if (Object.prototype.hasOwnProperty.call(data, el.id)) el.value = data[el.id];
  });
  // hide stale results/gauges from the previous case
  document.querySelectorAll('[id$="-result"], [id$="-gauge"]').forEach(el => el.classList.add('hidden'));
  document.getElementById('sd-transfer-btn')?.classList.add('hidden');
}

function populateCaseSelect() {
  const cases = loadCases();
  const select = document.getElementById('case-select');
  const active = getActiveCase();
  select.innerHTML = Object.keys(cases).map(name => `<option value="${escapeHTML(name)}" ${name === active ? 'selected' : ''}>${escapeHTML(name)}</option>`).join('');
}

function initCaseSwitcher() {
  const cases = loadCases();
  if (!cases[DEFAULT_CASE] && Object.keys(cases).length === 0) cases[DEFAULT_CASE] = {};
  saveCases(cases);
  populateCaseSelect();
  applyCaseToFields(getActiveCase());

  document.getElementById('case-select').addEventListener('change', (e) => {
    setActiveCase(e.target.value);
    applyCaseToFields(e.target.value);
  });

  document.getElementById('case-new-btn').addEventListener('click', () => {
    const name = prompt('Navn på ny case (fx "LEGO Case" eller "DSV Opgave"):');
    if (!name || !name.trim()) return;
    const cases = loadCases();
    if (cases[name]) { alert('Der findes allerede en case med det navn.'); return; }
    cases[name] = {};
    saveCases(cases);
    setActiveCase(name);
    populateCaseSelect();
    applyCaseToFields(name);
  });

  // persist every field change into the active case
  document.addEventListener('input', (e) => {
    if (e.target.matches('main input[id], main select[id]') && e.target.id !== 'search-box') {
      saveFieldToActiveCase(e.target.id, e.target.value);
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.matches('main select[id]')) {
      saveFieldToActiveCase(e.target.id, e.target.value);
    }
  });
}

