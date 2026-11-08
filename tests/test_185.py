# 1.7.2: 📱 Freigabe per Knopf in der Benachrichtigung – die Nachricht verschwindet sofort auf allen ausgewählten Handys,
#        auch ohne geöffnete Karte (Knöpfe-Automation schickt clear_notification). Handys geändert → Automation neu geschrieben.
from playwright.sync_api import sync_playwright
from jinja2.sandbox import ImmutableSandboxedEnvironment
import datetime, atexit, re
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
J=ImmutableSandboxedEnvironment(); J.filters['regex_replace']=lambda v,find='',replace='': re.sub(find,replace,v)
def tag(cfg, action):
    v=[a for a in cfg['actions'] if 'variables' in a][0]['variables']['kp_tag']
    return J.from_string(v).render(trigger={'event':{'data':{'action':action}}})
KEY='config/automation/config/yippee_app_knoepfe'
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-08T10:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5});
      A._save('task','T1',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({approval:true, nActions:true, targets:['mobile_app_papa','mobile_app_mama','notify.familienchat']});})()"""); t(1000)
    cfg=ev("A._autoCfg('app')")
    acts=cfg['actions']
    ok('records action first', acts[0]['action']=='todo.add_item')
    cond=[a for a in acts if 'if' in a]
    ok('clears on both phones only', len(cond)==1 and [x['action'] for x in cond[0]['then']]==['notify.mobile_app_mama','notify.mobile_app_papa'], cond)
    ok('clear_notification with tag', all(x['data']=={'message':'clear_notification','data':{'tag':'{{ kp_tag }}'}} and x['continue_on_error'] for x in cond[0]['then']))
    # gleiche Kennung wie die Benachrichtigung der Karte
    ev("A._save('log','2026-11-08',{s:{'T1:K':'p'}})"); t(1200)
    card=ev("[...A._openTags()]")
    ok('tag matches card (task)', tag(cfg,'KP|ok|2026-11-08|T1|K') in card and tag(cfg,'KP|no|2026-11-08|T1|K') in card, [tag(cfg,'KP|ok|2026-11-08|T1|K'), card])
    ok('tag for reward request', tag(cfg,'KP|rok|abc-12')=='yippee_r_abc-12')
    ok('other actions: no tag', tag(cfg,'KP|pts|Mia|2|x')=='' and tag(cfg,'KP')=='')
    ok('skips when no tag', cond[0]['if'][0]['value_template']=="{{ kp_tag != '' }}")
    # bereits angelegte Automation wird beim Öffnen (Administrator) auf neuen Stand gebracht
    ev("window.autos={}; A._autoOk={app:true}; A._autoChecked=true; A._planCheck()"); t(1500)
    a=ev(f"(window.autos||{{}})['{KEY}']")
    ok('old automation rewritten', a and any('if' in x for x in a['actions']), a)
    ok('signature stored', ev("A._cfg.appSig")==ev("hsh(JSON.stringify(A._autoCfg('app')))") if ev("typeof hsh")=='function' else bool(ev("A._cfg.appSig")))
    ev("window.autos={}; A._planCheck()"); t(1000)
    ok('no rewrite when unchanged', not ev(f"(window.autos||{{}})['{KEY}']"))
    # Handy dazu → neu schreiben
    ev("A._setCfg({targets:['mobile_app_papa','mobile_app_mama','mobile_app_oma']}); window.autos={}; A._planCheck()"); t(1500)
    a=ev(f"(window.autos||{{}})['{KEY}']")
    ok('phones changed: rewritten', a and [x['action'] for x in [y for y in a['actions'] if 'if' in y][0]['then']]==['notify.mobile_app_mama','notify.mobile_app_oma','notify.mobile_app_papa'], a)
    # keine Handys → nur buchen
    ev("A._setCfg({targets:['notify.familienchat']})"); t(500)
    ok('no phones: only booking', [x.get('action') for x in ev("A._autoCfg('app')")['actions']]==['todo.add_item'])
    # Nicht-Administrator schreibt nichts
    ev("A._setCfg({targets:['mobile_app_papa']}); window.autos={}; A.hass={...A._hass,user:{...A._hass.user,is_admin:false}}; A._planCheck()"); t(1500)
    ok('non-admin: no rewrite', not ev(f"(window.autos||{{}})['{KEY}']"))
    # YAML zum manuellen Anlegen enthält das Entfernen
    ev("A.hass={...A._hass,user:{...A._hass.user,is_admin:true}}; A._tab='einst'; A._accAll=true; A._render()"); t(600)
    ok('manual YAML includes clear', 'clear_notification' in ev("A.shadowRoot.textContent") and 'kp_tag' in ev("A.shadowRoot.textContent"))
    ok('hint shown', 'verschwindet nach dem Tippen sofort auf allen' in ev("A.shadowRoot.textContent"))
    # 🔁 Sensor-Vorlage doppelt eingetragen → Hinweis aus dem Home-Assistant-Protokoll (nur Administrator)
    ev("""(()=>{window.logCalls=0; const cw=A._hass.callWS; const h={...A._hass, user:{...A._hass.user,is_admin:true},
      entities:{...(A._hass.entities||{}),'sensor.yippee_mia':{platform:'template'}},
      states:{...A._hass.states,'sensor.yippee_mia':{state:'5',attributes:{}}},
      callWS:async(m)=>{ if(m.type==='system_log/list'){ window.logCalls++; return window.fakeLog||[]; } return cw(m); }};
      A.hass=h; A._setCfg({sensKeep:true}); A._tab='heute'; A._dupAt=0; A._render();})()"""); t(1500); ev("A._render()"); t(500)
    ok('stale without log: normal hint', 'Sensor-Vorlage ist nicht mehr aktuell' in ev("A.shadowRoot.textContent") and 'doppelt eingetragen' not in ev("A.shadowRoot.textContent"))
    ev("""window.fakeLog=[{level:'ERROR',message:['Platform template does not generate unique IDs. ID yippee_kid_K is already used by sensor.yippee_mia - ignoring sensor.yippee_mia_2']}]; A._dupAt=0; A._render()"""); t(1500)
    ok('duplicate detected: banner', 'doppelt eingetragen' in ev("A.shadowRoot.textContent"))
    ev("A._tab='einst'; A._accAll=true; A._render()"); t(600)
    ok('duplicate shown in settings + one-place hint', 'doppelt eingetragen' in ev("A.shadowRoot.textContent") and 'nur an einer Stelle stehen' in ev("A.shadowRoot.textContent"))
    n=ev("window.logCalls"); ev("A._render(); A._render()"); t(500)
    ok('log read at most once a minute', ev("window.logCalls")==n, [n, ev("window.logCalls")])
    ev("""(()=>{window.logCalls=0; A.hass={...A._hass,user:{...A._hass.user,is_admin:false}}; A._sensDup=false; A._dupAt=0; A._tab='heute'; A._render();})()"""); t(800)
    ok('non-admin never reads the log', ev("window.logCalls")==0)
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
