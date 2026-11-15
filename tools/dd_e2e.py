import json, sys, time
from playwright.sync_api import sync_playwright
URL='http://localhost:8765/index.html'
SHOTS='/workspace/personal-ops/dungeons-and-debuggers/screenshots/'
results=[]; errs=[]
def rec(name, ok, info=''):
    results.append((name, ok, info)); print(('PASS ' if ok else 'FAIL ')+name+(' '+info if info else ''), flush=True)
def attach(pg, tag):
    pg.on('pageerror', lambda e: errs.append(tag+' PAGEERR '+str(e)))
    pg.on('console', lambda m: m.type=='error' and errs.append(tag+' CONSOLE '+m.text))
def gate(pg):
    if pg.locator('#gateBtn').is_visible(): pg.click('#gateBtn'); pg.wait_for_timeout(500)
def dismiss(pg):
    gate(pg)
    for _ in range(4):
        b=pg.locator('#modal:not(.hidden) button, .modal:not(.hidden) button').first
        if pg.locator('#modal:not(.hidden)').count()==0 and pg.locator('.modalBack:not(.hidden)').count()==0: break
        try: b.click(timeout=1000)
        except Exception: break
        pg.wait_for_timeout(200)
def tap(pg, sel): pg.locator(sel).first.click(timeout=5000)
def set_slots(pg, cid):
    info=pg.evaluate("""(id)=>{const ch=CHD.byId[id];const sol=CHD.solVals(ch);const out=[];for(const k in ch.slots){const s=ch.slots[k];if(s.n)out.push([k,'n',sol[k],__DD.PLAY.P.vals[k],s.n[2]||1]);else out.push([k,'o',s.o.indexOf(sol[k])]);}return out;}""", cid)
    for k,kind,*rest in info:
        tap(pg, f'[data-act=chslot][data-v="{k}"]'); pg.wait_for_timeout(120)
        if kind=='o': tap(pg, f'[data-act=chpick][data-v="{k}:{rest[0]}"]')
        else:
            target,cur,step=rest; n=round((target-cur)/step)
            for _ in range(abs(n)): tap(pg, f'[data-act=chstep][data-v="{k}:{1 if n>0 else -1}"]')
            tap(pg, '[data-act=chsheetx]')
        pg.wait_for_timeout(100)
def wait_done(pg, timeout=60000):
    pg.wait_for_selector('#cpDone:not(.hidden) .discCard', timeout=timeout)
    return pg.locator('#cpDone').inner_text()
def solve_ui(pg, cid, timeout=60000):
    pg.evaluate("id=>__DD.PLAY.open(id)", cid); pg.wait_for_timeout(300)
    sb=pg.evaluate("id=>CHD.byId[id].sb", cid)
    if sb=='git':
        sol=pg.evaluate("id=>CHD.byId[id].sol", cid); chips=pg.evaluate("id=>CHD.byId[id].git.chips", cid)
        for c in sol:
            tap(pg, f'[data-act=chchip][data-v="{chips.index(c)}"]'); tap(pg, '[data-act=chcmd]'); pg.wait_for_timeout(120)
    elif sb=='ai':
        for p in pg.evaluate("id=>CHD.byId[id].sol", cid): tap(pg, f'[data-act=chpart][data-v="{p}"]')
        tap(pg, '[data-act=chrun]')
    else:
        set_slots(pg, cid); tap(pg, '[data-act=chrun]')
    return wait_done(pg, timeout)
def close_ch(pg):
    pg.evaluate("__DD.PLAY.close && __DD.PLAY.close()"); pg.wait_for_timeout(200)

