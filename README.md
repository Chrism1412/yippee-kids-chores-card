<p align="center">
  <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/icon-512.png" width="120" alt="Yippee! - Kids Chores Logo">
</p>

<h1 align="center">Yippee! - Kids Chores</h1>

<p align="center">
  <b>Aufgaben abhaken · Sterne sammeln · Belohnungen einlösen</b><br>
  Eine Home-Assistant-Karte, mit der Kinder ihre Aufgaben im Haushalt erledigen und Eltern alles im Blick behalten.
</p>

<p align="center">
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg" alt="HACS Custom"></a>
  <a href="https://github.com/Chrism1412/yippee-kids-chores-card/releases"><img src="https://img.shields.io/github/v/release/Chrism1412/yippee-kids-chores-card" alt="Version"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.10%2B-03a9f4" alt="Home Assistant 2024.10+">
  <img src="https://img.shields.io/badge/Sprachen-25-ffc93c" alt="25 Sprachen">
  <a href="https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/LICENSE"><img src="https://img.shields.io/badge/Lizenz-MIT-green.svg" alt="MIT"></a>
</p>

<p align="center"><a href="https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/README.en.md">🇬🇧 English version</a></p>

---

## Inhalt

- [Was ist Yippee!?](#was-ist-yippee)
- [Screenshots](#screenshots)
- [Funktionen im Überblick](#funktionen-im-überblick)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Einrichtung](#einrichtung)
- [Karten-Optionen](#karten-optionen)
- [Integrationen](#integrationen)
  - [Benachrichtigungen: Home-Assistant-App](#benachrichtigungen-home-assistant-app)
  - [Telegram](#telegram)
  - [Sprachausgabe: TTS und Alexa](#sprachausgabe-tts-und-alexa)
  - [Müllkalender: Waste Collection Schedule & Co.](#müllkalender-waste-collection-schedule--co)
  - [Schulferien und Feiertage](#schulferien-und-feiertage)
  - [Sensoren für eigene Automationen](#sensoren-für-eigene-automationen)
  - [Hintergrund-Automation](#hintergrund-automation)
- [Datensicherheit](#datensicherheit)
- [Zugriffsschutz](#zugriffsschutz)
- [Sprachen](#sprachen)
- [Updates](#updates)
- [Datenschutz](#datenschutz)
- [Wie werden die Daten gespeichert?](#wie-werden-die-daten-gespeichert)
- [Grenzen](#grenzen)
- [Häufige Fragen](#häufige-fragen)
- [Lizenz](#lizenz)

---

## Was ist Yippee!?

**Yippee! - Kids Chores** ist eine einzelne JavaScript-Karte für das Home-Assistant-Dashboard. Kinder sehen ihre Aufgaben für heute als große, bunte Kacheln, tippen sie an und sammeln dafür Sterne ⭐. Mit den Sternen lösen sie Belohnungen ein, steigen Level auf und schalten Abzeichen frei.

Eltern legen Aufgaben und Belohnungen an, geben Erledigtes frei (auch direkt aus der Push- oder Telegram-Nachricht) und entscheiden bei verpassten Aufgaben selbst, ob es Minuspunkte gibt – **nichts wird automatisch abgezogen**. Kinder müssen also keinen starren Zeitplan einhalten, z. B. wenn die Familie unterwegs ist.

- **Keine Cloud, kein Konto, kein Server:** Alle Daten liegen in einer *Lokalen To-do-Liste* deines Home Assistant.
- **Eine Datei, keine Abhängigkeiten:** Keine weiteren HACS-Karten nötig, ressourcenschonend auch auf älteren Tablets.
- **Für das Handy gemacht:** Funktioniert in der Home-Assistant-App im Hochformat genauso wie auf dem Wand-Tablet.

> ### 💡 Sofort startklar: 163 Aufgaben und 29 Belohnungen eingebaut
> Du musst nicht bei null anfangen. Die Karte bringt eine **Aufgaben-Datenbank mit 163 Vorlagen in 12 Bereichen** mit – von „Zähne putzen“ über „Ranzen packen“ und „Spülmaschine ausräumen“ bis „Rasenmähen“ – jeweils mit passendem Emoji, Punkten und Tageszeit. Dazu **29 Belohnungs-Vorlagen** wie Eisgutschein, Filmabend, Kino oder Freizeitpark.
>
> **Altersgerecht dank Geburtstag:** Trägst du beim Kind den Geburtstag ein, zeigt die Auswahlliste nur Aufgaben, die zum Alter passen (4 bis 17 Jahre). Für ein 4-jähriges Kind sind es 27 Vorschläge, mit 6 Jahren 79, mit 8 Jahren 103, ab 10 Jahren über 110. Mit dem 💡-Knopf beim Kind schlägt die Karte alle passenden, noch nicht zugewiesenen Aufgaben auf einmal vor – anhaken, fertig.

## Screenshots

| Kinder-Ansicht | Eltern-Ansicht | Belohnungen | Einstellungen | Anwesenheit |
|:---:|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/kinder-ansicht.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/eltern-heute.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/belohnungen.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/einstellungen.png" width="200"> | <img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/anwesenheit.png" width="200"> |

## Funktionen im Überblick

### Für Kinder
- Große Aufgaben-Kacheln mit Emoji, Punkten und Zeitfenster („bis 09:00“)
- Sterne-Konto, **10 Level** (vom 🌱 Anfänger bis zum 💎 Haushalts-König) und **9 Abzeichen**
- **Sparziel** 🎯: eine Belohnung auswählen und den Fortschritt dorthin sehen
- **Wünsche** 💡: eigene Belohnungsideen an die Eltern schicken
- **Joker** 🃏 (optional): als Belohnung einlösen und damit eine Pflicht-Aufgabe ohne Minuspunkte auslassen
- **Familienziel** 👨‍👩‍👧: alle Kinder sammeln gemeinsam, z. B. für einen Ausflug
- **Serien** 🔥: Bonus, wenn eine Aufgabe mehrere Tage am Stück erledigt wird
- **„Demnächst“** 📅: Vorschau auf besondere Aufgaben der nächsten Tage
- **Geburtstag** 🎂: Konfetti, Bonus, Punktefaktor und auf Wunsch aufgabenfrei
- **Schulnoten** 🎓 (optional): Sterne für gute Noten – Note selbst melden, auf Wunsch mit Foto der Arbeit
- **Tagesblöcke** ⏰ (optional): Aufgaben nach Morgens, Mittags, Nachmittags und Abends gruppiert, jeder Block mit eigenem Fortschritt – zum Auf- und Zuklappen; vorbei ist vorbei: abgelaufene Blöcke klappen automatisch zu (abschaltbar). Auch in der Eltern-Ansicht
- Auf Wunsch eingeklappte Ansicht (`collapsed: true`): nur Name und Punkte, Aufgaben erst nach Antippen

### Aufgaben
- **Wochentage**, **feste Termine**, **einmalige Sonderaufgaben** (wer zuerst kommt) oder **aus dem Müllkalender**
- **Im Wechsel** 🔄: die Kinder sind abwechselnd dran – ist eines im Urlaub, übernimmt das nächste
- **„Einer reicht“** 🤝: Pflicht für alle, erledigt sobald es eines macht
- **Zusatzaufgaben** 🙋: freiwillig, mit Extrapunkten
- **Mehrmals am Tag** (bis zu 5 Zeitfenster, z. B. Hände waschen morgens, mittags und abends)
- **Eigene Reihenfolge** ↕️ (optional): Aufgaben mit ▲▼ sortieren – so sehen sie auch die Kinder
- **„Am Abend vorher“** 🌙 für Aufgaben wie Ranzen oder Turnbeutel packen: kommt, wenn am nächsten Tag Schule ist; beim Turnbeutel fragt die Karte nach den Sporttagen
- **Saison** (z. B. Rasenmähen nur April–Oktober) und **„nur an Schultagen“**
- **Foto-Nachweis** 📷 pro Aufgabe: das Kind fotografiert beim Abhaken, die Eltern sehen das Foto bei der Freigabe – klappt auch mit Kinder-Konten ohne Admin-Rechte: dann speichert die Karte ein verkleinertes Foto in einer To-do-Liste (am besten einer eigenen, z. B. „Yippee Fotos“)
- **Aufgaben-Datenbank mit 163 Vorlagen** in 12 Bereichen – nach Geburtstag automatisch altersgerecht gefiltert (siehe unten)

### Aufgaben-Datenbank: 163 Vorlagen, altersgerecht

| Bereich | Vorlagen | Beispiele |
|---|:---:|---|
| 🌅 Morgens | 15 | Aufstehen, Bett machen, Zähne putzen, Schuhe anziehen, Selbst mit Wecker aufstehen |
| ☀️ Mittags | 3 | Mittagessen, Sachen wegräumen, Vesper essen (nach der Schule) |
| 🎒 Schule | 23 | Hausaufgaben, Lesen üben, Turnbeutel packen, Für die Klassenarbeit lernen, Referat vorbereiten |
| 🍽️ Küche & Essen | 20 | Tisch decken, Spülmaschine ausräumen, Nudeln kochen, Komplette Mahlzeit kochen, Pizza selbst belegen |
| 🛒 Einkaufen | 4 | Brötchen einkaufen, Einkaufsliste schreiben, Einkauf mit Einkaufsliste, Wocheneinkauf erledigen |
| 🧹 Ordnung & Putzen | 18 | Zimmer aufräumen, Staubsaugen, Schreibtisch aufräumen, Bad komplett putzen |
| 🧺 Wäsche | 12 | Socken sortieren, Wäsche zusammenlegen, Eigene Wäsche komplett waschen |
| 🏡 Haus, Garten & Tiere | 24 | Müll rausbringen, Hund ausführen, Fische füttern, Rasenmähen, Autoscheiben freikratzen |
| 🧑 Verantwortung | 9 | Handy pünktlich abgeben, Taschengeld-Budget führen, Arzttermin selbst ausmachen |
| ❤️ Gesundheit & Bewegung | 14 | Hände waschen (morgens, mittags, abends), Genug Wasser trinken, 30 Min. draußen spielen, Sonnencreme auftragen, Zahnseide benutzen |
| 👨‍👩‍👧 Familie & Miteinander | 7 | Oma oder Opa anrufen, Dankeskarte schreiben, Handyfreie Stunde, Nachbarn helfen |
| 🌙 Abends | 14 | Abendessen, Zähne putzen abends, Pyjama anziehen, Vorlesen, Ins Bett gehen |

**So funktioniert die Altersauswahl:**

1. Beim Kind unter **👧 Kinder → ✎** den **Geburtstag** eintragen.
2. Beim Anlegen einer Aufgabe zeigt **📋 Vorlage wählen** nur die Vorlagen, die zum Alter der ausgewählten Kinder passen. Mit „Alle Vorlagen“ lässt sich die ganze Liste einblenden.
3. Oder der **💡-Knopf** beim Kind: Er listet alle passenden Aufgaben, die das Kind noch nicht hat – anhaken und mit einem Tipp übernehmen.

| Alter | 4 | 5 | 6 | 8 | 10–12 | 14+ |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Passende Vorlagen | 27 | 49 | 79 | 103 | 117–118 | 111 |

**Schul-Vorlagen** richten sich nach dem üblichen **Einschulungsalter des eingestellten Landes** (z. B. Irland und Malta 5, Deutschland 6, Polen und Schweden 7 Jahre). Ist ein Kind früher oder später eingeschult worden, beim Kind **„🎒 Eingeschult im (Monat/Jahr)“** eintragen – dann zählen die Schuljahre, und die Karte zeigt die Klasse an (z. B. „8 Jahre · 2. Klasse“).

Vorlagen mit Jahreszeit bekommen automatisch ihre Saison (Rasenmähen April–Oktober, Unkraut und Blumen gießen April–September, Sonnencreme Mai–September, Obst ernten Juni–September, Laub Oktober–November, Plätzchen backen Dezember, Schnee und Autoscheiben freikratzen Dezember–März), Schul-Aufgaben automatisch „nur an Schultagen“. Alle Vorlagen sind in allen 25 Sprachen übersetzt und lassen sich nach dem Übernehmen frei anpassen.

Dazu gibt es **29 Belohnungs-Vorlagen** von klein bis groß: Eisgutschein, Süßigkeit aussuchen, 30 Min. extra Spielzeit, Musik im Auto aussuchen, Exklusivzeit mit Mama oder Papa, 🃏 Joker, Filmabend mit Popcorn, Freund/in einladen, Länger ausgehen dürfen, Kino, Zoo bis Freizeitpark – mit Vorschlagspreis in Sternen, frei änderbar.

### Anwesenheit 🏠 – für getrennte Eltern und Patchwork-Familien (optional)

Ist ein Kind nicht immer im Haushalt (Umgang, Wechselmodell, Patchwork), stellst du das **pro Kind** unter **👧 Kinder → ✎ → 🏠 Anwesenheit** ein – jedes Kind mit eigenem Plan:

- **Normalerweise:** „meistens bei uns“ oder „meistens woanders“.
- **Regeln** (beliebig viele): *da* oder *nicht da*, **jede Woche oder alle 2, 3, 4 Wochen**, von Tag + Uhrzeit bis Tag + Uhrzeit. Zum Beispiel:
  - nicht da – jede Woche – ab **Mi 14:00 bis Do 08:00** (ein Tag unter der Woche beim anderen Elternteil)
  - nicht da – alle 2 Wochen – ab **Fr 15:00 bis So 18:00** (jedes zweite Wochenende)
  - oder umgekehrt: meistens woanders, da – alle 2 Wochen – ab **Fr 12:00 bis Mi 12:00**
- **Ferienregelung** je Ferienart (Sommer, Herbst, Weihnachten, Winter, Ostern, Pfingsten): Regeln gelten weiter, ganz bei uns, ganz beim anderen Elternteil, erste oder zweite Hälfte, **erste oder letzte … Wochen bei uns** (z. B. die ersten 3 von 6,5 Wochen Sommerferien). Auf Wunsch **jährlich wechselnd** und mit eigenen Übergabezeiten.
- **Ausnahmen:** einzelne Zeiträume „da“ oder „nicht da“, z. B. ein getauschtes Wochenende – sie gelten vor allem anderen.
- **Vorschau** der nächsten 8 Wochen direkt im Editor (🔄 Vorschau).

Ist das Kind nicht da, gibt es **keine Aufgaben, keine Erinnerungen und kein „verpasst“**, die 🔥-Serie bleibt erhalten, „Im Wechsel“ überspringt das Kind, und die Morgen-Ansage lässt es aus. An Tagen mit Kommen und Gehen erscheinen nur Aufgaben, deren Zeitfenster in die Zeit fällt, in der das Kind da ist. Die Kinder-Ansicht zeigt „👋 Bis bald! Wieder da: Fr 23.10. ab 12:00 Uhr“. Die Ferienregelung nutzt die Schulferien – dafür unter ⚙️ Einstellungen → 🏖️ Urlaub & Ferien Land und Region wählen.

<img src="https://raw.githubusercontent.com/Chrism1412/yippee-kids-chores-card/main/images/anwesenheit.png" width="300" alt="Anwesenheit">

### Joker 🃏 (optional)

Unter **⚙️ Einstellungen → 🧩 Zusatzfunktionen → 🃏 Joker** einschalten und unter **🎁 Belohnungen** die Vorlage „🃏 Joker: eine Aufgabe auslassen“ anlegen (Standard 30 ⭐). Löst ein Kind den Joker ein, erscheint bei ihm der Knopf **🃏 Joker ×1**. Damit wählt es eine heutige Pflicht-Aufgabe aus, die es auslassen möchte: keine Sterne, aber auch keine Minuspunkte, und die Serie 🔥 bleibt erhalten. Du bekommst eine Nachricht, und der Einsatz steht im Änderungsprotokoll. Jede eigene Belohnung lässt sich mit dem Haken „🃏 Ist ein Joker“ ebenfalls zum Joker machen.

### Schulnoten 🎓 (optional)

Unter **⚙️ Einstellungen → 🧩 Zusatzfunktionen → 🎓 Schulnoten** einschalten.

- **Note eintragen:** unter **👧 Kinder** mit 🎓 – Fach aus der Schnellauswahl (Mathe, Deutsch, Englisch, Sachunterricht …) oder frei eintippen, dazu die Note
- **Sterne automatisch nach Notentabelle** – passend zum Land eingestellt, frei änderbar:

  | Notenskala | Länder (automatisch) | Sterne (Standard) |
  |---|---|---|
  | 1–6, 1 = sehr gut | Deutschland | 1 → 10 · 2 → 6 · 3 → 3 |
  | 1–5, 1 = sehr gut | Österreich, Tschechien, Slowakei | 1 → 10 · 2 → 6 · 3 → 2 |
  | 1–6, 6 = sehr gut (halbe Noten) | Schweiz, Liechtenstein | 6 → 10 · 5,5 → 8 · 5 → 6 · 4,5 → 3 · 4 → 1 |
  | 1–6, 6 = sehr gut | Polen | 6 → 10 · 5 → 7 · 4 → 4 · 3 → 1 |
  | 1–5, 5 = sehr gut | Ungarn, Kroatien, Slowenien, Estland … | 5 → 10 · 4 → 6 · 3 → 2 |
  | 2–6, 6 = sehr gut | Bulgarien | 6 → 10 · 5 → 6 · 4 → 2 |
  | 1–10, 10 = sehr gut | Italien, Spanien, Niederlande, Rumänien … | ≥ 9 → 10 · ≥ 8 → 6 · ≥ 7 → 3 · ≥ 6 → 1 |
  | 0–20, 20 = sehr gut | Frankreich, Portugal | ≥ 18 → 10 · ≥ 16 → 8 · ≥ 14 → 6 · ≥ 12 → 3 · ≥ 10 → 1 |
  | 0–100 % | Belgien, Luxemburg, Irland, Schweden … | ≥ 90 → 10 · ≥ 80 → 6 · ≥ 70 → 3 · ≥ 60 → 1 |

  Schlechtere Noten geben 0 Sterne – **es werden nie Sterne abgezogen**.
- **📈 Verbesserungs-Bonus** (Standard +3 ⭐): wenn die Note besser ist als die letzte im selben Fach
- **📜 Zeugnis-Bonus** (Standard 20 ⭐): statt einer Einzelnote „Zeugnis“ ankreuzen
- **Kinder melden selbst:** mit 🎓 auf ihrer Karte, auf Wunsch mit **Foto der Arbeit**. Du gibst unter 🔔 Freigaben frei – oder direkt per **Push- oder Telegram-Knopf**. Das Foto wird nach der Entscheidung gelöscht.
- **📊 Notenübersicht** je Kind und Fach: Schnitt, Anzahl, letzte Note und Trend 📈/📉
- Noten-Sterne zählen wie alle verdienten Sterne für **Level** und **Familienziel**

### Für Eltern
- **Benehmen** 😊 (optional): im Heute-Tab mit einem Tipp „Artig“ belohnen (Sterne einstellbar), auf Wunsch auch 😠 „Unartig“ mit Abzug – alles im Punkte-Verlauf
- **Freigabe** von Aufgaben und Einlösungen – in der Karte, per Push-Knopf oder Telegram-Knopf
- **Minuspunkte nur nach Entscheidung**: verpasst = „entschuldigt“, „Minuspunkte“ oder „doch erledigt“
- Punkte von Hand anpassen, **Punkte-Verlauf** pro Kind, **Monatsstatistik**
- **Taschengeld**: Sterne in Euro umrechnen und auszahlen
- **Doppelte-Punkte-Tage**
- **Urlaub** für alle oder einzelne Kinder, **Schulferien und Feiertage** automatisch
- **Tagesabschluss** am Abend und **Wochenrückblick** am Sonntag als Nachricht
- **Morgen-Ansage** und **Erinnerungen** über Lautsprecher

### Sicherheit und Daten
- Automatische **Sicherungen** (auch in eine zweite Liste), Sicherungsdatei zum Herunterladen
- **Datenprüfung**: warnt, wenn Einträge fehlen oder außerhalb der Karte verändert wurden
- **Papierkorb** (30 Tage) und **Änderungsprotokoll** (wer hat wann was geändert)
- **Eltern = ausgewählte Home-Assistant-Benutzer**, **PIN** mit Sperre nach Fehlversuchen

## Voraussetzungen

- **Home Assistant 2024.10** oder neuer
- Die Integration **„Lokale To-do-Liste“** (in Home Assistant enthalten)
- Optional, je nach gewünschten Funktionen: Home-Assistant-App, Telegram-Bot, TTS-Integration, Kalender-Integration für den Müllkalender

## Installation

### Über HACS (empfohlen)

1. HACS öffnen → oben rechts ⋮ → **Benutzerdefinierte Repositories**
2. Repository: `https://github.com/Chrism1412/yippee-kids-chores-card` · Typ: **Dashboard** → **Hinzufügen**
3. **Yippee! - Kids Chores** suchen → **Herunterladen**
4. Seite neu laden (in der App: nach unten ziehen bzw. App neu starten)

HACS legt die Ressource automatisch an.

### Von Hand

1. Die Datei [`dist/yippee-kids-chores-card.js`](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/dist/yippee-kids-chores-card.js) aus dem [neuesten Release](https://github.com/Chrism1412/yippee-kids-chores-card/releases/latest) herunterladen.
2. In Home Assistant den Ordner **`/config/www/community/yippee-kids-chores-card/`** anlegen und die Datei dort hineinkopieren (z. B. mit dem Add-on *File editor* oder *Samba share*).
   Das ist derselbe Ordner, den auch HACS verwendet – ein späterer Wechsel zu HACS klappt dadurch ohne Umbau.
3. **Einstellungen → Dashboards → ⋮ (oben rechts) → Ressourcen → Ressource hinzufügen**
   - URL: `/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?v=1.3.1`
   - Typ: **JavaScript-Modul**
4. Seite neu laden.

> **Updates von Hand:** Neue Datei an dieselbe Stelle kopieren – fertig. Die Karte erhöht die Zahl hinter `?v=` in der Ressource automatisch, sobald ein Administrator den Eltern-Bereich öffnet, und bietet dann das Neuladen an (siehe [Updates](#updates)).

## Einrichtung

### 1. Speicher anlegen

**Einstellungen → Geräte & Dienste → Integration hinzufügen → „Lokale To-do-Liste“** → Name: **`Yippee Kids Chores`**

Daraus entsteht die Entität `todo.yippee_kids_chores`. Diese Liste ist der Speicher der Karte – bitte die Einträge darin nicht von Hand bearbeiten (siehe [Wie werden die Daten gespeichert?](#wie-werden-die-daten-gespeichert)).

### 2. Karten anlegen

Dashboard bearbeiten → **Karte hinzufügen** → **Yippee! - Kids Chores** suchen. Der visuelle Editor fragt Speicher, Ansicht und Kind ab. Oder per YAML:

**Eltern-Ansicht**
```yaml
type: custom:yippee-kids-chores-card
storage: todo.yippee_kids_chores
mode: admin
```

**Alle Kinder** (neue Kinder erscheinen von selbst; Familienziel oben, Kinder darunter)
```yaml
type: custom:yippee-kids-chores-card
storage: todo.yippee_kids_chores
mode: kids
```

**Ein einzelnes Kind** (z. B. für das Tablet im Kinderzimmer)
```yaml
type: custom:yippee-kids-chores-card
storage: todo.yippee_kids_chores
mode: kid
child: Mia
```

> Tipp: Die Kinder-Ansicht wirkt am besten in einer Ansicht vom Typ **Panel** (eine Karte über die ganze Breite). Ein vollständiges Beispiel-Dashboard liegt unter [`examples/dashboard.yaml`](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/examples/dashboard.yaml).

### 3. In der Eltern-Ansicht loslegen

1. **👧 Kinder** – Kinder anlegen (Name, Emoji, Farbe, **Geburtstag**). Mit 💡 schlägt die Karte aus der Datenbank mit 163 Vorlagen alle altersgerechten Aufgaben vor.
2. **✅ Aufgaben** – Aufgaben anlegen oder aus den Vorlagen wählen.
3. **🎁 Belohnungen** – Belohnungen mit ihrem Preis in Sternen anlegen.
4. **⚙️ Einstellungen** – Sprache, Benachrichtigungen, Freigabe, Zusatzfunktionen usw. Alle Einstellungen gelten automatisch für alle Kinder-Karten und Geräte.

## Karten-Optionen

| Option | Werte | Standard | Beschreibung |
|---|---|---|---|
| `storage` | `todo.…` | – | **Pflicht.** Die Lokale To-do-Liste als Speicher |
| `mode` | `admin`, `kids`, `kid` | `admin` | Eltern-Ansicht, alle Kinder oder ein Kind |
| `child` | Name | – | Nur bei `mode: kid`: welches Kind |
| `collapsed` | `true` / `false` | `false` | Kinder eingeklappt (nur Name und Punkte) anzeigen |
| `family` | `true` / `false` | automatisch | Familienziel auf dieser Karte zeigen. Automatisch erscheint es nur einmal pro Seite |
| `language` | z. B. `en`, `fr` | Einstellung bzw. Sprache von Home Assistant | Eigene Sprache nur für dieses Gerät |
| `pin` | Ziffern | – | Ältere Variante der PIN. Besser in den Einstellungen unter 🔒 Zugriffsschutz festlegen |
| `pin_minutes` | Zahl | `5` | Nach so vielen Minuten ohne Bedienung wird der Eltern-Bereich wieder gesperrt |

Alles andere stellst du in der Karte selbst unter **⚙️ Einstellungen** ein.

## Integrationen

Alle Integrationen sind **optional** und lassen sich in den Einstellungen einzeln ein- und ausschalten.

### Benachrichtigungen: Home-Assistant-App

Unter **📱 Benachrichtigungen an** die Handys auswählen. Die Eltern bekommen Nachrichten, wenn

- ein Kind eine Aufgabe erledigt hat (zum Freigeben),
- ein Kind eine Belohnung einlösen möchte oder sich etwas wünscht,
- eine Aufgabe mit Minuspunkten verpasst wurde,
- der Tagesabschluss oder Wochenrückblick fällig ist.

**Knöpfe direkt in der Nachricht** (✓ Freigeben / ✕ Ablehnen, 🙂 Entschuldigt / −2 ⭐ / ✓ Erledigt): Unter **✓ Knöpfe & Telegram-Befehle** einmal auf **⚙️ Automatisch anlegen** tippen (als Administrator). Die Karte legt dafür eine kleine Automation an; das YAML steht zum Nachlesen bzw. manuellen Anlegen ebenfalls dort.

### Telegram

Voraussetzung: die Integration **Telegram bot** mit mindestens einem Chat.

- Telegram-Chats erscheinen unter **📱 Benachrichtigungen an** in einer eigenen Gruppe.
- **📨 Freigabe-Knöpfe mitsenden**: Freigeben und Ablehnen direkt im Chat. Die passende Automation legt die Karte auf Knopfdruck an.
- **📨 Telegram-Test mit Knöpfen** prüft, ob Telegram die Knöpfe annimmt, und zeigt sonst die Fehlermeldung.
- **💬 Telegram-Befehle** im Chat:
  - `/punkte` – Punktestand aller Kinder (mit Sparziel)
  - `/offen` – was heute noch fehlt
  - `/hilfe` – Übersicht der Befehle
- Foto-Nachweise werden als Bild mitgeschickt (bei Fotos von Konten ohne Admin-Rechte steht stattdessen „Foto in der Karte ansehen“).

### Sprachausgabe: TTS und Alexa

Unter **🔊 Sprachausgabe**:

- **TTS-Integration** (z. B. *Google Translate text-to-speech*, *Piper*, *Home Assistant Cloud*) und Lautsprecher auswählen, **oder**
- ein **Alexa-Gerät** über die HACS-Integration *Alexa Media Player*.

Damit gibt es

- 🌅 **Morgen-Ansage**: „Guten Morgen Mia! Heute stehen an: Zähne putzen, Bett machen und Müll rausbringen (Gelber Sack).“ – auf Wunsch nur Montag bis Freitag, nicht im Urlaub und nicht an Feiertagen,
- ⏰ **Erinnerungen** kurz vor Ende eines Zeitfensters: „Ben, bitte noch Zähne putzen erledigen – nur noch 15 Minuten!“

### Müllkalender: Waste Collection Schedule & Co.

Aufgaben wie „Müll rausbringen“ können ihre Termine **automatisch aus einem Home-Assistant-Kalender** holen. Einschalten unter **🧩 Zusatzfunktionen → 🗑️ Müllkalender**, dann bei der Aufgabe **Wann? → 🗑️ Müllkalender** wählen.

Geeignete Kalender-Quellen:

- **[Waste Collection Schedule](https://github.com/mampfes/hacs_waste_collection_schedule)** (HACS) – unterstützt hunderte Entsorger in Deutschland, Österreich, der Schweiz und vielen weiteren Ländern
- **Fernkalender** (in Home Assistant enthalten) mit dem ICS-Link deines Entsorgers bzw. deiner Abfall-App
- **Lokaler Kalender** mit selbst eingetragenen Terminen
- jede andere Integration, die eine `calendar.*`-Entität liefert

Pro Aufgabe einstellbar:

- **Welche Abfuhren** (Stichworte, z. B. `Restmüll, Gelber Sack` – leer = alle Termine)
- **🌙 Schon am Vorabend** – die Aufgabe erscheint einen Tag vor der Abholung, zum Rausstellen
- Auf der Kachel und in der Morgen-Ansage steht, was abgeholt wird (z. B. „Müll rausbringen (Papier)“).

### Schulferien und Feiertage

Unter **🏖️ Urlaub & Ferien** Land und Region (z. B. Bundesland oder Département) wählen. Die Karte holt Schulferien und Feiertage dann **selbst** und hält sie aktuell:

- Quelle: **[OpenHolidays API](https://www.openholidaysapi.org)** – kostenlos, **ohne API-Schlüssel**, 36 Länder (u. a. ganz Europa)
- **Ausweichlösung**, falls der Abruf nicht klappt: die Integration **Holiday** (in Home Assistant enthalten) für Feiertage und ein Ferien-Kalender, z. B. über ICS oder HACS
- An Feiertagen aufgabenfrei (Standard), in den Schulferien wahlweise ganz aufgabenfrei oder nur Aufgaben mit „🎒 Nur an Schultagen“ pausieren
- Zusätzlich eigene **Urlaubszeiträume** für alle oder einzelne Kinder (z. B. Klassenfahrt)

### Sensoren für eigene Automationen

Für jedes Kind entsteht ein Sensor `sensor.yippee_<name>` (Zustand = Punktestand) mit den Attributen

`heute_erledigt`, `heute_gesamt`, `alles_erledigt`, `offen`, `wartet_auf_freigabe`, `level`, `level_name`, `gesamt_verdient`, `abzeichen`, `ziel`, `urlaub`, `anwesend`, `feiertag`, `ferien` und – mit Taschengeld – `euro`.

Beispiel: Fernseher erst, wenn alles erledigt ist

```yaml
alias: Fernseher erst nach den Aufgaben
triggers:
  - trigger: state
    entity_id: media_player.wohnzimmer_tv
    to: "on"
conditions:
  - condition: template
    value_template: "{{ not state_attr('sensor.yippee_mia', 'alles_erledigt') }}"
actions:
  - action: tts.speak
    target:
      entity_id: tts.google_translate_de_de
    data:
      media_player_entity_id: media_player.wohnzimmer
      message: "Mia, erst noch deine Aufgaben erledigen!"
```

> Die Sensoren werden aktualisiert, solange die Karte bei einem Administrator geöffnet ist (z. B. auf dem Wand-Tablet). Nach einem Neustart von Home Assistant erscheinen sie wieder, sobald die Karte geöffnet wird.

### Hintergrund-Automation

Normalerweise rechnet die Karte im Browser. Mit **🌙 Hintergrund-Automation** laufen

- Morgen-Ansage und Erinnerungen,
- Verpasst-Meldungen mit Knöpfen,
- Tagesabschluss,
- Telegram-Befehle `/punkte`, `/offen`, `/hilfe`

direkt in Home Assistant – **auch wenn nirgends eine Karte geöffnet ist**. Die Karte schreibt dafür einen Plan für die nächsten 14 Tage in die Liste und legt die Automation auf Knopfdruck selbst an. Ändern sich Uhrzeiten, passt sie die Automation automatisch an.

Weiterhin nur mit geöffneter Karte: Punkte buchen (Freigaben und Minuspunkte über Knöpfe werden nachgeholt, sobald eine Karte offen ist), Wochenrückblick und Geburtstag.

## Datensicherheit

Unter **💾 Datensicherung**:

| Schutz | Was er tut |
|---|---|
| **Sicherungsdatei** | Alles (Kinder, Aufgaben, Belohnungen, Punkte, Verlauf, Einstellungen) als `YippeeKidsChoresTTMMJJJJ.json` herunterladen, teilen oder kopieren – und wieder einspielen |
| **Automatische Sicherung** | Täglich oder wöchentlich, die letzten 4 bleiben erhalten (gepackt, wenige KB) |
| **Zweite Liste** | Empfohlen: eine zweite Lokale To-do-Liste (z. B. „Yippee Sicherung“) auswählen. Wird die Hauptliste gelöscht, bleiben die Sicherungen dort erhalten |
| **🛡️ Datenprüfung** | Jeder Eintrag hat eine Prüfsumme. Fehlen Einträge oder wurden sie außerhalb der Karte verändert, erscheint eine Warnung mit „Aus Sicherung zurückholen“ |
| **🗑️ Papierkorb** | Gelöschte Kinder, Aufgaben und Belohnungen 30 Tage lang einzeln zurückholen |
| **📜 Änderungsprotokoll** | Wer hat wann freigegeben, Punkte geändert, eingelöst, gelöscht oder wiederhergestellt |
| **Home-Assistant-Sicherung** | Die Lokale To-do-Liste ist in jeder normalen Home-Assistant-Sicherung enthalten |

## Zugriffsschutz

Unter **🔒 Zugriffsschutz**:

- **Wer ist Eltern?** Personen aus Home Assistant auswählen. Nur diese sehen den Eltern-Bereich und dürfen freigeben, Punkte ändern und einlösen – auf jedem Gerät. Auch Knöpfe in der Handy-App werden geprüft: Ein Kind kann sich nicht selbst freigeben.
- **PIN** (4–8 Ziffern) für den Eltern-Bereich, gespeichert nur als Prüfwert (nicht im Klartext). Nach 5 Fehlversuchen ist der Bereich auf diesem Gerät 5 Minuten gesperrt.

> **Empfehlung:** Kinder bekommen in Home Assistant ein eigenes Konto **ohne Administrator-Rechte**. Home Assistant kennt keine Rechte pro Liste – wer Administrator ist, kann grundsätzlich alles ändern. Änderungen an der Liste von außen erkennt die Datenprüfung.

## Sprachen

Die Karte bringt **25 Sprachen** mit, alle in der einen Datei:

Deutsch · Schwiizerdütsch · English · Français · Italiano · Español · Português · Nederlands · Dansk · Svenska · Suomi · Eesti · Latviešu · Lietuvių · Polski · Čeština · Slovenčina · Slovenščina · Hrvatski · Magyar · Română · Български · Ελληνικά · Malti · Gaeilge

Standard ist die Sprache deines Home-Assistant-Benutzers. Unter **🌐 Sprache** lässt sie sich für alle Geräte festlegen, mit der Option `language` auch für ein einzelnes Gerät. Feiertags- und Feriennamen kommen in der gewählten Sprache, sofern der Datendienst sie anbietet.

## Updates

Unter **⬆️ Updates** und oben im Eltern-Bereich:

- **Update verfügbar:** Kennt HACS eine neuere Version, erscheint ein Hinweis mit Link zu den Neuerungen.
- **Ressource automatisch erhöhen:** Liegt nach einem Update eine neuere Datei auf dem Server als die, die gerade im Browser läuft, trägt die Karte die neue Version **selbst** in die Ressource ein (`?v=1.3.1` usw.), sobald ein Administrator den Eltern-Bereich öffnet. Danach erscheint „Neue Version ist bereit“ mit einem Knopf zum Neuladen. Bei Installation über HACS erledigt HACS das Umstellen; die Karte bietet dann nur das Neuladen an.
- Wer das nicht möchte, schaltet unter ⬆️ Updates „Ressource nach einem Update automatisch erhöhen“ aus – dann erinnert die Karte nur und stellt auf Knopfdruck um.

Die Änderungen jeder Version stehen im [CHANGELOG](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/CHANGELOG.md).

## Datenschutz

- Alle Daten bleiben in deinem Home Assistant. Es gibt kein Konto, keine Cloud und keine Statistik-Übertragung.
- Die einzige Verbindung ins Internet ist der optionale Abruf von Schulferien und Feiertagen bei der OpenHolidays API – nur wenn du ein Land auswählst. Dabei wird nur Land und Zeitraum abgefragt.
- Fotos für den Foto-Nachweis landen im Medien-Ordner von Home Assistant (Admin-Konto) bzw. verkleinert in einer To-do-Liste (Konto ohne Admin-Rechte) und werden nach der Entscheidung der Eltern gelöscht.

## Wie werden die Daten gespeichert?

Jeder Datensatz ist ein Eintrag in der Lokalen To-do-Liste: der Titel ist ein Schlüssel wie `kp|kid|ab12cd34`, die Beschreibung enthält die Daten als JSON. Dadurch

- braucht es keine eigene Integration und keine Datenbank,
- sind die Daten in jeder Home-Assistant-Sicherung enthalten,
- sehen alle Geräte Änderungen sofort.

**Bitte die Einträge nicht in der To-do-Liste bearbeiten, abhaken oder löschen.** Falls es doch passiert, meldet sich die Datenprüfung.

## Grenzen

- **Rechte:** Home Assistant kennt keine Rechte pro Entität. PIN und Eltern-Liste schützen die Karte, aber nicht die To-do-Liste selbst (siehe [Zugriffsschutz](#zugriffsschutz)).
- **Punkte buchen** passiert in der Karte. Ist nirgends eine Karte geöffnet, werden Freigaben und Minuspunkte aus Knöpfen nachgeholt, sobald wieder eine Karte offen ist.
- **Viele Kinder:** Optimal für 1–4 Kinder, gut bis etwa 6, möglich bis etwa 10.

## Häufige Fragen

<details>
<summary><b>Die Karte zeigt nach einem Update noch die alte Version.</b></summary>

Browser und App halten JavaScript-Dateien hartnäckig im Zwischenspeicher. Die Karte erhöht die Ressourcen-Version nach einem Update normalerweise selbst – den Eltern-Bereich einmal als Administrator öffnen und auf „Jetzt neu laden“ tippen. Klappt das nicht, in der Ressource die Zahl hinter `?v=` von Hand erhöhen. In der App hilft notfalls: Einstellungen der App → Companion App → Fehlerbehebung → Frontend-Cache zurücksetzen.
</details>

<details>
<summary><b>„Speicher nicht gefunden“ bzw. die Karte zeigt eine Einrichtungsanleitung.</b></summary>

Die unter `storage:` eingetragene Liste existiert nicht. Lokale To-do-Liste anlegen (siehe [Einrichtung](#1-speicher-anlegen)) und den Namen der Entität prüfen.
</details>

<details>
<summary><b>Die Knöpfe in der Benachrichtigung tun nichts.</b></summary>

Unter ⚙️ Einstellungen → ✓ Knöpfe & Telegram-Befehle die passende Automation anlegen (als Administrator). Ausgeführt wird die Freigabe, sobald irgendwo eine Karte geöffnet ist – oder sofort, wenn die Hintergrund-Automation aktiv ist.
</details>

<details>
<summary><b>Telegram-Nachrichten kommen ohne Knöpfe an.</b></summary>

Beim Chat „📨 Freigabe-Knöpfe mitsenden“ anhaken und mit „📨 Telegram-Test mit Knöpfen“ prüfen – die Karte zeigt die Fehlermeldung von Telegram an. Außerdem muss die Freigabe eingeschaltet sein, sonst gibt es nichts freizugeben.
</details>

<details>
<summary><b>Das Familienziel erscheint doppelt.</b></summary>

Es erscheint automatisch nur einmal pro Seite. Bei mehreren Kinder-Karten auf einer Seite lässt es sich mit `family: false` bzw. `family: true` gezielt steuern.
</details>

<details>
<summary><b>Kann ich die Daten auf ein anderes System umziehen?</b></summary>

Ja: 💾 Datensicherung → ⬇️ Herunterladen, auf dem neuen System die Karte einrichten und ♻️ Wiederherstellen.
</details>

## Lizenz

[MIT](https://github.com/Chrism1412/yippee-kids-chores-card/blob/main/LICENSE) © 2026 Chrism1412

Feiertags- und Feriendaten: [OpenHolidays API](https://www.openholidaysapi.org).
