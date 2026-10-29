# 1.5.0: Verhaltens-Diagramm, „Nur an schulfreien Tagen“, lockerere Zeiten an schulfreien Tagen, Tagesblöcke, Kleinkind-Vorlagen, Mittagsschlaf-Routine
from playwright.sync_api import sync_playwright
import datetime
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
def page(b, when):
    pg=b.new_page(viewport={'width':900,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat(when))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    return pg, errs
with sync_playwright() as p:
    b=p.chromium.launch()
    # Samstag 10:30 – schulfrei
    pg,errs=page(b,'2026-10-24T10:30:00'); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._save('kid','K',{name:'Mia',emoji:'🦊',points:20,total:20,by:2022,bm:1,bd:1});
      A._save('task','Z',{title:'Zähne putzen',emoji:'🪥',points:1,kids:['K'],sched:'week',days:[],from:'07:00',to:'09:00'});
      A._save('task','W',{title:'Wochenend-Aufgabe',emoji:'🏖️',points:1,kids:['K'],sched:'week',days:[],noschool:true});
      A._save('task','S',{title:'Schul-Aufgabe',emoji:'🎒',points:1,kids:['K'],sched:'week',days:[],school:true});})()"""); t(900)
    ok('window after 9:00 is over (freeLate off)', ev("A._win(A._db.task.Z)")=='after')
    ev("A._setCfg({freeLate:true})"); t(500)
    ok('freeLate: window open until 11:29 on Saturday', ev("A._win(A._db.task.Z)")=='open' and ev("A._winTo(A._db.task.Z)")=='11:29')
    ok('freeLate: text shows new end', '11:29' in ev("A._winText(A._db.task.Z)"))
    ok('freeLate: weekday keeps 9:00', ev("A._winTo(A._db.task.Z, '2026-10-21')")=='09:00')
    ok('noschool task on Saturday', ev("A._todayTasks('K').some(x=>x.id==='W')"))
    ok('noschool task not on Wednesday', not ev("A._isOn(A._db.task.W, new Date(2026,9,21))"))
    # Verhaltens-Diagramm
    ev("A._setCfg({behavOn:true}); A._addPoints('K',2,'😊 Artig'); A._addPoints('K',-1,'😠 Unartig'); A._tab='kinder'; A._render()"); t(800)
    h=ev("A.shadowRoot.innerHTML")
    ok('behaviour chart in kids tab', 'bhwrap' in h and ev("A.shadowRoot.querySelectorAll('.bhd').length")==14)
    ok('chart counts today', '2 😊 / 1 😠' in ev("A.shadowRoot.querySelector('.bhd.today').title"), ev("A.shadowRoot.querySelector('.bhd.today').title"))
    ev("A._setCfg({behavOn:false}); A._render()"); t(500)
    ok('no chart when feature off', not ev("!!A.shadowRoot.querySelector('.bhwrap')"))
    # Editor: „Nur an Schultagen“ / „Nur an schulfreien Tagen“ schließen sich aus
    ev("A._editTask('Z')"); t(500)
    ev("A.shadowRoot.querySelector('#modal [name=school]').click()"); t(100)
    ev("A.shadowRoot.querySelector('#modal [name=noschool]').click()"); t(100)
    ok('school/noschool exclusive', ev("A.shadowRoot.querySelector('#modal [name=noschool]').checked && !A.shadowRoot.querySelector('#modal [name=school]').checked"))
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(900)
    ok('noschool saved', ev("A._db.task.Z.noschool===true && !A._db.task.Z.school"), ev("A._db.task.Z"))
    # Tagesblöcke + Sortierung
    ev("""(()=>{A._save('task','A1',{title:'Abend',emoji:'🌙',points:1,kids:['K'],sched:'week',days:[],from:'19:00',to:'20:00',order:1});
      A._save('task','M1',{title:'Mittag',emoji:'☀️',points:1,kids:['K'],sched:'week',days:[],from:'14:30',to:'15:30',order:2});})()"""); t(700)
    ok('14:30 counts as Mittags now', ev("A._blk(A._db.task.M1)")=='mi')
    ordr=ev("A._taskOrder().map(x=>x.id)")
    ok('tasks tab sorted by day block', ordr.index('M1')<ordr.index('A1'), ordr)
    # Vorlagen
    ev("A._save('kid','T',{name:'Tom',emoji:'🐣',points:0,total:0,by:2024,bm:1,bd:1})"); t(500)
    tl=ev("A._wizTpls([A._db.kid.T]).map(o=>o.x[2])")
    ok('toddler templates for a 2-year-old', 'Windeln und Feuchttücher selbst wegbringen' in tl and 'Mittagsschlaf machen' in tl and 'Zähne putzen abends' in tl and 'Hausaufgaben machen' not in tl, len(tl))
    ev("A._setCfg({routOn:true})"); t(300); ev("A._editTask(null, true)"); t(500)
    ok('nap routine template offered', 'Mittagsschlaf-Routine' in ev("A.shadowRoot.querySelector('#modal').innerHTML"))
    # Tagesblöcke selbst einstellen
    ev("A._modalClose ? A._modalClose() : A.shadowRoot.getElementById('modal').classList.remove('open'); A._setCfg({blkB:{mi:'12:30',na:'15:00',a:'19:00'}})"); t(400)
    ok('custom blocks: 12:00 is Morgens now', ev("A._blk({from:'12:00'})")=='m' and ev("A._blk({from:'15:30'})")=='na' and ev("A._blk({from:'18:30'})")=='na' and ev("A._blkEnd('m')")=='12:29')
    ev("A._setCfg({blkB:{mi:'16:00',na:'15:00',a:'19:00'}})"); t(300)
    ok('invalid order falls back to default', ev("A._blkB().mi")=='11:30')
    ev("A._setCfg({blkB:null, setView:'all', dayBlocks:true}); A._tab='einst'; A._render()"); t(500)
    ev("(()=>{const i=A.shadowRoot.querySelector('[data-blkb=na]'); i.value='10:00'; i.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(400)
    ok('UI rejects overlapping blocks', not ev("A._cfg.blkB") and 'nacheinander' in (ev("(A.shadowRoot.querySelector('.toast')||{}).textContent||''")))
    ev("(()=>{const i=A.shadowRoot.querySelector('[data-blkb=a]'); i.value='19:30'; i.dispatchEvent(new Event('change',{bubbles:true,composed:true}));})()"); t(400)
    ok('UI saves valid blocks', (ev("A._cfg.blkB") or {}).get('a')=='19:30', ev("A._cfg.blkB"))
    # Papierkorb: Aufbewahrungsdauer
    ok('trash default 7 days', ev("A._trashDays()")==7)
    ev("A._save('trash','task-old',{t:'task',oid:'old',d:'2026-10-10',u:'Papa',o:{title:'Alt',emoji:'🧹'}}); A._save('trash','task-new',{t:'task',oid:'new',d:'2026-10-22',u:'Papa',o:{title:'Neu',emoji:'🧹'}})"); t(500)
    ev("A._cleanup()"); t(600)
    ok('trash older than 7 days deleted', not ev("!!A._db.trash['task-old']") and ev("!!A._db.trash['task-new']"))
    ev("A._setCfg({trashDays:'30'})"); t(300)
    ok('trash days selectable', ev("A._trashDays()")==30)
    ok('trash entry shows final date', 'endgültig weg am' in ev("A._trashSection()[3]"))
    # 20 Tage alter Eintrag: bei 30 Tagen sichtbar, zurückholbar, und „Alte Einträge aufräumen“ lässt ihn stehen
    ev("A._save('trash','task-mid',{t:'task',oid:'mid',d:'2026-10-04',u:'Papa',o:{title:'Mittelalt',emoji:'🧹',points:1,kids:['K'],sched:'week',days:[]}})"); t(500)
    ev("A._memClean()"); t(600)
    ok('memClean keeps entries within set days', ev("!!A._db.trash['task-mid']"))
    ok('20-day entry listed at 30 days', 'Mittelalt' in ev("A._trashSection()[3]"))
    ev("A._trashRestore('task-mid')"); t(600)
    ok('restore within set days', ev("!!A._db.task.mid && A._db.task.mid.title==='Mittelalt' && !A._db.trash['task-mid']"))
    ev("A._save('trash','task-mid2',{t:'task',oid:'mid2',d:'2026-10-04',u:'Papa',o:{title:'Mittel2',emoji:'🧹'}}); A._setCfg({trashDays:'14'})"); t(500)
    ev("A._memClean()"); t(600)
    ok('memClean removes entries older than set days', not ev("!!A._db.trash['task-mid2']"))
    # Umbenennung
    ev("A._editTask('W')"); t(500)
    ok('label renamed', 'Nur an schulfreien Tagen' in ev("A.shadowRoot.querySelector('#modal').innerHTML") and 'Nur ohne Schule' not in ev("A.shadowRoot.innerHTML"))
    ev("A._closeModal && A._closeModal()"); t(200)
    # Routinen-Vorlagen: immer alle 11, unabhängig vom Alter der Kinder
    ev("A._save('kid','Q',{name:'Teen',emoji:'🧑',by:2012,bm:1,bd:1}); A._setCfg({routOn:true})"); t(400)
    ev("A._editTask(null, true)"); t(500)
    ev("(()=>{const b=A.shadowRoot.querySelector('#modal'); b.querySelectorAll('[name=kid]').forEach(c=>{c.checked=c.value==='Q'; c.dispatchEvent(new Event('change',{bubbles:true,composed:true}));});})()"); t(400)
    vis=ev("[...A.shadowRoot.querySelectorAll('#modal .qp[data-rt]')].filter(x=>x.style.display!=='none').length")
    ok('all 11 routine templates visible for a 14-year-old', vis==11, vis)
    ev("A._closeModal && A._closeModal()"); t(200)
    # Lockerere Zeiten: wie viel länger + feste Zeit pro Aufgabe
    ev("A._setCfg({freeLate:true, freeMode:'60'})"); t(300)
    ok('freeMode 60: 9:00 → 10:00', ev("A._winTo(A._db.task.Z, '2026-10-24')")=='10:00', ev("A._winTo(A._db.task.Z, '2026-10-24')"))
    ev("A._setCfg({freeMode:'30'})"); t(200)
    ok('freeMode 30', ev("A._winTo(A._db.task.Z, '2026-10-24')")=='09:30')
    ev("A._setCfg({freeMode:'day'})"); t(200)
    ok('freeMode day → 23:59', ev("A._winTo(A._db.task.Z, '2026-10-24')")=='23:59')
    ok('weekday unchanged', ev("A._winTo(A._db.task.Z, '2026-10-21')")=='09:00')
    ev("A._setCfg({freeMode:''})"); t(200)
    ok('default = end of block', ev("A._winTo(A._db.task.Z, '2026-10-24')")=='11:29')
    ev("A._setCfg({freeMode:'120', setView:'all', dayBlocks:true}); A._tab='einst'; A._accOpen='f_dayBlocks'; A._render()"); t(500)
    ok('setting: select + example', ev("!!A.shadowRoot.querySelector('[data-cfgs=freeMode]')") and 'bis 11:00' in ev("A.shadowRoot.innerHTML"))
    ev("A._editTask('Z')"); t(500)
    ok('editor: fixed-time checkbox', ev("!!A.shadowRoot.querySelector('#modal [name=fixTime]')"))
    ev("A.shadowRoot.querySelector('#modal [name=fixTime]').click(); A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    ok('fixTime saved + keeps 9:00', ev("A._db.task.Z.fixTime===true") and ev("A._winTo(A._db.task.Z, '2026-10-24')")=='09:00')
    ev("A._setCfg({freeLate:false})"); t(300); ev("A._editTask('Z')"); t(400)
    ok('no checkbox when feature off, value kept', not ev("!!A.shadowRoot.querySelector('#modal [name=fixTime]')"))
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(600)
    ok('fixTime survives save while off', ev("A._db.task.Z.fixTime===true"))
    ok('no page errors', not errs, errs)
    pg.close()
    b.close()
print('\n'.join(R))
