# 1.9.0 (#17): 🦷 Zahnputz-Aufgabe als Schritt einer Routine startet den Zahnputz-Timer
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-11T07:30:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    D='2026-11-11'
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:0,total:0});
      A._save('task','TZ',{title:'Zähne putzen',emoji:'🦷',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','RM',{title:'Morgenroutine',emoji:'🌅',points:4,kids:['K'],sched:'week',days:[],created:'2026-10-01',steps:[{t:'Anziehen'},{t:'🦷 Zähne putzen',tid:'TZ'},{t:'Frühstück'}]});
      A._setCfg({approval:false, zOn:true, routOn:true, kView:'classic'}); A._zSet({tasks:['TZ'], pAll:3, bonus:5});
      A._save('zk','K',{seen:['mond'],n:3,sd:'2026-11-10',sn:6}); return 0})()"""); t(1500)
    run="B.shadowRoot.querySelector('yippee-teeth-run')"
    z=lambda: ev("A._db.zk.K"); pts=lambda: ev("A._db.kid.K.points")
    ok('teeth task not shown on its own', ev("[...B.shadowRoot.querySelectorAll('.tile')].length")==1 and 'Morgenroutine' in ev("B.shadowRoot.querySelector('.tile').textContent"))
    ok('fresh routine: no step ticked yet (0/3)', ev(f"B._routDone('{D}','RM','K',3)")==[] and '0/3' in ev("B.shadowRoot.querySelector('.tile').textContent"), ev("B.shadowRoot.querySelector('.tile').textContent"))
    ok('step index found', ev("B._zStepIdx(B._db.task.RM)")==[1])
    ok('due today includes the step task', ev("B._zDueToday('K').map(x=>x.id)")==['TZ'])
    ok('gallery button shown for kid', 'Zahnputz-Bilder' in ev("B.shadowRoot.textContent"))
    ev("B.shadowRoot.querySelector('.tile').click()"); t(500)
    ok('dialog opens with nothing ticked', ev("[...B.shadowRoot.querySelectorAll('#modal [data-rstep]')].map(x=>x.checked)")==[False,False,False])
    ok('routine dialog: timer button on the teeth step only', ev("[...B.shadowRoot.querySelectorAll('#modal [data-a=rzgo]')].map(x=>x.dataset.i)")==['1'])
    ok('checkbox still usable (not timer-only)', not ev("B.shadowRoot.querySelector('#modal [data-rstep=\"1\"]').disabled"))
    ev("B.shadowRoot.querySelector('#modal [data-rstep=\"0\"]').click()"); t(400)
    ev("B.shadowRoot.querySelector('#modal [data-a=rzgo]').click()"); t(1500); pg.wait_for_timeout(500); t(1000)
    ok('timer opens for the teeth task', ev(f"!!{run} && {run}.hasAttribute('open')") and ev(f"{run}._tid")=='TZ' and ev("B._zStepCtx && B._zStepCtx.rid")=='RM', ev("B._zStepCtx"))
    ok('routine dialog closed while brushing', not ev("!!B.shadowRoot.querySelector('#modal [data-rstep]')"))
    # Timer durchlaufen lassen
    ev(f"{run}.shadowRoot.querySelector('[data-a=go]').click()"); t(125000); pg.wait_for_timeout(300); t(3000)
    ok('timer done', ev(f"{run}._st")=='done', ev(f"{run}._st"))
    ok('step ticked by timer', ev(f"B._routDone('{D}','RM','K',3)")==[0,1], ev(f"B._routDone('{D}','RM','K',3)"))
    ok('brushing counted + picture', z()['n']==4 and len(z()['seen'])==2, z())
    ok('streak day counted (7) + bonus', z()['sn']==7 and z()['sd']==D and pts()==5, [z(), pts()])
    ok('no stars for the step itself, teeth task not booked', ev(f"A._st('{D}','TZ','K')")=='' and ev(f"A._st('{D}','RM','K')")=='')
    ok('message names the routine', 'Morgenroutine' in ev(f"{run}.shadowRoot.textContent"), ev(f"{run}.shadowRoot.textContent")[:200])
    ev(f"{run}.shadowRoot.querySelector('[data-a=close]').click()"); t(800)
    ok('back in routine dialog, step checked, no button', ev("B.shadowRoot.querySelector('#modal [data-rstep=\"1\"]').checked") and not ev("!!B.shadowRoot.querySelector('#modal [data-a=rzgo]')"))
    ev("B.shadowRoot.querySelector('#modal [data-rstep=\"2\"]').click()"); t(1200)
    ok('routine finished: stars of the routine', ev(f"A._st('{D}','RM','K')")=='d' and pts()==5+4, pts())
    # Eltern nehmen die Routine zurück → Putzen des Schritts geht mit zurück
    ev(f"A._adminSet('{D}','RM','K',false); 0"); t(900)
    ok('undo routine: stars, bonus, counter, streak back', pts()==0 and z()['n']==3 and z()['sn']==6 and z()['sd']=='2026-11-10', [pts(), z()])
    ok('undo routine: teeth step open again, others kept', ev(f"A._routDone('{D}','RM','K',3)")==[0,2] and ev(f"A._mark('{D}','zt:TZ:K')")=='', ev(f"A._routDone('{D}','RM','K',3)"))
    # „Nur mit Timer abhaken“: Häkchen des Schritts gesperrt
    ev("A._zSet({only:true}); 0"); t(800); ev("B._render()"); t(300)
    ev("B.shadowRoot.querySelector('.tile').click()"); t(500)
    ok('timer-only: step checkbox disabled, button there', ev("B.shadowRoot.querySelector('#modal [data-rstep=\"1\"]').disabled") and ev("!!B.shadowRoot.querySelector('#modal [data-a=rzgo]')"))
    ev("B._closeModal()"); t(300)
    # Zähne aus: normaler Schritt
    ev("A._setCfg({zOn:false}); 0"); t(800); ev("B._render()"); t(300); ev("B.shadowRoot.querySelector('.tile').click()"); t(500)
    ok('teeth off: plain step', not ev("!!B.shadowRoot.querySelector('#modal [data-a=rzgo]')") and not ev("B.shadowRoot.querySelector('#modal [data-rstep=\"1\"]').disabled"))
    # --- Text-Schritt mit 🦷 (z. B. aus der Vorlage „Morgen-Routine“) startet ebenfalls den Timer
    ev("A._setCfg({zOn:true}); A._zSet({only:false}); A._save('task','RA',{title:'Abendroutine',emoji:'🌙',points:3,kids:['K'],sched:'week',days:[],created:'2026-10-01',steps:[{t:'🚿 Waschen'},{t:'🦷 Zähne putzen'},{t:'👕 Pyjama',z:true},{t:'🦷 Zahnseide',z:false}]}); 0"); t(900)
    ok('text steps: 🦷 prefix on, z:true on, z:false off', ev("B._zStepIdx(B._db.task.RA)")==[1,2], ev("B._zStepIdx(B._db.task.RA)"))
    ok('saved z flags survive cleaning', ev("JSON.stringify(A._db.task.RA.steps.map(x=>x.z))")=='[null,null,true,false]', ev("JSON.stringify(A._db.task.RA.steps)"))
    ev("A._save('task','RA',{...A._db.task.RA,steps:[{t:'🚿 Waschen'},{t:'🦷 Zähne putzen'}]}); 0"); t(800)
    n0=z()['n']
    ev("B._render()"); t(300)
    ev("[...B.shadowRoot.querySelectorAll('.tile')].find(x=>x.textContent.includes('Abendroutine')).click()"); t(500)
    ok('text step shows timer button', ev("[...B.shadowRoot.querySelectorAll('#modal [data-a=rzgo]')].map(x=>x.dataset.i)")==['1'])
    ev("B.shadowRoot.querySelector('#modal [data-rstep=\"0\"]').click()"); t(300)
    ev("B.shadowRoot.querySelector('#modal [data-a=rzgo]').click()"); t(1500); pg.wait_for_timeout(500); t(1000)
    ok('timer runs under the routine', ev(f"{run}._tid")=='RA')
    ev(f"{run}.shadowRoot.querySelector('[data-a=go]').click()"); t(125000); pg.wait_for_timeout(300); t(3000)
    ok('text step: brushing counted, mark on routine', z()['n']==n0+1 and ev(f"A._mark('{D}','zt:RA:K')")=='1', [z(), ev(f"A._mark('{D}','zt:RA:K')")])
    ev(f"{run}.shadowRoot.querySelector('[data-a=close]').click()"); t(1500)
    ok('text step routine finished with stars', ev(f"A._st('{D}','RA','K')")=='d', ev(f"A._st('{D}','RA','K')"))
    ev("B._closeModal()"); t(300)
    ev(f"A._adminSet('{D}','RA','K',false); 0"); t(900)
    ok('undo: text step open again, counter back', ev(f"A._routDone('{D}','RA','K',2)")==[0] and z()['n']==n0, [ev(f"A._routDone('{D}','RA','K',2)"), z()['n'], n0])
    # Editor: 🦷-Schalter nur bei Text-Schritten
    ev("A._editTask('RA')"); t(1200); pg.wait_for_timeout(400); t(400)
    zb=ev("[...A.shadowRoot.querySelectorAll('#modal [data-rs=z]')].map(x=>x.getAttribute('aria-pressed'))")
    ok('editor: 🦷 toggle per text step', zb==['false','true'], zb)
    ev("A.shadowRoot.querySelectorAll('#modal [data-rs=z]')[0].click()"); t(200)
    ok('editor: toggle switches step on', ev("JSON.parse(A.shadowRoot.querySelector('#modal input[name=steps]').value)[0].z")==True)
    ev("A._closeModal()"); t(300)
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
