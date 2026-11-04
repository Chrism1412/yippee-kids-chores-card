# 1.7.0: 🎁 Belohnungen im Eltern-Bereich direkt einlösen (📋 Heute → 🎁) – einzeln und gemeinsam (Anteil / Einladen)
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:50,total:50});A._save('kid','B',{name:'Ben',emoji:'🐻',points:15,total:15});
      A._save('reward','r1',{title:'Eis',emoji:'🍦',cost:30});
      A._save('reward','r2',{title:'Kino',emoji:'🍿',cost:80});
      A._save('reward','r3',{title:'Lego',emoji:'🧱',cost:10,kids:['B']});
      A._save('reward','r4',{title:'Pizza',emoji:'🍕',cost:20,limit:1});
      A._save('reward','r5',{title:'Waffeln',emoji:'🧇',cost:20,share:true});
      A._setCfg({shareOn:true,walletOn:true,approval:true}); A._tab='heute'; A._render(); window.notes=[];})()"""); t(800)
    ok('gift button per kid', ev("A.shadowRoot.querySelectorAll('[data-a=ardm]').length")==2)
    ev("A.shadowRoot.querySelector('[data-a=ardm][data-k=K]').click()"); t(500)
    ok('dialog title', 'Mia' in ev("A.shadowRoot.querySelector('#modal h3').textContent"))
    rws=ev("[...A.shadowRoot.querySelectorAll('#modal [data-a=ardo]')].map(b=>[b.dataset.r,b.dataset.m,!b.disabled])")
    ok('only Mia rewards, enabled where affordable', ['r1','one',True] in rws and ['r2','one',False] in rws and not any(x[0]=='r3' for x in rws), rws)
    ok('shared: share + invite buttons', ['r5','share',True] in rws and ['r5','invite',True] in rws, rws)
    ok('not affordable shows missing stars', 'noch 30 ⭐' in ev("A.shadowRoot.querySelector('#modal').textContent"))
    # Einzeln einlösen mit Rückfrage
    b1="A.shadowRoot.querySelector('#modal [data-a=ardo][data-r=r1]')"
    ev(f"{b1}.click()"); t(200)
    ok('first tap asks', 'Wirklich' in ev(f"{b1}.textContent") and ev("A._db.kid.K.points")==50)
    ev(f"{b1}.click()"); t(1500)
    ok('redeemed: points', ev("A._db.kid.K.points")==20, ev("A._db.kid.K.points"))
    ok('history, but no voucher (parents hand it over right away)', ev("(A._db.kid.K.history||[]).some(h=>h.t==='Eis')") and not ev("(A._db.kid.K.vouch||[]).length"), ev("A._db.kid.K.vouch"))
    ok('no approval request / no "please approve"', not ev("Object.values(A._db.req).length") and not any('freigeben' in (n[0] if isinstance(n,list) else str(n)) for n in ev("window.notes||[]")), ev("window.notes"))
    ok('dialog closed', not ev("A.shadowRoot.querySelector('#modal').classList.contains('open')"))
    ok('audit entry', 'Eis' in ev("JSON.stringify(A._db.audit)"))
    # offene Anfrage des Kindes wird mit erledigt
    ev("A._save('req','Q1',{kid:'B',reward:'r3',d:'2026-10-30'})"); t(500)
    ev("A._parentRedeem('r3','B','one')"); t(1500)
    ok('open request consumed', not ev("!!A._db.req.Q1") and ev("A._db.kid.B.points")==5, [ev("Object.keys(A._db.req)"), ev("A._db.kid.B.points")])
    # Wochenlimit
    ev("(()=>{const o={...A._db.kid.K}; delete o.id; A._save('kid','K',{...o,points:100});})()"); t(500)
    ev("A._parentRedeem('r4','K','one')"); t(1500); ev("A._parentRedeem('r4','K','one')"); t(1500)
    ok('weekly limit respected', ev("A._db.kid.K.points")==80, ev("A._db.kid.K.points"))
    # Gemeinsam: jeder zahlt seinen Anteil
    ev("(()=>{const o={...A._db.kid.B}; delete o.id; A._save('kid','B',{...o,points:30});})()"); t(500)
    ev("A._parentRedeem('r5','K','share')"); t(2000)
    ok('share: both paid 10', ev("A._db.kid.K.points")==70 and ev("A._db.kid.B.points")==20, [ev("A._db.kid.K.points"), ev("A._db.kid.B.points")])
    ok('share: no vouchers', not ev("(A._db.kid.K.vouch||[]).length") and not ev("(A._db.kid.B.vouch||[]).length"))
    ok('share: history for both, pool gone', ev("(A._db.kid.K.history||[]).some(h=>h.t==='Waffeln')") and ev("(A._db.kid.B.history||[]).some(h=>h.t==='Waffeln')") and not ev("Object.values(A._db.req).some(q=>q.pool)"))
    # Gemeinsam: Mia lädt ein
    ev("A._parentRedeem('r5','K','invite')"); t(2000)
    ok('invite: Mia pays all 20', ev("A._db.kid.K.points")==50 and ev("A._db.kid.B.points")==20, [ev("A._db.kid.K.points"), ev("A._db.kid.B.points")])
    # Topf läuft schon (Ben hat seinen Anteil in der Kinder-Ansicht bezahlt) -> Eltern schließen ab
    ev("A._shareTap('r5','B','share')"); t(1000)
    ok('pool started by Ben', ev("Object.values(A._db.req).some(q=>q.pool)") and ev("A._db.kid.B.points")==10)
    ev("A.shadowRoot.querySelector('[data-a=ardm][data-k=K]').click()"); t(500)
    ok('dialog shows missing kid', 'Mia' in ev("A.shadowRoot.querySelector('#modal').textContent"))
    ev("A._parentRedeem('r5','K','share')"); t(2000)
    ok('pool finished: Mia paid her share', ev("A._db.kid.K.points")==40 and not ev("Object.values(A._db.req).some(q=>q.pool)"), [ev("A._db.kid.K.points"), ev("Object.values(A._db.req)")])
    # zu wenig Sterne -> nichts passiert
    ev("A._parentRedeem('r2','B','one')"); t(1500)
    ok('not enough stars: nothing booked', ev("A._db.kid.B.points")==10)
    # nicht-Eltern dürfen nicht
    ev("A._hass.user={id:'kid1',name:'Kind',is_admin:false}; A._setCfg({parents:['admin1']}); A._parentsOn=()=>true"); t(500)
    ev("A._parentRedeem('r1','K','one')"); t(1500)
    ok('non-parent cannot redeem', ev("A._db.kid.K.points")==40, ev("A._db.kid.K.points"))
    ev("A._hass.user={id:'admin1',name:'Papa',is_admin:true}; A._setCfg({parents:[]}); A._parentsOn=()=>false"); t(300)
    ev("(()=>{const o={...A._db.kid.K}; delete o.id; A._save('kid','K',{...o,points:60});})(); A._save('req','Q9',{kid:'K',reward:'r1',d:'2026-10-30'})"); t(800)
    ev("A._save('act','a9',{a:'KP|rok|Q9'})"); t(4000)
    ok('kid request approved via button: voucher as before', ev("(A._db.kid.K.vouch||[]).some(v=>v.t==='Eis')"), ev("A._db.kid.K.vouch"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
