import { Compass, MapPin, Sparkles, UtensilsCrossed } from 'lucide-react'
import './Home.css'

export default function Home() {
  return (
    <div className="home" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header page-width">
        <a className="wordmark" href="#top" aria-label="XMUM Navigate home">
          <Compass size={30} strokeWidth={1.5} aria-hidden="true" />
          <span>XMUM <strong>Navigate</strong></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#navigate">Navigate</a>
          <a href="#venues">Venues</a>
          <a href="#canteens">Canteens</a>
        </nav>
        <span className="status-badge"><span />In development</span>
      </header>

      <main id="main">
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span />A little direction. A better first day.</p>
            <h1 id="hero-title">Find your way<br />around XMUM,<br /><span>from day one.</span></h1>
            <p className="hero-description">A campus companion for new students, parents, and first-time visitors.</p>
            <a className="primary-button" href="#features">Get to know your campus</a>
            <p className="hero-note">Less wandering. More feeling at home.</p>
          </div>

          <div className="route-illustration" aria-hidden="true">
            <div className="map-caption"><MapPin size={15} strokeWidth={1.5} />Xiamen University Malaysia</div>
            <svg className="campus-sketch" viewBox="0 0 500 420" fill="none">
              <g className="map-grid" stroke="currentColor" strokeWidth="1">
                <path d="M35 95H465M35 155H465M35 215H465M35 275H465M35 335H465M95 45V380M155 45V380M215 45V380M275 45V380M335 45V380M395 45V380" />
              </g>
              <g stroke="#BCC7B7" strokeWidth="1.5" strokeLinejoin="round">
                <path d="m76 89 83-8 6 62-81 7zM91 98l59-6 4 41-57 6z" />
                <path d="m243 72 90 3-3 60-91-4zM251 82l70 2-2 40-70-3z" />
                <path d="m380 199 63-5 5 79-63 4zM391 209l42-3 3 57-42 3z" />
                <path d="m205 280 72-3 4 68-72 4zM216 290l50-2 3 47-50 3z" />
                <path d="m66 235 43-3 4 44-44 4z" />
              </g>
              <g stroke="#A9B9A3" strokeWidth="1.6" strokeLinecap="round">
                <path d="M193 185c-13-3-12-20-2-23-2-14 17-18 21-5 14-3 20 17 7 22 0 10-18 17-26 6ZM205 177v23M320 320c-12-2-13-16-4-20-3-12 15-17 19-5 13-1 17 16 6 20-2 10-15 13-21 5ZM328 312v23M386 101c-10-3-11-16-2-19-2-11 13-15 17-5 12-2 17 13 7 18-1 10-15 13-22 6ZM395 94v18" />
              </g>
              <path d="M91 326c44 18 84-4 78-43-5-32-48-38-42-76 6-39 66-26 105-23 43 4 75-5 77-38 1-27 25-40 52-24" stroke="#F1F3EE" strokeWidth="13" strokeLinecap="round" />
              <path className="dotted-route" d="M91 326c44 18 84-4 78-43-5-32-48-38-42-76 6-39 66-26 105-23 43 4 75-5 77-38 1-27 25-40 52-24" stroke="#2B6957" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
              <circle cx="91" cy="326" r="8" fill="#F1F3EE" stroke="#2B6957" strokeWidth="2" />
              <circle cx="91" cy="326" r="3" fill="#2B6957" />
              <ellipse cx="363" cy="137" rx="24" ry="6" fill="#2B6957" fillOpacity=".08" />
              <path d="M363 138s-24-26-24-43c0-33 48-33 48 0 0 17-24 43-24 43Z" fill="#2B6957" stroke="#2B6957" strokeWidth="2" />
              <circle cx="363" cy="94" r="8" fill="#F1F3EE" />
              <path d="m400 65 9-11M409 80l14-2M382 55l3-13" stroke="#C99A3E" strokeWidth="2" strokeLinecap="round" />
              <path d="M55 353c-5-12-13-17-22-16M32 337l3 9m-3-9 9-1" stroke="#6B7062" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="45" y="380" fill="#6B7062" fontSize="14" transform="rotate(-5 45 380)">You are here. And that’s a start.</text>
              <g stroke="#6B7062" strokeWidth="1.3" strokeLinecap="round"><path d="M447 331v28m-6-19 6-9 6 9" /></g>
              <text x="443" y="322" fill="#6B7062" fontSize="11">N</text>
            </svg>
            <span className="sketch-note">A little less lost.</span>
            <p className="illustration-disclaimer">An illustration, not a campus map</p>
          </div>
        </section>

        <section className="features page-width" id="features" aria-labelledby="features-title">
          <div className="section-intro">
            <div><p className="eyebrow">Your campus, a little clearer</p><h2 id="features-title">Where are you headed?</h2></div>
            <p>Three ways to make yourself at home.<br />Here’s what’s taking shape.</p>
          </div>
          <div className="signposts">
            <article className="feature feature-navigate" id="navigate">
              <div className="sign-arm"><Compass size={29} strokeWidth={1.5} aria-hidden="true" /><h3>Navigate</h3><span className="sign-number">01</span></div>
              <div className="feature-copy"><p>From the front gate<br />to the right door.</p><span>Outdoor routes to buildings, plus indoor directions to offices, floor by floor.</span><div className="feature-tags"><span>Outdoor routes</span><span>Indoor directions</span></div></div>
            </article>
            <article className="feature feature-venues" id="venues">
              <div className="sign-arm"><Sparkles size={29} strokeWidth={1.5} aria-hidden="true" /><h3>Find a venue</h3><span className="sign-number">02</span></div>
              <div className="feature-copy"><p>The right space<br />for what you have in mind.</p><span>Compare venues by capacity, equipment, and whether they’re indoors or out.</span><div className="feature-tags"><span>Room capacity</span><span>Facilities</span></div></div>
            </article>
            <article className="feature feature-canteens" id="canteens">
              <div className="sign-arm"><UtensilsCrossed size={29} strokeWidth={1.5} aria-hidden="true" /><h3>Canteens</h3><span className="sign-number">03</span></div>
              <div className="feature-copy"><p>A good meal,<br />without the guesswork.</p><span>Browse stalls, menus, and opening hours before you make the walk over.</span><div className="feature-tags"><span>Stall menus</span><span>Opening hours</span></div></div>
            </article>
          </div>
        </section>

        <section className="why-section page-width" aria-labelledby="why-title">
          <div className="why-heading"><p className="eyebrow"><span />Why this exists</p><h2 id="why-title">A big campus.<br />A familiar feeling.</h2></div>
          <div className="why-copy"><p>Being new is enough to figure out. Finding your way shouldn’t be the hardest part.</p><p>On a large campus, a building name isn’t always enough. New students, parents, and visitors can all use a little direction. XMUM Navigate is a final year project built to help with those everyday moments, from finding an office to deciding where to eat.</p><span className="project-note">Still being built. With first days in mind.</span></div>
        </section>
      </main>

      <footer className="site-footer page-width">
        <a className="wordmark footer-wordmark" href="#top"><Compass size={23} strokeWidth={1.5} aria-hidden="true" /><span>XMUM <strong>Navigate</strong></span></a>
        <p>Final Year Project, XMUM School of Computing and Data Science</p>
        <span className="footer-status"><span />In development</span>
      </footer>
    </div>
  )
}
