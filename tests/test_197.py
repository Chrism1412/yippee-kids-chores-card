# 2.0.0: 🎮 Mini-Spiele – Spiel als Aufgabe (Rechnen, Bewegung) hakt ab, Spielauswahl, alle Spiele laufen, Tageslimit
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':392,'height':760},device_scale_factor=2); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:46,total:330,bd:1,bm:1,by:2018});
      A._save('task','T1',{title:'Rechnen üben',emoji:'🧮',points:2,kids:['K'],sched:'week',days:[],created:'2026-10-01',game:{g:'math',n:3}});
      A._save('task','T2',{title:'Bewegungspause',emoji:'🏃',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01',game:{g:'move',n:2}});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',peOn:true,pePlay:'always'}); A._save('pk','K',{on:true,kind:'dino',name:'Rexi',t0:0,s:3,h:true});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    ev("document.getElementById('a').style.display='none'")
    ok('game tile button', ev("B.shadowRoot.querySelectorAll('[data-a=pegmgo]').length")==2)
    ok('task clean keeps game', ev("A._db.task.T1.game")=={'g':'math','n':3})
    # task game math
    ev("B.shadowRoot.querySelector('.tile[data-t=T1]').click()"); t(800)
    ok('overlay open', ev("!!B.shadowRoot.querySelector('.gmov')"))
    0
    for i in range(3):
        ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(800)
    t(800)
    ok('math task ticked', ev("A._st(new Date(Date.now()).toISOString().slice(0,10),'T1','K')")=='d' or ev("B._status(A._db.task.T1,'K').s")=='d', ev("B._status(A._db.task.T1,'K')"))
    ev("B.shadowRoot.querySelector('.gmov [data-g=x]').click()"); t(500)
    # move task
    ev("B.shadowRoot.querySelector('.tile[data-t=T2]').click()"); t(800)
    0
    for i in range(2):
        t(3200); ev("B.shadowRoot.querySelector('.gmov [data-g=mvok]').click()"); t(500)
    ok('move task ticked', ev("B._status(A._db.task.T2,'K').s")=='d')
    ev("B.shadowRoot.querySelector('.gmov [data-g=x]').click()"); t(500)
    # leisure menu
    ev("B._peKid='K'; B._render()"); t(600)
    ev("B.shadowRoot.querySelector('[data-a=pegames]').click()"); t(800)
    ok('menu', ev("B.shadowRoot.querySelectorAll('.gmov .gmmenu [data-g=play]').length")==18)
    0
    for g in ['run','memory','count','catch','whack','fly','song','fire']:
        ev(f"B._gmStart('K','{g}')"); t(2500)
        if g in ('run','fly','catch'): 0
        if g=='memory': 0
        ok(f'{g} runs', not errs, errs[-1:] if errs else '')
    ok('limit counted', ev("A._db.pk.K.d.g")>=3, ev("A._db.pk.K.d"))
    ev("B._gmClose()"); t(300)
    ok('no errors', not errs, errs)
    b.close()
