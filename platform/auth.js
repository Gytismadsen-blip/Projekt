/* Static UI gate. Supabase RLS must protect database records separately. */
(() => {
  'use strict';
  const platform = window.Platform = window.Platform || {};
  const loginPage = location.pathname === '/login.html';
  platform.recovery = loginPage && (new URLSearchParams(location.search).has('recovery') || location.hash.includes('type=recovery'));
  if (!loginPage) document.documentElement.classList.add('pf-auth-pending');
  platform.safeNext = (value) => {
    try {
      if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\x00-\x20]/.test(value)) return '/';
      const target = new URL(value, location.origin);
      return target.origin === location.origin && target.pathname !== '/login.html' ? target.pathname + target.search + target.hash : '/';
    } catch { return '/'; }
  };
  const toLogin = () => location.replace('/login.html?next=' + encodeURIComponent(location.pathname + location.search + location.hash));
  const showFailure = () => {
    const show = () => {
      if (loginPage) return;
      const box = document.createElement('div'); box.className = 'pf-auth-error'; box.setAttribute('role', 'alert');
      box.textContent = 'Login kunne ikke kontrolleres. Tjek din forbindelse. ';
      const retry = document.createElement('a'); retry.href = location.href; retry.textContent = 'Prøv igen'; box.append(retry); document.body.append(box);
    };
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show, { once: true });
  };
  platform.is_admin = false;
  // Demo: værktøjerne regner kun i browseren, så de kan vises uden konto. Gælder kun denne fane.
  const DEMO_KEY = 'cargotools-demo';
  const demoWanted = () => { try { return sessionStorage.getItem(DEMO_KEY) === '1'; } catch { return false; } };
  platform.endDemo = () => { try { sessionStorage.removeItem(DEMO_KEY); } catch { /* ingen lagring: intet at rydde */ } };
  platform.demo = false;
  let heartbeatBusy = false;
  let forcedLogout = false;
  let gate;
  const heartbeat = async (session) => {
    if (loginPage) return true;
    if (!session || heartbeatBusy) return false;
    heartbeatBusy = true;
    let heartbeatTimeout;
    try {
      const { data, error } = await Promise.race([
        platform.client.rpc('cargotools_heartbeat'),
        new Promise((_, reject) => { heartbeatTimeout = setTimeout(() => reject(new Error('Heartbeat timeout')), 12000); })
      ]);
      if (error) {
        if (['PGRST202', '42883'].includes(error.code)) {
          console.warn('CargoTools: heartbeat mangler. Kør SQL-filen.'); return true;
        }
        throw error;
      }
      const profile = Array.isArray(data) ? data[0] : data;
      if (!profile) throw new Error('Profil mangler');
      // JWT amr indeholder sessionens login-tid og flytter sig ikke ved token-refresh.
      // Brugerens last_sign_in_at kan derimod komme fra en anden enheds login.
      let loginAt = NaN;
      try {
        const payload = session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const claims = JSON.parse(atob(payload));
        const times = (claims.amr || []).map(item => item.timestamp).filter(value => Number.isFinite(value));
        if (times.length) loginAt = Math.min(...times) * 1000;
      } catch { /* Ukendt login-tid: en udlogningsordre skal stadig overholdes. */ }
      if (profile.force_logout_at && (!Number.isFinite(loginAt) || Date.parse(profile.force_logout_at) > loginAt)) {
        forcedLogout = true;
        document.documentElement.classList.add('pf-auth-pending');
        const { error: logoutError } = await platform.client.auth.signOut({ scope: 'local' });
        if (logoutError) { showFailure(); return false; }
        location.replace('/login.html?message=force_logout'); return false;
      }
      platform.is_admin = profile.is_admin === true;
      const blocked = profile.status !== 'approved';
      platform.blocked = blocked;
      window.dispatchEvent(new Event('pf-profile'));
      if (blocked) {
        await new Promise(resolve => { if (document.body) resolve(); else document.addEventListener('DOMContentLoaded', resolve, { once: true }); });
        if (!gate) { gate = document.createElement('div'); gate.className = 'pf-auth-error'; document.body.append(gate); }
        gate.replaceChildren();
        const title = document.createElement('h1');
        title.textContent = profile.status === 'pending' ? 'Din konto venter på godkendelse' : 'Din konto er spærret';
        const button = document.createElement('button'); button.textContent = 'Log ud'; button.onclick = () => platform.logout();
        gate.append(title, button);
        document.documentElement.classList.add('pf-auth-pending');
        return false;
      }
      if (gate) { gate.remove(); gate = null; location.reload(); return false; }
      return true;
    } catch (error) {
      console.warn('CargoTools: adgang kunne ikke kontrolleres.', error);
      platform.is_admin = false;
      document.documentElement.classList.add('pf-auth-pending'); showFailure(); return false;
    } finally { clearTimeout(heartbeatTimeout); heartbeatBusy = false; }
  };
  platform.ready = (async () => {
    let timeout;
    try {
      if (!window.supabase) throw new Error('SDK unavailable');
      platform.client = window.supabase.createClient('https://pixmmcdknuwgnmhgpgyf.supabase.co', 'sb_publishable_p_1_SirQVg0aty6lZrg3oA_UoV13PVB');
      platform.client.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') { platform.recovery = true; window.dispatchEvent(new Event('pf-recovery')); }
        if (event === 'SIGNED_OUT' && !loginPage && !forcedLogout && !platform.demo) { document.documentElement.classList.add('pf-auth-pending'); toLogin(); }
        window.dispatchEvent(new CustomEvent('pf-user', { detail: session?.user || null }));
      });
      const result = await Promise.race([platform.client.auth.getSession(), new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('timeout')), 12000); })]);
      if (result.error) throw result.error;
      const user = result.data.session?.user || null;
      if (user) platform.endDemo();
      if (!loginPage && !user && demoWanted() && !location.pathname.startsWith('/admin/')) {
        platform.demo = true;
        document.documentElement.classList.remove('pf-auth-pending');
        return { email: 'Demo', demo: true };
      }
      if (!loginPage && !user) { toLogin(); return null; }
      if (!loginPage && user) {
        const allowed = await heartbeat(result.data.session);
        setInterval(async () => {
          const { data, error } = await platform.client.auth.getSession();
          if (error || !data.session) { toLogin(); return; }
          await heartbeat(data.session);
        }, 60000);
        if (!allowed) return null;
      }
      document.documentElement.classList.remove('pf-auth-pending');
      return user;
    } catch { platform.sessionError = true; showFailure(); return null; } finally { clearTimeout(timeout); }
  })();
  platform.logout = async () => {
    try {
      const { error } = await platform.client.auth.signOut(); if (error) throw error;
      location.replace('/login.html');
    } catch { window.alert('Du kunne ikke logges ud. Prøv igen.'); }
  };
  // Recheck pages restored from the browser's back/forward cache.
  window.addEventListener('pageshow', async (event) => {
    if (!event.persisted || loginPage || platform.demo) return;
    document.documentElement.classList.add('pf-auth-pending');
    try {
      const { data, error } = await platform.client.auth.getSession();
      if (error) throw error;
      if (!data.session) { toLogin(); return; }
      if (await heartbeat(data.session)) document.documentElement.classList.remove('pf-auth-pending');
    } catch { showFailure(); }
  });
})();
