from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:200])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-14T17:59:00'))  # Mittwoch
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(300)
    t=lambda ms=600: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._setCfg({targets:['mobile_app_phone_a'],wDay:'3',wTime:'18:00'}); A._save('kid','J',{name:'Anna',emoji:'🦄',points:7,since:'2026-10-01'})"); t(1000)
    ev("A._weeklyCheck()"); t(800)
    ok('before time: not sent', not ev("A._cfg.lastWeekly"), ev("A._cfg.lastWeekly"))
    pg.clock.set_system_time(datetime.datetime.fromisoformat('2026-10-14T18:01:00')); t(300)
    ev("A._weeklyCheck()"); t(800)
    ok('chosen day+time: sent', ev("A._cfg.lastWeekly")=='2026-10-14', ev("A._cfg.lastWeekly"))
    ev("A._setCfg({wDay:undefined,wTime:undefined,lastWeekly:''})"); t(800)
    pg.clock.set_system_time(datetime.datetime.fromisoformat('2026-10-18T19:05:00')); t(300)  # Sonntag
    ev("A._weeklyCheck()"); t(800)
    ok('default sunday 19:00', ev("A._cfg.lastWeekly")=='2026-10-18', ev("A._cfg.lastWeekly"))
    ev("A._tab='einst'; A._open=Object.assign(A._open||{}, {when:true}); A._render()"); t(300)
    h=ev("A.shadowRoot.innerHTML")
    ok('settings show day + time', 'data-cfgs="wDay"' in h and 'data-cfgs="wTime"' in h)
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
