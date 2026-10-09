# Changelog

Alle wichtigen Änderungen an **Yippee! - Kids Chores**.
Versionsnummern: `MAJOR.MINOR.PATCH` – Fehlerbehebungen erhöhen PATCH, neue Funktionen MINOR, grundlegende Änderungen (z. B. am Speicherformat) MAJOR.

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
