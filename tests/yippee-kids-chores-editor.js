/*
 * Yippee! - Kids Chores – visueller Karten-Editor (✏️ Dashboard bearbeiten → Karte bearbeiten)
 * Eigene Datei, damit die Karte schneller startet: sie wird erst geladen, wenn der Editor geöffnet wird.
 * Gehört zu yippee-kids-chores-card.js (gleiche Version) – https://github.com/Chrism1412/yippee-kids-chores-card · Lizenz: MIT
 */
export default function install(Y) {
  const { LANGS, T, THEMES, emoWatch, esc } = Y;
  class YippeeCardEditor extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); emoWatch(this.shadowRoot); this.shadowRoot.addEventListener('change', (e) => this._change(e)); }
    setConfig(c) { this._config = { ...c }; this._draw(); this._loadKids(); }
    set hass(h) { const f = !this._hass; this._hass = h; if (f) { this._draw(); this._loadKids(); } }

    async _loadKids() {
      if (!this._hass || !this._config || !this._hass.states[this._config.storage] || this._kidsFor === this._config.storage) return;
      this._kidsFor = this._config.storage;
      try {
        const r = await this._hass.callWS({ type: 'todo/item/list', entity_id: this._config.storage });
        this._kidNames = (r.items || []).filter((i) => (i.summary || '').startsWith('kp|kid|')).map((i) => { try { return JSON.parse(i.description).name; } catch (e) { return null; } }).filter(Boolean);
        // ⚙️ → 🎨 Darstellung: damit „wie in ⚙️ Einstellungen“ zeigen kann, was gerade gilt
        const cf = (r.items || []).find((i) => i.summary === 'kp|cfg|main');
        try { this._gLook = cf ? JSON.parse(cf.description || '{}') : {}; } catch (e) { this._gLook = null; }
        this._draw();
      } catch (e) { /* ignorieren */ }
    }

    _draw() {
      if (!this._hass || !this._config) return;
      const c = this._config;
      const todos = Object.keys(this._hass.states).filter((e) => e.startsWith('todo.')).sort();
      const opt = (v, l, sel) => `<option value="${esc(v)}" ${sel ? 'selected' : ''}>${esc(l)}</option>`;
      const kid = c.mode === 'kid' || c.mode === 'kids';
      const single = c.mode === 'kid', advM = c.mode === 'advent';
      const foldOn = !!c.collapsed;
      this.shadowRoot.innerHTML = `<style>
        .ed{display:flex;flex-direction:column;gap:14px;color:var(--primary-text-color)}
        label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600}
        select,input[type=text]{font:inherit;font-size:14px;padding:9px 10px;border-radius:8px;border:1px solid var(--divider-color,#ccc);background:var(--card-background-color,#fff);color:var(--primary-text-color)}
        .row{flex-direction:row;align-items:center;gap:10px;font-weight:400;font-size:14px}
        small{color:var(--secondary-text-color);font-weight:400}
        .sub{display:flex;flex-direction:column;gap:6px;padding-left:24px}
        .lbl2{font-weight:700;font-size:14px;margin-top:4px}
      </style><div class="ed">
        <label>${T('Speicher (Lokale To-do-Liste)')}<select data-k="storage">${(todos.includes(c.storage) ? todos : [c.storage, ...todos]).map((e) => opt(e, `${(this._hass.states[e] && this._hass.states[e].attributes.friendly_name) || e} (${e})`, e === c.storage)).join('')}</select></label>
        <label>${T('Sprache (nur diese Karte)')}<select data-k="language"><option value="">${esc(T('wie in den Einstellungen der Karte'))}</option>${LANGS.map(([code, n]) => opt(code, n, c.language === code)).join('')}</select></label>
        <label>${T('Ansicht')}<select data-k="mode">${opt('admin', T('👨‍👩‍👧 Eltern-Ansicht'), !kid)}${opt('kids', T('👧👦 Alle Kinder (automatisch)'), c.mode === 'kids')}${opt('kid', T('🧒 Ein bestimmtes Kind'), single)}${opt('advent', T('🎄 Adventskalender'), advM)}</select></label>
        ${c.mode === 'kids' ? `<small>${T('Zeigt automatisch alle Kinder – neu angelegte Kinder erscheinen von selbst.')}</small>` : ''}
        ${advM ? `<small>${T('Zeigt nur den Adventskalender. Einschalten und befüllen in der Eltern-Ansicht (⚙️ Einstellungen → 🎄 Adventskalender). Ohne Kind: alle Kinder zum Umschalten.')}</small>` : ''}
        ${single || advM ? `<label>${T('Kind')}<input type="text" data-k="child" list="kids" value="${esc(c.child || '')}" placeholder="${esc(advM ? T('leer = alle Kinder') : T('z. B. Mia'))}"><datalist id="kids">${(this._kidNames || []).map((n) => `<option value="${esc(n)}"></option>`).join('')}</datalist>
          <small>${(this._kidNames || []).length ? T('Angelegt: {names}', { names: esc(this._kidNames.join(', ')) }) : T('Kinder legst du in der Eltern-Ansicht an.')}</small></label>` : ''}
        ${kid ? `<label class="row"><input type="checkbox" data-k="summary" ${c.summary ? 'checked' : ''}> ${T('🧒 Nur kleine Übersicht (z. B. fürs Familien-Dashboard)')}</label>
          ${c.summary ? `<div class="sub">${[['points', T('⭐ Punkte')], ['today', T('✅ Heute')], ['goal', T('🎯 Ziel')], ['level', T('🌱 Level')], ['net', T('➖ Bilanz (bei Minus-Stand)')]].map(([v, l]) => `<label class="row"><input type="checkbox" data-k="show" data-v="${v}" ${!Array.isArray(c.show) || !c.show.length || c.show.includes(v) ? 'checked' : ''}> ${l}</label>`).join('')}</div>
            <div class="sub"><div class="lbl2">${T('👆 Beim Antippen der Übersicht')}</div>
            ${[['tap_action', T('👆 Antippen')], ['double_tap_action', T('👆👆 Doppelt tippen')], ['hold_action', T('✋ Lange drücken')]].map(([k, l]) => {
              const a = c[k] && typeof c[k] === 'object' ? c[k] : null, t = a ? a.action : '';
              const known = ['', 'none', 'navigate', 'more-info', 'url'].includes(t || '');
              return `<label>${l}<select data-k="act" data-x="${k}">${opt('', T('nichts'), !t || t === 'none')}${opt('navigate', T('Seite öffnen'), t === 'navigate')}${opt('more-info', T('Details öffnen (Sensor des Kindes)'), t === 'more-info')}${opt('url', T('Link öffnen'), t === 'url')}${known ? '' : opt(t, T('eigene Aktion (YAML): {a}', { a: t }), true)}</select></label>
                ${t === 'navigate' ? `<label>${T('Seite')}<input type="text" data-k="actp" data-x="${k}" data-f="navigation_path" value="${esc(a.navigation_path || '')}" placeholder="/dashboard-haus/{kind}"></label>` : ''}
                ${t === 'url' ? `<label>${T('Webadresse')}<input type="text" data-k="actp" data-x="${k}" data-f="url_path" value="${esc(a.url_path || '')}" placeholder="https://…"></label>` : ''}`;
            }).join('')}
            <small>${T('{kind} in der Seite wird durch den Namen des angetippten Kindes ersetzt, z. B. /dashboard-haus/{kind} → /dashboard-haus/mia.')}</small></div>` : ''}
          <label class="row"><input type="checkbox" data-k="collapsed" ${foldOn ? 'checked' : ''}> ${T('Eingeklappt anzeigen – nur Name und Punkte, Aufgaben erst nach Antippen')}</label>
          <label class="row"><input type="checkbox" data-k="family" ${c.family === false ? '' : 'checked'}> ${T('Familienziel anzeigen')}${single ? ` <small>${T('(bei mehreren Kinder-Karten auf einer Seite erscheint es automatisch nur einmal)')}</small>` : ''}</label>
          <small>${T('Freigabe und Benachrichtigungen stellst du in der Eltern-Ansicht unter ⚙️ Einstellungen ein – sie gelten automatisch auch hier.')}</small>` : advM ? '' : `<small>${T('Freigabe und Benachrichtigungen (auch mehrere Handys) stellst du direkt in der Eltern-Ansicht unter ⚙️ Einstellungen ein.')}</small>
        <label>${T('PIN für die Eltern-Ansicht')}<input type="text" inputmode="numeric" autocomplete="off" data-k="pin" value="${esc(c.pin ?? '')}" placeholder="${esc(T('leer = kein Schutz'))}">
          <small>${T('Nur Ziffern, z. B. 1234. Nach {n} Minuten ohne Bedienung wird wieder gesperrt.', { n: Number(c.pin_minutes) || 5 })}</small></label>`}
        <div class="lbl2">${T('🎨 Darstellung')}</div>
        ${kid || advM ? (() => {
          const cur = Number(c.advent_size) >= 50 && Number(c.advent_size) <= 220 ? Math.round(Number(c.advent_size)) : 0;
          const vals = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220];
          return `<label>${T('🎄 Türchengröße im Adventskalender (nur diese Karte)')}<select data-k="advent_size">${opt('', T('wie in der Eltern-Ansicht'), !cur)}${(vals.includes(cur) || !cur ? vals : [...vals, cur].sort((a, b) => a - b)).map((v) => opt(String(v), `${v} px`, cur === v)).join('')}</select>
          <small>${T('Gilt auf jedem Gerät, das diese Karte zeigt – praktisch fürs Wand-Tablet mit eigenem Dashboard. Eine Größe „nur dieses Gerät“ aus der Eltern-Ansicht hat Vorrang.')}</small></label>`;
        })() : ''}
        ${(() => {
          const gt = this._gLook ? this._gLook.vTheme : undefined;
          const nm = (id) => (id === 'custom' ? T('✏️ Eigene Farben') : id && THEMES.find((x) => x[0] === id) ? T(THEMES.find((x) => x[0] === id)[1]) : T('Wie das Dashboard'));
          const cur = c.colors === undefined || c.colors === '' ? '' : String(c.colors);
          return `<label>${T('🎨 Farben')}<select data-k="colors">${opt('', T('wie in ⚙️ Einstellungen') + (this._gLook ? ` (${nm(gt)})` : ''), cur === '')}${opt('default', T('Wie das Dashboard'), cur === 'default')}${THEMES.map((t) => opt(t[0], T(t[1]), cur === t[0])).join('')}${opt('custom', T('✏️ Eigene Farben (aus ⚙️ Einstellungen)'), cur === 'custom')}</select></label>`;
        })()}
        ${[['equal_tiles', T('📏 Gleich hohe Kacheln')], ['compact', T('Kompakt – weniger Abstände')], ['transparent', T('Ohne eigenen Hintergrund (passt sich dem Dashboard an)')]].map(([k, l]) => {
          const v = c[k] === undefined || c[k] === '' ? '' : (c[k] === true || c[k] === 'true' || c[k] === 'on') ? 'on' : 'off';
          const g = this._gLook ? ` (${this._gLook[{ equal_tiles: 'vEqual', compact: 'vCompact', transparent: 'vTransp' }[k]] ? T('an') : T('aus')})` : '';
          return `<label>${l}<select data-k="${k}">${opt('', T('wie in ⚙️ Einstellungen') + g, v === '')}${opt('on', T('an'), v === 'on')}${opt('off', T('aus'), v === 'off')}</select></label>`;
        }).join('')}
        <label>${T('Größe')}<select data-k="scale">${opt('', T('wie in ⚙️ Einstellungen') + (this._gLook ? ` (${Math.min(130, Math.max(70, Number(this._gLook.vScale) || 100))} %)` : ''), c.scale === undefined || c.scale === '')}${[70, 80, 90, 100, 110, 120, 130].map((v) => opt(String(v), `${v} %`, c.scale !== undefined && c.scale !== '' && Number(c.scale) === v)).join('')}</select>
          <small>${T('„wie in ⚙️ Einstellungen“ = was in der Eltern-Ansicht unter ⚙️ → 🎨 Darstellung für alle Karten eingestellt ist.')} ${T('Farben lassen sich über Themes oder card_mod anpassen: --yippee-bg, --yippee-surface, --yippee-accent, --yippee-text.')}</small></label>
      </div>`;
    }

    _change(e) {
      const el = e.target, k = el.dataset.k;
      if (!k) return;
      const c = { ...this._config };
      if (k === 'approval') { if (el.checked) delete c.approval; else c.approval = false; }
      else if (k === 'family') { if (el.checked) delete c.family; else c.family = false; }
      else if (k === 'collapsed') {
        if (el.checked) c.collapsed = true; else delete c.collapsed; // gilt für „Alle Kinder“ und „Ein Kind“ gleich (Standard: aufgeklappt)
      }
      else if (k === 'pin') { const v = el.value.replace(/\D/g, ''); if (v) c.pin = v; else delete c.pin; }
      else if (k === 'summary') { if (el.checked) c[k] = true; else { delete c[k]; delete c.show; delete c.tap_action; delete c.double_tap_action; delete c.hold_action; } }
      else if (['compact', 'transparent', 'equal_tiles'].includes(k)) { if (el.value === 'on') c[k] = true; else if (el.value === 'off') c[k] = false; else delete c[k]; }
      else if (k === 'scale') { if (el.value) c.scale = Number(el.value); else delete c.scale; }
      else if (k === 'advent_size') { if (el.value) c.advent_size = Number(el.value); else delete c.advent_size; }
      else if (k === 'act') {
        // 👆 Aktion der Übersichtskarte: nichts = Eintrag entfernen; Pfad/Adresse bleibt beim Wechsel erhalten, wo sie passt
        const x = el.dataset.x, old = c[x] && typeof c[x] === 'object' ? c[x] : {};
        if (!el.value || el.value === 'none') delete c[x];
        else if (el.value === old.action) { /* unverändert (eigene Aktion) */ }
        else { const n = { action: el.value }; if (el.value === 'navigate' && old.navigation_path) n.navigation_path = old.navigation_path; if (el.value === 'url' && old.url_path) n.url_path = old.url_path; c[x] = n; }
      }
      else if (k === 'actp') { const x = el.dataset.x, v = el.value.trim(); c[x] = { ...(c[x] || {}), [el.dataset.f]: v }; if (!v) delete c[x][el.dataset.f]; }
      else if (k === 'show') {
        const all = ['points', 'today', 'goal', 'level', 'net'], cur = new Set(Array.isArray(c.show) && c.show.length ? c.show : all);
        if (el.checked) cur.add(el.dataset.v); else cur.delete(el.dataset.v);
        if (all.every((x) => cur.has(x))) delete c.show; else c.show = all.filter((x) => cur.has(x));
      }
      else if (el.value) c[k] = el.value.trim();
      else delete c[k];
      if (k === 'mode') { if (!['kid', 'advent'].includes(c.mode)) delete c.child; delete c.collapsed; if (c.mode === 'advent') { delete c.summary; delete c.show; delete c.family; delete c.pin; delete c.pin_minutes; } if (c.mode === 'admin') { delete c.advent_size; delete c.summary; delete c.show; delete c.tap_action; delete c.double_tap_action; delete c.hold_action; } if (c.mode === 'kid' || c.mode === 'kids') { delete c.pin; delete c.pin_minutes; } }
      if (k === 'storage') this._kidsFor = null;
      this._config = c;
      this._draw();
      this._loadKids();
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: c }, bubbles: true, composed: true }));
    }
  }
  if (!customElements.get('yippee-kids-chores-card-editor')) customElements.define('yippee-kids-chores-card-editor', YippeeCardEditor);
  return true;
}
