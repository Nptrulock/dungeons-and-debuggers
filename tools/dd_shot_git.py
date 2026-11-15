from playwright.sync_api import sync_playwright
S='/workspace/personal-ops/dungeons-and-debuggers/screenshots/'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True); E=[]
    pg.on('pageerror',lambda e:E.append(str(e)))
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(800); pg.click('#gateBtn'); pg.wait_for_timeout(400); pg.evaluate("UIX.closeModal()")
    pg.evaluate("__DD.PLAY.open('g-conflict')"); pg.wait_for_timeout(300)
    chips=pg.evaluate("CHD.byId['g-conflict'].git.chips")
    for c in ['git merge blue','cat index.html']:
        pg.click(f'[data-act=chchip][data-v="{chips.index(c)}"]'); pg.click('[data-act=chcmd]'); pg.wait_for_timeout(300)
    pg.locator('.gitsvg').first.evaluate("e=>e.scrollIntoView({block:'end'})"); pg.wait_for_timeout(300)
    pg.screenshot(path=S+'phone-git-graph.png')
    print(E); b.close()
