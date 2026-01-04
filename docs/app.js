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
  return [...new Set(arr)].filter(Boolean).sort((a, b) => a.localeCompare(b));
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

    // Name
    const nameEl = node.querySelector('.name');
    if (nameEl) nameEl.textContent = item.name;

    // Badge (Recycle Δ) with color
    const badge = node.querySelector('.badge');
    if (badge) {
      badge.textContent = cardBadge(item);
      badge.classList.remove('good', 'bad');

      const d = parseDelta(item.recycleDelta);
      if (d > 0) badge.classList.add('good');
      else if (d < 0) badge.classList.add('bad');
    }

    // Sell value
    const sellEl = node.querySelector('.sell');
    if (sellEl) sellEl.textContent = fmt.format(item.sellValue ?? 0);

    // Section / Category tags (multi)
    const secEl = node.querySelector('.section');
    if (secEl) {
      secEl.textContent =
        (item.sections && item.sections.length) ? item.sections.join(' • ') : 'Unsorted';
    }

    const catEl = node.querySelector('.category');
    if (catEl) {
      catEl.textContent =
        (item.categories && item.categories.length) ? item.categories.join(' • ') : 'Uncategorized';
    }

    // Icon (PNG/WebP/etc.) - uses item.icon, no SVG required
    const icon = node.querySelector('.icon');
    if (icon) {
      if (item.icon) {
        icon.className = 'icon';
        icon.style.backgroundImage = `url("${item.icon}")`;
      } else {
        icon.style.backgroundImage = '';
        icon.className = 'icon';
      }
    }

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

  // Filter by multi sections/categories
  if (sec) items = items.filter(i => (i.sections || []).includes(sec));
  if (cat) items = items.filter(i => (i.categories || []).includes(cat));

  // Search
  if (q) {
    items = items.filter(i => {
      const name = (i.name || '').toLowerCase();
      const section = (i.sections || []).join(' ').toLowerCase();
      const category = (i.categories || []).join(' ').toLowerCase();
      const delta = (i.recycleDelta || '').toLowerCase();
      const value = String(i.sellValue ?? '');
      const icon = (i.icon || '').toLowerCase();

      return (
        name.includes(q) ||
        section.includes(q) ||
        category.includes(q) ||
        delta.includes(q) ||
        value.includes(q) ||
        icon.includes(q)
      );
    });
  }

  // Sort
  items.sort((a, b) => {
    const da = parseDelta(a.recycleDelta);
    const db = parseDelta(b.recycleDelta);

    switch (sort) {
      case 'name-asc': return (a.name || '').localeCompare(b.name || '');
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

  // Support both: { items: [...] } and [ ... ]
  const rawItems = Array.isArray(payload) ? payload : (payload.items || []);

  // Normalize to multi sections/categories
  const allItems = rawItems.map(i => ({
    ...i,
    name: String(i.name || '').trim(),
    sections: Array.isArray(i.sections) ? i.sections.filter(Boolean) : (i.section ? [i.section] : []),
    categories: Array.isArray(i.categories) ? i.categories.filter(Boolean) : (i.category ? [i.category] : [])
  })).filter(i => i.name);

  // Build select options
  const sections = uniq(allItems.flatMap(i => i.sections));
  const categories = uniq(allItems.flatMap(i => i.categories));

  fillSelect(els.section, sections, 'All sections');
  fillSelect(els.category, categories, 'All categories');

  // Wire listeners
  const onChange = () => applyFilters(allItems);
  ['input', 'change'].forEach(evt => {
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
  els.grid.innerHTML =
    `<div class="card"><div class="name">Failed to load data</div><div class="subtitle">Check console for details.</div></div>`;
});
