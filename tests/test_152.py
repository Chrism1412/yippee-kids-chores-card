from playwright.sync_api import sync_playwright
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:200])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':400,'height':860}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/kp_test.html'); pg.wait_for_timeout(800); ev=pg.evaluate; t=pg.wait_for_timeout
    ev("A._setCfg({walletOn:true,approval:false}); A._save('kid','K',{name:'Mia',emoji:'🦊',points:10}); A._save('reward','R',{title:'Eis',emoji:'🍦',cost:2})"); t(1200)
    ev("A._redeem('K','R')"); t(1500)
    ev("A._tab='heute'; A._render()"); t(300)
    h=ev("A.shadowRoot.innerHTML")
    ok('box in today tab', 'noch nicht bekommen (1)' in h and 'Eis' in h and 'eingelöst am' in h)
    ev("A.shadowRoot.querySelector('.vchbox .acch').click()"); t(200)
    h=ev("A.shadowRoot.innerHTML")
    ok('collapses', 'noch nicht bekommen (1)' in h and not ev("!!A.shadowRoot.querySelector('.vchbox [data-a=vuse]')"))
    ok('remembered', ev("localStorage.getItem('kpVchShut')")=='1')
    ev("A.shadowRoot.querySelector('.vchbox .acch').click()"); t(200)
    ok('expands again', ev("!!A.shadowRoot.querySelector('.vchbox.open [data-a=vuse]')"))
    ev("A.shadowRoot.querySelector('.card [data-a=vuse]').click()"); t(200)
    ok('asks to confirm', 'Nochmal' in ev("A.shadowRoot.querySelector('.card [data-a=vuse]').textContent"))
    ev("A.shadowRoot.querySelector('.card [data-a=vuse]').click()"); t(1500)
    ok('voucher used', len(ev("A._db.kid.K.vouch||[]"))==0 and 'noch nicht bekommen' not in ev("A.shadowRoot.innerHTML"))
    ev("A._setCfg({walletOn:false})"); t(800)
    ok('hidden when off', 'noch nicht bekommen' not in ev("A.shadowRoot.innerHTML"))
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
