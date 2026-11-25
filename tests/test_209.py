# 2.0.0: 🩹 Emoji-Ersatz überall – fehlt dem Gerät ein neueres Emoji (z. B. 🪥 auf älterem Windows), wird es in der Anzeige ersetzt,
#        auch bei eigenen Emojis von Aufgaben, Belohnungen und Kindern; gespeichert bleibt das Original
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':392,'height':860}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T10:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦩',points:5,total:30,order:1});
      A._save('task','T1',{title:'Zähne putzen abends',emoji:'🪥',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._save('reward','R1',{title:'Seifenblasen',emoji:'🫧',cost:3});
      A._setCfg({approval:false,kView:'classic'});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(1500)
    W="window.__yippeeEmoWatch"
    ok('helper there', ev(f"typeof {W}")=='function')
    # Gerät ohne neuere Emojis nachstellen
    ev(f"Object.assign({W}.c,{{'🪥':false,'🫧':false,'🦩':false}}); {W}.reset(); {W}(A.shadowRoot); {W}(B.shadowRoot); A._render(); B._render()"); t(600)
    txt=ev("B.shadowRoot.getElementById('app').textContent")
    ok('kid view: task emoji replaced', '🪥' not in txt and '🦷' in ev("B.shadowRoot.querySelector('.tile[data-t=T1] .e').textContent"))
    ok('kid view: reward + kid emoji replaced', '🫧' not in txt and '🦩' not in txt and '🧼' in txt and '🦢' in txt)
    ok('stored data unchanged', ev("A._db.task.T1.emoji")=='🪥' and ev("A._db.reward.R1.emoji")=='🫧' and ev("A._db.kid.K.emoji")=='🦩')
    ev("B._kidTap('T1','K',null)"); t(800)
    ok('still replaced after re-render', '🪥' not in ev("B.shadowRoot.getElementById('app').textContent"))
    ev("document.getElementById('b').style.display='none'; A._editTask('T1')"); t(800); pg.wait_for_timeout(400); t(300)
    ok('editor input keeps the original', ev("A.shadowRoot.querySelector('#modal [name=emoji]').value")=='🪥')
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('saving keeps the original', ev("A._db.task.T1.emoji")=='🪥')
    ok('admin list replaced', '🪥' not in ev("A.shadowRoot.getElementById('app').textContent"))
    ok('no errors', not errs, errs)
    b.close()
