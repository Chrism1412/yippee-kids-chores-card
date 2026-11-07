# 1.7.0: Zusammenführen der Punkte-Buchungen schreibt keinen veralteten Stand zurück (z. B. Handy im Standby) – erledigte Gutscheine kamen sonst wieder
from playwright.sync_api import sync_playwright
import datetime, atexit, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1200}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-03T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    kidItem=lambda: json.loads(ev("items['todo.kinderpunkte'].find(i=>i.summary==='kp|kid|K').description"))
    ev("""A._save('kid','K',{name:'Mia',emoji:'🦊',points:50,total:50,vouch:[{id:'v1',t:'Eis',e:'🍦',d:'2026-11-03'}]})"""); t(1500)
    # eine offene Buchung (+1), alt genug zum Zusammenführen
    ev("A._addPoints('K',1,'Test')"); t(1500)
    ok('setup: voucher stored, booking pending', [v['id'] for v in kidItem().get('vouch',[])]==['v1'] and ev("Object.keys(A._db.pt).length")==1)
    # Ablauf nachstellen: Diese Karte liest die Liste (Gutschein noch da) – dann schläft das Handy;
    # inzwischen hat ein anderes Gerät „Bekommen“ verbucht und zusammengeführt (Gutschein weg)
    ev("""(()=>{window.__off=0; const rn=Date.now; Date.now=()=>rn()+window.__off;
      const cw=A._hass.callWS; let first=true;
      A._hass.callWS=async(m)=>{ const r=await cw(m);
        if(m.type==='todo/item/list' && first && window.__race){ first=false;
          const stale=JSON.parse(JSON.stringify(r));
          const it=items['todo.kinderpunkte'].find(i=>i.summary==='kp|kid|K'); const o=JSON.parse(it.description); delete o._c;
          o.vouch=[]; o.ap=['other-device', ...(o.ap||[])]; it.description=JSON.stringify(o);
          window.__off+=10000;  // Standby
          return stale; }
        return r; }; })()""")
    ev("clearTimeout(A._consT); window.__off+=6000")  # Buchung alt genug, ohne dass der Zeitgeber vorher zusammenführt
    ev("window.__race=true; A._consCheck()"); t(500); pg.wait_for_timeout(1500); t(500)
    k=kidItem()
    ok('booking merged', k.get('points')==51 and ev("Object.keys(A._db.pt).length")==0, [k.get('points'), ev("Object.keys(A._db.pt)")])
    ok('voucher handled on the other device stays gone', k.get('vouch',[])==[], k.get('vouch'))
    ok('booking mark of the other device kept', 'other-device' in (k.get('ap') or []))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
