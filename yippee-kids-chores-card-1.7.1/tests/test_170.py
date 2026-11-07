# 1.7.0: 🏠 Anwesenheit – Ausnahmen mit Uhrzeit (Ankunft „ab“ am ersten Tag, Abreise „bis“ am letzten)
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1400}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T10:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    # meistens woanders – Ausnahme „da“ vom 30.10. ab 17:00 bis 01.11. 18:00
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5,pres:{on:true,base:'out',rules:[],hol:{},ex:[{from:'2026-10-30',to:'2026-11-01',st:'in',fT:'17:00',tT:'18:00'}]}});
      A._save('kid','B',{name:'Ben',emoji:'🐻',points:5,total:5,pres:{on:true,base:'in',rules:[],hol:{},ex:[{from:'2026-10-26',to:'2026-10-29',st:'out',fT:'08:00'},{from:'2026-11-05',to:'2026-11-05',st:'out',fT:'10:00',tT:'12:00'},{from:'2026-11-07',to:'2026-11-08',st:'out'}]}});
      A._save('task','M',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01',from:'07:00',to:'08:00',penalty:1,penaltySince:'2026-10-01'});
      A._save('task','E',{title:'Bettfertig',emoji:'😴',points:1,kids:['K','B'],sched:'week',days:[],created:'2026-10-01',from:'18:00',to:'20:00',penalty:1,penaltySince:'2026-10-01'});})()"""); t(800)
    st=lambda k,d: ev(f"(()=>{{const r=A._pres('{k}','{d}'); return [r.s, r.at||'']}})()")
    ok('arrival day: from 17:00', st('K','2026-10-30')==['arr','17:00'], st('K','2026-10-30'))
    ok('middle day: whole day', st('K','2026-10-31')==['in',''], st('K','2026-10-31'))
    ok('departure day: until 18:00', st('K','2026-11-01')==['lv','18:00'], st('K','2026-11-01'))
    ok('after: away again (base)', st('K','2026-11-02')[0]=='out' and st('K','2026-10-29')[0]=='out')
    ok('morning task before arrival not due', not ev("A._presTaskOk(A._db.task.M,'K','2026-10-30')"))
    ok('evening task after arrival due', ev("A._presTaskOk(A._db.task.E,'K','2026-10-30')"))
    ok('evening task after departure not due', not ev("A._presTaskOk(A._db.task.E,'K','2026-11-01')") and ev("A._presTaskOk(A._db.task.M,'K','2026-11-01')"))
    # meistens da – Ausnahme „nicht da“ ab 26.10. 08:00 (ohne Ende-Uhrzeit)
    ok('leaves at 08:00', st('B','2026-10-26')==['lv','08:00'], st('B','2026-10-26'))
    ok('away whole last day without time', st('B','2026-10-29')[0]=='out' and st('B','2026-10-27')[0]=='out')
    ok('back after exception', st('B','2026-10-30')[0]=='in')
    seg=ev("A._pres('B','2026-11-05').segs")
    ok('same day 10-12 away', seg==[[0,600],[720,1440]], seg)
    ok('without times: whole days (as before)', st('B','2026-11-07')[0]=='out' and st('B','2026-11-08')[0]=='out' and st('B','2026-11-09')[0]=='in')
    # Kinder-Ansicht am Ankunftstag vormittags
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'})"); t(800)
    h=ev("B.shadowRoot.querySelector('#app').innerText")
    ok('kid view: welcome from 17:00', '17:00' in h and 'Zähne putzen' not in h, h[:300])
    # Kein „verpasst“ für die Morgen-Aufgabe am Ankunftstag
    pg.clock.run_for(24*3600*1000); t(2000)
    ev("A._penaltyCheck()"); t(3000)
    miss=ev("(()=>{const l=A._db.log['2026-10-30']; const s=(l&&l.s)||{}; return [s['M:K']||'', s['E:K']||'', s['M:B']||'']})()")
    ok('control: present kid gets missed mark', miss[2] in ('m','x'), miss)
    ok('arrival-day morning task not missed', miss[0] not in ('m','x') and miss[1] in ('m','x'), miss)
    # ---- Editor: Uhrzeiten eintragen und speichern
    ev("A._tab='kinder'; A._render(); A._editKid('B')"); t(800); pg.wait_for_timeout(600)
    ok('editor: time fields per exception', ev("A.shadowRoot.querySelectorAll('#modal .exrow [data-exft]').length")==3 and ev("A.shadowRoot.querySelector('#modal .exrow [data-exft]').value")=='08:00')
    ev("""(()=>{const m=A.shadowRoot.querySelector('#modal'); m.querySelector('[data-a=exadd]').click(); const r=[...m.querySelectorAll('.exrow')].pop();
      r.querySelector('[data-exf]').value='2026-11-20'; r.querySelector('[data-ext]').value='2026-11-22'; r.querySelector('[data-exs]').value='out'; r.querySelector('[data-exft]').value='15:00'; r.querySelector('[data-extt]').value='18:30';})()"""); t(300)
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(1200)
    ex=ev("A._db.kid.B.pres.ex")
    ok('saved with times', {'from':'2026-11-20','to':'2026-11-22','st':'out','fT':'15:00','tT':'18:30'} in ex, ex)
    ok('old exceptions kept, empty times not stored', {'from':'2026-11-07','to':'2026-11-08','st':'out'} in ex, ex)
    ok('new exception works', st('B','2026-11-20')==['lv','15:00'] and st('B','2026-11-22')==['arr','18:30'], [st('B','2026-11-20'), st('B','2026-11-22')])
    # manipulierte Uhrzeit wird ignoriert (ganzer Tag)
    ev("(()=>{const o={...A._db.kid.B}; delete o.id; o.pres={...o.pres, ex:[{from:'2026-12-01',to:'2026-12-01',st:'out',fT:'<b>'}]}; A._save('kid','B',o);})()"); t(600)
    ok('invalid time ignored', st('B','2026-12-01')[0]=='out')
    # ---- Rückfrage „Wirklich …?“ überlebt ein Neuzeichnen (Ursache gelegentlicher Ausreißer in test_155)
    ev("A._closeModal(); A._setCfg({setView:'all'}); A._accAll=false; A._accOpen='mem'; A._tab='einst'; A._render()"); t(600)
    ev("A._save('audit','main',{e:Array.from({length:150},(_,i)=>[Date.now()-i*1000,'x','t'+i])})"); t(500)
    ev("A.shadowRoot.querySelector('[data-a=memclean]').click()"); t(100)
    ev("A._render()"); t(100)
    ok('confirmation survives re-render', 'Nochmal' in ev("A.shadowRoot.querySelector('[data-a=memclean]').textContent"))
    ev("A.shadowRoot.querySelector('[data-a=memclean]').click()"); t(1200)
    ok('second tap after re-render cleans', len(ev("A._db.audit.main.e"))==100, len(ev("A._db.audit.main.e")))
    ev("A.shadowRoot.querySelector('[data-a=memclean]').click()"); t(9000)
    ok('confirmation expires after 8 s', 'Nochmal' not in ev("A.shadowRoot.querySelector('[data-a=memclean]').textContent"))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
