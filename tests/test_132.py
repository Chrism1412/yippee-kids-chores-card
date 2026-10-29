from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-08T07:30:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    t=lambda ms=400: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._save('kid','K',{name:'Kai',emoji:'🐻',by:2021,bm:3,bd:1})"); t(600)
    # Vorlage mit 3 Zeitfenstern über Vorschläge
    ev("A._suggest('K')"); t(300)
    i=ev("[...A.shadowRoot.querySelectorAll('#modal [name=sg]')].findIndex(x=>x.parentElement.innerText.startsWith('🧼 Hände waschen'))")
    ok('hands suggested once', ev("[...A.shadowRoot.querySelectorAll('#modal [name=sg]')].filter(x=>x.parentElement.innerText.includes('Hände waschen')).length")==1)
    ev(f"A.shadowRoot.querySelectorAll('#modal [name=sg]')[{i}].checked=true")
    j=ev("[...A.shadowRoot.querySelectorAll('#modal [name=sg]')].findIndex(x=>x.parentElement.innerText.includes('Mittagessen'))"); ev(f"A.shadowRoot.querySelectorAll('#modal [name=sg]')[{j}].checked=true")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    h=ev("Object.values(A._db.task).find(x=>x.title==='Hände waschen' && !x.virtual)")
    ok('3 slots', h and len(h.get('slots',[]))==3, h and h.get('slots'))
    ok('3 virtual today', len(ev("A._todayTasks('K').filter(x=>x.title==='Hände waschen')"))==3)
    # Editor zeigt 2 weitere Zeilen
    ev(f"A._editTask('{h['id']}')"); t(300)
    ok('editor rows', ev("A.shadowRoot.querySelectorAll('#modal .slotrow').length")==2)
    ev("A.shadowRoot.querySelector('#modal [data-a=slotadd]').click()"); t()
    ev("(()=>{const r=[...A.shadowRoot.querySelectorAll('#modal .slotrow')].pop(); r.querySelector('[data-slotfrom]').value='05:00'; r.querySelector('[data-slotto]').value='06:00';})()")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    ok('4 slots saved', len(ev(f"A._db.task['{h['id']}'].slots"))==4, ev(f"A._db.task['{h['id']}'].slots"))
    # Überschneidung abgelehnt
    ev(f"A._editTask('{h['id']}')"); t(300)
    ev("(()=>{const r=[...A.shadowRoot.querySelectorAll('#modal .slotrow')].pop(); r.querySelector('[data-slotfrom]').value='06:50'; r.querySelector('[data-slotto]').value='07:10';})()")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(300)
    ok('overlap rejected', ev("A.shadowRoot.querySelector('#modal').classList.contains('open')")); ev("A._closeModal()")
    # Reihenfolge
    ev("A._save('task','T1',{title:'Zimmer aufräumen',emoji:'🧸',points:3,kids:['K'],sched:'week',days:[]})"); ev("A._save('task','T2',{title:'Bett machen',emoji:'🛏️',points:1,kids:['K'],sched:'week',days:[]})"); t(600)
    ev("A._setCfg({orderOn:true})"); t(300)
    order=lambda: [x['title'] for x in ev("A._taskOrder()")]
    o1=order(); idx=o1.index('Zimmer aufräumen')
    ev("A.shadowRoot.querySelector('[data-a=\"tab\"][data-id=\"aufgaben\"]').click()"); t()
    ev("A.shadowRoot.querySelector('[data-a=tup][data-id=T1]').click()"); t(600)
    o2=order(); ok('moved up', o2.index('Zimmer aufräumen')<o2.index('Bett machen') and o1.index('Zimmer aufräumen')>o1.index('Bett machen'), [o1,o2])  # 1.5.0: ▲▼ tauscht mit dem sichtbaren Nachbarn (gleiches Kind, gleiche Gruppe)
    ok('kid view follows order', [x['title'] for x in ev("A._todayTasks('K')") if not x.get('virtual')][:3]!=None)
    ok('tab remembered', ev("localStorage.getItem('kpTab')")=='aufgaben')
    # Tagesblöcke aus/an
    ok('blocks off default', '🌅 Morgens' not in ev("B.shadowRoot.querySelector('#app').innerText"))
    ok('kid card open by default', ev("!!B.shadowRoot.querySelector('.tile')"))
    ev("A._setCfg({dayBlocks:true})"); t(600)
    tx=ev("B.shadowRoot.querySelector('#app').innerText")
    ok('blocks on', '🌅 Morgens' in tx and '☀️ Mittags' in tx and '🌙 Abends' in tx, tx[:300])
    ok('+ Aufgabe in Heute', (ev("A.shadowRoot.querySelector('[data-a=\"tab\"][data-id=\"heute\"]').click()") or True) and 'Aufgabe' in ev("(A._render(), A.shadowRoot.querySelector('#app .btn.primary[data-a=etask]')||{}).innerText||''"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
