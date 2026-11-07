# Regressionstest: Konto OHNE Admin-Rechte darf keine Admin-Schnittstellen aufrufen (sonst 401 → IP-Sperre), auch mit allen Zusatzfunktionen
from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script("window.__api=[]")
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-14T19:30:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(300)
    t=lambda ms=600: pg.clock.run_for(ms); ev=pg.evaluate
    # Daten als Admin anlegen
    ev("""A._setCfg({approval:true,photoOn:true,targets:['mobile_app_phone_a'],routOn:true,progOn:true,priceOn:true,nfcOn:true,walletOn:true,wbOn:true,teamOn:true,welcOn:true,welcPush:true,voiceOn:true,lmOn:true,lmDev:'d1',costKidOn:true,bgOn:true,gradesOn:true,jokerOn:true,behavOn:true,statOn:true,wishOn:true,dayBlocks:true,goalOn:true,sensors:true});
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:50,since:'2026-10-01',pres:{on:true,base:'out',rules:[{st:'in',every:1,start:'2026-10-14',fT:'15:00',toDay:5,tT:'12:00'}],hol:{},ex:[]}});
      A._save('kid','J',{name:'Ben',emoji:'🐻',points:20,since:'2026-10-01'});
      A._save('task','T',{title:'Zimmer',emoji:'🧹',points:3,kids:['K','J'],sched:'week',days:[],photo:true,nfc:'tag1',steps:[{t:'a'},{t:'b'}]});
      A._save('reward','R',{title:'Eis',emoji:'🍦',cost:5,costs:{K:8}}); A._setCfg({fam:{title:'Park',cost:100,pts:0}}); 0"""); t(2000)
    # ab jetzt: Benutzer ohne Admin-Rechte auf beiden Karten
    ev("""(()=>{ for (const C of [A,B]) { const h=C._hass; h.user={id:'kid1',name:'Kind',is_admin:false};
      h.callApi=async(m,path,data)=>{ window.__api.push(m+' '+path); if(/^(states|config)/.test(path)) throw new Error('401'); return []; };
      h.fetchWithAuth=async(u,o)=>{ window.__api.push('FETCH '+u); return {ok:false,status:401}; };
      const ow=h.callWS; h.callWS=async(m)=>{ if(m.type==='media_source/local_source/remove') window.__api.push('WS '+m.type+' '+m.media_content_id); if(/^lovelace\/resources\/(update|delete|create)/.test(m.type)) window.__api.push('WS '+m.type); return ow(m); };
      C._autoChecked=false; C._sensorFail=false; C._sensSig={}; C._autoOk={nfc:true,voice:true,bg:true}; }
      A._hass.services.lametric={message:{}}; window.__kpOnce=new Set(); })()"""); t(300)
    # alles anstoßen, was die Karte von selbst tut
    ev("A._penaltyCheck(); B._penaltyCheck(); A._planCheck(); A._pushSensors(); A._autoStatus(); A._updCheck(true); A._cleanup(); A._consCheck(); A._bonusCheck(A._kids())"); t(3000)
    for tab in ['heute','aufgaben','belohnungen','kinder','einst']:
        ev(f"A._until=Date.now()+9e6; A._tab='{tab}'; A._accAll=true; A._render()"); t(400)
    ev("A._autoCreate('nfc',false); A._autoCreate('voice',false); A._autoCreate('bg',true)"); t(800)
    ev("A._priceDlg(); A._closeModal(); A._editReward('R'); A._closeModal(); A._editKid('K'); A._closeModal(); A._editTask('T'); A._closeModal()"); t(500)
    # Kind-Aktionen
    ev("A._setCfg({approval:false}); B._routFinish('T','J',null)"); t(1500)
    ev("A._uploadPhoto(new Blob(['x'],{type:'image/jpeg'}),'x.jpg').catch(()=>{})"); t(800)
    ev("A._redeem('K','R')"); t(1500)
    ev("A._save('act','n1',{a:'KP|nfc|tag1',u:'kid1'})"); t(5000)
    ev("A._photoDel('kp_2026-10-14_mia_T.jpg'); A._photoDone('2026-10-14','T','K')"); t(500)
    # 1.5.0: Listen anlegen, Ressourcen umstellen, Admin-Knöpfe
    ev("A._mkList('Yippee Test').catch(()=>{}); A._updRes(); A._resClean(); A._upd={dups:[{id:'x'}],res:{id:'r',url:'/x.js'}}; A._updRes(true); A._resClean()"); t(800)
    ev("A._until=Date.now()+9e6; A._tab='einst'; A._setCfg({setView:'all',photoOn:true,abOn:true,cmdOn:true}); A._accAll=true; A._render()"); t(600)
    ok('no admin buttons for non-admin', ev("A.shadowRoot.querySelectorAll('[data-a=autonew], [data-a=mklist], [data-a=updres], [data-a=resclean]').length")==0 and '🔒' in ev("A.shadowRoot.innerHTML"))
    bad=[x for x in ev("window.__api") if x.startswith('POST states') or 'config/' in x or 'upload' in x or x.startswith('DELETE') or x.startswith('WS media_source/local_source/remove') or x.startswith('WS lovelace/resources/')]
    ok('no admin-only calls as non-admin', not bad, bad)
    ok('features still work (redeem, voucher)', ev("A._db.kid.K.points")==42 and len(ev("A._db.kid.K.vouch||[]"))==1, (ev("A._db.kid.K.points"), ev("A._db.kid.K.vouch")))
    ev("A.setConfig({storage:'todo.fehlt',mode:'admin'}); A.hass={...A._hass}"); t(600)
    ok('setup screen: no create button for non-admin', not ev("!!A.shadowRoot.querySelector('[data-a=mklist]')") and 'Administrator' in ev("A.shadowRoot.querySelector('#app').innerText"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
