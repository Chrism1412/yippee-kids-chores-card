/* Yippee! - Kids Chores – 🗺️ Abenteuer: ein eigenes Jump & Run mit dem Haustier des Kindes als Spielfigur
 * Wird erst geladen, wenn das Abenteuer geöffnet wird (🐾 Haustier → 🎮 Spiele → 🗺️ … Abenteuer).
 * 10 Level in 5 Welten, Fähnchen als Zwischenstand, 1–3 Kronen je Level, Fortschritt je Kind (pk.jr),
 * Tageslimit (⚙️ Tab 🐾 Haustier). Titelbild mit dem Haustier, dann die Karte.
 * Stufe „Einfach“ (langsamer, feste Brücken, 5 Herzen) oder „Normal“ (schneller, fahrende Plattformen, 3 Herzen).
 * Steuerung mit ◀ ▶ ⤒ (Knöpfe unter dem Spielfeld, im Querformat darüber) – für Kleine je Kind „läuft von allein“ (pk.jr.a).
 * Musik und Töne werden im Browser erzeugt (WebAudio) – eigene Melodien im 16-Bit-Stil, keine Dateien.
 */
export default function install(C, Y) {
  const { T, esc, dk, petDraw, KIND } = Y;
  const ROWS = 12;

  // ---------- Welten ----------
  const WORLDS = [
    { e: '🌳', n: 'Wiese', sky: ['#8fd3ff', '#d9f4ff'], hill: '#7ccf6b', hill2: '#a6e39a', top: '#5fbf3f', dirt: '#b07a45', dirt2: '#8f5f30', foe: '🐌', plat: '#c98d4a' },
    { e: '🏖️', n: 'Strand', sky: ['#62c6ff', '#fff3c4'], hill: '#ffd98a', hill2: '#ffe9b5', top: '#ffe08a', dirt: '#f0c060', dirt2: '#d9a441', foe: '🦀', plat: '#c98d4a' },
    { e: '🍭', n: 'Süßigkeitenland', sky: ['#ffb3e1', '#fff0fa'], hill: '#ff9ccf', hill2: '#ffc6e5', top: '#ff7eb9', dirt: '#ffd1e8', dirt2: '#f7a6cf', foe: '🐛', plat: '#b197fc' },
    { e: '❄️', n: 'Schnee', sky: ['#a5d8ff', '#f1f8ff'], hill: '#e7f5ff', hill2: '#ffffff', top: '#ffffff', dirt: '#a5c8e6', dirt2: '#7fa8cc', foe: '🐧', plat: '#74c0fc' },
    { e: '🌙', n: 'Sternennacht', sky: ['#1b1e3a', '#3b3f7a'], hill: '#2b2f55', hill2: '#3a3f73', top: '#7950f2', dirt: '#4c4f8a', dirt2: '#363a6e', foe: '🦔', plat: '#9775fa' },
  ];
  const MUSIC = [ // eigene Melodien (Tonstufen der Dur-Tonleiter, 0 = Pause), je Welt eine
    { bpm: 132, m: '1 3 5 3 6 5 3 0 4 6 8 6 5 3 2 0 1 3 5 8 7 5 6 0 5 4 3 2 1 0 0 0', b: '1 1 5 5 4 4 5 5 1 1 5 5 4 4 5 1' },
    { bpm: 120, m: '5 0 5 6 5 3 1 0 2 3 4 0 4 5 4 2 5 0 5 6 8 6 5 3 4 3 2 3 1 0 0 0', b: '1 5 1 5 4 1 5 5 1 5 6 4 5 5 1 1' },
    { bpm: 144, m: '8 7 6 5 6 5 3 0 4 5 6 8 6 5 3 0 8 7 6 5 6 8 10 0 9 8 6 5 8 0 0 0', b: '1 1 4 4 6 6 5 5 1 1 4 4 5 5 1 1' },
    { bpm: 108, m: '3 0 5 0 8 7 5 0 6 0 5 3 2 0 0 0 3 0 5 0 8 9 8 0 7 5 6 7 8 0 0 0', b: '1 1 6 6 4 4 5 5 1 1 6 6 4 5 1 1' },
    { bpm: 126, m: '1 0 5 0 3 5 6 5 4 0 6 0 5 4 3 0 1 0 5 0 8 6 5 3 4 5 2 3 1 0 0 0', b: '6 6 4 4 1 1 5 5 6 6 4 4 5 5 1 1' },
    { bpm: 138, m: '5 5 8 0 7 8 10 0 8 7 5 3 5 0 0 0 4 4 6 0 5 6 8 0 7 5 6 7 8 0 8 0', b: '1 1 4 4 5 5 1 1 4 4 6 6 5 5 1 1' }, // Titelbild
  ];
  const TITLE_MUSIC = 5;
  // Zeit als m:ss,z (z. B. 0:42,3)
  const tfmt = (x) => { const v = Math.max(0, Number(x) || 0), m = Math.floor(v / 60), r = v - m * 60; return `${m}:${String(Math.floor(r)).padStart(2, '0')},${Math.round((r % 1) * 10) % 10}`; };

  // ---------- Level-Bausteine (Raster: 12 Zeilen, Boden oben bei Zeile 10) ----------
  // Zeichen: # Boden/Block · - Plattform (von unten durchspringbar) · o Stern-Münze · f Futter · e Gegner · S Feder · ^ Stacheln
  //          B 🎁 Bonus-Kiste (von unten anstoßen: +3 ⭐) · U leere Kiste
  //          F Fähnchen · G Ziel · M bewegte Plattform (Startpunkt)
  function build(spec) {
    const g = Array.from({ length: ROWS }, () => []);
    let x = 0;
    const put = (c, y, ch) => { while (g[y].length <= c) g[y].push(' '); g[y][c] = ch; };
    const ground = (n, h = 0) => { for (let i = 0; i < n; i++) { for (let y = 10 - h; y < ROWS; y++) put(x + i, y, '#'); } };
    const B = {
      f: (n, o = {}) => { ground(n); if (o.c) for (let i = 1; i < n - 1; i += 1) if (i % 2) put(x + i, 8, 'o'); if (o.e) put(x + Math.floor(n / 2), 9, 'e'); if (o.food) put(x + n - 2, 7, 'f'); x += n; },
      g: (n) => { for (let i = 0; i < n; i++) put(x + i, ROWS - 1, ' '); x += n; },
      u: (h, n, o = {}) => { ground(n, h); if (o.c) for (let i = 0; i < n; i++) put(x + i, 9 - h - 1, 'o'); if (o.e) put(x + 1, 9 - h, 'e'); x += n; },
      st: (h) => { for (let i = 1; i <= h; i++) { ground(1, i); x += 1; } },
      sd: (h) => { for (let i = h; i >= 1; i--) { ground(1, i); x += 1; } },
      p: (n, y = 8, o = {}) => { for (let i = 0; i < n; i++) { put(x + i, y, '-'); if (o.c) put(x + i, y - 1, 'o'); } if (o.under) ground(n); x += n; },
      gp: (n, y = 8) => { const s = x; for (let i = 1; i < n - 1; i++) { put(s + i, y, '-'); put(s + i, y - 1, 'o'); } x += n; },
      sp: (n) => { ground(n); for (let i = 1; i < n - 1; i++) put(x + i, 9, '^'); x += n; },
      S: (o = {}) => { ground(2); put(x, 9, 'S'); x += 2; if (o.hi) { const s = x; ground(1); for (let i = 0; i < 4; i++) { put(s + i, 5, '-'); put(s + i, 4, 'o'); } x += 1; } },
      // bewegte Plattform über eine Lücke – direkt davor keine Gegner (sonst wird man beim Warten unfair erwischt)
      M: (n) => { for (let c = Math.max(0, x - 8); c < x; c++) for (let y = 0; y < ROWS; y++) if (g[y][c] === 'e') g[y][c] = ' '; put(x + 1, 8, 'M'); x += n; },
      F: () => { ground(3); put(x + 1, 9, 'F'); x += 3; },
      G: () => { ground(8); put(x + 3, 9, 'G'); x += 8; },
      fd: () => { put(x - 2, 6, 'f'); },
    };
    spec(B);
    // auch direkt hinter einer bewegten Plattform keine Gegner (man muss erst ankommen können)
    (g[8] || []).forEach((ch, c) => { if (ch !== 'M') return; let e = c; while (e < (g[10] || []).length && g[10][e] !== '#') e++; for (let cc = e; cc < e + 6; cc++) for (let y = 0; y < ROWS; y++) if (g[y][cc] === 'e') g[y][cc] = ' '; });
    const w = Math.max(...g.map((r) => r.length));
    return g.map((r) => { while (r.length < w) r.push(' '); return r; });
  }
  // Jedes Level hat zwei Hälften mit Fähnchen dazwischen (ab 2.0.0 doppelt so lang)
  const LEVELS = [
    { w: 0, s: (b) => {
      b.f(10); b.f(8, { c: 1 }); b.st(2); b.f(4, { c: 1 }); b.sd(2); b.f(6, { food: 1 }); b.g(2); b.f(8, { c: 1 }); b.F(); b.f(6, { c: 1 }); b.u(1, 4, { c: 1 }); b.f(4); b.g(2); b.f(6, { c: 1 });
      b.F(); b.f(6, { c: 1 }); b.st(2); b.u(2, 3, { c: 1 }); b.sd(2); b.f(4); b.g(2); b.f(6, { e: 1, c: 1 }); b.F(); b.p(4, 7, { c: 1, under: 1 }); b.f(6, { c: 1 }); b.g(2); b.f(5, { food: 1 }); b.u(1, 4, { c: 1 }); b.f(6, { c: 1 }); b.G();
    } },
    { w: 0, s: (b) => {
      b.f(9); b.f(8, { c: 1, e: 1 }); b.g(3); b.f(6, { c: 1 }); b.st(3); b.f(3); b.g(2); b.f(5, { food: 1 }); b.F(); b.f(8, { e: 1 }); b.p(4, 7, { c: 1, under: 1 }); b.f(4); b.g(3); b.f(6, { c: 1, e: 1 }); b.u(2, 4, { c: 1 }); b.f(3);
      b.F(); b.f(6, { c: 1 }); b.g(2); b.u(1, 4, { c: 1 }); b.g(2); b.f(6, { e: 1 }); b.F(); b.st(2); b.u(2, 3, { c: 1 }); b.sd(2); b.f(6, { c: 1, e: 1 }); b.p(5, 7, { c: 1, under: 1 }); b.f(4, { food: 1 }); b.g(3); b.f(6, { c: 1 }); b.G();
    } },
    { w: 1, s: (b) => {
      b.f(9); b.f(6, { c: 1 }); b.gp(5); b.f(6, { e: 1 }); b.S(); b.f(6, { c: 1 }); b.F(); b.f(4); b.g(2); b.u(1, 3); b.g(2); b.u(2, 4, { c: 1 }); b.f(6, { e: 1, food: 1 }); b.sp(4); b.f(6, { c: 1 });
      b.F(); b.f(6, { c: 1 }); b.sp(4); b.f(5, { e: 1 }); b.gp(5); b.f(5, { c: 1 }); b.F(); b.S(); b.f(6, { c: 1 }); b.u(1, 3); b.g(2); b.u(1, 4, { c: 1, e: 1 }); b.f(5, { food: 1 }); b.sp(4); b.f(6, { c: 1 }); b.G();
    } },
    { w: 1, s: (b) => {
      b.f(8); b.st(2); b.p(5, 6, { c: 1 }); b.f(4); b.gp(6); b.f(6, { e: 1 }); b.F(); b.S({ hi: 1 }); b.f(9, { c: 1 }); b.sp(4); b.f(5, { e: 1 }); b.g(3); b.f(6, { c: 1, food: 1 }); b.u(1, 3); b.u(2, 3); b.u(3, 3, { c: 1 }); b.f(4);
      b.F(); b.f(6, { c: 1, e: 1 }); b.gp(6); b.f(5); b.S({ hi: 1 }); b.f(6, { c: 1 }); b.F(); b.u(1, 3); b.u(2, 3, { c: 1 }); b.f(4); b.sp(4); b.f(5, { e: 1, food: 1 }); b.g(3); b.f(6, { c: 1 }); b.st(3); b.u(3, 3, { c: 1 }); b.sd(3); b.f(6, { c: 1 }); b.G();
    } },
    { w: 2, s: (b) => {
      b.f(8); b.f(6, { c: 1, e: 1 }); b.M(6); b.f(6, { c: 1 }); b.st(3); b.u(3, 2); b.g(2); b.u(3, 3); b.sd(3); b.F(); b.f(6, { e: 1 }); b.gp(6); b.f(5, { food: 1 }); b.sp(4); b.f(6, { c: 1, e: 1 });
      b.F(); b.f(6, { c: 1 }); b.M(6); b.f(6, { e: 1 }); b.st(2); b.u(2, 3, { c: 1 }); b.sd(2); b.F(); b.gp(6); b.f(5, { c: 1, e: 1 }); b.S({ hi: 1 }); b.f(9, { food: 1 }); b.sp(4); b.f(5, { c: 1 }); b.M(7); b.f(6, { c: 1, e: 1 }); b.G();
    } },
    { w: 2, s: (b) => {
      b.f(8); b.S({ hi: 1 }); b.f(6, { e: 1 }); b.M(7); b.f(5, { c: 1 }); b.F(); b.u(1, 2); b.u(2, 2); b.g(2); b.u(2, 3, { c: 1 }); b.g(2); b.u(1, 4, { e: 1 }); b.f(5, { food: 1 }); b.sp(4); b.f(5, { c: 1 }); b.M(7); b.f(4);
      b.F(); b.f(6, { c: 1 }); b.u(1, 3); b.g(2); b.u(2, 3, { c: 1 }); b.g(2); b.u(1, 3, { e: 1 }); b.f(5); b.F(); b.M(7); b.f(6, { c: 1, e: 1 }); b.sp(4); b.f(5, { food: 1 }); b.S({ hi: 1 }); b.f(8, { e: 1 }); b.gp(6); b.f(6, { c: 1 }); b.G();
    } },
    { w: 3, s: (b) => {
      b.f(8); b.f(6, { c: 1, e: 1 }); b.gp(7); b.f(6, { e: 1 }); b.F(); b.M(8); b.f(5, { food: 1 }); b.st(3); b.u(3, 2); b.g(2); b.u(3, 3, { c: 1 }); b.g(2); b.u(2, 3); b.sd(2); b.f(6, { e: 1, c: 1 });
      b.F(); b.f(6, { c: 1 }); b.sp(4); b.f(5, { e: 1 }); b.M(8); b.f(5, { c: 1 }); b.F(); b.st(2); b.u(2, 2); b.g(2); b.u(2, 3, { c: 1 }); b.sd(2); b.f(5, { e: 1, food: 1 }); b.gp(7); b.f(6, { c: 1 }); b.S({ hi: 1 }); b.f(8, { e: 1 }); b.G();
    } },
    { w: 3, s: (b) => {
      b.f(8); b.sp(4); b.f(4, { e: 1 }); b.S({ hi: 1 }); b.f(8); b.gp(7); b.F(); b.f(6, { c: 1, e: 1 }); b.M(8); b.f(4); b.sp(4); b.f(5, { food: 1 }); b.u(1, 2); b.u(2, 2); b.u(3, 3); b.g(2); b.u(2, 4, { c: 1 }); b.f(4);
      b.F(); b.f(6, { c: 1, e: 1 }); b.M(8); b.f(5); b.sp(4); b.f(4, { e: 1 }); b.F(); b.u(1, 2); b.u(2, 2); b.u(3, 2, { c: 1 }); b.g(2); b.u(2, 3); b.sd(2); b.f(5, { food: 1 }); b.gp(7); b.f(5, { c: 1, e: 1 }); b.S({ hi: 1 }); b.f(8, { c: 1 }); b.G();
    } },
    { w: 4, s: (b) => {
      b.f(8); b.f(6, { c: 1, e: 1 }); b.M(8); b.f(5, { e: 1 }); b.gp(6); b.F(); b.S({ hi: 1 }); b.f(9, { c: 1 }); b.sp(4); b.f(6, { e: 1, food: 1 }); b.g(2); b.u(1, 2); b.g(2); b.u(2, 3, { c: 1 }); b.g(2); b.u(1, 3); b.M(8); b.f(5, { c: 1, e: 1 });
      b.F(); b.f(6, { c: 1 }); b.sp(4); b.f(5, { e: 1 }); b.M(8); b.f(4, { c: 1 }); b.F(); b.gp(6); b.f(5, { e: 1 }); b.u(1, 2); b.g(2); b.u(2, 3, { c: 1 }); b.g(2); b.u(1, 3, { e: 1 }); b.f(5, { food: 1 }); b.sp(4); b.f(6, { c: 1, e: 1 }); b.M(8); b.f(6, { c: 1 }); b.G();
    } },
    { w: 4, s: (b) => {
      b.f(8); b.st(2); b.sd(2); b.f(2); b.sp(4); b.f(5, { e: 1 }); b.M(8); b.f(4); b.gp(7); b.F(); b.f(6, { c: 1, e: 1 }); b.S({ hi: 1 }); b.f(11); b.sp(4); b.f(7, { food: 1 }); b.M(9); b.f(3); b.u(1, 2); b.u(2, 2); b.u(3, 2); b.u(4, 3, { c: 1 }); b.g(2); b.u(2, 4, { e: 1 }); b.f(6, { c: 1 });
      b.F(); b.f(6, { c: 1, e: 1 }); b.sp(4); b.f(4); b.M(9); b.f(5, { e: 1 }); b.F(); b.st(2); b.u(2, 2); b.sd(2); b.f(2); b.sp(4); b.f(5, { c: 1, e: 1 }); b.gp(7); b.f(5, { food: 1 }); b.S({ hi: 1 }); b.f(8, { e: 1 }); b.u(1, 2); b.u(2, 2); b.u(3, 3, { c: 1 }); b.g(2); b.u(2, 4); b.f(6, { c: 1, e: 1 }); b.G();
    } },
  ];
  // 📏 Jedes Level bekommt vor dem Ziel noch einen Abschnitt passend zur Welt (mit Fähnchen davor)
  const EXTRA = [
    (b) => { b.f(6, { c: 1 }); b.u(1, 4, { c: 1 }); b.g(2); b.f(6, { e: 1, c: 1 }); b.st(2); b.p(4, 6, { c: 1 }); b.sd(2); b.f(6, { food: 1 }); b.g(3); b.f(8, { c: 1, e: 1 }); b.u(1, 3); b.f(6, { c: 1 }); },
    (b) => { b.f(6, { c: 1 }); b.S(); b.f(6, { e: 1 }); b.gp(5); b.f(5, { c: 1 }); b.sp(4); b.f(6, { c: 1, e: 1 }); b.u(1, 3); b.g(2); b.u(2, 3, { c: 1 }); b.f(8, { food: 1 }); },
    (b) => { b.f(6, { c: 1, e: 1 }); b.M(7); b.f(6, { c: 1 }); b.S({ hi: 1 }); b.f(8); b.u(1, 2); b.g(2); b.u(2, 3, { c: 1 }); b.sd(2); b.f(8, { e: 1, food: 1 }); },
    (b) => { b.f(6, { c: 1 }); b.gp(7); b.f(6, { e: 1 }); b.M(8); b.f(5, { c: 1 }); b.sp(4); b.f(6, { e: 1 }); b.st(3); b.u(3, 3, { c: 1 }); b.sd(3); b.f(8, { food: 1, c: 1 }); },
    (b) => { b.f(6, { c: 1, e: 1 }); b.M(8); b.f(5); b.gp(7); b.f(6, { c: 1, e: 1 }); b.S({ hi: 1 }); b.f(8, { c: 1 }); b.sp(4); b.f(6, { e: 1 }); b.u(1, 2); b.g(2); b.u(2, 3, { c: 1 }); b.f(8, { c: 1 }); },
  ];
  // 🎁 Bonus-Kisten: über freien, flachen Bodenstücken (3 Felder über dem Boden, mit dem Kopf erreichbar)
  const boxes = (g, n) => {
    const w = g[0].length, emp = (c, y) => g[y][c] === ' ' || g[y][c] === 'o';
    // flacher Boden (nicht erhöht), darüber frei; Sterne in Zeile 8 dürfen bleiben
    const free = (c) => g[10][c] === '#' && g[9][c] !== '#' && g[9][c] !== '^' && g[9][c] !== 'S' && [4, 5, 6, 7].every((y) => emp(c, y)) && emp(c, 8);
    let last = 8;
    for (let c = 12; c < w - 12; c++) {
      if (c - last < 16 + (n % 3) * 2) continue;
      if ([-2, -1, 0, 1, 2].every((d) => free(c + d)) && g[9][c - 3] !== '#' && g[9][c + 3] !== '#') { g[7][c] = 'B'; last = c; }
    }
    return g;
  };
  LEVELS.forEach((L, i) => { const s0 = L.s; L.s = (b) => { const G = b.G; b.G = () => { b.F(); EXTRA[L.w](b); G(); }; s0(b); }; L.n = i + 1; L.map = boxes(build(L.s), i); });

  // ---------- Klang (WebAudio): Musik im 16-Bit-Stil + Effekte ----------
  const SCALE = [0, 0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19];
  function audio(on) {
    let ac = null, timer = null, master = null;
    const ctx = () => { if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.16; master.connect(ac.destination); } if (ac.state === 'suspended') ac.resume(); return ac; };
    const tone = (f, t, d, type, vol) => {
      const a = ctx(), o = a.createOscillator(), v = a.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      v.gain.setValueAtTime(0, t); v.gain.linearRampToValueAtTime(vol, t + 0.01); v.gain.exponentialRampToValueAtTime(0.0008, t + d);
      o.connect(v); v.connect(master); o.start(t); o.stop(t + d + 0.02);
      return o;
    };
    const hz = (deg, base) => base * Math.pow(2, SCALE[deg] / 12);
    const S = {
      on,
      music(w) {
        S.stop(); if (!S.on) return;
        try { ctx(); } catch (e) { return; }
        const M = MUSIC[w % MUSIC.length], mel = M.m.split(' ').map(Number), bas = M.b.split(' ').map(Number), st = 60 / M.bpm / 2;
        let i = 0, next = ac.currentTime + 0.05;
        const sched = () => {
          while (next < ac.currentTime + 0.3) {
            const n = mel[i % mel.length]; if (n) tone(hz(n, 523.25), next, st * 0.9, 'square', 0.22);
            if (i % 2 === 0) { const b = bas[(i / 2) % bas.length]; tone(hz(b, 130.81), next, st * 1.8, 'triangle', 0.5); }
            if (i % 4 === 2) tone(90, next, 0.05, 'square', 0.08);
            next += st; i++;
          }
          timer = setTimeout(sched, 60);
        };
        sched();
      },
      stop() { clearTimeout(timer); timer = null; },
      fx(k) {
        if (!S.on) return;
        try {
          const a = ctx(), t = a.currentTime;
          if (k === 'jump') { const o = tone(330, t, 0.18, 'square', 0.25); o.frequency.exponentialRampToValueAtTime(880, t + 0.15); }
          if (k === 'coin') { tone(988, t, 0.08, 'square', 0.22); tone(1319, t + 0.07, 0.2, 'square', 0.22); }
          if (k === 'food') { [523, 659, 784].forEach((f, j) => tone(f, t + j * 0.06, 0.12, 'triangle', 0.4)); }
          if (k === 'stomp') { const o = tone(220, t, 0.15, 'square', 0.3); o.frequency.exponentialRampToValueAtTime(80, t + 0.14); }
          if (k === 'spring') { const o = tone(200, t, 0.35, 'triangle', 0.5); o.frequency.exponentialRampToValueAtTime(1200, t + 0.3); }
          if (k === 'hurt') { const o = tone(440, t, 0.4, 'sawtooth', 0.18); o.frequency.exponentialRampToValueAtTime(110, t + 0.38); }
          if (k === 'flag') { [659, 784, 1047].forEach((f, j) => tone(f, t + j * 0.09, 0.15, 'square', 0.2)); }
          if (k === 'win') { [523, 659, 784, 1047, 784, 1047].forEach((f, j) => tone(f, t + j * 0.13, 0.22, 'square', 0.22)); }
        } catch (e) { /* kein Ton möglich */ }
      },
      close() { S.stop(); try { if (ac) ac.close(); } catch (e) { /* egal */ } ac = null; },
    };
    return S;
  }

  // Name im Titel: „Flockes Abenteuer“ (Deutsch mit Genitiv-s), sonst laut Übersetzung
  const title = (name) => {
    const de = ['de', 'gsw'].includes(Y.LANG);
    const nm = de ? (/[sßxzSXZ]$/.test(name) ? `${name}’` : `${name}s`) : name;
    return T('{name} Abenteuer', { name: nm });
  };

  const CSS = `<style>
.jrmap{display:grid;gap:10px;align-content:start;overflow:auto;padding:4px}
.jrws{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.jrw{display:grid;gap:6px;padding:8px;border-radius:18px;background:rgba(255,255,255,.55)}
.jrlv{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.jrlv button{position:relative;aspect-ratio:1;min-width:0;contain:size;overflow:hidden;border:0;border-radius:18px;font:inherit;font-weight:900;font-size:20px;color:#1f2433;cursor:pointer;display:grid;place-items:center;align-content:center;gap:0;line-height:1.1;padding:2px;box-shadow:0 3px 0 rgba(0,0,0,.15)}
.jrlv button small{font-size:11px;letter-spacing:-1px;min-height:13px}.jrlv button em{font-style:normal;font-size:11px;line-height:1.1;white-space:nowrap;font-weight:800;opacity:.8}.jrlv button i{font-style:normal;font-size:18px}
.jrlv button:disabled{opacity:.45;cursor:default}
.jrwl{font-weight:800;font-size:15px}
.jrbar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.jrbar button{min-height:44px;padding:0 14px;border:0;border-radius:14px;font:inherit;font-weight:800;background:rgba(255,255,255,.85);color:#1f2433;cursor:pointer}.jrbar button.on{background:#5b61ff;color:#fff}
.jrwrap{position:relative;display:flex;flex-direction:column;justify-content:center;gap:12px;min-height:0;margin:10px 0}
.jrwrap .gmar.jrst{margin:0;flex:0 0 auto;width:100%;background:none}
.jrcv{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.jrhud{position:absolute;left:10px;top:8px;right:10px;display:flex;gap:10px;font-weight:900;font-size:18px;color:#fff;text-shadow:0 2px 3px rgba(0,0,0,.45);pointer-events:none}
.jrhud span:last-child{margin-left:auto}
.jrpad{display:flex;gap:14px;align-items:center;justify-content:space-between;padding:0 6px}.jrpl{display:flex;gap:14px}
.jrpad button{width:78px;height:78px;border-radius:50%;border:0;background:#fff;box-shadow:0 4px 0 rgba(0,0,0,.14);font-size:32px;font-weight:900;color:#1f2433;touch-action:none;user-select:none;-webkit-user-select:none;cursor:pointer}
.jrpad button.on{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.14)}
.jrpad button.jmp{width:92px;height:92px;background:#5b61ff;color:#fff}
.jrwrap.land{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:end;gap:12px}
.jrwrap.land .jrpad{display:contents}.jrwrap.land .jrpl{grid-column:1;grid-row:1;padding-bottom:6px}.jrwrap.land .jrst{grid-column:2;grid-row:1}.jrwrap.land .jrpr{grid-column:3;grid-row:1;padding-bottom:6px}
.jrwrap.land .jrpad button{width:68px;height:68px;font-size:28px}.jrwrap.land .jrpad button.jmp{width:80px;height:80px}
.jrtap{position:absolute;left:0;right:0;bottom:10px;text-align:center;font-weight:800;color:#fff;text-shadow:0 2px 3px rgba(0,0,0,.5);pointer-events:none}
.jrhp{letter-spacing:-2px}.jrhp i{font-style:normal;opacity:.35;filter:grayscale(1)}
.jrcov{position:relative;overflow:hidden;border-radius:22px;margin:10px 0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:clamp(4px,1.4vh,10px);padding:clamp(10px,3vh,22px) 14px;min-height:0}
.jrcov>svg.bg{position:absolute;inset:0;width:100%;height:100%}
.jrcov>*:not(.bg):not(.jrdeco){position:relative}
.jrlogo{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-weight:900;font-size:clamp(22px,min(8.5vw,6.5vh),56px);line-height:1.02;flex:0 0 auto;text-align:center;text-transform:uppercase;letter-spacing:1px;color:#ffd43b;transform:rotate(-3deg);
  text-shadow:3px 0 #7a2e00,-3px 0 #7a2e00,0 3px #7a2e00,0 -3px #7a2e00,3px 3px #7a2e00,-3px -3px #7a2e00,3px -3px #7a2e00,-3px 3px #7a2e00,0 8px 0 #3b1500,6px 8px 0 #3b1500,-4px 8px 0 #3b1500;animation:jrfl 3s ease-in-out infinite}
.jrlogo small{display:block;font-size:.42em;color:#fff;letter-spacing:3px;margin-top:6px}
/* Haustier nimmt den übrigen Platz – auf kleinen Bildschirmen wird es kleiner, damit ▶ Start immer sichtbar bleibt */
.jrhero{position:relative;flex:1 1 0;min-height:60px;width:100%;display:flex;align-items:center;justify-content:center}
.jrhero>div{height:100%;max-height:min(70vw,280px);aspect-ratio:1;max-width:100%;animation:jrhop 1.1s ease-in-out infinite}.jrhero svg{width:100%;height:100%;display:block}
.jrhero:after{content:'';position:absolute;bottom:4%;left:calc(50% - min(17vw,14vh,70px));right:calc(50% - min(17vw,14vh,70px));height:9%;border-radius:50%;background:rgba(0,0,0,.18);animation:jrsh 1.1s ease-in-out infinite;z-index:-1}
.jrstart{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif !important;flex:0 0 auto;min-height:clamp(48px,7vh,64px);padding:0 38px;border-radius:999px;border:4px solid #7a2e00;background:linear-gradient(#ffe066,#fab005);color:#4a1d00;font:inherit;font-weight:900;font-size:26px;letter-spacing:1px;box-shadow:0 6px 0 #7a2e00;cursor:pointer;animation:jrpu 1.4s ease-in-out infinite}
.jrstart:active{transform:translateY(4px);box-shadow:0 2px 0 #7a2e00}
.jrcst{flex:0 0 auto;font-weight:900;font-size:16px;color:#fff;text-shadow:0 2px 3px rgba(0,0,0,.45)}
.jrdeco{position:absolute;font-size:clamp(20px,6vw,34px);animation:jrfl 2.6s ease-in-out infinite}
@keyframes jrhop{0%,100%{transform:translateY(0)}45%{transform:translateY(-12%)}55%{transform:translateY(-12%)}}
@keyframes jrsh{0%,100%{transform:scaleX(1);opacity:1}50%{transform:scaleX(.7);opacity:.6}}
@keyframes jrfl{0%,100%{translate:0 0}50%{translate:0 -6px}}
@keyframes jrpu{0%,100%{scale:1}50%{scale:1.05}}
@media (prefers-reduced-motion:reduce){.jrlogo,.jrhero>div,.jrhero:after,.jrstart,.jrdeco{animation:none}}
.jrmsg{position:absolute;inset:0;display:grid;place-items:center;align-content:center;gap:10px;text-align:center;background:rgba(20,22,45,.45);color:#fff;font-weight:900;font-size:26px}
.jrmsg .cr{font-size:44px;letter-spacing:4px}
</style>`;

  class A {
    // Fortschritt je Kind; legen die Eltern die Stufe fest (⚙️ → Abenteuer), gilt diese statt der Wahl des Kindes
    _jrP(kid) { const p = this._peP(kid), J = { u: 1, c: {}, ctl: 'e', ...(p.jr || {}) }, fx = this._gmSet ? this._gmSet('jr').ctl : ''; if (fx === 'e' || fx === 'n' || fx === 'h') J.ctl = fx; return J; }
    _jrLeft(kid) {
      const p = this._peP(kid), lim = p.jl != null ? Number(p.jl) : this._cfg.peJrLim == null ? 3 : Number(this._cfg.peJrLim);
      const d = p.d && p.d.d === dk(new Date()) ? p.d : {};
      return lim <= 0 ? 99 : Math.max(0, lim - (Number(d.a) || 0));
    }
    _jrSnd() { try { return localStorage.getItem('yippee_jr_snd') !== '0'; } catch (e) { return true; } }
    // 🎬 Titelbild: Haustier groß, Schriftzug im 16-Bit-Stil, Titelmusik, ▶ Start → Karte
    _jrCover(kid) {
      this._jrStop();
      const p = this._peP(kid), J = this._jrP(kid), name = this._peName(p), kind = this._peKindOf(p) || 'dog', st = this._peStage(this._db.kid[kid], p);
      const pet = petDraw(kind, { w: 250, g: st.st ? Math.max(0.6, st.g) : 0.6, crown: st.st === 3, acc: p.acc || {}, ...this._peLook(p), eyes: 'happy', mouth: 'open', open: 0.6, collar: true });
      const crowns = Object.values(J.c || {}).reduce((a, b) => a + (Number(b) || 0), 0), done = Object.keys(J.c || {}).length;
      const de = ['de', 'gsw'].includes(Y.LANG), tt = title(name), nm = de ? (/[sßxzSXZ]$/.test(name) ? `${name}’` : `${name}s`) : '';
      // Schriftzug zweizeilig: „Flockes“ / „Abenteuer“ (andere Sprachen: ganzer Titel)
      const logo = de && tt.startsWith(nm) ? `${esc(nm)}<br>${esc(tt.slice(nm.length).trim())}` : esc(tt);
      const W = WORLDS, hill = (c, y, a, f, o) => { let d = `M0 300 L0 ${y}`; for (let x = 0; x <= 400; x += 10) d += ` L${x} ${(y - Math.sin(x / f + o) * a - Math.sin(x / (f * 2.7) + o) * a * 0.6).toFixed(1)}`; return `<path d="${d} L400 300 Z" fill="${c}"/>`; };
      let ground = ''; for (let x = 0; x < 400; x += 20) ground += `<rect x="${x}" y="268" width="20" height="32" fill="${(x / 20) % 2 ? W[0].dirt : W[0].dirt2}"/>`;
      const bg = `<svg class="bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="jrcsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb8ff"/><stop offset=".7" stop-color="#bfe8ff"/><stop offset="1" stop-color="#fff3c4"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#jrcsky)"/><circle cx="335" cy="52" r="26" fill="#ffe066"/><circle cx="335" cy="52" r="36" fill="#ffe066" opacity=".25"/>
        ${[[60, 46, 1], [170, 30, 0.8], [280, 70, 0.7]].map(([x, y, k]) => `<g fill="#fff" opacity=".9"><ellipse cx="${x}" cy="${y}" rx="${34 * k}" ry="${12 * k}"/><ellipse cx="${x + 20 * k}" cy="${y - 8 * k}" rx="${22 * k}" ry="${12 * k}"/></g>`).join('')}
        ${hill('#9fc9f0', 200, 22, 30, 1)}${hill('#c3ecb2', 222, 14, 26, 3)}${hill(W[0].hill2, 240, 12, 30, 0.5)}${hill(W[0].hill, 256, 9, 22, 2)}
        <rect x="0" y="262" width="400" height="8" fill="${W[0].top}"/>${ground}</svg>`;
      const deco = [['🌳', '6%', '62%', 0], ['🏖️', '84%', '58%', 0.4], ['🍭', '12%', '30%', 0.8], ['❄️', '86%', '28%', 1.2], ['🌙', '78%', '8%', 1.6], ['⭐', '10%', '10%', 2]]
        .map(([e, x, y, d]) => `<span class="jrdeco" style="left:${x};top:${y};animation-delay:-${d}s">${e}</span>`).join('');
      const el = this._gmShow(kid, `${CSS}<div class="gmhd"><b></b><button data-g="jrcsnd" aria-label="${esc(T('Musik'))}">${this._jrSnd() ? '🔊' : '🔇'}</button><button data-g="menu" aria-label="${esc(T('Zurück'))}">✕</button></div>
        <div class="jrcov">${bg}${deco}<div class="jrlogo">${logo}</div><div class="jrhero"><div>${pet}</div></div>
          <div class="jrcst">👑 ${crowns}/30 · ${T('{n} von 10 Leveln geschafft', { n: done })}</div>
          <button class="jrstart" data-g="jrstart">▶ ${T('Start')}</button></div>`);
      this._gm = { game: 'jr', kid, tm: [], el, on: (b) => this._jrBtn(kid, b) };
      this._jrCs = audio(this._jrSnd()); this._jrCs.music(TITLE_MUSIC);
    }
    // Karte mit den 10 Leveln
    _jrMap(kid) {
      this._jrStop();
      const p = this._peP(kid), J = this._jrP(kid), left = this._jrLeft(kid), name = this._peName(p), fs = this._gmFs ? this._gmFs(kid) : 0;
      const lv = (L) => {
        const cr = J.c[L.n] || 0, open = L.n <= J.u, W = WORLDS[L.w], bt = (J.t || {})[L.n];
        return `<button data-g="jrgo" data-v="${L.n}" ${open && (left || fs) ? '' : 'disabled'} style="background:linear-gradient(160deg,${W.sky[1]},${W.hill})"><i>${open ? W.e : '🔒'}</i>${L.n}<small>${cr ? '👑'.repeat(cr) : ''}</small>${bt ? `<em>⏱️ ${tfmt(bt)}</em>` : ''}</button>`;
      };
      const rows = WORLDS.map((W, i) => `<div class="jrw"><div class="jrwl">${W.e} ${T(W.n)}</div><div class="jrlv">${LEVELS.filter((L) => L.w === i).map(lv).join('')}</div></div>`).join('');
      const el = this._gmShow(kid, `${CSS}<div class="gmhd"><b>🗺️ ${esc(title(name))}</b><button data-g="menu" aria-label="${esc(T('Zurück'))}">✕</button></div>
        <div class="jrmap"><div class="jrbar">${['e', 'n', 'h'].includes(this._gmSet('jr').ctl) ? '' : `<button data-g="jrctl" data-v="e" class="${J.ctl === 'e' ? 'on' : ''}">🏃 ${T('Einfach')}</button><button data-g="jrctl" data-v="n" class="${J.ctl === 'n' ? 'on' : ''}">🎮 ${T('Normal')}</button><button data-g="jrctl" data-v="h" class="${J.ctl === 'h' ? 'on' : ''}">🔥 ${T('Schwer')}</button>`}<button data-g="jrsnd">${this._jrSnd() ? '🔊' : '🔇'} ${T('Musik')}</button></div>
        <div class="hint" style="text-align:center">${J.ctl === 'e' ? T('Einfach: langsamer, feste Brücken, 5 Herzen.') : J.ctl === 'h' ? T('Schwer: noch schneller, kleine fahrende Plattformen, Spezial-Gegner, 2 Herzen – ⤒ zweimal tippen = Doppelsprung.') : T('Normal: schneller, fahrende Plattformen, 3 Herzen.')}<br>${J.a ? T('{name} läuft von allein – tippen zum Springen.', { name: esc(name) }) : T('Mit ◀ ▶ laufen, mit ⤒ springen.')}</div>
        <div class="jrws">${rows}</div></div>
        <div class="gmft"><div class="hint">${left >= 99 ? '' : left ? T('Heute noch {n} Level', { n: left }) : fs ? T('Tageslimit erreicht – jetzt zählen die Freispiele.') : T('{name} ist müde 😴 – morgen wieder!', { name: esc(name) })}${left < 99 && fs ? ` <b class="gmfs">🎟️ ${T('{n} Freispiele', { n: fs })}</b>` : ''}</div></div>`);
      this._gm = { game: 'jr', kid, tm: [], el, on: (b) => this._jrBtn(kid, b) };
      el.querySelectorAll('.gmhd b').forEach(() => {});
    }
    _jrBtn(kid, b) {
      const g = b.dataset.g;
      if (g === 'jrctl') { if (['e', 'n', 'h'].includes(this._gmSet('jr').ctl)) return; this._peSet(kid, { jr: { ...this._jrP(kid), ctl: ['n', 'h'].includes(b.dataset.v) ? b.dataset.v : 'e' } }); setTimeout(() => this._jrMap(kid), 0); return; }
      if (g === 'jrstart') { this._jrMap(kid); return; }
      if (g === 'jrcsnd') { const on = !this._jrSnd(); try { localStorage.setItem('yippee_jr_snd', on ? '1' : '0'); } catch (e) { /* egal */ } b.textContent = on ? '🔊' : '🔇'; if (this._jrCs) { this._jrCs.on = on; if (on) this._jrCs.music(TITLE_MUSIC); else this._jrCs.stop(); } return; }
      if (g === 'jrsnd') { try { localStorage.setItem('yippee_jr_snd', this._jrSnd() ? '0' : '1'); } catch (e) { /* egal */ } this._jrMap(kid); return; }
      if (g === 'jrgo') { this._jrPlay(kid, Number(b.dataset.v)); return; }
      if (g === 'jrmap') { this._jrMap(kid); return; }
      if (g === 'jrnext') { this._jrPlay(kid, Number(b.dataset.v)); }
    }
    _jrStop() {
      if (this._jrCs) { this._jrCs.close(); this._jrCs = null; }
      const s = this._jr; if (!s) return;
      s.dead = true; cancelAnimationFrame(s.raf); clearTimeout(s.tm); if (s.off) s.off(); if (s.snd) s.snd.close(); this._jr = null;
    }
    // Sprites aus der Haustier-Zeichnung (normal, Sprung, aua)
    _jrSprites(kid) {
      const p = this._peP(kid), kind = this._peKindOf(p) || 'dog', st = this._peStage(this._db.kid[kid], p);
      const base = { g: st.st ? Math.max(0.5, st.g) : 0.5, crown: st.st === 3, acc: p.acc || {}, ...this._peLook(p), collar: true };
      const mk = (o) => { const img = new Image(); const svg = petDraw(kind, { w: 128, ...base, ...o }).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '); img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; return img; };
      return { run: mk({ eyes: 'open', mouth: 'smile' }), jump: mk({ eyes: 'happy', mouth: 'open', open: 0.7 }), hurt: mk({ eyes: 'sad', mouth: 'sad' }), food: (KIND[kind] || {}).food || '🍎' };
    }
    // again = nach „alle Herzen weg“ neu starten – zählt nur bei Kindern, die die Eltern dafür angehakt haben (🐾 → Abenteuer)
    _jrPlay(kid, n, again) {
      const L = LEVELS[n - 1]; if (!L) return;
      const cnt = !again || !!this._peP(kid).jrc;
      if (cnt && !this._jrLeft(kid) && !(this._gmFs && this._gmFs(kid))) { if (again) this._toast(T('{name} ist müde 😴 – morgen wieder!', { name: this._peName(this._peP(kid)) })); this._jrMap(kid); return; }
      this._jrStop();
      if (cnt) {
        if (this._jrLeft(kid)) {
          const p = this._peP(kid), today = dk(new Date()), d0 = p.d && p.d.d === today ? p.d : { d: today, f: 0, b: 0, g: 0, gs: 0 };
          this._peSet(kid, { d: { ...d0, a: (d0.a || 0) + 1 } });
        } else this._gmFsUse(kid); // 🎟️ ein Level = ein Freispiel
      }
      const J = this._jrP(kid), W = WORLDS[L.w], auto = !!J.a, hp = J.ctl === 'h' ? 2 : J.ctl === 'n' ? 3 : 5;
      // Knöpfe: links ◀ ▶, rechts ⤒ – im Hochformat unter dem Spielfeld, im Querformat links und rechts daneben (nie über dem Spiel)
      const pad = `<div class="jrpad"><div class="jrpl">${auto ? '' : '<button data-k="l" aria-label="◀">◀</button><button data-k="r" aria-label="▶">▶</button>'}</div><div class="jrpr"><button class="jmp" data-k="j" aria-label="⤒">⤒</button></div></div>`;
      const el = this._gmShow(kid, `${CSS}<div class="gmhd"><b>${W.e} ${T('Level {n}', { n })} · ${T(W.n)}</b><button data-g="jrsnd2" aria-label="${esc(T('Musik'))}">${this._jrSnd() ? '🔊' : '🔇'}</button><button data-g="jrmap" aria-label="${esc(T('Zurück'))}">✕</button></div>
        <div class="jrwrap"><div class="gmar jrst"><canvas class="jrcv"></canvas><div class="jrhud"><span>⭐ <b class="jrco">0</b></span><span class="jrhp"></span><span class="jrfo"></span><span>${W.e} ${n}/10</span></div>
        ${auto ? `<div class="jrtap">${T('Tippen = springen')}</div>` : ''}</div>${pad}</div>`);
      const wrap = el.querySelector('.jrwrap'), area = el.querySelector('.jrst'), cv = el.querySelector('.jrcv');
      const S = this._jr = { kid, n, L, W, ctl: J.ctl, auto, hp, hp0: hp, snd: audio(this._jrSnd()), sp: this._jrSprites(kid), dead: false, t0: performance.now() };
      this._gm = { game: 'jr', kid, tm: [], el, on: (b) => { if (b.dataset.g === 'qa' && this._gm && this._gm.qa) { this._gm.qa(b); return; } if (b.dataset.g === 'jrsnd2') { const on = !this._jrSnd(); try { localStorage.setItem('yippee_jr_snd', on ? '1' : '0'); } catch (e) { /* egal */ } S.snd.on = on; b.textContent = on ? '🔊' : '🔇'; if (on) S.snd.music(L.w); else S.snd.stop(); return; } this._jrBtn(kid, b); } };
      S.snd.music(L.w);
      this._jrRun(S, area, cv, wrap);
    }

    // ---------- Spiel ----------
    _jrRun(S, area, cv, wrap) {
      const map = S.L.map.map((r) => [...r]), cols = map[0].length;
      const coins = [], foods = [], foes = [], movers = [], flags = [], pops = [];
      let nBox = 0;
      let goal = cols - 5, start = { x: 2, y: 9 };
      // 🚪 Fragetore (Tab 🐾 → Abenteuer): vor bis zu 3 Fähnchen ein hohes Tor – auf geht es mit einer Frage aus den Lernspielen
      const gates = [];
      if (this._gmSet && this._gmSet('jr').gate && this._gmQ) {
        const fl = []; map[9].forEach((c, x) => { if (c === 'F') fl.push(x); });
        const pickF = fl.length <= 3 ? fl : [fl[0], fl[Math.floor(fl.length / 2)], fl[fl.length - 1]];
        pickF.forEach((fx) => { for (let c = fx - 2; c > fx - 8; c--) { if (map[10][c] === '#' && [3, 4, 5, 6, 7, 8, 9].every((y) => map[y][c] === ' ' || map[y][c] === 'o')) { for (let y = 3; y <= 9; y++) map[y][c] = 'T'; gates.push({ x: c, open: false }); break; } } });
      }
      // 🔥 Schwer: hohe Ebenen – ein Brett in Zeile 6 (nur mit ⤒⤒ Doppelsprung erreichbar), darauf Sterne und oben eine 🎁 Kiste
      if (S.ctl === 'h') {
        const clear = (c) => map[10][c] === '#' && map[9][c] !== '#' && [1, 2, 3, 4, 5, 6, 7, 8].every((y) => map[y][c] === ' ' || map[y][c] === 'o') && ![9, 10].some((y) => ['F', 'G', 'M', 'S', '^'].includes(map[y][c]));
        let last = 10;
        for (let c = 18; c < cols - 16; c++) {
          if (c - last < 26) continue;
          if ([-1, 0, 1, 2, 3, 4].every((d) => clear(c + d))) {
            for (let d = 0; d < 4; d++) { map[6][c + d] = '-'; map[5][c + d] = 'o'; for (let y = 7; y <= 8; y++) if (map[y][c + d] === 'o') map[y][c + d] = ' '; }
            map[2][c + 1] = 'B'; last = c;
          }
        }
      }
      map.forEach((r, y) => r.forEach((c, x) => {
        if (c === 'o') { coins.push({ x: x + 0.5, y: y + 0.5, got: false }); r[x] = ' '; }
        if (c === 'f') { foods.push({ x: x + 0.5, y: y + 0.5, got: false }); r[x] = ' '; }
        if (c === 'e') { foes.push({ x: x + 0.1, y: y + 0.15, w: 0.8, h: 0.85, vx: -1.6, alive: true, sq: 0, k: 'w' }); r[x] = ' '; }
        if (c === 'B') nBox++;
        if (c === 'M') { r[x] = ' '; movers.push({ at: x }); }
        if (c === 'F') { flags.push({ x, y, on: false }); r[x] = ' '; }
        if (c === 'G') { goal = x; r[x] = ' '; }
      }));
      // bewegte Plattformen: Lücke ausmessen. „Einfach“ = feste Brücke über die Lücke, „Normal“ = fährt hin und her
      movers.forEach((m) => {
        let a = m.at; while (a > 0 && map[10][a - 1] !== '#') a--;
        let e = m.at; while (e < cols && map[10][e] !== '#') e++;
        const L = e - a;
        if (S.ctl === 'e') Object.assign(m, { x: a, x0: a, x1: a, w: L, y: 10, v: 0 });
        else if (S.ctl === 'h') Object.assign(m, { x: a + 0.1, x0: a + 0.1, x1: e - 2.1, w: 2.0, y: 10, v: 2.4, p: 0 });
        else Object.assign(m, { x: a + 0.1, x0: a + 0.1, x1: e - 2.7, w: 2.6, y: 10, v: 1.8, p: 0 });
      });
      // 🔥 Schwer: Spezial-Gegner – 🐸 Hüpfer, 💨 Flitzer, 🦔 Igel (nicht draufspringen!), 🐝 Flieger über Lücken – und ein paar Gegner mehr
      if (S.ctl === 'h') {
        const keep = (x) => x > 12 && x < goal - 6 && !flags.some((f) => Math.abs(f.x - x) < 5) && !movers.some((m) => x > m.x0 - 7 && x < m.x1 + m.w + 7);
        foes.forEach((e, i) => { const k = ['h', 'f', 'w', 's'][i % 4]; e.k = k; if (k === 'f') e.vx = -2.9; if (k === 'h') e.ph = i; });
        const occ = (x) => foes.some((e) => Math.abs(e.x - x) < 6);
        for (let x = 16; x < cols - 10; x += 9) {
          if (!keep(x) || occ(x)) continue;
          if (map[10][x] === '#' && map[10][x - 1] === '#' && map[10][x + 1] === '#' && map[9][x] === ' ' && map[9][x - 1] === ' ' && map[9][x + 1] === ' ') foes.push({ x: x + 0.1, y: 9.15, w: 0.8, h: 0.85, vx: -1.6, alive: true, sq: 0, k: (x % 3) ? 'w' : 's' });
        }
        let gap = 0;
        for (let x = 1; x < cols - 8; x++) {
          if (map[10][x] !== '#' && map[11][x] !== '#') gap++; else { if (gap >= 2 && keep(x - gap) && !occ(x - gap / 2)) foes.push({ x: x - gap / 2 - 0.4, y: 6.2, y0: 6.2, w: 0.8, h: 0.8, vx: -1.2, x0: x - gap - 1.5, x1: x + 0.5, alive: true, sq: 0, k: 'y', ph: x }); gap = 0; }
        }
      }
      const P = { x: start.x, y: start.y, w: 0.72, h: 0.86, vx: 0, vy: 0, ground: false, face: 1, inv: 0, coy: 0, jb: 0, jh: false, cp: { ...start } };
      const solid = (x, y) => { if (x < 0) return true; if (y < 0 || y >= ROWS || x >= cols) return false; const c = map[y][x]; return c === '#' || c === 'B' || c === 'U' || c === 'T'; };
      const at = (x, y) => (y >= 0 && y < ROWS && x >= 0 && x < cols ? map[y][x] : ' ');
      const keys = { l: false, r: false, j: false };
      let tapJump = false, score = 0, food = 0, won = false, over = false, last = performance.now(), camX = 0, t = 0, msgT = 0;
      const ctx = cv.getContext('2d');
      let Wd = 0, Hd = 0, TS = 32, OY = 0, dpr = 1;
      // Größe: im Hochformat ist das Spielfeld etwa quadratisch und die Knöpfe liegen darunter (nichts verdeckt das Spiel),
      // im Querformat füllt es die Fläche und die Knöpfe liegen halbdurchsichtig darüber
      const size = () => {
        if (S.dead) return;
        dpr = Math.min(2, window.devicePixelRatio || 1);
        const ww = wrap.clientWidth, wh = wrap.clientHeight, pad = wrap.querySelector('.jrpad'), land = ww > wh * 1.15;
        wrap.classList.toggle('land', land);
        const ph = !land && pad ? pad.offsetHeight + 12 : 0;
        const h = land ? wh : Math.max(160, Math.min(wh - ph, Math.round((ww * ROWS) / 10.5)));
        area.style.height = `${h}px`;
        Wd = area.clientWidth; Hd = h; cv.width = Wd * dpr; cv.height = Hd * dpr;
        TS = Math.min(Hd / ROWS, Wd / 10.5); OY = Hd - ROWS * TS; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      size();
      const hud = (q) => area.querySelector(q);
      if (gates.length) { const hh = area.querySelector('.jrhud'); if (hh) hh.insertAdjacentHTML('beforeend', `<span class="jrgt">🚪 0/${gates.length}</span>`); }
      const hpDraw = () => { const h = hud('.jrhp'); if (h) h.innerHTML = '❤️'.repeat(Math.max(0, S.hp)) + `<i>${'❤️'.repeat(Math.max(0, S.hp0 - S.hp))}</i>`; };
      hpDraw();
      // Eingaben: jeder Finger merkt sich seine Taste (◀/▶ halten und gleichzeitig ⤒ tippen geht)
      const held = {};
      const mark = (k, on) => wrap.querySelectorAll(`[data-k="${k}"]`).forEach((x) => x.classList.toggle('on', on));
      const down = (e) => {
        const b = e.target.closest && e.target.closest('[data-k]');
        let k = b ? b.dataset.k : '';
        if (!k && S.auto && area.contains(e.target)) k = 'j'; // „läuft von allein“: Tippen aufs Spielfeld = springen
        if (!k) return;
        held[e.pointerId] = k; keys[k] = true; if (k === 'j') tapJump = true; mark(k, true);
        if (b) { try { b.setPointerCapture(e.pointerId); } catch (x) { /* egal */ } }
        e.preventDefault();
      };
      const up = (e) => {
        const k = held[e.pointerId]; if (!k) return;
        delete held[e.pointerId];
        if (!Object.values(held).includes(k)) { keys[k] = false; mark(k, false); }
      };
      const kd = (e) => { if (e.key === 'ArrowLeft') keys.l = true; if (e.key === 'ArrowRight') keys.r = true; if (e.key === ' ' || e.key === 'ArrowUp') { if (!keys.j) tapJump = true; keys.j = true; e.preventDefault(); } };
      const ku = (e) => { if (e.key === 'ArrowLeft') keys.l = false; if (e.key === 'ArrowRight') keys.r = false; if (e.key === ' ' || e.key === 'ArrowUp') keys.j = false; };
      const noMenu = (e) => e.preventDefault();
      wrap.addEventListener('pointerdown', down); wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up); wrap.addEventListener('lostpointercapture', up); wrap.addEventListener('contextmenu', noMenu);
      window.addEventListener('keydown', kd); window.addEventListener('keyup', ku); window.addEventListener('resize', size);
      const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => size()) : null; if (ro) ro.observe(wrap);
      S.off = () => { wrap.removeEventListener('pointerdown', down); wrap.removeEventListener('pointerup', up); wrap.removeEventListener('pointercancel', up); wrap.removeEventListener('lostpointercapture', up); wrap.removeEventListener('contextmenu', noMenu); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('resize', size); if (ro) ro.disconnect(); };
      // Aua: ein Herz weniger, zurück zum letzten Fähnchen. Alle Herzen weg → Level beginnt neu.
      const hurt = () => {
        if (P.inv > 0 || won || over) return;
        if (S.test) S.test.hurts++;
        S.snd.fx('hurt'); S.hp--; hpDraw();
        if (S.hp <= 0) {
          over = true; S.snd.stop();
          const box = document.createElement('div'); box.className = 'jrmsg';
          box.innerHTML = `<div>💔</div><div style="font-size:20px">${T('Alle Herzen weg – nochmal von vorn!')}</div>`;
          area.appendChild(box);
          S.tm = setTimeout(() => { if (!S.dead && this._jr === S) this._jrPlay(S.kid, S.n, true); }, 1800);
          return;
        }
        P.x = P.cp.x; P.y = P.cp.y; P.vx = 0; P.vy = 0; P.inv = 1.4;
      };
      // 🚪 Frage am Tor: Spiel pausiert, danach geht das Tor auf (richtig = +3 ⭐)
      let asking = false;
      const gateAsk = (c) => {
        if (asking || won || over) return;
        const gt = gates.find((x) => x.x === c && !x.open); if (!gt) return;
        asking = true; keys.l = false; keys.r = false; keys.j = false;
        const q = this._gmQ(S.kid);
        this._gmQShow(area, q, (ok) => {
          gt.open = true; for (let y = 0; y < ROWS; y++) if (map[y][c] === 'T') map[y][c] = ' ';
          if (ok) { score += 3; S.snd.fx('coin'); hud('.jrco').textContent = String(score); pops.push({ x: c + 0.5, y: 7, t: 0 }); }
          const gq = hud('.jrgt'); if (gq) gq.textContent = `🚪 ${gates.filter((x) => x.open).length}/${gates.length}`;
          asking = false; last = performance.now();
        });
      };
      const finish = () => {
        won = true; S.snd.stop(); S.snd.fx('win');
        const all = (coins.length + nBox * 3) || 1, part = score / all, cr = part >= 0.9 ? 3 : part >= 0.5 ? 2 : 1;
        const J = this._jrP(S.kid), best = Math.max(J.c[S.n] || 0, cr);
        // ⏱️ Zeit fürs Level (Bestzeit je Level wird gemerkt)
        const secs = Math.max(1, Math.round((performance.now() - S.t0) / 100) / 10), old = (J.t || {})[S.n], rec = !old || secs < old;
        this._peSet(S.kid, { jr: { ...J, u: Math.max(J.u, Math.min(10, S.n + 1)), c: { ...J.c, [S.n]: best }, t: { ...(J.t || {}), [S.n]: rec ? secs : old } } });
        this._peDo(S.kid, 'cheer', 2000);
        const tl = this._cfg.peHome && this._tlAdd ? Math.max(1, Math.min(15, Math.floor(score / 3))) : 0; if (tl) this._tlAdd(S.kid, tl); // 🪙 Taler fürs Zuhause
        const next = S.n < 10 && this._jrLeft(S.kid);
        const box = document.createElement('div'); box.className = 'jrmsg';
        box.innerHTML = `<div>${T('Geschafft! 🎉')}</div><div class="cr">${'👑'.repeat(cr)}${'·'.repeat(3 - cr)}</div><div style="font-size:16px">⭐ ${score}/${coins.length + nBox * 3}${food ? ` · ${S.sp.food} ${food}` : ''}${tl ? ` · +${tl} 🪙` : ''}</div><div style="font-size:16px">⏱️ ${tfmt(secs)}${rec && old ? ` · ${T('🏆 Neue Bestzeit!')}` : old ? ` · ${T('Bestzeit {t}', { t: tfmt(old) })}` : ''}</div>${cr < 3 ? `<div style="font-size:13px;opacity:.85">${T('Sammle mehr Sterne für mehr Kronen – das Level kannst du jederzeit nochmal spielen.')}</div>` : ''}`;
        area.appendChild(box);
        const ft = S && this._gm && this._gm.el.querySelector('.gmft') || (() => { const f = document.createElement('div'); f.className = 'gmft'; this._gm.el.appendChild(f); return f; })();
        ft.innerHTML = `${next ? `<button class="gmbtn" data-g="jrnext" data-v="${S.n + 1}">▶ ${T('Level {n}', { n: S.n + 1 })}</button>` : ''}<button class="gmbtn sec" data-g="jrmap">🗺️ ${T('Zur Karte')}</button>`;
        const pd = wrap.querySelector('.jrpad'); if (pd) pd.remove();
        size();
      };
      // Physik
      const step = (dt) => {
        t += dt; if (P.inv > 0) P.inv -= dt;
        // Laufen
        const acc = 34, maxv = S.ctl === 'e' ? 4.6 : S.ctl === 'h' ? 6.2 : 5.6;
        let dir = 0;
        if (S.auto) dir = 1; else dir = (keys.r ? 1 : 0) - (keys.l ? 1 : 0);
        if (dir) { P.vx += dir * acc * dt; P.face = dir; } else P.vx *= Math.pow(0.0005, dt);
        P.vx = Math.max(-maxv, Math.min(maxv, P.vx));
        // Springen (mit „Kojotenzeit“ und Puffer)
        P.coy = P.ground ? 0.1 : Math.max(0, P.coy - dt);
        if (P.ground) P.dj = true;
        const tap = tapJump;
        P.jb = tapJump ? 0.14 : Math.max(0, P.jb - dt); tapJump = false;
        if (P.jb > 0 && P.coy > 0) { P.vy = -13; P.coy = 0; P.jb = 0; P.ground = false; P.jh = true; S.snd.fx('jump'); }
        // ⤒⤒ Doppelsprung (Schwer): in der Luft nochmal tippen
        else if (tap && S.ctl === 'h' && !P.ground && P.coy <= 0 && P.dj) { P.vy = -11.5; P.dj = false; P.jb = 0; P.jh = true; S.snd.fx('jump'); if (S.test) S.test.dbl++; }
        if (P.jh && !keys.j && P.vy < -4 && S.ctl !== 'e') { P.vy = -4; P.jh = false; }
        P.vy = Math.min(18, P.vy + 32 * dt);
        // waagrecht
        P.x += P.vx * dt;
        const rows = [Math.floor(P.y + 0.05), Math.floor(P.y + P.h - 0.05)];
        if (P.vx > 0) { const c = Math.floor(P.x + P.w); if (rows.some((r) => solid(c, r))) { P.x = c - P.w - 0.001; P.vx = 0; if (rows.some((r) => at(c, r) === 'T')) gateAsk(c); } }
        if (P.vx < 0) { const c = Math.floor(P.x); if (rows.some((r) => solid(c, r))) { P.x = c + 1.001; P.vx = 0; } }
        if (P.x < 0) P.x = 0;
        // senkrecht
        const oy = P.y; P.y += P.vy * dt; P.ground = false;
        const cl = [Math.floor(P.x + 0.05), Math.floor(P.x + P.w - 0.05)];
        if (P.vy > 0) {
          const r = Math.floor(P.y + P.h);
          const hit = cl.some((c) => solid(c, r)) || (cl.some((c) => at(c, r) === '-') && oy + P.h <= r + 0.02);
          if (hit) { P.y = r - P.h; P.vy = 0; P.ground = true; }
          movers.forEach((m) => { if (P.x + P.w > m.x && P.x < m.x + m.w && oy + P.h <= m.y + 0.02 && P.y + P.h >= m.y) { P.y = m.y - P.h; P.vy = 0; P.ground = true; if (!(m.p > 0)) P.x += m.v * dt; } });
        } else if (P.vy < 0) {
          const r = Math.floor(P.y);
          if (cl.some((c) => solid(c, r))) {
            P.y = r + 1; P.vy = 0;
            // 🎁 Bonus-Kiste von unten angestoßen: +3 ⭐
            const bc = cl.find((c) => at(c, r) === 'B');
            if (bc !== undefined) { map[r][bc] = 'U'; score += 3; S.snd.fx('coin'); setTimeout(() => S.snd.fx('coin'), 120); hud('.jrco').textContent = String(score); pops.push({ x: bc + 0.5, y: r - 0.2, t: 0 }); if (S.test) S.test.boxes++; }
          }
        }
        // Feder, Stacheln
        const fc = Math.floor(P.x + P.w / 2), fr = Math.floor(P.y + P.h - 0.1);
        if (at(fc, fr) === 'S' || (P.ground && at(fc, Math.floor(P.y + P.h) - 1) === 'S')) { P.vy = -21; P.ground = false; S.snd.fx('spring'); }
        if (at(fc, fr) === '^' && P.y + P.h > fr + 0.55) hurt();
        if (P.y > ROWS + 1) hurt();
        // bewegte Plattformen
        // (hält an jedem Ende kurz an – so kommt man leichter drauf und runter)
        movers.forEach((m) => { if (m.p > 0) { m.p -= dt; return; } m.x += m.v * dt; if (m.x > m.x1 || m.x < m.x0) { m.v = -m.v; m.x = Math.max(m.x0, Math.min(m.x1, m.x)); m.p = 0.8; } });
        // Münzen, Futter, Fähnchen, Ziel
        const cx = P.x + P.w / 2, cy = P.y + P.h / 2;
        coins.forEach((c) => { if (!c.got && Math.abs(c.x - cx) < 0.7 && Math.abs(c.y - cy) < 0.8) { c.got = true; score++; S.snd.fx('coin'); hud('.jrco').textContent = String(score); } });
        foods.forEach((f) => { if (!f.got && Math.abs(f.x - cx) < 0.7 && Math.abs(f.y - cy) < 0.8) { f.got = true; food++; S.snd.fx('food'); hud('.jrfo').textContent = `${S.sp.food} ${food}`; } });
        flags.forEach((f) => { if (!f.on && cx > f.x) { f.on = true; P.cp = { x: f.x, y: f.y - 0.2 }; S.snd.fx('flag'); msgT = 1.2; } });
        if (cx > goal + 0.3) finish();
        // Gegner
        foes.forEach((e) => {
          if (!e.alive) { e.sq += dt; return; }
          if (e.k === 'y') { // 🐝 Flieger: hin und her über der Lücke, auf und ab
            e.x += e.vx * dt; if (e.x < e.x0 || e.x > e.x1) { e.vx = -e.vx; e.x = Math.max(e.x0, Math.min(e.x1, e.x)); }
            e.y = e.y0 + Math.sin(t * 2.2 + e.ph) * 1.3;
          } else {
            const nx = e.x + e.vx * dt, front = e.vx > 0 ? Math.floor(nx + e.w) : Math.floor(nx), fy = Math.floor(e.y + e.h + 0.1);
            if (solid(front, Math.floor(e.y + 0.5)) || !solid(front, fy) && at(front, fy) !== '-') e.vx = -e.vx; else e.x = nx;
          }
          const yo = e.k === 'h' ? -Math.max(0, Math.sin(t * 3.4 + e.ph)) * 1.7 : 0, ey = e.y + yo; // 🐸 Hüpfer springt
          e.yo = yo;
          if (P.x + P.w > e.x && P.x < e.x + e.w && P.y + P.h > ey && P.y < ey + e.h) {
            if (e.k !== 's' && P.vy > 0 && P.y + P.h - ey < 0.5) { e.alive = false; P.vy = -9; S.snd.fx('stomp'); } else hurt();
          }
        });
        pops.forEach((p) => { p.t += dt; }); while (pops.length && pops[0].t > 1.2) pops.shift();
      };
      // Zeichnen
      const draw = () => {
        const W = S.W, vw = Wd / TS;
        camX += ((P.x - vw * 0.35) - camX) * 0.15; camX = Math.max(0, Math.min(cols - vw, camX));
        const sky = ctx.createLinearGradient(0, 0, 0, Hd); sky.addColorStop(0, W.sky[0]); sky.addColorStop(1, W.sky[1]);
        ctx.fillStyle = sky; ctx.fillRect(0, 0, Wd, Hd);
        if (S.L.w === 4) { ctx.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 40; i++) { const x = ((i * 97) % 1000) / 1000 * Wd * 1.5 - camX * TS * 0.1 % (Wd * 0.5), y = ((i * 53) % 400) / 400 * Hd * 0.5; ctx.fillRect(((x % Wd) + Wd) % Wd, y, 2, 2); } }
        // Hügel (Parallaxe)
        [[W.hill2, 0.25, 0.62, 3.2], [W.hill, 0.5, 0.7, 2.2]].forEach(([c, par, base, f]) => {
          ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, Hd);
          for (let x = 0; x <= Wd; x += 8) { const wx = (x + camX * TS * par) / (TS * f); ctx.lineTo(x, Hd * base - Math.sin(wx) * TS * 0.8 - Math.sin(wx * 0.37) * TS * 0.6); }
          ctx.lineTo(Wd, Hd); ctx.fill();
        });
        // Wolken
        ctx.fillStyle = S.L.w === 4 ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.85)';
        for (let i = 0; i < 6; i++) { const x = ((i * 260 - camX * TS * 0.15) % (Wd + 200) + Wd + 200) % (Wd + 200) - 100, y = TS * (1 + (i % 3) * 0.8); ctx.beginPath(); ctx.ellipse(x, y, TS * 1.1, TS * 0.45, 0, 0, Math.PI * 2); ctx.ellipse(x + TS * 0.7, y - TS * 0.2, TS * 0.7, TS * 0.4, 0, 0, Math.PI * 2); ctx.fill(); }
        // Spielfeld (im Hochformat unten ausgerichtet, damit man genug vom Level sieht)
        ctx.save(); ctx.translate(0, OY);
        // Kacheln
        const c0 = Math.floor(camX), c1 = Math.min(cols, Math.ceil(camX + vw) + 1), ox = -camX * TS;
        for (let y = 0; y < ROWS; y++) for (let x = c0; x < c1; x++) {
          const c = map[y][x], px = ox + x * TS, py = y * TS;
          if (c === '#') {
            const topT = !solid(x, y - 1);
            ctx.fillStyle = (x + y) % 2 ? W.dirt : W.dirt2; ctx.fillRect(px, py, TS + 0.5, TS + 0.5);
            if (topT) { ctx.fillStyle = W.top; ctx.fillRect(px, py, TS + 0.5, TS * 0.32); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(px, py, TS + 0.5, TS * 0.08); }
          } else if (c === '-') {
            ctx.fillStyle = W.plat; ctx.fillRect(px, py, TS + 0.5, TS * 0.35); ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(px, py + TS * 0.27, TS + 0.5, TS * 0.08);
          } else if (c === '^') {
            ctx.fillStyle = '#868e96'; ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(px + i * TS / 3, py + TS); ctx.lineTo(px + i * TS / 3 + TS / 6, py + TS * 0.35); ctx.lineTo(px + (i + 1) * TS / 3, py + TS); } ctx.fill();
          } else if (c === 'T') {
            ctx.fillStyle = '#9c6644'; ctx.fillRect(px + TS * 0.12, py, TS * 0.76, TS + 0.5); ctx.fillStyle = '#7f5539'; for (let i = 1; i < 4; i++) ctx.fillRect(px + TS * 0.12, py + (i * TS) / 4, TS * 0.76, TS * 0.05);
            if (y === 7) { ctx.font = `bold ${TS * 0.6}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('❓', px + TS / 2, py + TS / 2); }
          } else if (c === 'B' || c === 'U') {
            ctx.fillStyle = c === 'B' ? '#fcc419' : '#a87b4f'; ctx.fillRect(px + 1, py + 1, TS - 2, TS - 2);
            ctx.strokeStyle = c === 'B' ? '#e67700' : '#6f4e2e'; ctx.lineWidth = Math.max(2, TS * 0.08); ctx.strokeRect(px + 2, py + 2, TS - 4, TS - 4);
            if (c === 'B') { ctx.fillStyle = '#fff'; ctx.font = `bold ${TS * 0.62}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', px + TS / 2, py + TS / 2 + Math.sin(t * 5) * TS * 0.05); }
          } else if (c === 'S') {
            ctx.fillStyle = '#fa5252'; ctx.fillRect(px + TS * 0.1, py + TS * 0.55, TS * 0.8, TS * 0.2); ctx.fillStyle = '#495057'; for (let i = 0; i < 3; i++) ctx.fillRect(px + TS * 0.25, py + TS * (0.75 + i * 0.08), TS * 0.5, TS * 0.04);
          }
        }
        // Fähnchen und Ziel
        flags.forEach((f) => { const px = ox + f.x * TS + TS * 0.4, py = f.y * TS + TS; ctx.fillStyle = '#495057'; ctx.fillRect(px, py - TS * 1.6, TS * 0.08, TS * 1.6); ctx.fillStyle = f.on ? '#40c057' : '#fa5252'; ctx.beginPath(); ctx.moveTo(px + TS * 0.08, py - TS * 1.6); ctx.lineTo(px + TS * 0.7, py - TS * 1.35); ctx.lineTo(px + TS * 0.08, py - TS * 1.1); ctx.fill(); });
        { const px = ox + goal * TS, py = 10 * TS; ctx.fillStyle = '#ffd43b'; ctx.fillRect(px - TS * 0.6, py - TS * 2.4, TS * 1.6, TS * 2.4); ctx.fillStyle = '#5c3d23'; ctx.beginPath(); ctx.ellipse(px + TS * 0.2, py - TS * 1.1, TS * 0.55, TS * 1.1, 0, Math.PI, 0); ctx.rect(px - TS * 0.35, py - TS * 1.1, TS * 1.1, TS * 1.1); ctx.fill(); ctx.font = `${TS * 0.9}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('🏁', px + TS * 0.2, py - TS * 2.55); }
        // bewegte Plattformen
        movers.forEach((m) => { ctx.fillStyle = W.plat; ctx.fillRect(ox + m.x * TS, m.y * TS, m.w * TS, TS * 0.38); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(ox + m.x * TS, m.y * TS, m.w * TS, TS * 0.08); });
        // Münzen (Sterne) und Futter
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        coins.forEach((c) => { if (c.got) return; const px = ox + c.x * TS, py = c.y * TS + Math.sin(t * 4 + c.x) * TS * 0.08, r = TS * 0.34, sx = Math.abs(Math.cos(t * 3 + c.x)) * 0.6 + 0.4; ctx.save(); ctx.translate(px, py); ctx.scale(sx, 1); ctx.fillStyle = '#ffd43b'; ctx.strokeStyle = '#f08c00'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); });
        ctx.font = `${TS * 0.8}px sans-serif`;
        foods.forEach((f) => { if (!f.got) ctx.fillText(S.sp.food, ox + f.x * TS, f.y * TS + Math.sin(t * 3) * TS * 0.1); });
        // Gegner
        const FE = { h: '🐸', f: '🐀', s: '🦔', y: S.L.w === 4 ? '🦇' : '🐝' };
        foes.forEach((e) => { if (!e.alive && e.sq > 0.5) return; ctx.save(); ctx.translate(ox + (e.x + e.w / 2) * TS, (e.y + (e.yo || 0) + e.h) * TS); if (!e.alive) ctx.scale(1.2, 0.35); else if (e.vx > 0) ctx.scale(-1, 1); ctx.font = `${TS * 0.9}px sans-serif`; ctx.textBaseline = 'bottom'; ctx.fillText(FE[e.k] || W.foe, 0, 0); ctx.restore(); });
        pops.forEach((p) => { ctx.globalAlpha = Math.max(0, 1 - p.t / 1.2); ctx.font = `bold ${TS * 0.6}px sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 3; const yy = (p.y - p.t * 1.5) * TS; ctx.strokeText('+3 ⭐', ox + p.x * TS, yy); ctx.fillText('+3 ⭐', ox + p.x * TS, yy); ctx.globalAlpha = 1; });
        // Haustier
        if (!(P.inv > 0 && Math.floor(t * 10) % 2)) {
          const img = !P.ground ? S.sp.jump : P.inv > 0.8 ? S.sp.hurt : S.sp.run, s = TS * 1.55, bob = P.ground && Math.abs(P.vx) > 0.5 ? Math.abs(Math.sin(t * 14)) * TS * 0.08 : 0;
          ctx.save(); ctx.translate(ox + (P.x + P.w / 2) * TS, (P.y + P.h) * TS - bob); if (P.face < 0) ctx.scale(-1, 1);
          if (img.complete && img.naturalWidth) ctx.drawImage(img, -s / 2, -s * 0.94, s, s); else { ctx.font = `${TS}px sans-serif`; ctx.textBaseline = 'bottom'; ctx.fillText('🐾', 0, 0); }
          ctx.restore();
        }
        ctx.restore();
        if (msgT > 0) { ctx.font = `bold ${TS * 0.6}px sans-serif`; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 4; ctx.textAlign = 'center'; const tx = T('🚩 Zwischenstand gespeichert'); ctx.strokeText(tx, Wd / 2, Hd * 0.25); ctx.fillText(tx, Wd / 2, Hd * 0.25); }
      };
      const loop = (now) => {
        if (S.dead) return;
        let dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!won && !over && !asking) { while (dt > 0) { const s = Math.min(dt, 1 / 120); step(s); dt -= s; } }
        if (msgT > 0) msgT -= 1 / 60;
        draw();
        S.raf = requestAnimationFrame(loop);
      };
      S.test = { P, coins, foes, flags, movers, map, get goal() { return goal; }, get won() { return won; }, get over() { return over; }, get hp() { return S.hp; }, get TS() { return TS; }, get Hd() { return Hd; }, finish, hurt, keys, jump: () => { tapJump = true; }, hurts: 0, boxes: 0, dbl: 0, nBox, gates, get asking() { return asking; } };
      S.raf = requestAnimationFrame(loop);
    }
  }
  Object.getOwnPropertyNames(A.prototype).forEach((n) => { if (n !== 'constructor') C.prototype[n] = A.prototype[n]; });
  C.prototype._jrLevels = () => LEVELS.length;
}
