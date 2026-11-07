from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:200])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-14T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(300)
    t=lambda ms=600: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._setCfg({approval:false,welcOn:true}); A._save('kid','J',{name:'Anna',emoji:'🦄',points:7,since:'2026-10-01',pres:{on:true,base:'out',rules:[{st:'in',every:1,start:'2026-10-14',fT:'18:30',toDay:5,tT:'12:00'}],hol:{},ex:[]}})"); t(1000)
    ev("A._save('task','T1',{title:'Duschen',emoji:'🚿',points:2,kids:['J'],sched:'week',days:[]})"); t(1000)
    h=lambda: (ev("B._render()"), t(200), ev("B.shadowRoot.innerHTML"))[2]
    x=h(); ok('12:00 only "Aufgaben ab"', 'Aufgaben ab 18:30' in x and 'Willkommen zurück' not in x)
    pg.clock.set_system_time(datetime.datetime.fromisoformat('2026-10-14T18:40:00')); t(500)
    x=h(); ok('18:40 welcome only', 'Willkommen zurück' in x and 'Aufgaben ab' not in x)
    ev("A._markDone('2026-10-14','T1','J')"); t(1500)
    x=h(); ok('after first task: gone', 'Willkommen zurück' not in x and 'Aufgaben ab' not in x)
    ev("A._setSt('2026-10-14','T1','J','')"); t(1500)
    pg.clock.set_system_time(datetime.datetime.fromisoformat('2026-10-14T19:31:00')); t(500)
    x=h(); ok('after 60 min: gone', 'Willkommen zurück' not in x and 'Aufgaben ab' not in x)
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
