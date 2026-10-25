import puppeteer from 'puppeteer-core';
import { readFile, writeFile } from 'node:fs/promises';

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, pipe: true, args: ['--no-sandbox', '--disable-gpu', '--no-first-run', '--disable-extensions'], timeout: 20000 });
const checks = [];
const errors = [];
const check = (name, passed, detail) => { checks.push({ name, passed, detail }); console.log(`${passed ? 'PASS' : 'FAIL'}: ${name}${detail ? ` ${JSON.stringify(detail)}` : ''}`); };
try {
  const page = await browser.newPage();
  const leaflet = await readFile('frontend/node_modules/leaflet/dist/leaflet.js', 'utf8');
  let failMapScript = false;
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.url().includes('/leaflet.js')) {
      if (failMapScript) req.abort();
      else req.respond({ status: 200, contentType: 'application/javascript', body: leaflet });
    } else req.continue();
  });
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  check('Root URL opens the map first', Boolean(await page.$('.map-workspace')) && !await page.$('.landing-intro'));
  await page.goto('http://127.0.0.1:5173/home', { waitUntil: 'networkidle2' });
  check('Previous homepage remains available at /home', Boolean(await page.$('.landing-intro')) && !await page.$('.map-workspace'));
  await Promise.all([page.waitForNavigation(), page.click('.hero-actions .primary')]);
  check('Open the map navigates to root URL', new URL(page.url()).pathname === '/');
  await page.waitForSelector('.map-pin', { timeout: 20000 });
  check('Planner fills desktop window below header', await page.$eval('.map-workspace', el => Math.abs(el.getBoundingClientRect().bottom - innerHeight) < 2));
  check('Planner has its own heading and no landing sections', await page.evaluate(() => document.querySelectorAll('h1').length === 1 && !document.querySelector('.landing-intro, .site-footer')));
  await page.click('[aria-label="Zoom in"]');
  await page.click('[aria-label="Zoom out"]');
  await page.click('[aria-label="Reset map view"]');
  check('Map zoom and recenter controls operate', await page.$eval('[aria-label="Reset map view"]', el => !el.disabled));
  await page.screenshot({ path: '.hallmark/shots/map-page-desktop.png' });
  for (let i = 0; i < 5; i++) {
    const rows = await page.$$('.map-destination-row');
    await rows[i].click();
    check(`Destination ${i + 1} selects route and updates URL`, await rows[i].evaluate(el => el.getAttribute('aria-pressed') === 'true') && new URL(page.url()).searchParams.has('destination'));
  }
  await page.reload({ waitUntil: 'networkidle2' });
  check('Selected destination survives reload', await page.$eval('.route-destination', el => el.textContent.includes('Sample Event Hall')));
  await page.click('.reset-button');
  check('Reset clears route and URL selection', Boolean(await page.$('.empty-route')) && !new URL(page.url()).searchParams.has('destination'));
  await page.click('#destination');
  await page.type('#destination', 'Library');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  check('Keyboard search selects a destination', await page.$eval('.route-destination', el => el.textContent.includes('Library')));
  await page.click('.search-tabs button:nth-child(2)');
  await page.click('.map-destination-row');
  check('Office route includes floor and floor plan link', await page.$eval('.route-office a', el => el.getAttribute('href') === '/home?office=o1#offices'));
  await Promise.all([page.waitForNavigation(), page.click('.route-office a')]);
  check('Floor plan link opens corresponding homepage office', await page.$eval('#office-select', el => el.value === 'o1'));
  await page.select('#office-select', 'o4');
  await Promise.all([page.waitForNavigation(), page.click('.office-example .text-button')]);
  check('Homepage office action redirects with selected office', await page.$eval('.route-office', el => el.textContent.includes('Floor 3')));
  for (const mode of ['light', 'dark']) {
    if (await page.$eval('html', el => el.dataset.theme) !== mode) await page.click(`button[aria-label="Switch to ${mode} theme"]`);
    for (const width of [320, 375, 700, 768, 900, 1024, 1440]) {
      await page.setViewport({ width, height: 900 });
      await new Promise(r => setTimeout(r, 120));
      const layout = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth, sidebar: document.querySelector('.map-sidebar').getBoundingClientRect().width, canvas: document.querySelector('.map-canvas').getBoundingClientRect().height }));
      check(`${mode} layout at ${width}px`, layout.width <= width && layout.canvas >= 400 && layout.sidebar <= width, layout);
    }
    const contrast = await page.evaluate(() => {
      const rgb = s => s.match(/[\d.]+/g)?.slice(0, 3).map(Number);
      const lum = c => c.map(v => (v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0);
      const issues = [];
      for (const el of document.querySelectorAll('h1,p,small,label,button,a,span,strong')) {
        const style = getComputedStyle(el), rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height || el.closest('.leaflet-pane') || el.disabled || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        let parent = el, bg;
        while (parent) { const c = getComputedStyle(parent).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') { bg = rgb(c); break; } parent = parent.parentElement; }
        if (!bg) continue;
        const fg = rgb(style.color);
        const ratio = (Math.max(lum(fg), lum(bg)) + .05) / (Math.min(lum(fg), lum(bg)) + .05);
        const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
        if (ratio < (large ? 3 : 4.5)) issues.push({ text: el.textContent.trim().slice(0, 40), ratio });
      }
      return issues;
    });
    check(`${mode} text contrast`, !contrast.length, contrast);
  }
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 200));
  check('Mobile route details leave zoom controls reachable', await page.evaluate(() => {
    const controls = document.querySelector('.map-controls').getBoundingClientRect();
    const sheet = document.querySelector('.route-sheet').getBoundingClientRect();
    return controls.bottom <= sheet.top;
  }));
  await page.click('.sheet-handle');
  check('Mobile route details collapse', await page.$eval('.route-sheet-content', el => el.hidden));
  await page.click('.sheet-handle');
  await page.screenshot({ path: '.hallmark/shots/map-page-mobile.png', fullPage: true });
  await page.click('#menu-toggle');
  check('Mobile navigation opens', await page.$eval('#menu-toggle', el => el.getAttribute('aria-expanded') === 'true'));
  await page.focus('.main-nav a');
  await page.keyboard.press('Escape');
  check('Escape closes mobile navigation', await page.$eval('#menu-toggle', el => el.getAttribute('aria-expanded') === 'false'));
  await page.goto('http://127.0.0.1:5173/home', { waitUntil: 'networkidle2' });
  await Promise.all([page.waitForNavigation(), page.click('.hero-actions .secondary')]);
  check('Homepage office search opens filtered map', await page.$eval('.search-tabs button:nth-child(2)', el => el.getAttribute('aria-pressed') === 'true'));
  failMapScript = true;
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForFunction(() => document.querySelector('.map-status')?.textContent.includes('Map unavailable'));
  await page.click('.map-destination-row');
  check('Map failure preserves text route selection', Boolean(await page.$('.route-office')));
  check('No runtime errors', !errors.length, errors);
} finally {
  await writeFile('.hallmark/map-page-checks.json', JSON.stringify(checks, null, 2));
  await browser.close();
}
if (checks.some(c => !c.passed)) process.exitCode = 1;
