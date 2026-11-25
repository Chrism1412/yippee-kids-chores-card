/* Yippee! - Kids Chores – 🐾 Haustier (Hund, Katze, Dino, Einhorn, Vogel, Superheld, Fee)
 * Wird von der Karte nur geladen, wenn das Haustier eingeschaltet ist (⚙️ Einstellungen → ⚙️ Allgemein → 🐾 Haustier).
 * Alles wird im Code gezeichnet (SVG) – keine Bilddateien. Gespeichert wird je Kind in derselben Liste wie alles andere (pk).
 * Das Tier wächst mit den Sternen seit seinem Start, freut sich über erledigte Aufgaben und wird nie krank.
 */
export default function install(C, Y) {
  // ✓-Liste wie bei den Zahnputz-Aufgaben (Aufgaben fürs Freischalten)
  const PELIST_CSS = '<style>.pelist{display:grid;margin-top:2px}.pelist label{display:flex;flex-direction:row;align-items:center;justify-content:flex-start;text-align:left;gap:9px;padding:7px 0;font-size:14px;font-weight:500;color:inherit;cursor:pointer;min-width:0}.pelist input{display:none}.pelist i{font-style:normal;width:22px;height:22px;border-radius:7px;flex:none;display:flex;align-items:center;justify-content:center;font-size:13px;background:rgba(127,127,127,.18);color:#fff}.pelist input:checked+i{background:var(--yippee-accent,#ff8a3d)}.pelist input:checked+i:after{content:"✓"}.pelist span{min-width:0}.pelist small{opacity:.7;font-weight:400}</style>';
  const { T, esc, dk, levelOf } = Y;
  /* Zeichnungen (SVG, im Code gezeichnet – keine Bilddateien)
   * draw(kind, o) liefert ein <svg> mit dem Tier. Alles wird über Parameter gesteuert:
   *   g      Wachstum 0 = Baby … 1 = ausgewachsen
   *   eyes   'open' | 'happy' | 'sleep' | 'sad'
   *   blink  0…1 (1 = Augen zu)          look  −1…1 (Blick nach links/rechts)
   *   mouth  'smile' | 'open' | 'sad' | 'o'   open 0…1 (wie weit offen)   tongue 0…1
   *   tail   Winkel in Grad (Schwanz)    ear  Winkel (Ohren / Mähne / Federn)   wing 0…1 (Flügel)
   *   tilt   Kopf neigen (Grad)          jump  Pixel nach oben      squash  −1…1 (gestaucht/gestreckt)
   *   tear   0…1 Träne läuft (0 = keine) brow  0…1 (traurige Augenbrauen)
   *   acc    { head, eyes, neck } – Zubehör als Emoji      crown  true = Krone (ausgewachsen)
   */
  const PET_KINDS = ['dog', 'cat', 'dino', 'unicorn', 'bird', 'hero', 'fairy'];

  const PET_DEFS = `
  <radialGradient id="ypShadow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#1b3d2c" stop-opacity=".32"/><stop offset="1" stop-color="#1b3d2c" stop-opacity="0"/></radialGradient>
  <radialGradient id="ypBlush" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff8fa3" stop-opacity=".7"/><stop offset="1" stop-color="#ff8fa3" stop-opacity="0"/></radialGradient>
  <radialGradient id="ypNose" cx="35%" cy="25%" r="85%"><stop offset="0" stop-color="#7b5a4f"/><stop offset=".5" stop-color="#3a2219"/><stop offset="1" stop-color="#140a06"/></radialGradient>
  <radialGradient id="ypGold" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff3bf"/><stop offset=".5" stop-color="#fcc419"/><stop offset="1" stop-color="#d98a00"/></radialGradient>
  <radialGradient id="ypTear" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#e7f5ff"/><stop offset="1" stop-color="#4dabf7"/></radialGradient>
  `;

  // Farben je Tier: f0 hell → f1 Mitte → f2 dunkel (Fell), ln = Linie, b0/b1 Bauch, ir = Iris, ac = Akzent
  const PAL = {
    dog: { f0: '#ffe1b8', f1: '#f0b06c', f2: '#c27a3c', ln: '#9a5a26', b0: '#fffdf8', b1: '#efcfa9', e0: '#9c5f30', e1: '#4f2a10', ir0: '#a86b3c', ir1: '#241205', brow: '#7a4520', col: '#c92a2a', col2: '#ff6b6b' },
    cat: { f0: '#f3f4f8', f1: '#b3b7c4', f2: '#737889', ln: '#4d5263', b0: '#ffffff', b1: '#dfe2ea', e0: '#ffc2d1', e1: '#ff8fab', ir0: '#eaff9c', ir1: '#3f7310', brow: '#2f3342', col: '#3b5bdb', col2: '#748ffc', st: '#5c6175' },
    dino: { f0: '#d8f5a2', f1: '#82c91e', f2: '#4c8a0e', ln: '#3a6b0a', b0: '#fff9db', b1: '#ffe8a3', e0: '#ff922b', e1: '#e8590c', ir0: '#ffd8a8', ir1: '#5c2b06', brow: '#2b5207', col: '#f76707', col2: '#ffa94d' },
    unicorn: { f0: '#ffffff', f1: '#f3e8ff', f2: '#c9b6e4', ln: '#8e7cc3', b0: '#ffffff', b1: '#f8f0ff', e0: '#ffd6e7', e1: '#f783ac', ir0: '#d0bfff', ir1: '#3b1f7a', brow: '#6c5aa8', col: '#f06595', col2: '#ffa8c5' },
    bird: { f0: '#d0ebff', f1: '#4dabf7', f2: '#1971c2', ln: '#1864ab', b0: '#fff9db', b1: '#ffe066', e0: '#ffd43b', e1: '#f59f00', ir0: '#a5d8ff', ir1: '#0b2f55', brow: '#124a80', col: '#e64980', col2: '#faa2c1' },
  };

  PAL.own = { f0: '#ffffff', f1: '#eeeeee', f2: '#cccccc', ln: '#4a2f2f', b0: '#ffffff', b1: '#eeeeee', e0: '#ffffff', e1: '#eeeeee', ir0: '#a86b3c', ir1: '#241205', brow: '#4a2f2f', col: '#c92a2a', col2: '#ff6b6b' };

  function petGrads(k) {
    const p = PAL[k];
    return `<radialGradient id="yp_${k}F" cx="38%" cy="26%" r="80%"><stop offset="0" stop-color="${p.f0}"/><stop offset=".55" stop-color="${p.f1}"/><stop offset="1" stop-color="${p.f2}"/></radialGradient>
  <radialGradient id="yp_${k}B" cx="50%" cy="30%" r="75%"><stop offset="0" stop-color="${p.b0}"/><stop offset="1" stop-color="${p.b1}"/></radialGradient>
  <linearGradient id="yp_${k}E" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${p.e0}"/><stop offset="1" stop-color="${p.e1}"/></linearGradient>
  <radialGradient id="yp_${k}I" cx="50%" cy="62%" r="62%"><stop offset="0" stop-color="${p.ir0}"/><stop offset=".6" stop-color="${p.ir1}" stop-opacity=".85"/><stop offset="1" stop-color="${p.ir1}"/></radialGradient>
  <radialGradient id="yp_${k}A" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${p.ln}" stop-opacity=".35"/><stop offset="1" stop-color="${p.ln}" stop-opacity="0"/></radialGradient>`;
  }

  // ---------- Gesicht ----------
  function petEye(cx, cy, rx, ry, k, o, slit) {
    const p = PAL[k];
    const st = o.eyes || 'open';
    if (st === 'happy') return `<path d="M${cx - rx} ${cy + 3} Q${cx} ${cy - ry * 1.15} ${cx + rx} ${cy + 3}" stroke="${o.lid || p.brow}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (st === 'sleep') return `<path d="M${cx - rx} ${cy} Q${cx} ${cy + ry * 0.8} ${cx + rx} ${cy}" stroke="${o.lid || p.brow}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const b = Math.min(0.95, o.blink || 0);
    const lx = (o.look || 0) * rx * 0.25;
    const pupil = slit ? `<ellipse cx="${cx + lx}" cy="${cy + 1}" rx="${rx * 0.26}" ry="${ry * 0.78}" fill="#0b0f05"/>` : `<ellipse cx="${cx + lx}" cy="${cy + 2}" rx="${rx * 0.45}" ry="${ry * 0.46}" fill="#0d0603"/>`;
    const sad = st === 'sad';
    let s = `<g transform="translate(${cx} ${cy}) scale(1 ${1 - b}) translate(${-cx} ${-cy})">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a0d05"/>
      <ellipse cx="${cx + lx}" cy="${cy + 1.5}" rx="${rx * 0.83}" ry="${ry * 0.82}" fill="url(#yp_${k}I)"/>${pupil}
      <circle cx="${cx - rx * 0.36 + lx}" cy="${cy - ry * 0.4}" r="${rx * 0.38}" fill="#fff"/><circle cx="${cx + rx * 0.36 + lx}" cy="${cy + ry * 0.42}" r="${rx * 0.17}" fill="#fff" opacity=".85"/>
      ${sad ? `<circle cx="${cx + rx * 0.1 + lx}" cy="${cy + ry * 0.55}" r="${rx * 0.3}" fill="#bfe3ff" opacity=".7"/>` : ''}</g>`;
    if (sad) s += `<path d="M${cx - rx * 1.05} ${cy - ry * 0.55} Q${cx} ${cy - ry * 1.05} ${cx + rx * 1.05} ${cy - ry * 0.55}" stroke="${p.brow}" stroke-width="2" fill="none" opacity=".5"/>`;
    return s;
  }
  function petBrows(lx, rx, y, w, k, o) {
    const p = PAL[k], s = o.brow || (o.eyes === 'sad' ? 1 : 0);
    const d = 7 * s; // innen hoch = traurig
    return `<path d="M${lx - w} ${y + d * 0.2} Q${lx} ${y - 6 + d * 0.3} ${lx + w} ${y - d}" stroke="${p.brow}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M${rx - w} ${y - d} Q${rx} ${y - 6 + d * 0.3} ${rx + w} ${y + d * 0.2}" stroke="${p.brow}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  }
  function petTear(x, y, t) {
    if (!(t > 0)) return '';
    const k = t % 1, yy = y + k * 34, sc = 0.6 + Math.min(1, k * 3) * 0.5, op = k > 0.85 ? (1 - k) / 0.15 : 1;
    return `<path d="M${x - 6} ${y - 2} Q${x} ${y + 30} ${x + 3} ${y + 34}" stroke="#74c0fc" stroke-width="3" fill="none" stroke-linecap="round" opacity="${0.55 * Math.min(1, t * 2)}"/>
      <g transform="translate(${x} ${yy}) scale(${sc})" opacity="${op}"><path d="M0 -9 C4 -3 7 1 7 5 C7 9 4 12 0 12 C-4 12 -7 9 -7 5 C-7 1 -4 -3 0 -9 Z" fill="url(#ypTear)" stroke="#339af0" stroke-width="1.2"/><ellipse cx="-2" cy="4" rx="2" ry="3" fill="#fff" opacity=".8"/></g>`;
  }
  function petMouth(cx, cy, w, k, o, opt) {
    const p = PAL[k], m = o.mouth || 'smile', ln = opt && opt.ln || '#3a2214';
    if (m === 'open' || m === 'o') {
      const h = 3 + 12 * (o.open == null ? 1 : o.open);
      return `<path d="M${cx - w * 0.55} ${cy} C${cx - w * 0.5} ${cy + h * 1.3} ${cx + w * 0.5} ${cy + h * 1.3} ${cx + w * 0.55} ${cy} Z" fill="#7a1f33" stroke="${ln}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M${cx - w * 0.3} ${cy + h * 0.9} Q${cx} ${cy + h * 0.55} ${cx + w * 0.3} ${cy + h * 0.9}" fill="#ff6b81"/>`;
    }
    if (m === 'sad') return `<path d="M${cx - w * 0.6} ${cy + 8} Q${cx} ${cy - 1} ${cx + w * 0.6} ${cy + 8}" stroke="${ln}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    let s = `<path d="M${cx} ${cy - 5} L${cx} ${cy} M${cx} ${cy} C${cx - 4} ${cy + 8} ${cx - w + 4} ${cy + 8} ${cx - w} ${cy + 2} M${cx} ${cy} C${cx + 4} ${cy + 8} ${cx + w - 4} ${cy + 8} ${cx + w} ${cy + 2}" stroke="${ln}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    if (o.tongue > 0) s += `<path d="M${cx - 8} ${cy + 6} C${cx - 9} ${cy + 6 + 16 * o.tongue} ${cx + 9} ${cy + 6 + 16 * o.tongue} ${cx + 8} ${cy + 6} Z" fill="#ff6b81" stroke="#c2255c" stroke-width="1.3"/><path d="M${cx} ${cy + 7} L${cx} ${cy + 5 + 12 * o.tongue}" stroke="#c2255c" stroke-width="1.1"/>`;
    return s;
  }
  const blush = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="9" fill="url(#ypBlush)"/>`;
  const shine = (d) => `<path d="${d}" stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity=".5"/>`;
  function collar(k, y) {
    const p = PAL[k];
    return `<path d="M90 ${y} Q130 ${y + 19} 170 ${y}" stroke="${p.col}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M90 ${y - 2} Q130 ${y + 16} 170 ${y - 2}" stroke="${p.col2}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
     <circle cx="130" cy="${y + 16}" r="9" fill="url(#ypGold)" stroke="#d99000" stroke-width="2"/><path d="M125 ${y + 13} a6 6 0 0 1 7 -3" stroke="#fff8d6" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  }

  // ---------- Tiere: liefern { back, body, head } (Kopf um den Hals 130/150) ----------
  const ANIMAL = {};
  ANIMAL.dog = (o) => {
    const k = 'dog', p = PAL[k], F = `url(#yp_${k}F)`, B = `url(#yp_${k}B)`;
    const back = `<g transform="rotate(${o.tail || 0} 84 182)"><path d="M84 196 C46 190 36 150 52 126 C58 119 68 122 65 131 C56 154 64 174 88 181 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
      <path d="M52 128 C56 120 68 122 65 131 C63 136 60 139 56 138 C52 136 51 132 52 128 Z" fill="#fff3e2"/></g>`;
    const body = `<path d="M70 202 C66 162 96 140 130 140 C164 140 194 162 190 202 C188 226 166 236 130 236 C94 236 72 226 70 202 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M104 168 L110 160 L116 168 L122 158 L130 167 L138 158 L144 168 L150 160 L156 168 C160 190 156 222 130 226 C104 222 100 190 104 168 Z" fill="${B}"/>
     <ellipse cx="130" cy="156" rx="58" ry="14" fill="url(#yp_${k}A)"/>
     <g stroke="${p.ln}" stroke-width="2" fill="${F}"><path d="M82 228 C82 216 94 212 104 212 C116 212 124 218 124 228 C124 236 114 240 103 240 C92 240 82 236 82 228 Z"/><path d="M136 228 C136 218 144 212 156 212 C166 212 178 216 178 228 C178 236 168 240 157 240 C146 240 136 236 136 228 Z"/></g>
     <path d="M96 232 l0 6 M104 233 l0 6 M112 232 l0 6 M148 232 l0 6 M156 233 l0 6 M164 232 l0 6" stroke="${p.ln}" stroke-width="1.6" stroke-linecap="round"/>
     ${o.collar === false ? '' : collar(k, 151)}
     <path d="M186 160 C192 176 192 196 186 214" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>`;
    const e = o.ear || 0;
    const head = `<g transform="rotate(${e} 80 72)"><path d="M80 68 C52 64 42 108 54 138 C60 152 80 148 85 131 C91 108 97 80 80 68 Z" fill="url(#yp_${k}E)" stroke="#4a260c" stroke-width="2"/><path d="M74 80 C62 84 58 112 64 132" stroke="#b8763f" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/></g>
     <g transform="rotate(${-e} 180 72)"><path d="M180 68 C208 64 218 108 206 138 C200 152 180 148 175 131 C169 108 163 80 180 68 Z" fill="url(#yp_${k}E)" stroke="#4a260c" stroke-width="2"/><path d="M186 80 C198 84 202 112 196 132" stroke="#b8763f" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/></g>
     <path d="M130 42 C178 42 196 74 195 102 C200 108 198 116 192 118 C196 124 192 132 186 132 C178 148 158 158 130 158 C102 158 82 148 74 132 C68 132 64 124 68 118 C62 116 60 108 65 102 C64 74 82 42 130 42 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M116 46 C118 32 128 30 132 42 C136 32 146 34 144 48" fill="${F}" stroke="${p.ln}" stroke-width="2" stroke-linejoin="round"/>
     <path d="M150 66 C172 62 184 82 178 100 C170 108 152 102 147 91 C143 80 143 71 150 66 Z" fill="#a8612b" opacity=".45"/>
     <path d="M98 124 C98 104 114 98 130 98 C146 98 162 104 162 124 C162 143 147 152 130 152 C113 152 98 143 98 124 Z" fill="${B}"/>
     ${petEye(105, 97, 14, 16, k, o)}${petEye(155, 97, 14, 16, k, o)}${petBrows(103, 157, 72, 13, k, o)}
     <path d="M119 113 C119 106 141 106 141 113 C141 122 134 127 130 127 C126 127 119 122 119 113 Z" fill="url(#ypNose)"/><ellipse cx="125" cy="111" rx="4.5" ry="2.3" fill="#fff" opacity=".65"/>
     ${petMouth(130, 133, 19, k, o)}
     <g fill="#b07a4c" opacity=".55"><circle cx="112" cy="128" r="1.3"/><circle cx="116" cy="132" r="1.3"/><circle cx="148" cy="128" r="1.3"/><circle cx="144" cy="132" r="1.3"/></g>
     ${blush(86, 122)}${blush(174, 122)}${shine('M94 58 C106 49 122 46 134 48')}
     ${petTear(98, 112, o.tear)}`;
    return { back, body, head, top: 36, eyeY: 97, neck: 152 };
  };
  ANIMAL.cat = (o) => {
    const k = 'cat', p = PAL[k], F = `url(#yp_${k}F)`, B = `url(#yp_${k}B)`;
    const back = `<g transform="rotate(${o.tail || 0} 176 206)"><path d="M176 216 C226 216 234 168 214 148 C206 140 194 146 202 158 C214 178 204 198 178 198 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M204 152 l8 3 M212 166 l9 1 M210 182 l9 -2 M198 196 l6 -6" stroke="${p.st}" stroke-width="3.5" stroke-linecap="round"/></g>`;
    const body = `<path d="M76 206 C72 166 98 146 130 146 C162 146 188 166 184 206 C182 228 162 236 130 236 C98 236 78 228 76 206 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M84 178 l12 4 M82 194 l12 2 M176 178 l-12 4 M178 194 l-12 2" stroke="${p.st}" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>
     <path d="M108 172 L114 164 L120 172 L126 162 L130 170 L134 162 L140 172 L146 164 L152 172 C154 196 150 224 130 228 C110 224 106 196 108 172 Z" fill="${B}"/>
     <ellipse cx="130" cy="158" rx="56" ry="13" fill="url(#yp_${k}A)"/>
     <g stroke="${p.ln}" stroke-width="2" fill="${B}"><path d="M88 230 C88 220 96 216 106 216 C116 216 124 220 124 230 C124 237 116 240 106 240 C96 240 88 237 88 230 Z"/><path d="M136 230 C136 220 144 216 154 216 C164 216 172 220 172 230 C172 237 164 240 154 240 C144 240 136 237 136 230 Z"/></g>
     <path d="M100 233 l0 6 M106 234 l0 6 M112 233 l0 6 M148 233 l0 6 M154 234 l0 6 M160 233 l0 6" stroke="#9aa0b0" stroke-width="1.5" stroke-linecap="round"/>
     ${o.collar === false ? '' : collar(k, 156)}
     <path d="M182 166 C188 182 186 200 180 214" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>`;
    const e = o.ear || 0;
    const head = `<g transform="rotate(${-e * 0.6} 96 86)"><path d="M70 36 L80 106 L120 64 Z" fill="${F}" stroke="${p.ln}" stroke-width="2" stroke-linejoin="round"/><path d="M79 54 L86 94 L107 70 Z" fill="${p.e0}"/><path d="M82 62 l4 12 M86 58 l2 12" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/></g>
     <g transform="rotate(${e * 0.6} 164 86)"><path d="M190 36 L180 106 L140 64 Z" fill="${F}" stroke="${p.ln}" stroke-width="2" stroke-linejoin="round"/><path d="M181 54 L174 94 L153 70 Z" fill="${p.e0}"/><path d="M178 62 l-4 12 M174 58 l-2 12" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/></g>
     <path d="M130 54 C176 54 196 82 195 108 C202 114 200 124 193 125 C198 132 192 140 185 138 C176 152 156 160 130 160 C104 160 84 152 75 138 C68 140 62 132 67 125 C60 124 58 114 65 108 C64 82 84 54 130 54 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M116 58 l5 18 M130 56 l0 20 M144 58 l-5 18" stroke="${p.st}" stroke-width="4" stroke-linecap="round"/>
     <path d="M70 112 l10 2 M72 120 l9 0 M190 112 l-10 2 M188 120 l-9 0" stroke="${p.st}" stroke-width="3" stroke-linecap="round"/>
     <path d="M100 124 C100 110 114 104 130 104 C146 104 160 110 160 124 C160 142 146 152 130 152 C114 152 100 142 100 124 Z" fill="${B}"/>
     ${petEye(105, 102, 15, 17, k, o, true)}${petEye(155, 102, 15, 17, k, o, true)}
     ${o.eyes === 'open' || !o.eyes || o.eyes === 'sad' ? `<path d="M89 98 l-6 -4 M171 98 l6 -4" stroke="${p.brow}" stroke-width="2" stroke-linecap="round"/>` : ''}
     ${o.eyes === 'sad' || o.brow ? petBrows(105, 155, 80, 12, k, o) : ''}
     <path d="M123 120 L137 120 C137 124 133 128 130 129 C127 128 123 124 123 120 Z" fill="#ff8fa3" stroke="#c2255c" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="127.5" cy="121.5" rx="2.5" ry="1.2" fill="#fff" opacity=".7"/>
     ${petMouth(130, 132, 15, k, o, { ln: '#3b3f4c' })}
     <g stroke="#3b3f4c" stroke-width="1.4" stroke-linecap="round" opacity=".65"><path d="M104 128 C88 124 74 122 60 122 M104 134 C88 134 74 137 60 140 M156 128 C172 124 186 122 200 122 M156 134 C172 134 186 137 200 140"/></g>
     ${blush(88, 128)}${blush(172, 128)}${shine('M96 68 C108 60 122 58 134 60')}
     ${petTear(97, 118, o.tear)}`;
    return { back, body, head, top: 40, eyeY: 102, neck: 156 };
  };
  ANIMAL.dino = (o) => {
    const k = 'dino', p = PAL[k], F = `url(#yp_${k}F)`, B = `url(#yp_${k}B)`;
    const back = `<g transform="rotate(${o.tail || 0} 172 210)"><path d="M168 220 C206 226 238 214 246 192 C248 186 242 184 238 188 C224 204 200 204 172 196 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
      <path d="M200 208 l4 -10 l6 9 M218 206 l4 -10 l6 8" fill="#ffa94d" stroke="${p.ln}" stroke-width="1.5" stroke-linejoin="round"/></g>`;
    const body = `<path d="M72 204 C68 164 98 140 130 140 C164 140 192 164 188 204 C186 228 166 236 130 236 C96 236 74 228 72 204 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M106 166 C112 160 148 160 154 166 C160 192 154 224 130 228 C106 224 100 192 106 166 Z" fill="${B}"/>
     <path d="M108 178 Q130 184 152 178 M106 194 Q130 200 154 194 M108 210 Q130 216 152 210" stroke="#f0c36b" stroke-width="2" fill="none"/>
     <ellipse cx="130" cy="154" rx="56" ry="13" fill="url(#yp_${k}A)"/>
     <g fill="${p.f2}" opacity=".35"><circle cx="86" cy="184" r="6"/><circle cx="92" cy="204" r="4"/><circle cx="176" cy="186" r="5"/><circle cx="170" cy="206" r="4"/></g>
     <g stroke="${p.ln}" stroke-width="2" fill="${F}"><path d="M98 172 C88 174 84 184 90 188 C96 190 102 184 104 178 Z"/><path d="M162 172 C172 174 176 184 170 188 C164 190 158 184 156 178 Z"/></g>
     <g stroke="${p.ln}" stroke-width="2" fill="${F}"><path d="M80 230 C80 216 92 212 104 212 C118 212 126 218 126 230 C126 237 116 240 103 240 C90 240 80 237 80 230 Z"/><path d="M134 230 C134 218 142 212 156 212 C168 212 180 216 180 230 C180 237 170 240 157 240 C144 240 134 237 134 230 Z"/></g>
     <g fill="#fff9db" stroke="${p.ln}" stroke-width="1.2"><path d="M88 236 l3 5 l3 -5 Z M100 237 l3 5 l3 -5 Z M112 236 l3 5 l3 -5 Z M142 236 l3 5 l3 -5 Z M154 237 l3 5 l3 -5 Z M166 236 l3 5 l3 -5 Z"/></g>
     <path d="M184 166 C190 182 190 200 184 214" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>`;
    const e = o.ear || 0;
    const spikes = [[104, 50, -18], [130, 40, 0], [156, 50, 18], [176, 70, 36]].map(([x, y, r], i) => `<path transform="rotate(${r + e * (i % 2 ? 1 : -1) * 0.5} ${x} ${y + 10})" d="M${x - 11} ${y + 12} L${x} ${y - 10} L${x + 11} ${y + 12} Z" fill="url(#yp_${k}E)" stroke="${p.ln}" stroke-width="2" stroke-linejoin="round"/>`).join('');
    const head = `${spikes}
     <path d="M130 50 C178 50 198 80 196 110 C194 142 168 160 130 160 C92 160 66 142 64 110 C62 80 82 50 130 50 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <g fill="${p.f2}" opacity=".3"><circle cx="82" cy="96" r="6"/><circle cx="90" cy="80" r="4"/><circle cx="178" cy="92" r="5"/></g>
     <path d="M96 128 C96 112 112 108 130 108 C148 108 164 112 164 128 C164 146 148 154 130 154 C112 154 96 146 96 128 Z" fill="${B}"/>
     <ellipse cx="122" cy="118" rx="3" ry="2" fill="${p.ln}"/><ellipse cx="138" cy="118" rx="3" ry="2" fill="${p.ln}"/>
     ${petEye(104, 98, 15, 17, k, o)}${petEye(156, 98, 15, 17, k, o)}${o.eyes === 'sad' || o.brow ? petBrows(104, 156, 72, 13, k, o) : ''}
     ${petMouth(130, 134, 22, k, o, { ln: '#2b5207' })}
     ${o.mouth === 'smile' || !o.mouth ? `<path d="M119 137 l3 5 l3 -4 M135 137 l3 4 l3 -5" fill="#fff" stroke="#2b5207" stroke-width="1"/>` : ''}
     ${blush(84, 126)}${blush(176, 126)}${shine('M94 66 C106 57 122 54 134 56')}
     ${petTear(97, 114, o.tear)}`;
    return { back, body, head, top: 30, eyeY: 98, neck: 154 };
  };
  ANIMAL.unicorn = (o) => {
    const k = 'unicorn', p = PAL[k], F = `url(#yp_${k}F)`, B = `url(#yp_${k}B)`;
    const RB = ['#ff8fab', '#ffc078', '#ffe066', '#8ce99a', '#74c0fc', '#b197fc'];
    const back = `<g transform="rotate(${o.tail || 0} 182 196)">${RB.map((c, i) => `<path d="M182 ${200 + i * 2} C${214 + i * 3} ${196 - i * 4} ${222 + i * 2} ${170 - i * 6} ${206 + i * 2} ${150 - i * 4}" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
    const body = `<path d="M74 204 C70 164 98 142 130 142 C162 142 190 164 186 204 C184 228 164 236 130 236 C96 236 76 228 74 204 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M108 170 C114 162 146 162 152 170 C156 194 150 222 130 226 C110 222 104 194 108 170 Z" fill="${B}"/>
     <ellipse cx="130" cy="156" rx="56" ry="13" fill="url(#yp_${k}A)"/>
     <g stroke="${p.ln}" stroke-width="2" fill="${F}"><path d="M86 230 C86 218 94 212 106 212 C118 212 124 218 124 230 L124 234 L86 234 Z"/><path d="M136 230 C136 218 142 212 154 212 C166 212 174 218 174 230 L174 234 L136 234 Z"/></g>
     <g fill="#b197fc" stroke="${p.ln}" stroke-width="2"><rect x="86" y="230" width="38" height="10" rx="4"/><rect x="136" y="230" width="38" height="10" rx="4"/></g>
     ${o.collar === false ? '' : collar(k, 154)}
     <g fill="#ffd43b"><path d="M92 196 l2 5 l5 1 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -1 Z"/><path d="M168 188 l1.5 4 l4 1 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1 Z"/></g>
     <path d="M182 166 C188 182 188 200 182 214" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".5"/>`;
    const e = o.ear || 0;
    const mane = RB.map((c, i) => `<path d="M${150 + i * 6} ${48 + i * 3} C${178 + i * 4} ${56 + i * 6} ${190 + i * 2} ${90 + i * 6} ${184 + i * 3 + e * 0.4} ${126 + i * 6}" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('');
    const head = `<g transform="rotate(${-e * 0.5} 96 70)"><path d="M84 30 L84 82 L114 62 Z" fill="${F}" stroke="${p.ln}" stroke-width="2" stroke-linejoin="round"/><path d="M90 44 L90 74 L106 64 Z" fill="${p.e0}"/></g>
     <g transform="rotate(${e * 0.5} 164 70)"><path d="M176 30 L176 82 L146 62 Z" fill="${F}" stroke="${p.ln}" stroke-width="2" stroke-linejoin="round"/><path d="M170 44 L170 74 L154 64 Z" fill="${p.e0}"/></g>
     ${mane}
     <path d="M130 52 C176 52 196 80 195 108 C194 140 166 158 130 158 C94 158 66 140 65 108 C64 80 84 52 130 52 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     ${RB.slice(0, 4).map((c, i) => `<path d="M${100 + i * 10} ${54 + i * 1} C${96 + i * 10} ${68} ${102 + i * 9} ${76} ${110 + i * 9} ${80}" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')}
     <g><path d="M120 54 L130 4 L140 54 Z" fill="url(#ypGold)" stroke="#d99000" stroke-width="2" stroke-linejoin="round"/><path d="M123 42 L137 36 M125 30 L135 25 M127 18 L133 15" stroke="#d99000" stroke-width="2" stroke-linecap="round"/>
       <path d="M128 10 L130 4 L132 10" stroke="#fff" stroke-width="2" fill="none" opacity=".9"/></g>
     <path d="M100 126 C100 112 114 106 130 106 C146 106 160 112 160 126 C160 144 146 152 130 152 C114 152 100 144 100 126 Z" fill="${B}"/>
     ${petEye(105, 100, 14, 16, k, o)}${petEye(155, 100, 14, 16, k, o)}
     ${o.eyes === 'open' || !o.eyes || o.eyes === 'sad' ? `<path d="M90 92 l-6 -5 M92 86 l-4 -6 M170 92 l6 -5 M168 86 l4 -6" stroke="${p.brow}" stroke-width="2" stroke-linecap="round"/>` : ''}
     ${o.eyes === 'sad' || o.brow ? petBrows(105, 155, 78, 12, k, o) : ''}
     <ellipse cx="122" cy="122" rx="2.6" ry="1.8" fill="${p.ln}"/><ellipse cx="138" cy="122" rx="2.6" ry="1.8" fill="${p.ln}"/>
     ${petMouth(130, 134, 15, k, o, { ln: '#6c5aa8' })}
     ${blush(86, 124)}${blush(174, 124)}${shine('M96 66 C108 58 116 56 122 56')}
     ${petTear(98, 116, o.tear)}`;
    return { back, body, head, top: 34, hx: 168, eyeY: 100, neck: 154 };
  };
  ANIMAL.bird = (o) => {
    const k = 'bird', p = PAL[k], F = `url(#yp_${k}F)`, B = `url(#yp_${k}B)`;
    const w = o.wing || 0;
    const back = `<g transform="rotate(${(o.tail || 0) * 0.5} 130 214)"><path d="M112 214 C104 236 112 248 120 244 C124 240 126 232 130 226 C134 232 136 240 140 244 C148 248 156 236 148 214 Z" fill="${p.f2}" stroke="${p.ln}" stroke-width="2"/></g>`;
    const wingL = `<g transform="rotate(${-10 - w * 55} 80 168)"><path d="M82 160 C56 160 46 190 54 214 C62 222 74 212 80 200 C88 186 92 172 82 160 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/><path d="M60 196 l12 -6 M58 206 l14 -8" stroke="${p.ln}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></g>`;
    const wingR = `<g transform="rotate(${10 + w * 55} 180 168)"><path d="M178 160 C204 160 214 190 206 214 C198 222 186 212 180 200 C172 186 168 172 178 160 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/><path d="M200 196 l-12 -6 M202 206 l-14 -8" stroke="${p.ln}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></g>`;
    const body = `<path d="M76 196 C74 160 100 146 130 146 C160 146 186 160 184 196 C182 224 160 234 130 234 C100 234 78 224 76 196 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M102 170 C110 160 150 160 158 170 C166 196 156 224 130 228 C104 224 94 196 102 170 Z" fill="${B}"/>
     <path d="M112 184 q6 5 12 0 q6 5 12 0 q6 5 12 0 M108 200 q6 5 12 0 q6 5 12 0 q6 5 12 0 q6 5 12 0" stroke="#f0c36b" stroke-width="1.8" fill="none"/>
     <ellipse cx="130" cy="158" rx="54" ry="12" fill="url(#yp_${k}A)"/>
     ${wingL}${wingR}
     <g stroke="#e8590c" stroke-width="4" stroke-linecap="round" fill="none"><path d="M110 230 L110 240 M110 240 l-8 4 M110 240 l0 6 M110 240 l8 4 M150 230 L150 240 M150 240 l-8 4 M150 240 l0 6 M150 240 l8 4"/></g>`;
    const e = o.ear || 0;
    const head = `<g transform="rotate(${e} 130 56)"><path d="M126 58 C116 40 112 26 122 20 C126 34 130 44 132 56 Z M132 56 C136 38 146 28 154 32 C146 42 140 50 136 60 Z M128 58 C126 36 132 18 140 14 C138 30 136 44 134 58 Z" fill="${p.col}" stroke="${p.ln}" stroke-width="1.6" stroke-linejoin="round"/></g>
     <path d="M130 52 C176 52 196 80 195 108 C194 140 166 158 130 158 C94 158 66 140 65 108 C64 80 84 52 130 52 Z" fill="${F}" stroke="${p.ln}" stroke-width="2"/>
     <path d="M98 122 C98 108 112 100 130 100 C148 100 162 108 162 122 C162 142 148 154 130 154 C112 154 98 142 98 122 Z" fill="${B}"/>
     ${petEye(104, 96, 14, 16, k, o)}${petEye(156, 96, 14, 16, k, o)}${petBrows(104, 156, 72, 12, k, o)}
     ${(() => { const op = o.mouth === 'open' || o.mouth === 'o' ? (o.open == null ? 1 : o.open) : 0, sad = o.mouth === 'sad';
        return `<path d="M116 ${116 + (sad ? 2 : 0)} C120 106 140 106 144 ${116 + (sad ? 2 : 0)} L130 ${128 - op * 2} Z" fill="url(#yp_${k}E)" stroke="#d9480f" stroke-width="2" stroke-linejoin="round"/>
          <path d="M118 ${119 + op * 4} L142 ${119 + op * 4} L130 ${132 + op * 10} Z" fill="url(#yp_${k}E)" stroke="#d9480f" stroke-width="2" stroke-linejoin="round"/>
          <ellipse cx="125" cy="112" rx="4" ry="2" fill="#fff" opacity=".6"/>`; })()}
     ${blush(84, 120)}${blush(176, 120)}${shine('M96 66 C108 58 122 56 134 58')}
     ${petTear(97, 112, o.tear)}`;
    return { back, body, head, top: 14, eyeY: 96, neck: 156 };
  };


  // ---------- Menschen-Figuren: Haut- und Haarfarbe wählbar ----------
  const SKIN = [['#ffe3d0', '#f7c6a5', '#d9946b'], ['#f8d2a8', '#e9b27c', '#c27c47'], ['#d9a06b', '#b97a45', '#8a5428'], ['#a86f45', '#8a5530', '#5e3518']];
  const HAIR = [['#8a5a32', '#5b3417'], ['#ffe08a', '#d9a520'], ['#4a4a55', '#1c1c24'], ['#e8743b', '#b4421a'], ['#d6b4fc', '#9c6ade']];
  function humanDefs(id, o) {
    const sk = SKIN[o.skin || 0] || SKIN[0], hr = HAIR[o.hair || 0] || HAIR[0];
    return `<radialGradient id="ypSk${id}" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${sk[0]}"/><stop offset=".6" stop-color="${sk[1]}"/><stop offset="1" stop-color="${sk[2]}"/></radialGradient>
    <linearGradient id="ypHr${id}" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="${hr[0]}"/><stop offset="1" stop-color="${hr[1]}"/></linearGradient>`;
  }
  const HERO_COL = [['#4dabf7', '#1864ab', '#ff6b6b', '#c92a2a', '#e03131'], ['#69db7c', '#2b8a3e', '#ffd43b', '#e8a600', '#2b8a3e'], ['#b197fc', '#6741d9', '#faa2c1', '#d6336c', '#d6336c'], ['#495057', '#16191d', '#ffd43b', '#e8a600', '#16191d'], ['#ff8787', '#c92a2a', '#74c0fc', '#1971c2', '#1971c2']];
  const FAIRY_COL = [['#ffdeeb', '#f783ac', '#c2255c', '#fcc2d7', '#cc5de8'], ['#e5dbff', '#9775fa', '#6741d9', '#d0bfff', '#7950f2'], ['#d3f9d8', '#51cf66', '#2b8a3e', '#b2f2bb', '#37b24d'], ['#d0ebff', '#4dabf7', '#1864ab', '#a5d8ff', '#339af0'], ['#fff3bf', '#fcc419', '#e67700', '#ffe8cc', '#f59f00']];
  PAL.hero = { brow: '#3b2a20', ir0: '#9bc7ff', ir1: '#123a73', ln: '#1c3d7a' };
  PAL.fairy = { brow: '#5b3a6e', ir0: '#f3c4ff', ir1: '#5a1f7a', ln: '#a64ca6' };
  const humanIris = (k) => `<radialGradient id="yp_${k}I" cx="50%" cy="62%" r="62%"><stop offset="0" stop-color="${PAL[k].ir0}"/><stop offset=".6" stop-color="${PAL[k].ir1}" stop-opacity=".85"/><stop offset="1" stop-color="${PAL[k].ir1}"/></radialGradient>`;

  ANIMAL.hero = (o) => {
    const k = 'hero', id = `${o.skin || 0}${o.hair || 0}`, SK = `url(#ypSk${id})`, HR = `url(#ypHr${id})`, g = o.g == null ? 1 : o.g;
    const ci = HERO_COL[o.col || 0] ? o.col || 0 : 0, HC = HERO_COL[ci];
    const pro = g >= 0.45, cw = o.tail || 0; // Umhang weht
    const suit = pro ? `url(#ypSuit${ci})` : 'url(#ypHood)';
    const capeY = 196 + 40 * g;
    const back = `<path d="M100 150 C${86 + cw * 0.4} ${180} ${70 + cw} ${capeY - 20} ${64 + cw * 1.2} ${capeY} Q${97 + cw} ${capeY - 8 + Math.sin(cw / 9) * 6} ${130 + cw * 0.6} ${capeY + 2} Q${163 + cw * 0.4} ${capeY - 8 - Math.sin(cw / 9) * 6} ${196 + cw * 0.3} ${capeY} C${190} ${capeY - 20} ${174} ${180} 160 150 Z" fill="url(#ypCape${ci})" stroke="${HC[3]}" stroke-width="2" stroke-linejoin="round"/>`;
    const arm = (sx) => `<path d="M${130 + sx * 30} 158 C${130 + sx * 50} 166 ${130 + sx * 52} 186 ${130 + sx * 34} 196" stroke="${suit}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M${130 + sx * 30} 158 C${130 + sx * 50} 166 ${130 + sx * 52} 186 ${130 + sx * 34} 196" stroke="#1c3d7a" stroke-width="1.5" fill="none" opacity=".35"/>
      <circle cx="${130 + sx * 33}" cy="197" r="9" fill="${pro ? HC[2] : SK}" stroke="${pro ? HC[3] : '#b97a45'}" stroke-width="2"/>`;
    const body = `${arm(-1)}${arm(1)}
     <g stroke="#1c3d7a" stroke-width="2"><rect x="110" y="196" width="16" height="30" rx="7" fill="${suit}"/><rect x="134" y="196" width="16" height="30" rx="7" fill="${suit}"/></g>
     <g stroke="#7a1010" stroke-width="2"><path d="M106 220 C106 212 128 212 128 220 L128 236 L104 236 C102 236 102 226 106 220 Z" fill="${pro ? HC[2] : '#f8f9fa'}"/><path d="M154 220 C154 212 132 212 132 220 L132 236 L156 236 C158 236 158 226 154 220 Z" fill="${pro ? HC[2] : '#f8f9fa'}"/></g>
     ${pro ? '' : `<path d="M104 232 L128 232 M132 232 L156 232" stroke="#4dabf7" stroke-width="3"/>`}
     <path d="M98 154 C98 146 162 146 162 154 L156 204 C156 208 104 208 104 204 Z" fill="${suit}" stroke="#1c3d7a" stroke-width="2"/>
     <rect x="102" y="194" width="56" height="9" rx="4" fill="#fcc419" stroke="#d99000" stroke-width="1.5"/><rect x="124" y="192" width="12" height="13" rx="3" fill="url(#ypGold)" stroke="#d99000" stroke-width="1.5"/>
     ${pro ? `<circle cx="130" cy="172" r="15" fill="url(#ypGold)" stroke="#d99000" stroke-width="2"/><path d="M130 161 l3.5 7 l7.5 1 l-5.5 5 l1.5 7.5 l-7 -3.5 l-7 3.5 l1.5 -7.5 l-5.5 -5 l7.5 -1 Z" fill="${HC[4]}"/>` : `<path d="M116 160 Q130 170 144 160" stroke="#adb5bd" stroke-width="3" fill="none"/><circle cx="130" cy="176" r="7" fill="#e9ecef" stroke="#adb5bd" stroke-width="2"/>`}
     <path d="M156 160 C160 176 160 190 156 200" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/>`;
    const e = o.ear || 0;
    const tail = o.hs === 1 ? `<g transform="rotate(${(o.tail || 0) * 0.4 + e * 0.5} 172 74)"><path d="M168 70 C196 66 206 92 200 122 C196 140 186 150 178 156 C184 136 186 112 174 96 Z" fill="${HR}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/></g><circle cx="172" cy="72" r="7" fill="${HC[2]}" stroke="${HC[3]}" stroke-width="1.5"/>` : '';
    const head = `${o.hs === 1 ? `<path d="M80 98 C78 120 82 138 92 146 L168 146 C178 138 182 120 180 98 Z" fill="${HR}"/>` : ''}${tail}<circle cx="80" cy="104" r="11" fill="${SK}" stroke="#b97a45" stroke-width="1.5"/><circle cx="180" cy="104" r="11" fill="${SK}" stroke="#b97a45" stroke-width="1.5"/>
     <circle cx="130" cy="100" r="50" fill="${SK}" stroke="#b97a45" stroke-width="2"/>
     <path d="M80 96 C76 58 104 44 130 44 C160 44 186 60 180 98 C172 82 160 74 148 72 C136 80 116 82 104 76 C94 80 86 88 80 96 Z" fill="${HR}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>
     ${o.hs === 1 ? `<path d="M84 96 C90 74 108 66 126 70 C116 78 110 86 108 92 C120 80 140 76 156 80 C148 84 144 90 142 94 C156 86 170 88 178 96 C176 70 156 50 130 50 C104 50 84 66 84 96 Z" fill="${HR}"/>` : `<g transform="rotate(${e * 0.6} 128 56)"><path d="M112 54 C116 34 132 28 140 36 C132 38 128 46 130 56 C140 44 152 44 156 52 C146 52 140 58 140 64 Z" fill="${HR}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/></g>`}
     ${g >= 0.2 ? `<path d="M82 92 C100 84 160 84 178 92 L176 112 C162 106 98 106 84 112 Z" fill="#1c3d7a" stroke="#0b1d3e" stroke-width="1.5"/><path d="M84 100 L72 94 L76 104 Z M176 100 L188 94 L184 104 Z" fill="#1c3d7a"/>` : ''}
     ${g >= 0.2 && (!o.eyes || o.eyes === 'open' || o.eyes === 'sad') ? `<ellipse cx="108" cy="100" rx="17" ry="18" fill="#fff"/><ellipse cx="152" cy="100" rx="17" ry="18" fill="#fff"/>` : ''}${petEye(108, 100, 13, 15, k, g >= 0.2 ? { ...o, lid: '#fff' } : o)}${petEye(152, 100, 13, 15, k, g >= 0.2 ? { ...o, lid: '#fff' } : o)}${petBrows(108, 152, 80, 12, k, o)}
     <path d="M126 112 Q130 116 134 112" stroke="#b97a45" stroke-width="2" fill="none" stroke-linecap="round"/>
     ${petMouth(130, 124, 13, k, o, { ln: '#7a3b22' })}
     ${blush(92, 120)}${blush(168, 120)}${shine('M98 62 C110 52 122 50 132 50')}
     ${petTear(100, 114, o.tear)}`;
    const defs = `${humanDefs(id, o)}${humanIris(k)}<linearGradient id="ypSuit${ci}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${HC[0]}"/><stop offset="1" stop-color="${HC[1]}"/></linearGradient>
     <linearGradient id="ypHood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ced4da"/><stop offset="1" stop-color="#868e96"/></linearGradient>
     <linearGradient id="ypCape${ci}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${HC[2]}"/><stop offset="1" stop-color="${HC[3]}"/></linearGradient>`;
    return { back, body, head, top: 40, eyeY: 100, neck: 150, defs };
  };

  ANIMAL.fairy = (o) => {
    const k = 'fairy', id = `${o.skin || 0}${o.hair || 0}`, SK = `url(#ypSk${id})`, HR = `url(#ypHr${id})`, g = o.g == null ? 1 : o.g;
    const ci = FAIRY_COL[o.col || 0] ? o.col || 0 : 0, FC = FAIRY_COL[ci];
    const w = o.wing || 0, ws = 0.7 + 0.4 * g;
    const wing = (sx, rx, ry, cx, cy, rot) => `<g transform="translate(130 160) rotate(${sx * (-w * 22)}) scale(${sx * ws} ${ws}) translate(-130 -160)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="url(#ypWing${ci})" stroke="${FC[4]}" stroke-width="2" opacity=".9"/>
      <circle cx="${cx - 6}" cy="${cy - 4}" r="2.5" fill="#fff"/><circle cx="${cx + 8}" cy="${cy + 6}" r="1.8" fill="#fff"/></g>`;
    const back = `${wing(1, 30, 46, 170, 126, 35)}${wing(1, 20, 30, 166, 184, -30)}${wing(-1, 30, 46, 170, 126, 35)}${wing(-1, 20, 30, 166, 184, -30)}
     <path d="M90 104 C78 140 86 176 104 188 L156 188 C174 176 182 140 170 104 Z" fill="${HR}"/>`;
    const wand = g >= 0.3 ? `<path d="M168 168 L188 124" stroke="#ae3ec9" stroke-width="4" stroke-linecap="round"/><path d="M188 104 l5 10 l11 1.5 l-8 7.5 l2 11 l-10 -5.5 l-10 5.5 l2 -11 l-8 -7.5 l11 -1.5 Z" fill="url(#ypGold)" stroke="#d99000" stroke-width="1.5" stroke-linejoin="round"/>` : '';
    const body = `<g stroke="#b197fc" stroke-width="2"><rect x="114" y="206" width="12" height="24" rx="6" fill="${SK}"/><rect x="134" y="206" width="12" height="24" rx="6" fill="${SK}"/></g>
     <g fill="${FC[1]}" stroke="${FC[2]}" stroke-width="1.5"><ellipse cx="118" cy="233" rx="11" ry="6"/><ellipse cx="142" cy="233" rx="11" ry="6"/></g>
     <path d="M98 214 C100 196 112 180 130 180 C148 180 160 196 162 214 Q154 208 146 216 Q138 208 130 216 Q122 208 114 216 Q106 208 98 214 Z" fill="url(#ypDress${ci})" stroke="${FC[2]}" stroke-width="2" stroke-linejoin="round"/>
     <path d="M112 152 C112 146 148 146 148 152 L144 184 L116 184 Z" fill="url(#ypDress${ci})" stroke="${FC[2]}" stroke-width="2"/>
     <path d="M118 158 Q130 166 142 158" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>
     <g fill="#fff" opacity=".9"><circle cx="112" cy="200" r="2"/><circle cx="146" cy="196" r="2"/><circle cx="130" cy="206" r="1.6"/></g>
     <path d="M114 156 C100 166 98 180 104 190" stroke="${SK}" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="104" cy="191" r="6.5" fill="${SK}"/>
     <path d="M146 156 C158 162 164 166 168 168" stroke="${SK}" stroke-width="11" fill="none" stroke-linecap="round"/>${wand}<circle cx="168" cy="168" r="6.5" fill="${SK}"/>`;
    const e = o.ear || 0;
    const flowers = g >= 0.3 && !o.crown ? [[96, 66], [112, 54], [130, 50], [148, 54], [164, 66]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-5" rx="3.6" ry="5.5" fill="${['#ff8fab', '#ffd43b', '#b197fc', '#74c0fc', '#8ce99a'][i]}" transform="rotate(${r})"/>`).join('')}<circle r="2.6" fill="#fff3bf"/></g>`).join('') : '';
    const head = `<path d="M84 108 L70 88 L90 98 Z M176 108 L190 88 L170 98 Z" fill="${SK}" stroke="#b97a45" stroke-width="1.5" stroke-linejoin="round"/>
     <circle cx="130" cy="104" r="48" fill="${SK}" stroke="#b97a45" stroke-width="2"/>
     <g transform="rotate(${e * 0.4} 130 60)"><path d="M82 104 C78 62 104 52 130 52 C156 52 182 62 178 104 C170 88 156 78 140 76 C134 84 118 86 106 80 C96 86 88 94 82 104 Z" fill="${HR}" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/>
     <path d="M120 54 C116 42 124 34 132 38" stroke="${HR}" stroke-width="8" fill="none" stroke-linecap="round"/></g>
     ${flowers}
     ${petEye(110, 104, 13, 15, k, o)}${petEye(150, 104, 13, 15, k, o)}
     ${o.eyes === 'open' || !o.eyes || o.eyes === 'sad' ? `<path d="M96 98 l-6 -5 M98 92 l-4 -6 M164 98 l6 -5 M162 92 l4 -6" stroke="${PAL[k].brow}" stroke-width="2" stroke-linecap="round"/>` : ''}
     ${o.eyes === 'sad' || o.brow ? petBrows(110, 150, 84, 11, k, o) : ''}
     <path d="M127 116 Q130 119 133 116" stroke="#b97a45" stroke-width="2" fill="none" stroke-linecap="round"/>
     ${petMouth(130, 127, 12, k, o, { ln: '#8a3b5c' })}
     ${blush(94, 122)}${blush(166, 122)}${shine('M100 66 C110 58 120 56 128 56')}
     <g fill="#fff"><path d="M70 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" opacity="${0.5 + 0.5 * Math.abs(Math.sin((o.t || 0) * 3))}"/><path d="M196 74 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" opacity="${0.5 + 0.5 * Math.abs(Math.cos((o.t || 0) * 3))}"/></g>
     ${petTear(102, 118, o.tear)}`;
    const defs = `${humanDefs(id, o)}${humanIris(k)}<radialGradient id="ypWing${ci}" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".5" stop-color="#f3f0ff" stop-opacity=".8"/><stop offset="1" stop-color="${FC[3]}" stop-opacity=".75"/></radialGradient>
     <linearGradient id="ypDress${ci}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${FC[0]}"/><stop offset="1" stop-color="${FC[1]}"/></linearGradient>`;
    return { back, body, head, top: 44, eyeY: 104, neck: 152, defs };
  };

  // 🌷 Knospe der Fee (statt Ei): open 0…1 = Blüte geht auf
  function petBud(o = {}) {
    const op = o.open || 0, wob = o.wob || 0, W = o.w || 260;
    const pet = (r, c) => `<path d="M0 0 C-16 -18 -18 -52 0 -70 C18 -52 16 -18 0 0 Z" fill="${c}" stroke="#c2255c" stroke-width="2" transform="rotate(${r})"/>`;
    return `<svg viewBox="0 0 260 260" width="${W}" height="${o.h || W}" overflow="visible"><defs>${PET_DEFS}</defs>
     <ellipse cx="130" cy="240" rx="70" ry="12" fill="url(#ypShadow)"/>
     <path d="M90 236 C90 214 170 214 170 236 Z" fill="#8ce99a" stroke="#2f9e44" stroke-width="2"/>
     <g transform="rotate(${wob} 130 230)"><path d="M130 232 C128 200 132 176 130 150" stroke="#2f9e44" stroke-width="6" fill="none" stroke-linecap="round"/>
     <path d="M130 206 C110 196 96 200 92 212 C108 216 120 214 130 206 Z" fill="#69db7c" stroke="#2f9e44" stroke-width="2"/><path d="M130 192 C150 180 166 184 170 196 C154 200 142 198 130 192 Z" fill="#69db7c" stroke="#2f9e44" stroke-width="2"/>
     <g transform="translate(130 154)">${pet(-12 - op * 40, '#f783ac')}${pet(12 + op * 40, '#f783ac')}${pet(0, '#ffa8c5')}</g>
     <path d="M118 120 C124 108 130 106 134 106" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/></g></svg>`;
  }


  // 📦 Heldenkiste (statt Ei): open 0…1 = Deckel fliegt weg
  function petBox(o = {}) {
    const op = o.open || 0, wob = o.wob || 0, W = o.w || 260, cr = o.crack || 0;
    const lid = `<g transform="translate(${130 + 70 * op} ${148 - 140 * op + 220 * op * op}) rotate(${60 * op})" opacity="${1 - Math.max(0, (op - 0.7) / 0.3)}"><rect x="-62" y="-16" width="124" height="28" rx="6" fill="url(#ypBoxL)" stroke="#1864ab" stroke-width="2.5"/><rect x="-10" y="-16" width="20" height="28" fill="#ffd43b" stroke="#e8a600" stroke-width="2"/></g>`;
    const bodyB = `<rect x="74" y="160" width="112" height="76" rx="8" fill="url(#ypBoxB)" stroke="#1864ab" stroke-width="2.5"/><rect x="120" y="160" width="20" height="76" fill="#ffd43b" stroke="#e8a600" stroke-width="2"/>
      <circle cx="130" cy="200" r="20" fill="url(#ypGold)" stroke="#d99000" stroke-width="2"/><path d="M130 187 l4 8 l9 1 l-6.5 6 l2 9 l-8.5 -4.5 l-8.5 4.5 l2 -9 l-6.5 -6 l9 -1 Z" fill="#e03131"/>
      ${cr > 0 ? `<path d="M80 168 l10 6 l8 -5 l10 6" stroke="#fff" stroke-width="2.5" fill="none" opacity="${cr}"/>` : ''}`;
    const defs = `${PET_DEFS}<linearGradient id="ypBoxB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#74c0fc"/><stop offset="1" stop-color="#1c7ed6"/></linearGradient><linearGradient id="ypBoxL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a5d8ff"/><stop offset="1" stop-color="#4dabf7"/></linearGradient>`;
    if (o.parts) return { defs, back: '', front: `<g transform="rotate(${wob} 130 236)">${bodyB}</g>${lid}` };
    return `<svg viewBox="0 0 260 260" width="${W}" height="${o.h || W}" overflow="visible"><defs>${defs}</defs><ellipse cx="130" cy="240" rx="70" ry="12" fill="url(#ypShadow)"/><g transform="rotate(${wob} 130 236)">${bodyB}${lid}</g></svg>`;
  }


  // 🎨 Eigene Haustiere (KI-erzeugt, als JSON eingefügt): Teile liegen im 200er-Raster, die Karte rechnet sie
  // ins 260er-Raster der eingebauten Tiere um und zeichnet Augen, Mund, Wangen und Träne selbst an den Ankerpunkten.
  const OWNDEF = {};
  function ownAnimal(d) {
    return (o) => {
      const P = d.parts || {}, A = d.an || {}, M = (q) => [10 + q[0] * 1.2, 14 + q[1] * 1.2];
      const W = (x) => (x ? `<g transform="translate(10 14) scale(1.2)">${x}</g>` : '');
      const [tx, ty] = M(A.tailPivot), [px, py] = M(A.headPivot), [l1, e1] = M(A.eyeL), [l2, e2] = M(A.eyeR), [mx, my] = M(A.mouth);
      const es = A.eyeSize * 1.2, e = o.ear || 0;
      const wing = P.wings ? `<g transform="translate(130 ${py}) scale(${1 + Math.sin((o.t || 0) * 9) * 0.04 + e / 200} 1) translate(-130 ${-py})">${W(P.wings)}</g>` : '';
      const back = `${W(P.back)}<g transform="rotate(${(o.tail || 0) * 0.7} ${tx} ${ty})">${W(P.tail)}</g>${wing}`;
      const body = W(P.body);
      const face = `${petEye(l1, e1, es, es * 1.1, 'own', o)}${petEye(l2, e2, es, es * 1.1, 'own', o)}${o.eyes === 'sad' || o.brow ? petBrows(l1, l2, e1 - es * 1.7, es * 0.9, 'own', o) : ''}
        ${petMouth(mx, my, Math.max(9, es * 1.25), 'own', o)}${blush(l1 - es * 0.2, e1 + es * 1.7)}${blush(l2 + es * 0.2, e2 + es * 1.7)}`;
      const head = `<g transform="rotate(${e * 0.5} ${px} ${py})">${W(P.ears)}</g>${W(P.head)}${face}<g transform="rotate(${-e * 0.5} ${px} ${py})">${W(P.earsFront)}</g>${W(P.front)}${petTear(l1 - es * 0.5, e1 + es, o.tear)}`;
      const [hx, top] = M(A.headTop), [, neck] = M(A.neck);
      return { back, body, head, top, hx, eyeY: (e1 + e2) / 2, neck, defs: P.defs || '' };
    };
  }

  // Zubehör (Emoji) an Kopf, Augen oder Hals
  function petAcc(o, a) {
    const c = o.acc || {};
    let head = '', eyes = '', neck = '';
    const hx = a.hx || 150;
    if (o.crown && !c.head && !o.hat) head += `<g transform="translate(${hx} ${a.top + 12}) rotate(14)"><path d="M-24 10 L-26 -14 L-12 -2 L0 -20 L12 -2 L26 -14 L24 10 Z" fill="url(#ypGold)" stroke="#d99000" stroke-width="2" stroke-linejoin="round"/><circle cx="0" cy="2" r="4" fill="#e03131"/><circle cx="-14" cy="4" r="3" fill="#4dabf7"/><circle cx="14" cy="4" r="3" fill="#51cf66"/></g>`;
    if (!c.head && o.hat === 'santa') head += `<g transform="translate(${hx} ${a.top + 14}) rotate(16)"><path d="M-30 8 C-24 -24 6 -40 30 -30 C20 -22 14 -8 26 8 Z" fill="#e03131" stroke="#a51111" stroke-width="2" stroke-linejoin="round"/><rect x="-34" y="4" width="64" height="13" rx="6.5" fill="#fff" stroke="#dee2e6" stroke-width="1.5"/><circle cx="31" cy="-30" r="8" fill="#fff" stroke="#dee2e6" stroke-width="1.5"/></g>`;
    if (!c.head && o.hat === 'party') head += `<g transform="translate(${hx} ${a.top + 10}) rotate(14)"><path d="M-20 12 L0 -40 L20 12 Z" fill="#cc5de8" stroke="#862e9c" stroke-width="2" stroke-linejoin="round"/><path d="M-13 -6 L13 -6 M-8 -20 L8 -20 M-17 6 L17 6" stroke="#ffd43b" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="-42" r="6" fill="#ffd43b"/></g>`;
    // ☂️ Regenschirm: hinter dem Kopf (der Stiel verschwindet hinter dem Kopf), der Schirm spannt sich über den Kopf und wippt leicht
    let behind = '';
    if (o.umb) {
      const sw = Math.sin((o.t || 0) * 1.6) * 4, cy = a.top - 6;
      behind = `<g transform="translate(130 ${cy}) rotate(${sw}) scale(1.2)"><path d="M0 -20 L0 70" stroke="#495057" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M-62 12 C-58 -30 58 -30 62 12 C52 4 40 4 31 12 C22 4 9 4 0 12 C-9 4 -22 4 -31 12 C-40 4 -52 4 -62 12 Z" fill="#9775fa" stroke="#6741d9" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M0 -28 C-14 -12 -18 0 -31 12 M0 -28 C14 -12 18 0 31 12" stroke="#6741d9" stroke-width="2" fill="none"/><path d="M-40 -14 C-30 -22 -14 -26 -4 -26" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="0" cy="-30" r="3.5" fill="#6741d9"/></g>`;
    }
    if (c.head) head += `<text x="${hx}" y="${a.top + 30}" font-size="58" text-anchor="middle" transform="rotate(12 ${hx} ${a.top + 10})">${c.head}</text>`;
    if (c.eyes) eyes = `<text x="130" y="${a.eyeY + 20}" font-size="74" text-anchor="middle">${c.eyes}</text>`;
    if (c.neck) neck = `<text x="130" y="${a.neck + 34}" font-size="54" text-anchor="middle">${c.neck}</text>`;
    return { head: head + eyes, neck, behind };
  }

  // Haupt-Funktion: komplettes Tier
  function petDraw(kind, o = {}) {
    const A = ANIMAL[kind] || ANIMAL.dog;
    const g = Math.max(0, Math.min(1, o.g == null ? 1 : o.g));
    const a = A(o);
    const acc = petAcc(o, a);
    // Baby: großer Kopf, kleiner Körper
    const sb = 0.62 + 0.38 * g, sh = 1.12 - 0.12 * g, all = 0.72 + 0.28 * g;
    const neckY = 236 - (236 - a.neck) * sb, dy = neckY - a.neck;
    const sq = o.squash || 0, sx = all * (1 + sq * 0.12), sy = all * (1 - sq * 0.12);
    const tilt = o.tilt || 0, jump = o.jump || 0, x = o.x || 0;
    const inner = `<ellipse cx="${130 + x}" cy="240" rx="${84 * all * (1 - Math.min(0.5, jump / 200))}" ry="13" fill="url(#ypShadow)" opacity="${1 - Math.min(0.6, jump / 160)}"/>
     <g transform="translate(${130 + x} ${236 - jump}) scale(${sx * (o.flip ? -1 : 1)} ${sy}) translate(-130 -236)">
      <g transform="translate(130 236) scale(${sb}) translate(-130 -236)">${a.back}${a.body}${acc.neck}</g>
      <g transform="translate(0 ${dy}) rotate(${tilt} 130 ${a.neck}) translate(130 ${a.neck}) scale(${sh}) translate(-130 ${-a.neck})">${acc.behind}${a.head}${acc.head}</g>
     </g>`;
    const defs = `${PET_DEFS}${PAL[kind] ? petGrads(kind) : OWNDEF[kind] ? petGrads('own') : ''}${a.defs || ''}`;
    if (o.inner) return { defs, inner };
    return `<svg viewBox="0 0 260 260" width="${o.w || 260}" height="${o.h || o.w || 260}" overflow="visible"><defs>${defs}</defs>${inner}</svg>`;
  }

  // Eier je Tier (im Nest): wob = Wackeln (Grad), crack 0…1, open 0…1 (Schale fliegt weg)
  const EGG = {
    dog: { a: '#fff6e0', b: '#f5c26b', s: 'dots' }, cat: { a: '#f1f3f5', b: '#adb5bd', s: 'paws' },
    dino: { a: '#e9fac8', b: '#74b816', s: 'spots' }, unicorn: { a: '#fff0f6', b: '#cc5de8', s: 'stars' }, bird: { a: '#e7f5ff', b: '#4dabf7', s: 'dots' },
  };
  function petEgg(kind, o = {}) {
    const e = EGG[kind] || EGG.dog, wob = o.wob || 0, cr = o.crack || 0, op = o.open || 0;
    const pat = e.s === 'stars' ? `<g fill="${e.b}" opacity=".6"><path d="M-16 -98 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1 Z"/><path d="M18 -76 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 Z"/><path d="M-20 -46 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 Z"/></g>`
      : e.s === 'paws' ? `<g fill="${e.b}" opacity=".55"><ellipse cx="-12" cy="-90" rx="7" ry="6"/><circle cx="-20" cy="-100" r="3"/><circle cx="-12" cy="-104" r="3"/><circle cx="-4" cy="-100" r="3"/><ellipse cx="16" cy="-58" rx="6" ry="5"/><circle cx="9" cy="-66" r="2.6"/><circle cx="16" cy="-70" r="2.6"/><circle cx="23" cy="-66" r="2.6"/></g>`
      : e.s === 'spots' ? `<g fill="${e.b}" opacity=".55"><ellipse cx="-16" cy="-98" rx="11" ry="8"/><ellipse cx="20" cy="-80" rx="8" ry="10"/><ellipse cx="-22" cy="-50" rx="9" ry="7"/><ellipse cx="14" cy="-40" rx="6" ry="5"/></g>`
      : `<g fill="${e.b}" opacity=".6"><circle cx="-16" cy="-100" r="8"/><circle cx="18" cy="-84" r="6"/><circle cx="4" cy="-112" r="4"/><circle cx="-20" cy="-36" r="6"/><circle cx="20" cy="-46" r="4"/></g>`;
    const crack = `<path d="M-46 -58 L-34 -64 L-22 -50 L-12 -66 L0 -48 L12 -66 L24 -50 L36 -64 L46 -58" stroke="#8a6d3b" stroke-width="3" fill="none" stroke-linejoin="round" stroke-dasharray="200" stroke-dashoffset="${200 - 200 * cr}"/>`;
    const nest = `<g><ellipse cx="0" cy="6" rx="78" ry="20" fill="#a87b40"/><path d="M-78 4 q13 -16 26 0 q13 -16 26 0 q13 -16 26 0 q13 -16 26 0 q13 -16 26 0 q13 -16 26 0" stroke="#8a5f2a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-70 14 q14 8 28 0 q14 8 28 0 q14 8 28 0 q14 8 28 0 q14 8 28 0" stroke="#c99a5b" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
    const shell = `<defs><radialGradient id="ypEgg_${kind}" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="${e.a}"/><stop offset="1" stop-color="${e.b}" stop-opacity=".5"/></radialGradient><clipPath id="ypEggB_${kind}"><path d="M-60 -58 L-46 -58 L-34 -64 L-22 -50 L-12 -66 L0 -48 L12 -66 L24 -50 L36 -64 L46 -58 L60 -58 L60 10 L-60 10 Z"/></clipPath><clipPath id="ypEggT_${kind}"><path d="M-60 -58 L-46 -58 L-34 -64 L-22 -50 L-12 -66 L0 -48 L12 -66 L24 -50 L36 -64 L46 -58 L60 -58 L60 -160 L-60 -160 Z"/></clipPath></defs>`;
    const egg = `<path d="M0 0 C-30 0 -50 -22 -50 -60 C-50 -104 -26 -134 0 -134 C26 -134 50 -104 50 -60 C50 -22 30 0 0 0 Z" fill="url(#ypEgg_${kind})" stroke="${e.b}" stroke-opacity=".6" stroke-width="2.5"/>${pat}<path d="M-28 -110 C-20 -122 -10 -126 -2 -126" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>`;
    const W = o.w || 260;
    if (op <= 0) return `<svg viewBox="0 0 260 260" width="${W}" height="${o.h || W}" overflow="visible">${shell}<g transform="translate(130 222)">${nest}<g transform="rotate(${wob} 0 0)">${egg}${crack}</g></g></svg>`;
    return { nest: `<g transform="translate(130 222)">${nest}</g>`, bottom: `<g transform="translate(130 222)" clip-path="url(#ypEggB_${kind})">${egg}</g>`, top: `<g transform="translate(${130 + 80 * op} ${222 - 150 * op + 230 * op * op}) rotate(${70 * op})" opacity="${1 - Math.max(0, (op - 0.7) / 0.3)}"><g clip-path="url(#ypEggT_${kind})">${egg}</g></g>`, defs: shell };
  }


  // ---------- Daten ----------
  const KIND = {
    dog: { e: '🐶', n: 'Hund', nm: 'Flocke', food: '🦴', toy: '⚽', start: 'egg' },
    cat: { e: '🐱', n: 'Katze', nm: 'Mimi', food: '🐟', toy: '🧶', start: 'egg' },
    dino: { e: '🦖', n: 'Dino', nm: 'Rexi', food: '🥬', toy: '🏐', start: 'egg' },
    unicorn: { e: '🦄', n: 'Einhorn', nm: 'Sternchen', food: '🧁', toy: '🎈', start: 'egg' },
    bird: { e: '🐦', n: 'Vogel', nm: 'Piepsi', food: '🌻', toy: '🔔', start: 'egg' },
    hero: { e: '🦸', n: 'Superheld', nm: 'Blitz', food: '🍎', toy: '🏋️', start: 'box', human: true },
    fairy: { e: '🧚', n: 'Fee', nm: 'Lilly', food: '🌸', toy: '✨', start: 'bud', human: true },
  };
  const KORD = ['dog', 'cat', 'dino', 'unicorn', 'bird', 'hero', 'fairy'];
  // Stufen: 0 Start (Ei/Kiste/Knospe) · 1 Baby · 2 Jung · 3 Groß – Sterne seit dem Start (t0)
  const STEP = [50, 150, 400];
  const SPEED = { f: 0.5, n: 1, s: 2 };
  // Spiele mit Rekord (für „Spielstände zurücksetzen“ – die Spiele selbst liegen in yippee-kids-chores-games.js)
  const GNAMES = {
    catch: ['🦴', 'Leckerli fangen'], whack: ['🐭', 'Mäuse fangen'], run: ['🌵', 'Hüpfen'], fly: ['⭐', 'Sterne sammeln'], song: ['🎵', 'Lied nachspielen'], fire: ['✨', 'Glühwürmchen fangen'],
    memory: ['🧠', 'Memory'], move: ['🏃', 'Mach\'s nach'], count: ['🔢', 'Zählen'], math: ['🧮', 'Rechnen'], clock: ['🕐', 'Uhr lesen'], abc: ['🔤', 'Buchstaben & Wörter'],
    money: ['💰', 'Geld zählen'], puzzle: ['🧩', 'Schiebe-Puzzle'], simon: ['🌈', 'Farben merken'], vocab: ['🇬🇧', 'Englisch-Wörter'], mul: ['✖️', 'Einmaleins'],
    maze: ['🏰', 'Labyrinth'], train: ['🚂', 'Zugfahrt'], board: ['🏴‍☠️', 'Schatzkarte'], lily: ['🐸', 'Seerosen-Hüpfen'], space: ['🚀', 'Weltraum'], dino: ['🦕', 'Dino-Ausgrabung'],
  };
  const STAGE_N = {
    dog: ['Ei', 'Welpe', 'Junghund', 'Großer Hund'], cat: ['Ei', 'Kätzchen', 'Junge Katze', 'Große Katze'], dino: ['Ei', 'Dino-Baby', 'Junger Dino', 'Großer Dino'],
    unicorn: ['Ei', 'Fohlen', 'Junges Einhorn', 'Großes Einhorn'], bird: ['Ei', 'Küken', 'Junger Vogel', 'Großer Vogel'],
    hero: ['Heldenkiste', 'Held in Ausbildung', 'Junior-Held', 'Superheld'], fairy: ['Knospe', 'Kleine Fee', 'Fee', 'Feenkönigin'],
  };
  // Zubehör: wird mit dem Level des Kindes freigeschaltet (Level 1 = Anfänger)
  const ACC = [['🎩', 'head', 2], ['🎀', 'head', 2], ['🕶️', 'eyes', 3], ['👒', 'head', 4], ['🧣', 'neck', 5], ['👓', 'eyes', 5], ['🧢', 'head', 6], ['🎓', 'head', 7], ['🏅', 'neck', 8], ['💐', 'neck', 9], ['🌸', 'head', 3], ['⭐', 'neck', 4]];
  const COLN = { hero: ['Blau & Rot', 'Grün & Gelb', 'Lila & Pink', 'Schwarz & Gold', 'Rot & Blau'], fairy: ['Rosa', 'Lila', 'Mint', 'Himmelblau', 'Gold'] };
  const pad = (n) => String(n).padStart(2, '0');
  const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const rnd = (seed) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };

  const CSS = `<style>
.pew{display:flex;align-items:center;gap:12px;width:100%;margin:10px 0 2px;padding:6px 12px 6px 6px;border:0;border-radius:20px;background:linear-gradient(135deg,#e6fcf0,#c3f0d8);color:#1f2433;font:inherit;text-align:left;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(0,0,0,.04)}
.pew.sad{background:linear-gradient(135deg,#eef0f5,#d6d9e2)}.pew.sleep{background:linear-gradient(135deg,#2f3460,#1f2244);color:#e7e9ff}
.pew .pewt{flex:1;min-width:0;display:grid;gap:3px}.pew b{font-size:16px}.pew .pebub{font-size:14px;line-height:1.3}.pew small{font-size:12px;opacity:.75}
.podlg textarea{width:100%;box-sizing:border-box;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;border-radius:12px;border:1px solid var(--line,#d0d4dd);padding:8px;background:var(--soft,#f6f7fb);color:inherit}
.poprev{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px;margin:6px 0}.poprev figure{margin:0;text-align:center;background:linear-gradient(135deg,#e6fcf0,#c3f0d8);border-radius:14px;padding:4px 0}.poprev figcaption{font-size:11px;font-weight:700;color:#1f2433}
.poadjr{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:4px 0}.poadjr span{min-width:78px;font-weight:700;font-size:13px}.poadjr button{min-width:38px;height:34px;border:0;border-radius:10px;background:var(--soft,#eef0f5);font:inherit;font-weight:800;cursor:pointer;color:inherit}
#po_msg.warn{color:#c92a2a;font-weight:700}
.pest{position:relative;flex:none}.pest.sm{width:96px;height:96px}.pest.lg{width:min(300px,78vw);height:min(300px,78vw);margin:0 auto}
.pest .pesv,.pest .pesv svg{width:100%;height:100%;display:block;overflow:visible}
.pefx{position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:2}
.pep{position:absolute;font-size:24px;line-height:1;transform:translate(-50%,0);animation:pefl 1.7s ease-out forwards}.sm .pep{font-size:16px}
@keyframes pefl{0%{opacity:0;transform:translate(-50%,0) scale(.5)}15%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),-90px) scale(1.25)}}
.pez{position:absolute;color:#cfd3ff;font-weight:900;animation:pez 2.4s ease-out forwards}@keyframes pez{0%{opacity:0;transform:translate(0,0) scale(.6)}25%{opacity:1}100%{opacity:0;transform:translate(26px,-70px) scale(1.5)}}
.pecf{position:absolute;top:-10px;width:9px;height:14px;border-radius:2px;animation:pecf 2.6s linear forwards}@keyframes pecf{to{transform:translateY(340px) rotate(540deg);opacity:0}}
.pehand{position:absolute;left:50%;top:2%;font-size:58px;animation:pehand 2.6s ease-in-out forwards}.sm .pehand{font-size:30px}
@keyframes pehand{0%{opacity:0;transform:translate(-50%,-20px)}12%{opacity:1;transform:translate(-80%,0)}30%{transform:translate(-20%,6px)}48%{transform:translate(-80%,0)}66%{transform:translate(-20%,6px)}84%{opacity:1;transform:translate(-60%,0)}100%{opacity:0;transform:translate(-50%,-20px)}}
.pefood{position:absolute;left:58%;font-size:46px;animation:pefood 3.2s ease-in forwards}@keyframes pefood{0%{top:-12%;opacity:0;transform:rotate(-30deg)}12%{opacity:1}28%{top:34%;transform:rotate(0)}40%{transform:scale(1)}55%{transform:scale(.7)}70%{transform:scale(.4)}82%{transform:scale(.15);opacity:1}88%,100%{transform:scale(0);opacity:0;top:36%}}
.petoy{position:absolute;z-index:3;font-size:40px;transform:translate(-50%,-50%);animation:petoy 3.6s ease-in-out forwards}@keyframes petoy{0%{left:14%;top:78%;opacity:0}8%{opacity:1}22%{left:26%;top:34%}36%{left:40%;top:80%}52%{left:58%;top:30%}66%{left:74%;top:78%}80%{left:62%;top:42%}92%{left:52%;top:56%;transform:translate(-50%,-50%) scale(1)}100%{left:50%;top:58%;opacity:0;transform:translate(-50%,-50%) scale(.6)}}
.peglow{position:absolute;inset:-6%;border-radius:50%;background:radial-gradient(circle,rgba(255,249,196,.95),rgba(255,249,196,0) 65%);animation:peglow 2.2s ease-in-out forwards}@keyframes peglow{0%,100%{opacity:0;transform:scale(.6)}45%{opacity:1;transform:scale(1.1)}}
.peflash{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,255,255,0) 70%);animation:peflash 1s ease-out forwards}@keyframes peflash{0%{opacity:0;transform:scale(.3)}30%{opacity:1}100%{opacity:0;transform:scale(1.4)}}
.pepg .pehd{display:grid;gap:8px;justify-items:center;text-align:center;padding:14px 12px 16px;border-radius:24px;background:radial-gradient(circle at 50% 30%,#f4fff9,#bfeed4);color:#1f2433;position:relative;overflow:hidden}
.pepg .pehd.sad{background:radial-gradient(circle at 50% 30%,#f2f3f7,#d4d6df)}.pepg .pehd.sleep{background:linear-gradient(160deg,#2b2f55,#1b1e3a);color:#e7e9ff}
.pepg .pebig{background:#fff;color:#1f2433;border-radius:16px;padding:8px 14px;font-weight:800;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,.08);max-width:92%;position:relative;z-index:2}
.pepg .pename{font-weight:900;font-size:22px}.pepg .pesub{font-size:14px;opacity:.8}
.pebar{width:min(320px,90%);height:12px;border-radius:8px;background:rgba(255,255,255,.7);overflow:hidden}.pebar i{display:block;height:100%;background:linear-gradient(90deg,#f59f00,#ffd43b)}
.peacts{display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:8px}.peacts.pebig2{margin-top:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.pebig2 .btn{min-height:84px;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center;text-align:left;padding:10px 14px;color:#fff;border:0;box-shadow:0 4px 0 rgba(0,0,0,.18)}.pebig2 .btn i{grid-row:1/3;font-style:normal;font-size:34px}.pebig2 .btn b{font-size:18px}.pebig2 .btn small{opacity:.9;font-weight:700}
.pebig2 [data-a=pegames]{background:linear-gradient(135deg,#7048e8,#4c6ef5)}.pebig2 [data-a=pehome]{background:linear-gradient(135deg,#f59f00,#e8590c)}.pebig2 .btn.lock{filter:grayscale(.6);opacity:.75}.peacts .btn{min-height:54px;font-weight:800;font-size:15px;position:relative}.peacts:not(.pebig2) .btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;line-height:1.15;padding:8px 4px;font-size:14px;overflow-wrap:anywhere;hyphens:auto}.peacts .btn .pei{font-style:normal;font-size:24px;line-height:1}
.peacts .btn.lock{opacity:.6}.peacts .btn .pelk{position:absolute;top:4px;right:6px;font-size:13px}
.pechoose{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}.pechoose button{display:grid;justify-items:center;gap:2px;padding:6px 4px 8px;border-radius:16px;border:2px solid transparent;background:var(--soft);font:inherit;color:inherit;cursor:pointer;font-weight:800;font-size:14px}
.pechoose button.on{border-color:var(--ac,#5b61ff);background:#fff}.pechoose svg{width:84px;height:84px}
.pesw{display:flex;flex-wrap:wrap;gap:6px}.pesw button{min-width:44px;height:44px;border-radius:12px;border:2px solid transparent;font-size:22px;cursor:pointer;background:var(--soft)}.pesw button.on{border-color:var(--ac,#5b61ff)}
.pesw .dot{width:44px;border-radius:50%}
.peopen{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;font-size:24px}
.pewx{position:absolute;inset:0;pointer-events:none;border-radius:inherit}
.pewx.rain{background-image:radial-gradient(1.4px 6px at 50% 50%,rgba(77,171,247,.75) 98%,transparent),radial-gradient(1.2px 5px at 50% 50%,rgba(116,192,252,.6) 98%,transparent);background-size:38px 52px,26px 40px;background-position:0 0,13px 20px;animation:perain .9s linear infinite}@keyframes perain{to{background-position:0 52px,13px 60px}}
.pewx.snow{background-image:radial-gradient(#fff 2px,transparent 2.5px),radial-gradient(#fff 1.5px,transparent 2px);background-size:46px 46px,30px 30px;background-position:0 0,15px 15px;animation:pesnow 4s linear infinite;opacity:.9}@keyframes pesnow{to{background-position:20px 46px,-15px 45px}}
.pewx.sun{background:radial-gradient(circle at 88% 10%,rgba(255,212,59,.55),rgba(255,212,59,0) 35%)}
.pewx.storm{background:linear-gradient(rgba(40,40,70,.25),rgba(40,40,70,.25)),repeating-linear-gradient(105deg,rgba(77,171,247,0) 0 14px,rgba(77,171,247,.55) 14px 16px);background-size:auto,60px 60px;animation:perain .4s linear infinite}
.pezzz{margin:4px 0;padding:14px;border-radius:18px;background:linear-gradient(135deg,#2f3460,#1f2244);color:#e7e9ff;text-align:center;font-weight:700}
.petab .perow{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:14px;background:var(--soft)}.petab .perow+.perow{margin-top:6px}
.petab .perow .grow{flex:1;min-width:0}.petab svg{width:64px;height:64px;flex:none}
.peold{display:flex;flex-wrap:wrap;gap:8px}.peold div{display:grid;justify-items:center;font-size:12px;background:var(--soft);border-radius:12px;padding:4px 6px}.peold svg{width:60px;height:60px}
@media (prefers-reduced-motion: reduce){.pewx{animation:none}}
</style>`;

  // 🎮 Mini-Spiele: eigene Datei, wird erst beim ersten Spiel geladen
  let gmP = null, gmOK = false;
  // Einschulungsalter (1. Klasse) je Land – unbekannte Länder: 6
  const SCHOOL_AGE = { GB: 5, IE: 5, MT: 5, NZ: 5, CY: 6, SE: 7, FI: 7, DK: 7, EE: 7, LV: 7, LT: 7, BG: 7, RS: 7, HR: 7, PL: 7, HU: 7, RU: 7 };
  const gmLoad = () => {
    if (gmOK) return Promise.resolve(true);
    if (!gmP) {
      const pre = typeof window.YippeeKidsChoresGames === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresGames }) : null;
      gmP = (pre || Y.cardImport('yippee-kids-chores-games.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(C, Object.assign(Object.create(Y), { petDraw, KIND })); gmOK = true; return true; }, (e) => { gmP = null; throw e; });
    }
    return gmP;
  };
  // 🏠 Zuhause: eigene Datei, wird erst beim Öffnen des Zimmers geladen
  let phP = null, phOK = false;
  const phLoad = () => {
    if (phOK) return Promise.resolve(true);
    if (!phP) {
      const pre = typeof window.YippeeKidsChoresHome === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresHome }) : null;
      phP = (pre || Y.cardImport('yippee-kids-chores-home.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(C, Object.assign(Object.create(Y), { petDraw, KIND })); phOK = true; return true; }, (e) => { phP = null; throw e; });
    }
    return phP;
  };
  const gmErr = (self) => self._toast(T('⚠️ Die Spiele konnten nicht geladen werden – liegt die Datei yippee-kids-chores-games.js neben der Karte?'));

  class M {
    _peP(kid) { this._peOwnSync(); return this._db.pk[kid] || {}; }
    // 🎨 eigene Haustiere aus der Liste (po) in die Tier-Tabellen übernehmen – nur wenn sich die Daten geändert haben
    _peOwnSync() {
      if (this._poV !== undefined && this._poV === this._dbv) return;
      this._poV = this._dbv;
      const po = this._db.po || {};
      Object.keys(OWNDEF).forEach((x) => { if (!po[x]) { delete OWNDEF[x]; delete KIND[x]; delete ANIMAL[x]; delete EGG[x]; delete STAGE_N[x]; } });
      Object.values(po).forEach((d) => {
        if (!d || !/^o_[\w-]{1,30}$/.test(d.id || '') || !d.parts || !d.parts.head) return;
        OWNDEF[d.id] = d;
        KIND[d.id] = { e: d.e || '🐾', n: d.name || T('Eigenes Haustier'), nm: d.name || T('Eigenes Haustier'), food: d.food || '🍎', toy: '⚽', start: 'egg', own: true, kids: d.kids || [] };
        ANIMAL[d.id] = ownAnimal(d);
        EGG[d.id] = { a: d.egg[0], b: d.egg[1], s: 'dots' };
        STAGE_N[d.id] = ['Ei', 'Baby', 'Jung', 'Groß'];
      });
    }
    // Tiere, die ein Kind auswählen darf: eingebaute + eigene (für alle oder dieses Kind)
    _peKinds(kid) { this._peOwnSync(); return [...KORD, ...Object.keys(OWNDEF).filter((x) => { if (!(this._db.po || {})[x]) return false; const l = OWNDEF[x].kids || []; return !l.length || !kid || l.includes(kid); })]; }
    _peSet(kid, patch) {
      const cur = this._db.pk[kid] || {};
      this._save('pk', kid, { ...cur, ...patch }, (c) => ({ ...(c || {}), ...patch }));
    }
    _peKindOf(p) { this._peOwnSync(); return KIND[p.kind] ? p.kind : ''; }
    _peName(p) { return p.name || T(KIND[p.kind || 'dog'].nm); }
    _peStageN(p, st) { return T((STAGE_N[p.kind] || STAGE_N.dog)[st]); }
    _peLook(p) { return { skin: p.skin || 0, hair: p.hair || 0, hs: p.hs || 0, col: p.col || 0 }; }

    // Stufe und Wachstum aus den Sternen seit dem Start
    _peStage(k, p) {
      const f = SPEED[this._cfg.peSpeed] || 1, th = STEP.map((x) => Math.round(x * f));
      const s = Math.max(0, (Number(k.total) || 0) - (Number(p.t0) || 0));
      if (s < th[0]) return { st: 0, g: 0, s, need: th[0] - s, pct: s / th[0] };
      if (s < th[1]) { const r = (s - th[0]) / (th[1] - th[0]); return { st: 1, g: r * 0.45, s, need: th[1] - s, pct: r }; }
      if (s < th[2]) { const r = (s - th[1]) / (th[2] - th[1]); return { st: 2, g: 0.5 + r * 0.45, s, need: th[2] - s, pct: r }; }
      return { st: 3, g: 1, s, need: 0, pct: 1 };
    }
    // offene Pflicht-Aufgaben von heute
    _peOpen(k) {
      const tasks = this._todayTasks(k.id);
      return tasks.filter((t) => this._req(t) && !['d', 'p', 'taken'].includes(this._status(t, k.id).s));
    }
    // Stimmung: schläft (Nacht, Urlaub, nicht da) · freut sich · ruhig · ok · gelangweilt · traurig
    _peMood(k) {
      const c = this._cfg, now = new Date(), today = dk(now), t = hm(now);
      const n0 = c.peN0 || '20:00', n1 = c.peN1 || '06:30';
      if (this._onVacation(today, k.id)) return { m: 'sleep', why: 'vac' };
      if (this._presCfg(k.pres) && this._pres(k.id, today).s === 'out') return { m: 'sleep', why: 'away' };
      if (n0 > n1 ? (t >= n0 || t < n1) : (t >= n0 && t < n1)) return { m: 'sleep', why: 'night' };
      const sn = this._daySnap(k, today), done = sn[0], due = sn[1];
      const open = this._peOpen(k);
      if (!due) return { m: 'calm', open: [] };
      if (done >= due && !open.length) return { m: 'happy', open: [] };
      const late = now.getHours() >= (Number(c.peSadH) || 16);
      const tears = c.peTears !== false;
      if (late && tears && done / due < 0.5) return { m: 'sad', open, done, due };
      if (!done) return { m: 'bored', open, done, due };
      return { m: 'ok', open, done, due };
    }
    // Spielen & Füttern freigeschaltet? (je Kind abweichend möglich)
    // 🧮 Schwierigkeit der Lernspiele: 0 = Vorschule, 1–6 = Klasse
    // Reihenfolge: Einstellung beim Kind → Einschulung aus 🎓 Schulnoten → Geburtstag + Einschulungsalter des Landes
    _gmLvlAuto(kid) {
      const k = this._db.kid[kid];
      const gr = this._grade ? this._grade(k) : null;
      if (gr !== null && gr !== undefined) return Math.max(0, Math.min(6, gr));
      if (!k || !k.by) return 1;
      const now = new Date(), y = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
      const age = this._age(k, new Date(y, 8, 1));   // Alter zum Schuljahresbeginn (1. September)
      const cc = String((this._hass && this._hass.config && this._hass.config.country) || '').toUpperCase();
      const start = SCHOOL_AGE[cc] || 6;
      return age === null ? 1 : Math.max(0, Math.min(6, age - start + 1));
    }
    _gmLvl(kid) { const v = (this._peP(kid) || {}).lv; return v === 'v' ? 0 : v ? Number(v) : this._gmLvlAuto(kid); }
    // Fragen pro Runde je Kind (Freizeit-Spiele und „wie beim Kind“ bei Spiel-Aufgaben)
    _gmQn(kid) { const v = Number((this._peP(kid) || {}).qn); return v >= 3 && v <= 30 ? v : 5; }
    _gmLvlName(n) { return n ? T('Klasse {n}', { n }) : T('Vorschule'); }
    // 🪙 Taler: Spiel-Währung fürs Haustier-Zuhause (aus Spielen und Taler-Belohnungen), nie unter 0
    // 🎂 Geburtstags-Taler: einmal im Jahr beim ersten Besuch im Zuhause (je Kind einstellbar, Standard 50)
    _peBdTl(kid) {
      const k = this._db.kid[kid], p = this._peP(kid), now = new Date(), y = now.getFullYear();
      if (!k || !this._cfg.peHome || this._cfg.phBd === false || !this._isBday(k, dk(now)) || Number(p.bty) === y) return;
      const n = p.bt == null ? 50 : Number(p.bt) || 0;
      this._peSet(kid, { bty: y });
      if (n > 0) { this._tlAdd(kid, n); this._toast(T('🎂 Alles Gute! Zum Geburtstag gibt es {n} 🪙 Taler.', { n })); }
    }
    _tlAdd(kidId, n) {
      const v = Math.round(Number(n) || 0); if (!v || !this._db.kid[kidId]) return;
      const f = (c) => ({ ...(c || {}), tl: Math.max(0, Math.min(99999, (Number((c || {}).tl) || 0) + v)) });
      this._save('pk', kidId, f(this._db.pk[kidId] || {}), f);
    }
    _peUnlock(k, p) {
      const c = this._cfg, pl = p.play && p.play.m ? p.play : { m: c.pePlay || 'pct', p: c.pePct == null ? 50 : c.pePct, t: c.peTasks || [], n: c.pePlay === 'stars' ? c.peStars : c.peCnt };
      if (pl.m === 'always') return { ok: true };
      const today = dk(new Date()), day = new Date();
      // 🔢 nach X erledigten Aufgaben heute · ⭐ nach X verdienten Sternen heute
      if (pl.m === 'cnt' || pl.m === 'stars') {
        const sn = this._daySnap(k, today), need = Math.max(1, Math.min(100, Math.round(Number(pl.n) || (pl.m === 'stars' ? 10 : 3))));
        const have = pl.m === 'cnt' ? (sn[0] || 0) + (sn[5] || 0) : sn[2] || 0;
        if (have >= need) return { ok: true };
        const n = need - have;
        return { ok: false, why: pl.m === 'cnt' ? (n === 1 ? T('Noch 1 Aufgabe bis zum Spielen 🎮') : T('Noch {n} Aufgaben bis zum Spielen 🎮', { n })) : T('Noch {n} ⭐ bis zum Spielen 🎮', { n }) };
      }
      if (pl.m === 'tasks') {
        const need = (pl.t || []).map((id) => this._db.task[id]).filter((t) => t && (t.kids || []).includes(k.id) && this._isFor(t, k.id, day));
        const miss = need.filter((t) => !['d', 'e', 'taken'].includes(this._status(t, k.id).s)); // entschuldigt bzw. von Geschwistern erledigt zählt nicht als offen
        if (!miss.length) return { ok: true };
        return { ok: false, why: T('Erst noch erledigen: {list}', { list: miss.map((t) => `${esc(t.emoji || '📋')} ${esc(t.title)}`).join(', ') }) };
      }
      const sn = this._daySnap(k, today), due = sn[1], done = sn[0], need = Math.max(0, Math.min(100, Number(pl.p) || 0));
      if (!due || (done * 100) / due >= need) return { ok: true };
      return { ok: false, why: T('Erst noch ein paar Aufgaben 😉') };
    }
    _peWx() {
      const e = this._cfg.peWx, s = e && this._hass.states[e] ? String(this._hass.states[e].state) : '';
      if (['rainy', 'pouring', 'snowy-rainy', 'hail'].includes(s)) return 'rain';
      if (['lightning', 'lightning-rainy'].includes(s)) return 'storm';
      if (s === 'snowy') return 'snow';
      if (s === 'sunny') return 'sun';
      return '';
    }
    _peHat(k) {
      const d = new Date();
      if (k.bd && k.bm && Number(k.bd) === d.getDate() && Number(k.bm) === d.getMonth() + 1) return 'party';
      if (d.getMonth() === 11 && d.getDate() <= 26) return 'santa';
      return '';
    }
    // Sprechblase (traurig: nur angezeigt, nie vorgelesen)
    _peBub(k, p, mood, stg) {
      const S = this._peS(k.id);
      if (S.bub && S.bub.until > Date.now()) return S.bub.t;
      const nm = this._peName(p), slot = Math.floor(Date.now() / 90000) + k.id.length;
      const pick = (arr) => arr[slot % arr.length];
      if (!stg.st) return stg.need <= 5 ? T('Es knackt schon! Gleich ist es so weit … 😮') : pick([T('Da wackelt etwas … 🥚'), T('Noch {n} ⭐, dann geht es los!', { n: stg.need })]);
      if (mood.m === 'sleep') return mood.why === 'vac' ? T('Ferien! {name} ruht sich aus. 🏖️', { name: nm }) : mood.why === 'away' ? T('{name} wartet auf dich. 💤', { name: nm }) : T('Pssst … {name} schläft. 😴', { name: nm });
      if (mood.m === 'happy') return pick([T('Du hast alles geschafft – ich bin so stolz auf dich! 🎉'), T('Juhu! Alles erledigt! 🥳'), T('Heute warst du super! ⭐')]);
      if (mood.m === 'calm') return pick([T('Schön, dass du da bist! 💛'), T('Ich hab dich lieb! 💕'), T('Streichelst du mich? 🥰')]);
      if (mood.m === 'ok') { const n = mood.due - mood.done; return pick([T('Schon {n} geschafft – weiter so! 💪', { n: mood.done }), T('Noch {n}, dann feiern wir! 🎉', { n })]); }
      if (mood.m === 'bored') return pick([T('Mir ist ein bisschen langweilig …'), T('Was machen wir heute? 🙂')]);
      return T('Du hast noch {n} Aufgaben – dann freu ich mich wieder! 🥺', { n: mood.open.length });
    }
    _peSay(k, txt) { if (k.rdr && txt) this._sayKid(txt, k.id); }

    // Laufzeit-Zustand je Kind (nicht gespeichert)
    _peS(kid) {
      this._peSt = this._peSt || {};
      return this._peSt[kid] || (this._peSt[kid] = { act: null, idle: null, next: 0, done: null, hist: null, lv: null });
    }
    _peDo(kid, type, dur, extra) {
      const S = this._peS(kid);
      S.act = { type, t0: performance.now(), dur, ...(extra || {}) };
      S.idle = null;
    }
    _peBubSet(kid, t, ms) { this._peS(kid).bub = { t, until: Date.now() + (ms || 3500) }; this._peTxt(kid); }
    _peTxt(kid) {
      const k = this._db.kid[kid]; if (!k) return;
      const p = this._peP(kid), mood = this._peMood(k), stg = this._peStage(k, p), t = this._peBub(k, p, mood, stg);
      (this.shadowRoot ? [...this.shadowRoot.querySelectorAll(`.pebubt[data-k="${kid}"]`)] : []).forEach((x) => { x.textContent = t; });
    }
    // Partikel (Herzen, Sterne …) über das Tier legen
    _peFx(kid, list) {
      if (!this.shadowRoot) return;
      this.shadowRoot.querySelectorAll(`.pest[data-k="${kid}"] .pefx`).forEach((fx) => {
        list.forEach(([e, x, y, d, cls]) => {
          const s = document.createElement('span');
          s.className = cls || 'pep'; s.textContent = e;
          s.style.left = `${x}%`; s.style.top = `${y}%`; s.style.animationDelay = `${d || 0}s`;
          s.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 40)}px`);
          s.addEventListener('animationend', () => s.remove());
          fx.appendChild(s);
          if (fx.children.length > 40) fx.firstChild.remove();
        });
      });
    }
    // Effekte als HTML (Ball, Futter …). Sie überleben das Neuzeichnen der Karte (z. B. nach dem Speichern) und laufen nahtlos weiter.
    _peHtmlFx(kid, html, ms) {
      if (!this.shadowRoot) return;
      const now = Date.now();
      this._peLive = (this._peLive || []).filter((x) => x.end > now);
      const fx = { kid, html, t0: now, end: now + (ms || 3000) };
      this._peLive.push(fx);
      this.shadowRoot.querySelectorAll(`.pest[data-k="${kid}"] .pefx`).forEach((box) => this._peFxPut(box, fx));
    }
    _peFxPut(box, fx) {
      const d = document.createElement('div'); d.innerHTML = fx.html;
      const el = d.firstElementChild; if (!el) return;
      const age = Date.now() - fx.t0;
      if (age > 30) { el.style.animationDelay = `-${age}ms`; el.querySelectorAll('*').forEach((c) => { c.style.animationDelay = `-${age}ms`; }); }
      box.appendChild(el);
      setTimeout(() => el.remove(), Math.max(0, fx.end - Date.now()));
    }
    _peConfetti(kid) {
      const cols = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8'];
      let h = '<div class="pefx2">';
      for (let i = 0; i < 26; i++) h += `<i class="pecf" style="left:${Math.round(rnd(i + Date.now() % 97) * 100)}%;background:${cols[i % 5]};animation-delay:${(i % 7) * 0.08}s"></i>`;
      this._peHtmlFx(kid, `${h}</div>`, 3200);
    }

    // Ereignisse erkennen: Aufgabe erledigt, Belohnung eingelöst, neues Level, neue Stufe
    _peEvents(k, p, stg) {
      const S = this._peS(k.id), today = dk(new Date());
      const done = this._daySnap(k, today)[0], hist = (k.history || []).length, lv = levelOf(k.total);
      const first = S.done === null;
      if (!first && stg.st > 0) {
        if (done > S.done) { this._peDo(k.id, 'jump', 1600); this._peBubSet(k.id, T('Super gemacht! 🌟'), 3000); this._peFx(k.id, [['❤️', 30, 30], ['⭐', 50, 18, 0.15], ['❤️', 70, 30, 0.3]]); }
        else if (hist > S.hist) { this._peDo(k.id, 'cheer', 2000); this._peBubSet(k.id, T('Wow, eine Belohnung! 🎁'), 3000); this._peFx(k.id, [['🎁', 50, 20], ['✨', 28, 30, 0.2], ['✨', 72, 30, 0.3]]); }
        if (lv > S.lv) {
          const nu = ACC.filter((a) => a[2] === lv + 1).map((a) => a[0]).join(' ');
          this._peDo(k.id, 'cheer', 2500); this._peConfetti(k.id);
          this._peBubSet(k.id, nu ? T('Level {n}! Neues Zubehör: {list}', { n: lv + 1, list: nu }) : T('Level {n}! 🎉', { n: lv + 1 }), 5000);
        }
      }
      S.done = done; S.hist = hist; S.lv = lv;
      // neue Stufe (einmal je Stufe, auch nach dem Neuladen): Schlüpfen bzw. Wachsen
      const seen = Number(p.s) || 0;
      if (stg.st > seen && !S.growing) {
        S.growing = true;
        if (seen === 0) { this._peDo(k.id, 'hatch', 2600); this._peBubSet(k.id, T('Hallo! Ich bin da! 🎉'), 5000); }
        else { this._peDo(k.id, 'grow', 2200); this._peBubSet(k.id, T('Ich bin gewachsen! Jetzt: {stage}', { stage: this._peStageN(p, stg.st) }), 5000); }
        setTimeout(() => { S.growing = false; this._peSet(k.id, { s: stg.st, h: true }); }, 2700);
      }
    }

    // Ein Bild des Tieres zum Zeitpunkt now (für Animation und ersten Aufbau)
    _peFrame(k, p, now, big) {
      const S = this._peS(k.id), kind = this._peKindOf(p) || 'dog', stg = this._peStage(k, p), mood = this._peMood(k);
      const t = now / 1000, look = this._peLook(p);
      // Start-Zustand (Ei, Kiste, Knospe) – beim Schlüpfen: wackeln, Blitz, dann das Baby
      const act = S.act && now - S.act.t0 < S.act.dur ? S.act : null;
      if (!act && S.act) S.act = null;
      const hatching = act && act.type === 'hatch';
      if (!stg.st || (hatching && (now - act.t0) / act.dur < 0.5)) {
        const ratio = Math.min(1, stg.pct || 0), k2 = hatching ? (now - act.t0) / act.dur : 0;
        const burst = (t % 3.2) < 0.7 ? Math.sin((t % 3.2) / 0.7 * Math.PI * 4) : 0;
        const wob = hatching ? Math.sin(k2 * 60) * 16 : burst * (3 + ratio * 12) + (act && act.type === 'tap' ? Math.sin((now - act.t0) / 40) * 10 : 0);
        const crack = hatching ? 1 : ratio > 0.75 ? (ratio - 0.75) / 0.25 : 0;
        const st = KIND[kind].start;
        return st === 'box' ? petBox({ wob, crack }) : st === 'bud' ? petBud({ wob, open: crack * 0.6 }) : petEgg(kind, { wob, crack });
      }
      const o = { g: stg.g, crown: stg.st === 3, acc: { ...(p.acc || {}) }, ...look, t };
      const hat = this._peHat(k); if (hat) o.hat = hat;
      const wx = this._cfg.peHome && (this._phV || {})[k.id] ? '' : this._peWx(), day = mood.m !== 'sleep'; // 🏠 im Zimmer kein Schirm und kein Schal
      if (wx === 'snow' && !o.acc.neck) o.acc.neck = '🧣';
      if (wx === 'sun' && day && !o.acc.eyes) o.acc.eyes = '🕶️';
      if ((wx === 'rain' || wx === 'storm') && day) o.umb = true;
      // Grundzustand nach Stimmung
      const M = mood.m;
      const amp = { happy: 30, calm: 18, ok: 16, bored: 5, sad: 0, sleep: 0 }[M], spd = { happy: 14, calm: 8, ok: 8, bored: 2, sad: 1, sleep: 1 }[M];
      o.tail = Math.sin(t * spd) * amp;
      o.squash = Math.sin(t * (M === 'sleep' ? 1.4 : 2.4)) * (M === 'sleep' ? 0.3 : 0.15);
      o.eyes = M === 'sleep' ? 'sleep' : M === 'sad' ? 'sad' : 'open';
      o.mouth = M === 'sad' || M === 'bored' ? 'sad' : 'smile';
      if (M === 'bored') { o.brow = 0.5; o.tilt = -5; o.ear = 10; }
      if (M === 'sad') { o.tilt = -7; o.ear = 14; o.tear = this._cfg.peTears !== false ? (t * 0.45) % 1 : 0; }
      if (M === 'happy') { o.tongue = kind === 'dog' ? 0.8 : 0; o.jump = Math.max(0, Math.sin(t * 3)) ** 8 * 14; }
      if (kind === 'bird') o.wing = M === 'happy' ? 0.25 + 0.25 * Math.sin(t * 18) : 0.05 + 0.04 * Math.sin(t * 2);
      if (kind === 'fairy') { o.wing = M === 'sleep' ? 0.05 : 0.3 + 0.3 * Math.sin(t * 16); o.jump = (o.jump || 0) + (M === 'sleep' ? 0 : 6 + Math.sin(t * 2.2) * 6); }
      if (kind === 'unicorn') o.ear = (o.ear || 0) + Math.sin(t * 2) * 6;
      if (kind === 'hero') o.tail = Math.sin(t * 3) * (M === 'happy' ? 16 : 7);
      if (M !== 'sleep') { const b = t % 3.7; o.blink = b < 0.14 ? Math.sin((b / 0.14) * Math.PI) : 0; o.look = Math.sin(t * 0.7) * 0.5; }
      if (wx === 'storm' && day) { o.x = Math.sin(t * 40) * 1.5; o.brow = 0.6; }
      // kleine Einlagen zwischendurch
      if (!act && (M === 'calm' || M === 'ok' || M === 'happy' || M === 'bored') && now > S.next) {
        const L = ['look', 'tilt', 'ear', 'hop', 'yawn', 'sneeze', 'spin', 'wag', 'scratch', 'spec'];
        const type = M === 'bored' ? ['yawn', 'look', 'tilt'][Math.floor(Math.random() * 3)] : L[Math.floor(Math.random() * L.length)];
        S.idle = { type, t0: now, dur: type === 'spin' ? 1400 : type === 'yawn' ? 1800 : 1500 };
        S.next = now + S.idle.dur + 3500 + Math.random() * 5000;
        if (type === 'sneeze') setTimeout(() => this._peFx(k.id, [['💨', 50, 45]]), 900);
        if (type === 'spec') {
          const e = { bird: ['🎵', '🎶'], unicorn: ['🌈', '✨'], dino: ['💨', '💥'], fairy: ['✨', '💫'], hero: ['💪', '⚡'], cat: ['💤', '🐾'], dog: ['🐾', '❤️'] }[kind] || ['✨', '❤️'];
          this._peFx(k.id, [[e[0], 30, 30], [e[1], 70, 26, 0.3]]);
        }
      }
      const id = S.idle && now - S.idle.t0 < S.idle.dur ? S.idle : null;
      if (id && !act) {
        const q = (now - id.t0) / id.dur;
        if (id.type === 'look') o.look = Math.sin(q * Math.PI * 2);
        if (id.type === 'tilt') o.tilt = Math.sin(q * Math.PI) * 14;
        if (id.type === 'ear') o.ear = Math.sin(q * Math.PI * 8) * 12;
        if (id.type === 'hop') o.jump = Math.abs(Math.sin(q * Math.PI * 2)) * 22;
        if (id.type === 'yawn') { if (q > 0.15 && q < 0.85) { o.eyes = 'sleep'; o.mouth = 'o'; o.open = Math.sin(((q - 0.15) / 0.7) * Math.PI); } }
        if (id.type === 'sneeze') { if (q < 0.55) { o.squash = (-q / 0.55) * 0.7; o.mouth = 'o'; o.open = 0.3; o.eyes = 'happy'; } else if (q < 0.7) { o.squash = 1; o.eyes = 'happy'; o.mouth = 'open'; o.open = 0.6; } }
        if (id.type === 'spin') o.flip = q > 0.3 && q < 0.7;
        if (id.type === 'wag') { o.tail = Math.sin(t * 30) * 38; o.wing = kind === 'bird' || kind === 'fairy' ? 0.5 + 0.5 * Math.sin(t * 30) : o.wing; }
        if (id.type === 'scratch') { o.tilt = 10; o.ear = Math.sin(q * Math.PI * 14) * 14; o.eyes = 'happy'; }
        if (id.type === 'spec') { o.mouth = 'open'; o.open = Math.abs(Math.sin(q * Math.PI * 3)) * 0.8; o.jump = Math.abs(Math.sin(q * Math.PI * 2)) * 12; o.wing = kind === 'bird' || kind === 'fairy' ? 0.5 + 0.5 * Math.sin(t * 25) : o.wing; }
      }
      // Aktionen
      if (act) {
        const q = (now - act.t0) / act.dur;
        if (act.type === 'jump' || act.type === 'cheer') { const n = act.type === 'cheer' ? 3 : 2; o.jump = Math.abs(Math.sin(q * Math.PI * n)) * 54; o.eyes = 'happy'; o.mouth = 'open'; o.open = 0.7; o.tail = Math.sin(t * 30) * 36; o.wing = kind === 'bird' || kind === 'fairy' ? 0.5 + 0.5 * Math.sin(t * 30) : o.wing; o.tear = 0; o.brow = 0; }
        if (act.type === 'tap') { o.squash = -Math.sin(q * Math.PI) * 0.9; o.eyes = 'happy'; o.mouth = 'open'; o.open = 0.5; o.tear = 0; }
        if (act.type === 'pet') { o.eyes = 'happy'; o.tilt = Math.sin(q * Math.PI * 4) * 9; o.ear = Math.sin(q * Math.PI * 8) * 10; o.tail = Math.sin(t * 26) * 34; o.mouth = 'smile'; o.tongue = kind === 'dog' ? 1 : 0; o.tear = 0; o.brow = 0; }
        if (act.type === 'feed') { o.tear = 0; o.brow = 0; o.look = 0.8; if (q < 0.28) { o.mouth = 'open'; o.open = q / 0.28; } else if (q < 0.86) { o.mouth = 'open'; o.open = Math.abs(Math.sin((q - 0.28) * 34)); o.eyes = 'happy'; } else { o.eyes = 'happy'; o.mouth = 'smile'; o.tongue = 1; } }
        if (act.type === 'play') { o.jump = Math.abs(Math.sin(q * Math.PI * 5)) * 42; o.look = Math.cos(q * Math.PI * 2.4); o.mouth = 'open'; o.open = 0.6; o.tail = Math.sin(t * 30) * 36; o.flip = q > 0.5 && q < 0.8; o.tear = 0; o.brow = 0; o.eyes = 'open'; o.wing = kind === 'bird' || kind === 'fairy' ? 0.5 + 0.5 * Math.sin(t * 30) : o.wing; }
        if (act.type === 'grow') { o.squash = Math.sin(q * Math.PI * 6) * 0.5; o.eyes = 'happy'; o.mouth = 'open'; o.open = 0.6; o.tear = 0; }
        if (act.type === 'hatch') { const r = (q - 0.5) / 0.5; o.jump = Math.sin(Math.min(1, r * 1.3) * Math.PI) * 60; o.eyes = 'happy'; o.mouth = 'open'; o.open = 0.8; o.squash = r < 0.1 ? 0.8 : 0; o.tear = 0; o.brow = 0; }
      }
      return petDraw(kind, o);
    }

    // Kleines Tier in der Kinder-Ansicht (antippen → eigene Seite)
    _peWidget(k) {
      const p = this._peP(k.id), kind = this._peKindOf(p);
      if (!kind) {
        return `${CSS}<button type="button" class="pew" data-a="peopen" data-k="${k.id}"><div class="pest sm" data-k="${k.id}"><div class="pesv">${petEgg('dog', { wob: 0 })}</div><div class="pefx"></div></div>
          <span class="pewt"><b>${T('🐾 Dein Haustier wartet!')}</b><span class="pebub">${T('Such dir aus, wer bei dir einzieht.')}</span></span><span class="accc">▸</span></button>`;
      }
      const stg = this._peStage(k, p), mood = this._peMood(k), wx = this._peWx();
      this._peEvents(k, p, stg);
      const cls = mood.m === 'sleep' && stg.st ? 'sleep' : mood.m === 'sad' ? 'sad' : '';
      const line = stg.st === 3 ? `${this._peStageN(p, 3)} 👑` : T('{stage} · noch {n} ⭐', { stage: this._peStageN(p, stg.st), n: stg.need });
      return `${CSS}<button type="button" class="pew ${cls}" data-a="peopen" data-k="${k.id}">
        <div class="pest sm" data-k="${k.id}">${wx && mood.m !== 'sleep' ? `<div class="pewx ${wx}" style="border-radius:16px"></div>` : ''}<div class="pesv">${this._peFrame(k, p, performance.now(), false)}</div><div class="pefx"></div></div>
        <span class="pewt"><b>${esc(this._peName(p))}</b><span class="pebub pebubt" data-k="${k.id}">${esc(this._peBub(k, p, mood, stg))}</span>${mood.m === 'sad' ? `<span class="peopen" style="justify-content:flex-start;font-size:18px">${mood.open.slice(0, 6).map((t) => esc(t.emoji || '📋')).join(' ')}</span>` : ''}<small>${esc(line)}</small></span><span class="accc">▸</span></button>`;
    }

    // Eigene Seite des Tieres
    _pePageHtml(kid) {
      const k = this._db.kid[kid]; if (!k) return '';
      const p = this._peP(kid), kind = this._peKindOf(p);
      if (!kind) return `${CSS}${this._peChooseHtml(k)}`;
      if (this._cfg.peHome && (this._phV || {})[kid]) {
        if (!phOK) { phLoad().then(() => this._render(), () => this._toast(T('⚠️ Das Zuhause konnte nicht geladen werden – liegt die Datei yippee-kids-chores-home.js neben der Karte?'))); return `${CSS}<div class="hint">${T('Lade …')}</div>`; }
        return `${CSS}<div class="btnrow" style="margin-bottom:8px"><button type="button" class="btn" data-a="pehback" data-k="${kid}">🐾 ${esc(this._peName(p))}</button></div>${this._phHtml(kid)}`;
      }
      const stg = this._peStage(k, p), mood = this._peMood(k), wx = this._peWx(), un = this._peUnlock(k, p);
      this._peEvents(k, p, stg);
      const cls = mood.m === 'sleep' && stg.st ? 'sleep' : mood.m === 'sad' ? 'sad' : '';
      const next = stg.st < 3 ? T('noch {n} ⭐ bis „{stage}“', { n: stg.need, stage: this._peStageN(p, stg.st + 1) }) : T('Ausgewachsen 👑');
      const K = KIND[kind], dd = p.d && p.d.d === dk(new Date()) ? p.d : {};
      const fed = Number(dd.f) || 0, sleeping = mood.m === 'sleep';
      // Symbol oben, Text darunter – so sehen alle Knöpfe gleich aus, egal wie lang der Text ist
      const btn = (a, label, lock, extra) => { const m = /^(\S+) ([\s\S]+)$/.exec(label); return `<button type="button" class="btn ${lock ? 'lock' : ''}" data-a="${a}" data-k="${kid}" ${extra || ''}>${m && label[0] !== '<' ? `<i class="pei">${m[1]}</i><span>${m[2]}</span>` : label}${lock ? '<span class="pelk">🔒</span>' : ''}</button>`; };
      const zz = mood.why === 'vac' ? T('🏖️ {name} macht Ferien und ruht sich aus.', { name: esc(this._peName(p)) }) : mood.why === 'away' ? T('💤 {name} schläft und wartet auf dich.', { name: esc(this._peName(p)) }) : T('💤 {name} schläft – wacht um {t} wieder auf.', { name: esc(this._peName(p)), t: esc(this._cfg.peN1 || '06:30') });
      // 🏠 auch im Schlaf: im Zuhause zuschauen, wie das Tier im Bett schläft
      const acts = stg.st && sleeping ? `<div class="pezzz">${zz}</div>${this._cfg.peHome ? `<div class="peacts">${btn('pehome', `🏠 ${T('Zuhause')}`, false)}</div>` : ''}` : stg.st ? `<div class="peacts">
          ${btn('pepet', `🤚 ${T('Streicheln')}`, false)}
          ${btn('pefeed', `${K.food} ${T('Füttern')}${fed ? ` (${Math.min(fed, this._peFeedMax(p))}/${this._peFeedMax(p)})` : ''}`, !un.ok || sleeping)}
          ${btn('peplay', `${K.toy} ${T('Zusammen spielen')}`, !un.ok || sleeping)}
          ${btn('peacc', `👕 ${T('Anziehen')}`, false)}
        </div>${this._cfg.peGames !== false || this._cfg.peHome ? `<div class="peacts pebig2">
          ${this._cfg.peGames !== false ? btn('pegames', `<i>🕹️</i><b>${T('Spielhalle')}</b><small>${T('Mini-Spiele & Abenteuer')}</small>`, !un.ok || sleeping) : ''}
          ${this._cfg.peHome ? btn('pehome', `<i>🏠</i><b>${T('Zuhause')}</b><small>🪙 ${Number(p.tl) || 0} ${T('Taler')}</small>`, false) : ''}
        </div>` : ''}${!un.ok ? `<div class="hint" style="text-align:center">${un.why}</div>` : ''}` : `<div class="hint" style="text-align:center">${T('Tipp auf {e} – jede erledigte Aufgabe bringt dich näher ans Ziel!', { e: K.start === 'box' ? '📦' : K.start === 'bud' ? '🌷' : '🥚' })}</div>`;
      const sadBox = mood.m === 'sad' ? `<div class="card" style="text-align:center"><div class="peopen">${mood.open.map((t) => `<span title="${esc(t.title)}">${esc(t.emoji || '📋')}</span>`).join('')}</div><div class="btnrow" style="justify-content:center"><button class="btn primary" data-a="peclose">📋 ${T('Zu meinen Aufgaben')}</button></div></div>` : '';
      const old = (p.old || []).length ? `<div class="card"><h3>${T('📸 Erinnerungen')}</h3><div class="peold">${p.old.map((x) => `<div>${petDraw(x.kind, { w: 60, g: x.g >= 3 ? 1 : x.g === 2 ? 0.7 : 0.2, crown: x.g >= 3, eyes: 'happy' })}<b>${esc(x.name)}</b><span>${esc(x.to || '')}</span></div>`).join('')}</div></div>` : '';
      return `${CSS}<div class="pehd ${cls}">${wx && !sleeping ? `<div class="pewx ${wx}"></div>` : ''}
        <div class="pebig pebubt" data-k="${kid}">${esc(this._peBub(k, p, mood, stg))}</div>
        <div class="pest lg" data-k="${kid}" data-a="petap"><div class="pesv">${this._peFrame(k, p, performance.now(), true)}</div><div class="pefx"></div></div>
        <div class="pename">${esc(this._peName(p))}</div>
        <div class="pesub">${K.e} ${esc(this._peStageN(p, stg.st))} · ${esc(next)}</div>
        ${stg.st < 3 ? `<div class="pebar"><i style="width:${Math.round((stg.pct || 0) * 100)}%"></i></div>` : ''}
      </div>${sadBox}${acts}${old}`;
    }

    // Auswahl beim ersten Mal: Tier, Name und (bei Held/Fee) Aussehen
    _peChooseHtml(k) {
      const sel = this._pePick && this._pePick[k.id] || { kind: 'dog' };
      const kind = sel.kind, K = KIND[kind], look = { skin: sel.skin || 0, hair: sel.hair || 0, hs: sel.hs || 0, col: sel.col || 0 };
      const looks = K.human ? this._peLookHtml(kind, look, 'pepl', k.id) : '';
      return `<div class="card"><h3>${T('🐾 Wer soll bei dir einziehen?')}</h3>
        <div class="pechoose">${this._peKinds(k.id).map((x) => `<button type="button" class="${x === kind ? 'on' : ''}" data-a="pepick" data-k="${k.id}" data-v="${x}">${petDraw(x, { w: 84, g: 0.3, eyes: 'happy', ...(x === kind ? look : {}) })}${KIND[x].e} ${T(KIND[x].n)}</button>`).join('')}</div>
        ${looks}
        <label>${T('Name')}<input id="pename" maxlength="24" value="${esc(sel.name || T(K.nm))}"></label>
        <div class="hint">${T('Es fängt klein an: Mit jeder erledigten Aufgabe wächst {e} ein Stück.', { e: K.e })}</div>
        <div class="btnrow"><button class="btn primary" data-a="pestart" data-k="${k.id}">${K.start === 'box' ? '📦' : K.start === 'bud' ? '🌷' : '🥚'} ${T('Los geht\'s!')}</button></div></div>`;
    }
    _peLookHtml(kind, look, act, kid) {
      const SKC = ['#f7c6a5', '#e9b27c', '#b97a45', '#8a5530'], HRC = ['#8a5a32', '#e9c46a', '#2c2c35', '#d9622b', '#b98cf0'];
      const COL = kind === 'hero' ? [['#4dabf7', '#ff6b6b'], ['#69db7c', '#ffd43b'], ['#b197fc', '#faa2c1'], ['#495057', '#ffd43b'], ['#ff8787', '#74c0fc']] : [['#ffdeeb', '#f783ac'], ['#e5dbff', '#9775fa'], ['#d3f9d8', '#51cf66'], ['#d0ebff', '#4dabf7'], ['#fff3bf', '#fcc419']];
      const row = (lab, f, arr, draw) => `<div class="sect"><span>${lab}</span></div><div class="pesw">${arr.map((v, i) => `<button type="button" class="${draw ? '' : 'dot'} ${look[f] === i ? 'on' : ''}" data-a="${act}" data-k="${kid || ''}" data-f="${f}" data-v="${i}" ${draw ? '' : `style="background:${v}"`} aria-label="${i + 1}">${draw ? v : ''}</button>`).join('')}</div>`;
      return `${row(T('Hautfarbe'), 'skin', SKC)}${row(T('Haarfarbe'), 'hair', HRC)}${kind === 'hero' ? row(T('Frisur'), 'hs', ['💇', '🎀'], true) : ''}
        <div class="sect"><span>${kind === 'hero' ? T('Anzug & Umhang') : T('Kleid & Flügel')}</span></div><div class="pesw">${COL.map((c, i) => `<button type="button" class="dot ${look.col === i ? 'on' : ''}" data-a="${act}" data-k="${kid || ''}" data-f="col" data-v="${i}" style="background:linear-gradient(135deg,${c[0]} 50%,${c[1]} 50%)" title="${esc(T(COLN[kind][i]))}" aria-label="${esc(T(COLN[kind][i]))}"></button>`).join('')}</div>`;
    }

    // ---------- Eltern: Tab 🐾 Haustier ----------
    // ---------- 🎨 Eigene Haustiere ----------
    _peOwnHtml() {
      this._peOwnSync();
      const kids = this._kids(), list = Object.values(this._db.po || {}).filter((d) => OWNDEF[d.id]);
      const rows = list.map((d) => {
        const who = (d.kids || []).length ? (d.kids || []).map((x) => (this._db.kid[x] || {}).name).filter(Boolean).map(esc).join(', ') : T('alle Kinder');
        const used = kids.filter((k) => (this._db.pk[k.id] || {}).kind === d.id).map((k) => esc(k.name));
        const sure = this._poSure === d.id;
        return `<div class="perow">${petDraw(d.id, { w: 64, g: 0.8, eyes: 'happy' })}<div class="grow"><b>${esc(d.e)} ${esc(d.name || T('Eigenes Haustier'))}</b><div class="hint">${T('für: {x}', { x: who })}${used.length ? ` · ${T('hat: {x}', { x: used.join(', ') })}` : ''}</div></div>
          <button class="btn sm" data-a="pepoed" data-v="${d.id}" title="${esc(T('Bearbeiten'))}">✎</button><button class="btn sm ${sure ? 'danger' : ''}" data-a="pepodel" data-v="${d.id}">${sure ? T('Löschen?') : '✕'}</button></div>`;
      }).join('');
      return `<div class="card hubs" data-hid="own"><h3>${T('🎨 Eigene Haustiere')}</h3>
        <div class="hint">${T('Ein Haustier nach eurer Idee: Die Karte erstellt einen Prompt für ChatGPT, Gemini, Claude oder Copilot. Die KI zeichnet das Tier, du fügst die Antwort hier ein – fertig. Es blinzelt, freut sich, wird traurig, wächst und trägt Zubehör wie die eingebauten Tiere.')}</div>
        ${rows}
        <div class="btnrow"><button class="btn primary" data-a="pepoadd">${T('➕ Eigenes Haustier')}</button></div></div>`;
    }
    // Prompt für die KI (Deutsch oder Englisch – die KIs verstehen beides, die Tierbeschreibung darf in jeder Sprache sein)
    _poPrompt(desc) {
      const de = ['de', 'gsw'].includes(Y.LANG);
      const animal = String(desc || '').trim() || (de ? 'ein kleines niedliches Tier' : 'a small cute animal');
      if (de) return `Du bist Illustrator für eine Kinder-App. Zeichne ein niedliches Haustier als SVG-Bauteile und gib NUR gültiges JSON in einem einzigen Codeblock zurück – keinen Text davor oder danach.

TIER: ${animal}

STIL
- Niedlich im Chibi-Stil: großer runder Kopf (ca. 45 % der Gesamthöhe), kleiner rundlicher Körper, kurze Beine.
- Ansicht von vorne, leicht schräg.
- Einheitliche Umrisslinie an ALLEN Formen: stroke "#4a2f2f", stroke-width "3", stroke-linejoin "round", stroke-linecap "round" (Glanzlichter ohne Umriss).
- Pro Fläche 2–3 Farbtöne (Grundfarbe, Schatten, Glanzlicht) mit linearGradient oder radialGradient. Je ein kleines weißes Glanzlicht (opacity 0.5) oben auf Kopf und Körper.
- NICHT zeichnen: Augen, Mund, Augenbrauen, Wangen, Text, Hintergrund, Boden, Schatten unter dem Tier. Augen, Mund und Wangen zeichnet die App selbst. Nase, Schnauze oder Schnabel gehören aber zum Kopf.

ZEICHENFLÄCHE UND MASSE (viewBox 0 0 200 200)
- Das Tier steht mittig bei x = 100. Die Füße enden genau bei y = 185. Nichts ragt über 0–200 hinaus.
- Kopf: ungefähr Kreis, Mitte (100, 78), Radius ca. 42 → Oberkante y ≈ 36, Kinn y ≈ 120.
- Nase/Schnauze/Schnabel: mittig zwischen y = 80 und y = 104.
- Körper: Mitte ca. (100, 148), der Kopf überlappt die Körper-Oberkante leicht.
- Vorderbeine unter dem Körper, Hinterbeine (falls sichtbar) etwas weiter außen und etwas dunkler.

GESICHT – FREIE FLÄCHEN FÜR DIE APP (sehr wichtig)
- Augen: eyeL (82, 64), eyeR (118, 64), eyeSize 8. Im Umkreis von 11 um jeden Augenpunkt ist NUR Kopffarbe.
- Mund: (100, 112) – unter Nase/Schnauze auf freier Kopffläche.
- Wangen: die App malt sie bei (82, 78) und (118, 78) – dort ebenfalls nur Kopffarbe.
- Ohren, Hörner, Haare usw. überdecken weder Augen noch Wangen noch Mund.

ERLAUBTE SVG-ELEMENTE (alles andere wird entfernt)
g, path, circle, ellipse, rect, polygon, polyline, line, linearGradient, radialGradient, stop.
Erlaubte Attribute: d, cx, cy, r, rx, ry, x, y, x1, y1, x2, y2, width, height, points, fill, stroke, stroke-width, stroke-linecap, stroke-linejoin, opacity, fill-opacity, transform, id, offset, stop-color, stop-opacity, gradientUnits, gradientTransform, fx, fy.
Farbverläufe nur als fill="url(#id)". In den SVG-Strings NUR einfache Anführungszeichen (') verwenden.

BAUTEILE – jedes ist ein SVG-Fragment als String (ohne <svg>-Tag). Die App zeichnet sie von hinten nach vorne:
1. "defs": alle Farbverläufe
2. "back": Hinterbeine und Teile hinter dem Körper, sonst ""
3. "tail": nur der Schwanz (die App lässt ihn um "tailPivot" wedeln), sonst ""
4. "wings": Flügel, falls vorhanden (die App lässt sie flattern), sonst ""
5. "body": Rumpf mit Vorderbeinen
6. "ears": Ohren oder Hörner, die HINTER dem Kopf stehen (z. B. Katze, Hase), sonst ""
7. "head": Kopf mit Glanzlicht und Nase/Schnauze/Schnabel (ohne Augen und Mund)
8. "earsFront": Ohren, die VOR dem Kopf hängen (Schlappohren), sonst ""
9. "front": weitere Teile vor dem Gesicht (z. B. Haarsträhne, Horn), sonst ""

ANKERPUNKTE
- "eyeL", "eyeR", "eyeSize": Augenmitte und Radius
- "mouth": Mundmitte
- "headTop": Kopf-Oberkante in der Mitte (für Hüte) – genau auf dem Kopfumriss
- "neck": Übergang Kopf/Körper (für Schal und Halskette)
- "headPivot": Drehpunkt des Kopfes (am Hals)
- "tailPivot": Ansatz des Schwanzes am Körper

AUSGABEFORMAT (genau diese Schlüssel; name, emoji, food und egg passend zum Tier)
{
  "yippee_pet": 1,
  "name": "Name des Tiers",
  "emoji": "🐾",
  "food": "🍎",
  "egg": ["#hellfarbe", "#dunkelfarbe"],
  "parts": { "defs": "...", "back": "...", "tail": "...", "wings": "", "body": "...", "ears": "", "head": "...", "earsFront": "", "front": "" },
  "anchors": { "eyeL": [82, 64], "eyeR": [118, 64], "eyeSize": 8, "mouth": [100, 112], "headTop": [100, 36], "neck": [100, 122], "headPivot": [100, 120], "tailPivot": [134, 146] }
}

SELBSTPRÜFUNG VOR DER AUSGABE – gehe jeden Punkt durch und korrigiere:
1. Gültiges JSON, nur ' in den SVG-Strings, keine Kommentare?
2. Alle Umrisse stroke-width 3?
3. Augenpunkte und Wangen (je Radius 11) nur auf Kopffarbe?
4. Mund unter Nase/Schnauze auf Kopffarbe?
5. Ohren im richtigen Teil (hinter dem Kopf: "ears", davor: "earsFront")?
6. Füße enden bei y = 185, alles innerhalb 0–200?
7. headTop liegt genau auf der Kopf-Oberkante?
Gib erst danach das JSON aus.`;
      return `You are an illustrator for a kids' app. Draw a cute pet as SVG parts and return ONLY valid JSON in a single code block – no text before or after.

ANIMAL: ${animal}

STYLE
- Cute chibi style: big round head (about 45 % of the total height), small round body, short legs.
- Front view, slightly turned.
- The same outline on ALL shapes: stroke "#4a2f2f", stroke-width "3", stroke-linejoin "round", stroke-linecap "round" (highlights without outline).
- 2–3 tones per area (base colour, shadow, highlight) using linearGradient or radialGradient. A small white highlight (opacity 0.5) on top of head and body.
- Do NOT draw: eyes, mouth, eyebrows, cheeks, text, background, ground, shadow under the animal. The app draws eyes, mouth and cheeks itself. Nose, snout or beak belong to the head.

CANVAS AND SIZES (viewBox 0 0 200 200)
- The animal stands centred at x = 100. The feet end exactly at y = 185. Nothing goes beyond 0–200.
- Head: roughly a circle, centre (100, 78), radius about 42 → top y ≈ 36, chin y ≈ 120.
- Nose/snout/beak: centred between y = 80 and y = 104.
- Body: centre about (100, 148), the head overlaps the top of the body slightly.
- Front legs under the body, hind legs (if visible) a little further out and a little darker.

FACE – FREE AREAS FOR THE APP (very important)
- Eyes: eyeL (82, 64), eyeR (118, 64), eyeSize 8. Within a radius of 11 around each eye point there is ONLY head colour.
- Mouth: (100, 112) – below the nose/snout on free head area.
- Cheeks: the app paints them at (82, 78) and (118, 78) – only head colour there too.
- Ears, horns, hair etc. never cover eyes, cheeks or mouth.

ALLOWED SVG ELEMENTS (everything else is removed)
g, path, circle, ellipse, rect, polygon, polyline, line, linearGradient, radialGradient, stop.
Allowed attributes: d, cx, cy, r, rx, ry, x, y, x1, y1, x2, y2, width, height, points, fill, stroke, stroke-width, stroke-linecap, stroke-linejoin, opacity, fill-opacity, transform, id, offset, stop-color, stop-opacity, gradientUnits, gradientTransform, fx, fy.
Gradients only as fill="url(#id)". Use ONLY single quotes (') inside the SVG strings.

PARTS – each is an SVG fragment as a string (without the <svg> tag). The app draws them back to front:
1. "defs": all gradients
2. "back": hind legs and parts behind the body, otherwise ""
3. "tail": only the tail (the app wags it around "tailPivot"), otherwise ""
4. "wings": wings if any (the app flaps them), otherwise ""
5. "body": body with front legs
6. "ears": ears or horns standing BEHIND the head (e.g. cat, bunny), otherwise ""
7. "head": head with highlight and nose/snout/beak (without eyes and mouth)
8. "earsFront": ears hanging IN FRONT of the head (floppy ears), otherwise ""
9. "front": other parts in front of the face (e.g. a lock of hair, a horn), otherwise ""

ANCHOR POINTS
- "eyeL", "eyeR", "eyeSize": eye centres and radius
- "mouth": centre of the mouth
- "headTop": top of the head in the middle (for hats) – exactly on the head outline
- "neck": between head and body (for scarf and necklace)
- "headPivot": pivot of the head (at the neck)
- "tailPivot": where the tail joins the body

OUTPUT FORMAT (exactly these keys; name, emoji, food and egg matching the animal)
{
  "yippee_pet": 1,
  "name": "Name of the animal",
  "emoji": "🐾",
  "food": "🍎",
  "egg": ["#lightcolour", "#darkcolour"],
  "parts": { "defs": "...", "back": "...", "tail": "...", "wings": "", "body": "...", "ears": "", "head": "...", "earsFront": "", "front": "" },
  "anchors": { "eyeL": [82, 64], "eyeR": [118, 64], "eyeSize": 8, "mouth": [100, 112], "headTop": [100, 36], "neck": [100, 122], "headPivot": [100, 120], "tailPivot": [134, 146] }
}

SELF-CHECK BEFORE OUTPUT – go through every point and fix:
1. Valid JSON, only ' inside the SVG strings, no comments?
2. All outlines stroke-width 3?
3. Eye points and cheeks (radius 11 each) only on head colour?
4. Mouth below nose/snout on head colour?
5. Ears in the right part (behind the head: "ears", in front: "earsFront")?
6. Feet end at y = 185, everything within 0–200?
7. headTop exactly on the top of the head outline?
Only then output the JSON.`;
    }
    // JSON aus der KI-Antwort lesen (Codeblock-Zeichen und Text drumherum werden ignoriert) und prüfen
    _poParse(txt, id) {
      let s = String(txt || '').trim();
      if (!s) return { err: '' };
      const a = s.indexOf('{'), b = s.lastIndexOf('}');
      if (a < 0 || b <= a) return { err: T('Das ist kein gültiges JSON – bitte den ganzen Codeblock aus der KI-Antwort kopieren.') };
      s = s.slice(a, b + 1);
      let raw;
      try { raw = JSON.parse(s); } catch (e) { return { err: T('Das ist kein gültiges JSON – bitte den ganzen Codeblock aus der KI-Antwort kopieren.') }; }
      if (!raw || typeof raw !== 'object' || !raw.parts || typeof raw.parts !== 'object') return { err: T('Im JSON fehlt „parts“ – stammt die Antwort wirklich aus dem Prompt?') };
      const d = this._poClean({ ...raw, id });
      const miss = ['head', 'body'].filter((k) => !d.parts[k]);
      if (miss.length) return { err: T('Diese Teile fehlen oder konnten nicht gelesen werden: {x}', { x: miss.join(', ') }) };
      const warn = [];
      ['eyeL', 'eyeR', 'mouth'].forEach((k) => { const A = raw.anchors || raw.an || {}; if (!Array.isArray(A[k])) warn.push(k); });
      const size = Object.values(d.parts).join('').length;
      if (size > 60000) return { err: T('Das Tier ist zu groß ({n} KB) – bitte die KI um eine einfachere Zeichnung bitten.', { n: Math.round(size / 1024) }) };
      return { d, warn: warn.length ? T('Ankerpunkte fehlen, Standardwerte benutzt: {x}', { x: warn.join(', ') }) : '' };
    }
    _poDlg(id0) {
      const old = id0 && (this._db.po || {})[id0];
      const id = old ? old.id : `o_${Y.uid ? Y.uid() : Date.now().toString(36)}`.replace(/[^\w-]/g, '').slice(0, 32);
      const kids = this._kids();
      let cur = old ? JSON.parse(JSON.stringify(old)) : null, sel = old ? [...(old.kids || [])] : [];
      const json0 = old ? JSON.stringify({ yippee_pet: 1, name: old.name, emoji: old.e, food: old.food, egg: old.egg, parts: old.parts, anchors: old.an }) : '';
      const body = `${CSS}<div class="podlg">
        ${old ? '' : `<div class="sect"><span>${T('1. Prompt für die KI')}</span></div>
        <label>${T('Was für ein Haustier?')}<input id="po_desc" maxlength="200" placeholder="${esc(T('z. B. kleines rosa Schwein mit Ringelschwanz und Schlappohren'))}"></label>
        <div class="btnrow"><button type="button" class="btn" id="po_copy">${T('🤖 Prompt kopieren')}</button></div>
        <textarea id="po_out" rows="4" readonly hidden></textarea>
        <div class="hint">${T('In ChatGPT, Gemini, Claude oder Copilot einfügen. Gefällt dir das Tier nicht, sag der KI einfach, was anders sein soll – z. B. „Mach die Ohren größer“.')}</div>
        <div class="sect"><span>${T('2. Antwort der KI einfügen')}</span></div>`}
        <textarea id="po_json" rows="${old ? 3 : 5}" spellcheck="false" placeholder='{ "yippee_pet": 1, … }'>${esc(json0)}</textarea>
        <div class="btnrow"><label class="btn sm">${T('📂 Datei öffnen')}<input type="file" id="po_file" accept=".json,.txt,application/json,text/plain" hidden></label></div>
        <div id="po_msg" class="hint"></div>
        <div id="po_prev" class="poprev"></div>
        <div id="po_adj" class="poadj" hidden>
          <div class="sect"><span>${T('Feinjustieren')}</span></div>
          <div class="poadjr"><span>${T('👀 Augen')}</span><button type="button" data-po="ey" data-d="-2">▲</button><button type="button" data-po="ey" data-d="2">▼</button><button type="button" data-po="ex" data-d="-2" title="${esc(T('enger'))}">▶◀</button><button type="button" data-po="ex" data-d="2" title="${esc(T('weiter'))}">◀▶</button><button type="button" data-po="es" data-d="-1">−</button><button type="button" data-po="es" data-d="1">+</button></div>
          <div class="poadjr"><span>${T('👄 Mund')}</span><button type="button" data-po="my" data-d="-2">▲</button><button type="button" data-po="my" data-d="2">▼</button></div>
          <div class="poadjr"><span>${T('🎩 Hut')}</span><button type="button" data-po="hy" data-d="-2">▲</button><button type="button" data-po="hy" data-d="2">▼</button></div>
          <div class="poadjr"><span>${T('🧣 Schal')}</span><button type="button" data-po="ny" data-d="-2">▲</button><button type="button" data-po="ny" data-d="2">▼</button></div>
        </div>
        <label>${T('Name')}<input id="po_name" maxlength="24" value="${esc(old ? old.name : '')}"></label>
        ${kids.length > 1 ? `<div class="sect"><span>${T('Für welche Kinder? (nichts gewählt = alle)')}</span></div><div class="pick txt">${kids.map((k) => `<label><input type="checkbox" class="po_k" value="${k.id}" ${sel.includes(k.id) ? 'checked' : ''}><span>${esc(k.emoji || '🙂')} ${esc(k.name)}</span></label>`).join('')}</div>` : ''}
      </div>`;
      this._modal(old ? T('🎨 {name} bearbeiten', { name: esc(old.name) }) : T('🎨 Eigenes Haustier'), body, false, {
        save: () => {
          const msg = this.shadowRoot.querySelector('#modal #po_msg');
          if (!cur) { if (msg) { msg.textContent = T('Bitte zuerst die Antwort der KI einfügen.'); msg.classList.add('warn'); } return false; }
          const nm = (this.shadowRoot.querySelector('#modal #po_name') || {}).value || cur.name || T('Eigenes Haustier');
          sel = [...this.shadowRoot.querySelectorAll('#modal .po_k:checked')].map((x) => x.value);
          this._save('po', id, { ...cur, id, name: nm, kids: sel, u: Date.now() });
          delete OWNDEF[id]; this._poV = undefined;
          this._toast(T('🎨 {name} ist bereit!', { name: nm }));
          return true;
        },
        saveLabel: T('Speichern'),
      });
      const box = this.shadowRoot.querySelector('#modal');
      if (!box) return;
      const q = (s) => box.querySelector(s);
      const prev = () => {
        const el = q('#po_prev'), adj = q('#po_adj');
        if (!cur) { el.innerHTML = ''; adj.hidden = true; return; }
        OWNDEF[id] = cur; ANIMAL[id] = ownAnimal(cur); EGG[id] = { a: cur.egg[0], b: cur.egg[1], s: 'dots' };
        const sh = [[T('normal'), { eyes: 'open' }], [T('freut sich'), { eyes: 'happy', mouth: 'open', open: 0.7 }], [T('traurig'), { eyes: 'sad', mouth: 'sad', tear: 0.4 }], [T('Baby'), { g: 0.05 }], [T('mit Hut'), { hat: 'party', acc: { neck: '🧣' } }]];
        el.innerHTML = sh.map(([l, o]) => `<figure>${petDraw(id, { w: 92, g: 1, ...o })}<figcaption>${l}</figcaption></figure>`).join('');
        adj.hidden = false;
      };
      const parse = () => {
        const msg = q('#po_msg'), r = this._poParse(q('#po_json').value, id);
        msg.classList.remove('warn');
        if (r.err !== undefined && !r.d) { cur = null; msg.textContent = r.err; if (r.err) msg.classList.add('warn'); prev(); return; }
        cur = r.d; msg.textContent = r.warn || T('✓ Erkannt – so sieht es aus:');
        const nmEl = q('#po_name'); if (nmEl && !nmEl.value) nmEl.value = cur.name || '';
        prev();
      };
      if (old) { cur.an = { ...old.an }; prev(); }
      box.addEventListener('input', (e) => { if (e.target.id === 'po_json') parse(); });
      box.addEventListener('change', (e) => {
        if (e.target.id !== 'po_file' || !e.target.files || !e.target.files[0]) return;
        const f = e.target.files[0];
        if (f.size > 200000) { q('#po_msg').textContent = T('Die Datei ist zu groß.'); return; }
        const rd = new FileReader();
        rd.onload = () => { q('#po_json').value = String(rd.result || ''); parse(); };
        rd.readAsText(f);
      });
      box.addEventListener('click', (e) => {
        const b = e.target.closest('button,[data-po]');
        if (!b) return;
        if (b.id === 'po_copy') {
          e.stopPropagation();
          const txt = this._poPrompt((q('#po_desc') || {}).value), out = q('#po_out');
          const show = () => { out.value = txt; out.hidden = false; out.focus(); out.select(); this._toast(T('Prompt markiert – jetzt kopieren')); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => this._toast(T('🤖 Prompt kopiert')), show); else show();
          return;
        }
        if (b.dataset.po && cur) {
          e.stopPropagation();
          const d = Number(b.dataset.d) || 0, A = cur.an, cl = (v) => Math.max(-20, Math.min(220, v));
          if (b.dataset.po === 'ey') { A.eyeL = [A.eyeL[0], cl(A.eyeL[1] + d)]; A.eyeR = [A.eyeR[0], cl(A.eyeR[1] + d)]; }
          if (b.dataset.po === 'ex') { A.eyeL = [cl(A.eyeL[0] - d), A.eyeL[1]]; A.eyeR = [cl(A.eyeR[0] + d), A.eyeR[1]]; }
          if (b.dataset.po === 'es') A.eyeSize = Math.max(4, Math.min(14, A.eyeSize + d));
          if (b.dataset.po === 'my') A.mouth = [A.mouth[0], cl(A.mouth[1] + d)];
          if (b.dataset.po === 'hy') A.headTop = [A.headTop[0], cl(A.headTop[1] + d)];
          if (b.dataset.po === 'ny') A.neck = [A.neck[0], cl(A.neck[1] + d)];
          prev();
        }
      });
    }
    _hubGo(k) { Promise.resolve().then(() => { const r = this.shadowRoot; if (this._hubApply) this._hubApply(r, k); else this._exCall('_hubApply', [r, k], false); }); return ''; }
    _peTabHtml() {
      const c = this._cfg, kids = this._kids();
      const wxs = Object.keys(this._hass.states || {}).filter((e) => e.startsWith('weather.'));
      const mode = c.pePlay || 'pct';
      const rows = kids.map((k) => {
        const p = this._peP(k.id), kind = this._peKindOf(p), stg = this._peStage(k, p);
        const pic = !p.on ? `<span style="font-size:40px;width:64px;text-align:center">${esc(k.emoji || '🙂')}</span>` : kind ? petDraw(kind, { w: 64, g: stg.st ? stg.g : 0.2, crown: stg.st === 3, eyes: 'happy', ...this._peLook(p), acc: p.acc || {} }) : `<span style="font-size:40px;width:64px;text-align:center">🥚</span>`;
        const sub = !p.on ? T('kein Haustier') : !kind ? T('sucht sich beim nächsten Öffnen ein Haustier aus') : `${KIND[kind].e} ${esc(this._peName(p))} · ${esc(this._peStageN(p, stg.st))}${stg.st < 3 ? ` · ${T('noch {n} ⭐', { n: stg.need })}` : ''}`;
        return `<div class="perow">${pic}<div class="grow"><b>${esc(k.name)}</b><div class="hint">${sub}</div></div>
          ${p.on ? `<button class="btn sm" data-a="pekset" data-k="${k.id}" title="${esc(T('Bearbeiten'))}">✎</button>` : ''}
          <button class="btn sm ${p.on ? 'primary' : ''}" data-a="pekon" data-k="${k.id}" data-v="${p.on ? '' : '1'}">${p.on ? T('🐾 an') : T('aus')}</button></div>`;
      }).join('');
      const opt = (v, cur, l) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${l}</option>`;
      const tasks = Object.values(this._db.task).filter((t) => t.sched !== 'once').sort((a, b) => String(a.title).localeCompare(String(b.title)));
      return `${CSS}<div class="petab"><div class="card"><h3>${T('🐾 Haustiere')}</h3>
        <div class="hint">${T('Nur Kinder mit „🐾 an“ bekommen ein Haustier. Das Kind sucht es sich beim ersten Öffnen selbst aus – mit ✎ kannst du es auch vorgeben.')}</div>
        ${rows || `<div class="empty">${T('Noch keine Kinder angelegt – das geht in der Eltern-Ansicht unter 👧 Kinder.')}</div>`}</div>
        <div class="hubw" data-hub="pe">
        ${this._peOwnHtml()}
        <div class="card hubs" data-hid="grow"><h3>${T('🌱 Wachstum & Freischalten')}</h3>
        <label>${T('Wachstum')}<select data-cfgs="peSpeed">${opt('f', c.peSpeed || 'n', T('Schnell (25 / 75 / 200 ⭐)'))}${opt('n', c.peSpeed || 'n', T('Normal (50 / 150 / 400 ⭐)'))}${opt('s', c.peSpeed || 'n', T('Langsam (100 / 300 / 800 ⭐)'))}</select></label>
        <div class="hint">${T('Sterne seit dem Start: schlüpfen · jung · ausgewachsen. Eingelöste Sterne zählen mit – das Tier schrumpft nie.')}</div>
        <label>${T('Spielen & Füttern freischalten')}<select data-cfgs="pePlay">${opt('pct', mode, T('nach % der heutigen Aufgaben'))}${opt('cnt', mode, T('nach Anzahl erledigter Aufgaben heute'))}${opt('stars', mode, T('nach verdienten Sternen heute'))}${opt('tasks', mode, T('nach bestimmten Aufgaben'))}${opt('always', mode, T('immer'))}</select></label>
        ${mode === 'cnt' ? `<label>${T('Wie viele Aufgaben?')}<input type="number" min="1" max="100" data-pecfg="peCnt" value="${c.peCnt || 3}"></label>` : ''}
        ${mode === 'stars' ? `<label>${T('Wie viele Sterne?')}<input type="number" min="1" max="100" data-pecfg="peStars" value="${c.peStars || 10}"></label>` : ''}
        ${mode === 'pct' ? `<label>${T('Ab wie viel % der Aufgaben?')}<input type="number" min="0" max="100" step="5" data-pecfg="pePct" value="${c.pePct == null ? 50 : c.pePct}"></label>` : ''}
        ${mode === 'tasks' ? this._peTasksHtml(tasks) : ''}
        <div class="hint">${T('Streicheln und Anziehen gehen immer. Pro Kind abweichend: ✎ beim Kind.')}</div>
        </div>
        <div class="card hubs" data-hid="feed"><h3>${T('🍎 Füttern & Stimmung')}</h3>
        <label>${T('🍎 Füttern pro Tag')}<select data-cfgs="peFeed">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((v) => opt(v, String(c.peFeed || 3), v)).join('')}</select></label>
        <div class="hint">${T('Danach ist das Tier satt. Zwischen zwei Mahlzeiten liegen mindestens 5 Minuten. Pro Kind abweichend: ✎ beim Kind.')}</div>
        ${this._chk('peTears', c.peTears !== false, T('🥺 Traurig mit Träne<small>Sind am Nachmittag noch viele Aufgaben offen, wird das Tier traurig, zeigt die offenen Aufgaben und eine Träne – ohne Vorlesen. Aus: nur gelangweilt.</small>'))}
        <label>${T('Traurig ab')}<select data-cfgs="peSadH">${[12, 13, 14, 15, 16, 17, 18, 19].map((h) => opt(String(h), String(c.peSadH || 16), `${h}:00`)).join('')}</select></label>
        <div class="row2"><label>${T('Schlafen ab')}<input type="time" data-pecfg="peN0" value="${esc(c.peN0 || '20:00')}"></label><label>${T('Aufwachen um')}<input type="time" data-pecfg="peN1" value="${esc(c.peN1 || '06:30')}"></label></div>
        </div>
        <div class="card hubs" data-hid="games"><h3>${T('🎮 Spiele')}</h3>
        ${this._chk('peGames', c.peGames !== false, T('🎮 Mini-Spiele<small>Spiele mit dem eigenen Tier (Fangen, Hüpfen, Memory, Zählen, Rechnen, Bewegung). Sie bringen keine Sterne – nur einen Rekord. Als Aufgabe: im Aufgaben-Editor „🎮 Spiel als Aufgabe“.</small>'))}
        ${c.peGames !== false ? `<label>${T('Spiele pro Tag')}<select data-cfgs="peGLim">${[['1', '1'], ['2', '2'], ['3', '3'], ['5', '5'], ['10', '10'], ['0', T('unbegrenzt')]].map(([v, l]) => opt(v, String(c.peGLim == null ? 3 : c.peGLim), l)).join('')}</select></label>
        <label>${T('Versuche pro Frage – Standard für die Lernspiele')}<select data-cfgs="peTry">${['1', '2', '3'].map((v) => opt(v, String(c.peTry || 1), v)).join('')}</select></label>
        <div class="hint">${T('Punkte gibt es nur für richtige Antworten. Sind die Versuche aufgebraucht, zeigt das Spiel die Lösung und stellt die nächste Frage.')}</div>
        ${this._chk('peStat', c.peStat !== false, T('📊 Lernstatistik<small>Zählt je Kind, was in den Lernspielen richtig war und wo die Lösung gezeigt wurde – zu sehen unter ✎ beim Kind.</small>'))}
        ${this._chk('gmCh', c.gmCh !== false, T('🎯 Tages-Challenge<small>Jeden Tag ein anderes Spiel je Kind, oben in der Spielhalle. Wer es zweimal spielt, bekommt 🪙 Taler (Standard 10, je Kind unter ✎ änderbar).</small>'))}
        ${this._chk('peRep', c.peRep !== false, T('🔁 Fehler später wiederholen<small>Aufgaben, bei denen die Lösung gezeigt wurde, kommen in späteren Runden noch einmal – bis sie richtig gelöst sind. Gemerkt je Kind auf dem Gerät.</small>'))}` : ''}
        ${c.peGames === false ? this._chk('peJr', c.peJr !== false, T('🗺️ Abenteuer (Jump & Run)<small>Ein eigenes Jump & Run mit dem Haustier als Spielfigur: 10 Level in 5 Welten, Musik im 16-Bit-Stil, Steuerung „Einfach“ oder „Normal“. Bringt keine Sterne.</small>')) : ''}
        </div>
        ${c.peGames !== false ? `<div class="card hubs" data-hid="home"><h3>🏠 ${T('Zuhause')}</h3>
        ${this._chk('peHome', !!c.peHome, T('🏠 Zuhause<small>Ein eigenes Zimmer fürs Haustier: Durchs Fenster sieht man das Wetter (Regen und Schnee bleiben draußen), mit 🪙 Talern aus den Spielen kauft das Kind Möbel und Spielsachen – 20 Sachen zum Einrichten. Echte ⭐ werden nur über eine Taler-Belohnung getauscht.</small>'))}
        ${c.peHome ? (phOK ? this._phPriceHtml() : (phLoad().then(() => this._render(), () => {}), '')) : ''}
        </div>` : ''}
        ${c.peGames !== false ? `<div class="card hubs" data-hid="gs"><h3>${T('🎮 Einstellungen je Spiel')}</h3>${this._peGsHtml()}</div>` : ''}
        <div class="card hubs" data-hid="wx"><h3>${T('🌦️ Wetter')}</h3>
        <label>${T('🌦️ Wetter')}<select data-cfgs="peWx">${opt('', c.peWx || '', T('– aus –'))}${wxs.map((e) => opt(e, c.peWx || '', esc((this._hass.states[e].attributes || {}).friendly_name || e))).join('')}</select></label>
        <div class="hint">${T('Bei Regen ein Schirm, bei Schnee ein Schal, bei Sonne eine Sonnenbrille, bei Gewitter zittert es ein bisschen.')}</div>
        </div></div>${this._hubGo('pe')}</div>`;
    }

    // 🎮 Einstellungen je Spiel (cfg.gs): leer = Standard. off: Spiel ausblenden; tries/rep: Lernspiele; pairs: Memory;
    // size/num/hint: Schiebe-Puzzle; shp: Farben merken; ctl: Abenteuer-Stufe fest vorgeben
    _gmSet(g) { const gs = this._cfg.gs || {}; return (gs[g] && typeof gs[g] === 'object') ? gs[g] : {}; }
    // 🔁 je Kind: Neustart nach „alle Herzen weg“ zählt als neues Level (Darstellung wie die Zahnputz-Aufgaben)
    _peJrcHtml() {
      const kids = this._kids().filter((k) => (this._db.pk[k.id] || {}).on);
      const css = '<style>.pejrc{display:grid;gap:2px;margin-top:4px}.pejrc .lbl{font-weight:700}.pejrc .chk{display:flex;align-items:center;gap:9px;padding:7px 0;font:inherit;font-size:14px;width:100%;border:0;background:none;text-align:left;color:inherit;cursor:pointer}.pejrc .chk i{font-style:normal;width:22px;height:22px;border-radius:7px;flex:none;display:flex;align-items:center;justify-content:center;font-size:13px;background:rgba(127,127,127,.18);color:#fff}.pejrc .chk.on i{background:var(--yippee-accent,#ff8a3d)}</style>';
      return `${css}<div class="pejrc"><div class="lbl">${T('🔁 Neustart zählt als neues Level')}</div>
        <div class="hint">${T('Bei angehakten Kindern zählt ein Neustart nach „alle Herzen weg“ wie ein neues Level – fürs Tageslimit bzw. als Freispiel. Ohne Haken darf das Kind ein Level beliebig oft neu versuchen.')}</div>
        ${kids.map((k) => { const on = !!(this._db.pk[k.id] || {}).jrc; return `<button type="button" class="chk ${on ? 'on' : ''}" data-a="pejrc" data-k="${esc(k.id)}" aria-pressed="${on}"><i>${on ? '✓' : ''}</i>${esc(k.emoji || '🙂')} ${esc(k.name)}</button>`; }).join('') || `<div class="hint">${T('Noch kein Kind mit Haustier.')}</div>`}</div>`;
    }
    _peGsHtml() {
      const c = this._cfg, opt = (v, cur, l) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`;
      const sw = (g, f, on, label, hint) => `<label class="crow"><span style="flex:1;min-width:0">${label}${hint ? `<small>${hint}</small>` : ''}</span><span class="accsw" style="margin:0"><input type="checkbox" data-pecfg="gs" data-g="${g}" data-f="${f}" ${on ? 'checked' : ''} style="width:100%;height:100%"><span class="swt"></span></span></label>`;
      const sel = (g, f, cur, opts, label) => `<label>${label}<select data-pecfg="gs" data-g="${g}" data-f="${f}">${opts.map(([v, l]) => opt(v, cur, l)).join('')}</select></label>`;
      const QUIZ = ['count', 'math', 'mul', 'clock', 'abc', 'vocab', 'money'], OWNG = ['catch', 'whack', 'run', 'fly', 'fire', 'song'];
      const order = [...OWNG, 'memory', ...QUIZ, 'maze', 'train', 'board', 'lily', 'space', 'dino', 'puzzle', 'simon', 'move'];
      const block = (g) => {
        const x = this._gmSet(g), nm = GNAMES[g];
        let body = sw(g, 'on', !x.off, T('Spiel anbieten'));
        if (QUIZ.includes(g)) body += sel(g, 'tries', x.tries || '', [['', T('wie Standard ({n})', { n: c.peTry || 1 })], ['1', '1'], ['2', '2'], ['3', '3']], T('Versuche pro Frage')) + sw(g, 'rep', x.rep !== false, T('🔁 Fehler später wiederholen'));
        if (g === 'memory') body += sel(g, 'pairs', x.pairs || '', [['', T('automatisch (6 / 8 / 10 je nach Schwierigkeit)')], ...['6', '7', '8', '9', '10', '11', '12'].map((v) => [v, v])], T('Paare'));
        if (g === 'puzzle') body += sel(g, 'size', x.size || '', [['', T('automatisch (ab Klasse 3: 4×4)')], ['3', '3×3'], ['4', '4×4']], T('Größe')) + sw(g, 'num', x.num !== false, T('🔢 Zahlen auf den Teilen'), T('Startwert – das Kind kann es im Spiel umschalten.')) + sw(g, 'hint', x.hint !== false, T('💡 Tipp-Knopf'));
        if (g === 'simon') body += sw(g, 'shp', x.shp !== false, T('◆ Formen auf den Farben'), T('Startwert – das Kind kann es im Spiel umschalten.'));
        return `<details class="gmset"><summary><span>${nm[0]} ${esc(T(nm[1]))}</span>${x.off ? `<em>${T('aus')}</em>` : ''}</summary><div class="gmsetb">${body}</div></details>`;
      };
      const jx = this._gmSet('jr');
      const jr = `<details class="gmset"><summary><span>🗺️ ${esc(T('Abenteuer (Jump & Run)'))}</span>${c.peJr === false ? `<em>${T('aus')}</em>` : ''}</summary><div class="gmsetb">
        <label class="crow"><span style="flex:1;min-width:0">${T('Spiel anbieten')}</span><span class="accsw" style="margin:0"><input type="checkbox" data-a="cfg" data-k="peJr" ${c.peJr !== false ? 'checked' : ''} style="width:100%;height:100%"><span class="swt"></span></span></label>
        <label>${T('Abenteuer-Level pro Tag')}<select data-cfgs="peJrLim">${[['1', '1'], ['2', '2'], ['3', '3'], ['5', '5'], ['10', '10'], ['0', T('unbegrenzt')]].map(([v, l]) => opt(v, String(c.peJrLim == null ? 3 : c.peJrLim), l)).join('')}</select></label>
        ${sel('jr', 'ctl', jx.ctl || '', [['', T('Kind wählt selbst')], ['e', T('immer „Einfach“')], ['n', T('immer „Normal“')], ['h', T('immer „Schwer“')]], T('Stufe'))}
        ${sw('jr', 'gate', !!jx.gate, T('🚪 Fragetore'), T('Vor den Fähnchen steht ein Tor – es geht mit einer Frage aus den Lernspielen auf (Rechnen, Zählen, Buchstaben, Uhr, Geld). Richtig = +3 ⭐, falsch = Tor geht trotzdem auf.'))}
        ${this._peJrcHtml()}
        <div class="hint">${T('„Läuft von allein“ stellst du je Kind ein: ✎ beim Kind.')}</div></div></details>`;
      const css = '<style>.gmsets{display:grid;gap:6px;margin:4px 0 8px}.gmset{border-radius:14px;background:rgba(127,127,127,.08)}.gmset summary{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;font-weight:700;list-style:none}.gmset summary::-webkit-details-marker{display:none}.gmset summary:before{content:"▸";opacity:.6;transition:transform .15s}.gmset[open] summary:before{transform:rotate(90deg)}.gmset summary span{flex:1}.gmset summary em{font-style:normal;font-size:12px;font-weight:800;padding:2px 8px;border-radius:999px;background:rgba(250,82,82,.15);color:#c92a2a}.gmsetb{display:grid;gap:8px;padding:0 12px 12px}</style>';
      return `${css}<div class="gmsets">${order.map(block).join('')}${jr}</div>`;
    }

    // „nach bestimmten Aufgaben“: oben ein Kind wählen – „Alle Kinder“ = gemeinsame Grundeinstellung, ein Kind = nur seine Aufgaben,
    // die Auswahl gilt dann nur für dieses Kind (wie ✎ beim Kind). Bei „Alle Kinder“ steht hinter jeder Aufgabe, für wen sie ist.
    _peTasksHtml(tasks) {
      const c = this._cfg, kids = this._kids(), sel = kids.some((k) => k.id === this._peTk) ? this._peTk : '';
      const own = (id) => { const p = this._peP(id); return p.play && p.play.m === 'tasks'; };
      const dd = `<label>${T('Für')}<select data-pecfg="peTk"><option value="" ${!sel ? 'selected' : ''}>${esc(T('👨‍👩‍👧 Alle Kinder'))}</option>${kids.map((k) => `<option value="${esc(k.id)}" ${sel === k.id ? 'selected' : ''}>${esc(`${k.emoji || '🙂'} ${k.name}${own(k.id) ? ' ✓' : ''}`)}</option>`).join('')}</select></label>`;
      let list = tasks, cur = c.peTasks || [], note = '';
      if (sel) {
        list = tasks.filter((t) => (t.kids || []).includes(sel));
        const p = this._peP(sel);
        if (own(sel)) { cur = p.play.t || []; note = `<div class="hint">${T('✓ Eigene Auswahl für {name}.', { name: esc((this._db.kid[sel] || {}).name || '') })} <button type="button" class="btn sm" data-a="petkr" data-k="${esc(sel)}">${T('↩️ Wie bei allen Kindern')}</button></div>`; }
        else { cur = (c.peTasks || []).filter((id) => list.some((t) => t.id === id)); note = `<div class="hint">${T('Noch wie bei allen Kindern – ein Häkchen setzt eine eigene Auswahl für {name}.', { name: esc((this._db.kid[sel] || {}).name || '') })}</div>`; }
      }
      const who = (t) => (sel ? '' : ` <small>· ${(t.kids || []).map((id) => this._db.kid[id]).filter(Boolean).map((k) => esc(k.name)).join(', ')}</small>`);
      return `<div class="sect"><span>${T('Diese Aufgaben müssen erledigt sein (wenn sie heute dran sind):')}</span></div>${dd}${note}
        ${PELIST_CSS}<div class="pelist">${list.map((t) => `<label><input type="checkbox" data-pecfg="peTasks" data-v="${t.id}" ${cur.includes(t.id) ? 'checked' : ''}><i></i><span>${esc(t.emoji || '📋')} ${esc(t.title)}${who(t)}</span></label>`).join('') || `<div class="hint">${T('Noch keine Aufgaben für dieses Kind.')}</div>`}</div>`;
    }
    // Füttern: wie oft am Tag (je Kind oder wie eingestellt, Standard 3)
    _peFeedMax(p) { return Math.max(1, Math.min(10, Math.round(Number(p.fd) || Number(this._cfg.peFeed) || 3))); }

    // ---------- Aktionen ----------
    _peAct(a, ds, el) {
      const kid = ds.k, k = kid ? this._db.kid[kid] : null;
      const p = kid ? this._peP(kid) : {};
      const today = dk(new Date());
      const sayB = (t, ms) => { if (k) { this._peBubSet(kid, t, ms); this._peSay(k, t); } };
      if (a === 'pepick') { this._pePick = this._pePick || {}; const cur = this._pePick[kid] || {}; const nm = this.shadowRoot.querySelector('#pename'); this._pePick[kid] = { ...cur, kind: ds.v, name: nm && nm.value !== T(KIND[cur.kind || 'dog'].nm) ? nm.value : '' }; this._render(); return; }
      if (a === 'pepl') { this._pePick = this._pePick || {}; const nm = this.shadowRoot.querySelector('#pename'); this._pePick[kid] = { ...(this._pePick[kid] || { kind: 'dog' }), [ds.f]: Number(ds.v) || 0, ...(nm ? { name: nm.value } : {}) }; this._render(); return; }
      if (a === 'pestart') {
        const sel = (this._pePick || {})[kid] || { kind: 'dog' }, nm = this.shadowRoot.querySelector('#pename');
        const name = String((nm && nm.value) || T(KIND[sel.kind].nm)).replace(/[<>]/g, '').trim().slice(0, 24) || T(KIND[sel.kind].nm);
        this._peSet(kid, { on: true, kind: sel.kind, name, t0: Number(k.total) || 0, s: 0, h: false, skin: sel.skin || 0, hair: sel.hair || 0, hs: sel.hs || 0, col: sel.col || 0 });
        delete this._pePick[kid];
        this._render();
        return;
      }
      if (a === 'petap') {
        if (!k) return;
        const stg = this._peStage(k, p);
        this._peDo(kid, 'tap', 900);
        if (!stg.st) { sayB(stg.need <= 5 ? T('Tock tock … gleich! 🐣') : T('Tock tock! Noch {n} ⭐.', { n: stg.need }), 2500); return; }
        const mood = this._peMood(k);
        if (mood.m === 'sleep') { this._peFx(kid, [['💤', 60, 20]]); return; }
        const L = [T('Hihi! 😄'), T('Huch! 😊'), T('Nochmal! 🤩'), T('Das kitzelt! 😆')];
        if (mood.m !== 'sad') sayB(L[Math.floor(Math.random() * L.length)], 2200);
        this._peFx(kid, [['❤️', 50, 20]]);
        return;
      }
      if (a === 'pepet') {
        this._peDo(kid, 'pet', 2600);
        this._peHtmlFx(kid, '<span class="pehand">🤚</span>', 2700);
        this._peFx(kid, [['💕', 25, 30, 0.5], ['💕', 75, 26, 1.1], ['💕', 50, 16, 1.7]]);
        sayB([T('Hihi, das kitzelt! 😊'), T('Mehr! 🥰'), T('Das ist schön! 💕')][Math.floor(Math.random() * 3)], 2800);
        return;
      }
      if (a === 'pefeed' || a === 'peplay') {
        const un = this._peUnlock(k, p), mood = this._peMood(k);
        if (mood.m === 'sleep') { this._toast(T('Pssst … {name} schläft. 😴', { name: this._peName(p) })); return; }
        if (!un.ok) { this._toast(String(un.why || '').replace(/<[^>]+>/g, '')); this._peDo(kid, 'tap', 600); return; }
        const K = KIND[this._peKindOf(p) || 'dog'], d0 = p.d && p.d.d === today ? p.d : { d: today, f: 0, b: 0, g: 0, gs: 0 };
        if (a === 'pefeed') {
          // höchstens „Füttern pro Tag“, und zwischen zwei Mahlzeiten mindestens 5 Minuten
          if ((d0.f || 0) >= this._peFeedMax(p)) { sayB(T('Ich bin satt! 😋'), 2500); this._peDo(kid, 'tap', 700); return; }
          const wait = (Number(d0.ft) || 0) + 5 * 60000 - Date.now();
          if (wait > 0) { const m = Math.ceil(wait / 60000); sayB(m > 1 ? T('Ich bin noch satt – in {n} Minuten wieder! 😋', { n: m }) : T('Ich bin noch satt – in einer Minute wieder! 😋'), 2800); this._peDo(kid, 'tap', 700); return; }
          this._peDo(kid, 'feed', 3200);
          this._peHtmlFx(kid, `<span class="pefood">${K.food}</span>`, 3300);
          setTimeout(() => sayB(T('Mmh, lecker! 😋'), 2500), 2800);
          this._peSet(kid, { d: { ...d0, f: (d0.f || 0) + 1, ft: Date.now() } });
        } else {
          this._peDo(kid, 'play', 3600);
          this._peHtmlFx(kid, `<span class="petoy">${K.toy}</span>`, 3700);
          setTimeout(() => sayB(T('Nochmal! Nochmal! 🤩'), 2500), 3300);
          this._peSet(kid, { d: { ...d0, b: (d0.b || 0) + 1 } });
        }
        return;
      }
      if (a === 'peacc') { this._peAccDlg(kid); return; }
      if (a === 'pehome' || a === 'pehback') { this._phV = { ...(this._phV || {}), [kid]: a === 'pehome' }; if (a === 'pehome') this._peBdTl(kid); else this._phG = null; this._render(); return; }
      if (['pehbuy', 'pehtog', 'pehwall', 'pehmv', 'pehok', 'pehtidy', 'pehroom', 'pehvis', 'pehbye'].includes(a)) { phLoad().then(() => this._phAct(a, ds)); return; }
      if (a === 'pehreset' && this._isParent()) { this._setCfg({ phPr: {} }); this._render(); return; }
      if (a === 'pegames') {
        const un = this._peUnlock(k, p), mood = this._peMood(k);
        if (mood.m === 'sleep') { this._toast(T('Pssst … {name} schläft. 😴', { name: this._peName(p) })); return; }
        if (!un.ok) { this._toast(String(un.why || '').replace(/<[^>]+>/g, '')); return; }
        gmLoad().then(() => this._gmMenu(kid), () => gmErr(this));
        return;
      }
      // Aufgabe mit Spiel: Spiel starten, nach dem Ziel wird abgehakt
      if (a === 'pegmgo') {
        const t = this._db.task[ds.t], gm = t && this._gmTask(t);
        if (!gm || !k) return;
        if (this._st(today, t.id, kid) === 'd') { gmLoad().then(() => this._gmPrac(kid, t.id), () => gmErr(this)); return; } // schon erledigt: üben
        gmLoad().then(() => this._gmStart(kid, gm.g, { tid: t.id, n: gm.n || this._gmQn(kid) }), () => gmErr(this));
        return;
      }
      // Eltern
      if (a === 'pekon') { this._peSet(kid, { on: !!ds.v }); return; }
      if (a === 'pepoadd') { this._poDlg(''); return; }
      if (a === 'pepoed') { this._poDlg(ds.v); return; }
      if (a === 'pepodel') {
        if (this._poSure !== ds.v) { this._poSure = ds.v; clearTimeout(this._poSureT); this._poSureT = setTimeout(() => { this._poSure = ''; this._render(); }, 4000); this._render(); return; }
        this._poSure = ''; this._del('po', ds.v); this._poV = undefined; this._render(); return;
      }
      if (a === 'pekset') { this._peKidDlg(kid); return; }
      if (a === 'pejrc' && this._isParent() && this._db.kid[ds.k]) { this._peSet(ds.k, { jrc: (this._db.pk[ds.k] || {}).jrc ? undefined : true }); this._render(); return; }
      if (a === 'petkr' && this._isParent() && this._db.kid[ds.k]) { const p = this._peP(ds.k); this._peSet(ds.k, { play: { m: '', p: (p.play && p.play.p != null ? p.play.p : 50), t: [] } }); this._render(); return; }
      // Eingaben im Tab 🐾 (über das change-Ereignis der Karte)
      if (a === 'pechg' && this._isParent()) {
        const f = ds.pecfg, v = el ? el.value : '';
        if (f === 'phF') { this._setCfg({ phF: [0.5, 1, 2, 3].includes(Number(v)) ? Number(v) : 1 }); this._render(); return; }
        if (f === 'tlMax') { this._setCfg({ tlMax: [0, 5, 10, 15, 20, 30].includes(Number(v)) ? Number(v) : 10 }); this._render(); return; }
        if (f === 'phPr' && ds.id && /^[a-z]{2,10}$/.test(ds.id)) {
          const pr = { ...(this._cfg.phPr || {}) }, n = Math.round(Number(v));
          if (v === '' || !Number.isFinite(n)) delete pr[ds.id]; else pr[ds.id] = Math.max(0, Math.min(999, n));
          this._setCfg({ phPr: pr }); return;
        }
        if (f === 'pePct') this._setCfg({ pePct: Math.max(0, Math.min(100, Math.round(Number(v) || 0))) });
        if (f === 'peCnt' || f === 'peStars') this._setCfg({ [f]: Math.max(1, Math.min(100, Math.round(Number(v) || 1))) });
        if ((f === 'peN0' || f === 'peN1') && /^\d\d:\d\d$/.test(v)) this._setCfg({ [f]: v });
        if (f === 'gs' && GNAMES[ds.g] !== undefined || (f === 'gs' && ds.g === 'jr')) {
          const gs = { ...(this._cfg.gs || {}) }, x = { ...(gs[ds.g] || {}) }, k = ds.f;
          if (k === 'on') { if (el && el.checked) delete x.off; else x.off = true; }
          else if (['rep', 'num', 'hint', 'shp'].includes(k)) { if (el && el.checked) delete x[k]; else x[k] = false; }
          else if (k === 'gate') { if (el && el.checked) x.gate = true; else delete x.gate; }
          else if (['tries', 'pairs', 'size'].includes(k)) { if (v) x[k] = Number(v); else delete x[k]; }
          else if (k === 'ctl') { if (v === 'e' || v === 'n' || v === 'h') x.ctl = v; else delete x.ctl; }
          if (Object.keys(x).length) gs[ds.g] = x; else delete gs[ds.g];
          this._setCfg({ gs }); return;
        }
        if (f === 'peTk') { this._peTk = v; this._render(); return; }
        if (f === 'peTasks') {
          const kid = this._peTk && this._db.kid[this._peTk] ? this._peTk : '';
          if (kid) {
            // nur für dieses Kind: beim ersten Häkchen die gemeinsame Auswahl (seine Aufgaben) übernehmen
            const p = this._peP(kid), mine = p.play && p.play.m === 'tasks', ids = new Set(Object.values(this._db.task).filter((t) => (t.kids || []).includes(kid)).map((t) => t.id));
            const cur = new Set(mine ? (p.play.t || []) : (this._cfg.peTasks || []).filter((id) => ids.has(id)));
            if (el && el.checked) cur.add(ds.v); else cur.delete(ds.v);
            this._peSet(kid, { play: { m: 'tasks', p: (p.play && p.play.p != null ? p.play.p : 50), t: [...cur] } });
            if (!mine) setTimeout(() => this._render(), 0);
          } else { const cur = new Set(this._cfg.peTasks || []); if (el && el.checked) cur.add(ds.v); else cur.delete(ds.v); this._setCfg({ peTasks: [...cur] }); }
        }
        return;
      }
    }

    // Zubehör aussuchen (Kind): nur, was das Level schon freigeschaltet hat
    _peAccDlg(kid) {
      const k = this._db.kid[kid], p = this._peP(kid), lv = levelOf(k.total) + 1, cur = { ...(p.acc || {}) };
      const slot = (s, lab) => `<div class="sect"><span>${lab}</span></div><div class="pesw"><button type="button" data-s="${s}" data-e="" class="${!cur[s] ? 'on' : ''}">✖️</button>${ACC.filter((a) => a[1] === s).map((a) => a[2] <= lv ? `<button type="button" data-s="${s}" data-e="${a[0]}" class="${cur[s] === a[0] ? 'on' : ''}">${a[0]}</button>` : `<button type="button" disabled title="${esc(T('ab Level {n}', { n: a[2] }))}" style="opacity:.35">${a[0]}</button>`).join('')}</div>`;
      this._modal(T('👕 Anziehen'), `${CSS}<div class="hint">${T('Mit jedem Level gibt es neues Zubehör.')}</div>${slot('head', T('Kopf'))}${slot('eyes', T('Augen'))}${slot('neck', T('Hals'))}`, false, {
        save: () => { this._peSet(kid, { acc: cur }); return true; }, saveLabel: T('Anziehen'),
      });
      const box = this.shadowRoot.querySelector('#modal');
      if (box) box.addEventListener('click', (e) => {
        const b = e.target.closest('[data-s]'); if (!b) return;
        e.stopPropagation(); cur[b.dataset.s] = b.dataset.e || '';
        box.querySelectorAll(`[data-s="${b.dataset.s}"]`).forEach((x) => x.classList.toggle('on', x === b));
      });
    }

    // Eltern: Spielstände eines Kindes zurücksetzen – je Spiel (Rekord), Abenteuer (Level & Kronen) oder „heute gespielt“ (Tageszähler).
    // Zweimal tippen zum Löschen; wirkt sofort (auch ohne Speichern).
    // 📊 Lernstatistik je Kind: dieser Monat und die letzten 6 Monate je Lernspiel
    _peStatHtml(kid) {
      const ls = (this._db.pk[kid] || {}).ls || {}, cur = dk(new Date()).slice(0, 7), ms = Object.keys(ls);
      const sum = (g, only) => ms.filter((m) => !only || m === only).reduce((a, m) => { const v = (ls[m] || {})[g] || [0, 0, 0]; return [a[0] + v[0], a[1] + v[1], a[2] + v[2]]; }, [0, 0, 0]);
      const pc = (a, b) => (b ? `${Math.round((a / b) * 100)} %` : '–'), wq = ((this._db.pk[kid] || {}).wq || []).slice(0, 8);
      const rows = ['math', 'mul', 'count', 'clock', 'abc', 'vocab', 'money'].map((g) => {
        const all = sum(g); if (!(all[0] + all[2])) return '';
        const m = sum(g, cur), q = all[0] ? all[1] / all[0] : 0, nm = GNAMES[g] || ['🎮', g];
        return `<tr><td>${nm[0]} ${esc(T(nm[1]))}</td><td>✓ ${m[0]}${m[2] ? ` · <span class="pstw">✗ ${m[2]}</span>` : ''}</td><td>✓ ${all[0]}${all[2] ? ` · <span class="pstw">✗ ${all[2]}</span>` : ''}</td><td><span class="pstq" style="--q:${Math.round(q * 100)}%"></span>${pc(all[1], all[0])}</td></tr>`;
      }).join('');
      const css = '<style>.pstat{width:100%;border-collapse:collapse;font-size:13px}.pstat th{text-align:left;font-weight:700;opacity:.7;padding:4px 4px}.pstat td{padding:6px 4px;border-top:1px solid rgba(127,127,127,.18);white-space:nowrap}.pstat td:first-child{white-space:normal}.pstw{color:#c92a2a}.pstwq{display:grid;gap:4px;font-size:13px}.pstwq div{display:flex;gap:8px;justify-content:space-between;padding:5px 8px;border-radius:8px;background:rgba(201,42,42,.07)}.pstwq b{color:#c92a2a;white-space:nowrap}.pstq{display:inline-block;width:34px;height:8px;border-radius:4px;margin-right:6px;vertical-align:middle;background:linear-gradient(90deg,#2f9e44 var(--q),rgba(127,127,127,.2) var(--q))}.pstwrap{overflow-x:auto;flex-shrink:0}</style>';
      return `<div class="sect"><span>${T('📊 Lernstatistik')}</span></div>${rows ? `${css}<div class="pstwrap"><table class="pstat"><tr><th>${T('Spiel')}</th><th>${T('Dieser Monat')}</th><th>${T('6 Monate')}</th><th>${T('Beim 1. Versuch')}</th></tr>${rows}</table></div>
        <div class="hint">${T('✓ richtig gelöst · ✗ Lösung wurde gezeigt. „Beim 1. Versuch“: wie oft die erste Antwort gleich stimmte.')}</div>` : wq.length ? '' : `<div class="hint">${T('Noch keine Lernspiele gespielt.')}</div>`}${wq.length ? `${rows ? '' : css}<div class="lbl" style="margin-top:8px">${T('🔁 Oft falsch')}</div><div class="pstwq">${wq.map((x) => `<div><span>${(GNAMES[x[0]] || ['🎮'])[0]} ${esc(x[1])}</span><b>${x[2]}×</b></div>`).join('')}</div><div class="hint">${T('Diese Fragen kommen in den Spielen öfter wieder dran. Richtig gelöst zählt eins runter.')}</div>` : ''}`;
    }

    _peRstHtml(kid) {
      const p = this._peP(kid), hi = p.hi || {}, jr = p.jr || {}, d = p.d && p.d.d === dk(new Date()) ? p.d : {};
      const b = (v, l) => `<button type="button" class="btn sm" data-rs="${v}">${l}</button>`;
      const games = Object.keys(GNAMES).filter((g) => hi[g]).map((g) => b(`hi:${g}`, `${GNAMES[g][0]} ${T(GNAMES[g][1])} · 🏆 ${hi[g]}`));
      const items = [
        ...games,
        ...(games.length > 1 ? [b('hi:*', T('🏆 Alle Rekorde'))] : []),
        ...((jr.u || 1) > 1 || Object.keys(jr.c || {}).length ? [b('jr', `🗺️ ${T('Abenteuer (Level und Kronen)')}`)] : []),
        ...((d.g || d.gs || d.a) ? [b('day', T('📅 Heute gespielt (Tageslimit)'))] : []),
      ];
      return `<div class="sect"><span>${T('🔄 Spielstände zurücksetzen')}</span></div>
        ${items.length ? `<div class="hint">${T('Zum Löschen zweimal tippen. Wirkt sofort.')}</div><div class="btnrow" style="flex-wrap:wrap">${items.join('')}</div>` : `<div class="hint">${T('Noch keine Spielstände.')}</div>`}`;
    }
    _peRst(kid, b) {
      if (b.disabled) return;
      if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.dataset.l = b.textContent; b.textContent = T('Wirklich löschen? Nochmal tippen'); b.classList.add('danger'); setTimeout(() => { if (b.isConnected && b.dataset.sure === '1' && !b.disabled) { b.dataset.sure = ''; b.textContent = b.dataset.l; b.classList.remove('danger'); } }, 4000); return; }
      const v = b.dataset.rs, p = this._peP(kid);
      if (v === 'jr') this._peSet(kid, { jr: { u: 1, c: {}, ctl: (p.jr && p.jr.ctl) || 'e', ...(p.jr && p.jr.a ? { a: true } : {}) } });
      else if (v === 'day') { const today = dk(new Date()), d0 = p.d && p.d.d === today ? p.d : { d: today, f: 0, b: 0 }; this._peSet(kid, { d: { ...d0, g: 0, gs: 0, a: 0 } }); }
      else if (v === 'hi:*') this._peSet(kid, { hi: {} });
      else if (v.startsWith('hi:')) { const hi = { ...(p.hi || {}) }; delete hi[v.slice(3)]; this._peSet(kid, { hi }); }
      b.disabled = true; b.textContent = T('✓ Zurückgesetzt'); b.classList.remove('danger');
    }

    // Eltern: Haustier eines Kindes bearbeiten (Tier, Name, Aussehen, Freischalten, neues Ei)
    _peKidDlg(kid) {
      const k = this._db.kid[kid], p = this._peP(kid), st = { kind: this._peKindOf(p) || 'dog', ...this._peLook(p), lv: p.lv || '', qn: p.qn || 5, fd: p.fd ? String(p.fd) : '', jra: !!(p.jr && p.jr.a), gl: p.gl == null ? '' : String(p.gl), jl: p.jl == null ? '' : String(p.jl), bt: p.bt == null ? '' : String(p.bt), ct: p.ct == null ? '' : String(p.ct), play: { m: '', p: 50, t: [], ...(p.play || {}) } };
      const tasks = Object.values(this._db.task).filter((t) => t.sched !== 'once' && (t.kids || []).includes(kid));
      const opt = (v, cur, l) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${l}</option>`;
      const body = () => `${CSS}<label>${T('Haustier')}<select id="pek_kind">${this._peKinds(kid).map((x) => opt(x, st.kind, `${KIND[x].e} ${T(KIND[x].n)}`)).join('')}</select></label>
        <label>${T('Name')}<input id="pek_name" maxlength="24" value="${esc(p.name || T(KIND[st.kind].nm))}"></label>
        ${KIND[st.kind].human ? this._peLookHtml(st.kind, st, 'pekl') : ''}
        <label>${T('Spielen & Füttern freischalten')}<select id="pek_play">${opt('', st.play.m, T('wie in den Einstellungen'))}${opt('pct', st.play.m, T('nach % der heutigen Aufgaben'))}${opt('cnt', st.play.m, T('nach Anzahl erledigter Aufgaben heute'))}${opt('stars', st.play.m, T('nach verdienten Sternen heute'))}${opt('tasks', st.play.m, T('nach bestimmten Aufgaben'))}${opt('always', st.play.m, T('immer'))}</select></label>
        <div id="pek_cnt" ${['cnt', 'stars'].includes(st.play.m) ? '' : 'hidden'}><label>${T('Wie viele? (Aufgaben bzw. Sterne)')}<input type="number" min="1" max="100" id="pek_n" value="${st.play.n || (st.play.m === 'stars' ? 10 : 3)}"></label></div>
        <div id="pek_pct" ${st.play.m === 'pct' ? '' : 'hidden'}><label>${T('Ab wie viel % der Aufgaben?')}<input type="number" min="0" max="100" step="5" id="pek_p" value="${st.play.p}"></label></div>
        <div id="pek_tasks" ${st.play.m === 'tasks' ? '' : 'hidden'}>${PELIST_CSS}<div class="pelist">${tasks.map((t) => `<label><input type="checkbox" class="pek_t" value="${t.id}" ${st.play.t.includes(t.id) ? 'checked' : ''}><i></i><span>${esc(t.emoji || '📋')} ${esc(t.title)}</span></label>`).join('') || `<div class="hint">${T('Noch keine Aufgaben für dieses Kind.')}</div>`}</div></div>
        <label>${T('🧮 Schwierigkeit der Lernspiele')}<select id="pek_lv">${opt('', st.lv, T('automatisch (Alter und Land)'))}${opt('v', st.lv, T('Vorschule'))}${['1', '2', '3', '4', '5', '6'].map((x) => opt(x, st.lv, T('Klasse {n}', { n: x }))).join('')}</select></label>
        <div class="hint">${T('Automatisch: aus der Einschulung (🎓 Schulnoten) oder aus Geburtstag und Einschulungsalter des Landes. Jetzt: {x}', { x: this._gmLvlName(this._gmLvlAuto(kid)) })}</div>
        <label>${T('🔢 Fragen pro Runde (Rechnen, Zählen)')}<input type="number" id="pek_qn" min="3" max="30" value="${st.qn}"></label>
        <div class="hint">${T('Gilt für die Freizeit-Spiele und für Spiel-Aufgaben mit „wie beim Kind“. Gezählt werden nur richtige Antworten.')}</div>
        ${this._cfg.peGames !== false ? `<label>${T('🎟️ Freispiele (Guthaben)')}<input type="number" min="0" max="999" id="pek_fs" value="${p.fs || 0}"></label><div class="hint">${T('Kommen aus Gutschein-Belohnungen und verfallen nie. Hier lässt sich das Guthaben korrigieren.')}</div>` : ''}
        ${this._cfg.peGames !== false ? `<label>${T('🕹️ Spiele pro Tag')}<select id="pek_gl">${opt('', st.gl, T('wie in den Einstellungen ({n})', { n: this._cfg.peGLim == null ? 3 : Number(this._cfg.peGLim) || T('unbegrenzt') }))}${['1', '2', '3', '4', '5', '6', '8', '10'].map((v) => opt(v, st.gl, v)).join('')}${opt('0', st.gl, T('unbegrenzt'))}</select></label><div class="hint">${T('Z. B. kleines Kind 3 Spiele, großes Kind 5 Spiele am Tag.')}</div>` : ''}
        <label>${T('🍎 Füttern pro Tag')}<select id="pek_fd">${opt('', st.fd, T('wie in den Einstellungen ({n})', { n: this._cfg.peFeed || 3 }))}${['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((v) => opt(v, st.fd, v)).join('')}</select></label>
        ${this._cfg.peJr !== false ? `<div class="sect"><span>${T('🗺️ Abenteuer')}</span></div>
        <label class="crow"><span style="flex:1;min-width:0">${T('🏃 Läuft von allein – nur tippen zum Springen (für Kleine)')}<small>${T('Aus: Das Kind steuert selbst mit ◀ ▶ und springt mit ⤒.')}</small></span><span class="accsw" style="margin:0"><input type="checkbox" id="pek_jra" ${st.jra ? 'checked' : ''} style="width:100%;height:100%"><span class="swt"></span></span></label>
        <label>${T('🗺️ Abenteuer-Level pro Tag')}<select id="pek_jl">${opt('', st.jl, T('wie in den Einstellungen ({n})', { n: this._cfg.peJrLim == null ? 3 : Number(this._cfg.peJrLim) || T('unbegrenzt') }))}${['1', '2', '3', '4', '5', '6', '8', '10'].map((v) => opt(v, st.jl, v)).join('')}${opt('0', st.jl, T('unbegrenzt'))}</select></label>` : ''}
        ${this._cfg.peHome ? `<div class="sect"><span>${T('🪙 Taler-Boni')}</span></div>
        <label>${T('🎂 Geburtstags-Taler')}<input type="number" min="0" max="999" id="pek_bt" placeholder="50" value="${esc(st.bt)}"></label>
        <label>${T('🎯 Taler für die Tages-Challenge')}<input type="number" min="0" max="99" id="pek_ct" placeholder="10" value="${esc(st.ct)}"></label>
        <div class="hint">${T('Leer = Standard (50 und 10). 0 = keine Taler.')}</div>` : ''}
        ${this._cfg.peGames !== false && this._cfg.peStat !== false ? this._peStatHtml(kid) : ''}
        ${this._peRstHtml(kid)}
        <div class="sect"><span>${T('🥚 Neues Haustier')}</span></div><div class="hint">${T('Fängt wieder beim Ei an. Das bisherige kommt in die 📸 Erinnerungen.')}</div>
        <div class="btnrow"><button type="button" class="btn sm" id="pek_new">${T('🥚 Neues Ei starten')}</button></div>`;
      const read = () => {
        const q = (s) => this.shadowRoot.querySelector(`#modal ${s}`);
        return { name: (q('#pek_name') || {}).value, m: (q('#pek_play') || {}).value || '', pp: Number((q('#pek_p') || {}).value), lv: (q('#pek_lv') || {}).value || '', qn: Number((q('#pek_qn') || {}).value) || 5, fd: q('#pek_fd') ? q('#pek_fd').value : st.fd, jra: q('#pek_jra') ? q('#pek_jra').checked : st.jra, gl: q('#pek_gl') ? q('#pek_gl').value : st.gl, jl: q('#pek_jl') ? q('#pek_jl').value : st.jl, bt: q('#pek_bt') ? q('#pek_bt').value.trim() : st.bt, ct: q('#pek_ct') ? q('#pek_ct').value.trim() : st.ct, t: [...this.shadowRoot.querySelectorAll('#modal .pek_t:checked')].map((x) => x.value), n: Number((q('#pek_n') || {}).value) || 0, fs: q('#pek_fs') ? Number(q('#pek_fs').value) : null };
      };
      let fresh = false;
      const open = () => {
        this._modal(T('🐾 Haustier von {name}', { name: esc(k.name) }), body(), false, {
          save: () => {
            const r = read(), q0 = (x) => this.shadowRoot.querySelector(`#modal ${x}`);
            const patch = { kind: st.kind, name: String(r.name || '').replace(/[<>]/g, '').trim().slice(0, 24) || T(KIND[st.kind].nm), skin: st.skin, hair: st.hair, hs: st.hs, col: st.col, lv: r.lv, qn: Math.max(3, Math.min(30, Math.round(r.qn))), fd: r.fd ? Math.max(1, Math.min(10, Number(r.fd))) : undefined, play: { m: r.m, p: Math.max(0, Math.min(100, Math.round(r.pp || 0))), t: r.t, ...(['cnt', 'stars'].includes(r.m) ? { n: Math.max(1, Math.min(100, Math.round(r.n || 1))) } : {}) } };
            const num = (v, mx) => (v === '' || v == null || !Number.isFinite(Number(v)) ? undefined : Math.max(0, Math.min(mx, Math.round(Number(v)))));
            patch.gl = num(r.gl, 99); patch.jl = num(r.jl, 99); patch.bt = num(r.bt, 999); patch.ct = num(r.ct, 99);
            if (r.fs !== null && Number.isFinite(r.fs)) patch.fs = Math.max(0, Math.min(999, Math.round(r.fs))) || undefined;
            if (q0('#pek_jra')) { const jr = { u: 1, c: {}, ctl: 'e', ...((this._db.pk[kid] || {}).jr || {}) }; if (r.jra) jr.a = true; else delete jr.a; patch.jr = jr; }
            if (fresh) {
              const stg = this._peStage(k, p), old = [...(p.old || [])];
              if (this._peKindOf(p)) old.unshift({ kind: p.kind, name: this._peName(p), to: dk(new Date()), g: stg.st });
              Object.assign(patch, { t0: Number(k.total) || 0, s: 0, h: false, acc: {}, old: old.slice(0, 20) });
            }
            this._peSet(kid, patch);
            return true;
          },
        });
        const box = this.shadowRoot.querySelector('#modal');
        if (!box) return;
        box.addEventListener('change', (e) => {
          const id = e.target.id;
          if (id === 'pek_kind') { const r = read(); st.kind = e.target.value; st.lv = r.lv; st.qn = r.qn; st.fd = r.fd; st.jra = r.jra; st.gl = r.gl; st.jl = r.jl; st.bt = r.bt; st.ct = r.ct; st.play = { m: r.m, p: r.pp, t: r.t, n: r.n }; open(); }
          if (id === 'pek_play') { box.querySelector('#pek_pct').hidden = e.target.value !== 'pct'; box.querySelector('#pek_tasks').hidden = e.target.value !== 'tasks'; box.querySelector('#pek_cnt').hidden = !['cnt', 'stars'].includes(e.target.value); }
        });
        box.addEventListener('click', (e) => {
          const b = e.target.closest('[data-a="pekl"]');
          if (b) { e.stopPropagation(); const r = read(); st[b.dataset.f] = Number(b.dataset.v) || 0; st.lv = r.lv; st.qn = r.qn; st.fd = r.fd; st.jra = r.jra; st.gl = r.gl; st.jl = r.jl; st.bt = r.bt; st.ct = r.ct; st.play = { m: r.m, p: r.pp, t: r.t, n: r.n }; open(); return; }
          const rb = e.target.closest('[data-rs]');
          if (rb) { e.stopPropagation(); this._peRst(kid, rb); return; }
          if (e.target.id === 'pek_new') { e.stopPropagation(); fresh = true; e.target.textContent = T('✓ Neues Ei beim Speichern'); e.target.disabled = true; }
        });
      };
      open();
    }

    // ---------- Animation ----------
    _peAfter(app) {
      const root = app || (this.shadowRoot && this.shadowRoot.getElementById('app'));
      if (!root) return;
      this._peEls = [...root.querySelectorAll('.pest[data-k]')];
      // laufende Effekte nach dem Neuzeichnen wieder einhängen
      const now0 = Date.now();
      this._peLive = (this._peLive || []).filter((x) => x.end > now0);
      this._peLive.forEach((fx) => root.querySelectorAll(`.pest[data-k="${fx.kid}"] .pefx`).forEach((box) => this._peFxPut(box, fx)));
      if (!this._peEls.length || this._peRaf) return;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const loop = (now) => {
        this._peEls = (this._peEls || []).filter((el) => el.isConnected);
        if (!this._peEls.length || !this.isConnected) { this._peRaf = 0; return; }
        this._peRaf = requestAnimationFrame(loop);
        if (document.hidden) return;
        this._peEls.forEach((el) => {
          const big = el.classList.contains('lg'), step = reduce ? 250 : big ? 40 : 66;
          if (now - (el._peT || 0) < step) return;
          el._peT = now;
          const kid = el.dataset.k, k = this._db.kid[kid], p = this._peP(kid);
          if (!k || !this._peKindOf(p)) return;
          const sv = el.querySelector('.pesv');
          if (sv) sv.innerHTML = this._peFrame(k, p, now, big);
          // Zzz beim Schlafen
          const S = this._peS(kid);
          if (this._peMood(k).m === 'sleep' && this._peStage(k, p).st && now - (S.z || 0) > 1600) { S.z = now; this._peFx(kid, [['Z', 58, 30, 0, 'pez']]); }
        });
      };
      this._peRaf = requestAnimationFrame(loop);
    }
  }

  Object.getOwnPropertyNames(M.prototype).forEach((n) => { if (n !== 'constructor') C.prototype[n] = M.prototype[n]; });
}
