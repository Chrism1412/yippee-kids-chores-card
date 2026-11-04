// 🎄 Yippee! - Kids Chores – Adventskalender
// Eigene Datei neben der Karte. Die Karte lädt sie erst, wenn der Adventskalender unter ⚙️ Einstellungen eingeschaltet ist.
// Alle Daten liegen in der Yippee-Liste (kp|adc|main, kp|adk|<Kind>, kp|ado|<Kind>).
export default function install(Y) {
  if (customElements.get('yippee-advent')) return true;
  const T = Y.T;
  const pad = (n) => String(n).padStart(2, '0');
  const dk = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const uid = () => (Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4)).replace(/[^a-z0-9]/g, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hsh = (str) => { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; };
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const shuffle = (arr, r) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const HEX = (v) => (/^#[0-9a-f]{6}$/i.test(String(v || '')) ? String(v) : '');
  const IMG_RX = /^(\/local\/|https:\/\/)[^"'<>\s()\\]+$/;
  const ID_RX = /^[\w-]{1,40}$/;
  // Dateien in der HA-Mediathek (Ordner /media/advent)
  const MS_RX = /^media-source:\/\/media_source\/[\w-]+\/[^"'<>\\]+$/;
  const MEDIA_ROOT = 'media-source://media_source/local/advent';
  const MAX_UP = 20 * 1024 * 1024;
  const isImgRef = (v) => IMG_RX.test(v || '') || (MS_RX.test(v || '') && /\.jpe?g$/i.test(v));
  const isSndRef = (v) => AUDIO_RX.test(v || '') || (MS_RX.test(v || '') && /\.mp3$/i.test(v));
  const fileName = (v) => { try { return decodeURIComponent(String(v || '').split('?')[0].split('/').pop() || ''); } catch (e) { return String(v || '').split('/').pop(); } };
  const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
  const svgUrl = (sv) => `url("data:image/svg+xml,${encodeURIComponent(sv)}")`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const errMsg = (e) => (e && (e.message || e.body?.message || e.error || e.code)) || String(e);

  // ---------- Ton ----------
  // iOS/Safari erlauben Töne nur direkt beim Antippen. Darum wird der Ton beim Tippen "freigeschaltet"
  // und darf dann nach der Aufklapp-Animation abgespielt werden.
  const AUDIO_RX = /^(\/local\/|https:\/\/)[^"'<>\s\\]+\.(mp3|wav|ogg|m4a|aac)(\?[^"'<>\s\\]*)?$/i;
  let AC = null, AU = null, AUsrc = '';
  const audioEl = (file) => { if (!AU || AUsrc !== file) { AU = new Audio(file); AU.preload = 'auto'; AUsrc = file; } return AU; };

  function soundUnlock(type, file) {
    try {
      if (type === 'file' && file) {
        const a = audioEl(file);
        a._want = false; a.muted = true;
        const pr = a.play();
        if (pr) pr.then(() => { if (!a._want) { a.pause(); a.currentTime = 0; } a.muted = false; }).catch(() => { a.muted = false; });
      }
      if (type !== 'none') {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx && !AC) AC = new Ctx();
        if (AC && AC.state === 'suspended') AC.resume();
      }
    } catch (e) {}
  }

  function playTone(type) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!AC) AC = new Ctx();
      const ctx = AC;
      if (ctx.state === 'suspended') ctx.resume();
      if (type === 'chime') {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2093.0, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.5);
      } else {
        [880, 1320, 1760, 2640].forEach((freq, index) => {
          const osc = ctx.createOscillator(), gain = ctx.createGain(), t = ctx.currentTime + index * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 1.25);
        });
      }
    } catch (e) { console.warn('Yippee Advent: Ton fehlgeschlagen', e); }
  }

  // Liefert ein Promise: true = Datei gespielt, false = Ersatzton (Glocken) gespielt
  function playSound(type, file) {
    if (!type || type === 'none') return Promise.resolve(true);
    if (type !== 'file') { playTone(type); return Promise.resolve(true); }
    if (!file) { playTone('bells'); return Promise.resolve(false); }
    const a = audioEl(file);
    a._want = true; a.muted = false;
    try { a.currentTime = 0; } catch (e) {}
    return a.play().then(() => true).catch((e) => { console.warn('Yippee Advent: Datei nicht abspielbar', file, e); playTone('bells'); return false; });
  }

  const THEMES = {
    nacht: { n: '✨ Sternennacht', bg: 'radial-gradient(ellipse at 50% -10%,#3a4f96 0%,transparent 55%),linear-gradient(180deg,#18275a 0%,#1f2f68 60%,#273a7a 100%)', door: '#d7263d', text: '#ffffff', accent: '#f2c94c', fl: '#ffffff' },
    winter: { n: '❄️ Winternacht', bg: 'linear-gradient(165deg,#0b1a33 0%,#173a66 100%)', door: '#2f6fb3', text: '#f5f8ff', accent: '#ffd43b', fl: '#ffffff' },
    classic: { n: '🎄 Klassisch', bg: 'linear-gradient(165deg,#5c0b12 0%,#123d22 100%)', door: '#b3261e', text: '#fff8ec', accent: '#f2c94c', fl: '#ffffff' },
    pastel: { n: '🌸 Pastell', bg: 'linear-gradient(165deg,#fde2ec 0%,#e3f0ff 100%)', door: '#e77fa3', text: '#3b2f45', accent: '#8f6bd8', fl: '#a8c7ff' },
    wood: { n: '🏡 Rustikal', bg: 'linear-gradient(165deg,#3e2a1c 0%,#6b4a31 100%)', door: '#a8743f', text: '#fff5e6', accent: '#e9c46a', fl: '#fff8ee' },
  };
  const COLORS = ['#e03131', '#1c7ed6', '#2f9e44', '#f08c00', '#ae3ec9', '#0c8599', '#d6336c', '#5c940d'];
  const AVATARS = ['🦊', '🐻', '🐼', '🦁', '🐯', '🐨', '🐸', '🦄', '🐧', '🦖', '🐶', '🐱', '🐰', '🦉', '👧', '👦', '🧒', '🎅', '⛄', '🦌'];
  const EMOS = ['🎁', '🍪', '🍫', '🎄', '⭐', '❄️', '⛄', '🎅', '🤶', '🦌', '🔔', '🕯️', '🍬', '🍭', '🧸', '🎨', '📚', '🎬', '🍿', '🎲', '🧩', '🎵', '☕', '🍊', '🥜', '🧦', '💌', '🌟', '✨', '🎉', '🛷', '⛸️', '🏰', '🚂', '🐻', '🦊', '🐧', '🍰', '🧁', '🥨', '😂', '❓'];
  const SIZES = { s: '58px', m: '74px', l: '96px' };
  const SHAPES = { tile: '6px', sq: '12px', round: '50%', gift: '10px' };
  const FONTS = { fun: '"Fredoka","Baloo 2","Nunito",system-ui,sans-serif', std: 'inherit', serif: 'Georgia,"Times New Roman",serif', hand: '"Comic Sans MS","Comic Neue",cursive', mono: 'ui-monospace,Menlo,Consolas,monospace' };
  const FLAKES = ['❄', '•', '✦', '⭐'];

  // ---------- Vorlagen ----------
  // Jede Vorlage ist an das Kind gerichtet und ergibt für sich allein Sinn. Gruppiert nach Themen.
  const TPL = [
    ['🍪 Backen & Naschen', [
      ['🍪', 'Heute backen wir zusammen Plätzchen – du darfst die Ausstechformen aussuchen!'],
      ['🧁', 'Heute verzierst du mit uns die Plätzchen – mit Zuckerguss und bunten Streuseln.'],
      ['☕', 'Heute Abend gibt es für dich einen heißen Kakao mit Sahne.'],
      ['🍎', 'Heute machen wir zusammen Bratäpfel mit Zimt.'],
      ['🍫', 'Heute darfst du dir nach dem Abendessen etwas Süßes aussuchen.'],
    ]],
    ['🎨 Basteln & Malen', [
      ['⭐', 'Heute basteln wir zusammen Sterne für das Fenster.'],
      ['❄️', 'Heute schneiden wir Schneeflocken aus Papier und kleben sie ans Fenster.'],
      ['🎄', 'Heute basteln wir Anhänger für den Weihnachtsbaum.'],
      ['💌', 'Heute malst du eine Weihnachtskarte – für wen, entscheidest du.'],
      ['🎁', 'Heute bastelst du ein kleines Geschenk für jemanden, den du lieb hast.'],
    ]],
    ['🛋️ Gemeinsame Zeit', [
      ['🎬', 'Heute ist Filmabend! Du darfst den Weihnachtsfilm aussuchen.'],
      ['🎲', 'Heute Abend spielen wir zusammen ein Spiel – du suchst es aus.'],
      ['📖', 'Heute Abend lesen wir zusammen eine Weihnachtsgeschichte.'],
      ['🎵', 'Heute hören wir Weihnachtslieder und singen zusammen mit.'],
      ['🧩', 'Heute puzzeln wir zusammen.'],
      ['🏰', 'Heute darfst du eine Kuschelhöhle aus Decken und Kissen bauen.'],
    ]],
    ['🌲 Draußen', [
      ['✨', 'Heute machen wir einen Abendspaziergang und schauen uns die Weihnachtslichter an.'],
      ['🎪', 'Heute besuchen wir zusammen einen Weihnachtsmarkt.'],
      ['🌲', 'Heute sammeln wir draußen Tannenzapfen und Zweige zum Dekorieren.'],
      ['🐦', 'Heute hängen wir Futter für die Vögel auf.'],
      ['⛄', 'Heute geht es raus an die frische Luft – liegt Schnee, bauen wir einen Schneemann!'],
    ]],
    ['🎟️ Gutscheine', [
      ['🌙', 'Gutschein: Heute darfst du 30 Minuten länger aufbleiben.'],
      ['🍝', 'Gutschein: Heute darfst du das Abendessen aussuchen.'],
      ['🤗', 'Gutschein: Einmal ganz lange kuscheln – wann immer du möchtest.'],
      ['📺', 'Gutschein: 30 Minuten extra Bildschirmzeit.'],
      ['🛁', 'Gutschein: Ein Schaumbad mit extra viel Schaum.'],
      ['🥞', 'Gutschein: Am Wochenende gibt es dein Lieblingsfrühstück.'],
    ]],
    ['🎁 Kleine Überraschungen', [
      ['🛏️', 'Schau heute mal unter dein Kopfkissen – da wartet etwas auf dich!'],
      ['🧦', 'Schau heute mal in deine Hausschuhe!'],
      ['🗺️', 'Schatzsuche: Im Wohnzimmer ist heute eine kleine Überraschung versteckt. Findest du sie?'],
      ['🎁', 'Heute wartet eine kleine Überraschung auf dich – frag uns danach!'],
    ]],
    ['❤️ Gutes tun', [
      ['💛', 'Mach heute jemandem eine Freude – zum Beispiel mit einem Bild oder einer Umarmung.'],
      ['🧸', 'Such heute ein Spielzeug aus, das du einem anderen Kind schenken möchtest.'],
      ['🙌', 'Hilf heute bei einer Aufgabe im Haushalt – zusammen geht es schneller!'],
    ]],
    ['❓ Rätsel', [
      ['🎄', 'Rätsel: Ich bin im Sommer und im Winter grün, und im Dezember hängen Kugeln an mir. Wer bin ich?\n\nLösung: der Tannenbaum'],
      ['🦌', 'Rätsel: Ich habe eine leuchtend rote Nase und ziehe den Schlitten des Weihnachtsmanns. Wer bin ich?\n\nLösung: Rudolph, das Rentier'],
      ['❄️', 'Rätsel: Ich falle leise vom Himmel, bin weiß und kalt und schmelze in deiner Hand. Was bin ich?\n\nLösung: eine Schneeflocke'],
      ['🕯️', 'Rätsel: Ich werde jeden Sonntag im Advent eine mehr. Was bin ich?\n\nLösung: die Kerzen am Adventskranz'],
    ]],
  ];
  const IDEAS = TPL.flatMap(([, list]) => list);
  // Emoji-Auswahl im Türchen-Dialog: feste Liste + alle Emojis aus den Vorlagen
  const EMO_ALL = [...new Set([...EMOS, ...IDEAS.map((x) => x[0]), '🕯️', '🎆', '🍽️'])];

  // Sondertage – die Adventssonntage werden jedes Jahr neu berechnet
  function specials(year, N) {
    const out = {
      1: ['🎄', 'Juhu, es geht los! Das erste Türchen ist offen – jetzt beginnt die Adventszeit.'],
      6: ['🎅', 'Heute ist Nikolaustag! Hast du gestern Abend deine Stiefel geputzt und rausgestellt?'],
      23: ['🌟', 'Morgen ist Heiligabend – nur noch einmal schlafen!'],
      24: ['🎄', 'Frohe Weihnachten! Heute ist Heiligabend – der große Tag ist da!'],
    };
    if (N > 24) {
      out[25] = ['🎁', 'Heute ist der erste Weihnachtsfeiertag – Zeit für die Familie.'];
      out[26] = ['🍽️', 'Heute ist der zweite Weihnachtsfeiertag – heute wird gemütlich gefaulenzt.'];
      out[31] = ['🎆', 'Heute ist Silvester – heute Abend feiern wir das neue Jahr!'];
    }
    // 4. Advent = letzter Sonntag vor dem 25.12.
    const d24 = new Date(year, 11, 24), fourth = 24 - (d24.getDay() % 7);
    const kerze = ['Heute ist der 1. Advent – wir zünden die erste Kerze am Adventskranz an.', 'Heute ist der 2. Advent – wir zünden die zweite Kerze am Adventskranz an.', 'Heute ist der 3. Advent – wir zünden die dritte Kerze am Adventskranz an.', 'Heute ist der 4. Advent – wir zünden die vierte Kerze am Adventskranz an.'];
    for (let i = 0; i < 4; i++) {
      const day = fourth - (3 - i) * 7;
      if (day < 1 || day > N || day === 24) continue;
      out[day] = day === 6 ? ['🎅', 'Heute ist Nikolaustag und 2. Advent! Wir zünden die zweite Kerze an – und hast du deine Stiefel rausgestellt?'] : ['🕯️', kerze[i]];
    }
    return out;
  }

  const DEF = {
    title: '', days: 24, catchUp: true,
    theme: 'nacht', col: {}, doorKid: true, bgImg: '', deco: true,
    doorAlpha: '0.15', openTime: '00:00',
    targetDate: '',
    soundType: 'bells', soundFile: '',
    snow: true, snowAmt: 'm', snowSpd: 'n', snowFl: '❄',
    shape: 'tile', size: 'm', font: 'fun', big24: false, anim: 'flip', countdown: true, progress: true,
    yPend: false,
    nOn: false, nTime: '07:00', nText: '',
  };

  // ---------- Selbst gezeichnete Grafiken ----------
  const C_R = '#d7263d', C_W = '#f8f4ec', C_G = '#c9a15a', C_D = '#33363f', C_N = '#1f6b46';
  const SV_FLAKE = (c, o = 1) => `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g stroke='${c}' stroke-opacity='${o}' stroke-width='1.7' stroke-linecap='round' fill='none'><path d='M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10'/><path d='M9.4 3.6 12 6.2l2.6-2.6M9.4 20.4 12 17.8l2.6 2.6M3.7 10.4l3.5-.9-.9-3.5M20.3 13.6l-3.5.9.9 3.5M6.3 18l.9-3.5-3.5-.9M17.7 6l-.9 3.5 3.5.9'/></g></svg>`;
  const SV_TREE = (c) => `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='26' viewBox='0 0 22 26'><path d='M11 2 17 11h-3l5 8H3l5-8H5z' fill='${c}'/><rect x='9.5' y='19' width='3' height='4' fill='${c}'/></svg>`;
  const SV_STAR = (c) => `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M12 2l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.2l-6 3.3 1.3-6.8-5-4.7 6.8-.8z' fill='${c}'/></svg>`;
  const SKY = "radial-gradient(1.2px 1.2px at 12px 18px,rgba(255,255,255,.9) 50%,transparent 60%),radial-gradient(1px 1px at 70px 44px,rgba(255,255,255,.7) 50%,transparent 60%),radial-gradient(1.6px 1.6px at 40px 90px,rgba(255,255,255,.8) 50%,transparent 60%),radial-gradient(1px 1px at 100px 120px,rgba(255,255,255,.6) 50%,transparent 60%),radial-gradient(1.3px 1.3px at 130px 70px,rgba(255,255,255,.75) 50%,transparent 60%)";
  const HANG = {
    gift: '<svg width="30" height="32" viewBox="0 0 30 32"><path d="M15 8c-3-6-10-6-9-1 1 3 6 2 9 1zm0 0c3-6 10-6 9-1-1 3-6 2-9 1z" fill="#fff"/><rect x="2" y="8" width="26" height="7" rx="1.5" fill="#e8475a"/><rect x="4" y="14" width="22" height="17" rx="1.5" fill="#d7263d"/><g fill="#fff" opacity=".85"><circle cx="8" cy="20" r="1.4"/><circle cx="22" cy="25" r="1.4"/><circle cx="9" cy="27" r="1.1"/><circle cx="21" cy="19" r="1.1"/></g><rect x="13" y="8" width="4" height="23" fill="#fff"/></svg>',
    star: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6 5.6 21.1 7 14l-5.3-5 7.2-.9z" fill="#f2c94c" stroke="#d9a52e" stroke-width="1"/></svg>',
    flake: '<svg width="26" height="26" viewBox="0 0 24 24"><g stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10"/><path d="M9.4 3.6 12 6.2l2.6-2.6M9.4 20.4 12 17.8l2.6 2.6M3.7 10.4l3.5-.9-.9-3.5M20.3 13.6l-3.5.9.9 3.5M6.3 18l.9-3.5-3.5-.9M17.7 6l-.9 3.5 3.5.9"/></g></svg>',
    ball: '<svg width="26" height="30" viewBox="0 0 26 30"><rect x="10" y="0" width="6" height="5" rx="1" fill="#c9a15a"/><circle cx="13" cy="17" r="12" fill="#d7263d"/><path d="M1.6 14.5h22.8M2.2 20h21.6" stroke="#f2c94c" stroke-width="1.6"/><circle cx="9" cy="12" r="3" fill="#fff" opacity=".35"/></svg>',
  };
  const DECO_TOP = `<div class="garl">${[[4, 22, 'gift'], [13, 40, 'star'], [21, 14, 'flake'], [29, 30, 'ball'], [71, 26, 'ball'], [79, 12, 'flake'], [87, 38, 'star'], [96, 20, 'gift']].map(([x, l, t], i) => `<span class="hang" style="left:${x}%;animation-delay:-${(i * 0.7).toFixed(1)}s"><i style="height:${l}px"></i>${HANG[t]}</span>`).join('')}</div>`;
  const SV_PINE = (w, h) => `<svg width="${w}" height="${h}" viewBox="0 0 30 50"><path d="M15 2 26 20h-5l8 15h-6l5 9H2l5-9H1l8-15H4z" fill="#1f6b46"/><path d="M15 2l4 6.5c-2 1-6 1-8 0zM7 20h16c-2 1.6-12 1.6-16 0zM4 35h22c-4 1.8-18 1.8-22 0z" fill="#fff" opacity=".85"/><rect x="13" y="44" width="4" height="6" fill="#6b3f1f"/></svg>`;
  const SV_GIFT = (w, c1, c2) => `<svg width="${w}" height="${w}" viewBox="0 0 30 30"><rect x="3" y="11" width="24" height="18" rx="1.5" fill="${c1}"/><rect x="1.5" y="7" width="27" height="6" rx="1.5" fill="${c1}" opacity=".9"/><rect x="13" y="7" width="4" height="22" fill="${c2}"/><path d="M15 7c-3-5-9-5-8-1 1 2 5 2 8 1zm0 0c3-5 9-5 8-1-1 2-5 2-8 1z" fill="${c2}"/></svg>`;
  const SV_SNOWMAN = '<svg width="74" height="96" viewBox="0 0 74 96"><path d="M24 50 8 38M50 50 66 38M8 38l-3-5M8 38l-5 1M66 38l3-5M66 38l5 1" stroke="#7a4a24" stroke-width="2.2" stroke-linecap="round"/><circle cx="37" cy="74" r="21" fill="#fff" stroke="#d7e1f0" stroke-width="1.5"/><circle cx="37" cy="46" r="15" fill="#fff" stroke="#d7e1f0" stroke-width="1.5"/><circle cx="37" cy="23" r="11.5" fill="#fff" stroke="#d7e1f0" stroke-width="1.5"/><path d="M25 16Q35 -3 53 7l-4 9z" fill="#d7263d"/><rect x="23" y="13.5" width="27" height="5.5" rx="2.7" fill="#f8f4ec"/><circle cx="53" cy="7" r="3.6" fill="#f8f4ec"/><circle cx="33" cy="22" r="1.5" fill="#2b2b2b"/><circle cx="41" cy="22" r="1.5" fill="#2b2b2b"/><path d="M37 25.5l10 2.3-10 1.6z" fill="#f08c00"/><path d="M31.5 30q5.5 3 11 0" stroke="#2b2b2b" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="24" y="33" width="26" height="6" rx="3" fill="#1c4fa0"/><rect x="41" y="35" width="6" height="14" rx="2.5" fill="#1c4fa0"/><circle cx="37" cy="45" r="1.8" fill="#2b2b2b"/><circle cx="37" cy="53" r="1.8" fill="#2b2b2b"/><circle cx="37" cy="68" r="1.8" fill="#2b2b2b"/></svg>';
  const SV_CANE = '<svg width="44" height="88" viewBox="0 0 44 88"><path d="M30 86V28a12 12 0 0 0-24 0v5" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M30 86V28a12 12 0 0 0-24 0v5" stroke="#d7263d" stroke-width="9" fill="none" stroke-dasharray="6 7"/></svg>';
  const DECO_BOTTOM = `<div class="land"><svg class="hills" viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M0 52C60 28 120 66 200 58S330 24 400 46V100H0z" fill="#dfe8f6"/><path d="M0 74C80 54 150 88 230 78S350 58 400 70V100H0z" fill="#fff"/></svg>
    <div class="dl">${SV_PINE(26, 44)}${SV_SNOWMAN}${SV_GIFT(26, '#c9a15a', '#d7263d')}</div>
    <div class="dr">${SV_GIFT(24, '#d7263d', '#fff')}${SV_CANE}${SV_PINE(30, 52)}${SV_PINE(22, 36)}</div></div>`;

  let fontsLoaded = false;
  const loadFonts = () => {
    if (fontsLoaded) return;
    fontsLoaded = true;
    try {
      if (document.querySelector('link[data-ak-fonts]')) return;
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.dataset.akFonts = '1';
      l.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Fredoka:wght@600;700&display=swap';
      document.head.appendChild(l);
    } catch (e) {}
  };

  const CSS = `
:host{display:block}
.adm{display:flex;flex-direction:column;gap:12px}
.adm>.hd .tt{font-size:18px}
*{box-sizing:border-box}
[hidden]{display:none!important}
button{font:inherit;color:inherit;border:none;background:none;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
button:disabled{opacity:.45;cursor:default}
input,select,textarea{font:inherit;font-size:16px;color:var(--tx,#222);background:var(--soft,rgba(127,127,127,.1));border:1px solid var(--ln,rgba(127,127,127,.3));border-radius:10px;padding:9px 11px;width:100%}
textarea{min-height:96px;resize:vertical}
input[type=checkbox]{width:20px;height:20px;flex:none;margin:2px 0 0}
input[type=color]{height:42px;padding:2px;cursor:pointer}
input[type=range],input[type=time],input[type=date],input[type=datetime-local]{cursor:pointer}
code{font-size:12px}
.card{background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--tx,#222);border-radius:var(--ha-card-border-radius,16px);border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color,#e0e0e0));padding:16px;display:flex;flex-direction:column;gap:12px}
.hd{display:flex;align-items:center;gap:8px}
.hd .tt{flex:1;font-size:20px;font-weight:800;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hint{font-size:13px;color:var(--mu,#666);line-height:1.4}
.hint.warn{color:#c92a2a;font-weight:600}
.hint.ok{color:#2b8a3e;font-weight:600}
.btn{padding:9px 14px;border-radius:10px;background:rgba(127,127,127,.14);font-weight:700}
.btn.p{background:var(--ac,#5b6cff);color:#fff}
.btn.d{background:#e03131;color:#fff}
.btn.sm{padding:6px 10px;font-size:13px}
.btn:active,.ic:active,.door:active,.ec:active{transform:scale(.96)}
.row{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:12px;background:rgba(127,127,127,.08)}
.row .g{flex:1;min-width:0;font-weight:700;overflow-wrap:anywhere}
.row .g small{display:block;font-weight:400;font-size:12px;color:var(--mu,#666)}
.ic{width:36px;height:36px;border-radius:10px;display:inline-grid;place-items:center;background:rgba(127,127,127,.14);flex:none}
.av{width:38px;height:38px;border-radius:50%;display:inline-grid;place-items:center;font-size:22px;flex:none;border:3px solid var(--kc,#888);background:color-mix(in srgb,var(--kc,#888) 20%,transparent)}
.tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}
.tab{padding:7px 2px;border-radius:12px;background:rgba(127,127,127,.12);font-weight:700;font-size:11px;display:flex;flex-direction:column;align-items:center;gap:1px;min-width:0}
.tab b{font-size:20px}
.tab span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tab.on{background:var(--ac,#5b6cff);color:#fff}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:6px 12px;border-radius:999px;background:rgba(127,127,127,.12);font-weight:700;font-size:14px}
.chip.on{background:var(--ac,#5b6cff);color:#fff}
.box{display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:14px;background:rgba(127,127,127,.06)}
.box h3{margin:0;font-size:16px}
.f{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700;color:var(--mu,#666)}
.crow{display:flex;align-items:flex-start;gap:10px;font-size:15px;font-weight:600;cursor:pointer}
.crow small{display:block;font-weight:400;font-size:12px;color:var(--mu,#666)}
.g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.btns{display:flex;flex-wrap:wrap;gap:8px}
.egrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:6px}
.ec{position:relative;aspect-ratio:1;border-radius:12px;background:rgba(127,127,127,.12);display:grid;place-items:center}
.ec .en{font-size:12px;font-weight:800;position:absolute;top:4px;left:6px;color:var(--mu,#666)}
.ec .ee{font-size:26px}
.ec.empty{outline:2px dashed rgba(127,127,127,.35);outline-offset:-2px}
.ec.empty .ee{font-size:18px;opacity:.5}
.ec .es{position:absolute;bottom:3px;right:4px;font-size:10px;display:flex;gap:1px}
.pv{background:#fff3bf;color:#5c4400;border-radius:12px;padding:8px 12px;font-weight:700;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.pv .g{flex:1;min-width:150px}
.thm{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}
.thb{border-radius:12px;border:2px solid transparent;padding:6px;display:flex;flex-direction:column;gap:4px;align-items:center;font-size:12px;font-weight:700;background:rgba(127,127,127,.08)}
.thb.on{border-color:var(--ac,#5b6cff)}
.thb i{display:block;width:100%;height:34px;border-radius:8px;box-shadow:inset 0 0 0 1px rgba(127,127,127,.3)}
.emos{display:flex;flex-wrap:wrap;gap:4px;max-height:132px;overflow-y:auto}
.emos button{width:38px;height:38px;border-radius:10px;background:rgba(127,127,127,.12);font-size:20px}
.pinlock{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px}
.pinlock .le{font-size:46px}
.pinlock input{max-width:220px;text-align:center;letter-spacing:4px}
.yaml{white-space:pre;overflow:auto;font-size:12px;font-family:ui-monospace,Menlo,Consolas,monospace;background:rgba(127,127,127,.1);border-radius:10px;padding:10px;max-height:40vh}
.ak{position:relative;max-width:100%;overflow:hidden;border-radius:var(--ha-card-border-radius,16px);background:var(--akbg);color:var(--aktx);padding:16px;min-height:220px}
.ak>.in{position:relative;z-index:1;display:flex;flex-direction:column;gap:12px}
.akh{display:flex;align-items:center;gap:10px}
.akh .tt{flex:1;font-size:22px;font-weight:900;text-shadow:0 2px 6px rgba(0,0,0,.25);min-width:0}
.aksub{font-size:15px;font-weight:700;opacity:.92}
.akbar{height:10px;border-radius:10px;background:color-mix(in srgb,var(--aktx) 20%,transparent);overflow:hidden}
.akbar i{display:block;height:100%;background:var(--akac);border-radius:10px;transition:width .5s}
.ktabs{display:flex;gap:8px;flex-wrap:wrap}
.ktab{display:flex;align-items:center;gap:6px;padding:4px 12px 4px 4px;border-radius:999px;background:color-mix(in srgb,var(--aktx) 15%,transparent);font-weight:800}
.ktab span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--kc);font-size:18px}
.ktab.on{background:var(--akac);color:#222}
.akbtn{padding:8px 14px;border-radius:12px;background:color-mix(in srgb,var(--aktx) 15%,transparent);font-weight:800;align-self:flex-start}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--ds),1fr));gap:10px;grid-auto-flow:dense}
.door{position:relative;aspect-ratio:1;border-radius:var(--dr);background:color-mix(in srgb,var(--dc) calc(var(--da) * 100%), rgba(0,0,0,0.2));backdrop-filter:blur(2px);color:#fff;display:grid;place-items:center;box-shadow:0 3px 8px rgba(0,0,0,0.2),inset 0 0 0 1px rgba(255,255,255,0.25);transition:transform .15s}
.door .num{font-family:var(--df);font-size:calc(var(--ds) * .42);font-weight:900;line-height:1;text-shadow:0 2px 5px rgba(0,0,0,0.7)}
.door.big{grid-column:span 2;grid-row:span 2}
.door.big .num{font-size:calc(var(--ds) * .82)}
.door.gift{background:linear-gradient(color-mix(in srgb,var(--akac) calc(var(--da) * 150%),transparent),color-mix(in srgb,var(--akac) calc(var(--da) * 150%),transparent)) center/14% 100% no-repeat,linear-gradient(color-mix(in srgb,var(--akac) calc(var(--da) * 150%),transparent),color-mix(in srgb,var(--akac) calc(var(--da) * 150%),transparent)) center/100% 14% no-repeat,color-mix(in srgb,var(--dc) calc(var(--da) * 100%),rgba(0,0,0,0.2))}
.door.gift .num{background:color-mix(in srgb,var(--dc) 50%,rgba(0,0,0,0.4));border-radius:50%;padding:.12em .28em}
.door.locked{opacity:.5}
.door .lk{position:absolute;bottom:4px;right:6px;font-size:12px}
.door.today{box-shadow:0 0 0 3px var(--akac),0 0 18px var(--akac);animation:akpulse 1.8s ease-in-out infinite}
.door.miss{opacity:.7}
.door.open{background:color-mix(in srgb,var(--dc) calc(var(--da) * 50%),rgba(0,0,0,0.15));box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--dc) 50%,transparent)}
.door.open .num{position:absolute;top:5px;left:8px;font-size:13px;background:none;padding:0}
.door.open .de{font-size:calc(var(--ds) * .46)}
.door.big.open .de{font-size:calc(var(--ds) * .95)}
.door.opening.flip{animation:akflip .7s ease-in forwards;transform-origin:left center}
.door.opening.slide{animation:akslide .6s ease-in forwards}
@keyframes akflip{to{transform:perspective(500px) rotateY(-115deg);opacity:.15}}
@keyframes akslide{to{transform:translateY(-45%);opacity:0}}
@keyframes akpulse{50%{box-shadow:0 0 0 3px var(--akac),0 0 30px var(--akac)}}
.snow{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.fl{position:absolute;top:-8%;color:var(--akfl);opacity:.85;animation-name:akfall;animation-timing-function:linear;animation-iteration-count:infinite;text-shadow:0 0 4px rgba(255,255,255,.5)}
@keyframes akfall{from{top:-8%;transform:translateX(0) rotate(0)}to{top:108%;transform:translateX(24px) rotate(360deg)}}
#modal{display:none}#modal.open{display:block}
.mback{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px}
.mbox{background:var(--bg,var(--card-background-color,#fff));color:var(--tx,#222);border-radius:20px;width:min(480px,100%);max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.35);animation:akup .2s}
.mhead{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--ln,#ddd)}
.mhead h3{margin:0;font-size:18px}
.mbody{padding:14px 16px;overflow:auto;display:flex;flex-direction:column;gap:10px}
.mbody>*{flex-shrink:0}
.mfoot{display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--ln,#ddd);flex-wrap:wrap}
.mfoot .d{margin-right:auto}
.rv{text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center;padding:6px 0}
.rv .re{font-size:84px;line-height:1.1;animation:akboing .6s}
.rv .rt{font-size:19px;font-weight:600;white-space:pre-wrap;line-height:1.45}
.rv .rm{font-size:15px;opacity:.9;background:rgba(127,127,127,.12);padding:8px 12px;border-radius:10px}
.rv img{max-width:100%;max-height:50vh;border-radius:14px}
.rv .rp{font-weight:800;color:#e8a400;font-size:17px}
.gal{display:flex;flex-direction:column;gap:8px}
.gi{display:flex;gap:10px;align-items:flex-start;padding:8px;border-radius:12px;background:rgba(127,127,127,.08);text-align:left;width:100%}
.gi .gn{font-weight:900;min-width:26px}
.gi .ge{font-size:26px}
.gi img{width:56px;height:56px;object-fit:cover;border-radius:8px;display:block}
.rimg{display:block;max-width:100%}.rimg:empty{display:none}.rimg.sm{flex:none}
.gi .gt{flex:1;white-space:pre-wrap;font-size:14px;min-width:0}
.tpll{display:flex;flex-direction:column;gap:6px}
.tplh{font-weight:800;font-size:14px;margin-top:8px}
.prev-thumb{width:100%;height:110px;object-fit:cover;border-radius:10px;border:1px solid var(--ln,rgba(127,127,127,.3));margin-top:6px;background:rgba(127,127,127,.08)}
/* Mediathek */
.fmt{display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.45;background:rgba(127,127,127,.08);border-radius:10px;padding:10px}
.upbtn{display:inline-flex;align-items:center;justify-content:center;cursor:pointer;align-self:flex-start}
.upr .g small.bad{color:#c92a2a;font-weight:600}
.upr .g small.wrn{color:#b26a00}
.upr .g small.good{color:#2b8a3e;font-weight:600}
.ic0{font-size:20px;flex:none;width:26px;text-align:center}
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.fcard{display:flex;flex-direction:column;gap:4px;padding:6px;border-radius:12px;background:rgba(127,127,127,.08);min-width:0}
.fcard img,.fcard .fph{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;background:rgba(127,127,127,.12);display:grid;place-items:center}
.fcard .fn{font-weight:700;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fcard .hint{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fcard .btns{gap:4px}
details.adv summary{cursor:pointer;font-size:13px;color:var(--mu,#666);font-weight:600}
details.adv[open]{display:flex;flex-direction:column;gap:6px}
/* Bunt gemusterte Türchen */
.door.tile{border-radius:6px;backdrop-filter:none;overflow:visible;background:${C_R};box-shadow:0 4px 10px rgba(0,0,0,.35)}
.door.tile .num{font-size:calc(var(--ds) * .44);text-shadow:none;color:#fff;letter-spacing:-.02em}
.door.tile.big .num{font-size:calc(var(--ds) * .86)}
.door.tile.t1 .num,.door.tile.t2 .num,.door.tile.t5 .num,.door.tile.t6 .num{width:1.5em;height:1.5em;border-radius:50%;display:grid;place-items:center;box-shadow:0 2px 4px rgba(0,0,0,.25)}
.door.tile.t0{background:${svgUrl(SV_FLAKE('#fff'))} left 7% top 7%/26% no-repeat,${svgUrl(SV_FLAKE('#fff'))} right 7% bottom 7%/26% no-repeat,${C_R};box-shadow:inset 0 0 0 5px ${C_R},inset 0 0 0 6.5px rgba(255,255,255,.85),0 4px 10px rgba(0,0,0,.35)}
.door.tile.t1{background:repeating-linear-gradient(45deg,${C_R} 0 7px,${C_W} 7px 14px)}
.door.tile.t1 .num{background:${C_W};color:${C_R}}
.door.tile.t2{background:radial-gradient(rgba(255,255,255,.4) 17%,transparent 19%) 0 0/12px 12px,${C_G}}
.door.tile.t2 .num{background:${C_W};color:${C_D}}
.door.tile.t3{background:${svgUrl(SV_TREE(C_G))} 0 0/33.3% 33.3%,${C_D}}
.door.tile.t3 .num{background:${C_D};padding:.04em .22em;border-radius:8px}
.door.tile.t4{background:${C_W};box-shadow:inset 0 0 0 4px ${C_W},inset 0 0 0 5.5px ${C_G},inset 0 0 0 8px ${C_W},inset 0 0 0 9px ${C_G},0 4px 10px rgba(0,0,0,.35)}
.door.tile.t4 .num{color:${C_R}}
.door.tile.t5{background:radial-gradient(rgba(255,255,255,.9) 14%,transparent 16%) 0 0/14px 14px,radial-gradient(rgba(255,255,255,.9) 14%,transparent 16%) 7px 7px/14px 14px,${C_R}}
.door.tile.t5 .num{background:${C_R};color:#fff;box-shadow:0 0 0 3px #fff}
.door.tile.t6{background:linear-gradient(${C_W},${C_W}) center/14% 100% no-repeat,linear-gradient(${C_W},${C_W}) center/100% 14% no-repeat,${C_G}}
.door.tile.t6 .num{background:${C_R};color:#fff}
.door.tile.t7{background:${svgUrl(SV_FLAKE('#fff', 0.35))} 0 0/50% 50%,${C_D}}
.door.tile.t7 .num{color:${C_G};background:${C_D};padding:.04em .22em;border-radius:8px}
.door.tile.t8{background:${svgUrl(SV_TREE(C_N))} left 9% bottom 7%/24% auto no-repeat,${svgUrl(SV_TREE(C_R))} right 9% bottom 7%/24% auto no-repeat,${svgUrl(SV_STAR(C_G))} center top 6%/18% auto no-repeat,${C_W}}
.door.tile.t8 .num{color:${C_R}}
.door.tile.t9{background:${svgUrl(SV_STAR(C_G))} 0 0/33.3% 33.3%,${C_N}}
.door.tile.t9 .num{background:${C_N};padding:.04em .22em;border-radius:8px}
.door.tile.open{background:linear-gradient(145deg,#c9ccd3,#a6abb6);box-shadow:inset 0 0 0 3px rgba(255,255,255,.45),0 3px 8px rgba(0,0,0,.3)}
.door.tile.open .num{color:#555b66;width:auto;height:auto;background:none;box-shadow:none;padding:0}
.door.tile.locked{opacity:1}
.door.tile .lk{bottom:2px;right:4px;font-size:11px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.5))}
.door.tile.today{animation:none}
.door.tile.today::after{content:'';position:absolute;inset:-5px;border-radius:9px;box-shadow:0 0 0 3px var(--akac),0 0 18px var(--akac);animation:akpulse2 1.8s ease-in-out infinite;pointer-events:none}
@keyframes akpulse2{50%{box-shadow:0 0 0 3px var(--akac),0 0 32px var(--akac)}}
.door.tile.miss{opacity:.75}
.bdg{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:900;color:#fff;box-shadow:0 1px 3px rgba(0,0,0,.4);z-index:2}
.bdg.ok{background:#2f9e44}
.bdg.no{background:#e03131}
/* Deko-Szene */
.ak.deco{padding-top:58px}
.ak.deco::before{content:'';position:absolute;inset:0;background-image:${SKY};background-size:150px 150px;opacity:.8;pointer-events:none;z-index:0}
.ak.deco>.in{padding-bottom:78px}
.garl{position:absolute;top:0;left:0;right:0;height:90px;pointer-events:none;z-index:0}
.hang{position:absolute;top:0;display:flex;flex-direction:column;align-items:center;transform:translateX(-50%);transform-origin:top center;animation:aksway 3.6s ease-in-out infinite alternate}
.hang i{display:block;width:1px;background:rgba(255,255,255,.55)}
.hang svg{display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
@keyframes aksway{from{transform:translateX(-50%) rotate(-5deg)}to{transform:translateX(-50%) rotate(5deg)}}
.land{position:absolute;left:0;right:0;bottom:0;height:112px;pointer-events:none;z-index:0}
.land .hills{position:absolute;left:0;bottom:0;width:100%;height:100%}
.land .dl,.land .dr{position:absolute;bottom:6px;display:flex;align-items:flex-end;gap:2px}
.land .dl{left:6px}.land .dr{right:6px}
.land svg{flex:none}
.ak.deco .akh{justify-content:center;text-align:center}
.ak.deco .akh .tt{font-family:"Dancing Script","Brush Script MT","Segoe Script",cursive;font-size:clamp(28px,9vw,38px);font-weight:700;line-height:1.05;flex:0 1 auto;min-width:0;overflow-wrap:anywhere;text-shadow:0 2px 8px rgba(0,0,0,.4)}
.ak.deco .aksub,.ak.deco .greet,.ak.deco .greet2{text-align:center}
.ak.deco .ktabs{justify-content:center}
.ak.deco .akbar{max-width:420px;margin:0 auto;width:100%}
.ak.deco .grid{max-width:calc(var(--ds) * 6 + 60px);margin:0 auto;width:100%}
.ak.deco .akbtn{align-self:center}
.greet{font-size:15px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
.greet2{font-size:13px;font-weight:600;opacity:.85;margin-top:-8px}
@keyframes akup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes akboing{0%{transform:scale(.3)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
#fx{position:fixed;inset:0;pointer-events:none;z-index:9500;overflow:hidden}
.cf{position:fixed;top:-30px;font-size:24px;animation:akcf linear forwards}
@keyframes akcf{to{transform:translateY(110vh) rotate(540deg)}}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#222;color:#fff;padding:12px 18px;border-radius:14px;font-weight:600;max-width:90%;text-align:center;z-index:9600;animation:akup .2s}
.toast.warn{background:#c92a2a;color:#fff}
`;

  // ======================================================================
  // 🎄 Adventskalender als Teil von Yippee: läuft in der Yippee-Karte (host)
  // und speichert in derselben Liste (kp|adc|main, kp|adk|<Kind>, kp|ado|<Kind>)
  // ======================================================================
  class YippeeAdvent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._tmp = {};
      this._urls = {};
      this._lib = null;
      this._up = null;
      this._mode = 'kid';
      try { this._tab = localStorage.getItem('kpAdvTab') || 'doors'; this._selKid = localStorage.getItem('kpAdvSel') || ''; } catch (e) { this._tab = 'doors'; this._selKid = ''; }
      if (!['doors', 'look', 'files', 'set'].includes(this._tab)) this._tab = 'doors';
      this._build();
    }

    // Wird von Yippee bei jedem Neuzeichnen aufgerufen: mode = 'admin' | 'kid' | 'kids'
    attach(host, mode, kidId) {
      const ch = this.host !== host || this._mode !== mode || this._kidId !== (kidId || '');
      this.host = host; this._mode = mode; this._kidId = kidId || '';
      if (ch) { this._prev = false; this._tmp = {}; if (mode !== 'admin') this._closeModal(); }
      this._render();
    }
    update() { this._render(); }

    get _hass() { return this.host && this.host._hass; }
    get _config() { return { storage: (this.host && this.host._config && this.host._config.storage) || '', mode: this._mode }; }

    connectedCallback() {
      clearInterval(this._timer);
      this._dayKey = `${dk(this._now())}|${this._day(this._now())}`;
      this._timer = setInterval(() => this._tick(), 1000);
    }
    disconnectedCallback() { clearInterval(this._timer); }

    _tick() {
      if (!this.host) return;
      const nowKey = `${dk(this._now())}|${this._day(this._now())}`;
      if (nowKey !== this._dayKey) { this._dayKey = nowKey; this._render(); return; }
      if (this._cfg.countdown !== false) {
        const el = this.shadowRoot.querySelector('.akcd');
        if (el) el.textContent = this._countdownText();
      }
    }

    _build() {
      this.shadowRoot.innerHTML = `<style>${CSS}</style><div id="app"></div><div id="modal"></div><div id="fx"></div>`;
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      this.shadowRoot.addEventListener('change', (e) => this._change(e));
      // Bild-Vorschau live beim Tippen aktualisieren
      this.shadowRoot.addEventListener('input', (e) => {
        const nm = e.target.name;
        if (this._m && (nm === 'img' || nm === 'bgImg')) {
          clearTimeout(this._thTm);
          this._thTm = setTimeout(() => this._setThumb(String(e.target.value || '').trim()), 400);
        }
      });
      this.shadowRoot.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.shadowRoot.getElementById('modal').classList.contains('open')) this._closeModal();
      });
    }

    // ---------- Daten (alles liegt in der Yippee-Liste) ----------
    get _db() {
      const d = (this.host && this.host._db) || {};
      return { cfg: { main: (d.adc || {}).main }, op: d.ado || {} };
    }
    // Speichern über Yippee: cfg → adc, kid → adk (nur Kalender-Daten des Kindes), op → ado
    _save(ty, id, data, merge) {
      const map = { cfg: 'adc', kid: 'adk', op: 'ado' }, t = map[ty];
      if (!t || !this.host) return;
      const strip = (o) => {
        const x = { ...(o || {}) }; delete x.id;
        if (ty !== 'kid') return x;
        const out = {};
        ['doors', 'perm', 'dev', 'bgImg'].forEach((f) => { if (x[f] !== undefined) out[f] = x[f]; });
        return out;
      };
      this.host._save(t, id, strip(data), merge ? (cur) => strip(merge(cur || {})) : undefined);
    }
    _del(ty, id) { const t = { cfg: 'adc', kid: 'adk', op: 'ado' }[ty]; if (t && this.host) this.host._del(t, id); }

    get _cfg() {
      const c = { ...DEF, ...(this._db.cfg.main || {}) }; delete c.id;
      if (!c.title) c.title = T('🎄 Adventskalender');
      if (!c.nText) c.nText = T('🎄 Guten Morgen {name}! Türchen {tag} wartet auf dich.');
      return c;
    }
    _setCfg(patch, merge) { const c = { ...this._cfg, ...patch }; this._save('cfg', 'main', c, merge || ((cur) => ({ ...cur, ...patch }))); }
    _setCol(k, v) {
      const col = { ...(this._cfg.col || {}), [k]: v };
      this._setCfg({ col }, (cur) => ({ ...cur, col: { ...((cur && cur.col) || {}), [k]: v } }));
    }

    // ---------- Hilfen ----------
    _admin() { return !!(this._hass && this._hass.user && this._hass.user.is_admin); }
    _N() { return Number(this._cfg.days) === 31 ? 31 : 24; }
    // Kinder kommen aus Yippee – dazu die Kalender-Daten (Türchen, Reihenfolge, Handy, Hintergrund)
    _kids() {
      if (!this.host) return [];
      const ad = this.host._db.adk || {};
      return this.host._kids().map((k) => ({ ...(ad[k.id] || {}), id: k.id, name: k.name, emoji: k.emoji, color: k.color }));
    }
    _kid(id) { return (id && this._kids().find((k) => k.id === id)) || null; }
    _adminKid() { return this._kid(this._ak) || this._kids()[0] || null; }
    _doorOf(k, n) { const d = ((k && k.doors) || {})[n]; return d && typeof d === 'object' ? d : null; }
    _hasContent(d) { return !!(d && (d.e || d.t || d.img || d.msg)); }
    _testKey() { return `kpAdvTest:${this._config.storage}`; }
    _testDate() { try { const v = localStorage.getItem(this._testKey()) || ''; return /^\d{4}-\d\d-\d\d$/.test(v) ? v : ''; } catch (e) { return ''; } }
    _now() {
      const t = this._testDate();
      if (!t) return new Date();
      const n = new Date(), [y, m, d] = t.split('-').map(Number);
      return new Date(y, m - 1, d, n.getHours(), n.getMinutes(), n.getSeconds());
    }
    _season(d) { return d.getMonth() <= 1 ? d.getFullYear() - 1 : d.getFullYear(); }
    _openMin() { const [h, m] = String(this._cfg.openTime || '00:00').split(':').map(Number); return (h || 0) * 60 + (m || 0); }
    // Tag, bis zu dem Türchen offen sein dürfen: 0 = Advent noch nicht begonnen, 99 = vorbei (Jan/Feb)
    _day(now) {
      const m = now.getMonth();
      if (m === 11) return now.getHours() * 60 + now.getMinutes() < this._openMin() ? now.getDate() - 1 : now.getDate();
      return m <= 1 ? 99 : 0;
    }
    _sim() { return !!this._testDate() || !!this._prev; }
    _opRec(k) { const o = (this._db.op || {})[k.id], y = this._season(new Date()); return o && o.y === y ? { y, d: o.d || {}, b: o.b || {} } : { y, d: {}, b: {} }; }
    _isOpen(k, n) { if (this._sim()) return !!(this._tmp[k.id] && this._tmp[k.id].has(n)); return !!this._opRec(k).d[n]; }

    _perm(k) {
      const N = this._N(), p = k.perm;
      if (Array.isArray(p) && p.length === N && new Set(p).size === N && p.every((x) => x >= 1 && x <= N)) return p;
      return shuffle(Array.from({ length: N }, (_, i) => i + 1), rng(hsh(`${k.id}:${N}`)));
    }

    _theme() {
      const c = this._cfg;
      if (c.theme === 'custom') {
        const col = c.col || {}, bg = HEX(col.bg) || '#173a66';
        return { bg: `linear-gradient(165deg,${bg} 0%,${HEX(col.bg2) || bg} 100%)`, door: HEX(col.door) || '#2f6fb3', text: HEX(col.text) || '#ffffff', accent: HEX(col.accent) || '#ffd43b', fl: HEX(col.fl) || '#ffffff' };
      }
      return THEMES[c.theme] || THEMES.nacht;
    }

    _notifySvcs() { return Object.keys((this._hass && this._hass.services && this._hass.services.notify) || {}).filter((s) => !['notify', 'persistent_notification', 'send_message'].includes(s)).sort(); }

    // ---------- Yippee-Daten ----------
    _tasksFor(k) { return Object.values(this.host._db.task || {}).filter((t) => !t.virtual && (t.kids || []).includes(k.id)).sort((a, b) => String(a.title).localeCompare(String(b.title))); }
    _rewardsFor(k) { return Object.values(this.host._db.reward || {}).filter((r) => this.host._rwFor(r, k.id)).sort((a, b) => (!!b.adv - !!a.adv) || String(a.title).localeCompare(String(b.title))); }

    // Bedingung fürs Öffnen: bestimmte Aufgabe heute erledigt oder mindestens X Aufgaben
    _cond(k, d) {
      const c = d && d.cond;
      if (!c || !c.t || !this.host) return { ok: true };
      const today = dk(new Date()), good = (v) => v === 'd' || (this._cfg.yPend && v === 'p');
      const st = (id) => this.host._st(today, id, k.id);
      if (c.t === 'task') {
        const t = this.host._db.task[c.id];
        if (!t) return { ok: true }; // Aufgabe gibt es nicht mehr → nicht sperren
        const ids = [c.id, ...Object.keys(this.host._db.task).filter((x) => x.startsWith(`${c.id}-`))];
        if (ids.some((x) => good(st(x)))) return { ok: true };
        return { ok: false, msg: T('🔒 Erst „{title}“ erledigen – dann geht das Türchen auf!', { title: t.title }) };
      }
      if (c.t === 'min') {
        const n = Math.max(1, Number(c.n) || 1);
        const hits = this.host._todayTasks(k.id).filter((t) => good(this.host._status(t, k.id).s)).length;
        return hits >= n ? { ok: true } : { ok: false, msg: n === 1 ? T('🔒 Erst 1 Aufgabe erledigen – geschafft: {done}', { done: hits }) : T('🔒 Erst {n} Aufgaben erledigen – geschafft: {done}', { n, done: hits }) };
      }
      return { ok: true };
    }

    // Sterne und Geschenk direkt in Yippee buchen (feste Buchungsnummer: kein doppeltes Buchen auf zwei Geräten)
    _book(k, n, d) {
      const y = this._season(new Date()), p = Math.max(-100, Math.min(100, Math.round(Number(d && d.pts) || 0)));
      let any = false;
      if (p) { this.host._addPoints(k.id, p, T('🎄 Adventskalender Türchen {n}', { n }), null, `adv${y % 100}${pad(n)}p${k.id}`.slice(0, 40)); any = true; }
      if (d && d.rwd && this.host._db.reward[d.rwd]) { this.host._advGift(k.id, d.rwd, n, `adv${y % 100}${pad(n)}r${k.id}`.slice(0, 40)); any = true; }
      return any;
    }

    // ---------- Dateien: Mediathek (HA-Medienordner /media/advent) ----------
    // Mediathek-Dateien brauchen eine signierte URL von Home Assistant
    _url(ref) {
      if (!ref) return '';
      if (IMG_RX.test(ref) || AUDIO_RX.test(ref)) return ref;
      if (!MS_RX.test(ref) || !this._hass) return '';
      const u = this._urls[ref];
      if (!u) this._resolve(ref);
      else if (!u.p && (u.url ? Date.now() - u.t > 20 * 3600e3 : Date.now() - u.t > 600e3)) this._resolve(ref);
      return (u && u.url) || '';
    }
    _urlErr(ref) { const u = this._urls[ref]; return !!(u && u.err && !u.p); }

    // Fehlt die Datei? true = fehlt, false = vorhanden, undefined = noch unbekannt
    _missing(ref) {
      if (!ref) return false;
      if (MS_RX.test(ref)) {
        if (this._lib && !this._lib.err) return ![...this._lib.img, ...this._lib.snd].some((x) => x.id === ref);
        return this._urlErr(ref) ? true : undefined;
      }
      if (!/^\/local\//.test(ref)) return false; // fremde https-Adressen nicht prüfen
      this._probes = this._probes || {};
      const pr = this._probes[ref];
      if (pr && Date.now() - pr.t < 600e3) return pr.miss;
      if (!pr || !pr.p) {
        this._probes[ref] = { p: true, t: pr ? pr.t : 0, miss: pr ? pr.miss : undefined };
        fetch(ref, { method: 'HEAD', cache: 'no-store' })
          .then((r) => { this._probes[ref] = { t: Date.now(), miss: r.status === 404 }; })
          .catch(() => { this._probes[ref] = { t: Date.now(), miss: undefined }; })
          .finally(() => { clearTimeout(this._prTm); this._prTm = setTimeout(() => this._render(), 60); });
      }
      return pr ? pr.miss : undefined;
    }

    // Alle verwendeten Dateien (Hintergründe, Türchen-Bilder, Ton)
    _refs() {
      const c = this._cfg, out = [];
      if (c.bgImg) out.push({ ref: c.bgImg, where: T('Hintergrund für alle') });
      if (c.soundType === 'file' && c.soundFile) out.push({ ref: c.soundFile, where: T('Ton beim Öffnen') });
      this._kids().forEach((k) => {
        if (k.bgImg) out.push({ ref: k.bgImg, where: T('Hintergrund von {name}', { name: k.name }) });
        Object.entries(k.doors || {}).forEach(([n, d]) => { if (d && d.img) out.push({ ref: d.img, where: T('Türchen {n} von {name}', { n, name: k.name }) }); });
      });
      return out;
    }

    _cleanMissing() {
      const miss = new Set(this._refs().filter((r) => this._missing(r.ref) === true).map((r) => r.ref));
      if (!miss.size) { this._toast(T('Keine fehlenden Dateien gefunden')); return; }
      const c = this._cfg, patch = {};
      if (miss.has(c.bgImg)) patch.bgImg = '';
      if (miss.has(c.soundFile)) { patch.soundFile = ''; if (c.soundType === 'file') patch.soundType = 'bells'; }
      if (Object.keys(patch).length) this._setCfg(patch);
      let n = Object.keys(patch).length;
      this._kids().forEach((k) => {
        const fix = (cur) => { const d = { ...(cur.doors || {}) }; Object.keys(d).forEach((x) => { if (d[x] && miss.has(d[x].img)) d[x] = { ...d[x], img: '' }; }); return { ...cur, doors: d, bgImg: miss.has(cur.bgImg) ? '' : cur.bgImg }; };
        const cnt = (miss.has(k.bgImg) ? 1 : 0) + Object.values(k.doors || {}).filter((d) => d && miss.has(d.img)).length;
        if (cnt) { n += cnt; this._save('kid', k.id, fix(k), fix); }
      });
      this._toast(n === 1 ? T('🧹 1 Verweis auf fehlende Dateien entfernt') : T('🧹 {n} Verweise auf fehlende Dateien entfernt', { n }));
      this._render();
    }
    _resolve(ref) {
      const prev = this._urls[ref] || {};
      this._urls[ref] = { ...prev, p: true, t: prev.t || 0 };
      this._hass.callWS({ type: 'media_source/resolve_media', media_content_id: ref, expires: 7 * 86400 })
        .then((r) => { this._urls[ref] = { url: (r && r.url) || '', err: !(r && r.url), t: Date.now() }; })
        .catch(() => { this._urls[ref] = { url: '', err: true, t: Date.now() }; })
        .finally(() => this._afterResolve(ref));
    }
    _afterResolve(ref) {
      this.shadowRoot.querySelectorAll('.thumbw').forEach((tw) => { if (tw.dataset.ref === ref) tw.innerHTML = this._thumbInner(ref); });
      this.shadowRoot.querySelectorAll('.rimg').forEach((x) => { if (x.dataset.ref === ref) x.innerHTML = this._rimgInner(ref); });
      clearTimeout(this._rsTm);
      this._rsTm = setTimeout(() => this._render(), 60);
    }

    async _libLoad(force) {
      if (this._libBusy || (!force && this._lib) || !this._hass) return;
      this._libBusy = true;
      try {
        const r = await this._hass.callWS({ type: 'media_source/browse_media', media_content_id: MEDIA_ROOT });
        const ch = ((r && r.children) || []).filter((x) => x && x.can_play && x.media_content_id);
        const map = (rx) => ch.filter((x) => rx.test(x.title || '')).map((x) => ({ id: x.media_content_id, name: x.title })).sort((a, b) => a.name.localeCompare(b.name));
        this._lib = { img: map(/\.jpe?g$/i), snd: map(/\.mp3$/i), err: '' };
      } catch (e) {
        const m = errMsg(e);
        // Ordner gibt es noch nicht → wird beim ersten Hochladen angelegt
        this._lib = { img: [], snd: [], err: /path does not exist/i.test(m) ? '' : (/media directory/i.test(m) ? T('Home Assistant hat keinen Medien-Ordner. Hochladen ist daher nicht möglich.') : m) };
      }
      this._libBusy = false;
      this._render();
    }

    _opts(list, cur, emptyLabel, icon) {
      const opts = [['', emptyLabel]];
      list.forEach((x) => opts.push([x.id, `${icon} ${x.name}`]));
      if (cur && !opts.some((o) => o[0] === cur)) {
        const gone = this._missing(cur) === true;
        opts.push([cur, `${gone ? '⚠️' : icon} ${fileName(cur)}${gone ? ` ${T('(nicht gefunden)')}` : (MS_RX.test(cur) ? '' : ` ${T('(eigener Pfad)')}`)}`]);
      }
      return opts.map(([o, l]) => `<option value="${esc(o)}" ${o === cur ? 'selected' : ''}>${esc(l)}</option>`).join('');
    }
    _imgOpts(cur, emptyLabel) { return this._opts((this._lib && this._lib.img) || [], cur, emptyLabel, '🖼️'); }
    _sndOpts(cur) { return this._opts((this._lib && this._lib.snd) || [], cur, T('– Datei wählen –'), '🎵'); }

    _thumbHtml(ref) { return `<div class="thumbw" data-ref="${esc(ref || '')}">${this._thumbInner(ref)}</div>`; }
    _thumbInner(ref) {
      if (!ref) return '';
      if (!isImgRef(ref)) return `<div class="hint warn">${T('⚠️ Ungültiger Bildpfad – erlaubt sind JPG-Dateien aus 📁 Dateien oder /local/…')}</div>`;
      const u = this._url(ref);
      if (!u) return this._urlErr(ref) ? `<div class="hint warn">${T('⚠️ Bild nicht gefunden – wurde es gelöscht?')}</div>` : `<div class="hint">${T('⏳ Lade Vorschau …')}</div>`;
      return `<img src="${esc(u)}" class="prev-thumb" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="hint warn" hidden>${T('⚠️ Bild nicht gefunden – Pfad und Dateinamen prüfen (Groß-/Kleinschreibung zählt). Bei /local/…: Datei muss in config/www liegen; nach dem ersten Anlegen von www Home Assistant neu starten.')}</div>`;
    }
    // Bild im Türchen / in der Galerie: fehlt die Datei, wird nichts angezeigt
    _rimg(ref, small) { return `<span class="rimg${small ? ' sm' : ''}" data-ref="${esc(ref)}">${this._rimgInner(ref)}</span>`; }
    _rimgInner(ref) { const u = this._url(ref); return u ? `<img src="${esc(u)}" alt="" onerror="this.parentNode.hidden=true">` : ''; }
    _setThumb(ref) { const tw = this.shadowRoot.querySelector('#modal .thumbw'); if (tw) { tw.dataset.ref = ref || ''; tw.innerHTML = this._thumbInner(ref); } }

    _usage(id) {
      const c = this._cfg, out = [];
      if (c.bgImg === id) out.push(T('Hintergrund für alle'));
      if (c.soundType === 'file' && c.soundFile === id) out.push(T('Ton beim Öffnen'));
      this._kids().forEach((k) => {
        if (k.bgImg === id) out.push(T('Hintergrund von {name}', { name: k.name }));
        Object.entries(k.doors || {}).forEach(([n, d]) => { if (d && d.img === id) out.push(T('Türchen {n} von {name}', { n, name: k.name })); });
      });
      return out;
    }

    _safeName(n, kind) {
      const base = String(n || '').replace(/\.[^.]*$/, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').replace(/ß/g, 'ss')
        .replace(/[^A-Za-z0-9_-]+/g, '_').replace(/_+/g, '_').replace(/^[_-]+|[_-]+$/g, '').slice(0, 60) || 'datei';
      return `${base}.${kind === 'snd' ? 'mp3' : 'jpg'}`;
    }

    _sniff(b) {
      const s4 = String.fromCharCode(...b.slice(0, 4)), s8 = String.fromCharCode(...b.slice(8, 12)), ft = String.fromCharCode(...b.slice(4, 8)), br = String.fromCharCode(...b.slice(8, 12));
      if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
      if (s4 === '\x89PNG') return 'png';
      if (s4.startsWith('GIF')) return 'gif';
      if (s4 === 'RIFF' && s8 === 'WEBP') return 'webp';
      if (s4 === 'RIFF' && s8 === 'WAVE') return 'wav';
      if (s4.startsWith('BM')) return 'bmp';
      if (s4 === 'OggS') return 'ogg';
      if (s4 === 'fLaC') return 'flac';
      if (ft === 'ftyp') return /^(heic|heix|hevc|mif1|msf1)/.test(br) ? 'heic' : (/^M4A/.test(br) ? 'm4a' : 'mp4');
      if (s4.startsWith('ID3')) return 'mp3';
      if (b[0] === 0xff && (b[1] & 0xe0) === 0xe0 && ((b[1] >> 1) & 3) === 1) return 'mp3';
      if (b[0] === 0xff && (b[1] & 0xf6) === 0xf0) return 'aac';
      return '?';
    }

    async _checkFile(f) {
      const r = { st: 'done', ok: false, kind: '', info: '', warn: [], err: '' };
      const LBL = { png: 'PNG', gif: 'GIF', webp: 'WebP', bmp: 'BMP', heic: 'HEIC', wav: 'WAV', ogg: 'OGG', flac: 'FLAC', m4a: 'M4A', aac: 'AAC', mp4: 'MP4' };
      let head;
      try { head = new Uint8Array(await f.slice(0, 16).arrayBuffer()); } catch (e) { r.err = T('Datei konnte nicht gelesen werden'); return r; }
      const sig = this._sniff(head), ext = ((f.name.match(/\.([^.]+)$/) || [])[1] || '').toLowerCase();
      if (sig === '?') { r.err = T('Unbekanntes Format – erlaubt sind nur JPG-Bilder und MP3-Töne'); return r; }
      if (sig !== 'jpg' && sig !== 'mp3') {
        const img = ['png', 'gif', 'webp', 'bmp', 'heic'].includes(sig);
        r.err = img ? T('{fmt}-Bilder sind nicht erlaubt – bitte als JPG speichern', { fmt: LBL[sig] }) : (sig === 'mp4' ? T('Videos sind nicht erlaubt – nur JPG-Bilder und MP3-Töne') : T('{fmt}-Töne sind nicht erlaubt – bitte in MP3 umwandeln', { fmt: LBL[sig] }));
        return r;
      }
      r.kind = sig === 'jpg' ? 'img' : 'snd';
      if ((r.kind === 'img' && !['jpg', 'jpeg'].includes(ext)) || (r.kind === 'snd' && ext !== 'mp3')) r.warn.push(T('Endung „.{ext}“ passt nicht zum Inhalt – wird als .{to} gespeichert', { ext: ext || '?', to: r.kind === 'img' ? 'jpg' : 'mp3' }));
      if (f.size > MAX_UP) { r.err = T('Zu groß ({size}) – höchstens 20 MB', { size: fmtSize(f.size) }); return r; }
      const url = URL.createObjectURL(f);
      try {
        if (r.kind === 'img') {
          const dim = await new Promise((res, rej) => { const im = new Image(); const to = setTimeout(() => rej(new Error('t')), 10000); im.onload = () => { clearTimeout(to); res([im.naturalWidth, im.naturalHeight]); }; im.onerror = () => { clearTimeout(to); rej(new Error('e')); }; im.src = url; });
          const [w, h] = dim, mn = Math.min(w, h), mx = Math.max(w, h);
          r.info = `JPG · ${w} × ${h} px · ${w === h ? T('quadratisch') : (h > w ? T('Hochformat') : T('Querformat'))} · ${fmtSize(f.size)}`;
          if (mn < 600) r.warn.push(T('Sehr klein – wirkt auf dem Tablet unscharf (empfohlen mind. 1080 px an der kurzen Seite)'));
          else if (mx < 1600) r.warn.push(T('Für einen Hintergrund etwas klein (empfohlen 1080 × 1920 oder 1920 × 1080) – als Türchen-Bild reicht es'));
          if (mx > 4000) r.warn.push(T('Sehr hohe Auflösung – 1920 px reichen, kleinere Dateien laden schneller'));
          if (f.size > 5 * 1048576) r.warn.push(T('Datei sehr groß – lädt auf dem Handy langsam (empfohlen unter 2 MB)'));
        } else {
          const dur = await new Promise((res, rej) => { const a = new Audio(); const to = setTimeout(() => rej(new Error('t')), 10000); a.preload = 'metadata'; a.onloadedmetadata = () => { clearTimeout(to); res(a.duration); }; a.onerror = () => { clearTimeout(to); rej(new Error('e')); }; a.src = url; });
          r.info = `MP3 · ${isFinite(dur) ? T('{n} Sek.', { n: dur.toFixed(1).replace('.', ',') }) : T('Länge unbekannt')} · ${fmtSize(f.size)}`;
          if (isFinite(dur) && dur > 15) r.warn.push(T('Recht lang – beim Öffnen spielt der ganze Ton (empfohlen 1–5 Sekunden)'));
          if (f.size > 2 * 1048576) r.warn.push(T('Datei groß – für einen kurzen Ton reichen meist unter 500 KB'));
        }
        r.ok = true;
      } catch (e) {
        r.err = r.kind === 'img' ? T('Bild ist beschädigt oder lässt sich nicht öffnen') : T('MP3 ist beschädigt oder lässt sich nicht abspielen');
      } finally { URL.revokeObjectURL(url); }
      return r;
    }

    async _pick(fileList) {
      const files = [...(fileList || [])].slice(0, 20);
      if (!files.length) return;
      this._up = files.map((f) => ({ f, name: f.name, st: 'check', warn: [] }));
      this._render();
      for (const u of this._up) { Object.assign(u, await this._checkFile(u.f)); if (u.kind) u.name = this._safeName(u.f.name, u.kind); }
      const exist = new Set([...((this._lib && this._lib.img) || []), ...((this._lib && this._lib.snd) || [])].map((x) => x.name.toLowerCase()));
      const seen = new Set();
      this._up.forEach((u) => {
        if (!u.ok) return;
        const nm = u.name.toLowerCase();
        if (seen.has(nm)) { u.ok = false; u.err = T('Gleicher Dateiname wie eine andere ausgewählte Datei'); return; }
        seen.add(nm);
        if (exist.has(nm)) u.warn.push(T('Eine Datei mit diesem Namen gibt es schon – sie wird ersetzt'));
      });
      this._render();
    }

    // Hochladen: nur für Administratoren (die Karte ruft den Dienst für andere gar nicht erst auf)
    async _upload() {
      if (!this._admin()) return;
      const list = (this._up || []).filter((u) => u.ok && u.st !== 'ok');
      if (!list.length || this._upBusy) return;
      this._upBusy = true;
      let okN = 0;
      for (const u of list) {
        u.st = 'up'; this._render();
        try {
          const fd = new FormData();
          fd.append('media_content_id', MEDIA_ROOT);
          fd.append('file', new File([u.f], u.name, { type: u.kind === 'img' ? 'image/jpeg' : 'audio/mpeg' }));
          const path = '/api/media_source/local_source/upload';
          const res = this._hass.fetchWithAuth ? await this._hass.fetchWithAuth(path, { method: 'POST', body: fd })
            : await fetch(path, { method: 'POST', body: fd, headers: { Authorization: `Bearer ${this._hass.auth && this._hass.auth.data && this._hass.auth.data.access_token}` } });
          if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? T('Keine Berechtigung – nur Administratoren dürfen hochladen') : (res.status === 413 ? T('Datei zu groß') : T('Fehler {n} von Home Assistant', { n: res.status })));
          const j = await res.json().catch(() => ({}));
          u.st = 'ok'; u.id = j.media_content_id || `${MEDIA_ROOT}/${u.name}`; okN++;
          delete this._urls[u.id];
        } catch (e) { u.st = 'fail'; u.err = errMsg(e); }
      }
      this._upBusy = false;
      this._toast(okN ? (okN === 1 ? T('⬆️ 1 Datei hochgeladen') : T('⬆️ {n} Dateien hochgeladen', { n: okN })) : T('Hochladen fehlgeschlagen'), !okN);
      await this._libLoad(true);
    }

    async _libDel(id) {
      if (!this._admin()) return;
      try {
        await this._hass.callWS({ type: 'media_source/local_source/remove', media_content_id: id });
        delete this._urls[id];
        // Verweise aufräumen, damit keine kaputten Bilder bleiben
        const c = this._cfg, patch = {};
        if (c.bgImg === id) patch.bgImg = '';
        if (c.soundFile === id) { patch.soundFile = ''; if (c.soundType === 'file') patch.soundType = 'bells'; }
        if (Object.keys(patch).length) this._setCfg(patch);
        this._kids().forEach((k) => {
          const fix = (cur) => { const d = { ...(cur.doors || {}) }; Object.keys(d).forEach((n) => { if (d[n] && d[n].img === id) d[n] = { ...d[n], img: '' }; }); return { ...cur, doors: d, bgImg: cur.bgImg === id ? '' : cur.bgImg }; };
          const hit = k.bgImg === id || Object.values(k.doors || {}).some((d) => d && d.img === id);
          if (hit) this._save('kid', k.id, fix(k), fix);
        });
        this._toast(T('🗑️ {name} gelöscht', { name: fileName(id) }));
      } catch (e) { this._toast(T('Löschen fehlgeschlagen: {err}', { err: errMsg(e) }), true); }
      await this._libLoad(true);
    }

    _tabFiles() {
      const adm = this._admin(), lib = this._lib;
      const ups = this._up || [];
      const upRows = ups.map((u) => {
        const ic = u.st === 'check' ? '⏳' : u.st === 'up' ? '⬆️' : u.st === 'ok' ? '✅' : (u.ok ? (u.warn.length ? '⚠️' : '✔️') : '❌');
        return `<div class="row upr"><span class="ic0">${ic}</span><span class="g">${esc(u.st === 'check' ? u.f.name : u.name)}<small>${u.st === 'check' ? T('wird geprüft …') : esc(u.info || '')}</small>
          ${u.err ? `<small class="bad">✗ ${esc(u.err)}</small>` : ''}${(u.warn || []).map((w) => `<small class="wrn">⚠️ ${esc(w)}</small>`).join('')}${u.st === 'ok' ? `<small class="good">${T('✓ hochgeladen')}</small>` : ''}</span></div>`;
      }).join('');
      const nOk = ups.filter((u) => u.ok && u.st !== 'ok').length, checking = ups.some((u) => u.st === 'check');
      const imgs = (lib && lib.img) || [], snds = (lib && lib.snd) || [];
      const imgCards = imgs.map((x) => {
        const u = this._url(x.id), used = this._usage(x.id);
        return `<div class="fcard">${u ? `<img src="${esc(u)}" alt="" loading="lazy" onload="const d=this.parentNode.querySelector('.dim');if(d)d.textContent=this.naturalWidth+' × '+this.naturalHeight+' px'">` : '<div class="fph">⏳</div>'}
          <div class="fn">${esc(x.name)}</div><div class="hint dim">JPG</div>${used.length ? `<div class="hint ok" title="${esc(used.join(', '))}">✓ ${esc(used[0])}${used.length > 1 ? ` +${used.length - 1}` : ''}</div>` : ''}
          <div class="btns"><button class="btn sm" data-a="libbg" data-id="${esc(x.id)}" title="${esc(T('Als Hintergrund für alle'))}">${T('🖼️ Hintergrund')}</button>${adm ? `<button class="btn sm" data-a="libdel" data-id="${esc(x.id)}">${this._sureKey === `del:${x.id}` ? T('Wirklich?') : '🗑️'}</button>` : ''}</div></div>`;
      }).join('');
      const sndRows = snds.map((x) => {
        const u = this._url(x.id), used = this._usage(x.id);
        return `<div class="row"><span class="ic0">🎵</span><span class="g">${esc(x.name)}<small class="dur">MP3${used.length ? ` · ✓ ${esc(used.join(', '))}` : ''}</small>${u ? `<audio preload="metadata" src="${esc(u)}"></audio>` : ''}</span>
          <button class="ic" data-a="libplay" data-id="${esc(x.id)}" aria-label="${esc(T('Anhören'))}">▶️</button><button class="btn sm" data-a="libsnd" data-id="${esc(x.id)}">${T('🔔 Als Ton')}</button>${adm ? `<button class="ic" data-a="libdel" data-id="${esc(x.id)}" aria-label="${esc(T('Löschen'))}">${this._sureKey === `del:${x.id}` ? '❓' : '🗑️'}</button>` : ''}</div>`;
      }).join('');
      const delWarn = this._sureKey && this._sureKey.startsWith('del:') ? (() => { const id = this._sureKey.slice(4), us = this._usage(id); return `<div class="hint warn">${T('Nochmal tippen zum Löschen von „{name}“.', { name: esc(fileName(id)) })}${us.length ? ` ${T('Wird verwendet bei: {list} – diese Stellen werden geleert.', { list: esc(us.join(', ')) })}` : ''}</div>`; })() : '';
      const bad = this._refs().filter((r) => this._missing(r.ref) === true);
      return `<div class="box"><h3>${T('⬆️ Dateien hochladen')}</h3>
        <div class="fmt"><div>${T('<b>🖼️ Bilder: nur JPG</b> (.jpg / .jpeg), höchstens 20 MB')}<br>${T('Hintergrund: am besten <b>1080 × 1920 px</b> (Hochformat, Handy/Tablet) oder <b>1920 × 1080 px</b> (Querformat)')}<br>${T('Türchen-Bild: am besten <b>1080 × 1080 px</b>, mindestens 600 px')}</div>
        <div>${T('<b>🎵 Töne: nur MP3</b>, höchstens 20 MB')}<br>${T('Am besten kurz: <b>1–5 Sekunden</b>, unter 500 KB')}</div></div>
        ${adm ? `<label class="btn p upbtn">${T('📂 Dateien auswählen')}<input type="file" name="up" accept=".jpg,.jpeg,.mp3,image/jpeg,audio/mpeg" multiple hidden></label>` : `<div class="hint warn">${T('Hochladen und Löschen darf nur ein Administrator.')}</div>`}
        ${upRows}
        ${ups.length ? `<div class="btns">${nOk ? `<button class="btn p" data-a="upgo" ${this._upBusy || checking ? 'disabled' : ''}>${this._upBusy ? T('⏳ Lade hoch …') : (nOk === 1 ? T('⬆️ 1 Datei hochladen') : T('⬆️ {n} Dateien hochladen', { n: nOk }))}</button>` : ''}<button class="btn" data-a="upclr" ${this._upBusy ? 'disabled' : ''}>${ups.every((u) => u.st === 'ok' || !u.ok) && !checking ? T('Fertig') : T('Abbrechen')}</button></div>` : ''}
        <div class="hint">${T('Gespeichert wird in Home Assistant unter <b>Medien → My media → advent</b> (Ordner <code>/media/advent</code>). Der Ordner wird beim ersten Hochladen automatisch angelegt.')}</div></div>
        ${delWarn}
        ${bad.length ? `<div class="box"><h3>${T('🧹 Fehlende Dateien ({n})', { n: bad.length })}</h3><div class="hint warn">${T('Diese Stellen verweisen auf Dateien, die es nicht mehr gibt:')}</div>${bad.map((r) => `<div class="hint">⚠️ ${esc(r.where)}: <code>${esc(fileName(r.ref))}</code></div>`).join('')}<div class="btns"><button class="btn p" data-a="cleanmiss">${T('🧹 Alle entfernen')}</button></div></div>` : ''}
        <div class="box"><h3>${T('🖼️ Bilder ({n})', { n: imgs.length })}</h3>
        ${!lib ? `<div class="hint">${T('⏳ Lade …')}</div>` : (lib.err ? `<div class="hint warn">⚠️ ${esc(lib.err)}</div>` : (imgs.length ? `<div class="fgrid">${imgCards}</div>` : `<div class="hint">${T('Noch keine Bilder hochgeladen.')}</div>`))}</div>
        <div class="box"><h3>${T('🎵 Töne ({n})', { n: snds.length })}</h3>
        ${!lib ? `<div class="hint">${T('⏳ Lade …')}</div>` : (lib.err ? '' : (sndRows || `<div class="hint">${T('Noch keine Töne hochgeladen.')}</div>`))}</div>
        <div class="btns"><button class="btn sm" data-a="librl">${T('🔄 Liste neu laden')}</button></div>`;
    }

    // ---------- Türchen öffnen ----------
    async _door(n) {
      const kids = this._kids(), k = this._curKid(kids);
      if (!k || this._busy) return;
      const c = this._cfg, N = this._N(), now = this._now(), day = this._day(now), fin = day > N;
      if (this._isOpen(k, n)) { this._reveal(k, n, false); return; }
      if (!fin && n > day) {
        if (now.getMonth() === 11 && n === now.getDate()) {
          this._toast(T('🔒 Geduld! Türchen {n} öffnet heute ab {time} Uhr.', { n, time: c.openTime || '00:00' }));
        } else {
          const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const dd = Math.max(1, Math.round((new Date(this._season(now), 11, n) - t0) / 864e5));
          this._toast(dd === 1 ? T('🔒 Nur noch einmal schlafen – Türchen {n} öffnet morgen!', { n }) : T('🔒 Noch {d} Tage – Türchen {n} öffnet am {n}. Dezember', { d: dd, n }));
        }
        return;
      }
      if (!fin && n < day && c.catchUp === false) { this._toast(T('Dieses Türchen ist leider schon vorbei.')); return; }
      const d = this._doorOf(k, n);
      soundUnlock(c.soundType, c.soundType === 'file' ? this._url(c.soundFile) : '');
      this._busy = true;
      try {
        if (!this._sim()) {
          const ok = this._cond(k, d);
          if (!ok.ok) { this._toast(ok.msg); return; }
        }
        const anim = c.anim === 'confetti' ? 'flip' : c.anim;
        const el = this.shadowRoot.querySelector(`.door[data-n="${n}"]`);
        if (el && anim && anim !== 'none') { el.classList.add('opening', anim); await sleep(anim === 'slide' ? 600 : 700); }
        if (this._sim()) (this._tmp[k.id] = this._tmp[k.id] || new Set()).add(n);
        else {
          const book = !this._opRec(k).b[n] && this._book(k, n, d);
          const y = this._season(new Date());
          const upd = (cur) => { const b = cur && cur.y === y ? cur : { y, d: {}, b: {} }; return { y, d: { ...(b.d || {}), [n]: Date.now() }, b: { ...(b.b || {}), ...(book ? { [n]: 1 } : {}) } }; };
          this._save('op', k.id, upd((this._db.op || {})[k.id]), upd);
        }
      } finally { this._busy = false; }
      this._render();
      this._reveal(k, n, true);
    }

    _reveal(k, n, fresh) {
      const c = this._cfg, d = this._doorOf(k, n) || {};
      const has = this._hasContent(d), pts = Math.round(Number(d.pts) || 0);
      const r = d.rwd && this.host._db.reward[d.rwd];
      const body = `<div class="rv"><div class="re">${esc(d.e || '🎁')}</div>${d.t ? `<div class="rt">${esc(d.t)}</div>` : ''}${d.msg ? `<div class="rt rm">💌 ${esc(d.msg)}</div>` : ''}${isImgRef(d.img) ? this._rimg(d.img) : ''}${has ? '' : `<div class="rt">${T('Überraschung! 🎉')}</div>`}${pts ? `<div class="rp">${pts > 0 ? T('+{n} ⭐ für dich!', { n: pts }) : T('−{n} ⭐', { n: -pts })}</div>` : ''}${r ? `<div class="rp">${T('🎁 Geschenk: {title}!', { title: esc(`${r.emoji || '🎁'} ${r.title}`) })}</div>` : ''}</div>`;
      this._m = null;
      this._modal(`${T('🚪 Türchen {n}', { n })}${this._kids().length > 1 ? ` – ${esc(k.name)}` : ''}`, body);
      if (fresh) {
        if (c.anim === 'confetti' || n === this._N() || n === 24) this._burst(n === 24 ? 50 : 30);
        playSound(c.soundType || 'bells', c.soundType === 'file' ? this._url(c.soundFile) : '');
      }
    }

    _gallery(k) {
      const N = this._N(), list = Array.from({ length: N }, (_, i) => i + 1).filter((n) => this._isOpen(k, n));
      this._m = null;
      this._modal(T('🖼️ Meine Türchen – {name}', { name: esc(k.name) }), `<div class="gal">${list.map((n) => {
        const d = this._doorOf(k, n) || {};
        return `<button class="gi" data-a="gopen" data-n="${n}"><span class="gn">${n}</span><span class="ge">${esc(d.e || '🎁')}</span><span class="gt">${esc(d.t || T('Überraschung! 🎉'))}</span>${isImgRef(d.img) ? this._rimg(d.img, true) : ''}</button>`;
      }).join('') || `<div class="hint">${T('Noch kein Türchen geöffnet.')}</div>`}</div>`);
    }

    // ---------- Darstellung ----------
    _render() {
      if (!this.host || !this._hass) return;
      const app = this.shadowRoot.getElementById('app');
      if (!app) return;
      // Nicht neu zeichnen, solange hier gerade etwas eingetippt wird
      const ae = this.shadowRoot.activeElement;
      if (ae && ae.closest && ae.closest('#app') && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && !/^(checkbox|radio|button|file|range|color)$/.test(ae.type || '')) {
        if (!this._deferR) { this._deferR = true; ae.addEventListener('blur', () => { setTimeout(() => { this._deferR = false; this._render(); }, 0); }, { once: true }); }
        return;
      }
      try {
        if (this._mode === 'admin') {
          app.innerHTML = this._prev ? `<div class="adm"><div class="pv"><span class="g">${T('👀 Vorschau wie bei den Kindern – Öffnen wird nicht gespeichert, es gibt keine Sterne.')}</span><button class="btn sm" data-a="prevoff">${T('✕ Zurück')}</button></div>${this._kidView(true)}</div>` : this._adminHtml();
        } else {
          app.innerHTML = this._kidView(false);
        }
      } catch (err) {
        console.error('Yippee Advent:', err);
        app.innerHTML = `<div class="hint warn">⚠️ ${esc(T('Fehler beim Anzeigen: {err}', { err: err.message }))}</div>`;
      }
    }

    _curKid(kids) {
      if (this._mode === 'kid' && !this._prev) return kids.find((x) => x.id === this._kidId) || null;
      return kids.find((x) => x.id === this._selKid) || kids[0] || null;
    }

    _snowHtml() {
      const c = this._cfg;
      if (c.snow === false) return '';
      const sig = [c.snowAmt, c.snowSpd, c.snowFl].join('|');
      if (this._snowSig !== sig) {
        const n = { w: 18, m: 36, v: 64 }[c.snowAmt] || 36, base = { l: 16, n: 10, s: 6 }[c.snowSpd] || 10, gl = FLAKES.includes(c.snowFl) ? c.snowFl : '❄', r = rng(7);
        let h = '';
        for (let i = 0; i < n; i++) {
          const dur = base * (0.7 + r() * 0.8);
          h += `<span class="fl" style="left:${(r() * 100).toFixed(1)}%;font-size:${Math.round(8 + r() * 12)}px;animation-duration:${dur.toFixed(1)}s;animation-delay:-${(r() * dur).toFixed(1)}s">${gl}</span>`;
        }
        this._snowSig = sig; this._snowH = `<div class="snow">${h}</div>`;
      }
      return this._snowH;
    }

    // Türchengröße in Pixeln (Schieberegler); ältere Einstellung klein/mittel/groß wird übernommen
    _doorPx() { const v = Math.round(Number(this._cfg.doorPx)); return v >= 50 && v <= 220 ? v : ({ s: 58, m: 74, l: 96 }[this._cfg.size] || 74); }
    // Türchengröße: „nur dieses Gerät“ (Browser-Speicher) vor „nur diese Karte“ (advent_size im Karten-Editor) vor „für alle“ (⚙️)
    _devKey() { return `kpAdvPx:${this._config.storage}`; }
    _devPx() { try { const v = Math.round(Number(localStorage.getItem(this._devKey()))); return v >= 50 && v <= 220 ? v : 0; } catch (e) { return 0; } }
    _cardPx() { const v = Math.round(Number(this.host && this.host._config && this.host._config.advent_size)); return v >= 50 && v <= 220 ? v : 0; }
    _effPx() { return this._devPx() || this._cardPx() || this._doorPx(); }

    _target() {
      const t = this._cfg.targetDate;
      const d = t ? new Date(t) : null;
      if (d && !isNaN(d)) return d;
      return new Date(this._season(new Date()), 11, 24, 18, 0, 0);
    }

    _countdownText() {
      const diff = this._target().getTime() - Date.now();
      if (diff <= 0) return T('🎄 Frohe Weihnachten! Der große Moment ist da!');
      const days = Math.floor(diff / 864e5), hours = Math.floor((diff % 864e5) / 36e5), minutes = Math.floor((diff % 36e5) / 6e4), seconds = Math.floor((diff % 6e4) / 1000);
      const parts = [];
      if (days > 0) parts.push(days === 1 ? T('1 Tag') : T('{n} Tage', { n: days }));
      if (hours > 0 || days > 0) parts.push(T('{n} Std.', { n: hours }));
      if (minutes > 0 || hours > 0 || days > 0) parts.push(T('{n} Min.', { n: minutes }));
      parts.push(T('{n} Sek.', { n: seconds }));
      return T('⏳ Noch {time}', { time: parts.join(' ') });
    }

    _kidView(preview) {
      const kids = this._kids(), c = this._cfg, N = this._N(), th = this._theme();
      if (!kids.length) return `<div class="hint">${T('Noch keine Kinder angelegt – das geht in der Eltern-Ansicht unter 👧 Kinder.')}</div>`;
      const k = this._curKid(kids);
      if (!k) return `<div class="hint">${T('Kind nicht gefunden.')}</div>`;
      const tile = c.shape === 'tile', deco = c.deco !== false;
      if (tile || deco || c.font === 'fun') loadFonts();
      const day = this._day(this._now()), fin = day > N, dc = c.doorKid !== false ? (HEX(k.color) || th.door) : th.door;
      const opened = Array.from({ length: N }, (_, i) => i + 1).filter((n) => this._isOpen(k, n)).length;
      const off = hsh(String(k.id)) % 10;
      // Bilder und Ton schon vorab auflösen, damit sie beim Öffnen sofort da sind
      Object.values(k.doors || {}).forEach((d) => { if (d && MS_RX.test(d.img || '')) this._url(d.img); });
      if (c.soundType === 'file') this._url(c.soundFile);
      const doors = this._perm(k).map((n) => {
        const op = this._isOpen(k, n), d = this._doorOf(k, n) || {};
        let cls = tile ? 'tile' : (c.shape === 'gift' ? 'gift' : ''), extra = '';
        if (tile && !op) cls += ` t${(n * 7 + off) % 10}`;
        if (op) { cls += ' open'; extra = `<span class="de">${esc(d.e || '🎁')}</span>${tile ? '<span class="bdg ok">✓</span>' : ''}`; }
        else if (fin || n <= day) { if (n === day) cls += ' today'; else if (c.catchUp === false && !fin) { cls += ' miss'; if (tile) extra = '<span class="bdg no">✕</span>'; } }
        else { cls += ' locked'; extra = '<span class="lk">🔒</span>'; }
        if (c.big24 && n === 24) cls += ' big';
        return `<button class="door ${cls}" data-a="door" data-n="${n}" aria-label="${esc(T('Türchen {n}', { n }))}"><span class="num">${n}</span>${extra}</button>`;
      }).join('');
      const bgRef = isImgRef(k.bgImg) ? k.bgImg : (isImgRef(c.bgImg) ? c.bgImg : '');
      const bgUrl = bgRef ? this._url(bgRef) : '';
      const kidBg = bgUrl && !/["\\()]/.test(bgUrl) ? `url("${bgUrl}") center/cover no-repeat,` : '';
      const alpha = Number(c.doorAlpha) >= 0 ? c.doorAlpha : '0.15';
      const style = `--akbg:${kidBg}${th.bg};--aktx:${th.text};--akac:${th.accent};--akfl:${th.fl};--dc:${dc};--da:${alpha};--ds:min(${this._effPx()}px,22vw);--dr:${SHAPES[c.shape] || SHAPES.sq};--df:${FONTS[c.font] || FONTS.std}`;
      const one = this._mode === 'kid' && !preview;
      const tabs = kids.length > 1 && !one ? `<div class="ktabs">${kids.map((x) => `<button class="ktab ${x.id === k.id ? 'on' : ''}" data-a="sel" data-k="${esc(x.id)}" style="--kc:${esc(HEX(x.color) || th.door)}"><span>${esc(x.emoji || '🙂')}</span>${esc(x.name)}</button>`).join('')}</div>` : '';
      const test = this._testDate() && !preview ? `<div class="pv"><span class="g">${T('🧪 Testmodus: {date} – Öffnen wird nicht gespeichert.', { date: esc(this._testDate()) })}</span></div>` : '';
      let line2;
      if (day === 0) line2 = T('Am 1. Dezember geht es los!');
      else if (fin) line2 = T('Alle Türchen sind offen – frohe Weihnachten! 🎄');
      else if (day >= 1 && !this._isOpen(k, day)) line2 = T('Heute wartet Türchen {n} auf dich ✨', { n: day });
      else if (day >= 1) line2 = T('Dein Türchen für heute hast du schon geöffnet 😊');
      else line2 = T('Türchen 1 öffnet heute ab {time} Uhr', { time: esc(c.openTime || '00:00') });
      return `<div class="ak ${deco ? 'deco' : ''}" style="${esc(style)}">${deco ? DECO_TOP : ''}${this._snowHtml()}${deco ? DECO_BOTTOM : ''}<div class="in">
        ${test}
        <div class="akh"><span class="tt">${esc(c.title)}</span>${!deco && (kids.length === 1 || one) ? `<span style="font-size:28px">${esc(k.emoji || '')}</span>` : ''}</div>
        ${tabs}
        <div class="greet">${T('Hallo {name}!', { name: esc(k.name) })} ${deco ? esc(k.emoji || '') : ''}</div>
        <div class="greet2">${line2}</div>
        ${c.countdown !== false ? `<div class="aksub akcd">${esc(this._countdownText())}</div>` : ''}
        ${c.progress !== false ? `<div class="aksub">${T('{n} von {total} Türchen geöffnet', { n: opened, total: N })}</div><div class="akbar"><i style="width:${Math.round((opened / N) * 100)}%"></i></div>` : ''}
        <div class="grid">${doors}</div>
        ${opened ? `<button class="akbtn" data-a="gal">${T('🖼️ Meine Türchen ({n})', { n: opened })}</button>` : ''}
      </div></div>`;
    }

    _adminHtml() {
      const tabs = [['doors', '🚪', T('Türchen')], ['look', '🎨', T('Aussehen')], ['files', '📁', T('Dateien')], ['set', '⚙️', T('Einstellungen')]];
      const kids = this._kids();
      this._libLoad();
      let body = '';
      if (this._tab === 'look') body = this._tabLook();
      else if (this._tab === 'set') body = this._tabSet(kids);
      else if (this._tab === 'files') body = this._tabFiles();
      else body = this._tabDoors(kids);
      return `<div class="adm"><div class="hd"><span class="tt">${esc(this._cfg.title)}</span>
        <button class="btn sm" data-a="prev" title="${esc(T('Vorschau'))}">${T('👀 Vorschau')}</button></div>
        ${this._testDate() ? `<div class="pv"><span class="g">${T('🧪 Testmodus auf diesem Gerät: {date}', { date: esc(this._testDate()) })}</span><button class="btn sm" data-a="testoff">${T('Beenden')}</button></div>` : ''}
        <div class="tabs">${tabs.map(([id, ic, l]) => `<button class="tab ${this._tab === id ? 'on' : ''}" data-a="tab" data-id="${id}"><b>${ic}</b><span>${l}</span></button>`).join('')}</div>
        ${body}</div>`;
    }

    _kidChips(kids, cur, act) { return kids.length > 1 ? `<div class="chips">${kids.map((k) => `<button class="chip ${k.id === cur.id ? 'on' : ''}" data-a="${act}" data-k="${esc(k.id)}">${esc(k.emoji || '')} ${esc(k.name)}</button>`).join('')}</div>` : ''; }

    _tabDoors(kids) {
      if (!kids.length) return `<div class="hint">${T('Noch keine Kinder angelegt – das geht in der Eltern-Ansicht unter 👧 Kinder.')}</div>`;
      const k = this._adminKid(), N = this._N(), op = this._opRec(k);
      let filled = 0;
      const cells = Array.from({ length: N }, (_, i) => i + 1).map((n) => {
        const d = this._doorOf(k, n), has = this._hasContent(d);
        if (has) filled++;
        const marks = `${op.d[n] ? '✓' : ''}${d && d.pts ? '⭐' : ''}${d && d.rwd ? '🎁' : ''}${d && d.cond && d.cond.t ? '🔗' : ''}${d && d.msg ? '💌' : ''}${d && d.img ? '🖼️' : ''}`;
        return `<button class="ec ${has ? '' : 'empty'}" data-a="edoor" data-n="${n}" aria-label="${esc(T('Türchen {n}', { n }))}"><span class="en">${n}</span><span class="ee">${has ? esc(d.e || '📝') : '＋'}</span><span class="es">${marks}</span></button>`;
      }).join('');
      const info = [k.dev ? `📱 ${esc(this._phone(k.dev))}` : '', k.bgImg ? T('🖼️ eigener Hintergrund') : ''].filter(Boolean).join(' · ');
      return `${this._kidChips(kids, k, 'ak')}
        <div class="hint">${T('{emoji} <b>{name}</b>: {n} von {total} Türchen befüllt. Antippen zum Bearbeiten. ✓ = schon geöffnet', { emoji: esc(k.emoji || ''), name: esc(k.name), n: filled, total: N })}${info ? `<br>${info}` : ''}</div>
        <div class="egrid">${cells}</div>
        <div class="btns"><button class="btn p" data-a="tplfill">${T('✨ Leere Türchen automatisch füllen')}</button>
        ${kids.length > 1 ? `<button class="btn" data-a="copyto">${T('📋 Auf anderes Kind kopieren')}</button>` : ''}
        <button class="btn" data-a="shuffle">${T('🔀 Neu mischen')}</button>
        <button class="btn" data-a="ekid" data-k="${esc(k.id)}">${T('⚙️ Hintergrund & Handy für {name}', { name: esc(k.name) })}</button>
        <button class="btn" data-a="closeall">${this._sureKey === `close:${k.id}` ? T('Wirklich alle schließen? Nochmal tippen') : T('🚪 Alle Türchen schließen')}</button></div>`;
    }

    _chk(k, label, hint) { const c = this._cfg; return `<label class="crow"><input type="checkbox" data-c="${k}" ${c[k] ? 'checked' : ''}><span>${label}${hint ? `<small>${hint}</small>` : ''}</span></label>`; }
    _sel(k, label, opts) { const v = String(this._cfg[k]); return `<label class="f">${label}<select data-c="${k}">${opts.map(([o, l]) => `<option value="${esc(o)}" ${String(o) === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`; }

    _tabLook() {
      const c = this._cfg, col = c.col || {}, alpha = c.doorAlpha !== undefined ? c.doorAlpha : '0.15';
      const sw = (bg) => `<i style="background:${esc(bg)}"></i>`;
      const t = this._theme();
      const colIn = (k, l, d) => `<label class="f">${l}<input type="color" data-c="col.${k}" value="${esc(HEX(col[k]) || d)}"></label>`;
      const bgVal = c.bgImg || '';
      if (c.soundType === 'file') this._url(c.soundFile);
      const tgt = this._target(), tgtVal = `${tgt.getFullYear()}-${pad(tgt.getMonth() + 1)}-${pad(tgt.getDate())}T${pad(tgt.getHours())}:${pad(tgt.getMinutes())}`;
      return `<div class="box"><h3>${T('✨ Standard-Optik')}</h3><div class="hint">${T('Sternennacht mit Girlanden, Schneelandschaft und bunt gemusterten Türchen.')}</div><div class="btns"><button class="btn p" data-a="stdlook">${T('✨ Standard-Optik übernehmen')}</button></div>
        ${this._chk('deco', T('🎄 Deko anzeigen (Girlanden oben, Schneelandschaft unten)'))}</div>
        <div class="box"><h3>${T('🎨 Farben & Hintergrund')}</h3>
        <div class="thm">${Object.entries(THEMES).map(([id, x]) => `<button class="thb ${c.theme === id ? 'on' : ''}" data-a="theme" data-v="${id}">${sw(x.bg)}${esc(T(x.n))}</button>`).join('')}
        <button class="thb ${c.theme === 'custom' ? 'on' : ''}" data-a="theme" data-v="custom">${sw(c.theme === 'custom' ? t.bg : 'linear-gradient(135deg,#e03131,#1c7ed6,#2f9e44)')}${T('✏️ Eigene Farben')}</button></div>
        ${c.theme === 'custom' ? `<div class="g2">${colIn('bg', T('Hintergrund oben'), '#173a66')}${colIn('bg2', T('Hintergrund unten'), HEX(col.bg) || '#173a66')}${colIn('door', T('Türchen'), '#2f6fb3')}${colIn('text', T('Schrift'), '#ffffff')}${colIn('accent', T('Akzent'), '#ffd43b')}${colIn('fl', T('Schneeflocken'), '#ffffff')}</div>` : ''}
        ${c.shape !== 'tile' ? this._chk('doorKid', T('🎨 Türchen in der Farbe des Kindes')) : ''}
        <label class="f">${T('Hintergrundbild für alle')}<select data-c="bgImg">${this._imgOpts(bgVal, T('– Kein Hintergrundbild –'))}</select></label>
        <div class="hint">${T('Eigene Bilder lädst du unter <b>📁 Dateien</b> hoch.')}</div>
        ${this._thumbHtml(bgVal)}
        ${bgVal && this._missing(bgVal) === true ? `<div class="btns"><button class="btn" data-a="clrbg">${T('🧹 Fehlendes Bild entfernen')}</button></div>` : ''}
        <details class="adv"><summary>${T('Profi: eigenen Pfad eingeben')}</summary><label class="f">${T('Pfad (/local/… oder https://…)')}<input data-c="bgImg" value="${MS_RX.test(bgVal) ? '' : esc(bgVal)}" placeholder="/local/advent/bild.jpg"></label>
        <div class="hint">${T('/local/… zeigt auf den Ordner <code>config/www</code>. Wurde www neu angelegt, muss Home Assistant einmal neu starten. Groß-/Kleinschreibung beachten.')}</div></details></div>
        <div class="box"><h3>${T('🚪 Türchen')}</h3>
        <label class="f">${T('Überschrift')}<input data-c="title" maxlength="40" value="${esc(c.title)}"></label>
        <div class="g2">${this._sel('shape', T('Form'), [['tile', T('bunt gemustert')], ['sq', T('eckig')], ['round', T('rund')], ['gift', T('Geschenk')]])}
        ${this._sel('font', T('Schrift der Zahlen'), [['fun', T('Verspielt')], ['std', T('Standard')], ['serif', T('Klassisch')], ['hand', T('Handschrift')], ['mono', T('Schreibmaschine')]])}${this._sel('anim', T('Öffnen-Effekt'), [['flip', T('Aufklappen')], ['slide', T('Hochschieben')], ['confetti', T('Konfetti')], ['none', T('Keiner')]])}</div>
        <label class="f">${T('Größe der Türchen: <b>{n} px</b>', { n: this._doorPx() })}<input type="range" data-c="doorPx" min="50" max="220" step="2" value="${this._doorPx()}"></label>
        <div class="hint">${T('Auf schmalen Bildschirmen werden die Türchen automatisch kleiner, damit alle hineinpassen.')}</div>
        ${(() => { const dv = this._devPx(); return `<label class="crow"><input type="checkbox" data-dv="on" ${dv ? 'checked' : ''}><span>${T('📱 Eigene Größe auf diesem Gerät')}<small>${T('Wird nur in diesem Browser bzw. in dieser App gespeichert – z. B. für den PC oder das Tablet. Andere Geräte bleiben bei der Größe für alle.')}</small></span></label>
        ${dv ? `<label class="f">${T('Größe auf diesem Gerät: <b>{n} px</b>', { n: dv })}<input type="range" data-dv="px" min="50" max="220" step="2" value="${dv}"></label>` : ''}
        <div class="hint">${T('Für alle: {a} px · Dieses Gerät: {b} px', { a: this._doorPx(), b: this._effPx() })}</div>`; })()}
        ${c.shape !== 'tile' ? `<label class="f">${T('Durchsichtigkeit: <b>{n}% transparent</b>', { n: Math.round((1 - Number(alpha)) * 100) })}<input type="range" data-c="doorAlpha" min="0.05" max="0.8" step="0.05" value="${esc(alpha)}"></label>` : ''}
        ${this._chk('big24', T('🎄 Türchen 24 doppelt so groß'))}
        ${this._chk('countdown', T('⏳ Countdown anzeigen'))}
        ${this._chk('progress', T('📊 Fortschrittsbalken anzeigen'))}</div>
        <div class="box"><h3>${T('❄️ Schneefall')}</h3>
        ${this._chk('snow', T('Schneefall anzeigen'))}
        ${c.snow ? `<div class="g2">${this._sel('snowAmt', T('Menge'), [['w', T('wenig')], ['m', T('mittel')], ['v', T('viel')]])}${this._sel('snowSpd', T('Tempo'), [['l', T('langsam')], ['n', T('normal')], ['s', T('schnell')]])}</div>
        ${this._sel('snowFl', T('Flocke'), FLAKES.map((f) => [f, f]))}` : ''}</div>
        <div class="box"><h3>${T('🔔 Ton beim Öffnen')}</h3>
        ${this._sel('soundType', T('Ton'), [['bells', T('🎄 Glocken (eingebaut)')], ['chime', T('✨ Funkeln (eingebaut)')], ['file', T('🎵 Eigene Datei (z. B. glocken.mp3)')], ['none', T('🔇 Kein Ton')]])}
        ${c.soundType === 'file' ? `<label class="f">${T('Tondatei')}<select data-c="soundFile">${this._sndOpts(c.soundFile || '')}</select></label>
        ${c.soundFile && this._missing(c.soundFile) === true ? `<div class="hint warn">${T('⚠️ Tondatei nicht gefunden – es kommen die eingebauten Glocken.')}</div>` : ''}
        <div class="hint">${T('Eigene MP3-Töne lädst du unter <b>📁 Dateien</b> hoch. Kann die Datei nicht gespielt werden, ertönen die eingebauten Glocken.')}</div>
        <details class="adv"><summary>${T('Profi: eigenen Pfad eingeben')}</summary><label class="f">${T('Pfad (/local/… oder https://…)')}<input data-c="soundFile" value="${MS_RX.test(c.soundFile || '') ? '' : esc(c.soundFile || '')}" placeholder="/local/advent/glocken.mp3"></label></details>` : ''}
        ${c.soundType !== 'none' ? `<div class="btns"><button class="btn" data-a="sndtest">${T('▶️ Anhören')}</button></div>` : ''}</div>
        <div class="box"><h3>${T('⏰ Uhrzeit & Countdown')}</h3>
        <label class="f">${T('Ab welcher Uhrzeit darf das Türchen des Tages geöffnet werden?')}<input type="time" data-c="openTime" value="${esc(c.openTime || '00:00')}"></label>
        <label class="f">${T('Countdown-Ziel')}<input type="datetime-local" data-c="targetDate" value="${esc(tgtVal)}"></label>
        <div class="hint">${T('Leer lassen = automatisch Heiligabend 18:00 Uhr.')}</div></div>`;
    }

    _tabSet() {
      const c = this._cfg;
      const autoEnt = this._autoEntity(), kidsDev = this._kids().filter((k) => k.dev);
      return `<div class="box"><h3>${T('📅 Zeitraum')}</h3>
        ${this._sel('days', T('Kalender'), [['24', T('1.–24. Dezember')], ['31', T('1.–31. Dezember (bis Silvester)')]])}
        ${this._chk('catchUp', T('⏮️ Vergessene Türchen nachholen erlauben'))}</div>
        <div class="box"><h3>${T('🔗 Türchen mit Bedingung')}</h3>
        <div class="hint">${T('Beim Bearbeiten eines Türchens kannst du festlegen, dass es erst nach erledigten Aufgaben aufgeht.')}</div>
        ${this._chk('yPend', T('Auch „wartet auf Bestätigung“ zählt als erledigt'))}</div>
        <div class="box"><h3>${T('📱 Morgen-Benachrichtigung')}</h3>
        ${this._chk('nOn', T('Jeden Morgen im Dezember eine Nachricht aufs Handy'))}
        ${c.nOn ? `<div class="g2"><label class="f">${T('Uhrzeit')}<input type="time" data-c="nTime" value="${esc(c.nTime || '07:00')}"></label><span></span></div>
        <label class="f">${T('Text')}<input data-c="nText" maxlength="200" value="${esc(c.nText)}"></label>
        <div class="hint">${T('<code>{name}</code> = Name des Kindes, <code>{tag}</code> = Türchen-Nummer. Das Handy wählst du pro Kind unter 🚪 Türchen → ⚙️ Hintergrund & Handy.')}</div>
        ${kidsDev.length ? `<div class="hint">${T('Geht an: {list}', { list: kidsDev.map((k) => `${esc(k.name)} (📱 ${esc(this._phone(k.dev))})`).join(', ') })}</div>` : `<div class="hint warn">${T('⚠️ Noch keinem Kind ein Handy zugeordnet.')}</div>`}
        <div class="hint ${autoEnt ? 'ok' : ''}">${autoEnt ? T('✓ Automation ist in Home Assistant angelegt.') : T('Damit die Nachricht auch kommt, wenn niemand das Dashboard offen hat, legt die Karte eine Automation in Home Assistant an.')}</div>
        <div class="btns"><button class="btn p" data-a="nsync" ${this._admin() && kidsDev.length ? '' : 'disabled'}>${autoEnt ? T('🔄 Automation aktualisieren') : T('⚙️ Automation anlegen')}</button>
        <button class="btn" data-a="ntest" ${kidsDev.length ? '' : 'disabled'}>${T('📤 Test senden')}</button>
        ${autoEnt && this._admin() ? `<button class="btn" data-a="ndel">${this._sureKey === 'ndel' ? T('Wirklich? Nochmal tippen') : T('🗑️ Automation löschen')}</button>` : ''}</div>
        ${!this._admin() ? `<div class="hint">${T('Automation anlegen kann nur ein Administrator.')}</div>` : ''}
        <div class="hint">${T('Nach Änderungen an Uhrzeit, Text oder Handys einmal „Automation aktualisieren“ tippen.')}</div>` : (autoEnt && this._admin() ? `<div class="btns"><button class="btn" data-a="ndel">${this._sureKey === 'ndel' ? T('Wirklich? Nochmal tippen') : T('🗑️ Vorhandene Automation löschen')}</button></div>` : '')}</div>
        <div class="box"><h3>${T('🧪 Testmodus')}</h3>
        <div class="hint">${T('Nur auf diesem Gerät: tut so, als wäre heute ein anderes Datum. Geöffnete Türchen werden dabei nicht gespeichert.')}</div>
        <div class="g2"><label class="f">${T('Testdatum')}<input type="date" name="testdate" value="${esc(this._testDate() || `${this._season(new Date())}-12-01`)}"></label><button class="btn" data-a="testset" style="align-self:end">${T('▶️ Starten')}</button></div></div>`;
    }

    _phone(svc) { return String(svc || '').replace(/^mobile_app_/, '').replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()); }

    // ---------- Benachrichtigung (HA-Automation, nur Administratoren) ----------
    _autoId() { return 'yippee_adventskalender'; }
    _autoEntity() { const id = this._autoId(), st = this._hass.states; return Object.keys(st).find((e) => e.startsWith('automation.') && st[e].attributes && st[e].attributes.id === id) || ''; }
    _nMsg(k, tag) { const clean = (s) => String(s || '').replace(/[{}]/g, ''); return String(this._cfg.nText).replace(/\{name\}/g, clean(k.name)).replace(/\{tag\}/g, tag); }
    _autoCfg() {
      const c = this._cfg, N = this._N(), [h, m] = String(c.nTime || '07:00').split(':').map(Number);
      return {
        alias: T('Yippee Adventskalender – Morgen-Nachricht'),
        description: T('Automatisch von Yippee! - Kids Chores angelegt. Änderungen bitte in der Karte machen (🎄 Advent → ⚙️ Einstellungen).'),
        triggers: [{ trigger: 'time', at: `${pad(h || 0)}:${pad(m || 0)}:00` }],
        conditions: [{ condition: 'template', value_template: `{{ now().month == 12 and now().day <= ${N} }}` }],
        actions: this._kids().filter((k) => k.dev).map((k) => ({ action: `notify.${k.dev}`, continue_on_error: true, data: { title: String(c.title).replace(/[{}]/g, ''), message: this._nMsg(k, '{{ now().day }}') } })),
        mode: 'single',
      };
    }
    async _autoSync() {
      if (!this._admin()) return;
      try {
        await this._hass.callApi('POST', `config/automation/config/${this._autoId()}`, this._autoCfg());
        this._toast(T('✅ Automation gespeichert'));
      } catch (e) { this._toast(T('Automation konnte nicht gespeichert werden: {err}', { err: errMsg(e) }), true); }
      setTimeout(() => this._render(), 1500);
    }
    async _autoDel() {
      if (!this._admin()) return;
      try { await this._hass.callApi('DELETE', `config/automation/config/${this._autoId()}`); this._toast(T('🗑️ Automation gelöscht')); }
      catch (e) { this._toast(T('Löschen fehlgeschlagen: {err}', { err: errMsg(e) }), true); }
      setTimeout(() => this._render(), 1500);
    }
    async _notifyTest() {
      const now = this._now(), tag = now.getMonth() === 11 ? now.getDate() : 1;
      const kids = this._kids().filter((k) => k.dev);
      let ok = 0;
      for (const k of kids) {
        try { await this._hass.callService('notify', k.dev, { title: this._cfg.title, message: this._nMsg(k, tag) }); ok++; }
        catch (e) { this._toast(T('An {name} fehlgeschlagen: {err}', { name: k.name, err: errMsg(e) }), true); }
      }
      if (ok) this._toast(ok === 1 ? T('📤 Test an 1 Handy gesendet') : T('📤 Test an {n} Handys gesendet', { n: ok }));
    }

    // ---------- Dialoge ----------
    _modal(title, body, foot) {
      const m = this.shadowRoot.getElementById('modal');
      m.innerHTML = `<div class="mback" data-a="mback"><div class="mbox"><div class="mhead"><h3>${title}</h3><button class="ic" data-a="mclose" aria-label="${esc(T('Schließen'))}">✕</button></div>
        <div class="mbody">${body}</div><div class="mfoot">${foot || `<button class="btn p" data-a="mclose">${T('Schließen')}</button>`}</div></div></div>`;
      m.classList.add('open');
    }
    _closeModal() { const m = this.shadowRoot.getElementById('modal'); if (m) { m.innerHTML = ''; m.classList.remove('open'); } this._m = null; }
    _mv(name) { const el = this.shadowRoot.querySelector(`#modal [name="${name}"]`); return el ? (el.type === 'checkbox' ? el.checked : el.value) : undefined; }

    _doorDraft() {
      return { e: this._mv('e'), t: this._mv('t'), msg: this._mv('msg'), img: this._mv('img'), pts: this._mv('pts'), rwd: this._mv('rwd'), ct: this._mv('ct'), cid: this._mv('cid'), cn: this._mv('cn') };
    }

    _editDoor(n, draft) {
      const k = this._adminKid();
      if (!k) return;
      const saved = this._doorOf(k, n) || {};
      const d = draft ? { ...draft } : { e: saved.e, t: saved.t, msg: saved.msg, img: saved.img, pts: saved.pts, rwd: saved.rwd || '', ct: (saved.cond && saved.cond.t) || '', cid: (saved.cond && saved.cond.id) || '', cn: (saved.cond && saved.cond.n) || 1 };
      const opened = !!this._opRec(k).d[n];
      const img = d.img || '';
      const tasks = this._tasksFor(k), ct = d.ct || '';
      const rs = this._rewardsFor(k), cur = d.rwd || '';
      const opt = (r) => `<option value="${esc(r.id)}" ${r.id === cur ? 'selected' : ''}>${esc(`${r.emoji || '🎁'} ${r.title}`)}</option>`;
      const adv = rs.filter((r) => r.adv), rest = rs.filter((r) => !r.adv);
      const gone = cur && !rs.some((r) => r.id === cur) ? `<option value="${esc(cur)}" selected>${esc(T('⚠️ Belohnung gibt es nicht mehr'))}</option>` : '';
      const yHtml = `<div class="box"><h3>${T('⭐ Sterne & Belohnung')}</h3>
        <label class="f">${T('Sterne beim Öffnen (0 = keine)')}<input type="number" name="pts" min="-100" max="100" step="1" value="${esc(d.pts || 0)}"></label>
        <label class="f">${T('🎁 Belohnung schenken')}<select name="rwd"><option value="">${T('– keine –')}</option>${gone}${adv.length ? `<optgroup label="${esc(T('🎄 Nur im Adventskalender'))}">${adv.map(opt).join('')}</optgroup>` : ''}${rest.length ? `<optgroup label="${esc(T('Weitere Belohnungen'))}">${rest.map(opt).join('')}</optgroup>` : ''}</select></label>
        <div class="hint">${T('Wird beim Öffnen geschenkt – ohne Sterne abzuziehen. Mit 🎟️ Gutscheinen landet sie als Gutschein beim Kind.')}${adv.length ? '' : ` ${T('Tipp: Belohnungen mit „🎄 Nur im Adventskalender“ sehen die Kinder sonst nirgends.')}`}</div>
        <label class="f">${T('Türchen erst öffnen, wenn …')}<select name="ct"><option value="" ${ct ? '' : 'selected'}>${T('– immer offen –')}</option><option value="task" ${ct === 'task' ? 'selected' : ''}>${T('… eine bestimmte Aufgabe heute erledigt ist')}</option><option value="min" ${ct === 'min' ? 'selected' : ''}>${T('… heute mindestens X Aufgaben erledigt sind')}</option></select></label>
        <label class="f" data-ct="task" ${ct === 'task' ? '' : 'hidden'}>${T('Aufgabe')}<select name="cid">${tasks.length ? tasks.map((t) => `<option value="${esc(t.id)}" ${t.id === d.cid ? 'selected' : ''}>${esc(`${t.emoji || ''} ${t.title}`.trim())}</option>`).join('') : `<option value="">${T('(keine Aufgaben gefunden)')}</option>`}</select></label>
        <label class="f" data-ct="min" ${ct === 'min' ? '' : 'hidden'}>${T('Anzahl Aufgaben')}<input type="number" name="cn" min="1" max="20" step="1" value="${esc(d.cn || 1)}"></label></div>`;
      this._m = { t: 'door', k: k.id, n };
      this._modal(`${T('🚪 Türchen {n}', { n })} – ${esc(k.name)}`, `
        <div class="g2" style="grid-template-columns:90px 1fr"><label class="f">${T('Emoji')}<input name="e" maxlength="16" value="${esc(d.e || '')}"></label><button class="btn sm" data-a="picktpl" style="align-self:end">${T('📚 Vorlagen')}</button></div>
        <div class="emos">${EMO_ALL.map((x) => `<button type="button" data-a="epick" data-e="${x}">${x}</button>`).join('')}</div>
        <label class="f">${T('Text / Inhalt')}<textarea name="t" maxlength="1000" placeholder="${esc(T('z. B. Heute backen wir Plätzchen!'))}">${esc(d.t || '')}</textarea></label>
        <label class="f">${T('💌 Nachricht an das Kind (optional)')}<textarea name="msg" maxlength="500" style="min-height:60px" placeholder="${esc(T('z. B. Ich bin stolz auf dich! ❤️'))}">${esc(d.msg || '')}</textarea></label>
        <label class="f">${T('Bild')}<select name="imgSel">${this._imgOpts(img, T('– Kein Bild –'))}</select></label>
        <details class="adv"><summary>${T('Profi: eigenen Pfad eingeben')}</summary><label class="f">${T('Pfad (/local/… oder https://…)')}<input name="img" value="${esc(img)}" placeholder="/local/advent/bild.jpg"></label></details>
        ${this._thumbHtml(img)}
        <div class="hint">${T('Eigene Bilder lädst du unter <b>📁 Dateien</b> hoch (JPG, am besten 1080 × 1080 px).')}</div>
        ${yHtml}`,
      `${opened ? `<button class="btn d" data-a="dclose">${T('🚪 Wieder schließen')}</button>` : ''}<button class="btn" data-a="dclear">${T('🧹 Leeren')}</button><button class="btn" data-a="didea">${T('🎲 Idee')}</button><button class="btn" data-a="mclose">${T('Abbrechen')}</button><button class="btn p" data-a="dsave">${T('Speichern')}</button>`);
    }

    _pickTemplateModal() {
      const draft = this._doorDraft(), n = this._m.n, k = this._m.k;
      this._m = { t: 'tpl', k, n, draft };
      const sp = specials(this._season(this._now()), this._N());
      const btn = (x, lbl) => `<button class="gi" data-a="usetpl" data-e="${esc(x[0])}" data-t="${esc(T(x[1]))}">${lbl ? `<span class="gn">${esc(lbl)}</span>` : ''}<span class="ge">${esc(x[0])}</span><span class="gt">${esc(T(x[1]))}</span></button>`;
      const spHere = sp[n] ? `<div class="tplh">${T('⭐ Passend für Türchen {n}', { n })}</div>${btn(sp[n])}` : '';
      this._modal(T('📚 Vorlagen wählen'), `<div class="hint">${T('Tippe auf eine Vorlage – du kannst den Text danach noch anpassen.')}</div>
        <div class="tpll">${spHere}
          ${TPL.map(([cat, list]) => `<div class="tplh">${esc(T(cat))}</div>${list.map((x) => btn(x)).join('')}`).join('')}
          <div class="tplh">${T('📅 Besondere Tage {year}', { year: this._season(this._now()) })}</div>${Object.keys(sp).map(Number).sort((a, b) => a - b).map((d) => btn(sp[d], `${d}.`)).join('')}
        </div>`, `<button class="btn" data-a="backdoor">${T('Zurück')}</button>`);
    }

    _saveDoor() {
      const m = this._m, k = m && this._kid(m.k);
      if (!k) { this._closeModal(); return; }
      const img = String(this._mv('img') || '').trim();
      if (img && !isImgRef(img)) { this._toast(T('Ungültiges Bild – bitte eine Datei aus der Liste wählen oder einen Pfad mit /local/ oder https:// (ohne Leerzeichen).'), true); return; }
      const door = { e: String(this._mv('e') || '').trim().slice(0, 16), t: String(this._mv('t') || '').slice(0, 1000), msg: String(this._mv('msg') || '').slice(0, 500), img };
      const pts = Math.max(-100, Math.min(100, Math.round(Number(this._mv('pts')) || 0)));
      if (pts) door.pts = pts;
      const rwd = String(this._mv('rwd') || '');
      if (rwd && ID_RX.test(rwd)) door.rwd = rwd;
      const ct = this._mv('ct');
      if (ct === 'task' && this._mv('cid')) door.cond = { t: 'task', id: String(this._mv('cid')) };
      else if (ct === 'min') door.cond = { t: 'min', n: Math.max(1, Math.min(20, Math.round(Number(this._mv('cn')) || 1))) };
      const n = m.n;
      const upd = (cur) => { const doors = { ...(cur.doors || {}) }; doors[n] = door; return { ...cur, doors }; };
      this._save('kid', k.id, upd(k), upd);
      this._closeModal();
      this._toast(T('💾 Türchen {n} gespeichert', { n }));
      this._render();
    }

    // Kalender-Einstellungen eines Kindes (Name, Avatar und Farbe kommen aus Yippee)
    _editKid(id) {
      const k = this._kid(id);
      if (!k) return;
      const bg = k.bgImg || '', dev = k.dev || '';
      const svcs = this._notifySvcs();
      if (dev && !svcs.includes(dev)) svcs.unshift(dev);
      this._m = { t: 'kid', id };
      this._modal(`${esc(k.emoji || '')} ${esc(k.name)}`, `
        <div class="hint">${T('Name, Avatar und Farbe änderst du in Yippee unter 👧 Kinder.')}</div>
        <label class="f">${T('🖼️ Eigenes Hintergrundbild')}<select name="bgSel">${this._imgOpts(bg, T('– wie für alle –'))}</select></label>
        <details class="adv"><summary>${T('Profi: eigenen Pfad eingeben')}</summary><label class="f">${T('Pfad (/local/… oder https://…)')}<input name="bgImg" value="${esc(bg)}" placeholder="/local/advent/bild.jpg"></label></details>
        ${this._thumbHtml(bg)}
        <label class="f">${T('📱 Handy für die Morgen-Nachricht')}<select name="dev"><option value="">${T('– keins –')}</option>${svcs.map((s) => `<option value="${esc(s)}" ${s === dev ? 'selected' : ''}>${esc(this._phone(s))} (notify.${esc(s)})</option>`).join('')}</select></label>`,
      `<button class="btn" data-a="mclose">${T('Abbrechen')}</button><button class="btn p" data-a="ksave">${T('Speichern')}</button>`);
    }

    _saveKid() {
      const m = this._m, k = m && this._kid(m.id);
      if (!k) { this._closeModal(); return; }
      const bgImg = String(this._mv('bgImg') || '').trim();
      if (bgImg && !isImgRef(bgImg)) { this._toast(T('Ungültiges Bild – bitte eine Datei aus der Liste wählen oder einen Pfad mit /local/ oder https:// (ohne Leerzeichen).'), true); return; }
      const f = { bgImg, dev: String(this._mv('dev') || '') };
      this._save('kid', k.id, { ...k, ...f }, (cur) => ({ ...cur, ...f }));
      this._closeModal();
      this._render();
    }

    _copyModal() {
      const src = this._adminKid();
      if (!src) return;
      const others = this._kids().filter((x) => x.id !== src.id);
      this._m = { t: 'copy', k: src.id };
      this._modal(T('📋 Türchen von {name} kopieren', { name: esc(src.name) }), `<div class="hint">${T('Alle Türchen-Inhalte von <b>{name}</b> werden auf das gewählte Kind kopiert. <b>Dessen bisherige Inhalte werden überschrieben.</b>', { name: esc(src.name) })}</div>
        <div class="btns">${others.map((x) => `<button class="btn" data-a="copygo" data-k="${esc(x.id)}">${esc(x.emoji || '')} ${esc(x.name)}</button>`).join('')}</div>`, `<button class="btn" data-a="mclose">${T('Abbrechen')}</button>`);
    }

    _toast(msg, isWarn) {
      const fx = this.shadowRoot.getElementById('fx');
      if (!fx) return;
      fx.querySelectorAll('.toast').forEach((t) => t.remove());
      const t = document.createElement('div'); t.className = `toast ${isWarn ? 'warn' : ''}`; t.textContent = msg; fx.appendChild(t);
      setTimeout(() => t.remove(), 4000);
    }

    _burst(n) {
      const fx = this.shadowRoot.getElementById('fx'), items = ['⭐', '✨', '🌟', '❄️', '⭐'];
      if (!fx) return;
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span'); s.className = 'cf'; s.textContent = items[i % items.length];
        s.style.left = `${Math.random() * 100}vw`; s.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
        fx.appendChild(s); setTimeout(() => s.remove(), 3500);
      }
    }

    _sure(key) {
      if (this._sureKey === key && Date.now() < this._sureT) { this._sureKey = null; clearTimeout(this._sureTm); return true; }
      this._sureKey = key; this._sureT = Date.now() + 8000;
      clearTimeout(this._sureTm); this._sureTm = setTimeout(() => { this._sureKey = null; this._render(); }, 8000);
      this._render();
      return false;
    }

    // ---------- Ereignisse ----------
    _change(e) {
      const el = e.target, nm = el.name;
      if (this._m) {
        if (nm === 'imgSel' || nm === 'bgSel') {
          const inp = this.shadowRoot.querySelector(`#modal [name="${nm === 'imgSel' ? 'img' : 'bgImg'}"]`);
          if (inp) inp.value = el.value;
          this._setThumb(el.value);
          return;
        }
        if (nm === 'img' || nm === 'bgImg') return;
        if (nm === 'ct') { this.shadowRoot.querySelectorAll('#modal [data-ct]').forEach((x) => { x.hidden = x.dataset.ct !== el.value; }); return; }
      }
      if (nm === 'up' && el.files) { const fl = [...el.files]; el.value = ''; this._pick(fl); return; }
      if (el.dataset && el.dataset.dv) {
        // 📱 Türchengröße nur für dieses Gerät (Browser-Speicher, wird nicht geteilt)
        if (this._mode !== 'admin') return;
        try {
          if (el.dataset.dv === 'on') { if (el.checked) localStorage.setItem(this._devKey(), String(this._cardPx() || this._doorPx())); else localStorage.removeItem(this._devKey()); }
          else localStorage.setItem(this._devKey(), String(Math.max(50, Math.min(220, Math.round(Number(el.value)) || 74))));
        } catch (e2) { this._toast(T('Speichern auf diesem Gerät nicht möglich.'), true); }
        this._render(); return;
      }
      const key = el.dataset && el.dataset.c;
      if (!key || this._mode !== 'admin') return;
      let v = el.type === 'checkbox' ? el.checked : el.value;
      if (key.startsWith('col.')) { const h = HEX(v); if (h) this._setCol(key.slice(4), h); this._render(); return; }
      if (key === 'days') v = Number(v) === 31 ? 31 : 24;
      if (key === 'doorPx') v = Math.max(50, Math.min(220, Math.round(Number(v)) || 74));
      if (typeof v === 'string') v = v.trim().slice(0, 200);
      if (key === 'bgImg' && v && !isImgRef(v)) { this._toast(T('Ungültiges Bild – erlaubt sind JPG-Dateien aus 📁 Dateien oder Pfade mit /local/ bzw. https:// (ohne Leerzeichen).'), true); this._render(); return; }
      if (key === 'soundFile' && v && !isSndRef(v)) { this._toast(T('Tonpfad muss mit /local/ oder https:// beginnen und auf .mp3, .wav, .ogg, .m4a oder .aac enden (ohne Leerzeichen).'), true); this._render(); return; }
      if (key === 'soundFile' || (key === 'soundType' && v === 'file')) { this._setCfg({ soundType: 'file', soundFile: key === 'soundFile' ? v : this._cfg.soundFile }); this._render(); return; }
      if (key === 'title' && v === T('🎄 Adventskalender')) v = '';
      if (key === 'nText' && v === T('🎄 Guten Morgen {name}! Türchen {tag} wartet auf dich.')) v = '';
      this._setCfg({ [key]: v });
      this._render();
    }

    _click(e) {
      const el = e.target.closest('[data-a]');
      if (!el) return;
      const a = el.dataset.a, ds = el.dataset;
      if (this.host && this.host._pin && this.host._pin()) this.host._touch(); // Eltern-PIN: Bedienen hält den Bereich offen
      switch (a) {
        case 'door': this._door(Number(ds.n)); return;
        case 'sel': this._selKid = ds.k; try { localStorage.setItem('kpAdvSel', ds.k); } catch (e2) { /* egal */ } this._render(); return;
        case 'gal': { const k = this._curKid(this._kids()); if (k) this._gallery(k); return; }
        case 'gopen': { const k = this._curKid(this._kids()); if (k) this._reveal(k, Number(ds.n), false); return; }
        case 'mclose': this._closeModal(); return;
        case 'mback': if (e.target === el) this._closeModal(); return;
        default: break;
      }
      if (this._mode !== 'admin') return;
      switch (a) {
        case 'tab': this._tab = ds.id; try { localStorage.setItem('kpAdvTab', ds.id); } catch (e2) { /* egal */ } this._render(); break;
        case 'prev': this._prev = true; this._tmp = {}; this._render(); break;
        case 'prevoff': this._prev = false; this._tmp = {}; this._render(); break;
        case 'testset': {
          const v = String((this.shadowRoot.querySelector('#app [name=testdate]') || {}).value || '');
          if (!/^\d{4}-\d\d-\d\d$/.test(v)) { this._toast(T('Bitte ein Datum wählen'), true); break; }
          try { localStorage.setItem(this._testKey(), v); } catch (e2) { /* egal */ }
          this._tmp = {}; this._prev = true; this._render();
          this._toast(T('🧪 Testmodus: {date}', { date: v.split('-').reverse().join('.') }));
          break;
        }
        case 'testoff': try { localStorage.removeItem(this._testKey()); } catch (e2) { /* egal */ } this._tmp = {}; this._render(); break;
        case 'ak': this._ak = ds.k; this._render(); break;
        case 'edoor': this._editDoor(Number(ds.n)); break;
        case 'epick': { const i = this.shadowRoot.querySelector('#modal [name=e]'); if (i) i.value = ds.e; break; }
        case 'picktpl': if (this._m && this._m.t === 'door') this._pickTemplateModal(); break;
        case 'backdoor': if (this._m && this._m.t === 'tpl') { this._ak = this._m.k; this._editDoor(this._m.n, this._m.draft); } break;
        case 'usetpl': if (this._m && this._m.t === 'tpl') { this._ak = this._m.k; this._editDoor(this._m.n, { ...this._m.draft, e: ds.e, t: ds.t }); } break;
        case 'didea': {
          const x = IDEAS[Math.floor(Math.random() * IDEAS.length)];
          const ie = this.shadowRoot.querySelector('#modal [name=e]'), it = this.shadowRoot.querySelector('#modal [name=t]');
          if (ie) ie.value = x[0];
          if (it) it.value = T(x[1]);
          break;
        }
        case 'dclear': ['e', 't', 'msg', 'img'].forEach((n) => { const i = this.shadowRoot.querySelector(`#modal [name=${n}]`); if (i) i.value = ''; }); { const s = this.shadowRoot.querySelector('#modal [name=imgSel]'); if (s) s.value = ''; this._setThumb(''); } break;
        case 'dsave': this._saveDoor(); break;
        case 'dclose': {
          const m = this._m, k = m && this._kid(m.k);
          if (!k) break;
          const y = this._season(new Date()), n = m.n;
          const upd = (cur) => { const b = cur && cur.y === y ? cur : { y, d: {}, b: {} }; const d = { ...(b.d || {}) }; delete d[n]; return { y, d, b: b.b || {} }; };
          this._save('op', k.id, upd((this._db.op || {})[k.id]), upd);
          this._closeModal(); this._toast(T('🚪 Türchen {n} ist wieder zu', { n })); this._render();
          break;
        }
        case 'tplfill': {
          const k = this._adminKid();
          if (!k) break;
          const N = this._N(), doors = { ...(k.doors || {}) };
          let added = 0, poolIdx = 0;
          const sp = specials(this._season(this._now()), N);
          const used = new Set(Object.values(doors).filter((d) => this._hasContent(d)).map((d) => d.t));
          // Themen abwechselnd mischen, damit nicht mehrere Gutscheine oder Rätsel hintereinander kommen
          const cats = shuffle(TPL.map(([, list]) => shuffle(list.filter((x) => !used.has(T(x[1]))), Math.random)), Math.random);
          const pool = [];
          for (let i = 0; cats.some((c) => c.length > i); i++) cats.forEach((c) => { if (c[i]) pool.push(c[i]); });
          IDEAS.forEach((x) => { if (used.has(T(x[1]))) pool.push(x); });
          for (let n = 1; n <= N; n++) {
            if (this._hasContent(doors[n])) continue;
            const x = sp[n] || pool[(poolIdx++) % pool.length];
            doors[n] = { ...(doors[n] || {}), e: x[0], t: T(x[1]) };
            added++;
          }
          const upd = (cur) => { const d = { ...(cur.doors || {}) }; Object.keys(doors).forEach((n) => { if (!this._hasContent(d[n])) d[n] = doors[n]; }); return { ...cur, doors: d }; };
          this._save('kid', k.id, { ...k, doors }, upd);
          this._toast(added ? T('✨ {n} Türchen befüllt!', { n: added }) : T('Alle Türchen sind schon befüllt'));
          this._render();
          break;
        }
        case 'copyto': this._copyModal(); break;
        case 'copygo': {
          const src = this._kid(this._m && this._m.k), dst = this._kid(ds.k);
          if (!src || !dst) break;
          const doors = JSON.parse(JSON.stringify(src.doors || {}));
          this._save('kid', dst.id, { ...dst, doors }, (cur) => ({ ...cur, doors }));
          this._closeModal(); this._toast(T('📋 Türchen auf {name} kopiert', { name: dst.name })); this._ak = dst.id; this._render();
          break;
        }
        case 'shuffle': {
          const k = this._adminKid();
          if (!k) break;
          const perm = shuffle(Array.from({ length: this._N() }, (_, i) => i + 1), Math.random);
          this._save('kid', k.id, { ...k, perm }, (cur) => ({ ...cur, perm }));
          this._toast(T('🔀 Neu gemischt')); this._render();
          break;
        }
        case 'closeall': {
          const k = this._adminKid();
          if (!k || !this._sure(`close:${k.id}`)) break;
          const y = this._season(new Date());
          const upd = (cur) => ({ y, d: {}, b: cur && cur.y === y ? (cur.b || {}) : {} });
          this._save('op', k.id, upd((this._db.op || {})[k.id]), upd);
          this._toast(T('🚪 Alle Türchen wieder zu')); this._render();
          break;
        }
        case 'ekid': this._editKid(ds.k); break;
        case 'ksave': this._saveKid(); break;
        case 'theme': this._setCfg({ theme: ds.v }); this._render(); break;
        case 'nsync': if (this._admin()) this._autoSync(); break;
        case 'ndel': if (this._admin() && this._sure('ndel')) this._autoDel(); break;
        case 'ntest': this._notifyTest(); break;
        case 'upgo': if (this._admin()) this._upload(); break;
        case 'clrbg': this._setCfg({ bgImg: '' }); this._toast(T('🧹 Hintergrundbild entfernt')); this._render(); break;
        case 'cleanmiss': this._cleanMissing(); break;
        case 'upclr': if (!this._upBusy) { this._up = null; this._render(); } break;
        case 'librl': this._urls = {}; this._libLoad(true); break;
        case 'libdel': if (this._admin() && this._sure(`del:${ds.id}`)) this._libDel(ds.id); break;
        case 'libbg': this._setCfg({ bgImg: ds.id }); this._toast(T('🖼️ {name} ist jetzt der Hintergrund für alle', { name: fileName(ds.id) })); this._render(); break;
        case 'libsnd': this._setCfg({ soundType: 'file', soundFile: ds.id }); this._toast(T('🔔 {name} ist jetzt der Ton beim Öffnen', { name: fileName(ds.id) })); this._render(); break;
        case 'libplay': playSound('file', this._url(ds.id)).then((okk) => { if (!okk) this._toast(T('Ton konnte nicht abgespielt werden'), true); }); break;
        case 'stdlook': this._setCfg({ theme: 'nacht', shape: 'tile', font: 'fun', deco: true, snow: true, big24: false, size: 'm', doorPx: 74, anim: 'flip' }); this._toast(T('✨ Standard-Optik übernommen')); this._render(); break;
        case 'sndtest': {
          const c = this._cfg;
          if (c.soundType === 'file' && !c.soundFile) { this._toast(T('Bitte zuerst eine Tondatei wählen'), true); break; }
          playSound(c.soundType, c.soundType === 'file' ? this._url(c.soundFile) : '').then((okk) => { if (!okk) this._toast(T('⚠️ {name} konnte nicht abgespielt werden – es kamen die eingebauten Glocken.', { name: fileName(c.soundFile) || T('Datei') }), true); });
          break;
        }
        default: break;
      }
    }
  }

  customElements.define('yippee-advent', YippeeAdvent);
  return true;
}
