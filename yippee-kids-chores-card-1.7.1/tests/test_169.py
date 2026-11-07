# 1.7.0: 🎁 Belohnungen „👧 Nach Kind“ sortieren (Eltern-Ansicht) + Berichte-Reiter mit großem Anfangsbuchstaben
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
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:12,total:30,order:2});A._save('kid','B',{name:'Ben',emoji:'🐻',points:10,total:10,order:1});A._save('kid','N',{name:'Anna',emoji:'🐰',points:5,total:5,order:3});
      A._save('reward','r1',{title:'Eis',emoji:'🍦',cost:30});
      A._save('reward','r2',{title:'Lego',emoji:'🧱',cost:150,kids:['B']});
      A._save('reward','r3',{title:'Pony reiten',emoji:'🐴',cost:80,kids:['K']});
      A._save('reward','r4',{title:'Kino',emoji:'🍿',cost:60,kids:['K','B']});
      A._save('reward','r5',{title:'Waffeln',emoji:'🧇',cost:40,share:true});
      A._save('reward','r6',{title:'Zoo',emoji:'🦁',cost:20,kids:['K','B','N']});
      A._setCfg({shareOn:true}); A._tab='belohnungen'; A._render();})()"""); t(800)
    groups=lambda: ev("""[...A.shadowRoot.querySelectorAll('.box')].find(b=>/Belohnungen/.test((b.querySelector('h3')||{}).textContent||'')) ? (()=>{const out=[]; let cur=null; const box=[...A.shadowRoot.querySelectorAll('.box')].find(b=>/Belohnungen/.test((b.querySelector('h3')||{}).textContent||'')); box.querySelectorAll('.tcat, .row').forEach(e=>{ if(e.classList.contains('tcat')){cur=[e.textContent.trim(),[]]; out.push(cur);} else if(cur && e.querySelector('[data-a=erew]')){ cur[1].push((e.querySelector('.grow')||e).textContent.trim().split(/\\s+/)[0]); } }); return out})() : null""")
    ok('three sort buttons', ev("[...A.shadowRoot.querySelectorAll('[data-a=rws]')].map(b=>b.dataset.m)")==['stars','az','kid'])
    ev("A.shadowRoot.querySelector('[data-a=rws][data-m=kid]').click()"); t(800)
    ok('saved', ev("A._cfg.rwSort")=='kid')
    ok('button marked', ev("A.shadowRoot.querySelector('[data-a=rws][data-m=kid]').classList.contains('on')"))
    heads=ev("[...A.shadowRoot.querySelectorAll('.tcat')].map(x=>x.textContent.trim())")
    ok('groups in kid order, then all, together', heads==['🐻 Ben','🦊 Mia','👨‍👩‍👧 Für alle Kinder','👫 Gemeinsam / Einladen'], heads)
    # Inhalt je Gruppe: Reihen zwischen den Überschriften
    content=ev("""(()=>{const out={}; let cur=null; [...A.shadowRoot.querySelectorAll('.tcat, [data-a=erew][data-id]')].forEach(e=>{ if(e.classList.contains('tcat')) {cur=e.textContent.trim(); out[cur]=[];} else if(cur) out[cur].push(e.dataset.id); }); return out})()""")
    ok('Ben: Kino (shared Mia+Ben) and Lego, by stars', content.get('🐻 Ben')==['r4','r2'], content)
    ok('Mia: Kino and Pony', content.get('🦊 Mia')==['r4','r3'], content)
    ok('for all: Zoo (all three ticked) and Eis', content.get('👨‍👩‍👧 Für alle Kinder')==['r6','r1'], content)
    ok('together: Waffeln', content.get('👫 Gemeinsam / Einladen')==['r5'], content)
    ok('no empty group for Anna', '🐰 Anna' not in heads)
    # Kinder-Ansicht unverändert (Sternen-Sortierung)
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'})"); t(800)
    kh=ev("[...B.shadowRoot.querySelectorAll('.rwh')].map(x=>x.textContent.trim())")
    ok('kid view unchanged groups', '🦊 Mia' not in kh and all('Ben' not in x for x in kh), kh)
    # zurück
    ev("A.shadowRoot.querySelector('[data-a=rws][data-m=az]').click()"); t(600)
    ok('back to A-Z', ev("A._cfg.rwSort")=='az' and ev("[...A.shadowRoot.querySelectorAll('.tcat')].map(x=>x.textContent.trim())")[0].startswith('🎁'))
    # nur ein Kind: kein „Nach Kind“
    ev("A._setCfg({rwSort:'kid'}); A._del('kid','B'); A._del('kid','N'); A._render()"); t(800)
    hs=ev("[...A.shadowRoot.querySelectorAll('.tcat')].map(x=>x.textContent.trim())")
    ok('one kid: no by-child button, normal groups', not ev("!!A.shadowRoot.querySelector('[data-a=rws][data-m=kid]')") and not any('Mia' in x or 'Für alle' in x for x in hs), hs)
    # Berichte-Reiter: großer Anfangsbuchstabe auch in Sprachen mit kleingeschriebenem „Wochen“
    ev("A._setCfg({lang:'en'})"); t(500); pg.wait_for_timeout(1500); t(300)
    ev("A._tab='kinder'; A._repOpen=true; A._repMode='d'; A._render()"); t(600)
    ok('reports tab capitalised', ev("getComputedStyle(A.shadowRoot.querySelector('.repbox .seg button[data-m=w]'),'::first-letter').textTransform")=='uppercase')
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
