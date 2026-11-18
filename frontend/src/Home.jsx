import { useEffect, useRef, useState } from 'react';
import { Building2, Check, ChevronRight, Compass, Copy, Footprints, Moon, Sun, Utensils } from 'lucide-react';
import HomeHero from './HomeHero.jsx';
import MapPage from './MapPage.jsx';
import AdminPage from './AdminPage.jsx';
import { CanteensPage, OfficesPage, ProfilePage, VenuesPage } from './FeaturePages.jsx';
import Welcome, { Splash } from './Welcome.jsx';
import BottomNavigation from './BottomNavigation.jsx';
import SCurve from './SCurve.jsx';
import { api, isGuest, setGuest, setUserToken, userToken, withDestinations } from './api.js';

const MODULES = [
  { title: 'Campus navigation', icon: Footprints, text: 'Walking routes between buildings.', target: '/map' },
  { title: 'Find an office', icon: Building2, text: 'Buildings, floors, and directions.', target: '/offices' },
  { title: 'Venue finder', icon: Compass, text: 'Find an event space.', target: '/venues' },
  { title: 'Canteen directory', icon: Utensils, text: 'Menus, prices, and hours.', target: '/canteens' },
];
const PAGES = {
  '/map': ['Campus map', MapPage],
  '/offices': ['Office lookup', OfficesPage],
  '/venues': ['Venue finder', VenuesPage],
  '/canteens': ['Canteen directory', CanteensPage],
  '/admin': ['Admin', AdminPage],
  '/profile': ['Profile', ProfilePage],
};

