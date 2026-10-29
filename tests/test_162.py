# 1.5.0: 🗑️ Müllkalender + 🗓️ Kalender bei der Aufgabe (Stichwort, Vorabend) und 📚 Termine als Aufgaben (Hausaufgaben)
from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
MOCK = """(()=>{const h=A._hass; h.states['calendar.schule']={entity_id:'calendar.schule',state:'off',attributes:{friendly_name:'Schule Mia'}};
  h.states['calendar.verein']={entity_id:'calendar.verein',state:'off',attributes:{friendly_name:'Verein'}};
  const orig=h.callApi; h.callApi=async(m,p,d)=>{
    if(p.startsWith('calendars/calendar.schule')){ window.schCalls=(window.schCalls||0)+1; return [
      {summary:'HA: Mathe S. 42',uid:'u1',start:{date:'2026-10-23'},end:{date:'2026-10-24'}},
      {summary:'HA: Englisch Vokabeln',uid:'u2',start:{date:'2026-10-24'},end:{date:'2026-10-25'}},
      {summary:'Elternabend',uid:'u3',start:{dateTime:'2026-10-23T19:00:00+02:00'},end:{dateTime:'2026-10-23T21:00:00+02:00'}},
      {summary:'HA: Deutsch Aufsatz',uid:'u4',start:{date:'2026-10-20'},end:{date:'2026-10-21'}}]; }
    if(p.startsWith('calendars/calendar.verein')) return [
      {summary:'Fußballtraining',uid:'t1',recurrence_id:'20261023',start:{dateTime:'2026-10-23T17:00:00+02:00'},end:{dateTime:'2026-10-23T18:30:00+02:00'}},
      {summary:'Fußballtraining',uid:'t1',recurrence_id:'20261030',start:{dateTime:'2026-10-30T17:00:00+02:00'},end:{dateTime:'2026-10-30T18:30:00+02:00'}},
      {summary:'Vereinsfest',uid:'t2',start:{date:'2026-10-23'},end:{date:'2026-10-24'}}];
    return orig(m,p,d); };})()"""
