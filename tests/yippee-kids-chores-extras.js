/*
 * Yippee! - Kids Chores – Zusatzfunktionen (Aufgaben-Timer, Monats-/Jahresrückblick, gemeinsames Sparen, Einlösen durch Eltern, Foto-Nachweis,
 * Routinen-Fenster, Joker, Wunschliste, Vorlesen, Geburtstags-Party, Sensoren für Home Assistant, Prüfungen im Hintergrund)
 * Eigene Datei, damit die Karte selbst klein bleibt und schneller startet: sie wird kurz nach dem Start im Hintergrund nachgeladen.
 * Gehört zu yippee-kids-chores-card.js (gleiche Version) – https://github.com/Chrism1412/yippee-kids-chores-card · Lizenz: MIT
 */
export default function install(C, Y) {
  // Hilfen und Tabellen aus der Karte (veränderliche Werte wie Sprache und Monatsnamen werden über Y.… live gelesen)
  const { LEVELS, PH_RX, T, TRACK, VERSION, ZAPI, badgesOf, cardImport, cv, dayDiff, dk, esc, euro, hbNorm, hhmm, levelOf, longDate, slug, stamp, tplOk, uid, zLoad, ZTPL, keyAdd, mdEsc, addMin, gz, hm } = Y;
  // Emoji-Auswahl in Gruppen (Aufgaben, Belohnungen, Wünsche, Sparziel): [Überschrift, Emojis] – alle Emojis, die die Karte selbst
  // verwendet (Vorlagen, Haustier, Spiele, 🪙 Taler …), sind dabei; neuere Emojis haben auf älteren Geräten einen Ersatz (emoFix). Die Karte zeigt sie im Emoji-Feld der Fenster.
  const TASK_EMOJI_GROUPS = [['🧼 Körperpflege & Anziehen', ['🦷', '🚿', '🛁', '🧼', '🧴', '🧽', '💇', '💅', '🚽', '🧻', '👕', '👚', '👖', '👗', '🧦', '👟', '👞', '🥾', '🧥', '🧤', '🧣', '🧢', '👒', '🎒', '🛏️', '😴', '💤', '⏰', '🧖', '🛌', '🧷', '👓', '🕶️', '⌚', '🥿', '👢', '👡', '👘', '🌂', '☂️', '💆', '🧔', '🧑', '💄']], ['🍽️ Essen & Küche', ['🥣', '🍳', '🍽️', '🍴', '🥄', '🔪', '🍱', '🥪', '🥕', '🥦', '🥒', '🍅', '🍎', '🍌', '🍓', '🍇', '🥛', '🧀', '🥚', '🍞', '🥐', '🥖', '🥗', '🍝', '🍲', '🍜', '🥘', '🍚', '🍕', '🥧', '🍰', '🧁', '🍪', '🥤', '🚰', '☕', '🍯', '🧂', '🥫', '🥯', '🥨', '🥞', '🥓', '🍗', '🍖', '🌭', '🍔', '🍟', '🌮', '🌯', '🥙', '🍛', '🍣', '🍤', '🍙', '🍘', '🥟', '🥠', '🥡', '🍦', '🍉', '🍊', '🍋', '🍐', '🍑', '🍒', '🍍', '🥝', '🥥', '🥭', '🥑', '🍆', '🌽', '🌶️', '🥔', '🥜', '🌰', '🍄', '🥬', '🍵', '🍼', '🥢', '🥮', '🍩', '🍫', '🍬', '🍿', '🍭', '🫐', '🧃', '🧇', '🧈', '🧋', '🫖', '🫑', '🧄', '🍨', '🍧', '🍹', '🍮', '🍡', '🍢', '🧅']], ['🧹 Haushalt', ['🧹', '🧺', '🗑️', '♻️', '❄️', '🚪', '🛋️', '🏠', '🏡', '🔑', '📦', '🧸', '🖼️', '💡', '🔌', '🔋', '🧯', '🌬️', '♨️', '✨', '🧵', '🧶', '👔', '📬', '📮', '🛒', '🛍️', '🧾', '💶', '💰', '🐖', '🗄️', '🛢️', '🧳', '📂', '🗂️', '🖨️', '🌡️', '🕯️', '🔦', '🔒', '🔓', '🗝️', '🛠️', '⚙️', '🧲', '🧱', '🧰']], ['🎒 Schule & Lernen', ['📝', '📚', '📖', '📓', '📒', '📏', '📐', '✏️', '🖊️', '🖍️', '🖌️', '✂️', '📎', '📋', '🔢', '🔤', '🗣️', '🧮', '🔬', '🔭', '🧪', '🌍', '🗺️', '💻', '⌨️', '🖥️', '📅', '🗓️', '🎓', '🏫', '📕', '📗', '📘', '📙', '📔', '📄', '📃', '📑', '🗒️', '📁', '🖇️', '📌', '📍', '🖋️', '✒️', '📊', '📈', '🧠', '👩‍🏫', '👨‍🏫', '🔠', '🔡', '➕', '➖', '✖️', '➗', '🌐', '🧭', '🔍', '🔎', '📰', '🏛️', '🗞️']], ['⚽ Sport, Musik & Hobby', ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🏒', '⛸️', '🎿', '🛷', '🏊', '🚴', '🏃', '🧘', '🤸', '🏋️', '🥋', '🧗', '🛹', '🚲', '🛴', '🎹', '🎸', '🥁', '🎻', '🎺', '🎷', '🎤', '🎨', '🧩', '♟️', '🎲', '📷', '🥅', '⛳', '🏹', '🎣', '🥊', '🤾', '🤽', '🚣', '🏄', '⛷️', '🏂', '🛶', '🤺', '🏇', '🤹', '🎭', '🎬', '🎮', '🕹️', '🎳', '🥌', '🥏', '🥍', '🏏', '🏑', '🥎', '🎼', '🎵', '🎶', '🎙️', '🎽', '🎠', '🎢', '🎪', '🎡', '🪁', '🪀', '🛝', '🛼', '🎥', '🎴', '🎰', '🎫', '🏎️', '🎩']], ['🐾 Tiere, Garten & Wetter', ['🐶', '🐕', '🐱', '🐈', '🐹', '🐰', '🐭', '🐦', '🐤', '🐔', '🐴', '🐢', '🐠', '🐟', '🦜', '🐞', '🐝', '🦋', '🐌', '🐾', '🌱', '🌿', '🍀', '🌻', '🌷', '🌳', '🍂', '🍁', '🌾', '🚜', '💧', '🌧️', '☀️', '⛄', '🐩', '🐇', '🐁', '🐿️', '🦔', '🐓', '🐣', '🐥', '🦆', '🦢', '🦉', '🐸', '🐍', '🦎', '🐛', '🐜', '🦗', '🐙', '🦀', '🦐', '🐡', '🐳', '🐬', '🐄', '🐐', '🐑', '🌸', '🌹', '🌺', '🌼', '💐', '🌵', '🌲', '🍃', '⛅', '🌤️', '🌦️', '⛈️', '🌩️', '🌨️', '☃️', '🌈', '🌙', '🐷', '🌞', '🦊', '🐻', '🐼', '🦁', '🐯', '🐨', '🦄', '🐧', '🦖', '🐮', '🐵', '🦈', '🦕', '🦒', '🦓', '🦝', '🦙', '🦘', '🐲', '🐺', '🦌', '🦚', '🐒', '🦍', '🐘', '🦏', '🦛', '🐪', '🐫', '🐊', '🦑', '🐉', '🦡', '🦃', '🌇', '💨', '🐀', '🪶', '🦩', '🪵', '🪴', '🦮', '🦭', '🦫', '🪲', '🪱', '🌊', '🌌', '☄️', '🌋', '🐅', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌛', '🌜', '🌠', '🐋', '🐚', '🦞', '☁️', '🌉', '🕷️', '🌴', '🌪️', '💦', '🪷', '🌫️']], ['🚗 Unterwegs & Technik', ['🚗', '🚙', '🚌', '🚶', '🚸', '🚦', '🏪', '🏥', '⛽', '🔧', '🔨', '📱', '📵', '📺', '🎧', '📸', '🚕', '🚓', '🚑', '🚒', '🚐', '🚚', '🏍️', '🛵', '✈️', '🚆', '🚇', '🚊', '🚢', '⛵', '🏬', '🏦', '⛪', '🏟️', '💾', '💿', '📡', '☎️', '📲', '💬', '🔊', '🔇', '🔕', '🚂', '🛸', '🏰', '🛡️', '🛻', '🏕️', '🏔️', '🏝️', '🏞️', '🚤', '🚁', '🚠', '🚡', '🚞', '🚎', '🚛', '🛰️', '⚓', '🛥️', '🏜️', '🚉']], ['❤️ Familie & Miteinander', ['👶', '👧', '👦', '👩', '👨', '👵', '👴', '👪', '🤝', '🙏', '❤️', '💌', '🎁', '🎉', '😊', '🤗', '👍', '💪', '🙋', '📞', '✉️', '🧒', '🧓', '👫', '👬', '👭', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👩‍👧', '👨‍👧', '👩‍👦', '👨‍👦', '💕', '💖', '💗', '💝', '🥰', '😘', '👋', '🙌', '👏', '✋', '🤲', '🗨️', '💭', '🥳', '🎂', '🎈', '👸', '🤴', '🧚', '🧜', '🧙', '👽', '👱', '👲', '🧕', '👳', '👮', '👷', '💂', '🧛', '🧝', '🧞', '🧟', '👁️', '👼', '💛', '👀', '💔', '💜', '🦶', '👂', '👃', '👄', '💃', '✍️', '🦵']], ['🎉 Feste & Jahreszeiten', ['🎄', '🎅', '🤶', '🎃', '👻', '🦇', '🏖️', '🎆', '🎇', '🧨', '🎊', '🏮', '🎏', '🎐', '🧧', '🌅', '🎀', '🎎']], ['😊 Gesichter & Gefühle', ['😀', '😃', '😄', '😁', '😆', '😂', '🤣', '🙂', '😉', '😇', '😍', '🤩', '😎', '🤓', '🧐', '🤔', '😢', '😭', '😡', '😤', '😱', '😳', '🤭', '🤫', '😋', '😜', '🤪', '😌', '🙃', '😬', '🥺', '👎', '🤞', '✌️', '🤘', '🤖', '🤡', '🤠', '😺', '😸', '🙈', '😠', '🫧', '🫶', '🥹', '🥱', '😶', '😨', '🤒', '🥶', '🥵', '🙆', '😮', '🤚']], ['⭐ Sonstiges', ['⭐', '🌟', '🎯', '✅', '🔔', '🏆', '🥇', '🎖️', '💎', '🔥', '🚀', '⚠️', '❗', '❓', '💯', '🆗', '🆕', '🔄', '⏳', '⌛', '🕐', '🏁', '🚩', '🎗️', '🏅', '🥈', '🥉', '👑', '💫', '⚡', '🌀', '🔮', '🧿', '🎱', '🦸', '🦹', '🕵️', '🎟️', '🃏', '🕙', '⛺', '🩺', '📜', '♿', '📨', '🕒', '🏷️', '👥', '👤', '📉', '🔈', '📤', '📴', '💽', '👆', '🪙', '💸', '⚖️', '📯', '✔️', '❌', '🔗', '🪥', '🪨', '🗿', '🪄', '🪩', '🦺', '🪅', '🪆', '🪣', '🪜', '🪛', '🪚', '🪒', '🪟', '🛟', '🆘', '⛔', '📶', '📻', '🎞️', '📽️', '📀', '🀄', '🗻', '⛰️', '🗼', '🗽', '🕗', '🕘', '🕚', '🕛', '👜', '💍', '🦴', '🏴‍☠️', '🔟', '🪑', '🩳', '💥', '⚔️', '🕰️', '💱']]];
  const REWARD_EMOJI_GROUPS = [['🍦 Leckereien', ['🍦', '🍨', '🍧', '🍫', '🍭', '🍬', '🍰', '🎂', '🧁', '🍩', '🍪', '🥞', '🍕', '🍔', '🍟', '🌭', '🌮', '🌯', '🍝', '🍣', '🥨', '🍿', '🥤', '🍹', '🍓', '🍉', '🥧', '🍮', '🍯', '🥛', '🍒', '🍌', '🍍', '🥥', '🥐', '🧀', '🍗', '🍖', '🍜', '🍛', '🍤', '🥟', '🥠', '🍙', '🍡', '🍢', '🥮', '🥯', '🍵', '🍳', '🥭', '🍇', '🍎', '🍊', '🥣', '🍱', '🍽️', '🥪', '🍴', '🥕', '🥗', '🍲', '🥖', '🥦', '🍞', '🥚', '☕', '🥜', '🫐', '🧃', '🧇', '🧈', '🧋', '🫖', '🫑', '🧄', '🥒', '🍅', '🥘', '🍚', '🧂', '🥫', '🥓', '🥙', '🍘', '🥡', '🍋', '🍐', '🍑', '🥝', '🥑', '🍆', '🥔', '🥬', '🍼', '🥢', '🧅']], ['🎮 Medien & Spiele', ['📺', '🎮', '🕹️', '📱', '💻', '🎧', '🎬', '🎥', '📚', '📖', '🎲', '🧩', '♟️', '🃏', '🎳', '🎯', '🧸', '🎈', '🎤', '🎵', '📻', '🎙️', '📷', '📸', '🎞️', '📽️', '🎼', '🎹', '💿', '📀', '🎴', '🀄', '🎱', '🛹', '🎨', '🎰', '📋']], ['🎢 Ausflüge & Erlebnisse', ['🎢', '🎡', '🎠', '🎪', '🎟️', '🎫', '🏊', '🏖️', '🏕️', '⛺', '🧗', '⛸️', '🛷', '🎿', '🚲', '🛶', '🐴', '🦁', '🐘', '🦒', '🐬', '🦖', '🏰', '🌳', '🏔️', '🚗', '🚂', '✈️', '🚀', '🌍', '🏝️', '🏞️', '🗻', '🌋', '⛰️', '🏟️', '🏛️', '🗼', '🗽', '🎭', '🚤', '⛵', '🚁', '🚠', '🚡', '🚞', '🐒', '🐼', '🐨', '🐯', '🐧', '🦓', '🐅', '🦈', '🐙', '🦕', '🎣', '🚴', '🏇', '🏄', '🚒', '🏫', '🛸', '🚽', '🚿', '🚰', '🚌', '🚪', '🚜', '🛢️', '🚙', '🚶', '🧭', '🗺️', '🛡️', '⛪', '🚩', '🛻', '🚚', '🛠️', '🚣', '🚸', '🚦', '🏪', '🏥', '⛽', '🚕', '🚓', '🚑', '🚐', '🛵', '🚆', '🚇', '🚊', '🚢', '🏬', '🏦', '🏮', '🚎', '🚛', '🛰️', '⚓', '🛥️', '🏜️', '🚉']], ['🌙 Zeit & Freiheiten', ['🌙', '😴', '💤', '🛏️', '⏰', '🕙', '👫', '👪', '🤗', '💬', '🎉', '🎊', '🏠', '🕗', '🕘', '🕚', '🕛', '⏳', '⌛', '🛌', '📵', '🙋', '🗣️', '👨‍👩‍👧', '👨‍👩‍👦', '👩‍👧', '🏡', '🛋️', '🧘']], ['🎨 Kreatives & Musik', ['🖍️', '✂️', '🧶', '🎸', '🥁', '🎻', '🎺', '🌻', '🖌️', '✏️', '📐', '🧵', '🧷', '🎶', '🎷', '🔨', '🧱']], ['⚽ Sport & Bewegung', ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏓', '🏸', '🥅', '⛳', '🏹', '🛴', '🤸', '🏂', '🥋', '🤾', '🎽', '🥄', '🏃', '🏁', '🪁', '🪀', '🛝', '🛼', '⛷️', '🏒', '🏋️', '🥊', '🤽', '🤺', '🥌', '🥏', '🥍', '🏏', '🏑', '🏍️', '🥈', '🥉', '🏎️', '🎩']], ['🐾 Tiere & Fantasie', ['🐰', '🐹', '🐭', '🐮', '🐷', '🐸', '🐵', '🐔', '🐦', '🦉', '🦋', '🐞', '🐢', '🐳', '🐉', '🐲', '🧚', '🧜', '🧞', '🧙', '🦸', '🤖', '👽', '👻', '🐾', '🦊', '🐻', '🐝', '🦔', '🦝', '🦙', '🦘', '🐺', '🦌', '🐿️', '🦜', '🦚', '⛄', '🌞', '🦍', '🦏', '🦛', '🐪', '🐫', '🐇', '🐥', '🐣', '🦆', '🦢', '🐊', '🐍', '🦎', '🦑', '🦀', '🐡', '🐟', '🐌', '🐛', '🐜', '🦗', '🦡', '🐩', '🐈', '🐕', '🐓', '🦃', '🐑', '🐐', '🐄', '🌸', '🍀', '⚡', '🔥', '🍄', '🌵', '❄️', '🌬️', '💧', '🌅', '☀️', '✨', '🌱', '🌿', '🍂', '🌾', '🌐', '🌇', '🌦️', '☃️', '🌨️', '🌰', '🌲', '💨', '🐀', '🦇', '🪶', '🦩', '🪵', '🪴', '🦮', '🦭', '🦫', '🪲', '🪱', '🌊', '🌌', '☄️', '🌂', '☂️', '🌽', '🌶️', '🌡️', '🐤', '🌷', '🍁', '🌧️', '🐁', '🦐', '🌹', '🌺', '🌼', '🍃', '⛅', '🌤️', '⛈️', '🌩️', '🌀', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌛', '🌜', '🌠', '🐋', '🐚', '🦞', '☁️', '🌉', '🕷️', '🌴', '🌪️', '💦', '🪷', '🌫️']], ['😊 Gesichter & Gefühle', ['💝', '👧', '👦', '🧒', '👸', '🤴', '👩', '👨', '🧑', '👱', '👶', '🧔', '👲', '🧕', '👳', '👮', '👷', '💂', '🧛', '🧝', '🧟', '🤡', '🤠', '😺', '😸', '😎', '🤓', '🥳', '😇', '💇', '🧖', '👩‍🏫', '❤️', '🤫', '🤝', '🙏', '🙂', '👁️', '🙈', '👍', '😊', '😠', '👋', '✋', '🤶', '😂', '👼', '💛', '🙌', '👀', '💔', '🫧', '🫶', '🥹', '🥺', '🥱', '💜', '😀', '💅', '💆', '💄', '👨‍🏫', '🤹', '👵', '👴', '💪', '🧓', '👬', '👭', '👨‍👩‍👧‍👦', '👨‍👧', '👩‍👦', '👨‍👦', '💕', '💖', '💗', '🥰', '😘', '👏', '🤲', '😃', '😄', '😁', '😆', '🤣', '😉', '😍', '🤩', '🧐', '🤔', '😢', '😭', '😡', '😤', '😱', '😳', '🤭', '😋', '😜', '🤪', '😌', '🙃', '😬', '👎', '🤞', '✌️', '🤘', '😶', '🦶', '👂', '👃', '👄', '💃', '✍️', '😨', '🤒', '🥶', '🥵', '🦵', '🙆', '😮', '🤚']], ['🎉 Feste & Jahreszeiten', ['🎀', '🎒', '🧧', '🎃', '🎄', '🎓', '🎅', '🕯️', '🎆', '🎇', '🎏', '🎎', '🧨', '🎐']], ['🎁 Geschenke & Sonstiges', ['🪙', '🎁', '💶', '💰', '🐖', '👟', '👕', '👗', '🧢', '🛍️', '👑', '⭐', '🌟', '💎', '🏆', '🥇', '🦄', '🐶', '🐱', '🐠', '🌈', '👜', '👓', '🕶️', '⌚', '💍', '👒', '🏅', '🎖️', '📜', '🗝️', '💌', '🛒', '🛁', '🦹', '🕵️', '🔬', '🦷', '👚', '🧼', '📝', '✅', '🗑️', '🧹', '🧺', '🧴', '🧽', '🧥', '🧦', '🔢', '🔑', '📒', '🧮', '📂', '♻️', '🧾', '📦', '🧻', '🗄️', '👔', '♨️', '📬', '🔧', '📅', '🧳', '☎️', '💡', '🔌', '👖', '⚙️', '⚠️', '🗓️', '🔔', '📊', '🩺', '🔒', '📏', '🔠', '♿', '📨', '➖', '📈', '💾', '🔎', '🔮', '🕐', '📌', '🕒', '🏷️', '👥', '👤', '🔤', '📉', '🔊', '🔈', '📄', '📤', '📴', '💽', '👆', '✖️', '🧠', '💸', '⚖️', '🗂️', '📍', '❓', '🧣', '🧤', '💫', '📯', '✉️', '🖼️', '📁', '✔️', '❌', '🧪', '🔗', '🔍', '🪥', '🪨', '🗿', '🪄', '🪩', '🦺', '🪅', '🪆', '🪣', '🪜', '🪛', '🪚', '🪒', '🪟', '🛟', '🆘', '💯', '⛔', '📶', '📕', '📗', '📘', '📙', '📓', '📔', '⌨️', '👞', '🥾', '🥿', '👢', '👡', '👘', '🔪', '🔋', '🧯', '📮', '🖨️', '🔦', '🔓', '🧲', '🧰', '🖊️', '📎', '🔭', '🖥️', '📃', '📑', '🗒️', '🖇️', '🖋️', '✒️', '🔡', '➕', '➗', '📰', '🗞️', '💐', '📡', '📲', '🔕', '📞', '🗨️', '💭', '❗', '🆗', '🆕', '🎗️', '🧿', '🦴', '🏴‍☠️', '🔟', '🪑', '🩳', '💥', '⚔️', '🕰️', '💱']]];
  if (Y.setEmo) Y.setEmo({ TASK_EMOJI_GROUPS, REWARD_EMOJI_GROUPS });
  class M {
    _abCheck() {
      const c = this._cfg;
      if (c.abOn === false || window.__kpAbBusy || !this._kids().length || this._dchk || (this._dchkRuns || 0) < 2 || (this._badKeys || new Set()).size) return;
      const days = Number(c.abDays) || 7, today = dk(new Date());
      // Vor Updates sichern: einmal je neuer Version (abV)
      if (c.abUpd !== false) {
        let v = ''; const prev = String(c.abV || '');
        try { const i = this._updInfo(); if (i.avail) v = `vor ${i.avail}`; } catch (e) { v = ''; }
        if (!v && (!prev || this._vnum(prev) < this._vnum(VERSION))) v = VERSION; // neue Version läuft, vorher keine Sicherung
        if (v && prev !== v) {
          this._setCfg({ abV: v });
          this._abMake(true, true).then((ok) => { if (ok) this._audit(v.startsWith('vor ') ? T('🛡️ Sicherung vor dem Update auf {v} angelegt', { v: v.slice(4) }) : T('🛡️ Sicherung beim ersten Start von {v} angelegt', { v })); });
          return;
        }
      }
      const last = Object.keys(this._db.bak).sort().pop();
      if (c.ab2) this._bk2Load();
      const need2 = c.ab2 && this._bk2 && this._bk2.ent === c.ab2 && !this._bk2.err && !Object.keys(this._bk2.m).some((x) => dayDiff(x, today) < days);
      if (last && dayDiff(last, today) < days && !need2) return;
      this._abMake(false);
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

    // 🔎 Suchfeld unter „Alle Einstellungen“: blendet Abschnitte (und leere Gruppen) aus, die nicht passen
    // 🧩 Kachel-Übersicht wie bei ⚙️ Einstellungen für die Reiter 🐾, 💰, 🦷 und 🎄: .hubw[data-hub] > .hubs[data-hid] (je mit <h3>)
    // Antippen öffnet einen Abschnitt, „←“ zurück, 🔎 sucht in allen Abschnitten. Zustand je Reiter bleibt beim Neuzeichnen erhalten.
    _hubApply(root, key) {
      const w = root && root.querySelector(`.hubw[data-hub="${key}"]`); if (!w || w.querySelector(':scope > .hubtop')) return;
      const secs = [...w.children].filter((x) => x.classList.contains('hubs')); if (secs.length < 2) return;
      const S = (this._hubS = this._hubS || {})[key] || (this._hubS[key] = { g: '', q: '', f: false });
      if (S.g && !secs.some((x) => x.dataset.hid === S.g)) S.g = '';
      const plain = (x) => String(x || '').replace(/\s+/g, ' ').replace(/^[^\p{L}\p{N}]+/u, '').trim();
      // Kurzinfo: die ersten Einstellungen des Abschnitts (Text vor Auswahl, Häkchen-Text ohne Erklärung)
      const lbl = (el) => { for (const n of el.childNodes) { const t = n.nodeType === 3 ? n.textContent : ['SPAN', 'B'].includes(n.tagName) ? (n.firstChild && n.firstChild.nodeType === 3 ? n.firstChild.textContent : '') : ''; if (plain(t)) return plain(t); } return ''; };
      const tile = (s) => {
        const h3 = s.querySelector('h3'), full = h3 ? [...h3.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim() : '', h = plain(full), sp = full.indexOf(' ');
        const ico = sp > 0 && !/[\p{L}\p{N}]/u.test(full.slice(0, sp)) ? full.slice(0, sp) : '⚙️';
        const names = [...new Set([...s.querySelectorAll('label, .sect span, .row .l, summary span')].map(lbl).filter((x) => x && x.length < 60))];
        if (!names.length) { const d = plain((s.querySelector('.hint') || {}).textContent || ''); if (d) names.push(d.length > 70 ? `${d.slice(0, 68).replace(/\s\S*$/, '')} …` : d); }
        // Schalter: Häkchen (Karte) oder role="switch" (🦷 Zähne)
        const cb = [...s.querySelectorAll('input[type=checkbox], [role=switch]')], on = cb.filter((x) => x.checked || x.getAttribute('aria-checked') === 'true').length, n = s.querySelectorAll('select, input:not([type=checkbox]):not([type=hidden]):not([type=file]), textarea').length;
        const em = cb.length ? T('{on} von {n} an', { on, n: cb.length }) : n > 1 ? T('{n} Einstellungen', { n }) : '';
        return `<button type="button" class="hubt" data-hid="${esc(s.dataset.hid)}"><i>${esc(ico)}</i><b>${esc(h)}</b><small>${esc(names.slice(0, 3).join(' · ') + (names.length > 3 ? ' …' : ''))}</small>${em ? `<em>${esc(em)}</em>` : ''}</button>`;
      };
      const top = document.createElement('div'); top.className = 'hubtop';
      top.innerHTML = `<style>.hubtop{display:grid;gap:8px;margin:4px 0 10px}.hubq{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:10px 14px;border-radius:14px;border:1px solid var(--ln,rgba(127,127,127,.3));background:var(--soft,rgba(127,127,127,.09));color:inherit}
.hubtl{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}.hubt{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:12px 12px 10px;border-radius:16px;border:1px solid var(--ln,rgba(127,127,127,.25));background:var(--soft,rgba(127,127,127,.09));color:inherit;font:inherit;cursor:pointer;min-height:118px}
.hubt:hover,.hubt:focus-visible{border-color:var(--ac,var(--primary-color,#5b6cff))}.hubt i{font-style:normal;font-size:28px;line-height:1.1}.hubt b{font-size:15px;line-height:1.2}.hubt small{color:var(--mu,var(--secondary-text-color,#6b7280));font-size:12px;line-height:1.3;flex:1}.hubt em{font-style:normal;font-size:12px;font-weight:800;color:var(--ac,var(--primary-color,#5b6cff))}
.hubback{justify-self:start;padding:8px 14px;border-radius:12px;border:1px solid var(--ln,rgba(127,127,127,.25));background:var(--soft,rgba(127,127,127,.09));color:inherit;font:inherit;font-weight:700;cursor:pointer}.hubnone{padding:12px;text-align:center;opacity:.7}</style>
        <input type="search" class="hubq" enterkeyhint="search" autocomplete="off" placeholder="${esc(T('🔎 Einstellungen durchsuchen …'))}" aria-label="${esc(T('🔎 Einstellungen durchsuchen …'))}" value="${esc(S.q)}">
        <div class="hubtl">${secs.map(tile).join('')}</div><button type="button" class="hubback">← ${esc(T('Alle Einstellungen'))}</button><div class="hubnone" hidden>${esc(T('Keine passende Einstellung gefunden.'))}</div>`;
      w.insertBefore(top, secs[0]);
      const txt = secs.map((s) => hbNorm(s.textContent || ''));
      const upd = () => {
        const q = hbNorm(S.q || '').split(/\s+/).filter(Boolean); let n = 0;
        secs.forEach((s, i) => { const hit = q.length ? q.every((x) => txt[i].includes(x)) : S.g === s.dataset.hid; s.hidden = !hit; if (hit) n++; });
        top.querySelector('.hubtl').hidden = !!q.length || !!S.g;
        top.querySelector('.hubback').hidden = !!q.length || !S.g;
        top.querySelector('.hubnone').hidden = !q.length || n > 0;
      };
      top.addEventListener('click', (e) => {
        const b = e.target.closest && e.target.closest('.hubt, .hubback'); if (!b) return;
        e.stopPropagation(); S.g = b.classList.contains('hubt') ? b.dataset.hid : ''; upd();
        if (top.getBoundingClientRect().top < 0) top.scrollIntoView({ block: 'start' });
      });
      const q = top.querySelector('.hubq');
      q.addEventListener('input', () => { S.q = q.value; upd(); });
      q.addEventListener('focus', () => { S.f = true; }); q.addEventListener('blur', () => { S.f = false; });
      upd();
      if (S.f) { q.focus(); try { q.setSelectionRange(q.value.length, q.value.length); } catch (e) { /* egal */ } }
    }

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
      // 🧩 Kacheln: ohne Suchtext Kacheln bzw. nur die gewählte Gruppe, mit Suchtext immer alle Gruppen
      const tl = !!r.querySelector('.settiles'), g = tl && !w.length ? this._setG : null;
      if (tl) {
        r.querySelector('.settiles').hidden = !!w.length || this._setG != null;
        const back = r.querySelector('.setback'); if (back) back.hidden = !!w.length || this._setG == null;
        const aw = r.querySelector('.accw'); if (aw) aw.hidden = !w.length && this._setG == null;
      }
      let grp = null, any = false;
      const fin = () => { if (grp) grp.hidden = !any; };
      r.querySelectorAll('.accw > .accgrp, .accw > .acc').forEach((el) => {
        if (el.classList.contains('accgrp')) { fin(); grp = el; any = false; return; }
        const hit = w.length ? show.has(el) : g == null || Number(el.dataset.g) === g;
        el.hidden = !hit; if (hit) any = true;
      });
      fin();
      const none = r.querySelector('.setnone'); if (none) none.hidden = show.size > 0 || !w.length;
      const more = r.querySelector('.setmore');
      if (more) { const k = w.length && strong.size && !this._setMore ? weak.length : 0; more.hidden = !k; more.textContent = T('🔎 {n} weitere Treffer im Text anzeigen', { n: k }); }
    }

    _filterTpl(box) {
      if (!box) return;
      const all = box.querySelector('[data-a="tplall"]');
      const showAll = all && all.checked;
      const sel = [...box.querySelectorAll('[name=kid]:checked')].map((c) => this._db.kid[c.value]).filter((k) => k && this._age(k) !== null);
      const qs = String((box.querySelector('[name=tplq]') || {}).value || '').trim().toLowerCase();
      box.querySelectorAll('.qp[data-i]:not([data-rt])').forEach((q) => { // Routinen-Vorlagen (nur 11) immer alle zeigen
        const tp = Y.TEMPLATES[Number(q.dataset.i)];
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

    // Freispiele gutschreiben (mit frischem Stand zusammengeführt)

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

    _pool(rid) { return Object.values(this._db.req).find((q) => q.pool && q.reward === rid); }

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

    _rcpMark(kid, key) { try { localStorage.setItem(`kpRcp:${this._config.storage}:${kid}`, key); } catch (e) { /* egal */ } }
    // Verfügbare Rückblicke: letzter Monat (immer, wenn Daten da sind) und im Januar das Vorjahr

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
        if (this._mnOn() && this._cfg.mnRcp !== false) { const m = this._mnMonth(kid, r.key); if (m.inn || m.out) cards.push(card('💰', esc(this._mnFmt(m.inn - m.out)), T('gespart ({inn} rein · {out} raus)', { inn: esc(this._mnFmt(m.inn)), out: esc(this._mnFmt(m.out)) }))); }
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
    // 🎮 Spiel als Aufgabe (nur mit eingeschaltetem 🐾 Haustier)
    // Spiel-Aufgabe „Wie oft spielbar“: danach nur üben (ohne Sterne)

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

    _tmrLeft() { const s = this._kt; if (!s) return 0; const run = s.acc + (s.paused ? 0 : Date.now() - s.from); return Math.max(0, s.dur - run); }

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

    _tmrStart(tid, kidId) {
      const t = this._db.task[tid], k = this._db.kid[kidId], cf = this._tmr(t);
      if (!t || !k || !cf) return;
      if (this._kt && this._kt.el && this._kt.el.isConnected) return;
      const el = document.createElement('div');
      // In der Home-Assistant-App auf Android liegen die Navigationstasten über der Seite → unten Platz lassen (Sicherheitsabstand)
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

    _tmrStop() {
      const s = this._kt; if (!s) return;
      clearInterval(s.iv);
      if (s.audio) { try { s.audio.pause(); s.audio.src = ''; } catch (e) { /* egal */ } }
      if (s.lock) { try { s.lock.release(); } catch (e) { /* egal */ } }
      if (s.el && s.el.parentNode) s.el.parentNode.removeChild(s.el);
      this._kt = null;
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

    _dailyCheck() {
      const c = this._cfg;
      if (!c.dOn || !c.targets.length || this._bgActive()) return;
      const now = new Date(), today = dk(now);
      if (hhmm(now) < (c.dTime || '20:00') || c.dLast === today) return;
      this._setCfg({ dLast: today });
      this._sendDaily();
    }

    // ---------- Morgen-Ansage ----------

    _dayFull(kidId, d) {
      const date = dk(d), ts = this._dayTasks(kidId, d).filter((t) => t.sched !== 'once');
      if (!ts.length) return null;
      return ts.every((t) => ['d', 'e'].includes(this._st(date, t.id, kidId)) || (this._isShared(t) && this._takenBy(t, date, kidId)));
    }

    _fnOn() { const c = this._cfg; return !!(c.wheelOn || c.stkOn || c.eggOn || c.hwOn || c.wkRep || c.rtOn); }
    // 🥚 Osterwoche (Palmsonntag bis Ostermontag) bzw. 🎃 24.–31. Oktober – nur wenn eingeschaltet

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

    _daysOf(a, b) {
      const out = [], s0 = String(a).slice(0, 10), e0 = String(b || a).slice(0, 10);
      const [y, m, d] = s0.split('-').map(Number);
      for (let i = 0; i < 400; i++) { const k = dk(new Date(y, m - 1, d + i)); if (k > e0) break; out.push(k); }
      return out;
    }

    // Weg 2: Kalender in Home Assistant (Integration „Holiday“ für Feiertage, Ferien-Kalender z. B. per iCal/HACS)

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

    _tgReply(msg) {
      const c = this._cfg, avail = (this._hass.services && this._hass.services.notify) || {};
      c.targets.filter((t) => (c.tgTargets || []).includes(t) || (t.includes('.') ? this._isTg(t) : /telegram/i.test(t))).forEach((t) => {
        if (t.includes('.')) { if (this._hass.states[t]) this._hass.callService('notify', 'send_message', { message: mdEsc(msg) }, { entity_id: t }, false).catch((e) => console.warn('Yippee', e)); }
        else if (avail[t]) this._hass.callService('notify', t, { message: mdEsc(msg) }, undefined, false).catch((e) => console.warn('Yippee', e));
      });
    }

    async _abMake(manual, quiet) {
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
        if (manual && !quiet) this._toast(T('💾 Sicherung angelegt'));
        this._render();
        return true;
      } catch (e) {
        if (manual && !quiet) this._toast(T('Sicherung fehlgeschlagen: {err}', { err: e.message || e }));
        return false;
      } finally { window.__kpAbBusy = false; }
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

    // Verpasste Aufgaben mit Minuspunkten werden nur markiert ('m') – abgezogen wird erst, wenn die Eltern bestätigen.
    // Kinder-Karte prüft nur ihr eigenes Kind, Eltern-Karte alle.
    _penaltyCheck() {
      if (!this._loaded || !this._hass) return;
      try { this._dataCheck(); this._abCheck(); } catch (e) { console.warn('Yippee', e); }
      // Automationen und Update-Prüfung nur auf Eltern-Karten (die Eltern-Datei ist dort ohnehin geladen)
      if (!['kid', 'kids', 'advent'].includes(this._config.mode)) this._admCall('_admChecks', [], false);
      this._weeklyCheck();
      if (this._mnOn() && this._cfg.mnRep) this._mnCall('_mnRepCheck', [], false);
      this._dailyCheck();
      try { this._repCheck(); } catch (e) { console.warn('Yippee', e); }
      this._morningCheck();
      this._reminderCheck();
      if (this._cfg.wkRep || this._cfg.rtOn) this._fnChecks(); // 📊 Wochenbericht, 🔔 Erinnerung zu festen Uhrzeiten
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
        if ((this._cfg.walletOn || (r.sc && this._scOn())) && !(opt && opt.got)) push.push(['vouch', { id: uid(), t: label, e: r.emoji || '🎁', d: today, ...(r.sc && this._scOn() ? { sc: r.sc } : {}) }, 50]);
        this._addPoints(id, 0, '', { push, red: [r.id, today, mon], ungoal: r.id });
        this._fsAdd(id, r);
      });
      this._audit(T('👫 Gemeinsam eingelöst: {names} – {title}', { names: this._names(q.need), title: r.title }));
      this._lm(`🎁 ${this._names(q.need)}: ${r.title}`, 'cash');
      this._render();
      this._celebrate(r.emoji || '🎁', T('Viel Spaß, {name}!', { name: this._names(q.need) }), inv ? T('💝 {name} lädt {others} ein: „{title}“', { name: this._kn(inv), others: this._names(q.need.filter((id) => id !== inv)), title: r.title }) : T('👫 {names} lösen gemeinsam „{title}“ ein', { names: this._names(q.need), title: r.title }));
    }

    // Abbrechen (Ablehnen, Rücknahme durch Eltern, abgelaufen): alle Zahlungen zurück
  }
  Object.getOwnPropertyNames(M.prototype).forEach((n) => { if (n !== 'constructor') Object.defineProperty(C.prototype, n, Object.getOwnPropertyDescriptor(M.prototype, n)); });
  return true;
}
