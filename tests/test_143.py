from playwright.sync_api import sync_playwright
from jinja2.sandbox import ImmutableSandboxedEnvironment
import datetime, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
def render(tpl, items, now, trigger):
    env=ImmutableSandboxedEnvironment(extensions=['jinja2.ext.loopcontrols'])
    env.filters['from_json']=json.loads
    env.globals['now']=lambda: now
    return env.from_string(tpl).render(kp={'todo.kinderpunkte':{'items':items}}, trigger=trigger, none=None).strip()
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-14T12:00:00'))  # Mittwoch
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(300)
    t=lambda ms=600: pg.clock.run_for(ms); ev=pg.evaluate
    L="window.items['todo.kinderpunkte']"
    ev("A._setCfg({approval:false,targets:['mobile_app_phone_a']}); A._save('kid','K',{name:'Mia',emoji:'🦊',points:0,since:'2026-10-01'}); A._save('kid','J',{name:'Ben',emoji:'🐻',points:0,since:'2026-10-01',user:'kid2'})"); t(1200)
    # ---- Routine
    ev("A._setCfg({routOn:true}); A._save('task','RT',A._taskFromTemplate(['🌅 Morgens','🌅','Morgen-Routine',3,'',null,4,12],['K']))"); t(1200)
    ok('routine template has steps', len(ev("A._db.task.RT.steps"))==7)
    ev("B._kidTap('RT','K',null)"); t(300)
    ok('routine opens checklist', ev("B.shadowRoot.querySelectorAll('#modal [data-rstep]').length")==7)
    for i in range(6):
        ev(f"(()=>{{const x=B.shadowRoot.querySelectorAll('#modal [data-rstep]')[{i}]; x.checked=true; x.dispatchEvent(new Event('change',{{bubbles:true,composed:true}}));}})()"); t(200)
    t(800)
    ok('progress saved', ev("B._routDone('2026-10-14','RT','K',7).length")==6 and ev("B._st('2026-10-14','RT','K')")=='')
    ev("(()=>{const x=B.shadowRoot.querySelectorAll('#modal [data-rstep]')[6]; x.checked=true; x.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(1200)
    ok('last step completes task', ev("B._st('2026-10-14','RT','K')")=='d' and ev("B._db.kid.K.points")==3, ev("B._db.kid.K.points"))
    ev("A._render()"); t(200)
    # ---- Wallet + LaMetric
    ev("A._setCfg({walletOn:true,lmOn:true,lmDev:'dev1'}); A._hass.services.lametric={message:{}}; window.lm=[]; const o=A._hass.callService; A._hass.callService=async(d,s,data,tt,n)=>{ if(d==='lametric') window.lm.push(data); return o(d,s,data,tt,n); }; 0"); t(500)
    ev("A._save('reward','R',{title:'Eis',emoji:'🍦',cost:2})"); t(800)
    ev("A._redeem('K','R')"); t(1500)
    ok('voucher created', len(ev("A._db.kid.K.vouch||[]"))==1)
    ok('lametric redeem msg', any('Eis' in x['message'] for x in ev("window.lm")), ev("window.lm"))
    ev("A._save('kid','K',{...A._db.kid.K}); A._render()"); t(500)
    vid=ev("A._db.kid.K.vouch[0].id")
    ev(f"A._until=Date.now()+9e6; A._tab='heute'; A._render(); (()=>{{const b=A.shadowRoot.querySelector('[data-a=\"vuse\"]')||B.shadowRoot.querySelector('[data-a=\"vuse\"]'); b.click(); b.click();}})()"); t(1500)
    ok('voucher used', len(ev("A._db.kid.K.vouch||[]"))==0, ev("A._db.kid.K.vouch"))
    # ---- NFC
    ev("A._setCfg({nfcOn:true}); A._save('task','NF',{title:'Zähne',emoji:'🦷',points:2,kids:['K','J'],sched:'week',days:[],nfc:'tag-zahn'})"); t(1000)
    cfg=ev("A._autoCfg('nfc')")
    ok('nfc automation condition', 'tag-zahn' in cfg['conditions'][0]['value_template'] and cfg['triggers'][0]['event_type']=='tag_scanned')
    ev("A._save('act','n1',{a:'KP|nfc|tag-zahn',u:'kid2'})"); t(5000)
    ok('nfc marks right kid', ev("A._st('2026-10-14','NF','J')")=='d' and ev("A._st('2026-10-14','NF','K')")=='', [ev("A._st('2026-10-14','NF','J')"),ev("A._st('2026-10-14','NF','K')")])
    ev("A._save('act','n2',{a:'KP|nfc|unknown',u:'kid2'})"); t(5000)
    ok('unknown tag ignored', not ev("Object.keys(A._db.act).length"))
    # ---- Prognose
    ev("A._setCfg({progOn:true,goalOn:true}); A._save('reward','G',{title:'Lego',emoji:'🧱',cost:100}); A._save('kid','K',{...A._db.kid.K,goal:'G'})"); t(1000)
    ev("for(let i=0;i<10;i++) A._addPoints('K',2,'x')"); t(1500)
    eta=ev("A._etaTxt(100-A._db.kid.K.points, A._rate('K'), false)")
    ok('prognosis text', 'Tagen' in eta, eta)
    ev("B._render()"); t(200)
    ok('prognosis shown in kid view', 'Bei deinem Tempo' in ev("B.shadowRoot.innerHTML"))
    # ---- Preis-Assistent
    ev("A._setCfg({priceOn:true}); A._save('task','P1',{title:'Pflicht',emoji:'⭐',points:10,kids:['J'],sched:'week',days:[]})"); t(1000)
    sg=ev("(()=>{const s=A._priceSuggest(2,12); return s && {n:s.list.length, fam:s.fam, std:s.list.map(x=>x.std)};})()")
    ok('price suggestion', sg and sg['n']==2 and all(x>0 for x in sg['std']), sg)
    ev("A._tab='belohnungen'; A._render()"); t(200)
    ok('days shown', 'Tage' in ev("A.shadowRoot.innerHTML") and 'data-a="psug"' in ev("A.shadowRoot.innerHTML"))
    # ---- Wochen-Bonus / Teambonus (letzte Woche alles erledigt)
    ev("""(()=>{ for(let i=5;i<=11;i++){ const d='2026-10-'+String(i).padStart(2,'0'); const s={}; ['RT','NF','P1'].forEach(t=>{['K','J'].forEach(k=>s[t+':'+k]='d')}); A._save('log',d,{s}); } })()"""); t(1500)
    ev("A._setCfg({wbOn:true,wbDays:5,wbPts:10,teamOn:true,teamPts:5}); window.__kpOnce=new Set()"); t(800)
    before=ev("[A._db.kid.K.points,A._db.kid.J.points]")
    ev("A._bonusCheck(A._kids())"); t(1500)
    after=ev("[A._db.kid.K.points,A._db.kid.J.points]")
    ok('weekly bonus', after[0]-before[0]>=10 and after[1]-before[1]>=10, (before,after))
    ev("A._bonusCheck(A._kids())"); t(800)
    ok('weekly bonus once', ev("[A._db.kid.K.points,A._db.kid.J.points]")==after)
    # ---- Begrüßung
    ev("A._setCfg({welcOn:true,welcPush:true}); A._save('kid','J',{...A._db.kid.J,pres:{on:true,base:'out',rules:[{st:'in',every:1,start:'2026-10-14',fT:'15:00',toDay:5,tT:'12:00'}],hol:{},ex:[]}}); window.notes=[]; window.__kpOnce=new Set()"); t(1000)
    ok('arrival detected', ev("A._arrival('J','2026-10-14')")=={'at':'15:00'}, ev("A._arrival('J','2026-10-14')"))
    ev("A._bonusCheck(A._kids())"); t(800)
    ok('arrival push', any('Ben' in n and '15:00' in n for n in ev("window.notes")), ev("window.notes"))
    ev("B._render()"); t(200)
    h=ev("B.shadowRoot.innerHTML")
    ok('before arrival: only "Aufgaben ab"', 'Aufgaben ab 15:00' in h and 'Willkommen zurück' not in h)
    # ---- Plausi-Check
    ev("A._save('kid','J',{...A._db.kid.J,pres:{on:true,base:'out',rules:[{st:'out',every:1,start:'2026-10-14',fT:'08:00',toDay:4,tT:'14:00'}],hol:{},ex:[]}})"); t(1000)
    ev("A._tab='heute'; A._render()"); t(300)
    h=ev("A.shadowRoot.innerHTML")
    ok('check: never present', 'nie da' in h)
    ev("A.shadowRoot.querySelector('[data-a=\"hhide\"]').click()"); t(800)
    ok('check hide', 'nie da' not in ev("A.shadowRoot.innerHTML"))
    # ---- Sprache
    ev("A._setCfg({voiceOn:true,bgOn:false}); A._planCheck()"); t(1500)
    vc=ev("A._autoCfg('voice')")
    ok('voice triggers', vc['triggers'][0]['trigger']=='conversation' and any('{name}' in x for x in vc['triggers'][0]['command']))
    items=ev(L); now=datetime.datetime(2026,10,14,12,0)
    a1=render(vc['actions'][1]['set_conversation_response'], items, now, {'id':'pts','slots':{'name':'mia'}})
    pts=ev("A._db.kid.K.points")
    ok('voice points', a1==f'Mia hat {pts} Sterne.', a1)
    a2=render(vc['actions'][1]['set_conversation_response'], items, now, {'id':'open','slots':{'name':'Ben'}})
    ok('voice open', 'Ben' in a2, a2)
    a3=render(vc['actions'][1]['set_conversation_response'], items, now, {'id':'open','slots':{'name':'Xaver'}})
    ok('voice unknown', 'kenne ich nicht' in a3, a3)
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
