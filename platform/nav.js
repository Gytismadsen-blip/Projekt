(() => {
  'use strict';
  const PLATFORM_NAME = "CargoTools";
  const start = async () => {
    const user = await window.Platform.ready;
    if (!user || location.pathname === '/login.html') return;
    const bar = document.createElement('header'); bar.className = 'pf-nav';
    bar.innerHTML = `<a class="pf-brand" href="/">${PLATFORM_NAME}</a><button class="pf-menu-button" type="button" aria-expanded="false" aria-controls="pf-links">Menu</button><nav class="pf-links" id="pf-links" aria-label="Værktøjer"></nav><div class="pf-account"><span class="pf-email"></span><button class="pf-logout" type="button">Log ud</button></div>`;
    const links = [['/', 'Forside'], ['/fragtanalyse/', 'FragtAnalyse'], ['/turberegner/', 'Turberegner'], ['/ansvarsanalyse/', 'AnsvarsAnalyse'], ['/regnemaskine/', 'Regnemaskine']];
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    for (const [href, name] of links) {
      const link = document.createElement('a'); link.href = href; link.textContent = name;
      if ((href.replace(/\/$/, '') || '/') === path) link.setAttribute('aria-current', 'page');
      bar.querySelector('nav').append(link);
    }
    const email = bar.querySelector('.pf-email');
    const setUser = (value) => { email.textContent = value?.email || ''; email.title = email.textContent; };
    setUser(user); window.addEventListener('pf-user', (event) => setUser(event.detail));
    const menu = bar.querySelector('.pf-menu-button');
    const close = () => { menu.setAttribute('aria-expanded', 'false'); bar.classList.remove('pf-menu-open'); };
    menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); bar.classList.toggle('pf-menu-open', open); });
    bar.addEventListener('keydown', (event) => { if (event.key === 'Escape') { close(); menu.focus(); } });
    document.addEventListener('click', (event) => { if (!bar.contains(event.target)) close(); });
    bar.querySelector('.pf-logout').addEventListener('click', window.Platform.logout);
    document.body.prepend(bar);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
