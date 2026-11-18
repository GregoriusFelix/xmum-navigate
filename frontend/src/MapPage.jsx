import { useEffect, useRef, useState } from 'react';
import { BedDouble, Briefcase, Building2, Footprints, Layers, LocateFixed, Navigation, RotateCcw, Users, Utensils } from 'lucide-react';
import CampusMap from './CampusMap.jsx';
import MapSearch from './MapSearch.jsx';
import { adminToken, api, destinationDetail, insideCampus } from './api.js';
import { ViewToggle } from './FeaturePages.jsx';

const MODES = [['shortest', 'Shortest'], ['scenic', 'Scenic'], ['combined', 'Scenic stop']];
const CATEGORIES = [['place', 'Buildings', Building2], ['residence', 'Residences', BedDouble], ['office', 'Offices', Briefcase], ['venue', 'Venues', Users], ['stall', 'Food', Utensils]];
const LOCATION_MESSAGES = {
  locating: 'Finding your location…',
  denied: 'Routing needs your location. Allow location for this site in your browser settings (the icon beside the address), then reload the page.',
  unavailable: 'Your location is unavailable, and routing needs it. Check that GPS is switched on.',
  'off-campus': 'Routing works only on campus',
};
const ROUTE_ERRORS = {
  no_route: 'No open path reaches this destination right now.',
  off_campus: LOCATION_MESSAGES['off-campus'],
  unauthorized: 'Your admin session ended. Log in again to use a test start.',
};

