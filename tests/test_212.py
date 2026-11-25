# 2.0.0 Paket 2: 🏠 Haustier-Zuhause, 🇬🇧 Englisch-Wörter, ✖️ Einmaleins, 📚 Lesetagebuch
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
    ev("""(()=>{A._hass.states['weather.home']={entity_id:'weather.home',state:'rainy',attributes:{friendly_name:'Wetter'}};
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:40,total:330,order:1,by:2017,bm:3,bd:1});
      A._save('task','T1',{title:'Zimmer',emoji:'🧸',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({approval:true,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',peWx:'weather.home',new20ok:true});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,lv:'2',tl:40});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    sb="B.shadowRoot"
    ev("document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(1200)
    # ---------- 🏠 Zuhause ----------
    ok('home off by default', not ev(f"!!{sb}.querySelector('[data-a=pehome]')"))
    ev("A._setCfg({peHome:true}); B._render()"); t(800)
    ev(f"{sb}.querySelector('[data-a=pehome]').click()"); t(1500)
    ok('room shown', ev(f"!!{sb}.querySelector('.phroom')") and ev(f"!!{sb}.querySelector('.phroom .phpet svg')"))
    ok('rain only in the window', ev(f"!!{sb}.querySelector('.phroom .phrain')") and not ev(f"!!{sb}.querySelector('.pepg .pewx')"))
    ok('21 things in the shop (incl. garden)', ev(f"{sb}.querySelectorAll('.phshop button').length")==21)
    ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=tv]').click()"); t(400)
    ok('first tap asks', ev("A._db.pk.K.tl")==40 and 'kaufen' in ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=tv]').textContent"))
    ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=tv]').click()"); t(800)
    ok('bought: −20 🪙 (stars untouched), in room', ev("A._db.pk.K.tl")==20 and ev("A._db.kid.K.points")==40 and 'tv' in ev("A._db.pk.K.home.o") and '📺' in ev(f"{sb}.querySelector('.phroom').textContent"), (ev("A._db.pk.K.tl"), ev("JSON.stringify(A._db.pk.K.home)")))
    ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=sofa]').click()"); t(300); ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=sofa]').click()"); t(600)
    ok('not enough Taler', ev("A._db.pk.K.tl")==20 and 'sofa' not in ev("A._db.pk.K.home.o"))
    ev(f"{sb}.querySelector('[data-a=pehtog][data-v=tv]').click()"); t(600)
    ok('put away', 'tv' in ev("A._db.pk.K.home.x") and '📺' not in ev(f"{sb}.querySelector('.phroom').textContent"))
    ok('clean keeps home + mx', ev("JSON.stringify(A._clean('pk',{id:'K',home:{o:['bed','<x>'],x:[],w:3},mx:{'2,5':40,'bad':3,'7':0}}))")=='{"id":"K","home":{"o":["bed"],"x":[],"w":3},"mx":{"2,5":40}}', ev("JSON.stringify(A._clean('pk',{id:'K',home:{o:['bed','<x>'],x:[],w:3},mx:{'2,5':40,'bad':3,'7':0}}))"))
    # 🏷️ Preise einstellbar: Faktor und einzeln
    ev("A._setCfg({phF:2,phPr:{sofa:3}})"); t(600)
    ev("B._render()"); t(600)
    ok('price factor shown', '16 🪙' in ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=lamp]').textContent"), ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=lamp]').textContent"))
    p0=ev("A._db.pk.K.tl")
    ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=sofa]').click()"); t(300); ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=sofa]').click()"); t(800)
    ok('own price used', ev("A._db.pk.K.tl")==p0-3 and 'sofa' in ev("A._db.pk.K.home.o"), (p0, ev("A._db.pk.K.tl")))
    ev("A._setCfg({phF:1,phPr:{}})"); t(400)
    ev(f"{sb}.querySelector('[data-a=pehback]').click()"); t(800)
    ok('back to pet page', ev(f"!!{sb}.querySelector('[data-a=pegames]')"))
    ok('home button shows Taler', '🪙 17' in ev(f"{sb}.querySelector('[data-a=pehome]').textContent"), ev(f"{sb}.querySelector('[data-a=pehome]').textContent"))
    # ---------- 🇬🇧 Englisch + ✖️ Einmaleins ----------
    ev(f"{sb}.querySelector('[data-a=pegames]').click()"); t(800)
    ok('menu has vocab + mul', ev(f"!!{sb}.querySelector('.gmov [data-v=vocab]')") and ev(f"!!{sb}.querySelector('.gmov [data-v=mul]')"))
    ev(f"{sb}.querySelector('.gmov [data-v=vocab]').click()"); t(800)
    ok('vocab: a question with 3–4 answers', ev(f"{sb}.querySelectorAll('.gmov .gmans [data-g=ans]').length") in (3,4))
    for i in range(5):
        ev(f"(()=>{{const b={sb}.querySelector('.gmov .gmans [data-ok=\"1\"]'); if(b) b.click()}})()"); t(900)
    t(1500)
    ok('vocab finished', 'great job' in ev(f"{sb}.querySelector('.gmov .gmar').textContent"), ev(f"{sb}.querySelector('.gmov .gmar').textContent")[:120])
    # 🇬🇧 vier Fragearten, 🔊 als eigener Knopf rechts neben der Antwort
    ev("B._gmClose(); B._gmMenu('K')"); t(400); ev(f"{sb}.querySelector('.gmov [data-v=vocab]').click()"); t(800)
    kinds=set(); spk_ok=True
    for i in range(60):
        k=ev(f"""(()=>{{const q={sb}.querySelector('.gmov .gmq'); if(!q) return ''; if(q.querySelector('.gmvr')) return 'pic';
          const a=[...q.querySelectorAll('.gmans [data-g=ans]')]; if(a.length && a.every(x=>x.dataset.v.length===1)) return 'gap';
          return q.querySelector('.gmans')&&q.querySelector('[data-g=en]')&&!q.querySelector('.gmtask') ? 'ear' : 'word'}})()""")
        kinds.add(k)
        if k=='pic': spk_ok = spk_ok and ev(f"[...{sb}.querySelectorAll('.gmov .gmvr')].every(r=>r.children.length===2 && r.children[0].dataset.g==='ans' && r.children[1].dataset.g==='en')")
        ev(f"(()=>{{const b={sb}.querySelector('.gmov .gmans [data-ok=\"1\"]'); if(b) b.click()}})()"); t(900)
        if not ev(f"!!{sb}.querySelector('.gmov .gmq')"): ev("B._gmClose(); B._gmMenu('K')"); t(400); ev(f"{sb}.querySelector('.gmov [data-v=vocab]').click()"); t(800)
    ok('vocab: all four question kinds', {'pic','gap','ear','word'} <= kinds, kinds)
    ok('vocab: speaker is its own button right of the answer', spk_ok)
    for _ in range(20):
        ev("B._gmClose(); B._gmMenu('K')"); t(400); ev(f"{sb}.querySelector('.gmov [data-v=vocab]').click()"); t(800)
        if ev(f"!!{sb}.querySelector('.gmov [data-g=en]')"): break
    ev("(()=>{window._said2=[]; B._sayDev=(x,l)=>window._said2.push([x,l]); return 1})()")
    ev(f"{sb}.querySelector('.gmov [data-g=en]').click()"); t(500)
    sd=ev("window._said2")
    ok('vocab: speaker uses card voice in English', sd and sd[0][1]=='en-GB' and sd[0][0], sd)
    # 🔊 HA-Stimme: Wort wird gemerkt (zweites Mal ohne neue Anfrage), „en-GB“ unbekannt → „en“
    r=ev("""(async()=>{const C=Object.getPrototypeOf(B); const o=C._sayDev; delete B._sayDev; A._setCfg({rTts:'tts.google_de'}); await new Promise(r=>setTimeout(r,50));
      const calls=[]; const ws=B._hass.callWS; B._hass.callWS=(m)=>{calls.push(m.media_content_id); return m.media_content_id.includes('language=en-GB')?Promise.reject(new Error('lang')):Promise.resolve({url:'/api/tts_proxy/x.mp3'})};
      const pl=HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play=function(){return Promise.resolve()};
      B._sayDev('dog','en-GB'); await new Promise(r=>setTimeout(r,30)); B._sayDev('dog','en-GB'); await new Promise(r=>setTimeout(r,30));
      HTMLMediaElement.prototype.play=pl; B._hass.callWS=ws; A._setCfg({rTts:''}); return calls})()""")
    ok('tts: en-GB falls back to en, then cached', len(r)==2 and 'language=en-GB' in r[0] and 'language=en' in r[1] and 'en-GB' not in r[1], r)
    # 🧠 Memory mit Englisch-Wörtern: Hinweis unten
    for i in range(20):
        ev("B._gmClose(); B._gmMenu('K')"); t(300); ev(f"{sb}.querySelector('.gmov [data-v=memory]').click()"); t(600)
        if 'font-size:.36em' in ev(f"{sb}.querySelector('.gmov .gmmem').innerHTML"): break
    ok('memory english: hint shown', 'englisches Wort' in ev(f"{sb}.querySelector('.gmov .gmft').textContent"), ev(f"{sb}.querySelector('.gmov .gmft').textContent"))
    ev("B._gmClose(); B._gmMenu('K')"); t(400)
    ev(f"{sb}.querySelector('.gmov [data-v=mul]').click()"); t(800)
    ok('mul: row picker', ev(f"{sb}.querySelectorAll('.gmov [data-g=mrow]').length")==10)
    for i in range(10): ev(f"(()=>{{const x={sb}.querySelector('.gmov [data-g=mrow].ok'); if(x) x.click();}})()"); t(50)
    ev(f"{sb}.querySelector('.gmov [data-g=mrow][data-v=\"3\"]').click()"); t(200)
    ev(f"{sb}.querySelector('.gmov [data-g=mgo]').click()"); t(600)
    task=ev(f"{sb}.querySelector('.gmov .gmtask').textContent")
    ok('only 3er row', '3' in task and ('×' in task or ':' in task), task)
    for i in range(10):
        ev(f"(()=>{{const b={sb}.querySelector('.gmov .gmans [data-ok=\"1\"]'); if(b) b.click()}})()"); t(1500)
    t(1500)
    ok('best time saved for row 3', (ev("A._db.pk.K.mx") or {}).get('3',0)>0, ev("JSON.stringify(A._db.pk.K.mx)"))
    ok('best time shown', 'Bestzeit' in ev(f"{sb}.querySelector('.gmov .gmar').textContent"))
    ev("B._gmClose()"); t(300)
    ev("A._setCfg({lang:'en'})"); pg.wait_for_timeout(1500); t(800)
    ev("B._gmMenu('K')"); t(400)
    ok('no vocab when card is english', not ev(f"!!{sb}.querySelector('.gmov [data-v=vocab]')") and ev(f"!!{sb}.querySelector('.gmov [data-v=mul]')"))
    ev("B._gmClose(); A._setCfg({lang:'de'})"); pg.wait_for_timeout(800); t(800)
    # ---------- 📚 Lesetagebuch ----------
    ev("A._setCfg({rdOn:true}); B._peKid=''; B._render()"); t(1500)
    ok('reading button', ev(f"!!{sb}.querySelector('[data-a=rbopen]')"))
    ev(f"{sb}.querySelector('[data-a=rbopen]').click()"); t(800)
    ev(f"(()=>{{const m={sb}.getElementById('modal'); m.querySelector('#rbt').value='Das Sams'; m.querySelector('#rba').value='Paul Maar';}})()")
    ev(f"{sb}.querySelector('#modal [data-a=rbpick][data-v=\"📗\"]').click()"); t(100)
    ev(f"{sb}.querySelector('#modal [data-a=rbadd]').click()"); t(800)
    bid=ev("Object.keys(A._db.rb.K.b)[0]")
    ok('book added', ev(f"A._db.rb.K.b['{bid}'].t")=='Das Sams' and ev(f"A._db.rb.K.b['{bid}'].e")=='📗')
    ev(f"{sb}.querySelector('#modal [data-a=rbmin][data-n=\"20\"]').click()"); t(600)
    ev(f"{sb}.querySelector('#modal [data-a=rbmin][data-n=\"10\"]').click()"); t(600)
    ok('minutes logged', ev(f"A._db.rb.K.b['{bid}'].mn")==30 and ev("A._db.rb.K.m['2026-11-25']")==30)
    p0=ev("A._db.kid.K.points")
    ev(f"{sb}.querySelector('#modal [data-a=rbfin]').click()"); t(800)
    ok('waits for approval', ev(f"A._db.rb.K.b['{bid}'].s")=='p' and ev("A._db.kid.K.points")==p0 and ev("Object.values(A._db.req).some(q=>q.book)"))
    ev("B._closeModal(); document.getElementById('a').style.display=''; document.getElementById('b').style.display='none'; A._tab='heute'; A._render()"); t(1500)
    ok('parent sees approval row', ev("!!A.shadowRoot.querySelector('[data-a=rbapr]')") and 'Das Sams' in ev("A.shadowRoot.querySelector('[data-a=rbapr]').closest('.row').textContent"))
    ev("A.shadowRoot.querySelector('[data-a=rbapr]').click()"); t(1000)
    ok('approved: +5 ⭐, on shelf', ev("A._db.kid.K.points")==p0+5 and ev(f"A._db.rb.K.b['{bid}'].s")=='d' and not ev("Object.values(A._db.req).some(q=>q.book)"), (p0, ev("A._db.kid.K.points")))
    ev("A._setCfg({approval:false,rdStars:2})"); t(400)
    ev("A._rbAct('rbopen',{k:'K'})"); t(500)
    ev("(()=>{const m=A.shadowRoot.getElementById('modal'); m.querySelector('#rbt').value='Pippi';})()"); ev("A.shadowRoot.querySelector('#modal [data-a=rbadd]').click()"); t(600)
    ev("A.shadowRoot.querySelector('#modal [data-a=rbfin]').click()"); t(800)
    ok('without approval: stars at once', ev("A._db.kid.K.points")==p0+7 and ev("A.shadowRoot.querySelectorAll('#modal .rbsp').length")==2)
    ok('clean rb', ev("JSON.stringify(A._clean('rb',{id:'K',b:{x1:{t:'<b>A',e:'X',s:'z',mn:5}},m:{'2026-11-25':20,'bad':3}}))")=='{"id":"K","b":{"x1":{"t":"bA","a":"","e":"📘","mn":5,"s":"r"}},"m":{"2026-11-25":20}}', ev("JSON.stringify(A._clean('rb',{id:'K',b:{x1:{t:'<b>A',e:'X',s:'z',mn:5}},m:{'2026-11-25':20,'bad':3}}))"))
    ok('settings switches', 'f_rdOn' in ev("A._tab='einst'; A._render(); A.shadowRoot.innerHTML"))
    # 🏷️ Preis-Einstellungen im Tab 🐾
    ev("A._setCfg({peHome:true}); document.getElementById('a').style.display=''; A._tab='tier'; A._render()"); pg.wait_for_timeout(600); t(800)
    ok('price settings in pet tab', ev("!!A.shadowRoot.querySelector('[data-pecfg=phF]')") and ev("A.shadowRoot.querySelectorAll('[data-pecfg=phPr]').length")==28 and not ev("!!A.shadowRoot.querySelector('[data-pecfg=phPr][data-id=bed]')"))
    ev("(()=>{const i=A.shadowRoot.querySelector('[data-pecfg=phPr][data-id=sofa]'); i.value='7'; i.dispatchEvent(new Event('change',{bubbles:true,composed:true}))})()"); t(500)
    ok('single price saved', ev("A._cfg.phPr.sofa")==7)
    ev("(()=>{const i=A.shadowRoot.querySelector('[data-pecfg=phF]'); i.value='0.5'; i.dispatchEvent(new Event('change',{bubbles:true,composed:true}))})()"); t(500)
    ok('factor saved', ev("A._cfg.phF")==0.5 and ev("A._phPrice('lamp')")==4 and ev("A._phPrice('sofa')")==7)
    ev("A.shadowRoot.querySelector('[data-a=pehreset]').click()"); t(500)
    ok('reset single prices', ev("JSON.stringify(A._cfg.phPr)")=='{}')
    ok('no errors', not errs, errs)
    b.close()
