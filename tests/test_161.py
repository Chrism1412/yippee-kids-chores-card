# 1.5.0: Listen mit einem Tipp anlegen (nur Admin) + Sprachauswahl im ersten Fenster
from playwright.sync_api import sync_playwright
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
MOCK = """(()=>{window.flows=[]; const h=A._hass; window.origApi=window.origApi||h.callApi; h.callApi=async(m,path,data)=>{ if(path==='config/config_entries/flow'){ window.flows.push(['start',data]); return {type:'form',flow_id:'f1',data_schema:[{name:'todo_list_name'}]}; } if(path==='config/config_entries/flow/f1'){ window.flows.push(['submit',data]); const id='todo.'+data.todo_list_name.toLowerCase().replace(/[^a-z0-9]+/g,'_'); window.items[id]=window.items[id]||[]; setTimeout(()=>{ h.states[id]={state:'0',attributes:{friendly_name:data.todo_list_name}}; A.hass={...h}; },300); return {type:'create_entry'}; } return window.origApi(m,path,data); };})()"""
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':412,'height':900}); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/kp_test.html'); pg.wait_for_timeout(1000); ev=pg.evaluate; t=pg.wait_for_timeout
    q=lambda sel: f"A.shadowRoot.querySelector('{sel}')"
    ev(MOCK)
    # Eigene Foto-Liste mit eigenem Namen
    ev("A._wiz=null; A._setCfg({wizDone:true,setView:'all',photoOn:true,approval:true}); A._tab='einst'; A._accAll=false; A._accOpen='f_photoOn'; A._render()"); t(800)
    ok('photo list: create row', ev(f"!!{q('.mkrow [data-a=mklist][data-for=phList]')}") and ev(f"{q('.mkrow .newlist')}.value")=='Yippee Fotos')
    pg.locator('#a .mkrow .newlist').fill('Yippee Bilder'); ev(f"{q('.mkrow [data-a=mklist]')}.click()"); t(1500)
    ok('photo list created + selected', ev("A._cfg.phList")=='todo.yippee_bilder' and ev("window.flows.slice(-1)[0][1].todo_list_name")=='Yippee Bilder', ev("A._cfg.phList"))
    ev("A.shadowRoot.activeElement && A.shadowRoot.activeElement.blur()"); t(400)
    ok('row gone once list exists', not ev(f"!!{q('.mkrow [data-for=phList]')}"))
    # Vorhandene Liste mit gleichem Namen: keine zweite
    ev("A.shadowRoot.activeElement && A.shadowRoot.activeElement.blur()"); t(300)
    n=ev("window.flows.length"); ev("A._accOpen='bk'; A._setCfg({abOn:true}); A._render()"); t(400)
    ev("A._hass.states['todo.yippee_sicherung']={state:'0',attributes:{friendly_name:'Yippee Sicherung'}}"); 
    ev(f"{q('.mkrow [data-a=mklist][data-for=ab2]')}.click()"); t(800)
    ok('existing list reused, no new flow', ev("A._cfg.ab2")=='todo.yippee_sicherung' and ev("window.flows.length")==n, (ev("A._cfg.ab2"), ev("window.flows.length"), n))
    # Nicht-Admin: kein Knopf, keine Admin-Schnittstelle
    ev(MOCK); ev("A._hass.user={...A._hass.user,is_admin:false}; A.setConfig({storage:'todo.yippee_kids_chores',mode:'admin'}); A.hass={...A._hass}"); t(800)
    ok('non-admin: no create button', not ev(f"!!{q('[data-a=mklist]')}") and 'Administrator' in ev(f"{q('#app')}.innerText"))
    ok('non-admin: manual steps with real name', 'todo.yippee_kids_chores' in ev(f"{q('#app')}.innerText") and 'Yippee Kids Chores' in ev(f"{q('#app')}.innerText"))
    ev("A._mkList('Test').catch(()=>{})"); t(300)
    ok('non-admin never calls config flow', ev("window.flows.length")==0)
    # Admin: Sprache wählen, Liste anlegen
    ev("A._hass.user={...A._hass.user,is_admin:true}; A.hass={...A._hass}"); t(500)
    ok('language picker with all languages', ev(f"{q('.prelang')}.options.length")==28)
    pg.select_option('#a .prelang','en'); t(800)
    for _ in range(40):  # Sprachpaket wird erst jetzt geladen
        if 'Set up' in ev(f"{q('#app')}.innerText"): break
        t(500); pg.wait_for_timeout(150)
    ok('first window switches language', 'Set up' in ev(f"{q('#app')}.innerText") and 'Create list' in ev(f"{q('#app')}.innerText"), ev(f"{q('#app')}.innerText")[:80])
    ev(f"{q('[data-a=mklist]')}.click()"); t(2500)
    for _ in range(40):  # warten, bis die neue Liste geladen und die Sprache übernommen ist
        if ev("A._loaded===true && A._cfg.lang==='en' && !!A.shadowRoot.querySelector('.wiz .prelang')"): break
        t(500); pg.wait_for_timeout(150)
    ok('config flow local_todo', ev("window.flows")==[['start',{'handler':'local_todo','show_advanced_options':False}],['submit',{'todo_list_name':'Yippee Kids Chores'}]], ev("window.flows"))
    ok('card starts after creating', ev("A._loaded===true") and ev(f"!!{q('.wiz')}"))
    ok('chosen language saved', ev("A._cfg.lang")=='en' and not ev("localStorage.getItem('kpPreLang')"), (ev("A._cfg.lang"), ev("localStorage.getItem('kpPreLang')"), ev("A._preLang"), ev("A._config.storage"), ev("Object.keys(A._db.cfg)")))
    ok('wizard has language picker', ev(f"!!{q('.wiz .prelang')}") and ev(f"{q('.wiz .prelang')}.value")=='en')
    for _ in range(40):
        if ev(f"!!{q('.wiz .prelang')}"): break
        t(500); pg.wait_for_timeout(150)
    pg.select_option('#a .wiz .prelang','de'); t(800)
    ev("A.shadowRoot.activeElement && A.shadowRoot.activeElement.blur(); A._render()")
    for _ in range(40):
        if 'Einrichtung' in ev(f"{q('.wiz')}.innerText"): break
        t(500); pg.wait_for_timeout(150)
    ok('wizard language change saves', ev("A._cfg.lang")=='de' and 'Einrichtung' in ev(f"{q('.wiz')}.innerText"), (ev("A._cfg.lang"), ev(f"{q('.wiz')}.innerText")[:60]))
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
