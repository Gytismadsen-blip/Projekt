/* ---------------- FAVORITES ---------------- */
const FAV_KEY = 'regnemaskine_favs';
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9æøå]+/g, '-').replace(/(^-|-$)/g, ''); }
function loadFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; } }
function saveFavs(favs) { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); }

function initFavorites() {
  const favs = loadFavs();
  document.querySelectorAll('.calc-card').forEach(card => {
    const heading = card.querySelector('h3');
    if (!heading) return;
    const id = card.id || 'card-' + slugify(heading.textContent);
    card.dataset.favId = id;

    const star = document.createElement('button');
    star.className = 'fav-star' + (favs.includes(id) ? ' is-fav' : '');
    star.setAttribute('aria-label', 'Favorit');
    star.innerHTML = '<i data-lucide="star" class="w-4 h-4"></i>';
    star.addEventListener('click', () => toggleFavorite(id, heading.textContent.trim(), star));
    card.appendChild(star);
  });
  if (window.lucide) lucide.createIcons();
  renderFavSection();
}

function toggleFavorite(id, label, starEl) {
  let favs = loadFavs();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    starEl.classList.remove('is-fav');
  } else {
    favs.push(id);
    starEl.classList.add('is-fav');
  }
  saveFavs(favs);
  renderFavSection();
}

function renderFavSection() {
  const favs = loadFavs();
  const section = document.getElementById('fav-section');
  const list = document.getElementById('fav-list');
  section.classList.toggle('has-favs', favs.length > 0);
  list.innerHTML = '';

  favs.forEach(id => {
    const card = document.querySelector(`[data-fav-id="${id}"]`);
    if (!card) return;
    const heading = card.querySelector('h3');
    const label = heading ? heading.textContent.trim() : id;
    const chip = document.createElement('button');
    chip.className = 'fav-chip text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-950/60';
    chip.innerHTML = `<i data-lucide="star" class="w-3 h-3"></i> <span>${escapeHTML(label)}</span>`;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-panel').forEach(p => p.classList.add('active'));
      document.querySelectorAll('.calc-card').forEach(c => c.classList.remove('hidden'));
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('flash-highlight');
      setTimeout(() => card.classList.remove('flash-highlight'), 1200);
    });
    list.appendChild(chip);
  });
  if (window.lucide) lucide.createIcons();
}

