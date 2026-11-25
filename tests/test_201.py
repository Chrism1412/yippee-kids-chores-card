# 2.0.0: 📱 Ein Kind pro Seite (Wischen, Leiste, merken) · 🔢 Fragen pro Runde je Kind und „wie beim Kind“ ·
#        💤 schlafendes Haustier ohne Knöpfe · ⚽ Ball überlebt das Neuzeichnen · ☂️ Schirm über dem Kopf
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':392,'height':860}, has_touch=True); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._hass.states['weather.home']={entity_id:'weather.home',state:'rainy',attributes:{}};
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:330,order:1}); A._save('kid','B2',{name:'Ben',emoji:'🐻',points:3,total:330,order:2});
      A._save('task','T1',{title:'Rechnen üben',emoji:'🧮',points:2,kids:['K','B2'],sched:'week',days:[],created:'2026-10-01',game:{g:'math',n:0}});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',peWx:'weather.home'});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,qn:7}); A._save('pk','B2',{on:true,kind:'cat',name:'Mimi',t0:0,s:3,h:true,qn:12});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kids'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    ev("document.body.style.gridTemplateColumns='1fr'; document.getElementById('a').style.display='none'")
    # ---------- Ein Kind pro Seite ----------
    ok('default: grid with both kids', ev("B.shadowRoot.querySelectorAll('.kgrid').length")==1 and not ev("!!B.shadowRoot.querySelector('.kpage')"))
    ev("A._setCfg({kPages:true}); B._render()"); t(600)
    ok('pages: bar with 2 kids + 1 page', ev("B.shadowRoot.querySelectorAll('.kpt').length")==2 and ev("B.shadowRoot.querySelectorAll('.kpage').length")==1)
    ok('first kid shown', 'Mia' in ev("B.shadowRoot.querySelector('.kpage').textContent") and 'Ben' not in ev("B.shadowRoot.querySelector('.kpage').textContent"))
    ev("B.shadowRoot.querySelector('.kpt[data-k=B2]').click()"); t(400)
    ok('tap tab → Ben', 'Hallo Ben' in ev("B.shadowRoot.querySelector('.kpage').textContent") or 'Ben' in ev("B.shadowRoot.querySelector('.kpage').textContent"))
    ok('remembered per device', ev("localStorage.getItem('yippee_page_todo.kinderpunkte')")=='B2')
    # Wischen nach rechts → zurück zu Mia (ringförmig)
    box=ev("(()=>{const r=B.shadowRoot.querySelector('.kpage').getBoundingClientRect(); return [r.left,r.top,r.width,r.height]})()")
    def swipe(dx):
        x=box[0]+box[2]/2; y=box[1]+min(200,box[3]/2)
        ev(f"""(()=>{{const el=B.shadowRoot.querySelector('.kpage'); const mk=(x,y)=>new Touch({{identifier:1,target:el,clientX:x,clientY:y}});
          el.dispatchEvent(new TouchEvent('touchstart',{{bubbles:true,composed:true,touches:[mk({x},{y})],changedTouches:[mk({x},{y})]}}));
          el.dispatchEvent(new TouchEvent('touchend',{{bubbles:true,composed:true,touches:[],changedTouches:[mk({x+dx},{y+5})]}}));}})()""")
        t(500)
    swipe(140)
    ok('swipe right → Mia', ev("B._pgKid")=='K' and 'Mia' in ev("B.shadowRoot.querySelector('.kpage').textContent"), ev("B._pgKid"))
    swipe(-140)
    ok('swipe left → Ben', ev("B._pgKid")=='B2')
    swipe(-20)
    ok('tiny swipe ignored', ev("B._pgKid")=='B2')
    # 👆 echtes Wischen wie am Handy (CDP-Touch mit Bewegung) – auch wenn die Karte währenddessen neu zeichnet
    cdp=pg.context.new_cdp_session(pg)
    def realswipe(dx, rerender=False, steps=6):
        r=ev("(()=>{const r=B.shadowRoot.querySelector('.kpage').getBoundingClientRect(); return [r.left,r.top,r.width,r.height]})()")
        x=r[0]+r[2]/2; y=r[1]+min(150,r[3]/2)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
        if rerender: ev("B._render()")
        for i in range(1,steps+1):
            cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*i/steps,'y':y+2}]}); t(16)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]}); t(500)
    k0=ev("B._pgKid"); realswipe(-150)
    ok('real finger swipe left → other kid', ev("B._pgKid")!=k0, [k0, ev("B._pgKid")])
    k1=ev("B._pgKid"); realswipe(150, rerender=True)
    ok('real swipe while the card re-renders', ev("B._pgKid")!=k1, [k1, ev("B._pgKid")])
    k2=ev("B._pgKid"); realswipe(-30)
    ok('real short move ignored', ev("B._pgKid")==k2)
    # 🖱️ PC: mit gedrückter Maustaste ziehen (echte Maus) – danach kein Klick auf eine Aufgabe
    box=ev("(()=>{const r=B.shadowRoot.querySelector('.kpage').getBoundingClientRect(); return [r.left,r.top,r.width,r.height]})()")
    x=box[0]+box[2]/2; y=box[1]+min(120,box[3]/2)
    pts=ev("[B._db.kid.K.points,B._db.kid.B2.points]"); ev("B._kPageGo('B2')"); t(300)
    pg.mouse.move(x+120,y); pg.mouse.down(); pg.mouse.move(x,y,steps=5); pg.mouse.move(x-120,y+4,steps=5); pg.mouse.up(); t(500)
    ok('mouse drag left → next kid', ev("B._pgKid")=='K', ev("B._pgKid"))
    ok('drag did not tick a chore', ev("[B._db.kid.K.points,B._db.kid.B2.points]")==pts)
    # Touchpad: zwei Finger seitlich (Wheel mit deltaX)
    wh=lambda dx,dy: ev(f"B.shadowRoot.querySelector('.kpage .card').dispatchEvent(new WheelEvent('wheel',{{deltaX:{dx},deltaY:{dy},bubbles:true,composed:true,cancelable:true}}))")
    for i in range(4): wh(40,0); t(30)
    t(500)
    ok('touchpad swipe → next kid', ev("B._pgKid")=='B2', ev("B._pgKid"))
    for i in range(4): wh(40,0); t(30)
    t(200)
    ok('touchpad: one page per gesture', ev("B._pgKid")=='B2')
    t(900); wh(5,200); wh(5,200); wh(5,200); t(300)
    ok('vertical scroll does not switch', ev("B._pgKid")=='B2')
    ok('dots', ev("B.shadowRoot.querySelectorAll('.kpdots i').length")==2 and ev("B.shadowRoot.querySelectorAll('.kpdots i.on').length")==1)
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',pages:false}); B._render()"); t(500)
    ok('card option pages:false wins', not ev("!!B.shadowRoot.querySelector('.kpage')"))
    ev("A._setCfg({kPages:false}); B.setConfig({storage:'todo.kinderpunkte',mode:'kids',pages:true}); B._render()"); t(500)
    ok('card option pages:true', ev("!!B.shadowRoot.querySelector('.kpage')"))
    # ---------- Fragen pro Runde ----------
    ok('clean qn + task n=0', ev("A._db.pk.K.qn")==7 and ev("A._db.task.T1.game")=={'g':'math','n':0} and ev("A._clean('pk',{id:'K',qn:99}).qn")==30)
    ev("B._pgKid='K'; B._render()"); t(500)
    ev("B.shadowRoot.querySelector('.tile[data-t=T1] [data-a=pegmgo], [data-a=pegmgo][data-k=K]').click()"); t(1200)
    ok('task with "wie beim Kind" → 7 questions for Mia', ev("B._gm && B._gm.task && B._gm.task.n")==7, ev("B._gm && B._gm.task"))
    for i in range(7):
        ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(800)
    t(1500)
    ok('Mia task done after 7', ev("B._status(A._db.task.T1,'K').s")=='d')
    ev("B._gmClose && B._gm && B._gmClose()"); t(300)
    ev("B._gmStart('B2','count')"); t(500)
    ok('leisure: Ben 12 questions', ev("B._gm.n || 0")==12 or '12' in str(ev("B._gmQn('B2')")), ev("B._gmQn('B2')"))
    ev("B._gmClose()"); t(300)
    # ---------- Ball überlebt Neuzeichnen, Schirm ----------
    ev("B._peKid='K'; B._render()"); t(1500)
    ok('umbrella drawn over head (svg, no emoji)', '#9775fa' in ev("B.shadowRoot.querySelector('.pest.lg').innerHTML") and '☂️' not in ev("B.shadowRoot.querySelector('.pest.lg').innerHTML"))
    ev("B.shadowRoot.querySelector('[data-a=peplay]').click()"); t(300)
    ok('ball shown', ev("!!B.shadowRoot.querySelector('.pest.lg .petoy')"))
    ev("B._render()"); t(200)
    ok('ball survives re-render', ev("!!B.shadowRoot.querySelector('.pest.lg .petoy')") and ev("B.shadowRoot.querySelector('.pest.lg .petoy').style.animationDelay").startswith('-'))
    t(4500)
    ok('ball gone afterwards', not ev("!!B.shadowRoot.querySelector('.pest.lg .petoy')"))
    # ---------- Schlafen ----------
    ev("A._setCfg({peN0:'14:00',peN1:'16:30'}); B._render()"); t(800)
    ok('sleeping: no action buttons', not ev("!!B.shadowRoot.querySelector('.peacts')") and '16:30' in ev("B.shadowRoot.querySelector('.pezzz').textContent"))
    ok('sleeping: no umbrella', '#9775fa' not in ev("B.shadowRoot.querySelector('.pest.lg').innerHTML"))
    ev("B._peKid=null; B._render()"); t(500)
    ev("B.shadowRoot.querySelector('[data-a=pegmgo][data-k=K]') ? 0 : 0")
    ok('no errors', not errs, errs)
    b.close()
