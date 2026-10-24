import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ArrowRight, ArrowLeft, MapPin, Navigation, Search, Building2, Utensils, Compass, Sun, Moon, Menu, X, Footprints, LocateFixed, Plus, Minus, RotateCcw, Check, Copy, Globe, Smartphone, GraduationCap } from 'lucide-react'

// Illustration coordinates only: these do not represent surveyed campus paths.
// Replace this sample data with verified campus buildings before connecting a real map.
const CONFIG = {
  start: [120, 280],
  places: [
    { id: 'a', name: 'Sample Building A', type: 'Academic building', x: 300, y: 145, distance: '180 m', time: '3 min', description: 'An example academic building on the campus preview.' },
    { id: 'b', name: 'Sample Building B', type: 'Academic building', x: 510, y: 160, distance: '320 m', time: '5 min', description: 'An example destination for your next class.' },
    { id: 'c', name: 'Sample Library', type: 'Study space', x: 370, y: 310, distance: '240 m', time: '4 min', description: 'An example place to read, study and take a break.' },
    { id: 'd', name: 'Sample Canteen', type: 'Food & dining', x: 620, y: 320, distance: '420 m', time: '6 min', description: 'An example campus dining destination.' },
    { id: 'e', name: 'Sample Event Hall', type: 'Event venue', x: 680, y: 110, distance: '500 m', time: '7 min', description: 'An example venue to explore for a campus event.' },
  ],
  offices: [
    { id: 'o1', name: 'Sample Admissions Office', building: 'a', floor: 2 },
    { id: 'o2', name: 'Sample Student Affairs Office', building: 'a', floor: 1 },
    { id: 'o3', name: 'Sample Finance Office', building: 'b', floor: 2 },
    { id: 'o4', name: 'Sample Faculty Office', building: 'b', floor: 3 },
  ],
}
const features = [
  { icon: Navigation, title: 'Campus Navigation', text: 'Find your next stop. Get outdoor walking directions between campus buildings.', label: 'A little direction goes a long way', scene: 'map', query: 'Sample Building' },
  { icon: Building2, title: 'Find an Office', text: 'Find the right building and floor, with a floor plan and written directions.', label: 'Less searching. More finding.', scene: 'office', query: 'Office' },
  { icon: Compass, title: 'Venue Finder', text: 'Have an event in mind? Discover venue suggestions that fit your plans.', label: 'A space for your next big idea', scene: 'venue', query: 'Event' },
  { icon: Utensils, title: 'Canteen Directory', text: 'Explore stalls, menus, prices and opening hours before you head over.', label: 'Good food is just around the corner', scene: 'food', query: 'Canteen' },
]

function CampusScene({ small = false }) {
  return <svg className={`campus-scene ${small ? 'small-map' : ''}`} viewBox="0 0 1100 600" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrative campus walking route between sample buildings. Not a geographical map.">
    <rect width="1100" height="600" fill="var(--map-land)"/>
    <g fill="var(--map-park)"><path d="M20 35h300v140H20zM755 20h325v170H755zM45 425h280v150H45zM770 420h300v160H770z"/><circle cx="720" cy="360" r="90"/></g>
    <g fill="none" stroke="var(--map-contour)" strokeWidth="1.5"><path d="M0 100Q200 0 450 110T1100 80M0 120Q200 20 450 130T1100 100M0 140Q200 40 450 150T1100 120M0 480Q250 390 500 510T1100 500M0 500Q250 410 500 530T1100 520"/></g>
    <path d="M-20 340Q270 255 520 330T1120 300" fill="none" stroke="var(--map-water)" strokeWidth="67"/>
    <g fill="none" stroke="var(--map-road-edge)" strokeWidth="24"><path d="M0 230h1100M365 0v600M680 0v600M0 450h1100M940 0v600"/></g>
    <g fill="none" stroke="var(--map-road)" strokeWidth="18"><path d="M0 230h1100M365 0v600M680 0v600M0 450h1100M940 0v600"/></g>
    <g fill="var(--map-building)" stroke="var(--map-building-edge)" strokeWidth="2"><rect x="455" y="95" width="140" height="88" rx="10"/><rect x="730" y="95" width="140" height="88" rx="10"/><rect x="750" y="385" width="140" height="90" rx="10"/><rect x="420" y="470" width="150" height="85" rx="10"/></g>
    <path d="M450 450H680V230H805V155" fill="none" stroke="var(--map-road)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M450 450H680V230H805V155" fill="none" stroke="var(--route-color)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="450" cy="450" r="20" fill="var(--start-marker)" stroke="var(--map-road)" strokeWidth="5"/><text x="450" y="456" textAnchor="middle" fill="var(--fixed-white)" fontSize="16" fontWeight="700">A</text>
    <circle cx="805" cy="155" r="20" fill="var(--end-marker)" stroke="var(--map-road)" strokeWidth="5"/><text x="805" y="161" textAnchor="middle" fill="var(--fixed-white)" fontSize="16" fontWeight="700">B</text>
    <g fill="var(--map-label-ink)" fontSize="14" fontWeight="600"><text x="455" y="82">Sample Building A</text><text x="730" y="82">Sample Building B</text><text x="770" y="505">Sample canteen</text><text x="435" y="579">Sample library</text></g>
    <text x="835" y="310" fill="var(--map-label-ink)" fontSize="13">Sample lake</text>
  </svg>
}

