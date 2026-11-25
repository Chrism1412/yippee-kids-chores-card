# 2.0.0: 📺 Bildschirmzeit – Geräteauswahl nach Art gruppiert, nach Namen sortiert, mit Suchfeld und Handy-Hinweis
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-12-01T09:30:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1500); ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    ev("""(()=>{const S=A._hass.states, add=(e,n)=>S[e]={entity_id:e,state:'off',attributes:{friendly_name:n}};
      add('media_player.wohnzimmer_tv','Wohnzimmer TV'); add('remote.wohnzimmer_tv','Wohnzimmer TV Fernbedienung');
      add('switch.a_steckdose','Zimmer Steckdose'); add('switch.handy_mia_internet_access','Handy Mia Internetzugang');
      add('light.decke','Deckenlicht'); add('script.konsole_sperren','Konsole sperren'); add('script.abend','Abendroutine');
      A._save('kid','K',{name:'Mia',emoji:'🦊',points:10,total:10}); A._setCfg({approval:false,scOn:true}); return 0})()"""); t(1500)
    ev("document.getElementById('b').style.display='none'; A._editReward(null)"); t(2500)
    M="A.shadowRoot.querySelector('#modal')"
    ok('editor with screen time', ev(f"!!{M}.querySelector('select[name=scEnt]')"))
    groups=ev(f"[...{M}.querySelectorAll('select[name=scEnt] optgroup')].map(g=>g.label)")
    ok('grouped by kind, TV first', groups[:1]==['📺 Fernseher & Medien'] and '📜 Skripte' in groups and '💡 Lichter' in groups and not any('amsung' in g for g in groups), groups)
    tv=ev(f"[...{M}.querySelectorAll('select[name=scEnt] optgroup')[0].querySelectorAll('option')].map(o=>o.value)")
    ok('tv + remote in TV group', tv==['media_player.kueche','media_player.wohnzimmer_tv','remote.wohnzimmer_tv'], tv)
    sw=ev(f"[...{M}.querySelector('select[name=scEnt] optgroup[label*=Schalter]').querySelectorAll('option')].map(o=>o.value)")
    ok('sorted by name', sw==['switch.handy_mia_internet_access','switch.a_steckdose'], sw)
    ok('phone hint', 'Internetzugang' in ev(f"{M}.textContent"))
    ok('end scripts by name', ev(f"[...{M}.querySelectorAll('select[name=scOffEnt] option')].map(o=>o.value)")==['','script.abend','script.konsole_sperren'])
    pg.locator('#modal [name=scq]').fill('handy'); t(300)
    vis=ev(f"[...{M}.querySelectorAll('select[name=scEnt] optgroup:not([hidden]) option:not([hidden])')].map(o=>o.value)")
    ok('search filters', vis==['switch.handy_mia_internet_access'], vis)
    ok('first hit selected', ev(f"{M}.querySelector('select[name=scEnt]').value")=='switch.handy_mia_internet_access')
    pg.locator('#modal [name=scq]').fill(''); t(300)
    ok('empty search shows all', ev(f"{M}.querySelectorAll('select[name=scEnt] option:not([hidden])').length")==9)
    pg.locator('#modal [name=title]').fill('Fernsehen'); ev(f"{M}.querySelector('[name=scOn]').checked=true; {M}.querySelector('select[name=scEnt]').value='media_player.wohnzimmer_tv'")
    ev(f"{M}.querySelector('[data-a=msave]') ? {M}.querySelector('[data-a=msave]').click() : A._modalSave()"); t(1200)
    r=[x for x in ev("Object.values(A._db.reward)") if x.get('title')=='Fernsehen']
    ok('saved with tv', r and r[0].get('sc',{}).get('ent')=='media_player.wohnzimmer_tv', r)
    ok('no errors', not errs, errs)
    b.close()
