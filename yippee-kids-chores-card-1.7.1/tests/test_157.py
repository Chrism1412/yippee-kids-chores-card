# 1.4.0: 🏅 Abzeichen antippen + Handbuch-Thema „Level & Abzeichen“ in allen Sprachen
import json, re, os
from playwright.sync_api import sync_playwright
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
HERE=os.path.dirname(os.path.abspath(__file__))
man=open(os.path.join(HERE,'..','dist','yippee-kids-chores-manual.js'),encoding='utf-8').read()
j=json.loads(man[man.index('export default ')+15:].rstrip().rstrip(';'))
ok('badges topic in all 27 languages', len(j)==27 and all(any(t[0]=='badges' for t in v['t']) for v in j.values()))
de=[t for t in j['de']['t'] if t[0]=='badges'][0][3]
ok('topic lists 10 levels + 9 badges', de.count('• ')==20 and 'zugeklappt' in de and 'Haushalts-König – ab 3000 ⭐' in de and 'Erste Belohnung eingelöst' in de)
en=[t for t in j['en']['t'] if t[0]=='badges'][0][3]
ok('english uses translated names', 'Level 10' in en and 'First task done' in en)
pt=[t for t in j['de']['t'] if t[0]=='points'][0][3]
ok('points topic corrected', 'Level und Abzeichen richten sich' not in pt and '🏅 Level & Abzeichen' in pt)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1200,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/kp_test.html'); pg.wait_for_timeout(800); ev=pg.evaluate
    ev("A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5,history:[{d:'2026-01-01',t:'x',c:1}]})"); pg.wait_for_timeout(800)
    toast=lambda: ev("(A.shadowRoot.querySelector('.toast')||B.shadowRoot.querySelector('.toast')||{}).textContent||[...document.querySelectorAll('*')].map(x=>x.shadowRoot&&x.shadowRoot.querySelector('.toast')).filter(Boolean).map(x=>x.textContent).join('')")
    ev("B.shadowRoot.querySelector('[data-a=kvtog][data-x=b][data-k=K]').click()"); pg.wait_for_timeout(300)  # Abzeichen sind seit 1.5.0 zugeklappt
    ev("B.shadowRoot.querySelector('[data-a=bdgi][data-b=reward][data-k=K]').click()"); pg.wait_for_timeout(300)
    t1=toast(); ok('tap achieved badge', 'Erste Belohnung eingelöst' in t1 and 'geschafft!' in t1, t1)
    pg.wait_for_timeout(3500)
    ev("B.shadowRoot.querySelector('[data-a=bdgi][data-b=s30][data-k=K]').click()"); pg.wait_for_timeout(300)
    t2=toast(); ok('tap missing badge', '30 Tage in Folge' in t2 and 'noch nicht geschafft' in t2, t2)
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
