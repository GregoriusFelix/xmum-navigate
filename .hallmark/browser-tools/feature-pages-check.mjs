import puppeteer from 'puppeteer-core';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, pipe: true, args: ['--no-first-run', '--no-default-browser-check'] });
const checks = [];
const errors = [];
const origin = 'http://127.0.0.1:5174';
const routes = ['/', '/map', '/offices', '/venues', '/canteens'];
const check = (name, passed) => { checks.push({ name, passed: Boolean(passed) }); console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`); };
try {
  await mkdir('.hallmark/feature-pages', { recursive: true });
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const route of routes) {
    await page.goto(origin + route, { waitUntil: 'networkidle0' });
    check(`${route}: one page heading`, await page.evaluate(() => document.querySelectorAll('h1').length === 1));
    check(`${route}: correct active bottom tab`, await page.$eval('.bottom-navigation [aria-current="page"]', (e, route) => e.getAttribute('href') === route, route));
    check(`${route}: exactly five always-visible bottom links`, await page.evaluate(() => document.querySelectorAll('.bottom-navigation a').length === 5 && !document.querySelector('.main-nav')));
    check(`${route}: local anchors resolve`, await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.hash.slice(1)))));
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewport({ width, height: 900 });
      check(`${route} @${width}: no overflow, fixed bottom bar, usable touch targets`, await page.evaluate(() => {
        const nav = document.querySelector('.bottom-navigation');
        const rect = nav.getBoundingClientRect();
        return document.documentElement.scrollWidth <= innerWidth && getComputedStyle(nav).position === 'fixed' && rect.bottom <= innerHeight + 1 && rect.bottom >= innerHeight - 20 && [...nav.querySelectorAll('a')].every(a => { const r = a.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; });
      }));
      if ([390, 1440].includes(width)) await page.screenshot({ path: `.hallmark/feature-pages/${route.slice(1) || 'home'}-${width}.png`, fullPage: true });
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    check(`${route}: final content remains above bottom navigation`, await page.evaluate(() => {
      const shell = document.querySelector('.app-shell');
      const nav = document.querySelector('.bottom-navigation').getBoundingClientRect();
      const content = document.querySelector('footer') || document.querySelector('main');
      return parseFloat(getComputedStyle(shell).paddingBottom) >= nav.height + 16 && content.getBoundingClientRect().bottom <= nav.top + 1;
    }));
  }
  await page.goto(origin);
  check('Homepage shortcuts open separate pages', await page.evaluate(() => [...document.querySelectorAll('.feature-link')].map(a => a.getAttribute('href')).join(',') === '/map,/offices,/venues,/canteens'));
  check('Homepage has no embedded feature tools', !(await page.$('#office-select, #event-type, #canteens')));
  for (const route of routes.slice(1)) {
    await Promise.all([page.waitForNavigation(), page.click(`.bottom-navigation a[href="${route}"]`)]);
    check(`Bottom tab navigates to ${route}`, new URL(page.url()).pathname === route);
  }
  await page.goto(origin + '/offices?office=o3');
  check('Office query restores selected department', await page.$eval('#office-select', e => e.value === 'o3'));
  await page.select('#office-select', 'o4');
  check('Office change updates URL and floor', page.url().includes('office=o4') && await page.$eval('.office-example', e => e.innerText.includes('Floor 3')));
  await page.reload();
  check('Office selection survives reload', await page.$eval('#office-select', e => e.value === 'o4'));
  await Promise.all([page.waitForNavigation(), page.click('.office-example .text-button')]);
  check('Office route opens selected map office', new URL(page.url()).pathname === '/map' && page.url().includes('destination=o4'));
  check('Map links directly to office page', await page.$eval('.route-office a', e => e.getAttribute('href') === '/offices?office=o4'));
  await page.goto(origin + '/venues');
  await page.select('#event-type', 'Study group');
  check('Venue recommendation and URL update', page.url().includes('event=Study+group') && await page.$eval('.venue-result', e => e.innerText.includes('Sample Library')));
  await page.reload();
  check('Venue choice survives reload', await page.$eval('#event-type', e => e.value === 'Study group'));
  await Promise.all([page.waitForNavigation(), page.click('#venues .text-button')]);
  check('Venue route opens recommended destination', page.url().includes('/map?destination=c'));
  await page.goto(origin + '/canteens');
  check('Canteen menu and hours retained', await page.evaluate(() => document.querySelectorAll('.sample-menu > div').length === 3 && document.querySelector('.menu-hours').textContent.includes('Mon')));
  await Promise.all([page.waitForNavigation(), page.click('#canteens .text-button')]);
  check('Canteen route opens correct map destination', page.url().includes('/map?destination=d'));
  await page.goto(origin + '/home?office=o3#offices', { waitUntil: 'networkidle0' });
  check('Legacy office link redirects with selection', new URL(page.url()).pathname === '/offices' && await page.$eval('#office-select', e => e.value === 'o3'));
  await page.goto(origin + '/#canteens', { waitUntil: 'networkidle0' });
  check('Legacy canteen anchor redirects', new URL(page.url()).pathname === '/canteens');
  await page.goto(origin + '/venues/');
  check('Trailing slash page works', await page.$('#event-type'));
  await page.click('[aria-label="Switch to dark theme"]');
  await page.screenshot({ path: '.hallmark/feature-pages/venues-dark.png', fullPage: true });
  await page.goto(origin + '/offices');
  check('Theme persists across feature navigation', await page.evaluate(() => document.documentElement.dataset.theme === 'dark'));
  await page.focus('.bottom-navigation a[href="/canteens"]');
  check('Bottom tab has keyboard focus ring', await page.$eval('.bottom-navigation a[href="/canteens"]', e => getComputedStyle(e).outlineStyle !== 'none'));
  await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);
  check('Keyboard Enter navigates bottom tab', new URL(page.url()).pathname === '/canteens');
  await page.goto(origin + '/does-not-exist');
  check('Unknown page has recovery link', await page.$eval('h1', e => e.innerText === 'Page not found.'));
  const hosting = JSON.parse(await readFile('frontend/vercel.json', 'utf8'));
  check('Hosting rewrites cover all feature pages', routes.slice(1).every(route => hosting.rewrites.some(r => r.source === route && r.destination === '/index.html')));
  check('No JavaScript errors', errors.length === 0);
  await writeFile('.hallmark/feature-pages/checks.json', JSON.stringify({ checks, errors }, null, 2));
  if (checks.some(c => !c.passed)) process.exitCode = 1;
} finally { await browser.close(); }
