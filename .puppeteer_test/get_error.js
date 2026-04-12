const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('pageerror', error => {
        console.log('--- BROWSER PAGE ERROR ---');
        console.log(error.message);
    });
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('--- BROWSER CONSOLE ERROR ---');
            console.log(msg.text());
        }
    });
    try {
        await page.goto('http://localhost:5175/work/solve-24', { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
    } catch(e) {
        console.log('--- NAVIGATION ERROR ---', e);
    }
    await browser.close();
})();
