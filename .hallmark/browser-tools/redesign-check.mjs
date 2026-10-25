import puppeteer from 'puppeteer-core';
import { writeFile } from 'node:fs/promises';

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, pipe: true });
const checks = [];
const errors = [];
const check = (name, pass, details) => {
  checks.push({ name, passed: Boolean(pass), ...(details ? { details } : {}) });
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${name}${!pass && details ? ` ${JSON.stringify(details)}` : ''}`);
};
const pause = () => new Promise(resolve => setTimeout(resolve, 300));
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.map-pin', { timeout: 15000 });
  check('Map has a separate large section outside the introduction', await page.evaluate(() => Boolean(document.querySelector('#try-it .map-workspace')) && !document.querySelector('.landing-intro .map-canvas') && document.querySelector('.map-workspace').getBoundingClientRect().height >= 740));
  await (await page.$('.map-workspace')).screenshot({ path: '.hallmark/shots/map-section-desktop.png' });
  for (let i = 0; i < 5; i++) {
    const rows = await page.$$('.map-destination-row');
    await rows[i].click();
    check(`Floating destination list item ${i + 1} updates the route`, await rows[i].evaluate(el => el.getAttribute('aria-pressed') === 'true'));
  }
  check('System light theme follows OS preference', await page.$eval('html', el => el.dataset.theme === 'light'));
  check('Semantic page: one h1, labelled controls, real anchor targets', await page.evaluate(() => document.querySelectorAll('h1').length === 1 && [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.hash.slice(1))) && [...document.querySelectorAll('input, select')].every(e => e.getAttribute('aria-label') || document.querySelector(`label[for="${e.id}"]`))));
  for (const width of [320, 360, 375, 414, 560, 640, 768, 800, 1024, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 900 });
    await pause();
    const overflow = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth, offenders: [...document.querySelectorAll('main h1, main h2, main h3, button, input, select')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.left < -1 || r.right > innerWidth + 1); }).map(e => e.outerHTML.slice(0, 100)) }));
    check(`Responsive layout at ${width}px`, overflow.page <= width && !overflow.offenders.length, overflow);
  }
  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluate(() => scrollTo(0, 0));
  check('Headline, sentence and primary action fit 1280x800', await page.$eval('.hero-actions', el => el.getBoundingClientRect().bottom <= 800));
  await page.screenshot({ path: '.hallmark/shots/redesign-light-desktop.png', fullPage: true });
  for (const mode of ['light', 'dark']) {
    if (await page.$eval('html', el => el.dataset.theme) !== mode) await page.click(`button[aria-label="Switch to ${mode} theme"]`);
    check(`${mode}: theme toggle updates the root`, await page.$eval('html', (el, expected) => el.dataset.theme === expected, mode));
    await page.click('.hero-actions .secondary');
    check(`${mode}: Find an office focuses filtered search`, await page.evaluate(() => document.activeElement.id === 'destination' && document.querySelector('#destination').getAttribute('aria-expanded') === 'true' && document.querySelectorAll('.suggestions li').length === 4));
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    check(`${mode}: keyboard selection updates route and office details`, await page.evaluate(() => document.querySelector('.route-office').textContent.includes('Floor 2') && document.querySelector('.office-example-title').textContent.includes('Sample Admissions Office')));
    await page.click('.reset-button');
    check(`${mode}: reset clears route and search`, await page.evaluate(() => Boolean(document.querySelector('.empty-route')) && document.querySelector('#destination').value === ''));
    await page.click('#destination');
    await page.type('#destination', 'zzzzzz');
    check(`${mode}: empty search gives a recovery hint`, await page.$eval('.suggestions', el => el.textContent.includes('No sample places found')));
    await page.keyboard.press('Escape');
    check(`${mode}: Escape closes autocomplete`, await page.$eval('#destination', el => el.getAttribute('aria-expanded') === 'false'));
    await page.click('[aria-label="Clear search and sample route"]');
    await page.click('.search-tabs button:first-child');
    for (let i = 0; i < 3; i++) {
      const buttons = await page.$$('.quick-destinations button');
      await buttons[i].click();
      check(`${mode}: quick destination ${i + 1} selects a sample route`, await page.$eval('.route-sheet-content', el => el.textContent.includes('Sample distance')));
    }
    await page.click('[aria-label="Reset map view"]');
    await pause();
    for (let i = 0; i < 5; i++) {
      const pins = await page.$$('.map-pin');
      await pins[i].focus();
      await page.keyboard.press('Enter');
      check(`${mode}: map marker ${i + 1} works from keyboard`, await page.evaluate(index => { const pins = [...document.querySelectorAll('.campus-marker')]; return pins[index].classList.contains('is-selected'); }, i));
    }
    for (let i = 0; i < 3; i++) { await page.click('[aria-label="Zoom in"]'); await pause(); }
    check(`${mode}: zoom reaches maximum and disables plus`, await page.$eval('[aria-label="Zoom in"]', el => el.disabled));
    for (let i = 0; i < 3; i++) { await page.click('[aria-label="Zoom out"]'); await pause(); }
    check(`${mode}: zoom reaches minimum and disables minus`, await page.$eval('[aria-label="Zoom out"]', el => el.disabled));
    await page.click('[aria-label="Reset map view"]');
    for (const id of ['o1', 'o2', 'o3', 'o4']) {
      await page.select('#office-select', id);
      check(`${mode}: office ${id} updates floor plan and route`, await page.evaluate(() => { const name = document.querySelector('#office-select option:checked').textContent; return document.querySelector('.office-example-title').textContent.includes(name) && document.querySelector('.route-office').textContent.includes('Floor'); }));
    }
    await page.click('.office-example .text-button');
    check(`${mode}: office route action focuses map result`, await page.evaluate(() => document.activeElement.classList.contains('hero-map')));
    for (const event of ['Presentation', 'Study group', 'Student gathering']) {
      await page.select('#event-type', event);
      check(`${mode}: venue choice ${event} updates recommendation`, await page.$eval('.venue-result', (el, eventType) => el.textContent.includes(eventType === 'Study group' ? 'Sample Library' : 'Sample Event Hall'), event));
    }
    await page.click('#venues .text-button');
    check(`${mode}: venue location draws the selected sample route`, await page.$eval('.route-destination', el => el.textContent.includes('Sample Event Hall')));
    await page.click('#canteens .text-button');
    check(`${mode}: canteen location draws sample route`, await page.$eval('.route-destination', el => el.textContent.includes('Sample Canteen')));
    const contrast = await page.evaluate(() => {
      const rgb = value => value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
      const lum = c => c.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0);
      const issues = [];
      for (const el of document.querySelectorAll('h1,h2,h3,p,small,label,button,a,select,dt,dd,figcaption,li,span,strong')) {
        const style = getComputedStyle(el), rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height || el.closest('.leaflet-pane, .suggestions[hidden]') || style.opacity < 1 || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        let parent = el, bg;
        while (parent) { const value = getComputedStyle(parent).backgroundColor; if (value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') { bg = rgb(value); break; } parent = parent.parentElement; }
        if (!bg) continue;
        const fg = rgb(style.color); if (!fg) continue;
        const ratio = (Math.max(lum(fg), lum(bg)) + .05) / (Math.min(lum(fg), lum(bg)) + .05);
        const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
        if (ratio < (large ? 3 : 4.5)) issues.push({ text: el.textContent.trim().slice(0, 50), ratio });
      }
      return issues;
    });
    check(`${mode}: all rendered interface text passes WCAG AA contrast`, !contrast.length, contrast);
  }
  await page.setViewport({ width: 375, height: 812 });
  await (await page.$('.map-workspace')).screenshot({ path: '.hallmark/shots/map-section-mobile.png' });
  await page.evaluate(() => scrollTo(0, 0));
  await page.click('#menu-toggle');
  check('Mobile menu opens', await page.$eval('#menu-toggle', el => el.getAttribute('aria-expanded') === 'true'));
  await page.focus('.main-nav a');
  await page.keyboard.press('Escape');
  check('Escape closes mobile menu and restores focus', await page.evaluate(() => document.activeElement.id === 'menu-toggle' && document.activeElement.getAttribute('aria-expanded') === 'false'));
  await page.click('#menu-toggle');
  await page.click('.main-nav a[href="#offices"]');
  check('Mobile navigation reaches office lookup and closes', await page.$eval('#menu-toggle', el => el.getAttribute('aria-expanded') === 'false'));
  await page.click('[aria-label="Collapse route details"]');
  check('Mobile route sheet collapses', await page.$eval('.route-sheet-content', el => el.hidden));
  await page.click('[aria-label="Expand route details"]');
  check('Mobile route sheet expands', await page.$eval('.route-sheet-content', el => !el.hidden));
  const smallTargets = await page.evaluate(() => [...document.querySelectorAll('button,select,input,a')].filter(el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width && r.height && !el.closest('.leaflet-pane') && cs.visibility !== 'hidden' && (r.height < 48 || r.width < 48); }).map(el => ({ text: el.textContent.trim().slice(0, 35), width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })));
  check('Mobile interactive targets are at least 48px', !smallTargets.length, smallTargets);
  await browser.defaultBrowserContext().overridePermissions('http://127.0.0.1:5173', ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
  await page.bringToFront();
  await page.click('.visitor-action button');
  await page.waitForFunction(() => document.querySelector('.visitor-action [role="status"]').textContent === 'Page link copied.');
  check('Copy page link copies the current page URL', await page.evaluate(async () => (await navigator.clipboard.readText()) === location.href.split('#')[0]));
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Blocked clipboard')) } }));
  await page.click('.visitor-action button');
  await pause();
  check('Blocked clipboard reveals and selects a visible link', await page.evaluate(() => document.activeElement.getAttribute('aria-label') === 'Page link to copy' && document.activeElement.selectionEnd > 0));
  await page.evaluate(() => scrollTo(0, 0));
  await page.keyboard.down('Control');
  await page.keyboard.press('Home');
  await page.keyboard.up('Control');
  await page.focus('.skip-link');
  await page.keyboard.press('Tab');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');
  check('Skip link shows an immediate visible focus outline', await page.$eval('.skip-link', el => { const s = getComputedStyle(el); return s.outlineStyle !== 'none' && el.getBoundingClientRect().top >= 0; }));
  await page.keyboard.press('Enter');
  check('Skip link targets the main content', await page.evaluate(() => location.hash === '#main'));
  check('Reduced motion disables transitions', await page.$eval('.button', el => getComputedStyle(el).transitionDuration === '0s'));
  await page.click('.hero-actions .primary');
  check('Open the map moves keyboard focus to the map result', await page.evaluate(() => document.activeElement.classList.contains('hero-map')));
  await page.setViewport({ width: 1280, height: 800 });
  for (const selector of ['.main-nav a', '.feature-index a', '.footer-details a[href^="#"]', '.wordmark']) {
    const count = (await page.$$(selector)).length;
    for (let i = 0; i < count; i++) {
      const links = await page.$$(selector);
      const href = await links[i].evaluate(el => el.getAttribute('href'));
      await links[i].click();
      check(`Anchor ${selector} ${i + 1} reaches ${href}`, await page.evaluate(target => location.hash === target, href));
    }
  }
  await page.click('.search-tabs button:first-child');
  await page.click('#destination');
  await page.type('#destination', 'Library');
  await page.click('.suggestions li');
  check('Clicking an autocomplete option selects its sample route', await page.$eval('.route-destination', el => el.textContent.includes('Sample Library')));
  await page.focus('.skip-link');
  const visited = [];
  const focusFailures = [];
  let footerReached = false;
  for (let i = 0; i < 90; i++) {
    await page.keyboard.press('Tab');
    const state = await page.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); return { name: el.getAttribute('aria-label') || el.id || el.textContent.trim().slice(0, 30), outline: cs.outlineStyle, footer: Boolean(el.closest('footer')), tag: el.tagName }; });
    visited.push(state.name);
    if (state.tag !== 'BODY' && state.outline === 'none') focusFailures.push(state.name);
    if (state.footer) { footerReached = true; break; }
  }
  check('Keyboard Tab walkthrough reaches footer without a trap', footerReached, { visited, focusFailures });
  check('Every keyboard-focused control has a visible outline', !focusFailures.length, focusFailures);
  await page.screenshot({ path: '.hallmark/shots/redesign-dark-mobile.png', fullPage: true });
  for (const width of [360, 768, 1280]) {
    await page.setViewport({ width, height: 900 });
    check(`Dark theme has no overflow with selected office at ${width}px`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await page.setViewport({ width: 640, height: 450 });
  check('200% zoom equivalent has no page overflow', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const fallback = await browser.newPage();
  fallback.on('pageerror', error => errors.push(error.message));
  await fallback.setRequestInterception(true);
  fallback.on('request', request => request.url().includes('cdnjs.cloudflare.com') ? request.abort() : request.continue());
  await fallback.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await fallback.waitForFunction(() => document.querySelector('.map-status')?.textContent.includes('Map unavailable'));
  check('Map script failure shows a useful fallback', await fallback.$eval('.map-status', el => el.textContent.includes('sample destination list')));
  await fallback.click('.quick-destinations button');
  check('Destination lookup still works when map fails', await fallback.$eval('.route-destination', el => el.textContent.includes('Sample Library')));
  const tileFailure = await browser.newPage();
  await tileFailure.setRequestInterception(true);
  tileFailure.on('request', request => request.url().includes('tile.openstreetmap.org') ? request.abort() : request.continue());
  await tileFailure.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });
  await tileFailure.waitForFunction(() => document.querySelector('.map-status')?.textContent.includes('Map unavailable'));
  check('Failed map tiles show fallback while keeping destinations usable', await tileFailure.$eval('.map-status', el => el.textContent.includes('sample destination list')));
  check('No runtime errors in primary or fallback flows', !errors.length, errors);
} catch (error) { check('Automation completed', false, error.stack); }
finally {
  await browser.close();
  await writeFile('.hallmark/browser-checks.json', JSON.stringify({ date: '2026-10-25', checks, errors }, null, 2));
}
if (checks.some(item => !item.passed)) process.exitCode = 1;
