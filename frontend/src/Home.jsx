import { useEffect, useRef, useState } from 'react';
import { Building2, Check, ChevronDown, ChevronRight, Compass, Copy, Footprints, Info, Map, Moon, Sun, Utensils } from 'lucide-react';
import CampusMap from './CampusMap.jsx';
import MapSearch from './MapSearch.jsx';
import HomeHero from './HomeHero.jsx';
import BottomNavigation from './BottomNavigation.jsx';
import { CONFIG, DESTINATIONS, OFFICES } from './campus.js';

const MODULES = [
  { title: 'Campus navigation', icon: Footprints, text: 'Walking routes between buildings.', target: '/map' },
  { title: 'Find an office', icon: Building2, text: 'Buildings, floors, and directions.', target: '/offices' },
  { title: 'Venue finder', icon: Compass, text: 'Find an event space.', target: '/venues' },
  { title: 'Canteen directory', icon: Utensils, text: 'Menus, prices, and hours.', target: '/canteens' },
];

function FloorPlan({ floor }) {
  return <figure className="floor-plan"><figcaption><span>Sample floor plan</span><strong>Floor {floor}</strong></figcaption><svg viewBox="0 0 480 220" role="img" aria-label={`Sample Floor ${floor}. Enter the corridor from the lift on the left. The sample office is on the upper right.`}>
    <g className="plan-rooms"><path d="M24 24H456V196H24Z M24 92H456 M24 130H456 M130 24V92 M290 24V92 M176 130V196 M340 130V196" /></g>
    <path className="plan-office" d="M292 26H454V90H292Z" />
    <path className="plan-route" d="M78 64V112H370V62" />
    <g className="plan-text"><text x="54" y="56">Lift</text><text x="174" y="62">Room</text><text x="322" y="62">Office</text><text x="50" y="168">Room</text><text x="219" y="168">Room</text><text x="374" y="168">Stairs</text></g>
    <circle className="plan-end" cx="370" cy="62" r="6" />
  </svg><p>Illustrative layout. Written directions accompany the plan.</p></figure>;
}

