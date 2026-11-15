# v3 end-to-end: mastery drills (slam, miss path, boss exam), Your Bot (module build changes stats), v2->v3 migration, phone + desktop.
import json, sys, time
from playwright.sync_api import sync_playwright
URL='http://localhost:8765/index.html'
SHOTS='/workspace/personal-ops/dungeons-and-debuggers/screenshots/'
results=[]; errs=[]
def rec(name, ok, info=''):
    results.append((name, bool(ok), info)); print(('PASS ' if ok else 'FAIL ')+name+(' '+info if info else ''), flush=True)
def attach(pg, tag):
    pg.on('pageerror', lambda e: errs.append(tag+' PAGEERR '+str(e)))
    pg.on('console', lambda m: m.type=='error' and errs.append(tag+' CONSOLE '+m.text))
def gate(pg):
    if pg.locator('#gateBtn').is_visible(): pg.click('#gateBtn'); pg.wait_for_timeout(500)
def dismiss(pg):
    gate(pg)
    for _ in range(4):
        if pg.locator('#modal:not(.hidden)').count()==0: break
        try: pg.locator('#modal:not(.hidden) button').first.click(timeout=1000)
        except Exception: break
        pg.wait_for_timeout(200)
def tap(pg, sel): pg.locator(sel).first.click(timeout=8000)
def cur(pg, expr): return pg.evaluate("()=>{const ch=__DD.PLAY.P.ch;return "+expr+"}")
def pick_sol(pg):
    info=pg.evaluate("""()=>{const ch=__DD.PLAY.P.ch;const sol=CHD.solVals(ch);const out=[];for(const k in ch.slots){const s=ch.slots[k];if(s.n)out.push([k,'n',sol[k],__DD.PLAY.P.vals[k],s.n[2]||1]);else out.push([k,'o',s.o.indexOf(sol[k])]);}return out;}""")
    for k,kind,*rest in info:
        tap(pg, f'#cpCode [data-act=chslot][data-v="{k}"]'); pg.wait_for_timeout(80)
        if kind=='o': tap(pg, f'[data-act=chpick][data-v="{k}:{rest[0]}"]')
        else:
            target,c,step=rest; n=round((target-c)/step)
            for _ in range(abs(n)): tap(pg, f'[data-act=chstep][data-v="{k}:{1 if n>0 else -1}"]')
            tap(pg, '[data-act=chsheetx]')
        pg.wait_for_timeout(60)
def solve_open(pg, timeout=120000):
    sb=cur(pg,'ch.sb')
    if sb=='git':
        sol=cur(pg,'ch.sol'); chips=cur(pg,'ch.git.chips')
        for c in sol: tap(pg, f'[data-act=chchip][data-v="{chips.index(c)}"]'); tap(pg, '[data-act=chcmd]'); pg.wait_for_timeout(100)
    elif sb=='ai':
        sel=pg.evaluate("Object.keys(__DD.PLAY.P.sel).filter(k=>__DD.PLAY.P.sel[k])")
        for p in sel: tap(pg, f'[data-act=chpart][data-v="{p}"]')
        for p in cur(pg,'ch.sol'): tap(pg, f'[data-act=chpart][data-v="{p}"]')
        tap(pg, '[data-act=chrun]')
    else:
        pick_sol(pg); tap(pg, '[data-act=chrun]')
    pg.wait_for_selector('#cpDone:not(.hidden) .discCard', timeout=timeout)
    return pg.locator('#cpDone').inner_text()
def solve_build(pg, cid, timeout=120000):
    pg.evaluate("id=>__DD.PLAY.open(id)", cid); pg.wait_for_timeout(250)
    t=solve_open(pg, timeout); pg.evaluate("__DD.PLAY.close()"); pg.wait_for_timeout(150); return t
