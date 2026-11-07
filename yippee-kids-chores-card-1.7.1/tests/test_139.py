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
    ev("A._setCfg({approval:false}); A._save('kid','K',{name:'Mia',emoji:'🦊',points:0,doneCount:5})"); t(1500)
    ev("A._save('task','T1',{title:'Bett',emoji:'🛏️',points:2,kids:['K'],sched:'week',days:[]}); A._save('task','T2',{title:'Tisch',emoji:'🍽️',points:3,kids:['K'],sched:'week',days:[]})"); t(1500)
    ev("A._markDone('2026-10-08','T1','K')"); t(300); ev("B._markDone('2026-10-08','T2','K')"); t(2500)
    k=ev("A._db.kid.K")
    ok('both done counted', k.get('doneCount')==7 and k['points']==5, (k.get('doneCount'),k['points']))
    # Sicherung mit schädlichen Einträgen
    bk={'app':'yippee-kids-chores','data':{'kid':{'__proto__':{'x':1},'bad id':{'name':'x'},'Z':'string','N':{'name':'Neu','points':'<img src=x onerror=window.pw=1>','jokers':'<b>'}},'cfg':{'main':'kaputt'}}}
    ev("j=>A._applyBackup(j)", bk); t(2500)
    ok('valid kid restored', ev("A._db.kid.N && A._db.kid.N.points===0 && A._db.kid.N.jokers===0"), ev("A._db.kid.N"))
    ok('bad ids skipped', ev("!A._db.kid['bad id'] && !A._db.kid.Z && Object.getPrototypeOf(A._db.kid)===Object.prototype"))
    ok('cfg kept', ev("A._cfg.approval===false"))
    ok('no xss', ev("!window.pw"))
    # Papierkorb mit falschem Typ
    ev("A._db.trash.X={id:'X',t:'__proto__',oid:'pp',o:{a:1}}; A._trashRestore('X')"); t(500)
    ok('trash guard', ev("({}).a===undefined && !A._db.__proto__.pp"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
