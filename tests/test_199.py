# 2.0.0: 🎮 Lernspiele – Punkte nur für richtige Antworten, Versuche pro Frage, Schwierigkeit nach Alter/Land/Klasse,
#         Einstellung je Kind · 🦷 Zahnputz-Bilder je Kind (#18)
from playwright.sync_api import sync_playwright
import datetime, atexit, re
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':392,'height':760}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:0,total:330,bd:1,bm:1,by:2018,order:1});
      A._save('kid','B2',{name:'Ben',emoji:'🐻',points:0,total:10,order:2});
      A._save('task','T1',{title:'Rechnen üben',emoji:'🧮',points:2,kids:['K'],sched:'week',days:[],created:'2026-10-01',game:{g:'math',n:2}});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',peOn:true,pePlay:'always',peGLim:'0'}); A._save('pk','K',{on:true,kind:'dog',name:'Bello',t0:0,s:3,h:true});
      A._save('pk','B2',{on:true,kind:'cat',name:'Mimi',t0:0,s:1,h:true});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    ev("document.getElementById('a').style.display='none'")
    # Spiele-Modul laden
    ev("B._peKid='K'; B._render()"); t(600)
    ev("B.shadowRoot.querySelector('[data-a=pegames]').click()"); t(800)
    ev("B._gmClose()"); t(300)
    # ---------- Stufe ----------
    ev("A._hass.config={...(A._hass.config||{}),country:'DE'}; B._hass.config=A._hass.config")
    ok('DE: born 2018 → class 3', ev("B._gmLvl('K')")==3, ev("B._gmLvl('K')"))
    ev("B._hass.config={...B._hass.config,country:'GB'}")
    ok('GB: start 5 → class 4', ev("B._gmLvl('K')")==4, ev("B._gmLvl('K')"))
    ev("B._hass.config={...B._hass.config,country:'SE'}")
    ok('SE: start 7 → class 2', ev("B._gmLvl('K')")==2, ev("B._gmLvl('K')"))
    ev("B._hass.config={...B._hass.config,country:'XX'}")
    ok('unknown country → 6', ev("B._gmLvl('K')")==3)
    ok('no birthday → class 1', ev("B._gmLvl('B2')")==1)
    ev("A._save('kid','B2',{...A._db.kid.B2,by:2022,bm:3,bd:1})"); t(300)
    ok('age 4 → preschool', ev("B._gmLvl('B2')")==0, ev("B._gmLvl('B2')"))
    ev("A._save('kid','K',{...A._db.kid.K,school:'2025-09'})"); t(300)
    ok('school start wins (class 2)', ev("B._gmLvl('K')")==2, ev("B._gmLvl('K')"))
    ev("A._save('pk','K',{...A._db.pk.K,lv:'5'})"); t(300)
    ok('kid setting wins', ev("B._gmLvl('K')")==5)
    ok('clean keeps lv', ev("A._clean('pk',{id:'K',lv:'v'}).lv")=='v' and 'lv' not in ev("A._clean('pk',{id:'K',lv:'9'})"))
    ok('level names', ev("B._gmLvlName(0)")=='Vorschule' and ev("B._gmLvlName(3)")=='Klasse 3')
    # ---------- Aufgaben je Stufe ----------
    lim={'v':5,'1':20,'2':100,'3':100,'4':1000,'5':1000,'6':400}
    for lv,mx in lim.items():
        ev(f"A._save('pk','K',{{...A._db.pk.K,lv:'{lv}'}})"); t(200)
        ev("B._gmStart('K','math')"); t(400)
        good=True; seen=[]
        for i in range(12):
            q=ev("(()=>{const o=B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]'); const a=[...B.shadowRoot.querySelectorAll('.gmov [data-g=ans]')].map(x=>x.dataset.v); return [B.shadowRoot.querySelector('.gmov .gmtask').textContent, o?Number(o.dataset.v):-1, a]})()")
            seen.append(q[0])
            if q[1]<0 or q[1]>mx or len(set(q[2]))!=3: good=False
            ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(700)
            if not ev("!!B.shadowRoot.querySelector('.gmov .gmtask')"): ev("B._gmStart('K','math')"); t(400)
        ok(f'level {lv}: results 0..{mx}, 3 distinct answers', good, seen[:6])
        ev("B._gmClose()"); t(200)
    ev("A._save('pk','K',{...A._db.pk.K,lv:'1'})"); t(200)
    # ---------- Versuche: 1 (Standard) ----------
    ev("B._gmStart('K','math')"); t(400)
    ev("B.shadowRoot.querySelector('.gmov [data-g=ans]:not([data-ok=\"1\"])').click()"); t(200)
    ok('wrong: shows solution, no point', ev("B._gm.score")==0 and ev("!!B.shadowRoot.querySelector('.gmov .sol')") and 'Richtig wäre' in ev("B.shadowRoot.querySelector('.gmov .gmsol').textContent"))
    ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(100)
    ok('locked after solution shown', ev("B._gm.score")==0)
    t(2000)
    ok('next question after solution', not ev("!!B.shadowRoot.querySelector('.gmov .sol')"))
    ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(800)
    ok('right: one point', ev("B._gm.score")==1)
    ev("B._gmClose()"); t(200)
    # ---------- Versuche: 2 ----------
    ev("A._setCfg({peTry:'2'})"); t(300)
    ev("B._gmStart('K','count')"); t(400)
    ev("B.shadowRoot.querySelector('.gmov [data-g=ans]:not([data-ok=\"1\"])').click()"); t(200)
    ok('2 tries: hint after first miss', 'Noch ein Versuch' in ev("B.shadowRoot.querySelector('.gmov .gmsol').textContent") and not ev("!!B.shadowRoot.querySelector('.gmov .sol')"))
    ev("B.shadowRoot.querySelector('.gmov .no').click()"); t(100)
    ok('same wrong button ignored', 'Noch ein Versuch' in ev("B.shadowRoot.querySelector('.gmov .gmsol').textContent"))
    ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(800)
    ok('2 tries: right on second try counts', ev("B._gm.score")==1)
    ev("B._gmClose()"); t(200)
    # ---------- Spiel als Aufgabe: Fehler haken nicht ab ----------
    ev("A._setCfg({peTry:'1'})"); t(300)
    ev("B._peKid=null; B._render()"); t(500)
    ev("B.shadowRoot.querySelector('.tile[data-t=T1]').click()"); t(800)
    ev("B.shadowRoot.querySelector('.gmov [data-g=ans]:not([data-ok=\"1\"])').click()"); t(2200)
    ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(800)
    ok('task: 1 right + 1 wrong not done', ev("B._status(A._db.task.T1,'K').s")!='d' and ev("B._gm.score")==1)
    ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(1500)
    ok('task: 2 right → done', ev("B._status(A._db.task.T1,'K').s")=='d', ev("B._status(A._db.task.T1,'K')"))
    ev("B._gmClose && B._gm && B._gmClose()"); t(300)
    # ---------- Eltern-Dialog ----------
    ev("document.getElementById('a').style.display=''; A._tab='tier'; A._render()"); t(800)
    ev("A._peAct('pekset',{k:'K'})"); t(500)
    ok('dialog has level select', ev("A.shadowRoot.querySelectorAll('#modal #pek_lv option').length")==8)
    ev("(()=>{const s=A.shadowRoot.querySelector('#modal #pek_lv'); s.value='v'; s.dispatchEvent(new Event('change',{bubbles:true}));})()")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    ok('dialog saves level', ev("A._db.pk.K.lv")=='v', ev("A._db.pk.K"))
    ok('settings: tries select', ev("!!A.shadowRoot.querySelector('[data-cfgs=peTry]')"))
    # ---------- 🦷 Bilder je Kind ----------
    ev("A._setCfg({zOn:true}); A._tab='zaehne'; A._render()"); t(500)
    for _ in range(40):
        pg.wait_for_timeout(250); t(100); ev("A._render()")
        if ev("!!A.shadowRoot.querySelector('yippee-teeth')"): break
    t(500)
    tab="A.shadowRoot.querySelector('yippee-teeth')"
    ok('chips under pictures', ev(f"{tab}.shadowRoot.querySelectorAll('[data-a=tkk]').length")>=2*14, ev(f"{tab}.shadowRoot.querySelectorAll('[data-a=tkk]').length"))
    ev(f"{tab}.shadowRoot.querySelector('[data-a=tkk][data-id=mond][data-v=B2]').click()"); t(500)
    ok('template saved for Ben', ev("A._zc().tk")=={'mond':['B2']}, ev("A._zc().tk"))
    ok('chip on', ev(f"{tab}.shadowRoot.querySelector('[data-a=tkk][data-id=mond][data-v=B2]').classList.contains('on')"))
    allp=ev("A._zc().tk") and None
    txt=ev(f"[...{tab}.shadowRoot.querySelectorAll('.kid')].map(x=>x.textContent).join('|')")
    nums=re.findall(r'(\d+)/(\d+)', txt)
    ok('Mia has one picture less than Ben', len(nums)==2 and int(nums[0][1])+1==int(nums[1][1]), txt)
    ev(f"{tab}.shadowRoot.querySelector('[data-a=tkk][data-id=mond][data-v=B2]').click()"); t(500)
    ok('toggle off → all kids', ev("A._zc().tk")=={}, ev("A._zc().tk"))
    ok('clean tk', ev("A._clean('zc',{id:'main',tk:{mond:['K','<x>'],'<b>':['K'],riff:[]}}).tk")=={'mond':['K']})
    ok('no errors', not errs, errs)
    b.close()
