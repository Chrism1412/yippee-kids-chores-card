# 1.4.0: Türkisch & Russisch, neue Vorlagen (Aufgaben, Belohnungen, Routinen), Emoji-Gruppen, mehr Avatare
from playwright.sync_api import sync_playwright
import os, sys
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
SHOT=os.environ.get('KP_SHOTS')
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':400,'height':860}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/kp_test.html'); pg.wait_for_timeout(800); ev=pg.evaluate; t=pg.wait_for_timeout
    ev("A._save('kid','K',{name:'Mia',emoji:'🦊',points:10,born:'2016-03-01'})"); t(800)
    # Emoji-Auswahl mit Gruppen
    ev("A._tab='aufgaben'; A._render(); A._editTask(null)"); t(400)
    ev("A.shadowRoot.querySelector('#modal input[name=emoji]').click()"); t(300)
    g=ev("[...A.shadowRoot.querySelectorAll('#modal .emog')].map(x=>x.textContent)")
    n=ev("A.shadowRoot.querySelectorAll('#modal .ep').length")
    ok('task emoji groups', len(g)==9 and n>=240, (len(g), n))
    if SHOT: pg.screenshot(path=f'{SHOT}/emo.png')
    ev("A.shadowRoot.querySelector('#modal .ep[data-e=\"🧺\"]').click()"); t(200)
    ok('emoji picked', ev("A.shadowRoot.querySelector('#modal input[name=emoji]').value")=='🧺')
    tpl=ev("[...A.shadowRoot.querySelectorAll('#modal [data-a=qpick]')].map(x=>x.textContent)")
    ok('new task templates', any('Gemüsebeet gießen' in x for x in tpl) and any('Wäsche abnehmen' in x for x in tpl), len(tpl))
    ev("A._closeModal()"); t(200)
    # Routine-Vorlagen
    ev("A._setCfg({routOn:true})"); t(400)
    ev("A._editTask(null,true)"); t(400)
    rt=ev("[...A.shadowRoot.querySelectorAll('#modal [data-a=qpick]')].map(x=>x.textContent)")
    rr=[x for x in rt if x.endswith('Routine')]
    ok('6 routine templates', len(rr)==6 and any('Hausaufgaben-Routine' in x for x in rr), rr)
    ev("[...A.shadowRoot.querySelectorAll('#modal [data-a=qpick]')].find(x=>x.textContent.includes('Zimmer-Routine')).click()"); t(300)
    st=ev("JSON.parse(A.shadowRoot.querySelector('#modal input[name=steps]').value||'[]').map(x=>x.t)")
    ok('routine steps filled', len(st)==6 and st[0].startswith('🧸'), st)
    ev("A._closeModal()"); t(200)
    # Belohnungs-Vorlagen + Gruppen
    ev("A._editReward(null)"); t(400)
    rw=ev("[...A.shadowRoot.querySelectorAll('#modal [data-a=rpick],#modal .qp')].map(x=>x.textContent).join('|')")
    ok('new reward templates', 'Kletterhalle' in rw and 'Zirkus' in rw, rw[:120])
    ev("A.shadowRoot.querySelector('#modal input[name=emoji]').click()"); t(300)
    g2=ev("[...A.shadowRoot.querySelectorAll('#modal .emog')].map(x=>x.textContent)")
    ok('reward emoji groups', len(g2)==6, g2)
    ev("A._closeModal()"); t(200)
    # Avatare
    ev("A._editKid('K')"); t(400)
    ok('more avatars', ev("A.shadowRoot.querySelectorAll('#modal input[name=emoji][type=radio]').length")>=60)
    ev("A._closeModal()"); t(200)
    # Türkisch
    for code, word, grp in [('tr','Görevler','Ev işleri'), ('ru','Задания','Домашние дела')]:
        ev(f"A._setCfg({{lang:'{code}'}})"); t(600); pg.wait_for_timeout(1500); t(300)
        h=ev("A.shadowRoot.innerHTML")
        ok(f'{code} active', ev("A._lang")==code and word in h, ev("A._lang"))
        ok(f'{code} option in list', f'value="{code}"' in ev("(A._tab='einst',A._render(),A.shadowRoot.innerHTML)"))
        ev("A._tab='aufgaben'; A._render(); A._editTask(null)"); t(400)
        ev("A.shadowRoot.querySelector('#modal input[name=emoji]').click()"); t(300)
        ok(f'{code} emoji group translated', grp in ev("A.shadowRoot.querySelector('#modal .emogrid').textContent"))
        if SHOT: pg.screenshot(path=f'{SHOT}/{code}_task.png')
        ev("A._closeModal(); A._tab='heute'; A._render()"); t(300)
        if SHOT: pg.screenshot(path=f'{SHOT}/{code}_today.png')
    # Handbuch auf Russisch
    ev("A.shadowRoot.querySelector('[data-a=hb]').click()"); pg.wait_for_timeout(1500); t(300)
    ok('ru manual', 'Руководство' in ev("A.shadowRoot.querySelector('#modal').textContent"))
    if SHOT: pg.screenshot(path=f'{SHOT}/ru_manual.png')
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
