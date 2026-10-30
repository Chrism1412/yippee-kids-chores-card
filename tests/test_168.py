# 1.6.0 (GitHub #12): Übersichtskarte antippen – tap_action / double_tap_action / hold_action, {kind} in der Seite, Details = Sensor des Kindes
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1000}, has_touch=True); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:12,total:30});A._save('kid','B',{name:'Ben Jürgen',emoji:'🐻',points:10,total:10});
      A._save('task','Z',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01'});})()"""); t(800)
    ev("window.acts=[]; B.addEventListener('hass-action', e=>window.acts.push(e.detail))")
    # ohne Aktionen: nichts antippbar, nichts wird ausgelöst
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',summary:true})"); t(600)
    ok('no actions: not clickable', ev("B.shadowRoot.querySelectorAll('.ksum.act').length")==0 and ev("B.shadowRoot.querySelectorAll('.ksum').length")==2)
    box=lambda i: ev(f"(()=>{{const r=B.shadowRoot.querySelectorAll('.ksum')[{i}].getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height/2]}})()")
    x,y=box(0); pg.mouse.click(x,y); t(400)
    ok('no actions: nothing fired', ev("window.acts.length")==0)
    # Antippen → Seite mit {kind}
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',summary:true,tap_action:{action:'navigate',navigation_path:'/dashboard-haus/{kind}'},double_tap_action:{action:'more-info'},hold_action:{action:'url',url_path:'https://example.org/{kind}'}})"); t(600)
    ok('actions: clickable with pointer', ev("B.shadowRoot.querySelectorAll('.ksum.act').length")==2 and ev("getComputedStyle(B.shadowRoot.querySelector('.ksum.act')).cursor")=='pointer')
    names=ev("[...B.shadowRoot.querySelectorAll('.ksum .kn')].map(x=>x.textContent)")
    iBen=names.index('Ben Jürgen'); iMia=names.index('Mia')
    x,y=box(iBen); pg.mouse.click(x,y); t(400)
    a=ev("window.acts")
    ok('tap fires once after double-tap window', len(a)==1 and a[0]['action']=='tap', a)
    ok('tap: {kind} replaced (slug)', a and a[0]['config']['tap_action']['navigation_path']=='/dashboard-haus/ben_juergen', a)
    ok('entity = sensor of tapped kid', a and a[0]['config']['entity']=='sensor.yippee_ben_juergen', a)
    ev("window.acts=[]"); x,y=box(iMia); pg.mouse.click(x,y); t(80); pg.mouse.click(x,y); t(400)
    a=ev("window.acts")
    ok('double tap', len(a)==1 and a[0]['action']=='double_tap' and a[0]['config']['entity']=='sensor.yippee_mia', a)
    ev("window.acts=[]"); x,y=box(iMia); pg.mouse.move(x,y); pg.mouse.down(); t(700); pg.mouse.up(); t(400)
    a=ev("window.acts")
    ok('hold (no extra tap)', len(a)==1 and a[0]['action']=='hold' and a[0]['config']['hold_action']['url_path']=='https://example.org/mia', a)
    # Wischen/Scrollen löst nichts aus
    ev("window.acts=[]"); x,y=box(iMia); pg.mouse.move(x,y); pg.mouse.down(); pg.mouse.move(x,y+60,steps=5); pg.mouse.up(); t(800)
    ok('swipe is no tap', ev("window.acts.length")==0, ev("window.acts"))
    # nur tap: sofort, ohne Wartezeit
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia',summary:true,tap_action:{action:'navigate',navigation_path:'/kinder/mia'}})"); t(600)
    ev("window.acts=[]"); x,y=box(0); pg.mouse.click(x,y); t(10)
    a=ev("window.acts")
    ok('single kid: tap immediately', len(a)==1 and a[0]['config']['tap_action']['navigation_path']=='/kinder/mia', a)
    # Tastatur
    ev("window.acts=[]; B.shadowRoot.querySelector('.ksum.act').focus()"); pg.keyboard.press('Enter'); t(50)
    ok('keyboard Enter = tap', ev("window.acts.length")==1)
    # Touch
    ev("window.acts=[]"); x,y=box(0); pg.touchscreen.tap(x,y); t(50)
    ok('touch tap', ev("window.acts.length")==1, ev("window.acts"))
    # action none / ohne summary: keine Aktion
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia',tap_action:{action:'navigate',navigation_path:'/x'}})"); t(600)
    ok('full kid card ignores actions', ev("B.shadowRoot.querySelectorAll('.ksum').length")==0 and ev("B.shadowRoot.querySelectorAll('.act[data-kid]').length")==0)
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia',summary:true,tap_action:{action:'none'}})"); t(600)
    ok('action none = not clickable', ev("B.shadowRoot.querySelectorAll('.ksum.act').length")==0)
    # ---- Karten-Editor
    ev("""(()=>{const e=document.createElement('yippee-kids-chores-card-editor'); document.body.appendChild(e); e.hass=A._hass; e.setConfig({storage:'todo.kinderpunkte',mode:'kids',summary:true}); window.E=e; window.cfgOut=null; e.addEventListener('config-changed',x=>{window.cfgOut=x.detail.config; e.setConfig(x.detail.config);});})()"""); t(600)
    ok('editor: 3 action selects', ev("E.shadowRoot.querySelectorAll('select[data-k=act]').length")==3)
    sel=lambda x,v: ev(f"(()=>{{const s=E.shadowRoot.querySelector('select[data-k=act][data-x={x}]'); s.value='{v}'; s.dispatchEvent(new Event('change',{{bubbles:true,composed:true}}));}})()")
    sel('tap_action','navigate'); t(200)
    ok('editor: navigate -> path field', ev("window.cfgOut.tap_action")=={'action':'navigate'} and ev("!!E.shadowRoot.querySelector('input[data-k=actp][data-x=tap_action]')"))
    ev("(()=>{const i=E.shadowRoot.querySelector('input[data-k=actp][data-x=tap_action]'); i.value='/dashboard-haus/{kind}'; i.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(200)
    ok('editor: path saved', ev("window.cfgOut.tap_action")=={'action':'navigate','navigation_path':'/dashboard-haus/{kind}'}, ev("window.cfgOut"))
    sel('double_tap_action','more-info'); t(200)
    ok('editor: more-info', ev("window.cfgOut.double_tap_action")=={'action':'more-info'})
    sel('hold_action','url'); t(200)
    ev("(()=>{const i=E.shadowRoot.querySelector('input[data-k=actp][data-x=hold_action]'); i.value='https://example.org'; i.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(200)
    ok('editor: url saved', ev("window.cfgOut.hold_action")=={'action':'url','url_path':'https://example.org'})
    sel('double_tap_action',''); t(200)
    ok('editor: nothing removes key', 'double_tap_action' not in ev("window.cfgOut"))
    # eigene YAML-Aktion bleibt erhalten und wird angezeigt
    ev("E.setConfig({storage:'todo.kinderpunkte',mode:'kids',summary:true,tap_action:{action:'perform-action',perform_action:'script.licht'}})"); t(300)
    ok('editor: own YAML action shown', 'perform-action' in ev("E.shadowRoot.querySelector('select[data-k=act][data-x=tap_action]').selectedOptions[0].textContent"))
    # Übersicht aus → Aktionen weg
    ev("(()=>{const c=E.shadowRoot.querySelector('[data-k=summary]'); c.checked=false; c.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(200)
    ok('editor: summary off removes actions', not any(k in ev("window.cfgOut") for k in ['tap_action','double_tap_action','hold_action']) and not ev("E.shadowRoot.querySelector('select[data-k=act]')"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
