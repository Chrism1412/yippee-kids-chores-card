# 2.0.0: 🗺️ Abenteuer – Stufe „🔥 Schwer“ (Spezial-Gegner, 2 Herzen), 🎁 Bonus-Kisten (+3 ⭐), längere Level
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
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,jr:{u:10,c:{},ctl:'e'}});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    sb="B.shadowRoot"
    ev("document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(800)
    ev(f"{sb}.querySelector('[data-a=pegames]').click()"); pg.wait_for_timeout(300); t(500)
    ev(f"{sb}.querySelector('.gmov [data-g=jr]').click()"); pg.wait_for_timeout(500); t(500)
    ev(f"{sb}.querySelector('.gmov [data-g=jrstart]').click()"); t(400)
    ok('map: three levels of difficulty', ev(f"{sb}.querySelectorAll('.gmov [data-g=jrctl]').length")==3)
    ev(f"{sb}.querySelector('.gmov [data-g=jrctl][data-v=h]').click()"); t(400)
    ok('hard chosen + hint', ev("A._db.pk.K.jr.ctl")=='h' and '2' in ev(f"{sb}.querySelector('.gmov .jrmap .hint').textContent"), ev("JSON.stringify(A._db.pk.K.jr)"))
    lens=[]; boxes=[]; kinds=set(); fl=[]
    for n in range(1,11):
        ev(f"B._jrPlay('K',{n})"); t(300)
        lens.append(ev("B._jr.test.map[0].length")); boxes.append(ev("B._jr.test.nBox")); fl.append(ev("B._jr.test.flags.length"))
        for k in ev("B._jr.test.foes.map(e=>e.k)"): kinds.add(k)
    ok('levels longer (≥ 150 columns)', min(lens)>=150, lens)
    ok('every level has bonus boxes', min(boxes)>=2, boxes)
    ok('hard: special enemies (hopper, runner, hedgehog, flyer)', {'h','f','s','y'} <= kinds, kinds)
    ev("B._jrPlay('K',1)"); t(300)
    ok('hard: 2 hearts', ev("B._jr.test.hp")==2)
    ok('hard: small moving platforms', all(m['w']<=2.0 for m in ev("B._jr.test.movers")) if ev("B._jr.test.movers.length") else True)
    ev("B._jrPlay('K',5)"); t(300)
    ok('hard: platforms on world 3 small', ev("B._jr.test.movers.length")>0 and all(m['w']<=2.0 for m in ev("B._jr.test.movers")))
    # 🎁 Kiste anstoßen
    ev("(()=>{const T=B._jr.test; const m=T.map; let bx=-1; for(let c=0;c<m[7].length;c++) if(m[7][c]==='B'){bx=c;break;} T.foes.forEach(e=>e.alive=false); T.P.x=bx+0.15; T.P.y=9.14; T.P.vx=0; T.P.vy=0; T.P.inv=5; window._bx=bx; return bx})()"); t(300)
    s0=int(ev(f"{sb}.querySelector('.jrco').textContent"))
    ev("B._jr.test.keys.j=true; B._jr.test.jump()"); t(900); ev("B._jr.test.keys.j=false"); t(300)
    ok('box hit from below: +3 stars, box empty', int(ev(f"{sb}.querySelector('.jrco').textContent"))==s0+3 and ev("B._jr.test.map[7][window._bx]")=='U' and ev("B._jr.test.boxes")==1, (s0, ev(f"{sb}.querySelector('.jrco').textContent"), ev("B._jr.test.map[7][window._bx]")))
    ev("B._jr.test.keys.j=true; B._jr.test.jump()"); t(900); ev("B._jr.test.keys.j=false"); t(300)
    ok('empty box gives nothing', int(ev(f"{sb}.querySelector('.jrco').textContent"))==s0+3)
    # ⤒⤒ hohe Ebene: Brett in Zeile 6 mit Kiste in Zeile 2 – nur mit Doppelsprung
    hi=[]
    for n in range(1,11):
        ev(f"B._jrPlay('K',{n})"); t(200)
        hi.append(ev("(()=>{const m=B._jr.test.map; let k=0; for(let c=0;c<m[2].length;c++) if(m[2][c]==='B' && m[6][c]==='-') k++; return k})()"))
    ok('hard: high ledges with boxes in every level', min(hi)>=1, hi)
    ev("B._jrPlay('K',1)"); t(300)
    r=ev("""(()=>{const T=B._jr.test, m=T.map; let c=-1; for(let x=0;x<m[2].length;x++) if(m[2][x]==='B' && m[6][x]==='-'){c=x;break;} T.foes.forEach(e=>e.alive=false); T.P.x=c-0.5; T.P.y=9.14; T.P.vx=0; T.P.vy=0; T.P.inv=99; window._lc=c; return c})()"""); t(300)
    # einfacher Sprung: kommt nicht aufs Brett
    ev("B._jr.test.keys.j=true; B._jr.test.jump()"); t(1200); ev("B._jr.test.keys.j=false"); t(400)
    ok('single jump does not reach the ledge', ev("B._jr.test.P.y")>8.5, ev("B._jr.test.P.y"))
    # Doppelsprung: kurz nach dem Absprung nochmal tippen → landet auf dem Brett (Zeile 6)
    ev("B._jr.test.keys.j=true; B._jr.test.jump()"); t(330); ev("B._jr.test.jump()"); t(250); ev("B._jr.test.keys.r=true"); t(180); ev("B._jr.test.keys.r=false"); t(900); ev("B._jr.test.keys.j=false"); t(500)
    ok('double jump reaches the ledge', ev("B._jr.test.dbl")>=1 and abs(ev("B._jr.test.P.y")+0.86-6) < 0.2 and ev("B._jr.test.P.ground"), (ev("B._jr.test.dbl"), ev("B._jr.test.P.y"), ev("B._jr.test.P.x"), r))
    # auf dem Brett unter die Kiste und springen
    ev("(()=>{const T=B._jr.test; T.P.x=window._lc+0.15; return 1})()"); t(200)
    s1=int(ev(f"{sb}.querySelector('.jrco').textContent"))
    ev("B._jr.test.keys.j=true; B._jr.test.jump()"); t(700); ev("B._jr.test.keys.j=false"); t(600)
    ok('high box: +3 stars', int(ev(f"{sb}.querySelector('.jrco').textContent"))>=s1+3 and ev("B._jr.test.map[2][window._lc]")=='U', (s1, ev(f"{sb}.querySelector('.jrco').textContent")))
    # Doppelsprung nur bei Schwer
    ev("A._save('pk','K',{...A._db.pk.K,jr:{...A._db.pk.K.jr,ctl:'n'}})"); t(300); ev("B._jrPlay('K',1)"); t(300)
    ev("(()=>{const T=B._jr.test; T.foes.forEach(e=>e.alive=false); T.P.x=5; T.P.y=9.14; T.P.vy=0; return 1})()"); t(300)
    ev("B._jr.test.keys.j=true; B._jr.test.jump()"); t(330); ev("B._jr.test.jump()"); t(900); ev("B._jr.test.keys.j=false"); t(300)
    ok('normal: no double jump, no high ledges', ev("B._jr.test.dbl")==0 and ev("(()=>{const m=B._jr.test.map; return m[2].every(c=>c!=='B')})()"))
    ev("A._save('pk','K',{...A._db.pk.K,jr:{...A._db.pk.K.jr,ctl:'h'}})"); t(300); ev("B._jrPlay('K',5)"); t(300)
    # 🦔 Igel: Draufspringen tut weh
    ev("(()=>{const T=B._jr.test; const e=T.foes.find(f=>f.k==='s'); e.alive=true; T.P.inv=0; T.P.x=e.x; T.P.y=e.y-0.6; T.P.vy=4; window._hp=T.hp; return 1})()"); t(50)
    ok('hedgehog hurts when stomped', ev("B._jr.test.hp")<ev("window._hp") or ev("B._jr.test.over"))
    # Einfach/Normal bleiben wie bisher
    ev("A._save('pk','K',{...A._db.pk.K,jr:{...A._db.pk.K.jr,ctl:'n'}})"); t(300); ev("B._jrPlay('K',2)"); t(300)
    ok('normal: no special enemies', all(k=='w' for k in ev("B._jr.test.foes.map(e=>e.k)")) and ev("B._jr.test.hp")==3)
    ev("B._jrStop && B._jrStop()")
    ok('no errors', not errs, errs)
    b.close()
