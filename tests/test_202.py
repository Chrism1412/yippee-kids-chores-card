# 2.0.0: 🗺️ Abenteuer (Jump & Run) – Karte, Freischalten, Kronen, Tageslimit, alle 10 Level mit einem einfachen Bot schaffbar ·
#        🕐 Uhr · 🔤 Buchstaben · 🪙 Geld · 🧩 Puzzle · 🌈 Farben merken · 🔊 Vorlesen
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
BOT = """(()=>{const S=B._jr; if(!S||!S.test) return 'none'; const t=S.test, P=t.P, m=t.map, R=m.length; t.keys.r=true;
  const at=(x,y)=> (y>=0&&y<R&&x>=0&&x<m[0].length)? m[y][x] : ' ';
  const solid=(x,y)=> at(x,y)==='#';
  if(!P.ground) return 'air';
  if(t.foes.some(e=>e.alive && e.x-P.x>-0.3 && e.x-P.x<1.9 && Math.abs(e.y-P.y)<1)) { t.jump(); return 'foe'; }
  const foot=Math.floor(P.y+P.h-0.01), feetRow=foot+1;
  for(let d=1; d<=2; d++){ const c=Math.floor(P.x+P.w+d*0.55);
    if(solid(c,foot)||solid(c,foot-1)) { t.jump(); return 'wall'; }
    if(at(c,foot)==='^') { t.jump(); return 'spike'; }
    let fl=false; for(let y=feetRow;y<R;y++){ if(solid(c,y)||at(c,y)==='-') {fl=true;break;} }
    if(!fl && !t.movers.some(mv=>c>=mv.x-0.5&&c<=mv.x+mv.w+0.5)) { if(d===1){ t.jump(); return 'gap'; } }
  }
  if(t.foes.some(e=>e.alive && e.x-P.x>0 && e.x-P.x<1.9 && Math.abs(e.y-P.y)<1)) { t.jump(); return 'foe'; }
  return 'run'; })()"""
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':760,'height':600}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:46,total:330,order:1,by:2018,bm:3,bd:1});
      A._setCfg({approval:false,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',gs:{puzzle:{size:3}}});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    ev("document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(1200)
    ev("B.shadowRoot.querySelector('[data-a=pegames]').click()"); t(800)
    ok('menu: adventure button with pet name', 'Flockes Abenteuer' in ev("B.shadowRoot.querySelector('.gmov .gmjr').textContent"))
    ok('menu: 18 games', ev("B.shadowRoot.querySelectorAll('.gmov .gmmenu [data-g=play]').length")==18)
    # 🔊 Vorlesen
    ev("(()=>{window._said=[]; B._sayDev=(x)=>window._said.push(x); return 1})()")
    ev("B._gmStart('K','clock')"); t(800)
    ev("B.shadowRoot.querySelector('.gmov [data-g=say]').click()"); t(100)
    ok('speaker reads question', any(('spät' in x or 'Uhr' in x or 'lange' in x) and '?' in x for x in ev("window._said")), ev("window._said"))
    for g in ['abc','money','puzzle','simon','count','math']:
        ev(f"B._gmStart('K','{g}')"); t(1500)
        ok(f'{g} renders', not errs and (ev("!!B.shadowRoot.querySelector('.gmov .gmans,.gmov .gmpz,.gmov .gmsong')")), errs[-1:])
    ev("B._gmStart('K','abc')"); t(800)
    ev("B.shadowRoot.querySelector('.gmov [data-g=say]').click()"); t(100)
    ok('abc speaker', any('Buchstabe' in x or 'schreibt' in x for x in ev("window._said")), ev("window._said")[-1:])
    ev("B._gmStart('K','money')"); t(800)
    ok('money in euro', '€' in ev("B.shadowRoot.querySelector('.gmov .gmans').textContent"))
    for i in range(5):
        ev("B.shadowRoot.querySelector('.gmov [data-ok=\"1\"]').click()"); t(800)
    t(800)
    ok('money: 5 right → end', 'Geld zählen' in ev("B.shadowRoot.querySelector('.gmov').textContent") and ev("!!B.shadowRoot.querySelector('.gmov .gmend')"))
    # Puzzle lösen über die interne Lösung: rückwärts geht nicht → nur Zug-Mechanik prüfen
    ev("B._gmStart('K','puzzle')"); t(600)
    n0=ev("B.shadowRoot.querySelectorAll('.gmov .gmpz button').length")
    ok('puzzle 8 tiles', n0==8)
    # ⭐ Sterne sammeln (Einhorn/Held): Tier folgt dem Finger
    ev("B._gmStart('K','fly')"); t(800)
    y0=ev("parseFloat(B.shadowRoot.querySelector('.gmov .gmpet').style.top)")
    box=ev("(()=>{const r=B.shadowRoot.querySelector('.gmov .gmar').getBoundingClientRect(); return [r.left,r.top,r.width,r.height]})()")
    pg.mouse.move(box[0]+box[2]/2, box[1]+90); pg.mouse.down(); t(800)
    y1=ev("parseFloat(B.shadowRoot.querySelector('.gmov .gmpet').style.top)")
    pg.mouse.move(box[0]+box[2]/2, box[1]+box[3]-60); t(800)
    y2=ev("parseFloat(B.shadowRoot.querySelector('.gmov .gmpet').style.top)")
    pg.mouse.up(); t(600)
    ok('fly: pet follows finger up and down', y1 < y0 - 40 and y2 > y1 + 80, [y0,y1,y2])
    ev("B._gmClose(); B._gmMenu('K')"); t(300)
    # ---------- Abenteuer ----------
    ev("B._gmMenu('K')"); t(300)
    ev("B.shadowRoot.querySelector('.gmov [data-g=jr]').click()"); t(300); pg.wait_for_timeout(400); t(300)
    ok('cover first', ev("!!B.shadowRoot.querySelector('.gmov .jrcov [data-g=jrstart]')"))
    ev("B.shadowRoot.querySelector('.gmov [data-g=jrstart]').click()"); t(300)
    ok('map 10 levels, only 1 open', ev("B.shadowRoot.querySelectorAll('.gmov [data-g=jrgo]').length")==10 and ev("B.shadowRoot.querySelectorAll('.gmov [data-g=jrgo]:not([disabled])').length")==1)
    ok('no tts button in adventure', not ev("!!B.shadowRoot.querySelector('.gmov [data-g=say]')"))
    ev("A._setCfg({peJrLim:'0'})"); t(200)
    res=[]
    for n in range(1,11):
        ev(f"B._jrPlay('K',{n})"); t(400)
        if not ev("!!B._jr"): res.append((n,'nostart')); continue
        steps=0
        while steps<4000 and not ev("B._jr && B._jr.test.won"):
            ev(BOT); t(50); steps+=1
            if not ev("!!B._jr"): break
            if ev("B._jr.test.over"): t(2000)
        won=ev("B._jr && B._jr.test.won"); hurts=ev("B._jr && B._jr.test.hurts")
        res.append((n, won, hurts, round(steps*0.05)))
    ok('all 10 levels completable by bot', all(r[1] is True for r in res), res)
    ok('progress saved: level 10 unlocked + crowns', ev("A._db.pk.K.jr.u")==10 and len(ev("A._db.pk.K.jr.c"))==10, ev("A._db.pk.K.jr"))
    # Tageslimit
    ev("A._setCfg({peJrLim:'1'}); A._save('pk','K',{...A._db.pk.K,d:{d:'2026-11-25',f:0,b:0,g:0,gs:0,a:1}})"); t(300)
    ev("B._jrMap('K')"); t(300)
    ok('daily limit: levels locked', ev("B.shadowRoot.querySelectorAll('.gmov [data-g=jrgo]:not([disabled])').length")==0 and 'müde' in ev("B.shadowRoot.querySelector('.gmov').textContent"))
    ok('clean jr', ev("A._clean('pk',{id:'K',jr:{u:99,c:{1:9,'x':2},ctl:'zz'}}).jr")=={'u':10,'c':{'1':3},'ctl':'e'})
    ev("B._gmClose()"); t(300)
    ok('no errors', not errs, errs)
    b.close()