export default function MapPage({ campus }) {
  const [selected, setSelected] = useState(() => campus.destinations.find(item => item.id === new URLSearchParams(window.location.search).get('destination')) || null);
  const [category, setCategory] = useState('place');
  const [mode, setMode] = useState('shortest');
  const [spotId, setSpotId] = useState(campus.spots[0]?.id);
  const [gps, setGps] = useState({ status: 'locating' });
  const [testStart, setTestStart] = useState(null);
  const [picking, setPicking] = useState(false);
  const [route, setRoute] = useState(null);
  const [routeError, setRouteError] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);
  const map = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) { setGps({ status: 'unavailable' }); return; }
    const watch = navigator.geolocation.watchPosition(
      at => setGps({ status: 'ok', coords: [at.coords.latitude, at.coords.longitude] }),
      error => setGps({ status: error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable' }),
      { enableHighAccuracy: true, maximumAge: 5000 },
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  const onCampus = gps.coords && insideCampus(gps.coords, campus.boundary);
  const start = testStart || (onCampus ? gps.coords : null);
  // Rounded to about 11 m so GPS jitter does not refetch the route.
  const startKey = start?.map(n => n.toFixed(4)).join();
  const via = mode === 'combined' ? spotId : undefined;

  useEffect(() => {
    setRoute(null);
    setRouteError('');
    if (!selected || !start) return;
    let stale = false;
    api('/route', { method: 'POST', body: { start, destinationId: selected.id, mode, spotId: via, manualStart: Boolean(testStart) } })
      .then(found => { if (!stale) setRoute(found); })
      .catch(error => { if (!stale) setRouteError(ROUTE_ERRORS[error.code] || 'The route could not load. Check your connection and try again.'); });
    return () => { stale = true; };
  }, [selected?.id, startKey, mode, via]);

  const setDestination = item => {
    setSelected(item);
    setExpanded(true);
    const url = new URL(window.location.href);
    if (item) url.searchParams.set('destination', item.id); else url.searchParams.delete('destination');
    window.history.replaceState(null, '', url);
  };
  const locationMessage = start ? '' : LOCATION_MESSAGES[gps.status === 'ok' ? 'off-campus' : gps.status];
  const message = picking ? 'Tap the map where the test route should start.' : locationMessage || routeError || (!route && 'Finding your route…');
  const spot = campus.spots.find(item => item.id === spotId);
  const label = CATEGORIES.find(([kind]) => kind === category)[1];

  return <section className="map-section map-page" aria-label="Campus route planner">
    <h1 className="visually-hidden">XMUM campus map</h1>
    <div className="map-workspace">
      <MapSearch destinations={campus.destinations} selected={selected} onSelect={setDestination} onClear={() => setDestination(null)} />
      <div className="map-chips" role="group" aria-label="Browse by type">
        {CATEGORIES.map(([kind, name, Icon]) => <button key={kind} aria-pressed={!selected && category === kind} onClick={() => { setCategory(kind); setDestination(null); }}><Icon size={18} strokeWidth={1.75} aria-hidden="true" />{name}</button>)}
      </div>
      <div className="map-layers">
        <button className="icon-button" aria-label="Outdoor or indoor map" aria-expanded={layersOpen} onClick={() => setLayersOpen(!layersOpen)}><Layers size={20} aria-hidden="true" /></button>
        {layersOpen && <ViewToggle officeId={selected?.kind === 'office' ? selected.id : undefined} />}
      </div>
      <div className="hero-map">
        <CampusMap campus={campus} selected={selected} route={route} position={gps.coords} testStart={testStart} spotId={via}
          onMap={instance => { map.current = instance; }}
          onSelect={setDestination} onSpot={id => { setSpotId(id); setMode('combined'); }}
          onPick={picking ? at => { setTestStart(at); setPicking(false); } : undefined}>
          <div className="route-sheet">
            <button className="locate-fab" aria-label="Show my location" disabled={!gps.coords} onClick={() => map.current?.setView(gps.coords, 18)}><LocateFixed size={24} aria-hidden="true" /></button>
            <button className="sheet-handle" aria-label={expanded ? 'Collapse panel' : 'Expand panel'} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><span /></button>
            <div className="route-sheet-top">
              <div>{selected ? <><Footprints size={18} aria-hidden="true" /><strong>{selected.name}</strong></> : <h2 className="explore-title">Explore XMUM</h2>}</div>
              <div>
                {adminToken() && <button className="reset-button" aria-pressed={picking} onClick={() => setPicking(!picking)}><LocateFixed size={14} aria-hidden="true" /> Test start</button>}
                {(selected || testStart) && <button className="reset-button" onClick={() => { setDestination(null); setTestStart(null); setPicking(false); }}><RotateCcw size={14} aria-hidden="true" /> Close</button>}
              </div>
            </div>
            <div className="route-sheet-content" hidden={!expanded}>
              {selected ? <>
                <div className="route-modes" role="group" aria-label="Route type">
                  {MODES.map(([value, name]) => <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{name}</button>)}
                </div>
                {mode === 'combined' && <div className="spot-picker">
                  {spot?.photo && <img src={spot.photo} alt="" width="48" height="48" />}
                  <div><label htmlFor="spot-select">Stop at a scenic spot, or tap a star on the map</label>
                    <select id="spot-select" value={spotId} onChange={event => setSpotId(event.target.value)}>{campus.spots.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
                </div>}
                <div aria-live="polite" aria-atomic="true">
                  {message ? <p className="empty-route">{message}</p> : <>
                    <div className="route-stats">
                      <div><strong>{route.minutes}<small> min</small></strong><span>Walking time</span></div>
                      <div><strong>{route.distance}<small> m</small></strong><span>{mode === 'shortest' ? 'Distance' : `+${route.extra} m vs shortest`}</span></div>
                      <span className="walking-label"><Footprints size={16} aria-hidden="true" /> {testStart ? 'Test start' : 'Your location'}</span>
                    </div>
                    {selected.kind === 'office' && <p className="route-office">{selected.place.name}, Floor {selected.floor}. <a href={`/offices?office=${encodeURIComponent(selected.id)}`}>See floor plan and directions</a></p>}
                  </>}
                </div>
              </> : <>
                {locationMessage && <p className="explore-note" role="status">{locationMessage}</p>}
                <p className="explore-label">{label}</p>
                <div className="explore-cards">
                  {campus.destinations.filter(item => item.kind === category).map(item => <button key={item.id} onClick={() => setDestination(item)}>
                    <Navigation size={18} aria-hidden="true" /><strong>{item.name}</strong><small>{destinationDetail(item)}</small>
                  </button>)}
                </div>
              </>}
            </div>          </div>
        </CampusMap>
      </div>
    </div>
  </section>;
}
