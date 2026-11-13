// 🦷 Yippee! - Kids Chores – Zahnputz-Timer
// Eigene Datei neben der Karte. Die Karte lädt sie erst, wenn der Zahnputz-Timer unter ⚙️ Einstellungen eingeschaltet ist.
// Alle Daten liegen in der Yippee-Liste (kp|zc|main = Einstellungen, kp|zk|<Kind> = Fortschritt des Kindes).
// Die Sterne bucht die Karte selbst (_zFinish) – diese Datei zeigt nur Timer, Bilder und den Tab 🦷 Zähne.
const BASE_URL = import.meta.url;
export default function install(Y) {
  if (customElements.get('yippee-teeth')) return true;
  const T = Y.T;
  const pad = (n) => String(n).padStart(2, '0');
  const dk = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => (Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4)).replace(/[^a-z0-9]/g, '0');
  const errMsg = (e) => (e && (e.message || (e.body && e.body.message) || e.error || e.code)) || String(e);
  const MS_RX = /^media-source:\/\/media_source\/[\w-]+\/[^"'<>\\]+$/;
  const MEDIA_ROOT = 'media-source://media_source/local/yippee-zaehne';
  const MAX_UP = 20 * 1024 * 1024;
  // Standard-Musik: eigene Datei neben dieser (yippee-kids-chores-teeth-music.js), wird erst bei Bedarf geladen
  let stdP = null;
  const stdMusic = () => {
    if (!stdP) stdP = (() => { try { const u = new URL(BASE_URL); return import(new URL(`yippee-kids-chores-teeth-music.js${u.search}`, u).href); } catch (e) { return Promise.reject(e); } })()
      .then((m) => (m && typeof m.default === 'string' ? m.default : ''), () => { stdP = null; return ''; });
    return stdP;
  };
  const DUR = [60, 120, 180];
  const ZONES = () => [T('↖️ Oben links'), T('↗️ Oben rechts'), T('↙️ Unten links'), T('↘️ Unten rechts')];
  const TIPS = () => [T('Kleine Kreise – Zahn für Zahn'), T('Auch die Backenzähne ganz hinten!'), T('Innen nicht vergessen'), T('Sanft putzen, nicht schrubben')];

  // ---------- Selbst gezeichnete Bilder (Hochformat 300 × 480) ----------
  const SCENES = {
    mond: (p) => `<defs><linearGradient id="a1${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1464"/><stop offset=".7" stop-color="#4b2c9b"/><stop offset="1" stop-color="#7a4fd0"/></linearGradient>
<radialGradient id="a2${p}"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#2563eb"/></radialGradient>
<linearGradient id="a3${p}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bae6fd"/><stop offset="1" stop-color="#1e3a8a"/></linearGradient>
<radialGradient id="a4${p}"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="480" fill="url(#a1${p})"/>
<g fill="#fff"><circle cx="30" cy="40" r="1.6"/><circle cx="80" cy="90" r="1.2"/><circle cx="140" cy="30" r="1.8"/><circle cx="260" cy="60" r="1.3"/><circle cx="210" cy="120" r="1.1"/><circle cx="50" cy="170" r="1.4"/><circle cx="110" cy="210" r="1"/><circle cx="280" cy="200" r="1.5"/><circle cx="170" cy="160" r="1"/><circle cx="20" cy="250" r="1.2"/><path d="M240 30 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z"/><path d="M60 120 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/></g>
<circle cx="215" cy="140" r="58" fill="url(#a2${p})"/><path d="M175 120 q20 -10 40 4 q22 14 52 4" stroke="#bfdbfe" stroke-width="9" fill="none" opacity=".6"/><path d="M168 160 q30 -6 52 6 q18 10 46 0" stroke="#22c55e" stroke-width="12" fill="none" opacity=".7"/><circle cx="215" cy="140" r="58" fill="none" stroke="#93c5fd" stroke-width="6" opacity=".35"/>
<path d="M0 360 Q80 330 160 350 T300 340 V480 H0Z" fill="#c4b5fd"/><path d="M0 395 Q100 370 200 392 T300 385 V480 H0Z" fill="#a78bfa"/>
<g fill="#8b5cf6" opacity=".7"><ellipse cx="60" cy="380" rx="22" ry="6"/><ellipse cx="240" cy="420" rx="28" ry="7"/><ellipse cx="140" cy="455" rx="18" ry="5"/></g>

<g transform="translate(60 230)"><path d="M0 120 C0 60 18 20 30 0 C42 20 60 60 60 120Z" fill="#f8fafc"/><path d="M30 0 C38 14 45 30 50 45 H10 C15 30 22 14 30 0Z" fill="#ef4444"/><circle cx="30" cy="70" r="12" fill="#38bdf8" stroke="#1e3a8a" stroke-width="4"/><path d="M0 95 L-18 130 L2 122Z" fill="#ef4444"/><path d="M60 95 L78 130 L58 122Z" fill="#ef4444"/><path d="M14 122 h32 l-6 10 h-20z" fill="#64748b"/></g>

<rect x="236" y="250" width="3" height="110" fill="#e5e7eb"/><path d="M239 252 h36 l-8 12 8 12 h-36z" fill="#facc15"/><text x="250" y="270" font-size="12" font-weight="900" fill="#7c2d12">Y!</text>

<g transform="translate(150 300)">
<ellipse cx="0" cy="92" rx="40" ry="7" fill="#5b21b6" opacity=".35"/>
<rect x="-34" y="-6" width="20" height="44" rx="8" fill="#e2e8f0" transform="rotate(22 -24 0)"/>
<rect x="-30" y="0" width="60" height="58" rx="22" fill="#f1f5f9"/><rect x="-14" y="16" width="28" height="18" rx="4" fill="#cbd5e1"/><circle cx="-6" cy="25" r="3" fill="#ef4444"/><circle cx="4" cy="25" r="3" fill="#22c55e"/>
<rect x="-24" y="52" width="20" height="36" rx="8" fill="#e2e8f0"/><rect x="4" y="52" width="20" height="36" rx="8" fill="#e2e8f0"/><rect x="-26" y="80" width="24" height="12" rx="5" fill="#64748b"/><rect x="2" y="80" width="24" height="12" rx="5" fill="#64748b"/>
<rect x="18" y="-30" width="18" height="44" rx="8" fill="#e2e8f0" transform="rotate(-150 27 0)"/>
<circle cx="0" cy="-26" r="34" fill="#f8fafc"/><ellipse cx="0" cy="-24" rx="24" ry="20" fill="url(#a3${p})"/><ellipse cx="-8" cy="-32" rx="8" ry="5" fill="#fff" opacity=".7"/><rect x="-6" y="-66" width="3" height="10" fill="#cbd5e1"/><circle cx="-4.5" cy="-68" r="4" fill="#f97316"/>
</g>

<g transform="translate(210 395)"><ellipse cx="0" cy="22" rx="24" ry="4" fill="#5b21b6" opacity=".35"/><ellipse cx="0" cy="8" rx="20" ry="14" fill="#f59e0b"/><rect x="-14" y="14" width="7" height="10" rx="3" fill="#d97706"/><rect x="7" y="14" width="7" height="10" rx="3" fill="#d97706"/><path d="M18 2 q12 -6 8 -16" stroke="#f59e0b" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-16" cy="-10" r="13" fill="#fbbf24"/><ellipse cx="-24" cy="-16" rx="5" ry="9" fill="#b45309" transform="rotate(20 -24 -16)"/><circle cx="-20" cy="-12" r="2" fill="#1f2937"/><circle cx="-27" cy="-6" r="2.4" fill="#1f2937"/><circle cx="-16" cy="-10" r="19" fill="#bae6fd" opacity=".35" stroke="#e0f2fe" stroke-width="2"/></g>`,
    drache: (p) => `<defs><linearGradient id="b1${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a8b"/><stop offset=".5" stop-color="#ffc36b"/><stop offset="1" stop-color="#ffe7a8"/></linearGradient><linearGradient id="b2${p}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4ade80"/><stop offset="1" stop-color="#15803d"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#b1${p})"/><circle cx="70" cy="110" r="40" fill="#fff6d5" opacity=".9"/>
<g fill="#fff" opacity=".85"><ellipse cx="220" cy="80" rx="40" ry="12"/><ellipse cx="245" cy="72" rx="24" ry="12"/><ellipse cx="60" cy="200" rx="34" ry="9"/></g>
<path d="M0 330 Q70 280 150 310 T300 300 V480 H0Z" fill="#86c97a"/><path d="M0 380 Q90 350 180 375 T300 365 V480 H0Z" fill="#5fae5a"/>

<g><rect x="150" y="210" width="110" height="110" fill="#c9b8a6"/><rect x="138" y="170" width="34" height="150" fill="#d8c8b6"/><rect x="238" y="180" width="34" height="140" fill="#d8c8b6"/><g fill="#d8c8b6"></g>
<path d="M138 170 h34 v-8 h-6 v6 h-5 v-6 h-6 v6 h-5 v-6 h-6 v6 h-6z" fill="#d8c8b6"/>
<polygon points="134,172 155,128 176,172" fill="#6d28d9"/><polygon points="234,182 255,140 276,182" fill="#6d28d9"/><rect x="153" y="118" width="2" height="12" fill="#444"/><path d="M155 118 h14 l-4 4 4 4 h-14z" fill="#facc15"/>
<path d="M190 320 v-34 a15 15 0 0 1 30 0 v34z" fill="#7c4a2b"/><rect x="150" y="234" width="12" height="16" rx="6" fill="#4c1d95"/><rect x="250" y="240" width="12" height="16" rx="6" fill="#4c1d95"/><rect x="198" y="236" width="14" height="18" rx="7" fill="#fde68a"/></g>

<g transform="translate(100 285)">
<ellipse cx="10" cy="98" rx="60" ry="9" fill="#166534" opacity=".3"/>
<path d="M40 60 C90 70 110 40 130 60 C120 50 140 40 150 50 C130 55 120 90 60 88Z" fill="#16a34a"/>
<path d="M-10 0 C-60 -50 -80 -20 -90 -60 C-60 -40 -40 -70 -20 -60 C-30 -40 0 -40 10 -10Z" fill="#a78bfa"/>
<path d="M0 -10 C20 -70 60 -60 80 -90 C78 -50 60 -30 30 -5Z" fill="#c4b5fd"/>
<ellipse cx="10" cy="45" rx="50" ry="44" fill="url(#b2${p})"/><ellipse cx="2" cy="56" rx="28" ry="30" fill="#bbf7d0"/>
<g stroke="#86efac" stroke-width="3"><path d="M-14 40 h32"/><path d="M-18 54 h40"/><path d="M-14 68 h32"/></g>
<rect x="-30" y="76" width="22" height="22" rx="9" fill="#15803d"/><rect x="22" y="76" width="22" height="22" rx="9" fill="#15803d"/>
<path d="M-26 -6 C-34 -40 -10 -64 18 -60 C46 -56 54 -24 40 -2 C30 14 -16 14 -26 -6Z" fill="#22c55e"/>
<path d="M-8 -58 l-6 -16 14 10z M14 -60 l2 -18 10 14z" fill="#fde68a"/>
<ellipse cx="34" cy="-14" rx="16" ry="12" fill="#4ade80"/><circle cx="40" cy="-16" r="2" fill="#14532d"/><circle cx="46" cy="-12" r="2" fill="#14532d"/>
<circle cx="4" cy="-32" r="10" fill="#fff"/><circle cx="7" cy="-32" r="6" fill="#1f2937"/><circle cx="9" cy="-34" r="2" fill="#fff"/>
<path d="M20 -2 q10 6 22 0" stroke="#14532d" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<g transform="translate(56 -20)"><path d="M0 0 C20 -10 30 6 46 -4 C40 10 26 12 30 24 C18 16 8 18 0 8Z" fill="#fb923c"/><path d="M4 2 C16 -4 22 6 32 0 C28 8 20 10 22 16 C14 12 8 12 4 6Z" fill="#fde047"/></g>
</g>
<g fill="#f472b6"><circle cx="30" cy="440" r="5"/><circle cx="270" cy="450" r="5"/><circle cx="60" cy="460" r="4"/></g><g fill="#fde047"><circle cx="30" cy="440" r="2"/><circle cx="270" cy="450" r="2"/><circle cx="60" cy="460" r="1.6"/></g>`,
    riff: (p) => `<defs><linearGradient id="c1${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#67e8f9"/><stop offset=".55" stop-color="#0891b2"/><stop offset="1" stop-color="#0e4a6e"/></linearGradient><radialGradient id="c2${p}" cx=".35" cy=".35"><stop offset="0" stop-color="#a3e635"/><stop offset="1" stop-color="#3f6212"/></radialGradient></defs>
<rect width="300" height="480" fill="url(#c1${p})"/>
<g fill="#fff" opacity=".12"><polygon points="40,0 80,0 150,420 90,420"/><polygon points="150,0 180,0 230,420 180,420"/><polygon points="230,0 250,0 300,300 280,300"/></g>
<path d="M0 410 Q70 390 150 410 T300 400 V480 H0Z" fill="#fcd9a0"/>
<g><path d="M30 420 c-6 -40 10 -50 4 -90 c14 20 10 50 16 90z" fill="#f472b6"/><path d="M48 420 c4 -30 -14 -40 -6 -70 c12 22 20 40 14 70z" fill="#fb7185"/><circle cx="260" cy="400" r="22" fill="#fb923c"/><circle cx="240" cy="408" r="14" fill="#fdba74"/><path d="M200 420 q-10 -60 12 -110" stroke="#22c55e" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M215 420 q14 -50 -4 -90" stroke="#16a34a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M110 425 c0 -14 22 -14 22 0z" fill="#a78bfa"/></g>

<g transform="translate(120 380)"><rect x="0" y="10" width="54" height="34" rx="5" fill="#a16207"/><path d="M0 14 q27 -30 54 0z" fill="#ca8a04"/><rect x="0" y="20" width="54" height="5" fill="#fde047"/><circle cx="20" cy="6" r="5" fill="#fde047"/><circle cx="32" cy="3" r="5" fill="#fde047"/></g>

<g transform="translate(205 180) rotate(-10)"><ellipse cx="-38" cy="12" rx="22" ry="8" fill="#65a30d" transform="rotate(30 -38 12)"/><ellipse cx="34" cy="16" rx="22" ry="8" fill="#65a30d" transform="rotate(-30 34 16)"/><ellipse cx="0" cy="0" rx="40" ry="28" fill="url(#c2${p})"/><g fill="none" stroke="#365314" stroke-width="2" opacity=".6"><path d="M-20 -14 l14 -6 14 6 0 14 -14 6 -14 -6z"/><path d="M8 0 l16 -4 M-20 0 l-14 -4 M-6 14 v10"/></g><ellipse cx="-50" cy="-8" rx="15" ry="12" fill="#84cc16"/><circle cx="-56" cy="-12" r="3" fill="#1f2937"/><circle cx="-55" cy="-13" r="1" fill="#fff"/><path d="M-60 -3 q5 3 10 0" stroke="#365314" stroke-width="2" fill="none"/></g>

<g transform="translate(110 250) rotate(-18)">
<path d="M70 18 l40 -16 6 14 -40 14z" fill="#facc15"/><path d="M70 34 l40 4 0 14 -40 -4z" fill="#facc15"/>
<rect x="-10" y="-26" width="22" height="50" rx="10" fill="#f97316" transform="rotate(90 0 0)"/>
<rect x="-16" y="0" width="90" height="38" rx="18" fill="#0f172a"/><rect x="0" y="6" width="8" height="26" fill="#22d3ee"/><rect x="30" y="6" width="8" height="26" fill="#22d3ee"/>
<path d="M10 10 c-20 -20 -30 -10 -40 -30" stroke="#0f172a" stroke-width="10" fill="none" stroke-linecap="round"/>
<circle cx="-30" cy="18" r="22" fill="#fcd5b5"/><path d="M-50 10 c0 -20 30 -26 40 -10" fill="#7c2d12"/><rect x="-52" y="8" width="30" height="16" rx="7" fill="#7dd3fc" stroke="#0f172a" stroke-width="3"/><ellipse cx="-44" cy="12" rx="4" ry="3" fill="#fff" opacity=".8"/><rect x="-26" y="26" width="20" height="5" rx="2" fill="#0f172a"/>
</g>
<g fill="none" stroke="#e0f2fe" stroke-width="1.6" opacity=".8"><circle cx="70" cy="200" r="5"/><circle cx="62" cy="178" r="7"/><circle cx="74" cy="152" r="4"/><circle cx="66" cy="128" r="6"/></g>

<g fill="#fde047"></g>
<g><path d="M40 90 q14 -12 28 0 q-14 12 -28 0z M68 90 l8 -6 v12z" fill="#facc15"/><path d="M60 110 q12 -10 24 0 q-12 10 -24 0z M84 110 l7 -5 v10z" fill="#fb923c"/><path d="M90 80 q12 -10 24 0 q-12 10 -24 0z M114 80 l7 -5 v10z" fill="#facc15"/><path d="M220 310 q-14 -12 -28 0 q14 12 28 0z M192 310 l-8 -6 v12z" fill="#f472b6"/></g>`,
    baum: (p) => `<defs><linearGradient id="d1${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#312e81"/><stop offset=".55" stop-color="#7c3aed"/><stop offset="1" stop-color="#f472b6"/></linearGradient><radialGradient id="d2${p}"><stop offset="0" stop-color="#fde68a" stop-opacity=".9"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="480" fill="url(#d1${p})"/>
<g fill="#fff"><circle cx="40" cy="40" r="1.4"/><circle cx="120" cy="60" r="1"/><circle cx="260" cy="30" r="1.6"/><circle cx="200" cy="90" r="1.2"/><circle cx="20" cy="120" r="1"/></g>
<circle cx="245" cy="75" r="26" fill="#fef9c3"/><circle cx="235" cy="68" r="5" fill="#fde68a"/><circle cx="252" cy="84" r="4" fill="#fde68a"/>
<path d="M0 360 Q60 330 130 350 T300 335 V480 H0Z" fill="#4c1d95"/>
<g fill="#3b0764"><path d="M0 300 l20 -60 20 60z"/><path d="M260 310 l20 -70 20 70z"/></g>

<path d="M130 480 C135 400 125 320 140 250 L170 250 C180 320 170 400 180 480Z" fill="#78350f"/><path d="M150 300 q-40 -20 -70 -10" stroke="#78350f" stroke-width="10" fill="none" stroke-linecap="round"/>
<g fill="#15803d"><circle cx="150" cy="150" r="70"/><circle cx="90" cy="180" r="50"/><circle cx="215" cy="180" r="52"/><circle cx="110" cy="110" r="44"/><circle cx="195" cy="110" r="46"/></g>
<g fill="#16a34a"><circle cx="140" cy="120" r="40"/><circle cx="95" cy="165" r="30"/><circle cx="210" cy="160" r="32"/></g>

<rect x="100" y="210" width="110" height="10" fill="#92400e"/><rect x="110" y="160" width="90" height="52" fill="#d97706"/><g stroke="#b45309" stroke-width="2"><path d="M110 173 h90 M110 186 h90 M110 199 h90"/></g><polygon points="100,164 155,128 210,164" fill="#b91c1c"/>
<rect x="125" y="174" width="24" height="22" rx="3" fill="#fde68a"/><path d="M137 174 v22 M125 185 h24" stroke="#b45309" stroke-width="2"/><rect x="165" y="176" width="22" height="34" rx="3" fill="#7c2d12"/>
<circle cx="137" cy="185" r="30" fill="url(#d2${p})"/>

<g stroke="#a16207" stroke-width="4"><path d="M190 220 L205 360 M206 220 L221 360"/><path d="M193 245 h16 M196 270 h16 M199 295 h16 M202 320 h16 M204 345 h16"/></g>

<path d="M100 215 q55 30 110 0" stroke="#1f2937" stroke-width="1.2" fill="none"/><g></g>
<g><circle cx="112" cy="222" r="4" fill="#f472b6"/><circle cx="130" cy="229" r="4" fill="#fde047"/><circle cx="150" cy="231" r="4" fill="#38bdf8"/><circle cx="170" cy="230" r="4" fill="#4ade80"/><circle cx="190" cy="225" r="4" fill="#fb923c"/></g>

<path d="M60 296 v60 M90 290 v62" stroke="#a16207" stroke-width="2"/><rect x="54" y="354" width="42" height="6" rx="3" fill="#a16207"/>
<g fill="#fde047"><circle cx="40" cy="250" r="2.5"/><circle cx="250" cy="260" r="2.5"/><circle cx="230" cy="320" r="2"/><circle cx="70" cy="400" r="2.5"/><circle cx="260" cy="410" r="2"/></g><g fill="#fde047" opacity=".3"><circle cx="40" cy="250" r="7"/><circle cx="250" cy="260" r="7"/><circle cx="70" cy="400" r="7"/></g>

<g transform="translate(238 222)"><ellipse cx="0" cy="0" rx="12" ry="15" fill="#a16207"/><circle cx="-5" cy="-4" r="5" fill="#fff"/><circle cx="5" cy="-4" r="5" fill="#fff"/><circle cx="-5" cy="-4" r="2.4" fill="#1f2937"/><circle cx="5" cy="-4" r="2.4" fill="#1f2937"/><path d="M-2 1 l2 4 2 -4z" fill="#f59e0b"/><path d="M-11 -12 l4 6 M11 -12 l-4 6" stroke="#a16207" stroke-width="4"/></g>`,
    pirat: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset=".55" stop-color="#bae6fd"/><stop offset="1" stop-color="#fef3c7"/></linearGradient><linearGradient id="w${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#0c4a6e"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<circle cx="250" cy="70" r="30" fill="#fde047"/><circle cx="250" cy="70" r="46" fill="#fde047" opacity=".25"/>
<g fill="#fff"><ellipse cx="70" cy="70" rx="38" ry="12"/><ellipse cx="92" cy="62" rx="22" ry="12"/><ellipse cx="170" cy="120" rx="28" ry="8"/></g>
<path d="M200 300 q20 -60 50 -62 q30 4 50 62z" fill="#facc15"/><path d="M232 250 c-4 -30 6 -50 12 -60" stroke="#92400e" stroke-width="6" fill="none"/><g fill="#16a34a"><path d="M244 190 q-30 -6 -40 10 q24 -4 40 -10z"/><path d="M244 190 q24 -18 44 -4 q-24 0 -44 4z"/><path d="M244 190 q-8 -26 6 -36 q2 20 -6 36z"/></g>
<rect x="0" y="300" width="300" height="180" fill="url(#w${p})"/>
<g stroke="#e0f2fe" stroke-width="3" fill="none" opacity=".7"><path d="M10 330 q15 -8 30 0 t30 0"/><path d="M180 360 q15 -8 30 0 t30 0"/><path d="M60 420 q15 -8 30 0 t30 0"/><path d="M200 450 q15 -8 30 0 t30 0"/></g>
<g transform="translate(30 150)">
<path d="M10 175 L200 175 L178 222 L32 222Z" fill="#92400e"/><path d="M10 175 L200 175 L196 186 L14 186Z" fill="#b45309"/><g fill="#fde68a"><circle cx="60" cy="200" r="7"/><circle cx="100" cy="200" r="7"/><circle cx="140" cy="200" r="7"/></g><g fill="#78350f"><circle cx="60" cy="200" r="4"/><circle cx="100" cy="200" r="4"/><circle cx="140" cy="200" r="4"/></g>
<rect x="102" y="10" width="7" height="166" fill="#78350f"/><rect x="40" y="40" width="5" height="136" fill="#78350f"/>
<path d="M110 22 h70 q-12 60 0 120 h-70z" fill="#f8fafc"/><path d="M110 22 h70 q-12 60 0 120 h-70z" fill="none" stroke="#e2e8f0" stroke-width="2"/><path d="M45 55 h50 q-8 40 0 80 h-50z" fill="#f1f5f9"/>
<g transform="translate(145 82)"><circle r="16" fill="#1f2937"/><circle cx="-5" cy="-3" r="3.4" fill="#fff"/><circle cx="5" cy="-3" r="3.4" fill="#fff"/><path d="M-6 7 h12" stroke="#fff" stroke-width="2.4"/><path d="M-14 14 l28 -28 M-14 -14 l28 28" stroke="#fff" stroke-width="3" opacity=".9"/></g>
<path d="M109 10 h34 l-8 7 8 7 h-34z" fill="#1f2937"/>
<g transform="translate(160 150)"><circle cx="0" cy="-14" r="11" fill="#fcd5b5"/><path d="M-12 -18 q12 -16 24 0z" fill="#dc2626"/><circle cx="4" cy="-14" r="1.6" fill="#1f2937"/><rect x="-6" y="-16" width="6" height="5" rx="1" fill="#1f2937"/><path d="M-2 -8 q4 3 8 0" stroke="#7c2d12" stroke-width="1.6" fill="none"/><rect x="-10" y="-3" width="20" height="22" rx="5" fill="#1d4ed8"/><path d="M-10 4 h20" stroke="#fff" stroke-width="3"/><path d="M10 0 l14 -14" stroke="#fcd5b5" stroke-width="5" stroke-linecap="round"/><path d="M24 -14 l6 -10" stroke="#94a3b8" stroke-width="3"/></g>
<g transform="translate(70 152)"><path d="M0 0 q10 -16 20 0 q-4 6 -10 6 q-6 0 -10 -6z" fill="#22c55e"/><circle cx="16" cy="-4" r="5" fill="#ef4444"/><path d="M20 -4 l6 2 -6 2z" fill="#f59e0b"/><circle cx="17" cy="-5" r="1.2" fill="#1f2937"/><path d="M4 2 l-8 10" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/></g>
</g>
<g transform="translate(232 400)"><path d="M0 0 h40 l-6 14 h-28z" fill="#a16207"/><rect x="2" y="-10" width="36" height="12" rx="4" fill="#ca8a04"/><circle cx="20" cy="-4" r="3" fill="#fde047"/></g>
<g transform="translate(40 440)"><path d="M0 0 q10 -16 24 -6 q14 -10 16 6 q-20 10 -40 0z" fill="#fb7185"/><circle cx="12" cy="-4" r="2" fill="#1f2937"/><circle cx="26" cy="-4" r="2" fill="#1f2937"/></g>`,
    dino: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fef08a"/><stop offset=".5" stop-color="#bbf7d0"/><stop offset="1" stop-color="#4ade80"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<path d="M150 60 L210 230 L90 230Z" fill="#a8a29e"/><path d="M150 60 L170 116 L156 108 L148 124 L138 106 L130 116Z" fill="#f97316"/><path d="M148 58 c-14 -20 10 -30 -2 -52" stroke="#d6d3d1" stroke-width="16" fill="none" opacity=".7" stroke-linecap="round"/>
<path d="M0 260 Q80 210 160 245 T300 225 V480 H0Z" fill="#86efac"/><path d="M0 330 Q100 290 200 320 T300 305 V480 H0Z" fill="#4ade80"/><path d="M0 410 Q90 380 170 405 T300 395 V480 H0Z" fill="#22c55e"/>
<g><rect x="22" y="180" width="10" height="110" fill="#92400e"/><g fill="#15803d"><path d="M27 180 q-40 -10 -50 14 q30 -12 50 -14z"/><path d="M27 180 q40 -14 54 8 q-30 -8 -54 -8z"/><path d="M27 180 q-20 -30 -4 -46 q4 26 4 46z"/><path d="M27 180 q24 -28 44 -26 q-24 10 -44 26z"/></g></g>
<g><rect x="262" y="200" width="9" height="100" fill="#92400e"/><g fill="#16a34a"><path d="M266 200 q-34 -8 -44 12 q26 -10 44 -12z"/><path d="M266 200 q34 -12 46 8 q-26 -8 -46 -8z"/><path d="M266 200 q-16 -26 -2 -40 q2 22 2 40z"/></g></g>
<g transform="translate(150 300)">
<ellipse cx="0" cy="82" rx="80" ry="10" fill="#166534" opacity=".3"/>
<path d="M50 30 C100 30 120 -10 140 0 C130 10 120 40 60 60Z" fill="#60a5fa"/>
<ellipse cx="0" cy="40" rx="66" ry="40" fill="#60a5fa"/><ellipse cx="-6" cy="54" rx="44" ry="20" fill="#bfdbfe"/>
<g fill="#facc15"><circle cx="-20" cy="12" r="6"/><circle cx="6" cy="6" r="7"/><circle cx="30" cy="14" r="5"/></g>
<rect x="-46" y="60" width="18" height="26" rx="7" fill="#3b82f6"/><rect x="-14" y="64" width="18" height="24" rx="7" fill="#3b82f6"/><rect x="20" y="62" width="18" height="24" rx="7" fill="#3b82f6"/><rect x="44" y="56" width="16" height="24" rx="7" fill="#3b82f6"/>
<path d="M-50 20 C-70 -20 -76 -80 -60 -110 C-50 -122 -30 -120 -24 -104 C-30 -80 -30 -30 -24 10Z" fill="#60a5fa"/>
<ellipse cx="-50" cy="-112" rx="26" ry="18" fill="#60a5fa"/><circle cx="-56" cy="-118" r="6" fill="#fff"/><circle cx="-57" cy="-117" r="3.4" fill="#1f2937"/><circle cx="-56" cy="-119" r="1.2" fill="#fff"/>
<path d="M-74 -106 q10 6 22 2" stroke="#1e3a8a" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="-70" cy="-112" r="1.6" fill="#1e3a8a"/>
</g>
<g transform="translate(250 440)"><ellipse cx="0" cy="0" rx="16" ry="20" fill="#fef3c7"/><path d="M-14 -2 l6 -6 6 6 6 -6 6 6 6 -6" stroke="#d97706" stroke-width="2" fill="none"/><circle cx="-4" cy="-12" r="2" fill="#1f2937"/><circle cx="4" cy="-12" r="2" fill="#1f2937"/></g>
<g transform="translate(60 120)"><path d="M0 0 l20 -10 l-6 10 l24 0 l-20 8 l8 8 z" fill="#7c3aed"/><path d="M-10 4 l14 -2" stroke="#7c3aed" stroke-width="3"/></g>
<g fill="#f472b6"><circle cx="40" cy="430" r="6"/><circle cx="52" cy="436" r="5"/><circle cx="44" cy="442" r="5"/></g><circle cx="46" cy="436" r="3" fill="#fde047"/>`,
    feuer: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bae6fd"/><stop offset="1" stop-color="#f0f9ff"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<g fill="#fff"><ellipse cx="60" cy="60" rx="34" ry="11"/><ellipse cx="80" cy="52" rx="20" ry="11"/><ellipse cx="220" cy="40" rx="26" ry="8"/></g>
<rect x="160" y="120" width="120" height="250" fill="#fb923c"/><rect x="160" y="120" width="120" height="12" fill="#ea580c"/>
<g fill="#e0f2fe" stroke="#c2410c" stroke-width="3"><rect x="176" y="150" width="34" height="40"/><rect x="230" y="150" width="34" height="40"/><rect x="176" y="215" width="34" height="40"/><rect x="230" y="215" width="34" height="40"/><rect x="176" y="280" width="34" height="40"/><rect x="230" y="280" width="34" height="40"/></g>
<g transform="translate(247 236)"><circle r="9" fill="#f59e0b"/><path d="M-8 -6 l-2 -8 6 4 M8 -6 l2 -8 -6 4" fill="#f59e0b"/><circle cx="-3" cy="-1" r="1.6" fill="#1f2937"/><circle cx="3" cy="-1" r="1.6" fill="#1f2937"/><path d="M-2 4 q2 2 4 0" stroke="#1f2937" stroke-width="1.2" fill="none"/></g>
<g transform="translate(193 300)"><path d="M0 20 q-12 -16 0 -32 q4 10 10 4 q2 -14 -4 -22 q20 8 18 36 q-2 14 -24 14z" fill="#ef4444"/><path d="M4 18 q-6 -10 2 -18 q2 6 6 2 q8 10 -8 16z" fill="#fde047"/></g>
<path d="M200 190 C220 200 240 230 250 250" stroke="#38bdf8" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/><g fill="#7dd3fc"><circle cx="246" cy="262" r="4"/><circle cx="236" cy="270" r="3"/><circle cx="254" cy="272" r="3"/></g>
<rect x="0" y="370" width="300" height="110" fill="#6b7280"/><g fill="#f8fafc"><rect x="10" y="420" width="40" height="6"/><rect x="90" y="420" width="40" height="6"/><rect x="170" y="420" width="40" height="6"/><rect x="250" y="420" width="40" height="6"/></g>
<path d="M60 336 L190 196" stroke="#cbd5e1" stroke-width="12"/><path d="M60 336 L190 196" stroke="#94a3b8" stroke-width="12" stroke-dasharray="3 14"/>
<g transform="translate(14 300)"><rect x="0" y="30" width="150" height="56" rx="8" fill="#dc2626"/><rect x="100" y="8" width="50" height="40" rx="8" fill="#dc2626"/><rect x="108" y="16" width="34" height="18" rx="3" fill="#bae6fd"/><rect x="0" y="48" width="150" height="6" fill="#fde047"/><rect x="10" y="22" width="80" height="10" rx="4" fill="#9ca3af"/><rect x="60" y="0" width="14" height="10" rx="3" fill="#3b82f6"/><circle cx="34" cy="88" r="15" fill="#1f2937"/><circle cx="34" cy="88" r="6" fill="#9ca3af"/><circle cx="118" cy="88" r="15" fill="#1f2937"/><circle cx="118" cy="88" r="6" fill="#9ca3af"/></g>
<g transform="translate(190 186)"><circle cx="0" cy="-10" r="10" fill="#fcd5b5"/><path d="M-12 -12 q12 -18 24 0 l2 4 h-28z" fill="#facc15"/><circle cx="3" cy="-8" r="1.6" fill="#1f2937"/><path d="M-1 -2 q3 2 6 0" stroke="#7c2d12" stroke-width="1.4" fill="none"/><rect x="-9" y="0" width="18" height="20" rx="5" fill="#1e3a8a"/><path d="M-9 10 h18" stroke="#fde047" stroke-width="3"/></g>`,
    hof: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<circle cx="240" cy="70" r="28" fill="#fde047"/><circle cx="240" cy="70" r="42" fill="#fde047" opacity=".25"/>
<g fill="#fff"><ellipse cx="80" cy="80" rx="34" ry="11"/><ellipse cx="100" cy="72" rx="20" ry="11"/></g>
<path d="M0 250 Q80 220 160 245 T300 235 V480 H0Z" fill="#bef264"/><path d="M0 300 Q100 270 200 295 T300 285 V480 H0Z" fill="#84cc16"/>
<g><rect x="30" y="170" width="130" height="110" fill="#dc2626"/><polygon points="20,176 95,120 170,176" fill="#991b1b"/><rect x="72" y="214" width="46" height="66" fill="#fef3c7"/><path d="M72 214 l46 66 M118 214 l-46 66" stroke="#dc2626" stroke-width="5"/><circle cx="95" cy="152" r="10" fill="#fef3c7"/><path d="M95 146 v6 h5" stroke="#dc2626" stroke-width="2" fill="none"/></g>
<rect x="175" y="150" width="34" height="130" rx="16" fill="#cbd5e1"/><rect x="175" y="150" width="34" height="18" rx="9" fill="#94a3b8"/>
<g stroke="#a16207" stroke-width="5"><path d="M0 330 h300 M0 352 h300"/></g><g fill="#a16207"><rect x="20" y="318" width="7" height="44"/><rect x="100" y="318" width="7" height="44"/><rect x="180" y="318" width="7" height="44"/><rect x="260" y="318" width="7" height="44"/></g>
<g transform="translate(200 410)"><ellipse cx="0" cy="40" rx="50" ry="6" fill="#3f6212" opacity=".3"/><rect x="-44" y="-10" width="80" height="40" rx="18" fill="#fff"/><g fill="#1f2937"><ellipse cx="-20" cy="2" rx="12" ry="9"/><ellipse cx="14" cy="14" rx="10" ry="8"/></g><rect x="-36" y="22" width="9" height="20" rx="3" fill="#fff"/><rect x="18" y="22" width="9" height="20" rx="3" fill="#fff"/><path d="M36 0 q12 6 8 20" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
<ellipse cx="-50" cy="-8" rx="20" ry="17" fill="#fff"/><ellipse cx="-58" cy="0" rx="12" ry="9" fill="#fda4af"/><circle cx="-62" cy="0" r="1.8" fill="#9f1239"/><circle cx="-54" cy="0" r="1.8" fill="#9f1239"/><circle cx="-56" cy="-14" r="2.6" fill="#1f2937"/><circle cx="-42" cy="-14" r="2.6" fill="#1f2937"/><path d="M-66 -22 l-8 -6 M-36 -22 l6 -8" stroke="#a16207" stroke-width="4" stroke-linecap="round"/></g>
<g transform="translate(60 420)"><ellipse cx="0" cy="0" rx="26" ry="18" fill="#f9a8d4"/><circle cx="-24" cy="-6" r="14" fill="#f9a8d4"/><ellipse cx="-34" cy="-4" rx="7" ry="5" fill="#f472b6"/><circle cx="-36" cy="-4" r="1.3" fill="#831843"/><circle cx="-32" cy="-4" r="1.3" fill="#831843"/><circle cx="-26" cy="-12" r="2" fill="#1f2937"/><path d="M-20 -18 l4 -8 4 8z" fill="#f472b6"/><rect x="-14" y="12" width="7" height="10" rx="3" fill="#f472b6"/><rect x="10" y="12" width="7" height="10" rx="3" fill="#f472b6"/><path d="M26 -2 q8 -4 4 -10" stroke="#f472b6" stroke-width="3" fill="none"/></g>
<g transform="translate(130 450)"><ellipse cx="0" cy="0" rx="12" ry="10" fill="#fef3c7"/><circle cx="-8" cy="-10" r="7" fill="#fef3c7"/><path d="M-14 -10 l-5 2 5 2z" fill="#f59e0b"/><path d="M-10 -17 q2 -4 5 0" fill="#ef4444"/><circle cx="-9" cy="-11" r="1.4" fill="#1f2937"/></g>
<g transform="translate(240 300)"><path d="M0 0 h50 v20 h-50z" fill="#16a34a"/><circle cx="10" cy="24" r="12" fill="#1f2937"/><circle cx="42" cy="26" r="9" fill="#1f2937"/><rect x="26" y="-16" width="20" height="18" fill="#22c55e"/><rect x="30" y="-12" width="12" height="9" fill="#bae6fd"/><rect x="6" y="-8" width="4" height="10" fill="#374151"/></g>`,
    pinguin: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a8a"/><stop offset=".55" stop-color="#60a5fa"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<g opacity=".8"><path d="M-10 70 Q80 30 160 70 T320 60" stroke="#6ee7b7" stroke-width="14" fill="none"/><path d="M-10 100 Q90 60 170 100 T320 90" stroke="#a78bfa" stroke-width="10" fill="none"/></g>
<g fill="#fff"><circle cx="30" cy="30" r="1.5"/><circle cx="120" cy="20" r="1.2"/><circle cx="200" cy="40" r="1.6"/><circle cx="270" cy="24" r="1.3"/><circle cx="240" cy="130" r="1.2"/><circle cx="60" cy="140" r="1"/></g>
<polygon points="20,300 90,150 150,300" fill="#f8fafc"/><polygon points="90,150 120,214 100,206 82,226 70,196" fill="#e0f2fe"/><polygon points="150,300 220,170 290,300" fill="#e2e8f0"/><polygon points="220,170 244,214 228,210 214,226 204,198" fill="#f8fafc"/>
<path d="M0 300 h300 v180 h-300z" fill="#f8fafc"/><ellipse cx="210" cy="400" rx="70" ry="16" fill="#38bdf8"/><ellipse cx="210" cy="398" rx="60" ry="10" fill="#7dd3fc"/>
<g transform="translate(90 380)"><ellipse cx="0" cy="56" rx="34" ry="6" fill="#94a3b8" opacity=".4"/><ellipse cx="0" cy="10" rx="34" ry="46" fill="#111827"/><ellipse cx="0" cy="18" rx="24" ry="36" fill="#fff"/><path d="M-34 0 q-16 20 -6 36 q8 -14 10 -30z M34 0 q16 20 6 36 q-8 -14 -10 -30z" fill="#111827"/><circle cx="-9" cy="-14" r="6" fill="#fff"/><circle cx="9" cy="-14" r="6" fill="#fff"/><circle cx="-8" cy="-13" r="3" fill="#111827"/><circle cx="10" cy="-13" r="3" fill="#111827"/><path d="M-6 -4 l6 8 6 -8z" fill="#f97316"/><ellipse cx="-14" cy="56" rx="10" ry="4" fill="#f97316"/><ellipse cx="14" cy="56" rx="10" ry="4" fill="#f97316"/><path d="M-30 -30 q30 -26 60 0" stroke="#ef4444" stroke-width="7" fill="none"/><path d="M26 -28 l10 14" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/></g>
<g transform="translate(150 410) scale(.6)"><ellipse cx="0" cy="10" rx="34" ry="46" fill="#111827"/><ellipse cx="0" cy="18" rx="24" ry="36" fill="#fff"/><circle cx="-9" cy="-14" r="6" fill="#fff"/><circle cx="9" cy="-14" r="6" fill="#fff"/><circle cx="-8" cy="-13" r="3" fill="#111827"/><circle cx="10" cy="-13" r="3" fill="#111827"/><path d="M-6 -4 l6 8 6 -8z" fill="#f97316"/><ellipse cx="-14" cy="56" rx="10" ry="4" fill="#f97316"/><ellipse cx="14" cy="56" rx="10" ry="4" fill="#f97316"/></g>
<g transform="translate(230 380)"><ellipse cx="0" cy="0" rx="34" ry="16" fill="#9ca3af"/><circle cx="-26" cy="-6" r="14" fill="#9ca3af"/><circle cx="-30" cy="-10" r="2.4" fill="#1f2937"/><circle cx="-22" cy="-10" r="2.4" fill="#1f2937"/><ellipse cx="-26" cy="-2" rx="5" ry="3" fill="#4b5563"/><path d="M30 -4 l14 -10 v20z" fill="#9ca3af"/><g fill="#111827"><circle cx="0" cy="-30" r="8"/><circle cx="-2" cy="-32" r="2" fill="#fff"/></g></g>
<g transform="translate(260 300)"><path d="M0 0 q6 -10 12 0 q-6 4 -12 0z" fill="#38bdf8"/><path d="M12 0 l6 -4 v8z" fill="#38bdf8"/></g>`,
    safari: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdba74"/><stop offset=".55" stop-color="#fde68a"/><stop offset="1" stop-color="#fef3c7"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<circle cx="150" cy="170" r="60" fill="#fb923c" opacity=".55"/><circle cx="150" cy="170" r="40" fill="#f97316" opacity=".7"/>
<g fill="#78350f" opacity=".55"><path d="M40 80 l8 -4 8 4 -8 -1z"/><path d="M70 60 l7 -3 7 3 -7 -1z"/></g>
<path d="M0 270 Q80 245 160 262 T300 255 V480 H0Z" fill="#d9a35f"/><path d="M0 330 Q100 305 200 325 T300 318 V480 H0Z" fill="#c8893f"/>
<g><rect x="230" y="200" width="8" height="80" fill="#78350f"/><ellipse cx="234" cy="200" rx="60" ry="16" fill="#3f6212"/><ellipse cx="234" cy="188" rx="40" ry="12" fill="#4d7c0f"/></g>
<g transform="translate(70 170)">
<rect x="10" y="80" width="10" height="80" rx="4" fill="#facc15"/><rect x="44" y="80" width="10" height="80" rx="4" fill="#facc15"/>
<ellipse cx="32" cy="80" rx="36" ry="26" fill="#facc15"/>
<path d="M50 70 L70 -10 L84 -6 L68 74Z" fill="#facc15"/>
<g fill="#b45309"><circle cx="20" cy="74" r="6"/><circle cx="40" cy="86" r="7"/><circle cx="52" cy="68" r="5"/><circle cx="66" cy="30" r="4"/><circle cx="72" cy="6" r="4"/><circle cx="26" cy="92" r="4"/></g>
<ellipse cx="82" cy="-14" rx="18" ry="12" fill="#facc15"/><circle cx="86" cy="-18" r="2.6" fill="#1f2937"/><path d="M74 -24 v-10 M84 -26 v-10" stroke="#b45309" stroke-width="3"/><circle cx="74" cy="-34" r="3" fill="#b45309"/><circle cx="84" cy="-36" r="3" fill="#b45309"/><path d="M92 -8 q4 2 6 -2" stroke="#78350f" stroke-width="1.6" fill="none"/>
</g>
<g transform="translate(200 390)"><ellipse cx="0" cy="40" rx="54" ry="7" fill="#78350f" opacity=".25"/><ellipse cx="0" cy="10" rx="44" ry="30" fill="#94a3b8"/><rect x="-36" y="24" width="14" height="22" rx="5" fill="#94a3b8"/><rect x="18" y="24" width="14" height="22" rx="5" fill="#94a3b8"/><circle cx="-40" cy="-8" r="22" fill="#94a3b8"/><ellipse cx="-30" cy="-10" rx="14" ry="18" fill="#cbd5e1"/><path d="M-56 0 q-10 20 4 36" stroke="#94a3b8" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="-46" cy="-14" r="2.6" fill="#1f2937"/></g>
<g transform="translate(80 420)"><circle r="24" fill="#d97706"/><circle r="16" fill="#fbbf24"/><circle cx="-6" cy="-4" r="2.2" fill="#1f2937"/><circle cx="6" cy="-4" r="2.2" fill="#1f2937"/><path d="M-4 4 l4 4 4 -4z" fill="#7c2d12"/><path d="M-6 10 q6 4 12 0" stroke="#7c2d12" stroke-width="1.6" fill="none"/></g>`,
    zirkus: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#312e81"/><stop offset=".6" stop-color="#7c3aed"/><stop offset="1" stop-color="#f0abfc"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<g fill="#fde68a"><circle cx="30" cy="40" r="2"/><circle cx="90" cy="70" r="1.6"/><circle cx="260" cy="40" r="2"/><circle cx="210" cy="90" r="1.4"/><circle cx="40" cy="160" r="1.4"/></g>
<path d="M30 140 Q150 100 270 140" stroke="#fde68a" stroke-width="1.5" fill="none"/><g><circle cx="60" cy="130" r="5" fill="#f472b6"/><circle cx="100" cy="120" r="5" fill="#fde047"/><circle cx="150" cy="116" r="5" fill="#38bdf8"/><circle cx="200" cy="120" r="5" fill="#4ade80"/><circle cx="240" cy="130" r="5" fill="#fb923c"/></g>
<g><rect x="40" y="220" width="220" height="180" fill="#fff"/><g fill="#ef4444"><rect x="40" y="220" width="27" height="180"/><rect x="94" y="220" width="27" height="180"/><rect x="148" y="220" width="27" height="180"/><rect x="202" y="220" width="27" height="180"/></g>
<polygon points="26,226 150,140 274,226" fill="#ef4444"/><polygon points="150,140 116,226 184,226" fill="#fff"/><polygon points="150,140 60,226 88,226" fill="#fff"/><polygon points="150,140 212,226 240,226" fill="#fff"/>
<rect x="148" y="112" width="3" height="30" fill="#374151"/><path d="M151 112 h18 l-5 6 5 6 h-18z" fill="#fde047"/>
<path d="M118 400 v-80 a32 32 0 0 1 64 0 v80z" fill="#3b0764"/><path d="M118 320 q-14 30 -10 80 M182 320 q14 30 10 80" stroke="#dc2626" stroke-width="10" fill="none"/></g>
<rect x="0" y="400" width="300" height="80" fill="#f59e0b"/><path d="M0 400 h300" stroke="#b45309" stroke-width="4"/>
<g transform="translate(232 420)"><ellipse cx="0" cy="0" rx="34" ry="24" fill="#94a3b8"/><circle cx="-28" cy="-14" r="18" fill="#94a3b8"/><path d="M-42 -6 q-8 20 6 30" stroke="#94a3b8" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="-34" cy="-18" r="2.4" fill="#1f2937"/><path d="M-24 -32 l6 -14 10 10z" fill="#ef4444"/><rect x="-24" y="14" width="10" height="18" rx="3" fill="#94a3b8"/><rect x="12" y="14" width="10" height="18" rx="3" fill="#94a3b8"/><ellipse cx="-4" cy="4" rx="16" ry="10" fill="#c084fc"/></g>
<g transform="translate(70 380)"><circle cx="0" cy="40" r="20" fill="#38bdf8"/><path d="M-20 40 h40" stroke="#fde047" stroke-width="3"/><g transform="translate(0 -6)"><circle cx="0" cy="-16" r="10" fill="#fcd5b5"/><circle cx="0" cy="-12" r="3" fill="#ef4444"/><path d="M-12 -22 q-6 -10 2 -12 M12 -22 q6 -10 -2 -12" stroke="#f97316" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-8 -24 l8 -14 8 14z" fill="#22c55e"/><rect x="-10" y="-6" width="20" height="26" rx="6" fill="#fde047"/><circle cx="0" cy="4" r="2" fill="#ef4444"/><path d="M-10 0 l-14 -16 M10 0 l14 -16" stroke="#fcd5b5" stroke-width="4" stroke-linecap="round"/></g><circle cx="-26" cy="-30" r="5" fill="#f472b6"/><circle cx="0" cy="-58" r="5" fill="#4ade80"/><circle cx="26" cy="-30" r="5" fill="#fb923c"/></g>`,
    einhorn: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4b5fd"/><stop offset=".5" stop-color="#fbcfe8"/><stop offset="1" stop-color="#fef9c3"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<g fill="none" stroke-width="12" opacity=".9"><path d="M-10 280 A160 160 0 0 1 310 280" stroke="#f87171"/><path d="M2 280 A148 148 0 0 1 298 280" stroke="#fb923c"/><path d="M14 280 A136 136 0 0 1 286 280" stroke="#fde047"/><path d="M26 280 A124 124 0 0 1 274 280" stroke="#4ade80"/><path d="M38 280 A112 112 0 0 1 262 280" stroke="#60a5fa"/><path d="M50 280 A100 100 0 0 1 250 280" stroke="#a78bfa"/></g>
<g fill="#fff"><ellipse cx="20" cy="282" rx="40" ry="18"/><ellipse cx="280" cy="282" rx="40" ry="18"/><ellipse cx="44" cy="274" rx="22" ry="14"/><ellipse cx="256" cy="274" rx="22" ry="14"/></g>
<path d="M0 320 Q80 290 160 312 T300 300 V480 H0Z" fill="#a7f3d0"/><path d="M0 380 Q100 350 200 375 T300 365 V480 H0Z" fill="#6ee7b7"/>
<g transform="translate(150 380)">
<ellipse cx="0" cy="70" rx="70" ry="8" fill="#047857" opacity=".25"/>
<ellipse cx="0" cy="20" rx="60" ry="34" fill="#fff"/><rect x="-48" y="36" width="14" height="36" rx="6" fill="#fff"/><rect x="-20" y="40" width="14" height="32" rx="6" fill="#fff"/><rect x="18" y="40" width="14" height="32" rx="6" fill="#fff"/><rect x="40" y="36" width="14" height="36" rx="6" fill="#fff"/>
<g fill="#c4b5fd"><rect x="-48" y="64" width="14" height="8" rx="3"/><rect x="-20" y="64" width="14" height="8" rx="3"/><rect x="18" y="64" width="14" height="8" rx="3"/><rect x="40" y="64" width="14" height="8" rx="3"/></g>
<path d="M58 10 c30 0 40 30 26 50 c10 -24 -6 -36 -26 -34z" fill="#f472b6"/><path d="M60 16 c22 4 28 24 18 38 c4 -18 -6 -28 -18 -30z" fill="#a78bfa"/>
<path d="M-40 6 C-50 -30 -60 -50 -50 -70 L-20 -60 C-24 -40 -20 -10 -10 4Z" fill="#fff"/>
<ellipse cx="-58" cy="-70" rx="26" ry="20" fill="#fff"/><ellipse cx="-76" cy="-62" rx="10" ry="8" fill="#fbcfe8"/>
<path d="M-50 -88 L-40 -126 L-36 -86Z" fill="#fde047"/><path d="M-48 -96 l9 -2 M-46 -106 l7 -2 M-43 -116 l5 -1" stroke="#f59e0b" stroke-width="2"/>
<path d="M-40 -86 c20 -10 34 6 30 30 c-6 -16 -14 -22 -26 -18z" fill="#f472b6"/><path d="M-34 -78 c14 0 22 14 18 30 c-4 -12 -10 -18 -18 -20z" fill="#60a5fa"/><path d="M-30 -64 c10 4 14 16 10 26 c-2 -10 -6 -16 -12 -18z" fill="#fde047"/>
<circle cx="-56" cy="-74" r="4" fill="#1f2937"/><circle cx="-55" cy="-76" r="1.4" fill="#fff"/><path d="M-64 -78 l-4 -3 M-60 -80 l-2 -4" stroke="#1f2937" stroke-width="1.4"/><circle cx="-68" cy="-64" r="4" fill="#f9a8d4" opacity=".8"/>
</g>
<g fill="#f472b6"><circle cx="40" cy="440" r="6"/><circle cx="52" cy="446" r="5"/><circle cx="44" cy="452" r="5"/></g><circle cx="46" cy="446" r="3" fill="#fde047"/>
<g fill="#fde047"><path d="M250 120 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z"/><path d="M60 140 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z"/></g>
<g transform="translate(250 430)"><path d="M0 0 q-10 -12 0 -16 q10 4 0 16z" fill="#a78bfa"/><path d="M0 0 q10 -12 18 -6 q-6 10 -18 6z" fill="#c4b5fd"/><path d="M0 0 v14" stroke="#16a34a" stroke-width="2"/></g>`,
    wald: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#065f46"/><stop offset=".6" stop-color="#10b981"/><stop offset="1" stop-color="#a7f3d0"/></linearGradient><radialGradient id="g${p}"><stop offset="0" stop-color="#fef9c3" stop-opacity=".9"/><stop offset="1" stop-color="#fef9c3" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<g fill="#fff" opacity=".18"><polygon points="120,0 160,0 230,480 150,480"/><polygon points="200,0 220,0 290,480 250,480"/></g>
<g fill="#064e3b"><path d="M0 480 V40 q30 40 20 120 q30 60 10 140 q20 90 0 180z"/><path d="M300 480 V60 q-30 40 -20 110 q-30 70 -10 140 q-20 90 0 170z"/></g>
<g fill="#047857"><circle cx="20" cy="60" r="40"/><circle cx="290" cy="80" r="44"/><circle cx="50" cy="20" r="30"/><circle cx="260" cy="30" r="34"/></g>
<path d="M0 360 Q80 330 160 350 T300 340 V480 H0Z" fill="#34d399"/><path d="M0 420 Q100 395 200 415 T300 405 V480 H0Z" fill="#10b981"/>
<g transform="translate(80 380)"><rect x="-8" y="0" width="16" height="30" rx="5" fill="#fef3c7"/><path d="M-30 4 q30 -44 60 0z" fill="#ef4444"/><g fill="#fff"><circle cx="-12" cy="-8" r="4"/><circle cx="8" cy="-14" r="5"/><circle cx="16" cy="-2" r="3"/></g><rect x="-3" y="12" width="6" height="8" rx="2" fill="#a16207"/></g>
<g transform="translate(220 400) scale(.7)"><rect x="-8" y="0" width="16" height="30" rx="5" fill="#fef3c7"/><path d="M-30 4 q30 -44 60 0z" fill="#f472b6"/><g fill="#fff"><circle cx="-12" cy="-8" r="4"/><circle cx="8" cy="-14" r="5"/></g></g>
<circle cx="150" cy="200" r="70" fill="url(#g${p})"/>
<g transform="translate(150 200)"><path d="M-4 -6 C-40 -50 -64 -10 -40 6 C-56 26 -26 40 -4 10Z" fill="#a5f3fc" opacity=".85"/><path d="M4 -6 C40 -50 64 -10 40 6 C56 26 26 40 4 10Z" fill="#a5f3fc" opacity=".85"/><path d="M-4 -6 C-30 -36 -48 -8 -34 4" stroke="#fff" stroke-width="1.5" fill="none"/><path d="M4 -6 C30 -36 48 -8 34 4" stroke="#fff" stroke-width="1.5" fill="none"/>
<path d="M-12 8 L0 -4 L12 8 L8 40 L-8 40Z" fill="#c084fc"/><circle cx="0" cy="-16" r="12" fill="#fcd5b5"/><path d="M-13 -18 q2 -16 13 -16 q11 0 13 16 q-6 -8 -13 -6 q-7 -2 -13 6z" fill="#f59e0b"/><circle cx="-4" cy="-16" r="1.8" fill="#1f2937"/><circle cx="4" cy="-16" r="1.8" fill="#1f2937"/><path d="M-3 -10 q3 2 6 0" stroke="#be123c" stroke-width="1.4" fill="none"/>
<path d="M12 8 l18 -16" stroke="#fcd5b5" stroke-width="4" stroke-linecap="round"/><path d="M30 -8 l10 -10" stroke="#a16207" stroke-width="2.4"/><path d="M40 -18 l3 -6 3 6 6 3 -6 3 -3 6 -3 -6 -6 -3z" fill="#fde047"/></g>
<g fill="#fde047"><circle cx="60" cy="280" r="2.6"/><circle cx="240" cy="260" r="2.6"/><circle cx="200" cy="320" r="2"/><circle cx="100" cy="320" r="2"/><circle cx="30" cy="200" r="2"/></g><g fill="#fde047" opacity=".3"><circle cx="60" cy="280" r="8"/><circle cx="240" cy="260" r="8"/><circle cx="200" cy="320" r="6"/></g>
<g transform="translate(160 436)"><ellipse cx="0" cy="0" rx="16" ry="10" fill="#92400e"/><circle cx="-14" cy="-4" r="8" fill="#a16207"/><circle cx="-18" cy="-6" r="1.6" fill="#1f2937"/><circle cx="-21" cy="-3" r="1.4" fill="#1f2937"/><path d="M0 -10 l2 -6 M6 -9 l3 -6 M-6 -9 l0 -6" stroke="#78350f" stroke-width="2"/></g>`,
    zug: (p) => `<defs><linearGradient id="s${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93c5fd"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient></defs>
<rect width="300" height="480" fill="url(#s${p})"/>
<g fill="#fff"><ellipse cx="220" cy="70" rx="34" ry="11"/><ellipse cx="240" cy="62" rx="20" ry="11"/></g>
<polygon points="-20,280 70,110 160,280" fill="#94a3b8"/><polygon points="70,110 92,152 80,148 70,162 60,146 50,150" fill="#fff"/><polygon points="110,280 210,90 310,280" fill="#64748b"/><polygon points="210,90 236,140 222,134 210,152 198,134 186,140" fill="#fff"/>
<path d="M0 270 Q80 245 160 262 T300 255 V480 H0Z" fill="#86efac"/><path d="M0 320 Q100 300 200 318 T300 310 V480 H0Z" fill="#4ade80"/>
<g fill="#15803d"><path d="M30 300 l14 -40 14 40z"/><path d="M262 296 l14 -44 14 44z"/><path d="M240 300 l10 -30 10 30z"/></g>
<rect x="0" y="378" width="300" height="10" fill="#78350f"/><g fill="#92400e"><rect x="10" y="388" width="18" height="7"/><rect x="50" y="388" width="18" height="7"/><rect x="90" y="388" width="18" height="7"/><rect x="130" y="388" width="18" height="7"/><rect x="170" y="388" width="18" height="7"/><rect x="210" y="388" width="18" height="7"/><rect x="250" y="388" width="18" height="7"/></g>
<g fill="#fff" opacity=".9"><circle cx="60" cy="250" r="18"/><circle cx="84" cy="232" r="22"/><circle cx="112" cy="216" r="16"/><circle cx="136" cy="206" r="12"/></g>
<g transform="translate(40 300)">
<rect x="0" y="30" width="100" height="44" rx="8" fill="#dc2626"/><rect x="62" y="0" width="44" height="74" rx="6" fill="#b91c1c"/><rect x="70" y="10" width="28" height="22" rx="3" fill="#fef3c7"/><rect x="14" y="10" width="20" height="24" rx="3" fill="#374151"/><rect x="10" y="4" width="28" height="8" rx="3" fill="#1f2937"/>
<path d="M0 70 l-14 8 h14z" fill="#facc15"/><rect x="0" y="54" width="106" height="6" fill="#facc15"/>
<circle cx="22" cy="78" r="12" fill="#1f2937"/><circle cx="22" cy="78" r="5" fill="#fde047"/><circle cx="54" cy="78" r="12" fill="#1f2937"/><circle cx="54" cy="78" r="5" fill="#fde047"/><circle cx="88" cy="76" r="15" fill="#1f2937"/><circle cx="88" cy="76" r="6" fill="#fde047"/>
<g transform="translate(84 20)"><circle cx="0" cy="0" r="7" fill="#fcd5b5"/><path d="M-8 -2 q8 -12 16 0z" fill="#1d4ed8"/><circle cx="2" cy="1" r="1.3" fill="#1f2937"/></g>
</g>
<g transform="translate(160 330)"><rect x="0" y="0" width="56" height="40" rx="6" fill="#2563eb"/><rect x="8" y="8" width="16" height="14" rx="2" fill="#fef3c7"/><rect x="32" y="8" width="16" height="14" rx="2" fill="#fef3c7"/><circle cx="14" cy="46" r="9" fill="#1f2937"/><circle cx="42" cy="46" r="9" fill="#1f2937"/><rect x="-6" y="26" width="8" height="4" fill="#374151"/>
<g transform="translate(16 15)"><circle r="5" fill="#f59e0b"/><circle cx="-2" cy="-1" r="1" fill="#1f2937"/></g><g transform="translate(40 15)"><circle r="5" fill="#fcd5b5"/><circle cx="1" cy="-1" r="1" fill="#1f2937"/></g></g>
<g transform="translate(222 340)"><rect x="0" y="0" width="56" height="40" rx="6" fill="#16a34a"/><rect x="8" y="8" width="40" height="14" rx="2" fill="#fef3c7"/><circle cx="14" cy="46" r="9" fill="#1f2937"/><circle cx="42" cy="46" r="9" fill="#1f2937"/><rect x="-6" y="26" width="8" height="4" fill="#374151"/></g>
<g transform="translate(230 240)"><ellipse cx="0" cy="0" rx="14" ry="9" fill="#f5f5f4"/><circle cx="-12" cy="-6" r="6" fill="#f5f5f4"/><path d="M-14 -12 l-3 -6 M-10 -12 l1 -6" stroke="#78350f" stroke-width="2"/><circle cx="-13" cy="-7" r="1.2" fill="#1f2937"/><rect x="-8" y="6" width="3" height="8" fill="#f5f5f4"/><rect x="6" y="6" width="3" height="8" fill="#f5f5f4"/></g>`,
  };
  // Reihenfolge und Namen der Vorlagen
  const TPL = [['mond', '🚀 Mondlandung'], ['drache', '🐉 Drachenburg'], ['riff', '🐢 Tauchgang am Riff'], ['baum', '🌳 Baumhaus bei Nacht'], ['pirat', '🏴‍☠️ Piratenschiff'],
    ['dino', '🦕 Dino-Tal'], ['feuer', '🚒 Feuerwehr'], ['hof', '🐄 Bauernhof'], ['pinguin', '🐧 Pinguine im Eis'], ['safari', '🦒 Safari'], ['zirkus', '🎪 Zirkus'],
    ['einhorn', '🦄 Einhorn-Wiese'], ['wald', '🧚 Zauberwald'], ['zug', '🚂 Dampflok']];
  const TPL_IDS = TPL.map((x) => x[0]);
  let SEQ = 0;
  const sceneSvg = (id, attrs) => { const f = SCENES[id]; return f ? `<svg viewBox="0 0 300 480" ${attrs && attrs.includes('preserveAspectRatio') ? '' : 'preserveAspectRatio="xMidYMid slice" '}${attrs || ''}>${f(`z${++SEQ}`)}</svg>` : ''; };
  const thumbSvg = (id) => sceneSvg(id, 'class="zth"');
  if (Y.api) Y.api.thumb = thumbSvg;
  const tplName = (id) => { const x = TPL.find((t) => t[0] === id); return x ? T(x[1]) : ''; };

  // ---------- Ton ----------
  let AC = null;
  const ctx = () => {
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      if (!AC) AC = new C();
      if (AC.state === 'suspended') AC.resume();
      return AC;
    } catch (e) { return null; }
  };
  const chime = () => {
    const c = ctx();
    if (!c) return;
    try {
      [1318.5, 1661.2, 1975.5].forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + i * 0.11;
        o.type = 'sine'; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.28, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 1.5);
      });
    } catch (e) { /* egal */ }
  };
  // 🔊 Putzgeräusch: 'scrub' = leises Schrubben im Rhythmus, 'el' = elektrische Zahnbürste (Summen + Vibration)
  const brushSound = (kind) => {
    const c = ctx();
    let nodes = [], vib = null;
    if (!c || (kind !== 'scrub' && kind !== 'el')) return { stop() {} };
    try {
      const out = c.createGain(); out.gain.value = 0; out.connect(c.destination); nodes.push(out);
      out.gain.linearRampToValueAtTime(1, c.currentTime + 0.4);
      if (kind === 'scrub') {
        const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), dta = buf.getChannelData(0);
        for (let i = 0; i < len; i++) dta[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 0.7;
        const g = c.createGain(); g.gain.value = 0.025;
        const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 3.3; lg.gain.value = 0.022; lfo.connect(lg); lg.connect(g.gain);
        src.connect(bp); bp.connect(g); g.connect(out); src.start(); lfo.start();
        nodes.push(src, bp, g, lfo, lg);
      } else {
        const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 165;
        const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = 330;
        const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
        const g = c.createGain(); g.gain.value = 0.03;
        o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(out); o.start(); o2.start();
        nodes.push(o, o2, lp, g);
        if (navigator.vibrate) vib = setInterval(() => { try { navigator.vibrate(350); } catch (e) { /* egal */ } }, 400);
      }
    } catch (e) { /* ohne Geräusch */ }
    return {
      stop() {
        clearInterval(vib); if (navigator.vibrate) try { navigator.vibrate(0); } catch (e) { /* egal */ }
        const o = nodes[0];
        try { if (o) o.gain.linearRampToValueAtTime(0, c.currentTime + 0.25); } catch (e) { /* egal */ }
        setTimeout(() => nodes.forEach((n) => { try { if (n.stop) n.stop(); n.disconnect(); } catch (e) { /* egal */ } }), 320);
        nodes = [];
      },
    };
  };
  // Plopp (Schaumrest platzt)
  const plop = () => {
    const c = ctx();
    if (!c) return;
    try {
      const o = c.createOscillator(), g = c.createGain(), t = c.currentTime, f0 = 520 + Math.random() * 380;
      o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.35, t + 0.07);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + 0.005); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.1);
    } catch (e) { /* egal */ }
  };
  // selbst gezeichnete Zahnbürste (Kopf links = Putzstelle)
  const BRUSH = `<svg viewBox="0 0 240 64"><defs><linearGradient id="zbh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs>
<path d="M58 26 L226 18 Q238 18 238 30 Q238 42 226 42 L58 38 Z" fill="url(#zbh)"/><path d="M120 22 L200 19 Q206 19 206 24 L206 26 L120 28Z" fill="#fff" opacity=".45"/>
<rect x="150" y="26" width="60" height="9" rx="4.5" fill="#f472b6" opacity=".85"/>
<path d="M14 26 Q14 20 20 20 L62 22 L62 40 L20 42 Q14 42 14 36Z" fill="#e0f2fe"/>
<g fill="#38bdf8">${[18, 24, 30, 36, 42, 48, 54].map((x) => `<rect x="${x}" y="8" width="4" height="14" rx="2"/>`).join('')}</g>
<g fill="#fff">${[21, 27, 33, 39, 45, 51].map((x) => `<rect x="${x}" y="10" width="3" height="12" rx="1.5"/>`).join('')}</g>
<g fill="#fff"><circle cx="24" cy="7" r="7"/><circle cx="36" cy="4" r="8"/><circle cx="49" cy="7" r="7"/><circle cx="30" cy="10" r="5"/><circle cx="44" cy="11" r="5"/></g>
<g fill="none" stroke="#bae6fd" stroke-width="1.2"><circle cx="16" cy="2" r="3"/><circle cx="58" cy="3" r="2.5"/></g></svg>`;
  const tada = () => {
    const c = ctx();
    if (!c) return;
    try {
      [[523.3, 0], [659.3, 0.09], [784, 0.18], [1046.5, 0.3]].forEach(([f, d]) => {
        const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + d, len = d > 0.25 ? 1.6 : 0.5;
        o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + len);
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + len + 0.05);
      });
    } catch (e) { /* egal */ }
  };

  // Mediathek-Dateien (eigene Bilder und Lieder) brauchen eine signierte Adresse – für alle Benutzer erlaubt
  const URLS = {};
  const resolve = (hass, ref) => {
    if (!ref || !MS_RX.test(ref) || !hass) return Promise.resolve('');
    const u = URLS[ref];
    if (u && u.url && Date.now() - u.t < 20 * 3600e3) return Promise.resolve(u.url);
    if (u && u.p) return u.p;
    const p = hass.callWS({ type: 'media_source/resolve_media', media_content_id: ref, expires: 7 * 86400 })
      .then((r) => { const url = (r && r.url) || ''; URLS[ref] = { url, t: Date.now() }; return url; })
      .catch(() => { URLS[ref] = { url: '', t: Date.now() }; return ''; });
    URLS[ref] = { ...(u || {}), p };
    return p;
  };
  const cachedUrl = (ref) => (URLS[ref] && URLS[ref].url) || '';

  // Bildauswahl: 🎲 Zufall (jedes Bild erst wieder, wenn alle dran waren) oder 🔢 feste Reihenfolge
  const pool = (H, kidId) => {
    const c = H._zc(), hide = new Set(c.hide || []);
    const own = (c.own || []).filter((o) => !(o.k && o.k.length) || o.k.includes(kidId)).map((o) => o.i);
    const all = [...TPL_IDS, ...((c.own || []).map((o) => o.i))];
    const base = c.mode === 'ord' && Array.isArray(c.ord) && c.ord.length ? [...c.ord.filter((x) => all.includes(x)), ...all.filter((x) => !c.ord.includes(x))] : all;
    return base.filter((x) => !hide.has(x) && (TPL_IDS.includes(x) || own.includes(x)));
  };
  const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

  // ======================================================================
  // 🦷 Timer: liegt als Vollbild über der Karte (eigenes Element im Shadow-Root der Karte)
  // ======================================================================
  const RUN_CSS = `
:host{position:fixed;inset:0;z-index:9700;display:none;font-family:var(--paper-font-body1_-_font-family,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif);-webkit-tap-highlight-color:transparent}
:host([open]){display:block}
*{box-sizing:border-box}
.wrap{position:absolute;inset:0;overflow:hidden;background:#0b1026;color:#fff;user-select:none;-webkit-user-select:none}
.pic{position:absolute;inset:0}
.pic svg,.pic img{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:contain}
.pic .bk{object-fit:cover;filter:blur(18px) brightness(.85) saturate(1.1);transform:scale(1.12)}
.pic{transition:filter .4s linear}
.wrap.end .pic{animation:kb 14s ease-out forwards}
@keyframes kb{0%{transform:scale(1)}100%{transform:scale(1.06)}}
.fxl{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.fxl i{position:absolute;display:block;border-radius:50%}
.fxl .bub{width:12px;height:12px;border:2px solid rgba(255,255,255,.75);bottom:-20px;animation:rise linear infinite}
.fxl .tw{width:14px;height:14px;background:radial-gradient(circle,#fff 0 22%,rgba(255,255,255,0) 60%);animation:tw ease-in-out infinite}
.fxl .tw::before,.fxl .tw::after{content:'';position:absolute;left:50%;top:50%;width:18px;height:2px;background:rgba(255,255,255,.9);transform:translate(-50%,-50%)}
.fxl .tw::after{transform:translate(-50%,-50%) rotate(90deg)}
.fxl .dot{width:7px;height:7px;background:rgba(255,248,200,.9);box-shadow:0 0 8px rgba(255,240,150,.9);animation:flt ease-in-out infinite}
@keyframes rise{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}100%{transform:translateY(-110vh) translateX(18px);opacity:.2}}
@keyframes tw{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.1)}}
@keyframes flt{0%,100%{transform:translate(0,0);opacity:.35}50%{transform:translate(12px,-22px);opacity:1}}
.chip{position:absolute;left:50%;top:calc(max(12px,env(safe-area-inset-top)) + 58px);transform:translateX(-50%);background:rgba(220,38,38,.92);color:#fff;border-radius:999px;padding:8px 16px;font-weight:800;font-size:15px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.25)}
.chip.pause{background:rgba(30,41,59,.9)}
.viewbar{position:absolute;left:0;right:0;bottom:max(16px,env(safe-area-inset-bottom));display:flex;justify-content:center;gap:10px}
.viewbar button{background:rgba(255,255,255,.95);color:#1f2937;border-radius:999px;padding:12px 20px;font-weight:800;font-size:16px;box-shadow:0 4px 14px rgba(0,0,0,.25)}
.viewbar button.pri{background:#5b6cff;color:#fff}
.two{display:flex;gap:8px;margin-top:14px}.two .ok{margin-top:0}.two .ok.sec{background:#eef2ff;color:#3730a3}
canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.brush{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;transition:opacity .3s;z-index:2}
.brush .tb{position:absolute;left:0;top:0;width:var(--bw,160px);transform-origin:0 50%;transform:translate(-10%,-50%) rotate(var(--rot,-32deg));filter:drop-shadow(0 4px 8px rgba(0,0,0,.35));transition:transform .5s ease}
.brush .tb svg{display:block;width:100%;height:auto;animation:wig .3s ease-in-out infinite alternate}
.brush.flip .tb svg{transform:scaleY(-1)}
.brush.flip .tb svg{animation-name:wigf}
@keyframes wig{0%{transform:translateX(-3px)}100%{transform:translateX(3px)}}
@keyframes wigf{0%{transform:scaleY(-1) translateX(-3px)}100%{transform:scaleY(-1) translateX(3px)}}
.sp{position:absolute;border-radius:50%;background:#fff;pointer-events:none;animation:sp .6s ease-out forwards}
@keyframes sp{0%{transform:translate(0,0);opacity:1}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
.pop{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff,#e6f1ff 60%,#bcd6f0);pointer-events:none;transform:translate(-50%,-50%);animation:pop .38s ease-out forwards}
@keyframes pop{0%{transform:translate(-50%,-50%) scale(1);opacity:1}60%{transform:translate(-50%,-50%) scale(1.7);opacity:.7}100%{transform:translate(-50%,-50%) scale(2.1);opacity:0}}
.bb{position:absolute;border-radius:50%;border:1.5px solid rgba(255,255,255,.9);background:rgba(255,255,255,.25);pointer-events:none;animation:bb 1.1s ease-out forwards}
@keyframes bb{0%{transform:translate(0,0) scale(.6);opacity:1}100%{transform:translate(var(--dx,10px),-60px) scale(1.1);opacity:0}}
.top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:max(12px,env(safe-area-inset-top)) 12px 12px}
.pill{background:rgba(0,0,0,.42);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);border-radius:999px;padding:7px 14px;font-weight:800;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:46vw}
.tm{font-size:24px;padding:5px 16px;font-variant-numeric:tabular-nums}
button{font:inherit;cursor:pointer;border:0}
.x{background:rgba(0,0,0,.42);color:#fff;border-radius:999px;min-width:40px;height:40px;padding:0 12px;font-size:17px;font-weight:800}
.x.sure{background:#dc2626}
.bot{position:absolute;left:12px;right:12px;bottom:max(14px,env(safe-area-inset-bottom));background:rgba(8,24,48,.26);border:1px solid rgba(255,255,255,.22);border-radius:20px;padding:10px 14px 12px;text-shadow:0 1px 3px rgba(0,0,0,.9),0 0 10px rgba(0,0,0,.55)}
.bot .mini{filter:drop-shadow(0 1px 3px rgba(0,0,0,.6))}
.zone{display:flex;align-items:center;gap:12px;font-weight:900;font-size:21px;line-height:1.2}
.zone small{display:block;font-size:13.5px;font-weight:600;opacity:.92;margin-top:2px}
.mini{width:58px;height:58px;flex:none}
.prog{display:flex;gap:6px;margin-top:10px}.prog b{flex:1;height:8px;border-radius:4px;background:rgba(255,255,255,.35);overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.45)}.prog b i{display:block;height:100%;width:0;background:#ffd166}.prog b.d i{width:100%;background:#7cf0c0}
.card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(340px,calc(100% - 32px));background:rgba(255,255,255,.96);color:#1f2937;border-radius:22px;padding:20px 18px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.card.low{top:auto;bottom:max(16px,env(safe-area-inset-bottom));transform:translateX(-50%)}
.card h2{margin:0;font-size:24px;font-weight:900}
.card .sub{color:#4b5563;font-weight:700;font-size:14.5px;margin-top:4px;line-height:1.4}
.card .chips{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}.card .chips span{background:#f3f4f6;border-radius:12px;padding:6px 10px;font-weight:800;font-size:14.5px}
.go{display:block;width:100%;margin-top:14px;background:linear-gradient(135deg,#22c1c3,#3b82f6);color:#fff;border-radius:16px;padding:14px;font-weight:900;font-size:19px;box-shadow:0 5px 14px rgba(59,130,246,.35)}
.ok{display:block;width:100%;margin-top:14px;background:#5b6cff;color:#fff;border-radius:14px;padding:12px;font-weight:800;font-size:16px}
.lnk{background:none;color:#6b7280;font-weight:700;margin-top:10px;font-size:14px;padding:6px}
.big{font-size:44px;line-height:1}
.hot{color:#ff6b3d}
.warn{color:#b45309;font-weight:700;font-size:13.5px;margin-top:8px}
@keyframes pop{0%{transform:translate(-50%,-50%) scale(.7);opacity:0}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}
.card.anim{animation:pop .35s ease-out}
.conf{position:absolute;font-size:22px;pointer-events:none;animation:fall 2.6s ease-in forwards}
@keyframes fall{0%{transform:translateY(-40px) rotate(0)}100%{transform:translateY(110vh) rotate(540deg)}}
@media (prefers-reduced-motion:reduce){.conf,.fxl{display:none}.card.anim,.wrap.end .pic{animation:none}}
`;

  class YippeeTeethRun extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<style>${RUN_CSS}</style><div class="wrap" id="w"></div>`;
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      this._vis = () => { if (document.visibilityState === 'visible' && this._st === 'run') { this._tick(true); this._lock(); } };
      this._rs = () => { if (this._st) this._sizeCanvas(); };
    }

    // ---------- Start: Bild aussuchen, Schaum zeichnen, auf „Los geht's“ warten ----------
    start(H, tid, kidId) {
      this._stop(true);
      const t = H._db.task[tid], k = H._db.kid[kidId];
      if (!t || !k) return false;
      this.H = H; this._tid = tid; this._kid = kidId; this._date = dk(new Date());
      const c = H._zc();
      this._dur = DUR.includes(Number((c.dur || {})[kidId])) ? Number(c.dur[kidId]) : 120;
      this._img = this._pick();
      this._st = 'ready'; this._sure = 0; this._q = -1; this._res = null; this._view = false; this._el = 0; this._bOn = 0; this._chip = '';
      this._brush = H._zBrush(kidId);
      this.setAttribute('open', '');
      document.addEventListener('visibilitychange', this._vis);
      window.addEventListener('resize', this._rs);
      this._build();
      this._prepMusic();
      if (this._brush) this._iv = setInterval(() => this._tick(), 500); // wartet auf die Zahnbürste
      return true;
    }

    _pick() {
      const H = this.H, kid = this._kid, date = this._date, P = pool(H, kid);
      if (!P.length) return '';
      const z = H._db.zk[kid] || {}, c = H._zc();
      // gleiche Aufgabe heute schon angefangen (z. B. abgebrochen) → dasselbe Bild
      const tdm = z.td && z.td.d === date && z.td.m ? z.td.m : {};
      if (tdm[this._tid] && P.includes(tdm[this._tid])) return tdm[this._tid];
      const today = z.td && z.td.d === date ? (z.td.l || []).filter((x) => P.includes(x)) : [];
      let img = '', bag = (z.bag || []).filter((x) => P.includes(x)), oi = Number(z.oi) || 0;
      if (c.mode === 'ord') {
        for (let n = 0; n < P.length; n++) { const i = (oi + n) % P.length; if (!today.includes(P[i]) || n === P.length - 1) { img = P[i]; oi = (i + 1) % P.length; break; } }
      } else {
        if (!bag.length || bag.every((x) => today.includes(x))) {
          bag = shuffle(P.filter((x) => !bag.includes(x) || !today.includes(x)));
          if (bag.length > 1 && z.cur && bag[0] === z.cur.i) bag.push(bag.shift()); // nicht zweimal hintereinander
        }
        img = bag.find((x) => !today.includes(x)) || bag[0];
        bag = bag.filter((x) => x !== img);
      }
      const td = { d: date, l: [...today, img].slice(-12), m: { ...tdm, [this._tid]: img } }, cur = { d: date, t: this._tid, i: img };
      H._save('zk', kid, { ...z, bag, oi, td, cur }, (x) => ({ ...x, bag, oi, td, cur }));
      return img;
    }

    _build() {
      const H = this.H, k = H._db.kid[this._kid], t = H._db.task[this._tid], w = this.shadowRoot.getElementById('w');
      const own = (H._zc().own || []).find((o) => o.i === this._img);
      // Bild ganz zeigen (nicht abschneiden); dahinter dieselbe Szene verschwommen als Hintergrund
      const scene = (id) => `${sceneSvg(id, 'class="bk" preserveAspectRatio="xMidYMid slice"')}${sceneSvg(id, 'preserveAspectRatio="xMidYMid meet"')}`;
      w.innerHTML = `<div class="pic" id="pic">${own ? '' : scene(this._img || 'mond')}</div><canvas id="cv"></canvas>${H._zc().anim !== false ? this._fxHtml() : ''}<div class="brush" id="br" style="opacity:0"><div class="tb">${BRUSH}</div></div><div id="chip"></div>
        <div class="top"><span class="pill">${esc(k.emoji || '🙂')} ${esc(k.name)}</span><span class="pill tm" id="tm">${this._fmt(this._dur)}</span><button class="x" data-a="x" id="xb" aria-label="${esc(T('Abbrechen'))}">✕</button></div>
        <div id="ui"></div>`;
      if (own) {
        const put = (u) => { const p = this.shadowRoot.getElementById('pic'); if (p && this._img === own.i) p.innerHTML = u ? `<img class="bk" src="${esc(u)}" alt=""><img src="${esc(u)}" alt="">` : scene('mond'); };
        const u0 = cachedUrl(own.r);
        if (u0) put(u0); else resolve(H._hass, own.r).then(put);
      }
      this._sizeCanvas();
      this._ui();
    }

    // ✨ bewegte Effekte: Sterne funkeln (Nacht), Bläschen steigen (Wasser), Lichtpunkte schweben (Tag)
    _fxHtml() {
      const night = ['mond', 'baum', 'pinguin', 'zirkus', 'wald'], water = ['riff', 'pirat'];
      const kind = night.includes(this._img) ? 'tw' : water.includes(this._img) ? 'bub' : 'dot';
      let s = 11 + (this._img || '').length, out = '';
      const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      for (let i = 0; i < 12; i++) {
        const x = (r() * 92 + 4).toFixed(1), y = (r() * (kind === 'tw' ? 55 : 80) + 4).toFixed(1), d = (kind === 'bub' ? 6 + r() * 6 : 2.5 + r() * 3).toFixed(1), dl = (-r() * 8).toFixed(1);
        out += `<i class="${kind}" style="left:${x}%;${kind === 'bub' ? '' : `top:${y}%;`}animation-duration:${d}s;animation-delay:${dl}s"></i>`;
      }
      return `<div class="fxl">${out}</div>`;
    }
    // 🌫️ optional: Bild erst gegen Ende scharf (damit die Kinder weiter putzen statt nur zu schauen)
    _blur(p) {
      const pic = this.shadowRoot.getElementById('pic');
      if (!pic) return;
      if (!this.H._zc().blur || p >= 1) { pic.style.filter = ''; return; }
      const k = Math.max(0, 1 - p / 0.9);
      pic.style.filter = `blur(${(k * 14).toFixed(1)}px) saturate(${(1 - k * 0.7).toFixed(2)}) brightness(${(1 + k * 0.15).toFixed(2)})`;
    }
    // 🦷 Oral-B-Zahnbürste (Integration „Oral-B“): Zustand, Druck
    _bRead() {
      const b = this._brush, st = this.H && this.H._hass && this.H._hass.states;
      if (!b || !st) return null;
      const v = (id) => (id && st[id] ? String(st[id].state || '').toLowerCase() : '');
      return { run: v(b.state) === 'running', press: v(b.pressure) === 'high' };
    }
    _setChip(kind) {
      if (this._chip === kind) return;
      this._chip = kind;
      const el = this.shadowRoot.getElementById('chip');
      if (el) el.innerHTML = kind === 'press' ? `<div class="chip">${T('⚠️ Nicht so fest drücken!')}</div>` : kind === 'pause' ? `<div class="chip pause">${T('⏸️ Zahnbürste aus – weiter putzen!')}</div>` : '';
      if (kind === 'press' && navigator.vibrate) try { navigator.vibrate([80, 60, 80]); } catch (e) { /* egal */ }
    }

    _fmt(s) { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${pad(s % 60)}`; }

    _ui() {
      const ui = this.shadowRoot.getElementById('ui');
      if (!ui) return;
      const t = this.H._db.task[this._tid] || {}, z = ZONES(), tips = TIPS();
      if (this._st === 'ready') {
        ui.innerHTML = `<div class="card anim"><div class="big">🦷</div><h2>${esc(t.title || '')}</h2>
          <div class="sub">${T('Putze {min} lang – Bereich für Bereich. Darunter wartet ein Bild!', { min: this._fmt(this._dur) })}</div>
          ${this._brush ? `<div class="warn">${T('🦷 Schalte deine Zahnbürste ein – der Timer startet von selbst.')}</div>` : ''}
          <button class="go" data-a="go">${T('🦷 Los geht\'s!')}</button><button class="lnk" data-a="close">${T('Später')}</button></div>`;
        return;
      }
      if (this._st === 'run') {
        const q = Math.max(0, this._q);
        ui.innerHTML = `<div class="bot"><div class="zone">${this._mini(q)}<div><span id="zn">${esc(z[q])}</span><small id="zt">${esc(tips[q])}</small></div></div>
          <div class="prog">${[0, 1, 2, 3].map((i) => `<b class="${i < q ? 'd' : ''}"><i id="p${i}"></i></b>`).join('')}</div></div>`;
        return;
      }
      if (this._st === 'done') {
        const r = this._res || {};
        const chips = [];
        if (r.pts) chips.push(`+${r.pts} ⭐`);
        if (r.streak >= 2) chips.push(T('🔥 {n} Tage', { n: r.streak }));
        if (r.bonus) chips.push(T('🎉 Bonus +{n} ⭐', { n: r.bonus }));
        ui.innerHTML = `<div class="card low anim"><h2 class="hot">${T('Blitzblank! ✨')}</h2>
          <div class="sub">${esc(r.msg || T('Super geputzt!'))}</div>
          ${chips.length ? `<div class="chips">${chips.map((x) => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
          <div class="two"><button class="ok sec" data-a="view">${T('🖼️ Bild ansehen')}</button><button class="ok" data-a="close">${T('Weiter')}</button></div></div>`;
      }
      if (this._st === 'view') ui.innerHTML = `<div class="viewbar"><button data-a="back">${T('↩️ Zurück')}</button><button class="pri" data-a="close">${T('Weiter')}</button></div>`;
    }

    // kleiner Mund: welcher Bereich gerade dran ist
    _mini(q) {
      const pos = [[8, 8], [32, 8], [8, 32], [32, 32]];
      return `<svg class="mini" viewBox="0 0 62 62"><circle cx="31" cy="31" r="30" fill="rgba(0,0,0,.3)"/>${pos.map(([x, y], i) => `<rect x="${x}" y="${y}" width="22" height="22" rx="${i < 2 ? 11 : 5}" fill="${i < q ? '#7cf0c0' : i === q ? '#ffd166' : 'rgba(255,255,255,.35)'}" id="m${i}"/>`).join('')}</svg>`;
    }

    // ---------- Schaum ----------
    _sizeCanvas() {
      const cv = this.shadowRoot.getElementById('cv');
      if (!cv) return;
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), Hh = Math.max(1, Math.round(r.height * dpr));
      if (cv.width === W && cv.height === Hh && this._foam) return;
      cv.width = W; cv.height = Hh; this._dpr = dpr;
      const g = cv.getContext('2d');
      this._g = g;
      // Schaum einmal zeichnen (feste Zufallsfolge, damit er beim Drehen des Geräts gleich aussieht)
      let s = 7;
      const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      const lg = g.createLinearGradient(0, 0, 0, Hh);
      lg.addColorStop(0, '#f8fbff'); lg.addColorStop(1, '#e3efff');
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = lg; g.fillRect(0, 0, W, Hh);
      const n = Math.round((W * Hh) / (1400 * dpr * dpr));
      for (let i = 0; i < n; i++) {
        const x = rnd() * W, y = rnd() * Hh, rr = (12 + rnd() * 26) * dpr;
        const rg = g.createRadialGradient(x - rr * 0.3, y - rr * 0.3, rr * 0.1, x, y, rr);
        rg.addColorStop(0, '#ffffff'); rg.addColorStop(0.75, '#eef5ff'); rg.addColorStop(1, '#cfe2f6');
        g.fillStyle = rg; g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
      }
      g.strokeStyle = 'rgba(140,180,215,.55)'; g.lineWidth = 1.2 * dpr;
      for (let i = 0; i < n / 6; i++) { const x = rnd() * W, y = rnd() * Hh; g.beginPath(); g.arc(x, y, (3 + rnd() * 6) * dpr, 0, Math.PI * 2); g.stroke(); }
      this._foam = true; this._done = -1; this._ps = 0; this._fl = []; this._stp = null;
      // bereits geputzte Bereiche wieder freimachen
      if (this._st === 'run' || this._st === 'done') this._tick(true);
    }

    // Bürstenweg im Bereich q – „Zahn für Zahn“: 5 Reihen × 3 Stellen (ruhiges Tempo). An jeder Stelle wird kurz geschrubbt, dann springt die Bürste weiter.
    // Zwei Durchgänge: s 0…0,5 verteilt den Schaum (er wird dünner), s 0,5…1 putzt ihn weg (rückwärts).
    _spots(q) {
      const cv = this.shadowRoot.getElementById('cv'), W = cv.width, Hh = cv.height, R = 5, C = 3;
      const x0 = q % 2 ? W / 2 : 0, y0 = q < 2 ? 0 : Hh / 2, w = W / 2, h = Hh / 2, out = [];
      for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) { const jj = i % 2 ? C - 1 - j : j; out.push([x0 + (jj + 0.5) * (w / C), y0 + (i + 0.5) * (h / R)]); }
      return { p: out, cw: w / C, ch: h / R, x0, y0, w, h };
    }
    _pt(q, s) {
      const S = this._spots(q), K = S.p.length, pass = s < 0.5 ? 0 : 1, u0 = pass ? (s - 0.5) * 2 : s * 2;
      const pos = Math.min(K - 1e-6, u0 * K), k = Math.floor(pos), u = pos - k;
      const idx = (n) => (pass ? K - 1 - n : n), cur = S.p[idx(k)], prev = S.p[idx(Math.max(0, k - 1))];
      let x, y;
      if (u < 0.22 && k > 0) { const t = u / 0.22, e = t * t * (3 - 2 * t); x = prev[0] + (cur[0] - prev[0]) * e; y = prev[1] + (cur[1] - prev[1]) * e; }
      else { const v = (u - 0.22) / 0.78; x = cur[0] + Math.sin(v * Math.PI * 2 * 2.5) * S.cw * 0.36; y = cur[1] + Math.sin(v * Math.PI * 2 * 1.25 + 1) * S.ch * 0.38; }
      // nicht hart am Feldrand stoppen – etwas darüber hinaus putzen, damit keine geraden Kanten entstehen
      const mx = S.cw * 0.5, my = S.ch * 0.8;
      x = Math.max(S.x0 - mx, Math.min(S.x0 + S.w + mx, x)); y = Math.max(S.y0 - my, Math.min(S.y0 + S.h + my, y));
      return [x, y, Math.max(Math.max(S.cw, S.ch) * 0.62, 10 * (this._dpr || 1)), pass, u < 0.22 && k > 0];
    }
    // weicher Radierer (zum Rand hin durchsichtig) – einmal vorbereitet
    _stamp(r) {
      const k = Math.round(r);
      if (this._stp && this._stpR === k) return this._stp;
      const c = document.createElement('canvas'); c.width = c.height = k * 2 + 2;
      const g = c.getContext('2d'), rg = g.createRadialGradient(k + 1, k + 1, 0, k + 1, k + 1, k);
      rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(0.55, 'rgba(0,0,0,.95)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = rg; g.fillRect(0, 0, c.width, c.height);
      this._stp = c; this._stpR = k;
      return c;
    }
    _erase(q, from, to) {
      const g = this._g;
      if (!g) return;
      const step = 0.0012, d = this._dpr || 1;
      for (let s = from; s <= to; s += step) {
        const [x, y, r, pass, hop] = this._pt(q, Math.min(1, s)), st = this._stamp(r);
        g.globalCompositeOperation = 'destination-out';
        g.globalAlpha = pass ? 1 : 0.035; // 1. Durchgang: Schaum wird nur dünner
        g.drawImage(st, x - st.width / 2, y - st.height / 2);
        g.globalAlpha = 1;
        g.globalCompositeOperation = 'source-over';
        // 2. Durchgang: ab und zu bleibt ein Schaumrest oder eine Schaumschliere stehen – „Plopp“ am Ende des Bereichs
        if (pass && this._fl && this._fl.length < 26 && Math.random() < (hop ? 0.08 : 0.01)) {
          const sm = hop && Math.random() < 0.7;
          this._fl.push({ q, x: x + (Math.random() - 0.5) * r * 1.2, y: y + (Math.random() - 0.5) * r * 1.2, r: (sm ? 6 + Math.random() * 6 : 5 + Math.random() * 7) * d, sx: sm ? 1.8 + Math.random() : 1, rot: Math.random() * Math.PI, at: s });
        }
      }
      this._drawFl(q, to);
    }
    // Schaumreste hinter der Bürste wieder aufmalen (die Bürste radiert sonst darüber)
    _drawFl(q, s) {
      const g = this._g;
      if (!g || !this._fl) return;
      this._fl.filter((f) => f.q === q && s - f.at > 0.01).forEach((f) => {
        const rg = g.createRadialGradient(f.x - f.r * 0.3, f.y - f.r * 0.3, f.r * 0.1, f.x, f.y, f.r);
        rg.addColorStop(0, '#ffffff'); rg.addColorStop(0.7, '#eaf3ff'); rg.addColorStop(1, '#c4dbf2');
        g.fillStyle = rg; g.beginPath();
        if (f.sx > 1) g.ellipse(f.x, f.y, f.r * f.sx, f.r * 0.6, f.rot, 0, Math.PI * 2); else g.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        g.fill();
      });
    }
    // Plopp: Schaumreste des Bereichs platzen nacheinander
    _popQ(q) {
      const w = this.shadowRoot.getElementById('w'), d = this._dpr || 1;
      const list = (this._fl || []).filter((f) => f.q === q);
      this._fl = (this._fl || []).filter((f) => f.q !== q);
      if (!w) return;
      list.forEach((f, i) => {
        const t = Math.random() * 520;
        setTimeout(() => {
          if (!w.isConnected) return;
          const p = document.createElement('div');
          p.className = 'pop'; p.style.left = `${f.x / d}px`; p.style.top = `${f.y / d}px`; p.style.width = `${(f.r * 2 * (f.sx || 1)) / d}px`; p.style.height = `${(f.r * 2 * (f.sx > 1 ? 0.6 : 1)) / d}px`; if (f.sx > 1) p.style.rotate = `${f.rot}rad`;
          w.appendChild(p); setTimeout(() => p.remove(), 450);
          if (i < 10 && this.H && this.H._zc().chime !== false) plop();
        }, t);
      });
    }
    // Schaumspritzer an der Bürste
    _splash(x, y) {
      const w = this.shadowRoot.getElementById('w');
      if (!w || (this.H && this.H._zc().anim === false)) return;
      for (let i = 0; i < 3; i++) {
        const b = document.createElement('div'), s = 3 + Math.random() * 5, a = Math.random() * Math.PI * 2, dist = 25 + Math.random() * 30;
        b.className = 'sp'; b.style.left = `${x - s / 2}px`; b.style.top = `${y - s / 2}px`; b.style.width = b.style.height = `${s}px`;
        b.style.setProperty('--dx', `${Math.cos(a) * dist}px`); b.style.setProperty('--dy', `${Math.sin(a) * dist}px`);
        w.appendChild(b); setTimeout(() => b.remove(), 650);
      }
    }
    // Bläschen an der Bürste
    _bubble(x, y) {
      const w = this.shadowRoot.getElementById('w');
      if (!w || (this.H && this.H._zc().anim === false)) return;
      const b = document.createElement('div'), s = 6 + Math.random() * 10;
      b.className = 'bb'; b.style.left = `${x - s / 2 + (Math.random() - 0.5) * 30}px`; b.style.top = `${y - s / 2 - 10}px`; b.style.width = b.style.height = `${s}px`;
      b.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
      w.appendChild(b); setTimeout(() => b.remove(), 1200);
    }
    _clearQ(q) {
      const g = this._g, cv = this.shadowRoot.getElementById('cv');
      if (!g || !cv) return;
      const W = cv.width, Hh = cv.height;
      if (this._done >= 2 && q === 3) { g.clearRect(0, 0, W, Hh); return; } // zum Schluss alles frei
      // Bereich mit weichem Rand freimachen (statt gerader Kante) – der Rand läuft sanft in das Nachbarfeld aus
      const x0 = q % 2 ? W / 2 : 0, y0 = q < 2 ? 0 : Hh / 2, w = W / 2, h = Hh / 2;
      const r = Math.max(40 * (this._dpr || 1), Math.min(w, h) * 0.34), dx = r * 0.4;
      if (!this._soft || this._softR !== Math.round(r)) {
        const k = Math.round(r), c = document.createElement('canvas'); c.width = c.height = k * 2 + 2;
        const sg = c.getContext('2d'), rg = sg.createRadialGradient(k + 1, k + 1, 0, k + 1, k + 1, k);
        rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(0.25, 'rgba(0,0,0,.8)'); rg.addColorStop(0.6, 'rgba(0,0,0,.25)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
        sg.fillStyle = rg; sg.fillRect(0, 0, c.width, c.height); this._soft = c; this._softR = k;
      }
      const st = this._soft;
      let s = 11 + q * 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      g.globalCompositeOperation = 'destination-out';
      g.clearRect(x0 + r * 0.3, y0 + r * 0.3, w - r * 0.6, h - r * 0.6); // Kern sofort frei
      for (let y = y0 + dx / 2; y < y0 + h; y += dx) for (let x = x0 + dx / 2; x < x0 + w; x += dx) {
        const jx = (rnd() - 0.5) * dx * 1.2, jy = (rnd() - 0.5) * dx * 1.2, sc = 0.75 + rnd() * 0.5; // wolkiger Rand
        g.drawImage(st, x + jx - (st.width * sc) / 2, y + jy - (st.height * sc) / 2, st.width * sc, st.height * sc);
      }
      // welliger Rand: an den Innenkanten (zur Bildmitte hin) beult sich der freie Bereich in Wellen ins Nachbarfeld
      const ex = q % 2 ? x0 : x0 + w, dirx = q % 2 ? -1 : 1, ey = q < 2 ? y0 + h : y0, diry = q < 2 ? 1 : -1, A = r * 0.9, ph = q * 1.7;
      const wave = (t, L) => 0.5 + 0.35 * Math.sin((t / L) * Math.PI * 2 * 2.2 + ph) + 0.15 * Math.sin((t / L) * Math.PI * 2 * 5.3 + ph * 2);
      for (let t = 0; t <= h; t += dx * 0.45) { const o = wave(t, h) * A, sc = 0.55 + rnd() * 0.2; g.drawImage(st, ex + dirx * o - (st.width * sc) / 2, y0 + t - (st.height * sc) / 2, st.width * sc, st.height * sc); }
      for (let t = 0; t <= w; t += dx * 0.45) { const o = wave(t, w) * A, sc = 0.55 + rnd() * 0.2; g.drawImage(st, x0 + t - (st.width * sc) / 2, ey + diry * o - (st.height * sc) / 2, st.width * sc, st.height * sc); }
      g.globalCompositeOperation = 'source-over';
    }

    // ---------- Ablauf ----------
    _go() {
      if (this._st !== 'ready') return;
      clearInterval(this._iv);
      ctx(); // Ton beim Antippen freischalten (iPhone)
      this._st = 'run'; this._t0 = Date.now(); this._last = Date.now(); this._el = 0; this._q = 0; this._done = -1; this._ps = 0; this._bSeen = Date.now(); this._fl = [];
      this._ui();
      this._lock();
      this._playMusic();
      // Putzgeräusch (nicht mit Oral-B – die summt ja selbst)
      if (!this._brush) this._snd = brushSound(this.H._zc().snd);
      if (this.H._zc().chime !== false) chime();
      this._tick(true);
      this._iv = setInterval(() => this._tick(), 250);
      const fr = () => { if (this._st !== 'run') return; this._tick(); this._raf = requestAnimationFrame(fr); };
      this._raf = requestAnimationFrame(fr);
    }

    _tick(force) {
      if (this._st === 'ready') { const b = this._bRead(); if (b && b.run) this._go(); return; }
      if (this._st !== 'run' && !(force && (this._st === 'done' || this._st === 'view'))) return;
      if (this._st === 'run') {
        // Zeit läuft – mit Oral-B nur, solange die Zahnbürste an ist (4 Sek. Spielraum, Bluetooth meldet etwas verzögert)
        const now = Date.now(), dt = Math.max(0, now - this._last), b = this._bRead(), follow = b && this.H._zc().bFollow !== false;
        this._last = now;
        if (b && b.run) this._bSeen = now;
        const going = !follow || now - this._bSeen < 4000;
        if (going) this._el += dt / 1000;
        if (follow) { if (!going && this._au && !this._au.paused) try { this._au.pause(); } catch (e) { /* egal */ } else if (going && this._au && this._au.paused) this._au.play().catch(() => {}); }
        this._setChip(b && b.press ? 'press' : (!going ? 'pause' : ''));
      }
      const el = this._st === 'run' ? Math.min(this._dur, this._el) : this._dur;
      this._blur(el / this._dur);
      const seg = this._dur / 4, q = Math.min(3, Math.floor(el / seg)), s = Math.min(1, (el - q * seg) / seg);
      const tm = this.shadowRoot.getElementById('tm');
      if (tm) tm.textContent = this._fmt(this._dur - el);
      // fertige Bereiche ganz frei, aktueller Bereich entlang der Bürste
      for (let i = this._done + 1; i < (this._st !== 'run' ? 4 : q); i++) { this._popQ(i); this._clearQ(i); this._done = i; this._ps = 0; }
      if (this._st === 'run') {
        if (q !== this._q) {
          this._q = q; this._ps = 0;
          if (this.H._zc().chime !== false) chime();
          if (navigator.vibrate) try { navigator.vibrate(120); } catch (e) { /* egal */ }
          const z = ZONES(), tips = TIPS(), zn = this.shadowRoot.getElementById('zn'), zt = this.shadowRoot.getElementById('zt');
          if (zn) zn.textContent = z[q]; if (zt) zt.textContent = tips[q];
          [0, 1, 2, 3].forEach((i) => { const m = this.shadowRoot.getElementById(`m${i}`); if (m) m.setAttribute('fill', i < q ? '#7cf0c0' : i === q ? '#ffd166' : 'rgba(255,255,255,.35)'); const p = this.shadowRoot.getElementById(`p${i}`); if (p && p.parentNode) p.parentNode.classList.toggle('d', i < q); });
        }
        if (s > this._ps) { this._erase(q, this._ps, s); this._ps = s; }
        const p = this.shadowRoot.getElementById(`p${q}`);
        if (p) p.style.width = `${Math.round(s * 100)}%`;
        const br = this.shadowRoot.getElementById('br');
        if (br && this._g) {
          const [x, y] = this._pt(q, s), d = this._dpr || 1, cv = this.shadowRoot.getElementById('cv');
          br.style.opacity = '1'; br.style.left = `${x / d}px`; br.style.top = `${y / d}px`;
          br.style.setProperty('--bw', `${Math.round(Math.max(130, Math.min(240, (cv.width / d) * 0.46)))}px`);
          // Griff zeigt zur Seite des Bereichs (wie die Hand), Borsten zur Putzstelle; leicht mitgedreht beim Schrubben
          const left = q % 2 === 0, wob = Math.sin(Date.now() / 280) * 4;
          br.style.setProperty('--rot', `${(left ? 212 : -32) + wob}deg`);
          br.classList.toggle('flip', left);
          const now = Date.now();
          if (!this._bbT || now - this._bbT > 260) { this._bbT = now; this._bubble(x / d, y / d); }
          if (!this._spT || now - this._spT > 700) { this._spT = now; this._splash(x / d, y / d); }
        }
      }
      if (this._st === 'run' && el >= this._dur) this._finish();
    }

    _finish() {
      if (this._st !== 'run') return;
      this._st = 'done';
      clearInterval(this._iv); cancelAnimationFrame(this._raf);
      this._setChip('');
      this._tick(true);
      const w0 = this.shadowRoot.getElementById('w');
      if (w0) w0.classList.add('end');
      const br = this.shadowRoot.getElementById('br');
      if (br) br.style.opacity = '0';
      this._fadeMusic();
      if (this._snd) { this._snd.stop(); this._snd = null; }
      this._unlock();
      if (this.H._zc().tada !== false) tada();
      let r = null;
      try { r = this.H._zFinish(this._tid, this._kid, this._date, this._img); } catch (e) { console.error('Yippee Zähne', e); }
      this._res = r || { msg: T('Super geputzt!') };
      this._ui();
      this._confetti();
    }

    _confetti() {
      const w = this.shadowRoot.getElementById('w');
      if (!w) return;
      ['⭐', '✨', '🎉', '💫', '⭐', '✨', '🎊', '⭐'].forEach((e, i) => {
        const d = document.createElement('div');
        d.className = 'conf'; d.textContent = e;
        d.style.left = `${8 + i * 11.5}%`; d.style.top = '-30px'; d.style.animationDelay = `${(i % 4) * 0.18}s`;
        w.appendChild(d); setTimeout(() => d.remove(), 3200);
      });
    }

    _click(e) {
      const el = e.target.closest('[data-a]');
      if (!el) return;
      const a = el.dataset.a;
      if (a === 'go') this._go();
      else if (a === 'view') { this._st = 'view'; this._ui(); }
      else if (a === 'back') { this._st = 'done'; this._ui(); }
      else if (a === 'close') this._stop();
      else if (a === 'x') {
        // Abbrechen während des Putzens nur mit zweitem Tipp (aus Versehen tippt man schnell mal drauf)
        if (this._st !== 'run' || (this._sure && Date.now() - this._sure < 3500)) { this._stop(); return; }
        this._sure = Date.now(); el.classList.add('sure'); el.textContent = T('Abbrechen?');
        setTimeout(() => { if (Date.now() - this._sure >= 3400 && el.isConnected) { el.classList.remove('sure'); el.textContent = '✕'; } }, 3500);
      }
    }

    // ---------- Bildschirm anlassen ----------
    _lock() {
      try { if (navigator.wakeLock && !this._wl) navigator.wakeLock.request('screen').then((l) => { this._wl = l; l.addEventListener('release', () => { this._wl = null; }); }).catch(() => {}); } catch (e) { /* egal */ }
    }
    _unlock() { try { if (this._wl) this._wl.release(); } catch (e) { /* egal */ } this._wl = null; }

    // ---------- Musik ----------
    _prepMusic() {
      const c = this.H._zc(), m = c.mus || 'std', own = (c.mp3 || []).map((x) => x.r).filter((r) => MS_RX.test(r));
      let ref = '';
      if (m === 'off') { this._mref = null; return; }
      if (m === 'own') ref = own.includes(c.musF) ? c.musF : own[0] || '';
      if (m === 'rnd') { const l = ['', ...own]; ref = l[Math.floor(Math.random() * l.length)]; }
      this._mref = ref; this._murl = '';
      // Adresse schon beim Öffnen holen – beim Antippen von „Los geht's“ muss sie bereitstehen (iPhone spielt sonst nicht)
      stdMusic().then((u) => { this._mstd = u; });
      if (ref) resolve(this.H._hass, ref).then((u) => { if (this._mref === ref) this._murl = u; });
    }
    _playMusic() {
      if (this._mref === null) return;
      const go = (src) => {
        if (!src || this._st !== 'run' || this._au) return;
        try {
          const a = new Audio(src);
          a.loop = true; a.volume = 0.85;
          this._au = a;
          const p = a.play();
          // eigenes Lied nicht abspielbar → Standard-Musik
          if (p && p.catch) p.catch(() => { if (src !== this._mstd && this._mstd && this._au === a) { this._au = null; go(this._mstd); } });
        } catch (e) { /* ohne Musik weiter */ }
      };
      const src = this._murl || this._mstd;
      if (src) go(src);
      else (this._mref ? resolve(this.H._hass, this._mref) : Promise.resolve('')).then((u) => u || stdMusic()).then(go);
    }
    _fadeMusic() {
      const a = this._au;
      if (!a) return;
      this._au = null;
      let v = a.volume;
      const iv = setInterval(() => { v -= 0.08; if (v <= 0) { clearInterval(iv); try { a.pause(); } catch (e) { /* egal */ } } else try { a.volume = v; } catch (e) { clearInterval(iv); } }, 90);
    }

    _stop(silent) {
      clearInterval(this._iv); cancelAnimationFrame(this._raf);
      if (this._au) { try { this._au.pause(); } catch (e) { /* egal */ } this._au = null; }
      if (this._snd) { this._snd.stop(); this._snd = null; }
      this._unlock();
      document.removeEventListener('visibilitychange', this._vis);
      window.removeEventListener('resize', this._rs);
      const was = this._st;
      this._st = ''; this._foam = false; this._g = null;
      this.removeAttribute('open');
      const w = this.shadowRoot.getElementById('w');
      if (w) w.innerHTML = '';
      if (!silent && this.H && was) this.H._zClosed(was === 'done');
    }
    disconnectedCallback() { if (this._st) this._stop(true); }
  }

  // ======================================================================
  // 🦷 Tab „Zähne“ in der Eltern-Ansicht: Einstellungen, Bilder, Musik, Kinder
  // ======================================================================
  const TAB_CSS = `
:host{display:block}
*{box-sizing:border-box}
.sec{background:var(--yippee-surface,var(--card-background-color,#fff));border:1px solid var(--divider-color,rgba(127,127,127,.22));border-radius:16px;padding:12px;margin-bottom:10px;color:var(--primary-text-color,#1f2937)}
.sec h3{margin:0 0 8px;font-size:15.5px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.hint{color:var(--secondary-text-color,#6b7280);font-size:12.5px;line-height:1.45;margin:6px 0}
.hint.warn{color:#b45309}
.row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--divider-color,rgba(127,127,127,.15));font-size:14px}
.row:first-of-type{border-top:0}
.row small{display:block;color:var(--secondary-text-color,#6b7280);font-size:12px;font-weight:500;margin-top:1px}
.row .l{flex:1;min-width:0}
button{font:inherit;cursor:pointer;color:inherit}
.sw{width:44px;height:26px;border-radius:13px;background:rgba(127,127,127,.35);position:relative;flex:none;border:0;padding:0}
.sw::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .15s}
.sw.on{background:var(--yippee-accent,#ff8a3d)}.sw.on::after{transform:translateX(18px)}
.num{display:inline-flex;align-items:center;gap:6px;font-weight:800;flex:none}
.num button{width:30px;height:30px;border-radius:9px;border:0;background:rgba(127,127,127,.14);font-size:16px;font-weight:800}
.num span{min-width:24px;text-align:center}
.num.hi span{color:#ea580c}
.seg{display:flex;background:rgba(127,127,127,.12);border-radius:12px;padding:3px;gap:2px}
.seg button{flex:1;border:0;background:none;padding:7px 6px;border-radius:9px;font-weight:700;font-size:13px;color:var(--secondary-text-color,#6b7280);white-space:nowrap}
.seg button.on{background:var(--yippee-surface,var(--card-background-color,#fff));color:var(--primary-text-color,#1f2937);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.chk{display:flex;align-items:center;gap:9px;padding:7px 0;font-size:14px;width:100%;border:0;background:none;text-align:left}
.chk i{font-style:normal;width:22px;height:22px;border-radius:7px;flex:none;display:flex;align-items:center;justify-content:center;font-size:13px;background:rgba(127,127,127,.18);color:#fff}
.chk.on i{background:var(--yippee-accent,#ff8a3d)}
.pin{margin:2px 0 6px}
.grp{border-top:1px solid rgba(127,127,127,.18)}
.grp .gh{display:flex;align-items:center;gap:8px;width:100%;border:0;background:none;padding:10px 0;font-size:14px;font-weight:700;text-align:left;color:inherit;cursor:pointer}
.grp .gh .gl{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.grp .gh .gn{font-weight:700;font-size:12px;min-width:22px;padding:2px 7px;border-radius:999px;background:rgba(127,127,127,.15);text-align:center}
.grp .gh b{transition:transform .2s;opacity:.6}
.grp.open .gh b{transform:rotate(180deg)}
.grp .gb{padding:0 0 6px 4px}
.chk small{color:var(--secondary-text-color,#6b7280);font-size:12px}
table{width:100%;border-collapse:collapse;font-size:14px}
th{font-size:12px;color:var(--secondary-text-color,#6b7280);font-weight:700;padding:6px 2px;text-align:center}
th:first-child,td:first-child{text-align:left}
td{padding:6px 2px;border-top:1px solid var(--divider-color,rgba(127,127,127,.15));text-align:center;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:8px;margin-top:10px}
.tp{position:relative;background:rgba(127,127,127,.08);border-radius:10px;padding:5px;display:flex;flex-direction:column;align-items:center;gap:3px}
.tp.off .im{opacity:.35}
.im{width:100%;aspect-ratio:300/480;border-radius:8px;overflow:hidden;background:rgba(127,127,127,.2);display:flex;align-items:center;justify-content:center;font-size:22px}
.im svg,.im img{width:100%;height:100%;display:block;object-fit:cover}
.tn{font-size:10.5px;font-weight:700;text-align:center;line-height:1.15;min-height:24px;word-break:break-word}
.no{position:absolute;top:8px;left:8px;background:rgba(0,0,0,.6);color:#fff;border-radius:7px;font-size:10px;font-weight:800;padding:1px 5px}
.tb{display:flex;gap:3px;justify-content:center;flex-wrap:wrap}
.tb button{border:0;background:rgba(127,127,127,.16);border-radius:7px;font-size:12px;padding:3px 6px;min-width:26px}
.btn{border:0;border-radius:12px;padding:9px 12px;font-weight:800;font-size:13.5px;background:rgba(127,127,127,.14)}
.btn.pri{background:var(--yippee-accent,#5b6cff);color:#fff}
.btn.sure{background:#dc2626;color:#fff}
.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
select{font:inherit;font-size:13px;padding:5px 6px;border-radius:9px;border:1px solid var(--divider-color,rgba(127,127,127,.35));background:var(--yippee-surface,var(--card-background-color,#fff));color:inherit;max-width:100%}
.kid{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--divider-color,rgba(127,127,127,.15))}
.kid:first-of-type{border-top:0}
.av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:19px;flex:none;background:rgba(127,127,127,.14)}
.kid .t{flex:1;min-width:0;font-size:12.5px;color:var(--secondary-text-color,#6b7280)}
.kid .t b{display:block;color:var(--primary-text-color,#1f2937);font-size:14.5px}
.up{font-size:12.5px;margin-top:6px}
.up div{padding:3px 0}
.mp3{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid var(--divider-color,rgba(127,127,127,.15));font-size:13.5px}
.mp3 .l{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media (max-width:420px){.seg button{font-size:12px;padding:7px 3px}.grid{grid-template-columns:repeat(3,1fr)}}
`;

  // 🤖 Prompt für KI-Bildgeneratoren (Englisch – damit arbeiten alle Generatoren am zuverlässigsten; das Motiv darf in jeder Sprache sein)
  const AI_PROMPT = {
    kid: (m) => `A colorful, high-quality children's book illustration in a modern 3D animated movie look.
Portrait format 9:16 (1080 × 1920 pixels).
Theme: ${m}
A cheerful, detailed scene with friendly, original characters, soft warm lighting, rich colors and gentle depth.
Lots of small details to discover all over the picture – the picture will be revealed area by area, so every quarter (top left, top right, bottom left, bottom right) should contain something interesting.
Main subject roughly in the center.
No text, no letters, no numbers, no logos, no watermark.
No well-known or trademarked characters (no Disney, Pixar, Marvel, Pokémon etc.).
Kid-friendly and positive, nothing scary.`,
    cool: (m) => `A vibrant, high-quality digital illustration in a dynamic, modern style for older kids and teens – no baby or cartoon-cute look.
Portrait format 9:16 (1080 × 1920 pixels).
Theme: ${m}
Action-packed, cool atmosphere (sports, gaming, adventure or sci-fi vibe), dramatic lighting, rich colors, strong depth.
Interesting details spread over the whole picture – it will be revealed area by area, so every quarter (top left, top right, bottom left, bottom right) should contain something worth discovering.
Main subject roughly in the center.
No text, no letters, no numbers, no logos, no watermark.
No well-known or trademarked characters, brands or real people.
Age-appropriate, no violence, nothing scary.`,
  };
  const AI_IDEAS = {
    kid: ['🏰 Ritterburg mit freundlichem Drachen', '🚀 Raketenstart zum Mond', '🐠 Bunte Unterwasserwelt', '🦕 Dinosaurier im Dschungel', '🧚 Feen im Zauberwald', '🚂 Spielzeugeisenbahn im Kinderzimmer', '🐶 Hundewelpen im Garten', '🎪 Zirkus mit Tieren'],
    cool: ['⚽ Fußballstadion bei Nacht', '🛹 Skatepark im Sonnenuntergang', '🏎️ Rennwagen auf Neon-Rennstrecke', '🎮 Gaming-Welt aus Pixelblöcken', '🚀 Raumschiff im Asteroidenfeld', '🏄 Surfer auf riesiger Welle', '🏀 Basketball auf dem Dach eines Hochhauses', '🐉 Drachenreiter über den Bergen'],
  };

  class YippeeTeeth extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      // In der Home-Assistant-App (Android) öffnet „image/*“ + „multiple“ den neuen Foto-Auswähler; dessen Ergebnis kommt in der App-WebView nicht an
      // (Auswahl öffnet sich, aber es wird keine Datei übergeben). In der App deshalb nur ein Bild pro Auswahl – im Browser weiterhin mehrere.
      const inApp = /Home ?Assistant\//i.test(navigator.userAgent || '');
      this.shadowRoot.innerHTML = `<style>${TAB_CSS}</style><div id="app"></div><input type="file" id="fimg" accept="image/*"${inApp ? '' : ' multiple'} hidden><input type="file" id="fmp3" accept=".mp3,audio/mpeg" multiple hidden>`;
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      this.shadowRoot.addEventListener('change', (e) => this._change(e));
      this.shadowRoot.addEventListener('input', (e) => {
        if (!e.target.dataset || e.target.dataset.c !== 'aim' || !this._ai) return;
        this._ai.m = e.target.value; this._aiOk = false;
        const p = this.shadowRoot.getElementById('aipr');
        if (p) p.textContent = AI_PROMPT[this._ai.st](this._ai.m.trim() || T('[Motiv]'));
      });
      this._sure = '';
    }
    attach(H) { this.H = H; this._render(); }
    get _hass() { return this.H && this.H._hass; }
    _admin() { return !!(this._hass && this._hass.user && this._hass.user.is_admin); }
    _set(patch) { this.H._zSet(patch); }

    _render() {
      const H = this.H, app = this.shadowRoot.getElementById('app');
      if (!H || !app) return;
      const c = H._zc(), kids = H._kids(), linked = H._zTasks(), cols = H._zCols(), brushes = H._zBrushes();
      const sw = (k, on, label, sub) => `<div class="row"><div class="l">${label}${sub ? `<small>${sub}</small>` : ''}</div><button class="sw ${on ? 'on' : ''}" data-a="tog" data-k="${k}" role="switch" aria-checked="${on}" aria-label="${esc(label)}"></button></div>`;
      const num = (a, id, v, hi, min = 0) => `<span class="num ${hi ? 'hi' : ''}"><button data-a="${a}" data-id="${esc(id)}" data-d="-1" ${v <= min ? 'disabled' : ''}>−</button><span>${v}</span><button data-a="${a}" data-id="${esc(id)}" data-d="1">＋</button></span>`;
      const seg = (a, cur, opts) => `<div class="seg">${opts.map(([v, l]) => `<button class="${String(cur) === String(v) ? 'on' : ''}" data-a="${a}" data-v="${esc(v)}">${l}</button>`).join('')}</div>`;

      // 🔗 Aufgaben
      const all = Object.values(H._db.task).filter((t) => !t.virtual && t.sched !== 'once').sort((a, b) => String(a.title).localeCompare(String(b.title)));
      const kn = (t) => (t.kids || []).map((id) => (H._db.kid[id] || {}).name).filter(Boolean).join(', ');
      // Verknüpfte Aufgaben stehen immer oben; alle anderen nach Kind bzw. gemeinsamen Aufgaben gruppiert und zugeklappt
      const row = (t, names) => { const on = linked.includes(t.id); return `<button class="chk ${on ? 'on' : ''}" data-a="task" data-id="${esc(t.id)}"><i>${on ? '✓' : ''}</i><span>${esc(t.emoji || '⭐')} ${esc(t.title)} ${names && kn(t) ? `<small>· ${esc(kn(t))}</small>` : ''}</span></button>`; };
      const kidIds = kids.map((k) => k.id), grp = new Map();
      all.filter((t) => !linked.includes(t.id)).forEach((t) => {
        const ks = (t.kids || []).filter((id) => H._db.kid[id]).sort((x, y) => kidIds.indexOf(x) - kidIds.indexOf(y));
        const key = ks.length ? ks.join('+') : '-';
        if (!grp.has(key)) grp.set(key, { ks, list: [] });
        grp.get(key).list.push(t);
      });
      const gOrd = (g) => (g.ks.length === 1 ? kidIds.indexOf(g.ks[0]) : g.ks.length ? 1000 + g.ks.length * 100 + kidIds.indexOf(g.ks[0]) : 9999);
      if (!this._grp) this._grp = new Set();
      const grpHtml = [...grp.entries()].sort((x, y) => gOrd(x[1]) - gOrd(y[1])).map(([key, g]) => {
        const k1 = g.ks.length === 1 ? H._db.kid[g.ks[0]] : null, open = this._grp.has(key);
        const lbl = k1 ? `${esc(k1.emoji || '🙂')} ${esc(k1.name)}` : g.ks.length ? esc(T('👫 Gemeinsam: {names}', { names: g.ks.map((id) => H._db.kid[id].name).join(', ') })) : esc(T('👤 Ohne Kind'));
        return `<div class="grp ${open ? 'open' : ''}"><button class="gh" data-a="grp" data-id="${esc(key)}" aria-expanded="${open}"><span class="gl">${lbl}</span><small class="gn">${g.list.length}</small><b>▾</b></button>${open ? `<div class="gb">${g.list.map((t) => row(t, false)).join('')}</div>` : ''}</div>`;
      }).join('');
      const pinned = linked.map((id) => H._db.task[id]).filter((t) => t && !t.virtual).map((t) => row(t, true)).join('');
      const tasksHtml = all.length ? `${pinned ? `<div class="pin">${pinned}</div>` : ''}${grpHtml}` : `<div class="hint">${T('Noch keine Aufgaben angelegt.')}</div>`;

      // ⭐ Sterne
      const base = linked.map((id) => H._db.task[id]).filter(Boolean)[0];
      const def = base ? Number(base.points) || 0 : 1;
      const allV = c.pAll === undefined || c.pAll === null ? def : c.pAll;
      let starHtml;
      if (c.pm === 'kid') {
        const rows = kids.map((k) => {
          const mine = cols.filter((x) => (x.kids || []).includes(k.id));
          const vals = mine.map((x) => H._zPtsCol(x.id, k.id)), mx = Math.max(...vals, 0), mn = Math.min(...vals, 999);
          return `<tr><td>${esc(k.emoji || '🙂')} ${esc(k.name)}</td>${cols.map((x) => (x.kids || []).includes(k.id) ? `<td>${num('pk', `${k.id}|${x.id}`, H._zPtsCol(x.id, k.id), mx > mn && H._zPtsCol(x.id, k.id) === mx)}</td>` : '<td>–</td>').join('')}</tr>`;
        }).join('');
        starHtml = cols.length ? `<div style="overflow-x:auto"><table><tr><th></th>${cols.map((x) => `<th>${esc(x.label)}</th>`).join('')}</tr>${rows}</table></div>
          <div class="hint">${T('💡 Putzt ein Kind z. B. morgens ungern, gib dort mehr Sterne – auf der Kachel steht dann „🔥 Extra!“.')}</div>` : `<div class="hint">${T('Zuerst oben eine Zahnputz-Aufgabe auswählen.')}</div>`;
      } else {
        starHtml = `<div class="row"><div class="l">${T('⭐ Sterne pro Zähneputzen')}<small>${c.pAll === undefined || c.pAll === null ? T('wie in der Aufgabe eingestellt') : T('gilt für alle Zahnputz-Aufgaben')}</small></div>${num('pall', '', allV)}</div>`;
      }

      // 🖼️ Bilder
      const own = c.own || [], hide = new Set(c.hide || []);
      const order = (() => { const ids = [...TPL_IDS, ...own.map((o) => o.i)]; return c.mode === 'ord' && Array.isArray(c.ord) && c.ord.length ? [...c.ord.filter((x) => ids.includes(x)), ...ids.filter((x) => !c.ord.includes(x))] : ids; })();
      const grid = order.map((id, n) => {
        const o = own.find((x) => x.i === id), off = hide.has(id);
        const im = o ? (() => { const u = cachedUrl(o.r); if (!u) resolve(this._hass, o.r).then(() => this._later()); return u ? `<img src="${esc(u)}" alt="">` : '📷'; })() : sceneSvg(id);
        const forSel = o ? `<select data-c="ownk" data-id="${esc(id)}" aria-label="${esc(T('Für welches Kind?'))}"><option value="">${T('alle')}</option>${kids.map((k) => `<option value="${esc(k.id)}" ${(o.k || []).includes(k.id) ? 'selected' : ''}>${esc(k.name)}</option>`).join('')}</select>` : '';
        return `<div class="tp ${off ? 'off' : ''}"><span class="no">${n + 1}</span><div class="im">${im}</div><div class="tn">${esc(o ? o.n : tplName(id))}</div>${forSel}
          <div class="tb"><button data-a="hide" data-id="${esc(id)}" title="${esc(off ? T('Wieder zeigen') : T('Ausblenden'))}">${off ? '🙈' : '👁️'}</button>${c.mode === 'ord' ? `<button data-a="mv" data-id="${esc(id)}" data-d="-1" ${n === 0 ? 'disabled' : ''}>◀</button><button data-a="mv" data-id="${esc(id)}" data-d="1" ${n === order.length - 1 ? 'disabled' : ''}>▶</button>` : ''}${o && this._admin() ? `<button data-a="odel" data-id="${esc(id)}" class="${this._sure === `odel${id}` ? 'sure' : ''}">${this._sure === `odel${id}` ? T('Löschen?') : '✕'}</button>` : ''}</div></div>`;
      }).join('');
      const vis = order.filter((x) => !hide.has(x)).length;

      // 🎵 Musik
      const mp3 = c.mp3 || [], mus = c.mus || 'std';
      const mp3Html = mp3.map((m) => `<div class="mp3"><span>🎵</span><span class="l">${esc(m.n)}</span>${mus === 'own' ? `<button class="btn" data-a="musf" data-id="${esc(m.r)}">${(c.musF || mp3[0].r) === m.r ? '✓ ' : ''}${T('Auswählen')}</button>` : ''}<button class="btn" data-a="play" data-id="${esc(m.r)}">${this._playing === m.r ? '⏹' : '▶️'}</button>${this._admin() ? `<button class="btn ${this._sure === `mdel${m.r}` ? 'sure' : ''}" data-a="mdel" data-id="${esc(m.r)}">${this._sure === `mdel${m.r}` ? T('Löschen?') : '✕'}</button>` : ''}</div>`).join('');

      const up = this._up ? `<div class="up">${this._up.map((u) => `<div>${u.st === 'ok' ? '✅' : u.st === 'fail' ? '⚠️' : '⏳'} ${esc(u.name)}${u.err ? ` – ${esc(u.err)}` : ''}</div>`).join('')}</div>` : '';
      const adm = this._admin();

      app.innerHTML = `
        <div class="sec"><h3>${T('🔗 Zahnputz-Aufgaben')}</h3>
          <div class="hint">${T('Bei diesen Aufgaben erscheint in der Kinder-Ansicht der Knopf „🦷 Los geht\'s!“.')}</div>${tasksHtml}
          ${c.tasks === undefined && linked.length ? `<div class="hint">${T('✨ Automatisch erkannt – antippen zum Ändern.')}</div>` : ''}</div>
        <div class="sec"><h3>${T('⭐ Sterne & Regeln')}</h3>
          ${seg('pm', c.pm === 'kid' ? 'kid' : 'all', [['all', T('Für alle gleich')], ['kid', T('Je Kind & Tageszeit')]])}
          <div style="margin-top:8px">${starHtml}</div>
          ${sw('pNoT', !!c.pNoT, T('Diese Sterne auch ohne Timer'), T('Aus: Wer ohne Timer abhakt, bekommt die Sterne der Aufgabe.'))}
          ${sw('inst', c.inst !== false, T('✅ Mit Timer sofort gutschreiben'), H._approval ? T('ohne Freigabe der Eltern – der Timer ist der Nachweis') : T('Die Freigabe ist gerade ausgeschaltet – es wird ohnehin sofort gebucht.'))}
          ${sw('only', !!c.only, T('🔒 Nur mit Timer abhaken'), T('Antippen der Aufgabe startet dann den Timer.'))}
          <div class="row"><div class="l">${T('🔥 Bonus für 7 Tage am Stück')}<small>${T('jedes Mal mit Timer geputzt · 0 = aus')}</small></div>${num('bonus', '', Math.max(0, Number(c.bonus) || 0))}</div></div>
        <div class="sec"><h3>${T('⏱️ Putzdauer')}</h3>
          ${kids.length ? kids.map((k) => { const d = DUR.includes(Number((c.dur || {})[k.id])) ? Number(c.dur[k.id]) : 120; return `<div class="kid"><div class="av">${esc(k.emoji || '🙂')}</div><div class="t"><b>${esc(k.name)}</b>${T('4 Bereiche à {n} Sek.', { n: d / 4 })}</div><div style="width:150px">${seg(`dur|${k.id}`, d, DUR.map((v) => [v, `${v / 60}:00`]))}</div></div>`; }).join('') : `<div class="hint">${T('Noch keine Kinder angelegt.')}</div>`}</div>
        <div class="sec"><h3>${T('🎵 Musik')}</h3>
          ${seg('mus', mus, [['std', T('Standard')], ['own', T('Eigene')], ['rnd', T('🎲 Zufall')], ['off', T('Aus')]])}
          ${mus === 'std' ? `<div class="btns"><button class="btn" data-a="play" data-id="">${this._playing === '' ? T('⏹ Stopp') : T('▶️ Anhören')}</button></div>` : ''}
          ${mus === 'own' || mus === 'rnd' ? `${mp3Html || `<div class="hint">${T('Noch keine eigenen Lieder hochgeladen.')}</div>`}${mus === 'rnd' ? `<div class="hint">${T('Zufall: Standard-Musik und alle eigenen Lieder.')}</div>` : ''}` : ''}
          ${mus !== 'off' && mus !== 'std' ? (adm ? `<div class="btns"><button class="btn pri" data-a="upmp3">${T('📂 MP3 hochladen')}</button></div>` : `<div class="hint">${T('🔒 Hochladen nur als Administrator.')}</div>`) : ''}
          <div class="row"><div class="l">${T('🔊 Putzgeräusch')}<small>${T('Bei einer Oral-B-Zahnbürste immer aus – die summt selbst.')}</small></div><select data-c="snd" aria-label="${esc(T('🔊 Putzgeräusch'))}">${[['off', T('Aus')], ['scrub', T('Schrubben')], ['el', T('Elektrische Zahnbürste')]].map(([v, l]) => `<option value="${v}" ${(c.snd || 'off') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
          ${sw('chime', c.chime !== false, T('🔔 Ton beim Wechsel des Bereichs'))}
          ${sw('tada', c.tada !== false, T('🎉 „Ta-da“ am Ende'))}
          <div class="hint">${T('Längere Lieder werden am Ende ausgeblendet, kürzere laufen von vorne weiter.')}</div></div>
        <div class="sec"><h3>${T('✨ Darstellung')}</h3>
          ${sw('anim', c.anim !== false, T('✨ Bewegte Effekte'), T('Sterne funkeln, Bläschen steigen, Lichter schweben'))}
          ${sw('blur', !!c.blur, T('🌫️ Bild erst am Ende scharf'), T('Für Kinder, die sonst nur aufs Bild schauen: Es bleibt verschwommen und wird erst gegen Ende klar.'))}</div>
        <div class="sec"><h3>${T('🦷 Oral-B-Zahnbürste')}</h3>
          ${brushes.length ? `<div class="hint">${T('Mit einer Bluetooth-Zahnbürste von Oral-B startet der Timer von selbst, sobald die Zahnbürste läuft, und warnt bei zu viel Druck.')}</div>
          ${kids.map((k) => `<div class="kid"><div class="av">${esc(k.emoji || '🙂')}</div><div class="t"><b>${esc(k.name)}</b></div><select data-c="brush" data-id="${esc(k.id)}" aria-label="${esc(T('Zahnbürste'))}"><option value="">${T('– keine –')}</option>${brushes.map((b) => `<option value="${esc(b.id)}" ${(c.brush || {})[k.id] === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div>`).join('')}
          ${sw('bFollow', c.bFollow !== false, T('⏸️ Timer hält an, wenn die Zahnbürste aus ist'))}` : `<div class="hint">${T('Keine Oral-B-Zahnbürste gefunden. Mit der Integration „Oral-B“ (Bluetooth) in Home Assistant startet der Timer von selbst, sobald die Zahnbürste läuft.')}</div>`}</div>
        <div class="sec"><h3>${T('🖼️ Bilder')} <span class="hint" style="margin:0">${vis}/${order.length}</span></h3>
          ${seg('mode', c.mode === 'ord' ? 'ord' : 'rnd', [['rnd', T('🎲 Zufall')], ['ord', T('🔢 Feste Reihenfolge')]])}
          <div class="hint">${c.mode === 'ord' ? T('Die Bilder kommen nacheinander wie unten sortiert (◀ ▶).') : T('Ein Bild kommt erst wieder, wenn alle anderen dran waren – am selben Tag nie zweimal.')}</div>
          <div class="grid">${grid}</div>
          ${adm ? `<div class="btns"><button class="btn pri" data-a="upimg">${T('📷 Eigenes Bild hochladen')}</button></div><div class="hint">${T('Am besten im Hochformat – das Bild wird automatisch verkleinert.')}</div>` : `<div class="hint">${T('🔒 Eigene Bilder hochladen nur als Administrator.')}</div>`}
          ${this._aiHtml(kids)}
          ${up}${vis ? '' : `<div class="hint warn">${T('⚠️ Alle Bilder sind ausgeblendet – es wird ein Standardbild gezeigt.')}</div>`}</div>
        <div class="sec"><h3>${T('👧 Kinder')}</h3>
          ${kids.map((k) => { const z = H._db.zk[k.id] || {}, sn = H._zStreak(k.id), pk = pool(H, k.id), seen = (z.seen || []).filter((x) => pk.includes(x)).length; return `<div class="kid"><div class="av">${esc(k.emoji || '🙂')}</div><div class="t"><b>${esc(k.name)}</b>${T(sn === 1 ? '🔥 1 Tag · {seen}/{all} Bilder · {n}× geputzt' : '🔥 {s} Tage · {seen}/{all} Bilder · {n}× geputzt', { s: sn, seen, all: pk.length, n: Number(z.n) || 0 })}</div><button class="btn ${this._sure === `rst${k.id}` ? 'sure' : ''}" data-a="rst" data-id="${esc(k.id)}" title="${esc(T('Zurücksetzen'))}">${this._sure === `rst${k.id}` ? T('Zurücksetzen?') : '↺'}</button></div>`; }).join('')}</div>`;
    }
    // 🤖 Eigene Bilder mit KI erstellen
    _aiHtml(kids) {
      const H = this.H;
      if (!this._ai) { const ages = kids.map((k) => H._age(k)).filter((a) => a !== null); this._ai = { st: ages.length && Math.min(...ages) >= 9 ? 'cool' : 'kid', m: '', open: false }; }
      const a = this._ai, m = a.m.trim() || T('[Motiv]'), pr = AI_PROMPT[a.st](m);
      if (!a.open) return `<div class="btns"><button class="btn" data-a="aiopen">${T('🤖 Eigene Bilder mit KI erstellen')} ▸</button></div>`;
      return `<div class="sec" style="margin:10px 0 0;background:rgba(127,127,127,.06)"><h3>${T('🤖 Eigene Bilder mit KI erstellen')}<button class="btn" data-a="aiopen" aria-label="${esc(T('Zuklappen'))}">▾</button></h3>
        <div class="seg">${[['kid', T('🧸 Verspielt (3–8)')], ['cool', T('😎 Cool (9–14)')]].map(([v, l]) => `<button class="${a.st === v ? 'on' : ''}" data-a="aist" data-v="${v}">${l}</button>`).join('')}</div>
        <div class="row"><div class="l"><input data-c="aim" value="${esc(a.m)}" placeholder="${esc(T('Motiv, z. B. Ritterburg mit Drachen'))}" maxlength="120" style="width:100%;font:inherit;font-size:14px;padding:8px 10px;border-radius:10px;border:1px solid var(--divider-color,rgba(127,127,127,.35));background:var(--yippee-surface,var(--card-background-color,#fff));color:inherit;box-sizing:border-box"></div><button class="btn" data-a="aidice" title="${esc(T('Zufälliges Motiv'))}">🎲</button></div>
        <div class="tb" style="justify-content:flex-start;margin:4px 0 8px">${AI_IDEAS[a.st].map((x) => `<button data-a="aiidea" data-v="${esc(T(x))}">${esc(T(x))}</button>`).join('')}</div>
        <pre id="aipr" style="white-space:pre-wrap;word-break:break-word;font-size:11.5px;line-height:1.45;background:rgba(127,127,127,.1);border-radius:10px;padding:10px;margin:0;max-height:220px;overflow:auto">${esc(pr)}</pre>
        <div class="btns"><button class="btn pri" data-a="aicopy">${this._aiOk ? T('✅ Kopiert') : T('📋 Kopieren')}</button></div>
        <div class="hint"><b>${T('So geht\'s:')}</b><br>${T('1. Motiv eintragen, dann 📋 Kopieren.')}<br>${T('2. In ChatGPT, Gemini oder Microsoft Designer einfügen und absenden.')}<br>${T('3. Gefällt das Bild noch nicht ganz? Schreib im selben Chat einfach, was anders sein soll – z. B. „mach den Drachen grün“, „mehr Details unten links“ oder „gleicher Stil, aber jetzt ein Weltraum-Motiv“. So entsteht auch eine ganze Bilderserie im gleichen Stil.')}<br>${T('4. Bild speichern und hier mit „📷 Eigenes Bild hochladen“ einfügen.')}</div>
        <div class="hint">${T('Bitte nur Bilder verwenden, die du nutzen darfst. Die Bilder bleiben bei dir in Home Assistant.')}</div></div>`;
    }
    _later() { clearTimeout(this._lt); this._lt = setTimeout(() => this._render(), 80); }

    _ask(key) {
      // Löschen/Zurücksetzen nur mit zweitem Tipp
      if (this._sure === key && Date.now() - this._sureT < 8000) { this._sure = ''; return true; }
      this._sure = key; this._sureT = Date.now(); this._render();
      clearTimeout(this._sTm); this._sTm = setTimeout(() => { if (this._sure === key) { this._sure = ''; this._render(); } }, 8000);
      return false;
    }

    _click(e) {
      const el = e.target.closest('[data-a]');
      if (!el || !this.H) return;
      const a = el.dataset.a, id = el.dataset.id || '', d = Number(el.dataset.d) || 0, H = this.H, c = H._zc();
      if (a === 'tog') { const k = el.dataset.k, def = { inst: true, chime: true, tada: true, anim: true, bFollow: true }[k] || false; this._set({ [k]: !(c[k] === undefined ? def : c[k]) }); }
      else if (a === 'grp') { if (this._grp.has(id)) this._grp.delete(id); else this._grp.add(id); this._render(); return; }
      else if (a === 'task') { const cur = H._zTasks(); this._set({ tasks: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] }); }
      else if (a === 'pm') this._set({ pm: el.dataset.v === 'kid' ? 'kid' : 'all' });
      else if (a === 'pall') { const base = H._zTasks().map((x) => H._db.task[x]).filter(Boolean)[0], cur = c.pAll === undefined || c.pAll === null ? (base ? Number(base.points) || 0 : 1) : c.pAll; this._set({ pAll: Math.max(0, Math.min(100, cur + d)) }); }
      else if (a === 'pk') {
        const [kid, col] = id.split('|'), v = Math.max(0, Math.min(100, H._zPtsCol(col, kid) + d));
        this._set({ pt: { [kid]: { [col]: v } } });
      } else if (a === 'bonus') this._set({ bonus: Math.max(0, Math.min(100, (Number(c.bonus) || 0) + d)) });
      else if (a.startsWith('dur|')) this._set({ dur: { [a.slice(4)]: Number(el.dataset.v) } });
      else if (a === 'mus') this._set({ mus: ['std', 'own', 'rnd', 'off'].includes(el.dataset.v) ? el.dataset.v : 'std' });
      else if (a === 'musf') this._set({ musF: id });
      else if (a === 'mode') this._set({ mode: el.dataset.v === 'ord' ? 'ord' : 'rnd' });
      else if (a === 'hide') { const h = new Set(c.hide || []); if (h.has(id)) h.delete(id); else h.add(id); this._set({ hide: [...h] }); }
      else if (a === 'mv') {
        const ids = [...TPL_IDS, ...(c.own || []).map((o) => o.i)];
        const o = Array.isArray(c.ord) && c.ord.length ? [...c.ord.filter((x) => ids.includes(x)), ...ids.filter((x) => !c.ord.includes(x))] : ids;
        const i = o.indexOf(id), j = i + d;
        if (i < 0 || j < 0 || j >= o.length) return;
        [o[i], o[j]] = [o[j], o[i]]; this._set({ ord: o });
      } else if (a === 'play') this._play(id);
      else if (a === 'aiopen') { this._ai.open = !this._ai.open; }
      else if (a === 'aist') { this._ai.st = el.dataset.v === 'cool' ? 'cool' : 'kid'; }
      else if (a === 'aiidea') { this._ai.m = el.dataset.v || ''; this._aiOk = false; }
      else if (a === 'aidice') { const l = AI_IDEAS[this._ai.st].map((x) => T(x)).filter((x) => x !== this._ai.m); this._ai.m = l[Math.floor(Math.random() * l.length)]; this._aiOk = false; }
      else if (a === 'aicopy') { this._copy(AI_PROMPT[this._ai.st](this._ai.m.trim() || T('[Motiv]'))); return; }
      else if (a === 'upimg') { if (this._admin()) this.shadowRoot.getElementById('fimg').click(); }
      else if (a === 'upmp3') { if (this._admin()) this.shadowRoot.getElementById('fmp3').click(); }
      else if (a === 'odel') { if (this._admin() && this._ask(`odel${id}`)) this._delOwn(id); return; }
      else if (a === 'mdel') { if (this._admin() && this._ask(`mdel${id}`)) this._delMp3(id); return; }
      else if (a === 'rst') { if (this._ask(`rst${id}`)) { H._save('zk', id, {}, () => ({})); H._toast(T('↺ Zurückgesetzt')); } return; }
      else return;
      this._render();
    }

    _change(e) {
      const el = e.target;
      if (el.id === 'fimg') { const f = [...(el.files || [])]; el.value = ''; this._upImgs(f); return; }
      if (el.id === 'fmp3') { const f = [...(el.files || [])]; el.value = ''; this._upMp3s(f); return; }
      if (el.dataset && el.dataset.c === 'snd') { this._set({ snd: el.value }); this._render(); return; }
      if (el.dataset && el.dataset.c === 'brush') { this._set({ brush: { [el.dataset.id]: el.value } }); this._render(); return; }
      if (el.dataset && el.dataset.c === 'ownk') {
        const id = el.dataset.id, v = el.value, c = this.H._zc();
        this._set({ own: (c.own || []).map((o) => (o.i === id ? { ...o, k: v ? [v] : [] } : o)) });
      }
    }

    _copy(txt) {
      const ok = () => { this._aiOk = true; this.H._toast(T('📋 Kopiert – jetzt in der KI einfügen')); this._render(); };
      const fb = () => { try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; this.shadowRoot.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); ok(); } catch (e) { this.H._toast(T('Kopieren nicht möglich – bitte den Text markieren')); } };
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, fb); else fb(); } catch (e) { fb(); }
    }
    // ▶️ Anhören (Standard-Musik oder eigenes Lied) – nochmal tippen stoppt
    _play(ref) {
      if (this._au) { try { this._au.pause(); } catch (e) { /* egal */ } }
      if (this._playing === ref) { this._playing = undefined; this._au = null; this._render(); return; }
      this._playing = ref;
      const go = (u) => { if (this._playing !== ref) return; try { if (!u) { this._playing = undefined; this._render(); return; } this._au = new Audio(u); this._au.play().catch(() => { this._playing = undefined; this._render(); }); this._au.onended = () => { this._playing = undefined; this._render(); }; } catch (e) { this._playing = undefined; } this._render(); };
      (ref ? resolve(this._hass, ref) : stdMusic()).then(go);
    }
    disconnectedCallback() { if (this._au) { try { this._au.pause(); } catch (e) { /* egal */ } this._au = null; this._playing = undefined; } }

    // ---------- Hochladen (nur Administratoren – die Karte ruft den Dienst für andere gar nicht erst auf) ----------
    async _send(blob, name, type) {
      const fd = new FormData();
      fd.append('media_content_id', MEDIA_ROOT);
      fd.append('file', new File([blob], name, { type }));
      const path = '/api/media_source/local_source/upload', h = this._hass;
      const res = h.fetchWithAuth ? await h.fetchWithAuth(path, { method: 'POST', body: fd })
        : await fetch(path, { method: 'POST', body: fd, headers: { Authorization: `Bearer ${h.auth && h.auth.data && h.auth.data.access_token}` } });
      if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? T('Keine Berechtigung – nur Administratoren dürfen hochladen') : (res.status === 413 ? T('Datei zu groß') : T('Fehler {n} von Home Assistant', { n: res.status })));
      const j = res.json ? await res.json().catch(() => ({})) : {};
      return (j && j.media_content_id) || `${MEDIA_ROOT}/${name}`;
    }
    _safe(n, ext) {
      const b = String(n || '').replace(/\.[^.]*$/, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').replace(/ß/g, 'ss')
        .replace(/[^A-Za-z0-9_-]+/g, '_').replace(/_+/g, '_').replace(/^[_-]+|[_-]+$/g, '').slice(0, 50) || 'bild';
      return `${b}_${uid().slice(0, 5)}.${ext}`;
    }
    // Bild verkleinern (max. 1080 × 1920) und als JPG speichern – so gehen auch PNG, HEIC (wenn der Browser es öffnen kann) usw.
    _toJpg(f) {
      return new Promise((res, rej) => {
        const url = URL.createObjectURL(f), im = new Image();
        const to = setTimeout(() => { URL.revokeObjectURL(url); rej(new Error(T('Bild lässt sich nicht öffnen'))); }, 15000);
        im.onload = () => {
          clearTimeout(to);
          try {
            const sc = Math.min(1, 1080 / Math.min(im.naturalWidth, im.naturalHeight), 1920 / Math.max(im.naturalWidth, im.naturalHeight));
            const w = Math.max(1, Math.round(im.naturalWidth * sc)), h = Math.max(1, Math.round(im.naturalHeight * sc));
            const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
            const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(im, 0, 0, w, h);
            cv.toBlob((b) => { URL.revokeObjectURL(url); if (b) res(b); else rej(new Error(T('Bild lässt sich nicht öffnen'))); }, 'image/jpeg', 0.86);
          } catch (e) { URL.revokeObjectURL(url); rej(e); }
        };
        im.onerror = () => { clearTimeout(to); URL.revokeObjectURL(url); rej(new Error(T('Bild lässt sich nicht öffnen'))); };
        im.src = url;
      });
    }
    async _upImgs(files) {
      if (!this._admin() || !files.length || this._busy) return;
      this._busy = true;
      this._up = files.slice(0, 20).map((f) => ({ f, name: f.name, st: 'up' }));
      this._render();
      const add = [];
      for (const u of this._up) {
        try {
          if (u.f.size > MAX_UP) throw new Error(T('Zu groß – höchstens 20 MB'));
          const b = await this._toJpg(u.f), nm = this._safe(u.f.name, 'jpg'), r = await this._send(b, nm, 'image/jpeg');
          add.push({ i: `o${uid().slice(0, 8)}`, r, n: String(u.f.name).replace(/\.[^.]*$/, '').slice(0, 40) || T('Eigenes Bild'), k: [] });
          u.st = 'ok';
        } catch (e) { u.st = 'fail'; u.err = errMsg(e); }
        this._render();
      }
      if (add.length) { const c = this.H._zc(); this._set({ own: [...(c.own || []), ...add].slice(-40) }); this.H._toast(add.length === 1 ? T('📷 1 Bild hinzugefügt') : T('📷 {n} Bilder hinzugefügt', { n: add.length })); }
      this._busy = false; this._render();
      setTimeout(() => { if (!this._busy) { this._up = null; this._render(); } }, 6000);
    }
    async _upMp3s(files) {
      if (!this._admin() || !files.length || this._busy) return;
      this._busy = true;
      this._up = files.slice(0, 10).map((f) => ({ f, name: f.name, st: 'up' }));
      this._render();
      const add = [];
      for (const u of this._up) {
        try {
          if (u.f.size > MAX_UP) throw new Error(T('Zu groß – höchstens 20 MB'));
          const h = new Uint8Array(await u.f.slice(0, 4).arrayBuffer());
          const isMp3 = (h[0] === 0x49 && h[1] === 0x44 && h[2] === 0x33) || (h[0] === 0xff && (h[1] & 0xe0) === 0xe0);
          if (!isMp3) throw new Error(T('Keine MP3-Datei'));
          const nm = this._safe(u.f.name, 'mp3'), r = await this._send(u.f, nm, 'audio/mpeg');
          add.push({ r, n: String(u.f.name).replace(/\.[^.]*$/, '').slice(0, 40) || 'MP3' });
          u.st = 'ok';
        } catch (e) { u.st = 'fail'; u.err = errMsg(e); }
        this._render();
      }
      if (add.length) { const c = this.H._zc(); this._set({ mp3: [...(c.mp3 || []), ...add].slice(-20), ...(c.mus === 'own' && !c.musF ? { musF: add[0].r } : {}) }); this.H._toast(T('🎵 Hochgeladen')); }
      this._busy = false; this._render();
      setTimeout(() => { if (!this._busy) { this._up = null; this._render(); } }, 6000);
    }
    async _rmMedia(ref) { try { await this._hass.callWS({ type: 'media_source/local_source/remove', media_content_id: ref }); } catch (e) { /* Datei war schon weg */ } }
    async _delOwn(id) {
      if (!this._admin()) return;
      const c = this.H._zc(), o = (c.own || []).find((x) => x.i === id);
      if (!o) return;
      this._set({ own: (c.own || []).filter((x) => x.i !== id), hide: (c.hide || []).filter((x) => x !== id), ord: (c.ord || []).filter((x) => x !== id) });
      await this._rmMedia(o.r);
      this.H._toast(T('🗑️ Gelöscht')); this._render();
    }
    async _delMp3(ref) {
      if (!this._admin()) return;
      const c = this.H._zc();
      this._set({ mp3: (c.mp3 || []).filter((x) => x.r !== ref), ...(c.musF === ref ? { musF: '' } : {}) });
      if (this._playing === ref) this._play(ref);
      await this._rmMedia(ref);
      this.H._toast(T('🗑️ Gelöscht')); this._render();
    }
  }

  customElements.define('yippee-teeth', YippeeTeeth);
  customElements.define('yippee-teeth-run', YippeeTeethRun);
  return true;
}
