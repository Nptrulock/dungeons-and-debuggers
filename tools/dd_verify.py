import json, sys, asyncio
from playwright.async_api import async_playwright
FILTER = sys.argv[1].split(',') if len(sys.argv) > 1 and sys.argv[1] else None
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:8765/tools/verify.html')
        res = await pg.evaluate('(f) => verify(f)', FILTER)
        bad = [r for r in res if not r['ok']]
        print(f"{len(res) - len(bad)}/{len(res)} ok")
        for r in bad: print(json.dumps(r)[:1500])
        if errs: print('PAGE ERRORS', errs[:5])
        await b.close()
asyncio.run(main())
