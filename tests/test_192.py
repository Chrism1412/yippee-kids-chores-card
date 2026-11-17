# 1.9.0: 🎄 Adventskalender liest für Leseanfänger vor – automatisch, Sperr-Hinweise, 🔊-Knopf; beides abschaltbar; ohne Leseanfänger-Modus still
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
    ev("""A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5,rdr:true});A._save('kid','L',{name:'Ben',emoji:'🐻',points:0,total:0});
      A._save('reward','R2',{title:'Kino',emoji:'🎬',cost:80,adv:true});
      A._save('task','T1',{title:'Zähne putzen',emoji:'🪥',kids:['K','L'],points:2,sched:'daily'});
      A._save('adk','K',{doors:{5:{e:'🍪',t:'Plätzchen backen',msg:'Wir backen heute zusammen',pts:3,rwd:'R2'},4:{e:'⭐',t:'Vier',cond:{t:'task',id:'T1'}}}});
      A._save('adk','L',{doors:{5:{e:'🍪',t:'Plätzchen backen',pts:3}}});
      A._setCfg({advOn:true});
      window.__sp=[]; for (const X of [A,B]) { X._sayKid=function(txt,kid){ window.__sp.push([kid,txt]); }; } 0;"""); t(1500)
    # Hinweis in den Einstellungen
    ev("A.shadowRoot.querySelector('.tab[data-id=advent]').click()"); t(300); pg.wait_for_timeout(800); t(800)
    el="A.shadowRoot.querySelector('yippee-advent')"
    tabs=ev(f"[...{el}.shadowRoot.querySelectorAll('[data-a=tab]')].map(x=>x.dataset.id)") or []
    for tb in tabs:
        ev(f"{el}.shadowRoot.querySelector('[data-a=tab][data-id=\"{tb}\"]').click()"); t(400)
        if ev(f"!!{el}.shadowRoot.querySelector('[data-c=rdAuto]')"): break
    ok('settings: two switches, on by default', ev(f"{el}.shadowRoot.querySelector('[data-c=rdAuto]').checked && {el}.shadowRoot.querySelector('[data-c=rdLock]').checked"), tabs)
    ok('settings: names early readers', 'Gilt für: Mia' in ev(f"{el}.shadowRoot.textContent"))
    # Kind Mia (Leseanfängerin)
    ev("B.shadowRoot.querySelector('.advbtn[data-k=K]').click()"); t(500)
    kel="B.shadowRoot.querySelector('yippee-advent')"
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"9\"]').click()"); t(500)
    sp=ev("window.__sp")
    ok('lock hint read aloud', len(sp)==1 and sp[0][0]=='K' and 'Türchen 9' in sp[0][1], sp)
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"4\"]').click()"); t(800)
    sp=ev("window.__sp")
    ok('condition hint read aloud', len(sp)==2 and 'Zähne putzen' in sp[1][1], sp)
    ev("window.__sp=[]")
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"5\"]').click()"); t(800); pg.wait_for_timeout(300); t(300)
    ok('say button in door', ev(f"!!{kel}.shadowRoot.querySelector('#modal [data-a=rvsay]')"))
    ok('not read before door sound', len(ev("window.__sp"))==0, ev("window.__sp"))
    t(1800)
    sp=ev("window.__sp"); txt=sp[0][1] if sp else ''
    ok('read automatically after open', len(sp)==1 and sp[0][0]=='K', sp)
    ok('text: door, title, message, stars, gift', all(x in txt for x in ['Türchen 5.','Plätzchen backen.','Wir backen heute zusammen.','Du bekommst 3 Sterne!','Kino']), txt)
    ok('no emoji in spoken text', not any(ch in txt for ch in '🚪🍪💌🎁⭐🎬'), txt)
    ev(f"{kel}.shadowRoot.querySelector('#modal [data-a=rvsay]').click()"); t(300)
    ok('button reads again', len(ev("window.__sp"))==2)
    # wieder öffnen: kein automatisches Vorlesen, Knopf da
    ev(f"{kel}._closeModal(); window.__sp=[]; {kel}.shadowRoot.querySelector('.door[data-n=\"5\"]').click()"); t(2500)
    ok('reopen: not read automatically', len(ev("window.__sp"))==0 and ev(f"!!{kel}.shadowRoot.querySelector('#modal [data-a=rvsay]')"))
    ev(f"{kel}._closeModal()")
    # Schalter aus: kein Auto-Vorlesen, keine Sperr-Hinweise – Knopf bleibt
    ev("window.__sp=[]; const a=B.shadowRoot.querySelector('yippee-advent'); a._setCfg({rdAuto:false, rdLock:false})"); t(1500)
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"9\"]').click()"); t(500)
    ok('lock off: silent', len(ev("window.__sp"))==0, ev("window.__sp"))
    ev(f"{kel}._tmp={{}}; {kel}.shadowRoot.querySelector('.door[data-n=\"3\"]').click()"); t(1000); pg.wait_for_timeout(300); t(2500)
    ok('auto off: not read', len(ev("window.__sp"))==0, ev("window.__sp"))
    ok('auto off: button still there', ev(f"!!{kel}.shadowRoot.querySelector('#modal [data-a=rvsay]')"))
    ev(f"{kel}._closeModal()")
    ev("const a=B.shadowRoot.querySelector('yippee-advent'); a._setCfg({rdAuto:true, rdLock:true})"); t(1500)
    # Ben ohne Leseanfänger-Modus: still, kein Knopf
    ev("B.shadowRoot.querySelector('[data-a=advclose]').click()"); t(300)
    ev("window.__sp=[]; B.shadowRoot.querySelector('.advbtn[data-k=L]').click()"); t(500)
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"9\"]').click()"); t(500)
    ev(f"{kel}.shadowRoot.querySelector('.door[data-n=\"5\"]').click()"); t(1000); pg.wait_for_timeout(300); t(2500)
    ok('non-reader: nothing read', len(ev("window.__sp"))==0, ev("window.__sp"))
    ok('non-reader: no say button', ev(f"!{kel}.shadowRoot.querySelector('#modal [data-a=rvsay]')"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
