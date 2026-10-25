import puppeteer from 'puppeteer-core';
import { readFile, writeFile } from 'node:fs/promises';

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, pipe: true, args: ['--no-sandbox', '--disable-gpu', '--no-first-run', '--disable-extensions'], timeout: 20000 });
const checks = [], errors = [];
const check = (name, passed) => { checks.push({ name, passed }); console.log(`${passed ? 'PASS' : 'FAIL'}: ${name}`); };
try {
  const page = await browser.newPage();
  const leaflet = await readFile('frontend/node_modules/leaflet/dist/leaflet.js', 'utf8');
  let failMapScript = false;
  await page.setRequestInterception(true);
  page.on('request', req => req.url().includes('/leaflet.js') ? (failMapScript ? req.abort() : req.respond({ status: 200, contentType: 'application/javascript', body: leaflet })) : req.continue());
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.map-pin');
  check('First page shows map without destination sidebar or attribution label', await page.evaluate(() => Boolean(document.querySelector('.map-canvas')) && !document.querySelector('.map-sidebar, .leaflet-control-attribution') && !document.body.textContent.includes('Where are you headed?')));
  for (let i = 0; i < 5; i++) {
    await page.focus('.map-pin');
    const pins = await page.$$('.map-pin');
    await pins[i].focus();
    await page.keyboard.press('Enter');
    check(`Marker ${i + 1} selects route with keyboard`, await page.$eval('.route-destination', el => el.textContent.length > 15) && new URL(page.url()).searchParams.get('destination') === String.fromCharCode(97 + i));
  }
  await page.reload({ waitUntil: 'networkidle2' });
  check('Selected route survives reload', await page.$eval('.route-destination', el => el.textContent.includes('Sample Event Hall')));
  await page.click('.reset-button');
  check('Reset provides updated empty route guidance', await page.$eval('.empty-route', el => el.textContent.includes('map marker')));
  for (const mode of ['light', 'dark']) {
    if (await page.$eval('html', el => el.dataset.theme) !== mode) await page.click(`button[aria-label="Switch to ${mode} theme"]`);
    for (const width of [320, 375, 768, 900, 1440]) {
      await page.setViewport({ width, height: 900 });
      const pass = await page.evaluate(() => {
        const canvas = document.querySelector('.map-canvas').getBoundingClientRect();
        const sheet = document.querySelector('.route-sheet').getBoundingClientRect();
        return document.documentElement.scrollWidth <= innerWidth && canvas.left === 0 && canvas.width === innerWidth && canvas.height >= 560 && sheet.left < 25 && sheet.right <= innerWidth;
      });
      check(`${mode} map uses freed space at ${width}px`, pass);
    }
  }
  await page.setViewport({ width: 375, height: 812 });
  await page.click('#menu-toggle');
  check('Top navigation remains accessible', await page.$eval('.site-header', el => el.getBoundingClientRect().top === 0) && await page.$eval('.main-nav', el => getComputedStyle(el).display === 'flex'));
  await Promise.all([page.waitForNavigation(), page.click('.main-nav a[href="/home#offices"]')]);
  await page.select('#office-select', 'o4');
  await Promise.all([page.waitForNavigation(), page.click('.office-example .text-button')]);
  check('Office lookup still selects the correct map route', await page.$eval('.route-office', el => el.textContent.includes('Floor 3')));
  await page.click('.sheet-handle');
  check('Route panel collapses', await page.$eval('.route-sheet-content', el => el.hidden));
  await page.click('.sheet-handle');
  await page.screenshot({ path: '.hallmark/shots/map-page-mobile.png', fullPage: true });
  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({ path: '.hallmark/shots/map-page-desktop.png' });
  failMapScript = true;
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForFunction(() => document.querySelector('.map-status')?.textContent.includes('Map unavailable'));
  check('Map failure points to available navigation', await page.$eval('.map-status', el => el.textContent.includes('Office lookup')));
  check('No runtime errors', !errors.length);
} finally {
  await writeFile('.hallmark/map-page-checks.json', JSON.stringify({ checks, errors, note: 'CDN script request supplied from installed Leaflet; live map tiles not verified.' }, null, 2));
  await browser.close();
}
if (checks.some(c => !c.passed)) process.exitCode = 1;
