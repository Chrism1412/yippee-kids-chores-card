from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1200,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js*', lambda r: r.fulfill(status=200, body="const VERSION = '1.1.0';", content_type='application/javascript'))
    pg.route('**/local/kinderpunkte-card.js*', lambda r: r.fulfill(status=200, body="const VERSION = '46';", content_type='application/javascript'))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-08T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    A=pg.locator('#a kinderpunkte-card'); t=lambda ms=400: pg.clock.run_for(ms); ev=lambda x: pg.evaluate(x); html=lambda: ev("A.shadowRoot.innerHTML")
    ev("A._save('kid','K',{name:'Kai',emoji:'🐻',by:2022,bm:3,bd:1})"); t(1000)   # 4 Jahre
    sug=lambda: ev("(()=>{const k=A._db.kid.K; return TEMPLATESX=null})()")
    cnt=lambda: ev("""(()=>{const k=A._db.kid.K; let n=0,sch=0; for(const tp of window.__T){ if(window.__ok(tp,A._tplAge(tp,k))){n++; if(tp[0]==='🎒 Schule')sch++;} } return [n,sch];})()""")
    ev("window.__T=null")
    # expose templates via suggest dialog count instead
    def sugcount():
        ev("A._suggest('K')"); t(300)
        n=ev("A.shadowRoot.querySelectorAll('#modal [name=sg]').length"); h=ev("A.shadowRoot.querySelector('#modal').innerText")
        ev("A._closeModal()"); t(200); return n, ('Ranzen' in h)
    n_de=sugcount(); ok('DE 4y no school tpl', not n_de[1], n_de)
    ev("A._setCfg({hc:'IE'})"); t(800)
    n_ie=sugcount(); ok('IE school age 5 -> 4y still no (needs 5)', not n_ie[1], n_ie)
    ev("A._save('kid','K',{...A._db.kid.K, by:2021})"); t(800)   # 5 Jahre
    ok('IE 5y has school tpl', sugcount()[1])
    ev("A._setCfg({hc:'DE'})"); t(800)
    ok('DE 5y no school tpl', not sugcount()[1])
    ev("A._save('kid','K',{...A._db.kid.K, school:'2025-09'})"); t(800)
    ok('school date overrides', sugcount()[1])
    ok('grade', ev("A._grade(A._db.kid.K)")==2, ev("A._grade(A._db.kid.K)"))
    A.locator('[data-a="tab"][data-id="kinder"]').click(); t()
    ok('grade shown', '2. Klasse' in html())
    A.locator('[data-a="ekid"]').first.click(); t()
    ok('editor field', ev("A.shadowRoot.querySelector('#modal [name=school]').value")=='2025-09')
    ev("A.shadowRoot.querySelector('#modal [name=school]').value=''"); A.locator('[data-a="msave"]').click(); t(800)
    ok('cleared', ev("A._db.kid.K.school")=='')
    # duplicates
    ev("""(()=>{window.res=[{id:'r0',type:'module',url:'/local/kinderpunkte-card.js?v=46'},{id:'r1',type:'module',url:'/hacsfiles/yippee-kids-chores-card/yippee-kids-chores-card.js?hacstag=1'}]; window.dels=[]; const o=A._hass.callWS; A._hass.callWS=async(m)=>{ if(m.type==='lovelace/resources') return JSON.parse(JSON.stringify(window.res)); if(m.type==='lovelace/resources/delete'){ window.dels.push(m.resource_id); return {}; } if(m.type==='lovelace/resources/update') return {}; return o(m); };})()""")
    pg.evaluate("A._updCheck(true)"); pg.wait_for_timeout(600); t()
    ok('dup banner', 'mehrfach als Ressource' in html() and 'resclean' in html(), ev("A._upd && A._upd.dups"))
    ok('keeps hacs', ev("A._upd.res.id")=='r1' and ev("A._upd.file")=='1.1.0')
    ok('legacy 46 not newer', ev("A._vnum('46')")==0 and ev("A._vnum('v1.1.0')")>1)
    A.locator('[data-a="resclean"]').first.click(); pg.wait_for_timeout(300)
    ok('deleted old', ev("window.dels")==['r0'], ev("window.dels"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
