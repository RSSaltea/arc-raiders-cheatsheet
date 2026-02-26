/* =====================================================
   ARC RAIDERS HUB — LocalStorage Tracker
   ===================================================== */

const KEYS = {
  blueprints:  'arc-hub-blueprints',
  expedition:  'arc-hub-expedition',
  personal:    'arc-hub-personal',
};

const BP_CYCLE = ['not-collected', 'collected', 'wishlist', 'has-spares'];

const Tracker = {

  // ── Blueprints ──────────────────────────────────────
  bp: {
    _load() {
      try { return JSON.parse(localStorage.getItem(KEYS.blueprints)) || {}; }
      catch { return {}; }
    },
    _save(s) { localStorage.setItem(KEYS.blueprints, JSON.stringify(s)); },

    status(id) { return this._load()[id] || 'not-collected'; },

    cycle(id) {
      const s = this._load();
      const cur = s[id] || 'not-collected';
      s[id] = BP_CYCLE[(BP_CYCLE.indexOf(cur) + 1) % BP_CYCLE.length];
      this._save(s);
      return s[id];
    },

    setStatus(id, status) {
      const s = this._load(); s[id] = status; this._save(s);
    },

    countCollected(ids) {
      const s = this._load();
      return ids.filter(id => s[id] === 'collected' || s[id] === 'has-spares').length;
    },

    export() { return JSON.stringify(this._load(), null, 2); },

    import(json) {
      try { this._save(JSON.parse(json)); return true; }
      catch { return false; }
    },

    reset() { localStorage.removeItem(KEYS.blueprints); }
  },

  // ── Expedition ──────────────────────────────────────
  exp: {
    _load() {
      try { return JSON.parse(localStorage.getItem(KEYS.expedition)) || {}; }
      catch { return {}; }
    },
    _save(s) { localStorage.setItem(KEYS.expedition, JSON.stringify(s)); },

    isChecked(key) { return !!this._load()[key]; },

    toggle(key) {
      const s = this._load();
      s[key] = !s[key];
      this._save(s);
      return s[key];
    },

    progress(phases) {
      const s = this._load();
      let total = 0, done = 0;
      phases.forEach((ph, pi) => {
        (ph.items || []).forEach((_, ii) => {
          total++;
          if (s[`${pi}_${ii}`]) done++;
        });
      });
      return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
    },

    phaseProgress(phase, phaseIndex) {
      const s = this._load();
      const total = phase.items.length;
      const done = phase.items.filter((_, ii) => s[`${phaseIndex}_${ii}`]).length;
      return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
    },

    reset() { localStorage.removeItem(KEYS.expedition); }
  },

  // ── Personal Tracker ─────────────────────────────────
  personal: {
    _load() {
      try { return JSON.parse(localStorage.getItem(KEYS.personal)) || {}; }
      catch { return {}; }
    },
    _save(s) { localStorage.setItem(KEYS.personal, JSON.stringify(s)); },

    get(id) { return (this._load()[id] || {}).have || 0; },

    set(id, val) {
      const s = this._load();
      if (!s[id]) s[id] = {};
      s[id].have = Math.max(0, Number(val) || 0);
      this._save(s);
    },

    inc(id) { this.set(id, this.get(id) + 1); },
    dec(id) { this.set(id, this.get(id) - 1); },

    reset() { localStorage.removeItem(KEYS.personal); }
  }
};

window.Tracker = Tracker;
