from playwright.sync_api import sync_playwright
S='/workspace/personal-ops/dungeons-and-debuggers/screenshots/'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True); E=[]
    pg.on('pageerror',lambda e:E.append(str(e)))
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(800); pg.click('#gateBtn'); pg.wait_for_timeout(400); pg.evaluate("UIX.closeModal()")
    pg.evaluate("__DD.PLAY.open('cpp-ptr')"); pg.wait_for_timeout(300)
    pg.click('[data-act=chslot][data-v="e"]'); pg.click('[data-act=chpick][data-v="e:2"]'); pg.click('[data-act=chrun]')
    pg.wait_for_selector('#cpDone:not(.hidden) .discCard'); pg.wait_for_timeout(2500); pg.click('[data-act=chkeep]')
    pg.click('[data-act=chmem][data-v="1"]'); pg.wait_for_timeout(300)
    print('arrows', pg.locator('#memsvg path').count()-1)
    pg.locator('.memviz').evaluate("e=>e.scrollIntoView({block:'start'})"); pg.wait_for_timeout(200)
    pg.screenshot(path=S+'phone-cpp-pointer-memory.png'); print(E); b.close()
