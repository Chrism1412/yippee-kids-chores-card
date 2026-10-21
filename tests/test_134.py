from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':700}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-08T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    t=lambda ms=400: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._save('kid','K',{name:'Kai',emoji:'🐻'})"); t(400)
    ev("A._save('task','M',{title:'Bett machen',emoji:'🛏️',points:1,kids:['K'],sched:'week',days:[],from:'06:45',to:'10:00'})")
    ev("A._save('task','E',{title:'Zähne putzen abends',emoji:'🪥',points:1,kids:['K'],sched:'week',days:[],from:'19:00',to:'21:00'})")
    ev("A._save('task','N',{title:'Zimmer aufräumen',emoji:'🧸',points:3,kids:['K'],sched:'week',days:[]})"); t(600)
    ev("A._setCfg({dayBlocks:true})"); t(500)
    bt=lambda: ev("B.shadowRoot.querySelector('#app').innerText")
    ok('morning auto-folded at 15:00', 'Bett machen' not in bt() and '🌅 Morgens' in bt(), bt()[:200])
    ok('evening open', 'Zähne putzen abends' in bt())
    ev("B.shadowRoot.querySelector('[data-a=blkfold][data-id=\"K:m\"]').click()"); t()
    ok('unfold by hand', 'Bett machen' in bt())
    ev("B.shadowRoot.querySelector('[data-a=blkfold][data-id=\"K:a\"]').click()"); t()
    ok('fold by hand', 'Zähne putzen abends' not in bt())
    ev("A._setCfg({autoFold:false})"); ev("B._blkO=null; B._render()"); t()
    ok('autoFold off', 'Bett machen' in bt())
    ok('admin blocks', '🌙 Abends' in ev("A.shadowRoot.querySelector('#app').innerText"))
    ok('setting shown', (ev("A.shadowRoot.querySelector('[data-a=\"tab\"][data-id=\"einst\"]').click()") or True) and 'autoFold' in ev("A.shadowRoot.innerHTML"))
    # Scroll bleibt
    ev("document.body.style.height='4000px'; window.scrollTo(0,600)"); ev("A._render()"); t(100)
    ok('scroll kept', ev("window.scrollY")==600, ev("window.scrollY"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
