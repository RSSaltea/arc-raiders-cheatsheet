/* =====================================================
   ARC RAIDERS HUB — Shared Navigation
   ===================================================== */

const NAV = [
  {
    section: 'Main',
    items: [
      { href: 'index.html',       icon: '⬡',  label: 'Dashboard',       id: 'index' },
    ]
  },
  {
    section: 'Database',
    items: [
      { href: 'wiki.html',        icon: '📖', label: 'Item Wiki',        id: 'wiki' },
      { href: 'attachments.html', icon: '🔩', label: 'Attachments',      id: 'attachments' },
      { href: 'keys.html',        icon: '🗝', label: 'Key Locations',    id: 'keys' },
      { href: 'workshop.html',    icon: '🏭', label: 'Workshop',          id: 'workshop' },
    ]
  },
  {
    section: 'Tracking',
    items: [
      { href: 'blueprints.html',  icon: '📋', label: 'Blueprints',       id: 'blueprints' },
      { href: 'expedition.html',  icon: '🗺', label: 'Expedition',       id: 'expedition' },
      { href: 'personal.html',    icon: '⭐', label: 'Personal Tracker', id: 'personal' },
    ]
  }
];

function initNav() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const page = window.location.pathname.split('/').pop().replace('.html','') || 'index';

  let html = `
    <div class="sidebar-logo">
      <a href="index.html">
        <div class="logo-icon">⬡</div>
        <div>
          <div class="logo-text">ARC Raiders</div>
          <div class="logo-sub">Hub</div>
        </div>
      </a>
    </div>
    <div class="sidebar-search">
      <span class="s-icon">🔍</span>
      <input type="text" id="g-search" placeholder="Search items... (Ctrl+K)" autocomplete="off">
      <div id="search-results"></div>
    </div>
    <nav class="sidebar-nav">
  `;

  for (const section of NAV) {
    html += `<div class="sidebar-section"><div class="sidebar-section-label">${section.section}</div>`;
    for (const item of section.items) {
      const active = page === item.id || (page === '' && item.id === 'index');
      html += `<a href="${item.href}" class="nav-item${active ? ' active' : ''}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>`;
    }
    html += `</div>`;
  }

  html += `</nav>
    <div class="sidebar-footer">
      Data: PDF v3.2 · Jan 2026<br>
      Credit: u/pRoDeeD
    </div>`;

  sidebar.innerHTML = html;

  // Global search
  const inp = document.getElementById('g-search');
  const res = document.getElementById('search-results');

  if (inp) {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); inp.focus(); }
      if (e.key === 'Escape' && document.activeElement === inp) { inp.blur(); inp.value = ''; res.innerHTML = ''; }
    });

    inp.addEventListener('input', debounce(async e => {
      const q = e.target.value.trim().toLowerCase();
      if (!q || q.length < 2) { res.innerHTML = ''; return; }

      const [itemData, bpData] = await Promise.all([
        loadJSON('data/items.json').catch(() => ({ items: [] })),
        loadJSON('data/blueprints.json').catch(() => ({ blueprints: [] })),
      ]);

      const hits = [];
      for (const it of (itemData.items || [])) {
        if (it.name.toLowerCase().includes(q)) hits.push({ type: 'item', name: it.name, href: `wiki.html#${it.id}` });
      }
      for (const bp of (bpData.blueprints || [])) {
        if (bp.name.toLowerCase().includes(q)) hits.push({ type: 'blueprint', name: bp.name, href: `blueprints.html` });
      }

      if (!hits.length) {
        res.innerHTML = `<div style="padding:10px 14px;font-size:12px;color:var(--text-muted)">No results</div>`;
      } else {
        res.innerHTML = hits.slice(0, 7).map(h => `
          <a href="${h.href}" style="display:flex;align-items:center;gap:8px;padding:9px 14px;font-size:12px;color:var(--text-primary);border-bottom:1px solid var(--border-subtle);">
            <span style="font-size:9px;padding:2px 6px;border-radius:3px;background:var(--bg-card);color:var(--text-muted);font-family:var(--font-mono)">${h.type}</span>
            ${h.name}
          </a>`).join('');
      }

      Object.assign(res.style, {
        position: 'absolute', left: '0', top: '100%', width: '100%',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderTop: 'none', zIndex: '9999', maxHeight: '260px', overflowY: 'auto'
      });

      setTimeout(() => {
        document.addEventListener('click', () => { res.innerHTML = ''; }, { once: true });
      }, 100);
    }, 250));
  }
}

// ========================
// Shared Utilities
// ========================
const _cache = {};

async function loadJSON(path) {
  if (_cache[path]) return _cache[path];
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Cannot load ${path}`);
  _cache[path] = await r.json();
  return _cache[path];
}

function debounce(fn, ms) {
  let t;
  return function(...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
}

function formatCoins(n) {
  return n?.toLocaleString() ?? '—';
}

function roiClass(roi) {
  if (roi === null || roi === undefined) return 'neu';
  if (roi > 0) return 'pos';
  if (roi < -15) return 'neg';
  return 'neu';
}

function roiLabel(roi) {
  if (roi === null || roi === undefined) return '—';
  return (roi > 0 ? '+' : '') + roi + '%';
}

function rarityClass(r) { return r || 'common'; }

// Expose globally
window.arcHub = { loadJSON, debounce, formatCoins, roiClass, roiLabel, rarityClass };

document.addEventListener('DOMContentLoaded', initNav);
