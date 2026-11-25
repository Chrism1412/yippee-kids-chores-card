# 2.0.0: 🏠 Anwesenheit – Aufgaben nur mit „ab“-Uhrzeit gelten bis zum Ende ihres Tagesabschnitts · 🐾 Spielen freischalten „nach bestimmten Aufgaben“ beachtet Abwesenheit und „entschuldigt“
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-12-01T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:10,total:10,pres:{on:true,base:'in',rules:[],ex:[{from:'2026-12-01',to:'2026-12-01',fT:'',tT:'13:00',st:'out'}]}});
      const T=(id,o)=>A._save('task',id,{title:id,emoji:'⭐',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01',...o});
      T('Auf',{from:'06:30'}); T('Zahn',{from:'06:45',to:'07:15'}); T('Frei',{}); T('Nach',{from:'14:00'}); T('Abend',{from:'19:00'});
      A._setCfg({approval:false,peOn:true,pePlay:'tasks',peTasks:['Auf','Zahn']}); return 0})()"""); t(1500)
    ev("document.getElementById('b').style.display='none'; A._tab='tier'; A._render()"); pg.wait_for_timeout(1500); t(800)
    tl=sorted(x['title'] for x in ev("A._todayTasks('K')"))
    ok('pet module loaded', ev("typeof A._peP")=='function')
    ok('morning tasks not due when arriving at 13:00', tl==['Abend','Frei','Nach'], tl)
    ok('pet unlocked (morning tasks not due)', ev("A._peUnlock(A._db.kid.K, A._peP('K')).ok"))
    # Kind ist den ganzen Tag da: Morgen-Aufgabe zählt wieder
    ev("A._save('kid','K',{...A._db.kid.K,pres:{on:false}})"); t(800)
    ok('present all day: morning task due', 'Auf' in [x['title'] for x in ev("A._todayTasks('K')")])
    ok('locked while open', not ev("A._peUnlock(A._db.kid.K, A._peP('K')).ok"))
    ev("A._setSt('2026-12-01','Auf','K','d'); A._setSt('2026-12-01','Zahn','K','e')"); t(800)
    ok('excused counts as not open', ev("A._peUnlock(A._db.kid.K, A._peP('K')).ok"), ev("JSON.stringify(A._peUnlock(A._db.kid.K, A._peP('K')))"))
    # Kind fährt um 10 Uhr: Morgen-Aufgabe bleibt fällig
    ev("A._save('kid','K',{...A._db.kid.K,pres:{on:true,base:'in',rules:[],ex:[{from:'2026-12-01',to:'2026-12-01',fT:'10:00',tT:'',st:'out'}]}})"); t(800)
    tl=sorted(x['title'] for x in ev("A._todayTasks('K')"))
    ok('leaving at 10:00 keeps morning task', 'Auf' in tl and 'Nach' not in tl, tl)
    ok('no errors', not errs, errs)
    b.close()