with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    # ---------- PHONE 390x844, fresh save ----------
    ctx=b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    pg=ctx.new_page(); attach(pg,'phone')
    pg.goto(URL); pg.wait_for_timeout(1200); gate(pg)
    rec('fresh: intro modal shown', pg.locator('text=learn by building').count()+pg.locator('text=Learn by building').count()>0 or pg.evaluate("!!document.querySelector('.modal, #modal')"))
    dismiss(pg)
    rec('build home shows next challenge', 'h-first' in pg.content() or pg.locator('[data-act=chopen]').count()>0)
    # real tap path for the first challenge from the home page
    tap(pg, '[data-act=chopen][data-v="h-first"]'); pg.wait_for_timeout(400)
    set_slots(pg,'h-first'); pg.wait_for_timeout(500)
    tap(pg,'[data-act=chrun]'); t=wait_done(pg)
    rec('html: h-first solved by tapping slots', 'discover' in t.lower() or 'XP' in t, t[:80].replace('\n',' '))
    close_ch(pg)
    # HTML preview screenshot: site-3 mid-build
    pg.evaluate("__DD.PLAY.open('site-3')"); pg.wait_for_timeout(300); set_slots(pg,'site-3'); pg.wait_for_timeout(900)
    pg.locator('#cpOut').scroll_into_view_if_needed(); pg.screenshot(path=SHOTS+'phone-html-preview.png')
    tap(pg,'[data-act=chrun]'); t=wait_done(pg); rec('html project: site-3 solved', True)
    close_ch(pg)
    for cid,name,to in [('j-log','js',30000),('p-print','python (live Pyodide)',120000),('p-turtle','python turtle (sliders)',60000),('s-select','sql (live sql.js)',60000),('cpp-hello','c++ compiled record',20000),('at-rmove','rust ownership record',20000),('ai-vague','ai prompt builder',30000),('g-commit','git terminal',20000),('weather-1','api mock fetch',30000),('d-stack','debug stack trace',30000)]:
        try: solve_ui(pg,cid,to); rec(name+': '+cid+' solved end-to-end', True)
        except Exception as e: rec(name+': '+cid, False, str(e)[:200])
        close_ch(pg)
    # stack trace text visible on wrong run
    pg.evaluate("__DD.PLAY.open('d-stack')"); pg.wait_for_timeout(300)
    pg.evaluate("()=>{}"); tap(pg,'[data-act=chslot][data-v="k"]'); tap(pg,'[data-act=chpick][data-v="k:0"]'); tap(pg,'[data-act=chrun]'); pg.wait_for_timeout(1500)
    con=pg.locator('#cpCon').inner_text() if pg.locator('#cpCon').count() else ''
    rec('debug: stack trace lines shown', 'line' in con and 'initials' in con, con[:160].replace('\n',' | '))
    close_ch(pg)
    # stepper: d-step with hint ladder to solution
    pg.evaluate("__DD.PLAY.open('d-step')"); pg.wait_for_timeout(300); tap(pg,'[data-act=chrun]'); pg.wait_for_timeout(1500)
    rec('debug: stepper recorded steps', pg.evaluate("__DD.PLAY.P.steps && __DD.PLAY.P.steps.length>3"))
    for lv in (1,2,3):
        tap(pg,'[data-act=chhint]'); tap(pg,f'[data-act=chhintlv][data-v="{lv}"]'); pg.wait_for_timeout(150)
    tap(pg,'[data-act=chrun]'); t=wait_done(pg); rec('hint ladder lv3 → solution → solved', 'XP' in t, t[:80].replace('\n',' '))
    close_ch(pg)
    # git graph screenshot (g-branch)
    try:
        solve_ui(pg,'g-branch'); tap(pg,'[data-act=chkeep]'); pg.wait_for_timeout(300)
        pg.locator('.gitsvg').first.scroll_into_view_if_needed(); pg.wait_for_timeout(200)
        pg.screenshot(path=SHOTS+'phone-git-graph.png'); rec('git graph rendered', pg.locator('.gitsvg circle').count()>=2)
    except Exception as e: rec('git graph', False, str(e)[:200])
    close_ch(pg)
    # boss: lose by running out of runs, then retry and win
    pg.evaluate("__DD.PLAY.open('boss-1')"); pg.wait_for_timeout(300)
    for _ in range(3): tap(pg,'[data-act=chrun]'); pg.wait_for_timeout(700)
    pg.wait_for_timeout(800); rec('boss: out of runs screen', 'Out of runs' in pg.locator('#cpDone').inner_text())
    tap(pg,'[data-act=chbossretry]'); set_slots(pg,'boss-1'); tap(pg,'[data-act=chrun]'); t=wait_done(pg); rec('boss: retry and clear', 'Boss' in t or 'boss' in t)
    close_ch(pg)
    # workshop tab
    pg.evaluate("__DD.UI && 0"); tap(pg,'[data-act=tab][data-v=shop]') if pg.locator('[data-act=tab][data-v=shop]').count() else None
    pg.wait_for_timeout(500); w=pg.locator('#main, main, body').first.inner_text()
    rec('workshop shows projects', 'Website' in w or 'Personal' in w or 'project' in w.lower(), w[:120].replace('\n',' '))
    if pg.locator('[data-act=chview]').count():
        tap(pg,'[data-act=chview]'); pg.wait_for_timeout(800); rec('workshop: open my build replays', pg.locator('#vbMount iframe, #vbMount svg, #vbMount table, #vbMount pre, #vbMount canvas').count()>0); dismiss(pg)
        pg.evaluate("UIX.closeModal()")
    pg.screenshot(path=SHOTS+'phone-workshop.png')
    # persistence reload
    n=pg.evaluate("__DD.G.chSolvedCount()"); pg.reload(); pg.wait_for_timeout(1200); dismiss(pg); n2=pg.evaluate("__DD.G.chSolvedCount()")
    rec('progress persists across reload', n==n2 and n>=10, f'{n} -> {n2}')
    ctx.close()
    # ---------- v1 save migration ----------
    ctx=b.new_context(viewport={'width':390,'height':844}); pg=ctx.new_page()
    pg.goto(URL); pg.wait_for_timeout(800)
    v1=pg.evaluate("()=>{const s=JSON.parse(JSON.stringify(__DD.G.S));s.v=1;delete s.ch;delete s.chCombo;delete s.seenV2;s.seenIntro=true;s.xp=1234;s.coins=777;return JSON.stringify(s);}")
    ctx.close()
    ctx=b.new_context(viewport={'width':390,'height':844}); ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('dnd-dev-save-v1', %s); sessionStorage.setItem('seeded','1');}" % json.dumps(v1))
    pg=ctx.new_page(); attach(pg,'migrate'); pg.goto(URL); pg.wait_for_timeout(1200); gate(pg)
    body=pg.locator('#modal').inner_text().lower()
    ok=pg.evaluate("__DD.G.S.v===2 && __DD.G.S.coins===777 && __DD.G.S.xp===1234 && typeof __DD.G.S.ch==='object'")
    rec('v1 save migrates (v2 announce modal, data kept)', ok and 'build' in body, body[:100].replace('\n',' '))
    pg.screenshot(path=SHOTS+'phone-v2-upgrade-notice.png')
    ctx.close()
    # ---------- DESKTOP ----------
    ctx=b.new_context(viewport={'width':1366,'height':900}); pg=ctx.new_page(); attach(pg,'desktop')
    pg.goto(URL); pg.wait_for_timeout(1000); dismiss(pg)
    for cid in ['h-first','s-where','p-fstr','g-init','cpp-ptr']:
        try: solve_ui(pg,cid,120000); rec('desktop: '+cid, True)
        except Exception as e: rec('desktop: '+cid, False, str(e)[:200])
        close_ch(pg)
    pg.evaluate("__DD.PLAY.open('cpp-ptr')"); pg.wait_for_timeout(300); set_slots(pg,'cpp-ptr'); tap(pg,'[data-act=chrun]'); wait_done(pg); tap(pg,'[data-act=chkeep]'); pg.wait_for_timeout(300)
    rec('desktop: C++ memory visualizer with pointer arrow', pg.locator('.memviz').count()>0)
    pg.screenshot(path=SHOTS+'desktop-cpp-memory.png', full_page=False)
    ctx.close(); b.close()
print('\nSUMMARY', sum(1 for r in results if r[1]), '/', len(results), 'passed')
print('ERRORS', json.dumps(errs, indent=1))
