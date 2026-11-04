# 1.7.0: 📋 Eltern-Heute – Kinder und Tagesblöcke (Morgens/Mittags/Nachmittags/Abends/Ohne Zeit) einklappbar, gemerkt auf dem Gerät; Zusatzaufgaben nach Ablauf ohne rotes ✕
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{try{localStorage.removeItem('kpAdmFold')}catch(e){}
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5});A._save('kid','B',{name:'Ben',emoji:'🐻',points:5,total:5});
      A._save('task','M',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01',from:'07:00',to:'08:00'});
      A._save('task','E',{title:'Bettfertig',emoji:'😴',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01',from:'18:00',to:'20:00'});
      A._save('task','O',{title:'Zimmer aufräumen',emoji:'🧹',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','X',{title:'Auto waschen',emoji:'🚗',points:2,kids:['K'],sched:'week',days:[],created:'2026-10-01',from:'07:00',to:'09:00',extra:true});
      A._save('reward','r1',{title:'Eis',emoji:'🍦',cost:3}); A._setCfg({dayBlocks:true,extraOn:true,autoFold:false}); A._tab='heute'; A._render();})()"""); t(800)
    box=lambda k: f"[...A.shadowRoot.querySelectorAll('.box')].find(b=>b.querySelector('[data-a=admfold][data-id=\"kid:{k}\"]'))"
    txt=lambda k: ev(f"({box(k)}).innerText")
    ok('kid header toggles', ev("A.shadowRoot.querySelectorAll('[data-a=admfold][data-id^=\"kid:\"]').length")==2)
    blk=ev(f"[...({box('K')}).querySelectorAll('.admb')].map(b=>b.dataset.id)")
    ok('block headers per kid', len(blk)>=3 and all(x.startswith('K:') for x in blk), blk)
    ok('all open by default', 'Zähne putzen' in txt('K') and 'Bettfertig' in txt('K') and 'Zimmer aufräumen' in txt('K'))
    # Block einklappen
    first=blk[0]
    ev(f"A.shadowRoot.querySelector('[data-a=admfold][data-id=\"{first}\"]').click()"); t(400)
    ok('block collapsed: rows hidden', 'Zähne putzen' not in txt('K') and 'Bettfertig' in txt('K'), txt('K')[:300])
    ok('chevron + aria', ev(f"A.shadowRoot.querySelector('[data-a=admfold][data-id=\"{first}\"]').getAttribute('aria-expanded')")=='false' and '▸' in ev(f"A.shadowRoot.querySelector('[data-a=admfold][data-id=\"{first}\"]').textContent"))
    ok('other kid unaffected', 'Zähne putzen' in txt('B'))
    ok('count still shown when collapsed', '0/' in ev(f"A.shadowRoot.querySelector('[data-a=admfold][data-id=\"{first}\"]').textContent"))
    # Kind einklappen
    ev("A.shadowRoot.querySelector('[data-a=admfold][data-id=\"kid:B\"]').click()"); t(400)
    tb=txt('B')
    ok('kid collapsed: only header + progress', 'Zähne putzen' not in tb and 'Bettfertig' not in tb and '0/3' in tb, tb)
    ok('collapsed kid still has gift + points', ev(f"!!({box('B')}).querySelector('[data-a=ardm]')"))
    # gemerkt
    ok('stored on device', ev("JSON.parse(localStorage.getItem('kpAdmFold'))")=={first:1,'kid:B':1}, ev("localStorage.getItem('kpAdmFold')"))
    ev("A._admF=null; A._render()"); t(400)
    ok('survives reload', 'Zähne putzen' not in txt('K') and 'Bettfertig' not in txt('B'))
    # Abhaken im offenen Block geht weiter
    ev(f"({box('K')}).querySelector('[data-a=atap][data-t=O]').click()"); t(1500)
    ok('tick still works', ev("A._status(A._db.task.O,'K').s")=='d', ev("A._status(A._db.task.O,'K')"))
    # wieder aufklappen
    ev("A.shadowRoot.querySelector('[data-a=admfold][data-id=\"kid:B\"]').click()"); t(300)
    ev(f"A.shadowRoot.querySelector('[data-a=admfold][data-id=\"{first}\"]').click()"); t(300)
    ok('reopened', 'Zähne putzen' in txt('K') and 'Zähne putzen' in txt('B') and ev("localStorage.getItem('kpAdmFold')")=='{}')
    # Zusatzaufgabe nach Ablauf: kein rotes ✕, Pflichtaufgabe schon
    row=lambda id: ev(f"(()=>{{const r=({box('K')}).querySelector('[data-a=atap][data-t={id}]'); return [r.querySelector('.st').className, r.innerText]}})()")
    rx, rm = row('X'), row('M')
    ok('extra after window: no ✕', '✕' not in rx[1] and 'm' not in rx[0].split(), rx)
    ok('required after window: ✕', '✕' in rm[1], rm)
    ev("A._setCfg({dayBlocks:false}); A._render()"); t(500)
    ok('without day blocks: no block headers, kid still foldable', not ev("A.shadowRoot.querySelector('.admb')") and ev("A.shadowRoot.querySelectorAll('[data-a=admfold]').length")==2)
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
