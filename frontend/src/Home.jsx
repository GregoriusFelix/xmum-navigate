import { useEffect, useRef, useState } from 'react';
import { Building2, Check, ChevronDown, ChevronRight, Compass, Copy, Footprints, Info, Map, Menu, Moon, Search, Sun, Utensils, X } from 'lucide-react';
import CampusMap from './CampusMap.jsx';
import { CONFIG, DESTINATIONS, OFFICES } from './campus.js';

const MODULES = [
  { title: 'Campus navigation', icon: Footprints, text: 'Outdoor walking routes between buildings.', target: 'try-it' },
  { title: 'Find an office', icon: Building2, text: 'The building, floor and directions you need.', target: 'offices' },
  { title: 'Venue finder', icon: Compass, text: 'Space suggestions for your campus event.', target: 'venues' },
  { title: 'Canteen directory', icon: Utensils, text: 'Stalls, menus, prices and opening hours.', target: 'canteens' },
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
  const [theme, setTheme] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const manualTheme = useRef(false);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);
  const [selected, setSelected] = useState(() => DESTINATIONS[0]);
  const [office, setOffice] = useState(OFFICES[0]);
  const [eventType, setEventType] = useState('Presentation');
  const [copied, setCopied] = useState('');
  const searchRef = useRef(null);
  const shareRef = useRef(null);
  const searchAreaRef = useRef(null);
  const resultRef = useRef(null);
  const matches = DESTINATIONS.filter(item => (filter !== 'offices' || item.floor) && item.name.toLowerCase().includes(query.toLowerCase()));
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
  useEffect(() => {
    const close = e => { if (!searchAreaRef.current?.contains(e.target)) setSuggestionsOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  useEffect(() => { if (activeOption >= 0) document.getElementById(`destination-${activeOption}`)?.scrollIntoView({ block: 'nearest' }); }, [activeOption]);
  const choose = item => { setSelected(item); setQuery(item.name); setSuggestionsOpen(false); setActiveOption(-1); if (item.floor) setOffice(item); };
  const reset = () => { setSelected(null); setQuery(''); setActiveOption(-1); setSuggestionsOpen(false); };
  const focusSearch = (offices = false) => { setFilter(offices ? 'offices' : 'all'); setQuery(''); setSuggestionsOpen(true); searchRef.current?.focus(); };
  const showRoute = place => { choose({ ...place, place }); document.getElementById('try-it').scrollIntoView(); resultRef.current?.focus({ preventScroll: true }); };
  const copyLink = async () => { try { await navigator.clipboard.writeText(window.location.href.split('#')[0]); setCopied('Page link copied.'); } catch { setCopied('Select and copy the page link below.'); setTimeout(() => shareRef.current?.select(), 0); } };
  const venue = CONFIG.places[eventType === 'Study group' ? 2 : 4];
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header container">
      <a className="wordmark" href="#main">XMUM <span>Navigate</span></a>
      <nav className={menu ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation" onKeyDown={e => { if (e.key === 'Escape') { setMenu(false); document.getElementById('menu-toggle').focus(); } }}>
        {[['Campus map', 'try-it'], ['Office lookup', 'offices'], ['Campus life', 'campus-life'], ['For visitors', 'visitors']].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
      </nav>
      <div className="header-actions"><button className="icon-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => { manualTheme.current = true; setTheme(theme === 'light' ? 'dark' : 'light'); }}>{theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}</button><button id="menu-toggle" className="icon-button menu-toggle" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button></div>
    </header>
    <main id="main">
      <section className="hero container" id="try-it" aria-labelledby="hero-title">
        <div className="hero-content">
          <h1 id="hero-title">Find your way<br />around XMUM.</h1>
          <p className="hero-description">Walking routes, offices, venue ideas and canteen menus, right in your browser.</p>
          <div className="hero-actions"><button className="button primary" onClick={() => { document.getElementById('campus-map').scrollIntoView({ block: 'center' }); resultRef.current?.focus({ preventScroll: true }); }}>Open the map <Map size={18} aria-hidden="true" /></button><button className="button secondary" onClick={() => focusSearch(true)}>Find an office</button></div>
          <div className="destination-search" ref={searchAreaRef}>
            <div className="search-tabs" role="group" aria-label="Search categories"><button aria-pressed={filter === 'all'} onClick={() => { setFilter('all'); reset(); }}>All places</button><button aria-pressed={filter === 'offices'} onClick={() => { setFilter('offices'); reset(); }}>Offices</button></div>
            <label htmlFor="destination">Where do you want to go?</label>
            <div className="search-field"><Search size={20} aria-hidden="true" /><input id="destination" ref={searchRef} autoComplete="off" placeholder={filter === 'offices' ? 'Search a sample office' : 'Search a building or office'} value={query} role="combobox" aria-autocomplete="list" aria-expanded={suggestionsOpen} aria-controls="destination-options" aria-activedescendant={suggestionsOpen && activeOption >= 0 ? `destination-${activeOption}` : undefined} onFocus={() => setSuggestionsOpen(true)} onBlur={e => { if (!e.currentTarget.parentElement.parentElement.contains(e.relatedTarget)) setSuggestionsOpen(false); }} onChange={e => { setQuery(e.target.value); setActiveOption(-1); setSuggestionsOpen(true); }} onKeyDown={e => { if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); setSuggestionsOpen(true); setActiveOption(i => matches.length ? (i + (e.key === 'ArrowDown' ? 1 : i < 0 ? 0 : -1) + matches.length) % matches.length : -1); } if (e.key === 'Enter' && suggestionsOpen && matches.length) { e.preventDefault(); choose(matches[Math.max(0, activeOption)]); } if (e.key === 'Escape') { setSuggestionsOpen(false); setActiveOption(-1); } }} />{query && <button className="icon-button clear-search" aria-label="Clear search and sample route" onClick={reset}><X size={16} aria-hidden="true" /></button>}</div>
            <ul id="destination-options" className="suggestions" role="listbox" aria-label="Sample destinations" hidden={!suggestionsOpen}>{matches.length ? matches.map((item, i) => <li key={item.id} id={`destination-${i}`} role="option" aria-selected={activeOption === i} onPointerDown={e => e.preventDefault()} onClick={() => choose(item)}><span>{item.name}<small>{item.floor ? `Office in ${item.place.name}, Floor ${item.floor}` : item.type}</small></span><ChevronRight size={16} aria-hidden="true" /></li>) : <li role="option" aria-selected="false" aria-disabled="true">No sample places found. Try “Sample”.</li>}</ul>
            <div className="quick-destinations"><span>Sample stops</span>{CONFIG.places.filter(p => ['c', 'd', 'e'].includes(p.id)).map(place => <button key={place.id} onClick={() => choose({ ...place, place })}>{place.name.replace('Sample ', '')}<ChevronRight size={14} aria-hidden="true" /></button>)}</div>
          </div>
          <p className="browser-note"><Check size={16} aria-hidden="true" /> No app download. No account needed.</p>
        </div>
        <div className="hero-map" ref={resultRef} tabIndex={-1}><CampusMap selected={selected} onSelect={choose} onReset={reset} /><p className="map-disclaimer"><Info size={14} aria-hidden="true" />Sample routes only. The real app uses surveyed campus paths.</p></div>
      </section>
      <nav className="feature-index container" id="features" aria-label="What you can do">{MODULES.map(({ title, icon: Icon, text, target }) => <a className="feature-link" href={`#${target}`} key={title}><Icon size={24} aria-hidden="true" /><div><h2>{title}</h2><p>{text}</p></div><ChevronRight size={16} aria-hidden="true" /></a>)}</nav>
      <section className="office-section container" id="offices" aria-labelledby="office-title">
        <div className="office-copy"><h2 id="office-title">The right building.<br />The right floor.</h2><p>Search a department for its building, floor plan and written directions.</p><label htmlFor="office-select">Try a sample office</label><div className="select-wrap"><select id="office-select" value={office.id} onChange={e => { const item = OFFICES.find(o => o.id === e.target.value); setOffice(item); choose(item); }}>{OFFICES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div><p className="office-scope"><Info size={16} aria-hidden="true" /> Floor plan and directions, no live tracking.</p></div>
        <div className="office-example" aria-live="polite"><div className="office-example-title"><Building2 size={24} aria-hidden="true" /><div><h3>{office.name}</h3><p>{office.place.name}, Floor {office.floor}</p></div></div><FloorPlan floor={office.floor} /><ol className="office-directions">{office.directions.map(direction => <li key={direction}>{direction}</li>)}</ol><button className="text-button" onClick={() => { choose(office); document.getElementById('try-it').scrollIntoView(); resultRef.current?.focus({ preventScroll: true }); }}>Show outdoor sample route <Footprints size={18} aria-hidden="true" /></button></div>
      </section>
      <section className="campus-life-section" id="campus-life"><div className="container"><div className="life-heading"><h2>A place to meet.<br />A place to eat.</h2><p>Two more ways to feel at home on campus.</p></div><div className="life-grid"><article id="venues" className="life-module"><div className="life-module-title"><Compass size={28} aria-hidden="true" /><h3>Venue finder</h3></div><p>Get venue suggestions for your event.</p><label htmlFor="event-type">What are you planning?</label><div className="select-wrap"><select id="event-type" value={eventType} onChange={e => setEventType(e.target.value)}><option>Presentation</option><option>Study group</option><option>Student gathering</option></select><ChevronDown size={18} aria-hidden="true" /></div><div className="venue-result" aria-live="polite"><span className="sample-label">Sample recommendation</span><strong>{venue.name}</strong><p>{venue.description}</p></div><button className="text-button" onClick={() => showRoute(venue)}>See sample location <Map size={18} aria-hidden="true" /></button></article><article id="canteens" className="life-module"><div className="life-module-title"><Utensils size={28} aria-hidden="true" /><h3>Canteen directory</h3></div><p>Browse stalls, menus, prices and hours.</p><div className="menu-heading"><strong>Sample Kitchen</strong><span>Sample Canteen</span></div><dl className="sample-menu">{CONFIG.places[3].menu.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></div>)}</dl><p className="menu-hours">{CONFIG.places[3].hours}</p><button className="text-button" onClick={() => showRoute(CONFIG.places[3])}>See sample location <Map size={18} aria-hidden="true" /></button></article></div><p className="life-disclaimer"><Info size={16} aria-hidden="true" /> All venues, stalls, menus, prices and hours shown here are sample data.</p></div></section>
      <section className="how-section container" id="how-it-works" aria-labelledby="how-title"><h2 id="how-title">From search<br />to your next stop.</h2><ol className="steps"><li><h3>Search</h3><p>Type a building, office or place.</p></li><li><h3>See the route</h3><p>Check the outdoor route and walking time.</p></li><li><h3>Walk there</h3><p>Follow the route on your phone as you go.</p></li></ol></section>
      <section className="visitors-section container" id="visitors"><div><h2>First time here?<br />Bring this along.</h2><p>Made for new students, parents and first-time visitors.</p><ul><li><Check size={18} aria-hidden="true" />Opens in your phone browser</li><li><Check size={18} aria-hidden="true" />Works on iPhone and Android</li><li><Check size={18} aria-hidden="true" />No download, no account</li></ul></div><div className="visitor-action"><button className="button primary" onClick={copyLink}><Copy size={18} aria-hidden="true" />Copy page link</button><span role="status">{copied || 'Share a little direction.'}</span>{copied.startsWith('Select') && <input ref={shareRef} aria-label="Page link to copy" readOnly value={window.location.href.split('#')[0]} />}</div></section>
    </main>
    <footer className="site-footer container"><div><a className="wordmark" href="#main">XMUM <span>Navigate</span></a><p>Final Year Project, Xiamen University Malaysia</p><small>This is a student project, not an official XMUM service.</small></div><div className="footer-details"><span>Contact: email to be confirmed</span><a href="https://www.openstreetmap.org/copyright">Map data © OpenStreetMap contributors</a><a href="#how-it-works">How it works</a></div></footer>
  </>;
}
