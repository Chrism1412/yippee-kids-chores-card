from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-08T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    t=lambda ms=400: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._save('kid','K',{name:'Kai',emoji:'🐻',points:10,total:10})"); t(400)
    ok('off by default', 'data-a="behav"' not in ev("A.shadowRoot.innerHTML"))
    ev("A._setCfg({behavOn:true,behavPlus:2})"); t(300)
    ok('only smile', ev("A.shadowRoot.querySelectorAll('[data-a=behav]').length")==1)
    ev("A.shadowRoot.querySelector('[data-a=behav][data-n=\"1\"]').click()"); t(500)
    k=ev("A._db.kid.K"); ok('+2', k['points']==12 and k['ledger'][0]['r']=='😊 Artig', [k['points'], k['ledger'][0]])
    ev("A._setCfg({behavMinus:true,behavMinusN:3})"); t(300)
    ev("A.shadowRoot.querySelector('[data-a=behav][data-n=\"-1\"]').click()"); t(500)
    k=ev("A._db.kid.K"); ok('-3', k['points']==9 and k['ledger'][0]['r']=='😠 Unartig' and k['total']==12, [k['points'],k['total']])
    ev("A._setCfg({lang:'en'})"); t(500); pg.wait_for_timeout(1500); t(300)
    ok('reason translated', ev("A._reasonT('😊 Artig')")!='😊 Artig', ev("A._reasonT('😊 Artig')"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
