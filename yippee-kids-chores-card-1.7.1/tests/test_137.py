from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script("window.__api=[]")
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-08T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(300)
    t=lambda ms=400: pg.clock.run_for(ms); ev=pg.evaluate
    # Nicht-Admin
    ev("""(()=>{const h=A._hass; h.user={id:'kid1',name:'Kind',is_admin:false};
      h.callApi=async(m,p)=>{window.__api.push(m+' '+p); if(/^(states|config)/.test(p)) throw new Error('401'); return [];};
      h.fetchWithAuth=async(u)=>{window.__api.push('FETCH '+u); return {ok:false,status:401};};
      A._autoChecked=false; A._sensorFail=false; B._autoChecked=false;})()""")
    ev("A._save('kid','K',{name:'Lykke',emoji:'🦊',points:5})"); t(800)
    ev("A._save('task','T',{title:'Bett',emoji:'🛏️',points:1,kids:['K'],sched:'week',days:[],photo:true})"); t(800)
    ev("A._pushSensors(); B._pushSensors(); A._autoStatus(); A.shadowRoot.querySelector('[data-a=\"tab\"][data-id=\"einst\"]').click()"); t(1500)
    ev("A._autoCreate('bg', true)"); t(300)
    ev("A._uploadPhoto(new Blob(['x'],{type:'image/jpeg'}),'x.jpg').catch(()=>{})"); t(500)
    bad=[x for x in ev("window.__api") if x.startswith('POST states') or 'config/automation' in x or 'upload' in x]
    ok('no admin-only REST calls', not bad, bad)
    # Admin weiterhin
    ev("A._hass.user={id:'p',name:'Papa',is_admin:true}; A._sensorFail=false; A._sensSig={}; A._pushSensors()"); t(300)
    ok('admin pushes sensors', any(x.startswith('POST states/sensor.yippee_lykke') for x in ev("window.__api")))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
