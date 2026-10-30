# 1.5.0: 🎨 Farben – Vorlagen, eigene Farben (mit automatischer Schrift), pro Karte im Editor, nur geprüfte Farbwerte im CSS
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
BG="(c)=>getComputedStyle(c.shadowRoot.querySelector('.card')).backgroundColor"
TX="(c)=>getComputedStyle(c.shadowRoot.querySelector('.card')).color"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1600}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-28T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:12,total:30});A._save('kid','B',{name:'Ben',emoji:'🐻',points:10,total:10});
      A._save('task','Z',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01'});
      A._save('reward','R',{title:'Eis',emoji:'🍦',cost:20});})()"""); t(800)
    bg0=ev(f"({BG})(B)")
    ok('default: no colour vars', '--yippee-bg' not in ev("B.shadowRoot.getElementById('look').textContent"))
    # ---- Einstellungen
    ev("A._setCfg({setView:'all'}); A._accAll=false; A._accOpen='look'; A._tab='einst'; A._render()"); t(800)
    n=ev("A.shadowRoot.querySelectorAll('.thb').length")
    ok('theme buttons (dashboard + 8 + own)', n==10, n)
    ok('dashboard selected by default', ev("A.shadowRoot.querySelector('.thb.on').dataset.v")=='')
    pg.locator('.thb[data-v=dark]').click(); t(1200)
    ok('dark saved', ev("A._cfg.vTheme")=='dark')
    ok('kids card dark background', ev(f"({BG})(B)")=='rgb(28, 31, 38)' and ev(f"({TX})(B)")=='rgb(241, 243, 245)', [ev(f"({BG})(B)"), ev(f"({TX})(B)")])
    ok('summary shows theme', 'Dunkel' in ev("A.shadowRoot.querySelector('.acch[data-id=look]').textContent"))
    ok('marked as chosen', ev("A.shadowRoot.querySelector('.thb.on').dataset.v")=='dark')
    pg.screenshot(path='t167_dark.png')
    pg.locator('.thb[data-v=ocean]').click(); t(1200)
    ok('ocean', ev(f"({BG})(B)")=='rgb(231, 245, 255)')
    # ---- eigene Farben
    pg.locator('.thb[data-v=custom]').click(); t(1200)
    ok('custom starts from previous theme', ev("A._cfg.vTheme")=='custom' and ev("A._cfg.vCol.bg")=='#e7f5ff', ev("A._cfg.vCol"))
    ok('4 colour pickers', ev("A.shadowRoot.querySelectorAll('input[type=color][data-cfgcol]').length")==4)
    # Vorschau beim Ziehen, ohne zu speichern
    ev("(()=>{const i=A.shadowRoot.querySelector('input[data-cfgcol=bg]'); i.value='#330000'; i.dispatchEvent(new Event('input',{bubbles:true}));})()"); t(200)
    ok('live preview while dragging', ev(f"({BG})(A)")=='rgb(51, 0, 0)' and ev("A._cfg.vCol.bg")=='#e7f5ff', ev(f"({BG})(A)"))
    ev("(()=>{const i=A.shadowRoot.querySelector('input[data-cfgcol=bg]'); i.value='#330000'; i.dispatchEvent(new Event('change',{bubbles:true}));})()"); t(1200)
    ok('dark own background saved', ev("A._cfg.vCol.bg")=='#330000' and 'text' not in ev("A._cfg.vCol"))
    ok('text turns light automatically', ev(f"({TX})(B)")=='rgb(241, 243, 245)', ev(f"({TX})(B)"))
    ev("(()=>{const i=A.shadowRoot.querySelector('input[data-cfgcol=text]'); i.value='#3a0a0a'; i.dispatchEvent(new Event('change',{bubbles:true}));})()"); t(1200)
    ok('contrast warning', 'schwer lesbar' in ev("A.shadowRoot.querySelector('.acc.open').textContent"))
    ev("(()=>{const i=A.shadowRoot.querySelector('input[data-cfgcol=accent]'); i.value='#ff00aa'; i.dispatchEvent(new Event('change',{bubbles:true}));})()"); t(1200)
    ok('accent kept', ev("A._cfg.vCol.accent")=='#ff00aa' and '#ff00aa' in ev("B.shadowRoot.getElementById('look').textContent"))
    pg.screenshot(path='t167_custom.png')
    pg.locator('[data-a=vcolreset]').click(); t(1200)
    ok('reset to light colours', ev("A._cfg.vCol.bg")=='#ffffff' and 'schwer lesbar' not in ev("A.shadowRoot.querySelector('.acc.open').textContent"))
    # ---- manipulierte Werte landen nicht im CSS
    ev("A._setCfg({vCol:{bg:'red;}</style><img src=x onerror=window.pw=1>',accent:'url(javascript:1)'}}); A._render()"); t(1200)
    css=ev("B.shadowRoot.getElementById('look').textContent")
    ok('only checked colour values in css', 'img' not in css and 'url(' not in css and 'red' not in css and '--yippee-bg:#ffffff' in css, css[-300:])
    ok('no injection', not ev("window.pw"))
    # ---- pro Karte (YAML / Editor) hat Vorrang
    ev("A._setCfg({vTheme:'sun'})"); t(1000)
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',colors:'night'})"); t(600)
    ok('card colors beats settings', ev(f"({BG})(B)")=='rgb(20, 27, 45)' and ev(f"({BG})(A)")=='rgb(255, 249, 219)', [ev(f"({BG})(B)"), ev(f"({BG})(A)")])
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',colors:'default'})"); t(600)
    ok('card default = like dashboard', ev(f"({BG})(B)")==bg0 and '--yippee-bg' not in ev("B.shadowRoot.getElementById('look').textContent"), ev(f"({BG})(B)"))
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',colors:'quatsch'})"); t(600)
    ok('unknown theme ignored', '--yippee-bg' not in ev("B.shadowRoot.getElementById('look').textContent"))
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids'})"); t(600)
    ok('without card value: settings theme', ev(f"({BG})(B)")=='rgb(255, 249, 219)')
    # Editor
    ev("""(()=>{const e=document.createElement('yippee-kids-chores-card-editor'); document.body.appendChild(e); e.hass=A._hass; e.setConfig({storage:'todo.kinderpunkte',mode:'kids'}); window.E=e; window.cfgOut=null; e.addEventListener('config-changed',x=>window.cfgOut=x.detail.config);})()"""); t(800)
    opts=ev("[...E.shadowRoot.querySelectorAll('select[data-k=colors] option')].map(o=>[o.value,o.textContent])")
    ok('editor colours select', len(opts)==11 and opts[0][0]=='' and 'Sonne' in opts[0][1], opts[:3])
    ev("(()=>{const s=E.shadowRoot.querySelector('select[data-k=colors]'); s.value='forest'; s.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(200)
    ok('editor writes colors', ev("window.cfgOut.colors")=='forest')
    ev("(()=>{const s=E.shadowRoot.querySelector('select[data-k=colors]'); s.value=''; s.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(200)
    ok('editor as-settings removes key', 'colors' not in ev("window.cfgOut"))
    # Englisch
    ev("A.shadowRoot.activeElement && A.shadowRoot.activeElement.blur(); A._setCfg({lang:'en'})"); t(500); pg.wait_for_timeout(1500); t(300)
    ev("A._setQ=''; A._accAll=false; A._accOpen='look'; A._tab='einst'; A._render()"); t(500)
    h=ev("(A.shadowRoot.querySelector('.acc.open')||{}).textContent||''")
    ok('english', 'Colours' in h and 'Like the dashboard' in h and 'Sun' in h, h[:200])
    ev("A._setCfg({lang:'de', vTheme:''})"); t(500); pg.wait_for_timeout(1500); t(300)
    ok('back to dashboard colours', '--yippee-bg' not in ev("B.shadowRoot.getElementById('look').textContent") and ev(f"({BG})(B)")==bg0)
    # ---- #11: Eltern-Ansicht „Heute“ mit zwei Kindern auf dem Handy – Spalten untereinander, nichts ragt über den Rand
    ev("A.setConfig({storage:'todo.kinderpunkte',mode:'admin',notify:'notify.mobile_app_parent'}); A._setCfg({vTheme:'custom'}); A._tab='heute'; A._render()"); t(800)
    pg.evaluate("document.body.style.gridTemplateColumns='1fr'; document.getElementById('b').style.display='none'"); pg.set_viewport_size({'width':430,'height':900}); t(800)
    cols=ev("getComputedStyle(A.shadowRoot.querySelector('.cols')).gridTemplateColumns")
    ok('#11 kids stacked on phone', len(cols.split())==1, cols)
    ok('#11 card fits the screen', ev("document.documentElement.scrollWidth")<=430 and ev("A.getBoundingClientRect().right")<=430, [ev("document.documentElement.scrollWidth"), ev("A.getBoundingClientRect().right")])
    ev("A._accOpen='look'; A._tab='einst'; A._render()"); t(600)
    ok('colour pickers still two per row', len(ev("getComputedStyle(A.shadowRoot.querySelector('.colpk')).gridTemplateColumns").split())==2)
    ev("A._setCfg({vTheme:''})"); t(500)
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
