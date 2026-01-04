/* ARC Raiders Cheat Sheet (Interactive) - static GitHub Pages app */
const fmt = new Intl.NumberFormat(undefined);

const els = {
  q: document.getElementById('q'),
  section: document.getElementById('section'),
  category: document.getElementById('category'),
  sort: document.getElementById('sort'),
  reset: document.getElementById('reset'),
  grid: document.getElementById('grid'),
  count: document.getElementById('count'),
  tpl: document.getElementById('cardTpl')
};

function parseDelta(delta) {
  if (!delta) return null;
  // delta like "+8%" or "-26%"
  const m = String(delta).match(/([+-])\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const sign = m[1] === '-' ? -1 : 1;
  return sign * Number(m[2]);
}

function uniq(arr) {
  return [...new Set(arr)].filter(Boolean).sort((a,b)=>a.localeCompare(b));
}

function fillSelect(selectEl, options, labelAll) {
  selectEl.innerHTML = '';
  const all = document.createElement('option');
  all.value = '';
  all.textContent = labelAll;
  selectEl.appendChild(all);

  for (const opt of options) {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    selectEl.appendChild(o);
  }
}

function cardBadge(item) {
  const d = parseDelta(item.recycleDelta);
  if (d == null) return 'Δ N/A';
  return d > 0 ? `Δ +${d}%` : `Δ ${d}%`;
}

function render(items) {
  els.grid.innerHTML = '';
  els.count.textContent = String(items.length);

  const frag = document.createDocumentFragment();
  for (const item of items) {
    const node = els.tpl.content.cloneNode(true);
    node.querySelector('.name').textContent = item.name;

    const badge = node.querySelector('.badge');
    badge.textContent = cardBadge(item);

    node.querySelector('.sell').textContent = fmt.format(item.sellValue);

    const deltaEl = node.querySelector('.delta');
    if (!item.recycleDelta) {
      deltaEl.textContent = '—';
      deltaEl.classList.add('na');
    } else {
      deltaEl.textContent = item.recycleDelta;
      const d = parseDelta(item.recycleDelta);
      if (d > 0) deltaEl.classList.add('good');
      else if (d < 0) deltaEl.classList.add('bad');
    }

    const sec = node.querySelector('.section');
    sec.textContent = item.section || 'Unsorted';
    const cat = node.querySelector('.category');
    cat.textContent = item.category || 'Uncategorized';

    frag.appendChild(node);
  }
  els.grid.appendChild(frag);
}

function applyFilters(allItems) {
  const q = els.q.value.trim().toLowerCase();
  const sec = els.section.value;
  const cat = els.category.value;
  const sort = els.sort.value;

  let items = allItems.slice();

  if (sec) items = items.filter(i => (i.section || '') === sec);
  if (cat) items = items.filter(i => (i.category || '') === cat);

  if (q) {
    items = items.filter(i => {
      const name = (i.name || '').toLowerCase();
      const section = (i.section || '').toLowerCase();
      const category = (i.category || '').toLowerCase();
      const delta = (i.recycleDelta || '').toLowerCase();
      const value = String(i.sellValue ?? '');
      return (
        name.includes(q) ||
        section.includes(q) ||
        category.includes(q) ||
        delta.includes(q) ||
        value.includes(q)
      );
    });
  }

  items.sort((a,b) => {
    const da = parseDelta(a.recycleDelta);
    const db = parseDelta(b.recycleDelta);

    switch (sort) {
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'value-desc': return (b.sellValue ?? 0) - (a.sellValue ?? 0);
      case 'value-asc': return (a.sellValue ?? 0) - (b.sellValue ?? 0);
      case 'delta-desc': return (db ?? -9999) - (da ?? -9999);
      case 'delta-asc': return (da ?? 9999) - (db ?? 9999);
      default: return 0;
    }
  });

  render(items);
}

async function main() {
  const res = await fetch('./data/items.json', { cache: 'no-store' });
  const payload = await res.json();
  const allItems = (payload.items || []).map(i => ({
    ...i,
    name: String(i.name || '').trim()
  })).filter(i => i.name);

  // Build select options
  const sections = uniq(allItems.map(i => i.section));
  const categories = uniq(allItems.map(i => i.category));

  fillSelect(els.section, sections, 'All sections');
  fillSelect(els.category, categories, 'All categories');

  // wire listeners
  const onChange = () => applyFilters(allItems);
  ['input','change'].forEach(evt => {
    els.q.addEventListener(evt, onChange);
    els.section.addEventListener(evt, onChange);
    els.category.addEventListener(evt, onChange);
    els.sort.addEventListener(evt, onChange);
  });

  els.reset.addEventListener('click', () => {
    els.q.value = '';
    els.section.value = '';
    els.category.value = '';
    els.sort.value = 'name-asc';
    applyFilters(allItems);
  });

  applyFilters(allItems);
}

main().catch(err => {
  console.error(err);
  els.grid.innerHTML = `<div class="card"><div class="name">Failed to load data</div><div class="subtitle">Check console for details.</div></div>`;
});
function getIconPath(item){
  const cat = (item.category || "").toLowerCase();
  const sec = (item.section || "").toLowerCase();

  // Prefer specific categories
  if (cat.includes("metal")) return "assets/icons/metal.svg";
  if (cat.includes("fabric")) return "assets/icons/fabric.svg";
  if (cat.includes("chemical")) return "assets/icons/chem.svg";
  if (cat.includes("plastic")) return "assets/icons/plastic.svg";
  if (cat.includes("rubber")) return "assets/icons/rubber.svg";
  if (cat.includes("base components")) return "assets/icons/base.svg";

  // Fallback by section
  if (sec.includes("high-tier")) return "assets/icons/hightier.svg";
  if (sec.includes("essentials")) return "assets/icons/base.svg";
  return "assets/icons/components.svg";
}


