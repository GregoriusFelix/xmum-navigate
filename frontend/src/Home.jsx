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
  return <svg className="campus-scene" viewBox="0 0 1100 600" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of a sunlit campus with academic buildings, a lake and walking paths. Not an actual campus map.">
    <defs>
      <linearGradient id={small ? 'sky-small' : 'sky'} x2="0" y2="1"><stop stopColor="#9ed3f1"/><stop offset="1" stopColor="#e5f3fb"/></linearGradient>
      <linearGradient id={small ? 'water-small' : 'water'} x2="0" y2="1"><stop stopColor="#9fc7cc"/><stop offset="1" stopColor="#c5dde0"/></linearGradient>
      <pattern id={small ? 'windows-small' : 'windows'} width="23" height="27" patternUnits="userSpaceOnUse"><rect x="4" y="5" width="11" height="16" rx="1" fill="#708b9a"/><path d="M9 5v16" stroke="#b9cbd1" strokeWidth="2"/></pattern>
    </defs>
    <path fill={`url(#${small ? 'sky-small' : 'sky'})`} d="M0 0h1100v600H0z"/>
    <g fill="white" opacity=".65"><ellipse cx="235" cy="103" rx="135" ry="24"/><ellipse cx="305" cy="84" rx="70" ry="36"/><ellipse cx="905" cy="97" rx="170" ry="28"/><ellipse cx="805" cy="77" rx="65" ry="32"/><ellipse cx="615" cy="175" rx="100" ry="17"/></g>
    <path d="M0 350Q140 305 300 334T650 325T1100 340V600H0" fill="#a6b7a2"/>
    <path d="M0 411Q250 382 490 420T1100 394V600H0" fill={`url(#${small ? 'water-small' : 'water'})`}/>
    <path d="M320 600 685 383h415v43H710L455 600" fill="#ece9de"/>
    <path d="m373 600 326-196h401" fill="none" stroke="#d7d4c9" strokeWidth="3"/>
    <g transform="translate(460 176)">
      <path d="M0 92 160 39l202 24v209L0 246Z" fill="#e6e0d2"/>
      <path d="m160 39 202 24v209l-202-35Z" fill="#d5ccbc"/>
      <path d="m-12 91 172-62 216 27-14 15-202-24L0 103Z" fill="#71898d"/>
      <path d="M18 108 149 64v150L18 233Z" fill={`url(#${small ? 'windows-small' : 'windows'})`}/>
      <path d="m178 80 165 19v145l-165-25Z" fill={`url(#${small ? 'windows-small' : 'windows'})`}/>
      <path d="m157 40 8 196M0 154l160-37 202 28M0 204l160-31 202 28" fill="none" stroke="#f1ece0" strokeWidth="8"/>
      <path d="M214 185h69v64l-69-11Z" fill="#526b76"/>
      <path d="m207 181 82 8 9 10-99-9Z" fill="#eee9dc"/>
    </g>
    <g transform="translate(848 124)"><path d="M0 93 105 40l150 24v240L0 280Z" fill="#e9e4d8"/><path d="m105 40 150 24v240l-150-25Z" fill="#d7ccba"/><path d="m-12 91 117-62 162 27-11 14-151-23L0 105Z" fill="#6c8286"/><path d="m17 111 76-40v184l-76 14Zm107-40 114 17v188l-114-17Z" fill={`url(#${small ? 'windows-small' : 'windows'})`}/><path d="M0 156 105 107l150 21M0 216l105-45 150 22" fill="none" stroke="#f0eadd" strokeWidth="9"/></g>
    <g fill="#758e78"><ellipse cx="472" cy="385" rx="24" ry="35"/><ellipse cx="831" cy="393" rx="23" ry="36"/><ellipse cx="1090" cy="416" rx="30" ry="41"/></g>
    <g stroke="#6b7e66" strokeWidth="5"><path d="M472 385v39m359-31v37m259-14v42"/></g>
    <g stroke="#eef5f4" opacity=".5" fill="none" strokeWidth="2"><path d="M30 460h170m-90 20h160m240 44h145M45 556h180m420 13h100"/></g>
    <g fill="#677c68"><path d="M0 600V465q38-42 69 8 40-49 71 10 54-30 68 27 67-12 75 90Z"/><path d="M900 600q14-68 55-46 5-54 47-36 19-72 59-33 22-32 39-27v142Z"/></g>
    <g fill="none" stroke="#476758" strokeWidth="4"><path d="M96 600V456m0 30-40-14m40 44 45-22M1036 600V485m0 35-33-17m33 46 41-25"/></g>
    <g stroke="#536b70" fill="none" strokeWidth="2" opacity=".65"><path d="m725 113 7-3 7 3m19 16 6-3 6 3m-60 9 6-3 6 3"/></g>
  </svg>
}

