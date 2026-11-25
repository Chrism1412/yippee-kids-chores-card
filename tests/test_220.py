# 2.0.0: 🏠 Haustier-Zuhause – Sachen verschieben (Antippen + Steuerkreuz oder Ziehen), nie überlappend
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:40,total:330,order:1});
      A._setCfg({approval:true,kView:'classic',peOn:true,pePlay:'always',peGLim:'0',peHome:true,new20ok:true});
      A._save('pk','K',{on:true,kind:'dog',name:'Flocke',t0:0,s:3,h:true,tl:5,home:{o:['bed','fish','tv','books','teddy','sofa','lamp','pic'],x:[]}});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    sb="B.shadowRoot"
    ev("document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(800)
    ev(f"{sb}.querySelector('[data-a=pehome]').click()"); t(1500); pg.wait_for_timeout(300); t(300)
    OV="""(()=>{const R=B.shadowRoot.querySelector('.phroom').getBoundingClientRect(); const L=[...B.shadowRoot.querySelectorAll('.phroom .phit')].map(e=>{const s=parseFloat(e.style.fontSize.includes('cqw')?e.style.fontSize:'0'); return e}); let n=0;
      const bx=[...B.shadowRoot.querySelectorAll('.phroom .phit')].map(e=>{const x=parseFloat(e.style.left), y=parseFloat(e.style.top); const it=e.dataset.id; return [it,x,y]});
      const S={bed:19,fish:7,tv:11,books:8,teddy:8,sofa:17,lamp:7,pic:10}; const box=(i,x,y)=>{const s=S[i], h=s*400/260; return [x-s/2,x+s/2,y-h,y]};
      for(let i=0;i<bx.length;i++) for(let j=i+1;j<bx.length;j++){const a=box(...bx[i]), b=box(...bx[j]); const cx=Math.abs((a[0]+a[1])/2-(b[0]+b[1])/2), w=(a[1]-a[0]+b[1]-b[0])/2, cy=Math.abs((a[2]+a[3])/2-(b[2]+b[3])/2), h=(a[3]-a[2]+b[3]-b[2])/2; if(cx<w*.8&&cy<h*.8) n++}
      return n})()"""
    ok('8 things shown, none overlapping (defaults resolved)', ev(f"{sb}.querySelectorAll('.phroom .phit').length")==8 and ev(OV)==0, ev(OV))
    ok('hint shown before selecting', 'antippen' in ev(f"{sb}.querySelector('.ph').textContent"))
    def ctr(sel): return ev(f"(()=>{{const r={sb}.querySelector('{sel}').getBoundingClientRect(); return [r.x+r.width/2, r.y+r.height*0.6]}})()")
    # Antippen wählt aus
    x,y=ctr('.phit[data-id=tv]'); pg.mouse.move(x,y); pg.mouse.down(); pg.mouse.up(); t(500)
    ok('tap selects (wiggle + d-pad)', ev(f"{sb}.querySelector('.phit[data-id=tv]').classList.contains('on')") and ev(f"{sb}.querySelectorAll('.phmv [data-a=pehmv]').length")==4)
    l0=ev(f"parseFloat({sb}.querySelector('.phit[data-id=tv]').style.left)")
    ev(f"{sb}.querySelector('[data-a=pehmv][data-v=l]').click()"); pg.wait_for_timeout(300); t(600)
    l1=ev(f"parseFloat({sb}.querySelector('.phit[data-id=tv]').style.left)")
    ok('◀ moves left and saves', l1<l0 and ev("JSON.stringify(A._db.pk.K.home.p.tv)")==f'[{int(l1)},{int(ev(f"parseFloat({sb}.querySelector(\'.phit[data-id=tv]\').style.top)"))}]', (l0,l1, ev("JSON.stringify(A._db.pk.K.home.p)")))
    for _ in range(3): ev(f"{sb}.querySelector('[data-a=pehmv][data-v=u]').click()"); pg.wait_for_timeout(200); t(400)
    ok('wall thing stays on the wall', 16 <= ev("A._db.pk.K.home.p.tv[1]") <= 66, ev("A._db.pk.K.home.p.tv"))
    for _ in range(12): ev(f"{sb}.querySelector('[data-a=pehmv][data-v=d]').click()"); pg.wait_for_timeout(100); t(300)
    ok('…also when pushing down', ev("A._db.pk.K.home.p.tv[1]") <= 66 and ev(OV)==0, ev("A._db.pk.K.home.p.tv"))
    ev(f"{sb}.querySelector('[data-a=pehok]').click()"); pg.wait_for_timeout(300); t(500)
    ok('✓ Fertig ends selection', not ev(f"!!{sb}.querySelector('.phit.on')") and not ev(f"!!{sb}.querySelector('.phmv')"))
    # Ziehen: Teddy auf das Bett ziehen → landet daneben
    x,y=ctr('.phit[data-id=teddy]'); bx,by=ctr('.phit[data-id=bed]')
    pg.mouse.move(x,y); pg.mouse.down(); pg.mouse.move(x+10,y,steps=2); pg.mouse.move(bx,by,steps=6); pg.mouse.up(); pg.wait_for_timeout(300); t(800)
    ok('drag saves a new place', ev("!!(A._db.pk.K.home.p||{}).teddy"), ev("JSON.stringify(A._db.pk.K.home.p)"))
    ok('dropped onto the bed → moved to a free place', ev(OV)==0, ev(OV))
    ok('floor thing stays on the floor', ev("A._db.pk.K.home.p.teddy[1]")>=70, ev("A._db.pk.K.home.p.teddy"))
    ok('after drag it stays selected', ev(f"{sb}.querySelector('.phit[data-id=teddy]').classList.contains('on')"))
    ev(f"{sb}.querySelector('[data-a=pehok]').click()"); pg.wait_for_timeout(300); t(500)
    ok('tidy button when something was moved', ev(f"!!{sb}.querySelector('[data-a=pehtidy]')"))
    ev(f"{sb}.querySelector('[data-a=pehtidy]').click()"); pg.wait_for_timeout(300); t(600)
    ok('tidy resets places', not (ev("A._db.pk.K.home.p") or {}) and ev(OV)==0, ev("JSON.stringify(A._db.pk.K.home)"))
    # 🛏️ Bett ist immer da: nur verschieben, nie wegräumen
    ok('bed: always in the room, no put-away button', ev(f"!{sb}.querySelector('[data-a=pehtog][data-v=bed]')") and 'immer' in ev(f"[...{sb}.querySelectorAll('.phshop button')].find(b=>b.textContent.includes('Bett')).textContent"))
    ev("(()=>{const h={...A._db.pk.K.home, o:['fish'], x:['bed']}; A._save('pk','K',{...A._db.pk.K, home:h}); return 1})()"); t(600)
    ok('bed even for old data (not bought / put away)', ev(f"!!{sb}.querySelector('.phit[data-id=bed]')"))
    # 🌙 Schlafenszeit: Zimmer besuchen, nur zuschauen
    ev("A._setCfg({peN0:'00:00',peN1:'23:59'})"); t(400); ev(f"{sb}.querySelector('[data-a=pehback]').click()"); t(800)
    ok('sleeping: home button still there', ev(f"!!{sb}.querySelector('[data-a=pehome]')") and ev(f"!!{sb}.querySelector('.pezzz')"))
    ev(f"{sb}.querySelector('[data-a=pehome]').click()"); t(1200)
    ok('sleeping room: dark, moonlight, pet in bed', ev(f"!!{sb}.querySelector('.phroom.sleep .phdark')") and ev(f"!!{sb}.querySelector('.phroom .phmoon')") and ev(f"!!{sb}.querySelector('.phpet.sl')"))
    ok('sleeping: only watching (no shop, no arrows)', not ev(f"!!{sb}.querySelector('.phshop')") and not ev(f"!!{sb}.querySelector('.phmv')") and 'schläft' in ev(f"{sb}.querySelector('.ph').textContent"))
    p0=ev("JSON.stringify(A._db.pk.K.home.p||{})")
    x,y=ctr('.phit[data-id=bed]'); pg.mouse.move(x,y); pg.mouse.down(); pg.mouse.move(x-60,y,steps=5); pg.mouse.up(); t(600)
    ok('sleeping: nothing can be moved', ev("JSON.stringify(A._db.pk.K.home.p||{})")==p0 and not ev(f"!!{sb}.querySelector('.phit.on')"))
    ev("A._setCfg({peN0:'20:00',peN1:'06:30'})"); t(400)
    ok('clean keeps places, drops junk', ev("JSON.stringify(A._clean('pk',{id:'K',home:{o:['bed'],x:[],w:0,p:{bed:[40.4,90],'<x>':[1,2],tv:'bad'}}}).home.p)")=='{"bed":[40,90]}', ev("JSON.stringify(A._clean('pk',{id:'K',home:{o:['bed'],x:[],w:0,p:{bed:[40.4,90],'<x>':[1,2],tv:'bad'}}}).home)"))
    ok('no page errors', not errs, errs)
