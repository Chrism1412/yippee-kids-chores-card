from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-09T08:00:00'))  # Freitag
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    t=lambda ms=400: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._setCfg({hc:'DE',hr:'DE-BW'})"); t(300)
    ev("A._setCfg({hol:{sub:A._holKey(),ts:1,ph:[],sh:[{from:'2026-10-26',to:'2026-10-30',n:'Herbstferien'},{from:'2027-07-29',to:'2027-09-11',n:'Sommerferien'}]}})"); t(300)
    ev("A._save('kid','K',{name:'Lina',emoji:'🦊',by:2018,bm:3,bd:1,pres:{on:true,every:2,start:'2026-10-09',aT:'12:00',lDay:3,lT:'12:00',hol:{summer:{m:'firstW',w:3},autumn:{m:'other'}},swap:false,ex:[{from:'2026-11-20',to:'2026-11-22',st:'in'}]}})"); t(600)
    st=lambda d: ev(f"(()=>{{const r=A._pres('K','{d}'); return r.s+(r.at?'@'+r.at:'')}})()")
    exp={'2026-10-09':'arr@12:00','2026-10-12':'in','2026-10-14':'lv@12:00','2026-10-15':'out','2026-10-22':'out','2026-10-23':'arr@12:00','2026-10-25':'in','2026-10-26':'out','2026-10-30':'out','2026-11-06':'arr@12:00','2026-11-21':'in','2027-07-28':'out','2027-07-29':'in','2027-08-10':'in','2027-08-18':'in','2027-08-19':'out'}
    got={d:st(d) for d in exp}
    bad={d:(got[d],exp[d]) for d in exp if got[d]!=exp[d]}
    ok('states', not bad, bad)
    # Aufgaben am Ankunftstag
    ev("A._save('task','M',{title:'Bett machen',emoji:'🛏️',points:1,kids:['K'],sched:'week',days:[],from:'06:45',to:'10:00'})")
    ev("A._save('task','E',{title:'Zähne putzen abends',emoji:'🪥',points:1,kids:['K'],sched:'week',days:[],from:'19:00',to:'21:00'})"); t(600)
    tt=[x['title'] for x in ev("A._todayTasks('K')")]
    ok('arrival day: only after 12', tt==['Zähne putzen abends'], tt)
    ok('wed leave: only morning', ev("A._isFor(A._db.task.M,'K',new Date('2026-10-14T09:00:00'))") and not ev("A._isFor(A._db.task.E,'K',new Date('2026-10-14T09:00:00'))"))
    ok('absent: none', not ev("A._isFor(A._db.task.M,'K',new Date('2026-10-16T09:00:00'))"))
    ok('banner arrival', 'Willkommen' in ev("B.shadowRoot.querySelector('#app').innerText"))
    ok('morning skip', ev("A._presMorningAway('K','2026-10-09')"))
    # Editor + Vorschau + Speichern
    ev("A._editKid('K')"); t(300)
    ok('editor', ev("!!A.shadowRoot.querySelector('#modal [name=presOn]')") and 'Vorschau' in ev("A.shadowRoot.querySelector('#modal').innerText"))
    ev("A.shadowRoot.querySelector('#modal [data-a=exadd]').click()"); t()
    ev("(()=>{const r=[...A.shadowRoot.querySelectorAll('#modal .exrow')].pop(); r.querySelector('[data-exf]').value='2026-12-24'; r.querySelector('[data-ext]').value='2026-12-26'; r.querySelector('[data-exs]').value='out';})()")
    ev("A.shadowRoot.querySelector('#modal [name=ph_xmas]').value='me'")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    pr=ev("A._db.kid.K.pres"); ok('saved', len(pr['ex'])==2 and pr['hol']['xmas']['m']=='me' and pr['hol']['summer']['w']==3, pr)
    ok('exception out', st('2026-12-25')=='out')
    # Tag ohne Anwesenheit: Kinder-Ansicht
    pg.clock.run_for(7*86400*1000); t(1500)
    ok('banner absent', 'Bis bald' in ev("B.shadowRoot.querySelector('#app').innerText"), ev("B.shadowRoot.querySelector('#app').innerText")[:200])
    ok('sensor', ev("A._pres('K', '2026-10-16').s")=='out')
    # Patchwork: meist da, jeden Mi 14:00–Do 08:00 weg, alle 2 Wochen Fr 15:00–So 18:00 weg, Di 15–17 weg
    ev("A._save('kid','P',{name:'Noah',emoji:'🐼',by:2016,bm:1,bd:1,pres:{on:true,base:'in',rules:[{st:'out',every:1,start:'2026-10-14',fT:'14:00',toDay:4,tT:'08:00'},{st:'out',every:2,start:'2026-10-16',fT:'15:00',toDay:0,tT:'18:00'},{st:'out',every:1,start:'2026-10-13',fT:'15:00',toDay:2,tT:'17:00'}],hol:{},ex:[]}})"); t(600)
    sp=lambda d: ev(f"(()=>{{const r=A._pres('P','{d}'); return r.s+(r.at?'@'+r.at:'')}})()")
    exp2={'2026-10-14':'lv@14:00','2026-10-15':'arr@08:00','2026-10-16':'lv@15:00','2026-10-17':'out','2026-10-18':'arr@18:00','2026-10-23':'in','2026-10-30':'lv@15:00','2026-10-13':'part','2026-10-12':'in'}
    got2={d:sp(d) for d in exp2}; bad2={d:(got2[d],exp2[d]) for d in exp2 if got2[d]!=exp2[d]}
    ok('patchwork states', not bad2, bad2)
    ev("A._save('task','M2',{title:'Bett machen',emoji:'🛏️',points:1,kids:['P'],sched:'week',days:[],from:'06:45',to:'10:00'})")
    ev("A._save('task','E2',{title:'Zähne putzen abends',emoji:'🪥',points:1,kids:['P'],sched:'week',days:[],from:'19:00',to:'21:00'})"); t(600)
    ok('thu morning (arr 08:00) still has 06:45-10:00', ev("A._isFor(A._db.task.M2,'P',new Date('2026-10-15T09:00:00'))"))
    ok('wed evening excluded', not ev("A._isFor(A._db.task.E2,'P',new Date('2026-10-14T09:00:00'))"))
    ok('tue part: evening ok', ev("A._isFor(A._db.task.E2,'P',new Date('2026-10-13T09:00:00'))"))
    ok('preview', len(ev("A._presPreview('P',2)"))>=3, ev("A._presPreview('P',2)"))
    # Editor: Regel hinzufügen + Live-Vorschau
    ev("A._editKid('P')"); t(300)
    ok('rules shown', ev("A.shadowRoot.querySelectorAll('#modal .prule').length")==3)
    ev("A.shadowRoot.querySelector('#modal [data-a=ruadd]').click()"); t()
    ok('rule added', ev("A.shadowRoot.querySelectorAll('#modal .prule').length")==4)
    ev("A.shadowRoot.querySelector('#modal [data-a=prprev]').click()"); t()
    ok('live preview', '–' in ev("A.shadowRoot.querySelector('#modal [data-prprev]').innerText"))
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('saved 4 rules', len(ev("A._db.kid.P.pres.rules"))==4)
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
