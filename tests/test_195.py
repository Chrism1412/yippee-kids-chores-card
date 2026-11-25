# 2.0.0: 💰 Taschengeld – Spardose, Buchungen, Rechte, regelmäßiges Taschengeld, Sterne tauschen, Belohnung mit Geld, Sparziel, Fremdwährung, Rückblick, Währungsformat
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-11T16:00:00'))  # Mittwoch
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{window.__ws=[]; for (const X of [A,B]) { const cw=X._hass.callWS.bind(X._hass); X._hass.callWS=async(m)=>{ window.__ws.push(m.type); return cw(m); }; }
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:40,total:40}); A._save('kid','L',{name:'Ben',emoji:'🐻',points:5,total:5});
      A._save('task','T1',{title:'Tisch decken',emoji:'🍽️',points:2,kids:['K','L'],sched:'week',days:[],created:'2026-10-01'});
      A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._setCfg({approval:false, kView:'classic', parents:['admin1']});
      B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(1200)
    B=lambda q: ev(f"!!B.shadowRoot.querySelector('{q}')")
    ok('off by default: no piggy bank, no tab', not B('[data-a=mnopen]') and not ev("!!A.shadowRoot.querySelector('.tab[data-id=geld]')"))
    ev("A._setCfg({mnOn:true, mnCur:'EUR'}); 0"); t(1500); pg.wait_for_timeout(300); t(800)
    ok('tab appears for parents', ev("!!A.shadowRoot.querySelector('.tab[data-id=geld]')"))
    ok('kid sees piggy bank button 0,00 €', B('[data-a=mnopen]') and '0,00 €' in ev("B.shadowRoot.querySelector('[data-a=mnopen]').textContent"), ev("B.shadowRoot.querySelector('[data-a=mnopen]') && B.shadowRoot.querySelector('[data-a=mnopen]').textContent"))
    # Eltern: Startbetrag buchen
    ev("A.shadowRoot.querySelector('.tab[data-id=geld]').click()"); t(800); pg.wait_for_timeout(400); t(500)
    ok('tab lists kids', ev("A.shadowRoot.querySelectorAll('.mnkid').length")==2, ev("A.shadowRoot.querySelector('#app').textContent.slice(0,200)"))
    ev("A.shadowRoot.querySelector('.mnkid[data-k=K]').click()"); t(500)
    ok('parent opens kid page', 'Spardose von Mia' in ev("A.shadowRoot.querySelector('#app').textContent"))
    ev("A.shadowRoot.querySelector('[data-a=mnbook][data-d=in]').click()"); t(400)
    ev("(()=>{const m=A.shadowRoot.querySelector('#modal'); m.querySelector('[name=amt]').value='12,50'; m.querySelector('[name=txt]').value='Start'; m.querySelector('[name=start]').checked=true; m.querySelector('[data-a=msave]').click(); return 0})()"); t(800)
    ok('start booking 12,50 €', ev("A._mnBal('K')")==1250 and ev("Object.values(A._db.mb)[0].src")=='start', ev("JSON.stringify(A._db.mb)"))
    # Kind: selbst buchen erst nach Freigabe
    ev("B.shadowRoot.querySelector('[data-a=mnopen][data-k=K]').click()"); t(600); pg.wait_for_timeout(300); t(300)
    ok('kid page shows balance', '12,50 €' in ev("B.shadowRoot.querySelector('#app').textContent"), ev("B.shadowRoot.querySelector('#app').textContent.slice(0,300)"))
    ok('kid cannot book by default', not B('[data-a=mnbook]'))
    ok('kid has no delete buttons', not B('[data-a=mndel]'))
    ev("A._setCfg({mnSelf:true}); 0"); t(900)
    ev("B.shadowRoot.querySelector('[data-a=mnbook][data-d=out]').click()"); t(400)
    ev("(()=>{const m=B.shadowRoot.querySelector('#modal'); m.querySelector('[name=amt]').value='20'; m.querySelector('[data-a=msave]').click(); return 0})()"); t(500)
    ok('kid cannot spend more than saved', ev("B._mnBal('K')")==1250 and B('#modal [name=amt]'))
    ev("(()=>{const m=B.shadowRoot.querySelector('#modal'); m.querySelector('[name=amt]').value='2.50'; m.querySelector('[name=txt]').value='Comic'; m.querySelector('[data-a=msave]').click(); return 0})()"); t(800)
    ok('kid spends 2,50', ev("A._mnBal('K')")==1000, ev("A._mnBal('K')"))
    # Sterne tauschen
    ev("A._setCfg({mnRate:true}); A._save('mk','K',{rate:10, rmin:10}); 0"); t(900)
    ev("B.shadowRoot.querySelector('[data-a=mnx]').click()"); t(400)
    ev("B.shadowRoot.querySelector('#modal [data-mx=\"+\"]').click()"); t(100)
    ok('exchange shows 20 ⭐ = 2,00 €', '20 ⭐' in ev("B.shadowRoot.querySelector('#modal .mnxn').textContent") and '2,00' in ev("B.shadowRoot.querySelector('#modal .mnres').textContent"))
    ev("B.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(1200)
    ok('exchange: −20 ⭐, +2,00 €', ev("A._db.kid.K.points")==20 and ev("A._mnBal('K')")==1200, [ev("A._db.kid.K.points"), ev("A._mnBal('K')")])
    xid=ev("Object.values(A._db.mb).find(b=>b.src==='x').id")
    ev(f"A._mnAct('mndel',{{id:'{xid}'}})"); t(300); ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(1000)
    ok('parent deletes exchange: stars back', ev("A._db.kid.K.points")==40 and ev("A._mnBal('K')")==1000, [ev("A._db.kid.K.points"), ev("A._mnBal('K')")])
    # Regelmäßiges Taschengeld: wöchentlich 5 €, voll ab 80 %
    ev("A._setCfg({mnAllow:true}); A._save('mk','K',{...A._db.mk.K, amt:500, per:'w', min:80, from:'2026-11-11'}); 0"); t(900)
    ok('next allowance Monday 16.11.', ev("A._mnNext('K')")=='2026-11-16', ev("A._mnNext('K')"))
    # Mo–Sa erledigt, So nicht → 6/7 ≈ 86 % → voll
    ev("(()=>{for(const d of ['2026-11-09','2026-11-10','2026-11-11','2026-11-12','2026-11-13','2026-11-14']) A._adminSet(d,'T1','K',true); return 0})()"); t(900)
    pg.clock.run_for(5*24*3600*1000); t(70000); pg.wait_for_timeout(500); t(1000)
    al=ev("Object.values(A._db.mb).filter(b=>b.src==='allow').map(b=>[b.d,b.a,b.t])")
    ok('Monday: full allowance booked once', al==[['2026-11-16',500,'Taschengeld']], al)
    ev("B._mnTick(); A._mnTick(); 0"); t(800)
    ok('no double booking', len(ev("Object.values(A._db.mb).filter(b=>b.src==='allow')"))==1)
    # nächste Woche nur 2/7 erledigt → anteilig
    ev("(()=>{for(const d of ['2026-11-16','2026-11-17']) A._adminSet(d,'T1','K',true); return 0})()"); t(900)
    pg.clock.run_for(7*24*3600*1000); t(70000); pg.wait_for_timeout(500); t(1000)
    al=ev("Object.values(A._db.mb).filter(b=>b.src==='allow').map(b=>[b.d,b.a]).sort()")
    ok('second Monday: pro rata (29 %)', al[-1][0]=='2026-11-23' and 140<=al[-1][1]<=150, al)
    # Belohnung mit Geld (+) und (−)
    ev("A._setCfg({mnRw:true}); A._save('reward','RP',{title:'5 € extra',emoji:'💶',cost:10,mny:500}); A._save('reward','RK',{title:'Kino',emoji:'🎬',cost:10,mny:-100000}); 0"); t(900)
    b0=ev("A._mnBal('K')")
    ev("A._redeem('K','RP')"); t(1200)
    ok('reward pays 5 € into piggy bank', ev("A._mnBal('K')")==b0+500, [b0, ev("A._mnBal('K')")])
    p0=ev("A._db.kid.K.points"); ev("A._redeem('K','RK')"); t(1200)
    ok('reward too expensive in money: blocked, no stars taken', ev("A._db.kid.K.points")==p0, [p0, ev("A._db.kid.K.points")])
    # Sparziel
    ev("A._save('mk','K',{...A._db.mk.K, goal:{t:'Fahrrad',e:'🚲',amt:10000}}); A._mnKid=''; B._render(); 0"); t(900)
    ok('goal shown with progress', 'Fahrrad' in ev("B.shadowRoot.querySelector('#app').textContent") and B('.mngoal .bar i'))
    # Fremdwährung
    ev("A._setCfg({mnFx:true}); A._save('mb','fx1',{k:'K',a:2000,c:'TRY',d:'2026-11-20',t:'Urlaub'}); 0"); t(900)
    tot=ev("A._mnBal('K')")
    ok('foreign currency separate, not in total', ev("A._mnBal('K','TRY')")==2000 and B('.mnfx') and '₺' in ev("B.shadowRoot.querySelector('.mnfx').textContent"), [tot, ev("B.shadowRoot.querySelector('.mnfx') && B.shadowRoot.querySelector('.mnfx').textContent")])
    # Rückblick November (Taschengeld-Karte)
    ok('recap month sums', ev("JSON.stringify(A._mnMonth('K','2026-11'))")!='{"inn":0,"out":0}', ev("JSON.stringify(A._mnMonth('K','2026-11'))"))
    # Währungsformat je Sprache
    f=ev("""(()=>{const o={}; for (const [c] of [['EUR'],['CHF'],['GBP'],['USD'],['HUF'],['PLN'],['TRY'],['SEK']]) o[c]=A._mnFmt(123456,c); return o})()""")
    ok('currency formats', f['EUR']=='1.234,56 €' and 'CHF' in f['CHF'] and '£' in f['GBP'] and '$' in f['USD'] and 'Ft' in f['HUF'] and 'zł' in f['PLN'] and '₺' in f['TRY'] and 'kr' in f['SEK'], f)
    ok('parse amounts', [ev(f"A._mnParse('{x}')") for x in ['12,50','12.5','1.234,56','1,234.56','7']]==[1250,1250,123456,123456,700])
    ok('no admin-only calls', not [x for x in ev("window.__ws") if x.startswith('config/') or x.startswith('auth/list')], ev("window.__ws"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
