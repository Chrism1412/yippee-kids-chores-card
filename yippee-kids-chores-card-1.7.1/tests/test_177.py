# 1.7.0 (GitHub #14): Erledigte Freigaben verschwinden auf allen Handys (Nachricht mit Kennung, danach clear_notification)
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1200}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{window.calls=[]; const cs=A._hass.callService; const h={...A._hass, callService:(d,s,data,tg,n)=>{ if(d==='notify') window.calls.push([s, data.message, (data.data||{}).tag||'', !!((data.data||{}).actions)]); return cs(d,s,data,tg,n); }}; A.hass=h; B.hass=h;
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:20,total:20});
      A._save('task','T',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._save('reward','r1',{title:'Eis',emoji:'🍦',cost:5});
      A._setCfg({approval:true, nTask:true, nReward:true, targets:['mobile_app_phone_a','mobile_app_phone_c','notify.familienchat']});})()"""); t(1000)
    clears=lambda: [c for c in ev("window.calls") if c[1]=='clear_notification']
    # 1) Nachricht bekommt Kennung (nur Handy-App-Ziele)
    ev("window.calls=[]; A._notify('✅ Mia hat „Zähne putzen“ erledigt – bitte freigeben.','task',[['✓ Freigeben','KP|ok|2026-10-30|T|K'],['✕ Ablehnen','KP|no|2026-10-30|T|K']])"); t(300)
    c=ev("window.calls")
    ok('push to phones carries tag + buttons', [x[2] for x in c if x[0].startswith('mobile_app_')]==['yippee_t_2026-10-30_T_K']*2 and all(x[3] for x in c if x[0].startswith('mobile_app_')), c)
    ok('no tag for notify entities', all(x[2]=='' for x in c if not x[0].startswith('mobile_app_')), c)
    ev("A._setCfg({nActions:false}); window.calls=[]; A._notify('x','task',[['✓','KP|rok|Q9'],['✕','KP|rno|Q9']]); A._setCfg({nActions:true})"); t(300)
    ok('tag also without buttons', [x[2] for x in ev("window.calls") if x[0]=='mobile_app_phone_a']==['yippee_r_Q9'] and not any(x[3] for x in ev("window.calls")), ev("window.calls"))
    # 2) Aufgabe wartet → in der Karte freigegeben → auf allen Handys weg
    ev("A._setSt('2026-10-30','T','K','p')"); t(1500)
    ev("window.calls=[]; A._adminSet('2026-10-30','T','K',true)"); t(2500)
    cl=clears()
    ok('approved in card: clear on both phones', sorted(x[0] for x in cl)==['mobile_app_phone_a','mobile_app_phone_c'] and all(x[2]=='yippee_t_2026-10-30_T_K' for x in cl), cl)
    ok('not sent to notify entity', not any(x[0]=='send_message' for x in cl))
    ok('only once despite two cards on the page', len(cl)==2)
    # 3) per Knopf in der Nachricht abgelehnt (act) → weg
    ev("A._setSt('2026-10-30','T','K','p')"); t(1500)
    ev("window.calls=[]; A._save('act','a1',{a:'KP|no|2026-10-30|T|K'})"); t(4000)
    ok('rejected via button: cleared', any(x[2]=='yippee_t_2026-10-30_T_K' for x in clears()), ev("window.calls"))
    # 4) Kind nimmt zurück → weg
    ev("window.__kpClr={}; A._setSt('2026-10-30','T','K','p')"); t(1500)
    ev("window.calls=[]; A._setSt('2026-10-30','T','K','')"); t(1500)
    ok('withdrawn: cleared', any(x[2]=='yippee_t_2026-10-30_T_K' for x in clears()))
    # 5) Belohnungs-Anfrage abgelehnt → weg; offene bleibt
    ev("A._save('req','Q1',{kid:'K',reward:'r1',d:'2026-10-30'}); A._save('req','Q2',{kid:'K',reward:'r1',d:'2026-10-30'})"); t(1500)
    ev("window.calls=[]; A._del('req','Q1')"); t(1500)
    tags=[x[2] for x in clears()]
    ok('reward request done: cleared, other stays', 'yippee_r_Q1' in tags and 'yippee_r_Q2' not in tags, tags)
    # 6) nichts erledigt → nichts entfernt
    ev("window.calls=[]; A._render(); A._save('kid','K',{...A._db.kid.K, points:21})"); t(1500)
    ok('unrelated change: no clear', clears()==[], clears())
    # 7) ohne Handy-Ziel: nichts
    ev("A._setCfg({targets:['notify.familienchat']})"); t(500)
    ev("window.calls=[]; A._del('req','Q2')"); t(1500)
    ok('no phone targets: no clear calls', clears()==[])
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
