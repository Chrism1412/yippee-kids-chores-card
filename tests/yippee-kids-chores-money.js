/* Yippee! - Kids Chores – 💰 Taschengeld (Spardose je Kind)
 * Wird von der Karte nur geladen, wenn das Taschengeld eingeschaltet ist (⚙️ Einstellungen → ⚙️ Allgemein → 💰 Taschengeld).
 * Gespeichert wird in derselben Liste wie alles andere: mb = Buchungen, mk = Einstellungen je Kind.
 * Beträge sind ganze Cent; die Anzeige macht die Karte (_mnFmt) in der Schreibweise des Landes.
 */
export default function install(C, Y) {
  const { T, esc, dk, shortDate, uid, keyAdd } = Y;
  const CSS = `<style>
.mnhd{display:grid;grid-template-columns:minmax(0,1fr);overflow-wrap:anywhere;gap:4px;justify-items:center;text-align:center;padding:18px 14px;border-radius:20px;background:linear-gradient(135deg,#ffe8a3,#ffd166);color:#3d2c00}
.mnhd .mnbig{font-size:34px;font-weight:900;line-height:1.1}.mnhd .mnsub{font-size:13px;font-weight:600;opacity:.8}
.mnhd .mne{font-size:44px;line-height:1}
.mnfx{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.mnfx span{background:rgba(255,255,255,.6);border-radius:10px;padding:2px 8px;font-size:13px;font-weight:700}
.mnbtns{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
.mnbtns .btn{min-height:46px;font-weight:800}
.mngoal{display:grid;grid-template-columns:minmax(0,1fr);gap:6px;overflow-wrap:anywhere}.mngoal .bar{height:12px;border-radius:8px;background:var(--soft);overflow:hidden}.mngoal .bar i{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#16a34a)}
.mnlist{display:grid;grid-template-columns:minmax(0,1fr);gap:6px}
.mnrow{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:var(--soft)}
.mnrow .mnre{font-size:22px;width:28px;text-align:center}.mnrow .mnrt{flex:1;min-width:0}.mnrow .mnrt b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mnrow .mnra{font-weight:800;white-space:nowrap}.mnrow .mnra.p{color:#16a34a}.mnrow .mnra.m{color:#dc2626}
.mnkid{display:flex;align-items:center;gap:10px;padding:10px;border-radius:14px;background:var(--soft);cursor:pointer;border:0;width:100%;font:inherit;color:inherit;text-align:left}
.mnkid .mnke{font-size:28px}.mnkid .mnkt{flex:1;min-width:0}.mnkid .mnkt b{display:block}.mnkid .mnkb{font-weight:900;font-size:18px}
.mnsw{display:grid;gap:6px}
.mnstep{display:flex;align-items:center;justify-content:center;gap:12px;margin:10px 0}.mnstep .btn{min-width:52px;font-size:22px}.mnstep b{font-size:28px;min-width:90px;text-align:center}
.mnres{text-align:center;font-size:20px;font-weight:800}
.mncur{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px}.mncur .btn.on{outline:3px solid var(--ac)}
</style>`;

  class M {
    _mnK(kid) { return this._db.mk[kid] || {}; }
    // Tauschkurs: je Kind – sonst der bisherige Kurs aus 💶 Taschengeld (Sterne auszahlen), falls eingeschaltet
    _mnRate(kid) { const r = Number(this._mnK(kid).rate) || 0; return r > 0 ? r : this._cfg.moneyOn ? Number(this._cfg.moneyRate) || 10 : 0; }
    _mnCanBook() { return this._isParent() || !!this._cfg.mnSelf; }

    // ---------- Regelmäßiges Taschengeld ----------
    // Auszahltage: wöchentlich jeden Montag, monatlich am 1. – ab dem Tag, an dem es eingestellt wurde
    _mnStarts(per, from, today) {
      const out = [];
      if (per === 'm') {
        const [y, m] = from.split('-').map(Number);
        for (let i = 0; i < 400; i++) {
          const d = dk(new Date(y, m - 1 + i, 1));
          if (d > today) break;
          if (d >= from) out.push(d);
        }
      } else {
        const [y, m, d0] = from.split('-').map(Number), f = new Date(y, m - 1, d0);
        let d = dk(new Date(y, m - 1, d0 + ((8 - f.getDay()) % 7)));
        for (let i = 0; i < 600 && d <= today; i++) { out.push(d); d = keyAdd(d, 7); }
      }
      return out;
    }

    _mnNext(kid) {
      const m = this._mnK(kid), today = dk(new Date());
      if (!this._cfg.mnAllow || !(m.amt > 0) || !m.per || !m.from) return '';
      const base = today > m.from ? today : m.from;
      if (m.per === 'm') { const [y, mo, d] = base.split('-').map(Number); return d === 1 && !this._db.mb[this._mnAid(kid, base)] ? base : dk(new Date(y, mo, 1)); }
      const [y, mo, d] = base.split('-').map(Number), dt = new Date(y, mo - 1, d), off = (8 - dt.getDay()) % 7;
      return off === 0 && this._db.mb[this._mnAid(kid, base)] ? keyAdd(base, 7) : keyAdd(base, off);
    }

    _mnAid(kid, d) { return `al${kid}${d.replace(/-/g, '')}`.slice(0, 40); }

    // Anteil erledigter Pflicht-Aufgaben in einem Zeitraum (gespeicherte Tageswerte, sonst neu berechnet); null = keine Aufgaben
    _mnPct(k, from, to) {
      let due = 0, done = 0;
      for (let d = from, i = 0; d <= to && i < 40; d = keyAdd(d, 1), i++) {
        const s = (k.rd || {})[d] || this._daySnap(k, d);
        done += Number(s[0]) || 0; due += Number(s[1]) || 0;
      }
      return due > 0 ? Math.min(100, Math.round((done / due) * 100)) : null;
    }

    _mnTick() {
      if (!this._mnOn() || !this._cfg.mnAllow) return;
      const today = dk(new Date());
      this._kids().forEach((k) => {
        const m = this._mnK(k.id);
        if (!(m.amt > 0) || !m.per || !m.from) return;
        // höchstens die letzten 3 Auszahltage nachholen (z. B. wenn länger kein Gerät an war)
        this._mnStarts(m.per, m.from, today).slice(-3).forEach((p) => {
          const id = this._mnAid(k.id, p);
          if (this._db.mb[id]) return;
          let a = m.amt, note = '';
          if (m.min > 0) {
            const prev = m.per === 'm' ? (() => { const [y, mo] = p.split('-').map(Number); return dk(new Date(y, mo - 2, 1)); })() : keyAdd(p, -7);
            const pct = this._mnPct(k, prev, keyAdd(p, -1));
            if (pct !== null && pct < m.min) { a = Math.round((m.amt * pct) / 100); note = ` (${pct} %)`; }
          }
          this._save('mb', id, { k: k.id, a, d: p, t: `${T('Taschengeld')}${note}`, e: '📅', src: 'allow' });
        });
      });
    }

    // 📦 Alte Buchungen zusammenfassen (abschaltbar, Standard an): Buchungen, die älter als 12 volle Monate sind, werden je Kind,
    // Währung und Monat zu höchstens zwei Einträgen „📦 Einnahmen MM/JJJJ“ und „📦 Ausgaben MM/JJJJ“ – der Kontostand bleibt gleich,
    // die Liste in Home Assistant bleibt klein. 🏁 Startbeträge bleiben einzeln. Feste Nummern je Monat → mehrere Geräte schreiben nie doppelt.
    _mnCompact() {
      if (!this._mnOn() || this._cfg.mnSum === false) return 0;
      const now = new Date(), cut = dk(new Date(now.getFullYear(), now.getMonth() - 12, 1)), groups = {};
      Object.values(this._db.mb).forEach((b) => {
        if (!b.k || !/^\d{4}-\d\d-\d\d$/.test(String(b.d)) || b.d >= cut || b.src === 'start') return;
        const g = `${b.k}|${b.c || ''}|${b.d.slice(0, 7)}`;
        (groups[g] = groups[g] || []).push(b);
      });
      let n = 0;
      Object.keys(groups).forEach((g) => {
        const list = groups[g], [k, c, ym] = g.split('|'), plain = list.filter((b) => b.src !== 'sum');
        if (!plain.length || (list.length < 3 && list.length === plain.length)) return; // lohnt sich nicht
        const sid = (x) => `sm${x}${ym.replace('-', '')}${c}${k}`.slice(0, 40), ids = [sid('i'), sid('o')];
        const inn = list.reduce((a, b) => a + (b.a > 0 ? b.a : 0), 0), out = list.reduce((a, b) => a + (b.a < 0 ? b.a : 0), 0);
        const m = `${ym.slice(5)}/${ym.slice(0, 4)}`, base = { k, d: `${ym}-01`, e: '📦', src: 'sum', ...(c ? { c } : {}) };
        if (inn) this._save('mb', ids[0], { ...base, a: inn, t: T('📦 Einnahmen {m}', { m }).replace(/^📦\s*/, '') });
        if (out) this._save('mb', ids[1], { ...base, a: out, t: T('📦 Ausgaben {m}', { m }).replace(/^📦\s*/, '') });
        list.forEach((b) => { if (!ids.includes(b.id) || (b.id === ids[0] && !inn) || (b.id === ids[1] && !out)) this._del('mb', b.id); });
        n += plain.length;
      });
      if (n) this._audit(T('📦 {n} alte Buchungen zu Monatssummen zusammengefasst', { n }));
      return n;
    }

    // ---------- Sparziel ----------
    _mnEta(kid, left) {
      if (left <= 0) return '';
      const from = keyAdd(dk(new Date()), -28);
      const net = this._mnList(kid).filter((b) => b.d >= from && b.src !== 'start').reduce((a, b) => a + b.a, 0);
      if (net <= 0) return '';
      const days = Math.ceil(left / (net / 28));
      if (days > 730) return '';
      return T('Bei deinem Tempo ca. am {date}', { date: shortDate(keyAdd(dk(new Date()), days)) });
    }

    // ---------- Seiten ----------
    _mnRowHtml(b, parent) {
      const em = b.e || { allow: '📅', x: '⭐', start: '🏁', rw: '🎁' }[b.src] || (b.a >= 0 ? '➕' : '➖');
      const cur = b.c || this._mnCur();
      const who = b.by && this._hass.user && b.by !== this._hass.user.id && parent ? ` · ${esc(this._userName(b.by) || '')}` : '';
      return `<div class="mnrow"><span class="mnre">${esc(em)}</span><span class="mnrt"><b>${esc(b.t || (b.a >= 0 ? T('Einnahme') : T('Ausgabe')))}</b><small class="hint">${esc(shortDate(b.d))}${b.st ? ` · ${b.st} ⭐` : ''}${who}</small></span>
        <span class="mnra ${b.a >= 0 ? 'p' : 'm'}">${b.a >= 0 ? '+' : '−'}${esc(this._mnFmt(Math.abs(b.a), cur))}</span>${parent ? `<button type="button" class="icon sm" data-a="mndel" data-id="${esc(b.id)}" title="${esc(T('Löschen'))}">🗑️</button>` : ''}</div>`;
    }

    _mnPageHtml(kid) {
      const k = this._db.kid[kid];
      if (!k) return '';
      const c = this._cfg, m = this._mnK(kid), parent = this._isParent(), main = this._mnCur(), bal = this._mnBal(kid);
      const fx = c.mnFx ? [...new Set(Object.values(this._db.mb).filter((b) => b.k === kid && b.c && b.c !== main).map((b) => b.c))].map((cur) => [cur, this._mnBal(kid, cur)]).filter((x) => x[1]) : [];
      const next = this._mnNext(kid);
      const head = `<div class="mnhd"><span class="mne">💰</span><span class="mnsub">${esc(k.emoji || '🙂')} ${esc(T('Spardose von {name}', { name: k.name }))}</span><span class="mnbig">${esc(this._mnFmt(bal))}</span>
        ${fx.length ? `<div class="mnfx">${fx.map(([cur, v]) => `<span title="${esc(this._mnName(cur))}">${esc(this._mnFmt(v, cur))}</span>`).join('')}</div><span class="mnsub">${T('Andere Währungen zählen nicht zum Gesamtbetrag.')}</span>` : ''}
        ${next ? `<span class="mnsub">${T('Nächstes Taschengeld: {x} am {date}', { x: esc(this._mnFmt(m.amt)), date: esc(shortDate(next)) })}${m.min > 0 ? ` · ${T('voll ab {n} % erledigt', { n: m.min })}` : ''}</span>` : ''}</div>`;
      const g = c.mnGoal !== false ? m.goal : null;
      const goal = c.mnGoal === false ? '' : g ? (() => {
        const pct = Math.min(100, Math.round((Math.max(0, bal) / g.amt) * 100)), left = g.amt - bal;
        return `<div class="card mngoal"><b>${esc(g.e || '🎯')} ${T('Mein Sparziel')}: ${esc(g.t || '')}</b><div class="bar"><i style="width:${pct}%"></i></div>
          <span class="hint">${left > 0 ? T('Noch {x} bis {goal}', { x: esc(this._mnFmt(left)), goal: esc(this._mnFmt(g.amt)) }) : T('🎉 Geschafft – genug gespart!')}${left > 0 && this._mnEta(kid, left) ? ` · ${esc(this._mnEta(kid, left))}` : ''}</span>
          <div class="btnrow"><button type="button" class="btn sm" data-a="mngoal" data-k="${kid}">${T('✏️ Sparziel ändern')}</button></div></div>`;
      })() : `<div class="btnrow"><button type="button" class="btn" data-a="mngoal" data-k="${kid}">${T('🎯 Sparziel festlegen')}</button></div>`;
      const btns = [];
      if (this._mnCanBook()) { btns.push(`<button type="button" class="btn" data-a="mnbook" data-k="${kid}" data-d="in">${T('➕ Geld bekommen')}</button>`, `<button type="button" class="btn" data-a="mnbook" data-k="${kid}" data-d="out">${T('➖ Geld ausgegeben')}</button>`); }
      if (c.mnRate && this._mnRate(kid) > 0) btns.push(`<button type="button" class="btn primary" data-a="mnx" data-k="${kid}">${T('⭐ Sterne in Geld tauschen')}</button>`);
      if (parent) btns.push(`<button type="button" class="btn" data-a="mnkset" data-k="${kid}">${T('⚙️ Einstellungen für {name}', { name: esc(k.name) })}</button>`);
      const list = Object.values(this._db.mb).filter((b) => b.k === kid).sort((a, b) => (b.d > a.d ? 1 : b.d < a.d ? -1 : String(b.id) > String(a.id) ? 1 : -1));
      return `${CSS}${head}${goal}${btns.length ? `<div class="mnbtns">${btns.join('')}</div>` : ''}
        <div class="card"><h3>${T('🧾 Verlauf')}</h3>${list.length ? `<div class="mnlist">${list.slice(0, this._mnN || 40).map((b) => this._mnRowHtml(b, parent)).join('')}</div>${list.length > (this._mnN || 40) ? `<div class="btnrow"><button type="button" class="btn sm" data-a="mnmore">${T('Mehr anzeigen')}</button></div>` : ''}` : `<div class="empty">${T('Noch keine Buchungen.')}</div>`}</div>`;
    }

    _hubGo(k) { Promise.resolve().then(() => { const r = this.shadowRoot; if (this._hubApply) this._hubApply(r, k); else this._exCall('_hubApply', [r, k], false); }); return ''; }
    _mnTabHtml() {
      if (this._mnKid && this._db.kid[this._mnKid]) return `<div class="mnpg"><button class="btn advback" data-a="mnclose">${T('← Zurück')}</button>${this._mnPageHtml(this._mnKid)}</div>`;
      const c = this._cfg, cur = this._mnCur();
      const sw = (key, on, label) => `<label class="crow"><input type="checkbox" data-a="mncfg" data-c="${key}" ${on ? 'checked' : ''}><span>${label}</span></label>`;
      const kids = this._kids().map((k) => {
        const m = this._mnK(k.id), next = this._mnNext(k.id);
        return `<button type="button" class="mnkid" data-a="mnopen" data-k="${k.id}"><span class="mnke">${esc(k.emoji || '🙂')}</span><span class="mnkt"><b>${esc(k.name)}</b><small class="hint">${c.mnAllow && m.amt > 0 && m.per ? `${esc(this._mnFmt(m.amt))} ${m.per === 'm' ? T('pro Monat') : T('pro Woche')}${next ? ` · ${esc(shortDate(next))}` : ''}` : T('kein regelmäßiges Taschengeld')}</small></span><span class="mnkb">${esc(this._mnFmt(this._mnBal(k.id)))}</span></button>`;
      }).join('');
      return `${CSS}<div class="card"><h3>${T('💰 Spardosen')}</h3>${kids ? `<div class="mnlist">${kids}</div>` : `<div class="empty">${T('Noch keine Kinder angelegt – das geht in der Eltern-Ansicht unter 👧 Kinder.')}</div>`}</div>
        <div class="hubw" data-hub="mn">
        <div class="card hubs" data-hid="cur"><h3>${T('💱 Währung & Buchungen')}</h3>
          <div class="btnrow"><button type="button" class="btn" data-a="mncurdlg">${T('Währung')}: <b>${esc(this._mnName(cur))} (${esc(this._mnFmt(1250, cur))})</b></button></div>
          <div class="mnsw">
          ${sw('mnSelf', !!c.mnSelf, T('✍️ Kinder tragen selbst ein<small>Kinder können Einnahmen und Ausgaben selbst buchen – z. B. Geld von Oma. Löschen können nur Eltern.</small>'))}
          ${sw('mnFx', !!c.mnFx, T('🌍 Andere Währungen<small>Z. B. Geld aus dem Urlaub – wird getrennt geführt und nicht zum Gesamtbetrag gezählt.</small>'))}
          ${sw('mnSum', c.mnSum !== false, T('📦 Alte Buchungen zusammenfassen<small>Buchungen, die älter als 12 Monate sind, werden je Monat zu einer Summe für Einnahmen und Ausgaben. Der Kontostand bleibt gleich, die Liste bleibt schlank.</small>'))}
          </div></div>
        <div class="card hubs" data-hid="allow"><h3>${T('📅 Taschengeld & Tauschen')}</h3><div class="mnsw">
          ${sw('mnAllow', !!c.mnAllow, T('📅 Regelmäßiges Taschengeld<small>Wöchentlich (montags) oder monatlich (am 1.) automatisch – Betrag je Kind unter ⚙️ beim Kind.</small>'))}
          ${sw('mnRate', !!c.mnRate, T('⭐ Sterne in Geld tauschen<small>Kinder tauschen Sterne gegen Geld, z. B. 10 ⭐ = 1 €. Den Kurs legst du je Kind fest.</small>'))}
          ${sw('mnRw', !!c.mnRw, T('🎁 Belohnungen mit Geldbetrag<small>Im Belohnungs-Editor: Geld kommt beim Einlösen in die Spardose oder wird vom Taschengeld bezahlt.</small>'))}
          </div></div>
        <div class="card hubs" data-hid="save"><h3>${T('🎯 Sparen & Berichte')}</h3><div class="mnsw">
          ${sw('mnGoal', c.mnGoal !== false, T('🎯 Sparziel<small>Jedes Kind kann auf etwas sparen – mit Fortschritt und „Bei deinem Tempo ca. am …“.</small>'))}
          ${sw('mnRcp', c.mnRcp !== false, T('📅 Im Rückblick zeigen<small>„Dein Oktober“ zeigt auch, was gespart und ausgegeben wurde.</small>'))}
          ${sw('mnRep', !!c.mnRep, T('📊 Monatsbericht aufs Handy<small>Am 1. jedes Monats um 9 Uhr: Einnahmen, Ausgaben und Stand jedes Kindes – an die Geräte des Wochenrückblicks.</small>'))}
          </div>${c.mnRep && !(c.targets || []).length ? `<div class="hint">${T('⚠️ Für den Monatsbericht zuerst unter 🔔 Benachrichtigungen ein Handy auswählen.')}</div>` : ''}</div>
        <div class="card hubs" data-hid="pin"><h3>${T('🔒 PIN')}</h3><div class="mnsw">
          ${sw('mnPin', !!c.mnPin, T('🔒 PIN für die Spardose<small>Die Spardose eines Kindes öffnet sich nur mit seiner PIN – die PIN legst du unter ⚙️ beim Kind fest. Eltern brauchen keine PIN.</small>'))}
          </div></div>
        </div>${this._hubGo('mn')}`;
    }

    // ---------- Aktionen ----------
    _mnAct(a, ds) {
      const parent = this._isParent();
      if (a === 'mnmore') { this._mnN = (this._mnN || 40) + 40; this._render(); return; }
      // 🔒 PIN-Abfrage vor dem Öffnen der Spardose
      if (a === 'mnpin') {
        const kid = ds.k, k = this._db.kid[kid], m = this._mnK(kid);
        if (!k || !m.pin) return;
        this._modal(T('🔒 Spardose von {name}', { name: esc(k.name) }), `<label>${T('PIN')}<input name="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" style="font-size:28px;letter-spacing:10px;text-align:center"></label>`, false, {
          save: (b) => {
            const v = (b.querySelector('[name=pin]') || {}).value || '';
            if (Y.hsh(`${kid}:${v}`) !== m.pin) { this._toast(T('❌ Falsche PIN')); return false; }
            this._mnOk = { ...(this._mnOk || {}), [kid]: Date.now() + 5 * 60000 };
            this._mnKid = kid; setTimeout(() => this._render(), 0);
            return true;
          }, saveLabel: T('Öffnen'),
        });
        setTimeout(() => { const i = this.shadowRoot.querySelector('#modal [name=pin]'); if (i) i.focus(); }, 50);
        return;
      }
      if (a === 'mncfg') {
        if (!parent) { this._toast(T('🔒 Nur für Eltern')); return; }
        const k = ds.c, def = ['mnGoal', 'mnRcp', 'mnSum'].includes(k);
        const cur = def ? this._cfg[k] !== false : !!this._cfg[k];
        this._setCfg({ [k]: !cur });
        if (k === 'mnAllow' && !cur) this._mnTickSoon();
        if (k === 'mnSum' && !cur) this._mnCompact();
        return;
      }
      if (a === 'mncurdlg') {
        if (!parent) { this._toast(T('🔒 Nur für Eltern')); return; }
        const now = this._mnCur();
        this._modal(T('Währung'), `<div class="mncur">${Y.MN_CUR.map((c) => `<button type="button" class="btn ${c === now ? 'on' : ''}" data-a="mncurset" data-c="${c}"><b>${esc(this._mnFmt(1250, c))}</b><br><small>${esc(this._mnName(c))}</small></button>`).join('')}</div>
          <div class="hint">${T('Schon gebuchte Beträge werden nicht umgerechnet.')}</div>`);
        return;
      }
      if (a === 'mncurset') { if (parent && Y.MN_CUR.includes(ds.c)) { this._setCfg({ mnCur: ds.c }); this._closeModal(); } return; }
      const kid = ds.k;
      if (a === 'mndel') {
        if (!parent) { this._toast(T('🔒 Nur für Eltern')); return; }
        const b = this._db.mb[ds.id];
        if (!b) return;
        const k = this._db.kid[b.k];
        this._modal(T('Buchung löschen?'), `${CSS}<div class="mnlist">${this._mnRowHtml({ ...b, id: '' }, false)}</div>${b.st ? `<div class="hint">${T('Die {n} ⭐ bekommt {name} zurück.', { n: b.st, name: esc((k || {}).name || '') })}</div>` : ''}`, false, {
          save: () => {
            this._del('mb', ds.id);
            if (b.st && k) this._addPoints(b.k, b.st, `💰 ${T('Tausch zurückgenommen')}`);
            this._toast(T('🗑️ Buchung gelöscht'));
            return true;
          },
          saveLabel: T('Löschen'),
        });
        return;
      }
      const k = this._db.kid[kid];
      if (!k) return;
      if (a === 'mnbook') {
        if (!this._mnCanBook()) { this._toast(T('🔒 Nur für Eltern')); return; }
        const out = ds.d === 'out', main = this._mnCur();
        const curs = this._cfg.mnFx ? [main, ...Y.MN_CUR.filter((c) => c !== main)] : [main];
        this._modal(out ? T('➖ Geld ausgegeben') : T('➕ Geld bekommen'), `
          <div class="g2"><label>${T('Betrag')}<input name="amt" inputmode="decimal" placeholder="${esc(this._mnFmt(500))}" autocomplete="off"></label>
          ${curs.length > 1 ? `<label>${T('Währung')}<select name="cur">${curs.map((c) => `<option value="${c}">${esc(this._mnName(c))}</option>`).join('')}</select></label>` : ''}</div>
          <label>${out ? T('Wofür?') : T('Von wem / wofür?')}<input name="txt" maxlength="80" placeholder="${esc(out ? T('z. B. Comic-Heft') : T('z. B. von Oma'))}"></label>
          ${parent ? `<label class="crow"><input type="checkbox" name="start"><span>${T('🏁 Startbetrag (zählt nicht als Einnahme im Rückblick)')}</span></label>` : ''}`, false, {
          save: (b) => {
            const v = this._mnParse(b.querySelector('[name=amt]').value);
            if (!Number.isFinite(v) || v <= 0) { this._toast(T('Bitte einen Betrag eingeben')); return false; }
            const cur = (b.querySelector('[name=cur]') || {}).value || main, st = !!(b.querySelector('[name=start]') || {}).checked;
            if (out && !parent && this._mnBal(kid, cur) - v < 0) { this._toast(T('💰 Nicht genug in der Spardose – es fehlen {x}', { x: this._mnFmt(v - this._mnBal(kid, cur), cur) })); return false; }
            this._save('mb', `m${uid()}`, { k: kid, a: out ? -v : v, d: dk(new Date()), t: b.querySelector('[name=txt]').value.trim(), ...(cur !== main ? { c: cur } : {}), src: st && !out ? 'start' : 'man', by: (this._hass.user || {}).id || '' });
            this._toast(`💰 ${out ? '−' : '+'}${this._mnFmt(v, cur)}`);
            return true;
          },
        });
        setTimeout(() => { const i = this.shadowRoot.querySelector('#modal [name=amt]'); if (i) i.focus(); }, 50);
        return;
      }
      if (a === 'mnx') {
        const m = this._mnK(kid), rate = this._mnRate(kid);
        if (!this._cfg.mnRate || !(rate > 0)) return;
        const min = Math.max(rate, Number(m.rmin) || 0), have = Number(k.points) || 0;
        if (have < min) { this._toast(T('Noch {n} Punkte sammeln', { n: min - have })); return; }
        let n = min;
        const val = (x) => Math.round((x * 100) / rate);
        this._modal(T('⭐ Sterne in Geld tauschen'), `${CSS}<div class="hint" style="text-align:center">${T('{n} ⭐ = {x}', { n: rate, x: esc(this._mnFmt(100)) })} · ${T('Du hast {n} ⭐', { n: have })}</div>
          <div class="mnstep"><button type="button" class="btn" data-mx="-">−</button><b class="mnxn">${n} ⭐</b><button type="button" class="btn" data-mx="+">+</button></div>
          <div class="mnres">= ${esc(this._mnFmt(val(n)))}</div>`, false, {
          save: () => {
            const kk = this._db.kid[kid];
            if (!kk || (Number(kk.points) || 0) < n) { this._toast(T('{name} hat nicht mehr genug Punkte', { name: k.name })); return true; }
            this._addPoints(kid, -n, `💰 ${T('In Geld getauscht')}`);
            this._save('mb', `x${uid()}`, { k: kid, a: val(n), d: dk(new Date()), t: T('Sterne getauscht'), src: 'x', st: n, by: (this._hass.user || {}).id || '' });
            this._celebrate('💰', T('Getauscht!'), `${n} ⭐ → ${this._mnFmt(val(n))}`);
            return true;
          },
          saveLabel: T('Tauschen'),
        });
        const box = this.shadowRoot.querySelector('#modal');
        if (box) box.addEventListener('click', (e) => {
          const b = e.target.closest('[data-mx]');
          if (!b) return;
          e.stopPropagation();
          n = Math.min(Math.floor(have / rate) * rate, Math.max(min, n + (b.dataset.mx === '+' ? rate : -rate)));
          const nb = box.querySelector('.mnxn'), rs = box.querySelector('.mnres');
          if (nb) nb.textContent = `${n} ⭐`;
          if (rs) rs.textContent = `= ${this._mnFmt(val(n))}`;
        });
        return;
      }
      if (a === 'mngoal') {
        const g = this._mnK(kid).goal || {};
        this._modal(T('🎯 Mein Sparziel'), `
          <div class="g2"><label>${T('Emoji')}<input name="emoji" value="${esc(g.e || '🎯')}"></label><label>${T('Worauf sparst du?')}<input name="gt" maxlength="60" value="${esc(g.t || '')}" placeholder="${esc(T('z. B. Fahrrad'))}"></label></div>
          <label>${T('Wie viel kostet es?')}<input name="ga" inputmode="decimal" value="${g.amt ? esc(String(g.amt / 100)) : ''}" placeholder="${esc(this._mnFmt(5000))}"></label>`, !!g.amt, {
          save: (b) => {
            const v = this._mnParse(b.querySelector('[name=ga]').value);
            if (!Number.isFinite(v) || v <= 0) { this._toast(T('Bitte einen Betrag eingeben')); return false; }
            this._save('mk', kid, { ...this._mnK(kid), goal: { t: b.querySelector('[name=gt]').value.trim(), e: b.querySelector('[name=emoji]').value.trim() || '🎯', amt: v } });
            return true;
          },
          del: () => { const o = { ...this._mnK(kid) }; delete o.goal; this._save('mk', kid, o); return true; },
        });
        return;
      }
      if (a === 'mnkset') {
        if (!parent) { this._toast(T('🔒 Nur für Eltern')); return; }
        const m = this._mnK(kid), c = this._cfg;
        const amt = (x) => (x ? esc(String(x / 100)) : '');
        this._modal(T('⚙️ Einstellungen für {name}', { name: esc(k.name) }), `
          ${c.mnAllow ? `<h4>${T('📅 Regelmäßiges Taschengeld')}</h4>
          <div class="g2"><label>${T('Betrag')}<input name="amt" inputmode="decimal" value="${amt(m.amt)}" placeholder="${esc(this._mnFmt(500))}"></label>
          <label>${T('Wie oft?')}<select name="per"><option value="w" ${m.per !== 'm' ? 'selected' : ''}>${T('wöchentlich (montags)')}</option><option value="m" ${m.per === 'm' ? 'selected' : ''}>${T('monatlich (am 1.)')}</option></select></label></div>
          <label>${T('Voll nur, wenn genug erledigt (%)')}<input type="number" name="min" min="0" max="100" value="${m.min || 0}"></label>
          <div class="hint">${T('0 = immer voll. Sonst gibt es anteilig so viel, wie in der Woche bzw. im Monat davor erledigt wurde.')}</div>` : `<div class="hint">${T('📅 Regelmäßiges Taschengeld ist ausgeschaltet – einschalten im Tab 💰 Taschengeld.')}</div>`}
          ${c.mnRate ? `<h4>${T('⭐ Sterne in Geld tauschen')}</h4>
          <div class="g2"><label>${T('Wie viele ⭐ für {x}?', { x: esc(this._mnFmt(100)) })}<input type="number" name="rate" min="0" value="${m.rate || ''}" placeholder="10"></label>
          <label>${T('Mindestens tauschen (⭐)')}<input type="number" name="rmin" min="0" value="${m.rmin || ''}" placeholder="${m.rate || 10}"></label></div>
          <div class="hint">${T('Leer oder 0 = für dieses Kind kein Tausch.')}</div>` : ''}
          ${c.mnPin ? `<h4>${T('🔒 PIN für die Spardose')}</h4><label>${T('Neue PIN (4 Ziffern)')}<input name="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="${m.pin ? '••••' : ''}"></label>
          ${m.pin ? `<label class="crow"><input type="checkbox" name="pinoff"><span>${T('PIN entfernen')}</span></label>` : `<div class="hint">${T('Leer lassen = keine PIN für dieses Kind.')}</div>`}` : ''}`, false, {
          save: (b) => {
            const o = { ...m }, q = (x) => b.querySelector(`[name=${x}]`);
            if (q('amt')) {
              const v = q('amt').value.trim() ? this._mnParse(q('amt').value) : 0;
              if (!Number.isFinite(v) || v < 0) { this._toast(T('Bitte einen Betrag eingeben')); return false; }
              const changed = v !== (m.amt || 0) || q('per').value !== (m.per || 'w');
              o.amt = v; o.per = q('per').value; o.min = Math.min(100, Math.max(0, Math.round(Number(q('min').value) || 0)));
              if (changed || !o.from) o.from = dk(new Date());
              if (!v) { delete o.amt; delete o.from; }
            }
            if (q('rate')) { o.rate = Math.max(0, Math.round(Number(q('rate').value) || 0)); o.rmin = Math.max(0, Math.round(Number(q('rmin').value) || 0)); }
            if (q('pin')) {
              const pv = q('pin').value.trim();
              if (pv && !/^\d{4}$/.test(pv)) { this._toast(T('Die PIN muss aus 4 Ziffern bestehen')); return false; }
              if (pv) o.pin = Y.hsh(`${kid}:${pv}`);
              if (q('pinoff') && q('pinoff').checked) delete o.pin;
            }
            this._save('mk', kid, o);
            this._mnTickSoon();
            return true;
          },
        });
      }
    }
    // 📊 Monatsbericht: am 1. ab 9 Uhr einmal an die Geräte des Wochenrückblicks
    _mnRepCheck() {
      const c = this._cfg, now = new Date();
      if (!c.mnRep || !(c.targets || []).length || now.getDate() !== 1 || now.getHours() < 9) return;
      const ym = dk(now).slice(0, 7);
      if (c.mnRepLast === ym) return;
      this._setCfg({ mnRepLast: ym });
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1), pym = dk(prev).slice(0, 7);
      const mon = prev.toLocaleDateString(this._mnLoc(), { month: 'long' });
      const lines = this._kids().map((k) => { const m = this._mnMonth(k.id, pym); return `${k.emoji || '🙂'} ${k.name}: +${this._mnFmt(m.inn)} · −${this._mnFmt(m.out)} · ${T('Stand {x}', { x: this._mnFmt(this._mnBal(k.id)) })}`; });
      if (!lines.length) return;
      this._notify(lines.join('\n'), 'weekly', null, '', { title: T('💰 Taschengeld im {month}', { month: mon }), to: this._repTo('wTo') });
    }
  }
  Object.getOwnPropertyNames(M.prototype).forEach((n) => { if (n !== 'constructor') C.prototype[n] = M.prototype[n]; });
}
