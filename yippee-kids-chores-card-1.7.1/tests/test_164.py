# 1.5.0: 🎁 Belohnungen nur für bestimmte Kinder, 📊 Wochenrückblick mit Vergleich zur Vorwoche, ⬇️ Berichte als CSV
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1000}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-25T19:30:00'))  # Sonntag
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:100,total:100});A._save('kid','B',{name:'Ben',emoji:'🐻',points:100,total:100});
      A._save('reward','LEGO',{title:'Lego-Set',emoji:'🧱',cost:50,kids:['B']}); A._save('reward','EIS',{title:'Eis',emoji:'🍦',cost:20});})()"""); t(800)
    ok('ben sees lego', 'Lego-Set' in [r['title'] for r in ev("A._rewards('B')")])
    ok('mia does not', 'Lego-Set' not in [r['title'] for r in ev("A._rewards('K')")] and 'Eis' in [r['title'] for r in ev("A._rewards('K')")])
    ev("A._request('LEGO','K')"); t(300)
    ok('mia cannot request', not ev("Object.values(A._db.req).some(q=>q.reward==='LEGO')") and 'gibt es für Mia nicht' in ev("(A.shadowRoot.querySelector('.toast')||{}).textContent||''"))
    ev("A._tab='belohnungen'; A._render()"); t(300)
    ok('admin row shows only-for', 'nur für Ben' in ev("A.shadowRoot.innerHTML"), ev("A.shadowRoot.querySelector('#app').innerText")[-600:])
    # Editor
    ev("A._editReward('EIS')"); t(400)
    ok('editor: kid checkboxes all checked', ev("A.shadowRoot.querySelectorAll('#modal [name=rkid]:checked').length")==2)
    ev("A.shadowRoot.querySelector('#modal [name=rkid][value=B]').click(); A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('saved kids', ev("A._db.reward.EIS.kids")==['K'], ev("A._db.reward.EIS"))
    ev("A._editReward('EIS')"); t(400)
    ev("A.shadowRoot.querySelector('#modal [name=rkid][value=K]').click(); A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(400)
    ok('none checked refused', ev("A._db.reward.EIS.kids")==['K'] and ev("A.shadowRoot.querySelector('#modal').classList.contains('open')"))
    ev("A.shadowRoot.querySelectorAll('#modal [name=rkid]').forEach(c=>c.checked=true); A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('all checked = no restriction stored', 'kids' not in ev("A._db.reward.EIS"))
    # Ziel
    ev("A._save('kid','K',{...A._db.kid.K, goal:'LEGO'})"); t(300)
    ev("A._tab='kid:K'; A._render()"); t(300)
    ok('foreign goal ignored in kid view', 'Lego-Set' not in ev("A.shadowRoot.innerHTML"))
    # Wochen-Vergleich
    ev("""(()=>{A._save('task','Z',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      for (const d of ['2026-10-12','2026-10-13','2026-10-14','2026-10-15','2026-10-16','2026-10-17','2026-10-18']) A._setSt(d,'Z','K', d<'2026-10-16'?'d':'');
      for (const d of ['2026-10-19','2026-10-20','2026-10-21','2026-10-22','2026-10-23','2026-10-24','2026-10-25']) A._setSt(d,'Z','K','d');
      A._save('kid','K',{...A._db.kid.K, ledger:[{d:'2026-10-20',n:7,r:'🪥 Zähne putzen'},{d:'2026-10-13',n:4,r:'🪥 Zähne putzen'}]});})()"""); t(1500)
    w=ev("A._weeklyMsgs(true)")
    mia=[x for x in w if 'Mia' in x[0]][0][1]
    ok('trend in percent and stars (sunday)', '7/7 erledigt (↗ +43 %)' in mia and '+7 ⭐ verdient (↗ +3)' in mia, mia)
    head=ev("A._weeklyMsgs(false)[0][1]").split('\n')[0]
    ok('trend in head line', '🦊 Mia 7/7 (↗ +43 %)' in head, head)
    pg.clock.run_for(3*86400000); t(300)  # Mittwoch: keine Sterne-Tendenz
    mia=[x for x in ev("A._weeklyMsgs(true)") if 'Mia' in x[0]][0][1]
    ok('no star trend midweek', '⭐ verdient (' not in mia, mia)
    # CSV
    ev("""(()=>{const F=window.File; window.File=class extends F{constructor(p,n,o){super(p,n,o); window.csv=p[0]; window.csvName=n;}};
      A._setCfg({rStart:'2099-01-01'}); A._repDone=new Set();
      A._save('kid','B',{...A._db.kid.B, rd:{}, rw:{}});
      A._save('kid','K',{...A._db.kid.K, rd:{'2026-10-26':[1,2,3,0,1,0]}, rw:{'2026-10-19':[7,7,7,0]}}); A._tab='kinder'; A._repOpen=true; A._repMode='d'; A._render();})()"""); t(500)
    ev("A.shadowRoot.querySelector('[data-a=repcsv]').click()"); t(300)
    csv=ev("window.csv")
    ok('csv days', csv.startswith('﻿Datum;') and 'Mia erledigt;Mia fällig;Mia Sterne;Mia eingelöst' in csv and '2026-10-26;;;;;1;2;3;0' in csv, csv[:300])
    ok('csv name', ev("window.csvName").startswith('YippeeBerichte-Tage-'))
    ev("A._repMode='w'; A._render()"); t(300); ev("A.shadowRoot.querySelector('[data-a=repcsv]').click()"); t(300)
    csv=ev("window.csv")
    ok('csv weeks', csv.startswith('﻿Woche ab;') and '2026-10-19;;;;;7;7;7;0' in csv, csv[:300])
    # ✓ Letzter Knopf + Hinweis, wenn die Knöpfe-Automation fehlt
    ev("A._save('task','KN',{title:'Knopf-Test',emoji:'🔘',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'}); A._setSt(A._today ? A._today() : new Date().toISOString().slice(0,10),'KN','K','p')"); t(500)
    d=ev("(()=>{const x=new Date(); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');})()")
    ev(f"A._setSt('{d}','KN','K','p')"); t(500)
    ev(f"A._save('act','17614848001234',{{a:'KP|ok|{d}|KN|K', u:'admin1'}})"); t(5000)
    bl=ev("A._cfg.btnLast")
    ok('button press logged + booked', bl and bl['r']=='ok' and bl['op']=='ok' and ev(f"A._st('{d}','KN','K')")=='d', bl)
    ev(f"A._save('act','17614848011234',{{a:'KP|no|{d}|KN|K', u:'admin1'}})"); t(5000)
    ok('already decided logged', ev("A._cfg.btnLast.r")=='gone')
    ev("A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}}; A._setCfg({parents:['admin1']})"); t(200)
    ev(f"A._save('act','17614848021234',{{a:'KP|ok|{d}|KN|K', u:'oma7'}})"); t(5000)
    ok('not a parent logged', ev("A._cfg.btnLast.r")=='np', ev("A._cfg.btnLast"))
    ev("A._setCfg({parents:[], targets:['mobile_app_phone_a'], nActions:true, setView:'all'}); A._autoChecked=true; A._autoOk={}; A._tab='einst'; A._accOpen='btn'; A._render()"); t(500)
    h=ev("A.shadowRoot.innerHTML")
    ok('settings: last button + missing automation warning', 'Letzter Knopf' in h and 'Knöpfe in Push-Nachrichten wirken noch nicht' in h, h.count('Letzter Knopf'))
    ev(f"A._setSt('{d}','KN','K','p'); A._tab='heute'; A._render()"); t(500)
    ok('approvals box shows warning', 'Automatisch anlegen' in ev("A.shadowRoot.querySelector('#app').innerText"))
    ev("A._autoOk={app:true}; A._render()"); t(300)
    ok('no warning once automation exists', 'wirken noch nicht' not in ev("A.shadowRoot.querySelector('#app').innerText"))
    ok('no page errors', not errs, errs)
    b.close()
