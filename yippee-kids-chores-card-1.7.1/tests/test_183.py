# 1.7.1: ⏰ Buchungen mit falscher Geräte-Uhr (Zeitstempel in der Zukunft) bleiben nicht hängen, eingelöste Gutscheine kommen nie wieder,
#        🧹 Adventskalender „Komplett zurücksetzen“, 🔁 Hinweis bei veralteter Sensor-Vorlage
from playwright.sync_api import sync_playwright
import datetime, atexit, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-12-05T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    item=lambda s: next((json.loads(i['description']) for i in ev("items['todo.kinderpunkte']") if i['summary']==s), None)
    has=lambda s: any(i['summary']==s for i in ev("items['todo.kinderpunkte']"))
    def merge():
        t(6500); ev("A._consCheck()"); t(500); pg.wait_for_timeout(800); t(1500)
    ev("""A._save('kid','K',{name:'Mia',emoji:'🦊',points:10,total:10});A._save('kid','L',{name:'Ben',emoji:'🐻',points:0,total:0});
      A._save('reward','R1',{title:'Eis',emoji:'🍦',cost:30,adv:true}); A._setCfg({walletOn:true})"""); t(1500)

    # ⏰ Buchung mit Zeitstempel weit in der Zukunft (Handy-Uhr auf 24.12. gestellt) – wird trotzdem verrechnet
    ev("""A._save('pt','futgift',{k:'K',n:0,r:'🎁 Geschenkt: Eis',d:'2026-12-24',t:'16:56',ts:Date.now()+19*864e5,
      o:{push:[['history',{d:'2026-12-24',t:'🎄 Eis',e:'🍦',c:0},10],['vouch',{id:'vf',t:'Eis',e:'🍦',d:'2026-12-24'},50]]}})"""); t(1500)
    merge()
    k=item('kp|kid|K')
    ok('future booking merged', [v['id'] for v in k.get('vouch',[])]==['vf'] and not has('kp|pt|futgift'), [k.get('vouch'), has('kp|pt|futgift')])
    # einlösen → bleibt weg, auch wenn dieselbe Gutschein-Buchung verspätet noch einmal ankommt
    ev("A._addPoints('K',0,'🎟️ Gutschein',{unvouch:'vf'})"); t(500)
    merge()
    k=item('kp|kid|K')
    ok('voucher redeemed', not k.get('vouch') and 'vf' in (k.get('vgone') or []), k)
    ev("""A._save('pt','late1',{k:'K',n:0,r:'x',d:'2026-12-05',t:'10:00',ts:Date.now()-60000,o:{push:[['vouch',{id:'vf',t:'Eis',e:'🍦',d:'2026-12-24'},50]]}})"""); t(1500)
    ok('late voucher not shown', not (ev("A._db.kid.K.vouch") or []), ev("A._db.kid.K.vouch"))
    merge()
    ok('late voucher not stored', not item('kp|kid|K').get('vouch'), item('kp|kid|K').get('vouch'))
    ev("A._addPoints('K',0,'x',{push:[['vouch',{id:'vn',t:'Kino',e:'🎬',d:'2026-12-05'},50]]})"); t(500)
    ok('new voucher still works', [v['id'] for v in (ev("A._db.kid.K.vouch") or [])]==['vn'])
    ev("A._addPoints('K',0,'🎟️ Gutschein',{unvouch:'vn'})"); t(300)
    merge()

    # 🧹 Adventskalender: Türchen öffnen (Sterne + Gutschein-Geschenk), verrechnen, dann komplett zurücksetzen
    ev("A._setCfg({advOn:true})"); t(1000)
    ev("A._save('adk','K',{doors:{3:{e:'⭐',t:'Drei',pts:2,rwd:'R1'},4:{e:'🍪',t:'Vier',pts:3},5:{e:'🎅',t:'Fünf',pts:1}}})"); t(1500)
    base=ev("A._db.kid.K.points"); tot=ev("A._db.kid.K.total")
    ev("""(()=>{const C=document.createElement('kinderpunkte-card');C.setConfig({storage:'todo.kinderpunkte',mode:'advent',child:'Mia'});document.body.appendChild(C);C.hass=A._hass;window.C=C;})()"""); t(1500); pg.wait_for_timeout(800); t(800)
    kel="C.shadowRoot.querySelector('yippee-advent')"
    for n in (3,4):
        ev(f"{kel}._closeModal(); {kel}.shadowRoot.querySelector('.door[data-n=\"{n}\"]').click()"); t(1500)
    merge()
    k=item('kp|kid|K')
    ok('setup: doors booked + merged', k['points']==base+5 and any(v['t']=='Eis' for v in k.get('vouch',[])) and 'adv2603pK' in k.get('ap',[]), [k['points'], base, k.get('vouch'), k.get('ap',[])[:5]])
    ev(f"{kel}._closeModal(); {kel}.shadowRoot.querySelector('.door[data-n=\"5\"]').click()"); t(1500)   # noch nicht verrechnet
    ok('setup: door 5 pending', has('kp|pt|adv2605pK') and ev("A._db.kid.K.points")==base+6)
    ev("A.shadowRoot.querySelector('.tab[data-id=advent]').click()"); t(500); pg.wait_for_timeout(800); t(800)
    el="A.shadowRoot.querySelector('yippee-advent')"
    ev(f"{el}.shadowRoot.querySelector('.chip[data-k=K]').click()"); t(300)
    ev(f"{el}.shadowRoot.querySelector('[data-a=advreset]').click()"); t(300)
    ok('reset asks first', 'Nochmal tippen' in ev(f"{el}.shadowRoot.querySelector('[data-a=advreset]').textContent") and item('kp|ado|K') and len(item('kp|ado|K')['d'])==3)
    ev(f"{el}.shadowRoot.querySelector('[data-a=advreset]').click()"); t(1500)
    merge()
    k=item('kp|kid|K'); o=item('kp|ado|K')
    ok('reset: doors closed', o and not o['d'] and not o['b'], o)
    ok('reset: pending booking removed', not has('kp|pt|adv2605pK'))
    ok('reset: stars back', k['points']==base and k['total']==tot, [k['points'], base, k['total'], tot])
    ok('reset: voucher + history gone', not any(v['t']=='Eis' for v in k.get('vouch',[])) and not any(h.get('t')=='🎄 Eis' and h.get('d')=='2026-12-05' for h in k.get('history',[])), [k.get('vouch'), k.get('history')])
    ok('reset: bookings forgotten', not any(x.startswith('adv26') for x in k.get('ap',[])), k.get('ap',[])[:6])
    ok('reset: shown in ledger', any('Zurückgenommen' in (x.get('r') or '') for x in k.get('ledger',[])))
    # danach wird wieder ganz normal gebucht
    ev(f"{kel}._closeModal(); {kel}.shadowRoot.querySelector('.door[data-n=\"3\"]').click()"); t(1500)
    ok('reopen books again', ev("A._db.kid.K.points")==base+2 and any(v['t']=='Eis' for v in (ev("A._db.kid.K.vouch") or [])), [ev("A._db.kid.K.points"), ev("A._db.kid.K.vouch")])
    ok('other kid untouched', ev("A._db.kid.L.points")==0)

    # 🔁 Sensor-Vorlage: Hinweis, wenn die laufende Vorlage nicht zur aktuellen passt
    ev("A.shadowRoot.querySelector('.tab[data-id=heute]').click()"); t(300)
    ev("A._setCfg({sensKeep:true})"); t(800)
    def fake(sig):
        ev(f"""(()=>{{const h={{...A._hass, entities:{{...(A._hass.entities||{{}}), 'sensor.yippee_mia':{{platform:'template'}}, 'sensor.yippee_ben':{{platform:'template'}}}},
          states:{{...A._hass.states, 'sensor.yippee_mia':{{state:'5',attributes:{json.dumps({'vorlage':sig} if sig else {})}}}, 'sensor.yippee_ben':{{state:'0',attributes:{json.dumps({'vorlage':sig} if sig else {})}}}}}}}; A.hass=h; A._render();}})()"""); t(800)
    fake(None)
    ok('old template (1.7.0): hint shown', 'Sensor-Vorlage ist nicht mehr aktuell' in ev("A.shadowRoot.textContent"))
    sig=ev("A._tplSig()")
    yml=ev("A._sensYaml()")
    ok('template carries its id', yml.count(f'vorlage: "{sig}"')==2 and '@VORLAGE@' not in yml, sig)
    fake(sig)
    ok('current template: no hint', 'Sensor-Vorlage ist nicht mehr aktuell' not in ev("A.shadowRoot.textContent"))
    ev("A._save('kid','K',{...A._db.kid.K, order:5})") ; t(800)
    ok('id stable', ev("A._tplSig()")==sig)
    ev("A._setCfg({moneyOn:true})"); t(800)
    ok('changed template: hint shown', 'Sensor-Vorlage ist nicht mehr aktuell' in ev("A.shadowRoot.textContent") and ev("A._tplSig()")!=sig)
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
