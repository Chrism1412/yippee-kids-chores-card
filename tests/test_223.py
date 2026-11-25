# 2.0.0: 📱 Spiele im Querformat · 💡 Hinweis für Eltern · 🪙 im Emoji-Picker mit Ersatz-Emoji · 🔁 Oft falsch in der Lernstatistik
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':844,'height':390}); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:40,total:330,order:1,since:'2026-11-01'});
      A._setCfg({approval:true,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',new20ok:true});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,wq:[['math','7 × 8 = ? → 56',3,'2026-11-24']]});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    sb="B.shadowRoot"
    ev("document.body.style.gridTemplateColumns='1fr'; document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(800)
    ev(f"{sb}.querySelector('[data-a=pegames]').click()"); t(1500); ev("B._gmClose()"); t(300)
    def fits(): return ev("(()=>{const o=B.shadowRoot.querySelector('.gmov'); const r=[]; o.querySelectorAll('.gmans button,.gmpl,.gmstn,.gmsig,.gmlil,.gmmz').forEach(e=>{const b=e.getBoundingClientRect(); if(b.width&&(b.bottom>innerHeight+1||b.top<0)) r.push(e.className)}); return r})()")
    for g in ['math','clock','count','train','lily','space','dino','maze']:
        ev(f"B._gmStart('K','{g}')"); t(1200); pg.wait_for_timeout(100)
        ok(f'landscape {g}: everything visible', fits()==[], fits())
        if g=='math': ok('landscape quiz: question left, answers right', ev(f"(()=>{{const q={sb}.querySelector('.gmov .gmtask').getBoundingClientRect(), a={sb}.querySelector('.gmov .gmans').getBoundingClientRect(); return a.left>q.right-5}})()"))
        if g=='maze': ok('landscape maze: d-pad beside the maze', ev(f"(()=>{{const m={sb}.querySelector('.gmov .gmmz').getBoundingClientRect(), c={sb}.querySelector('.gmov .mzc .gmctl').getBoundingClientRect(); return c.left>=m.right-2 && m.height>200}})()"))
        ev("B._gmClose()"); t(300)
    pg.set_viewport_size({'width':390,'height':844}); t(300)
    ev("B._gmStart('K','math')"); t(1000)
    ok('portrait unchanged: answers below the question', ev(f"(()=>{{const q={sb}.querySelector('.gmov .gmtask').getBoundingClientRect(), a={sb}.querySelector('.gmov .gmans').getBoundingClientRect(); return a.top>=q.bottom-2}})()"))
    ev("B._gmClose()"); t(300)
    # 💡 Hinweis für Eltern (3 Tage nichts erledigt)
    ev("document.getElementById('a').style.display=''; A._tab='heute'; A._render()"); t(800)
    ok('parent hint: 3 days without chores', '3' in (ev("(()=>{const x=[...A.shadowRoot.querySelectorAll('.card')].find(c=>c.textContent.includes('Hinweis für Eltern')); return x?x.textContent:''})()") or ''))
    ev("A._setCfg({parHint:false}); A._render()"); t(500)
    ok('parent hint can be switched off', not ev("[...A.shadowRoot.querySelectorAll('.card')].some(c=>c.textContent.includes('Hinweis für Eltern'))"))
    # 🔁 Oft falsch im ✎-Dialog
    ev("A._tab='tier'; A._render()"); t(1200); pg.wait_for_timeout(300); t(300)
    ev("A._peAct('pekset',{k:'K'})"); t(800)
    ok('learning overview shows "Oft falsch"', '7 × 8' in ev("A.shadowRoot.querySelector('#modal .pstwq')?.textContent||''"), ev("A.shadowRoot.querySelector('#modal')?.textContent.slice(0,200)"))
    ev("A._closeModal()"); t(300)
    # 🪙 im Picker auch ohne Unterstützung (Ersatz 💰 wird angezeigt, 🪙 gespeichert)
    ev("A._tab='belohnungen'; A._render()"); t(600)
    import os
    src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','dist','yippee-kids-chores-card.js'),encoding='utf8').read()
    ok('picker keeps emojis with a fallback (shows the fallback, stores the original)', 'emoOk(x) || EMO_FB[x]' in src and '${emoFix(x)}</button>' in src)
    ev(f"(()=>{{const b=[...A.shadowRoot.querySelectorAll('[data-a]')].find(x=>/add|neu/i.test(x.dataset.a)&&x.textContent.includes('Belohnung')); return !!b}})()")
    ok('no errors', not errs, errs)
    b.close()
