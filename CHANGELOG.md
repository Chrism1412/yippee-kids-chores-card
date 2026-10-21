# Changelog

Alle wichtigen Änderungen an **Yippee! - Kids Chores**.
Versionsnummern: `MAJOR.MINOR.PATCH` – Fehlerbehebungen erhöhen PATCH, neue Funktionen MINOR, grundlegende Änderungen (z. B. am Speicherformat) MAJOR.

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
