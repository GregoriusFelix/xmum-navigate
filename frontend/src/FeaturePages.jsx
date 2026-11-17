import { useState } from 'react';
import { Bookmark, Building2, ChevronDown, Compass, Footprints, Info, Map, Utensils } from 'lucide-react';
import { api } from './api.js';
import SCurve from './SCurve.jsx';

const mapLink = item => `/map?destination=${encodeURIComponent(item.id)}`;
const NavigateHere = ({ item }) => <a className="text-button" href={mapLink(item)}>Navigate here <Map size={18} aria-hidden="true" /></a>;

// Outdoor is the route map, Indoor the office floor plans; a chosen office carries across the switch.
export function ViewToggle({ indoor, officeId }) {
  const id = officeId && encodeURIComponent(officeId);
  return <nav className="view-toggle" aria-label="Map view">
    <a href={id ? `/map?destination=${id}` : '/map'} aria-current={indoor ? undefined : 'page'}>Outdoor</a>
    <a href={id ? `/offices?office=${id}` : '/offices'} aria-current={indoor ? 'page' : undefined}>Indoor</a>
  </nav>;
}

function PageHead({ title, text, children }) {
  return <div className="container"><div className="page-head">{children}<h1>{title}</h1><p>{text}</p><SCurve /></div></div>;
}

function FloorPlan({ floor }) {
  return <figure className="floor-plan"><figcaption><span>Sample floor plan</span><strong>Floor {floor}</strong></figcaption><svg viewBox="0 0 480 220" role="img" aria-label={`Sample Floor ${floor}. Enter the corridor from the lift on the left. The sample office is on the upper right.`}>
    <g className="plan-rooms"><path d="M24 24H456V196H24Z M24 92H456 M24 130H456 M130 24V92 M290 24V92 M176 130V196 M340 130V196" /></g>
    <path className="plan-office" d="M292 26H454V90H292Z" />
    <path className="plan-route" d="M78 64V112H370V62" />
    <g className="plan-text"><text x="54" y="56">Lift</text><text x="174" y="62">Room</text><text x="322" y="62">Office</text><text x="50" y="168">Room</text><text x="219" y="168">Room</text><text x="374" y="168">Stairs</text></g>
    <circle className="plan-end" cx="370" cy="62" r="6" />
  </svg><p>Illustrative layout. Written directions accompany the plan.</p></figure>;
}

