# 1.4.0: Einrichtungs-Assistent, Einstellungen „Einfach / Alle“, Speicher-Anzeige
from playwright.sync_api import sync_playwright
import os
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
SHOT=os.environ.get('KP_SHOTS')
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':400,'height':860}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/kp_test.html#wiz'); pg.wait_for_timeout(1000); ev=pg.evaluate; t=pg.wait_for_timeout
    q=lambda sel: f"A.shadowRoot.querySelector('{sel}')"
    ok('wizard on first start', ev(f"!!{q('.wiz')}"))
    ok('next disabled without kids', ev(f"{q('[data-s=next]')}.disabled"))
    ev(f"{q('.wizname')}.value='Mia'; {q('.wizborn')}.value='2018-05-04'"); ev(f"{q('[data-s=addkid]')}.click()"); t(600)
    ev(f"{q('.wizname')}.value='Ben'; {q('.wizborn')}.value='2013-02-10'"); ev(f"{q('[data-s=addkid]')}.click()"); t(600)
    ok('two kids added, wizard stays', ev("A._kids().length")==2 and ev(f"!!{q('.wiz')}"), ev("A._kids().map(k=>k.name+':'+A._age(k))"))
    if SHOT: pg.screenshot(path=f'{SHOT}/wiz1.png')
    ev(f"{q('[data-s=next]')}.click()"); t(300)
    n=ev("A.shadowRoot.querySelectorAll('.wizt').length"); c=ev("A.shadowRoot.querySelectorAll('.wizt:checked').length")
    ok('step 2 task list', n>80 and 5<=c<=13, (n,c))
    if SHOT: pg.screenshot(path=f'{SHOT}/wiz2.png')
    ev(f"{q('[data-s=next]')}.click()"); t(300)
    ok('step 3 rewards', ev("A.shadowRoot.querySelectorAll('.wizr:checked').length")==5)
    ev(f"{q('[data-s=back]')}.click()"); t(300)
    ok('back keeps choice', ev("A.shadowRoot.querySelectorAll('.wizt:checked').length")==c)
    ev(f"{q('[data-s=next]')}.click()"); t(200); ev(f"{q('[data-s=next]')}.click()"); t(300)
    if SHOT: pg.screenshot(path=f'{SHOT}/wiz4.png')
    ev(f"{q('[data-s=done]')}.click()"); t(1500)
    tasks=ev("Object.values(A._db.task).filter(x=>!x.virtual)"); rw=ev("Object.values(A._db.reward)")
    ok('tasks created', len(tasks)==c, len(tasks))
    ok('rewards created', len(rw)==5, len(rw))
    zp=[x for x in tasks if x['title']=='Zähne putzen morgens']
    ok('age fit per kid', all(len(x['kids'])>=1 for x in tasks) and (not zp or len(zp[0]['kids'])==2), [ (x['title'],len(x['kids'])) for x in tasks][:6])
    hw=[x for x in tasks if x['title']=='Spülmaschine ausräumen']
    ok('wizard done + simple', ev("A._cfg.wizDone===true && A._cfg.setView==='simple'") and not ev(f"!!{q('.wiz')}"))
    # Einstellungen einfach
    ev("A._tab='einst'; A._render()"); t(300)
    ids=ev("[...A.shadowRoot.querySelectorAll('.acch')].map(x=>x.dataset.id)")
    ok('simple shows few sections', set(ids)=={'lang','vac','appr','notif','bk','sec'}, ids)
    if SHOT: pg.screenshot(path=f'{SHOT}/simple.png')
    ev(f"{q('[data-a=setview][data-v=all]')}.click()"); t(400)
    ids2=ev("[...A.shadowRoot.querySelectorAll('.acch')].map(x=>x.dataset.id)")
    ok('all shows everything incl. mem', len(ids2)>12 and 'mem' in ids2 and 'feat' in ids2, len(ids2))
    # Speicher
    ev(f"{q('.acch[data-id=mem]')}.click()"); t(300)
    txt=ev(f"{q('.acch[data-id=mem]')}.closest('.acc').textContent")
    ok('mem shows sizes', 'KB' in txt and 'Gesamt' in txt, txt[:120])
    if SHOT: pg.screenshot(path=f'{SHOT}/mem.png')
    ev("A._save('audit','main',{e:Array.from({length:180},(_,i)=>[Date.now()-i*1000,'x','t'+i])})"); t(500)
    ev(f"{q('[data-a=memclean]')}.click()"); t(100)
    ok('clean asks', 'Nochmal' in ev(f"{q('[data-a=memclean]')}.textContent"))
    ev(f"{q('[data-a=memclean]')}.click()"); t(1200)
    ok('audit trimmed', len(ev("A._db.audit.main.e"))==100)
    # Assistent erneut starten: vorhandene Kinder nicht löschbar, keine Dubletten
    ev(f"{q('[data-a=wizstart]')}.click()"); t(300)
    ok('restart: no delete for old kids', ev("A.shadowRoot.querySelectorAll('[data-s=delkid]').length")==0)
    for _ in range(3): ev(f"{q('[data-s=next]')}.click()"); t(250)
    ev(f"{q('[data-s=done]')}.click()"); t(1200)
    ok('no duplicates', len(ev("Object.values(A._db.task).filter(x=>!x.virtual)"))==c and len(ev("Object.values(A._db.reward)"))==5)
    # Auto-Assistent verschwindet, wenn Daten von woanders kommen
    pg2=b.new_page(viewport={'width':400,'height':860}); pg2.goto('http://localhost:8765/kp_test.html#wiz'); pg2.wait_for_timeout(900)
    ok('fresh page shows wizard', pg2.evaluate("!!A.shadowRoot.querySelector('.wiz')"))
    pg2.evaluate("A._save('kid','K',{name:'Kai',emoji:'🐻',points:1})"); pg2.wait_for_timeout(500)
    ok('external data closes wizard', not pg2.evaluate("!!A.shadowRoot.querySelector('.wiz')"))
    pg3=b.new_page(); pg3.goto('http://localhost:8765/kp_test.html'); pg3.wait_for_timeout(900)
    ok('wizard: false hides it', not pg3.evaluate("!!A.shadowRoot.querySelector('.wiz')"))
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
