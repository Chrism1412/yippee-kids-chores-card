# 1.7.0: 🎄 Adventskalender – Einschalten per Schalter, Belohnungs-Haken, Sicherung, Englisch, Kind ohne Admin-Aufrufe, Vorlagen
from playwright.sync_api import sync_playwright
import datetime, atexit, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-20T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5});A._save('reward','R1',{title:'Eis',emoji:'🍦',cost:30})"""); t(1500)
    # Schalter in den Einstellungen
    ev("A.shadowRoot.querySelector('.tab[data-id=einst]').click()"); t(300)
    ok('switch shown in settings', ev("!!A.shadowRoot.querySelector('[data-k=advOn],[data-f=advOn],[data-key=advOn]') || A.shadowRoot.textContent.includes('🎄 Adventskalender')"))
    ev("A._setCfg({advOn:true})"); t(1500)
    # Belohnung: Haken „Nur im Adventskalender“ im Editor
    ev("A.shadowRoot.querySelector('.tab[data-id=belohnungen]').click()"); t(300)
    ev("A._editReward('R1')"); t(300)
    has=ev("!!A.shadowRoot.querySelector('#modal [name=advr]')")
    ok('reward editor has advent checkbox', has)
    ev("A.shadowRoot.querySelector('#modal [name=advr]').checked=true; A.shadowRoot.querySelector('#modal [data-a=msave], #modal .primary').click()"); t(1500)
    ok('reward saved as adv', ev("A._db.reward.R1.adv===true"), ev("JSON.stringify(A._db.reward.R1)"))
    ok('adv reward hidden for kid view', ev("!B.shadowRoot.textContent.includes('Eis')"))
    # November: kein 🎄-Knopf bei den Kindern
    ok('no kid button in november', ev("!B.shadowRoot.querySelector('.advbtn')"))
    # Testmodus macht Dezember (nur dieses Gerät)
    ev("localStorage.setItem('kpAdvTest:todo.kinderpunkte','2026-12-03'); B._render()"); t(300)
    ok('kid button in test mode', ev("!!B.shadowRoot.querySelector('.advbtn')"))
    ev("B.shadowRoot.querySelector('.advbtn').click()"); t(800); pg.wait_for_timeout(400); t(400)
    kel="B.shadowRoot.querySelector('yippee-advent')"
    ok('kid test banner', 'Testmodus' in ev(f"{kel}.shadowRoot.textContent"))
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"2\"]').click()"); t(1500)
    ok('test mode: not stored', not any(i['summary']=='kp|ado|K' for i in ev("items['todo.kinderpunkte']")))
    ev("localStorage.removeItem('kpAdvTest:todo.kinderpunkte'); B.shadowRoot.querySelector('[data-a=advclose]').click()"); t(300)
    # Vorlagen füllen (Eltern)
    ev("A.shadowRoot.querySelector('.tab[data-id=advent]').click()"); t(300); pg.wait_for_timeout(800); t(800)
    el="A.shadowRoot.querySelector('yippee-advent')"
    ev(f"{el}.shadowRoot.querySelector('[data-a=tplfill]').click()"); t(1500)
    d=json.loads(ev("JSON.stringify(A._db.adk.K||{})"))
    ok('all 24 doors filled', len([x for x in (d.get('doors') or {}).values() if x.get('t')])==24, len(d.get('doors') or {}))
    ok('nicholas special on 6', 'Nikolaus' in (d.get('doors',{}).get('6',{}).get('t','')))
    # Sicherung enthält Türchen
    bk=json.loads(ev("A._backupJson()"))
    ok('backup has advent doors', 'K' in bk['data'].get('adk',{}) and bk['data']['adk']['K']['doors'].get('6'))
    # ältere Sicherung ohne Adventskalender löscht die Türchen nicht
    ev("(()=>{const j=JSON.parse(A._backupJson()); delete j.data.adk; delete j.data.adc; A._applyBackup(j);})()"); t(2000)
    ok('old backup keeps doors', ev("!!(A._db.adk.K && A._db.adk.K.doors && A._db.adk.K.doors['6'])"))
    # Sprache Englisch: Kalender übersetzt
    ev("A._setCfg({lang:'en'})"); t(1500); pg.wait_for_timeout(800); t(800)
    ev("A._render()"); t(500)
    txt=ev(f"{el}.shadowRoot.textContent")
    ok('english advent ui', 'Fill empty doors automatically' in txt, txt[:200])
    ok('english tab label', 'Advent' in ev("A.shadowRoot.querySelector('.tab[data-id=advent]').textContent"))
    # Ausschalten: Tab weg, Eltern landen wieder auf Heute
    ev("A._setCfg({advOn:false})"); t(1500)
    ok('off: tab hidden', ev("!A.shadowRoot.querySelector('.tab[data-id=advent]')"))
    ok('off: calendar removed', ev("!A.shadowRoot.querySelector('yippee-advent')"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
