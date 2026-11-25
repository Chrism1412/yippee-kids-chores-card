# 2.0.0: 🐾 „nach bestimmten Aufgaben“ mit Kinder-Auswahl (Auswahl je Kind) · 🍎 Füttern pro Tag 1–10 (auch je Kind) mit 5 Minuten Pause
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
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:330,order:1}); A._save('kid','B2',{name:'Ben',emoji:'🐻',points:3,total:330,order:2});
      const T=(id,title,kids)=>A._save('task',id,{title,emoji:'🧹',points:1,kids,sched:'week',days:[],created:'2026-10-01'});
      T('T1','Zimmer aufräumen',['K']); T('T2','Zimmer aufräumen',['B2']); T('T3','Tisch decken',['K','B2']); T('T4','Hausaufgaben',['B2']);
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',peOn:true,pePlay:'tasks',peTasks:['T3']});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true}); A._save('pk','B2',{on:true,kind:'cat',name:'Mimi',t0:0,s:3,h:true});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    ev("document.getElementById('b').style.display='none'; A._tab='tier'; A._render()"); t(800)
    q="A.shadowRoot.querySelector('.petab')"
    ok('dropdown with all kids', ev(f"{q}.querySelectorAll('[data-pecfg=peTk] option').length")==3)
    ok('all kids: every task, kid emojis shown', ev(f"{q}.querySelectorAll('[data-pecfg=peTasks]').length")==4 and '· Mia' in ev(f"{q}.textContent") and 'Mia, Ben' in ev(f"{q}.textContent"))
    # Mia wählen
    ev(f"(()=>{{const s={q}.querySelector('[data-pecfg=peTk]'); s.value='K'; s.dispatchEvent(new Event('change',{{bubbles:true,composed:true}}));}})()"); t(500)
    ids=ev(f"[...{q}.querySelectorAll('[data-pecfg=peTasks]')].map(x=>x.dataset.v)")
    ok('Mia: only her tasks', sorted(ids)==['T1','T3'], ids)
    ok('Mia: common choice pre-ticked, hint', ev(f"{q}.querySelector('[data-v=T3]').checked") and 'Noch wie bei allen' in ev(f"{q}.textContent"))
    ev(f"{q}.querySelector('[data-v=T1]').click()"); t(600)
    ok('tick → own selection for Mia', ev("A._db.pk.K.play")=={'m':'tasks','p':50,'t':['T3','T1']}, ev("A._db.pk.K.play"))
    ok('common selection untouched', ev("A._cfg.peTasks")==['T3'])
    ok('✓ in dropdown + reset button', '✓' in ev(f"{q}.querySelector('[data-pecfg=peTk] option[value=K]').textContent") and ev(f"!!{q}.querySelector('[data-a=petkr]')"))
    ok('Ben still common', not ev("A._db.pk.B2.play && A._db.pk.B2.play.m==='tasks'"))
    ev(f"{q}.querySelector('[data-a=petkr]').click()"); t(600)
    ok('reset → Mia like all kids again', ev("A._db.pk.K.play.m")=='')
    # Alle Kinder: Häkchen ändert die gemeinsame Auswahl
    ev(f"(()=>{{const s={q}.querySelector('[data-pecfg=peTk]'); s.value=''; s.dispatchEvent(new Event('change',{{bubbles:true,composed:true}}));}})()"); t(500)
    ev(f"{q}.querySelector('[data-v=T4]').click()"); t(500)
    ok('all kids: common selection changed', ev("A._cfg.peTasks")==['T3','T4'])
    # ---------- 🍎 Füttern ----------
    ok('setting feeding per day', ev(f"!!{q}.querySelector('[data-cfgs=peFeed]')"))
    ok('clean fd + ft', ev("A._clean('pk',{id:'K',fd:99}).fd")==10 and 'fd' not in ev("A._clean('pk',{id:'K',fd:0})") and ev("A._clean('pk',{id:'K',d:{d:'2026-11-25',f:1,ft:123}}).d.ft")==123)
    ev("A._setCfg({pePlay:'always',peFeed:'2'})"); t(300)
    ev("document.getElementById('b').style.display=''; document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(800)
    feed=lambda: (ev("B.shadowRoot.querySelector('[data-a=pefeed]').click()"), t(300))
    feed()
    ok('fed once (1/2)', ev("A._db.pk.K.d.f")==1 and '1/2' in ev("B.shadowRoot.querySelector('[data-a=pefeed]').textContent"))
    t(3500); feed()
    ok('within 5 minutes: still full', ev("A._db.pk.K.d.f")==1 and 'satt' in ev("B.shadowRoot.textContent"), ev("A._db.pk.K.d.f"))
    t(5*60*1000); feed()
    ok('after 5 minutes: fed again (2/2)', ev("A._db.pk.K.d.f")==2)
    t(6*60*1000); feed()
    ok('limit reached: full', ev("A._db.pk.K.d.f")==2)
    # je Kind: 4 statt 2
    ev("document.getElementById('a').style.display=''; A._tab='tier'; A._render()"); t(500)
    ev("A._peAct('pekset',{k:'K'})"); t(500)
    ok('dialog: feeding select', ev("A.shadowRoot.querySelectorAll('#modal #pek_fd option').length")==11)
    ev("(()=>{const s=A.shadowRoot.querySelector('#modal #pek_fd'); s.value='4'; s.dispatchEvent(new Event('change',{bubbles:true}));})()")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('per kid saved', ev("A._db.pk.K.fd")==4)
    ev("document.getElementById('a').style.display='none'; B._render()"); t(400)
    t(6*60*1000); feed()
    ok('per kid limit used (3/4)', ev("A._db.pk.K.d.f")==3 and '3/4' in ev("B.shadowRoot.querySelector('[data-a=pefeed]').textContent"))
    ev("document.getElementById('a').style.display=''; A._peAct('pekset',{k:'K'})"); t(500)
    ev("(()=>{const s=A.shadowRoot.querySelector('#modal #pek_fd'); s.value=''; s.dispatchEvent(new Event('change',{bubbles:true}));})()")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('back to settings value', 'fd' not in ev("A._db.pk.K"))
    ok('no errors', not errs, errs)
    b.close()
