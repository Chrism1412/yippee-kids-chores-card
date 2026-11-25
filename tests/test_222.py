# 2.0.0: 🏠 Zuhause-Extras (Jahreszeit, Geburtstag, Garten, Besuch) · 🎯 Tages-Challenge · 🚀 Weltraum · 🦕 Dino · Limits je Kind · 🔁 Oft falsch
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
SETUP="""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:40,total:330,bd:5,bm:12,by:2018,order:1});
  A._save('kid','B2',{name:'Ben',emoji:'🐻',points:12,total:60,bd:3,bm:3,by:2021,order:2});
  A._setCfg({approval:true,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',peHome:true,peN0:'23:59',peN1:'00:01',new20ok:true});
  A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,tl:300,home:{o:['bed','sofa','tv'],x:[]}});
  A._save('pk','B2',{on:true,kind:'cat',name:'Mimi',t0:0,s:3,h:true});
  B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    def page(when):
        pg=b.new_page(viewport={'width':430,'height':900}); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.clock.install(time=datetime.datetime.fromisoformat(when))
        pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500)
        t=lambda ms=600: pg.clock.run_for(ms)
        pg.evaluate(SETUP); t(2000); pg.evaluate("document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(800)
        return pg, pg.evaluate, t
    sb="B.shadowRoot"
    # 🎂 + 🎄 am 5. Dezember (Geburtstag von Mia)
    pg,ev,t=page('2026-12-05T15:00:00')
    ev(f"{sb}.querySelector('[data-a=pehome]').click()"); t(1500); pg.wait_for_timeout(300); t(300)
    ok('birthday coins once (+50)', ev("A._db.pk.K.tl")==350 and ev("A._db.pk.K.bty")==2026, (ev("A._db.pk.K.tl"), ev("A._db.pk.K.bty")))
    ev(f"{sb}.querySelector('[data-a=pehback]').click()"); t(500); ev(f"{sb}.querySelector('[data-a=pehome]').click()"); t(1200)
    ok('…not twice', ev("A._db.pk.K.tl")==350)
    D=ev(f"[...{sb}.querySelectorAll('.phroom .phdc')].map(x=>x.textContent).join('')")
    ok('December: tree + presents, birthday: balloons + cake', all(x in D for x in ['🎄','🎁','🎈','🎂']), D)
    ok('fairy lights, garland and party hat', ev(f"!!{sb}.querySelector('.phroom .phlt')") and ev(f"!!{sb}.querySelector('.phroom .phhat')") and ev(f"{sb}.querySelectorAll('.phroom svg path[d^=\"M\"][fill]').length")>10)
    # 👋 Besuch
    ok('invite button for the sibling pet', ev(f"!!{sb}.querySelector('[data-a=pehvis][data-v=B2]')"))
    ev(f"{sb}.querySelector('[data-a=pehvis][data-v=B2]').click()"); pg.wait_for_timeout(300); t(800)
    ok('guest pet in the room, both +2 coins', ev(f"!!{sb}.querySelector('.phpet.gst[data-k=B2]')") and ev("A._db.pk.K.tl")==352 and ev("A._db.pk.B2.tl")==2, (ev("A._db.pk.K.tl"), ev("A._db.pk.B2.tl")))
    ev(f"{sb}.querySelector('[data-a=pehbye]').click()"); t(500); ev(f"{sb}.querySelector('[data-a=pehvis][data-v=B2]').click()"); pg.wait_for_timeout(300); t(800)
    ok('…only once a day', ev("A._db.pk.K.tl")==352 and ev("A._db.pk.B2.tl")==2)
    # 🌳 Garten
    ok('garden in the shop (200)', '200' in ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=garden]').textContent"))
    ok('garden items need the garden first', not ev(f"!!{sb}.querySelector('[data-a=pehbuy][data-v=gslide]')"))
    for _ in range(2): ev(f"{sb}.querySelector('[data-a=pehbuy][data-v=garden]').click()"); pg.wait_for_timeout(200); t(500)
    ok('garden bought → garden view with tabs', ev("A._db.pk.K.home.o.includes('garden')") and ev(f"!!{sb}.querySelector('.phroom.gar')") and ev(f"{sb}.querySelectorAll('.phtabs button').length")==2, ev("A._db.pk.K.tl"))
    ok('own garden shop with 8 things', ev(f"{sb}.querySelectorAll('.phshop button').length")==8)
    for g in ['gslide','gpool','gtree','gdog']:
        for _ in range(2): ev(f"(()=>{{const x={sb}.querySelector('[data-a=pehbuy][data-v={g}]'); x&&x.click()}})()"); pg.wait_for_timeout(150); t(400)
    ok('bought garden things stand in the garden', ev(f"{sb}.querySelectorAll('.phroom.gar .phit').length")==4, ev("A._db.pk.K.home.o"))
    OV="""(()=>{const bx=[...B.shadowRoot.querySelectorAll('.phroom .phit')].map(e=>{const r=e.getBoundingClientRect(); return r}); let n=0;
      for(let i=0;i<bx.length;i++) for(let j=i+1;j<bx.length;j++){const a=bx[i],c=bx[j]; const w=Math.min(a.right,c.right)-Math.max(a.left,c.left), h=Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top); if(w>a.width*.3&&h>a.height*.3) n++} return n})()"""
    ok('garden things do not overlap', ev(OV)==0, ev(OV))
    ev(f"{sb}.querySelector('.phtabs [data-v=z]').click()"); t(600)
    ok('back to the room: room things only', not ev(f"!!{sb}.querySelector('.phroom.gar')") and ev(f"!!{sb}.querySelector('.phit[data-id=tv]')") and not ev(f"!!{sb}.querySelector('.phit[data-id=gslide]')"))
    # Schalter aus
    ev("A._setCfg({phSeas:false,phBd:false,phGar:false,phVis:false})"); t(600)
    ok('all room extras can be switched off', not ev(f"!!{sb}.querySelector('.phdc')") and not ev(f"!!{sb}.querySelector('.phtabs')") and not ev(f"!!{sb}.querySelector('[data-a=pehvis]')") and not ev(f"!!{sb}.querySelector('[data-a=pehbuy][data-v=garden]')"))
    pg.close()
    # 🐰 Ostern / 🎃 Oktober
    pg,ev,t=page('2027-03-26T15:00:00')
    ev(f"{sb}.querySelector('[data-a=pehome]').click()"); t(1500); pg.wait_for_timeout(300); t(300)
    D=ev(f"[...{sb}.querySelectorAll('.phroom .phdc')].map(x=>x.textContent).join('')")
    ok('Easter week: bunny + eggs', '🐰' in D and '🥚' in D, D); pg.close()
    pg,ev,t=page('2026-10-12T15:00:00')
    ev(f"{sb}.querySelector('[data-a=pehome]').click()"); t(1500); pg.wait_for_timeout(300); t(300)
    D=ev(f"[...{sb}.querySelectorAll('.phroom .phdc')].map(x=>x.textContent).join('')")
    ok('October: pumpkin', '🎃' in D, D); pg.close()
    # 🎯 Tages-Challenge, 🚀, 🦕
    pg,ev,t=page('2026-11-25T15:00:00')
    ev(f"{sb}.querySelector('[data-a=pegames]').click()"); t(1500)
    ok('challenge banner in the arcade', ev(f"!!{sb}.querySelector('.gmov .gmch')") and ev(f"{sb}.querySelectorAll('.gmov .gmmenu button.ch').length")==1)
    ok('menu has space and dino', ev(f"!!{sb}.querySelector('.gmov [data-v=space]')") and ev(f"!!{sb}.querySelector('.gmov [data-v=dino]')"))
    ch=ev(f"{sb}.querySelector('.gmov .gmch').dataset.v"); tl0=ev("A._db.pk.K.tl||0")
    ev("B._gmClose()"); t(300)
    for i in range(2):
        ev(f"B._gmStart('K','{ch}')"); t(800); ev("B._gmEnd(true)"); t(600)
        ok(f'challenge round {i+1} counted', ev("A._db.pk.K.d.ch")==i+1, ev("JSON.stringify(A._db.pk.K.d)"))
        ev("B._gmClose()"); t(300)
    ok('challenge done: +10 coins (plus game coins)', ev("A._db.pk.K.tl")-tl0>=10, (tl0, ev("A._db.pk.K.tl")))
    ev(f"B._gmStart('K','{ch}')"); t(800); ev("B._gmEnd(true)"); t(600); ev("B._gmClose()"); t(300)
    ok('no third count', ev("A._db.pk.K.d.ch")==2)
    ev("B._gmStart('K','space')"); t(1000)
    ok('space: planets with answers and a rocket', ev(f"{sb}.querySelectorAll('.gmov .gmpl').length")>=2 and ev(f"!!{sb}.querySelector('.gmov .gmrk')"))
    i=ev("B._gm._q.ans.findIndex(x=>x.ok)"); ev(f"{sb}.querySelector('.gmov .gmpl[data-i=\"{i}\"]').click()"); t(300)
    ok('rocket flies to the planet', ev(f"{sb}.querySelector('.gmov .gmrk').style.left")!='' , ev(f"{sb}.querySelector('.gmov .gmrk').style.left")); t(1500)
    ok('…and counts', ev("B._gm.qok")==1)
    i=ev("B._gm._q.ans.findIndex(x=>!x.ok)"); ev(f"{sb}.querySelector('.gmov .gmpl[data-i=\"{i}\"]').click()"); t(400)
    ok('wrong planet: right one marked', ev(f"!!{sb}.querySelector('.gmov .gmpl.sol')")); t(1500)
    ev("B._gmClose()"); t(300)
    ok('oft falsch noted for the parents', len(ev("A._db.pk.K.wq||[]"))>=1, ev("JSON.stringify(A._db.pk.K.wq)"))
    ev("B._gmStart('K','dino')"); t(1000)
    ok('dino: stones and skeleton', ev(f"{sb}.querySelectorAll('.gmov .gmstn').length")>=2 and ev(f"!!{sb}.querySelector('.gmov .gmsk')"))
    for r in range(6):
        i=ev("B._gm._q.ans.findIndex(x=>x.ok)"); ev(f"{sb}.querySelector('.gmov .gmstn[data-i=\"{i}\"]').click()"); t(2000)
        if r==2: ok('bones appear on the skeleton', ev(f"{sb}.querySelectorAll('.gmov .gmsk .bn').length")==3, ev(f"{sb}.querySelectorAll('.gmov .gmsk .bn').length"))
    ok('6 bones → skeleton complete, game ends', ev(f"!!{sb}.querySelector('.gmov .gmend')") and 'Skelett' in ev(f"{sb}.querySelector('.gmov .gmend').textContent"))
    ev("B._gmClose()"); t(300)
    # 🕹️ je Kind: Spiele pro Tag
    ev("A._save('pk','K',{...A._db.pk.K, gl:1, d:{d:'2026-11-25',f:0,b:0,g:1,gs:0,a:0}})"); t(500)
    ok('per-kid games per day override', ev("B._gmLeft('K')")==0, ev("B._gmLeft('K')"))
    ev("A._save('pk','K',{...A._db.pk.K, gl:undefined})"); t(500)
    ok('…empty = like the settings', ev("B._gmLeft('K')")>=99)
    pg.close()
    # Elternbereich: ✎ beim Kind
    pg,ev,t=page('2026-11-25T15:00:00')
    ev("document.getElementById('a').style.display=''; A._tab='tier'; A._render()"); t(1500); pg.wait_for_timeout(500); t(500)
    ev("A._peAct('pekset',{k:'K'})"); t(800)
    ok('kid dialog: games/day, adventure/day, birthday + challenge coins', all(ev(f"!!A.shadowRoot.querySelector('#modal #{x}')") for x in ['pek_gl','pek_jl','pek_bt','pek_ct']))
    ev("(()=>{const q=(s)=>A.shadowRoot.querySelector('#modal '+s); q('#pek_gl').value='3'; q('#pek_ct').value='15'; return 1})()")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    ok('saved per kid', ev("A._db.pk.K.gl")==3 and ev("A._db.pk.K.ct")==15, (ev("A._db.pk.K.gl"), ev("A._db.pk.K.ct")))
    ok('no errors', not errs, errs)
    b.close()
