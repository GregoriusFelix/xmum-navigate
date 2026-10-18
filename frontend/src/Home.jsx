import { Compass, Sparkles, UtensilsCrossed } from 'lucide-react'
import './Home.css'

function RouteIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        className="hero-illustration__route"
        d="M 24 160 Q 80 140, 110 110 T 180 70 T 240 48"
        stroke="#2B6957"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 8"
      />
      <circle cx="24" cy="160" r="5" fill="#6B7062" />
      <path
        className="hero-illustration__pin"
        d="M 240 48 C 240 38, 232 32, 224 32 C 216 32, 208 38, 208 48 C 208 58, 224 72, 224 72 C 224 72, 240 58, 240 48 Z"
        fill="#C99A3E"
        stroke="#142033"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="224" cy="46" r="4" fill="#F1F3EE" />
      <path
        d="M 90 125 L 95 118 L 100 125"
        stroke="#3B5B6B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <rect
        x="140"
        y="95"
        width="28"
        height="22"
        rx="2"
        stroke="#142033"
        strokeWidth="1.5"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M 148 95 L 154 88 L 160 95"
        stroke="#142033"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        opacity="0.25"
      />
    </svg>
  )
}

const features = [
  {
    id: 'navigate',
    title: 'Navigate',
    accent: 'pine',
    icon: Compass,
    body:
      'Outdoor routes to buildings and indoor directions to offices, organised by floor so you know where to go once you are inside.',
  },
  {
    id: 'venues',
    title: 'Find a venue',
    accent: 'gold',
    icon: Sparkles,
    body:
      'Compare rooms by capacity, equipment, and indoor or outdoor setup before you book or walk over.',
  },
  {
    id: 'canteens',
    title: 'Canteens',
    accent: 'slate',
    icon: UtensilsCrossed,
    body:
      'Browse stalls, menus, and opening hours so you can pick where to eat before leaving your block.',
  },
]

function Home() {
  const scrollToFeatures = (e) => {
    e.preventDefault()
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home">
      <header className="site-header">
        <div className="site-header__inner">
          <a className="wordmark" href="#top">
            XMUM Navigate
          </a>
          <nav className="site-nav" aria-label="Main">
            <a href="#navigate">Navigate</a>
            <a href="#venues">Venues</a>
            <a href="#canteens">Canteens</a>
          </nav>
          <span className="dev-badge">In development</span>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero__content">
            <h1 id="hero-heading" className="hero__title">
              Find your way around XMUM, from day one.
            </h1>
            <p className="hero__lead">
              Built for new students, parents, and first-time visitors who need a clear map of
              campus—not a maze of buildings and corridors.
            </p>
            <a className="btn btn--primary" href="#features" onClick={scrollToFeatures}>
              See what&apos;s planned
            </a>
          </div>
          <RouteIllustration />
        </section>

        <section id="features" className="features" aria-labelledby="features-heading">
          <h2 id="features-heading" className="features__heading">
            What you will be able to do
          </h2>
          <ul className="signpost-list">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <li
                  key={feature.id}
                  id={feature.id}
                  className={`signpost signpost--${feature.accent} signpost--arm-${index + 1}`}
                >
                  <div className="signpost__arm" aria-hidden="true" />
                  <div className="signpost__panel">
                    <span className="signpost__icon-wrap">
                      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="signpost__title">{feature.title}</h3>
                    <p className="signpost__body">{feature.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="why" aria-labelledby="why-heading">
          <div className="why__inner">
            <h2 id="why-heading" className="why__title">
              Why this exists
            </h2>
            <p className="why__text">
              XMUM is a large campus. On orientation day—or when parents visit for the first
              time—it is easy to walk past the right building, miss a canteen, or spend twenty
              minutes looking for an office that was on another floor. This site is a final year
              project from the School of Computing and Data Science, started to give newcomers one
              place to orient themselves: where things are, how to get there, and what to expect
              before they go. It is still being built; features will land as the project progresses.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p className="site-footer__name">XMUM Navigate</p>
        <p className="site-footer__meta">
          Final Year Project, XMUM School of Computing and Data Science
        </p>
        <p className="site-footer__status">In development</p>
      </footer>
    </div>
  )
}

export default Home
