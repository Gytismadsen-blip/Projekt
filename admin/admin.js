(() => {
  'use strict';
  const platform = window.Platform;
  const $ = id => document.getElementById(id);
  const endpoint = 'https://logops-kappa.vercel.app/api/admin-users';
  let users = [], page = 1, busy = false, loading = false, userId;
  const pageSize = () => Math.max(1, Math.min(6, Math.floor((innerHeight - 390) / 58)));
  const online = user => { const age = Date.now() - Date.parse(user.last_seen_at); return age >= 0 && age < 120000; };
  const status = { pending: 'Venter', approved: 'Godkendt', rejected: 'Spærret', suspended: 'Spærret' };
  const say = text => { $('message').textContent = text; };
  async function request(method, body) {
    const { data, error } = await platform.client.auth.getSession();
    if (error || !data.session) throw new Error('Log ind igen.');
    const response = await fetch(endpoint + (method === 'GET' ? '?list=all' : ''), {
      method, headers: { Authorization: 'Bearer ' + data.session.access_token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}), cache: 'no-store'
    });
    if (response.status === 401 || response.status === 403) {
      users = []; $('users').replaceChildren(); $('dashboard').hidden = true;
      throw new Error('Du har ikke admin-adgang. Log ind igen.');
    }
    if (!response.ok) throw new Error('Kunne ikke gemme eller hente brugere. Prøv igen.');
    return response.json();
  }
  function render() {
    $('online').textContent = users.filter(online).length;
    $('total').textContent = users.length;
    $('pending').textContent = users.filter(u => u.status === 'pending').length;
    const query = $('search').value.trim().toLocaleLowerCase('da');
    const filter = $('filter').value;
    const filtered = users.filter(u => (`${u.full_name || ''} ${u.email || ''}`).toLocaleLowerCase('da').includes(query) &&
      (filter === 'all' || filter === 'online' && online(u) || filter === 'pending' && u.status === 'pending' || filter === 'admins' && u.is_admin || filter === 'blocked' && ['rejected', 'suspended'].includes(u.status)));
    const size = pageSize(), pages = Math.max(1, Math.ceil(filtered.length / size));
    page = Math.min(page, pages);
    $('users').replaceChildren();
    for (const user of filtered.slice((page - 1) * size, page * size)) {
      const row = document.createElement('tr');
      const identity = row.insertCell(); identity.className = 'identity';
      // Brugerindhold indsættes kun som tekst, aldrig som HTML.
      for (const value of [user.full_name || 'Uden navn', user.email || '']) {
        const span = document.createElement('span'); span.textContent = value; span.title = value; identity.append(span);
      }
      row.insertCell().textContent = online(user) ? (status[user.status] || 'Ukendt') + ' · Online' : status[user.status] || 'Ukendt';
      row.insertCell().textContent = user.is_admin ? 'Admin' : 'Bruger';
      const actions = row.insertCell(); actions.className = 'actions';
      const add = (text, action, extra = {}) => {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = text;
        button.disabled = busy || user.id === userId;
        button.onclick = async () => {
          if (busy) return;
          if (['suspend', 'force_logout'].includes(action) && !confirm(`${text}: ${user.email || user.full_name || 'bruger'}?`)) return;
          busy = true; render();
          try {
            const result = await request('POST', { user_id: user.id, action, ...extra });
            await load();
            say(result.audit_logged === false ? 'Brugeren logges ud. Loggen kunne ikke gemmes.' : action === 'force_logout' ? 'Brugeren logges ud inden for 1 minut.' : 'Gemt.');
          }
          catch (error) { say(error.message); }
          finally { busy = false; render(); }
        };
        actions.append(button);
      };
      if (user.status === 'pending') add('Godkend', 'approve');
      if (['suspended', 'rejected'].includes(user.status)) add('Ophæv spærring', 'reactivate');
      else add('Spær', 'suspend');
      add('Smid ud', 'force_logout');
      add(user.is_admin ? 'Fjern admin' : 'Gør til admin', 'set_admin', { is_admin: !user.is_admin });
      $('users').append(row);
    }
    if (!filtered.length) { const row = document.createElement('tr'); const cell = row.insertCell(); cell.colSpan = 4; cell.textContent = 'Ingen brugere fundet.'; $('users').append(row); }
    $('page').textContent = `Side ${page} af ${pages}`;
    $('prev').disabled = page === 1 || busy; $('next').disabled = page === pages || busy;
  }
  async function load() {
    if (loading) return;
    loading = true;
    try { const result = await request('GET'); users = result; render(); $('dashboard').hidden = false; }
    finally { loading = false; }
  }
  platform.ready.then(async user => {
    if (!user) return;
    if (platform.is_admin !== true) { say('Kun admin har adgang til denne side.'); return; }
    userId = user.id;
    $('search').oninput = $('filter').onchange = () => { page = 1; render(); };
    $('prev').onclick = () => { page--; render(); }; $('next').onclick = () => { page++; render(); };
    window.addEventListener('resize', render);
    window.addEventListener('pf-profile', () => {
      if (!platform.is_admin || platform.blocked) { users = []; $('dashboard').hidden = true; say('Du har ikke admin-adgang.'); }
    });
    try { await load(); say('Online viser aktivitet de seneste 2 minutter.'); } catch (error) { say(error.message); }
    setInterval(async () => {
      if (busy || !platform.is_admin || platform.blocked) return;
      try { await load(); say('Online viser aktivitet de seneste 2 minutter.'); } catch (error) { say(error.message); }
    }, 30000);
  });
})();
