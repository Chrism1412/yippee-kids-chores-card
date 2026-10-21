from playwright.sync_api import sync_playwright
import datetime, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
SUBS_FR=[{"code":"FR-GE","isoCode":"FR-GES","shortName":"GE","category":[{"language":"DE","text":"Region"}],"name":[{"language":"DE","text":"Grand Est"}],"children":[{"code":"FR-GE-BR","shortName":"GE-BR","category":[{"language":"DE","text":"Département"}],"name":[{"language":"DE","text":"Bas-Rhin"}]},{"code":"FR-GE-AB","category":[{"language":"DE","text":"Département"}],"name":[{"language":"DE","text":"Aube"}]}]},
 {"code":"FR-IF","category":[{"language":"DE","text":"Region"}],"name":[{"language":"DE","text":"Île-de-France"}]},
 {"code":"FR-ZB","category":[{"language":"DE","text":"Zone"}],"name":[{"language":"DE","text":"Zone B"}],"children":[{"code":"FR-ZB-ST","category":[{"language":"DE","text":"Akademie"}],"name":[{"language":"DE","text":"Straßburg"}]}]}]
PUB_FR=[{"startDate":"2026-01-01","endDate":"2026-01-01","name":[{"language":"DE","text":"Neujahr"}],"nationwide":True},
 {"startDate":"2026-11-11","endDate":"2026-11-11","name":[{"language":"DE","text":"Waffenstillstand 1918"}],"nationwide":True},
 {"startDate":"2026-12-26","endDate":"2026-12-26","name":[{"language":"DE","text":"2. Weihnachtsfeiertag"}],"nationwide":False,"subdivisions":[{"code":"FR-GE-BR"},{"code":"FR-GE-HR"},{"code":"FR-GE-MO"}]},
 {"startDate":"2026-05-27","endDate":"2026-05-27","name":[{"language":"DE","text":"Abschaffung der Sklaverei"}],"nationwide":False,"subdivisions":[{"code":"FR-GP"}]}]
SCH_FR=[{"startDate":"2026-10-17","endDate":"2026-11-01","name":[{"language":"DE","text":"Herbstferien"}],"nationwide":False,"subdivisions":[{"code":"FR-GE"},{"code":"FR-ZB"}]},
 {"startDate":"2026-10-24","endDate":"2026-11-08","name":[{"language":"DE","text":"Herbstferien Zone C"}],"nationwide":False,"subdivisions":[{"code":"FR-IF"},{"code":"FR-ZC"}]}]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':412,'height':900}, device_scale_factor=2); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script(f"""window.__urls=[]; window.fetch=async(u)=>{{ u=String(u); window.__urls.push(u); const b= u.includes('Subdivisions')?{json.dumps(SUBS_FR)}: u.includes('PublicHolidays')?{json.dumps(PUB_FR)}:{json.dumps(SCH_FR)}; return {{ok:true,status:200,json:async()=>b}}; }};""")
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-02T17:00:00'))
    pg.goto('http://localhost:8765/kp_test.html#acc'); pg.clock.run_for(600)
    pg.evaluate("document.getElementById('b').style.display='none'")
    A=pg.locator('#a kinderpunkte-card'); t=lambda ms=500: pg.clock.run_for(ms); ev=lambda x: pg.evaluate(x)
    # Migration from old bl
    ev("A._save('kid','L',{name:'Ben',emoji:'🐧',points:0}); A._setCfg({bl:'DE-BW'})"); t()
    ok('migration', ev("[A._cfg.hc, A._cfg.hr, A._holKey()]")==['DE','DE-BW','DE|DE-BW'])
    A.locator('[data-a="tab"][data-id="einst"]').click(); t(); A.locator('.acch[data-id="vac"]').click(); t()
    ok('country names localized', 'Frankreich' in A.locator('[data-cfgs="hc"]').inner_text() and 'Österreich' in A.locator('[data-cfgs="hc"]').inner_text())
    A.locator('[data-cfgs="hc"]').select_option('FR'); t(1500)
    ok('region cleared', ev("A._cfg.hr")=='' and ev("A._cfg.bl")=='')
    opts=A.locator('[data-cfgs="hr"] option').all_inner_texts(); ok('regions loaded with départements', any('Bas-Rhin' in o for o in opts) and any('Grand Est' in o for o in opts), opts)
    A.locator('[data-cfgs="hr"]').select_option('FR-GE-BR'); t(1500)
    ok('alsace 26.12', ev("A._pubHol('2026-12-26')")=='2. Weihnachtsfeiertag')
    ok('no guadeloupe', not ev("A._pubHol('2026-05-27')"))
    ok('zone B ferien via region', ev("A._schoolHol('2026-10-20')")=='Herbstferien' and not ev("A._schoolHol('2026-11-05')"))
    ok('nationwide', ev("A._pubHol('2026-11-11')")=='Waffenstillstand 1918')
    ok('status', '✅' in A.locator('.accb').inner_text())
    ok('summary', 'BR automatisch' in A.locator('.acch[data-id="vac"]').inner_text(), A.locator('.acch[data-id="vac"]').inner_text().replace('\n',' '))
    ok('no subdivision param needed', not any('subdivisionCode' in u for u in ev("window.__urls")))
    ok('no errors', not errs, errs)
    A.locator('[data-cfgs="hr"]').scroll_into_view_if_needed(); pg.screenshot(path='kp42.png')
    b.close()
print('\n'.join(R))
