/* Yippee! - Kids Chores – 📺 Bildschirmzeit mit Gerätesteuerung
 * Wird von der Karte nur geladen, wenn die Bildschirmzeit eingeschaltet ist (⚙️ Einstellungen → ⚙️ Allgemein → 📺 Bildschirmzeit).
 * Eine Belohnung mit 📺 wird zum Gutschein. Startet das Kind ihn, schaltet die Karte das Gerät ein, zählt herunter,
 * warnt 5 Minuten vorher und schaltet am Ende wieder aus. Laufende Zeiten liegen in der Liste (ss), damit jede geöffnete
 * Karte – z. B. das Wand-Tablet der Eltern – das Ausschalten übernehmen kann.
 */
export default function install(C, Y) {
  const { T, esc, uid } = Y;
  const DOM_ON = ['switch', 'input_boolean', 'light', 'fan', 'media_player', 'script', 'remote'];
  const fmt = (ms) => { const s = Math.max(0, Math.round(ms / 1000)), m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, '0')}`; };

  const CSS = `<style>
.scbar{display:flex;align-items:center;gap:10px;width:100%;margin:8px 0;padding:10px 14px;border:0;border-radius:18px;background:linear-gradient(135deg,#d0ebff,#a5d8ff);color:#0b2f55;font:inherit;text-align:left;cursor:pointer}
.scbar.warn{background:linear-gradient(135deg,#fff3bf,#ffd43b);color:#5c3d00}
.scbar .sce{font-size:30px}.scbar .grow{flex:1;min-width:0;display:grid;gap:4px}.scbar b{font-size:18px}
.scbar .bar{height:8px;border-radius:6px;background:rgba(255,255,255,.6);overflow:hidden}.scbar .bar i{display:block;height:100%;background:#1c7ed6}
.scbig{display:grid;gap:10px;justify-items:center;text-align:center}.scbig .t{font-size:56px;font-weight:900;font-variant-numeric:tabular-nums}
.scadm .scrow{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:14px;background:var(--soft)}.scadm .scrow+.scrow{margin-top:6px}.scadm .grow{flex:1;min-width:0}
</style>`;

  class S {
    _scList() { return Object.values(this._db.ss || {}).filter((s) => s && s.k && s.end); }
    _scName(e) { const st = e && this._hass.states[e]; return st ? (st.attributes && st.attributes.friendly_name) || e : e || ''; }
    _scSvc(ent, on) {
      if (!ent || !this._hass.states[ent]) return Promise.resolve();
      const dom = ent.split('.')[0];
      if (!DOM_ON.includes(dom)) return Promise.resolve();
      if (dom === 'script') return on ? this._hass.callService('script', 'turn_on', {}, { entity_id: ent }).catch(() => {}) : Promise.resolve();
      return this._hass.callService(dom, on ? 'turn_on' : 'turn_off', {}, { entity_id: ent }).catch(() => {});
    }
    // Gutschein starten (Kind)
    _scAct(a, ds) {
      const kid = ds.k, k = kid && this._db.kid[kid];
      if (a === 'scgo') {
        const v = k && (k.vouch || []).find((x) => x.id === ds.v);
        if (!v || !v.sc) return;
        if (this._db.ss[kid]) { this._toast(T('📺 Es läuft schon eine Bildschirmzeit.')); return; }
        this._modal(`${esc(v.e || '📺')} ${esc(v.t)}`, `${CSS}<div class="scbig"><div class="t">${v.sc.min} ${T('Min.')}</div><div>${T('Jetzt starten? Die Zeit läuft dann ohne Pause.')}</div>${v.sc.ent ? `<div class="hint">📺 ${esc(this._scName(v.sc.ent))}</div>` : ''}</div>`, false, {
          save: () => {
            const now = Date.now();
            this._save('ss', kid, { k: kid, t: v.t, e: v.e || '📺', ent: v.sc.ent || '', off: v.sc.off || 'off', offEnt: v.sc.offEnt || '', min: v.sc.min, start: now, end: now + v.sc.min * 60000, w: false });
            this._addPoints(kid, 0, `📺 ${v.t}`, { unvouch: v.id });
            this._scSvc(v.sc.ent, true);
            this._scTick();
            return true;
          }, saveLabel: T('▶️ Los geht\'s!'),
        });
        return;
      }
      if (a === 'scopen') { this._scBigDlg(kid); return; }
      if (a === 'scstop') { this._scEnd(kid, true); this._closeModal(); return; }
      // Eltern: verlängern / beenden
      if (a === 'scplus' && this._isParent()) { const s = this._db.ss[kid]; if (s) this._save('ss', kid, { ...s, end: s.end + 10 * 60000, w: false }); this._scTick(); return; }
      if (a === 'scend' && this._isParent()) { this._scEnd(kid, true); return; }
    }
    _scBigDlg(kid) {
      const s = this._db.ss[kid]; if (!s) return;
      this._modal(`${esc(s.e)} ${esc(s.t)}`, `${CSS}<div class="scbig"><div class="t" id="sct">${fmt(s.end - Date.now())}</div><div class="hint">${T('Am Ende wird ausgeschaltet.')}</div></div>`, false, {
        save: () => { this._scEnd(kid, true); return true; }, saveLabel: T('⏹️ Jetzt beenden'),
      });
      const tick = () => { const el = this.shadowRoot.querySelector('#modal #sct'), x = this._db.ss[kid]; if (!el || !x) return; el.textContent = fmt(x.end - Date.now()); setTimeout(tick, 1000); };
      tick();
    }
    // Ende: Gerät aus bzw. Skript, Eintrag löschen
    _scEnd(kid, manual) {
      const s = this._db.ss[kid]; if (!s) return;
      this._del('ss', kid);
      if (s.off === 'off') this._scSvc(s.ent, false);
      else if (s.off === 'script' && s.offEnt) this._scSvc(s.offEnt, true);
      const k = this._db.kid[kid];
      if (!manual && k && this._config.mode !== 'admin') { this._toast(T('📺 Die Bildschirmzeit ist vorbei.')); this._sayKid(T('Die Bildschirmzeit ist vorbei.'), kid); }
      this._render();
    }
    // läuft alle 15 s, solange eine Bildschirmzeit läuft (auf jedem Gerät mit geöffneter Karte)
    _scTick() {
      clearTimeout(this._scT);
      const list = this._scList(); if (!list.length) return;
      const now = Date.now(), mine = this._config.mode === 'kid' ? (this._kidByName(this._config.child) || {}).id : '';
      list.forEach((s) => {
        if (now >= s.end) { this._scEnd(s.k, false); return; }
        if (!s.w && s.end - now <= 5 * 60000) {
          this._save('ss', s.k, { ...s, w: true });
          if (!mine || mine === s.k) { this._toast(T('📺 Noch 5 Minuten!')); this._sayKid(T('Noch 5 Minuten Bildschirmzeit.'), s.k); }
        }
      });
      this.shadowRoot.querySelectorAll('.scbar[data-k]').forEach((b) => { const s = this._db.ss[b.dataset.k]; if (!s) return; const left = s.end - now, q = b.querySelector('.sct'); if (q) q.textContent = fmt(left); const i = b.querySelector('.bar i'); if (i) i.style.width = `${Math.max(0, Math.min(100, (left / (s.min * 60000)) * 100))}%`; b.classList.toggle('warn', left <= 5 * 60000); });
      this._scT = setTimeout(() => this._scTick(), 1000);
    }
    // Leiste in der Kinder-Ansicht
    _scBanner(k) {
      const s = this._db.ss[k.id]; if (!s) return '';
      const left = s.end - Date.now();
      if (!this._scT) setTimeout(() => this._scTick(), 0);
      return `${CSS}<button type="button" class="scbar ${left <= 5 * 60000 ? 'warn' : ''}" data-a="scopen" data-k="${k.id}"><span class="sce">${esc(s.e)}</span><span class="grow"><b>${esc(s.t)} · <span class="sct">${fmt(left)}</span></b><span class="bar"><i style="width:${Math.max(0, Math.min(100, (left / (s.min * 60000)) * 100))}%"></i></span></span><span class="accc">▸</span></button>`;
    }
    // Eltern-Heute: laufende Zeiten mit +10 Min. und Beenden
    _scAdminHtml() {
      const list = this._scList(); if (!list.length) return '';
      if (!this._scT) setTimeout(() => this._scTick(), 0);
      return `${CSS}<div class="card scadm"><h3>${T('📺 Bildschirmzeit läuft')}</h3>${list.map((s) => { const k = this._db.kid[s.k] || {}; return `<div class="scrow"><span style="font-size:26px">${esc(k.emoji || '🙂')}</span><div class="grow"><b>${esc(k.name || '')}</b> · ${esc(s.e)} ${esc(s.t)}<div class="hint">${T('noch {x}', { x: fmt(s.end - Date.now()) })}${s.ent ? ` · ${esc(this._scName(s.ent))}` : ''}</div></div><button class="btn sm" data-a="scplus" data-k="${s.k}">+10</button><button class="btn sm danger" data-a="scend" data-k="${s.k}">⏹️</button></div>`; }).join('')}</div>`;
    }
    // Felder im Belohnungs-Editor
    _scRewardHtml(r) {
      const sc = r.sc || {}, ents = Object.keys(this._hass.states || {}).filter((e) => DOM_ON.includes(e.split('.')[0]));
      const byName = (a, b) => String(this._scName(a)).localeCompare(String(this._scName(b)), undefined, { sensitivity: 'base' });
      const scripts = ents.filter((e) => e.startsWith('script.')).sort(byName);
      const opt = (v, cur, l) => `<option value="${esc(v)}" ${cur === v ? 'selected' : ''}>${esc(l)}</option>`;
      // Geräte nach Art gruppiert und nach Namen sortiert – so findet man den Fernseher schnell
      const groups = [[['media_player', 'remote'], T('📺 Fernseher & Medien')], [['switch'], T('🔌 Schalter & Steckdosen')], [['light'], T('💡 Lichter')], [['fan'], T('🌀 Ventilatoren')], [['input_boolean'], T('🔘 Helfer (Ein/Aus)')], [['script'], T('📜 Skripte')]];
      const grp = groups.map(([doms, l]) => { const g = ents.filter((e) => doms.includes(e.split('.')[0])).sort(byName); return g.length ? `<optgroup label="${esc(l)}">${g.map((e) => opt(e, sc.ent || '', `${this._scName(e)} (${e})`)).join('')}</optgroup>` : ''; }).join('');
      return `<label class="crow"><input type="checkbox" name="scOn" ${sc.min ? 'checked' : ''}><span>${T('📺 Bildschirmzeit<small>Wird zum Gutschein. Startet das Kind ihn, geht das Gerät an und nach der Zeit wieder aus.</small>')}</span></label>
        <div class="sub"><div class="g2 g2e"><label>${T('Minuten')}<input type="number" name="scMin" min="5" max="240" step="5" value="${sc.min || 30}"></label>
        <label>${T('Am Ende')}<select name="scOff">${opt('off', sc.off || 'off', T('Gerät ausschalten'))}${opt('script', sc.off || 'off', T('Skript starten'))}${opt('none', sc.off || 'off', T('nichts (nur Hinweis)'))}</select></label></div>
        <label>${T('Gerät einschalten')}<input name="scq" type="search" autocomplete="off" placeholder="${esc(T('🔎 Gerät suchen …'))}" style="margin-bottom:6px"><select name="scEnt">${opt('', sc.ent || '', T('– nur Countdown –'))}${grp}</select></label>
        <div class="hint">${T('📱 Handy oder Tablet? Die lassen sich nicht direkt schalten. Nimm stattdessen den Internet-Schalter des Geräts (z. B. aus der FritzBox-Integration: „… Internetzugang“) oder ein eigenes Skript – dann gibt es während der Zeit Internet und danach nicht mehr.')}</div>
        <label>${T('Skript am Ende')}<select name="scOffEnt">${opt('', sc.offEnt || '', '–')}${scripts.map((e) => opt(e, sc.offEnt || '', this._scName(e))).join('')}</select></label>
        <div class="hint">${T('Tipp: Eine Spielkonsole nicht hart per Steckdose ausschalten – besser den Fernseher ausschalten oder per Skript z. B. in der FritzBox das Internet der Konsole sperren.')}</div></div>`;
    }
    // 🔎 Suchfeld über der Geräteauswahl: blendet nicht passende Geräte (und leere Gruppen) aus
    _scFilter(inp) {
      const box = inp.closest('label'), sel = box && box.querySelector('select[name=scEnt]'); if (!sel) return;
      const q = String(inp.value || '').trim().toLowerCase();
      sel.querySelectorAll('optgroup').forEach((g) => {
        let any = false;
        g.querySelectorAll('option').forEach((o) => { const hit = !q || o.textContent.toLowerCase().includes(q) || o.selected; o.hidden = !hit; o.disabled = !hit && !o.selected; if (hit) any = true; });
        g.hidden = !any;
      });
      if (q) { const first = [...sel.querySelectorAll('optgroup:not([hidden]) option:not([hidden])')].find((o) => !o.selected && o.textContent.toLowerCase().includes(q)); const cur = sel.selectedOptions[0]; if (first && (!cur || !cur.value || !cur.textContent.toLowerCase().includes(q))) sel.value = first.value; }
    }
    _scRewardRead(b) {
      const on = (b.querySelector('[name=scOn]') || {}).checked;
      if (!on) return null;
      const q = (n) => (b.querySelector(`[name=${n}]`) || {}).value || '';
      return { min: Math.max(5, Math.min(240, Math.round(Number(q('scMin')) || 30))), ent: q('scEnt'), off: ['off', 'script', 'none'].includes(q('scOff')) ? q('scOff') : 'off', offEnt: q('scOffEnt') };
    }
  }
  Object.getOwnPropertyNames(S.prototype).forEach((n) => { if (n !== 'constructor') C.prototype[n] = S.prototype[n]; });
}
