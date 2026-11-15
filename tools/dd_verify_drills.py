import json, sys, asyncio
from playwright.async_api import async_playwright
N = int(sys.argv[1]) if len(sys.argv) > 1 else 12
FILTER = sys.argv[2].split(',') if len(sys.argv) > 2 and sys.argv[2] else None
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 390, 'height': 844})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:8765/tools/verify.html')
        res = await pg.evaluate('([n, f]) => verifyDrills(n, f)', [N, FILTER])
        tot = sum(r['n'] for r in res); ok = sum(r['ok'] for r in res)
        print(f"{len(res)} generators, {ok}/{tot} variants ok, distinct variants: {sum(r['distinct'] for r in res)}")
        for r in res:
            if r['ok'] != r['n']: print(json.dumps(r)[:1800])
        json.dump(res, open('/tmp/drill_verify.json', 'w'))
        if errs: print('PAGE ERRORS', errs[:5])
        await b.close()
asyncio.run(main())