function FeatureArt({ kind }) {
  return <svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${kind === 'food' ? 'Canteen' : kind === 'office' ? 'Office floor plan' : kind === 'venue' ? 'Event hall' : 'Walking route'} illustration`}>
    {kind === 'map' ? <><path fill="#dfebe7" d="M0 0h320v190H0z"/><g fill="#c5d8ce"><path d="M12 20h81v50H12zm124 8h56v47h-56zm88-12h80v53h-80zM13 123h75v54H13zm197-10h94v67h-94z"/></g><g stroke="#f7faf7" fill="none" strokeWidth="17"><path d="M-10 99h340M112-10v210m91-210v210"/></g><path d="M54 151h58V99h90V47h54" fill="none" stroke="#2986fd" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="54" cy="151" r="9" fill="#2986fd" stroke="white" strokeWidth="4"/><path d="M254 20c-24 0-27 28 0 48 27-20 24-48 0-48" fill="#2986fd"/><circle cx="254" cy="37" r="6" fill="white"/></> : kind === 'office' ? <><path fill="#e9eef5" d="M0 0h320v190H0z"/><g transform="translate(46 26) rotate(-7 115 70)"><rect width="231" height="142" rx="7" fill="#fff"/><g stroke="#a8bbce" strokeWidth="3" fill="#eef3f7"><path d="M17 18h67v47H17zm89 0h106v47H106zM17 88h67v35H17zm89 0h106v35H106z"/></g><path d="M31 77h65v28h62" fill="none" stroke="#2986fd" strokeWidth="4" strokeDasharray="5 4"/><circle cx="159" cy="105" r="9" fill="#2986fd"/><text x="129" y="47" fill="#647689" fontSize="10">SAMPLE OFFICE</text></g></> : kind === 'venue' ? <><path fill="#dcebf3" d="M0 0h320v190H0z"/><path d="m24 76 136-55 136 55v9H24" fill="#7895a4"/><path d="M39 84h242v93H39" fill="#f3eee5"/><path d="M54 99h211v78H54" fill="#a6bbc6"/>{[65,105,145,185,225].map(x => <path key={x} d={`M${x} 84h14v93h-14Z`} fill="#f3eee5"/>)}<path d="M24 175h272v15H24" fill="#d3dbd8"/><g fill="#73917f"><ellipse cx="24" cy="146" rx="22" ry="30"/><ellipse cx="296" cy="146" rx="22" ry="30"/></g></> : <><path fill="#ebece8" d="M0 0h320v190H0z"/><path d="M46 73h228v99H46" fill="#f7f4ed"/><path d="M54 49h212l19 34H35Z" fill="#8eacbf"/>{[55,99,143,187,231].map(x => <path key={x} d={`m${x} 49-7 34h23l3-34Z`} fill="#d5e3ec"/>)}<rect x="65" y="100" width="190" height="49" rx="4" fill="#c9d7db"/><path d="M42 149h236v14H42" fill="#b4c3c7"/><g fill="#f5f4ed"><ellipse cx="104" cy="134" rx="24" ry="6"/><ellipse cx="164" cy="134" rx="24" ry="6"/><ellipse cx="224" cy="134" rx="18" ry="6"/></g><g fill="#839b86"><path d="M87 132q15-31 33 0Zm62 0q16-24 31 0Z"/></g><path d="M91 26h138" stroke="#a9bfc9" strokeWidth="2"/><text x="160" y="31" textAnchor="middle" fontSize="11" letterSpacing="3" fill="#526877">CAMPUS EATS</text></>}
  </svg>
}

function MapPanel({ destination, zoom, setZoom, select, reset }) {
  return <div className="map-panel">
    <div className="map-label"><MapPin size={15} aria-hidden="true"/> Campus preview <span>Illustrative map</span></div>
    <div className="map-art" style={{ '--map-zoom': zoom }}>
      <svg viewBox="0 0 800 430" preserveAspectRatio="none" className="map-drawing" aria-hidden="true">
        <rect width="800" height="430" fill="var(--map-land)"/>
        <g fill="var(--map-park)"><path d="M15 20h175v125H15zM550 10h230v60H550zM565 205h205v60H565zM20 340h200v75H20zM450 360h320v55H450z"/><circle cx="250" cy="350" r="36"/></g>
        <path d="M0 210Q180 190 290 240t240-10T800 200" stroke="var(--map-water)" strokeWidth="48" fill="none"/>
        <g fill="none" stroke="var(--map-road)" strokeWidth="18"><path d="M0 280h205V95h575M205 280h365v60h230M410 95v245M670 0v340"/></g>
        <g fill="var(--map-building)" stroke="var(--map-building-edge)" strokeWidth="2"><rect x="255" y="105" width="88" height="61" rx="6"/><rect x="463" y="120" width="90" height="62" rx="6"/><rect x="320" y="285" width="99" height="63" rx="6"/><rect x="575" y="292" width="91" height="55" rx="6"/><rect x="635" y="83" width="91" height="51" rx="6"/></g>
        <g fill="var(--map-park)">{[40, 80, 120, 720, 750].map((x, i) => <circle key={x} cx={x} cy={i < 3 ? 60 : 390} r="13"/>)}</g>
        {destination && <path d={`M${CONFIG.start[0]} ${CONFIG.start[1]}H205V205H${destination.x}V${destination.y}`} fill="none" stroke="var(--route-color)" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"/>}
        <circle cx={CONFIG.start[0]} cy={CONFIG.start[1]} r="10" fill="var(--start-marker)" stroke="var(--map-road)" strokeWidth="4"/>
        <text x="75" y="317" fill="var(--map-label-ink)" fontSize="12" fontWeight="600">Sample start</text><text x="447" y="239" fill="var(--map-label-ink)" fontSize="12">Sample lake</text>
      </svg>
      {CONFIG.places.map(p => <button key={p.id} className={`map-pin ${destination?.id === p.id ? 'selected' : ''}`} style={{ left: `${p.x / 8}%`, top: `${p.y / 4.3}%` }} aria-label={`Show sample route to ${p.name}`} aria-pressed={destination?.id === p.id} onClick={() => select(p)}><MapPin size={21} aria-hidden="true"/><span>{p.name.replace('Sample ', '')}<small>Sample</small></span></button>)}
    </div>
    <div className="map-zoom"><button aria-label="Zoom in on sample map" disabled={zoom >= 1.4} onClick={() => setZoom(z => Math.min(1.4, +(z + .2).toFixed(1)))}><Plus size={18}/></button><button aria-label="Zoom out on sample map" disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, +(z - .2).toFixed(1)))}><Minus size={18}/></button></div>
    <div className="map-bottom"><span>{destination ? 'Sample route' : 'Sample data for demonstration'}</span><button onClick={reset} aria-label="Reset map"><LocateFixed size={18}/></button></div>
  </div>
}

function Demo({ searchRef, query, setQuery }) {
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [zoom, setZoom] = useState(1)
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 1023px)').matches)
  const wrapper = useRef(null)
  const results = [...CONFIG.places, ...CONFIG.offices].filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()))
  const destination = selected?.building ? CONFIG.places.find(p => p.id === selected.building) : selected
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)')
    const change = e => setCompact(e.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    const close = e => { if (!wrapper.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
  useEffect(() => {
    if (open && active >= 0 && results[active]) {
      document.getElementById(`option-${results[active].id}`)?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    }
  }, [active, open, query])
  const select = place => { setSelected(place); setQuery(place.name); setOpen(false); setActive(-1) }
  const reset = () => { setSelected(null); setQuery(''); setZoom(1); setOpen(false) }
  return <section className="demo-section section" id="try-it">
    <div className="section-heading"><div><h2>Try a route around campus.</h2><p>Choose a sample building or find an office and its floor.</p></div><span className="sample-tag">Interactive sample</span></div>
    <div className="demo-layout">
      {compact && <MapPanel destination={destination} zoom={zoom} setZoom={setZoom} select={select} reset={reset}/>}
      <div className="demo-sidebar">
        <div className="demo-sidebar-heading"><span className="icon-circle"><Search size={21}/></span><h3>Where to?</h3></div>
        <p>Search a sample building or office.</p>
        <div className="search-wrapper" ref={wrapper} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setOpen(false); setActive(-1) } }}>
          <label htmlFor="place-search">Where do you want to go?</label>
          <div className="search-input"><Search size={18}/><input ref={searchRef} id="place-search" value={query} placeholder="Try “Admissions Office”" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="place-options" aria-activedescendant={open && active >= 0 && results[active] ? `option-${results[active].id}` : undefined} onFocus={() => setOpen(true)} onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1) }} onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(a => Math.min(a + 1, results.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
            if (e.key === 'Enter' && open && results.length) { e.preventDefault(); select(results[Math.max(active, 0)]) }
            if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); setActive(-1) }
          }}/></div>
          <ul className="search-options" id="place-options" role="listbox" aria-label="Sample destinations" hidden={!open}>{results.map((p, i) => <li key={p.id} id={`option-${p.id}`} role="option" aria-selected={i === active} onMouseDown={e => e.preventDefault()} onClick={() => select(p)}><MapPin size={17} aria-hidden="true"/><span>{p.name}<small>{p.building ? `Office in ${CONFIG.places.find(b => b.id === p.building).name}, Floor ${p.floor}` : p.type}</small></span></li>)}{!results.length && <li role="option" aria-disabled="true">No sample places found. Try “Building” or “Office”.</li>}</ul>
        </div>
        <div className="route-result" aria-live="polite" aria-atomic="true">
          {selected ? <>
            <h4>{selected.name}</h4>
            <p>Sample route</p>
            <div className="route-metrics"><span><Footprints size={18}/>{destination.distance}</span><span>{destination.time} walk</span></div>
            {selected.building ? <>
              <p>{destination.name}, Floor {selected.floor}</p>
              <ol className="directions"><li>Enter through the main entrance.</li><li>Take the lift to Floor {selected.floor}.</li><li>Turn left and follow the office signs.</li></ol>
              <div className="floor-plan"><span>Sample floor plan, Floor {selected.floor}</span><svg viewBox="0 0 230 85" role="img" aria-label="Sample floor plan with lift, corridor and office"><path d="M5 5h220v75H5Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M55 5v45h170M5 65h220M140 5v45" fill="none" stroke="currentColor"/><text x="15" y="30">Lift</text><text x="65" y="30">Room</text><rect x="142" y="7" width="80" height="40" fill="var(--color-primary)" opacity=".15"/><text x="158" y="30">Office</text><path d="M30 50v8h155V40" stroke="var(--color-primary)" strokeWidth="3" fill="none" strokeDasharray="4 3"/></svg></div>
            </> : <p>{selected.description}</p>}
            <button className="text-button" onClick={reset}><RotateCcw size={15}/> Reset preview</button>
          </> : <>
            <span className="mini-route" aria-hidden="true"><span/><i/><MapPin size={19}/></span>
            <h4>Choose your sample destination.</h4>
            <p>Choose a pin on the map or search above to see an example.</p>
            <div className="start-point"><LocateFixed size={18}/><span>Sample starting point<small>Location access is not requested</small></span></div>
          </>}
        </div>
      </div>
      {!compact && <MapPanel destination={destination} zoom={zoom} setZoom={setZoom} select={select} reset={reset}/>}
    </div>
    <p className="demo-note">An illustrative preview, not a geographical map. Routes on this page are examples. The real app calculates routes from surveyed campus paths.</p>
  </section>
}

export default function Home() {
  const [theme, setTheme] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [manualTheme, setManualTheme] = useState(false)
  const [menu, setMenu] = useState(false)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyFallback, setCopyFallback] = useState(false)
  const [featureScroll, setFeatureScroll] = useState({ start: true, end: false })
  const searchRef = useRef(null)
  const featureRow = useRef(null)
  const menuRef = useRef(null)
  const headerRef = useRef(null)
  const updateFeatureScroll = () => {
    const row = featureRow.current
    if (row) {
      const inset = parseFloat(getComputedStyle(row).paddingInlineStart) || 0
      setFeatureScroll({ start: row.scrollLeft <= inset + 4, end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 4 })
    }
  }
  useEffect(() => {
    const observer = new ResizeObserver(updateFeatureScroll)
    observer.observe(featureRow.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!menu) return
    const closeOnEscape = e => {
      if (e.key === 'Escape') { setMenu(false); menuRef.current?.focus() }
    }
    const closeOutside = e => { if (!headerRef.current?.contains(e.target)) setMenu(false) }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    return () => { document.removeEventListener('keydown', closeOnEscape); document.removeEventListener('pointerdown', closeOutside) }
  }, [menu])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => {
    if (manualTheme) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = e => setTheme(e.matches ? 'dark' : 'light')
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [manualTheme])
  const goToDemo = (value = '') => { setQuery(value); document.getElementById('try-it').scrollIntoView(); searchRef.current?.focus({ preventScroll: true }) }
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href.split('#')[0]); setCopied(true) }
    catch { setCopyFallback(true) }
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" ref={headerRef}><div className="header-inner">
      <a className="wordmark" href="#" aria-label="XMUM Navigate home">XMUM<span>Navigate<span className="brand-dot">.</span></span></a>
      <nav id="main-navigation" className={menu ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">{[['Features', 'features'], ['Try it', 'try-it'], ['How it works', 'how-it-works'], ['For visitors', 'visitors']].map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{name}</a>)}</nav>
      <div className="header-actions"><button className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => { setManualTheme(true); setTheme(t => t === 'light' ? 'dark' : 'light') }}>{theme === 'light' ? <Moon size={19} aria-hidden="true"/> : <Sun size={19} aria-hidden="true"/>}</button><a href="#try-it" className="button dark header-cta">Open campus preview <ArrowUpRight size={16}/></a><button ref={menuRef} className="menu-toggle" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={menu} onClick={() => setMenu(m => !m)}>{menu ? <X size={20} aria-hidden="true"/> : <Menu size={20} aria-hidden="true"/>}<span>Menu</span></button></div>
    </div></header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <CampusScene/>
        <div className="hero-wash"/>
        <div className="hero-copy"><h1 id="hero-title">Find your way<br/>around <span>XMUM.</span></h1><p>Walking routes, office directions, venue ideas and canteen menus in your browser.</p><div className="hero-actions"><a className="button primary" href="#try-it">Open the map <ArrowUpRight size={18}/></a><button className="hero-secondary" onClick={() => goToDemo('Office')}>Find an office <ArrowRight size={17}/></button></div><span className="browser-note"><Globe size={17} aria-hidden="true"/> Use your browser without a download or account.</span></div>
        <div className="scene-caption">Sample walking route <small>Illustrative map, not surveyed campus data</small></div>
        <div className="hero-note"><a href="#features"><span className="note-icon"><Compass size={25}/></span><span>A place for every<br/><strong>part of your day.</strong></span><ArrowUpRight size={24}/></a></div>
      </section>
      <div className="intro-strip content-width"><span className="intro-pill">Made for your campus day</span><div><span>New here?</span> You’re in the right place.</div><span className="intro-audience">Students <span>/</span> Visitors <span>/</span> Parents</span></div>
      <section className="features section" id="features">
        <div className="section-heading"><div><h2>From your next class to lunch.</h2><p>Find a building, locate an office, explore venues or browse food.</p></div><div className="carousel-controls"><button disabled={featureScroll.start} aria-label="Scroll features left" onClick={() => featureRow.current.scrollBy({ left: -320, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowLeft size={19}/></button><button disabled={featureScroll.end} className="next" aria-label="Scroll features right" onClick={() => featureRow.current.scrollBy({ left: 320, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowRight size={19}/></button></div></div>
        <div className="feature-grid" ref={featureRow} onScroll={updateFeatureScroll}>{features.map(({ icon: Icon, ...f }, i) => <article className="feature-card" key={f.title}><button className="feature-art" aria-label={`Preview sample destination for ${f.title}`} onClick={() => goToDemo(f.query)}><FeatureArt kind={f.scene}/><span className="art-number">0{i + 1}</span><span className="art-arrow"><ArrowUpRight size={19}/></span></button><div className="feature-title"><h3>{f.title}</h3><Icon size={20} aria-hidden="true"/></div><p>{f.text}</p>{f.scene === 'office' && <span className="office-tag">Floor plans & directions. No live tracking.</span>}</article>)}</div>
      </section>
      <Demo searchRef={searchRef} query={query} setQuery={setQuery}/>
      <section className="how-section section" id="how-it-works"><div className="center-heading"><h2>Search. See the route. Walk there.</h2><p>Outdoor routes between buildings, with written directions for offices.</p></div><div className="step-grid">
        <article className="step-card"><div className="step-top"><span className="icon-circle"><Search size={23}/></span><span className="step-number">01</span></div><div><h3>Find your place</h3><p>Type a building, office or place.<br/>We’ll help you find the right starting point.</p></div></article>
        <article className="step-card highlighted"><div className="step-top"><span className="icon-circle"><Navigation size={23}/></span><span className="step-number">02</span></div><div><h3>See the way</h3><p>See the outdoor walking route, sample distance and walking time in the preview.</p><a href="#try-it">Try the route preview <ArrowUpRight size={16}/></a></div><span className="step-decoration"/></article>
        <article className="step-card"><div className="step-top"><span className="icon-circle"><Footprints size={23}/></span><span className="step-number">03</span></div><div><h3>Make your move</h3><p>Follow the route on your phone.<br/>Explore campus at your own pace.</p></div></article>
      </div></section>
      <section className="visitors section" id="visitors"><div className="visitor-art"><CampusScene small/><div className="visitor-art-label"><GraduationCap size={19}/><span>Every campus journey<br/><strong>starts somewhere.</strong></span></div></div><div className="visitor-copy"><h2>A new place.<br/>A familiar feeling.</h2><p>Whether you’re finding your first class or visiting someone who is, a little direction makes all the difference.</p><ul><li><Globe size={19}/><span>Open in your browser. No download, no account.</span></li><li><Smartphone size={19}/><span>At home on iPhone, Android and desktop.</span></li><li><Compass size={19}/><span>Made for people who are new to campus.</span></li></ul><button className="button dark" onClick={copyLink}>{copied ? 'Link copied' : 'Copy page link'}{copied ? <Check size={17}/> : <Copy size={17}/>}</button><span className="copy-status" role="status">{copied ? 'Page link copied to clipboard.' : ''}</span>{copyFallback && <label className="copy-fallback">Copy this page link<input value={window.location.href.split('#')[0]} readOnly onFocus={e => e.target.select()}/></label>}</div></section>
      <section className="closing-banner content-width"><div><h2>Let’s find your next stop.</h2></div><a href="#try-it" className="button dark">Open sample map <ArrowUpRight size={18}/></a><span className="banner-ring"/></section>
    </main>
    <footer className="site-footer content-width"><div className="footer-main"><a className="wordmark" href="#">XMUM<span>Navigate<span className="brand-dot">.</span></span></a><p>A little direction for your campus day.</p><a href="#main" className="back-top">Back to top <ArrowUpRight size={16}/></a></div><div className="footer-bottom"><span>Final Year Project · Xiamen University Malaysia<br/>This is a student project, not an official XMUM service.</span><span>Contact: [project email to be added]<br/>All preview places and routes use sample data.</span></div></footer>
  </>
}
