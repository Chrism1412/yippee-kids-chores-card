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
    ev("A._save('kid','K',{name:'Mia',emoji:'🦊',points:50,total:50}); A._save('kid','J',{name:'Ben',emoji:'🐻',points:0})"); t(1500)
    ev("A._save('reward','R',{title:'Eis',emoji:'🍦',cost:10,joker:true})"); t(1000)
    ev("A._save('req','Q1',{kid:'K',reward:'R',d:'2026-10-08'})"); t(1500)
    # Doppelte Freigabe auf zwei Karten gleichzeitig
    ev("A._redeem('K','R','Q1'); B._redeem('K','R','Q1')"); t(3000)
    k=ev("A._db.kid.K")
    ok('redeemed once', k['points']==40, k['points'])
    ok('joker +1 once', k.get('jokers')==1, k.get('jokers'))
    ok('history 1', len(k.get('history',[]))==1)
    ok('req gone', 'Q1' not in ev("A._db.req") and 'Q1' not in ev("B._db.req"))
    # Notenfreigabe doppelt
    ev("A._setCfg({gradesOn:true}); A._save('req','G1',{kid:'K',grade:{s:'Mathe',g:1},d:'2026-10-08'})"); t(1500)
    ev("A._gradeBook('K',{s:'Mathe',g:1},'G1',null); B._gradeBook('K',{s:'Mathe',g:1},'G1',null)"); t(3000)
    ok('grade booked once', len(ev("A._db.kid.K.grades||[]"))==1, ev("A._db.kid.K.grades"))
    # Sanitizing: bösartige Werte
    ev("""(()=>{const L=window.items['todo.kinderpunkte']; const it=L.find(i=>i.summary==='kp|kid|J'); const o=JSON.parse(it.description); o.jokers='<img src=x onerror=window.pw=1>'; o.grades=[{d:'2026-10-01',s:'Kunst',g:'<b>x</b>',p:'<i>'}]; o.ledger=[{d:'<x>',t:'1',n:'<svg>',r:'x'}]; delete o._c; it.description=JSON.stringify(o);
      const c=L.find(i=>i.summary==='kp|cfg|main'); const q=JSON.parse(c.description); q.pinL='<b>'; q.vac=[{from:'<img>',to:'2026-01-01'},{from:'2026-12-01',to:'2026-12-05'}]; delete q._c; c.description=JSON.stringify(q);
      const pr=L.find(i=>i.summary==='kp|req|Q1'); L.push({uid:'zz',summary:'kp|__proto__|polluted',description:'{"x":1}'}); L.push({uid:'zy',summary:'kp|constructor|pp',description:'{"x":1}'}); A._onItems(L);})()"""); t(500)
    j=ev("A._db.kid.J")
    ok('jokers numeric', j['jokers']==0, j['jokers'])
    ok('grade p numeric', j['grades'][0]['p']==0)
    ok('ledger sanitized', j['ledger'][0]['n']==0 and j['ledger'][0]['d']=='', j['ledger'])
    ok('pinL clamped', ev("A._cfg.pinL")==4, ev("A._cfg.pinL"))
    ok('vac filtered', len(ev("A._cfg.vac"))==1)
    ok('no pollution', ev("({}).polluted===undefined && Object.pp===undefined"))
    ok('no xss', ev("!window.pw"))
    # Rotation mit Teil-Anwesenheit: K nur ab 18:00 da, Aufgabe 08-10 → J dran
    ev("A._save('task','RT',{title:'Tisch',emoji:'🍽️',points:1,kids:['K','J'],sched:'week',days:[],rotate:true,from:'08:00',to:'10:00',created:'2026-10-01'})"); t(800)
    r0=ev("A._rotKid(A._db.task.RT,new Date(2026,9,8))")
    other='J' if r0=='K' else 'K'
    ev(f"""(()=>{{const k=A._db.kid['{r0}']; A._save('kid','{r0}',{{...k,pres:{{on:true,base:'out',rules:[{{st:'in',every:1,start:'2026-10-08',fT:'18:00',toDay:5,tT:'18:00'}}],hol:{{}},ex:[]}}}});}})()"""); t(800)
    st=ev(f"A._pres('{r0}','2026-10-08')")
    r1=ev("A._rotKid(A._db.task.RT,new Date(2026,9,8))")
    ok('rotation skips partly absent kid', st['s'] in ('arr','part','out') and r1==other, (r0,r1,st.get('s')))
    # Wochenstatistik mit Erstattung
    ev("A._addPoints('J',5,'Bett'); A._addPoints('J',-3,'Verpasst: Bett'); A._addPoints('J',3,'↩️ Minuspunkte erstattet: Bett')"); t(800)
    w=ev("A._weekStats(A._db.kid.J)")
    ok('weekly refund cancels minus', w['minus']==0, w)
    # Alter 29.2.
    ok('leap age', ev("A._age({by:2016,bm:2,bd:29}, new Date(2027,1,28))")==11 and ev("A._age({by:2016,bm:2,bd:29}, new Date(2027,1,27))")==10)
    # Aufgabe bearbeiten behält Reihenfolge
    ev("A._setCfg({orderOn:true}); A._save('task','O1',{...A._db.task.RT,order:7})"); t(800)
    ev("A._until=Date.now()+999999; A._editTask('O1')"); t(500)
    ev("A.shadowRoot.querySelector('#modal [data-a=\"msave\"], #modal .btn.primary').click()"); t(1200)
    ok('edit keeps order', ev("A._db.task.O1.order")==7, ev("A._db.task.O1.order"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
