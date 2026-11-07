#!/usr/bin/env python3
"""Automatische Tests für Yippee! - Kids Chores.

Baut aus dist/yippee-kids-chores-card.js und test_page.html (Home-Assistant-Attrappe) die Testseite,
startet einen kleinen Webserver und führt alle test_*.py aus. Exit-Code 1, sobald ein Test fehlschlägt.
Lokal:  pip install playwright jinja2 pillow && playwright install chromium && python tests/run_tests.py
"""
import glob, os, subprocess, sys, time, urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def build():
    card = open(os.path.join(ROOT, 'dist', 'yippee-kids-chores-card.js'), encoding='utf-8').read()
    page = open(os.path.join(HERE, 'test_page.html'), encoding='utf-8').read()
    page = page.replace('/*CARD*/', card, 1)
    page = page.replace('window.A=A;', 'window.A=A;window.items=items;', 1)
    # Einrichtungs-Assistent nur, wenn die Seite mit #wiz geöffnet wird (sonst starten die Tests mit der normalen Eltern-Ansicht)
    page = page.replace("mode:'admin',", "mode:'admin',wizard:location.hash.includes('wiz'),", 1)
    page = page.replace('const hass={', 'const hass={user:{id:"admin1",name:"Papa",is_admin:true},', 1)
    page = page.replace('\n</script>', '\n;customElements.define("kinderpunkte-card", class extends customElements.get("yippee-kids-chores-card"){});\n</script>', 1)
    open(os.path.join(HERE, 'kp_test.html'), 'w', encoding='utf-8').write(page)
    import shutil  # Handbuch und Sprachen liegen als eigene Dateien neben der Karte
    for f in glob.glob(os.path.join(ROOT, 'dist', 'yippee-kids-chores-*.js')):
        if not f.endswith('yippee-kids-chores-card.js'): shutil.copy(f, HERE)
    from PIL import Image  # Testfoto für den Foto-Nachweis
    im = Image.new('RGB', (1600, 1200), (200, 120, 40))
    for x in range(0, 1600, 40):
        for y in range(0, 1200, 40):
            im.paste(((x * 7) % 255, (y * 3) % 255, (x + y) % 255), (x, y, x + 20, y + 20))
    im.save(os.path.join(HERE, 'ph_test.jpg'), quality=90)
    Image.new('RGB', (4, 4), (255, 0, 0)).save(os.path.join(HERE, 'foto.png'))

def serve():
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = ThreadingHTTPServer(('localhost', 8765), partial(Quiet, directory=HERE))
    srv.handle_error = lambda *a: None  # abgebrochene Verbindungen beim Seitenwechsel sind normal
    Thread(target=srv.serve_forever, daemon=True).start()
    for _ in range(50):
        try:
            urllib.request.urlopen('http://localhost:8765/kp_test.html'); return srv
        except Exception: time.sleep(0.1)
    raise SystemExit('Webserver startet nicht')

def main():
    build(); srv = serve()
    tests = sorted(glob.glob(os.path.join(HERE, 'test_*.py')), key=lambda p: int(''.join(c for c in os.path.basename(p) if c.isdigit()) or 0))
    failed = []
    for t in tests:
        r = subprocess.run([sys.executable, t], cwd=HERE, capture_output=True, text=True, timeout=600)
        out = r.stdout + r.stderr
        bad = r.returncode != 0 or 'FAIL' in out or 'Traceback' in out
        oks = out.count('\nOK ') + (1 if out.startswith('OK ') else 0)
        print(f"{'❌' if bad else '✅'} {os.path.basename(t)}: {oks} OK")
        if bad:
            failed.append(t)
            print('\n'.join(l for l in out.splitlines() if l.startswith('FAIL') or 'Error' in l or 'Traceback' in l)[:4000])
    srv.shutdown()
    print(f"\n{len(tests) - len(failed)}/{len(tests)} Testdateien bestanden")
    sys.exit(1 if failed else 0)

if __name__ == '__main__':
    main()
