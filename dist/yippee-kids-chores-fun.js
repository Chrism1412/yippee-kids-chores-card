/*
 * Yippee! - Kids Chores – Spaß & Sammeln (🎡 Glücksrad, 📒 Sticker-Alben, 🥚 Ostereier- und 🎃 Kürbissuche,
 * 📊 Wochenbericht, 🔔 Erinnerung zu festen Uhrzeiten über Lautsprecher)
 * Eigene Datei, damit die Karte selbst klein bleibt: sie wird nur geladen, wenn eine dieser Funktionen eingeschaltet ist.
 * Gehört zu yippee-kids-chores-card.js (gleiche Version) – https://github.com/Chrism1412/yippee-kids-chores-card · Lizenz: MIT
 */
export default function install(C, Y) {
  const { T, esc, dk, FN_ALB } = Y;

  // 📒 4 Alben à 24 Sticker – nur Emojis, die auch ältere Geräte anzeigen
  const ALB = {
    tiere: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦉', '🦄', '🐴', '🦒', '🐘', '🦔'],
    fahrzeuge: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛵', '🏍️', '🚲', '🛴', '🚂', '🚆', '🚇', '🚁', '✈️', '🚤', '🚠'],
    weltraum: ['🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌛', '🌜', '🌞', '⭐', '🌟', '💫', '☄️', '🌠', '🌌', '🚀', '🛸', '🛰️'],
    meer: ['🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦀', '🐚', '🐢', '🦞', '⚓', '🌊', '🏝️', '🏖️', '⛵', '🚢', '🛥️', '🐊', '🎣', '🗺️'],
  };
  const ALB_NAME = { tiere: () => T('🐾 Tiere'), fahrzeuge: () => T('🚗 Fahrzeuge'), weltraum: () => T('🚀 Weltraum'), meer: () => T('🌊 Meer') };
  // 🎡 Gewinne: t = s (Sterne) · fs (Freispiel) · n (leider nichts), v = Menge, w = Gewicht (je höher, desto öfter)
  const WHEEL_DEF = [{ t: 's', v: 1, w: 40 }, { t: 's', v: 2, w: 25 }, { t: 's', v: 5, w: 8 }, { t: 'fs', v: 1, w: 12 }, { t: 'n', v: 0, w: 15 }];
  const COLS = ['#ff8787', '#ffd43b', '#69db7c', '#74c0fc', '#b197fc', '#ffa94d', '#63e6be', '#f783ac'];
  const CSS = `<style>.fnw{display:flex;flex-direction:column;align-items:center;gap:12px}.fnwrap{position:relative;width:min(280px,78vw);aspect-ratio:1}
.fnwrap svg{width:100%;height:100%;display:block}.fnrot{transform-origin:110px 110px;transition:transform 4.2s cubic-bezier(.17,.67,.12,1)}
.fnptr{position:absolute;left:50%;top:-6px;transform:translateX(-50%);font-size:30px;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3))}
.fnres{font-size:20px;font-weight:800;text-align:center;min-height:1.4em}.fntabs{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:10px}
.fngrid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.fnst{position:relative;aspect-ratio:1;border-radius:12px;background:var(--soft);display:flex;align-items:center;justify-content:center;font-size:28px}
.fnst.no{font-size:18px;color:var(--mu);opacity:.55}.fnst b{position:absolute;right:2px;bottom:0;font-size:10px;background:var(--ac);color:#fff;border-radius:8px;padding:0 4px;line-height:1.5}
.fnnest{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;font-size:30px;padding:8px 0}.fnpr{display:grid;grid-template-columns:1fr 1fr auto;gap:6px 8px;align-items:end;padding:8px 0;border-bottom:1px solid var(--ln)}.fnpr label{margin:0;min-width:0}.fnpr .fnt{grid-column:1/3}.fnpr input,.fnpr select{width:100%;min-width:0;box-sizing:border-box}.fnpr .icon{grid-row:1;grid-column:3}
@media (prefers-reduced-motion: reduce){.fnrot{transition:none}}</style>`;

  class M {
    _fnKidOf(ds) { return this._db.kid[ds && ds.k] || null; }
    _fnPrizes() {
      const raw = Array.isArray(this._cfg.wheelP) && this._cfg.wheelP.length ? this._cfg.wheelP : WHEEL_DEF;
      return raw.map((p) => ({ t: ['s', 'fs', 'n'].includes(p && p.t) ? p.t : 'n', v: Math.max(0, Math.min(50, Math.round(Number(p && p.v) || 0))), w: Math.max(0, Math.min(100, Math.round(Number(p && p.w) || 0))) })).slice(0, 8);
    }
    // Freispiele nur, wenn es Spiele gibt und das Kind ein Haustier hat – sonst fällt der Gewinn weg
    _fnPrizesFor(kid) { const fsOk = this._peOn() && this._fsUseful() && !!((this._db.pk || {})[kid] || {}).on; return this._fnPrizes().filter((p) => p.w > 0 && (p.t !== 'fs' || fsOk)); }
    _fnPrizeLabel(p) { return p.t === 's' ? `+${p.v} ⭐` : p.t === 'fs' ? `🎟️ ${p.v}` : '😶'; }

    _fnWheelSvg(list) {
      const n = Math.max(1, list.length), seg = 360 / n, R = 100, cx = 110, cy = 110;
      const pt = (deg, r) => { const a = ((deg - 90) * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
      const parts = list.map((p, i) => {
        const [x0, y0] = pt(i * seg, R), [x1, y1] = pt((i + 1) * seg, R), [tx, ty] = pt((i + 0.5) * seg, R * 0.64);
        const path = n === 1 ? `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${COLS[0]}"/>` : `<path d="M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 ${seg > 180 ? 1 : 0} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${COLS[i % COLS.length]}" stroke="#fff" stroke-width="2"/>`;
        return `${path}<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="16" font-weight="800" fill="#222" transform="rotate(${((i + 0.5) * seg).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})">${esc(this._fnPrizeLabel(p))}</text>`;
      }).join('');
      return `<svg viewBox="0 0 220 220" aria-hidden="true"><g class="fnrot">${parts}<circle cx="${cx}" cy="${cy}" r="16" fill="#fff" stroke="#ddd" stroke-width="2"/></g></svg>`;
    }

    _fnWheelOpen(k) {
      const list = this._fnPrizesFor(k.id), done = this._mark(dk(new Date()), `wh:${k.id}`);
      if (!list.length) { this._toast(T('Im Glücksrad ist noch kein Gewinn eingetragen.')); return; }
      this._fnWl = { k: k.id, list };
      this._modal(T('🎡 Glücksrad'), `${CSS}<div class="fnw"><div class="fnwrap"><span class="fnptr">🔻</span>${this._fnWheelSvg(list)}</div>
        <div class="fnres">${done ? T('Heute schon gedreht – morgen wieder!') : ''}</div>
        ${done ? '' : `<button type="button" class="btn primary" data-a="fnspin" data-k="${k.id}">${T('🎡 Drehen!')}</button>`}
        <div class="hint">${T('Einmal am Tag, wenn alle Aufgaben erledigt sind.')}</div></div>`);
    }

    _fnSpin(k) {
      const today = dk(new Date()), st = this._fnWl;
      if (!st || st.k !== k.id || this._mark(today, `wh:${k.id}`) || !this._fnWheelReady(k)) return;
      const list = st.list, sum = list.reduce((a, p) => a + p.w, 0);
      let r = Math.random() * sum, idx = 0;
      for (let i = 0; i < list.length; i++) { r -= list[i].w; if (r < 0) { idx = i; break; } }
      const p = list[idx];
      this._setMark(today, `wh:${k.id}`, `${p.t}${p.v}`); // erst merken, dann drehen – so gibt es auch nach dem Neuladen keinen zweiten Versuch
      const m = this.shadowRoot.getElementById('modal'), g = m && m.querySelector('.fnrot'), btn = m && m.querySelector('[data-a=fnspin]');
      if (btn) btn.remove();
      const seg = 360 / list.length, rot = 360 * 6 + (360 - (idx + 0.5) * seg) + (Math.random() - 0.5) * seg * 0.6;
      const fin = () => {
        let msg = T('Leider nichts – morgen hast du wieder Glück! 🍀');
        if (p.t === 's' && p.v) { this._addPoints(k.id, p.v, '🎡 Glücksrad'); msg = T('Gewonnen: +{n} ⭐!', { n: p.v }); this._burst(18); }
        if (p.t === 'fs' && p.v) { const cur = this._db.pk[k.id] || {}; this._save('pk', k.id, { ...cur, fs: (Number(cur.fs) || 0) + p.v }, (c) => ({ ...(c || {}), fs: (Number((c || {}).fs) || 0) + p.v })); msg = T('Gewonnen: {n} Freispiel(e) 🎟️!', { n: p.v }); this._burst(18); }
        const res = m && m.querySelector('.fnres'); if (res) res.textContent = msg;
        this._render();
      };
      if (g && !this._calm) { requestAnimationFrame(() => { g.style.transform = `rotate(${rot.toFixed(1)}deg)`; }); setTimeout(fin, 4400); }
      else { if (g) g.style.transform = `rotate(${rot.toFixed(1)}deg)`; fin(); }
    }

    // 📒 Album: Seiten je Thema, fehlende Sticker als „?“, doppelte mit ×2
    _fnAlbOpen(k, al) {
      const a = FN_ALB.includes(al) ? al : (this._fnAl && this._fnAl.k === k.id ? this._fnAl.al : FN_ALB[0]);
      this._fnAl = { k: k.id, al: a };
      const f = this._db.fk[k.id] || {}, have = (f.a || {})[a] || {}, n = Object.keys(have).length;
      if (f.nw) this._save('fk', k.id, { ...f, nw: 0 }, (c) => ({ ...(c || {}), nw: 0 }));
      const tabs = FN_ALB.map((x) => `<button type="button" class="btn sm ${x === a ? 'primary' : ''}" data-a="fnalbp" data-k="${k.id}" data-x="${x}">${ALB_NAME[x]()} ${Object.keys(((f.a || {})[x]) || {}).length}/24</button>`).join('');
      const grid = ALB[a].map((e, i) => (have[i] ? `<div class="fnst">${e}${have[i] > 1 ? `<b>×${have[i]}</b>` : ''}</div>` : '<div class="fnst no">?</div>')).join('');
      const bonus = Number(this._cfg.stkBonus) || 0;
      this._modal(T('📒 Stickeralbum von {name}', { name: esc(k.name) }), `${CSS}<div class="fntabs">${tabs}</div><div class="fngrid">${grid}</div>
        <div class="hint" style="margin-top:10px">${n >= 24 ? T('🎉 Album voll!') : T('Noch {n} Sticker fehlen.', { n: 24 - n })} ${T('Bei jeder erledigten Aufgabe gibt es mit etwas Glück einen Sticker.')}${bonus ? ` ${T('Volles Album: +{n} ⭐', { n: bonus })}` : ''}</div>`);
    }

    _fnNestOpen(k) {
      const se = this._fnSeason() || 'egg', y = new Date().getFullYear(), n = ((this._db.fk[k.id] || {}).ev || {})[`${se}${y}`] || 0;
      const e = se === 'egg' ? '🥚' : '🎃';
      this._modal(se === 'egg' ? T('🧺 Osternest von {name}', { name: esc(k.name) }) : T('🎃 Kürbiskorb von {name}', { name: esc(k.name) }),
        `${CSS}<div class="fnnest">${n ? e.repeat(Math.min(n, 60)) : '…'}</div><div class="hint" style="text-align:center">${se === 'egg' ? T('{n} Ostereier gefunden. In manchen Aufgaben ist eins versteckt – erledige sie und finde es!', { n }) : T('{n} Kürbisse gefunden. In manchen Aufgaben ist einer versteckt – erledige sie und finde ihn!', { n })}</div>`);
    }

    // Beim Erledigen (bzw. Melden) einer Aufgabe: einmal pro Aufgabe und Tag würfeln – kein Sammeln durch Ab- und wieder Anhaken
    _fnDone(date, tid, kidId, e) {
      const k = this._db.kid[kidId], c = this._cfg;
      if (!k || !this._db.task[tid] || this._mark(date, `fn:${tid}:${kidId}`)) return;
      this._setMark(date, `fn:${tid}:${kidId}`, '1');
      const msgs = [];
      if (c.stkOn && Math.random() * 100 < Math.max(1, Math.min(100, Number(c.stkP) || 30))) {
        const al = FN_ALB[Math.floor(Math.random() * FN_ALB.length)], i = Math.floor(Math.random() * 24), cur = this._db.fk[kidId] || {};
        const had = (((cur.a || {})[al] || {})[i]) || 0;
        const add = (o) => { const x = { ...(o || {}) }; x.a = { ...(x.a || {}) }; x.a[al] = { ...(x.a[al] || {}) }; x.a[al][i] = (Number(x.a[al][i]) || 0) + 1; x.nw = (Number(x.nw) || 0) + 1; return x; };
        const next = add(cur), full = Object.keys(next.a[al]).length >= 24, bonus = Number(c.stkBonus) || 0;
        if (full && !(cur.sb || {})[al]) { next.sb = { ...(next.sb || {}), [al]: true }; if (bonus > 0) { this._addPoints(kidId, bonus, `📒 ${ALB_NAME[al]()}`); } msgs.push(T('🎉 Album „{name}“ voll!', { name: ALB_NAME[al]() }) + (bonus > 0 ? ` +${bonus} ⭐` : '')); }
        this._save('fk', kidId, next, (o) => { const x = add(o); if (next.sb) x.sb = { ...(x.sb || {}), ...next.sb }; return x; });
        msgs.unshift(had ? T('📒 Sticker doppelt: {e} ×{n}', { e: ALB[al][i], n: had + 1 }) : T('📒 Neuer Sticker: {e}', { e: ALB[al][i] }));
        if (e) this._pop(e, ALB[al][i]);
      }
      const se = this._fnSeason(date);
      if (se) {
        let h = 0; const s = `${date}|${kidId}|${tid}`; for (let j = 0; j < s.length; j++) h = (h * 31 + s.charCodeAt(j)) >>> 0;
        if (h % 3 === 0) {
          const key = `${se}${date.slice(0, 4)}`, inc = (o) => { const x = { ...(o || {}) }; x.ev = { ...(x.ev || {}) }; x.ev[key] = (Number(x.ev[key]) || 0) + 1; return x; };
          this._save('fk', kidId, inc(this._db.fk[kidId]), inc);
          const star = se === 'egg' ? c.eggStar : c.hwStar;
          if (star) this._addPoints(kidId, 1, se === 'egg' ? '🥚 Osterei' : '🎃 Kürbis');
          msgs.push((se === 'egg' ? T('🥚 Du hast ein Osterei gefunden!') : T('🎃 Du hast einen Kürbis gefunden!')) + (star ? ' +1 ⭐' : ''));
          if (e) setTimeout(() => this._pop(e, se === 'egg' ? '🥚' : '🎃'), 500);
        }
      }
      if (msgs.length) setTimeout(() => this._toast(msgs.join(' · ')), 700);
    }

    // 📊 Wochenbericht (sonntags ab 18 Uhr) und 🔔 Erinnerung zu festen Uhrzeiten
    _fnChecks() {
      try { this._fnWeekCheck(); } catch (e) { console.warn('Yippee Wochenbericht', e); }
      try { this._fnTimeCheck(); } catch (e) { console.warn('Yippee Erinnerung', e); }
    }
    _fnWeekText() {
      const c = this._cfg, y = new Date().getFullYear(), se = this._fnSeason();
      return this._kids().map((k) => {
        const w = this._weekStats(k), f = this._db.fk[k.id] || {};
        const bits = [`✅ ${w.done}/${w.due}`, `+${w.plus} ⭐`];
        if (w.spent) bits.push(`🎁 −${w.spent} ⭐`);
        bits.push(T('Stand {n} ⭐', { n: k.points || 0 }));
        if (this._mnOn()) bits.push(`💰 ${this._mnFmt(this._mnBal(k.id))}`);
        if (c.stkOn) bits.push(`📒 ${this._fnHave(k.id)}/${FN_ALB.length * 24}`);
        if (se) bits.push(`${se === 'egg' ? '🥚' : '🎃'} ${(f.ev || {})[`${se}${y}`] || 0}`);
        return `${k.emoji || '🙂'} ${k.name}: ${bits.join(' · ')}`;
      }).join('\n');
    }
    _fnWeekCheck(force) {
      const c = this._cfg, now = new Date(), key = dk(now);
      if (!force && (!c.wkRep || !(c.targets || []).length || now.getDay() !== 0 || now.getHours() < 18 || c.wkRepLast === key)) return 0;
      if (!force) this._setCfg({ wkRepLast: key });
      const txt = this._fnWeekText();
      if (!txt) return 0;
      return this._notify(txt, 'weekly', null, '', { title: T('📊 Wochenbericht'), to: this._repTo('wTo') });
    }
    _fnTimeList() { return [...new Set((String(this._cfg.rtTimes || '17:00').match(/\b([01]?\d|2[0-3]):[0-5]\d\b/g) || []).map((x) => x.padStart(5, '0')))].sort().slice(0, 6); }
    _fnOpenText(kids) {
      const today = dk(new Date());
      return kids.map((k) => {
        if (this._onVacation(today, k.id) || (this._presCfg(k.pres) && this._pres(k.id, today).s === 'out')) return '';
        const open = this._todayTasks(k.id).filter((t) => this._req(t) && !this._status(t, k.id).s && this._win(t) !== 'before');
        if (!open.length) return '';
        const list = open.slice(0, 5).map((t) => t.title).join(', ');
        return open.length === 1 ? T('{name}, du hast noch eine Aufgabe offen: {list}.', { name: k.name, list }) : T('{name}, du hast noch {n} Aufgaben offen: {list}.', { name: k.name, n: open.length, list });
      }).filter(Boolean).join(' ');
    }
    _fnSay(msg) {
      const c = this._cfg, pl = (c.rtPl || []).filter((p) => this._hass.states[p]);
      if (pl.length && c.rTts && this._hass.states[c.rTts]) { this._hass.callService('tts', 'speak', { media_player_entity_id: pl, message: msg }, { entity_id: c.rTts }).catch((e) => console.warn('Yippee! TTS', e)); return 1; }
      return this._speak(msg);
    }
    _fnRtTest() {
      const kids = this._config.mode === 'kid' ? [this._kidByName(this._config.child)].filter(Boolean) : this._kids();
      const n = this._fnSay(this._fnOpenText(kids) || T('Alles erledigt – super gemacht!'));
      this._toast(n ? T('🔊 Durchsage gesendet') : T('Bitte zuerst TTS + Lautsprecher oder ein Alexa-Gerät wählen'));
    }
    _fnTimeCheck() {
      const c = this._cfg;
      if (!c.rtOn) return;
      const now = new Date(), today = dk(now), mins = now.getHours() * 60 + now.getMinutes();
      const kids = this._config.mode === 'kid' ? [this._kidByName(this._config.child)].filter(Boolean) : this._kids();
      this._fnTimeList().forEach((tm) => {
        const [h, m] = tm.split(':').map(Number), at = h * 60 + m;
        if (mins < at || mins > at + 30 || this._mark(today, `rt:${tm}`)) return;
        this._setMark(today, `rt:${tm}`, '1');
        const msg = this._fnOpenText(kids);
        if (msg) this._fnSay(msg);
      });
    }

    // ⚙️ Einstellungen: Gewinne des Glücksrads
    _fnSettings(part) {
      if (part !== 'wheel') return '';
      const list = this._fnPrizes(), sum = list.reduce((a, p) => a + p.w, 0) || 1;
      const ty = (i, t) => `<select data-whp="${i}" data-f="t">${[['s', T('⭐ Sterne')], ['fs', T('🎟️ Freispiele')], ['n', T('😶 Leider nichts')]].map(([v, l]) => `<option value="${v}" ${t === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
      return `${CSS}<div class="lbl">${T('🎡 Gewinne')}</div>${list.map((p, i) => `<div class="fnpr"><label class="fnt">${T('Gewinn')}${ty(i, p.t)}</label>
        <button type="button" class="icon" data-a="fnwhdel" data-x="${i}" title="${esc(T('Löschen'))}" aria-label="${esc(T('Löschen'))}">✕</button>
        <label>${T('Menge')}<input type="number" min="0" max="50" data-whp="${i}" data-f="v" value="${p.v}" ${p.t === 'n' ? 'disabled' : ''}></label>
        <label>${T('Gewicht')} · ${Math.round((p.w / sum) * 100)}&nbsp;%<input type="number" min="0" max="100" data-whp="${i}" data-f="w" value="${p.w}"></label></div>`).join('')}
        <div class="btnrow">${list.length < 8 ? `<button type="button" class="btn sm" data-a="fnwhadd">${T('＋ Gewinn')}</button>` : ''}<button type="button" class="btn sm" data-a="fnwhreset">${T('↺ Standard')}</button></div>
        <div class="hint">${T('Je höher das Gewicht, desto öfter bleibt das Rad dort stehen. 🎟️ Freispiele gibt es nur für Kinder mit Haustier und Spielen.')}</div>`;
    }

    _fnAct(a, ds, el, e) {
      ds = ds || {};
      const k = this._fnKidOf(ds);
      if (a === 'fnwheel') { if (!k) return; if (!this._fnWheelReady(k)) { this._toast(T('Heute schon gedreht – morgen wieder!')); return; } this._fnWheelOpen(k); return; }
      if (a === 'fnspin') { if (k) this._fnSpin(k); return; }
      if (a === 'fnalb' || a === 'fnalbp') { if (k) this._fnAlbOpen(k, ds.x); return; }
      if (a === 'fnnest') { if (k) this._fnNestOpen(k); return; }
      if (['fnwhadd', 'fnwhdel', 'fnwhreset', 'fnwhp'].includes(a)) {
        let list = this._fnPrizes();
        if (a === 'fnwhadd') list.push({ t: 's', v: 1, w: 10 });
        if (a === 'fnwhdel') { list.splice(Number(ds.x), 1); if (!list.length) list = WHEEL_DEF.map((p) => ({ ...p })); }
        if (a === 'fnwhreset') list = WHEEL_DEF.map((p) => ({ ...p }));
        if (a === 'fnwhp') { const i = Number(ds.whp), f = ds.f; if (list[i] && ['t', 'v', 'w'].includes(f)) list[i] = { ...list[i], [f]: f === 't' ? ds.v : Number(ds.v) || 0 }; }
        this._setCfg({ wheelP: list.slice(0, 8) });
        this._render();
      }
    }
  }
  Object.getOwnPropertyNames(M.prototype).forEach((n) => { if (n !== 'constructor') Object.defineProperty(C.prototype, n, Object.getOwnPropertyDescriptor(M.prototype, n)); });
  return true;
}