export default function Home() {
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname.replace(/\/$/, '');
  // The map is the first screen; the introduction page lives at /about.
  const pathname = ['', '/home'].includes(path) ? '/map' : path;
  const homePage = pathname === '/about';
  const mapPage = pathname === '/map';
  const [pageTitle, Page] = PAGES[pathname] || [homePage ? 'About' : 'Page not found'];
  // Light by default; dark only when the visitor picks it.
  const [theme, setTheme] = useState(() => sessionStorage.getItem('xmum-theme') || 'light');
  const [campus, setCampus] = useState(null);
  const [user, setUser] = useState(null);
  const [entered, setEntered] = useState(() => Boolean(userToken()) || isGuest());
  const [splash, setSplash] = useState(() => !sessionStorage.getItem('xmum-splash'));
  useEffect(() => {
    if (!splash) return;
    const timer = setTimeout(() => { sessionStorage.setItem('xmum-splash', '1'); setSplash(false); }, 1400);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!userToken()) return;
    // A restarted backend forgets sessions, so a stale token sends the user back to log in.
    api('/me').then(setUser).catch(error => { if (error.code === 'logged_out') { setUserToken(''); setEntered(isGuest()); } });
  }, []);
  const signOut = () => {
    // The local token is dropped whether or not the server hears about it.
    if (userToken()) api('/me/logout', { method: 'POST' }).catch(() => {});
    setUserToken('');
    setGuest(false);
    setUser(null);
    setEntered(false);
  };
  const [offline, setOffline] = useState(false);
  const [copied, setCopied] = useState('');
  const shareRef = useRef(null);
  const reload = () => api('/data').then(data => setCampus(withDestinations(data)));
  useEffect(() => { reload().catch(() => setOffline(true)); }, []);
  useEffect(() => {
    document.title = `${pageTitle} | XMUM Navigate`;
  }, [pageTitle]);
  useEffect(() => {
    const legacyPages = { '#offices': '/offices', '#venues': '/venues', '#canteens': '/canteens', '#campus-life': '/venues' };
    if (['', '/home'].includes(path) && legacyPages[window.location.hash]) window.location.replace(`${legacyPages[window.location.hash]}${window.location.search}`);
    else if (['', '/home'].includes(path) && params.has('office')) window.location.replace(`/offices${window.location.search}`);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0c1424' : '#19325e';
  }, [theme]);
  const copyLink = async () => { try { await navigator.clipboard.writeText(window.location.href.split('#')[0]); setCopied('Page link copied.'); } catch { setCopied('Select and copy the page link below.'); setTimeout(() => shareRef.current?.select(), 0); } };
  if (splash) return <Splash />;
  if (!entered && pathname !== '/admin') return <Welcome onEnter={account => { setUser(account); setEntered(true); }} />;
  return <div className={`app-shell ${mapPage ? 'map-shell' : 'homepage'}${Page && !mapPage ? ' feature-page' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    {!mapPage && <header className="site-header container">
      <a className="wordmark" href="/"><img src="/logo.png" alt="" width="40" height="40" />XMUM <span>Navigate</span></a>
      <div className="header-actions"><button className="icon-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => { const next = theme === 'light' ? 'dark' : 'light'; sessionStorage.setItem('xmum-theme', next); setTheme(next); }}><span className="icon-swap" data-on={theme === 'light' ? 'a' : 'b'}><Moon size={20} aria-hidden="true" /><Sun size={20} aria-hidden="true" /></span></button></div>
    </header>}
    <main id="main" className={mapPage ? 'map-page-main' : undefined}>
      {homePage && <HomeHero destinations={campus?.destinations || []} />}
      {Page && (campus ? <Page campus={campus} reload={reload} user={user} setUser={setUser} signOut={signOut} />
        : <section className="not-found container"><h1>{pageTitle}</h1><p role="status">{offline ? 'The campus data could not load. Check your connection, then reload the page.' : 'Loading campus data…'}</p></section>)}
      {homePage && <>
        <nav className="feature-index container" id="features" aria-label="What you can do">{MODULES.map(({ title, icon: Icon, text, target }) => <a className="feature-link" href={target} key={title}><Icon size={24} aria-hidden="true" /><div><h2>{title}</h2><p>{text}</p></div><ChevronRight size={16} aria-hidden="true" /></a>)}</nav>
        <section className="how-section container" id="how-it-works" aria-labelledby="how-title"><h2 id="how-title">From search<br />to your next stop.</h2><ol className="steps"><li><h3>Find a destination</h3></li><li><h3>Check your route</h3></li><li><h3>Walk there</h3></li></ol></section>
        <section className="visitors-section container" id="visitors"><div><h2>New to XMUM?</h2><p>Keep campus directions close.</p><ul><li><Check size={18} aria-hidden="true" />iPhone and Android browsers</li><li><Check size={18} aria-hidden="true" />No download</li><li><Check size={18} aria-hidden="true" />No account</li></ul></div><div className="visitor-action"><button className="button primary" onClick={copyLink}><Copy size={18} aria-hidden="true" />Copy page link</button><span role="status">{copied || 'Share with a friend.'}</span>{copied.startsWith('Select') && <input ref={shareRef} aria-label="Page link to copy" readOnly value={window.location.href.split('#')[0]} />}</div><SCurve /></section>
      </>}
      {!Page && !homePage && <section className="not-found container"><h1>Page not found.</h1><p>Choose a campus feature from the navigation below.</p><a className="button primary" href="/">Back to the map</a></section>}
    </main>
    <BottomNavigation activePath={pathname === '/offices' ? '/map' : pathname} />
    {homePage && <footer className="site-footer container"><div><a className="wordmark" href="#main"><img src="/logo.png" alt="" width="40" height="40" />XMUM <span>Navigate</span></a><p>Xiamen University Malaysia</p><small>Student project. Not an official XMUM service.</small><p className="photo-credits">Photos: <a href="https://commons.wikimedia.org/wiki/File:Xiamen_University_Malaysia_at_afternoon.jpg">campus</a>, <a href="https://commons.wikimedia.org/wiki/File:Xiamen_University_Malaysia_library.jpg">library</a> (public domain); <a href="https://commons.wikimedia.org/wiki/File:Xmumtree.jpg">Xmumtree</a>: Doodoris, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Resized and cropped.</p></div><div className="footer-details"><a href="https://www.openstreetmap.org/copyright">Map data © OpenStreetMap contributors</a><a href="#how-it-works">How it works</a><a href="/admin">Admin</a></div></footer>}
  </div>;
}
