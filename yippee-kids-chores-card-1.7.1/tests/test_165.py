# 1.5.0 (GitHub #4–#8): Darstellung (compact/transparent/scale), Übersichtskarte pro Kind, Reihenfolge der Kinder, Minus-Stand mit Bilanz, Sterne per Automation/Skript
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1000}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-28T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:2,total:30});A._save('kid','B',{name:'Ben',emoji:'🐻',points:10,total:10});A._save('kid','C',{name:'Clara',emoji:'🐰',points:5,total:5});
      A._save('task','Z',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K','B','C'],sched:'week',days:[],created:'2026-10-01'});
      A._save('reward','R',{title:'Eis',emoji:'🍦',cost:20});})()"""); t(800)
    # ---- #6 Reihenfolge
    ok('default order alphabetical', [k['name'] for k in ev("A._kids()")]==['Ben','Clara','Mia'])
    ev("A._tab='kinder'; A._kadmOpen && 0; A._render()"); t(300)
    ok('move buttons present', ev("A.shadowRoot.querySelectorAll('[data-a=kord]').length")>=2, ev("A.shadowRoot.querySelectorAll('[data-a=kord]').length"))
    ev("A._click({target:Object.assign(document.createElement('button'),{dataset:{a:'kord',k:'K',d:'-1'}}), preventDefault(){}, stopPropagation(){}})") if False else None
    ev("(()=>{const b=document.createElement('button'); b.dataset.a='kord'; b.dataset.k='K'; b.dataset.d='-1'; A.shadowRoot.getElementById('app').appendChild(b); b.click();})()"); t(600)
    ok('mia moved up', [k['name'] for k in ev("A._kids()")]==['Ben','Mia','Clara'], [k['name'] for k in ev("A._kids()")])
    ev("(()=>{const b=document.createElement('button'); b.dataset.a='kord'; b.dataset.k='K'; b.dataset.d='-1'; A.shadowRoot.getElementById('app').appendChild(b); b.click();})()"); t(600)
    ok('mia first', [k['name'] for k in ev("A._kids()")]==['Mia','Ben','Clara'] and ev("A._db.kid.K.order")==1)
    t(1500)
    ok('order also in kids card', [x.strip() for x in ev("[...B.shadowRoot.querySelectorAll('.kn')].map(x=>x.textContent)")][0].find('Mia')>=0, ev("[...B.shadowRoot.querySelectorAll('.kn')].map(x=>x.textContent)"))
    # ---- #4 Darstellung
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',compact:true,transparent:true,scale:'90'})"); t(300)
    css=ev("B.shadowRoot.getElementById('look').textContent")
    ok('look css', 'transparent' in css and 'min-height:96px' in css and 'zoom:0.9' in css, css)
    ok('css variables exposed', '--yippee-bg' in ev("B.shadowRoot.querySelector('style').textContent"))
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids'})"); t(300)
    ok('look reset', ev("B.shadowRoot.getElementById('look').textContent")=='')
    # ---- #5 Übersicht
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia',summary:true})"); t(800)
    h=ev("B.shadowRoot.querySelector('#app').innerText")
    ok('summary card', ev("!!B.shadowRoot.querySelector('.ksum')") and 'Mia' in h and '2 Punkte' in h and '0/1' in h and 'Level' in h and not ev("!!B.shadowRoot.querySelector('.tile')"), h[:200])
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia',summary:true,show:['points']})"); t(500)
    h=ev("B.shadowRoot.querySelector('#app').innerText")
    ok('summary show filter', '2 Punkte' in h and 'Level' not in h and '0/1' not in h, h[:200])
    # Editor
    ev("""(()=>{const e=document.createElement('yippee-kids-chores-card-editor'); document.body.appendChild(e); e.hass=A._hass; e.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia',summary:true}); window.E=e;})()"""); t(500)
    ok('editor options', ev("!!E.shadowRoot.querySelector('[data-k=summary]:checked') && E.shadowRoot.querySelectorAll('[data-k=show]').length===5 && !!E.shadowRoot.querySelector('[data-k=compact]') && !!E.shadowRoot.querySelector('[data-k=scale]')"))
    ev("""(()=>{window.cfgOut=null; E.addEventListener('config-changed',x=>window.cfgOut=x.detail.config); const c=E.shadowRoot.querySelector('[data-k=show][data-v=level]'); c.checked=false; c.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"""); t(200)
    ok('editor show writes list', ev("window.cfgOut && window.cfgOut.show")==['points','today','goal','net'], ev("window.cfgOut"))
    # ---- #7 Minus-Stand
    ev("A._addPoints('K',-5,'Verpasst: 🪥 Zähne putzen')"); t(800)
    ok('clamped at 0 by default', ev("A._db.kid.K.points")==0)
    ev("A._setCfg({negOn:true}); A._addPoints('K',-3,'😠 Unartig')"); t(800)
    ok('negative balance allowed', ev("A._db.kid.K.points")==-3, ev("A._db.kid.K.points"))
    ok('day net', ev("A._dayNet(A._db.kid.K,'2026-10-28')")==-5, ev("A._dayNet(A._db.kid.K,'2026-10-28')"))
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'})"); t(600)
    h=ev("B.shadowRoot.querySelector('#app').innerText")
    ok('kid view shows balance', 'Bilanz heute: −5 ⭐' in h and '−3' in h.replace('-','−'), h[:300])
    ok('no negative bar widths', 'width:-' not in ev("B.shadowRoot.innerHTML"))
    m=ev("A._dailyMsgs(false)[0][1]")
    ok('daily summary balance', 'Bilanz heute: −5 ⭐' in m and 'Stand -3 ⭐' in m, m)
    w=ev("A._weeklyMsgs(false)[0][1]")
    ok('weekly balance', 'Bilanz: −' in w, w)
    ev("A._penaltyCheck()"); t(25000)
    s=(ev("window.sensors||{}") or {}).get('states/sensor.yippee_mia') or {}
    ok('sensor net attributes', s.get('state')=='-3' and s.get('attributes',{}).get('heute_netto')==-5 and 'woche_netto' in s.get('attributes',{}), s)
    ev("A._redeemReq && 0; A._request('R','K')"); t(300)
    ok('cannot redeem with negative balance', not ev("Object.values(A._db.req).some(q=>q.reward==='R')"))
    ev("A._setCfg({negOn:false})"); t(200)
    # ---- #8 Sterne per Automation
    ev("A._save('act','17616576001111',{a:'KP|pts|mia|4|Sprachassistent'})"); t(5000)
    ok('pts by name (case-insensitive)', ev("A._db.kid.K.points")==1 and ev("A._db.kid.K.ledger[0].r")=='🤖 Sprachassistent' and ev("A._cfg.btnLast.op")=='pts', [ev("A._db.kid.K.points"), ev("A._db.kid.K.ledger[0]")])
    ev("A._save('act','17616576011111',{a:'KP|pts|B|-2|'})"); t(5000)
    ok('pts by id, negative, default reason', ev("A._db.kid.B.points")==8 and ev("A._db.kid.B.ledger[0].r")=='🤖 Automation')
    ev("A._save('act','17616576021111',{a:'KP|pts|Unbekannt|3|x'})"); t(5000)
    ok('unknown kid ignored + logged', ev("A._cfg.btnLast.r")=='gone')
    sc=ev("A._ptsScript()")
    ok('script definition', 'kind' in sc['fields'] and 'sterne' in sc['fields'] and "KP|pts|" in sc['sequence'][0]['data']['description'] and sc['sequence'][0]['target']['entity_id']=='todo.kinderpunkte')
    ev("A._setCfg({setView:'all'}); A._tab='einst'; A._accOpen='sens'; A._render()"); t(400)
    ok('settings section with yaml', 'script.yippee_sterne' in ev("A.shadowRoot.innerHTML") and 'sterne | int(0)' in ev("A.shadowRoot.innerHTML"))
    ev("A._scriptOk=false; A._render()"); t(300)
    ev("A.shadowRoot.querySelector('[data-a=scriptnew]').click()"); t(800)
    sd=(ev("window.sensors||{}") or {}).get('config/script/config/yippee_sterne')
    ok('script created via API (admin)', ev("A._scriptOk")==True and sd and 'sterne' in sd['fields'], sd and list(sd))
    ok('no page errors', not errs, errs)
    b.close()
