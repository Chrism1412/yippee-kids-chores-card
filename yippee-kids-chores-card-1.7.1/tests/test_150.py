from playwright.sync_api import sync_playwright
import sys
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:200])
SHOT=len(sys.argv)>1 and sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':400,'height':860}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/kp_test.html'); pg.wait_for_timeout(800); ev=pg.evaluate
    ev("A._tab='heute'; A._render()"); pg.wait_for_timeout(200)
    ok('header button', ev("!!A.shadowRoot.querySelector('.hd [data-a=hb]')"))
    ev("A.shadowRoot.querySelector('.hd [data-a=hb]').click()"); pg.wait_for_timeout(1500)
    n=ev("A.shadowRoot.querySelectorAll('#modal .hbi').length")
    ok('all topics listed', n>=40, n)
    if SHOT: pg.screenshot(path=SHOT+'_a.png')
    def search(q):
        ev(f"(()=>{{const i=A.shadowRoot.querySelector('#modal .hbq'); i.value={q!r}; i.dispatchEvent(new Event('input'));}})()"); pg.wait_for_timeout(100)
        return ev("[...A.shadowRoot.querySelectorAll('#modal .hbi')].filter(x=>!x.hidden).map(x=>[x.querySelector('summary').textContent,x.open])")
    r=search('nfc'); ok('NFC first + open', r and 'NFC' in r[0][0] and r[0][1], r[:3])
    if SHOT: pg.screenshot(path=SHOT+'_b.png', full_page=True)
    r=search('Anwesenheit'); ok('Anwesenheit found', r and 'Anwesenheit' in r[0][0], r[:3])
    r=search('wechselmodell'); ok('keyword search', r and 'Anwesenheit' in r[0][0], r[:3])
    r=search('ÄNDERUNGSPROTOKOLL'); ok('case/umlaut', any('Änderungsprotokoll' in x[0] for x in r), r[:3])
    r=search('telegram befehle'); ok('multi-word', r and 'Telegram' in r[0][0], r[:3])
    r=search('xyzquatsch'); ok('no hit message', r==[] and not ev("A.shadowRoot.querySelector('#modal .hbnone').hidden"))
    r=search(''); ok('reset shows all, closed', len(r)==n and not any(x[1] for x in r))
    ev("A.shadowRoot.querySelectorAll('#modal .hbchip')[0].click()"); pg.wait_for_timeout(100)
    ok('chip fills search', ev("A.shadowRoot.querySelector('#modal .hbq').value")=='NFC')
    ev("A.shadowRoot.querySelectorAll('#modal .hbchip')[0].click()"); pg.wait_for_timeout(100)
    ok('chip toggles off', ev("A.shadowRoot.querySelector('#modal .hbq').value")=='')
    ok('no html injection', ev("A.shadowRoot.querySelectorAll('#modal .hbx script').length")==0)
    ev("A._closeModal(); A._tab='einst'; A._render()"); pg.wait_for_timeout(200)
    ok('settings button', ev("!!A.shadowRoot.querySelector('.hbopen')"))
    ev("A.shadowRoot.querySelector('.hbopen').click()"); pg.wait_for_timeout(800)
    ok('settings opens manual', ev("A.shadowRoot.querySelectorAll('#modal .hbi').length")==n)
    ev("A._closeModal()")
    # Kinder-Ansicht: kein Handbuch-Knopf
    ok('kid view has no manual', ev("!B.shadowRoot.querySelector('[data-a=hb]')"))
    # Sprache: Englisch fällt sauber zurück
    ev("A._setCfg({lang:'en'})"); pg.wait_for_timeout(1500)
    ev("A._hbOpen('')"); pg.wait_for_timeout(200)
    ok('english opens', ev("A.shadowRoot.querySelectorAll('#modal .hbi').length")==n)
    r=search('presence'); ok('english search presence', r and len(r)>0, r[:2])
    r=search('Anwesenheit'); ok('german keyword in english', r and len(r)>0, r[:2])
    for L,word in [('fr','présence'),('pl','obecność'),('el','παρουσία'),('bg','присъствие')]:
        ev(f"A._closeModal(); A._setCfg({{lang:'{L}'}})"); pg.wait_for_timeout(1500); ev("A._hbOpen('')"); pg.wait_for_timeout(300)
        r=search(word); ok(f'{L} search', r and len(r)>0 and 'Anwesenheit' not in r[0][0], r[:1])
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