export function OfficesPage({ campus }) {
  const [office, setOffice] = useState(() => campus.offices.find(item => item.id === new URLSearchParams(window.location.search).get('office')) || campus.offices[0]);
  const choose = id => {
    setOffice(campus.offices.find(item => item.id === id));
    const url = new URL(window.location.href);
    url.searchParams.set('office', id);
    window.history.replaceState(null, '', url);
  };
  return <>
    <PageHead title="Find the right office." text="Choose a department for its building, floor plan and written directions."><ViewToggle indoor officeId={office?.id} /></PageHead>
    <section className="office-section container" aria-label="Indoor directions">
      <div className="office-copy">
        {office && <><label htmlFor="office-select">Office or department</label><div className="select-wrap"><select id="office-select" value={office.id} onChange={event => choose(event.target.value)}>{campus.offices.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div></>}
        <p className="office-scope"><Info size={16} aria-hidden="true" /> Floor plan and directions, no live tracking.</p></div>
      {office ? <div className="office-example" aria-live="polite"><div className="office-example-title"><Building2 size={24} aria-hidden="true" /><div><h3>{office.name}</h3><p>{office.place.name}, Floor {office.floor}</p></div></div><FloorPlan floor={office.floor} /><ol className="office-directions">{office.directions.map(step => <li key={step}>{step}</li>)}</ol><a className="text-button" href={mapLink(office)}>Walk to this building <Footprints size={18} aria-hidden="true" /></a></div>
        : <p className="office-example">No offices have been added yet.</p>}
    </section>
  </>;
}

export function VenuesPage({ campus, user, setUser }) {
  const eventTypes = [...new Set(campus.venues.flatMap(venue => venue.eventTypes))];
  const facilities = [...new Set(campus.venues.flatMap(venue => venue.facilities))];
  const requested = new URLSearchParams(window.location.search).get('event');
  const [need, setNeed] = useState({ participants: 30, eventType: eventTypes.includes(requested) ? requested : eventTypes[0], facilities: [], setting: 'any' });
  const [found, setFound] = useState(null);
  const [error, setError] = useState('');
  const update = change => { setNeed({ ...need, ...change }); setFound(null); };
  const submit = async event => {
    event.preventDefault();
    setError('');
    try { setFound((await api('/venues/recommend', { method: 'POST', body: need })).results); }
    catch { setError('Venue suggestions could not load. Check your connection and try again.'); }
  };
  return <>
    <PageHead title="A space for your plans." text="Tell us about your event and get the three best-matching campus venues. Booking is not part of this app." />
    <section className="campus-life-section"><div className="container">
      <div className="life-grid">
        <form className="life-module venue-form" onSubmit={submit}>
          <div className="life-module-title"><Compass size={28} aria-hidden="true" /><h3>Your event</h3></div>
          <label htmlFor="participants">Number of participants</label>
          <input id="participants" type="number" min="1" max="100000" required value={need.participants} onChange={event => update({ participants: event.target.valueAsNumber || '' })} />
          <label htmlFor="event-type">Event type</label>
          <div className="select-wrap"><select id="event-type" value={need.eventType} onChange={event => update({ eventType: event.target.value })}>{eventTypes.map(type => <option key={type}>{type}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div>
          <fieldset><legend>AV and facilities needed</legend>{facilities.map(name => <label key={name} className="check"><input type="checkbox" checked={need.facilities.includes(name)} onChange={event => update({ facilities: event.target.checked ? [...need.facilities, name] : need.facilities.filter(f => f !== name) })} />{name}</label>)}</fieldset>
          <fieldset><legend>Indoor or outdoor</legend>{[['any', 'No preference'], ['indoor', 'Indoor'], ['outdoor', 'Outdoor']].map(([value, label]) => <label key={value} className="check"><input type="radio" name="setting" checked={need.setting === value} onChange={() => update({ setting: value })} />{label}</label>)}</fieldset>
          <button className="button primary" type="submit">Find venues</button>
          {error && <p role="alert">{error}</p>}
        </form>
        <div aria-live="polite">{found && <ol className="venue-results">{found.map(({ venue, score }) => {
          const item = campus.venues.find(entry => entry.id === venue.id) || venue;
          const isSaved = user?.saved.includes(venue.id);
          return <li key={venue.id} className="life-module"><div className="venue-result"><span className="sample-label">{score}% match</span><strong>{venue.name}</strong><p>{item.place?.name} · up to {venue.capacity} people · {venue.setting}</p><p>{venue.description}</p></div><div className="venue-actions"><NavigateHere item={venue} />{user && <button className="text-button save-button" aria-pressed={isSaved} onClick={() => api(`/me/saved/${venue.id}`, { method: isSaved ? 'DELETE' : 'PUT' }).then(setUser).catch(failure => setError(failure.message))}><Bookmark size={18} aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save'}</button>}</div></li>;
        })}</ol>}</div>
      </div>
      <p className="life-disclaimer"><Info size={16} aria-hidden="true" /> Venue details are sample data.</p>
    </div></section>
  </>;
}

export function CanteensPage({ campus }) {
  return <>
    <PageHead title="Find your next bite." text="Stall menus, prices and opening hours in one place. Ordering is not part of this app." />
    <section className="campus-life-section"><div className="container">
      <div className="life-grid">
        {campus.stalls.length ? campus.stalls.map(stall => <article className="life-module" key={stall.id}>
          <div className="life-module-title"><Utensils size={28} aria-hidden="true" /><h3>{stall.name}</h3></div>
          <div className="menu-heading"><strong>Menu</strong><span>{stall.place.name}</span></div>
          <dl className="sample-menu">{stall.menu.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></div>)}</dl>
          <p className="menu-hours">{stall.hours}</p>
          <NavigateHere item={stall} />
        </article>) : <p className="life-module">No stalls have been added yet.</p>}
      </div>
      <p className="life-disclaimer"><Info size={16} aria-hidden="true" /> Canteen details are sample data.</p>
    </div></section>
  </>;
}

const MODE_NAMES = { shortest: 'Shortest route', scenic: 'Scenic route', combined: 'Scenic stop' };

export function ProfilePage({ campus, user, setUser, signOut }) {
  const [error, setError] = useState('');
  if (!user) return <>
    <PageHead title="Browsing as a guest." text="Log in to save venues and keep a history of your routes." />
    <section className="container profile"><button className="button primary" onClick={signOut}>Log in or create an account</button></section>
  </>;
  const saved = user.saved.map(id => campus.venues.find(venue => venue.id === id)).filter(Boolean);
  const history = user.history.map(entry => ({ ...entry, item: campus.destinations.find(item => item.id === entry.destinationId) })).filter(entry => entry.item);
  const unsave = id => api(`/me/saved/${id}`, { method: 'DELETE' }).then(setUser).catch(failure => setError(failure.message));
  return <>
    <PageHead title={`Hi, ${user.name}.`} text={user.email} />
    <section className="container profile">
      <div className="life-module"><h2>Saved venues</h2>
        {saved.length ? <ul className="profile-list">{saved.map(venue => <li key={venue.id}><div><strong>{venue.name}</strong><small>{venue.place.name}</small></div><a className="text-button" href={mapLink(venue)}>Navigate</a><button className="text-button" onClick={() => unsave(venue.id)}>Remove</button></li>)}</ul>
          : <p>No saved venues yet. Save one from your results on the Venues tab.</p>}
        {error && <p role="alert">{error}</p>}
      </div>
      <div className="life-module"><h2>Recent routes</h2>
        {history.length ? <ul className="profile-list">{history.map(entry => <li key={entry.at}><div><strong>{entry.item.name}</strong><small>{MODE_NAMES[entry.mode]} · {new Date(entry.at).toLocaleString()}</small></div><a className="text-button" href={mapLink(entry.item)}>Go again</a></li>)}</ul>
          : <p>Routes you open on the map show up here.</p>}
      </div>
      <button className="button secondary" onClick={signOut}>Log out</button>
    </section>
  </>;
}
