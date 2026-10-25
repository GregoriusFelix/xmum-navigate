import { useEffect, useRef, useState } from 'react';
import { Compass, Footprints, Info, Minus, Plus, RotateCcw } from 'lucide-react';
import { CONFIG } from './campus.js';

let leafletPromise;
function fitCampus(map) {
  map.fitBounds([CONFIG.start, ...CONFIG.places.map(p => p.coords)], {
    paddingTopLeft: [32, 100],
    paddingBottomRight: [80, 220],
    maxZoom: 17,
    animate: false,
  });
}
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) leafletPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => reject(new Error('Map loading timed out')), 12000);
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.onload = () => { clearTimeout(timeout); resolve(window.L); };
    script.onerror = () => { clearTimeout(timeout); reject(new Error('Map unavailable')); };
    document.head.appendChild(script);
  });
  return leafletPromise;
}

export default function CampusMap({ selected, onSelect, onReset }) {
  const element = useRef(null);
  const mapRef = useRef(null);
  const routeRef = useRef(null);
  const markersRef = useRef([]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [status, setStatus] = useState('loading');
  const [expanded, setExpanded] = useState(true);
  const [zoom, setZoom] = useState(16);
  useEffect(() => {
    let cancelled = false;
    let observer;
    loadLeaflet().then(L => {
      if (cancelled) return;
      const map = L.map(element.current, { zoomControl: false, attributionControl: false, minZoom: 16, maxZoom: 19, maxBounds: CONFIG.bounds, maxBoundsViscosity: 1, scrollWheelZoom: false }).setView(CONFIG.center, 17);
      mapRef.current = map;
      fitCampus(map);
      setZoom(map.getZoom());
      map.on('zoomend', () => setZoom(map.getZoom()));
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
      tiles.on('tileerror', () => { if (!cancelled) setStatus('tiles-error'); });
      tiles.on('load', () => { if (!cancelled) setStatus(tiles._tiles && Object.values(tiles._tiles).some(t => t.el.naturalWidth) ? 'ready' : 'tiles-error'); });
      tiles.addTo(map);
      CONFIG.places.forEach((place, i) => {
        const marker = L.marker(place.coords, { keyboard: false, icon: L.divIcon({ className: 'campus-marker', html: `<button type="button" class="map-pin" aria-label="Show sample route to ${place.name}">${String.fromCharCode(65 + i)}</button><span class="pin-label">${place.name}</span>`, iconSize: [48, 48], iconAnchor: [24, 24] }) }).addTo(map);
        marker.getElement().querySelector('button').addEventListener('click', e => { e.stopPropagation(); onSelectRef.current({ ...place, place }); });
        markersRef.current.push({ marker, id: place.id });
      });
      L.marker(CONFIG.start, { keyboard: false, icon: L.divIcon({ className: 'sample-start', html: '<span>S</span><strong>Sample start</strong>', iconSize: [120, 36], iconAnchor: [18, 18] }) }).addTo(map);
      observer = new ResizeObserver(() => { map.invalidateSize(); fitCampus(map); });
      observer.observe(element.current);
      setStatus('ready');
    }).catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; observer?.disconnect(); mapRef.current?.remove(); mapRef.current = null; markersRef.current = []; };
  }, []);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    routeRef.current?.remove();
    routeRef.current = null;
    markersRef.current.forEach(({ marker, id }) => marker.getElement()?.classList.toggle('is-selected', id === selected?.place.id));
    if (!selected) return;
    const [lat, lng] = selected.place.coords;
    const points = [CONFIG.start, [2.8314, 101.7032], [2.8314, lng], [lat, lng]];
    const tokens = getComputedStyle(document.documentElement);
    const routeColor = tokens.getPropertyValue('--map-route').trim();
    const casing = tokens.getPropertyValue('--map-route-casing').trim();
    routeRef.current = window.L.layerGroup([
      window.L.polyline(points, { color: casing, weight: 9, lineCap: 'round' }),
      window.L.polyline(points, { color: routeColor, weight: 4, lineCap: 'round', lineJoin: 'round' }),
    ]).addTo(map);
  }, [selected, status]);
  const enabled = status === 'ready' || status === 'tiles-error';
  return <div className="map-stage" id="campus-map" role="region" aria-label="Campus map preview">
    <div className="map-canvas" ref={element} aria-label="Sample campus map. Office lookup and Campus life provide destination details." />
    {status !== 'ready' && <div className="map-status" role="status"><Info size={16} aria-hidden="true" /><span>{status === 'loading' ? 'Loading the campus map…' : 'Map unavailable. Use Office lookup or Campus life in the navigation to choose a sample destination.'}</span></div>}
    <div className="map-controls"><button className="icon-button" aria-label="Reset map view" disabled={!enabled} onClick={() => fitCampus(mapRef.current)}><Compass size={20} aria-hidden="true" /></button><div className="zoom-controls"><button className="icon-button" disabled={!enabled || zoom >= 19} aria-label="Zoom in" onClick={() => mapRef.current.zoomIn()}><Plus size={20} aria-hidden="true" /></button><button className="icon-button" disabled={!enabled || zoom <= 16} aria-label="Zoom out" onClick={() => mapRef.current.zoomOut()}><Minus size={20} aria-hidden="true" /></button></div></div>
    <div className="route-sheet">
      <button className="sheet-handle" aria-label={expanded ? 'Collapse route details' : 'Expand route details'} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><span /></button>
      <div className="route-sheet-top"><div><Footprints size={18} aria-hidden="true" /><strong>{selected ? 'Sample walking route' : 'Choose your next stop'}</strong></div><button className="reset-button" onClick={onReset}><RotateCcw size={14} aria-hidden="true" /> Reset</button></div>
      <div className="route-sheet-content" hidden={!expanded} aria-live="polite" aria-atomic="true">
        {selected ? <>
          <div className="route-destination"><span>Sample start</span><span className="route-line" aria-hidden="true" /><strong>{selected.name}</strong></div>
          <div className="route-stats"><div><strong>{selected.place.minutes}<small> min</small></strong><span>Sample walk</span></div><div><strong>{selected.place.distance}<small> m</small></strong><span>Sample distance</span></div><span className="walking-label"><Footprints size={16} aria-hidden="true" /> Outdoors</span></div>
          {selected.floor && <p className="route-office">{selected.place.name}, Floor {selected.floor}. <a href={`/home?office=${encodeURIComponent(selected.id)}#offices`}>See floor plan and directions</a></p>}
        </> : <p className="empty-route">Select a map marker, or choose a destination in Office lookup or Campus life to see a route.</p>}
      </div>
    </div>
  </div>;
}