import atexit
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={'width':900,'height':1000}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-22T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev(MOCK)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5});A._save('kid','B',{name:'Ben',emoji:'🐻',points:5,total:5});})()"""); t(800)
    # Funktion heißt jetzt „Kalender & Termine“
    ev("A._setCfg({setView:'all'}); A._accOpen='f_muellOn'; A._tab='einst'; A._render()"); t(500)
    h=ev("A.shadowRoot.innerHTML")
    ok('two separate features', '🗑️ Müllkalender' in h and '📚 Termine als Aufgaben' in h and 'data-k="calOn"' in h)
    ok('link list hidden while off', 'data-a="caled"' not in h)
    # --- A) Aufgabe bei Termin: Training am Vorabend
    ev("A._setCfg({muellOn:true, muellCal:'calendar.abfall'}); A._render()"); t(600)
    ok('Müllkalender alone: no link list', not ev("!!A.shadowRoot.querySelector('[data-a=caled]')"))
    ev("A.shadowRoot.querySelector('[data-a=mueltask]').click()"); t(600)
    ok('button opens trash task preset', ev("A.shadowRoot.querySelector('#modal [name=title]').value")=='Müll rausbringen' and ev("A.shadowRoot.querySelector('#modal [data-m=cal]').classList.contains('on')"), ev("A.shadowRoot.querySelector('#modal [name=title]').value"))
    ev("A._closeModal()"); t(200)
    ev("A._setCfg({calOn:true}); A._accOpen='f_calOn'; A._render()"); t(600)
    ok('link button visible when on', ev("!!A.shadowRoot.querySelector('[data-a=caled]')"))
    ev("A._editTask(null)"); t(500)
    mh=ev("A.shadowRoot.querySelector('#modal').innerHTML")
    ok('editor: calendar button renamed', '🗓️ Kalender' in mh and '🗑️ Müllkalender' not in mh)
    ev("A._closeModal()"); t(200)
    ev("A._save('task','TR',{title:'Sporttasche packen',emoji:'🎒',points:2,kids:['K'],sched:'cal',cal:'calendar.verein',calKw:'training',calPrev:true,days:[],dates:[],created:'2026-10-01'})"); t(400)
    ev("A._calEvents('calendar.verein')"); t(800)
    ok('A: task on evening before training', ev("A._isOn(A._db.task.TR, new Date(2026,9,22))") and not ev("A._isOn(A._db.task.TR, new Date(2026,9,23))"))
    ok('A: keyword ignores Vereinsfest', not ev("A._isOn(A._db.task.TR, new Date(2026,9,21))"))
    ok('A: weekly occurrence too', ev("A._isOn(A._db.task.TR, new Date(2026,9,29))"))
    ev("A._tab='aufgaben'; A._render()"); t(400)
    ok('A: tasks tab shows next date with 🗓️', '🗓️' in ev("A.shadowRoot.innerHTML"))
    # --- B) Jeder Termin wird eine Aufgabe
    ev("A._tab='einst'; A._render()"); t(300)
    ev("A.shadowRoot.querySelector('[data-a=caled]').click()"); t(600)
    md=ev("A.shadowRoot.querySelector('#modal').innerHTML")
    ok('B: link modal opens', 'name="when"' in md and 'name="penalty"' in md)
    ok('B: penalty default 0', ev("A.shadowRoot.querySelector('#modal [name=penalty]').value")=='0')
    ev("""(()=>{const m=A.shadowRoot.querySelector('#modal'); const s=m.querySelector('[name=cal]'); s.value='calendar.schule'; s.dispatchEvent(new Event('change',{bubbles:true,composed:true}));
      m.querySelectorAll('[name=kid]').forEach(c=>c.checked=c.value==='K'); m.querySelector('[name=calKw]').value='HA:'; m.querySelector('[name=points]').value='3';})()"""); t(800)
    ok('B: preview shows calendar events', 'Mathe' in ev("A.shadowRoot.querySelector('#modal .calprev').innerHTML"), ev("A.shadowRoot.querySelector('#modal .calprev').innerHTML"))
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(900)
    ls=ev("A._cfg.calLinks")
    ok('B: link saved', len(ls)==1 and ls[0]['ent']=='calendar.schule' and ls[0]['prev']==True and ls[0]['pen']==0 and ls[0]['kids']==['K'], ls)
    kt=ev("Object.values(A._db.task).filter(t=>t.calLink).map(t=>[t.title,t.dates[0],t.points,t.kids.join(),t.penalty])")
    ok('B: one task per matching event (no Elternabend)', sorted(x[0] for x in kt)==['HA: Deutsch Aufsatz','HA: Englisch Vokabeln','HA: Mathe S. 42'], kt)
    ok('B: due the day before', ['HA: Mathe S. 42','2026-10-22',3,'K',0] in kt, kt)
    ok('B: today in Mia’s list, not Ben’s', ev("A._todayTasks('K').some(t=>t.title==='HA: Mathe S. 42')") and not ev("A._todayTasks('B').some(t=>t.calLink)"))
    ok('B: virtual tasks not stored', not any('kal-' in k for k in ev("Object.keys(window.items['todo.kinderpunkte']||{}).concat((window.items['todo.kinderpunkte']||[]).map?((window.items['todo.kinderpunkte']||[]).map(i=>i.summary||'')):[])")))
    ok('B: stable ids', ev("Object.keys(A._db.task).filter(k=>k.startsWith('kal-')).join()")==(ev("A._expandTasks(A._db); Object.keys(A._db.task).filter(k=>k.startsWith('kal-')).join()")))
    # Erledigen gibt Punkte
    mid=ev("Object.values(A._db.task).find(t=>t.title==='HA: Mathe S. 42').id")
    p0=ev("A._db.kid.K.points")
    ev(f"A._setCfg({{approval:false}}); A._markDone('2026-10-22','{mid}','K')"); t(800)
    st=ev(f"A._st('2026-10-22','{mid}','K')")
    ok('B: task can be completed', bool(st), st)
    # Aufgaben-Tab: Box + Ausblenden
    ev("A._tab='aufgaben'; A._render()"); t(500)
    ok('B: box "Aus Kalendern" in tasks tab', ev("!!A.shadowRoot.querySelector('.calbox')") and 'Englisch' in ev("A.shadowRoot.querySelector('.calbox').innerHTML"))
    eid=ev("Object.values(A._db.task).find(t=>t.title==='HA: Englisch Vokabeln').id")
    ev(f"A.shadowRoot.querySelector('.calbox [data-a=calhide][data-id=\"{eid}\"]').click()"); t(700)
    ok('B: hidden event not scheduled', ev(f"A._cfg.calHide.includes('{eid}')") and not ev(f"A._isOn(A._db.task['{eid}'], new Date(2026,9,23))"))
    ok('B: hidden event still listed with 👁️', '👁️' in ev("A.shadowRoot.querySelector('.calbox').innerHTML"))
    ev(f"A.shadowRoot.querySelector('.calbox [data-a=calhide][data-id=\"{eid}\"]').click()"); t(700)
    ok('B: show again', ev(f"A._isOn(A._db.task['{eid}'], new Date(2026,9,23))"))
    # Keine Minuspunkte bei Standard 0 – auch nicht für vergangene Termine
    ev("A._penaltyCheck()"); t(600)
    did=ev("Object.values(A._db.task).find(t=>t.title==='HA: Deutsch Aufsatz').id")
    ok('B: no penalty with 0', not ev(f"A._st('2026-10-19','{did}','K')"))
    # Bearbeiten: am Termintag + Ben dazu
    lid=ls[0]['id']
    ev(f"A._editCalLink('{lid}')"); t(500)
    ev("""(()=>{const m=A.shadowRoot.querySelector('#modal'); m.querySelector('[name=when][value=day]').checked=true; m.querySelectorAll('[name=kid]').forEach(c=>c.checked=true);})()""")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    kt=ev("Object.values(A._db.task).filter(t=>t.calLink).map(t=>[t.title,t.dates[0],t.kids.join()])")
    ok('B: edited link → on due day, both kids', ['HA: Mathe S. 42','2026-10-23','B,K'] in [[a,b_,','.join(sorted(c.split(',')))] for a,b_,c in kt], kt)
    # Ausschalten → keine Kalender-Aufgaben
    ev("A._setCfg({calOn:false})"); t(500)
    ok('B: feature off removes calendar tasks', not ev("Object.values(A._db.task).some(t=>t.calLink)"))
    ok('A still works with Müllkalender on', ev("A._isOn(A._db.task.TR, new Date(2026,9,29))"))
    ev("A._setCfg({calOn:true})"); t(500)
    # Löschen der Verknüpfung
    ev("A._tab='einst'; A._render()"); t(300)
    ev(f"A.shadowRoot.querySelector('[data-a=caled][data-id=\"{lid}\"]').click()"); t(500)
    ev("A.shadowRoot.querySelector('#modal [data-a=mdel]').click()"); t(100)
    ev("A.shadowRoot.querySelector('#modal [data-a=mdel]').click()"); t(700)
    ok('B: link deleted', not ev("(A._cfg.calLinks||[]).length") and not ev("Object.values(A._db.task).some(t=>t.calLink)"))
    ok('no page errors', not errs, errs)
    pg.close()
    # Nicht-Admin-Elternteil: Verknüpfen ist Eltern-Sache, ruft keine Admin-API
    b.close()

