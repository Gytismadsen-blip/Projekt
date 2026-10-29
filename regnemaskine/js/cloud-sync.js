/* ---------------- CLOUD SYNC (Supabase) ---------------- */
/* Optional: log in with email to sync cases across devices. Works fully offline (localStorage) if you never log in. */
const SUPABASE_URL = 'https://pixmmcdknuwgnmhgpgyf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_p_1_SirQVg0aty6lZrg3oA_UoV13PVB';
const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let cloudPushTimer = null;

function scheduleCloudPush() {
  if (!sb) return;
  clearTimeout(cloudPushTimer);
  cloudPushTimer = setTimeout(() => {
    const active = getActiveCase();
    const cases = loadCases();
    pushCaseToCloud(active, cases[active] || {});
  }, 1000);
}

async function pushCaseToCloud(caseName, data) {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  await sb.from('logistikcalc_cases').upsert({
    user_id: user.id,
    case_name: caseName,
    data,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,case_name' });
}

async function pullCloudCases() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  const { data: rows, error } = await sb.from('logistikcalc_cases').select('case_name, data').eq('user_id', user.id);
  if (error || !rows) return;
  const local = loadCases();
  rows.forEach(row => { local[row.case_name] = row.data; });
  saveCases(local);
  populateCaseSelect();
  applyCaseToFields(getActiveCase());
}

function renderCloudAuthUI(user) {
  const box = document.getElementById('cloud-sync-box');
  if (!box) return;
  if (user) {
    box.innerHTML = `
      <span class="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:inline max-w-[140px] truncate" title="${escapeHTML(user.email)}">${escapeHTML(user.email)}</span>
      <button id="cloud-signout-btn" class="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50" title="Logget ind — synkroniserer på tværs af enheder. Klik for at logge ud.">
        <i data-lucide="cloud-check" class="w-4 h-4"></i>
      </button>`;
    document.getElementById('cloud-signout-btn').addEventListener('click', async () => {
      if (confirm('Log ud og stop synkronisering på tværs af enheder?')) await sb.auth.signOut();
    });
  } else {
    box.innerHTML = `
      <button id="cloud-signin-btn" class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" title="Log ind for at synkronisere dine cases på tværs af enheder">
        <i data-lucide="cloud" class="w-4 h-4"></i>
      </button>`;
    document.getElementById('cloud-signin-btn').addEventListener('click', openCloudSignIn);
  }
  if (window.lucide) lucide.createIcons();
}

async function openCloudSignIn() {
  const email = prompt('Indtast din email for at synkronisere dine cases på tværs af enheder.\n\nDu får tilsendt et login-link — intet kodeord nødvendigt.');
  if (!email || !email.trim()) return;
  const { error } = await sb.auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: window.location.origin + window.location.pathname }
  });
  if (error) { alert('Kunne ikke sende login-link: ' + error.message); return; }
  alert('Tjek din email (' + email.trim() + ') og klik på login-linket for at logge ind.');
}

function initCloudSync() {
  if (!sb) return;
  sb.auth.onAuthStateChange((_event, session) => {
    renderCloudAuthUI(session ? session.user : null);
    if (session && session.user) pullCloudCases();
  });
  sb.auth.getUser().then(({ data }) => renderCloudAuthUI(data.user || null));
}

document.addEventListener('DOMContentLoaded', initCloudSync);
