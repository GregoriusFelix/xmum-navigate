import { useState } from 'react';
import { ArrowUpRight, Building2, Check, Compass, Footprints, MapPin, Search, X } from 'lucide-react';
import { DESTINATIONS } from './campus.js';

export default function HomeHero() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const results = DESTINATIONS.filter(item => `${item.name} ${item.type || ''}`.toLowerCase().includes(query.trim().toLowerCase()));
  function submit(event) {
    event.preventDefault();
    setSearching(true);
  }
  return <section className="welcome container" aria-labelledby="hero-title">
    <div className="welcome-stage">
      <div className="welcome-copy">
        <h1 id="hero-title">Your campus.<br />Your next discovery.</h1>
        <p>Find your classroom, your lunch spot, and your way around XMUM.</p>
        <form className="destination-search" onSubmit={submit} role="search" onKeyDown={event => { if (event.key === 'Escape') { setSearching(false); document.getElementById('destination-query').focus(); } }}>
          <Search size={22} aria-hidden="true" />
          <label className="visually-hidden" htmlFor="destination-query">Search campus destinations</label>
          <input id="destination-query" value={query} onChange={event => { setQuery(event.target.value); setSearching(true); }} placeholder="Where do you want to go?" autoComplete="off" />
          <button type="submit" aria-label="Search destinations" aria-expanded={searching} aria-controls={searching ? 'destination-results' : undefined}><ArrowUpRight size={23} aria-hidden="true" /></button>
          {searching && <div className="destination-results" id="destination-results">
            <div className="results-heading"><span>{query.trim() ? 'Matching sample destinations' : 'Try a sample destination'}</span><button type="button" aria-label="Close search results" onClick={() => setSearching(false)}><X size={18} /></button></div>
            <div role="status" className="visually-hidden">{results.length} matching destinations</div>
            {results.length ? results.map(item => <a key={item.id} href={`/map?destination=${encodeURIComponent(item.id)}`}><MapPin size={18} aria-hidden="true" /><span>{item.name}<small>{item.floor ? `${item.place.name}, Floor ${item.floor}` : item.type}</small></span><ArrowUpRight size={17} aria-hidden="true" /></a>) : <p>No destinations found. Try “library”, “office”, or “canteen”.</p>}
          </div>}
        </form>
        <div className="suggested-stops"><span>Looking for</span><a href="#offices">An office</a><a href="#canteens">A bite to eat</a><a href="#venues">An event space</a></div>
        <div className="welcome-actions"><a className="button primary" href="/map">Open campus map <Compass size={20} aria-hidden="true" /></a><span><Check size={16} aria-hidden="true" /> No download needed</span></div>
      </div>
      <div className="campus-collage" aria-label="A glimpse of Xiamen University Malaysia">
        <figure className="campus-photo photo-back"><img src="/images/library.jpg" alt="Bookshelves inside the XMUM library" width="1440" height="1080" /></figure>
        <figure className="campus-photo photo-side"><img src="/images/walkway.jpg" alt="Trees and greenery at Xiamen University Malaysia" width="1440" height="960" /></figure>
        <svg className="campus-orbit" viewBox="0 0 640 470" fill="none" aria-hidden="true"><path d="M570 108C689 205 551 371 315 396C72 424-41 322 61 221C144 140 345 108 478 133" /></svg>
        <figure className="campus-photo photo-front"><img src="/images/campus.jpg" alt="Sunlit residential buildings and landscaped walkways at XMUM" width="1440" height="1080" fetchPriority="high" /><figcaption><MapPin size={16} />XMUM campus</figcaption></figure>
        <a className="collage-map-link" href="/map"><span className="map-link-icon"><Footprints size={23} aria-hidden="true" /></span><span>Take the next step<strong>Find your way on campus</strong></span><ArrowUpRight size={22} aria-hidden="true" /></a>
      </div>
    </div>
    <div className="welcome-footnote"><span>A familiar campus starts with a little direction.</span><a href="#features">Find what you need <ArrowUpRight size={17} aria-hidden="true" /></a></div>
  </section>;
}
