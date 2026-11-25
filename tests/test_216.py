# 2.0.0: 🎮 Lernspiele mit mehreren Fragearten (Uhr, Zählen, Rechnen, Buchstaben, Geld, Einmaleins, Memory) und mehr Bewegungen
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
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:40,total:330,order:1,by:2017,bm:3,bd:1});
      A._save('task','T1',{title:'Zimmer',emoji:'🧸',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({approval:true,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',new20ok:true,peRep:false});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,lv:'4',qn:'30'});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    sb="B.shadowRoot"
    ev("document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(1200)
    def start(game):
        ev("B._gmClose && B._gmClose()"); t(300)
        ev(f"{sb}.querySelector('[data-a=pegames]').click()"); pg.wait_for_timeout(300); t(600)
        ev(f"{sb}.querySelector('.gmov [data-v={game}]').click()"); t(900)
    def sig(js):  # Merkmal der aktuellen Frage
        return ev(f"(()=>{{const q={sb}.querySelector('.gmov .gmq'); if(!q) return ''; return ({js})(q)}})()")
    def answer():
        ev(f"(()=>{{const b={sb}.querySelector('.gmov .gmans [data-ok=\"1\"]'); if(b) b.click()}})()"); t(900)
    def play(game, js, rounds=24):
        start(game); seen=set(); bad=[]
        for i in range(rounds):
            k=sig(js); seen.add(k)
            if ev(f"{sb}.querySelectorAll('.gmov .gmans [data-ok=\"1\"]').length")!=1: bad.append((k, ev(f"{sb}.querySelector('.gmov .gmq') && {sb}.querySelector('.gmov .gmq').innerText.slice(0,80)")))
            answer()
            if not ev(f"!!{sb}.querySelector('.gmov .gmq')"): start(game)
        return seen, bad
    # 🕐 Uhr (Klasse 4: alle fünf Arten)
    seen,bad=play('clock', "q=>q.querySelector('.gmans svg')?'pick':q.innerText.includes('Wie lange')?'dur':q.innerText.includes('in einer Stunde')||q.innerText.includes('Minuten?')?'later':'read'", 40)
    ok('clock: read, pick, later, duration', {'read','pick','later','dur'} <= seen and not bad, (seen, bad[:2]))
    # 🔢 Zählen
    seen,bad=play('count', "q=>q.innerText.includes('fehlen bis 10')?'ten':q.innerText.includes('mehr?')?'more':q.innerText.includes('Wo sind es')?'find':'count'", 30)
    ok('count: count, find, more, ten', {'count','find','more','ten'} <= seen and not bad, (seen, bad[:2]))
    # 🧮 Rechnen
    seen,bad=play('math', "q=>q.innerText.includes('Welche Aufgabe')?'which':q.innerText.includes('?')&&q.innerText.includes('=')&&!q.innerText.includes('= ?')?'gap':'calc'", 30)
    ok('math: calc, gap, which', {'calc','gap','which'} <= seen and not bad, (seen, bad[:2]))
    # 🔤 Buchstaben
    seen,bad=play('abc', "q=>q.innerText.includes('beginnt mit')&&!q.innerText.includes('„')?'pic':q.querySelector('.gmans button').dataset.v.length>2?'spell':'letter'", 30)
    ok('abc: letters, picture, spelling', {'pic','spell','letter'} <= seen and not bad, (seen, bad[:2]))
    # 💰 Geld
    seen,bad=play('money', "q=>q.querySelector('.gmans .gmmoney')?'pick':q.innerText.includes('zurück')?'change':'sum'", 30)
    ok('money: sum, pick, change', {'sum','pick','change'} <= seen and not bad, (seen, bad[:2]))
    # ✖️ Einmaleins
    start('mul'); ev(f"{sb}.querySelector('.gmov [data-g=mgo]').click()"); t(900)
    seen=set()
    for i in range(10):
        tx=sig("q=>q.querySelector('.gmtask')?q.querySelector('.gmtask').textContent:''"); seen.add('gap' if '?' in tx else 'div' if ':' in tx else 'mul' if '×' in tx else tx)
        answer()
    ok('mul: product, missing factor, division', len(seen & {'mul','gap','div'})>=2, seen)
    # 🧠 Memory: verschiedene Paar-Arten
    kinds=set()
    for i in range(14):
        start('memory'); h=ev(f"{sb}.querySelector('.gmov .gmmem').innerHTML")
        kinds.add('num' if '●' in h else 'en' if 'font-size:.36em' in h else 'abc' if '<b>a</b>' in h.lower() and '<b>' in h else 'pic')
        if len(kinds)>=3: break
    ok('memory: several pair kinds', len(kinds)>=3, kinds)
    # Memory spielbar: alle Paare per Ausprobieren finden (auch bei Zahl ↔ Punkte usw.)
    n=ev(f"{sb}.querySelectorAll('.gmov .gmcard').length")
    for i in range(n):
        for j in range(i+1,n):
            st=ev(f"(()=>{{const c=[...{sb}.querySelectorAll('.gmov .gmcard')]; return c.length? [c[{i}].classList.contains('ok'), c[{j}].classList.contains('ok')] : null}})()")
            if not st or st[0]: break
            if st[1]: continue
            ev(f"(()=>{{const c=[...{sb}.querySelectorAll('.gmov .gmcard')]; c[{i}].click(); c[{j}].click()}})()"); t(900)
        if not ev(f"!!{sb}.querySelector('.gmov .gmcard')"): break
    t(1500)
    ok('memory solvable', not ev(f"!!{sb}.querySelector('.gmov .gmcard:not(.ok)')"), ev(f"{sb}.querySelectorAll('.gmov .gmcard:not(.ok)').length"))
    # alle Stufen: jede Frage hat genau eine richtige Antwort, keine Fehler
    allbad=[]
    for lv in ['v','1','2','3','6']:
        ev(f"A._save('pk','K',{{...A._db.pk.K,lv:'{lv}'}})"); t(600)
        for gm in ['clock','count','math','abc','money','vocab']:
            seen,bad=play(gm, "q=>q.innerText.slice(0,20)", 14)
            allbad+= [(lv,gm)+x for x in bad]
    ok('every level: exactly one right answer', not allbad, allbad[:3])
    ok('no errors', not errs, errs)
    b.close()
