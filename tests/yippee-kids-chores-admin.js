/*
 * Yippee! - Kids Chores – Eltern-Bereich (Einstellungen, Aufgaben-, Kinder- und Belohnungs-Verwaltung, Berichte, Einrichtungs-Assistent)
 * Eigene Datei, damit die Karte auf Kinder-Tablets schneller startet: sie wird erst geladen, wenn die Eltern-Ansicht geöffnet wird.
 * Gehört zu yippee-kids-chores-card.js (gleiche Version) – https://github.com/Chrism1412/yippee-kids-chores-card · Lizenz: MIT
 */
export default function install(C, Y) {
  // Hilfen und Tabellen aus der Karte (veränderliche Werte wie Sprache und Monatsnamen werden über Y.… live gelesen)
  const { T, esc, dk, shortDate, longDate, uid, COLORS, hhmm, slug, hbNorm, cv, yml, tplOk, WEEK, VERSION, THEMES, levelOf, SET_KW, LOGO, LEVELS, LANGS, HB_TOPIC, GSCALES, keyAdd, hsh, fullCols, euro, darkOf, contrast, badgesOf, addMin, TRACK, SUBJECTS, STATES, SCHOOL_RX, PREV_TPL, PH_RX, HOL_TYPES, HOL_RULES, GRADE_COUNTRY, COUNTRIES, BADGES, APP_ID, OLD_APP, SCRIPT_ID, SEASONS, dayNum, emoFix, hm, mdEsc, pinHash, themeCols, AUTO_IDS, BG_V, OLD_IDS, PUSH_GRP, pushTag, SA, SCHOOL, hbLoad, scLoad } = Y;
  // Vorlagen (vorher in der Karte – dort braucht sie nur die Eltern-Ansicht)
  // Belohnungs-Vorlagen: [Emoji, Titel, Punkte]
  // Avatare für Kinder (Kinder-Editor und Assistent) – nur Emojis bis Unicode 11
  const AVATARS = ['🦊', '🐻', '🐼', '🦁', '🐯', '🐨', '🐸', '🦄', '🐙', '🐧', '🦖', '🐝', '🐶', '🐱', '🐰', '🦉', '👧', '👦', '🧒', '🐮', '🐷', '🐵', '🐔', '🐳', '🐬', '🦈', '🦋', '🐞', '🐢', '🦕', '🦒', '🦓', '🦔', '🦝', '🦙', '🦘', '🐲', '🐺', '🦌', '🐿️', '🦜', '🦚', '🐴', '🐭', '🐹', '👸', '🤴', '🧚', '🧜', '🦸', '🦹', '🧙', '🤖', '👽', '👻', '🎃', '⛄', '🌞', '🌈', '⭐', '🚀', '⚽', '🎸', '👩', '👨', '🧑', '👱', '🐒', '🦍', '🐘', '🦏', '🦛', '🐪', '🐫', '🐇', '🐥', '🐣', '🦆', '🦢', '🐊', '🐍', '🦎', '🦑', '🦀', '🐡', '🐠', '🐟', '🐌', '🐛', '🐜', '🦗', '🐉', '🦡', '🐩', '🐈', '🐕', '🐓', '🦃', '🐑', '🐐', '🐄', '👶', '👩\u200d🦰', '👨\u200d🦰', '👩\u200d🦱', '👨\u200d🦱', '👩\u200d🦳', '👨\u200d🦳', '👩\u200d🦲', '👨\u200d🦲', '🧔', '👲', '🧕', '👳', '👮', '👷', '💂', '🕵️', '👩\u200d🚀', '👨\u200d🚀', '👩\u200d🚒', '👨\u200d🚒', '👩\u200d🍳', '👨\u200d🍳', '👩\u200d🎤', '👨\u200d🎤', '👩\u200d🎨', '👨\u200d🎨', '👩\u200d🔬', '👨\u200d🔬', '👩\u200d⚕️', '👨\u200d⚕️', '👩\u200d🏫', '👨\u200d🏫', '🧛', '🧝', '🧞', '🧟', '🤡', '🤠', '😺', '😸', '😎', '🤓', '🥳', '😇', '🌸', '🌻', '🍀', '🌙', '⚡', '🔥', '💎', '🎈', '🎨', '🎮', '🏀', '🏈', '🎾', '🚗', '🚂', '✈️', '🛸', '🏰', '🍕', '🍦', '🍩', '🍓', '🍉', '🍄', '🌵', '❄️', '🎵', '👑'];
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
  // Aussehen nur der Eltern-Ansicht (vorher in der Karte)
  const ADM_CSS = `
.settiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin:10px 0 4px}
.settile{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:12px 12px 10px;border-radius:16px;border:1px solid var(--ln);background:var(--soft);color:inherit;font:inherit;cursor:pointer;min-height:118px}
.settile:hover,.settile:focus-visible{border-color:var(--ac)}
.settile i{font-style:normal;font-size:28px;line-height:1.1}.settile b{font-size:15px;line-height:1.2}
.settile small{color:var(--mu);font-size:12px;line-height:1.3;flex:1}.settile em{font-style:normal;font-size:12px;font-weight:800;color:var(--ac)}
.setback{margin:8px 0 2px}
.hbq{margin:2px 0 10px}
.hbchips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.hbchip{padding:6px 12px;border-radius:999px;background:var(--soft);border:1px solid var(--ln);font-size:13px;font-weight:700}
.hblist{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.hbch{display:flex;align-items:center;gap:8px;width:100%;padding:12px 14px;border-radius:14px;border:0;background:var(--soft);color:inherit;font:inherit;font-weight:800;font-size:15px;text-align:left;cursor:pointer}
.hbch .grow{flex:1;min-width:0}.hbch small{min-width:24px;padding:1px 8px;border-radius:999px;background:var(--bg);color:var(--mu);font-size:12px;text-align:center}
.hbch .hbcc{color:var(--mu);transition:transform .15s}.hbch.on .hbcc{transform:rotate(90deg)}
.hblist.chap .hbi{margin-left:12px}
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
.segsw{display:flex;background:var(--soft);border-radius:14px;padding:4px;gap:4px;margin:4px 0 8px}
.segsw button{flex:1;border:0;background:none;font:inherit;font-weight:700;font-size:14px;color:var(--mu);padding:10px 6px;border-radius:11px;cursor:pointer}
.btn.wizagain{margin-top:10px}
.wizhd{display:flex;flex-direction:column;gap:6px}
.wizst{display:flex;flex-wrap:wrap;gap:4px}
.wizst span{font-size:12px;font-weight:700;padding:4px 8px;border-radius:10px;background:var(--bg);color:var(--mu)}
.wizst span.done{color:var(--ok,#2b8a3e)}
.wizft{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:6px}
.wizdone{font-size:56px;text-align:center}
.wizkid{background:var(--bg);border-radius:14px;padding:6px 10px}
.rsbox{display:flex;flex-direction:column;gap:6px}
.rsbox .lbl{font-weight:700;font-size:14px}
.rslist{display:flex;flex-direction:column;gap:4px}
.rsrow{display:flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid var(--ln);border-radius:10px;background:var(--soft)}
.rsrow .rsn{color:var(--mu);font-weight:700;min-width:22px}
.rsz0{opacity:.6;filter:grayscale(1) drop-shadow(0 0 1px rgba(0,0,0,.6))}
.rsz1{background:linear-gradient(135deg,#22c1c3,#3b82f6)!important;color:#fff}
.rsadd{display:flex;gap:6px}
.rsadd .rsq{flex:1;min-width:0}
.rssug{display:flex;flex-direction:column;gap:4px}
.rssg{text-align:left;padding:8px 10px;border-radius:10px;border:1px dashed var(--ln);background:var(--bg);display:flex;justify-content:space-between;gap:8px;align-items:center}
.rssg small{color:var(--mu);font-size:11px;white-space:nowrap}
.rssg.free{border-style:solid;font-weight:700}
.tbadge{position:absolute;top:-6px;right:-12px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:#e03131;color:#fff;font-size:11px;line-height:18px;font-weight:800}
.kbtns{flex-wrap:wrap}
.kbtns .kbr{flex-basis:100%;height:0}
.kbtns .icon.lab{display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;font-size:17px;width:auto;min-width:0;padding:4px 2px}
.kbtns .icon.lab small{font-size:10px;font-weight:700;color:var(--mu)}
.colh .behav+.pts+.ardm,.colh .pts+.ardm{margin-left:0}
.bhwrap{display:flex;gap:8px;align-items:stretch;margin:8px 0 2px}
.bhname{width:86px;flex:0 0 86px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-weight:700;font-size:13px;text-align:center;overflow:hidden}
.bh{display:flex;gap:3px;align-items:stretch;height:110px;flex:1;min-width:0}
.bhd{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:1px}
.bhu,.bhl{width:100%;flex:1;display:flex;background:var(--soft);border-radius:4px;overflow:hidden}
.bhu{align-items:flex-end}
.bhl{align-items:flex-start}
.bhu i{display:block;width:100%;background:#40c057;border-radius:4px 4px 0 0}
.bhl i{display:block;width:100%;background:#fa5252;border-radius:0 0 4px 4px}
.bhd span{font-size:9px;color:var(--mu);margin-top:2px;white-space:nowrap}
.bhd.today{box-shadow:inset 0 0 0 1.5px var(--ac);border-radius:6px}
.bhd.today span{font-weight:800;color:var(--tx)}
.bhsum{margin:0 0 8px 94px}
.blkh.tkh{font-size:18px;border-top:1px solid var(--line,rgba(127,127,127,.25));margin-top:4px}
.blkh.tkh:first-child{border-top:none;margin-top:0}
.blkh .tkn{font-size:13px;font-weight:700;min-width:22px;padding:1px 7px;border-radius:999px;background:rgba(127,127,127,.18);text-align:center}
.blkh.tksh{font-size:15px;padding:4px 0 2px 18px;opacity:.9}
.tab .te{font-size:20px;line-height:1.1;position:relative}
.tab[data-id=zaehne] .te{filter:drop-shadow(0 0 1px rgba(0,0,0,.55)) drop-shadow(0 1px 1px rgba(0,0,0,.25))}
.tabs.ico .te{font-size:24px}
.accs{font-weight:400;font-size:13px;color:var(--mu);margin-top:2px}
.accb{display:flex;flex-direction:column;gap:8px;padding:0 12px 14px}
.acchr{display:flex;align-items:center}
.acchr .acch{flex:1;min-width:0}
.hbsec{display:flex;justify-content:flex-end}
.fdesc{margin:0}
.colh{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font-weight:800;font-size:17px}
.admk{display:flex;align-items:center;gap:8px;background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-align:left;min-width:0}
.sensok{color:color-mix(in srgb,var(--ok) 70%,var(--tx));font-weight:700}
.senswarn{color:color-mix(in srgb,#d97706 80%,var(--tx));font-weight:700}
.colh .pts{margin-left:auto}
.mrow{flex-wrap:wrap}
.addd{display:flex;gap:8px}
.addd .btn{white-space:nowrap}
.calbox .row.calhid{opacity:.55}
.reptw{overflow-x:auto;-webkit-overflow-scrolling:touch}
.rept{width:100%;border-collapse:collapse;font-size:13px}
.rept th,.rept td{padding:6px 6px;text-align:center;border-bottom:1px solid var(--soft);white-space:nowrap}
.rept thead th{font-size:12px}
.rept thead th span{display:block;font-weight:700;max-width:90px;overflow:hidden;text-overflow:ellipsis;margin:0 auto}
.rept tbody th{text-align:left;font-weight:600;color:var(--mu);font-size:12px}
.rept td small{display:block;color:var(--mu);font-size:11px}
.rept td.na{color:var(--mu)}
.rept tr[data-a]{cursor:pointer}
.rept tr.today th{color:var(--tx)}
.mkrow{display:flex;gap:8px;align-items:center}
.mkrow .newlist{flex:1;min-width:0}
.kah{display:flex;align-items:center;gap:12px;width:100%;background:none;border:0;padding:0;font:inherit;color:var(--tx);text-align:left;cursor:pointer}
.kah .kan{font-size:20px;font-weight:800}
.kah small{color:var(--mu);font-size:13px}
.kah .bar{margin-top:4px}
.kadm.open .kah .accc{transform:rotate(90deg)}
.kadm .krow{padding-top:4px}
.kadm .bhname{display:none}
.kadm .krow{flex-direction:column;align-items:stretch;gap:8px}
.kadm .krow>.grow:empty{display:none}
.kmove{display:flex;gap:4px;align-self:flex-start}
.kmove .icon{width:34px;height:34px;font-size:13px}
.kadm .kbtns .kbr{display:none}
.kadm .kbtns .pts{min-width:40px;text-align:center}
.kadm .kbtns .icon{width:40px;height:40px;flex:none}
.kadm .kbtns .icon.lab{flex:1 1 0;min-width:0;height:44px}
@container kadm (max-width:430px){.kadm .kbtns .icon.lab small{display:none}.kadm .kbtns .icon.lab{font-size:20px}}
@container kadm (max-width:330px){.kadm .kbtns .icon.lab{flex:1 1 calc(25% - 6px)}}
.kadm .bh{flex:1}
.exrow>label,.prule label{min-width:0}
.exrow input,.exrow select,.prule input,.prule select{min-width:0;width:100%;box-sizing:border-box}
.prule .g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.thsw{width:46px;height:32px;border-radius:9px;display:flex;align-items:flex-end;justify-content:flex-end;gap:3px;padding:4px;box-sizing:border-box;box-shadow:inset 0 0 0 1px rgba(127,127,127,.35)}
.thsw i{width:10px;height:10px;border-radius:50%}
.colpk{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.colpk label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700}
.colpk input[type=color]{width:100%;height:42px;border:1px solid var(--ln);border-radius:10px;padding:2px;background:var(--bg);cursor:pointer}
.kcd{align-self:end;padding-bottom:14px}
.phth{width:46px;height:46px;border-radius:10px;object-fit:cover;flex:none;cursor:pointer;background:var(--soft);display:grid;place-items:center;font-size:20px}
.sbars{display:flex;gap:8px;align-items:flex-end;margin-top:6px}
.sbt{width:100%;max-width:40px;height:80px;background:var(--soft);border-radius:8px;display:flex;align-items:flex-end;overflow:hidden}
.sbt i{display:block;width:100%;background:var(--c,var(--ac));border-radius:8px 8px 0 0}
.stk .colh small{display:block;font-weight:400;font-size:12px;color:var(--mu)}
.fopt{display:flex;flex-direction:column;gap:8px;padding:4px 0 6px 12px;border-left:3px solid var(--soft);margin:0 0 6px 14px}
.tplbar{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px}
.tplchk{flex-direction:row;align-items:center;gap:6px;font-size:13px}
.tplchk input{width:18px;height:18px}
.famlog{margin-top:6px;font-size:13px}
.famlog summary{cursor:pointer;opacity:.75}
.famlog div{padding:2px 0 2px 18px;opacity:.85}
.arow{display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:12px;padding:8px 12px;font-weight:700}
.okb{color:var(--ok);font-weight:800}
.wizsteps{display:block;margin-top:2px}
.wizav{border-radius:14px;background:var(--soft)}
.wizav>summary{display:flex;align-items:center;gap:10px;padding:8px 12px;font-weight:700;cursor:pointer;list-style:none}
.wizav>summary::-webkit-details-marker{display:none}
.wizav>summary::after{content:'▸';color:var(--mu);transition:transform .2s}
.wizav[open]>summary::after{transform:rotate(90deg)}
.wizav .pick{padding:0 10px 10px}
.wizav .lbl{padding:0 12px}
.wizrr{display:flex;align-items:center;gap:8px}
.wizrr .crow{flex:1;min-width:0}
.wizrc{display:flex;align-items:center;gap:4px;flex:none;font-weight:700}
.wizrc input{width:72px}
.bg3{display:flex;flex-direction:column;gap:6px}
.bg3 label{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
.bg3 input{width:auto;flex:0 0 auto;min-width:120px}
`;
  if (Y.setCss) Y.setCss(ADM_CSS);
  if (Y.setTpl) Y.setTpl({ REWARD_TEMPLATES, ROUT_STEPS, WIZ_TASKS, WIZ_REWARDS, TEMPLATES });
  class M {
    // 👧 Eltern-Ansicht „Nach Kind“: je Kind die Belohnungen nur für dieses Kind (bzw. für einige Kinder – dann bei jedem davon),
    // danach „Für alle Kinder“, „Gemeinsam / Einladen“ und „Joker“; innerhalb jeder Gruppe nach Sternen
    _rwKidGroups(list) {
      const kids = this._kids(), jk = (r) => !!(this._cfg.jokerOn && r.joker), sh = (r) => this._shareOn(r);
      const single = list.filter((r) => !sh(r) && !jk(r)), part = (r) => this._rwKids(r).length < kids.length;
      return [
        ...kids.map((k) => [`${esc(k.emoji || '🙂')} ${esc(k.name)}`, this._rwSorted(single.filter((r) => part(r) && this._rwFor(r, k.id)), k.id)]),
        [T('👨‍👩‍👧 Für alle Kinder'), this._rwSorted(single.filter((r) => !part(r)))],
        [T('👫 Gemeinsam / Einladen'), this._rwSorted(list.filter(sh))],
        [T('🃏 Joker'), this._rwSorted(list.filter(jk))],
      ].filter(([, l]) => l.length);
    }

    // Wie viele Sterne kann ein Kind an einem normalen Tag verdienen? Ø der Pflicht-Aufgaben der nächsten 4 Wochen,
    // nur Tage mit Aufgaben. Anwesenheit, Urlaub und Ferien zählen hier bewusst nicht – sonst hätte ein Kind,
    // das gerade beim anderen Elternteil ist, scheinbar „keine Aufgaben“. Wechsel/„Einer reicht“ anteilig.
    _dailyPts(kidId) {
      const now = new Date(); let sum = 0, days = 0;
      const tasks = Object.values(this._db.task).filter((t) => (t.kids || []).includes(kidId) && t.sched !== 'once' && this._req(t) && Number(t.points) > 0);
      for (let i = 0; i < 28; i++) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
        const p = tasks.reduce((a, t) => {
          if (!this._isOn(t, d)) return a;
          const n = (t.kids || []).filter((id) => this._db.kid[id]).length || 1;
          return a + (Number(t.points) || 0) / ((t.rotate || this._isShared(t)) && n > 1 ? n : 1);
        }, 0);
        if (p > 0) { sum += p; days++; }
      }
      return days ? Math.round((sum / days) * 10) / 10 : 0;
    }

    // Regionen eines Landes (mit Unter-Ebenen, z. B. Départements) – live geladen
    async _subsLoad(hc) {
      window.__kpSubs = window.__kpSubs || {};
      const L = String(this._lang || 'de').slice(0, 2).toUpperCase(), key = `${hc}|${L}`;
      if (window.__kpSubs[key]) return window.__kpSubs[key];
      const out = [];
      const walk = (arr, depth) => (arr || []).forEach((x) => {
        if (!x || !x.code) return;
        const cat = ((x.category || []).find((n) => String(n.language || '').toUpperCase() === L) || (x.category || [])[0] || {}).text || '';
        out.push({ code: x.code, name: this._holName(x) || x.code, cat, depth });
        if (depth < 2) walk(x.children, depth + 1);
      });
      try { walk(await this._holGet(`https://openholidaysapi.org/Subdivisions?countryIsoCode=${hc}&languageIsoCode=${L}`), 0); }
      catch (e) { if (hc !== 'DE') throw e; }
      if (!out.length && hc === 'DE') STATES.forEach(([code, name]) => out.push({ code, name, cat: T('Bundesland'), depth: 0 }));
      window.__kpSubs[key] = out;
      return out;
    }

    // ⚙️ Liste der verknüpften Kalender (Einstellungen → 📚 Termine als Aufgaben)
    _calLinksHtml() {
      const ls = (this._cfg.calLinks || []).filter((L) => L && L.ent);
      const kn = (ids) => (ids || []).map((id) => (this._db.kid[id] ? esc(this._db.kid[id].name) : '')).filter(Boolean).join(', ');
      return `<div class="calls">${ls.map((L) => `<div class="row"><span style="font-size:22px">${esc(L.emoji || '📝')}</span><span class="grow">${esc(this._ename(L.ent))}<small>${kn(L.kids) || '–'} · +${Number(L.pts) || 0} ⭐ · ${L.prev ? T('🌙 Am Tag davor') : T('📅 Am Termintag')}${L.kw ? ` · „${esc(L.kw)}“` : ''}${this._hass.states[L.ent] ? '' : ` · ${T('⚠️ Kalender nicht gefunden.')}`}</small></span><button class="icon" data-a="caled" data-id="${esc(L.id)}" aria-label="${esc(T('Bearbeiten'))}">✎</button></div>`).join('')}</div>
        <div><button type="button" class="btn sm" data-a="caled" data-id="">${T('＋ Kalender verknüpfen')}</button></div>`;
    }

    // 🗓️ Aufgaben-Tab: die nächsten Kalender-Aufgaben – einzelne Termine lassen sich ausblenden
    _calTasksBox() {
      if (!this._cfg.calOn || !(this._cfg.calLinks || []).length) return '';
      const today = dk(new Date()), end = dk(new Date(Date.now() + 14 * 864e5));
      const ts = Object.values(this._db.task).filter((t) => t.calLink && (t.calHidden || (t.dates[0] >= today && t.dates[0] <= end)) && (t.calHidden ? t.calDue >= today : true)).sort((a, b) => String(a.calDue).localeCompare(String(b.calDue)) || String(a.title).localeCompare(String(b.title)));
      if (this._calBoxOpen === undefined) { try { this._calBoxOpen = localStorage.getItem('kpCalBox') !== '0'; } catch (e) { this._calBoxOpen = true; } }
      const o = this._calBoxOpen;
      return `<div class="box calbox"><button class="kvsect sect" data-a="calbox" aria-expanded="${o}"><span>${T('📚 Aus Kalendern')}</span><span class="hint">${ts.filter((t) => !t.calHidden).length} <span class="accc">▸</span></span></button>
        ${o ? (ts.map((t) => `<div class="row ${t.calHidden ? 'calhid' : ''}"><span style="font-size:22px">${esc(t.emoji)}</span><span class="grow">${esc(t.title)}<small>${t.calHidden ? T('ausgeblendet') : `${longDate(t.dates[0])}${t.calDue !== t.dates[0] ? ` · ${T('Termin {date}', { date: shortDate(t.calDue) })}` : ''}`} · ${(t.kids || []).map((id) => esc((this._db.kid[id] || {}).name || '')).join(', ')} · +${t.points} ⭐</small></span><button class="icon" data-a="calhide" data-id="${esc(t.id)}" title="${esc(t.calHidden ? T('Wieder anzeigen') : T('Diesen Termin ausblenden'))}">${t.calHidden ? '👁️' : '🙈'}</button></div>`).join('') || `<div class="hint">${T('In den nächsten 14 Tagen keine Termine.')}</div>`) : ''}</div>`;
    }

    _editCalLink(id) {
      const L0 = (this._cfg.calLinks || []).find((x) => x.id === id);
      const L = L0 || { ent: '', kids: this._kids().map((k) => k.id), pts: 2, pen: 0, emoji: '📝', prev: true, kw: '' };
      const cals = Object.keys(this._hass.states).filter((e) => e.startsWith('calendar.')).sort();
      const cur = L.ent || cals[0] || '';
      if (cur) this._calEvents(cur);
      this._modal(L0 ? T('🗓️ Kalender-Verknüpfung') : T('＋ Kalender verknüpfen'), `
        <label>${T('Kalender')}<select name="cal">${cals.map((e) => `<option value="${e}" ${cur === e ? 'selected' : ''}>${esc(this._ename(e))}</option>`).join('') || `<option value="">${T('– kein Kalender gefunden –')}</option>`}</select></label>
        <div class="hint calprev">${this._calPreview(cur)}</div>
        <div class="lbl">${T('Für wen?')}</div><div class="pick txt">${this._kids().map((k) => `<label><input type="checkbox" name="kid" value="${k.id}" ${(L.kids || []).includes(k.id) ? 'checked' : ''}><span>${esc(k.emoji)} ${esc(k.name)}</span></label>`).join('')}</div>
        <div class="g2"><label>${T('Emoji')}<input name="emoji" value="${esc(L.emoji || '📝')}"></label><label>${T('Punkte fürs Erledigen')}<input type="number" min="0" name="points" value="${Number(L.pts) || 0}"></label></div>
        <div class="lbl">${T('Wann erscheint die Aufgabe?')}</div>
        <div class="pick txt"><label><input type="radio" name="when" value="prev" ${L.prev ? 'checked' : ''}><span>${T('🌙 Am Tag davor')}</span></label><label><input type="radio" name="when" value="day" ${L.prev ? '' : 'checked'}><span>${T('📅 Am Termintag')}</span></label></div>
        <div class="hint">${T('Für Hausaufgaben passt „Am Tag davor“: Steht der Abgabetag im Kalender, erscheint die Aufgabe am Tag vorher.')}</div>
        <label>${T('Nur Termine mit diesem Stichwort (optional)')}<input name="calKw" value="${esc(L.kw || '')}" placeholder="${esc(T('z. B. HA:, Hausaufgabe – leer = alle Termine'))}"></label>
        <label>${T('Minuspunkte, wenn nicht erledigt')}<input type="number" min="0" name="penalty" value="${Number(L.pen) || 0}"></label>
        <div class="hint">${T('Standard 0: Kalendereinträge können fehlen oder ausfallen – dafür soll kein Kind bestraft werden. Minuspunkte gibt es ohnehin nur nach deiner Entscheidung.')}</div>`, !!L0, {
        save: (b) => {
          const ent = (b.querySelector('[name=cal]') || {}).value || '';
          const kids = [...b.querySelectorAll('[name=kid]:checked')].map((x) => x.value);
          if (!ent) { this._toast(T('Bitte einen Kalender wählen')); return false; }
          if (!kids.length) { this._toast(T('Bitte mindestens ein Kind wählen')); return false; }
          const nl = { id: L0 ? L0.id : uid().slice(0, 10), ent, kids, emoji: b.querySelector('[name=emoji]').value.trim() || '📝', pts: Math.max(0, Number(b.querySelector('[name=points]').value) || 0), pen: Math.max(0, Number(b.querySelector('[name=penalty]').value) || 0), prev: (b.querySelector('[name=when]:checked') || {}).value === 'prev', kw: b.querySelector('[name=calKw]').value.trim().slice(0, 80), since: (L0 && L0.since) || dk(new Date()) };
          const ls = (this._cfg.calLinks || []).filter((x) => x && x.id !== nl.id);
          this._setCfg({ calLinks: [...ls, nl] });
          return true;
        },
        del: () => { this._setCfg({ calLinks: (this._cfg.calLinks || []).filter((x) => x && x.id !== id) }); return true; },
      });
    }

    // „＋ Liste anlegen“ mit änderbarem Namen – nur für Administratoren und nur, wenn noch keine (vorhandene) eigene Liste gewählt ist
    _mkRow(key, cur, def) {
      if (!this._admin()) return '';
      const st = this._hass.states;
      if (cur && st[cur]) return '';
      const busy = this._mkBusy === key, val = cur ? this._listName(cur) : def;
      return `${cur ? `<div class="hint">${T('⚠️ Nicht mehr gefunden: {list}', { list: esc(cur) })}</div>` : ''}<div class="mkrow"><input type="text" class="newlist" maxlength="40" value="${esc(val)}" aria-label="${esc(T('Name der neuen Liste'))}" placeholder="${esc(T('Name der neuen Liste'))}"><button type="button" class="btn sm" data-a="mklist" data-for="${key}" data-n="${esc(val)}" ${busy ? 'disabled' : ''}>${busy ? '⏳' : T('＋ Liste anlegen')}</button></div>`;
    }

    // 🤖 Fertige Automation als Zeile: anlegen / ✅ angelegt / 🔄 neu schreiben (wenn sich Einstellungen geändert haben) + YAML
    _autoRowSig(k, label, extra) {
      const c = this._cfg, ok = this._autoOk || {};
      let cfg = null; try { cfg = this._autoCfg(k); } catch (e) { cfg = null; }
      const fresh = cfg && c[`aSig_${k}`] === hsh(JSON.stringify(cfg));
      const btn = !ok[k] ? this._autoBtn(k) : fresh || !this._admin() ? `<span class="okb">${T('✅ angelegt')}</span>` : `<button class="btn sm" data-a="autonew" data-k="${k}">${T('🔄 Automation neu schreiben')}</button>`;
      return `<div class="arow"><span class="grow">${label}</span>${btn}</div>${extra || ''}
          ${cfg ? `<details><summary class="hint">${T('YAML zum manuellen Anlegen')}</summary><pre class="code">${esc(yml(cfg).trim())}</pre><button class="btn" data-a="copyauto">${T('📋 Kopieren')}</button></details>` : ''}`;
    }

    // 🤖 Hinweis im Sensoren-Bereich: wo die fertigen Automationen stehen
    _sensAutoUi() {
      return `<div class="lbl">${T('🤖 Fertige Automationen')}</div>
          <div class="hint">${T('📋 Abend-Erinnerung: 🔔 Benachrichtigungen → 🔔 Benachrichtigen bei … · 🎉 Durchsage und Nachricht, wenn das Familienziel erreicht ist: 🎁 Belohnungen → 👨‍👩‍👧 Familienziel. Beide nutzen die Sensoren hier.')}</div>`;
    }

    _sensKeepUi() {
      const ss = this._sensState(), fine = ss.on && !ss.bad.length && !ss.old.length && !ss.stale;
      const dup = !fine && ss.on && this._sensDupCheck() ? `<div class="hint senswarn">${T('⚠️ Die Vorlage ist doppelt eingetragen – Home Assistant nutzt noch die alte Kopie. Die alte löschen (z. B. in der configuration.yaml nach „yippee_kid_“ suchen), dann Home Assistant neu starten.')}</div>` : '';
      const status = dup ? dup : fine ? `<div class="hint sensok">${T('✅ Dauerhafte Sensoren aktiv – Home Assistant liest sie selbst, auch nach einem Neustart.')}</div>`
        : ss.on && ss.stale && !ss.bad.length ? `<div class="hint senswarn">${T('🔁 Es gibt eine neue Vorlage – bitte neu kopieren, einfügen und Home Assistant neu starten.')}${ss.old.length ? ` ${T('Nicht mehr gebraucht: {names}', { names: ss.old.join(', ') })}` : ''}</div>`
        : ss.on ? `<div class="hint senswarn">${T('⚠️ Vorlage neu kopieren – sie passt nicht mehr zu den Kindern.')}${ss.bad.length ? ` ${T('Betrifft: {names}', { names: ss.bad.map(esc).join(', ') })}` : ''}${ss.old.length ? ` ${T('Nicht mehr gebraucht: {names}', { names: ss.old.join(', ') })}` : ''}</div>` : '';
      const steps = `<div class="hint">${T('1. „📋 Vorlage kopieren“ antippen. 2. Als eigene Datei packages/yippee.yaml speichern (wenn „packages“ eingerichtet ist) – sonst in die configuration.yaml einfügen, z. B. mit dem File editor. 3. Home Assistant neu starten.')} ${T('Wichtig: Die Vorlage darf nur an einer Stelle stehen. Eine ältere Kopie (z. B. in der configuration.yaml) vorher löschen bzw. ersetzen – sonst nutzt Home Assistant weiter die alte.')}</div>`;
      return `${status}${fine ? '' : steps}
          <div class="btnrow"><button class="btn" data-a="sensyaml">${T('📋 Vorlage kopieren')}</button></div>
          <details class="sensy" ${this._sensyOpen ? 'open' : ''}><summary class="hint">${T('Vorlage anzeigen')}</summary><pre class="yaml">${esc(this._sensYaml())}</pre></details>`;
    }

    // 🔁 Vorlage doppelt eingetragen? Home Assistant meldet das im Protokoll („ID yippee_… is already used“).
    // Nur Administratoren dürfen das Protokoll lesen – alle anderen fragen nie nach; höchstens einmal pro Minute.
    _sensDupCheck() {
      if (!this._admin() || !this._hass || typeof this._hass.callWS !== 'function') return false;
      const now = Date.now();
      if (!this._dupBusy && now - (this._dupAt || 0) > 60000) {
        this._dupBusy = true; this._dupAt = now;
        this._hass.callWS({ type: 'system_log/list' }).then((l) => {
          const dup = (Array.isArray(l) ? l : []).some((e) => /ID yippee_(kid_|familienziel)\S* is already used/.test([].concat((e && e.message) || []).join(' ')));
          if (dup !== !!this._sensDup) { this._sensDup = dup; this._render(); }
        }).catch(() => { /* Protokoll nicht lesbar */ }).finally(() => { this._dupBusy = false; });
      }
      return !!this._sensDup;
    }

    // 🔁 Hinweis oben in der Eltern-Ansicht, wenn die kopierte Sensor-Vorlage nicht mehr aktuell ist
    // 💡 Hinweis für Eltern (nur hier in der Karte, abschaltbar): 3 Tage nichts erledigt oder das Haustier ist traurig
    _parHint(kids) {
      if (this._cfg.parHint === false) return '';
      const now = new Date(), day = (n) => { const d = new Date(now); d.setDate(d.getDate() - n); return dk(d); };
      const first = Object.keys(this._db.log || {}).sort()[0] || dk(now), out = [];
      (kids || []).forEach((k) => {
        const since = k.since || first;
        if (since <= day(3) && [1, 2, 3].every((n) => { const s = ((this._db.log || {})[day(n)] || {}).s || {}; return !Object.entries(s).some(([key, v]) => v === 'd' && key.endsWith(`:${k.id}`)); })) out.push(T('{name} hat seit 3 Tagen keine Aufgabe erledigt.', { name: esc(k.name) }));
        const p = (this._db.pk || {})[k.id];
        if (this._peOn() && p && p.on !== false && typeof this._peMood === 'function' && typeof this._peKindOf === 'function' && this._peKindOf(p) && this._peMood(k).m === 'sad') out.push(T('{pet} von {name} ist traurig – heute ist noch einiges offen.', { pet: esc(this._peName(p)), name: esc(k.name) }));
      });
      return out.length ? `<div class="card" style="border-left:5px solid #f08c00"><div class="lbl">💡 ${T('Hinweis für Eltern')}</div>${out.map((x) => `<div class="hint" style="margin-top:4px">• ${x}</div>`).join('')}</div>` : '';
    }
    _sensBanner() {
      if (!this._cfg.sensKeep || this._cfg.sensors === false) return '';
      const ss = this._sensState();
      if (!ss.on || !(ss.stale || ss.bad.length)) return '';
      if (this._sensDupCheck()) return `<div class="box"><div class="hint warn">${T('⚠️ Die Vorlage ist doppelt eingetragen – Home Assistant nutzt noch die alte Kopie. Die alte löschen (z. B. in der configuration.yaml nach „yippee_kid_“ suchen), dann Home Assistant neu starten.')}</div></div>`;
      return `<div class="box"><div class="hint warn">${T('🔁 Die Sensor-Vorlage ist nicht mehr aktuell. Unter ⚙️ Einstellungen → 🔌 Geräte & Sprache → 📊 Sensoren & Automationen „📋 Vorlage kopieren“ antippen, neu einfügen und Home Assistant neu starten.')}</div></div>`;
    }

    // 🔁 Läuft die Vorlage schon – und passt sie noch zu den Kindern?
    // Rückgabe: { on: Vorlage gefunden, bad: [Kinder, für die sie nicht passt], old: [übrige Vorlagen-Sensoren] }
    _sensState() {
      const ents = this._hass.entities || {}, st = this._hass.states || {}, kids = this._kids();
      const isT = (id) => !!(ents[id] && ents[id].platform === 'template');
      const ids = new Set(kids.map((k) => `sensor.yippee_${slug(k.name)}`));
      const fam = !!this._famSens();
      if (fam) ids.add('sensor.yippee_familienziel');
      const on = kids.some((k) => isT(`sensor.yippee_${slug(k.name)}`));
      const bad = kids.filter((k) => {
        const id = `sensor.yippee_${slug(k.name)}`;
        if (!isT(id)) return true;
        const x = st[id];
        return Object.prototype.hasOwnProperty.call(this._sensRaw || {}, k.id) && (!x || x.state === 'unavailable'); // Stand liegt bereit, Sensor bleibt leer → Kennung passt nicht
      }).map((k) => k.name);
      if (fam && on) { const x = st['sensor.yippee_familienziel']; if (!isT('sensor.yippee_familienziel') || (Object.prototype.hasOwnProperty.call(this._sensRaw || {}, 'fam') && (!x || x.state === 'unavailable'))) bad.push(T('👨‍👩‍👧 Familienziel')); }
      const old = Object.keys(ents).filter((id) => id.startsWith('sensor.yippee_') && isT(id) && !ids.has(id));
      // 🔁 veraltet: ein laufender Vorlagen-Sensor trägt nicht die Kennung der aktuellen Vorlage (z. B. nach einem Update)
      const sig = on ? this._tplSig() : '';
      const stale = on && [...ids].some((id) => isT(id) && st[id] && st[id].state !== 'unavailable' && String((st[id].attributes || {}).vorlage || '') !== sig);
      return { on, bad, old, stale };
    }

    _freeEx() { const md = String(this._cfg.freeMode || ''); return md === 'day' ? '23:59' : /^\d+$/.test(md) ? addMin('09:00', Number(md)) : this._blkEnd('m'); }

    _winText(t) {
      const to = this._winTo(t);
      if (t.from && to) return `${t.from}–${to}`;
      if (t.from) return T('ab {time}', { time: t.from });
      if (to) return T('bis {time}', { time: to });
      return '';
    }

    _missedTasks() {
      const out = [];
      Object.keys(this._db.log).sort().forEach((date) => {
        const s = this._db.log[date].s || {};
        Object.keys(s).forEach((k) => {
          if (s[k] !== 'm') return;
          const [tid, kid] = k.split(':');
          const t = this._db.task[tid], c = this._db.kid[kid];
          if (t && c) out.push({ date, t, c });
        });
      });
      return out;
    }

    // ---------- 🩺 Plausibilitäts-Check ----------
    _checks() {
      return this._memo('checks', dk(new Date()), () => {
        const out = [], kids = this._kids(), now = new Date(), today = dk(now);
        kids.forEach((k) => {
          if (this._presCfg(k.pres)) {
            let any = false;
            for (let i = 0; i < 56 && !any; i++) if (this._pres(k.id, keyAdd(today, i)).s !== 'out') any = true;
            if (!any) { out.push([`pres:${k.id}`, T('🏠 {name} ist laut Anwesenheit in den nächsten 8 Wochen nie da. Bei „meistens woanders“ braucht es Regeln, wann {name} da ist – oder auf „meistens bei uns“ umstellen.', { name: esc(k.name) })]); return; }
          }
          let tasks = 0;
          for (let i = 0; i < 14 && !tasks; i++) tasks += this._dayTasks(k.id, new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)).length;
          if (!tasks) out.push([`notask:${k.id}`, T('📋 {name} hat in den nächsten 2 Wochen keine Pflicht-Aufgaben.', { name: esc(k.name) })]);
        });
        let cheap = 0;
        this._rewards().forEach((r) => kids.forEach((k) => {
          if (!this._rwFor(r, k.id)) return;
          const c = this._cost(r, k.id), daily = this._dailyPts(k.id), wb = this._weekBudget(k.id);
          if (cheap < 3 && daily > 0 && c < daily / 2) { cheap++; out.push([`cheap:${r.id}:${k.id}`, T('🎁 „{title}“ kostet {name} weniger als einen halben Tag ({n} ⭐ bei Ø {d} ⭐/Tag).', { title: esc(r.title), name: esc(k.name), n: c, d: Math.round(daily) })]); }
          if (wb > 0 && c > wb * 13) out.push([`dear:${r.id}:${k.id}`, T('🎁 Auf „{title}“ spart {name} über 3 Monate.', { title: esc(r.title), name: esc(k.name) })]);
        }));
        const f = this._cfg.fam;
        if (f && f.cost && !f.reached) {
          const wk = kids.reduce((a, k) => a + this._weekBudget(k.id), 0);
          const d = wk > 0 ? Math.ceil((f.cost - (f.pts || 0)) / (wk / 7)) : 0;
          if (wk > 0 && d < 14) out.push(['famfast', T('👨‍👩‍👧 Das Familienziel „{title}“ ist schon in ca. {n} Tagen erreicht – vielleicht höher setzen?', { title: esc(f.title), n: d })]);
        }
        return out;
      });
    }

    _checkHtml() {
      if (this._cfg.checkOn === false) return '';
      const hide = new Set(this._cfg.chkHide || []), list = this._checks().filter(([k]) => !hide.has(k));
      if (!list.length) return '';
      return `<div class="box chk"><div class="lbl">${T('🩺 Hinweise zu deinen Einstellungen')}</div>${list.map(([k, txt]) => `<div class="row"><span class="grow hint">${txt}</span><button class="icon" data-a="hhide" data-id="${esc(k)}" title="${esc(T('Ausblenden'))}">✕</button></div>`).join('')}</div>`;
    }

    _ptsInfo() {
      const ex = `alias: Mia bekommt einen Stern\nsequence:\n  - action: script.yippee_sterne\n    data:\n      kind: ${(this._kids()[0] || {}).name || 'Mia'}\n      sterne: 1\n      grund: ${T('Sprachassistent')}`;
      return `<div class="lbl">${T('🤖 Sterne per Automation oder Sprachassistent')}</div>
        <div class="hint">${T('Das Skript script.yippee_sterne gibt einem Kind Sterne oder zieht welche ab – nutzbar in Automationen, Skripten und (über ein eigenes Skript je Kind) mit Google Assistant oder Alexa. Gebucht wird, sobald eine Yippee!-Karte geöffnet ist.')}</div>
        <div class="arow"><span class="grow">📜 script.yippee_sterne</span>${this._scriptOk ? `<span class="okb">${T('✅ angelegt')}</span>` : this._admin() ? `<button class="btn primary sm" data-a="scriptnew">${T('⚙️ Automatisch anlegen')}</button>` : `<span class="hint">${T('🔒 Nur als Administrator – oder YAML kopieren')}</span>`}</div>
        <details><summary class="hint">${T('YAML zum manuellen Anlegen')}</summary><pre class="code">${esc(this._ptsYaml())}</pre><button class="btn" data-a="copyauto">${T('📋 Kopieren')}</button></details>
        <details><summary class="hint">${T('Beispiel: ein Skript je Kind für Google Assistant / Alexa')}</summary><pre class="code">${esc(ex)}</pre><button class="btn" data-a="copyauto">${T('📋 Kopieren')}</button></details>`;
    }

    _btnInfo() {
      const c = this._cfg, l = c.btnLast, phones = c.targets.some((t) => t.startsWith('mobile_app_')) && c.nActions !== false;
      const miss = phones && this._admin() && this._autoChecked && !(this._autoOk || {}).app;
      const lbl = { ok: T('✓ Freigeben'), no: T('✕ Ablehnen'), rok: T('✓ Freigeben'), rno: T('✕ Ablehnen'), gok: T('✓ Freigeben'), gno: T('✕ Ablehnen'), me: T('🙂 Entschuldigt'), mx: T('Minuspunkte'), md: T('✓ Erledigt'), pts: T('🤖 Sterne') };
      const res = { ok: T('gebucht'), gone: T('war schon entschieden'), np: T('ignoriert – nicht als Eltern eingetragen') };
      const lt = l && Number(l.ts) ? new Date(Number(l.ts)) : null;
      return `${miss ? `<div class="hint warn">${T('⚠️ Die Knöpfe in Push-Nachrichten wirken noch nicht – die Automation „📱 HA-App“ fehlt. Unten „⚙️ Automatisch anlegen“ tippen.')}</div>` : ''}
        <div class="hint">${lt ? `${l.r === 'np' ? '⚠️' : '✅'} ${T('Letzter Knopf')}: ${esc(shortDate(dk(lt)))} ${esc(hhmm(lt))}${l.u ? ` · ${esc(this._userName(l.u) || '?')}` : ''} · ${esc(lbl[l.op] || l.op || '')} – ${esc(res[l.r] || '')}` : T('Letzter Knopf: noch keiner angekommen. Passiert nach dem Antippen nichts, in Home Assistant unter Einstellungen → Automationen bei der Knöpfe-Automation die Traces ansehen.')}</div>`;
    }

    // Bericht: eine Nachricht pro Kind + an welche Geräte (leer = alle)
    _repOpts(p) {
      const c = this._cfg, to = this._repTo(`${p}To`);
      const nm = (t) => (t.includes('.') ? esc(this._ename(t)) : t.startsWith('mobile_app_') ? esc(this._phoneName(t)) : `Telegram <small>${esc(t)}</small>`);
      return `${this._chk(`${p}Split`, !!c[`${p}Split`], T('👧 Eine Nachricht pro Kind'))}
        ${c.targets.length > 1 ? `<div class="lbl">${T('Senden an')}</div><div class="pick txt">${c.targets.map((t) => `<label><input type="checkbox" data-a="cfg" data-k="${p}To" data-v="${esc(t)}" ${!to || to.includes(t) ? 'checked' : ''}><span>${nm(t)}</span></label>`).join('')}</div>` : ''}`;
    }

    _phoneName(svc) {
      const n = svc.replace(/^mobile_app_/, '').replace(/_/g, ' ');
      return n.replace(/\b\w/g, (m) => m.toUpperCase());
    }

    // Kartentitel: auf schmalen Bildschirmen „Yippee!“ groß und der Rest klein darunter
    _ttl() {
      const t = T('⭐ Yippee! - Kids Chores').replace(/^⭐\s*/, ''), i = t.indexOf(' - ');
      return i > 0 ? `<span class="tt0"><span class="tt1">${esc(t.slice(0, i))}</span><span class="tt2">${esc(t.slice(i + 3))}</span></span>` : esc(t);
    }

    _adminHtml() {
      const kids = this._kids();
      const pend = this._pendingTasks();
      const reqs = Object.values(this._db.req).filter((q) => this._db.kid[q.kid] && this._db.reward[q.reward]);
      const tabs = [['heute', T('📋 Heute')], ['aufgaben', T('✅ Aufgaben')], ['belohnungen', T('🎁 Belohnungen')], ['kinder', T('👧 Kinder')], ...(this._advOn() ? [['advent', T('🎄 Advent')]] : []), ...(this._zOn() ? [['zaehne', T('🦷 Zähne')]] : []), ...(this._mnOn() ? [['geld', T('💰 Taschengeld')]] : []), ...(this._peOn() ? [['tier', T('🐾 Haustier')]] : []), ['einst', T('⚙️ Einstellungen')]];
      if (this._tab === 'advent' && !this._advOn()) this._tab = 'heute';
      if (this._tab === 'zaehne' && !this._zOn()) this._tab = 'heute';
      if (this._tab === 'geld' && !this._mnOn()) this._tab = 'heute';
      if (this._tab === 'tier' && !this._peOn()) this._tab = 'heute';
      if (this._wizShow(kids)) {
        return `<div class="card">
        <div class="hd"><span class="tt">${LOGO}${this._ttl()}</span><span class="hint">${T('Eltern')}</span></div>
        ${this._wizHtml(kids)}</div>`;
      }
      let body;
      if (this._tab === 'aufgaben') body = this._tasksAdmin(kids);
      else if (this._tab === 'belohnungen') body = this._rewardsAdmin();
      else if (this._tab === 'kinder') body = this._kidsAdmin(kids);
      else if (this._tab === 'einst') body = this._settingsAdmin();
      else if (this._tab === 'advent') body = '<div id="advslot"></div>';
      else if (this._tab === 'zaehne') body = '<div id="zslot"></div>';
      else if (this._tab === 'geld') body = this._mnTabHtml();
      else if (this._tab === 'tier') body = this._peTabHtml();
      else body = this._todayAdmin(kids);
      const missed = this._missedTasks();
      const wishes = Object.values(this._db.req).filter((q) => q.wish && this._db.kid[q.kid]);
      const gradeQ = Object.values(this._db.req).filter((q) => q.grade && this._db.kid[q.kid]);
      const bookN = this._cfg.rdOn ? Object.values(this._db.req).filter((q) => q.book && this._db.kid[q.kid]).length : 0;
      const total = pend.length + reqs.length + missed.length + wishes.length + gradeQ.length + bookN;
      const aprSure = this._aprAllSure && Date.now() - this._aprAllSure < 8000;
      const btnMiss = this._admin() && this._autoChecked && !(this._autoOk || {}).app && this._cfg.nActions !== false && this._cfg.targets.some((t) => t.startsWith('mobile_app_'));
      const approvals = total ? `<div class="box"><h3>${T('🔔 Freigaben ({n})', { n: total })}</h3>${btnMiss ? `<div class="hint warn">${T('⚠️ Die Knöpfe in Push-Nachrichten wirken noch nicht – unter ⚙️ Einstellungen → 🔌 Geräte & Sprache → ✓ Knöpfe & Telegram-Befehle „⚙️ Automatisch anlegen“ tippen (als Administrator).')}</div>` : ''}
        ${pend.length > 1 ? `<div><button class="btn sm ${aprSure ? 'danger' : 'primary'}" data-a="aprall">${aprSure ? T('Wirklich alle {n} freigeben?', { n: pend.length }) : T('✓ Alle Aufgaben freigeben ({n})', { n: pend.length })}</button></div>` : ''}
        ${missed.map((p) => `<div class="row mrow">${this._avc(p.c)}<span class="grow">${esc(p.t.emoji || '')} ${esc(p.t.title)} – ${T('verpasst')}<small>${esc(p.c.name)} · ${p.date === dk(new Date()) ? T('heute') : longDate(p.date)}${p.t.to ? ` · ${T('bis {time}', { time: p.t.to })}` : ''}</small></span>
          <span class="mbtns"><button class="btn sm" data-a="mdec" data-h="e" data-d="${p.date}" data-t="${p.t.id}" data-k="${p.c.id}">${T('🙂 Entschuldigt')}</button><button class="btn sm danger" data-a="mdec" data-h="x" data-d="${p.date}" data-t="${p.t.id}" data-k="${p.c.id}">−${p.t.penalty || 0} ⭐</button><button class="btn sm" data-a="mdec" data-h="d" data-d="${p.date}" data-t="${p.t.id}" data-k="${p.c.id}">${T('✓ Doch erledigt')}</button></span></div>`).join('')}
        ${pend.map((p) => { const ph = this._mark(p.date, `f:${p.t.id}:${p.c.id}`); return `<div class="row">${ph ? `<button class="phth" data-a="phview" data-f="${esc(ph)}" title="${esc(T('Foto ansehen'))}">${this._photoUrl(ph) ? `<img class="phth" src="${esc(this._photoUrl(ph))}" alt="">` : '📷'}</button>` : this._avc(p.c)}<span class="grow">${esc(p.t.emoji || '')} ${esc(p.t.title)}<small>${esc(p.c.name)} · ${p.date === dk(new Date()) ? T('heute') : shortDate(p.date)} · +${p.t.points || 0} ⭐</small></span>
          <button class="icon no" data-a="rej" data-d="${p.date}" data-t="${p.t.id}" data-k="${p.c.id}">✕</button><button class="icon ok" data-a="apr" data-d="${p.date}" data-t="${p.t.id}" data-k="${p.c.id}">✓</button></div>`; }).join('')}
        ${reqs.filter((q) => q.pool).map((q) => { const r = this._db.reward[q.reward], dn = this._poolDone(q), payers = Object.keys(q.paid || {}), inv = dn && payers.length === 1 && q.need.length > 1 ? payers[0] : '';
          return `<div class="row"><span style="font-size:24px">${esc(r.emoji || '🎁')}</span><span class="grow">${inv ? T('💝 {name} lädt {others} ein: „{title}“', { name: esc(this._kn(inv)), others: esc(this._names(q.need.filter((id) => id !== inv))), title: esc(r.title) }) : T('👫 {names} lösen gemeinsam „{title}“ ein', { names: esc(this._names(q.need)), title: esc(r.title) })}
          <small>${q.need.map((id) => `${(q.cov || {})[id] ? '✓' : '⏳'} ${esc(this._kn(id))}`).join(' · ')}${dn ? '' : ` · ${T('wartet auf die anderen Kinder')}`}</small></span>
          <button class="icon no" data-a="rrej" data-q="${q.id}">✕</button>${dn ? `<button class="icon ok" data-a="rapr" data-q="${q.id}">✓</button>` : ''}</div>`; }).join('')}
        ${reqs.filter((q) => !q.pool).map((q) => { const r = this._db.reward[q.reward], c = this._db.kid[q.kid]; return `<div class="row">${this._avc(c)}<span class="grow">${esc(r.emoji || '🎁')} ${T('{title} einlösen', { title: esc(r.title) })}<small>${esc(c.name)} · ${this._cost(r, c.id)} ⭐ ${T('(hat {n})', { n: c.points || 0 })}</small></span>
          <button class="icon no" data-a="rrej" data-q="${q.id}">✕</button><button class="icon ok" data-a="rapr" data-q="${q.id}">✓</button></div>`; }).join('')}
        ${wishes.map((q) => { const c = this._db.kid[q.kid]; return `<div class="row">${this._avc(c)}<span class="grow">💡 ${esc(q.wish.emoji || '')} ${esc(q.wish.title)}<small>${T('Wunsch von {name} · Sterne festlegen und ✓ = als Belohnung anlegen', { name: esc(c.name) })}</small></span>
          <input type="number" min="1" class="wcost" data-q="${q.id}" value="${esc(String((this._wcost || {})[q.id] || 20))}" aria-label="${esc(T('Sterne'))}"><button class="icon no" data-a="rrej" data-q="${q.id}">✕</button><button class="icon ok" data-a="wapr" data-q="${q.id}">✓</button></div>`; }).join('')}
        ${gradeQ.map((q) => { const c = this._db.kid[q.kid], g = q.grade, st = g.rep ? Number(this._cfg.gRep === undefined ? 20 : this._cfg.gRep) || 0 : this._gStars(g.g); return `<div class="row">${g.photo ? `<button class="phth" data-a="phview" data-f="${esc(g.photo)}" title="${esc(T('Foto ansehen'))}">${this._photoUrl(g.photo) ? `<img class="phth" src="${esc(this._photoUrl(g.photo))}" alt="">` : '📷'}</button>` : this._avc(c)}<span class="grow">🎓 ${g.rep ? T('Zeugnis') : `${esc(g.s)}: ${esc(this._gFmt(g.g))}`}<small>${esc(c.name)} · +${st} ⭐</small></span>
          <button class="icon no" data-a="grej" data-q="${q.id}">✕</button><button class="icon ok" data-a="gapr" data-q="${q.id}">✓</button></div>`; }).join('')}${bookN ? this._rbAprHtml() : ''}</div>` : '';
      return `<div class="card">
        <div class="hd"><span class="tt">${LOGO}${this._ttl()}</span><span class="hint">${T('Eltern')}</span><button class="icon" data-a="hb" title="${esc(T('📖 Handbuch'))}" aria-label="${esc(T('📖 Handbuch'))}">📖</button>${this._pin() ? `<button class="icon" data-a="lock" title="${esc(T('Sperren'))}">🔒</button>` : ''}</div>
        ${this._updBanner()}
        ${this._chkBanner()}
        ${this._new20Html()}
        <div class="tabs" ${tabs.length > 5 ? `style="grid-template-columns:repeat(${tabs.length},minmax(0,1fr))"` : ''}>${tabs.map(([id, l]) => { const mm = String(l).match(/^(\S+)\s+(.*)$/); return `<button class="tab ${this._tab === id ? 'on' : ''}" data-a="tab" data-id="${id}" title="${esc(mm ? mm[2] : l)}" aria-label="${esc(mm ? mm[2] : l)}"><span class="te">${mm ? mm[1] : ''}${id === 'heute' && total ? `<b class="tbadge">${total}</b>` : ''}</span><span class="tl">${esc(mm ? mm[2] : l)}</span></button>`; }).join('')}</div>
        ${this._tab === 'heute' || !this._tab ? `${this._sensBanner()}${this._parHint(kids)}${this._scOn() ? this._scAdminHtml() : ''}${approvals}${this._vchAdmin(kids)}` : ''}
        ${body}</div>`;
    }

    // „⚙️ Automatisch anlegen“ nur für Administratoren – alle anderen sehen den Hinweis und nutzen das YAML darunter
    _autoBtn(k) { return this._admin() ? `<button class="btn primary sm" data-a="autonew" data-k="${k}">${T('⚙️ Automatisch anlegen')}</button>` : `<span class="hint">${T('🔒 Nur als Administrator – oder YAML kopieren')}</span>`; }

    _ptsYaml() {
      return `alias: Yippee! - Kids Chores – Sterne geben/abziehen
description: Gibt einem Kind Sterne (positive Zahl) oder zieht welche ab (negative Zahl). Gebucht wird, sobald eine Yippee!-Karte geöffnet ist.
mode: queued
icon: mdi:star-plus
fields:
  kind:
    name: Kind
    required: true
    example: Mia
    selector:
      text: {}
  sterne:
    name: Sterne
    description: Positiv = geben, negativ = abziehen
    required: true
    example: 2
    selector:
      number:
        min: -100
        max: 100
        mode: box
  grund:
    name: Grund
    required: false
    selector:
      text: {}
sequence:
  - action: todo.add_item
    target:
      entity_id: ${this._config.storage}
    data:
      item: "kp|act|{{ now().timestamp() | int }}{{ range(1000, 9999) | random }}"
      description: "{{ {'a': 'KP|pts|' ~ (kind | string | replace('|', '/')) ~ '|' ~ (sterne | int(0)) ~ '|' ~ (grund | default('') | string | replace('|', '/'))} | to_json }}"`;
    }

    // ⚙️ → 🎨 Darstellung: gilt für alle Karten, der Karten-Editor einer einzelnen Karte hat Vorrang
    _lookSection() {
      const c = this._cfg, sc = Math.min(130, Math.max(70, Number(c.vScale) || 100));
      const th = c.vTheme === 'custom' || THEMES.some((x) => x[0] === c.vTheme) ? c.vTheme : '';
      const thName = th === 'custom' ? T('✏️ Eigene Farben') : th ? T(THEMES.find((x) => x[0] === th)[1]) : '';
      const sum = [this._kView() === 'compact' ? T('📱 Kompakt') : '', thName, c.vEqual ? T('Gleich hohe Kacheln') : '', c.vCompact ? T('Kompakt') : '', c.vTransp ? T('Ohne Hintergrund') : '', sc !== 100 ? `${sc} %` : ''].filter(Boolean).join(' · ') || T('Standard');
      const sw = (bg, su, ac) => `<span class="thsw" style="background:${bg}"><i style="background:${su}"></i><i style="background:${ac}"></i></span>`;
      const fc = fullCols(c.vCol), bad = th === 'custom' && contrast(fc.text, fc.bg) < 3;
      const colRow = (k, l) => `<label>${l}<input type="color" data-cfgcol="${k}" value="${fc[k]}"></label>`;
      const colors = `<div class="lbl">${T('🎨 Farben')}</div>
        <div class="thm">
          <button type="button" class="thb ${th === '' ? 'on' : ''}" data-a="vtheme" data-v="">${sw('linear-gradient(135deg,#ffffff 50%,#1c1f26 50%)', 'transparent', 'transparent')}<span>${T('Wie das Dashboard')}</span></button>
          ${THEMES.map((t) => { const d = this._darkMode() && darkOf(t); return `<button type="button" class="thb ${th === t[0] ? 'on' : ''}" data-a="vtheme" data-v="${t[0]}">${d ? sw(d.bg, d.surface, d.accent) : sw(t[2], t[3], t[6])}<span>${T(t[1])}</span></button>`; }).join('')}
          <button type="button" class="thb ${th === 'custom' ? 'on' : ''}" data-a="vtheme" data-v="custom">${sw(fc.bg, fc.surface, fc.accent)}<span>${T('✏️ Eigene Farben')}</span></button>
        </div>
        ${th === 'custom' ? `<div class="colpk">${colRow('bg', T('Hintergrund'))}${colRow('surface', T('Kacheln'))}${colRow('text', T('Schrift'))}${colRow('accent', T('Akzentfarbe'))}</div>
          <div class="hint">${T('Tipp: Wähle zuerst den Hintergrund – Schrift und Kacheln passen sich dann automatisch an.')}</div>
          ${bad ? `<div class="hint warn">${T('⚠️ Die Schrift ist auf diesem Hintergrund schwer lesbar.')}</div>` : ''}
          <div class="btnrow"><button type="button" class="btn sm" data-a="vcolreset">${T('↺ Farben zurücksetzen')}</button></div>
          ${this._chk('vDarkOwn', !!c.vDarkOwn, T('🌙 Im Darkmode automatisch dunkel<small>Auf Geräten, auf denen Home Assistant dunkel eingestellt ist, werden deine Farben passend abgedunkelt. Die Akzentfarbe bleibt.</small>'))}` : ''}
        ${this._darkMode() && th && (th !== 'custom' || c.vDarkOwn) ? `<div class="hint">${T('🌙 Darkmode erkannt: Helle Vorlagen werden auf diesem Gerät automatisch dunkel.')}</div>` : ''}`;
      return ['look', T('🎨 Darstellung'), sum, `
        <div class="lbl">${T('🧒 Kinder-Ansicht')}</div>
        <div class="seg">${[['compact', T('📱 Kompakt (neu)')], ['classic', T('📜 Klassisch (lange Seite)')]].map(([v, l]) => `<button type="button" class="${this._kView() === v ? 'on' : ''}" data-a="cfgset" data-k="kView" data-v="${v}">${l}</button>`).join('')}</div>
        <div class="hint">${this._kView() === 'compact' ? T('Oben Kopf und Sammel-Knöpfe, dann nur „Jetzt dran“. Unten eine Leiste: 🏠 Heute · 🎁 Belohnungen · 🏆 Sammlung.') : T('Alles untereinander auf einer Seite – wie bis Version 1.8.')}</div>
        ${this._chk('kPages', !!c.kPages, T('📱 Ein Kind pro Seite<small>Für die Kinder-Karte mit allen Kindern: oben die Kinder zum Antippen, darunter immer nur ein Kind – zum nächsten Kind wischen. Jedes Gerät merkt sich das zuletzt gezeigte Kind. Geht auch als Karten-Option pages: true.</small>'))}
        ${colors}
        <div class="lbl">${T('📐 Anordnung')}</div>
        ${this._chk('vEqual', !!c.vEqual, T('📏 Gleich hohe Kacheln<small>Alle Aufgaben-Kacheln haben Platz für drei Zeilen – so liegen die Reihen auch mehrerer Kinder-Karten nebeneinander auf einer Linie. Längere Namen werden mit „…“ gekürzt. Belohnungen werden genauso angeglichen.</small>'))}
        ${this._chk('vCompact', !!c.vCompact, T('Kompakt – weniger Abstände'))}
        ${this._chk('vTransp', !!c.vTransp, T('Ohne eigenen Hintergrund (passt sich dem Dashboard an)'))}
        <label>${T('Größe')}<select data-cfgs="vScale">${[70, 80, 90, 100, 110, 120, 130].map((v) => `<option value="${v === 100 ? '' : v}" ${sc === v ? 'selected' : ''}>${v} %</option>`).join('')}</select></label>
        <div class="hint">${T('Gilt für alle Yippee!-Karten auf allen Geräten. Was im Karten-Editor einer einzelnen Karte eingestellt ist (✏️ Dashboard bearbeiten → Karte bearbeiten → 🎨 Darstellung), hat Vorrang – z. B. nur das Tablet größer.')}<br>${T('Farben lassen sich über Themes oder card_mod anpassen: --yippee-bg, --yippee-surface, --yippee-accent, --yippee-text.')}</div>
        <label>${T('🔠 Größe nur auf diesem Gerät')}<select data-devscale="1">${(() => { let d = ''; try { d = localStorage.getItem('yippee_scale') || ''; } catch (e) { d = ''; } return [['', T('wie oben')], ...[90, 100, 110, 120, 130, 140, 150].map((v) => [String(v), `${v} %`])].map(([v, l]) => `<option value="${v}" ${d === v ? 'selected' : ''}>${l}</option>`).join(''); })()}</select></label>
        <div class="hint">${T('Zum Beispiel größere Schrift am Kinder-Tablet zum Lesenlernen: einmal auf dem Tablet hier einstellen. Gilt nur für dieses Gerät und hat Vorrang.')}</div>
        <div class="lbl">${T('♿ Barrierefreiheit')}</div>
        ${this._chk('vHC', !!c.vHC, T('🔳 Hoher Kontrast<small>Schwarzer Hintergrund, weiße Schrift, gelbe Akzente und deutliche Rahmen – leichter lesbar bei schwachen Augen oder in hellem Licht.</small>'))}
        ${this._chk('vCalm', !!c.vCalm, T('🐢 Weniger Bewegung<small>Kein Konfetti, keine Animationen. Ist am Gerät „Bewegung reduzieren“ eingeschaltet, gilt das automatisch.</small>'))}
        ${(() => { const g = (k) => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }; const opt = (k) => [['', T('wie oben')], ['1', T('an')], ['0', T('aus')]].map(([v, l]) => `<option value="${v}" ${g(k) === v ? 'selected' : ''}>${l}</option>`).join(''); return `<label>${T('🔳 Kontrast nur auf diesem Gerät')}<select data-devls="yippee_hc">${opt('yippee_hc')}</select></label><label>${T('🐢 Bewegung nur auf diesem Gerät')}<select data-devls="yippee_calm">${opt('yippee_calm')}</select></label>`; })()}
        <div class="hint">${T('Mit der Tastatur bedienbar: Tab springt weiter, Enter oder Leertaste tippt an, Esc schließt ein Fenster. Symbol-Knöpfe werden für Screenreader beschriftet.')}</div>`];
    }

    _langSection() {
      const c = this._cfg, auto = !c.lang;
      const ha = String((this._hass && (this._hass.language || (this._hass.locale && this._hass.locale.language))) || '').toLowerCase();
      const name = (code) => (LANGS.find((l) => l[0] === code) || [code, code])[1];
      return ['lang', T('🌐 Sprache'), name(Y.LANG), `
        <label>${T('Sprache der Karte')}<select data-cfgs="lang"><option value="" ${auto ? 'selected' : ''}>${esc(T('Automatisch (Sprache von Home Assistant: {l})', { l: this._haLangName() || ha || '–' }))}</option>${LANGS.map(([code, n]) => `<option value="${code}" ${c.lang === code ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
        <div class="hint">${T('Gilt für alle Geräte. Eine einzelne Karte (z. B. auf dem Kinder-Tablet) kann im Karten-Editor eine eigene Sprache bekommen. Bei „Automatisch“ zeigt jedes Gerät die Sprache des angemeldeten Home-Assistant-Benutzers (Profil → Sprache).')}</div>
        <div class="hint">${T('Feiertags- und Feriennamen kommen in der gewählten Sprache, sofern der Datendienst sie anbietet.')}</div>`];
    }

    _settingsAdmin() {
      this._autoStatus();
      const c = this._cfg, sc = this._streakCfg;
      const avail = Object.keys((this._hass.services && this._hass.services.notify) || {});
      const phones = avail.filter((x) => x.startsWith('mobile_app_')).sort();
      const others = avail.filter((x) => !x.startsWith('mobile_app_') && !['notify', 'send_message', 'persistent_notification'].includes(x)).sort();
      const chk = (k, on, label, extra = '') => `<label class="crow"><input type="checkbox" data-a="cfg" data-k="${k}" ${extra} ${on ? 'checked' : ''}><span>${label}</span></label>`;
      const allEnts = Object.keys(this._hass.states).filter((e) => e.startsWith('notify.')).sort();
      const ents = allEnts.filter((e) => this._isTg(e));
      const nz = (x) => String(x || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const pk = phones.map((p) => nz(p.replace('mobile_app_', ''))).filter((k) => k.length > 2), pn = phones.map((p) => nz(this._phoneName(p)));
      const isPhone = (e) => { const o = nz(e.slice(7)); return pk.some((k) => o.includes(k) || k.includes(o)) || pn.includes(nz(this._ename(e))); };
      const rest = [...allEnts.filter((e) => !ents.includes(e) && (c.targets.includes(e) || !isPhone(e))), ...others.filter((o) => !/telegram/i.test(o))];
      const missing = c.targets.filter((t) => (t.includes('.') ? !this._hass.states[t] : !avail.includes(t)));
      const st = this._config.storage;
      const auto = yml(this._autoCfg('app')).trim();
      const autoTg = `alias: Yippee! - Kids Chores – Telegram-Knöpfe
description: Freigeben/Ablehnen direkt aus der Telegram-Nachricht
mode: queued
triggers:
  - trigger: event
    event_type: telegram_callback
conditions:
  - condition: template
    value_template: "{{ (trigger.event.data.data | default('')).startswith('/KP|') }}"
actions:
  - action: todo.add_item
    target:
      entity_id: ${st}
    data:
      item: "kp|act|{{ now().timestamp() | int }}{{ range(1000, 9999) | random }}"
      description: "{{ {'a': trigger.event.data.data[1:]} | to_json }}"
  - action: telegram_bot.answer_callback_query
    continue_on_error: true
    data:
      callback_query_id: "{{ trigger.event.data.id }}"
      message: "✓ Erledigt"
  - action: telegram_bot.edit_replymarkup
    continue_on_error: true
    data:
      chat_id: "{{ trigger.event.data.chat_id }}"
      message_id: "{{ trigger.event.data.message.message_id }}"
      inline_keyboard: []`;
      const hasTg = (c.tgTargets || []).some((x) => c.targets.includes(x));
      const st2 = this._config.storage;
      const ok = this._autoOk || {};
      const hasTgAny = c.targets.some((t) => (c.tgTargets || []).includes(t) || (t.includes('.') ? this._isTg(t) : /telegram/i.test(t)));
      const autoCmd = `alias: Yippee! - Kids Chores – Telegram-Befehle
description: /punkte, /offen, /heute, /woche und /hilfe im Telegram-Chat
mode: queued
triggers:
  - trigger: event
    event_type: telegram_command
conditions:
  - condition: template
    value_template: "{{ ((trigger.event.data.command | default('')).split('@')[0] | lower) in ['/punkte', '/offen', '/heute', '/woche', '/hilfe'] }}"
actions:
  - action: todo.add_item
    target:
      entity_id: ${st2}
    data:
      item: "kp|act|{{ now().timestamp() | int }}{{ range(1000, 9999) | random }}"
      description: "{{ {'a': 'KPC|' ~ (trigger.event.data.command.split('@')[0] | lower)[1:]} | to_json }}"`;
      const whenOn = [c.nTask, c.nReward, c.nMiss, c.nWeekly !== false, c.dOn].filter(Boolean).length;
      const X = this._settingsExtra();
      const sec = [
        this._langSection(),
        this._lookSection(),
        ['notif', T('📱 Benachrichtigungen an'), c.targets.length ? T('{n} ausgewählt', { n: c.targets.length }) : T('keine'), `
          ${phones.map((p) => chk('target', c.targets.includes(p), `${this._phoneName(p)} <small>notify.${p}</small>`, `data-v="${p}"`)).join('') || `<div class="hint">${T('Keine Handys mit der Home-Assistant-App gefunden.')}</div>`}
          <div class="lbl">${T('📨 Telegram-Chats')}</div>
          ${[...ents, ...others.filter((o) => /telegram/i.test(o))].map((p) => `${chk('target', c.targets.includes(p), p.includes('.') ? `${esc(this._ename(p))}<small>${p}</small>` : `Telegram <small>notify.${p}</small>`, `data-v="${p}"`)}${c.targets.includes(p) ? `<div class="sub">${chk('tg', (c.tgTargets || []).includes(p), T('📨 Freigabe-Knöpfe mitsenden'), `data-v="${p}"`)}</div>` : ''}`).join('') || `<div class="hint">${T('Keine Telegram-Chats gefunden. In Home Assistant die Telegram-Bot-Integration einrichten und den Chat hinzufügen.')}</div>`}
          ${rest.length ? `<details ${rest.some((o) => c.targets.includes(o)) ? 'open' : ''}><summary class="hint">${T('Telegram-Chat nicht dabei? Weitere Dienste anzeigen ({n})', { n: rest.length })}</summary>${rest.map((p) => `${chk('target', c.targets.includes(p), p.includes('.') ? `${esc(this._ename(p))}<small>${p}</small>` : `${esc(p)}<small>notify.${p}</small>`, `data-v="${p}"`)}${c.targets.includes(p) ? `<div class="sub">${chk('tg', (c.tgTargets || []).includes(p), T('📨 Das ist Telegram – Freigabe-Knöpfe mitsenden'), `data-v="${p}"`)}</div>` : ''}`).join('')}</details>` : ''}
          ${missing.length ? `<div class="hint">${T('⚠️ Nicht mehr gefunden: {list}', { list: missing.map((m) => esc(m)).join(', ') })}</div>` : ''}
          <div><button class="btn" data-a="ntest" ${c.targets.length ? '' : 'disabled'}>${T('📨 Test-Nachricht senden')}</button></div>`],
        ['when', T('🔔 Benachrichtigen bei …'), T('{n} von 5', { n: whenOn }), `
          ${chk('nTask', c.nTask, T('✅ erledigten Aufgaben (zum Freigeben)'))}
          ${chk('nReward', c.nReward, T('🎁 Belohnungs-Wünschen'))}
          ${chk('nMiss', c.nMiss, T('⏰ verpassten Aufgaben mit Minuspunkten'))}
          ${chk('nWeekly', c.nWeekly !== false, T('📊 Wochenrückblick'))}
        ${c.nWeekly !== false ? `<div class="fopt"><div class="g2 g2e"><label>${T('Tag')}<select data-cfgs="wDay">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<option value="${d}" ${Number(c.wDay === undefined || c.wDay === '' ? 0 : c.wDay) === d ? 'selected' : ''}>${esc(Y.DAYS[d])}</option>`).join('')}</select></label>
          <label>${T('Uhrzeit')}<input type="time" data-cfgs="wTime" value="${esc(/^\d\d:\d\d$/.test(String(c.wTime || '')) ? c.wTime : '19:00')}"></label></div>
          ${this._repOpts('w')}
          <div><button class="btn" data-a="wtest" ${c.targets.length ? '' : 'disabled'}>${T('📊 Wochenrückblick jetzt senden')}</button></div></div>` : ''}
          ${chk('wkRep', !!c.wkRep, T('📊 Wochenbericht<small>Sonntags ab 18 Uhr pro Kind: erledigte Aufgaben, verdiente und ausgegebene Sterne, Stand – dazu Spardose, Sticker und Ostereier, wenn eingeschaltet. Geht an die Geräte des Wochenrückblicks.</small>'))}
        ${c.wkRep ? `<div class="fopt"><div><button class="btn" data-a="wkrtest" ${c.targets.length ? '' : 'disabled'}>${T('📊 Wochenbericht jetzt senden')}</button></div></div>` : ''}
          ${chk('dOn', !!c.dOn, T('🌙 Tagesabschluss – abends eine Übersicht, wer was geschafft hat'))}
        ${c.dOn ? `<div class="fopt"><label>${T('Uhrzeit')}<input type="time" data-cfgs="dTime" value="${esc(c.dTime || '20:00')}"></label>
          ${this._chk('dOpen', !!c.dOpen, T('📋 Offene Aufgaben mit auflisten'))}
          ${this._repOpts('d')}
          <div><button class="btn" data-a="dtest" ${c.targets.length ? '' : 'disabled'}>${T('🌙 Jetzt senden')}</button></div></div>` : ''}
          ${c.sensors !== false ? `<div class="lbl">${T('📋 Abend-Erinnerung')}</div>
          ${this._autoRowSig('remind', T('📋 Abends erinnern, wenn ein Kind noch nicht alles erledigt hat'), `<div class="fopt"><label>${T('Uhrzeit')}<input type="time" data-cfgs="remT" value="${esc(/^\d\d:\d\d$/.test(c.remT || '') ? c.remT : '19:00')}"></label></div>`)}
          <div class="hint">${T('Kommt nur, wenn noch etwas offen ist – anders als der Tagesabschluss, der immer kommt. Eine Automation in Home Assistant, läuft auch ohne geöffnete Karte.')}${c.targets.length ? '' : ` ${T('⚠️ Für Nachrichten zuerst unter 🔔 Benachrichtigungen ein Ziel auswählen.')}`}</div>` : ''}
`],
        ['btn', T('✓ Knöpfe &amp; Telegram-Befehle'), [c.nActions !== false ? T('Knöpfe an') : T('Knöpfe aus'), c.cmdOn ? T('Befehle an') : ''].filter(Boolean).join(' · '), `
          ${chk('nActions', c.nActions !== false, T('Freigeben / Ablehnen direkt in der Push-Nachricht anzeigen'))}
          ${this._btnInfo()}
          ${hasTg ? `<div><button class="btn" data-a="tgtest">${T('📨 Telegram-Test mit Knöpfen')}</button></div>` : ''}
          ${this._tgErr ? `<div class="hint">⚠️ ${T('Telegram hat die Nachricht mit Knöpfen abgelehnt – sie kam ohne Knöpfe an. Meldung: {err}', { err: esc(this._tgErr) })}</div>` : ''}
          ${c.targets.some((t) => (t.includes('.') ? this._isTg(t) : /telegram/i.test(t)) && !(c.tgTargets || []).includes(t)) ? `<div class="hint">${T('⚠️ Bei einem Telegram-Chat ist „📨 Freigabe-Knöpfe mitsenden“ nicht angehakt (unter 📱 Benachrichtigungen an).')}</div>` : ''}
          ${c.approval ? '' : `<div class="hint">${T('ℹ️ Die Freigabe ist ausgeschaltet – dann gibt es keine Nachrichten zum Freigeben und damit auch keine Knöpfe.')}</div>`}
          <div class="hint">${T('Damit die Knöpfe etwas tun, braucht es je eine kleine Automation. Die Karte legt sie mit einem Tipp selbst an (als Administrator angemeldet).')}</div>
          <div class="arow"><span class="grow">${T('📱 HA-App')}</span>${(this._autoOk || {}).app ? `<span class="okb">${T('✅ angelegt')}</span>` : `${this._autoBtn('app')}`}</div>
          <details><summary class="hint">${T('YAML zum manuellen Anlegen')}</summary><pre class="code">${esc(auto)}</pre>
            <button class="btn" data-a="copyauto">${T('📋 Kopieren')}</button></details>
          ${hasTg ? `<div class="arow"><span class="grow">📨 Telegram</span>${(this._autoOk || {}).tg ? `<span class="okb">${T('✅ angelegt')}</span>` : `${this._autoBtn('tg')}`}</div>
          <details><summary class="hint">${T('YAML zum manuellen Anlegen')}</summary><pre class="code">${esc(autoTg)}</pre>
            <button class="btn" data-a="copyauto">${T('📋 Kopieren')}</button></details>
          <div class="hint">${T('Die Telegram-Automation gilt für alle ausgewählten Telegram-Chats – Telegram meldet selbst, aus welchem Chat der Knopf kommt.')}</div>` : `<div class="hint">${T('Für Telegram-Knöpfe oben einen Telegram-Chat auswählen und „Telegram – Freigabe-Knöpfe mitsenden“ anhaken.')}</div>`}
          <div class="hint">${T('Falls du eine dieser Automationen schon von Hand angelegt hast, lösche die alte – sonst läuft sie doppelt (schadet nicht, ist aber unnötig).')}</div>
          <div class="hint">${T('Ausgeführt wird die Freigabe, sobald irgendwo eine Yippee!-Karte geöffnet ist (z. B. das Tablet).')} ${T('📱 Die Nachricht verschwindet nach dem Tippen sofort auf allen ausgewählten Handys – auch wenn keine Karte geöffnet ist. Ändern sich die Handys, schreibt die Karte die Automation beim nächsten Öffnen der Eltern-Ansicht (als Administrator) selbst neu.')}</div>
          <div class="lbl">${T('💬 Telegram-Befehle')}</div>
        ${this._chk('cmdOn', !!c.cmdOn, T('💬 Telegram-Befehle<small>Im Telegram-Chat /punkte, /offen, /heute, /woche oder /hilfe schreiben – die Antwort kommt sofort zurück.</small>'))}
        ${c.cmdOn ? `<div class="fopt">${hasTgAny ? '' : `<div class="hint">${T('⚠️ Unter „📱 Benachrichtigungen an“ zuerst einen Telegram-Chat auswählen – dorthin kommt die Antwort.')}</div>`}
          <div class="arow"><span class="grow">${T('💬 Befehle-Automation')}</span>${ok.cmd ? `<span class="okb">${T('✅ angelegt')}</span>` : `${this._autoBtn('cmd')}`}</div>
          <details><summary class="hint">${T('YAML zum manuellen Anlegen')}</summary><pre class="code">${esc(autoCmd)}</pre><button class="btn" data-a="copyauto">${T('📋 Kopieren')}</button></details>
          <div class="hint">${T('Beantwortet wird, sobald irgendwo eine Yippee!-Karte geöffnet ist (z. B. das Tablet).')}</div></div>` : ''}
`],
        ['streak', T('🔥 Serien-Bonus'), sc.on ? T('alle {days} Tage +{bonus} ⭐', { days: sc.days, bonus: sc.bonus }) : T('aus'), `
          ${chk('streakOn', sc.on, T('Bonus für Aufgaben, die mehrere Tage am Stück erledigt werden'))}
          <div class="g2 g2e"><label>${T('Alle … Tage in Folge')}<input type="number" min="2" data-min="2" data-cfgn="streakDays" value="${sc.days}"></label>
          <label>${T('Bonus-Punkte')}<input type="number" min="0" data-cfgn="streakBonus" value="${sc.bonus}"></label></div>
          <div class="hint">${T('Entschuldigte Tage unterbrechen die Serie nicht. Die Kinder sehen ihre Serie als 🔥 auf der Kachel.')}</div>`],
        ['appr', T('👍 Freigabe'), c.approval ? T('an') : T('aus'), `
          ${chk('approval', c.approval, T('Erledigte Aufgaben und Einlösungen müssen von Eltern freigegeben werden'))}
          <div class="hint">${T('Ausgeschaltet gibt es die Punkte sofort beim Antippen.')}</div>
          ${this._chk('famMinus', !!c.famMinus, T('➖ Minuspunkte ziehen auch vom Familienziel ab<small>Verpasst ein Kind eine Aufgabe und du bestätigst die Minuspunkte, sinkt auch das Familienziel. Einlösen von Belohnungen und Taschengeld zieht nie ab.</small>'))}`],
        this._secSection(),
        X.audio,
        this._bgSection(),
        ...Object.values(this._settingsFeatures()),
        ...X.rest,
        this._memSection(),
        this._trashSection(),
        this._auditSection(),
        this._updSection(),
      ];
      const byId = {}; sec.forEach((x) => { byId[x[0]] = x; });
      const groups = [
        [T('⚙️ Allgemein'), ['lang', 'look', 'vac', 'sec', 'f_advOn', 'f_zOn', 'f_mnOn', 'f_peOn', 'f_scOn']],
        [T('✅ Aufgaben & Tagesablauf'), ['f_dayBlocks', 'f_routOn', 'f_extraOn', 'f_photoOn', 'f_nfcOn', 'f_muellOn', 'f_calOn', 'f_orderOn', 'f_prevOn']],
        [T('⭐ Punkte & Boni'), ['appr', 'streak', 'f_wbOn', 'f_teamOn', 'f_dblOn', 'f_bdOn', 'f_behavOn', 'f_negOn', 'f_gradesOn']],
        [T('🎁 Belohnungen & Geld'), ['f_goalOn', 'f_progOn', 'f_wishOn', 'f_jokerOn', 'f_shareOn', 'f_costKidOn', 'f_walletOn', 'f_priceOn', 'money']],
        [T('🎉 Spaß & Sammeln'), ['f_wheelOn', 'f_stkOn', 'f_eggOn', 'f_hwOn', 'f_rdOn']],
        [T('🔔 Benachrichtigungen'), ['notif', 'when', 'f_welcOn', 'bg']],
        [T('🔌 Geräte & Sprache'), ['btn', 'audio', 'f_voiceOn', 'f_lmOn', 'sens']],
        [T('📈 Auswertung'), ['f_checkOn', 'audit']],
        [T('💾 Daten'), ['bk', 'mem', 'trash', 'upd']],
      ];
      const used = new Set(groups.flatMap((g) => g[1]));
      groups[0][1].push(...sec.map((x) => x[0]).filter((id) => !used.has(id)));
      const simple = c.setView === 'simple', SIMPLE = ['lang', 'vac', 'appr', 'notif', 'bk', 'sec'];
      const grouped = groups.flatMap(([title, ids], gi) => { const items = ids.filter((id) => !simple || SIMPLE.includes(id)).map((id) => byId[id]).filter(Boolean); return items.length ? [['@', title, gi], ...items] : []; });
      // 🧩 „Alle Einstellungen“ startet mit einer Kachel je Gruppe – Antippen zeigt nur diese Gruppe, die Suche sucht immer in allen
      const gOf = {}; groups.forEach(([, ids], gi) => ids.forEach((id) => { gOf[id] = gi; }));
      const tiles = !simple && !this._accAll;
      if (tiles && this._accOpen && gOf[this._accOpen] != null) this._setG = gOf[this._accOpen]; // offener Abschnitt bestimmt die Gruppe (auch bei direkten Sprüngen)
      if (this._setG != null && !groups[this._setG]) this._setG = null;
      const sq0 = tiles && !!hbNorm(this._setQ || '').trim(), gSel = tiles ? this._setG : null;
      const plain = (x) => String(x || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/^[^\p{L}\p{N}]+/u, '').trim();
      const tileHtml = tiles ? `<div class="settiles" ${sq0 || gSel != null ? 'hidden' : ''}>${groups.map(([title, ids], gi) => {
        const it = ids.map((id) => byId[id]).filter(Boolean); if (!it.length) return '';
        const sws = it.filter((x) => x[4]), on = sws.filter((x) => x[4].on).length, sp = String(title).indexOf(' ');
        const names = it.slice(0, 3).map((x) => esc(plain(x[1]))).join(' · ') + (it.length > 3 ? ' …' : '');
        return `<button type="button" class="settile" data-a="setg" data-g="${gi}"><i>${title.slice(0, sp)}</i><b>${title.slice(sp + 1)}</b><small>${names}</small><em>${sws.length ? T('{on} von {n} an', { on, n: sws.length }) : T('{n} Einstellungen', { n: it.length })}</em></button>`;
      }).join('')}</div><button type="button" class="btn sm setback" data-a="setg" data-g="" ${sq0 || gSel == null ? 'hidden' : ''}>← ${T('Alle Einstellungen')}</button>` : '';
  
      const sw = `<div class="segsw"><button class="${simple ? 'on' : ''}" data-a="setview" data-v="simple">${T('Einfach')}</button><button class="${simple ? '' : 'on'}" data-a="setview" data-v="all">${T('Alle Einstellungen')}</button></div>`;
      const sq = simple ? '' : `<input type="search" class="setq" enterkeyhint="search" autocomplete="off" placeholder="${esc(T('🔎 Einstellungen durchsuchen …'))}" aria-label="${esc(T('🔎 Einstellungen durchsuchen …'))}" value="${esc(this._setQ || '')}">`;
      return `<button class="btn hbopen" data-a="hb">${T('📖 Handbuch öffnen')}</button>${sw}${sq}${tileHtml}${this._accHtml(grouped, tiles ? { gOf, g: gSel, hide: !sq0 && gSel == null, q: sq0 } : null)}${simple ? '' : `<button type="button" class="btn sm setmore" data-a="setmore" hidden></button><div class="empty setnone" hidden>${T('Keine passende Einstellung gefunden.')}</div>`}
        ${simple ? `<div class="hint">${T('Weitere Funktionen wie Serien-Bonus, Taschengeld, Routinen, NFC oder Sprachausgabe gibt es unter „Alle Einstellungen“.')}</div>` : ''}
        <div class="hint">${T('Alle Einstellungen gelten automatisch auch für die Kinder-Ansichten.')}</div>
        <button class="btn sm wizagain" data-a="wizstart">${T('🧭 Einrichtungs-Assistent starten')}</button>`;
    }

    _vchAdmin(kids) {
      if (!this._cfg.walletOn) return '';
      const rows = [];
      kids.forEach((k) => (k.vouch || []).forEach((v) => rows.push(`<div class="row">${this._avc(k)}<span class="grow">${esc(v.e || '🎁')} ${esc(v.t)}<small>${T('{name} · eingelöst am {date}', { name: esc(k.name), date: shortDate(v.d) })}</small></span>
        <button class="btn sm" data-a="vuse" data-k="${k.id}" data-v="${esc(v.id)}"><span class="hint">${this._vSure(k.id, v.id) ? T('Bekommen? Nochmal tippen') : T('✓ Bekommen')}</span></button></div>`)));
      if (!rows.length) return '';
      if (this._vchShut === undefined) { try { this._vchShut = localStorage.getItem('kpVchShut') === '1'; } catch (e) { this._vchShut = false; } }
      const open = !this._vchShut;
      return `<div class="acc box vchbox ${open ? 'open' : ''}"><button class="acch" data-a="vchtog"><span class="grow">${T('🎟️ Eingelöst – noch nicht bekommen ({n})', { n: rows.length })}</span><span class="accc">▸</span></button>${open ? `<div class="accb">${rows.join('')}</div>` : ''}</div>`;
    }

    _bgSection() {
      const c = this._cfg, ok = (this._autoOk || {}).bg, act = this._bgActive();
      const p = this._db.plan.main, days = p && p.d ? Object.keys(p.d).sort() : [];
      const sum = !c.bgOn ? T('aus') : act ? T('aktiv') : T('Automation fehlt');
      let yaml = '';
      if (c.bgOn) { try { yaml = `${yml(this._autoCfg('bg')).trim()}\n`; } catch (e) { yaml = ''; } }
      return ['bg', T('🌙 Hintergrund-Automation'), sum, `
        <div class="hint">${T('Morgen-Ansage, Erinnerungen, Verpasst-Meldungen, Tagesabschluss und die Telegram-Befehle laufen dann direkt in Home Assistant – auch wenn nirgends eine Karte geöffnet ist.')}</div>
        ${this._chk('bgOn', !!c.bgOn, T('🌙 Hintergrund-Automation verwenden'))}
        ${c.bgOn ? `<div class="fopt">
          <div class="arow"><span class="grow">${T('🌙 Hintergrund-Automation')}</span>${ok ? `<span class="okb">${act ? T('✅ angelegt') : T('⚠️ ausgeschaltet')}</span>` : `${this._autoBtn('bg')}`}</div>
          <details><summary class="hint">${T('YAML zum manuellen Anlegen')}</summary><pre class="code">${esc(yaml)}</pre><button class="btn" data-a="copyauto">${T('📋 Kopieren')}</button></details>
          <div class="hint">${days.length ? T('📅 Plan bis {date} gespeichert.', { date: shortDate(days[days.length - 1]) }) : T('Plan wird gleich gespeichert …')} ${T('Die Karte schreibt dafür einen Plan für die nächsten 14 Tage in die Liste und frischt ihn auf, sobald sie irgendwo geöffnet ist. Ändern sich Uhrzeiten, passt eine Eltern-Karte (Administrator) die Automation selbst an.')}</div>
          <div class="hint">${T('Weiterhin nur mit geöffneter Karte: Punkte buchen (auch Freigaben und Minuspunkte über die Knöpfe – sie werden nachgeholt, sobald eine Karte offen ist), Wochenrückblick und Geburtstag.')}</div>
        </div>` : ''}`];
    }

    _accHtml(sec, tl) {
      const isO = (id) => this._accAll || this._accOpen === id;
      const gA = (g) => (tl ? ` data-g="${g}"${!tl.q && tl.g != null && g !== tl.g ? ' hidden' : ''}` : '');
      // Suchtext je Abschnitt: Titel, Kurzinfo und Text des Inhalts (ohne YAML-Blöcke) – für das Suchfeld unter „Alle Einstellungen“
      const qt = (x) => hbNorm(String(x || '').replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ')).slice(0, 1500);
      const hbBtn = (id) => (HB_TOPIC[id] ? `<div class="hbsec"><button type="button" class="btn sm" data-a="hbt" data-t="${HB_TOPIC[id]}">${T('📖 Mehr dazu im Handbuch')}</button></div>` : '');
      return `<div class="accw" ${tl && tl.hide ? 'hidden' : ''}>${sec.map(([id, title, sum, body, sw]) => (id === '@' ? `<div class="accgrp"${gA(sum)}>${title}</div>` : `<div class="acc box ${isO(id) ? 'open' : ''}"${gA(tl ? tl.gOf[id] : 0)} data-t="${esc(qt(`${title} ${sum} ${SET_KW[id] ? T(SET_KW[id]) : ''}`))}" data-d="${esc(qt((/<div class="hint fdesc">([\s\S]*?)<\/div>/.exec(body) || [])[1] || ''))}" data-q="${esc(qt(`${title} ${sum} ${body.replace(/<select[\s\S]*?<\/select>/g, ' ')}`))}"><div class="acchr"><button class="acch" data-a="acc" data-id="${id}"><span class="grow">${title}${sum ? `<small class="accs">${sum}</small>` : ''}</span><span class="accc">▸</span></button>${sw ? `<label class="accsw"><input type="checkbox" data-a="cfg" data-k="${sw.k}" ${sw.on ? 'checked' : ''} aria-label="${esc(String(title).replace(/<[^>]+>/g, ''))}"><span class="swt"></span></label>` : ''}</div>${isO(id) ? `<div class="accb ${this._accAnim === id ? 'anim' : ''}">${body}${hbBtn(id)}</div>` : ''}</div>`)).join('')}</div>`;
    }

    _countryOpts(sel) {
      let dn = null;
      try { dn = new Intl.DisplayNames([this._lang || 'de'], { type: 'region' }); } catch (e) { dn = null; }
      return COUNTRIES.map((cc) => [cc, (dn && dn.of(cc)) || cc]).sort((a, b) => a[1].localeCompare(b[1], this._lang || 'de'))
        .map(([cc, n]) => `<option value="${cc}" ${sel === cc ? 'selected' : ''}>${esc(n)}</option>`).join('');
    }

    _regionSel() {
      const c = this._cfg, L = String(this._lang || 'de').slice(0, 2).toUpperCase(), key = `${c.hc}|${L}`;
      const list = (window.__kpSubs || {})[key];
      if (!list) {
        if (!this._subsBusy) { this._subsBusy = true; this._subsLoad(c.hc).catch(() => { (window.__kpSubs = window.__kpSubs || {})[key] = []; this._subsErr = c.hc; }).finally(() => { this._subsBusy = false; this._render(); }); }
        return `<label>${T('Region')}<select data-cfgs="hr" disabled><option>${c.hr ? esc(c.hr) : T('Lade Regionen …')}</option></select></label>`;
      }
      if (!list.length) return `<div class="hint">${this._subsErr === c.hc ? T('⚠️ Regionen konnten nicht geladen werden – es gelten landesweite Ferien/Feiertage bzw. die Kalender aus Home Assistant.') : T('Für dieses Land gibt es keine Regionen – es gelten die landesweiten Daten.')}</div>`;
      return `<label>${T('Region')}<select data-cfgs="hr"><option value="">${T('– ganzes Land (nur landesweite Tage) –')}</option>${list.map((x) => `<option value="${esc(x.code)}" ${c.hr === x.code ? 'selected' : ''}>${' '.repeat(x.depth)}${esc(x.name)}${x.cat && x.depth ? ` (${esc(x.cat)})` : ''}</option>`).join('')}</select></label>
        <div class="hint">${T('So genau wie möglich wählen, z. B. ein Département – Ferien und Feiertage der übergeordneten Region gelten automatisch mit.')}</div>`;
    }

    _holSettings() {
      const c = this._cfg, h = c.hol || {}, today = dk(new Date());
      const { fe, sc } = this._hass ? this._holCals() : { fe: '', sc: '' };
      const cals = Object.keys(this._hass.states).filter((e) => e.startsWith('calendar.')).sort();
      const key = this._holKey(), ok = key && h.sub === key && h.src && h.src !== 'none';
      const m = this._holData();
      const nextPh = m ? Object.keys(m.ph).filter((d) => d >= today).sort().slice(0, 3).map((d) => `${shortDate(d)} ${esc(m.ph[d])}`) : [];
      const nextSh = m ? m.sh.filter((x) => x.to >= today).sort((a, b) => a.from.localeCompare(b.from)).slice(0, 2).map((x) => `${esc(x.n)} ${shortDate(x.from)}–${shortDate(x.to)}`) : [];
      const status = !c.hc ? '' : this._holBusy ? T('⏳ Lade Ferien und Feiertage …') : ok ? T('✅ {ph} Feiertage · {sh} Ferien-Zeiträume ({src}, Stand {date})', { ph: Object.keys(m ? m.ph : {}).length, sh: (m ? m.sh : []).length, src: h.src === 'api' ? T('aus dem Internet') : T('aus Home-Assistant-Kalendern'), date: shortDate(h.at || today) }) : T('⚠️ Noch keine Daten{err} – die Karte versucht es automatisch weiter.', { err: h.err ? ` (${esc(h.err)})` : '' });
      return `<div class="lbl">${T('🗺️ Ferien &amp; Feiertage automatisch')}</div>
        <label>${T('Land')}<select data-cfgs="hc"><option value="">${T('– keins –')}</option>${this._countryOpts(c.hc)}</select></label>
        ${c.hc ? this._regionSel() : ''}
        ${c.hc ? `<div class="hint">${status}</div>
          ${nextPh.length ? `<div class="hint">${T('🎉 Nächste Feiertage: {list}', { list: nextPh.join(' · ') })}</div>` : ''}
          ${nextSh.length ? `<div class="hint">${T('🎒 Nächste Ferien: {list}', { list: nextSh.join(' · ') })}</div>` : ''}
          ${this._chk('holFree', c.holFree !== false, T('🎉 An Feiertagen aufgabenfrei (keine Pflicht-Aufgaben, keine Minuspunkte)'))}
          ${this._chk('ferFree', !!c.ferFree, T('🏖️ In den Schulferien komplett aufgabenfrei<small>Sonst pausieren in den Ferien nur Aufgaben mit „🎒 Nur an Schultagen“ (bei der Aufgabe ✎ anhaken).</small>'))}
          <div><button class="btn" data-a="holnow">${T('🔄 Jetzt aktualisieren')}</button></div>
          <details ${h.src === 'ha' || (c.hc && !ok) ? 'open' : ''}><summary class="hint">${T('Ausweichlösung: Kalender aus Home Assistant')}</summary>
            <div class="hint">${T('Wird automatisch genutzt, wenn der Internet-Abruf nicht klappt. Feiertage: Integration „Holiday“ (Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Holiday“, Land + Region). Ferien: ein Ferien-Kalender, z. B. über den Marketplace (HACS) „HASH“ oder einen Ferien-iCal-Link mit „Remote Calendar“.')}</div>
            <label>${T('Feiertags-Kalender')}<select data-cfgs="holCal"><option value="">${fe ? T('automatisch ({name})', { name: esc(this._ename(fe)) }) : T('automatisch – keiner gefunden')}</option>${cals.map((e) => `<option value="${e}" ${c.holCal === e ? 'selected' : ''}>${esc(this._ename(e))}</option>`).join('')}</select></label>
            <label>${T('Ferien-Kalender')}<select data-cfgs="ferCal"><option value="">${sc ? T('automatisch ({name})', { name: esc(this._ename(sc)) }) : T('automatisch – keiner gefunden')}</option>${cals.map((e) => `<option value="${e}" ${c.ferCal === e ? 'selected' : ''}>${esc(this._ename(e))}</option>`).join('')}</select></label>
          </details>` : `<div class="hint">${T('Land und Region wählen – dann holt die Karte Schulferien und Feiertage selbst und hält sie aktuell (36 Länder, u. a. ganz Europa).')}</div>`}`;
    }

    // ⚙️ Einstellungen: jede Zusatzfunktion als eigener Abschnitt – einsortiert nach Thema (Gruppen: siehe „groups“ in den Einstellungen)
    _settingsFeatures() {
      const c = this._cfg;
      const ok = this._autoOk || {};
      const autoRow = (k, label) => `<div class="arow"><span class="grow">${label}</span>${ok[k] ? `<span class="okb">${T('✅ angelegt')}</span>` : `${this._autoBtn(k)}`}</div>
          <details><summary class="hint">${T('YAML zum manuellen Anlegen')}</summary><pre class="code">${esc(yml(this._autoCfg(k)).trim())}</pre><button class="btn" data-a="copyauto">${T('📋 Kopieren')}</button></details>`;
      const lmDevs = Object.values(this._hass.devices || {}).filter((d) => /lametric/i.test(`${d.manufacturer || ''} ${d.model || ''}`));
      const dd = c.dblDays || [6];
      const noBd = this._kids().filter((k) => !k.bd || !k.bm).map((k) => k.name);
      // Schalter sitzt im Abschnittskopf (siehe _accHtml) – im Inhalt steht nur noch die Beschreibung
      const D = (L) => { const m = /<small>([\s\S]*)<\/small>/.exec(L); return m ? `<div class="hint fdesc">${m[1]}</div>` : ''; };
      const F = (k, on, lab, body) => [`f_${k}`, lab.split('<small>')[0], '', body(lab), { k, on: !!on }];
      const fx = {};
      fx.goalOn = F('goalOn', c.goalOn !== false, T('🎯 Sparziel<small>Kinder tippen 🎯 bei einer Belohnung und sehen ihren Fortschritt dorthin.</small>'), (L) => `
        ${D(L)}
      `);
      fx.wishOn = F('wishOn', !!c.wishOn, T('💡 Wunschliste<small>Kinder schlagen selbst Belohnungen vor. Du legst die Sterne fest und gibst sie unter 🔔 Freigaben frei.</small>'), (L) => `
        ${D(L)}
      `);
      fx.progOn = F('progOn', !!c.progOn, T('🔮 Spar-Prognose<small>Beim Sparziel und beim Familienziel steht, wann es beim aktuellen Tempo ungefähr erreicht ist.</small>'), (L) => `
        ${D(L)}
      `);
      fx.welcOn = F('welcOn', !!c.welcOn, T('🏠 Begrüßung bei Ankunft<small>Für Kinder mit 🏠 Anwesenheit: am Ankunftstag „Willkommen zurück“ mit Sternestand und Ziel.</small>'), (L) => `
        ${D(L)}
        ${c.welcOn ? `<div class="fopt">${this._chk('welcPush', !!c.welcPush, T('🔔 Morgens Nachricht an die Eltern, wer heute kommt'))}</div>` : ''}
      `);
      fx.jokerOn = F('jokerOn', !!c.jokerOn, T('🃏 Joker<small>Eine Belohnung als Joker: Wer sie einlöst, darf damit eine Pflicht-Aufgabe auslassen – ohne Minuspunkte. Unter 🎁 Belohnungen die Vorlage „🃏 Joker“ anlegen.</small>'), (L) => `
        ${D(L)}
      `);
      fx.bdOn = F('bdOn', !!c.bdOn, T('🎂 Geburtstag<small>Am Geburtstag Glückwunsch, Konfetti und Bonus-Sterne. Dafür beim Kind (✎) Tag, Monat und Jahr eintragen.</small>'), (L) => `
        ${D(L)}
        ${c.bdOn ? `<div class="fopt">
          ${noBd.length ? `<div class="hint">${T('⚠️ Noch ohne vollständiges Geburtsdatum: {names} – unter 👧 Kinder ✎ eintragen.', { names: esc(noBd.join(', ')) })}</div>` : ''}
          ${this._chk('bdAge', !!c.bdAge, T('So viele Bonus-Sterne, wie das Kind alt wird'))}
          ${c.bdAge ? '' : `<label>${T('Bonus-Sterne am Geburtstag')}<input type="number" min="0" data-cfgn="bdPts" value="${c.bdPts === undefined ? 10 : Number(c.bdPts) || 0}"></label>`}
          <label>${T('Punktefaktor am Geburtstag')}<select data-cfgs="bdMult">${[1, 2, 3, 5].map((x) => `<option value="${x}" ${(Number(c.bdMult) || 1) === x ? 'selected' : ''}>${x === 1 ? T('normal (×1)') : T('alle Punkte ×{x}', { x })}</option>`).join('')}</select></label>
          ${this._chk('bdFree', !!c.bdFree, T('🎈 Aufgabenfrei am Geburtstag (keine Pflicht-Aufgaben, keine Minuspunkte)'))}
          ${Number(c.bdMult) > 1 && c.bdFree ? `<div class="hint">${T('Hinweis: Mit „Aufgabenfrei“ gilt der Faktor nur noch für ⚡ Sonderaufgaben.')}</div>` : ''}
          ${this._chk('bdRemind', !!c.bdRemind, T('🔔 Erinnerung am Vortag an die ausgewählten Geräte/Chats'))}
        </div>` : ''}
      `);
      fx.prevOn = F('prevOn', !!c.prevOn, T('📅 Wochenvorschau<small>Die Kinder sehen unter „Demnächst“, welche besonderen Aufgaben in den nächsten Tagen anstehen (z. B. Müll, Bad putzen).</small>'), (L) => `
        ${D(L)}
      `);
      fx.dayBlocks = F('dayBlocks', !!c.dayBlocks, T('⏰ Tagesblöcke<small>Fasst die Aufgaben eines Kindes in Morgen, Mittag und Abend zusammen – jede Gruppe mit eigenem Fortschritt.</small>'), (L) => `
        ${D(L)}
        <div class="fopt blkset"><div class="lbl">${T('🕐 Einteilung der Tagesblöcke')}</div>
          <div class="bg3"><label>${T('☀️ Mittags ab')}<input type="time" data-blkb="mi" value="${this._blkB().mi}"></label><label>${T('🌇 Nachmittags ab')}<input type="time" data-blkb="na" value="${this._blkB().na}"></label><label>${T('🌙 Abends ab')}<input type="time" data-blkb="a" value="${this._blkB().a}"></label></div>
          <div class="hint">${T('🌅 Morgens bis {m} · ☀️ Mittags bis {mi} · 🌇 Nachmittags bis {na} · 🌙 Abends bis 23:59', { m: this._blkEnd('m'), mi: this._blkEnd('mi'), na: this._blkEnd('na') })}</div>
          <div class="hint">${T('Jeder Block endet, wo der nächste beginnt – so gibt es keine Überschneidungen. Maßgeblich ist die Startzeit einer Aufgabe. Aufgaben ohne Uhrzeit stehen unter 📌 Ohne Zeit. Gilt für die Kinder-Ansicht, die Sortierung unter ✅ Aufgaben und die lockereren Zeiten an schulfreien Tagen.')}</div>
          ${c.blkB ? `<button type="button" class="btn sm" data-a="blkreset">${T('↩️ Standard (11:30 · 16:00 · 18:00)')}</button>` : ''}</div>
        ${c.dayBlocks ? `<div class="fopt">${this._chk('autoFold', c.autoFold !== false, T('⏰ Vergangene Blöcke einklappen<small>Klappt einen Tagesblock automatisch ein, sobald sein Zeitfenster vorbei ist – so musst du am Abend nicht nach unten scrollen.</small>'))}</div>` : ''}
        ${this._chk('freeLate', !!c.freeLate, T('🕒 Lockerere Zeiten an schulfreien Tagen<small>An schulfreien Tagen (Wochenende, Ferien, Feiertage) haben Zeitfenster mehr Zeit – wie viel, stellst du darunter ein. So zählt Ausschlafen nicht als verpasst.</small>'))}
        ${c.freeLate ? `<div class="fopt"><label>${T('Wie viel länger?')}<select data-cfgs="freeMode">${[['', T('bis Ende des Tagesblocks')], ['30', T('30 Minuten länger')], ['60', T('1 Stunde länger')], ['120', T('2 Stunden länger')], ['day', T('ohne Zeitlimit (bis Tagesende)')]].map(([v, l]) => `<option value="${v}" ${String(c.freeMode || '') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
          <div class="hint">${T('Beispiel „Zähne putzen bis 9:00“ an einem schulfreien Tag: bis {x}.', { x: this._freeEx() })} ${T('Aufgaben, die immer pünktlich sein müssen (z. B. Medikament), bekommen im Editor (✎) das Häkchen „⏰ Feste Zeit auch an schulfreien Tagen“.')}</div></div>` : ''}
      `);
      fx.negOn = F('negOn', !!c.negOn, T('➖ Minus-Stand erlauben<small>Minuspunkte ziehen auch unter 0 ab – das Kind sieht dann z. B. „−3 ⭐“ und muss erst wieder ins Plus kommen. Dazu zeigen Kinder-Ansicht, Tagesabschluss und Wochenrückblick die Bilanz (verdient minus abgezogen).</small>'), (L) => `
        ${D(L)}
      `);
      fx.behavOn = F('behavOn', !!c.behavOn, T('😊 Benehmen<small>Im 📋 Heute-Tab ein Knopf 😊 „Artig“ beim Kind – für schnelles Lob zwischendurch, mit Eintrag im Punkte-Verlauf.</small>'), (L) => `
        ${D(L)}
        ${c.behavOn ? `<div class="fopt"><label>${T('Sterne für 😊 Artig')}<input type="number" min="1" data-min="1" data-cfgn="behavPlus" value="${Math.max(1, Number(c.behavPlus) || 1)}"></label>
          ${this._chk('behavMinus', !!c.behavMinus, T('😠 „Unartig“ mit Abzug erlauben<small>Zusätzlicher Knopf 😠, der Sterne abzieht.</small>'))}
          ${c.behavMinus ? `<label>${T('Abzug für 😠 Unartig')}<input type="number" min="1" data-min="1" data-cfgn="behavMinusN" value="${Math.max(1, Number(c.behavMinusN) || 1)}"></label>` : ''}</div>` : ''}
      `);
      fx.shareOn = F('shareOn', !!c.shareOn, T('👫 Gemeinsame Belohnungen<small>Belohnungen, von denen mehrere Kinder etwas haben (z. B. Waffeln zum Frühstück): Der Preis wird aufgeteilt, jedes Kind zahlt seinen Anteil – oder ein Kind lädt die anderen ein. Einstellen unter 🎁 Belohnungen → ✎.</small>'), (L) => `
        ${D(L)}
      `);
      fx.costKidOn = F('costKidOn', !!c.costKidOn, T('👧 Preise je Kind<small>Jede Belohnung kann pro Kind einen eigenen Preis haben – z. B. weil ältere Kinder am Tag mehr Sterne sammeln können. Einstellen unter 🎁 Belohnungen → ✎.</small>'), (L) => `
        ${D(L)}
      `);
      fx.walletOn = F('walletOn', !!c.walletOn, T('🎟️ Gutscheine<small>Eingelöste Belohnungen landen als Gutschein beim Kind und werden erst abgehakt, wenn es sie bekommen hat (z. B. das Eis).</small>'), (L) => `
        ${D(L)}
      `);
      fx.wbOn = F('wbOn', !!c.wbOn, T('🏅 Wochen-Bonus<small>Wer in einer Woche an genug Tagen alle Pflicht-Aufgaben schafft, bekommt am Montag Extra-Sterne.</small>'), (L) => `
        ${D(L)}
        ${c.wbOn ? `<div class="fopt"><div class="g2 g2e"><label>${T('An … Tagen alles geschafft')}<input type="number" min="1" max="7" data-min="1" data-cfgn="wbDays" value="${Math.min(7, Math.max(1, Number(c.wbDays) || 5))}"></label>
          <label>${T('Bonus-Sterne')}<input type="number" min="1" data-min="1" data-cfgn="wbPts" value="${Math.max(1, Number(c.wbPts) || 10)}"></label></div>
          <div class="hint">${T('Für Kinder, die nicht jeden Tag da sind: Es reicht, wenn an allen Tagen mit Aufgaben (mindestens 2) alles geschafft ist.')}</div></div>` : ''}
      `);
      fx.teamOn = F('teamOn', !!c.teamOn, T('👫 Teambonus<small>Schaffen alle Kinder, die an einem Tag Aufgaben haben, alles, gibt es Extra-Sterne fürs Familienziel (ohne Familienziel: für jedes Kind).</small>'), (L) => `
        ${D(L)}
        ${c.teamOn ? `<div class="fopt"><label>${T('Bonus-Sterne pro Tag')}<input type="number" min="1" data-min="1" data-cfgn="teamPts" value="${Math.max(1, Number(c.teamPts) || 5)}"></label></div>` : ''}
      `);
      fx.priceOn = F('priceOn', !!c.priceOn, T('🧮 Preis-Assistent<small>Unter 🎁 Belohnungen steht bei jeder Belohnung, wie viele Tage jedes Kind dafür spart – und „Preise vorschlagen“ rechnet passende Preise aus.</small>'), (L) => `
        ${D(L)}
      `);
      fx.routOn = F('routOn', !!c.routOn, T('📋 Routinen<small>Mehrere Schritte in einer Aufgabe (z. B. Morgen-Routine): Das Kind hakt jeden Schritt einzeln ab, die Sterne gibt es beim letzten Haken. In der Aufgabe (✎) die Schritte eintragen.</small>'), (L) => `
        ${D(L)}
      `);
      fx.nfcOn = F('nfcOn', !!c.nfcOn, T('🏷️ NFC-Tags<small>Aufgabe abhaken, indem das Kind einen NFC-Tag mit dem Handy scannt (z. B. am Zahnputzbecher). Tag-ID in der Aufgabe (✎) eintragen.</small>'), (L) => `
        ${D(L)}
        ${c.nfcOn ? `<div class="fopt"><div class="hint">${T('Damit die Karte weiß, welches Kind gescannt hat: beim Kind (✎) seinen Home-Assistant-Benutzer wählen. Hat die Aufgabe nur ein Kind, ist das nicht nötig.')}</div>${autoRow('nfc', T('🏷️ NFC-Automation'))}${this._nfcInfo()}</div>` : ''}
      `);
      fx.extraOn = F('extraOn', !!c.extraOn, T('🙋 Zusatzaufgaben<small>Freiwillige Aufgaben mit Extrapunkten – wer zuerst kommt. In der Aufgabe (✎) „Zusatzaufgabe“ anhaken.</small>'), (L) => `
        ${D(L)}
      `);
      fx.photoOn = F('photoOn', !!c.photoOn, T('📷 Foto-Nachweis<small>Für einzelne Aufgaben (✎ → „Foto-Nachweis“): Das Kind fotografiert beim Abhaken, du siehst das Foto bei der Freigabe.</small>'), (L) => `
        ${D(L)}
        ${c.photoOn ? `<div class="fopt"><div class="hint">${T('Nur mit eingeschalteter Freigabe. Fotos werden nach deiner Entscheidung gelöscht.')}${this._approval ? '' : `<br>${T('⚠️ Freigabe ist gerade ausgeschaltet – dann wird kein Foto verlangt.')}`}</div>
          <div class="hint">${T('Mit Administrator-Konto auf dem Kinder-Gerät landet das Foto im Medien-Ordner und erscheint auch in Push und Telegram. Ohne Admin-Rechte speichert die Karte ein verkleinertes Foto in einer To-do-Liste – zu sehen hier in der Karte bei der Freigabe.')}</div>
          <label>${T('Fotos ohne Admin-Rechte speichern in')}<select data-cfgs="phList"><option value="">${T('– Hauptliste –')}</option>${Object.keys(this._hass.states).filter((e) => e.startsWith('todo.') && e !== this._config.storage).sort().map((e) => `<option value="${esc(e)}" ${c.phList === e ? 'selected' : ''}>${esc(this._ename(e))}</option>`).join('')}</select></label>
          ${this._mkRow('phList', c.phList, T('Yippee Fotos'))}
          <div class="hint">${T('Empfohlen: eine eigene Lokale To-do-Liste (z. B. „Yippee Fotos“) – dann bleibt die Hauptliste klein und schnell.')}</div></div>` : ''}
      `);
      fx.muellOn = F('muellOn', !!c.muellOn, T('🗑️ Müllkalender<small>Abfuhrtermine automatisch aus einem Home-Assistant-Kalender – z. B. für „Müll rausbringen“.</small>'), (L) => `
        ${D(L)}
        ${c.muellOn ? (() => { const cals = Object.keys(this._hass.states).filter((e) => e.startsWith('calendar.')).sort((a, b) => /m(ü|ue)ll|abfall|waste|tonne/i.test(b + this._ename(b)) - /m(ü|ue)ll|abfall|waste|tonne/i.test(a + this._ename(a)) || a.localeCompare(b)); return `<div class="fopt">
          <label>${T('Müllkalender')}<select data-cfgs="muellCal"><option value="">${T('– bitte wählen –')}</option>${cals.map((e) => `<option value="${e}" ${c.muellCal === e ? 'selected' : ''}>${esc(this._ename(e))} (${e})</option>`).join('')}</select></label>
          ${cals.length ? '' : `<div class="hint">${T('⚠️ Kein Kalender gefunden. Z. B. über den Marketplace (HACS) „Waste Collection Schedule“ installieren oder unter Einstellungen → Geräte &amp; Dienste die Integration „Lokaler Kalender“ bzw. „Fernkalender“ (ICS-Link deines Entsorgers) hinzufügen.').replace('Waste Collection Schedule', '<a href="https://github.com/mampfes/hacs_waste_collection_schedule" target="_blank" rel="noopener"><b>Waste Collection Schedule</b></a>')}</div>`}
          ${c.muellCal ? `<div class="hint">${this._calPreview(c.muellCal)}</div>
          <div><button type="button" class="btn sm" data-a="mueltask">${T('＋ Aufgabe „Müll rausbringen“ anlegen')}</button></div>` : ''}</div>`; })() : ''}
      `);
      fx.calOn = F('calOn', !!c.calOn, T('📚 Termine als Aufgaben<small>Jeder Eintrag eines Kalenders wird zur eigenen Aufgabe – mit seinem Text als Titel. Ideal für Hausaufgaben oder Lernzettel.</small>'), (L) => `
        ${D(L)}
        ${c.calOn ? `<div class="fopt">${this._calLinksHtml()}</div>` : ''}
      `);
      fx.orderOn = F('orderOn', !!c.orderOn, T('↕️ Reihenfolge selbst festlegen<small>Unter ✅ Aufgaben mit ▲▼ sortieren – in dieser Reihenfolge sehen die Kinder ihre Aufgaben. Aus: nach Uhrzeit und Name.</small>'), (L) => `
        ${D(L)}
      `);
      fx.dblOn = F('dblOn', !!c.dblOn, T('⭐×2 Doppelte-Punkte-Tag<small>An den gewählten Wochentagen gibt es für jede Aufgabe doppelte Sterne.</small>'), (L) => `
        ${D(L)}
        ${c.dblOn ? `<div class="fopt"><div class="pick txt">${WEEK.map((d) => `<label><input type="checkbox" data-a="cfg" data-k="dblDay" data-v="${d}" ${dd.includes(d) ? 'checked' : ''}><span>${Y.DAYS[d]}</span></label>`).join('')}</div></div>` : ''}
      `);
      fx.gradesOn = F('gradesOn', !!c.gradesOn, T('🎓 Schulnoten<small>Sterne für gute Noten – nach einer Notentabelle, mit Bonus fürs Verbessern und fürs Zeugnis. Kinder können Noten selbst melden.</small>'), (L) => `
        ${D(L)}
        ${c.gradesOn ? this._gradeSettings() : ''}
      `);
      fx.checkOn = F('checkOn', c.checkOn !== false, T('🩺 Plausibilitäts-Check<small>Weist im 📋 Heute-Tab auf unstimmige Einstellungen hin – z. B. ein Kind, das nie da ist, oder ein Familienziel, das viel zu schnell erreicht ist.</small>'), (L) => `
        ${D(L)}
      `);
      fx.voiceOn = F('voiceOn', !!c.voiceOn, T('🎙️ Sprachbefehle<small>Den Home-Assistant-Sprachassistenten fragen: „Was muss Mia heute noch machen?“ oder „Wie viele Sterne hat Mia?“</small>'), (L) => `
        ${D(L)}
        ${c.voiceOn ? `<div class="fopt">${autoRow('voice', T('🎙️ Sprach-Automation'))}<div class="hint">${T('Weitere Sätze: „Was muss {name} noch machen?“, „Wie viele Punkte hat {name}?“ – {name} ist der Name des Kindes.', { name: esc((this._kids()[0] || {}).name || 'Mia') })}</div></div>` : ''}
      `);
      fx.advOn = F('advOn', !!c.advOn, T('🎄 Adventskalender<small>Türchen für jedes Kind vom 1. bis 24. Dezember – mit Text, Bild, Sternen oder einer geschenkten Belohnung. Eltern befüllen sie im neuen Tab 🎄 Advent, die Kinder öffnen sie über den 🎄-Knopf in ihrer Ansicht.</small>'), (L) => `
        ${D(L)}
        ${c.advOn ? `<div class="fopt"><div class="hint">${T('Eigene Karte nur mit dem Kalender: Ansicht „🎄 Adventskalender“ im Karten-Editor (optional mit Kind).')}</div><div class="btnrow"><button class="btn sm" data-a="tab" data-id="advent">${T('🎄 Zum Adventskalender')}</button></div></div>` : ''}
      `);
      fx.zOn = F('zOn', !!c.zOn, T('🦷 Zahnputz-Timer<small>2 Minuten Zähneputzen mit Musik – Bereich für Bereich verschwindet der Schaum und ein Bild kommt zum Vorschein. Mit Timer gibt es die Sterne sofort. Einstellungen im neuen Tab 🦷 Zähne.</small>'), (L) => `
        ${D(L)}
        ${c.zOn ? `<div class="fopt"><div class="btnrow"><button class="btn sm" data-a="tab" data-id="zaehne">${T('🦷 Zum Zahnputz-Timer')}</button></div></div>` : ''}
      `);
      fx.mnOn = F('mnOn', !!c.mnOn, T('💰 Taschengeld<small>Eine Spardose für jedes Kind: Ein- und Ausgaben, regelmäßiges Taschengeld, Sterne in Geld tauschen und ein Sparziel. Einstellungen im neuen Tab 💰 Taschengeld.</small>'), (L) => `
        ${D(L)}
        ${c.mnOn ? `<div class="fopt"><div class="btnrow"><button class="btn sm" data-a="tab" data-id="geld">${T('💰 Zum Taschengeld')}</button></div></div>` : ''}
      `);
      fx.peOn = F('peOn', !!c.peOn, T('🐾 Haustier<small>Ein animiertes Haustier für jedes Kind, das möchte: Es schlüpft aus einem Ei und wächst mit den Sternen, freut sich über erledigte Aufgaben und will gestreichelt, gefüttert und bespielt werden. Einstellungen im neuen Tab 🐾 Haustier.</small>'), (L) => `
        ${D(L)}
        ${c.peOn ? `<div class="fopt"><div class="btnrow"><button class="btn sm" data-a="tab" data-id="tier">${T('🐾 Zum Haustier')}</button></div></div>` : ''}
      `);
      fx.scOn = F('scOn', !!c.scOn, T('📺 Bildschirmzeit<small>Belohnungen mit Fernseh- oder Spielzeit: Das Kind startet seinen Gutschein, das Gerät geht an, und nach der Zeit wieder aus – mit Warnung 5 Minuten vorher. Einstellen im Belohnungs-Editor.</small>'), (L) => `
        ${D(L)}
        ${c.scOn ? `<div class="fopt"><div class="hint">${T('Ausgeschaltet wird von jeder geöffneten Yippee!-Karte – z. B. dem Wand-Tablet. Ist gerade keine offen, passiert es beim nächsten Öffnen.')}</div></div>` : ''}
      `);
      // 🎡📒🥚🎃 Spaß & Sammeln (Code in yippee-kids-chores-fun.js)
      fx.wheelOn = F('wheelOn', !!c.wheelOn, T('🎡 Glücksrad<small>Hat ein Kind alle Aufgaben des Tages erledigt, darf es einmal am Glücksrad drehen – z. B. +1, +2 oder +5 ⭐, ein Freispiel oder „Leider nichts“. Gewinne und wie oft sie kommen stellst du selbst ein.</small>'), (L) => `
        ${D(L)}
        ${c.wheelOn ? `<div class="fopt">${this._fnSettings('wheel')}</div>` : ''}
      `);
      fx.stkOn = F('stkOn', !!c.stkOn, T('📒 Sticker-Album<small>Bei jeder erledigten Aufgabe gibt es mit etwas Glück einen Sticker – 4 Alben (Tiere, Fahrzeuge, Weltraum, Meer) mit je 24 Stickern. Doppelte werden gezählt.</small>'), (L) => `
        ${D(L)}
        ${c.stkOn ? `<div class="fopt"><div class="g2 g2e"><label>${T('Chance pro Aufgabe (%)')}<input type="number" min="1" max="100" data-min="1" data-cfgn="stkP" value="${Math.max(1, Math.min(100, Number(c.stkP) || 30))}"></label>
          <label>${T('Bonus für ein volles Album (⭐, 0 = aus)')}<input type="number" min="0" data-cfgn="stkBonus" value="${Number(c.stkBonus) || 0}"></label></div></div>` : ''}
      `);
      fx.eggOn = F('eggOn', !!c.eggOn, T('🥚 Ostereiersuche<small>In der Osterwoche (Palmsonntag bis Ostermontag) ist in etwa jeder dritten Aufgabe ein Osterei versteckt – erledigt das Kind sie, landet das Ei im 🧺 Osternest.</small>'), (L) => `
        ${D(L)}
        ${c.eggOn ? `<div class="fopt">${this._chk('eggStar', !!c.eggStar, T('⭐ +1 Stern pro gefundenem Ei'))}</div>` : ''}
      `);
      fx.hwOn = F('hwOn', !!c.hwOn, T('🎃 Kürbissuche zu Halloween<small>Vom 24. bis 31. Oktober ist in etwa jeder dritten Aufgabe ein Kürbis versteckt – gesammelt wird im 🎃 Kürbiskorb.</small>'), (L) => `
        ${D(L)}
        ${c.hwOn ? `<div class="fopt">${this._chk('hwStar', !!c.hwStar, T('⭐ +1 Stern pro gefundenem Kürbis'))}</div>` : ''}
      `);
      fx.rdOn = F('rdOn', !!c.rdOn, T('📚 Lesetagebuch<small>Kinder legen ihre Bücher an, tragen Leseminuten ein und stellen fertige Bücher ins Bücherregal. Für jedes fertige Buch gibt es Sterne – mit eingeschalteter Freigabe erst, wenn du zustimmst.</small>'), (L) => `
        ${D(L)}
        ${c.rdOn ? `<div class="fopt"><label>${T('⭐ Sterne pro fertigem Buch')}<input type="number" min="0" max="100" data-cfgn="rdStars" value="${c.rdStars === undefined || c.rdStars === '' ? 5 : Number(c.rdStars) || 0}"></label></div>` : ''}
      `);
      fx.lmOn = F('lmOn', !!c.lmOn, T('🟦 LaMetric<small>Zeigt erledigte Aufgaben, „Alles geschafft!“ und eingelöste Belohnungen auf einer LaMetric TIME an.</small>'), (L) => `
        ${D(L)}
        ${c.lmOn ? `<div class="fopt">${lmDevs.length ? `<label>${T('Gerät')}<select data-cfgs="lmDev"><option value="">${T('– bitte wählen –')}</option>${lmDevs.map((d) => `<option value="${esc(d.id)}" ${c.lmDev === d.id ? 'selected' : ''}>${esc(d.name_by_user || d.name || d.id)}</option>`).join('')}</select></label>
          <div class="btnrow"><button class="btn sm" data-a="lmtest">${T('🔔 Test senden')}</button></div>` : `<div class="hint">${T('⚠️ Keine LaMetric gefunden – zuerst die Integration „LaMetric“ in Home Assistant einrichten.')}</div>`}</div>` : ''}
      `);
      return fx;
    }

    // Tagesblock im Eltern-Heute offen? Von Hand geschlossen gilt dauerhaft, von Hand geöffnet für heute;
    // sonst automatisch zu, wenn alle Pflicht-Aufgaben erledigt sind oder das Zeitfenster vorbei ist (wie in der Kinder-Ansicht)
    _admBlkOpen(key, list, k) {
      this._admFolded('');
      const m = this._admF[key], today = dk(new Date());
      let auto = false; // würde automatisch zuklappen
      if (this._cfg.autoFold !== false) {
        const rq = list.filter((t) => this._req(t) && this._status(t, k.id).s !== 'taken');
        const allDone = rq.length > 0 && rq.every((t) => ['d', 'p', 'e', 'x', 'm'].includes(this._status(t, k.id).s));
        const ends = list.map((t) => this._winTo(t)).filter(Boolean).sort();
        auto = allDone || (ends.length > 0 && ends.length === list.length && hhmm(new Date()) > ends[ends.length - 1]);
      }
      if (m === 1) return { open: false, auto };
      if (m && typeof m === 'object' && m.day === today) return { open: true, auto };
      return { open: !auto, auto };
    }

    // ◀ Vortage nachtragen (nur Eltern, bis zu 7 Tage zurück): Liste der Aufgaben dieses Tages, Antippen hakt ab oder nimmt zurück
    _admDayKey() {
      const d = this._admDay || ''; if (!d) return '';
      const min = new Date(); min.setDate(min.getDate() - 7);
      return d < dk(new Date()) && d >= dk(min) ? d : '';
    }
    _admDayBar() {
      const day = this._admDayKey(), d = day ? new Date(`${day}T12:00:00`) : new Date(), min = new Date(); min.setDate(min.getDate() - 7);
      const lbl = day ? (dk(new Date(Date.now() - 864e5)) === day ? T('Gestern') : `${Y.DAYS[d.getDay()]} ${shortDate(day)}`) : T('Heute');
      return `<div class="admday"><button type="button" class="btn sm" data-a="admday" data-v="-1" ${day && day <= dk(min) ? 'disabled' : ''} aria-label="${esc(T('Tag davor'))}">◀</button><b>📅 ${lbl}</b><button type="button" class="btn sm" data-a="admday" data-v="1" ${day ? '' : 'disabled'} aria-label="${esc(T('Tag danach'))}">▶</button>${day ? `<button type="button" class="btn sm" data-a="admday" data-v="0">${T('Heute')}</button>` : ''}</div>`;
    }
    _dayAdmin(kids, day) {
      const dt = new Date(`${day}T12:00:00`), css = '<style>.admday{display:flex;align-items:center;gap:8px;margin:0 0 10px;flex-wrap:wrap}.admday b{min-width:120px;text-align:center}.admpast{border:2px dashed var(--ac);border-radius:14px;padding:8px 10px;margin-bottom:10px}</style>';
      return `${css}${this._admDayBar()}<div class="admpast hint">${T('Nachtragen für {day}: Antippen hakt eine Aufgabe ab (die Sterne kommen sofort aufs Konto) oder nimmt sie zurück. Nur für Eltern.', { day: `${Y.DAYS[dt.getDay()]} ${shortDate(day)}` })}</div><div class="cols">${kids.map((k) => {
        const tasks = this._taskOrder().filter((t) => t.sched !== 'once' && (t.kids || []).includes(k.id) && this._isFor(t, k.id, dt) && !(t.created && day < t.created));
        const rows = tasks.map((t) => {
          const by = this._isShared(t) || this._isExtra(t) ? this._takenBy(t, day, k.id) : '', s = by ? 'taken' : this._st(day, t.id, k.id);
          const cls = s === 'x' || s === 'm' ? 'm' : s === 'e' ? 'e' : s === 'taken' ? '' : s;
          const ico = s === 'd' ? '✓' : s === 'p' ? '⏳' : s === 'e' ? '🙂' : s === 'm' ? '?' : s === 'taken' ? '🔒' : s === 'x' ? '✕' : '';
          const sub = s === 'taken' ? T('{name} hat es gemacht', { name: esc((this._db.kid[by] || {}).name || '') }) : s === 'x' ? T('verpasst · −{n} ⭐', { n: t.penalty || 0 }) : s === 'm' ? T('verpasst') : '';
          return `<button class="trow" data-a="atap" data-t="${t.id}" data-k="${k.id}" data-d="${day}" ${s === 'taken' ? 'disabled' : ''}><span class="st ${cls}">${ico}</span><span class="grow">${esc(t.emoji || '')} ${esc(t.title)}${sub ? `<small>${sub}</small>` : ''}</span><span class="pts">+${t.points || 0}</span></button>`;
        }).join('');
        return `<div class="box" style="${cv(k.color)}"><div class="colh"><span class="admk">${this._avc(k)}<span>${esc(k.name)}</span></span><span class="pts">⭐ ${k.points || 0}</span></div>${rows || `<div class="hint">${T('An diesem Tag keine Aufgaben.')}</div>`}</div>`;
      }).join('')}</div>`;
    }

    _todayAdmin(kids) {
      if (!kids.length) return `<div class="empty">${T('Lege zuerst unter 👧 Kinder ein Kind an.')}</div>`;
      if (this._admDayKey()) return this._dayAdmin(kids, this._admDayKey());
      const anyOpen = kids.some((k) => !this._admFolded(`kid:${k.id}`));
      return `${this._checkHtml()}<style>.admday{display:flex;align-items:center;gap:8px;margin:0 0 10px;flex-wrap:wrap}.admday b{min-width:120px;text-align:center}</style>${this._admDayBar()}<div class="btnrow" style="margin:0 0 10px"><button class="btn primary" data-a="etask">${T('＋ Aufgabe')}</button>${kids.length > 1 ? `<button class="btn" data-a="admall" data-v="${anyOpen ? 0 : 1}">${anyOpen ? T('▸ Alle einklappen') : T('▾ Alle aufklappen')}</button>` : ''}</div><div class="cols">${kids.map((k) => {
        const tasks = this._todayTasks(k.id);
        const kOpen = !this._admFolded(`kid:${k.id}`);
        const rq = tasks.filter((t) => this._req(t) && this._status(t, k.id).s !== 'taken'), dn = rq.filter((t) => this._status(t, k.id).s === 'd').length;
        return `<div class="box" style="${cv(k.color)}"><div class="colh"><button type="button" class="admk" data-a="admfold" data-id="kid:${k.id}" aria-expanded="${kOpen}" title="${esc(T('Ein-/Ausklappen'))}"><span class="chev">${kOpen ? '▾' : '▸'}</span>${this._avc(k)}<span>${esc(k.name)}</span></button>${this._cfg.behavOn ? `<span class="behav">${this._cfg.behavMinus ? `<button class="btn sm bhv no" data-a="behav" data-k="${k.id}" data-n="-1" title="${esc(T('😠 Unartig'))}" aria-label="${esc(T('😠 Unartig'))}">😠 −${Math.max(1, Number(this._cfg.behavMinusN) || 1)}</button>` : ''}<button class="btn sm bhv ok" data-a="behav" data-k="${k.id}" data-n="1" title="${esc(T('😊 Artig'))}" aria-label="${esc(T('😊 Artig'))}">😊 +${Math.max(1, Number(this._cfg.behavPlus) || 1)}</button></span>` : ''}<span class="pts">⭐ ${k.points || 0}</span>${Object.keys(this._db.reward).length ? `<button class="btn sm ardm" data-a="ardm" data-k="${k.id}" title="${esc(T('🎁 Belohnung einlösen'))}" aria-label="${esc(T('🎁 Belohnung einlösen'))}">🎁</button>` : ''}</div>${this._pres(k.id, dk(new Date())).s === 'out' ? `<div class="hint">${(() => { const n = this._presNext(k.id, dk(new Date())); return n ? T('🏠 Nicht da – wieder da: {day} {date}{time}', { day: Y.DAYS[new Date(`${n.d}T12:00:00`).getDay()], date: shortDate(n.d), time: n.at ? ` ${T('ab {time} Uhr', { time: n.at })}` : '' }) : T('🏠 Nicht da'); })()}</div>` : ''}
          ${kOpen ? this._adminRows(k, tasks) : `<div class="hint">${rq.length ? T('{done}/{total} heute erledigt', { done: dn, total: rq.length }) : T('Heute keine Aufgaben.')}</div>`}</div>`;
      }).join('')}</div><div class="hint">${T('Antippen hakt eine Aufgabe direkt ab (gibt Punkte) oder nimmt sie zurück.')}</div>`;
    }

    _adminRows(k, tasks) {
      const rowOf = (t) => {
            const { s, by, bySt } = this._status(t, k.id);
            const streak = t.sched === 'once' ? 0 : this._curStreak(t, k.id);
            const sub = [this._winText(t) ? `⏰ ${this._winText(t)}` : '', t.sched === 'once' ? T('⚡ Sonderaufgabe') : '', this._calLabel(t, dk(new Date())) ? `🗓️ ${esc(this._calLabel(t, dk(new Date())))}` : '', this._isExtra(t) ? T('🙋 Zusatzaufgabe') : '', streak >= 2 ? T('🔥 {n} Tage', { n: streak }) : '', s === 'x' ? T('−{n} ⭐ abgezogen', { n: t.penalty || 0 }) : '', s === 'taken' ? (bySt === 'p' ? T('⏳ {name} hat es gemacht – wartet auf Freigabe', { name: esc((this._db.kid[by] || {}).name || T('Jemand')) }) : T('✓ Schon erledigt von {name}', { name: esc((this._db.kid[by] || {}).name || T('Jemand')) })) : ''].filter(Boolean).join(' · ');
            const over = !s && this._win(t) === 'after' && !this._isExtra(t); // Zusatzaufgaben sind freiwillig – nach Ablauf kein „verpasst“
            const cls = s === 'x' || s === 'm' ? 'm' : s === 'e' ? 'e' : s === 'taken' ? '' : s || (over ? 'm' : '');
            const ico = s === 'd' ? '✓' : s === 'p' ? '⏳' : s === 'e' ? '🙂' : s === 'm' ? '?' : s === 'taken' ? '🔒' : s === 'x' || over ? '✕' : '';
            return `<button class="trow" data-a="atap" data-t="${t.id}" data-k="${k.id}">
            <span class="st ${cls}">${ico}</span><span class="grow">${esc(t.emoji || '')} ${esc(t.title)}${sub ? `<small>${sub}</small>` : ''}</span><span class="pts">+${t.points || 0}</span></button>`;
                };
      if (!tasks.length) return `<div class="hint">${T('Heute keine Aufgaben.')}</div>`;
      if (!this._cfg.dayBlocks) return tasks.map(rowOf).join('');
      return this._blockDefs().map(([id, label]) => {
        const list = tasks.filter((t) => this._blk(t) === id);
        if (!list.length) return '';
        const rq = list.filter((t) => this._req(t) && this._status(t, k.id).s !== 'taken'), key = `${k.id}:${id}`, bo = this._admBlkOpen(key, list, k), open = bo.open;
        return `<button type="button" class="sect blkh admb" data-a="admfold" data-id="${key}" data-auto="${bo.auto ? 1 : 0}" aria-expanded="${open}" title="${esc(T('Ein-/Ausklappen'))}"><span class="chev">${open ? '▾' : '▸'}</span><span class="grow">${label}</span><span class="hint">${rq.filter((t) => this._status(t, k.id).s === 'd').length}/${rq.length}</span></button>${open ? list.map(rowOf).join('') : ''}`;
      }).join('');
    }

    _tkArtDefs() { return [['r', T('📋 Routinen')], ['p', T('✅ Pflichtaufgaben')], ['z', T('🙋 Zusatzaufgaben')], ['s', T('⚡ Sonderaufgaben')]]; }

    _tasksAdmin(kids) {
      const f = this._tkf && this._db.kid[this._tkf] ? this._tkf : '';
      const all = this._taskOrder();
      const rmap = this._routMap();
      const mode = this._tkMode();
      const top = `<div class="tkf"><button class="btn primary" data-a="etask">${T('＋ Aufgabe')}</button>${this._cfg.routOn ? `<button class="btn primary" data-a="erout">${T('📋 ＋ Routine')}</button>` : ''}${kids.length > 1 ? `<button class="btn sm ${f ? '' : 'on'}" data-a="tkf" data-k="">${T('Alle')}</button>${kids.map((k) => `<button class="btn sm ${f === k.id ? 'on' : ''}" data-a="tkf" data-k="${k.id}">${esc(k.emoji || '')} ${esc(k.name)}</button>`).join('')}` : ''}</div>
      <div class="tkf tkg"><span class="hint">${T('Unterteilen nach:')}</span>${[['zeit', T('⏰ Tageszeit')], ['art', T('🏷️ Art')], ['none', T('keine')]].map(([m, l]) => `<button class="btn sm ${mode === m ? 'on' : ''}" data-a="tkg" data-m="${m}">${l}</button>`).join('')}</div>${mode === 'zeit' ? `<div class="hint tkhint">${T('🕐 Mittags ab {mi}, Nachmittags ab {na}, Abends ab {a}', this._blkB())} · ${T('⚙️ Einstellungen')} → ${T('✅ Aufgaben & Tagesablauf')} → ${T('⏰ Tagesblöcke<small>Fasst die Aufgaben eines Kindes in Morgen, Mittag und Abend zusammen – jede Gruppe mit eigenem Fortschritt.</small>').split('<small>')[0]}</div>` : ''}`;
      const nm = (id) => (this._db.kid[id] ? this._db.kid[id].name : '?');
      const rowOf = (t, kid) => {
        const alld = !((t.days || []).length && t.days.length < 7) && !['cal', 'dates', 'once'].includes(t.sched);
        let days = !alld ? WEEK.filter((d) => (t.days || []).includes(d)).map((d) => Y.DAYS[d]).join(' ') : t.school ? `${T('🎒 nur an Schultagen')}${this._cfg.hc ? '' : ` ${T('(Land fehlt)')}`}` : T('täglich');
        if (t.sched === 'cal') {
          const nx = this._calDates(t).filter((d) => d >= dk(new Date()));
          const nm2 = (t.cal && t.cal !== '_sensors' ? t.cal : '') || this._cfg.muellCal;
          days = !this._cfg.muellOn && !this._cfg.calOn ? T('🗑️ Müllkalender ist in den Einstellungen ausgeschaltet') : !nm2 || !this._hass.states[nm2] ? T('🗓️ ⚠️ Kalender nicht gefunden') : nx.length ? `${T('🗓️ nächster Termin {date}', { date: longDate(nx[0]) })}${this._calLabel(t, nx[0]) ? ` (${esc(this._calLabel(t, nx[0]))})` : ''}${t.calPrev ? ` · ${T('am Vorabend')}` : ''}` : `🗓️ ${this._calEvents(nm2) ? T('keine passenden Termine') : T('lade Termine …')}`;
        }
        if (t.sched === 'dates') { const nx = (t.dates || []).filter((d) => d >= dk(new Date())).sort(); days = nx.length ? T('📅 nächster Termin {date} ({n})', { date: longDate(nx[0]), n: nx.length }) : T('📅 keine Termine mehr'); }
        if (t.sched === 'once') {
          const o = this._onceState(t);
          days = o && o.st === 'd' ? T('⚡ einmalig · ✓ erledigt von {name} ({date})', { name: esc(nm(o.kid)), date: shortDate(o.date) }) : `${T('⚡ einmalig')}${t.until ? ` · ${T('bis {date}', { date: longDate(t.until) })}` : ''}${o && o.st === 'p' ? ` · ${T('⏳ {name} wartet auf Freigabe', { name: esc(nm(o.kid)) })}` : ''}`;
        }
        if (this._winText(t) && !(Array.isArray(t.slots) && t.slots.length > 1)) days += ` · ⏰ ${this._winText(t)}`;
        if (t.rotate && (t.kids || []).length > 1) { const r = this._isOn(t, new Date()) ? this._rotKid(t, new Date()) : null; days += ` · ${T('🔄 im Wechsel')}${r ? ` ${T('(heute: {name})', { name: esc(nm(r)) })}` : ''}`; }
        if (Number(t.penalty) && t.sched !== 'once' && !this._isExtra(t)) days += ` · ${T('−{n} wenn verpasst (nach Bestätigung)', { n: t.penalty })}`;
        if (this._isExtra(t)) days += ` · ${T('🙋 Zusatzaufgabe')}`;
        if (this._isShared(t)) days += ` · ${T('🤝 Einer reicht')}`;
        if (Array.isArray(t.slots) && t.slots.length > 1) days += ` · 🔁 ${t.slots.length}× (${t.slots.map((x) => `${x.from}–${x.to}`).join(' / ')})`;
        if (t.school && !alld) days += ` · ${T('🎒 nur an Schultagen')}${this._cfg.hc ? '' : ` ${T('(Land fehlt)')}`}`;
        if (t.noschool) days += ` · ${T('🏖️ nur an schulfreien Tagen')}`;
        if (t.sFrom && t.sTo) days += ` · 🌦️ ${Y.MON3[t.sFrom - 1]}–${Y.MON3[t.sTo - 1]}${this._inSeason(t, new Date()) ? '' : ` ${T('(pausiert)')}`}`;
        if (t.photo && this._cfg.photoOn) days += ` · ${T('📷 Foto')}`;
        if (this._routine(t)) days += ` · ${T('📋 {n} Schritte', { n: t.steps.length })}`;
        if (rmap[t.id] && this._db.task[rmap[t.id]]) days = `${T('📋 Teil von „{title}“', { title: esc(this._db.task[rmap[t.id]].title) })} · ${days}`;
        if (this._cfg.nfcOn && t.nfc) days += ' · 🏷️ NFC';
        if (t.school && kid && this._satKid(kid)) days = days.replace(T('🎒 nur an Schultagen'), `${T('🎒 nur an Schultagen')} ${T('(+ Samstag)')}`);
        const others = (t.kids || []).filter((id) => id !== kid && this._db.kid[id]).map((id) => this._db.kid[id].name);
        const names = !kid ? T('– niemand –') : others.length ? T('👥 mit {names}', { names: others.join(', ') }) : '';
        return `<div class="row"><span style="font-size:24px">${esc(t.emoji || '⭐')}</span><span class="grow">${esc(t.title)}<small>${days}${names ? ` · ${esc(names)}` : ''}</small></span><span class="pts">+${t.points || 0}</span>${this._cfg.orderOn ? `<button class="icon" data-a="tup" data-id="${t.id}" data-k="${kid}" title="${esc(T('Nach oben'))}" aria-label="${esc(T('Nach oben'))}">▲</button><button class="icon" data-a="tdown" data-id="${t.id}" data-k="${kid}" title="${esc(T('Nach unten'))}" aria-label="${esc(T('Nach unten'))}">▼</button>` : ''}<button class="icon" data-a="etask" data-id="${t.id}">✎</button></div>`;
      };
      const head = (key, label, n, big) => { const open = this._tkOpen(key); return { open, html: `<button type="button" class="sect blkh${big ? ' tkh' : ' tksh'}" data-a="tkfold" data-id="${esc(key)}" data-open="${open ? 1 : 0}" aria-expanded="${open}" title="${esc(T('Ein-/Ausklappen'))}"><span class="chev">${open ? '▾' : '▸'}</span><span class="grow">${label}</span><span class="tkn" title="${esc(T('{n} Aufgaben', { n }))}">${n}</span></button>` }; };
      const groups = (f ? kids.filter((k) => k.id === f) : kids).map((k) => ({ id: k.id, label: `${esc(k.emoji || '🙂')} ${esc(k.name)}`, list: all.filter((t) => (t.kids || []).includes(k.id)) }));
      if (!f) { const none = all.filter((t) => !(t.kids || []).some((id) => this._db.kid[id])); if (none.length) groups.push({ id: '', label: T('👤 Ohne Kind'), list: none }); }
      const subDefs = mode === 'zeit' ? this._blockDefs() : mode === 'art' ? this._tkArtDefs() : [['', '']];
      const body = groups.map((g) => {
        if (!g.list.length && g.id) return `<div class="row"><span class="grow">${g.label}<small>${T('Noch keine Aufgaben.')}</small></span></div>`;
        const h = head(`k:${g.id}`, g.label, g.list.length, true);
        if (!h.open) return h.html;
        return h.html + subDefs.map(([sid, sl]) => {
          let list = mode === 'none' ? g.list : g.list.filter((t) => this._tkSub(t, mode) === sid);
          if (!list.length) return '';
          if (mode === 'zeit' && !this._cfg.orderOn) list = list.slice().sort((x, y) => String(x.from || '').localeCompare(String(y.from || '')) || String(x.title).localeCompare(String(y.title)));
          if (mode === 'none') return list.map((t) => rowOf(t, g.id)).join('');
          const sh = head(`k:${g.id}:${sid}`, sl, list.length, false);
          return sh.html + (sh.open ? list.map((t) => rowOf(t, g.id)).join('') : '');
        }).join('');
      }).join('');
      return `${top}${this._calTasksBox()}<div class="box">${all.length ? body : `<div class="hint">${T('Noch keine Aufgaben.')}</div>`}
        <div class="btnrow"><button class="btn primary" data-a="etask" ${kids.length ? '' : 'disabled'}>${T('＋ Aufgabe')}</button>${this._cfg.routOn ? `<button class="btn primary" data-a="erout" ${kids.length ? '' : 'disabled'}>${T('📋 ＋ Routine')}</button>` : ''}</div></div>`;
    }

    // Eine Zeile unter 🎁 Belohnungen: Preis rechts (bei unterschiedlichen Preisen je Kind als Bereich),
    // darunter pro Kind Preis und Spardauer in einer Zeile, bei gemeinsamen Belohnungen der Anteil jedes Kindes
    _rewardRow(r) {
      const c = this._cfg, kids = this._kids().filter((k) => this._rwFor(r, k.id));
      const pr = kids.map((k) => this._cost(r, k.id)), lo = pr.length ? Math.min(...pr) : r.cost, hi = pr.length ? Math.max(...pr) : r.cost;
      const own = !!(c.costKidOn && r.costs && Object.keys(r.costs).some((id) => this._db.kid[id])), diff = own && lo !== hi;
      const days = (k) => { if (!c.priceOn) return ''; const b = this._weekBudget(k.id); if (!(b > 0)) return ''; const n = Math.max(1, Math.ceil(this._cost(r, k.id) / (b / 7))); return n === 1 ? T('1 Tag') : T('{n} Tage', { n }); };
      let line = '';
      const nw = (x) => `<span class="nw">${x}</span>`;
      if (own) line = kids.map((k) => { const d = days(k); return nw(`${esc(k.name)} ${this._cost(r, k.id)} ⭐${d ? ` (≈ ${d})` : ''}`); }).join(' · ');
      else if (c.priceOn) line = kids.map((k) => { const d = days(k); return d ? nw(`${esc(k.name)} ≈ ${d}`) : ''; }).filter(Boolean).join(' · ');
      const sk = this._shareOn(r) ? this._shareKids(r) : null;
      const only = !sk && this._rwKids(r).length < this._kids().length ? T('👧 nur für {names}', { names: this._names(this._rwKids(r)) }) : '';
      const share = sk ? T('👫 Gemeinsam: {names}', { names: sk.map((id) => nw(`${esc(this._kn(id))} ${this._shareCost(r, id, sk.length)} ⭐`)).join(' · ') }) : '';
      return `<div class="row"><span style="font-size:24px">${esc(r.emoji || '🎁')}</span><span class="grow">${esc(r.title)}${this._advR(r) ? `<small>${T('🎄 Nur im Adventskalender')}</small>` : ''}${r.limit ? `<small>${T('max. {n}× pro Woche', { n: r.limit })}</small>` : ''}${line ? `<small>${line}</small>` : ''}${share ? `<small>${share}</small>` : ''}${only ? `<small>${esc(only)}</small>` : ''}</span><span class="pts">${diff ? `${lo}–${hi}` : own ? lo : r.cost} ⭐</span><button class="icon" data-a="erew" data-id="${r.id}">✎</button></div>`;
    }

    _rewardsAdmin() {
      const rs = this._rewards();
      const f = this._cfg.fam;
      const fam = `<div class="box"><h3>${T('👨‍👩‍👧 Familienziel')}</h3>${f && f.cost
        ? `<div class="row"><span style="font-size:24px">${esc(f.emoji || '👨‍👩‍👧')}</span><span class="grow">${esc(f.title)}<small>${T('{n}/{cost} ⭐ gemeinsam gesammelt', { n: Math.min(f.pts || 0, f.cost), cost: f.cost })}${f.reached ? ` · ${T('🎉 erreicht!')}` : ''}</small></span><button class="icon" data-a="famedit">✎</button></div>
          <div class="bar"><i style="width:${Math.round((Math.min(f.pts || 0, f.cost) / f.cost) * 100)}%"></i></div>
          <div class="famfix"><span>${T('🔧 Korrigieren:')}</span>${[-10, -1, 1, 10].map((v) => `<button class="btn sm" data-a="famfix" data-v="${v}">${v > 0 ? '+' : '−'}${Math.abs(v)}</button>`).join('')}</div>
          ${(f.log || []).length ? `<details class="famlog"><summary>${T('🔧 Letzte Korrekturen ({n})', { n: f.log.length })}</summary>${f.log.slice().reverse().map((x) => `<div>${(() => { const d = new Date(x.t), p = (v) => String(v).padStart(2, '0'); return `${p(d.getDate())}.${p(d.getMonth() + 1)}. ${p(d.getHours())}:${p(d.getMinutes())}`; })()} · ${x.a} → ${x.b} ⭐</div>`).join('')}</details>` : ''}
          ${(f.q || []).length ? `<div class="hint famq">${T('📋 Danach: {x}', { x: f.q.map((x) => `${esc(x.emoji)} ${esc(x.title)} (${x.cost} ⭐)`).join(' · ') })}${f.reached && f.nx ? ` · ${T('schon {n} ⭐ gesammelt', { n: f.nx })}` : ''}</div>` : ''}
          ${f.reached ? `<div class="btnrow">${(f.q || []).length ? `<button class="btn primary" data-a="famnext">${T('✓ Eingelöst – weiter mit {x}', { x: `${esc(f.q[0].emoji)} ${esc(f.q[0].title)}` })}</button><button class="btn" data-a="famreset">${T('🔁 Nochmal dasselbe Ziel')}</button>` : `<button class="btn primary" data-a="famreset">${T('✓ Eingelöst – von vorne sammeln')}</button>`}</div>` : ''}
          ${(f.done || []).length ? `<details class="famlog"><summary>${T('🏆 Geschafft ({n})', { n: f.done.length })}</summary>${f.done.slice().reverse().map((x) => `<div>${esc(x.emoji)} ${esc(x.title)}${x.d ? ` · ${shortDate(x.d)}` : ''}</div>`).join('')}</details>` : ''}
          ${this._cfg.sensors !== false && this._famSens() ? `${this._autoRowSig('famgoal', T('🎉 Durchsage und Nachricht, wenn das Familienziel erreicht ist'))}${!(this._cfg.targets || []).length && !(this._cfg.rNotify || (this._cfg.rTts && (this._cfg.rPlayers || []).length)) ? `<div class="hint">${T('⚠️ Kein Lautsprecher und kein Benachrichtigungs-Ziel eingestellt.')}</div>` : ''}` : ''}`
        : `<div class="hint">${T('Alle Kinder sammeln zusätzlich gemeinsam auf ein großes Ziel – ihre eigenen Punkte bleiben dabei erhalten.')}</div><div><button class="btn primary" data-a="famedit">${T('＋ Familienziel festlegen')}</button></div>`}</div>`;
      const mode = ['az', 'kid'].includes(this._cfg.rwSort) ? this._cfg.rwSort : 'stars', kidsN = this._kids().length;
      const gs = mode === 'kid' && kidsN > 1 ? this._rwKidGroups(rs) : this._rwGroups(rs);
      const sb = (m, l) => `<button class="btn sm ${mode === m ? 'on' : ''}" data-a="rws" data-m="${m}">${l}</button>`;
      const sortBar = rs.length > 1 ? `<div class="tkf tkg"><span class="hint">${T('Sortieren:')}</span>${sb('stars', T('⭐ Sterne'))}${sb('az', T('🔤 A–Z'))}${kidsN > 1 ? sb('kid', T('👧 Nach Kind')) : ''}</div>` : '';
      return `${fam}<div class="box"><h3>${T('🎁 Belohnungen')}</h3>${sortBar}${gs.map(([t, l]) => `${gs.length > 1 ? `<div class="tcat">${t}</div>` : ''}${l.map((r) => this._rewardRow(r)).join('')}`).join('') || `<div class="hint">${T('Noch keine Belohnungen. Ideen: 🍦 Eisgutschein · 📺 30 Min. Fernsehen · 🎮 Spieleabend')}</div>`}
        <div class="btnrow"><button class="btn primary" data-a="erew">${T('＋ Belohnung')}</button>${this._cfg.priceOn && rs.length ? `<button class="btn" data-a="psug">${T('💡 Preise vorschlagen')}</button>` : ''}</div></div>`;
    }

    _auditSection() {
      const c = this._cfg, e = (this._db.audit.main && this._db.audit.main.e) || [];
      const n = this._audN || 30;
      const fmt = (ts) => { const d = new Date(ts); return `${shortDate(dk(d))} ${hhmm(d)}`; };
      return ['audit', T('📜 Änderungsprotokoll'), c.auditOn === false ? T('aus') : e.length ? T('{n} Einträge', { n: e.length }) : T('noch leer'), `
        ${this._chk('auditOn', c.auditOn !== false, T('Protokollieren, wer wann was geändert hat<small>Freigaben, Punkte von Hand, Einlösungen, Auszahlungen, Löschen, Wiederherstellen, PIN und Eltern-Liste. Die letzten 300 Einträge bleiben erhalten.</small>'))}
        ${e.slice(0, n).map(([ts, u, x]) => `<div class="row"><span class="grow">${esc(x)}<small>${fmt(ts)} · ${esc(u)}</small></span></div>`).join('') || `<div class="hint">${T('Noch keine Einträge.')}</div>`}
        ${e.length > n ? `<div><button class="btn" data-a="audmore">${T('Mehr anzeigen')}</button></div>` : ''}`];
    }

    _trashSection() {
      const c = this._cfg, td = this._trashDays(), cutT = dk(new Date(Date.now() - td * 864e5)), list = Object.values(this._db.trash).filter((x) => x.o && x.oid && TRACK.includes(x.t) && x.d && x.d >= cutT).sort((a, b) => String(b.d).localeCompare(String(a.d)));
      const ic = { kid: '👧', task: '📋', reward: '🎁' };
      return ['trash', T('🗑️ Papierkorb'), c.trashOn === false ? T('aus') : list.length ? T('{n} Einträge', { n: list.length }) : T('leer'), `
        ${this._chk('trashOn', c.trashOn !== false, T('Gelöschtes aufbewahren<small>Kinder, Aufgaben und Belohnungen lassen sich einzeln zurückholen – mit Punkten und Verlauf. Danach werden sie endgültig gelöscht.</small>'))}
        ${c.trashOn !== false ? `<div class="fopt"><label>${T('Aufbewahren für')}<select data-cfgs="trashDays">${[7, 14, 30].map((n) => `<option value="${n}" ${td === n ? 'selected' : ''}>${T('{n} Tage', { n })}</option>`).join('')}</select></label></div>` : ''}
        ${list.map((x) => `<div class="row"><span class="grow">${ic[x.t] || ''} ${esc(x.o.emoji || '')} ${esc(x.o.name || x.o.title || x.id)}<small>${T('gelöscht am {date} von {user}', { date: shortDate(x.d), user: esc(x.u || '?') })} · ${T('endgültig weg am {date}', { date: shortDate(dk(new Date(new Date(`${x.d}T12:00:00`).getTime() + (td + 1) * 864e5))) })}</small></span><button class="icon" data-a="trres" data-id="${esc(x.id)}" title="${esc(T('Zurückholen'))}">♻️</button></div>`).join('') || `<div class="hint">${T('Der Papierkorb ist leer.')}</div>`}`];
    }

    // ---------- Zugriffsschutz-Einstellungen ----------
    _secSection() {
      const c = this._cfg, ps = this._persons(), me = this._hass.user || {}, par = c.parents || [];
      const pinSrc = c.pinH ? T('PIN gesetzt ({n} Ziffern)', { n: c.pinL }) : String(this._config.pin ?? '').replace(/\D/g, '') ? T('PIN aus dem Karten-YAML') : T('keine PIN');
      const on = this._parentsOn();
      return ['sec', T('🔒 Zugriffsschutz'), [on ? T('{n} Eltern', { n: par.filter((u) => ps.some((p) => p.u === u)).length }) : T('alle Benutzer'), pinSrc].join(' · '), `
        <div class="lbl">${T('👨‍👩‍👧 Wer ist Eltern?')}</div>
        <div class="hint">${T('Nur diese Home-Assistant-Benutzer sehen den Eltern-Bereich und dürfen freigeben, Punkte ändern und einlösen – auf jedem Gerät, auch über die Knöpfe in den Benachrichtigungen. Niemand angehakt = alle dürfen (wie bisher).')}</div>
        ${ps.map((p) => this._chk('parent', par.includes(p.u), `${esc(p.n)}${p.u === me.id ? ` <small>${T('(du)')}</small>` : ''}`, `data-v="${esc(p.u)}"`)).join('') || `<div class="hint">${T('Keine Personen mit Benutzerkonto gefunden (Einstellungen → Personen).')}</div>`}
        ${me.is_admin === false ? '' : `<div class="hint">${T('Tipp: Kinder bekommen in Home Assistant ein eigenes Konto <b>ohne</b> Administrator-Rechte – Administratoren können alles ändern.')}</div>`}
        <div class="lbl">${T('🔢 PIN für den Eltern-Bereich')}</div>
        <div class="hint">${pinSrc}. ${T('Die PIN wird nur als Prüfwert gespeichert, nicht im Klartext. Nach 5 falschen Versuchen ist der Eltern-Bereich auf diesem Gerät 5 Minuten gesperrt.')}</div>
        <div class="g2 g2e"><label>${T('Neue PIN (4–8 Ziffern)')}<input type="password" inputmode="numeric" autocomplete="new-password" name="pin1" maxlength="8"></label><label>${T('PIN wiederholen')}<input type="password" inputmode="numeric" autocomplete="new-password" name="pin2" maxlength="8"></label></div>
        <div class="btnrow"><button class="btn" data-a="pinset">${T('🔢 PIN speichern')}</button>${c.pinH ? `<button class="btn" data-a="pindel">${T('PIN entfernen')}</button>` : ''}</div>
        <div class="hint">${T('Gesperrt wird wieder nach {n} Min. ohne Bedienung (Karten-Option pin_minutes).', { n: Math.max(1, Number(this._config.pin_minutes) || 5) })}</div>`];
    }

    // 🎉 Einmaliger Hinweis „Neu in 2.0“ (je Gerät, verschwindet mit „Verstanden“)
    _new20Html() {
      let seen = ''; try { seen = localStorage.getItem('yippee_new20') || ''; } catch (e) { seen = '1'; }
      if (seen || !this._kids().length) return '';
      const li = (e, t, s) => `<div class="n20i"><span>${e}</span><div><b>${t}</b><small>${s}</small></div></div>`;
      return `<div class="box n20"><style>.n20{background:linear-gradient(135deg,rgba(255,212,59,.18),rgba(116,192,252,.18))}.n20 h3{margin:0 0 6px}.n20i{display:flex;gap:10px;align-items:flex-start;padding:5px 0}.n20i>span{font-size:22px;line-height:1.2}.n20i small{display:block;opacity:.75}</style>
        <h3>${T('🎉 Neu in Yippee! 2.0')}</h3>
        ${li('🐾', T('Haustier für jedes Kind'), T('Wächst mit den Sternen – mit Mini-Spielen, Lernspielen nach Klasse und dem Jump & Run „Abenteuer“.'))}
        ${li('💰', T('Taschengeld'), T('Eine Spardose für jedes Kind – mit regelmäßigem Taschengeld und Sparziel.'))}
        ${li('📺', T('Bildschirmzeit'), T('Gutscheine schalten Fernseher oder Konsole ein und nach der Zeit wieder aus.'))}
        ${li('📱', T('Ein Kind pro Seite'), T('Für die Kinder-Karte mit allen Kindern – wischen wie in einer App.'))}
        <div class="hint">${T('Alles ist optional: Einschalten unter ⚙️ Einstellungen → ⚙️ Allgemein (🎨 Darstellung für „Ein Kind pro Seite“).')}</div>
        <div class="btnrow"><button class="btn primary" data-a="new20ok">${T('✓ Verstanden')}</button><button class="btn" data-a="hb">${T('📖 Handbuch')}</button></div></div>`;
    }

    _updBanner() {
      if (this._cfg.updOn === false) return '';
      const i = this._updInfo();
      let hide = '';
      try { hide = localStorage.getItem('yippeeUpdHide') || ''; } catch (e) { hide = ''; }
      const out = [];
      if ((i.u.dups || []).length) {
        out.push(`<div class="box chk"><div class="lbl">${T('⚠️ Die Karte ist mehrfach als Ressource eingetragen')}</div>
          <div class="hint">${T('Geladen wird nur ein Eintrag – womöglich eine alte Version. Behalten wird: {url}', { url: `<code>${esc(i.u.res.url)}</code>` })}</div>
          <div class="hint">${T('Überflüssig: {list}', { list: i.u.dups.map((r) => `<code>${esc(r.url)}</code>`).join(', ') })}</div>
          ${this._admin() ? `<div class="btnrow"><button class="btn primary" data-a="resclean">${T('🧹 Überflüssige Einträge entfernen und neu laden')}</button></div>` : `<div class="hint">${T('Das kann nur ein Administrator ändern.')}</div>`}
          <div class="hint">${T('Die alten Dateien im Ordner /config/www/ kannst du danach von Hand löschen.')}</div></div>`);
      }
      if (i.stale && i.u.res && this._resReady(i)) {
        out.push(`<div class="box upd"><div class="lbl">${T('🔄 Neue Version {n} ist bereit', { n: esc(i.stale) })}</div>
          <div class="hint">${T('Die Ressource ist schon umgestellt – die neue Version startet nach dem Neuladen der Seite.')}</div>
          <div class="btnrow"><button class="btn primary" data-a="updreload">${T('🔄 Jetzt neu laden')}</button></div></div>`);
      } else if (i.stale) {
        out.push(`<div class="box chk"><div class="lbl">${T('🔄 Update installiert – aber noch nicht aktiv')}</div>
          <div>${T('Auf dem Server liegt Version {new}, hier läuft noch Version {old}. Die Ressourcen-Version muss erhöht werden, sonst lädt der Browser weiter die alte Datei.', { new: esc(i.stale), old: esc(VERSION) })}</div>
          ${i.u.res ? `<div class="hint">${T('Ressource: {url}', { url: `<code>${esc(i.u.res.url)}</code>` })}</div>
          ${this._admin() ? `<div class="btnrow"><button class="btn primary" data-a="updres">${T('⚙️ Auf ?v={n} setzen und neu laden', { n: esc(i.stale) })}</button></div>` : `<div class="hint">${T('Das kann nur ein Administrator ändern.')}</div>`}`
          : `<div class="hint">${T('Einstellungen → Dashboards → ⋮ → Ressourcen → Eintrag der Karte öffnen → am Ende ?v={n} eintragen → speichern → Seite neu laden.', { n: esc(i.stale) })}</div>`}</div>`);
      } else if (i.avail && hide !== i.avail) {
        out.push(`<div class="box upd"><div class="lbl">${T('⬆️ Update verfügbar: Version {n}', { n: esc(i.avail) })}</div>
          <div class="hint">${T('Installiert ist Version {n}. Das Update spielst du im Marketplace (früher HACS) ein – danach erinnert dich die Karte, die Ressourcen-Version zu erhöhen.', { n: esc(VERSION) })}</div>
          ${i.h.release_summary ? `<div class="hint">${esc(String(i.h.release_summary).slice(0, 300))}</div>` : ''}
          <div class="btnrow"><button class="btn primary" data-a="updopen">${T('⬆️ Zu den Updates')}</button>${i.h.release_url ? `<a class="btn" href="${esc(i.h.release_url)}" target="_blank" rel="noopener">${T('Was ist neu?')}</a>` : ''}<button class="btn" data-a="updhide" data-v="${esc(i.avail)}">${T('Später')}</button></div></div>`);
      }
      return out.join('');
    }

    _updSection() {
      const c = this._cfg, i = this._updInfo();
      const st = i.stale ? T('⚠️ neue Version noch nicht aktiv') : i.avail ? T('Update {n} verfügbar', { n: i.avail }) : T('aktuell');
      return ['upd', T('⬆️ Updates'), `${T('Version {n}', { n: VERSION })} · ${c.updOn === false ? T('aus') : st}`, `
        ${this._chk('updAuto', c.updAuto !== false, T('Ressource nach einem Update automatisch erhöhen<small>Die Karte trägt die neue Version selbst in die Ressource ein, sobald ein Administrator den Eltern-Bereich öffnet. Bei Installation über den Marketplace (früher HACS) erledigt das der Marketplace.</small>'))}
        ${this._chk('updOn', c.updOn !== false, T('Auf Updates prüfen<small>Zeigt im Eltern-Bereich, wenn der Marketplace (früher HACS) eine neue Version kennt – und erinnert daran, die Ressourcen-Version zu erhöhen, wenn ein Update installiert, aber noch nicht geladen ist.</small>'))}
        <div class="hint">${T('Läuft gerade: Version {n}', { n: VERSION })}${i.u.file ? ` · ${T('Datei auf dem Server: Version {n}', { n: esc(i.u.file) })}` : ''}${i.h ? ` · ${T('HACS: installiert {a}, neueste {b}', { a: esc(i.h.installed_version || '–'), b: esc(i.h.latest_version || '–') })}` : ''}</div>
        ${i.u.res ? `<div class="hint">${T('Ressource: {url}', { url: `<code>${esc(i.u.res.url)}</code>` })}</div>` : `<div class="hint">${T('Die Ressource kann nur ein Administrator auslesen.')}</div>`}
        ${i.h ? '' : `<div class="hint">${T('Kein Eintrag im Marketplace (HACS) gefunden – bei manueller Installation gibt es nur die Erinnerung an die Ressourcen-Version.')}</div>`}
        <div><button class="btn" data-a="updnow">${T('🔄 Jetzt prüfen')}</button></div>`];
    }

    _gOk(g) { const s = this._gScale(), v = Number(String(g).replace(',', '.')); return String(g).trim() !== '' && !Number.isNaN(v) && v >= s.min && v <= s.max; }

    _gSubjects() { return [...new Set(SUBJECTS.map((x) => T(x)))]; }

    _gradeTblHint() {
      const s = this._gScale();
      return this._gTable().map(([th, st]) => `${s.hi ? '≥' : '≤'} ${this._gFmt(th)}: ${st} ⭐`).join(' · ');
    }

    // Note eintragen (Eltern) oder melden (Kind)
    _gradeDlg(kidId, kidMode) {
      const k = this._db.kid[kidId];
      if (!k) return;
      const s = this._gScale(), c = this._cfg;
      const hist = (k.grades || []).slice(0, 12);
      const subj = this._gSubjects();
      const body = `
        <label>${T('Fach')}<input name="gsub" list="gsubl" placeholder="${esc(T('z. B. Mathe'))}" autocomplete="off"><datalist id="gsubl">${subj.map((x) => `<option value="${esc(x)}">`).join('')}</datalist></label>
        <div class="pick txt">${subj.slice(0, 6).map((x) => `<label><input type="radio" name="gsq" value="${esc(x)}"><span>${esc(x)}</span></label>`).join('')}</div>
        <label>${T('Note ({min}–{max})', { min: this._gFmt(s.min), max: this._gFmt(s.max) })}<input type="number" name="gval" inputmode="decimal" min="${s.min}" max="${s.max}" step="${s.step}"></label>
        <div class="hint">${T('Sterne: {table}', { table: this._gradeTblHint() })}${Number(c.gImp === undefined ? 3 : c.gImp) ? ` · ${T('+{n} ⭐ wenn besser als die letzte Note im Fach', { n: Number(c.gImp === undefined ? 3 : c.gImp) })}` : ''}</div>
        ${Number(c.gRep === undefined ? 20 : c.gRep) ? `<label class="crow"><input type="checkbox" name="grep"><span>${T('📜 Zeugnis')}<small>${T('Statt einer Einzelnote: Zeugnis-Bonus von {n} ⭐', { n: Number(c.gRep === undefined ? 20 : c.gRep) })}</small></span></label>` : ''}
        ${kidMode && c.photoOn ? `<label>${T('📷 Foto der Arbeit (optional)')}<input type="file" name="gphoto" accept="image/*" capture="environment"></label>` : ''}
        ${this._gOverview(k)}
        ${hist.length ? `<div class="lbl">${T('Letzte Noten')}</div>${hist.map((x) => `<div class="lrow"><span class="ln pl">${x.p ? `+${x.p}` : '0'}</span><span class="grow">${x.rep ? `📜 ${T('Zeugnis')}` : `${esc(x.s)}: ${esc(this._gFmt(x.g))}`} · <small>${shortDate(x.d)}</small></span></div>`).join('')}` : ''}`;
      this._modal(kidMode ? T('🎓 Note melden – {name}', { name: esc(k.name) }) : T('🎓 Note eintragen – {name}', { name: esc(k.name) }), body, false, {
        saveLabel: kidMode ? T('🎓 Melden') : T('🎓 Eintragen'), audit: false,
        save: (b) => {
          const rep = !!(b.querySelector('[name=grep]') || {}).checked;
          const sq = b.querySelector('[name=gsq]:checked');
          const sub = (b.querySelector('[name=gsub]').value.trim() || (sq ? sq.value : '')).slice(0, 40);
          const gv = String(b.querySelector('[name=gval]').value || '').replace(',', '.');
          if (!rep) {
            if (!sub) { this._toast(T('Bitte ein Fach angeben')); return false; }
            if (!this._gOk(gv)) { this._toast(T('Bitte eine Note von {min} bis {max} eingeben', { min: this._gFmt(s.min), max: this._gFmt(s.max) })); return false; }
          }
          const gr = rep ? { rep: true } : { s: sub, g: Number(gv) };
          if (kidMode && this._approval) {
            const f = b.querySelector('[name=gphoto]') && b.querySelector('[name=gphoto]').files[0];
            const rid = uid(), go = (photo) => {
              this._save('req', rid, { kid: kidId, grade: { ...gr, ...(photo ? { photo } : {}) }, d: dk(new Date()) });
              const what = rep ? T('ein Zeugnis') : T('{s}: Note {g}', { s: sub, g: this._gFmt(gv) });
              this._notify(`${T('🎓 {name} meldet {what} – bitte freigeben.', { name: k.name, what })}${photo ? (PH_RX.test(photo) ? ` 📷 ${T('Foto in der Karte ansehen')}` : ' 📷') : ''}`, 'task', [[T('✓ Freigeben'), `KP|gok|${rid}`], [T('✕ Ablehnen'), `KP|gno|${rid}`]], photo);
              this._toast(T('🎓 Gemeldet – Mama oder Papa schauen es sich an'));
              this._render();
            };
            if (f) { this._toast(T('📷 Foto wird gesendet …')); this._uploadPhoto(f, `kp_note_${dk(new Date())}_${slug(k.name)}_${rid}.jpg`).then(go, () => go('')); } else go('');
            return true;
          }
          this._gradeBook(kidId, gr, null, null);
          return true;
        },
      });
      const box = this.shadowRoot.querySelector('#modal .mbox');
      if (box) box.querySelectorAll('[name=gsq]').forEach((r) => r.addEventListener('change', () => { box.querySelector('[name=gsub]').value = r.value; }));
    }

    // Übersicht je Fach: Anzahl, Schnitt, letzte Note, Sterne
    _gOverview(k) {
      const by = {};
      (k.grades || []).filter((x) => !x.rep).forEach((x) => { const key = String(x.s).trim().toLowerCase(); (by[key] = by[key] || []).push(x); });
      const rows = Object.values(by).map((l) => [l[l.length - 1].s, l]).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
      if (!rows.length) return '';
      const rp = (k.grades || []).filter((x) => x.rep).length;
      return `<div class="lbl">${T('📊 Notenübersicht')}</div>${rows.map(([sub, l]) => {
        const avg = l.reduce((t, x) => t + Number(x.g), 0) / l.length, p = l.reduce((t, x) => t + (x.p || 0), 0);
        const tr = l.length > 1 ? (this._gBetter(l[0].g, l[1].g) ? ' 📈' : this._gBetter(l[1].g, l[0].g) ? ' 📉' : '') : '';
        return `<div class="lrow"><span class="ln pl">+${p}</span><span class="grow">${esc(sub)}${tr} · <small>${T('Ø {avg} · {n} Noten · zuletzt {g}', { avg: this._gFmt(Math.round(avg * 10) / 10), n: l.length, g: this._gFmt(l[0].g) })}</small></span></div>`;
      }).join('')}${rp ? `<div class="hint">${T('📜 Zeugnisse: {n}', { n: rp })}</div>` : ''}`;
    }

    _gradeSettings() {
      const c = this._cfg, s = this._gScale(), tbl = this._gTable();
      return `<div class="fopt">
        <label>${T('Notenskala')}<select data-cfgs="gScale"><option value="">${esc(T('Automatisch: {name}', { name: T(GSCALES[GRADE_COUNTRY[c.hc] || 'de'].n) }))}</option>${Object.entries(GSCALES).map(([id, x]) => `<option value="${id}" ${c.gScale === id ? 'selected' : ''}>${esc(T(x.n))}</option>`).join('')}</select></label>
        <div class="lbl">${T('Sterne je Note')}</div>
        <div class="gst">${tbl.map(([th, st], i) => `<label>${s.hi ? '≥' : '≤'} ${esc(this._gFmt(th))}<input type="number" min="0" data-gst="${i}" value="${st}"></label>`).join('')}</div>
        <div class="hint">${T('Schlechtere Noten geben 0 ⭐ – es werden nie Sterne abgezogen.')}</div>
        <div class="g2 g2e"><label>${T('📈 Bonus fürs Verbessern')}<input type="number" min="0" data-cfgn="gImp" value="${c.gImp === undefined ? 3 : Number(c.gImp) || 0}"></label>
        <label>${T('📜 Zeugnis-Bonus')}<input type="number" min="0" data-cfgn="gRep" value="${c.gRep === undefined ? 20 : Number(c.gRep) || 0}"></label></div>
        <div class="hint">${T('Verbessern: besser als die letzte Note im selben Fach. 0 = aus.')}</div>
        ${this._chk('gKids', c.gKids !== false, T('Kinder dürfen Noten selbst melden<small>Mit 🎓 auf ihrer Karte – mit eingeschalteter Freigabe prüfst du sie unter 🔔 Freigaben (auch per Push/Telegram), mit Foto-Nachweis auf Wunsch mit Foto der Arbeit.</small>'))}
        <div class="hint">${T('Noten eintragen: unter 👧 Kinder mit 🎓.')}</div>
      </div>`;
    }

    _chkLabel(k, j) {
      const [ty, id] = k.split('|');
      const x = this._db[ty] && this._db[ty][id] ? this._db[ty][id] : j && j.data[ty] && j.data[ty][id];
      if (ty === 'cfg') return T('⚙️ Einstellungen');
      if (ty === 'log') return T('📅 Tag {date}', { date: /^\d{4}-\d\d-\d\d$/.test(id) ? shortDate(id) : id });
      const ic = { kid: '👧', task: '📋', reward: '🎁', req: '📨', plan: '🌙' }[ty] || '•';
      return `${ic} ${x ? (x.name || x.title || id) : id}`;
    }

    _chkBanner() {
      const d = this._dchk;
      if (!d) return '';
      const j = this._bkRef && this._bkRef.j;
      const parts = [
        d.miss.length ? (d.miss.length > 1 ? T('{n} Einträge fehlen', { n: d.miss.length }) : T('1 Eintrag fehlt')) : '',
        d.bad.length ? (d.bad.length > 1 ? T('{n} Einträge wurden außerhalb der Karte verändert', { n: d.bad.length }) : T('1 Eintrag wurde außerhalb der Karte verändert')) : '',
        d.broken.length ? (d.broken.length > 1 ? T('{n} Einträge sind beschädigt', { n: d.broken.length }) : T('1 Eintrag ist beschädigt')) : '',
      ].filter(Boolean).join(' · ');
      const names = [...d.miss, ...d.bad, ...d.broken].slice(0, 6).map((k) => esc(this._chkLabel(k, j))).join(', ');
      const last = this._bkIds().pop();
      return `<div class="box chk"><div class="lbl">${T('⚠️ Datenprüfung')}</div><div>${parts}</div><div class="hint">${names}${d.miss.length + d.bad.length + d.broken.length > 6 ? ' …' : ''}</div>
        <div class="hint">${last ? `${T('Neueste automatische Sicherung: {date}', { date: longDate(last) })}<br>${T('Zurückgeholt wird jeweils der Stand der neuesten Sicherung, die den Eintrag enthält.')}` : T('Keine automatische Sicherung vorhanden – bitte eine Sicherungsdatei verwenden.')}</div>
        <div class="btnrow"><button class="btn primary" data-a="chkfix">${T('♻️ Aus Sicherung zurückholen')}</button><button class="btn" data-a="chkok">${T('✓ So übernehmen')}</button></div></div>`;
    }

    // Alle NFC-Tag-IDs aus den Aufgaben (für die Bedingung der NFC-Automation)
    // Einstellungen: Stand der NFC-Automation und letzter Scan (zur Fehlersuche)
    _nfcInfo() {
      const c = this._cfg, tags = this._nfcTags(), ok = (this._autoOk || {}).nfc, last = c.nfcLast;
      const fresh = (c.nfcSig || '') === tags.join(',');
      const lt = last && Number(last.ts) ? new Date(Number(last.ts)) : null;
      return `<div class="hint">${tags.length ? T('{n} NFC-Tag(s) in Aufgaben eingetragen.', { n: tags.length }) : T('⚠️ Noch keiner Aufgabe ist ein NFC-Tag zugeordnet (Aufgabe ✎ → „NFC-Tag zum Abhaken“).')}
        ${ok && tags.length && !fresh ? ` ${T('⚠️ Die Automation kennt noch nicht alle Tags.')}` : ''}
        ${T('Ist beim Scannen keine Karte geöffnet, wird die Aufgabe beim nächsten Öffnen abgehakt – es zählt die Uhrzeit des Scans.')}</div>
        ${ok && this._admin() ? `${this._admin() ? `<button class="btn sm" data-a="autonew" data-k="nfc">${T('🔄 Automation neu schreiben')}</button>` : ''}` : ''}
        <div class="hint">${lt ? `${last.ok ? '✅' : '⚠️'} ${T('Letzter Scan')}: ${esc(dk(lt))} ${esc(hhmm(lt))} – ${esc(String(last.msg || ''))}` : T('Letzter Scan: noch keiner angekommen. Kommt nach dem Scannen nichts an, in Home Assistant unter Einstellungen → Automationen → „Yippee! - Kids Chores – NFC-Tags“ → Traces nachsehen.')}</div>`;
    }

    _chk(k, on, label, extra = '') { return `<label class="crow"><input type="checkbox" data-a="cfg" data-k="${k}" ${extra} ${on ? 'checked' : ''}><span>${label}</span></label>`; }

    _settingsExtra() {
      const c = this._cfg, st = this._hass.states, today = dk(new Date());
      const tts = Object.keys(st).filter((e) => e.startsWith('tts.')).sort();
      const players = Object.keys(st).filter((e) => e.startsWith('media_player.')).sort();
      const alexa = Object.keys((this._hass.services && this._hass.services.notify) || {}).filter((x) => /alexa/i.test(x)).sort();
      const vac = (c.vac || []).slice().sort((a, b) => a.from.localeCompare(b.from));
      const sens = this._kids().map((k) => `sensor.yippee_${slug(k.name)}`);
      const spk = !!((c.rTts && (c.rPlayers || []).length) || c.rNotify);
      const vNow = vac.some((v) => today >= v.from && today <= v.to), vNext = vac.filter((v) => v.to >= today).length;
      if (c.ab2) this._bk2Load();
      const bks = this._bkIds().reverse();
      const audioSum = [c.rOn ? T('Erinnerung') : '', c.mOn ? T('Ansage {time}', { time: c.mTime || '07:00' }) : ''].filter(Boolean).join(' · ') || T('aus');
      return {
        audio: ['audio', T('🔊 Sprachausgabe'), `${audioSum}${(c.rOn || c.mOn) && !spk ? ` · ${T('⚠️ kein Lautsprecher')}` : ''}`, `
          <div class="hint">${T('Gilt für alle Durchsagen: Erinnerungen und Morgen-Ansage.')}</div>
          <div class="lbl">${T('🔈 Lautsprecher')}</div>
          ${alexa.length ? `<label>${T('Alexa-Gerät (Alexa Media Player)')}<select data-cfgs="rNotify"><option value="">${T('– keins –')}</option>${alexa.map((a) => `<option value="${a}" ${c.rNotify === a ? 'selected' : ''}>notify.${a}</option>`).join('')}</select></label>` : ''}
          <label>${T('Sprachausgabe (TTS)')}<select data-cfgs="rTts"><option value="">${T('– keine –')}</option>${tts.map((e) => `<option value="${e}" ${c.rTts === e ? 'selected' : ''}>${esc(this._ename(e))}</option>`).join('')}</select></label>
          ${tts.length ? `<div class="lbl">${T('Lautsprecher')}</div>${players.map((p) => this._chk('rPlayer', (c.rPlayers || []).includes(p), `${esc(this._ename(p))}<small>${p}</small>`, `data-v="${p}"`)).join('') || `<div class="hint">${T('Keine Lautsprecher gefunden.')}</div>`}` : `<div class="hint">${T('Keine TTS-Integration gefunden (z. B. „Google Translate text-to-speech“ in Home Assistant hinzufügen).')}</div>`}
          <div><button class="btn" data-a="rtest">${T('🔊 Test-Durchsage')}</button></div>
          <div class="lbl">${T('⏰ Erinnerung')}</div>
          ${this._chk('rOn', !!c.rOn, T('Kurz vor Ende eines Zeitfensters an offene Aufgaben erinnern'))}
          <label>${T('Wie viele Minuten vorher?')}<input type="number" min="1" data-min="1" data-cfgn="rMin" value="${Number(c.rMin) || 15}"></label>
          <div class="lbl">${T('🔔 Erinnerung zu festen Uhrzeiten')}</div>
          ${this._chk('rtOn', !!c.rtOn, T('Zu festen Uhrzeiten sagen, was noch offen ist<small>Nur wenn ein Kind noch etwas offen hat und da ist (nicht im Urlaub, nicht abwesend). Braucht eine geöffnete Yippee!-Karte – z. B. das Wand-Tablet.</small>'))}
          ${c.rtOn ? `<div class="fopt"><label>${T('Uhrzeiten (z. B. 17:00, 19:00)')}<input type="text" data-cfgs="rtTimes" value="${esc(c.rtTimes || '17:00')}" placeholder="17:00, 19:00"></label>
            ${tts.length && players.length ? `<div class="lbl">${T('Lautsprecher dafür (leer = wie oben)')}</div>${players.map((p) => this._chk('rtPl', (c.rtPl || []).includes(p), `${esc(this._ename(p))}<small>${p}</small>`, `data-v="${p}"`)).join('')}` : ''}
            <div><button class="btn" data-a="rttest">${T('🔊 Jetzt testen')}</button></div></div>` : ''}

          <div class="lbl">${T('🌅 Morgen-Ansage')}</div>
        ${this._chk('mOn', !!c.mOn, T('🌅 Morgen-Ansage<small>Zur festen Uhrzeit sagt der Lautsprecher jedem Kind, was heute ansteht.</small>'))}
        ${c.mOn ? `<div class="fopt"><label>${T('Uhrzeit')}<input type="time" data-cfgs="mTime" value="${esc(c.mTime || '07:00')}"></label>
          ${this._chk('mWd', !!c.mWd, T('Nur Montag bis Freitag'))}
          <div class="hint">${spk ? '' : `${T('⚠️ Oben ist noch kein Lautsprecher bzw. Alexa-Gerät gewählt.')}<br>`}${T('Im Urlaub bleibt es still. Angesagt wird nur, wenn zur Uhrzeit (bis 30 Min. danach) eine Yippee!-Karte geöffnet ist.')}</div>
          <div><button class="btn" data-a="mtest">${T('🔊 Jetzt ansagen')}</button></div></div>` : ''}
        `],
        rest: [
          ['vac', T('🏖️ Urlaub &amp; Ferien'), [c.hc ? T('{region} automatisch', { region: c.hr ? c.hr.split('-').pop() : c.hc }) : '', vNow ? T('Urlaub aktiv') : vNext ? T('{n} Urlaub geplant', { n: vNext }) : ''].filter(Boolean).join(' · ') || T('keine'), `
          ${this._holSettings()}
          <div class="lbl">${T('🏖️ Eigene Urlaubs-Zeiträume')}</div>
          <div class="hint">${T('In diesen Zeiträumen ist keine Aufgabe fällig, nichts zählt als verpasst und Serien laufen danach einfach weiter. Sonderaufgaben ⚡ bleiben möglich.')}</div>
          ${vac.map((v) => { const who = (v.kids || []).filter((id) => this._db.kid[id]); return `<div class="row"><span class="grow">🏖️ ${longDate(v.from)} – ${longDate(v.to)}<small>${who.length && who.length < this._kids().length ? T('nur {names}', { names: esc(who.map((id) => this._db.kid[id].name).join(', ')) }) : T('alle Kinder')}${today >= v.from && today <= v.to ? ` · ${T('gerade aktiv')}` : ''}</small></span><button class="icon" data-a="vdel" data-id="${esc(v.id || '')}" data-f="${v.from}" data-t="${v.to}">✕</button></div>`; }).join('')}
          <div class="g2 g2e"><label>${T('von')}<input type="date" name="vfrom"></label><label>${T('bis')}<input type="date" name="vto"></label></div>
          ${this._kids().length > 1 ? `<div class="lbl">${T('Für wen?')}</div><div class="pick txt">${this._kids().map((k) => `<label><input type="checkbox" name="vkid" value="${k.id}" checked><span>${esc(k.emoji || '')} ${esc(k.name)}</span></label>`).join('')}</div><div class="hint">${T('Standard: alle Kinder. Zum Beispiel bei einer Klassenfahrt nur ein Kind anhaken.')}</div>` : ''}
          <div><button class="btn" data-a="vadd">${T('＋ Zeitraum hinzufügen')}</button></div>`],
          ['money', T('💶 Taschengeld'), c.moneyOn ? T('an · {n} ⭐ = 1 €', { n: Number(c.moneyRate) || 10 }) : T('aus'), `
          ${this._chk('moneyOn', !!c.moneyOn, T('Punkte in Euro umrechnen und auszahlen'))}
          <label>${T('Wie viele Sterne sind 1 €?')}<input type="number" min="1" data-min="1" data-cfgn="moneyRate" value="${Number(c.moneyRate) || 10}"></label>
          <div class="hint">${T('Ausgezahlt wird unter 👧 Kinder mit 💶 – die Sterne werden abgezogen und im Verlauf vermerkt.')}</div>`],
          ['sens', T('📊 Sensoren & Automationen'), c.sensors !== false ? T('an') : T('aus'), `
          ${this._chk('sensors', c.sensors !== false, T('Punktestand und Tagesstand jedes Kindes als Sensor bereitstellen'))}
          <div class="hint">${sens.length ? sens.map((x) => `<code>${x}</code>`).join(' ') : T('Sensoren entstehen, sobald Kinder angelegt sind.')}<br>${T('Zustand = Punkte · Attribute: {attrs}. Z. B. für Automationen wie „Fernseher erst, wenn alles erledigt ist“. Aktualisiert, solange eine Yippee!-Karte bei einem Administrator geöffnet ist.', { attrs: `heute_erledigt, heute_gesamt, heute_netto, woche_netto, alles_erledigt, offen, wartet_auf_freigabe, level, ziel, urlaub${c.moneyOn ? ', euro' : ''}` })}${this._sensorFail ? `<br>${T('⚠️ Dieser Benutzer darf keine Sensoren anlegen (kein Administrator).')}` : ''}</div>
          ${c.sensors !== false ? `${this._chk('sensKeep', !!c.sensKeep, T('🔁 Auch nach einem Neustart sofort da<small>Home Assistant liest die Sensoren dann selbst aus der Yippee-Liste – ohne geöffnete Karte. Einmalig eine Vorlage in die configuration.yaml kopieren.</small>'))}
          ${c.sensKeep ? this._sensKeepUi() : ''}
          ${this._sensAutoUi()}` : ''}          ${this._ptsInfo()}
`],
          ['bk', T('💾 Datensicherung'), [c.abOn !== false && bks.length ? T('zuletzt {date}', { date: shortDate(bks[0]) }) : c.abOn === false ? T('Automatik aus') : '', this._dchk ? T('⚠️ Datenprüfung') : ''].filter(Boolean).join(' · '), `
          ${this._chkBanner()}
          <div class="lbl">${T('📄 Sicherungsdatei')}</div>
          <div class="btnrow"><button class="btn" data-a="bkdl">${T('⬇️ Herunterladen')}</button>${navigator.canShare ? `<button class="btn" data-a="bkshare">${T('📤 Teilen')}</button>` : ''}<button class="btn" data-a="bkcopy">${T('📋 Kopieren')}</button><button class="btn" data-a="bkrestore">${T('♻️ Wiederherstellen')}</button></div>
          <div class="hint">${T('Sichert Kinder, Aufgaben, Belohnungen, Punkte, Verlauf und Einstellungen. Zusätzlich sind die Daten in jeder normalen Home-Assistant-Sicherung enthalten.')} ${T('Dateiname: <b>{name}</b>', { name: this._bkName() })}</div>
          ${this._inApp() ? `<div class="hint">${T('📱 In der Home-Assistant-App vergibt die App beim Herunterladen oft einen eigenen Namen. Mit „📤 Teilen“ (z. B. in Google Drive, Dateien oder Telegram speichern) bleibt der Name YippeeKidsChores… erhalten – oder im Browser herunterladen.')}</div>` : ''}
          <div class="lbl">${T('🕒 Automatische Sicherung')}</div>
          ${this._chk('abOn', c.abOn !== false, T('Automatisch sichern<small>Die Karte legt selbst Sicherungen in der To-do-Liste an und behält die letzten 4.</small>'))}
          ${this._chk('offQ', c.offQ !== false, T('📴 Offline-Puffer<small>Ist Home Assistant kurz nicht erreichbar (WLAN weg, Neustart), merkt sich das Gerät die Haken der Kinder und trägt sie automatisch nach, sobald die Verbindung wieder steht. Die Kachel zeigt so lange „📴 offline – wird nachgetragen“.</small>'))}
          ${c.abOn !== false ? this._chk('abUpd', c.abUpd !== false, T('🛡️ Vor Updates sichern<small>Gibt es eine neue Version von Yippee! – oder startet sie zum ersten Mal –, legt die Karte sofort eine zusätzliche Sicherung an.</small>')) : ''}
          ${c.abOn !== false ? `<label>${T('Wie oft?')}<select data-cfgs="abDays"><option value="1" ${Number(c.abDays) === 1 ? 'selected' : ''}>${T('täglich')}</option><option value="7" ${Number(c.abDays) === 1 ? '' : 'selected'}>${T('wöchentlich')}</option></select></label>` : ''}
          <div class="btnrow"><button class="btn" data-a="abnow">${T('💾 Jetzt sichern')}</button></div>
          <div class="hint">${T('Schützt vor versehentlich gelöschten oder veränderten Einträgen. Wird die ganze Liste gelöscht, sind auch diese Sicherungen weg – lade deshalb ab und zu eine Datei herunter.')}</div>
          ${bks.length ? `<details class="bklist" ${this._bkListOpen ? 'open' : ''}><summary class="hint">${T('Vorhandene Sicherungen ({n})', { n: bks.length })}</summary>${bks.map((id) => `<div class="row"><span class="grow">🕒 ${longDate(id)}<small>${Math.max(1, Math.round(((this._db.bak[id] || {}).raw || (this._bk2 && this._bk2.m[id]) || '').length / 1024))} KB${this._db.bak[id] ? '' : ` · ${T('nur in der zweiten Liste')}`}${this._bk2 && this._bk2.m[id] !== undefined ? ' · 🗄️' : ''}</small></span><button class="icon" data-a="abdl" data-id="${id}" title="${esc(T('⬇️ Herunterladen'))}">⬇️</button><button class="icon" data-a="abres" data-id="${id}" title="${esc(T('♻️ Wiederherstellen'))}">♻️</button></div>`).join('') }</details>` : `<div class="hint">${T('Noch keine automatische Sicherung.')}</div>`}
          ${c.abOn !== false ? `<details class="bk2" ${(this._bk2Open !== undefined ? this._bk2Open : !c.ab2) ? 'open' : ''}><summary class="hint">${T('🗄️ Zweite Liste (empfohlen)')}${c.ab2 ? ` · ${esc(this._ename(c.ab2))}` : ''}</summary>` : ''}
          ${c.abOn !== false ? `<label>${T('Zusätzlich sichern in Liste')}<select data-cfgs="ab2"><option value="">${T('– keine –')}</option>${Object.keys(this._hass.states).filter((e) => e.startsWith('todo.') && e !== this._config.storage).sort().map((e) => `<option value="${e}" ${c.ab2 === e ? 'selected' : ''}>${esc(this._ename(e))}</option>`).join('')}</select></label>
          ${this._mkRow('ab2', c.ab2, T('Yippee Sicherung'))}
          <div class="hint">${c.ab2 ? (this._bk2 && this._bk2.err ? `⚠️ ${esc(this._bk2.err)}` : T('🗄️ = liegt auch in der zweiten Liste. Wird die Hauptliste gelöscht, bleiben diese Sicherungen erhalten.')) : T('Empfohlen: eine zweite Lokale To-do-Liste anlegen (z. B. „Yippee Sicherung“) und hier auswählen – dann überleben die Sicherungen auch, wenn die Hauptliste gelöscht wird.')}</div>` : ''}
          ${c.abOn !== false ? '</details>' : ''}
          <div class="lbl">${T('🛡️ Datenprüfung')}</div>
          ${this._chk('parHint', c.parHint !== false, T('💡 Hinweis für Eltern<small>Im Tab 📋 Heute steht ein Hinweis, wenn ein Kind 3 Tage keine Aufgabe erledigt hat oder sein Haustier traurig ist. Nur hier in der Karte – keine Nachricht.</small>'))}
          ${this._chk('chkOn', c.chkOn !== false, T('Warnen, wenn Einträge fehlen oder außerhalb der Karte verändert wurden'))}
          ${c.chkOn !== false && !this._dchk ? `<div class="hint">${T('✅ Alles in Ordnung')}</div>` : ''}`],
        ],
      };
    }

    _kidsAdmin(kids) {
      const shut = this._kadmShut();
      return `${this._repBox(kids)}${kids.map((k) => {
        const goal = k.goal && this._db.reward[k.goal];
        const age = this._age(k);
        const tot = k.total !== undefined ? k.total : (k.points || 0), lv = levelOf(tot);
        const gr = this._grade(k);
        const sub = [age !== null ? `${T('{n} Jahre', { n: age })}${gr ? ` · ${T('{n}. Klasse', { n: gr })}` : ''}` : T('Alter fehlt – für Vorschläge bitte ✎'), `${LEVELS[lv][2]} ${T('Level {lv} · {n}/{total} Abzeichen', { lv: lv + 1, n: badgesOf(k).length, total: BADGES.length })}${this._cfg.jokerOn && k.jokers ? ` · 🃏 ${k.jokers}` : ''}${this._presCfg(k.pres) ? ` · ${this._pres(k.id, dk(new Date())).s === 'out' ? T('🏠 gerade nicht da') : T('🏠 da')}` : ''}${this._cfg.moneyOn ? ` · ≈ ${euro(k.points || 0, Number(this._cfg.moneyRate) || 10)}` : ''}`, goal ? T('🎯 Ziel: {emoji} {title} ({n}/{cost})', { emoji: esc(goal.emoji || '🎁'), title: esc(goal.title), n: Math.min(k.points || 0, this._cost(goal, k.id)), cost: this._cost(goal, k.id) }) : '', (k.history || []).length ? T('Zuletzt eingelöst: {emoji} {title} ({date})', { emoji: esc(k.history[0].e || '🎁'), title: esc(k.history[0].t), date: shortDate(k.history[0].d) }) : ''].filter(Boolean).join('<br>');
        // Kopf: Name, Sterne, heute erledigt, Level – aufgeklappt alles zu diesem Kind an einem Ort
        const tt = this._todayTasks(k.id).filter((t) => this._req(t) && this._status(t, k.id).s !== 'taken'), dn = tt.filter((t) => this._status(t, k.id).s === 'd').length;
        const open = !shut.has(k.id);
        const head = `<button class="kah" data-a="kadm" data-k="${k.id}" aria-expanded="${open}">${this._avc(k)}<span class="grow"><span class="kan">${esc(k.name)}</span><small>⭐ ${k.points || 0} · ${T('{done}/{total} heute erledigt', { done: dn, total: tt.length })} · ${LEVELS[lv][2]} ${T('Level {n}', { n: lv + 1 })}</small>${tt.length ? `<span class="bar"><i style="width:${Math.round((dn / tt.length) * 100)}%"></i></span>` : ''}</span><span class="accc">▸</span></button>`;
        if (!open) return `<div class="box kadm" style="${cv(k.color)}">${head}</div>`;
        return `<div class="box kadm open" style="${cv(k.color)}">${head}<div class="row krow"><span class="grow">${sub ? `<small>${sub}</small>` : ''}</span>
        ${kids.length > 1 ? `<span class="kmove"><button class="icon" data-a="kord" data-k="${k.id}" data-d="-1" title="${esc(T('Nach oben'))}" aria-label="${esc(T('Nach oben'))}" ${kids[0].id === k.id ? 'disabled' : ''}>▲</button><button class="icon" data-a="kord" data-k="${k.id}" data-d="1" title="${esc(T('Nach unten'))}" aria-label="${esc(T('Nach unten'))}" ${kids[kids.length - 1].id === k.id ? 'disabled' : ''}>▼</button></span>` : ''}
        <span class="kbtns"><button class="icon" data-a="pts" data-k="${k.id}" data-n="-1">−</button><span class="pts">${k.points || 0}</span><button class="icon" data-a="pts" data-k="${k.id}" data-n="1">＋</button><span class="kbr"></span>${this._cfg.moneyOn ? `<button class="icon lab" data-a="payout" data-k="${k.id}" title="${esc(T('Taschengeld auszahlen'))}">💶<small>${T('Auszahlen')}</small></button>` : ''}<button class="icon lab" data-a="suggest" data-k="${k.id}" title="${esc(T('Passende Aufgaben vorschlagen'))}">💡<small>${T('Vorschläge')}</small></button>${this._cfg.gradesOn ? `<button class="icon lab" data-a="grade" data-k="${k.id}" title="${esc(T('🎓 Note eintragen'))}">🎓<small>${T('Note')}</small></button>` : ''}<button class="icon lab" data-a="ledger" data-k="${k.id}" title="${esc(T('Punkte-Verlauf'))}">📜<small>${T('Verlauf')}</small></button><button class="icon lab" data-a="ekid" data-id="${k.id}">✎<small>${T('Bearbeiten')}</small></button></span></div>
        ${this._cfg.behavOn ? `<div class="lbl">${T('📊 Verhalten – letzte 14 Tage')}</div>${this._behChart(k)}<div class="hint">${T('Grün = artig (+), rot = unartig (−). Höhe = Sterne des Tages.')}</div>` : ''}</div>`;
      }).join('') || `<div class="box"><div class="hint">${T('Noch keine Kinder angelegt.')}</div></div>`}
        <div><button class="btn primary" data-a="ekid">${T('＋ Kind')}</button></div>`;
    }

    // 📊 Berichte: Tage (60) und Wochen (52) aus den eingefrorenen Schnappschüssen – heute bzw. diese Woche live
    _repBox(kids) {
      if (!kids.length) return '';
      if (this._repOpen === undefined) { try { this._repOpen = localStorage.getItem('kpRep') === '1'; } catch (e) { this._repOpen = false; } }
      const o = this._repOpen, mode = this._repMode || 'd', today = dk(new Date());
      const headCell = (k) => `<th>${esc(k.emoji || '')}<span>${esc(k.name)}</span></th>`;
      let rows = '', more = '', total = 0;
      if (o && mode === 'd') {
        const dates = [...new Set(kids.flatMap((k) => Object.keys(k.rd || {})))].filter((d) => d < today).sort().reverse();
        total = dates.length;
        const n = Math.min(this._repN || 14, dates.length);
        const cell = (s) => (!s ? '<td class="na">·</td>' : !s[1] && !s[2] ? '<td class="na">–</td>' : `<td><b>${s[1] ? `${s[0]}/${s[1]}${s[0] === s[1] ? ' ✅' : ''}` : '–'}</b><small>+${s[2]} ⭐${s[4] ? ` · ⏳${s[4]}` : ''}</small></td>`);
        rows = [`<tr class="today" data-a="repday" data-d="${today}"><th>${T('heute')}</th>${kids.map((k) => cell(this._daySnap(k, today))).join('')}</tr>`, ...dates.slice(0, n).map((d) => `<tr data-a="repday" data-d="${d}"><th>${esc(longDate(d))}</th>${kids.map((k) => cell((k.rd || {})[d])).join('')}</tr>`)].join('');
        if (dates.length > n) more = `<button type="button" class="btn sm" data-a="repmore">${T('Mehr anzeigen')}</button>`;
      } else if (o && mode === 'c') {
        rows = '';
      } else if (o) {
        const mon0 = this._monOf(today);
        const weeks = [...new Set(kids.flatMap((k) => Object.keys(k.rw || {})))].filter((d) => d < mon0).sort().reverse();
        total = weeks.length;
        const cell = (w) => (!w ? '<td class="na">·</td>' : `<td><b>${w[1] ? `${w[0]}/${w[1]}` : '–'}</b><small>+${w[2]} ⭐${w[3] ? ` · 🎁${w[3]}` : ''}</small></td>`);
        const lbl = (m) => { const [y, mm, d] = m.split('-').map(Number); return `${shortDate(m)}–${shortDate(dk(new Date(y, mm - 1, d + 6)))}`; };
        rows = [`<tr class="today"><th>${T('diese Woche')}</th>${kids.map((k) => { const w = this._weekStats(k); return cell([w.done, w.due, w.plus, w.spent]); }).join('')}</tr>`,
          ...weeks.map((m) => `<tr><th>${esc(lbl(m))}</th>${kids.map((k) => cell((k.rw || {})[m])).join('')}</tr>`)].join('');
      }
      return `<div class="box repbox"><button class="kvsect sect" data-a="repbox" aria-expanded="${o}"><span>${T('📊 Berichte')}</span><span class="hint"><span class="accc">▸</span></span></button>
        ${o ? `<div class="seg"><button type="button" class="${mode === 'd' ? 'on' : ''}" data-a="repmode" data-m="d">${T('Tage')}</button><button type="button" class="${mode === 'w' ? 'on' : ''}" data-a="repmode" data-m="w">${T('Wochen')}</button><button type="button" class="${mode === 'c' ? 'on' : ''}" data-a="repmode" data-m="c">${T('📈 5 Wochen')}</button><button type="button" class="${mode === 'r' ? 'on' : ''}" data-a="repmode" data-m="r">${T('📅 Rückblick')}</button></div>
        ${mode === 'r' ? `${kids.map((k) => { const l = this._rcpList(k); return `<div class="kcsec">${esc(k.emoji || '')} ${esc(k.name)}</div>${l.length ? l.map((r) => `<button class="kcrc" data-a="rcpopen" data-k="${k.id}" data-x="${r.key}"><span class="e">📅</span><span class="grow"><b>${esc(r.title)}</b><small>${T('{n} ⭐ gesammelt', { n: r.stars })} · ${T('{n} Aufgaben erledigt', { n: r.tasks })}</small></span><span class="chev">›</span></button>`).join('') : `<div class="hint">${T('Noch keine Daten – der erste Rückblick kommt am 1. des nächsten Monats.')}</div>`}`; }).join('')}<div class="hint">${`${T('Die Kinder sehen ihren Rückblick den ganzen Monat unter 🏆 Sammlung – vom 1. bis 14. als „neu“ markiert. Den Jahresrückblick gibt es im ganzen Januar.')} ${T('In der klassischen Ansicht steht der Rückblick als 📅-Knopf unter den Abzeichen.')}`}</div>` : mode === 'c' ? `${kids.map((k) => this._statKid(k, undefined, true)).join('')}<div class="hint">${T('Balken = Anteil erledigter Pflicht-Aufgaben, oben = verdiente Sterne der Woche.')}</div>` : `<div class="reptw"><table class="rept"><thead><tr><th></th>${kids.map(headCell).join('')}</tr></thead><tbody>${rows}</tbody></table></div>${more}`}
        ${mode === 'c' ? '' : `<div class="btnrow"><button type="button" class="btn sm" data-a="repcsv">${T('⬇️ Als Tabelle (CSV)')}</button></div>
        <div class="hint">${mode === 'd' ? T('Erledigte/fällige Pflicht-Aufgaben und verdiente Sterne. Antippen zeigt Einzelheiten. Gespeichert werden 60 Tage – jeder Tag kommt am Tag danach dazu.') : T('Gespeichert werden 52 Wochen.')}${total ? '' : ` ${T('Die Berichte füllen sich ab dem Update – Tag für Tag.')}`}</div>`}` : ''}</div>`;
    }

    // 📊 Verhaltens-Diagramm (Idee: Locodice67): 😊/😠-Buchungen der letzten Tage aus dem Punkte-Verlauf
    _behStats(k, days) {
      const today = new Date(), out = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i), key = dk(d);
        let good = 0, bad = 0;
        (k.ledger || []).forEach((x) => { if (x.d !== key) return; const rr = String(x.r || ''); if (rr.startsWith('😊')) good += Math.max(0, x.n || 0); else if (rr.startsWith('😠')) bad += Math.max(0, -(x.n || 0)); });
        out.push({ good, bad, day: d.getDate() });
      }
      return out;
    }

    _behChart(k) {
      const days = this._behStats(k, 14), n = days.length;
      const max = Math.max(1, ...days.map((x) => Math.max(x.good, x.bad)));
      const net = days.map((x) => x.good - x.bad), good = days.reduce((a, x) => a + x.good, 0), bad = days.reduce((a, x) => a + x.bad, 0);
      const avg = net.reduce((a, b) => a + b, 0) / n, half = Math.floor(n / 2);
      const diff = net.slice(n - half).reduce((a, b) => a + b, 0) - net.slice(0, n - half).reduce((a, b) => a + b, 0);
      const arrow = diff > 0 ? '↗' : diff < 0 ? '↘' : '→', col = diff > 0 ? '#2b8a3e' : diff < 0 ? '#c92a2a' : 'var(--mu)';
      return `<div class="bhwrap" style="${cv(k.color)}"><div class="bhname">${this._avc(k)}<span>${esc(k.name)}</span></div><div class="bh">${days.map((x, i) => `<div class="bhd${i === n - 1 ? ' today' : ''}" title="${i === n - 1 ? `${esc(T('heute'))} · ` : ''}${x.good} 😊 / ${x.bad} 😠"><div class="bhu"><i style="height:${Math.round((x.good / max) * 100)}%"></i></div><div class="bhl"><i style="height:${Math.round((x.bad / max) * 100)}%"></i></div><span>${x.day}</span></div>`).join('')}</div></div>
        <div class="hint bhsum">${T('Mittel: {avg} ⭐/Tag · {good} 😊 / {bad} 😠 · Trend:', { avg: `${avg >= 0 ? '+' : ''}${avg.toFixed(1).replace('.', ',')}`, good, bad })} <b style="color:${col}">${arrow}</b></div>`;
    }

    // ---------- Formulare ----------
    _presEditor(k) {
      const pr = this._presCfg(k.pres && { ...k.pres, on: true }) || {}, on = !!(k.pres && k.pres.on), hol = pr.hol || {};
      const wd = (attr, v) => `<select ${attr}>${[1, 2, 3, 4, 5, 6, 0].map((x) => `<option value="${x}" ${Number(v) === x ? 'selected' : ''}>${Y.DAYS[x]}</option>`).join('')}</select>`;
      const exRow = (x = {}) => `<div class="g3 exrow" style="grid-template-columns:repeat(2,minmax(0,1fr));align-items:end;margin-top:8px;padding-bottom:8px;border-bottom:1px solid var(--ln)"><label>${T('von')}<input type="date" data-exf value="${esc(x.from || '')}"></label><label>${T('bis')}<input type="date" data-ext value="${esc(x.to || '')}"></label><label>${T('ab (Uhrzeit)')}<input type="time" data-exft value="${esc(x.fT || '')}"></label><label>${T('bis (Uhrzeit)')}<input type="time" data-extt value="${esc(x.tT || '')}"></label><label><select data-exs><option value="in" ${x.st !== 'out' ? 'selected' : ''}>${T('da')}</option><option value="out" ${x.st === 'out' ? 'selected' : ''}>${T('nicht da')}</option></select></label><div style="text-align:right"><button type="button" class="icon" data-a="exdel">✕</button></div></div>`;
      const ruRow = (r = {}) => `<div class="prule" style="margin-top:8px;padding:8px;border-radius:12px;background:var(--bg)">
        <div class="g2 g2e"><label>${T('Kind ist')}<select data-rst><option value="out" ${r.st !== 'in' ? 'selected' : ''}>${T('nicht da')}</option><option value="in" ${r.st === 'in' ? 'selected' : ''}>${T('da')}</option></select></label>
        <label>${T('Rhythmus')}<select data-rev>${[[1, T('jede Woche')], [2, T('alle 2 Wochen')], [3, T('alle 3 Wochen')], [4, T('alle 4 Wochen')]].map(([v, l]) => `<option value="${v}" ${Number(r.every || 1) === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label></div>
        <div class="g2 g2e"><label>${T('ab (erster Termin)')}<input type="date" data-rsd value="${esc(r.start || '')}"></label><label>${T('um')}<input type="time" data-rft value="${esc(r.fT || '')}"></label></div>
        <div class="g2 g2e" style="grid-template-columns:1fr 1fr auto;align-items:end"><label>${T('bis')}${wd('data-rtd', r.toDay !== undefined ? r.toDay : 0)}</label><label>${T('um')}<input type="time" data-rtt value="${esc(r.tT || '')}"></label><button type="button" class="icon" data-a="rudel">✕</button></div></div>`;
      this._exRow = exRow; this._ruRow = ruRow;
      return `<details class="tpl pres" ${on ? 'open' : ''}><summary>${T('🏠 Anwesenheit (Umgang / Wechselmodell)')}</summary>
        <label class="crow"><input type="checkbox" name="presOn" ${on ? 'checked' : ''}><span>${T('Kind ist nicht immer bei uns')}<small>${T('Wenn das Kind nicht da ist, gibt es keine Aufgaben, keine Erinnerungen und kein „verpasst“ – die 🔥-Serie bleibt erhalten.')}</small></span></label>
        <label>${T('Normalerweise')}<select name="pBase"><option value="in" ${pr.base !== 'out' ? 'selected' : ''}>${T('🏠 meistens bei uns')}</option><option value="out" ${pr.base === 'out' ? 'selected' : ''}>${T('🚗 meistens woanders')}</option></select></label>
        <div class="hint">${T('bei uns – die Regeln sagen, wann es weg ist')} · ${T('nicht bei uns – die Regeln sagen, wann es da ist')}</div>
        <div class="lbl">${T('🔁 Regeln')}</div>
        <div data-ru-wrap>${(pr.rules || []).map((r) => ruRow(r)).join('')}</div>
        <button type="button" class="btn sm" data-a="ruadd">${T('＋ Regel')}</button>
        <div class="hint">${T('Beispiele: „nicht da – jede Woche – ab Mi 14:00 bis Do 08:00“ (ein Tag unter der Woche) und „nicht da – alle 2 Wochen – ab Fr 15:00 bis So 18:00“ (jedes 2. Wochenende). Der erste Termin legt Wochentag und Woche fest. Leere Uhrzeit = ganzer Tag.')}</div>
        <div class="lbl">${T('🏖️ Ferienregelung')}</div>
        ${HOL_TYPES.map(([id, lbl]) => `<div class="g2 g2e" style="grid-template-columns:1fr 64px;align-items:end"><label>${T(lbl)}<select name="ph_${id}">${HOL_RULES.map(([v, l]) => `<option value="${v}" ${((hol[id] || {}).m || '') === v ? 'selected' : ''}>${T(l)}</option>`).join('')}</select></label><label class="pwk" style="visibility:${/W$/.test((hol[id] || {}).m || '') ? 'visible' : 'hidden'}">${T('Wochen')}<input type="number" min="1" max="8" name="pw_${id}" value="${(hol[id] || {}).w || 3}"></label></div>`).join('')}
        <label class="crow"><input type="checkbox" name="pSwap" ${pr.swap ? 'checked' : ''}><span>${T('Jährlich wechseln')}<small>${T('In ungeraden Jahren gilt die Ferienregelung umgekehrt (z. B. erste statt zweite Hälfte).')}</small></span></label>
        <div class="g2 g2e"><label>${T('Ferien: Ankunft um')}<input type="time" name="pHA" value="${esc(pr.hA || '')}"></label><label>${T('Ferien: Abreise um')}<input type="time" name="pHL" value="${esc(pr.hL || '')}"></label></div>
        <div class="hint">${T('„Bei mir“ = bei uns. Braucht Land und Region unter ⚙️ Einstellungen → 🏖️ Urlaub & Ferien. Leere Uhrzeit = ganzer Tag.')}</div>
        <div class="lbl">${T('📌 Ausnahmen')}</div>
        <div data-exs-wrap>${(pr.ex || []).map((x) => exRow(x)).join('')}</div>
        <button type="button" class="btn sm" data-a="exadd">${T('＋ Ausnahme')}</button>
        <div class="hint">${T('Z. B. getauschtes Wochenende. Ausnahmen gelten vor Ferienregelung und Regeln.')} ${T('Uhrzeit „ab“ gilt am ersten Tag, „bis“ am letzten (z. B. Ankunft und Abreise) – davor bzw. danach gilt, was sonst gilt. Leer = ganzer Tag.')}</div>
        <div class="tplbar"><span class="lbl">${T('Vorschau: da in den nächsten 8 Wochen')}</span><button type="button" class="btn sm" data-a="prprev">${T('🔄 Vorschau')}</button></div>
        <div class="hint" data-prprev>${k.id && on ? this._presPreview(k.id, 8).map(esc).join('<br>') || T('In den nächsten 8 Wochen nicht da.') : ''}</div>
      </details>`;
    }

    _editKid(id) {
      const n = this._kids().length;
      const k = id ? this._db.kid[id] : { name: '', emoji: AVATARS[n % AVATARS.length], color: COLORS[n % COLORS.length], points: 0 };
      this._modal(id ? T('Kind bearbeiten') : T('Neues Kind'), `
        <label>${T('Name')}<input name="name" value="${esc(k.name)}" placeholder="${esc(T('z. B. Mia'))}"></label>
        <div class="lbl">${T('Avatar')}</div><div class="pick">${AVATARS.map((a) => `<label><input type="radio" name="emoji" value="${a}" ${k.emoji === a ? 'checked' : ''}><span>${a}</span></label>`).join('')}</div>
        <div class="lbl">${T('Farbe')}</div><div class="pick sw">${COLORS.map((c) => `<label><input type="radio" name="color" value="${c}" ${k.color === c ? 'checked' : ''}><span style="background:${c}"></span></label>`).join('')}</div>
        <div class="g3"><label>${T('Tag')}<select name="bd"><option value="">–</option>${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}" ${Number(k.bd) === i + 1 ? 'selected' : ''}>${i + 1}.</option>`).join('')}</select></label><label>${T('Geburtsmonat')}<select name="bm"><option value="">–</option>${Y.MONTHS.map((m, i) => `<option value="${i + 1}" ${Number(k.bm) === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
        <label>${T('Geburtsjahr')}<input type="number" name="by" min="${new Date().getFullYear() - 18}" max="${new Date().getFullYear()}" value="${esc(k.by || '')}" placeholder="${esc(T('z. B. {year}', { year: new Date().getFullYear() - 7 }))}"></label></div>
        <div class="hint">${T('Damit schlägt die Karte altersgerechte Aufgaben vor (2–17 Jahre). Mit dem Tag feiert sie auch den Geburtstag 🎂 (⚙️ Einstellungen → ⭐ Punkte & Boni → 🎂 Geburtstag).')}</div>
        <label>${T('🎒 Eingeschult im (Monat/Jahr)')}<input type="month" name="school" value="${esc(/^\d{4}-\d\d$/.test(k.school || '') ? k.school : '')}"></label>
        <div class="hint">${T('Optional. Leer = übliches Einschulungsalter im eingestellten Land ({n} Jahre). Danach richten sich die Schul-Vorlagen, und die Karte zeigt die Klasse an.', { n: this._schoolAge() })}</div>
        <label class="crow"><input type="checkbox" name="sat" ${k.sat ? 'checked' : ''}><span>${T('🎒 Samstagsschule – auch samstags Unterricht')}<small>${T('Schultage zählen regulär von Montag bis Freitag. Hat das Kind auch samstags Unterricht, hier anhaken – dann zählt der Samstag als Schultag (außer in Ferien und an Feiertagen).')}</small></span></label>
        <label class="crow"><input type="checkbox" name="rdr" ${k.rdr ? 'checked' : ''}><span>${T('🔊 Leseanfänger-Modus')}<small>${T('Große Bilder, wenig Text – ein 🔊-Knopf auf jeder Aufgabe liest sie vor. Für Kinder, die noch nicht lesen können.')}</small></span></label>
        <label class="sub">${T('Vorlesen über')}<select name="rdOut"><option value="dev" ${k.rdOut !== 'spk' ? 'selected' : ''}>${T('📱 dieses Gerät')}</option><option value="spk" ${k.rdOut === 'spk' ? 'selected' : ''} ${this._cfg.rTts && (this._cfg.rPlayers || []).length ? '' : 'disabled'}>${T('🔈 Lautsprecher (aus 🔊 Sprachausgabe)')}</option></select></label>
        ${this._presEditor(k)}
        ${this._cfg.nfcOn ? `<label>${T('📱 Home-Assistant-Benutzer des Kindes')}<select name="kuser"><option value="">${T('– keiner –')}</option>${this._persons().map((p) => `<option value="${esc(p.u)}" ${k.user === p.u ? 'selected' : ''}>${esc(p.n)}</option>`).join('')}</select></label>
        <div class="hint">${T('Für 🏷️ NFC-Tags: So erkennt die Karte, welches Kind gescannt hat.')}</div>` : ''}
        <div class="g2 g2e"><label>${T('Punkte')}<input type="number" min="0" name="points" value="${k.points || 0}"></label>
        <label>${T('Verdiente Sterne (Level)')}<input type="number" min="0" name="total" value="${k.total !== undefined ? k.total : (k.points || 0)}"></label></div>
        ${this._cfg.jokerOn ? `<label>${T('🃏 Joker')}<input type="number" min="0" max="99" name="jokers" value="${k.jokers || 0}"></label>` : ''}
        ${id ? `<div class="hint">${T('Level {lv} · Änderst du nur die Punkte, wird das Level automatisch mit korrigiert. „Verdiente Sterne“ legt das Level direkt fest (z. B. 0 = zurück auf Level 1).', { lv: levelOf(k.total !== undefined ? k.total : (k.points || 0)) + 1 })}</div>` : ''}`,
      id, {
        save: (b) => {
          const name = b.querySelector('[name=name]').value.trim();
          if (!name) { this._toast(T('Bitte einen Namen eingeben')); return false; }
          const by = Number(b.querySelector('[name=by]').value) || 0, bm = Number(b.querySelector('[name=bm]').value) || 0, bdd = Number(b.querySelector('[name=bd]').value) || 0;
          if (bdd && bm && bdd > new Date(by || 2024, bm, 0).getDate()) { this._toast(T('Diesen Tag gibt es in dem Monat nicht')); return false; }
          const yNow = new Date().getFullYear();
          if (by && (by < yNow - 25 || by > yNow)) { this._toast(T('Bitte ein gültiges Geburtsjahr eingeben')); return false; }
          const kid = id || uid();
          const newPts = Math.max(0, Math.round(Number(b.querySelector('[name=points]').value) || 0)), oldPts = k.points || 0;
          const oldTot = k.total !== undefined ? k.total : oldPts, totIn = Math.max(0, Math.round(Number(b.querySelector('[name=total]').value) || 0));
          const diff = id ? newPts - oldPts : 0, totChanged = id && totIn !== oldTot;
          const total = !id ? newPts : totChanged ? totIn : Math.max(0, oldTot + diff);
          const now0 = new Date();
          const sch = String((b.querySelector('[name=school]') || {}).value || '');
          const jkEl = b.querySelector('[name=jokers]'), jk = jkEl ? Math.max(0, Math.min(99, Math.round(Number(jkEl.value) || 0))) : null;
          if (jk !== null && id && jk !== (k.jokers || 0)) this._audit(T('🃏 Joker von Hand: {name} {from} → {to}', { name, from: k.jokers || 0, to: jk }));
          const pres = this._presRead(b);
          if (pres && pres.on && !pres.rules.length && !(pres.ex || []).length && !Object.keys(pres.hol).length) { this._toast(T('🏠 Bitte mindestens eine Regel mit erstem Termin eintragen')); return false; }
          const jkDiff = jk !== null && id ? jk - (k.jokers || 0) : 0; // Joker als Differenz buchen – ein inzwischen eingesetzter/gewonnener Joker bleibt erhalten
          const kuEl = b.querySelector('[name=kuser]');
          const base = { ...(jk !== null && !id ? { jokers: jk } : {}), ...(kuEl ? { user: kuEl.value } : {}),
             ...(pres ? { pres } : {}), rdr: !!(b.querySelector('[name=rdr]') || {}).checked, rdOut: (b.querySelector('[name=rdOut]') || {}).value === 'spk' ? 'spk' : 'dev', name, by: by || '', bm: bm || '', bd: bdd || '', school: /^\d{4}-\d\d$/.test(sch) ? sch : '', sat: !!(b.querySelector('[name=sat]') || {}).checked, emoji: (b.querySelector('[name=emoji]:checked') || {}).value || k.emoji, color: (b.querySelector('[name=color]:checked') || {}).value || k.color };
          // Änderungen nur als Differenz auf den aktuellen Stand anwenden (Punkte können sich während des Bearbeitens ändern)
          const apply = (cur) => {
            const o = { ...cur, ...base };
            const cp = cur.points || 0, ct = cur.total !== undefined ? cur.total : cp;
            let led = cur.ledger || [], wk = cur.wk;
            if (diff) { const en = { d: dk(now0), t: hhmm(now0), n: diff, r: 'Von Hand (Eltern)', ...(totChanged ? { e: 0 } : {}) }; led = [en, ...led]; wk = this._wkAdd(wk, en); }
            if (totChanged) { const en = { d: dk(now0), t: hhmm(now0), n: 0, e: totIn - ct, r: '⭐ Verdiente Sterne korrigiert (Eltern)' }; led = [en, ...led]; wk = this._wkAdd(wk, en); }
            o.points = Math.max(0, cp + diff);
            o.total = totChanged ? totIn : Math.max(0, ct + diff);
            o.ledger = led.slice(0, 150);
            if (wk) o.wk = wk;
            return o;
          };
          if (id) this._save('kid', kid, apply(k), apply);
          if (jkDiff) this._addPoints(kid, 0, '🃏 Joker', { inc: { jokers: jkDiff } });
          else this._save('kid', kid, { ...k, ...base, points: newPts, total, since: dk(now0) });
          if (diff && !totChanged) this._familyAdd(diff);
          if (!id && by) setTimeout(() => this._suggest(kid), 300);
          return true;
        },
        del: () => { this._delUndo('kid', id); return true; },
      });
    }

    // 🧭 Einrichtungs-Assistent: beim ersten Start (noch nichts angelegt) – Kinder → Aufgaben → Belohnungen → fertig
    _wizShow(kids) {
      const w = this._wiz;
      if (w) {
        // automatisch gestartet, aber Daten kommen von woanders (anderes Gerät, Sicherung) → Assistent beenden
        if (w.auto && (kids.some((k) => !w.kids.has(k.id)) || Object.keys(this._db.task).length || Object.keys(this._db.reward).length)) { this._wiz = null; return false; }
        return true;
      }
      if (!this._loaded || this._cfg.wizDone || this._config.wizard === false || kids.length || Object.keys(this._db.task).length || Object.keys(this._db.reward).length) return false;
      this._wiz = { step: 1, auto: true, kids: new Set() };
      return true;
    }

    // Routinen-Vorlagen für den Assistenten (die zu mindestens einem Kind passen)
    _wizRouts(kids) { return TEMPLATES.map((x, i) => ({ x, i })).filter(({ x }) => ROUT_STEPS[x[2]] && kids.some((k) => tplOk(x, this._tplAge(x, k)))); }

    _wizTpls(kids) {
      return TEMPLATES.map((x, i) => ({ x, i })).filter(({ x }) => !ROUT_STEPS[x[2]] && x[5] !== 'dates' && x[5] !== 'once'
        && kids.some((k) => tplOk(x, this._tplAge(x, k))));
    }

    _wizHtml(kids) {
      const w = this._wiz, st = w.step;
      const steps = [T('👧 Kinder'), T('✅ Aufgaben'), T('🎁 Belohnungen'), T('⚙️ Funktionen'), T('🎉 Fertig')];
      const head = `<div class="wizhd"><b>${T('🧭 Einrichtung in 5 Schritten')}</b><div class="wizst">${steps.map((x, i) => `<span class="${i + 1 === st ? 'on' : i + 1 < st ? 'done' : ''}">${i + 1}. ${x.replace(/^\S+\s/, '')}</span>`).join('')}</div></div>`;
      let body = '', foot = '';
      if (st === 1) {
        // Eingaben im Kind-Formular über ein Neuzeichnen retten (z. B. wenn beim Anhaken das Namensfeld den Fokus verliert)
        const r0 = this.shadowRoot, gv = (c, k) => { const e = r0.querySelector(c); if (e) w[k] = e.type === 'checkbox' ? e.checked : e.value; };
        gv('.wizname', 'nm'); gv('.wizborn', 'bn'); gv('.wizsat', 'sat');
        const ce = r0.querySelector('.wizem:checked'), cc = r0.querySelector('.wizcol:checked'), ad = r0.querySelector('.wizav'); if (ce) w.em = ce.value; if (cc) w.col = cc.value; if (ad) w.avOpen = ad.open;
        const em = w.em || AVATARS[kids.length % AVATARS.length], col = w.col || COLORS[kids.length % COLORS.length];
        body = `<label class="setlang">${T('🌐 Sprache')}${this._langSelect(this._cfg.lang || '', 'class="prelang"')}</label>
          <div class="hint">${T('Lege zuerst deine Kinder an. Mit dem Geburtsdatum schlägt die Karte gleich passende Aufgaben vor.')}</div>
          ${kids.map((k) => `<div class="arow wizkid">${this._avc(k)}<span class="grow">${esc(k.name)}<small>${[this._age(k) !== null ? T('{n} Jahre', { n: this._age(k) }) : '', k.sat ? T('🎒 auch samstags Schule') : ''].filter(Boolean).join(' · ')}</small></span>${(w.kids || new Set()).has(k.id) ? `<button class="icon no" data-a="wiz" data-s="delkid" data-k="${k.id}" aria-label="${esc(T('Löschen'))}">✕</button>` : ''}</div>`).join('')}
          <div class="g2 g2e"><label>${T('Name')}<input type="text" class="wizname" maxlength="30" value="${esc(w.nm || '')}" placeholder="${esc(T('z. B. Mia'))}"></label>
          <label>${T('Geburtsdatum')}<input type="date" class="wizborn" max="${dk(new Date())}" value="${esc(w.bn || '')}"></label></div>
          <details class="wizav" ${w.avOpen ? 'open' : ''}><summary><span class="grow">${T('Avatar')} · ${T('Farbe')}</span><span class="wizavp" style="${cv(col)}"><span class="wizave">${em}</span></span></summary>
          <div class="pick">${AVATARS.map((a) => `<label><input type="radio" name="wizem" class="wizem" value="${a}" ${em === a ? 'checked' : ''}><span>${a}</span></label>`).join('')}</div>
          <div class="lbl">${T('Farbe')}</div><div class="pick sw">${COLORS.map((x) => `<label><input type="radio" name="wizcol" class="wizcol" value="${x}" ${col === x ? 'checked' : ''}><span style="background:${x}"></span></label>`).join('')}</div></details>
          <label class="crow"><input type="checkbox" class="wizsat" ${w.sat ? 'checked' : ''}><span>${T('🎒 Samstagsschule – auch samstags Unterricht')}<small>${T('Schultage zählen regulär von Montag bis Freitag. Hat ein Kind auch samstags Unterricht, vor dem Hinzufügen anhaken – später änderbar unter 👧 Kinder → ✎.')}</small></span></label>
          <button class="btn" data-a="wiz" data-s="addkid">${T('＋ Kind hinzufügen')}</button>`;
        foot = `<button class="btn" data-a="wiz" data-s="skip">${T('Überspringen')}</button><button class="btn primary" data-a="wiz" data-s="next" ${kids.length ? '' : 'disabled'}>${T('Weiter')}</button>`;
      } else if (st === 2) {
        const list = this._wizTpls(kids), routs = this._wizRouts(kids);
        if (!w.t) w.t = new Set(list.filter(({ x }) => WIZ_TASKS.includes(x[2])).map(({ i }) => i));
        const cats = [...new Set(list.map(({ x }) => x[0]))];
        const blkOf = (x) => this._blk({ from: (this._tplWins(x[4]).filter((y) => y[0])[0] || [''])[0] });
        const who = (x) => (kids.length > 1 ? ` · ${kids.filter((k) => tplOk(x, this._tplAge(x, k))).map((k) => esc(k.name)).join(', ')}` : '');
        const row = ({ x, i }) => { const stp = ROUT_STEPS[x[2]] ? ROUT_STEPS[x[2]].map((y) => T(y)) : null;
          return `<label class="crow" data-q="${esc(hbNorm(`${T(x[2])} ${x[2]} ${stp ? stp.join(' ') : ''}`))}"><input type="checkbox" class="wizt" value="${i}" ${w.t.has(i) ? 'checked' : ''}><span>${x[1]} ${esc(T(x[2]))}<small>${this._tplMeta(x)}${who(x)}</small>${stp ? `<small class="wizsteps">${T('📋 {n} Schritte', { n: stp.length })}: ${esc(stp.join(' · '))}</small>` : ''}</span></label>`; };
        body = `<div class="hint">${T('Vorschläge passend zum Alter – angehakt sind ein paar gute Startaufgaben. Jede Aufgabe bekommen die Kinder, für deren Alter sie passt.')}</div>
          ${routs.length ? `<div class="hint">${T('📋 Routinen stehen in jeder Gruppe oben: Eine Routine fasst mehrere Schritte zu einer Aufgabe zusammen, die Sterne gibt es beim letzten Haken. Einzelaufgaben, die schon als Schritt in einer gewählten Routine stecken, brauchst du nicht zusätzlich.')}</div>` : ''}
          <input type="search" class="wizq" enterkeyhint="search" autocomplete="off" placeholder="${esc(T('🔎 Vorlage suchen, z. B. Zähne'))}" aria-label="${esc(T('🔎 Vorlage suchen, z. B. Zähne'))}" value="${esc(w.q || '')}">
          <div><button type="button" class="btn sm" data-a="wiz" data-s="tall">${T('Alle auswählen')}</button> <button type="button" class="btn sm" data-a="wiz" data-s="tnone">${T('Keine')}</button></div>
          ${this._blockDefs().map(([b, bn]) => {
            // nach Tageszeit gruppiert (wie in der Kinder-Ansicht), jede Gruppe ein-/ausklappbar; „Ohne Zeit“ zusätzlich nach Thema
            const rs = routs.filter(({ x }) => blkOf(x) === b), ts = list.filter(({ x }) => blkOf(x) === b), its = [...rs, ...ts];
            if (!its.length) return '';
            // 📋 Routinen zuerst – sie bündeln mehrere Einzelaufgaben
            const single = b === 'day' ? cats.map((c) => { const cs = ts.filter(({ x }) => x[0] === c); return cs.length ? `<div class="tcat">${T(c)}</div>${cs.map(row).join('')}` : ''; }).join('') : `${rs.length && ts.length ? `<div class="tcat">${T('✅ Einzelaufgaben')}</div>` : ''}${ts.map(row).join('')}`;
            const inner = `${rs.length ? `<div class="tcat">${T('📋 Routinen')}</div>${rs.map(row).join('')}` : ''}${single}`;
            const on = its.filter(({ i }) => w.t.has(i)).length;
            return `<details class="wizg" data-b="${b}" ${(w.open || new Set()).has(b) ? 'open' : ''}><summary><span class="grow">${bn}</span><small class="wizn">${on}/${its.length}</small></summary>
              <div class="wizgb"><div><button type="button" class="btn sm" data-a="wiz" data-s="gall" data-b="${b}">${T('Alle auswählen')}</button> <button type="button" class="btn sm" data-a="wiz" data-s="gnone" data-b="${b}">${T('Keine')}</button></div>${inner}</div></details>`;
          }).join('')}<div class="empty wiznone" hidden>${T('Keine passende Vorlage gefunden.')}</div>`;
        foot = `<button class="btn" data-a="wiz" data-s="back">${T('Zurück')}</button><button class="btn primary" data-a="wiz" data-s="next">${T('Weiter')}</button>`;
      } else if (st === 3) {
        if (!w.r) w.r = new Set(REWARD_TEMPLATES.map((x, i) => (WIZ_REWARDS.includes(x[1]) ? i : -1)).filter((i) => i >= 0));
        body = `<div class="hint">${T('Wofür sammeln die Kinder? Preise lassen sich später jederzeit ändern.')}</div>
          ${REWARD_TEMPLATES.map((x, i) => (x[3] === 'joker' ? '' : `<div class="wizrr"><label class="crow"><input type="checkbox" class="wizr" value="${i}" ${w.r.has(i) ? 'checked' : ''}><span>${x[0]} ${esc(T(x[1]))}</span></label><label class="wizrc">⭐<input type="number" min="1" max="9999" inputmode="numeric" class="wizrcv" data-i="${i}" value="${esc(String((w.rc || {})[i] || x[2]))}" aria-label="${esc(T('Sterne'))}"></label></div>`)).join('')}`;
        foot = `<button class="btn" data-a="wiz" data-s="back">${T('Zurück')}</button><button class="btn primary" data-a="wiz" data-s="next">${T('Weiter')}</button>`;
      } else if (st === 4) {
        // Beliebte Funktionen gleich mit einschalten (alles später unter ⚙️ Einstellungen änderbar)
        const c = this._cfg;
        const hasR = [...(w.t || [])].some((i) => TEMPLATES[i] && ROUT_STEPS[TEMPLATES[i][2]]);
        if (!w.f) w.f = { dayBlocks: !!c.dayBlocks, routOn: !!c.routOn || hasR, approval: c.approval !== false, bdOn: !!c.bdOn };
        if (hasR) w.f.routOn = true; // gewählte Routinen brauchen die Funktion
        const phones = Object.keys((this._hass.services && this._hass.services.notify) || {}).filter((x) => x.startsWith('mobile_app_')).sort();
        if (!w.p) w.p = new Set(phones.filter((p) => (c.targets || []).includes(p)));
        const opts = [['dayBlocks', T('⏰ Tagesblöcke<small>Fasst die Aufgaben eines Kindes in Morgen, Mittag und Abend zusammen – jede Gruppe mit eigenem Fortschritt.</small>')], ['routOn', T('📋 Routinen<small>Mehrere Schritte in einer Aufgabe (z. B. Morgen-Routine): Das Kind hakt jeden Schritt einzeln ab, die Sterne gibt es beim letzten Haken. In der Aufgabe (✎) die Schritte eintragen.</small>')], ['approval', `${T('👍 Freigabe')}<small>${T('Erledigte Aufgaben und Einlösungen müssen von Eltern freigegeben werden')}</small>`], ['bdOn', T('🎂 Geburtstag<small>Am Geburtstag Glückwunsch, Konfetti und Bonus-Sterne. Dafür beim Kind (✎) Tag, Monat und Jahr eintragen.</small>')]];
        body = `<div class="hint">${T('Ein paar beliebte Funktionen – gleich mit einschalten? Alles lässt sich später unter ⚙️ Einstellungen ändern.')}</div>
          ${opts.map(([k, l]) => `<label class="crow"><input type="checkbox" class="wizf" data-k="${k}" ${w.f[k] ? 'checked' : ''}><span>${l}</span></label>`).join('')}
          <div class="lbl">${T('📱 Benachrichtigungen an')}</div>
          <div class="hint">${T('Wohin sollen Nachrichten wie Freigaben und Erinnerungen gehen?')}</div>
          ${phones.map((p) => `<label class="crow"><input type="checkbox" class="wizp" value="${esc(p)}" ${w.p.has(p) ? 'checked' : ''}><span>${esc(this._phoneName(p))}<small>notify.${esc(p)}</small></span></label>`).join('') || `<div class="hint">${T('Keine Handys mit der Home-Assistant-App gefunden.')}</div>`}`;
        foot = `<button class="btn" data-a="wiz" data-s="back">${T('Zurück')}</button><button class="btn primary" data-a="wiz" data-s="next">${T('Weiter')}</button>`;
      } else {
        body = `<div class="wizdone">🎉</div><div class="hint">${T('{k} Kinder, {t} Aufgaben und {r} Belohnungen werden angelegt.', { k: kids.length, t: (w.t || new Set()).size, r: (w.r || new Set()).size })}</div>
          <div class="hint">${T('Für die Kinder fügst du dem Dashboard eine zweite Yippee!-Karte mit der Ansicht „Alle Kinder“ oder „Ein bestimmtes Kind“ hinzu (z. B. auf dem Tablet).')}</div>
          <div class="lbl">${T('🧒 Kinder-Karte')}</div>
          <div class="hint">${T('Dashboard bearbeiten → ＋ Karte hinzufügen → ganz unten „Manuell“ → diesen Text einfügen:')}</div>
          <pre class="code wizyaml">type: custom:yippee-kids-chores-card\nstorage: ${esc(this._config.storage)}\nmode: kids</pre>
          <div><button type="button" class="btn sm" data-a="wiz" data-s="copy">${T('📋 Kopieren')}</button></div>
          <div class="hint">${T('Weitere Funktionen wie Serien-Bonus, Taschengeld, Routinen oder NFC findest du unter ⚙️ Einstellungen → „Alle Einstellungen“. Das 📖 Handbuch erklärt alles.')}</div>`;
        foot = `<button class="btn" data-a="wiz" data-s="back">${T('Zurück')}</button><button class="btn primary" data-a="wiz" data-s="done">${T('✓ Fertig')}</button>`;
      }
      return `<div class="box wiz">${head}${body}<div class="wizft">${foot}</div></div>`;
    }

    _wizAct(ds, el) {
      const w = this._wiz || (this._wiz = { step: 1, kids: new Set() }), kids = this._kids(), root = this.shadowRoot;
      const keep = () => this._wizKeep();
      if (ds.s !== 'addkid') { const ae = root.activeElement; if (ae && ae.blur) ae.blur(); }
      switch (ds.s) {
        case 'addkid': {
          const nm = (root.querySelector('.wizname') || {}).value || '', bn = (root.querySelector('.wizborn') || {}).value || '';
          const name = nm.trim();
          if (!name) { this._toast(T('Bitte einen Namen eingeben')); return; }
          const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(bn), n = kids.length;
          const nk = uid(); (w.kids || (w.kids = new Set())).add(nk);
          const pe = root.querySelector('.wizem:checked'), pc = root.querySelector('.wizcol:checked');
          this._save('kid', nk, { name, emoji: pe ? pe.value : AVATARS[n % AVATARS.length], color: pc ? pc.value : COLORS[n % COLORS.length], points: 0, total: 0, since: dk(new Date()),
            by: m ? Number(m[1]) : '', bm: m ? Number(m[2]) : '', bd: m ? Number(m[3]) : '', sat: !!(root.querySelector('.wizsat') || {}).checked });
          w.t = null; w.nm = ''; w.bn = ''; w.sat = false; w.em = ''; w.col = '';
          root.querySelectorAll('.wizem, .wizcol').forEach((e) => { e.checked = false; }); // nächstes Kind bekommt wieder eigene Vorschläge
          root.querySelectorAll('.wizname, .wizborn').forEach((e) => { e.value = ''; }); root.querySelectorAll('.wizsat').forEach((e) => { e.checked = false; });
          break;
        }
        case 'delkid': if ((w.kids || new Set()).has(ds.k)) { this._del('kid', ds.k); w.kids.delete(ds.k); w.t = null; } break;
        case 'tall': root.querySelectorAll('.wizt').forEach((x) => { x.checked = true; }); this._wizCount(); return;
        case 'tnone': root.querySelectorAll('.wizt').forEach((x) => { x.checked = false; }); this._wizCount(); return;
        case 'copy': { const pre = root.querySelector('.wizyaml'); this._copy(pre ? pre.textContent : '', T('📋 Kopiert')); return; }
        case 'gall': case 'gnone': root.querySelectorAll(`.wizg[data-b="${ds.b}"] .crow:not([hidden]) .wizt`).forEach((x) => { x.checked = ds.s === 'gall'; }); this._wizCount(); return;
        case 'next': if (w.step === 1 && !kids.length) return; keep(); w.step = Math.min(5, w.step + 1); break;
        case 'back': keep(); w.step = Math.max(1, w.step - 1); break;
        case 'skip': this._wiz = null; this._setCfg({ wizDone: true }); break;
        case 'done': {
          let nt = 0, nr = 0; w.auto = false;
          // Einstellungen zuerst (gewählte Routinen brauchen 📋 Routinen schon beim Anlegen)
          const c0 = this._cfg, pre = { ...(w.f || {}) };
          if ([...(w.t || [])].some((i) => TEMPLATES[i] && ROUT_STEPS[TEMPLATES[i][2]])) pre.routOn = true;
          if (w.p) pre.targets = [...new Set([...(c0.targets || []).filter((t) => !t.startsWith('mobile_app_')), ...w.p])];
          this._setCfg(pre);
          (w.t || new Set()).forEach((i) => {
            const tp = TEMPLATES[i], fit = kids.filter((k) => tplOk(tp, this._tplAge(tp, k))).map((k) => k.id);
            if (!tp || !fit.length) return;
            const ex = Object.values(this._db.task).find((t) => !t.virtual && [tp[2], T(tp[2])].map((x) => x.toLowerCase()).includes(String(t.title).toLowerCase()));
            if (ex) { const ks = [...new Set([...(ex.kids || []), ...fit])]; if (ks.length !== (ex.kids || []).length) this._save('task', ex.id, { ...ex, kids: ks }); }
            else { this._save('task', uid(), this._taskFromTemplate(tp, fit)); nt++; }
          });
          (w.r || new Set()).forEach((i) => { const x = REWARD_TEMPLATES[i]; if (!x || Object.values(this._db.reward).some((r) => [x[1], T(x[1])].includes(r.title))) return; this._save('reward', uid(), { title: T(x[1]), emoji: x[0], cost: Number((w.rc || {})[i]) || x[2], limit: 0 }); nr++; });
          this._wiz = null; this._tab = 'heute';
          this._setCfg({ wizDone: true, setView: 'simple' });
          this._toast(T('🎉 Fertig! {t} Aufgaben und {r} Belohnungen angelegt.', { t: nt, r: nr }));
          break;
        }
        default: return;
      }
      this._render();
      const f = root.querySelector('.wiz'); if (f && f.scrollIntoView && ds.s !== 'addkid' && ds.s !== 'delkid') f.scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (ds.s === 'addkid') { const i = root.querySelector('.wizname'); if (i) i.focus(); }
    }

    // 💽 Speicher: Größe der Liste und Aufräumen
    _memSection() {
      const m = this._mem || { total: 0, by: {} }, kb = (b) => `${Math.max(1, Math.round(b / 1024))} KB`;
      const parts = [['📦', T('Kinder, Aufgaben, Belohnungen'), ['kid', 'task', 'reward', 'cfg', 'plan', 'pt', 'act', 'req', 'sens']], ['📅', T('Tagesprotokolle'), ['log']], ['💾', T('Automatische Sicherungen'), ['bak']], ['📷', T('Fotos'), ['ph']], ['🗑️', T('Papierkorb'), ['trash']], ['📜', T('Änderungsprotokoll'), ['audit']]];
      const rows = parts.map(([e, l, ts]) => [e, l, ts.reduce((a, t) => a + (m.by[t] || 0), 0)]).filter((x) => x[2] > 0);
      const big = m.total > 1.5 * 1024 * 1024;
      return ['mem', T('💽 Speicher'), `${kb(m.total)}${big ? ' ⚠️' : ''}`, `
        <div class="hint">${T('So viel belegt die Karte in der To-do-Liste {list}:', { list: esc(this._config.storage) })}</div>
        ${rows.map(([e, l, b]) => `<div class="arow"><span class="grow">${e} ${l}</span><b>${kb(b)}</b></div>`).join('')}
        <div class="arow"><span class="grow"><b>${T('Gesamt')}</b></span><b>${kb(m.total)}</b></div>
        ${big ? `<div class="hint">${T('⚠️ Die Liste ist recht groß – das kann das Laden verlangsamen. Tipp: aufräumen, Fotos in eine eigene Liste und Sicherungen in eine zweite Liste legen.')}</div>` : ''}
        <button class="btn" data-a="memclean"><span class="hint">${T('🧹 Alte Einträge aufräumen')}</span></button>
        <div class="hint">${T('Entfernt Tagesprotokolle älter als 5 Wochen (die Statistik bleibt vollständig), Papierkorb-Einträge älter als {n} Tage, Fotos ohne offene Freigabe und kürzt das Änderungsprotokoll auf 100 Einträge. Kinder, Aufgaben, Punkte und Verlauf bleiben unverändert.', { n: this._trashDays() })}</div>`];
    }

    // weitere Zeitfenster außer dem Haupt-Zeitfenster (von/bis oben)
    _slotExtra(t) {
      if (!Array.isArray(t.slots) || t.slots.length < 2) return [];
      const i = t.slots.findIndex((x) => x.from === t.from && x.to === t.to);
      return t.slots.filter((x, n) => n !== (i < 0 ? 0 : i));
    }

    _editTask(id, asRoutine, src) {
      // src: Kopie einer bestehenden Aufgabe als neue Aufgabe (ohne Erledigt-Stand, Reihenfolge und NFC-Tag)
      const cp = !id && src ? (() => { const x = { ...src, title: src._tpl ? src.title : `${src.title} ${T('(Kopie)')}` }; delete x._tpl; ['id', 'created', 'order', 'nfc', 'done', 'until'].forEach((f) => { delete x[f]; }); return x; })() : null;
      const t0 = (id && this._db.task[id]) || cp;
      const rout = !!(this._cfg.routOn && (asRoutine || (t0 && Array.isArray(t0.steps) && t0.steps.length)));
      const t = t0 || { title: '', emoji: rout ? '📋' : '🦷', points: rout ? 0 : 1, kids: this._kids().map((k) => k.id), days: [], sched: 'week', dates: [], from: '', to: '' };
      // 🌙 „Am Abend vorher“: gespeichert sind die Abende, angezeigt werden die Tage mit Schule bzw. Termin (wie beim 🎽 Sporttage-Dialog)
      const prevShift = t.school && (t.sched || 'week') === 'week' && this._schoolPrev(t) && (t.days || []).length;
      const days = (t.days || []).length ? (prevShift ? t.days.map((x) => (x + 1) % 7) : t.days) : WEEK;
      const dates = (t.dates || []).filter((d) => d >= dk(new Date())).sort();
      const isDates = t.sched === 'dates';
      const isOnce = t.sched === 'once';
      const isCal = t.sched === 'cal', mOn = !!this._cfg.muellOn || !!this._cfg.calOn || isCal;
      const cals = [...new Set([...Object.keys(this._hass.states).filter((e) => e.startsWith('calendar.')).sort(), ...(t.cal ? [t.cal] : [])])];
      const curCal = (t.cal && t.cal !== '_sensors' ? t.cal : '') || this._cfg.muellCal || '';
      if (mOn && curCal) this._calEvents(curCal);
      const routTpl = TEMPLATES.map((x, i) => (ROUT_STEPS[x[2]] ? `<button type="button" class="qp" data-a="qpick" data-rt="1" data-i="${i}">${x[1]}<small>${esc(T(x[2]))}</small></button>` : '')).join('');
      this._modal(rout ? (id ? T('Routine bearbeiten') : T('Neue Routine')) : (id ? T('Aufgabe bearbeiten') : T('Neue Aufgabe')), `
        <div class="g2"><label>${T('Emoji')}<input name="emoji" value="${esc(t.emoji || '')}"></label><label>${rout ? T('Routine') : T('Aufgabe')}<input name="title" value="${esc(t.title)}" placeholder="${esc(rout ? T('z. B. Morgen-Routine') : T('z. B. Zähne putzen'))}"></label></div>
        ${rout ? `${id ? '' : `<div class="lbl">${T('📋 Vorlage')}</div><div class="pick">${routTpl}</div>`}
        <div class="rsbox"><div class="lbl">${T('📋 Routine – Schritte')}</div><input type="hidden" name="steps" value="${esc(JSON.stringify((t.steps || []).map((x) => (x.tid ? { t: x.t, tid: x.tid } : { t: x.t }))))}">
          <div class="rslist"></div>
          <div class="rsadd"><input type="search" class="rsq" maxlength="60" autocomplete="off" enterkeyhint="done" placeholder="${esc(T('🔎 Schritt suchen oder eintippen, z. B. Ko …'))}"></div>
          <div class="rssug"></div>
          <div class="hint">${T('Aufgaben in einer Routine erscheinen nicht mehr einzeln – nur noch als Schritt der Routine. Die Sterne gibt es beim letzten Schritt.')}${this._zOn() ? ` ${T('Eine mit dem 🦷 Zahnputz-Timer verknüpfte Aufgabe startet als Schritt den Timer.')} ${T('Bei anderen Schritten schaltest du den Timer mit 🦷 ein oder aus.')}` : ''}</div></div>` : ''}
        <details class="tpl" ${id || rout ? '' : 'open'} ${rout ? 'hidden' : ''}><summary>${T('📋 Vorlage wählen (setzt Name, Icon, Punkte, Zeit und Tage)')}</summary>
        <input type="search" class="tplq" name="tplq" placeholder="${esc(T('🔎 Vorlage suchen, z. B. Zähne'))}" autocomplete="off">
        <div class="tplbar"><span class="hint tplinfo"></span><label class="tplchk"><input type="checkbox" data-a="tplall"> ${T('alle zeigen')}</label></div>
        ${[...new Set(TEMPLATES.map((x) => x[0]))].map((cat) => `<div class="tplgrp"><div class="tcat">${T(cat)}</div><div class="pick">${TEMPLATES.map((x, i) => (x[0] === cat && !ROUT_STEPS[x[2]] ? `<button type="button" class="qp ${t.emoji === x[1] && (t.title === x[2] || t.title === T(x[2])) ? 'on' : ''}" data-a="qpick" data-i="${i}">${x[1]}<small>${esc(T(x[2]))}</small><em>${x[7] ? T('{from}–{to} J.', { from: x[6], to: x[7] }) : T('ab {from} J.', { from: x[6] })}</em></button>` : '')).join('')}</div></div>`).join('')}
        </details>
        <div class="g2 g2e"><label>${T('Punkte fürs Erledigen')}<input type="number" min="0" name="points" value="${t.points ?? 1}"></label>
        <label class="pen-wrap" style="${isOnce ? 'display:none' : ''}">${T('Minuspunkte, wenn nicht erledigt')}<input type="number" min="0" name="penalty" value="${t.penalty || 0}"></label></div>
        <div class="hint">${T('Minuspunkte werden nie automatisch abgezogen: Eine verpasste Aufgabe erscheint bei dir unter 🔔 Freigaben, und du entscheidest – entschuldigt, Minuspunkte oder doch erledigt.')}</div>
        <div class="lbl">${T('Für wen?')}</div><div class="pick txt">${this._kids().map((k) => `<label><input type="checkbox" name="kid" value="${k.id}" ${(t.kids || []).includes(k.id) ? 'checked' : ''}><span>${esc(k.emoji)} ${esc(k.name)}</span></label>`).join('')}</div>
        <label class="crow"><input type="checkbox" name="rotate" ${t.rotate ? 'checked' : ''}><span>${T('🔄 Im Wechsel')}<small>${T('Bei mehreren Kindern ist pro Termin nur eins dran – der Reihe nach.')}</small></span></label>
        <label class="crow"><input type="checkbox" name="shared" ${t.shared ? 'checked' : ''}><span>${T('🤝 Einer reicht')}<small>${T('Pflicht für alle ausgewählten Kinder – es reicht, wenn eines sie erledigt. Macht sie keiner, gilt sie für alle als verpasst.')}</small></span></label>
        ${this._cfg.extraOn ? `<label class="crow"><input type="checkbox" name="extra" ${t.extra ? 'checked' : ''}><span>${T('🙋 Zusatzaufgabe')}<small>${T('Freiwillig: Wer sie zuerst nimmt, bekommt die Punkte – für die anderen ist sie an dem Tag gesperrt. Keine Minuspunkte, zählt nicht zum Pflichtprogramm.')}</small></span></label>` : ''}
        <label class="crow"><input type="checkbox" name="photo" ${t.photo && this._cfg.photoOn ? 'checked' : ''}><span>${T('📷 Foto-Nachweis')}<small>${T('Beim Abhaken macht das Kind ein Foto – du bekommst es mit der Freigabe-Nachricht.')}${this._approval ? '' : ` ${T('⚠️ Nur mit eingeschalteter Freigabe (Einstellungen → 👍 Freigabe).')}`}</small></span></label>
        ${rout ? '' : `<label class="crow"><input type="checkbox" name="tmrOn" data-a="tmrx" ${Number(t.tmr) > 0 ? 'checked' : ''}><span>${T('⏱️ Timer')}<small>${T('Z. B. „15 Min. lesen“ – das Kind startet einen Countdown mit Musik.')}</small></span></label>
        <div class="sub tmrbox" style="display:${Number(t.tmr) > 0 ? 'block' : 'none'}"><div class="g2 g2e"><label>${T('Dauer (Minuten)')}<input type="number" min="1" max="180" name="tmr" value="${Number(t.tmr) > 0 ? Number(t.tmr) : 15}"></label>
          <label>${T('🎵 Musik')}<select name="tmrMus">${[['std', T('Ruhige Musik')], ['own', T('Eigene MP3s (aus 🦷 Zähne)')], ['off', T('Aus')]].map(([v, l]) => `<option value="${v}" ${(t.tmrMus || 'std') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label></div>
          <label>${T('Am Ende')}<select name="tmrEnd">${[['auto', T('✅ Automatisch abhaken')], ['ok', T('👆 Kind bestätigt')], ['cd', T('⏱️ Nur Countdown (abhaken wie gewohnt)')]].map(([v, l]) => `<option value="${v}" ${(t.tmrEnd || 'auto') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
          <div class="hint">${T('Abbrechen bucht nichts. Freigabe und Foto-Nachweis gelten wie bei allen Aufgaben.')}</div></div>`}
        ${this._peOn() && !rout ? `<div class="g2 g2e"><label>${T('🎮 Spiel als Aufgabe')}<select name="game">${[['', T('– kein Spiel –')], ['math', T('🧮 Rechnen (nach Klasse)')], ['count', T('🔢 Zählen')], ['clock', T('🕐 Uhr lesen')], ['abc', T('🔤 Buchstaben & Wörter')], ['money', T('💰 Geld zählen')], ['vocab', T('🇬🇧 Englisch-Wörter')], ['mul', T('✖️ Einmaleins')], ['memory', T('🧠 Memory')], ['move', T('🏃 Mach\'s nach (Bewegung)')]].filter(([v]) => !v || v === ((t.game || {}).g || '') || !((this._cfg.gs || {})[v] || {}).off).map(([v, l]) => `<option value="${v}" ${((t.game || {}).g || '') === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
          <label>${T('Wie oft? (Rechnen, Zählen, Uhr, Wörter, Geld, Bewegung)')}<input type="number" min="1" max="30" name="gameN" value="${(t.game || {}).n || 5}"></label></div>
          <label>${T('🔁 Wie oft spielbar (pro Tag)')}<select name="gameR">${[1, 2, 3, 4, 5].map((v) => `<option value="${v}" ${(Number((t.game || {}).r) || 1) === v ? 'selected' : ''}>${v === 1 ? T('1× (nur die Aufgabe)') : T('{n}× (danach üben, ohne Sterne)', { n: v })}</option>`).join('')}</select></label>
          <label class="crow"><input type="checkbox" name="gameKid" ${(t.game || {}).n === 0 ? 'checked' : ''}><span>${T('🔢 Anzahl wie beim Kind<small>Jedes Kind bekommt so viele Aufgaben, wie bei ihm im Tab 🐾 Haustier unter ✎ „Fragen pro Runde“ steht – z. B. 7 für die Kleine, 15 für den Großen.</small>')}</span></label>
          <div class="hint">${T('Das Kind spielt mit seinem 🐾 Haustier – ist das Ziel erreicht, wird die Aufgabe abgehakt.')}</div>` : ''}
        ${this._cfg.nfcOn ? `<label>${T('🏷️ NFC-Tag zum Abhaken')}<input name="nfc" value="${esc(t.nfc || '')}" autocomplete="off" placeholder="${esc(T('Tag-ID aus Home Assistant'))}"></label>
        <div class="hint">${T('Einstellungen → Bereiche & Zonen → Tags: Tag anlegen bzw. scannen und die ID hier eintragen. Scannt ein Kind den Tag mit seinem Handy, ist die Aufgabe erledigt.')}</div>` : ''}
        <div class="lbl">${T('Wann?')}</div>
        <div class="seg"><button type="button" class="${isDates || isOnce ? '' : 'on'}" data-a="smode" data-m="week">${T('🔁 Wochentage')}</button><button type="button" class="${isDates ? 'on' : ''}" data-a="smode" data-m="dates">${T('📅 Termine')}</button><button type="button" class="${isOnce ? 'on' : ''}" data-a="smode" data-m="once">${T('⚡ Einmalig')}</button>${mOn ? `<button type="button" class="${isCal ? 'on' : ''}" data-a="smode" data-m="cal">${T('🗓️ Kalender')}</button>` : ''}</div>
        <input type="hidden" name="sched" value="${isCal ? 'cal' : isOnce ? 'once' : isDates ? 'dates' : 'week'}">
        ${mOn ? `<div class="sw-cal" style="display:${isCal ? 'flex' : 'none'}">
          ${this._cfg.muellOn || this._cfg.calOn ? '' : `<div class="hint">${T('⚠️ Der Müllkalender ist in den Einstellungen (✅ Aufgaben & Tagesablauf → 🗑️ Müllkalender) ausgeschaltet – die Aufgabe bleibt gespeichert, erscheint aber erst wieder, wenn er an ist.')}</div>`}
          <label>${T('Kalender')}<select name="cal">${cals.map((e) => `<option value="${e}" ${curCal === e ? 'selected' : ''}>${esc(this._ename(e))}</option>`).join('') || `<option value="">${T('– kein Kalender gefunden –')}</option>`}</select></label>
          <label>${T('Nur Termine mit diesem Stichwort (optional)')}<input name="calKw" value="${esc(t.calKw || '')}" placeholder="${esc(T('z. B. Training, Restmüll, Gelber Sack – leer = alle Termine'))}"></label>
          <label class="crow"><input type="checkbox" name="calPrev" ${t.sched === 'cal' ? (t.calPrev ? 'checked' : '') : 'checked'}><span>${T('🌙 Schon am Vorabend')}<small>${T('Die Aufgabe erscheint einen Tag vor dem Termin – z. B. Sporttasche packen oder Tonne rausstellen.')}</small></span></label>
          <div class="hint calprev">${this._calPreview(curCal)}</div>
        </div>` : ''}
        <div class="sw-once" style="display:${isOnce ? 'flex' : 'none'}">
          <label>${T('Erledigen bis (optional)')}<input type="date" name="until" value="${esc(t.until || '')}" min="${dk(new Date())}"></label>
          <div class="hint">${T('⚡ Sonderaufgabe: Wer sie zuerst erledigt, bekommt die Punkte – danach verschwindet sie für alle.')}</div>
        </div>
        <div class="sw-week" style="display:${isDates || isOnce || isCal ? 'none' : 'flex'}"><div class="pick txt">${WEEK.map((d) => `<label><input type="checkbox" name="day" value="${d}" ${days.includes(d) ? 'checked' : ''}><span>${Y.DAYS[d]}</span></label>`).join('')}</div></div>
        <div class="sw-dates" style="display:${isDates ? 'flex' : 'none'}">
          <div class="addd"><input type="date" name="dnew" min="${dk(new Date())}"><button type="button" class="btn primary" data-a="dadd">${T('＋ Termin')}</button></div>
          <div class="dchips">${dates.map((d) => `<button type="button" class="dchip" data-a="drem" data-d="${d}">${longDate(d)} ✕</button>`).join('')}</div>
          <div class="hint">${T('Z. B. die Abfuhrtermine. Tipp: den Tag eintragen, an dem der Müll raus muss – oft der Abend davor.')}</div>
        </div>
        <div class="lbl">${T('Zeitfenster (optional)')}</div>
        <div class="g2 g2e"><label>${T('von')}<input type="time" name="from" value="${esc(t.from || '')}"></label><label>${T('bis')}<input type="time" name="to" value="${esc(t.to || '')}"></label></div>
        <div class="pick txt"><button type="button" class="btn" data-a="win" data-f="06:45" data-to="10:00">${T('🌅 Morgens')}</button><button type="button" class="btn" data-a="win" data-f="12:00" data-to="18:00">${T('☀️ Mittags')}</button><button type="button" class="btn" data-a="win" data-f="19:00" data-to="23:59">${T('🌙 Abends')}</button><button type="button" class="btn" data-a="win" data-f="" data-to="">${T('Ganzer Tag')}</button></div>
        <div class="hint">${T('Nur in diesem Zeitraum kann das Kind die Aufgabe abhaken. Danach gilt sie als verpasst.')}</div>
        <label class="crow"><input type="checkbox" name="twice" data-a="twice" ${Array.isArray(t.slots) && t.slots.length > 1 ? 'checked' : ''}><span>${T('🔁 Mehrmals am Tag')}<small>${T('Z. B. Hände waschen morgens, mittags und abends – das obige Zeitfenster ist das 1. Mal, darunter bis zu 4 weitere.')}</small></span></label>
        <div class="sw-twice" style="display:${Array.isArray(t.slots) && t.slots.length > 1 ? 'block' : 'none'}"><div data-slots>${this._slotExtra(t).map((x, i) => this._slotRow(i + 2, x.from, x.to)).join('')}</div>
          <button type="button" class="btn sm" data-a="slotadd">${T('＋ Zeitfenster')}</button></div>
        <label class="crow"><input type="checkbox" name="school" data-a="schx" ${t.school || (!id && SCHOOL_RX.test(t.title || '')) ? 'checked' : ''}><span>${T('🎒 Nur an Schultagen')}<small>${this._cfg.hc ? T('Pausiert in den Schulferien, an Feiertagen und am Wochenende.') : T('Pausiert in den Schulferien, an Feiertagen und am Wochenende – dafür in ⚙️ Einstellungen → 🏖️ Urlaub &amp; Ferien Land und Region wählen.')}<br>${T('Schultage = Montag bis Freitag. Hat ein Kind auch samstags Unterricht: unter 👧 Kinder → ✎ „Samstagsschule“ anhaken.')}</small></span></label>
        <div class="sub"><label class="crow"><input type="checkbox" name="schoolPrev" ${(id ? this._schoolPrev(t) : PREV_TPL.some((x) => String(t.title || '').toLowerCase() === T(x).toLowerCase())) ? 'checked' : ''}><span>${T('🌙 Am Abend vorher')}<small>${T('Für Aufgaben wie „Ranzen packen“: Sie kommt, wenn am nächsten Tag Schule ist – also auch sonntags, aber nicht am letzten Tag vor den Ferien.')}</small></span></label><div class="hint">${T('Bei den Wochentagen oben die Tage mit Schule bzw. Termin wählen – die Aufgabe kommt dann jeweils am Abend davor.')}</div></div>
        <label class="crow"><input type="checkbox" name="noschool" data-a="schx" ${t.noschool && !t.school ? 'checked' : ''}><span>${T('🏖️ Nur an schulfreien Tagen<small>Am Wochenende, in den Ferien und an Feiertagen (Ferien und Feiertage brauchen Land und Region unter 🏖️ Urlaub &amp; Ferien).</small>')}</span></label>
        ${this._cfg.freeLate ? `<label class="crow"><input type="checkbox" name="fixTime" ${t.fixTime ? 'checked' : ''}><span>${T('⏰ Feste Zeit auch an schulfreien Tagen<small>Für Aufgaben, die immer pünktlich sein müssen (z. B. Medikament, Haustier füttern): Die lockereren Zeiten an schulfreien Tagen gelten hier nicht.</small>')}</span></label>` : ''}
        <div class="lbl">${T('🌦️ Saison (optional)')}</div>
        <div class="g2 g2e"><label>${T('von Monat')}<select name="sFrom"><option value="">${T('ganzjährig')}</option>${Y.MONTHS.map((m, i) => `<option value="${i + 1}" ${Number(t.sFrom) === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
        <label>${T('bis Monat')}<select name="sTo"><option value="">${T('ganzjährig')}</option>${Y.MONTHS.map((m, i) => `<option value="${i + 1}" ${Number(t.sTo) === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}</select></label></div>
        <div class="hint">${T('Z. B. Rasenmähen April–Oktober. Außerhalb davon ist die Aufgabe automatisch pausiert – jedes Jahr wieder.')}</div>`,
      id, {
        save: (b) => {
          const title = b.querySelector('[name=title]').value.trim();
          if (!title) { this._toast(T('Bitte einen Titel eingeben')); return false; }
          const kids = [...b.querySelectorAll('[name=kid]:checked')].map((x) => x.value);
          if (!kids.length) { this._toast(T('Bitte mindestens ein Kind wählen')); return false; }
          const sched = b.querySelector('[name=sched]').value;
          let dd = [...b.querySelectorAll('[name=day]:checked')].map((x) => Number(x.value));
          const dl = [...b.querySelectorAll('.dchip')].map((x) => x.dataset.d).sort();
          if (sched === 'week' && !dd.length) { this._toast(T('Bitte mindestens einen Tag wählen')); return false; }
          if (sched === 'dates' && !dl.length) { this._toast(T('Bitte mindestens einen Termin eintragen')); return false; }
          const calSel = b.querySelector('[name=cal]');
          if (sched === 'cal' && !(calSel && calSel.value)) { this._toast(T('Bitte einen Kalender wählen')); return false; }
          const calData = sched === 'cal' ? { cal: calSel.value, calKw: b.querySelector('[name=calKw]').value.trim(), calPrev: b.querySelector('[name=calPrev]').checked } : { cal: '', calKw: '', calPrev: false };
          const until = sched === 'once' ? b.querySelector('[name=until]').value : '';
          const curT = (id && this._db.task[id]) || t;
          const keepDone = sched === 'once' && curT.sched === 'once' && curT.done ? { done: curT.done } : {};
          if (dd.length === 7) dd = [];
          // 🌙 „Am Abend vorher“: gewählt sind die Tage mit Schule bzw. Termin – die Aufgabe kommt jeweils am Abend davor
          if (sched === 'week' && dd.length && (b.querySelector('[name=school]') || {}).checked && (b.querySelector('[name=schoolPrev]') || {}).checked) dd = dd.map((x) => (x + 6) % 7);
          const from = b.querySelector('[name=from]').value, to = b.querySelector('[name=to]').value;
          if (from && to && from >= to) { this._toast(T('„von“ muss vor „bis“ liegen')); return false; }
          let slots;
          if ((b.querySelector('[name=twice]') || {}).checked && sched !== 'once') {
            const wins = [{ from, to }, ...[...b.querySelectorAll('.slotrow')].map((r) => ({ from: (r.querySelector('[data-slotfrom]') || {}).value || '', to: (r.querySelector('[data-slotto]') || {}).value || '' }))].slice(0, 5);
            if (wins.some((w) => !w.from || !w.to)) { this._toast(T('Für mehrere Zeitfenster bitte alle Zeiten (von/bis) ausfüllen')); return false; }
            for (let x = 0; x < wins.length; x++) if (wins[x].from >= wins[x].to) { this._toast(T('Zeitfenster {n}: „von“ muss vor „bis“ liegen', { n: x + 1 })); return false; }
            for (let x = 0; x < wins.length; x++) for (let y = x + 1; y < wins.length; y++) if (wins[x].from < wins[y].to && wins[y].from < wins[x].to) { this._toast(T('Die Zeitfenster dürfen sich nicht überschneiden')); return false; }
            if (wins.length > 1) slots = wins.slice().sort((p, q) => p.from.localeCompare(q.from));
          }
          const sF = Number(b.querySelector('[name=sFrom]').value) || 0, sT = Number(b.querySelector('[name=sTo]').value) || 0;
          if ((sF && !sT) || (!sF && sT)) { this._toast(T('Saison: bitte „von“ und „bis“ wählen (oder beide ganzjährig)')); return false; }
          const extra = !!(b.querySelector('[name=extra]') || {}).checked && sched !== 'once';
          const photo = b.querySelector('[name=photo]') ? b.querySelector('[name=photo]').checked : !!t.photo;
          const stEl = b.querySelector('[name=steps]'), nfEl = b.querySelector('[name=nfc]');
          let steps = t.steps || [];
          if (stEl) { try { steps = this._stepsParse(stEl.value, id); } catch (e) { steps = []; } }
          if (rout && !steps.length) { this._toast(T('Bitte mindestens einen Schritt hinzufügen')); return false; }
          const nfc = nfEl ? String(nfEl.value).trim().slice(0, 80) : (t.nfc || '');
          if (nfc && !/^[\w:.-]+$/.test(nfc)) { this._toast(T('NFC-Tag: nur Buchstaben, Ziffern, - _ : .')); return false; }
          if (photo && !this._cfg.photoOn) this._setCfg({ photoOn: true });
          const penalty = sched === 'once' || extra ? 0 : Math.max(0, Number(b.querySelector('[name=penalty]').value) || 0);
          // Geänderte Zuordnung (Kinder, Tage, Wechsel …) gilt erst ab heute – keine Minuspunkte rückwirkend
          const shared = !!(b.querySelector('[name=shared]') || {}).checked && sched !== 'once' && kids.length > 1 && !(b.querySelector('[name=extra]') || {}).checked;
          const sig = (o) => JSON.stringify([[...(o.kids || [])].sort(), o.sched, o.days || [], o.rotate || false, !!o.shared, o.cal || '', o.calKw || '', !!o.calPrev, o.from || '', o.to || '']);
          const changedPlan = id && sig(t) !== sig({ shared, kids, sched, days: sched === 'week' ? (dd.length === 7 ? [] : dd) : [], rotate: !!(b.querySelector('[name=rotate]') || {}).checked && kids.length > 1 && sched !== 'once', cal: (b.querySelector('[name=cal]') || {}).value || '', calKw: ((b.querySelector('[name=calKw]') || {}).value || '').trim(), calPrev: !!(b.querySelector('[name=calPrev]') || {}).checked, from, to });
          const penaltySince = penalty ? (Number(t.penalty) && t.penaltySince && !changedPlan ? t.penaltySince : dk(new Date())) : '';
          if (penalty && !Number(t.penalty)) this._toast(T('Verpasste Aufgaben werden ab morgen zur Bestätigung angezeigt'));
          // ⏱️ Timer
          const tmrOn = !!(b.querySelector('[name=tmrOn]') || {}).checked;
          const gmSel = b.querySelector('[name=game]'), gmO = gmSel ? (gmSel.value ? { game: { g: gmSel.value, n: (b.querySelector('[name=gameKid]') || {}).checked ? 0 : Math.max(1, Math.min(30, Math.round(Number(b.querySelector('[name=gameN]').value) || 5))), ...((rv) => (rv > 1 ? { r: rv } : {}))(Math.min(5, Math.round(Number((b.querySelector('[name=gameR]') || {}).value) || 1))) } } : { game: null }) : (t.game ? { game: t.game } : {});
          const tmrO = tmrOn ? { tmr: Math.min(180, Math.max(1, Math.round(Number(b.querySelector('[name=tmr]').value) || 15))), tmrEnd: b.querySelector('[name=tmrEnd]').value, tmrMus: b.querySelector('[name=tmrMus]').value } : {};
          const tidN = id || uid();
          if (!id && String(title).toLowerCase() === T('Turnbeutel packen').toLowerCase()) setTimeout(() => this._sportAsk(tidN), 400);
          this._save('task', tidN, { title, emoji: b.querySelector('[name=emoji]').value.trim() || '⭐', points: Math.max(0, Number(b.querySelector('[name=points]').value) || 0), penalty, penaltySince, kids, sched, days: sched === 'week' ? dd : [], dates: sched === 'dates' ? [...new Set([...(t.sched === 'dates' ? (t.dates || []).filter((d) => d < dk(new Date())) : []), ...dl])].sort() : [], from, to, until, created: t.created || dk(new Date()), rotate: !!(b.querySelector('[name=rotate]') || {}).checked && kids.length > 1 && sched !== 'once' && !extra && !shared, shared, extra: b.querySelector('[name=extra]') ? extra : !!t.extra, photo, ...calData, slots: slots || [], school: !!(b.querySelector('[name=school]') || {}).checked && sched !== 'once', noschool: !!(b.querySelector('[name=noschool]') || {}).checked && !(b.querySelector('[name=school]') || {}).checked && sched !== 'once', fixTime: b.querySelector('[name=fixTime]') ? b.querySelector('[name=fixTime]').checked : !!t.fixTime, schoolPrev: !!(b.querySelector('[name=school]') || {}).checked && !!(b.querySelector('[name=schoolPrev]') || {}).checked && sched !== 'once', sFrom: sF || '', sTo: sT || '', ...(t.order ? { order: t.order } : {}), ...(steps.length ? { steps } : {}), ...(nfc ? { nfc } : {}), ...tmrO, ...gmO, ...keepDone });
          return true;
        },
        del: () => { this._delUndo('task', id); return true; },
        copy: id ? () => { const o = this._db.task[id]; this._closeModal(); if (o) { this._editTask(null, false, o); this._toast(T('⧉ Kopie – anpassen und speichern')); } } : null,
      });
      this._filterTpl(this.shadowRoot.querySelector('#modal .mbox'));
      this._routUi(this.shadowRoot.querySelector('#modal .mbox'), id, !id);
    }

    // 📋 Routine-Schritte: aus dem gespeicherten JSON (versteckt) lesen, Aufgaben-Verknüpfungen prüfen
    _stepsParse(v, selfId) {
      const a = JSON.parse(String(v || '[]'));
      const map = this._routMap();
      return (Array.isArray(a) ? a : []).filter((x) => x && x.t).slice(0, 12).map((x) => {
        const st = { t: String(x.t).trim().slice(0, 60), ...(typeof x.z === 'boolean' ? { z: x.z } : {}) };
        const tt = x.tid && this._db.task[x.tid];
        if (tt && /^[\w-]+$/.test(x.tid) && x.tid !== selfId && !tt.virtual && tt.sched !== 'once' && !(Array.isArray(tt.steps) && tt.steps.length) && (!map[x.tid] || map[x.tid] === selfId)) st.tid = x.tid;
        return st;
      }).filter((x) => x.t);
    }

    // Schritt-Editor: Liste mit ▲▼✕ und Suchfeld mit Vorschlägen (eigene Aufgaben + Vorlagen, ab dem 1. Buchstaben)
    _routUi(box, selfId, isNew) {
      const hid = box && box.querySelector('input[name=steps]');
      if (!hid) return;
      const list = box.querySelector('.rslist'), q = box.querySelector('.rsq'), sug = box.querySelector('.rssug'), ptsEl = box.querySelector('[name=points]');
      let ptsManual = !isNew;
      if (ptsEl) ptsEl.addEventListener('input', () => { ptsManual = true; });
      const map = this._routMap();
      const own = this._taskOrder().filter((x) => x.id !== selfId && x.sched !== 'once' && !(Array.isArray(x.steps) && x.steps.length) && !(Array.isArray(x.slots) && x.slots.length > 1) && (!map[x.id] || map[x.id] === selfId))
        .map((x) => ({ t: `${x.emoji || ''} ${x.title}`.trim().slice(0, 60), tid: x.id, pts: Number(x.points) || 0, own: true }));
      const tpl = TEMPLATES.filter((x) => !ROUT_STEPS[x[2]]).map((x) => ({ t: `${x[1]} ${T(x[2])}`.trim().slice(0, 60), pts: Number(x[3]) || 0, own: false }));
      const get = () => { try { const a = JSON.parse(hid.value || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
      const set = (a) => {
        hid.value = JSON.stringify(a.slice(0, 12));
        if (!ptsManual && ptsEl) ptsEl.value = a.reduce((n, x) => n + ((own.find((o) => o.tid && o.tid === x.tid) || tpl.find((o) => o.t === x.t) || {}).pts || 0), 0) || 1;
        draw(); suggest();
      };
      const draw = () => {
        const a = get();
        list.innerHTML = a.length ? a.map((x, i) => `<div class="rsrow"><span class="rsn">${i + 1}.</span><span class="grow">${esc(x.t)}${x.tid ? ` <small class="hint">${T('✅ eigene Aufgabe')}</small>` : ''}</span>
          ${this._zOn() && !x.tid ? ((on) => `<button type="button" class="icon sm ${on ? 'rsz1' : 'rsz0'}" data-rs="z" data-i="${i}" aria-pressed="${on}" title="${esc(T('🦷 Schritt mit Zahnputz-Timer'))}">🦷</button>`)(this._zStepOn(x)) : ''}<button type="button" class="icon sm" data-rs="up" data-i="${i}" ${i ? '' : 'disabled'} title="${esc(T('Nach oben'))}">▲</button><button type="button" class="icon sm" data-rs="down" data-i="${i}" ${i < a.length - 1 ? '' : 'disabled'} title="${esc(T('Nach unten'))}">▼</button><button type="button" class="icon sm" data-rs="del" data-i="${i}" title="${esc(T('Löschen'))}">✕</button></div>`).join('')
          : `<div class="hint">${T('Noch keine Schritte.')}</div>`;
        q.disabled = a.length >= 12;
      };
      const words = (x) => hbNorm(x).replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean);
      const suggest = () => {
        const w = words(q.value), a = get();
        const used = new Set(a.map((x) => x.tid || hbNorm(x.t)));
        const pool = [...own, ...tpl].filter((x) => !used.has(x.tid || hbNorm(x.t)));
        let hits;
        if (!w.length) hits = document.activeElement === q || (this.shadowRoot && this.shadowRoot.activeElement === q) ? own.filter((x) => !used.has(x.tid)).slice(0, 6).map((x) => [0, x]) : [];
        else {
          hits = pool.map((x) => {
            const ws = words(x.t), full = ws.join(' ');
            if (!w.every((qw) => ws.some((y) => y.startsWith(qw)) || full.includes(qw))) return null;
            const score = (full.startsWith(w.join(' ')) || ws.some((y) => y.startsWith(w[0])) ? 0 : 1) * 2 + (x.own ? 0 : 1);
            return [score, x];
          }).filter(Boolean).sort((m, n) => m[0] - n[0]).slice(0, 8);
        }
        const free = q.value.trim();
        sug.innerHTML = hits.map(([, x], i) => `<button type="button" class="rssg" data-i="${i}">${esc(x.t)}<small>${x.own ? T('✅ eigene Aufgabe') : T('📋 Vorlage')}</small></button>`).join('')
          + (free ? `<button type="button" class="rssg free" data-free="1">${esc(T('＋ „{t}“ als eigenen Schritt', { t: free.slice(0, 60) }))}</button>` : '');
        sug._hits = hits.map((h) => h[1]);
      };
      const add = (x) => { const a = get(); if (a.length >= 12) { this._toast(T('📋 Höchstens 12 Schritte')); return; } a.push(x.tid ? { t: x.t, tid: x.tid } : { t: String(x.t).trim().slice(0, 60) }); q.value = ''; set(a); };
      list.addEventListener('click', (e) => {
        const b = e.target.closest('[data-rs]');
        if (!b) return;
        e.stopPropagation();
        const a = get(), i = Number(b.dataset.i), j = b.dataset.rs === 'up' ? i - 1 : i + 1;
        if (b.dataset.rs === 'del') a.splice(i, 1);
        else if (b.dataset.rs === 'z') { if (a[i] && !a[i].tid) a[i] = { ...a[i], z: !this._zStepOn(a[i]) }; }
        else if (j >= 0 && j < a.length) [a[i], a[j]] = [a[j], a[i]];
        set(a);
      });
      sug.addEventListener('mousedown', (e) => e.preventDefault()); // Fokus im Suchfeld behalten
      sug.addEventListener('click', (e) => {
        const b = e.target.closest('.rssg');
        if (!b) return;
        e.stopPropagation();
        if (b.dataset.free) { if (q.value.trim()) add({ t: q.value }); } else { const x = (sug._hits || [])[Number(b.dataset.i)]; if (x) add(x); }
        q.focus();
      });
      q.addEventListener('input', suggest);
      q.addEventListener('focus', suggest);
      q.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const x = (sug._hits || [])[0];
        if (x && words(q.value).length) add(x); else if (q.value.trim()) add({ t: q.value });
      });
      hid._rsSet = (a) => { ptsManual = false; set(a); };
      draw();
    }

    // gemeinsame Belohnung: ohne Zusatzfunktion bleiben vorhandene Werte erhalten; alle Kinder angehakt = leer (neue Kinder automatisch dabei)
    _shareSave(b, r) {
      const box = b.querySelector('[name=share]');
      if (!box) return r.share ? { share: true, ...(r.shareKids ? { shareKids: r.shareKids } : {}) } : {};
      if (!box.checked) return {};
      const all = this._kids().map((k) => k.id), sel = [...b.querySelectorAll('[name=shk]:checked')].map((x) => x.value);
      return { share: true, ...(sel.length && sel.length < all.length ? { shareKids: sel } : {}) };
    }

    _editReward(id, src) {
      if (this._scNeed(() => this._editReward(id, src))) return;
      const r = id ? this._db.reward[id] : src ? { ...src, id: undefined, title: `${src.title} ${T('(Kopie)')}` } : { title: '', emoji: '🍦', cost: 20 };
      this._modal(id ? T('Belohnung bearbeiten') : T('Neue Belohnung'), `
        <div class="g2"><label>${T('Emoji')}<input name="emoji" value="${esc(r.emoji || '')}"></label><label>${T('Belohnung')}<input name="title" value="${esc(r.title)}" placeholder="${esc(T('z. B. Eisgutschein'))}"></label></div>
        <div class="g2 g2e"><label>${T('Kosten in Punkten')}<input type="number" min="1" name="cost" value="${r.cost || 10}"></label>
        <label>${T('Höchstens … × pro Woche')}<input type="number" min="0" name="limit" value="${r.limit || 0}"></label></div>
        <div class="hint">${T('Pro Kind und Woche (Mo–So). 0 = unbegrenzt.')}</div>
        ${this._kids().length > 1 ? `<div class="sw-rkid" style="display:${this._cfg.shareOn && r.share ? 'none' : 'block'}"><div class="lbl">${T('Für welche Kinder?')}</div><div class="pick txt">${this._kids().map((k) => `<label><input type="checkbox" name="rkid" value="${k.id}" ${!(r.kids || []).length || (r.kids || []).includes(k.id) ? 'checked' : ''}><span>${esc(k.emoji || '')} ${esc(k.name)}</span></label>`).join('')}</div></div>` : ''}
        ${this._costKidHtml(r)}
        ${this._cfg.shareOn ? `${this._chk('', !!r.share, T('👫 Gemeinsame Belohnung<small>Der Preis wird auf die Kinder aufgeteilt – jedes zahlt seinen Anteil selbst. Ein Kind kann die anderen auch einladen und alles bezahlen.</small>')).replace('data-a="cfg" data-k=""', 'name="share"')}
          <div class="lbl">${T('Für welche Kinder?')}</div><div class="pick txt">${this._kids().map((k) => `<label><input type="checkbox" name="shk" value="${k.id}" ${!(r.shareKids || []).length || (r.shareKids || []).includes(k.id) ? 'checked' : ''}><span>${esc(k.emoji || '')} ${esc(k.name)}</span></label>`).join('')}</div>` : ''}
        <details class="tpl" ${id ? '' : 'open'}><summary>${T('🎁 Vorlage wählen (setzt Name, Emoji und Punkte)')}</summary>
          <div class="pick" style="margin-top:8px">${REWARD_TEMPLATES.map((x, i) => (x[3] === 'joker' && !this._cfg.jokerOn ? '' : `<button type="button" class="qp ${r.title === x[1] || r.title === T(x[1]) ? 'on' : ''}" data-a="rpick" data-i="${i}">${x[0]}<small>${esc(T(x[1]))}<br><b>${x[2]} ⭐</b></small></button>`)).join('')}</div>
        </details>
        ${this._cfg.jokerOn || r.joker ? this._chk('', !!r.joker, T('🃏 Ist ein Joker<small>Beim Einlösen bekommt das Kind einen Joker und kann damit eine Pflicht-Aufgabe auslassen.</small>')).replace('data-a="cfg" data-k=""', 'name="joker"') : ''}
        ${this._scOn() ? this._scRewardHtml(r) : ''}
        ${this._peOn() && (this._cfg.peHome || r.tl) ? `<label>${T('🪙 Taler fürs Haustier-Zuhause')}<input type="number" min="0" max="500" name="tl" value="${r.tl || ''}" placeholder="0"></label>
        <div class="hint">${T('Das Kind tauscht echte ⭐ gegen Taler – damit kauft es Sachen fürs Zuhause, wenn die Taler aus den Spielen nicht reichen.')}${this._cfg.shareOn ? ` ${T('Taler-Belohnungen werden immer einzeln eingelöst, nicht gemeinsam.')}` : ''}</div>` : ''}
        ${this._peOn() && this._cfg.peGames !== false ? `<label>${T('🎟️ Freispiele (Haustier-Spiele)')}<input type="number" min="0" max="50" name="gm" value="${r.gm || ''}" placeholder="0"></label>
        <div class="hint">${this._fsUseful() ? T('Das Kind bekommt so viele Freispiele gutgeschrieben. Einlösbar erst, wenn die Spiele heute freigeschaltet sind; Freispiele zählen, sobald das Tageslimit erreicht ist, gelten auch für Abenteuer-Level und verfallen nie.') : T('⚠️ „Spiele pro Tag“ und „Abenteuer-Level pro Tag“ stehen auf unbegrenzt – Freispiele hätten keinen Wert, deshalb sehen die Kinder diese Belohnung nicht.')}</div>` : ''}
        ${this._mnOn() && (this._cfg.mnRw || r.mny) ? `<div class="g2 g2e"><label>${T('💰 Geldbetrag')}<input name="mny" inputmode="decimal" value="${r.mny ? esc(String(Math.abs(r.mny) / 100).replace('.', Y.LANG === 'en' ? '.' : ',')) : ''}" placeholder="${esc(this._mnFmt(500))}"></label>
          <label>${T('Geld')}<select name="mnyd"><option value="in" ${(r.mny || 0) >= 0 ? 'selected' : ''}>${T('💶 kommt in die Spardose')}</option><option value="out" ${(r.mny || 0) < 0 ? 'selected' : ''}>${T('💸 wird vom Taschengeld bezahlt')}</option></select></label></div>
          <div class="hint">${T('Optional. Beim Einlösen wird der Betrag in der 💰 Spardose gebucht – z. B. 50 ⭐ = 5 € extra oder Kino: Sterne plus 5 € vom Taschengeld.')}</div>` : ''}
        ${this._advOn() || r.adv ? this._chk('', !!r.adv, T('🎄 Nur im Adventskalender<small>Die Kinder sehen diese Belohnung nicht in ihrer Liste – sie wird nur von einem Türchen geschenkt.</small>')).replace('data-a="cfg" data-k=""', 'name="advr"') : ''}
`,
      id, {
        save: (b) => {
          const title = b.querySelector('[name=title]').value.trim();
          if (!title) { this._toast(T('Bitte einen Namen eingeben')); return false; }
          const cost = Math.max(1, Math.round(Number(b.querySelector('[name=cost]').value) || 1));
          const allK = this._kids().map((k) => k.id), rk = b.querySelector('[name=rkid]') ? [...b.querySelectorAll('[name=rkid]:checked')].map((x) => x.value) : (r.kids || []);
          if (b.querySelector('[name=rkid]') && !rk.length && !((b.querySelector('[name=share]') || {}).checked)) { this._toast(T('Bitte mindestens ein Kind wählen')); return false; }
          // Preise je Kind: nur abweichende Werte speichern; ohne Zusatzfunktion bleiben vorhandene Preise unverändert erhalten
          let costs = r.costs || {};
          if (b.querySelector('[data-kcost]')) {
            costs = {};
            b.querySelectorAll('[data-kcost]').forEach((x) => { const v = Math.round(Number(x.value) || 0); if (v > 0 && v !== cost) costs[x.dataset.kcost] = v; });
          }
          this._save('reward', id || uid(), { title, emoji: b.querySelector('[name=emoji]').value.trim() || '🎁', cost, ...(Object.keys(costs).length ? { costs } : {}), limit: Math.max(0, Math.round(Number(b.querySelector('[name=limit]').value) || 0)), joker: !!(b.querySelector('[name=joker]') || {}).checked, ...((b.querySelector('[name=advr]') || {}).checked ? { adv: true } : {}), ...((mnI) => { if (!mnI) return r.mny ? { mny: r.mny } : {}; const v = this._mnParse(mnI.value); return Number.isFinite(v) && v > 0 ? { mny: (b.querySelector('[name=mnyd]') || {}).value === 'out' ? -v : v } : {}; })(b.querySelector('[name=mny]')), ...(rk.length && rk.length < allK.length ? { kids: rk } : {}), ...(this._scOn() ? ((sc) => (sc ? { sc } : {}))(this._scRewardRead(b)) : (r.sc ? { sc: r.sc } : {})), ...this._shareSave(b, r), ...((gi) => { if (!gi) return r.gm ? { gm: r.gm } : {}; const v = Math.max(0, Math.min(50, Math.round(Number(gi.value) || 0))); return v ? { gm: v } : {}; })(b.querySelector('[name=gm]')), ...((ti) => { if (!ti) return r.tl ? { tl: r.tl } : {}; const v = Math.max(0, Math.min(500, Math.round(Number(ti.value) || 0))); return v ? { tl: v } : {}; })(b.querySelector('[name=tl]')) });
          return true;
        },
        del: () => { this._delUndo('reward', id); return true; },
        copy: id ? () => { const o = this._db.reward[id]; this._closeModal(); if (o) { this._editReward(null, o); this._toast(T('⧉ Kopie – anpassen und speichern')); } } : null,
      });
    }

    // Belohnung: eigener Preis je Kind (Zusatzfunktion) – mit Ø-Sternen pro Tag als Orientierung
    _costKidHtml(r) {
      const kids = this._kids();
      if (!this._cfg.costKidOn || kids.length < 2) return '';
      const base = Number(r.cost) || 10;
      return `<div class="lbl">${T('👧 Preis je Kind')}</div>
        <div class="hint">${T('Leer = Standardpreis. „Ø/Tag“ = Sterne, die das Kind an einem normalen Tag mit seinen Pflicht-Aufgaben verdienen kann.')}</div>
        ${kids.map((k) => { const dp = this._dailyPts(k.id), own = r.costs && Number(r.costs[k.id]) > 0 ? Number(r.costs[k.id]) : ''; return `<div class="g2 g2e"><label>${esc(k.emoji || '')} ${esc(k.name)}<input type="number" min="1" data-kcost="${esc(k.id)}" data-daily="${dp}" value="${own}" placeholder="${base}"></label>
          <div class="hint kcd" data-kcd="${esc(k.id)}">${dp ? T('Ø {n} ⭐/Tag', { n: String(dp).replace('.', Y.LANG === 'en' ? '.' : ',') }) : T('noch keine Pflicht-Aufgaben')}</div></div>`; }).join('')}
        <div class="btnrow"><button type="button" class="btn sm" data-a="cfair">${T('⚖️ Fair verteilen')}</button></div>
        <div class="hint">${T('Fair verteilen: Jedes Kind braucht etwa gleich viele Tage – wer am Tag mehr Sterne sammeln kann, zahlt mehr. Der Standardpreis gilt für das Kind mit den meisten Sternen pro Tag.')}</div>`;
    }

    // Löschen mit „↩️ Rückgängig“: holt den Eintrag aus dem Papierkorb zurück (bzw. aus der Kopie, wenn der Papierkorb aus ist)
    _delUndo(type, id) {
      const old = this._db[type][id];
      if (!old) return;
      const copy = { ...old }; delete copy.id;
      const name = old.name || old.title || '';
      this._del(type, id);
      this._toast(T('🗑️ Gelöscht: {x}', { x: name }), { label: T('↩️ Rückgängig'), fn: () => {
        const tid = `${type}-${id}`;
        if (this._db.trash[tid]) { this._trashRestore(tid); return; }
        if (this._db[type][id]) return;
        this._save(type, id, copy);
        this._audit(T('♻️ Aus dem Papierkorb zurückgeholt: {x}', { x: name || id }));
        this._toast(T('♻️ Zurückgeholt'));
        this._render();
      } });
    }


    // ---------- aus der Karte ausgelagert: Eltern-Aktionen (Klicks) ----------
    _clickAdm(a, ds, el, e) {
      switch (a) {
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
        case 'rws': this._setCfg({ rwSort: ['az', 'kid'].includes(ds.m) ? ds.m : 'stars' }); this._render(); break;
        case 'kadm': {
          // 👧 Kinder-Tab: Kind auf-/zuklappen (gemerkt pro Gerät)
          const c = this._kadmShut(); if (c.has(ds.k)) c.delete(ds.k); else c.add(ds.k);
          try { localStorage.setItem('kpKadm', JSON.stringify([...c])); } catch (e2) { /* egal */ }
          this._render(); break;
        }
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
        case 'cfgset': if (['kView'].includes(ds.k) && ['compact', 'classic'].includes(ds.v)) this._setCfg({ [ds.k]: ds.v }); break;
        case 'admday': {
          const v = Number(ds.v) || 0, base = this._admDayKey() || dk(new Date()), d = new Date(`${base}T12:00:00`);
          if (!v) this._admDay = ''; else { d.setDate(d.getDate() + v); this._admDay = dk(d) >= dk(new Date()) ? '' : dk(d); }
          this._render(); break;
        }
        case 'atap': {
          const t = this._db.task[ds.t];
          if (!t) break;
          if (ds.d && ds.d < dk(new Date())) { // ◀ Vortag nachtragen
            const s0 = this._st(ds.d, ds.t, ds.k);
            if (s0 === 'm') this._decide(ds.d, ds.t, ds.k, 'd', e);
            else this._adminSet(ds.d, ds.t, ds.k, s0 !== 'd', e);
            break;
          }
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
          if (ds.k === 'target' || ds.k === 'rPlayer' || ds.k === 'tg' || ds.k === 'rtPl') {
            const field = ds.k === 'target' ? 'targets' : ds.k === 'tg' ? 'tgTargets' : ds.k === 'rtPl' ? 'rtPl' : 'rPlayers';
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
        case 'wkrtest': { this._fnCall('_fnWeekCheck', [true], false); this._toast(T('📊 Wochenbericht gesendet')); break; }
        case 'rttest': { this._fnCall('_fnRtTest', [], false); break; }
        case 'ntest': {
          const n = this._notify(T('👋 Test: Benachrichtigungen der Yippee!-Karte funktionieren.'), 'test');
          this._toast(n ? (n > 1 ? T('📨 Test an {n} Geräte gesendet', { n }) : T('📨 Test an 1 Gerät gesendet')) : T('Kein Gerät ausgewählt'));
          break;
        }
        case 'rej': this._adminSet(ds.d, ds.t, ds.k, false); break;
        case 'rapr': { const q = this._db.req[ds.q]; if (q) this._redeem(q.kid, q.reward, q.id); break; }
        case 'rrej': if ((this._db.req[ds.q] || {}).pool) { this._shareCancel(ds.q); break; } this._audReq(ds.q, false); this._del('req', ds.q); this._render(); break;
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
        case 'suggest': this._suggest(ds.k); break;
        case 'sgall': case 'sgnone': { const box = el.closest('.mbox'); if (box) box.querySelectorAll('[name=sg]').forEach((c) => { c.checked = a === 'sgall'; }); break; }
        case 'wtest': {
          const n = this._sendWeekly();
          this._toast(n ? (n > 1 ? T('📊 Wochenrückblick an {n} Geräte gesendet', { n }) : T('📊 Wochenrückblick an 1 Gerät gesendet')) : T('Kein Gerät oder keine Kinder'));
          break;
        }
        case 'copyauto': { const pre = el.parentNode.querySelector('pre'); this._copy(pre ? pre.textContent : '', T('📋 Automation kopiert')); break; }
        case 'famedit': this._editFamily(); break;
        case 'famfix': this._famFix(Number(ds.v) || 0); break;
        case 'famreset': this._famNext(true); break;
        case 'famnext': this._famNext(false); break;
        case 'famqadd': case 'famqdel': case 'famqup': this._famQAct(a, el, ds); break;
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
        case 'new20ok': try { localStorage.setItem('yippee_new20', '1'); } catch (err) { /* egal */ } this._render(); break;
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
        case 'setview': this._setG = null; this._setCfg({ setView: ds.v === 'simple' ? 'simple' : 'all' }); this._render(); break;
        case 'setg': {
          this._setG = ds.g === '' || ds.g === undefined ? null : Number(ds.g); this._accOpen = '';
          const q = this.shadowRoot.querySelector('.setq'); if (q && q.value) { q.value = ''; this._setQ = ''; }
          this._render();
          const top = this.shadowRoot.querySelector('.segsw'); if (top && top.scrollIntoView) top.scrollIntoView({ block: 'start', behavior: 'smooth' });
          break;
        }
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
        case 'dtest': { const n = this._sendDaily(); this._toast(n ? (n > 1 ? T('🌙 Tagesabschluss an {n} Geräte gesendet', { n }) : T('🌙 Tagesabschluss an 1 Gerät gesendet')) : T('Kein Gerät oder keine Kinder')); break; }
        case 'mtest': { const txt = this._morningText() || T('Guten Morgen! Heute stehen keine Aufgaben an.'); const n = this._speak(txt); this._toast(n ? T('🔊 Morgen-Ansage gesendet') : T('Bitte unten bei „Erinnerung per Lautsprecher“ einen Lautsprecher wählen')); break; }
        case 'ekid': this._editKid(ds.id); break;
        case 'etask': this._editTask(ds.id); break;
        case 'erout': this._editTask(null, true); break;
        case 'erew': this._editReward(ds.id); break;
        case 'slotdel': { const r = el.closest('.slotrow'); if (r) r.remove(); break; }
        case 'slotadd': {
          const wrap = el.closest('.mbox') && el.closest('.mbox').querySelector('[data-slots]');
          if (wrap && wrap.querySelectorAll('.slotrow').length < 4) wrap.insertAdjacentHTML('beforeend', this._slotRow(wrap.querySelectorAll('.slotrow').length + 2));
          else this._toast(T('Höchstens 5 Zeitfenster'));
          break;
        }
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
        case 'mcopy': { const h = this._mh && this._mh.copy; if (h) h(); break; }
        default: break;
      }
    }

    // ---------- aus der Karte ausgelagert: nur in der Eltern-Ansicht gebraucht ----------
    // 📋 Eltern-Heute: Kinder und Tagesblöcke einklappbar – gemerkt auf diesem Gerät
    _admFolded(key) {
      if (!this._admF) { try { this._admF = JSON.parse(localStorage.getItem('kpAdmFold') || '{}') || {}; } catch (e) { this._admF = {}; } }
      return !!this._admF[key];
    }




    // 🗂️ Aufgaben-Tab: immer je Kind gruppiert, darunter wahlweise nach Tageszeit, Art oder ohne Unterteilung

    _adminSet(date, tid, kidId, done, e) {
      const t = this._db.task[tid];
      if (!t) return;
      if (done && this._st(date, tid, kidId) !== 'd') { this._markDone(date, tid, kidId, e); this._audTask('ok', tid, kidId); }
      else if (!done) { this._markUndone(date, tid, kidId); this._audTask('no', tid, kidId); }
      this._photoDone(date, tid, kidId);
      this._render();
    }

    // Sicherung einspielen (Datei, eingefügter Text oder automatische Sicherung)
    _applyBackup(j) {
      const today = dk(new Date()), curTomb = { ...(this._cfg.tomb || {}) }, dels = {}, back = new Set();
      this._noTomb = true;
      try {
        ['kid', 'task', 'reward', 'log', 'req', 'cfg', 'adc', 'adk', 'zc', 'zk', 'mb', 'mk', 'pk', 'po', 'fk', 'rb'].forEach((ty) => {
          if (['adc', 'adk', 'zc', 'zk', 'mb', 'mk', 'pk', 'po', 'fk', 'rb'].includes(ty) && !j.data[ty]) return; // ältere Sicherung ohne Adventskalender/Zahnputz-Timer/Taschengeld/Haustier: vorhandene Daten behalten
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

    _bkName() { return `YippeeKidsChores${dk(new Date()).split('-').reverse().join('')}.json`; }

    _blkRank(t) { return ['m', 'mi', 'na', 'a', 'day'].indexOf(this._blk(t)); }

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

    _dailyText() { return this._dailyMsgs(false).map((m) => m[1]).join('\n'); }


    _editFamily() {
      const f = this._cfg.fam || { title: '', emoji: '🎢', cost: 300, pts: 0 };
      this._famQ = [...((this._cfg.fam || {}).q || [])];
      const big = REWARD_TEMPLATES.filter((x) => x[2] >= 40);
      this._modal(T('👨‍👩‍👧 Familienziel'), `<div class="hint">${T('Jeder Stern, den ein Kind verdient, zählt zusätzlich fürs Familienziel. Die eigenen Punkte der Kinder bleiben erhalten.')}</div>
        <div class="g2"><label>${T('Emoji')}<input name="emoji" value="${esc(f.emoji || '')}"></label><label>${T('Ziel')}<input name="title" value="${esc(f.title)}" placeholder="${esc(T('z. B. Freizeitpark'))}"></label></div>
        <div class="g2 g2e"><label>${T('Benötigte Sterne (alle zusammen)')}<input type="number" min="10" name="cost" value="${f.cost || 300}"></label>
        <label>${T('Bereits gesammelt')}<input type="number" min="0" name="fpts" value="${f.pts || 0}"></label></div>
        <div class="hint">${T('„Bereits gesammelt“ kannst du von Hand korrigieren, z. B. nach Test-Eingaben.')}</div>
        <div class="lbl">${T('📋 Danach (Warteschlange)')}</div><div class="hint">${T('Ist das Ziel erreicht und eingelöst, geht es automatisch mit dem nächsten weiter. Sterne, die in der Zwischenzeit verdient werden, zählen schon dafür.')}</div>
        <div class="famql">${this._famQHtml()}</div>
        <div class="g2 famqf"><label>${T('Emoji')}<input name="qemoji" value="🎯"></label><label>${T('Nächstes Ziel')}<input name="qtitle" placeholder="${esc(T('z. B. Kino'))}"></label></div>
        <label>${T('Benötigte Sterne (alle zusammen)')}<input type="number" min="10" name="qcost" value="200"></label>
        <div class="btnrow"><button type="button" class="btn" data-a="famqadd">${T('＋ In die Warteschlange')}</button></div>
        <div class="lbl">${T('Vorschläge')}</div>
        <div class="pick">${big.map((x) => `<button type="button" class="qp" data-a="fpick" data-e="${x[0]}" data-t="${esc(T(x[1]))}" data-c="${x[2] * 3}">${x[0]}<small>${esc(T(x[1]))}<br><b>${x[2] * 3} ⭐</b></small></button>`).join('')}</div>`,
      !!(this._cfg.fam && this._cfg.fam.cost), {
        save: (b) => {
          const title = b.querySelector('[name=title]').value.trim();
          if (!title) { this._toast(T('Bitte ein Ziel eingeben')); return false; }
          const cost = Math.max(10, Number(b.querySelector('[name=cost]').value) || 10);
          const pIn = Math.max(0, Math.round(Number(b.querySelector('[name=fpts]').value) || 0)), pChanged = pIn !== (f.pts || 0);
          const emoji = b.querySelector('[name=emoji]').value.trim() || '👨‍👩‍👧';
          const mk = (g) => {
            const old = (g && g.pts) || 0, pts = pChanged ? pIn : old;
            const log = [...((g && g.log) || []), ...(pChanged && pts !== old && g ? [{ t: Date.now(), a: old, b: pts }] : [])].slice(-10);
            const q = (this._famQ || []).slice(0, 10), done = (g && g.done) || [];
            return { title, emoji, cost, pts, reached: pts >= cost, ...(log.length ? { log } : {}), ...(q.length ? { q } : {}), ...(done.length ? { done } : {}), ...(g && g.nx && pts >= cost ? { nx: g.nx } : {}) };
          };
          const c = { ...this._cfg, fam: mk(this._cfg.fam) };
          delete c.id;
          this._save('cfg', 'main', c, (cur) => ({ ...cur, fam: mk(cur.fam) }));
          return true;
        },
        del: () => { this._setCfg({ fam: null }); return true; },
      });
    }



    // Welche Aufgabe steckt in welcher Routine? (tid -> Routine-ID)

    // 🔧 Familienziel von Hand korrigieren (nur Eltern): um n ändern oder auf einen Wert setzen – ohne Feier, mit Eintrag im Verlauf
    _famFix(n, to) {
      const f = this._cfg.fam;
      if (!f || !f.cost || !this._isParent()) return;
      const calc = (g) => {
        const a = (g && g.pts) || 0, b = Math.max(0, Math.round(to != null ? to : a + n));
        if (a === b) return g;
        return { ...g, pts: b, reached: b >= g.cost, log: [...((g && g.log) || []), { t: Date.now(), a, b }].slice(-10) };
      };
      const nf = calc(f); if (nf === f) return;
      const c = { ...this._cfg, fam: nf }; delete c.id;
      this._save('cfg', 'main', c, (cur) => (cur.fam && cur.fam.cost ? { ...cur, fam: calc(cur.fam) } : cur));
      this._toast(T('🔧 Familienziel korrigiert: {a} → {b} ⭐', { a: f.pts || 0, b: nf.pts }));
    }

    // Eingelöst: weiter mit dem nächsten Ziel der Warteschlange (oder von vorne)

    // Eingelöst: weiter mit dem nächsten Ziel der Warteschlange (oder von vorne)
    _famNext(again) {
      const f = this._cfg.fam;
      if (!f || !f.cost || !this._isParent()) return;
      const nxt = (g) => {
        if (!g || !g.cost) return g;
        const done = [...(g.done || []), { title: g.title, emoji: g.emoji || '👨‍👩‍👧', d: dk(new Date()) }].slice(-10), q = [...(g.q || [])], carry = g.nx || 0;
        const base = { done, ...(g.log ? { log: g.log } : {}) };
        if (again || !q.length) return { ...g, ...base, pts: 0, reached: false, nx: undefined };
        const n = q.shift();
        return { title: n.title, emoji: n.emoji, cost: n.cost, pts: carry, reached: carry >= n.cost, ...base, ...(q.length ? { q } : {}) };
      };
      const nf = nxt(f), c = { ...this._cfg, fam: nf }; delete c.id;
      this._save('cfg', 'main', c, (cur) => (cur.fam && cur.fam.reached ? { ...cur, fam: nxt(cur.fam) } : cur));
      this._toast(!again && (f.q || []).length ? T('👨‍👩‍👧 Nächstes Familienziel: {e} {title}', { e: nf.emoji, title: nf.title }) : T('👨‍👩‍👧 Familienziel startet von vorne'));
      this._render();
    }

    _famQAct(a, el, ds) {
      const box = el.closest('.mbox'); if (!box) return;
      const q = [...(this._famQ || [])], i = Number(ds.i) || 0;
      if (a === 'famqadd') {
        const t = box.querySelector('[name=qtitle]').value.trim(), cost = Math.max(10, Math.round(Number(box.querySelector('[name=qcost]').value) || 0));
        if (!t) { this._toast(T('Bitte ein Ziel eingeben')); return; }
        if (q.length >= 10) { this._toast(T('Höchstens 10 Ziele')); return; }
        q.push({ title: t.slice(0, 60), emoji: box.querySelector('[name=qemoji]').value.trim() || '🎯', cost });
        box.querySelector('[name=qtitle]').value = '';
      } else if (a === 'famqdel') q.splice(i, 1);
      else if (a === 'famqup' && i > 0) [q[i - 1], q[i]] = [q[i], q[i - 1]];
      this._famQ = q;
      const l = box.querySelector('.famql'); if (l) l.innerHTML = this._famQHtml();
    }

    _famQHtml() {
      const q = this._famQ || [];
      return q.length ? q.map((x, i) => `<div class="row"><span style="font-size:20px">${esc(x.emoji)}</span><span class="grow">${i + 1}. ${esc(x.title)}<small>${x.cost} ⭐</small></span>${i ? `<button type="button" class="icon" data-a="famqup" data-i="${i}" title="${esc(T('nach oben'))}">▲</button>` : ''}<button type="button" class="icon" data-a="famqdel" data-i="${i}" title="${esc(T('Entfernen'))}">✕</button></div>`).join('') : `<div class="hint">${T('Noch keine weiteren Ziele.')}</div>`;
    }

    // ---------- 📖 Handbuch (nur Eltern-Bereich) ----------
    _hb() {
      const H = Y.HB || {}, base = H.de || { ui: {}, t: [] }, en = H.en || base, cur = H[Y.LANG] || (Y.LANG === 'gsw' ? base : en);
      const by = (L) => { const o = {}; (L.t || []).forEach((x) => { o[x[0]] = x; }); return o; };
      const bc = by(cur), be = by(en);
      const ui = { ...base.ui, ...(Y.LANG === 'de' || Y.LANG === 'gsw' ? {} : en.ui), ...cur.ui };
      const t = base.t.map(([id, ti, kw, body]) => {
        const c = bc[id] || (Y.LANG === 'gsw' ? null : be[id]) || [id, ti, kw, body], ek = (be[id] || [])[2] || '';
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

    // 📖 Kapitel des Handbuchs – gleiche Gruppen wie die Einstellungen (nicht genannte Themen landen unter „Allgemein“)
    _hbChapters() {
      return [
        [T('⚙️ Allgemein'), ['start', 'wizard', 'views', 'kids', 'kview', 'layout', 'presence', 'vacation', 'help']],
        [T('✅ Aufgaben & Tagesablauf'), ['tasks', 'when', 'window', 'rotate', 'extra', 'school', 'today', 'approval', 'missed', 'routine', 'timer', 'nfc', 'photo', 'trash_cal']],
        [T('⭐ Punkte & Boni'), ['points', 'bonus', 'badges', 'grades', 'birthday']],
        [T('🎁 Belohnungen & Geld'), ['rewards', 'cost', 'family', 'goal', 'wallet', 'shared', 'joker', 'money']],
        [T('🎉 Spaß & Sammeln'), ['pet', 'petown', 'games', 'screen', 'fun', 'reading', 'advent', 'teeth']],
        [T('🔔 Benachrichtigungen'), ['notify', 'buttons', 'background']],
        [T('🔌 Geräte & Sprache'), ['audio', 'voice', 'lametric', 'sensors']],
        [T('📈 Auswertung'), ['stats']],
        [T('💾 Daten'), ['security', 'backup', 'storage', 'trash', 'update']],
      ];
    }

    _hbOpen(q, topic) {
      if (!Y.HB) {
        this._modal(esc(T('📖 Handbuch')), `<div class="empty">${T('⏳ Handbuch wird geladen …')}</div>`, false, null);
        hbLoad().then(() => { if (this.shadowRoot.getElementById('modal').classList.contains('open')) this._hbOpen(q, topic); })
          .catch(() => { this._modal(esc(T('📖 Handbuch')), `<div class="hint">${T('⚠️ Handbuch-Datei nicht gefunden. „yippee-kids-chores-manual.js“ muss im selben Ordner liegen wie die Karte – beim Marketplace (HACS) passiert das automatisch, bei manueller Installation bitte mitkopieren.')}</div>`, false, null); });
        return;
      }
      const { ui, t } = this._hb();
      const chips = (ui.chips || []).map((c) => `<button type="button" class="hbchip" data-q="${esc(c)}">${esc(c)}</button>`).join('');
      const CH = this._hbChapters(), chOf = {};
      CH.forEach(([, ids], ci) => ids.forEach((id, j) => { chOf[id] = [ci, j]; }));
      const pos = t.map((x, i) => chOf[x.id] || [0, 100 + i]);
      const cnt = CH.map((c, ci) => pos.filter((x) => x[0] === ci).length);
      const headH = CH.map(([title], ci) => (cnt[ci] ? `<button type="button" class="hbch" data-c="${ci}" aria-expanded="false"><span class="grow">${esc(emoFix(title))}</span><small>${cnt[ci]}</small><span class="hbcc">▸</span></button>` : '')).join('');
      const list = headH + t.map((x, i) => `<details class="hbi" data-i="${i}" data-c="${pos[i][0]}"><summary>${esc(emoFix(x.ti))}</summary><div class="hbx">${this._hbBody(emoFix(x.body))}</div></details>`).join('');
      this._modal(esc(ui.title || '📖'), `<input type="search" class="hbq" enterkeyhint="search" autocomplete="off" placeholder="${esc(ui.search || '')}" aria-label="${esc(ui.search || '')}" value="${esc(q || '')}">
        <div class="hbchips">${chips}</div><div class="hint hbn"></div><div class="hblist">${list}</div><div class="empty hbnone" hidden>${esc(ui.none || '')}</div>`, false, null);
      const m = this.shadowRoot.getElementById('modal'), inp = m.querySelector('.hbq'), box = m.querySelector('.hblist');
      const items = [...m.querySelectorAll('.hbi')], info = m.querySelector('.hbn'), none = m.querySelector('.hbnone');
      const heads = [...m.querySelectorAll('.hbch')], openC = new Set();
      const ord = (el) => { const x = pos[el.dataset.i]; return x[0] * 1000 + x[1]; };
      // ohne Suchtext: Kapitel zum Aufklappen, darin die Themen in fester Reihenfolge
      const chap = () => {
        heads.forEach((h) => {
          const ci = Number(h.dataset.c), on = openC.has(ci);
          h.hidden = false; h.classList.toggle('on', on); h.setAttribute('aria-expanded', on ? 'true' : 'false'); box.appendChild(h);
          items.filter((el) => Number(el.dataset.c) === ci).sort((a2, b2) => ord(a2) - ord(b2)).forEach((el) => { el.hidden = !on; box.appendChild(el); });
        });
      };
      heads.forEach((h) => h.addEventListener('click', () => { const ci = Number(h.dataset.c); if (openC.has(ci)) openC.delete(ci); else openC.add(ci); chap(); }));
      const run = () => {
        const w = hbNorm(inp.value).split(/\s+/).filter(Boolean);
        const hit = items.filter((el) => w.every((x) => t[el.dataset.i].idx.includes(x)));
        const rank = (el) => (w.length && w.every((x) => t[el.dataset.i].head.includes(x)) ? 0 : 1);
        hit.sort((a, b) => rank(a) - rank(b) || a.dataset.i - b.dataset.i);
        items.forEach((el) => { el.hidden = !hit.includes(el); if (!w.length) el.open = false; });
        hit.forEach((el) => box.appendChild(el));
        heads.forEach((h) => { h.hidden = !!w.length; }); box.classList.toggle('chap', !w.length);
        if (w.length) hit.forEach((el, i) => { el.open = hit.length <= 3 || (i === 0 && rank(el) === 0); });
        else chap();
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
      if (ti) { items.forEach((el) => { el.hidden = el !== ti; }); heads.forEach((h) => { h.hidden = true; }); box.classList.remove('chap'); ti.open = true; info.textContent = ''; openC.add(Number(ti.dataset.c)); }
    }

    _isToday(t) { return this._isOn(t, new Date()); }

    // ---------- Müllkalender ----------
    // Termine eines HA-Kalenders (30 Tage zurück bis 120 Tage voraus), alle 3 Stunden neu geladen

    _kadmShut() {
      if (!this._kShut) { try { this._kShut = new Set(JSON.parse(localStorage.getItem('kpKadm') || '[]')); } catch (e) { this._kShut = new Set(); } }
      return this._kShut;
    }


    // ⬇️ Berichte als CSV (Excel: Semikolon, UTF-8 mit BOM) – Tage bzw. Wochen, je Kind erledigt/fällig/Sterne/eingelöst

    _listEnt(name) { return `todo.${String(name || '').toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')}`; }

    // ⚙️ Lokale To-do-Liste über Home Assistant anlegen – nur als Administrator (sonst wird die Schnittstelle nie aufgerufen)

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

    _niceNum(v) { const x = Math.max(1, v); return x < 10 ? Math.round(x) : x < 100 ? Math.max(5, Math.round(x / 5) * 5) : Math.round(x / 10) * 10; }

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
          // 💰 mit Taschengeld: die Auszahlung landet in der Spardose (Löschen der Buchung gibt die Sterne zurück)
          if (this._mnOn()) this._save('mb', `x${uid()}`, { k: kidId, a: Math.round(eur * 100), d: dk(new Date()), t: T('💶 Auszahlen'), src: 'x', st: p, by: (this._hass.user || {}).id || '' });
          this._audit(T('💶 Ausgezahlt: {name} {amount}', { name: k.name, amount: euro(p, rate) }));
          this._toast(T('💶 {amount} an {name} ausgezahlt (−{p} ⭐)', { amount: euro(p, rate), name: k.name, p }));
          return true;
        },
      });
    }

    // Dateiname der Sicherung, z. B. YippeeKidsChores03102026.json (Tag, Monat, Jahr)
    // ---------- Eltern = Home-Assistant-Benutzer ----------

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

    _presPreview(kidId, weeks, prIn) {
      const out = [], today = dk(new Date());
      let cur = null;
      const fmt = (key, m) => `${Y.DAYS[new Date(`${key}T12:00:00`).getDay()]} ${shortDate(key)}${m && m !== 1440 ? ` ${hm(m)}` : ''}`;
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

    // Modul nötig (z. B. im Belohnungs-Editor)? Dann erst laden und fn danach nochmal aufrufen
    _scNeed(fn) { if (Y.scOK || !this._scOn()) return false; scLoad().then(fn, () => this._toast(T('⚠️ Die Bildschirmzeit konnte nicht geladen werden – liegt die Datei yippee-kids-chores-screen.js neben der Karte?'))); return true; }

    async _scriptCreate() {
      if (!this._admin()) { this._toast(T('Anlegen nicht möglich (nur als Administrator) – bitte YAML kopieren')); return; }
      try { await this._hass.callApi('POST', `config/script/config/${SCRIPT_ID}`, this._ptsScript()); this._scriptOk = true; this._toast(T('✓ Skript angelegt: script.yippee_sterne')); } catch (e) { this._toast(T('Anlegen nicht möglich (nur als Administrator) – bitte YAML kopieren')); }
      this._render();
    }

    // 🔁 Vorlage für configuration.yaml: Sensoren pro Kind, die Home Assistant selbst aus der Yippee-Liste liest.
    // Jeder Sensor trägt die Kennung der Vorlage („vorlage“) – ändert sich die Vorlage (Update, Kinder, Einstellungen), merkt die Karte das.
    _sensYaml() { const raw = this._sensYamlRaw('@VORLAGE@'); return raw.split('@VORLAGE@').join(this._tplSig(raw)); }

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

    // 🎽 Turnbeutel: an welchen Tagen ist Sport? → gepackt wird am Abend davor
    _sportAsk(tid) {
      const t = this._db.task[tid];
      if (!t) return;
      const names = (t.kids || []).map((x) => (this._db.kid[x] || {}).name).filter(Boolean).join(', ');
      const cur = new Set((t.days || []).map((x) => (x + 1) % 7));
      this._modal(T('🎽 Wann ist Sport?'), `<div class="hint">${T('An welchen Tagen hat {name} Sport? „Turnbeutel packen“ kommt dann jeweils am Abend davor.', { name: esc(names || '?') })}</div>
        <div class="pick txt">${[1, 2, 3, 4, 5].map((x) => `<label><input type="checkbox" name="sd" value="${x}" ${cur.has(x) && cur.size < 5 ? 'checked' : ''}><span>${Y.DAYS[x]}</span></label>`).join('')}</div>`, false, {
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

    _statKw(d) { const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const n = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate() + 4 - n); const y0 = new Date(Date.UTC(x.getUTCFullYear(), 0, 1)); return Math.ceil(((x - y0) / 86400000 + 1) / 7); }

    // 📈 5-Wochen-Statistik eines Kindes (head = mit Name/Avatar-Zeile)

    // ---------- Statistik ----------
    _statsHtml(kids) {
      const kw = (d) => { const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const n = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate() + 4 - n); const y0 = new Date(Date.UTC(x.getUTCFullYear(), 0, 1)); return Math.ceil(((x - y0) / 86400000 + 1) / 7); };
      return `<div class="box"><h3>${T('📈 Statistik – letzte 5 Wochen')}</h3>${kids.map((k) => this._statKid(k, kw, true)).join('') || `<div class="hint">${T('Noch keine Kinder.')}</div>`}
        <div class="hint">${T('Balken = Anteil erledigter Pflicht-Aufgaben, oben = verdiente Sterne der Woche.')}</div></div>`;
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

    _taskOrder() { return Object.values(this._db.task).filter((t) => !t.virtual).sort((a, b) => (a.sched === 'once') - (b.sched === 'once') || this._blkRank(a) - this._blkRank(b) || this._ord(a, b) || String(a.title).localeCompare(String(b.title))); }

    // 📋 Eltern-Heute: Kinder und Tagesblöcke einklappbar – gemerkt auf diesem Gerät

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

    // 🗂️ Aufgaben-Tab: immer je Kind gruppiert, darunter wahlweise nach Tageszeit, Art oder ohne Unterteilung
    _tkArt(t) { return this._routine(t) ? 'r' : t.sched === 'once' ? 's' : this._isExtra(t) ? 'z' : 'p'; }

    _tkMode() { if (!this._tkg) { try { this._tkg = localStorage.getItem('kpTkg'); } catch (e) { /* egal */ } } return ['zeit', 'art', 'none'].includes(this._tkg) ? this._tkg : 'zeit'; }

    _tkSub(t, mode) { return mode === 'zeit' ? this._blk(t) : mode === 'art' ? this._tkArt(t) : ''; }

    _tplMeta(tp) {
      const [, , , pts, win, days, min, max] = tp;
      const ws = win ? this._tplWins(win).filter((x) => x[0]) : [], w = ws.length ? ws[0] : null;
      const d = days === 'dates' ? T('📅 Termine') : days === 'once' ? T('⚡ einmalig') : !days ? T('täglich') : WEEK.filter((x) => days.includes(x)).map((x) => Y.DAYS[x]).join(' ');
      return `+${pts} ⭐ · ${d}${ws.length > 1 ? ` · 🔁 ${ws.map((x) => `${x[0]}–${x[1]}`).join(' / ')}` : w ? ` · ⏰ ${w[0]}–${w[1]}` : ''} · ${max ? T('{min}–{max} J.', { min, max }) : T('ab {min} J.', { min })}`;
    }

    _tplSig(raw) { return `v${hsh(raw || this._sensYamlRaw('@VORLAGE@'))}`; }

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


    // ---------- aus der Karte ausgelagert: Automationen und Update-Prüfung (nur Eltern-Karten) ----------
    _admChecks() { this._planCheck(); this._updCheck(); }

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
        if (kind === 'voice') this._setCfg({ voiceSig: Y.LANG });
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
    _nfcTags() { return [...new Set(Object.values(this._db.task).filter((t) => !t.virtual && t.nfc).map((t) => String(t.nfc)))].sort(); }
    // Antwort für den Sprachassistenten – liest Plan, heutigen Stand und Punkte direkt aus der Liste
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
    // Plan für die nächsten 14 Tage in die Liste schreiben – daraus liest die Automation in Home Assistant
    _planCheck() {
      const c = this._cfg;
      if (!['kid', 'kids', 'advent'].includes(this._config.mode)) {
        this._autoStatus();
        // Knöpfe-Automation (Benachrichtigungs-Knöpfe der Home-Assistant-App) auf neuen Stand bringen (nach Updates oder wenn sich die Handys unter 🔔 ändern)
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
      if (c.voiceOn && (this._autoOk || {}).voice && this._admin() && !this._voiceBusy && c.voiceSig !== Y.LANG) { this._voiceBusy = true; this._autoCreate('voice', true).then(() => this._setCfg({ voiceSig: Y.LANG })).finally(() => { this._voiceBusy = false; }); }
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
    // Zeigt die Ressource schon auf die neue Version? (HACS trägt bei Updates selbst einen neuen hacstag ein)
    _resReady(i) {
      const url = String((i.u.res || {}).url || '');
      return /[?&]hacstag=/.test(url) || new RegExp(`[?&]v=${String(i.stale).replace(/\./g, '\\.')}(&|$)`).test(url);
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
  }
  Object.getOwnPropertyNames(M.prototype).forEach((n) => { if (n !== 'constructor') Object.defineProperty(C.prototype, n, Object.getOwnPropertyDescriptor(M.prototype, n)); });
  return true;
}
