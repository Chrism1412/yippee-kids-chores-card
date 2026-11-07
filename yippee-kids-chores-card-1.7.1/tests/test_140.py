from playwright.sync_api import sync_playwright
import datetime, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script("window.__api=[]")
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-08T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html#kid'); pg.clock.run_for(300)
    t=lambda ms=600: pg.clock.run_for(ms); ev=pg.evaluate
    def settle():
        for i in range(60):
            pg.wait_for_timeout(100); t(200)
            if ev("!!A._mark('2026-10-08','f:T:K')"): break
        t(1500)
    ev("""(()=>{window.items['todo.yippee_fotos']=[]; A._hass.states['todo.yippee_fotos']={state:'0',attributes:{friendly_name:'Yippee Fotos'}};
      A._hass.fetchWithAuth=async(u)=>{window.__api.push('FETCH '+u); return {ok:false,status:401};};
      const o=A._hass.callWS; A._hass.callWS=async(m)=>{ if(m.type==='media_source/local_source/remove') window.__api.push('MEDIADEL '+m.media_content_id); return o(m); };})()""")
    ev("A._setCfg({approval:true,photoOn:true,targets:['mobile_app_phone_a']}); A._save('kid','K',{name:'Mia',emoji:'🦊',points:0})"); t(1200)
    ev("A._save('task','T',{title:'Zimmer',emoji:'🧹',points:3,kids:['K'],sched:'week',days:[],photo:true})"); t(1200)
    def kid_photo(card):
        with pg.expect_file_chooser() as fc:
            ev(f"{card}._hass.user={{id:'kid1',name:'Kind',is_admin:false}}; {card}._kidTap('T','K',null)")
        fc.value.set_files('ph_test.jpg'); settle()
    # 1) Hauptliste
    kid_photo('A')
    f=ev("A._mark('2026-10-08','f:T:K')")
    main=[i for i in ev("window.items['todo.kinderpunkte']") if i['summary'].startswith('kp|ph|')]
    ok('mark is list photo', f.startswith('ph:'), f)
    ok('stored in main list', len(main)==1 and len(main[0]['description'])<100000, len(main[0]['description']) if main else 0)
    ok('no upload attempt', not any(x.startswith('FETCH') for x in ev("window.__api")), ev("window.__api"))
    ok('status pending', ev("A._st('2026-10-08','T','K')")=='p')
    ok('notify hint, no image', any('Foto in der Karte' in n for n in ev("window.notes")) and not (ev("window.lastData") or {}).get('image'), ev("window.notes[window.notes.length-1]"))
    ev("A._hass.user={id:'admin1',name:'Papa',is_admin:true}; A._until=Date.now()+9e6; A._tab='heute'; A._render()"); t(600)
    src=ev("(()=>{const i=A.shadowRoot.querySelector('img.phth'); return i?i.getAttribute('src'):''})()")
    ok('parent sees thumbnail', src.startswith('data:image/jpeg;base64,'), src[:40])
    B_src=ev("(()=>{B._render(); return B._photoUrl(A._mark('2026-10-08','f:T:K'))})()")
    ok('other card loads from list', B_src.startswith('data:image/jpeg'), B_src[:30])
    ev("A._adminSet('2026-10-08','T','K',true)"); t(2000)
    main=[i for i in ev("window.items['todo.kinderpunkte']") if i['summary'].startswith('kp|ph|')]
    ok('photo deleted after approval', not main and not ev("A._mark('2026-10-08','f:T:K')"))
    ok('points booked', ev("A._db.kid.K.points")==3)
    # 2) eigene Foto-Liste, Ablehnen per Push-Knopf
    ev("A._setCfg({phList:'todo.yippee_fotos'}); A._setSt('2026-10-08','T','K','')"); t(1500)
    kid_photo('A')
    fl=window_items=ev("window.items['todo.yippee_fotos']")
    ok('stored in photo list', len(fl)==1 and fl[0]['summary'].startswith('kp|ph|') and not any(i['summary'].startswith('kp|ph|') for i in ev("window.items['todo.kinderpunkte']")))
    ev("B._phMem={}; B._phT=0"); src2=ev("B._photoUrl(A._mark('2026-10-08','f:T:K'))"); t(800)
    src2=ev("B._photoUrl(A._mark('2026-10-08','f:T:K'))")
    ok('loaded from photo list', src2.startswith('data:image/jpeg'), src2[:30])
    ev("A._actRun('KP','no','2026-10-08','T','K')"); t(1500)
    ok('photo list cleaned on reject', not ev("window.items['todo.yippee_fotos']"))
    # 3) Sicherheit: manipulierte Foto-Verweise
    ev("""(()=>{const L=window.items['todo.kinderpunkte']; const it=L.find(i=>i.summary==='kp|log|2026-10-08'); const o=JSON.parse(it.description); delete o._c; o.s['f:T:K']='../../../config/secrets.yaml'; o.s['T:K']='p'; it.description=JSON.stringify(o); A._onItems(L);})()"""); t(300)
    ok('bad media path dropped', ev("A._mark('2026-10-08','f:T:K')")=='')
    ev("A._photoDel('../secrets.yaml'); A._photoDel('ph:<x>')"); t(300)
    ok('no media delete for bad path', not any('secrets' in x for x in ev("window.__api")))
    ok('bad data url rejected', ev("A._phParse(JSON.stringify({d:'data:image/jpeg;base64,AA\"><img src=x>',ts:1}))") is None)
    # 4) Admin: weiterhin Medien-Ordner, bei Fehler Liste
    ev("A._hass.fetchWithAuth=async(u)=>{window.__api.push('FETCH '+u); return {ok:true,status:200};}; A._setSt('2026-10-08','T','K','')"); t(1200)
    with pg.expect_file_chooser() as fc:
        ev("A._hass.user={id:'admin1',name:'Papa',is_admin:true}; A._kidTap('T','K',null)")
    fc.value.set_files('ph_test.jpg'); settle()
    print('DBG', ev("[A._st('2026-10-08','T','K'), A._mark('2026-10-08','f:T:K'), window.__api.slice(-3)]"))
    ok('admin uses media folder', ev("A._mark('2026-10-08','f:T:K')").startswith('kp_'), ev("A._mark('2026-10-08','f:T:K')"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
