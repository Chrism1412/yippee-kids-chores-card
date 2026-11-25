# 2.0.0: 🧩 Kachel-Übersicht wie bei ⚙️ Einstellungen in den Reitern 🐾 Haustier, 💰 Taschengeld, 🦷 Zähne und 🎄 Advent
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-12-05T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:40,total:330,order:1}); A._save('kid','B2',{name:'Ben',emoji:'🐻',points:3,total:30,order:2});
      A._save('task','Z1',{title:'Zähne putzen',emoji:'🦷',points:1,kids:['K','B2'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({peOn:true,peHome:true,mnOn:true,zOn:true,advOn:true,new20ok:true});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true}); return 0})()"""); t(1500)
    ev("document.getElementById('b') && (document.getElementById('b').style.display='none')")
    def tab(name, n=8):
        ev(f"A._tab='{name}'; A._render()")
        for _ in range(n): t(400); pg.wait_for_timeout(150)
    R0="A.shadowRoot"
    vis=lambda root, sel: ev(f"[...{root}.querySelectorAll('{sel}')].filter(e=>!e.hidden && e.offsetParent!==null).length")
    # ---------- 🐾 ----------
    tab('tier')
    ok('pet: kids list stays on top', ev(f"!!{R0}.querySelector('.petab .perow')"))
    ok('pet: 7 tiles, sections hidden', ev(f"{R0}.querySelectorAll('.hubw[data-hub=pe] .hubt').length")==7 and vis(R0,'.hubw[data-hub=pe] > .hubs')==0, ev(f"{R0}.querySelectorAll('.hubw[data-hub=pe] .hubt').length"))
    ok('pet: tile shows "x von y an"', 'von' in ev(f"{R0}.querySelector('.hubt[data-hid=games] em').textContent"))
    ev(f"{R0}.querySelector('.hubt[data-hid=home]').click()"); t(300)
    ok('pet: tap opens only that section + back', vis(R0,'.hubw[data-hub=pe] > .hubs')==1 and ev(f"!{R0}.querySelector('.hubw[data-hub=pe] > .hubs[data-hid=home]').hidden") and ev(f"!{R0}.querySelector('.hubback').hidden") and ev(f"{R0}.querySelector('.hubtl').hidden"))
    ev("A._render()"); t(600)
    ok('pet: still open after re-render', ev(f"!{R0}.querySelector('.hubw[data-hub=pe] > .hubs[data-hid=home]').hidden") and vis(R0,'.hubw[data-hub=pe] > .hubs')==1)
    ev(f"{R0}.querySelector('.hubback').click()"); t(300)
    ok('pet: back shows tiles again', not ev(f"{R0}.querySelector('.hubtl').hidden") and vis(R0,'.hubw[data-hub=pe] > .hubs')==0)
    ev(f"(()=>{{const q={R0}.querySelector('.hubq'); q.value='traurig'; q.dispatchEvent(new Event('input',{{bubbles:true,composed:true}}));}})()"); t(300)
    ok('pet: search finds the section', ev(f"!{R0}.querySelector('.hubs[data-hid=feed]').hidden") and ev(f"{R0}.querySelector('.hubtl').hidden"))
    ev(f"(()=>{{const q={R0}.querySelector('.hubq'); q.value='xyzxyz'; q.dispatchEvent(new Event('input',{{bubbles:true,composed:true}}));}})()"); t(300)
    ok('pet: no hit → message', not ev(f"{R0}.querySelector('.hubnone').hidden"))
    ev(f"(()=>{{const q={R0}.querySelector('.hubq'); q.value=''; q.dispatchEvent(new Event('input',{{bubbles:true,composed:true}})); q.blur();}})()"); t(300)
    # Schalter in einem Abschnitt bleibt bedienbar
    ev(f"{R0}.querySelector('.hubt[data-hid=feed]').click()"); t(300)
    ev(f"{R0}.querySelector('.hubs[data-hid=feed] [data-k=peTears]').click()"); t(800)
    ok('pet: switch inside works, section stays open', ev("A._cfg.peTears")==False and ev(f"!{R0}.querySelector('.hubs[data-hid=feed]').hidden"), ev("A._cfg.peTears"))
    # ---------- 💰 ----------
    tab('geld')
    ok('money: kid list + 4 tiles', ev(f"!!{R0}.querySelector('.mnkid')") and ev(f"{R0}.querySelectorAll('.hubw[data-hub=mn] .hubt').length")==4)
    ev(f"{R0}.querySelector('.hubt[data-hid=pin]').click()"); t(300)
    ev(f"{R0}.querySelector('.hubs[data-hid=pin] [data-c=mnPin]').click()"); t(800)
    ok('money: PIN switch inside section works', ev("A._cfg.mnPin")==True and ev(f"!{R0}.querySelector('.hubs[data-hid=pin]').hidden"))
    # ---------- 🦷 ----------
    tab('zaehne', 12)
    Z="A.shadowRoot.querySelector('yippee-teeth').shadowRoot"
    ok('teeth: 8 tiles', ev(f"{Z}.querySelectorAll('.hubt').length")==8, ev(f"{Z}.querySelectorAll('.hubt').length"))
    ev(f"{Z}.querySelector('.hubt[data-hid=mus]').click()"); t(300)
    ok('teeth: music section opens alone', ev(f"!{Z}.querySelector('.hubs[data-hid=mus]').hidden") and ev(f"[...{Z}.querySelectorAll('.hubw > .hubs')].filter(e=>!e.hidden).length")==1)
    ok('teeth: switches counted', 'von' in ev(f"{Z}.querySelector('.hubt[data-hid=look] em').textContent"))
    # ---------- 🎄 ----------
    tab('advent', 12)
    D="A.shadowRoot.querySelector('yippee-advent').shadowRoot"
    ok('advent: doors tab without tiles', ev(f"{D}.querySelectorAll('.hubt').length")==0)
    ev("(()=>{const a=A.shadowRoot.querySelector('yippee-advent'); a._tab='look'; a._render(); return 1})()"); t(600)
    ok('advent look: 7 tiles', ev(f"{D}.querySelectorAll('.hubt').length")==7)
    ev("(()=>{const a=A.shadowRoot.querySelector('yippee-advent'); a._tab='set'; a._render(); return 1})()"); t(600)
    ok('advent settings: 4 tiles', ev(f"{D}.querySelectorAll('.hubt').length")==4)
    ok('no page errors', not errs, errs)
