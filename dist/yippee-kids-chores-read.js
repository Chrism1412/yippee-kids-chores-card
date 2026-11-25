/* Yippee! - Kids Chores – 📚 Lesetagebuch
 * Bücher anlegen, Leseminuten eintragen, fertige Bücher im Bücherregal – für jedes fertige Buch gibt es Sterne
 * (mit eingeschalteter Freigabe erst, wenn Mama oder Papa zustimmen). Wird nur geladen, wenn das Lesetagebuch an ist.
 * Gehört zu yippee-kids-chores-card.js (gleiche Version) – https://github.com/Chrism1412/yippee-kids-chores-card · Lizenz: MIT
 */
export default function install(C, Y) {
  const { T, esc, dk, uid, keyAdd, shortDate } = Y;
  const BOOK_E = ['📕', '📗', '📘', '📙', '📓', '📔'];
  const SPINE = { '📕': '#e03131', '📗': '#2f9e44', '📘': '#1c7ed6', '📙': '#f08c00', '📓': '#495057', '📔': '#ae3ec9' };
  const CSS = `<style>.rbcur{display:grid;gap:8px}.rbbook{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;align-items:center;padding:10px;border-radius:14px;background:var(--soft)}
.rbbook>i{font-style:normal;font-size:34px;grid-row:span 2}.rbbook b{font-size:16px}.rbbook small{color:var(--mu)}.rbmin{grid-column:1/-1;display:flex;gap:6px;flex-wrap:wrap}.rbmin .btn{flex:1;min-width:58px}
.rbshelf{display:flex;flex-wrap:wrap;align-items:flex-end;gap:3px;padding:10px 8px 0;min-height:96px;border-bottom:10px solid #b07a45;border-radius:6px;background:linear-gradient(#f8f1e7,#efe2cf)}
.rbsp{width:24px;border-radius:4px 4px 0 0;color:#fff;font-size:10px;font-weight:800;writing-mode:vertical-rl;transform:rotate(180deg);display:flex;align-items:center;justify-content:center;overflow:hidden;white-space:nowrap;padding:4px 0;box-shadow:inset -3px 0 0 rgba(0,0,0,.15)}
.rbstat{display:flex;gap:8px;flex-wrap:wrap}.rbstat span{flex:1;min-width:90px;padding:8px;border-radius:12px;background:var(--soft);text-align:center;font-weight:800}.rbstat small{display:block;font-weight:600;color:var(--mu)}
.rbpick{display:flex;gap:6px;flex-wrap:wrap}.rbpick button{font-size:26px;padding:4px 8px;border-radius:10px;border:2px solid transparent;background:var(--soft);cursor:pointer}.rbpick button.on{border-color:var(--ac)}</style>`;

  class M {
    _rbStars() { const n = Number(this._cfg.rdStars); return Number.isFinite(n) && this._cfg.rdStars !== undefined && this._cfg.rdStars !== '' ? Math.max(0, Math.min(100, Math.round(n))) : 5; }
    _rbData(kid) { const r = this._db.rb[kid] || {}; return { b: { ...(r.b || {}) }, m: { ...(r.m || {}) } }; }
    _rbSave(kid, fn) { const cur = this._rbData(kid), next = fn(cur); this._save('rb', kid, { ...next }, (c) => fn({ b: { ...((c || {}).b || {}) }, m: { ...((c || {}).m || {}) } })); }
    _rbWeek(kid) { const m = this._rbData(kid).m, from = keyAdd(dk(new Date()), -6); return Object.keys(m).filter((d) => d >= from).reduce((a, d) => a + (Number(m[d]) || 0), 0); }

    _rbOpen(kid) {
      const k = this._db.kid[kid]; if (!k) return;
      const d = this._rbData(kid), books = Object.entries(d.b).map(([id, b]) => ({ id, ...b }));
      const cur = books.filter((b) => b.s !== 'd').sort((a, b) => String(b.d0 || '').localeCompare(String(a.d0 || '')));
      const done = books.filter((b) => b.s === 'd').sort((a, b) => String(a.d1 || '').localeCompare(String(b.d1 || '')));
      const total = Object.values(d.m).reduce((a, x) => a + (Number(x) || 0), 0), st = this._rbStars();
      const curHtml = cur.map((b) => `<div class="rbbook"><i>${esc(b.e || '📘')}</i><b>${esc(b.t)}</b>
        <small>${b.a ? `${esc(b.a)} · ` : ''}${T('{n} Min. gelesen', { n: Number(b.mn) || 0 })}${b.s === 'p' ? ` · ${T('⏳ wartet auf Freigabe')}` : ''}</small>
        <div class="rbmin">${[10, 15, 20, 30].map((n) => `<button type="button" class="btn sm" data-a="rbmin" data-k="${kid}" data-b="${b.id}" data-n="${n}">+${n}′</button>`).join('')}
          ${b.s === 'p' ? '' : `<button type="button" class="btn sm primary" data-a="rbfin" data-k="${kid}" data-b="${b.id}">${T('✓ Fertig gelesen')}</button>`}</div></div>`).join('');
      const pick = this._rbE || '📘';
      this._modal(T('📚 Lesetagebuch von {name}', { name: esc(k.name) }), `${CSS}
        <div class="rbstat"><span>${this._rbWeek(kid)}′<small>${T('diese Woche')}</small></span><span>${total}′<small>${T('insgesamt')}</small></span><span>${done.length}<small>${T('Bücher fertig')}</small></span></div>
        <div class="sect"><span>${T('📖 Ich lese gerade')}</span></div>
        <div class="rbcur">${curHtml || `<div class="hint">${T('Noch kein Buch – leg unten dein erstes an!')}</div>`}</div>
        <div class="sect"><span>${T('➕ Neues Buch')}</span></div>
        <label>${T('Titel')}<input id="rbt" maxlength="60"></label><label>${T('Autor (optional)')}<input id="rba" maxlength="40"></label>
        <div class="rbpick">${BOOK_E.map((e) => `<button type="button" class="${e === pick ? 'on' : ''}" data-a="rbpick" data-k="${kid}" data-v="${e}">${e}</button>`).join('')}</div>
        <div class="btnrow"><button type="button" class="btn" data-a="rbadd" data-k="${kid}">${T('📘 Buch anlegen')}</button></div>
        <div class="sect"><span>${T('📚 Mein Bücherregal')}</span></div>
        <div class="rbshelf">${done.map((b) => `<span class="rbsp" style="background:${SPINE[b.e] || '#1c7ed6'};height:${70 + (b.t.length % 4) * 6}px" title="${esc(b.t)}">${esc(b.t)}</span>`).join('') || `<span class="hint" style="align-self:center">${T('Hier stehen deine fertigen Bücher.')}</span>`}</div>
        <div class="hint" style="margin-top:8px">${st ? T('Für jedes fertige Buch gibt es {n} ⭐.', { n: st }) : ''}${this._approval && st ? ` ${T('Mama oder Papa geben es frei.')}` : ''}</div>`);
    }

    _rbAct(a, ds, el, e) {
      const kid = ds.k, k = this._db.kid[kid];
      if (a === 'rbopen') { if (k) this._rbOpen(kid); return; }
      if (a === 'rbpick') { this._rbE = ds.v; const m = this.shadowRoot.getElementById('modal'); if (m) m.querySelectorAll('.rbpick button').forEach((b) => b.classList.toggle('on', b.dataset.v === ds.v)); return; }
      if (a === 'rbadd' && k) {
        const m = this.shadowRoot.getElementById('modal'), t = String((m.querySelector('#rbt') || {}).value || '').replace(/[<>]/g, '').trim().slice(0, 60), au = String((m.querySelector('#rba') || {}).value || '').replace(/[<>]/g, '').trim().slice(0, 40);
        if (!t) { this._toast(T('Bitte einen Titel eingeben.')); return; }
        const id = uid(), e0 = BOOK_E.includes(this._rbE) ? this._rbE : '📘';
        this._rbSave(kid, (d) => { d.b[id] = { t, a: au, e: e0, mn: 0, s: 'r', d0: dk(new Date()) }; return d; });
        this._rbOpen(kid); return;
      }
      if (a === 'rbmin' && k) {
        const n = Math.max(1, Math.min(240, Number(ds.n) || 0)), today = dk(new Date());
        this._rbSave(kid, (d) => { if (d.b[ds.b]) d.b[ds.b] = { ...d.b[ds.b], mn: (Number(d.b[ds.b].mn) || 0) + n }; d.m[today] = (Number(d.m[today]) || 0) + n; const keep = keyAdd(today, -400); Object.keys(d.m).forEach((x) => { if (x < keep) delete d.m[x]; }); return d; });
        if (e) this._pop(e, `+${n}′ 📖`);
        this._rbOpen(kid); return;
      }
      if (a === 'rbfin' && k) {
        const b = this._rbData(kid).b[ds.b]; if (!b || b.s === 'd' || b.s === 'p') return;
        const st = this._rbStars();
        if (this._approval && st) {
          this._rbSave(kid, (d) => { if (d.b[ds.b]) d.b[ds.b] = { ...d.b[ds.b], s: 'p' }; return d; });
          this._save('req', `rb${ds.b}`, { kid, book: { b: ds.b, t: b.t, e: b.e }, at: Date.now() });
          this._notify(T('📚 {name} hat „{title}“ fertig gelesen – bitte freigeben.', { name: k.name, title: b.t }), 'task');
          this._toast(T('⏳ Super! Mama oder Papa geben das Buch frei.'));
        } else {
          this._rbDone(kid, ds.b, e);
        }
        this._rbOpen(kid); return;
      }
      if (a === 'rbapr' || a === 'rbrej') {
        const q = this._db.req[ds.q]; if (!q || !q.book) return;
        if (a === 'rbapr') this._rbDone(q.kid, q.book.b, e);
        else this._rbSave(q.kid, (d) => { if (d.b[q.book.b]) d.b[q.book.b] = { ...d.b[q.book.b], s: 'r' }; return d; });
        this._del('req', q.id);
        this._render();
      }
    }
    _rbDone(kid, bid, e) {
      const b = this._rbData(kid).b[bid], st = this._rbStars(); if (!b) return;
      this._rbSave(kid, (d) => { if (d.b[bid]) d.b[bid] = { ...d.b[bid], s: 'd', d1: dk(new Date()) }; return d; });
      if (st) { this._addPoints(kid, st, `📚 ${b.t}`); if (e) this._pop(e, `+${st} ⭐`); }
      this._burst(14);
      this._toast(T('📚 „{title}“ steht jetzt im Bücherregal!', { title: b.t }));
    }
    // Freigaben-Zeilen für die Eltern (📋 Heute → 🔔 Freigaben)
    _rbAprHtml() {
      return Object.values(this._db.req).filter((q) => q.book && this._db.kid[q.kid]).map((q) => { const c = this._db.kid[q.kid];
        return `<div class="row">${this._avc(c)}<span class="grow">${esc(q.book.e || '📘')} ${T('„{title}“ fertig gelesen', { title: esc(q.book.t) })}<small>${esc(c.name)} · +${this._rbStars()} ⭐</small></span>
          <button class="icon no" data-a="rbrej" data-q="${q.id}">✕</button><button class="icon ok" data-a="rbapr" data-q="${q.id}">✓</button></div>`; }).join('');
    }
  }
  Object.getOwnPropertyNames(M.prototype).forEach((n) => { if (n !== 'constructor') Object.defineProperty(C.prototype, n, Object.getOwnPropertyDescriptor(M.prototype, n)); });
  return true;
}
