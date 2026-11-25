# 2.0.0: 🪙 Taler fürs Haustier-Zuhause – aus Spielen, Abenteuer und Taler-Belohnungen
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:40,total:330,order:1});
      A._setCfg({approval:true,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',peJrLim:'0',new20ok:true});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,lv:'2',jr:{u:10,c:{},ctl:'e'}});
      A._save('reward','R1',{title:'Taler-Paket',emoji:'🪙',cost:5,tl:30});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    sb="B.shadowRoot"
    ev("document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(800)
    tl=lambda: ev("Number((A._db.pk.K||{}).tl)||0")
    def start(gm): ev("B._gmClose && B._gmClose()"); t(200); ev(f"{sb}.querySelector('[data-a=pegames]').click()"); pg.wait_for_timeout(200); t(300); ev(f"{sb}.querySelector('.gmov [data-v={gm}]').click()"); t(800)
    # ohne Zuhause: keine Taler
    start('count'); ev("B._gm.score=6; B._gmEnd(true)"); t(1200)
    ok('no Taler while home is off', tl()==0 and not ev(f"!!{sb}.querySelector('.gmov .gmtl')"))
    ev("A._setCfg({peHome:true})"); t(600)
    start('count'); ev("B._gm.score=6; B._gmEnd(true)"); t(1200)
    ok('learning game: 1 Taler per right answer', tl()==6 and '+6' in ev(f"{sb}.querySelector('.gmov .gmtl').textContent"), tl())
    start('catch'); ev("B._gm.score=23; B._gmEnd(true)"); t(1200)
    ok('skill game: points / 5', tl()==11, tl())
    start('count'); ev("B._gm.score=99; B._gmEnd(true)"); t(1200)
    ok('at most 20 per round', tl()==31, tl())
    ok('stars untouched by games', ev("A._db.kid.K.points")==40)
    # 🏃 Abenteuer
    ev("B._gmClose && B._gmClose()"); t(200); ev(f"{sb}.querySelector('[data-a=pegames]').click()"); pg.wait_for_timeout(300); t(300)
    ev(f"{sb}.querySelector('.gmov [data-g=jr]').click()"); pg.wait_for_timeout(500); t(500)
    ev("B._jrPlay('K',1)"); t(400); t0=tl()
    ev("B._jr.test.finish()"); t(1500)
    ok('adventure: Taler at the goal', tl()>=t0+1 and '🪙' in ev(f"{sb}.querySelector('.gmov').textContent"), (t0, tl()))
    ev("B._gmClose && B._gmClose()"); t(300)
    # 🎁 Taler-Belohnung (Eltern lösen ein)
    ok('reward clean keeps tl, caps 500', ev("A._clean('reward',{id:'X',title:'a',cost:1,tl:900}).tl")==500 and ev("A._clean('reward',{id:'X',title:'a',cost:1,tl:0}).tl")==None)
    t1=tl(); ev("A._redeem('K','R1',null,{got:true})"); pg.wait_for_timeout(600); t(1500)
    ok('reward: real ⭐ swapped for Taler', ev("A._db.kid.K.points")==35 and tl()==t1+30, (ev("A._db.kid.K.points"), t1, tl()))
    # ⭐ → 🪙 höchstens 10 Sterne pro Tag (Standard), einstellbar
    ev("A._redeem('K','R1',null,{got:true})"); pg.wait_for_timeout(600); t(1500)
    ok('2nd swap today (10 ⭐) ok', ev("A._db.kid.K.points")==30, ev("A._db.kid.K.points"))
    ev("A._redeem('K','R1',null,{got:true})"); pg.wait_for_timeout(600); t(1500)
    ok('3rd swap blocked: max 10 ⭐ per day', ev("A._db.kid.K.points")==30, ev("A._db.kid.K.points"))
    ev("A._setCfg({tlMax:0})"); t(400); ev("A._redeem('K','R1',null,{got:true})"); pg.wait_for_timeout(600); t(1500)
    ok('no limit when set to 0', ev("A._db.kid.K.points")==25, ev("A._db.kid.K.points"))
    ev("A._setCfg({tlMax:5})"); t(400)
    # 🏠 Laden zeigt Taler-Stand
    ev("B._render()"); t(800)
    ok('home button shows Taler', f'🪙 {tl()}' in ev(f"{sb}.querySelector('[data-a=pehome]').textContent"), ev(f"{sb}.querySelector('[data-a=pehome]').textContent"))
    ev(f"{sb}.querySelector('[data-a=pehome]').click()"); t(1500)
    n=tl(); ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=tv]').click()"); t(300); ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=tv]').click()"); t(800)
    ok('shop pays with Taler', tl()==n-20 and ev("A._db.kid.K.points")==25, (n, tl()))
    ok('price settings show the cap select', 'value="5" selected' in ev("B._phPriceHtml()"))
    ev("A._setCfg({tlMax:10})"); t(400)
    ok('Taler reward never shared', ev("(()=>{A._setCfg({shareOn:true}); const c=A._clean('reward',{id:'X',title:'a',cost:4,tl:10,share:true,shareKids:['K']}); return !c.share && !c.shareKids && !A._shareOn({share:true,tl:5,title:'a',cost:4})})()"))
    ok('pk clean keeps tl', ev("A._clean('pk',{id:'K',tl:12}).tl")==12)
    ok('no page errors', not errs, errs)
