from playwright.sync_api import sync_playwright
import datetime, json
R=[]
def ok(name, cond, extra=''): R.append(('OK ' if cond else 'FAIL ')+name+(' '+str(extra) if extra else ''))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1300,'height':1100}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-05T17:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(600)
    pg.evaluate("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',collapsed:true})"); pg.clock.run_for(300)
    A=pg.locator('#a kinderpunkte-card'); K=pg.locator('#b kinderpunkte-card'); t=lambda ms=400: pg.clock.run_for(ms)
    for n in ['Ben','Anna']:
        A.locator('[data-a="tab"][data-id="kinder"]').click(); A.locator('[data-a="ekid"]').last.click(); A.locator('#modal [name=name]').fill(n); A.locator('[data-a="msave"]').click(); t()
    # Einstellungen
    A.locator('[data-a="tab"][data-id="einst"]').click(); t()
    A.locator('[data-k="target"][data-v="notify.telegram_bot_familie"]').check(); t()
    for k in ['extraOn','photoOn','dOn','mOn','cmdOn']:
        A.locator(f'[data-a="cfg"][data-k="{k}"]').check(); t()
    A.locator('[data-a="cfg"][data-k="goalOn"]').uncheck(); t()
    A.locator('[data-cfgs="rTts"]').select_option('tts.google_de'); t()
    A.locator('[data-k="rPlayer"][data-v="media_player.kueche"]').check(); t()
    A.locator('[data-a="autonew"][data-k="cmd"]').click(); t()
    autos=pg.evaluate('window.autos||{}')
    ok('cmd automation', 'config/automation/config/yippee_telegram_befehle' in autos, autos.get('config/automation/config/yippee_telegram_befehle',{}).get('actions'))
    # Aufgaben
    def task(title, extra=False, photo=False):
        A.locator('[data-a="tab"][data-id="aufgaben"]').click(); A.locator('[data-a="etask"]').last.click(); t()
        A.locator('#modal [name=title]').fill(title); A.locator('#modal [name=points]').fill('3')
        if extra: A.locator('#modal [name=extra]').check()
        if photo: A.locator('#modal [name=photo]').check()
        A.locator('[data-a="msave"]').click(); t()
    task('Tisch decken'); task('Auto aussaugen', extra=True); task('Zimmer aufräumen', photo=True)
    
    # Kinder-Ansicht
    ids=pg.evaluate("Object.fromEntries(Object.values(A._db.kid).map(k=>[k.name,k.id]))")
    ben=K.locator(f'.card:has([data-a="kfold"][data-k="{ids["Ben"]}"])')
    ben.locator('[data-a="kfold"]').click(); t()
    ok('goal hidden', K.locator('[data-a="goal"]').count()==0)
    ok('extra tile', ben.locator('.tile.extra').count()==1, ben.locator('.tile.extra').inner_text())
    ok('count excludes extra', '0/2' in ben.inner_text())
    ben.locator('.tile.extra').click(); t()
    anna=K.locator(f'.card:has([data-a="kfold"][data-k="{ids["Anna"]}"])')
    anna.locator('[data-a="kfold"]').click(); t()
    ok('anna locked', ('Schon erledigt von Ben' in anna.locator('.tile.extra').inner_text() or 'Ben hat es gemacht' in anna.locator('.tile.extra').inner_text()), anna.locator('.tile.extra').inner_text())
    # Foto
    with pg.expect_file_chooser() as fc:
        ben.locator('.tile', has_text='Zimmer').click()
    fc.value.set_files('foto.png')
    import time
    for _ in range(10): time.sleep(0.3); t(200)
    upl=pg.evaluate('window.upl'); ok('upload', upl and upl['id']=='media-source://media_source/local' and upl['name'].startswith('kp_'), upl)
    tg=pg.evaluate('window.tg||[]'); ph=[x for x in tg if 'file' in x[0]]
    ok('telegram send_photo', ph and ph[-1][0]['file'].startswith('/media/kp_') and 'inline_keyboard' in ph[-1][0], ph[-1] if ph else tg)
    t(800)
    A.locator('[data-a="tab"][data-id="heute"]').click(); t()
    ok('thumb in approvals', A.locator('.phth img').count()==1)
    A.locator('[data-a="phview"]').click(); t(); ok('photo modal', A.locator('#modal .phbig').count()==1); A.locator('[data-a="mclose"]').first.click(); t()
    row=A.locator('.row').filter(has_text='Zimmer')
    row.locator('[data-a="apr"]').click(); t()
    ok('photo removed after approve', any('kp_' in x for x in pg.evaluate('window.removed||[]')), pg.evaluate('window.removed'))
    # Tagesabschluss
    A.locator('[data-a="tab"][data-id="einst"]').click(); t()
    n0=len(pg.evaluate('window.plain||[]'))
    A.locator('[data-a="dtest"]').click(); t()
    pl=pg.evaluate('window.plain||[]'); ok('daily sent', len(pl)>n0, pl[-1] if pl else None)
    A.locator('[data-a="mtest"]').click(); t()
    ok('morning tts', pg.evaluate('window.tts||[]'), pg.evaluate('window.tts'))
    # Telegram-Befehl simulieren
    for cmd in ['punkte','offen']:
        pg.evaluate(f"""items['todo.kinderpunkte'].push({{uid:'x{cmd}',summary:'kp|act|9{cmd}',description:JSON.stringify({{a:'KPC|{cmd}'}}),status:'needs_action'}}); push('todo.kinderpunkte')""")
        t(4000)
    pl=pg.evaluate('window.plain||[]')
    ok('cmd replies', any('Punktestand' in x[0] for x in pl) and any('Heute noch offen' in x[0] for x in pl), [x[0] for x in pl[-2:]])
    # Statistik
    A.locator('[data-a="tab"][data-id="kinder"]').click(); t()
    pg.evaluate("A._repOpen=true; A._repMode='c'; A._render()"); t()
    ok('stats', A.locator('.repbox .sbars').count()==2, A.locator('.stk').first.inner_text().replace('\n',' | '))
    # automatische Abend-/Morgenmeldung
    n1=len(pg.evaluate('window.plain||[]'))
    pg.clock.run_for(3*3600*1000+10*60000)  # -> 20:10
    pl=pg.evaluate('window.plain||[]'); ok('auto daily 20:00', any('heute +' in x[0] for x in pl[n1:]), len(pl)-n1)
    tt=len(pg.evaluate('window.tts||[]'))
    pg.clock.run_for(11*3600*1000)  # -> 07:10 next day
    ok('auto morning 07:00', len(pg.evaluate('window.tts||[]'))>tt, pg.evaluate('window.tts')[-1])
    ok('no page errors', not errs, errs)
    pg.set_viewport_size({'width':400,'height':900}); A.locator('[data-a="tab"][data-id="einst"]').click(); t()
    A.locator('.acch[data-id="f_dayBlocks"]').scroll_into_view_if_needed(); pg.screenshot(path='kp24a.png')
    A.locator('[data-a="tab"][data-id="kinder"]').click(); t(); pg.evaluate("A._repOpen=true; A._repMode='c'; A._render()"); t(); A.locator('.repbox').first.scroll_into_view_if_needed(); pg.screenshot(path='kp24b.png')
    b.close()
print('\n'.join(R))
