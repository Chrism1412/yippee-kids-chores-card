# 1.9.0: 📱 Kompakte Kinder-Ansicht (Kopf, Sammel-Knöpfe, „Jetzt dran“, Leiste Heute/Belohnungen/Sammlung),
#        ⏱️ Aufgaben-Timer (automatisch / Kind bestätigt / nur Countdown), 🔊 Leseanfänger-Modus, 📅 Rückblick
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
SEED="""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:12,total:40,order:1});
  A._save('kid','B2',{name:'Ben',emoji:'🐻',points:3,total:8,order:2});
  const T=(id,title,emoji,p,extra)=>A._save('task',id,{title,emoji,points:p,kids:['K'],sched:'week',days:[],created:'2026-10-01',...(extra||{})});
  T('M1','Bett machen','🛏️',1,{from:'06:30',to:'09:00'});
  T('N1','Tisch decken','🍽️',1,{from:'17:00',to:'18:30'});
  T('A1','Pyjama anziehen','🌙',1,{from:'19:30',to:'20:30'});
  T('D1','Müll rausbringen','🗑️',2);
  T('L1','15 Min. lesen','📖',2,{tmr:15,tmrEnd:'auto',tmrMus:'off'});
  T('L2','Zimmer aufräumen','🧸',3,{tmr:1,tmrEnd:'ok',tmrMus:'off',from:'17:00',to:'19:00'});
  T('L3','Hausaufgaben','📚',2,{tmr:1,tmrEnd:'cd',tmrMus:'off'});
  A._save('reward','R1',{title:'Eisgutschein',emoji:'🍦',cost:10});
  A._save('reward','R2',{title:'Kino',emoji:'🎬',cost:80});
  A._setCfg({approval:false,kView:'compact',dayBlocks:true});})()"""
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-13T17:40:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev(SEED); t(1500)
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'})"); t(1200)
    H=lambda: ev("B.shadowRoot.getElementById('app').innerHTML")
    TX=lambda: ev("B.shadowRoot.getElementById('app').textContent")
    # --- Kompakt: Kopf, Ziel, Sammel-Knöpfe, Leiste
    h=H()
    ok('compact card', 'class="card kc"' in h)
    ok('head big points', '⭐ 12' in TX())
    ok('level line', 'Level' in TX())
    ok('next reward goal bar', 'kcgoal' in h and 'Kino' in TX())
    ok('chips: badges', 'data-x="b"' in h)
    ok('bottom nav 3 buttons', ev("B.shadowRoot.querySelectorAll('.kcnb').length")==3)
    ok('rewards badge = 1 redeemable', ev("B.shadowRoot.querySelectorAll('.kcnb')[1].querySelector('small')?.textContent")=='1')
    # --- Jetzt dran: Nachmittag offen (Tisch decken, Zimmer aufräumen), Morgens vorbei, Abends später
    now=ev("[...B.shadowRoot.querySelectorAll('.kcnow ~ .tiles .tile')].map(x=>x.dataset.t)")
    ok('now = open window tasks', set(now)=={'N1','L2'}, now)
    ok('later row abends', 'Später heute' in TX() and 'Abends' in TX())
    ok('missed row (morning)', 'Verpasst' in TX())
    ok('no time row (ohne zeit)', 'Ohne Zeit' in TX())
    ev("B.shadowRoot.querySelector('[data-a=kpx][data-id=\"l-day\"]').click()"); t(300)
    ok('expand row shows tiles', ev("!!B.shadowRoot.querySelector('.tile[data-t=D1]')"))
    # Tisch decken abhaken → Schon geschafft
    ev("B.shadowRoot.querySelector('.tile[data-t=N1]').click()"); t(800)
    ok('done row appears', 'Schon geschafft' in TX())
    ok('done task booked', ev("A._db.log['2026-11-13'].s['N1:K']")=='d')
    # --- Seiten
    ev("B.shadowRoot.querySelectorAll('.kcnb')[1].click()"); t(400)
    ok('rewards page', 'Eisgutschein' in TX() and 'Einlösen' in TX() and not ev("!!B.shadowRoot.querySelector('.kcnow')"))
    ev("B.shadowRoot.querySelectorAll('.kcnb')[2].click()"); t(400)
    ok('collection page: badges', 'Abzeichen' in TX())
    ev("B.shadowRoot.querySelectorAll('.kcnb')[0].click()"); t(400)
    ok('back home', ev("!!B.shadowRoot.querySelector('.kcnow')"))
    ev("B.shadowRoot.querySelector('.kcchip[data-x=b]').click()"); t(400)
    ok('chip opens collection with badges open', ev("B._kPage('K')")=='col' and ev("!!B.shadowRoot.querySelector('.bdg')"))
    ev("B.shadowRoot.querySelectorAll('.kcnb')[0].click()"); t(300)
    # --- ⏱️ Timer: Kind bestätigt (L2, 1 Min.)
    ok('timer chip on tile', ev("!!B.shadowRoot.querySelector('.tile[data-t=L2] .tgo')"))
    ev("B.shadowRoot.querySelector('.tile[data-t=L2]').click()"); t(400)
    ok('tile tap starts timer (ok mode)', ev("!!B.shadowRoot.querySelector('.kt .ktbox')") and ev("A._db.log['2026-11-13'].s['L2:K']||''")=='')
    ok('timer shows 01:00', '01:00' in ev("B.shadowRoot.querySelector('.kt').textContent") or '00:59' in ev("B.shadowRoot.querySelector('.kt').textContent"))
    ev("B.shadowRoot.querySelector('.kt [data-x=pause]').click()"); t(5000)
    l1=ev("B._tmrLeft()")
    ok('pause stops countdown', l1>=59000, l1)
    ev("B.shadowRoot.querySelector('.kt [data-x=pause]').click()"); t(61000)
    ok('end asks to confirm', 'Fertig' in ev("B.shadowRoot.querySelector('.kt').textContent") and ev("A._db.log['2026-11-13'].s['L2:K']||''")=='')
    ev("B.shadowRoot.querySelector('.kt [data-x=ok]').click()"); t(800)
    ok('confirm books task', ev("A._db.log['2026-11-13'].s['L2:K']")=='d' and not ev("!!B.shadowRoot.querySelector('.kt')"))
    # --- Timer automatisch (L1, 15 Min.) → abbrechen bucht nichts
    ev("B.shadowRoot.querySelector('[data-a=kpx][data-id=\"l-day\"]') && 0");
    ev("B._tmrStart('L1','K')"); t(300)
    ev("B.shadowRoot.querySelector('.kt [data-x=x]').click()"); t(200)
    ok('first x asks', 'Wirklich' in ev("B.shadowRoot.querySelector('.kt').textContent"))
    ev("B.shadowRoot.querySelector('.kt [data-x=x]').click()"); t(300)
    ok('abort books nothing', not ev("!!B.shadowRoot.querySelector('.kt')") and ev("A._db.log['2026-11-13'].s['L1:K']||''")=='')
    ev("B._tmrStart('L1','K')"); t(15*60*1000+2000)
    ok('auto mode books at end', ev("A._db.log['2026-11-13'].s['L1:K']")=='d' and not ev("!!B.shadowRoot.querySelector('.kt')"))
    # --- Nur Countdown (L3): Antippen hakt ab, Chip startet Countdown, am Ende nichts gebucht
    ev("B._tmrStart('L3','K')"); t(62000)
    ok('countdown end books nothing', ev("A._db.log['2026-11-13'].s['L3:K']||''")=='' and 'Zeit um' in ev("B.shadowRoot.querySelector('.kt').textContent"))
    ev("B.shadowRoot.querySelector('.kt [data-x=close]').click()"); t(300)
    ev("B._kidTap('L3','K',null)"); t(500)
    ok('countdown mode: tap ticks directly', ev("A._db.log['2026-11-13'].s['L3:K']")=='d')
    # --- Timer mit Freigabe: Ende → wartet auf Freigabe
    ev("A._setCfg({approval:true})"); t(400)
    ev("A._save('task','L4',{title:'Klavier üben',emoji:'🎹',points:2,kids:['K'],sched:'week',days:[],created:'2026-10-01',tmr:1,tmrEnd:'auto',tmrMus:'off'})"); t(600)
    ev("B._tmrStart('L4','K')"); t(63000)
    ok('timer + approval → pending', ev("A._db.log['2026-11-13'].s['L4:K']")=='p')
    ev("A._setCfg({approval:false})"); t(300)
    # --- 🔊 Leseanfänger
    ev("A._save('kid','K',{...A._db.kid.K,rdr:true})"); t(800)
    ok('reader: say buttons', ev("B.shadowRoot.querySelectorAll('.tile.rd .say').length")>0)
    ev("window.__said=[]; Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){},speak(u){window.__said.push(u.text)}}})")
    ev("B.shadowRoot.querySelector('.tile.rd .say').click()"); t(300)
    ok('reader speaks title + stars', ev("window.__said.length")==1 and ('Stern' in ev("window.__said[0]")), ev("window.__said"))
    ok('say does not tick task', ev("Object.keys(A._db.log['2026-11-13'].s).length")==ev("Object.keys(A._db.log['2026-11-13'].s).length"))
    ok('reader stars as symbols', '⭐⭐' in TX())
    # 📱 dieses Gerät + Sprachausgabe (z. B. HA Cloud): HA erzeugt die Sprachdatei, das Gerät spielt sie selbst ab (Companion-App ohne Browser-Stimme)
    ev("""(()=>{window.__said=[]; window.__ws=[]; window.__au=[]; const P=HTMLMediaElement.prototype; P.play=function(){window.__au.push(this.src); return Promise.resolve();};
      for (const X of [A,B]) { X._hass.states['tts.home_assistant_cloud']={entity_id:'tts.home_assistant_cloud',state:'unknown',attributes:{friendly_name:'Home Assistant Cloud'}};
        const cw=X._hass.callWS; X._hass.callWS=async(m)=>{ if(m.type==='media_source/resolve_media' && String(m.media_content_id).startsWith('media-source://tts/')){ window.__ws.push(m.media_content_id); return {url:'/api/tts_proxy/abc.mp3', mime_type:'audio/mpeg'}; } return cw(m); }; }
      A._setCfg({rTts:'tts.home_assistant_cloud', rPlayers:[]}); })()"""); t(600)
    ev("B.shadowRoot.querySelector('.tile.rd .say').click()"); t(400)
    ok('device reader uses HA TTS file', len(ev("window.__ws"))==1 and 'media-source://tts/tts.home_assistant_cloud?message=' in ev("window.__ws[0]"), ev("window.__ws"))
    ok('device plays TTS file itself', any('tts_proxy/abc.mp3' in x for x in ev("window.__au")), ev("window.__au"))
    ok('no browser voice when HA TTS works', ev("window.__said.length")==0, ev("window.__said"))
    ev("A._setCfg({rTts:''})"); t(400)
    ev("A._save('kid','K',{...A._db.kid.K,rdr:false})"); t(600)
    # --- 📅 Rückblick: Daten für Oktober
    ev("""(()=>{const rd={}; for(let d=1; d<=31; d++){ rd['2026-10-'+String(d).padStart(2,'0')]=[3,3,5,0,0,0]; } for(let d=5; d<=30; d++){ rd['2026-09-'+String(d).padStart(2,'0')]=[2,3,4,0,0,0]; }
      A._save('kid','K',{...A._db.kid.K, rd, history:[{d:'2026-10-12',t:'Eisgutschein',e:'🍦',c:10}]}); })()"""); t(800)
    r=ev("B._recap(B._db.kid.K,'2026-10')")
    ok('recap stars october', r['stars']==155, r)
    ok('recap diff vs september', r['diff']==155-26*4, r['diff'])
    ok('recap best streak', r['best']==31, r['best'])
    ok('recap rewards', len(r['rws'])==1)
    ok('recap chip (1.–14.)', ev("!!B.shadowRoot.querySelector('.kcchip[data-a=rcpopen]')"))
    ev("B.shadowRoot.querySelector('.kcchip[data-a=rcpopen]').click()"); t(500)
    ok('recap dialog', '155' in ev("B.shadowRoot.getElementById('modal').textContent") and 'Oktober' in ev("B.shadowRoot.getElementById('modal').textContent"))
    ev("B._closeModal()"); t(300)
    ok('recap marked seen', ev("B._rcpSeen('K','2026-10')"))
    ok('recap chip no longer hot after seen', not ev("B.shadowRoot.querySelector('.kcchip[data-a=rcpopen]').classList.contains('hot')"))
    # ab dem 15.: weiter sichtbar, aber nicht mehr „neu“
    pg.clock.set_system_time(datetime.datetime.fromisoformat('2026-11-20T17:40:00')); ev("localStorage.removeItem('kpRcp:'+B._config.storage+':K'); B._render()"); t(500)
    ok('recap chip still there on the 20th', ev("!!B.shadowRoot.querySelector('.kcchip[data-a=rcpopen]')"))
    ok('recap chip not hot on the 20th', not ev("B.shadowRoot.querySelector('.kcchip[data-a=rcpopen]').classList.contains('hot')"))
    ev("B._rcpMark('K','2026-10')"); pg.clock.set_system_time(datetime.datetime.fromisoformat('2026-11-13T17:50:00')); t(300)
    # Eltern: Berichte → Rückblick
    ev("A.shadowRoot.querySelector('.tab[data-id=kinder]').click()"); t(500)
    ev("A._repOpen=true; A._repMode='r'; A._render()"); t(500)
    ok('parent reports recap', 'Dein Oktober' in ev("A.shadowRoot.getElementById('app').textContent"))
    # --- Klassisch umschalten
    ev("A._setCfg({kView:'classic'})"); t(600)
    ok('classic view back', not ev("!!B.shadowRoot.querySelector('.card.kc')") and 'Belohnungen' in TX())
    # 📅 Rückblick auch in der klassischen Ansicht: Knopf unter den Abzeichen, roter Punkt solange neu
    ev("localStorage.removeItem('kpRcp:'+B._config.storage+':K'); B._render()"); t(500)
    ok('classic: recap button with new dot', ev("!!B.shadowRoot.querySelector('.kvbtn[data-a=rcpopen] .kvdot')"), TX()[:300])
    ev("B.shadowRoot.querySelector('.kvbtn[data-a=rcpopen]').click()"); t(500)
    ok('classic: recap opens', ev("!!B.shadowRoot.querySelector('#modal .rcp')"))
    ev("B._closeModal()"); t(400)
    ok('classic: dot gone after viewing, button stays', ev("!!B.shadowRoot.querySelector('.kvbtn[data-a=rcpopen]')") and not ev("!!B.shadowRoot.querySelector('.kvbtn[data-a=rcpopen] .kvdot')"))
    # --- 👨‍👩‍👧 Familienziel: kompakt = Knopf im Kopf des Kindes; bei „eingeklappt“ (collapsed) bleibt die Karte oben
    cfg0=ev("JSON.stringify(B._config)")
    ev("A._setCfg({kView:'compact', fam:{title:'Zoo',emoji:'🦁',cost:100,pts:10}})"); t(700)
    ev("B.setConfig({storage:B._config.storage, mode:'kids'}); B._render()"); t(600)
    ok('compact kids: family chip, no card on top', ev("!!B.shadowRoot.querySelector('.kcchip[data-x=fam]')") and not ev("!!B.shadowRoot.querySelector('.card.fam')"))
    ev("B.setConfig({storage:B._config.storage, mode:'kids', collapsed:true}); B._render()"); t(600)
    ok('collapsed kids: family goal card shown', ev("!!B.shadowRoot.querySelector('.card.fam')") and 'Zoo' in TX(), TX()[:200])
    ev("A._setCfg({kView:'classic', fam:null}); B.setConfig(JSON.parse(%r)); B._render()" % cfg0); t(700)
    # --- Standard: neue Installation kompakt, bestehende klassisch
    ev("window.__kvAuto=true; A._kvInitDone=false; A._save('cfg','main',{...A._db.cfg.main, kView: undefined})"); t(600)
    ev("A._kViewInit()"); t(400)
    ok('existing install keeps classic', ev("A._cfg.kView")=='classic')
    ok('no page errors', not errs, errs)
    b.close()
