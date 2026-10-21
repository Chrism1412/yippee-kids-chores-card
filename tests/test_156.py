# 1.4.0: 👫 Gemeinsame Belohnungen – teilen, mitmachen, einladen, Rest übernehmen, zurücknehmen, ablehnen, Ablauf
from playwright.sync_api import sync_playwright
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:250])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1200,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/kp_test.html'); pg.wait_for_timeout(800); ev=pg.evaluate; t=pg.wait_for_timeout
    pts=lambda k: ev(f"A._db.kid['{k}'].points")
    tap=lambda k,m: ev(f"B.shadowRoot.querySelector('[data-a=shr][data-k={k}][data-m={m}]').click()")
    has=lambda k,m: ev(f"!!B.shadowRoot.querySelector('[data-a=shr][data-k={k}][data-m={m}]:not([disabled])')")
    pool=lambda: ev("Object.values(A._db.req).find(q=>q.pool)||null")
    def reset(a=50,b_=20,ap=True):
        ev(f"""(()=>{{Object.values(A._db.req).forEach(q=>A._del('req',q.id)); Object.keys(A._db.pt).forEach(id=>A._del('pt',id));
          A._setCfg({{shareOn:true,walletOn:true,approval:{'true' if ap else 'false'}}});
          A._save('kid','K',{{name:'Mia',emoji:'🦊',points:{a},total:{a}}}); A._save('kid','J',{{name:'Ben',emoji:'🐻',points:{b_},total:{b_}}});
          A._save('reward','R',{{title:'Waffeln',emoji:'🧇',cost:30,share:true}});}})()"""); t(900)
    reset()
    ok('tile shows share + invite', has('K','share') and has('K','invite') and '15 ⭐' in ev("B.shadowRoot.querySelector('[data-a=shr][data-k=K][data-m=share]').textContent"))
    tap('K','share'); t(700)
    q=pool(); ok('Mia paid share', pts('K')==35 and q and q['cov']=={'K':'K'} and q['paid']=={'K':15}, (pts('K'), q))
    ok('Ben asked to join', has('J','share') and 'machst du mit' in ev("B.shadowRoot.textContent"))
    tap('J','share'); t(700)
    q=pool(); ok('pool complete, waits for approval', pts('J')==5 and q and set(q['cov'])=={'K','J'}, q)
    h=ev("A.shadowRoot.innerHTML"); ok('parents see shared request with ✓', 'lösen gemeinsam' in h and ev("!!A.shadowRoot.querySelector('[data-a=rapr]')"))
    ev("A.shadowRoot.querySelector('[data-a=rapr]').click()"); t(1500)
    k=ev("A._db.kid.K"); j=ev("A._db.kid.J")
    ok('finished: vouchers + history + no pool', pool() is None and len(k.get('vouch',[]))==1 and len(j.get('vouch',[]))==1 and k['history'][0]['c']==15 and pts('K')==35 and pts('J')==5, (k.get('vouch'), j.get('vouch')))
    ok('weekly counter for both', len(k['red']['R'])==1 and len(j['red']['R'])==1)
    led=ev("A._db.kid.K.ledger.map(x=>x.r)"); ok('ledger reason', any(x.startswith('👫 Anteil: Waffeln') for x in led), led[:3])
    # Ablehnen → Rückzahlung
    reset(); tap('K','share'); t(600)
    ev("A.shadowRoot.querySelector('[data-a=rrej]').click()"); t(1500)
    ok('reject refunds', pts('K')==50 and pool() is None, pts('K'))
    # Zurücknehmen
    reset(); tap('K','share'); t(600); tap('K','back'); t(900)
    ok('take back refunds + deletes', pts('K')==50 and pool() is None, (pts('K'), pool()))
    # Einladen ohne Freigabe → sofort fertig
    reset(ap=False); tap('K','invite'); t(1500)
    k=ev("A._db.kid.K"); j=ev("A._db.kid.J")
    ok('invite: Mia pays all, Ben nothing', pts('K')==20 and pts('J')==20 and pool() is None, (pts('K'),pts('J')))
    ok('invite: one voucher at inviter', len(k.get('vouch',[]))==1 and 'Mia lädt Ben ein' in k['vouch'][0]['t'] and len(j.get('vouch') or [])==0, (k.get('vouch'), j.get('vouch')))
    # Rest übernehmen
    reset(ap=False); tap('K','share'); t(600)
    ok('rest button offered', has('K','rest'))
    tap('K','rest'); t(1500)
    ok('rest: Mia paid 30 total, one voucher', pts('K')==20 and pts('J')==20 and pool() is None and len(ev("A._db.kid.J.vouch||[]"))==0 and len(ev("A._db.kid.K.vouch||[]"))==1)
    # Zu wenig Sterne
    reset(b_=5); tap('K','share'); t(600)
    ok('Ben cannot join with 5', not has('J','share') and 'noch 10' in ev("B.shadowRoot.textContent"))
    # Ablauf nach 7 Tagen
    ev("(()=>{const q=Object.values(A._db.req).find(q=>q.pool); A._save('req',q.id,{...q,d:'2026-01-01'});})()"); t(500)
    ev("A._cleanup()"); t(1500)
    ok('expired pool refunded', pts('K')==50 and pool() is None, pts('K'))
    # kein „Nur für mich“ mehr – nur Teilen und Einladen
    reset(); ok('only share + invite buttons', ev("[...B.shadowRoot.querySelectorAll('[data-a=shr][data-k=K]')].map(x=>x.dataset.m).join(',')")=='share,invite')
    # Wochenlimit: Einladung verbraucht das Limit des eingeladenen Kindes nicht
    reset(ap=False); ev("A._save('reward','R',{title:'Waffeln',emoji:'🧇',cost:30,share:true,limit:1})"); t(700)
    tap('K','invite'); t(1500)
    ok('invite: limit only for inviter', len((ev("A._db.kid.K.red")or{}).get('R',[]))==1 and not (ev("A._db.kid.J.red")or{}).get('R'))
    ok('Ben can still start it himself', has('J','share') or has('J','invite'))
    # ungerader Preis + Auswahl der Kinder
    reset(); ev("A._save('kid','N',{name:'Anna',emoji:'🐼',points:40,total:40}); A._save('reward','R',{title:'Waffeln',emoji:'🧇',cost:25,share:true,shareKids:['K','J']})"); t(900)
    ok('odd price rounds up', '13 ⭐' in ev("B.shadowRoot.querySelector('[data-a=shr][data-k=K][data-m=share]').textContent"))
    ok('Anna does not see it', not ev("!!B.shadowRoot.querySelector('[data-a=shr][data-k=N]')"))
    # ohne Zusatzfunktion: normale Belohnung
    ev("A._setCfg({shareOn:false})"); t(600)
    ok('feature off → normal reward', not ev("!!B.shadowRoot.querySelector('[data-a=shr]')") and ev("!!B.shadowRoot.querySelector('[data-a=req][data-r=R]')"))
    # Editor speichert Auswahl
    ev("A._setCfg({shareOn:true})"); t(400)
    ev("A._editReward('R')"); t(300)
    ok('editor has share box', ev("!!A.shadowRoot.querySelector('#modal [name=share]:checked') && A.shadowRoot.querySelectorAll('#modal [name=shk]:checked').length==2"))
    ev("A.shadowRoot.querySelector('#modal [name=shk][value=N]').checked=true; A.shadowRoot.querySelector('[data-a=msave]').click()"); t(800)
    ok('all kids → shareKids empty', not ev("A._db.reward.R.shareKids") or len(ev("A._db.reward.R.shareKids"))==0, ev("A._db.reward.R"))
    # Hinweis oben im Dashboard des anderen Kindes
    ban=lambda k: ev(f"[...B.shadowRoot.querySelectorAll('.shban')].filter(x=>x.closest('.card').textContent.includes('{k}')).map(x=>x.textContent).join('|')")
    ev("A._del('kid','N')"); reset(); tap('K','share'); t(700)
    ok('banner: Ben asked to join at top', 'Mia möchte' in ban('Hallo Ben') and 'Mia möchte' not in ban('Hallo Mia') and ev("!!B.shadowRoot.querySelector('.shban [data-a=shr][data-k=J][data-m=share]')"), (ban('Hallo Ben'), ban('Hallo Mia')))
    ev("B.shadowRoot.querySelector('.shban [data-a=shr][data-k=J]').click()"); t(700)
    ok('banner button joins', pts('J')==5 and set(pool()['cov'])=={'K','J'})
    reset(); tap('K','invite'); t(800)
    ok('banner: Ben sees invite at top', 'Mia lädt dich ein' in ban('Hallo Ben') and 'wartet auf Mama/Papa' in ban('Hallo Ben') and not ban('Hallo Mia'), ban('Hallo Ben'))
    ev("A.shadowRoot.querySelector('[data-a=rapr]').click()"); t(1500)
    ok('banner gone after approval', not ban('Hallo Ben'))
    ev("A._setCfg({shareOn:false})"); t(500)
    ok('no page errors', not errs, errs)
    b.close()
print('\n'.join(R))
