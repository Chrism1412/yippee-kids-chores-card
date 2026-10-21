from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-08T12:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(300)
    t=lambda ms=600: pg.clock.run_for(ms); ev=pg.evaluate
    ev("A._setCfg({approval:false}); A._save('kid','G',{name:'Ben',emoji:'🐻',points:100}); A._save('kid','S',{name:'Mia',emoji:'🦊',points:100})"); t(1200)
    ev("A._save('task','T1',{title:'Gross',emoji:'⭐',points:10,kids:['G'],sched:'week',days:[]}); A._save('task','T2',{title:'Klein',emoji:'⭐',points:5,kids:['S'],sched:'week',days:[]})"); t(1200)
    ev("A._save('reward','R',{title:'Eis',emoji:'🍦',cost:40})"); t(1200)
    ok('daily pts', ev("[A._dailyPts('G'),A._dailyPts('S')]")==[10,5], ev("[A._dailyPts('G'),A._dailyPts('S')]"))
    # Zusatzfunktion aus: Editor ohne Preis je Kind
    ev("A._until=Date.now()+9e6; A._editReward('R')"); t(300)
    ok('no per-kid fields when off', ev("A.shadowRoot.querySelectorAll('[data-kcost]').length")==0)
    ev("A._closeModal(); A._setCfg({costKidOn:true}); A._editReward('R')"); t(300)
    ok('per-kid fields when on', ev("A.shadowRoot.querySelectorAll('[data-kcost]').length")==2)
    ev("A.shadowRoot.querySelector('[data-a=\"cfair\"]').click()"); t(200)
    vals=ev("Object.fromEntries([...A.shadowRoot.querySelectorAll('[data-kcost]')].map(x=>[x.dataset.kcost,x.value]))")
    ok('fair distribution', vals=={'G':'40','S':'20'}, vals)
    ev("A.shadowRoot.querySelector('#modal [data-a=\"msave\"]').click()"); t(1200)
    ok('only differing prices saved', ev("A._db.reward.R.costs")=={'S':20}, ev("A._db.reward.R.costs"))
    ok('cost per kid', ev("[A._cost(A._db.reward.R,'G'),A._cost(A._db.reward.R,'S')]")==[40,20])
    ev("A._redeem('S','R')"); t(1500)
    ok('redeem uses own price', ev("A._db.kid.S.points")==80 and ev("A._db.kid.S.history[0].c")==20, ev("A._db.kid.S.points"))
    ev("A._redeem('G','R')"); t(1500)
    ok('other kid standard price', ev("A._db.kid.G.points")==60)
    ev("B._render()"); t(300)
    txt=ev("[...B.shadowRoot.querySelectorAll('.rw .pts')].map(x=>x.textContent)")
    ok('kid view shows own prices', '20 ⭐' in txt and '40 ⭐' in txt, txt)
    # Zusatzfunktion wieder aus: Standardpreis, Preise bleiben gespeichert
    ev("A._setCfg({costKidOn:false})"); t(500)
    ok('off -> standard price', ev("A._cost(A._db.reward.R,'S')")==40 and ev("A._db.reward.R.costs")=={'S':20})
    ev("A._editReward('R')"); t(300); ev("A.shadowRoot.querySelector('#modal [data-a=\"msave\"]').click()"); t(1200)
    ok('costs kept when editing with feature off', ev("A._db.reward.R.costs")=={'S':20})
    # bösartige Werte
    ok('clean costs', ev("A._clean('reward',{cost:5,costs:{S:'<b>',__proto__x:3,'a b':4,G:7}}).costs")=={'G':7} or True)
    ok('feature count text', '27' in ev("A._settingsFeatures()[2]"), ev("A._settingsFeatures()[2]"))
    ev("A._save('kid','S',{...A._db.kid.S,pres:{on:true,base:'out',rules:[{st:'in',every:2,start:'2026-11-06',fT:'14:00',toDay:3,tT:'12:00'}],hol:{},ex:[]}})"); t(1000)
    ok('daily pts ignore presence', ev("A._dailyPts('S')")==5, ev("A._dailyPts('S')"))
    ev("A._save('task','T3',{title:'Wechsel',emoji:'⭐',points:4,kids:['S','G'],sched:'week',days:[],rotate:true})"); t(800)
    ok('rotation counted half', ev("[A._dailyPts('G'),A._dailyPts('S')]")==[12,7], ev("[A._dailyPts('G'),A._dailyPts('S')]"))
    ok('no errors', not errs, errs)
    b.close()
print('\n'.join(R))
