# Changelog

🇬🇧 [English version](CHANGELOG.en.md)

Alle wichtigen Änderungen an **Yippee! - Kids Chores**.
Versionsnummern: `MAJOR.MINOR.PATCH` – Fehlerbehebungen erhöhen PATCH, neue Funktionen MINOR, grundlegende Änderungen (z. B. am Speicherformat) MAJOR.

## [2.0.0] – 2026-11-17

Die bisher größte Version – mit Neuem in allen Bereichen: 🐾 Haustier mit eigenem Zuhause, 🎮 Mini-, Lern- und Fragenspiele, 🗺️ Abenteuer, 📺 Bildschirmzeit, 💰 Taschengeld, 📱 Kinder-Ansicht, 🧩 übersichtliche Einstellungen, 📖 Handbuch in Kapiteln und vieles mehr.
**Keine Umstellung nötig** – alles Neue ist optional und muss erst eingeschaltet werden. Bestehende Daten und Einstellungen bleiben, wie sie sind.

### 🐾 Ein Haustier für jedes Kind
Ein animiertes Haustier, das mit den Aufgaben wächst (einschalten unter ⚙️ Einstellungen → ⚙️ Allgemein → 🐾 Haustier, dann im neuen Tab 🐾 Haustier je Kind mit „🐾 an“).
- **7 Figuren:** 🐶 Hund, 🐱 Katze, 🦖 Dino, 🦄 Einhorn, 🐦 Vogel, 🦸 Superheld und 🧚 Fee – alles im Code gezeichnet, keine Bilddateien. Bei Held und Fee wählt das Kind Hautfarbe, Haarfarbe, Frisur (der Held auch mit Zopf) und die Farben von Anzug und Umhang bzw. Kleid und Flügeln.
- **Wächst mit den Sternen:** 🥚 Ei (📦 Heldenkiste, 🌷 Knospe) → Baby → Jung → Groß mit Krone 👑. Tempo einstellbar, es schrumpft nie und wird nie krank.
- **Lebendig:** blinzelt, wedelt, atmet, schaut sich um, gähnt, niest, dreht sich, Flügel flattern, Mähne weht. Freudensprung beim Abhaken, Jubel bei Belohnungen, Konfetti beim neuen Level, schläft nachts und im Urlaub.
- **Gelangweilt und traurig:** Sind Aufgaben offen, ist es gelangweilt; am Nachmittag (einstellbar) traurig mit Träne und zeigt die offenen Aufgaben – nur angezeigt, nie vorgelesen. Die Träne lässt sich abschalten.
- **Streicheln, Füttern, Spielen, Anziehen:** Streicheln und Anziehen gehen immer, Füttern, Spielen und Spiele werden freigeschaltet nach % der Aufgaben (Standard 50 %), nach X erledigten Aufgaben oder X Sternen heute, nach bestimmten Aufgaben (entschuldigte oder von Geschwistern erledigte zählen als geschafft) oder immer – je Kind abweichend einstellbar. Bei „nach bestimmten Aufgaben“ wählst du oben ein Kind und siehst nur seine Aufgaben.
- **🎟️ Freispiel-Gutschein als Belohnung:** einlösbar, sobald die Spiele freigeschaltet sind; Freispiele zählen nach dem Tageslimit, auch für Abenteuer-Level, und verfallen nie. Je Kind wählbar: Ein Neustart nach „alle Herzen weg“ zählt wie ein neues Level.
- **Übersichtliche Knöpfe:** Oben die Pflege (🤚 Streicheln, Füttern, Zusammen spielen, 👕 Anziehen), darunter zwei große Kacheln: 🕹️ **Spielhalle** (Mini-Spiele & Abenteuer) und 🏠 **Zuhause** mit dem Taler-Stand.
- **🍎 Füttern pro Tag** einstellbar (1–10, Standard 3, auch je Kind) – zwischen zwei Mahlzeiten mindestens 5 Minuten.
- **Zubehör** mit den Leveln, 🎅 Mütze im Dezember, 🥳 Partyhut am Geburtstag und 🌦️ Wetter aus Home Assistant (Schirm, Schal, Sonnenbrille).
- **🥚 Neues Ei:** das alte Tier kommt in die 📸 Erinnerungen.
- **💤 Schlafenszeit:** Schläft das Tier, gibt es keine Knöpfe – nur den Hinweis, wann es aufwacht. Spiel-Aufgaben gehen trotzdem. Bei Regen hält es einen ☂️ Schirm über den Kopf.

### 🎨 Eigenes Haustier mit KI
- Im Tab 🐾 Haustier → **🎨 Eigene Haustiere**: beschreiben, was es sein soll (z. B. „rosa Schwein mit Ringelschwanz“), **🤖 Prompt kopieren** und in ChatGPT, Gemini, Claude oder Copilot einfügen.
- Die Antwort der KI (ein JSON mit den Bauteilen als SVG) einfügen oder als Datei öffnen – sofort erscheint eine Vorschau in allen Stimmungen. Augen, Mund, Hut und Schal lassen sich mit **Feinjustieren** zurechtschieben.
- Augen, Mund, Wangen und Träne zeichnet die Karte selbst: Auch das eigene Tier blinzelt, freut sich, weint, wächst vom Ei bis groß, wedelt, trägt Zubehör und spielt die Mini-Spiele mit.
- Für alle Kinder oder nur für bestimmte. Liegt in der Yippee-Liste und ist in der Sicherung.
- **Sicher:** Die Karte übernimmt nur reine Zeichen-Elemente – keine Skripte, keine Links, keine Stile, keine fremden Verweise. Es wird kein Code ausgeführt.

