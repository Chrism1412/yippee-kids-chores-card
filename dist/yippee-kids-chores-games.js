/* Yippee! - Kids Chores – 🎮 Mini-Spiele mit dem Haustier
 * Wird erst geladen, wenn ein Spiel geöffnet wird (über das 🐾 Haustier).
 * Freizeit-Spiele bringen keine Sterne (nur Highscore) und haben ein Tageslimit.
 * Als Aufgabe (Aufgaben-Editor → 🎮 Spiel als Aufgabe) wird die Aufgabe nach dem Ziel automatisch abgehakt.
 */
export default function install(C, Y) {
  const { T, esc, dk, petDraw, KIND } = Y;

  // Spiele: eigenes Spiel je Tier + Spiele für alle (die mit task: true gehen auch als Aufgabe)
  const GAMES = {
    catch: { e: '🦴', n: 'Leckerli fangen', h: 'Schieb dein Tier hin und her und fang alles auf!' },
    whack: { e: '🐭', n: 'Mäuse fangen', h: 'Tipp die Mäuse an, bevor sie wieder weg sind!' },
    run: { e: '🌵', n: 'Hüpfen', h: 'Tippen = springen. Spring über die Hindernisse!' },
    fly: { e: '⭐', n: 'Sterne sammeln', h: 'Finger aufs Bild halten und hoch oder runter ziehen – sammle die Sterne!' },
    song: { e: '🎵', n: 'Lied nachspielen', h: 'Hör gut zu und tipp die Töne in der gleichen Reihenfolge!' },
    fire: { e: '✨', n: 'Glühwürmchen fangen', h: 'Tipp die Glühwürmchen an!' },
    memory: { e: '🧠', n: 'Memory', h: 'Finde die Paare!', task: true },
    move: { e: '🏃', n: 'Mach\'s nach', h: 'Mach die Bewegung mit und tipp dann auf ✅.', task: true },
    count: { e: '🔢', n: 'Zählen', h: 'Wie viele sind es?', task: true },
    math: { e: '🧮', n: 'Rechnen', h: 'Welche Schüssel hat das richtige Ergebnis?', task: true },
    clock: { e: '🕐', n: 'Uhr lesen', h: 'Wie spät ist es?', task: true },
    abc: { e: '🔤', n: 'Buchstaben & Wörter', h: 'Such den richtigen Buchstaben!', task: true },
    money: { e: '💰', n: 'Geld zählen', h: 'Wie viel Geld ist das?', task: true },
    puzzle: { e: '🧩', n: 'Schiebe-Puzzle', h: 'Schieb die Teile, bis das Bild wieder stimmt!' },
    simon: { e: '🌈', n: 'Farben merken', h: 'Merk dir die Farben und tipp sie nach!' },
    vocab: { e: '🇬🇧', n: 'Englisch-Wörter', h: 'Bilder, Wörter, Hören und Buchstaben – auf Englisch! Tipp auf 🔊, dann hörst du das Wort.', task: true },
    mul: { e: '✖️', n: 'Einmaleins', h: 'Such dir die Reihen aus – 10 Aufgaben gegen die Uhr!', task: true },
    maze: { e: '🏰', n: 'Labyrinth', h: 'Finde den Weg durch die Burg zum 👑 – unterwegs tauchen 📜 Schriftrollen mit Fragen auf!' },
    train: { e: '🚂', n: 'Zugfahrt', h: 'Tipp auf die richtige Antwort – dann fährt der Zug in den Bahnhof!' },
    board: { e: '🏴‍☠️', n: 'Schatzkarte', h: 'Würfle und finde den Schatz! Auf fast jedem Feld wartet eine Frage – auf den 🏖️ Rastplätzen darfst du verschnaufen.' },
    lily: { e: '🐸', n: 'Seerosen-Hüpfen', h: 'Hüpf auf die Seerose mit der richtigen Antwort!' },
    space: { e: '🚀', n: 'Weltraum', h: 'Tipp auf den Planeten mit der richtigen Antwort – dann fliegt die Rakete hin!' },
    dino: { e: '🦕', n: 'Dino-Ausgrabung', h: 'Klopf den Stein mit der richtigen Antwort frei – nach 6 Knochen steht das Dino-Skelett!' },
  };
  // 🇬🇧 Englisch-Wörter: [Emoji, Wort, ab Stufe] – Stufe 1 = 1. Klasse … 5 = ab 5. Klasse (Vorschule bekommt Stufe 1)
  const VOCAB = [
    ['🐶', 'dog', 1], ['🐱', 'cat', 1], ['🐭', 'mouse', 1], ['🐰', 'rabbit', 1], ['🐦', 'bird', 1], ['🐟', 'fish', 1], ['🐴', 'horse', 1], ['🐮', 'cow', 1], ['🐷', 'pig', 1], ['🦆', 'duck', 1],
    ['🐸', 'frog', 1], ['🐻', 'bear', 1], ['🦁', 'lion', 1], ['🐵', 'monkey', 1], ['🐘', 'elephant', 1], ['🐑', 'sheep', 1], ['🐔', 'chicken', 1], ['🐍', 'snake', 1], ['🐝', 'bee', 1], ['🦋', 'butterfly', 1],
    ['⚽', 'ball', 1], ['🚗', 'car', 1], ['🏠', 'house', 1], ['🌳', 'tree', 1], ['☀️', 'sun', 1], ['🌙', 'moon', 1], ['⭐', 'star', 1], ['🌸', 'flower', 1], ['🍎', 'apple', 1], ['🍌', 'banana', 1],
    ['🍞', 'bread', 2], ['🧀', 'cheese', 2], ['🥚', 'egg', 2], ['🥛', 'milk', 2], ['🎂', 'cake', 2], ['🍕', 'pizza', 2], ['🍓', 'strawberry', 2], ['🍇', 'grapes', 2], ['🍊', 'orange', 2], ['🥕', 'carrot', 2],
    ['🍦', 'ice cream', 2], ['🍪', 'cookie', 2], ['💧', 'water', 2], ['✋', 'hand', 2], ['🦶', 'foot', 2], ['👁️', 'eye', 2], ['👂', 'ear', 2], ['👃', 'nose', 2], ['👄', 'mouth', 2], ['🦷', 'tooth', 2],
    ['🎩', 'hat', 2], ['👟', 'shoe', 2], ['👕', 'T-shirt', 2], ['👗', 'dress', 2], ['🧦', 'socks', 2], ['👓', 'glasses', 2], ['🎒', 'school bag', 2], ['☂️', 'umbrella', 2], ['💍', 'ring', 2], ['👑', 'crown', 2],
    ['📖', 'book', 3], ['✏️', 'pencil', 3], ['🏫', 'school', 3], ['🚌', 'bus', 3], ['🚂', 'train', 3], ['✈️', 'plane', 3], ['🚢', 'ship', 3], ['🚲', 'bike', 3], ['🚀', 'rocket', 3], ['⛵', 'boat', 3],
    ['🛏️', 'bed', 3], ['🚪', 'door', 3], ['🔑', 'key', 3], ['⏰', 'clock', 3], ['📱', 'phone', 3], ['💻', 'computer', 3], ['📺', 'television', 3], ['💡', 'light bulb', 4], ['📦', 'box', 3], ['🎁', 'present', 3],
    ['✉️', 'letter', 3], ['🌧️', 'rain', 3], ['❄️', 'snow', 3], ['☁️', 'cloud', 3], ['🌈', 'rainbow', 3], ['🌬️', 'wind', 3], ['🔥', 'fire', 3], ['⛰️', 'mountain', 3], ['🏖️', 'beach', 3], ['🌊', 'wave', 3],
    ['🏃', 'run', 4], ['🏊', 'swim', 4], ['💃', 'dance', 4], ['🎤', 'microphone', 4], ['📚', 'books', 2], ['✍️', 'write', 4], ['😴', 'sleep', 4], ['😂', 'laugh', 4], ['😢', 'cry', 4], ['🍽️', 'plate', 3],
    ['🥤', 'cup', 2], ['🎮', 'game controller', 5], ['🍳', 'frying pan', 5], ['🎨', 'paints', 4], ['🎵', 'music', 4], ['🎸', 'guitar', 4], ['🥁', 'drum', 4], ['🏝️', 'island', 4], ['🌋', 'volcano', 4],
    ['🏜️', 'desert', 4], ['🏞️', 'river', 4], ['🌍', 'earth', 4], ['🍂', 'leaf', 4], ['🍄', 'mushroom', 4], ['🐢', 'turtle', 4], ['🦉', 'owl', 4], ['🐺', 'wolf', 4], ['🦊', 'fox', 4], ['🐧', 'penguin', 4],
    ['🏰', 'castle', 5], ['🌉', 'bridge', 5], ['🏥', 'hospital', 5], ['🚓', 'police car', 5], ['🚒', 'fire engine', 5], ['🚑', 'ambulance', 5], ['🚜', 'tractor', 5], ['🚁', 'helicopter', 5], ['⚓', 'anchor', 5], ['🧭', 'compass', 5],
    ['🗺️', 'map', 5], ['🔭', 'telescope', 5], ['🔬', 'microscope', 5], ['🧲', 'magnet', 5], ['🔋', 'battery', 5], ['💰', 'money', 5], ['🏦', 'bank', 5], ['📅', 'calendar', 5], ['📰', 'newspaper', 5], ['🚩', 'flag', 5],
    ['🏆', 'trophy', 5], ['🏅', 'medal', 5], ['🎫', 'ticket', 5], ['📷', 'camera', 5], ['🕯️', 'candle', 5], ['🧩', 'puzzle', 5], ['🪁', 'kite', 9], ['🌶️', 'chilli', 5], ['🥦', 'broccoli', 5], ['🧁', 'cupcake', 5],
    // Farben und Zahlen
    ['🔴', 'red', 1], ['🟢', 'green', 1], ['🔵', 'blue', 1], ['🟡', 'yellow', 1], ['🟣', 'purple', 2], ['⚫', 'black', 1], ['⚪', 'white', 1], ['🟤', 'brown', 2],
    ['1️⃣', 'one', 1], ['2️⃣', 'two', 1], ['3️⃣', 'three', 1], ['4️⃣', 'four', 1], ['5️⃣', 'five', 1], ['6️⃣', 'six', 2], ['7️⃣', 'seven', 2], ['8️⃣', 'eight', 2], ['9️⃣', 'nine', 2], ['🔟', 'ten', 2],
    // Familie und Gefühle
    ['👶', 'baby', 1], ['👦', 'boy', 1], ['👧', 'girl', 1], ['👨', 'man', 2], ['👩', 'woman', 2], ['👴', 'grandpa', 2], ['👵', 'grandma', 2], ['👪', 'family', 3],
    ['😀', 'happy', 3], ['😠', 'angry', 4], ['😨', 'scared', 4], ['🥱', 'tired', 4], ['🤒', 'ill', 4], ['😋', 'yummy', 4], ['🥶', 'cold', 3], ['🥵', 'hot', 3],
    // noch mehr Tiere
    ['🦒', 'giraffe', 2], ['🦓', 'zebra', 2], ['🐯', 'tiger', 2], ['🐊', 'crocodile', 3], ['🦈', 'shark', 3], ['🐳', 'whale', 3], ['🐬', 'dolphin', 3], ['🐙', 'octopus', 4], ['🦀', 'crab', 3], ['🐌', 'snail', 3],
    ['🐞', 'ladybird', 4], ['🕷️', 'spider', 3], ['🦄', 'unicorn', 2], ['🦖', 'dinosaur', 3], ['🐹', 'hamster', 2], ['🦔', 'hedgehog', 4], ['🐿️', 'squirrel', 5], ['🦌', 'deer', 4], ['🐐', 'goat', 3], ['🦜', 'parrot', 3],
    ['🐼', 'panda', 2], ['🐨', 'koala', 3], ['🦘', 'kangaroo', 4], ['🐫', 'camel', 3], ['🦩', 'flamingo', 4],
    // Essen und Trinken
    ['🍉', 'watermelon', 3], ['🍋', 'lemon', 2], ['🍒', 'cherries', 3], ['🍐', 'pear', 2], ['🍑', 'peach', 3], ['🍍', 'pineapple', 3], ['🥔', 'potato', 3], ['🍅', 'tomato', 2], ['🌽', 'corn', 3], ['🥒', 'cucumber', 4],
    ['🧅', 'onion', 4], ['🍔', 'burger', 2], ['🍟', 'chips', 2], ['🌭', 'hot dog', 2], ['🥪', 'sandwich', 3], ['🍝', 'spaghetti', 3], ['🍫', 'chocolate', 3], ['🍬', 'sweets', 3], ['🍯', 'honey', 3], ['🧃', 'juice', 2],
    ['☕', 'coffee', 3], ['🍵', 'tea', 2], ['🧈', 'butter', 3], ['🥨', 'pretzel', 4], ['🥞', 'pancakes', 4],
    // Zuhause, Schule, Spielzeug, Kleidung
    ['🪑', 'chair', 3], ['🛋️', 'sofa', 3], ['🛁', 'bath', 3], ['🪥', 'toothbrush', 4], ['🧸', 'teddy bear', 2], ['🎈', 'balloon', 2], ['🎲', 'dice', 4], ['🖍️', 'crayon', 4], ['✂️', 'scissors', 4], ['📏', 'ruler', 4],
    ['🪟', 'window', 3], ['🧤', 'gloves', 3], ['🧣', 'scarf', 3], ['👖', 'trousers', 3], ['🧢', 'cap', 2], ['👢', 'boots', 3], ['🩳', 'shorts', 3], ['🖼️', 'picture', 4], ['🔨', 'hammer', 4], ['🪣', 'bucket', 5],
    // Draußen und unterwegs
    ['🌻', 'sunflower', 3], ['🌵', 'cactus', 3], ['🌴', 'palm tree', 4], ['⛺', 'tent', 3], ['🛴', 'scooter', 3], ['🏍️', 'motorbike', 4], ['🚕', 'taxi', 2], ['🛶', 'canoe', 5], ['🚦', 'traffic light', 5],
    ['⛄', 'snowman', 3], ['⚡', 'lightning', 5], ['🌪️', 'tornado', 5], ['🎃', 'pumpkin', 3], ['🎄', 'Christmas tree', 3],
    // Körper
    ['💪', 'arm', 2], ['🦵', 'leg', 2], ['❤️', 'heart', 2], ['🧠', 'brain', 5], ['🦴', 'bone', 4],
  ].filter((w) => w[2] <= 5);
  // 🔊 auf Englisch vorlesen (Stimme des Geräts)
  const sayEn0 = (w) => {
    try {
      const ss = window.speechSynthesis; if (!ss || !w) return;
      ss.cancel(); const u = new SpeechSynthesisUtterance(w); u.lang = 'en-GB'; u.rate = 0.85;
      const v = (ss.getVoices() || []).find((x) => /^en[-_]GB/i.test(x.lang)) || (ss.getVoices() || []).find((x) => /^en/i.test(x.lang)); if (v) u.voice = v;
      ss.speak(u);
    } catch (e) { /* kein Vorlesen */ }
  };
  // 🔤 Wörter je Sprache (gleiche Reihenfolge wie WEM): Apfel, Ball, Katze, Hund, Fisch, Haus, Sonne, Mond, Baum, Auto, Stern, Brot, Ei, Blume, Maus, Pferd, Kuh, Vogel, Schiff, Hut
  const WEM = ['🍎', '⚽', '🐱', '🐶', '🐟', '🏠', '☀️', '🌙', '🌳', '🚗', '⭐', '🍞', '🥚', '🌸', '🐭', '🐴', '🐄', '🐦', '🚢', '🎩'];
  const WORDS = {
    de: 'APFEL BALL KATZE HUND FISCH HAUS SONNE MOND BAUM AUTO STERN BROT EI BLUME MAUS PFERD KUH VOGEL SCHIFF HUT',
    gsw: 'ÖPFEL BALL CHATZ HUND FISCH HUUS SUNNE MOND BAUM AUTO STÄRN BROT EI BLUEME MUUS ROSS CHUE VOGEL SCHIFF HUET',
    en: 'APPLE BALL CAT DOG FISH HOUSE SUN MOON TREE CAR STAR BREAD EGG FLOWER MOUSE HORSE COW BIRD SHIP HAT',
    fr: 'POMME BALLON CHAT CHIEN POISSON MAISON SOLEIL LUNE ARBRE VOITURE ÉTOILE PAIN ŒUF FLEUR SOURIS CHEVAL VACHE OISEAU BATEAU CHAPEAU',
    it: 'MELA PALLA GATTO CANE PESCE CASA SOLE LUNA ALBERO AUTO STELLA PANE UOVO FIORE TOPO CAVALLO MUCCA UCCELLO NAVE CAPPELLO',
    es: 'MANZANA PELOTA GATO PERRO PEZ CASA SOL LUNA ÁRBOL COCHE ESTRELLA PAN HUEVO FLOR RATÓN CABALLO VACA PÁJARO BARCO SOMBRERO',
    pt: 'MAÇÃ BOLA GATO CÃO PEIXE CASA SOL LUA ÁRVORE CARRO ESTRELA PÃO OVO FLOR RATO CAVALO VACA PÁSSARO BARCO CHAPÉU',
    nl: 'APPEL BAL KAT HOND VIS HUIS ZON MAAN BOOM AUTO STER BROOD EI BLOEM MUIS PAARD KOE VOGEL SCHIP HOED',
    da: 'ÆBLE BOLD KAT HUND FISK HUS SOL MÅNE TRÆ BIL STJERNE BRØD ÆG BLOMST MUS HEST KO FUGL SKIB HAT',
    sv: 'ÄPPLE BOLL KATT HUND FISK HUS SOL MÅNE TRÄD BIL STJÄRNA BRÖD ÄGG BLOMMA MUS HÄST KO FÅGEL SKEPP HATT',
    fi: 'OMENA PALLO KISSA KOIRA KALA TALO AURINKO KUU PUU AUTO TÄHTI LEIPÄ MUNA KUKKA HIIRI HEVONEN LEHMÄ LINTU LAIVA HATTU',
    pl: 'JABŁKO PIŁKA KOT PIES RYBA DOM SŁOŃCE KSIĘŻYC DRZEWO AUTO GWIAZDA CHLEB JAJKO KWIAT MYSZ KOŃ KROWA PTAK STATEK KAPELUSZ',
    cs: 'JABLKO MÍČ KOČKA PES RYBA DŮM SLUNCE MĚSÍC STROM AUTO HVĚZDA CHLÉB VEJCE KVĚTINA MYŠ KŮŇ KRÁVA PTÁK LOĎ KLOBOUK',
    sk: 'JABLKO LOPTA MAČKA PES RYBA DOM SLNKO MESIAC STROM AUTO HVIEZDA CHLIEB VAJCE KVET MYŠ KÔŇ KRAVA VTÁK LOĎ KLOBÚK',
    sl: 'JABOLKO ŽOGA MAČKA PES RIBA HIŠA SONCE LUNA DREVO AVTO ZVEZDA KRUH JAJCE CVET MIŠ KONJ KRAVA PTIČ LADJA KLOBUK',
    hr: 'JABUKA LOPTA MAČKA PAS RIBA KUĆA SUNCE MJESEC STABLO AUTO ZVIJEZDA KRUH JAJE CVIJET MIŠ KONJ KRAVA PTICA BROD ŠEŠIR',
    hu: 'ALMA LABDA MACSKA KUTYA HAL HÁZ NAP HOLD FA AUTÓ CSILLAG KENYÉR TOJÁS VIRÁG EGÉR LÓ TEHÉN MADÁR HAJÓ KALAP',
    ro: 'MĂR MINGE PISICĂ CÂINE PEȘTE CASĂ SOARE LUNĂ COPAC MAȘINĂ STEA PÂINE OU FLOARE ȘOARECE CAL VACĂ PASĂRE VAPOR PĂLĂRIE',
    bg: 'ЯБЪЛКА ТОПКА КОТКА КУЧЕ РИБА КЪЩА СЛЪНЦЕ ЛУНА ДЪРВО КОЛА ЗВЕЗДА ХЛЯБ ЯЙЦЕ ЦВЕТЕ МИШКА КОН КРАВА ПТИЦА КОРАБ ШАПКА',
    ru: 'ЯБЛОКО МЯЧ КОШКА СОБАКА РЫБА ДОМ СОЛНЦЕ ЛУНА ДЕРЕВО МАШИНА ЗВЕЗДА ХЛЕБ ЯЙЦО ЦВЕТОК МЫШЬ ЛОШАДЬ КОРОВА ПТИЦА КОРАБЛЬ ШЛЯПА',
    el: 'ΜΗΛΟ ΜΠΑΛΑ ΓΑΤΑ ΣΚΥΛΟΣ ΨΑΡΙ ΣΠΙΤΙ ΗΛΙΟΣ ΦΕΓΓΑΡΙ ΔΕΝΤΡΟ ΑΥΤΟΚΙΝΗΤΟ ΑΣΤΕΡΙ ΨΩΜΙ ΑΥΓΟ ΛΟΥΛΟΥΔΙ ΠΟΝΤΙΚΙ ΑΛΟΓΟ ΑΓΕΛΑΔΑ ΠΟΥΛΙ ΚΑΡΑΒΙ ΚΑΠΕΛΟ',
    tr: 'ELMA TOP KEDİ KÖPEK BALIK EV GÜNEŞ AY AĞAÇ ARABA YILDIZ EKMEK YUMURTA ÇİÇEK FARE AT İNEK KUŞ GEMİ ŞAPKA',
    et: 'ÕUN PALL KASS KOER KALA MAJA PÄIKE KUU PUU AUTO TÄHT LEIB MUNA LILL HIIR HOBUNE LEHM LIND LAEV MÜTS',
    lv: 'ĀBOLS BUMBA KAĶIS SUNS ZIVS MĀJA SAULE MĒNESS KOKS AUTO ZVAIGZNE MAIZE OLA PUĶE PELE ZIRGS GOVS PUTNS KUĢIS CEPURE',
    lt: 'OBUOLYS KAMUOLYS KATĖ ŠUO ŽUVIS NAMAS SAULĖ MĖNULIS MEDIS MAŠINA ŽVAIGŽDĖ DUONA KIAUŠINIS GĖLĖ PELĖ ARKLYS KARVĖ PAUKŠTIS LAIVAS KEPURĖ',
    ga: 'ÚLL LIATHRÓID CAT MADRA IASC TEACH GRIAN GEALACH CRANN CARR RÉALTA ARÁN UBH BLÁTH LUCH CAPALL BÓ ÉAN LONG HATA',
    mt: 'TUFFIEĦA BALLUN QATTUS KELB ĦUTA DAR XEMX QAMAR SIĠRA KARROZZA KEWKBA ĦOBŻ BAJDA FJURA ĠURDIEN ŻIEMEL BAQRA GĦASFUR VAPUR KAPPELL',
  };
  // 🪙 Münzen und Scheine je Währung (in kleinster Einheit, z. B. Cent)
  const COINS = {
    EUR: [1, 2, 5, 10, 20, 50, 100, 200], CHF: [5, 10, 20, 50, 100, 200, 500], GBP: [1, 2, 5, 10, 20, 50, 100, 200], USD: [1, 5, 10, 25, 100],
    DKK: [50, 100, 200, 500, 1000, 2000], SEK: [100, 200, 500, 1000], PLN: [1, 2, 5, 10, 20, 50, 100, 200, 500], CZK: [100, 200, 500, 1000, 2000, 5000],
    HUF: [500, 1000, 2000, 5000, 10000, 20000], RON: [1, 5, 10, 50, 100], BGN: [1, 2, 5, 10, 20, 50, 100, 200], RUB: [100, 200, 500, 1000], TRY: [1, 5, 10, 25, 50, 100],
  };
  const NOTES = { EUR: [500, 1000, 2000], CHF: [1000, 2000], GBP: [500, 1000, 2000], USD: [100, 500, 1000, 2000], DKK: [5000], SEK: [2000, 5000], PLN: [1000, 2000], CZK: [10000, 20000], HUF: [50000, 100000], RON: [500, 1000], BGN: [500, 1000], RUB: [5000, 10000], TRY: [500, 1000] };

  // Fragen für Labyrinth, Zugfahrt, Schatzkarte, Seerosen und die Fragetore im Abenteuer
  const QG = ['math', 'count', 'abc', 'clock', 'money'];
  const OWN = { dog: 'catch', cat: 'whack', dino: 'run', unicorn: 'fly', bird: 'song', hero: 'fly', fairy: 'fire' };
  const MOVES = [['🦘', 'Spring 5× hoch!'], ['🦢', 'Steh 10 Sekunden auf einem Bein!'], ['🙆', 'Streck dich ganz lang nach oben!'], ['⭐', 'Mach 5 Hampelmänner!'], ['🌀', 'Dreh dich 3× im Kreis!'], ['🦶', 'Berühr mit den Händen deine Zehen!'], ['🐸', 'Mach 3 Froschsprünge!'], ['🏃', 'Lauf 10 Sekunden auf der Stelle!'], ['🦀', 'Geh 5 Schritte wie ein Krebs!'], ['🤸', 'Kreis 5× mit den Armen!'], ['🐻', 'Lauf 5 Schritte wie ein Bär auf allen vieren!'], ['🦀', 'Lauf 5 Schritte seitwärts wie ein Krebs!'], ['🐧', 'Watschel wie ein Pinguin durchs Zimmer!'], ['👏', 'Klatsch 10× in die Hände!'], ['🏋️', 'Mach 5 Kniebeugen!'], ['🦩', 'Steh wie ein Flamingo – erst links, dann rechts!'], ['🥁', 'Trommel 10× auf deine Knie!'], ['🐒', 'Kratz dich wie ein Affe und mach „uh uh“!'], ['🧘', 'Atme 3× tief ein und aus!'], ['🐢', 'Kriech wie eine Schildkröte ganz langsam!']];
  const FALLBACK = ['🍎', '🚗', '🎈', '🐟', '🌻', '🍓', '⚽', '🦋', '🐶', '🍌', '🌈', '🚀', '🐢', '🍕', '🎁', '🐝']; // nur ältere Emojis, die überall angezeigt werden

  const CSS = `<style>
.gmov{position:fixed;inset:0;z-index:1000;display:grid;grid-template-rows:auto 1fr auto;background:linear-gradient(160deg,#e3fbee,#bdf0d5);color:#1f2433;font-family:inherit;padding:max(10px,env(safe-area-inset-top)) 12px max(14px,env(safe-area-inset-bottom));user-select:none;-webkit-user-select:none;touch-action:none}
.gmov.night{background:linear-gradient(160deg,#2b2f55,#1b1e3a);color:#e7e9ff}
.gmhd{display:flex;align-items:center;gap:10px}.gmhd b{font-size:20px;flex:1}.gmhd .gmsc{font-weight:900;font-size:22px}.gmhd button{font-size:22px;width:44px;height:44px;border-radius:12px;border:0;background:rgba(255,255,255,.7);cursor:pointer}
.gmar{position:relative;overflow:hidden;border-radius:22px;background:rgba(255,255,255,.35);margin:10px 0;touch-action:none}
.gmft{display:grid;gap:8px;text-align:center}.gmft .hint{font-size:15px}
.gmbtn{min-height:56px;border:0;border-radius:16px;font:inherit;font-weight:800;font-size:18px;background:#5b61ff;color:#fff;cursor:pointer}
.gmbtn.sec{background:rgba(255,255,255,.8);color:#1f2433}
.gmit{position:absolute;font-size:38px;line-height:1;transform:translate(-50%,-50%);pointer-events:none}
.gmpet{position:absolute;transform:translate(-50%,-100%);pointer-events:none}.gmpet svg{display:block}
.gmhole{position:absolute;width:26%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 50% 60%,#5c3d23,#8a5f2a 60%,#b98a4f);transform:translate(-50%,-50%);display:grid;place-items:center;font-size:44px;cursor:pointer}
.gmhole span{transition:transform .12s}.gmhole.up span{transform:translateY(-6px) scale(1.1)}
.gmglow{position:absolute;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff9c4,rgba(255,236,153,.6) 40%,rgba(255,236,153,0) 70%);display:grid;place-items:center;font-size:26px;transform:translate(-50%,-50%);cursor:pointer}
.gmmenu{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;align-content:start;padding:6px}
.gmmenu button{display:grid;justify-items:center;gap:4px;padding:14px 8px;border-radius:18px;border:0;background:rgba(255,255,255,.85);font:inherit;font-weight:800;font-size:16px;color:#1f2433;cursor:pointer}.gmmenu button i{font-style:normal;font-size:40px}.gmmenu button small{font-weight:600;opacity:.65}
.gmmenu button.own{box-shadow:0 0 0 3px #5b61ff}
.gmrep{align-self:center;justify-self:center;padding:3px 12px;border-radius:999px;background:#fff3bf;color:#7a4b00;font-weight:800;font-size:13px;margin-bottom:6px}
.gmmem{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px;align-content:center;justify-content:center;height:100%;box-sizing:border-box}
.gmcard{aspect-ratio:3/4;border-radius:14px;border:0;font-size:clamp(28px,8vw,48px);background:linear-gradient(135deg,#748ffc,#5b61ff);color:transparent;cursor:pointer;transition:transform .2s}
.gmcard.on,.gmcard.ok{background:#fff;color:inherit;transform:rotateY(0)}.gmcard.ok{opacity:.55}
.gmsong{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;height:100%;box-sizing:border-box}
.gmsong button{border:0;border-radius:22px;font-size:40px;cursor:pointer;opacity:.75;transition:transform .1s,opacity .1s}.gmsong button.lit{opacity:1;transform:scale(1.05);box-shadow:0 0 0 6px #fff}
.gmq{display:grid;gap:14px;justify-items:center;align-content:center;height:100%;padding:10px;box-sizing:border-box;text-align:center}
.gmq .gmshow{font-size:clamp(28px,8vw,44px);display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:420px}.gmq .gmtask{font-size:clamp(34px,10vw,56px);font-weight:900}
.gmans{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:min(440px,100%)}
.gmans button{min-height:84px;border:0;border-radius:20px;background:#fff;font:inherit;font-size:32px;font-weight:900;color:#1f2433;cursor:pointer;display:grid;place-items:center}
.gmans button small{font-size:24px}.gmans button.ok{background:#b2f2bb}.gmans button.no{background:#ffc9c9;opacity:.6}
.gmans button.sol{background:#b2f2bb;box-shadow:0 0 0 4px #2f9e44;animation:gmsol .6s ease 2}@keyframes gmsol{50%{transform:scale(1.08)}}
.gmsol{min-height:22px;font-weight:800;text-align:center}
.gmmw{min-height:0;overflow:auto;display:grid;align-content:start;gap:4px;margin-top:6px}
.gmjr{position:relative;display:flex;align-items:center;justify-content:center;gap:14px;width:100%;min-height:118px;margin:4px 0;padding:8px 16px;border:0;border-radius:20px;overflow:hidden;cursor:pointer;font:inherit;color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.18);
  background:radial-gradient(120% 60% at 30% 118%,#7ccf6b 58%,transparent 59%),radial-gradient(90% 55% at 85% 125%,#a6e39a 60%,transparent 61%),linear-gradient(#5fb8ff,#bfe8ff)}
.gmjrp{flex:0 0 auto;width:110px;height:110px;margin-bottom:-14px}.gmjrp svg{width:100%;height:100%;display:block}
.gmjrt{display:grid;gap:4px;justify-items:center;text-align:center}
.gmjrt b{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-weight:900;font-size:clamp(20px,5.5vw,34px);line-height:1.05;text-transform:uppercase;letter-spacing:1px;color:#ffd43b;
  text-shadow:2px 0 #7a2e00,-2px 0 #7a2e00,0 2px #7a2e00,0 -2px #7a2e00,2px 2px #7a2e00,-2px -2px #7a2e00,2px -2px #7a2e00,-2px 2px #7a2e00,0 5px 0 #3b1500}
.gmjrt small{font-size:13px;font-weight:800;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.45)}
.gmmoney{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;max-width:440px}
.gmmini .gmmoney{gap:4px}.gmmini .gmcoin{width:38px;height:38px;font-size:11px;border-width:2px}.gmmini .gmcoin.cu{width:32px;height:32px;font-size:13px}.gmmini .gmnote{min-width:58px;height:34px;font-size:11px}
.gmcoin{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3bf,#fcc419 55%,#e8a600);border:3px solid #d99000;font-weight:900;font-size:17px;color:#5c3d00;box-shadow:0 3px 0 rgba(0,0,0,.18)}
.gmcoin.cu{width:54px;height:54px;font-size:22px;background:radial-gradient(circle at 35% 30%,#ffe8cc,#e8590c 60%,#a5400a);border-color:#a5400a;color:#fff}
.gmnote{display:grid;place-items:center;min-width:96px;height:56px;padding:0 8px;border-radius:8px;background:linear-gradient(135deg,#d3f9d8,#8ce99a);border:2px solid #2f9e44;font-weight:900;font-size:17px;color:#1b4d2b;box-shadow:0 3px 0 rgba(0,0,0,.15)}
.gmpzw{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:100%;padding:8px;box-sizing:border-box}
.gmpzw.row{flex-direction:row;gap:18px}
.gmpzs{display:flex;flex-direction:column;align-items:center;gap:8px}.gmpzw:not(.row) .gmpzs{flex-direction:row;flex-wrap:wrap;justify-content:center}
.gmpzt{display:flex;align-items:center;gap:8px;max-width:330px}.gmpzw.row .gmpzt{flex-direction:column;text-align:center;max-width:150px}.gmpzt small{font-size:12px;font-weight:700;opacity:.75;line-height:1.25}
.gmpzv{position:relative;flex:none;border-radius:10px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.18)}.gmpzv>svg{position:absolute;inset:0;width:100%;height:100%}
.gmpzv b{position:absolute;box-sizing:border-box;border:1px solid rgba(255,255,255,.75);display:flex;align-items:flex-start;justify-content:flex-start;padding:1px 3px;font-size:10px;font-weight:900;color:#5b61ff;text-shadow:0 0 2px #fff}
.gmpzv b.gp{background:rgba(255,255,255,.85);border:2px dashed #5b61ff}
.gmpzb{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.gmpzw.row .gmpzb{flex-direction:column}
.gmpzb button{min-height:42px;padding:0 14px;border:0;border-radius:14px;background:rgba(255,255,255,.9);font:inherit;font-weight:800;font-size:15px;color:#1f2433;cursor:pointer;box-shadow:0 2px 0 rgba(0,0,0,.1)}
.gmpz{position:relative;flex:none;border-radius:16px;background:rgba(255,255,255,.5)}
.gmpz button{position:absolute;padding:0;border:0;border-radius:10px;overflow:hidden;background:#f4fff9;cursor:pointer;transition:left .12s,top .12s;box-shadow:inset 0 0 0 2px rgba(0,0,0,.08)}
.gmpz button.mv{box-shadow:inset 0 0 0 3px rgba(91,97,255,.55)}.gmpz button.tip{animation:gmtip .5s ease-in-out infinite alternate;z-index:2}
@keyframes gmtip{from{box-shadow:inset 0 0 0 4px #fab005,0 0 0 0 rgba(250,176,5,.6)}to{box-shadow:inset 0 0 0 4px #fab005,0 0 0 8px rgba(250,176,5,0)}}
.gmpz button>*{pointer-events:none}.gmpz button span{position:absolute;display:block;pointer-events:none}.gmpz button span svg{width:100%;height:100%}.gmpz button i{position:absolute;left:5px;top:5px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:0 4px;border-radius:999px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);font-style:normal;font-weight:900;color:#5b61ff;line-height:1}
.gmsw{display:flex;flex-direction:column;height:100%;gap:4px}.gmsw .gmsong{flex:1;height:auto;min-height:0}.gmsbar{display:flex;justify-content:flex-end;padding:6px 12px 0}.gmsbar button{min-height:36px;padding:0 12px;border:0;border-radius:12px;background:rgba(255,255,255,.9);font:inherit;font-weight:800;font-size:14px;cursor:pointer}
.gmsong.simon.shp button{font-size:clamp(48px,14vw,84px);color:#fff;line-height:1;text-shadow:0 0 3px rgba(0,0,0,.55),0 2px 0 rgba(0,0,0,.35);-webkit-text-stroke:2px rgba(0,0,0,.35)}
.gmsong.simon{position:relative}.gmsimp{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;background:rgba(255,255,255,.9);border-radius:50%;padding:6px}
.gmmv{font-size:90px;animation:gmbob 1s ease-in-out infinite}@keyframes gmbob{50%{transform:translateY(-14px)}}
.gmbar{width:min(420px,90%);height:12px;border-radius:8px;background:rgba(255,255,255,.7);overflow:hidden;margin:0 auto}.gmbar i{display:block;height:100%;background:linear-gradient(90deg,#51cf66,#2f9e44)}
.gmend{display:grid;gap:10px;justify-items:center;align-content:center;height:100%;text-align:center}.gmtl{padding:6px 14px;border-radius:999px;background:#fff3bf;font-weight:900;font-size:18px}.gmend .big{font-size:64px}.gmend b{font-size:24px}
.gmpop{position:absolute;font-size:22px;font-weight:900;color:#2f9e44;pointer-events:none;animation:gmpop .9s ease-out forwards;transform:translate(-50%,-50%)}@keyframes gmpop{to{opacity:0;transform:translate(-50%,-140%)}}
.gmqp{position:absolute;inset:0;z-index:6;background:rgba(240,255,246,.97);overflow:auto;touch-action:pan-y}
.gmcol{display:flex;flex-direction:column;height:100%;gap:6px;padding:6px;box-sizing:border-box}.gmmzw{flex:1;min-height:0;display:grid;place-items:center}
.gmmz{position:relative;display:grid;background:#b39d6e;border-radius:6px;overflow:hidden;box-shadow:0 8px 22px rgba(0,0,0,.45);border:4px solid #4b4f57}
.gmcol.mzc{background:linear-gradient(#5b6b8c,#2d3a55);border-radius:18px}.mzc .gmctl{background:linear-gradient(#f3e3b5,#dcc287);color:#3b2a14;border:3px solid #6b4c22;border-radius:12px;padding:6px 10px}
.mzc .gmdp button{background:repeating-linear-gradient(#9aa0a9 0 10px,#8a8f98 10px 11px);color:#fff;border:2px solid #4b4f57;box-shadow:0 3px 0 #3b3f46}
.gmmz i{font-style:normal;display:grid;place-items:center;min-width:0;min-height:0;font-size:min(4vw,20px);line-height:1;background:radial-gradient(circle at 30% 30%,#c9b48a 0 18%,transparent 19%),radial-gradient(circle at 75% 70%,#bfa978 0 16%,transparent 17%),#b39d6e}
.gmmz i.w{background:linear-gradient(90deg,transparent 47%,#5c616a 47% 53%,transparent 53%) 0 0/100% 50% no-repeat,linear-gradient(90deg,#5c616a 0 6%,transparent 6% 94%,#5c616a 94%) 0 100%/100% 50% no-repeat,linear-gradient(#5c616a 0 6%,transparent 6% 47%,#5c616a 47% 53%,transparent 53%),#8a8f98;box-shadow:inset 0 -2px 0 rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.18)}
.gmmz i.cr{background:linear-gradient(#4f5d7d 0 42%,transparent 42%),linear-gradient(90deg,transparent 47%,#5c616a 47% 53%,transparent 53%) 0 100%/100% 50% no-repeat,#8a8f98}
.gmmz i.dr{background:#6b4c22}.gmmz i.gl{background:radial-gradient(circle,#fff3bf,#fcc419);box-shadow:0 0 12px #ffe066}
.gmmz i.t{animation:gmglow 1.1s ease-in-out infinite alternate}.gmmz i.t b{font-size:75%;animation:gmfl .45s ease-in-out infinite alternate;transform-origin:50% 90%;filter:drop-shadow(0 0 4px #ffa94d)}
@keyframes gmfl{0%{transform:scale(1,1) rotate(-3deg);opacity:.85}50%{transform:scale(.9,1.12) rotate(2deg);opacity:1}100%{transform:scale(1.08,.94) rotate(-1deg);opacity:.9}}
@keyframes gmglow{from{box-shadow:inset 0 0 6px rgba(255,169,77,.35)}to{box-shadow:inset 0 0 14px rgba(255,169,77,.75)}}
.gmmz i.sh b{font-size:70%;opacity:.9}.gmmz i.q{font-size:0}.gmmz i.q.rv{font-size:min(4vw,20px);background:radial-gradient(circle,#fff3bf 0 35%,transparent 62%),#b39d6e;animation:gmrv .5s ease-out}
@keyframes gmrv{0%{transform:scale(.2);filter:brightness(2)}70%{transform:scale(1.25)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){.gmmz i.t,.gmmz i.t b,.gmmz i.q.rv{animation:none}}
.gmmp{position:absolute;transition:left .09s linear,top .09s linear;display:grid;place-items:center;pointer-events:none}.gmmp svg,.gmmp>div{width:100%;height:100%}
.gmctl{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 4px;flex:0 0 auto}
.gmqs{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center;font-size:18px;font-weight:800}.gmqs b.on{color:#2f9e44;text-decoration:underline}
.gmdp{display:grid;grid-template-columns:repeat(3,56px);grid-template-rows:repeat(3,50px);gap:4px}
.gmdp button{border:0;border-radius:14px;background:#fff;font-size:24px;font-weight:900;color:#1f2433;box-shadow:0 3px 0 rgba(0,0,0,.15);cursor:pointer;touch-action:manipulation}
.gmdp button:active{transform:translateY(2px)}.gmdp [data-d=u]{grid-column:2;grid-row:1}.gmdp [data-d=l]{grid-column:1;grid-row:2}.gmdp [data-d=r]{grid-column:3;grid-row:2}.gmdp [data-d=d]{grid-column:2;grid-row:3}
.gmtr,.gmly,.gmbd{display:flex;flex-direction:column;height:100%;gap:6px;padding:6px;box-sizing:border-box}.gmq.gmtrq,.gmq.gmlyq{height:auto;flex:0 0 auto;padding:4px;gap:6px}
.gmtrs{position:relative;flex:1;min-height:200px;border-radius:16px;background:linear-gradient(#d3f9d8,#b2f2bb);overflow:hidden}
.gmtrs svg{position:absolute;inset:0;width:100%;height:100%}.gmtrs .rl path{fill:none;stroke:#8d6e63;stroke-width:7;stroke-dasharray:3 5;vector-effect:non-scaling-stroke}
.gmtrn{position:absolute;transform:translate(-50%,-62%) scaleX(-1);font-size:42px;line-height:1;transition:left .4s ease-in-out,top .4s ease-in-out;z-index:2;pointer-events:none}
.gmsig{position:absolute;right:3%;transform:translateY(-50%);min-width:84px;max-width:46%;min-height:50px;padding:6px 10px;border:3px solid #495057;border-radius:12px;background:#fff;font:inherit;font-size:22px;font-weight:900;color:#1f2433;cursor:pointer;display:grid;place-items:center}
.gmsig.ok{background:#b2f2bb;border-color:#2f9e44}.gmsig.no{background:#ffc9c9}.gmsig.sol{box-shadow:0 0 0 4px #2f9e44}
.gmly{background:linear-gradient(#b7e4c7,#74c69d);border-radius:18px}
.gmlyp{position:relative;flex:1;min-height:220px;border-radius:46% 54% 40% 60% / 18% 22% 16% 20%;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,#74c0fc 0,#339af0 45%,#1c7ed6 75%,#1864ab 100%);box-shadow:inset 0 0 0 8px #8c6d46,inset 0 0 0 13px #a98b5f,inset 0 10px 30px rgba(0,0,0,.25)}
.gmlyp:before{content:'';position:absolute;inset:0;background:repeating-radial-gradient(circle at 30% 60%,transparent 0 22px,rgba(255,255,255,.06) 22px 24px);pointer-events:none}
.gmlyp .rip{position:absolute;aspect-ratio:3/1;border:2px solid rgba(255,255,255,.45);border-radius:50%;pointer-events:none;animation:gmrip 4s ease-in-out infinite}@keyframes gmrip{50%{transform:scale(1.15);opacity:.5}}
.gmlyp .lot{position:absolute;width:12%;transform:translate(-50%,-50%);pointer-events:none}
.gmlyp .sw{position:absolute;left:-12%;font-size:22px;pointer-events:none;animation:gmsw 16s linear infinite}.gmlyp .sw span{display:inline-block;animation:gmswf 16s steps(1) infinite}
.gmlyp .sw.fi{opacity:.6;filter:saturate(.6)}.gmlyp .sw.du{font-size:26px}.gmlyp .sw.du i{display:inline-block;font-style:normal;animation:gmbob 1.6s ease-in-out infinite}
@keyframes gmsw{0%{left:-12%}48%{left:102%}50%{left:102%}98%{left:-12%}100%{left:-12%}}@keyframes gmswf{0%{transform:scaleX(-1)}49%{transform:scaleX(1)}99%{transform:scaleX(-1)}}@keyframes gmbob{50%{transform:translateY(-3px) rotate(-4deg)}}
.gmlyp .shore{position:absolute;left:0;right:0;bottom:0;height:20%;background:radial-gradient(ellipse at 50% 120%,#95d5b2 0 55%,#52b788 56% 70%,transparent 71%);pointer-events:none}
.gmlyp .stn{position:absolute;bottom:6%;width:9%;aspect-ratio:1.4;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ced4da,#868e96);pointer-events:none}
.gmlyp .reed{position:absolute;bottom:0;z-index:1;pointer-events:none}
@media (prefers-reduced-motion: reduce){.gmlyp .sw,.gmlyp .sw span,.gmlyp .sw i,.gmlyp .rip{animation:none}.gmlyp .sw{left:20%}}
.gmlil{position:absolute;top:22%;z-index:2;transform:translateX(-50%);width:min(30%,130px);aspect-ratio:1;border:0;border-radius:50%;background:transparent;color:#1b4332;font:inherit;font-size:22px;font-weight:900;display:grid;place-items:center;cursor:pointer;animation:gmbobl 2.4s ease-in-out infinite;padding:6px}
.gmlil>svg{position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 4px 2px rgba(0,0,0,.25));pointer-events:none}.gmlil>span{position:relative;background:rgba(255,255,255,.8);padding:2px 8px;border-radius:10px;max-width:92%;overflow:hidden}
@keyframes gmbobl{50%{margin-top:10px}}.gmlil.ok{box-shadow:0 0 0 6px #ffd43b,0 0 22px #ffd43b}.gmlil.sol{box-shadow:0 0 0 6px #fff,0 0 22px #fff;animation:none;margin-top:0}.gmlil.sol::after{content:'✓';position:absolute;top:2px;right:8px;font-size:22px;color:#fff}.gmlil.sink{opacity:.25;transform:translateX(-50%) scale(.6);transition:all .5s}
.gmlyf{position:absolute;z-index:3;left:50%;bottom:4%;transform:translateX(-50%);transition:left .35s ease,bottom .35s ease;pointer-events:none}.gmlyf.hop{bottom:46%}.gmlyf.splash::after{content:'💦';position:absolute;left:50%;top:0;font-size:42px;transform:translateX(-50%)}
.gmbd.pir{background:repeating-linear-gradient(90deg,#8d5a2b 0 58px,#7a4b22 58px 60px),#8d5a2b;border-radius:18px}
.gmbd.pir .gmctl{background:radial-gradient(#fbf0cf,#e9cf92);color:#4a2a10;border:3px solid #5c3416;border-radius:12px;padding:6px 10px}
.gmbd.pir .gmdice{background:#f8f0dc;border:3px solid #5c3416;box-shadow:0 4px 0 #3b2410}
.gmbdw{flex:1;min-height:0;container-type:size;display:grid;place-items:center}
.gmbdb{position:relative;width:min(100cqw,78.9cqh);aspect-ratio:600/760;border-radius:18px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.35)}
.gmbdb>svg{position:absolute;inset:0;width:100%;height:100%}
.gmbdb .dc{position:absolute;transform:translate(-50%,-50%);font-size:min(7cqw,28px);line-height:1;pointer-events:none}
.gmbdb i{position:absolute;transform:translate(-50%,-50%);width:11%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff8e6,#e2c690);border:2px solid #7a4a1d;box-shadow:0 2px 0 #5c3416;display:grid;place-items:center;font-style:normal;font-size:min(5cqw,20px);min-width:0}
.gmbdb i.q{background:radial-gradient(circle at 35% 30%,#e8504b,#a61e1e);border-color:#6b1010;box-shadow:0 2px 0 #4a0b0b;color:#ffe8a3;font-weight:900;font-family:Georgia,serif;font-size:min(6cqw,24px)}
.gmbdb i.safe{background:radial-gradient(circle at 35% 30%,#f4fce3,#b2f2bb);border-color:#2f9e44;box-shadow:0 2px 0 #2b8a3e}
.gmbdb i.end{width:15%;z-index:1;background:radial-gradient(circle at 35% 30%,#fff3bf,#fcc419);border-color:#a0620a;box-shadow:0 0 14px #ffe066}
.gmbdb i.end b{position:absolute;inset:-14%;display:grid;place-items:center;color:#a61e1e;font-size:min(13cqw,50px);font-weight:900;opacity:.6;pointer-events:none;z-index:-1}
.gmbdb i.end svg{position:absolute;inset:8%;width:84%;height:84%}
.gmbdb em{position:absolute;left:50%;bottom:40%;transform:translateX(-50%);display:flex;align-items:flex-end;justify-content:center;gap:1px;font-style:normal;width:170%;z-index:2}.gmbdb em span{position:relative;width:55%;display:grid;place-items:center;font-size:min(6cqw,22px);line-height:1}.gmbdb em span>svg:not(.hat),.gmbdb em span>div{width:100%;height:auto}
.gmbdb em .hat{position:absolute;left:50%;top:-30%;width:90%;transform:translateX(-50%);z-index:1}
.gmdice{border:0;border-radius:18px;background:#fff;font-size:42px;width:84px;height:70px;box-shadow:0 3px 0 rgba(0,0,0,.15);cursor:pointer;flex:0 0 auto}.gmdice[disabled]{opacity:.5}
.gmch{display:grid;grid-template-columns:1fr auto;align-items:center;gap:2px 10px;width:100%;margin:2px 0 6px;padding:10px 14px;border:0;border-radius:16px;background:linear-gradient(135deg,#fff3bf,#ffd8a8);color:#5c3c00;font:inherit;text-align:left;cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,.12)}
.gmch b{font-size:16px}.gmch span{grid-column:1;font-weight:700;font-size:14px}.gmch small{grid-column:2;grid-row:1/3;font-weight:900;font-size:15px}.gmch .gmchp{grid-column:1/-1;height:8px;border-radius:4px;background:rgba(0,0,0,.12);overflow:hidden}.gmch .gmchp i{display:block;height:100%;background:#f08c00;border-radius:4px}
.gmch.ok{background:linear-gradient(135deg,#d3f9d8,#b2f2bb);color:#2b8a3e}.gmch.ok .gmchp i{background:#2f9e44}.gmmenu button{position:relative}.gmmenu button.ch{box-shadow:0 0 0 3px #f08c00}.gmmenu button em{position:absolute;top:4px;right:6px;font-style:normal;font-size:18px}.gmchm{background:#ffe8cc}
.gmsp,.gmdn{display:flex;flex-direction:column;height:100%;gap:6px;padding:6px;box-sizing:border-box}.gmq.gmspq,.gmq.gmdnq{height:auto;flex:0 0 auto;padding:4px;gap:6px}
.gmsp{background:linear-gradient(#0b1033,#1b2a6b);border-radius:18px;color:#e7e9ff}.gmsp .gmq{color:#fff}.gmsp .gmctl{color:#e7e9ff}
.gmsps{position:relative;flex:1;min-height:200px;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 18% 22%,#fff 0 1px,transparent 2px),radial-gradient(circle at 72% 14%,#fff 0 1.5px,transparent 2.5px),radial-gradient(circle at 46% 58%,#fff 0 1px,transparent 2px),radial-gradient(circle at 88% 64%,#fff 0 1px,transparent 2px),radial-gradient(circle at 30% 80%,#fff 0 1.2px,transparent 2.2px),radial-gradient(circle at 60% 36%,#ffe066 0 1px,transparent 2px),radial-gradient(ellipse at 70% 120%,#5f3dc4 0,transparent 60%),#10173f}
.gmsps .tw{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;animation:gmtw 2s ease-in-out infinite}@keyframes gmtw{50%{opacity:.2}}
.gmpl{position:absolute;top:30%;transform:translate(-50%,-50%);width:min(28%,26cqh,120px);aspect-ratio:1;border:0;border-radius:50%;color:#fff;font:inherit;font-size:20px;font-weight:900;display:grid;place-items:center;cursor:pointer;text-shadow:0 1px 3px rgba(0,0,0,.6);box-shadow:inset -10px -10px 18px rgba(0,0,0,.35),0 0 18px rgba(255,255,255,.18);padding:4px}
.gmpl::after{content:'';position:absolute;left:-18%;right:-18%;top:44%;height:14%;border-radius:50%;border:3px solid rgba(255,255,255,.55);transform:rotate(-14deg);pointer-events:none;display:var(--ring,none)}
.gmpl span{position:relative;z-index:1}.gmpl.ok{box-shadow:0 0 0 5px #8ce99a,0 0 30px #8ce99a}.gmpl.no{filter:grayscale(.7);opacity:.6}.gmpl.sol{box-shadow:0 0 0 5px #8ce99a,0 0 30px #8ce99a;animation:gmsol .6s ease 2}
.gmsps{container-type:size}.gmrk{position:absolute;left:50%;top:86%;transform:translate(-50%,-50%);font-size:44px;line-height:1;transition:left .7s ease-in-out,top .7s ease-in-out;z-index:2;pointer-events:none}.gmrk i{display:inline-block;font-style:normal;transform:rotate(-45deg)}.gmrk.boom i{animation:gmwob .5s ease 2}@keyframes gmwob{25%{transform:rotate(-70deg)}75%{transform:rotate(-20deg)}}
.gmrk::after{content:'';position:absolute;left:50%;top:92%;width:10px;height:22px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(#ffe066,#ff922b 60%,transparent 70%);animation:gmfl .2s ease-in-out infinite alternate}
.gmdn{background:linear-gradient(#ffe8a3,#e9c46a);border-radius:18px}
.gmdns{position:relative;flex:1;min-height:220px;border-radius:16px;overflow:hidden;display:grid;grid-template-rows:minmax(0,1fr) auto;background:linear-gradient(transparent 40%,rgba(160,110,50,.18) 40% 42%,transparent 42% 60%,rgba(160,110,50,.2) 60% 62%,transparent 62% 80%,rgba(160,110,50,.22) 80% 82%,transparent 82%),radial-gradient(ellipse at 50% 110%,#c69a5a,#dcb77a 60%,#f0d9a6)}
.gmsk{width:100%;height:100%;min-height:0;display:block}.gmsk .gh{fill:none;stroke:rgba(110,70,30,.35);stroke-width:5;stroke-dasharray:6 6;stroke-linecap:round}.gmsk .bn{fill:none;stroke:#fff8e1;stroke-width:7;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 0 #b08348);animation:gmbn .5s ease-out}.gmsk .bf{fill:#fff8e1;stroke:#b08348;stroke-width:2}@keyframes gmbn{from{opacity:0;transform:scale(.8)}}
.gmsts{display:flex;justify-content:center;gap:10px;padding:8px}.gmstn{position:relative;flex:0 1 120px;min-height:74px;border:0;border-radius:46% 54% 42% 58%/55% 45% 55% 45%;background:radial-gradient(circle at 35% 30%,#ced4da,#868e96 70%,#5c636a);color:#fff;font:inherit;font-size:20px;font-weight:900;cursor:pointer;text-shadow:0 1px 2px rgba(0,0,0,.6);box-shadow:inset -6px -8px 12px rgba(0,0,0,.3),0 4px 0 rgba(0,0,0,.2);padding:6px}
.gmstn.no{animation:gmwob2 .4s ease 2;opacity:.6}@keyframes gmwob2{25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}}.gmstn.ok,.gmstn.sol{background:radial-gradient(circle at 50% 50%,#fff3bf,#e9c46a 70%);color:#5c3c00;text-shadow:none}.gmstn.sol{box-shadow:0 0 0 4px #2f9e44}
.gmstn.ok::after{content:'🦴';position:absolute;left:50%;top:-22px;transform:translateX(-50%);font-size:30px;animation:gmpop2 .6s ease-out}@keyframes gmpop2{from{transform:translate(-50%,20px) scale(.4)}}
.gmham{position:absolute;font-size:34px;pointer-events:none;animation:gmham .45s ease-in-out 2;z-index:3}@keyframes gmham{50%{transform:rotate(-40deg)}}
@media (prefers-reduced-motion: reduce){.gmsps .tw,.gmrk::after,.gmsk .bn,.gmham,.gmstn.no,.gmrk.boom i{animation:none}}
/* 📱 Querformat auf dem Handy: wenig Höhe → Kopf schlanker, Frage links / Antworten rechts, Spielfelder nebeneinander */
@media (orientation:landscape) and (max-height:520px){
.gmov{padding:max(4px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(4px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left))}
.gmhd{gap:8px}.gmhd b{font-size:16px}.gmhd .gmsc{font-size:18px}.gmhd button{width:36px;height:36px;font-size:18px;border-radius:10px}
.gmar{margin:4px 0;border-radius:16px}.gmft{gap:4px}.gmft .hint{display:none}.gmbtn{min-height:44px}
.gmq{overflow-y:auto;touch-action:pan-y;gap:6px;padding:6px}
.gmq .gmtask{font-size:min(40px,10vh)!important}.gmq .gmshow{font-size:min(34px,8vh)}.gmmv{font-size:56px}
.gmq>svg,.gmq>div>svg{max-height:46vh;width:auto}
.gmq:has(>.gmans){grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);grid-template-rows:repeat(7,auto);row-gap:0;column-gap:18px;align-content:center}
.gmq:has(>.gmans)>*{grid-column:1;margin:3px 0}.gmq:has(>.gmans)>.gmans{grid-column:2;grid-row:1/-1;align-self:center;width:100%;margin:0}
.gmans{gap:8px}.gmans button{min-height:58px;font-size:26px;border-radius:16px}.gmans button small{font-size:18px}
.gmmenu{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}.gmmenu button{padding:8px 6px;font-size:14px;border-radius:14px}.gmmenu button i{font-size:30px}
.gmjr{min-height:72px}.gmjrp{width:72px;height:72px;margin-bottom:-8px}
.gmhole{width:auto;height:27%;font-size:34px}
.gmmem{grid-template-columns:repeat(6,1fr)}.gmcard{font-size:min(36px,8vh)}
.gmcol.mzc{flex-direction:row;align-items:stretch}.mzc .gmctl{flex-direction:column;justify-content:center;width:min(34%,230px)}
.gmtr,.gmly,.gmsp,.gmdn{display:grid;grid-template-columns:minmax(0,36%) minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto auto;column-gap:10px;row-gap:4px}
.gmtr>*,.gmly>*,.gmsp>*,.gmdn>*{grid-column:2}.gmtr>.gmq.gmtrq,.gmly>.gmq.gmlyq,.gmsp>.gmq.gmspq,.gmdn>.gmq.gmdnq{grid-column:1;grid-row:1/-1;align-content:center;overflow-y:auto}
.gmtrs,.gmlyp,.gmsps,.gmdns{min-height:0}.gmrk{font-size:34px}.gmstn{min-height:54px;font-size:17px}.gmch{padding:6px 12px;margin:0 0 4px}.gmsig{min-height:40px;font-size:18px;padding:4px 8px}.gmtrn{font-size:34px}
.gmlyp{container-type:size}.gmlil{top:16%;width:min(30cqw,58cqh,130px);font-size:18px}
.gmbd{flex-direction:row;align-items:stretch}.gmbd>.gmctl{flex-direction:column;justify-content:center;width:min(36%,240px)}
.gmdice{width:70px;height:56px;font-size:34px}
}
</style>`;

  class G {
    _gmOn() { return this._cfg.peGames !== false; }
    _gmLeft(kid) {
      const p = this._peP(kid), d = p.d && p.d.d === dk(new Date()) ? p.d : {}, lim = p.gl != null ? Number(p.gl) : this._cfg.peGLim == null ? 3 : Number(this._cfg.peGLim);
      return lim <= 0 ? 99 : Math.max(0, lim - (Number(d.g) || 0));
    }
    // 🎟️ Freispiele: Guthaben aus Gutschein-Belohnungen – zählen erst, wenn das Tageslimit erreicht ist, und verfallen nie
    _gmFs(kid) { return Math.max(0, Math.round(Number(this._peP(kid).fs) || 0)); }
    _gmFsUse(kid) { const n = this._gmFs(kid); if (n < 1) return false; this._peSet(kid, { fs: n - 1 || undefined }); return true; }
    // 🔁 Spiel-Aufgabe schon erledigt: weitere Runden nur zum Üben (zählen nicht fürs Tageslimit, kosten keine Freispiele, keine Sterne)
    _gmPrac(kid, tid) {
      const t = this._db.task[tid], gm = t && this._gmTask(t);
      if (!gm || !this._gmPracLeft(t, kid)) { this._toast(T('Für heute genug geübt – morgen wieder! 💪')); return; }
      const p = this._peP(kid), today = dk(new Date()), d0 = p.d && p.d.d === today ? p.d : { d: today, f: 0, b: 0, g: 0, gs: 0 };
      this._peSet(kid, { d: { ...d0, tp: { ...(d0.tp || {}), [tid]: (Number((d0.tp || {})[tid]) || 0) + 1 } } });
      this._gmStart(kid, gm.g, { tid, n: gm.n || this._gmQn(kid), prac: true });
    }
    // Spielauswahl (Freizeit)
    _gmMenu(kid) {
      const k = this._db.kid[kid]; if (!k) return;
      const p = this._peP(kid), kind = this._peKindOf(p) || 'dog', own = OWN[kind] || 'catch', left = this._gmLeft(kid);
      const list = [own, 'memory', 'count', 'math', 'mul', 'clock', 'abc', 'vocab', 'money', 'maze', 'train', 'board', 'lily', 'space', 'dino', 'puzzle', 'simon', 'move'].filter((x) => !this._gmSet(x).off && (x !== 'vocab' || Y.LANG !== 'en')); // ausgeschaltete Spiele (⚙️) nicht zeigen
      const ch = this._gmCh(kid, list), chd = ch ? this._gmChN(kid) : 0;
      const jr = this._cfg.peJr !== false, nm = this._peName(p), de = ['de', 'gsw'].includes(Y.LANG);
      const jrT = T('{name} Abenteuer', { name: de ? (/[sßxzSXZ]$/.test(nm) ? `${nm}’` : `${nm}s`) : nm });
      this._gm = { game: 'menu', kid, tm: [], say: T('Such dir ein Spiel aus!') };
      const hi = p.hi || {};
      this._gmShow(kid, `<div class="gmhd"><b>🕹️ ${T('Spiele mit {name}', { name: esc(this._peName(p)) })}</b><button data-g="say" aria-label="${esc(T('Vorlesen'))}">🔊</button><button data-g="x" aria-label="${esc(T('Schließen'))}">✕</button></div>
        <div class="gmmw">${jr ? `<button class="gmjr" data-g="jr"><span class="gmjrp">${this._gmPet(kid, { eyes: 'happy', mouth: 'open', open: 0.5 }, 110)}</span><span class="gmjrt"><b>${esc(jrT)}</b><small>🗺️ ${T('Jump & Run in 10 Leveln')}</small></span></button>` : ''}
        ${ch ? `<button class="gmch ${chd >= 2 ? 'ok' : ''}" data-g="play" data-v="${ch}"><b>🎯 ${T('Tages-Challenge')}</b><span>${chd >= 2 ? T('Geschafft! ✓') : T('Spiele 2× {x}', { x: `${GAMES[ch].e} ${T(GAMES[ch].n)}` })}</span><span class="gmchp"><i style="width:${Math.min(2, chd) * 50}%"></i></span><small>${Math.min(2, chd)}/2${this._cfg.peHome ? ` · +${this._gmChTl(kid)} 🪙` : ''}</small></button>` : ''}
        <div class="gmmenu">${list.map((g) => `<button data-g="play" data-v="${g}" class="${g === own ? 'own' : ''} ${g === ch ? 'ch' : ''}">${g === ch ? '<em>🎯</em>' : ''}<i>${GAMES[g].e}</i>${T(GAMES[g].n)}${hi[g] ? `<small>🏆 ${hi[g]}</small>` : ''}</button>`).join('')}</div></div>
        <div class="gmft"><div class="hint">${left >= 99 ? '' : left ? T('Heute noch {n} Runden', { n: left }) : this._gmFs(kid) ? T('Tageslimit erreicht – jetzt zählen die Freispiele.') : T('{name} ist müde 😴 – morgen wieder!', { name: esc(this._peName(p)) })}${left < 99 && this._gmFs(kid) ? ` <b class="gmfs">🎟️ ${T('{n} Freispiele', { n: this._gmFs(kid) })}</b>` : ''}</div></div>`);
    }
    // 🎯 Tages-Challenge (abschaltbar): jeden Tag ein anderes Spiel je Kind – 2 Runden spielen = Taler (je Kind einstellbar, Standard 10)
    _gmCh(kid, list) {
      if (this._cfg.gmCh === false) return '';
      const L = (list || []).filter((x) => GAMES[x]); if (!L.length) return '';
      const key = `${dk(new Date())}|${kid}`; let h = 7; for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 100003;
      return L[h % L.length];
    }
    _gmChN(kid) { const p = this._peP(kid), d = p.d && p.d.d === dk(new Date()) ? p.d : {}; return Number(d.ch) || 0; }
    _gmChTl(kid) { const v = this._peP(kid).ct; return v == null ? 10 : Number(v) || 0; }
    _gmChDone(kid, game) {
      const p = this._peP(kid), kind = this._peKindOf(p) || 'dog', own = OWN[kind] || 'catch';
      const list = [own, 'memory', 'count', 'math', 'mul', 'clock', 'abc', 'vocab', 'money', 'maze', 'train', 'board', 'lily', 'space', 'dino', 'puzzle', 'simon', 'move'].filter((x) => !this._gmSet(x).off && (x !== 'vocab' || Y.LANG !== 'en'));
      if (this._gmCh(kid, list) !== game) return '';
      const today = dk(new Date()), d0 = p.d && p.d.d === today ? p.d : { d: today, f: 0, b: 0, g: 0, gs: 0 }, n = (Number(d0.ch) || 0) + 1;
      if (n > 2) return '';
      this._peSet(kid, { d: { ...d0, ch: n } });
      if (n < 2) return T('🎯 Challenge: noch 1 Runde!');
      const tl = this._cfg.peHome && this._tlAdd ? this._gmChTl(kid) : 0; if (tl) this._tlAdd(kid, tl);
      return tl ? T('🎯 Challenge geschafft! +{n} 🪙', { n: tl }) : T('🎯 Challenge geschafft!');
    }
    // Overlay anzeigen (liegt über der Karte, bleibt beim Neuzeichnen erhalten)
    _gmShow(kid, html) {
      let el = this.shadowRoot.querySelector('.gmov');
      if (!el) {
        el = document.createElement('div'); el.className = 'gmov';
        this.shadowRoot.appendChild(el);
        el.addEventListener('click', (e) => this._gmClick(e));
      }
      this._gmKid = kid;
      el.innerHTML = `${CSS}${html}`;
      return el;
    }
    // 📊 Lernstatistik je Kind (Tab 🐾 → ✎ beim Kind): je Monat und Lernspiel [richtig, beim 1. Versuch, Lösung gezeigt] –
    // 🔁 „Oft falsch“: kurze Beschreibung der Frage merken (+1 falsch, −1 bei richtig gelöster Wiederholung)
    _gmWqNote(area, ok, game) {
      const g = this._gm; if (!g || this._cfg.peStat === false) return;
      const tx = (x) => String((x && x.textContent) || '').replace(/[\s\u00a0]+/g, ' ').trim();
      const task = [...area.querySelectorAll('.gmtask')].map(tx).filter(Boolean).join(' ') || String(g.say || '').trim();
      const c = area.querySelector('[data-ok="1"]'), v = c ? String(c.dataset.v || tx(c)) : '';
      const l = `${task}${v && !task.includes(v) ? ` → ${v}` : ''}`.replace(/[<>]/g, '').slice(0, 80);
      if (!task) return;
      (g.wq = g.wq || []).push([game || g.game, l, ok ? -1 : 1]);
    }
    _gmWqAdd(wq, add) {
      const L = (Array.isArray(wq) ? wq : []).map((x) => x.slice()), today = dk(new Date());
      add.forEach(([gm, l, d]) => { const i = L.findIndex((x) => x[0] === gm && x[1] === l); if (i >= 0) { L[i][2] = Math.max(0, (Number(L[i][2]) || 0) + d); if (d > 0) L[i][3] = today; } else if (d > 0) L.push([gm, l, 1, today]); });
      return L.filter((x) => x[2] > 0).sort((a, b) => b[2] - a[2] || String(b[3]).localeCompare(String(a[3]))).slice(0, 30);
    }
    // gespeichert einmal am Ende der Runde (oder beim Schließen), die letzten 6 Monate bleiben
    _gmStatSave() {
      const g = this._gm; if (!g) return;
      if (g.wq && g.wq.length) { const add = g.wq; g.wq = null; const c0 = this._db.pk[g.kid] || {}; this._save('pk', g.kid, { ...c0, wq: this._gmWqAdd(c0.wq, add) }, (c) => ({ ...(c || {}), wq: this._gmWqAdd((c || {}).wq, add) })); }
      if (!g.st || !(g.st[0] + g.st[2])) return;
      const st = g.st; g.st = null;
      const ym = dk(new Date()).slice(0, 7), add = (ls) => {
        const o = { ...(ls || {}) }, m = { ...(o[ym] || {}) }, c = m[g.game] || [0, 0, 0];
        m[g.game] = [c[0] + st[0], c[1] + st[1], c[2] + st[2]]; o[ym] = m;
        Object.keys(o).sort().slice(0, -6).forEach((x) => delete o[x]);
        return o;
      };
      const cur = this._db.pk[g.kid] || {};
      this._save('pk', g.kid, { ...cur, ls: add(cur.ls) }, (c) => ({ ...(c || {}), ls: add((c || {}).ls) }));
    }
    _gmClose() { this._gmStatSave(); this._gmStop(); const el = this.shadowRoot.querySelector('.gmov'); if (el) el.remove(); this._gmKid = ''; this._gm = null; }
    _gmStop() { if (this._jrStop) this._jrStop(); if (this._gm && this._gm.raf) cancelAnimationFrame(this._gm.raf); if (this._gm && this._gm.tm) this._gm.tm.forEach((x) => { clearTimeout(x); clearInterval(x); }); if (this._gm && this._gm.off) this._gm.off(); }
    _gmClick(e) {
      const b = e.target.closest('[data-g]'); if (!b) return;
      const g = b.dataset.g, kid = this._gmKid;
      if (g === 'x') { const t = this._gm && this._gm.task; this._gmClose(); if (t) this._render(); return; }
      if (g === 'menu') { this._gmStop(); this._gm = null; this._gmMenu(kid); return; }
      if (g === 'play') { this._gmStart(kid, b.dataset.v); return; }
      if (g === 'say') { const G0 = this._gm && GAMES[this._gm.game]; this._sayKid((this._gm && this._gm.say) || (G0 ? T(G0.h) : ''), kid); return; }
      if (g === 'jr') {
        const pre = typeof window.YippeeKidsChoresAdventure === 'function' ? Promise.resolve({ default: window.YippeeKidsChoresAdventure }) : null;
        (this._jrMap ? Promise.resolve() : (pre || Y.cardImport('yippee-kids-chores-adventure.js', (m) => m && typeof m.default === 'function')).then((m) => m.default(C, Object.assign(Object.create(Y), { petDraw, KIND }))))
          .then(() => this._jrCover(kid), () => this._toast(T('⚠️ Das Abenteuer konnte nicht geladen werden – liegt die Datei yippee-kids-chores-adventure.js neben der Karte?')));
        return;
      }
      if (g === 'again') { this._gmStart(kid, this._gm.game, this._gm.task); return; }
      if (g === 'prac') { const t = this._gm && this._gm.task; if (t) this._gmPrac(kid, t.tid); return; }
      if (this._gm && this._gm.on) this._gm.on(b, e);
    }
    _gmPet(kid, o, w) {
      const p = this._peP(kid), kind = this._peKindOf(p);
      if (!kind) { const k = this._db.kid[kid]; return `<div style="font-size:${Math.round((w || 90) * 0.7)}px;line-height:1">${esc((k && k.emoji) || '⭐')}</div>`; }
      const st = this._peStage(this._db.kid[kid], p);
      return petDraw(kind, { w: w || 90, g: st.st ? st.g : 0.3, crown: st.st === 3, acc: p.acc || {}, ...this._peLook(p), ...(o || {}) });
    }
    _gmPop(area, x, y, txt) { const s = document.createElement('span'); s.className = 'gmpop'; s.textContent = txt; s.style.left = `${x}px`; s.style.top = `${y}px`; area.appendChild(s); setTimeout(() => s.remove(), 900); }

    // Start: als Freizeit (Tageslimit, Highscore) oder als Aufgabe (task = { tid, n })
    _gmStart(kid, game, task) {
      const k = this._db.kid[kid]; if (!k || !GAMES[game]) return;
      this._gmStop();
      if (!task) {
        if (this._gmLeft(kid)) {
          const p = this._peP(kid), today = dk(new Date()), d0 = p.d && p.d.d === today ? p.d : { d: today, f: 0, b: 0, g: 0, gs: 0 };
          this._peSet(kid, { d: { ...d0, g: (d0.g || 0) + 1 } });
        } else if (!this._gmFsUse(kid)) { this._gmMenu(kid); return; }
      }
      const G0 = GAMES[game];
      const el = this._gmShow(kid, `<div class="gmhd"><b>${G0.e} ${T(G0.n)}</b><span class="gmsc">0</span><button data-g="say" aria-label="${esc(T('Vorlesen'))}">🔊</button><button data-g="${task ? 'x' : 'menu'}" aria-label="${esc(T('Zurück'))}">✕</button></div>
        <div class="gmar"></div><div class="gmft"><div class="hint">${T(G0.h)}</div></div>`);
      const area = el.querySelector('.gmar');
      this._gm = { game, kid, task: task || null, score: 0, tm: [], area, el };
      requestAnimationFrame(() => this[`_gm_${game}`](kid, area, el));
    }
    _gmScore(n) { if (!this._gm) return; this._gm.score = n; const s = this._gm.el.querySelector('.gmsc'); if (s) s.textContent = String(n); }
    // Ende: Highscore speichern bzw. Aufgabe abhaken
    _gmEnd(win, label) {
      const g = this._gm; if (!g) return;
      this._gmStop(); this._gmStatSave();
      const kid = g.kid, p = this._peP(kid), hi = { ...(p.hi || {}) }, best = g.score > (hi[g.game] || 0);
      if (!g.task && best) { hi[g.game] = g.score; this._peSet(kid, { hi }); }
      const ft = g.el.querySelector('.gmft');
      let msg;
      if (g.task && g.task.prac) msg = T('Gut geübt! 💪');
      else if (g.task) {
        if (win) {
          msg = T('Geschafft! Die Aufgabe ist erledigt. 🎉');
          this._gmSkip = true;
          try { this._kidTap(g.task.tid, kid, null); } finally { this._gmSkip = false; }
        } else msg = T('Fast! Versuch es nochmal. 💪');
      } else msg = best && g.score ? T('Neuer Rekord: {n}! 🏆', { n: g.score }) : T('Du hast {n} geschafft!', { n: g.score });
      // 🪙 Taler fürs Zuhause: Lernspiele 1 je richtige Antwort, Geschicklichkeit nach Punkten – höchstens 20 pro Runde
      const LRN = ['count', 'math', 'mul', 'clock', 'abc', 'vocab', 'money', 'maze', 'train', 'board', 'lily', 'space', 'dino', 'move', 'simon', 'song', 'puzzle'];
      const tl = this._cfg.peHome && this._tlAdd ? Math.max(0, Math.min(20, Math.round(LRN.includes(g.game) ? g.score || 0 : (g.score || 0) / 5))) : 0;
      if (tl) this._tlAdd(kid, tl);
      g.tl = tl;
      const chm = g.task ? '' : this._gmChDone(kid, g.game);
      g.area.innerHTML = `<div class="gmend"><div>${this._gmPet(kid, { eyes: 'happy', mouth: 'open', open: 0.7 }, 150)}</div><b>${label || msg}</b>${label ? `<div>${msg}</div>` : ''}${tl ? `<div class="gmtl">+${tl} 🪙 ${T('Taler fürs Zuhause')}</div>` : ''}${chm ? `<div class="gmtl gmchm">${esc(chm)}</div>` : ''}</div>`;
      const pl = g.task && g.task.prac ? this._gmPracLeft(this._db.task[g.task.tid], kid) : 0;
      if (ft) ft.innerHTML = `${g.task && g.task.prac ? (pl ? `<button class="gmbtn" data-g="prac">🔁 ${T('Nochmal üben ({n})', { n: pl })}</button>` : '') : g.task && win ? '' : `<button class="gmbtn" data-g="again">🔁 ${T('Nochmal')}</button>`}<button class="gmbtn sec" data-g="${g.task ? 'x' : 'menu'}">${g.task ? T('Fertig') : T('Andere Spiele')}</button>`;
      if (!g.task && this._peFx) this._peDo(kid, 'cheer', 2000);
    }
    // Zeitlimit-Spiele: Restzeit im Kopf
    _gmTimer(sec, done) {
      const g = this._gm, t0 = performance.now(), sc = g.el.querySelector('.gmhd b');
      const base = sc ? sc.textContent : '';
      const tick = () => {
        if (this._gm !== g) return;
        const left = Math.max(0, sec - Math.floor((performance.now() - t0) / 1000));
        if (sc) sc.textContent = `${base} · ⏱️ ${left}`;
        if (left <= 0) { done(); return; }
        g.tm.push(setTimeout(tick, 250));
      };
      tick();
    }

    // 🦴 Fangen: Tier unten schieben, Sachen fallen
    _gm_catch(kid, area) {
      const g = this._gm, W = area.clientWidth, H = area.clientHeight, food = KIND[this._peKindOf(this._peP(kid)) || 'dog'].food;
      let px = W / 2, items = [], last = 0, spawn = 0, petT = 0, happy = 0;
      area.innerHTML = `<div class="gmpet"></div>`;
      const pet = area.querySelector('.gmpet');
      const move = (e) => { const r = area.getBoundingClientRect(); px = Math.max(40, Math.min(W - 40, (e.touches ? e.touches[0].clientX : e.clientX) - r.left)); };
      area.addEventListener('pointermove', move); area.addEventListener('pointerdown', move);
      g.off = () => { area.removeEventListener('pointermove', move); area.removeEventListener('pointerdown', move); };
      const loop = (now) => {
        if (this._gm !== g) return;
        const dt = Math.min(50, now - (last || now)); last = now;
        spawn -= dt;
        if (spawn <= 0) { spawn = Math.max(380, 900 - g.score * 20); const s = document.createElement('span'); s.className = 'gmit'; s.textContent = Math.random() < 0.85 ? food : '⭐'; area.appendChild(s); items.push({ x: 30 + Math.random() * (W - 60), y: -20, v: 0.12 + Math.random() * 0.06 + g.score * 0.004, el: s }); }
        items = items.filter((it) => {
          it.y += it.v * dt;
          if (it.y > H - 70 && it.y < H - 20 && Math.abs(it.x - px) < 46) { this._gmScore(g.score + (it.el.textContent === '⭐' ? 3 : 1)); this._gmPop(area, it.x, it.y, it.el.textContent === '⭐' ? '+3' : '+1'); it.el.remove(); happy = now + 400; return false; }
          if (it.y > H + 30) { it.el.remove(); return false; }
          it.el.style.left = `${it.x}px`; it.el.style.top = `${it.y}px`; return true;
        });
        pet.style.left = `${px}px`; pet.style.top = `${H - 4}px`;
        if (now - petT > 100) { petT = now; pet.innerHTML = this._gmPet(kid, { eyes: now < happy ? 'happy' : 'open', mouth: now < happy ? 'open' : 'smile', open: 0.6, tail: Math.sin(now / 80) * 25, look: 0 }, 96); }
        g.raf = requestAnimationFrame(loop);
      };
      g.raf = requestAnimationFrame(loop);
      this._gmTimer(30, () => this._gmEnd(true));
    }
    // 🐭 Mäuse fangen (3×3 Löcher)
    _gm_whack(kid, area) {
      const g = this._gm;
      area.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<div class="gmhole" data-g="hole" data-i="${i}" style="left:${20 + (i % 3) * 30}%;top:${22 + Math.floor(i / 3) * 28}%"><span></span></div>`).join('');
      let cur = -1;
      const next = () => {
        if (this._gm !== g) return;
        const holes = area.querySelectorAll('.gmhole');
        holes.forEach((h) => { h.classList.remove('up'); h.firstChild.textContent = ''; });
        cur = Math.floor(Math.random() * 9);
        holes[cur].classList.add('up'); holes[cur].firstChild.textContent = '🐭';
        g.tm.push(setTimeout(next, Math.max(550, 1100 - g.score * 25)));
      };
      g.on = (b) => {
        if (b.dataset.g !== 'hole') return;
        if (Number(b.dataset.i) === cur) { cur = -1; b.firstChild.textContent = '💥'; this._gmScore(g.score + 1); const r = area.getBoundingClientRect(), br = b.getBoundingClientRect(); this._gmPop(area, br.left - r.left + br.width / 2, br.top - r.top, '+1'); }
      };
      next();
      this._gmTimer(30, () => this._gmEnd(true));
    }
    // ✨ Glühwürmchen fangen (fliegen herum)
    _gm_fire(kid, area) {
      const g = this._gm, W = area.clientWidth, H = area.clientHeight;
      g.el.classList.add('night');
      let flies = [], last = 0;
      const add = () => { const s = document.createElement('div'); s.className = 'gmglow'; s.dataset.g = 'fly'; s.textContent = '✨'; area.appendChild(s); flies.push({ x: Math.random() * W, y: Math.random() * H * 0.8, a: Math.random() * 6.28, v: 0.05 + Math.random() * 0.05, el: s }); s._f = flies[flies.length - 1]; };
      for (let i = 0; i < 4; i++) add();
      g.on = (b) => { if (b.dataset.g !== 'fly' || !b._f) return; this._gmScore(g.score + 1); this._gmPop(area, b._f.x, b._f.y, '+1'); flies = flies.filter((f) => f !== b._f); b.remove(); add(); if (g.score % 4 === 0) add(); };
      const loop = (now) => {
        if (this._gm !== g) return;
        const dt = Math.min(50, now - (last || now)); last = now;
        flies.forEach((f) => { f.a += (Math.random() - 0.5) * 0.3; f.x += Math.cos(f.a) * f.v * dt * (1 + g.score * 0.05); f.y += Math.sin(f.a) * f.v * dt * (1 + g.score * 0.05); if (f.x < 20 || f.x > W - 20) f.a = Math.PI - f.a; if (f.y < 20 || f.y > H - 20) f.a = -f.a; f.x = Math.max(20, Math.min(W - 20, f.x)); f.y = Math.max(20, Math.min(H - 20, f.y)); f.el.style.left = `${f.x}px`; f.el.style.top = `${f.y}px`; f.el.style.opacity = 0.6 + 0.4 * Math.abs(Math.sin(now / 300 + f.a)); });
        g.raf = requestAnimationFrame(loop);
      };
      g.raf = requestAnimationFrame(loop);
      this._gmTimer(30, () => this._gmEnd(true));
    }
    // 🌵 Hüpfen: Tippen = springen
    _gm_run(kid, area) {
      const g = this._gm, W = area.clientWidth, H = area.clientHeight, ground = H - 30;
      area.innerHTML = `<div style="position:absolute;left:0;right:0;bottom:0;height:30px;background:#d8a35d;border-top:4px solid #a87b40"></div><div class="gmpet"></div>`;
      const pet = area.querySelector('.gmpet');
      let y = 0, vy = 0, obs = [], last = 0, spawn = 2600, petT = 0, dead = false, speed = 0.28;
      const jump = () => { if (y <= 0.5 && !dead) vy = 0.72; };
      g.on = () => jump();
      area.addEventListener('pointerdown', jump);
      g.off = () => area.removeEventListener('pointerdown', jump);
      area.dataset.g = 'area';
      const loop = (now) => {
        if (this._gm !== g) return;
        const dt = Math.min(40, now - (last || now)); last = now;
        vy -= 0.0022 * dt; y = Math.max(0, y + vy * dt); if (y === 0) vy = 0;
        spawn -= dt; speed = 0.28 + g.score * 0.01;
        if (spawn <= 0) { spawn = 900 + Math.random() * 900; const s = document.createElement('span'); s.className = 'gmit'; s.textContent = ['🌵', '🗿', '🌵', '🍄'][Math.floor(Math.random() * 4)]; area.appendChild(s); obs.push({ x: W + 20, el: s, ok: false }); }
        obs = obs.filter((o) => {
          o.x -= speed * dt;
          if (!o.ok && o.x < 70) { if (o.x > 30 && y < 34) { dead = true; } else if (o.x <= 30) { o.ok = true; this._gmScore(g.score + 1); } }
          if (o.x < -30) { o.el.remove(); return false; }
          o.el.style.left = `${o.x}px`; o.el.style.top = `${ground - 16}px`; return true;
        });
        pet.style.left = '60px'; pet.style.top = `${ground - y + 6}px`;
        if (now - petT > 90) { petT = now; pet.innerHTML = this._gmPet(kid, { eyes: dead ? 'sad' : y > 0 ? 'happy' : 'open', mouth: y > 0 ? 'open' : 'smile', open: 0.6, tail: Math.sin(now / 70) * 25, wing: y > 0 ? 0.8 : 0.1 }, 84); }
        if (dead) { this._gmEnd(true); return; }
        g.raf = requestAnimationFrame(loop);
      };
      g.raf = requestAnimationFrame(loop);
      this._gmTimer(60, () => { dead = true; });
    }
    // ⭐ Sterne sammeln: gedrückt halten = nach oben
    _gm_fly(kid, area) {
      const g = this._gm, W = area.clientWidth, H = area.clientHeight;
      area.style.background = 'linear-gradient(#a5d8ff,#e7f5ff)';
      area.innerHTML = `<div class="gmpet"></div>`;
      const pet = area.querySelector('.gmpet');
      // Steuerung: Das Tier fliegt dorthin, wo der Finger ist (ziehen), loslassen = langsam sinken
      let y = H / 2, ty = H / 2, up = false, items = [], last = 0, spawn = 0, petT = 0;
      const pos = (e) => { const r = area.getBoundingClientRect(); ty = Math.max(70, Math.min(H - 10, e.clientY - r.top + 40)); };
      const dn = (e) => { up = true; pos(e); try { area.setPointerCapture(e.pointerId); } catch (x) { /* egal */ } e.preventDefault(); };
      const mv = (e) => { if (up) pos(e); };
      const upf = () => { up = false; };
      const noMenu = (e) => e.preventDefault();
      area.addEventListener('pointerdown', dn); area.addEventListener('pointermove', mv); area.addEventListener('pointerup', upf); area.addEventListener('pointercancel', upf); area.addEventListener('lostpointercapture', upf); area.addEventListener('contextmenu', noMenu);
      g.off = () => { area.removeEventListener('pointerdown', dn); area.removeEventListener('pointermove', mv); area.removeEventListener('pointerup', upf); area.removeEventListener('pointercancel', upf); area.removeEventListener('lostpointercapture', upf); area.removeEventListener('contextmenu', noMenu); };
      const loop = (now) => {
        if (this._gm !== g) return;
        const dt = Math.min(40, now - (last || now)); last = now;
        const oy = y;
        if (up) y += (ty - y) * Math.min(1, dt * 0.012); else y = Math.min(H - 10, y + 0.07 * dt);
        y = Math.max(70, Math.min(H - 10, y));
        spawn -= dt;
        if (spawn <= 0) { spawn = 650; const s = document.createElement('span'); s.className = 'gmit'; const star = Math.random() < 0.7; s.textContent = star ? '⭐' : '☁️'; s.style.fontSize = star ? '34px' : '52px'; area.appendChild(s); items.push({ x: W + 30, y: 40 + Math.random() * (H - 80), el: s, star }); }
        items = items.filter((it) => {
          it.x -= 0.22 * dt;
          if (it.star && Math.abs(it.x - 80) < 34 && Math.abs(it.y - (y - 40)) < 40) { this._gmScore(g.score + 1); this._gmPop(area, it.x, it.y, '+1'); it.el.remove(); return false; }
          if (it.x < -40) { it.el.remove(); return false; }
          it.el.style.left = `${it.x}px`; it.el.style.top = `${it.y}px`; return true;
        });
        pet.style.left = '80px'; pet.style.top = `${y}px`;
        if (now - petT > 80) { petT = now; pet.innerHTML = this._gmPet(kid, { eyes: 'happy', mouth: 'smile', wing: 0.5 + 0.5 * Math.sin(now / 50), tail: 30 + Math.sin(now / 90) * 10, tilt: y < oy - 0.5 ? -10 : 8 }, 84); }
        g.raf = requestAnimationFrame(loop);
      };
      g.raf = requestAnimationFrame(loop);
      this._gmTimer(30, () => this._gmEnd(true));
    }
    // 🎵 Lied nachspielen (wie Simon)
    _gm_song(kid, area, sim) {
      // nur echtes true = Simon (beim Start kommt als 3. Wert das Overlay mit)
      const simon = sim === true;
      const g = this._gm, COLS = simon ? ['#fa5252', '#fcc419', '#40c057', '#339af0'] : ['#ff8787', '#ffd43b', '#69db7c', '#74c0fc'], NOTES = [523.25, 659.25, 783.99, 1046.5], EM = simon ? ['★', '●', '▲', '■'] : ['🎵', '🎶', '🎼', '🎤'];
      g.say = simon ? T('Merk dir die Farben und tipp sie nach!') : T('Hör gut zu und tipp die Töne in der gleichen Reihenfolge!');
      // ◆ Formen (★ ● ▲ ■) groß auf den Farbfeldern – so geht „Farben merken“ auch ohne Farben zu unterscheiden; Knopf an/aus, gemerkt je Kind
      const shk = `yippee_shp_${kid}`; let shp = this._gmSet('simon').shp !== false; try { const v = localStorage.getItem(shk); if (v === '0' || v === '1') shp = v === '1'; } catch (x) { /* egal */ }
      const drawS = () => {
        const grid = `<div class="gmsong ${simon ? 'simon' : ''} ${simon && shp ? 'shp' : ''}">${COLS.map((c, i) => `<button data-g="note" data-i="${i}" style="background:${c}">${simon && !shp ? '' : EM[i]}</button>`).join('')}${simon ? `<div class="gmsimp">${this._gmPet(kid, { eyes: 'happy' }, 96)}</div>` : ''}</div>`;
        area.innerHTML = simon ? `<div class="gmsw"><div class="gmsbar"><button data-g="shp" aria-pressed="${shp}">${shp ? T('◆ Formen aus') : T('◆ Formen an')}</button></div>${grid}</div>` : grid;
      };
      drawS();
      let ac = null;
      g.off = () => { try { if (ac) ac.close(); } catch (x) { /* egal */ } ac = null; };
      const beep = (i) => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); const o = ac.createOscillator(), v = ac.createGain(); o.frequency.value = NOTES[i]; o.type = 'triangle'; v.gain.setValueAtTime(0.25, ac.currentTime); v.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4); o.connect(v); v.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.42); } catch (e) { /* ohne Ton */ } };
      const lit = (i, ms) => { const b = area.querySelectorAll('[data-g=note]')[i]; if (!b) return; b.classList.add('lit'); beep(i); g.tm.push(setTimeout(() => b.classList.remove('lit'), ms)); };
      const seq = []; let pos = 0, busy = true;
      const round = () => {
        seq.push(Math.floor(Math.random() * 4)); pos = 0; busy = true;
        const sp = simon ? Math.max(300, 600 - seq.length * 25) : 600;
        seq.forEach((n, j) => g.tm.push(setTimeout(() => lit(n, sp * 0.62), 700 + j * sp)));
        g.tm.push(setTimeout(() => { busy = false; }, 700 + seq.length * sp));
      };
      g.on = (b) => {
        if (b.dataset.g === 'shp') { shp = !shp; try { localStorage.setItem(shk, shp ? '1' : '0'); } catch (x) { /* egal */ } const lit0 = [...area.querySelectorAll('[data-g=note]')].map((x) => x.classList.contains('lit')); drawS(); area.querySelectorAll('[data-g=note]').forEach((x, i) => { if (lit0[i]) x.classList.add('lit'); }); return; }
        if (b.dataset.g !== 'note' || busy) return;
        const i = Number(b.dataset.i); lit(i, 200);
        if (i !== seq[pos]) { busy = true; g.tm.push(setTimeout(() => this._gmEnd(true), 500)); return; }
        pos++;
        if (pos === seq.length) { this._gmScore(seq.length); busy = true; g.tm.push(setTimeout(round, 600)); }
      };
      round();
    }
    // 🧠 Memory (als Aufgabe: alle Paare finden)
    _gm_memory(kid, area) {
      const g = this._gm;
      // Paare nach Schwierigkeit: Vorschule 6, Klasse 1–2: 8, ab Klasse 3: 10. Eigene Aufgaben-Emojis nur, wenn das Gerät sie anzeigen kann.
      const lv = this._gmLvl ? this._gmLvl(kid) : 1, fix = Number(this._gmSet('memory').pairs) || 0, pairs = fix >= 6 && fix <= 12 ? fix : lv <= 0 ? 6 : lv <= 2 ? 8 : 10;
      const shows = (e) => !Y.emoFix || Y.emoFix(e) === e;
      const own = [...new Set(this._todayTasks(kid).map((t) => t.emoji).filter(Boolean))].filter(shows);
      // Paar-Arten: gleiche Bilder (eigene Aufgaben-Emojis zuerst, dann gemischt) · ab Klasse 1 auch Zahl ↔ Punkte, Groß ↔ klein, Englisch ↔ Bild
      const mix = (l) => l.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
      const ownP = mix(own).slice(0, Math.ceil(pairs / 2)), pool0 = [...ownP, ...mix([...own, ...FALLBACK])].filter((x, i, a) => a.indexOf(x) === i).slice(0, pairs);
      const mk = lv < 1 ? 'pic' : this._gmKind(['pic', 'pic', ...(pairs <= 10 ? ['num'] : []), 'abc', ...(Y.LANG !== 'en' && !this._gmSet('vocab').off ? ['en'] : [])], 'mem');
      const DOT = ['', '●', '●●', '●●●', '●●<br>●●', '●●●<br>●●', '●●●<br>●●●', '●●●●<br>●●●', '●●●●<br>●●●●', '●●●●●<br>●●●●', '●●●●●<br>●●●●●'];
      let pool = pool0.map((e) => [e, e]);
      if (mk === 'num') pool = mix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, pairs).map((n) => [`<b style="font-size:.9em">${n}</b>`, `<span style="font-size:.32em;line-height:1.05;letter-spacing:.05em">${DOT[n]}</span>`]);
      if (mk === 'abc') pool = mix([...'ABDEFGHKLMNRT']).slice(0, pairs).map((c) => [`<b>${c}</b>`, `<b>${c.toLowerCase()}</b>`]);
      if (mk === 'en') pool = mix(VOCAB.filter((w) => w[2] <= Math.max(1, lv) && w[1].length <= 7 && !w[1].includes(' '))).slice(0, pairs).map((w) => [w[0], `<span style="font-size:.36em;font-weight:900">${esc(w[1])}</span>`, w[1]]);
      const cards = mix(pool.flatMap((pr, i) => [{ e: i, h: pr[0], w: pr[2] }, { e: i, h: pr[1], w: pr[2] }]));
      // Hinweis unten, welche Paare gesucht sind (sonst wirkt z. B. „lemon“ wie ein kaputtes Emoji)
      const tip = { num: T('🔢 Finde Zahl und Punkte!'), abc: T('🔤 Finde großen und kleinen Buchstaben!'), en: T('🇬🇧 Finde Bild und englisches Wort!') }[mk];
      if (tip) { g.say = tip; const ft = g.el && g.el.querySelector('.gmft .hint'); if (ft) ft.textContent = tip; }
      const sayW = (w) => { if (w && this._sayDev) this._sayDev(w, 'en-GB'); };
      // Raster so wählen, dass alle Karten möglichst groß hineinpassen (Hoch- und Querformat)
      const W0 = area.clientWidth - 16, H0 = area.clientHeight - 16; let best = { c: 4, w: 60 };
      for (let c = 3; c <= 8; c++) { const r = Math.ceil(cards.length / c), w = Math.min((W0 - (c - 1) * 8) / c, ((H0 - (r - 1) * 8) / r) * 0.75); if (w > best.w) best = { c, w }; }
      const cw = Math.floor(best.w);
      area.innerHTML = `<div class="gmmem" style="grid-template-columns:repeat(${best.c},${cw}px)">${cards.map((c, j) => `<button class="gmcard" data-g="card" data-j="${j}" style="font-size:${Math.round(cw * 0.55)}px">${mk === 'pic' ? esc(c.h) : c.h}</button>`).join('')}</div>`;
      let open = [], found = 0, moves = 0, lock = false;
      g.on = (b) => {
        if (b.dataset.g !== 'card' || lock || b.classList.contains('on') || b.classList.contains('ok')) return;
        b.classList.add('on'); open.push(b);
        if (mk === 'en') sayW(cards[b.dataset.j].w); // 🇬🇧 Wort beim Umdrehen vorlesen
        if (open.length < 2) return;
        moves++; this._gmScore(moves);
        const [a, c] = open; open = [];
        if (cards[a.dataset.j].e === cards[c.dataset.j].e) { a.classList.add('ok'); c.classList.add('ok'); found++; if (found === pool.length) g.tm.push(setTimeout(() => { g.score = Math.max(1, pool.length * 5 - moves); this._gmEnd(true, T('Alle Paare gefunden in {n} Zügen! 🎉', { n: moves })); }, 500)); }
        else { lock = true; g.tm.push(setTimeout(() => { a.classList.remove('on'); c.classList.remove('on'); lock = false; }, 800)); }
      };
    }
    // 🏃 Mach's nach (als Aufgabe: n Übungen)
    _gm_move(kid, area) {
      const g = this._gm, n = (g.task && g.task.n) || this._gmQn(kid), list = [...MOVES].sort(() => Math.random() - 0.5).slice(0, Math.min(n, MOVES.length));
      let i = 0;
      const show = () => {
        if (this._gm !== g) return;
        const [e, txt] = list[i];
        area.innerHTML = `<div class="gmq"><div class="gmmv">${e}</div><div class="gmtask" style="font-size:clamp(22px,6vw,32px)">${T(txt)}</div><div>${this._gmPet(kid, { eyes: 'happy', mouth: 'open', open: 0.5, jump: 10 }, 110)}</div>
          <div class="gmbar"><i style="width:${Math.round((i / list.length) * 100)}%"></i></div><button class="gmbtn" data-g="mvok" disabled style="opacity:.5;width:min(320px,90%)">✅ ${T('Geschafft!')}</button></div>`;
        g.say = T(txt);
        if (this._db.kid[kid] && this._db.kid[kid].rdr) this._sayKid(g.say, kid);
        g.tm.push(setTimeout(() => { const b = area.querySelector('[data-g=mvok]'); if (b) { b.disabled = false; b.style.opacity = 1; } }, 3000));
      };
      g.on = (b) => { if (b.dataset.g !== 'mvok' || b.disabled) return; i++; this._gmScore(i); if (i >= list.length) this._gmEnd(true, T('Super bewegt! 💪')); else show(); };
      show();
    }
    // Antwort-Knöpfe für Zählen und Rechnen: Punkt nur bei richtiger Antwort,
    // nach den eingestellten Versuchen (1–3) zeigt das Spiel die Lösung und stellt die nächste Frage
    _gmQuiz(kid, area, ask, done, fixN) {
      const g = this._gm, k = this._db.kid[kid] || {}, n = fixN || (g.task && g.task.n) || this._gmQn(kid);
      const tries = Math.max(1, Math.min(3, Math.round(Number(this._gmSet(g.game).tries) || Number(this._cfg.peTry) || 1))); // je Spiel (⚙️) oder allgemein
      let right = 0, miss = 0, lock = false;
      // 🔁 Fehler später wiederholen (abschaltbar, Tab 🐾): Aufgaben, bei denen am Ende die Lösung gezeigt wurde, merkt sich
      // das Gerät je Kind und Spiel (höchstens 8). In späteren Runden kommt jede 2. Frage aus dieser Liste – richtig gelöst ist sie weg.
      // Zusätzlich landet eine kurze Beschreibung (z. B. „7 × 8 = ? → 56“) beim Kind (pk.wq) – für „Oft falsch“ in der Lernübersicht.
      const repOn = this._cfg.peRep !== false && this._gmSet(g.game).rep !== false, rk = `yippee_rep_${kid}_${g.game}`;
      let rep = []; try { rep = (JSON.parse(localStorage.getItem(rk) || '[]') || []).filter((x) => x && typeof x.h === 'string' && !/<script|\son\w+\s*=/i.test(x.h)); } catch (x) { rep = []; }
      const repSave = () => { try { if (rep.length) localStorage.setItem(rk, JSON.stringify(rep.slice(-8))); else localStorage.removeItem(rk); } catch (x) { /* egal */ } };
      let snap = null, isRep = false;
      if (this._cfg.peStat !== false) g.st = g.st || [0, 0, 0]; // 📊 Lernstatistik: [richtig, davon beim 1. Versuch, Lösung gezeigt]
      const q = () => {
        miss = 0; lock = false; isRep = false; snap = null;
        if (repOn && rep.length && right > 0 && right % 2 === 1) {
          const r = rep.shift(); repSave(); isRep = true; snap = r;
          area.innerHTML = r.h; g.say = r.s || g.say;
          const box = area.querySelector('.gmans'); if (box) [...box.children].sort(() => Math.random() - 0.5).forEach((c) => box.appendChild(c));
          (area.querySelector('.gmq') || area.firstElementChild || area).insertAdjacentHTML('afterbegin', `<div class="gmrep">${T('🔁 Wiederholung')}</div>`);
          if (k.rdr && g.say) this._sayKid(g.say, kid);
          return;
        }
        ask(right, n);
        snap = { h: area.innerHTML, s: g.say };
      };
      g.on = (b) => {
        if (b.dataset.g !== 'ans' || lock || b.classList.contains('no')) return;
        if (b.dataset.ok) {
          lock = true; b.classList.add('ok'); right++; this._gmScore(right);
          if (g.st) { g.st[0]++; if (!miss) g.st[1]++; }
          if (isRep) this._gmWqNote(area, true);
          if (right >= n) { g.tm.push(setTimeout(() => this._gmEnd(true, done(right)), 500)); return; }
          g.tm.push(setTimeout(q, 600));
          return;
        }
        b.classList.add('no'); miss++;
        const left = tries - miss, hint = area.querySelector('.gmsol');
        if (left > 0) { if (hint) hint.textContent = left === 1 ? T('Noch ein Versuch!') : T('Noch {n} Versuche!', { n: left }); return; }
        lock = true;
        if (g.st) g.st[2]++;
        this._gmWqNote(area, false);
        if (repOn && snap && snap.h && snap.h.length < 30000) { rep = rep.filter((x) => x.h !== snap.h); rep.push({ h: snap.h, s: snap.s }); repSave(); }
        const c = area.querySelector('.gmans [data-ok="1"]'); if (c) c.classList.add('sol');
        if (hint) hint.textContent = T('Richtig wäre {x}.', { x: c ? c.dataset.v : '' });
        if (k.rdr) this._sayKid(T('Richtig wäre {x}.', { x: c ? c.dataset.v : '' }), kid);
        g.tm.push(setTimeout(q, 1800));
      };
      q();
    }
    // 🎲 Frageart wählen – gleiche Art nicht zweimal hintereinander
    _gmKind(list, key) {
      const g = this._gm; g.lastK = g.lastK || {};
      let k, guard = 0; do { k = list[Math.floor(Math.random() * list.length)]; } while (k === g.lastK[key] && guard++ < 8 && new Set(list).size > 1);
      g.lastK[key] = k; return k;
    }
    // drei verschiedene Antworten, eine davon richtig
    _gmOpts(res, step) {
      const opts = new Set([res]), d = Math.max(1, step || 1);
      let guard = 0;
      while (opts.size < 3 && guard++ < 50) { const x = res + d * (Math.floor(Math.random() * 7) - 3); if (x >= 0) opts.add(x); }
      for (let x = res + 1; opts.size < 3; x++) opts.add(x);
      return [...opts].sort(() => Math.random() - 0.5);
    }
    // 🇬🇧 Englisch-Wörter – vier Fragearten im Wechsel:
    //  🖼️→🔤 Bild zeigen, Wort wählen (🔊 neben jeder Antwort) · 👂→🖼️ Wort anhören, Bild wählen
    //  🔤→🖼️ Wort lesen, Bild wählen · 🔡 fehlenden Buchstaben finden
    _gm_vocab(kid, area) {
      const lv = Math.max(1, Math.min(5, this._gmLvl(kid) || 1)), pool = VOCAB.filter((w) => w[2] <= lv);
      const near = VOCAB.filter((w) => Math.abs(w[2] - lv) <= 1), from = near.length > 6 ? near : VOCAB;
      const canSay = (() => { try { return !!window.speechSynthesis; } catch (e) { return false; } })();
      const recent = [];
      let lastK = '';
      // 🔊 über die Sprachausgabe der Karte (HA-Stimme bzw. Gerät, mit den Android-Korrekturen) – auf Englisch
      const sayEn = (w) => { if (!w) return; if (this._sayDev) this._sayDev(w, 'en-GB'); else sayEn0(w); };
      const pick = () => { let w, guard = 0; do { w = pool[Math.floor(Math.random() * pool.length)]; } while (recent.includes(w[1]) && guard++ < 40); recent.push(w[1]); if (recent.length > Math.min(12, pool.length - 1)) recent.shift(); return w; };
      // Ablenker: kein gleiches Bild und keine Teilwörter (bear ↔ teddy bear, cake ↔ cupcake)
      const others = (w, n) => { const o = new Map([[w[1], w]]); let guard = 0; while (o.size < n && guard++ < 80) { const x = from[Math.floor(Math.random() * from.length)]; const a1 = x[1].toLowerCase(), b1 = w[1].toLowerCase(); if (x[0] !== w[0] && !a1.includes(b1) && !b1.includes(a1)) o.set(x[1], x); } return [...o.values()].sort(() => Math.random() - 0.5); };
      const SPK = 'min-height:64px;font-size:26px;background:#e7f5ff';
      const BTN = 'min-height:64px;font-size:26px';
      const big = 'font-size:clamp(64px,22vw,110px)';
      this._gmQuiz(kid, area, () => {
        const w = pick();
        const gapOk = /^[a-z]{3,9}$/i.test(w[1]);
        const kinds = ['pic', 'pic', 'word', ...(canSay ? ['ear', 'ear'] : []), ...(gapOk ? ['gap'] : [])];
        let kind; let guard = 0; do { kind = kinds[Math.floor(Math.random() * kinds.length)]; } while (kind === lastK && guard++ < 6); lastK = kind;
        if (kind === 'pic') { // Bild → Wort, 🔊 rechts neben jeder Antwort
          const arr = others(w, 3);
          area.innerHTML = `<div class="gmq"><div class="gmtask" style="${big}">${w[0]}</div><div class="gmans" style="grid-template-columns:1fr">${arr.map((x) => `<div class="gmvr" style="display:grid;grid-template-columns:1fr 72px;gap:8px"><button data-g="ans" data-v="${esc(x[1])}" data-w="${esc(x[1])}" data-ok="${x === w ? 1 : ''}" style="${BTN}">${esc(x[1])}</button><button data-g="en" data-v="${esc(x[1])}" aria-label="${esc(T('Vorlesen'))}" style="${SPK}">🔊</button></div>`).join('')}</div><div class="gmsol"></div></div>`;
          this._gm.say = T('Wie heißt das auf Englisch?');
        } else if (kind === 'word' || kind === 'ear') { // Wort lesen bzw. anhören → Bild wählen
          const arr = others(w, kind === 'ear' ? 4 : 3);
          const task = kind === 'ear'
            ? `<button data-g="en" data-v="${esc(w[1])}" aria-label="${esc(T('Vorlesen'))}" style="min-height:96px;min-width:140px;border:0;border-radius:24px;background:#e7f5ff;font-size:54px;cursor:pointer">🔊</button><div class="hint" style="margin-top:6px">${T('Hör gut zu: Welches Bild passt?')}</div>`
            : `<div class="gmtask" style="font-size:clamp(34px,10vw,52px);display:flex;gap:10px;align-items:center;justify-content:center">${esc(w[1])}<button data-g="en" data-v="${esc(w[1])}" aria-label="${esc(T('Vorlesen'))}" style="border:0;border-radius:16px;background:#e7f5ff;font-size:26px;min-height:52px;min-width:56px;cursor:pointer">🔊</button></div><div class="hint">${T('Welches Bild passt zum Wort?')}</div>`;
          area.innerHTML = `<div class="gmq"><div style="display:grid;justify-items:center">${task}</div><div class="gmans" style="grid-template-columns:repeat(${arr.length === 4 ? 2 : 3},1fr)">${arr.map((x) => `<button data-g="ans" data-v="${esc(x[0])}" data-w="${esc(x[1])}" data-ok="${x === w ? 1 : ''}" style="font-size:clamp(40px,12vw,58px)">${x[0]}</button>`).join('')}</div><div class="gmsol"></div></div>`;
          this._gm.say = kind === 'ear' ? T('Hör gut zu: Welches Bild passt?') : T('Welches Bild passt zum Wort?');
          if (kind === 'ear') this._gm.tm.push(setTimeout(() => sayEn(w[1]), 700));
        } else { // fehlender Buchstabe
          const word = w[1].toLowerCase(), i = Math.floor(Math.random() * word.length), c = word[i];
          const ABC = 'abcdefghijklmnopqrstuvwxyz', opts = new Set([c]);
          let g2 = 0; while (opts.size < 3 && g2++ < 60) opts.add(ABC[Math.floor(Math.random() * 26)]);
          const shown = [...word].map((x, j) => (j === i ? '<u style="display:inline-block;min-width:.7em;text-decoration:none;border-bottom:4px solid currentColor">&nbsp;</u>' : esc(x))).join('');
          area.innerHTML = `<div class="gmq"><div class="gmtask" style="${big}">${w[0]}</div><div class="gmtask" style="font-size:clamp(30px,9vw,46px);letter-spacing:.12em">${shown}</div><div class="hint">${T('Welcher Buchstabe fehlt?')}</div><div class="gmans">${[...opts].sort(() => Math.random() - 0.5).map((x) => `<button data-g="ans" data-v="${x}" data-w="${esc(w[1])}" data-ok="${x === c ? 1 : ''}">${x}</button>`).join('')}</div><div class="gmsol"></div></div>`;
          this._gm.say = T('Welcher Buchstabe fehlt?');
        }
      }, (right) => T('{n} Wörter richtig – great job! 🇬🇧', { n: right }));
      const g = this._gm, on = g.on;
      g.on = (b, e) => {
        if (b.dataset.g === 'en') { sayEn(b.dataset.v); return; }
        if (b.dataset.g === 'ans' && b.dataset.ok && !b.classList.contains('ok')) sayEn(b.dataset.w || b.dataset.v);
        on(b, e);
        const sol = area.querySelector('.gmans .sol'); if (sol && !sol.dataset.said) { sol.dataset.said = '1'; setTimeout(() => sayEn(sol.dataset.w || sol.dataset.v), 300); }
      };
    }
    // ✖️ Einmaleins: Reihen wählen, 10 Aufgaben, Zeit und Bestzeit je Reihe (bzw. Auswahl)
    _gm_mul(kid, area) {
      const g = this._gm, lk = `yippee_mul_${kid}`;
      let sel = []; try { sel = (JSON.parse(localStorage.getItem(lk) || '[]') || []).filter((x) => Number.isInteger(x) && x >= 1 && x <= 10); } catch (e) { sel = []; }
      if (!sel.length) sel = [2, 5, 10];
      const best = () => { const mx = this._peP(kid).mx; return mx && typeof mx === 'object' ? mx : {}; };
      const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      const play = (rows) => {
        const key = rows.slice().sort((a, b) => a - b).join(','), t0 = Date.now();
        let last = '';
        g.tm.push(setInterval(() => { const s = g.el.querySelector('.gmsc'); if (s && g.game === 'mul') s.textContent = `⏱️ ${fmt(Math.round((Date.now() - t0) / 1000))}`; }, 500));
        this._gmQuiz(kid, area, () => {
          let a, b; do { a = rows[Math.floor(Math.random() * rows.length)]; b = 1 + Math.floor(Math.random() * 10); } while (`${a}x${b}` === last); last = `${a}x${b}`;
          const flip = Math.random() < 0.5, kind = this._gmKind(['mul', 'mul', 'mul', 'gap', 'div'], 'mul');
          let task = flip ? `${b} × ${a}` : `${a} × ${b}`, res = a * b, arr;
          if (kind === 'gap') { task = flip ? `? × ${a} = ${a * b}` : `${a} × ? = ${a * b}`; res = b; arr = this._gmOpts(b, 1); this._gm.say = T('Welche Zahl fehlt?'); }
          else if (kind === 'div') { task = `${a * b} : ${a}`; res = b; arr = this._gmOpts(b, 1); this._gm.say = T('Wie viel ist {x}?', { x: `${a * b} ${T('geteilt durch')} ${a}` }); }
          else { arr = this._gmOpts(a * b, a); this._gm.say = T('Wie viel ist {a} mal {b}?', { a: flip ? b : a, b: flip ? a : b }); }
          area.innerHTML = `<div class="gmq"><div class="gmtask">${task}</div><div class="gmans">${arr.map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === res ? 1 : ''}">${x}</button>`).join('')}</div><div class="gmsol"></div></div>`;
        }, () => {
          const sec = Math.max(1, Math.round((Date.now() - t0) / 1000)), old = best()[key];
          if (!old || sec < old) { const mx = { ...best(), [key]: sec }; Object.keys(mx).slice(0, -60).forEach((x) => delete mx[x]); this._peSet(kid, { mx }); }
          return !old || sec < old ? T('Neue Bestzeit: {t}! 🏆', { t: fmt(sec) }) : T('Geschafft in {t} – Bestzeit {b}', { t: fmt(sec), b: fmt(old) });
        }, 10);
      };
      if (g.task) { const lv = this._gmLvl(kid); play(lv <= 2 ? [2, 5, 10] : [2, 3, 4, 5, 6, 7, 8, 9, 10]); return; }
      const draw = () => {
        const bt = best();
        area.innerHTML = `<div class="gmq"><b>${T('Welche Reihen?')}</b><div class="gmans" style="grid-template-columns:repeat(5,1fr)">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => `<button data-g="mrow" data-v="${r}" class="${sel.includes(r) ? 'ok' : ''}" style="min-height:64px;font-size:26px">${r}${bt[String(r)] ? `<small style="font-size:11px;font-weight:700">🏆 ${fmt(bt[String(r)])}</small>` : ''}</button>`).join('')}</div>
          <button class="gmbtn" data-g="mgo" style="width:min(440px,100%)">▶ ${T('Los geht\'s!')}${bt[sel.slice().sort((a, b) => a - b).join(',')] ? ` · 🏆 ${fmt(bt[sel.slice().sort((a, b) => a - b).join(',')])}` : ''}</button></div>`;
      };
      g.say = T('Such dir die Reihen aus!');
      g.on = (b) => {
        if (b.dataset.g === 'mrow') { const r = Number(b.dataset.v); sel = sel.includes(r) ? sel.filter((x) => x !== r) : [...sel, r]; draw(); return; }
        if (b.dataset.g === 'mgo') { if (!sel.length) return; try { localStorage.setItem(lk, JSON.stringify(sel)); } catch (e) { /* egal */ } play(sel.slice()); }
      };
      draw();
    }
    // 🔢 Zählen – Menge nach Stufe (Vorschule bis 10, kleine Kinder bis 5, Schulkinder bis 20)
    _gm_count(kid, area) {
      const k = this._db.kid[kid], age = this._age ? this._age(k) : null, lv = this._gmLvl(kid);
      const max = age !== null && age < 5 ? 5 : lv >= 1 ? 20 : 10, gmax = Math.min(max, 12);
      const em = ['🍎', '⭐', '🐟', '🌸', '🎈', '🍓', '🐞', '⚽', '🐥', '🍪', '🚗', '🦋', '🍌', '🧸', '🐸', '💎'];
      const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pick = (l) => l[Math.floor(Math.random() * l.length)];
      const bar = (right, n) => `<div class="gmbar"><i style="width:${Math.round((right / n) * 100)}%"></i></div>`;
      // Fragearten: zählen · Gruppe mit n finden · wo sind mehr? · (ab Klasse 1) wie viele fehlen bis 10?
      const kinds = ['count', 'count', 'find', 'more', ...(max >= 10 && lv >= 1 ? ['ten'] : [])];
      this._gmQuiz(kid, area, (right, n) => {
        const kind = this._gmKind(kinds, 'count'), e = pick(em);
        if (kind === 'count') {
          const c = r(Math.max(1, Math.round(max / 3)), max), arr = this._gmOpts(c, 1);
          area.innerHTML = `<div class="gmq"><div class="gmshow">${Array(c).fill(e).join('')}</div><div class="gmans">${arr.map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === c ? 1 : ''}">${x}</button>`).join('')}</div><div class="gmsol"></div>${bar(right, n)}</div>`;
          this._gm.say = T('Wie viele sind es?');
        } else if (kind === 'find' || kind === 'more') {
          const set = new Set(); let guard = 0;
          while (set.size < 3 && guard++ < 60) set.add(r(1, gmax));
          const nums = [...set].sort(() => Math.random() - 0.5), c = kind === 'find' ? pick(nums) : Math.max(...nums);
          const grp = (x) => `<span style="display:flex;flex-wrap:wrap;gap:2px;justify-content:center;font-size:clamp(16px,4.6vw,24px);line-height:1.1">${Array(x).fill(e).join('')}</span>`;
          area.innerHTML = `<div class="gmq">${kind === 'find' ? `<div class="gmtask">${c}</div>` : ''}<div class="gmtask" style="font-size:clamp(20px,5.5vw,28px)">${kind === 'find' ? T('Wo sind es {n}?', { n: c }) : T('Wo sind es mehr?')}</div><div class="gmans" style="grid-template-columns:1fr">${nums.map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === c ? 1 : ''}" style="min-height:64px;padding:8px">${grp(x)}</button>`).join('')}</div><div class="gmsol"></div>${bar(right, n)}</div>`;
          this._gm.say = kind === 'find' ? T('Wo sind es {n}?', { n: c }) : T('Wo sind es mehr?');
        } else {
          const c = r(1, 9), arr = this._gmOpts(10 - c, 1);
          const ten = Array.from({ length: 10 }, (_, i) => `<span style="display:grid;place-items:center;width:clamp(30px,8vw,40px);height:clamp(30px,8vw,40px);border-radius:10px;background:${i < c ? '#fff' : 'rgba(255,255,255,.35)'};border:2px dashed ${i < c ? 'transparent' : '#2f9e44'};font-size:clamp(18px,5vw,26px)">${i < c ? e : ''}</span>`).join('');
          area.innerHTML = `<div class="gmq"><div style="display:grid;grid-template-columns:repeat(5,auto);gap:6px">${ten}</div><div class="gmtask" style="font-size:clamp(20px,5.5vw,28px)">${T('Wie viele fehlen bis 10?')}</div><div class="gmans">${arr.map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === 10 - c ? 1 : ''}">${x}</button>`).join('')}</div><div class="gmsol"></div>${bar(right, n)}</div>`;
          this._gm.say = T('Wie viele fehlen bis 10?');
        }
        if (k.rdr) this._sayKid(this._gm.say, kid);
      }, (right) => T('{n} richtig – super gezählt! 🎉', { n: right }));
    }
    // 🧮 Rechnen: Schwierigkeit nach Stufe (Vorschule, Klasse 1–6)
    _gm_math(kid, area) {
      const lv = this._gmLvl(kid), food = KIND[this._peKindOf(this._peP(kid)) || 'dog'].food;
      const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pick = (l) => l[Math.floor(Math.random() * l.length)];
      const addSub = (lim, minA) => { const a = r(minA, lim - 1), b = r(1, lim - a); return Math.random() < 0.5 ? [`${a} + ${b}`, a + b, 1] : [`${a + b} − ${b}`, a, 1]; };
      const mulDiv = (fs, bmax) => { const a = pick(fs), b = r(2, bmax); return Math.random() < 0.6 ? [`${a} × ${b}`, a * b, a] : [`${a * b} : ${a}`, b, 1]; };
      const mk = () => {
        if (lv <= 0) { const a = r(1, 4), b = r(1, 5 - a); return Math.random() < 0.7 ? [`${a} + ${b}`, a + b, 1] : [`${a + b} − ${b}`, a, 1]; }  // bis 5
        if (lv === 1) return Math.random() < 0.5 ? addSub(10, 1) : addSub(20, 3);                       // bis 20
        if (lv === 2) return Math.random() < 0.6 ? addSub(100, 10) : mulDiv([2, 5, 10], 10);             // bis 100, 2er/5er/10er
        if (lv === 3) return Math.random() < 0.6 ? mulDiv([2, 3, 4, 5, 6, 7, 8, 9, 10], 10) : addSub(100, 20); // Einmaleins und Geteilt
        if (lv === 4) { if (Math.random() < 0.6) { const st = pick([10, 50, 100]); const a = r(1, 9) * st + r(0, st === 100 ? 9 : 0) * 10, b = r(1, 9) * st; const hi = Math.max(a, b), lo = Math.min(a, b); return hi + lo <= 1000 && Math.random() < 0.5 ? [`${hi} + ${lo}`, hi + lo, st] : [`${hi} − ${lo}`, hi - lo, st]; } return mulDiv([2, 3, 4, 5, 6, 7, 8, 9, 10], 10); } // bis 1000
        if (lv === 5) return Math.random() < 0.5 ? mulDiv([11, 12, 15, 20, 25], 10) : (() => { const a = r(2, 9) * 10, b = r(2, 9); return [`${a} × ${b}`, a * b, 10]; })(); // größeres Einmaleins
        return Math.random() < 0.5 ? mulDiv([12, 13, 14, 15, 16, 25], 12) : (() => { const a = r(11, 19), b = r(11, 19); return [`${a} × ${b}`, a * b, 10]; })(); // Klasse 6
      };
      const speak = (txt) => txt.replace(' + ', ` ${T('plus')} `).replace(' − ', ` ${T('minus')} `).replace(' × ', ` ${T('mal')} `).replace(' : ', ` ${T('geteilt durch')} `);
      const bar = (right, n) => `<div class="gmbar"><i style="width:${Math.round((right / n) * 100)}%"></i></div>`;
      const pet = () => `<div>${this._gmPet(kid, { eyes: 'open', mouth: 'open', open: 0.4 }, 96)}</div>`;
      this._gmQuiz(kid, area, (right, n) => {
        const kind = this._gmKind(['calc', 'calc', 'calc', 'gap', 'gap', 'which'], 'math');
        if (kind === 'gap') { // fehlende Zahl: 3 + ? = 7
          const [txt, res] = mk(), m = /^(\d+) (\S) (\d+)$/.exec(txt);
          if (m) {
            const left = Math.random() < 0.4, ans = Number(left ? m[1] : m[3]), arr = this._gmOpts(ans, ans >= 20 && ans % 10 === 0 ? 10 : 1);
            const shown = left ? `? ${m[2]} ${m[3]} = ${res}` : `${m[1]} ${m[2]} ? = ${res}`;
            this._gm.say = T('Welche Zahl fehlt?');
            area.innerHTML = `<div class="gmq">${pet()}<div class="gmtask">${shown}</div><div class="gmans">${arr.map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === ans ? 1 : ''}"><small>${food}</small>${x}</button>`).join('')}</div><div class="gmsol"></div>${bar(right, n)}</div>`;
            if ((this._db.kid[kid] || {}).rdr) this._sayKid(this._gm.say, kid);
            return;
          }
        }
        if (kind === 'which') { // welche Aufgabe ergibt …?
          const [txt, res] = mk(), set = new Map([[res, txt]]); let guard = 0;
          while (set.size < 3 && guard++ < 40) { const [t2, r2] = mk(); if (!set.has(r2)) set.set(r2, t2); }
          if (set.size === 3) {
            const arr = [...set.entries()].sort(() => Math.random() - 0.5);
            this._gm.say = T('Welche Aufgabe ergibt {n}?', { n: res });
            area.innerHTML = `<div class="gmq">${pet()}<div class="gmtask">= ${res}</div><div class="gmtask" style="font-size:clamp(18px,5vw,24px)">${T('Welche Aufgabe ergibt {n}?', { n: res })}</div><div class="gmans" style="grid-template-columns:1fr">${arr.map(([r2, t2]) => `<button data-g="ans" data-v="${esc(t2)}" data-ok="${r2 === res ? 1 : ''}" style="min-height:60px;font-size:clamp(24px,7vw,32px)">${esc(t2)}</button>`).join('')}</div><div class="gmsol"></div>${bar(right, n)}</div>`;
            if ((this._db.kid[kid] || {}).rdr) this._sayKid(this._gm.say, kid);
            return;
          }
        }
        const [txt, res, step] = mk(), arr = this._gmOpts(res, step);
        this._gm.say = T('Wie viel ist {x}?', { x: speak(txt) });
        area.innerHTML = `<div class="gmq"><div>${this._gmPet(kid, { eyes: 'open', mouth: 'open', open: 0.4 }, 110)}</div><div class="gmtask">${txt} = ?</div><div class="gmans">${arr.map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === res ? 1 : ''}"><small>${food}</small>${x}</button>`).join('')}</div><div class="gmsol"></div><div class="gmbar"><i style="width:${Math.round((right / n) * 100)}%"></i></div></div>`;
      }, (right) => T('{n} richtig – {name} ist satt! 😋', { n: right, name: this._peName(this._peP(kid)) }));
    }
    // ---------- neue Lernspiele ----------
    // 🕐 Uhr lesen: volle Stunden → halbe → Viertel → 5 Minuten → jede Minute (nach Stufe)
    _gm_clock(kid, area) {
      const lv = this._gmLvl(kid), r = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pick = (l) => l[Math.floor(Math.random() * l.length)];
      const step = lv <= 1 ? 60 : lv === 2 ? 30 : lv === 3 ? 15 : lv <= 5 ? 5 : 1;
      const fmt = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
      const add = (h, m, d) => { const t = (((h % 12) * 60 + m + d) % 720 + 720) % 720; return [Math.floor(t / 60) || 12, t % 60]; };
      const dur = (d) => (d < 60 ? T('{n} Min.', { n: d }) : d % 60 ? T('{h} Std. {m} Min.', { h: Math.floor(d / 60), m: d % 60 }) : T('{n} Std.', { n: d / 60 }));
      const face = (h, m, w) => {
        const ha = ((h % 12) + m / 60) * 30, ma = m * 6, sz = w || 210;
        const nums = Array.from({ length: 12 }, (_, i) => { const a = (i + 1) * 30 * Math.PI / 180; return `<text x="${100 + Math.sin(a) * 70}" y="${100 - Math.cos(a) * 70 + 7}" font-size="20" font-weight="800" text-anchor="middle" fill="#1f2433">${i + 1}</text>`; }).join('');
        const ticks = Array.from({ length: 60 }, (_, i) => `<line x1="100" y1="${i % 5 ? 12 : 10}" x2="100" y2="${i % 5 ? 16 : 20}" stroke="#495057" stroke-width="${i % 5 ? 1.5 : 3}" transform="rotate(${i * 6} 100 100)"/>`).join('');
        return `<svg viewBox="0 0 200 200" width="${sz}" height="${sz}"><circle cx="100" cy="100" r="94" fill="#fff" stroke="#5b61ff" stroke-width="8"/>${ticks}${nums}
          <line x1="100" y1="100" x2="100" y2="52" stroke="#1f2433" stroke-width="8" stroke-linecap="round" transform="rotate(${ha} 100 100)"/>
          <line x1="100" y1="100" x2="100" y2="26" stroke="#e8590c" stroke-width="5" stroke-linecap="round" transform="rotate(${ma} 100 100)"/><circle cx="100" cy="100" r="7" fill="#1f2433"/></svg>`;
      };
      const bar = (right, n) => `<div class="gmbar"><i style="width:${Math.round((right / n) * 100)}%"></i></div>`;
      // falsche Uhrzeiten, die man leicht verwechselt: Zeiger vertauscht, eine Stunde daneben, halbe Stunde daneben …
      const wrong = (h, m) => [[h % 12 + 1, m], [h, (m + 30) % 60], [(h + 10) % 12 + 1, m], [h, (m + step * 2) % 60], [Math.max(1, Math.round(m / 5)) || 12, (h * 5) % 60], add(h, m, -step), add(h, m, step)];
      const opts3 = (h, m) => { const ok = fmt(h, m), o = new Set([ok]); wrong(h, m).sort(() => Math.random() - 0.5).forEach(([a, b]) => { if (o.size < 3) o.add(fmt(a, b)); }); return [...o].sort(() => Math.random() - 0.5); };
      // Fragearten nach Stufe: ablesen · passende Uhr · in … Minuten · wie lange? · 24-Stunden-Zeit
      const kinds = ['read', 'read', 'pick', ...(lv >= 1 ? ['later'] : []), ...(lv >= 3 ? ['dur'] : []), ...(lv >= 4 ? ['h24'] : [])];
      this._gmQuiz(kid, area, (right, n) => {
        const kind = this._gmKind(kinds, 'clock');
        const h = r(1, 12), m = r(0, Math.floor(59 / step)) * step, ok = fmt(h, m);
        let body = '';
        if (kind === 'read') {
          this._gm.say = T('Wie spät ist es?');
          body = `${face(h, m)}<div class="gmans">${opts3(h, m).map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === ok ? 1 : ''}" style="font-size:28px">${x}</button>`).join('')}</div>`;
        } else if (kind === 'pick' || kind === 'h24') {
          const pm = kind === 'h24', shown = pm ? fmt(h === 12 ? 12 : h + 12, m) : ok;
          this._gm.say = T('Welche Uhr zeigt {t}?', { t: shown });
          const list = opts3(h, m), sz = 'min(27vw,120px)';
          body = `<div class="gmtask">${shown}</div><div class="gmtask" style="font-size:clamp(18px,5vw,24px)">${T('Welche Uhr zeigt {t}?', { t: shown })}</div><div class="gmans">${list.map((x) => { const [a, b] = x.split(':').map(Number); return `<button data-g="ans" data-v="${x}" data-ok="${x === ok ? 1 : ''}" style="padding:4px;min-height:0;min-width:0"><span style="display:block;width:100%;max-width:${sz};aspect-ratio:1">${face(a, b, '100%')}</span></button>`; }).join('')}</div>`;
        } else if (kind === 'later') {
          const ds = lv <= 1 ? [60] : lv === 2 ? [30, 60, 90] : lv === 3 ? [15, 30, 45, 60] : [5, 10, 15, 20, 25, 35, 40, 45];
          const d = pick(ds.filter((x) => x % Math.min(step, 60) === 0 || step >= 60)), [h2, m2] = add(h, m, d), ok2 = fmt(h2, m2);
          const o = new Set([ok2]); [add(h, m, -d), add(h, m, d * 2), [h, m], add(h, m, d + 60), add(h, m, d - 60 || 120)].sort(() => Math.random() - 0.5).forEach(([a, b]) => { if (o.size < 3) o.add(fmt(a, b)); });
          const q = d === 60 ? T('Wie spät ist es in einer Stunde?') : T('Wie spät ist es in {n} Minuten?', { n: d });
          this._gm.say = q;
          body = `${face(h, m, 170)}<div class="gmtask" style="font-size:clamp(18px,5vw,24px)">${q}</div><div class="gmans">${[...o].sort(() => Math.random() - 0.5).map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === ok2 ? 1 : ''}" style="font-size:28px">${x}</button>`).join('')}</div>`;
        } else { // wie lange?
          const unit = Math.max(15, step), d = r(1, Math.floor(180 / unit)) * unit, [h2, m2] = add(h, m, d);
          const o = new Set([d]); [d + unit, d - unit, d + 60, d - 60, d + 30].sort(() => Math.random() - 0.5).forEach((x) => { if (o.size < 3 && x > 0) o.add(x); });
          const q = T('Wie lange dauert es von {a} bis {b}?', { a: ok, b: fmt(h2, m2) });
          this._gm.say = q;
          body = `<div style="display:flex;gap:10px;align-items:center;justify-content:center">${face(h, m, 120)}<b style="font-size:30px">→</b>${face(h2, m2, 120)}</div><div class="gmtask" style="font-size:clamp(18px,5vw,24px)">${q}</div><div class="gmans">${[...o].sort(() => Math.random() - 0.5).map((x) => `<button data-g="ans" data-v="${esc(dur(x))}" data-ok="${x === d ? 1 : ''}" style="font-size:clamp(16px,4.6vw,22px)">${esc(dur(x))}</button>`).join('')}</div>`;
        }
        area.innerHTML = `<div class="gmq">${body}<div class="gmsol"></div>${bar(right, n)}</div>`;
        if ((this._db.kid[kid] || {}).rdr) this._sayKid(this._gm.say, kid);
      }, (right) => T('{n} richtig – du kannst die Uhr lesen! 🕐', { n: right }));
    }
    // 🔤 Buchstaben & Wörter: Anfangsbuchstabe → fehlender Buchstabe → richtig geschrieben (nach Stufe), Wörter in der Sprache der Karte
    _gm_abc(kid, area) {
      const lv = this._gmLvl(kid), list = (WORDS[Y.LANG] || WORDS.en).split(' ');
      const abc = [...new Set(list.join('').split(''))];
      const pick = (l) => l[Math.floor(Math.random() * l.length)];
      // Fragearten nach Stufe gemischt: Anfangsbuchstabe · Bild zum Buchstaben · fehlender Buchstabe · Endbuchstabe · richtig geschrieben
      const kinds = lv <= 0 ? ['first', 'first', 'pic'] : lv === 1 ? ['first', 'pic', 'gap', 'gap'] : lv <= 3 ? ['gap', 'gap', 'first', 'last', 'pic', 'spell'] : ['spell', 'spell', 'gap', 'last', 'pic'];
      const recent = [];
      this._gmQuiz(kid, area, (right, n) => {
        let i, guard0 = 0; do { i = Math.floor(Math.random() * list.length); } while (recent.includes(i) && guard0++ < 30); recent.push(i); if (recent.length > Math.min(8, list.length - 2)) recent.shift();
        const w = list[i], ch = [...w], e = WEM[i];
        const mode = this._gmKind(kinds, 'abc');
        if (mode === 'pic') { // Welches Bild beginnt mit …?
          const L = ch[0], others = list.map((x, j) => j).filter((j) => [...list[j]][0] !== L).sort(() => Math.random() - 0.5).slice(0, 2);
          if (others.length === 2) {
            const arr = [i, ...others].sort(() => Math.random() - 0.5);
            this._gm.say = T('Welches Bild beginnt mit {l}?', { l: L });
            area.innerHTML = `<div class="gmq"><div class="gmtask" style="font-size:clamp(56px,16vw,84px)">${esc(L)}</div><div class="gmtask" style="font-size:clamp(18px,5vw,24px)">${T('Welches Bild beginnt mit {l}?', { l: esc(L) })}</div><div class="gmans">${arr.map((j) => `<button data-g="ans" data-v="${WEM[j]}" data-ok="${j === i ? 1 : ''}" style="font-size:clamp(40px,12vw,58px)">${WEM[j]}</button>`).join('')}</div><div class="gmsol"></div><div class="gmbar"><i style="width:${Math.round((right / n) * 100)}%"></i></div></div>`;
            if ((this._db.kid[kid] || {}).rdr) this._sayKid(this._gm.say, kid);
            return;
          }
        }
        let shown, ok, opts;
        if (mode === 'spell') {
          ok = w; opts = new Set([w]);
          let guard = 0;
          while (opts.size < 3 && guard++ < 40) {
            const c = [...ch], j = Math.floor(Math.random() * c.length);
            if (Math.random() < 0.5 && c.length > 2) { const k2 = Math.min(c.length - 1, j + 1); [c[j], c[k2]] = [c[k2], c[j]]; } else c[j] = pick(abc);
            const x = c.join(''); if (x !== w) opts.add(x);
          }
          shown = '';
          this._gm.say = T('Wie schreibt man „{w}“?', { w: w.toLowerCase() });
        } else {
          const j = mode === 'first' || mode === 'pic' || ch.length < 3 ? 0 : mode === 'last' ? ch.length - 1 : 1 + Math.floor(Math.random() * (ch.length - 1));
          ok = ch[j]; opts = new Set([ok]);
          while (opts.size < 3) opts.add(pick(abc));
          shown = ch.map((c, k) => (k === j ? '_' : c)).join('');
          this._gm.say = mode === 'first' || mode === 'pic' ? T('Mit welchem Buchstaben beginnt „{w}“?', { w: w.toLowerCase() }) : mode === 'last' ? T('Mit welchem Buchstaben endet „{w}“?', { w: w.toLowerCase() }) : T('Welcher Buchstabe fehlt bei „{w}“?', { w: w.toLowerCase() });
        }
        const arr = [...opts].sort(() => Math.random() - 0.5);
        area.innerHTML = `<div class="gmq"><div style="font-size:84px;line-height:1">${e}</div>${shown ? `<div class="gmtask" style="letter-spacing:4px">${esc(shown)}</div>` : ''}<div class="gmans">${arr.map((x) => `<button data-g="ans" data-v="${esc(x)}" data-ok="${x === ok ? 1 : ''}" style="${mode === 'spell' ? 'font-size:18px;word-break:break-all' : ''}">${esc(x)}</button>`).join('')}</div><div class="gmsol"></div><div class="gmbar"><i style="width:${Math.round((right / n) * 100)}%"></i></div></div>`;
        if ((this._db.kid[kid] || {}).rdr) this._sayKid(this._gm.say, kid);
      }, (right) => T('{n} richtig – super gelesen! 🔤', { n: right }));
    }
    // 🪙 Geld zählen: Münzen und Scheine in der Währung der Karte, Beträge nach Stufe
    _gm_money(kid, area) {
      const lv = this._gmLvl(kid), cur = this._mnCur ? this._mnCur() : 'EUR', fmt = (c) => (this._mnFmt ? this._mnFmt(c, cur) : `${(c / 100).toFixed(2)} ${cur}`);
      const all = [...(COINS[cur] || COINS.EUR)], notes = NOTES[cur] || NOTES.EUR, unit = Math.min(...all.filter((x) => x >= 100), 100);
      const whole = all.filter((x) => x >= 100), small = all.filter((x) => x < 100);
      const pool = lv <= 1 ? whole.slice(0, 2).concat(lv ? notes.slice(0, 1) : []) : lv === 2 ? whole.concat(notes.slice(0, 2)) : lv === 3 ? small.filter((x) => x >= 10).concat(whole.slice(0, 2)) : small.concat(whole, notes.slice(0, 2));
      const maxN = lv <= 0 ? 3 : lv <= 2 ? 4 : 5;
      const draw = () => { const k = 2 + Math.floor(Math.random() * (maxN - 1)); return Array.from({ length: k }, () => pool[Math.floor(Math.random() * pool.length)]).sort((a, b) => b - a); };
      const tot = (l) => l.reduce((a, b) => a + b, 0);
      const pic0 = (v) => (notes.includes(v) || v >= 500 && !all.includes(v)
        ? `<span class="gmnote">${esc(fmt(v))}</span>`
        : `<span class="gmcoin ${v < unit ? 'cu' : ''}">${v < unit ? `<b>${v}</b>` : esc(fmt(v).replace(/[.,]00(?=\D|$)/, ''))}</span>`);
      const bar = (right, n) => `<div class="gmbar"><i style="width:${Math.round((right / n) * 100)}%"></i></div>`;
      const kinds = ['sum', 'sum', 'pick', ...(lv >= 2 ? ['change'] : [])];
      this._gmQuiz(kid, area, (right, n) => {
        const kind = this._gmKind(kinds, 'money');
        if (kind === 'pick') { // Wo ist genau so viel Geld?
          const sets = new Map(); let guard = 0;
          while (sets.size < 3 && guard++ < 60) { const l = draw(), t = tot(l); if (!sets.has(t)) sets.set(t, l); }
          if (sets.size === 3) {
            const arr = [...sets.entries()].sort(() => Math.random() - 0.5), want = arr[Math.floor(Math.random() * 3)][0];
            this._gm.say = T('Wo sind es genau {x}?', { x: fmt(want) });
            area.innerHTML = `<div class="gmq"><div class="gmtask" style="font-size:clamp(30px,9vw,44px)">${esc(fmt(want))}</div><div class="gmtask" style="font-size:clamp(18px,5vw,24px)">${T('Wo sind es genau {x}?', { x: esc(fmt(want)) })}</div><div class="gmans gmmini" style="grid-template-columns:1fr">${arr.map(([t, l]) => `<button data-g="ans" data-v="${esc(fmt(t))}" data-ok="${t === want ? 1 : ''}" style="min-height:58px;padding:6px"><span class="gmmoney">${l.map(pic0).join('')}</span></button>`).join('')}</div><div class="gmsol"></div>${bar(right, n)}</div>`;
            if ((this._db.kid[kid] || {}).rdr) this._sayKid(this._gm.say, kid);
            return;
          }
        }
        if (kind === 'change') { // Wechselgeld
          const big = [...notes, ...whole].filter((x) => x > unit).sort((a, b) => a - b), pay = big[Math.floor(Math.random() * Math.min(lv <= 2 ? 3 : 4, big.length))] || unit * 10;
          const st = lv <= 2 ? unit : lv === 3 ? Math.max(10, Math.min(...small.filter((x) => x >= 10), unit)) : Math.min(...all);
          const price = st * (1 + Math.floor(Math.random() * Math.max(1, pay / st - 1)));
          if (price < pay) {
            const back = pay - price, o = new Set([back]); let g2 = 0;
            const dd = lv <= 3 ? st : Math.max(st, 10), ks = [-10, -5, -2, -1, 1, 2, 5, 10];
            while (o.size < 3 && g2++ < 40) { const x = back + dd * ks[Math.floor(Math.random() * ks.length)]; if (x > 0 && x !== back) o.add(x); }
            for (let x = back + st; o.size < 3; x += st) o.add(x);
            this._gm.say = T('Es kostet {p}. Du zahlst mit {g}. Wie viel bekommst du zurück?', { p: fmt(price), g: fmt(pay) });
            area.innerHTML = `<div class="gmq"><div style="font-size:clamp(20px,6vw,28px);font-weight:900">🏷️ ${esc(fmt(price))}</div><div class="gmmoney">${pic0(pay)}</div><div class="gmtask" style="font-size:clamp(17px,4.6vw,22px)">${T('Es kostet {p}. Du zahlst mit {g}. Wie viel bekommst du zurück?', { p: esc(fmt(price)), g: esc(fmt(pay)) })}</div><div class="gmans">${[...o].sort(() => Math.random() - 0.5).map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === back ? 1 : ''}" style="font-size:20px">${esc(fmt(x))}</button>`).join('')}</div><div class="gmsol"></div>${bar(right, n)}</div>`;
            if ((this._db.kid[kid] || {}).rdr) this._sayKid(this._gm.say, kid);
            return;
          }
        }
        const items = draw();
        const sum = tot(items), step = Math.min(...items) >= unit ? unit : Math.min(...items);
        const opts = new Set([sum]); let g = 0;
        while (opts.size < 3 && g++ < 40) { const x = sum + step * (Math.floor(Math.random() * 5) - 2) * (1 + Math.floor(Math.random() * 2)); if (x > 0) opts.add(x); }
        for (let x = sum + step; opts.size < 3; x += step) opts.add(x);
        const arr = [...opts].sort(() => Math.random() - 0.5);
        const pic = pic0;
        this._gm.say = T('Wie viel Geld ist das?');
        area.innerHTML = `<div class="gmq"><div class="gmmoney">${items.map(pic).join('')}</div><div class="gmans">${arr.map((x) => `<button data-g="ans" data-v="${x}" data-ok="${x === sum ? 1 : ''}" style="font-size:20px">${esc(fmt(x))}</button>`).join('')}</div><div class="gmsol"></div><div class="gmbar"><i style="width:${Math.round((right / n) * 100)}%"></i></div></div>`;
        if ((this._db.kid[kid] || {}).rdr) this._sayKid(this._gm.say, kid);
      }, (right) => T('{n} richtig – du kannst Geld zählen! 💰', { n: right }));
    }
    // 🧩 Schiebe-Puzzle mit dem eigenen Haustier (3 × 3)
    _gm_puzzle(kid, area) {
      // 🧩 Schiebe-Puzzle (3×3) mit dem eigenen Haustier: oben die Vorlage (fertiges Bild mit Zahlen, Lücke unten rechts),
      // farbiger Hintergrund mit Mustern (auch „leere“ Teile sehen verschieden aus), große Zahlen, 💡 Tipp und 🔀 Neu mischen.
      // Gemischt wird immer mit echten Zügen aus dem fertigen Bild – das Puzzle ist darum immer lösbar.
      const g = this._gm, lv = this._gmLvl(kid), gs = this._gmSet('puzzle');
      // Größe: Knopf im Spiel (gemerkt je Kind) > Eltern-Vorgabe (⚙️) > automatisch (ab Klasse 3: 4×4)
      const zk = `yippee_pzsize_${kid}`; let zSaved = null; try { zSaved = localStorage.getItem(zk); } catch (x) { /* egal */ }
      let N = zSaved === '3' || zSaved === '4' ? Number(zSaved) : gs.size === 3 || gs.size === 4 ? gs.size : lv >= 3 ? 4 : 3, L = N * N - 1;
      const BG = 'radial-gradient(circle at 18% 22%,rgba(255,255,255,.75) 0 7%,transparent 8%),radial-gradient(circle at 82% 18%,rgba(255,212,59,.55) 0 9%,transparent 10%),radial-gradient(circle at 15% 85%,rgba(116,192,252,.55) 0 10%,transparent 11%),radial-gradient(circle at 85% 82%,rgba(255,135,135,.45) 0 8%,transparent 9%),linear-gradient(135deg,#ffd8e6 0%,#fff3bf 33%,#d3f9d8 66%,#c5e4ff 100%)';
      // Platz: im Querformat Vorlage + Knöpfe links, Puzzle rechts; sonst untereinander
      const lay = () => {
        const W = area.clientWidth, H = area.clientHeight, ok = W >= 120 && H >= 120;
        const w = ok ? W : Math.min(window.innerWidth, 600), h = ok ? H : Math.min(window.innerHeight, 700), row = w > h * 1.25;
        const pv = Math.round(Math.max(64, Math.min(120, (row ? h : w) * 0.24)));
        const sz = row ? Math.min(h - 24, w - pv - 70) : Math.min(w - 24, h - pv - 120);
        return { row, pv, size: Math.round(Math.max(150, sz)) };
      };
      let L0 = lay(), size = L0.size, pic = '', picS = '';
      const mkPic = () => { pic = this._gmPet(kid, { eyes: 'happy', mouth: 'open', open: 0.5 }, size); picS = this._gmPet(kid, { eyes: 'happy', mouth: 'open', open: 0.5 }, L0.pv); };
      mkPic();
      let tiles = [];
      const gap = () => tiles.indexOf(L);
      const nb = (i) => [i - N, i + N, i % N ? i - 1 : -1, (i + 1) % N ? i + 1 : -1].filter((x) => x >= 0 && x < N * N);
      const mix = () => {
        tiles = Array.from({ length: N * N }, (_, i) => i); // Wert 8 = Lücke
        let prev = -1; for (let k = 0; k < (N === 4 ? (lv <= 0 ? 25 : lv <= 2 ? 50 : 100) : (lv <= 0 ? 10 : lv <= 2 ? 25 : 60)); k++) { const e = gap(), c = nb(e).filter((x) => x !== prev); const m = c[Math.floor(Math.random() * c.length)]; [tiles[e], tiles[m]] = [tiles[m], tiles[e]]; prev = e; }
        if (tiles.every((v, i) => v === i)) { const e = gap(), m = nb(e)[0]; [tiles[e], tiles[m]] = [tiles[m], tiles[e]]; }
      };
      mix();
      let moves = 0, tip = -1, tipT = 0;
      // 🔢 Zahlen auf den Teilen an/aus – merkt sich das Gerät je Kind (Standard: an)
      const nk = `yippee_pznum_${kid}`; let num = gs.num !== false; try { const v = localStorage.getItem(nk); if (v === '0' || v === '1') num = v === '1'; } catch (x) { /* egal */ }
      g.say = T('Schieb die Teile, bis das Bild wieder stimmt! Die Zahlen 1 bis {n} der Reihe nach, die Lücke unten rechts.', { n: L });
      // 💡 nächster sinnvoller Zug: IDA* mit Manhattan-Abstand (für 3×3 in Millisekunden)
      let nodes = 0, lastFrom = -1;
      const nextMove = () => {
        const st = tiles.slice();
        const hh = () => { let x = 0; for (let i = 0; i < st.length; i++) { const v = st[i]; if (v !== L) x += Math.abs((v % N) - (i % N)) + Math.abs(Math.floor(v / N) - Math.floor(i / N)); } return x; };
        let first = -1;
        const dfs = (e, d, lim, prev) => {
          if (++nodes > 250000) return Infinity;
          const h = hh(); if (h === 0) return -1; if (d + h > lim) return d + h;
          let min = Infinity;
          for (const m of nb(e)) {
            if (m === prev) continue;
            [st[e], st[m]] = [st[m], st[e]];
            const r = dfs(m, d + 1, lim, e);
            [st[e], st[m]] = [st[m], st[e]];
            if (r === -1) { if (d === 0) first = m; return -1; }
            if (r < min) min = r;
          }
          return min;
        };
        let lim = hh(); nodes = 0;
        for (let k = 0; k < 60 && lim !== -1 && lim !== Infinity && nodes < 250000; k++) lim = dfs(st.indexOf(L), 0, lim, -1);
        if (first >= 0) return first;
        // 4×4 zu schwer für die schnelle Suche: Zug, der den Abstand am meisten verringert (nicht den letzten zurück)
        const e = tiles.indexOf(L); let bestM = -1, bestH = Infinity;
        for (const m of nb(e)) { if (m === lastFrom) continue; [st[e], st[m]] = [st[m], st[e]]; const h = hh(); [st[e], st[m]] = [st[m], st[e]]; if (h < bestH) { bestH = h; bestM = m; } }
        return bestM >= 0 ? bestM : nb(e)[0];
      };
      // eine Reihe/Spalte zur Lücke schieben (wie beim echten Schiebe-Puzzle) – true, wenn sich etwas bewegt hat
      const slide = (i) => {
        let e = gap();
        const sameRow = Math.floor(i / N) === Math.floor(e / N), sameCol = i % N === e % N;
        if (i === e || (!sameRow && !sameCol)) return false;
        const st = sameRow ? Math.sign(i - e) : Math.sign(i - e) * N;
        while (e !== i) { [tiles[e], tiles[e + st]] = [tiles[e + st], tiles[e]]; lastFrom = e; e += st; }
        moves++; tip = -1; this._gmScore(moves); draw();
        if (tiles.every((v, j) => v === j)) { g.score = Math.max(1, (N === 4 ? 200 : 100) - moves); g.tm.push(setTimeout(() => this._gmEnd(true, T('Geschafft in {n} Zügen! 🧩', { n: moves })), 500)); }
        return true;
      };
      const draw = () => {
        const L1 = lay(); if (Math.abs(L1.size - size) > 4 || L1.pv !== L0.pv) { L0 = L1; size = L1.size; mkPic(); } else L0 = L1;
        const ts = size / N, e = gap(), pv = L0.pv, ps = pv / N, fs = Math.round(Math.max(12, Math.min(26, ts * 0.2)));
        const mv = (i) => i !== e && (Math.floor(i / N) === Math.floor(e / N) || i % N === e % N);
        const prev = `<div class="gmpzv" style="width:${pv}px;height:${pv}px;background:${BG}">${picS}${Array.from({ length: N * N }, (_, i) => `<b style="left:${(i % N) * ps}px;top:${Math.floor(i / N) * ps}px;width:${ps}px;height:${ps}px" class="${i === L ? 'gp' : ''}">${i === L || !num ? '' : i + 1}</b>`).join('')}</div>`;
        area.innerHTML = `<div class="gmpzw ${L0.row ? 'row' : ''}"><div class="gmpzs"><div class="gmpzt">${prev}<small>${num ? T('So soll es aussehen: 1–{n} der Reihe nach, die Lücke unten rechts.', { n: L }) : T('So soll es aussehen – die Lücke unten rechts.')}</small></div>
          <div class="gmpzb">${gs.hint !== false ? `<button data-g="pzhint">${T('💡 Tipp')}</button>` : ''}<button data-g="pzmix">${T('🔀 Neu mischen')}</button><button data-g="pznum" aria-pressed="${num}">${num ? T('🔢 Zahlen aus') : T('🔢 Zahlen an')}</button><button data-g="pzsize">${N === 3 ? '🧩 4×4' : '🧩 3×3'}</button></div></div>
          <div class="gmpz" style="width:${size}px;height:${size}px">${tiles.map((v, i) => v === L ? '' : `<button data-g="pz" data-i="${i}" class="${mv(i) ? 'mv' : ''} ${i === tip ? 'tip' : ''}" style="left:${(i % N) * ts}px;top:${Math.floor(i / N) * ts}px;width:${ts - 4}px;height:${ts - 4}px"><span style="left:${-(v % N) * ts}px;top:${-Math.floor(v / N) * ts}px;width:${size}px;height:${size}px;background:${BG}">${pic}</span>${num ? `<i style="font-size:${fs}px;min-width:${Math.round(fs * 1.6)}px;height:${Math.round(fs * 1.6)}px">${v + 1}</i>` : ''}</button>`).join('')}</div></div>`;
      };
      // Bedienung: Jede Berührung wird genau EINMAL ausgewertet – beim Loslassen (pointerup): kurz tippen = Teil (bzw. ganze Reihe)
      // rückt in die Lücke, wischen = Teil in Wischrichtung schieben. Das „click“, das der Browser danach noch schickt, wird immer
      // ignoriert – auf manchen Tablets/in der App kommt es deutlich später und landete sonst auf dem gerade verschobenen Teil
      // (das sprang dann wieder zurück). Nur ein click ohne vorherige Berührung (z. B. Tastatur) schiebt selbst.
      let d0 = null, ptr = false;
      g.on = (b) => {
        if (b.dataset.g === 'pzhint') {
          const m = nextMove(); if (m < 0) return;
          tip = m; draw(); clearTimeout(tipT); tipT = setTimeout(() => { if (this._gm === g && tip === m) { tip = -1; draw(); } }, 2600); g.tm.push(tipT);
          if ((this._db.kid[kid] || {}).rdr) this._sayKid(T('Schieb das blinkende Teil!'), kid);
          return;
        }
        if (b.dataset.g === 'pzmix') { mix(); moves = 0; tip = -1; lastFrom = -1; this._gmScore(0); draw(); return; }
        if (b.dataset.g === 'pzsize') { N = N === 3 ? 4 : 3; L = N * N - 1; try { localStorage.setItem(zk, String(N)); } catch (x) { /* egal */ } mix(); moves = 0; tip = -1; lastFrom = -1; this._gmScore(0); g.say = T('Schieb die Teile, bis das Bild wieder stimmt! Die Zahlen 1 bis {n} der Reihe nach, die Lücke unten rechts.', { n: L }); draw(); return; }
        if (b.dataset.g === 'pznum') { num = !num; try { localStorage.setItem(nk, num ? '1' : '0'); } catch (x) { /* egal */ } draw(); return; }
        if (b.dataset.g !== 'pz') return;
        if (ptr) { ptr = false; return; }
        slide(Number(b.dataset.i));
      };
      const pd = (ev) => { const b = ev.target.closest && ev.target.closest('[data-g=pz]'); ptr = !!b; d0 = b && ev.isPrimary !== false ? { i: Number(b.dataset.i), v: tiles[Number(b.dataset.i)], x: ev.clientX, y: ev.clientY, id: ev.pointerId } : null; };
      const pu = (ev) => {
        if (!d0 || ev.pointerId !== d0.id) return;
        const dx = ev.clientX - d0.x, dy = ev.clientY - d0.y, i = d0.i, v = d0.v; d0 = null;
        if (tiles[i] !== v) return; // Teil liegt nicht mehr dort (doppelte Meldung)
        if (Math.hypot(dx, dy) < 14) { slide(i); return; }
        const e = gap(), hz = Math.abs(dx) > Math.abs(dy);
        const ok = hz ? Math.floor(i / N) === Math.floor(e / N) && Math.sign(e - i) === Math.sign(dx) : i % N === e % N && Math.sign(e - i) === Math.sign(dy);
        if (ok) slide(i);
      };
      const pc = () => { d0 = null; };
      area.addEventListener('pointerdown', pd); area.addEventListener('pointerup', pu); area.addEventListener('pointercancel', pc);
      let rt = 0; const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { if (this._gm === g && Math.abs(lay().size - size) > 4) draw(); }, 80); }) : null;
      if (ro) ro.observe(area);
      g.off = () => { area.removeEventListener('pointerdown', pd); area.removeEventListener('pointerup', pu); area.removeEventListener('pointercancel', pc); if (ro) ro.disconnect(); clearTimeout(rt); clearTimeout(tipT); };
      g.pz = { get tiles() { return tiles; }, get num() { return num; }, nextMove, slide, mix };
      draw();
    }
    // ---------- 🧩 Fragen-Spiele: Labyrinth, Zugfahrt, Schatzkarte, Seerosen (und Fragetore im Abenteuer) ----------
    // Fragen kommen aus den Lernspielen (Rechnen, Zählen, Buchstaben, Uhr, Geld) – mit allen Fragearten und passend zur Klasse.
    // Jede Frage hat genau einen Versuch: falsch ist falsch (die Lösung wird kurz gezeigt), danach geht es weiter.
    _gmQ(kid, list) {
      const g = this._gm || (this._gm = { tm: [] });
      const all = list || QG, on = all.filter((x) => x === 'mul1' || !this._gmSet(x).off), pool = on.length ? on : all;
      let gm = pool[Math.floor(Math.random() * pool.length)];
      if (gm === 'mul1') { // ✖️ schnelle Einmaleins-Frage (Seerosen)
        const lv = this._gmLvl(kid), rows = lv <= 2 ? [2, 5, 10] : [2, 3, 4, 5, 6, 7, 8, 9, 10], a = rows[Math.floor(Math.random() * rows.length)], b = 1 + Math.floor(Math.random() * 10), res = a * b;
        g.say = T('Wie viel ist {a} mal {b}?', { a, b });
        return (g._q = { gm, task: `<div class="gmtask">${a} × ${b}</div>`, ans: this._gmOpts(res, a).map((x) => ({ h: String(x), ok: x === res, v: String(x), st: '' })), cols: '', say: g.say });
      }
      g.qgen = g.qgen || {};
      let gen = g.qgen[gm];
      if (!gen) {
        const area = document.createElement('div'); let ask = null;
        this._gmQuiz = (k, a, f) => { ask = f; };
        try { this[`_gm_${gm}`](kid, area); } finally { delete this._gmQuiz; }
        gen = g.qgen[gm] = { area, ask };
      }
      gen.ask(0, 10);
      const a = gen.area, box = a.querySelector('.gmans'), q = a.querySelector('.gmq');
      const ans = box ? [...box.querySelectorAll('[data-g=ans]')].map((b) => ({ h: b.innerHTML, ok: !!b.dataset.ok, v: b.dataset.v || '', st: b.getAttribute('style') || '' })) : [];
      if (q) { q.querySelectorAll('.gmans,.gmsol,.gmbar').forEach((x) => x.remove()); const f = q.firstElementChild; if (gm === 'math' && f && f.tagName === 'DIV' && !f.className) f.remove(); }
      return (g._q = { gm, task: q ? q.innerHTML : '', ans, cols: box ? box.style.gridTemplateColumns : '', say: g.say });
    }
    // Frage als Fenster über dem Spiel; done(richtig) kommt nach der Antwort
    _gmQSay(q) { const N = (x) => String(x || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;|&#\d+;/g, ' ').replace(/[\s\u00a0\u202f]+/g, ' ').trim(), say = String(q.say || '').trim(); return say && !N(q.task).includes(N(say)) ? `<div class="gmtask" style="font-size:clamp(18px,5vw,24px)">${esc(say)}</div>` : ''; }
    _gmQShow(host, q, done) {
      const g = this._gm, p = document.createElement('div'); p.className = 'gmqp';
      p.innerHTML = `<div class="gmq">${q.task}${this._gmQSay(q)}<div class="gmans" ${q.cols ? `style="grid-template-columns:${q.cols}"` : ''}>${q.ans.map((x, i) => `<button data-g="qa" data-i="${i}" ${x.st ? `style="${x.st}"` : ''}>${x.h}</button>`).join('')}</div><div class="gmsol"></div></div>`;
      host.appendChild(p);
      g.qa = (b) => this._gmQPick(b, q, p, (ok) => { p.remove(); done(ok); });
      if ((this._db.kid[g.kid || this._gmKid] || {}).rdr && q.say) this._sayKid(q.say, g.kid || this._gmKid);
    }
    _gmQPick(b, q, box, done) {
      const g = this._gm; if (!g || g.qlock) return;
      const a = q.ans[Number(b.dataset.i)]; if (!a) return;
      g.qlock = true; g.qa = null;
      if (this._cfg.peStat !== false) { g.st = g.st || [0, 0, 0]; if (a.ok) { g.st[0]++; g.st[1]++; } else g.st[2]++; }
      b.classList.add(a.ok ? 'ok' : 'no');
      if (!a.ok) {
        { const t = document.createElement('div'); t.innerHTML = `<div class="gmq">${q.task}</div><div class="gmans">${q.ans.map((x) => `<b data-ok="${x.ok ? 1 : ''}" data-v="${esc(x.v)}"></b>`).join('')}</div>`; g.say = q.say || g.say; this._gmWqNote(t, false, q.gm === 'mul1' ? 'mul' : q.gm); }
        const i = q.ans.findIndex((x) => x.ok), c = box.querySelector(`[data-g=qa][data-i="${i}"]`); if (c) c.classList.add('sol');
        const s = box.querySelector('.gmsol'); if (s) s.textContent = T('Richtig wäre {x}.', { x: i >= 0 ? q.ans[i].v : '' });
      }
      g.qn = (g.qn || 0) + 1; if (a.ok) g.qok = (g.qok || 0) + 1;
      (g.tm || []).push(setTimeout(() => { g.qlock = false; done(a.ok); }, a.ok ? 700 : 1700));
    }
    _gmQStat() { const g = this._gm; return `✅ ${g.qok || 0}/${g.qn || 0}`; }

    // 🧩 Labyrinth: auf dem Weg zum Ziel liegen 🎁 Fragekisten; Steuerkreuz unten rechts (oder Pfeiltasten)
    _gm_maze(kid, area) {
      const g = this._gm, lv = this._gmLvl(kid);
      const W = [5, 6, 7, 8, 9, 9, 10][Math.max(0, Math.min(6, lv))], H = W, nQ = [3, 4, 5, 6, 7, 7, 8][Math.max(0, Math.min(6, lv))];
      const TW = 2 * W + 1, TH = 2 * H + 1, wall = Array.from({ length: TH }, () => Array(TW).fill(1));
      // Labyrinth erzeugen (Tiefensuche mit Zufall)
      const seen = Array.from({ length: H }, () => Array(W).fill(false)), st = [[0, 0]]; seen[0][0] = true; wall[1][1] = 0;
      while (st.length) {
        const [cx, cy] = st[st.length - 1], nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [cx + dx, cy + dy, dx, dy]).filter(([x, y]) => x >= 0 && y >= 0 && x < W && y < H && !seen[y][x]);
        if (!nb.length) { st.pop(); continue; }
        const [nx, ny, dx, dy] = nb[Math.floor(Math.random() * nb.length)];
        seen[ny][nx] = true; wall[2 * cy + 1 + dy][2 * cx + 1 + dx] = 0; wall[2 * ny + 1][2 * nx + 1] = 0; st.push([nx, ny]);
      }
      // außen rundum zu – nur links oben der Eingang und rechts unten der Ausgang (🏁)
      wall[1][0] = 0; wall[TH - 2][TW - 1] = 0;
      const S0 = [1, 1], G0 = [TW - 1, TH - 2];
      // kürzester Weg → Fragekisten gleichmäßig darauf verteilen
      const prev = {}, qq = [S0], key = (x, y) => `${x},${y}`; prev[key(...S0)] = null;
      while (qq.length) { const [x, y] = qq.shift(); if (x === G0[0] && y === G0[1]) break; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const a = x + dx, b = y + dy; if (a >= 0 && b >= 0 && a < TW && b < TH && !wall[b][a] && !(key(a, b) in prev)) { prev[key(a, b)] = [x, y]; qq.push([a, b]); } }); }
      const path = []; for (let c = G0; c; c = prev[key(...c)]) path.unshift(c);
      const boxes = {}; for (let i = 1; i <= nQ; i++) { const p = path[Math.round((i * (path.length - 1)) / (nQ + 1))]; if (p) boxes[key(...p)] = 'q'; }
      // mehrere Wege: zusätzliche Durchgänge zwischen den Gängen – aber nur, wenn man die 🎁 Kisten damit nicht umgehen kann
      const reach = () => { const seen0 = new Set([key(...S0)]), q0 = [S0]; while (q0.length) { const [x, y] = q0.shift(); if (x === G0[0] && y === G0[1]) return true; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, b = y + dy, k0 = key(a, b); if (a < 0 || b < 0 || a >= TW || b >= TH || wall[b][a] || boxes[k0] || seen0.has(k0)) continue; seen0.add(k0); q0.push([a, b]); } } return false; };
      for (let i = 0, made = 0; i < W * 12 && made < Math.max(2, Math.round(W * 0.6)); i++) {
        const x = 1 + Math.floor(Math.random() * (TW - 2)), y = 1 + Math.floor(Math.random() * (TH - 2));
        if (!wall[y][x] || (x % 2 === 0) === (y % 2 === 0)) continue; // nur Wandstücke zwischen zwei Feldern (keine breiten Flächen)
        wall[y][x] = 0; if (reach()) wall[y][x] = 1; else made++;
      }
      const P = { x: S0[0], y: S0[1] };
      let busy = false, done = false;
      g.qok = 0; g.qn = 0;
      // 🏰 Burg: Zinnen oben, 🔥 flackernde Fackeln und 🛡️ Schilde an Mauern neben den Gängen, 🚪 Burgtor, 👑 Thronsaal
      const deco = {}, near0 = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const a = x + dx, b = y + dy; return a >= 0 && b >= 0 && a < TW && b < TH && !wall[b][a]; });
      const wl = []; for (let y = 1; y < TH - 1; y++) for (let x = 0; x < TW; x++) if (wall[y][x] && near0(x, y)) wl.push([x, y]);
      for (let i = 0; i < Math.min(wl.length, Math.round(W * 0.9)); i++) { const j = Math.floor(Math.random() * wl.length), [x, y] = wl.splice(j, 1)[0]; deco[key(x, y)] = i % 3 === 2 ? 'sh' : 't'; }
      const cell = (w, x, y) => {
        const k0 = key(x, y);
        if (x === G0[0] && y === G0[1]) return `<i class="gl" data-xy="${k0}">👑</i>`;
        if (x === 0 && y === 1) return `<i class="dr" data-xy="${k0}">🚪</i>`;
        if (w) { const d = deco[k0]; if (y === 0 && x % 2 === 1) return `<i class="w cr" data-xy="${k0}"></i>`; return `<i class="w ${d || ''}" data-xy="${k0}"${d === 't' ? ` style="animation-delay:-${(x * 0.37 + y * 0.21) % 1.1}s"` : ''}>${d === 't' ? `<b style="animation-delay:-${(x * 0.13 + y * 0.29) % 0.45}s">🔥</b>` : d === 'sh' ? '<b>🛡️</b>' : ''}</i>`; }
        return `<i class="${boxes[k0] ? 'q' : ''}" data-xy="${k0}">${boxes[k0] ? '📜' : ''}</i>`;
      };
      area.innerHTML = `<div class="gmcol mzc"><div class="gmmzw"><div class="gmmz" style="grid-template-columns:repeat(${TW},1fr);grid-template-rows:repeat(${TH},1fr)">${wall.map((r, y) => r.map((w, x) => cell(w, x, y)).join('')).join('')}<b class="gmmp" style="width:${100 / TW}%;height:${100 / TH}%">${this._gmPet(kid, { eyes: 'happy', mouth: 'smile' }, 60)}</b></div></div>
        <div class="gmctl"><div class="gmqs"><b class="gmqsc">${this._gmQStat()}</b><span>⭐ <b class="gmqst">0</b></span></div>
          <div class="gmdp"><button data-g="mv" data-d="u" aria-label="▲">▲</button><button data-g="mv" data-d="l" aria-label="◀">◀</button><button data-g="mv" data-d="r" aria-label="▶">▶</button><button data-g="mv" data-d="d" aria-label="▼">▼</button></div></div></div>`;
      const pm = area.querySelector('.gmmp'), mz = area.querySelector('.gmmz');
      const put = () => { pm.style.left = `${(P.x * 100) / TW}%`; pm.style.top = `${(P.y * 100) / TH}%`; };
      const fit = () => { const w = area.querySelector('.gmmzw'); if (!w) return; const s = Math.max(120, Math.min(w.clientWidth, (w.clientHeight * TW) / TH)); mz.style.width = `${s}px`; mz.style.height = `${s * (TH / TW)}px`; };
      // 📜 Schriftrollen sind versteckt – sie erscheinen erst, wenn das Tier höchstens 2 Schritte (entlang der Gänge) entfernt ist
      const reveal = () => {
        const sn = new Set([key(P.x, P.y)]); let fr = [[P.x, P.y]];
        for (let d = 0; d < 2; d++) { const nf = []; fr.forEach(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const a = x + dx, b = y + dy, k0 = key(a, b); if (a < 0 || b < 0 || a >= TW || b >= TH || wall[b][a] || sn.has(k0)) return; sn.add(k0); nf.push([a, b]); })); fr = nf; }
        sn.forEach((k0) => { if (boxes[k0] === 'q') { const c = mz.querySelector(`[data-xy="${k0}"]`); if (c && !c.classList.contains('rv')) c.classList.add('rv'); } });
      };
      put(); fit(); reveal();
      const upd = () => { const a = area.querySelector('.gmqsc'), b = area.querySelector('.gmqst'); if (a) a.textContent = this._gmQStat(); if (b) b.textContent = String(g.qok || 0); this._gmScore(g.qok || 0); };
      const D = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
      const open = (x, y) => y >= 0 && x >= 0 && y < TH && x < TW && !wall[y][x];
      const exits = (x, y) => Object.values(D).filter(([dx, dy]) => open(x + dx, y + dy)).length;
      // ein Schritt; läuft im Gang weiter bis zur nächsten Abzweigung, Kiste oder zum Ziel
      const go = (d) => {
        if (busy || done || g.qa) return;
        const [dx, dy] = D[d] || [0, 0]; if (!open(P.x + dx, P.y + dy)) return;
        busy = true;
        const stepOne = () => {
          const nx = P.x + dx, ny = P.y + dy;
          if (boxes[key(nx, ny)] === 'q') {
            const q = this._gmQ(kid, QG);
            this._gmQShow(area, q, (ok) => {
              boxes[key(nx, ny)] = ok ? 'y' : 'n';
              const c = mz.querySelector(`[data-xy="${nx},${ny}"]`); if (c) { c.classList.add('rv'); c.textContent = ok ? '⭐' : '❌'; }
              upd(); if (ok) this._gmPop(area, area.clientWidth / 2, area.clientHeight / 3, '+1 ⭐');
              P.x = nx; P.y = ny; put(); reveal(); busy = false;
            });
            return;
          }
          P.x = nx; P.y = ny; put(); reveal();
          if (P.x === G0[0] && P.y === G0[1]) { done = true; busy = false; g.tm.push(setTimeout(() => this._gmEnd(true, T('Ziel erreicht! {a} von {b} Fragen richtig.', { a: g.qok || 0, b: g.qn || 0 })), 400)); return; }
          if (open(P.x + dx, P.y + dy) && exits(P.x, P.y) <= 2 && !(P.x === G0[0] && P.y === G0[1])) { g.tm.push(setTimeout(stepOne, 90)); return; }
          busy = false;
        };
        stepOne();
      };
      g.on = (b) => { if (b.dataset.g === 'qa' && g.qa) { g.qa(b); return; } if (b.dataset.g === 'mv') go(b.dataset.d); };
      const kd = (e) => { const m = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r' }[e.key]; if (m) { e.preventDefault(); go(m); } };
      window.addEventListener('keydown', kd);
      const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(fit) : null; if (ro) ro.observe(area);
      g.off = () => { window.removeEventListener('keydown', kd); if (ro) ro.disconnect(); };
      g.say = T('Finde den Weg durch die Burg zum 👑 – unterwegs tauchen 📜 Schriftrollen mit Fragen auf!');
      g.mz = { P, boxes, path, G0, go, wall, reach, get busy() { return busy; } };
    }

    // 🚂 Zugfahrt: die richtige Antwort stellt die Weiche – falsch geht aufs Abstellgleis
    _gm_train(kid, area) {
      const g = this._gm, n = this._gmQn(kid);
      g.qok = 0; g.qn = 0;
      const next = () => {
        if (g.qn >= n) { this._gmEnd(true, T('{a} von {b} richtig – alle Stationen geschafft! 🚂', { a: g.qok, b: n })); return; }
        // 🚂 auf die Gleise passen nur kurze Antworten – Fragen mit Münzen/Scheinen werden neu gezogen
        let q = this._gmQ(kid, QG);
        for (let t = 0; t < 12 && q.ans.some((x) => /<div|gmcoin|gmnote/i.test(x.h)); t++) q = this._gmQ(kid, QG);
        const k = q.ans.length, ys = q.ans.map((_, i) => Math.round(((i + 1) * 100) / (k + 1)));
        const rails = ys.map((y) => `<path d="M34 50 C52 50 52 ${y} 70 ${y} L100 ${y}"/>`).join('');
        area.innerHTML = `<div class="gmtr"><div class="gmq gmtrq">${q.task}${this._gmQSay(q)}</div>
          <div class="gmtrs"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g class="rl"><path d="M0 50 L34 50"/>${rails}</g></svg>
            <div class="gmtrn" style="left:4%;top:50%">🚂</div>
            ${q.ans.map((x, i) => `<button data-g="qa" data-i="${i}" class="gmsig" style="top:${ys[i]}%;${x.st}">${x.h}</button>`).join('')}</div>
          <div class="gmctl"><div class="gmqs"><b class="gmqsc">${this._gmQStat()}</b><span>⭐ <b class="gmqst">${g.qok}</b></span><span>🚉 ${g.qn + 1}/${n}</span></div></div><div class="gmsol"></div></div>`;
        const tr = area.querySelector('.gmtrn');
        g.qa = (b) => {
          const i = Number(b.dataset.i), y = ys[i];
          tr.style.left = '32%'; g.tm.push(setTimeout(() => { tr.style.left = '64%'; tr.style.top = `${y}%`; }, 420));
          g.qa = null;
          // 🚂 erst ankommen lassen und kurz am gewählten Gleis stehen bleiben, dann die nächste Frage
          this._gmQPick(b, q, area, (ok) => { if (ok) this._gmPop(area, area.clientWidth * 0.75, area.clientHeight * (y / 100) * 0.6 + 60, '+1 ⭐'); this._gmScore(g.qok); g.tm.push(setTimeout(next, ok ? 1200 : 600)); });
          if (!q.ans[i].ok) g.tm.push(setTimeout(() => { tr.textContent = '🚂💨'; }, 900));
        };
        g.say = q.say;
        if ((this._db.kid[kid] || {}).rdr && q.say) this._sayKid(q.say, kid);
      };
      g.on = (b) => { if (b.dataset.g === 'qa' && g.qa) g.qa(b); };
      next();
    }

    // 🏝️ Schatzkarte: würfeln, auf ❓-Feldern eine Frage – richtig = 2 Felder vor. Allein oder zu zweit.
    _gm_board(kid, area) {
      // ❓ fast überall eine Frage, 🏖️ Rastplätze (jedes 5. Feld) ohne Frage zum Verschnaufen
      const g = this._gm, N = 30, SAFE = new Set([5, 10, 15, 20, 25]), QF = new Set(Array.from({ length: N }, (_, i) => i).filter((i) => i > 0 && i < N - 1 && !SAFE.has(i)));
      // 🗺️ Schatzkarte: Pergament mit Meer am Rand, ein geschwungener Pfad aus Trittsteinen (5 Reihen, Kurven an den Enden), ❌ markiert den Schatz
      const cols = 6, pos = (i) => { const r = Math.floor(i / cols), k = i % cols, c = r % 2 ? cols - 1 - k : k; return [13 + c * 14.8, 22 + r * 17.2 + Math.sin(c * 1.3 + r * 2) * 2.8]; };
      // 🏴‍☠️ Piraten-Schatzkarte: Pergament mit ausgefranstem Rand, Seil-Rahmen, Flecken und Brandlöchern, Meer mit Schiffswrack, Piratenschiff, Kraken und Hai, Kompassrose, Palmeninsel, Totenkopf-Felsen
      const trail = (() => { const P = Array.from({ length: N }, (_, i) => pos(i)); let d = `M${P[0][0] * 6} ${P[0][1] * 7.6}`; for (let i = 1; i < N; i++) { const [x0, y0] = P[i - 1], [x1, y1] = P[i]; if (Math.floor(i / cols) !== Math.floor((i - 1) / cols)) { const bx = x0 > 50 ? 96 : 4; d += ` C${bx * 6} ${y0 * 7.6} ${bx * 6} ${y1 * 7.6} ${x1 * 6} ${y1 * 7.6}`; } else d += ` Q${((x0 + x1) / 2) * 6} ${((y0 + y1) / 2 + 2.2) * 7.6} ${x1 * 6} ${y1 * 7.6}`; } return d; })();
      let sd = 7; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
      const jag = (x0, y0, x1, y1, n, amp) => { const pts = []; for (let sd0 = 0; sd0 < 4; sd0++) for (let j = 0; j < n; j++) { const t = j / n, a = (rnd() * 2 - 1) * amp; let x, y; if (sd0 === 0) { x = x0 + (x1 - x0) * t; y = y0 + a; } else if (sd0 === 1) { x = x1 + a; y = y0 + (y1 - y0) * t; } else if (sd0 === 2) { x = x1 - (x1 - x0) * t; y = y1 + a; } else { x = x0 + a; y = y1 - (y1 - y0) * t; } pts.push(`${x.toFixed(1)},${y.toFixed(1)}`); } return pts.join(' '); };
      const outer = jag(26, 26, 574, 734, 24, 10); sd = 7; const inner = jag(38, 38, 562, 722, 24, 8);
      sd = 3; const stains = Array.from({ length: 9 }, () => `<circle cx="${80 + Math.round(rnd() * 440)}" cy="${80 + Math.round(rnd() * 600)}" r="${18 + Math.round(rnd() * 28)}" fill="#a0703a" opacity=".07"/>`).join('');
      const holes = [[560, 300, 6, 9], [44, 600, 7, 5], [300, 722, 8, 4]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3b2410" opacity=".85"/><ellipse cx="${x}" cy="${y}" rx="${rx + 4}" ry="${ry + 3}" fill="none" stroke="#7a4a1d" stroke-width="3" opacity=".5"/>`).join('');
      const grid = [100, 190, 280, 370, 460, 550, 640].map((y) => `<line x1="40" y1="${y}" x2="560" y2="${y}" stroke="#a0703a" opacity=".12"/>`).join('') + [90, 180, 270, 360, 450, 540].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="720" stroke="#a0703a" opacity=".12"/>`).join('');
      const waves = [[4, 60], [560, 140], [6, 300], [566, 420], [8, 560], [560, 640], [250, 6], [420, 748], [120, 750]].map(([x, y]) => `<path d="M${x} ${y} q8 -7 16 0 t16 0" fill="none" stroke="#a5d8ff" stroke-width="2.5" opacity=".7"/>`).join('');
      const compass = '<g transform="translate(520 82)"><circle r="40" fill="#f6e7c1" stroke="#7a4a1d" stroke-width="3"/><circle r="31" fill="none" stroke="#7a4a1d" stroke-width="1.5" stroke-dasharray="3 4"/><polygon points="0,-36 7,0 0,36 -7,0" fill="#7a4a1d"/><polygon points="-36,0 0,-7 36,0 0,7" fill="#a0703a"/><polygon points="0,-36 7,0 -7,0" fill="#c92a2a"/><text y="-43" text-anchor="middle" font-size="16" font-weight="900" fill="#7a4a1d" font-family="Georgia,serif">N</text></g>';
      const wreck = '<g transform="translate(70 92) rotate(-14)"><path d="M-48 8 L46 8 L36 34 L-36 34 Z" fill="#7b4a22" stroke="#4a2a10" stroke-width="3"/><path d="M-42 18 L40 18 M-30 26 L28 26" stroke="#5c3416" stroke-width="2"/><path d="M14 34 L22 20 L30 34 Z" fill="#2b6ca3" opacity=".9"/><line x1="-6" y1="8" x2="-12" y2="-50" stroke="#4a2a10" stroke-width="5" stroke-linecap="round"/><line x1="-12" y1="-50" x2="2" y2="-62" stroke="#4a2a10" stroke-width="4" stroke-linecap="round"/><path d="M-10 -44 L22 -40 L14 -22 L24 -12 L-8 -14 Z" fill="#efe2c2" stroke="#8b6a3a" stroke-width="2"/><path d="M-12 -50 L-34 -46 L-30 -36 L-12 -40 Z" fill="#222"/><circle cx="-23" cy="-44" r="2.6" fill="#fff"/></g><path d="M2 132 q16 -10 32 0 t32 0 t32 0 t32 0" fill="none" stroke="#e7f5ff" stroke-width="3" opacity=".8"/>';
      const ship = '<g transform="translate(330 30) scale(.42)"><path d="M-40 -4 L40 -4 L30 12 L-30 12 Z" fill="#6b3d1a"/><line x1="0" y1="-4" x2="0" y2="-52" stroke="#3b2410" stroke-width="4"/><path d="M2 -48 L30 -30 L2 -14 Z" fill="#f8f0dc"/><path d="M-2 -46 L-26 -30 L-2 -14 Z" fill="#f1e3c0"/><path d="M0 -52 L-16 -58 L0 -64 Z" fill="#111"/></g>';
      const fin = '<g transform="translate(588 520)"><path d="M-10 10 Q-2 -22 10 -26 Q6 -6 12 10 Z" fill="#6c7a89" stroke="#3d4852" stroke-width="2"/><path d="M-16 12 q8 -5 16 0 t16 0" fill="none" stroke="#e7f5ff" stroke-width="2.5"/></g>';
      const tent = '<g transform="translate(14 420)"><path d="M-6 40 C 10 20, -4 0, 10 -14 C 20 -24, 30 -10, 20 -4 C 12 2, 18 12, 6 40 Z" fill="#9c36b5" stroke="#5f1e70" stroke-width="2"/><circle cx="12" cy="-6" r="2.5" fill="#e599f7"/><circle cx="10" cy="6" r="2.5" fill="#e599f7"/><circle cx="7" cy="18" r="2.5" fill="#e599f7"/></g>';
      const island = '<g transform="translate(300 372) scale(.85)"><ellipse rx="34" ry="12" fill="#e9c46a" stroke="#c9a227" stroke-width="2"/><path d="M-2 0 Q-4 -22 4 -36" stroke="#7a4a1d" stroke-width="4" fill="none"/><path d="M4 -36 q-18 -6 -26 6 M4 -36 q16 -8 26 4 M4 -36 q-6 -14 -18 -14 M4 -36 q8 -14 20 -12" stroke="#2f9e44" stroke-width="5" fill="none" stroke-linecap="round"/></g>';
      const skull = '<g transform="translate(384 502) scale(.85)"><path d="M-26 14 Q-30 -18 0 -22 Q30 -18 26 14 Z" fill="#adb5bd" stroke="#495057" stroke-width="2"/><circle cx="-9" cy="-4" r="6" fill="#343a40"/><circle cx="9" cy="-4" r="6" fill="#343a40"/><path d="M-6 8 L-2 4 L2 8 L6 4" stroke="#343a40" stroke-width="2" fill="none"/></g>';
      const DECO = [['🏴‍☠️', 33, 30.5], ['⚔️', 68, 30.5], ['🦜', 22, 47.5], ['💰', 80, 47.5], ['🗝️', 36, 65], ['💎', 86, 65], ['🦀', 24, 82.5], ['🔭', 58, 82.5]];
      const map = `<svg viewBox="0 0 600 760" preserveAspectRatio="none" aria-hidden="true"><defs><radialGradient id="gmpa" cx="50%" cy="48%" r="70%"><stop offset="0" stop-color="#fbf0cf"/><stop offset=".6" stop-color="#f0d9a0"/><stop offset="1" stop-color="#d0a35c"/></radialGradient><linearGradient id="gmsea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c7ed6"/><stop offset="1" stop-color="#0b4f8a"/></linearGradient></defs>`
        + `<rect width="600" height="760" fill="url(#gmsea)"/>${waves}<polygon points="${outer}" fill="#9c6a2e"/><polygon points="${inner}" fill="url(#gmpa)"/>${grid}${stains}${holes}<polygon points="${inner}" fill="none" stroke="#d9b26b" stroke-width="5" stroke-dasharray="9 5" opacity=".9"/>${island}${skull}`
        + `<path d="${trail}" fill="none" stroke="#a61e1e" stroke-width="5" stroke-dasharray="10 12" stroke-linecap="round" opacity=".75"/>${compass}${wreck}${fin}${tent}${ship}</svg>${DECO.map(([e, x, y]) => `<span class="dc" style="left:${x}%;top:${y}%">${e}</span>`).join('')}`;
      const CHEST = '<svg viewBox="-30 -30 60 60" aria-hidden="true"><path d="M-22 -2 L22 -2 L20 20 L-20 20 Z" fill="#8b4f1e" stroke="#4a2a10" stroke-width="2"/><path d="M-22 -2 Q0 -26 22 -2 Z" fill="#a0612a" stroke="#4a2a10" stroke-width="2" transform="rotate(-18 -22 -2)"/><circle cx="-8" cy="-6" r="5" fill="#ffd43b" stroke="#e67700"/><circle cx="3" cy="-8" r="5" fill="#ffe066" stroke="#e67700"/><circle cx="12" cy="-4" r="4.5" fill="#ffd43b" stroke="#e67700"/><rect x="-4" y="4" width="8" height="8" rx="1.5" fill="#ffd43b" stroke="#a0620a"/><path d="M-20 8 L20 8" stroke="#4a2a10" stroke-width="2"/></svg>';
      const HAT = '<svg class="hat" viewBox="-20 -12 40 18" aria-hidden="true"><path d="M-19 4 Q0 -18 19 4 Q0 0 -19 4 Z" fill="#212529"/><path d="M-19 4 Q0 0 19 4" stroke="#ffd43b" stroke-width="1.5" fill="none"/><circle cx="0" cy="-4" r="3" fill="#fff"/></svg>';
      let pl = [], cur = 0, busy = false;
      const pet = this._gmPet(kid, { eyes: 'happy', mouth: 'smile' }, 40);
      const start = (k) => {
        pl = Array.from({ length: k }, (_, i) => ({ at: 0, ok: 0, n: 0, tok: i ? '🦊' : '', name: k > 1 ? T('Spieler {n}', { n: i + 1 }) : '' }));
        cur = 0; draw();
      };
      const cellHtml = (i) => { const [x, y] = pos(i); return `<i style="left:${x}%;top:${y}%" class="${QF.has(i) ? 'q' : ''} ${SAFE.has(i) ? 'safe' : ''} ${i === N - 1 ? 'end' : ''}">${i === N - 1 ? '<b>✕</b>' : ''}${i === 0 ? '⚓' : i === N - 1 ? CHEST : SAFE.has(i) ? '🏖️' : QF.has(i) ? '?' : ''}<em>${pl.map((p, j) => (p.at === i ? `<span class="tk${j}">${HAT}${j ? p.tok : pet}</span>` : '')).join('')}</em></i>`; };
      const draw = (msg) => {
        const P = pl[cur];
        area.innerHTML = `<div class="gmbd pir"><div class="gmbdw"><div class="gmbdb">${map}${Array.from({ length: N }, (_, i) => cellHtml(i)).join('')}</div></div>
          <div class="gmctl"><div class="gmqs">${pl.map((p, j) => `<b class="${j === cur ? 'on' : ''}">${pl.length > 1 ? `${j ? '🦊' : '🐾'} ` : ''}✅ ${p.ok}/${p.n}</b>`).join('')}<span>${msg ? esc(msg) : pl.length > 1 ? T('{name} ist dran', { name: P.name }) : ''}</span></div>
          <button class="gmdice" data-g="dice" ${busy ? 'disabled' : ''}>🎲</button></div></div>`;
      };
      const move = (steps, after) => {
        const P = pl[cur]; let k = 0;
        const one = () => { if (k >= steps || P.at >= N - 1) { after(); return; } P.at++; k++; draw(); g.tm.push(setTimeout(one, 260)); };
        one();
      };
      const turnEnd = (msg) => {
        const P = pl[cur];
        if (P.at >= N - 1) { busy = false; const w = pl.length > 1 ? T('{name} hat den Schatz gefunden! 💰', { name: P.name }) : T('Schatz gefunden! {a} von {b} Fragen richtig.', { a: P.ok, b: P.n }); g.score = pl[0].ok; this._gmEnd(true, w); return; }
        cur = (cur + 1) % pl.length; busy = false; draw(typeof msg === 'string' ? msg : '');
      };
      const land = () => {
        const P = pl[cur];
        if (QF.has(P.at) && P.at < N - 1) {
          const q = this._gmQ(kid, QG);
          this._gmQShow(area, q, (ok) => { P.n++; if (ok) { P.ok++; this._gmScore(pl[0].ok); move(2, turnEnd); draw(T('Richtig – 2 Felder vor! ⭐')); } else { draw(); turnEnd(); } });
          return;
        }
        turnEnd(SAFE.has(P.at) ? T('🏖️ Rastplatz – kurz verschnaufen!') : '');
      };
      g.on = (b) => {
        if (b.dataset.g === 'qa' && g.qa) { g.qa(b); return; }
        if (b.dataset.g === 'bdp') { start(Number(b.dataset.v) === 2 ? 2 : 1); return; }
        if (b.dataset.g === 'dice' && !busy && pl.length) {
          busy = true; const d = 1 + Math.floor(Math.random() * 6); draw(T('Gewürfelt: {n}', { n: d }));
          g.tm.push(setTimeout(() => move(d, land), 500));
          g.bd.last = d;
        }
      };
      g.bd = { get pl() { return pl; }, QF, SAFE, N, last: 0, get busy() { return busy; } };
      area.innerHTML = `<div class="gmq"><div style="font-size:64px">🏝️</div><b style="font-size:20px">${T('Wer spielt mit?')}</b>
        <div class="gmans" style="grid-template-columns:1fr 1fr"><button data-g="bdp" data-v="1">🐾 ${T('Allein')}</button><button data-g="bdp" data-v="2">🐾 🦊 ${T('Zu zweit')}</button></div></div>`;
      g.say = T('Würfle und finde den Schatz! Auf fast jedem Feld wartet eine Frage – auf den 🏖️ Rastplätzen darfst du verschnaufen.');
    }

    // 🐸 Seerosen: auf die Seerose mit der richtigen Antwort hüpfen – falsch = Platsch!
    _gm_lily(kid, area) {
      const g = this._gm, n = this._gmQn(kid), lv = this._gmLvl(kid), list = lv >= 2 ? ['mul1', 'mul1', ...QG] : QG;
      g.qok = 0; g.qn = 0;
      // 🏞️ Teich: Wellenringe, gezeichnete Seerosen, 🐟 Fische und 🦆 Ente schwimmen herum, Ufer mit Kieseln und Schilf
      const LOT = (x, y) => `<svg class="lot" viewBox="-20 -16 40 26" style="left:${x}%;top:${y}%"><ellipse cx="0" cy="6" rx="16" ry="5" fill="#40c057"/><path d="M0 4 C-6 -4 -4 -12 0 -15 C4 -12 6 -4 0 4Z" fill="#f783ac"/><path d="M0 4 C-12 0 -14 -8 -10 -10 C-6 -6 -3 0 0 4Z" fill="#faa2c1"/><path d="M0 4 C12 0 14 -8 10 -10 C6 -6 3 0 0 4Z" fill="#faa2c1"/><circle cy="-2" r="2.5" fill="#ffd43b"/></svg>`;
      const REED = (x, h) => `<svg class="reed" viewBox="0 0 30 120" style="left:${x}%;height:${h}%"><path d="M15 120 Q13 60 15 18" stroke="#2f9e44" stroke-width="3" fill="none"/><rect x="11" y="6" width="8" height="22" rx="4" fill="#7a4a1d"/><path d="M15 120 Q2 70 -2 40" stroke="#37b24d" stroke-width="3" fill="none"/><path d="M15 120 Q28 80 32 52" stroke="#40c057" stroke-width="3" fill="none"/></svg>`;
      const POND = [[14, 18, 12], [70, 14, 16], [30, 64, 18], [62, 72, 14], [45, 84, 10]].map(([x, y, w], i) => `<span class="rip" style="left:${x}%;top:${y}%;width:${w}%;animation-delay:-${i * 0.8}s"></span>`).join('')
        + `<span class="sw fi" style="top:62%;animation-duration:19s"><span style="animation-duration:19s">🐟</span></span><span class="sw fi" style="top:70%;animation-duration:24s;animation-delay:-11s"><span style="animation-duration:24s;animation-delay:-11s">🐠</span></span>`
        + `<span class="sw du" style="top:7%;animation-duration:30s;animation-delay:-6s"><span style="animation-duration:30s;animation-delay:-6s"><i>🦆</i></span></span><span style="position:absolute;left:10%;top:8%;font-size:20px;pointer-events:none">🦋</span>`
        + LOT(36, 15) + LOT(84, 60) + LOT(12, 62) + '<div class="shore"></div><span class="stn" style="left:16%"></span><span class="stn" style="left:76%;width:7%"></span>' + REED(-2, 30) + REED(4, 22) + REED(90, 28) + REED(96, 34);
      const PAD = (rot) => `<svg viewBox="-50 -50 100 100" aria-hidden="true"><defs><radialGradient id="gmpg" cx="40%" cy="35%"><stop offset="0" stop-color="#8ce99a"/><stop offset="1" stop-color="#2f9e44"/></radialGradient></defs><g transform="rotate(${rot})"><path d="M0 0 L46 -12 A48 48 0 1 1 30 -38 Z" fill="url(#gmpg)" stroke="#2b8a3e" stroke-width="2.5"/><path d="M0 0 L-30 -20 M0 0 L-36 14 M0 0 L-6 38 M0 0 L26 28 M0 0 L40 6" stroke="#2b8a3e" stroke-width="1.5" opacity=".5"/></g></svg>`;
      const next = () => {
        if (g.qn >= n) { this._gmEnd(true, T('{a} von {b} richtig – super gehüpft! 🐸', { a: g.qok, b: n })); return; }
        // 🪷 auf die runden Seerosen passen nur kurze Antworten – Fragen mit Münzen/Scheinen o. Ä. (HTML-Blöcke) werden neu gezogen
        let q = this._gmQ(kid, list);
        for (let t = 0; t < 12 && q.ans.some((x) => /<div|gmcoin|gmnote/i.test(x.h)); t++) q = this._gmQ(kid, list);
        const k = q.ans.length;
        area.innerHTML = `<div class="gmly"><div class="gmq gmlyq">${q.task}${this._gmQSay(q)}</div>
          <div class="gmlyp">${POND}${q.ans.map((x, i) => `<button data-g="qa" data-i="${i}" class="gmlil" style="left:${Math.round(((i + 0.5) * 100) / k)}%;animation-delay:-${i * 0.7}s;${x.st}">${PAD(i * 70 - 40)}<span>${x.h}</span></button>`).join('')}
            <div class="gmlyf">${this._gmPet(kid, { eyes: 'happy', mouth: 'open', open: 0.4 }, 70)}</div></div>
          <div class="gmctl"><div class="gmqs"><b class="gmqsc">${this._gmQStat()}</b><span>⭐ <b class="gmqst">${g.qok}</b></span><span>🪷 ${g.qn + 1}/${n}</span></div></div><div class="gmsol"></div></div>`;
        const fr = area.querySelector('.gmlyf');
        g.qa = (b) => {
          const i = Number(b.dataset.i); g.qa = null;
          fr.style.left = b.style.left; fr.classList.add('hop');
          // 🐸 Frosch bleibt kurz auf der Seerose sitzen, die richtige Seerose leuchtet – dann die nächste Frage
          this._gmQPick(b, q, area, (ok) => { if (ok) { this._gmScore(g.qok); this._gmPop(area, b.offsetLeft + b.offsetWidth / 2, b.offsetTop, '+1 ⭐'); } g.tm.push(setTimeout(next, ok ? 1200 : 900)); });
          if (!q.ans[i].ok) g.tm.push(setTimeout(() => { b.classList.add('sink'); fr.classList.add('splash'); }, 350));
        };
        g.say = q.say;
        if ((this._db.kid[kid] || {}).rdr && q.say) this._sayKid(q.say, kid);
      };
      g.on = (b) => { if (b.dataset.g === 'qa' && g.qa) g.qa(b); };
      next();
    }

    // 🎵 Simon: Farben und Töne merken (wird jede Runde schneller)
    _gm_simon(kid, area) { this._gm_song(kid, area, true); }
    // kurze Antworten für Planeten und Steine – Fragen mit Münzen/Scheinen werden neu gezogen
    _gmQShort(kid) { let q = this._gmQ(kid, QG); for (let t = 0; t < 12 && q.ans.some((x) => /<div|gmcoin|gmnote/i.test(x.h)); t++) q = this._gmQ(kid, QG); return q; }
    // 🚀 Weltraum: drei Planeten mit Antworten – die Rakete fliegt zum gewählten Planeten
    _gm_space(kid, area) {
      const g = this._gm, n = this._gmQn(kid), COL = [['#ff8787', '#c92a2a'], ['#74c0fc', '#1971c2'], ['#ffd43b', '#e67700'], ['#b197fc', '#6741d9'], ['#8ce99a', '#2b8a3e']];
      g.qok = 0; g.qn = 0;
      const tw = Array.from({ length: 14 }, (_, i) => `<i class="tw" style="left:${(i * 37) % 97}%;top:${(i * 53) % 90}%;animation-delay:${(i % 5) * -0.4}s"></i>`).join('');
      const next = () => {
        if (g.qn >= n) { this._gmEnd(true, T('{a} von {b} richtig – gute Landung! 🚀', { a: g.qok, b: n })); return; }
        const q = this._gmQShort(kid), k = q.ans.length, xs = q.ans.map((_, i) => Math.round(((i + 0.5) * 100) / k));
        const off = Math.floor(Math.random() * COL.length);
        area.innerHTML = `<div class="gmsp"><div class="gmq gmspq">${q.task}${this._gmQSay(q)}</div>
          <div class="gmsps">${tw}${q.ans.map((x, i) => { const c = COL[(i + off) % COL.length]; return `<button data-g="qa" data-i="${i}" class="gmpl" style="left:${xs[i]}%;top:${i % 2 ? 36 : 26}%;background:radial-gradient(circle at 32% 30%,${c[0]},${c[1]} 72%);${(i + off) % 2 ? '--ring:block;' : ''}${x.st}"><span>${x.h}</span></button>`; }).join('')}
            <div class="gmrk"><i>🚀</i></div></div>
          <div class="gmctl"><div class="gmqs"><b class="gmqsc">${this._gmQStat()}</b><span>⭐ <b class="gmqst">${g.qok}</b></span><span>🪐 ${g.qn + 1}/${n}</span></div></div><div class="gmsol"></div></div>`;
        const rk = area.querySelector('.gmrk');
        g.qa = (b) => {
          const i = Number(b.dataset.i); g.qa = null;
          rk.style.left = `${xs[i]}%`; rk.style.top = `${(i % 2 ? 36 : 26) + 16}%`;
          this._gmQPick(b, q, area, (ok) => { if (ok) this._gmPop(area, area.clientWidth * (xs[i] / 100), area.clientHeight * 0.35, '+1 ⭐'); this._gmScore(g.qok); g.tm.push(setTimeout(next, ok ? 1000 : 500)); });
          if (!q.ans[i].ok) g.tm.push(setTimeout(() => { rk.classList.add('boom'); rk.style.left = '50%'; rk.style.top = '86%'; }, 750));
        };
        g.say = q.say;
        if ((this._db.kid[kid] || {}).rdr && q.say) this._sayKid(q.say, kid);
      };
      g.on = (b) => { if (b.dataset.g === 'qa' && g.qa) g.qa(b); };
      next();
    }
    // 🦕 Dino-Ausgrabung: den Stein mit der richtigen Antwort freiklopfen – jeder Knochen kommt ans Skelett, nach 6 steht es
    _gm_dino(kid, area) {
      const g = this._gm, max = Math.max(8, this._gmQn(kid) + 3);
      g.qok = 0; g.qn = 0;
      const P = [ // Schwanz, Rücken, Rippen, Beine, Hals, Kopf
        '<path d="M14 78 Q40 70 70 66"/><path d="M22 76 l-2 -6 M34 73 l-1 -6 M46 70 l-1 -6 M58 68 l0 -6"/>',
        '<path d="M70 66 Q100 40 134 50"/>',
        '<path d="M88 54 q5 14 0 24 M98 48 q6 16 0 28 M108 46 q6 16 0 28 M118 47 q5 15 0 26"/>',
        '<path d="M86 66 L80 92 L90 100 M126 60 L132 90 L124 100"/>',
        '<path d="M134 50 Q150 36 156 24"/>',
        '<ellipse class="bf" cx="166" cy="20" rx="14" ry="9"/><path class="bf" d="M156 24 L178 26 L172 31 L158 29 Z"/><circle cx="170" cy="17" r="2.5" fill="#5c3d23"/>',
      ];
      const sk = (n) => `<svg class="gmsk" viewBox="0 0 200 108" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g class="gh">${P.map((x) => x.replace(/ class="bf"/g, '')).join('')}</g>${P.slice(0, n).map((x, i) => `<g class="bn" style="${i === n - 1 ? '' : 'animation:none'}">${x}</g>`).join('')}</svg>`;
      const next = () => {
        if (g.qok >= 6) { this._gmEnd(true, T('Das Dino-Skelett ist komplett! 🦕🎉')); return; }
        if (g.qn >= max) { this._gmEnd(true, T('{n} von 6 Knochen gefunden – fast geschafft! 🦴', { n: g.qok })); return; }
        const q = this._gmQShort(kid);
        area.innerHTML = `<div class="gmdn"><div class="gmq gmdnq">${q.task}${this._gmQSay(q)}</div>
          <div class="gmdns">${sk(g.qok)}<div class="gmsts">${q.ans.map((x, i) => `<button data-g="qa" data-i="${i}" class="gmstn" style="${x.st}">${x.h}</button>`).join('')}</div></div>
          <div class="gmctl"><div class="gmqs"><b class="gmqsc">${this._gmQStat()}</b><span>🦴 <b class="gmqst">${g.qok}</b>/6</span></div></div><div class="gmsol"></div></div>`;
        g.qa = (b) => {
          g.qa = null;
          const r = area.getBoundingClientRect(), br = b.getBoundingClientRect(), h = document.createElement('span');
          h.className = 'gmham'; h.textContent = '⛏️'; h.style.left = `${br.right - r.left - 26}px`; h.style.top = `${br.top - r.top - 30}px`; area.appendChild(h);
          this._gmQPick(b, q, area, (ok) => { this._gmScore(g.qok); g.tm.push(setTimeout(next, ok ? 900 : 500)); });
          if (q.ans[Number(b.dataset.i)].ok) g.tm.push(setTimeout(() => { const s = area.querySelector('.gmsk'); if (s) s.outerHTML = sk(g.qok); }, 350));
        };
        g.say = q.say;
        if ((this._db.kid[kid] || {}).rdr && q.say) this._sayKid(q.say, kid);
      };
      g.on = (b) => { if (b.dataset.g === 'qa' && g.qa) g.qa(b); };
      next();
    }
  }
  Object.getOwnPropertyNames(G.prototype).forEach((n) => { if (n !== 'constructor') C.prototype[n] = G.prototype[n]; });
}
