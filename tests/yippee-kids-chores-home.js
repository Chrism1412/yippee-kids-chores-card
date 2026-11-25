/* Yippee! - Kids Chores – 🏠 Zuhause fürs Haustier
 * Ein eigenes Zimmer: Durchs Fenster sieht man das Wetter aus Home Assistant (Regen und Schnee bleiben draußen),
 * mit 🪙 Talern aus den Spielen kauft das Kind Möbel und Spielsachen. Dazu (alles abschaltbar): Deko zur Jahreszeit,
 * Geburtstag im Zimmer, ein Garten als zweiter Raum und Besuch vom Haustier eines Geschwisterkinds.
 * Wird erst geladen, wenn das Zuhause geöffnet wird.
 * Gehört zu yippee-kids-chores-card.js (gleiche Version) – https://github.com/Chrism1412/yippee-kids-chores-card · Lizenz: MIT
 */
export default function install(C, Y) {
  const { T, esc } = Y;
  // [id, Emoji, Name, Preis, x %, y % (Mitte unten), Größe in % der Zimmerbreite] – nur Emojis, die auch ältere Geräte zeigen
  const ITEMS = [
    ['rug', '', 'Teppich', 10, 50, 96, 0],
    ['bed', '🛏️', 'Bett', 25, 84, 92, 19],
    ['sofa', '🛋️', 'Sofa', 25, 17, 92, 17],
    ['lamp', '💡', 'Lampe', 8, 50, 14, 7],
    ['pic', '🖼️', 'Bild', 10, 62, 34, 10],
    ['clock', '🕰️', 'Uhr', 10, 78, 26, 8],
    ['books', '📚', 'Bücher', 12, 92, 52, 8],
    ['tv', '📺', 'Fernseher', 20, 76, 54, 11],
    ['radio', '📻', 'Radio', 12, 64, 64, 7],
    ['plant', '🌵', 'Kaktus', 8, 4, 72, 7],
    ['flowers', '💐', 'Blumen', 8, 20, 43, 7],
    ['fish', '🐠', 'Aquarium', 18, 93, 70, 7],
    ['bowl', '🥣', 'Futternapf', 6, 63, 95, 6],
    ['ball', '⚽', 'Ball', 6, 33, 95, 6],
    ['teddy', '🧸', 'Teddy', 10, 70, 90, 8],
    ['guitar', '🎸', 'Gitarre', 15, 4, 92, 9],
    ['trophy', '🏆', 'Pokal', 15, 28, 66, 6],
    ['balloon', '🎈', 'Luftballon', 5, 40, 40, 7],
    ['star', '🌟', 'Leuchtstern', 8, 94, 18, 6],
    ['wall', '', 'Neue Tapete', 15, 0, 0, 0],
    ['garden', '', 'Garten', 200, 0, 0, 0],
  ];
  // 🌳 Garten: [id, Bild, Name, Preis, x, y, Größe, Zone, Breite×] – einige als kleine Zeichnung, damit sie überall gleich aussehen
  const SV = (vb, b) => `<svg viewBox="${vb}" style="width:100%;height:100%;display:block" aria-hidden="true">${b}</svg>`;
  const GITEMS = [
    ['gflow', SV('0 0 64 40', '<ellipse cx="32" cy="32" rx="30" ry="8" fill="#8d5a2b"/>' + [10, 22, 34, 46, 56].map((x, i) => `<line x1="${x}" y1="32" x2="${x}" y2="${16 + (i % 2) * 4}" stroke="#2f9e44" stroke-width="2"/><path d="M${x - 5} ${12 + (i % 2) * 4} q5 10 10 0 l-2.5 3 -2.5-4 -2.5 4 Z" fill="${['#f03e3e', '#fcc419', '#e64980', '#7950f2', '#fd7e14'][i]}"/>`).join('')), 'Blumenbeet', 15, 22, 94, 9, 'g', 1.6],
    ['gslide', SV('0 0 64 64', '<g stroke="#495057" stroke-width="3"><line x1="8" y1="63" x2="12" y2="14"/><line x1="22" y1="63" x2="22" y2="14"/><line x1="10" y1="50" x2="22" y2="50"/><line x1="11" y1="38" x2="22" y2="38"/><line x1="12" y1="26" x2="22" y2="26"/></g><rect x="8" y="10" width="18" height="6" rx="2" fill="#f03e3e"/><path d="M24 12 C42 14 38 50 63 56 L61 63 C32 57 34 24 22 18 Z" fill="#fab005"/>'), 'Rutsche', 30, 80, 93, 15, 'g', 1],
    ['gpool', SV('0 0 64 40', '<ellipse cx="32" cy="24" rx="30" ry="14" fill="#4dabf7" stroke="#e64980" stroke-width="5"/><ellipse cx="32" cy="25" rx="21" ry="8" fill="#a5d8ff"/><path d="M18 25 q6-4 12 0 t12 0" stroke="#fff" stroke-width="2" fill="none"/><circle cx="44" cy="20" r="3" fill="#ffd43b"/>'), 'Planschbecken', 25, 52, 97, 10, 'g', 1.6],
    ['gtree', '🌳', 'Baum', 20, 8, 80, 18, 'g'],
    ['gdog', SV('0 0 64 64', '<path d="M4 31 L32 5 L60 31 Z" fill="#c92a2a"/><rect x="11" y="29" width="42" height="34" fill="#e8a64b"/><g stroke="#c98a3a" stroke-width="1.5"><line x1="11" y1="40" x2="53" y2="40"/><line x1="11" y1="51" x2="53" y2="51"/></g><path d="M23 63 V46 a9 9 0 0 1 18 0 V63 Z" fill="#5c3d23"/><rect x="25" y="32" width="14" height="6" rx="1" fill="#fff"/>'), 'Hundehütte', 35, 92, 88, 13, 'g'],
    ['gball', '⚽', 'Ball', 8, 36, 97, 5, 'g'],
    ['gbird', SV('0 0 40 64', '<rect x="18" y="30" width="4" height="34" fill="#8d6e63"/><path d="M3 19 L20 4 L37 19 Z" fill="#2f9e44"/><rect x="7" y="17" width="26" height="18" fill="#ffd8a8"/><circle cx="20" cy="25" r="4" fill="#5c3d23"/><path d="M27 10 q4-4 8 0 q-2 3-8 0 Z" fill="#339af0"/>'), 'Vogelhaus', 12, 66, 78, 9, 'g', 0.62],
    ['gstraw', '🍓', 'Erdbeeren', 10, 72, 97, 5, 'g'],
  ];
  // 🎄 Deko zur Jahreszeit und 🎂 zum Geburtstag – nur zum Anschauen, sucht sich freie Plätze
  const DECO = {
    xmas: [['dtree', '🎄', '', 0, 10, 94, 14], ['dgift', '🎁', '', 0, 24, 96, 6], ['dgift2', '🎁', '', 0, 30, 97, 4]],
    easter: [['dbun', '🐰', '', 0, 12, 94, 8], ['degg1', '🥚', '', 0, 26, 97, 4], ['degg2', '🥚', '', 0, 42, 97, 4], ['degg3', '🥚', '', 0, 58, 97, 4], ['dtul', '🌷', '', 0, 70, 96, 5]],
    fall: [['dpump', '🎃', '', 0, 12, 95, 8], ['dleaf', '🍂', '', 0, 30, 97, 5], ['dleaf2', '🍁', '', 0, 56, 97, 4], ['dbat', '🦇', '', 0, 42, 24, 5, 'w']],
    bday: [['dbal', '🎈', '', 0, 30, 40, 8, 'w'], ['dbal2', '🎈', '', 0, 38, 34, 6, 'w'], ['dcake', '🎂', '', 0, 64, 97, 8]],
  };
  const ALL = [...ITEMS, ...GITEMS, ...Object.values(DECO).flat()];
  const BYID = Object.fromEntries(ALL.map((it) => [it[0], it]));
  const isG = (id) => id === 'garden' || GITEMS.some((t) => t[0] === id);
  // Ostersonntag (gregorianisch)
  const easter = (y) => { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), n = h + l - 7 * m + 114; return new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1); };
  // Jahreszeit: 1.–26. Dezember, Woche vor Ostern bis Ostermontag, ganzer Oktober
  const season = (dt) => { const m = dt.getMonth() + 1, d = dt.getDate(); if (m === 12 && d <= 26) return 'xmas'; if (m === 10) return 'fall'; const x = Math.floor((new Date(dt.getFullYear(), m - 1, d) - easter(dt.getFullYear())) / 864e5); return x >= -7 && x <= 1 ? 'easter' : ''; };
  // ↔ Verschieben: Zone (c Decke, w Wand, f Boden), Kasten in % des Zimmers, keine Überlappung
  const ZONE = { c: [10, 20], w: [16, 66], f: [70, 99], g: [72, 99] };
  const zoneOf = (it) => it[7] || (it[0] === 'lamp' ? 'c' : it[5] >= 70 ? 'f' : 'w');
  const wOf = (it) => it[6] * (it[8] || 1);
  const box = (it, x, y) => { const s = it[6], w = wOf(it), hy = s * 400 / 260; return [x - w / 2, x + w / 2, y - hy, y]; };
  const hit = (a, b) => { const cx = (a[0] + a[1]) / 2 - (b[0] + b[1]) / 2, w = (a[1] - a[0] + b[1] - b[0]) / 2, cy = (a[2] + a[3]) / 2 - (b[2] + b[3]) / 2, h = (a[3] - a[2] + b[3] - b[2]) / 2; return Math.abs(cx) < w * 0.8 && Math.abs(cy) < h * 0.8; };
  const clampP = (it, x, y) => { const z = ZONE[zoneOf(it)], s = Math.ceil(wOf(it) / 2) + 1; return [Math.max(s, Math.min(100 - s, Math.round(x))), Math.round(Math.max(z[0], Math.min(z[1], y)))]; };
  const free = (it, x, y, pos) => !Object.entries(pos).some(([id, q]) => { const o = BYID[id]; return id !== it[0] && o && hit(box(it, x, y), box(o, q[0], q[1])); });
  // nächster freier Platz in derselben Zone (Raster 2 %), sonst null
  const near = (it, x, y, pos) => {
    const [cx, cy] = clampP(it, x, y); if (free(it, cx, cy, pos)) return [cx, cy];
    const z = ZONE[zoneOf(it)], c = [];
    for (let yy = z[0]; yy <= z[1]; yy += 2) for (let xx = 0; xx <= 100; xx += 2) { const q = clampP(it, xx, yy); c.push([Math.hypot(q[0] - cx, (q[1] - cy) * 0.65), q]); }
    c.sort((a, b) => a[0] - b[0]);
    const f = c.find(([, q]) => free(it, q[0], q[1], pos)); return f ? f[1] : null;
  };
  const WALLS = [['#ffe8cc', '#e9c46a'], ['#d0ebff', '#a5d8ff'], ['#ffdeeb', '#fcc2d7'], ['#d3f9d8', '#b2f2bb'], ['#e5dbff', '#d0bfff']];
  const CSS = `<style>.ph{display:grid;gap:12px}.phroom{position:relative;width:100%;aspect-ratio:400/260;container-type:inline-size;border-radius:18px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.12)}
.phroom>svg{position:absolute;inset:0;width:100%;height:100%;display:block}.phit{position:absolute;transform:translate(-50%,-100%);line-height:1;filter:drop-shadow(0 2px 1px rgba(0,0,0,.18));touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}
.phit.on{outline:3px dashed var(--ac);outline-offset:3px;border-radius:10px;animation:phw 1s ease-in-out infinite;z-index:3}@keyframes phw{0%,100%{rotate:-4deg}50%{rotate:4deg}}
.phmv{display:grid;grid-template-columns:repeat(3,52px) 1fr;grid-template-areas:". u . n" "l d r o";gap:6px;align-items:center;padding:8px;border-radius:16px;background:var(--soft)}.phmv b{grid-area:n;text-align:center}.phmv [data-v=u]{grid-area:u}.phmv [data-v=l]{grid-area:l}.phmv [data-v=d]{grid-area:d}.phmv [data-v=r]{grid-area:r}.phmv .ok{grid-area:o}
.phmv button{min-width:52px;min-height:48px;font-size:22px;border-radius:14px;border:0;background:var(--bg);color:var(--tx);font-weight:800;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.15)}.phmv button.ok{font-size:16px;background:var(--ac);color:#fff;padding:0 14px}
.phpet{position:absolute;left:50%;bottom:4%;transform:translateX(-50%);width:34%;pointer-events:none}.phpet svg{width:100%;height:auto;display:block}
.phshop{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px}.phshop button{display:grid;justify-items:center;gap:2px;padding:8px 4px;font-size:13px;border-radius:14px;border:0;background:var(--soft);font:inherit;font-weight:700;color:var(--tx);cursor:pointer}
.phshop button i{font-style:normal;font-size:26px;line-height:1.1}.phshop button small{font-weight:800;color:var(--gold)}.phshop button.own small{color:var(--ok)}.phshop button.sure{box-shadow:0 0 0 3px var(--ac)}.phshop button.off{opacity:.55}
.phrain line{stroke:#d0ebff;stroke-width:2;stroke-linecap:round;animation:phr .7s linear infinite}@keyframes phr{from{transform:translateY(-30px)}to{transform:translateY(60px)}}
.phsnow circle{fill:#fff;animation:phs 3s linear infinite}@keyframes phs{from{transform:translateY(-20px)}to{transform:translateY(80px)}}
.phflash{animation:phf 4s infinite}@keyframes phf{0%,90%,100%{opacity:0}92%,96%{opacity:.85}}
.phdark{position:absolute;inset:0;background:rgba(12,16,48,.52);pointer-events:none}.phmoon{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen}
.phpet.sl{bottom:auto;width:13%;transform:translate(-50%,-100%) rotate(-8deg)}.phroom.sleep .phit{cursor:default}
.phit .phsv{display:block;height:1em}.phdc{position:absolute;transform:translate(-50%,-100%);line-height:1;pointer-events:none;filter:drop-shadow(0 2px 1px rgba(0,0,0,.18))}
.phlt circle{animation:phlt 1.6s ease-in-out infinite}.phlt circle:nth-child(2n){animation-delay:-.8s}.phlt circle:nth-child(3n){animation-delay:-.4s}@keyframes phlt{50%{opacity:.35}}
.phpet.gst{width:24%;left:24%}.phpet .phhat{position:absolute;left:50%;top:-14%;width:30%;transform:translateX(-50%) rotate(-10deg);pointer-events:none}
.phtabs{display:flex;gap:6px}.phtabs button{flex:1;min-height:42px;border-radius:14px;border:0;background:var(--soft);color:var(--tx);font:inherit;font-weight:800;cursor:pointer}.phtabs button.on{background:var(--ac);color:#fff}
.phvis{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center}
.phgrain line{stroke:#d0ebff;stroke-width:2;stroke-linecap:round;animation:phr2 .8s linear infinite}@keyframes phr2{from{transform:translateY(-40px)}to{transform:translateY(160px)}}
.phgsnow circle{fill:#fff;animation:phs2 5s linear infinite}@keyframes phs2{from{transform:translateY(-30px)}to{transform:translateY(240px)}}
@media (prefers-reduced-motion: reduce){.phrain line,.phsnow circle,.phflash,.phit.on,.phlt circle,.phgrain line,.phgsnow circle{animation:none}}</style>`;

  class M {
    // 🏷️ Preis: eigener Preis (Eltern) oder Standard × Faktor
    _phPrice(id) {
      const it = ITEMS.find((x) => x[0] === id) || GITEMS.find((x) => x[0] === id); if (!it) return 0;
      const own = (this._cfg.phPr || {})[id], n = Number(own);
      if (own !== undefined && own !== null && own !== '' && Number.isFinite(n)) return Math.max(0, Math.min(999, Math.round(n)));
      const f = [0.5, 1, 2, 3].includes(Number(this._cfg.phF)) ? Number(this._cfg.phF) : 1;
      return Math.max(1, Math.round(it[3] * f));
    }
    // Einstellungen im Tab 🐾: Faktor für alle und jeder Gegenstand einzeln
    _phPriceHtml() {
      const c = this._cfg, f = String([0.5, 1, 2, 3].includes(Number(c.phF)) ? Number(c.phF) : 1), own = c.phPr || {};
      const opt = (v, l) => `<option value="${v}" ${f === v ? 'selected' : ''}>${esc(l)}</option>`;
      const L = [...ITEMS, ...(c.phGar !== false ? GITEMS : [])].filter((x) => x[0] !== 'bed' && (x[0] !== 'garden' || c.phGar !== false));
      const n = Object.keys(own).filter((id) => L.some((x) => x[0] === id)).length;
      const ico = (id, e) => (id === 'rug' ? '🟥' : id === 'wall' ? '🎨' : id === 'garden' ? '🌳' : e.startsWith('<svg') ? `<span style="display:inline-block;width:22px;height:22px;vertical-align:middle">${e}</span>` : e);
      const rows = L.map(([id, e, name, base]) => { const def = Math.max(1, Math.round(base * Number(f))); return `<label style="display:grid;grid-template-columns:28px 1fr 84px;align-items:center;gap:8px;margin:0"><span style="font-size:20px">${ico(id, e)}</span><span>${esc(T(name))}</span><input type="number" min="0" max="999" inputmode="numeric" data-pecfg="phPr" data-id="${id}" placeholder="${def}" value="${own[id] !== undefined && own[id] !== '' ? esc(String(own[id])) : ''}"></label>`; }).join('');
      const sw = (k, label) => this._chk(k, c[k] !== false, label);
      return `<div class="fopt">${sw('phSeas', T('🎄 Deko zur Jahreszeit<small>Im Dezember Lichterkette, Tannenbaum und Geschenke, an Ostern Hase und Eier, im Oktober Kürbis und Herbstlaub.</small>'))}
        ${sw('phBd', T('🎂 Geburtstag im Zimmer<small>Girlande, Luftballons, Torte und ein Partyhut – und einmal 🪙 Geburtstags-Taler (Standard 50, je Kind unter ✎ änderbar). Braucht den Geburtstag beim Kind.</small>'))}
        ${sw('phGar', T('🌳 Garten<small>Ein zweiter Raum für 200 🪙 Taler – mit eigenem Laden: Blumenbeet, Rutsche, Planschbecken, Baum, Hundehütte und mehr.</small>'))}
        ${sw('phVis', T('👋 Besuch<small>Das Kind lädt das Haustier eines Geschwisterkinds ins Zimmer ein. Einmal am Tag gibt es dafür für beide +2 🪙.</small>'))}
        <label>${T('🏷️ Preise im Zuhause')}<select data-pecfg="phF">${opt('0.5', T('günstiger (½)'))}${opt('1', T('normal'))}${opt('2', T('teurer (2×)'))}${opt('3', T('viel teurer (3×)'))}</select></label>
        <label>${T('⭐ → 🪙 Sterne pro Tag in Taler tauschen')}<select data-pecfg="tlMax">${[5, 10, 15, 20, 30, 0].map((v) => `<option value="${v}" ${Number(c.tlMax ?? 10) === v ? 'selected' : ''}>${v ? T('höchstens {n} ⭐', { n: v }) : T('ohne Grenze')}</option>`).join('')}</select></label>
        <div class="hint">${T('Gilt für Belohnungen mit 🪙 Talern. Taler aus den Spielen zählen nicht mit.')}</div>
        <details ${n ? 'open' : ''}><summary class="hint" style="cursor:pointer">${T('✏️ Preise einzeln')}${n ? ` (${n})` : ''}</summary>
          <div style="display:grid;gap:6px;margin-top:8px">${rows}</div>
          <div class="hint">${T('Leer = Standard. 0 = geschenkt.')}</div>
          ${n ? `<div class="btnrow"><button type="button" class="btn sm" data-a="pehreset">${T('↺ Alle Preise auf Standard')}</button></div>` : ''}</details></div>`;
    }
    _phData(kid) { const p = this._peP(kid), h = p.home && typeof p.home === 'object' ? p.home : {}; return { o: ['bed', ...(Array.isArray(h.o) ? h.o : []).filter((x) => x !== 'bed')], x: (Array.isArray(h.x) ? h.x : []).filter((x) => x !== 'bed'), w: Number(h.w) || 0, p: h.p && typeof h.p === 'object' ? { ...h.p } : {} }; }
    _phSave(kid, h) { this._peSet(kid, { home: { o: h.o.slice(0, 40), x: h.x.slice(0, 40), w: Math.max(0, Math.min(WALLS.length - 1, h.w)), ...(Object.keys(h.p || {}).length ? { p: h.p } : {}) } }); }
    // Plätze aller aufgestellten Sachen: verschobene zuerst, dann Standardplätze – nie überlappend
    _phLayout(h, L = ITEMS) {
      const show = L.filter((it) => it[1] && h.o.includes(it[0]) && !h.x.includes(it[0])), pos = {};
      [...show.filter((it) => h.p[it[0]]), ...show.filter((it) => !h.p[it[0]])].forEach((it) => { const q = h.p[it[0]] || [it[4], it[5]]; const r = near(it, q[0], q[1], pos); pos[it[0]] = r || [it[4], it[5]]; });
      return pos;
    }
    // eine Sache an (x, y) stellen; dir: beim Steuerkreuz über Hindernisse hinweg weitergehen
    _phPut(kid, id, x, y, dir) {
      const h = this._phData(kid), it = BYID[id]; if (!it || !h.o.includes(id)) return;
      const pos = this._phLayout(h, isG(id) ? GITEMS : ITEMS), cur = pos[id] || [x, y]; delete pos[id];
      let r = null;
      if (dir) { for (let i = 1; i <= 25 && !r; i++) { const q = clampP(it, x + dir[0] * 4 * i, y + dir[1] * 4 * i); if ((q[0] !== cur[0] || q[1] !== cur[1]) && free(it, q[0], q[1], pos)) r = q; } if (!r) return; }
      else r = near(it, x, y, pos);
      if (!r) { this._toast(T('Da ist kein Platz frei.')); return; }
      h.p[id] = r; this._phSave(kid, h);
    }
    // 🎄🎂 Deko: zur Jahreszeit und am Geburtstag, um die aufgestellten Sachen herum
    _phDeco(k, pos) {
      const c = this._cfg, today = new Date(), sea = c.phSeas !== false ? season(today) : '', bd = c.phBd !== false && this._isBday(k, Y.dk(today));
      const L = [...(sea ? DECO[sea] : []), ...(bd ? DECO.bday : [])], P = { ...pos }, out = [];
      L.forEach((it) => { const q = near(it, it[4], it[5], P); if (q) { P[it[0]] = q; out.push(`<span class="phdc" style="left:${q[0]}%;top:${q[1]}%;font-size:${Math.round(it[6] * 3.2)}px;font-size:${it[6]}cqw">${it[1]}</span>`); } });
      return { sea, bd, html: out.join('') };
    }
    _phLights() { return `<g class="phlt"><path d="M0 6 Q50 22 100 8 T200 8 T300 8 T400 6" fill="none" stroke="#2b8a3e" stroke-width="2"/>${Array.from({ length: 16 }, (_, i) => { const x = 12 + i * 25, y = 10 + (i % 2 ? 6 : 4); return `<circle cx="${x}" cy="${y}" r="4.5" fill="${['#ff6b6b', '#ffd43b', '#69db7c', '#4dabf7', '#f783ac'][i % 5]}"/>`; }).join('')}</g>`; }
    _phGarland() { return `<path d="M0 4 Q100 26 200 6 Q300 26 400 4" fill="none" stroke="#868e96" stroke-width="1.5"/>${Array.from({ length: 15 }, (_, i) => { const x = 14 + i * 26, y = 6 + Math.round(Math.sin((x / 200) * Math.PI) * 13); return `<path d="M${x - 8} ${y} L${x + 8} ${y} L${x} ${y + 16} Z" fill="${['#f03e3e', '#fab005', '#40c057', '#228be6', '#be4bdb'][i % 5]}"/>`; }).join('')}`; }
    _phHat() { return '<svg class="phhat" viewBox="0 0 40 48" aria-hidden="true"><path d="M20 2 L36 44 H4 Z" fill="#e64980"/><path d="M12 24 L28 24 M8 34 L32 34" stroke="#ffd43b" stroke-width="3"/><circle cx="20" cy="4" r="4" fill="#ffd43b"/></svg>'; }
    // Fenster mit Wetter: Sonne, Regen, Schnee, Gewitter – bei Nacht dunkel mit Mond
    _phWindow(dark) {
      const wx = this._peWx(), h = new Date().getHours(), night = dark || h < 7 || h >= 19;
      const sky = night ? ['#1b1e3a', '#3b4180'] : wx === 'rain' || wx === 'storm' ? ['#868e96', '#adb5bd'] : wx === 'snow' ? ['#ced4da', '#e9ecef'] : ['#74c0fc', '#d0ebff'];
      const drops = Array.from({ length: 14 }, (_, i) => `<line x1="${30 + (i * 37) % 110}" y1="${18 + (i * 23) % 50}" x2="${26 + (i * 37) % 110}" y2="${30 + (i * 23) % 50}" style="animation-delay:${(i % 7) * -0.1}s"/>`).join('');
      const flakes = Array.from({ length: 14 }, (_, i) => `<circle cx="${30 + (i * 31) % 110}" cy="${16 + (i * 19) % 50}" r="${2 + (i % 2)}" style="animation-delay:${(i % 6) * -0.5}s"/>`).join('');
      return `<defs><linearGradient id="phSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient><clipPath id="phWin"><rect x="24" y="16" width="120" height="84" rx="4"/></clipPath></defs>
        <rect x="18" y="10" width="132" height="96" rx="8" fill="#fff" stroke="#c9a46b" stroke-width="3"/>
        <g clip-path="url(#phWin)"><rect x="24" y="16" width="120" height="84" fill="url(#phSky)"/>
          ${night ? '<circle cx="118" cy="36" r="11" fill="#fff9db"/><circle cx="123" cy="32" r="10" fill="#3b4180"/><circle cx="50" cy="30" r="1.5" fill="#fff"/><circle cx="80" cy="44" r="1.2" fill="#fff"/><circle cx="64" cy="24" r="1" fill="#fff"/>' : wx === 'sun' || !wx ? '<circle cx="114" cy="38" r="14" fill="#ffd43b"/>' : ''}
          ${!night || wx ? '<ellipse cx="60" cy="40" rx="20" ry="8" fill="#fff" opacity=".85"/><ellipse cx="74" cy="36" rx="14" ry="7" fill="#fff" opacity=".85"/>' : ''}
          <path d="M24 100 Q60 80 96 92 T144 86 V100 Z" fill="${night ? '#2b3a2f' : '#8ce99a'}"/>
          ${wx === 'rain' || wx === 'storm' ? `<g class="phrain">${drops}</g>` : ''}${wx === 'snow' ? `<g class="phsnow">${flakes}</g>` : ''}
          ${wx === 'storm' ? '<rect class="phflash" x="24" y="16" width="120" height="84" fill="#fff"/>' : ''}</g>
        <line x1="84" y1="16" x2="84" y2="100" stroke="#fff" stroke-width="4"/><line x1="24" y1="58" x2="144" y2="58" stroke="#fff" stroke-width="4"/>
        <path d="M14 8 h18 q-6 50 4 100 h-22 Z" fill="#ff8787" opacity=".9"/><path d="M154 8 h-18 q6 50 -4 100 h22 Z" fill="#ff8787" opacity=".9"/>`;
    }
    _phRoom(k, h, sl) {
      const p = this._peP(k.id), W = WALLS[h.w] || WALLS[0], show = (id) => h.o.includes(id) && !h.x.includes(id);
      const svg = `<svg viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true"><rect width="400" height="175" fill="${W[0]}"/>
        <g opacity=".35">${Array.from({ length: 9 }, (_, i) => `<circle cx="${20 + i * 46}" cy="${150 - (i % 2) * 20}" r="3" fill="${W[1]}"/>`).join('')}</g>
        <rect y="175" width="400" height="85" fill="#d9a066"/><g stroke="#c08552" stroke-width="2">${[195, 215, 238].map((y) => `<line x1="0" y1="${y}" x2="400" y2="${y}"/>`).join('')}</g>
        <rect y="170" width="400" height="8" fill="#b07a45"/>
        ${this._phWindow(sl)}
        ${show('rug') ? '<ellipse cx="200" cy="236" rx="110" ry="20" fill="#e64980" opacity=".75"/><ellipse cx="200" cy="236" rx="86" ry="14" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/>' : ''}
        %%DECO%%</svg>`;
      const pos = this._phLayout(h), sel = !sl && this._phSel && this._phSel.k === k.id ? this._phSel.id : '';
      const items = this._phItems(ITEMS, h, pos, sel), dc = this._phDeco(k, pos);
      // 🌙 Schlafenszeit: dunkles Zimmer, Mondlicht fällt durchs Fenster, das Tier liegt im Bett
      const bed = pos.bed || [84, 92];
      const night = sl ? `<div class="phdark"></div><svg class="phmoon" viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="phMoonL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dbe4ff" stop-opacity=".55"/><stop offset="1" stop-color="#dbe4ff" stop-opacity=".06"/></linearGradient></defs><polygon points="24,100 144,100 330,260 110,260" fill="url(#phMoonL)"/><rect x="24" y="16" width="120" height="84" fill="#dbe4ff" opacity=".18"/></svg>` : '';
      const pet = this._phPetHtml(k, p, dc.bd, sl ? `style="left:${bed[0]}%;top:${bed[1] - 9}%"` : '', sl ? 'sl' : '');
      const deco = `${dc.sea === 'xmas' ? this._phLights() : ''}${dc.bd ? this._phGarland() : ''}`;
      return `<div class="phroom ${sl ? 'sleep' : ''}" data-k="${k.id}">${svg.replace('%%DECO%%', deco)}${items}${dc.html}${sl ? '' : this._phGuestHtml(k)}${night}${pet}</div>`;
    }
    _phItems(L, h, pos, sel) {
      return L.filter((it) => it[1] && h.o.includes(it[0]) && !h.x.includes(it[0])).map((it) => { const q = pos[it[0]] || [it[4], it[5]], sv = it[1].startsWith('<svg'); return `<span class="phit ${sel === it[0] ? 'on' : ''}" data-id="${it[0]}" role="button" aria-label="${esc(T(it[2]))}" style="left:${q[0]}%;top:${q[1]}%;font-size:${Math.round(it[6] * 3.2)}px;font-size:${it[6]}cqw">${sv ? `<span class="phsv" style="width:${it[8] || 1}em">${it[1]}</span>` : it[1]}</span>`; }).join('');
    }
    _phPetHtml(k, p, hat, st, cls) { return `<div class="phpet pest ${cls}" data-k="${k.id}" ${st}><div class="pesv">${this._peFrame(k, p, performance.now(), false)}</div><div class="pefx"></div>${hat && !cls ? this._phHat() : ''}</div>`; }
    // 👋 Besuch: Haustier eines Geschwisterkinds steht mit im Zimmer
    _phGuestHtml(k) {
      const g = this._phG && this._phG.k === k.id ? this._db.kid[this._phG.g] : null; if (!g || this._cfg.phVis === false) return '';
      const gp = this._peP(g.id); if (!this._peKindOf(gp) || this._peMood(g).m === 'sleep') return '';
      return `<div class="phpet pest gst" data-k="${g.id}"><div class="pesv">${this._peFrame(g, gp, performance.now(), false)}</div><div class="pefx"></div></div>`;
    }
    // 🌳 Garten: Himmel mit Wetter, Zaun, Wiese – Regen und Schnee fallen hier draußen wirklich
    _phGarden(k, h) {
      const p = this._peP(k.id), wx = this._peWx(), hr = new Date().getHours(), night = hr < 7 || hr >= 19;
      const sky = night ? ['#1b1e3a', '#3b4180'] : wx === 'rain' || wx === 'storm' ? ['#868e96', '#ced4da'] : wx === 'snow' ? ['#ced4da', '#f1f3f5'] : ['#74c0fc', '#e7f5ff'];
      const drops = Array.from({ length: 34 }, (_, i) => `<line x1="${(i * 53) % 400}" y1="${(i * 29) % 120}" x2="${(i * 53) % 400 - 5}" y2="${(i * 29) % 120 + 14}" style="animation-delay:${(i % 9) * -0.09}s"/>`).join('');
      const flakes = Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 47) % 400}" cy="${(i * 31) % 160}" r="${2 + (i % 2)}" style="animation-delay:${(i % 8) * -0.6}s"/>`).join('');
      const fence = Array.from({ length: 21 }, (_, i) => `<path d="M${i * 20 + 4} 172 V138 l6-8 6 8 V172 Z" fill="#fff" stroke="#dee2e6"/>`).join('');
      const pos = this._phLayout(h, GITEMS), sel = this._phSel && this._phSel.k === k.id ? this._phSel.id : '', dc = this._phDeco(k, pos);
      const svg = `<svg viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="phGs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>
        <rect width="400" height="190" fill="url(#phGs)"/>
        ${night ? '<circle cx="330" cy="40" r="16" fill="#fff9db"/><circle cx="337" cy="34" r="14" fill="#3b4180"/><circle cx="80" cy="30" r="1.6" fill="#fff"/><circle cx="160" cy="54" r="1.3" fill="#fff"/><circle cx="240" cy="22" r="1.2" fill="#fff"/>' : wx === 'sun' || !wx ? '<circle cx="330" cy="42" r="20" fill="#ffd43b"/>' : ''}
        ${!night || wx ? '<ellipse cx="120" cy="44" rx="34" ry="12" fill="#fff" opacity=".85"/><ellipse cx="146" cy="38" rx="22" ry="10" fill="#fff" opacity=".85"/><ellipse cx="250" cy="70" rx="26" ry="9" fill="#fff" opacity=".7"/>' : ''}
        <path d="M0 150 Q100 120 200 142 T400 132 V190 H0 Z" fill="${night ? '#2b3a2f' : '#a9e34b'}" opacity=".7"/>
        <g opacity="${night ? 0.55 : 1}">${fence}<rect y="146" width="400" height="5" fill="#fff"/><rect y="160" width="400" height="5" fill="#fff"/></g>
        <rect y="170" width="400" height="90" fill="${night ? '#2f4f2f' : wx === 'snow' ? '#e9ecef' : '#69db7c'}"/>
        <path d="M150 260 Q190 220 200 172 H216 Q214 220 250 260 Z" fill="${wx === 'snow' ? '#dee2e6' : '#e9c46a'}" opacity=".8"/>
        ${dc.sea === 'xmas' ? this._phLights() : ''}${dc.bd ? this._phGarland() : ''}</svg>`;
      const fx = `<svg class="phmoon" viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden="true" style="mix-blend-mode:normal">${wx === 'rain' || wx === 'storm' ? `<g class="phgrain">${drops}</g>` : ''}${wx === 'snow' ? `<g class="phgsnow">${flakes}</g>` : ''}${wx === 'storm' ? '<rect class="phflash" width="400" height="260" fill="#fff"/>' : ''}</svg>`;
      return `<div class="phroom gar" data-k="${k.id}">${svg}${this._phItems(GITEMS, h, pos, sel)}${dc.html}${this._phGuestHtml(k)}${this._phPetHtml(k, p, dc.bd, '', '')}${fx}${night ? '<div class="phdark" style="background:rgba(12,16,48,.3)"></div>' : ''}</div>`;
    }
    _phHtml(kid) {
      const k = this._db.kid[kid]; if (!k) return '';
      const h = this._phData(kid), pts = Number(this._peP(kid).tl) || 0, sure = this._phSure && this._phSure.k === kid && Date.now() - this._phSure.t < 6000 ? this._phSure.id : '';
      const c = this._cfg, gOn = c.phGar !== false, gar = gOn && h.o.includes('garden') && (this._phR || {})[kid] === 'g';
      const shop = (gar ? GITEMS : ITEMS.filter((x) => x[0] !== 'garden' || gOn)).map(([id, e, n]) => {
        const price = this._phPrice(id);
        const own = h.o.includes(id), off = own && h.x.includes(id);
        const ico = id === 'garden' ? '🌳' : e.startsWith('<svg') ? `<span style="display:block;width:30px;height:30px">${e}</span>` : e || (id === 'rug' ? '🟥' : '🎨');
        if (id === 'garden' && own) return `<button type="button" class="own" data-a="pehroom" data-k="${kid}" data-v="g"><i>${ico}</i>${T(n)}<small>${T('✓ gekauft')}</small></button>`;
        if (id === 'bed') return `<button type="button" class="own" aria-disabled="true"><i>${ico}</i>${T(n)}<small>${T('✓ immer im Zimmer')}</small></button>`;
        if (id === 'wall' && own) return `<button type="button" class="own" data-a="pehwall" data-k="${kid}"><i>🎨</i>${T('Tapete wechseln')}<small>✓</small></button>`;
        if (own) return `<button type="button" class="own ${off ? 'off' : ''}" data-a="pehtog" data-k="${kid}" data-v="${id}"><i>${ico}</i>${T(n)}<small>${off ? T('weggeräumt') : T('✓ im Zimmer')}</small></button>`;
        return `<button type="button" class="${sure === id ? 'sure' : ''}" data-a="pehbuy" data-k="${kid}" data-v="${id}" ${pts < price ? 'aria-disabled="true"' : ''}><i>${ico}</i>${T(n)}<small>${sure === id ? T('Für {n} 🪙 kaufen?', { n: price }) : `${price} 🪙`}</small></button>`;
      }).join('');
      this._phDrag();
      const sl = this._peMood(k).m === 'sleep';
      if (sl) return `${CSS}<div class="ph">${this._phRoom(k, h, true)}<div class="hint" style="text-align:center">🌙 ${T('Pssst … {name} schläft. Morgen früh kannst du wieder einrichten.', { name: esc(this._peName(this._peP(kid))) })}</div></div>`;
      const sel = this._phSel && this._phSel.k === kid && h.o.includes(this._phSel.id) && !h.x.includes(this._phSel.id) && isG(this._phSel.id) === gar ? BYID[this._phSel.id] : null;
      const mb = (v, l, lab) => `<button type="button" data-a="pehmv" data-k="${kid}" data-v="${v}" aria-label="${esc(lab)}">${l}</button>`;
      const bar = sel ? `<div class="phmv"><b>${sel[1].startsWith('<svg') ? '' : sel[1]} ${esc(T(sel[2]))}</b>${mb('l', '◀', T('nach links'))}${mb('u', '▲', T('nach oben'))}${mb('d', '▼', T('nach unten'))}${mb('r', '▶', T('nach rechts'))}<button type="button" class="ok" data-a="pehok" data-k="${kid}">✓ ${T('Fertig')}</button></div>`
        : `<div class="hint" style="text-align:center">${T('Tipp: Sachen im Zimmer antippen und verschieben – mit dem Finger oder mit den Pfeilen.')}${Object.keys(h.p).some((id) => isG(id) === gar) ? ` <button type="button" class="btn sm" data-a="pehtidy" data-k="${kid}">↺ ${T('Aufräumen')}</button>` : ''}</div>`;
      const tabs = gOn && h.o.includes('garden') ? `<div class="phtabs"><button type="button" class="${gar ? '' : 'on'}" data-a="pehroom" data-k="${kid}" data-v="z">🛋️ ${T('Zimmer')}</button><button type="button" class="${gar ? 'on' : ''}" data-a="pehroom" data-k="${kid}" data-v="g">🌳 ${T('Garten')}</button></div>` : '';
      const sibs = c.phVis !== false ? Object.values(this._db.kid).filter((x) => x.id !== kid && this._peKindOf(this._peP(x.id)) && this._peP(x.id).on !== false) : [];
      const gst = this._phG && this._phG.k === kid ? this._db.kid[this._phG.g] : null;
      const vis = sibs.length ? `<div class="phvis">${gst ? `<span class="hint">👋 ${T('{name} ist zu Besuch!', { name: esc(this._peName(this._peP(gst.id))) })}</span><button type="button" class="btn sm" data-a="pehbye" data-k="${kid}">${T('Tschüss sagen')}</button>`
        : sibs.map((x) => { const zz = this._peMood(x).m === 'sleep'; return `<button type="button" class="btn sm" data-a="pehvis" data-k="${kid}" data-v="${x.id}" ${zz ? 'aria-disabled="true"' : ''}>${zz ? '😴' : '👋'} ${T('{name} einladen', { name: esc(this._peName(this._peP(x.id))) })}</button>`; }).join('')}</div>` : '';
      const moving = h.o.some((id) => id !== 'wall' && id !== 'rug' && id !== 'garden' && isG(id) === gar && !h.x.includes(id));
      return `${CSS}<div class="ph">${tabs}${gar ? this._phGarden(k, h) : this._phRoom(k, h)}${vis}${moving ? bar : ''}
        <div class="card"><h3>${gar ? T('🛒 Garten einrichten') : T('🛒 Einrichten')} <span class="hint">· 🪙 ${pts}</span></h3><div class="phshop">${shop}</div>
        <div class="hint" style="margin-top:8px">${T('Mit deinen 🪙 Talern aus den Spielen kaufst du Sachen für das Zimmer. Antippen und noch einmal bestätigen. Gekaufte Sachen kannst du wegräumen und wieder aufstellen. Mehr Taler gibt es auch als Belohnung.')}</div></div></div>`;
    }
    _phAct(a, ds) {
      const kid = ds.k, k = this._db.kid[kid]; if (!k) return;
      const h = this._phData(kid);
      if (this._peMood(k).m === 'sleep') { this._toast(T('Pssst … {name} schläft. 😴', { name: this._peName(this._peP(kid)) })); this._render(); return; }
      if (a === 'pehbuy') {
        const it = ITEMS.find((x) => x[0] === ds.v) || GITEMS.find((x) => x[0] === ds.v); if (!it || h.o.includes(it[0])) return;
        if (isG(it[0]) && this._cfg.phGar === false) return;
        if (it[0] !== 'garden' && GITEMS.includes(it) && !h.o.includes('garden')) return;
        const price = this._phPrice(it[0]);
        const tl = Number(this._peP(kid).tl) || 0;
        if (tl < price) { this._toast(T('Dafür brauchst du noch {n} 🪙 Taler – die gibt es in den Spielen.', { n: price - tl })); return; }
        if (!(this._phSure && this._phSure.k === kid && this._phSure.id === it[0] && Date.now() - this._phSure.t < 6000)) { this._phSure = { k: kid, id: it[0], t: Date.now() }; this._render(); return; }
        this._phSure = null;
        if (price) this._tlAdd(kid, -price);
        h.o.push(it[0]); if (it[0] === 'wall') h.w = (h.w + 1) % WALLS.length;
        this._phSave(kid, h);
        if (it[0] === 'garden') { this._phR = { ...(this._phR || {}), [kid]: 'g' }; this._toast(T('🌳 Juhu, ein eigener Garten!')); }
        else this._toast(isG(it[0]) ? T('🌳 {x} steht jetzt im Garten!', { x: T(it[2]) }) : T('🏠 {x} steht jetzt im Zimmer!', { x: T(it[2]) }));
        if (this._peDo) this._peDo(kid, 'cheer', 2000);
      }
      if (a === 'pehroom') { this._phSel = null; this._phR = { ...(this._phR || {}), [kid]: ds.v === 'g' && h.o.includes('garden') ? 'g' : 'z' }; }
      if (a === 'pehbye') this._phG = null;
      if (a === 'pehvis' && this._cfg.phVis !== false) {
        const g = this._db.kid[ds.v]; if (!g || g.id === kid || !this._peKindOf(this._peP(g.id))) return;
        if (this._peMood(g).m === 'sleep') { this._toast(T('Pssst … {name} schläft. 😴', { name: this._peName(this._peP(g.id)) })); return; }
        this._phG = { k: kid, g: g.id };
        const today = Y.dk(new Date());
        if (this._peP(kid).vd !== today) { this._peSet(kid, { vd: today }); this._tlAdd(kid, 2); this._tlAdd(g.id, 2); this._toast(T('👋 {name} ist zu Besuch – ihr bekommt beide +2 🪙!', { name: this._peName(this._peP(g.id)) })); }
        else this._toast(T('👋 {name} ist zu Besuch!', { name: this._peName(this._peP(g.id)) }));
        if (this._peDo) { this._peDo(kid, 'cheer', 2000); this._peDo(g.id, 'cheer', 2000); }
      }
      if (a === 'pehtog' && ds.v !== 'bed' && ds.v !== 'garden' && h.o.includes(ds.v)) { h.x = h.x.includes(ds.v) ? h.x.filter((x) => x !== ds.v) : [...h.x, ds.v]; this._phSave(kid, h); }
      if (a === 'pehwall' && h.o.includes('wall')) { h.w = (h.w + 1) % WALLS.length; this._phSave(kid, h); }
      if (a === 'pehmv' && this._phSel && this._phSel.k === kid) {
        const d = { l: [-1, 0], r: [1, 0], u: [0, -1], d: [0, 1] }[ds.v], q = this._phLayout(h)[this._phSel.id];
        if (d && q) this._phPut(kid, this._phSel.id, q[0], q[1], d);
      }
      if (a === 'pehok') this._phSel = null;
      if (a === 'pehtidy') { const g0 = (this._phR || {})[kid] === 'g'; this._phSel = null; Object.keys(h.p).forEach((id) => { if (isG(id) === g0) delete h.p[id]; }); this._phSave(kid, h); }
      this._render();
    }
    // 👆 Antippen wählt aus, Ziehen verschiebt (nur auf den Sachen selbst – sonst scrollt die Seite normal)
    _phDrag() {
      if (this._phPD || !this.shadowRoot) return; this._phPD = true;
      this.shadowRoot.addEventListener('pointerdown', (e) => {
        const el = e.target && e.target.closest ? e.target.closest('.phit[data-id]') : null; if (!el) return;
        const room = el.closest('.phroom'), kid = room && room.dataset.k, id = el.dataset.id; if (!kid || room.classList.contains('sleep')) return;
        e.preventDefault();
        const r = room.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, x0 = parseFloat(el.style.left), y0 = parseFloat(el.style.top);
        let moved = false, nx = x0, ny = y0;
        const mv = (ev) => {
          if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 8) return;
          if (!moved) { moved = true; this._phSel = { k: kid, id }; el.classList.add('on'); }
          nx = x0 + (ev.clientX - sx) / r.width * 100; ny = y0 + (ev.clientY - sy) / r.height * 100;
          el.style.left = `${nx}%`; el.style.top = `${ny}%`;
        };
        const up = () => {
          window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
          if (moved) { this._phSel = { k: kid, id }; this._phPut(kid, id, nx, ny, null); }
          else this._phSel = this._phSel && this._phSel.k === kid && this._phSel.id === id ? null : { k: kid, id };
          this._render();
        };
        window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
    }
  }
  Object.getOwnPropertyNames(M.prototype).forEach((n) => { if (n !== 'constructor') Object.defineProperty(C.prototype, n, Object.getOwnPropertyDescriptor(M.prototype, n)); });
  return true;
}
