# 1.7.0: 🌙 Helle Farbvorlagen werden im Darkmode von Home Assistant automatisch dunkel (je Gerät), eigene Farben und dunkle Vorlagen bleiben
from playwright.sync_api import sync_playwright
import datetime, atexit
R=[]
def ok(n,c,x=''): R.append(('OK ' if c else 'FAIL ')+n+' '+str(x)[:300])
atexit.register(lambda: print('\n'.join(R)))
def lum(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]; c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def con(a,b): x,y=lum(a),lum(b); return (max(x,y)+0.05)/(min(x,y)+0.05)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':900,'height':1200}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.clock.install(time=datetime.datetime.fromisoformat('2026-10-30T16:00:00'))
    pg.goto('http://localhost:8765/kp_test.html'); pg.clock.run_for(1200)
    ev=pg.evaluate; t=lambda ms=600: pg.clock.run_for(ms)
    var=lambda el,v: ev(f"getComputedStyle({el}).getPropertyValue('{v}').trim()")
    rgb=lambda el: ev(f"(()=>{{const c=getComputedStyle({el}.shadowRoot.querySelector('.card')).backgroundColor.match(/\\d+/g).slice(0,3).map(Number); return '#'+c.map(x=>x.toString(16).padStart(2,'0')).join('')}})()")
    setdark=lambda on: (ev(f"(()=>{{const h={{...A._hass, themes:{{darkMode:{str(on).lower()}}}}}; A.hass=h; B.hass=h;}})()"), t(400))
    ev("A._save('kid','K',{name:'Mia',emoji:'🦊',points:5,total:5}); A._setCfg({vTheme:'forest'})"); t(600)
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',summary:true})"); t(600)
    ok('light HA: forest stays light', rgb('B')=='#ebfbee', rgb('B'))
    setdark(True)
    bg=rgb('B')
    ok('dark HA: forest turns dark (same card, no reload)', lum(bg)<0.05 and bg!='#1c1f26', bg)
    tx=var("B.shadowRoot.querySelector('.card')",'--tx'); 
    ok('dark variant: text readable', con('#'+''.join('%02x'%int(x) for x in ev("getComputedStyle(B.shadowRoot.querySelector('.card')).color.match(/\\d+/g).slice(0,3).map(Number)")), bg)>=7)
    ok('dark variant keeps green hue', int(bg[3:5],16)>int(bg[1:3],16))
    setdark(False)
    ok('back to light HA: light again', rgb('B')=='#ebfbee', rgb('B'))
    setdark(True)
    # Hell -> Dunkel-Vorlage
    ev("A._setCfg({vTheme:'light'})"); t(600)
    ok('"light" preset -> "dark" preset colours', rgb('B')=='#1c1f26', rgb('B'))
    # dunkle Vorlagen und eigene Farben unverändert
    ev("A._setCfg({vTheme:'night'})"); t(600)
    ok('night preset unchanged', rgb('B')=='#141b2d', rgb('B'))
    ev("A._setCfg({vTheme:'custom', vCol:{bg:'#fff0d0',surface:'#ffe0a0',text:'#332200',accent:'#ff8800'}})"); t(600)
    ok('own colours unchanged in dark mode', rgb('B')=='#fff0d0', rgb('B'))
    # Kartenkonfiguration colors: candy
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',summary:true,colors:'candy'})"); t(600)
    ok('card option colors: candy also darkened', lum(rgb('B'))<0.05, rgb('B'))
    ev("B.setConfig({storage:'todo.kinderpunkte',mode:'kids',summary:true})"); t(400)
    # Einstellungen: Vorschau-Farbfelder dunkel + Hinweis
    ev("A._setCfg({vTheme:'forest',setView:'all'}); A._accAll=false; A._accOpen='look'; A._tab='einst'; A._render()"); t(600)
    sw=ev("getComputedStyle(A.shadowRoot.querySelector('[data-a=vtheme][data-v=forest] .thsw')).backgroundColor")
    ok('settings swatch shows dark variant', sw!='rgb(235, 251, 238)', sw)
    ok('hint shown', 'Darkmode erkannt' in ev("A.shadowRoot.querySelector('#app').innerText"))
    setdark(False); ev("A._render()"); t(400)
    ok('no hint in light mode', 'Darkmode erkannt' not in ev("A.shadowRoot.querySelector('#app').innerText"))
    ok('light swatch again', ev("getComputedStyle(A.shadowRoot.querySelector('[data-a=vtheme][data-v=forest] .thsw')).backgroundColor")=='rgb(235, 251, 238)')
    # ohne themes-Angabe (ältere HA) = hell
    ev("(()=>{const h={...A._hass}; delete h.themes; A.hass=h;})()"); t(300)
    ok('no themes info: light', rgb('A')=='#ebfbee', rgb('A'))
    ok('no page errors', not errs and not ev("window.errs"), errs or ev("window.errs"))
    b.close()
