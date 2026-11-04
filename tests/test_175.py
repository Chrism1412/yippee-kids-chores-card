# 1.7.0: 📋 Eltern-Heute – fertige/abgelaufene Tageszeiten klappen automatisch zu, „Alle einklappen“; 🎯 Familienziel als Sensor; 🌙 eigene Farben optional dunkel
from playwright.sync_api import sync_playwright
import datetime, atexit, json, ast, yaml
from jinja2.sandbox import ImmutableSandboxedEnvironment
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
J=ImmutableSandboxedEnvironment()
def from_json(v, default=None):
    try: return json.loads(v)
    except Exception: return default
J.filters['from_json']=from_json
def render(tpl, **v):
    sv=J.from_string(tpl).render(**v).strip()
    try: return ast.literal_eval(sv)
    except Exception: return None if sv=='None' else sv
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{try{localStorage.removeItem('kpAdmFold')}catch(e){}
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5});A._save('kid','B',{name:'Ben',emoji:'🐻',points:5,total:5});
      A._save('task','M',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01',from:'07:00',to:'08:00'});
      A._save('task','E',{title:'Bettfertig',emoji:'😴',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01',from:'18:00',to:'20:00'});
      A._save('task','O',{title:'Zimmer aufräumen',emoji:'🧹',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','O2',{title:'Hausaufgaben',emoji:'📚',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({dayBlocks:true}); A._tab='heute'; A._render();})()"""); t(800)
    box=lambda k: f"[...A.shadowRoot.querySelectorAll('.box')].find(b=>b.querySelector('[data-a=admfold][data-id=\"kid:{k}\"]'))"
    txt=lambda k: ev(f"({box(k)}).innerText")
    hdr=lambda key: f"A.shadowRoot.querySelector('[data-a=admfold][data-id=\"{key}\"]')"
    # 1) abgelaufene Tageszeit automatisch zu
    ok('past block (Morgens 7-8 at 16:00) auto-collapsed', 'Zähne putzen' not in txt('K') and ev(f"{hdr('K:m')}.getAttribute('aria-expanded')")=='false', txt('K')[:200])
    ok('current/later blocks open', 'Bettfertig' in txt('K') and 'Zimmer aufräumen' in txt('K'))
    ok('count still visible on collapsed block', '0/1' in ev(f"{hdr('K:m')}.textContent"))
    ev(f"{hdr('K:m')}.click()"); t(400)
    ok('tap opens auto-collapsed block', 'Zähne putzen' in txt('K'))
    ok('opened state remembered for today', ev("JSON.parse(localStorage.getItem('kpAdmFold'))['K:m'].o")==1)
    ev("A._admF=null; A._render()"); t(300)
    ok('still open after reload', 'Zähne putzen' in txt('K'))
    ev(f"{hdr('K:m')}.click()"); t(300)
    ok('tap again closes', 'Zähne putzen' not in txt('K'))
    ev(f"{hdr('K:m')}.click()"); t(300)
    ok('and opens again', 'Zähne putzen' in txt('K'))
    # alles erledigt -> zu
    for tid in ('O','O2'): ev(f"A.shadowRoot.querySelector('[data-a=atap][data-t={tid}][data-k=K]').click()"); t(1500)
    ok('all done in block -> auto-collapsed', 'Hausaufgaben' not in txt('K') and ev(f"{hdr('K:day')}.getAttribute('aria-expanded')")=='false', txt('K')[:300])
    ok('other kid unaffected', 'Hausaufgaben' not in txt('B') and 'Zimmer aufräumen' in txt('B'))
    # Einstellung aus -> nichts automatisch
    ev("A._setCfg({autoFold:false}); try{localStorage.removeItem('kpAdmFold')}catch(e){}; A._admF=null; A._render()"); t(400)
    ok('autoFold off: everything open', 'Zähne putzen' in txt('K') and 'Hausaufgaben' in txt('K'))
    ev("A._setCfg({autoFold:true})"); t(300)
    # 2) Alle einklappen / aufklappen
    ok('fold-all button', ev("A.shadowRoot.querySelector('[data-a=admall]').textContent").strip().startswith('▸'))
    ev("A.shadowRoot.querySelector('[data-a=admall]').click()"); t(300)
    ok('all kids collapsed', 'Bettfertig' not in txt('K') and 'Bettfertig' not in txt('B') and '/' in txt('B'))
    ok('button now expands', ev("A.shadowRoot.querySelector('[data-a=admall]').textContent").strip().startswith('▾'))
    ev("A.shadowRoot.querySelector('[data-a=admfold][data-id=\"kid:B\"]').click()"); t(300)
    ok('one opened -> button collapses again', ev("A.shadowRoot.querySelector('[data-a=admall]').textContent").strip().startswith('▸') and 'Bettfertig' in txt('B'))
    ev("A.shadowRoot.querySelector('[data-a=admall]').click()"); t(200); ev("A.shadowRoot.querySelector('[data-a=admall]').click()"); t(300)
    ok('expand all', 'Bettfertig' in txt('K') and 'Bettfertig' in txt('B'))
    ev("A._del('kid','B')"); t(800)
    ok('one kid: no fold-all button', not ev("!!A.shadowRoot.querySelector('[data-a=admall]')"))
    ev("A._save('kid','B',{name:'Ben',emoji:'🐻',points:5,total:5})"); t(800)
    # 3) Familienziel-Sensor
    ev("A._setCfg({sensKeep:true, fam:{title:'Freizeitpark',emoji:'🎢',cost:400,pts:100}}); A._pushSensors()"); t(5500)
    it={i['summary']:i.get('description') for i in ev("items['todo.kinderpunkte']")}
    fam=json.loads(it.get('kp|sens|fam') or '{}')
    ok('family entry stored', fam.get('p')==100 and fam['a']['ziel']=='Freizeitpark' and fam['a']['prozent']==25 and fam['a']['fehlen']==300 and fam['a']['erreicht'] is False, fam)
    ok('live sensor pushed', 'states/sensor.yippee_familienziel' in ev("Object.keys(window.sensors||{})") and ev("window.sensors['states/sensor.yippee_familienziel'].state")=='100')
    y=yaml.safe_load(ev("A._sensYaml()"))['template'][0]
    fs=[x for x in y['sensor'] if x['unique_id']=='yippee_familienziel']
    ok('yaml contains family sensor', len(fs)==1 and fs[0]['default_entity_id']=='sensor.yippee_familienziel')
    resp={'todo.kinderpunkte':{'items':[{'summary':i['summary'],'description':i.get('description')} for i in ev("items['todo.kinderpunkte']")]}}
    yv=render(y['actions'][1]['variables']['y'], r=resp)
    ok('jinja: family state + attributes', render(fs[0]['state'], y=yv)==100 and render(fs[0]['attributes']['prozent'], y=yv)==25 and render(fs[0]['attributes']['erreicht'], y=yv) is False)
    ev("A._setCfg({fam:{title:'Freizeitpark',emoji:'🎢',cost:400,pts:150}}); A._pushSensors()"); t(5500)
    ok('family entry updated', json.loads({i['summary']:i.get('description') for i in ev("items['todo.kinderpunkte']")}['kp|sens|fam'])['p']==150)
    # Status: Kinder per Vorlage, Familienziel fehlt -> Warnung
    ev("['sensor.yippee_mia','sensor.yippee_ben'].forEach(id=>{A._hass.entities[id]={platform:'template'}; A._hass.states[id]={state:'5',attributes:{}};}); A._setCfg({setView:'all'}); A._accAll=false; A._accOpen='sens'; A._tab='einst'; A._render()"); t(500)
    tx=ev("A.shadowRoot.querySelector('#app').innerText")
    ok('template without family goal -> warning names it', '⚠️' in tx and 'Familienziel' in tx.split('⚠️')[1][:200], tx.split('⚠️')[1][:200] if '⚠️' in tx else '')
    ev("A._hass.entities['sensor.yippee_familienziel']={platform:'template'}; A._hass.states['sensor.yippee_familienziel']={state:'150',attributes:{}}; A._render()"); t(400)
    ok('with family sensor -> ✅', '✅ Dauerhafte Sensoren aktiv' in ev("A.shadowRoot.querySelector('#app').innerText"))
    # Ziel entfernt -> Eintrag weg, Sensor als „nicht mehr gebraucht“
    ev("A._setCfg({fam:null}); A._pushSensors()"); t(5500)
    ok('goal removed: entry removed', 'kp|sens|fam' not in [i['summary'] for i in ev("items['todo.kinderpunkte']")])
    ev("A._render()"); t(300)
    ok('goal removed: old sensor reported', 'sensor.yippee_familienziel' in ev("A.shadowRoot.querySelector('#app').innerText"))
    # 4) eigene Farben im Darkmode
    ev("A._setCfg({vTheme:'custom', vCol:{bg:'#fff0d0',surface:'#ffe0a0',text:'#332200',accent:'#ff8800'}})"); t(400)
    ev("(()=>{const h={...A._hass, themes:{darkMode:true}}; A.hass=h;})()"); t(400)
    bg=lambda: ev("getComputedStyle(A.shadowRoot.querySelector('.card')).backgroundColor")
    ok('own colours: unchanged by default', bg()=='rgb(255, 240, 208)', bg())
    ev("A._accOpen='look'; A._render()"); t(300)
    ok('option shown with own colours', ev("!!A.shadowRoot.querySelector('[data-k=vDarkOwn]')"))
    ev("A.shadowRoot.querySelector('[data-k=vDarkOwn]').click()"); t(600)
    ok('option on: own colours darkened', ev("A._cfg.vDarkOwn")==True and bg()!='rgb(255, 240, 208)' and sum(int(x) for x in bg()[4:-1].split(','))<200, bg())
    ok('accent kept', ev("getComputedStyle(A).getPropertyValue('--yippee-accent').trim()").lower()=='#ff8800', ev("getComputedStyle(A).getPropertyValue('--yippee-accent')"))
    ev("(()=>{const h={...A._hass, themes:{darkMode:false}}; A.hass=h;})()"); t(400)
    ok('light HA: own colours as chosen', bg()=='rgb(255, 240, 208)', bg())
    ev("A._setCfg({vCol:{bg:'#202020',surface:'#303030',text:'#eeeeee',accent:'#ff8800'}}); const h={...A._hass, themes:{darkMode:true}}; A.hass=h"); t(400)
    ok('already dark own colours unchanged', bg()=='rgb(32, 32, 32)', bg())
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
