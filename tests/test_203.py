# 2.0.0: 🗺️ Abenteuer – Titelbild, Knöpfe unter dem Spielfeld (quer daneben), Richtung selbst steuern, „läuft von allein“ je Kind, Herzen ·
#        🔄 Spielstände zurücksetzen · 🧩 Puzzle wischen/Reihe schieben · 🧠 Memory 6/8/10 Paare · 🙂 Emoji-Ersatz · 🔊 Vorlesen (Chrome-Hänger) · 🎵 Lied ≠ Simon
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
RECT="(s)=>{const r=B.shadowRoot.querySelector(s).getBoundingClientRect(); return [r.left,r.top,r.right,r.bottom]}"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':392,'height':860}, has_touch=True); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:46,total:330,order:1,by:2018,bm:3,bd:1});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',peJrLim:'0',gs:{puzzle:{size:3}}});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,hi:{catch:7,math:4},jr:{u:3,c:{1:3,2:2},ctl:'e'}});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    ev("document.body.style.gridTemplateColumns='1fr'; document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(1200)
    ev("B.shadowRoot.querySelector('[data-a=pegames]').click()"); t(800)
    # ---------- Titelbild ----------
    ev("B.shadowRoot.querySelector('.gmov [data-g=jr]').click()"); t(300); pg.wait_for_timeout(400); t(500)
    ok('cover: logo with pet name', 'Flockes' in ev("B.shadowRoot.querySelector('.gmov .jrlogo').textContent") and ev("!!B.shadowRoot.querySelector('.gmov .jrhero svg')"))
    ok('cover: crowns 5/30', '5/30' in ev("B.shadowRoot.querySelector('.gmov .jrcst').textContent"))
    ok('cover: title music started', ev("!!B._jrCs"))
    ev("B.shadowRoot.querySelector('.gmov [data-g=jrstart]').click()"); t(400)
    ok('start → map, music stopped', ev("B.shadowRoot.querySelectorAll('.gmov [data-g=jrgo]').length")==10 and not ev("!!B._jrCs"))
    ok('map hint: hearts + controls', '5' in ev("B.shadowRoot.querySelector('.gmov .jrmap .hint').textContent") and '◀' in ev("B.shadowRoot.querySelector('.gmov .jrmap .hint').textContent"))
    # ---------- Hochformat: Knöpfe unter dem Spielfeld ----------
    ev("B._jrPlay('K',1)"); t(800)
    st=ev(f"({RECT})('.jrst')"); pd=ev(f"({RECT})('.jrpad')")
    ok('portrait: buttons below the field', pd[1] >= st[3] - 1, [st,pd])
    ok('portrait: field ~ 12 rows tall', abs(ev("B._jr.test.Hd") - 12*ev("B._jr.test.TS")) < 1.5)
    ok('three buttons ◀ ▶ ⤒', ev("B.shadowRoot.querySelectorAll('.jrpad [data-k]').length")==3)
    # selbst steuern: ohne Taste bleibt das Tier stehen
    x0=ev("B._jr.test.P.x"); t(1500)
    ok('manual: stands still without keys', abs(ev("B._jr.test.P.x")-x0) < 0.2, [x0, ev("B._jr.test.P.x")])
    bx=ev(f"({RECT})('.jrpad [data-k=r]')")
    ev("""(()=>{const b=B.shadowRoot.querySelector('.jrpad [data-k=r]'); b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,composed:true,pointerId:7,pointerType:'touch'}));})()"""); t(1200)
    ok('▶ held: walks right + pressed look', ev("B._jr.test.P.x") > x0 + 2 and ev("B.shadowRoot.querySelector('.jrpad [data-k=r]').classList.contains('on')"))
    ev("""(()=>{const b=B.shadowRoot.querySelector('.jrpad [data-k=r]'); b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,composed:true,pointerId:7,pointerType:'touch'}));})()"""); t(200)
    ok('▶ released: key off', not ev("B._jr.test.keys.r"))
    # ---------- Herzen ----------
    ok('easy: 5 hearts', ev("B._jr.test.hp")==5 and ev("B.shadowRoot.querySelector('.jrhp').textContent").count('❤️')==5)
    ev("B._jr.test.P.inv=0; B._jr.test.hurt()"); t(100)
    ok('hurt: 4 hearts left', ev("B._jr.test.hp")==4)
    a0=ev("A._db.pk.K.d.a")
    for i in range(4): ev("B._jr.test.P.inv=0; B._jr.test.hurt()"); t(50)
    ok('no hearts → message', ev("B._jr.test.over") and ev("!!B.shadowRoot.querySelector('.jrmsg')"))
    t(2200)
    ok('level restarts with full hearts, not counted again', ev("B._jr.test.hp")==5 and not ev("B._jr.test.over") and ev("A._db.pk.K.d.a")==a0, [ev("B._jr.test.hp"), a0, ev("A._db.pk.K.d.a")])
    ev("A._save('pk','K',{...A._db.pk.K,jr:{...A._db.pk.K.jr,ctl:'n'}})"); t(300); ev("B._jrPlay('K',2)"); t(500)
    ok('normal: 3 hearts', ev("B._jr.test.hp")==3)
    # ---------- Querformat: Knöpfe links/rechts daneben ----------
    pg.set_viewport_size({'width':860,'height':420}); t(600); pg.wait_for_timeout(300); t(300)
    st=ev(f"({RECT})('.jrst')"); l=ev(f"({RECT})('.jrpl')"); r=ev(f"({RECT})('.jrpr')")
    ok('landscape: buttons beside the field', ev("B.shadowRoot.querySelector('.jrwrap').classList.contains('land')") and l[2] <= st[0] + 1 and r[0] >= st[2] - 1, [l,st,r])
    pg.set_viewport_size({'width':392,'height':860}); t(600)
    # ---------- läuft von allein (je Kind) ----------
    ev("A._save('pk','K',{...A._db.pk.K,jr:{...A._db.pk.K.jr,ctl:'e',a:true}})"); t(300)
    ok('clean keeps a', ev("A._clean('pk',{id:'K',jr:{u:2,c:{},ctl:'e',a:true}}).jr.a") is True and 'a' not in ev("A._clean('pk',{id:'K',jr:{u:2,c:{},ctl:'e',a:'x'}}).jr"))
    ev("B._jrPlay('K',1)"); t(300)
    ok('auto: only jump button + hint', ev("B.shadowRoot.querySelectorAll('.jrpad [data-k]').length")==1 and ev("!!B.shadowRoot.querySelector('.jrtap')"))
    x0=ev("B._jr.test.P.x"); t(1000)
    ok('auto: runs by itself', ev("B._jr.test.P.x") > x0 + 2)
    ev("""(()=>{const c=B.shadowRoot.querySelector('.jrcv'); c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,composed:true,pointerId:3,pointerType:'touch'}));})()"""); t(120)
    ok('auto: tap on field jumps', not ev("B._jr.test.P.ground") or ev("B._jr.test.P.vy") < 0)
    ev("""(()=>{const c=B.shadowRoot.querySelector('.jrcv'); c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,composed:true,pointerId:3,pointerType:'touch'}));})()"""); t(200)
    ev("B._gmClose()"); t(300)
    # ---------- Eltern: Spielstände zurücksetzen + Schalter ----------
    ev("A._save('pk','K',{...A._db.pk.K,d:{d:'2026-11-25',f:0,b:0,g:2,gs:0,a:1}})"); t(300)
    ev("document.getElementById('a').style.display=''; A._tab='tier'; A._render()"); t(800)
    ev("A._peAct('pekset',{k:'K'})"); t(500)
    q="A.shadowRoot.querySelector('#modal [data-rs=\"{}\"]')"
    ok('reset buttons: games, all, adventure, today', all(ev(f"!!{q.format(v)}") for v in ['hi:catch','hi:math','hi:*','jr','day']))
    ok('auto-run checkbox checked', ev("A.shadowRoot.querySelector('#modal #pek_jra').checked"))
    ev(f"{q.format('hi:catch')}.click()"); t(100)
    ok('first tap asks', ev("A._db.pk.K.hi.catch")==7 and 'Nochmal' in ev(f"{q.format('hi:catch')}.textContent"))
    ev(f"{q.format('hi:catch')}.click()"); t(400)
    ok('second tap resets one game', 'catch' not in ev("A._db.pk.K.hi") and ev("A._db.pk.K.hi.math")==4)
    ev(f"{q.format('jr')}.click()"); ev(f"{q.format('jr')}.click()"); t(400)
    ok('adventure reset, auto-run kept', ev("A._db.pk.K.jr")=={'u':1,'c':{},'ctl':'e','a':True}, ev("A._db.pk.K.jr"))
    ev(f"{q.format('day')}.click()"); ev(f"{q.format('day')}.click()"); t(400)
    ok('today reset', ev("A._db.pk.K.d.g")==0 and ev("A._db.pk.K.d.a")==0)
    ev("A.shadowRoot.querySelector('#modal #pek_jra').click()"); ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('switch off saved, progress untouched', 'a' not in ev("A._db.pk.K.jr") and ev("A._db.pk.K.jr.u")==1 and ev("A._db.pk.K.hi.math")==4, ev("A._db.pk.K.jr"))
    ev("document.getElementById('a').style.display='none'"); t(200)
    # ---------- Puzzle ----------
    ev("B._peKid='K'; B._render()"); t(500); ev("B._gmMenu('K')"); t(300)
    ev("B._gmStart('K','puzzle')"); t(800)
    gp="(()=>{const pos=[...B.shadowRoot.querySelectorAll('.gmpz button')].map(b=>Number(b.dataset.i)); return [0,1,2,3,4,5,6,7,8].find(x=>!pos.includes(x))})()"
    g0=ev(gp); far=[i for i in range(9) if i//3==g0//3 and abs(i-g0)==2]
    if far:
        ev(f"B.shadowRoot.querySelector('.gmpz button[data-i=\"{far[0]}\"]').click()"); t(200)
        ok('tap 2 away in row slides the row (1 move)', ev(gp)==far[0] and ev("B._gm.score")==1, [g0, far, ev(gp)])
    else:
        ok('tap 2 away in row slides the row (1 move)', True, 'gap in middle column')
    g0=ev(gp); nb=[i for i in [g0-1,g0+1] if 0<=i<9 and i//3==g0//3][0]
    box=ev(f"(()=>{{const r=B.shadowRoot.querySelector('.gmpz button[data-i=\"{nb}\"]').getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height/2]}})()")
    dx=60 if g0>nb else -60
    s0=ev("B._gm.score")
    pg.mouse.move(box[0],box[1]); pg.mouse.down(); pg.mouse.move(box[0]+dx/2,box[1]); pg.mouse.move(box[0]+dx,box[1]); pg.mouse.up(); t(500)
    ok('swipe toward the gap moves the piece', ev(gp)==nb and ev("B._gm.score")==s0+1, [g0,nb,ev(gp)])
    # verspätetes click nach dem Wischen (wie auf manchen Tablets/in der App) darf das Teil NICHT zurückschieben
    g1=ev(gp); nb2=[i for i in [g1-1,g1+1] if 0<=i<9 and i//3==g1//3][0]; s1=ev("B._gm.score")
    ev(f"""(()=>{{const b=B.shadowRoot.querySelector('.gmpz button[data-i="{nb2}"]'), r=b.getBoundingClientRect(), x=r.x+r.width/2, y=r.y+r.height/2, dx={60 if g1>nb2 else -60};
      b.dispatchEvent(new PointerEvent('pointerdown',{{bubbles:true,composed:true,pointerId:9,isPrimary:true,clientX:x,clientY:y}}));
      b.dispatchEvent(new PointerEvent('pointerup',{{bubbles:true,composed:true,pointerId:9,isPrimary:true,clientX:x+dx,clientY:y}})); return 0}})()"""); t(100)
    moved=ev(gp)==nb2
    t(600); ev(f"B.shadowRoot.querySelector('.gmpz button[data-i=\"{g1}\"]').click()"); t(200)
    ok('late click after swipe does not move the piece back', moved and ev(gp)==nb2 and ev("B._gm.score")==s1+1, [g1,nb2,ev(gp),moved])
    ev(f"(()=>{{const b=B.shadowRoot.querySelector('.gmpz button[data-i=\"{g1}\"]'); b.dispatchEvent(new PointerEvent('pointerdown',{{bubbles:true,composed:true,pointerId:10,isPrimary:true,clientX:5,clientY:5}})); b.dispatchEvent(new PointerEvent('pointerup',{{bubbles:true,composed:true,pointerId:10,isPrimary:true,clientX:6,clientY:5}})); b.click(); return 0}})()"); t(200)
    ok('tap = exactly one move (its click is ignored)', ev(gp)==g1 and ev("B._gm.score")==s1+2, [ev(gp), ev("B._gm.score"), s1])
    # Vorlage, 💡 Tipp, 🔀 Neu mischen
    ok('template with numbers and gap', ev("B.shadowRoot.querySelectorAll('.gmpzv b').length")==9 and ev("!!B.shadowRoot.querySelector('.gmpzv b.gp')"))
    ok('pieces have a colored background', 'gradient' in ev("B.shadowRoot.querySelector('.gmpz button span').style.background"))
    ev("B.shadowRoot.querySelector('[data-g=pzmix]').click()"); t(200)
    ok('shuffle: moves back to 0', ev("B._gm.score")==0 and not ev("B._gm.pz.tiles.every((v,i)=>v===i)"))
    steps=0
    while steps<40 and not ev("B._gm && B._gm.pz && B._gm.pz.tiles.every((v,i)=>v===i)"):
        ev("B.shadowRoot.querySelector('[data-g=pzhint]').click()"); t(100)
        tipi=ev("(()=>{const b=B.shadowRoot.querySelector('.gmpz button.tip'); return b?b.dataset.i:null})()")
        if tipi is None: break
        ev(f"B.shadowRoot.querySelector('.gmpz button[data-i=\"{tipi}\"]').click()"); t(100); steps+=1
    ok('following the tips solves the puzzle', steps<=31 and (ev("!B._gm || !B._gm.pz") or ev("B._gm.pz.tiles.every((v,i)=>v===i)")), steps)
    t(800)
    ok('solved → end screen', ev("!!B.shadowRoot.querySelector('.gmov .gmend')"))
    ev("B._gmStart('K','puzzle')"); t(800)
    # 🔢 Zahlen optional (je Kind gemerkt)
    ok('numbers on by default', ev("B.shadowRoot.querySelectorAll('.gmpz button i').length")==8)
    ev("B.shadowRoot.querySelector('[data-g=pznum]').click()"); t(200)
    ok('numbers off: no badges, template without numbers', ev("B.shadowRoot.querySelectorAll('.gmpz button i').length")==0 and ev("[...B.shadowRoot.querySelectorAll('.gmpzv b')].every(b=>!b.textContent)") and ev("localStorage.getItem('yippee_pznum_K')")=='0')
    ev("B._gmStart('K','puzzle')"); t(800)
    ok('off is remembered', ev("B.shadowRoot.querySelectorAll('.gmpz button i').length")==0)
    ev("B.shadowRoot.querySelector('[data-g=pznum]').click()"); t(200)
    ok('numbers on again', ev("B.shadowRoot.querySelectorAll('.gmpz button i').length")==8)
    ok('movable pieces highlighted', ev("B.shadowRoot.querySelectorAll('.gmpz button.mv').length") in (2,3,4))
    ev("B._gmClose()"); t(200)
    # ---------- Memory: Paare nach Schwierigkeit ----------
    for lv,n in [('v',12),('1',16),('4',20)]:
        ev(f"A._save('pk','K',{{...A._db.pk.K,lv:'{lv}'}})"); t(200)
        ev("B._peKid='K'; B._render()"); t(300); ev("B._gmMenu('K')"); t(200); ev("B._gmStart('K','memory')"); t(800)
        fit=ev("(()=>{const a=B.shadowRoot.querySelector('.gmov .gmar').getBoundingClientRect(); return [...B.shadowRoot.querySelectorAll('.gmcard')].every(c=>{const r=c.getBoundingClientRect(); return r.bottom<=a.bottom+1 && r.right<=a.right+1 && r.width>30})})()")
        ok(f'memory level {lv}: {n} cards, all visible', ev("B.shadowRoot.querySelectorAll('.gmcard').length")==n and fit)
        ev("B._gmClose()"); t(200)
    # ---------- 🎵 Lied ist nicht „Farben merken“ ----------
    ev("B._gmMenu('K')"); t(200); ev("B._gmStart('K','song')"); t(800)
    ok('song is not simon', not ev("!!B.shadowRoot.querySelector('.gmsong.simon')") and 'Hör gut zu' in ev("B._gm.say"))
    ev("B._gmClose()"); t(200)
    # ---------- 🙂 Emoji-Ersatz ----------
    ev("B._gmMenu('K')"); t(200)
    ok('games use old emojis', '🪙' not in ev("[...B.shadowRoot.querySelectorAll('.gmov [data-g=play] i')].map(x=>x.textContent).join('')") and '💰' in ev("B.shadowRoot.querySelector('.gmov').textContent"))
    ev("B._gmClose()"); t(200)
    # Gerät „kann 🛟 und 🪥 nicht“: die Test-Zeichnung liefert dafür nur Grau → Ersatz bzw. weglassen
    ev("""(()=>{const g=CanvasRenderingContext2D.prototype.getImageData, f=CanvasRenderingContext2D.prototype.fillText; let last='';
      CanvasRenderingContext2D.prototype.fillText=function(t,...a){ last=String(t); return f.call(this,t,...a); };
      CanvasRenderingContext2D.prototype.getImageData=function(...a){ const d=g.apply(this,a); if(last.includes('🛟')||last.includes('🪥')){ for(let i=0;i<d.data.length;i+=4){ d.data[i]=d.data[i+1]=d.data[i+2]=60; } } return d; };
      const c=window.__yippeeEmoWatch && window.__yippeeEmoWatch.c; if(c) Object.keys(c).forEach(k=>delete c[k]); return 0})()""")  # Zwischenspeicher leeren: die Karte prüft beim Start schon vor
    # Handbuch: 🛟 → 🆘
    ev("document.getElementById('a').style.display=''; A._hbOpen('')"); t(300); pg.wait_for_timeout(800); t(300)
    for _ in range(10):
        if ev("!!A.shadowRoot.querySelector('#modal .hblist')"): break
        pg.wait_for_timeout(300); t(200)
    hb=ev("A.shadowRoot.querySelector('#modal .hblist').textContent")
    ok('manual: unsupported 🛟 replaced by 🆘', '🛟' not in hb and '🆘' in hb, [hb.count('🛟'), hb.count('🆘'), len(hb)])
    ev("A._closeModal(); document.getElementById('a').style.display='none'"); t(200)
    # Memory: eigenes Aufgaben-Emoji 🪥 kann das Gerät nicht → kommt nicht ins Memory
    ev("A._save('task','TZ',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'})"); t(300)
    ev("B._peKid='K'; B._render()"); t(300); ev("B._gmMenu('K')"); t(200); ev("B._gmStart('K','memory')"); t(800)
    cards=ev("[...B.shadowRoot.querySelectorAll('.gmcard')].map(c=>c.textContent).join('')")
    ok('memory skips emojis the device cannot show', '🪥' not in cards and ev("B.shadowRoot.querySelectorAll('.gmcard').length")==20)
    ev("B._gmClose()"); t(200)
    # ---------- 🔊 Vorlesen ----------
    ev("""(()=>{window.__S=[]; window.__sp=false; Object.defineProperty(speechSynthesis,'speaking',{configurable:true,get:()=>window.__sp}); Object.defineProperty(speechSynthesis,'pending',{configurable:true,get:()=>false});
      speechSynthesis.speak=u=>__S.push(u.text); speechSynthesis.cancel=()=>__S.push('<cancel>'); speechSynthesis.resume=()=>{}; return 0})()""")
    ev("B._sayHere('Eins')"); t(50)
    ok('speech: idle → speak at once, no cancel', ev("__S")==['Eins'], ev("__S"))
    ev("__S.length=0; window.__sp=true; B._sayHere('Zwei')"); t(30)
    ok('speech: busy → cancel first', ev("__S")==['<cancel>'], ev("__S"))
    t(200)
    ok('speech: then speaks after a short pause', ev("__S")==['<cancel>','Zwei'], ev("__S"))
    ev("__S.length=0; B._sayHere('Drei'); B._sayHere('Vier')"); t(300)
    ok('speech: only the newest sentence', ev("__S").count('Vier')==1 and 'Drei' not in ev("__S"), ev("__S"))
    ok('no errors', not errs, errs)
    b.close()
