from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':412,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js*', lambda r: r.fulfill(status=200, body="const VERSION = '9.9.9';", content_type='application/javascript'))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-05T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    t=lambda ms=400: pg.clock.run_for(ms); ev=lambda x: pg.evaluate(x); html=lambda: ev("A.shadowRoot.innerHTML")
    ev("localStorage.clear()")
    # 1) manuelle Installation: automatisch erhöhen
    ev("""(()=>{window.res=[{id:'r1',type:'module',url:'/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?v=1.0.0'}]; window.upds=[]; const o=A._hass.callWS; A._hass.callWS=async(m)=>{ if(m.type==='lovelace/resources') return JSON.parse(JSON.stringify(window.res)); if(m.type==='lovelace/resources/update'){ window.upds.push(m.url); window.res[0].url=m.url; return {}; } return o(m); };})()""")
    pg.evaluate("A._updCheck(true)"); pg.wait_for_timeout(600); t()
    ok('auto bumped', ev("window.upds")==['/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?v=9.9.9'], ev("window.upds"))
    ok('ready banner', 'ist bereit' in html() and 'updreload' in html())
    pg.evaluate("A._updCheck(true)"); pg.wait_for_timeout(600); t()
    ok('no second bump', len(ev("window.upds"))==1)
    # 2) HACS-Ressource mit hacstag: nicht anfassen
    ev("localStorage.clear(); window.upds=[]; window.res[0].url='/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?hacstag=123456'")
    pg.evaluate("A._updCheck(true)"); pg.wait_for_timeout(600); t()
    ok('hacs untouched', ev("window.upds")==[] and 'ist bereit' in html())
    # 3) Automatik aus -> alter Hinweis mit Knopf
    ev("localStorage.clear(); window.res[0].url='/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?v=1.0.0'; A._setCfg({updAuto:false})"); t(1000)
    pg.evaluate("A._updCheck(true)"); pg.wait_for_timeout(600); t()
    ok('manual mode', ev("window.upds")==[] and 'noch nicht aktiv' in html() and 'updres' in html())
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