### 🎮 Mini-Spiele
- Ein eigenes Spiel je Figur (🦴 Leckerli fangen, 🐭 Mäuse fangen, 🌵 Hüpfen, ⭐ Sterne sammeln, 🎵 Lied nachspielen, ✨ Glühwürmchen fangen) plus 🧠 Memory, 🔢 Zählen, 🧮 Rechnen (nach Klasse) und 🏃 Mach's nach (Bewegung).
- Freizeit-Spiele bringen keine Sterne, nur einen 🏆 Rekord – mit Tageslimit (Standard 3).
- **Neue Lernspiele:** 🕐 Uhr lesen, 🔤 Buchstaben & Wörter (27 Sprachen), 💰 Geld zählen (Währung der Karte), 🧩 Schiebe-Puzzle mit dem eigenen Haustier in 3×3 oder 4×4 (antippen oder in die Lücke wischen, mit Vorlage, 💡 Tipp, 🔀 Neu mischen und 🔢 Zahlen an/aus), 🌈 Farben merken mit ★ ● ▲ ■ Formen (auch ohne Farbsehen spielbar).
- **🎲 Abwechslung:** Jedes Lernspiel mischt mehrere Fragearten (gleiche Art nie zweimal hintereinander) – 🕐 Uhr: ablesen, passende Uhr finden, „Wie spät ist es in … Minuten?“, „Wie lange dauert es?“ und 24-Stunden-Zeit · 🔢 Zählen: zählen, Gruppe finden, „Wo sind mehr?“, „Wie viele fehlen bis 10?“ · 🧮 Rechnen: Ergebnis, fehlende Zahl, „Welche Aufgabe ergibt …?“ · 🔤 Buchstaben: Anfangs-, End- und fehlender Buchstabe, Bild zum Buchstaben, Rechtschreibung · 💰 Geld: zählen, passendes Geld finden, Wechselgeld.
- **🧠 Memory** mit 6, 8 oder 10 Paaren – je nach Schwierigkeit des Kindes – oder fest 6–12 Paare; neben gleichen Bildern auch Zahl ↔ Punkte, Groß ↔ klein und Englisch ↔ Bild.
- **🏃 Mach's nach** mit 20 Bewegungen.
- **📊 Lernstatistik je Kind** (abschaltbar): unter ✎ beim Kind je Lernspiel richtig gelöst, Lösung gezeigt und Treffer beim 1. Versuch – dieser Monat und 6 Monate.
- **🧩 Fragen-Spiele:** 🏰 **Labyrinth** (eine Ritterburg mit Steinmauern, flackernden 🔥 Fackeln und 🛡️ Schilden; mit dem Steuerkreuz vom 🚪 Burgtor zum 👑 Thronsaal – 📜 Schriftrollen mit Fragen tauchen erst auf, wenn man ganz nah ist), 🚂 **Zugfahrt** (die richtige Antwort stellt die Weiche), 🏴‍☠️ **Schatzkarte** (eine Piraten-Schatzkarte auf Pergament mit Schiffswrack, Piratenschiff, Kraken, Hai, Kompassrose und Totenkopf-Felsen, das Haustier mit Piratenhut, Ziel ist die Schatztruhe am roten ✕, auf fast jedem Feld eine Frage, 🏖️ Rastplätze zum Verschnaufen; würfeln – richtig = 2 Felder vor, allein oder zu zweit) , 🐸 **Seerosen-Hüpfen** (ein Teich mit Schilf, Seerosen-Blüten und herumschwimmenden 🐟 Fischen und 🦆 Ente – auf das Seerosenblatt mit der richtigen Antwort springen, auch mit Einmaleins), 🚀 **Weltraum** (drei Planeten mit Antworten im Sternenhimmel – die Rakete fliegt zum gewählten Planeten) und 🦕 **Dino-Ausgrabung** (den Stein mit der richtigen Antwort freiklopfen – jeder Knochen kommt ans Skelett, nach 6 Knochen steht der Dino). Die Fragen kommen aus Rechnen, Zählen, Buchstaben, Uhr und Geld – passend zur Klasse. Jede Frage hat genau einen Versuch: falsch ist falsch, die Lösung wird kurz gezeigt. Unten stehen „✅ richtig/gestellt“ und die ⭐ aus richtigen Antworten.
- **🔊 Vorlesen:** In jedem Spiel liest ein Lautsprecher-Knopf die Frage vor.
- **🔄 Spielstände zurücksetzen** (✎ beim Kind im Tab 🐾): Rekorde einzelner Spiele, das Abenteuer oder „heute gespielt“ – praktisch zum Testen.
- **🎮 Spiel als Aufgabe:** Im Aufgaben-Editor wählbar (Rechnen, Zählen, Uhr, Wörter, Geld, Memory, Mach's nach) – ist das Ziel erreicht, wird die Aufgabe abgehakt.
- **🔁 Spiel-Aufgabe „Wie oft spielbar“** (1–5× pro Tag): geht immer, auch wenn die Spiele gesperrt sind; nach der ersten geschafften Runde nur noch üben, ohne Sterne.
- **🔢 Fragen pro Runde je Kind** (3–30, Standard 5) und bei „Spiel als Aufgabe“ wahlweise **„Anzahl wie beim Kind“** – eine gemeinsame Aufgabe, aber 7 Rechenaufgaben für die Kleine und 15 für den Großen.
- **Punkte nur für richtige Antworten:** 1–3 Versuche pro Frage (Standard 1). Sind sie aufgebraucht, zeigt das Spiel die Lösung und stellt die nächste Frage – Raten bringt nichts.
- **🔁 Fehler später wiederholen:** Aufgaben mit gezeigter Lösung kommen später noch einmal – jede 2. Frage –, bis sie sitzen (je Kind auf dem Gerät, abschaltbar). In der 📊 Lernstatistik unter ✎ steht dazu **„🔁 Oft falsch“**: welche Fragen ein Kind am häufigsten falsch hatte (z. B. „7 × 8 = ? → 56“) – richtig gelöst zählt eins runter.
- **🎯 Tages-Challenge** (abschaltbar): Oben in der Spielhalle steht jeden Tag ein anderes Spiel je Kind (im Menü mit 🎯 markiert) mit Fortschritt. Wer es zweimal spielt, bekommt 🪙 Taler – Standard 10, je Kind unter ✎ änderbar.
- **🕹️ Spiele und 🗺️ Abenteuer-Level pro Tag je Kind** (✎ beim Kind, optional): z. B. die Kleine 3 Spiele am Tag, der Große 5 – leer = wie in den Einstellungen.
- **📱 Querformat:** Auf dem Handy quer stehen Frage und Antworten nebeneinander, Labyrinth und Schatzkarte haben die Steuerung daneben – alles passt auf den Bildschirm.
- **🎮 Einstellungen je Spiel** (Tab 🐾, ausklappbar): Spiel an/aus, Versuche und Wiederholen je Lernspiel, Memory-Paare, Puzzle-Größe/Zahlen/Tipp, Formen, Abenteuer-Stufe. Ausgeschaltete Spiele verschwinden aus Menü und Aufgaben-Editor.
- **Passend zum Alter:** Rechnen und Zählen nach Klasse – aus der Einschulung (🎓 Schulnoten) oder aus Geburtstag und Einschulungsalter des Landes aus Home Assistant. 7 Stufen von Vorschule bis Klasse 6, je Kind änderbar (✎ beim Kind im Tab 🐾).

### 🗺️ Abenteuer: ein eigenes Jump & Run
- Im Spiele-Menü: **„Flockes Abenteuer“** (der Name kommt vom Haustier) mit dem Haustier – auch dem eigenen KI-Haustier – als Spielfigur.
- **Titelbild** mit dem Haustier, Schriftzug im 16-Bit-Stil und eigener Titelmusik – passt sich jedem Bildschirm an (Handy, Tablet, Laptop). Im Spiele-Menü ein großes Banner mit dem Haustier.
- **10 lange Level in 5 Welten** (Wiese, Strand, Süßigkeitenland, Schnee, Sternennacht) mit Sternen, Futter, Federn, Stacheln, bewegten Plattformen, Gegnern zum Draufspringen und 🎁 Bonus-Kisten – von unten anstoßen gibt +3 ⭐.
- Fähnchen als Zwischenstand, 1–3 Kronen pro Level, Fortschritt je Kind gespeichert.
- Steuerung mit **◀ ▶ ⤒** (auch Tastatur) – die Knöpfe liegen unter dem Spielfeld, im Querformat links und rechts daneben, und verdecken nie das Spiel.
- **„Einfach“** (langsamer, feste Brücken, 5 ❤️), **„Normal“** (schneller, fahrende Plattformen, 3 ❤️) oder **„🔥 Schwer“** (noch schneller, kleine fahrende Plattformen, 2 ❤️ und Spezial-Gegner: 🐸 Hüpfer, 🐀 Flitzer, 🦔 Igel – nicht draufspringen! – und 🐝 Flieger über den Lücken) – dazu **⤒⤒ Doppelsprung** (in der Luft nochmal tippen) und hohe Ebenen mit schwer erreichbaren 🎁 Kisten. Sind alle Herzen weg, beginnt das Level neu.
- Für Kleine je Kind einschaltbar: **„Läuft von allein“** – nur tippen zum Springen.
- **Musik im 16-Bit-Stil** mit eigenen Melodien je Welt, im Browser erzeugt (🔊/🔇). Kein Vorlesen im Abenteuer.
- **⏱️ Bestzeit je Level** – am Ziel und auf der Karte.
- Tageslimit einstellbar (Standard 3 Level), Stufe auf Wunsch fest vorgeben. Eigene Datei `yippee-kids-chores-adventure.js`.
- **🚪 Fragetore** (Tab 🐾 → Abenteuer, Standard aus): Vor den Fähnchen steht ein hohes Tor – es geht mit einer Frage aus den Lernspielen auf. Richtig = +3 ⭐, falsch = das Tor geht trotzdem auf.

### 📺 Bildschirmzeit mit Gerätesteuerung
- Belohnungen mit 📺 werden zum Gutschein. Startet das Kind ihn, geht das Gerät an (Schalter, Fernseher, Skript …), oben läuft der Countdown, 5 Minuten vorher kommt eine Warnung, am Ende wird ausgeschaltet oder ein Skript gestartet.
- Eltern sehen laufende Zeiten im 📋 Heute-Tab: +10 Min. oder ⏹️ beenden.
- **🔎 Geräteauswahl mit Suche:** Die Geräte sind nach Art gruppiert (📺 Fernseher & Medien, 🔌 Schalter & Steckdosen, 💡 Lichter, 📜 Skripte …), nach Namen sortiert und lassen sich über ein Suchfeld filtern.
- **📱 Handy und Tablet:** lassen sich nicht direkt schalten – ein Hinweis erklärt, wie es mit dem Internet-Schalter des Geräts (z. B. aus der FritzBox-Integration) oder einem eigenen Skript klappt.

### 💰 Taschengeld – eine Spardose für jedes Kind
Das Taschengeld ist jetzt fest in Yippee! eingebaut (einschalten unter ⚙️ Einstellungen → ⚙️ Allgemein → 💰 Taschengeld). Es startet bei 0 – den aktuellen Stand trägst du einmal als 🏁 Startbetrag ein.
- **💰 Spardose:** Kontostand, Verlauf und Buchungen für jedes Kind. Kinder öffnen sie über den Knopf „💰 Meine Spardose“ (in der kompakten Ansicht als Sammel-Knopf), die Eltern haben den neuen Tab **💰 Taschengeld** mit allen Spardosen und Einstellungen.
- **➕ ➖ Ein- und Ausgaben** mit Text, Emoji und Datum. Löschen können nur Eltern.
- **🌍 Währung nach Sprache:** Euro, Schweizer Franken, Pfund, Dollar, Dänische und Schwedische Krone, Złoty, Tschechische Krone, Forint, Leu, Rubel und Lira – voreingestellt nach der Sprache der Karte (bei Englisch nach der Währung von Home Assistant), jederzeit umstellbar.
- Einzeln zuschaltbar:
  - **✍️ Kinder tragen selbst ein** – ohne ins Minus zu gehen.
  - **📅 Regelmäßiges Taschengeld** – je Kind wöchentlich (montags) oder monatlich (am 1.), automatisch gebucht; optional voll erst ab einem Anteil erledigter Aufgaben, darunter anteilig. Verpasste Termine (Karte war zu) werden nachgeholt, aber nie doppelt gebucht.
  - **⭐ Sterne in Geld tauschen** – Kurs und Mindestmenge je Kind; wird ein Tausch gelöscht, gibt es die Sterne zurück.
  - **🎁 Belohnungen mit Geldbetrag** – Geld kommt beim Einlösen in die Spardose oder wird vom Taschengeld bezahlt (mit Prüfung, ob genug drin ist).
  - **🎯 Sparziel** (Standard an) – mit Fortschritt und „Bei deinem Tempo ca. am …“.
  - **🌍 Andere Währungen** – z. B. Urlaubsgeld, getrennt geführt.
  - **📅 Im Rückblick** (Standard an) – Einnahmen, Ausgaben und Stand des Monats.
  - **🔒 PIN für die Spardose:** Die Spardose eines Kindes öffnet sich nur mit seiner PIN (Eltern brauchen keine).
  - **📊 Monatsbericht:** am 1. jedes Monats um 9 Uhr Einnahmen, Ausgaben und Stand jedes Kindes aufs Handy.
- Das bisherige **💶 Auszahlen** (🎁 Belohnungen & Geld → 💶 Taschengeld) bucht bei eingeschaltetem 💰 Taschengeld direkt in die Spardose.
- Das Taschengeld steckt in einer eigenen Datei (`yippee-kids-chores-money.js`) und wird nur geladen, wenn es eingeschaltet ist. Buchungen liegen in der Yippee-Liste und sind in der Sicherung enthalten.
- Handbuch-Thema „💰 Taschengeld“ neu geschrieben, in allen 27 Sprachen.

### ⚡ Schneller, barrierefrei und ausfallsicher
- **⚡ Kleinere Karte, schnellerer Start:** Die Karte selbst ist von rund 600 KB auf unter 400 KB geschrumpft. Eltern-Bereich, Karten-Editor (`yippee-kids-chores-editor.js`, neu) und seltener gebrauchte Funktionen wie Aufgaben-Timer, Rückblick, gemeinsames Sparen, Foto-Nachweis und Sensoren (`yippee-kids-chores-extras.js`, neu) werden nachgeladen – die Zusatzfunktionen kurz nach dem Start im Hintergrund. Für dich ändert sich nichts, solange alle Dateien aus `dist/` nebeneinander liegen (HACS erledigt das automatisch).
- **◀ Vortage nachtragen:** Im Tab 📋 Heute blätterst du mit ◀ ▶ bis zu 7 Tage zurück und hakst dort ab oder nimmst zurück – die Sterne kommen sofort aufs Konto, eine verpasste Aufgabe mit Minuspunkten zählt dann wie „Doch erledigt“. Nur für Eltern – z. B. wenn nach Mitternacht noch etwas abgehakt werden muss.
- **📴 Offline-Puffer** (Standard an, ⚙️ → 💾 Daten → 💾 Datensicherung): Ist Home Assistant kurz nicht erreichbar (WLAN weg, Neustart), merkt sich das Kinder-Gerät die Haken – die Kachel zeigt „📴 offline – wird nachgetragen“ – und trägt sie automatisch nach, sobald die Verbindung wieder steht.
- **♿ Barrierefreiheit** (🎨 Darstellung): 🔳 Hoher Kontrast und 🐢 Weniger Bewegung, für alle Geräte oder nur für dieses Gerät; „Bewegung reduzieren“ des Geräts gilt automatisch. Dazu: deutliche Fokus-Rahmen, Bedienung mit der Tastatur (Tab, Enter/Leertaste, Esc schließt Fenster) und beschriftete Symbol-Knöpfe für Screenreader.

### 🏠 Lernen, Lesen und ein Zuhause fürs Haustier
- **🏠 Haustier-Zuhause** (Tab 🐾 → „🏠 Zuhause“ einschalten): ein eigenes Zimmer fürs Tier. Durchs Fenster sieht man das Wetter aus Home Assistant – Regen und Schnee bleiben draußen, drinnen braucht das Tier keinen Schirm. Bezahlt wird mit **🪙 Talern** – einer eigenen Spiel-Währung: Die Taler gibt es in allen Haustier-Spielen (Lernspiele 1 Taler je richtige Antwort, Geschicklichkeitsspiele je 5 Punkte 1 Taler, höchstens 20 pro Runde) und am Ziel im 🏃 Abenteuer. Echte ⭐ bleiben unangetastet; wer möchte, legt eine Belohnung mit „🪙 Taler fürs Haustier-Zuhause“ an – dann tauscht das Kind dort Sterne gegen Taler (Taler-Belohnungen gibt es nur einzeln, nicht gemeinsam). Wie viele ⭐ pro Tag getauscht werden dürfen, stellst du bei den Preisen ein (Standard: höchstens 10, auch ohne Grenze möglich). Damit kauft das Kind 20 Sachen (Bett, Sofa, Teppich, Lampe, Aquarium, Tapete …), antippen und bestätigen; Das 🛏️ Bett steht immer im Zimmer (nur verschieben). Gekauftes lässt sich wegräumen und wieder aufstellen und im Zimmer verschieben: antippen und mit dem Steuerkreuz bewegen oder direkt mit dem Finger ziehen. Nichts überlappt – Möbel bleiben am Boden, Bilder an der Wand, „↺ Aufräumen“ stellt alles zurück. Schläft das Tier, darf man es trotzdem besuchen: Im dunklen Zimmer scheint das Mondlicht herein, das Tier schläft im Bett – nur zuschauen. Die Preise stellst du selbst ein: für alles günstiger oder teurer (½×–3×) oder jede Sache einzeln (0 = geschenkt). Dazu, alles einzeln abschaltbar: **🎄 Deko zur Jahreszeit** (im Dezember Lichterkette, Tannenbaum und Geschenke, an Ostern Hase und Eier, im Oktober Kürbis und Herbstlaub), **🎂 Geburtstag im Zimmer** (Girlande, Luftballons, Torte, Partyhut und einmal 🪙 Geburtstags-Taler, Standard 50, je Kind änderbar), **🌳 Garten** als zweiter Raum für 200 🪙 mit eigenem Laden (Blumenbeet, Rutsche, Planschbecken, Baum, Hundehütte, Ball, Vogelhaus, Erdbeeren – alles verschiebbar, Regen und Schnee fallen hier wirklich) und **👋 Besuch**: Das Kind lädt das Haustier eines Geschwisterkinds ein, einmal am Tag gibt es dafür für beide +2 🪙. Eigene Datei `yippee-kids-chores-home.js`.
- **🇬🇧 Englisch-Wörter** (neues Lernspiel): 273 Wörter nach Schuljahr (Tiere, Essen, Farben, Zahlen, Familie, Gefühle, Kleidung, Fahrzeuge …) in vier Fragearten – Bild → Wort, Wort anhören → Bild, Wort lesen → Bild und fehlender Buchstabe. Der 🔊-Knopf rechts neben jeder Antwort liest auf Englisch vor – erst anhören, dann antippen. Erscheint nicht, wenn die Karte selbst auf Englisch ist.
- **✖️ Einmaleins** (neues Lernspiel): Reihen auswählen, 10 Aufgaben gegen die Uhr (Mal-Aufgaben, fehlender Faktor und Geteilt), mit Bestzeit je Reihe bzw. Auswahl. Beide neuen Spiele gehen auch als 🎮 Spiel-Aufgabe und zählen in der Lernstatistik.
- **📚 Lesetagebuch** (⚙️ Einstellungen → 🎉 Spaß & Sammeln): Kinder legen ihre Bücher an, tragen Leseminuten ein (+10′ … +30′) und stellen fertige Bücher ins 📚 Bücherregal. Pro Buch gibt es Sterne (Standard 5) – mit eingeschalteter Freigabe erst nach deinem ✓ unter 🔔 Freigaben. Eigene Datei `yippee-kids-chores-read.js`.

### 🎉 Spaß & Sammeln
Alles optional unter ⚙️ Einstellungen → 🎉 Spaß & Sammeln (eigene Datei `yippee-kids-chores-fun.js`, wird nur geladen, wenn etwas davon an ist):
- **🎡 Glücksrad:** Wer alle Aufgaben des Tages erledigt hat, darf einmal drehen – Standard: +1, +2 oder +5 ⭐, ein 🎟️ Freispiel oder „Leider nichts“. Gewinne und ihr Gewicht (wie oft sie kommen) stellst du selbst ein.
- **📒 Sticker-Album:** Bei jeder erledigten Aufgabe gibt es mit etwas Glück (Standard 30 %) einen Sticker – 4 Alben (Tiere, Fahrzeuge, Weltraum, Meer) mit je 24 Stickern, Doppelte werden gezählt. Auf Wunsch Bonus-Sterne für ein volles Album. Ab- und wieder Anhaken bringt keinen zweiten Sticker.
- **🥚 Ostereiersuche** (Palmsonntag bis Ostermontag) und **🎃 Kürbissuche** (24.–31. Oktober), jeweils einzeln einschaltbar: In etwa jeder dritten Aufgabe ist zufällig etwas versteckt – das Kind findet es beim Erledigen und sammelt es im 🧺 Osternest bzw. 🎃 Kürbiskorb, auf Wunsch mit +1 ⭐.
- **📊 Wochenbericht** (🔔 Benachrichtigen bei …): sonntags ab 18 Uhr pro Kind Aufgaben, Sterne, Stand, Spardose, Sticker und Ostereier – an die Geräte des Wochenrückblicks.
- **🔔 Erinnerung zu festen Uhrzeiten** (🔊 Sprachausgabe): Zu deinen Uhrzeiten sagt der Lautsprecher, was ein Kind noch offen hat – nur wenn es da ist, auf Wunsch über eigene Lautsprecher. Braucht eine geöffnete Karte (z. B. das Wand-Tablet).

### Neu und verbessert
- **🧩 Einstellungen aufgeräumt:** „Alle Einstellungen“ starten jetzt mit einer Kachel je Bereich (⚙️ Allgemein, ✅ Aufgaben & Tagesablauf, ⭐ Punkte & Boni …) – mit kurzer Vorschau und wie viele Funktionen davon an sind. Antippen zeigt nur diesen Bereich, „← Alle Einstellungen“ führt zurück. Die Suche oben sucht weiterhin in allen Einstellungen. Genauso aufgebaut sind die Einstellungen in den Reitern 🐾 Haustier (Eigene Haustiere, Wachstum & Freischalten, Füttern & Stimmung, Spiele, Zuhause, Einstellungen je Spiel, Wetter), 💰 Taschengeld (Währung & Buchungen, Taschengeld & Tauschen, Sparen & Berichte, PIN), 🦷 Zähne und 🎄 Advent (Aussehen und Einstellungen) – jeweils mit 🔎 Suche; die Liste der Kinder bzw. Spardosen bleibt oben.
- **📖 Handbuch in Kapiteln:** Die Themen sind in dieselben Bereiche sortiert wie die Einstellungen und lassen sich kapitelweise aufklappen. Die Suche findet weiterhin alles.
- **👨‍👩‍👧 Familienziel korrigieren:** −10 · −1 · +1 · +10 direkt unter dem Balken (Tab 🎁); die letzten Korrekturen stehen mit vorher → nachher darunter.
- **📋 Familienziel-Warteschlange:** weitere Ziele vormerken – nach „✓ Eingelöst“ geht es automatisch mit dem nächsten weiter, Sterne nach dem Erreichen zählen schon dafür. „🏆 Geschafft“ listet die erreichten Ziele.
- **📦 Alte Taschengeld-Buchungen zusammenfassen** (Standard an): älter als 12 Monate → je Monat eine Summe für Einnahmen und Ausgaben, der Kontostand bleibt gleich.
- **🛡️ Vor Updates sichern** (Standard an): Bei einer neuen Yippee!-Version – oder beim ersten Start – gibt es sofort eine zusätzliche Sicherung.
- **🔠 Größe nur auf diesem Gerät** (🎨 Darstellung, 90–150 %): z. B. größere Schrift am Kinder-Tablet zum Lesenlernen.
- **🎉 Einmaliger Hinweis „Neu in 2.0“** in der Eltern-Ansicht – verschwindet mit „✓ Verstanden“.
- **💡 Hinweis für Eltern** (abschaltbar): Im Tab 📋 Heute steht ein Hinweis, wenn ein Kind 3 Tage keine Aufgabe erledigt hat oder sein Haustier traurig ist – nur in der Karte, keine Nachricht.
- **📱 Ein Kind pro Seite** (optional, Karte mit allen Kindern): oben die Kinder zum Antippen, darunter ein Kind, **wischen** wechselt zum nächsten – am PC mit der Maus oder dem Touchpad. Jedes Gerät merkt sich das letzte Kind. Einschalten unter ⚙️ Einstellungen → 🎨 Darstellung oder mit `pages: true`.
- Haustier, Mini-Spiele, Abenteuer und Bildschirmzeit stecken in eigenen Dateien (`yippee-kids-chores-pet.js`, `yippee-kids-chores-games.js`, `yippee-kids-chores-adventure.js`, `yippee-kids-chores-screen.js`) und werden nur geladen, wenn sie gebraucht werden.
- Sechs neue Handbuch-Themen (🐾 Haustier, 🎨 Eigenes Haustier, 🎮 Mini-Spiele, 📺 Bildschirmzeit, 🎉 Spaß & Sammeln, 📚 Lesetagebuch), alles in 27 Sprachen – jetzt 57 Themen.
- In der Browser-Konsole steht neben der Version jetzt auch der Bau-Stempel – so sieht man sofort, ob wirklich die neue Datei geladen ist.
- **🙂 Viel mehr Emojis zur Auswahl:** Aufgaben, Belohnungen, Wünsche und Sparziele bieten jetzt rund 800 Emojis in Gruppen (neu u. a. 🎉 Feste & Jahreszeiten, 😊 Gesichter & Gefühle, ⚽ Sport & Bewegung, 🐾 Tiere & Fantasie) – alle Emojis, die die Karte selbst verwendet, sind dabei (auch 🪙 Taler, 🎟️ Freispiele, Haustiere und Spiele). Emojis, die ein älteres Gerät nicht anzeigen kann, erscheinen dort als Ersatz (z. B. 🪙 → 💰) – gespeichert wird das Original. Auch die Avatare für Kinder und die Emojis im Adventskalender sind deutlich mehr geworden.
- **🔊 Vorlesen ohne „1.“:** Texte, die vorgelesen werden, schreiben Ordnungszahlen aus („Heute ist der erste Advent“, „Am ersten Dezember geht es los!“, „Mal 2“) – die Sprachausgabe las sonst „eins Punkt“.
- **🙂 Emojis auf älteren Geräten:** Neuere Emojis, die ein Tablet oder Handy nur als leeres Kästchen zeigen würde, ersetzt die Karte automatisch durch ein älteres (z. B. 🪙 → 💰, 🪥 → 🦷) – auch die eigenen Emojis von Aufgaben, Belohnungen und Kindern, überall in der Karte. Gespeichert bleibt das Original. Die Spiele nutzen nur Emojis, die überall angezeigt werden.

### 🦷 Zahnputz-Timer
- **👧 Bilder je Kind** ([#18](https://github.com/Chrism1412/yippee-kids-chores-card/issues/18)): Unter jedem Bild – auch den Vorlagen – die Kinder antippen, die es bekommen sollen. Nichts gewählt = alle Kinder.

### Behoben
- **🏠 Anwesenheit:** Aufgaben mit nur einer „ab“-Uhrzeit (z. B. ⏰ Aufstehen ab 06:30) galten bis Mitternacht – kam ein Kind erst mittags, waren die Morgen-Aufgaben trotzdem fällig. Jetzt gelten sie bis zum Ende ihres Tagesabschnitts (🌅 Morgens bis 11:30 …).
- 🔊 Vorlesen im Leseanfänger-Modus blieb auf manchen Tablets und Handys stumm – vor allem, wenn Sätze schnell aufeinander folgten.
- 🦷 Eigene Zahnputz-Bilder: Klappt das Laden eines Bildes einmal nicht (z. B. kurz nach dem Start von Home Assistant), versucht die Karte es jetzt bis zu dreimal statt das Bild leer zu lassen.

## [1.9.0] – 2026-11-17

### 📱 Das Highlight: eine übersichtliche Kinder-Ansicht
Mit jeder Erweiterung kam in der Kinder-Ansicht ein Balken dazu – jetzt gibt es eine aufgeräumte **kompakte Ansicht** (umschaltbar unter ⚙️ Einstellungen → 🎨 Darstellung → 🧒 Kinder-Ansicht). Neue Installationen starten kompakt, wer schon Kinder angelegt hat, behält erst einmal die gewohnte klassische Ansicht.
- **Kopf in drei Zeilen:** Avatar mit Level-Ring, „Hallo Mia!“, Level und eine große Sterne-Zahl; darunter das Ziel als schmaler Balken.
- **Sammel-Knöpfe:** 🎄 Adventskalender (nur im Dezember, mit Türchen-Zahl), 🦷 Zahnputz-Bilder (mit Serie), 🏅 Abzeichen, 👨‍👩‍👧 Familienziel (in %) und 📅 Rückblick – was gerade nicht aktiv ist, fällt weg.
- **„Jetzt dran“:** groß nur die Aufgaben, deren Zeitfenster gerade offen ist. Erledigtes schrumpft zu einer Zeile „✅ Schon geschafft: 🛏️ 📚 🗑️“, spätere Tagesblöcke, „Ohne Zeit“ und Verpasstes stehen eingeklappt darunter.
- **Leiste unten: 🏠 Heute · 🎁 Belohnungen · 🏆 Sammlung.** Belohnungen, Wünsche und Joker auf einer eigenen Seite (mit roter Zahl, wenn etwas einlösbar ist); in der Sammlung liegen Adventskalender, Zahnputz-Bilder, Abzeichen, Familienziel, Rückblick und Gutscheine.

### Neu
- **⏱️ Aufgaben-Timer** (pro Aufgabe, im Aufgaben-Editor): z. B. „15 Min. lesen“ oder „Zimmer aufräumen in 10 Min.“ – großer Countdown-Ring mit ruhiger Musik – wahlweise deine eigenen Zahnputz-MP3s (🦷 Zähne) oder ganz ohne Musik, ⏸️ Pause, Abbrechen mit zweitem Tipp (bucht nichts). Am Ende pro Aufgabe wählbar: **✅ automatisch abhaken**, **👆 Kind bestätigt** oder **⏱️ nur Countdown** (abhaken wie gewohnt). Freigabe der Eltern und Foto-Nachweis gelten wie immer; der Bildschirm bleibt während des Timers an.
- **🔊 Leseanfänger-Modus** (pro Kind, im Kind-Editor): große Bilder, Sterne als Symbole statt Text und ein 🔊-Knopf auf jeder Aufgabe, der sie vorliest („Zähne putzen – dafür bekommst du einen Stern!“). Vorgelesen wird über das Gerät oder über die Lautsprecher aus 🔊 Sprachausgabe.
- **🎄 Adventskalender liest vor** (für Kinder mit 🔊 Leseanfänger-Modus): Beim Öffnen werden Türchen-Text, Nachricht, Sterne und Geschenk vorgelesen, auch Sperr-Hinweise wie „Noch 3 Tage …“ – beides einzeln abschaltbar in den Kalender-Einstellungen. Ein 🔊-Knopf im Türchen liest nochmal vor.
- **🦷 Zahnputz-Timer als Schritt einer Routine** ([#17](https://github.com/Chrism1412/yippee-kids-chores-card/issues/17)): Steckt eine mit dem Zahnputz-Timer verknüpfte Aufgabe als Schritt in einer Routine, zeigt der Schritt jetzt den Knopf „🦷 Los geht's!“. Das geht auch mit einfachen Text-Schritten: Schritte, die mit 🦷 beginnen (z. B. aus den Routine-Vorlagen), haben den Timer automatisch, bei anderen schaltest du ihn im Schritt-Editor mit 🦷 ein oder aus. Nach dem Timer ist der Schritt abgehakt, das Putzen zählt für Bilder, Zähler und Serie. Die Sterne gibt es wie bisher am Ende der Routine.
- **📅 Rückblick:** „Dein Oktober“ den ganzen Monat in der 🏆 Sammlung bzw. klassisch als 📅-Knopf unter den Abzeichen, vom 1. bis 14. als „neu“ markiert – Sterne mit Vergleich zum Vormonat, Aufgaben, längste Serie, Zähneputzen, Lieblingsaufgabe und eingelöste Belohnungen; im Januar zusätzlich „Dein Jahr“ mit stärkstem Monat und Level. Für die Eltern unter 📊 Berichte → 📅 Rückblick.
- **⚡ Schnellerer Start:** Einstellungen, Aufgaben-, Kinder- und Belohnungs-Verwaltung, Berichte und der Einrichtungs-Assistent liegen jetzt in einer eigenen Datei (`yippee-kids-chores-admin.js`) und werden erst geladen, wenn die Eltern-Ansicht geöffnet wird. Die Karte selbst ist dadurch rund 30 % kleiner – Kinder-Tablets starten spürbar schneller. Fehlt die Datei, läuft die Kinder-Ansicht trotzdem, und die Eltern-Ansicht sagt genau, was fehlt.
- **Bau-Stempel:** Zusatzdateien (Sprachen, Handbuch, Eltern-Bereich, Adventskalender, Zahnputz-Timer) werden nach jedem Update sicher neu geladen – auch wenn der Browser die alte Datei noch zwischengespeichert hat.
- Zwei neue Handbuch-Themen (🧒 Kinder-Ansicht, ⏱️ Timer) in allen 27 Sprachen.

### Verbessert
- 🦷 Das Zahn-Symbol im Reiter hat einen feinen Schatten und ist auf hellem Grund besser zu sehen.
- README: alle Screenshots neu und gleich hoch, damit die Tabellen auf GitHub sauber nebeneinander stehen.

### Behoben
- 🦷 „Meine Zahnputz-Bilder“: Eigene Fotos erscheinen in der Galerie jetzt als kleines Bild statt nur als 📷 – und jedes Bild lässt sich antippen und groß ansehen (mit ‹ › zum Blättern). Das geht auch in der Bilder-Übersicht der Eltern im Tab 🦷 Zähne.
- 🔊 Vorlesen über „📱 dieses Gerät“: Ist unter 🔊 Sprachausgabe eine Stimme eingestellt (z. B. Home Assistant Cloud), erzeugt Home Assistant die Sprachdatei und das Handy spielt sie selbst ab – damit klappt das Vorlesen auch in der Companion-App, die keine eigene Browser-Stimme hat.
- ⏱️ Aufgaben-Timer und 🦷 Zahnputz-Timer in der Home-Assistant-App (Companion-App) auf Android-Handys: Die Knöpfe unten liegen nicht mehr hinter den Navigationstasten des Handys; auf dem Handy füllt der Aufgaben-Timer jetzt den ganzen Bildschirm.
- 🦷 **Ein einzelnes Putzen zurücknehmen:** Setzen Eltern eine mit dem Timer geputzte Aufgabe auf „nicht erledigt“ (oder lehnen sie ab), gehen jetzt außer den Sternen auch das Bild dieses Putzens, der Zähler „× geputzt“, der Serien-Tag und ein an dem Tag gebuchter Serien-Bonus zurück. Putzt das Kind danach doch noch, wird alles wieder gebucht. Das ↺ im 🦷-Tab setzt weiterhin alles zurück.
- Weiße Emojis (z. B. 🦷 unter Windows) waren auf hellen Kacheln kaum zu sehen – große Emojis auf Kacheln, Belohnungen und im Rückblick haben jetzt einen feinen Umriss.
- 📋 Routinen: Bei einer frisch geöffneten Routine war der erste Schritt schon abgehakt (Anzeige „1/…“ statt „0/…“). Jetzt startet jede Routine mit null erledigten Schritten.

## [1.8.0] – 2026-11-13

### 🦷 Das Highlight: der Zahnputz-Timer
Optional unter ⚙️ Einstellungen → ⚙️ Allgemein → 🦷 Zahnputz-Timer. Eingeschaltet bekommen Zahnputz-Aufgaben in der Kinder-Ansicht den Knopf **🦷 Los geht's!**, und die Eltern-Ansicht den neuen Tab **🦷 Zähne**. Welche Aufgaben dazugehören, wählt man dort aus einer Liste: verknüpfte Aufgaben oben, alle anderen aufklappbar nach Kind bzw. „Gemeinsam“ sortiert.
- **Bild freiputzen:** Der Bildschirm ist voller Zahnpasta-Schaum. Der Timer läuft 1, 2 oder 3 Minuten (pro Kind einstellbar) in 4 Bereichen – oben links, oben rechts, unten links, unten rechts. Die Bürste schrubbt Zahn für Zahn: im ersten Durchgang wird der Schaum dünner, im zweiten wird er weggeputzt – mit Schaumspritzern, Schaumresten, die am Ende des Bereichs „ploppen“, und weichen, welligen Übergängen zwischen den Bereichen. Die Zahnbürste dreht sich passend zur Seite; dazu ein Tipp pro Bereich, ein Wechsel-Ton und ein kleiner Mund, der den Bereich zeigt. Am Ende „Blitzblank! ✨“ mit Konfetti. Das Bild bleibt danach stehen: **🖼️ Bild ansehen** zeigt es ganz, erst **Weiter** führt zurück zu den Aufgaben.
- **⭐ Sterne sofort:** Mit Timer wird die Aufgabe direkt abgehakt, ohne Freigabe der Eltern („✅ Mit Timer sofort gutschreiben“, abschaltbar). Sterne **für alle gleich** oder **je Kind & Tageszeit** – putzt ein Kind z. B. morgens ungern, gibt es dort mehr, und auf der Kachel steht „🔥 Extra!“. Wer ohne Timer abhakt, bekommt die Sterne der Aufgabe (oder auf Wunsch auch die Timer-Sterne). Zurücknehmen bucht genau die gebuchten Sterne zurück, Doppelte-Punkte-Tage und Geburtstags-Faktor gelten wie immer.
- **🔒 Nur mit Timer abhaken** (optional): Antippen der Aufgabe startet dann den Timer. **🔥 Bonus nach 7 Tagen am Stück** (optional): wenn an 7 Tagen jedes Zähneputzen mit Timer war. Für Zahnputz-Aufgaben gibt es nur diese eine 🔥-Serie – der allgemeine Serien-Bonus zählt dort nicht zusätzlich, und die Kachel zeigt die Zahnputz-Serie.
- **🖼️ 14 selbst gezeichnete Vorlagen** – Mondlandung, Drachenburg, Tauchgang am Riff, Baumhaus bei Nacht, Piratenschiff, Dino-Tal, Feuerwehr, Bauernhof, Pinguine im Eis, Safari, Zirkus, Einhorn-Wiese, Zauberwald, Dampflok – plus **📷 eigene Bilder** (werden automatisch verkleinert, auf Wunsch nur für ein Kind; hochladen nur als Administrator; in der Home-Assistant-App ein Bild pro Auswahl, im Browser mehrere auf einmal). Auswahl per **🎲 Zufall** (ein Bild kommt erst wieder, wenn alle anderen dran waren – nie zweimal am selben Tag) oder in **🔢 fester Reihenfolge**; einzelne Bilder lassen sich ausblenden. Die Kinder sammeln ihre Bilder unter „🦷 Meine Zahnputz-Bilder“.
- **🎵 Musik:** eigens komponierte, ruhige 2-Minuten-Musik (eigene Datei, wird erst beim Putzen geladen), eigene MP3s oder Zufall; Wechsel-Ton und „Ta-da“ einzeln abschaltbar. Optional **🔊 Putzgeräusch**: Schrubben oder elektrische Zahnbürste (mit Vibration, wo das Handy das kann; bei einer Oral-B-Zahnbürste immer aus).
- **🤖 Eigene Bilder mit KI:** Im Tab 🦷 Zähne gibt es einen fertigen Prompt in zwei Stilen (🧸 verspielt 3–8, 😎 cool 9–14) – Motiv eintragen oder eine Idee bzw. 🎲 wählen, **📋 Kopieren**, in ChatGPT, Gemini oder Microsoft Designer einfügen. Im selben Chat lässt sich das Bild danach mit eigenen Worten anpassen – so entsteht auch eine ganze Serie im gleichen Stil.
- **✨ Bewegte Effekte** (funkelnde Sterne, Bläschen, schwebende Lichter) und optional **🌫️ Bild erst am Ende scharf** – für Kinder, die sonst nur aufs Bild schauen statt zu putzen.
- **🦷 Oral-B:** Mit der Home-Assistant-Integration „Oral-B“ (Bluetooth) pro Kind die Zahnbürste wählen – der Timer startet von selbst, sobald sie läuft, hält an, wenn sie aus ist („⏸️ Zahnbürste aus – weiter putzen!“), und warnt bei zu viel Druck.
- Der Bildschirm bleibt während des Putzens an. Abbrechen geht nur mit zweitem Tipp aufs ✕ – dann wird nichts gebucht. Läuft schon Freigabe, Verpasst-Meldung oder ist die Aufgabe erledigt, gibt es keine doppelten Sterne.
- Der Timer ist eine eigene Datei (`yippee-kids-chores-teeth.js`, Musik `yippee-kids-chores-teeth-music.js`) und wird nur geladen, wenn er gebraucht wird. Einstellungen und Fortschritt sind in der Sicherung enthalten. Neues Handbuch-Thema in allen 27 Sprachen.

### Sonstiges
- **README:** Der Hinweis „Ab Version 1.4.0 besteht die Karte aus mehreren Dateien“ ist entfallen; bei der manuellen Installation steht jetzt richtig, dass bei Updates alle Dateien aus `dist/` kopiert werden.
- **🇬🇧 Englischer Changelog** ([#16](https://github.com/Chrism1412/yippee-kids-chores-card/issues/16), Idee von [@gogui63](https://github.com/gogui63)): `CHANGELOG.en.md`, Release-Texte ab jetzt auf Deutsch und Englisch.

## [1.7.2] – 2026-11-08

Danke an [@RkcCorian](https://github.com/RkcCorian) für den Hinweis ([#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14))!

### Verbessert
- **📱 Freigabe per Knopf – Nachricht verschwindet sofort auf allen Handys, auch ohne geöffnete Karte** ([#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14)): Bisher entfernte die Karte die Nachricht auf den anderen Handys erst, sobald irgendwo eine Yippee!-Karte geöffnet war. Jetzt erledigt das die Automation „Knöpfe in Benachrichtigungen“ direkt in Home Assistant: Tippt z. B. Papa auf ✓ Freigeben, verschwindet die Nachricht sofort auch bei Mama. Gebucht werden die Sterne wie bisher, sobald wieder eine Karte offen ist.
- **Nichts einzurichten:** Wer die Automation von der Karte hat anlegen lassen, bekommt sie beim nächsten Öffnen der Eltern-Ansicht (als Administrator) automatisch neu geschrieben – ebenso, wenn sich unter 🔔 Benachrichtigungen die Handys ändern. Wer sie von Hand angelegt hat: unter 🔔 → ✓ Knöpfe das YAML neu kopieren.
- **🔁 Sensor-Vorlage doppelt eingetragen?** Steht die Vorlage für „🔁 Auch nach einem Neustart sofort da“ an zwei Stellen (z. B. alt in der `configuration.yaml` und neu in `packages/yippee.yaml`), nutzt Home Assistant weiter die alte – der Hinweis „neue Vorlage“ ging dann trotz Neu-Kopieren nicht weg. Die Karte erkennt das jetzt (als Administrator, aus dem Home-Assistant-Protokoll) und sagt genau, was zu tun ist: alte Kopie löschen, neu starten. Die Anleitung weist außerdem darauf hin, die Vorlage nur an einer Stelle einzufügen.

## [1.7.1] – 2026-11-07

Danke an [@RkcCorian](https://github.com/RkcCorian) für die Idee, auf eine veraltete Sensor-Vorlage hinzuweisen ([#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13))!

### Neu
- **🔁 Hinweis bei veralteter Sensor-Vorlage** ([#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13)): Die kopierte Vorlage für „🔁 Auch nach einem Neustart sofort da“ trägt jetzt eine Kennung. Ändert sich die Vorlage – nach einem Update, durch neue Kinder oder Einstellungen wie 💶 Taschengeld –, zeigt die Eltern-Ansicht oben im 📋 Heute-Tab einen Hinweis, und unter 📊 Sensoren steht „🔁 Es gibt eine neue Vorlage“. Dann einfach „📋 Vorlage kopieren“, neu einfügen und Home Assistant neu starten. **Wer die Vorlage schon nutzt, sieht den Hinweis nach dem Update einmal** – die Vorlage aus 1.7.0 hat noch keine Kennung.
- **🧹 Adventskalender komplett zurücksetzen** (🎄 Advent → 🚪 Türchen, pro Kind): schließt alle Türchen und nimmt Sterne, Gutscheine und Geschenke dieser Saison wieder zurück. Danach wird beim Öffnen wieder ganz normal gebucht – praktisch nach einem Test mit umgestelltem Datum. „🚪 Alle Türchen schließen“ lässt Sterne und Geschenke wie bisher stehen.

### Behoben
- **⏰ Falsch gestellte Uhr am Gerät:** Jede Buchung trägt die Uhrzeit des Geräts. Ging die Uhr vor (z. B. Datum zum Testen auf den 24.12. gestellt), blieben solche Buchungen bis zu diesem Datum „offen“ und wurden immer wieder neu angezeigt – ein eingelöster Gutschein tauchte so ständig wieder auf. Jetzt werden sie gleich verrechnet.
- **🎟️ Eingelöste Gutscheine kommen nie wieder:** Das Kind merkt sich eingelöste Gutscheine. Kommt eine Buchung mit demselben Gutschein verspätet an (anderes Gerät, falsche Uhr), erscheint er nicht noch einmal.

### Sonstiges
- **🛒 Marketplace statt HACS:** Seit Home Assistant 2026.11 ist HACS als **Marketplace** eingebaut. Texte in der Karte, im Handbuch und in der README sprechen jetzt vom Marketplace (früher HACS); die Installationsanleitung zeigt den neuen Weg (Einstellungen → Marketplace → 🔗 „Über einen GitHub-Link hinzufügen“). Bei manueller Installation lautet die Ressource jetzt `/local/community/yippee-kids-chores-card/yippee-kids-chores-card.js` – funktioniert mit und ohne Marketplace (der alte Pfad `/hacsfiles/…` geht weiterhin). Ist die Karte doppelt als Ressource eingetragen, behält die Karte bevorzugt den Eintrag des Marketplace.
- **☕ Unterstützen:** Wer mag, kann Yippee! jetzt mit einem Kaffee unterstützen – [buymeacoffee.com/Chrism1412](https://buymeacoffee.com/Chrism1412) (❤️ Sponsor-Knopf im Repo und Abschnitt „Unterstützen“ in der README). Ganz freiwillig, Yippee! bleibt kostenlos.

## [1.7.0] – 2026-11-04

Danke an [@RkcCorian](https://github.com/RkcCorian) für den Hinweis auf die fehlenden Sensoren nach einem Neustart ([#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13)), die Idee, erledigte Freigaben von allen Handys zu entfernen ([#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14)), und den Hinweis auf verschwundene eigene Emojis ([#15](https://github.com/Chrism1412/yippee-kids-chores-card/issues/15))!

### 🎄 Das Highlight: der Adventskalender
Pünktlich zur Weihnachtszeit bekommt Yippee! einen eigenen **Adventskalender** (optional, ⚙️ Einstellungen → ⚙️ Allgemein → 🎄 Adventskalender):
- **24 Türchen für jedes Kind** (wahlweise bis Silvester), in bunt gemischter Reihenfolge – mit Text, Emoji, Bild, 💌 persönlicher Nachricht, ⭐ Sternen oder einer 🎁 **Belohnung als Geschenk** (ohne Sterne abzuziehen; mit 🎟️ Gutscheinen kommt sie als Gutschein an).
- **✨ In Sekunden befüllt:** Vorlagen zum Backen, Basteln, Vorlesen, für Gutscheine und Rätsel – dazu die besonderen Tage wie Nikolaus, die vier Adventssonntage (jedes Jahr neu berechnet) und Heiligabend.
- **🔗 Erst die Aufgaben, dann das Türchen:** Auf Wunsch geht ein Türchen erst auf, wenn heute eine bestimmte Aufgabe oder eine Anzahl Aufgaben erledigt ist.
- **🎄 Nur im Adventskalender:** Belohnungen mit diesem Haken sehen die Kinder sonst nirgends – nur ein Türchen verschenkt sie.
- **Weihnachtliche Optik:** Sternennacht mit Girlanden und Schneelandschaft, bunt gemusterte Türchen, ❄️ Schneefall, 🔔 Glocken oder eigener Ton, ⏳ Countdown bis Heiligabend, 🎚️ Türchengröße per Schieberegler – für alle, „📱 nur dieses Gerät“ oder nur für eine Karte (`advent_size` im Karten-Editor, z. B. fürs Wand-Tablet); auf schmalen Bildschirmen automatisch kleiner – alles einstellbar, auch eigene Bilder und Töne zum Hochladen.
- **📱 Morgen-Nachricht** aufs Handy des Kindes und **🧪 Testmodus** zum Ausprobieren schon im November.
- Eltern befüllen alles im neuen Tab **🎄 Advent**; Kinder öffnen ihr Türchen im Dezember über den **🎄-Knopf** in ihrer Ansicht oder in einer eigenen Karte mit `mode: advent`. Der Kalender ist eine eigene Datei (`yippee-kids-chores-advent.js`) und wird nur geladen, wenn er eingeschaltet ist; die Türchen sind in der Sicherung enthalten.

### Neu
- **👧 Belohnungen nach Kind sortieren** (🎁 Belohnungen → Sortieren): neben ⭐ Sterne und 🔤 A–Z jetzt **👧 Nach Kind** – zuerst je Kind die Belohnungen nur für dieses Kind (gilt eine für mehrere, aber nicht alle Kinder, steht sie bei jedem davon), dann 👨‍👩‍👧 Für alle Kinder, 👫 Gemeinsam / Einladen und 🃏 Joker. Innerhalb jeder Gruppe nach Sternen. Die Kinder stehen in der Reihenfolge aus dem 👧 Kinder-Tab. Die Kinder-Ansicht bleibt unverändert.
- **🎁 Belohnungen direkt einlösen (Eltern-Ansicht):** Im 📋 Heute-Tab hat jedes Kind einen 🎁-Knopf. Er zeigt die Belohnungen dieses Kindes mit Preis; reichen die Sterne, genügt „Einlösen“ und ein zweiter Tipp zur Bestätigung – sofort, ohne Freigabe, sonst genau wie eine freigegebene Anfrage (Sterne, Verlauf, Wochenlimit, Änderungsprotokoll). Da die Eltern die Belohnung dabei gleich übergeben, gilt sie direkt als bekommen – es entsteht kein 🎟️ Gutschein. Gemeinsame Belohnungen: 👫 jeder zahlt seinen Anteil oder 💝 das Kind lädt ein; läuft schon ein gemeinsames Einlösen, zahlen nur noch die fehlenden Kinder. Eine offene Anfrage des Kindes wird dabei mit erledigt.
- **🕒 Uhrzeiten bei Anwesenheits-Ausnahmen** (👧 Kinder → ✎ → 🏠 Anwesenheit → 📌 Ausnahmen): optional „ab“ (erster Tag) und „bis“ (letzter Tag) – z. B. „da vom 30.10. ab 17:00 bis 01.11. 18:00“. Vor der Ankunft bzw. nach der Abreise zählen Aufgaben nicht als verpasst und die 🔥-Serie bleibt erhalten; davor bzw. danach gilt, was sonst gilt (Regeln, Ferienregelung). Ohne Uhrzeit wie bisher ganzer Tag.
- **▾ Eltern-Heute einklappbar:** Im 📋 Heute-Tab lassen sich jetzt jedes Kind und – mit ⏰ Tagesblöcken – jeder Block (Morgens, Mittags, Nachmittags, Abends, Ohne Zeit) per Tipp ein- und ausklappen. Eingeklappt bleiben Name, Sterne, 😊/😠 und 🎁 sichtbar, dazu der Fortschritt („2/5 heute erledigt“ bzw. 2/3 beim Block). Das Gerät merkt sich, was eingeklappt ist; standardmäßig ist alles offen. Tageszeiten, die vorbei oder komplett erledigt sind, klappen automatisch zu (wie in der Kinder-Ansicht, Einstellung „⏰ Vergangene Blöcke einklappen“); ein Tipp öffnet sie für heute wieder. Bei mehreren Kindern klappt „▸ Alle einklappen“ alle auf einmal zu.
- **🔁 Sensoren auch nach einem Neustart sofort da** ([#13](https://github.com/Chrism1412/yippee-kids-chores-card/issues/13), gemeldet von [@RkcCorian](https://github.com/RkcCorian)): Bisher waren `sensor.yippee_<name>` nach einem Neustart von Home Assistant weg, bis jemand die Karte öffnete – eine Karte läuft nur im Browser, und Home Assistant vergisst solche Werte beim Neustart. Neu und optional unter ⚙️ → 🔌 Geräte & Sprache → 📊 Sensoren: „🔁 Auch nach einem Neustart sofort da“. Die Karte zeigt dann eine fertige Vorlage (📋 kopieren → `configuration.yaml` → neu starten) und legt den Stand jedes Kindes zusätzlich in der Yippee-Liste ab – auch von Kinder-Geräten aus, ohne Administrator. Home Assistant liest ihn beim Start und jede Minute selbst aus; alle Attribute bleiben erhalten (Tageswerte = zuletzt bekannter Stand). Gleiche Sensor-Namen wie bisher, Automationen müssen nicht angepasst werden. Am einfachsten wird die Vorlage als eigene Datei `packages/yippee.yaml` gespeichert (wenn „packages“ eingerichtet ist). Läuft sie, zeigt die Karte nur noch „✅ Dauerhafte Sensoren aktiv“ (die Vorlage selbst ist eingeklappt); passt sie nach neuen oder umbenannten Kindern nicht mehr, erscheint „⚠️ Vorlage neu kopieren“ mit den betroffenen Kindern. Mit Familienziel gibt es zusätzlich `sensor.yippee_familienziel` (Zustand = gesammelte Sterne; Attribute `ziel`, `ziel_sterne`, `fehlen`, `prozent`, `erreicht`, `prognose_tage`, `prognose_datum`) – z. B. für eine Ansage, wenn das Ziel erreicht ist. Hakt jemand etwas ab, sind die Sensoren nach wenigen Sekunden aktuell (nicht erst zur nächsten Minute). Benötigt Home Assistant 2025.10 oder neuer.
- **🌙 Farbvorlagen im Darkmode:** Ist Home Assistant auf einem Gerät dunkel eingestellt, werden die hellen Vorlagen (☀️ Hell, 🌸 Pastell, 🌊 Ozean, 🌲 Wald, 🌞 Sonne, 🍭 Bonbon) dort automatisch dunkel – im gleichen Farbton statt greller heller Kästen auf schwarzem Grund. Schaltet man um, wechselt die Karte sofort mit. 🌙 Dunkel und 🌌 Nacht bleiben, wie sie sind. ✏️ Eigene Farben werden auf Wunsch ebenfalls abgedunkelt („🌙 Im Darkmode automatisch dunkel“, standardmäßig aus).
- **🤖 Fertige Automationen** (per Knopf für Administratoren oder als YAML, nutzen die Sensoren): 🎉 Durchsage über die eingestellten Lautsprecher und Nachricht an die Eltern, sobald das Familienziel erreicht ist (🎁 Belohnungen → 👨‍👩‍👧 Familienziel) · 📋 Abend-Erinnerung zu einer wählbaren Uhrzeit (Standard 19:00): eine Nachricht, welches Kind noch was offen hat – nur für Kinder, die da sind, und nur, wenn noch etwas offen ist (⚙️ → 🔔 Benachrichtigungen → 🔔 Benachrichtigen bei …). Ändert sich etwas an den Einstellungen, bietet die Karte „🔄 Automation neu schreiben“ an.
- **📱 Erledigte Freigaben verschwinden auf allen Handys** ([#14](https://github.com/Chrism1412/yippee-kids-chores-card/issues/14), Idee von [@RkcCorian](https://github.com/RkcCorian)): Gibt ein Elternteil eine Aufgabe oder Belohnung frei oder lehnt ab – in der Karte oder per Knopf in der Nachricht –, wird die Push-Nachricht der Home-Assistant-App auch auf den Handys der anderen entfernt. Ebenso bei entschiedenen Verpasst-Meldungen, Noten und wenn ein Kind eine Aufgabe zurücknimmt. Bei Telegram werden wie bisher die Knöpfe im Chat entfernt.

### Behoben
- **🎟️ Erledigte Gutscheine kamen wieder:** Die Karte verrechnet Punkte-Buchungen (auch „✓ Bekommen“) im Hintergrund mit dem Stand des Kindes. Lag dabei eine Pause zwischen Lesen und Speichern – etwa weil ein Handy mit offener Karte in den Standby ging – und hatte ein anderes Gerät inzwischen etwas verbucht, schrieb die Karte danach einen veralteten Stand zurück: Abgehakte Gutscheine erschienen wieder. Jetzt liest die Karte direkt vor dem Speichern frisch und verwirft Buchungen erst, wenn sie sicher gespeichert sind.
- **🌙 „Am Abend vorher“ mit eigenen Wochentagen:** Wählte man bei einer Schul-Aufgabe z. B. Montag und Dienstag und dazu „🌙 Am Abend vorher“, kam die Aufgabe trotzdem montags und dienstags statt am Abend davor. Jetzt gilt: Man wählt die Tage mit Schule bzw. Termin (Mo, Di), die Aufgabe kommt jeweils am Abend davor (So, Mo) – wie schon beim 🎽 Sporttage-Dialog. Bestehende Aufgaben mit dieser Einstellung einmal öffnen und die Tage prüfen.
- **Eigene Emojis** ([#15](https://github.com/Chrism1412/yippee-kids-chores-card/issues/15), gemeldet von [@RkcCorian](https://github.com/RkcCorian)): Neuere Emojis wie 🪥 🫧 🪶 🧊 🪁 wurden beim Speichern still durch ältere ersetzt (🦷 🧼 …), damit alte Geräte kein leeres Kästchen zeigen. Selbst gewählte Emojis bleiben jetzt, wie sie sind – bei Aufgaben, Belohnungen und Kindern. Die eingebauten Vorlagen nutzen weiter nur Emojis, die überall angezeigt werden.
- **🌐 Sprache mit mehreren Karten auf einer Seite:** Wählte man die Sprache von Hand (erstes Fenster, Assistent oder ⚙️), konnte eine andere Yippee!-Karte auf derselben Seite sie kurz darauf wieder zurückstellen. Die gewählte Sprache bleibt jetzt.
- **🧙 Einrichtungs-Assistent:** Zeichnete sich die Karte zwischendurch neu (z. B. weil auf einem anderen Gerät etwas gespeichert wurde), gingen gerade gesetzte Häkchen bei Aufgaben, Belohnungen oder Funktionen verloren. Die Auswahl bleibt jetzt erhalten.
- **🙋 Zusatzaufgaben im Eltern-Heute:** Nach Ablauf ihres Zeitfensters zeigten sie ein rotes ✕ wie verpasste Pflichtaufgaben – dabei sind sie freiwillig und können nicht verpasst werden. Jetzt ohne ✕.
- **📊 Berichte:** Der Reiter „Wochen“ war in einigen Sprachen klein geschrieben (z. B. Englisch „weeks“ neben „Days“).
- **Rückfragen „Wirklich …?“** (Alte Einträge aufräumen, PIN entfernen, Datenprüfung übernehmen, Punkte-Verlauf leeren): Zeichnete sich die Karte zwischen den beiden Tipps neu (z. B. weil ein anderes Gerät etwas gespeichert hat), war die Rückfrage weg und der zweite Tipp fragte erneut. Die Rückfrage bleibt jetzt 8 Sekunden lang bestehen.
- **Seite sprang beim Scrollen nach oben:** Nach dem Neuzeichnen stellt die Karte die Scroll-Position ein Bild später noch einmal her. Kam das verspätet (z. B. auf langsamen Tablets), konnte es eine inzwischen geänderte Position auf einen alten Stand zurücksetzen. Jetzt wird nur noch nachgestellt, wenn das Neuzeichnen die Seite verschoben hat.
- **🏠 Anwesenheit auf schmalen Handys:** Bei Regeln und Ausnahmen ragten die rechten Datumsfelder und der ✕-Knopf über den Rand.

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
