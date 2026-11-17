# 1.9.0: 🦷 Ein einzelnes Putzen zurücknehmen – Sterne, Bild, Zähler, Serien-Tag und Serien-Bonus gehen mit zurück; ↺ „alles“ bleibt
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-11T19:30:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    D='2026-11-11'
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:0,total:0});
      A._save('task','TM',{title:'Zähne putzen morgens',emoji:'🦷',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._save('task','TA',{title:'Zähne putzen abends',emoji:'🦷',points:1,kids:['K'],sched:'week',days:[],created:'2026-10-01'});
      A._setCfg({approval:false, zOn:true}); A._zSet({tasks:['TM','TA'], pAll:3, bonus:5});
      // 6 Tage Serie bis gestern, ein altes Bild schon gesammelt
      A._save('zk','K',{seen:['mond'],n:12,sd:'2026-11-10',sn:6}); 0})()"""); t(1200)
    pick=lambda tid,img: ev(f"(()=>{{const z=A._db.zk.K; const td=z.td&&z.td.d==='{D}'?z.td:{{d:'{D}',l:[],m:{{}}}}; A._save('zk','K',{{...z,td:{{...td,l:[...td.l,'{img}'],m:{{...td.m,{tid}:'{img}'}}}},cur:{{d:'{D}',t:'{tid}',i:'{img}'}}}}); return 0}})()")
    z=lambda: ev("A._db.zk.K"); pts=lambda: ev("A._db.kid.K.points")
    # morgens putzen (neues Bild „wald“)
    pick('TM','wald'); t(400); ev(f"A._zFinish('TM','K','{D}','wald'); 0"); t(800)
    ok('morning: 3 stars, counted', pts()==3 and z()['n']==13 and 'wald' in z()['seen'], [pts(), z()])
    ok('new picture remembered as new', z()['td'].get('nw')==['wald'], z()['td'])
    # abends putzen (Bild „mond“ war schon gesammelt) → Tag komplett, Serie 7, Bonus 5
    pick('TA','mond'); t(400); ev(f"A._zFinish('TA','K','{D}','mond'); 0"); t(800)
    ok('evening: streak 7 + bonus', pts()==3+3+5 and z()['sn']==7 and z()['sd']==D and z()['n']==14, [pts(), z()])
    ok('old picture not marked new', z()['td'].get('nw')==['wald'], z()['td'])
    # Eltern nehmen NUR das Abend-Putzen zurück
    ev(f"A._adminSet('{D}','TA','K',false); 0"); t(800)
    ok('undo evening: stars + bonus back', pts()==3, pts())
    ok('undo evening: counter -1', z()['n']==13, z())
    ok('undo evening: streak day back', z()['sn']==6 and z()['sd']=='2026-11-10', z())
    ok('undo evening: old picture stays', 'mond' in z()['seen'] and 'wald' in z()['seen'], z()['seen'])
    ok('undo evening: timer mark gone, morning stays', ev(f"A._mark('{D}','zt:TA:K')")=='' and ev(f"A._mark('{D}','zt:TM:K')")=='1')
    ok('task open again', ev(f"A._st('{D}','TA','K')")=='' and ev(f"A._st('{D}','TM','K')")=='d')
    ok('today mapping removed', 'TA' not in z()['td']['m'] and z()['td']['m'].get('TM')=='wald', z()['td'])
    # Kind putzt abends doch noch → Serie 7 und Bonus werden wieder gebucht
    pick('TA','riff'); t(400); ev(f"A._zFinish('TA','K','{D}','riff'); 0"); t(800)
    ok('re-brush: streak 7 + bonus again', pts()==3+3+5 and z()['sn']==7 and z()['sd']==D, [pts(), z()])
    # Morgen-Putzen zurück: neues Bild „wald“ verschwindet, Sterne zurück, Bonus zurück
    ev(f"A._adminSet('{D}','TM','K',false); 0"); t(800)
    ok('undo morning: new picture removed', 'wald' not in z()['seen'] and 'riff' in z()['seen'] and 'mond' in z()['seen'], z()['seen'])
    ok('undo morning: stars + bonus back', pts()==3, pts())
    ok('undo morning: streak 6', z()['sn']==6 and z()['sd']=='2026-11-10', z())
    # ohne Timer abgehakt und zurückgenommen: Zahnputz-Fortschritt bleibt unberührt
    n0=z()['n']; ev(f"A._adminSet('{D}','TM','K',true); 0"); t(600); p1=pts(); ev(f"A._adminSet('{D}','TM','K',false); 0"); t(600)
    ok('manual tick/untick: progress untouched', z()['n']==n0 and z()['sn']==6 and pts()==3 and p1==4, [z(), p1, pts()])
    # Freigabe: Kind putzt, Eltern lehnen ab → Fortschritt zurück
    ev("A._setCfg({approval:true}); A._zSet({inst:false}); 0"); t(600)
    pick('TM','dino'); t(400); ev(f"A._zFinish('TM','K','{D}','dino'); 0"); t(800)
    ok('pending after timer', ev(f"A._st('{D}','TM','K')")=='p' and 'dino' in z()['seen'])
    ev(f"A._adminSet('{D}','TM','K',false); 0"); t(800)
    ok('rejected: picture + counter back, no stars moved', 'dino' not in z()['seen'] and z()['n']==n0 and pts()==3, [z(), pts()])
    # ↺ alles zurücksetzen gibt es weiterhin
    ev("A.shadowRoot.querySelector('.tab[data-id=zaehne]').click()"); t(400); pg.wait_for_timeout(800); t(800)
    ok('reset-all button still there', ev("!!A.shadowRoot.querySelector('yippee-teeth').shadowRoot.querySelector('[data-a=rst]')"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