def run_slam(pg, miss_first=False, shot=None, timeout=120000):
    """Plays the open slam to the end through the UI. Returns summary text."""
    i=0; missed=False
    while True:
        pg.wait_for_selector('#cpTitle .drTag', timeout=10000)
        sb=cur(pg,'ch.sb')
        if shot and i==0: pg.wait_for_timeout(300); pg.screenshot(path=shot)
        if miss_first and not missed and sb not in ('git','ai'):
            tap(pg,'[data-act=chrun]'); pg.wait_for_selector('#cpHint .drMiss', timeout=timeout); missed=True
            rec('drill: a miss shows the explanation + solution only after the run', pg.locator('#cpHint .sol').count()>0)
            pg.screenshot(path=SHOTS+'phone-drill-miss.png')
        t=solve_open(pg, timeout); i+=1
        if missed and i==1 or (missed and 'Fixed' in t): pass
        if pg.locator('[data-act=chdnext]').inner_text().startswith('Finish'):
            tap(pg,'[data-act=chdnext]'); break
        tap(pg,'[data-act=chdnext]'); pg.wait_for_timeout(200)
    pg.wait_for_selector('.slamSum', timeout=10000)
    return pg.locator('.slamSum').inner_text(), missed

with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    # ---------- PHONE ----------
    ctx=b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    pg=ctx.new_page(); attach(pg,'phone'); pg.goto(URL); pg.wait_for_timeout(1500); gate(pg)
    rec('fresh: intro mentions Mastery and Your Bot', 'Mastery' in pg.locator('#modal').inner_text() and 'Your Bot' in pg.locator('#modal').inner_text())
    dismiss(pg)
    tap(pg,'[data-act=tab][data-v=learn]'); pg.wait_for_timeout(300)
    rec('mastery: empty state before any build', 'Nothing to drill yet' in pg.locator('#pages').inner_text())
    for cid in ['h-first','h-strong','j-log','j-math','j-if','j-func','c-color','p-fstr','s-select','g-stage','ai-vague']:
        try: solve_build(pg,cid); rec('build '+cid, True)
        except Exception as e: rec('build '+cid, False, str(e)[:160])
    pg.evaluate("__DD.render()")
    opened=pg.evaluate("__DD.G.conceptsOpen().length"); rec('concepts unlocked by builds', opened>=10, str(opened))
    tap(pg,'[data-act=tab][data-v=learn]'); pg.wait_for_timeout(300)
    pg.screenshot(path=SHOTS+'phone-mastery.png')
    tap(pg,'[data-act=msslam][data-v="6"]'); pg.wait_for_timeout(400)
    rec('drill view: tag only (no story, no hint button, goals hidden)', pg.locator('#cpStory .cpStory, #cpStory .cpExplore').count()==0 and pg.locator('[data-act=chhint]').count()==0 and pg.locator('#cpGoals .goal').count()==0)
    try:
        summ, missed=run_slam(pg, miss_first=True, shot=SHOTS+'phone-drill.png')
        st=pg.evaluate("({slams:__DD.G.S.stats.slams, drills:__DD.G.S.stats.drills, ok:__DD.G.S.stats.drillOk, m:Object.keys(__DD.G.S.mastery).length})")
        rec('slam session completed (6 drills, summary shown)', st['slams']==1 and st['drills']==6, json.dumps(st))
        rec('slam: the missed drill counted as not unaided', missed and st['ok']==5, summ[:90].replace('\n',' '))
        pg.screenshot(path=SHOTS+'phone-slam-summary.png')
    except Exception as e: rec('slam session', False, str(e)[:300])
    tap(pg,'[data-act=msclose]'); pg.wait_for_timeout(200)
    # practice js.func to Practiced through 'Drill' button (3 variants)
    pg.evaluate("__DD.render()"); tap(pg,'[data-act=tab][data-v=learn]'); pg.wait_for_timeout(200)
    pg.locator('[data-act=msone][data-v="js.func"]').scroll_into_view_if_needed(); tap(pg,'[data-act=msone][data-v="js.func"]')
    run_slam(pg); tap(pg,'[data-act=msclose]')
    lvl=pg.evaluate("__DD.G.mLevel(__DD.G.DRL.byId['js.func'])"); rec('concept js.func reaches Practiced via drills', lvl>=2, str(lvl))
    # ---------- Your Bot ----------
    tap(pg,'[data-act=tab][data-v=work]'); pg.wait_for_timeout(300)
    s0=pg.evaluate("(()=>{const s=__DD.G.botStats();return {succ:s.success, parse:s.err.parse, cph:s.coinsPerHr}})()")
    pg.evaluate("()=>{const B=__DD.G.S.bot;B.errs={};B.recent=[];B.ok=0;B.fail=0;__DD.G.tick(3600e3,false);}")
    meas0=pg.evaluate("(()=>{const B=__DD.G.S.bot;return {n:B.ok+B.fail, fail:B.fail/(B.ok+B.fail), parse:(B.errs.parse||0)}})()")
    tap(pg,'[data-act=sub][data-v="1"]'); pg.wait_for_timeout(400)
    rec('bot modules page lists categories + lock reasons', 'train it' in pg.locator('#pages').inner_text().lower() and pg.locator('.lockWhy').count()>5)
    pg.locator('.botMod[data-v="bm-parse"]').scroll_into_view_if_needed(); tap(pg,'.botMod[data-v="bm-parse"]'); pg.wait_for_timeout(300)
    try:
        t=solve_open(pg); rec('bot module bm-parse built (win card shows stat delta)', 'Module installed' in t and '→' in t, t[t.find('Module'):t.find('Module')+120].replace('\n',' '))
    except Exception as e: rec('bot module bm-parse', False, str(e)[:200])
    pg.evaluate("__DD.PLAY.close()")
    s1=pg.evaluate("(()=>{const s=__DD.G.botStats();return {succ:s.success, parse:s.err.parse, cph:s.coinsPerHr}})()")
    pg.evaluate("()=>{const B=__DD.G.S.bot;B.errs={};B.recent=[];B.ok=0;B.fail=0;__DD.G.tick(3600e3,false);}")
    meas1=pg.evaluate("(()=>{const B=__DD.G.S.bot;return {n:B.ok+B.fail, fail:B.fail/(B.ok+B.fail), parse:(B.errs.parse||0)}})()")
    rec('bot stats change after building the parser (expected)', s1['succ']>s0['succ'] and s1['parse']<s0['parse'] and s1['cph']>s0['cph'], f"success {s0['succ']:.2f}->{s1['succ']:.2f}, parse err {s0['parse']}->{s1['parse']}, coins/hr {s0['cph']}->{s1['cph']}")
    rec('bot stats change after building the parser (measured, simulated hour)', meas1['fail']<meas0['fail'], f"failure rate {meas0['fail']:.2f}->{meas1['fail']:.2f}; parse errors {meas0['parse']}->{meas1['parse']} in {meas1['n']} tasks")
    tap(pg,'[data-act=tab][data-v=work]'); pg.wait_for_timeout(200); tap(pg,'[data-act=sub][data-v="0"]'); pg.wait_for_timeout(300)
    # get a failing task into the animation for the screenshot
    pg.evaluate("()=>{const B=__DD.G.S.bot;B.feed.push({id:'T-'+(++B.seq),ty:'email',err:'context',t:Date.now()});}")
    pg.wait_for_timeout(300); pg.evaluate("__DD.render()"); pg.wait_for_timeout(1600)
    rec('pipeline animates and shows a failing stage in red', pg.locator('#botPipe .stg.fail').count()==1 and pg.locator('#botPipe .stg.ok').count()>=1)
    pg.screenshot(path=SHOTS+'phone-bot-pipeline.png')
    rec('bot home: feed + stats rendered', pg.locator('.feedRow').count()>=3 and 'tasks / hr' in pg.locator('#pages').inner_text().lower())
    tap(pg,'[data-act=sub][data-v="2"]'); pg.wait_for_timeout(300)
    rec('errors page: error-type bars', pg.locator('.errBar').count()>=2)
    # ---------- mastery boss exam ----------
    pg.evaluate("""()=>{const G=__DD.G,S=G.S;G.tierChallenges(1).slice(0,Math.ceil(G.tierChallenges(1).length*0.75)).forEach(c=>{S.ch[c.id]=Object.assign(S.ch[c.id]||{},{solved:Date.now(),runs:1,hintLv:0})});
      const b=G.tierStatus(1).bossCh; S.ch[b.id]={solved:Date.now(),runs:1,hintLv:0};
      G.tierConcepts(1).filter(G.conceptUnlocked).slice(0,G.tierStatus(1).mNeed).forEach(g=>{S.mastery[g.id]=Object.assign({b:2,due:Date.now()+9e6,ok:2,miss:0,n:2,days:['x'],vars:['a','b'],streak:2},S.mastery[g.id]&&{})}); G.save(); __DD.render();}""")
    ts=pg.evaluate("__DD.G.tierStatus(1)"); rec('boss gate opens with 50% concepts Practiced', ts['ready'] and ts['bossChDone'], f"{ts['mPr']}/{ts['mNeed']}")
    tap(pg,'[data-act=tab][data-v=build]'); pg.wait_for_timeout(300)
    pg.locator('[data-act=msboss]').scroll_into_view_if_needed(); tap(pg,'[data-act=msboss]')
    try:
        summ,_=run_slam(pg); rec('mastery boss exam (8 drills) won → tier 1', pg.evaluate("__DD.G.S.tier")==1 and 'defeated' in summ, summ[:60].replace('\n',' '))
    except Exception as e: rec('mastery boss exam', False, str(e)[:300])
    tap(pg,'[data-act=msclose]')
    n=pg.evaluate("Object.keys(__DD.G.S.mastery).length"); pg.reload(); pg.wait_for_timeout(1500); dismiss(pg)
    rec('mastery + bot persist across reload', pg.evaluate("Object.keys(__DD.G.S.mastery).length")==n and pg.evaluate("__DD.G.chSolved('bm-parse')"))
    ctx.close()
    # ---------- v2 -> v3 migration ----------
    ctx=b.new_context(viewport={'width':390,'height':844}); pg=ctx.new_page(); pg.goto(URL); pg.wait_for_timeout(900)
    v2=pg.evaluate("()=>{const s=JSON.parse(JSON.stringify(__DD.G.S));s.v=2;delete s.mastery;delete s.bot;delete s.seenV3;s.seenIntro=true;s.seenV2=true;s.xp=4321;s.coins=999;s.ch={'h-first':{solved:Date.now(),runs:2,hintLv:0},'j-func':{solved:Date.now(),runs:1,hintLv:0}};s.work={tickets:[{id:'T-1',track:'code',name:'x',L:1,work:10,done:3,coins:5}]};return JSON.stringify(s);}")
    ctx.close()
    ctx=b.new_context(viewport={'width':390,'height':844}); ctx.add_init_script("if(!sessionStorage.getItem('seeded')){localStorage.setItem('dnd-dev-save-v1', %s); sessionStorage.setItem('seeded','1');}" % json.dumps(v2))
    pg=ctx.new_page(); attach(pg,'migrate'); pg.goto(URL); pg.wait_for_timeout(1300); gate(pg)
    body=pg.locator('#modal').inner_text()
    ok=pg.evaluate("__DD.G.S.v===3 && __DD.G.S.coins>=999 && __DD.G.S.xp===4321 && __DD.G.chSolved('h-first') && typeof __DD.G.S.mastery==='object' && Array.isArray(__DD.G.S.bot.feed) && __DD.G.conceptsOpen().length===2")
    rec('v2 save migrates to v3 (announce modal, builds kept, concepts open)', ok and 'Mastery drills' in body, body[:80].replace('\n',' '))
    pg.screenshot(path=SHOTS+'phone-v3-upgrade-notice.png'); ctx.close()
    # ---------- DESKTOP ----------
    ctx=b.new_context(viewport={'width':1366,'height':900}); pg=ctx.new_page(); attach(pg,'desktop'); pg.goto(URL); pg.wait_for_timeout(1200); dismiss(pg)
    for cid in ['h-first','c-color','j-if','s-select','g-stage','cpp-div','at-ts']:
        try: solve_build(pg,cid); rec('desktop build '+cid, True)
        except Exception as e: rec('desktop build '+cid, False, str(e)[:160])
    pg.evaluate("__DD.render()"); tap(pg,'[data-act=tab][data-v=learn]'); pg.wait_for_timeout(300)
    tap(pg,'[data-act=msslam][data-v="6"]')
    try: summ,_=run_slam(pg, shot=SHOTS+'desktop-drill.png'); rec('desktop: slam completed', 'Slam' in summ or 'slam' in summ)
    except Exception as e: rec('desktop slam', False, str(e)[:300])
    tap(pg,'[data-act=msclose]'); tap(pg,'[data-act=tab][data-v=work]'); pg.evaluate("__DD.G.tick(600e3,false)"); pg.wait_for_timeout(1200)
    pg.screenshot(path=SHOTS+'desktop-bot.png'); rec('desktop: bot page', pg.locator('#botPipe').count()==1)
    ctx.close(); b.close()
print('\nSUMMARY', sum(1 for r in results if r[1]), '/', len(results), 'passed')
print('ERRORS', json.dumps(errs, indent=1))
