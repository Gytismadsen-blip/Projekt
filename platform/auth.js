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
  platform.ready = (async () => {
    let timeout;
    try {
      if (!window.supabase) throw new Error('SDK unavailable');
      platform.client = window.supabase.createClient('https://pixmmcdknuwgnmhgpgyf.supabase.co', 'sb_publishable_p_1_SirQVg0aty6lZrg3oA_UoV13PVB');
      platform.client.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') { platform.recovery = true; window.dispatchEvent(new Event('pf-recovery')); }
        if (event === 'SIGNED_OUT' && !loginPage) { document.documentElement.classList.add('pf-auth-pending'); toLogin(); }
        window.dispatchEvent(new CustomEvent('pf-user', { detail: session?.user || null }));
      });
      const result = await Promise.race([platform.client.auth.getSession(), new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('timeout')), 12000); })]);
      if (result.error) throw result.error;
      const user = result.data.session?.user || null;
      if (!loginPage && !user) { toLogin(); return null; }
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
    if (!event.persisted || loginPage) return;
    document.documentElement.classList.add('pf-auth-pending');
    try {
      const { data, error } = await platform.client.auth.getSession();
      if (error) throw error;
      if (!data.session) { toLogin(); return; }
      document.documentElement.classList.remove('pf-auth-pending');
    } catch { showFailure(); }
  });
})();
