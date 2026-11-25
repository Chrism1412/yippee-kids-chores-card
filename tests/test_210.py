# 2.0.0 Paket 1: ◀ Vortage nachtragen (Eltern, bis 7 Tage zurück), Offline-Puffer, Barrierefreiheit
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T00:30:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:10,total:30,order:1});
      A._save('task','T1',{title:'Zimmer aufräumen',emoji:'🧸',points:3,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','T2',{title:'Müll raus',emoji:'🗑️',points:2,penalty:2,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','T3',{title:'Neu',emoji:'🆕',points:1,kids:['K'],sched:'week',days:[],created:'2026-11-25'});
      A._setCfg({approval:false,penalty:true}); A._setSt('2026-11-24','T2','K','m'); A._tab='heute'; A._render(); return 0})()"""); t(1500)
    sh="A.shadowRoot"
    ok('day bar there', ev(f"!!{sh}.querySelector('.admday [data-a=admday][data-v=\"-1\"]')"))
    ok('next disabled today', ev(f"{sh}.querySelector('.admday [data-v=\"1\"]').disabled"))
    ev(f"{sh}.querySelector('.admday [data-v=\"-1\"]').click()"); t(800)
    ok('yesterday shown', ev("A._admDay")=='2026-11-24' and 'Gestern' in ev(f"{sh}.querySelector('.admday b').textContent"))
    ok('rows carry date', ev(f"{sh}.querySelectorAll('.trow[data-d=\"2026-11-24\"]').length")==2, ev(f"{sh}.querySelectorAll('.trow').length"))
    ok('task created later hidden', not ev(f"!!{sh}.querySelector('.trow[data-t=T3]')"))
    ev(f"{sh}.querySelector('.trow[data-t=T1]').click()"); t(800)
    ok('yesterday ticked', ev("A._st('2026-11-24','T1','K')")=='d' and ev("A._db.kid.K.points")==13, ev("A._db.kid.K.points"))
    ok('today untouched', ev("A._st('2026-11-25','T1','K')")!='d')
    ev(f"{sh}.querySelector('.trow[data-t=T2]').click()"); t(800)
    ok('missed counts as done', ev("A._st('2026-11-24','T2','K')")=='d' and ev("A._db.kid.K.points")==15, ev("A._db.kid.K.points"))
    ev(f"{sh}.querySelector('.trow[data-t=T1]').click()"); t(800)
    ok('undo yesterday', ev("A._st('2026-11-24','T1','K')")!='d' and ev("A._db.kid.K.points")==12, ev("A._db.kid.K.points"))
    for i in range(10): ev(f"(()=>{{const x={sh}.querySelector('.admday [data-v=\"-1\"]'); if(x&&!x.disabled) x.click()}})()"); t(300)
    ok('max 7 days back', ev("A._admDay")=='2026-11-18', ev("A._admDay"))
    ev(f"{sh}.querySelector('.admday [data-v=\"0\"]').click()"); t(600)
    ok('back to today', ev("A._admDay")=='' and not ev(f"!!{sh}.querySelector('.trow[data-d]')"))
    # Kinder dürfen das nicht
    ev("""B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}"""); t(1200)
    ok('kid has no day bar', not ev("!!B.shadowRoot.querySelector('.admday')"))
    # 📴 Offline-Puffer
    ev("A._setCfg({approval:false})"); t(600)
    ev("B._hass.connection.connected=false"); t(200)
    ok('offline detected', ev("B._offline()"))
    ev("B._kidTap('T1','K',null)"); t(600)
    ok('queued not saved', ev("B._st('2026-11-25','T1','K')")=='' and len(ev("B._offQ()"))==1, ev("B._offQ()"))
    ok('tile shows offline', ev("!!B.shadowRoot.querySelector('.tile.oq[data-t=T1]')") and '📴' in ev("B.shadowRoot.querySelector('.tile[data-t=T1]').textContent"))
    ev("B._kidTap('T1','K',null)"); t(400)
    ok('tap again removes', len(ev("B._offQ()"))==0)
    ev("B._kidTap('T1','K',null)"); t(400)
    pts=ev("A._db.kid.K.points")
    ev("B._hass.connection.connected=true; B.hass=B._hass"); t(1500)
    ok('flushed when back', ev("B._offQ().length")==0 and ev("B._st('2026-11-25','T1','K')")=='d', ev("B._st('2026-11-25','T1','K')"))
    ok('stars booked once', ev("B._db.kid.K.points")==pts+3, (pts, ev("B._db.kid.K.points")))
    ev("A._setCfg({offQ:false}); B._hass.connection.connected=false"); t(800)
    ok('switch off -> no buffer', not ev("B._offline()"))
    ev("B._hass.connection.connected=true"); t(200)
    # ♿ Barrierefreiheit
    ev("A._setCfg({vHC:true})"); t(800)
    ok('high contrast css', '#ffd400' in ev("B.shadowRoot.getElementById('look').textContent"))
    ev("A._setCfg({vHC:false,vCalm:true})"); t(800)
    ok('calm css', 'animation-duration:.01ms' in ev("B.shadowRoot.getElementById('look').textContent") and ev("B._calm"))
    ev("B._burst(10)"); t(100)
    ok('no confetti when calm', ev("B.shadowRoot.querySelectorAll('#fx .cf').length")==0)
    ev("A._setCfg({vCalm:false}); localStorage.setItem('yippee_hc','1'); B._look()"); t(300)
    ok('device contrast override', '#ffd400' in ev("B.shadowRoot.getElementById('look').textContent"))
    ev("localStorage.removeItem('yippee_hc'); B._look()"); t(300)
    pg.wait_for_timeout(200); t(200)
    ok('icon buttons labelled', ev("[...A.shadowRoot.querySelectorAll('button[title]')].every(b=>/[\\p{L}\\d]{2}/u.test(b.textContent)||b.getAttribute('aria-label'))"))
    ok('clickable spans focusable', ev("[...B.shadowRoot.querySelectorAll('[data-a]:not(button):not(input):not(select):not(textarea):not(a):not(label):not(option):not(.mback)')].every(e=>e.hasAttribute('tabindex'))"))
    ev("document.getElementById('b').style.display='none'; A._editTask('T1')"); t(800); pg.wait_for_timeout(300); t(300)
    ok('modal is dialog', ev("A.shadowRoot.querySelector('#modal .mbox').getAttribute('role')")=='dialog')
    ev("A.shadowRoot.querySelector('#modal [data-a=mclose]').focus()")
    pg.keyboard.press('Escape'); t(500)
    ok('esc closes modal', not ev("A.shadowRoot.getElementById('modal').classList.contains('open')"))
    ok('no errors', not errs, errs)
    b.close()
