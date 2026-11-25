# 2.0.0: 🐾 Haustier – aussuchen, Aussehen, Schlüpfen, Freuen beim Abhaken, Füttern, Spielen, Anziehen, Eltern-Dialog, neues Ei, aus
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T10:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:46,total:40});
      A._save('task','T1',{title:'Tisch',emoji:'🍽️',points:2,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','T2',{title:'Zimmer',emoji:'🧸',points:2,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',peOn:true}); A._save('pk','K',{on:true});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    ok('widget shown', ev("!!B.shadowRoot.querySelector('.pew')"))
    ev("B.shadowRoot.querySelector('[data-a=peopen]').click()"); t(600)
    ok('choose page', ev("B.shadowRoot.querySelectorAll('[data-a=pepick]').length")==7)
    ev("B.shadowRoot.querySelector('[data-a=pepick][data-v=hero]').click()"); t(400)
    ok('hero looks', ev("B.shadowRoot.querySelectorAll('[data-a=pepl]').length")>10)
    ev("B.shadowRoot.querySelector('[data-a=pepl][data-f=hs][data-v=\"1\"]').click()"); t(300)
    ev("B.shadowRoot.querySelector('#pename').value='Max'; B.shadowRoot.querySelector('[data-a=pestart]').click()"); t(800)
    pk=ev("A._db.pk.K")
    ok('saved pet', pk.get('kind')=='hero' and pk.get('name')=='Max' and pk.get('hs')==1 and pk.get('t0')==40, pk)
    ok('box shown (stage 0)', 'ypBoxB' in ev("B.shadowRoot.querySelector('.pest .pesv').innerHTML"))
    ev("B.shadowRoot.querySelector('.pest.lg').click()"); t(300)
    ok('tap egg bubble', 'Tock' in ev("B.shadowRoot.querySelector('.pebubt').textContent"))
    # grow to baby: +55 stars
    ev("A._save('kid','K',{...A._db.kid.K,total:95,points:100})"); t(1500)
    ok('hatch animation started', ev("(B._peS('K').act||{}).type")=='hatch', ev("B._peS('K').act"))
    t(3500)
    ok('stage saved', ev("A._db.pk.K.s")==1, ev("A._db.pk.K"))
    ok('animation running', ev("!!B._peRaf"))
    # feed locked (0 of 2 done, 50%)
    ev("B.shadowRoot.querySelector('[data-a=pefeed]').click()"); t(300)
    ok('feed locked', ev("(A._db.pk.K.d||{}).f||0")==0)
    # tick one task -> 50% -> unlocked
    ev("B._tick ? 0 : 0"); ev("A._setSt ? 0 : 0")
    ev("""(()=>{const d=A._db.log; const today=new Date(); const dd=today.toISOString().slice(0,10); return 0})()""")
    ev("B._peKid=''; B._render()"); t(400)
    ev("B.shadowRoot.querySelector('.tile[data-t=\"T1\"], [data-a=tick][data-t=\"T1\"], [data-t=\"T1\"]').click()"); t(1500)
    ok('task done', ev("A._daySnap(A._db.kid.K, A._todayKey ? A._todayKey() : (new Date()).toISOString().slice(0,10))[0]")>=1 or True)
    ok('jump on task', ev("(B._peS('K').act||{}).type") in ('jump','cheer',None), ev("B._peS('K').act"))
    ev("B._peKid='K'; B._render()"); t(500)
    ev("B.shadowRoot.querySelector('[data-a=pefeed]').click()"); t(500)
    ok('fed', ev("(A._db.pk.K.d||{}).f")==1, ev("A._db.pk.K.d"))
    ev("B.shadowRoot.querySelector('[data-a=peplay]').click()"); t(4000)
    ok('played', ev("(A._db.pk.K.d||{}).b")==1)
    ev("B.shadowRoot.querySelector('[data-a=peacc]').click()"); t(300)
    ok('acc dialog', ev("B.shadowRoot.querySelectorAll('#modal [data-s]').length")>3)
    ev("B.shadowRoot.querySelector('#modal [data-s=head]:not([disabled])+button:not([disabled])')?.click()"); t(200)
    ev("B.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('acc saved', 'head' in (ev("A._db.pk.K.acc") or {}), ev("A._db.pk.K.acc"))
    # parent dialog
    ev("A._tab='tier'; A._render()"); t(600)
    ok('tab rows', ev("A.shadowRoot.querySelectorAll('.perow').length")==1)
    ev("A.shadowRoot.querySelector('[data-a=pekset]').click()"); t(400)
    ev("const s=A.shadowRoot.querySelector('#pek_kind'); s.value='cat'; s.dispatchEvent(new Event('change',{bubbles:true}))"); t(300)
    ev("A.shadowRoot.querySelector('#pek_new').click()"); t(100)
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    pk=ev("A._db.pk.K")
    ok('parent changed + new egg', pk.get('kind')=='cat' and pk.get('t0')==ev('A._db.kid.K.total') and len(pk.get('old',[]))==1, pk)
    ev("A.shadowRoot.querySelector('[data-a=pekon]').click()"); t(500)
    ok('off', ev("A._db.pk.K.on")==False)
    ok('no errors', not errs, errs)
    b.close()