function FeatureArt({ kind }) {
  return <svg viewBox="0 0 320 190" role="img" aria-label={`${kind === 'food' ? 'Canteen' : kind === 'office' ? 'Office floor plan' : kind === 'venue' ? 'Event hall' : 'Walking route'} illustration`}>
    {kind === 'map' ? <><path fill="#dfebe7" d="M0 0h320v190H0z"/><g fill="#c5d8ce"><path d="M12 20h81v50H12zm124 8h56v47h-56zm88-12h80v53h-80zM13 123h75v54H13zm197-10h94v67h-94z"/></g><g stroke="#f7faf7" fill="none" strokeWidth="17"><path d="M-10 99h340M112-10v210m91-210v210"/></g><path d="M54 151h58V99h90V47h54" fill="none" stroke="#2986fd" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="54" cy="151" r="9" fill="#2986fd" stroke="white" strokeWidth="4"/><path d="M254 20c-24 0-27 28 0 48 27-20 24-48 0-48" fill="#2986fd"/><circle cx="254" cy="37" r="6" fill="white"/></> : kind === 'office' ? <><path fill="#e9eef5" d="M0 0h320v190H0z"/><g transform="translate(46 26) rotate(-7 115 70)"><rect width="231" height="142" rx="7" fill="#fff"/><g stroke="#a8bbce" strokeWidth="3" fill="#eef3f7"><path d="M17 18h67v47H17zm89 0h106v47H106zM17 88h67v35H17zm89 0h106v35H106z"/></g><path d="M31 77h65v28h62" fill="none" stroke="#2986fd" strokeWidth="4" strokeDasharray="5 4"/><circle cx="159" cy="105" r="9" fill="#2986fd"/><text x="129" y="47" fill="#647689" fontSize="10">SAMPLE OFFICE</text></g></> : kind === 'venue' ? <><path fill="#dcebf3" d="M0 0h320v190H0z"/><path d="m24 76 136-55 136 55v9H24" fill="#7895a4"/><path d="M39 84h242v93H39" fill="#f3eee5"/><path d="M54 99h211v78H54" fill="#a6bbc6"/>{[65,105,145,185,225].map(x => <path key={x} d={`M${x} 84h14v93h-14Z`} fill="#f3eee5"/>)}<path d="M24 175h272v15H24" fill="#d3dbd8"/><g fill="#73917f"><ellipse cx="24" cy="146" rx="22" ry="30"/><ellipse cx="296" cy="146" rx="22" ry="30"/></g></> : <><path fill="#ebece8" d="M0 0h320v190H0z"/><path d="M46 73h228v99H46" fill="#f7f4ed"/><path d="M54 49h212l19 34H35Z" fill="#8eacbf"/>{[55,99,143,187,231].map(x => <path key={x} d={`m${x} 49-7 34h23l3-34Z`} fill="#d5e3ec"/>)}<rect x="65" y="100" width="190" height="49" rx="4" fill="#c9d7db"/><path d="M42 149h236v14H42" fill="#b4c3c7"/><g fill="#f5f4ed"><ellipse cx="104" cy="134" rx="24" ry="6"/><ellipse cx="164" cy="134" rx="24" ry="6"/><ellipse cx="224" cy="134" rx="18" ry="6"/></g><g fill="#839b86"><path d="M87 132q15-31 33 0Zm62 0q16-24 31 0Z"/></g><path d="M91 26h138" stroke="#a9bfc9" strokeWidth="2"/><text x="160" y="31" textAnchor="middle" fontSize="11" letterSpacing="3" fill="#526877">CAMPUS EATS</text></>}
  </svg>
}

