# 2.0.0: 🧩 Labyrinth, 🚂 Zugfahrt, 🏝️ Schatzkarte, 🐸 Seerosen-Hüpfen und 🚪 Fragetore im Abenteuer
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
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,lv:'2',qn:'4',jr:{u:10,c:{},ctl:'e'}});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    sb="B.shadowRoot"
    ev("document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(800)
    ev(f"{sb}.querySelector('[data-a=pegames]').click()"); pg.wait_for_timeout(300); t(500)
    ok('menu: 18 games incl. new ones', ev(f"{sb}.querySelectorAll('.gmov .gmmenu [data-g=play]').length")==18 and all(ev(f"!!{sb}.querySelector('.gmov [data-v={x}]')") for x in ['maze','train','board','lily']) and '🏰' in ev(f"{sb}.querySelector('.gmov [data-v=maze]').textContent"))
    def start(gm): ev("B._gmClose && B._gmClose()"); t(200); ev(f"{sb}.querySelector('[data-a=pegames]').click()"); pg.wait_for_timeout(200); t(300); ev(f"{sb}.querySelector('.gmov [data-v={gm}]').click()"); t(800)
    # ---------- 🧩 Labyrinth ----------
    start('maze')
    nb=ev("Object.keys(B._gm.mz.boxes).length")
    ok('maze: boxes on the path + d-pad + status', nb==5 and ev(f"{sb}.querySelectorAll('.gmov .gmdp button').length")==4 and '0/0' in ev(f"{sb}.querySelector('.gmov .gmqsc').textContent"), nb)
    m=ev("""(()=>{const g=B._gm.mz, w=g.wall, H=w.length, W=w[0].length; let holes=[]; for(let x=0;x<W;x++){ if(!w[0][x]) holes.push([x,0]); if(!w[H-1][x]) holes.push([x,H-1]); } for(let y=0;y<H;y++){ if(!w[y][0]) holes.push([0,y]); if(!w[y][W-1]) holes.push([W-1,y]); }
      let open=0; for(let y=0;y<H;y++) for(let x=0;x<W;x++) if(!w[y][x]) open++; const cells=((W-1)/2)*((H-1)/2);
      let wide=0; for(let y=0;y<H-1;y++) for(let x=0;x<W-1;x++) if(!w[y][x]&&!w[y+1][x]&&!w[y][x+1]&&!w[y+1][x+1]) wide++;
      return {holes:holes.length, loops: open-(2*cells-1)-2, bypass: g.reach(), wide}})()""")
    ok('maze: scrolls hidden until close (2 steps)', ev(f"{sb}.querySelectorAll('.gmov .gmmz i.q').length")==nb and ev(f"{sb}.querySelectorAll('.gmov .gmmz i.q:not(.rv)').length")>=1 and ev(f"!!{sb}.querySelector('.gmov .gmmz i.t b')") and ev(f"!!{sb}.querySelector('.gmov .gmmz i.gl')"))
    ok('maze: closed outside, only entrance + exit', m['holes']==2, m)
    ok('maze: several ways (loops) but boxes cannot be bypassed', m['loops']>=2 and not m['bypass'], m)
    ok('maze: no wide corridors', m['wide']==0, m)
    # Weg ablaufen: jeweils die Richtung zum nächsten Weg-Feld; Fragen: erste falsch, Rest richtig
    first=[True]
    for i in range(400):
        st=ev("""(()=>{const g=B._gm; if(!g||!g.mz) return 'end'; if(g.qa) return 'q'; if(g.mz.busy) return 'busy'; const P=g.mz.P, path=g.mz.path; const k=path.findIndex(p=>p[0]===P.x&&p[1]===P.y); if(k<0) return 'off'; const nx=path[k+1]; if(!nx) return 'end'; const d=nx[0]>P.x?'r':nx[0]<P.x?'l':nx[1]>P.y?'d':'u'; g.mz.go(d); return 'go'})()""")
        if st=='q':
            want='false' if first[0] else 'true'
            ev(f"""(()=>{{const s=B.shadowRoot; const bs=[...s.querySelectorAll('.gmov .gmqp [data-g=qa]')]; const t=bs.find(b=>(B._gm._q.ans[+b.dataset.i].ok)==={want})||bs[0]; t.click(); return 1}})()""")
            first[0]=False
            t(1900)
        elif st=='end': break
        else: t(300)
    t(800)
    ok('maze: goal reached, end screen', ev(f"!!{sb}.querySelector('.gmov .gmend')"), ev(f"{sb}.querySelector('.gmov .gmar').textContent")[:80])
    ok('maze: wrong answer counts as wrong', '4 von 5' in ev(f"{sb}.querySelector('.gmov .gmend').textContent"), ev(f"{sb}.querySelector('.gmov .gmend').textContent")[:80])
    # ---------- 🚂 Zugfahrt ----------
    start('train')
    ok('train: track, train, signs', ev(f"!!{sb}.querySelector('.gmov .gmtrn')") and ev(f"{sb}.querySelectorAll('.gmov .gmsig').length")>=2)
    for i in range(4):
        ev(f"""(()=>{{const s=B.shadowRoot; const bs=[...s.querySelectorAll('.gmov [data-g=qa]')]; const t=bs.find(b=>B._gm._q.ans[+b.dataset.i].ok)||bs[0]; t.click(); return 1}})()"""); t(2000)
    ok('train: 4 stations → end', '4 von 4' in ev(f"{sb}.querySelector('.gmov .gmar').textContent"), ev(f"{sb}.querySelector('.gmov .gmar').textContent")[:80])
    # ---------- 🐸 Seerosen ----------
    start('lily')
    ok('lily: lily pads with answers', ev(f"{sb}.querySelectorAll('.gmov .gmlil').length")>=2)
    ev(f"""(()=>{{const s=B.shadowRoot; const bs=[...s.querySelectorAll('.gmov [data-g=qa]')]; const t=bs.find(b=>!B._gm._q.ans[+b.dataset.i].ok); t.click(); return 1}})()"""); t(400)
    ok('lily: wrong = splash, counted', ev(f"!!{sb}.querySelector('.gmov .gmlil.sink')"))
    t(1000); ok('lily: frog still sits there, right pad marked', ev(f"!!{sb}.querySelector('.gmov .gmlil.sol')") and ev(f"!!{sb}.querySelector('.gmov .gmlyf.hop')")); t(1800)
    for i in range(3):
        ev(f"""(()=>{{const s=B.shadowRoot; const bs=[...s.querySelectorAll('.gmov [data-g=qa]')]; const t=bs.find(b=>B._gm._q.ans[+b.dataset.i].ok); t.click(); return 1}})()"""); t(2200)
    ok('lily: 3 of 4 → end', '3 von 4' in ev(f"{sb}.querySelector('.gmov .gmar').textContent"), ev(f"{sb}.querySelector('.gmov .gmar').textContent")[:80])
    # ---------- 🏝️ Schatzkarte ----------
    start('board')
    ev(f"{sb}.querySelector('.gmov [data-g=bdp][data-v=\"2\"]').click()"); t(300)
    ok('board: 23 question fields, 5 rest stops 🏖️', ev("B._gm.bd.QF.size")==23 and ev(f"{sb}.querySelectorAll('.gmov .gmbdb i.safe').length")==5 and ev("[...B._gm.bd.SAFE].every(i=>!B._gm.bd.QF.has(i))"))
    ok('board: 30 fields, 2 players, dice', ev(f"{sb}.querySelectorAll('.gmov .gmbdb i').length")==30 and ev(f"!!{sb}.querySelector('.gmov [data-g=dice]')") and ev("B._gm.bd.pl.length")==2)
    asked=0
    for i in range(200):
        if ev(f"!!{sb}.querySelector('.gmov .gmend')"): break
        if ev("!!(B._gm && B._gm.qa)"):
            ev(f"""(()=>{{const s=B.shadowRoot; const bs=[...s.querySelectorAll('.gmov .gmqp [data-g=qa]')]; const t=bs.find(b=>B._gm._q.ans[+b.dataset.i].ok); t.click(); return 1}})()"""); asked+=1; t(1500); continue
        if not ev("B._gm.bd.busy"): ev(f"{sb}.querySelector('.gmov [data-g=dice]').click()")
        t(700)
    ok('board: questions asked, treasure found', asked>=1 and ev(f"!!{sb}.querySelector('.gmov .gmend')") and 'Schatz' in ev(f"{sb}.querySelector('.gmov .gmend').textContent"), (asked, ev(f"{sb}.querySelector('.gmov .gmar').textContent")[:80]))
    # ---------- 🚪 Fragetore ----------
    ev("B._gmClose()"); ev("A._setCfg({gs:{jr:{gate:true}}})"); t(300)
    ev(f"{sb}.querySelector('[data-a=pegames]').click()"); pg.wait_for_timeout(200); t(300)
    ev(f"{sb}.querySelector('.gmov [data-g=jr]').click()"); pg.wait_for_timeout(500); t(400)
    ev(f"{sb}.querySelector('.gmov [data-g=jrstart]').click()"); t(300)
    ev("B._jrPlay('K',1)"); t(400)
    ng=ev("B._jr.test.gates.length")
    ok('gates in the level + HUD', ng>=2 and '🚪 0/' in ev(f"{sb}.querySelector('.jrhud').textContent"), ng)
    ev("(()=>{const T=B._jr.test; const gt=T.gates[0]; T.foes.forEach(e=>e.alive=false); T.P.x=gt.x-1.5; T.P.y=9.14; T.P.vx=0; T.P.inv=99; T.keys.r=true; return 1})()"); t(1500)
    ok('touching the gate asks a question (game paused)', ev("B._jr.test.asking") and ev(f"!!{sb}.querySelector('.jrst .gmqp')"))
    sc0=int(ev(f"{sb}.querySelector('.jrco').textContent"))
    ev(f"""(()=>{{const s=B.shadowRoot; const bs=[...s.querySelectorAll('.jrst .gmqp [data-g=qa]')]; const t=bs.find(b=>B._gm._q.ans[+b.dataset.i].ok); t.click(); return 1}})()"""); t(1200)
    ok('right answer: gate open, +3 stars', ev("B._jr.test.gates[0].open") and int(ev(f"{sb}.querySelector('.jrco').textContent"))==sc0+3 and not ev("B._jr.test.asking"))
    ev("B._jr.test.keys.r=true"); t(1500)
    ok('walks on through the gate', ev("B._jr.test.P.x") > ev("B._jr.test.gates[0].x")+0.5, ev("B._jr.test.P.x"))
    ev("B._jr.test.keys.r=false; B._jrStop && B._jrStop()")
    ok('no errors', not errs, errs)
    b.close()
