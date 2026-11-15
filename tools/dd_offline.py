# Checks the offline fallback: Python/SQLite CDNs blocked -> friendly message, no crash, no lost run.
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844}); ctx.route('**/pyodide/**', lambda r: r.abort()); ctx.route('**/sql.js/**', lambda r: r.abort())
    pg=ctx.new_page(); E=[]; pg.on('pageerror',lambda e:E.append(str(e)))
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(800); pg.click('#gateBtn'); pg.wait_for_timeout(300); pg.evaluate("UIX.closeModal()")
    pg.evaluate("__DD.PLAY.open('p-print')"); pg.click('[data-act=chrun]'); pg.wait_for_timeout(4000)
    t=pg.locator('#cpCon').inner_text(); print('PY:', t.replace('\n',' | ')[:200], '| runs', pg.evaluate("__DD.PLAY.P.runs"))
    pg.evaluate("__DD.PLAY.close()"); pg.evaluate("__DD.PLAY.open('s-select')"); pg.click('[data-act=chrun]'); pg.wait_for_timeout(3000)
    print('SQL:', pg.locator('#cpOut').inner_text()[:200]); print('ERRS', E); b.close()
