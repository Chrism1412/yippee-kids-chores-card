/*
 * Yippee! - Kids Chores – Karte für Home Assistant – Version 1.9.0
 * Aufgaben abhaken · Punkte sammeln · Belohnungen einlösen · Freigabe durch Eltern
 *
 * https://github.com/Chrism1412/yippee-kids-chores-card  ·  Lizenz: MIT
 *
 * Installation: über HACS (empfohlen) oder von Hand nach
 *   /config/www/community/yippee-kids-chores-card/yippee-kids-chores-card.js
 *   Ressource: /local/community/yippee-kids-chores-card/yippee-kids-chores-card.js (Typ: JavaScript-Modul)
 *
 * Voraussetzung: eine "Lokale To-do-Liste" als Speicher, z. B. todo.yippee_kids_chores
 *
 * Eltern-Ansicht:
 *   type: custom:yippee-kids-chores-card
 *   storage: todo.yippee_kids_chores
 *   mode: admin
 *
 * Alle Kinder automatisch (neue Kinder erscheinen von selbst):
 *   type: custom:yippee-kids-chores-card
 *   storage: todo.yippee_kids_chores
 *   mode: kids
 *
 * Kinder-Ansicht für ein einzelnes Kind:
 *   type: custom:yippee-kids-chores-card
 *   storage: todo.yippee_kids_chores
 *   mode: kid
 *   child: Mia
 *
 * Optional:
 *   Freigabe und Benachrichtigungen (mehrere Handys) stellst du in der Eltern-Ansicht unter ⚙️ Einstellungen ein.
 *   Sie gelten automatisch für alle Kinder-Karten.
 *   pin: "1234"                             # PIN-Schutz (besser: in den Einstellungen unter 🔒 Zugriffsschutz festlegen)
 *   collapsed: true                         # Kinder-Ansicht: nur Name + Punkte, Aufgaben erst nach Antippen
 *   pin_minutes: 5                          # nach so vielen Minuten ohne Bedienung wieder sperren
 *   summary: true                           # Kinder-Ansicht als kleine Übersicht (Punkte, heute, Ziel, Level)
 *   show: [points, today, goal, level, net] # welche Teile die Übersicht zeigt
 *   compact: true                           # Darstellung: weniger Abstände
 *   transparent: true                       # Darstellung: ohne eigenen Karten-Hintergrund
 *   scale: 90                               # Darstellung: Größe in Prozent (70–130)
 *   CSS-Variablen für Themes/card_mod: --yippee-bg, --yippee-surface, --yippee-accent, --yippee-text, --yippee-text-secondary
 */
(() => {
  const VERSION = '1.9.0';
  // Bau-Stempel: ändert sich bei jedem Paket, damit Zusatzdateien (Sprachen, Handbuch, Adventskalender, Zahnputz) nie aus einem alten Cache kommen
  const BUILD = '20261117-1207';

  // ---------- Sprache ----------
  // Alle Texte stehen auf Deutsch im Code. T() übersetzt sie über die Sprachdatei der gewählten Sprache (yippee-kids-chores-lang-xx.js).
  const LANGS = [['de', 'Deutsch'], ['gsw', 'Schwiizerdütsch'], ['en', 'English'], ['fr', 'Français'], ['it', 'Italiano'], ['es', 'Español'], ['pt', 'Português'], ['nl', 'Nederlands'],
    ['da', 'Dansk'], ['sv', 'Svenska'], ['fi', 'Suomi'], ['et', 'Eesti'], ['lv', 'Latviešu'], ['lt', 'Lietuvių'], ['pl', 'Polski'], ['cs', 'Čeština'], ['sk', 'Slovenčina'],
    ['sl', 'Slovenščina'], ['hr', 'Hrvatski'], ['hu', 'Magyar'], ['ro', 'Română'], ['bg', 'Български'], ['el', 'Ελληνικά'], ['mt', 'Malti'], ['ga', 'Gaeilge'],
    ['tr', 'Türkçe'], ['ru', 'Русский']];
  let LANG = 'de', DICT = null;
  const T = (s, v) => {
    let r = (DICT && DICT[s]) || s;
    if (v) r = String(r).replace(/\{(\w+)\}/g, (m, k) => (v[k] !== undefined && v[k] !== null ? v[k] : m));
    return r;
  };
  const locale = () => (LANG === 'gsw' ? 'de-CH' : LANG);
  // Länder mit Ferien-/Feiertagsdaten bei OpenHolidays
  const COUNTRIES = ['AD', 'AL', 'AT', 'BE', 'BG', 'BR', 'BY', 'CH', 'CZ', 'DE', 'EE', 'ES', 'FR', 'HR', 'HU', 'IE', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'MT', 'MX', 'NL', 'PL', 'PT', 'RO', 'RS', 'SE', 'SI', 'SK', 'SM', 'VA', 'ZA'];
  const STATES = [['DE-BW', 'Baden-Württemberg'], ['DE-BY', 'Bayern'], ['DE-BE', 'Berlin'], ['DE-BB', 'Brandenburg'], ['DE-HB', 'Bremen'], ['DE-HH', 'Hamburg'], ['DE-HE', 'Hessen'], ['DE-MV', 'Mecklenburg-Vorpommern'], ['DE-NI', 'Niedersachsen'], ['DE-NW', 'Nordrhein-Westfalen'], ['DE-RP', 'Rheinland-Pfalz'], ['DE-SL', 'Saarland'], ['DE-SN', 'Sachsen'], ['DE-ST', 'Sachsen-Anhalt'], ['DE-SH', 'Schleswig-Holstein'], ['DE-TH', 'Thüringen']];
  // 🏠 Anwesenheit: Ferienarten und Regeln
  const HOL_TYPES = [['summer', '☀️ Sommerferien'], ['autumn', '🍂 Herbstferien'], ['xmas', '🎄 Weihnachtsferien'], ['winter', '⛷️ Winterferien'], ['easter', '🐣 Osterferien'], ['pent', '🌿 Pfingstferien']];
  const HOL_RULES = [['', 'Rhythmus läuft weiter'], ['me', 'Ganz bei mir'], ['other', 'Ganz beim anderen Elternteil'], ['first', 'Erste Hälfte bei mir'], ['second', 'Zweite Hälfte bei mir'], ['firstW', 'Erste … Wochen bei mir'], ['lastW', 'Letzte … Wochen bei mir']];
  const dayNum = (key) => { const [y, m, d] = key.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };
  const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const segAdd = (segs, a, b) => { const all = [...segs, [a, b]].sort((p, q) => p[0] - q[0]), out = []; all.forEach(([x, y]) => { if (out.length && x <= out[out.length - 1][1]) out[out.length - 1][1] = Math.max(out[out.length - 1][1], y); else out.push([x, y]); }); return out; };
  const segSub = (segs, a, b) => { const out = []; segs.forEach(([x, y]) => { if (b <= x || a >= y) { out.push([x, y]); return; } if (x < a) out.push([x, a]); if (y > b) out.push([b, y]); }); return out; };
  const keyAdd = (key, n) => { const [y, m, d] = key.split('-').map(Number); return dk(new Date(y, m - 1, d + n)); };
  // Aufgaben am Abend VOR einem Schultag (Ranzen/Turnbeutel packen)
  const PREV_TPL = ['Ranzen für morgen packen', 'Turnbeutel packen'];
  const SCHOOL_RX = /hausaufgabe|vesper|ranzen|schul|vokabel|einmaleins|elternbrief|brotdose|turnbeutel|lernen/i;
  let MON3 = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  // Saison-Vorschläge für Vorlagen: [Monat von, Monat bis]
  const SEASONS = [[/rasen/i, 4, 10], [/unkraut|blumen gießen/i, 4, 9], [/laub/i, 10, 11], [/schnee|freikratzen/i, 12, 3], [/sonnencreme/i, 5, 9], [/ernten/i, 6, 9], [/plätzchen/i, 12, 12]];
  const mdEsc = (x) => String(x).replace(/([_*`\[])/g, '\\$1');
  // 📖 Einstellungs-Abschnitt → passendes Handbuch-Thema
  const HB_TOPIC = { lang: 'update', look: 'views', vac: 'vacation', sec: 'security', f_dayBlocks: 'layout', f_routOn: 'routine', f_extraOn: 'extra', f_photoOn: 'photo', f_nfcOn: 'nfc', f_muellOn: 'trash_cal', f_calOn: 'trash_cal', f_orderOn: 'layout', f_prevOn: 'layout',
    appr: 'approval', streak: 'bonus', f_wbOn: 'bonus', f_teamOn: 'bonus', f_dblOn: 'bonus', f_bdOn: 'birthday', f_behavOn: 'today', f_negOn: 'missed', f_gradesOn: 'grades', f_goalOn: 'goal', f_progOn: 'goal', f_wishOn: 'goal', f_jokerOn: 'joker',
    f_shareOn: 'shared', f_costKidOn: 'cost', f_walletOn: 'wallet', f_priceOn: 'cost', money: 'money', notif: 'notify', when: 'notify', f_welcOn: 'presence', bg: 'background', btn: 'buttons', audio: 'audio', f_voiceOn: 'voice',
    f_lmOn: 'lametric', f_advOn: 'advent', f_zOn: 'teeth', sens: 'sensors', f_checkOn: 'stats', audit: 'trash', bk: 'backup', mem: 'storage', trash: 'trash', upd: 'update' };
  // Version der Hintergrund-Vorlage – erhöht sich, wenn sich die Automation ändert (wird dann neu geschrieben)
  const BG_V = 'v2';
  // 🔎 zusätzliche Suchwörter für Abschnitte, deren Titel das naheliegende Wort nicht enthält
  const SET_KW = { f_calOn: 'Kalender', look: 'Aussehen' };
  // 🎨 Farbvorlagen: [id, Name, Hintergrund, Kacheln, Schrift, Schrift hell, Akzent] – '' = wie das Dashboard (Home-Assistant-Theme)
  const THEMES = [
    ['light', '☀️ Hell', '#ffffff', '#f1f3f5', '#1f2430', '#6b7280', '#5b6cff'],
    ['dark', '🌙 Dunkel', '#1c1f26', '#2a2f3a', '#f1f3f5', '#a0a7b4', '#7c8cff'],
    ['pastel', '🌸 Pastell', '#fff5f8', '#ffe3ec', '#3d2c34', '#8a6b77', '#e64980'],
    ['ocean', '🌊 Ozean', '#e7f5ff', '#d0ebff', '#0b2540', '#4a6580', '#1c7ed6'],
    ['forest', '🌲 Wald', '#ebfbee', '#d3f9d8', '#1b3a22', '#4f6b55', '#2f9e44'],
    ['sun', '🌞 Sonne', '#fff9db', '#fff3bf', '#3d3200', '#7a6a2a', '#f08c00'],
    ['night', '🌌 Nacht', '#141b2d', '#1f2940', '#e7ecf7', '#98a3bd', '#ffd43b'],
    ['candy', '🍭 Bonbon', '#f8f0fc', '#eebefa', '#3b1f47', '#7d5a8a', '#ae3ec9'],
  ];
  const HEX = (v) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : '');
  const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const mixHex = (a, b, p) => `#${[1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * p + parseInt(b.slice(i, i + 2), 16) * (1 - p)).toString(16).padStart(2, '0')).join('')}`;
  // eigene Farben vervollständigen: nur Hintergrund gewählt → Schrift, Kacheln und Akzent passend dazu
  const fullCols = (v) => {
    const bg = HEX(v && v.bg) || '#ffffff', dark = lum(bg) < 0.25;
    const text = HEX(v && v.text) || (dark ? '#f1f3f5' : '#1f2430');
    return { bg, text, mu: mixHex(text, bg, 0.62), surface: HEX(v && v.surface) || mixHex(text, bg, 0.08), accent: HEX(v && v.accent) || (dark ? '#7c8cff' : '#5b6cff') };
  };
  // 🌙 Darkmode: helle Vorlagen bekommen automatisch eine dunkle Variante im gleichen Farbton („Hell“ → „Dunkel“)
  const darkOf = (t) => {
    if (lum(t[2]) < 0.25) return null; // schon dunkel
    if (t[0] === 'custom') { const a = t[6], bg = mixHex(a, '#121418', 0.1), text = mixHex(a, '#ffffff', 0.08); return { bg, surface: mixHex(a, '#121418', 0.2), text, mu: mixHex(text, bg, 0.62), accent: a }; }
    if (t[0] === 'light') { const d = THEMES.find((x) => x[0] === 'dark'); return { bg: d[2], surface: d[3], text: d[4], mu: d[5], accent: d[6] }; }
    const a = t[6], bg = mixHex(a, '#121418', 0.1), text = mixHex(a, '#ffffff', 0.08);
    return { bg, surface: mixHex(a, '#121418', 0.2), text, mu: mixHex(text, bg, 0.62), accent: a }; // Akzent bleibt gleich: auf dunklem Grund gut sichtbar, weiße Schrift darauf wie bisher
  };
  const themeCols = (id, custom, dark, darkOwn) => { if (id === 'custom') { const f = fullCols(custom); return (dark && darkOwn && darkOf(['custom', '', f.bg, f.surface, f.text, f.mu, f.accent])) || f; } const t = THEMES.find((x) => x[0] === id); if (!t) return null; return (dark && darkOf(t)) || { bg: t[2], surface: t[3], text: t[4], mu: t[5], accent: t[6] }; };
  // 🦷 Zahnputz-Vorlagen (die Bilder selbst stecken in yippee-kids-chores-teeth.js)
  const ZTPL = ['mond', 'drache', 'riff', 'baum', 'pirat', 'dino', 'feuer', 'hof', 'pinguin', 'safari', 'zirkus', 'einhorn', 'wald', 'zug'];
  const PARENT_ACTS = ['behav', 'ruadd', 'rudel', 'prprev', 'exadd', 'exdel', 'tup', 'tdown', 'slotadd', 'slotdel', 'grade', 'gapr', 'grej', 'resclean', 'updres', 'updhide', 'apr', 'aprall', 'mcopy', 'rej', 'mdec', 'rapr', 'rrej', 'wapr', 'pts', 'payout', 'ledclr', 'famreset', 'famedit', 'chkfix', 'chkok', 'abres', 'abnow', 'bkrestore', 'trres', 'pinset', 'pindel', 'ekid', 'etask', 'erew', 'cfg', 'autonew', 'atap', 'vadd', 'vdel', 'suggest', 'holnow', 'ntest', 'wtest', 'dtest', 'mtest', 'rtest', 'tgtest', 'bkdl', 'bkcopy', 'bkshare', 'abdl', 'cfair', 'vuse', 'hhide', 'psug', 'pcalc', 'lmtest', 'hb', 'hbt', 'caled', 'calhide', 'kord', 'scriptnew', 'repday', 'mueltask', 'mklist', 'rws', 'kadm', 'erout', 'wiz', 'wizstart', 'setview', 'memclean', 'cfgset'];
  const LOGO = '<svg class="logo" viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" rx="46" fill="#4a56e2"/><polygon points="100.0,30.0 122.1,76.6 173.3,83.2 135.8,118.6 145.3,169.4 100.0,144.6 54.7,169.4 64.2,118.6 26.7,83.2 77.9,76.6" fill="#ffc93c" stroke="#ffc93c" stroke-width="16" stroke-linejoin="round"/><path d="M79 100 q7 -9 14 0 M107 100 q7 -9 14 0" fill="none" stroke="#2b2d42" stroke-width="8" stroke-linecap="round"/><path d="M81 115 q19 23 38 0 z" fill="#2b2d42" stroke="#2b2d42" stroke-width="6" stroke-linejoin="round"/></svg>';
  // 📱 Kennung einer Freigabe-Nachricht (aus dem ersten Knopf) – damit sie auf allen Handys wieder entfernt werden kann (#14)
  const PUSH_GRP = { ok: 't', no: 't', rok: 'r', rno: 'r', gok: 'g', gno: 'g', me: 'm', mx: 'm', md: 'm' };
  const pushTag = (action) => { const p = String(action || '').split('|'), g = PUSH_GRP[p[1]]; return g ? `yippee_${g}_${p.slice(2).join('_')}`.replace(/[^A-Za-z0-9_-]/g, '_') : ''; };
  const TRACK = ['kid', 'task', 'reward']; // Datenprüfung: fehlen diese Einträge plötzlich, warnt die Karte
  const AUTO_IDS = { app: 'yippee_app_knoepfe', tg: 'yippee_telegram_knoepfe', cmd: 'yippee_telegram_befehle', bg: 'yippee_hintergrund', nfc: 'yippee_nfc', voice: 'yippee_sprache', famgoal: 'yippee_familienziel_erreicht', remind: 'yippee_abend_erinnerung' };
  const SCRIPT_ID = 'yippee_sterne';
  // frühere Automationen (vor der Umbenennung) – werden automatisch ersetzt
  const OLD_IDS = { app: 'kinder' + 'punkte_app_knoepfe', tg: 'kinder' + 'punkte_telegram_knoepfe', cmd: 'kinder' + 'punkte_telegram_befehle', bg: 'kinder' + 'punkte_hintergrund' };
  const APP_ID = 'yippee-kids-chores', OLD_APP = 'kinder' + 'punkte';
  // Foto-Nachweis: Datei im Medien-Ordner (Admin) oder verkleinertes Foto als Listen-Eintrag „kp|ph|…“ (alle Benutzer)
  const PH_RX = /^ph:[a-z0-9]{6,24}$/, MEDIA_RX = /^kp_[\w.-]{1,120}\.jpg$/, DATA_RX = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/;
  const PH_MAX = 90000; // Zeichen pro Foto (≈ 65 KB)
  let DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const WEEK = [1, 2, 3, 4, 5, 6, 0];
  const COLORS = ['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', '#cc5de8', '#ff922b', '#20c997', '#f06595'];
  // Die eingebauten Vorlagen nutzen nur ältere Emojis, die überall angezeigt werden. Selbst gewählte (auch neuere wie 🪥 🫧) bleiben, wie sie sind (#15).
  const AVATARS = ['🦊', '🐻', '🐼', '🦁', '🐯', '🐨', '🐸', '🦄', '🐙', '🐧', '🦖', '🐝', '🐶', '🐱', '🐰', '🦉', '👧', '👦', '🧒', '🐮', '🐷', '🐵', '🐔', '🐳', '🐬', '🦈', '🦋', '🐞', '🐢', '🦕', '🦒', '🦓', '🦔', '🦝', '🦙', '🦘', '🐲', '🐺', '🦌', '🐿️', '🦜', '🦚', '🐴', '🐭', '🐹', '👸', '🤴', '🧚', '🧜', '🦸', '🦹', '🧙', '🤖', '👽', '👻', '🎃', '⛄', '🌞', '🌈', '⭐', '🚀', '⚽', '🎸', '👩', '👨', '🧑', '👱'];
  // Belohnungs-Vorlagen: [Emoji, Titel, Punkte]
  const REWARD_TEMPLATES = [
    ['🍦', 'Eisgutschein', 20], ['🍫', 'Süßigkeit aussuchen', 10], ['🥞', 'Pfannkuchen zum Frühstück', 20], ['🍕', 'Lieblingsessen aussuchen', 30],
    ['📺', '30 Min. extra Fernsehen', 15], ['🎮', '30 Min. extra Spielzeit', 15], ['🌙', '30 Min. länger aufbleiben', 25], ['💶', '1 € Taschengeld', 10],
    ['🎲', 'Spieleabend mit Mama/Papa', 40], ['🍿', 'Filmabend mit Popcorn', 40], ['🎨', 'Bastelnachmittag', 25], ['🚲', 'Fahrradtour', 30],
    ['🎠', 'Ausflug zum Spielplatz', 25], ['👫', 'Freund/in einladen', 50], ['🛏️', 'Übernachtung bei Freunden', 60], ['📚', 'Neues Buch', 60],
    ['🧸', 'Kleines Spielzeug', 80], ['🏊', 'Schwimmbad', 80], ['🎟️', 'Kino', 100], ['🦁', 'Zoo', 120], ['🎢', 'Freizeitpark', 150],
    ['🎵', 'Musik im Auto aussuchen', 10], ['📱', '30 Min. Handyzeit', 15], ['🃏', 'Joker: eine Aufgabe auslassen', 30, 'joker'], ['👩‍👧', 'Exklusivzeit mit Mama oder Papa', 40],
    ['🎧', 'Neues Hörspiel', 40], ['🕙', 'Länger ausgehen dürfen', 40], ['💶', '5 € Taschengeld', 50], ['🍔', 'Essen gehen (Fast Food)', 50],
    ['🎂', 'Lieblingskuchen backen', 30], ['🧁', 'Muffins backen', 25], ['🍩', 'Donut vom Bäcker', 15], ['🍳', 'Frühstück im Bett', 30],
    ['📺', 'Serienfolge extra', 10], ['💶', '2 € Taschengeld', 20], ['🎤', 'Karaoke-Abend', 30], ['🧩', 'Neues Puzzle', 40],
    ['🎨', 'Malbuch oder neue Stifte', 30], ['🛁', 'Schaumbad', 15], ['🛏️', 'Im Wohnzimmer übernachten', 40], ['⛺', 'Zelten im Garten', 50],
    ['🏖️', 'Tag am See', 60], ['🏰', 'Museum oder Burg besuchen', 60], ['🎳', 'Bowling', 80], ['⛸️', 'Eislaufen', 70],
    ['🧗', 'Kletterhalle', 100], ['🐬', 'Aquarium', 120], ['🎪', 'Zirkus', 120], ['🚂', 'Zugfahrt in eine andere Stadt', 120],
    ['🧸', 'Kuscheltier aussuchen', 60], ['🕹️', 'Neues Spiel (App oder Konsole)', 80],
  ];
  // Emoji-Auswahl in Gruppen: [Überschrift, Emojis] – nur Emojis bis Unicode 11 (laufen auch auf älteren Geräten)
  const TASK_EMOJI_GROUPS = [['🧼 Körperpflege & Anziehen', ['🦷', '🚿', '🛁', '🧼', '🧴', '🧽', '💇', '💅', '🚽', '🧻', '👕', '👚', '👖', '👗', '🧦', '👟', '👞', '🥾', '🧥', '🧤', '🧣', '🧢', '👒', '🎒', '🛏️', '😴', '💤', '⏰']], ['🍽️ Essen & Küche', ['🥣', '🍳', '🍽️', '🍴', '🥄', '🔪', '🍱', '🥪', '🥕', '🥦', '🥒', '🍅', '🍎', '🍌', '🍓', '🍇', '🥛', '🧀', '🥚', '🍞', '🥐', '🥖', '🥗', '🍝', '🍲', '🍜', '🥘', '🍚', '🍕', '🥧', '🍰', '🧁', '🍪', '🥤', '🚰', '☕', '🍯', '🧂', '🥫']], ['🧹 Haushalt', ['🧹', '🧺', '🧽', '🗑️', '♻️', '❄️', '🚪', '🛋️', '🏠', '🏡', '🔑', '📦', '🧸', '🖼️', '💡', '🔌', '🔋', '🧯', '🌬️', '♨️', '✨', '🧷', '🧵', '🧶', '👔', '📬', '📮', '🛒', '🛍️', '🧾', '💶', '💰', '🐖']], ['🎒 Schule & Lernen', ['📝', '📚', '📖', '📓', '📒', '📏', '📐', '✏️', '🖊️', '🖍️', '🖌️', '✂️', '📎', '📋', '🔢', '🔤', '🗣️', '🧮', '🔬', '🔭', '🧪', '🌍', '🗺️', '💻', '⌨️', '🖥️', '📅', '🗓️', '🎓', '🏫']], ['⚽ Sport, Musik & Hobby', ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🏒', '⛸️', '🎿', '🛷', '🏊', '🚴', '🏃', '🧘', '🤸', '🏋️', '🥋', '🧗', '🛹', '🚲', '🛴', '🎹', '🎸', '🥁', '🎻', '🎺', '🎷', '🎤', '🎨', '🧩', '♟️', '🎲', '📷']], ['🐾 Tiere, Garten & Wetter', ['🐶', '🐕', '🐱', '🐈', '🐹', '🐰', '🐭', '🐦', '🐤', '🐔', '🐴', '🐢', '🐠', '🐟', '🦜', '🐞', '🐝', '🦋', '🐌', '🐾', '🌱', '🌿', '🍀', '🌻', '🌷', '🌳', '🍂', '🍁', '🌾', '🚜', '💧', '🌧️', '☀️', '⛄']], ['🚗 Unterwegs & Technik', ['🚗', '🚙', '🚌', '🚶', '🚸', '🚦', '🏪', '🏥', '⛽', '🔧', '🔨', '🧰', '📱', '📵', '📺', '🎧', '📸']], ['❤️ Familie & Miteinander', ['👶', '👧', '👦', '👩', '👨', '👵', '👴', '👪', '🤝', '🙏', '❤️', '💌', '🎁', '🎉', '😊', '🤗', '👍', '💪', '🙋', '📞', '✉️']], ['⭐ Sonstiges', ['⭐', '🌟', '🎯', '✅', '📌', '🔔', '🏆', '🥇', '🎖️', '💎', '🔥', '🚀', '🌈']]];
  const TASK_EMOJIS = [...new Set(TASK_EMOJI_GROUPS.flatMap((g) => g[1]))];
  const REWARD_EMOJI_GROUPS = [['🍦 Leckereien', ['🍦', '🍨', '🍧', '🍫', '🍭', '🍬', '🍰', '🎂', '🧁', '🍩', '🍪', '🥞', '🍕', '🍔', '🍟', '🌭', '🌮', '🌯', '🍝', '🍣', '🥨', '🍿', '🥤', '🍹', '🍓', '🍉']], ['🎮 Medien & Spiele', ['📺', '🎮', '🕹️', '📱', '💻', '🎧', '🎬', '🎥', '📚', '📖', '🎲', '🧩', '♟️', '🃏', '🎳', '🎯', '🧸', '🎈', '🎤', '🎵']], ['🎢 Ausflüge & Erlebnisse', ['🎢', '🎡', '🎠', '🎪', '🎟️', '🎫', '🏊', '🏖️', '🏕️', '⛺', '🧗', '⛸️', '🛷', '🎿', '🚲', '🛶', '🐴', '🦁', '🐘', '🦒', '🐬', '🦖', '🏰', '🌳', '🏔️', '🚗', '🚂', '✈️', '🚀', '🌍']], ['🌙 Zeit & Freiheiten', ['🌙', '😴', '💤', '🛏️', '⏰', '🕙', '👫', '👪', '🤗', '💬', '🎉', '🎊', '🏠']], ['🎨 Kreatives & Musik', ['🎨', '🖍️', '✂️', '🧶', '🎹', '🎸', '🥁', '🎻', '🎺', '📷', '🌻']], ['🎁 Geschenke & Sonstiges', ['🎁', '💶', '💰', '🐖', '👟', '👕', '👗', '🧢', '🛍️', '👑', '⭐', '🌟', '💎', '🏆', '🥇', '🦄', '🐶', '🐱', '🐠', '🌈']]];
  const REWARD_EMOJIS = [...new Set(REWARD_EMOJI_GROUPS.flatMap((g) => g[1]))];

  // Vorlagen: [Kategorie, Emoji, Titel, Punkte, Zeitfenster, Tage, ab Alter, bis Alter]
  // Zeitfenster: 'm' Morgens, 'mi' Mittags, 'a' Abends, '' ganzer Tag oder ['von','bis']
  // Tage: null = täglich, [1,2,3,4,5] = Mo–Fr (0 = So), 'dates' = bestimmte Termine, 'once' = einmalig
  const WINDOWS = { m: ['06:45', '10:00'], mi: ['12:00', '18:00'], a: ['19:00', '23:59'] };
  const SCHOOL = [1, 2, 3, 4, 5];
  const SA = [6];
  // 📋 Routinen: mehrere Schritte in einer Aufgabe (Zusatzfunktion)
  const ROUT_STEPS = {
    'Morgen-Routine': ['⏰ Aufstehen', '🚽 Toilette', '🦷 Zähne putzen', '👕 Anziehen', '💇 Haare kämmen', '🥣 Frühstücken', '👟 Schuhe & Jacke anziehen'],
    'Abend-Routine': ['🧸 Spielsachen wegräumen', '🚿 Waschen', '🦷 Zähne putzen', '👕 Pyjama anziehen', '👚 Kleidung für morgen rauslegen', '📖 Lesen oder vorlesen lassen'],
    'Nach-der-Schule-Routine': ['👟 Schuhe & Jacke aufräumen', '🍱 Vesperdose ausräumen', '🧼 Hände waschen', '🍎 Snack essen', '📝 Hausaufgaben machen', '🎒 Ranzen für morgen packen'],
    'Hausaufgaben-Routine': ['📵 Handy weglegen', '📋 Hausaufgabenheft anschauen', '✏️ Arbeitsplatz vorbereiten', '📝 Aufgaben erledigen', '✅ Nochmal kontrollieren', '🎒 Alles in den Ranzen packen'],
    'Zimmer-Routine': ['🧸 Spielsachen wegräumen', '👕 Kleidung aufräumen', '🛏️ Bett machen', '🗑️ Mülleimer leeren', '🧹 Staubsaugen', '🌬️ Lüften'],
    'Wochenend-Routine': ['⏰ Aufstehen', '🦷 Zähne putzen', '👕 Anziehen', '🛏️ Bett machen', '🥣 Beim Frühstück helfen', '🌬️ Zimmer lüften'],
    // neu in 1.5.0
    'Mittagsschlaf-Routine': ['🚽 Toilette', '🧼 Hände waschen', '👕 Bequeme Sachen anziehen', '🧸 Kuscheltier holen', '📖 Kurze Geschichte hören', '😴 Hinlegen & ausruhen', '🥤 Nach dem Aufwachen etwas trinken'],
    'Bade-Routine': ['🧺 Kleidung in den Wäschekorb', '🛁 In die Badewanne', '🧴 Haare waschen', '🧖 Abtrocknen', '🧴 Eincremen', '👕 Pyjama anziehen', '🦆 Badespielzeug aufräumen'],
    'Essens-Routine': ['🧼 Hände waschen', '🍽️ Tisch decken', '🍝 Gemeinsam essen', '🍽️ Teller in die Küche bringen', '🧽 Tisch abwischen'],
    'Haustier-Routine': ['🐶 Haustier füttern', '💧 Frisches Wasser geben', '🐾 Gassi gehen oder spielen', '🧹 Napf und Schlafplatz sauber machen'],
    'Sport-Routine': ['🎽 Sportsachen einpacken', '👟 Sportschuhe einpacken', '💧 Trinkflasche füllen', '🚿 Nach dem Sport duschen', '🧺 Sportsachen in die Wäsche'],
  };
  // Einrichtungs-Assistent: vorausgewählte Start-Aufgaben und -Belohnungen (nur die zum Alter passenden werden angezeigt)
  const WIZ_TASKS = ['Aufstehen', 'Zähne putzen morgens', 'Bett machen', 'Selbst anziehen', 'Hausaufgaben machen', 'Ranzen für morgen packen', 'Tisch decken', 'Zimmer aufräumen', 'Spielsachen wegräumen', 'Zähne putzen abends', 'Pyjama anziehen', 'Spülmaschine ausräumen', 'Müll rausbringen'];
  const WIZ_REWARDS = ['Eisgutschein', '30 Min. extra Fernsehen', 'Lieblingsessen aussuchen', 'Filmabend mit Popcorn', 'Kino'];
  const TEMPLATES = [
    ['🌅 Morgens', '🌅', 'Morgen-Routine', 3, 'm', null, 4, 14],
    ['🌙 Abends', '🌙', 'Abend-Routine', 3, 'a', null, 4, 14],
    ['🌅 Morgens', '⏰', 'Aufstehen', 1, 'm', null, 3, 12],
    ['🌅 Morgens', '🥣', 'Frühstücken', 1, 'm', null, 2, 8],
    ['🌅 Morgens', '👟', 'Schuhe anziehen', 1, 'm', null, 3, 7],
    ['🌅 Morgens', '🧥', 'Jacke anziehen', 1, 'm', null, 3, 7],
    ['🌅 Morgens', '🧦', 'Socken selbst anziehen', 1, 'm', null, 2, 6],
    ['🌅 Morgens', '⏰', 'Selbst mit Wecker aufstehen', 2, 'm', SCHOOL, 9],
    ['🌅 Morgens', '🌬️', 'Zimmer lüften', 1, 'm', null, 8],
    ['☀️ Mittags', '🍽️', 'Mittagessen', 1, 'mi', null, 2, 8],
    ['☀️ Mittags', '🎒', 'Sachen wegräumen', 1, 'mi', null, 3, 8],
    ['☀️ Mittags', '🥪', 'Vesper essen', 1, ['15:30', '17:30'], SCHOOL, 4, 10],
    ['🌅 Morgens', '🛏️', 'Bett machen', 1, 'm', null, 4],
    ['🌅 Morgens', '🦷', 'Zähne putzen morgens', 1, 'm', null, 2],
    ['🌅 Morgens', '👕', 'Selbst anziehen', 1, 'm', null, 3, 9],
    ['🌅 Morgens', '💇', 'Haare kämmen', 1, 'm', null, 3, 11],
    ['🌅 Morgens', '🥣', 'Frühstücksgeschirr abräumen', 1, 'm', null, 3],
    ['🌅 Morgens', '🍱', 'Vesperdose einpacken', 1, 'm', SCHOOL, 6],
    ['🌅 Morgens', '🥪', 'Vesper selbst machen', 2, 'm', SCHOOL, 8],
    ['🌅 Morgens', '🍳', 'Frühstück für die Familie machen', 3, '', [6, 0], 11],
    ['🎒 Schule', '🚰', 'Vesperdose ausräumen', 1, 'mi', SCHOOL, 6],
    ['🎒 Schule', '📝', 'Hausaufgaben machen', 3, 'mi', SCHOOL, 6],
    ['🎒 Schule', '📚', 'Lesen üben (15 Min.)', 2, '', null, 6, 12],
    ['🎒 Schule', '🔢', 'Einmaleins üben', 2, '', SCHOOL, 7, 10],
    ['🎒 Schule', '🗣️', 'Vokabeln lernen', 2, '', SCHOOL, 9],
    ['🎒 Schule', '🎒', 'Ranzen für morgen packen', 2, 'a', [0, 1, 2, 3, 4], 6],
    ['🎒 Schule', '🖍️', 'Federmäppchen auffüllen', 1, '', [0], 6, 12],
    ['🎒 Schule', '📋', 'Elternbriefe abgeben', 1, 'mi', SCHOOL, 6, 14],
    ['🎒 Schule', '👟', 'Schuhe & Jacke aufräumen', 1, 'mi', null, 3],
    ['🎒 Schule', '🎹', 'Instrument üben', 2, '', null, 6],
    ['🎒 Schule', '🥤', 'Trinkflasche für die Schule füllen', 1, 'm', SCHOOL, 6],
    ['🎒 Schule', '🚌', 'Allein zur Schule gehen', 2, 'm', SCHOOL, 8],
    ['🎒 Schule', '🔑', 'An den Haustürschlüssel denken', 1, 'm', SCHOOL, 10],
    ['🎒 Schule', '📒', 'Hausaufgabenheft zeigen', 1, 'mi', SCHOOL, 6, 10],
    ['🎒 Schule', '🎽', 'Turnbeutel packen', 1, 'a', [0, 1, 2, 3, 4], 6, 10],
    ['🎒 Schule', '✏️', 'Schreiben üben', 2, '', SCHOOL, 6, 8],
    ['🎒 Schule', '🧮', 'Kopfrechnen üben', 2, '', SCHOOL, 7, 10],
    ['🎒 Schule', '💻', 'Lern-App (15 Min.)', 2, '', SCHOOL, 7, 12],
    ['🎒 Schule', '🎒', 'Schulranzen ausmisten', 2, '', [5], 7],
    ['🎒 Schule', '📂', 'Ordner und Hefte sortieren', 2, '', [0], 10],
    ['🎒 Schule', '📝', 'Für die Klassenarbeit lernen', 3, '', 'once', 9],
    ['🎒 Schule', '🎤', 'Referat vorbereiten', 3, '', 'once', 10],
    ['🎒 Schule', '👩‍🏫', 'Geschwistern bei den Hausaufgaben helfen', 3, 'mi', SCHOOL, 11],
    ['🍽️ Küche & Essen', '🍽️', 'Tisch decken', 1, '', null, 3],
    ['🍽️ Küche & Essen', '🧽', 'Tisch abräumen & abwischen', 1, '', null, 6],
    ['🍽️ Küche & Essen', '🧼', 'Spülmaschine ausräumen', 2, '', null, 7],
    ['🍽️ Küche & Essen', '🍴', 'Spülmaschine einräumen', 2, '', null, 8],
    ['🍽️ Küche & Essen', '💧', 'Getränke auffüllen', 1, '', null, 6],
    ['🍽️ Küche & Essen', '🥕', 'Beim Kochen helfen', 2, '', [6, 0], 4, 11],
    ['🍽️ Küche & Essen', '🥗', 'Gemüse waschen & schnippeln', 2, '', [6, 0], 9],
    ['🍽️ Küche & Essen', '♻️', 'Leergut wegbringen', 1, '', SA, 9],
    ['🍽️ Küche & Essen', '❄️', 'Kühlschrank auswischen', 3, '', 'once', 10],
    ['🍽️ Küche & Essen', '🍽️', 'Teller in die Küche bringen', 1, '', null, 2, 7],
    ['🍽️ Küche & Essen', '🥄', 'Besteck sortieren', 1, '', null, 4, 9],
    ['🍽️ Küche & Essen', '🛍️', 'Einkäufe einräumen', 1, '', SA, 6],
    ['🍽️ Küche & Essen', '🗑️', 'Küchenmülleimer leeren', 1, '', null, 8],
    ['🍽️ Küche & Essen', '🧁', 'Backen helfen', 2, '', [0], 3, 12],
    ['🍽️ Küche & Essen', '🍪', 'Plätzchen backen helfen', 2, '', [6, 0], 3, 12],
    ['🍽️ Küche & Essen', '🍳', 'Rührei machen', 2, '', [6, 0], 9],
    ['🍽️ Küche & Essen', '🍕', 'Pizza selbst belegen', 2, '', [5], 6, 12],
    ['🍽️ Küche & Essen', '🍝', 'Einfaches Essen kochen (z. B. Nudeln)', 4, '', SA, 11],
    ['🍽️ Küche & Essen', '📝', 'Wochenessen mitplanen', 2, '', [0], 12],
    ['🍽️ Küche & Essen', '🍲', 'Komplette Mahlzeit kochen', 6, '', [0], 13],
    ['🛒 Einkaufen', '🥖', 'Brötchen / Kleinigkeit einkaufen', 2, '', SA, 9],
    ['🛒 Einkaufen', '🛒', 'Einkauf mit Einkaufsliste', 4, '', SA, 12],
    ['🛒 Einkaufen', '🛍️', 'Wocheneinkauf erledigen', 6, '', SA, 15],
    ['🛒 Einkaufen', '🧾', 'Einkaufsliste schreiben', 1, '', [5], 8],
    ['🧹 Ordnung & Putzen', '🧸', 'Zimmer aufräumen', 3, '', SA, 4],
    ['🧹 Ordnung & Putzen', '📦', 'Spielsachen wegräumen', 1, 'a', null, 2, 10],
    ['🧹 Ordnung & Putzen', '🛋️', 'Sofakissen ordentlich hinlegen', 1, '', null, 3, 9],
    ['🧹 Ordnung & Putzen', '🧹', 'Staub wischen', 2, '', SA, 6],
    ['🧹 Ordnung & Putzen', '🧻', 'Klopapier auffüllen', 1, '', SA, 6],
    ['🧹 Ordnung & Putzen', '🚪', 'Flur / Garderobe aufräumen', 1, '', SA, 6],
    ['🧹 Ordnung & Putzen', '🧹', 'Fegen', 2, '', SA, 7],
    ['🧹 Ordnung & Putzen', '🧹', 'Staubsaugen (eigenes Zimmer)', 2, '', SA, 8],
    ['🧹 Ordnung & Putzen', '🛁', 'Waschbecken putzen', 2, '', SA, 8],
    ['🧹 Ordnung & Putzen', '✨', 'Spiegel putzen', 2, '', SA, 8],
    ['🧹 Ordnung & Putzen', '🧽', 'Wischen', 2, '', SA, 9],
    ['🧹 Ordnung & Putzen', '🏠', 'Staubsaugen (ganze Wohnung)', 4, '', SA, 11],
    ['🧹 Ordnung & Putzen', '🚽', 'Bad komplett putzen', 5, '', SA, 12],
    ['🧹 Ordnung & Putzen', '🧽', 'Fenster putzen', 4, '', 'once', 13],
    ['🧹 Ordnung & Putzen', '🗄️', 'Schreibtisch aufräumen', 1, '', [0], 8],
    ['🧹 Ordnung & Putzen', '🧸', 'Spielzeug aussortieren (zum Verschenken)', 3, '', 'once', 7],
    ['🧹 Ordnung & Putzen', '🛁', 'Badewanne putzen', 2, '', SA, 10],
    ['🧹 Ordnung & Putzen', '🚽', 'Toilette putzen', 3, '', SA, 12],
    ['🧺 Wäsche', '🧦', 'Schmutzwäsche in den Korb', 1, 'a', null, 2, 12],
    ['🧺 Wäsche', '🧦', 'Socken paarweise sortieren', 1, '', SA, 4, 10],
    ['🧺 Wäsche', '🧺', 'Saubere Wäsche einräumen', 2, '', SA, 6],
    ['🧺 Wäsche', '👚', 'Kleidung für morgen rauslegen', 1, 'a', [0, 1, 2, 3, 4], 6, 12],
    ['🧺 Wäsche', '👕', 'Wäsche zusammenlegen', 2, '', SA, 7],
    ['🧺 Wäsche', '👟', 'Schuhe putzen', 2, '', SA, 8],
    ['🧺 Wäsche', '🛏️', 'Bettwäsche beziehen', 3, '', 'once', 9],
    ['🧺 Wäsche', '👔', 'Wäsche aufhängen', 2, '', SA, 10],
    ['🧺 Wäsche', '🧼', 'Waschmaschine befüllen & starten', 3, '', SA, 12],
    ['🧺 Wäsche', '♨️', 'Bügeln (einfache Teile)', 3, '', SA, 14],
    ['🧺 Wäsche', '👕', 'Kleidung ordentlich aufhängen', 1, 'a', null, 7],
    ['🧺 Wäsche', '🧺', 'Eigene Wäsche komplett waschen', 4, '', SA, 13],
    ['🏡 Haus, Garten & Tiere', '🐶', 'Haustier füttern', 1, '', null, 3],
    ['🏡 Haus, Garten & Tiere', '🌱', 'Blumen gießen', 1, '', [3, 6], 3],
    ['🏡 Haus, Garten & Tiere', '♻️', 'Müll trennen', 1, '', null, 6],
    ['🏡 Haus, Garten & Tiere', '📬', 'Briefkasten leeren', 1, 'mi', SCHOOL, 6],
    ['🏡 Haus, Garten & Tiere', '🌿', 'Unkraut zupfen', 2, '', SA, 7],
    ['🏡 Haus, Garten & Tiere', '🚗', 'Beim Autowaschen helfen', 2, '', 'once', 7],
    ['🏡 Haus, Garten & Tiere', '🗑️', 'Müll rausbringen', 2, '', 'dates', 8],
    ['🏡 Haus, Garten & Tiere', '♻️', 'Altpapier / Gelber Sack', 1, '', 'dates', 8],
    ['🏡 Haus, Garten & Tiere', '🍂', 'Laub rechen', 3, '', 'once', 8],
    ['🏡 Haus, Garten & Tiere', '🐕', 'Hund ausführen', 2, '', null, 10],
    ['🏡 Haus, Garten & Tiere', '🐹', 'Käfig / Katzenklo sauber machen', 3, '', SA, 10],
    ['🏡 Haus, Garten & Tiere', '❄️', 'Schnee schippen', 3, '', 'once', 10],
    ['🏡 Haus, Garten & Tiere', '🚲', 'Fahrrad pflegen (Luft, Kette)', 2, '', 'once', 10],
    ['🏡 Haus, Garten & Tiere', '🌾', 'Rasenmähen (Schiebemäher)', 3, ['10:00', '18:00'], SA, 12],
    ['🏡 Haus, Garten & Tiere', '🚜', 'Rasenmähen (Aufsitzmäher)', 4, ['10:00', '18:00'], SA, 16],
    ['🏡 Haus, Garten & Tiere', '🐠', 'Fische füttern', 1, '', null, 3],
    ['🏡 Haus, Garten & Tiere', '🐈', 'Katze bürsten', 1, '', [3, 0], 6],
    ['🏡 Haus, Garten & Tiere', '🐰', 'Kaninchenstall ausmisten', 3, '', SA, 9],
    ['🏡 Haus, Garten & Tiere', '🍓', 'Obst im Garten ernten', 2, '', SA, 3],
    ['🏡 Haus, Garten & Tiere', '🛢️', 'Mülltonnen reinholen', 1, '', 'dates', 8],
    ['🏡 Haus, Garten & Tiere', '🎄', 'Weihnachtsbaum schmücken helfen', 2, '', 'once', 3],
    ['🏡 Haus, Garten & Tiere', '🚲', 'Fahrrad winterfest machen', 3, '', 'once', 10],
    ['🏡 Haus, Garten & Tiere', '🧽', 'Auto waschen', 4, '', 'once', 14],
    ['🏡 Haus, Garten & Tiere', '🚗', 'Autoscheiben freikratzen', 2, 'm', SCHOOL, 16],
    ['🧑 Verantwortung', '📵', 'Handy / Tablet pünktlich abgeben', 2, 'a', null, 8, 15],
    ['🧑 Verantwortung', '🧾', 'Taschengeld-Budget führen', 1, '', [0], 12],
    ['🧑 Verantwortung', '🚙', 'Auto innen saugen', 3, '', 'once', 12],
    ['🧑 Verantwortung', '🔧', 'Bei Reparaturen helfen', 3, '', 'once', 12],
    ['🧑 Verantwortung', '📅', 'Eigene Termine selbst planen', 1, '', [0], 13],
    ['🧑 Verantwortung', '👶', 'Auf jüngere Geschwister aufpassen', 4, '', 'once', 14],
    ['🧑 Verantwortung', '🐷', 'Taschengeld ins Sparschwein', 1, '', [0], 6, 11],
    ['🧑 Verantwortung', '🧳', 'Eigenen Koffer packen', 2, '', 'once', 8],
    ['🧑 Verantwortung', '📅', 'Arzt- oder Friseurtermin selbst ausmachen', 2, '', 'once', 15],
    ['❤️ Gesundheit & Bewegung', '🧼', 'Hände waschen', 1, 'm+mi+a', null, 2, 8],
    ['❤️ Gesundheit & Bewegung', '🚽', 'Aufs Klo gehen', 1, 'm+mi+a', null, 2, 6],
    ['❤️ Gesundheit & Bewegung', '💧', 'Genug Wasser trinken', 1, '', null, 2, 10],
    ['❤️ Gesundheit & Bewegung', '🍎', 'Obst oder Gemüse essen', 1, '', null, 2, 12],
    ['❤️ Gesundheit & Bewegung', '🥦', 'Neues Essen probieren', 2, '', null, 2, 10],
    ['❤️ Gesundheit & Bewegung', '🌳', '30 Min. draußen spielen', 2, '', null, 2, 14],
    ['❤️ Gesundheit & Bewegung', '🧴', 'Sonnencreme auftragen', 1, 'm', null, 3, 10],
    ['❤️ Gesundheit & Bewegung', '🤸', 'Bewegungspause', 1, 'mi', null, 6, 12],
    ['❤️ Gesundheit & Bewegung', '🚿', 'Haare selbst waschen', 1, 'a', [3, 6], 6, 12],
    ['❤️ Gesundheit & Bewegung', '⚽', 'Training / Sport', 2, '', null, 8],
    ['❤️ Gesundheit & Bewegung', '🚴', 'Mit dem Fahrrad zur Schule', 2, 'm', SCHOOL, 9],
    ['❤️ Gesundheit & Bewegung', '🧵', 'Zahnseide benutzen', 1, 'a', null, 10],
    ['❤️ Gesundheit & Bewegung', '🧘', 'Dehnen / Yoga (10 Min.)', 1, '', null, 10],
    ['❤️ Gesundheit & Bewegung', '🛌', 'Pünktlich schlafen gehen', 1, 'a', null, 11],
    ['👨‍👩‍👧 Familie & Miteinander', '🎲', 'Mit Geschwistern spielen', 1, '', null, 2, 12],
    ['👨‍👩‍👧 Familie & Miteinander', '🎨', 'Bild für Oma oder Opa malen', 1, '', 'once', 2, 9],
    ['👨‍👩‍👧 Familie & Miteinander', '🤗', 'Jemandem eine Freude machen', 2, '', null, 3],
    ['👨‍👩‍👧 Familie & Miteinander', '☎️', 'Oma oder Opa anrufen', 2, '', [0], 6],
    ['👨‍👩‍👧 Familie & Miteinander', '💌', 'Dankeskarte schreiben', 2, '', 'once', 6],
    ['👨‍👩‍👧 Familie & Miteinander', '📵', 'Handyfreie Stunde', 2, 'a', null, 10],
    ['👨‍👩‍👧 Familie & Miteinander', '🏡', 'Nachbarn helfen', 3, '', 'once', 10],
    ['🌙 Abends', '🚿', 'Duschen / Waschen', 1, ['19:00', '21:00'], null, 3],
    ['🌙 Abends', '🦷', 'Zähne putzen abends', 1, 'a', null, 2],
    ['🌙 Abends', '👕', 'Pyjama anziehen', 1, 'a', null, 2, 8],
    ['🌙 Abends', '🍽️', 'Abendessen', 1, ['17:30', '19:30'], null, 2, 8],
    ['🌙 Abends', '📚', 'Buch anschauen / vorlesen lassen', 1, 'a', null, 2, 6],
    ['🌙 Abends', '📖', 'Selbst vorlesen', 1, 'a', null, 7, 9],
    ['🌙 Abends', '📖', '15 Min. lesen vor dem Schlafen', 2, 'a', null, 10, 15],
    ['🌙 Abends', '🧸', 'Kuscheltiere ins Bett bringen', 1, 'a', null, 2, 6],
    ['🌙 Abends', '🛁', 'Baden', 1, ['18:00', '20:00'], [3, 6], 2, 8],
    ['🌙 Abends', '🗣️', 'Vom Tag erzählen', 1, 'a', null, 3, 10],
    ['🌙 Abends', '💡', 'Licht und Geräte ausschalten', 1, 'a', null, 6],
    ['🌙 Abends', '📝', 'Tagebuch schreiben', 1, 'a', null, 8],
    ['🌙 Abends', '🔌', 'Handy und Tablet laden', 1, 'a', null, 10],
    ['🌙 Abends', '😴', 'Ins Bett gehen', 1, 'a', null, 2, 10],
    // neu in 1.4.0
    ['☀️ Mittags', '🏫', 'Nach-der-Schule-Routine', 3, 'mi', SCHOOL, 6, 12],
    ['🎒 Schule', '📝', 'Hausaufgaben-Routine', 3, 'mi', SCHOOL, 7, 14],
    ['🧹 Ordnung & Putzen', '🧹', 'Zimmer-Routine', 3, '', [6], 5, 14],
    ['🌅 Morgens', '🌞', 'Wochenend-Routine', 2, 'm', [6, 0], 5, 14],
    // neu in 1.5.0
    ['☀️ Mittags', '😴', 'Mittagsschlaf-Routine', 2, ['12:30', '15:00'], null, 2, 6],
    ['☀️ Mittags', '🤫', 'Mittagsruhe (leise spielen)', 1, ['13:00', '14:00'], null, 5, 10],
    ['🌙 Abends', '🛁', 'Bade-Routine', 2, ['18:00', '20:00'], [3, 6], 4, 8],
    ['🍽️ Küche & Essen', '🍽️', 'Essens-Routine', 2, '', null, 4, 14],
    ['🏡 Haus, Garten & Tiere', '🐾', 'Haustier-Routine', 2, '', null, 6, 14],
    ['❤️ Gesundheit & Bewegung', '⚽', 'Sport-Routine', 2, '', null, 6, 14],
    ['🌅 Morgens', '💧', 'Gesicht waschen', 1, 'm', null, 4],
    ['🌅 Morgens', '👕', 'Schlafanzug zusammenlegen', 1, 'm', null, 5],
    ['🌅 Morgens', '🎒', 'Ranzen-Check: alles dabei?', 1, 'm', SCHOOL, 6, 12],
    ['🎒 Schule', '📖', 'Bibliotheksbuch zurückgeben', 1, '', 'once', 7],
    ['🎒 Schule', '✏️', 'Stifte spitzen', 1, '', SCHOOL, 6, 12],
    ['🎒 Schule', '📅', 'Stundenplan für morgen checken', 1, 'a', SCHOOL, 8],
    ['🍽️ Küche & Essen', '🥗', 'Salat zubereiten', 2, '', null, 9],
    ['🍽️ Küche & Essen', '🍞', 'Brote für die Familie schmieren', 2, '', null, 8],
    ['🍽️ Küche & Essen', '🍽️', 'Geschirr abtrocknen', 1, '', null, 7],
    ['🍽️ Küche & Essen', '🧽', 'Geschirr von Hand spülen', 2, '', null, 9],
    ['🍽️ Küche & Essen', '🍎', 'Obstteller schneiden', 1, '', null, 8],
    ['🧹 Ordnung & Putzen', '🛏️', 'Unter dem Bett aufräumen', 1, '', [6], 6],
    ['🧹 Ordnung & Putzen', '🚪', 'Türklinken abwischen', 1, '', [6], 8],
    ['🧹 Ordnung & Putzen', '🗑️', 'Mülleimer im Zimmer leeren', 1, '', [6], 6],
    ['🧹 Ordnung & Putzen', '🧸', 'Kuscheltiere aufräumen', 1, '', null, 4, 8],
    ['🧹 Ordnung & Putzen', '📚', 'Bücherregal sortieren', 1, '', [6], 6],
    ['🧺 Wäsche', '👖', 'Hosentaschen vor dem Waschen leeren', 1, '', null, 6],
    ['🧺 Wäsche', '🧺', 'Wäsche abnehmen', 1, '', null, 7],
    ['🏡 Haus, Garten & Tiere', '💧', 'Wassernapf auffüllen', 1, '', null, 5],
    ['🏡 Haus, Garten & Tiere', '🌱', 'Gemüsebeet gießen', 1, '', null, 6],
    ['🏡 Haus, Garten & Tiere', '🐦', 'Vögel im Winter füttern', 1, '', null, 5],
    ['🏡 Haus, Garten & Tiere', '🌻', 'Blumen pflanzen', 2, '', 'once', 6],
    ['🏡 Haus, Garten & Tiere', '🐕', 'Hundehaufen im Garten aufsammeln', 2, '', [6], 8],
    ['🏡 Haus, Garten & Tiere', '🍂', 'Terrasse fegen', 2, '', [6], 8],
    ['🛒 Einkaufen', '🛍️', 'Einkaufstaschen tragen', 1, '', null, 5],
    ['🛒 Einkaufen', '🧾', 'Preise beim Einkauf vergleichen', 1, '', null, 9],
    ['🧑 Verantwortung', '⏰', 'Wecker selbst stellen', 1, 'a', SCHOOL, 8],
    ['🧑 Verantwortung', '📱', 'Bildschirmzeit einhalten', 2, '', null, 6],
    ['🧑 Verantwortung', '🔑', 'Haustür abschließen', 1, '', null, 9],
    ['❤️ Gesundheit & Bewegung', '🚶', 'Spaziergang mit der Familie', 1, '', null, 4],
    ['❤️ Gesundheit & Bewegung', '🤸', 'Turnübungen / Purzelbaum', 1, '', null, 4, 8],
    ['❤️ Gesundheit & Bewegung', '🏊', 'Schwimmen üben', 2, '', null, 5],
    ['👨‍👩‍👧 Familie & Miteinander', '🎲', 'Spieleabend vorbereiten', 1, '', [5, 6], 6],
    ['👨‍👩‍👧 Familie & Miteinander', '🤝', 'Streit friedlich lösen', 2, '', null, 5],
    ['👨‍👩‍👧 Familie & Miteinander', '🙏', 'Danke sagen', 1, '', null, 4, 8],
    ['👨‍👩‍👧 Familie & Miteinander', '💌', 'Geburtstagskarte basteln', 2, '', 'once', 5],
    ['🌙 Abends', '🎒', 'Ranzen an die Tür stellen', 1, 'a', SCHOOL, 6],
    ['🌙 Abends', '🧸', 'Zimmer kurz aufräumen vor dem Schlafen', 1, 'a', null, 4],
    ['🌙 Abends', '🌟', 'Drei schöne Dinge vom Tag erzählen', 1, 'a', null, 5],
    // neu in 1.5.0 – Kleinkinder (Ideen: Locodice67)
    ['🍽️ Küche & Essen', '🧼', 'Beim Ausräumen der Spülmaschine helfen', 1, '', null, 2, 6],
    ['🧑 Verantwortung', '🧻', 'Windeln und Feuchttücher selbst wegbringen', 1, '', null, 2, 4],
    ['🧹 Ordnung & Putzen', '🧸', 'Spielzeug aufräumen helfen', 1, 'a', null, 2, 4],
    ['🧹 Ordnung & Putzen', '📚', 'Bücher aufräumen helfen', 1, '', null, 2, 5],
    ['🧺 Wäsche', '🧻', 'Taschentücher oder Geschirrtücher falten', 1, '', [6], 3, 7],
    ['🧹 Ordnung & Putzen', '🧹', 'Mit dem Staubwedel abstauben', 1, '', [6], 3, 8],
    ['☀️ Mittags', '😴', 'Mittagsschlaf machen', 1, ['12:30', '15:00'], null, 2, 6],
  ];
  // Level nach insgesamt verdienten Sternen: [ab Sterne, Name, Emoji]
  const LEVELS = [[0, 'Anfänger', '🌱'], [50, 'Helfer', '🙂'], [150, 'Fleißige Biene', '🐝'], [300, 'Haushaltsheld', '🦸'], [500, 'Haushaltsprofi', '🏅'],
    [800, 'Superstar', '🌟'], [1200, 'Champion', '🏆'], [1700, 'Meister', '🎖️'], [2300, 'Legende', '👑'], [3000, 'Haushalts-König', '💎']];
  const levelOf = (total) => { let i = 0; LEVELS.forEach((l, j) => { if ((total || 0) >= l[0]) i = j; }); return i; };
  const BADGES = [
    ['first', '🌟', 'Erste Aufgabe erledigt', (k) => (k.doneCount || 0) >= 1],
    ['t50', '✋', '50 Aufgaben erledigt', (k) => (k.doneCount || 0) >= 50],
    ['t100', '💯', '100 Aufgaben erledigt', (k) => (k.doneCount || 0) >= 100],
    ['t500', '🚀', '500 Aufgaben erledigt', (k) => (k.doneCount || 0) >= 500],
    ['s7', '🔥', '7 Tage in Folge', (k) => (k.best || 0) >= 7],
    ['s30', '☄️', '30 Tage in Folge', (k) => (k.best || 0) >= 30],
    ['once', '⚡', 'Sonderaufgabe erledigt', (k) => (k.onceCount || 0) >= 1],
    ['reward', '🎁', 'Erste Belohnung eingelöst', (k) => (k.history || []).length >= 1],
    ['lvl5', '🏅', 'Level 5 erreicht', (k) => levelOf(k.total !== undefined ? k.total : k.points) >= 4],
  ];
  const badgesOf = (k) => BADGES.filter((b) => b[3](k)).map((b) => b[0]);
  const slug = (x) => String(x).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'kind';
  const euro = (pts, rate) => ((pts || 0) / (rate || 10)).toFixed(2).replace('.', ',') + ' €';
  const tplOk = (tp, age) => age === null || (age >= (tp[6] || 0) && (!tp[7] || age <= tp[7]));
  // Übliches Einschulungsalter je Land (Beginn der 1. Klasse) – die Schul-Vorlagen richten sich danach
  const SCHOOL_AGE = { AD: 6, AL: 6, AT: 6, BE: 6, BG: 7, BR: 6, BY: 6, CH: 6, CZ: 6, DE: 6, EE: 7, ES: 6, FR: 6, HR: 7, HU: 6, IE: 5, IT: 6, LI: 6, LT: 7, LU: 6, LV: 7, MC: 6, MD: 7, MT: 5, MX: 6, NL: 6, PL: 7, PT: 6, RO: 6, RS: 7, SE: 7, SI: 6, SK: 6, SM: 6, VA: 6, ZA: 7 };
  // Notenskalen: hi = höhere Zahl ist besser; t = [Schwelle, Sterne] von gut nach schlechter
  const GSCALES = {
    de: { n: '1–6 (1 = sehr gut)', min: 1, max: 6, step: 0.5, hi: false, t: [[1, 10], [2, 6], [3, 3], [4, 0]] },
    at: { n: '1–5 (1 = sehr gut)', min: 1, max: 5, step: 1, hi: false, t: [[1, 10], [2, 6], [3, 2]] },
    ch: { n: '1–6 (6 = sehr gut)', min: 1, max: 6, step: 0.5, hi: true, t: [[6, 10], [5.5, 8], [5, 6], [4.5, 3], [4, 1]] },
    pl: { n: '1–6 (6 = sehr gut)', min: 1, max: 6, step: 1, hi: true, t: [[6, 10], [5, 7], [4, 4], [3, 1]] },
    hu: { n: '1–5 (5 = sehr gut)', min: 1, max: 5, step: 1, hi: true, t: [[5, 10], [4, 6], [3, 2]] },
    bg: { n: '2–6 (6 = sehr gut)', min: 2, max: 6, step: 0.5, hi: true, t: [[6, 10], [5, 6], [4, 2]] },
    ten: { n: '1–10 (10 = sehr gut)', min: 0, max: 10, step: 0.5, hi: true, t: [[9, 10], [8, 6], [7, 3], [6, 1]] },
    fr: { n: '0–20 (20 = sehr gut)', min: 0, max: 20, step: 0.5, hi: true, t: [[18, 10], [16, 8], [14, 6], [12, 3], [10, 1]] },
    pct: { n: '0–100 % (100 = sehr gut)', min: 0, max: 100, step: 1, hi: true, t: [[90, 10], [80, 6], [70, 3], [60, 1]] },
  };
  const GRADE_COUNTRY = { DE: 'de', AT: 'at', CH: 'ch', LI: 'ch', CZ: 'at', SK: 'at', PL: 'pl', HU: 'hu', HR: 'hu', SI: 'hu', RS: 'hu', EE: 'hu', BA: 'hu', MD: 'ten', BG: 'bg', FR: 'fr', PT: 'fr', BE: 'pct', LU: 'pct', IE: 'pct', MT: 'pct', SE: 'pct', ZA: 'pct', IT: 'ten', ES: 'ten', NL: 'ten', RO: 'ten', LV: 'ten', LT: 'ten', AL: 'ten', BY: 'ten', BR: 'ten', MX: 'ten', AD: 'ten', MC: 'fr', SM: 'ten', VA: 'ten' };
  const SUBJECTS = ['Mathe', 'Deutsch', 'Englisch', 'Sachunterricht', 'Französisch', 'Biologie', 'Geschichte', 'Erdkunde', 'Physik', 'Chemie', 'Informatik', 'Sport', 'Musik', 'Kunst', 'Religion/Ethik'];
  const isSchoolTpl = (tp) => tp[0] === '🎒 Schule' || SCHOOL_RX.test(tp[2]);
  let MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const CHEERS = ['Super', 'Klasse', 'Spitze', 'Toll gemacht', 'Weiter so', 'Wow', 'Bravo'];

  const pad = (n) => String(n).padStart(2, '0');
  const dk = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const uid = () => (Math.random().toString(36).slice(2, 8) + Math.floor(Date.now()).toString(36).slice(-4)).replace(/[^a-z0-9]/g, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cv = (c) => { const x = /^#[0-9a-f]{6}$/i.test(c || '') ? c : '#868e96'; return `--c:${x};--cs:${x}2e`; };
  const cheer = () => T(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
  const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  // Prüfsumme je Eintrag: erkennt Änderungen außerhalb der Karte
  const hsh = (str) => { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
  const stamp = (o) => JSON.stringify({ ...o, _c: hsh(JSON.stringify(o)) });
  const dayDiff = (a, b) => { const p = (x) => { const [y, m, d] = String(x).split('-').map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((p(b) - p(a)) / 86400000); };
  const addMin = (t, n) => { const [h, m] = String(t).split(':').map(Number); const x = h * 60 + m + n; return x < 0 || x >= 1440 ? '' : `${pad(Math.floor(x / 60))}:${pad(x % 60)}`; };
  // SHA-256 (für die PIN – funktioniert auch ohne HTTPS, wo crypto.subtle fehlt)
  const sha256 = (str) => {
    const K = []; const H = [];
    let n = 2, c = 0;
    const frac = (x) => ((x - Math.floor(x)) * 4294967296) | 0;
    while (c < 64) { let p = true; for (let f = 2; f * f <= n; f++) if (n % f === 0) { p = false; break; } if (p) { if (c < 8) H[c] = frac(n ** 0.5); K[c] = frac(n ** (1 / 3)); c++; } n++; }
    const b = Array.from(new TextEncoder().encode(str)), l = b.length * 8;
    b.push(0x80); while (b.length % 64 !== 56) b.push(0);
    for (let i = 7; i >= 0; i--) b.push(i > 3 ? 0 : (l >>> (i * 8)) & 255);
    const r = (x, y) => (x >>> y) | (x << (32 - y)), w = new Array(64);
    for (let o = 0; o < b.length; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = (b[o + i * 4] << 24) | (b[o + i * 4 + 1] << 16) | (b[o + i * 4 + 2] << 8) | b[o + i * 4 + 3];
      for (let i = 16; i < 64; i++) { const s0 = r(w[i - 15], 7) ^ r(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = r(w[i - 2], 17) ^ r(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
      let [a, bb, cc, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0, t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & bb) ^ (a & cc) ^ (bb & cc))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = bb; bb = a; a = (t1 + t2) | 0;
      }
      [a, bb, cc, d, e, f, g, h].forEach((x, i) => { H[i] = (H[i] + x) | 0; });
    }
    return H.map((x) => (x >>> 0).toString(16).padStart(8, '0')).join('');
  };
  const pinHash = (salt, pin) => { let h = `${salt}:${pin}`; for (let i = 0; i < 1500; i++) h = sha256(`${h}:${salt}`); return h; };
  // Automatische Sicherungen werden gepackt gespeichert (gzip + Base64), damit die Liste klein bleibt
  const gz = async (str) => {
    if (typeof CompressionStream === 'undefined') return str;
    const u = new Uint8Array(await new Response(new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
    let bin = ''; for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return `gz:${btoa(bin)}`;
  };
  const ungz = async (str) => {
    if (!String(str).startsWith('gz:')) return String(str);
    const bin = atob(str.slice(3)), u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  };
  // einfache YAML-Ausgabe (für „YAML zum manuellen Anlegen“)
  const yml = (v, ind = '') => {
    if (Array.isArray(v)) return v.length ? v.map((x) => { const y = yml(x, `${ind}  `); return `\n${ind}- ${y.startsWith('\n') ? y.trimStart() : y}`; }).join('') : ' []';
    if (v && typeof v === 'object') return Object.keys(v).length ? Object.entries(v).map(([k, x]) => { const y = yml(x, `${ind}  `); return `\n${ind}${k}:${y.startsWith('\n') ? y : ` ${y}`}`; }).join('') : ' {}';
    return typeof v === 'string' ? JSON.stringify(v) : String(v);
  };
  const DE_DATES = [DAYS, MONTHS, MON3];
  // Wochentage und Monate in der gewählten Sprache (über den Browser, ohne Übersetzungsdatei)
  const setDates = () => {
    if (LANG === 'de' || LANG === 'gsw') { [DAYS, MONTHS, MON3] = DE_DATES; return; }
    try {
      const wd = new Intl.DateTimeFormat(locale(), { weekday: 'short' }), ml = new Intl.DateTimeFormat(locale(), { month: 'long' }), ms = new Intl.DateTimeFormat(locale(), { month: 'short' });
      const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
      DAYS = [0, 1, 2, 3, 4, 5, 6].map((i) => cap(wd.format(new Date(2024, 0, 7 + i)).replace(/\.$/, '')));
      MONTHS = [...Array(12)].map((_, i) => cap(ml.format(new Date(2024, i, 15))));
      MON3 = [...Array(12)].map((_, i) => cap(ms.format(new Date(2024, i, 15)).replace(/\.$/, '')));
    } catch (e) { [DAYS, MONTHS, MON3] = DE_DATES; }
  };
  // Sprachdatei laden (einmal pro Seite); alle Karten werden danach neu gezeichnet
  window.__kpDict = window.__kpDict || {};
  const applyLang = (code) => {
    LANG = code;
    DICT = code === 'de' ? null : window.__kpDict[code] || null;
    setDates();
    (window.__kpCards || []).forEach((c) => { if (c._render) c._render(); });
  };
  // Sprache aktivieren: Deutsch steckt im Code, alle anderen Sprachen liegen als eigene kleine Datei neben der Karte
  // (yippee-kids-chores-lang-xx.js – HACS lädt sie automatisch mit). Fehlt eine Datei, bleibt die Karte auf Deutsch.
  window.__kpLangP = window.__kpLangP || {};
  const loadLang = async (code) => {
    if (code === 'de') { if (LANG !== 'de') applyLang('de'); return true; }
    if (!window.__kpDict[code]) {
      if (!LANGS.some((l) => l[0] === code)) return false;
      const p = window.__kpLangP[code] || (window.__kpLangP[code] = cardImport(`yippee-kids-chores-lang-${code}.js`, (m) => m && m.default && typeof m.default === 'object' && !Array.isArray(m.default)));
      try { const m = await p; window.__kpDict[code] = m.default; } catch (e) { delete window.__kpLangP[code]; if (LANG !== 'de') applyLang('de'); return false; }
    }
    if (LANG !== code) applyLang(code);
    return true;
  };
  const longDate = (s) => { const [y, m, d] = String(s).split('-').map(Number); const x = new Date(y, m - 1, d); return `${DAYS[x.getDay()]}, ${shortDate(s)}`; };
  const shortDate = (s) => {
    const p = String(s).split('-');
    if (LANG === 'de' || LANG === 'gsw') return `${Number(p[2])}.${Number(p[1])}.`;
    try { return new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'numeric' }).format(new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]))); } catch (e) { return `${Number(p[2])}.${Number(p[1])}.`; }
  };

  const CSS = `
:host{display:block;--bg:var(--yippee-bg,var(--card-background-color,#fff));--tx:var(--yippee-text,var(--primary-text-color,#1f2430));--mu:var(--yippee-text-secondary,var(--secondary-text-color,#6b7280));--ln:var(--divider-color,rgba(127,127,127,.22));--soft:var(--yippee-surface,rgba(127,127,127,.09));--ac:var(--yippee-accent,var(--primary-color,#5b6cff));--gold:#e8a400;--ok:#2fb344;color:var(--tx)}
[hidden]{display:none!important}
*{box-sizing:border-box}
button{font:inherit;color:inherit;cursor:pointer;border:none;background:none;padding:0;-webkit-tap-highlight-color:transparent}
button:disabled{opacity:.45;cursor:default}
input,select,textarea{font:inherit;font-size:16px;color:var(--tx);background:var(--soft);border:1px solid var(--ln);border-radius:12px;padding:10px 12px;width:100%}
.card{background:var(--bg);border-radius:var(--ha-card-border-radius,16px);border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--ln));box-shadow:var(--ha-card-box-shadow,none);padding:16px;display:flex;flex-direction:column;gap:14px}
.hd{display:flex;align-items:center;gap:10px}
.hd .tt{font-size:22px;font-weight:800;flex:1;display:flex;align-items:center;gap:10px;white-space:nowrap;min-width:0;overflow:hidden;text-overflow:ellipsis}
.hd .logo{width:34px;height:34px;flex:none}
.tt2::before{content:' - '}
.hint{font-size:13px;color:var(--mu)}
.hbq{margin:2px 0 10px}
.hbchips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.hbchip{padding:6px 12px;border-radius:999px;background:var(--soft);border:1px solid var(--ln);font-size:13px;font-weight:700}
.hbchip.on{background:var(--ac);color:#fff;border-color:var(--ac)}
.hblist{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.hbi{border:1px solid var(--ln);border-radius:12px;background:var(--bg)}
.hbi>summary{padding:12px 14px;font-weight:800;cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px}
.hbi>summary::-webkit-details-marker{display:none}
.hbi>summary::after{content:'▸';margin-left:auto;color:var(--mu);transition:transform .15s}
.hbi[open]>summary::after{transform:rotate(90deg)}
.hbx{padding:0 14px 12px;font-size:14px;line-height:1.45}
.hbx p{margin:6px 0}
.hbx ul{margin:6px 0;padding-left:18px}
.hbx li{margin:3px 0}
.hbx li.num{list-style:none;margin-left:-18px}
.hbp{font-size:13px;color:var(--mu);background:var(--soft);border-radius:8px;padding:6px 10px;margin:4px 0 8px}
.btn.hbopen{width:100%;margin-bottom:6px}
.segsw{display:flex;background:var(--soft);border-radius:14px;padding:4px;gap:4px;margin:4px 0 8px}
.segsw button{flex:1;border:0;background:none;font:inherit;font-weight:700;font-size:14px;color:var(--mu);padding:10px 6px;border-radius:11px;cursor:pointer}
.segsw button.on{background:var(--bg);color:var(--tx);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.btn.wizagain{margin-top:10px}
.wiz{display:flex;flex-direction:column;gap:10px}
.wizhd{display:flex;flex-direction:column;gap:6px}
.wizst{display:flex;flex-wrap:wrap;gap:4px}
.wizst span{font-size:12px;font-weight:700;padding:4px 8px;border-radius:10px;background:var(--bg);color:var(--mu)}
.wizst span.on{background:var(--ac);color:#fff}
.wizst span.done{color:var(--ok,#2b8a3e)}
.wizft{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:6px}
.wizdone{font-size:56px;text-align:center}
.shbtns{display:flex;flex-direction:column;gap:6px;width:100%}
.shst{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}
.shst span{font-size:12px;font-weight:700;padding:3px 8px;border-radius:10px;background:var(--soft);color:var(--mu)}
.shst span.ok{color:var(--tx)}
.shask{font-weight:700;color:var(--ac)}
.nw{white-space:nowrap}
.wizkid{background:var(--bg);border-radius:14px;padding:6px 10px}
.wizkid .grow{display:flex;flex-direction:column;font-weight:700}
.wizkid .icon{width:36px;height:36px;min-width:36px;font-size:16px}
.rsbox{display:flex;flex-direction:column;gap:6px}
.rsbox .lbl{font-weight:700;font-size:14px}
.rslist{display:flex;flex-direction:column;gap:4px}
.rsrow{display:flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid var(--ln);border-radius:10px;background:var(--soft)}
.rsrow .rsn{color:var(--mu);font-weight:700;min-width:22px}.rsz0{opacity:.6;filter:grayscale(1) drop-shadow(0 0 1px rgba(0,0,0,.6))}.rsz1{background:linear-gradient(135deg,#22c1c3,#3b82f6)!important;color:#fff}
.rsrow .grow{flex:1;min-width:0;overflow-wrap:anywhere}
.icon.sm{width:30px;height:30px;font-size:12px;border-radius:9px}
.rsadd{display:flex;gap:6px}
.rsadd .rsq{flex:1;min-width:0}
.rssug{display:flex;flex-direction:column;gap:4px}
.rssg{text-align:left;padding:8px 10px;border-radius:10px;border:1px dashed var(--ln);background:var(--bg);display:flex;justify-content:space-between;gap:8px;align-items:center}
.rssg small{color:var(--mu);font-size:11px;white-space:nowrap}
.rssg.free{border-style:solid;font-weight:700}
.empty{color:var(--mu);text-align:center;padding:18px}
.btn{padding:10px 16px;border-radius:12px;background:var(--soft);font-weight:700;transition:transform .1s}
a.btn{display:inline-block;text-decoration:none;color:inherit}
.btn:active,.icon:active,.tile:active,.trow:active{transform:scale(.96)}
.btn.primary{background:var(--ac);color:#fff}
.btn.danger{background:#e03131;color:#fff}
.icon{width:38px;height:38px;border-radius:12px;display:inline-grid;place-items:center;font-size:16px;background:var(--soft);flex-shrink:0}
.icon.ok{background:var(--ok);color:#fff;font-weight:900}
.icon.no{background:#e03131;color:#fff;font-weight:900}
.avc{width:40px;height:40px;border-radius:50%;display:inline-grid;place-items:center;font-size:22px;background:var(--cs);border:3px solid var(--c);flex-shrink:0}
.avc.big{width:72px;height:72px;font-size:42px;border-width:4px}
.tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}
.advbtn{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;background:linear-gradient(135deg,#1f2f68,#b3261e);color:#fff;font-size:16px;padding:12px 14px;border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,.18)}
.advnew{font-size:13px;background:#ffd43b;color:#3d3200;border-radius:999px;padding:2px 10px}
.advpg{display:flex;flex-direction:column;gap:8px}
.advback{align-self:flex-start}
.accgrp{font-weight:800;font-size:13px;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin:14px 2px 2px}
.accgrp.sub{margin:16px 0 4px}
.tbadge{position:absolute;top:-6px;right:-12px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:#e03131;color:#fff;font-size:11px;line-height:18px;font-weight:800}
.kbtns{flex-wrap:wrap}
.kbtns .kbr{flex-basis:100%;height:0}
.kbtns .icon.lab{display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;font-size:17px;width:auto;min-width:0;padding:4px 2px}
.kbtns .icon.lab small{font-size:10px;font-weight:700;color:var(--mu)}
.behav{display:flex;gap:4px;margin-left:auto;order:3}.colh .ardm{order:4;padding:6px 10px}.colh .behav+.pts+.ardm,.colh .pts+.ardm{margin-left:0}
.prd .row{gap:10px}.prd .row .grow small{display:block}.prd .btnrow{justify-content:flex-end;flex-wrap:wrap}.prd .btn[disabled]{opacity:.55}
.bhwrap{display:flex;gap:8px;align-items:stretch;margin:8px 0 2px}
.bhname{width:86px;flex:0 0 86px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-weight:700;font-size:13px;text-align:center;overflow:hidden}
.bh{display:flex;gap:3px;align-items:stretch;height:110px;flex:1;min-width:0}
.bhd{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:1px}
.bhu,.bhl{width:100%;flex:1;display:flex;background:var(--soft);border-radius:4px;overflow:hidden}
.bhu{align-items:flex-end}.bhl{align-items:flex-start}
.bhu i{display:block;width:100%;background:#40c057;border-radius:4px 4px 0 0}
.bhl i{display:block;width:100%;background:#fa5252;border-radius:0 0 4px 4px}
.bhd span{font-size:9px;color:var(--mu);margin-top:2px;white-space:nowrap}
.bhd.today{box-shadow:inset 0 0 0 1.5px var(--ac);border-radius:6px}
.bhd.today span{font-weight:800;color:var(--tx)}
.bhsum{margin:0 0 8px 94px}
.btn.bhv{padding:6px 12px;min-height:0;font-size:15px;font-weight:800;white-space:nowrap;border:1.5px solid transparent}
.btn.bhv.ok{background:#d3f9d8;color:#2b8a3e;border-color:#8ce99a}
.btn.bhv.no{background:#ffe3e3;color:#c92a2a;border-color:#ffa8a8}
.tkf{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px;align-items:center}
.tkf .btn.on{background:var(--ac);color:#fff}
.tkg{margin-top:-4px}
.blkh.tkh{font-size:18px;border-top:1px solid var(--line,rgba(127,127,127,.25));margin-top:4px}
.blkh.tkh:first-child{border-top:none;margin-top:0}
.blkh .tkn{font-size:13px;font-weight:700;min-width:22px;padding:1px 7px;border-radius:999px;background:rgba(127,127,127,.18);text-align:center}
.blkh.tksh{font-size:15px;padding:4px 0 2px 18px;opacity:.9}
.tplq{margin:6px 0}
.krow .kbtns{display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap}
.tab{min-width:0;padding:7px 2px;border-radius:12px;background:var(--soft);font-weight:700;display:flex;flex-direction:column;align-items:center;gap:1px}
.tab .te{font-size:20px;line-height:1.1;position:relative}
.tab[data-id=zaehne] .te{filter:drop-shadow(0 0 1px rgba(0,0,0,.55)) drop-shadow(0 1px 1px rgba(0,0,0,.25))}
.tab .tl{font-size:10px;letter-spacing:-.2px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tabs.ico .tl{display:none}
.tabs.ico .tab{padding:9px 2px}
.tabs.ico .te{font-size:24px}
.tab.on{background:var(--ac);color:#fff}
.box{background:var(--soft);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:8px}
.box h3{margin:0;font-size:16px}
.accw{display:flex;flex-direction:column;gap:8px}
.acc{padding:0;gap:0}
.acch{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;padding:12px 14px;background:none;border:0;font:inherit;font-weight:700;font-size:16px;color:var(--tx);cursor:pointer;text-align:left;border-radius:16px}
.acch .grow{flex:1;min-width:0;display:flex;flex-direction:column}
.accs{font-weight:400;font-size:13px;color:var(--mu);margin-top:2px}
.accc{font-size:18px;color:var(--mu);transition:transform .25s;flex:none}
.acc.open .accc{transform:rotate(90deg)}
.accb{display:flex;flex-direction:column;gap:8px;padding:0 12px 14px}
.accb.anim{animation:drop .25s ease-out}
.acchr{display:flex;align-items:center}
.acchr .acch{flex:1;min-width:0}
.accsw{position:relative;flex:none;width:48px;height:28px;margin:0 14px 0 0;cursor:pointer}
.accsw input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;z-index:1}
.accsw .swt{position:absolute;inset:0;border-radius:14px;background:var(--ln);transition:background .2s}
.accsw .swt::after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .2s}
.accsw input:checked+.swt{background:var(--ok)}
.accsw input:checked+.swt::after{transform:translateX(20px)}
.accsw input:focus-visible+.swt{outline:2px solid var(--ac);outline-offset:2px}
.setq{width:100%;box-sizing:border-box;margin:0 0 4px}
.hbsec{display:flex;justify-content:flex-end}
.fdesc{margin:0}
.row{display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:12px;padding:8px 10px}
.row{flex-wrap:wrap}
.row .grow{flex:1;min-width:120px;font-weight:700;word-break:break-word}
.row .grow small{display:block;font-weight:400;color:var(--mu);font-size:12px}
.pts{font-weight:800;color:var(--gold);white-space:nowrap}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
.colh{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font-weight:800;font-size:17px}
.admk{display:flex;align-items:center;gap:8px;background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-align:left;min-width:0}.admk .chev{font-size:14px;opacity:.6;width:12px}.admb{font-size:15px;margin-top:6px}
.sensok{color:color-mix(in srgb,var(--ok) 70%,var(--tx));font-weight:700}.senswarn{color:color-mix(in srgb,#d97706 80%,var(--tx));font-weight:700}
pre.yaml{width:0;min-width:100%;box-sizing:border-box;font:11px/1.4 ui-monospace,Menlo,Consolas,monospace;background:var(--yippee-surface,rgba(127,127,127,.12));border-radius:10px;padding:8px 10px;margin:6px 0 0;max-height:220px;overflow:auto;white-space:pre;user-select:all;-webkit-user-select:all}
.colh .pts{margin-left:auto}
.trow{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:var(--bg);border-radius:12px;padding:9px 10px;transition:transform .12s}
.trow .grow{flex:1;font-weight:700}
.st{width:28px;height:28px;border-radius:50%;border:3px solid var(--c);display:grid;place-items:center;font-size:14px;font-weight:900;flex-shrink:0}
.st.p{border-color:var(--gold);background:#fff3bf}
.st.d{background:var(--c);color:#fff}
.kh{display:flex;align-items:center;gap:14px}
.kn{font-size:26px;font-weight:900}
.kgrid{display:grid;grid-template-columns:1fr;gap:12px;align-items:start}
@container kp (min-width:640px){.kgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
.kgrow{flex:1;min-width:0}
.khbtn{display:flex;flex-direction:column;gap:10px;width:100%;text-align:left}
.chev{font-size:26px;color:var(--mu);transition:transform .25s}
.chev.up{transform:rotate(180deg)}
.kbody{display:flex;flex-direction:column;gap:14px}
.kbody.anim{animation:drop .25s ease-out}
@keyframes drop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
.kp{font-size:22px;font-weight:800;color:var(--gold)}
.next{display:flex;flex-direction:column;gap:6px}
.bar{height:12px;border-radius:12px;background:var(--ln);overflow:hidden}
.bar i{display:block;height:100%;background:var(--c,var(--ac));border-radius:12px;transition:width .5s}
.sect{font-weight:800;font-size:18px;display:flex;justify-content:space-between;align-items:baseline}
.blkh{width:100%;background:none;border:none;font:inherit;font-weight:800;font-size:18px;color:inherit;cursor:pointer;justify-content:flex-start;gap:8px;padding:6px 0;text-align:left}
.blkh .chev{font-size:16px;width:16px}
.blkh .grow{flex:1;min-width:0}
.sect:has(.btn){flex-wrap:wrap;gap:6px;justify-content:flex-start;align-items:center}
.sect:has(.btn)>span{flex:1 0 100%}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}
.tile{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:124px;padding:12px 6px;border-radius:20px;background:var(--soft);border:3px solid transparent;transition:transform .15s,background .25s}
.tile .e{font-size:46px;line-height:1}.kvdot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#e53935;margin-left:6px;vertical-align:middle}.tile .e,.rw .e,.kcrc .e,.cbox .e,.kvbtn .kve{filter:drop-shadow(0 0 1px rgba(0,0,0,.45)) drop-shadow(0 1px 1px rgba(0,0,0,.2))}
.tile .t{font-weight:800;font-size:15px;text-align:center;overflow-wrap:break-word;hyphens:auto}
.tile .p{font-size:13px;font-weight:800;color:var(--gold)}
.tile .zgo{display:block;margin-top:4px;background:linear-gradient(135deg,#22c1c3,#3b82f6);color:#fff;border-radius:12px;padding:8px 10px;font-weight:800;font-size:14px;line-height:1.2;box-shadow:0 3px 10px rgba(59,130,246,.3)}
.tile .zx{font-size:12px;font-weight:800;color:#ea580c}
.zgal{display:flex;flex-wrap:wrap;gap:6px;width:100%;margin-top:4px}.zgi{width:46px;height:74px;border-radius:8px;overflow:hidden;background:var(--soft);display:flex;align-items:center;justify-content:center;font-size:20px}.zgi svg,.zgi img{width:100%;height:100%;display:block}.zgi img{object-fit:cover}button.zgi{border:0;padding:0;cursor:pointer;font:inherit;color:inherit}.zpbig{width:min(100%,300px);aspect-ratio:300/480;margin:0 auto;border-radius:14px;overflow:hidden;background:var(--soft);display:flex;align-items:center;justify-content:center;font-size:48px}.zpbig svg,.zpbig img{width:100%;height:100%;display:block;object-fit:cover}.zpbar{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px}.zpnav{min-width:48px;font-size:22px}
.tile.p{background:#fff3bf;border-color:var(--gold);color:#5c4400}
.tile.d{background:var(--cs);border-color:var(--c)}
.tile .badge{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:15px;font-weight:900;animation:pop .35s}
.tile.wait{opacity:.55}
.tile.x{opacity:.6;background:repeating-linear-gradient(135deg,#ffe3e3,#ffe3e3 10px,transparent 10px,transparent 20px);border-color:#e03131}
.tile.x .badge{background:#e03131;color:#fff}
.tile.x .p{color:#e03131}
.tile.exc{opacity:.7}
.tile.exc .badge{background:var(--ln)}
.tile.miss .badge{background:#e03131;color:#fff}
.st.e{border-color:var(--ln)}
.btn.sm{padding:7px 10px;font-size:13px;border-radius:10px}
.mrow{flex-wrap:wrap}
.mbtns{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}
.tile.miss{opacity:.55;background:repeating-linear-gradient(135deg,var(--soft),var(--soft) 10px,transparent 10px,transparent 20px)}
.tile.wait .badge{background:var(--ln)}
.tile.miss .badge{background:#e03131;color:#fff}
.st.m{border-color:#e03131;color:#e03131}
.trow .grow small{display:block;font-weight:400;font-size:12px;color:var(--mu)}
.seg{display:flex;flex-wrap:wrap;gap:3px;background:var(--soft);border-radius:12px;padding:3px}
.seg button{flex:1 1 40%;min-width:0;white-space:nowrap;padding:9px 10px;border-radius:10px;font-weight:700;color:var(--mu)}
.seg button.on{background:var(--bg);color:var(--tx);box-shadow:0 1px 3px rgba(0,0,0,.15)}
.sw-week,.sw-dates,.sw-cal{flex-direction:column;gap:8px}
.sw-cal label,.sw-cal select,.sw-cal input:not([type=checkbox]){width:100%;box-sizing:border-box}
.addd{display:flex;gap:8px}
.addd .btn{white-space:nowrap}
.dchips{display:flex;flex-wrap:wrap;gap:6px}
.dchip{padding:7px 12px;border-radius:999px;background:var(--cs,var(--soft));border:2px solid var(--ac);font-weight:700;font-size:14px}
.g2.g2e{grid-template-columns:repeat(2,minmax(0,1fr))}.g2e>label,.g2e input{min-width:0}.g2e input{width:100%;box-sizing:border-box}
.tile.d .badge{background:var(--c);color:#fff}
.tile.p .badge{background:var(--gold);color:#fff}
.trophy{text-align:center;font-weight:900;font-size:18px;padding:12px;border-radius:16px;background:#fff3bf;color:#7a5b00;animation:wig 1.2s}
.rws{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.kadm{gap:10px}
.calbox .row.calhid{opacity:.55}
.repbox .seg{margin:8px 0;flex-wrap:nowrap}.repbox .seg button::first-letter{text-transform:uppercase}.repbox .seg button{flex:1 1 0;padding:9px 4px}
.reptw{overflow-x:auto;-webkit-overflow-scrolling:touch}
.rept{width:100%;border-collapse:collapse;font-size:13px}
.rept th,.rept td{padding:6px 6px;text-align:center;border-bottom:1px solid var(--soft);white-space:nowrap}
.rept thead th{font-size:12px}.rept thead th span{display:block;font-weight:700;max-width:90px;overflow:hidden;text-overflow:ellipsis;margin:0 auto}
.rept tbody th{text-align:left;font-weight:600;color:var(--mu);font-size:12px}
.rept td small{display:block;color:var(--mu);font-size:11px}
.rept td.na{color:var(--mu)}
.rept tr[data-a]{cursor:pointer}.repbox .btnrow{margin-top:8px}
.hint.warn{color:#c92a2a;font-weight:600}.rept tr.today th{color:var(--tx)}
.calbox .row,.calls .row{flex-wrap:nowrap}.calbox .row .grow,.calls .row .grow{min-width:0}
.setup{display:flex;flex-direction:column;gap:12px}
.setlang{display:flex;flex-direction:column;gap:4px;font-weight:700}
.btn.big{padding:14px 18px;font-size:17px}
.mkrow{display:flex;gap:8px;align-items:center}
.mkrow .newlist{flex:1;min-width:0}
.kah{display:flex;align-items:center;gap:12px;width:100%;background:none;border:0;padding:0;font:inherit;color:var(--tx);text-align:left;cursor:pointer}
.kah .grow{display:flex;flex-direction:column;gap:3px;min-width:0}
.kah .kan{font-size:20px;font-weight:800}
.kah small{color:var(--mu);font-size:13px}
.kah .bar{margin-top:4px}
.kadm.open .kah .accc{transform:rotate(90deg)}
.kadm .krow{padding-top:4px}
.kadm .stk{margin-top:0}
.kadm .bhname{display:none}
.kadm{container:kadm/inline-size}
.kadm .krow{flex-direction:column;align-items:stretch;gap:8px}
.kadm .krow>.grow:empty{display:none}
.knet.neg{color:#c92a2a;font-weight:700}
.kmove{display:flex;gap:4px;align-self:flex-start}.kmove .icon{width:34px;height:34px;font-size:13px}
.ksum{gap:8px}.ksum.act{cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;transition:transform .12s}.ksum.act:active{transform:scale(.98)}.ksum.act:focus-visible{outline:2px solid var(--ac);outline-offset:2px}.ksh{display:flex;align-items:center;gap:10px}.ksh .grow{flex:1;min-width:0}.ksh .kn{font-weight:800;font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ksh .kp{font-weight:700;color:var(--gold)}.ksd{font-weight:800;font-size:18px}
.kadm .kbtns{display:flex;flex-wrap:nowrap;align-items:center;gap:6px;width:100%;margin:0}
.kadm .kbtns .kbr{display:none}
.kadm .kbtns .pts{min-width:40px;text-align:center}
.kadm .kbtns .icon{width:40px;height:40px;flex:none}
.kadm .kbtns .icon.lab{flex:1 1 0;min-width:0;height:44px}
@container kadm (max-width:430px){.kadm .kbtns .icon.lab small{display:none}.kadm .kbtns .icon.lab{font-size:20px}}
@container kadm (max-width:330px){.kadm .kbtns{flex-wrap:wrap}.kadm .kbtns .icon.lab{flex:1 1 calc(25% - 6px)}}
.kadm .bh{flex:1}
.rwh{font-size:13px;font-weight:800;color:var(--mu);margin:12px 2px 6px;text-transform:uppercase;letter-spacing:.03em}
.rw{background:var(--soft);border-radius:18px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.rw .e{font-size:44px;line-height:1.1}
.rw .t{font-weight:800}
.rw .bar{width:100%;height:8px}
.rw .btn{width:100%}
/* PIN */
.lock{display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 0}
.lock .le{font-size:48px}
.lock .lt{font-size:22px;font-weight:900}
.dots{display:flex;gap:14px;margin:8px 0 6px;min-height:18px}
.dots i{width:18px;height:18px;border-radius:50%;border:2px solid var(--mu)}
.dots i.f{background:var(--tx);border-color:var(--tx)}
.dots.err{animation:shake .45s}
.pad{display:grid;grid-template-columns:repeat(3,72px);gap:12px}
.pk{height:72px;border-radius:50%;background:var(--soft);font-size:28px;font-weight:700}
.pk:active{transform:scale(.94)}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}
/* Modal */
#modal{display:none}#modal.open{display:block}
.mback{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px}
.mbox{background:var(--bg);color:var(--tx);border-radius:20px;width:min(480px,100%);max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:up .2s}
.mhead{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid var(--ln)}
.mhead h3{margin:0;font-size:18px}
.mbody{padding:14px 16px;overflow:auto;display:flex;flex-direction:column;gap:12px}
.mfoot{display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--ln);flex-wrap:wrap}
.mfoot .danger{margin-right:auto}
label,.lbl{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700;color:var(--mu)}
.g2{display:grid;grid-template-columns:90px 1fr;gap:10px}
.pick{display:flex;flex-wrap:wrap;gap:6px}
.exrow>label,.prule label{min-width:0}.exrow input,.exrow select,.prule input,.prule select{min-width:0;width:100%;box-sizing:border-box}.prule .g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.thm{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:8px;margin:4px 0 8px}.thb{display:flex;flex-direction:column;align-items:center;gap:5px;border:2px solid transparent;border-radius:14px;background:var(--soft);padding:8px 4px;font:inherit;font-size:12px;font-weight:700;color:var(--tx);cursor:pointer;text-align:center}.thb.on{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac)}.thsw{width:46px;height:32px;border-radius:9px;display:flex;align-items:flex-end;justify-content:flex-end;gap:3px;padding:4px;box-sizing:border-box;box-shadow:inset 0 0 0 1px rgba(127,127,127,.35)}.thsw i{width:10px;height:10px;border-radius:50%}
.colpk{display:grid;grid-template-columns:1fr 1fr;gap:8px}.colpk label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700}.colpk input[type=color]{width:100%;height:42px;border:1px solid var(--ln);border-radius:10px;padding:2px;background:var(--bg);cursor:pointer}
.pick label{display:block}
.pick input{display:none}
.pick span{display:grid;place-items:center;min-width:42px;height:42px;padding:0 10px;border-radius:12px;background:var(--soft);font-size:21px;color:var(--tx);border:3px solid transparent}
.pick input:checked+span{border-color:var(--ac);background:var(--bg)}
.pick.txt span{font-size:14px;font-weight:700}
.tpl{background:var(--soft);border-radius:14px;padding:8px 10px}
.tpl summary{font-weight:800;cursor:pointer;padding:4px 0}
.emogrid{display:flex;flex-wrap:wrap;gap:6px;max-height:min(340px,45vh);overflow-y:auto;overscroll-behavior:contain}
.emog{flex-basis:100%;font-size:12px;font-weight:800;color:var(--mu);margin:6px 2px 0}
.emog:first-child{margin-top:0}
.ep{width:46px;height:46px;border-radius:12px;background:var(--soft);font-size:24px;border:3px solid transparent}
.ep.on{border-color:var(--ac);background:var(--bg)}
.emopop{flex:none;background:var(--soft);border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:6px;animation:drop .2s ease-out}
.emopop[hidden]{display:none}
.emohd{display:flex;align-items:center;justify-content:space-between;gap:8px}
.emogrid{display:flex;flex-wrap:wrap;gap:6px;max-height:200px;overflow-y:auto;padding:2px}
input[name=emoji]{cursor:pointer;font-size:24px;text-align:center}
.crow{display:flex;flex-direction:row;align-items:center;text-align:left;color:var(--tx);font-size:15px;gap:10px;background:var(--bg);border-radius:12px;padding:10px 12px;font-weight:700;cursor:pointer}
.crow input{width:22px;height:22px;flex-shrink:0}
.crow small{display:block;font-weight:400;color:var(--mu);font-size:12px}
.fire{position:absolute;top:8px;left:10px;font-size:13px;font-weight:900;color:#d9480f}
.tile.once{border-style:dashed;border-color:var(--gold)}
.bday{background:linear-gradient(90deg,#ffe3f1,#fff3c4);color:#5a3a00;border-radius:14px;padding:10px 12px;font-weight:700;text-align:center}
.dbl{background:#fff3c4;color:#6b4e00;border-radius:14px;padding:8px 12px;font-weight:700;text-align:center}
.pv{display:flex;gap:8px;align-items:baseline;padding:6px 0;border-top:1px solid var(--ln);font-size:14px}
.pv:first-of-type{border-top:0}
.pv b{min-width:72px;flex:none}
.wish{display:flex;gap:8px;align-items:center;background:var(--soft);border-radius:12px;padding:8px 10px;font-size:14px}
.g3{display:grid;grid-template-columns:76px 1fr 1fr;gap:8px}
.gst{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:8px}
.gst label{font-size:13px}
.wcost{width:70px;flex:none}
.vch{width:100%;border:0;font:inherit;text-align:left;cursor:pointer;color:inherit;display:flex;align-items:center;gap:8px}
.vchs{display:grid;gap:6px}
.rsteps{display:grid;gap:4px;margin-top:8px}.rsz{flex-wrap:wrap}.rsz .zgo{margin-left:auto;border:0;cursor:pointer;font:inherit;background:linear-gradient(135deg,#22c1c3,#3b82f6);color:#fff;border-radius:12px;padding:8px 12px;font-weight:800;font-size:14px;line-height:1.2;box-shadow:0 3px 10px rgba(59,130,246,.3)}
.welc{font-weight:700}
.kcd{align-self:end;padding-bottom:14px}
.tile.extra{border-style:dashed;border-color:var(--c,var(--ac))}
.phth{width:46px;height:46px;border-radius:10px;object-fit:cover;flex:none;cursor:pointer;background:var(--soft);display:grid;place-items:center;font-size:20px}
.phbig{width:100%;border-radius:12px}
.upd{border:2px solid #4a56e2;background:#eef0ff;color:#1f2a7a}.upd .hint{color:#33408f}
.chk{border:2px solid #f08c00;background:#fff4e6;color:#5c3c00}.chk .hint{color:#7a5200}
.stk{padding:8px 0;border-top:1px solid var(--ln)}
.stk:first-of-type{border-top:0}
.sbars{display:flex;gap:8px;align-items:flex-end;margin-top:6px}
.sb{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:12px;min-width:0}
.sbt{width:100%;max-width:40px;height:80px;background:var(--soft);border-radius:8px;display:flex;align-items:flex-end;overflow:hidden}
.sbt i{display:block;width:100%;background:var(--c,var(--ac));border-radius:8px 8px 0 0}
.sv{font-weight:700}
.stk .colh small{display:block;font-weight:400;font-size:12px;color:var(--mu)}
.fopt{display:flex;flex-direction:column;gap:8px;padding:4px 0 6px 12px;border-left:3px solid var(--soft);margin:0 0 6px 14px}
.rw{position:relative}
.rw.goal{box-shadow:inset 0 0 0 3px var(--c,var(--ac))}
.goalbtn{position:absolute;top:6px;right:6px;width:32px;height:32px;border-radius:50%;background:var(--bg);font-size:16px;opacity:.45}
.goalbtn.on{opacity:1;background:var(--cs,var(--soft))}
.next.isgoal{background:var(--cs,var(--soft));border-radius:14px;padding:10px 12px}
.gtxt{font-size:15px}
.bar.big{height:16px}
.lrow{display:flex;align-items:center;gap:10px;padding:6px 4px;border-bottom:1px solid var(--ln)}
.lrow .grow{flex:1;font-size:14px}
.lrow .grow small{color:var(--mu)}
.ln{min-width:44px;text-align:right;font-weight:900}
.ln.pl{color:var(--ok)}
.ln.mi{color:#e03131}
.code{background:var(--soft);border-radius:10px;padding:10px;font-size:11px;overflow:auto;white-space:pre;max-height:260px}
.sw-once{flex-direction:column;gap:8px}
.qp em{font-style:normal;font-size:9px;font-weight:800;color:var(--ac);margin-top:1px}
.tplbar{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px}
.tplchk{flex-direction:row;align-items:center;gap:6px;font-size:13px}
.tplchk input{width:18px;height:18px}
.lvl{font-size:13px;font-weight:800;color:var(--mu)}
.eur{font-size:15px;color:var(--mu);font-weight:700}
.badges{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.badges .hint{margin-right:4px}
.kvbtn{display:flex;align-items:center;gap:6px;border:0;border-radius:12px;background:var(--soft);color:var(--tx);font:inherit;font-weight:700;font-size:14px;padding:6px 10px;cursor:pointer;max-width:100%}
.kvgot{font-size:17px;letter-spacing:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.kvbtn[aria-expanded=true] .accc,.kvsect[aria-expanded=true] .accc{transform:rotate(90deg)}
.kvsect{width:100%;border:0;background:none;font-family:inherit;color:inherit;cursor:pointer;text-align:left;padding:0}
.kvsect .hint{display:flex;align-items:center;gap:6px}
.bdg{font-size:22px;filter:grayscale(1);opacity:.25;cursor:pointer}
.bdg.on{filter:none;opacity:1}
.vac{background:#e7f5ff;color:#1864ab;border-radius:14px;padding:10px 12px;font-weight:700}
.shban{background:var(--cs);color:var(--tx);border-left:5px solid var(--c);border-radius:14px;padding:10px 12px;font-weight:700;display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.shban .grow{flex:1 1 180px}
.kwrap{display:flex;flex-direction:column;gap:12px;container:kp/inline-size}
.card.fam{gap:10px}
.famh{display:flex;align-items:center;gap:12px}
.fe{font-size:42px;line-height:1}
.ft{font-size:20px;font-weight:900}
.btnrow{display:flex;gap:8px;flex-wrap:wrap}
textarea{width:100%;min-height:90px;resize:vertical}
.arow{display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:12px;padding:8px 12px;font-weight:700}
.okb{color:var(--ok);font-weight:800}
.sub{margin:-2px 0 4px 28px}
.sub .crow{font-size:13px;padding:8px 10px}
.tcat{font-size:13px;font-weight:800;color:var(--mu);margin:10px 0 4px}
.wizg{border-radius:14px;background:var(--soft);margin:6px 0}
.wizg>summary{display:flex;align-items:center;gap:10px;padding:12px 14px;font-weight:800;font-size:16px;cursor:pointer;list-style:none}
.wizg>summary::-webkit-details-marker{display:none}
.wizg>summary::after{content:'▸';color:var(--mu);transition:transform .2s}
.wizg[open]>summary::after{transform:rotate(90deg)}
.wizg>summary .grow{flex:1;min-width:0}
.wizn{font-weight:700;color:var(--mu);font-size:13px}
.wizgb{display:flex;flex-direction:column;gap:6px;padding:0 10px 12px}
.wizsteps{display:block;margin-top:2px}
.wizav{border-radius:14px;background:var(--soft)}
.wizav>summary{display:flex;align-items:center;gap:10px;padding:8px 12px;font-weight:700;cursor:pointer;list-style:none}
.wizav>summary::-webkit-details-marker{display:none}
.wizav>summary::after{content:'▸';color:var(--mu);transition:transform .2s}
.wizav[open]>summary::after{transform:rotate(90deg)}
.wizav .grow{flex:1}
.wizav .pick{padding:0 10px 10px}
.wizav .lbl{padding:0 12px}
.wizavp{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:3px solid var(--c);background:var(--bg);font-size:22px}
.wizq{width:100%;box-sizing:border-box}
.wizrr{display:flex;align-items:center;gap:8px}
.wizrr .crow{flex:1;min-width:0}
.wizrc{display:flex;align-items:center;gap:4px;flex:none;font-weight:700}
.wizrc input{width:72px}
.bg3{display:flex;flex-direction:column;gap:6px}
.bg3 label{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
.bg3 input{width:auto;flex:0 0 auto;min-width:120px}
.qp{display:flex;flex-direction:column;align-items:center;gap:2px;width:84px;padding:6px 2px;border-radius:12px;background:var(--soft);border:3px solid transparent;font-size:24px}
.qp small{font-size:10px;font-weight:700;color:var(--mu);text-align:center;line-height:1.15}
.qp.on{border-color:var(--ac);background:var(--bg)}
.pick.sw span{width:40px;min-width:40px;padding:0;border-radius:50%}
/* Effekte */
#fx{position:fixed;inset:0;pointer-events:none;z-index:9800;overflow:hidden}
.pop{position:fixed;transform:translate(-50%,-50%);font-weight:900;font-size:26px;color:var(--gold);animation:fl 1.2s ease-out forwards;text-shadow:0 2px 6px rgba(0,0,0,.25);white-space:nowrap}
.cf{position:fixed;top:-30px;font-size:24px;animation:fall linear forwards}
.cele{position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.35);pointer-events:auto;padding:16px;animation:fade .2s}
.cbox{background:var(--bg);color:var(--tx);border-radius:26px;padding:26px 34px;text-align:center;animation:boing .6s}
.cbox .e{font-size:88px;line-height:1.1}
.cbox .t{font-size:28px;font-weight:900}
.cbox .s{font-size:17px;color:var(--mu);font-weight:700;margin-top:4px}
.hb .t{font-size:38px;background:linear-gradient(90deg,#ff4f9a,#ffb300,#3fb6ff,#9b5cff);-webkit-background-clip:text;background-clip:text;color:transparent}
.hb .e{animation:wig 1s ease-in-out infinite}
.bdtap{cursor:pointer}
/* 🌙 Theme-fest: farbige Kästen aus Theme-Hintergrund + Akzentfarbe mischen (funktioniert hell und dunkel) */
.chk{background:color-mix(in srgb,#f08c00 10%,var(--bg));color:color-mix(in srgb,#f08c00 40%,var(--tx))}
.chk .hint{color:color-mix(in srgb,#f08c00 65%,var(--tx))}
.upd{background:color-mix(in srgb,#4a56e2 10%,var(--bg));color:color-mix(in srgb,#4a56e2 40%,var(--tx))}
.upd .hint{color:color-mix(in srgb,#4a56e2 60%,var(--tx))}
.vac{background:color-mix(in srgb,#339af0 14%,var(--bg));color:color-mix(in srgb,#1c7ed6 60%,var(--tx))}
.dbl,.trophy{background:color-mix(in srgb,#fcc419 22%,var(--bg));color:color-mix(in srgb,#e67700 55%,var(--tx))}
.bday{background:linear-gradient(90deg,color-mix(in srgb,#f783ac 20%,var(--bg)),color-mix(in srgb,#fcc419 22%,var(--bg)));color:color-mix(in srgb,#e67700 50%,var(--tx))}
.btn.bhv.ok{background:color-mix(in srgb,#40c057 18%,var(--bg));color:color-mix(in srgb,#2b8a3e 70%,var(--tx));border-color:color-mix(in srgb,#40c057 45%,var(--bg))}
.btn.bhv.no{background:color-mix(in srgb,#fa5252 16%,var(--bg));color:color-mix(in srgb,#c92a2a 70%,var(--tx));border-color:color-mix(in srgb,#fa5252 45%,var(--bg))}
.st.p{background:color-mix(in srgb,#fcc419 25%,var(--bg))}
.tile.p{background:color-mix(in srgb,#fcc419 20%,var(--bg));color:color-mix(in srgb,#e67700 55%,var(--tx))}
.tile.x{background:repeating-linear-gradient(135deg,color-mix(in srgb,#fa5252 18%,var(--bg)),color-mix(in srgb,#fa5252 18%,var(--bg)) 10px,transparent 10px,transparent 20px)}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#222;color:#fff;padding:12px 18px;border-radius:14px;font-weight:600;max-width:90%;text-align:center;animation:up .2s}
.toast.act{display:flex;align-items:center;gap:12px;pointer-events:auto;padding:8px 8px 8px 18px;text-align:left;left:16px;right:16px;margin:0 auto;width:max-content;max-width:min(460px,calc(100% - 32px));box-sizing:border-box;transform:none}
.tbtn{flex:none;border:0;border-radius:10px;padding:9px 12px;background:#fff;color:#222;font:inherit;font-weight:800;cursor:pointer}
@keyframes pop{0%{transform:scale(.3)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes wig{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
@keyframes fl{0%{opacity:0;transform:translate(-50%,-30%) scale(.6)}20%{opacity:1;transform:translate(-50%,-80%) scale(1.15)}100%{opacity:0;transform:translate(-50%,-250%)}}
@keyframes fall{to{transform:translateY(110vh) rotate(540deg)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes boing{0%{transform:scale(.3)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
@media (max-width:600px){
 .tiles{grid-template-columns:repeat(2,1fr)}
 .kn{font-size:22px}
 .card{padding:12px}
 .tab{flex:1 1 30%;padding:9px 6px;font-size:14px}
 .krow .kbtns{width:100%;justify-content:space-between;margin-left:0}
 .icon{width:40px;height:40px}
 .kgrid{grid-template-columns:1fr}
 .mbtns{width:100%}
 .mbtns .btn{flex:1}
 .hd .tt{font-size:19px}
 .tt0{display:flex;flex-direction:column;min-width:0;line-height:1.1}
 .tt2{font-size:12px;font-weight:700;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .tt2::before{content:none}
 .hd .logo{width:28px;height:28px}
}
/* 🧒 Kompakte Kinder-Ansicht (1.9) */
.card.kc{gap:12px;padding-bottom:4px}
.kch{display:flex;align-items:center;gap:12px}
.kcav{position:relative;width:62px;height:62px;border-radius:50%;flex:none;display:grid;place-items:center;background:conic-gradient(var(--c,var(--ac)) var(--lv),var(--ln) 0)}
.kcav .avc{width:52px;height:52px;font-size:30px;border:3px solid var(--bg)}
.kcn{font-weight:900;font-size:21px;line-height:1.15;overflow-wrap:anywhere}
.kcl{font-size:13px;color:var(--mu);font-weight:700}
.kcnet{display:block;font-size:12px;font-weight:700;color:var(--ok)}.kcnet.neg{color:#e03131}
.kcpts{margin-left:auto;background:#fff5d6;color:#b07d00;border-radius:16px;padding:6px 12px;font-weight:900;font-size:22px;white-space:nowrap;text-align:center;line-height:1.1}
.kcpts small{display:block;font-size:11px;font-weight:700}
.kcgoal{display:flex;align-items:center;gap:8px;width:100%;font-size:14px;font-weight:700;text-align:left;padding:2px 0;color:var(--tx)}
.kcgoal .grow{flex:0 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:45%}
.kcgoal .bar{flex:1;height:9px}.kcgoal b{white-space:nowrap;color:var(--gold)}
.kcshelf{display:flex;gap:10px;flex-wrap:wrap}
.kcchip{position:relative;width:54px;height:54px;border-radius:17px;background:var(--soft);display:grid;place-items:center;font-size:26px}
.kcchip small{position:absolute;bottom:-5px;right:-6px;background:var(--ac);color:#fff;font-size:10.5px;font-weight:800;border-radius:10px;padding:1px 6px;line-height:1.4;white-space:nowrap}
.kcchip.adv{background:linear-gradient(135deg,#d6336c,#7b2cbf)}.kcchip.adv small{background:#ffd43b;color:#333}
.kcchip.hot{box-shadow:0 0 0 3px var(--gold)}
.kcchip>span{filter:drop-shadow(0 0 1px rgba(0,0,0,.35))}
.kcbody{display:flex;flex-direction:column;gap:10px;min-height:120px;padding-bottom:4px}
.kcnow{display:flex;justify-content:space-between;align-items:baseline;font-size:18px}
.kcrow{display:flex;align-items:center;gap:8px;width:100%;padding:11px 12px;border-radius:14px;background:var(--soft);font-size:14.5px;font-weight:700;text-align:left;color:var(--tx)}
.kcrow.ok{background:rgba(47,179,68,.14);color:#2b8a3e}
.kcrow.miss{opacity:.8}
.kcrow .kcem{font-weight:400;letter-spacing:1px}.kcrow .chev{opacity:.6}
.kcsec{font-weight:800;font-size:16px;margin-top:4px}
.kcfam{display:flex;flex-direction:column;gap:8px;background:var(--soft);border-radius:16px;padding:12px}
.kcrc{display:flex;align-items:center;gap:12px;width:100%;padding:12px;border-radius:16px;background:var(--soft);text-align:left;color:var(--tx)}
.kcrc .e{font-size:26px}.kcrc b{display:block}.kcrc small{color:var(--mu)}.kcrc.hot{box-shadow:inset 0 0 0 2px var(--gold)}
.kcnav{display:flex;margin:2px 0 0;border-top:1px solid var(--ln);background:var(--bg);position:sticky;bottom:0;z-index:2}
.kcnb{flex:1;position:relative;padding:8px 0 10px;font-size:11.5px;font-weight:700;color:var(--mu);display:flex;flex-direction:column;align-items:center;gap:1px}
.kcnb i{font-style:normal;font-size:22px;line-height:1.2}
.kcnb.on{color:var(--ac)}.kcnb.on::before{content:"";position:absolute;top:0;left:28%;right:28%;height:3px;border-radius:2px;background:var(--ac)}
.kcnb small{position:absolute;top:3px;left:calc(50% + 6px);background:#fa5252;color:#fff;border-radius:9px;font-size:10px;padding:0 5px;font-weight:800;line-height:1.5}
.rcp{text-align:center;display:flex;flex-direction:column;gap:6px}
.rcbig{font-size:52px;font-weight:900;line-height:1.1;color:var(--gold)}
.rcsub{font-weight:700}
.rcg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;text-align:left}
.rcc{background:var(--soft);border-radius:14px;padding:10px}.rcc b{display:block;font-size:16px;overflow-wrap:anywhere}.rcc span{font-size:12px;color:var(--mu)}
/* 🔊 Leseanfänger */
.tile.rd{min-height:150px}.tile.rd .e{font-size:64px}.tile.rd .t{font-size:14px}.tile.rd .p{font-size:16px}
.tile .say{position:absolute;bottom:8px;left:8px;width:36px;height:36px;border-radius:50%;background:var(--ac);color:#fff;display:grid;place-items:center;font-size:17px;box-shadow:0 2px 6px rgba(0,0,0,.18)}
/* ⏱️ Aufgaben-Timer */
.tile .tgo{display:block;margin-top:4px;background:linear-gradient(135deg,#5b6cff,#8b5cf6);color:#fff;border-radius:12px;padding:6px 10px;font-weight:800;font-size:13px;line-height:1.2}
.kt{position:fixed;inset:0;z-index:9700;display:grid;place-items:center;background:rgba(10,14,30,.55);--kpsb:max(env(safe-area-inset-bottom,0px),var(--safe-area-inset-bottom,0px))}.kt.app{--kpsb:max(env(safe-area-inset-bottom,0px),var(--safe-area-inset-bottom,0px),48px)}
.ktbox{width:min(420px,100vw);height:min(760px,100dvh);background:linear-gradient(160deg,#4c6ef5,#7b5cff 60%,#ff8a3d);color:#fff;display:flex;flex-direction:column;align-items:center;padding:18px 18px calc(22px + var(--kpsb,0px));border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,.35);text-align:center}
@media (max-width:480px){.ktbox{border-radius:0;width:100vw;height:100dvh}}
.kttop{display:flex;justify-content:space-between;align-items:center;width:100%;font-weight:800}
.ktx{min-width:38px;height:38px;border-radius:19px;background:rgba(255,255,255,.22);color:#fff;font-weight:800;padding:0 10px}
.ktring{position:relative;width:min(240px,62vw);aspect-ratio:1;margin-top:28px}
.ktring svg{width:100%;height:100%;transform:rotate(-90deg)}
.ktbg{fill:none;stroke:rgba(255,255,255,.22);stroke-width:16}
.ktfg{fill:none;stroke:#fff;stroke-width:16;stroke-linecap:round;transition:stroke-dashoffset .3s linear}
.kttime{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.kttime b{font-size:clamp(40px,13vw,58px);font-variant-numeric:tabular-nums;letter-spacing:1px}.kttime small{opacity:.85}
.kttitle{margin-top:22px;font-size:22px;font-weight:900}
.ktmsg{margin-top:4px;opacity:.95;font-weight:600;min-height:1.4em}
.ktmus{margin-top:14px;background:rgba(255,255,255,.18);color:#fff;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:700}
.ktbtns{margin-top:auto;display:flex;gap:10px;width:100%;align-items:center}
.ktbtns .btn{flex:1;padding:14px;border-radius:16px;font-size:16px}
.ktw{background:rgba(255,255,255,.22);color:#fff}.ktp{background:#fff;color:#4c46d8}
.ktpts{flex:1;background:#fff;color:#4c46d8;border-radius:16px;padding:14px;font-weight:800}
`;

  class YippeeCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._db = this._emptyDb();
      this._stored = new Set();
      this._recent = new Map();
      this._pending = new Map();
      this._pv = 0;
      this._q = Promise.resolve();
      this._loaded = false;
      this._tab = (() => { try { const x = localStorage.getItem('kpTab'); return ['heute', 'aufgaben', 'belohnungen', 'kinder', 'advent', 'zaehne', 'einst'].includes(x) ? x : 'heute'; } catch (e) { return 'heute'; } })();
      this._day = dk(new Date());
      this._until = 0;
      this._pinBuf = '';
    }

    _emptyDb() { return { kid: {}, task: {}, reward: {}, log: {}, req: {}, cfg: {}, act: {}, bak: {}, plan: {}, trash: {}, audit: {}, ph: {}, pt: {}, adc: {}, adk: {}, ado: {}, zc: {}, zk: {} }; }

    static getConfigElement() { return document.createElement('yippee-kids-chores-card-editor'); }
    static getStubConfig(hass) {
      const e = hass && Object.keys(hass.states).find((x) => x.startsWith('todo.') && /yippee|chores|kinder/i.test(x));
      return { storage: e || 'todo.yippee_kids_chores', mode: 'admin' };
    }
    getCardSize() { return 8; }

    setConfig(config) {
      if (!config || typeof config.storage !== 'string' || !config.storage.startsWith('todo.')) {
        throw new Error('Bitte "storage: todo.yippee_kids_chores" angeben (eine Lokale To-do-Liste als Speicher).');
      }
      const old = this._config;
      this._config = { mode: 'admin', ...config };
      this._look();
      if (old && old.storage === config.storage && this._loaded) this._syncCfg();
      if (old && old.storage !== config.storage) {
        this._unsub();
        // Andere Liste: alles verwerfen, was noch zur alten gehört (offene Schreibvorgänge, Prüf- und Sicherungsstand)
        this._gen = (this._gen || 0) + 1;
        this._db = this._emptyDb();
        this._stored = new Set();
        this._recent = new Map();
        this._pending = new Map();
        ['_dchk', '_dchkRuns', '_missPrev', '_badKeys', '_brokenKeys', '_bkRef', '_bk2', '_autoChecked', '_claimed', '_dupDone'].forEach((x) => { this[x] = undefined; });
        this._loaded = false;
        this._err = null;
        if (this._hass) this._subscribe();
      }
      this._render();
    }

    get _lang() { return LANG; }

    // Sprache: Karten-Option „language“ > Einstellung (alle Geräte) > Sprache des HA-Benutzers
    _langWant() {
      const pick = (x) => {
        const v = String(x || '').toLowerCase();
        if (!v || v === 'auto') return '';
        if (v === 'gsw' || v === 'de-ch-gsw') return 'gsw';
        const b = v.split(/[-_]/)[0];
        return LANGS.some((l) => l[0] === b) ? b : '';
      };
      return pick(this._config && this._config.language) || pick(this._loaded && this._cfg.lang) || pick(this._preLangGet()) || pick(this._hass && (this._hass.language || (this._hass.locale && this._hass.locale.language))) || 'de';
    }
    // 🌐 Im ersten Fenster gewählte Sprache (bevor es die Liste gibt) – wird danach als Einstellung übernommen
    _preLangGet() {
      if (this._preLang === undefined) { try { this._preLang = localStorage.getItem('kpPreLang') || ''; } catch (e) { this._preLang = ''; } }
      return this._preLang;
    }
    _haLangName() {
      const ha = String((this._hass && (this._hass.language || (this._hass.locale && this._hass.locale.language))) || '').toLowerCase(), b = ha.split(/[-_]/)[0];
      return (LANGS.find((l) => l[0] === b) || [ha, ha || '–'])[1];
    }
    // Sprachauswahl mit allen Sprachen (in ihrer eigenen Schreibweise); cls = prelang (erstes Fenster/Assistent)
    _langSelect(val, attr) {
      return `<select ${attr}><option value="" ${!val ? 'selected' : ''}>${esc(T('Automatisch (Sprache von Home Assistant: {l})', { l: this._haLangName() }))}</option>${LANGS.map(([code, n]) => `<option value="${code}" ${val === code ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
    }

    _langCheck() {
      const want = this._langWant();
      if (want === LANG || this._langTry === want) return;
      // Alle Karten einer Seite teilen sich eine Sprache. Hat jemand sie gerade auf einer anderen Karte von Hand gewählt, bleibt sie –
      // sonst würde z. B. eine zweite Karte mit anderer Einstellung sie gleich wieder umstellen
      const own = window.__kpLangOwner;
      if (own && own !== this && own.isConnected) return;
      this._langTry = want;
      loadLang(want).then((ok) => { if (!ok) this._langFail = want; else this._langFail = ''; this._render(); });
    }

    set hass(h) {
      const first = !this._hass;
      this._hass = h;
      this._langCheck();
      if (!this._built) this._build();
      if (!first && this._dmLast !== this._darkMode()) this._look(); // Home Assistant hell ↔ dunkel umgeschaltet
      this._dmLast = this._darkMode();
      if (first) { this._subscribe(); this._render(); }
      else if (!this._sub && !this._loaded && this.isConnected && h.states[this._config.storage] && Date.now() - (this._retry || 0) > 30000) {
        this._retry = Date.now();
        this._subscribe();
      }
    }

    connectedCallback() {
      window.__kpCards = window.__kpCards || [];
      if (!window.__kpCards.includes(this)) { window.__kpCards.push(this); this._famSync(); }
      if (this._hass && this._built) this._subscribe();
      if (!this._ro && typeof ResizeObserver === 'function') { this._ro = new ResizeObserver(() => { cancelAnimationFrame(this._ftR); this._ftR = requestAnimationFrame(() => this._fitTabs()); }); } // erst im nächsten Bild: kein „ResizeObserver loop“
      if (this._ro) this._ro.observe(this);
      clearInterval(this._timer);
      this._timer = setInterval(() => {
        if (dk(new Date()) !== this._day) { this._day = dk(new Date()); this._render(); }
        if (this._wasOpen && this._locked()) { this._wasOpen = false; this._closeModal(); this._render(); }
        this._schedulePenalty();
        this._pushSensors();
        const sig = this._loaded ? this._winSig() : '';
        if (sig !== this._sig) { this._sig = sig; this._render(); }
      }, 60000);
    }

    disconnectedCallback() {
      window.__kpCards = (window.__kpCards || []).filter((c) => c !== this);
      this._famSync();
      clearInterval(this._timer);
      clearTimeout(this._penT);
      if (this._ro) this._ro.disconnect();
      this._unsub();
    }

    // 🎨 Darstellung: Karten-Konfiguration (compact, transparent, scale 70–130 %, equal_tiles) hat Vorrang, sonst ⚙️ → 🎨 Darstellung (vCompact, vTransp, vScale, vEqual) für alle Karten
    // – dazu CSS-Variablen --yippee-bg/-surface/-accent/-text für Themes und card_mod
    _lookVals() {
      const c = this._config || {}, g = (this._db && this._db.cfg && this._db.cfg.main) || {};
      const pick = (v, d) => (v === undefined || v === null || v === '' ? !!d : v === true || v === 'true' || v === 'on' || v === 1);
      const sc = Math.min(130, Math.max(70, Number(c.scale !== undefined && c.scale !== '' ? c.scale : g.vScale) || 100));
      const th = c.colors !== undefined && c.colors !== '' ? String(c.colors) : (g.vTheme || '');
      return { transparent: pick(c.transparent, g.vTransp), compact: pick(c.compact, g.vCompact), equal: pick(c.equal_tiles, g.vEqual), scale: sc, colors: th === 'default' ? null : themeCols(th, this._colPrev || g.vCol, this._darkMode(), !!g.vDarkOwn) };
    }

    _darkMode() { return !!(this._hass && this._hass.themes && this._hass.themes.darkMode); }

    _look() {
      const st = this.shadowRoot && this.shadowRoot.getElementById('look');
      if (!st) return;
      const v = this._lookVals();
      const css = [
        v.transparent ? '.card{background:transparent;border-color:transparent;box-shadow:none}' : '',
        v.compact ? '.card{padding:10px;gap:8px}.tile{min-height:96px;padding:8px 4px;gap:3px}.rw{padding:8px;gap:3px}.row{padding:6px 8px}.box{padding:10px}' : '',
        // 📏 gleich hohe Kacheln: Name immer 3 Zeilen, Info immer 2 Zeilen hoch – längere Texte mit „…“
        v.equal ? '.tile .t{display:flex;align-items:center;justify-content:center;height:3.75em;line-height:1.25}.tile .t>span{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}.tile .p{height:2.5em;line-height:1.25;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;text-align:center}'
          // 🎁 Belohnungen: Name immer 2 Zeilen hoch, alle Reihen gleich hoch, Knopf unten bündig
          + '.rws{grid-auto-rows:1fr}.rw .t{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;height:2.5em;line-height:1.25}.rw>.btn,.rw>.shbtns{margin-top:auto}' : '',
        v.scale !== 100 ? `:host{zoom:${v.scale / 100}}` : '',
        // 🎨 Farben (nur geprüfte #rrggbb-Werte landen im CSS)
        v.colors ? `:host{--yippee-bg:${v.colors.bg};--yippee-surface:${v.colors.surface};--yippee-text:${v.colors.text};--yippee-text-secondary:${v.colors.mu};--yippee-accent:${v.colors.accent};--divider-color:${mixHex(v.colors.text, v.colors.bg, 0.18)}}` : '',
      ].join('');
      if (st.textContent !== css) st.textContent = css;
    }

    _build() {
      this.shadowRoot.innerHTML = `<style>${CSS}</style><style id="look"></style><div id="app" lang="de"></div><div id="modal"></div><div id="fx"></div>`;
      this._look();
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      ['pointerdown', 'pointerup', 'pointermove', 'pointercancel'].forEach((ev) => this.shadowRoot.addEventListener(ev, (e) => this._sumPointer(e)));
      this.shadowRoot.addEventListener('keydown', (e) => { const el = e.target && e.target.closest && e.target.closest('.ksum.act'); if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); this._sumFire(el.dataset.kid, 'tap'); } });
      // aufgeklappte Bereiche der Datensicherung überleben das Neuzeichnen
      this.shadowRoot.addEventListener('toggle', (e) => { const d = e.target; if (!d || !d.classList) return; if (d.classList.contains('bklist')) this._bkListOpen = d.open; if (d.classList.contains('bk2')) this._bk2Open = d.open; if (d.classList.contains('sensy')) this._sensyOpen = d.open; }, true);
      this.shadowRoot.addEventListener('input', (e) => {
        if (e.target && e.target.name === 'tplq') this._filterTpl(e.target.closest('.mbox'));
        if (e.target && e.target.classList && e.target.classList.contains('setq')) this._filterSet();
        if (e.target && e.target.classList && e.target.classList.contains('wizq')) this._wizFilter();
        if (e.target && e.target.dataset && e.target.dataset.cfgcol && HEX(e.target.value)) { this._colPrev = { ...(this._cfg.vCol || {}), [e.target.dataset.cfgcol]: e.target.value }; this._look(); } // 🎨 Vorschau beim Ziehen
        if (e.target && e.target.classList && e.target.classList.contains('wcost')) { this._wcost = this._wcost || {}; this._wcost[e.target.dataset.q] = e.target.value; } // Eingabe überlebt Neuzeichnen
      });
      this.shadowRoot.addEventListener('change', (e) => {
        const el = e.target;
        if (el && el.name === 'share') { const rk = this.shadowRoot.querySelector('#modal .sw-rkid'); if (rk) rk.style.display = el.checked ? 'none' : 'block'; }
        if (el && el.classList && el.classList.contains('prelang')) {
          // 🌐 Sprache im ersten Fenster bzw. im Assistenten: nur dieses Sprachpaket wird geladen
          this._preLang = el.value; try { if (el.value) localStorage.setItem('kpPreLang', el.value); else localStorage.removeItem('kpPreLang'); } catch (e2) { /* egal */ }
          if (this._loaded && this._isParent() && this._hass.states[this._config.storage]) { this._setCfg({ lang: el.value }); this._preLang = ''; try { localStorage.removeItem('kpPreLang'); } catch (e2) { /* egal */ } }
          window.__kpLangOwner = this; this._langTry = null; // eben von Hand gewählt: diese Karte bestimmt die Sprache der Seite
          this._langCheck(); this._render(); return;
        }
        if (this._locked()) { this._render(); return; }
        if (this._pin()) this._touch();
        if (el && el.dataset && el.dataset.rstep !== undefined) { this._routStep(el); return; }
        if (el && el.classList && el.classList.contains('wizt')) { this._wizCount(); return; }
        if (el && el.classList && (el.classList.contains('wizem') || el.classList.contains('wizcol'))) {
          const p = this.shadowRoot.querySelector('.wizavp');
          if (p) { if (el.classList.contains('wizem')) p.querySelector('.wizave').textContent = el.value; else p.setAttribute('style', cv(el.value)); }
          return;
        }
        if (el && /^ph_/.test(el.name || '')) { const w = el.closest('.g2') && el.closest('.g2').querySelector('.pwk'); if (w) w.style.visibility = /W$/.test(el.value) ? 'visible' : 'hidden'; }
        if (el && el.dataset && el.dataset.gst !== undefined) {
          const sc = this._gScale(), all = { ...(this._cfg.gStars || {}) }, arr = [...(all[sc.id] || [])];
          arr[Number(el.dataset.gst)] = Math.max(0, Math.round(Number(el.value) || 0)); all[sc.id] = arr;
          this._setCfg({ gStars: all });
        }
        if (el && el.dataset && el.dataset.blkb) {
          const box = el.closest('.blkset'), v = {};
          box.querySelectorAll('[data-blkb]').forEach((x) => { v[x.dataset.blkb] = x.value; });
          if (!['mi', 'na', 'a'].every((k) => /^\d\d:\d\d$/.test(v[k] || '')) || !(v.mi > '00:00' && v.mi < v.na && v.na < v.a)) { this._toast(T('⚠️ Die Blöcke müssen nacheinander kommen: Mittags vor Nachmittags vor Abends.')); this._render(); return; }
          this._setCfg({ blkB: v });
          return;
        }
        if (el && el.dataset && el.dataset.cfgn) this._setCfg({ [el.dataset.cfgn]: Math.max(Number(el.dataset.min || 0), Number(el.value) || 0) });
        if (el && (el.name === 'kid' || (el.dataset && el.dataset.a === 'tplall'))) this._filterTpl(el.closest('.mbox'));
        if (el && el.dataset && el.dataset.cfgs) this._setCfg({ [el.dataset.cfgs]: el.value });
        if (el && el.dataset && el.dataset.cfgcol && HEX(el.value)) {
          // 🎨 eigene Farbe: neuer Hintergrund → Schrift und Kacheln wieder automatisch passend
          const k = el.dataset.cfgcol, cur = { ...(this._cfg.vCol || {}), [k]: el.value.toLowerCase() };
          if (k === 'bg') { delete cur.text; delete cur.surface; }
          this._colPrev = null; this._setCfg({ vCol: cur }); this._render();
        }
        if (el && el.dataset && el.dataset.cfgs === 'hc') this._setCfg({ hr: '', bl: '' });
        if (el && el.dataset && el.dataset.cfgs === 'lang') { this._langTry = null; window.__kpLangOwner = this; setTimeout(() => { this._langCheck(); this._holTry = 0; this._holCheck(true); }, 50); }
        if (el && el.dataset && ['hc', 'hr', 'holCal', 'ferCal'].includes(el.dataset.cfgs)) { this._holTry = 0; setTimeout(() => this._holCheck(true), 50); }
        if (el && el.name === 'cal') this._calPrevUpd();
        if (el && el.name === 'bkfile' && el.files && el.files[0]) {
          const rd = new FileReader();
          rd.onload = () => { const ta = el.closest('.mbox').querySelector('[name=bk]'); if (ta) ta.value = rd.result; };
          rd.readAsText(el.files[0]);
        }
      });
      this._built = true;
    }

    // ---------- Speicher ----------
    async _subscribe() {
      if (this._sub || !this._hass || !this._config) return;
      if (!this._hass.states[this._config.storage]) { this._render(); return; }
      this._sub = 'pending';
      // Nur Meldungen des aktuellen Abos übernehmen: kommt nach einem Listenwechsel noch etwas von der alten Liste, wird es ignoriert
      const tok = {}, ent = this._config.storage;
      this._subTok = tok;
      try {
        const u = await this._hass.connection.subscribeMessage((m) => { if (this._subTok === tok && this._config && this._config.storage === ent) this._onItems(m.items || []); }, { type: 'todo/item/subscribe', entity_id: ent });
        if (this.isConnected && this._sub === 'pending' && this._subTok === tok) this._sub = u; else { u(); if (this._sub === 'pending' && this._subTok === tok) this._sub = null; }
      } catch (err) {
        if (this._subTok !== tok) return; // inzwischen gibt es ein neueres Abo
        this._sub = null;
        this._err = T('Speicher {storage} nicht lesbar: {err}', { storage: this._config.storage, err: err.message || err.code || err });
        this._render();
      }
    }

    // 📱 Offene Freigaben (wartende Aufgaben, unentschiedene Verpasst-Meldungen, Anfragen) als Nachrichten-Kennungen
    _openTags() {
      const out = new Set(), from = keyAdd(dk(new Date()), -7);
      Object.entries(this._db.log || {}).forEach(([d, l]) => {
        if (d < from || !l || !l.s) return;
        Object.entries(l.s).forEach(([k, v]) => {
          if ((v !== 'p' && v !== 'm') || k.split(':').length !== 2) return;
          const [tid, kid] = k.split(':');
          out.add(pushTag(`KP|${v === 'p' ? 'ok' : 'me'}|${d}|${tid}|${kid}`));
        });
      });
      Object.values(this._db.req || {}).forEach((q) => out.add(pushTag(`KP|${q.grade ? 'gok' : 'rok'}|${q.id}`)));
      return out;
    }
    // Erledigt (freigegeben, abgelehnt, entschieden, zurückgenommen – egal wo): Nachricht auf allen Handys entfernen
    // Handys aus 🔔 Benachrichtigungen (Home-Assistant-App) – an sie geht „Nachricht entfernen“
    _appPhones() { return [...new Set((this._cfg.targets || []).filter((t) => !t.includes('.') && t.startsWith('mobile_app_')))].sort(); }
    _pushClear() {
      const now = this._openTags(), prev = this._tagsPrev;
      this._tagsPrev = now;
      if (!prev) return;
      const phones = this._appPhones().filter((t) => ((this._hass.services || {}).notify || {})[t]);
      if (!phones.length) return;
      const g = (window.__kpClr = window.__kpClr || {});
      prev.forEach((tag) => {
        if (now.has(tag) || (g[tag] && Date.now() - g[tag] < 3000)) return; // mehrere Karten auf einer Seite: nur einmal
        g[tag] = Date.now();
        phones.forEach((t) => this._hass.callService('notify', t, { message: 'clear_notification', data: { tag } }, undefined, false).catch(() => { /* Handy nicht erreichbar */ }));
      });
    }

    _unsub() { if (typeof this._sub === 'function') this._sub(); this._sub = null; this._subTok = null; }

    _onItems(items) {
      const db = this._emptyDb(), stored = new Set(), seen = new Set(), bad = new Set(), broken = new Set(), sensRaw = {}, sensSt = {};
      const mem = { total: 0, by: {} };
      for (const it of items) {
        if (!it.summary || !it.summary.startsWith('kp|')) continue;
        { const sz = it.summary.length + (it.description || '').length, ty = it.summary.split('|')[1] || '?'; mem.total += sz; mem.by[ty] = (mem.by[ty] || 0) + sz; }
        if (seen.has(it.summary)) {
          const u = it.uid;
          this._dupDone = this._dupDone || new Set();
          if (u && !this._dupDone.has(u)) { this._dupDone.add(u); this._enq(() => this._svc('remove_item', { item: u }).catch(() => { /* schon entfernt */ })); }
          continue;
        }
        seen.add(it.summary);
        stored.add(it.summary);
        const [, type, id] = it.summary.split('|');
        if (type === 'sens' && /^[\w-]+$/.test(id || '')) { sensRaw[id] = it.description || ''; sensSt[id] = it.status || ''; continue; } // 🔁 dauerhafte Sensoren (für die Vorlage in configuration.yaml)
        if (!Object.prototype.hasOwnProperty.call(db, type) || !/^[\w-]+$/.test(id || '') || id === '__proto__') continue;
        if (type === 'bak') { db.bak[id] = { id, raw: it.description || '' }; continue; }
        if (type === 'ph') { db.ph[id] = { id, raw: it.description || '' }; continue; } // Foto: erst bei Bedarf auslesen
        let o;
        try { o = JSON.parse(it.description || '{}'); } catch (e) { broken.add(`${type}|${id}`); continue; } // defekter Eintrag
        if (!o || typeof o !== 'object' || Array.isArray(o)) { broken.add(`${type}|${id}`); continue; }
        if (o._c !== undefined) { const c = o._c; delete o._c; if (hsh(JSON.stringify(o)) !== c) bad.add(`${type}|${id}`); }
        db[type][id] = this._clean(type, { ...o, id });
      }
      this._badKeys = bad; this._brokenKeys = broken; this._mem = mem; this._sensRaw = sensRaw; this._sensSt = sensSt;
      const now = Date.now();
      this._recent.forEach((t, k) => { if (now - t < 15000) stored.add(k); else this._recent.delete(k); });
      this._pending.forEach((p, k) => {
        if (p.del) delete db[p.type][p.id]; else db[p.type][p.id] = { ...p.data, id: p.id };
        if (this._stored.has(k)) stored.add(k);
      });
      this._expandTasks(db);
      Object.keys(db.kid).forEach((id) => { db.kid[id] = this._kidDerive(db.kid[id], db.pt); });
      this._db = db;
      this._dbv = (this._dbv || 0) + 1;
      this._stored = stored;
      clearTimeout(this._consT); if (Object.keys(db.pt).length) this._consT = setTimeout(() => this._consCheck(), 6000);
      if (!this._loaded) { this._loaded = true; this._cleanup(); this._schedulePenalty(); this._kViewInit(); }
      this._syncCfg();
      this._pushClear();
      this._err = null;
      this._langTry = this._langWant() === LANG ? this._langTry : null;
      this._langCheck();
      this._render();
      this._scheduleActs();
      this._pushSensors();
    }

    // Aufgaben „zweimal am Tag“: aus einer gespeicherten Aufgabe werden zwei Teil-Aufgaben (id-1, id-2) mit eigenem Zeitfenster
    _expandTasks(db) {
      Object.keys(db.task).forEach((id) => { if (db.task[id].virtual) delete db.task[id]; });
      Object.values(db.task).forEach((t) => {
        if (!Array.isArray(t.slots) || t.slots.length < 2) return;
        t.slots.forEach((sl, i) => {
          const vid = `${t.id}-${i + 1}`;
          db.task[vid] = { ...t, id: vid, from: sl.from, to: sl.to, slots: undefined, virtual: true, parent: t.id, part: i + 1, parts: t.slots.length };
        });
      });
      this._calLinkTasks(db);
    }

    // 🗓️ „Jeder Termin wird eine Aufgabe“: aus jedem passenden Kalendertermin eine eigene (virtuelle) Aufgabe für die gewählten Kinder
    _calLinkTasks(db) {
      const cfg = (db.cfg && db.cfg.main) || {};
      if (!cfg.calOn || !Array.isArray(cfg.calLinks) || !this._hass) return;
      const hide = new Set(Array.isArray(cfg.calHide) ? cfg.calHide : []), from = dk(new Date(Date.now() - 14 * 864e5));
      const hash = (x) => { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h * 33) ^ x.charCodeAt(i)) >>> 0; return h.toString(36); };
      cfg.calLinks.forEach((L) => {
        if (!L || !L.ent || !/^[\w-]{1,24}$/.test(String(L.id || ''))) return;
        this._calEvents(L.ent);
        const it = ((this._calc || {})[L.ent] || {}).it || [];
        const kw = String(L.kw || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
        const kids = (L.kids || []).filter((k) => db.kid[k]);
        if (!kids.length) return;
        it.forEach((e) => {
          if (kw.length && !kw.some((k) => e.s.toLowerCase().includes(k))) return;
          let d = e.d;
          if (L.prev) { const [y, m, dd] = d.split('-').map(Number); d = dk(new Date(y, m - 1, dd - 1)); }
          if (d < from) return;
          const vid = `kal-${L.id}-${hash(e.uid ? `${e.uid}|${e.rid || e.d}` : `${e.d}|${e.s}`)}`;
          if (db.task[vid]) return;
          db.task[vid] = { id: vid, title: e.s || T('📅 Termin'), emoji: L.emoji || '📝', points: Math.max(0, Number(L.pts) || 0), penalty: Math.max(0, Number(L.pen) || 0), penaltySince: L.since || d, kids, sched: 'dates', dates: [d], days: [], from: '', to: '', virtual: true, calLink: L.id, calDue: e.d, calHidden: hide.has(vid), created: d };
        });
      });
      Object.keys(db.task).forEach((id) => { if (db.task[id].calHidden) db.task[id].dates = []; });
    }

    // Werte aus der To-do-Liste absichern (die Liste kann jeder HA-Benutzer bearbeiten)
    _clean(type, o) {
      const num = (k) => { if (o[k] !== undefined && o[k] !== null && o[k] !== '') o[k] = Number(o[k]) || 0; };
      const tm = (k) => { if (o[k] && !/^\d\d:\d\d$/.test(String(o[k]))) o[k] = ''; };
      if (type === 'kid') {
        num('points'); num('total'); num('bd'); num('bm'); num('by'); num('jokers'); num('doneCount'); num('best'); num('onceCount');
        if (o.color && !/^#[0-9a-f]{3,8}$/i.test(o.color)) o.color = '';
        if (Array.isArray(o.ledger)) o.ledger = o.ledger.filter((x) => x && typeof x === 'object').map((x) => ({ ...x, n: Number(x.n) || 0, ...(x.w !== undefined ? { w: Number(x.w) || 0 } : {}), ...(x.e !== undefined ? { e: Number(x.e) || 0 } : {}), d: /^\d{4}-\d\d-\d\d$/.test(String(x.d)) ? x.d : '', t: /^\d\d:\d\d$/.test(String(x.t)) ? x.t : '' }));
        if (Array.isArray(o.grades)) o.grades = o.grades.filter((x) => x && typeof x === 'object').map((x) => ({ ...x, p: Number(x.p) || 0, ...(x.g !== undefined ? { g: Number(x.g) || 0 } : {}) }));
        if (o.pres && o.pres.hol && typeof o.pres.hol === 'object') Object.keys(o.pres.hol).forEach((h) => { const v = o.pres.hol[h]; if (v && typeof v === 'object') v.w = Number(v.w) || 0; });
        if (o.user !== undefined && !/^[\w-]{0,64}$/.test(String(o.user))) o.user = '';
        if (o.ap !== undefined) o.ap = Array.isArray(o.ap) ? o.ap.filter((x) => typeof x === 'string' && /^[\w-]{1,40}$/.test(x)).slice(0, 400) : [];
        if (o.vgone !== undefined) o.vgone = Array.isArray(o.vgone) ? o.vgone.filter((x) => typeof x === 'string' && /^[\w-]{1,40}$/.test(x)).slice(0, 50) : [];
        ['history', 'vouch'].forEach((f) => { if (o[f] !== undefined && !Array.isArray(o[f])) delete o[f]; });
        ['rd', 'rw'].forEach((f) => { if (o[f] === undefined) return; if (!o[f] || typeof o[f] !== 'object' || Array.isArray(o[f])) { delete o[f]; return; } const x = {}; Object.keys(o[f]).forEach((d) => { const v = o[f][d]; if (/^\d{4}-\d\d-\d\d$/.test(d) && Array.isArray(v)) x[d] = v.slice(0, 6).map((n) => Math.round(Number(n) || 0)); }); o[f] = x; });
        if (o.rdr !== undefined) o.rdr = !!o.rdr;
        if (o.rdOut !== undefined && !['dev', 'spk'].includes(o.rdOut)) o.rdOut = 'dev';
        if (Array.isArray(o.vouch)) o.vouch = o.vouch.filter((x) => x && typeof x === 'object' && /^[\w-]{1,40}$/.test(String(x.id || ''))).slice(0, 50);
      }
      if (type === 'pt') return this._ptClean(o);
      if (type === 'adc' || type === 'adk' || type === 'ado') return this._advClean(type, o);
      if (type === 'zc' || type === 'zk') return this._zClean(type, o);
      if (type === 'reward' && o.adv !== undefined) o.adv = !!o.adv;
      if (type === 'task') {
        if (o.steps !== undefined) o.steps = Array.isArray(o.steps) ? o.steps.filter((x) => x && typeof x === 'object' && x.t).map((x) => (x.tid && /^[\w-]{1,40}$/.test(String(x.tid)) && x.tid !== '__proto__' ? { t: String(x.t).slice(0, 60), tid: String(x.tid) } : { t: String(x.t).slice(0, 60), ...(typeof x.z === 'boolean' ? { z: x.z } : {}) })).slice(0, 12) : [];
        if (o.nfc !== undefined && !/^[\w:.-]{1,80}$/.test(String(o.nfc))) delete o.nfc;
        // ⏱️ Timer
        if (o.tmr !== undefined) { const m = Math.round(Number(o.tmr) || 0); if (m > 0) o.tmr = Math.min(180, m); else { delete o.tmr; delete o.tmrEnd; delete o.tmrMus; } }
        if (o.tmrEnd !== undefined && !['auto', 'ok', 'cd'].includes(o.tmrEnd)) o.tmrEnd = 'auto';
        if (o.tmrMus !== undefined && !['std', 'own', 'off'].includes(o.tmrMus)) o.tmrMus = 'std';
      }
      if (type === 'task') { num('points'); num('penalty'); tm('from'); tm('to'); num('sFrom'); num('sTo'); if (Array.isArray(o.slots)) o.slots = o.slots.filter((x) => x && /^\d\d:\d\d$/.test(x.from) && /^\d\d:\d\d$/.test(x.to)).slice(0, 5); else delete o.slots; }
      if (type === 'reward') {
        num('cost'); num('limit');
        if (o.kids !== undefined) { if (Array.isArray(o.kids)) o.kids = o.kids.filter((x) => typeof x === 'string' && /^[\w-]{1,40}$/.test(x)).slice(0, 20); else delete o.kids; }
        if (o.costs && typeof o.costs === 'object' && !Array.isArray(o.costs)) { const cs = {}; Object.keys(o.costs).forEach((id) => { const v = Math.round(Number(o.costs[id]) || 0); if (/^[\w-]+$/.test(id) && id !== '__proto__' && v > 0 && v <= 100000) cs[id] = v; }); o.costs = cs; } else delete o.costs;
      }
      const phOk = (x) => PH_RX.test(String(x)) || MEDIA_RX.test(String(x));
      if (type === 'req' && o.pool) {
        const idOk = (x) => typeof x === 'string' && /^[\w-]{1,40}$/.test(x) && x !== '__proto__';
        o.need = Array.isArray(o.need) ? o.need.filter(idOk).slice(0, 20) : [];
        const cv = {}, pd = {};
        if (o.cov && typeof o.cov === 'object') Object.keys(o.cov).forEach((x) => { if (idOk(x) && idOk(o.cov[x])) cv[x] = o.cov[x]; });
        if (o.paid && typeof o.paid === 'object') Object.keys(o.paid).forEach((x) => { const v = Math.round(Number(o.paid[x]) || 0); if (idOk(x) && v > 0 && v <= 100000) pd[x] = v; });
        o.cov = cv; o.paid = pd;
      }
      if (type === 'reward' && o.shareKids !== undefined) o.shareKids = Array.isArray(o.shareKids) ? o.shareKids.filter((x) => typeof x === 'string' && /^[\w-]{1,40}$/.test(x)).slice(0, 20) : [];
      if (type === 'req' && o.grade && typeof o.grade === 'object' && o.grade.photo && !phOk(o.grade.photo)) { o.grade = { ...o.grade }; delete o.grade.photo; }
      if (type === 'log' && o.s && typeof o.s === 'object') Object.keys(o.s).forEach((x) => { if (x.startsWith('f:') && !phOk(o.s[x])) delete o.s[x]; });
      if (type === 'cfg' && o.fam) { o.fam = { ...o.fam, cost: Number(o.fam.cost) || 0, pts: Number(o.fam.pts) || 0 }; }
      if (type === 'cfg') {
        if (o.kView !== undefined && !['compact', 'classic'].includes(o.kView)) delete o.kView;
        if (o.pinL !== undefined) o.pinL = Math.min(8, Math.max(4, Number(o.pinL) || 4));
        if (Array.isArray(o.vac)) o.vac = o.vac.filter((x) => x && /^\d{4}-\d\d-\d\d$/.test(String(x.from)) && /^\d{4}-\d\d-\d\d$/.test(String(x.to)));
      }
      return o;
    }

    // 🎄 Adventskalender-Daten prüfen (Türchen, Reihenfolge, geöffnete Türchen)
    _advClean(type, o) {
      const obj = (v) => v && typeof v === 'object' && !Array.isArray(v);
      if (type === 'adk') {
        if (o.doors !== undefined) {
          const d = {};
          if (obj(o.doors)) Object.keys(o.doors).forEach((n) => { const x = o.doors[n]; if (/^\d{1,2}$/.test(n) && obj(x)) d[n] = x; });
          o.doors = d;
        }
        if (o.perm !== undefined && !(Array.isArray(o.perm) && o.perm.length <= 31 && o.perm.every((x) => Number.isInteger(x)))) delete o.perm;
        if (o.dev !== undefined && !/^[\w]{0,80}$/.test(String(o.dev))) o.dev = '';
        if (o.bgImg !== undefined && typeof o.bgImg !== 'string') o.bgImg = '';
      }
      if (type === 'ado') {
        o.y = Number(o.y) || 0;
        ['d', 'b'].forEach((f) => { const x = {}; if (obj(o[f])) Object.keys(o[f]).forEach((n) => { if (/^\d{1,2}$/.test(n)) x[n] = Number(o[f][n]) || 1; }); o[f] = x; });
      }
      if (type === 'adc' && o.col !== undefined && !obj(o.col)) o.col = {};
      return o;
    }

    _svc(s, data) { return this._hass.callService('todo', s, data, { entity_id: this._config.storage }, false); }

    _enq(fn) {
      const g = this._gen || 0;
      this._q = this._q.then(() => (g === (this._gen || 0) ? fn() : undefined)).catch((err) => { console.error('Yippee:', err); this._toast(T('Speichern fehlgeschlagen: {err}', { err: err.message || err })); });
    }

    // merge(cur): baut den neuen Datensatz auf Basis des aktuellen Server-Stands (kurz vor dem Schreiben frisch gelesen) –
    // so überschreibt ein Gerät keine Änderungen, die ein anderes Gerät gerade gespeichert hat.
    _save(type, id, data, merge) {
      const key = `kp|${type}|${id}`;
      const raw0 = JSON.parse(JSON.stringify(data || {}));
      const clean = this._clean(type, raw0 && typeof raw0 === 'object' && !Array.isArray(raw0) ? raw0 : {}); // auch lokal nur geprüfte Werte (z. B. aus Sicherungsdateien)
      delete clean.id;
      this._db[type][id] = { ...clean, id };
      this._dbv = (this._dbv || 0) + 1;
      if (type === 'task') this._expandTasks(this._db);
      const v = ++this._pv;
      this._pending.set(key, { type, id, data: clean, v });
      if (TRACK.includes(type) && !this._noTomb && (this._cfg.tomb || {})[`${type}|${id}`]) this._tomb(`${type}|${id}`, false);
      this._enq(async () => {
        try {
          let desc = stamp(clean), exists = this._stored.has(key);
          if (merge) {
            try {
              // frisch lesen; lag zwischen Lesen und Schreiben eine Pause (Handy im Standby), noch einmal lesen
              let r = null;
              for (let i = 0; i < 3; i++) { const tq = Date.now(); r = await this._hass.callWS({ type: 'todo/item/list', entity_id: this._config.storage }); if (Date.now() - tq <= 1500) break; }
              const it = ((r && r.items) || []).find((x) => x.summary === key);
              exists = !!it;
              let cur = {};
              if (it) { try { cur = JSON.parse(it.description || '{}'); } catch (e) { cur = {}; } }
              if (cur) delete cur._c;
              const m0 = JSON.parse(JSON.stringify(merge(cur || {}) || {}));
              const m = this._clean(type, m0 && typeof m0 === 'object' && !Array.isArray(m0) ? m0 : {}); // auch der frische Server-Stand wird geprüft
              delete m.id; delete m._c;
              desc = stamp(m);
              const p = this._pending.get(key);
              if (p && p.v === v) { p.data = m; this._db[type][id] = type === 'kid' ? this._kidDerive({ ...m, id }) : { ...m, id }; this._dbv = (this._dbv || 0) + 1; }
            } catch (e) { /* ohne frischen Stand: lokale Version schreiben */ }
          }
          if (exists) {
            try { await this._svc('update_item', { item: key, description: desc }); }
            catch (e) { await this._svc('add_item', { item: key, description: desc }); }
          } else {
            await this._svc('add_item', { item: key, description: desc });
            this._recent.set(key, Date.now());
          }
          this._stored.add(key);
        } finally { const p = this._pending.get(key); if (p && p.v === v) this._pending.delete(key); }
      });
    }

    _del(type, id) {
      const key = `kp|${type}|${id}`;
      const old = this._db[type][id];
      if (TRACK.includes(type) && !this._noTomb && !(old || {}).virtual) this._tomb(`${type}|${id}`, true);
      if (TRACK.includes(type) && old && !old.virtual && !this._noTomb && !this._autoDel) this._audit(T('🗑️ Gelöscht: {x}', { x: `${{ kid: '👧', task: '📋', reward: '🎁' }[type]} ${old.name || old.title || id}` }));
      if (TRACK.includes(type) && old && !old.virtual && this._cfg.trashOn !== false) {
        const o = { ...old }; delete o.id;
        this._save('trash', `${type}-${id}`, { t: type, oid: id, d: dk(new Date()), u: this._uName(), o });
      }
      delete this._db[type][id];
      this._dbv = (this._dbv || 0) + 1;
      if (type === 'task') this._expandTasks(this._db);
      const v = ++this._pv;
      this._pending.set(key, { type, id, del: true, v });
      this._enq(async () => {
        try {
          if (this._stored.has(key)) { try { await this._svc('remove_item', { item: key }); } catch (e) { /* schon gelöscht */ } }
          this._stored.delete(key); this._recent.delete(key);
        }
        finally { const p = this._pending.get(key); if (p && p.v === v) this._pending.delete(key); }
      });
    }

    // Anfrage „beanspruchen“: erst wenn das Löschen auf dem Server klappt, wird gebucht.
    // So kann dieselbe Anfrage nicht auf zwei Geräten (oder per Knopf + Karte) doppelt freigegeben werden.
    async _claim(id) {
      const key = `kp|req|${id}`;
      this._claimed = this._claimed || new Set();
      if (this._claimed.has(key) || !this._db.req[id]) return false;
      this._claimed.add(key);
      if (!this._stored.has(key)) { this._del('req', id); return true; } // noch gar nicht gespeichert → nur lokal
      delete this._db.req[id]; this._dbv = (this._dbv || 0) + 1;
      const v = ++this._pv;
      this._pending.set(key, { type: 'req', id, del: true, v });
      let ok = true;
      try { await this._svc('remove_item', { item: key }); } catch (e) { ok = false; }
      this._stored.delete(key); this._recent.delete(key);
      const p = this._pending.get(key); if (p && p.v === v) this._pending.delete(key);
      if (!ok) { this._toast(T('Schon erledigt – das hat gerade jemand anderes freigegeben')); this._render(); }
      return ok;
    }

    // Eltern-Karte speichert Freigabe- und Push-Einstellung, damit alle Kinder-Karten sie übernehmen
    get _cfg() {
      const c = { approval: true, targets: [], nTask: true, nReward: true, nMiss: true, ...(this._db.cfg.main || {}) };
      if (!c.hc && c.bl) { c.hc = 'DE'; c.hr = c.bl; } // frühere Bundesland-Auswahl übernehmen
      return c;
    }

    // Land|Region für Ferien & Feiertage ('' = aus)
    _holKey() { const c = this._cfg; return c.hc ? `${c.hc}|${c.hr || ''}` : ''; }

    _setCfg(patch) {
      const c = { ...this._cfg, ...patch };
      delete c.id;
      this._save('cfg', 'main', c, (cur) => ({ ...cur, ...patch }));
      if (['calLinks', 'calHide', 'calOn'].some((k) => k in patch)) this._expandTasks(this._db); // 🗓️ Kalender-Aufgaben neu bilden
    }

    // Grabstein: die Karte hat diesen Eintrag absichtlich gelöscht (sonst meldet die Datenprüfung ihn als fehlend)
    _tomb(k, on) {
      const today = dk(new Date());
      const upd = (t0) => {
        const t = {};
        Object.entries(t0 || {}).forEach(([x, d]) => { if (dayDiff(d, today) <= 90) t[x] = d; });
        if (on) t[k] = today; else delete t[k];
        return t;
      };
      if (!this._db.cfg.main) return;
      const c = { ...this._db.cfg.main, tomb: upd(this._db.cfg.main.tomb) };
      delete c.id;
      this._save('cfg', 'main', c, (cur) => ({ ...cur, tomb: upd(cur.tomb) }));
    }

    _syncCfg() {
      if (['kid', 'advent'].includes(this._config.mode)) return;
      const c = this._cfg, patch = {};
      const legacy = String(this._config.notify || '').replace(/^notify\./, '');
      if (legacy && !c.targets.includes(legacy) && !c.legacyDone) { patch.targets = [...c.targets, legacy]; patch.legacyDone = true; }
      if (this._config.approval === false && c.approval && !c.legacyApproval) { patch.approval = false; patch.legacyApproval = true; }
      if (Object.keys(patch).length) this._setCfg(patch);
    }

    _cleanup(days = 60) {
      const d = new Date(); d.setDate(d.getDate() - days);
      const cut = dk(d);
      const d2 = new Date(); d2.setDate(d2.getDate() - 14);
      const cut2 = dk(d2);
      const adm = this._admin();
      Object.keys(this._db.log).forEach((k) => {
        const sm = this._db.log[k].s || {};
        if (k >= cut || Object.values(sm).some((v) => v === 'm' || v === 'p')) return;
        if (Object.keys(sm).some((x) => x.startsWith('f:') && !PH_RX.test(sm[x])) && !adm) return; // Fotos im Medien-Ordner: nur ein Admin-Gerät räumt sie mit auf
        Object.keys(sm).forEach((x) => { if (x.startsWith('f:') && sm[x]) this._photoDel(sm[x]); });
        this._del('log', k);
      });
      const cut7 = dk(new Date(Date.now() - 7 * 864e5));
      Object.values(this._db.req).forEach((r) => { if (r.pool && !this._poolDone(r) && r.d < cut7) this._shareCancel(r.id, false); });
      Object.values(this._db.req).forEach((r) => {
        if (r.pool) return;
        if (r.d >= cut) return;
        if (r.grade && r.grade.photo) { if (!adm && !PH_RX.test(r.grade.photo)) return; this._photoDel(r.grade.photo); }
        this._del('req', r.id);
      });
      const cut3 = dk(new Date(Date.now() - this._trashDays() * 864e5));
      Object.values(this._db.trash).forEach((x) => { if (!x.d || x.d < cut3) this._del('trash', x.id); });
      // Listen-Fotos ohne Bezug (z. B. Abbruch beim Melden) nach 1 Tag, alle anderen spätestens nach 30 Tagen entfernen
      const refs = this._phRefs(), nowT = Date.now();
      Object.values(this._db.ph).forEach((x) => { const m = this._phParse(x.raw); if (!m || (!refs.has(x.id) && nowT - m.ts > 864e5) || nowT - m.ts > 30 * 864e5) this._phDel(`ph:${x.id}`); });
      if (this._phEnt() !== this._config.storage) setTimeout(() => this._phLoad(true), 5000);
      this._autoDel = true;
      Object.values(this._db.task).forEach((t) => {
        if (t.sched !== 'once') return;
        if ((t.done && t.done.d < cut2) || (!t.done && t.until && t.until < cut2)) this._del('task', t.id);
      });
      this._autoDel = false;
    }

    // ---------- PIN-Schutz ----------
    // PIN: in den Einstellungen festgelegt (nur als Prüfwert gespeichert) – sonst wie bisher aus dem Karten-YAML
    _pin() {
      if (['kid', 'kids', 'advent'].includes(this._config.mode)) return '';
      const c = this._cfg;
      if (c.pinH && c.pinS && Number(c.pinL) >= 4) return '•'.repeat(Number(c.pinL));
      return String(this._config.pin ?? '').replace(/\D/g, '');
    }
    _pinOk(buf) { const c = this._cfg; return c.pinH && c.pinS ? pinHash(c.pinS, buf) === c.pinH : buf === this._pin(); }
    _pinLs() { try { return JSON.parse(localStorage.getItem(`kppin:${this._config.storage}`) || '{}') || {}; } catch (e) { return this._pinMem || {}; } }
    _pinLsSet(v) { this._pinMem = v; try { localStorage.setItem(`kppin:${this._config.storage}`, JSON.stringify(v)); } catch (e) { /* nur im Speicher */ } }
    _pinWait() { const w = Number(this._pinLs().until) || 0; return w > Date.now() ? Math.ceil((w - Date.now()) / 60000) : 0; }
    _locked() { return !!this._pin() && Date.now() > this._until; }
    _lockHtml() {
      const n = this._pin().length;
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
      const wait = this._pinWait(), f = Number(this._pinLs().f) || 0;
      return `<div class="card"><div class="lock">
        <div class="le">🔒</div><div class="lt">${T('Eltern-Bereich')}</div><div class="hint">${wait ? T('⛔ Zu viele falsche Versuche – bitte in {n} Min. nochmal.', { n: wait }) : f ? T('Falsche PIN – noch {n} Versuche.', { n: Math.max(0, 5 - f) }) : T('Bitte PIN eingeben')}</div>
        <div class="dots" id="dots">${Array.from({ length: n }, (_, i) => `<i class="${i < this._pinBuf.length ? 'f' : ''}"></i>`).join('')}</div>
        <div class="pad">${keys.map((k) => (k ? `<button class="pk" data-a="pk" data-k="${k}">${k}</button>` : '<span></span>')).join('')}</div>
      </div></div>`;
    }
    _pinKey(k) {
      const pin = this._pin();
      if (this._pinWait()) { this._pinBuf = ''; this._render(); return; }
      if (k === '⌫') this._pinBuf = this._pinBuf.slice(0, -1);
      else if (this._pinBuf.length < pin.length) this._pinBuf += k;
      if (this._pinBuf.length === pin.length) {
        if (this._pinOk(this._pinBuf)) {
          this._pinBuf = '';
          this._pinLsSet({});
          this._touch();
          this._render();
          return;
        }
        const ls = this._pinLs(), f = (Number(ls.f) || 0) + 1;
        this._pinLsSet(f >= 5 ? { f: 0, until: Date.now() + 5 * 60000 } : { f });
        if (f >= 5) this._audit(T('⛔ PIN 5× falsch eingegeben – Eltern-Bereich 5 Min. gesperrt'));
        this._pinBuf = '';
        this._render();
        const d = this.shadowRoot.getElementById('dots');
        if (d) d.classList.add('err');
        return;
      }
      this._render();
    }
    _touch() {
      const min = Math.max(1, Number(this._config.pin_minutes) || 5);
      this._until = Date.now() + min * 60000;
      this._wasOpen = true;
    }

    // ---------- Daten-Helfer ----------
    get _approval() { return this._cfg.approval !== false; }
    _kids() { return Object.values(this._db.kid).sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.name).localeCompare(String(b.name))); }
    _rewards(kidId) { return Object.values(this._db.reward).filter((r) => !kidId || (this._rwFor(r, kidId) && !this._advR(r))).sort((a, b) => this._cost(a, kidId) - this._cost(b, kidId)); }
    // 🎁 Für welche Kinder gibt es eine Belohnung? Gemeinsame Belohnungen: die beteiligten Kinder; sonst „Für wen?“ (leer = alle)
    _rwKids(r) {
      if (this._shareOn(r)) return this._shareKids(r);
      const all = this._kids().map((k) => k.id), sel = Array.isArray(r && r.kids) ? r.kids.filter((id) => all.includes(id)) : [];
      return sel.length ? sel : all;
    }
    _rwFor(r, kidId) { return this._rwKids(r).includes(kidId); }
    // 🎁 Anzeige-Reihenfolge: nach Sternen (gleicher Preis → alphabetisch) oder A–Z (Einstellung gilt für Eltern- und Kinder-Ansicht)
    _rwSorted(list, kidId) {
      const az = this._cfg.rwSort === 'az', ab = (a, b) => String(a.title || '').localeCompare(String(b.title || ''), undefined, { sensitivity: 'base', numeric: true });
      return [...list].sort((a, b) => (az ? ab(a, b) || this._cost(a, kidId) - this._cost(b, kidId) : this._cost(a, kidId) - this._cost(b, kidId) || ab(a, b)));
    }
    // Gruppen nach Art: für ein Kind · gemeinsam/einladen · Joker
    _rwGroups(list, kidId, mine) {
      const jk = (r) => !!(this._cfg.jokerOn && r.joker), sh = (r) => this._shareOn(r);
      return [[mine ? T('🎁 Für mich') : T('🎁 Für ein Kind'), list.filter((r) => !sh(r) && !jk(r))], [T('👫 Gemeinsam / Einladen'), list.filter(sh)], [T('🃏 Joker'), list.filter(jk)]]
        .map(([t, l]) => [t, this._rwSorted(l, kidId)]).filter(([, l]) => l.length);
    }
    // Preis einer Belohnung für ein Kind: eigener Preis (Zusatzfunktion „Preise je Kind“) oder der Standardpreis
    _cost(r, kidId) {
      if (!r) return 0;
      const own = kidId && this._cfg.costKidOn && r.costs ? Math.round(Number(r.costs[kidId]) || 0) : 0;
      return own > 0 ? own : Math.max(0, Number(r.cost) || 0);
    }
    _age(k, at) {
      if (!k || !k.by) return null;
      const now = at || new Date();
      let a = now.getFullYear() - Number(k.by);
      if (k.bm) {
        const m = now.getMonth() + 1, bm = Number(k.bm), y = now.getFullYear();
        let bd = Number(k.bd) || 1;
        if (bm === 2 && bd === 29 && !(y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0))) bd = 28; // 29.2. → in Nicht-Schaltjahren am 28.2.
        if (m < bm || (m === bm && now.getDate() < bd)) a--;
      }
      return a >= 0 ? a : null;
    }

    // Einschulungsalter: im Land üblich (Standard 6)
    _schoolAge() { return SCHOOL_AGE[this._cfg.hc] || 6; }
    // Schuljahr (1 = erste Klasse) – nur wenn „Eingeschult im …“ beim Kind eingetragen ist
    _grade(k, at) {
      if (!k || !/^\d{4}-\d\d$/.test(k.school || '')) return null;
      const now = at || new Date(), [y, m] = k.school.split('-').map(Number);
      const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
      return months < 0 ? 0 : Math.floor(months / 12) + 1;
    }
    // Alter, mit dem eine Vorlage verglichen wird: bei Schul-Vorlagen auf deutsches Einschulungsalter (6) umgerechnet
    _tplAge(tp, k) {
      const age = this._age(k);
      if (!isSchoolTpl(tp)) return age;
      const g = this._grade(k);
      if (g !== null) return g === 0 ? 5 : 5 + g; // 1. Klasse entspricht 6 Jahren
      return age === null ? null : age + 6 - this._schoolAge();
    }

    // Geburtstag an diesem Datum? (29. Februar wird in anderen Jahren am 28. gefeiert)
    _isBday(k, date) {
      if (!k || !k.bm || !k.bd) return false;
      const [y, m, d] = date.split('-').map(Number);
      let bd = Number(k.bd);
      if (Number(k.bm) === 2 && bd === 29 && !((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)) bd = 28;
      return m === Number(k.bm) && d === bd;
    }

    // ---------- 🏠 Anwesenheit (Umgang / Wechselmodell / Patchwork) ----------
    // Grundzustand (meist da / meist weg) + Regeln im Rhythmus + Ferienregelung + Ausnahmen.
    // Ergebnis je Tag: Zeitabschnitte (Minuten 0–1440), in denen das Kind da ist.
    _holType(p) {
      const len = dayNum(p.to) - dayNum(p.from) + 1, m = Number(p.from.slice(5, 7)), d = Number(p.from.slice(8, 10));
      if (len >= 28) return 'summer';
      if (m === 12 || (m === 1 && d <= 7)) return 'xmas';
      if (m <= 2) return 'winter';
      if (m <= 4) return 'easter';
      if (m <= 6) return 'pent';
      if (m <= 9) return 'summer';
      return 'autumn';
    }
    // ältere Einstellung (ein Rhythmus) in Regeln umwandeln
    _presCfg(pr) {
      if (!pr || !pr.on) return null;
      if (Array.isArray(pr.rules)) return pr;
      return { ...pr, base: 'out', rules: pr.start ? [{ st: 'in', every: pr.every || 2, start: pr.start, fT: pr.aT || '', toDay: pr.lDay !== undefined ? pr.lDay : 3, tT: pr.lT || '' }] : [] };
    }
    _presRuleSegs(pr, date) {
      const mins = (x) => { if (!x) return null; const [h, m] = String(x).split(':').map(Number); return h * 60 + m; };
      let segs = pr.base === 'out' ? [] : [[0, 1440]];
      const D = dayNum(date);
      (pr.rules || []).forEach((r) => {
        if (!r.start) return;
        const S = dayNum(r.start), cyc = Math.max(1, Number(r.every) || 1) * 7;
        const sw = new Date(`${r.start}T12:00:00`).getDay(), f = mins(r.fT) || 0, tEnd = mins(r.tT);
        let len = ((Number(r.toDay) - sw) % 7 + 7) % 7;
        if (!len && tEnd !== null && tEnd <= f) len = 7;
        const e = len * 1440 + (tEnd === null ? 1440 : tEnd);
        for (let k = 0; k <= Math.min(7, len); k++) {
          const c = D - k;
          if (c < S || (c - S) % cyc) continue;
          const b0 = (c - D) * 1440;
          const from = Math.max(0, b0 + f), to = Math.min(1440, b0 + e);
          if (to <= from) continue;
          segs = r.st === 'out' ? segSub(segs, from, to) : segAdd(segs, from, to);
        }
      });
      return segs;
    }
    _presHolDay(pr, date) {
      const m = this._cfg.hc && this._holData();
      const p = m && m.sh.find((x) => date >= x.from && date <= x.to);
      if (!p) return null;
      const rule = (pr.hol || {})[this._holType(p)] || {}, r = rule.m || '';
      if (!r) return null;
      const len = dayNum(p.to) - dayNum(p.from) + 1, i = dayNum(date) - dayNum(p.from), w = Math.max(1, Number(rule.w) || 1) * 7;
      let mine = r === 'me' ? true : r === 'other' ? false : r === 'first' ? i < Math.ceil(len / 2) : r === 'second' ? i >= Math.ceil(len / 2) : r === 'firstW' ? i < w : i >= len - w;
      if (pr.swap && Number(p.from.slice(0, 4)) % 2 === 1) mine = !mine;
      return { mine };
    }
    _presSegs(pr, date) {
      const mins = (x) => { if (!x || !/^\d\d?:\d\d$/.test(String(x))) return null; const [h, m] = String(x).split(':').map(Number); return h * 60 + m; };
      const ex = (pr.ex || []).find((x) => x.from && x.to && date >= x.from && date <= x.to);
      if (ex) {
        // 📌 Ausnahme mit Uhrzeit: „ab“ gilt am ersten Tag, „bis“ am letzten – davor bzw. danach gilt, was sonst gelten würde
        const f = date === ex.from ? mins(ex.fT) : null, t = date === ex.to ? mins(ex.tT) : null;
        const a = f === null ? 0 : f, e = t === null ? 1440 : t;
        if ((f === null && t === null) || e <= a) return ex.st === 'out' ? [] : [[0, 1440]];
        const base = this._presSegsBase(pr, date);
        return ex.st === 'out' ? segSub(base, a, e) : segAdd(base, a, e);
      }
      return this._presSegsBase(pr, date);
    }

    // Anwesenheit ohne Ausnahmen: Regeln + Ferienregelung (inkl. Ankunft/Abreise bei Ferienwechsel)
    _presSegsBase(pr, date) {
      const mins = (x) => { if (!x) return null; const [h, m] = String(x).split(':').map(Number); return h * 60 + m; };
      const plain = (d) => { const h = this._presHolDay(pr, d); return h ? (h.mine ? [[0, 1440]] : []) : this._presRuleSegs(pr, d); };
      const h = this._presHolDay(pr, date);
      const hA = mins(pr.hA), hL = mins(pr.hL);
      if (h) {
        if (!h.mine) return [];
        let segs = [[0, 1440]];
        const prev = plain(keyAdd(date, -1)), next = plain(keyAdd(date, 1));
        if (hA !== null && !(prev.length && prev[prev.length - 1][1] === 1440)) segs = [[hA, 1440]];
        if (hL !== null && !(next.length && next[0][0] === 0)) segs = segSub(segs, hL, 1440);
        return segs;
      }
      let segs = this._presRuleSegs(pr, date);
      // Übergang zu/aus Ferien beim anderen Elternteil
      const hp = this._presHolDay(pr, keyAdd(date, -1)), hn = this._presHolDay(pr, keyAdd(date, 1));
      if (hp && !hp.mine && hA !== null) segs = segSub(segs, 0, hA);
      if (hn && !hn.mine && hL !== null) segs = segSub(segs, hL, 1440);
      return segs;
    }
    // { s: 'in' | 'out' | 'arr' | 'lv' | 'part', at, segs }
    // Zwischenspeicher: gilt nur für den aktuellen Datenstand (jede Änderung erhöht _dbv)
    _memo(name, key, fn) {
      const v = this._dbv || 0;
      if (!this._mc || this._mc.v !== v) this._mc = { v, m: new Map() };
      const k = `${name}|${key}`;
      if (this._mc.m.has(k)) return this._mc.m.get(k);
      const r = fn();
      if (this._mc.m.size > 20000) this._mc.m.clear();
      this._mc.m.set(k, r);
      return r;
    }
    _pres(kidId, date, prIn) {
      if (!prIn) return this._memo('pres', `${kidId}|${date}`, () => this._presCalc(kidId, date));
      return this._presCalc(kidId, date, prIn);
    }
    _presCalc(kidId, date, prIn) {
      const k = this._db.kid[kidId], pr = prIn || this._presCfg(k && k.pres);
      if (!pr) return { s: 'in', segs: [[0, 1440]] };
      const segs = this._presSegs(pr, date);
      if (!segs.length) return { s: 'out', segs };
      if (segs.length === 1 && segs[0][0] === 0 && segs[0][1] === 1440) return { s: 'in', segs };
      if (segs.length === 1 && segs[0][1] === 1440) return { s: 'arr', at: hm(segs[0][0]), segs };
      if (segs.length === 1 && segs[0][0] === 0) return { s: 'lv', at: hm(segs[0][1]), segs };
      return { s: 'part', segs };
    }
    _presNext(kidId, date) {
      for (let i = 1; i <= 120; i++) { const d = keyAdd(date, i), r = this._pres(kidId, d); if (r.s !== 'out') return { d, at: r.segs[0][0] ? hm(r.segs[0][0]) : '' }; }
      return null;
    }
    // Aufgabe nur, wenn ihr Zeitfenster in die Anwesenheit fällt
    _presTaskOk(t, kidId, date) {
      const r = this._pres(kidId, date);
      if (r.s === 'in') return true;
      if (r.s === 'out') return false;
      if (!t.from && !t.to) return true;
      const mins = (x, d) => { if (!x) return d; const [h, m] = String(x).split(':').map(Number); return h * 60 + m; };
      const a = mins(t.from, 0), b = mins(t.to, 1440);
      return r.segs.some(([x, y]) => a < y && b > x);
    }
    _presPreview(kidId, weeks, prIn) {
      const out = [], today = dk(new Date());
      let cur = null;
      const fmt = (key, m) => `${DAYS[new Date(`${key}T12:00:00`).getDay()]} ${shortDate(key)}${m && m !== 1440 ? ` ${hm(m)}` : ''}`;
      for (let i = 0; i < weeks * 7; i++) {
        const d = keyAdd(today, i), r = this._pres(kidId, d, prIn);
        r.segs.forEach(([a, b]) => {
          if (cur && cur.toKey === keyAdd(d, -1) && cur.toM === 1440 && a === 0) { cur.toKey = d; cur.toM = b; return; }
          if (cur && cur.toKey === d && cur.toM === a) { cur.toM = b; return; }
          if (cur) out.push(cur);
          cur = { fromKey: d, fromM: a, toKey: d, toM: b };
        });
      }
      if (cur) out.push(cur);
      return out.map((x) => `${fmt(x.fromKey, x.fromM)} – ${fmt(x.toKey, x.toM)}${this._schoolHol(x.fromKey) || this._schoolHol(x.toKey) ? ' 🏖️' : ''}`);
    }

    // Kind hat frei: Urlaub, nicht da (🏠) oder (wenn eingestellt) Geburtstag
    _isOff(date, kidId) {
      if (this._onVacation(date, kidId)) return true;
      if (kidId && this._pres(kidId, date).s === 'out') return true;
      const c = this._cfg;
      if (c.hc && c.holFree !== false && this._pubHol(date)) return true;
      if (c.hc && c.ferFree && this._schoolHol(date)) return true;
      return !!(kidId && c.bdOn && c.bdFree && this._isBday(this._db.kid[kidId], date));
    }

    // Punktefaktor für ein Kind an einem Tag: Doppelte-Punkte-Tag × Geburtstags-Faktor
    _mult(date, kidId) {
      const c = this._cfg;
      let f = this._isDbl(date) ? 2 : 1;
      if (c.bdOn && kidId && this._isBday(this._db.kid[kidId], date)) f *= Math.max(1, Number(c.bdMult) || 1);
      return f;
    }

    // ---------- Ferien & Feiertage (Bundesland) ----------
    _holData() {
      const c = this._cfg, h = c.hol;
      if (!c.hc || !h || h.sub !== this._holKey()) return null;
      if (!this._holM || this._holM.ts !== h.ts) {
        const ph = {};
        (h.ph || []).forEach((x) => { if (x && x.d) ph[x.d] = x.n || T('Feiertag'); });
        this._holM = { ts: h.ts, ph, sh: (h.sh || []).filter((x) => x && x.from && x.to) };
      }
      return this._holM;
    }

    _pubHol(date) { const m = this._holData(); return (m && m.ph[date]) || ''; }
    _schoolHol(date) { const m = this._holData(); const r = m && m.sh.find((x) => date >= x.from && date <= x.to); return r ? r.n || T('Ferien') : ''; }

    // Schultag = Mo–Fr, keine Ferien, kein Feiertag
    _isSchoolDay(d, sat) { const key = dk(d); return d.getDay() !== 0 && (d.getDay() !== 6 || !!sat) && !this._schoolHol(key) && !this._pubHol(key); }
    // 🎒 Samstagsschule (beim Kind): regulär zählen nur Montag bis Freitag als Schultage
    _satKid(id) { return !!(this._db.kid[id] && this._db.kid[id].sat); }
    _satAny(t) { return (t.kids || []).some((id) => this._satKid(id)); }
    _schoolDate(t, d) { return this._schoolPrev(t) ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) : d; }
    // Schul-Aufgabe mit den Standard-Tagen (Mo–Fr bzw. „am Abend vorher“ So–Do): dann entscheiden die Schultage, nicht die Wochentage
    _schoolStd(t) { if (!t.school || t.sched !== 'week') return false; const d = [...(t.days || [])].sort().join(); return d === (this._schoolPrev(t) ? '0,1,2,3,4' : '1,2,3,4,5'); }

    // Weg 1: OpenHolidays (offene Daten, kein Schlüssel nötig). Region gilt inkl. übergeordneter Ebenen
    // (z. B. Bas-Rhin ⊂ Grand Est: Ferien der Region + Feiertage nur fürs Département)
    async _holGet(u) {
      const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 12000);
      try { const r = await fetch(u, { headers: { accept: 'application/json' }, signal: ctl.signal }); if (!r.ok) throw new Error(`HTTP ${r.status}`); return await r.json(); }
      finally { clearTimeout(tm); }
    }

    _holName(x) {
      const L = String(this._lang || 'de').slice(0, 2).toUpperCase(), ns = x.name || [];
      return (ns.find((n) => String(n.language || '').toUpperCase() === L) || ns[0] || {}).text || '';
    }

    async _holApi(hc, hr) {
      const y = new Date().getFullYear(), from = `${y}-01-01`, to = `${y + 1}-12-31`;
      const base = 'https://openholidaysapi.org', L = String(this._lang || 'de').slice(0, 2).toUpperCase();
      const [pub, sch] = await Promise.all([
        this._holGet(`${base}/PublicHolidays?countryIsoCode=${hc}&languageIsoCode=${L}&validFrom=${from}&validTo=${to}`),
        this._holGet(`${base}/SchoolHolidays?countryIsoCode=${hc}&languageIsoCode=${L}&validFrom=${from}&validTo=${to}`),
      ]);
      if (!Array.isArray(pub) || !Array.isArray(sch)) throw new Error('unerwartete Antwort');
      const forR = (x) => x.nationwide || !(x.subdivisions || []).length || (!!hr && (x.subdivisions || []).some((sd) => hr === sd.code || hr.startsWith(`${sd.code}-`)));
      const ph = [];
      pub.filter(forR).forEach((x) => { this._daysOf(x.startDate, x.endDate).forEach((d) => ph.push({ d, n: this._holName(x) })); });
      const sh = sch.filter(forR).map((x) => ({ from: String(x.startDate).slice(0, 10), to: String(x.endDate).slice(0, 10), n: this._holName(x) }));
      return { ph, sh };
    }


    _daysOf(a, b) {
      const out = [], s0 = String(a).slice(0, 10), e0 = String(b || a).slice(0, 10);
      const [y, m, d] = s0.split('-').map(Number);
      for (let i = 0; i < 400; i++) { const k = dk(new Date(y, m - 1, d + i)); if (k > e0) break; out.push(k); }
      return out;
    }

    // Weg 2: Kalender in Home Assistant (Integration „Holiday“ für Feiertage, Ferien-Kalender z. B. per iCal/HACS)
    _holCals() {
      const c = this._cfg, st = this._hass.states, ents = this._hass.entities || {};
      const cals = Object.keys(st).filter((e) => e.startsWith('calendar.'));
      const txt = (e) => `${e} ${this._ename(e)}`;
      const fe = (c.holCal && st[c.holCal] ? c.holCal : '') || cals.find((e) => (ents[e] || {}).platform === 'holiday') || cals.find((e) => /feiertag|holiday/i.test(txt(e))) || '';
      const sc = (c.ferCal && st[c.ferCal] ? c.ferCal : '') || cals.find((e) => /ferien|school/i.test(txt(e)) && e !== fe) || '';
      return { fe, sc };
    }

    async _holHa() {
      const { fe, sc } = this._holCals();
      if (!fe && !sc) throw new Error('kein Feiertags- oder Ferien-Kalender in Home Assistant');
      const y = new Date().getFullYear();
      const a = new Date(y, 0, 1).toISOString(), b = new Date(y + 1, 11, 31, 23, 59).toISOString();
      const load = async (e) => (e ? (await this._hass.callApi('GET', `calendars/${e}?start=${encodeURIComponent(a)}&end=${encodeURIComponent(b)}`)) || [] : []);
      const [fl, sl] = await Promise.all([load(fe), load(sc)]);
      const day = (v) => (v && v.date ? v.date : v && v.dateTime ? dk(new Date(v.dateTime)) : '');
      const last = (ev) => { const s0 = day(ev.start), e0 = day(ev.end); if (!e0 || e0 <= s0) return s0; const [yy, mm, dd] = e0.split('-').map(Number); const mid = ev.end && ev.end.dateTime && (() => { const t = new Date(ev.end.dateTime); return !t.getHours() && !t.getMinutes(); })(); return (ev.end && ev.end.date) || mid ? dk(new Date(yy, mm - 1, dd - 1)) : e0; }; // Ende ist exklusiv (Ganztags-Datum oder 00:00 Uhr)
      const ph = [];
      fl.forEach((ev) => { const s0 = day(ev.start); if (s0) this._daysOf(s0, last(ev)).forEach((d) => ph.push({ d, n: String(ev.summary || T('Feiertag')) })); });
      const sh = sl.map((ev) => ({ from: day(ev.start), to: last(ev), n: String(ev.summary || T('Ferien')) })).filter((x) => x.from);
      return { ph, sh, fe, sc };
    }

    // Selbstständig aktuell halten: alle 14 Tage (bei Ausweichlösung/Fehler alle 6 Stunden) neu laden
    async _holCheck(force) {
      const c = this._cfg, bl = this._holKey();
      if (!bl || !this._hass || this._holBusy) return;
      const h = c.hol || {}, now = Date.now();
      const due = force || h.sub !== bl || !h.ts || now - h.ts > (h.src === 'api' ? 14 * 86400000 : 6 * 3600000) || String(h.at || '').slice(0, 4) !== String(new Date().getFullYear());
      if (!due) return;
      if (!force && this._holTry && now - this._holTry < 600000) return;
      this._holTry = now;
      this._holBusy = true;
      let data = null, src = 'api', err = '';
      try {
        try { data = await this._holApi(c.hc, c.hr || ''); }
        catch (e1) {
          err = `Internet: ${e1.message || e1}`;
          try { data = await this._holHa(); src = 'ha'; }
          catch (e2) { err += ` · Home Assistant: ${e2.message || e2}`; }
        }
        const today = dk(new Date());
        if (data) this._setCfg({ hol: { sub: bl, ts: now, at: today, src, ph: data.ph, sh: data.sh, err: src === 'ha' ? err : '' } });
        else this._setCfg({ hol: { ...(h.sub === bl ? h : { ph: [], sh: [] }), sub: bl, ts: now, at: today, src: h.sub === bl && h.src && h.src !== 'none' ? h.src : 'none', err } });
      } finally { this._holBusy = false; this._render(); }
    }

    _isDbl(date) {
      const c = this._cfg;
      if (!c.dblOn) return false;
      const [y, m, d] = date.split('-').map(Number);
      return (c.dblDays || [6]).includes(new Date(y, m - 1, d).getDay());
    }

    // Geburtstags-Bonus und Erinnerung am Vortag
    _bdayCheck(kids) {
      const c = this._cfg;
      if (!c.bdOn) return;
      const now = new Date(), today = dk(now);
      kids.forEach((k) => {
        if (this._isBday(k, today) && !this._mark(today, `bd:${k.id}`) && this._once(`bd:${today}:${k.id}`)) {
          this._setMark(today, `bd:${k.id}`, '1');
          const age = this._age(k);
          const n = c.bdAge && age ? age : Math.max(0, Number(c.bdPts === undefined ? 10 : c.bdPts) || 0);
          if (n) this._addPoints(k.id, n, `🎂 Geburtstags-Bonus${age ? ` (${age} Jahre)` : ''}`);
        }
        if (c.bdRemind && hhmm(now) >= '08:00') {
          const tm = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          if (this._isBday(k, dk(tm)) && !this._mark(today, `bdr:${k.id}`)) {
            this._setMark(today, `bdr:${k.id}`, '1');
            const age = this._age(k, tm);
            this._notify(age ? T('🎂 Morgen hat {name} Geburtstag und wird {age}!', { name: k.name, age }) : T('🎂 Morgen hat {name} Geburtstag!', { name: k.name }), 'bday');
          }
        }
      });
    }

    // Seitenweit nur einmal (mehrere Yippee!-Karten derselben Liste auf einem Dashboard buchen sonst doppelt)
    _once(k) {
      const w = window.__kpOnce = window.__kpOnce || new Set(), key = `${this._config.storage}|${k}`;
      if (w.has(key)) return false;
      w.add(key); return true;
    }

    _kidByName(n) { const x = String(n || '').trim().toLowerCase(); return this._kids().find((k) => String(k.name).trim().toLowerCase() === x); }

    // Urlaub: ohne Kind-Angabe = gilt für alle Kinder; mit kids = nur für diese (Zeitraum ohne kidId: gilt für alle)
    _onVacation(date, kidId) {
      const v = (this._db.cfg.main && this._db.cfg.main.vac) || [];
      return v.some((x) => x.from && x.to && date >= x.from && date <= x.to && (!(x.kids || []).length || (kidId ? x.kids.includes(kidId) : this._kids().every((k) => x.kids.includes(k.id)))));
    }

    // Aufgaben im Wechsel: wer ist an Tag d dran? (null = alle zugewiesenen Kinder)
    _rotKid(t, d) {
      const kids = (t.kids || []).filter((id) => this._db.kid[id]);
      if (!t.rotate || kids.length < 2) return null;
      const key = dk(d);
      let c;
      if (t.sched === 'dates' || t.sched === 'cal') c = (t.sched === 'cal' ? this._calDates(t).filter((x) => !t.created || x >= t.created) : (t.dates || [])).filter((x) => x < key).length;
      else {
        const s0 = String(t.created || '2025-01-06').split('-').map(Number), e0 = key.split('-').map(Number);
        const a = Date.UTC(s0[0], s0[1] - 1, s0[2]), b = Date.UTC(e0[0], e0[1] - 1, e0[2]);
        const diff = Math.max(0, Math.round((b - a) / 86400000));
        const days = (t.days || []).length ? t.days : [0, 1, 2, 3, 4, 5, 6];
        const wd0 = new Date(a).getUTCDay();
        c = Math.floor(diff / 7) * days.length;
        for (let i = 0; i < diff % 7; i++) if (days.includes((wd0 + i) % 7)) c++;
      }
      // Kind im Urlaub? Dann übernimmt das nächste Kind der Reihe
      for (let i = 0; i < kids.length; i++) { const kk = kids[(c + i) % kids.length]; if (!this._isOff(key, kk) && this._presTaskOk(t, kk, key)) return kk; }
      return kids[c % kids.length];
    }

    // Saison (z. B. Rasenmähen April–Oktober), auch über den Jahreswechsel (z. B. Dez–Mär)
    _inSeason(t, d) {
      const a = Number(t.sFrom), b = Number(t.sTo);
      if (!a || !b) return true;
      const m = d.getMonth() + 1;
      return a <= b ? m >= a && m <= b : m >= a || m <= b;
    }

    _isFor(t, kidId, d) {
      if (!(t.kids || []).includes(kidId) || !this._isOn(t, d) || this._isOff(dk(d), kidId) || !this._presTaskOk(t, kidId, dk(d))) return false;
      if (t.school && this._schoolDate(t, d).getDay() === 6 && !this._satKid(kidId)) return false; // Samstag nur für Kinder mit Samstagsschule
      if (t.noschool && d.getDay() === 6 && this._satKid(kidId) && this._isSchoolDay(d, true)) return false; // Kind mit Samstagsschule: samstags keine „Nur an schulfreien Tagen“-Aufgaben
      const r = this._rotKid(t, d);
      return !r || r === kidId;
    }

    // „Am Abend vorher“: zählt, ob MORGEN Schule ist (ältere Aufgaben: an der Vorlage erkannt)
    _schoolPrev(t) {
      if (t.schoolPrev !== undefined) return !!t.schoolPrev;
      const ti = String(t.title || '').toLowerCase();
      return PREV_TPL.some((x) => ti === x.toLowerCase() || ti === T(x).toLowerCase());
    }

    _isOn(t, d) {
      if (t.sched === 'once') return false;
      if (this._routMap()[t.virtual ? t.parent : t.id]) return false; // steckt in einer Routine
      if (Array.isArray(t.slots) && t.slots.length > 1 && !t.virtual) return false;
      if (!this._inSeason(t, d)) return false;
      if (t.noschool && this._isSchoolDay(d)) return false;
      if (t.school) {
        const sd = this._schoolDate(t, d), sat = this._satAny(t);
        if (this._cfg.hc && !this._isSchoolDay(sd, sat)) return false;
        if (this._schoolStd(t)) return sd.getDay() !== 0 && (sd.getDay() !== 6 || sat);
      }
      if (t.sched === 'dates') return (t.dates || []).includes(dk(d));
      if (t.sched === 'cal') return this._calDates(t).includes(dk(d));
      return !(t.days || []).length || t.days.includes(d.getDay());
    }

    // Einmalige Sonderaufgabe: wer ist dran bzw. hat sie erledigt?
    _onceState(t) {
      if (t.done && t.done.kid) return { kid: t.done.kid, st: 'd', date: t.done.d };
      for (const date of Object.keys(this._db.log).sort().reverse()) {
        const s = this._db.log[date].s || {};
        for (const key of Object.keys(s)) {
          const [tid, kid] = key.split(':');
          if (tid === t.id && s[key] === 'p') return { kid, st: 'p', date };
        }
      }
      return null;
    }

    // Status einer Aufgabe für ein Kind (bei Sonderaufgaben unabhängig vom Datum)
    _status(t, kidId) {
      const today = dk(new Date());
      if (t.sched !== 'once') {
        const s = this._st(today, t.id, kidId);
        if (!s && (this._isExtra(t) || this._isShared(t))) {
          const by = (t.kids || []).find((id) => id !== kidId && ['p', 'd'].includes(this._st(today, t.id, id)));
          if (by) return { s: 'taken', date: today, by, bySt: this._st(today, t.id, by) };
        }
        return { s, date: today };
      }
      const o = this._onceState(t);
      if (!o) return { s: '', date: today };
      if (o.kid === kidId) return { s: o.st, date: o.date };
      return { s: 'taken', date: o.date, by: o.kid, bySt: o.st };
    }

    // ---------- Serien ----------
    get _streakCfg() {
      const c = this._cfg;
      return { on: c.streakOn !== false, days: Math.max(2, Number(c.streakDays) || 7), bonus: c.streakBonus === undefined ? 5 : Math.max(0, Number(c.streakBonus) || 0) };
    }

    _streak(t, kidId, endDate) {
      if (t.sched === 'once') return 0;
      return this._memo('streak', `${t.id}|${kidId}|${endDate}|${this._cfg.hc || ''}`, () => this._streakCalc(t, kidId, endDate));
    }
    _streakCalc(t, kidId, endDate) {
      const [y, m, dd] = endDate.split('-').map(Number);
      let n = 0;
      for (let i = 0; i < 90; i++) {
        const d = new Date(y, m - 1, dd - i);
        if (!this._isFor(t, kidId, d)) continue;
        const s = this._st(dk(d), t.id, kidId);
        if (s === 'd') n++;
        else if (s === 'e' || s === 'p') continue; // entschuldigt / wartet noch auf Freigabe: Serie läuft weiter
        else break;
      }
      return n;
    }

    _curStreak(t, kidId) {
      // 🦷 Zahnputz-Aufgaben: nur eine Serie – die Zahnputz-Serie (keine zweite Aufgaben-Serie)
      if (this._zLinked(t)) return this._zStreak(kidId);
      const today = dk(new Date());
      if (this._st(today, t.id, kidId) === 'd') return this._streak(t, kidId, today);
      const y = new Date(); y.setDate(y.getDate() - 1);
      return this._streak(t, kidId, dk(y));
    }

    _streakBonus(date, t, kidId) {
      const sc = this._streakCfg;
      if (!sc.on || !sc.bonus || t.sched === 'once') return;
      if (this._zLinked(t)) return; // 🦷 Zahnputz-Aufgaben bekommen nur den Bonus der Zahnputz-Serie (kein doppelter Serien-Bonus)
      const n = this._streak(t, kidId, date);
      if (n < sc.days || n % sc.days !== 0) return;
      const bk = `b:${t.id}:${kidId}`;
      if (this._mark(date, bk)) return;
      this._setMark(date, bk, String(sc.bonus));
      this._addPoints(kidId, sc.bonus, `🔥 ${n}-Tage-Serie: ${t.title}`);
      const k = this._db.kid[kidId];
      setTimeout(() => this._celebrate('🔥', T('{n} Tage in Folge!', { n }), `${k ? k.name + ': ' : ''}${T('{title} · +{bonus} Bonus-⭐', { title: t.title, bonus: sc.bonus })}`), 700);
    }

    _isToday(t) { return this._isOn(t, new Date()); }

    // ---------- Müllkalender ----------
    // Termine eines HA-Kalenders (30 Tage zurück bis 120 Tage voraus), alle 3 Stunden neu geladen
    _calEvents(ent) {
      if (!ent || !this._hass || !this._hass.states[ent]) return null;
      this._calc = this._calc || {};
      const c = this._calc[ent];
      const fresh = c && Date.now() - c.t < (c.err ? 600000 : 3 * 3600000) && c.day === dk(new Date());
      if (!fresh && !(c && c.busy)) {
        this._calc[ent] = { ...(c || {}), busy: true, t: (c && c.t) || 0 };
        const a = new Date(); a.setDate(a.getDate() - 30); a.setHours(0, 0, 0, 0);
        // für „im Wechsel“ ab Anlegedatum der ältesten Kalender-Aufgabe laden (max. 400 Tage zurück)
        const old = Object.values(this._db.task).filter((t) => t.sched === 'cal' && t.created).map((t) => t.created).sort()[0];
        if (old) { const [y, m, d] = old.split('-').map(Number), o = new Date(y, m - 1, d), lim = new Date(); lim.setDate(lim.getDate() - 400); if (o < a) a.setTime(Math.max(o.getTime(), lim.getTime())); }
        const b = new Date(); b.setDate(b.getDate() + 120);
        this._hass.callApi('GET', `calendars/${ent}?start=${encodeURIComponent(a.toISOString())}&end=${encodeURIComponent(b.toISOString())}`)
          .then((list) => {
            const ev = {}, it = [];
            (list || []).forEach((x) => {
              const st = x.start || {};
              const d = st.date ? st.date : st.dateTime ? dk(new Date(st.dateTime)) : '';
              const tm = st.dateTime ? String(st.dateTime).slice(11, 16) : '';
              if (d) { (ev[d] = ev[d] || []).push(String(x.summary || '').trim()); it.push({ d, s: String(x.summary || '').trim().slice(0, 120), uid: String(x.uid || ''), rid: String(x.recurrence_id || ''), tm: /^\d\d:\d\d$/.test(tm) ? tm : '' }); }
            });
            this._calc[ent] = { ev, it, t: Date.now(), day: dk(new Date()), v: ((c && c.v) || 0) + 1 };
            this._calMemo = {}; this._dbv = (this._dbv || 0) + 1;
            if ((this._cfg.calLinks || []).some((L) => L && L.ent === ent)) this._expandTasks(this._db);
            this._render();
            this._calPrevUpd();
            this._schedulePenalty();
          })
          .catch((err) => { console.warn('Yippee! - Kids Chores Kalender', ent, err); this._calc[ent] = { ...(c || {}), ev: (c && c.ev) || null, t: Date.now(), day: dk(new Date()), err: true }; });
      }
      return (c && c.ev) || null;
    }



    _editCalLink(...a) { return this._admCall('_editCalLink', a, false); }

    _calPrevUpd() {
      const cp = this.shadowRoot.querySelector('#modal .calprev'), sel = this.shadowRoot.querySelector('#modal [name=cal]');
      if (cp && sel) cp.innerHTML = this._calPreview(sel.value);
    }

    _calKw(t) { return String(t.calKw || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean); }

    _calMatch(t, list) { const kw = this._calKw(t); return (list || []).filter((x) => !kw.length || kw.some((k) => x.toLowerCase().includes(k))); }

    // Termine der Aufgabe (bei „am Vorabend“ einen Tag früher)
    _calDates(t) {
      if (!this._cfg.muellOn && !this._cfg.calOn) return [];
      const ent = (t.cal && t.cal !== '_sensors' ? t.cal : '') || this._cfg.muellCal;
      const ev = this._calEvents(ent);
      if (!ev) return [];
      const v = (this._calc[ent] || {}).v || 0, key = `${ent}|${t.calKw || ''}|${t.calPrev ? 1 : 0}|${v}`;
      this._calMemo = this._calMemo || {};
      if (this._calMemo[key]) return this._calMemo[key];
      const out = [];
      Object.keys(ev).forEach((d) => {
        if (!this._calMatch(t, ev[d]).length) return;
        if (!t.calPrev) { out.push(d); return; }
        const [y, m, dd] = d.split('-').map(Number);
        out.push(dk(new Date(y, m - 1, dd - 1)));
      });
      return (this._calMemo[key] = [...new Set(out)].sort());
    }

    // Was wird abgeholt? (z. B. „Gelber Sack“) – für Kachel und Ansage
    _calLabel(t, date) {
      if (t.sched !== 'cal' || (!this._cfg.muellOn && !this._cfg.calOn)) return '';
      const ev = this._calEvents((t.cal && t.cal !== '_sensors' ? t.cal : '') || this._cfg.muellCal);
      if (!ev) return '';
      let d = date;
      if (t.calPrev) { const [y, m, dd] = date.split('-').map(Number); d = dk(new Date(y, m - 1, dd + 1)); }
      return [...new Set(this._calMatch(t, ev[d]))].join(', ');
    }

    // Zusatzaufgabe (freiwillig, wer zuerst kommt) – zählt nicht zum Pflichtprogramm
    // „Einer reicht“: Pflicht für alle ausgewählten Kinder, erledigt sobald eines sie macht
    _isShared(t) { return !!(t && t.shared && t.sched !== 'once' && !this._isExtra(t) && (t.kids || []).length > 1); }
    _takenBy(t, date, kidId) { return (t.kids || []).find((id) => id !== kidId && ['p', 'd'].includes(this._st(date, t.id, id))) || ''; }

    _isExtra(t) { return !!(t && t.extra && this._cfg.extraOn && t.sched !== 'once'); }
    _req(t) { return !this._isExtra(t); }

    // Verpasste Aufgaben mit Minuspunkten werden nur markiert ('m') – abgezogen wird erst, wenn die Eltern bestätigen.
    // Kinder-Karte prüft nur ihr eigenes Kind, Eltern-Karte alle.
    _penaltyCheck() {
      if (!this._loaded || !this._hass) return;
      try { this._dataCheck(); this._abCheck(); this._planCheck(); this._updCheck(); } catch (e) { console.warn('Yippee', e); }
      this._weeklyCheck();
      this._dailyCheck();
      try { this._repCheck(); } catch (e) { console.warn('Yippee', e); }
      this._morningCheck();
      this._reminderCheck();
      const kids = this._config.mode === 'kid' ? [this._kidByName(this._config.child)].filter(Boolean) : this._kids();
      if (!kids.length) return;
      this._bdayCheck(kids);
      try { this._bonusCheck(kids); } catch (e) { console.warn('Yippee', e); }
      this._holCheck();
      const now = new Date(), today = dk(now), time = hhmm(now);
      let changed = false;
      for (let back = 3; back >= 0; back--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
        const date = dk(d);
        for (const t of Object.values(this._db.task)) {
          const pen = Number(t.penalty) || 0;
          if (!pen || this._isExtra(t) || !t.penaltySince || date <= t.penaltySince || !this._isOn(t, d)) continue;
          if (date === today && !(this._winTo(t, d) && time > this._winTo(t, d))) continue;
          for (const k of kids) {
            if (!this._isFor(t, k.id, d) || this._st(date, t.id, k.id) || (k.since && date < k.since)) continue;
            if (this._isShared(t) && this._takenBy(t, date, k.id)) continue;
            this._setSt(date, t.id, k.id, 'm');
            changed = true;
            if (!this._once(`m:${date}:${t.id}:${k.id}`)) continue; // zweite Karte auf derselben Seite: nicht doppelt melden
            if (t.to && addMin(t.to, 1) && this._bgActive() && date >= (this._cfg.bgSince || today)) continue; // meldet die Hintergrund-Automation
            this._notify(T('⏰ {name} hat „{title}“ verpasst – bitte entscheiden: entschuldigt oder Minuspunkte?', { name: k.name, title: t.title }), 'miss',
              [[T('🙂 Entschuldigt'), `KP|me|${date}|${t.id}|${k.id}`], [`−${pen} ⭐`, `KP|mx|${date}|${t.id}|${k.id}`], [T('✓ Erledigt'), `KP|md|${date}|${t.id}|${k.id}`]]);
            changed = true;
          }
        }
      }
      if (changed) this._render();
    }

    _speak(msg) {
      const c = this._cfg;
      let n = 0;
      const nsv = (this._hass.services && this._hass.services.notify) || {};
      if (c.rNotify && nsv[c.rNotify]) { this._hass.callService('notify', c.rNotify, { message: msg, data: { type: 'tts' } }).catch((e) => console.warn('Yippee! - Kids Chores TTS', e)); n++; }
      if (c.rTts && this._hass.states[c.rTts] && (c.rPlayers || []).length) {
        this._hass.callService('tts', 'speak', { media_player_entity_id: c.rPlayers, message: msg }, { entity_id: c.rTts }).catch((e) => console.warn('Yippee! - Kids Chores TTS', e));
        n++;
      }
      return n;
    }

    _reminderCheck() {
      const c = this._cfg;
      if (!c.rOn || this._bgActive()) return;
      const now = new Date(), today = dk(now), mins = Math.max(1, Number(c.rMin) || 15);
      const kids = this._config.mode === 'kid' ? [this._kidByName(this._config.child)].filter(Boolean) : this._kids();
      for (const k of kids) {
        for (const t of this._todayTasks(k.id)) {
          if (!t.to || t.sched === 'once' || this._isExtra(t) || this._win(t) !== 'open' || this._st(today, t.id, k.id)) continue;
          const [h, m] = this._winTo(t).split(':').map(Number);
          const left = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m) - now) / 60000;
          if (left > mins || left < 0) continue;
          const rk = `r:${t.id}:${k.id}`;
          if (this._mark(today, rk)) continue;
          this._setMark(today, rk, '1');
          this._speak(T('{name}, bitte noch {title} erledigen – nur noch {n} Minuten!', { name: k.name, title: t.title, n: Math.max(1, Math.round(left)) }));
        }
      }
    }

    // Nur Administratoren dürfen die REST-Schnittstellen für Zustände, Automationen und Medien-Upload nutzen.
    // Ohne Admin-Rechte NICHT aufrufen: jede Ablehnung (401) zählt bei Home Assistant als Fehlanmeldung → ip_ban sperrt das Gerät.
    _admin() { return !!(this._hass && this._hass.user && this._hass.user.is_admin); }
    // todo.yippee_kids_chores → „Yippee Kids Chores“ (und umgekehrt wie Home Assistant: „Yippee Bilder“ → todo.yippee_bilder)
    _listName(ent) { return String(ent || '').replace(/^todo\./, '').split('_').filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); }
    _listEnt(name) { return `todo.${String(name || '').toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')}`; }

    // ⚙️ Lokale To-do-Liste über Home Assistant anlegen – nur als Administrator (sonst wird die Schnittstelle nie aufgerufen)
    async _mkList(name) {
      if (!this._admin()) { this._toast(T('Anlegen nicht möglich (nur als Administrator) – bitte von Hand anlegen')); return ''; }
      const nm = String(name || '').trim();
      if (!nm) return '';
      const st = this._hass.states, low = nm.toLowerCase();
      const have = Object.keys(st).find((e) => e.startsWith('todo.') && (e === this._listEnt(nm) || String((st[e].attributes || {}).friendly_name || '').toLowerCase() === low));
      if (have) return have;
      const f = await this._hass.callApi('POST', 'config/config_entries/flow', { handler: 'local_todo', show_advanced_options: false });
      if (f && f.type === 'abort') { if (f.reason === 'already_configured') return this._listEnt(nm); throw new Error(f.reason || 'abort'); }
      const key = (f && f.data_schema && f.data_schema[0] && f.data_schema[0].name) || 'todo_list_name';
      const r = await this._hass.callApi('POST', `config/config_entries/flow/${f.flow_id}`, { [key]: nm });
      if (r && r.type === 'abort' && r.reason === 'already_configured') return this._listEnt(nm);
      if (!r || r.type !== 'create_entry') throw new Error((r && (r.reason || (r.errors && Object.values(r.errors).join(', ')))) || 'Fehler');
      return this._listEnt(nm);
    }

    // Sensoren pro Kind (nur möglich, wenn ein Admin-Benutzer die Karte offen hat)
    _pushSensors() {
      const c = this._cfg;
      if (!this._loaded || c.sensors === false) return;
      const keep = !!c.sensKeep, live = !this._sensorFail && this._admin();
      if (!keep && !live) return;
      this._sensSig = this._sensSig || {};
      const ids = new Set();
      const rate = Number(c.moneyRate) || 10;
      const emit = (sid, id, state, name, attrs) => {
        // 🔁 Dauerhafte Sensoren: Stand in der Yippee-Liste ablegen – die Vorlage in configuration.yaml liest ihn (auch nach einem Neustart, ohne offene Karte)
        if (keep) {
          const a = { ...attrs }; delete a.friendly_name; delete a.icon; delete a.unit_of_measurement;
          const desc = JSON.stringify({ p: state, n: name, a });
          this._sensQ = this._sensQ || {};
          if ((this._sensRaw || {})[sid] !== desc) this._sensQ[sid] = desc; else delete this._sensQ[sid];
          // kurz warten: eine Änderung (Abhaken → Punkte → Abzeichen) wird so zu einem einzigen Schreibvorgang
          if (Object.keys(this._sensQ).length && !this._sensT) this._sensT = setTimeout(() => this._sensFlush(), 4000);
        }
        if (!live) return;
        const ent = this._hass.entities && this._hass.entities[id];
        if (ent && ent.platform === 'template') return; // Sensor kommt schon aus der Vorlage – nicht überschreiben
        const sig = JSON.stringify([state, attrs]);
        if (this._sensSig[id] === sig) return;
        this._sensSig[id] = sig;
        this._hass.callApi('POST', `states/${id}`, { state: String(state), attributes: attrs }).catch(() => { this._sensorFail = true; });
      };
      this._kids().forEach((k) => {
        const tasks = this._todayTasks(k.id).filter((t) => this._req(t) && this._status(t, k.id).s !== 'taken');
        const st = tasks.map((t) => this._status(t, k.id).s);
        const done = st.filter((x) => x === 'd').length;
        const total = k.total !== undefined ? k.total : (k.points || 0);
        const lv = levelOf(total);
        const goal = k.goal && this._db.reward[k.goal];
        const attrs = {
          friendly_name: `Yippee! ${k.name}`, icon: 'mdi:star-circle', unit_of_measurement: 'Punkte',
          heute_erledigt: done, heute_gesamt: tasks.length, heute_netto: this._dayNet(k, dk(new Date())), woche_netto: (() => { const w = this._weekStats(k); return w.plus - w.minus; })(), alles_erledigt: tasks.length > 0 && done === tasks.length,
          offen: tasks.filter((t, i) => !['d', 'p', 'taken', 'e', 'x', 'm'].includes(st[i])).map((t) => t.title),
          wartet_auf_freigabe: st.filter((x) => x === 'p').length,
          level: lv + 1, level_name: LEVELS[lv][1], gesamt_verdient: total, abzeichen: badgesOf(k).length,
          ziel: goal ? goal.title : null, urlaub: this._onVacation(dk(new Date()), k.id), anwesend: this._pres(k.id, dk(new Date())).s !== 'out', feiertag: this._pubHol(dk(new Date())) || null, ferien: this._schoolHol(dk(new Date())) || null,
          ...(c.moneyOn ? { euro: Number(((k.points || 0) / rate).toFixed(2)) } : {}),
        };
        ids.add(k.id);
        emit(k.id, `sensor.yippee_${slug(k.name)}`, k.points || 0, k.name, attrs);
      });
      // 🎯 Familienziel als eigener Sensor (sensor.yippee_familienziel)
      const fam = this._famSens();
      if (fam) { ids.add('fam'); emit('fam', 'sensor.yippee_familienziel', fam.p, fam.n, fam.attrs); }
      // Einträge gelöschter Kinder entfernen
      Object.keys(this._sensRaw || {}).forEach((kid) => {
        if (kid === 'tick' || ids.has(kid) || (kid !== 'fam' && this._db.kid[kid])) return;
        const key = `kp|sens|${kid}`, g = (window.__kpSens = window.__kpSens || {});
        if (g[key] && g[key].d === '-' && Date.now() - g[key].t < 15000) return;
        g[key] = { d: '-', t: Date.now() };
        this._enq(() => this._svc('remove_item', { item: key }).catch(() => { /* schon weg */ }));
      });
    }

    // 🎯 Familienziel für den Sensor: Zustand = gesammelte Sterne
    _famSens() {
      const f = this._cfg.fam;
      if (!f || !f.cost || !f.title) return null;
      const pts = f.pts || 0, reached = !!f.reached || pts >= f.cost;
      const rate = !reached ? this._kids().reduce((a, k) => a + this._rate(k.id), 0) : 0;
      const days = rate > 0 ? Math.ceil((f.cost - pts) / rate) : null;
      return { p: pts, n: f.title, attrs: {
        friendly_name: T('Yippee! Familienziel'), icon: 'mdi:flag-checkered', unit_of_measurement: 'Punkte',
        ziel: f.title, ziel_sterne: f.cost, fehlen: Math.max(0, f.cost - pts), prozent: Math.min(100, Math.round((pts / f.cost) * 100)), erreicht: reached,
        prognose_tage: days, prognose_datum: days !== null && days <= 365 ? keyAdd(dk(new Date()), days) : null,
      } };
    }

    _sensFlush() {
      this._sensT = null;
      const q = this._sensQ || {}; this._sensQ = {};
      const g = (window.__kpSens = window.__kpSens || {});
      Object.entries(q).forEach(([kid, desc]) => {
        const key = `kp|sens|${kid}`;
        const w = g[key];
        if ((kid === 'fam' ? !this._famSens() : !this._db.kid[kid]) || (this._sensRaw || {})[kid] === desc || (w && w.d === desc && Date.now() - w.t < 15000)) return; // schon gespeichert (auch von einer anderen Karte auf dieser Seite)
        g[key] = { d: desc, t: Date.now() };
        const has = Object.prototype.hasOwnProperty.call(this._sensRaw || {}, kid);
        this._enq(async () => {
          try { await this._svc(has ? 'update_item' : 'add_item', { item: key, description: desc }); }
          catch (e) { try { await this._svc('add_item', { item: key, description: desc }); } catch (e2) { delete g[key]; } }
        });
      });
      // ⚡ Danach einen Merker umschalten: Die Zahl offener Einträge der Liste ändert sich, die Vorlage reagiert darauf und liest sofort neu
      // (eine geänderte Beschreibung allein bemerkt Home Assistant nicht – sonst erst zur nächsten vollen Minute)
      if (Object.keys(q).length) {
        const has = Object.prototype.hasOwnProperty.call(this._sensRaw || {}, 'tick');
        this._enq(async () => {
          const st = (this._sensSt || {}).tick === 'completed' ? 'needs_action' : 'completed';
          try { await this._svc(has ? 'update_item' : 'add_item', has ? { item: 'kp|sens|tick', status: st } : { item: 'kp|sens|tick', description: '{}' }); if (has) (this._sensSt = this._sensSt || {}).tick = st; } catch (e) { /* egal – dann eben zur nächsten Minute */ }
        });
      }
    }







    // 🔁 Vorlage für configuration.yaml: Sensoren pro Kind, die Home Assistant selbst aus der Yippee-Liste liest.
    // Jeder Sensor trägt die Kennung der Vorlage („vorlage“) – ändert sich die Vorlage (Update, Kinder, Einstellungen), merkt die Karte das.
    _sensYaml() { const raw = this._sensYamlRaw('@VORLAGE@'); return raw.split('@VORLAGE@').join(this._tplSig(raw)); }
    _tplSig(raw) { return `v${hsh(raw || this._sensYamlRaw('@VORLAGE@'))}`; }
    _sensYamlRaw(sig) {
      const ent = this._config.storage, q = (x) => JSON.stringify(String(x));
      const keys = ['heute_erledigt', 'heute_gesamt', 'heute_netto', 'woche_netto', 'alles_erledigt', 'offen', 'wartet_auf_freigabe', 'level', 'level_name', 'gesamt_verdient', 'abzeichen', 'ziel', 'urlaub', 'anwesend', 'feiertag', 'ferien', ...(this._cfg.moneyOn ? ['euro'] : [])];
      const kids = [...this._kids()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)); // feste Reihenfolge: Umsortieren der Kinder ändert die Vorlage nicht
      return `# Yippee! - Kids Chores: Sensoren, die auch nach einem Neustart sofort da sind
# Am einfachsten als eigene Datei packages/yippee.yaml speichern (wenn "packages" eingerichtet ist).
# Sonst in die configuration.yaml einfügen – steht dort schon "template:", nur den Teil ab "- triggers:" darunter setzen.
# Danach Home Assistant neu starten. Neue oder umbenannte Kinder? Vorlage neu kopieren.
template:
  - triggers:
      - trigger: homeassistant
        event: start
      - trigger: state
        entity_id: ${ent}
      - trigger: time_pattern
        minutes: "/1"
    actions:
      - action: todo.get_items
        target:
          entity_id: ${ent}
        data:
          status: [needs_action, completed]
        response_variable: r
      - variables:
          y: >-
            {% set ns = namespace(o={}) %}
            {% for i in r[${q(ent).replace(/"/g, "'")}]['items'] if i.summary is string and i.summary.startswith('kp|sens|') %}
            {% set ns.o = dict(ns.o, **{i.summary[8:]: i.description | from_json(default={})}) %}
            {% endfor %}{{ ns.o }}
    sensor:
${kids.map((k) => { const v = `y.get('${k.id}', {})`; return `      - name: ${q(`Yippee! ${k.name}`)}
        unique_id: yippee_kid_${k.id}
        default_entity_id: sensor.yippee_${slug(k.name)}
        icon: mdi:star-circle
        unit_of_measurement: Punkte
        availability: "{{ ${v}.p is defined }}"
        state: "{{ ${v}.p }}"
        attributes:
${keys.map((x) => `          ${x}: "{{ ${v}.get('a', {}).get('${x}') }}"`).join('\n')}
          vorlage: "${sig}"`; }).join('\n')}${this._famSens() ? `
      - name: "Yippee! Familienziel"
        unique_id: yippee_familienziel
        default_entity_id: sensor.yippee_familienziel
        icon: mdi:flag-checkered
        unit_of_measurement: Punkte
        availability: "{{ y.get('fam', {}).p is defined }}"
        state: "{{ y.get('fam', {}).p }}"
        attributes:
${['ziel', 'ziel_sterne', 'fehlen', 'prozent', 'erreicht', 'prognose_tage', 'prognose_datum'].map((x) => `          ${x}: "{{ y.get('fam', {}).get('a', {}).get('${x}') }}"`).join('\n')}
          vorlage: "${sig}"` : ''}
`;
    }

    _schedulePenalty() {
      clearTimeout(this._penT);
      this._penT = setTimeout(() => this._penaltyCheck(), 2000 + Math.random() * 18000);
    }

    _todayTasks(kidId) {
      const today = dk(new Date());
      return Object.values(this._db.task)
        .filter((t) => {
          if (!(t.kids || []).includes(kidId)) return false;
          if (t.sched !== 'once') return this._isFor(t, kidId, new Date());
          const o = this._onceState(t);
          if (o && o.st === 'd') return o.kid === kidId && o.date === today;
          return (!t.until || t.until >= today) && !this._isOff(today, kidId);
        })
        .sort((a, b) => this._isExtra(a) - this._isExtra(b) || this._ord(a, b) || String(a.from || '').localeCompare(String(b.from || '')) || String(a.title).localeCompare(String(b.title)));
    }

    // Zeitfenster: 'before' = noch nicht offen, 'open' = jetzt erledigen, 'after' = vorbei
    _win(t) {
      const now = hhmm(new Date()), to = this._winTo(t);
      if (t.from && now < t.from) return 'before';
      if (to && now > to) return 'after';
      return 'open';
    }

    // 🕒 Lockerere Zeiten an schulfreien Tagen (optional): an schulfreien Tagen gilt ein Zeitfenster bis zum Ende seines Tagesblocks
    // Beginn der Blöcke (Morgens beginnt um 0:00); jeder Block endet, wo der nächste beginnt – so gibt es keine Überschneidungen
    _blkB() {
      const d = { mi: '11:30', na: '16:00', a: '18:00' }, b = this._cfg.blkB || {}, ok = (x) => /^\d\d:\d\d$/.test(String(x || ''));
      const v = { mi: ok(b.mi) ? b.mi : d.mi, na: ok(b.na) ? b.na : d.na, a: ok(b.a) ? b.a : d.a };
      return v.mi > '00:00' && v.mi < v.na && v.na < v.a ? v : d;
    }
    _blkEnd(id) { const b = this._blkB(); return { m: addMin(b.mi, -1), mi: addMin(b.na, -1), na: addMin(b.a, -1), a: '23:59' }[id] || ''; }
    _winTo(t, d) {
      const to = t.to || '';
      if (!to || !this._cfg.freeLate || t.fixTime) return to;
      const day = d instanceof Date ? d : d ? new Date(`${d}T12:00:00`) : new Date();
      if (this._isSchoolDay(day)) return to;
      // wie viel länger: '' = bis Ende des Tagesblocks, 30/60/120 Minuten oder 'day' = bis Tagesende
      const md = String(this._cfg.freeMode || '');
      const be = md === 'day' ? '23:59' : /^\d+$/.test(md) ? addMin(to, Number(md)) || '23:59' : this._blkEnd(this._blk(t));
      return be && be > to ? be : to;
    }


    _winSig() { return Object.values(this._db.task).filter((t) => t.from || t.to).map((t) => this._win(t)).join(''); }

    _st(date, taskId, kidId) { const l = this._db.log[date]; return (l && l.s && l.s[`${taskId}:${kidId}`]) || ''; }

    _setSt(date, taskId, kidId, val) {
      this._setMark(date, `${taskId}:${kidId}`, val);
      // 🦷 nicht (mehr) erledigt oder wartend → Timer-Marken entfernen (z. B. abgelehnt oder zurückgenommen)
      if (val !== 'd' && val !== 'p') ['zt', 'zp'].forEach((m) => { if (this._mark(date, `${m}:${taskId}:${kidId}`)) this._setMark(date, `${m}:${taskId}:${kidId}`, ''); });
    }

    _mark(date, key) { const l = this._db.log[date]; return (l && l.s && l.s[key]) || ''; }

    _setMark(date, key, val) {
      const l = this._db.log[date];
      const put = (o) => { const s = { ...((o && o.s) || {}) }; if (val) s[key] = val; else delete s[key]; return s; };
      this._save('log', date, { s: put(l) }, (cur) => ({ ...cur, s: put(cur) }));
    }


    _decide(date, tid, kidId, how, e) {
      const t = this._db.task[tid];
      if (!t || this._st(date, tid, kidId) !== 'm') { this._render(); return; }
      const kk = this._db.kid[kidId];
      this._audit(T('⏰ Verpasst entschieden: {name} – {title}: {how}', { name: kk ? kk.name : '?', title: t.title, how: how === 'x' ? `−${Number(t.penalty) || 0} ⭐` : how === 'e' ? T('entschuldigt') : T('doch erledigt') }));
      if (how === 'x') {
        const pen = Number(t.penalty) || 0;
        this._setSt(date, tid, kidId, 'x');
        const ap = this._addPoints(kidId, -pen, `Verpasst: ${t.emoji || '⭐'} ${t.title}`) || 0;
        this._setMark(date, `xp:${tid}:${kidId}`, String(-ap));
        this._pop(e, `−${pen} ⭐`);
      } else if (how === 'e') {
        this._setSt(date, tid, kidId, 'e');
      } else {
        this._markDone(date, tid, kidId, e);
      }
      this._render();
    }

    _pendingTasks() {
      const out = [];
      Object.keys(this._db.log).sort().forEach((date) => {
        const s = this._db.log[date].s || {};
        Object.keys(s).forEach((k) => {
          if (s[k] !== 'p') return;
          const [tid, kid] = k.split(':');
          const t = this._db.task[tid], c = this._db.kid[kid];
          if (t && c && !(t.sched === 'once' && t.done)) out.push({ date, t, c });
        });
      });
      return out;
    }

    // Jede Punkte-Änderung landet mit Grund im Verlauf (ledger)
    // Jede Punkte-Änderung landet mit Grund im Verlauf (ledger); zählt für Level, Abzeichen und Familienziel
    // Verdient-Anteil einer Buchung (für Level, Wochenstatistik): Plus zählt, Korrekturen in beide Richtungen,
    // erstattete Minuspunkte zählen nicht (die Strafe hat auch nichts abgezogen)
    // eingelöst: 🎁 Belohnung, 💶 Auszahlung, 👫 Anteil, 💝 Einladung – positiv; ↩️ Anteil zurück – negativ
    _spendOf(x) {
      const r = String((x && x.r) || ''), n = Number(x && x.n) || 0;
      if (r.startsWith('↩️ Anteil zurück')) return -n;
      return ['🎁', '💶', '👫 Anteil', '💝 Einladung'].some((p) => r.startsWith(p)) && n < 0 ? -n : 0;
    }

    // ➖ Tagesbilanz: alle Buchungen des Tages ohne Einlösungen (verdient minus abgezogen)
    _dayNet(k, date) { return (k.ledger || []).filter((x) => x.d === date && !this._spendOf(x)).reduce((a, x) => a + (Number(x.n) || 0), 0); }

    _earnOf(x) {
      if (!x) return 0;
      if (x.e !== undefined) return Number(x.e) || 0;
      const r = String(x.r || '');
      if (r.startsWith('↩️')) return 0;
      return x.n > 0 || r.startsWith('Zurückgenommen') || r === 'Von Hand (Eltern)' ? Number(x.n) || 0 : 0;
    }

    // Wochensummen „verdient“ (unabhängig von der Länge des Verlaufs)
    _wkAdd(wk, entry) {
      const e = this._earnOf(entry);
      const out = { ...(wk || {}) };
      if (!e) return out;
      const [y, m, d] = entry.d.split('-').map(Number), dt = new Date(y, m - 1, d);
      const mon = dk(new Date(y, m - 1, d - ((dt.getDay() + 6) % 7)));
      out[mon] = (out[mon] || 0) + e;
      const cut = new Date(); cut.setDate(cut.getDate() - 84);
      Object.keys(out).forEach((k) => { if (k < dk(cut)) delete out[k]; });
      return out;
    }

    // Jede Punkte-Änderung landet mit Grund im Verlauf (ledger); zählt für Level, Abzeichen und Familienziel
    // ops: zusätzliche Änderungen am Kind (Zähler, Verlauf, Gutscheine …) – werden mit der Buchung gespeichert
    // fid: feste Buchungsnummer (z. B. 🎄 Adventskalender) – wurde sie schon gebucht, passiert nichts
    _addPoints(kidId, n, reason, ops, fid) {
      const k = this._db.kid[kidId];
      if (!k) return;
      const rs = String(reason || ''), refund = rs.startsWith('↩️'), nn = Math.round(Number(n) || 0);
      if (!nn && !ops) return 0;
      if (fid && (this._db.pt[fid] || (k.ap || []).includes(fid) || this._stored.has(`kp|pt|${fid}`))) return 0;
      const now = new Date(), id = fid || uid() + uid().slice(0, 4);
      const ts = Math.max(Date.now(), (this._lastTs || 0) + 1); this._lastTs = ts; // eindeutige Reihenfolge auch bei mehreren Buchungen in derselben Millisekunde
      const x = this._ptClean({ k: kidId, n: nn, r: rs, d: dk(now), t: hhmm(now), ts, ...(this._cfg.negOn ? { ng: 1 } : {}), ...(ops ? { o: ops } : {}) });
      const before = k.points || 0, base = k.total !== undefined ? k.total : before;
      const rec = this._clean('kid', this._applyDelta(k, { ...x, id }));
      const after = rec.points || 0, applied = after - before, total = rec.total !== undefined ? rec.total : after, earn = total - base;
      this._save('pt', id, x);
      this._db.kid[kidId] = rec;
      this._dbv = (this._dbv || 0) + 1;
      clearTimeout(this._consT); this._consT = setTimeout(() => this._consCheck(), 7000);
      if (!nn) return 0;
      // Minuspunkte für Verpasstes (und deren Erstattung): optional auch beim Familienziel
      const famD = earn || ((rs.startsWith('Verpasst') || refund) && this._cfg.famMinus ? applied : 0);
      const bBefore = badgesOf({ ...k, total: base }), bAfter = badgesOf(rec);
      if (famD) this._familyAdd(famD);
      const lvA = levelOf(base), lvB = levelOf(total);
      if (lvB > lvA) { const Lv = LEVELS[lvB]; this._celebrate(Lv[2], T('{name} ist jetzt Level {n}!', { name: k.name, n: lvB + 1 }), T(Lv[1])); }
      BADGES.filter((bd) => bAfter.includes(bd[0]) && !bBefore.includes(bd[0])).forEach((bd) => this._celebrate(bd[1], T('Neues Abzeichen für {name}!', { name: k.name }), T(bd[2])));
      if (nn > 0 && !refund) {
        const goal = this._cfg.goalOn !== false && k.goal && this._db.reward[k.goal];
        const gc = this._cost(goal, kidId);
        if (goal && gc > before && gc <= after) { this._celebrate('🎯', T('{name} hat sein Ziel erreicht!', { name: k.name }), `${goal.emoji || '🎁'} ${T('{title} kann eingelöst werden', { title: goal.title })}`); return applied; }
        const r = this._rewards(kidId).filter((y) => this._cost(y, kidId) > before && this._cost(y, kidId) <= after).pop();
        if (r) this._celebrate(r.emoji || '🎁', T('{name} hat genug Punkte!', { name: k.name }), T('{title} kann eingelöst werden', { title: r.title }));
      }
      return applied;
    }

    // 🎄 Adventskalender: Belohnung schenken – ohne Sterne abzuziehen, ohne Wochenlimit und ohne Einfluss aufs Ziel
    _advGift(kidId, rid, n, fid) {
      const r = this._db.reward[rid], k = this._db.kid[kidId];
      if (!r || !k) return false;
      const today = dk(new Date());
      const push = [['history', { d: today, t: `🎄 ${r.title}`, e: r.emoji, c: 0 }, 10]];
      if (this._cfg.walletOn && !r.joker) push.push(['vouch', { id: uid(), t: r.title, e: r.emoji || '🎁', d: today }, 50]);
      this._addPoints(kidId, 0, T('🎁 Geschenkt: {title}', { title: r.title }), { push, ...(r.joker ? { inc: { jokers: 1 } } : {}) }, fid);
      this._lm(`🎄 ${k.name}: ${r.title}`, 'cash');
      return true;
    }
    // 🎄 Belohnung nur für den Adventskalender: Kinder sehen sie sonst nirgends
    _advR(r) { return !!(r && r.adv); }
    _advOn() { return !!this._cfg.advOn; }

    // ---------- 🦷 Zahnputz-Timer ----------
    // Einstellungen: kp|zc|main · Fortschritt je Kind: kp|zk|<Kind> · Marken im Tageslog: zt:<Aufgabe>:<Kind> = mit Timer geputzt, zp:… = gebuchte Sterne
    _zOn() { return !!this._cfg.zOn; }
    _zc() { const c = { ...((this._db.zc || {}).main || {}) }; delete c.id; return c; }
    _zSet(patch) {
      const mg = (cur) => {
        const n = { ...(cur || {}) }; delete n.id;
        Object.keys(patch).forEach((k) => {
          if (k === 'pt') { const pt = { ...(n.pt || {}) }; Object.keys(patch.pt || {}).forEach((kid) => { pt[kid] = { ...(pt[kid] || {}), ...patch.pt[kid] }; }); n.pt = pt; }
          else if (k === 'dur' || k === 'brush') n[k] = { ...(n[k] || {}), ...patch[k] };
          else n[k] = patch[k];
        });
        return n;
      };
      this._save('zc', 'main', mg(this._zc()), mg);
      this._render();
    }
    // Zahnputz-Aufgaben automatisch erkennen (Titel in allen 27 Sprachen bzw. 🦷), solange die Eltern nichts ausgewählt haben
    _zAuto() {
      const rx = /🪥|\b(z[aä]hn|teeth|tooth|dent|dient|dant|tand|tänder|hamp|hamb|zob|zub|fog|din[țţt]i|diş|fiacl)|zęb|зъб|зуб|δόντ|snien/i;
      return Object.values(this._db.task).filter((t) => !t.virtual && t.sched !== 'once' && (t.emoji === '🪥' || rx.test(String(t.title || '')))).map((t) => t.id);
    }
    _zTasks() {
      const c = this._zc();
      if (!Array.isArray(c.tasks)) return this._zAuto();
      return c.tasks.filter((id) => { const t = this._db.task[id]; return t && !t.virtual && t.sched !== 'once'; });
    }
    _zLinked(t) { return !!(t && this._zOn() && t.sched !== 'once' && this._zTasks().includes(t.virtual ? t.parent : t.id)); }
    // 🦷 Zahnputz-Aufgabe als Schritt einer Routine (#17): Der Schritt startet den Zahnputz-Timer.
    // _zStepIdx: Nummern der Schritte einer Routine, deren Aufgabe mit dem Zahnputz-Timer verknüpft ist
    _zStepIdx(r) { return this._routine(r) && this._zOn() ? r.steps.map((x, i) => (this._zStepOn(x) ? i : -1)).filter((i) => i >= 0) : []; }
    // Schritt mit Timer: verknüpfte Zahnputz-Aufgabe – oder ein Text-Schritt mit 🦷 (beginnt mit 🦷 oder im Editor eingeschaltet; z:false schaltet ab)
    _zStepOn(x) { return !!x && (x.tid ? this._zLinked(this._db.task[x.tid]) : x.z === true || (x.z !== false && /^\s*🦷/u.test(String(x.t || '')))); }
    // Alle Zahnputz-Aufgaben, die heute für das Kind anstehen – eigene Kacheln und Schritte in heutigen Routinen (für Serie und Galerie)
    _zDueToday(kidId) {
      const tt = this._todayTasks(kidId), out = tt.filter((x) => this._zLinked(x) && this._status(x, kidId).s !== 'taken');
      // Text-Schritt mit 🦷: das Putzen wird unter der Routine selbst gebucht (Marke zt:<Routine>)
      tt.forEach((r) => { if (this._status(r, kidId).s !== 'taken') this._zStepIdx(r).forEach((i) => { const st = this._db.task[r.steps[i].tid || r.id]; if (st && !out.includes(st)) out.push(st); }); });
      return out;
    }
    // Timer für einen Routine-Schritt starten; _zFinish hakt danach den Schritt ab (die Sterne gibt es wie immer am Ende der Routine)
    _zStepStart(rid, kidId, i) {
      const r = this._db.task[rid], k = this._db.kid[kidId];
      if (!r || !k || !this._zStepIdx(r).includes(i)) return;
      const tid = r.steps[i].tid || rid;
      this._zStepCtx = { rid, tid, kid: kidId, i };
      const go = () => {
        if (!this._zRun || !this._zRun.isConnected) { this._zRun = document.createElement('yippee-teeth-run'); this.shadowRoot.appendChild(this._zRun); }
        if (!this._zRun.start(this, tid, kidId)) this._zStepCtx = null;
      };
      if (customElements.get('yippee-teeth-run')) { go(); return; }
      this._toast(T('Lade …'));
      zLoad().then(go, () => { this._zStepCtx = null; this._toast(T('⚠️ Der Zahnputz-Timer konnte nicht geladen werden – liegt die Datei yippee-kids-chores-teeth.js neben der Karte?')); });
    }

    // Spalten für „Je Kind & Tageszeit“: jede Zahnputz-Aufgabe (bei „mehrmals am Tag“ jedes Zeitfenster)
    _zCols() {
      const out = [], lbl = Object.fromEntries(this._blockDefs());
      this._zTasks().map((id) => this._db.task[id]).filter(Boolean).forEach((t) => {
        const parts = Array.isArray(t.slots) && t.slots.length > 1 ? t.slots.map((sl, i) => this._db.task[`${t.id}-${i + 1}`]).filter(Boolean) : [t];
        parts.forEach((x) => out.push({ id: x.id, from: x.from || '', label: lbl[this._blk(x)] || x.title, title: x.title, kids: x.kids || [] }));
      });
      out.sort((a, b) => String(a.from || '99').localeCompare(String(b.from || '99')));
      const n = {}; out.forEach((x) => { n[x.label] = (n[x.label] || 0) + 1; });
      out.forEach((x) => { if (n[x.label] > 1) x.label = `${x.label} · ${x.title}`; });
      return out;
    }
    _zBase(t) { return Math.max(0, Number(t && t.points) || 0); }
    _zPtsCol(colId, kidId) {
      const c = this._zc(), t = this._db.task[colId], v = c.pm === 'kid' && c.pt && c.pt[kidId] ? c.pt[kidId][colId] : undefined;
      if (v !== undefined && v !== null && Number.isFinite(Number(v))) return Math.max(0, Math.round(Number(v)));
      if (c.pAll !== undefined && c.pAll !== null && Number.isFinite(Number(c.pAll))) return Math.max(0, Math.round(Number(c.pAll)));
      return this._zBase(t);
    }
    // Sterne für eine Zahnputz-Aufgabe: mit Timer (oder „auch ohne Timer“) die Werte aus 🦷 Zähne, sonst die der Aufgabe
    _zPts(t, kidId, timer) {
      if (!this._zLinked(t)) return this._zBase(t);
      if (!timer && !this._zc().pNoT) return this._zBase(t);
      return this._zPtsCol(t.id, kidId);
    }
    _zExtra(t, kidId) {
      const mine = this._zCols().filter((x) => x.kids.includes(kidId));
      if (mine.length < 2) return false;
      const v = mine.map((x) => this._zPtsCol(x.id, kidId)), me = this._zPtsCol(t.id, kidId);
      return me === Math.max(...v) && me > Math.min(...v);
    }
    // 🦷 Oral-B-Zahnbürsten (Integration „Oral-B“): Gerät → Entitäten Zustand und Druck
    _zBrushes() {
      const ents = (this._hass && this._hass.entities) || {}, devs = (this._hass && this._hass.devices) || {}, st = (this._hass && this._hass.states) || {}, by = {};
      Object.values(ents).forEach((e) => {
        if (!e || e.platform !== 'oralb' || !e.device_id || !/^[\w-]{1,64}$/.test(e.device_id)) return;
        const d = by[e.device_id] || (by[e.device_id] = { id: e.device_id });
        const key = e.translation_key || '', id = e.entity_id || '';
        if (key === 'toothbrush_state' || /_toothbrush_state$/.test(id)) d.state = id;
        else if (key === 'pressure' || /_pressure$/.test(id)) d.pressure = id;
      });
      return Object.values(by).filter((d) => d.state).map((d) => {
        const dv = devs[d.id] || {}, fn = (st[d.state] && st[d.state].attributes && st[d.state].attributes.friendly_name) || '';
        return { ...d, name: dv.name_by_user || dv.name || fn.replace(/\s*(Toothbrush state|Zahnbürstenstatus|Status)$/i, '') || d.id };
      }).sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }
    _zBrush(kidId) { const id = (this._zc().brush || {})[kidId]; return (id && this._zBrushes().find((b) => b.id === id)) || null; }
    _zStreak(kidId) {
      const z = this._db.zk[kidId] || {}, today = dk(new Date());
      return z.sd === today || z.sd === keyAdd(today, -1) ? Math.max(0, Number(z.sn) || 0) : 0;
    }
    _zClean(type, o) {
      const idOk = (x) => typeof x === 'string' && /^[\w-]{1,40}$/.test(x) && x !== '__proto__';
      const ref = (x) => typeof x === 'string' && /^media-source:\/\/media_source\/[\w-]+\/[^"'<>\\]+$/.test(x) && x.length < 400;
      const int = (v, a, b) => Math.max(a, Math.min(b, Math.round(Number(v) || 0)));
      const obj = (v) => v && typeof v === 'object' && !Array.isArray(v);
      if (type === 'zc') {
        if (o.tasks !== undefined) o.tasks = Array.isArray(o.tasks) ? o.tasks.filter(idOk).slice(0, 30) : [];
        ['inst', 'only', 'pNoT', 'chime', 'tada', 'anim', 'blur', 'bFollow'].forEach((k) => { if (o[k] !== undefined) o[k] = !!o[k]; });
        if (o.brush !== undefined) { const b = {}; if (obj(o.brush)) Object.keys(o.brush).forEach((k) => { const v = String(o.brush[k] || ''); if (idOk(k) && /^[\w-]{1,64}$/.test(v)) b[k] = v; }); o.brush = b; }
        if (o.pm !== undefined) o.pm = o.pm === 'kid' ? 'kid' : 'all';
        if (o.pAll !== undefined && o.pAll !== null) o.pAll = int(o.pAll, 0, 100);
        if (o.bonus !== undefined) o.bonus = int(o.bonus, 0, 100);
        if (o.pt !== undefined) { const pt = {}; if (obj(o.pt)) Object.keys(o.pt).forEach((k) => { if (idOk(k) && obj(o.pt[k])) { const r = {}; Object.keys(o.pt[k]).forEach((c) => { if (idOk(c)) r[c] = int(o.pt[k][c], 0, 100); }); pt[k] = r; } }); o.pt = pt; }
        if (o.dur !== undefined) { const d = {}; if (obj(o.dur)) Object.keys(o.dur).forEach((k) => { const v = Number(o.dur[k]); if (idOk(k) && [60, 120, 180].includes(v)) d[k] = v; }); o.dur = d; }
        if (o.mode !== undefined) o.mode = o.mode === 'ord' ? 'ord' : 'rnd';
        if (o.mus !== undefined) o.mus = ['std', 'own', 'rnd', 'off'].includes(o.mus) ? o.mus : 'std';
        if (o.snd !== undefined) o.snd = ['off', 'scrub', 'el'].includes(o.snd) ? o.snd : 'off';
        ['hide', 'ord'].forEach((k) => { if (o[k] !== undefined) o[k] = Array.isArray(o[k]) ? [...new Set(o[k].filter(idOk))].slice(0, 80) : []; });
        if (o.own !== undefined) o.own = Array.isArray(o.own) ? o.own.filter((x) => obj(x) && idOk(x.i) && ref(x.r)).map((x) => ({ i: x.i, r: x.r, n: String(x.n || '').slice(0, 40), k: Array.isArray(x.k) ? x.k.filter(idOk).slice(0, 20) : [] })).slice(0, 40) : [];
        if (o.mp3 !== undefined) o.mp3 = Array.isArray(o.mp3) ? o.mp3.filter((x) => obj(x) && ref(x.r)).map((x) => ({ r: x.r, n: String(x.n || '').slice(0, 40) })).slice(0, 20) : [];
        if (o.musF !== undefined && !ref(o.musF)) o.musF = '';
      }
      if (type === 'zk') {
        const dOk = (x) => /^\d{4}-\d\d-\d\d$/.test(String(x || ''));
        if (o.n !== undefined) o.n = int(o.n, 0, 1e6);
        if (o.sn !== undefined) o.sn = int(o.sn, 0, 1e5);
        if (o.oi !== undefined) o.oi = int(o.oi, 0, 1000);
        if (o.sd !== undefined && !dOk(o.sd)) delete o.sd;
        ['seen', 'bag'].forEach((k) => { if (o[k] !== undefined) o[k] = Array.isArray(o[k]) ? [...new Set(o[k].filter(idOk))].slice(-100) : []; });
        if (o.td !== undefined) {
          if (obj(o.td) && dOk(o.td.d)) { const m = {}; if (obj(o.td.m)) Object.keys(o.td.m).forEach((k) => { if (idOk(k) && idOk(o.td.m[k])) m[k] = o.td.m[k]; }); o.td = { d: o.td.d, l: Array.isArray(o.td.l) ? o.td.l.filter(idOk).slice(-12) : [], m, ...(Array.isArray(o.td.nw) ? { nw: o.td.nw.filter(idOk).slice(-12) } : {}) }; } else delete o.td;
        }
        if (o.cur !== undefined) { if (obj(o.cur) && dOk(o.cur.d) && idOk(o.cur.t) && idOk(o.cur.i)) o.cur = { d: o.cur.d, t: o.cur.t, i: o.cur.i }; else delete o.cur; }
        if (o.bd !== undefined && !dOk(o.bd)) delete o.bd;
      }
      return o;
    }

    // Tab 🦷 Zähne einhängen (das Modul wird erst beim ersten Mal geladen)
    _zMount(app) {
      const slot = app.querySelector('#zslot');
      if (!slot) return;
      if (!customElements.get('yippee-teeth')) {
        slot.innerHTML = `<div class="empty">${this._zErr ? T('⚠️ Der Zahnputz-Timer konnte nicht geladen werden – liegt die Datei yippee-kids-chores-teeth.js neben der Karte?') : T('Lade …')}</div>`;
        if (!this._zErr && !this._zBusy) { this._zBusy = true; zLoad().then(() => { this._zBusy = false; this._render(); }, () => { this._zBusy = false; this._zErr = true; this._render(); }); }
        return;
      }
      if (!this._zEl) this._zEl = document.createElement('yippee-teeth');
      slot.replaceWith(this._zEl);
      this._zEl.attach(this);
    }

    // 🦷 Timer starten (aus der Kinder-Ansicht)
    _zStart(tid, kidId) {
      const t = this._db.task[tid], k = this._db.kid[kidId];
      if (!t || !k || !this._zLinked(t)) return;
      this._zStepCtx = null;
      const { s } = this._status(t, kidId);
      if (s && s !== 'p') { this._render(); return; }
      const w = this._win(t);
      if (w === 'before') { this._toast(T('⏰ Erst ab {time} Uhr', { time: t.from })); return; }
      if (w === 'after') { this._toast(T('Zeit ist vorbei (bis {time} Uhr)', { time: this._winTo(t) })); return; }
      const go = () => {
        if (!this._zRun || !this._zRun.isConnected) { this._zRun = document.createElement('yippee-teeth-run'); this.shadowRoot.appendChild(this._zRun); }
        this._zRun.start(this, tid, kidId);
      };
      if (customElements.get('yippee-teeth-run')) { go(); return; }
      this._toast(T('Lade …'));
      zLoad().then(go, () => this._toast(T('⚠️ Der Zahnputz-Timer konnte nicht geladen werden – liegt die Datei yippee-kids-chores-teeth.js neben der Karte?')));
    }
    _zClosed() {
      const x = this._zStepCtx; this._zStepCtx = null;
      this._render();
      if (!x) return;
      // Schritt einer Routine: zurück in die Routine – oder sie ist jetzt komplett
      const r = this._db.task[x.rid], k = this._db.kid[x.kid];
      if (!r || !k || !this._routine(r) || this._status(r, x.kid).s) return;
      if (this._routDone(dk(new Date()), x.rid, x.kid, r.steps.length).length >= r.steps.length) this._routFinish(x.rid, x.kid, null);
      else this._routDlg(r, k, null);
    }

    // 🦷 Timer fertig: Aufgabe erledigen (sofort oder zur Freigabe), Serie und Bonus, Bild merken
    _zFinish(tid, kidId, date, img) {
      const t = this._db.task[tid], k = this._db.kid[kidId];
      const res = { pts: 0, streak: 0, bonus: 0, msg: T('Super geputzt!') };
      if (!t || !k) return res;
      const c = this._zc(), today = dk(new Date());
      // td.nw = heute neu freigeputzte Bilder – damit „Zurücknehmen“ nur ein wirklich neues Bild wieder entfernt
      const prog = (x) => {
        const isNew = !!img && !(x.seen || []).includes(img);
        const td = x.td && x.td.d === date ? { ...x.td, nw: [...new Set([...(x.td.nw || []), ...(isNew ? [img] : [])])] } : x.td;
        return { ...x, ...(td ? { td } : {}), n: (Number(x.n) || 0) + 1, seen: [...new Set([...(x.seen || []).filter((y) => y !== img), ...(img ? [img] : [])])].slice(-100) };
      };
      this._save('zk', kidId, prog(this._db.zk[kidId] || {}), prog);
      const sx = this._zStepCtx && this._zStepCtx.tid === tid && this._zStepCtx.kid === kidId ? this._zStepCtx : null;
      const st = sx ? '' : this._st(date, tid, kidId), stat = sx ? { s: '' } : date === today ? this._status(t, kidId) : { s: st };
      if (sx) {
        // 🦷 Schritt einer Routine: Schritt abhaken, Putzen zählt für Bilder/Zähler/Serie – Sterne gibt es am Ende der Routine
        const r = this._db.task[sx.rid];
        this._setMark(date, `zt:${tid}:${kidId}`, '1');
        if (r && this._routine(r)) {
          const dn = new Set(this._routDone(date, sx.rid, kidId, r.steps.length)); dn.add(sx.i);
          this._setMark(date, `rs:${sx.rid}:${kidId}`, [...dn].sort((a, b) => a - b).join(','));
          res.msg = dn.size >= r.steps.length ? T('„{title}“ ist erledigt.', { title: r.title }) : T('Schritt geschafft – weiter mit „{title}“!', { title: r.title });
        }
      }
      if (sx) { /* weiter unten: Serie */ } else if (st === 'd') res.msg = T('Das war schon erledigt – trotzdem super geputzt!');
      else if (['x', 'm', 'e'].includes(st) || stat.s === 'taken') res.msg = T('Diese Aufgabe ist schon entschieden – trotzdem super geputzt!');
      else {
        this._setMark(date, `zt:${tid}:${kidId}`, '1');
        if (!this._approval || c.inst !== false) {
          this._markDone(date, tid, kidId);
          if (st === 'p') this._photoDone(date, tid, kidId);
          res.pts = this._zPts(t, kidId, true) * this._mult(date, kidId);
          res.msg = T('„{title}“ ist erledigt.', { title: t.title });
        } else if (st !== 'p') {
          this._setSt(date, tid, kidId, 'p');
          this._notify(T('🦷 {name} hat mit dem Timer geputzt – bitte freigeben.', { name: k.name }), 'task',
            [[T('✓ Freigeben'), `KP|ok|${date}|${tid}|${kidId}`], [T('✕ Ablehnen'), `KP|no|${date}|${tid}|${kidId}`]]);
          res.pending = true; res.msg = T('⏳ Mama oder Papa geben es noch frei.');
        } else { res.pending = true; res.msg = T('⏳ Mama oder Papa geben es noch frei.'); }
      }
      if (sx || (st !== 'd' && !['x', 'm', 'e'].includes(st) && stat.s !== 'taken')) {
        // 🔥 Serie: ein Tag zählt, wenn heute alle Zahnputz-Aufgaben mit dem Timer geputzt wurden
        if (date === today) {
          const due = this._zDueToday(kidId);
          const all = due.length && due.every((x) => this._mark(today, `zt:${x.id}:${kidId}`));
          const z = this._db.zk[kidId] || {};
          if (all && z.sd !== today) {
            const sn = z.sd === keyAdd(today, -1) ? (Number(z.sn) || 0) + 1 : 1;
            const upd = (x) => (x.sd === today ? x : { ...x, sd: today, sn: x.sd === keyAdd(today, -1) ? (Number(x.sn) || 0) + 1 : 1 });
            this._save('zk', kidId, upd(z), upd);
            const b = Math.max(0, Number(c.bonus) || 0);
            if (b && sn % 7 === 0) {
              const got = this._addPoints(kidId, b, T('🦷 Zahnputz-Serie: {n} Tage', { n: sn }), null, this._zBonusId(today, kidId));
              if (got) res.bonus = b;
            }
          }
          res.streak = this._zStreak(kidId);
        }
      }
      this._render();
      // „Alles geschafft“ wie beim normalen Abhaken
      if (!res.pending && res.pts !== undefined && st !== 'd') {
        const list = this._todayTasks(kidId).filter((x) => this._req(x) && this._status(x, kidId).s !== 'taken');
        if (this._req(t) && list.length > 1 && list.every((x) => this._status(x, kidId).s === 'd')) setTimeout(() => this._celebrate('🏆', T('{cheer}, {name}!', { cheer: cheer(), name: k.name }), T('Alles für heute erledigt!')), 1200);
      }
      return res;
    }

    // eigenes Foto in der Galerie: signierte Adresse über resolve_media (für alle Benutzer erlaubt), bis dahin 📷
    _zOwnImg(ow) {
      const u = ZAPI.url ? ZAPI.url(ow.r) : '';
      if (u) return `<img src="${esc(u)}" alt="" loading="lazy">`;
      if (ZAPI.res && ow.r) {
        this._zOwnTry = this._zOwnTry || {};
        if (!this._zOwnTry[ow.r]) { this._zOwnTry[ow.r] = 1; ZAPI.res(this._hass, ow.r).then((x) => { if (x) this._render(); }); }
      }
      return '📷';
    }

    // Galerie-Bild antippen → groß ansehen (mit ‹ › zum Blättern durch die gesammelten Bilder)
    _zPic(kid, id) {
      const k = this._db.kid[kid]; if (!k || !ZAPI.thumb) return;
      const c = this._zc(), ids = [...ZTPL, ...(c.own || []).map((o) => o.i)];
      const seen = ((this._db.zk[kid] || {}).seen || []).filter((x) => ids.includes(x)).reverse(), i = Math.max(0, seen.indexOf(id)), cur = seen[i] || id;
      const ow = (c.own || []).find((x) => x.i === cur);
      const nav = (j, lbl) => (seen[j] ? `<button type="button" class="btn zpnav" data-a="zpic" data-k="${kid}" data-x="${esc(seen[j])}">${lbl}</button>` : '<span></span>');
      this._modal(`🦷 ${esc(ow && ow.n ? ow.n : `${i + 1}/${seen.length || 1}`)}`, `<div class="zpbig">${ow ? this._zOwnImg(ow) : ZAPI.thumb(cur)}</div><div class="zpbar">${nav(i - 1, '‹')}<span class="hint">${i + 1}/${seen.length || 1}</span>${nav(i + 1, '›')}</div>`);
      if (ow && ZAPI.res && !(ZAPI.url && ZAPI.url(ow.r))) ZAPI.res(this._hass, ow.r).then((u) => { const m = this.shadowRoot.getElementById('modal'); if (u && m && m.querySelector('.zpbig')) this._zPic(kid, cur); });
    }

    // Kinder-Ansicht: 🦷 Meine Zahnputz-Bilder (zugeklappt; aufgeklappt mit kleinen Bildern)
    _zKidHtml(k) {
      if (!this._zOn() || !this._zDueToday(k.id).length && !(this._db.zk[k.id] || {}).n) return '';
      const z = this._db.zk[k.id] || {}, c = this._zc(), ids = [...ZTPL, ...(c.own || []).filter((o) => !(o.k && o.k.length) || o.k.includes(k.id)).map((o) => o.i)];
      // Zähler: nur Bilder, die dieses Kind gerade bekommen kann (ausgeblendete zählen nicht) – gesammelte bleiben trotzdem in der Galerie
      const hide = new Set(c.hide || []), vis = ids.filter((x) => !hide.has(x));
      const seen = (z.seen || []).filter((x) => ids.includes(x)), nVis = seen.filter((x) => vis.includes(x)).length, sn = this._zStreak(k.id), o = this._kvOpen(k.id, 'z');
      let body = '';
      if (o) {
        if (!ZAPI.thumb) { if (!this._zBusy) { this._zBusy = true; zLoad().then(() => { this._zBusy = false; this._render(); }, () => { this._zBusy = false; }); } body = `<div class="hint">${T('Lade …')}</div>`; }
        else body = seen.length ? `<div class="zgal">${seen.slice().reverse().map((id) => { const ow = (c.own || []).find((x) => x.i === id); return `<button type="button" class="zgi" data-a="zpic" data-k="${k.id}" data-x="${esc(id)}" aria-label="${esc(ow && ow.n ? ow.n : '🦷')}">${ow ? this._zOwnImg(ow) : ZAPI.thumb(id)}</button>`; }).join('')}</div>` : `<div class="hint">${T('Noch kein Bild freigeputzt – beim nächsten Zähneputzen geht\'s los!')}</div>`;
      }
      return `<div class="badges"><button type="button" class="kvbtn" data-a="kvtog" data-x="z" data-k="${k.id}" aria-expanded="${o}"><span class="kve">🦷</span> ${T('Meine Zahnputz-Bilder {n}/{total}', { n: nVis, total: vis.length })}${sn >= 2 ? ` <span class="kvgot">🔥${sn}</span>` : ''} <span class="accc">▸</span></button>${body}</div>`;
    }

    // ---------- Buchungen als eigene Einträge ----------
    // Jede Punkte-Änderung wird zuerst als eigener Listen-Eintrag „kp|pt|…“ gespeichert (Anlegen kann nie mit einem
    // anderen Gerät kollidieren). Angezeigt wird Kind + noch offene Buchungen; ein Gerät führt sie später zusammen.
    // Welche Buchungen schon im Kind stecken, merkt sich das Kind in „ap“ – so wird nichts doppelt gezählt.
    _ptClean(o) {
      const out = { k: String(o.k || ''), n: Math.max(-100000, Math.min(100000, Math.round(Number(o.n) || 0))), r: String(o.r || '').slice(0, 200), d: /^\d{4}-\d\d-\d\d$/.test(String(o.d)) ? o.d : '', t: /^\d\d:\d\d$/.test(String(o.t)) ? o.t : '', ts: Number(o.ts) || 0 };
      if (o.ng) out.ng = 1; // ➖ beim Buchen war „Minus-Stand erlauben“ an
      if (o.id) out.id = o.id;
      const op = o.o && typeof o.o === 'object' ? o.o : null;
      if (op) {
        const q = {}, int = (v, a, b) => Math.max(a, Math.min(b, Math.round(Number(v) || 0)));
        if (op.inc && typeof op.inc === 'object') { q.inc = {}; ['doneCount', 'onceCount', 'jokers'].forEach((f) => { if (op.inc[f] !== undefined) q.inc[f] = int(op.inc[f], -1000, 1000); }); }
        if (op.max && typeof op.max === 'object' && op.max.best !== undefined) q.max = { best: int(op.max.best, 0, 100000) };
        if (Array.isArray(op.push)) q.push = op.push.filter((x) => Array.isArray(x) && ['history', 'grades', 'vouch'].includes(x[0]) && x[1] && typeof x[1] === 'object' && !Array.isArray(x[1])).map((x) => [x[0], JSON.parse(JSON.stringify(x[1])), int(x[2], 1, 200)]).slice(0, 5);
        if (Array.isArray(op.red) && /^[\w-]{1,40}$/.test(String(op.red[0])) && /^\d{4}-\d\d-\d\d$/.test(String(op.red[1])) && /^\d{4}-\d\d-\d\d$/.test(String(op.red[2]))) q.red = op.red.slice(0, 3);
        if (op.ungoal && /^[\w-]{1,40}$/.test(String(op.ungoal))) q.ungoal = String(op.ungoal);
        if (op.unvouch && /^[\w-]{1,40}$/.test(String(op.unvouch))) q.unvouch = String(op.unvouch);
        // 🧹 Adventskalender zurücksetzen: gemerkte Buchungen vergessen, Gutscheine und Verlaufs-Einträge der Geschenke entfernen
        if (op.adv && typeof op.adv === 'object') {
          const ids = (v) => (Array.isArray(v) ? v.map(String).filter((x) => /^[\w-]{1,40}$/.test(x)).slice(0, 80) : []);
          q.adv = { ap: ids(op.adv.ap), v: ids(op.adv.v), h: Array.isArray(op.adv.h) ? op.adv.h.map((x) => String(x).slice(0, 120)).slice(0, 40) : [] };
        }
        if (Object.keys(q).length) out.o = q;
      }
      return out;
    }
    _applyDelta(cur, x) {
      const rs = String(x.r || ''), n = Number(x.n) || 0, corr = rs.startsWith('Zurückgenommen') || rs === 'Von Hand (Eltern)', refund = rs.startsWith('↩️');
      const rec = { ...cur };
      if (n) {
        const before = cur.points || 0, after = x.ng ? before + n : Math.max(0, before + n), applied = after - before;
        const entry = { d: x.d, t: x.t, n: applied, r: rs };
        if (applied !== n) entry.w = n;
        const earn = refund ? 0 : n > 0 || corr ? applied : 0;
        const base = cur.total !== undefined ? cur.total : before;
        rec.points = after; rec.total = Math.max(0, base + earn);
        rec.ledger = [entry, ...(cur.ledger || [])].slice(0, 150);
        rec.wk = this._wkAdd(cur.wk, entry);
      }
      const o = x.o || {};
      Object.entries(o.inc || {}).forEach(([f, v]) => { rec[f] = Math.max(0, (Number(rec[f]) || 0) + v); });
      Object.entries(o.max || {}).forEach(([f, v]) => { rec[f] = Math.max(Number(rec[f]) || 0, v); });
      (o.push || []).forEach(([f, v, cap]) => {
        if (f === 'vouch' && v && (rec.vgone || []).includes(v.id)) return; // schon eingelöst – kommt nie wieder (auch wenn eine Buchung verspätet ankommt)
        rec[f] = [v, ...(Array.isArray(rec[f]) ? rec[f] : [])].slice(0, cap);
      });
      if (o.red) { const [rid, d, mon] = o.red; rec.red = { ...(rec.red || {}), [rid]: [...(((rec.red || {})[rid]) || []).filter((z) => z >= mon), d] }; }
      if (o.ungoal && rec.goal === o.ungoal) rec.goal = '';
      if (o.unvouch) {
        if (Array.isArray(rec.vouch)) rec.vouch = rec.vouch.filter((v) => v && v.id !== o.unvouch);
        rec.vgone = [o.unvouch, ...(rec.vgone || []).filter((v) => v !== o.unvouch)].slice(0, 50);
      }
      if (o.adv) {
        const a = o.adv;
        if ((a.ap || []).length) rec.ap = (rec.ap || []).filter((v) => !a.ap.includes(v));
        if ((a.v || []).length && Array.isArray(rec.vouch)) rec.vouch = rec.vouch.filter((v) => v && !a.v.includes(v.id));
        if ((a.h || []).length && Array.isArray(rec.history)) {
          const h = [...rec.history];
          a.h.forEach((t) => { const i = h.findIndex((e) => e && e.t === t && !e.c); if (i >= 0) h.splice(i, 1); });
          rec.history = h;
        }
      }
      if (x.id) rec.ap = [x.id, ...(rec.ap || [])].slice(0, 400);
      return rec;
    }
    // Kind + noch nicht zusammengeführte Buchungen (in Zeitfolge)
    _kidDerive(k, pts) {
      if (!k) return k;
      const ap = new Set(k.ap || []);
      const list = Object.values(pts || this._db.pt || {}).filter((x) => x.k === k.id && x.id && !ap.has(x.id)).sort((a, b) => (a.ts - b.ts) || String(a.id).localeCompare(String(b.id)));
      return list.length ? this._clean('kid', list.reduce((r, x) => this._applyDelta(r, x), k)) : k;
    }
    // Offene Buchungen in die Kinder übernehmen (nur ältere als 5 s, damit alle Geräte sie schon kennen)
    _consCheck() {
      const now = Date.now();
      // ⏰ Buchungen mit Zeitstempel in der Zukunft (Uhr am Gerät falsch gestellt) gleich mit zusammenführen – sonst blieben sie bis zu diesem Datum liegen
      const due = Object.values(this._db.pt).some((x) => (now - (x.ts || 0) > 5000 || (x.ts || 0) - now > 120000) && this._stored.has(`kp|pt|${x.id}`));
      if (!due || this._consBusy || window.__kpCons) return;
      this._consBusy = true; window.__kpCons = true;
      this._enq(async () => {
        try {
          const tq = Date.now(); // Zeitpunkt der Anfrage – dauert es bis zum Schreiben zu lange, wird frisch gelesen
          const r = await this._hass.callWS({ type: 'todo/item/list', entity_id: this._config.storage });
          const items = (r && r.items) || [], t0 = Date.now();
          const ds = items.filter((it) => String(it.summary || '').startsWith('kp|pt|')).map((it) => {
            let o = null; try { o = JSON.parse(it.description || '{}'); } catch (e) { o = null; }
            return o && typeof o === 'object' ? { ...this._ptClean(o), id: it.summary.slice(6), key: it.summary } : { id: it.summary.slice(6), key: it.summary, bad: true };
          });
          const ready = ds.filter((x) => x.bad || t0 - (x.ts || 0) > 5000 || (x.ts || 0) - t0 > 120000);
          const byKid = {};
          ready.forEach((x) => { (byKid[x.k || ''] = byKid[x.k || ''] || []).push(x); });
          for (const kid of Object.keys(byKid)) {
            const list = byKid[kid].filter((x) => !x.bad).sort((a, b) => (a.ts - b.ts) || String(a.id).localeCompare(String(b.id)));
            // Kind unmittelbar vor dem Schreiben frisch lesen: Lag dazwischen eine Pause (z. B. Handy im Standby) oder hat ein anderes
            // Gerät inzwischen zusammengeführt, würde sonst ein veralteter Stand zurückgeschrieben – erledigte Gutscheine o. Ä. kämen wieder
            let fresh = items, tr = tq, ok = true, done = !(kid && list.length);
            if (kid && list.length) {
              for (let i = 0; i < 3; i++) {
                if (Date.now() - tr > 1500) { tr = Date.now(); const r2 = await this._hass.callWS({ type: 'todo/item/list', entity_id: this._config.storage }); fresh = (r2 && r2.items) || []; }
                const it = fresh.find((x) => x.summary === `kp|kid|${kid}`);
                if (!it) { done = true; break; } // Kind gelöscht: Buchungen verwerfen
                let cur = {};
                try { cur = JSON.parse(it.description || '{}') || {}; } catch (e) { ok = false; break; } // Kind nicht lesbar: Buchungen bleiben liegen
                delete cur._c; delete cur.id;
                const ap = new Set(cur.ap || []);
                let rec = cur;
                list.forEach((x) => { if (!ap.has(x.id)) rec = this._applyDelta(rec, x); });
                if (rec === cur) { done = true; break; } // schon alles enthalten
                if (Date.now() - tr > 1500) continue; // zu lange gedauert – nochmal frisch lesen
                const c2 = this._clean('kid', { ...rec }); delete c2.id;
                await this._svc('update_item', { item: `kp|kid|${kid}`, description: stamp(c2) });
                done = true; break;
              }
              if (!ok || !done) continue; // nicht sicher gespeichert: Buchungen bleiben liegen und werden beim nächsten Mal verrechnet
            }
            // erst nach erfolgreichem Speichern des Kindes löschen (Kind gelöscht/defekt: Buchungen verwerfen)
            for (const x of byKid[kid]) { try { await this._svc('remove_item', { item: x.key }); } catch (e) { /* schon weg */ } this._stored.delete(x.key); }
          }
        } finally { this._consBusy = false; window.__kpCons = false; }
      });
    }

    // ---------- 📅 Spar-Prognose / 💡 Preis-Assistent ----------
    // Verdiente Sterne pro Tag (Ø der letzten 3 Wochen, frühestens ab dem 3. Tag)
    _rate(kidId) {
      const k = this._db.kid[kidId];
      if (!k) return 0;
      return this._memo('rate', kidId, () => {
        const today = dk(new Date()), from = keyAdd(today, -21);
        const led = k.ledger || [];
        const first = [k.since || '', led.length ? led[led.length - 1].d : ''].filter(Boolean).sort()[0] || today;
        const days = Math.min(21, dayNum(today) - dayNum(first > from ? first : from) + 1);
        if (days < 3) return 0;
        const sum = led.filter((x) => x.d > from && x.d <= today).reduce((a, x) => a + this._earnOf(x), 0);
        return Math.max(0, sum / days);
      });
    }
    _etaTxt(rem, rate, fam) {
      if (!(rate > 0) || rem <= 0) return '';
      const d = Math.ceil(rem / rate);
      if (d > 365) return fam ? T('📅 Bei eurem Tempo dauert es über ein Jahr.') : T('📅 Bei deinem Tempo dauert es über ein Jahr.');
      const date = keyAdd(dk(new Date()), d);
      return fam ? T('📅 Bei eurem Tempo erreicht ca. am {date} (in {n} Tagen)', { date: longDate(date), n: d }) : T('📅 Bei deinem Tempo ca. am {date} (in {n} Tagen)', { date: longDate(date), n: d });
    }
    // Sterne pro Woche: echt (wenn genug Verlauf), sonst erwartet (¾ der Pflicht-Aufgaben der nächsten 4 Wochen, mit Anwesenheit)
    _weekBudget(kidId) {
      return this._memo('budget', kidId, () => {
        const k = this._db.kid[kidId];
        if (!k) return 0;
        const led = k.ledger || [], first = [k.since || '', led.length ? led[led.length - 1].d : ''].filter(Boolean).sort()[0];
        const r = this._rate(kidId);
        if (r > 0 && first && dayNum(dk(new Date())) - dayNum(first) >= 14) return r * 7;
        const now = new Date(); let sum = 0;
        for (let i = 0; i < 28; i++) {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
          sum += this._dayTasks(kidId, d).reduce((a, t) => { const n = (t.kids || []).filter((id) => this._db.kid[id]).length || 1; return a + (Number(t.points) || 0) / ((t.rotate || this._isShared(t)) && n > 1 ? n : 1); }, 0);
        }
        return (sum / 4) * 0.75;
      });
    }
    _niceNum(v) { const x = Math.max(1, v); return x < 10 ? Math.round(x) : x < 100 ? Math.max(5, Math.round(x / 5) * 5) : Math.round(x / 10) * 10; }
    _priceSuggest(perWeek, famWeeks) {
      const kids = this._kids().map((k) => ({ k, b: this._weekBudget(k.id) })).filter((x) => x.b > 0);
      const rs = this._rewards();
      if (!kids.length || !rs.length) return null;
      const ref = kids.reduce((a, x) => (x.b < a.b ? x : a), kids[0]);
      const costs = rs.map((r) => Number(r.cost) || 0).filter((x) => x > 0).sort((a, b) => a - b);
      const med = costs[Math.floor(costs.length / 2)] || 1;
      const f = ref.b / Math.max(1, perWeek) / med;
      const per = this._cfg.costKidOn && kids.length > 1;
      const list = rs.map((r) => {
        const std = this._niceNum((Number(r.cost) || 1) * f);
        const costs2 = {};
        if (per) kids.forEach((x) => { if (!this._rwFor(r, x.k.id)) return; const v = this._niceNum(std * (x.b / ref.b)); if (Math.abs(v - std) > std * 0.1) costs2[x.k.id] = v; });
        return { r, std, costs: costs2 };
      });
      const fam = Math.round((kids.reduce((a, x) => a + x.b, 0) * Math.max(1, famWeeks)) / 100) * 100;
      return { kids, ref, list, fam, per };
    }
    _priceDlg(perWeek = 2, famWeeks = 12) {
      const sg = this._priceSuggest(perWeek, famWeeks);
      if (!sg) { this._toast(T('Erst Kinder, Pflicht-Aufgaben und Belohnungen anlegen')); return; }
      const f = this._cfg.fam;
      this._modal(T('💡 Preise vorschlagen'), `<div class="hint">${T('Sterne pro Woche (realistisch): {list}', { list: sg.kids.map((x) => `${esc(x.k.name)} ≈ ${Math.round(x.b)} ⭐`).join(' · ') })}</div>
        <div class="g2 g2e"><label>${T('Belohnungen pro Woche')}<input type="number" min="1" max="7" name="pw" value="${perWeek}"></label><label>${T('Familienziel in … Wochen')}<input type="number" min="1" max="52" name="fw" value="${famWeeks}"></label></div>
        <div class="btnrow"><button type="button" class="btn sm" data-a="pcalc">${T('🔄 Neu berechnen')}</button></div>
        <div class="lbl">${T('Vorschlag')}</div>
        ${sg.list.map((x) => `<div class="row"><span style="font-size:20px">${esc(x.r.emoji || '🎁')}</span><span class="grow">${esc(x.r.title)}${Object.keys(x.costs).length ? `<small>${Object.entries(x.costs).map(([id, v]) => `${esc((this._db.kid[id] || {}).name || '')} ${v} ⭐`).join(' · ')}</small>` : ''}</span><span class="hint">${Number(x.r.cost) || 0} →</span><span class="pts">${x.std} ⭐</span></div>`).join('')}
        ${f && f.cost && !f.reached ? `<div class="row"><span style="font-size:20px">${esc(f.emoji || '👨‍👩‍👧')}</span><span class="grow">${esc(f.title)}</span><span class="hint">${f.cost} →</span><span class="pts">${sg.fam} ⭐</span></div>` : ''}
        <div class="hint">${T('Gerechnet wird mit den echten Sternen der letzten Wochen (bei neuen Kindern mit ¾ der Pflicht-Aufgaben). Das Verhältnis der Belohnungen untereinander bleibt gleich.')}</div>`, false, {
        saveLabel: T('✓ Übernehmen'), audit: false,
        save: () => {
          sg.list.forEach((x) => { const r = this._db.reward[x.r.id]; if (!r) return; const c = { ...r, cost: x.std }; delete c.id; if (sg.per) { if (Object.keys(x.costs).length) c.costs = x.costs; else delete c.costs; } this._save('reward', x.r.id, c); });
          if (f && f.cost && !f.reached) this._setCfg({ fam: { ...f, cost: sg.fam } });
          this._audit(T('💡 Preise nach Vorschlag angepasst'));
          this._toast(T('💡 Preise übernommen'));
          return true;
        },
      });
    }

    // ---------- 🏅 Wochen-Bonus · 👫 Teambonus · 🏠 Ankunft ----------
    // null = keine Pflicht-Aufgaben an dem Tag; sonst true/false = alles geschafft?
    _dayFull(kidId, d) {
      const date = dk(d), ts = this._dayTasks(kidId, d).filter((t) => t.sched !== 'once');
      if (!ts.length) return null;
      return ts.every((t) => ['d', 'e'].includes(this._st(date, t.id, kidId)) || (this._isShared(t) && this._takenBy(t, date, kidId)));
    }
    _bonusCheck(kids) {
      const c = this._cfg, now = new Date(), today = dk(now);
      if (c.wbOn) {
        const mon = keyAdd(this._monday(), -7);
        kids.forEach((k) => {
          if (this._mark(mon, `wb:${k.id}`) || !this._once(`wb:${mon}:${k.id}`)) return;
          let days = 0, full = 0;
          for (let i = 0; i < 7; i++) {
            const key = keyAdd(mon, i);
            if (k.since && key < k.since) continue;
            const [y, m, dd] = key.split('-').map(Number), r = this._dayFull(k.id, new Date(y, m - 1, dd));
            if (r === null) continue;
            days++; if (r) full++;
          }
          const need = Math.min(7, Math.max(1, Number(c.wbDays) || 5));
          const ok = full >= need || (days >= 2 && days < need && full === days);
          this._setMark(mon, `wb:${k.id}`, ok ? '1' : '0');
          if (ok) { const n = Math.max(1, Number(c.wbPts) || 10); this._addPoints(k.id, n, '🏅 Wochen-Bonus'); this._audit(T('🏅 Wochen-Bonus: {name} (+{n} ⭐)', { name: k.name, n })); }
        });
      }
      if (c.teamOn) {
        const y = keyAdd(today, -1);
        if (!this._mark(y, 'tb') && this._once(`tb:${y}`)) {
          const [yy, mm, dd] = y.split('-').map(Number), d = new Date(yy, mm - 1, dd);
          const res = this._kids().filter((k) => !k.since || k.since <= y).map((k) => this._dayFull(k.id, d)).filter((r) => r !== null);
          const ok = res.length >= 2 && res.every(Boolean);
          this._setMark(y, 'tb', ok ? '1' : '0');
          if (ok) {
            const n = Math.max(1, Number(c.teamPts) || 5), f = c.fam;
            if (f && f.cost && !f.reached) this._familyAdd(n); else this._kids().forEach((k) => this._addPoints(k.id, n, '👫 Teambonus'));
            this._audit(T('👫 Teambonus: alle Kinder haben alles geschafft (+{n} ⭐)', { n }));
          }
        }
      }
      if (c.welcOn && c.welcPush && hhmm(now) >= '06:00') {
        this._kids().forEach((k) => {
          const a = this._arrival(k.id, today);
          if (!a || this._mark(today, `arr:${k.id}`) || !this._once(`arr:${today}:${k.id}`)) return;
          this._setMark(today, `arr:${k.id}`, '1');
          this._notify(a.at ? T('🏠 {name} kommt heute um {time} Uhr.', { name: k.name, time: a.at }) : T('🏠 {name} ist ab heute wieder da.', { name: k.name }), 'pres');
        });
      }
    }

    // ---------- 🟦 LaMetric ----------
    _lm(msg, sound) {
      const c = this._cfg;
      if (!c.lmOn || !c.lmDev || !(this._hass.services || {}).lametric) return 0;
      this._hass.callService('lametric', 'message', { device_id: c.lmDev, message: String(msg).slice(0, 120), cycles: 2, ...(sound ? { sound } : {}) }, undefined, false).catch((e) => console.warn('Yippee! LaMetric', e));
      return 1;
    }


    _familyAdd(n) {
      const f = this._cfg.fam;
      if (!f || !f.cost || f.reached) return;
      const pts = Math.max(0, (f.pts || 0) + n);
      const reached = pts >= f.cost;
      const c = { ...this._cfg, fam: { ...f, pts, reached } };
      delete c.id;
      this._save('cfg', 'main', c, (cur) => {
        const g = cur.fam;
        if (!g || !g.cost || g.reached) return cur;
        const p2 = Math.max(0, (g.pts || 0) + n);
        return { ...cur, fam: { ...g, pts: p2, reached: p2 >= g.cost } };
      });
      if (reached) {
        this._celebrate(f.emoji || '👨‍👩‍👧', T('Familienziel erreicht!'), T('{title} – gemeinsam geschafft!', { title: f.title }));
        this._notify(T('👨‍👩‍👧 Familienziel erreicht: {title} ({cost} ⭐ gemeinsam gesammelt)!', { title: f.title, cost: f.cost }), 'reward');
      }
    }

    // Familienziel nur einmal pro Seite: bei mehreren Kinder-Karten zeigt es die „Alle Kinder“-Karte bzw. die erste
    _famShown() {
      const f = this._config.family;
      if (f === false) return false;
      if (f === true) return true;
      const list = (window.__kpCards || []).filter((c) => c.isConnected && c._config && c._config.storage === this._config.storage && c._config.family !== false && ['kid', 'kids'].includes(c._config.mode));
      if (list.some((c) => c._config.family === true)) return false;
      const owner = list.find((c) => c._config.mode === 'kids') || list[0];
      return !owner || owner === this;
    }

    _famSync() { clearTimeout(window.__kpFamT); window.__kpFamT = setTimeout(() => (window.__kpCards || []).forEach((c) => c._render && c._render()), 50); }

    // Familienziel-Karte über den Kindern: in der kompakten Ansicht steckt es als Knopf im Kopf jedes Kindes –
    // bei „eingeklappt“ (collapsed) gibt es diese Knöpfe nicht, dort bleibt die Karte oben stehen.
    _famTop() { return this._famShown() && (this._kView() !== 'compact' || !!this._config.collapsed); }

    _familyHtml() {
      const f = this._cfg.fam;
      if (!f || !f.cost) return '';
      const pts = Math.min(f.pts || 0, f.cost), pct = Math.round((pts / f.cost) * 100);
      const y = keyAdd(dk(new Date()), -1);
      const rate = this._cfg.progOn && !f.reached ? this._kids().reduce((a, k) => a + this._rate(k.id), 0) : 0;
      const eta = rate ? this._etaTxt(f.cost - (f.pts || 0), rate, true) : '';
      return `<div class="card fam"><div class="famh"><span class="fe">${esc(f.emoji || '👨‍👩‍👧')}</span><div class="kgrow"><div class="hint">${T('👨‍👩‍👧 Unser Familienziel')}</div><div class="ft">${esc(f.title)}</div></div><span class="pts">${pts}/${f.cost} ⭐</span></div>
        <div class="bar big"><i style="width:${pct}%"></i></div>${eta ? `<div class="hint">${eta}</div>` : ''}${this._cfg.teamOn && this._mark(y, 'tb') === '1' ? `<div class="hint">${T('👫 Teambonus gestern: alle haben alles geschafft!')}</div>` : ''}${f.reached ? `<div class="trophy">${T('🎉 Geschafft! Mama und Papa lösen es ein.')}</div>` : ''}</div>`;
    }

    _markDone(date, tid, kidId, e) {
      const t = this._db.task[tid];
      if (!t) return;
      if (t.sched === 'once' && t.done && t.done.kid && t.done.kid !== kidId) { this._toast(T('Diese Sonderaufgabe ist schon erledigt')); return; }
      const st = this._st(date, tid, kidId);
      const xp = this._mark(date, `xp:${tid}:${kidId}`);
      const mf = this._mult(date, kidId);
      // 🦷 Zahnputz-Aufgabe: mit Timer (oder „auch ohne Timer“) gelten die Sterne aus 🦷 Zähne – gemerkt fürs Zurücknehmen
      const zb = this._zLinked(t) ? this._zPts(t, kidId, !!this._mark(date, `zt:${tid}:${kidId}`)) : null;
      const pts = (zb !== null ? zb : (Number(t.points) || 0)) * mf, back = st === 'x' ? (xp !== '' ? Number(xp) || 0 : Number(t.penalty) || 0) : 0;
      this._setSt(date, tid, kidId, 'd');
      if (zb !== null && zb !== (Number(t.points) || 0)) this._setMark(date, `zp:${tid}:${kidId}`, String(zb));
      else if (zb !== null && this._mark(date, `zp:${tid}:${kidId}`) !== '') this._setMark(date, `zp:${tid}:${kidId}`, ''); // alte Marke von einem zurückgenommenen Putzen
      if (t.sched === 'once') this._save('task', tid, { ...t, done: { kid: kidId, d: date } });
      const sk = this._streak(t, kidId, date);
      const extra = { inc: { doneCount: 1, ...(t.sched === 'once' ? { onceCount: 1 } : {}) }, max: { best: sk } };
      this._addPoints(kidId, pts, `${t.emoji || '⭐'} ${t.title}${t.sched === 'once' ? ' ⚡' : ''}${mf > 1 ? ` ×${mf}` : ''}${back ? ' (verpasst → doch erledigt)' : ''}`, extra);
      if (back) { this._addPoints(kidId, back, `↩️ Minuspunkte erstattet: ${t.title}`); this._setMark(date, `xp:${tid}:${kidId}`, ''); }
      if (e) this._pop(e, `+${pts + back} ⭐`);
      this._streakBonus(date, t, kidId);
      if (this._cfg.lmOn && date === dk(new Date())) {
        const kk = this._db.kid[kidId] || {}, list = this._todayTasks(kidId).filter((x) => this._req(x) && this._status(x, kidId).s !== 'taken');
        if (list.length > 1 && list.every((x) => this._status(x, kidId).s === 'd') && !this._mark(date, `lma:${kidId}`)) { this._setMark(date, `lma:${kidId}`, '1'); this._lm(T('🏆 {name}: alles geschafft!', { name: kk.name }), 'win'); }
        else if (pts) this._lm(`⭐ ${kk.name} +${pts} (${kk.points || 0})`, 'positive1');
      }
    }

    // 🦷 Buchungsnummer des Serien-Bonus; nach jedem Zurücknehmen eine neue (Marke zbu), sonst würde der Bonus beim erneuten Putzen nicht mehr gebucht
    _zBonusId(date, kidId) { const u = Number(this._mark(date, `zbu:${kidId}`)) || 0; return `zb${date.replace(/-/g, '')}${u ? `r${u}` : ''}${kidId}`.slice(0, 40); }

    // 🦷 Ein einzelnes Putzen zurücknehmen (z. B. Timer nur ablaufen lassen): Timer-Marke, Zähler, Bild dieses Putzens,
    // Serien-Tag und ein an dem Tag gebuchter Serien-Bonus gehen mit zurück. Die Sterne der Aufgabe nimmt _markUndone zurück.
    _zUndo(date, tid, kidId) {
      if (!this._mark(date, `zt:${tid}:${kidId}`)) return false;
      this._setMark(date, `zt:${tid}:${kidId}`, '');
      const z0 = this._db.zk[kidId] || {};
      const img = z0.td && z0.td.d === date && z0.td.m ? z0.td.m[tid] : '';
      const days = (a, b) => { const p = (x) => { const [y, m, d] = x.split('-').map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((p(b) - p(a)) / 864e5); };
      const sn0 = Math.max(0, Number(z0.sn) || 0), gap = z0.sd && /^\d{4}-\d\d-\d\d$/.test(z0.sd) ? days(date, z0.sd) : -1;
      const counted = sn0 > 0 && gap >= 0 && gap < sn0; // der Tag zählte zur laufenden Serie
      const upd = (x) => {
        const o = { ...x, n: Math.max(0, (Number(x.n) || 0) - 1) };
        if (x.td && x.td.d === date) {
          const wasNew = !Array.isArray(x.td.nw) || x.td.nw.includes(img);
          const m = { ...(x.td.m || {}) }; delete m[tid];
          o.td = { ...x.td, m, l: (x.td.l || []).filter((y) => y !== img), ...(Array.isArray(x.td.nw) ? { nw: x.td.nw.filter((y) => y !== img) } : {}) };
          if (img && wasNew && !Object.values(m).includes(img)) o.seen = (x.seen || []).filter((y) => y !== img);
          if (x.cur && x.cur.d === date && x.cur.t === tid) delete o.cur;
        }
        if (counted) {
          if (gap === 0) { const sn = sn0 - 1; o.sn = sn; if (sn > 0) o.sd = keyAdd(date, -1); else delete o.sd; }
          else o.sn = gap; // Tag mitten in der Serie: es zählen nur noch die Tage danach
        }
        return o;
      };
      this._save('zk', kidId, upd(z0), upd);
      if (counted) {
        const id = this._zBonusId(date, kidId), k = this._db.kid[kidId] || {}, pt = this._db.pt[id];
        if (pt || (k.ap || []).includes(id)) {
          const b = pt && Number(pt.n) ? Number(pt.n) : Math.max(0, Number(this._zc().bonus) || 0);
          if (b) this._addPoints(kidId, -b, `Zurückgenommen: ${T('🦷 Zahnputz-Serie: {n} Tage', { n: sn0 - gap })}`);
          this._setMark(date, `zbu:${kidId}`, String((Number(this._mark(date, `zbu:${kidId}`)) || 0) + 1));
        }
      }
      return true;
    }

    _markUndone(date, tid, kidId) {
      const t = this._db.task[tid];
      if (!t) return;
      const zr = this._zUndo(date, tid, kidId);
      // Routine mit Zahnputz-Schritten: das Putzen dieser Schritte geht mit zurück, die Schritte sind wieder offen
      if (this._routine(t)) {
        const zi = t.steps.map((x, i) => ((x.tid ? this._zUndo(date, x.tid, kidId) : zr && this._zStepOn(x)) ? i : -1)).filter((i) => i >= 0);
        if (zi.length) this._setMark(date, `rs:${tid}:${kidId}`, this._routDone(date, tid, kidId, t.steps.length).filter((i) => !zi.includes(i)).join(','));
      }
      if (this._st(date, tid, kidId) !== 'd') { this._setSt(date, tid, kidId, ''); return; }
      const zp = this._mark(date, `zp:${tid}:${kidId}`), base = zp !== '' && Number.isFinite(Number(zp)) ? Number(zp) : (Number(t.points) || 0);
      this._setSt(date, tid, kidId, '');
      if (t.sched === 'once') { const c = { ...t }; delete c.done; this._save('task', tid, c); }
      this._addPoints(kidId, -base * this._mult(date, kidId), `Zurückgenommen: ${t.emoji || '⭐'} ${t.title}`, { inc: { doneCount: -1 } });
      const bk = `b:${tid}:${kidId}`;
      const b = Number(this._mark(date, bk)) || 0;
      if (b) { this._setMark(date, bk, ''); this._addPoints(kidId, -b, `Zurückgenommen: 🔥 Serien-Bonus ${t.title}`); }
    }

    // kind: 'task' | 'reward' | 'miss' | 'test'
    // kind: 'task' | 'reward' | 'miss' | 'weekly' | 'test' · acts: [[Knopf-Text, Code], …]
    _notify(msg, kind, acts, photo, opt) {
      const c = this._cfg;
      if (photo && !MEDIA_RX.test(String(photo))) photo = ''; // Listen-Fotos haben keine Datei – nur in der Karte zu sehen
      if (kind === 'task' && !c.nTask) return 0;
      if (kind === 'reward' && !c.nReward) return 0;
      if (kind === 'miss' && !c.nMiss) return 0;
      const avail = (this._hass.services && this._hass.services.notify) || {};
      const list = c.targets.filter((t) => (t.includes('.') ? !!this._hass.states[t] : !!avail[t])).filter((t) => !(opt && opt.to) || opt.to.includes(t));
      const tgKb = acts && acts.length && c.nActions !== false ? [acts.map(([title, action]) => `${String(title).replace(/[:,]/g, '')}:/${action}`).join(', ')] : null;
      let title = { weekly: T('📊 Yippee! - Kids Chores – Wochenrückblick'), daily: T('🌙 Yippee! - Kids Chores – Tagesabschluss') }[kind] || T('⭐ Yippee! - Kids Chores');
      if (opt && opt.title) title = opt.title;
      const msg0 = msg;
      list.forEach((t) => {
        const tgT = (c.tgTargets || []).includes(t) || (t.includes('.') ? this._isTg(t) : /telegram/i.test(t));
        // Telegram liest Nachrichten als Markdown – Sonderzeichen in Namen/Titeln entschärfen
        const m = tgT ? mdEsc(msg0) : msg0;
        if (t.includes('.')) {
          // Benachrichtigungs-Entität (z. B. Telegram-Chat): mit Knöpfen/Foto über telegram_bot, sonst / im Fehlerfall als normaler Text
          const plain = () => this._hass.callService('notify', 'send_message', { title, message: m }, { entity_id: t }, false).catch((e) => console.warn('Yippee! - Kids Chores notify', t, e));
          const isTg = ((c.tgTargets || []).includes(t) || this._isTg(t)) && this._hass.services.telegram_bot;
          const text = () => (tgKb && (c.tgTargets || []).includes(t) && isTg
            ? this._tgKb(t, { title, message: m, inline_keyboard: tgKb }, msg0).catch(plain)
            : plain());
          if (photo && isTg) {
            this._hass.callService('telegram_bot', 'send_photo', { file: `/media/${photo}`, caption: m, ...(tgKb && (c.tgTargets || []).includes(t) ? { inline_keyboard: tgKb } : {}) }, { entity_id: t }, false).catch(text);
          } else text();
          return;
        }
        const data = { title, message: m };
        const tag = acts && acts.length && t.startsWith('mobile_app_') ? pushTag(acts[0][1]) : '';
        if (tag) data.data = { tag }; // erledigt → auf allen Handys entfernen (siehe _pushClear)
        if (acts && acts.length && c.nActions !== false) {
          if (t.startsWith('mobile_app_')) data.data = { ...(data.data || {}), actions: acts.map(([title, action]) => ({ action, title })) };
          else if ((c.tgTargets || []).includes(t)) data.data = { inline_keyboard: tgKb };
        }
        if (photo) {
          if (t.startsWith('mobile_app_')) data.data = { ...(data.data || {}), image: `/media/local/${photo}` };
          else if ((c.tgTargets || []).includes(t)) data.data = { ...(data.data || {}), photo: { file: `/media/${photo}`, caption: m } };
        }
        this._hass.callService('notify', t, data, undefined, false).catch((e) => console.warn('Yippee! - Kids Chores notify', t, e));
      });
      return list.length;
    }

    // Telegram mit Knöpfen: klappt es nicht (z. B. Sonderzeichen), nochmal als reiner Text – Fehler merken und in den Einstellungen anzeigen
    _tgKb(t, data, raw) {
      const call = (d) => this._hass.callService('telegram_bot', 'send_message', d, { entity_id: t }, false);
      return call(data)
        .catch(() => call({ ...data, message: raw, parse_mode: 'plain_text' }))
        .then((r) => { if (this._tgErr) { this._tgErr = ''; this._render(); } return r; })
        .catch((e) => { this._tgErr = String((e && (e.message || e.code)) || e); this._render(); throw e; });
    }

    async _tgTest() {
      const c = this._cfg, tgs = (c.tgTargets || []).filter((t) => c.targets.includes(t));
      if (!tgs.length) { this._toast(T('Bei keinem Telegram-Chat ist „📨 Freigabe-Knöpfe mitsenden“ angehakt.')); return; }
      const kb = [`${T('✓ Erledigt').replace(/[:,]/g, '')}:/KP|test`];
      const msg = T('👋 Test: So sehen die Freigabe-Knöpfe aus.');
      let ok = 0, err = '';
      for (const t of tgs) {
        try {
          if (t.includes('.')) {
            if (!this._hass.services.telegram_bot) throw new Error(T('Telegram-Bot-Integration nicht gefunden'));
            await this._tgKb(t, { title: T('⭐ Yippee! - Kids Chores'), message: mdEsc(msg), inline_keyboard: kb }, msg);
          } else await this._hass.callService('notify', t, { title: T('⭐ Yippee! - Kids Chores'), message: mdEsc(msg), data: { inline_keyboard: kb } }, undefined, false);
          ok++;
        } catch (e) { err = String((e && (e.message || e.code)) || e); }
      }
      this._toast(err ? T('⚠️ Telegram-Knöpfe: {err}', { err }) : T('📨 Test mit Knöpfen an {n} Chat(s) gesendet', { n: ok }));
    }

    // Knöpfe aus Push-Nachrichten: eine HA-Automation legt "kp|act|…" in die Liste, die Karte führt es aus
    _scheduleActs() {
      if (!Object.keys(this._db.act).length || this._actT) return;
      this._actT = setTimeout(() => { this._actT = null; this._processActs(); }, 500 + Math.random() * 2500);
    }

    async _processActs() {
      window.__kpActs = window.__kpActs || new Set();
      let any = false;
      for (const a of Object.values(this._db.act)) {
        const key = `kp|act|${a.id}`;
        if (!this._db.act[a.id] || window.__kpActs.has(key)) continue;
        window.__kpActs.add(key);
        delete this._db.act[a.id];
        try { await this._svc('remove_item', { item: key }); }
        catch (e) { continue; } // eine andere Karte / ein anderes Gerät war schneller
        this._stored.delete(key);
        any = true;
        const [kp, op, x1, x2, x3] = String(a.a || '').split('|');
        this._actSrc = a.u ? `${this._userName(a.u) || '?'} (${T('Knopf')})` : T('Knopf in Push/Telegram');
        if (kp === 'KP' && op === 'nfc') { this._actUser = a.u || ''; const sec = /^\d{14}$/.test(String(a.id)) ? Number(String(a.id).slice(0, 10)) : 0; try { this._nfcTap(x1, a.u || '', sec ? new Date(sec * 1000) : null); } finally { this._actSrc = ''; this._actUser = ''; } continue; }
        if (kp === 'KP' && a.u && !this._isParent(a.u)) { this._audit(T('⛔ Knopf von {user} ignoriert – nicht als Eltern eingetragen', { user: this._userName(a.u) || a.u })); this._btnLog(a, op, 'np'); this._actSrc = ''; continue; }
        const valid = kp === 'KP' && this._actValid(op, x1, x2, x3);
        try { this._actRun(kp, op, x1, x2, x3); } finally { this._actSrc = ''; }
        if (kp === 'KP') this._btnLog(a, op, valid ? 'ok' : 'gone');
      }
      if (any) this._render();
    }

    // Kann der Knopf noch etwas bewirken? (sonst wurde schon in der Karte entschieden)
    _actValid(op, x1, x2, x3) {
      if (op === 'ok' || op === 'no') return this._st(x1, x2, x3) === 'p';
      if (op === 'rok' || op === 'rno') return !!this._db.req[x1];
      if (op === 'gok' || op === 'gno') return !!(this._db.req[x1] && this._db.req[x1].grade);
      if (op === 'me' || op === 'mx' || op === 'md') { const st = this._st(x1, x2, x3); return !st || st === 'm'; }
      if (op === 'pts') return !!this._kidRef(x1) && Number.isFinite(Number(x2)) && Number(x2) !== 0;
      return true;
    }

    // ✓ Letzter Knopf aus Push/Telegram – zur Kontrolle unter ⚙️ → ✓ Knöpfe & Telegram-Befehle
    _btnLog(a, op, res) {
      const sec = /^\d{14}$/.test(String(a.id)) ? Number(String(a.id).slice(0, 10)) : 0;
      this._setCfg({ btnLast: { ts: sec ? sec * 1000 : Date.now(), u: String(a.u || '').slice(0, 64), op: String(op || '').slice(0, 8), r: res } });
    }



    _kidRef(x) { const v = String(x || '').trim().toLowerCase(); return v ? this._kids().find((k) => k.id.toLowerCase() === v || String(k.name).trim().toLowerCase() === v) || null : null; }

    _actRun(kp, op, x1, x2, x3) {
      if (kp === 'KPC') { if (this._cfg.cmdOn && !this._bgActive()) this._tgReply(this._cmdText(op)); return; }
      if (kp !== 'KP') return;
      if (op === 'ok' && this._st(x1, x2, x3) === 'p') { this._markDone(x1, x2, x3); this._photoDone(x1, x2, x3); this._audTask('ok', x2, x3); }
      else if (op === 'no' && this._st(x1, x2, x3) === 'p') { this._setSt(x1, x2, x3, ''); this._photoDone(x1, x2, x3); this._audTask('no', x2, x3); }
      else if (op === 'rok' && this._db.req[x1]) { const q = this._db.req[x1]; this._redeem(q.kid, q.reward, q.id); }
      else if (op === 'rno' && this._db.req[x1]) { if (this._db.req[x1].pool) this._shareCancel(x1); else { this._audReq(x1, false); this._del('req', x1); } }
      else if (op === 'gok' && this._db.req[x1] && this._db.req[x1].grade) { const q = this._db.req[x1]; this._gradeBook(q.kid, q.grade, q.id, null); }
      else if (op === 'gno' && this._db.req[x1] && this._db.req[x1].grade) this._gradeReject(x1);
      else if (op === 'pts') {
        // 🤖 Sterne aus Automationen/Skripten/Sprachassistenten: KP|pts|<Kind (Name oder ID)>|<±Anzahl>|<Grund>
        const k = this._kidRef(x1), n = Math.round(Number(x2));
        if (!k || !Number.isFinite(n) || !n) return;
        const m = Math.max(-100, Math.min(100, n)), why = String(x3 || '').trim().slice(0, 60);
        this._addPoints(k.id, m, `🤖 ${why || 'Automation'}`);
        this._audit(T('🤖 Sterne per Automation: {name} {n} ⭐', { name: k.name, n: m > 0 ? `+${m}` : `−${-m}` }));
      }
      else if (op === 'me' || op === 'mx' || op === 'md') {
        const t = this._db.task[x2];
        if (t && !this._st(x1, x2, x3) && Number(t.penalty) && x1 <= dk(new Date())) this._setSt(x1, x2, x3, 'm');
        this._decide(x1, x2, x3, op.slice(1), null);
      }
    }

    // 🏷️ NFC-Tag gescannt: passende offene Aufgabe von heute finden und wie ein Antippen des Kindes behandeln
    _nfcTap(tag, user, at) {
      if (!this._cfg.nfcOn || !tag) return;
      const now = new Date();
      // Scan-Zeit aus der Automation (falls die Karte erst später geöffnet wurde): Zeitfenster gilt zum Zeitpunkt des Scans
      const when = at && at <= now && now - at < 36 * 3600e3 ? at : now;
      const today = dk(now);
      const hm = hhmm(when);
      const res = (ok, msg) => {
        this._audit(msg);
        this._setCfg({ nfcLast: { ts: when.getTime(), ok: !!ok, msg: String(msg).slice(0, 200) } });
      };
      if (dk(when) !== today) { res(false, T('🏷️ NFC-Scan von {date} {time} kam zu spät an – an dem Tag war keine Karte geöffnet', { date: dk(when), time: hm })); return; }
      const tasks = Object.values(this._db.task).filter((t) => t.nfc === tag && !(Array.isArray(t.slots) && t.slots.length > 1 && !t.virtual));
      if (!tasks.length) { res(false, T('🏷️ NFC-Tag {tag} gescannt – keine Aufgabe hat diesen Tag', { tag: String(tag).slice(0, 40) })); return; }
      const cand = [], why = [];
      tasks.forEach((t) => {
        (t.kids || []).forEach((kid) => {
          const k = this._db.kid[kid];
          if (!k) return;
          if (!this._todayTasks(kid).some((x) => x.id === t.id)) { why.push(T('{title}: heute nicht für {name} dran', { title: t.title, name: k.name })); return; }
          const st = this._status(t, kid);
          if (st.s) { why.push(T('{title}: bei {name} schon abgehakt', { title: t.title, name: k.name })); return; }
          if (t.from && hm < t.from) { why.push(T('{title}: erst ab {time} Uhr', { title: t.title, time: t.from })); return; }
          if (this._winTo(t) && hm > this._winTo(t)) { why.push(T('{title}: Zeit war vorbei (bis {time} Uhr)', { title: t.title, time: this._winTo(t) })); return; }
          cand.push({ t, k });
        });
      });
      const mine = cand.filter((c) => user && c.k.user === user);
      const pick = mine.length ? mine : [...new Set(cand.map((c) => c.k.id))].length === 1 ? cand : [];
      if (!pick.length) {
        if (cand.length) why.push(T('mehrere Kinder möglich – beim Kind (✎) den Home-Assistant-Benutzer wählen'));
        res(false, `${T('🏷️ NFC-Tag gescannt – nichts abgehakt')}: ${[...new Set(why)].join(' · ')}`);
        return;
      }
      const { t, k } = pick[0];
      this._actSrc = `${k.name} (🏷️ NFC)`;
      if (this._approval) {
        this._setSt(today, t.id, k.id, 'p');
        this._notify(T('✅ {name} hat „{title}“ erledigt – bitte freigeben.', { name: k.name, title: t.title }), 'task',
          [[T('✓ Freigeben'), `KP|ok|${today}|${t.id}|${k.id}`], [T('✕ Ablehnen'), `KP|no|${today}|${t.id}|${k.id}`]]);
      } else this._markDone(today, t.id, k.id);
      res(true, this._approval ? T('🏷️ NFC: {name} – {title} (wartet auf Freigabe)', { name: k.name, title: t.title }) : T('🏷️ NFC: {name} – {title}', { name: k.name, title: t.title }));
    }

    _audTask(how, tid, kidId) {
      const t = this._db.task[tid], k = this._db.kid[kidId];
      if (!t || !k) return;
      this._audit(how === 'ok' ? T('✓ Freigegeben: {name} – {title}', { name: k.name, title: t.title }) : T('✕ Abgelehnt: {name} – {title}', { name: k.name, title: t.title }));
    }
    _audReq(qid, ok) {
      const q = this._db.req[qid]; if (!q) return;
      const k = this._db.kid[q.kid] || {}, r = q.wish || this._db.reward[q.reward] || {};
      if (!ok) this._audit(T('✕ Wunsch/Einlösung abgelehnt: {name} – {title}', { name: k.name || '?', title: r.title || '?' }));
    }

    // ---------- Wochenrückblick ----------
    _weekStats(k, back = 0) {
      const now = new Date();
      const mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) - back * 7);
      const from = dk(mon), sun = dk(new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6));
      let plus = 0, spent = 0, minus = 0, done = 0, due = 0;
      (k.ledger || []).forEach((x) => {
        if (x.d < from || x.d > sun) return;
        const r = String(x.r || ''), corr = r.startsWith('Zurückgenommen') || r === 'Von Hand (Eltern)';
        // verdient = Plus-Buchungen abzüglich Korrekturen (Eltern −, Zurücknehmen, Level-Korrektur)
        const ea = this._earnOf(x), sp = this._spendOf(x);
        if (sp) spent += sp; // Belohnungen, Auszahlungen, Anteile und Einladungen (zurückgezahlte Anteile ziehen wieder ab)
        else if (r.startsWith('↩️')) minus -= x.n; // erstattete Minuspunkte heben das Minus wieder auf
        else if (ea || x.e !== undefined || x.n > 0 || corr) plus += ea;
        else minus -= x.n;
      });
      // Verlauf reicht nicht bis zum Wochenanfang zurück (max. 150 Buchungen)? Dann die gespeicherte Wochensumme nehmen
      const led = k.ledger || [];
      if (k.wk && k.wk[from] !== undefined && (led.length >= 150 && led[led.length - 1].d > from)) plus = k.wk[from];
      // Mehr als insgesamt verdient (Level-Stand) kann es in einer Woche nicht geben – fängt alte Test-Buchungen ab
      plus = Math.max(0, Math.min(plus, k.total !== undefined ? k.total : (k.points || 0)));
      // Erst ab dem ersten Tag zählen, an dem die Karte benutzt wurde (bzw. das Kind angelegt wurde)
      const first = [Object.keys(this._db.log).sort()[0] || dk(now), k.since || ''].sort().pop();
      for (let i = 0; i < 7; i++) {
        const d = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);
        if (dk(d) > dk(now)) break;
        if (dk(d) < first) continue;
        Object.values(this._db.task).forEach((t) => {
          if (!this._isFor(t, k.id, d) || this._isExtra(t) || (this._isShared(t) && this._takenBy(t, dk(d), k.id))) return;
          if (t.created && dk(d) < t.created) return;
          const st = this._st(dk(d), t.id, k.id);
          // heute zählt nur, was schon erledigt/gemeldet ist oder dessen Zeitfenster vorbei ist – sonst wäre die Quote mitten in der Woche zu schlecht
          if (dk(d) === dk(now) && !st && this._win(t) !== 'after') return;
          due++;
          if (st === 'd') done++;
        });
      }
      minus = Math.max(0, minus);
      return { plus, spent, minus, done, due, mon };
    }

    _sendWeekly() {
      let n = 0;
      this._weeklyMsgs(!!this._cfg.wSplit).forEach(([title, txt]) => { n = Math.max(n, this._notify(txt, 'weekly', null, '', { title, to: this._repTo('wTo') })); });
      return n;
    }

    _weeklyCheck() {
      const c = this._cfg;
      if (c.nWeekly === false || !c.targets.length) return;
      const now = new Date();
      const wd = Number.isInteger(Number(c.wDay)) && c.wDay !== '' && c.wDay !== undefined ? Number(c.wDay) % 7 : 0;
      const wt = /^\d\d:\d\d$/.test(String(c.wTime || '')) ? c.wTime : '19:00';
      if (now.getDay() !== wd || hhmm(now) < wt) return;
      const today = dk(now);
      if (c.lastWeekly === today) return;
      this._setCfg({ lastWeekly: today });
      this._sendWeekly();
    }

    // ---------- 📊 Berichte: eingefrorene Tages-Schnappschüsse ----------
    // [erledigt, fällig, Sterne verdient, eingelöst, wartet, Zusatz/Sonder] – Pflicht-Aufgaben wie im Tagesabschluss
    _daySnap(k, date) {
      const [y, m, d] = date.split('-').map(Number), day = new Date(y, m - 1, d);
      let due = 0, done = 0, wait = 0, extra = 0;
      Object.values(this._db.task).forEach((t) => {
        if (!(t.kids || []).includes(k.id)) return;
        if (t.sched === 'once') { const o = this._onceState(t); if (o && o.st === 'd' && o.kid === k.id && o.date === date) extra++; return; }
        if (!this._isFor(t, k.id, day) || (t.created && date < t.created)) return;
        const st = this._st(date, t.id, k.id);
        if (this._isExtra(t)) { if (st === 'd') extra++; return; }
        if (this._isShared(t) && this._takenBy(t, date, k.id)) return;
        due++;
        if (st === 'd') done++; else if (st === 'p') wait++;
      });
      let plus = 0, spent = 0;
      (k.ledger || []).forEach((x) => { if (x.d !== date) return; const sp = this._spendOf(x); if (sp) spent += sp; else plus += this._earnOf(x); });
      return [done, due, Math.max(0, plus), Math.max(0, spent), wait, extra];
    }

    _monOf(date) { const [y, m, d] = date.split('-').map(Number), dt = new Date(y, m - 1, d); return dk(new Date(y, m - 1, d - ((dt.getDay() + 6) % 7))); }

    // Nach jedem Tag einmal speichern (60 Tage, 52 Wochen) – fehlende Tage der letzten Woche werden nachgeholt, aber nie vor dem Update
    _repCheck() {
      const c = this._cfg, today = dk(new Date());
      if (!c.rStart) { if (this._isParent() && !['kid', 'kids', 'advent'].includes(this._config.mode)) this._setCfg({ rStart: today }); return; }
      this._repDone = this._repDone || new Set();
      this._kids().forEach((k) => {
        for (let back = 7; back >= 1; back--) {
          const dt = new Date(); dt.setDate(dt.getDate() - back);
          const date = dk(dt), key = `${k.id}|${date}`;
          if (date < c.rStart || (k.since && date < k.since) || (k.rd && k.rd[date]) || this._repDone.has(key)) continue;
          this._repDone.add(key);
          const snap = this._daySnap(k, date);
          const upd = (o) => {
            const rd = { ...(o.rd || {}) }, rw = { ...(o.rw || {}) };
            if (rd[date]) return { ...o };
            rd[date] = snap;
            const mon = this._monOf(date), w = rw[mon] || [0, 0, 0, 0];
            rw[mon] = [w[0] + snap[0], w[1] + snap[1], w[2] + snap[2], w[3] + snap[3]];
            const keep = (obj, n) => { const ks = Object.keys(obj).sort(); ks.slice(0, Math.max(0, ks.length - n)).forEach((x) => delete obj[x]); return obj; };
            return { ...o, rd: keep(rd, 60), rw: keep(rw, 52) };
          };
          this._save('kid', k.id, upd(this._db.kid[k.id] || k), (cur) => upd(cur || {}));
        }
      });
    }

    // ---------- Tagesabschluss / Wochenrückblick (kompakt) ----------
    // Liefert [[Titel, Text], …] – alle Kinder in einer Nachricht oder eine pro Kind
    _dailyMsgs(split) {
      const today = dk(new Date()), c = this._cfg;
      const kids = this._kids().filter((k) => !k.since || today >= k.since);
      if (!kids.length) return [];
      const rows = kids.map((k) => {
        const [done, due, plus, , wait, extra] = this._daySnap(k, today);
        const cnt = due ? `${done}/${due}${done === due ? ' ✅' : ''}` : '–', head = `${k.emoji || ''} ${k.name} ${cnt}`;
        const open = c.dOpen ? this._todayTasks(k.id).filter((t) => this._req(t) && !this._status(t, k.id).s).map((t) => t.title) : [];
        const nt = c.negOn ? this._dayNet(k, today) : 0;
        const body = `${due ? '' : `${T('heute nichts zu tun')} · `}${c.negOn ? T('Bilanz heute: {n} ⭐', { n: nt > 0 ? `+${nt}` : nt < 0 ? `−${-nt}` : '±0' }) : T('heute +{n} ⭐', { n: plus })}${wait ? ` · ${T('⏳ {n} wartet auf Freigabe', { n: wait })}` : ''}${extra ? ` · ${extra > 1 ? T('🙋 {n} Zusatzaufgaben', { n: extra }) : T('🙋 1 Zusatzaufgabe')}` : ''} · ${T('Stand {n} ⭐', { n: k.points || 0 })}${open.length ? `\n   ${T('offen: {list}', { list: [...new Set(open)].join(', ') })}` : ''}`;
        // eine Nachricht pro Kind: der Name steht schon im Titel – alles in eine Zeile
        return { k, head, det: `${k.emoji || ''} ${k.name}: ${body}`, one: `${k.emoji || ''} ${due ? `${cnt} · ` : ''}${body}` };
      });
      if (split) return rows.map((x) => [T('🌙 {name} – Tagesabschluss', { name: x.k.name }), x.one]);
      return [[T('🌙 Yippee! - Kids Chores – Tagesabschluss'), `${rows.length > 1 ? `${rows.map((x) => x.head).join(' · ')}\n` : ''}${rows.map((x) => x.det).join('\n')}`]];
    }

    _dailyText() { return this._dailyMsgs(false).map((m) => m[1]).join('\n'); }

    _weeklyMsgs(split) {
      const kids = this._kids();
      if (!kids.length) return [];
      const sun = new Date().getDay() === 0;
      const arrow = (d, unit) => ` (${d > 0 ? '↗' : d < 0 ? '↘' : '→'} ${d > 0 ? '+' : d < 0 ? '−' : '±'}${Math.abs(d)}${unit})`;
      const rows = kids.map((k) => {
        const w = this._weekStats(k), p = this._weekStats(k, 1);
        // Trend zur Vorwoche: Quote immer (vergleichbar), Sterne nur am Sonntag (sonst wäre die laufende Woche unvollständig)
        const tq = w.due && p.due ? arrow(Math.round((w.done / w.due) * 100) - Math.round((p.done / p.due) * 100), ' %') : '';
        const ts = sun && p.due ? arrow(w.plus - p.plus, '') : '';
        const head = `${k.emoji || ''} ${k.name} ${w.due ? `${w.done}/${w.due}${tq}` : '–'}`;
        const body = `${T('+{n} ⭐ verdient', { n: w.plus })}${ts}${w.spent ? ` · ${T('🎁 {n} eingelöst', { n: w.spent })}` : ''}${w.minus ? ` · ${T('−{n} Minus', { n: w.minus })}` : ''}${this._cfg.negOn ? (() => { const nt = w.plus - w.minus; return ` · ${T('Bilanz: {n} ⭐', { n: nt > 0 ? `+${nt}` : nt < 0 ? `−${-nt}` : '±0' })}`; })() : ''} · ${T('Stand {n} ⭐', { n: k.points || 0 })}`;
        return { k, head, det: `${k.emoji || ''} ${k.name}: ${body}`, one: `${k.emoji || ''} ${w.due ? `${w.done}/${w.due} ${T('erledigt')}${tq} · ` : ''}${body}` };
      });
      if (split) return rows.map((x) => [T('📊 {name} – Wochenrückblick', { name: x.k.name }), x.one]);
      return [[T('📊 Yippee! - Kids Chores – Wochenrückblick'), `${rows.length > 1 ? `${rows.map((x) => x.head).join(' · ')}\n` : ''}${rows.map((x) => x.det).join('\n')}`]];
    }

    // Zieldienste eines Berichts: leer = alle ausgewählten Geräte
    _repTo(k) { const l = (this._cfg[k] || []).filter((t) => this._cfg.targets.includes(t)); return l.length ? l : null; }

    _sendDaily() {
      let n = 0;
      this._dailyMsgs(!!this._cfg.dSplit).forEach(([title, txt]) => { n = Math.max(n, this._notify(txt, 'daily', null, '', { title, to: this._repTo('dTo') })); });
      return n;
    }

    _dailyCheck() {
      const c = this._cfg;
      if (!c.dOn || !c.targets.length || this._bgActive()) return;
      const now = new Date(), today = dk(now);
      if (hhmm(now) < (c.dTime || '20:00') || c.dLast === today) return;
      this._setCfg({ dLast: today });
      this._sendDaily();
    }

    // ---------- Morgen-Ansage ----------
    _presMorningAway(kidId, date) { const r = this._pres(kidId, date); if (r.s === 'in') return false; const [h, m] = String(this._cfg.mTime || '07:00').split(':').map(Number), t = h * 60 + m; return !r.segs.some(([a, b]) => t >= a && t < b); }

    _morningText() {
      const parts = [];
      const td = dk(new Date());
      this._kids().forEach((k) => {
        if (this._presMorningAway(k.id, td)) return;
        const ts = [...new Set(this._todayTasks(k.id).filter((t) => this._req(t) && !this._status(t, k.id).s).map((t) => { const cl = this._calLabel(t, dk(new Date())); return cl ? `${t.title} (${cl})` : t.title; }))];
        if (!ts.length) return;
        const list = ts.length > 1 ? T('{a} und {b}', { a: ts.slice(0, -1).join(', '), b: ts[ts.length - 1] }) : ts[0];
        parts.push(T('Guten Morgen {name}! Heute stehen an: {list}.', { name: k.name, list }));
      });
      return parts.join(' ');
    }

    _morningCheck() {
      const c = this._cfg;
      if (!c.mOn || this._bgActive()) return;
      const now = new Date(), today = dk(now), t0 = c.mTime || '07:00';
      if (c.mLast === today || hhmm(now) < t0) return;
      const [h, m] = t0.split(':').map(Number);
      if ((now - new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)) / 60000 > 30) return; // zu spät – nicht mehr ansagen
      if (c.mWd && (now.getDay() === 0 || now.getDay() === 6)) return;
      if (this._onVacation(today) || (c.hc && c.holFree !== false && this._pubHol(today))) return;
      this._setCfg({ mLast: today });
      const txt = this._morningText();
      if (txt) this._speak(txt);
    }

    // ---------- Telegram-Befehle ----------
    _cmdText(op) {
      const kids = this._kids(), rate = Number(this._cfg.moneyRate) || 10;
      if (op === 'punkte') {
        return `${T('⭐ Punktestand')}\n${kids.map((k) => {
          const g = this._cfg.goalOn !== false && k.goal && this._db.reward[k.goal];
          return `${k.emoji || ''} ${k.name}: ${k.points || 0} ⭐${this._cfg.moneyOn ? ` (≈ ${euro(k.points || 0, rate)})` : ''}${g ? ` · 🎯 ${g.title} ${Math.min(k.points || 0, this._cost(g, k.id))}/${this._cost(g, k.id)}` : ''}`;
        }).join('\n') || T('Noch keine Kinder angelegt.')}`;
      }
      if (op === 'offen') {
        const lines = kids.map((k) => {
          const ts = this._todayTasks(k.id).filter((t) => this._req(t));
          const open = ts.filter((t) => !this._status(t, k.id).s).map((t) => t.title);
          const wait = ts.filter((t) => this._status(t, k.id).s === 'p').length;
          return `${k.emoji || ''} ${k.name}: ${!ts.length ? T('heute nichts zu tun') : open.length ? open.join(', ') : T('alles erledigt ✅')}${wait ? ` (${T('⏳ {n} wartet auf Freigabe', { n: wait })})` : ''}`;
        });
        return `${T('📋 Heute noch offen')}\n${lines.join('\n') || T('Noch keine Kinder angelegt.')}`;
      }
      if (op === 'heute') { const m = this._dailyMsgs(false)[0]; return m ? `${m[0]}\n${m[1]}` : T('Noch keine Kinder angelegt.'); }
      if (op === 'woche') { const m = this._weeklyMsgs(false)[0]; return m ? `${m[0]}\n${m[1]}` : T('Noch keine Kinder angelegt.'); }
      return T('💬 Yippee!-Befehle\n/punkte – Punktestand aller Kinder\n/offen – was heute noch fehlt\n/heute – Tagesabschluss jetzt\n/woche – Wochenrückblick jetzt\n/hilfe – diese Übersicht');
    }

    _tgReply(msg) {
      const c = this._cfg, avail = (this._hass.services && this._hass.services.notify) || {};
      c.targets.filter((t) => (c.tgTargets || []).includes(t) || (t.includes('.') ? this._isTg(t) : /telegram/i.test(t))).forEach((t) => {
        if (t.includes('.')) { if (this._hass.states[t]) this._hass.callService('notify', 'send_message', { message: mdEsc(msg) }, { entity_id: t }, false).catch((e) => console.warn('Yippee', e)); }
        else if (avail[t]) this._hass.callService('notify', t, { message: mdEsc(msg) }, undefined, false).catch((e) => console.warn('Yippee', e));
      });
    }

    // ---------- Foto-Nachweis ----------
    _askPhoto(t, k, date, e) {
      let inp = this.shadowRoot.getElementById('kpcam');
      if (!inp) {
        inp = document.createElement('input');
        inp.type = 'file'; inp.accept = 'image/*'; inp.id = 'kpcam';
        inp.setAttribute('capture', 'environment');
        inp.style.display = 'none';
        this.shadowRoot.appendChild(inp);
      }
      inp.value = '';
      inp.onchange = async () => {
        const f = inp.files && inp.files[0];
        if (!f || this._st(date, t.id, k.id)) return;
        this._toast(T('📷 Foto wird gesendet …'));
        let file = '';
        try { file = await this._uploadPhoto(f, `kp_${date}_${slug(k.name)}_${t.id}.jpg`); }
        catch (err) { console.warn('Yippee! - Kids Chores Foto', err); this._toast(T('Foto konnte nicht gespeichert werden – Aufgabe wird trotzdem gemeldet')); }
        this._setSt(date, t.id, k.id, 'p');
        if (file) this._setMark(date, `f:${t.id}:${k.id}`, file);
        this._notify(`${T('✅ {name} hat „{title}“ erledigt – bitte freigeben.', { name: k.name, title: t.title })}${file ? (PH_RX.test(file) ? ` 📷 ${T('Foto in der Karte ansehen')}` : ' 📷') : ''}`, 'task',
          [[T('✓ Freigeben'), `KP|ok|${date}|${t.id}|${k.id}`], [T('✕ Ablehnen'), `KP|no|${date}|${t.id}|${k.id}`]], file);
        this._pop(e, '⏳');
        this._render();
      };
      inp.click();
    }

    async _uploadPhoto(f, name) {
      // Medien-Ordner nur mit Admin-Rechten (sonst 401 → IP-Sperre). Ohne Admin bzw. wenn der Upload scheitert: Foto in die To-do-Liste
      if (!this._admin()) return this._phStore(await this._phMake(f));
      try {
        const blob = await this._phShrink(f, 1280, 0.75, Infinity, 'blob');
        const fd = new FormData();
        fd.append('media_content_id', 'media-source://media_source/local');
        fd.append('file', blob || f, name);
        const r = await this._hass.fetchWithAuth('/api/media_source/local_source/upload', { method: 'POST', body: fd });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return name;
      } catch (err) {
        console.warn('Yippee! - Kids Chores Foto (Medien-Ordner)', err);
        return this._phStore(await this._phMake(f));
      }
    }

    // Bild verkleinern: als Blob (Medien-Ordner) oder Data-URL (Liste); null = Bild nicht lesbar
    async _phShrink(f, max, q, limit, kind) {
      let url = '';
      try {
        url = URL.createObjectURL(f);
        const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
        const w0 = img.naturalWidth, h0 = img.naturalHeight;
        if (!w0 || !h0) return null;
        const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
        for (const [m, qq] of [[max, q], [max, q * 0.75], [Math.round(max * 0.75), q * 0.6], [Math.round(max * 0.6), q * 0.5]]) {
          const sc = Math.min(1, m / Math.max(w0, h0));
          cv.width = Math.max(1, Math.round(w0 * sc)); cv.height = Math.max(1, Math.round(h0 * sc));
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
          ctx.drawImage(img, 0, 0, cv.width, cv.height);
          if (kind === 'blob') return await new Promise((res) => cv.toBlob(res, 'image/jpeg', qq));
          const d = cv.toDataURL('image/jpeg', qq);
          if (d.length <= limit) return d;
        }
        return null;
      } catch (e) { return null; } finally { if (url) URL.revokeObjectURL(url); }
    }
    async _phMake(f) {
      const d = await this._phShrink(f, 480, 0.6, PH_MAX, 'data');
      if (!d || !DATA_RX.test(d)) throw new Error('Foto nicht lesbar');
      return d;
    }

    // Wohin kommen die Listen-Fotos? Eigene Liste (Einstellung) oder Hauptliste
    _phEnt() {
      const e = String(this._cfg.phList || '');
      return /^todo\.\w+$/.test(e) && e !== this._config.storage && this._hass.states[e] ? e : this._config.storage;
    }
    async _phStore(d) {
      if (!DATA_RX.test(d) || d.length > PH_MAX) throw new Error('Foto zu groß');
      const id = (uid() + uid()).slice(0, 16), key = `kp|ph|${id}`, ent = this._phEnt();
      const desc = JSON.stringify({ d, ts: Date.now() });
      if (ent === this._config.storage) {
        await new Promise((res, rej) => this._enq(async () => {
          try { await this._svc('add_item', { item: key, description: desc }); this._stored.add(key); this._recent.set(key, Date.now()); res(); } catch (e) { rej(e); }
        }));
      } else await this._hass.callService('todo', 'add_item', { item: key, description: desc }, { entity_id: ent }, false);
      this._phMem = this._phMem || {};
      this._phMem[id] = d; // auf diesem Gerät sofort sichtbar
      return `ph:${id}`;
    }
    _phParse(raw) {
      try { const o = JSON.parse(raw || '{}'); return o && DATA_RX.test(String(o.d || '')) ? { d: o.d, ts: Number(o.ts) || 0 } : null; } catch (e) { return null; }
    }
    _phGet(ref) {
      const id = ref.slice(3);
      this._phMem = this._phMem || {};
      if (this._phMem[id]) return this._phMem[id];
      const m = this._db.ph[id] && this._phParse(this._db.ph[id].raw);
      if (m) { this._phMem[id] = m.d; return m.d; }
      if (this._phEnt() !== this._config.storage) this._phLoad();
      return '';
    }
    // Eigene Foto-Liste lesen (höchstens alle 20 s) – dabei alte, nicht mehr gebrauchte Fotos entfernen
    async _phLoad(force) {
      const ent = this._phEnt();
      if (ent === this._config.storage || this._phBusy || (!force && this._phT && Date.now() - this._phT < 20000)) return;
      this._phBusy = true; this._phT = Date.now();
      try {
        const r = await this._hass.callWS({ type: 'todo/item/list', entity_id: ent });
        const refs = this._phRefs(), now = Date.now();
        this._phMem = this._phMem || {};
        for (const it of (r && r.items) || []) {
          const sm = String(it.summary || '');
          if (!sm.startsWith('kp|ph|')) continue;
          const id = sm.slice(6), m = this._phParse(it.description);
          if (m && /^[a-z0-9]{6,24}$/.test(id)) this._phMem[id] = m.d;
          if (this._loaded && (!m || (!refs.has(id) && now - m.ts > 864e5) || now - m.ts > 30 * 864e5)) this._hass.callService('todo', 'remove_item', { item: sm }, { entity_id: ent }, false).catch(() => { /* schon weg */ });
        }
        this._render();
      } catch (e) { /* Liste nicht lesbar */ } finally { this._phBusy = false; }
    }
    // Welche Listen-Fotos werden noch gebraucht? (wartende Aufgaben und Noten)
    _phRefs() {
      const out = new Set();
      Object.values(this._db.log).forEach((l) => Object.entries(l.s || {}).forEach(([k, v]) => { if (k.startsWith('f:') && PH_RX.test(v)) out.add(v.slice(3)); }));
      Object.values(this._db.req).forEach((q) => { const f = q.grade && q.grade.photo; if (f && PH_RX.test(f)) out.add(f.slice(3)); });
      return out;
    }
    _phDel(ref) {
      const id = ref.slice(3), key = `kp|ph|${id}`, ent = this._phEnt();
      if (this._phMem) delete this._phMem[id];
      if (this._db.ph[id] || this._stored.has(key)) {
        delete this._db.ph[id];
        this._enq(async () => { try { await this._svc('remove_item', { item: key }); } catch (e) { /* schon weg */ } this._stored.delete(key); this._recent.delete(key); });
      }
      if (ent !== this._config.storage) this._hass.callService('todo', 'remove_item', { item: key }, { entity_id: ent }, false).catch(() => { /* schon weg */ });
    }

    _photoUrl(file) {
      if (PH_RX.test(String(file))) return this._phGet(String(file));
      if (!MEDIA_RX.test(String(file))) return '';
      this._phc = this._phc || {};
      const c = this._phc[file];
      if (c && c.busy) return c.url || '';
      if (c && Date.now() - c.t < (c.url ? 600000 : 30000)) return c.url;
      this._phc[file] = { ...(c || {}), busy: true, url: (c && c.url) || '' };
      const id = `media-source://media_source/local/${file}`;
      const done = (r) => { this._phc[file] = { url: this._hass.hassUrl ? this._hass.hassUrl(r.url) : r.url, t: Date.now() }; this._render(); };
      this._hass.callWS({ type: 'media_source/resolve_media', media_content_id: id, expires: 3600 }).then(done)
        .catch(() => this._hass.callWS({ type: 'media_source/resolve_media', media_content_id: id }).then(done))
        .catch(() => { this._phc[file] = { url: '', t: Date.now() }; });
      return this._phc[file].url;
    }

    _photoDone(date, tid, kidId) {
      const key = `f:${tid}:${kidId}`, f = this._mark(date, key);
      if (!f) return;
      if (!PH_RX.test(f) && !this._admin()) return; // Medien-Ordner: Löschen dürfen nur Admins – Markierung bleibt, ein Admin-Gerät räumt später auf
      this._setMark(date, key, '');
      this._photoDel(f);
    }

    // ---------- Statistik ----------
    _statsHtml(kids) {
      const kw = (d) => { const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const n = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate() + 4 - n); const y0 = new Date(Date.UTC(x.getUTCFullYear(), 0, 1)); return Math.ceil(((x - y0) / 86400000 + 1) / 7); };
      return `<div class="box"><h3>${T('📈 Statistik – letzte 5 Wochen')}</h3>${kids.map((k) => this._statKid(k, kw, true)).join('') || `<div class="hint">${T('Noch keine Kinder.')}</div>`}
        <div class="hint">${T('Balken = Anteil erledigter Pflicht-Aufgaben, oben = verdiente Sterne der Woche.')}</div></div>`;
    }

    _statKw(d) { const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const n = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate() + 4 - n); const y0 = new Date(Date.UTC(x.getUTCFullYear(), 0, 1)); return Math.ceil(((x - y0) / 86400000 + 1) / 7); }

    // 📈 5-Wochen-Statistik eines Kindes (head = mit Name/Avatar-Zeile)
    _statKid(k, kw = (d) => this._statKw(d), head = false) {
      {
        const ws = [4, 3, 2, 1, 0].map((b) => this._weekStats(k, b));
        // Summe aller Wochen ebenfalls nicht über „insgesamt verdient“ (neueste Woche zuerst)
        let rest = k.total !== undefined ? k.total : (k.points || 0);
        for (let i = ws.length - 1; i >= 0; i--) { ws[i].plus = Math.min(ws[i].plus, rest); rest -= ws[i].plus; }
        const sum = ws.reduce((a, w) => a + w.plus, 0), dn = ws.reduce((a, w) => a + w.done, 0), du = ws.reduce((a, w) => a + w.due, 0);
        return `<div class="stk" style="${cv(k.color)}"><div class="colh">${head ? this._avc(k) : ''}<span class="grow">${head ? esc(k.name) : ''}<small>${T('{done}/{due} Aufgaben', { done: dn, due: du })}${du ? ` (${Math.round((dn / du) * 100)} %)` : ''} · ${T('+{n} ⭐ verdient', { n: sum })}</small></span></div>
          <div class="sbars">${ws.map((w, i) => `<div class="sb"><span class="sv">+${w.plus}</span><div class="sbt"><i style="height:${w.due ? Math.round((w.done / w.due) * 100) : 0}%"></i></div><span>${i === 4 ? T('diese W.') : T('KW {n}', { n: kw(w.mon) })}</span><span class="hint">${w.done}/${w.due}</span></div>`).join('')}</div></div>`;
      }
    }



    // ---------- Aktionen ----------
    // ---------- 📋 Routinen ----------
    _routine(t) { return !!(this._cfg.routOn && t && Array.isArray(t.steps) && t.steps.length); }
    _routDone(date, tid, kidId, n) { return String(this._mark(date, `rs:${tid}:${kidId}`) || '').split(',').filter((x) => x !== '').map(Number).filter((i) => Number.isInteger(i) && i >= 0 && i < n); }
    _routDlg(t, k, e) {
      const today = dk(new Date()), n = t.steps.length, done = new Set(this._routDone(today, t.id, k.id, n));
      const zs = this._zStepIdx(t), zOnly = !!this._zc().only;
      this._modal(`${esc(t.emoji || '📋')} ${esc(t.title)} – ${esc(k.name)}`, `<div class="hint">${T('Hake jeden Schritt ab – beim letzten gibt es die Sterne.')}</div>
        <div class="rsteps">${t.steps.map((x, i) => {
          // 🦷 Zahnputz-Aufgabe als Schritt: Knopf startet den Timer; bei „nur mit Timer abhaken“ gibt es kein Häkchen von Hand
          const z = zs.includes(i) && !done.has(i);
          return `<label class="crow${z ? ' rsz' : ''}"><input type="checkbox" data-rstep="${i}" data-t="${t.id}" data-k="${k.id}" ${done.has(i) ? 'checked' : ''} ${z && zOnly ? 'disabled' : ''}><span>${esc(x.t)}</span>${z ? `<button type="button" class="zgo" data-a="rzgo" data-t="${t.id}" data-k="${k.id}" data-i="${i}">${T('🦷 Los geht\'s!')}</button>` : ''}</label>`;
        }).join('')}</div>`, false, {
        saveLabel: T('✓ Fertig'), audit: false,
        save: (b) => { const all = [...b.querySelectorAll('[data-rstep]')].every((x) => x.checked); if (all) setTimeout(() => this._routFinish(t.id, k.id, e), 0); return true; },
      });
    }
    _routStep(el) {
      const t = this._db.task[el.dataset.t], k = this._db.kid[el.dataset.k];
      if (!t || !k || !this._routine(t)) return;
      const today = dk(new Date()), n = t.steps.length, box = el.closest('.mbox');
      const done = [...box.querySelectorAll('[data-rstep]')].filter((x) => x.checked).map((x) => Number(x.dataset.rstep));
      this._setMark(today, `rs:${t.id}:${k.id}`, done.sort((a, b) => a - b).join(','));
      if (done.length === n) { this._closeModal(); this._routFinish(t.id, k.id, null); }
    }
    _routFinish(tid, kidId, e) {
      this._routSkip = true;
      try { this._kidTap(tid, kidId, e); } finally { this._routSkip = false; }
    }

    _kidTap(tid, kidId, e) {
      const t = this._db.task[tid], k = this._db.kid[kidId];
      if (!t || !k) return;
      const today = dk(new Date());
      const { s: st, date, by } = this._status(t, kidId);
      if (st === 'taken') { const o = this._db.kid[by]; this._toast(T('{name} war schneller ⚡', { name: o ? o.name : T('Jemand') })); return; }
      if (!st) {
        const w = this._win(t);
        if (w === 'before') { this._toast(T('⏰ Erst ab {time} Uhr', { time: t.from })); return; }
        if (w === 'after') { this._toast(T('Zeit ist vorbei (bis {time} Uhr)', { time: this._winTo(t) })); return; }
        // 🦷 „Nur mit Timer abhaken“: Antippen startet den Timer
        if (this._zLinked(t) && this._zc().only) { this._zStart(tid, kidId); return; }
        // ⏱️ Aufgabe mit Timer: Antippen startet den Countdown (außer bei „nur Countdown“ – dann wird wie gewohnt abgehakt)
        if (!this._tmrSkip && this._tmr(t) && this._tmr(t).end !== 'cd') { this._tmrStart(tid, kidId); return; }
        if (this._routine(t) && !this._routSkip && this._routDone(today, tid, kidId, t.steps.length).length < t.steps.length) { this._routDlg(t, k, e); return; }
        if (this._approval && t.photo && this._cfg.photoOn) { this._askPhoto(t, k, today, e); return; }
        if (this._approval) {
          this._setSt(today, tid, kidId, 'p');
          this._pop(e, '⏳');
          this._notify(T('✅ {name} hat „{title}“ erledigt – bitte freigeben.', { name: k.name, title: t.title }), 'task',
            [[T('✓ Freigeben'), `KP|ok|${today}|${tid}|${kidId}`], [T('✕ Ablehnen'), `KP|no|${today}|${tid}|${kidId}`]]);
        } else {
          this._markDone(today, tid, kidId, e);
          this._burst(14);
        }
      } else if (st === 'x') {
        this._toast(T('Verpasst – {n} ⭐ abgezogen', { n: Number(t.penalty) || 0 }));
        return;
      } else if (st === 'm') {
        this._toast(T('Verpasst – Mama oder Papa entscheiden, ob das okay war'));
        return;
      } else if (st === 'e') {
        this._toast(T('Entschuldigt 🙂 – keine Minuspunkte'));
        return;
      } else if (st === 'p') {
        this._setSt(date, tid, kidId, '');
        this._zUndo(date, tid, kidId);
        if (this._routine(t)) this._setMark(date, `rs:${tid}:${kidId}`, '');
        this._photoDone(date, tid, kidId);
      } else if (!this._approval) {
        this._markUndone(date, tid, kidId);
        if (this._routine(t)) this._setMark(date, `rs:${tid}:${kidId}`, '');
      } else {
        this._toast(T('Schon erledigt ✓'));
        return;
      }
      this._render();
      const list = this._todayTasks(kidId).filter((x) => this._req(x) && this._status(x, kidId).s !== 'taken');
      if (st !== 'd' && this._req(t) && list.length > 1 && list.every((x) => this._status(x, kidId).s === 'd')) {
        setTimeout(() => this._celebrate('🏆', T('{cheer}, {name}!', { cheer: cheer(), name: k.name }), T('Alles für heute erledigt!')), 300);
      }
    }

    _adminSet(date, tid, kidId, done, e) {
      const t = this._db.task[tid];
      if (!t) return;
      if (done && this._st(date, tid, kidId) !== 'd') { this._markDone(date, tid, kidId, e); this._audTask('ok', tid, kidId); }
      else if (!done) { this._markUndone(date, tid, kidId); this._audTask('no', tid, kidId); }
      this._photoDone(date, tid, kidId);
      this._render();
    }

    _request(rid, kidId, e) {
      const r = this._db.reward[rid], k = this._db.kid[kidId];
      if (!r || !k) return;
      if (!this._rwFor(r, kidId)) { this._toast(T('Diese Belohnung gibt es für {name} nicht.', { name: k.name })); return; }
      if (this._shareOn(r)) { this._shareTap(rid, kidId, 'share', e); return; }
      const open = Object.values(this._db.req).find((q) => q.kid === kidId && q.reward === rid && !q.pool);
      if (open) { this._del('req', open.id); this._render(); this._toast(T('Anfrage zurückgenommen')); return; }
      const rc = this._cost(r, kidId);
      if ((k.points || 0) < rc) { this._toast(T('Noch {n} Punkte sammeln', { n: rc - (k.points || 0) })); return; }
      if (r.limit && this._usedWeek(k, rid) >= r.limit) { this._toast(T('Diese Woche schon {n}× eingelöst – ab Montag wieder', { n: r.limit })); return; }
      if (this._approval) {
        const qid = uid();
        this._save('req', qid, { kid: kidId, reward: rid, d: dk(new Date()) });
        this._pop(e, '⏳');
        this._notify(T('🎁 {name} möchte „{title}“ einlösen ({cost} Punkte) – bitte freigeben.', { name: k.name, title: r.title, cost: rc }), 'reward',
          [[T('✓ Freigeben'), `KP|rok|${qid}`], [T('✕ Ablehnen'), `KP|rno|${qid}`]]);
        this._render();
      } else {
        this._redeem(kidId, rid);
        this._notify(T('🎁 {name} hat „{title}“ eingelöst ({cost} Punkte).', { name: k.name, title: r.title, cost: rc }), 'reward');
      }
    }

    // 👫 Gemeinsame Belohnung: Preis wird auf die beteiligten Kinder aufgeteilt – jedes Kind zahlt seinen Anteil selbst.
    // Topf als Anfrage: need = beteiligte Kinder, cov = {Kind: wer hat für es bezahlt}, paid = {Zahler: Sterne}
    _shareOn(r) { return !!(this._cfg.shareOn && r && r.share && !r.joker && this._shareKids(r).length > 1); }
    _shareKids(r) { const all = this._kids().map((k) => k.id); const sel = Array.isArray(r && r.shareKids) && r.shareKids.length ? r.shareKids.filter((id) => all.includes(id)) : all; return sel; }
    _shareCost(r, kidId, n) { return Math.ceil(this._cost(r, kidId) / Math.max(1, n || this._shareKids(r).length)); }
    _pool(rid) { return Object.values(this._db.req).find((q) => q.pool && q.reward === rid); }
    _poolDone(q) { return !!q && (q.need || []).every((id) => (q.cov || {})[id]); }
    _kn(id) { return (this._db.kid[id] || {}).name || '?'; }
    _names(ids) { const n = ids.map((id) => this._kn(id)); return n.length > 1 ? T('{a} und {b}', { a: n.slice(0, -1).join(', '), b: n[n.length - 1] }) : (n[0] || ''); }

    // mode: 'share' (eigenen Anteil zahlen / mitmachen), 'invite' (alles zahlen), 'rest' (fehlende Anteile übernehmen), 'back' (eigene Zahlung zurücknehmen)
    _shareTap(rid, kidId, mode, e) {
      const r = this._db.reward[rid], k = this._db.kid[kidId];
      if (!r || !k) return;
      const need = this._shareKids(r);
      if (!need.includes(kidId)) return;
      let q = this._pool(rid);
      if (q && this._poolDone(q) && mode !== 'back') { this._toast(T('⏳ angefragt')); return; }
      if (mode === 'back') {
        if (!q || !(q.paid || {})[kidId]) return;
        const amt = q.paid[kidId];
        this._addPoints(kidId, amt, `↩️ Anteil zurück: ${r.title}`);
        const cov = { ...(q.cov || {}) }; Object.keys(cov).forEach((x) => { if (cov[x] === kidId) delete cov[x]; });
        const paid = { ...(q.paid || {}) }; delete paid[kidId];
        if (!Object.keys(paid).length) this._del('req', q.id);
        else this._save('req', q.id, { ...q, cov, paid }, (c) => { const cv = { ...((c && c.cov) || {}) }, pd = { ...((c && c.paid) || {}) }; Object.keys(cv).forEach((x) => { if (cv[x] === kidId) delete cv[x]; }); delete pd[kidId]; return { ...c, cov: cv, paid: pd }; });
        this._toast(T('Anfrage zurückgenommen'));
        this._render();
        return;
      }
      const open = q ? need.filter((id) => !(q.cov || {})[id]) : need;
      const forIds = mode === 'share' ? [kidId] : open;
      if (!forIds.length || (mode === 'share' && q && (q.cov || {})[kidId])) return;
      const amt = mode === 'invite' && !q ? this._cost(r, kidId) : forIds.reduce((a, id) => a + this._shareCost(r, id, need.length), 0);
      if ((k.points || 0) < amt) { this._toast(T('Noch {n} Punkte sammeln', { n: amt - (k.points || 0) })); return; }
      if (r.limit) { const full = this._usedWeek(k, rid) >= r.limit; if (full) { this._toast(T('Diese Woche schon {n}× eingelöst – ab Montag wieder', { n: r.limit })); return; } }
      this._addPoints(kidId, -amt, mode === 'share' ? `👫 Anteil: ${r.title}` : `💝 Einladung: ${r.title}`);
      const addCov = {}; forIds.forEach((id) => { addCov[id] = kidId; });
      const merge = (c) => ({ ...c, cov: { ...((c && c.cov) || {}), ...addCov }, paid: { ...((c && c.paid) || {}), [kidId]: (((c && c.paid) || {})[kidId] || 0) + amt } });
      if (!q) { q = { id: uid(), pool: true, kid: kidId, reward: rid, d: dk(new Date()), need, cov: addCov, paid: { [kidId]: amt } }; this._save('req', q.id, { ...q }); }
      else { q = merge(q); this._save('req', q.id, { ...q }, merge); }
      this._pop(e, mode === 'share' ? '👫' : '💝');
      if (this._poolDone(q)) this._shareReady(q.id, q);
      else this._toast(T('👫 Bezahlt! Es fehlen noch: {names}', { names: this._names(need.filter((id) => !(q.cov || {})[id])) }));
      this._render();
    }

    _shareReady(qid, q) {
      const r = this._db.reward[q.reward]; if (!r) return;
      const payers = Object.keys(q.paid || {}), who = this._names(q.need), inv = payers.length === 1 && q.need.length > 1 ? payers[0] : '';
      const what = inv ? T('💝 {name} lädt {others} ein: „{title}“', { name: this._kn(inv), others: this._names(q.need.filter((id) => id !== inv)), title: r.title }) : T('👫 {names} lösen gemeinsam „{title}“ ein', { names: who, title: r.title });
      if (this._approval) {
        this._notify(`${what} – ${T('bitte freigeben.')}`, 'reward', [[T('✓ Freigeben'), `KP|rok|${qid}`], [T('✕ Ablehnen'), `KP|rno|${qid}`]]);
        this._toast(T('⏳ angefragt'));
      } else {
        this._notify(what, 'reward');
        this._shareFinish(qid);
      }
    }

    async _shareFinish(qid, opt) {
      const q = this._db.req[qid] ? { ...this._db.req[qid] } : null;
      if (!q || !this._poolDone(q) || !(await this._claim(qid))) return;
      const r = this._db.reward[q.reward]; if (!r) { this._render(); return; }
      const today = dk(new Date()), mon = this._monday(), payers = Object.keys(q.paid || {});
      const inv = payers.length === 1 && q.need.length > 1 ? payers[0] : '';
      // nur wer bezahlt hat, bekommt Verlauf, Wochenzähler und Gutschein – eingeladene Kinder verbrauchen ihr Wochenlimit nicht
      payers.forEach((id) => {
        if (!this._db.kid[id]) return;
        const guests = q.need.filter((x) => x !== id && (q.cov || {})[x] === id);
        const label = guests.length ? T('{title} ({name} lädt {others} ein)', { title: r.title, name: this._kn(id), others: this._names(guests) }) : `👫 ${r.title}`;
        const push = [['history', { d: today, t: r.title, e: r.emoji, c: (q.paid || {})[id] || 0 }, 10]];
        if (this._cfg.walletOn && !(opt && opt.got)) push.push(['vouch', { id: uid(), t: label, e: r.emoji || '🎁', d: today }, 50]);
        this._addPoints(id, 0, '', { push, red: [r.id, today, mon], ungoal: r.id });
      });
      this._audit(T('👫 Gemeinsam eingelöst: {names} – {title}', { names: this._names(q.need), title: r.title }));
      this._lm(`🎁 ${this._names(q.need)}: ${r.title}`, 'cash');
      this._render();
      this._celebrate(r.emoji || '🎁', T('Viel Spaß, {name}!', { name: this._names(q.need) }), inv ? T('💝 {name} lädt {others} ein: „{title}“', { name: this._kn(inv), others: this._names(q.need.filter((id) => id !== inv)), title: r.title }) : T('👫 {names} lösen gemeinsam „{title}“ ein', { names: this._names(q.need), title: r.title }));
    }

    // Abbrechen (Ablehnen, Rücknahme durch Eltern, abgelaufen): alle Zahlungen zurück
    async _shareCancel(qid, audit = true) {
      const q = this._db.req[qid] ? { ...this._db.req[qid] } : null;
      if (!q || !(await this._claim(qid))) return;
      const r = this._db.reward[q.reward] || {};
      Object.entries(q.paid || {}).forEach(([id, amt]) => { if (this._db.kid[id] && amt > 0) this._addPoints(id, amt, `↩️ Anteil zurück: ${r.title || '?'}`); });
      if (audit) this._audit(T('✕ Wunsch/Einlösung abgelehnt: {name} – {title}', { name: this._names(q.need || [q.kid]), title: r.title || '?' }));
      this._render();
    }

    _monday() { const n = new Date(); return dk(new Date(n.getFullYear(), n.getMonth(), n.getDate() - ((n.getDay() + 6) % 7))); }
    _usedWeek(k, rid) { return (((k && k.red) || {})[rid] || []).filter((d) => d >= this._monday()).length; }

    // 🎁 Eltern lösen direkt ein (📋 Heute → 🎁 beim Kind): ohne Freigabe, sonst wie eine freigegebene Anfrage
    _parentRedeemDlg(kidId) {
      const k = this._db.kid[kidId]; if (!k) return;
      const pts = k.points || 0, rs = this._rwSorted(Object.values(this._db.reward).filter((r) => this._rwFor(r, kidId) && !this._advR(r)), kidId);
      const row = (r, btns, sub) => `<div class="row"><span style="font-size:26px">${esc(r.emoji || '🎁')}</span><span class="grow">${esc(r.title)}<small>${sub}</small></span></div>${btns ? `<div class="btnrow" style="margin:-4px 0 8px">${btns}</div>` : ''}`;
      const btn = (r, m, label, cost, ok) => `<button type="button" class="btn sm ${ok ? 'primary' : ''}" data-a="ardo" data-r="${r.id}" data-k="${kidId}" data-m="${m}" data-cost="${esc(cost)}" ${ok ? '' : 'disabled'}>${label}</button>`;
      const html = rs.map((r) => {
        const full = r.limit && this._usedWeek(k, r.id) >= r.limit;
        if (this._shareOn(r)) {
          const need = this._shareKids(r), q = this._pool(r.id), open = q ? need.filter((id) => !(q.cov || {})[id]) : need;
          if (!need.includes(kidId)) return '';
          if (q && this._poolDone(q)) return row(r, btn(r, 'appr', T('✓ Freigeben'), '', true), T('⏳ angefragt'));
          const parts = open.map((id) => [id, this._shareCost(r, id, need.length)]);
          const allOk = parts.every(([id, c]) => ((this._db.kid[id] || {}).points || 0) >= c);
          const inv = q ? parts.reduce((a, [, c]) => a + c, 0) : this._cost(r, kidId);
          const sub = `👫 ${parts.map(([id, c]) => `${esc(this._kn(id))} ${c} ⭐`).join(' · ')}${q ? ` · ${T('es fehlen noch: {names}', { names: esc(this._names(open)) })}` : ''}`;
          return row(r, btn(r, 'share', T('👫 Jeder zahlt seinen Anteil'), parts.map(([id, c]) => `${this._kn(id)} −${c} ⭐`).join(', '), allOk && !full)
            + (open.length > 1 || (open.length === 1 && open[0] !== kidId) ? btn(r, 'invite', T('💝 {name} lädt ein ({n} ⭐)', { name: esc(k.name), n: inv }), `−${inv} ⭐`, pts >= inv && !full) : ''), sub);
        }
        const c = this._cost(r, kidId);
        return row(r, btn(r, 'one', T('Einlösen'), `−${c} ⭐`, pts >= c && !full), full ? T('diese Woche aufgebraucht') : pts >= c ? `${c} ⭐` : `${c} ⭐ · ${T('noch {n} ⭐', { n: c - pts })}`);
      }).join('');
      this._modal(T('🎁 Einlösen für {name}', { name: esc(k.name) }), `<div class="prd"><div class="hint">${T('{name} hat {n} ⭐. Eingelöst wird sofort – ohne Freigabe.', { name: esc(k.name), n: pts })}</div>${html || `<div class="empty">${T('Noch keine Belohnungen.')}</div>`}</div>`);
    }

    async _parentRedeem(rid, kidId, mode) {
      const r = this._db.reward[rid], k = this._db.kid[kidId];
      if (!r || !k || !this._isParent()) return;
      this._closeModal();
      if (mode === 'one') {
        const open = Object.values(this._db.req).find((q) => q.kid === kidId && q.reward === rid && !q.pool);
        await this._redeem(kidId, rid, open ? open.id : undefined, { got: true }); // Eltern geben die Belohnung gleich – kein Gutschein
        return;
      }
      if (!this._shareOn(r)) return;
      const need = this._shareKids(r);
      let q = this._pool(rid);
      if (mode === 'appr') { if (q && this._poolDone(q)) await this._shareFinish(q.id, { got: true }); return; }
      if (!need.includes(kidId)) return;
      const open = q ? need.filter((id) => !(q.cov || {})[id]) : need;
      if (!open.length) return;
      // wer zahlt wie viel?
      const pay = {};
      if (mode === 'invite') pay[kidId] = q ? open.reduce((a, id) => a + this._shareCost(r, id, need.length), 0) : this._cost(r, kidId);
      else open.forEach((id) => { pay[id] = this._shareCost(r, id, need.length); });
      const short = Object.entries(pay).find(([id, c]) => ((this._db.kid[id] || {}).points || 0) < c);
      if (short) { this._toast(T('{name} hat nicht mehr genug Punkte', { name: this._kn(short[0]) })); this._render(); return; }
      if (r.limit && Object.keys(pay).some((id) => this._usedWeek(this._db.kid[id], rid) >= r.limit)) { this._toast(T('Diese Woche schon {n}× eingelöst – ab Montag wieder', { n: r.limit })); return; }
      Object.entries(pay).forEach(([id, c]) => this._addPoints(id, -c, mode === 'invite' ? `💝 Einladung: ${r.title}` : `👫 Anteil: ${r.title}`));
      const cov = { ...((q && q.cov) || {}) }, paid = { ...((q && q.paid) || {}) };
      open.forEach((id) => { cov[id] = mode === 'invite' ? kidId : id; });
      Object.entries(pay).forEach(([id, c]) => { paid[id] = (paid[id] || 0) + c; });
      if (q) { q = { ...q, cov, paid }; this._save('req', q.id, { ...q }, (c) => ({ ...c, cov: { ...((c && c.cov) || {}), ...cov }, paid })); }
      else { q = { id: uid(), pool: true, kid: kidId, reward: rid, d: dk(new Date()), need, cov, paid }; this._save('req', q.id, { ...q }); }
      await this._shareFinish(q.id, { got: true });
    }

    // opt.got: Eltern lösen direkt ein und geben die Belohnung gleich – dann ohne 🎟️ Gutschein
    async _redeem(kidId, rid, reqId, opt) {
      if (reqId && (this._db.req[reqId] || {}).pool) { await this._shareFinish(reqId, opt); return; }
      if (reqId && !(await this._claim(reqId))) return;
      const r = this._db.reward[rid], k = this._db.kid[kidId];
      if (!r || !k) { this._render(); return; }
      const rc = this._cost(r, kidId);
      if ((k.points || 0) < rc) { this._toast(T('{name} hat nicht mehr genug Punkte', { name: k.name })); this._render(); return; }
      if (r.limit && this._usedWeek(k, rid) >= r.limit) { this._toast(T('Diese Woche schon {n}× eingelöst – ab Montag wieder', { n: r.limit })); this._render(); return; }
      const today = dk(new Date()), mon = this._monday();
      // Verlauf, Wochenzähler, Ziel, Joker und Gutschein werden mit der Buchung gespeichert
      const push = [['history', { d: today, t: r.title, e: r.emoji, c: rc }, 10]];
      if (this._cfg.walletOn && !r.joker && !(opt && opt.got)) push.push(['vouch', { id: uid(), t: r.title, e: r.emoji || '🎁', d: today }, 50]);
      this._addPoints(kidId, -rc, `🎁 ${r.title} eingelöst`, { push, red: [rid, today, mon], ungoal: rid, ...(r.joker ? { inc: { jokers: 1 } } : {}) });
      this._audit(T('🎁 Eingelöst: {name} – {title} (−{cost} ⭐)', { name: k.name, title: r.title, cost: rc }));
      this._lm(`🎁 ${k.name}: ${r.title}`, 'cash');
      this._render();
      this._celebrate(r.emoji || '🎁', T('Viel Spaß, {name}!', { name: k.name }), T('{title} eingelöst · −{cost} ⭐', { title: r.title, cost: rc }));
    }

    // ---------- Rendering ----------
    // Neu zeichnen, ohne dass die Seite nach oben springt
    // Rückfrage „Wirklich …?“ (zweimal tippen): die Karte merkt sich die Rückfrage 8 Sekunden lang selbst –
    // so überlebt sie ein Neuzeichnen zwischendurch (z. B. Änderung von einem anderen Gerät, Hintergrundprüfung)
    _sureAsk(el, text) {
      const key = `${el.dataset.a}|${el.dataset.k || ''}`;
      if (this._sureK === key && Date.now() < this._sureT) { this._sureK = null; clearTimeout(this._sureTm); return true; }
      this._sureK = key; this._sureT = Date.now() + 8000; this._sureTx = text;
      clearTimeout(this._sureTm); this._sureTm = setTimeout(() => { this._sureK = null; this._render(); }, 8000);
      this._sureApply();
      return false;
    }

    _sureApply() {
      if (!this._sureK || Date.now() >= this._sureT || !this.shadowRoot) return;
      const [a, k] = this._sureK.split('|');
      const el = [...this.shadowRoot.querySelectorAll('#app [data-a]')].find((e) => e.dataset.a === a && (e.dataset.k || '') === k);
      if (!el) return;
      el.dataset.sure = '1';
      const h = el.querySelector('.hint');
      (h || el).textContent = this._sureTx;
    }

    _render() {
      if (!this._built || !this._hass || !this._config) return;
      if (this._wiz) this._wizKeep();
      const sp = this._scrollParent();
      const sy = sp ? sp.scrollTop : (window.scrollY || window.pageYOffset || 0);
      this._look();
      this._renderInner();
      this._sureApply();
      this._fitTabs();
      if (this._setQ) this._filterSet();
      if (this._wiz && this._wiz.q && this._wiz.step === 2) this._wizFilter();
      const back = () => { try { if (sp) sp.scrollTop = sy; else if ((window.scrollY || 0) !== sy) window.scrollTo(0, sy); } catch (e) { /* egal */ } };
      back();
      // Nach dem nächsten Bild noch einmal – aber nur, wenn das Neuzeichnen die Seite nach oben verschoben hat (Inhalt kurz kürzer)
      // und kein neueres Neuzeichnen dazwischenkam. So setzt ein verspätetes Nachstellen nie eine veraltete Position,
      // wenn inzwischen gescrollt wurde.
      const tok = (this._scrTok = (this._scrTok || 0) + 1);
      const later = () => { if (this._scrTok !== tok) return; try { if (sp) { if (sp.scrollTop < sy) sp.scrollTop = sy; } else if ((window.scrollY || 0) < sy) window.scrollTo(0, sy); } catch (e) { /* egal */ } };
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(later);
    }

    // Tab-Namen, die nicht ganz passen (schmales Handy, lange Wörter), nicht abschneiden – dann nur die Symbole zeigen
    _fitTabs() {
      const tb = this.shadowRoot && this.shadowRoot.querySelector('.tabs');
      if (!tb) return;
      tb.classList.remove('ico');
      const cut = [...tb.querySelectorAll('.tl')].some((e) => e.scrollWidth > e.clientWidth + 1);
      tb.classList.toggle('ico', cut);
    }

    _scrollParent() {
      let n = this;
      while (n) {
        const rn = n.getRootNode && n.getRootNode();
        const el = n.parentElement || (rn && rn.host) || null;
        if (!el || el === document.body || el === document.documentElement) break;
        try { const st = getComputedStyle(el); if (/(auto|scroll)/.test(st.overflowY) && el.scrollHeight > el.clientHeight + 4) return el; } catch (e) { /* egal */ }
        n = el;
      }
      return null;
    }

    // 🧒 Kinder-Ansicht: „compact“ (Standard ab 1.9 für neue Installationen) oder „classic“ (lange Seite wie bisher)
    _kView() { const v = this._cfg.kView; return v === 'classic' || v === 'compact' ? v : 'classic'; }
    // Beim ersten Laden einmal festlegen: wer schon Kinder angelegt hat, behält die gewohnte Ansicht
    _kViewInit() {
      if (this._cfg.kView || this._kvInitDone) return;
      this._kvInitDone = true;
      this._setCfg({ kView: Object.keys(this._db.kid).length ? 'classic' : 'compact' });
    }
    _kPage(kid) { return (this._kpg && this._kpg[kid]) || 'home'; }

    _kidCompact(k, o) {
      const { pts, money, lv, L, nxt, tot, goal, target, kc, tasks, stat, reqT, done, banners, badgesHtml, rwHtml, rewards, reqs, isBd } = o;
      const page = this._kPage(k.id), today = dk(new Date());
      // Kopf: Avatar mit Level-Ring, Begrüßung, große Sterne-Zahl
      const lvPct = nxt ? Math.max(0, Math.min(100, Math.round(((tot - L[0]) / Math.max(1, nxt[0] - L[0])) * 100))) : 100;
      const negTxt = this._cfg.negOn ? (() => { const nt = this._dayNet(k, today); return `<span class="kcnet ${nt < 0 ? 'neg' : ''}">${T('Bilanz heute: {n} ⭐', { n: nt > 0 ? `+${nt}` : nt })}</span>`; })() : '';
      const head = `<div class="kch ${isBd ? 'bdtap' : ''}" ${isBd ? `data-a="bdparty" data-k="${k.id}"` : ''}>
        <span class="kcav" style="${cv(k.color)};--lv:${lvPct}%">${this._avc(k, false)}</span>
        <div class="kgrow"><div class="kcn">${T('Hallo {name}!', { name: esc(k.name) })}</div><div class="kcl">${L[2]} ${T('Level {n}', { n: lv + 1 })}${nxt ? ` · ${T('noch {n} ⭐', { n: nxt[0] - tot })}` : ''}</div>${negTxt}</div>
        <div class="kcpts">⭐ ${pts}${money ? `<small>${money}</small>` : ''}</div></div>`;
      let goalHtml = '';
      if (target) {
        const pct = Math.max(0, Math.min(100, Math.round((pts / Math.max(1, kc(target))) * 100)));
        goalHtml = `<button class="kcgoal" data-a="kpg" data-k="${k.id}" data-p="rw">${goal ? '🎯 ' : ''}${esc(target.emoji || '🎁')} <span class="grow">${esc(target.title)}</span><span class="bar"><i style="width:${pct}%"></i></span><b>${pts >= kc(target) ? '✓' : `${kc(target) - pts} ⭐`}</b></button>`;
      }
      // Sammel-Knöpfe: nur was gerade aktiv ist
      const chips = this._kcChips(k);
      const rcp = this._rcpAvail(k);
      const shelf = chips.length ? `<div class="kcshelf">${chips.map((c) => `<button class="kcchip ${c.cls || ''}" data-a="${c.a || 'kpg'}" data-k="${k.id}" data-p="col" data-x="${c.x}" title="${esc(c.t)}" aria-label="${esc(c.t)}"><span>${c.e}</span>${c.n !== undefined && c.n !== '' ? `<small>${esc(String(c.n))}</small>` : ''}</button>`).join('')}</div>` : '';
      // Belohnungen: Zahl der jetzt einlösbaren
      const canNow = rewards.filter((r) => !this._shareOn(r) && pts >= kc(r) && !(r.limit && this._usedWeek(k, r.id) >= r.limit) && !reqs.some((q) => q.reward === r.id)).length;
      const colNew = chips.some((c) => c.hot);
      let body = '';
      if (page === 'rw') body = rwHtml.trim() || `<div class="empty">${T('Noch keine Belohnungen – frag Mama oder Papa 🙂')}</div>`;
      else if (page === 'col') body = this._kcCollection(k, badgesHtml, rcp);
      else body = `${banners}${this._kcToday(k, tasks, stat, reqT, done)}${this._previewHtml(k)}`;
      const nav = `<div class="kcnav" role="tablist">${[['home', '🏠', T('Heute'), 0], ['rw', '🎁', T('Belohnungen'), canNow], ['col', '🏆', T('Sammlung'), colNew ? '•' : 0]].map(([id, e, l, n]) => `<button class="kcnb ${page === id ? 'on' : ''}" role="tab" aria-selected="${page === id}" data-a="kpg" data-k="${k.id}" data-p="${id}"><i>${e}</i>${l}${n ? `<small>${n}</small>` : ''}</button>`).join('')}</div>`;
      return `<div class="card kc" style="${cv(k.color)}">${head}${page === 'home' ? `${goalHtml}${shelf}` : ''}<div class="kcbody">${body}</div>${nav}</div>`;
    }

    // Sammel-Knöpfe im Kopf (Adventskalender, Zahnputz-Bilder, Abzeichen, Familienziel, Rückblick)
    _kcChips(k) {
      const out = [], today = new Date();
      const adv = this._advBtn(k);
      if (adv) { const waits = adv.includes('advnew'); out.push({ x: 'adv', a: 'advopen', e: '🎄', n: waits ? today.getDate() : '', t: T('Adventskalender'), cls: 'adv', hot: waits }); }
      if (this._zOn() && (this._zDueToday(k.id).length || (this._db.zk[k.id] || {}).n)) { const sn = this._zStreak(k.id); out.push({ x: 'z', e: '🦷', n: sn >= 2 ? `🔥${sn}` : '', t: T('Meine Zahnputz-Bilder') }); }
      const got = BADGES.filter((b) => b[3](k)).length;
      out.push({ x: 'b', e: '🏅', n: `${got}/${BADGES.length}`, t: T('Abzeichen') });
      const f = this._cfg.fam;
      if (f && f.cost) out.push({ x: 'fam', e: esc(f.emoji || '👨‍👩‍👧'), n: `${Math.min(100, Math.round(((f.pts || 0) / f.cost) * 100))}%`, t: T('👨‍👩‍👧 Unser Familienziel') });
      // 📅 Rückblick: den ganzen Monat sichtbar – vom 1. bis 14. als „neu“ markiert, solange noch nicht angesehen
      const rl = this._rcpList(k), r = rl.length ? rl[rl.length - 1] : null;
      if (r) { const hot = !!r.fresh && !this._rcpSeen(k.id, r.key); out.push({ x: r.key, a: 'rcpopen', e: '📅', n: '', t: r.title, cls: hot ? 'hot' : '', hot }); }
      return out;
    }

    // „Jetzt dran“: nur was gerade fällig ist; Erledigtes als eine Zeile, Späteres eingeklappt
    _kcToday(k, tasks, stat, reqT, done) {
      if (this._presCfg(k.pres) && this._pres(k.id, dk(new Date())).s === 'out') return '';
      if (!tasks.length) return `<div class="empty">${T('Heute gibt es nichts zu tun 🎈')}</div>`;
      const st = (t) => stat[t.id].s, isDone = (t) => ['d', 'p', 'taken'].includes(st(t));
      const missed = (t) => ['x', 'm', 'e'].includes(st(t)) || (!st(t) && this._win(t) === 'after');
      const doneL = tasks.filter(isDone), missL = tasks.filter((t) => !isDone(t) && missed(t));
      const openL = tasks.filter((t) => !isDone(t) && !missed(t));
      const timed = openL.filter((t) => this._blk(t) !== 'day');
      let now = timed.filter((t) => this._win(t) === 'open');
      if (!now.length) now = openL.filter((t) => this._blk(t) === 'day');
      if (!now.length && timed.length) { const first = timed.slice().sort((a, b) => String(a.from || '').localeCompare(String(b.from || '')))[0]; now = timed.filter((t) => this._blk(t) === this._blk(first)); }
      const rest = openL.filter((t) => !now.includes(t));
      const xo = (id) => !!(this._kcx && this._kcx[`${k.id}:${id}`]);
      const row = (id, icon, label, list, extra) => {
        if (!list.length) return '';
        const o = xo(id);
        return `<button type="button" class="kcrow ${extra || ''}" data-a="kpx" data-k="${k.id}" data-id="${id}" aria-expanded="${o}"><span class="grow">${icon ? `${icon} ` : ''}${label}${o ? '' : ` <span class="kcem">${list.slice(0, 6).map((t) => esc(t.emoji || '⭐')).join(' ')}</span>`}</span><b>${list.length}</b><span class="chev">${o ? '▾' : '▸'}</span></button>${o ? this._tilesHtml(list, stat, k) : ''}`;
      };
      const all = reqT.length && done === reqT.length;
      const blkName = (list) => { const b = list.length ? this._blk(list[0]) : 'day'; const d = this._blockDefs().find((x) => x[0] === b); return d ? d[1] : ''; };
      const laterGroups = this._blockDefs().map(([id, label]) => [id, label, rest.filter((t) => this._blk(t) === id)]).filter((g) => g[2].length);
      return `${all ? `<div class="trophy">${T('🏆 Alles geschafft – super!')}</div>` : ''}
        ${now.length ? `<div class="kcnow"><b>${now.every((t) => this._blk(t) === 'day') ? T('📌 Jetzt dran') : `${blkName(now).split(' ')[0]} ${T('Jetzt dran')}`}</b>${this._winTo(now[0]) ? `<span class="hint">${T('bis {time}', { time: this._winTo(now[0]) })}</span>` : ''}</div>${this._tilesHtml(now, stat, k)}` : ''}
        ${row('done', '✅', T('Schon geschafft'), doneL, 'ok')}
        ${laterGroups.map(([id, label, list]) => row(`l-${id}`, id === 'day' ? '' : '⏰', id === 'day' ? label : T('Später heute: {block}', { block: label }), list)).join('')}
        ${row('miss', '⌛', T('Verpasst'), missL, 'miss')}`;
    }

    // 🏆 Sammlung: Adventskalender, Zahnputz-Bilder, Abzeichen, Familienziel, Rückblick
    _kcCollection(k, badgesHtml, rcp) {
      const parts = [];
      const adv = this._advBtn(k);
      if (adv) parts.push(adv);
      const z = this._zKidHtml(k);
      if (z) parts.push(z);
      parts.push(badgesHtml);
      if (this._cfg.fam && this._cfg.fam.cost) parts.push(this._familyHtml().replace('class="card fam"', 'class="fam kcfam"'));
      const list = this._rcpList(k);
      if (list.length) parts.push(`<div class="kcsec">${T('📅 Rückblick')}</div>${list.map((r) => `<button class="kcrc ${r.fresh && !this._rcpSeen(k.id, r.key) ? 'hot' : ''}" data-a="rcpopen" data-k="${k.id}" data-x="${r.key}"><span class="e">📅</span><span class="grow"><b>${esc(r.title)}</b><small>${T('{n} ⭐ gesammelt', { n: r.stars })}</small></span><span class="chev">›</span></button>`).join('')}`);
      if (this._cfg.walletOn && (k.vouch || []).length) parts.push(`<div class="kcsec">${T('🎟️ Meine Gutscheine')}</div>${k.vouch.map((v) => `<button class="wish vch" data-a="vuse" data-k="${k.id}" data-v="${esc(v.id)}">${esc(v.e || '🎁')} <span class="grow">${esc(v.t)}</span><span class="hint">${this._vSure(k.id, v.id) ? T('Bekommen? Nochmal tippen') : `${shortDate(v.d)} · ✓`}</span></button>`).join('')}`);
      return parts.join('');
    }

    // ---------- 📅 Rückblick (Monat am 1., Jahr im Januar) ----------
    _rcpSeen(kid, key) { try { return (localStorage.getItem(`kpRcp:${this._config.storage}:${kid}`) || '') === key; } catch (e) { return false; } }
    _rcpMark(kid, key) { try { localStorage.setItem(`kpRcp:${this._config.storage}:${kid}`, key); } catch (e) { /* egal */ } }
    // Verfügbare Rückblicke: letzter Monat (immer, wenn Daten da sind) und im Januar das Vorjahr
    _rcpList(k) {
      const now = new Date(), out = [];
      const pm = new Date(now.getFullYear(), now.getMonth() - 1, 1), mKey = `${pm.getFullYear()}-${String(pm.getMonth() + 1).padStart(2, '0')}`;
      const m = this._recap(k, mKey);
      if (m && m.days) out.push({ ...m, fresh: now.getDate() <= 14 });
      if (now.getMonth() === 0) { const y = this._recap(k, String(now.getFullYear() - 1)); if (y && y.weeks) out.push({ ...y, fresh: true }); }
      return out;
    }
    _rcpAvail(k) { const l = this._rcpList(k).filter((r) => r.fresh); return l.length ? l[l.length - 1] : null; }

    // Zahlen für einen Monat („2026-10“) oder ein Jahr („2026“) – aus den gespeicherten Tagen (60), Wochen (52), Verlauf und Abhak-Liste
    _recap(k, key) {
      const isYear = /^\d{4}$/.test(key), rd = k.rd || {}, rw = k.rw || {};
      const MN = Array.isArray(MONTHS) ? MONTHS : [];
      if (!isYear) {
        const [y, mo] = key.split('-').map(Number);
        const days = Object.keys(rd).filter((d) => d.startsWith(`${key}-`)).sort();
        const stars = days.reduce((a, d) => a + (Number(rd[d][2]) || 0), 0), tasks = days.reduce((a, d) => a + (Number(rd[d][0]) || 0), 0);
        let best = 0, cur = 0, prevD = '';
        days.forEach((d) => { const r = rd[d], full = Number(r[1]) > 0 && Number(r[0]) >= Number(r[1]); if (full && (!prevD || keyAdd(prevD, 1) === d)) cur += 1; else cur = full ? 1 : 0; prevD = d; best = Math.max(best, cur); });
        const pk = `${mo === 1 ? y - 1 : y}-${String(mo === 1 ? 12 : mo - 1).padStart(2, '0')}`, pdays = Object.keys(rd).filter((d) => d.startsWith(`${pk}-`));
        const pstars = pdays.length >= 25 ? pdays.reduce((a, d) => a + (Number(rd[d][2]) || 0), 0) : null;
        // Lieblingsaufgabe und Zähneputzen aus der Abhak-Liste dieses Monats
        const cnt = {}; let teeth = 0;
        Object.keys(this._db.log).filter((d) => d.startsWith(`${key}-`)).forEach((d) => {
          const s = (this._db.log[d] || {}).s || {};
          Object.keys(s).forEach((x) => {
            if (x.startsWith('zt:') && x.endsWith(`:${k.id}`)) teeth++;
            const m2 = /^([\w-]+):([\w-]+)$/.exec(x);
            if (m2 && m2[2] === k.id && s[x] === 'd' && this._db.task[m2[1].replace(/-\d$/, '')]) cnt[m2[1].replace(/-\d$/, '')] = (cnt[m2[1].replace(/-\d$/, '')] || 0) + 1;
          });
        });
        const favId = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0], fav = favId ? this._db.task[favId] : null;
        const rws = (k.history || []).filter((h) => String(h.d || '').startsWith(`${key}-`));
        return { key, title: T('Dein {month}', { month: MN[mo - 1] || key }), month: MN[mo - 1] || key, days: days.length, stars, tasks, best, diff: pstars === null ? null : stars - pstars, teeth, fav: fav ? { e: fav.emoji || '⭐', t: fav.title, n: cnt[favId] } : null, rws };
      }
      const weeks = Object.keys(rw).filter((w) => w.startsWith(`${key}-`)).sort();
      const stars = weeks.reduce((a, w) => a + (Number(rw[w][2]) || 0), 0), tasks = weeks.reduce((a, w) => a + (Number(rw[w][0]) || 0), 0);
      const byM = {}; weeks.forEach((w) => { const mm = Number(w.slice(5, 7)); byM[mm] = (byM[mm] || 0) + (Number(rw[w][2]) || 0); });
      const bm = Object.keys(byM).sort((a, b) => byM[b] - byM[a])[0];
      const rws = (k.history || []).filter((h) => String(h.d || '').startsWith(`${key}-`));
      return { key, year: true, title: T('Dein Jahr {year}', { year: key }), weeks: weeks.length, stars, tasks, best: Number(k.best) || 0, bestMonth: bm ? { m: MN[Number(bm) - 1] || bm, n: byM[bm] } : null, rws, lvl: levelOf(k.total !== undefined ? k.total : k.points || 0) + 1 };
    }

    _rcpOpen(kid, key) {
      const k = this._db.kid[kid]; if (!k) return;
      const r = key ? (this._rcpList(k).find((x) => x.key === key) || this._recap(k, key)) : this._rcpAvail(k);
      if (!r) return;
      this._rcpMark(kid, r.key);
      const card = (e, n, l) => `<div class="rcc"><b>${e} ${n}</b><span>${l}</span></div>`;
      const cards = [];
      if (!r.year) {
        cards.push(card('✅', r.tasks, T('Aufgaben erledigt')));
        if (r.best >= 2) cards.push(card('🔥', T('{n} Tage', { n: r.best }), T('alles geschafft am Stück')));
        if (this._zOn() && r.teeth) cards.push(card('🦷', `${r.teeth}×`, T('Zähne geputzt')));
        if (r.fav) cards.push(card(esc(r.fav.e), esc(r.fav.t), T('am häufigsten erledigt ({n}×)', { n: r.fav.n })));
      } else {
        cards.push(card('✅', r.tasks, T('Aufgaben erledigt')));
        if (r.bestMonth) cards.push(card('🏅', esc(r.bestMonth.m), T('dein stärkster Monat ({n} ⭐)', { n: r.bestMonth.n })));
        if (r.best >= 2) cards.push(card('🔥', T('{n} Tage', { n: r.best }), T('längste Serie')));
        cards.push(card('🐝', T('Level {n}', { n: r.lvl }), T('erreicht')));
      }
      if (r.rws.length) cards.push(card('🎁', `${r.rws.length}×`, `${r.rws.slice(0, 3).map((h) => esc(h.e || '🎁')).join(' ')} ${T('eingelöst')}`));
      const sub = r.diff === null || r.diff === undefined ? '' : r.diff > 0 ? T('{n} mehr als im Monat davor 🚀', { n: r.diff }) : r.diff < 0 ? T('{n} weniger als im Monat davor', { n: -r.diff }) : T('genauso viele wie im Monat davor');
      this._modal(`${esc(r.title)}, ${esc(k.name)}! 🎉`, `<div class="rcp" style="${cv(k.color)}"><div class="hint">${r.year ? T('So fleißig warst du dieses Jahr') : T('So fleißig warst du')}</div>
        <div class="rcbig">${r.stars} ⭐</div><div class="rcsub">${T('gesammelt')}${sub ? ` – ${sub}` : ''}</div><div class="rcg">${cards.join('')}</div></div>`);
      setTimeout(() => this._burst && this._burst(24), 200);
      this._render();
    }

    // ---------- ⏱️ Aufgaben-Timer (1.9): z. B. „15 Min. lesen“ – Countdown mit Ring und Musik ----------
    // end: auto = am Ende automatisch abhaken · ok = Kind bestätigt · cd = nur Countdown (abhaken wie gewohnt)
    _tmr(t) {
      if (!t || !(Number(t.tmr) > 0) || this._zLinked(t)) return null;
      return { min: Math.min(180, Math.max(1, Math.round(Number(t.tmr)))), end: ['auto', 'ok', 'cd'].includes(t.tmrEnd) ? t.tmrEnd : 'auto', mus: ['std', 'own', 'off'].includes(t.tmrMus) ? t.tmrMus : 'std' };
    }

    _tmrStart(tid, kidId) {
      const t = this._db.task[tid], k = this._db.kid[kidId], cf = this._tmr(t);
      if (!t || !k || !cf) return;
      if (this._kt && this._kt.el && this._kt.el.isConnected) return;
      const el = document.createElement('div');
      // In der Android-App liegen die Navigationstasten über der Seite → unten Platz lassen (Sicherheitsabstand)
      el.className = `kt${/Android/i.test(navigator.userAgent || '') && this._inApp() ? ' app' : ''}`;
      el.setAttribute('role', 'dialog');
      this.shadowRoot.appendChild(el);
      const dur = cf.min * 60 * 1000;
      // Foto-Nachweis braucht einen echten Tipp (sonst darf der Browser die Kamera nicht öffnen) → dann bestätigt das Kind am Ende
      const end = cf.end === 'auto' && ((this._approval && t.photo && this._cfg.photoOn) || this._routine(t)) ? 'ok' : cf.end;
      this._kt = { el, tid, kid: kidId, cf: { ...cf, end }, dur, acc: 0, from: Date.now(), paused: false, sure: 0, done: false, mute: cf.mus === 'off' };
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-x]'); if (b) this._tmrAct(b.dataset.x); });
      this._tmrDraw();
      this._kt.iv = setInterval(() => this._tmrTick(), 250);
      try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then((l) => { if (this._kt) this._kt.lock = l; else l.release(); }, () => {}); } catch (e) { /* egal */ }
      this._tmrMusic();
    }

    _tmrLeft() { const s = this._kt; if (!s) return 0; const run = s.acc + (s.paused ? 0 : Date.now() - s.from); return Math.max(0, s.dur - run); }

    _tmrDraw() {
      const s = this._kt; if (!s) return;
      const t = this._db.task[s.tid] || {}, k = this._db.kid[s.kid] || {}, left = this._tmrLeft(), frac = 1 - left / s.dur;
      const mm = Math.floor(Math.ceil(left / 1000) / 60), ss = Math.ceil(left / 1000) % 60;
      const R = 92, C = 2 * Math.PI * R;
      const msg = s.done ? (s.cf.end === 'ok' ? T('Zeit um! Bist du fertig?') : s.cf.end === 'cd' ? T('Zeit um! 🎉') : T('Geschafft! 🎉'))
        : s.paused ? T('⏸️ Pause') : frac >= 0.5 && left > 60000 ? T('Super, schon mehr als die Hälfte! 💪') : left <= 60000 ? T('Gleich geschafft! ⏳') : T('Los geht\'s – du schaffst das!');
      const pts = (Number(t.points) || 0) * this._mult(dk(new Date()), s.kid);
      const btns = s.done
        ? (s.cf.end === 'ok' ? `<button class="btn ktw" data-x="close">${T('Noch nicht')}</button><button class="btn ktp" data-x="ok">${T('✓ Fertig!')}</button>` : `<button class="btn ktp" data-x="close">${T('Schließen')}</button>`)
        : `<button class="btn ktw" data-x="pause">${s.paused ? T('▶️ Weiter') : T('⏸️ Pause')}</button>${s.cf.end !== 'cd' && pts ? `<span class="ktpts">${T('+{n} ⭐ am Ende', { n: pts })}</span>` : ''}`;
      s.el.innerHTML = `<div class="ktbox" style="${cv(k.color)}"><div class="kttop"><span>${esc(k.emoji || '🙂')} ${esc(k.name || '')}</span><button class="ktx" data-x="x" aria-label="${esc(T('Abbrechen'))}">${s.sure && Date.now() - s.sure < 3000 ? T('Wirklich?') : '✕'}</button></div>
        <div class="ktring"><svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="${R}" class="ktbg"/><circle cx="110" cy="110" r="${R}" class="ktfg" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * Math.min(1, frac)).toFixed(1)}"/></svg>
          <div class="kttime"><b>${s.done ? '✓' : `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`}</b><small>${s.done ? '' : T('noch')}</small></div></div>
        <div class="kttitle">${esc(t.emoji || '⭐')} ${esc(t.title || '')}</div><div class="ktmsg">${msg}</div>
        ${s.cf.mus !== 'off' && !s.done ? `<button class="ktmus" data-x="mute">${s.mute ? T('🔇 Musik aus') : T('🎵 Musik an')}</button>` : ''}
        <div class="ktbtns">${btns}</div></div>`;
    }

    _tmrTick() {
      const s = this._kt; if (!s) return;
      if (!s.el.isConnected) { this._tmrStop(); return; }
      if (!s.done && this._tmrLeft() <= 0) {
        s.done = true; this._tmrSound(); if (s.audio) { try { s.audio.pause(); } catch (e) { /* egal */ } }
        if (s.cf.end === 'auto') { this._tmrDraw(); setTimeout(() => this._tmrFinish(true), 900); return; }
      }
      const sec = Math.ceil(this._tmrLeft() / 1000);
      if (sec !== s.lastSec || s.done !== s.lastDone) { s.lastSec = sec; s.lastDone = s.done; this._tmrDraw(); }
    }

    _tmrAct(x) {
      const s = this._kt; if (!s) return;
      if (x === 'pause' && !s.done) {
        if (s.paused) { s.from = Date.now(); s.paused = false; if (s.audio && !s.mute) s.audio.play().catch(() => {}); }
        else { s.acc += Date.now() - s.from; s.paused = true; if (s.audio) s.audio.pause(); }
      } else if (x === 'mute') { s.mute = !s.mute; if (s.audio) { if (s.mute) s.audio.pause(); else if (!s.paused) s.audio.play().catch(() => {}); } else if (!s.mute) this._tmrMusic(); }
      else if (x === 'x') {
        if (s.done) { this._tmrStop(); return; }
        if (s.sure && Date.now() - s.sure < 3000) { this._tmrStop(); this._toast(T('Timer abgebrochen – nichts gebucht')); return; }
        s.sure = Date.now(); setTimeout(() => this._kt === s && this._tmrDraw(), 3100);
      } else if (x === 'ok') { this._tmrFinish(true); return; }
      else if (x === 'close') { this._tmrStop(); return; }
      this._tmrDraw();
    }

    // Ende: bei „automatisch“ bzw. „Fertig!“ wird die Aufgabe genau wie beim Antippen abgehakt (Freigabe, Foto-Nachweis usw. gelten)
    _tmrFinish(book) {
      const s = this._kt; if (!s) return;
      this._tmrStop();
      if (!book) return;
      const st = this._status(this._db.task[s.tid] || {}, s.kid).s;
      if (st) return;
      this._tmrSkip = true;
      try { this._kidTap(s.tid, s.kid, null); } finally { this._tmrSkip = false; }
    }

    _tmrStop() {
      const s = this._kt; if (!s) return;
      clearInterval(s.iv);
      if (s.audio) { try { s.audio.pause(); s.audio.src = ''; } catch (e) { /* egal */ } }
      if (s.lock) { try { s.lock.release(); } catch (e) { /* egal */ } }
      if (s.el && s.el.parentNode) s.el.parentNode.removeChild(s.el);
      this._kt = null;
    }

    async _tmrMusic() {
      const s = this._kt; if (!s || s.mute || s.cf.mus === 'off') return;
      let src = '';
      try {
        if (s.cf.mus === 'own') {
          const l = (this._zc().mp3 || []).filter((x) => x && x.r);
          if (l.length) { const r = await this._hass.callWS({ type: 'media_source/resolve_media', media_content_id: l[Math.floor(Math.random() * l.length)].r, expires: 3600 }); src = r && r.url ? r.url : ''; }
        }
        if (!src) { const m = await cardImport('yippee-kids-chores-teeth-music.js', (x) => x && typeof x.default === 'string'); src = m.default; }
      } catch (e) { return; }
      if (this._kt !== s || s.mute || s.done || !src) return;
      const a = new Audio(src); a.loop = true; a.volume = 0.6; s.audio = a;
      if (!s.paused) a.play().catch(() => {});
    }

    _tmrSound() {
      try {
        const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
        const ctx = this._actx || (this._actx = new C());
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain(), t0 = ctx.currentTime + i * 0.13;
          o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
          o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + 0.55);
        });
      } catch (e) { /* egal */ }
    }

    // ---------- 🔊 Leseanfänger-Modus (1.9): Aufgabe vorlesen ----------
    _say(tid, kidId) {
      const t = this._db.task[tid], k = this._db.kid[kidId];
      if (!t || !k) return;
      const n = (this._zLinked(t) ? this._zPts(t, kidId, true) : Number(t.points) || 0) * this._mult(dk(new Date()), kidId);
      const txt = `${t.title}. ${n === 1 ? T('Dafür bekommst du einen Stern!') : n > 1 ? T('Dafür bekommst du {n} Sterne!', { n }) : ''}`.trim();
      this._sayKid(txt, kidId);
      this._toast(`🔊 „${txt}“`);
    }

    // Text für ein Kind ausgeben – über „📱 dieses Gerät“ oder die Lautsprecher (wie beim Kind eingestellt). Auch vom 🎄 Adventskalender genutzt.
    // Emojis werden nicht mitgesprochen.
    _sayKid(txt, kidId) {
      const k = this._db.kid[kidId], c = this._cfg;
      const say = String(txt || '').replace(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\uFE0F\u200D]/gu, '').replace(/\s+/g, ' ').trim();
      if (!k || !say) return;
      if (k.rdOut === 'spk' && c.rTts && this._hass.states[c.rTts] && (c.rPlayers || []).length) {
        this._hass.callService('tts', 'speak', { media_player_entity_id: c.rPlayers, message: say }, { entity_id: c.rTts }).catch(() => this._sayHere(say));
      } else this._sayDev(say);
    }

    // 📱 „dieses Gerät“: Ist eine Sprachausgabe (z. B. Home Assistant Cloud) eingestellt, erzeugt HA die Sprachdatei und das Gerät spielt sie selbst ab –
    // das klappt auch in der Companion-App, wo die Browser-Sprachausgabe oft fehlt. resolve_media ist für alle Benutzer erlaubt. Sonst/bei Fehler: Browser-Stimme.
    _sayDev(txt) {
      const e = this._cfg.rTts;
      if (!e || !this._hass.states[e]) { this._sayHere(txt); return; }
      try { if (this._sayAu) { this._sayAu.pause(); } } catch (x) { /* egal */ }
      const a = new Audio(); this._sayAu = a;
      // im Tipp sofort „freischalten“ (iPhone/WebView spielen sonst nach dem Warten nichts ab)
      try { a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='; a.play().catch(() => {}); } catch (x) { /* egal */ }
      this._hass.callWS({ type: 'media_source/resolve_media', media_content_id: `media-source://tts/${e}?message=${encodeURIComponent(txt)}`, expires: 600 })
        .then((r) => {
          if (this._sayAu !== a) return;
          if (!r || !r.url) { this._sayHere(txt); return; }
          a.src = this._hass.hassUrl ? this._hass.hassUrl(r.url) : r.url;
          a.play().catch(() => this._sayHere(txt));
        }, () => { if (this._sayAu === a) this._sayHere(txt); });
    }

    _sayHere(txt) {
      try {
        const sy = window.speechSynthesis; if (!sy || typeof SpeechSynthesisUtterance === 'undefined') return;
        sy.cancel();
        const u = new SpeechSynthesisUtterance(txt);
        u.lang = LANG === 'gsw' ? 'de-CH' : LANG;
        u.rate = 0.95;
        sy.speak(u);
      } catch (e) { /* egal */ }
    }

    // 👨‍👩‍👧 Eltern-Bereich liegt in einer eigenen Datei (yippee-kids-chores-admin.js) und wird erst beim ersten Öffnen geladen –
    // so starten Kinder-Tablets schneller. Bis die Datei da ist, steht „Lade …“ da; Aktionen (z. B. Aufgabe bearbeiten) laufen danach von selbst weiter.
    _admCall(n, a, html) {
      admLoad().then(() => { this._admErr = false; if (html) this._render(); else this[n](...a); }, () => { if (!this._admErr) { this._admErr = true; this._render(); } });
      if (!html) return undefined;
      return `<div class="card"><div class="empty">${this._admErr ? T('⚠️ Der Eltern-Bereich konnte nicht geladen werden – liegt die Datei yippee-kids-chores-admin.js neben der Karte?') : T('Lade …')}</div></div>`;
    }

    _renderInner() {
      if (!this._built || !this._hass || !this._config) return;
      // Nicht neu zeichnen, solange in der Karte gerade etwas eingetippt wird (sonst geht die Eingabe verloren)
      const ae = this.shadowRoot.activeElement;
      // 🎄 auch beim Tippen im Adventskalender (eigener Bereich in der Karte) nicht neu zeichnen
      const aIn = ae && (ae === this._advEl || ae === this._zEl) && ae.shadowRoot && ae.shadowRoot.activeElement;
      const typing = (x) => x && /^(INPUT|TEXTAREA|SELECT)$/.test(x.tagName) && !/^(checkbox|radio|button|file|range|color)$/.test(x.type || '');
      if ((ae && ae.closest && ae.closest('#app') && typing(ae)) || typing(aIn)) {
        if (!this._deferR) { this._deferR = true; ae.addEventListener('blur', () => { setTimeout(() => { this._deferR = false; this._render(); }, 0); }, { once: true }); }
        return;
      }
      const app = this.shadowRoot.getElementById('app');
      const st = this._config.storage;
      if (!this._hass.states[st]) {
        const nm = this._listName(st), adm = this._admin(), busy = this._mkBusy === st;
        const manual = `<div>${T('1. Einstellungen → Geräte &amp; Dienste → <b>Integration hinzufügen</b> → <b>Lokale To-do-Liste</b>')}<br>
          ${T('2. Name: <b>Yippee Kids Chores</b> → ergibt <code>todo.yippee_kids_chores</code>').replace('Yippee Kids Chores', esc(nm)).replace('todo.yippee_kids_chores', esc(st))}<br>
          ${T('3. Diese Karte neu laden.')}</div>`;
        app.innerHTML = `<div class="card setup"><div class="hd"><span class="tt">${LOGO}${T('⭐ Yippee! - Kids Chores einrichten').replace(/^⭐\s*/, '')}</span></div>
          <label class="setlang">${T('🌐 Sprache')}${this._langSelect(this._preLangGet(), 'class="prelang"')}</label>
          ${adm ? `<div class="hint">${T('Die Karte speichert alles in einer Lokalen To-do-Liste in Home Assistant. Ein Tipp legt sie an:')}</div>
            <button class="btn primary big" data-a="mklist" data-for="storage" data-n="${esc(nm)}" ${busy ? 'disabled' : ''}>${busy ? T('⏳ Liste wird angelegt …') : T('⚙️ Liste „{name}“ anlegen', { name: esc(nm) })}</button>
            ${this._mkErr ? `<div class="hint">${T('⚠️ Anlegen hat nicht geklappt: {err}', { err: esc(this._mkErr) })}</div>` : ''}
            <details><summary class="hint">${T('Lieber von Hand anlegen?')}</summary>${manual}</details>`
          : `<div class="hint">${T('Die Liste kann nur ein Administrator mit einem Tipp anlegen – bitte die Karte einmal als Administrator öffnen oder so von Hand anlegen:')}</div>${manual}`}
          <div class="hint">${T('Eingetragen: {st} (nicht gefunden)', { st: esc(st) })}</div></div>`;
        return;
      }
      // Sprache aus dem ersten Fenster übernehmen, sobald die Liste da ist
      if (this._loaded && this._preLangGet() && this._isParent()) {
        if (!this._cfg.lang) this._setCfg({ lang: this._preLang });
        this._preLang = ''; try { localStorage.removeItem('kpPreLang'); } catch (e) { /* egal */ }
      }
      if (this._err) { app.innerHTML = `<div class="card"><div class="empty">⚠️ ${esc(this._err)}</div></div>`; return; }
      if (!this._loaded) { app.innerHTML = `<div class="card"><div class="empty">${T('Lade …')}</div></div>`; return; }
      const mode = this._config.mode;
      if (!['kid', 'kids', 'advent'].includes(mode) && !this._isParent()) {
        const names = (this._cfg.parents || []).map((u) => this._userName(u)).filter(Boolean).join(', ');
        app.innerHTML = `<div class="card"><div class="lock"><div class="le">🔒</div><div class="lt">${T('Eltern-Bereich')}</div><div class="hint">${T('Nur für: {names}', { names: esc(names) })}<br>${T('Angemeldet als {user}.', { user: esc(this._uName()) })}</div></div></div>`;
        return;
      }
      if (this._locked()) { app.innerHTML = this._lockHtml(); return; }
      let html, adv = null;
      const advPage = (m, kid, back) => { adv = [m, kid || '']; return `<div class="advpg">${back ? `<button class="btn advback" data-a="advclose">${T('← Zurück')}</button>` : ''}<div id="advslot"></div></div>`; };
      const advKid = this._advKid && this._db.kid[this._advKid] && this._advOn() ? this._advKid : '';
      if (mode === 'advent') {
        const ch = String(this._config.child || '').trim(), k = ch ? this._kidByName(ch) : null;
        if (!this._advOn()) html = `<div class="card"><div class="empty">${T('🎄 Der Adventskalender ist ausgeschaltet – einschalten in der Eltern-Ansicht unter ⚙️ Einstellungen → ⚙️ Allgemein → 🎄 Adventskalender.')}</div></div>`;
        else if (ch && !k) {
          const names = this._kids().map((x) => x.name).join(', ');
          html = `<div class="card"><div class="empty">${T('Kind „{name}“ nicht gefunden.', { name: esc(ch) })}<br>${names ? T('Angelegt sind: {names}', { names: esc(names) }) : T('Lege zuerst in der Eltern-Ansicht ein Kind an.')}</div></div>`;
        } else if (!this._kids().length) html = `<div class="card"><div class="empty">${T('Noch keine Kinder angelegt – das geht in der Eltern-Ansicht unter 👧 Kinder.')}</div></div>`;
        else html = advPage(k ? 'kid' : 'kids', k ? k.id : '', false);
      } else if (mode === 'kids') {
        const kids = this._kids();
        html = advKid ? advPage('kid', advKid, true) : kids.length
          ? `<div class="kwrap">${this._famTop() ? this._familyHtml() : ''}<div class="kgrid">${kids.map((k) => this._kidHtml(k)).join('')}</div></div>`
          : `<div class="card"><div class="empty">${T('Noch keine Kinder angelegt – das geht in der Eltern-Ansicht unter 👧 Kinder.')}</div></div>`;
      } else if (mode === 'kid') {
        const k = this._kidByName(this._config.child);
        if (!k) {
          const names = this._kids().map((x) => x.name).join(', ');
          html = `<div class="card"><div class="empty">${T('Kind „{name}“ nicht gefunden.', { name: esc(this._config.child || '') })}<br>${names ? T('Angelegt sind: {names}', { names: esc(names) }) : T('Lege zuerst in der Eltern-Ansicht ein Kind an.')}</div></div>`;
        } else html = advKid === k.id ? advPage('kid', k.id, true) : `<div class="kwrap">${this._famTop() ? this._familyHtml() : ''}${this._kidHtml(k)}</div>`;
      } else {
        html = this._adminHtml();
        if (this._tab === 'advent' && html.includes('id="advslot"')) adv = ['admin', ''];
      }
      // 🎄 Adventskalender: Rahmen unverändert → nur den Kalender selbst auffrischen (Dialoge und Eingaben bleiben erhalten)
      if (adv && this._advEl && app.contains(this._advEl) && this._advHtml === html) { this._advEl.attach(this, adv[0], adv[1]); return; }
      // aufgeklappte Bereiche (z. B. „YAML anzeigen“) bleiben beim Neuzeichnen offen
      const openD = [...app.querySelectorAll('details[open] > summary')].map((x) => x.textContent);
      app.innerHTML = html;
      if (openD.length) app.querySelectorAll('details > summary').forEach((x) => { if (openD.includes(x.textContent)) x.parentNode.open = true; });
      this._advHtml = adv ? html : null;
      if (adv) this._advMount(app, adv[0], adv[1]);
      if (app.querySelector('#zslot')) this._zMount(app);
    }

    // 🎄 Adventskalender einhängen (das Modul wird erst beim ersten Mal geladen)
    _advMount(app, m, kid) {
      const slot = app.querySelector('#advslot');
      if (!slot) return;
      if (!customElements.get('yippee-advent')) {
        slot.innerHTML = `<div class="empty">${this._advErr ? T('⚠️ Der Adventskalender konnte nicht geladen werden – liegt die Datei yippee-kids-chores-advent.js neben der Karte?') : T('Lade …')}</div>`;
        if (!this._advErr && !this._advBusy) {
          this._advBusy = true;
          advLoad().then(() => { this._advBusy = false; this._advHtml = null; this._render(); }, () => { this._advBusy = false; this._advErr = true; this._advHtml = null; this._render(); });
        }
        return;
      }
      if (!this._advEl) this._advEl = document.createElement('yippee-advent');
      slot.replaceWith(this._advEl);
      this._advEl.attach(this, m, kid);
    }

    // 🎄 Knopf in der Kinder-Ansicht (nur im Dezember bzw. im Testmodus des Kalenders)
    _advBtn(k) {
      if (!this._advOn() || this._config.summary || this._config.mode === 'advent') return '';
      let now = new Date();
      try { const t = localStorage.getItem(`kpAdvTest:${this._config.storage}`) || ''; if (/^\d{4}-\d\d-\d\d$/.test(t)) { const [y, m, d] = t.split('-').map(Number); now = new Date(y, m - 1, d); } } catch (e) { /* egal */ }
      if (now.getMonth() !== 11) return '';
      const N = Number((this._db.adc.main || {}).days) === 31 ? 31 : 24, day = now.getDate();
      const o = this._db.ado[k.id], open = !!(o && o.y === now.getFullYear() && (o.d || {})[day]);
      return `<button class="btn advbtn" data-a="advopen" data-k="${esc(k.id)}">🎄 ${T('Adventskalender')}${day <= N && !open ? ` <span class="advnew">${T('Türchen {n} wartet!', { n: day })}</span>` : ''}</button>`;
    }

    // „Demnächst“: besondere Aufgaben der nächsten 6 Tage (nicht die täglichen)
    // Kinder-Ansicht: auf-/zugeklappte Bereiche (🏅 Abzeichen, 📅 Demnächst) – pro Gerät gemerkt, standardmäßig zu
    _kvOpen(kid, x) {
      if (!this._kvo) { try { this._kvo = new Set(JSON.parse(localStorage.getItem('kpKv') || '[]')); } catch (e) { this._kvo = new Set(); } }
      return this._kvo.has(`${kid}:${x}`);
    }

    _previewHtml(k) {
      if (!this._cfg.prevOn) return '';
      const special = (t) => t.sched === 'dates' || t.sched === 'cal' || t.rotate || (t.sched === 'week' && (t.days || []).length && t.days.length < 7);
      const now = new Date(), rows = [];
      for (let i = 1; i <= 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i), key = dk(d);
        const lbl = `${DAYS[d.getDay()]} ${shortDate(key)}`;
        if (this._cfg.bdOn && this._isBday(k, key)) { rows.push(`<div class="pv"><b>${lbl}</b><span>${T('🎂 Geburtstag!')}</span></div>`); continue; }
        if (this._onVacation(key, k.id)) continue;
        if (this._cfg.hc && this._pubHol(key)) { rows.push(`<div class="pv"><b>${lbl}</b><span>🎉 ${esc(this._pubHol(key))}</span></div>`); if (this._cfg.holFree !== false) continue; }
        const seen = new Set();
        const ts = Object.values(this._db.task).filter((t) => special(t) && this._isFor(t, k.id, d)).filter((t) => { const p = t.parent || t.id; if (seen.has(p)) return false; seen.add(p); return true; });
        if (ts.length) rows.push(`<div class="pv"><b>${lbl}</b><span>${ts.map((t) => { const cl = this._calLabel(t, key); return `${esc(t.emoji || '⭐')} ${esc(t.title)}${cl ? ` <small>(${esc(cl)})</small>` : ''}`; }).join(' · ')}${this._isDbl(key) ? ' · ⭐×2' : ''}</span></div>`);
      }
      if (!rows.length) return '';
      const o = this._kvOpen(k.id, 'p');
      return `<button type="button" class="sect kvsect" data-a="kvtog" data-x="p" data-k="${k.id}" aria-expanded="${o}"><span>${T('📅 Demnächst')}</span><span class="hint">${rows.length} <span class="accc">▸</span></span></button>${o ? `<div>${rows.join('')}</div>` : ''}`;
    }

    _wish(kidId) {
      const k = this._db.kid[kidId];
      if (!k) return;
      this._modal(T('💡 Wunsch von {name}', { name: esc(k.name) }), `<div class="hint">${T('Was wünschst du dir als Belohnung? Mama oder Papa entscheiden, ob es klappt und wie viele Sterne es kostet.')}</div>
        <div class="g2"><label>${T('Emoji')}<input name="emoji" value="🎁"></label><label>${T('Mein Wunsch')}<input name="title" placeholder="${esc(T('z. B. Kinobesuch'))}"></label></div>`, false, {
        saveLabel: T('💡 Wunsch abschicken'),
        save: (b) => {
          const title = b.querySelector('[name=title]').value.trim();
          if (!title) { this._toast(T('Bitte deinen Wunsch eintragen')); return false; }
          const emoji = b.querySelector('[name=emoji]').value.trim() || '🎁';
          this._save('req', uid(), { kid: kidId, wish: { title, emoji }, d: dk(new Date()) });
          this._notify(T('💡 {name} wünscht sich: {emoji} {title} – bitte in der Eltern-Ansicht unter 🔔 Freigaben entscheiden.', { name: k.name, emoji, title }), 'reward');
          this._toast(T('💡 Wunsch abgeschickt'));
          return true;
        },
      });
    }

    // 🃏 Joker: eine heutige Pflicht-Aufgabe ohne Minuspunkte auslassen
    _jokerDlg(kidId) {
      const k = this._db.kid[kidId];
      if (!k || !(k.jokers > 0)) return;
      const today = dk(new Date());
      const open = this._todayTasks(kidId).filter((t) => t.sched !== 'once' && this._req(t) && this._status(t, kidId).s === '');
      if (!open.length) { this._toast(T('Heute ist keine offene Pflicht-Aufgabe da, für die du den Joker brauchst 🙂')); return; }
      this._modal(T('🃏 Joker einsetzen – {name}', { name: esc(k.name) }), `<div class="hint">${T('Du hast {n} Joker. Welche Aufgabe möchtest du heute auslassen? Es gibt dafür keine Sterne, aber auch keine Minuspunkte.', { n: k.jokers })}</div>
        <div class="pick txt">${open.map((t, i) => `<label><input type="radio" name="jt" value="${t.id}" ${i ? '' : 'checked'}><span>${esc(t.emoji || '⭐')} ${esc(t.title)}</span></label>`).join('')}</div>`, false, {
        saveLabel: T('🃏 Joker einsetzen'), audit: false,
        save: (b) => {
          const r = b.querySelector('[name=jt]:checked');
          const t = r && this._db.task[r.value];
          if (!t || this._st(today, t.id, kidId)) { this._toast(T('Diese Aufgabe ist nicht mehr offen')); return false; }
          if (!((this._db.kid[kidId] || {}).jokers > 0)) return true;
          this._setSt(today, t.id, kidId, 'e');
          this._addPoints(kidId, 0, '🃏 Joker', { inc: { jokers: -1 } }); // als Buchung: zählt auch bei gleichzeitigen Änderungen richtig
          this._audit(T('🃏 Joker: {name} lässt „{title}“ aus', { name: k.name, title: t.title }));
          this._notify(T('🃏 {name} hat einen Joker eingesetzt: {title}', { name: k.name, title: `${t.emoji || ''} ${t.title}`.trim() }), 'task');
          this._celebrate('🃏', T('Joker eingesetzt!'), T('„{title}“ hat heute Pause.', { title: t.title }));
          return true;
        },
      });
    }

    // 🏠 Ankunftstag? (Kind war gestern nicht da bzw. kommt heute erst im Lauf des Tages)
    _arrival(kidId, date) {
      const k = this._db.kid[kidId];
      if (!k || !this._presCfg(k.pres)) return null;
      const r = this._pres(kidId, date);
      if (r.s === 'out') return null;
      if (r.s === 'arr') return { at: r.at };
      return this._pres(kidId, keyAdd(date, -1)).s === 'out' ? { at: r.segs[0] && r.segs[0][0] ? hm(r.segs[0][0]) : '' } : null;
    }
    _welcHtml(k) {
      const today = dk(new Date()), a = this._cfg.welcOn && this._arrival(k.id, today);
      if (!a) return '';
      // nur kurz zeigen: vor der Ankunftszeit steht „Aufgaben ab …“, danach höchstens 60 Min. und nur bis zur ersten erledigten Aufgabe
      const now = hhmm(new Date());
      if (a.at && (now < a.at || (addMin(a.at, 60) && now > addMin(a.at, 60)))) return '';
      if (this._todayTasks(k.id).some((t) => ['d', 'p'].includes(this._st(today, t.id, k.id)))) return '';
      const goal = this._cfg.goalOn !== false && k.goal && this._db.reward[k.goal], left = goal ? this._cost(goal, k.id) - (k.points || 0) : 0;
      return `<div class="vac welc">${T('🎉 Willkommen zurück, {name}!', { name: esc(k.name) })} ${T('Du hast {n} ⭐.', { n: k.points || 0 })}${goal && left > 0 ? ` ${T('Bis {emoji} {title} fehlen noch {n} ⭐.', { emoji: esc(goal.emoji || '🎁'), title: esc(goal.title), n: left })}` : ''}</div>`;
    }

    _presBanner(k) {
      const today = dk(new Date()), r = this._pres(k.id, today);
      if (r.s === 'out') {
        const n = this._presNext(k.id, today);
        return `<div class="vac">${n ? T('👋 Bis bald, {name}! Wieder da: {day} {date}{time}', { name: esc(k.name), day: DAYS[new Date(`${n.d}T12:00:00`).getDay()], date: shortDate(n.d), time: n.at ? ` ${T('ab {time} Uhr', { time: n.at })}` : '' }) : T('👋 {name} ist gerade nicht da.', { name: esc(k.name) })}</div>`;
      }
      if (r.s === 'arr' && r.at && hhmm(new Date()) < r.at) return `<div class="vac">${T('🏠 Willkommen, {name}! Aufgaben ab {time} Uhr', { name: esc(k.name), time: r.at })}</div>`;
      if (r.s === 'lv' && r.at) return `<div class="vac">${T('🧳 Heute nur bis {time} Uhr da', { time: r.at })}</div>`;
      if (r.s === 'part') { let g = [[0, 1440]]; r.segs.forEach(([a, b]) => { g = segSub(g, a, b); }); return `<div class="vac">${T('🧳 Heute zeitweise weg: {list}', { list: g.map(([a, b]) => `${hm(a)}–${hm(b)}`).join(', ') })}</div>`; }
      return '';
    }

    _tilesHtml(list, stat, k) {
      return `<div class="tiles">${list.map((t) => {
          const { s, by, bySt } = stat[t.id];
          const once = t.sched === 'once';
          const w = s ? 'open' : this._win(t);
          const cls = s === 'taken' ? 'wait' : s === 'm' ? 'miss' : s === 'e' ? 'exc' : s || (w === 'before' ? 'wait' : w === 'after' ? 'miss' : '');
          const streak = once ? 0 : this._curStreak(t, k.id);
          const zl = this._zLinked(t), zgo = zl && !s && w === 'open' && !this._config.summary;
          const tm = !s && w === 'open' && !this._config.summary ? this._tmr(t) : null, rdr = !!k.rdr;
          let info = `+${(zl ? this._zPts(t, k.id, true) : (t.points || 0)) * this._mult(dk(new Date()), k.id)} ⭐${this._winTo(t) ? ` · ${T('bis {time}', { time: this._winTo(t) })}` : ''}`;
          if (s === 'taken') { const o = this._db.kid[by], nm = o ? esc(o.name) : T('Jemand'); info = bySt === 'p' ? T('⏳ {name} hat es gemacht – wartet auf Freigabe', { name: nm }) : T('✓ Schon erledigt von {name}', { name: nm }); }
          else if (s === 'p') info = T('wartet auf Freigabe');
          else if (s === 'x') info = T('verpasst · −{n} ⭐', { n: t.penalty || 0 });
          else if (s === 'm') info = T('verpasst');
          else if (s === 'e') info = T('entschuldigt 🙂');
          else if (t.penalty && w === 'open') info += ` · ${T('sonst evtl. −{n}', { n: t.penalty })}`;
          else if (w === 'before') info = T('ab {time} Uhr', { time: t.from });
          else if (w === 'after') info = T('Zeit vorbei');
          if (once && !s) info = `${T('⚡ Sonderaufgabe')} · ${info}`;
          if (t.virtual && t.part && !s) info = `${T('{n}. Mal', { n: t.part })} · ${info}`;
          const cl = this._calLabel(t, dk(new Date()));
          if (cl) info = `🗑️ ${esc(cl)}${s ? '' : ` · ${info}`}`;
          const xtra = this._isExtra(t);
          if (xtra && !s) info = `${T('🙋 Zusatzaufgabe')} · ${info}`;
          if (this._isShared(t) && !s) info = `${T('🤝 Einer reicht')} · ${info}`;
          if (t.photo && this._cfg.photoOn && this._approval && !s) info = `📷 ${info}`;
          if (t.rotate && !s) info = `🔄 ${info}`;
          if (this._routine(t) && !s) info = `📋 ${this._routDone(dk(new Date()), t.id, k.id, t.steps.length).length}/${t.steps.length} · ${info}`;
          // 🔊 Leseanfänger: statt Text nur die Sterne als Symbole
          if (rdr && !s && w === 'open') { const n = (zl ? this._zPts(t, k.id, true) : Number(t.points) || 0) * this._mult(dk(new Date()), k.id); info = n > 0 && n <= 5 ? '⭐'.repeat(n) : `+${n} ⭐`; }
          const badge = s === 'd' ? '✓' : s === 'p' ? '⏳' : s === 'taken' ? '🔒' : s === 'x' ? '✕' : s === 'm' ? '?' : s === 'e' ? '🙂' : w === 'before' ? '🕒' : w === 'after' ? '✕' : '';
          return `<button class="tile ${cls} ${once ? 'once' : ''} ${xtra ? 'extra' : ''} ${rdr ? 'rd' : ''}" data-a="ktap" data-t="${t.id}" data-k="${k.id}">
            ${rdr && !this._config.summary ? `<span class="say" data-a="say" data-t="${t.id}" data-k="${k.id}" role="button" aria-label="${esc(T('Vorlesen'))}">🔊</span>` : ''}
            ${streak >= 2 ? `<span class="fire">🔥${streak}</span>` : ''}
            <span class="e">${esc(t.emoji || '⭐')}</span><span class="t"><span>${esc(t.title)}</span></span>
            <span class="p">${info}</span>
            ${zgo ? `${this._zExtra(t, k.id) ? `<span class="zx">${T('🔥 Extra!')}</span>` : ''}<span class="zgo" data-a="zgo" data-t="${t.id}" data-k="${k.id}" role="button">${T('🦷 Los geht\'s!')}</span>` : ''}
            ${tm ? `<span class="tgo" data-a="tgo" data-t="${t.id}" data-k="${k.id}" role="button">${T('⏱️ {n} Min.', { n: tm.min })}</span>` : ''}
            ${badge ? `<span class="badge">${badge}</span>` : ''}</button>`;
        }).join('')}</div>`;
    }

    // ⏰ Tagesblöcke (optional): Morgens / Mittags / Nachmittags / Abends / Ohne Zeit – je mit eigenem Fortschritt
    _blk(t) { const f = String(t.from || ''), b = this._blkB(); return !f ? 'day' : f < b.mi ? 'm' : f < b.na ? 'mi' : f < b.a ? 'na' : 'a'; }
    _blkRank(t) { return ['m', 'mi', 'na', 'a', 'day'].indexOf(this._blk(t)); }
    _blockDefs() { return [['m', T('🌅 Morgens')], ['mi', T('☀️ Mittags')], ['na', T('🌇 Nachmittags')], ['a', T('🌙 Abends')], ['day', T('📌 Ohne Zeit')]]; }
    // Block offen? Von Hand umgeschaltet gilt für heute; sonst automatisch zu, wenn alle Zeitfenster vorbei sind
    _blkOpen(key, list) {
      this._blkO = this._blkO || {};
      const day = dk(new Date());
      if (this._blkO.day !== day) this._blkO = { day };
      if (this._blkO[key] !== undefined) return this._blkO[key];
      if (this._cfg.autoFold === false) return true;
      const ends = (list || []).map((t) => this._winTo(t)).filter(Boolean).sort();
      if (!ends.length || ends.length < list.length) return true;
      return hhmm(new Date()) <= ends[ends.length - 1];
    }

    // ⏰ Tagesblöcke (optional): Morgens / Mittags / Nachmittags / Abends / Ohne Zeit – je mit eigenem Fortschritt, einklappbar
    _dayBlocks(tasks, stat, k) {
      if (!tasks.length) return `<div class="empty">${T('Heute gibt es nichts zu tun 🎈')}</div>`;
      if (!this._cfg.dayBlocks) return this._tilesHtml(tasks, stat, k);
      const reqOf = (list) => list.filter((t) => this._req(t) && stat[t.id].s !== 'taken');
      const doneOf = (list) => reqOf(list).filter((t) => stat[t.id].s === 'd').length;
      return this._blockDefs().map(([id, label]) => {
        const list = tasks.filter((t) => this._blk(t) === id);
        if (!list.length) return '';
        const rq = reqOf(list), key = `${k.id}:${id}`, open = this._blkOpen(key, list);
        return `<button type="button" class="sect blkh" data-a="blkfold" data-id="${key}" data-open="${open ? 1 : 0}" aria-expanded="${open}" title="${esc(T('Ein-/Ausklappen'))}"><span class="chev">${open ? '▾' : '▸'}</span><span class="grow">${label}</span>${rq.length ? `<span class="hint">${T('{done}/{total} erledigt', { done: doneOf(list), total: rq.length })}</span>` : ''}</button>${open ? this._tilesHtml(list, stat, k) : ''}`;
      }).join('');
    }

    _avc(k, big) { return `<span class="avc ${big ? 'big' : ''}" style="${cv(k.color)}">${esc(k.emoji || '🙂')}</span>`; }

    // 👆 Übersichtskarte antippen (tap_action / double_tap_action / hold_action wie bei Home-Assistant-Karten)
    _sumActs() {
      if (!this._config || !this._config.summary) return null;
      const ok = (a) => a && typeof a === 'object' && a.action && a.action !== 'none';
      const r = {};
      ['tap', 'double_tap', 'hold'].forEach((x) => { if (ok(this._config[`${x}_action`])) r[x] = this._config[`${x}_action`]; });
      return Object.keys(r).length ? r : null;
    }

    _sumFire(kid, kind) {
      const k = this._db.kid[kid], acts = this._sumActs();
      if (!k || !acts || !acts[kind]) return;
      const sl = slug(k.name);
      const sub = (v) => (typeof v === 'string' ? v.replace(/\{kind\}/g, sl) : Array.isArray(v) ? v.map(sub) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([a, b]) => [a, sub(b)])) : v);
      const conf = { entity: `sensor.yippee_${sl}` };
      ['tap', 'double_tap', 'hold'].forEach((x) => { if (acts[x]) conf[`${x}_action`] = sub(acts[x]); });
      this.dispatchEvent(new CustomEvent('hass-action', { detail: { config: conf, action: kind }, bubbles: true, composed: true }));
    }

    // Gesten: lange drücken (500 ms) · doppelt tippen (innerhalb 250 ms) · einmal tippen – nur wenn die jeweilige Aktion eingestellt ist
    _sumPointer(e) {
      const el = e.target && e.target.closest && e.target.closest('.ksum.act');
      if (!el) return;
      const kid = el.dataset.kid, acts = this._sumActs() || {}, g = this._sumG || (this._sumG = {});
      if (e.type === 'pointerdown') {
        g.held = false; g.x = e.clientX; g.y = e.clientY;
        clearTimeout(g.hT);
        if (acts.hold) g.hT = setTimeout(() => { g.held = true; this._sumFire(kid, 'hold'); }, 500);
      } else if (e.type === 'pointermove') {
        if (Math.abs(e.clientX - g.x) > 10 || Math.abs(e.clientY - g.y) > 10) clearTimeout(g.hT); // Scrollen ist kein langes Drücken
      } else if (e.type === 'pointercancel') {
        clearTimeout(g.hT);
      } else if (e.type === 'pointerup') {
        clearTimeout(g.hT);
        if (g.held) { g.held = false; return; }
        if (Math.abs(e.clientX - g.x) > 10 || Math.abs(e.clientY - g.y) > 10) return;
        if (acts.double_tap) {
          if (g.tT && g.tKid === kid) { clearTimeout(g.tT); g.tT = null; this._sumFire(kid, 'double_tap'); return; }
          g.tKid = kid; g.tT = setTimeout(() => { g.tT = null; this._sumFire(kid, 'tap'); }, 250);
        } else this._sumFire(kid, 'tap');
      }
    }

    // 🧒 Kompakte Übersicht pro Kind (summary: true) – Punkte, heute, Ziel, Level, Bilanz; Teile über show: […] wählbar
    _kidSum(k) {
      const sh = Array.isArray(this._config.show) && this._config.show.length ? this._config.show : ['points', 'today', 'goal', 'level', 'net'];
      const pts = k.points || 0, tasks = this._todayTasks(k.id).filter((t) => this._req(t) && this._status(t, k.id).s !== 'taken');
      const done = tasks.filter((t) => this._status(t, k.id).s === 'd').length, wait = tasks.filter((t) => this._status(t, k.id).s === 'p').length;
      const goal = this._cfg.goalOn !== false && k.goal && this._db.reward[k.goal] && this._rwFor(this._db.reward[k.goal], k.id) ? this._db.reward[k.goal] : null;
      const tot = k.total !== undefined ? k.total : pts, lv = levelOf(tot), L = LEVELS[lv];
      const pct = (a, b) => Math.max(0, Math.min(100, Math.round((a / Math.max(1, b)) * 100)));
      const net = this._dayNet(k, dk(new Date()));
      const act = this._sumActs();
      return `<div class="card ksum ${act ? 'act' : ''}" data-kid="${esc(k.id)}" ${act ? `role="button" tabindex="0" aria-label="${esc(k.name)}"` : ''} style="${cv(k.color)}"><div class="ksh">${this._avc(k)}<div class="grow"><div class="kn">${esc(k.name)}</div>${sh.includes('points') ? `<div class="kp">${T('⭐ {n} Punkte', { n: pts })}</div>` : ''}</div>
        ${sh.includes('today') && tasks.length ? `<div class="ksd">${done}/${tasks.length}${done === tasks.length ? ' ✅' : ''}</div>` : ''}</div>
        ${sh.includes('today') ? (tasks.length ? `<div class="bar"><i style="width:${pct(done, tasks.length)}%"></i></div>${wait ? `<div class="hint">${T('⏳ {n} wartet auf Freigabe', { n: wait })}</div>` : ''}` : `<div class="hint">${T('heute nichts zu tun')}</div>`) : ''}
        ${sh.includes('goal') && goal ? `<div class="hint">🎯 ${esc(goal.title)} · ${Math.max(0, Math.min(pts, this._cost(goal, k.id)))}/${this._cost(goal, k.id)}</div><div class="bar"><i style="width:${pct(pts, this._cost(goal, k.id))}%"></i></div>` : ''}
        ${sh.includes('level') ? `<div class="hint">${L[2]} ${T('Level {n}', { n: lv + 1 })} · ${T(L[1])}</div>` : ''}
        ${sh.includes('net') && this._cfg.negOn ? `<div class="hint">${T('Bilanz heute: {n} ⭐', { n: net > 0 ? `+${net}` : net < 0 ? `−${-net}` : '±0' })}</div>` : ''}</div>`;
    }

    _kidHtml(k) {
      if (this._config.summary) return this._kidSum(k);
      const pts = k.points || 0;
      const tasks = this._todayTasks(k.id);
      const stat = {};
      tasks.forEach((t) => { stat[t.id] = this._status(t, k.id); });
      const reqT = tasks.filter((t) => this._req(t) && stat[t.id].s !== 'taken');
      const done = reqT.filter((t) => stat[t.id].s === 'd').length;
      const wait = tasks.filter((t) => stat[t.id].s === 'p').length;
      const rewards = this._rewards(k.id), kc = (r) => this._cost(r, k.id);
      const gOn = this._cfg.goalOn !== false;
      const goal = gOn && k.goal && this._db.reward[k.goal] && this._rwFor(this._db.reward[k.goal], k.id) && !this._advR(this._db.reward[k.goal]) ? this._db.reward[k.goal] : null;
      const next = rewards.find((r) => kc(r) > pts);
      const target = goal || next;
      const reqs = Object.values(this._db.req).filter((q) => q.kid === k.id);
      const fold = !!this._config.collapsed;
      this._opens = this._opens || {};
      const open = !fold || !!this._opens[k.id];
      const cfg = this._cfg, rate = Number(cfg.moneyRate) || 10;
      const money = cfg.moneyOn ? ` <span class="eur">≈ ${euro(pts, rate)}</span>` : '';
      const tot = k.total !== undefined ? k.total : pts;
      const lv = levelOf(tot), L = LEVELS[lv], nxt = LEVELS[lv + 1];
      const lvTxt = `${L[2]} ${T('Level {n}', { n: lv + 1 })} · ${T(L[1])}${nxt && !fold ? ` <span class="hint">· ${T('noch {n} ⭐ bis Level {lvl}', { n: nxt[0] - tot, lvl: lv + 2 })}</span>` : ''}`;
      const head = `<div class="kh">${this._avc(k, true)}<div class="kgrow"><div class="kn">${fold ? esc(k.name) : T('Hallo {name}!', { name: esc(k.name) })}</div><div class="kp">${T('⭐ {n} Punkte', { n: pts })}${money}</div>${cfg.negOn ? (() => { const nt = this._dayNet(k, dk(new Date())); return `<div class="hint knet ${nt < 0 ? 'neg' : ''}">${T('Bilanz heute: {n} ⭐', { n: nt > 0 ? `+${nt}` : nt < 0 ? `−${-nt}` : '±0' })}</div>`; })() : ''}<div class="lvl">${lvTxt}</div>
          ${fold ? `<div class="hint">${T('{done}/{total} heute erledigt', { done, total: reqT.length })}${wait ? ` · ${T('{n} wartet auf Freigabe', { n: wait })}` : ''}${goal ? ` · 🎯 ${Math.min(pts, kc(goal))}/${kc(goal)}` : ''}</div>` : ''}</div>
          ${fold ? `<span class="chev ${open ? 'up' : ''}">▾</span>` : ''}</div>`;
      const isBd = this._cfg.bdOn && this._isBday(k, dk(new Date()));
      if (fold && !open) {
        return `<div class="card fold" style="${cv(k.color)}"><button class="khbtn" data-a="kfold" data-k="${k.id}">${head}
          ${reqT.length ? `<div class="bar"><i style="width:${Math.round((done / reqT.length) * 100)}%"></i></div>` : ''}</button></div>`;
      }
      let targetHtml = '';
      if (target) {
        const pct = Math.max(0, Math.min(100, Math.round((pts / Math.max(1, kc(target))) * 100)));
        const txt = goal
          ? (pts >= kc(goal) ? T('🎯 Ziel erreicht: <b>{emoji} {title}</b> – jetzt einlösen!', { emoji: esc(goal.emoji || '🎁'), title: esc(goal.title) }) : T('🎯 Mein Ziel: <b>{emoji} {title}</b> · noch <b>{n}</b> ⭐', { emoji: esc(goal.emoji || '🎁'), title: esc(goal.title), n: kc(goal) - pts }))
          : `${T('Noch <b>{n}</b> ⭐ bis {emoji} {title}', { n: kc(next) - pts, emoji: esc(next.emoji || '🎁'), title: esc(next.title) })} ${gOn ? `<span class="hint">${T('· tippe 🎯 bei einer Belohnung für dein Ziel')}</span>` : ''}`;
        const eta = this._cfg.progOn && kc(target) > pts ? this._etaTxt(kc(target) - pts, this._rate(k.id), false) : '';
        targetHtml = `<div class="next ${goal ? 'isgoal' : ''}"><div class="${goal ? 'gtxt' : 'hint'}">${txt}</div><div class="bar ${goal ? 'big' : ''}"><i style="width:${pct}%"></i></div>${eta ? `<div class="hint">${eta}</div>` : ''}</div>`;
      }
      const banners = `${this._shareBanner(k, pts)}
        ${this._cfg.bdOn && this._isBday(k, dk(new Date())) ? `<div class="bday bdtap" data-a="bdparty" data-k="${k.id}">${T('🎂 Alles Gute zum Geburtstag, {name}!', { name: esc(k.name) })}${this._cfg.bdFree ? ` ${T('Heute hast du aufgabenfrei 🎈')}` : ''}${Number(this._cfg.bdMult) > 1 ? ` ${T('Heute gibt es ×{n} Sterne!', { n: Number(this._cfg.bdMult) })}` : ''} <small>${T('(antippen 🎉)')}</small></div>` : ''}
        ${this._isDbl(dk(new Date())) && !this._isOff(dk(new Date()), k.id) ? `<div class="dbl">⭐×2 ${T('Heute gibt es für jede Aufgabe doppelte Sterne!')}</div>` : ''}
        ${!this._onVacation(dk(new Date()), k.id) && this._cfg.hc && this._pubHol(dk(new Date())) ? `<div class="vac">${T('🎉 Feiertag: {name}', { name: esc(this._pubHol(dk(new Date()))) })}${this._cfg.holFree !== false ? ` – ${T('heute keine Aufgaben!')}` : ''}</div>` : ''}
        ${!this._onVacation(dk(new Date()), k.id) && this._cfg.hc && !this._pubHol(dk(new Date())) && this._schoolHol(dk(new Date())) ? `<div class="vac">🎒 ${esc(this._schoolHol(dk(new Date())))}${this._cfg.ferFree ? ` – ${T('heute keine Aufgaben!')}` : ` – ${T('Schul-Aufgaben haben Pause')}`}</div>` : ''}
        ${this._welcHtml(k)}
        ${this._presBanner(k)}
        ${this._onVacation(dk(new Date()), k.id) ? `<div class="vac">${T('🏖️ Urlaub! Heute sind keine Aufgaben fällig – genießt die freie Zeit.')}</div>` : ''}`;
      const badgesHtml = (() => {
          // 🏅 Abzeichen: zugeklappt nur Zähler + verdiente Abzeichen, aufgeklappt alle (gemerkt pro Gerät)
          const got = BADGES.filter((b) => b[3](k)), o = this._kvOpen(k.id, 'b');
          // 📅 Rückblick (letzter Monat, im Januar auch das Jahr) – ein Knopf unter den Abzeichen; roter Punkt = neu und noch nicht angesehen
          const rcpHtml = this._rcpList(k).map((r) => `<div class="badges"><button type="button" class="kvbtn" data-a="rcpopen" data-k="${k.id}" data-x="${esc(r.key)}"><span class="kve">📅</span> ${esc(r.title)}${r.fresh && !this._rcpSeen(k.id, r.key) ? '<span class="kvdot"></span>' : ''} <span class="accc">▸</span></button></div>`).join('');
          return `<div class="badges"><button type="button" class="kvbtn" data-a="kvtog" data-x="b" data-k="${k.id}" aria-expanded="${o}">🏅 ${T('Abzeichen {n}/{total}', { n: got.length, total: BADGES.length })}${o ? '' : ` <span class="kvgot">${got.map((b) => b[1]).join('')}</span>`} <span class="accc">▸</span></button>${o ? BADGES.map((b) => `<span class="bdg ${b[3](k) ? 'on' : ''}" data-a="bdgi" data-b="${b[0]}" data-k="${k.id}" title="${esc(T(b[2]))}">${b[1]}</span>`).join('') : ''}</div>${rcpHtml}`;
      })();
      const tasksHtml = `${this._cfg.dayBlocks || (this._presCfg(k.pres) && this._pres(k.id, dk(new Date())).s === 'out') ? '' : `<div class="sect"><span>${T('Heute')}</span><span class="hint">${T('{done}/{total} erledigt', { done, total: reqT.length })}</span></div>`}
        ${reqT.length && done === reqT.length ? `<div class="trophy">${T('🏆 Alles geschafft – super!')}</div>` : ''}
        ${this._presCfg(k.pres) && this._pres(k.id, dk(new Date())).s === 'out' ? '' : this._dayBlocks(tasks, stat, k)}
        ${this._previewHtml(k)}`;
      const rwHtml = `${rewards.length || this._cfg.wishOn || (this._cfg.gradesOn && this._cfg.gKids !== false) ? `<div class="sect"><span>${T('Belohnungen')}</span>${this._cfg.jokerOn && k.jokers > 0 ? `<button class="btn sm" data-a="joker" data-k="${k.id}">${T('🃏 Joker ×{n}', { n: k.jokers })}</button>` : ''}${this._cfg.gradesOn && this._cfg.gKids !== false ? `<button class="btn sm" data-a="kgrade" data-k="${k.id}">${T('🎓 Note')}</button>` : ''}${this._cfg.wishOn ? `<button class="btn sm" data-a="wish" data-k="${k.id}">${T('💡 Wunsch')}</button>` : ''}</div>` : ''}
        ${this._cfg.wishOn ? Object.values(this._db.req).filter((q) => q.kid === k.id && q.wish).map((q) => `<div class="wish">${esc(q.wish.emoji || '💡')} <span class="grow">${esc(q.wish.title)}</span><span class="hint">${T('wartet auf Mama/Papa')}</span></div>`).join('') : ''}
        ${this._cfg.gradesOn ? reqs.filter((q) => q.grade).map((q) => `<div class="wish">🎓 <span class="grow">${q.grade.rep ? esc(T('Zeugnis')) : `${esc(q.grade.s)}: ${esc(this._gFmt(q.grade.g))}`}</span><span class="hint">${T('wartet auf Mama/Papa')}</span></div>`).join('') : ''}
        ${rewards.length ? (() => {
          const vis = rewards.filter((r) => !this._shareOn(r) || this._shareKids(r).includes(k.id));
          const canNow = (r) => !this._shareOn(r) && pts >= kc(r) && !(r.limit && this._usedWeek(k, r.id) >= r.limit && !reqs.some((q) => q.reward === r.id));
          const ready = this._rwSorted(vis.filter(canNow), k.id), gs = [...(ready.length ? [[T('✨ Jetzt einlösbar'), ready]] : []), ...this._rwGroups(vis.filter((r) => !canNow(r)), k.id, true)];
          return gs.map(([gt, gl]) => `${gs.length > 1 ? `<div class="rwh">${gt}</div>` : ''}<div class="rws">${gl.map((r) => {
          if (this._shareOn(r)) return this._shareTile(r, k, pts, gOn);
          const asked = reqs.some((q) => q.reward === r.id);
          const used = r.limit ? this._usedWeek(k, r.id) : 0, full = !!r.limit && used >= r.limit && !reqs.some((q) => q.reward === r.id);
          const ok = pts >= kc(r) && !full;
          const isGoal = gOn && k.goal === r.id;
          return `<div class="rw ${isGoal ? 'goal' : ''}">${gOn ? `<button class="goalbtn ${isGoal ? 'on' : ''}" data-a="goal" data-r="${r.id}" data-k="${k.id}" title="${esc(T('Als Ziel wählen'))}">🎯</button>` : ''}
            <span class="e">${esc(r.emoji || '🎁')}</span><span class="t">${esc(r.title)}</span><span class="pts">${kc(r)} ⭐</span>
            <div class="bar"><i style="width:${Math.max(0, Math.min(100, Math.round((pts / Math.max(1, kc(r))) * 100)))}%"></i></div>
            ${r.limit ? `<span class="hint">${T('{used}/{limit}× diese Woche', { used, limit: r.limit })}</span>` : ''}
            <button class="btn ${ok || asked ? 'primary' : ''}" data-a="req" data-r="${r.id}" data-k="${k.id}" ${ok || asked ? '' : 'disabled'}>${asked ? T('⏳ angefragt') : full ? T('diese Woche aufgebraucht') : ok ? T('Einlösen') : T('noch {n} ⭐', { n: kc(r) - pts })}</button></div>`;
        }).join('')}</div>`).join(''); })() : ''}
        ${this._cfg.walletOn && (k.vouch || []).length ? `<div class="sect"><span>${T('🎟️ Meine Gutscheine')}</span><span class="hint">${T('Mama oder Papa haken ab, wenn du es bekommen hast')}</span></div>
          <div class="vchs">${k.vouch.map((v) => `<button class="wish vch" data-a="vuse" data-k="${k.id}" data-v="${esc(v.id)}">${esc(v.e || '🎁')} <span class="grow">${esc(v.t)}</span><span class="hint">${this._vSure(k.id, v.id) ? T('Bekommen? Nochmal tippen') : `${shortDate(v.d)} · ✓`}</span></button>`).join('')}</div>` : ''}`;
      // 🧒 Kompakte Kinder-Ansicht (1.9): Kopf, Sammel-Knöpfe, „Jetzt dran“ und eine Leiste unten (Heute · Belohnungen · Sammlung)
      if (!fold && this._kView() === 'compact') return this._kidCompact(k, { pts, money, lv, L, nxt, tot, goal, target, kc, tasks, stat, reqT, done, banners, badgesHtml, rwHtml, rewards, reqs, isBd });
      return `<div class="card ${fold ? 'fold' : ''}" style="${cv(k.color)}">
        ${fold ? `<button class="khbtn" data-a="kfold" data-k="${k.id}">${head}</button><div class="kbody ${this._animK === k.id ? 'anim' : ''}">` : isBd ? `<div class="bdtap" data-a="bdparty" data-k="${k.id}">${head}</div>` : head}
        ${this._advBtn(k)}
        ${targetHtml}
        ${banners}
        ${badgesHtml}
        ${this._zKidHtml(k)}
        ${tasksHtml}
        ${rwHtml}
        ${fold ? '</div>' : ''}
      </div>`;
    }

    // Hinweis oben im Kinder-Dashboard: „X lädt dich ein“ bzw. „X möchte mit dir teilen – machst du mit?“
    _shareBanner(k, pts) {
      if (!this._cfg.shareOn) return '';
      return Object.values(this._db.req).filter((q) => q.pool && (q.need || []).includes(k.id) && this._db.reward[q.reward]).map((q) => {
        const r = this._db.reward[q.reward], cov = q.cov || {}, by = cov[k.id];
        if (by === k.id) return '';
        const em = esc(r.emoji || '🎁'), title = esc(r.title);
        if (by) return `<div class="shban">${T('💝 {name} lädt dich ein: {emoji} „{title}“!', { name: esc(this._kn(by)), emoji: em, title })}${this._poolDone(q) ? ` <span class="hint">${T('wartet auf Mama/Papa')}</span>` : ''}</div>`;
        if (q.kid === k.id || this._poolDone(q)) return '';
        const mine = this._shareCost(r, k.id, (q.need || []).length);
        return `<div class="shban"><span class="grow">${T('👫 {name} möchte {emoji} „{title}“ mit dir teilen – machst du mit?', { name: esc(this._kn(q.kid)), emoji: em, title })}</span>
          <button class="btn sm ${pts >= mine ? 'primary' : ''}" data-a="shr" data-m="share" data-r="${r.id}" data-k="${k.id}" ${pts >= mine ? '' : 'disabled'}>${pts >= mine ? T('👫 Mitmachen ({n} ⭐)', { n: mine }) : T('noch {n} ⭐', { n: mine - pts })}</button></div>`;
      }).join('');
    }

    _shareTile(r, k, pts, gOn) {
      const need = this._shareKids(r), q = this._pool(r.id), cov = (q && q.cov) || {}, paid = (q && q.paid) || {};
      const mine = this._shareCost(r, k.id, need.length), full = this._cost(r, k.id), others = need.filter((id) => id !== k.id);
      const open = need.filter((id) => !cov[id]), restAmt = open.reduce((a, id) => a + this._shareCost(r, id, need.length), 0);
      const used = r.limit ? this._usedWeek(k, r.id) : 0, lim = !!r.limit && used >= r.limit && !q;
      const isGoal = gOn && k.goal === r.id, done = this._poolDone(q);
      const st = q ? `<div class="shst">${need.map((id) => `<span class="${cov[id] ? 'ok' : ''}">${cov[id] ? '✓' : '⏳'} ${esc(this._kn(id))}${cov[id] && cov[id] !== id ? ` 💝` : ''}</span>`).join('')}</div>` : '';
      let btns;
      if (lim) btns = `<button class="btn" disabled>${T('diese Woche aufgebraucht')}</button>`;
      else if (done) btns = `<button class="btn primary" data-a="shr" data-m="back" data-r="${r.id}" data-k="${k.id}" ${paid[k.id] ? '' : 'disabled'}>${T('⏳ angefragt')}</button>`;
      else if (paid[k.id]) btns = `<button class="btn" data-a="shr" data-m="back" data-r="${r.id}" data-k="${k.id}">${T('✓ Bezahlt – zurücknehmen')}</button>${open.length ? `<button class="btn ${pts >= restAmt ? 'primary' : ''}" data-a="shr" data-m="rest" data-r="${r.id}" data-k="${k.id}" ${pts >= restAmt ? '' : 'disabled'}>${T('💝 Rest übernehmen ({n} ⭐)', { n: restAmt })}</button>` : ''}`;
      else if (q) btns = `<button class="btn ${pts >= mine ? 'primary' : ''}" data-a="shr" data-m="share" data-r="${r.id}" data-k="${k.id}" ${pts >= mine ? '' : 'disabled'}>${pts >= mine ? T('👫 Mitmachen ({n} ⭐)', { n: mine }) : T('noch {n} ⭐', { n: mine - pts })}</button>`;
      else btns = `<button class="btn ${pts >= mine ? 'primary' : ''}" data-a="shr" data-m="share" data-r="${r.id}" data-k="${k.id}" ${pts >= mine ? '' : 'disabled'}>${pts >= mine ? T('👫 Teilen ({n} ⭐)', { n: mine }) : T('noch {n} ⭐', { n: mine - pts })}</button>
        <button class="btn" data-a="shr" data-m="invite" data-r="${r.id}" data-k="${k.id}" ${pts >= full ? '' : 'disabled'}>${T('💝 Einladen ({n} ⭐)', { n: full })}</button>`;
      return `<div class="rw shrw ${isGoal ? 'goal' : ''}">${gOn ? `<button class="goalbtn ${isGoal ? 'on' : ''}" data-a="goal" data-r="${r.id}" data-k="${k.id}" title="${esc(T('Als Ziel wählen'))}">🎯</button>` : ''}
        <span class="e">${esc(r.emoji || '🎁')}</span><span class="t">${esc(r.title)}</span><span class="pts">${mine} ⭐</span>
        <span class="hint">${T('👫 Gemeinsam mit {names} – jeder zahlt {n} ⭐', { names: esc(this._names(others)), n: mine })}</span>
        ${q && !paid[k.id] && !done ? `<span class="hint shask">${T('{name} möchte „{title}“ – machst du mit?', { name: esc(this._kn(q.kid)), title: esc(r.title) })}</span>` : ''}
        <div class="bar"><i style="width:${Math.max(0, Math.min(100, Math.round((pts / Math.max(1, mine)) * 100)))}%"></i></div>
        ${r.limit ? `<span class="hint">${T('{used}/{limit}× diese Woche', { used, limit: r.limit })}</span>` : ''}
        ${st}<div class="shbtns">${btns}</div></div>`;
    }


    _adminHtml(...a) { return this._admCall('_adminHtml', a, true); }

    // 🤖 Aktionen für fertige Automationen: Push an die Eltern-Ziele (🔔) bzw. Durchsage über die Lautsprecher (🔊)
    _autoPush(title, msg) {
      return (this._cfg.targets || []).map((t) => (t.includes('.')
        ? { action: 'notify.send_message', target: { entity_id: t }, data: { title, message: msg }, continue_on_error: true }
        : { action: `notify.${t}`, data: { title, message: msg }, continue_on_error: true }));
    }
    _autoSay(msg) {
      const c = this._cfg, out = [];
      if (c.rNotify) out.push({ action: `notify.${c.rNotify}`, data: { message: msg, data: { type: 'tts' } }, continue_on_error: true });
      if (c.rTts && (c.rPlayers || []).length) out.push({ action: 'tts.speak', target: { entity_id: c.rTts }, data: { media_player_entity_id: c.rPlayers, message: msg }, continue_on_error: true });
      return out;
    }

    _autoCfg(kind) {
      if (kind === 'famgoal') {
        const goal = "{{ state_attr('sensor.yippee_familienziel', 'ziel') }}";
        return {
          alias: 'Yippee! - Kids Chores – Familienziel erreicht', description: 'Durchsage und Nachricht, sobald das Familienziel erreicht ist (angelegt von der Yippee!-Karte, nutzt sensor.yippee_familienziel)', mode: 'single',
          triggers: [{ trigger: 'template', value_template: "{{ state_attr('sensor.yippee_familienziel', 'erreicht') == true }}" }],
          actions: [...this._autoSay(`${T('Familienziel erreicht!')} ${goal}`), ...this._autoPush(T('⭐ Yippee! - Kids Chores'), `🎉 ${T('Familienziel erreicht!')} ${goal}`)],
        };
      }
      if (kind === 'remind') {
        const at = /^\d\d:\d\d$/.test(this._cfg.remT || '') ? this._cfg.remT : '19:00';
        return {
          alias: 'Yippee! - Kids Chores – Abend-Erinnerung', description: 'Nachricht an die Eltern, wenn ein Kind am Abend noch nicht alles erledigt hat (angelegt von der Yippee!-Karte, nutzt die sensor.yippee_…-Sensoren)', mode: 'single',
          triggers: [{ trigger: 'time', at: `${at}:00` }],
          variables: { offen: "{% set ns = namespace(l=[]) %}{% for s in states.sensor if s.entity_id.startswith('sensor.yippee_') and s.entity_id != 'sensor.yippee_familienziel' and (s.attributes.heute_gesamt | int(0)) > 0 and s.attributes.alles_erledigt == false and s.attributes.anwesend != false %}{% set ns.l = ns.l + [(s.attributes.friendly_name | default(s.entity_id) | replace('Yippee! ', '')) ~ ': ' ~ ((s.attributes.offen or []) | join(', '))] %}{% endfor %}{{ ns.l | join('\\n') }}" },
          conditions: [{ condition: 'template', value_template: '{{ offen | length > 0 }}' }],
          actions: this._autoPush(T('⭐ Yippee! - Kids Chores'), `${T('📋 Noch nicht alles erledigt:')}\n{{ offen }}`),
        };
      }
      if (kind === 'bg') {
        const times = this._bgTimes || (this._bgTimes = this._planBuild().times), trig = [];
        if (times.length) trig.push({ trigger: 'time', at: times.map((t) => `${t}:00`) });
        if (this._cfg.cmdOn) trig.push({ trigger: 'event', event_type: 'telegram_command' });
        if (!trig.length) trig.push({ trigger: 'time', at: '03:33:00' });
        return {
          alias: 'Yippee! - Kids Chores – Hintergrund', description: 'Morgen-Ansage, Erinnerungen, Verpasst-Meldungen, Tagesabschluss und Telegram-Befehle – auch ohne geöffnete Karte. Die Uhrzeiten trägt die Yippee!-Karte selbst ein.', mode: 'queued',
          triggers: trig,
          actions: [
            { action: 'todo.get_items', target: { entity_id: this._config.storage }, data: { status: ['needs_action', 'completed'] }, response_variable: 'kp' },
            { repeat: { for_each: this._bgTpl(), sequence: [{ action: '{{ repeat.item.a }}', data: '{{ repeat.item.d }}', continue_on_error: true }] } },
          ],
        };
      }
      const add = (src, u) => ({ action: 'todo.add_item', target: { entity_id: this._config.storage }, data: { item: 'kp|act|{{ now().timestamp() | int }}{{ range(1000, 9999) | random }}', description: `{{ {'a': ${src}${u ? `, 'u': ${u}` : ''}} | to_json }}` } });
      if (kind === 'nfc') {
        return {
          alias: 'Yippee! - Kids Chores – NFC-Tags', description: 'Aufgaben per NFC-Tag abhaken (angelegt von der Yippee!-Karte). Die Tag-IDs trägt die Karte selbst ein.', mode: 'queued',
          triggers: [{ trigger: 'event', event_type: 'tag_scanned' }],
          conditions: [{ condition: 'template', value_template: `{{ (trigger.event.data.tag_id | default('')) in ${JSON.stringify(this._nfcTags())} }}` }],
          actions: [add("'KP|nfc|' ~ trigger.event.data.tag_id", "trigger.event.context.user_id | default('')")],
        };
      }
      if (kind === 'voice') {
        const S = (a) => [...new Set([T(a), a])];
        return {
          alias: 'Yippee! - Kids Chores – Sprachbefehle', description: 'Den Sprachassistenten nach offenen Aufgaben und Sternen fragen (angelegt von der Yippee!-Karte)', mode: 'queued',
          triggers: [
            { trigger: 'conversation', id: 'open', command: [...S('Was muss {name} heute noch machen'), ...S('Was muss {name} noch machen'), 'What does {name} still have to do today'] },
            { trigger: 'conversation', id: 'pts', command: [...S('Wie viele Sterne hat {name}'), ...S('Wie viele Punkte hat {name}'), 'How many stars does {name} have'] },
          ],
          actions: [
            { action: 'todo.get_items', target: { entity_id: this._config.storage }, data: { status: ['needs_action', 'completed'] }, response_variable: 'kp' },
            { set_conversation_response: this._voiceTpl() },
          ],
        };
      }
      if (kind === 'app') {
        // 📱 Nach dem Tippen auf ✓/✕: dieselbe Nachricht sofort auf allen ausgewählten Handys entfernen – auch ohne geöffnete Karte
        // (Kennung wie pushTag() in der Karte: yippee_<Gruppe>_<Rest der Aktion>)
        const phones = this._appPhones(), grp = JSON.stringify(PUSH_GRP).replace(/"/g, "'");
        return {
          alias: 'Yippee! - Kids Chores – Knöpfe in Benachrichtigungen', description: 'Freigeben/Ablehnen direkt aus der Push-Nachricht – die Nachricht verschwindet danach auf allen Handys (angelegt von der Yippee!-Karte)', mode: 'queued',
          triggers: [{ trigger: 'event', event_type: 'mobile_app_notification_action' }],
          conditions: [{ condition: 'template', value_template: "{{ (trigger.event.data.action | default('')).startswith('KP|') }}" }],
          actions: [
            add('trigger.event.data.action', "trigger.event.context.user_id | default('')"),
            ...(phones.length ? [
              { variables: { kp_tag: `{% set p = trigger.event.data.action.split('|') %}{% set g = ${grp}.get(p[1] if p | count > 1 else '', '') %}{{ ('yippee_' ~ g ~ '_' ~ (p[2:] | join('_'))) | regex_replace('[^A-Za-z0-9_-]', '_') if g else '' }}` } },
              { if: [{ condition: 'template', value_template: "{{ kp_tag != '' }}" }], then: phones.map((t) => ({ action: `notify.${t}`, continue_on_error: true, data: { message: 'clear_notification', data: { tag: '{{ kp_tag }}' } } })) },
            ] : []),
          ],
        };
      }
      if (kind === 'cmd') {
        return {
          alias: 'Yippee! - Kids Chores – Telegram-Befehle', description: '/punkte, /offen, /heute, /woche und /hilfe im Telegram-Chat (angelegt von der Yippee!-Karte)', mode: 'queued',
          triggers: [{ trigger: 'event', event_type: 'telegram_command' }],
          conditions: [{ condition: 'template', value_template: "{{ ((trigger.event.data.command | default('')).split('@')[0] | lower) in ['/punkte', '/offen', '/heute', '/woche', '/hilfe'] }}" }],
          actions: [add("'KPC|' ~ (trigger.event.data.command.split('@')[0] | lower)[1:]")],
        };
      }
      return {
        alias: 'Yippee! - Kids Chores – Telegram-Knöpfe', description: 'Freigeben/Ablehnen direkt aus der Telegram-Nachricht (angelegt von der Yippee!-Karte)', mode: 'queued',
        triggers: [{ trigger: 'event', event_type: 'telegram_callback' }],
        conditions: [{ condition: 'template', value_template: "{{ (trigger.event.data.data | default('')).startswith('/KP|') }}" }],
        actions: [
          add('trigger.event.data.data[1:]'),
          { action: 'telegram_bot.answer_callback_query', continue_on_error: true, data: { callback_query_id: '{{ trigger.event.data.id }}', message: '✓ Erledigt' } },
          { action: 'telegram_bot.edit_replymarkup', continue_on_error: true, data: { chat_id: '{{ trigger.event.data.chat_id }}', message_id: '{{ trigger.event.data.message.message_id }}', inline_keyboard: [] } },
        ],
      };
    }


    // 🤖 Skript script.yippee_sterne: Sterne geben/abziehen aus Automationen, Skripten und Sprachassistenten
    _ptsScript() {
      return {
        alias: 'Yippee! - Kids Chores – Sterne geben/abziehen', mode: 'queued', icon: 'mdi:star-plus',
        description: 'Gibt einem Kind Sterne (positive Zahl) oder zieht welche ab (negative Zahl). Gebucht wird, sobald eine Yippee!-Karte geöffnet ist. (angelegt von der Yippee!-Karte)',
        fields: {
          kind: { name: 'Kind', description: 'Name des Kindes (wie in der Karte)', required: true, example: 'Mia', selector: { text: {} } },
          sterne: { name: 'Sterne', description: 'Positiv = geben, negativ = abziehen', required: true, example: 2, selector: { number: { min: -100, max: 100, mode: 'box' } } },
          grund: { name: 'Grund', description: 'Steht im Punkte-Verlauf (optional)', required: false, example: 'Sprachassistent', selector: { text: {} } },
        },
        sequence: [{ action: 'todo.add_item', target: { entity_id: this._config.storage }, data: { item: 'kp|act|{{ now().timestamp() | int }}{{ range(1000, 9999) | random }}', description: "{{ {'a': 'KP|pts|' ~ (kind | string | replace('|', '/')) ~ '|' ~ (sterne | int(0)) ~ '|' ~ (grund | default('') | string | replace('|', '/'))} | to_json }}" } }],
      };
    }


    async _scriptCreate() {
      if (!this._admin()) { this._toast(T('Anlegen nicht möglich (nur als Administrator) – bitte YAML kopieren')); return; }
      try { await this._hass.callApi('POST', `config/script/config/${SCRIPT_ID}`, this._ptsScript()); this._scriptOk = true; this._toast(T('✓ Skript angelegt: script.yippee_sterne')); } catch (e) { this._toast(T('Anlegen nicht möglich (nur als Administrator) – bitte YAML kopieren')); }
      this._render();
    }

    async _autoCreate(kind, silent) {
      if (!this._admin()) { if (!silent) this._toast(T('Anlegen nicht möglich (nur als Administrator) – bitte YAML kopieren')); return; }
      const id = AUTO_IDS[kind];
      try {
        const cfg = this._autoCfg(kind);
        await this._hass.callApi('POST', `config/automation/config/${id}`, cfg);
        this._autoOk = { ...(this._autoOk || {}), [kind]: true };
        if (kind === 'app') this._setCfg({ appV: 2, appSig: hsh(JSON.stringify(cfg)) });
        if (kind === 'cmd') this._setCfg({ cmdV: 2 });
        if (kind === 'nfc') this._setCfg({ nfcSig: this._nfcTags().join(',') });
        if (kind === 'voice') this._setCfg({ voiceSig: LANG });
        if (kind === 'famgoal' || kind === 'remind') this._setCfg({ [`aSig_${kind}`]: hsh(JSON.stringify(cfg)) });
        if (kind === 'bg') {
          const c = this._cfg;
          this._setCfg({ bgSig: [...(this._bgTimes || []), c.cmdOn ? 'cmd' : '', BG_V].join(','), bgSince: c.bgSince || dk(new Date()) });
        }
        if (!silent) this._toast(T('✓ Automation angelegt und aktiv'));
      } catch (e) {
        if (!silent) this._toast(T('Anlegen nicht möglich (nur als Administrator) – bitte YAML kopieren'));
      }
      this._render();
    }

    async _autoStatus() {
      if (this._autoChecked || !this._admin()) return;
      this._autoChecked = true;
      this._autoOk = this._autoOk || {};
      let any = false;
      for (const [k, id] of Object.entries(AUTO_IDS)) {
        try { await this._hass.callApi('GET', `config/automation/config/${id}`); if (!this._autoOk[k]) any = true; this._autoOk[k] = true; } catch (e) {
          if (OLD_IDS[k]) { try { await this._hass.callApi('GET', `config/automation/config/${OLD_IDS[k]}`); (this._autoOld = this._autoOld || {})[k] = true; } catch (e2) { /* noch nicht angelegt */ } }
        }
      }
      try { await this._hass.callApi('GET', `config/script/config/${SCRIPT_ID}`); if (!this._scriptOk) any = true; this._scriptOk = true; } catch (e) { /* noch nicht angelegt */ }
      if (any && ['einst', 'belohnungen'].includes(this._tab)) this._render();
    }

    // Gründe im Punkte-Verlauf werden auf Deutsch gespeichert (die Logik prüft sie) und erst beim Anzeigen übersetzt
    _reasonT(r) {
      if (LANG === 'de' || !r) return r;
      const sub = (x) => this._reasonT(x);
      let s0 = String(r), suf = '';
      const sfx = [[' (verpasst → doch erledigt)', () => ` ${T('(verpasst → doch erledigt)')}`]];
      sfx.forEach(([a, f]) => { if (s0.endsWith(a)) { s0 = s0.slice(0, -a.length); suf = f() + suf; } });
      const rules = [
        [/^Von Hand \(Eltern\)$/, () => T('Von Hand (Eltern)')],
        [/^⭐ Verdiente Sterne korrigiert \(Eltern\)$/, () => T('⭐ Verdiente Sterne korrigiert (Eltern)')],
        [/^Zurückgenommen: (.*)$/, (m) => T('Zurückgenommen: {x}', { x: sub(m[1]) })],
        [/^Verpasst: (.*)$/, (m) => T('Verpasst: {x}', { x: m[1] })],
        [/^↩️ Minuspunkte erstattet: (.*)$/, (m) => T('↩️ Minuspunkte erstattet: {x}', { x: m[1] })],
        [/^🎁 (.*) eingelöst$/, (m) => T('🎁 {x} eingelöst', { x: m[1] })],
        [/^👫 Anteil: (.*)$/, (m) => T('👫 Anteil: {x}', { x: m[1] })],
        [/^💝 Einladung: (.*)$/, (m) => T('💝 Einladung: {x}', { x: m[1] })],
        [/^↩️ Anteil zurück: (.*)$/, (m) => T('↩️ Anteil zurück: {x}', { x: m[1] })],
        [/^💶 Auszahlung (.*)$/, (m) => T('💶 Auszahlung {x}', { x: m[1] })],
        [/^🔥 (\d+)-Tage-Serie: (.*)$/, (m) => T('🔥 {n}-Tage-Serie: {x}', { n: m[1], x: m[2] })],
        [/^🔥 Serien-Bonus (.*)$/, (m) => T('🔥 Serien-Bonus {x}', { x: m[1] })],
        [/^🎂 Geburtstags-Bonus \((\d+) Jahre\)$/, (m) => T('🎂 Geburtstags-Bonus ({n} Jahre)', { n: m[1] })],
        [/^🎂 Geburtstags-Bonus$/, () => T('🎂 Geburtstags-Bonus')],
        [/^😊 Artig$/, () => T('😊 Artig')],
        [/^😠 Unartig$/, () => T('😠 Unartig')],
        [/^🎓 Verbesserung: (.*)$/, (m) => T('🎓 Verbesserung: {s}', { s: m[1] })],
        [/^🎓 (.*): Note (.*)$/, (m) => T('🎓 {s}: Note {g}', { s: m[1], g: m[2] })],
        [/^📜 Zeugnis$/, () => T('📜 Zeugnis')],
        [/^🏅 Wochen-Bonus$/, () => T('🏅 Wochen-Bonus')],
        [/^👫 Teambonus$/, () => T('👫 Teambonus')],
      ];
      for (const [rx, f] of rules) { const m = s0.match(rx); if (m) return f(m) + suf; }
      return s0 + suf;
    }




    // 🎟️ Offene Gutscheine aller Kinder im Heute-Tab der Eltern (abhaken, wenn das Kind die Belohnung bekommen hat)
    _vSure(k, v) { const s = this._vsure; return !!(s && s.key === `${k}|${v}` && Date.now() - s.t < 8000); }




    // 🔎 Suchfeld unter „Alle Einstellungen“: blendet Abschnitte (und leere Gruppen) aus, die nicht passen
    _filterSet() {
      const r = this.shadowRoot, inp = r.querySelector('.setq');
      if (!inp) return;
      this._setQ = inp.value;
      const w = hbNorm(inp.value).split(/\s+/).filter(Boolean);
      if (this._setMoreQ !== inp.value) this._setMore = false;
      // Zuerst nur Treffer im Titel bzw. in der Kurzinfo – Erwähnungen im Text (z. B. „… bei der Freigabe“) erst auf Wunsch bzw. wenn es sonst nichts gibt
      const all = [...r.querySelectorAll('.accw > .acc')];
      const inT = (el) => w.every((x) => (el.dataset.t || '').includes(x)), inQ = (el) => w.every((x) => (el.dataset.q || '').includes(x));
      const inD = (el) => w.every((x) => (el.dataset.d || '').includes(x));
      const t1 = all.filter(inT), strong = new Set(t1.length ? t1 : all.filter(inD)), weak = all.filter((el) => !strong.has(el) && inQ(el));
      const show = new Set(!w.length || !strong.size || this._setMore ? [...strong, ...weak] : strong);
      let grp = null, any = false;
      const fin = () => { if (grp) grp.hidden = !any; };
      r.querySelectorAll('.accw > .accgrp, .accw > .acc').forEach((el) => {
        if (el.classList.contains('accgrp')) { fin(); grp = el; any = false; return; }
        const hit = !w.length || show.has(el);
        el.hidden = !hit; if (hit) any = true;
      });
      fin();
      const none = r.querySelector('.setnone'); if (none) none.hidden = show.size > 0 || !w.length;
      const more = r.querySelector('.setmore');
      if (more) { const k = w.length && strong.size && !this._setMore ? weak.length : 0; more.hidden = !k; more.textContent = T('🔎 {n} weitere Treffer im Text anzeigen', { n: k }); }
    }

    _calPreview(ent) {
      if (!ent) return T('Bitte einen Kalender wählen.');
      if (!this._hass.states[ent]) return T('⚠️ Kalender nicht gefunden.');
      const ev = this._calEvents(ent);
      if (!ev) return T('Lade Termine …');
      const today = dk(new Date());
      const nx = Object.keys(ev).filter((d) => d >= today).sort().slice(0, 6);
      return nx.length ? T('Nächste Termine: {list}', { list: nx.map((d) => `<b>${shortDate(d)}</b> ${esc(ev[d].join(', '))}`).join(' · ') }) : T('Keine kommenden Termine im Kalender.');
    }





    _showLedger(kidId) {
      const k = this._db.kid[kidId];
      if (!k) return;
      const L = k.ledger || [];
      const groups = {};
      L.forEach((x) => { (groups[x.d] = groups[x.d] || []).push(x); });
      const today = dk(new Date());
      const body = Object.keys(groups).sort().reverse().map((d) => `<div class="tcat">${d === today ? T('Heute') : longDate(d)}</div>
        ${groups[d].map((x) => `<div class="lrow"><span class="ln ${x.n > 0 ? 'pl' : x.n < 0 ? 'mi' : ''}">${x.n > 0 ? '+' : ''}${x.n}</span><span class="grow">${esc(this._reasonT(x.r || ''))}${x.w !== undefined ? ` <small>${T('({w} gebucht, Stand war zu niedrig)', { w: x.w })}</small>` : ''}</span><span class="hint">${esc(x.t || '')}</span></div>`).join('')}`).join('')
        || `<div class="hint">${T('Noch keine Buchungen. Der Verlauf startet mit Version 13.')}</div>`;
      this._modal(T('📜 Punkte-Verlauf – {name}', { name: esc(k.name) }), `<div class="hint">${T('Aktueller Stand: <b>{pts} ⭐</b> · letzte {n} Buchungen', { pts: k.points || 0, n: L.length })}</div>${body}
        ${L.length ? `<div class="hint">${T('Zum Aufräumen nach Tests: Leert den Verlauf und damit auch die Statistik. Punkte und Level bleiben, wie sie sind.')}</div><div><button class="btn danger" data-a="ledclr" data-k="${k.id}">${T('🗑️ Verlauf leeren')}</button></div>` : ''}`, false, null);
    }

    // ---------- 📖 Handbuch (nur Eltern-Bereich) ----------
    _hb() {
      const H = HB || {}, base = H.de || { ui: {}, t: [] }, en = H.en || base, cur = H[LANG] || (LANG === 'gsw' ? base : en);
      const by = (L) => { const o = {}; (L.t || []).forEach((x) => { o[x[0]] = x; }); return o; };
      const bc = by(cur), be = by(en);
      const ui = { ...base.ui, ...(LANG === 'de' || LANG === 'gsw' ? {} : en.ui), ...cur.ui };
      const t = base.t.map(([id, ti, kw, body]) => {
        const c = bc[id] || (LANG === 'gsw' ? null : be[id]) || [id, ti, kw, body], ek = (be[id] || [])[2] || '';
        return { id, ti: c[1], body: c[3], head: hbNorm(`${c[1]} ${c[2]} ${ti} ${kw} ${ek}`), idx: hbNorm(`${c[1]} ${c[2]} ${c[3]} ${ti} ${kw} ${ek}`) };
      });
      return { ui, t };
    }
    _hbBody(s) {
      const out = [];
      let li = [];
      const flush = () => { if (li.length) { out.push(`<ul>${li.join('')}</ul>`); li = []; } };
      String(s || '').split('\n').forEach((ln) => {
        const x = ln.trim();
        if (!x) return;
        if (/^•\s/.test(x)) { li.push(`<li>${esc(x.replace(/^•\s*/, ''))}</li>`); return; }
        if (/^\d+\.\s/.test(x)) { li.push(`<li class="num">${esc(x)}</li>`); return; }
        flush();
        out.push(x.startsWith('📍') ? `<div class="hbp">${esc(x)}</div>` : `<p>${esc(x)}</p>`);
      });
      flush();
      return out.join('');
    }
    _hbOpen(q, topic) {
      if (!HB) {
        this._modal(esc(T('📖 Handbuch')), `<div class="empty">${T('⏳ Handbuch wird geladen …')}</div>`, false, null);
        hbLoad().then(() => { if (this.shadowRoot.getElementById('modal').classList.contains('open')) this._hbOpen(q, topic); })
          .catch(() => { this._modal(esc(T('📖 Handbuch')), `<div class="hint">${T('⚠️ Handbuch-Datei nicht gefunden. „yippee-kids-chores-manual.js“ muss im selben Ordner liegen wie die Karte – beim Marketplace (HACS) passiert das automatisch, bei manueller Installation bitte mitkopieren.')}</div>`, false, null); });
        return;
      }
      const { ui, t } = this._hb();
      const chips = (ui.chips || []).map((c) => `<button type="button" class="hbchip" data-q="${esc(c)}">${esc(c)}</button>`).join('');
      const list = t.map((x, i) => `<details class="hbi" data-i="${i}"><summary>${esc(x.ti)}</summary><div class="hbx">${this._hbBody(x.body)}</div></details>`).join('');
      this._modal(esc(ui.title || '📖'), `<input type="search" class="hbq" enterkeyhint="search" autocomplete="off" placeholder="${esc(ui.search || '')}" aria-label="${esc(ui.search || '')}" value="${esc(q || '')}">
        <div class="hbchips">${chips}</div><div class="hint hbn"></div><div class="hblist">${list}</div><div class="empty hbnone" hidden>${esc(ui.none || '')}</div>`, false, null);
      const m = this.shadowRoot.getElementById('modal'), inp = m.querySelector('.hbq'), box = m.querySelector('.hblist');
      const items = [...m.querySelectorAll('.hbi')], info = m.querySelector('.hbn'), none = m.querySelector('.hbnone');
      const run = () => {
        const w = hbNorm(inp.value).split(/\s+/).filter(Boolean);
        const hit = items.filter((el) => w.every((x) => t[el.dataset.i].idx.includes(x)));
        const rank = (el) => (w.length && w.every((x) => t[el.dataset.i].head.includes(x)) ? 0 : 1);
        hit.sort((a, b) => rank(a) - rank(b) || a.dataset.i - b.dataset.i);
        items.forEach((el) => { el.hidden = !hit.includes(el); if (!w.length) el.open = false; });
        hit.forEach((el) => box.appendChild(el));
        if (w.length) hit.forEach((el, i) => { el.open = hit.length <= 3 || (i === 0 && rank(el) === 0); });
        else items.sort((a, b) => a.dataset.i - b.dataset.i).forEach((el) => box.appendChild(el));
        info.textContent = w.length ? String(ui.hits || '{n}').replace('{n}', hit.length) : (ui.intro || '');
        none.hidden = hit.length > 0;
        m.querySelectorAll('.hbchip').forEach((b) => b.classList.toggle('on', hbNorm(b.dataset.q) === hbNorm(inp.value).trim()));
      };
      inp.addEventListener('input', run);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } });
      m.querySelectorAll('.hbchip').forEach((b) => b.addEventListener('click', () => { inp.value = b.classList.contains('on') ? '' : b.dataset.q; run(); }));
      run();
      // Aus einem Einstellungs-Abschnitt geöffnet: nur das passende Thema zeigen (Suchfeld leeren zeigt wieder alle)
      const ti = topic ? items.find((el) => t[el.dataset.i].id === topic) : null;
      if (ti) { items.forEach((el) => { el.hidden = el !== ti; }); ti.open = true; info.textContent = ''; }
    }

    _ord(a, b) { return this._cfg.orderOn ? (a.order || 0) - (b.order || 0) : 0; }
    _taskOrder() { return Object.values(this._db.task).filter((t) => !t.virtual).sort((a, b) => (a.sched === 'once') - (b.sched === 'once') || this._blkRank(a) - this._blkRank(b) || this._ord(a, b) || String(a.title).localeCompare(String(b.title))); }

    // 📋 Eltern-Heute: Kinder und Tagesblöcke einklappbar – gemerkt auf diesem Gerät
    _admFolded(key) {
      if (!this._admF) { try { this._admF = JSON.parse(localStorage.getItem('kpAdmFold') || '{}') || {}; } catch (e) { this._admF = {}; } }
      return !!this._admF[key];
    }




    // 🗂️ Aufgaben-Tab: immer je Kind gruppiert, darunter wahlweise nach Tageszeit, Art oder ohne Unterteilung
    _tkArt(t) { return this._routine(t) ? 'r' : t.sched === 'once' ? 's' : this._isExtra(t) ? 'z' : 'p'; }
    _tkMode() { if (!this._tkg) { try { this._tkg = localStorage.getItem('kpTkg'); } catch (e) { /* egal */ } } return ['zeit', 'art', 'none'].includes(this._tkg) ? this._tkg : 'zeit'; }
    _tkOpen(key) { if (!this._tkO) { try { this._tkO = JSON.parse(localStorage.getItem('kpTkO') || '{}') || {}; } catch (e) { this._tkO = {}; } } return this._tkO[key] !== false; }
    _tkSub(t, mode) { return mode === 'zeit' ? this._blk(t) : mode === 'art' ? this._tkArt(t) : ''; }




    _editFamily() {
      const f = this._cfg.fam || { title: '', emoji: '🎢', cost: 300, pts: 0 };
      const big = REWARD_TEMPLATES.filter((x) => x[2] >= 40);
      this._modal(T('👨‍👩‍👧 Familienziel'), `<div class="hint">${T('Jeder Stern, den ein Kind verdient, zählt zusätzlich fürs Familienziel. Die eigenen Punkte der Kinder bleiben erhalten.')}</div>
        <div class="g2"><label>${T('Emoji')}<input name="emoji" value="${esc(f.emoji || '')}"></label><label>${T('Ziel')}<input name="title" value="${esc(f.title)}" placeholder="${esc(T('z. B. Freizeitpark'))}"></label></div>
        <div class="g2 g2e"><label>${T('Benötigte Sterne (alle zusammen)')}<input type="number" min="10" name="cost" value="${f.cost || 300}"></label>
        <label>${T('Bereits gesammelt')}<input type="number" min="0" name="fpts" value="${f.pts || 0}"></label></div>
        <div class="hint">${T('„Bereits gesammelt“ kannst du von Hand korrigieren, z. B. nach Test-Eingaben.')}</div>
        <div class="lbl">${T('Vorschläge')}</div>
        <div class="pick">${big.map((x) => `<button type="button" class="qp" data-a="fpick" data-e="${x[0]}" data-t="${esc(T(x[1]))}" data-c="${x[2] * 3}">${x[0]}<small>${esc(T(x[1]))}<br><b>${x[2] * 3} ⭐</b></small></button>`).join('')}</div>`,
      !!(this._cfg.fam && this._cfg.fam.cost), {
        save: (b) => {
          const title = b.querySelector('[name=title]').value.trim();
          if (!title) { this._toast(T('Bitte ein Ziel eingeben')); return false; }
          const cost = Math.max(10, Number(b.querySelector('[name=cost]').value) || 10);
          const pIn = Math.max(0, Math.round(Number(b.querySelector('[name=fpts]').value) || 0)), pChanged = pIn !== (f.pts || 0);
          const emoji = b.querySelector('[name=emoji]').value.trim() || '👨‍👩‍👧';
          const mk = (g) => { const pts = pChanged ? pIn : ((g && g.pts) || 0); return { title, emoji, cost, pts, reached: pts >= cost }; };
          const c = { ...this._cfg, fam: mk(this._cfg.fam) };
          delete c.id;
          this._save('cfg', 'main', c, (cur) => ({ ...cur, fam: mk(cur.fam) }));
          return true;
        },
        del: () => { this._setCfg({ fam: null }); return true; },
      });
    }

    _payout(kidId) {
      const k = this._db.kid[kidId];
      if (!k) return;
      const rate = Number(this._cfg.moneyRate) || 10, max = (k.points || 0) / rate;
      this._modal(T('💶 Auszahlung – {name}', { name: esc(k.name) }), `<div class="hint">${k.points || 0} ⭐ = ${euro(k.points || 0, rate)} (${rate} ⭐ = 1 €)</div>
        <label>${T('Betrag in €')}<input type="number" name="eur" min="0.1" step="0.1" max="${max.toFixed(2)}" value="${Math.floor(max)}"></label>`, false, {
        saveLabel: T('💶 Auszahlen'), audit: false,
        save: (b) => {
          const eur = Number(String(b.querySelector('[name=eur]').value).replace(',', '.')) || 0;
          const p = Math.round(eur * rate);
          if (p <= 0) { this._toast(T('Bitte einen Betrag eingeben')); return false; }
          if (p > (k.points || 0)) { this._toast(T('Nicht genug Punkte')); return false; }
          this._addPoints(kidId, -p, `💶 Auszahlung ${euro(p, rate)}`);
          this._audit(T('💶 Ausgezahlt: {name} {amount}', { name: k.name, amount: euro(p, rate) }));
          this._toast(T('💶 {amount} an {name} ausgezahlt (−{p} ⭐)', { amount: euro(p, rate), name: k.name, p }));
          return true;
        },
      });
    }

    // Dateiname der Sicherung, z. B. YippeeKidsChores03102026.json (Tag, Monat, Jahr)
    // ---------- Eltern = Home-Assistant-Benutzer ----------
    _persons() {
      return Object.entries(this._hass.states).filter(([e, x]) => e.startsWith('person.') && x.attributes && x.attributes.user_id)
        .map(([e, x]) => ({ e, u: x.attributes.user_id, n: x.attributes.friendly_name || e })).sort((a, b) => a.n.localeCompare(b.n));
    }
    _userName(u) { const p = this._persons().find((x) => x.u === u); return p ? p.n : ''; }
    _uName() {
      if (this._actSrc) return this._actSrc;
      return (this._hass && this._hass.user && this._hass.user.name) || '?';
    }
    // Liste aktiv = mindestens ein eingetragener Elternteil existiert noch als Person in HA
    _parentsOn() { const p = this._cfg.parents || []; return p.length > 0 && this._persons().some((x) => p.includes(x.u)); }
    _isParent(u) {
      if (!this._parentsOn()) return true;
      const id = u !== undefined ? u : this._hass && this._hass.user && this._hass.user.id;
      return (this._cfg.parents || []).includes(id);
    }

    // ---------- Änderungsprotokoll ----------
    _audit(text) {
      if (this._cfg.auditOn === false || !text) return;
      this._audQ = this._audQ || [];
      this._audQ.push([Date.now(), this._uName(), String(text).slice(0, 200)]);
      clearTimeout(this._audT);
      this._audT = setTimeout(() => {
        const add = this._audQ; this._audQ = [];
        const cur = (this._db.audit.main && this._db.audit.main.e) || [];
        this._save('audit', 'main', { e: [...add.reverse(), ...cur].slice(0, 300) }, (c) => ({ e: [...add, ...((c && c.e) || [])].sort((a, b) => b[0] - a[0]).slice(0, 300) }));
        this._render();
      }, 1500);
    }

    // ---------- Papierkorb ----------
    _trashDays() { const n = Number(this._cfg.trashDays); return [7, 14, 30].includes(n) ? n : 7; }
    _trashRestore(id) {
      const x = this._db.trash[id];
      if (!x || !x.o || !TRACK.includes(x.t) || !/^[\w-]+$/.test(String(x.oid || '')) || x.oid === '__proto__') return;
      if (this._db[x.t][x.oid]) { this._toast(T('Ist schon wieder da')); this._del('trash', id); return; }
      this._save(x.t, x.oid, x.o);
      this._del('trash', id);
      this._audit(T('♻️ Aus dem Papierkorb zurückgeholt: {x}', { x: x.o.name || x.o.title || x.oid }));
      this._toast(T('♻️ Zurückgeholt'));
      this._render();
    }

    // ---------- Zweite Liste für Sicherungen ----------
    _bk2Ent() { const m = this._manLoad(); return this._cfg.ab2 || (m && m.ab2) || ''; }
    async _bk2Load(force) {
      const ent = this._bk2Ent();
      if (!ent || ent === this._config.storage || !this._hass.states[ent]) { this._bk2 = null; return; }
      if (this._bk2 && this._bk2.ent === ent && !force && Date.now() - this._bk2.ts < 3600000) return;
      if (this._bk2Busy) return;
      this._bk2Busy = true;
      try {
        const r = await this._hass.callWS({ type: 'todo/item/list', entity_id: ent });
        const m = {};
        ((r && r.items) || []).forEach((it) => { const sm = it.summary || ''; if (sm.startsWith('kp|bak|')) m[sm.slice(7)] = it.description || ''; });
        this._bk2 = { ent, ts: Date.now(), m };
        this._render();
      } catch (e) { this._bk2 = { ent, ts: Date.now(), m: {}, err: String(e.message || e) }; } finally { this._bk2Busy = false; }
    }
    async _bk2Write(id, raw) {
      const ent = this._bk2Ent();
      if (!ent || ent === this._config.storage || !this._hass.states[ent]) return;
      const call = (s, d) => this._hass.callService('todo', s, d, { entity_id: ent }, false);
      const r = await this._hass.callWS({ type: 'todo/item/list', entity_id: ent });
      const have = ((r && r.items) || []).map((x) => x.summary || '').filter((x) => x.startsWith('kp|bak|')).map((x) => x.slice(7)).sort();
      if (have.includes(id)) await call('update_item', { item: `kp|bak|${id}`, description: raw }); else await call('add_item', { item: `kp|bak|${id}`, description: raw });
      const all = [...new Set([...have, id])].sort();
      for (const old of all.slice(0, Math.max(0, all.length - 4))) { try { await call('remove_item', { item: `kp|bak|${old}` }); } catch (e) { /* weg */ } }
      await this._bk2Load(true);
    }

    _pinSet() {
      const q = (n) => (this.shadowRoot.querySelector(`[name=${n}]`) || {}).value || '';
      const a = q('pin1').replace(/\D/g, ''), b = q('pin2').replace(/\D/g, '');
      if (a.length < 4 || a.length > 8 || a !== q('pin1')) { this._toast(T('Bitte 4 bis 8 Ziffern eingeben')); return; }
      if (a !== b) { this._toast(T('Die beiden PINs sind nicht gleich')); return; }
      const salt = uid() + uid();
      this._setCfg({ pinS: salt, pinH: pinHash(salt, a), pinL: a.length });
      this._audit(T('🔢 PIN geändert'));
      this._touch();
      this._toast(T('🔢 PIN gespeichert'));
      this._render();
    }

    // ---------- Updates (HACS) und „Ressource noch nicht erhöht“ ----------
    _vnum(x) {
      const m = String(x || '').match(/\d+(\.\d+)*/);
      if (!m) return 0;
      const p = m[0].split('.').map(Number);
      if (p.length === 1 && p[0] >= 10) return 0; // alte Testversionen (z. B. 46, 48) zählen als älter als 1.0.0
      return p[0] + (p[1] || 0) / 1000 + (p[2] || 0) / 1e6;
    }
    _hacsEnt() {
      if (!this._hass) return null;
      const hit = Object.entries(this._hass.states).find(([e, x]) => e.startsWith('update.') && x && x.attributes
        && /yippee|kids[ _-]?chores|kinder[ _-]?punkte/i.test(`${e} ${x.attributes.title || ''} ${x.attributes.friendly_name || ''}`));
      return hit ? { e: hit[0], ...hit[1].attributes, state: hit[1].state } : null;
    }
    async _updCheck(force) {
      const c = this._cfg;
      if (c.updOn === false || ['kid', 'kids', 'advent'].includes(this._config.mode) || !this._hass) return;
      if (!force && this._updT && Date.now() - this._updT < 6 * 3600000) return;
      this._updT = Date.now();
      const u = { file: 0, res: null };
      try {
        const list = await this._hass.callWS({ type: 'lovelace/resources' });
        const mine = (list || []).filter((x) => /yippee-kids-chores-card\.js|kinderpunkte-card\.js/.test(x.url || ''));
        for (const r of mine) {
          r.ver = '';
          try {
            const txt = await (await fetch(`${String(r.url).split('?')[0]}?nocache=${Date.now()}`, { cache: 'no-store' })).text();
            const m = txt.match(/const VERSION = '([^']+)'/);
            if (m) r.ver = m[1];
          } catch (e) { /* Datei fehlt */ }
        }
        // Mehrere Einträge der Karte? Den Eintrag des Marketplace (früher HACS) bzw. die neueste Datei behalten, die anderen sind überflüssig
        // Reihenfolge: neueste Datei vor Marketplace-Pfad (/local/community/, früher /hacsfiles/) vor neuem Dateinamen (yippee-…) – eine veraltete Kopie bleibt nie als einziger Eintrag übrig
        const rank = (r) => [this._vnum(r.ver), /^\/local\/community\//.test(r.url) ? 2 : /^\/hacsfiles\//.test(r.url) ? 1 : 0, /yippee-kids-chores-card\.js/.test(r.url) ? 1 : 0];
        const keep = mine.slice().sort((a, b) => { const x = rank(a), y = rank(b); return y[0] - x[0] || y[1] - x[1] || y[2] - x[2]; })[0];
        if (keep) { u.res = keep; u.file = keep.ver; u.dups = mine.filter((r) => r !== keep); }
      } catch (e) { /* kein Administrator oder Datei nicht lesbar */ }
      this._upd = u;
      // Update installiert, Ressource noch alt -> automatisch erhöhen (einmal pro Version, nur Administratoren)
      const i = this._updInfo();
      if (this._cfg.updAuto !== false && this._admin() && i.stale && u.res && !this._resReady(i)) {
        let done = '';
        try { done = localStorage.getItem('yippeeAutoRes') || ''; } catch (e) { done = ''; }
        if (done !== i.stale) {
          try { localStorage.setItem('yippeeAutoRes', i.stale); } catch (e) { /* egal */ }
          await this._updRes(true);
        }
      }
      this._render();
    }
    // Zeigt die Ressource schon auf die neue Version? (HACS trägt bei Updates selbst einen neuen hacstag ein)
    _resReady(i) {
      const url = String((i.u.res || {}).url || '');
      return /[?&]hacstag=/.test(url) || new RegExp(`[?&]v=${String(i.stale).replace(/\./g, '\\.')}(&|$)`).test(url);
    }
    _updInfo() {
      const run = this._vnum(VERSION), h = this._hacsEnt(), u = this._upd || {};
      const inst = Math.max(this._vnum(u.file), h ? this._vnum(h.installed_version) : 0);
      const latest = h ? this._vnum(h.latest_version) : 0;
      return {
        h, u, inst,
        avail: h && latest > Math.max(inst, run) ? String(h.latest_version).replace(/^v/i, '') : '',
        stale: inst > run ? String(u.file && this._vnum(u.file) === inst ? u.file : String(h.installed_version)).replace(/^v/i, '') : '',
      };
    }
    async _resClean() {
      if (!this._admin()) { this._toast(T('Umstellen nicht möglich (nur als Administrator): {err}', { err: '' })); return; }
      const d = (this._upd && this._upd.dups) || [];
      try {
        for (const r of d) await this._hass.callWS({ type: 'lovelace/resources/delete', resource_id: r.id });
        this._audit(T('🧹 {n} überflüssige Ressourcen-Einträge entfernt', { n: d.length }));
        this._toast(T('✓ Aufgeräumt – Seite wird neu geladen'));
        setTimeout(() => window.location.reload(), 1500);
      } catch (e) { this._toast(T('Umstellen nicht möglich (nur als Administrator): {err}', { err: e.message || e })); }
    }

    async _updRes(silent) {
      if (!this._admin()) { if (!silent) this._toast(T('Umstellen nicht möglich (nur als Administrator): {err}', { err: '' })); return; }
      const i = this._updInfo(), r = i.u.res;
      if (!r || !i.stale) return;
      const base = String(r.url).split('?')[0];
      const keep = String(r.url).includes('?') ? String(r.url).split('?')[1].split('&').filter((x) => x && !/^v=/.test(x)) : [];
      const url = `${base}?${[...keep, `v=${encodeURIComponent(i.stale)}`].join('&')}`;
      try {
        await this._hass.callWS({ type: 'lovelace/resources/update', resource_id: r.id, res_type: r.type || 'module', url });
        r.url = url;
        this._audit(T('🔄 Ressource auf Version {n} umgestellt', { n: i.stale }));
        if (silent) { this._render(); return; }
        this._toast(T('✓ Ressource umgestellt – Seite wird neu geladen'));
        setTimeout(() => window.location.reload(), 1500);
      } catch (e) { if (!silent) this._toast(T('Umstellen nicht möglich (nur als Administrator): {err}', { err: e.message || e })); }
    }

    // ---------- 🎓 Schulnoten ----------
    _gScale() { const c = this._cfg; const id = GSCALES[c.gScale] ? c.gScale : (GRADE_COUNTRY[c.hc] || 'de'); return { id, ...GSCALES[id] }; }
    _gTable() { const s = this._gScale(), own = ((this._cfg.gStars || {})[s.id]) || []; return s.t.map(([g, st], i) => [g, own[i] !== undefined && own[i] !== null && own[i] !== '' ? Number(own[i]) || 0 : st]); }
    _gStars(g) {
      const s = this._gScale(), v = Number(g);
      for (const [th, st] of this._gTable()) if (s.hi ? v >= th : v <= th) return st;
      return 0;
    }
    _gBetter(a, b) { const s = this._gScale(); return s.hi ? Number(a) > Number(b) : Number(a) < Number(b); }
    _gFmt(g) { return String(g).replace('.', LANG === 'en' ? '.' : ','); }

    _gradeDlg(...a) { return this._admCall('_gradeDlg', a, false); }


    // Note buchen: Sterne nach Tabelle + Verbesserungs-Bonus, Verlauf beim Kind
    async _gradeBook(kidId, gr, reqId, e) {
      const q0 = reqId ? this._db.req[reqId] : null;
      if (reqId && !(await this._claim(reqId))) return;
      const k = this._db.kid[kidId];
      if (!k) { this._render(); return; }
      const c = this._cfg, d = dk(new Date());
      const prev = gr.rep ? null : (k.grades || []).find((x) => !x.rep && String(x.s).toLowerCase() === String(gr.s).toLowerCase());
      const base = gr.rep ? Number(c.gRep === undefined ? 20 : c.gRep) || 0 : this._gStars(gr.g);
      const impN = Number(c.gImp === undefined ? 3 : c.gImp) || 0;
      const imp = !gr.rep && prev && impN && this._gBetter(gr.g, prev.g) ? impN : 0;
      const entry = { d, ...(gr.rep ? { rep: 1 } : { s: gr.s, g: gr.g }), p: base + imp, ...(imp ? { imp } : {}) };
      const reason = gr.rep ? '📜 Zeugnis' : `🎓 ${gr.s}: Note ${this._gFmt(gr.g)}`;
      this._addPoints(kidId, base || 0, reason, { push: [['grades', entry, 100]] });
      if (imp) this._addPoints(kidId, imp, `🎓 Verbesserung: ${gr.s}`);
      if (q0 && q0.grade && q0.grade.photo) this._photoDel(q0.grade.photo);
      this._audit(gr.rep ? T('📜 Zeugnis: {name} (+{n} ⭐)', { name: k.name, n: base }) : T('🎓 Note: {name} – {s} {g} (+{n} ⭐)', { name: k.name, s: gr.s, g: this._gFmt(gr.g), n: base + imp }));
      if (base + imp > 0) this._celebrate('🎓', T('Super, {name}!', { name: k.name }), imp ? T('+{n} ⭐ – und besser als beim letzten Mal! 📈', { n: base + imp }) : T('+{n} ⭐ für deine Note', { n: base + imp }));
      else this._toast(T('🎓 Note eingetragen'));
      this._render();
    }
    _gradeReject(reqId) {
      const q = this._db.req[reqId];
      if (!q) return;
      if (q.grade && q.grade.photo) this._photoDel(q.grade.photo);
      const k = this._db.kid[q.kid];
      this._audit(T('✕ Note abgelehnt: {name}', { name: k ? k.name : '?' }));
      this._del('req', reqId);
      this._render();
    }
    _photoDel(f) { if (PH_RX.test(String(f))) { this._phDel(String(f)); return; } if (!MEDIA_RX.test(String(f)) || !this._admin()) return; this._hass.callWS({ type: 'media_source/local_source/remove', media_content_id: `media-source://media_source/local/${f}` }).catch(() => { /* bleibt liegen */ }); }


    // ---------- Datenprüfung ----------
    _manKey() { return `kpman:${this._config.storage}`; }
    _manLoad() { try { return JSON.parse(localStorage.getItem(this._manKey()) || 'null'); } catch (e) { return null; } }
    _manSave(ids) { try { localStorage.setItem(this._manKey(), JSON.stringify({ ids, ts: Date.now(), born: this._cfg.born || 0, ab2: this._cfg.ab2 || '' })); } catch (e) { /* kein Speicher */ } }
    _curIds() {
      const cur = [];
      TRACK.forEach((ty) => Object.values(this._db[ty]).forEach((x) => { if (!x.virtual) cur.push(`${ty}|${x.id}`); }));
      if (this._db.cfg.main) cur.push('cfg|main');
      return cur;
    }
    _bkIds() { return [...new Set([...Object.keys(this._db.bak), ...Object.keys((this._bk2 && this._bk2.m) || {})])].sort(); }
    async _bkData(id) {
      this._bkCache = this._bkCache || {};
      const b = this._db.bak[id] || (this._bk2 && this._bk2.m[id] !== undefined ? { raw: this._bk2.m[id] } : null);
      if (!b) return null;
      const ck = `${id}:${b.raw.length}`;
      if (!this._bkCache[ck]) {
        this._bkCache[ck] = ungz(b.raw).then((x) => { const j = JSON.parse(x); return j && [APP_ID, OLD_APP].includes(j.app) && j.data ? j : null; }).catch(() => null);
      }
      return this._bkCache[ck];
    }
    _dataCheck() {
      const c = this._cfg;
      if (c.chkOn === false || !this._loaded) { if (this._loaded && !this._pending.size) this._dchkRuns = (this._dchkRuns || 0) + 1; this._dchk = null; return; } // Auto-Backup braucht den Zähler auch ohne Datenprüfung
      if (this._pending.size) return;
      this._dchkRuns = (this._dchkRuns || 0) + 1;
      if (this._bk2Ent()) this._bk2Load();
      const cur = new Set(this._curIds()), tomb = c.tomb || {}, ref = new Set();
      const man = this._manLoad();
      // Einstellungen neu entstanden (z. B. Liste geleert, dann von irgendwo neu angelegt)? -> wie fehlend behandeln
      if (man && man.born && this._db.cfg.main && c.born !== man.born) cur.delete('cfg|main');
      if (this._db.cfg.main && !c.born && !man) this._setCfg({ born: Date.now() });
      if (man && Array.isArray(man.ids) && Date.now() - man.ts < 80 * 864e5) man.ids.forEach((k) => ref.add(k));
      const last = this._bkIds().pop();
      if (last && dayDiff(last, dk(new Date())) <= 60) {
        if (this._bkRef && this._bkRef.id === last) this._bkRef.ids.forEach((k) => ref.add(k));
        else this._bkData(last).then((j) => { if (!j) return; const ids = []; TRACK.forEach((ty) => Object.keys(j.data[ty] || {}).forEach((id) => ids.push(`${ty}|${id}`))); if (j.data.cfg && j.data.cfg.main) ids.push('cfg|main'); this._bkRef = { id: last, ids, j }; });
      }
      const miss0 = [...ref].filter((k) => !cur.has(k) && !tomb[k]);
      const prev = this._missPrev || new Set();
      this._missPrev = new Set(miss0);
      const miss = miss0.filter((k) => prev.has(k)); // erst melden, wenn es auch eine Minute später noch fehlt
      const bad = [...(this._badKeys || [])], broken = [...(this._brokenKeys || [])];
      const sig = [...miss, '/', ...bad, '/', ...broken].join(',');
      const any = miss.length + bad.length + broken.length;
      if (!any && !miss0.length) { if (this._db.cfg.main && !c.born) this._setCfg({ born: Date.now() }); else this._manSave([...cur]); }
      const old = this._dchk ? this._dchk.sig : '';
      this._dchk = any ? { miss, bad, broken, sig } : null;
      if ((this._dchk ? sig : '') !== old) this._render();
      if (any && !['kid', 'kids', 'advent'].includes(this._config.mode)) {
        let sent = '';
        try { sent = localStorage.getItem(`${this._manKey()}:sent`) || ''; } catch (e) { sent = ''; }
        if (sent !== sig) {
          try { localStorage.setItem(`${this._manKey()}:sent`, sig); } catch (e) { /* egal */ }
          this._notify(T('⚠️ Yippee! - Kids Chores: Einträge fehlen oder wurden außerhalb der Karte verändert ({n}). Öffne die Eltern-Ansicht – dort kannst du sie aus der Sicherung zurückholen.', { n: any }), 'test');
        }
      }
    }
    async _chkFix() {
      const d = this._dchk;
      if (!d) return;
      const left = new Set([...d.miss, ...d.bad, ...d.broken]);
      let n = 0;
      for (const bid of this._bkIds().reverse()) {
        if (!left.size) break;
        const j = await this._bkData(bid);
        if (!j) continue;
        [...left].forEach((k) => {
          const [ty, id] = k.split('|');
          const v = j.data[ty] && j.data[ty][id];
          if (!v) return;
          if (ty === 'cfg') this._save('cfg', id, v, (cur) => ({ ...v, tomb: { ...(v.tomb || {}), ...((cur && cur.tomb) || {}) } }));
          else this._save(ty, id, v);
          left.delete(k); n++;
        });
      }
      this._missPrev = new Set(); this._dchk = null;
      if (n) this._audit(T('🛡️ Datenprüfung: {n} aus der Sicherung zurückgeholt', { n }));
      this._badKeys = new Set([...(this._badKeys || [])].filter((k) => left.has(k)));
      this._brokenKeys = new Set([...(this._brokenKeys || [])].filter((k) => left.has(k)));
      if (left.size) {
        this._toast(T('♻️ {n} zurückgeholt – {m} nicht in den automatischen Sicherungen. Bitte eine Sicherungsdatei verwenden oder übernehmen.', { n, m: left.size }));
        if (!n) this._restore();
      } else this._toast(n > 1 ? T('♻️ {n} Einträge zurückgeholt', { n }) : T('♻️ 1 Eintrag zurückgeholt'));
      this._render();
    }
    _chkOk() {
      (this._badKeys || new Set()).forEach((k) => { const [ty, id] = k.split('|'); const x = this._db[ty] && this._db[ty][id]; if (x) this._save(ty, id, x); });
      (this._brokenKeys || new Set()).forEach((k) => { const key = `kp|${k}`; this._enq(() => this._svc('remove_item', { item: key }).catch(() => { /* weg */ })); });
      this._badKeys = new Set(); this._brokenKeys = new Set();
      // Bewusst übernommene fehlende Einträge als „gelöscht“ merken – sonst meldet die Prüfung sie nach dem Neuladen wieder (Abgleich mit der Sicherung)
      const miss = ((this._dchk && this._dchk.miss) || []).filter((k) => k !== 'cfg|main');
      if (miss.length && this._db.cfg.main) {
        const today = dk(new Date()), add = (t) => { const o = { ...(t || {}) }; miss.forEach((k) => { o[k] = today; }); return o; };
        const c = { ...this._db.cfg.main, tomb: add(this._db.cfg.main.tomb) };
        delete c.id;
        this._save('cfg', 'main', c, (cur) => ({ ...cur, tomb: add(cur.tomb) }));
      }
      this._manSave(this._curIds()); this._missPrev = new Set(); this._bkRef = { id: this._bkIds().pop() || '', ids: this._curIds() };
      this._dchk = null;
      this._toast(T('✓ Aktueller Stand übernommen'));
      this._audit(T('🛡️ Datenprüfung: aktueller Stand übernommen'));
      this._render();
    }

    // ---------- Automatische Sicherung ----------
    _abCheck() {
      const c = this._cfg;
      if (c.abOn === false || window.__kpAbBusy || !this._kids().length || this._dchk || (this._dchkRuns || 0) < 2 || (this._badKeys || new Set()).size) return;
      const days = Number(c.abDays) || 7, today = dk(new Date());
      const last = Object.keys(this._db.bak).sort().pop();
      if (c.ab2) this._bk2Load();
      const need2 = c.ab2 && this._bk2 && this._bk2.ent === c.ab2 && !this._bk2.err && !Object.keys(this._bk2.m).some((x) => dayDiff(x, today) < days);
      if (last && dayDiff(last, today) < days && !need2) return;
      this._abMake(false);
    }
    async _abMake(manual) {
      if (window.__kpAbBusy) return false;
      window.__kpAbBusy = true;
      try {
        const today = dk(new Date()), days = Number(this._cfg.abDays) || 7;
        const r = await this._hass.callWS({ type: 'todo/item/list', entity_id: this._config.storage });
        const have = ((r && r.items) || []).map((x) => x.summary || '').filter((x) => x.startsWith('kp|bak|')).map((x) => x.slice(7)).sort();
        const last = have[have.length - 1];
        const c2 = this._cfg.ab2, need2 = c2 && this._bk2 && this._bk2.ent === c2 && !Object.keys(this._bk2.m).some((x) => dayDiff(x, today) < days);
        if (!manual && last && dayDiff(last, today) < days && !need2) return false; // anderes Gerät war schneller
        const raw = await gz(this._backupJson());
        if (c2) { try { await this._bk2Write(today, raw); } catch (e) { if (manual) this._toast(T('Zweite Liste: {err}', { err: e.message || e })); } }
        const key = `kp|bak|${today}`;
        this._db.bak[today] = { id: today, raw };
        await new Promise((res) => {
          this._enq(async () => {
            try {
              if (have.includes(today)) await this._svc('update_item', { item: key, description: raw });
              else await this._svc('add_item', { item: key, description: raw });
              this._stored.add(key); this._recent.set(key, Date.now());
              const all = [...new Set([...have, today])].sort();
              for (const old of all.slice(0, Math.max(0, all.length - 4))) { try { await this._svc('remove_item', { item: `kp|bak|${old}` }); } catch (e) { /* schon weg */ } delete this._db.bak[old]; }
            } finally { res(); }
          });
        });
        if (manual) this._toast(T('💾 Sicherung angelegt'));
        this._render();
        return true;
      } catch (e) {
        if (manual) this._toast(T('Sicherung fehlgeschlagen: {err}', { err: e.message || e }));
        return false;
      } finally { window.__kpAbBusy = false; }
    }

    // Sicherung einspielen (Datei, eingefügter Text oder automatische Sicherung)
    _applyBackup(j) {
      const today = dk(new Date()), curTomb = { ...(this._cfg.tomb || {}) }, dels = {}, back = new Set();
      this._noTomb = true;
      try {
        ['kid', 'task', 'reward', 'log', 'req', 'cfg', 'adc', 'adk', 'zc', 'zk'].forEach((ty) => {
          if (['adc', 'adk', 'zc', 'zk'].includes(ty) && !j.data[ty]) return; // ältere Sicherung ohne Adventskalender/Zahnputz-Timer: vorhandene Daten behalten
          const src = j.data[ty] || {};
          Object.keys(this._db[ty]).forEach((id) => {
            if (src[id] || (this._db[ty][id] || {}).virtual) return;
            if (ty === 'cfg' && id === 'main') return;
            this._del(ty, id);
            if (TRACK.includes(ty)) dels[`${ty}|${id}`] = today;
          });
          Object.keys(src).forEach((id) => {
            if (ty === 'cfg' && id === 'main') return;
            if (!/^[\w-]+$/.test(id) || id === '__proto__' || !src[id] || typeof src[id] !== 'object' || Array.isArray(src[id])) return; // unbrauchbare Einträge der Datei überspringen
            this._save(ty, id, src[id]); back.add(`${ty}|${id}`);
          });
        });
        const cm0 = j.data.cfg && j.data.cfg.main, cm = cm0 && typeof cm0 === 'object' && !Array.isArray(cm0) ? cm0 : { ...(this._db.cfg.main || {}) };
        const tomb = { ...curTomb, ...(cm.tomb || {}), ...dels };
        back.forEach((k) => delete tomb[k]);
        const nc = { ...cm, tomb };
        // Geräte-/Ablauf-Stand vom aktuellen Speicher behalten: sonst schlagen andere Geräte falschen Alarm (born)
        // oder Tagesabschluss/Wochenbericht/Morgen-Ansage werden erneut verschickt
        ['born', 'dLast', 'lastWeekly', 'mLast', 'appV', 'appSig', 'cmdV', 'bgSig', 'rStart'].forEach((x) => { if (this._cfg[x] !== undefined) nc[x] = this._cfg[x]; });
        delete nc.id;
        this._save('cfg', 'main', nc, () => nc);
      } finally { this._noTomb = false; }
      const ids = [];
      TRACK.forEach((ty) => Object.keys(j.data[ty] || {}).forEach((id) => ids.push(`${ty}|${id}`)));
      ids.push('cfg|main');
      this._manSave(ids); this._missPrev = new Set(); this._dchk = null; this._bkRef = { id: this._bkIds().pop() || '', ids };
      this._badKeys = new Set(); this._brokenKeys = new Set();
      this._toast(T('♻️ Sicherung wiederhergestellt'));
      this._audit(T('♻️ Sicherung wiederhergestellt (Stand {date})', { date: shortDate(String(j.date || '').slice(0, 10) || dk(new Date())) }));
    }

    // ---------- Hintergrund-Automation (läuft in Home Assistant, auch ohne geöffnete Karte) ----------
    _bgActive() {
      const c = this._cfg;
      if (!c.bgOn || !this._hass) return false;
      const st = Object.entries(this._hass.states).find(([e, x]) => e.startsWith('automation.') && x && x.attributes && [AUTO_IDS.bg, OLD_IDS.bg].includes(x.attributes.id));
      return !!st && st[1].state === 'on';
    }

    // Aufgaben eines Kindes an einem beliebigen Tag (wie _todayTasks)
    _dayTasks(kidId, d) {
      const date = dk(d);
      return Object.values(this._db.task).filter((t) => {
        if (!(t.kids || []).includes(kidId) || !this._req(t)) return false;
        if (t.sched !== 'once') return this._isFor(t, kidId, d);
        return !t.done && (!t.until || t.until >= date) && (!t.created || t.created <= date) && !this._isOff(date, kidId);
      }).sort((a, b) => this._ord(a, b) || String(a.from || '').localeCompare(String(b.from || '')) || String(a.title).localeCompare(String(b.title)));
    }

    _planBuild() {
      const c = this._cfg, kids = this._kids(), now = new Date();
      const avail = (this._hass.services && this._hass.services.notify) || {};
      const tgs = c.tgTargets || [];
      const targets = c.targets.filter((t) => (t.includes('.') ? !!this._hass.states[t] : !!avail[t]));
      const nt = targets.map((t) => {
        const tgT = tgs.includes(t) || (t.includes('.') ? this._isTg(t) : /telegram/i.test(t));
        if (t.includes('.')) {
          const btn = tgs.includes(t) && (tgs.includes(t) || this._isTg(t)) && !!this._hass.services.telegram_bot;
          return { k: btn ? 'tge' : 'e', a: btn ? 'telegram_bot.send_message' : 'notify.send_message', a2: 'notify.send_message', d: { entity_id: t }, x: tgT ? 1 : 0, id: t };
        }
        return { k: t.startsWith('mobile_app_') ? 'app' : tgs.includes(t) ? 'tgs' : 's', a: `notify.${t}`, d: {}, x: tgT ? 1 : 0, id: t };
      });
      const rt = c.targets.filter((t) => tgs.includes(t) || (t.includes('.') ? this._isTg(t) : /telegram/i.test(t)))
        .filter((t) => (t.includes('.') ? !!this._hass.states[t] : !!avail[t]))
        .map((t) => (t.includes('.') ? { a: 'notify.send_message', d: { entity_id: t } } : { a: `notify.${t}`, d: {} }));
      const sp = [];
      if (c.rNotify && avail[c.rNotify]) sp.push({ a: `notify.${c.rNotify}`, d: { data: { type: 'tts' } } });
      if (c.rTts && this._hass.states[c.rTts] && (c.rPlayers || []).length) sp.push({ a: 'tts.speak', d: { entity_id: c.rTts, media_player_entity_id: c.rPlayers } });
      const btnOn = c.nActions !== false;
      const d = {}, times = new Set();
      for (let i = 0; i < 14; i++) {
        const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i), date = dk(day);
        const tl = {}, ev = [];
        const add = (e) => { if (e.at) { ev.push(e); times.add(e.at); } };
        kids.forEach((k) => {
          const items = [];
          this._dayTasks(k.id, day).forEach((t) => {
            const key = `${t.id}:${k.id}`;
            const oth = this._isShared(t) ? t.kids.filter((x) => x !== k.id && this._db.kid[x]).map((x) => `${t.id}:${x}`) : [];
            const cl = this._calLabel(t, date);
            const it = [t.title, key, oth, cl ? `${t.title} (${cl})` : t.title];
            items.push(it);
            if (t.sched === 'once' || !t.to) return;
            const te = this._winTo(t, day);
            if (c.rOn && sp.length) {
              const at = [addMin(te, -Math.max(1, Number(c.rMin) || 15)), t.from || '00:00'].sort().pop();
              const [h1, m1] = te.split(':').map(Number), [h0, m0] = at.split(':').map(Number);
              const n = h1 * 60 + m1 - (h0 * 60 + m0);
              if (n > 0) add({ at, y: 're', i: it, x: T('{name}, bitte noch {title} erledigen – nur noch {n} Minuten!', { name: k.name, title: t.title, n }) });
            }
            const pen = Number(t.penalty) || 0;
            if (pen && c.nMiss && nt.length && t.penaltySince && date > t.penaltySince && !(k.since && date < k.since)) {
              const acts = [[T('🙂 Entschuldigt'), `KP|me|${date}|${t.id}|${k.id}`], [`−${pen} ⭐`, `KP|mx|${date}|${t.id}|${k.id}`], [T('✓ Erledigt'), `KP|md|${date}|${t.id}|${k.id}`]];
              add({ at: addMin(te, 1), y: 'mi', i: it, x: T('⏰ {name} hat „{title}“ verpasst – bitte entscheiden: entschuldigt oder Minuspunkte?', { name: k.name, title: t.title }),
                ba: btnOn ? acts.map(([title, action]) => ({ action, title })) : [], kb: btnOn ? acts.map(([title, action]) => `${String(title).replace(/[:,]/g, '')}:/${action}`).join(', ') : '' });
            }
          });
          tl[k.id] = items;
        });
        const wk = day.getDay() === 0 || day.getDay() === 6;
        if (c.mOn && sp.length && !(c.mWd && wk) && !this._onVacation(date) && !(c.hc && c.holFree !== false && this._pubHol(date))) add({ at: c.mTime || '07:00', y: 'mo' });
        if (c.dOn && nt.length) add({ at: c.dTime || '20:00', y: 'da' });
        const na = kids.filter((k) => this._presMorningAway(k.id, date)).map((k) => k.id);
        d[date] = { t: tl, ev, ...(na.length ? { na } : {}) };
      }
      const goalOn = c.goalOn !== false;
      const tx = {
        t: T('⭐ Yippee! - Kids Chores'), td: T('🌙 Yippee! - Kids Chores – Tagesabschluss'), mo: T('Guten Morgen {name}! Heute stehen an: {list}.'), und: T('{a} und {b}'),
        dl: T('{done}/{total} erledigt'), wt: ` · ${T('⏳ {n} wartet auf Freigabe')}`, hp: ` · ${T('heute +{n} ⭐')}`, st: ` · ${T('Stand {n} ⭐')}`, of: `\n   ${T('offen: {list}')}`, no: T('heute nichts zu tun · Stand {n} ⭐'),
        pk: T('⭐ Punktestand'), ok: T('📋 Heute noch offen'), nk: T('Noch keine Kinder angelegt.'), nt: T('heute nichts zu tun'), ad: T('alles erledigt ✅'), w2: T('⏳ {n} wartet auf Freigabe'),
        hi: T('💬 Yippee!-Befehle\n/punkte – Punktestand aller Kinder\n/offen – was heute noch fehlt\n/heute – Tagesabschluss jetzt\n/woche – Wochenrückblick jetzt\n/hilfe – diese Übersicht'),
        hp2: T('heute +{n} ⭐'), tdk: T('🌙 {name} – Tagesabschluss'), tw: T('📊 Yippee! - Kids Chores – Wochenrückblick'), wv: T('+{n} ⭐ verdient'),
        esc: ['_', '*', '`', '['], bs: '\\',
        vo: T('{name} muss heute noch: {list}.'), vd: T('{name} hat heute alles erledigt. Super!'), vn: T('{name} hat heute keine Aufgaben.'), vp: T('{name} hat {n} Sterne.'), vu: T('Das Kind {name} kenne ich nicht.'),
      };
      const plan = {
        v: 1, cmd: c.cmdOn && rt.length ? 1 : 0, tx, nt, rt, sp, ds: c.dSplit ? 1 : 0, do: c.dOpen ? 1 : 0, neg: c.negOn ? 1 : 0, dto: this._repTo('dTo') || [],
        kids: kids.map((k) => { const g = goalOn && k.goal && this._db.reward[k.goal]; return { id: k.id, n: k.name, e: k.emoji || '', g: g ? [g.title, this._cost(g, k.id)] : 0 }; }),
        d,
      };
      return { plan, times: [...times].sort() };
    }

    // Plan für die nächsten 14 Tage in die Liste schreiben – daraus liest die Automation in Home Assistant
    _planCheck() {
      const c = this._cfg;
      if (!['kid', 'kids', 'advent'].includes(this._config.mode)) {
        this._autoStatus();
        // Knöpfe-Automation der Handy-App auf neuen Stand bringen (nach Updates oder wenn sich die Handys unter 🔔 ändern)
        if ((this._autoOk || {}).app && this._admin()) {
          let sig = ''; try { sig = hsh(JSON.stringify(this._autoCfg('app'))); } catch (e) { sig = ''; }
          if (sig && c.appSig !== sig && this._appUpd !== sig) { this._appUpd = sig; this._autoCreate('app', true); }
        }
        // Telegram-Befehle: /heute und /woche nachrüsten (nur als Administrator)
        if ((this._autoOk || {}).cmd && c.cmdV !== 2 && !this._cmdUpd && this._admin()) { this._cmdUpd = true; this._autoCreate('cmd', true); }
        // alte Automationen unter neuem Namen anlegen und die alten löschen
        Object.keys(this._autoOld || {}).forEach((k) => {
          delete this._autoOld[k];
          this._autoCreate(k, true).then(() => { if ((this._autoOk || {})[k]) this._hass.callApi('DELETE', `config/automation/config/${OLD_IDS[k]}`).catch(() => { /* bleibt */ }); });
        });
      }
      // NFC-Automation: Tag-Liste geändert → Bedingung neu schreiben (nur als Administrator)
      if (c.nfcOn && (this._autoOk || {}).nfc && this._admin() && !this._nfcBusy) {
        const sig = this._nfcTags().join(',');
        if (c.nfcSig !== sig) { this._nfcBusy = true; this._autoCreate('nfc', true).then(() => this._setCfg({ nfcSig: sig })).finally(() => { this._nfcBusy = false; }); }
      }
      if (c.voiceOn && (this._autoOk || {}).voice && this._admin() && !this._voiceBusy && c.voiceSig !== LANG) { this._voiceBusy = true; this._autoCreate('voice', true).then(() => this._setCfg({ voiceSig: LANG })).finally(() => { this._voiceBusy = false; }); }
      if (!c.bgOn && !c.voiceOn) { if (this._db.plan.main && !['kid', 'kids', 'advent'].includes(this._config.mode)) this._del('plan', 'main'); return; }
      if (!this._kids().length) return;
      const { plan, times } = this._planBuild();
      this._bgTimes = times;
      const cur = this._db.plan.main || {};
      const strip = (p) => { const x = { ...p }; delete x.id; delete x.gen; delete x.dev; return JSON.stringify(x); };
      window.__kpDev = window.__kpDev || uid();
      const age = Date.now() - (Number(cur.gen) || 0);
      if (strip(plan) !== strip(cur) && (!cur.gen || cur.dev === window.__kpDev || age > 10 * 60000)) this._save('plan', 'main', { ...plan, gen: Date.now(), dev: window.__kpDev });
      // Uhrzeiten geändert -> Automation anpassen (nur als Administrator möglich)
      const sig = [...times, c.cmdOn ? 'cmd' : '', BG_V].join(',');
      if (!['kid', 'kids', 'advent'].includes(this._config.mode)) this._autoStatus();
      if (c.bgOn && (this._autoOk || {}).bg && c.bgSig !== sig && !this._bgBusy) { this._bgBusy = true; this._autoCreate('bg', true).finally(() => { this._bgBusy = false; }); }
    }


    _nfcTags() { return [...new Set(Object.values(this._db.task).filter((t) => !t.virtual && t.nfc).map((t) => String(t.nfc)))].sort(); }
    // Antwort für den Sprachassistenten – liest Plan, heutigen Stand und Punkte direkt aus der Liste
    _voiceTpl() {
      const ent = this._config.storage;
      return String.raw`{%- set ns = namespace(p={}, s={}, k={}, pt=[]) -%}
{%- for it in kp['${ent}']['items'] if (it.summary or '').startswith('kp|') and it.description -%}
{%- if it.summary == 'kp|plan|main' -%}{%- set ns.p = it.description | from_json -%}
{%- elif it.summary == 'kp|log|' ~ now().strftime('%Y-%m-%d') -%}{%- set ns.s = (it.description | from_json).get('s', {}) -%}
{%- elif it.summary.startswith('kp|kid|') -%}{%- set ns.k = dict(ns.k, **{it.summary[7:]: it.description | from_json}) -%}
{%- elif it.summary.startswith('kp|pt|') -%}{%- set ns.pt = ns.pt + [dict(it.description | from_json, id=it.summary[6:])] -%}
{%- endif -%}
{%- endfor -%}
{%- set P = ns.p -%}{%- set S = ns.s -%}{%- set TX = P.get('tx', {}) -%}
{%- set T0 = P.get('d', {}).get(now().strftime('%Y-%m-%d'), {}).get('t', {}) -%}
{%- set nm = (trigger.slots.name | default('')) | lower | trim -%}
{%- set f = namespace(kd=none) -%}
{%- for kd in P.get('kids', []) -%}{%- if (kd.n | lower) == nm or (kd.n | lower) in nm -%}{%- set f.kd = kd -%}{%- endif -%}{%- endfor -%}
{%- if f.kd is none -%}{{ (TX.vu or 'Das Kind {name} kenne ich nicht.') | replace('{name}', trigger.slots.name | default('')) }}
{%- elif trigger.id == 'pts' -%}
{%- set K = ns.k.get(f.kd.id, {}) -%}{%- set q = namespace(n=K.get('points', 0)) -%}
{%- for x in ns.pt if x.get('k') == f.kd.id and x.id not in K.get('ap', []) -%}{%- set q.n = (q.n + (x.get('n', 0) | int)) if P.get('neg') else ([q.n + (x.get('n', 0) | int), 0] | max) -%}{%- endfor -%}
{{ TX.vp | replace('{name}', f.kd.n) | replace('{n}', q.n | string) }}
{%- else -%}
{%- set L = namespace(l=[], w=0) -%}
{%- for i in T0.get(f.kd.id, []) -%}
{%- set t = namespace(x=(i[1] not in S)) -%}{%- for o in i[2] -%}{%- if S.get(o) in ['p', 'd'] -%}{%- set t.x = false -%}{%- endif -%}{%- endfor -%}
{%- if t.x and i[0] not in L.l -%}{%- set L.l = L.l + [i[0]] -%}{%- elif S.get(i[1]) == 'p' -%}{%- set L.w = L.w + 1 -%}{%- endif -%}
{%- endfor -%}
{%- if not T0.get(f.kd.id) -%}{{ TX.vn | replace('{name}', f.kd.n) }}
{%- elif L.l -%}{{ TX.vo | replace('{name}', f.kd.n) | replace('{list}', L.l | join(', ')) }}
{%- else -%}{{ TX.vd | replace('{name}', f.kd.n) }}{%- endif -%}
{%- endif -%}`;
    }

    _bgTpl() {
      const ent = this._config.storage;
      return String.raw`{%- macro op(i, S) -%}{%- set t = namespace(x=(i[1] not in S)) -%}{%- for o in i[2] -%}{%- if S.get(o) in ['p', 'd'] -%}{%- set t.x = false -%}{%- endif -%}{%- endfor -%}{{ 1 if t.x else 0 }}{%- endmacro -%}
{%- macro tk(i, S) -%}{%- set t = namespace(x=false) -%}{%- for o in i[2] -%}{%- if S.get(o) in ['p', 'd'] -%}{%- set t.x = true -%}{%- endif -%}{%- endfor -%}{{ 1 if t.x else 0 }}{%- endmacro -%}
{%- set day = now().strftime('%Y-%m-%d') -%}
{%- set hm = now().strftime('%H:%M') -%}
{%- set ns = namespace(p={}, s={}, k={}, pt=[], say=[], msg=[], rep=[], out=[]) -%}
{%- for it in kp['${ent}']['items'] if (it.summary or '').startswith('kp|') and it.description -%}
{%- if it.summary == 'kp|plan|main' -%}{%- set ns.p = it.description | from_json -%}
{%- elif it.summary == 'kp|log|' ~ day -%}{%- set ns.s = (it.description | from_json).get('s', {}) -%}
{%- elif it.summary.startswith('kp|kid|') -%}{%- set ns.k = dict(ns.k, **{it.summary[7:]: it.description | from_json}) -%}
{%- elif it.summary.startswith('kp|pt|') -%}{%- set ns.pt = ns.pt + [dict(it.description | from_json, id=it.summary[6:])] -%}
{%- endif -%}
{%- endfor -%}
{%- macro kpts(id) -%}{%- set K = ns.k.get(id, {}) -%}{%- set q = namespace(n=K.get('points', 0)) -%}{%- for x in ns.pt if x.get('k') == id and x.id not in K.get('ap', []) -%}{%- set q.n = (q.n + (x.get('n', 0) | int)) if P.get('neg') else ([q.n + (x.get('n', 0) | int), 0] | max) -%}{%- endfor -%}{{ q.n }}{%- endmacro -%}
{%- set P = ns.p -%}{%- set S = ns.s -%}{%- set TX = P.get('tx', {}) -%}
{%- set D = P.get('d', {}).get(day, {}) -%}{%- set T0 = D.get('t', {}) -%}
{%- set cmd = ((trigger.event.data.command | default('')).split('@')[0] | lower) if trigger.event is defined else '' -%}
{%- for e in D.get('ev', []) if not cmd and e.at == hm -%}
{%- if e.y == 'mo' -%}
{%- set g = namespace(parts=[]) -%}
{%- for kd in P.kids if kd.id not in D.get('na', []) -%}
{%- set L = namespace(l=[]) -%}
{%- for i in T0.get(kd.id, []) -%}{%- if op(i, S) == '1' and i[3] not in L.l -%}{%- set L.l = L.l + [i[3]] -%}{%- endif -%}{%- endfor -%}
{%- if L.l | length == 1 -%}{%- set g.parts = g.parts + [TX.mo | replace('{name}', kd.n) | replace('{list}', L.l[0])] -%}
{%- elif L.l | length > 1 -%}{%- set g.parts = g.parts + [TX.mo | replace('{name}', kd.n) | replace('{list}', TX.und | replace('{a}', L.l[:-1] | join(', ')) | replace('{b}', L.l[-1]))] -%}
{%- endif -%}
{%- endfor -%}
{%- if g.parts -%}{%- set ns.say = ns.say + [g.parts | join(' ')] -%}{%- endif -%}
{%- elif e.y == 're' -%}{%- if op(e.i, S) == '1' -%}{%- set ns.say = ns.say + [e.x] -%}{%- endif -%}
{%- elif e.y == 'mi' -%}{%- if op(e.i, S) == '1' -%}{%- set ns.msg = ns.msg + [{'m': e.x, 't': TX.t, 'ba': e.ba, 'kb': e.kb}] -%}{%- endif -%}
{%- endif -%}
{%- endfor -%}
{%- set isDa = (not cmd) and ((D.get('ev', []) | selectattr('at', 'eq', hm) | selectattr('y', 'eq', 'da') | list | count) > 0) -%}
{%- set wantR = isDa or (P.get('cmd') and cmd in ['/heute', '/woche']) -%}
{%- set rp = namespace(h=[], l=[], k=[]) -%}
{%- if wantR -%}
{%- set mon = (now() - timedelta(days=now().weekday())).strftime('%Y-%m-%d') -%}
{%- for kd in P.kids -%}
{%- set K = ns.k.get(kd.id, {}) -%}{%- set pts = kpts(kd.id) | int -%}
{%- set c = namespace(t=0, d=0, w=0, o=[], wd=0, wt=0) -%}
{%- for i in T0.get(kd.id, []) -%}{%- if tk(i, S) == '0' -%}{%- set st = S.get(i[1], '') -%}{%- set c.t = c.t + 1 -%}
{%- if st == 'd' -%}{%- set c.d = c.d + 1 -%}{%- elif st == 'p' -%}{%- set c.w = c.w + 1 -%}{%- elif not st and i[0] not in c.o -%}{%- set c.o = c.o + [i[0]] -%}{%- endif -%}
{%- endif -%}{%- endfor -%}
{%- for dd, v in K.get('rd', {}).items() if dd >= mon and dd < day -%}{%- set c.wd = c.wd + (v[0] | int) -%}{%- set c.wt = c.wt + (v[1] | int) -%}{%- endfor -%}
{%- set plus = K.get('ledger', []) | selectattr('d', 'eq', day) | selectattr('n', 'gt', 0) | map(attribute='n') | sum -%}
{%- if cmd == '/woche' -%}
{%- set hd = kd.e ~ ' ' ~ kd.n ~ ' ' ~ (((c.wd + c.d) ~ '/' ~ (c.wt + c.d + c.w)) if (c.wt + c.d + c.w) else '–') -%}
{%- set wv = K.get('wk', {}).get(mon) -%}{%- if wv is none -%}{%- set wv = K.get('ledger', []) | selectattr('d', 'ge', mon) | selectattr('n', 'gt', 0) | map(attribute='n') | sum -%}{%- endif -%}
{%- set cnt = '' -%}
{%- set dt = (TX.wv | replace('{n}', wv | string)) ~ (TX.st | replace('{n}', pts | string)) -%}
{%- else -%}
{%- set cnt = (c.d ~ '/' ~ c.t ~ (' ✅' if c.d == c.t else '')) if c.t else '' -%}
{%- set hd = kd.e ~ ' ' ~ kd.n ~ ' ' ~ (cnt or '–') -%}
{%- set dt = ((TX.nt ~ ' · ') if c.t == 0 else '') ~ (TX.hp2 | replace('{n}', plus | string)) ~ ((' · ' ~ (TX.w2 | replace('{n}', c.w | string))) if c.w else '') ~ (TX.st | replace('{n}', pts | string)) ~ ((TX.of | replace('{list}', c.o | join(', '))) if P.get('do') and c.o else '') -%}
{%- endif -%}
{%- set rp.h = rp.h + [hd] -%}{%- set rp.l = rp.l + [kd.e ~ ' ' ~ kd.n ~ ': ' ~ dt] -%}{%- set rp.k = rp.k + [{'m': kd.e ~ ' ' ~ ((cnt ~ ' · ') if cnt else '') ~ dt, 'n': kd.n}] -%}
{%- endfor -%}
{%- set rtxt = ((rp.h | join(' · ')) ~ '\n' if rp.h | length > 1 else '') ~ (rp.l | join('\n')) -%}
{%- if isDa and rp.l -%}
{%- if P.get('ds') -%}{%- for x in rp.k -%}{%- set ns.msg = ns.msg + [{'m': x.m, 't': TX.tdk | replace('{name}', x.n), 'ba': [], 'kb': '', 'to': P.get('dto', [])}] -%}{%- endfor -%}
{%- else -%}{%- set ns.msg = ns.msg + [{'m': rtxt, 't': TX.td, 'ba': [], 'kb': '', 'to': P.get('dto', [])}] -%}{%- endif -%}
{%- endif -%}
{%- endif -%}
{%- if cmd and P.get('cmd') -%}
{%- set R = namespace(l=[]) -%}
{%- if cmd == '/punkte' -%}
{%- for kd in P.kids -%}{%- set pts = kpts(kd.id) | int -%}{%- set R.l = R.l + [kd.e ~ ' ' ~ kd.n ~ ': ' ~ pts ~ ' ⭐' ~ ((' · 🎯 ' ~ kd.g[0] ~ ' ' ~ ([pts, kd.g[1]] | min) ~ '/' ~ kd.g[1]) if kd.g else '')] -%}{%- endfor -%}
{%- set ns.rep = [TX.pk ~ '\n' ~ ((R.l | join('\n')) if R.l else TX.nk)] -%}
{%- elif cmd == '/offen' -%}
{%- for kd in P.kids -%}{%- set c = namespace(o=[], w=0, n=0) -%}
{%- for i in T0.get(kd.id, []) -%}{%- set c.n = c.n + 1 -%}{%- if op(i, S) == '1' -%}{%- set c.o = c.o + [i[0]] -%}{%- elif S.get(i[1]) == 'p' -%}{%- set c.w = c.w + 1 -%}{%- endif -%}{%- endfor -%}
{%- set R.l = R.l + [kd.e ~ ' ' ~ kd.n ~ ': ' ~ (TX.nt if c.n == 0 else ((c.o | join(', ')) if c.o else TX.ad)) ~ ((' (' ~ (TX.w2 | replace('{n}', c.w | string)) ~ ')') if c.w else '')] -%}
{%- endfor -%}
{%- set ns.rep = [TX.ok ~ '\n' ~ ((R.l | join('\n')) if R.l else TX.nk)] -%}
{%- elif cmd == '/heute' -%}{%- set ns.rep = [TX.td ~ '\n' ~ (rtxt if rp.l else TX.nk)] -%}
{%- elif cmd == '/woche' -%}{%- set ns.rep = [TX.tw ~ '\n' ~ (rtxt if rp.l else TX.nk)] -%}
{%- elif cmd == '/hilfe' -%}{%- set ns.rep = [TX.hi] -%}
{%- endif -%}
{%- endif -%}
{%- for txt in ns.say -%}{%- for s in P.get('sp', []) -%}{%- set ns.out = ns.out + [{'a': s.a, 'd': dict(s.d, message=txt)}] -%}{%- endfor -%}{%- endfor -%}
{%- for m in ns.msg -%}{%- for t in P.get('nt', []) if not m.get('to') or t.get('id') in m.to -%}
{%- set z = namespace(v=m.m) -%}{%- if t.x -%}{%- for ch in TX.esc -%}{%- set z.v = z.v | replace(ch, TX.bs ~ ch) -%}{%- endfor -%}{%- endif -%}
{%- set dd = dict(t.d, title=m.t, message=z.v) -%}{%- set a = t.a -%}
{%- if t.k == 'app' and m.ba -%}{%- set dd = dict(dd, data={'actions': m.ba}) -%}
{%- elif t.k == 'tgs' and m.kb -%}{%- set dd = dict(dd, data={'inline_keyboard': [m.kb]}) -%}
{%- elif t.k == 'tge' -%}{%- if m.kb -%}{%- set dd = dict(dd, inline_keyboard=[m.kb]) -%}{%- else -%}{%- set a = t.a2 -%}{%- endif -%}
{%- endif -%}
{%- set ns.out = ns.out + [{'a': a, 'd': dd}] -%}
{%- endfor -%}{%- endfor -%}
{%- for r in ns.rep -%}{%- for t in P.get('rt', []) -%}
{%- set z = namespace(v=r) -%}{%- for ch in TX.esc -%}{%- set z.v = z.v | replace(ch, TX.bs ~ ch) -%}{%- endfor -%}
{%- set ns.out = ns.out + [{'a': t.a, 'd': dict(t.d, message=z.v)}] -%}
{%- endfor -%}{%- endfor -%}
{{ ns.out | to_json }}`;
    }

    _bkName() { return `YippeeKidsChores${dk(new Date()).split('-').reverse().join('')}.json`; }
    _inApp() { return /Home ?Assistant/i.test(navigator.userAgent || ''); }

    _backupJson() {
      const data = {};
      ['kid', 'task', 'reward', 'log', 'req', 'cfg', 'adc', 'adk', 'zc', 'zk'].forEach((ty) => {
        data[ty] = {};
        Object.values(this._db[ty]).forEach((x) => { if (x.virtual) return; const c = { ...x }; delete c.id; data[ty][x.id] = c; });
      });
      return JSON.stringify({ app: APP_ID, v: VERSION, date: new Date().toISOString(), data });
    }

    _copy(text, okMsg) {
      const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        this.shadowRoot.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        ta.remove();
        this._toast(ok ? okMsg : T('Kopieren nicht möglich – bitte „Herunterladen“ nutzen'));
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => this._toast(okMsg), fallback);
      else fallback();
    }

    _restore() {
      this._modal(T('♻️ Sicherung wiederherstellen'), `<div class="hint">${T('⚠️ Ersetzt alle aktuellen Daten (Kinder, Aufgaben, Punkte, Verlauf, Einstellungen) durch die Sicherung.')}</div>
        <label>${T('Sicherungsdatei')}<input type="file" name="bkfile" accept=".json,application/json"></label>
        <label>${T('…oder Inhalt einfügen')}<textarea name="bk" rows="6" placeholder='{"app":"yippee-kids-chores", …}'></textarea></label>`, false, {
        saveLabel: T('♻️ Wiederherstellen'), audit: false,
        save: (b) => {
          let j;
          try { j = JSON.parse(b.querySelector('[name=bk]').value); } catch (e) { this._toast(T('Das ist keine gültige Sicherung')); return false; }
          if (!j || ![APP_ID, OLD_APP].includes(j.app) || !j.data) { this._toast(T('Das ist keine Yippee!-Sicherung')); return false; }
          this._applyBackup(j);
          return true;
        },
      });
    }

    _isTg(e) { const r = this._hass.entities && this._hass.entities[e]; return (r && r.platform === 'telegram_bot') || /telegram/i.test(`${e} ${this._ename(e)}`); }
    _ename(e) { const st = this._hass.states[e]; return (st && st.attributes.friendly_name) || e; }



    _kadmShut() {
      if (!this._kShut) { try { this._kShut = new Set(JSON.parse(localStorage.getItem('kpKadm') || '[]')); } catch (e) { this._kShut = new Set(); } }
      return this._kShut;
    }


    // ⬇️ Berichte als CSV (Excel: Semikolon, UTF-8 mit BOM) – Tage bzw. Wochen, je Kind erledigt/fällig/Sterne/eingelöst
    _repCsv() {
      const kids = this._kids(), mode = this._repMode || 'd', today = dk(new Date());
      const q = (x) => { const v = String(x); return /[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
      const head = [mode === 'd' ? T('Datum') : T('Woche ab'), ...kids.flatMap((k) => [`${k.name} ${T('erledigt')}`, `${k.name} ${T('fällig')}`, `${k.name} ${T('Sterne')}`, `${k.name} ${T('eingelöst')}`])];
      const lines = [head];
      if (mode === 'd') {
        const dates = [...new Set(kids.flatMap((k) => Object.keys(k.rd || {})))].filter((d) => d < today).sort().reverse();
        [today, ...dates].forEach((d) => lines.push([d, ...kids.flatMap((k) => { const s = d === today ? this._daySnap(k, today) : (k.rd || {})[d]; return s ? [s[0], s[1], s[2], s[3]] : ['', '', '', '']; })]));
      } else {
        const mon0 = this._monOf(today);
        const weeks = [...new Set(kids.flatMap((k) => Object.keys(k.rw || {})))].filter((d) => d < mon0).sort().reverse();
        lines.push([mon0, ...kids.flatMap((k) => { const w = this._weekStats(k); return [w.done, w.due, w.plus, w.spent]; })]);
        weeks.forEach((m) => lines.push([m, ...kids.flatMap((k) => { const w = (k.rw || {})[m]; return w ? [w[0], w[1], w[2], w[3]] : ['', '', '', '']; })]));
      }
      const csv = `\ufeff${lines.map((l) => l.map(q).join(';')).join('\r\n')}\r\n`;
      const name = `YippeeBerichte-${mode === 'd' ? 'Tage' : 'Wochen'}-${today}.csv`;
      try {
        const file = new File([csv], name, { type: 'text/csv' });
        if (this._inApp() && navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: name }).catch(() => { /* abgebrochen */ }); return; }
        const a2 = document.createElement('a');
        a2.href = URL.createObjectURL(file); a2.download = name;
        document.body.appendChild(a2); a2.click(); a2.remove();
        setTimeout(() => URL.revokeObjectURL(a2.href), 5000);
        this._toast(T('⬇️ {name} wird heruntergeladen', { name }));
      } catch (e) { this._copy(csv.slice(1), T('📋 Tabelle kopiert')); }
    }

    // Einzelheiten eines Tages: Aufgaben mit Stand (solange die Tagesliste noch da ist) und Buchungen
    _repDay(date) {
      const today = dk(new Date()), [y, m, d] = date.split('-').map(Number), day = new Date(y, m - 1, d);
      const has = date === today || !!this._db.log[date];
      const ico = { d: ['✓', T('erledigt')], p: ['⏳', T('wartet auf Freigabe')], e: ['🙂', T('entschuldigt')], m: ['✕', T('verpasst')], x: ['✕', T('verpasst')] };
      const body = this._kids().map((k) => {
        const s = date === today ? this._daySnap(k, today) : (k.rd || {})[date];
        const ts = has ? Object.values(this._db.task).filter((t) => (t.kids || []).includes(k.id) && t.sched !== 'once' && this._isFor(t, k.id, day) && !(t.created && date < t.created) && !(this._isShared(t) && this._takenBy(t, date, k.id))).sort((a, b) => String(a.from || '').localeCompare(String(b.from || '')) || String(a.title).localeCompare(String(b.title))) : [];
        const led = (k.ledger || []).filter((x) => x.d === date);
        return `<div class="lbl">${esc(k.emoji || '')} ${esc(k.name)}${s && s[1] ? ` · ${s[0]}/${s[1]}` : ''}${s ? ` · +${s[2]} ⭐` : ''}</div>
          ${ts.map((t) => { const st = this._st(date, t.id, k.id), ic = ico[st] || ['–', date === today ? T('offen') : T('nicht erledigt')]; return `<div class="row"><span>${ic[0]}</span><span class="grow">${esc(t.emoji || '')} ${esc(t.title)}<small>${esc(ic[1])}${this._isExtra(t) ? ` · ${T('🙋 Zusatzaufgabe')}` : ''}</small></span></div>`; }).join('')}
          ${led.length ? led.map((x) => `<div class="hint">${x.n > 0 ? '+' : ''}${x.n} ⭐ ${esc(this._reasonT(x.r))}</div>`).join('') : ''}
          ${!has ? `<div class="hint">${T('Einzelheiten zu diesem Tag sind nicht mehr gespeichert – nur noch die Zahlen.')}</div>` : ''}`;
      }).join('');
      this._modal(`📊 ${esc(longDate(date))}`, body);
    }




    _presRead(b) {
      const q = (n) => b.querySelector(`[name=${n}]`);
      if (!q('presOn')) return null;
      const hol = {};
      HOL_TYPES.forEach(([id]) => { const m = q(`ph_${id}`).value; if (m) hol[id] = { m, w: Math.max(1, Math.min(8, Math.round(Number(q(`pw_${id}`).value) || 3))) }; });
      const tm = (el) => { const v = el ? el.value : ''; return /^\d\d:\d\d$/.test(v) ? v : ''; };
      const ex = [...b.querySelectorAll('.exrow')].map((r) => { const x = { from: r.querySelector('[data-exf]').value, to: r.querySelector('[data-ext]').value, st: r.querySelector('[data-exs]').value }; const fT = tm(r.querySelector('[data-exft]')), tT = tm(r.querySelector('[data-extt]')); if (fT) x.fT = fT; if (tT) x.tT = tT; return x; }).filter((x) => x.from && x.to).map((x) => (x.from > x.to ? { ...x, from: x.to, to: x.from } : x));
      const rules = [...b.querySelectorAll('.prule')].map((r) => ({ st: r.querySelector('[data-rst]').value, every: Number(r.querySelector('[data-rev]').value) || 1, start: r.querySelector('[data-rsd]').value, fT: r.querySelector('[data-rft]').value || '', toDay: Number(r.querySelector('[data-rtd]').value), tT: r.querySelector('[data-rtt]').value || '' })).filter((r) => r.start);
      return { on: q('presOn').checked, base: q('pBase').value === 'out' ? 'out' : 'in', rules, hol, swap: q('pSwap').checked, hA: q('pHA').value || '', hL: q('pHL').value || '', ex };
    }

    _editKid(...a) { return this._admCall('_editKid', a, false); }



    // 🔎 Suche im Assistenten (Schritt 2): passende Vorschläge zeigen, Gruppen mit Treffern aufklappen
    _wizFilter() {
      const r = this.shadowRoot, inp = r.querySelector('.wizq'), w = this._wiz;
      if (!inp || !w) return;
      const q = hbNorm(inp.value).trim();
      if (q && !w.q) w.open0 = new Set([...r.querySelectorAll('.wizg[open]')].map((g) => g.dataset.b));
      w.q = inp.value;
      r.querySelectorAll('.wizg').forEach((g) => {
        let hits = 0, head = null, any = false;
        const fin = () => { if (head) head.hidden = !any; };
        g.querySelectorAll('.wizgb > .tcat, .wizgb > .crow').forEach((el) => {
          if (el.classList.contains('tcat')) { fin(); head = el; any = false; return; }
          const ok = !q || q.split(/\s+/).every((x) => (el.dataset.q || '').includes(x));
          el.hidden = !ok; if (ok) { any = true; hits++; }
        });
        fin();
        g.hidden = !hits;
        if (q) g.open = hits > 0; else if (w.open0) g.open = w.open0.has(g.dataset.b);
      });
      if (!q) w.open0 = null;
      const none = r.querySelector('.wiznone'); if (none) none.hidden = !q || !!r.querySelector('.wizg:not([hidden])');
    }



    // Zähler „ausgewählt/gesamt“ je Tageszeit-Gruppe im Assistenten aktuell halten
    _wizCount() {
      this.shadowRoot.querySelectorAll('.wizg').forEach((g) => { const n = g.querySelector('.wizn'); if (n) n.textContent = `${g.querySelectorAll('.wizt:checked').length}/${g.querySelectorAll('.wizt').length}`; });
    }

    // Auswahl im Assistenten aus den Kästchen übernehmen – auch vor jedem Neuzeichnen (sonst gingen Häkchen verloren,
    // wenn sich währenddessen z. B. auf einem anderen Gerät etwas ändert)
    _wizKeep() {
      const w = this._wiz, root = this.shadowRoot;
      if (!w || !root.querySelector('.wiz')) return;
      if (w.step === 2 && root.querySelector('.wizt')) { w.t = new Set([...root.querySelectorAll('.wizt:checked')].map((x) => Number(x.value))); w.open = new Set([...root.querySelectorAll('.wizg[open]')].map((x) => x.dataset.b)); }
      if (w.step === 3 && root.querySelector('.wizr')) {
        w.r = new Set([...root.querySelectorAll('.wizr:checked')].map((x) => Number(x.value)));
        w.rc = w.rc || {}; root.querySelectorAll('.wizrcv').forEach((x) => { const v = Math.round(Number(x.value)); if (v > 0) w.rc[x.dataset.i] = Math.min(9999, v); });
      }
      if (w.step === 4 && root.querySelector('.wizf, .wizp')) { w.f = w.f || {}; root.querySelectorAll('.wizf').forEach((x) => { w.f[x.dataset.k] = x.checked; }); w.p = new Set([...root.querySelectorAll('.wizp:checked')].map((x) => x.value)); }
    }

    _wizAct(...a) { return this._admCall('_wizAct', a, false); }


    _memClean() {
      const before = (this._mem || {}).total || 0;
      this._cleanup(35);
      const cut = dk(new Date(Date.now() - this._trashDays() * 864e5)); // eingestellte Aufbewahrungszeit (7/14/30 Tage)
      Object.values(this._db.trash).forEach((x) => { if (!x.d || x.d < cut) this._del('trash', x.id); });
      const refs = this._phRefs();
      Object.values(this._db.ph).forEach((x) => { if (!refs.has(x.id)) this._phDel(`ph:${x.id}`); });
      const au = this._db.audit.main;
      if (au && Array.isArray(au.e) && au.e.length > 100) this._save('audit', 'main', { e: au.e.slice(0, 100) }, (c) => ({ e: ((c && c.e) || []).slice(0, 100) }));
      this._memBefore = before;
      this._toast(T('🧹 Aufgeräumt – die Größe wird gleich neu berechnet'));
    }

    _taskFromTemplate(tp, kids) {
      const [, emoji, deTitle, points, win, days] = tp; const title = T(deTitle);
      const ws = this._tplWins(win), w = ws[0];
      const cal = days === 'dates' && this._cfg.muellOn && this._cfg.muellCal;
      const sched = cal ? 'cal' : days === 'dates' ? 'dates' : days === 'once' ? 'once' : 'week';
      const se = SEASONS.find((x) => x[0].test(deTitle)) || [];
      const steps = this._cfg.routOn && ROUT_STEPS[deTitle] ? { steps: ROUT_STEPS[deTitle].map((x) => ({ t: T(x) })) } : {};
      return { ...steps, ...(SCHOOL_RX.test(deTitle) && sched === 'week' ? { school: true, ...(PREV_TPL.includes(deTitle) ? { schoolPrev: true } : {}) } : {}), ...(se[1] && sched !== 'once' ? { sFrom: se[1], sTo: se[2] } : {}), ...(cal ? { cal: this._cfg.muellCal, calKw: /papier|gelb/i.test(deTitle) ? 'papier, gelb' : '', calPrev: true } : {}), title, emoji, points, kids, sched, days: Array.isArray(days) ? days : [], dates: [], from: w[0], to: w[1], ...(ws.length > 1 && sched === 'week' ? { slots: ws.map(([f, t]) => ({ from: f, to: t })) } : {}), until: '', penalty: 0, penaltySince: '', created: dk(new Date()) };
    }

    // 🎽 Turnbeutel: an welchen Tagen ist Sport? → gepackt wird am Abend davor
    _sportAsk(tid) {
      const t = this._db.task[tid];
      if (!t) return;
      const names = (t.kids || []).map((x) => (this._db.kid[x] || {}).name).filter(Boolean).join(', ');
      const cur = new Set((t.days || []).map((x) => (x + 1) % 7));
      this._modal(T('🎽 Wann ist Sport?'), `<div class="hint">${T('An welchen Tagen hat {name} Sport? „Turnbeutel packen“ kommt dann jeweils am Abend davor.', { name: esc(names || '?') })}</div>
        <div class="pick txt">${[1, 2, 3, 4, 5].map((x) => `<label><input type="checkbox" name="sd" value="${x}" ${cur.has(x) && cur.size < 5 ? 'checked' : ''}><span>${DAYS[x]}</span></label>`).join('')}</div>`, false, {
        saveLabel: T('Speichern'), audit: false,
        save: (b) => {
          const sd = [...b.querySelectorAll('[name=sd]:checked')].map((x) => Number(x.value));
          if (!sd.length) { this._toast(T('Bitte mindestens einen Sporttag wählen')); return false; }
          const days = sd.map((x) => (x + 6) % 7).sort();
          const cur2 = this._db.task[tid];
          if (cur2) this._save('task', tid, { ...cur2, days, school: true, schoolPrev: true });
          this._toast(T('🎽 Turnbeutel packen: jeweils am Abend vor dem Sport'));
          return true;
        },
      });
    }

    _slotRow(n, f = '19:00', to = '20:00') { return `<div class="g2 g2e slotrow" style="margin-top:6px;grid-template-columns:1fr 1fr auto;align-items:end"><label>${T('Zeitfenster {n}', { n })}<input type="time" data-slotfrom value="${esc(f)}"></label><label>${T('bis')}<input type="time" data-slotto value="${esc(to)}"></label><button type="button" class="icon" data-a="slotdel">✕</button></div>`; }
    // Vorlagen-Zeitfenster: 'm', ['von','bis'] oder mehrere wie 'm+mi+a'
    _tplWins(win) { return typeof win === 'string' && win.includes('+') ? win.split('+').map((x) => WINDOWS[x]).filter(Boolean) : [Array.isArray(win) ? win : (WINDOWS[win] || ['', ''])]; }

    _tplMeta(tp) {
      const [, , , pts, win, days, min, max] = tp;
      const ws = win ? this._tplWins(win).filter((x) => x[0]) : [], w = ws.length ? ws[0] : null;
      const d = days === 'dates' ? T('📅 Termine') : days === 'once' ? T('⚡ einmalig') : !days ? T('täglich') : WEEK.filter((x) => days.includes(x)).map((x) => DAYS[x]).join(' ');
      return `+${pts} ⭐ · ${d}${ws.length > 1 ? ` · 🔁 ${ws.map((x) => `${x[0]}–${x[1]}`).join(' / ')}` : w ? ` · ⏰ ${w[0]}–${w[1]}` : ''} · ${max ? T('{min}–{max} J.', { min, max }) : T('ab {min} J.', { min })}`;
    }

    _suggest(kidId) {
      const k = this._db.kid[kidId];
      if (!k) return;
      const age = this._age(k);
      if (age === null) { this._toast(T('Bitte zuerst Geburtsmonat und -jahr eintragen')); this._editKid(kidId); return; }
      const have = new Set(Object.values(this._db.task).filter((t) => (t.kids || []).includes(kidId)).map((t) => String(t.title).toLowerCase()));
      const list = TEMPLATES.map((x, i) => ({ x, i })).filter(({ x }) => (this._cfg.routOn || !ROUT_STEPS[x[2]]) && tplOk(x, this._tplAge(x, k)) && !have.has(x[2].toLowerCase()) && !have.has(T(x[2]).toLowerCase()));
      const cats = [...new Set(list.map(({ x }) => x[0]))];
      const body = list.length
        ? `<div class="hint">${esc(k.emoji || '')} ${T('<b>{name}</b> ist {age} Jahre alt. Diese Aufgaben passen und sind noch nicht zugewiesen – einfach anhaken:', { name: esc(k.name), age })}</div>
          <div><button type="button" class="btn sm" data-a="sgall">${T('Alle auswählen')}</button> <button type="button" class="btn sm" data-a="sgnone">${T('Keine')}</button></div>
          ${cats.map((c) => `<div class="tcat">${T(c)}</div>${list.filter(({ x }) => x[0] === c).map(({ x, i }) => `<label class="crow"><input type="checkbox" name="sg" value="${i}"><span>${x[1]} ${esc(T(x[2]))}<small>${this._tplMeta(x)}</small></span></label>`).join('')}`).join('')}`
        : `<div class="empty">${T('Alle passenden Vorlagen für {name} ({age} J.) sind schon zugewiesen 👍', { name: esc(k.name), age })}</div>`;
      this._modal(T('💡 Vorschläge für {name} ({age} J.)', { name: esc(k.name), age }), body, false, {
        saveLabel: T('＋ Hinzufügen'),
        save: (b) => {
          const picked = [...b.querySelectorAll('[name=sg]:checked')].map((x) => TEMPLATES[Number(x.value)]);
          if (!picked.length) return true;
          let needDates = 0;
          picked.forEach((tp) => {
            const ex = Object.values(this._db.task).find((t) => String(t.title).toLowerCase() === tp[2].toLowerCase() || String(t.title).toLowerCase() === T(tp[2]).toLowerCase());
            if (ex) { if (!(ex.kids || []).includes(kidId)) this._save('task', ex.id, { ...ex, kids: [...(ex.kids || []), kidId] }); }
            else {
              const ntid = uid();
              this._save('task', ntid, this._taskFromTemplate(tp, [kidId]));
              if (tp[2] === 'Turnbeutel packen') setTimeout(() => this._sportAsk(ntid), 400);
              if (tp[5] === 'dates' && !(this._cfg.muellOn && this._cfg.muellCal)) needDates++;
            }
          });
          this._tab = 'aufgaben';
          this._toast(`${picked.length > 1 ? T('✅ {n} Aufgaben für {name} hinzugefügt', { n: picked.length, name: k.name }) : T('✅ 1 Aufgabe für {name} hinzugefügt', { name: k.name })}${needDates ? ` – ${T('bei 📅-Aufgaben noch die Termine eintragen')}` : ''}`);
          return true;
        },
      });
    }

    _filterTpl(box) {
      if (!box) return;
      const all = box.querySelector('[data-a="tplall"]');
      const showAll = all && all.checked;
      const sel = [...box.querySelectorAll('[name=kid]:checked')].map((c) => this._db.kid[c.value]).filter((k) => k && this._age(k) !== null);
      const qs = String((box.querySelector('[name=tplq]') || {}).value || '').trim().toLowerCase();
      box.querySelectorAll('.qp[data-i]:not([data-rt])').forEach((q) => { // Routinen-Vorlagen (nur 11) immer alle zeigen
        const tp = TEMPLATES[Number(q.dataset.i)];
        const hit = !qs || T(tp[2]).toLowerCase().includes(qs) || tp[2].toLowerCase().includes(qs) || T(tp[0]).toLowerCase().includes(qs);
        q.style.display = hit && (showAll || qs || !sel.length || sel.some((k) => tplOk(tp, this._tplAge(tp, k)))) ? '' : 'none'; // passt für mindestens ein ausgewähltes Kind
      });
      box.querySelectorAll('.tplgrp').forEach((g) => {
        g.style.display = [...g.querySelectorAll('.qp')].some((q) => q.style.display !== 'none') ? '' : 'none';
      });
      const info = box.querySelector('.tplinfo');
      if (info) {
        const names = [...box.querySelectorAll('[name=kid]:checked')].map((c) => this._db.kid[c.value]).filter(Boolean).map((k) => `${k.name}${this._age(k) !== null ? ` ${T('({n} J.)', { n: this._age(k) })}` : ''}`);
        info.textContent = showAll ? T('Alle Vorlagen') : (sel.length ? T('Passend für: {names}', { names: names.join(', ') }) : T('Kein Alter hinterlegt – alle Vorlagen'));
      }
    }

    _editTask(...a) { return this._admCall('_editTask', a, false); }

    // Welche Aufgabe steckt in welcher Routine? (tid -> Routine-ID)
    _routMap() {
      return this._memo('routmap', '', () => {
        const m = {};
        if (!this._cfg.routOn) return m;
        Object.values(this._db.task).forEach((r) => { if (!r.virtual && Array.isArray(r.steps)) r.steps.forEach((x) => { if (x.tid && this._db.task[x.tid] && !m[x.tid]) m[x.tid] = r.id; }); });
        return m;
      });
    }


    _editReward(...a) { return this._admCall('_editReward', a, false); }


    _schedMode(box, m) {
      box.querySelector('[name=sched]').value = m;
      box.querySelector('.sw-week').style.display = m === 'week' ? 'flex' : 'none';
      box.querySelector('.sw-dates').style.display = m === 'dates' ? 'flex' : 'none';
      const cl = box.querySelector('.sw-cal');
      if (cl) cl.style.display = m === 'cal' ? 'flex' : 'none';
      const o = box.querySelector('.sw-once');
      if (o) o.style.display = m === 'once' ? 'flex' : 'none';
      const p = box.querySelector('.pen-wrap');
      if (p) p.style.display = m === 'once' ? 'none' : '';
      box.querySelectorAll('[data-a="smode"]').forEach((x) => x.classList.toggle('on', x.dataset.m === m));
    }

    _modal(title, body, canDelete, handlers) {
      this._mh = handlers;
      const m = this.shadowRoot.getElementById('modal');
      const foot = handlers
        ? `${canDelete ? `<button class="btn danger" data-a="mdel">${T('Löschen')}</button>` : ''}${handlers.copy ? `<button class="btn" data-a="mcopy">${T('⧉ Kopieren')}</button>` : ''}<button class="btn" data-a="mclose">${T('Abbrechen')}</button><button class="btn primary" data-a="msave">${handlers.saveLabel || T('Speichern')}</button>`
        : `<button class="btn primary" data-a="mclose">${T('Schließen')}</button>`;
      m.innerHTML = `<div class="mback" data-a="mback"><div class="mbox"><div class="mhead"><h3>${title}</h3><button class="icon" data-a="mclose">✕</button></div>
        <div class="mbody">${body}</div>
        <div class="mfoot">${foot}</div></div></div>`;
      m.classList.add('open');
      // Emoji-Feld: Antippen öffnet eine Auswahl (Tastatur bleibt zu, eigenes Emoji über ⌨️)
      const inp = m.querySelector('input[name=emoji]:not([type=radio])');
      if (inp) {
        inp.setAttribute('inputmode', 'none');
        inp.setAttribute('autocomplete', 'off');
        inp.dataset.a = 'emopen';
        const groups = m.querySelector('[name=points]') ? TASK_EMOJI_GROUPS : REWARD_EMOJI_GROUPS;
        const pop = document.createElement('div');
        pop.className = 'emopop';
        pop.hidden = true;
        pop.innerHTML = `<div class="emohd"><span class="hint">${T('Emoji antippen')}</span><button type="button" class="btn sm" data-a="emokb">${T('⌨️ Eigenes eintippen')}</button></div>
          <div class="emogrid">${groups.map(([g, l]) => `<div class="emog">${T(g)}</div>${l.map((x) => `<button type="button" class="ep ${inp.value === x ? 'on' : ''}" data-a="epick" data-e="${x}">${x}</button>`).join('')}`).join('')}</div>`;
        (inp.closest('.g2') || inp.closest('label') || inp).after(pop);
      }
    }

    _closeModal() { const m = this.shadowRoot.getElementById('modal'); m.innerHTML = ''; m.classList.remove('open'); this._mh = null; }

    // ---------- Effekte ----------
    _toast(msg, act) {
      const fx = this.shadowRoot.getElementById('fx');
      fx.querySelectorAll('.toast').forEach((t) => t.remove());
      const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; fx.appendChild(t);
      if (act) {
        // Toast mit Knopf (z. B. ↩️ Rückgängig) – bleibt etwas länger stehen
        const b = document.createElement('button'); b.type = 'button'; b.className = 'tbtn'; b.textContent = act.label;
        b.addEventListener('click', () => { t.remove(); act.fn(); }, { once: true });
        t.classList.add('act'); t.appendChild(b);
      }
      setTimeout(() => t.remove(), act ? 7000 : 3000);
    }


    _pop(e, text) {
      if (!e || !e.clientX) return;
      const s = document.createElement('div'); s.className = 'pop'; s.textContent = text;
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      this.shadowRoot.getElementById('fx').appendChild(s);
      setTimeout(() => s.remove(), 1300);
    }

    _burst(n) {
      const fx = this.shadowRoot.getElementById('fx');
      const items = ['⭐', '🎉', '✨', '🌟', '🎊'];
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        s.className = 'cf';
        s.textContent = items[i % items.length];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
        s.style.animationDelay = (Math.random() * 0.4) + 's';
        fx.appendChild(s);
        setTimeout(() => s.remove(), 3500);
      }
    }

    // Geburtstag: großes „Happy Birthday“ + 5 Sekunden Konfetti-Regen
    _bdParty(k) {
      const fx = this.shadowRoot.getElementById('fx');
      if (!fx || this._partyOn) return;
      this._partyOn = true;
      const age = this._age(k);
      const d = document.createElement('div');
      d.className = 'cele';
      d.innerHTML = `<div class="cbox hb"><div class="e">🎂</div><div class="t">${T('Happy Birthday!')}</div><div class="s">${age ? T('{name} wird heute {age} 🎉', { name: esc(k.name), age }) : `${esc(k.name)} 🎉`}</div></div>`;
      fx.appendChild(d);
      const items = ['🎉', '🎊', '🎈', '🥳', '⭐', '✨', '🎁', '🍰'];
      let n = 0;
      const rain = setInterval(() => {
        for (let i = 0; i < 10; i++) {
          const c = document.createElement('span');
          c.className = 'cf';
          c.textContent = items[(n + i) % items.length];
          c.style.left = Math.random() * 100 + 'vw';
          c.style.animationDuration = (1.8 + Math.random() * 1.6) + 's';
          fx.appendChild(c);
          setTimeout(() => c.remove(), 3800);
        }
        n++;
      }, 300);
      const end = () => { clearInterval(rain); d.remove(); this._partyOn = false; };
      setTimeout(() => clearInterval(rain), 5000);
      setTimeout(() => { if (d.isConnected) end(); }, 5000);
      d.addEventListener('click', end);
    }

    _celebrate(emoji, title, sub) {
      this._celeQ = this._celeQ || [];
      this._celeQ.push([emoji, title, sub]);
      if (!this._celeOn) setTimeout(() => this._celeNext(), 400);
      this._celeOn = true;
    }

    _celeNext() {
      const nx = (this._celeQ || []).shift();
      const fx = this.shadowRoot.getElementById('fx');
      if (!nx || !fx) { this._celeOn = false; return; }
      const d = document.createElement('div');
      d.className = 'cele';
      d.innerHTML = `<div class="cbox"><div class="e">${esc(nx[0])}</div><div class="t">${esc(nx[1])}</div><div class="s">${esc(nx[2])}</div></div>`;
      let gone = false;
      const done = () => { if (gone) return; gone = true; d.remove(); setTimeout(() => this._celeNext(), 250); };
      d.addEventListener('click', done);
      fx.appendChild(d);
      setTimeout(done, 3200);
      this._burst(30);
    }

    // ---------- Klicks ----------
    _click(e) {
      const el = e.target.closest('[data-a]');
      if (!el) return;
      const a = el.dataset.a, ds = el.dataset;
      if (a === 'pk') { this._pinKey(ds.k); return; }
      if (this._locked()) { this._render(); return; }
      if (this._pin()) this._touch();
      if (PARENT_ACTS.includes(a) && !this._isParent()) { this._toast(T('🔒 Nur für Eltern')); return; }
      switch (a) {
        case 'advopen': if (this._db.kid[ds.k]) { this._advKid = ds.k; this._render(); } break;
        case 'advclose': this._advKid = ''; this._render(); break;
        case 'hb': this._hbOpen(''); break;
        case 'hbt': this._hbOpen('', ds.t); break;
        case 'caled': this._editCalLink(ds.id || ''); break;
        case 'scriptnew': this._scriptCreate(); break;
        case 'repbox': this._repOpen = !this._repOpen; try { localStorage.setItem('kpRep', this._repOpen ? '1' : '0'); } catch (e2) { /* egal */ } this._render(); break;
        case 'repmode': this._repMode = ['w', 'c'].includes(ds.m) ? ds.m : 'd'; this._repN = 14; this._render(); break;
        case 'repmore': this._repN = (this._repN || 14) + 14; this._render(); break;
        case 'repday': this._repDay(ds.d); break;
        case 'repcsv': this._repCsv(); break;
        case 'setmore': { const q = this.shadowRoot.querySelector('.setq'); this._setMore = true; this._setMoreQ = q ? q.value : ''; this._filterSet(); break; }
        case 'mueltask': { const tp = TEMPLATES.find((x) => x[2] === 'Müll rausbringen'); if (tp) this._editTask(null, false, { ...this._taskFromTemplate(tp, this._kids().map((k) => k.id)), _tpl: true }); break; }
        case 'calbox': this._calBoxOpen = !this._calBoxOpen; try { localStorage.setItem('kpCalBox', this._calBoxOpen ? '1' : '0'); } catch (e2) { /* egal */ } this._render(); break;
        case 'calhide': {
          // einzelnen Kalendertermin ausblenden / wieder zeigen (z. B. „fällt aus“) – ohne den Kalender zu ändern
          const h = new Set(this._cfg.calHide || []); if (h.has(ds.id)) h.delete(ds.id); else h.add(ds.id);
          this._setCfg({ calHide: [...h].slice(-300) }); this._render(); break;
        }
        case 'mklist': {
          // ⚙️ Liste anlegen: Hauptliste (erstes Fenster) oder eigene Liste für Fotos / zweite Sicherung
          const inp = ds.for === 'storage' ? null : el.closest('.mkrow') && el.closest('.mkrow').querySelector('.newlist');
          const name = ds.for === 'storage' ? ds.n : ((inp && inp.value.trim()) || ds.n);
          if (!name) break;
          this._mkBusy = ds.for === 'storage' ? this._config.storage : ds.for; this._mkErr = ''; this._render();
          this._mkList(name).then((ent) => {
            this._mkBusy = '';
            if (ent && ds.for !== 'storage') { this._setCfg({ [ds.for]: ent }); this._toast(T('✅ Liste „{name}“ angelegt', { name })); }
            if (ent && ds.for === 'storage') {
              this._mkBusy = this._config.storage; this._toast(T('✅ Liste „{name}“ angelegt', { name }));
              // Taucht die Liste nicht unter dem eingetragenen Namen auf (z. B. „…_2“), gibt es einen klaren Hinweis statt endlosem Warten
              setTimeout(() => { this._mkBusy = ''; if (!this._hass.states[this._config.storage]) this._mkErr = T('Die Liste wurde angelegt, heißt in Home Assistant aber anders als in der Karte eingetragen ({st}). Bitte unter Einstellungen → Geräte & Dienste → Lokale To-do-Liste nachsehen und den Namen in der Karte anpassen.', { st: this._config.storage }); this._render(); }, 20000);
            }
            this._render();
          }).catch((err) => { this._mkBusy = ''; this._mkErr = String((err && (err.message || err.body || err.error)) || err); this._toast(T('⚠️ Anlegen hat nicht geklappt: {err}', { err: this._mkErr })); this._render(); });
          break;
        }
        case 'kvtog': {
          this._kvOpen(ds.k, ds.x); const key = `${ds.k}:${ds.x}`;
          if (this._kvo.has(key)) this._kvo.delete(key); else this._kvo.add(key);
          try { localStorage.setItem('kpKv', JSON.stringify([...this._kvo])); } catch (e2) { /* egal */ }
          this._render(); break;
        }
        case 'rws': this._setCfg({ rwSort: ['az', 'kid'].includes(ds.m) ? ds.m : 'stars' }); this._render(); break;
        case 'kadm': {
          // 👧 Kinder-Tab: Kind auf-/zuklappen (gemerkt pro Gerät)
          const c = this._kadmShut(); if (c.has(ds.k)) c.delete(ds.k); else c.add(ds.k);
          try { localStorage.setItem('kpKadm', JSON.stringify([...c])); } catch (e2) { /* egal */ }
          this._render(); break;
        }
        case 'lock': this._until = 0; this._wasOpen = false; this._closeModal(); this._render(); break;
        case 'tab': this._tab = ds.id; try { localStorage.setItem('kpTab', ds.id); } catch (e2) { /* egal */ } this._render(); break;
        case 'tup':
        case 'tdown': {
          // Mit Kind-Filter: mit dem sichtbaren Nachbarn tauschen (nicht mit einer ausgeblendeten Aufgabe)
          const f = ds.k !== undefined ? ds.k : this._tkf && this._db.kid[this._tkf] ? this._tkf : '';
          const md = this._tkMode(), cur = this._db.task[ds.id], sub = cur ? this._tkSub(cur, md) : '';
          const arr = this._taskOrder(), vis = ds.k === undefined ? arr.filter((t) => !f || (t.kids || []).includes(f)) : arr.filter((t) => (f ? (t.kids || []).includes(f) : !(t.kids || []).some((id) => this._db.kid[id])) && this._tkSub(t, md) === sub);
          const vi = vis.findIndex((t) => t.id === ds.id), nb = vis[vi + (a === 'tup' ? -1 : 1)];
          const i = arr.findIndex((t) => t.id === ds.id), j = nb ? arr.findIndex((t) => t.id === nb.id) : -1;
          if (vi < 0 || i < 0 || j < 0 || (arr[i].sched === 'once') !== (arr[j].sched === 'once')) break;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          arr.forEach((t, n) => { const cur = this._db.task[t.id]; if (cur && (cur.order || 0) !== n + 1) this._save('task', t.id, { ...cur, order: n + 1 }); });
          this._render();
          break;
        }
        case 'ktap': this._kidTap(ds.t, ds.k, e); break;
        case 'zgo': this._zStart(ds.t, ds.k); break;
        case 'tgo': this._tmrStart(ds.t, ds.k); break;
        case 'cfgset': if (['kView'].includes(ds.k) && ['compact', 'classic'].includes(ds.v)) this._setCfg({ [ds.k]: ds.v }); break;
        case 'say': this._say(ds.t, ds.k); break;
        case 'kpg': { this._kpg = this._kpg || {}; this._kpg[ds.k] = ds.p || 'home'; if (ds.x && ds.x !== 'adv' && ds.p === 'col') { this._kvOpen(ds.k, ds.x); this._kvo.add(`${ds.k}:${ds.x}`); } this._render(); const c = this.shadowRoot.querySelector('.kc'); if (c && c.scrollIntoView && ds.p !== 'home') try { c.scrollIntoView({ block: 'nearest' }); } catch (e2) { /* egal */ } break; }
        case 'kpx': { this._kcx = this._kcx || {}; const key = `${ds.k}:${ds.id}`; this._kcx[key] = !this._kcx[key]; this._render(); break; }
        case 'rcpopen': this._rcpOpen(ds.k, ds.x); break;
        case 'zpic': this._zPic(ds.k, ds.x); break;
        case 'rzgo': e.preventDefault(); this._closeModal(); this._zStepStart(ds.t, ds.k, Number(ds.i)); break;
        case 'kfold': {
          this._opens = this._opens || {}; this._opens[ds.k] = !this._opens[ds.k]; this._animK = ds.k; this._render(); this._animK = null;
          const kk = this._db.kid[ds.k];
          if (kk && this._cfg.bdOn && this._isBday(kk, dk(new Date()))) this._bdParty(kk);
          break;
        }
        case 'bdparty': { const kk = this._db.kid[ds.k]; if (kk) this._bdParty(kk); break; }
        case 'atap': {
          const t = this._db.task[ds.t];
          if (!t) break;
          const st = this._status(t, ds.k);
          const date = st.s === 'taken' ? dk(new Date()) : st.date;
          this._adminSet(date, ds.t, ds.k, st.s !== 'd', e);
          break;
        }
        case 'apr': this._adminSet(ds.d, ds.t, ds.k, true, e); break;
        case 'aprall': {
          // ✓ Alle erledigten Aufgaben auf einmal freigeben (Belohnungen, Wünsche und Noten bleiben einzeln) – mit Rückfrage
          if (!this._aprAllSure || Date.now() - this._aprAllSure > 8000) { this._aprAllSure = Date.now(); this._render(); break; }
          this._aprAllSure = 0;
          const list = this._pendingTasks();
          list.forEach((p) => { if (this._st(p.date, p.t.id, p.c.id) !== 'd') { this._markDone(p.date, p.t.id, p.c.id); this._audTask('ok', p.t.id, p.c.id); } this._photoDone(p.date, p.t.id, p.c.id); });
          this._toast(T('✓ {n} Aufgaben freigegeben', { n: list.length }));
          this._render();
          break;
        }
        case 'mdec': this._decide(ds.d, ds.t, ds.k, ds.h, e); break;
        case 'cfg': {
          const c = this._cfg;
          if (ds.k === 'dblDay') {
            const set = new Set(c.dblDays || [6]);
            if (el.checked) set.add(Number(ds.v)); else set.delete(Number(ds.v));
            this._setCfg({ dblDays: [...set] });
            this._render();
            break;
          }
          if (ds.k === 'parent') {
            const set = new Set(c.parents || []);
            if (el.checked) set.add(ds.v); else set.delete(ds.v);
            const me = this._hass.user && this._hass.user.id;
            // sich selbst nicht aussperren: wer die Liste bearbeitet, bleibt drin
            if (set.size && me && this._persons().some((p) => p.u === me) && !set.has(me)) { set.add(me); this._toast(T('Du bleibst selbst in der Liste, damit du dich nicht aussperrst.')); }
            this._setCfg({ parents: [...set] });
            this._audit(T('👨‍👩‍👧 Eltern-Liste geändert: {names}', { names: [...set].map((u) => this._userName(u) || '?').join(', ') || T('alle Benutzer') }));
            this._render();
            break;
          }
          if (ds.k === 'dTo' || ds.k === 'wTo') {
            // leer = an alle Geräte; Häkchen raus → alle anderen bleiben
            const all = c.targets, set = new Set(this._repTo(ds.k) || all);
            if (el.checked) set.add(ds.v); else set.delete(ds.v);
            if (!set.size) { this._toast(T('Mindestens ein Gerät muss ausgewählt bleiben.')); this._render(); break; }
            this._setCfg({ [ds.k]: all.every((t) => set.has(t)) ? [] : all.filter((t) => set.has(t)) });
            this._render();
            break;
          }
          if (ds.k === 'target' || ds.k === 'rPlayer' || ds.k === 'tg') {
            const field = ds.k === 'target' ? 'targets' : ds.k === 'tg' ? 'tgTargets' : 'rPlayers';
            const set = new Set(c[field] || []);
            if (el.checked) set.add(ds.v); else set.delete(ds.v);
            const patch = { [field]: [...set] };
            // Telegram-Chat ausgewählt -> Knöpfe gleich mit einschalten
            if (ds.k === 'target' && el.checked && ds.v.includes('.') && this._isTg(ds.v)) patch.tgTargets = [...new Set([...(c.tgTargets || []), ds.v])];
            this._setCfg(patch);
          } else this._setCfg({ [ds.k]: el.checked });
          this._render();
          break;
        }
        case 'ntest': {
          const n = this._notify(T('👋 Test: Benachrichtigungen der Yippee!-Karte funktionieren.'), 'test');
          this._toast(n ? (n > 1 ? T('📨 Test an {n} Geräte gesendet', { n }) : T('📨 Test an 1 Gerät gesendet')) : T('Kein Gerät ausgewählt'));
          break;
        }
        case 'rej': this._adminSet(ds.d, ds.t, ds.k, false); break;
        case 'req': this._request(ds.r, ds.k, e); break;
        case 'ardm': this._parentRedeemDlg(ds.k); break;
        case 'ardo': {
          // erster Tipp fragt nach, zweiter löst ein (Dialog wird nicht neu gezeichnet)
          if (!el.dataset.sure) { el.dataset.sure = '1'; el.dataset.txt = el.textContent; el.textContent = T('Wirklich? {what}', { what: el.dataset.cost || '' }); setTimeout(() => { if (el.isConnected && el.dataset.sure) { delete el.dataset.sure; el.textContent = el.dataset.txt; } }, 8000); break; }
          this._parentRedeem(ds.r, ds.k, ds.m || 'one');
          break;
        }
        case 'rapr': { const q = this._db.req[ds.q]; if (q) this._redeem(q.kid, q.reward, q.id); break; }
        case 'rrej': if ((this._db.req[ds.q] || {}).pool) { this._shareCancel(ds.q); break; } this._audReq(ds.q, false); this._del('req', ds.q); this._render(); break;
        case 'shr': this._shareTap(ds.r, ds.k, ds.m, e); break;
        case 'bdgi': { const b = BADGES.find((x) => x[0] === ds.b), k = this._db.kid[ds.k]; if (b && k) this._toast(`${b[1]} ${T(b[2])} – ${b[3](k) ? T('✓ geschafft!') : T('noch nicht geschafft')}`); break; }
        case 'kord': {
          // 👧 Reihenfolge der Kinder: gilt für alle Ansichten (Eltern, „Alle Kinder“, Berichte, Nachrichten)
          const ks = this._kids(), i = ks.findIndex((x) => x.id === ds.k), j = i + Number(ds.d);
          if (i < 0 || j < 0 || j >= ks.length) break;
          [ks[i], ks[j]] = [ks[j], ks[i]];
          ks.forEach((x, n) => { if ((x.order || 0) !== n + 1) this._save('kid', x.id, { ...x, order: n + 1 }, (cur) => ({ ...cur, order: n + 1 })); });
          this._render();
          break;
        }
        case 'pts': {
          this._addPoints(ds.k, Number(ds.n), 'Von Hand (Eltern)');
          const kk = this._db.kid[ds.k];
          this._audPts = this._audPts || {};
          this._audPts[ds.k] = (this._audPts[ds.k] || 0) + Number(ds.n);
          clearTimeout(this._audPtsT);
          this._audPtsT = setTimeout(() => { Object.entries(this._audPts).forEach(([id, n]) => { const k2 = this._db.kid[id]; if (n) this._audit(T('✋ Punkte von Hand: {name} {n} ⭐', { name: k2 ? k2.name : '?', n: n > 0 ? `+${n}` : n })); }); this._audPts = {}; }, 4000);
          if (!kk) break;
          this._render();
          break;
        }
        case 'ledger': this._showLedger(ds.k); break;
        case 'suggest': this._suggest(ds.k); break;
        case 'sgall': case 'sgnone': { const box = el.closest('.mbox'); if (box) box.querySelectorAll('[name=sg]').forEach((c) => { c.checked = a === 'sgall'; }); break; }
        case 'goal': {
          const k = this._db.kid[ds.k], r = this._db.reward[ds.r];
          if (!k || !r) break;
          if (!this._rwFor(r, k.id)) { this._toast(T('Diese Belohnung gibt es für {name} nicht.', { name: k.name })); break; }
          const on = k.goal !== ds.r;
          this._save('kid', ds.k, { ...k, goal: on ? ds.r : '' }, (cur) => ({ ...cur, goal: on ? ds.r : '' }));
          this._toast(on ? T('🎯 Neues Ziel: {title}', { title: r.title }) : T('Ziel entfernt'));
          this._render();
          break;
        }
        case 'wtest': {
          const n = this._sendWeekly();
          this._toast(n ? (n > 1 ? T('📊 Wochenrückblick an {n} Geräte gesendet', { n }) : T('📊 Wochenrückblick an 1 Gerät gesendet')) : T('Kein Gerät oder keine Kinder'));
          break;
        }
        case 'copyauto': { const pre = el.parentNode.querySelector('pre'); this._copy(pre ? pre.textContent : '', T('📋 Automation kopiert')); break; }
        case 'famedit': this._editFamily(); break;
        case 'famreset': { const f = this._cfg.fam; if (f) this._setCfg({ fam: { ...f, pts: 0, reached: false } }); this._toast(T('👨‍👩‍👧 Familienziel startet von vorne')); this._render(); break; }
        case 'fpick': { const box = el.closest('.mbox'); if (box) { box.querySelector('[name=emoji]').value = ds.e; box.querySelector('[name=title]').value = ds.t; box.querySelector('[name=cost]').value = ds.c; } break; }
        case 'payout': this._payout(ds.k); break;
        case 'vadd': {
          const box = el.closest('.box');
          const f = box.querySelector('[name=vfrom]').value, t2 = box.querySelector('[name=vto]').value;
          if (!f || !t2) { this._toast(T('Bitte „von“ und „bis“ wählen')); break; }
          if (t2 < f) { this._toast(T('„bis“ liegt vor „von“')); break; }
          const all = this._kids().map((k) => k.id), boxes = [...box.querySelectorAll('[name=vkid]')];
          const sel = boxes.length ? boxes.filter((x) => x.checked).map((x) => x.value) : all;
          if (boxes.length && !sel.length) { this._toast(T('Bitte mindestens ein Kind wählen')); break; }
          const forAll = !boxes.length || all.every((id) => sel.includes(id));
          this._setCfg({ vac: [...(this._cfg.vac || []), { id: uid(), from: f, to: t2, ...(forAll ? {} : { kids: sel }) }] });
          const nm = forAll ? '' : sel.map((id) => (this._db.kid[id] || {}).name).filter(Boolean).join(', ');
          this._toast(forAll ? T('🏖️ Urlaub {from} – {to} eingetragen', { from: longDate(f), to: longDate(t2) }) : T('🏖️ Urlaub {from} – {to} für {names} eingetragen', { from: longDate(f), to: longDate(t2), names: nm }));
          this._render();
          break;
        }
        case 'vdel': {
          const list = this._cfg.vac || [];
          const i = ds.id ? list.findIndex((v) => v.id === ds.id) : list.findIndex((v) => v.from === ds.f && v.to === ds.t);
          if (i >= 0) this._setCfg({ vac: list.filter((_, j) => j !== i) });
          this._render();
          break;
        }
        case 'rtest': { const n = this._speak(T('Hallo! Das ist ein Test der Yippee!-Erinnerung.')); this._toast(n ? T('🔊 Durchsage gesendet') : T('Bitte zuerst TTS + Lautsprecher oder ein Alexa-Gerät wählen')); break; }
        case 'bkdl': {
          try {
            const blob = new Blob([this._backupJson()], { type: 'application/json' });
            const a2 = document.createElement('a');
            a2.href = URL.createObjectURL(blob);
            a2.download = this._bkName();
            document.body.appendChild(a2); a2.click(); a2.remove();
            setTimeout(() => URL.revokeObjectURL(a2.href), 5000);
            this._toast(this._inApp() ? T('⬇️ Download gestartet – die App vergibt evtl. einen eigenen Dateinamen (📤 Teilen behält den Namen)') : T('⬇️ {name} wird heruntergeladen', { name: this._bkName() }));
          } catch (err) { this._toast(T('Download nicht möglich – bitte „Kopieren“ nutzen')); }
          break;
        }
        case 'bkshare': {
          try {
            const file = new File([this._backupJson()], this._bkName(), { type: 'application/json' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: this._bkName() }).catch(() => { /* abgebrochen */ });
            else this._toast(T('Teilen geht auf diesem Gerät nicht – bitte „Herunterladen“ oder „Kopieren“'));
          } catch (err) { this._toast(T('Teilen geht auf diesem Gerät nicht – bitte „Herunterladen“ oder „Kopieren“')); }
          break;
        }
        case 'sensyaml': this._copy(this._sensYaml(), T('📋 Vorlage kopiert – als packages/yippee.yaml speichern oder in die configuration.yaml einfügen, dann Home Assistant neu starten')); break;
        case 'bkcopy': this._copy(this._backupJson(), T('📋 Sicherung kopiert – z. B. in eine Notiz einfügen')); break;
        case 'bkrestore': this._restore(); break;
        case 'autonew': this._autoCreate(ds.k); break;
        case 'tgtest': this._tgTest(); break;
        case 'trres': this._trashRestore(ds.id); break;
        case 'blkreset': this._setCfg({ blkB: null }); break;
        case 'updres': this._updRes(); break;
        case 'updreload': window.location.reload(); break;
        case 'resclean': this._resClean(); break;
        case 'updnow': this._updCheck(true).then(() => this._toast(T('🔄 Geprüft'))); break;
        case 'updhide': try { localStorage.setItem('yippeeUpdHide', ds.v || ''); } catch (err) { /* egal */ } this._render(); break;
        case 'updopen': history.pushState(null, '', '/config/updates'); window.dispatchEvent(new CustomEvent('location-changed')); break;
        case 'audmore': this._audN = (this._audN || 30) + 50; this._render(); break;
        case 'pinset': this._pinSet(); break;
        case 'pindel': {
          if (!this._sureAsk(el, T('Wirklich entfernen?'))) break;
          this._setCfg({ pinH: '', pinS: '', pinL: 0 }); this._audit(T('🔢 PIN entfernt')); this._toast(T('PIN entfernt')); this._render();
          break;
        }
        case 'chkfix': this._chkFix(); break;
        case 'chkok': {
          if (!this._sureAsk(el, T('Wirklich übernehmen?'))) break;
          this._chkOk();
          break;
        }
        case 'abnow': this._abMake(true); break;
        case 'abdl': case 'abres': {
          const id = ds.id;
          this._bkData(id).then((j) => {
            if (!j) { this._toast(T('Diese Sicherung lässt sich nicht lesen')); return; }
            if (a === 'abdl') {
              const a2 = document.createElement('a');
              a2.href = URL.createObjectURL(new Blob([JSON.stringify(j)], { type: 'application/json' }));
              a2.download = `YippeeKidsChores${id.split('-').reverse().join('')}.json`;
              document.body.appendChild(a2); a2.click(); a2.remove();
              setTimeout(() => URL.revokeObjectURL(a2.href), 5000);
              return;
            }
            this._modal(T('♻️ Sicherung wiederherstellen'), `<div class="hint">${T('Stand vom {date}.', { date: longDate(id) })}</div><div class="hint">${T('⚠️ Ersetzt alle aktuellen Daten (Kinder, Aufgaben, Punkte, Verlauf, Einstellungen) durch die Sicherung.')}</div>`, false, {
              saveLabel: T('♻️ Wiederherstellen'), audit: false, save: () => { this._applyBackup(j); return true; },
            });
          });
          break;
        }
        case 'holnow': this._holTry = 0; this._holCheck(true); this._toast(T('🔄 Ferien und Feiertage werden neu geladen')); this._render(); break;
        case 'ledclr': {
          if (!this._sureAsk(el, T('Wirklich leeren?'))) break;
          const k = this._db.kid[ds.k];
          if (k) { this._save('kid', ds.k, { ...k, ledger: [], wk: {} }, (cur) => ({ ...cur, ledger: [], wk: {} })); this._audit(T('🗑️ Punkte-Verlauf geleert: {name}', { name: k.name })); }
          this._closeModal(); this._toast(T('🗑️ Verlauf geleert')); this._render();
          break;
        }
        case 'wiz': this._wizAct(ds, el); break;
        case 'wizstart': this._wiz = { step: 1, kids: new Set() }; this._render(); break;
        case 'vtheme': {
          const v = ds.v === 'custom' || THEMES.some((x) => x[0] === ds.v) ? ds.v : '';
          const p = {};
          if (v === 'custom' && !this._cfg.vCol) { const b = themeCols(this._cfg.vTheme, null) || themeCols('light'); p.vCol = { bg: b.bg, surface: b.surface, text: b.text, accent: b.accent }; } // eigene Farben starten mit der bisherigen Vorlage
          this._colPrev = null; this._setCfg({ ...p, vTheme: v }); this._render(); break;
        }
        case 'vcolreset': { const b = themeCols('light'); this._colPrev = null; this._setCfg({ vCol: { bg: b.bg, surface: b.surface, text: b.text, accent: b.accent } }); this._render(); break; }
        case 'setview': this._setCfg({ setView: ds.v === 'simple' ? 'simple' : 'all' }); this._render(); break;
        case 'memclean': {
          if (!this._sureAsk(el, T('Wirklich aufräumen? Nochmal tippen'))) break;
          this._memClean();
          break;
        }
        case 'vchtog': {
          this._vchShut = !this._vchShut;
          try { localStorage.setItem('kpVchShut', this._vchShut ? '1' : '0'); } catch (e) { /* nur im Speicher */ }
          this._render();
          break;
        }
        case 'acc': {
          this._accOpen = this._accOpen === ds.id ? '' : ds.id;
          this._accAnim = this._accOpen;
          this._render();
          this._accAnim = null;
          const h = this.shadowRoot.querySelector(`.acch[data-id="${ds.id}"]`);
          if (h && h.scrollIntoView) h.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          break;
        }
        case 'dtest': { const n = this._sendDaily(); this._toast(n ? (n > 1 ? T('🌙 Tagesabschluss an {n} Geräte gesendet', { n }) : T('🌙 Tagesabschluss an 1 Gerät gesendet')) : T('Kein Gerät oder keine Kinder')); break; }
        case 'mtest': { const txt = this._morningText() || T('Guten Morgen! Heute stehen keine Aufgaben an.'); const n = this._speak(txt); this._toast(n ? T('🔊 Morgen-Ansage gesendet') : T('Bitte unten bei „Erinnerung per Lautsprecher“ einen Lautsprecher wählen')); break; }
        case 'phview': { const u = this._photoUrl(ds.f); this._modal(T('📷 Foto-Nachweis'), u ? `<img class="phbig" src="${esc(u)}" alt="${esc(T('Foto'))}">` : `<div class="hint">${T('Foto wird geladen … bitte gleich nochmal antippen.')}</div>`, false, null); break; }
        case 'ekid': this._editKid(ds.id); break;
        case 'etask': this._editTask(ds.id); break;
        case 'erout': this._editTask(null, true); break;
        case 'erew': this._editReward(ds.id); break;
        case 'rpick': {
          const box = el.closest('.mbox');
          const tp = REWARD_TEMPLATES[Number(ds.i)];
          if (!box || !tp) break;
          box.querySelector('[name=emoji]').value = tp[0];
          box.querySelector('[name=title]').value = T(tp[1]);
          box.querySelector('[name=cost]').value = tp[2];
          if (box.querySelector('[name=joker]')) box.querySelector('[name=joker]').checked = tp[3] === 'joker';
          box.querySelectorAll('.qp,.ep').forEach((q) => q.classList.toggle('on', q === el || q.dataset.e === tp[0]));
          break;
        }
        case 'epick': {
          const box = el.closest('.mbox');
          if (!box) break;
          box.querySelector('[name=emoji]').value = ds.e;
          box.querySelectorAll('.ep').forEach((q) => q.classList.toggle('on', q === el));
          const pop = el.closest('.emopop');
          if (pop) pop.hidden = true;
          break;
        }
        case 'emopen': {
          const pop = el.closest('.mbox') && el.closest('.mbox').querySelector('.emopop');
          if (!pop) break;
          if (el.getAttribute('inputmode') !== 'none') {
            // aus dem Eintipp-Modus zurück zur Liste
            el.setAttribute('inputmode', 'none');
            if (!el.value.trim() && el.dataset.prev) el.value = el.dataset.prev;
            pop.hidden = false;
          } else pop.hidden = !pop.hidden;
          el.blur();
          break;
        }
        case 'emokb': {
          const box = el.closest('.mbox'), inp = box && box.querySelector('[name=emoji]');
          const pop = el.closest('.emopop');
          if (pop) pop.hidden = true;
          if (inp) { inp.dataset.prev = inp.value; inp.setAttribute('inputmode', 'text'); inp.value = ''; inp.focus(); this._toast(T('Emoji eintippen – zurück zur Liste: Feld nochmal antippen')); }
          break;
        }
        case 'qpick': {
          const box = this.shadowRoot.querySelector('#modal .mbox');
          const tp = TEMPLATES[Number(ds.i)];
          if (!box || !tp) break;
          const [, emo, title, pts, win, days] = tp;
          const stEl = box.querySelector('[name=steps]');
          if (stEl && stEl._rsSet) stEl._rsSet((ROUT_STEPS[title] || []).map((x) => ({ t: T(x) })));
          box.querySelector('[name=emoji]').value = emo;
          box.querySelector('[name=title]').value = T(title);
          box.querySelector('[name=points]').value = pts;
          const ws = this._tplWins(win), w = ws[0];
          box.querySelector('[name=from]').value = w[0];
          box.querySelector('[name=to]').value = w[1];
          const tw = box.querySelector('[name=twice]'), wrap = box.querySelector('[data-slots]');
          if (tw && wrap) {
            tw.checked = ws.length > 1;
            wrap.innerHTML = ws.slice(1).map((x, i) => this._slotRow(i + 2, x[0], x[1])).join('');
            box.querySelector('.sw-twice').style.display = ws.length > 1 ? 'block' : 'none';
          }
          if (days === 'dates' && box.querySelector('.sw-cal')) {
            this._schedMode(box, 'cal');
            const kw = box.querySelector('[name=calKw]');
            if (kw) kw.value = /papier|gelb/i.test(title) ? 'papier, gelb' : '';
          } else if (days === 'dates' || days === 'once') this._schedMode(box, days);
          else {
            this._schedMode(box, 'week');
            box.querySelectorAll('[name=day]').forEach((c) => { c.checked = !days || days.includes(Number(c.value)); });
          }
          const se = SEASONS.find((x) => x[0].test(title));
          if (box.querySelector('[name=school]')) box.querySelector('[name=school]').checked = SCHOOL_RX.test(title);
          if (box.querySelector('[name=schoolPrev]')) box.querySelector('[name=schoolPrev]').checked = PREV_TPL.includes(title);
          if (box.querySelector('[name=sFrom]')) { box.querySelector('[name=sFrom]').value = se ? se[1] : ''; box.querySelector('[name=sTo]').value = se ? se[2] : ''; }
          box.querySelectorAll('.qp').forEach((q) => q.classList.toggle('on', q === el));
          break;
        }
        case 'schx': { if (el.checked) { const bx = el.closest('.mbox') || this.shadowRoot, o = bx.querySelector(`[name=${el.name === 'school' ? 'noschool' : 'school'}]`); if (o) o.checked = false; } break; }
        case 'tmrx': { const box = el.closest('.mbox'), w = box && box.querySelector('.tmrbox'); if (w) w.style.display = el.checked ? 'block' : 'none'; break; }
        case 'twice': {
          const box = el.closest('.mbox'), w = box && box.querySelector('.sw-twice');
          if (w) { const wrap = w.querySelector('[data-slots]'); if (el.checked && wrap && !wrap.querySelector('.slotrow')) wrap.insertAdjacentHTML('beforeend', this._slotRow(2)); w.style.display = el.checked ? 'block' : 'none'; }
          break;
        }
        case 'slotdel': { const r = el.closest('.slotrow'); if (r) r.remove(); break; }
        case 'slotadd': {
          const wrap = el.closest('.mbox') && el.closest('.mbox').querySelector('[data-slots]');
          if (wrap && wrap.querySelectorAll('.slotrow').length < 4) wrap.insertAdjacentHTML('beforeend', this._slotRow(wrap.querySelectorAll('.slotrow').length + 2));
          else this._toast(T('Höchstens 5 Zeitfenster'));
          break;
        }
        case 'wish': this._wish(ds.k); break;
        case 'joker': this._jokerDlg(ds.k); break;
        case 'behav': {
          const kb = this._db.kid[ds.k], up = Number(ds.n) > 0, c = this._cfg;
          if (!kb || (!up && !c.behavMinus)) break;
          const n = up ? Math.max(1, Number(c.behavPlus) || 1) : -Math.max(1, Number(c.behavMinusN) || 1);
          this._addPoints(ds.k, n, up ? '😊 Artig' : '😠 Unartig');
          this._audit(`${up ? T('😊 Artig') : T('😠 Unartig')}: ${kb.name} (${n > 0 ? '+' : ''}${n} ⭐)`);
          this._pop(e, `${n > 0 ? '+' : ''}${n} ⭐`);
          this._render();
          break;
        }
        case 'tkf': this._tkf = ds.k || ''; this._render(); break;
        case 'tkg': this._tkg = ds.m; try { localStorage.setItem('kpTkg', ds.m); } catch (e2) { /* egal */ } this._render(); break;
        case 'tkfold': { this._tkOpen(''); this._tkO[ds.id] = el.dataset.open !== '1'; try { localStorage.setItem('kpTkO', JSON.stringify(this._tkO)); } catch (e2) { /* egal */ } this._render(); break; }
        case 'admall': {
          this._admFolded('');
          this._kids().forEach((k) => { if (ds.v === '1') delete this._admF[`kid:${k.id}`]; else this._admF[`kid:${k.id}`] = 1; });
          try { localStorage.setItem('kpAdmFold', JSON.stringify(this._admF)); } catch (e2) { /* egal */ }
          this._render(); break;
        }
        case 'admfold': {
          this._admFolded('');
          if (ds.id.startsWith('kid:')) { if (this._admF[ds.id]) delete this._admF[ds.id]; else this._admF[ds.id] = 1; }
          else if (el.getAttribute('aria-expanded') === 'true') this._admF[ds.id] = 1; // von Hand zu: bleibt zu
          else if (ds.auto === '1') this._admF[ds.id] = { o: 1, day: dk(new Date()) }; // automatisch zu → heute offen lassen
          else delete this._admF[ds.id];
          try { localStorage.setItem('kpAdmFold', JSON.stringify(this._admF)); } catch (e2) { /* egal */ }
          this._render(); break;
        }
        case 'blkfold': { this._blkO = this._blkO || { day: dk(new Date()) }; this._blkO[ds.id] = el.dataset.open !== '1'; this._render(); break; }
        case 'exadd': { const w = el.closest('.mbox') && el.closest('.mbox').querySelector('[data-exs-wrap]'); if (w && this._exRow) w.insertAdjacentHTML('beforeend', this._exRow({})); break; }
        case 'exdel': { const r = el.closest('.exrow'); if (r) r.remove(); break; }
        case 'ruadd': { const w = el.closest('.mbox') && el.closest('.mbox').querySelector('[data-ru-wrap]'); if (w && this._ruRow) w.insertAdjacentHTML('beforeend', this._ruRow({ st: 'out', every: 1, start: dk(new Date()) })); break; }
        case 'rudel': { const r = el.closest('.prule'); if (r) r.remove(); break; }
        case 'prprev': {
          const box = el.closest('.mbox'), pv = box && box.querySelector('[data-prprev]');
          if (!pv) break;
          const pr = this._presRead(box);
          pv.innerHTML = pr && pr.on ? this._presPreview('', 8, pr).map(esc).join('<br>') || T('In den nächsten 8 Wochen nicht da.') : esc(T('Kind ist immer da.'));
          break;
        }
        case 'grade': this._gradeDlg(ds.k, false); break;
        case 'kgrade': this._gradeDlg(ds.k, true); break;
        case 'gapr': { const q = this._db.req[ds.q]; if (q && q.grade) this._gradeBook(q.kid, q.grade, q.id, e); break; }
        case 'grej': this._gradeReject(ds.q); break;
        case 'wapr': {
          const q = this._db.req[ds.q];
          if (!q || !q.wish) break;
          const inp = this.shadowRoot.querySelector(`.wcost[data-q="${ds.q}"]`);
          const cost = Math.max(1, Math.round(Number(inp && inp.value) || 20));
          if (this._wcost) delete this._wcost[ds.q];
          this._claim(ds.q).then((ok) => {
            if (!ok) return;
            this._save('reward', uid(), { title: q.wish.title, emoji: q.wish.emoji || '🎁', cost });
            const c = this._db.kid[q.kid];
            this._toast(T('🎁 „{title}“ ist jetzt eine Belohnung ({cost} ⭐)', { title: q.wish.title, cost }));
            if (c) this._notify(T('🎁 {name}s Wunsch „{title}“ ist jetzt eine Belohnung für {cost} ⭐.', { name: c.name, title: q.wish.title, cost }), 'test');
            this._render();
          });
          break;
        }
        case 'vuse': {
          const kk = this._db.kid[ds.k], v = kk && (kk.vouch || []).find((x) => x.id === ds.v);
          if (!v) break;
          // Rückfrage merken – auch wenn die Karte zwischen den beiden Tipps neu zeichnet
          if (!this._vSure(ds.k, ds.v)) { this._vsure = { key: `${ds.k}|${ds.v}`, t: Date.now() }; el.querySelector('.hint').textContent = T('Bekommen? Nochmal tippen'); break; }
          this._vsure = null;
          this._addPoints(ds.k, 0, '🎟️ Gutschein', { unvouch: v.id });
          this._audit(T('🎟️ Gutschein eingelöst: {name} – {title}', { name: kk.name, title: v.t }));
          this._toast(T('🎟️ {title} – viel Spaß!', { title: v.t }));
          this._render();
          break;
        }
        case 'hhide': { this._setCfg({ chkHide: [...new Set([...(this._cfg.chkHide || []), ds.id])].slice(-100) }); this._render(); break; }
        case 'psug': this._priceDlg(); break;
        case 'pcalc': { const box = el.closest('.mbox'); const pw = Math.min(7, Math.max(1, Number(box.querySelector('[name=pw]').value) || 2)), fw = Math.min(52, Math.max(1, Number(box.querySelector('[name=fw]').value) || 12)); this._closeModal(); this._priceDlg(pw, fw); break; }
        case 'lmtest': { const n = this._lm(T('⭐ Yippee! – Test')); this._toast(n ? T('🔔 Test gesendet') : T('Bitte zuerst ein LaMetric-Gerät wählen')); break; }
        case 'cfair': {
          const box = el.closest('.mbox');
          if (!box) break;
          const base = Math.max(1, Math.round(Number(box.querySelector('[name=cost]').value) || 1));
          const ins = [...box.querySelectorAll('[data-kcost]')], max = Math.max(0, ...ins.map((x) => Number(x.dataset.daily) || 0));
          if (!max) { this._toast(T('Erst Pflicht-Aufgaben anlegen – dann lässt sich der Preis fair verteilen')); break; }
          ins.forEach((x) => { const d = Number(x.dataset.daily) || 0; x.value = d ? String(Math.max(1, Math.round((base * d) / max))) : ''; });
          break;
        }
        case 'smode': { const box = el.closest('.mbox'); if (box) this._schedMode(box, ds.m); break; }
        case 'win': { const box = el.closest('.mbox'); if (box) { box.querySelector('[name=from]').value = ds.f; box.querySelector('[name=to]').value = ds.to; } break; }
        case 'dadd': {
          const box = el.closest('.mbox');
          const inp = box && box.querySelector('[name=dnew]');
          if (!inp || !inp.value) { this._toast(T('Bitte zuerst ein Datum wählen')); break; }
          const wrap = box.querySelector('.dchips');
          if (!wrap.querySelector(`[data-d="${inp.value}"]`)) {
            const chips = [...wrap.querySelectorAll('.dchip')].map((x) => x.dataset.d).concat(inp.value).sort();
            wrap.innerHTML = chips.map((d) => `<button type="button" class="dchip" data-a="drem" data-d="${d}">${longDate(d)} ✕</button>`).join('');
          }
          inp.value = '';
          break;
        }
        case 'drem': el.remove(); break;
        case 'mclose': this._closeModal(); break;
        case 'mback': if (e.target === el) this._closeModal(); break;
        case 'mcopy': { const h = this._mh && this._mh.copy; if (h) h(); break; }
        case 'msave': case 'mdel': {
          const h = this._mh && this._mh[a === 'msave' ? 'save' : 'del'];
          if (!h) { this._closeModal(); break; }
          if (a === 'mdel' && !el.dataset.sure) { el.dataset.sure = '1'; el.textContent = T('Wirklich löschen?'); break; }
          const mb = this.shadowRoot.querySelector('#modal .mbox');
          const mt = mb && mb.querySelector('h3, .mt, .mh') ? mb.querySelector('h3, .mt, .mh').textContent.trim() : '';
          const nm = mb && mb.querySelector('[name=title], [name=name]') ? mb.querySelector('[name=title], [name=name]').value.trim() : '';
          if (h(mb) !== false) {
            if (a === 'msave' && this._mh && this._mh.audit !== false && mt) this._audit(`✎ ${mt}${nm ? `: ${nm}` : ''}`);
            this._closeModal(); this._render();
          }
          break;
        }
        default: break;
      }
    }
  }

  // ---------- Visueller Editor ----------
  class YippeeCardEditor extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); this.shadowRoot.addEventListener('change', (e) => this._change(e)); }
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


  // ---------- Zusatzdateien ----------
  // Zusatzdateien (Sprachen, Handbuch) liegen im selben Ordner wie die Karte – HACS installiert und aktualisiert sie mit.
  // Der Ordner wird einmal ermittelt und gemerkt; geladen wird nur vom eigenen Home Assistant.
  let cardDir = null;
  // Cache-Schutz: neben der Kartenversion auch den Anhang der Karten-Ressource (?v=… bzw. hacstag=…) mitgeben –
  // so lädt der Browser Handbuch und Sprachen neu, sobald die Ressourcen-Version erhöht wird, auch bei gleicher Kartenversion
  const cardTag = () => {
    let q = '';
    try {
      (performance.getEntriesByType('resource') || []).forEach((e) => { const m = /\/(?:yippee-kids-chores-card|kinderpunkte-card)\.js\?([^#]*)/.exec(e.name); if (m) q = m[1]; });
      if (!q) document.querySelectorAll('script[src]').forEach((x) => { const m = /\/(?:yippee-kids-chores-card|kinderpunkte-card)\.js\?([^#]*)/.exec(x.src); if (m) q = m[1]; });
    } catch (e) { /* egal */ }
    return q.replace(/[^\w=&.-]/g, '').slice(0, 80);
  };
  const cardDirs = () => {
    const urls = [];
    if (cardDir) urls.push(cardDir);
    try {
      (performance.getEntriesByType('resource') || []).forEach((e) => {
        if (/\/(yippee-kids-chores-card|kinderpunkte-card)\.js(\?|$)/.test(e.name)) urls.push(e.name.split('?')[0].replace(/[^/]*$/, ''));
      });
    } catch (e) { /* egal */ }
    urls.push('/hacsfiles/yippee-kids-chores-card/', '/local/community/yippee-kids-chores-card/', '/local/');
    try { urls.push(new URL('./', location.href).href.split('?')[0]); } catch (e) { /* egal */ }
    return [...new Set(urls)];
  };
  const cardImport = async (file, check) => {
    for (const dir of cardDirs()) {
      try {
        const u = new URL(file, new URL(dir, location.href));
        if (u.origin !== location.origin) continue;
        const tag = cardTag();
        const m = await import(`${u.pathname}?v=${VERSION}-${BUILD}${tag ? `&r=${encodeURIComponent(tag)}` : ''}`);
        if (!check || check(m)) { cardDir = dir; return m; }
      } catch (e) { /* nächster Ordner */ }
    }
    throw new Error(`${file} missing`);
  };
  // 📖 Handbuch: eigene Datei (yippee-kids-chores-manual.js), wird erst beim Öffnen geladen
  let HB = null, hbP = null;
  const hbLoad = () => {
    if (HB) return Promise.resolve(HB);
    if (!hbP) hbP = cardImport('yippee-kids-chores-manual.js', (m) => m && m.default && m.default.de && Array.isArray(m.default.de.t)).then((m) => { HB = m.default; return HB; }, (e) => { hbP = null; throw e; });
    return hbP;
  };
  // 🎄 Adventskalender: eigene Datei (yippee-kids-chores-advent.js), wird erst geladen, wenn er eingeschaltet ist
  let advP = null;
  const advLoad = () => {
    if (customElements.get('yippee-advent')) return Promise.resolve(true);
    if (!advP) advP = cardImport('yippee-kids-chores-advent.js', (m) => m && typeof m.default === 'function').then((m) => m.default({ T }), (e) => { advP = null; throw e; });
    return advP;
  };
  // 🦷 Zahnputz-Timer: eigene Datei (yippee-kids-chores-teeth.js), wird erst geladen, wenn er gebraucht wird
  let zP = null;
  const ZAPI = {};
  const zLoad = () => {
    if (customElements.get('yippee-teeth')) return Promise.resolve(true);
    if (!zP) zP = cardImport('yippee-kids-chores-teeth.js', (m) => m && typeof m.default === 'function').then((m) => m.default({ T, api: ZAPI }), (e) => { zP = null; throw e; });
    return zP;
  };
  // 👨‍👩‍👧 Eltern-Bereich: eigene Datei (yippee-kids-chores-admin.js), wird erst beim Öffnen der Eltern-Ansicht geladen
  let admP = null, admOK = false, admFail = 0;
  const ADMY = {
    get T() { return T; }, get esc() { return esc; }, get dk() { return dk; }, get shortDate() { return shortDate; }, get longDate() { return longDate; }, get TEMPLATES() { return TEMPLATES; }, get ROUT_STEPS() { return ROUT_STEPS; }, get uid() { return uid; }, get COLORS() { return COLORS; }, get AVATARS() { return AVATARS; }, get hhmm() { return hhmm; }, get slug() { return slug; }, get hbNorm() { return hbNorm; }, get cv() { return cv; }, get yml() { return yml; }, get tplOk() { return tplOk; }, get WEEK() { return WEEK; }, get VERSION() { return VERSION; }, get REWARD_TEMPLATES() { return REWARD_TEMPLATES; }, get THEMES() { return THEMES; }, get levelOf() { return levelOf; }, get SET_KW() { return SET_KW; }, get LOGO() { return LOGO; }, get LEVELS() { return LEVELS; }, get LANGS() { return LANGS; }, get HB_TOPIC() { return HB_TOPIC; }, get GSCALES() { return GSCALES; }, get keyAdd() { return keyAdd; }, get hsh() { return hsh; }, get fullCols() { return fullCols; }, get euro() { return euro; }, get darkOf() { return darkOf; }, get contrast() { return contrast; }, get badgesOf() { return badgesOf; }, get addMin() { return addMin; }, get WIZ_TASKS() { return WIZ_TASKS; }, get WIZ_REWARDS() { return WIZ_REWARDS; }, get TRACK() { return TRACK; }, get SUBJECTS() { return SUBJECTS; }, get STATES() { return STATES; }, get SCHOOL_RX() { return SCHOOL_RX; }, get PREV_TPL() { return PREV_TPL; }, get PH_RX() { return PH_RX; }, get HOL_TYPES() { return HOL_TYPES; }, get HOL_RULES() { return HOL_RULES; }, get GRADE_COUNTRY() { return GRADE_COUNTRY; }, get COUNTRIES() { return COUNTRIES; }, get BADGES() { return BADGES; },
    get DAYS() { return DAYS; }, get MONTHS() { return MONTHS; }, get MON3() { return MON3; }, get LANG() { return LANG; },
  };
  const admLoad = () => {
    if (admOK) return Promise.resolve(true);
    if (!admP && Date.now() - admFail < 30000) return Promise.reject(new Error('admin missing')); // nach einem Fehler nicht bei jedem Neuzeichnen neu versuchen
    if (!admP) {
      const pre = typeof window.YippeeKidsChoresAdmin === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresAdmin }) : null;
      admP = (pre || cardImport('yippee-kids-chores-admin.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(YippeeCard, ADMY); admOK = true; return true; }, (e) => { admP = null; admFail = Date.now(); throw e; });
    }
    return admP;
  };
  const hbNorm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss');
  // Übersetzungen: siehe yippee-kids-chores-lang-xx.js (eigene Dateien neben der Karte)
  if (!customElements.get('yippee-kids-chores-card')) customElements.define('yippee-kids-chores-card', YippeeCard);
  if (!customElements.get('yippee-kids-chores-card-editor')) customElements.define('yippee-kids-chores-card-editor', YippeeCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === 'yippee-kids-chores-card')) {
    window.customCards.push({ type: 'yippee-kids-chores-card', name: 'Yippee! - Kids Chores', description: T('Aufgaben abhaken, Punkte sammeln, Belohnungen einlösen – Eltern- und Kinder-Ansicht'), preview: false });
  }
  console.info(`%c YIPPEE! - KIDS CHORES %c v${VERSION} `, 'background:#5b6cff;color:#fff;font-weight:700', 'background:#ffd43b;color:#000;font-weight:700');
})();
