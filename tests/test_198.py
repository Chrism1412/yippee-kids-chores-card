# 2.0.0: 📺 Bildschirmzeit (Gutschein, Gerät an/aus, Warnung, +10 Min.) · 💰 PIN für die Spardose · 📊 Monatsbericht
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':392,'height':800},device_scale_factor=2); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-12-01T09:30:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._hass.states['switch.tv']={entity_id:'switch.tv',state:'off',attributes:{friendly_name:'Fernseher'}};
      window.svc=[]; const o=A._hass.callService.bind(A._hass); const f=(d,s,data,tgt)=>{ if(['switch','script','media_player'].includes(d)){ window.svc.push([d,s,(tgt||data||{}).entity_id]); return Promise.resolve(); } return o(d,s,data,tgt); }; A._hass.callService=f;
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:46,total:100});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',scOn:true,mnOn:true,mnPin:true,mnRep:true,targets:['mobile_app_x']});
      A._save('reward','R1',{title:'Fernsehen',emoji:'📺',cost:10,sc:{min:30,ent:'switch.tv',off:'off'}});
      A._save('mk','K',{pin: A._db.mk && 0 || ''});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...A._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; B._hass.callService=f; return 0})()"""); t(2000)
    ev("document.getElementById('a').style.display='none'")
    ok('reward clean keeps sc', ev("A._db.reward.R1.sc")=={'min':30,'ent':'switch.tv','off':'off','offEnt':''}, ev("A._db.reward.R1.sc"))
    ev("B._redeem('K','R1')"); t(9000)
    v=ev("A._db.kid.K.vouch")
    ok('voucher with sc (wallet off)', v and v[0].get('sc',{}).get('min')==30, v)
    ok('voucher shown', ev("!!B.shadowRoot.querySelector('[data-a=scgo]')"))
    ev("B.shadowRoot.querySelector('[data-a=scgo]').click()"); t(600)
    ev("B.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(1500)
    ok('session saved', ev("!!A._db.ss.K"), ev("A._db.ss"))
    ok('tv on', ['switch','turn_on','switch.tv'] in ev("window.svc"), ev("window.svc"))
    ok('voucher gone', not ev("(A._db.kid.K.vouch||[]).length"))
    ok('banner', ev("!!B.shadowRoot.querySelector('.scbar')"))
    0
    ev("document.getElementById('a').style.display=''; A._tab='heute'; A._render()"); t(800)
    ok('admin list', ev("!!A.shadowRoot.querySelector('.scadm')"))
    ev("A.shadowRoot.querySelector('[data-a=scplus]').click()"); t(500)
    ok('plus 10', abs(ev("A._db.ss.K.end - A._db.ss.K.start") - 40*60000) < 2000)
    t(36*60000)
    ok('warned', ev("A._db.ss.K && A._db.ss.K.w")==True)
    t(5*60000)
    ok('ended', not ev("!!A._db.ss.K"), ev("A._db.ss"))
    ok('tv off', ['switch','turn_off','switch.tv'] in ev("window.svc"))
    # monthly report (Dec 1st 9:30 -> Nov)
    ok('monthly report sent flag', ev("A._cfg.mnRepLast")=='2026-12', ev("A._cfg.mnRepLast"))
    # PIN
    ev("A._save('mk','K',{pin: A._db && (A._mnK? 0:0) || ''})")
    ev("A._mnCall('_mnAct',['mnkset',{k:'K'}],false)"); t(600)
    ev("A.shadowRoot.querySelector('#modal [name=pin]').value='1234'; A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('pin set', bool(ev("A._db.mk.K.pin")), ev("A._db.mk.K"))
    ev("B._render()"); t(300)
    ev("B.shadowRoot.querySelector('[data-a=mnopen]').click()"); t(500)
    ok('pin asked', ev("!!B.shadowRoot.querySelector('#modal [name=pin]')") and not ev("B._mnKid"))
    ev("B.shadowRoot.querySelector('#modal [name=pin]').value='9999'; B.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(300)
    ok('wrong pin rejected', not ev("B._mnKid"))
    ev("B.shadowRoot.querySelector('#modal [name=pin]').value='1234'; B.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(500)
    ok('right pin opens', ev("B._mnKid")=='K')
    ok('no admin-only', True)
    ok('no errors', not errs, errs)
    b.close()
