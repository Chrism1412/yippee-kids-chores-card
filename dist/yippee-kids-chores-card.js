/*
 * Yippee! - Kids Chores – Karte für Home Assistant – Version 2.0.0
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
  const VERSION = '2.0.0';
  // Bau-Stempel: ändert sich bei jedem Paket, damit Zusatzdateien (Sprachen, Handbuch, Adventskalender, Zahnputz) nie aus einem alten Cache kommen
  const BUILD = '20261125-0910';

  // ---------- Sprache ----------
  // Alle Texte stehen auf Deutsch im Code. T() übersetzt sie über die Sprachdatei der gewählten Sprache (yippee-kids-chores-lang-xx.js).
  const LANGS = [['de', 'Deutsch'], ['gsw', 'Schwiizerdütsch'], ['en', 'English'], ['fr', 'Français'], ['it', 'Italiano'], ['es', 'Español'], ['pt', 'Português'], ['nl', 'Nederlands'],
    ['da', 'Dansk'], ['sv', 'Svenska'], ['fi', 'Suomi'], ['et', 'Eesti'], ['lv', 'Latviešu'], ['lt', 'Lietuvių'], ['pl', 'Polski'], ['cs', 'Čeština'], ['sk', 'Slovenčina'],
    ['sl', 'Slovenščina'], ['hr', 'Hrvatski'], ['hu', 'Magyar'], ['ro', 'Română'], ['bg', 'Български'], ['el', 'Ελληνικά'], ['mt', 'Malti'], ['ga', 'Gaeilge'],
    ['tr', 'Türkçe'], ['ru', 'Русский']];
  let LANG = 'de', DICT = null;
  // 🙂 Neuere Emojis (ab Unicode 12, ca. 2019) zeigen ältere Tablets/Handys als leeres Kästchen. Die Karte prüft einmal je Emoji mit einer
  // kleinen Test-Zeichnung, ob das Gerät es bunt darstellen kann, und setzt sonst ein älteres Ersatz-Emoji ein (in allen übersetzten Texten).
  const EMO_NEW = /[\u{1F6D5}-\u{1F6DF}\u{1F6FA}-\u{1F6FF}\u{1F7E0}-\u{1F7EB}\u{1F90C}-\u{1F90F}\u{1F971}\u{1F972}\u{1F977}-\u{1F979}\u{1F97B}\u{1F9A3}-\u{1F9AF}\u{1F9BA}-\u{1F9BF}\u{1F9C3}-\u{1F9CF}\u{1FA70}-\u{1FAFF}]/u;
  const EMO_NEW_G = new RegExp(EMO_NEW.source, 'gu');
  const EMO_FB = { '🪙': '💰', '🩺': '🔍', '🪥': '🦷', '🫧': '🧼', '🪨': '🗿', '🪶': '🔔', '🦩': '🦢', '🪵': '🌲', '🪴': '🌿', '🫐': '🍇', '🧃': '🥤', '🧇': '🥞', '🧈': '🧀',
    '🪁': '🎏', '🪀': '🎈', '🛝': '🎠', '🛼': '⛸️', '🪄': '✨', '🫶': '❤️', '🥹': '🥺', '🪩': '🎉', '🥱': '😴', '🦮': '🐕', '🦺': '🦸', '🪅': '🎉', '🪆': '🎎', '🧋': '🥤', '🫖': '☕', '🪣': '🧺', '🪜': '🔧', '🪛': '🔧', '🪚': '🔨', '🪒': '✂️', '🪟': '🏠', '🛻': '🚚', '🦭': '🐳', '🦫': '🐻', '🪲': '🐞', '🪱': '🐛', '🫑': '🥦', '🧄': '🌰',
    '🛟': '🆘', '🟥': '🔴', '🟦': '🔵', '🟩': '✅', '🟨': '⭐', '🟧': '🔶', '🟪': '💜', '🟢': '✅', '🟡': '⭐', '🟠': '🔶', '🟣': '💜', '🟤': '⚫' };
  const EMO_C = {}; let EMO_CV = null, EMO_BASE = null;
  const emoOk = (e) => {
    if (e in EMO_C) return EMO_C[e];
    let ok = true;
    try {
      if (!EMO_CV) { EMO_CV = document.createElement('canvas'); EMO_CV.width = 24; EMO_CV.height = 24; }
      const x = EMO_CV.getContext('2d', { willReadFrequently: true });
      const bunt = (t) => {
        x.clearRect(0, 0, 24, 24); x.textBaseline = 'top'; x.fillStyle = '#000';
        x.font = '20px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.fillText(t, 0, 0);
        const d = x.getImageData(0, 0, 24, 24).data;
        for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 40 && (Math.abs(d[i] - d[i + 1]) > 24 || Math.abs(d[i + 1] - d[i + 2]) > 24)) return true;
        return false;
      };
      if (EMO_BASE === null) EMO_BASE = bunt('😀');
      ok = !EMO_BASE || bunt(e); // ohne bunte Emoji-Schrift lässt sich nichts entscheiden → so lassen
    } catch (err) { ok = true; }
    EMO_C[e] = ok;
    return ok;
  };
  const emoFix = (s) => String(s).replace(EMO_NEW_G, (m) => (emoOk(m) ? m : (EMO_FB[m] || '')));
  // Emoji-Ersatz in der Anzeige (Eingabefelder bleiben unberührt, gespeichert wird das Original)
  let EMO_NEED = null;
  const emoNeed = () => { if (EMO_NEED === null) { try { EMO_NEED = Object.keys(EMO_FB).some((e) => !emoOk(e)); } catch (e) { EMO_NEED = false; } } return EMO_NEED; };
  const emoText = (root) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const v = n.nodeValue; if (!v || !EMO_NEW.test(v)) continue;
      const p = n.parentNode, tg = p && p.nodeName;
      if (tg === 'TEXTAREA' || tg === 'STYLE' || tg === 'SCRIPT' || (tg === 'OPTION' && !p.hasAttribute('value')) || (p && p.isContentEditable)) continue;
      const f = emoFix(v); if (f !== v) n.nodeValue = f;
    }
  };
  const emoWatch = (root) => {
    if (!root || root.__emoW || !emoNeed()) return;
    root.__emoW = true;
    let q = false;
    const run = () => { q = false; try { emoText(root); } catch (e) { /* egal */ } };
    new MutationObserver(() => { if (!q) { q = true; Promise.resolve().then(run); } }).observe(root, { childList: true, subtree: true, characterData: true });
    run();
  };
  emoWatch.c = EMO_C; emoWatch.reset = () => { EMO_NEED = null; }; // für die Tests
  try { window.__yippeeEmoWatch = emoWatch; } catch (e) { /* egal */ }
  const T = (s, v) => {
    let r = (DICT && DICT[s]) || s;
    if (v) r = String(r).replace(/\{(\w+)\}/g, (m, k) => (v[k] !== undefined && v[k] !== null ? v[k] : m));
    if (typeof r === 'string' && EMO_NEW.test(r)) r = emoFix(r);
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
  const HB_TOPIC = { f_rdOn: 'reading', f_wheelOn: 'fun', f_stkOn: 'fun', f_eggOn: 'fun', f_hwOn: 'fun', lang: 'update', look: 'views', vac: 'vacation', sec: 'security', f_dayBlocks: 'layout', f_routOn: 'routine', f_extraOn: 'extra', f_photoOn: 'photo', f_nfcOn: 'nfc', f_muellOn: 'trash_cal', f_calOn: 'trash_cal', f_orderOn: 'layout', f_prevOn: 'layout',
    appr: 'approval', streak: 'bonus', f_wbOn: 'bonus', f_teamOn: 'bonus', f_dblOn: 'bonus', f_bdOn: 'birthday', f_behavOn: 'today', f_negOn: 'missed', f_gradesOn: 'grades', f_goalOn: 'goal', f_progOn: 'goal', f_wishOn: 'goal', f_jokerOn: 'joker',
    f_shareOn: 'shared', f_costKidOn: 'cost', f_walletOn: 'wallet', f_priceOn: 'cost', money: 'money', notif: 'notify', when: 'notify', f_welcOn: 'presence', bg: 'background', btn: 'buttons', audio: 'audio', f_voiceOn: 'voice',
    f_lmOn: 'lametric', f_advOn: 'advent', f_zOn: 'teeth', f_mnOn: 'money', f_peOn: 'pet', f_scOn: 'screen', sens: 'sensors', f_checkOn: 'stats', audit: 'trash', bk: 'backup', mem: 'storage', trash: 'trash', upd: 'update' };
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
  // 💰 Taschengeld: Währungen der enthaltenen Sprachen (Anzeige und Namen kommen von Intl – keine eigenen Übersetzungen nötig)
  const MN_CUR = ['EUR', 'CHF', 'GBP', 'USD', 'DKK', 'SEK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'RUB', 'TRY'];
  const MN_LANG_CUR = { gsw: 'CHF', en: 'USD', da: 'DKK', sv: 'SEK', pl: 'PLN', cs: 'CZK', hu: 'HUF', ro: 'RON', ru: 'RUB', tr: 'TRY' };
  // Aktionen, deren Code in der Eltern-Datei steht
  // 🎡📒🥚 Spaß & Sammeln (eigene Datei yippee-kids-chores-fun.js): Sticker-Alben und Aktionen
  const FN_ALB = ['tiere', 'fahrzeuge', 'weltraum', 'meer'];
  // 📚 Lesetagebuch (eigene Datei yippee-kids-chores-read.js)
  const RB_ACTS = new Set(['rbopen', 'rbpick', 'rbadd', 'rbmin', 'rbfin', 'rbapr', 'rbrej']);
  const FN_ACTS = new Set(['fnwheel', 'fnspin', 'fnalb', 'fnalbp', 'fnnest', 'fnwhadd', 'fnwhdel', 'fnwhreset']);
  const ADM_ACTS = new Set(['setg', 'wkrtest', 'rttest', 'admday', 'abdl', 'abnow', 'abres', 'admall', 'admfold', 'apr', 'aprall', 'atap', 'audmore', 'autonew', 'behav', 'bkcopy', 'bkdl', 'bkrestore', 'bkshare', 'blkfold', 'blkreset', 'calbox', 'caled', 'calhide', 'cfair', 'cfg', 'cfgset', 'chkfix', 'chkok', 'copyauto', 'dtest', 'ekid', 'erew', 'erout', 'etask', 'exadd', 'exdel', 'famedit', 'famfix', 'famnext', 'famqadd', 'famqdel', 'famqup', 'famreset', 'gapr', 'grade', 'grej', 'hb', 'hbt', 'hhide', 'holnow', 'kadm', 'kord', 'ledclr', 'lmtest', 'mcopy', 'mdec', 'memclean', 'mklist', 'mtest', 'mueltask', 'new20ok', 'ntest', 'payout', 'pcalc', 'pindel', 'pinset', 'prprev', 'psug', 'pts', 'rapr', 'rej', 'repbox', 'repcsv', 'repday', 'repmode', 'repmore', 'resclean', 'rrej', 'rtest', 'ruadd', 'rudel', 'rws', 'scriptnew', 'sensyaml', 'setmore', 'setview', 'sgall', 'sgnone', 'slotadd', 'slotdel', 'smode', 'suggest', 'tdown', 'tgtest', 'trres', 'tup', 'updhide', 'updnow', 'updopen', 'updreload', 'updres', 'vadd', 'vchtog', 'vcolreset', 'vdel', 'vtheme', 'vuse', 'wapr', 'wiz', 'wizstart', 'wtest']);
  const PARENT_ACTS = ['pehreset', 'setg', 'rbapr', 'rbrej', 'wkrtest', 'rttest', 'fnwhadd', 'fnwhdel', 'fnwhreset', 'admday', 'famnext', 'famqadd', 'famqdel', 'famqup', 'famfix', 'petkr', 'behav', 'ruadd', 'rudel', 'prprev', 'exadd', 'exdel', 'tup', 'tdown', 'slotadd', 'slotdel', 'grade', 'gapr', 'grej', 'resclean', 'updres', 'updhide', 'apr', 'aprall', 'mcopy', 'rej', 'mdec', 'rapr', 'rrej', 'wapr', 'pts', 'payout', 'ledclr', 'famreset', 'famedit', 'chkfix', 'chkok', 'abres', 'abnow', 'bkrestore', 'trres', 'pinset', 'pindel', 'ekid', 'etask', 'erew', 'cfg', 'autonew', 'atap', 'vadd', 'vdel', 'suggest', 'holnow', 'ntest', 'wtest', 'dtest', 'mtest', 'rtest', 'tgtest', 'bkdl', 'bkcopy', 'bkshare', 'abdl', 'cfair', 'vuse', 'hhide', 'psug', 'pcalc', 'lmtest', 'hb', 'hbt', 'caled', 'calhide', 'kord', 'scriptnew', 'repday', 'mueltask', 'mklist', 'rws', 'kadm', 'erout', 'wiz', 'wizstart', 'setview', 'memclean', 'cfgset', 'pekon', 'pekset', 'pejrc', 'scplus', 'scend', 'pepoadd', 'pepoed', 'pepodel'];
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
  // Vorlagen für Aufgaben, Belohnungen, Routinen und den Assistenten stehen in der Eltern-Datei (kommen beim Laden dazu)
  // Aussehen der Eltern-Ansicht kommt mit der Eltern-Datei (setCss)
  let ADM_CSS = '';
  let REWARD_TEMPLATES = [], ROUT_STEPS = {}, WIZ_TASKS = [], WIZ_REWARDS = [], TEMPLATES = [], TASK_EMOJI_GROUPS = [], REWARD_EMOJI_GROUPS = []; // Emoji-Auswahl: aus extras.js

  // Vorlagen: [Kategorie, Emoji, Titel, Punkte, Zeitfenster, Tage, ab Alter, bis Alter]
  // Zeitfenster: 'm' Morgens, 'mi' Mittags, 'a' Abends, '' ganzer Tag oder ['von','bis']
  // Tage: null = täglich, [1,2,3,4,5] = Mo–Fr (0 = So), 'dates' = bestimmte Termine, 'once' = einmalig
  const WINDOWS = { m: ['06:45', '10:00'], mi: ['12:00', '18:00'], a: ['19:00', '23:59'] };
  const SCHOOL = [1, 2, 3, 4, 5];
  const SA = [6];
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
.hbchip.on{background:var(--ac);color:#fff;border-color:var(--ac)}
.btn.hbopen{width:100%;margin-bottom:6px}
.segsw button.on{background:var(--bg);color:var(--tx);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.wiz{display:flex;flex-direction:column;gap:10px}
.wizst span.on{background:var(--ac);color:#fff}
.shbtns{display:flex;flex-direction:column;gap:6px;width:100%}
.shst{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}
.shst span{font-size:12px;font-weight:700;padding:3px 8px;border-radius:10px;background:var(--soft);color:var(--mu)}
.shst span.ok{color:var(--tx)}
.shask{font-weight:700;color:var(--ac)}
.nw{white-space:nowrap}
.wizkid .grow{display:flex;flex-direction:column;font-weight:700}
.wizkid .icon{width:36px;height:36px;min-width:36px;font-size:16px}
.rsrow .grow{flex:1;min-width:0;overflow-wrap:anywhere}
.icon.sm{width:30px;height:30px;font-size:12px;border-radius:9px}
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
.behav{display:flex;gap:4px;margin-left:auto;order:3}.colh .ardm{order:4;padding:6px 10px}
.prd .row{gap:10px}.prd .row .grow small{display:block}.prd .btnrow{justify-content:flex-end;flex-wrap:wrap}.prd .btn[disabled]{opacity:.55}
.btn.bhv{padding:6px 12px;min-height:0;font-size:15px;font-weight:800;white-space:nowrap;border:1.5px solid transparent}
.btn.bhv.ok{background:#d3f9d8;color:#2b8a3e;border-color:#8ce99a}
.btn.bhv.no{background:#ffe3e3;color:#c92a2a;border-color:#ffa8a8}
.tkf{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px;align-items:center}
.tkf .btn.on{background:var(--ac);color:#fff}
.tkg{margin-top:-4px}
.tplq{margin:6px 0}
.krow .kbtns{display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap}
.tab{min-width:0;padding:7px 2px;border-radius:12px;background:var(--soft);font-weight:700;display:flex;flex-direction:column;align-items:center;gap:1px}
.tab .tl{font-size:10px;letter-spacing:-.2px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tabs.ico .tl{display:none}
.tabs.ico .tab{padding:9px 2px}
.tab.on{background:var(--ac);color:#fff}
.box{background:var(--soft);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:8px}
.box h3{margin:0;font-size:16px}
.accw{display:flex;flex-direction:column;gap:8px}
.acc{padding:0;gap:0}
.acch{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;padding:12px 14px;background:none;border:0;font:inherit;font-weight:700;font-size:16px;color:var(--tx);cursor:pointer;text-align:left;border-radius:16px}
.acch .grow{flex:1;min-width:0;display:flex;flex-direction:column}
.accc{font-size:18px;color:var(--mu);transition:transform .25s;flex:none}
.acc.open .accc{transform:rotate(90deg)}
.accb.anim{animation:drop .25s ease-out}
.accsw{position:relative;flex:none;width:48px;height:28px;margin:0 14px 0 0;cursor:pointer}
.accsw input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;z-index:1}
.accsw .swt{position:absolute;inset:0;border-radius:14px;background:var(--ln);transition:background .2s}
.accsw .swt::after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .2s}
.accsw input:checked+.swt{background:var(--ok)}
.accsw input:checked+.swt::after{transform:translateX(20px)}
.accsw input:focus-visible+.swt{outline:2px solid var(--ac);outline-offset:2px}
.setq{width:100%;box-sizing:border-box;margin:0 0 4px}
.row{display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:12px;padding:8px 10px}
.row{flex-wrap:wrap}
.row .grow{flex:1;min-width:120px;font-weight:700;word-break:break-word}
.row .grow small{display:block;font-weight:400;color:var(--mu);font-size:12px}
.pts{font-weight:800;color:var(--gold);white-space:nowrap}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
.admk .chev{font-size:14px;opacity:.6;width:12px}.admb{font-size:15px;margin-top:6px}
pre.yaml{width:0;min-width:100%;box-sizing:border-box;font:11px/1.4 ui-monospace,Menlo,Consolas,monospace;background:var(--yippee-surface,rgba(127,127,127,.12));border-radius:10px;padding:8px 10px;margin:6px 0 0;max-height:220px;overflow:auto;white-space:pre;user-select:all;-webkit-user-select:all}
.trow{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:var(--bg);border-radius:12px;padding:9px 10px;transition:transform .12s}
.trow .grow{flex:1;font-weight:700}
.st{width:28px;height:28px;border-radius:50%;border:3px solid var(--c);display:grid;place-items:center;font-size:14px;font-weight:900;flex-shrink:0}
.st.p{border-color:var(--gold);background:#fff3bf}
.st.d{background:var(--c);color:#fff}
.kh{display:flex;align-items:center;gap:14px}
.kn{font-size:26px;font-weight:900}
.kgrid{display:grid;grid-template-columns:1fr;gap:12px;align-items:start}
.kpbar{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 8px;scrollbar-width:none}.kpbar::-webkit-scrollbar{display:none}
.kpt{flex:1 0 auto;display:flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:6px 14px;border:0;border-radius:16px;background:var(--soft);color:inherit;font:inherit;font-weight:800;cursor:pointer}.kpt .kpe{font-size:22px}.kpt.on{background:var(--ac);color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.15)}
.kpage{touch-action:pan-y}.kpage.inr{animation:kpinr .28s ease-out}.kpage.inl{animation:kpinl .28s ease-out}@keyframes kpinr{from{opacity:.3;transform:translateX(40px)}}@keyframes kpinl{from{opacity:.3;transform:translateX(-40px)}}
.kpdots{display:flex;justify-content:center;gap:7px;padding:10px 0 2px}.kpdots i{width:8px;height:8px;border-radius:50%;background:var(--line,#ccd)}.kpdots i.on{background:var(--ac);width:20px;border-radius:5px}
@media (prefers-reduced-motion: reduce){.kpage.inr,.kpage.inl{animation:none}}
.tile.oq{outline:2px dashed var(--ac);outline-offset:-4px}
button:focus-visible,[tabindex]:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid var(--ac);outline-offset:2px}
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
.dchips{display:flex;flex-wrap:wrap;gap:6px}
.dchip{padding:7px 12px;border-radius:999px;background:var(--cs,var(--soft));border:2px solid var(--ac);font-weight:700;font-size:14px}
.g2.g2e{grid-template-columns:repeat(2,minmax(0,1fr))}.g2e>label,.g2e input{min-width:0}.g2e input{width:100%;box-sizing:border-box}
.tile.d .badge{background:var(--c);color:#fff}
.tile.p .badge{background:var(--gold);color:#fff}
.trophy{text-align:center;font-weight:900;font-size:18px;padding:12px;border-radius:16px;background:#fff3bf;color:#7a5b00;animation:wig 1.2s}
.rws{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.kadm{gap:10px}
.repbox .seg{margin:8px 0;flex-wrap:nowrap}.repbox .seg button::first-letter{text-transform:uppercase}.repbox .seg button{flex:1 1 0;padding:9px 4px}
.repbox .btnrow{margin-top:8px}
.hint.warn{color:#c92a2a;font-weight:600}
.calbox .row,.calls .row{flex-wrap:nowrap}.calbox .row .grow,.calls .row .grow{min-width:0}
.setup{display:flex;flex-direction:column;gap:12px}
.setlang{display:flex;flex-direction:column;gap:4px;font-weight:700}
.btn.big{padding:14px 18px;font-size:17px}
.kah .grow{display:flex;flex-direction:column;gap:3px;min-width:0}
.kadm .stk{margin-top:0}
.kadm{container:kadm/inline-size}
.knet.neg{color:#c92a2a;font-weight:700}
.ksum{gap:8px}.ksum.act{cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;transition:transform .12s}.ksum.act:active{transform:scale(.98)}.ksum.act:focus-visible{outline:2px solid var(--ac);outline-offset:2px}.ksh{display:flex;align-items:center;gap:10px}.ksh .grow{flex:1;min-width:0}.ksh .kn{font-weight:800;font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ksh .kp{font-weight:700;color:var(--gold)}.ksd{font-weight:800;font-size:18px}
.kadm .kbtns{display:flex;flex-wrap:nowrap;align-items:center;gap:6px;width:100%;margin:0}
@container kadm (max-width:330px){.kadm .kbtns{flex-wrap:wrap}}
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
.thm{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:8px;margin:4px 0 8px}.thb{display:flex;flex-direction:column;align-items:center;gap:5px;border:2px solid transparent;border-radius:14px;background:var(--soft);padding:8px 4px;font:inherit;font-size:12px;font-weight:700;color:var(--tx);cursor:pointer;text-align:center}.thb.on{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac)}
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
.tile.extra{border-style:dashed;border-color:var(--c,var(--ac))}
.phbig{width:100%;border-radius:12px}
.upd{border:2px solid #4a56e2;background:#eef0ff;color:#1f2a7a}.upd .hint{color:#33408f}
.chk{border:2px solid #f08c00;background:#fff4e6;color:#5c3c00}.chk .hint{color:#7a5200}
.stk{padding:8px 0;border-top:1px solid var(--ln)}
.stk:first-of-type{border-top:0}
.sb{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:12px;min-width:0}
.sv{font-weight:700}
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
.famh{display:flex;align-items:center;gap:12px}.famfix{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:8px}.famfix span{font-size:13px;font-weight:700;opacity:.75;margin-right:2px}.famfix .btn{min-width:46px}
.fe{font-size:42px;line-height:1}
.ft{font-size:20px;font-weight:900}
.btnrow{display:flex;gap:8px;flex-wrap:wrap}
textarea{width:100%;min-height:90px;resize:vertical}
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
.wizav .grow{flex:1}
.wizavp{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:3px solid var(--c);background:var(--bg);font-size:22px}
.wizq{width:100%;box-sizing:border-box}
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
.kcchip.hot{box-shadow:0 0 0 3px var(--gold)}.mnpg{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}.pepg{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
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
      emoWatch(this.shadowRoot);
      this._db = this._emptyDb();
      this._stored = new Set();
      this._recent = new Map();
      this._pending = new Map();
      this._pv = 0;
      this._q = Promise.resolve();
      this._loaded = false;
      this._tab = (() => { try { const x = localStorage.getItem('kpTab'); return ['heute', 'aufgaben', 'belohnungen', 'kinder', 'advent', 'zaehne', 'geld', 'tier', 'einst'].includes(x) ? x : 'heute'; } catch (e) { return 'heute'; } })();
      this._day = dk(new Date());
      this._until = 0;
      this._pinBuf = '';
    }

    _emptyDb() { return { kid: {}, task: {}, reward: {}, log: {}, req: {}, cfg: {}, act: {}, bak: {}, plan: {}, trash: {}, audit: {}, ph: {}, pt: {}, adc: {}, adk: {}, ado: {}, zc: {}, zk: {}, mb: {}, mk: {}, pk: {}, ss: {}, po: {}, fk: {}, rb: {} }; }

    // ✏️ Editor: eigene Datei (yippee-kids-chores-editor.js), wird erst beim Bearbeiten geladen
    static async getConfigElement() { try { await edLoad(); } catch (e) { /* ohne Editor: YAML geht immer */ } return document.createElement('yippee-kids-chores-card-editor'); }
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
      if (this._offN && this._loaded) this._offQFlush();
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
      if (this._offN === undefined) this._offN = this._offQ().length;
      if (!this._onl) { this._onl = () => setTimeout(() => this._offQFlush(), 1500); window.addEventListener('online', this._onl); }
      clearInterval(this._timer);
      this._timer = setInterval(() => {
        if (dk(new Date()) !== this._day) { this._day = dk(new Date()); this._render(); }
        if (this._wasOpen && this._locked()) { this._wasOpen = false; this._closeModal(); this._render(); }
        this._schedulePenalty();
        this._mnTickSoon();
        if (this._scOn() && Object.keys(this._db.ss).length) this._scTick();
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
      if (this._onl) { window.removeEventListener('online', this._onl); this._onl = null; }
      if (this._ro) this._ro.disconnect();
      this._unsub();
    }

    // 🎨 Darstellung: Karten-Konfiguration (compact, transparent, scale 70–130 %, equal_tiles) hat Vorrang, sonst ⚙️ → 🎨 Darstellung (vCompact, vTransp, vScale, vEqual) für alle Karten
    // – dazu CSS-Variablen --yippee-bg/-surface/-accent/-text für Themes und card_mod
    _lookVals() {
      const c = this._config || {}, g = (this._db && this._db.cfg && this._db.cfg.main) || {};
      const pick = (v, d) => (v === undefined || v === null || v === '' ? !!d : v === true || v === 'true' || v === 'on' || v === 1);
      // 🔠 Größe nur auf diesem Gerät (localStorage) hat Vorrang – z. B. größere Schrift am Kinder-Tablet
      let dev = 0; try { dev = Number(localStorage.getItem('yippee_scale')) || 0; } catch (e) { dev = 0; }
      const sc = dev >= 70 && dev <= 150 ? dev : Math.min(130, Math.max(70, Number(c.scale !== undefined && c.scale !== '' ? c.scale : g.vScale) || 100));
      const th = c.colors !== undefined && c.colors !== '' ? String(c.colors) : (g.vTheme || '');
      // ♿ Hochkontrast / weniger Bewegung: Einstellung nur für dieses Gerät hat Vorrang, „weniger Bewegung“ folgt sonst dem System
      let hcD = '', calmD = ''; try { hcD = localStorage.getItem('yippee_hc') || ''; calmD = localStorage.getItem('yippee_calm') || ''; } catch (e) { hcD = ''; }
      const sysCalm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._calm = calmD ? calmD === '1' : !!g.vCalm || sysCalm;
      const hc = hcD ? hcD === '1' : !!g.vHC;
      return { hc, calm: this._calm, transparent: pick(c.transparent, g.vTransp), compact: pick(c.compact, g.vCompact), equal: pick(c.equal_tiles, g.vEqual), scale: sc, colors: th === 'default' ? null : themeCols(th, this._colPrev || g.vCol, this._darkMode(), !!g.vDarkOwn) };
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
        v.calm ? '*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}#fx .cf{display:none}' : '',
        // 🎨 Farben (nur geprüfte #rrggbb-Werte landen im CSS)
        v.colors ? `:host{--yippee-bg:${v.colors.bg};--yippee-surface:${v.colors.surface};--yippee-text:${v.colors.text};--yippee-text-secondary:${v.colors.mu};--yippee-accent:${v.colors.accent};--divider-color:${mixHex(v.colors.text, v.colors.bg, 0.18)}}` : '',
        v.hc ? `:host{--yippee-bg:#000;--yippee-surface:#141414;--yippee-text:#fff;--yippee-text-secondary:#f0f0f0;--yippee-accent:#ffd400;--bg:#000;--tx:#fff;--mu:#f0f0f0;--ln:#fff;--soft:#141414;--ac:#ffd400;--gold:#ffd400;--ok:#4dff7a;--divider-color:#fff}.card{background:#000;border:2px solid #fff}.tile,.rw,.box,.trow,.btn,.mbox,.stk,input,select,textarea{border:2px solid #fff!important}.btn.primary{background:#ffd400!important;color:#000!important}.hint,small{color:#f0f0f0!important;opacity:1!important}.tile.d,.tile.p{outline:3px solid #4dff7a}` : '',
      ].join('');
      if (st.textContent !== css) st.textContent = css;
    }

    _build() {
      this.shadowRoot.innerHTML = `<style>${CSS}</style><style id="acss">${ADM_CSS}</style><style id="look"></style><div id="app" lang="de"></div><div id="modal"></div><div id="fx"></div>`;
      this._look();
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      ['pointerdown', 'pointerup', 'pointermove', 'pointercancel'].forEach((ev) => this.shadowRoot.addEventListener(ev, (e) => this._sumPointer(e)));
      this.shadowRoot.addEventListener('keydown', (e) => { const el = e.target && e.target.closest && e.target.closest('.ksum.act'); if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); this._sumFire(el.dataset.kid, 'tap'); } else this._a11yKey(e); });
      this._a11yObs = new MutationObserver(() => { if (!this._a11yR) this._a11yR = requestAnimationFrame(() => { this._a11yR = 0; this._a11yFix(); }); });
      this._a11yObs.observe(this.shadowRoot, { childList: true, subtree: true });
      // aufgeklappte Bereiche der Datensicherung überleben das Neuzeichnen
      this.shadowRoot.addEventListener('toggle', (e) => { const d = e.target; if (!d || !d.classList) return; if (d.classList.contains('bklist')) this._bkListOpen = d.open; if (d.classList.contains('bk2')) this._bk2Open = d.open; if (d.classList.contains('sensy')) this._sensyOpen = d.open; }, true);
      this.shadowRoot.addEventListener('input', (e) => {
        if (e.target && e.target.name === 'tplq') this._filterTpl(e.target.closest('.mbox'));
        if (e.target && e.target.classList && e.target.classList.contains('setq')) this._filterSet();
        if (e.target && e.target.classList && e.target.classList.contains('wizq')) this._wizFilter();
        if (e.target && e.target.name === 'scq' && this._scFilter) this._scFilter(e.target); // 📺 Gerät suchen
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
        if (el && el.dataset && el.dataset.whp !== undefined) { this._fnAct('fnwhp', { ...el.dataset, v: el.value }, el, e); return; }
        if (el && el.dataset && ['yippee_hc', 'yippee_calm'].includes(el.dataset.devls)) {
          try { if (el.value) localStorage.setItem(el.dataset.devls, el.value); else localStorage.removeItem(el.dataset.devls); } catch (e2) { /* egal */ }
          (window.__kpCards || [this]).forEach((x) => { try { if (x._look) x._look(); } catch (e2) { /* egal */ } });
          this._render(); return;
        }
        if (el && el.dataset && el.dataset.devscale !== undefined) {
          try { if (el.value) localStorage.setItem('yippee_scale', el.value); else localStorage.removeItem('yippee_scale'); } catch (e2) { /* egal */ }
          (window.__kpCards || [this]).forEach((x) => { try { if (x._look) x._look(); } catch (e2) { /* egal */ } });
          this._render(); return;
        }
        if (el && el.dataset && el.dataset.pecfg) { this._peAct('pechg', { ...el.dataset }, el); return; }
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
      if (!this._loaded) { this._loaded = true; this._cleanup(); this._schedulePenalty(); this._kViewInit(); this._mnTickSoon(); this._mnSumSoon(); if (this._scOn() && Object.keys(this._db.ss).length) this._scTick(); if (this._offQ().length) { this._offN = 1; setTimeout(() => this._offQFlush(), 1500); } }
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
      if (type === 'mb' || type === 'mk') return this._mnClean(type, o);
      if (type === 'pk') return this._peClean(o);
      if (type === 'po') return this._poClean(o);
      if (type === 'fk') return this._fkClean(o);
      if (type === 'rb') return this._rbClean(o);
      if (type === 'ss') { const e = (x) => (typeof x === 'string' && /^[a-z_]+\.[\w]+$/.test(x) ? x : ''); const n = (x) => Math.max(0, Math.round(Number(x) || 0)); return { id: o.id, k: String(o.k || ''), t: String(o.t || '').slice(0, 80), e: String(o.e || '📺').slice(0, 16), ent: e(o.ent), off: ['off', 'script', 'none'].includes(o.off) ? o.off : 'off', offEnt: e(o.offEnt), min: Math.min(240, n(o.min)), start: n(o.start), end: n(o.end), w: !!o.w }; }
      if (type === 'reward' && o.adv !== undefined) o.adv = !!o.adv;
      if (type === 'reward' && o.sc !== undefined) { const c = o.sc, e = (x) => (typeof x === 'string' && /^[a-z_]+\.[\w]+$/.test(x) ? x : ''); if (c && typeof c === 'object' && Number(c.min) > 0) o.sc = { min: Math.max(5, Math.min(240, Math.round(Number(c.min)))), ent: e(c.ent), off: ['off', 'script', 'none'].includes(c.off) ? c.off : 'off', offEnt: e(c.offEnt) }; else delete o.sc; }
      if (type === 'task') {
        if (o.steps !== undefined) o.steps = Array.isArray(o.steps) ? o.steps.filter((x) => x && typeof x === 'object' && x.t).map((x) => (x.tid && /^[\w-]{1,40}$/.test(String(x.tid)) && x.tid !== '__proto__' ? { t: String(x.t).slice(0, 60), tid: String(x.tid) } : { t: String(x.t).slice(0, 60), ...(typeof x.z === 'boolean' ? { z: x.z } : {}) })).slice(0, 12) : [];
        if (o.nfc !== undefined && !/^[\w:.-]{1,80}$/.test(String(o.nfc))) delete o.nfc;
        // ⏱️ Timer
        if (o.tmr !== undefined) { const m = Math.round(Number(o.tmr) || 0); if (m > 0) o.tmr = Math.min(180, m); else { delete o.tmr; delete o.tmrEnd; delete o.tmrMus; } }
        if (o.tmrEnd !== undefined && !['auto', 'ok', 'cd'].includes(o.tmrEnd)) o.tmrEnd = 'auto';
        if (o.game !== undefined) { const g = o.game && typeof o.game === 'object' ? o.game : null; if (g && ['memory', 'move', 'count', 'math', 'clock', 'abc', 'money', 'vocab', 'mul'].includes(g.g)) o.game = { g: g.g, n: Number(g.n) === 0 ? 0 : Math.max(1, Math.min(30, Math.round(Number(g.n) || 5))), ...(Number(g.r) > 1 ? { r: Math.min(5, Math.round(Number(g.r))) } : {}) }; else delete o.game; }
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
      if (type === 'reward' && o.tl !== undefined) { o.tl = Math.max(0, Math.min(500, Math.round(Number(o.tl) || 0))); if (!o.tl) delete o.tl; else { delete o.share; delete o.shareKids; } }
      if (type === 'reward' && o.gm !== undefined) { o.gm = Math.max(0, Math.min(50, Math.round(Number(o.gm) || 0))); if (!o.gm) delete o.gm; }
      if (type === 'reward' && o.mny !== undefined) { o.mny = Math.round(Number(o.mny) || 0); if (!o.mny) delete o.mny; }
      if (type === 'cfg' && o.fam) {
        o.fam = { ...o.fam, cost: Number(o.fam.cost) || 0, pts: Number(o.fam.pts) || 0 };
        // 🔧 Korrekturen von Hand (die letzten 10): Zeitpunkt, vorher, nachher
        // 📋 Warteschlange (nächste Ziele) und 🏆 geschaffte Ziele, Sterne fürs nächste Ziel (nx)
        const fq = (x) => x && typeof x === 'object' && String(x.title || '').trim() && Number(x.cost) >= 10;
        if (Array.isArray(o.fam.q) && o.fam.q.some(fq)) o.fam.q = o.fam.q.filter(fq).slice(0, 10).map((x) => ({ title: String(x.title).trim().slice(0, 60), emoji: String(x.emoji || '🎯').slice(0, 16), cost: Math.min(1e6, Math.round(Number(x.cost))) }));
        else delete o.fam.q;
        if (Array.isArray(o.fam.done) && o.fam.done.length) o.fam.done = o.fam.done.filter((x) => x && String(x.title || '').trim()).slice(-10).map((x) => ({ title: String(x.title).trim().slice(0, 60), emoji: String(x.emoji || '🎯').slice(0, 16), d: /^\d{4}-\d\d-\d\d$/.test(String(x.d)) ? x.d : '' }));
        else delete o.fam.done;
        if (Number(o.fam.nx) > 0) o.fam.nx = Math.min(1e6, Math.round(Number(o.fam.nx))); else delete o.fam.nx;
        if (Array.isArray(o.fam.log)) o.fam.log = o.fam.log.filter((x) => x && Number(x.t) > 0).slice(-10).map((x) => ({ t: Number(x.t), a: Math.max(0, Math.round(Number(x.a) || 0)), b: Math.max(0, Math.round(Number(x.b) || 0)) }));
        else delete o.fam.log;
      }
      if (type === 'cfg') {
        if (o.kView !== undefined && !['compact', 'classic'].includes(o.kView)) delete o.kView;
        if (o.mnCur !== undefined && !MN_CUR.includes(o.mnCur)) delete o.mnCur;
        if (o.pinL !== undefined) o.pinL = Math.min(8, Math.max(4, Number(o.pinL) || 4));
        // 🎮 Einstellungen je Spiel (⚙️ Tab 🐾): nur bekannte Spiele und Felder
        if (o.gs !== undefined) {
          const G = ['catch', 'whack', 'run', 'fly', 'song', 'fire', 'memory', 'move', 'count', 'math', 'clock', 'abc', 'money', 'puzzle', 'simon', 'jr', 'vocab', 'mul', 'maze', 'train', 'board', 'lily', 'space', 'dino'], out = {};
          if (o.gs && typeof o.gs === 'object') G.forEach((g) => {
            const x = o.gs[g]; if (!x || typeof x !== 'object') return;
            const y = {};
            if (x.off === true) y.off = true;
            if ([1, 2, 3].includes(Number(x.tries))) y.tries = Number(x.tries);
            if (x.rep === false) y.rep = false;
            if (Number(x.pairs) >= 6 && Number(x.pairs) <= 12) y.pairs = Math.round(Number(x.pairs));
            if ([3, 4].includes(Number(x.size))) y.size = Number(x.size);
            ['num', 'hint', 'shp'].forEach((k) => { if (x[k] === false) y[k] = false; });
            if (x.ctl === 'e' || x.ctl === 'n' || x.ctl === 'h') y.ctl = x.ctl;
            if (x.gate === true) y.gate = true;
            if (Object.keys(y).length) out[g] = y;
          });
          o.gs = out;
        }
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
    _rewards(kidId) { return Object.values(this._db.reward).filter((r) => !kidId || (this._rwFor(r, kidId) && !this._advR(r) && this._fsShow(r, kidId))).sort((a, b) => this._cost(a, kidId) - this._cost(b, kidId)); }
    // Freispiel-Gutschein (gm): nur mit Spielen und Tageslimit sichtbar
    _fsRw(r) { return !!(r && r.gm && this._peOn() && this._cfg.peGames !== false); }
    _fsUseful() { const c = this._cfg, g = c.peGLim == null ? 3 : Number(c.peGLim), j = c.peJr !== false ? (c.peJrLim == null ? 3 : Number(c.peJrLim)) : 0; return g > 0 || j > 0; }
    _fsShow(r, kidId) { if (!r || !r.gm) return true; return this._fsRw(r) && this._fsUseful() && !!((this._db.pk || {})[kidId] || {}).on; }
    // gesperrt, bis die Spiele heute freigeschaltet sind
    _fsLock(r, kidId) {
      if (!this._fsRw(r)) return false;
      const k = this._db.kid[kidId]; if (!k || !this._peUnlock || !this._peP) return true;
      return !this._peUnlock(k, this._peP(kidId)).ok;
    }
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
      // nur „ab“-Uhrzeit: gilt bis zum Ende ihres Tagesabschnitts (🌅 Morgens bis 11:30 …) – wer erst mittags kommt, hat morgens nichts zu tun
      const bb = this._blkB(), a = mins(t.from, 0), b = t.to ? mins(t.to, 1440) : t.from ? mins([bb.mi, bb.na, bb.a].find((x) => x > String(t.from)), 1440) : 1440;
      return r.segs.some(([x, y]) => a < y && b > x);
    }
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

    _holCals() {
      const c = this._cfg, st = this._hass.states, ents = this._hass.entities || {};
      const cals = Object.keys(st).filter((e) => e.startsWith('calendar.'));
      const txt = (e) => `${e} ${this._ename(e)}`;
      const fe = (c.holCal && st[c.holCal] ? c.holCal : '') || cals.find((e) => (ents[e] || {}).platform === 'holiday') || cals.find((e) => /feiertag|holiday/i.test(txt(e))) || '';
      const sc = (c.ferCal && st[c.ferCal] ? c.ferCal : '') || cals.find((e) => /ferien|school/i.test(txt(e)) && e !== fe) || '';
      return { fe, sc };
    }

    _isDbl(date) {
      const c = this._cfg;
      if (!c.dblOn) return false;
      const [y, m, d] = date.split('-').map(Number);
      return (c.dblDays || [6]).includes(new Date(y, m - 1, d).getDay());
    }

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

    _admin() { return !!(this._hass && this._hass.user && this._hass.user.is_admin); }
    // todo.yippee_kids_chores → „Yippee Kids Chores“ (und umgekehrt wie Home Assistant: „Yippee Bilder“ → todo.yippee_bilder)
    _listName(ent) { return String(ent || '').replace(/^todo\./, '').split('_').filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); }
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
      if ((this._cfg.walletOn || (r.sc && this._scOn())) && !r.joker) push.push(['vouch', { id: uid(), t: r.title, e: r.emoji || '🎁', d: today, ...(r.sc && this._scOn() ? { sc: r.sc } : {}) }, 50]);
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
        if (o.tk !== undefined) { const t = {}; if (obj(o.tk)) Object.keys(o.tk).slice(0, 80).forEach((x) => { const l = Array.isArray(o.tk[x]) ? o.tk[x].filter(idOk).slice(0, 20) : []; if (idOk(x) && l.length) t[x] = l; }); o.tk = t; }
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
        // nach einem Fehlschlag (z. B. Verbindung kurz weg) nach 30 s erneut versuchen statt dauerhaft 📷
        // höchstens 3 Versuche je Bild, danach bleibt es bei 📷 (bis zum Neuladen)
        const tr = this._zOwnTry[ow.r] || { n: 0, t: 0, busy: false };
        if (!tr.busy && tr.n < 3 && (!tr.n || Date.now() - tr.t > 30000)) {
          tr.busy = true; tr.n += 1; this._zOwnTry[ow.r] = tr;
          ZAPI.res(this._hass, ow.r).then((x) => { tr.busy = false; tr.t = Date.now(); if (x) this._render(); else if (tr.n < 3) setTimeout(() => { if (this.isConnected) this._render(); }, 31000); });
        }
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
    _lm(msg, sound) {
      const c = this._cfg;
      if (!c.lmOn || !c.lmDev || !(this._hass.services || {}).lametric) return 0;
      this._hass.callService('lametric', 'message', { device_id: c.lmDev, message: String(msg).slice(0, 120), cycles: 2, ...(sound ? { sound } : {}) }, undefined, false).catch((e) => console.warn('Yippee! LaMetric', e));
      return 1;
    }


    _familyAdd(n) {
      const f = this._cfg.fam;
      if (!f || !f.cost) return;
      if (f.reached) {
        // erreicht, nicht eingelöst: Sterne zählen fürs nächste Ziel
        if (!(f.q || []).length || n <= 0) return;
        const c = { ...this._cfg, fam: { ...f, nx: (f.nx || 0) + n } }; delete c.id;
        this._save('cfg', 'main', c, (cur) => (cur.fam && cur.fam.reached && (cur.fam.q || []).length ? { ...cur, fam: { ...cur.fam, nx: (cur.fam.nx || 0) + n } } : cur));
        return;
      }
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
        <div class="bar big"><i style="width:${pct}%"></i></div>${eta ? `<div class="hint">${eta}</div>` : ''}${this._cfg.teamOn && this._mark(y, 'tb') === '1' ? `<div class="hint">${T('👫 Teambonus gestern: alle haben alles geschafft!')}</div>` : ''}${f.reached ? `<div class="trophy">${T('🎉 Geschafft! Mama und Papa lösen es ein.')}</div>` : ''}${(f.q || []).length ? `<div class="hint famq">${T('Danach: {x}', { x: f.q.slice(0, 3).map((x) => `${esc(x.emoji)} ${esc(x.title)}`).join(' · ') })}${f.reached && f.nx ? ` · ${T('schon {n} ⭐ gesammelt', { n: f.nx })}` : ''}</div>` : ''}</div>`;
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
      if (date === dk(new Date()) && this._fnFind()) this._fnDone(date, tid, kidId, e); // 📒 Sticker / 🥚 Ostereier
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

    _routine(t) { return !!(this._cfg.routOn && t && Array.isArray(t.steps) && t.steps.length); }
    _routDone(date, tid, kidId, n) { return String(this._mark(date, `rs:${tid}:${kidId}`) || '').split(',').filter((x) => x !== '').map(Number).filter((i) => Number.isInteger(i) && i >= 0 && i < n); }
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

    // 📴 Offline-Puffer: Ist Home Assistant weg (WLAN/Neustart), merkt sich das Gerät die Haken und trägt sie nach, sobald die Verbindung wieder steht
    _offline() {
      if (this._cfg.offQ === false || !this._loaded) return false;
      const c = this._hass && this._hass.connection;
      return !!((c && c.connected === false) || (typeof navigator !== 'undefined' && navigator.onLine === false));
    }
    _offQKey() { return `yippee_offq_${String((this._config && this._config.storage) || '')}`; }
    _offQ() { try { const a = JSON.parse(localStorage.getItem(this._offQKey()) || '[]'); return Array.isArray(a) ? a.filter((x) => x && typeof x.t === 'string' && typeof x.k === 'string' && /^\d{4}-\d\d-\d\d$/.test(x.d || '')) : []; } catch (e) { return []; } }
    _offQSet(a) { this._offN = a.length; try { if (a.length) localStorage.setItem(this._offQKey(), JSON.stringify(a.slice(-100))); else localStorage.removeItem(this._offQKey()); } catch (e) { /* kein Speicher */ } }
    _offQHas(tid, kidId) { if (this._offN === 0) return false; const d = dk(new Date()); return this._offQ().some((x) => x.t === tid && x.k === kidId && x.d === d); }
    _offQAdd(tid, kidId, d) {
      const q = this._offQ().filter((x) => !(x.t === tid && x.k === kidId && x.d === d));
      q.push({ t: tid, k: kidId, d, ts: Date.now() }); this._offQSet(q);
      this._toast(T('📴 offline – wird nachgetragen')); this._render();
    }
    _offQFlush() {
      if (this._offFl || !this._loaded || this._offline()) return;
      const q = this._offQ(); this._offN = q.length; if (!q.length) return;
      this._offFl = true; this._offQSet([]);
      const min = new Date(); min.setDate(min.getDate() - 7); let n = 0;
      try {
        q.forEach((x) => {
          const t = this._db.task[x.t], k = this._db.kid[x.k];
          if (!t || !k || x.d < dk(min) || this._st(x.d, x.t, x.k)) return;
          if (this._approval) {
            this._setSt(x.d, x.t, x.k, 'p');
            this._notify(T('✅ {name} hat „{title}“ erledigt – bitte freigeben.', { name: k.name, title: t.title }), 'task', [[T('✓ Freigeben'), `KP|ok|${x.d}|${x.t}|${x.k}`], [T('✕ Ablehnen'), `KP|no|${x.d}|${x.t}|${x.k}`]]);
          } else this._markDone(x.d, x.t, x.k, null);
          n++;
        });
      } finally { this._offFl = false; }
      if (n) { this._toast(T('📶 Wieder verbunden – {n} Haken nachgetragen', { n })); this._render(); }
    }

    _kidTap(tid, kidId, e) {
      const t = this._db.task[tid], k = this._db.kid[kidId];
      if (!t || !k) return;
      const today = dk(new Date());
      const { s: st, date, by } = this._status(t, kidId);
      if (st === 'taken') { const o = this._db.kid[by]; this._toast(T('{name} war schneller ⚡', { name: o ? o.name : T('Jemand') })); return; }
      if (!st && this._offQHas(tid, kidId)) { this._offQSet(this._offQ().filter((x) => !(x.t === tid && x.k === kidId && x.d === today))); this._render(); return; }
      if (!st) {
        const w = this._win(t);
        if (w === 'before') { this._toast(T('⏰ Erst ab {time} Uhr', { time: t.from })); return; }
        if (w === 'after') { this._toast(T('Zeit ist vorbei (bis {time} Uhr)', { time: this._winTo(t) })); return; }
        // 🦷 „Nur mit Timer abhaken“: Antippen startet den Timer
        if (this._zLinked(t) && this._zc().only) { this._zStart(tid, kidId); return; }
        // ⏱️ Aufgabe mit Timer: Antippen startet den Countdown (außer bei „nur Countdown“ – dann wird wie gewohnt abgehakt)
        if (!this._tmrSkip && this._tmr(t) && this._tmr(t).end !== 'cd') { this._tmrStart(tid, kidId); return; }
        // 🎮 Aufgabe mit Spiel: Antippen startet das Spiel – abgehakt wird, wenn das Ziel erreicht ist
        if (!this._gmSkip && this._gmTask(t)) { this._peAct('pegmgo', { k: kidId, t: tid }); return; }
        if (this._routine(t) && !this._routSkip && this._routDone(today, tid, kidId, t.steps.length).length < t.steps.length) { this._routDlg(t, k, e); return; }
        if (this._offline()) { this._offQAdd(tid, kidId, today); this._pop(e, '📴'); return; } // 📴 Home Assistant nicht erreichbar: Haken merken
        if (this._approval && t.photo && this._cfg.photoOn) { this._askPhoto(t, k, today, e); return; }
        if (this._approval) {
          this._setSt(today, tid, kidId, 'p');
          this._pop(e, '⏳');
          if (this._fnFind()) this._fnDone(today, tid, kidId, e);
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
      if (this._tlOver(k, r, rc)) return;
      if (this._fsLock(r, kidId)) { this._toast(T('🔒 Freispiele gibt es erst, wenn die Spiele heute freigeschaltet sind.')); return; }
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
    _shareOn(r) { return !!(this._cfg.shareOn && r && r.share && !r.joker && !r.tl && this._shareKids(r).length > 1); } // 🪙 Taler-Belohnungen nur einzeln
    _shareKids(r) { const all = this._kids().map((k) => k.id); const sel = Array.isArray(r && r.shareKids) && r.shareKids.length ? r.shareKids.filter((id) => all.includes(id)) : all; return sel; }
    _shareCost(r, kidId, n) { return Math.ceil(this._cost(r, kidId) / Math.max(1, n || this._shareKids(r).length)); }
    _poolDone(q) { return !!q && (q.need || []).every((id) => (q.cov || {})[id]); }
    _kn(id) { return (this._db.kid[id] || {}).name || '?'; }
    _names(ids) { const n = ids.map((id) => this._kn(id)); return n.length > 1 ? T('{a} und {b}', { a: n.slice(0, -1).join(', '), b: n[n.length - 1] }) : (n[0] || ''); }

    async _shareCancel(qid, audit = true) {
      const q = this._db.req[qid] ? { ...this._db.req[qid] } : null;
      if (!q || !(await this._claim(qid))) return;
      const r = this._db.reward[q.reward] || {};
      Object.entries(q.paid || {}).forEach(([id, amt]) => { if (this._db.kid[id] && amt > 0) this._addPoints(id, amt, `↩️ Anteil zurück: ${r.title || '?'}`); });
      if (audit) this._audit(T('✕ Wunsch/Einlösung abgelehnt: {name} – {title}', { name: this._names(q.need || [q.kid]), title: r.title || '?' }));
      this._render();
    }

    _monday() { const n = new Date(); return dk(new Date(n.getFullYear(), n.getMonth(), n.getDate() - ((n.getDay() + 6) % 7))); }
    // 🪙 höchstens tlMax ⭐ pro Tag in Taler tauschen (Standard 10, 0 = ohne Grenze) – true + Hinweis, wenn zu viel
    _tlOver(k, r, rc) {
      const tm = r.tl && this._peOn() ? Number(this._cfg.tlMax ?? 10) : 0, today = dk(new Date());
      if (!tm || Object.entries(k.red || {}).reduce((s, [id, ds]) => { const x = this._db.reward[id]; return s + (x && x.tl && Array.isArray(ds) ? ds.filter((d) => d === today).length * this._cost(x, k.id) : 0); }, rc) <= tm) return false;
      this._toast(T('Heute können höchstens {n} ⭐ in Taler getauscht werden – morgen wieder.', { n: tm })); return true;
    }
    _usedWeek(k, rid) { return (((k && k.red) || {})[rid] || []).filter((d) => d >= this._monday()).length; }

    _fsAdd(kidId, r) {
      if (r && r.tl && this._peOn()) this._peCall('_tlAdd', [kidId, r.tl], false); // 🪙 Taler (pet.js)
      if (!this._fsRw(r)) return;
      const n = Math.max(1, Math.min(50, Math.round(Number(r.gm) || 0))), cur = this._db.pk[kidId] || {};
      this._save('pk', kidId, { ...cur, fs: (Number(cur.fs) || 0) + n }, (c) => ({ ...(c || {}), fs: (Number((c || {}).fs) || 0) + n }));
    }


    // opt.got: Eltern lösen direkt ein und geben die Belohnung gleich – dann ohne 🎟️ Gutschein
    async _redeem(kidId, rid, reqId, opt) {
      if (reqId && (this._db.req[reqId] || {}).pool) { await this._shareFinish(reqId, opt); return; }
      if (reqId && !(await this._claim(reqId))) return;
      const r = this._db.reward[rid], k = this._db.kid[kidId];
      if (!r || !k) { this._render(); return; }
      const rc = this._cost(r, kidId);
      if ((k.points || 0) < rc) { this._toast(T('{name} hat nicht mehr genug Punkte', { name: k.name })); this._render(); return; }
      // 💰 Belohnung mit Geldbetrag: + zahlt in die Spardose, − wird vom Taschengeld bezahlt
      const mny = this._mnOn() && this._cfg.mnRw ? Number(r.mny) || 0 : 0;
      if (mny < 0 && this._mnBal(kidId) + mny < 0) { this._toast(T('💰 Nicht genug in der Spardose – es fehlen {x}', { x: this._mnFmt(-(this._mnBal(kidId) + mny)) })); this._render(); return; }
      if (r.limit && this._usedWeek(k, rid) >= r.limit) { this._toast(T('Diese Woche schon {n}× eingelöst – ab Montag wieder', { n: r.limit })); this._render(); return; }
      const today = dk(new Date()), mon = this._monday();
      if (this._tlOver(k, r, rc)) { this._render(); return; }
      // Verlauf, Wochenzähler, Ziel, Joker und Gutschein werden mit der Buchung gespeichert
      const push = [['history', { d: today, t: r.title, e: r.emoji, c: rc }, 10]];
      if ((this._cfg.walletOn || (r.sc && this._scOn())) && !r.joker && !(opt && opt.got)) push.push(['vouch', { id: uid(), t: r.title, e: r.emoji || '🎁', d: today, ...(r.sc && this._scOn() ? { sc: r.sc } : {}) }, 50]);
      this._addPoints(kidId, -rc, `🎁 ${r.title} eingelöst`, { push, red: [rid, today, mon], ungoal: rid, ...(r.joker ? { inc: { jokers: 1 } } : {}) });
      this._audit(T('🎁 Eingelöst: {name} – {title} (−{cost} ⭐)', { name: k.name, title: r.title, cost: rc }));
      if (mny) this._save('mb', `rw${uid()}`, { k: kidId, a: mny, d: today, t: r.title, e: r.emoji || '🎁', src: 'rw', by: (this._hass.user || {}).id || '' });
      this._fsAdd(kidId, r);
      this._lm(`🎁 ${k.name}: ${r.title}`, 'cash');
      this._render();
      this._celebrate(r.emoji || '🎁', T('Viel Spaß, {name}!', { name: k.name }), T('{title} eingelöst · −{cost} ⭐', { title: r.title, cost: rc }));
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
      if (this._setQ || this.shadowRoot.querySelector('.settiles')) this._filterSet(); // auch Kacheln bzw. gewählte Gruppe
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
      return `<div class="card kc" style="${cv(k.color)}">${head}${this._scOn() ? this._scBanner(k) : ''}${page === 'home' ? `${goalHtml}${shelf}${this._peHas(k) ? this._peWidget(k) : ''}` : ''}<div class="kcbody">${body}</div>${nav}</div>`;
    }

    // Sammel-Knöpfe im Kopf (Adventskalender, Zahnputz-Bilder, Abzeichen, Familienziel, Rückblick)
    _kcChips(k) {
      const out = [], today = new Date();
      const adv = this._advBtn(k);
      if (adv) { const waits = adv.includes('advnew'); out.push({ x: 'adv', a: 'advopen', e: '🎄', n: waits ? today.getDate() : '', t: T('Adventskalender'), cls: 'adv', hot: waits }); }
      if (this._zOn() && (this._zDueToday(k.id).length || (this._db.zk[k.id] || {}).n)) { const sn = this._zStreak(k.id); out.push({ x: 'z', e: '🦷', n: sn >= 2 ? `🔥${sn}` : '', t: T('Meine Zahnputz-Bilder') }); }
      if (this._mnOn()) out.push({ x: 'mn', a: 'mnopen', e: '💰', n: this._mnFmt(this._mnBal(k.id)), t: T('Meine Spardose') });
      out.push(...this._fnChips(k));
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
      return `${all ? `<div class="trophy">${T('🏆 Alles geschafft – super!')}</div>${this._fnWheelBtn(k)}` : ''}
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
      const vl = (k.vouch || []).filter((v) => this._cfg.walletOn || (v.sc && this._scOn()));
      if (vl.length) parts.push(`<div class="kcsec">${T('🎟️ Meine Gutscheine')}</div>${vl.map((v) => `${v.sc && this._scOn() ? `<button class="wish vch" data-a="scgo" data-k="${k.id}" data-v="${esc(v.id)}">${esc(v.e || '📺')} <span class="grow">${esc(v.t)}</span><span class="hint">▶️ ${v.sc.min} ${T('Min.')}</span></button>` : `<button class="wish vch" data-a="vuse" data-k="${k.id}" data-v="${esc(v.id)}">${esc(v.e || '🎁')} <span class="grow">${esc(v.t)}</span><span class="hint">${this._vSure(k.id, v.id) ? T('Bekommen? Nochmal tippen') : `${shortDate(v.d)} · ✓`}</span></button>`}`).join('')}`);
      return parts.join('');
    }

    // ---------- 📅 Rückblick (Monat am 1., Jahr im Januar) ----------
    _rcpSeen(kid, key) { try { return (localStorage.getItem(`kpRcp:${this._config.storage}:${kid}`) || '') === key; } catch (e) { return false; } }
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

    _gmPracLeft(t, kid) {
      const gm = this._gmTask(t); if (!gm || gm.r < 2) return 0;
      const p = (this._db.pk || {})[kid] || {}, d = p.d && p.d.d === dk(new Date()) ? p.d : {};
      return Math.max(0, gm.r - 1 - (Number((d.tp || {})[t.id]) || 0));
    }
    _gmTask(t) {
      if (!t || !t.game || !this._peOn() || !['memory', 'move', 'count', 'math', 'clock', 'abc', 'money', 'vocab', 'mul'].includes(t.game.g)) return null;
      return { g: t.game.g, n: Number(t.game.n) === 0 ? 0 : Math.max(1, Math.min(30, Math.round(Number(t.game.n) || 5))), r: Math.max(1, Math.min(5, Math.round(Number(t.game.r) || 1))) }; // n 0 = wie beim Kind · r = wie oft spielbar pro Tag
    }
    _tmr(t) {
      if (!t || !(Number(t.tmr) > 0) || this._zLinked(t)) return null;
      return { min: Math.min(180, Math.max(1, Math.round(Number(t.tmr)))), end: ['auto', 'ok', 'cd'].includes(t.tmrEnd) ? t.tmrEnd : 'auto', mus: ['std', 'own', 'off'].includes(t.tmrMus) ? t.tmrMus : 'std' };
    }

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
    // lang: z. B. 'en-GB' (Englisch-Wörter)
    _sayDev(txt, lang0) {
      const e = this._cfg.rTts;
      if (!e || !this._hass.states[e]) { this._sayHere(txt, lang0); return; }
      const bad = (this._ttsBad = this._ttsBad || {}), lang = lang0 && bad[lang0] && lang0.includes('-') ? lang0.slice(0, 2) : lang0;
      try { if (this._sayAu) { this._sayAu.pause(); } } catch (x) { /* egal */ }
      const a = new Audio(); this._sayAu = a;
      const play = (url) => { a.src = this._hass.hassUrl ? this._hass.hassUrl(url) : url; a.play().catch(() => this._sayHere(txt, lang)); };
      // schon erzeugt: sofort abspielen (noch im Tipp)
      const C0 = (this._ttsC = this._ttsC || new Map()), key = `${e}|${lang || ''}|${txt}`, hit = C0.get(key);
      if (hit && Date.now() - hit.t < 480000) { play(hit.u); return; }
      // im Tipp sofort „freischalten“ (iPhone/WebView spielen sonst nach dem Warten nichts ab)
      try { a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='; a.play().catch(() => {}); } catch (x) { /* egal */ }
      this._hass.callWS({ type: 'media_source/resolve_media', media_content_id: `media-source://tts/${e}?message=${encodeURIComponent(txt)}${lang ? `&language=${encodeURIComponent(lang)}` : ''}`, expires: 600 })
        .then((r) => {
          if (!r || !r.url) { if (this._sayAu === a) this._sayHere(txt, lang); return; }
          C0.set(key, { u: r.url, t: Date.now() }); if (C0.size > 80) C0.delete(C0.keys().next().value);
          if (this._sayAu === a) play(r.url);
        }, () => { if (this._sayAu !== a) return; if (lang && lang.includes('-')) { bad[lang] = 1; this._sayDev(txt, lang); } else this._sayHere(txt, lang); });
    }

    // Browser-Stimme. Chrome (v. a. Android/Tablets) verschluckt einen Satz, der direkt nach cancel() kommt, und bleibt manchmal
    // „pausiert“ hängen – darum nur abbrechen, wenn wirklich gesprochen wird, dann kurz warten; resume() löst den Hänger.
    // Die Äußerung wird gemerkt, sonst räumt Chrome sie mitten im Satz weg. Passende Stimme der Sprache, wenn vorhanden.
    _sayHere(txt, lang0) {
      try {
        const sy = window.speechSynthesis; if (!sy || typeof SpeechSynthesisUtterance === 'undefined') return;
        const lang = lang0 || (LANG === 'gsw' ? 'de-CH' : LANG);
        const u = new SpeechSynthesisUtterance(txt);
        u.lang = lang; u.rate = 0.95;
        try {
          const vs = sy.getVoices() || [], l2 = lang.slice(0, 2).toLowerCase();
          const v = vs.find((x) => x.lang && x.lang.toLowerCase().replace('_', '-') === lang.toLowerCase()) || vs.find((x) => x.lang && x.lang.toLowerCase().startsWith(l2));
          if (v) u.voice = v;
        } catch (x) { /* egal */ }
        this._sayU = u;
        u.onend = () => { if (this._sayU === u) this._sayU = null; };
        const go = () => { if (this._sayU !== u) return; try { sy.resume(); } catch (x) { /* egal */ } sy.speak(u); };
        if (sy.speaking || sy.pending) { sy.cancel(); clearTimeout(this._sayT); this._sayT = setTimeout(go, 120); } else go();
      } catch (e) { /* egal */ }
    }

    // 👨‍👩‍👧 Eltern-Bereich liegt in einer eigenen Datei (yippee-kids-chores-admin.js) und wird erst beim ersten Öffnen geladen –
    // so starten Kinder-Tablets schneller. Bis die Datei da ist, steht „Lade …“ da; Aktionen (z. B. Aufgabe bearbeiten) laufen danach von selbst weiter.
    // ---------- 💰 Taschengeld (1.10): Spardose je Kind – Bedienung in yippee-kids-chores-money.js, hier nur das Nötigste ----------
    _mnOn() { return !!this._cfg.mnOn; }
    // Hauptwährung: von Hand gewählt – sonst passend zur Sprache vorbelegt (Englisch: Pfund oder Dollar wie in Home Assistant eingestellt)
    _mnCur() {
      const c = this._cfg.mnCur, h = this._hass && this._hass.config && this._hass.config.currency;
      if (MN_CUR.includes(c)) return c;
      if (LANG === 'en' && ['GBP', 'USD', 'EUR'].includes(h)) return h;
      return MN_LANG_CUR[LANG] || 'EUR';
    }
    _mnLoc(cur) {
      const l = LANG === 'gsw' ? 'de' : LANG;
      if (cur === 'CHF' && ['de', 'fr', 'it'].includes(l)) return `${l}-CH`;
      if (l === 'en') return cur === 'GBP' ? 'en-GB' : cur === 'EUR' ? 'en-IE' : 'en-US';
      return l;
    }
    // Beträge werden in Cent gespeichert (ganze Zahlen) und in der Schreibweise des Landes angezeigt
    _mnFmt(cents, cur) {
      const c = cur || this._mnCur(), v = (Number(cents) || 0) / 100;
      try { return new Intl.NumberFormat(this._mnLoc(c), { style: 'currency', currency: c, currencyDisplay: 'narrowSymbol' }).format(v); } catch (e) { return `${v.toFixed(2)} ${c}`; }
    }
    _mnName(cur) { try { return new Intl.DisplayNames([this._mnLoc(cur)], { type: 'currency' }).of(cur) || cur; } catch (e) { return cur; } }
    // „12,50“, „12.50“, „1.250,00“ oder „1,250.00“ → Cent
    _mnParse(x) {
      let t = String(x || '').replace(/[^\d.,-]/g, '');
      if (!t) return NaN;
      const lc = Math.max(t.lastIndexOf(','), t.lastIndexOf('.'));
      if (lc >= 0 && t.length - lc - 1 <= 2) t = `${t.slice(0, lc).replace(/[.,]/g, '')}.${t.slice(lc + 1)}`; else t = t.replace(/[.,]/g, '');
      const v = Number(t);
      return Number.isFinite(v) ? Math.round(v * 100) : NaN;
    }
    _mnList(kidId, cur) { const c = cur || this._mnCur(); return Object.values(this._db.mb).filter((b) => b.k === kidId && (b.c || this._mnCur()) === c); }
    _mnBal(kidId, cur) { return this._mnList(kidId, cur).reduce((a, b) => a + (Number(b.a) || 0), 0); }
    _mnClean(type, o) {
      const day = (x) => /^\d{4}-\d\d-\d\d$/.test(String(x || ''));
      if (type === 'mb') {
        const r = { k: String(o.k || ''), a: Math.round(Number(o.a) || 0), d: day(o.d) ? o.d : dk(new Date()), t: String(o.t || '').slice(0, 80) };
        if (o.id !== undefined) r.id = String(o.id);
        if (MN_CUR.includes(o.c)) r.c = o.c;
        if (['man', 'allow', 'x', 'rw', 'start', 'sum'].includes(o.src)) r.src = o.src;
        if (Number(o.st) > 0) r.st = Math.round(Number(o.st));
        if (o.by) r.by = String(o.by).slice(0, 64);
        if (o.e) r.e = String(o.e).slice(0, 16);
        return r;
      }
      const r = o.id !== undefined ? { id: String(o.id) } : {};
      const n = (k, min, max) => { if (o[k] !== undefined && o[k] !== '' && o[k] !== null) { const v = Math.round(Number(o[k])); if (Number.isFinite(v)) r[k] = Math.min(max, Math.max(min, v)); } };
      n('amt', 0, 1e7); n('min', 0, 100); n('rate', 0, 10000); n('rmin', 0, 100000);
      if (['w', 'm'].includes(o.per)) r.per = o.per;
      if (day(o.from)) r.from = o.from;
      if (typeof o.pin === 'string' && /^[0-9a-z]{1,12}$/.test(o.pin)) r.pin = o.pin;
      if (o.goal && typeof o.goal === 'object' && Number(o.goal.amt) > 0) r.goal = { t: String(o.goal.t || '').slice(0, 60), e: String(o.goal.e || '🎯').slice(0, 16), amt: Math.round(Number(o.goal.amt)) };
      return r;
    }
    // Modul nur laden, wenn das Taschengeld eingeschaltet ist; das regelmäßige Taschengeld prüft jedes Gerät (feste Buchungsnummern → nie doppelt)
    // alte Buchungen zusammenfassen (nur Eltern-Geräte, nur bei Bedarf)
    _mnSumSoon() {
      if (!this._mnOn() || this._cfg.mnSum === false || !this._isParent() || this._config.mode === 'kid') return;
      const n = new Date(), cut = dk(new Date(n.getFullYear(), n.getMonth() - 12, 1));
      if (!Object.values(this._db.mb).some((b) => b.d < cut && b.src !== 'start' && b.src !== 'sum')) return;
      mnLoad().then(() => this._mnCompact(), () => {});
    }
    _mnTickSoon() {
      if (!this._loaded || !this._mnOn() || !this._cfg.mnAllow) return;
      mnLoad().then(() => { if (this._mnOn()) this._mnTick(); }, () => {});
    }
    _mnCall(n, a, html) {
      mnLoad().then(() => { this._mnErr = false; if (html) this._render(); else this[n](...a); }, () => { if (!this._mnErr) { this._mnErr = true; this._render(); } });
      if (!html) return undefined;
      return `<div class="card"><div class="empty">${this._mnErr ? T('⚠️ Das Taschengeld konnte nicht geladen werden – liegt die Datei yippee-kids-chores-money.js neben der Karte?') : T('Lade …')}</div></div>`;
    }
    _mnPageHtml(...a) { return this._mnCall('_mnPageHtml', a, true); }
    _mnTabHtml(...a) { return this._mnCall('_mnTabHtml', a, true); }
    _mnAct(...a) { return this._mnCall('_mnAct', a, false); }
    // Knopf in der Kinder-Ansicht (klassisch) bzw. Knopf oben (kompakt)
    _mnBtn(k) {
      if (!this._mnOn()) return '';
      return `<div class="badges"><button type="button" class="kvbtn" data-a="mnopen" data-k="${k.id}"><span class="kve">💰</span> ${T('Meine Spardose')} · <b>${esc(this._mnFmt(this._mnBal(k.id)))}</b> <span class="accc">▸</span></button></div>`;
    }
    // 🐾 Haustier: eigene Datei (yippee-kids-chores-pet.js), wird nur geladen, wenn es eingeschaltet ist
    _peOn() { return !!this._cfg.peOn; }
    _peHas(k) { const p = k && this._db.pk[k.id]; return this._peOn() && !!(p && p.on); }
    // 🎨 Eigenes Haustier (po): KI-erzeugtes SVG in Teilen. Nur reine Zeichen-Elemente bleiben übrig –
    // keine Skripte, keine Links, keine Stile, keine fremden Verweise. Läuft bei jedem Laden und Speichern.
    _poSvg(src, pre) {
      if (typeof src !== 'string' || !src.trim() || src.length > 40000 || typeof DOMParser === 'undefined') return '';
      const EL = new Set(['g', 'path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'line', 'lineargradient', 'radialgradient', 'stop']);
      const AT = new Set(['d', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'points', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'opacity', 'fill-opacity', 'stroke-opacity', 'transform', 'id', 'offset', 'stop-color', 'stop-opacity', 'gradientunits', 'gradienttransform', 'fx', 'fy', 'fill-rule']);
      let doc;
      try { doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${src}</svg>`, 'image/svg+xml'); } catch (e) { return ''; }
      if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) return '';
      const fix = (v) => (v.startsWith(pre) ? v : pre + v);
      const walk = (n) => {
        [...n.childNodes].forEach((c) => {
          if (c.nodeType !== 1) { c.remove(); return; }
          if (!EL.has(c.localName.toLowerCase())) { c.remove(); return; }
          [...c.attributes].forEach((a) => {
            const nm = a.name.toLowerCase(), v = a.value.trim();
            if (!AT.has(nm) || v.length > 8000 || /[<>]|javascript:|expression|@import|\\/i.test(v)) { c.removeAttribute(a.name); return; }
            if (nm === 'id') { const id = v.replace(/[^\w-]/g, ''); if (id) c.setAttribute(a.name, fix(id)); else c.removeAttribute(a.name); return; }
            if (/url\s*\(/i.test(v)) { const m = /^url\(\s*#([\w-]+)\s*\)$/.exec(v); if (m) c.setAttribute(a.name, `url(#${fix(m[1])})`); else c.removeAttribute(a.name); }
          });
          walk(c);
        });
      };
      walk(doc.documentElement);
      const xs = new XMLSerializer();
      return [...doc.documentElement.childNodes].map((c) => xs.serializeToString(c)).join('').replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
    }
    _poClean(o) {
      const idOk = (x) => typeof x === 'string' && /^[\w-]{1,40}$/.test(x) && x !== '__proto__';
      const obj = (v) => v && typeof v === 'object' && !Array.isArray(v);
      const em = (v, d) => (typeof v === 'string' && v && v.length <= 16 && !/[<>&"'`\\]/.test(v) ? v : d);
      const col = (v, d) => (typeof v === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(v) ? v : d);
      const num = (v, d, a = -20, b = 220) => { const x = Number(v); return Number.isFinite(x) ? Math.max(a, Math.min(b, Math.round(x * 10) / 10)) : d; };
      const pt = (v, d) => (Array.isArray(v) && v.length === 2 ? [num(v[0], d[0]), num(v[1], d[1])] : d);
      const id = String(o.id || ''), pre = `${id}_`;
      const P = obj(o.parts) ? o.parts : {}, A = obj(o.an) ? o.an : obj(o.anchors) ? o.anchors : {};
      const parts = {};
      ['defs', 'back', 'tail', 'wings', 'body', 'ears', 'head', 'earsFront', 'front'].forEach((k) => { parts[k] = this._poSvg(P[k], pre); });
      return {
        id, name: String(o.name || '').replace(/[<>&"]/g, '').trim().slice(0, 24), e: em(o.e || o.emoji, '🐾'), food: em(o.food, '🍎'),
        egg: [col((o.egg || [])[0], '#fff6e0'), col((o.egg || [])[1], '#f5c26b')],
        parts,
        an: {
          eyeL: pt(A.eyeL, [84, 68]), eyeR: pt(A.eyeR, [116, 68]), eyeSize: num(A.eyeSize, 8, 4, 14), mouth: pt(A.mouth, [100, 112]),
          headTop: pt(A.headTop, [100, 38]), neck: pt(A.neck, [100, 122]), headPivot: pt(A.headPivot, [100, 120]), tailPivot: pt(A.tailPivot, [134, 146]),
        },
        kids: Array.isArray(o.kids) ? o.kids.filter(idOk).slice(0, 20) : [],
        u: Math.max(0, Math.round(Number(o.u) || 0)),
      };
    }
    // Daten je Kind (pk): nur bekannte Felder, Längen begrenzt
    _peClean(o) {
      const idOk = (x) => typeof x === 'string' && /^[\w-]{1,40}$/.test(x) && x !== '__proto__';
      const obj = (v) => v && typeof v === 'object' && !Array.isArray(v);
      const int = (v, a, b) => Math.max(a, Math.min(b, Math.round(Number(v) || 0)));
      const em = (v) => typeof v === 'string' && v.length <= 16 && !/[<>&"'`]/.test(v) ? v : '';
      const out = { id: o.id };
      if (o.on !== undefined) out.on = !!o.on;
      const KINDS = ['dog', 'cat', 'dino', 'unicorn', 'bird', 'hero', 'fairy'], kOk = (x) => KINDS.includes(x) || (typeof x === 'string' && /^o_[\w-]{1,30}$/.test(x));
      if (kOk(o.kind)) out.kind = o.kind;
      [['skin', 3], ['hair', 4], ['hs', 1], ['col', 4]].forEach(([f, mx]) => { if (o[f] !== undefined) out[f] = int(o[f], 0, mx); });
      if (o.name !== undefined) out.name = String(o.name || '').replace(/[<>]/g, '').slice(0, 24);
      ['t0', 's'].forEach((f) => { if (o[f] !== undefined) out[f] = int(o[f], 0, 1e7); });
      if (o.h !== undefined) out.h = !!o.h;
      if (['v', '1', '2', '3', '4', '5', '6'].includes(String(o.lv))) out.lv = String(o.lv);
      if (o.qn !== undefined && Number(o.qn) >= 3) out.qn = int(o.qn, 3, 30);
      if (o.fd !== undefined && Number(o.fd) >= 1) out.fd = int(o.fd, 1, 10); // 🍎 Füttern pro Tag (je Kind, sonst wie eingestellt)
      ['gl', 'jl', 'ct'].forEach((f) => { if (o[f] !== undefined && o[f] !== null && o[f] !== '') out[f] = int(o[f], 0, 99); }); if (o.bt !== undefined && o.bt !== null && o.bt !== '') out.bt = int(o.bt, 0, 999); // je Kind: Spiele/Abenteuer pro Tag, Challenge-/Geburtstags-Taler
      if (obj(o.acc)) { const a = {}; ['head', 'eyes', 'neck'].forEach((f) => { if (em(o.acc[f])) a[f] = o.acc[f]; }); out.acc = a; }
      if (obj(o.play)) { const m = ['pct', 'tasks', 'always', 'cnt', 'stars'].includes(o.play.m) ? o.play.m : ''; out.play = { m, p: int(o.play.p, 0, 100), t: Array.isArray(o.play.t) ? o.play.t.filter(idOk).slice(0, 30) : [], ...(Number(o.play.n) >= 1 ? { n: int(o.play.n, 1, 100) } : {}) }; }
      // 🗺️ je Kind: Neustart nach „alle Herzen weg“ zählt als neues Level
      if (o.jrc === true) out.jrc = true;
      // 🏠 Zuhause: gekaufte (o) und weggeräumte (x) Sachen, Tapete (w)
      if (obj(o.home)) { const L = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && /^[a-z]{2,12}$/.test(x)).slice(0, 40) : []); out.home = { o: L(o.home.o), x: L(o.home.x), w: int(o.home.w, 0, 9) }; if (obj(o.home.p)) out.home.p = Object.fromEntries(Object.entries(o.home.p).filter(([i, v]) => /^[a-z]{2,12}$/.test(i) && Array.isArray(v)).slice(0, 40).map(([i, v]) => [i, [int(v[0], 0, 100), int(v[1], 0, 100)]])); }
      // ✖️ Einmaleins: Bestzeit in Sekunden je Reihe bzw. Auswahl („2,5,10“)
      if (obj(o.mx)) { const m = {}; Object.keys(o.mx).filter((x) => /^(10|[1-9])(,(10|[1-9])){0,9}$/.test(x)).slice(-60).forEach((x) => { const v = int(o.mx[x], 0, 3600); if (v) m[x] = v; }); out.mx = m; }
      // 🎟️ Freispiele (Guthaben aus Gutschein-Belohnungen, verfallen nie)
      if (Number(o.fs) >= 1) out.fs = int(o.fs, 1, 999);
      if (Number(o.tl) >= 1) out.tl = int(o.tl, 1, 99999); // 🪙 Taler
      if (Number(o.bty) >= 2000) out.bty = int(o.bty, 2000, 2200); if (/^\d{4}-\d\d-\d\d$/.test(String(o.vd))) out.vd = o.vd; // 🎂 Geburtstags-Taler (Jahr) · 👋 Besuch (Tag)
      if (obj(o.d) && /^\d{4}-\d\d-\d\d$/.test(String(o.d.d))) out.d = { d: o.d.d, f: int(o.d.f, 0, 99), b: int(o.d.b, 0, 99), g: int(o.d.g, 0, 999), gs: int(o.d.gs, 0, 86400), a: int(o.d.a, 0, 999), ...(Number(o.d.ch) > 0 ? { ch: int(o.d.ch, 0, 9) } : {}), ...(Number(o.d.ft) > 0 ? { ft: Math.min(Number(o.d.ft), 4102444800000) } : {}), ...(obj(o.d.tp) ? ((tp) => (Object.keys(tp).length ? { tp } : {}))(Object.fromEntries(Object.keys(o.d.tp).filter(idOk).slice(0, 30).map((x) => [x, int(o.d.tp[x], 0, 9)]).filter((x) => x[1] > 0))) : {}) };
      // 🗺️ Abenteuer: freigeschaltetes Level, Kronen je Level, Steuerung
      if (obj(o.jr)) { const c = {}; if (obj(o.jr.c)) Object.keys(o.jr.c).forEach((n) => { const k = Number(n); if (k >= 1 && k <= 10) c[k] = int(o.jr.c[n], 0, 3); }); const tt = {}; if (o.jr.t && typeof o.jr.t === 'object') Object.keys(o.jr.t).forEach((k) => { const n = Number(k), v = Number(o.jr.t[k]); if (n >= 1 && n <= 10 && v > 0 && v < 36000) tt[n] = Math.round(v * 10) / 10; });
        out.jr = { u: int(o.jr.u || 1, 1, 10), c, ctl: o.jr.ctl === 'n' || o.jr.ctl === 'h' ? o.jr.ctl : 'e', ...(o.jr.a === true ? { a: true } : {}), ...(Object.keys(tt).length ? { t: tt } : {}) }; }
      // 📊 Lernstatistik: { 'JJJJ-MM': { spiel: [richtig, 1. Versuch, Lösung gezeigt] } }, höchstens 6 Monate
      if (obj(o.ls)) { const ls = {}; Object.keys(o.ls).filter((m) => /^\d{4}-\d\d$/.test(m) && obj(o.ls[m])).sort().slice(-6).forEach((m) => { const r = {}; Object.keys(o.ls[m]).forEach((g) => { const v = o.ls[m][g]; if (idOk(g) && Array.isArray(v)) r[g] = [0, 1, 2].map((i) => int(v[i], 0, 1e6)); }); if (Object.keys(r).length) ls[m] = r; }); if (Object.keys(ls).length) out.ls = ls; }
      if (Array.isArray(o.wq)) out.wq = o.wq.filter((x) => Array.isArray(x) && idOk(x[0]) && typeof x[1] === 'string').map((x) => [x[0], x[1].replace(/[<>]/g, '').slice(0, 80), int(x[2], 1, 999), /^\d{4}-\d\d-\d\d$/.test(String(x[3])) ? x[3] : '']).slice(0, 30); // 🔁 oft falsch
      if (obj(o.hi)) { const h = {}; Object.keys(o.hi).forEach((g) => { if (idOk(g)) h[g] = int(o.hi[g], 0, 1e6); }); out.hi = h; }
      if (Array.isArray(o.old)) out.old = o.old.filter(obj).map((x) => ({ kind: kOk(x.kind) ? x.kind : 'dog', name: String(x.name || '').replace(/[<>]/g, '').slice(0, 24), to: /^\d{4}-\d\d-\d\d$/.test(String(x.to)) ? x.to : '', g: int(x.g, 0, 3) })).slice(0, 20);
      return out;
    }
    _peCall(n, a, html) {
      peLoad().then(() => { this._peErr = false; if (html) this._render(); else this[n](...a); }, () => { if (!this._peErr) { this._peErr = true; this._render(); } });
      if (!html) return undefined;
      return html === 'w' ? '' : `<div class="card"><div class="empty">${this._peErr ? T('⚠️ Das Haustier konnte nicht geladen werden – liegt die Datei yippee-kids-chores-pet.js neben der Karte?') : T('Lade …')}</div></div>`;
    }
    _peWidget(...a) { return this._peCall('_peWidget', a, 'w'); }
    _pePageHtml(...a) { return this._peCall('_pePageHtml', a, true); }
    _peTabHtml(...a) { return this._peCall('_peTabHtml', a, true); }
    _peAct(...a) { return this._peCall('_peAct', a, false); }
    _peAfter(...a) { return this._peCall('_peAfter', a, false); }
    // 📺 Bildschirmzeit: eigene Datei (yippee-kids-chores-screen.js), wird nur geladen, wenn sie eingeschaltet ist
    _scOn() { return !!this._cfg.scOn; }
    // 🎡📒🥚 Spaß & Sammeln – Kleinigkeiten, die die Karte selbst braucht; alles andere steckt in yippee-kids-chores-fun.js
    _fkClean(o) {
      const n = (x) => Math.max(0, Math.min(999, Math.round(Number(x) || 0))), out = { id: o.id, a: {}, ev: {}, sb: {} };
      const obj = (x) => x && typeof x === 'object' && !Array.isArray(x);
      if (obj(o.a)) FN_ALB.forEach((al) => { const src = o.a[al]; if (!obj(src)) return; const x = {}; Object.keys(src).forEach((i) => { const ii = Number(i); if (Number.isInteger(ii) && ii >= 0 && ii < 24 && n(src[i])) x[ii] = n(src[i]); }); out.a[al] = x; });
      if (obj(o.ev)) Object.keys(o.ev).forEach((k) => { if (/^(egg|pum)\d{4}$/.test(k) && n(o.ev[k])) out.ev[k] = n(o.ev[k]); });
      if (obj(o.sb)) FN_ALB.forEach((al) => { if (o.sb[al]) out.sb[al] = true; });
      if (o.nw !== undefined) out.nw = n(o.nw); // neue Sticker seit dem letzten Öffnen des Albums
      return out;
    }
    _fnSeason(date) {
      const d = date || dk(new Date()), y = Number(d.slice(0, 4)), c = this._cfg;
      if (c.hwOn && d >= `${y}-10-24` && d <= `${y}-10-31`) return 'pum';
      if (!c.eggOn) return '';
      const a = y % 19, b = Math.floor(y / 100), cc = y % 100, dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - dd - g + 15) % 30, i = Math.floor(cc / 4), kk = cc % 4, l = (32 + 2 * e + 2 * i - h - kk) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
      const mon = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1, easter = dk(new Date(y, mon - 1, day));
      return d >= keyAdd(easter, -7) && d <= keyAdd(easter, 1) ? 'egg' : '';
    }
    _fnFind() { return !!(this._cfg.stkOn || this._fnSeason()); }
    _fnHave(kidId) { const a = ((this._db.fk[kidId] || {}).a) || {}; return FN_ALB.reduce((s, al) => s + Object.keys(a[al] || {}).length, 0); }
    _fnWheelReady(k) { return !!(this._cfg.wheelOn && k && !this._mark(dk(new Date()), `wh:${k.id}`)); }
    _fnWheelBtn(k) { return this._fnWheelReady(k) ? `<div class="btnrow" style="justify-content:center;margin:6px 0 10px"><button type="button" class="btn primary" data-a="fnwheel" data-k="${k.id}">${T('🎡 Glücksrad drehen!')}</button></div>` : ''; }
    _fnChips(k) {
      const out = [];
      if (this._cfg.stkOn) { const nw = (this._db.fk[k.id] || {}).nw || 0; out.push({ x: 'stk', a: 'fnalb', e: '📒', n: `${this._fnHave(k.id)}/${FN_ALB.length * 24}`, t: T('Mein Stickeralbum'), cls: nw ? 'hot' : '', hot: !!nw }); }
      if (this._cfg.rdOn) { const n = Object.values(((this._db.rb[k.id] || {}).b) || {}).filter((b) => b && b.s === 'd').length; out.push({ x: 'rd', a: 'rbopen', e: '📚', n, t: T('Mein Lesetagebuch') }); }
      const se = this._fnSeason();
      if (se) { const n = ((this._db.fk[k.id] || {}).ev || {})[`${se}${new Date().getFullYear()}`] || 0; out.push({ x: se, a: 'fnnest', e: se === 'egg' ? '🧺' : '🎃', n, t: se === 'egg' ? T('Mein Osternest') : T('Mein Kürbiskorb') }); }
      return out;
    }
    // 📚 Lesetagebuch: Bücher {id: {t Titel, a Autor, e Emoji, mn Minuten, s r|p|d, d0 Start, d1 fertig}}, m: {Datum: Minuten}
    _rbClean(o) {
      const obj = (x) => x && typeof x === 'object' && !Array.isArray(x), n = (x, mx) => Math.max(0, Math.min(mx, Math.round(Number(x) || 0)));
      const txt = (x, l) => String(x || '').replace(/[<>]/g, '').slice(0, l), dOk = (x) => /^\d{4}-\d\d-\d\d$/.test(String(x || ''));
      const out = { id: o.id, b: {}, m: {} };
      if (obj(o.b)) Object.keys(o.b).slice(0, 300).forEach((id) => { const b = o.b[id]; if (!/^[\w-]{1,40}$/.test(id) || !obj(b) || !txt(b.t, 60)) return; out.b[id] = { t: txt(b.t, 60), a: txt(b.a, 40), e: ['📕', '📗', '📘', '📙', '📓', '📔'].includes(b.e) ? b.e : '📘', mn: n(b.mn, 100000), s: ['r', 'p', 'd'].includes(b.s) ? b.s : 'r', ...(dOk(b.d0) ? { d0: b.d0 } : {}), ...(dOk(b.d1) ? { d1: b.d1 } : {}) }; });
      if (obj(o.m)) Object.keys(o.m).filter(dOk).sort().slice(-400).forEach((d) => { const v = n(o.m[d], 1440); if (v) out.m[d] = v; });
      return out;
    }
    _rbCall(n, a, html) {
      rbLoad().then(() => { this._rbErr = false; if (html) this._render(); else this[n](...a); }, () => { if (!this._rbErr) { this._rbErr = true; this._toast(T('⚠️ Das Lesetagebuch konnte nicht geladen werden – liegt die Datei yippee-kids-chores-read.js neben der Karte?')); } });
      return html ? '' : undefined;
    }
    _rbAct(...a) { return this._rbCall('_rbAct', a, false); }
    _rbAprHtml(...a) { return this._rbCall('_rbAprHtml', a, true); }
    _fnCall(n, a, html) {
      fnLoad().then(() => { this._fnErr = false; if (html) this._render(); else this[n](...a); }, () => { if (!this._fnErr) { this._fnErr = true; this._toast(T('⚠️ Spaß & Sammeln konnte nicht geladen werden – liegt die Datei yippee-kids-chores-fun.js neben der Karte?')); } });
      return html ? '' : undefined;
    }
    _fnAct(...a) { return this._fnCall('_fnAct', a, false); }
    _fnDone(...a) { return this._fnCall('_fnDone', a, false); }
    _fnChecks(...a) { return this._fnCall('_fnChecks', a, false); }
    _fnSettings(...a) { return this._fnCall('_fnSettings', a, true); }

    // 🧩 Zusatzfunktionen (eigene Datei yippee-kids-chores-extras.js) – Platzhalter, bis die Datei geladen ist
    _exCall(n, a, html) {
      exLoad().then(() => { this._exErr = false; if (html) this._render(); else this[n](...a); }, () => { if (!this._exErr) { this._exErr = true; this._toast(T('⚠️ Zusatzfunktionen konnten nicht geladen werden – liegt die Datei yippee-kids-chores-extras.js neben der Karte?')); } });
      return html ? '' : undefined;
    }
    _tmrStart(...a) { return this._exCall('_tmrStart', a, false); }
    _rcpOpen(...a) { return this._exCall('_rcpOpen', a, false); }
    _shareTap(...a) { return this._exCall('_shareTap', a, false); }
    _shareTile(...a) { return this._exCall('_shareTile', a, true); }
    _parentRedeemDlg(...a) { return this._exCall('_parentRedeemDlg', a, false); }
    _parentRedeem(...a) { return this._exCall('_parentRedeem', a, false); }
    _askPhoto(...a) { return this._exCall('_askPhoto', a, false); }
    _bdParty(...a) { return this._exCall('_bdParty', a, false); }
    _say(...a) { return this._exCall('_say', a, false); }
    _zKidHtml(...a) { return this._exCall('_zKidHtml', a, true); }
    _jokerDlg(...a) { return this._exCall('_jokerDlg', a, false); }
    _showLedger(...a) { return this._exCall('_showLedger', a, false); }
    _wish(...a) { return this._exCall('_wish', a, false); }
    _routDlg(...a) { return this._exCall('_routDlg', a, false); }
    _filterTpl(...a) { return this._exCall('_filterTpl', a, false); }
    _filterSet(...a) { return this._exCall('_filterSet', a, false); }
    _wizFilter(...a) { return this._exCall('_wizFilter', a, false); }
    _consCheck(...a) { return this._exCall('_consCheck', a, false); }
    _pushSensors(...a) { return this._exCall('_pushSensors', a, false); }
    _weeklyCheck(...a) { return this._exCall('_weeklyCheck', a, false); }
    _dataCheck(...a) { return this._exCall('_dataCheck', a, false); }
    _abCheck(...a) { return this._exCall('_abCheck', a, false); }
    _bonusCheck(...a) { return this._exCall('_bonusCheck', a, false); }
    _bdayCheck(...a) { return this._exCall('_bdayCheck', a, false); }
    _dailyCheck(...a) { return this._exCall('_dailyCheck', a, false); }
    _repCheck(...a) { return this._exCall('_repCheck', a, false); }
    _morningCheck(...a) { return this._exCall('_morningCheck', a, false); }
    _reminderCheck(...a) { return this._exCall('_reminderCheck', a, false); }
    _holCheck(...a) { return this._exCall('_holCheck', a, false); }
    _tgReply(...a) { return this._exCall('_tgReply', a, false); }
    _penaltyCheck(...a) { return this._exCall('_penaltyCheck', a, false); }
    _abMake(...a) { return this._exCall('_abMake', a, false); }
    _shareFinish(...a) { return this._exCall('_shareFinish', a, false); }
    _nfcTap(...a) { return this._exCall('_nfcTap', a, false); }
    _cleanup(...a) { return this._exCall('_cleanup', a, false); }
    _scCall(n, a, html) {
      scLoad().then(() => { this._scErr = false; if (html) this._render(); else this[n](...a); }, () => { if (!this._scErr) { this._scErr = true; this._toast(T('⚠️ Die Bildschirmzeit konnte nicht geladen werden – liegt die Datei yippee-kids-chores-screen.js neben der Karte?')); } });
      return html ? '' : undefined;
    }
    _scAct(...a) { return this._scCall('_scAct', a, false); }
    _scTick(...a) { return this._scCall('_scTick', a, false); }
    _scBanner(...a) { return this._db.ss[(a[0] || {}).id] ? this._scCall('_scBanner', a, true) : ''; }
    _scAdminHtml(...a) { return Object.keys(this._db.ss).length ? this._scCall('_scAdminHtml', a, true) : ''; }
    // 📅 Rückblick: gespart und ausgegeben im Monat (nur Hauptwährung)
    _mnMonth(kidId, ym) {
      let inn = 0, out = 0;
      this._mnList(kidId).forEach((b) => { if (String(b.d).startsWith(`${ym}-`) && b.src !== 'start') { if (b.a > 0) inn += b.a; else out -= b.a; } });
      return { inn, out };
    }

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
      const mnKid = this._mnKid && this._db.kid[this._mnKid] && this._mnOn() ? this._mnKid : '';
      const mnPage = (id) => `<div class="mnpg"><button class="btn advback" data-a="mnclose">${T('← Zurück')}</button>${this._mnPageHtml(id)}</div>`;
      const peKid = this._peKid && this._db.kid[this._peKid] && this._peHas(this._db.kid[this._peKid]) ? this._peKid : '';
      const pePage = (id) => `<div class="pepg"><button class="btn advback" data-a="peclose">${T('← Zurück')}</button>${this._pePageHtml(id)}</div>`;
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
        html = advKid ? advPage('kid', advKid, true) : mnKid ? mnPage(mnKid) : peKid ? pePage(peKid) : kids.length > 1 && this._kPages()
          ? this._kPagesHtml(kids)
          : kids.length
          ? `<div class="kwrap">${this._famTop() ? this._familyHtml() : ''}<div class="kgrid">${kids.map((k) => this._kidHtml(k)).join('')}</div></div>`
          : `<div class="card"><div class="empty">${T('Noch keine Kinder angelegt – das geht in der Eltern-Ansicht unter 👧 Kinder.')}</div></div>`;
      } else if (mode === 'kid') {
        const k = this._kidByName(this._config.child);
        if (!k) {
          const names = this._kids().map((x) => x.name).join(', ');
          html = `<div class="card"><div class="empty">${T('Kind „{name}“ nicht gefunden.', { name: esc(this._config.child || '') })}<br>${names ? T('Angelegt sind: {names}', { names: esc(names) }) : T('Lege zuerst in der Eltern-Ansicht ein Kind an.')}</div></div>`;
        } else html = advKid === k.id ? advPage('kid', k.id, true) : mnKid === k.id ? mnPage(k.id) : peKid === k.id ? pePage(k.id) : `<div class="kwrap">${this._famTop() ? this._familyHtml() : ''}${this._kidHtml(k)}</div>`;
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
      if (this._peOn() && app.querySelector('.pest')) this._peAfter(app);
      if (app.querySelector('.kpage')) this._kSwipeInit();
    }

    // 📱 Ein Kind pro Seite (Karte mit allen Kindern): Leiste zum Antippen, Wischen wechselt das Kind, jedes Gerät merkt sich das letzte Kind
    _kPages() { return this._config.pages === true || (this._config.pages !== false && !!this._cfg.kPages); }
    _kPageKey() { return `yippee_page_${this._config.storage || ''}`; }
    _kPageCur(kids) {
      if (!this._pgKid) { try { this._pgKid = localStorage.getItem(this._kPageKey()) || ''; } catch (e) { this._pgKid = ''; } }
      return kids.find((k) => k.id === this._pgKid) || kids[0];
    }
    _kPageGo(id, dir) {
      if (!id || id === this._pgKid) return;
      this._pgKid = id; this._pgDir = dir || 0;
      try { localStorage.setItem(this._kPageKey(), id); } catch (e) { /* privater Modus */ }
      this._render();
      const app = this.shadowRoot && this.shadowRoot.getElementById('app'); if (app) app.scrollTop = 0;
    }
    _kPagesHtml(kids) {
      const cur = this._kPageCur(kids), i = kids.indexOf(cur), dir = this._pgDir || 0; this._pgDir = 0;
      return `<div class="kwrap kpages">${this._famTop() ? this._familyHtml() : ''}
        <div class="kpbar" role="tablist">${kids.map((k) => `<button type="button" role="tab" aria-selected="${k === cur}" class="kpt ${k === cur ? 'on' : ''}" data-a="kpage" data-k="${k.id}"><span class="kpe">${esc(k.emoji || '🙂')}</span><span class="kpn">${esc(k.name)}</span></button>`).join('')}</div>
        <div class="kpage ${dir > 0 ? 'inr' : dir < 0 ? 'inl' : ''}" data-i="${i}">${this._kidHtml(cur)}</div>
        <div class="kpdots" aria-hidden="true">${kids.map((k) => `<i class="${k === cur ? 'on' : ''}"></i>`).join('')}</div></div>`;
    }
    _kSwipeInit() {
      if (this._swipeOn || !this.shadowRoot) return;
      this._swipeOn = true;
      // Wischen: schon bei touchmove entscheiden, Zuhörer auch am Element (übersteht Neuzeichnen und touchcancel)
      let x0 = 0, y0 = 0, t0 = 0, on = false;
      const tmove = (e) => {
        if (!on) return;
        const t = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]); if (!t) return;
        const dx = t.clientX - x0, dy = t.clientY - y0;
        if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx)) { on = false; return; } // senkrecht scrollen
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.4 || Date.now() - t0 > 1500) return;
        on = false;
        const kids = this._kids(), cur = this._kPageCur(kids), i = kids.indexOf(cur);
        const n = kids[(i + (dx < 0 ? 1 : -1) + kids.length) % kids.length];
        if (n) this._kPageGo(n.id, dx < 0 ? 1 : -1);
      };
      this.shadowRoot.addEventListener('touchstart', (e) => {
        const pg = e.target.closest && e.target.closest('.kpage');
        if (!pg || e.touches.length !== 1 || e.target.closest('input,textarea,select,.gmov,.mback')) { on = false; return; }
        on = true; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
        const el = e.target;
        if (el && !el._ypSw) {
          el._ypSw = true;
          el.addEventListener('touchmove', tmove, { passive: true });
          el.addEventListener('touchend', tmove, { passive: true });
        }
      }, { passive: true });
      this.shadowRoot.addEventListener('touchmove', tmove, { passive: true });
      this.shadowRoot.addEventListener('touchend', tmove, { passive: true });
      // PC: Maus ziehen oder Touchpad seitlich wischen
      const step = (d) => {
        const kids = this._kids(), cur = this._kPageCur(kids), i = kids.indexOf(cur);
        const n = kids[(i + d + kids.length) % kids.length];
        if (n) this._kPageGo(n.id, d);
      };
      let mx = 0, my = 0, mdown = false, dragged = 0;
      this.shadowRoot.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch' || e.button !== 0) return;
        const pg = e.target.closest && e.target.closest('.kpage');
        if (!pg || e.target.closest('input,textarea,select,.gmov,.mback')) return;
        mdown = true; dragged = 0; mx = e.clientX; my = e.clientY;
      });
      this.shadowRoot.addEventListener('pointerup', (e) => {
        if (!mdown) return; mdown = false;
        const dx = e.clientX - mx, dy = e.clientY - my;
        if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
        dragged = Date.now() + 400; step(dx < 0 ? 1 : -1);
      });
      // nach dem Ziehen keinen Klick auf eine Aufgabe auslösen
      this.shadowRoot.addEventListener('click', (e) => { if (dragged && Date.now() < dragged) { dragged = 0; e.stopPropagation(); e.preventDefault(); } }, true);
      let wx = 0, wt = 0, wlock = 0;
      this.shadowRoot.addEventListener('wheel', (e) => {
        if (!(e.target.closest && e.target.closest('.kpage')) || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        const now = Date.now(); if (now < wlock) return;
        if (now - wt > 300) wx = 0; wt = now; wx += e.deltaX;
        if (Math.abs(wx) > 90) { wlock = now + 700; const d = wx > 0 ? 1 : -1; wx = 0; step(d); }
      }, { passive: false });
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
          if (t.virtual && t.part && !s) info = `${T('Mal {n}', { n: t.part })} · ${info}`;
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
          const oq = !s && this._offQHas(t.id, k.id); // 📴 offline gemerkt
          if (oq) info = T('📴 offline – wird nachgetragen');
          const badge = oq ? '📴' : s === 'd' ? '✓' : s === 'p' ? '⏳' : s === 'taken' ? '🔒' : s === 'x' ? '✕' : s === 'm' ? '?' : s === 'e' ? '🙂' : w === 'before' ? '🕒' : w === 'after' ? '✕' : '';
          return `<button class="tile ${cls} ${oq ? 'oq' : ''} ${once ? 'once' : ''} ${xtra ? 'extra' : ''} ${rdr ? 'rd' : ''}" data-a="ktap" data-t="${t.id}" data-k="${k.id}">
            ${rdr && !this._config.summary ? `<span class="say" data-a="say" data-t="${t.id}" data-k="${k.id}" role="button" aria-label="${esc(T('Vorlesen'))}">🔊</span>` : ''}
            ${streak >= 2 ? `<span class="fire">🔥${streak}</span>` : ''}
            <span class="e">${esc(t.emoji || '⭐')}</span><span class="t"><span>${esc(t.title)}</span></span>
            <span class="p">${info}</span>
            ${zgo ? `${this._zExtra(t, k.id) ? `<span class="zx">${T('🔥 Extra!')}</span>` : ''}<span class="zgo" data-a="zgo" data-t="${t.id}" data-k="${k.id}" role="button">${T('🦷 Los geht\'s!')}</span>` : ''}
            ${tm ? `<span class="tgo" data-a="tgo" data-t="${t.id}" data-k="${k.id}" role="button">${T('⏱️ {n} Min.', { n: tm.min })}</span>` : ''}
            ${this._gmTask(t) && !s ? `<span class="tgo" data-a="pegmgo" data-t="${t.id}" data-k="${k.id}" role="button">🎮 ${T('Los geht\'s!')}</span>` : ''}
            ${this._gmTask(t) && s === 'd' && !this._config.summary && this._gmPracLeft(t, k.id) ? `<span class="tgo" data-a="pegmgo" data-t="${t.id}" data-k="${k.id}" role="button">🔁 ${T('Nochmal üben ({n})', { n: this._gmPracLeft(t, k.id) })}</span>` : ''}
            ${badge ? `<span class="badge">${badge}</span>` : ''}</button>`;
        }).join('')}</div>`;
    }

    // ⏰ Tagesblöcke (optional): Morgens / Mittags / Nachmittags / Abends / Ohne Zeit – je mit eigenem Fortschritt
    _blk(t) { const f = String(t.from || ''), b = this._blkB(); return !f ? 'day' : f < b.mi ? 'm' : f < b.na ? 'mi' : f < b.a ? 'na' : 'a'; }
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
          return `<div class="badges"><button type="button" class="kvbtn" data-a="kvtog" data-x="b" data-k="${k.id}" aria-expanded="${o}">🏅 ${T('Abzeichen {n}/{total}', { n: got.length, total: BADGES.length })}${o ? '' : ` <span class="kvgot">${got.map((b) => b[1]).join('')}</span>`} <span class="accc">▸</span></button>${o ? BADGES.map((b) => `<span class="bdg ${b[3](k) ? 'on' : ''}" data-a="bdgi" data-b="${b[0]}" data-k="${k.id}" title="${esc(T(b[2]))}">${b[1]}</span>`).join('') : ''}</div>${rcpHtml}${this._mnBtn(k)}`;
      })();
      const fnHtml = this._fnChips(k).map((c) => `<div class="badges"><button type="button" class="kvbtn" data-a="${c.a}" data-k="${k.id}"><span class="kve">${c.e}</span> <span>${esc(c.t)} · <b>${esc(String(c.n))}</b></span> <span class="accc">▸</span></button></div>`).join('');
      const tasksHtml = `${this._cfg.dayBlocks || (this._presCfg(k.pres) && this._pres(k.id, dk(new Date())).s === 'out') ? '' : `<div class="sect"><span>${T('Heute')}</span><span class="hint">${T('{done}/{total} erledigt', { done, total: reqT.length })}</span></div>`}
        ${reqT.length && done === reqT.length ? `<div class="trophy">${T('🏆 Alles geschafft – super!')}</div>${this._fnWheelBtn(k)}` : ''}
        ${this._presCfg(k.pres) && this._pres(k.id, dk(new Date())).s === 'out' ? '' : this._dayBlocks(tasks, stat, k)}
        ${this._previewHtml(k)}`;
      const rwHtml = `${rewards.length || this._cfg.wishOn || (this._cfg.gradesOn && this._cfg.gKids !== false) ? `<div class="sect"><span>${T('Belohnungen')}</span>${this._cfg.jokerOn && k.jokers > 0 ? `<button class="btn sm" data-a="joker" data-k="${k.id}">${T('🃏 Joker ×{n}', { n: k.jokers })}</button>` : ''}${this._cfg.gradesOn && this._cfg.gKids !== false ? `<button class="btn sm" data-a="kgrade" data-k="${k.id}">${T('🎓 Note')}</button>` : ''}${this._cfg.wishOn ? `<button class="btn sm" data-a="wish" data-k="${k.id}">${T('💡 Wunsch')}</button>` : ''}</div>` : ''}
        ${this._cfg.wishOn ? Object.values(this._db.req).filter((q) => q.kid === k.id && q.wish).map((q) => `<div class="wish">${esc(q.wish.emoji || '💡')} <span class="grow">${esc(q.wish.title)}</span><span class="hint">${T('wartet auf Mama/Papa')}</span></div>`).join('') : ''}
        ${this._cfg.gradesOn ? reqs.filter((q) => q.grade).map((q) => `<div class="wish">🎓 <span class="grow">${q.grade.rep ? esc(T('Zeugnis')) : `${esc(q.grade.s)}: ${esc(this._gFmt(q.grade.g))}`}</span><span class="hint">${T('wartet auf Mama/Papa')}</span></div>`).join('') : ''}
        ${rewards.length ? (() => {
          const vis = rewards.filter((r) => !this._shareOn(r) || this._shareKids(r).includes(k.id));
          const canNow = (r) => !this._shareOn(r) && pts >= kc(r) && !this._fsLock(r, k.id) && !(r.limit && this._usedWeek(k, r.id) >= r.limit && !reqs.some((q) => q.reward === r.id));
          const ready = this._rwSorted(vis.filter(canNow), k.id), gs = [...(ready.length ? [[T('✨ Jetzt einlösbar'), ready]] : []), ...this._rwGroups(vis.filter((r) => !canNow(r)), k.id, true)];
          return gs.map(([gt, gl]) => `${gs.length > 1 ? `<div class="rwh">${gt}</div>` : ''}<div class="rws">${gl.map((r) => {
          if (this._shareOn(r)) return this._shareTile(r, k, pts, gOn);
          const asked = reqs.some((q) => q.reward === r.id);
          const used = r.limit ? this._usedWeek(k, r.id) : 0, full = !!r.limit && used >= r.limit && !reqs.some((q) => q.reward === r.id);
          const lock = this._fsLock(r, k.id), ok = pts >= kc(r) && !full && !lock;
          const isGoal = gOn && k.goal === r.id;
          return `<div class="rw ${isGoal ? 'goal' : ''}">${gOn ? `<button class="goalbtn ${isGoal ? 'on' : ''}" data-a="goal" data-r="${r.id}" data-k="${k.id}" title="${esc(T('Als Ziel wählen'))}">🎯</button>` : ''}
            <span class="e">${esc(r.emoji || '🎁')}</span><span class="t">${esc(r.title)}</span><span class="pts">${kc(r)} ⭐</span>
            <div class="bar"><i style="width:${Math.max(0, Math.min(100, Math.round((pts / Math.max(1, kc(r))) * 100)))}%"></i></div>
            ${r.limit ? `<span class="hint">${T('{used}/{limit}× diese Woche', { used, limit: r.limit })}</span>` : ''}${this._fsRw(r) ? `<span class="hint">🎟️ ${T('{n} Freispiele', { n: r.gm })}</span>` : ''}${r.tl && this._peOn() ? `<span class="hint">🪙 ${T('{n} Taler', { n: r.tl })}</span>` : ''}
            <button class="btn ${ok || asked ? 'primary' : ''}" data-a="req" data-r="${r.id}" data-k="${k.id}" ${ok || asked ? '' : 'disabled'}>${asked ? T('⏳ angefragt') : full ? T('diese Woche aufgebraucht') : lock && pts >= kc(r) ? T('🔒 erst nach dem Freischalten') : ok ? T('Einlösen') : T('noch {n} ⭐', { n: kc(r) - pts })}</button></div>`;
        }).join('')}</div>`).join(''); })() : ''}
        ${(k.vouch || []).some((v) => this._cfg.walletOn || (v.sc && this._scOn())) ? `<div class="sect"><span>${T('🎟️ Meine Gutscheine')}</span><span class="hint">${T('Mama oder Papa haken ab, wenn du es bekommen hast')}</span></div>
          <div class="vchs">${k.vouch.filter((v) => this._cfg.walletOn || (v.sc && this._scOn())).map((v) => v.sc && this._scOn() ? `<button class="wish vch" data-a="scgo" data-k="${k.id}" data-v="${esc(v.id)}">${esc(v.e || '📺')} <span class="grow">${esc(v.t)}</span><span class="hint">▶️ ${v.sc.min} ${T('Min.')}</span></button>` : `<button class="wish vch" data-a="vuse" data-k="${k.id}" data-v="${esc(v.id)}">${esc(v.e || '🎁')} <span class="grow">${esc(v.t)}</span><span class="hint">${this._vSure(k.id, v.id) ? T('Bekommen? Nochmal tippen') : `${shortDate(v.d)} · ✓`}</span></button>`).join('')}</div>` : ''}`;
      // 🧒 Kompakte Kinder-Ansicht (1.9): Kopf, Sammel-Knöpfe, „Jetzt dran“ und eine Leiste unten (Heute · Belohnungen · Sammlung)
      if (!fold && this._kView() === 'compact') return this._kidCompact(k, { pts, money, lv, L, nxt, tot, goal, target, kc, tasks, stat, reqT, done, banners, badgesHtml, rwHtml, rewards, reqs, isBd });
      return `<div class="card ${fold ? 'fold' : ''}" style="${cv(k.color)}">
        ${fold ? `<button class="khbtn" data-a="kfold" data-k="${k.id}">${head}</button><div class="kbody ${this._animK === k.id ? 'anim' : ''}">` : isBd ? `<div class="bdtap" data-a="bdparty" data-k="${k.id}">${head}</div>` : head}
        ${this._scOn() ? this._scBanner(k) : ''}
        ${this._advBtn(k)}
        ${this._peHas(k) ? this._peWidget(k) : ''}
        ${targetHtml}
        ${banners}
        ${badgesHtml}${fnHtml}
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

    _adminHtml(...a) { return this._admCall('_adminHtml', a, true); }

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




    _calPreview(ent) {
      if (!ent) return T('Bitte einen Kalender wählen.');
      if (!this._hass.states[ent]) return T('⚠️ Kalender nicht gefunden.');
      const ev = this._calEvents(ent);
      if (!ev) return T('Lade Termine …');
      const today = dk(new Date());
      const nx = Object.keys(ev).filter((d) => d >= today).sort().slice(0, 6);
      return nx.length ? T('Nächste Termine: {list}', { list: nx.map((d) => `<b>${shortDate(d)}</b> ${esc(ev[d].join(', '))}`).join(' · ') }) : T('Keine kommenden Termine im Kalender.');
    }





    _ord(a, b) { return this._cfg.orderOn ? (a.order || 0) - (b.order || 0) : 0; }
    _tkOpen(key) { if (!this._tkO) { try { this._tkO = JSON.parse(localStorage.getItem('kpTkO') || '{}') || {}; } catch (e) { this._tkO = {}; } } return this._tkO[key] !== false; }
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

    _inApp() { return /Home ?Assistant/i.test(navigator.userAgent || ''); }

    _backupJson() {
      const data = {};
      ['kid', 'task', 'reward', 'log', 'req', 'cfg', 'adc', 'adk', 'zc', 'zk', 'mb', 'mk', 'pk', 'po', 'fk', 'rb'].forEach((ty) => {
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

    _isTg(e) { const r = this._hass.entities && this._hass.entities[e]; return (r && r.platform === 'telegram_bot') || /telegram/i.test(`${e} ${this._ename(e)}`); }
    _ename(e) { const st = this._hass.states[e]; return (st && st.attributes.friendly_name) || e; }



    _editKid(...a) { return this._admCall('_editKid', a, false); }
    _editCalLink(...a) { return this._admCall('_editCalLink', a, false); }
    _editReward(...a) { return this._admCall('_editReward', a, false); }
    _editTask(...a) { return this._admCall('_editTask', a, false); }
    _wizAct(...a) { return this._admCall('_wizAct', a, false); }



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

    _slotRow(n, f = '19:00', to = '20:00') { return `<div class="g2 g2e slotrow" style="margin-top:6px;grid-template-columns:1fr 1fr auto;align-items:end"><label>${T('Zeitfenster {n}', { n })}<input type="time" data-slotfrom value="${esc(f)}"></label><label>${T('bis')}<input type="time" data-slotto value="${esc(to)}"></label><button type="button" class="icon" data-a="slotdel">✕</button></div>`; }
    // Vorlagen-Zeitfenster: 'm', ['von','bis'] oder mehrere wie 'm+mi+a'
    _tplWins(win) { return typeof win === 'string' && win.includes('+') ? win.split('+').map((x) => WINDOWS[x]).filter(Boolean) : [Array.isArray(win) ? win : (WINDOWS[win] || ['', ''])]; }

    _routMap() {
      return this._memo('routmap', '', () => {
        const m = {};
        if (!this._cfg.routOn) return m;
        Object.values(this._db.task).forEach((r) => { if (!r.virtual && Array.isArray(r.steps)) r.steps.forEach((x) => { if (x.tid && this._db.task[x.tid] && !m[x.tid]) m[x.tid] = r.id; }); });
        return m;
      });
    }


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
        const tsk = !!m.querySelector('[name=points]');
        const pop = document.createElement('div');
        pop.className = 'emopop';
        pop.hidden = true;
        const fill = () => { const groups = tsk ? TASK_EMOJI_GROUPS : REWARD_EMOJI_GROUPS; pop.innerHTML = `<div class="emohd"><span class="hint">${T('Emoji antippen')}</span><button type="button" class="btn sm" data-a="emokb">${T('⌨️ Eigenes eintippen')}</button></div>
          <div class="emogrid">${groups.map(([g, l]) => `<div class="emog">${T(g)}</div>${l.filter((x) => !EMO_NEW.test(x) || emoOk(x) || EMO_FB[x]).map((x) => `<button type="button" class="ep ${inp.value === x ? 'on' : ''}" data-a="epick" data-e="${x}">${emoFix(x)}</button>`).join('')}`).join('')}</div>`; };
        fill(); if (!TASK_EMOJI_GROUPS.length) exLoad().then(fill, () => {}); // Liste kommt mit extras.js
        (inp.closest('.g2') || inp.closest('label') || inp).after(pop);
      }
    }

    _closeModal() { const m = this.shadowRoot.getElementById('modal'); m.innerHTML = ''; m.classList.remove('open'); this._mh = null; }

    // ---------- Effekte ----------
    // ♿ Tastatur: Enter/Leertaste lösen auch Nicht-Knöpfe mit Aktion aus, Esc schließt das Fenster
    _a11yKey(e) {
      const tg = e.target;
      if (e.key === 'Escape') { const x = this.shadowRoot.querySelector('#modal.open [data-a=mclose]'); if (x) { e.preventDefault(); x.click(); } return; }
      if ((e.key === 'Enter' || e.key === ' ') && tg && tg.matches && tg.matches('[data-a][tabindex]:not(button):not(input):not(select):not(textarea):not(a)')) { e.preventDefault(); tg.click(); }
    }
    // ♿ nach jedem Zeichnen: antippbare Nicht-Knöpfe per Tab erreichbar, Symbol-Knöpfe bekommen eine Beschriftung für Screenreader
    _a11yFix() {
      const r = this.shadowRoot; if (!r) return;
      r.querySelectorAll('[data-a]:not(button):not(input):not(select):not(textarea):not(a):not(label):not(option):not(summary):not(form):not(.mback):not([tabindex])').forEach((el) => { el.tabIndex = 0; if (!el.getAttribute('role')) el.setAttribute('role', 'button'); });
      r.querySelectorAll('button:not([aria-label])[title]').forEach((b) => { if (!/[\p{L}\d]{2}/u.test(b.textContent || '')) b.setAttribute('aria-label', b.title); });
      r.querySelectorAll('#modal [data-a=mclose]:not([aria-label])').forEach((b) => { if (!/[\p{L}]{2}/u.test(b.textContent || '')) b.setAttribute('aria-label', T('Schließen')); });
      const m = r.querySelector('#modal .mbox'); if (m && !m.getAttribute('role')) { m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); }
    }

    _toast(msg, act) {
      const fx = this.shadowRoot.getElementById('fx');
      fx.querySelectorAll('.toast').forEach((t) => t.remove());
      const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); t.textContent = msg; fx.appendChild(t);
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
      if (this._calm || !fx) return; // ♿ weniger Bewegung
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
      if (/^mn[a-z]+$/.test(a) && !['mnopen', 'mnclose'].includes(a)) { this._mnAct(a, { ...ds }, el); return; }
      // nur die Aktionen der ausgelagerten Dateien – andere Namen mit pe/sc (z. B. scriptnew, schx) bleiben unten im switch
      if (/^pe(pick|pl|start|tap|pet|feed|play|acc|games|gmgo|kon|kset|chg|poadd|poed|podel|tkr|jrc|home|hback|hbuy|htog|hwall|hreset|hmv|hok|htidy|hroom|hvis|hbye)$/.test(a)) { this._peAct(a, { ...ds }, el); return; }
      if (/^sc(go|open|stop|plus|end)$/.test(a)) { this._scAct(a, { ...ds }, el); return; }
      // Eltern-Aktionen stehen in der Eltern-Datei (wird bei Bedarf nachgeladen, in der Eltern-Ansicht ist sie schon da)
      if (FN_ACTS.has(a)) { this._fnAct(a, ds, el, e); return; }
      if (RB_ACTS.has(a)) { this._rbAct(a, { ...ds }, el, e); return; }
      if (ADM_ACTS.has(a)) { if (admOK) this._clickAdm(a, ds, el, e); else admLoad().then(() => this._clickAdm(a, ds, el, e), () => this._toast(T('⚠️ Der Eltern-Bereich konnte nicht geladen werden – liegt die Datei yippee-kids-chores-admin.js neben der Karte?'))); return; }
      switch (a) {
        case 'advopen': if (this._db.kid[ds.k]) { this._advKid = ds.k; this._render(); } break;
        case 'advclose': this._advKid = ''; this._render(); break;
        case 'mnopen': if (this._db.kid[ds.k]) { if (this._cfg.mnPin && (this._db.mk[ds.k] || {}).pin && !this._isParent() && !((this._mnOk || {})[ds.k] > Date.now())) { this._mnAct('mnpin', { ...ds }); break; } this._mnKid = ds.k; this._render(); } break;
        case 'mnclose': this._mnKid = ''; this._render(); break;
        case 'peopen': if (this._db.kid[ds.k]) { this._peKid = ds.k; this._render(); } break;
        case 'peclose': this._peKid = ''; this._render(); break;
        case 'kvtog': {
          this._kvOpen(ds.k, ds.x); const key = `${ds.k}:${ds.x}`;
          if (this._kvo.has(key)) this._kvo.delete(key); else this._kvo.add(key);
          try { localStorage.setItem('kpKv', JSON.stringify([...this._kvo])); } catch (e2) { /* egal */ }
          this._render(); break;
        }
        case 'kpage': { const kids = this._kids(), i = kids.findIndex((k) => k.id === ds.k), c = kids.indexOf(this._kPageCur(kids)); this._kPageGo(ds.k, i > c ? 1 : -1); break; }
        case 'lock': this._until = 0; this._wasOpen = false; this._closeModal(); this._render(); break;
        case 'tab': this._tab = ds.id; try { localStorage.setItem('kpTab', ds.id); } catch (e2) { /* egal */ } this._render(); break;
        case 'ktap': this._kidTap(ds.t, ds.k, e); break;
        case 'zgo': this._zStart(ds.t, ds.k); break;
        case 'tgo': this._tmrStart(ds.t, ds.k); break;
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
        case 'req': this._request(ds.r, ds.k, e); break;
        case 'ardm': this._parentRedeemDlg(ds.k); break;
        case 'ardo': {
          // erster Tipp fragt nach, zweiter löst ein (Dialog wird nicht neu gezeichnet)
          if (!el.dataset.sure) { el.dataset.sure = '1'; el.dataset.txt = el.textContent; el.textContent = T('Wirklich? {what}', { what: el.dataset.cost || '' }); setTimeout(() => { if (el.isConnected && el.dataset.sure) { delete el.dataset.sure; el.textContent = el.dataset.txt; } }, 8000); break; }
          this._parentRedeem(ds.r, ds.k, ds.m || 'one');
          break;
        }
        case 'shr': this._shareTap(ds.r, ds.k, ds.m, e); break;
        case 'bdgi': { const b = BADGES.find((x) => x[0] === ds.b), k = this._db.kid[ds.k]; if (b && k) this._toast(`${b[1]} ${T(b[2])} – ${b[3](k) ? T('✓ geschafft!') : T('noch nicht geschafft')}`); break; }
        case 'ledger': this._showLedger(ds.k); break;
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
        case 'fpick': { const box = el.closest('.mbox'); if (box) { box.querySelector('[name=emoji]').value = ds.e; box.querySelector('[name=title]').value = ds.t; box.querySelector('[name=cost]').value = ds.c; } break; }
        case 'acc': {
          this._accOpen = this._accOpen === ds.id ? '' : ds.id;
          this._accAnim = this._accOpen;
          this._render();
          this._accAnim = null;
          const h = this.shadowRoot.querySelector(`.acch[data-id="${ds.id}"]`);
          if (h && h.scrollIntoView) h.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          break;
        }
        case 'phview': { const u = this._photoUrl(ds.f); this._modal(T('📷 Foto-Nachweis'), u ? `<img class="phbig" src="${esc(u)}" alt="${esc(T('Foto'))}">` : `<div class="hint">${T('Foto wird geladen … bitte gleich nochmal antippen.')}</div>`, false, null); break; }
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
        case 'wish': this._wish(ds.k); break;
        case 'joker': this._jokerDlg(ds.k); break;
        case 'tkf': this._tkf = ds.k || ''; this._render(); break;
        case 'tkg': this._tkg = ds.m; try { localStorage.setItem('kpTkg', ds.m); } catch (e2) { /* egal */ } this._render(); break;
        case 'tkfold': { this._tkOpen(''); this._tkO[ds.id] = el.dataset.open !== '1'; try { localStorage.setItem('kpTkO', JSON.stringify(this._tkO)); } catch (e2) { /* egal */ } this._render(); break; }
        case 'kgrade': this._gradeDlg(ds.k, true); break;
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
    get HB() { return HB; }, get hbLoad() { return hbLoad; }, get scLoad() { return scLoad; }, get scOK() { return scOK; },
    get SA() { return SA; }, get SCHOOL() { return SCHOOL; },
    get AUTO_IDS() { return AUTO_IDS; }, get BG_V() { return BG_V; }, get OLD_IDS() { return OLD_IDS; }, get PUSH_GRP() { return PUSH_GRP; }, get pushTag() { return pushTag; },
    setTpl(o) { ({ REWARD_TEMPLATES, ROUT_STEPS, WIZ_TASKS, WIZ_REWARDS, TEMPLATES } = o); },
    setCss(c) { ADM_CSS = String(c || ''); (window.__kpCards || []).forEach((x) => { const st = x.shadowRoot && x.shadowRoot.getElementById('acss'); if (st && st.textContent !== ADM_CSS) st.textContent = ADM_CSS; }); },
    get APP_ID() { return APP_ID; }, get OLD_APP() { return OLD_APP; }, get SCRIPT_ID() { return SCRIPT_ID; }, get SEASONS() { return SEASONS; }, get dayNum() { return dayNum; }, get emoFix() { return emoFix; }, get hm() { return hm; }, get mdEsc() { return mdEsc; }, get pinHash() { return pinHash; }, get themeCols() { return themeCols; },
    get T() { return T; }, get esc() { return esc; }, get dk() { return dk; }, get shortDate() { return shortDate; }, get longDate() { return longDate; }, get TEMPLATES() { return TEMPLATES; }, get ROUT_STEPS() { return ROUT_STEPS; }, get uid() { return uid; }, get COLORS() { return COLORS; }, get hhmm() { return hhmm; }, get slug() { return slug; }, get hbNorm() { return hbNorm; }, get cv() { return cv; }, get yml() { return yml; }, get tplOk() { return tplOk; }, get WEEK() { return WEEK; }, get VERSION() { return VERSION; }, get REWARD_TEMPLATES() { return REWARD_TEMPLATES; }, get THEMES() { return THEMES; }, get levelOf() { return levelOf; }, get SET_KW() { return SET_KW; }, get LOGO() { return LOGO; }, get LEVELS() { return LEVELS; }, get LANGS() { return LANGS; }, get HB_TOPIC() { return HB_TOPIC; }, get GSCALES() { return GSCALES; }, get keyAdd() { return keyAdd; }, get hsh() { return hsh; }, get fullCols() { return fullCols; }, get euro() { return euro; }, get darkOf() { return darkOf; }, get contrast() { return contrast; }, get badgesOf() { return badgesOf; }, get addMin() { return addMin; }, get WIZ_TASKS() { return WIZ_TASKS; }, get WIZ_REWARDS() { return WIZ_REWARDS; }, get TRACK() { return TRACK; }, get SUBJECTS() { return SUBJECTS; }, get STATES() { return STATES; }, get SCHOOL_RX() { return SCHOOL_RX; }, get PREV_TPL() { return PREV_TPL; }, get PH_RX() { return PH_RX; }, get HOL_TYPES() { return HOL_TYPES; }, get HOL_RULES() { return HOL_RULES; }, get GRADE_COUNTRY() { return GRADE_COUNTRY; }, get COUNTRIES() { return COUNTRIES; }, get BADGES() { return BADGES; }, get emoOk() { return emoOk; }, get emoFix() { return emoFix; },
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
  // 📚 Lesetagebuch: eigene Datei (yippee-kids-chores-read.js) – nur geladen, wenn es eingeschaltet ist
  let rbP = null, rbOK = false, rbFail = 0;
  const RBY = { get T() { return T; }, get esc() { return esc; }, get dk() { return dk; }, get uid() { return uid; }, get keyAdd() { return keyAdd; }, get shortDate() { return shortDate; } };
  const rbLoad = () => {
    if (rbOK) return Promise.resolve(true);
    if (!rbP && Date.now() - rbFail < 30000) return Promise.reject(new Error('read missing'));
    if (!rbP) {
      const pre = typeof window.YippeeKidsChoresRead === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresRead }) : null;
      rbP = (pre || cardImport('yippee-kids-chores-read.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(YippeeCard, RBY); rbOK = true; return true; }, (e) => { rbP = null; rbFail = Date.now(); throw e; });
    }
    return rbP;
  };
  // 🎡📒🥚 Spaß & Sammeln: eigene Datei (yippee-kids-chores-fun.js) – nur geladen, wenn etwas davon eingeschaltet ist
  let fnP = null, fnOK = false, fnFail = 0;
  const FNY = {
    get T() { return T; }, get esc() { return esc; }, get dk() { return dk; }, get keyAdd() { return keyAdd; }, get shortDate() { return shortDate; }, get hsh() { return hsh; },
    get FN_ALB() { return FN_ALB; }, get LANG() { return LANG; }, get DAYS() { return DAYS; }, get cv() { return cv; }, get emoWatch() { return emoWatch; },
  };
  const fnLoad = () => {
    if (fnOK) return Promise.resolve(true);
    if (!fnP && Date.now() - fnFail < 30000) return Promise.reject(new Error('fun missing'));
    if (!fnP) {
      const pre = typeof window.YippeeKidsChoresFun === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresFun }) : null;
      fnP = (pre || cardImport('yippee-kids-chores-fun.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(YippeeCard, FNY); fnOK = true; return true; }, (e) => { fnP = null; fnFail = Date.now(); throw e; });
    }
    return fnP;
  };
  // 🧩 Zusatzfunktionen: eigene Datei (yippee-kids-chores-extras.js) – Aufgaben-Timer, Rückblick, Teilen, Einlösen durch Eltern, Foto-Nachweis, Sensoren …
  // Wird kurz nach dem Start im Hintergrund geladen; bis dahin springen Platzhalter ein (_exCall)
  let exP = null, exOK = false, exFail = 0;
  const EXY = {
    get addMin() { return addMin; }, get gz() { return gz; }, get hm() { return hm; },
    setEmo(o) { ({ TASK_EMOJI_GROUPS, REWARD_EMOJI_GROUPS } = o); },
    get mdEsc() { return mdEsc; },
    get keyAdd() { return keyAdd; },
    get LEVELS() { return LEVELS; }, get PH_RX() { return PH_RX; }, get T() { return T; }, get TRACK() { return TRACK; }, get VERSION() { return VERSION; }, get ZAPI() { return ZAPI; },
    get badgesOf() { return badgesOf; }, get cardImport() { return cardImport; }, get cv() { return cv; }, get dayDiff() { return dayDiff; }, get dk() { return dk; }, get esc() { return esc; },
    get euro() { return euro; }, get hbNorm() { return hbNorm; }, get hhmm() { return hhmm; }, get levelOf() { return levelOf; }, get longDate() { return longDate; }, get slug() { return slug; },
    get stamp() { return stamp; }, get tplOk() { return tplOk; }, get uid() { return uid; }, get zLoad() { return zLoad; },
    get LANG() { return LANG; }, get DAYS() { return DAYS; }, get MONTHS() { return MONTHS; }, get MON3() { return MON3; }, get TEMPLATES() { return TEMPLATES; }, get ZTPL() { return ZTPL; },
  };
  const exLoad = () => {
    if (exOK) return Promise.resolve(true);
    if (!exP && Date.now() - exFail < 30000) return Promise.reject(new Error('extras missing'));
    if (!exP) {
      const pre = typeof window.YippeeKidsChoresExtras === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresExtras }) : null;
      exP = (pre || cardImport('yippee-kids-chores-extras.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(YippeeCard, EXY); exOK = true; return true; }, (e) => { exP = null; exFail = Date.now(); throw e; });
    }
    return exP;
  };
  // 💰 Taschengeld: eigene Datei (yippee-kids-chores-money.js), wird nur geladen, wenn es eingeschaltet ist
  let mnP = null, mnOK = false, mnFail = 0;
  const MNY = {
    get T() { return T; }, get esc() { return esc; }, get dk() { return dk; }, get shortDate() { return shortDate; }, get uid() { return uid; }, get keyAdd() { return keyAdd; },
    get DAYS() { return DAYS; }, get LANG() { return LANG; }, get MN_CUR() { return MN_CUR; }, get VERSION() { return VERSION; }, get hsh() { return hsh; },
  };
  const mnLoad = () => {
    if (mnOK) return Promise.resolve(true);
    if (!mnP && Date.now() - mnFail < 30000) return Promise.reject(new Error('money missing'));
    if (!mnP) {
      const pre = typeof window.YippeeKidsChoresMoney === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresMoney }) : null;
      mnP = (pre || cardImport('yippee-kids-chores-money.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(YippeeCard, MNY); mnOK = true; return true; }, (e) => { mnP = null; mnFail = Date.now(); throw e; });
    }
    return mnP;
  };
  // 🐾 Haustier: eigene Datei (yippee-kids-chores-pet.js), wird nur geladen, wenn es eingeschaltet ist
  let peP = null, peOK = false, peFail = 0;
  const PET = {
    get T() { return T; }, get esc() { return esc; }, get dk() { return dk; }, get uid() { return uid; }, get hhmm() { return hhmm; }, get LEVELS() { return LEVELS; }, get levelOf() { return levelOf; },
    get LANG() { return LANG; }, get VERSION() { return VERSION; }, get BUILD() { return BUILD; }, get cardImport() { return cardImport; },
    get emoOk() { return emoOk; }, get emoFix() { return emoFix; },
  };
  const peLoad = () => {
    if (peOK) return Promise.resolve(true);
    if (!peP && Date.now() - peFail < 30000) return Promise.reject(new Error('pet missing'));
    if (!peP) {
      const pre = typeof window.YippeeKidsChoresPet === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresPet }) : null;
      peP = (pre || cardImport('yippee-kids-chores-pet.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(YippeeCard, PET); peOK = true; return true; }, (e) => { peP = null; peFail = Date.now(); throw e; });
    }
    return peP;
  };
  // 📺 Bildschirmzeit: eigene Datei (yippee-kids-chores-screen.js)
  let scP = null, scOK = false, scFail = 0;
  const SCR = { get T() { return T; }, get esc() { return esc; }, get uid() { return uid; }, get VERSION() { return VERSION; } };
  const scLoad = () => {
    if (scOK) return Promise.resolve(true);
    if (!scP && Date.now() - scFail < 30000) return Promise.reject(new Error('screen missing'));
    if (!scP) {
      const pre = typeof window.YippeeKidsChoresScreen === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresScreen }) : null;
      scP = (pre || cardImport('yippee-kids-chores-screen.js', (m) => m && typeof m.default === 'function'))
        .then((m) => { m.default(YippeeCard, SCR); scOK = true; return true; }, (e) => { scP = null; scFail = Date.now(); throw e; });
    }
    return scP;
  };
  // ✏️ Karten-Editor: eigene Datei (yippee-kids-chores-editor.js)
  let edP = null;
  const EDY = { get LANGS() { return LANGS; }, get T() { return T; }, get THEMES() { return THEMES; }, get emoWatch() { return emoWatch; }, get esc() { return esc; } };
  const edLoad = () => {
    if (customElements.get('yippee-kids-chores-card-editor')) return Promise.resolve(true);
    if (!edP) {
      const pre = typeof window.YippeeKidsChoresEditor === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresEditor }) : null;
      edP = (pre || cardImport('yippee-kids-chores-editor.js', (m) => m && typeof m.default === 'function')).then((m) => m.default(EDY), (e) => { edP = null; throw e; });
    }
    return edP;
  };
  if (typeof window.YippeeKidsChoresEditor === 'function') edLoad(); // schon mitgeliefert (z. B. Testseite)
  const hbNorm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss');
  // Übersetzungen: siehe yippee-kids-chores-lang-xx.js (eigene Dateien neben der Karte)
  if (!customElements.get('yippee-kids-chores-card')) customElements.define('yippee-kids-chores-card', YippeeCard);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === 'yippee-kids-chores-card')) {
    window.customCards.push({ type: 'yippee-kids-chores-card', name: 'Yippee! - Kids Chores', description: T('Aufgaben abhaken, Punkte sammeln, Belohnungen einlösen – Eltern- und Kinder-Ansicht'), preview: false });
  }
  console.info(`%c YIPPEE! - KIDS CHORES %c v${VERSION} · ${BUILD} `, 'background:#5b6cff;color:#fff;font-weight:700', 'background:#ffd43b;color:#000;font-weight:700');
})();
