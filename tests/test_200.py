# 2.0.0: 🎨 Eigenes Haustier – KI-Prompt, JSON einfügen, Sicherheitsprüfung, Vorschau, Feinjustieren, Auswahl beim Kind,
#        Zeichnen in allen Stimmungen, Spiele, Bearbeiten, Löschen, Sicherung
from playwright.sync_api import sync_playwright
import datetime, atexit, json
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
PIG={'yippee_pet': 1, 'name': 'Rosa', 'emoji': '🐷', 'food': '🍎', 'egg': ['#ffc8dd', '#ff8fab'], 'parts': {'defs': "<radialGradient id='pig_head' cx='0.42' cy='0.35' r='0.7'><stop offset='0' stop-color='#ffd6e0'/><stop offset='0.6' stop-color='#ffb3c6'/><stop offset='1' stop-color='#f48fab'/></radialGradient><radialGradient id='pig_body' cx='0.4' cy='0.3' r='0.75'><stop offset='0' stop-color='#ffcbd8'/><stop offset='0.65' stop-color='#ffa8bf'/><stop offset='1' stop-color='#ee86a3'/></radialGradient><linearGradient id='pig_snout' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ff9fb8'/><stop offset='1' stop-color='#f57a9a'/></linearGradient><linearGradient id='pig_ear' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ffb3c6'/><stop offset='1' stop-color='#ee86a3'/></linearGradient><linearGradient id='pig_leg' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ffa8bf'/><stop offset='1' stop-color='#ee86a3'/></linearGradient><linearGradient id='pig_legback' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ee86a3'/><stop offset='1' stop-color='#d96d8c'/></linearGradient>", 'back': "<path d='M62 152 L62 178 Q62 185 69 185 Q76 185 76 178 L76 152 Z' fill='url(#pig_legback)' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><path d='M62 178 Q62 185 69 185 Q76 185 76 178 Z' fill='#b85a76' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><path d='M124 152 L124 178 Q124 185 131 185 Q138 185 138 178 L138 152 Z' fill='url(#pig_legback)' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><path d='M124 178 Q124 185 131 185 Q138 185 138 178 Z' fill='#b85a76' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/>", 'tail': "<path d='M134 146 C146 142 152 134 146 128 C140 122 133 130 139 135 C145 140 154 133 156 124' fill='none' stroke='#4a2f2f' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/><path d='M134 146 C146 142 152 134 146 128 C140 122 133 130 139 135 C145 140 154 133 156 124' fill='none' stroke='#ffa8bf' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/>", 'body': "<ellipse cx='100' cy='148' rx='35' ry='29' fill='url(#pig_body)' stroke='#4a2f2f' stroke-width='3'/><ellipse cx='91' cy='133' rx='13' ry='5' fill='#ffffff' opacity='0.5'/><path d='M80 160 L80 178 Q80 185 87 185 Q94 185 94 178 L94 160 Z' fill='url(#pig_leg)' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><path d='M80 178 Q80 185 87 185 Q94 185 94 178 Z' fill='#c9637f' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><line x1='87' y1='179' x2='87' y2='185' stroke='#4a2f2f' stroke-width='2' stroke-linecap='round'/><path d='M106 160 L106 178 Q106 185 113 185 Q120 185 120 178 L120 160 Z' fill='url(#pig_leg)' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><path d='M106 178 Q106 185 113 185 Q120 185 120 178 Z' fill='#c9637f' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><line x1='113' y1='179' x2='113' y2='185' stroke='#4a2f2f' stroke-width='2' stroke-linecap='round'/>", 'ears': "<path d='M82 44 C70 30 50 33 44 50 C41 59 43 67 48 73 C54 66 64 60 76 57 Z' fill='url(#pig_ear)' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><path d='M76 49 C66 41 54 43 50 53 C49 58 50 62 52 65 C57 60 64 57 72 55 Z' fill='#f57a9a' opacity='0.55'/><path d='M118 44 C130 30 150 33 156 50 C159 59 157 67 152 73 C146 66 136 60 124 57 Z' fill='url(#pig_ear)' stroke='#4a2f2f' stroke-width='3' stroke-linejoin='round'/><path d='M124 49 C134 41 146 43 150 53 C151 58 150 62 148 65 C143 60 136 57 128 55 Z' fill='#f57a9a' opacity='0.55'/>", 'head': "<circle cx='100' cy='80' r='42' fill='url(#pig_head)' stroke='#4a2f2f' stroke-width='3'/><ellipse cx='88' cy='54' rx='14' ry='6' fill='#ffffff' opacity='0.5'/><ellipse cx='100' cy='94' rx='17' ry='12' fill='url(#pig_snout)' stroke='#4a2f2f' stroke-width='3'/><ellipse cx='96' cy='89' rx='7' ry='2.5' fill='#ffffff' opacity='0.4'/><ellipse cx='94' cy='95' rx='2.6' ry='4' fill='#4a2f2f'/><ellipse cx='106' cy='95' rx='2.6' ry='4' fill='#4a2f2f'/>", 'front': '', 'wings': ''}, 'anchors': {'eyeL': [84, 68], 'eyeR': [116, 68], 'eyeSize': 8, 'mouth': [100, 113], 'headTop': [100, 38], 'neck': [100, 122], 'headPivot': [100, 120], 'tailPivot': [134, 146]}}
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':392,'height':860}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-11-25T15:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{A._hass.states['person.papa']={entity_id:'person.papa',state:'home',attributes:{friendly_name:'Papa',user_id:'admin1'}};
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:0,total:120,order:1}); A._save('kid','B2',{name:'Ben',emoji:'🐻',points:0,total:10,order:2});
      A._setCfg({parents:['admin1'],approval:false,kView:'classic',peOn:true,pePlay:'always',peGLim:'0'}); A._save('pk','K',{on:true}); A._save('pk','B2',{on:true,kind:'dog',name:'Bello',t0:0,s:1,h:true});
      B.setConfig({storage:'todo.kinderpunkte',mode:'kid',child:'Mia'}); B.hass={...B._hass, user:{id:'kid1', name:'Mia', is_admin:false}}; return 0})()"""); t(2000)
    # ---------- Sicherheitsprüfung ----------
    evil={'name':'X<b>','emoji':'🐷','parts':{'head':"<circle cx='1' cy='1' r='1' onload='alert(1)' style='x' fill='url(http://evil/x)'/><script>alert(1)</script><foreignObject><div>x</div></foreignObject><a href='javascript:alert(1)'><path d='M0 0'/></a><text>hi</text><path d='M1 1' fill='url(#g1)'/>",'defs':"<linearGradient id='g1'><stop offset='0' stop-color='#fff'/></linearGradient>",'body':"<rect x='1' y='1' width='2' height='2' transform='translate(1 1)'/>"},'anchors':{'eyeL':[999,'x'],'eyeR':[1,2],'mouth':[1,2]}}
    c=ev(f"A._clean('po',{{...{json.dumps(evil)},id:'o_t1'}})")
    h=c['parts']['head']
    ok('script/foreignObject/a/text removed', not any(x in h for x in ['script','foreign','<a','<text','alert']), h)
    ok('event + style + external url removed', 'onload' not in h and 'style' not in h and 'http' not in h, h)
    ok('ids + refs prefixed', "id=\"o_t1_g1\"" in c['parts']['defs'] and 'url(#o_t1_g1)' in h, [c['parts']['defs'], h])
    ok('prefix idempotent', ev(f"A._clean('po',A._clean('po',{{...{json.dumps(evil)},id:'o_t1'}})).parts.defs")==c['parts']['defs'])
    ok('anchors clamped, name cleaned', c['an']['eyeL']==[220,68] and c['name']=='Xb', [c['an'],c['name']])
    ok('broken svg → empty part', ev("A._clean('po',{id:'o_t2',parts:{head:'<circle cx=1'}}).parts.head")=='')
    # ---------- Tab + Dialog ----------
    ev("document.getElementById('b').style.display='none'; A._tab='tier'; A._render()"); t(800)
    ok('own section in tab', '🎨' in ev("A.shadowRoot.querySelector('.petab').textContent") and ev("!!A.shadowRoot.querySelector('[data-a=pepoadd]')"))
    ev("A.shadowRoot.querySelector('[data-a=pepoadd]').click()"); t(500)
    ok('dialog open', ev("!!A.shadowRoot.querySelector('#modal #po_json')"))
    ev("A.shadowRoot.querySelector('#modal #po_desc').value='grünes Schaf'")
    ok('prompt contains description + format', 'grünes Schaf' in ev("A._poPrompt('grünes Schaf')") and 'earsFront' in ev("A._poPrompt('x')") and 'eyeL' in ev("A._poPrompt('x')"))
    ev("(()=>{const t=A.shadowRoot.querySelector('#modal #po_json'); t.value='kein json'; t.dispatchEvent(new Event('input',{bubbles:true}));})()"); t(200)
    ok('invalid json message', 'JSON' in ev("A.shadowRoot.querySelector('#modal #po_msg').textContent"))
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(300)
    ok('no save without valid json', ev("Object.keys(A._db.po).length")==0 and ev("!!A.shadowRoot.querySelector('#modal #po_json')"))
    ev(f"(()=>{{const t=A.shadowRoot.querySelector('#modal #po_json'); t.value='Hier ist dein Tier:\\n```json\\n'+{json.dumps(json.dumps(PIG))}+'\\n```'; t.dispatchEvent(new Event('input',{{bubbles:true}}));}})()"); t(300)
    ok('preview 5 figures', ev("A.shadowRoot.querySelectorAll('#modal #po_prev figure').length")==5, ev("A.shadowRoot.querySelector('#modal #po_msg').textContent"))
    ok('name taken from json', ev("A.shadowRoot.querySelector('#modal #po_name').value")=='Rosa')
    y0=ev("A.shadowRoot.querySelector('#modal #po_prev figure svg').innerHTML.length")
    ev("A.shadowRoot.querySelector('#modal [data-po=ey][data-d=\"-2\"]').click()"); t(100)
    ev("A.shadowRoot.querySelector('#modal .po_k[value=K]').click()")
    ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    po=ev("Object.values(A._db.po)")
    ok('saved', len(po)==1 and po[0]['name']=='Rosa' and po[0]['kids']==['K'] and po[0]['id'].startswith('o_'), po and {k:po[0][k] for k in ['id','name','kids']})
    oid=po[0]['id']
    ok('nudge saved (eyes 2 up)', po[0]['an']['eyeL'][1]==PIG['anchors']['eyeL'][1]-2, po[0]['an'])
    ok('tab lists own pet', 'Rosa' in ev("A.shadowRoot.querySelector('.petab').textContent"))
    # ---------- Kind wählt eigenes Tier ----------
    ev("document.getElementById('b').style.display=''; document.getElementById('a').style.display='none'; B._peKid='K'; B._render()"); t(800)
    ok('kid sees own pet in choice', ev(f"!!B.shadowRoot.querySelector('[data-a=pepick][data-v={oid}]')"))
    ok('Ben does not (only Mia)', oid not in ev("A._peKinds('B2')") and oid in ev("A._peKinds('K')"))
    ev(f"B.shadowRoot.querySelector('[data-a=pepick][data-v={oid}]').click()"); t(400)
    ev("B.shadowRoot.querySelector('[data-a=pestart]').click()"); t(800)
    ok('kid has own pet', ev("A._db.pk.K.kind")==oid, ev("A._db.pk.K"))
    t(3000)
    ok('widget/page draws without error', not errs, errs)
    ok('pet visible on page', ev("B.shadowRoot.querySelectorAll('.pest svg').length")>=1)
    # Stage 1 (120 ⭐ → baby/young) + Stimmungen
    ev("A._save('pk','K',{...A._db.pk.K,t0:0,s:3,h:true}); B._render()"); t(3000)
    ok('grown own pet draws gradients', 'yp_ownI' in ev("B.shadowRoot.innerHTML") and f'{oid}_pig_head' in ev("B.shadowRoot.innerHTML"))
    # Einlage „spec“ (Effekt-Emojis) auch beim eigenen Tier
    ev("window.__r=Math.random; Math.random=()=>0.95"); t(12000); ev("Math.random=window.__r")
    ok('idle spec with own pet', not errs, errs)
    # Spiele
    ev("B.shadowRoot.querySelector('[data-a=pegames]').click()"); t(800)
    ok('own game = catch', ev("!!B.shadowRoot.querySelector('.gmov [data-g=play][data-v=catch].own')"))
    ev("B._gmStart('K','catch')"); t(3000); ev("B._gmStart('K','math')"); t(800)
    ok('games with own pet ok', not errs and ev("!!B.shadowRoot.querySelector('.gmov .gmtask')"), errs)
    ev("B._gmClose()"); t(300)
    # ---------- Bearbeiten + Löschen ----------
    ev("document.getElementById('a').style.display=''; A._tab='tier'; A._render()"); t(600)
    ev(f"A.shadowRoot.querySelector('[data-a=pepoed][data-v={oid}]').click()"); t(500)
    ok('edit shows preview at once', ev("A.shadowRoot.querySelectorAll('#modal #po_prev figure').length")==5)
    ev("A.shadowRoot.querySelector('#modal #po_name').value='Rosalie'"); ev("A.shadowRoot.querySelector('#modal [data-a=msave]').click()"); t(800)
    ok('edit keeps id + renames', ev(f"A._db.po['{oid}'].name")=='Rosalie' and len(ev("Object.keys(A._db.po)"))==1)
    ok('backup contains po', '"po"' in ev("A._backupJson()") and oid in ev("A._backupJson()"))
    ev(f"A.shadowRoot.querySelector('[data-a=pepodel][data-v={oid}]').click()"); t(200)
    ok('delete asks first', len(ev("Object.keys(A._db.po)"))==1 and 'Löschen?' in ev("A.shadowRoot.querySelector('[data-a=pepodel]').textContent"))
    ev(f"A.shadowRoot.querySelector('[data-a=pepodel][data-v={oid}]').click()"); t(800)
    ok('deleted', len(ev("Object.keys(A._db.po)"))==0)
    ev("B._render()"); t(1500)
    ok('kid chooses again after delete', ev("B._peKindOf(A._db.pk.K)")=='' )
    ok('no errors', not errs, errs)
    b.close()