function Demo({ searchRef, query, setQuery }) {
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [zoom, setZoom] = useState(1)
  const wrapper = useRef(null)
  const results = [...CONFIG.places, ...CONFIG.offices].filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
  const destination = selected?.building ? CONFIG.places.find(p => p.id === selected.building) : selected
  useEffect(() => {
    const close = e => { if (!wrapper.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
  const select = place => { setSelected(place); setQuery(place.name); setOpen(false); setActive(-1) }
  const reset = () => { setSelected(null); setQuery(''); setZoom(1); setOpen(false) }
  return <section className="demo-section section" id="try-it">
    <div className="section-heading"><div><span className="eyebrow blue">A LITTLE PREVIEW</span><h2>Your next stop starts here.</h2><p>Try a sample route. Get a feel for a more familiar campus.</p></div><span className="sample-tag"><span/> Interactive sample</span></div>
    <div className="demo-layout">
      <div className="demo-sidebar">
        <div className="demo-sidebar-heading"><span className="icon-circle"><Search size={21}/></span><h3>Where to?</h3></div>
        <p>Search a sample building or office.</p>
        <div className="search-wrapper" ref={wrapper}>
          <label htmlFor="place-search">Where do you want to go?</label>
          <div className="search-input"><Search size={18}/><input ref={searchRef} id="place-search" value={query} placeholder="Try “Admissions Office”" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="place-options" aria-activedescendant={open && active >= 0 && results[active] ? `option-${results[active].id}` : undefined} onFocus={() => setOpen(true)} onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1) }} onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(a => Math.min(a + 1, results.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
            if (e.key === 'Enter' && open && results.length) { e.preventDefault(); select(results[Math.max(active, 0)]) }
            if (e.key === 'Escape') { setOpen(false); setActive(-1) }
          }}/></div>
          {open && <ul className="search-options" id="place-options" role="listbox" aria-label="Sample destinations">{results.map((p, i) => <li key={p.id} id={`option-${p.id}`} role="option" aria-selected={i === active} onMouseDown={e => e.preventDefault()} onClick={() => select(p)}><MapPin size={17}/><span>{p.name}<small>{p.building ? `Office in ${CONFIG.places.find(b => b.id === p.building).name}, Floor ${p.floor}` : p.type}</small></span></li>)}{!results.length && <li role="option" aria-disabled="true">No sample places found.</li>}</ul>}
        </div>
        <div className="route-result" aria-live="polite" aria-atomic="true">
          {selected ? <><span className="eyebrow blue">SAMPLE ROUTE</span><h4>{selected.name}</h4><div className="route-metrics"><span><Footprints size={18}/>{destination.distance}</span><span>{destination.time} walk</span></div>{selected.building ? <><p>{destination.name} · Floor {selected.floor}</p><ol className="directions"><li>Enter through the main entrance.</li><li>Take the lift to Floor {selected.floor}.</li><li>Turn left and follow the office signs.</li></ol><div className="floor-plan"><span>Sample floor plan · Floor {selected.floor}</span><svg viewBox="0 0 230 85" role="img" aria-label="Sample floor plan with lift, corridor and office"><path d="M5 5h220v75H5Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M55 5v45h170M5 65h220M140 5v45" fill="none" stroke="currentColor"/><text x="15" y="30">Lift</text><text x="65" y="30">Room</text><rect x="142" y="7" width="80" height="40" fill="var(--color-primary)" opacity=".15"/><text x="158" y="30">Office</text><path d="M30 50v8h155V40" stroke="var(--color-primary)" strokeWidth="3" fill="none" strokeDasharray="4 3"/></svg></div></> : <p>{selected.description}</p>}<button className="text-button" onClick={reset}><RotateCcw size={15}/> Reset preview</button></> : <><span className="mini-route"><span/><i/><MapPin size={19}/></span><h4>A familiar route starts<br/>with a little exploring.</h4><p>Choose a pin on the map or search above to see an example.</p><div className="start-point"><LocateFixed size={18}/><span>Sample starting point<small>No location access needed</small></span></div></>}
        </div>
      </div>
      <div className="map-panel">
        <div className="map-label"><MapPin size={15}/> Campus preview <span>Illustrative map</span></div>
        <div className="map-art" style={{ '--map-zoom': zoom }}>
          <svg viewBox="0 0 800 430" preserveAspectRatio="none" className="map-drawing" aria-hidden="true"><rect width="800" height="430" fill="#eaf0e9"/><g fill="#d7e3d5"><path d="M15 20h175v125H15zM550 10h230v60H550zM565 205h205v60H565zM20 340h200v75H20zM450 360h320v55H450z"/><circle cx="250" cy="350" r="36"/></g><path d="M0 210Q180 190 290 240t240-10T800 200" stroke="#c4dfe7" strokeWidth="48" fill="none"/><g fill="none" stroke="#fff" strokeWidth="18"><path d="M0 280h205V95h575M205 280h365v60h230M410 95v245M670 0v340"/></g><g fill="#cad4d9" stroke="#b6c3cb" strokeWidth="2"><rect x="255" y="105" width="88" height="61" rx="6"/><rect x="463" y="120" width="90" height="62" rx="6"/><rect x="320" y="285" width="99" height="63" rx="6"/><rect x="575" y="292" width="91" height="55" rx="6"/><rect x="635" y="83" width="91" height="51" rx="6"/></g><g fill="#a4bda5">{[40,80,120,720,750].map((x,i) => <circle key={x} cx={x} cy={i < 3 ? 60 : 390} r="13"/>)}</g>{destination && <path d={`M120 280H205V205H${destination.x}V${destination.y}`} fill="none" stroke="#2986fd" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="9 7"/>}<circle cx="120" cy="280" r="17" fill="#2986fd" opacity=".15"/><circle cx="120" cy="280" r="8" fill="#2986fd" stroke="white" strokeWidth="4"/><text x="75" y="317" fill="#405960" fontSize="12" fontWeight="600">Sample start</text><text x="447" y="239" fill="#65868e" fontSize="12" letterSpacing="3">SAMPLE LAKE</text></svg>
          {CONFIG.places.map(p => <button key={p.id} className={`map-pin ${destination?.id === p.id ? 'selected' : ''}`} style={{ left: `${p.x / 8}%`, top: `${p.y / 4.3}%` }} aria-label={`Show sample route to ${p.name}`} aria-pressed={destination?.id === p.id} onClick={() => select(p)}><MapPin size={21}/><span>{p.name.replace('Sample ', '')}<small>Sample</small></span></button>)}
        </div>
        <div className="map-zoom"><button aria-label="Zoom in on sample map" disabled={zoom >= 1.4} onClick={() => setZoom(z => Math.min(1.4, +(z + .2).toFixed(1)))}><Plus size={18}/></button><button aria-label="Zoom out on sample map" disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, +(z - .2).toFixed(1)))}><Minus size={18}/></button></div>
        <div className="map-bottom"><span><span className="blue-dot"/> {destination ? 'Sample route' : 'Sample data for demonstration'}</span><button onClick={reset} aria-label="Reset map"><LocateFixed size={18}/></button></div>
      </div>
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
  const searchRef = useRef(null)
  const featureRow = useRef(null)
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
    <header className="site-header"><div className="header-inner">
      <a className="wordmark" href="#" aria-label="XMUM Navigate home">XMUM<span>Navigate<span className="brand-dot">.</span></span></a>
      <nav className={menu ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">{[['Features', 'features'], ['Try it', 'try-it'], ['How it works', 'how-it-works'], ['For visitors', 'visitors']].map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{name}</a>)}</nav>
      <div className="header-actions"><button className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => { setManualTheme(true); setTheme(t => t === 'light' ? 'dark' : 'light') }}>{theme === 'light' ? <Moon size={19}/> : <Sun size={19}/>}</button><a href="#try-it" className="button dark header-cta">Explore campus <ArrowUpRight size={16}/></a><button className="menu-toggle" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(m => !m)}>{menu ? <X/> : <Menu/>}</button></div>
    </div></header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <CampusScene/>
        <div className="hero-wash"/>
        <div className="hero-copy"><span className="eyebrow"><span className="tiny-line"/> A LITTLE GUIDANCE. A LOT TO DISCOVER.</span><h1 id="hero-title">Find your way<br/>around <span>XMUM.</span></h1><p>Walking routes, office lookup, venue ideas and canteen menus. Your campus, a little more familiar.</p><div className="hero-actions"><a className="button primary" href="#try-it">Open the map <ArrowUpRight size={18}/></a><button className="hero-secondary" onClick={() => goToDemo('Office')}>Find an office <ArrowRight size={17}/></button></div><span className="browser-note"><Globe size={15}/> In your browser. No app to install.</span></div>
        <div className="scene-caption"><span/> A fresh perspective on campus <small>Campus illustration</small></div>
        <div className="hero-notch"><a href="#features"><span className="notch-icon"><Compass size={25}/></span><span>A place for every<br/><strong>part of your day.</strong></span><ArrowUpRight size={24}/></a></div>
      </section>
      <div className="intro-strip content-width"><span className="intro-pill"><span className="blue-dot"/> MADE FOR YOUR CAMPUS DAY</span><div><span>New here?</span> You’re in the right place.</div><span className="intro-audience">Students <span>·</span> Visitors <span>·</span> Parents</span></div>
      <section className="features section" id="features">
        <div className="section-heading"><div><span className="eyebrow blue">ONE CAMPUS. MORE POSSIBILITIES.</span><h2>A little help, wherever you’re headed.</h2><p>From your first lecture to your next lunch break. Find what you need.</p></div><div className="carousel-controls"><button aria-label="Scroll features left" onClick={() => featureRow.current.scrollBy({ left: -320, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowLeft size={19}/></button><button className="next" aria-label="Scroll features right" onClick={() => featureRow.current.scrollBy({ left: 320, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowRight size={19}/></button></div></div>
        <div className="feature-grid" ref={featureRow}>{features.map(({ icon: Icon, ...f }, i) => <article className="feature-card" key={f.title}><button className="feature-art" aria-label={`Preview ${f.title}`} onClick={() => goToDemo(f.query)}><FeatureArt kind={f.scene}/><span className="art-number">0{i + 1}</span><span className="art-arrow"><ArrowUpRight size={19}/></span></button><div className="feature-title"><h3>{f.title}</h3><Icon size={20}/></div><p>{f.text}</p>{f.scene === 'office' && <span className="office-tag">Floor plans & directions. No live tracking.</span>}</article>)}</div>
      </section>
      <Demo searchRef={searchRef} query={query} setQuery={setQuery}/>
      <section className="how-section section" id="how-it-works"><div className="center-heading"><span className="eyebrow blue">LESS GUESSWORK. MORE GOING.</span><h2>From “where is it?” to “here I am.”</h2><p>A few simple steps to make yourself at home.</p></div><div className="step-grid">
        <article className="step-card"><div className="step-top"><span className="icon-circle"><Search size={23}/></span><span className="step-number">01</span></div><div><h3>Find your place</h3><p>Type a building, office or place.<br/>We’ll help you find the right starting point.</p></div></article>
        <article className="step-card highlighted"><div className="step-top"><span className="icon-circle"><Navigation size={23}/></span><span className="step-number">02</span></div><div><h3>See the way</h3><p>See the outdoor walking route, sample distance and walking time in the preview.</p><a href="#try-it">TRY THE PREVIEW <ArrowUpRight size={16}/></a></div><span className="step-decoration"/></article>
        <article className="step-card"><div className="step-top"><span className="icon-circle"><Footprints size={23}/></span><span className="step-number">03</span></div><div><h3>Make your move</h3><p>Follow the route on your phone.<br/>Explore campus at your own pace.</p></div></article>
      </div></section>
      <section className="visitors section" id="visitors"><div className="visitor-art"><CampusScene small/><div className="visitor-art-label"><GraduationCap size={19}/><span>Every campus journey<br/><strong>starts somewhere.</strong></span></div></div><div className="visitor-copy"><span className="eyebrow blue">FIRST TIME HERE? WELCOME.</span><h2>A new place.<br/>A familiar feeling.</h2><p>Whether you’re finding your first class or visiting someone who is, a little direction makes all the difference.</p><ul><li><Globe size={19}/><span>Open in your browser. No download, no account.</span></li><li><Smartphone size={19}/><span>At home on iPhone, Android and desktop.</span></li><li><Compass size={19}/><span>Made for people who are new to campus.</span></li></ul><button className="button dark" onClick={copyLink}>{copied ? 'Link copied' : 'Share a little direction'}{copied ? <Check size={17}/> : <Copy size={17}/>}</button><span className="copy-status" role="status">{copied ? 'Page link copied to clipboard.' : ''}</span>{copyFallback && <label className="copy-fallback">Copy this page link<input value={window.location.href.split('#')[0]} readOnly onFocus={e => e.target.select()}/></label>}</div></section>
      <section className="closing-banner content-width"><div><span className="eyebrow">YOUR CAMPUS IS WAITING</span><h2>Let’s find your next stop.</h2></div><a href="#try-it" className="button dark">Explore the preview <ArrowUpRight size={18}/></a><span className="banner-ring"/></section>
    </main>
    <footer className="site-footer content-width"><div className="footer-main"><a className="wordmark" href="#">XMUM<span>Navigate<span className="brand-dot">.</span></span></a><p>A little direction for your campus day.</p><a href="#main" className="back-top">Back to top <ArrowUpRight size={16}/></a></div><div className="footer-bottom"><span>Final Year Project · Xiamen University Malaysia<br/>This is a student project, not an official XMUM service.</span><span>Contact: [project email to be added]<br/>All preview places and routes use sample data.</span></div></footer>
  </>
}
