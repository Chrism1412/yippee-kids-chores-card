# 1.7.0 (GitHub #13): 🔁 Sensoren auch nach einem HA-Neustart – Stand in der Yippee-Liste, Vorlage für configuration.yaml (Template-Sensor liest todo.get_items)
from playwright.sync_api import sync_playwright
import datetime, atexit, json, ast, yaml
from jinja2.sandbox import ImmutableSandboxedEnvironment
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
# Jinja wie in Home Assistant (Sandbox, from_json mit default, Ergebnis wird in Python-Typen zurückverwandelt)
J=ImmutableSandboxedEnvironment()
def from_json(v, default=None):
    try: return json.loads(v)
    except Exception: return default
J.filters['from_json']=from_json
def native(sv):
    sv=sv.strip()
    try: return ast.literal_eval(sv)
    except Exception: return None if sv=='None' else sv
def render(tpl, **v): return native(J.from_string(tpl).render(**v))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    sens=lambda: ev("items['todo.kinderpunkte'].filter(i=>i.summary.startsWith('kp|sens|') && i.summary!=='kp|sens|tick').map(i=>[i.summary,i.description])")
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:12,total:30});A._save('kid','B',{name:'Ben Jürgen',emoji:'🐻',points:7,total:9});
      A._save('task','Z',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','T',{title:'Tisch decken',emoji:'🍽️',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});})()"""); t(800)
    ev("A._pushSensors()"); t(5500)
    ok('off by default: no list entries', sens()==[], sens())
    ok('off by default: live sensors as before', 'states/sensor.yippee_mia' in ev("Object.keys(window.sensors||{})"))
    # Einstellung + Vorlage
    ev("A._setCfg({setView:'all'}); A._accAll=false; A._accOpen='sens'; A._tab='einst'; A._render()"); t(600)
    ok('option shown', ev("!!A.shadowRoot.querySelector('[data-k=sensKeep]')") and not ev("!!A.shadowRoot.querySelector('pre.yaml')"))
    ev("A.shadowRoot.querySelector('[data-k=sensKeep]').click()"); t(1500)
    ok('option saved', ev("A._cfg.sensKeep")==True)
    ok('template + copy button shown', ev("!!A.shadowRoot.querySelector('pre.yaml')") and ev("!!A.shadowRoot.querySelector('[data-a=sensyaml]')"))
    ev("A._pushSensors()"); t(5500)
    s=dict(sens())
    ok('one list entry per kid', set(s)=={'kp|sens|K','kp|sens|B'}, list(s))
    mia=json.loads(s.get('kp|sens|K','{}'))
    ok('entry: points + attributes', mia.get('p')==12 and mia['a'].get('heute_gesamt')==2 and mia['a'].get('heute_erledigt')==0 and 'friendly_name' not in mia['a'], mia)
    # kein unnötiges Schreiben
    ev("window.wr=0; const o=A._svc.bind(A); A._svc=(...a)=>{ if(String((a[1]||{}).item||'').startsWith('kp|sens|') && (a[1]||{}).item!=='kp|sens|tick') window.wr++; return o(...a); }")
    ev("A._pushSensors(); A._pushSensors()"); t(5500)
    ok('unchanged: no write', ev("window.wr")==0, ev("window.wr"))
    # Abhaken -> Eintrag aktualisiert
    ev("A._tab='heute'; A._render()"); t(400)
    ev("A.shadowRoot.querySelector('[data-a=atap][data-t=T][data-k=K]').click()"); t(2500); ev("A._pushSensors()"); t(5500)
    mia=json.loads(dict(sens())['kp|sens|K'])
    ok('after tick: updated', mia['p']==13 and mia['a']['heute_erledigt']==1 and mia['a']['offen']==['Zähne putzen'], mia)
    ok('one write for the change', ev("window.wr")==1, ev("window.wr"))
    # Kinder-Gerät (kein Admin) hält den Stand ebenfalls aktuell – ohne Admin-Schnittstelle
    ev("window.sensors={}; A._hass.user={id:'kid1',name:'Kind',is_admin:false}; A._sensorFail=false")
    ev("(()=>{const o={...A._db.kid.B}; delete o.id; A._save('kid','B',{...o,points:8});})()"); t(1500); ev("A._pushSensors()"); t(5500)
    ok('kid device: list entry updated', json.loads(dict(sens())['kp|sens|B'])['p']==8)
    ok('kid device: no admin API call', ev("Object.keys(window.sensors||{})")==[], ev("window.sensors"))
    ev("A._hass.user={id:'admin1',name:'Papa',is_admin:true}")
    # Vorlage: gültiges YAML, liest die Liste wie Home Assistant
    y=ev("A._sensYaml()")
    cfg=yaml.safe_load(y)['template'][0]
    ok('yaml: triggers start, list change, every minute', [x['trigger'] for x in cfg['triggers']]==['homeassistant','state','time_pattern'])
    ok('yaml: get_items on storage', cfg['actions'][0]['action']=='todo.get_items' and cfg['actions'][0]['target']['entity_id']=='todo.kinderpunkte')
    sen={x['unique_id']:x for x in cfg['sensor']}
    ok('yaml: sensor per kid, card entity ids', sen['yippee_kid_B']['default_entity_id']=='sensor.yippee_ben_juergen' and sen['yippee_kid_K']['default_entity_id']=='sensor.yippee_mia' and sen['yippee_kid_K']['name']=='Yippee! Mia', list(sen))
    resp={'todo.kinderpunkte':{'items':[{'summary':i['summary'],'description':i.get('description'),'status':'needs_action','uid':str(n)} for n,i in enumerate(ev("items['todo.kinderpunkte']"))]}}
    yv=render(cfg['actions'][1]['variables']['y'], r=resp)
    ok('jinja: variable collects all kids', isinstance(yv,dict) and set(yv)-{'tick'}=={'K','B'}, yv)
    k=sen['yippee_kid_K']
    ok('jinja: state = points', render(k['state'], y=yv)==13 and render(k['availability'], y=yv)==True)
    at={n:render(v, y=yv) for n,v in k['attributes'].items()}
    ok('jinja: attributes', at['heute_erledigt']==1 and at['heute_gesamt']==2 and at['offen']==['Zähne putzen'] and at['alles_erledigt'] is False and at['level']==1, at)
    ok('jinja: missing kid -> unavailable', render(k['availability'], y={})==False and render(k['state'], y={}) in (None,''))
    ok('jinja: broken entry tolerated', render(cfg['actions'][1]['variables']['y'], r={'todo.kinderpunkte':{'items':[{'summary':'kp|sens|K','description':'{kaputt'},{'summary':'Milch'}]}})=={'K':{}})
    # Vorlage-Sensor vorhanden -> Karte überschreibt ihn nicht mehr
    ev("window.sensors={}; A._sensSig={}; A._hass.entities['sensor.yippee_mia']={entity_id:'sensor.yippee_mia',platform:'template'}; A._pushSensors()"); t(800)
    ks=ev("Object.keys(window.sensors||{})")
    ok('template sensor not overwritten, others still pushed', 'states/sensor.yippee_mia' not in ks and 'states/sensor.yippee_ben_juergen' in ks, ks)
    # ---- Status in den Einstellungen
    box=lambda: ev("(()=>{const c=A.shadowRoot.querySelector('[data-k=sensKeep]'); let e=c; while(e && !e.classList.contains('acc') && e.parentElement) e=e.parentElement; return (e||c.parentElement).innerText})()")
    show=lambda: (ev("A._setCfg({setView:'all'}); A._accAll=false; A._accOpen='sens'; A._tab='einst'; A._render()"), t(500))
    show()
    tx=box()
    ok('only Mia via template: warning names Ben', '⚠️' in tx and 'Ben Jürgen' in tx and '✅ Dauerhafte' not in tx, tx[-400:])
    ok('warning: steps + copy button shown', 'packages/yippee.yaml' in tx and ev("!!A.shadowRoot.querySelector('[data-a=sensyaml]')"))
    ok('template collapsed by default', ev("!A.shadowRoot.querySelector('details.sensy').open") and ev("A.shadowRoot.querySelector('details.sensy').getBoundingClientRect().height")<60, ev("A.shadowRoot.querySelector('details.sensy').getBoundingClientRect().height"))
    ev("A.shadowRoot.querySelector('details.sensy summary').click()"); t(200); ev("A._render()"); t(300)
    ok('opened template stays open after re-render', ev("A.shadowRoot.querySelector('details.sensy').open") and ev("A.shadowRoot.querySelector('details.sensy').getBoundingClientRect().height")>100)
    ev("A.shadowRoot.querySelector('details.sensy summary').click()"); t(200)
    # beide per Vorlage und mit Werten -> ✅, keine Schritte
    ev("A._hass.entities['sensor.yippee_ben_juergen']={entity_id:'sensor.yippee_ben_juergen',platform:'template'}; A._hass.states['sensor.yippee_mia']={state:'13',attributes:{}}; A._hass.states['sensor.yippee_ben_juergen']={state:'8',attributes:{}}; A._render()"); t(400)
    tx=box()
    ok('all via template: ✅ status, no steps, no warning', '✅ Dauerhafte Sensoren aktiv' in tx and '⚠️' not in tx and 'packages/yippee.yaml' not in tx, tx[-400:])
    ok('copy button still there', ev("!!A.shadowRoot.querySelector('[data-a=sensyaml]')"))
    # Kennung passt nicht (Stand liegt bereit, Sensor bleibt leer)
    ev("A._hass.states['sensor.yippee_mia']={state:'unavailable',attributes:{}}; A._render()"); t(400)
    tx=box()
    ok('unavailable although data is there: warning for Mia', '⚠️' in tx and 'Mia' in tx and 'Ben' not in tx.split('⚠️')[1].split('\n')[0], tx[-300:])
    ev("A._hass.states['sensor.yippee_mia']={state:'13',attributes:{}}")
    # Kind umbenannt -> alter Vorlagen-Sensor übrig + neuer Name fehlt
    ev("(()=>{const o={...A._db.kid.B}; delete o.id; A._save('kid','B',{...o,name:'Benno'});})()"); t(800); show()
    tx=box()
    ok('renamed kid: warning with new name and old sensor', '⚠️' in tx and 'Benno' in tx and 'sensor.yippee_ben_juergen' in tx, tx[-400:])
    ev("(()=>{const o={...A._db.kid.B}; delete o.id; A._save('kid','B',{...o,name:'Ben Jürgen'});})()"); t(800); show()
    ok('renamed back: ✅ again', '✅ Dauerhafte' in box())
    # Vorlage nennt packages
    ok('yaml header mentions packages', 'packages/yippee.yaml' in ev("A._sensYaml()").split('template:')[0])
    ev("A._tab='heute'; A._render()"); t(300)
    # Kind gelöscht -> Eintrag weg
    ev("A._del('kid','B')"); t(1500); ev("A._pushSensors()"); t(5500)
    ok('deleted kid: entry removed', 'kp|sens|B' not in dict(sens()), list(dict(sens())))
    # Speicher-Übersicht zählt die Einträge mit, Datenprüfung bleibt ruhig
    ok('no data-check warning', not ev("!!A._dchk"))
    # wieder aus -> keine neuen Schreibvorgänge
    ev("A._setCfg({sensKeep:false}); window.wr=0; const o2=A._svc.bind(A); A._svc=(...a)=>{ if(String((a[1]||{}).item||'').startsWith('kp|sens|') && (a[1]||{}).item!=='kp|sens|tick') window.wr++; return o2(...a); }")
    ev("(()=>{const o={...A._db.kid.K}; delete o.id; A._save('kid','K',{...o,points:20});})()"); t(1500); ev("A._pushSensors()"); t(5500)
    ok('off again: no writes', ev("window.wr")==0)
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
