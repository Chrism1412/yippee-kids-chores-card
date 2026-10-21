# Wie in Home Assistant: Karte als Modul aus /hacsfiles/… – Sprachen und Handbuch müssen von dort nachgeladen werden
import os, shutil, subprocess, sys, time, urllib.request
from playwright.sync_api import sync_playwright
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:200])
HERE=os.path.dirname(os.path.abspath(__file__))
REPO_DIST=os.path.join(os.path.dirname(HERE),'dist')
DIST=sys.argv[1] if len(sys.argv)>1 else (REPO_DIST if os.path.exists(os.path.join(REPO_DIST,'yippee-kids-chores-card.js')) else HERE)
PAGE=sys.argv[2] if len(sys.argv)>2 else os.path.join(HERE,'kp_test.html')
root=os.path.join(HERE,'_hacsroot'); shutil.rmtree(root, ignore_errors=True)
d=os.path.join(root,'hacsfiles','yippee-kids-chores-card'); os.makedirs(d)
for f in os.listdir(DIST):
    if (f.startswith('yippee-kids-chores-lang-') or f == 'yippee-kids-chores-manual.js') and f.endswith('.js'): shutil.copy(os.path.join(DIST,f), d)
CARD=os.path.join(DIST,'yippee-kids-chores-card.js') if DIST!=HERE else os.path.join(HERE,'kinderpunkte-card.js')
shutil.copy(CARD, os.path.join(d,'yippee-kids-chores-card.js'))
os.remove(os.path.join(d,'yippee-kids-chores-lang-it.js'))  # fehlende Sprachdatei simulieren
html=open(PAGE,encoding='utf-8').read()
i=html.index('<script>')+len('<script>'); j=html.index('</script>',i)
html=html[:i-len('<script>')]+'<script type="module" src="/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?hacstag=99"></script><script type="module">if(!customElements.get("kinderpunkte-card"))customElements.define("kinderpunkte-card", class extends customElements.get("yippee-kids-chores-card"){});</script>'+html[j+len('</script>'):]
html=html.replace('<script>','<script type="module">',1)
open(os.path.join(root,'index.html'),'w',encoding='utf-8').write(html)
srv=subprocess.Popen([sys.executable,'-m','http.server','8766','--directory',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try: urllib.request.urlopen('http://localhost:8766/index.html'); break
        except Exception: time.sleep(0.1)
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
        pg.goto('http://localhost:8766/index.html'); pg.wait_for_timeout(1500); ev=pg.evaluate
        ok('card loaded as module', ev("!!window.A && !!A.shadowRoot"))
        ok('german without extra file', 'Heute' in ev("A.shadowRoot.textContent") and not any('lang-' in x for x in ev("performance.getEntriesByType('resource').map(e=>e.name)")))
        for L,word in [('en','Today'),('fr',"Aujourd"),('pl','Dziś'),('el','Σήμερα'),('gsw','Hüt')]:
            ev(f"A._setCfg({{lang:'{L}'}})"); pg.wait_for_timeout(1500)
            ok(f'{L} loaded', word in ev("A.shadowRoot.textContent"), ev("A.shadowRoot.querySelector('.tabs').textContent")[:80])
        names=ev("performance.getEntriesByType('resource').map(e=>e.name).filter(n=>n.includes('lang-en'))")
        ok('loaded from hacsfiles with version', names and '/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-lang-en.js?v=' in names[0], names)
        ok('cache tag from resource (hacstag) appended', names and 'r=hacstag%3D99' in names[0], names)
        ev("A._setCfg({lang:'it'})"); pg.wait_for_timeout(1500)
        ok('missing language file -> German, no crash', 'Heute' in ev("A.shadowRoot.textContent"), ev("A.shadowRoot.querySelector('.tabs').textContent")[:80])
        ev("A._setCfg({lang:'de'})"); pg.wait_for_timeout(800)
        ev("A._hbOpen('')"); pg.wait_for_timeout(1500)
        ok('manual from hacsfiles', ev("A.shadowRoot.querySelectorAll('#modal .hbi').length")>=40)
        ok('no page errors', not [x for x in errs if not x.startswith('C:Failed to load resource')], errs)
        b.close()
finally:
    srv.terminate(); shutil.rmtree(root, ignore_errors=True)
print('\n'.join(R))
