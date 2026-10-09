# Changelog

Alle wichtigen Änderungen an **Yippee! - Kids Chores**.
Versionsnummern: `MAJOR.MINOR.PATCH` – Fehlerbehebungen erhöhen PATCH, neue Funktionen MINOR, grundlegende Änderungen (z. B. am Speicherformat) MAJOR.

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
