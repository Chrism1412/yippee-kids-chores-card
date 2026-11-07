from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':1000}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-05T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    A=pg.locator('#a kinderpunkte-card'); t=lambda ms=400: pg.clock.run_for(ms); ev=lambda x: pg.evaluate(x)
    html=lambda: ev("A.shadowRoot.innerHTML")
    ev("""(()=>{const h=A._hass; h.user={id:'uCarl',name:'Carl',is_admin:true};
      h.states['person.carl']={state:'home',attributes:{friendly_name:'Carl',user_id:'uCarl'}};
      h.states['person.ben']={state:'home',attributes:{friendly_name:'Ben',user_id:'uBen'}};
      h.states['person.mama']={state:'home',attributes:{friendly_name:'Mama',user_id:'uMama'}};
      h.states['todo.kp_sicherung']={state:'0',attributes:{friendly_name:'Kinderpunkte Sicherung'}}; window.items['todo.kp_sicherung']=[];})()""")
    ok('mock items', ev("!!window.items"))
    ev("A._save('kid','L',{name:'Ben',emoji:'🐧',points:10}); A._save('task','Z',{title:'Zähne',points:1,kids:['L'],sched:'week',days:[]}); A._save('reward','R',{title:'Eis',cost:5})"); t(1000)
    A.locator('[data-a="tab"][data-id="einst"]').click(); t()
    # Eltern-Liste: Mama anhaken -> Carl automatisch dazu
    A.locator('[data-a="cfg"][data-k="parent"][data-v="uMama"]').check(); t(2500)
    ok('parents incl self', sorted(ev("A._cfg.parents"))==['uCarl','uMama'], ev("A._cfg.parents"))
    # als Ben angemeldet -> gesperrt
    ev("A._hass.user={id:'uBen',name:'Ben',is_admin:false}; A._render()"); t()
    ok('ben blocked', 'Nur für' in html() and 'data-a="tab"' not in html())
    ev("A._click({target:{closest:()=>({dataset:{a:'pts',k:'L',n:'5'}})}})"); t()
    ok('guard pts', ev("A._db.kid.L.points")==10)
    # Knopf von Ben (Handy-App) ignoriert
    ev("A._save('task','Z',{...A._db.task.Z}); A._setSt('2026-10-05','Z','L','p')"); t(500)
    ev("A._save('act','a1',{a:'KP|ok|2026-10-05|Z|L',u:'uBen'})"); t(4000)
    ok('ben button ignored', ev("A._st('2026-10-05','Z','L')")=='p')
    ev("A._save('act','a2',{a:'KP|ok|2026-10-05|Z|L',u:'uMama'})"); t(4000)
    ok('mama button works', ev("A._st('2026-10-05','Z','L')")=='d')
    ev("A._hass.user={id:'uCarl',name:'Carl',is_admin:true}; A._render()"); t(2000)
    # PIN setzen
    A.locator('[data-a="tab"][data-id="einst"]').click(); t()
    A.locator('[name=pin1]').fill('4711'); A.locator('[name=pin2]').fill('4711'); A.locator('[data-a="pinset"]').click(); t(1000)
    c=ev("A._cfg")
    ok('pin hashed', c.get('pinH') and len(c['pinH'])==64 and '4711' not in str(c), c.get('pinL'))
    ev("A._until=0; A._render()"); t()
    ok('locked', 'Bitte PIN eingeben' in html())
    for i in range(4):
        for k in '1111': ev(f"A._pinKey('{k}')")
    ok('3 left msg', 'noch 1 Versuche' in html(), '')
    for k in '1111': ev(f"A._pinKey('{k}')")
    ok('lockout', 'Zu viele' in html())
    for k in '4711': ev(f"A._pinKey('{k}')")
    ok('still locked with right pin', 'Zu viele' in html())
    pg.clock.run_for(5*60000+1000)
    for k in '4711': ev(f"A._pinKey('{k}')")
    ok('unlocked after wait', 'data-a="tab"' in html())
    # Papierkorb
    ev("A._del('reward','R')"); t(2500)
    ok('in trash', 'reward-R' in ev("Object.keys(A._db.trash)"))
    A.locator('[data-a="tab"][data-id="einst"]').click(); t()
    A.locator('[data-a="trres"]').first.click(); t(2500)
    ok('trash restore', ev("!!A._db.reward.R") and not ev("Object.keys(A._db.trash).length") and not ev("A._cfg.tomb && A._cfg.tomb['reward|R']"))
    # Protokoll
    t(3000)
    au=ev("(A._db.audit.main||{}).e||[]")
    txt=' | '.join(f"{x[1]}: {x[2]}" for x in au)
    ok('audit', 'Eltern-Liste' in txt and 'Freigegeben' in txt and 'Mama (Knopf)' in txt and 'PIN geändert' in txt and 'Gelöscht' in txt and 'Papierkorb' in txt and '5 Min. gesperrt' in txt and 'ignoriert' in txt, txt)
    # zweite Liste
    ev("A._setCfg({ab2:'todo.kp_sicherung'})"); t(1000)
    ev("A._abMake(true)"); t(3000)
    ok('backup in 2nd list', ev("window.items['todo.kp_sicherung'].map(i=>i.summary)")==['kp|bak|2026-10-05'], ev("window.items['todo.kp_sicherung'].length"))
    # Hauptliste geleert -> Sicherung aus 2. Liste
    ev("A._penaltyCheck()"); t(500); ev("A._penaltyCheck()"); t(500)
    ev("window.items['todo.kinderpunkte'].splice(0); A._hass.callService('todo','add_item',{item:'x'},{entity_id:'todo.kinderpunkte'},false)"); t(1000)
    ev("A._bk2=null"); 
    for i in range(3): ev("A._penaltyCheck()"); t(1500)
    ok('missing all', ev("A._dchk && A._dchk.miss.length")>=3, ev("A._dchk"))
    print('BK', ev("A._bkIds()"), ev("A._bk2 && Object.keys(A._bk2.m)"), ev("A._dchk"))
    A.locator('[data-a="chkfix"]').first.click()
    for i in range(10): pg.wait_for_timeout(150); t(300)
    print('TOAST', ev("A.shadowRoot.querySelector('.toast') && A.shadowRoot.querySelector('.toast').textContent"))
    ev("A._closeModal()")
    ok('restored from 2nd', ev("!!A._db.kid.L && !!A._db.task.Z && !!A._db.cfg.main"), ev("Object.keys(A._db.kid)"))
    ok('cfg restored with pin+parents', ev("!!A._cfg.pinH && A._cfg.parents.length===2"), ev("A._cfg.parents"))
    A.locator('[data-a="tab"][data-id="einst"]').click(); t()
    pass
    ok('no errors', not errs and not ev("window.errs.length"), errs)
    b.close()
print('\n'.join(R))
