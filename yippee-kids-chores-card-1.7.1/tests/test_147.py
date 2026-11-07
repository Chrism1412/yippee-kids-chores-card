from playwright.sync_api import sync_playwright
import datetime, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
N=[1000]
def aid(iso):  # wie die HA-Automation: Sekunden + 4 Zufallsziffern
    N[0]+=1; return str(int(datetime.datetime.fromisoformat(iso).timestamp()))+str(N[0])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-14T17:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(300)
    t=lambda ms=600: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._setCfg({approval:false,nfcOn:true}); A._save('kid','F',{name:'Anna',emoji:'🦊',points:0,since:'2026-10-01'}); A._save('kid','L',{name:'Ben',emoji:'🐻',points:0,since:'2026-10-01'})"); t(1200)
    ev("A._save('task','BP',{title:'Bewegungspause',emoji:'🤸',points:1,kids:['F'],sched:'week',days:[],from:'15:00',to:'16:00',nfc:'75f0eeb9-5e90-43ab-b9bf-43be12aa0001'})"); t(1200)
    add=lambda id,a,u='': ev(f"A._hass.callService('todo','add_item',{{item:'kp|act|{id}',description:JSON.stringify({{a:'{a}',u:'{u}'}})}},{{entity_id:'todo.kinderpunkte'}})")
    # 1) Scan um 15:30 (Fenster offen), Karte verarbeitet erst um 17:00 -> trotzdem erledigt
    add(aid('2026-10-14T15:30:00'),'KP|nfc|75f0eeb9-5e90-43ab-b9bf-43be12aa0001','hauser'); t(6000)
    ok('delayed scan inside window -> done', ev("A._st('2026-10-14','BP','F')")=='d' and ev("A._db.kid.F.points")==1, [ev("A._st('2026-10-14','BP','F')"), ev("A._cfg.nfcLast")])
    ok('act removed', not any(i['summary'].startswith('kp|act|') for i in ev("window.items['todo.kinderpunkte']")))
    ok('last scan ok', ev("A._cfg.nfcLast.ok")==True)
    # 2) zweiter Scan: schon abgehakt
    add(aid('2026-10-14T16:59:00'),'KP|nfc|75f0eeb9-5e90-43ab-b9bf-43be12aa0001'); t(6000)
    ok('reason already done', 'schon abgehakt' in ev("A._cfg.nfcLast.msg") and ev("A._db.kid.F.points")==1, ev("A._cfg.nfcLast"))
    # 3) Scan außerhalb des Fensters (neue Aufgabe)
    ev("A._save('task','ZB',{title:'Zähne',emoji:'🦷',points:2,kids:['F'],sched:'week',days:[],from:'18:00',to:'20:00',nfc:'tag-zahn'})"); t(1200)
    add(aid('2026-10-14T17:00:00'),'KP|nfc|tag-zahn'); t(6000)
    ok('reason before window', 'erst ab 18:00' in ev("A._cfg.nfcLast.msg") and ev("A._st('2026-10-14','ZB','F')")=='', ev("A._cfg.nfcLast"))
    # 4) unbekannter Tag
    add(aid('2026-10-14T17:00:00'),'KP|nfc|irgendwas'); t(6000)
    ok('reason unknown tag', 'keine Aufgabe hat diesen Tag' in ev("A._cfg.nfcLast.msg"), ev("A._cfg.nfcLast"))
    # 5) Scan von gestern
    add(aid('2026-10-13T15:30:00'),'KP|nfc|tag-zahn'); t(6000)
    ok('reason too late', 'zu spät' in ev("A._cfg.nfcLast.msg"), ev("A._cfg.nfcLast"))
    # 6) zwei Kinder, kein Benutzer -> Hinweis
    ev("A._save('task','ZK',{title:'Tisch',emoji:'🍽️',points:1,kids:['F','L'],sched:'week',days:[],nfc:'tag-tisch'})"); t(1200)
    add(aid('2026-10-14T17:00:00'),'KP|nfc|tag-tisch','unknownuser'); t(6000)
    ok('reason several kids', 'mehrere Kinder' in ev("A._cfg.nfcLast.msg"), ev("A._cfg.nfcLast"))
    ev("A._save('kid','L',{...A._db.kid.L,user:'kid2'})"); t(1200)
    add(aid('2026-10-14T17:00:00'),'KP|nfc|tag-tisch','kid2'); t(6000)
    ok('user mapping picks Ben', ev("A._st('2026-10-14','ZK','L')")=='d' and ev("A._st('2026-10-14','ZK','F')")=='', ev("A._cfg.nfcLast"))
    # 7) mit Freigabe -> wartet
    ev("A._setCfg({approval:true}); A._save('task','ZC',{title:'Müll',emoji:'🗑️',points:1,kids:['F'],sched:'week',days:[],nfc:'tag-muell'})"); t(1200)
    add(aid('2026-10-14T17:00:00'),'KP|nfc|tag-muell'); t(6000)
    ok('approval -> pending', ev("A._st('2026-10-14','ZC','F')")=='p' and 'Freigabe' in ev("A._cfg.nfcLast.msg"), ev("A._cfg.nfcLast"))
    # 8) Einstellungen zeigen letzten Scan + Tag-Zahl
    ev("A._tab='einst'; A._accAll=false; A._accOpen='f_nfcOn'; A._render()"); t(500)
    html=ev("A.shadowRoot.innerHTML")
    ok('settings show last scan', 'Letzter Scan' in html and 'NFC-Tag(s) in Aufgaben' in html, '')
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
