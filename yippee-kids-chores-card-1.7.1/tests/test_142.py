from playwright.sync_api import sync_playwright
import datetime, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-08T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(300)
    t=lambda ms=600: pg.clock.run_for(ms); ev=pg.evaluate
    L="window.items['todo.kinderpunkte']"
    ev("A._setCfg({approval:false}); A._save('kid','K',{name:'Mia',emoji:'🦊',points:0,doneCount:5})"); t(1500)
    ev("A._save('task','T1',{title:'Bett',emoji:'🛏️',points:2,kids:['K'],sched:'week',days:[]}); A._save('task','T2',{title:'Tisch',emoji:'🍽️',points:3,kids:['K'],sched:'week',days:[]})"); t(1500)
    # gleichzeitig auf zwei Karten
    ev("A._markDone('2026-10-08','T1','K'); B._markDone('2026-10-08','T2','K')"); t(1500)
    ok('both visible before merge', ev("A._db.kid.K.points")==5 and ev("B._db.kid.K.points")==5, (ev("A._db.kid.K.points"),ev("B._db.kid.K.points")))
    ok('two booking items', len([i for i in ev(L) if i['summary'].startswith('kp|pt|')])==2)
    ok('counter both', ev("A._db.kid.K.doneCount")==7, ev("A._db.kid.K.doneCount"))
    t(15000)
    raw=json.loads([i for i in ev(L) if i['summary']=='kp|kid|K'][0]['description'])
    ok('merged into kid record', raw['points']==5 and raw['doneCount']==7 and len(raw['ledger'])==2, (raw.get('points'),raw.get('doneCount')))
    ok('bookings removed', not [i for i in ev(L) if i['summary'].startswith('kp|pt|')])
    ok('still 5 after merge (no double)', ev("A._db.kid.K.points")==5 and ev("B._db.kid.K.points")==5)
    # Doppeltes Zusammenführen (zwei Geräte gleichzeitig) zählt nicht doppelt
    ev("A._addPoints('K',10,'Von Hand (Eltern)')"); t(6000)
    ev("window.__kpCons=false; A._consBusy=false; B._consBusy=false; A._consCheck(); window.__kpCons=false; B._consCheck()"); t(4000)
    ok('parallel merge no double', ev("A._db.kid.K.points")==15, ev("A._db.kid.K.points"))
    # Kind bearbeiten während Buchung offen
    ev("A._addPoints('K',4,'Von Hand (Eltern)')"); t(300)
    ev("A._save('kid','K',{...A._db.kid.K,goal:''},(cur)=>({...cur,name:'Mia2'}))"); t(1500)
    ok('edit keeps pending booking', ev("A._db.kid.K.points")==19 and ev("A._db.kid.K.name")=='Mia2', (ev("A._db.kid.K.points"),ev("A._db.kid.K.name")))
    t(15000)
    ok('after merge 19', ev("A._db.kid.K.points")==19 and json.loads([i for i in ev(L) if i['summary']=='kp|kid|K'][0]['description'])['points']==19)
    # Einlösen mit Verlauf/Joker
    ev("A._save('reward','R',{title:'Eis',emoji:'🍦',cost:10,joker:true})"); t(1000)
    ev("A._redeem('K','R')"); t(1500)
    ok('redeem ops', ev("A._db.kid.K.points")==9 and ev("A._db.kid.K.jokers")==1 and ev("A._db.kid.K.history[0].t")=='Eis')
    t(15000)
    raw=json.loads([i for i in ev(L) if i['summary']=='kp|kid|K'][0]['description'])
    ok('redeem merged', raw['points']==9 and raw['jokers']==1 and raw['red']['R']==['2026-10-08'], raw.get('red'))
    # manipulierte Buchung
    ev("""(()=>{const L=window.items['todo.kinderpunkte']; L.push({uid:'zz1',summary:'kp|pt|evil1',description:JSON.stringify({k:'K',n:'<img>',r:'<b>x</b>',d:'x',t:'y',ts:1,o:{inc:{points:999,jokers:'5'},push:[['ledger',{x:1},5]],set:{name:'X'}}})}); A._onItems(L);})()"""); t(300)
    k=ev("A._db.kid.K")
    ok('evil booking sanitized', k['points']==9 and k['jokers']==6 and k['name']=='Mia2', (k['points'],k['jokers'],k['name']))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
