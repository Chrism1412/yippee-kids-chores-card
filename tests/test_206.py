# 2.0.0: 🎮 Einstellungen je Spiel (ausklappbar) · 🔁 Fehler später wiederholen · 🧩 Puzzle 4×4 · ◆ Formen bei „Farben merken“ ·
#        🗺️ Abenteuer: Bestzeit je Level, Stufe fest vorgeben
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':392,'height':860}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:330,order:1,by:2018,bm:3,bd:1});
      A._save('task','T1',{title:'Rechnen üben',emoji:'🧮',points:2,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',peJrLim:'0'});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,lv:'1'});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    # ---------- Einstellungen ----------
    ev("document.getElementById('b').style.display='none'; A._tab='tier'; A._render()"); t(600)
    q="A.shadowRoot.querySelector('.petab')"
    ok('a block per game (23 + adventure)', ev(f"{q}.querySelectorAll('details.gmset').length")==24)
    chg=lambda g,f,v=None: (ev(f"""(()=>{{const e={q}.querySelector('[data-pecfg=gs][data-g={g}][data-f={f}]'); {'e.checked=!e.checked' if v is None else f"e.value='{v}'"}; e.dispatchEvent(new Event('change',{{bubbles:true,composed:true}}));}})()"""), t(400))
    chg('move','on')
    ok('switch off → stored', ev("A._cfg.gs.move")=={'off':True})
    ok('summary shows „aus“', 'aus' in ev(f"{q}.querySelector('[data-g=move][data-f=on]').closest('details').querySelector('summary').textContent"))
    chg('math','tries','2'); chg('memory','pairs','12'); chg('puzzle','size','4'); chg('simon','shp'); chg('jr','ctl','n'); chg('count','rep')
    ok('per game values stored', ev("A._cfg.gs")=={'move':{'off':True},'math':{'tries':2},'memory':{'pairs':12},'puzzle':{'size':4},'simon':{'shp':False},'jr':{'ctl':'n'},'count':{'rep':False}}, ev("A._cfg.gs"))
    ev(f"{q}.querySelector('[data-a=cfg][data-k=peJr]').click()"); t(400)
    ok('adventure switch off', ev("A._cfg.peJr")==False and ev(f"{q}.querySelectorAll('details.gmset')[23].querySelector('summary em')") is not None)
    ev(f"{q}.querySelector('[data-a=cfg][data-k=peJr]').click()"); t(400)
    ok('adventure switch on again', ev("A._cfg.peJr")!=False)
    ok('clean gs', ev("A._clean('cfg',{id:'main',gs:{math:{tries:9,off:'x'},xx:{off:true},puzzle:{size:4,num:false}}}).gs")=={'puzzle':{'size':4,'num':False}})
    ev("A._editTask('T1')"); t(800); pg.wait_for_timeout(600); t(400)
    opts=ev("[...A.shadowRoot.querySelectorAll('#modal select[name=game] option')].map(o=>o.value)")
    ok('switched-off game not offered as task', 'move' not in opts and 'math' in opts, opts)
    ev("A._closeModal()"); t(200)
    # ---------- Menü ----------
    ev("document.getElementById('a').style.display='none'; document.getElementById('b').style.display=''; B._peKid='K'; B._render()"); t(600)
    ev("B.shadowRoot.querySelector('[data-a=pegames]').click()"); t(800)
    ok('switched-off game hidden in menu', not ev("!!B.shadowRoot.querySelector('.gmov [data-g=play][data-v=move]')") and ev("!!B.shadowRoot.querySelector('.gmov [data-g=play][data-v=math]')"))
    # ---------- Versuche je Spiel + Fehler wiederholen ----------
    ev("B._gmStart('K','math')"); t(500)
    ev("B.shadowRoot.querySelector('.gmov [data-g=ans]:not([data-ok=\"1\"])').click()"); t(200)
    ok('math: 2 tries from game setting', 'Noch ein Versuch' in ev("B.shadowRoot.querySelector('.gmov .gmsol').textContent"))
    task0=ev("B.shadowRoot.querySelector('.gmov .gmtask').textContent")
    ev("B.shadowRoot.querySelectorAll('.gmov [data-g=ans]:not([data-ok=\"1\"]):not(.no)')[0].click()"); t(2200)
    ok('failed question remembered', len(ev("JSON.parse(localStorage.getItem('yippee_rep_K_math')||'[]')"))==1)
    for i in range(1): ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(800)
    ok('2nd question is the repeat', ev("!!B.shadowRoot.querySelector('.gmov .gmrep')") and ev("B.shadowRoot.querySelector('.gmov .gmtask').textContent")==task0, [task0, ev("B.shadowRoot.querySelector('.gmov .gmtask') && B.shadowRoot.querySelector('.gmov .gmtask').textContent")])
    ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(800)
    ok('solved → removed from the list', ev("localStorage.getItem('yippee_rep_K_math')") is None)
    ev("B._gmClose()"); t(200)
    ev("B._gmMenu('K')"); t(200); ev("B._gmStart('K','count')"); t(500)
    ev("B.shadowRoot.querySelector('.gmov [data-g=ans]:not([data-ok=\"1\"])').click()"); t(2200)
    ok('count: repeating switched off', ev("localStorage.getItem('yippee_rep_K_count')") is None)
    ev("B._gmClose()"); t(200)
    # ---------- Memory 12 Paare ----------
    ev("B._gmMenu('K')"); t(200); ev("B._gmStart('K','memory')"); t(800)
    ok('memory: fixed 12 pairs', ev("B.shadowRoot.querySelectorAll('.gmcard').length")==24)
    ev("B._gmClose()"); t(200)
    # ---------- Puzzle 4×4 ----------
    ev("B._gmMenu('K')"); t(200); ev("B._gmStart('K','puzzle')"); t(900)
    ok('puzzle 4×4 from setting (15 pieces, template 16 cells)', ev("B.shadowRoot.querySelectorAll('.gmpz button').length")==15 and ev("B.shadowRoot.querySelectorAll('.gmpzv b').length")==16)
    ev("B.shadowRoot.querySelector('[data-g=pzhint]').click()"); t(200)
    tip=ev("(()=>{const b=B.shadowRoot.querySelector('.gmpz button.tip'); return b?b.className:''})()")
    ok('4×4 tip marks a movable piece', 'mv' in tip, tip)
    ev("B.shadowRoot.querySelector('[data-g=pzsize]').click()"); t(300)
    ok('switch to 3×3 (remembered)', ev("B.shadowRoot.querySelectorAll('.gmpz button').length")==8 and ev("localStorage.getItem('yippee_pzsize_K')")=='3')
    ev("B._gmClose()"); t(200)
    # ---------- Farben merken: Formen ----------
    ev("B._gmMenu('K')"); t(200); ev("B._gmStart('K','simon')"); t(800)
    ok('shapes off by parent setting', ev("[...B.shadowRoot.querySelectorAll('.gmsong [data-g=note]')].every(x=>!x.textContent)"))
    ev("B.shadowRoot.querySelector('[data-g=shp]').click()"); t(200)
    ok('kid switches shapes on', ev("[...B.shadowRoot.querySelectorAll('.gmsong [data-g=note]')].map(x=>x.textContent).join('')")=='★●▲■' and ev("B.shadowRoot.querySelector('.gmsong').classList.contains('shp')"))
    ev("B._gmClose()"); t(200)
    # ---------- Abenteuer: Stufe fest, Bestzeit ----------
    ev("B._gmMenu('K')"); t(200); ev("B.shadowRoot.querySelector('.gmov [data-g=jr]').click()"); t(300); pg.wait_for_timeout(400); t(400)
    ev("B.shadowRoot.querySelector('.gmov [data-g=jrstart]').click()"); t(300)
    ok('fixed difficulty: no choice buttons', not ev("!!B.shadowRoot.querySelector('.gmov [data-g=jrctl]')"))
    ev("B._jrPlay('K',1)"); t(400)
    ok('fixed „Normal“: 3 hearts', ev("B._jr.test.hp")==3)
    t(3000); ev("B._jr.test.finish()"); t(500)
    tm=ev("A._db.pk.K.jr.t")
    ok('best time saved', tm and tm.get('1',0)>=3, tm)
    ok('finish shows time + replay hint', '⏱️' in ev("B.shadowRoot.querySelector('.jrmsg').textContent"))
    ev("B._jrPlay('K',1)"); t(1500); ev("B._jr.test.finish()"); t(500)
    ok('faster run → new best time', ev("A._db.pk.K.jr.t['1']") < tm['1'] and 'Bestzeit' in ev("B.shadowRoot.querySelector('.jrmsg').textContent"), ev("A._db.pk.K.jr.t"))
    ev("B._jrMap('K')"); t(300)
    ok('map shows best time', '⏱️' in ev("B.shadowRoot.querySelector('.gmov [data-g=jrgo][data-v=\"1\"]').textContent"))
    ok('clean jr.t', ev("A._clean('pk',{id:'K',jr:{u:2,c:{},ctl:'e',t:{1:12.34,11:5,2:-1}}}).jr.t")=={'1':12.3})
    ok('no errors', not errs, errs)
    b.close()
