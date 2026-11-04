# 1.7.0: 🎒 „Am Abend vorher“ mit eigenen Wochentagen – gewählt werden die Tage mit Schule/Termin, die Aufgabe kommt am Abend davor
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-01T16:00:00'))  # Sonntag
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5}); A._setCfg({hc:null}); A._tab='aufgaben'; A._render();})()"""); t(800)
    days_checked=lambda: ev("[...A.shadowRoot.querySelectorAll('#modal [name=day]:checked')].map(x=>Number(x.value)).sort()")
    def form(title, days, school, prev):
        ev("A._editTask()"); t(400)
        ev(f"""(()=>{{const m=A.shadowRoot.querySelector('#modal'); m.querySelector('[name=title]').value='{title}';
          m.querySelectorAll('[name=day]').forEach(x=>{{x.checked={days}.includes(Number(x.value));}});
          const s=m.querySelector('[name=school]'); if(s.checked!=={str(school).lower()}) s.click();
          const p=m.querySelector('[name=schoolPrev]'); if(p && p.checked!=={str(prev).lower()}) p.click();}})()"""); t(200)
        ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(1500)
        return ev(f"Object.values(A._db.task).find(x=>x.title==='{title}')")
    tk=form('Sporttasche packen',[1,2],True,True)
    ok('Mo+Di with „evening before“ stored as Sun+Mon evenings', sorted(tk['days'])==[0,1] and tk['schoolPrev'] is True, tk)
    on=lambda tid, d: ev(f"A._isOn(A._db.task['{tid}'], new Date('{d}T12:00:00'))")
    ok('appears Sunday and Monday evening', on(tk['id'],'2026-11-01') and on(tk['id'],'2026-11-02'))
    ok('not on Tuesday (the sport day itself) or Wednesday', not on(tk['id'],'2026-11-03') and not on(tk['id'],'2026-11-04'))
    ev(f"A._closeModal(); A._editTask('{tk['id']}')"); t(400)
    ok('editor shows the sport days again (Mo, Di)', days_checked()==[1,2], days_checked())
    ok('hint shown', 'am Abend davor' in ev("A.shadowRoot.querySelector('#modal').innerText"))
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(1500)
    ok('saving again unchanged (no double shift)', sorted(ev(f"A._db.task['{tk['id']}'].days"))==[0,1], ev(f"A._db.task['{tk['id']}'].days"))
    tk2=form('Zimmer aufräumen',[1,2],True,False)
    ok('without evening option: days as chosen', sorted(tk2['days'])==[1,2] and on(tk2['id'],'2026-11-02') and not on(tk2['id'],'2026-11-01'), tk2)
    tk3=form('Ranzen packen',[1,2,3,4,5],True,True)
    ok('Mo–Fr evening before = standard Sun–Thu', sorted(tk3['days'])==[0,1,2,3,4] and ev(f"A._schoolStd(A._db.task['{tk3['id']}'])"), tk3)
    ev(f"A._closeModal(); A._editTask('{tk3['id']}')"); t(400)
    ok('standard shows Mo–Fr', days_checked()==[1,2,3,4,5], days_checked())
    ev("A._closeModal()"); t(200)
    ev("A._save('task','SP',{title:'Turnbeutel packen',emoji:'🎽',points:1,kids:['K'],sched:'week',days:[1],school:true,schoolPrev:true})"); t(600)
    ev("A._editTask('SP')"); t(400)
    ok('sport dialog task shows sport day in editor', days_checked()==[2], days_checked())
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
