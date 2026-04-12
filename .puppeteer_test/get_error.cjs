const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('pageerror', error => {
        console.log('--- BROWSER PAGE ERROR ---');
        console.log(error.stack || error.message);
    });
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('--- BROWSER CONSOLE ERROR ---');
            console.log(msg.text());
        }
    });
    try {
        await page.goto('http://localhost:5175/work/solve-24', { waitUntil: 'networkidle0', timeout: 10000 });
        await new Promise(r => setTimeout(r, 2000));
    } catch(e) {
        console.log('--- NAVIGATION TIMEOUT / ERROR ---', e.message);
    }
    await browser.close();
})();