export default function Home() {
  const pathname = window.location.pathname.replace(/\/$/, '');
  const mapPage = pathname === '/map' || (pathname === '' && new URLSearchParams(window.location.search).has('destination'));
  const params = new URLSearchParams(window.location.search);
  const homePage = !mapPage && ['', '/home'].includes(pathname);
  const officePage = pathname === '/offices';
  const venuePage = pathname === '/venues';
  const canteenPage = pathname === '/canteens';
  const knownPage = homePage || mapPage || officePage || venuePage || canteenPage;
  const activePath = homePage ? '/' : mapPage ? '/map' : pathname;
  const pageTitle = mapPage ? 'Campus map' : officePage ? 'Office lookup' : venuePage ? 'Venue finder' : canteenPage ? 'Canteen directory' : knownPage ? 'Find your way around campus' : 'Page not found';
  const [theme, setTheme] = useState(() => sessionStorage.getItem('xmum-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const manualTheme = useRef(Boolean(sessionStorage.getItem('xmum-theme')));
  const [selected, setSelected] = useState(() => DESTINATIONS.find(item => item.id === params.get('destination')) || DESTINATIONS[0]);
  const [office, setOffice] = useState(() => OFFICES.find(item => item.id === params.get('office')) || OFFICES[0]);
  const [eventType, setEventType] = useState(() => ['Presentation', 'Study group', 'Student gathering'].includes(params.get('event')) ? params.get('event') : 'Presentation');
  const [copied, setCopied] = useState('');
  const shareRef = useRef(null);
  const resultRef = useRef(null);
  useEffect(() => {
    document.title = `${pageTitle} | XMUM Navigate`;
  }, [pageTitle]);
  useEffect(() => {
    const legacyPages = { '#offices': '/offices', '#venues': '/venues', '#canteens': '/canteens', '#campus-life': '/venues' };
    if (homePage && legacyPages[window.location.hash]) window.location.replace(`${legacyPages[window.location.hash]}${window.location.search}`);
    else if (homePage && params.has('office')) window.location.replace(`/offices${window.location.search}`);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101623' : '#171f32';
  }, [theme]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const change = () => { if (!manualTheme.current) setTheme(media.matches ? 'dark' : 'light'); };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  const choose = item => { setSelected(item); if (item.floor) setOffice(item); if (mapPage || officePage) { const url = new URL(window.location.href); url.searchParams.set(officePage ? 'office' : 'destination', item.id); window.history.replaceState(null, '', url); } };
  const reset = () => { setSelected(null); if (mapPage) { const url = new URL(window.location.href); url.searchParams.delete('destination'); window.history.replaceState(null, '', url); } };
  const showRoute = place => { window.location.assign(`/map?destination=${encodeURIComponent(place.id)}`); };
  const copyLink = async () => { try { await navigator.clipboard.writeText(window.location.href.split('#')[0]); setCopied('Page link copied.'); } catch { setCopied('Select and copy the page link below.'); setTimeout(() => shareRef.current?.select(), 0); } };
  const venue = CONFIG.places[eventType === 'Study group' ? 2 : 4];
  return <div className={`app-shell ${mapPage ? 'map-shell' : 'homepage'}${officePage || venuePage || canteenPage ? ' feature-page' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header container${mapPage ? ' map-page-header' : ''}`}>
      <a className="wordmark" href="/">XMUM <span>Navigate</span></a>
      <div className="header-actions"><button className="icon-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => { manualTheme.current = true; const next = theme === 'light' ? 'dark' : 'light'; sessionStorage.setItem('xmum-theme', next); setTheme(next); }}>{theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}</button></div>
    </header>
    <main id="main" className={mapPage ? 'map-page-main' : undefined}>
      {homePage && <HomeHero />}
      {mapPage && <section className="map-section map-page" id="try-it" aria-label="Campus route planner">
        <h1 className="visually-hidden">XMUM campus map</h1>
        <div className="map-workspace">
        <MapSearch selected={selected} onSelect={choose} onClear={reset} />
        <div className="hero-map" ref={resultRef} tabIndex={-1}><CampusMap selected={selected} onSelect={choose} onReset={reset} /></div>
        </div>
      </section>}
      {homePage && <nav className="feature-index container" id="features" aria-label="What you can do">{MODULES.map(({ title, icon: Icon, text, target }) => <a className="feature-link" href={target} key={title}><Icon size={24} aria-hidden="true" /><div><h2>{title}</h2><p>{text}</p></div><ChevronRight size={16} aria-hidden="true" /></a>)}</nav>}
      {officePage &&
      <section className="office-section container" id="offices" aria-labelledby="office-title">
        <div className="office-copy"><h1 id="office-title">Find the right office.</h1><p>Choose a department for its building, floor plan and written directions.</p><label htmlFor="office-select">Try a sample office</label><div className="select-wrap"><select id="office-select" value={office.id} onChange={e => { const item = OFFICES.find(o => o.id === e.target.value); setOffice(item); choose(item); }}>{OFFICES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div><p className="office-scope"><Info size={16} aria-hidden="true" /> Floor plan and directions, no live tracking.</p></div>
        <div className="office-example" aria-live="polite"><div className="office-example-title"><Building2 size={24} aria-hidden="true" /><div><h3>{office.name}</h3><p>{office.place.name}, Floor {office.floor}</p></div></div><FloorPlan floor={office.floor} /><ol className="office-directions">{office.directions.map(direction => <li key={direction}>{direction}</li>)}</ol><button className="text-button" onClick={() => showRoute(office)}>Show outdoor sample route <Footprints size={18} aria-hidden="true" /></button></div>
      </section>
      }
      {(venuePage || canteenPage) && <section className="campus-life-section" id="campus-life"><div className="container">
        <div className="life-heading"><h1>{venuePage ? 'A space for your plans.' : 'Find your next bite.'}</h1><p>{venuePage ? 'Choose your event and find a campus venue.' : 'Canteen menus, prices, and hours in one place.'}</p></div>
        <div className="life-grid">
          {venuePage && <article id="venues" className="life-module">
            <div className="life-module-title"><Compass size={28} aria-hidden="true" /><h3>Venue finder</h3></div>
            <label htmlFor="event-type">What are you planning?</label>
            <div className="select-wrap"><select id="event-type" value={eventType} onChange={e => { setEventType(e.target.value); const url = new URL(window.location.href); url.searchParams.set('event', e.target.value); window.history.replaceState(null, '', url); }}><option>Presentation</option><option>Study group</option><option>Student gathering</option></select><ChevronDown size={18} aria-hidden="true" /></div>
            <div className="venue-result" aria-live="polite"><span className="sample-label">Sample recommendation</span><strong>{venue.name}</strong><p>{venue.description}</p></div>
            <button className="text-button" onClick={() => showRoute(venue)}>See sample location <Map size={18} aria-hidden="true" /></button>
          </article>}
          {canteenPage && <article id="canteens" className="life-module">
            <div className="life-module-title"><Utensils size={28} aria-hidden="true" /><h3>Canteen directory</h3></div>
            <div className="menu-heading"><strong>Sample Kitchen</strong><span>Sample Canteen</span></div>
            <dl className="sample-menu">{CONFIG.places[3].menu.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></div>)}</dl>
            <p className="menu-hours">{CONFIG.places[3].hours}</p>
            <button className="text-button" onClick={() => showRoute(CONFIG.places[3])}>See sample location <Map size={18} aria-hidden="true" /></button>
          </article>}
        </div>
        <p className="life-disclaimer"><Info size={16} aria-hidden="true" /> Venue and canteen details are sample data.</p>
      </div></section>}
      {homePage && <>
      <section className="how-section container" id="how-it-works" aria-labelledby="how-title"><h2 id="how-title">From search<br />to your next stop.</h2><ol className="steps"><li><h3>Find a destination</h3></li><li><h3>Check your route</h3></li><li><h3>Walk there</h3></li></ol></section>
      <section className="visitors-section container" id="visitors"><div><h2>New to XMUM?</h2><p>Keep campus directions close.</p><ul><li><Check size={18} aria-hidden="true" />iPhone and Android browsers</li><li><Check size={18} aria-hidden="true" />No download</li><li><Check size={18} aria-hidden="true" />No account</li></ul></div><div className="visitor-action"><button className="button primary" onClick={copyLink}><Copy size={18} aria-hidden="true" />Copy page link</button><span role="status">{copied || 'Share with a friend.'}</span>{copied.startsWith('Select') && <input ref={shareRef} aria-label="Page link to copy" readOnly value={window.location.href.split('#')[0]} />}</div></section>
      </>}
      {!knownPage && <section className="not-found container"><h1>Page not found.</h1><p>Choose a campus feature from the navigation below.</p><a className="button primary" href="/">Back to home</a></section>}
    </main>
    <BottomNavigation activePath={activePath} />
    {!mapPage && <footer className="site-footer container"><div><a className="wordmark" href="#main">XMUM <span>Navigate</span></a><p>Xiamen University Malaysia</p><small>Student project. Not an official XMUM service.</small><p className="photo-credits">Photos: <a href="https://commons.wikimedia.org/wiki/File:Xiamen_University_Malaysia_at_afternoon.jpg">campus</a>, <a href="https://commons.wikimedia.org/wiki/File:Xiamen_University_Malaysia_library.jpg">library</a> (public domain); <a href="https://commons.wikimedia.org/wiki/File:Xmumtree.jpg">Xmumtree</a>: Doodoris, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped.</p></div><div className="footer-details"><a href="https://www.openstreetmap.org/copyright">Map data © OpenStreetMap contributors</a><a href="#how-it-works">How it works</a></div></footer>}
  </div>;
}
