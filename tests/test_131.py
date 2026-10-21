from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-11T12:00:00'))  # Sonntag
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    t=lambda ms=400: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._setCfg({hc:'DE', hr:'DE-BW'})"); t(300)
    ev("void (A._isSchoolDay=(d)=>d.getDay()!==0&&d.getDay()!==6&&!(d.getMonth()===9&&d.getDate()>=26&&d.getDate()<=31))")  # Herbstferien 26.–31.10.
    ev("A._save('kid','K',{name:'Kai',emoji:'🐻',by:2017,bm:3,bd:1})"); t(600)
    ev("A._save('task','R',{title:'Ranzen für morgen packen',emoji:'🎒',points:2,kids:['K'],sched:'week',days:[0,1,2,3,4],school:true})"); t(600)
    on=lambda tid,ds: ev(f"A._isOn(A._db.task['{tid}'], new Date('{ds}T12:00:00'))")
    ok('old task: sunday on', on('R','2026-10-11'))
    ok('old task: thursday on', on('R','2026-10-15'))
    ok('old task: sunday before holidays off', not on('R','2026-10-25'))
    ok('old task: friday before holidays (not in days) off', not on('R','2026-10-23'))
    ok('old task: sunday last holiday day -> monday school', on('R','2026-11-01'))
    # Vorschläge: Turnbeutel → Sporttage-Frage
    ev("A._suggest('K')"); t(300)
    i=ev("[...A.shadowRoot.querySelectorAll('#modal [name=sg]')].findIndex(x=>x.parentElement.innerText.includes('Turnbeutel'))")
    ok('turnbeutel suggested', i>=0, i)
    ev(f"A.shadowRoot.querySelectorAll('#modal [name=sg]')[{i}].checked=true"); ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(1000)
    ok('sport dialog', 'Wann ist Sport' in ev("A.shadowRoot.querySelector('#modal').innerText"))
    ev("A.shadowRoot.querySelectorAll('#modal [name=sd]').forEach(x=>{x.checked=['1','4'].includes(x.value)})"); ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    tb=ev("Object.values(A._db.task).find(x=>x.title==='Turnbeutel packen')")
    ok('days = evening before (So, Mi)', tb['days']==[0,3] and tb['schoolPrev'] and tb['school'], tb)
    # Editor zeigt Haken
    ev(f"A._editTask('{tb['id']}')") ; t(300)
    ok('editor prev checked', ev("A.shadowRoot.querySelector('#modal [name=schoolPrev]').checked"))
    ev("A.shadowRoot.querySelector('#modal [name=schoolPrev]').checked=false"); ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('prev off saved', ev(f"A._db.task['{tb['id']}'].schoolPrev")==False)
    # Joker Eltern
    ev("A._setCfg({jokerOn:true})"); t(300)
    ev("A._editKid('K')"); t(300)
    ok('joker field', ev("!!A.shadowRoot.querySelector('#modal [name=jokers]')"))
    ev("A.shadowRoot.querySelector('#modal [name=jokers]').value='3'"); ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('jokers set', ev("A._db.kid.K.jokers")==3)
    ev("A.shadowRoot.querySelector('[data-a=\"tab\"][data-id=\"kinder\"]').click()"); t()
    ok('shown in list', '🃏 3' in ev("A.shadowRoot.querySelector('#app').innerText"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
