const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => {}); // quiet

    const urls = ['http://localhost:5175/sounds', 'http://localhost:5175/stage', 'http://localhost:5175/screens'];
    
    for (const url of urls) {
        try {
            console.log(`Testing: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
            await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4.7.0/axe.min.js' });
            
            const results = await page.evaluate(async () => {
                const results = await axe.run();
                return results.violations
                    .filter(v => ['color-contrast'].includes(v.id))
                    .map(v => ({
                        html: v.nodes[0]?.html,
                        summary: v.nodes[0]?.failureSummary.split('\n')[1].trim()
                    }));
            });
            
            if(results.length > 0) {
                console.log('Violations found:', results);
            } else {
                console.log('Pass!');
            }
        } catch(e) {
            console.error('Error:', e.message);
        }
        console.log('---');
    }
    await browser.close();
})();
