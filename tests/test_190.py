# 1.9.0: ⚡ Eltern-Bereich als eigene Datei (yippee-kids-chores-admin.js) – wird erst beim Öffnen der Eltern-Ansicht geladen.
#        Kinder-Ansicht läuft ohne die Datei; Aktionen vor dem Laden (z. B. Aufgabe bearbeiten) laufen danach von selbst weiter.
from playwright.sync_api import sync_playwright
import atexit, os, time
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
HERE=os.path.dirname(os.path.abspath(__file__))
ADM=open(os.path.join(HERE,'yippee-kids-chores-admin.js'),encoding='utf-8').read()
SEED="""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5});
  A._save('task','T1',{title:'Bett machen',emoji:'🛏️',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});})()"""
def wait(pg, js, s=6):
    end=time.time()+s
    while time.time()<end:
        if pg.evaluate(js): return True
        pg.wait_for_timeout(100)
    return False
with sync_playwright() as p:
    b=p.chromium.launch()
    # 1) Datei fehlt: Kinder-Ansicht läuft trotzdem, Eltern-Ansicht zeigt einen klaren Hinweis
    pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]; reqs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/yippee-kids-chores-admin.js*', lambda r: (reqs.append(r.request.url), r.fulfill(status=404, body='nope')))
    pg.goto('http://localhost:8765/kp_lazy.html'); pg.wait_for_timeout(800)
    pg.evaluate(SEED); pg.wait_for_timeout(1500)
    ok('admin file requested', len(reqs)>=1, reqs[:2])
    ok('kids view works without admin file', 'Bett machen' in pg.evaluate("B.shadowRoot.innerHTML"))
    pg.evaluate("B.shadowRoot.querySelector('[data-a=ktap]').click()"); pg.wait_for_timeout(800)
    ok('kid can tick task without admin file', pg.evaluate("A._db.log[Object.keys(A._db.log).sort().pop()]?.s?.['T1:K']") in ('d','p'), pg.evaluate("JSON.stringify(A._db.log)")[:200])
    ok('parent view shows load hint', wait(pg, "A.shadowRoot.innerHTML.includes('yippee-kids-chores-admin.js')"), pg.evaluate("A.shadowRoot.getElementById('app').textContent")[:200])
    ok('no page errors (missing file)', not errs, errs)
    pg.close()
    # 2) Datei kommt verzögert: Aktion vor dem Laden läuft danach weiter, nur ein Abruf
    pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]; reqs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    held=[]
    pg.route('**/yippee-kids-chores-admin.js*', lambda r: (reqs.append(r.request.url), held.append(r)))
    pg.goto('http://localhost:8765/kp_lazy.html'); pg.wait_for_timeout(200)
    pg.evaluate(SEED)
    pg.evaluate("A._editTask('T1')")
    pg.wait_for_timeout(300); txt=pg.evaluate("A.shadowRoot.getElementById('app').textContent")
    ok('loading shown first', 'Lade' in txt, txt[:200])
    wait(pg, "false", 0.5)
    for r in held: r.fulfill(status=200, body=ADM, headers={'content-type':'text/javascript'})
    ok('edit dialog opens after load', wait(pg, "!!A.shadowRoot.querySelector('#modal .mbox')"), '')
    ok('parent tabs rendered after load', wait(pg, "!!A.shadowRoot.querySelector('.tab[data-id=einst]')"))
    ok('admin file fetched once', len(reqs)==1, reqs)
    pg.evaluate("A._closeModal && A._closeModal()"); pg.wait_for_timeout(200)
    pg.evaluate("A.shadowRoot.querySelector('.tab[data-id=einst]').click()"); pg.wait_for_timeout(500)
    ok('settings render from module', 'Sprache' in pg.evaluate("A.shadowRoot.getElementById('app').textContent"))
    ok('no page errors (lazy)', not errs, errs)
    # 2.0.0: Zusatzfunktionen (yippee-kids-chores-extras.js) kommen im Hintergrund nach, Eltern-Aussehen mit der Eltern-Datei
    ok('extras loaded in background', wait(pg, "typeof A._tmrDraw === 'function'", 8))
    ok('admin css arrived', len(pg.evaluate("A.shadowRoot.getElementById('acss').textContent"))>5000)
    pg.close()
    # 3) Zusatz-Datei fehlt: Karte läuft, Timer-Knopf meldet einen klaren Hinweis
    pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/yippee-kids-chores-extras.js*', lambda r: r.fulfill(status=404, body='nope'))
    pg.goto('http://localhost:8765/kp_lazy.html'); pg.wait_for_timeout(800)
    pg.evaluate(SEED); pg.wait_for_timeout(1500)
    ok('kids view works without extras', 'Bett machen' in pg.evaluate("B.shadowRoot.innerHTML"))
    pg.evaluate("B._exErr=false; B._tmrStart('T1','K')"); pg.wait_for_timeout(800)
    ok('extras hint shown', 'extras.js' in pg.evaluate("B.shadowRoot.getElementById('fx').textContent"))
    ok('no page errors (missing extras)', not errs, errs)
    # Größe: Karte deutlich kleiner als vorher
    sz=os.path.getsize(os.path.join(os.path.dirname(HERE),'dist','yippee-kids-chores-card.js'))
    ok('card file smaller than 400 KB', sz<400000, sz)
    b.close()
