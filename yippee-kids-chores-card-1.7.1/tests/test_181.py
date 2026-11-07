# 1.7.0: 🎄 Adventskalender als Modul – einschalten, Türchen befüllen, Kind öffnet, Sterne + Geschenk, nur-Advent-Belohnung versteckt
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
    ev("""A._save('kid','K',{name:'Mia',emoji:'🦊',color:'#e03131',points:5,total:5});A._save('kid','L',{name:'Ben',emoji:'🐻',points:0,total:0});
      A._save('reward','R1',{title:'Eis',emoji:'🍦',cost:30});A._save('reward','R2',{title:'Kino',emoji:'🎬',cost:80,adv:true});
      A._save('task','T1',{title:'Zähne putzen',emoji:'🪥',kids:['K'],points:2,sched:'daily'})"""); t(1500)
    # aus: kein Tab, kein Knopf, Modul nicht geladen
    ok('off: no advent tab', ev("!A.shadowRoot.querySelector('.tab[data-id=advent]')"))
    ok('off: no kid button', ev("!B.shadowRoot.querySelector('.advbtn')"))
    ok('off: module not loaded', ev("!customElements.get('yippee-advent')"))
    ok('off: adv reward hidden for kid', ev("!B.shadowRoot.textContent.includes('Kino') && B.shadowRoot.textContent.includes('Eis')"))
    # einschalten
    ev("A._setCfg({advOn:true})"); t(1500)
    ok('on: tab shown', ev("!!A.shadowRoot.querySelector('.tab[data-id=advent]')"))
    ev("A.shadowRoot.querySelector('.tab[data-id=advent]').click()"); t(300); pg.wait_for_timeout(800); t(800)
    ok('module loaded', ev("!!customElements.get('yippee-advent')"))
    el="A.shadowRoot.querySelector('yippee-advent')"
    ok('admin calendar mounted', ev(f"!!{el} && {el}.shadowRoot.querySelectorAll('.ec').length===24"), ev(f"!!{el}"))
    # Türchen 5 für Mia bearbeiten: Text, 3 Sterne, Geschenk Kino
    ev(f"{el}.shadowRoot.querySelector('.chip[data-k=K]').click()"); t(300)
    ev(f"{el}.shadowRoot.querySelector('.ec[data-n=\"5\"]').click()"); t(300)
    ok('emoji row visible in door dialog', ev(f"{el}.shadowRoot.querySelector('#modal .emos').getBoundingClientRect().height")>30)
    ev(f"""(()=>{{const r={el}.shadowRoot; r.querySelector('#modal [name=e]').value='🍪'; r.querySelector('#modal [name=t]').value='Plätzchen backen';
      r.querySelector('#modal [name=pts]').value='3'; r.querySelector('#modal [name=rwd]').value='R2'; r.querySelector('[data-a=dsave]').click();}})()"""); t(1500)
    k=item('kp|adk|K')
    ok('door saved in Yippee list', k and k['doors']['5']['t']=='Plätzchen backen' and k['doors']['5']['pts']==3 and k['doors']['5']['rwd']=='R2', k)
    ok('only calendar fields stored', k and 'name' not in k and 'points' not in k, k)
    # Kind-Ansicht: Knopf im Dezember, öffnen
    ok('kid button in december', ev("B.shadowRoot.querySelectorAll('.advbtn').length===2"))
    ok('kid button says door waits', 'Türchen 5 wartet' in ev("B.shadowRoot.querySelector('.advbtn').textContent"))
    ev("B.shadowRoot.querySelector('.advbtn[data-k=K]').click()"); t(500)
    kel="B.shadowRoot.querySelector('yippee-advent')"
    ok('kid calendar shown', ev(f"!!{kel} && {kel}.shadowRoot.querySelectorAll('.door').length===24"))
    ok('no kid tabs in single view', ev(f"!{kel}.shadowRoot.querySelector('.ktabs')"))
    ok('locked future door', ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"9\"]').classList.contains('locked')"))
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"5\"]').click()"); t(1000); pg.wait_for_timeout(300); t(1500)
    ok('reveal shows text', 'Plätzchen backen' in ev(f"{kel}.shadowRoot.querySelector('#modal').textContent"))
    ok('reveal shows gift', 'Kino' in ev(f"{kel}.shadowRoot.querySelector('#modal').textContent"))
    o=item('kp|ado|K')
    ok('opened stored', o and o['y']==2026 and '5' in o['d'] and o['b'].get('5')==1, o)
    ok('stars booked', ev("A._db.kid.K.points")==8, ev("A._db.kid.K.points"))
    hist=ev("A._db.kid.K.history||[]")
    ok('gift in history without cost', any(h.get('t')=='🎄 Kino' and h.get('c')==0 for h in hist), hist)
    # nochmal öffnen → keine doppelte Buchung
    ev(f"{kel}._closeModal(); {kel}.shadowRoot.querySelector('.door[data-n=\"5\"]').click()"); t(1500)
    ok('reopen: no double booking', ev("A._db.kid.K.points")==8)
    # zweites Gerät bucht dieselbe Buchungsnummer → wird ignoriert
    ev("A._addPoints('K',3,'x',null,'adv2605pK')"); t(500)
    ok('fixed id dedupe', ev("A._db.kid.K.points")==8)
    # Bedingung: Türchen 4 erst nach Zähne putzen
    ev("A._save('adk','K',{...A._db.adk.K, doors:{...A._db.adk.K.doors, 4:{e:'⭐',t:'Vier',cond:{t:'task',id:'T1'}}}})"); t(1500)
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"4\"]').click()"); t(1500)
    ok('condition blocks', '4' not in (item('kp|ado|K')['d']) and 'Zähne putzen' in ev(f"{kel}.shadowRoot.querySelector('#fx').textContent"))
    ev("A._save('log','2026-12-05',{s:{'T1:K':'d'}})"); t(1500)
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"4\"]').click()"); t(1500)
    ok('condition met opens', '4' in (item('kp|ado|K')['d']))
    # Zurück
    ev("B.shadowRoot.querySelector('[data-a=advclose]').click()"); t(300)
    ok('back to kid view', ev("!B.shadowRoot.querySelector('yippee-advent') && B.shadowRoot.querySelectorAll('.advbtn').length===2"))
    # nur-Advent-Belohnung: nicht bei den Kindern, nicht im Einlöse-Dialog der Eltern
    ok('adv reward hidden for kid', ev("!B.shadowRoot.textContent.includes('Kino')"))
    ok('adv reward excluded from _rewards', ev("A._rewards('K').map(r=>r.id).join()")=='R1')
    # Belohnungs-Tab: Hinweis 🎄 Nur im Adventskalender
    ev("A.shadowRoot.querySelector('.tab[data-id=belohnungen]').click()"); t(300)
    ok('admin reward marked', 'Nur im Adventskalender' in ev("A.shadowRoot.textContent"))
    # mode: advent Karte
    ev("""(()=>{const C=document.createElement('kinderpunkte-card');C.setConfig({storage:'todo.kinderpunkte',mode:'advent'});document.body.appendChild(C);C.hass=A._hass;window.C=C;})()"""); t(1500)
    ok('advent card: tabs for kids', ev("!!C.shadowRoot.querySelector('yippee-advent') && C.shadowRoot.querySelector('yippee-advent').shadowRoot.querySelectorAll('.ktab').length===2"))
    ev("C.setConfig({storage:'todo.kinderpunkte',mode:'advent',child:'Ben'})"); t(1500)
    ok('advent card with child: single', ev("C.shadowRoot.querySelector('yippee-advent').shadowRoot.textContent.includes('Ben') && !C.shadowRoot.querySelector('yippee-advent').shadowRoot.querySelector('.ktabs')"))
    # 🎚️ Türchengröße per Schieberegler (Eltern) – auf schmalen Bildschirmen automatisch kleiner
    ev("A.shadowRoot.querySelector('.tab[data-id=advent]').click()"); t(500); pg.wait_for_timeout(600); t(600)
    ev(f"{el}.shadowRoot.querySelector('.tab[data-id=look]').click()"); t(300)
    ev(f"(()=>{{const r={el}.shadowRoot.querySelector('[data-c=doorPx]'); r.value='160'; r.dispatchEvent(new Event('change',{{bubbles:true}}));}})()"); t(1500)
    ok('slider saves door size', ev("(A._db.adc.main||{}).doorPx")==160, ev("JSON.stringify(A._db.adc.main)"))
    ok('slider label shows value', '160 px' in ev(f"{el}.shadowRoot.textContent"))
    ev(f"{el}.shadowRoot.querySelector('[data-a=prev]').click()"); t(500)
    w=ev(f"{el}.shadowRoot.querySelector('.door').getBoundingClientRect().width")
    ok('doors bigger on wide screen', w>=150, w)
    pg.set_viewport_size({'width':390,'height':900}); t(500); pg.wait_for_timeout(300)
    w2=ev(f"{el}.shadowRoot.querySelector('.door').getBoundingClientRect().width")
    ak=ev(f"(()=>{{const a={el}.shadowRoot.querySelector('.ak .grid'); return [a.scrollWidth, a.clientWidth];}})()")
    ok('doors shrink on narrow screen', w2<=100 and ak[0]<=ak[1]+10, [w2, ak])
    pg.set_viewport_size({'width':900,'height':1400}); t(500); pg.wait_for_timeout(300)
    ev(f"{el}.shadowRoot.querySelector('[data-a=prevoff]').click()"); t(500)
    # 📱 nur dieses Gerät: Schalter → zweiter Regler, im Browser gespeichert, nicht in der Liste
    ev(f"(()=>{{const c={el}.shadowRoot.querySelector('[data-dv=on]'); c.checked=true; c.dispatchEvent(new Event('change',{{bubbles:true}}));}})()"); t(500)
    ok('device switch stores current size', ev("localStorage.getItem('kpAdvPx:todo.kinderpunkte')")=='160')
    ev(f"(()=>{{const r={el}.shadowRoot.querySelector('[data-dv=px]'); r.value='90'; r.dispatchEvent(new Event('change',{{bubbles:true}}));}})()"); t(800)
    ok('device size stored locally', ev("localStorage.getItem('kpAdvPx:todo.kinderpunkte')")=='90' and ev("(A._db.adc.main||{}).doorPx")==160)
    ok('device info line', 'Für alle: 160 px · Dieses Gerät: 90 px' in ev(f"{el}.shadowRoot.textContent"))
    ev(f"{el}.shadowRoot.querySelector('[data-a=prev]').click()"); t(500)
    w3=ev(f"{el}.shadowRoot.querySelector('.door').getBoundingClientRect().width")
    ok('device size wins', 80<=w3<=100, w3)
    # Karte mit advent_size: Gerät hat Vorrang, ohne Gerät gilt die Karte
    ev("C.setConfig({storage:'todo.kinderpunkte',mode:'advent',advent_size:200})"); t(1500)
    cw=lambda: ev("C.shadowRoot.querySelector('yippee-advent').shadowRoot.querySelector('.door').getBoundingClientRect().width")
    ok('device beats card size', 80<=cw()<=100, cw())
    ev(f"{el}.shadowRoot.querySelector('[data-a=prevoff]').click()"); t(500)
    ev(f"(()=>{{const c={el}.shadowRoot.querySelector('[data-dv=on]'); c.checked=false; c.dispatchEvent(new Event('change',{{bubbles:true}}));}})()"); t(500)
    ok('device switch off removes', ev("localStorage.getItem('kpAdvPx:todo.kinderpunkte')") is None)
    ev("C.setConfig({storage:'todo.kinderpunkte',mode:'advent',advent_size:200})"); t(1500)
    ok('card size applies', cw()>=180, cw())
    # Karten-Editor: Feld nur bei Kind/Alle Kinder/Advent, Eltern-Ansicht entfernt es
    ev("""(()=>{const E=document.createElement('yippee-kids-chores-card-editor');document.body.appendChild(E);E.hass=A._hass;E.setConfig({storage:'todo.kinderpunkte',mode:'advent'});window.E=E;window.EC=null;E.addEventListener('config-changed',e=>window.EC=e.detail.config);})()"""); t(500)
    ev("(()=>{const s=E.shadowRoot.querySelector('[data-k=advent_size]'); s.value='120'; s.dispatchEvent(new Event('change',{bubbles:true}));})()"); t(300)
    ok('editor sets advent_size', (ev("window.EC") or {}).get('advent_size')==120, ev("window.EC"))
    ev("(()=>{const s=E.shadowRoot.querySelector('[data-k=mode]'); s.value='admin'; s.dispatchEvent(new Event('change',{bubbles:true}));})()"); t(300)
    ok('editor: admin drops advent_size', 'advent_size' not in (ev("window.EC") or {}) and not ev("!!E.shadowRoot.querySelector('[data-k=advent_size]')"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
