# 1.7.0 (GitHub #15): selbst gewählte, neuere Emojis (z. B. 🪥 🫧) bleiben erhalten – wurden bisher still durch ältere ersetzt
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1200}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5});
      A._save('task','Z',{title:'Zähne putzen',emoji:'🦷',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','S',{title:'Seifenblasen',emoji:'🥪',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._tab='aufgaben'; A._render();})()"""); t(800)
    # im Editor eigenes Emoji eintragen und speichern – bei zwei Aufgaben
    for tid, emo in (('Z','🪥'),('S','🫧')):
        ev(f"A._editTask('{tid}')"); t(400)
        ev(f"(()=>{{const i=A.shadowRoot.querySelector('#modal [name=emoji]'); i.value='{emo}'; i.dispatchEvent(new Event('input',{{bubbles:true,composed:true}}));}})()")
        ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(1500)
    ok('own emoji kept on first task', ev("A._db.task.Z.emoji")=='🪥', ev("A._db.task.Z.emoji"))
    ok('own emoji kept on second task', ev("A._db.task.S.emoji")=='🫧', ev("A._db.task.S.emoji"))
    stored=ev("Object.fromEntries(items['todo.kinderpunkte'].filter(i=>/^kp.task.(Z|S)$/.test(i.summary)).map(i=>[i.summary, JSON.parse(i.description).emoji]))")
    ok('stored as chosen', stored=={'kp|task|Z':'🪥','kp|task|S':'🫧'}, stored)
    # nach Neuladen der Liste unverändert
    ev("A._onItems(JSON.parse(JSON.stringify(items['todo.kinderpunkte'])))"); t(500)
    ok('still there after reload', ev("A._db.task.Z.emoji")=='🪥' and ev("A._db.task.S.emoji")=='🫧')
    ok('shown in the list', '🪥' in ev("A.shadowRoot.querySelector('#app').innerText") and '🫧' in ev("A.shadowRoot.querySelector('#app').innerText"))
    # Belohnung und Kind ebenso
    ev("A._save('reward','r1',{title:'Eis',emoji:'🫧',cost:5}); A._save('kid','K',{...A._db.kid.K, emoji:'🪁'})"); t(800)
    ev("A._onItems(JSON.parse(JSON.stringify(items['todo.kinderpunkte'])))"); t(300)
    ok('reward and kid keep own emoji', ev("A._db.reward.r1.emoji")=='🫧' and ev("A._db.kid.K.emoji")=='🪁', [ev("A._db.reward.r1.emoji"), ev("A._db.kid.K.emoji")])
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
