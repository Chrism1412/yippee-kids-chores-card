# 2.0.0: 👨‍👩‍👧 Familienziel von Hand korrigieren – −10/−1/+1/+10 (nur Eltern) mit Verlauf der letzten Korrekturen
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
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:30,order:1});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',fam:{title:'Freizeitpark',emoji:'🎢',cost:100,pts:40,reached:false}});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    ev("document.getElementById('b').style.display='none'; A._tab='belohnungen'; A._render()"); t(600)
    if not ev("!!A.shadowRoot.querySelector('[data-a=famfix]')"):
        tabs=ev("[...A.shadowRoot.querySelectorAll('[data-tab]')].map(x=>x.dataset.tab)")
        for tb in tabs:
            ev(f"A._tab='{tb}'; A._render()"); t(200)
            if ev("!!A.shadowRoot.querySelector('[data-a=famfix]')"): break
    ok('four correction buttons', ev("A.shadowRoot.querySelectorAll('[data-a=famfix]').length")==4)
    fx=lambda v: (ev(f"A.shadowRoot.querySelector('[data-a=famfix][data-v=\"{v}\"]').click()"), t(400))
    fx(10); ok('+10 → 50', ev("A._cfg.fam.pts")==50)
    fx(-1); ok('−1 → 49', ev("A._cfg.fam.pts")==49)
    ok('history with 2 entries', len(ev("A._cfg.fam.log"))==2 and ev("A._cfg.fam.log[1]")['a']==50 and ev("A._cfg.fam.log[1]")['b']==49)
    ok('history shown', '50 → 49' in ev("A.shadowRoot.querySelector('.famlog').textContent"))
    for _ in range(6): fx(-10)
    ok('never below 0', ev("A._cfg.fam.pts")==0)
    ev("A._setCfg({fam:{...A._cfg.fam,pts:95}})"); t(300); fx(10)
    ok('reaching by correction: reached, no celebration', ev("A._cfg.fam.reached") and ev("A._cfg.fam.pts")==105 and not ev("!!A.shadowRoot.querySelector('.celeb,.cele')"))
    fx(-10); ok('below again: not reached', not ev("A._cfg.fam.reached"))
    ok('no entry when nothing changed (0 − 10)', len(ev("A._cfg.fam.log"))==9, len(ev("A._cfg.fam.log")))
    fx(1); fx(1); fx(1)
    ok('history keeps the last 10', len(ev("A._cfg.fam.log"))==10 and ev("A._cfg.fam.log[0]")['a']==49)
    ok('clean log', ev("A._clean('cfg',{id:'main',fam:{cost:10,pts:1,log:[{t:5,a:'3',b:-2},{x:1}]}}).fam.log")==[{'t':5,'a':3,'b':0}])
    # Dialog „Bereits gesammelt“ schreibt auch in den Verlauf
    ev("A._editFamily()"); t(400)
    ev("(()=>{const i=A.shadowRoot.querySelector('#modal [name=fpts]'); i.value='60'; i.dispatchEvent(new Event('input',{bubbles:true}));})()")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(500)
    ok('dialog correction logged', ev("A._cfg.fam.pts")==60 and ev("A._cfg.fam.log[A._cfg.fam.log.length-1]")['b']==60)
    # Kinder dürfen nicht korrigieren
    ev("document.getElementById('a').style.display='none'; document.getElementById('b').style.display=''"); t(200)
    ev("B._famFix(10)"); t(300)
    ok('kid cannot correct', ev("A._cfg.fam.pts")==60)
    ok('no errors', not errs, errs)
    b.close()
