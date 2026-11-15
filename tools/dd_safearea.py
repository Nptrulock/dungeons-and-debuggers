# Safe-area + truncation check at 390x844 and 430x932 with simulated iPhone insets (?simsafe sets top 59px / bottom 34px).
import json
from playwright.sync_api import sync_playwright
BASE = __import__('sys').argv[1] if len(__import__('sys').argv) > 1 else 'http://localhost:8765/index.html'
SHOTS = '/workspace/personal-ops/dungeons-and-debuggers/screenshots/'
res = []; errs = []
def rec(n, ok, info=''): res.append(bool(ok)); print(('PASS ' if ok else 'FAIL ') + n + (' ' + info if info else ''), flush=True)
TRUNC = """()=>{const out=[];document.querySelectorAll('#overlay *, #top *, #modal *, #pages *').forEach(e=>{const cs=getComputedStyle(e);if(cs.display==='none'||!e.offsetParent&&cs.position!=='fixed')return;
 const clip=(cs.textOverflow==='ellipsis'&&e.scrollWidth>e.clientWidth+1)||(cs.webkitLineClamp&&cs.webkitLineClamp!=='none'&&e.scrollHeight>e.clientHeight+2);if(clip)out.push((e.className||e.tagName)+': '+e.textContent.slice(0,50));});return out;}"""
def top_of(pg, sel): return pg.evaluate("s=>{const e=document.querySelector(s);return e?e.getBoundingClientRect().top:-1}", sel)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    for W, H in [(390, 844), (430, 932)]:
        ctx = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, is_mobile=True, has_touch=True)
        pg = ctx.new_page(); tag = f'{W}x{H}'
        pg.on('pageerror', lambda e: errs.append(tag + ' ' + str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(tag + ' ' + m.text))
        pg.goto(BASE + '?simsafe'); pg.wait_for_timeout(1300); pg.click('#gateBtn'); pg.wait_for_timeout(300)
        rec(f'{tag} modal clear of the status bar', pg.evaluate("document.querySelector('#modal .mbox').getBoundingClientRect().top") >= 59)
        pg.evaluate("UIX.closeModal()")
        rec(f'{tag} main header below the 59px inset', top_of(pg, '#top .hrow') >= 59, str(top_of(pg, '#top .hrow')))
        rec(f'{tag} bottom nav above the 34px home indicator', pg.evaluate("innerHeight-document.querySelector('#tabs .tab').getBoundingClientRect().bottom") >= 34)
        for t in ['build', 'learn', 'work', 'upg', 'codex']:
            pg.click(f'[data-act=tab][data-v={t}]'); pg.wait_for_timeout(250)
            tr = pg.evaluate(TRUNC); rec(f'{tag} {t} tab: no truncated text', not tr, '; '.join(tr[:3]))
        # drill with the long landmark tag
        pg.evaluate("()=>{const S=__DD.G.S;S.ch['h-semantic']={solved:Date.now(),runs:1,hintLv:0};}")
        tagtxt = pg.evaluate("()=>{let ch;for(let s=0;s<200;s++){ch=DRILLS.make('html.semantic',s);if(ch.title.length>50)break;}window.__ch=ch;return ch.title}")
        pg.evaluate("__DD.PLAY.open(window.__ch,{label:'🎯 Slam 1/6',combo:0})"); pg.wait_for_timeout(600)
        rec(f'{tag} drill meta line below the inset', top_of(pg, '#cpTitle') >= 59, str(top_of(pg, '#cpTitle')))
        full = pg.evaluate("(()=>{const e=document.querySelector('#cpTitle b');return e.scrollHeight<=e.clientHeight+2 && e.textContent})()")
        rec(f'{tag} drill tag shown in full (wraps, no ellipsis)', full == tagtxt, tagtxt)
        rec(f'{tag} long task also shown as a readable block', tagtxt in pg.locator('#cpStory .cpTask').inner_text())
        tr = pg.evaluate(TRUNC); rec(f'{tag} drill: no truncated text', not tr, '; '.join(tr[:3]))
        pg.screenshot(path=SHOTS + ('phone-drill-fixed.png' if W == 390 else 'phone-drill-fixed-430.png'))
        # miss + done card
        pg.click('[data-act=chrun]'); pg.wait_for_timeout(900); pg.click('[data-act=chdgive]'); pg.wait_for_timeout(400)
        rec(f'{tag} drill result card clear of the inset', pg.evaluate("document.querySelector('#cpDone .discCard').getBoundingClientRect().top") >= 59)
        pg.evaluate("__DD.PLAY.release(); document.querySelector('#overlay').classList.add('hidden')")
        # build challenges: longest titles, boss, bot module
        ids = pg.evaluate("CHD.list.filter(c=>!c.bot&&!c.boss).sort((a,b)=>b.title.length-a.title.length).slice(0,3).map(c=>c.id).concat(['boss-1','boss-3','bm-perms','bm-confusion'])")
        for cid in ids:
            pg.evaluate("id=>__DD.PLAY.open(id)", cid); pg.wait_for_timeout(350)
            tr = pg.evaluate(TRUNC); t0 = top_of(pg, '#cpTitle')
            rec(f'{tag} {cid}: title full + below inset', not tr and t0 >= 59, ('; '.join(tr[:2])) + f' top={t0}')
            if cid == 'boss-1' and W == 390: pg.screenshot(path=SHOTS + 'phone-boss-fixed.png')
            pg.evaluate("__DD.PLAY.close()"); pg.wait_for_timeout(150)
        ctx.close()
    b.close()
print('\nSUMMARY', sum(res), '/', len(res)); print('ERRORS', json.dumps(errs))
