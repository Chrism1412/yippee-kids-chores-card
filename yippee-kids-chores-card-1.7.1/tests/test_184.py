# 1.7.1: 🛒 Marketplace (früher HACS) – Ressource unter /local/community/ wird wie der HACS-Pfad behandelt und bei doppelten Einträgen bevorzugt behalten
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1200,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    body="const VERSION = '1.7.1';"
    for pat in ('**/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js*','**/local/community/yippee-kids-chores-card/yippee-kids-chores-card.js*','**/local/yippee-kids-chores-card.js*'):
        pg.route(pat, lambda r: r.fulfill(status=200, body=body, content_type='application/javascript'))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-07T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    t=lambda ms=400: pg.clock.run_for(ms); ev=pg.evaluate; html=lambda: ev("A.shadowRoot.innerHTML")
    ev("A._save('kid','K',{name:'Mia',emoji:'🦊'})"); t(1000)
    def run(res):
        ev("""(()=>{window.res=%s; window.dels=[]; const o=window.__cw||(window.__cw=A._hass.callWS); A._hass.callWS=async(m)=>{ if(m.type==='lovelace/resources') return JSON.parse(JSON.stringify(window.res)); if(m.type==='lovelace/resources/delete'){ window.dels.push(m.resource_id); return {}; } if(m.type==='lovelace/resources/update') return {}; return o(m); };})()""" % res)
        ev("A._updCheck(true)"); pg.wait_for_timeout(600); t()
    run("[{id:'h',type:'module',url:'/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?hacstag=1'},{id:'m',type:'module',url:'/local/community/yippee-kids-chores-card/yippee-kids-chores-card.js?hacstag=2'}]")
    ok('marketplace entry kept', ev("A._upd.res.id")=='m' and [r['id'] for r in ev("A._upd.dups")]==['h'], [ev("A._upd.res.id"), ev("A._upd.dups")])
    run("[{id:'l',type:'module',url:'/local/yippee-kids-chores-card.js?v=1.7.1'},{id:'m',type:'module',url:'/local/community/yippee-kids-chores-card/yippee-kids-chores-card.js?v=1.7.1'}]")
    ok('marketplace beats manual copy', ev("A._upd.res.id")=='m', ev("A._upd.res.id"))
    run("[{id:'m',type:'module',url:'/local/community/yippee-kids-chores-card/yippee-kids-chores-card.js?v=1.7.1'}]")
    ok('single marketplace entry: no duplicate warning', not ev("(A._upd.dups||[]).length") and 'mehrfach als Ressource' not in html())
    ok('no errors', not errs, errs)
    b.close()
