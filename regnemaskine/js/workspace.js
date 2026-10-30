/* Presentation only. Calculation inputs and handlers stay in their original cards. */
(() => {
  const desktop = () => matchMedia('(min-width:901px)').matches;
  const icon = name => `<picture><source srcset="/billeder/${name}.webp" type="image/webp"><img class="workspace-icon" src="/billeder/${name}.png" alt=""></picture>`;
  window.CargoPager = function(host) {
    if (host.querySelector(':scope > .workspace-flow')) return;
    const flow = document.createElement('div'); flow.className = 'workspace-flow';
    const heading = host.querySelector(':scope > h3');
    [...host.childNodes].forEach(n => { if (n !== heading && !(n.nodeType === 1 && n.classList.contains('fav-star'))) flow.append(n); });
    host.append(flow);
    const nav = document.createElement('div'); nav.className = 'workspace-pager';
    nav.innerHTML = '<span aria-live="polite"></span><button type="button">Tilbage</button><button type="button">Næste</button>';
    host.append(nav);
    const [prev,next] = nav.querySelectorAll('button'); let page = 0;
    function update() {
      if (!desktop() || !flow.clientWidth) return;
      const pages = Math.max(1, Math.ceil((flow.scrollWidth + 25) / (flow.clientWidth + 26)));
      page = Math.min(page,pages-1); flow.scrollLeft = page * (flow.clientWidth + 26);
      nav.querySelector('span').textContent = `Trin ${page+1} af ${pages}`;
      prev.disabled = page === 0; next.disabled = page >= pages-1;
    }
    prev.onclick = () => {page--;update();};next.onclick = () => {page++;update();};
    flow.addEventListener('focusin',()=>requestAnimationFrame(()=>{
      if (!desktop()) return;
      page=Math.round(flow.scrollLeft/(flow.clientWidth+26));update();
    }));
    new ResizeObserver(update).observe(flow);
    new MutationObserver(() => requestAnimationFrame(update)).observe(flow,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','open']});
    host.cargoUpdate = update; requestAnimationFrame(update);
  };
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('app-shell')) return;
    showApp();
    // Keep the existing home information available in a compact disclosure.
    document.getElementById('home-btn').replaceWith(document.getElementById('home-btn').cloneNode(true));
    document.getElementById('home-btn').addEventListener('click',()=>{const d=document.querySelector('.workspace-tools');d.open=!d.open;});
    const brand = document.querySelector('#app-shell header>div>div');
    brand.firstElementChild.outerHTML = icon('ikon_regne');
    const title = brand.querySelector('p'); title.textContent = 'Regnemaskine';
    const main = document.querySelector('#app-shell>main');
    const info = document.createElement('details');info.className='workspace-tools';info.innerHTML='<summary>Data og backup</summary><div class="workspace-info"></div>';
    const box = info.lastElementChild;
    const search = document.getElementById('search-box').parentElement;search.classList.add('workspace-search');
    [...main.children].forEach(el=>{if(el!==search && !el.matches('#cat-nav,.cat-panel,#print-area'))box.append(el);});
    main.prepend(info);
    const stage=document.createElement('div');stage.className='workspace-stage';
    stage.innerHTML='<div class="workspace-picker"><label for="workspace-calc">Vælg beregner</label><select id="workspace-calc"></select></div><div class="workspace-panels"></div>';
    main.append(stage);const panels=stage.lastElementChild;main.querySelectorAll(':scope > .cat-panel').forEach(p=>panels.append(p));
    const select=document.getElementById('workspace-calc'); let current=null;
    let cards=[...panels.querySelectorAll('.card')];
    cards.forEach(c=>CargoPager(c));
    function choose(c){current=c;cards.forEach(x=>x.classList.toggle('workspace-current',x===c));if(c){c.closest('.cat-panel').classList.add('active');requestAnimationFrame(()=>c.cargoUpdate?.());}}
    function refresh(){
      cards=[...panels.querySelectorAll('.card')];cards.forEach(c=>CargoPager(c));
      const q=document.getElementById('search-box').value.trim().toLowerCase();
      const choices=cards.filter(c=>q ? (c.textContent+' '+(c.dataset.keywords||'')).toLowerCase().includes(q):c.closest('.cat-panel').classList.contains('active'));
      select.replaceChildren(...choices.map(c=>{const o=document.createElement('option');o.value=cards.indexOf(c);o.textContent=(c.querySelector('h3,h4')?.textContent||'Guide').trim().split(' / ')[0].split(' — ')[0];return o;}));
      const chosen=choices.includes(current)?current:choices[0];choose(chosen);select.value=chosen?cards.indexOf(chosen):'';
    }
    select.onchange=()=>choose(cards[Number(select.value)]);
    document.querySelectorAll('.cat-btn').forEach(b=>b.addEventListener('click',()=>{document.getElementById('search-box').value='';cards.forEach(c=>c.classList.remove('hidden'));refresh();}));
    document.getElementById('search-box').addEventListener('input',refresh);
    document.getElementById('fav-list').addEventListener('click',e=>{const chip=e.target.closest('button');if(!chip)return;const label=chip.textContent.trim();const c=cards.find(c=>c.querySelector('h3')?.textContent.trim()===label);if(c){setCategory(c.closest('.cat-panel').id.slice(4));refresh();choose(c);select.value=cards.indexOf(c);info.open=false;}});
    document.getElementById('lang-select').addEventListener('change',refresh);
    new MutationObserver(refresh).observe(document.getElementById('guide-content'),{childList:true});
    const originalCategory=setCategory;
    setCategory=function(cat){originalCategory(cat);refresh();};
    document.getElementById('sd-transfer-btn').addEventListener('click',()=>{setCategory('lager');const c=document.getElementById('card-rop');choose(c);select.value=cards.indexOf(c);});
    const modal=document.querySelector('#scanner-modal>.card');if(modal){CargoPager(modal);modal.classList.add('workspace-current');}
    CargoPager(box);box.classList.add('workspace-current');
    refresh();
  });
})();
