# Changelog

Alle wichtigen Änderungen an **Yippee! - Kids Chores**.
Versionsnummern: `MAJOR.MINOR.PATCH` – Fehlerbehebungen erhöhen PATCH, neue Funktionen MINOR, grundlegende Änderungen (z. B. am Speicherformat) MAJOR.

## [1.6.0] – 2026-10-30

### Neu
- **👆 Übersichtskarte antippen** ([#12](https://github.com/Chrism1412/yippee-kids-chores-card/issues/12), Idee von [@RkcCorian](https://github.com/RkcCorian)): Die kleine Übersicht (`summary: true`) kennt jetzt `tap_action`, `double_tap_action` und `hold_action` wie andere Home-Assistant-Karten – z. B. Antippen öffnet die Seite mit der großen Karte des Kindes, doppelt tippen den Punkteverlauf. Bequem im Karten-Editor unter „👆 Beim Antippen der Übersicht“ (Seite öffnen, Details öffnen, Link öffnen) oder per YAML mit allen Home-Assistant-Aktionen. `{kind}` in der Seite wird durch den Namen des angetippten Kindes ersetzt (`/dashboard-haus/{kind}` → `/dashboard-haus/mia`), „Details“ zeigt automatisch `sensor.yippee_<name>` des Kindes. Ohne Einstellung bleibt alles wie bisher.
- **📥 Download-Zähler in HACS:** Bei jedem Release hängt GitHub jetzt automatisch die Dateien der Karte an. HACS installiert daraus und zählt die Downloads wieder mit (seit 1.1.0 stand der Zähler still). Fehlen die Dateien einmal, installiert HACS wie bisher aus dem Repository.

### Behoben
- **Eltern-Ansicht auf dem Handy** ([#11](https://github.com/Chrism1412/yippee-kids-chores-card/issues/11), gemeldet von [@RkcCorian](https://github.com/RkcCorian)): Im 📋 Heute-Tab standen zwei Kinder auf schmalen Bildschirmen nebeneinander statt untereinander, die Karte ragte rechts über den Rand. Ursache war ein doppelt vergebener Name in der Gestaltung der neuen Farbwähler – jetzt wieder wie in 1.4.0.

## [1.5.0] – 2026-10-29

Danke an alle, die mitgedacht haben! Viele Ideen dieser Version stammen von euch:
- [@Locodice67](https://github.com/Locodice67) – aus seinem Fork; was dort noch nicht fertig war (Mittagsschlaf), ist jetzt komplett eingebaut
- [@RkcCorian](https://github.com/RkcCorian) – Übersichtskarte pro Kind, Darstellung, Reihenfolge der Kinder, gleich hohe Kacheln und der Hinweis zu den ✓ Knöpfen ([#4](https://github.com/Chrism1412/yippee-kids-chores-card/issues/4), [#5](https://github.com/Chrism1412/yippee-kids-chores-card/issues/5), [#6](https://github.com/Chrism1412/yippee-kids-chores-card/issues/6), [#9](https://github.com/Chrism1412/yippee-kids-chores-card/issues/9), [#10](https://github.com/Chrism1412/yippee-kids-chores-card/issues/10))
- [@gogui63](https://github.com/gogui63) – Minus-Stand mit Bilanz und Sterne per Automation/Sprachassistent ([#7](https://github.com/Chrism1412/yippee-kids-chores-card/issues/7), [#8](https://github.com/Chrism1412/yippee-kids-chores-card/issues/8))

### Neu
- **🧒 Kleine Übersichtskarte pro Kind** ([#5](https://github.com/Chrism1412/yippee-kids-chores-card/issues/5), Idee von [@RkcCorian](https://github.com/RkcCorian)): `summary: true` bei `mode: kid` oder `kids` zeigt nur Punkte, heute erledigt, Ziel, Level und Bilanz – ideal fürs Familien-Dashboard. Mit `show:` wählbar, auch im Karten-Editor. Für Verlaufsgrafiken gibt es weiterhin `sensor.yippee_<name>`.
- **🎨 Darstellung anpassen** ([#4](https://github.com/Chrism1412/yippee-kids-chores-card/issues/4), Idee von [@RkcCorian](https://github.com/RkcCorian)): `compact` (weniger Abstände), `transparent` (ohne eigenen Hintergrund) und `scale` (70–130 %) – auch im Karten-Editor. Für Themes und card_mod gibt es die Variablen `--yippee-bg`, `--yippee-surface`, `--yippee-accent`, `--yippee-text` und `--yippee-text-secondary`.
- **📏 Gleich hohe Kacheln** ([#10](https://github.com/Chrism1412/yippee-kids-chores-card/issues/10), Idee von [@RkcCorian](https://github.com/RkcCorian)): Jede Aufgaben-Kachel hat Platz für drei Zeilen Namen und zwei Zeilen Info – stehen mehrere Kinder-Karten nebeneinander, liegen die Reihen auf einer Linie. Längere Namen werden mit „…“ gekürzt. Die 🎁 Belohnungen werden genauso angeglichen (Name zwei Zeilen, Knopf unten bündig). `equal_tiles: true` oder per Schalter.
- **🎨 Farben ohne card_mod** (⚙️ Allgemein → 🎨 Darstellung): Farbvorlagen zum Antippen – wie das Dashboard, ☀️ Hell, 🌙 Dunkel, 🌸 Pastell, 🌊 Ozean, 🌲 Wald, 🌞 Sonne, 🌌 Nacht, 🍭 Bonbon – oder ✏️ eigene Farben mit Farbwähler für Hintergrund, Kacheln, Schrift und Akzent. Wer nur den Hintergrund wählt, bekommt passende Schrift und Kacheln automatisch; ist die Schrift schwer lesbar, warnt die Karte. Beim Ziehen im Farbwähler sieht man die Änderung sofort. Pro Karte im Karten-Editor oder mit `colors: dark` usw.
- **🎨 Darstellung auch unter ⚙️ Einstellungen** (⚙️ Allgemein → 🎨 Darstellung): Gleich hohe Kacheln, Kompakt, Ohne Hintergrund und Größe gelten dort für alle Karten auf allen Geräten. Was im Karten-Editor einer einzelnen Karte steht, hat Vorrang (dort jetzt jeweils „wie in ⚙️ Einstellungen / an / aus“ – mit dem gerade gültigen Wert, z. B. „wie in ⚙️ Einstellungen (an)“).
- **👧 Reihenfolge der Kinder** ([#6](https://github.com/Chrism1412/yippee-kids-chores-card/issues/6), Idee von [@RkcCorian](https://github.com/RkcCorian)): ▲▼ im 👧 Kinder-Tab – gilt für alle Ansichten, Berichte und Nachrichten.
- **➖ Minus-Stand erlauben** ([#7](https://github.com/Chrism1412/yippee-kids-chores-card/issues/7), Idee von [@gogui63](https://github.com/gogui63), ⚙️ → ⭐ Punkte & Boni): Minuspunkte ziehen auf Wunsch auch unter 0 ab. Kinder-Ansicht, Übersicht, Tagesabschluss und Wochenrückblick zeigen dann die Bilanz (verdient minus abgezogen); die Sensoren haben neu `heute_netto` und `woche_netto`. Die Einstellung gilt ab dem Einschalten – frühere Buchungen bleiben, wie sie waren.
- **🤖 Sterne per Automation oder Sprachassistent** ([#8](https://github.com/Chrism1412/yippee-kids-chores-card/issues/8), Idee von [@gogui63](https://github.com/gogui63)): Das Skript `script.yippee_sterne` (Felder `kind`, `sterne`, `grund`) gibt Sterne oder zieht welche ab – aus Automationen, Skripten oder über ein Skript je Kind mit Google Assistant/Alexa. Anlegen mit einem Tipp unter 🔌 Geräte & Sprache → 📊 Sensoren & Automationen (als Administrator) oder per YAML. Gebucht wird, sobald eine Yippee!-Karte geöffnet ist; im Verlauf steht „🤖 …“.
- **🎁 Belohnungen nur für bestimmte Kinder:** Im Belohnungs-Editor „Für welche Kinder?“ – z. B. das Lego-Set nur für Ben. Andere Kinder sehen die Belohnung nicht und können sie weder einlösen noch als Ziel wählen. Unter 🎁 Belohnungen steht „👧 nur für …“. Standard bleibt: für alle (bestehende Belohnungen ändern sich nicht). Gemeinsame Belohnungen nutzen weiter ihre eigene Kinder-Auswahl.
- **📊 Wochenrückblick mit Vergleich zur Vorwoche:** z. B. „75/118 erledigt (↗ +8 %)“. Am Sonntag zusätzlich bei den Sternen („+100 ⭐ verdient (↘ −12)“) – unter der Woche wäre der Sterne-Vergleich mit einer unfertigen Woche irreführend.
- **⬇️ Berichte als Tabelle (CSV):** unter 📊 Berichte – Tage bzw. Wochen mit erledigt, fällig, Sterne und eingelöst je Kind, direkt für Excel (in der Home-Assistant-App über „Teilen“).
- **📊 Berichte** im 👧 Kinder-Tab: eine Tabelle mit allen Kindern – **Tage** (erledigt/fällig, verdiente Sterne, wartende Freigaben; Antippen zeigt die Aufgaben und Buchungen des Tages) und **Wochen** (inkl. eingelöster Sterne). Nach jedem Tag speichert die Karte pro Kind einen kleinen, eingefrorenen Schnappschuss – 60 Tage und 52 Wochen, zusammen nur rund 3 KB pro Kind. Die Werte ändern sich später nicht mehr, auch nicht durch geänderte Aufgaben oder „Aufräumen“. Gefüllt wird ab dem Update.
- **🌙 Tagesabschluss und 📊 Wochenrückblick kompakt:** oben eine Zeile mit allen Kindern („🦊 Mia 6/6 ✅ · 🐻 Ben 4/5“) – so sieht man auch in der zugeklappten Handy-Nachricht jedes Kind –, darunter pro Kind Sterne, Wartendes und Stand. Offene Aufgaben nur noch auf Wunsch („📋 Offene Aufgaben mit auflisten“). Neu: **„👧 Eine Nachricht pro Kind“** (dann alles in einer Zeile, der Name steht im Titel) und **„Senden an“** – pro Bericht wählbar, an welche Handys/Telegram-Chats er geht (Standard: alle). Gilt auch für die 🌙 Hintergrund-Automation (wird als Administrator automatisch neu geschrieben).
- **💬 Telegram-Befehle `/heute` und `/woche`:** Tagesabschluss bzw. Wochenrückblick sofort im Chat. Die Befehls-Automation wird beim nächsten Öffnen als Administrator automatisch ergänzt.
- **📚 Termine als Aufgaben** (neue Funktion, ⚙️ Einstellungen → ✅ Aufgaben & Tagesablauf): „＋ Kalender verknüpfen“ – jeder Eintrag eines Home-Assistant-Kalenders wird zur eigenen Aufgabe mit seinem Text als Titel, ideal für Hausaufgaben („HA: Mathe S. 42“ erscheint am Tag vor der Abgabe). Wählbar: Kinder, Emoji, Sterne, am Tag davor oder am Termintag, Stichwort-Filter und Minuspunkte (Standard 0). Unter ✅ Aufgaben → 📚 Aus Kalendern lassen sich einzelne Termine mit 🙈 ausblenden.
- **🗓️ Kalender bei jeder Aufgabe:** Unter Wann? → 🗓️ Kalender geht jetzt jeder Kalender, nicht nur der Müllkalender – z. B. „Sporttasche packen“ am Vorabend jedes Trainings (Stichwort „Training“). Im 🗑️ Müllkalender legt „＋ Aufgabe „Müll rausbringen“ anlegen“ die passende Aufgabe mit einem Tipp an.
- **⚙️ Listen mit einem Tipp anlegen** (nur als Administrator): Fehlt die Speicher-Liste, legt die Karte sie im ersten Fenster selbst an – keine Umwege über die Integrationen mehr. Ebenso lassen sich die eigene Foto-Liste und die zweite Sicherungs-Liste direkt in den Einstellungen anlegen, mit frei wählbarem Namen (z. B. „Yippee Bilder“). Gibt es eine Liste mit dem Namen schon, wird sie genutzt statt doppelt angelegt. Normale Benutzer und Kinder-Konten sehen die Knöpfe nicht und rufen die Admin-Schnittstelle nie auf.
- **🌐 Sprache gleich im ersten Fenster:** Auswahl aller 27 Sprachen (jeweils in ihrer eigenen Schreibweise), vorausgewählt ist die Sprache von Home Assistant. Geladen wird nur das gewählte Sprachpaket; die Wahl wird übernommen, sobald die Liste angelegt ist. Dieselbe Auswahl steht im Einrichtungs-Assistenten.
- **📊 Verhaltens-Diagramm** unter 👧 Kinder (mit eingeschaltetem 😊 Benehmen): Balken für die letzten 14 Tage – grün = artig, rot = unartig, Höhe = Sterne des Tages – dazu Durchschnitt pro Tag und Trend-Pfeil ↗ ↘ →.
- **🏖️ „Nur an schulfreien Tagen“** bei Aufgaben (✎ → unten): Die Aufgabe erscheint nur am Wochenende, in den Ferien und an Feiertagen – das Gegenstück zu „🎒 Nur an Schultagen“ (beides zusammen geht nicht, der Haken springt um).
- **🕒 Lockerere Zeiten an schulfreien Tagen** (optional, ⚙️ Einstellungen → ✅ Aufgaben & Tagesablauf → ⏰ Tagesblöcke): An schulfreien Tagen läuft ein Zeitfenster länger – einstellbar: bis Ende des Tagesblocks (Standard; „Zähne putzen bis 9:00“ dann bis zum Ende von 🌅 Morgens), 30 Minuten, 1 oder 2 Stunden länger oder ohne Zeitlimit. Aufgaben, die immer pünktlich sein müssen (z. B. Medikament), bekommen im Editor das Häkchen „⏰ Feste Zeit auch an schulfreien Tagen“. Gilt auch für Erinnerungen, Minuspunkt-Abfrage, NFC und die Hintergrund-Automation.
- **👶 Vorlagen für Kleinkinder ab 2 Jahren:** 6 neue Aufgaben (z. B. „Windeln und Feuchttücher selbst wegbringen“, „Spielzeug aufräumen helfen“, „Beim Ausräumen der Spülmaschine helfen“), dazu „😴 Mittagsschlaf machen“ und „🤫 Mittagsruhe (leise spielen)“. Jetzt 221 Vorlagen.
- **Passendere Altersgrenzen:** Rund 50 Vorlagen werden schon jüngeren Kindern vorgeschlagen (z. B. Zähne putzen, Hände waschen, Pyjama anziehen ab 2; Schuhe anziehen, Tisch decken, Haustier füttern ab 3) – für ein 2-jähriges Kind gibt es jetzt 28 Vorschläge, für ein 4-jähriges 67 statt 35.
- **📋 5 neue Routinen** (jetzt 11): 😴 Mittagsschlaf-Routine, 🛁 Bade-Routine, 🍽️ Essens-Routine, 🐾 Haustier-Routine und ⚽ Sport-Routine – jeweils mit fertigen Schritten, altersgerecht gefiltert, in allen 27 Sprachen.
- **🎒 Samstagsschule:** Schultage zählen regulär von Montag bis Freitag. Hat ein Kind auch samstags Unterricht (z. B. in Italien oder Russland), lässt sich das beim Kind anhaken (👧 Kinder → ✎) – schon im Einrichtungs-Assistenten. Dann kommen Schul-Aufgaben für dieses Kind auch samstags („Ranzen packen“ am Freitagabend), Ferien und Feiertage bleiben frei, „🏖️ Nur an schulfreien Tagen“-Aufgaben entfallen an seinen Schul-Samstagen.

### Verbessert
- **📈 5-Wochen-Diagramm jetzt in 📊 Berichte:** Die bisherige „Monatsstatistik“ (zeigte eigentlich 5 Wochen) ist kein eigener Schalter mehr, sondern der dritte Reiter „📈 5 Wochen“ unter 👧 Kinder → 📊 Berichte – für alle Kinder auf einen Blick, neben „Tage“ und „Wochen“.
- **💾 Datensicherung aufgeräumt:** oben die Sicherungsdatei (Herunterladen, Teilen, Kopieren, Wiederherstellen), darunter die automatische Sicherung mit „Jetzt sichern“; die Liste der vorhandenen Sicherungen und die zweite Liste sind aufklappbar, die Datenprüfung steht am Ende.
- **✓ Knöpfe in Push-Nachrichten leichter prüfen** ([#9](https://github.com/Chrism1412/yippee-kids-chores-card/issues/9), gemeldet von [@RkcCorian](https://github.com/RkcCorian)): Unter ⚙️ → 🔌 Geräte & Sprache → ✓ Knöpfe & Telegram-Befehle steht jetzt, wann der letzte Knopf angekommen ist, von wem und was passiert ist (gebucht / war schon entschieden / ignoriert – nicht als Eltern eingetragen). Fehlt die Automation „📱 HA-App“, weist die Karte dort und bei 🔔 Freigaben deutlich darauf hin – vorher verschwand die Nachricht beim Antippen einfach, ohne dass etwas gebucht wurde.
- **🔒 Klare Rechte:** Knöpfe, die nur ein Administrator ausführen darf („⚙️ Automatisch anlegen“, „🔄 Automation neu schreiben“, „＋ Liste anlegen“, Ressource umstellen), sehen normale Benutzer nicht mehr – stattdessen steht „🔒 Nur als Administrator – oder YAML kopieren“. Die Karte ruft für sie auch im Hintergrund keine Admin-Schnittstelle auf (geprüft per Test).
- **✓ Alle Aufgaben freigeben:** Warten im 📋 Heute-Tab mehrere erledigte Aufgaben, gibst du sie mit einem Knopf frei (mit Rückfrage). Belohnungen, Wünsche und Noten bleiben einzeln.
- **⧉ Kopieren:** Im Editor einer Aufgabe oder Belohnung legt „⧉ Kopieren“ eine Kopie an, die du nur noch anpasst (z. B. „Zähne putzen abends“ aus „… morgens“).
- **Kinder-Ansicht aufgeräumt:** 🏅 Abzeichen (mit Zähler und den verdienten Abzeichen) und 📅 Demnächst (mit Anzahl) sind zugeklappt und lassen sich antippen – jedes Gerät merkt sich das.
- **👧 Kinder-Tab kompakter:** Punkte − / + und die Knöpfe stehen in einer Zeile; auf schmalen Handys nur mit Symbolen.
- **🌙 Dunkles Design:** Farbige Hinweise (Plausibilitäts-Check, Update, Ferien, Geburtstag, Doppelte Punkte, Benehmen-Knöpfe, wartende Aufgaben) passen sich jetzt dem Home-Assistant-Theme an – gut lesbar in hell und dunkel.
- **🎁 Belohnungen sortiert:** gruppiert nach Art – 🎁 für ein Kind · 👫 gemeinsam/einladen · 🃏 Joker – und innerhalb wahlweise nach ⭐ Sternen (gleicher Preis → alphabetisch) oder 🔤 A–Z (Knopf „Sortieren“ unter 🎁 Belohnungen). Die Reihenfolge gilt auch in der Kinder-Ansicht.
- **✨ Kinder-Ansicht:** Belohnungen, für die die Sterne schon reichen, stehen ganz oben unter „✨ Jetzt einlösbar“.
- **👧 Kinder-Tab:** Jedes Kind hat eine eigene Karte – oben Sterne, heutiger Fortschritt mit Balken und Level, aufgeklappt Punkte ±, Ziel, Knöpfe, 5-Wochen-Statistik und Verhaltens-Diagramm. Antippen klappt die Karte zu (pro Gerät gemerkt).
- **🔎 Suche in den Einstellungen:** Unter „Alle Einstellungen“ findet ein Suchfeld jede Einstellung. Zuerst erscheinen nur Abschnitte, in deren Titel oder Beschreibung das Wort steht – bloße Erwähnungen im Text (z. B. „… bei der Freigabe“) blendet „🔎 weitere Treffer im Text anzeigen“ bei Bedarf dazu. Gibt es keinen Titel-Treffer, wird direkt im Text gesucht (z. B. „aufbewahren“).
- **Schalter direkt in der Zeile:** Jede Zusatzfunktion hat rechts in ihrer Zeile einen An/Aus-Schalter – aufklappen braucht man nur noch für Optionen wie Uhrzeiten oder Sterne.
- **📖 Mehr dazu im Handbuch:** In jedem Einstellungs-Abschnitt öffnet ein Knopf direkt das passende Handbuch-Thema.
- **↩️ Rückgängig:** Direkt nach dem Löschen eines Kindes, einer Aufgabe oder einer Belohnung erscheint ein paar Sekunden lang „Rückgängig“ – ein Tipp, und alles ist wieder da (mit Punkten und Verlauf; klappt auch bei ausgeschaltetem Papierkorb).
- **🧭 Einrichtungs-Assistent mit 5 Schritten:** Neuer Schritt „⚙️ Funktionen“ – ⏰ Tagesblöcke, 📋 Routinen, 👍 Freigabe und 🎂 Geburtstag lassen sich gleich mit einschalten. Die Aufgaben-Vorschläge sind jetzt nach Tageszeit gruppiert (🌅 Morgens, ☀️ Mittags, 🌇 Nachmittags, 🌙 Abends, 📌 Ohne Zeit) – jede Gruppe auf- und zuklappbar, mit Zähler „angehakt/gesamt“ und eigenem „Alle auswählen / Keine“. Außerdem:
  - **👧 Schritt 1:** Avatar und Farbe gleich mit auswählen (aufklappbar, mit Vorschau).
  - **✅ Schritt 2:** **📋 Routinen** sind jetzt dabei und stehen in jeder Tageszeit-Gruppe oben – mit allen Schritten zum Nachlesen. Wer eine Routine wählt, bekommt 📋 Routinen automatisch eingeschaltet. 🔎 Suchfeld für alle Vorschläge; bei mehreren Kindern steht an jeder Aufgabe, wer sie bekommt.
  - **🎁 Schritt 3:** Die Sterne-Preise lassen sich direkt neben jeder Belohnung ändern.
  - **⚙️ Schritt 4:** Das Handy für Benachrichtigungen gleich mit auswählen.
  - **🎉 Schritt 5:** Fertiger Text für die Kinder-Karte mit „📋 Kopieren“ und kurzer Anleitung.
- **📱 Tabs auf schmalen Handys:** Passen die Namen nicht ganz, zeigt die Karte nur die Symbole (größer) statt abgeschnittener Wörter wie „He…“ oder „Ei…“.
- **⚙️ Einstellungen neu sortiert:** Der große Block „🧩 Zusatzfunktionen“ ist aufgelöst. Jede Funktion steht jetzt dort, wo sie thematisch hingehört, in 8 Gruppen: ⚙️ Allgemein · ✅ Aufgaben & Tagesablauf · ⭐ Punkte & Boni · 🎁 Belohnungen & Geld · 🔔 Benachrichtigungen · 🔌 Geräte & Sprache · 📈 Auswertung · 💾 Daten. Jede Funktion hat einen eigenen aufklappbaren Abschnitt, der „an“ oder „aus“ zeigt (z. B. ⏰ Tagesblöcke mit Uhrzeiten und lockereren Zeiten an einem Ort, alle Boni zusammen unter ⭐ Punkte & Boni). Alle Einstellungen bleiben erhalten; „Einfach“ bleibt wie gewohnt. Handbuch und Hinweise in der Karte zeigen die neuen Wege.
- **🕐 Tagesblöcke selbst einteilen** (⚙️ Einstellungen → ✅ Aufgaben & Tagesablauf → ⏰ Tagesblöcke): Wann Mittags, Nachmittags und Abends beginnen, stellst du ein. Jeder Block endet, wo der nächste beginnt – Überschneidungen sind ausgeschlossen, falsche Reihenfolgen werden abgelehnt. Neuer Standard: Mittags ab 11:30, Nachmittags ab 16:00, Abends ab 18:00 (vorher Mittag 12–14 Uhr). Aufgaben ohne Uhrzeit bleiben unter 📌 Ohne Zeit.
- **🗑️ Papierkorb:** Aufbewahrung wählbar – 7, 14 oder 30 Tage (Standard jetzt 7 statt 30); danach wird endgültig gelöscht. Bei jedem Eintrag steht, wann. Auch „🧹 Alte Einträge aufräumen“ hält sich jetzt an diese Zeit (löschte vorher schon nach 7 Tagen).
- **🗂️ Aufgaben-Tab übersichtlich gegliedert:** Die Aufgaben stehen **je Kind** unter einer eigenen Überschrift (mit Anzahl, ein- und ausklappbar); Aufgaben ohne Kind unter „👤 Ohne Kind“. Darunter wählbar („Unterteilen nach:“): **⏰ Tageszeit** (nach deinen Tagesblöcken), **🏷️ Art** (📋 Routinen / ✅ Pflicht / 🙋 Zusatz / ⚡ Sonder) oder **keine**. Gemeinsame Aufgaben stehen bei jedem Kind mit „👥 mit …“. ▲▼ verschiebt nur innerhalb desselben Kindes und derselben Gruppe. Auswahl und eingeklappte Gruppen merkt sich der Browser.
- **📖 Handbuch** in allen 27 Sprachen ergänzt (Nur an schulfreien Tagen, Samstagsschule, Verhaltens-Diagramm, lockerere Zeiten, eigene Tagesblock-Zeiten, Papierkorb-Dauer, 11 Routinen-Vorlagen).
- **📋 Vorlagen-Auswahl:** Beim Anlegen einer Aufgabe für mehrere Kinder stehen jetzt alle Vorlagen zur Wahl, die für **mindestens ein** ausgewähltes Kind passen (vorher nur die, die für alle passten).
- **Routinen für Ältere:** Morgen-, Abend-, Wochenend- und Essens-Routine werden jetzt bis 14 Jahre vorgeschlagen (vorher bis 12).
- **📱 Titel auf dem Handy:** „Yippee! - Kids Chores“ bricht auf schmalen Bildschirmen um, statt abgeschnitten zu werden.
- **🗂️ Aufgaben-Tab:** Bei „⏰ Tageszeit“ steht, ab wann Mittags, Nachmittags und Abends beginnen – und wo man das ändert.
- **📖 Handbuch:** Der Einrichtungs-Assistent erwähnt die Samstagsschule.
- **README:** neue Funktionen, aktualisierte Vorlagen-Tabelle (ab 2 Jahren) und Dank an Locodice67.

### Behoben
- **Wechsel der Speicher-Liste:** Kam nach dem Wechsel auf eine andere Liste (z. B. beim ersten Einrichten) noch eine Meldung der alten Liste an, übernahm die Karte kurz deren Stand – z. B. war die gerade gewählte Sprache im Einrichtungs-Assistenten wieder weg. Meldungen der alten Liste werden jetzt ignoriert.
- **📊 Wochenrückblick / Statistik mitten in der Woche:** Der heutige Tag zählte schon komplett als fällig – morgens wirkte die Quote dadurch viel zu schlecht. Jetzt zählen von heute nur Aufgaben, die erledigt bzw. gemeldet sind oder deren Zeitfenster vorbei ist.
- **📊 Wochenrückblick / Statistik:** Sterne für eine 💝 Einladung oder einen 👫 Anteil an einer gemeinsamen Belohnung zählten als „Minus“ – jetzt richtig als „🎁 eingelöst“ (zurückgezahlte Anteile werden wieder abgezogen). Push-Nachricht, 📊 Berichte und 📈 Statistik zeigen dadurch dieselben Werte.
- Aufgaben „nur an Schultagen“ zeigten „täglich · 🎒 nur an Schultagen“. Jetzt steht dort nur „🎒 nur an Schultagen“.
- Einrichtungs-Assistent: Name und Geburtsdatum eines neuen Kindes konnten verloren gehen, wenn die Karte während der Eingabe neu gezeichnet wurde.
- „📋 ＋ Routine“ zeigte nur die Vorlagen, die zum Alter **aller** ausgewählten Kinder passten – oft nur 3 oder 4. Jetzt stehen immer alle 11 Routinen-Vorlagen zur Auswahl.

## [1.4.0] – 2026-10-21

### Neu
- **📖 Handbuch** im Eltern-Bereich (📖 oben rechts oder ⚙️ Einstellungen): alle Funktionen kurz erklärt, mit Suche und Schlagwörtern (z. B. NFC, Anwesenheit, PIN), in allen 27 Sprachen – 47 Themen, auch zu Einrichtungs-Assistent, gemeinsamen Belohnungen, Speicher sowie allen Level-Stufen und Abzeichen. Liegt als eigene Datei `yippee-kids-chores-manual.js` neben der Karte – HACS installiert sie automatisch mit.
- **🌐 Zwei neue Sprachen: Türkçe (Türkisch) und Русский (Russisch)** – inklusive Handbuch. Damit sind es 27 Sprachen.
- **Mehr Vorlagen:** 39 neue Aufgaben-Vorlagen (jetzt 208, z. B. Salat zubereiten, Gemüsebeet gießen, Wäsche abnehmen, Streit friedlich lösen), 22 neue Belohnungen (jetzt 51, z. B. Karaoke-Abend, Frühstück im Bett, Kletterhalle, Zirkus) und 4 neue Routinen (Nach-der-Schule, Hausaufgaben, Zimmer, Wochenende).
- **Mehr Emojis:** rund 250 Emojis für Aufgaben und 120 für Belohnungen, nach Themen gruppiert (z. B. Körperpflege, Küche, Haushalt, Schule, Tiere & Garten), dazu 67 Kinder-Avatare.
- **🧭 Einrichtungs-Assistent** beim ersten Start: Kinder mit Geburtsdatum → passende Aufgaben anhaken → Belohnungen wählen → fertig. Jederzeit wieder startbar unter ⚙️ Einstellungen. Bestehende Installationen sehen ihn nicht.
- **⚙️ Einstellungen „Einfach“ / „Alle Einstellungen“:** auf Wunsch nur das Wichtigste. Nach dem Assistenten startet die Karte in „Einfach“, bestehende Installationen sehen weiterhin alles.
- **💽 Speicher-Anzeige** unter 🔒 Sicherheit & Daten: wie viel die Karte in der To-do-Liste belegt, mit „🧹 Alte Einträge aufräumen“.

### Neu (alles optional unter ⚙️ Einstellungen → 🧩 Zusatzfunktionen)
- **📋 Routinen:** eigener Knopf „📋 ＋ Routine“ unter ✅ Aufgaben. Schritte über ein Suchfeld hinzufügen – schon ab dem ersten Buchstaben erscheinen passende eigene Aufgaben und Vorlagen –, mit ▲▼ sortieren. Aufgaben, die in einer Routine stecken, erscheinen nicht mehr einzeln, sondern nur noch als Schritt. Das Kind hakt jeden Schritt ab, die Sterne gibt es beim letzten Haken. 6 Vorlagen: Morgen-, Abend-, Nach-der-Schule-, Hausaufgaben-, Zimmer- und Wochenend-Routine.
- **🔮 Spar-Prognose:** Sparziel und Familienziel zeigen, wann sie beim aktuellen Tempo ungefähr erreicht sind.
- **🧮 Preis-Assistent:** „≈ Tage sparen“ je Kind bei jeder Belohnung (übersichtlich: Preis und Spardauer pro Kind in einer Zeile, bei unterschiedlichen Preisen rechts der Bereich, z. B. „50–100 ⭐“) und „Preise vorschlagen“ passend zu den Wochensternen (inkl. Familienziel).
- **🏷️ NFC-Tags:** Aufgaben per NFC-Tag mit dem Handy abhaken; die Automation legt die Karte selbst an. Ist beim Scannen keine Karte geöffnet, wird die Aufgabe beim nächsten Öffnen abgehakt (es zählt die Uhrzeit des Scans); in den Einstellungen steht der letzte Scan mit Ergebnis.
- **👫 Gemeinsame Belohnungen:** Der Preis einer Belohnung wird auf mehrere Kinder aufgeteilt, jedes zahlt seinen Anteil selbst – oder ein Kind lädt die anderen ein und zahlt alles („💝 Einladen“ / „💝 Rest übernehmen“). Eingeladene Kinder zahlen nichts und verbrauchen ihr Wochenlimit nicht. Ablehnen, Zurücknehmen oder Verfallen nach 7 Tagen erstattet alle Sterne. Das andere Kind sieht oben in seinem Dashboard „💝 Mia lädt dich ein …“ bzw. „👫 Mia möchte … mit dir teilen – machst du mit?“ mit Mitmach-Knopf.
- **🎟️ Gutscheine:** eingelöste Belohnungen werden erst abgehakt, wenn das Kind sie bekommen hat – im 📋 Heute-Tab der Eltern stehen sie als „Eingelöst – noch nicht bekommen“ (ein- und ausklappbar), außerdem beim Kind.
- **🏅 Wochen-Bonus** und **👫 Teambonus** für vollständig geschaffte Tage.
- **🏠 Begrüßung bei Ankunft** für Kinder mit Anwesenheit, auf Wunsch mit Morgen-Nachricht an die Eltern.
- **🎙️ Sprachbefehle** für den Home-Assistant-Sprachassistenten („Was muss Mia heute noch machen?“, „Wie viele Sterne hat Mia?“).
- **🟦 LaMetric:** erledigte Aufgaben, „Alles geschafft!“ und Belohnungen auf einer LaMetric TIME.
- **🩺 Plausibilitäts-Check** (standardmäßig an): Hinweise auf unstimmige Einstellungen im Heute-Tab.

### Verbessert
- **🏅 Abzeichen antippen:** In der Kinder-Ansicht zeigt ein Tipp auf ein Abzeichen, wofür es steht und ob es schon geschafft ist – praktisch auf dem Handy, wo es keinen Mauszeiger gibt.
- **😊 Benehmen besser sichtbar:** Im 📋 Heute-Tab jetzt deutliche Knöpfe – grün „😊 +1“ und rot „😠 −1“ mit der eingestellten Sternezahl – statt kleiner Symbole. Die Einstellung steht jetzt unter 🧩 Zusatzfunktionen → 🎁 Belohnungen & Boni.
- **Klarere Anzeige bei „Wer zuerst kommt“-Aufgaben:** Hat ein anderes Kind eine gemeinsame oder Zusatzaufgabe schon gemacht, steht jetzt „✓ Schon erledigt von Ben“ bzw. „⏳ Ben hat es gemacht – wartet auf Freigabe“ statt des missverständlichen „Ben ist dran“.
- **Panel-Ansicht / breite Dashboards:** Im Heute-Tab rutschen die Benehmen-Knöpfe in schmalen Kinder-Spalten in eine eigene Zeile, statt sich mit Name und Sternen zu überlagern.
- **🗑️ Müllkalender:** Ist noch kein Kalender vorhanden, verlinkt der Hinweis direkt auf die Integration „Waste Collection Schedule“.
- **🌐 Sprache pro Karte:** Der Hinweis erklärt jetzt richtig, dass eine eigene Sprache im Karten-Editor für eine einzelne Karte gilt (z. B. auf dem Kinder-Tablet) – bei „Automatisch“ zeigt jedes Gerät die Sprache des angemeldeten Benutzers.
- **📊 Wochenrückblick:** Tag und Uhrzeit sind jetzt einstellbar (⚙️ Einstellungen → 🔔 Benachrichtigen bei …).
- **Punkte-Buchungen als eigene Einträge:** Tippen zwei Geräte gleichzeitig etwas an, geht keine Buchung mehr verloren.
- **Kein veraltetes Handbuch mehr:** Handbuch und Sprachdateien werden neu geladen, sobald die Ressourcen-Version der Karte erhöht wird (bzw. HACS aktualisiert) – auch bei gleicher Kartenversion.
- **Schneller:** Die Sprachen liegen jetzt als kleine eigene Dateien neben der Karte, geladen wird nur die gewählte – die Karte schrumpft von 1,9 MB auf ≈ 0,45 MB und startet schneller. HACS installiert alle Dateien automatisch mit. Außerdem werden Anwesenheit und Serien zwischengespeichert – flüssiger auf älteren Tablets.
- **README:** neue Screenshots und ein Dankeschön-Abschnitt an die Projekte, auf denen Yippee! aufbaut.
- **GitHub:** Vorlagen für Fehlermeldungen und Ideen (fragen Version, Installation, Gerät usw. gleich mit ab), Demo-Animation in der README.
- **Automatische Tests:** Bei jedem Hochladen auf GitHub laufen über 300 Prüfungen, auch dass Konten ohne Admin-Rechte nie Admin-Schnittstellen aufrufen.

## [1.3.1] – 2026-10-10

### Neu
- **👧 Preise je Kind** (optional, ⚙️ Einstellungen → Zusatzfunktionen): Jede Belohnung kann für jedes Kind einen eigenen Preis haben – z. B. weil ältere Kinder am Tag mehr Sterne sammeln können. Im Belohnungs-Editor steht bei jedem Kind, wie viele Sterne es an einem normalen Tag verdienen kann; „⚖️ Fair verteilen“ rechnet die Preise so um, dass jedes Kind etwa gleich lange sparen muss. Kinder sehen, sparen und lösen jeweils zu ihrem eigenen Preis ein.

### Behoben
- **IP-Sperre bei Kinder-Konten ohne Admin-Rechte** ([#3](https://github.com/Chrism1412/yippee-kids-chores-card/issues/3)): Die Karte hat auch bei Benutzern ohne Administrator-Rechte versucht, die Sensoren `sensor.yippee_…` zu schreiben und den Status der Automationen abzufragen. Home Assistant lehnt das ab und wertet es als Fehlanmeldung – mit `ip_ban_enabled` wurde das Gerät nach kurzer Zeit gesperrt. Diese Aufrufe macht die Karte jetzt nur noch bei Administratoren.
- **Foto-Nachweis mit Konten ohne Admin-Rechte:** kein Upload in den Medien-Ordner mehr (den erlaubt Home Assistant nur Administratoren). Stattdessen speichert die Karte ein verkleinertes Foto in einer To-do-Liste – wahlweise in der Hauptliste oder in einer eigenen Liste (⚙️ Einstellungen → Zusatzfunktionen → 📷 Foto-Nachweis). Die Eltern sehen es bei der Freigabe in der Karte; nach der Entscheidung wird es gelöscht. Gilt auch für Fotos zu Schulnoten.
- **Fehlende Symbole:** Einige Emojis der Vorlagen (z. B. bei „Spülmaschine ausräumen“, „Staub wischen“, „Zähne putzen“) erschienen auf älteren Handys und Tablets nur als leeres Feld. Sie sind durch Emojis ersetzt, die jedes Gerät kennt; bestehende Aufgaben und Belohnungen zeigen automatisch das neue Symbol.

**Hinweis:** Wurde ein Gerät schon gesperrt, in `/config/ip_bans.yaml` die Zeile mit seiner IP löschen und Home Assistant neu starten.

## [1.3.0] – 2026-10-09

### Neu
- **Aufgaben-Datenbank: 163 statt 81 Vorlagen in 12 Bereichen** – alle in 25 Sprachen, mit passendem Alter
  - neue Bereiche **❤️ Gesundheit & Bewegung** (z. B. Genug Wasser trinken, 30 Min. draußen spielen, Sonnencreme, Zahnseide) und **👨‍👩‍👧 Familie & Miteinander** (z. B. Oma oder Opa anrufen, Dankeskarte schreiben, Handyfreie Stunde)
  - Morgen- und Abendroutine für kleine Kinder ab 4 Jahren (Aufstehen, Frühstücken, Schuhe anziehen, Pyjama anziehen, Ins Bett gehen …) – beigesteuert von [@Locodice67](https://github.com/Locodice67) ([#1](https://github.com/Chrism1412/yippee-kids-chores-card/pull/1))
  - mehr für Schulkinder (Turnbeutel packen, Für die Klassenarbeit lernen, Referat vorbereiten, Allein zur Schule gehen) und Jugendliche (Eigene Wäsche komplett waschen, Arzttermin selbst ausmachen, Autoscheiben freikratzen, Toilette putzen)
  - neue Saisonzeiten: Sonnencreme Mai–September, Obst ernten Juni–September, Plätzchen backen Dezember, Autoscheiben freikratzen Dezember–März
- **29 statt 21 Belohnungs-Vorlagen**, u. a. Musik im Auto aussuchen, 30 Min. Handyzeit, Exklusivzeit mit Mama oder Papa, Neues Hörspiel, Länger ausgehen dürfen, 5 € Taschengeld
- **🏠 Anwesenheit** (optional, pro Kind) für getrennte Eltern und Patchwork-Familien: „meistens bei uns“ oder „meistens woanders“ plus beliebig viele Regeln (da / nicht da, jede Woche oder alle 2–4 Wochen, von Tag + Uhrzeit bis Tag + Uhrzeit – z. B. jeden Mi 14:00 bis Do 08:00 und jedes 2. Wochenende), Ferienregelung je Ferienart (ganz bei uns, beim anderen Elternteil, erste/zweite Hälfte, erste/letzte … Wochen), jährlich wechselnd, Ausnahmen und Vorschau. Ist das Kind nicht da, gibt es keine Aufgaben, Erinnerungen oder „verpasst“; an Tagen mit Kommen und Gehen nur Aufgaben in der Anwesenheitszeit. Neues Sensor-Attribut `anwesend`
- **🃏 Joker** (optional, unter Einstellungen → Zusatzfunktionen): eine Belohnung, mit der das Kind eine heutige Pflicht-Aufgabe ohne Minuspunkte auslassen darf; die Serie bleibt erhalten, die Eltern bekommen eine Nachricht. Eltern können Joker beim Kind (✎) auch von Hand vergeben oder abziehen
- **😊 Benehmen** (optional): Knopf „Artig“ im Heute-Tab für schnelles Lob mit einstellbaren Sternen, auf Wunsch zusätzlich 😠 „Unartig“ mit Abzug; Einträge im Punkte-Verlauf und Änderungsprotokoll – Idee von [@Locodice67](https://github.com/Locodice67)
- **🔁 Mehrmals am Tag:** bis zu 5 Zeitfenster pro Aufgabe statt 2; Vorlagen wie „Hände waschen“ und „Aufs Klo gehen“ kommen gleich mit Zeitfenstern für morgens, mittags und abends
- **↕️ Eigene Reihenfolge** (optional): Aufgaben unter ✅ Aufgaben mit ▲▼ sortieren
- **⏰ Tagesblöcke** (optional): Kinder- und Eltern-Ansicht gruppiert nach Morgens, Mittags, Nachmittags, Abends und Ohne Zeit, je mit eigenem Fortschritt; Blöcke lassen sich auf- und zuklappen, abgelaufene klappen automatisch zu (abschaltbar)
- **＋ Aufgabe** direkt im Heute-Tab; der zuletzt geöffnete Tab wird gemerkt
- **🌙 „Am Abend vorher“** bei „Nur an Schultagen“: für Ranzen oder Turnbeutel packen – kommt, wenn am nächsten Tag Schule ist; beim Turnbeutel fragt die Karte nach den Sporttagen
- Reihenfolge, mehrere Zeitfenster, Tagesblöcke, weniger Klicks und die Routine-Vorlagen: Ideen und Umsetzung von [@Locodice67](https://github.com/Locodice67) ([#1](https://github.com/Chrism1412/yippee-kids-chores-card/pull/1)), eingearbeitet und angepasst

### Geändert
- **Übersichtlichere Bedienung:** Einstellungen in 4 Gruppen (Allgemein · Punkte & Regeln · Benachrichtigungen · Sicherheit & Daten), Zusatzfunktionen in 3 Gruppen (Für Kinder · Aufgaben · Auswertung)
- Tab-Leiste passt auf jedes Handy in eine Zeile; offene Freigaben stehen nur noch im Heute-Tab, mit Zähler 🔴 am Tab
- Aufgaben-Liste mit Filter je Kind und „＋ Aufgabe“ oben; Vorlagen-Suche im Aufgaben-Editor
- Knöpfe in der Kinder-Liste mit Beschriftung (Vorschläge, Note, Verlauf, Bearbeiten)
- „Minuspunkte ziehen auch vom Familienziel ab“ jetzt unter ⚙️ Einstellungen → 👍 Freigabe
- Kinder-Ansicht ist jetzt standardmäßig **aufgeklappt**; eingeklappt weiterhin mit `collapsed: true`
- „Hände waschen morgens/abends/vor dem Essen“ und „Aufs Klo gehen morgens/abends“ sind zu je einer Vorlage mit mehreren Zeitfenstern zusammengefasst; neuer Vorlagen-Bereich ☀️ Mittags

### Behoben
- Nach dem Abhaken springt die Seite nicht mehr nach oben (Scroll-Position bleibt erhalten)
- „Ranzen für morgen packen“ kam sonntagabends nicht, dafür aber am letzten Schultag vor den Ferien – jetzt zählt, ob am nächsten Tag Schule ist (bestehende Aufgaben werden automatisch erkannt)
- Kopfzeile „Belohnungen“ in der Kinder-Ansicht: Knöpfe (🃏 Joker, 🎓 Note, 💡 Wunsch) stehen in einer eigenen Zeile und passen auch auf schmale Handys

## [1.2.0] – 2026-10-09

### Neu
- **🎓 Schulnoten** (optional, unter Einstellungen → Zusatzfunktionen): Sterne für gute Noten ([#2](https://github.com/Chrism1412/yippee-kids-chores-card/issues/2))
  - Note je Kind eintragen: Fach aus Schnellauswahl oder frei, dazu die Note
  - Sterne automatisch nach Notentabelle – Notenskala passend zum Land (z. B. DE 1–6, CH 6–1, FR 0–20, IT/ES/NL 1–10, PL 1–6, Prozent), Sterne je Note frei änderbar, nie Abzug
  - Bonus fürs Verbessern (besser als die letzte Note im selben Fach) und Zeugnis-Bonus
  - Kinder melden Noten selbst, auf Wunsch mit Foto der Arbeit; Freigabe in der Karte oder per Push-/Telegram-Knopf
  - Notenübersicht je Fach mit Schnitt, Anzahl und Trend; Noten-Sterne zählen für Level und Familienziel

## [1.1.0] – 2026-10-08

### Neu
- **Einschulung je Land:** Die Schul-Vorlagen richten sich nach dem üblichen Einschulungsalter des eingestellten Landes (z. B. Irland 5, Deutschland 6, Polen 7 Jahre)
- **„Eingeschult im (Monat/Jahr)“** beim Kind (optional): überschreibt den Länderwert; die Karte zeigt dann die Klasse an (z. B. „8 Jahre · 2. Klasse“)
- **Doppelte Ressourcen erkennen:** Ist die Karte mehrfach als Ressource eingetragen (z. B. alte Datei unter /local/ und HACS), warnt der Eltern-Bereich und entfernt die überflüssigen Einträge auf Knopfdruck

### Behoben
- Alte Testversionen (z. B. 46, 48) gelten beim Versionsvergleich nicht mehr als neuer als 1.x
- Prüfablauf auf GitHub auf aktuelle Versionen umgestellt (keine Node.js-20-Warnungen mehr)

## [1.0.0] – 2026-10-07

Erste öffentliche Version.

### Enthalten
- Eltern-, Kinder- und Einzelkind-Ansicht mit visuellem Editor
- Aufgaben mit Wochentagen, festen Terminen, einmaligen Sonderaufgaben und Müllkalender; im Wechsel, „Einer reicht“, Zusatzaufgaben, zweimal am Tag, Saison und „nur an Schultagen“
- Freigabe durch Eltern, Minuspunkte nur nach Entscheidung der Eltern
- Belohnungen mit Sparziel, Wünschen, Familienziel, Taschengeld-Umrechnung
- Level, Abzeichen, Serien-Bonus, Doppelte-Punkte-Tage, Geburtstag (Bonus, Punktefaktor, Konfetti)
- Schulferien und Feiertage für 36 Länder (OpenHolidays, Ausweichlösung über Home-Assistant-Kalender), eigene Urlaubszeiträume
- Benachrichtigungen per Home-Assistant-App und Telegram mit Knöpfen, Telegram-Befehle, Tagesabschluss, Wochenrückblick
- Sprachausgabe (TTS, Alexa Media Player): Morgen-Ansage und Erinnerungen
- Sensoren pro Kind für eigene Automationen
- Hintergrund-Automation: Ansagen und Meldungen auch ohne geöffnete Karte
- Automatische Sicherungen (auch in eine zweite Liste), Datenprüfung, Papierkorb, Änderungsprotokoll
- Eltern = ausgewählte Home-Assistant-Benutzer, PIN mit Sperre nach Fehlversuchen
- Update-Hinweise (HACS); nach einem Update erhöht die Karte die Ressourcen-Version automatisch
- 25 Sprachen: Deutsch, Schweizerdeutsch und alle weiteren EU-Amtssprachen
