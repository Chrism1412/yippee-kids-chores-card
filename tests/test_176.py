# 1.7.0: 🤖 Fertige Automationen (Familienziel erreicht, Abend-Erinnerung) + Sensoren sofort aktuell (Status-Umschalten der Listeneinträge)
from playwright.sync_api import sync_playwright
import datetime, atexit, json, re
from jinja2.sandbox import ImmutableSandboxedEnvironment
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
J=ImmutableSandboxedEnvironment()
class St:
    def __init__(s,eid,attrs): s.entity_id=eid; s.attributes=attrs
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5});A._save('kid','B',{name:'Ben',emoji:'🐻',points:5,total:5});
      A._save('task','T',{title:'Tisch decken',emoji:'🍽️',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({sensKeep:true, fam:{title:'Freizeitpark',emoji:'🎢',cost:400,pts:100}, targets:['mobile_app_papa','notify.familienchat'], rTts:'tts.google_de', rPlayers:['media_player.kueche']});
      window.svc=[]; const o=A._svc.bind(A); A._svc=(...a)=>{ if(String((a[1]||{}).item||'').startsWith('kp|sens|')) window.svc.push([a[0],a[1].item,a[1].status||'']); return o(...a); };})()"""); t(800)
    # mock: Status merken wie Home Assistant
    ev("""(()=>{const cs=A._hass.callService; const h={...A._hass, callService:async(d,s,data,t,n)=>{ const r=await cs(d,s,data,t,n); if(d==='todo'&&s==='update_item'&&data.status){ const it=items[(t&&t.entity_id)||'todo.kinderpunkte'].find(i=>i.summary===data.item); if(it) it.status=data.status; } return r; }}; A.hass=h; B.hass=h;})()""")
    ev("A._pushSensors()"); t(5500)
    first=ev("window.svc")
    ok('new entries: add_item, then marker', [x[1] for x in first]==['kp|sens|B','kp|sens|K','kp|sens|fam','kp|sens|tick'] and all(x[0]=='add_item' for x in first), first)
    # Abhaken -> update mit umgeschaltetem Status
    ev("window.svc=[]; A._tab='heute'; A._render()"); t(300)
    ev("A.shadowRoot.querySelector('[data-a=atap][data-t=T][data-k=K]').click()"); t(2500); ev("A._pushSensors()"); t(5500)
    sv=ev("window.svc"); u=[x for x in sv if x[1]=='kp|sens|tick']
    ok('entry updated without status, then marker flipped once', [x[1] for x in sv if x[1]!='kp|sens|tick'][:1]==['kp|sens|K'] and all(x[2]=='' for x in sv if x[1]!='kp|sens|tick') and len(u)==1 and u[0][0]=='update_item' and u[0][2]=='completed' and sv[-1][1]=='kp|sens|tick', sv)
    s1=u[0][2]
    ev("window.svc=[]"); ev("A.shadowRoot.querySelector('[data-a=atap][data-t=T][data-k=K]').click()"); t(2500); ev("A._pushSensors()"); t(5500)
    u=[x for x in ev("window.svc") if x[1]=='kp|sens|tick']
    ok('next change flips marker back', len(u)==1 and u[0][2]=='needs_action', [s1,u])
    ok('marker kept (not cleaned up), entries read', ev("Object.keys(A._sensRaw).sort()")==['B','K','fam','tick'], ev("Object.keys(A._sensRaw)"))
    ev("window.svc=[]; A._pushSensors()"); t(5500)
    ok('no change: no writes, no marker', ev("window.svc")==[], ev("window.svc"))
    # ---- Automationen im Einstellungs-Bereich
    ev("A._setCfg({setView:'all'}); A._accAll=false; A._accOpen='sens'; A._tab='einst'; A._render()"); t(600)
    tx=ev("A.shadowRoot.querySelector('#app').innerText")
    ok('sensors section: only pointer to both places', 'Fertige Automationen' in tx and 'Benachrichtigen bei' in tx and '👨‍👩‍👧 Familienziel' in tx and not ev("!!A.shadowRoot.querySelector('[data-a=autonew][data-k=famgoal],[data-a=autonew][data-k=remind]')"))
    ev("A._accOpen='when'; A._render()"); t(400)
    ok('evening reminder under „Benachrichtigen bei …“', ev("!!A.shadowRoot.querySelector('[data-a=autonew][data-k=remind]')") and 'Abend-Erinnerung' in ev("A.shadowRoot.querySelector('#app').innerText"))
    ok('time field (default 19:00)', ev("A.shadowRoot.querySelector('input[data-cfgs=remT]').value")=='19:00')
    ev("A._tab='belohnungen'; A._render()"); t(400)
    fambox=ev("[...A.shadowRoot.querySelectorAll('.box')].find(b=>/Familienziel/.test((b.querySelector('h3')||{}).textContent||'')).innerHTML")
    ok('family announcement in family goal box (rewards tab)', 'data-k="famgoal"' in fambox)
    fg=ev("A._autoCfg('famgoal')")
    ok('family: template trigger on erreicht', fg['triggers'][0]['trigger']=='template' and "erreicht" in fg['triggers'][0]['value_template'])
    acts=[a['action'] for a in fg['actions']]
    ok('family: speaker + both targets', acts==['tts.speak','notify.mobile_app_papa','notify.send_message'], acts)
    ok('family: message with goal', 'Familienziel erreicht!' in fg['actions'][1]['data']['message'] and 'ziel' in fg['actions'][1]['data']['message'])
    ev("A.shadowRoot.querySelector('[data-a=autonew][data-k=famgoal]').click()"); t(1500)
    ok('family automation created', ev("Object.keys(window.autos||{})").count('config/automation/config/yippee_familienziel_erreicht')==1)
    ok('row shows ✅ in rewards tab', ev("A._tab")=='belohnungen' and not ev("!!A.shadowRoot.querySelector('[data-a=autonew][data-k=famgoal]')"))
    ev("A._tab='einst'; A._accOpen='when'; A._render()"); t(400)
    # Erinnerung: Uhrzeit ändern
    ev("(()=>{const i=A.shadowRoot.querySelector('input[data-cfgs=remT]'); i.value='19:30'; i.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(800)
    ok('time saved', ev("A._cfg.remT")=='19:30')
    rm=ev("A._autoCfg('remind')")
    ok('remind: time trigger', rm['triggers'][0]=={'trigger':'time','at':'19:30:00'}, rm['triggers'])
    ok('remind: push only to targets', [a['action'] for a in rm['actions']]==['notify.mobile_app_papa','notify.send_message'])
    ev("A.shadowRoot.querySelector('[data-a=autonew][data-k=remind]').click()"); t(1500)
    ok('remind created', 'config/automation/config/yippee_abend_erinnerung' in ev("Object.keys(window.autos||{})"))
    # Vorlage der Erinnerung auswerten
    tpl=rm['variables']['offen']
    states=[St('sensor.yippee_mia',{'friendly_name':'Yippee! Mia','heute_gesamt':3,'alles_erledigt':False,'offen':['Zähne putzen','Bett'],'anwesend':True}),
            St('sensor.yippee_ben',{'friendly_name':'Yippee! Ben','heute_gesamt':2,'alles_erledigt':True,'offen':[],'anwesend':True}),
            St('sensor.yippee_anna',{'friendly_name':'Yippee! Anna','heute_gesamt':2,'alles_erledigt':False,'offen':['Lesen'],'anwesend':False}),
            St('sensor.yippee_familienziel',{'friendly_name':'Yippee! Familienziel'}),
            St('sensor.temperatur',{'heute_gesamt':5,'alles_erledigt':False})]
    out=J.from_string(tpl).render(states=type('S',(),{'sensor':states})())
    ok('remind text: only kids with open tasks, present', out=='Mia: Zähne putzen, Bett', out)
    out2=J.from_string(tpl).render(states=type('S',(),{'sensor':states[1:2]})())
    ok('nothing open -> empty (condition stops)', out2=='' and J.from_string(rm['conditions'][0]['value_template']).render(offen=out2).strip()=='False')
    # später geändert -> neu schreiben
    ev("A._setCfg({remT:'20:00'}); A._render()"); t(400)
    ok('changed time -> rewrite button', 'neu schreiben' in ev("(A.shadowRoot.querySelector('[data-a=autonew][data-k=remind]')||{}).textContent||''"))
    ev("A.shadowRoot.querySelector('[data-a=autonew][data-k=remind]').click()"); t(1500); ev("A._render()"); t(300)
    ok('rewritten with 20:00', ev("window.autos['config/automation/config/yippee_abend_erinnerung'].triggers[0].at")=='20:00:00' and not ev("!!A.shadowRoot.querySelector('[data-a=autonew][data-k=remind]')"))
    # ohne Familienziel keine Familien-Automation
    ev("A._setCfg({fam:null}); A._tab='belohnungen'; A._render()"); t(300)
    ok('no goal: no family row', not ev("!!A.shadowRoot.querySelector('[data-k=famgoal]')"))
    ev("A._tab='einst'; A._accOpen='when'; A._render()"); t(300)
    # ohne Ziele: Hinweis
    ev("A._setCfg({targets:[]}); A._render()"); t(300)
    ok('no targets: hint', 'Ziel auswählen' in ev("A.shadowRoot.querySelector('#app').innerText"))
    # Nicht-Admin: kein Anlegen-Knopf
    ev("A._hass.user={id:'x',name:'Oma',is_admin:false}; A._render()"); t(300)
    ok('non-admin: no create button', not ev("!!A.shadowRoot.querySelector('[data-a=autonew][data-k=remind]')"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
