import { useEffect, useRef, useState } from 'react';
import { Compass, Info, Minus, Plus } from 'lucide-react';

const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z"/></svg>';

let leafletPromise;
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

export default function CampusMap({ campus, selected, route, position, testStart, spotId, onMap, onSelect, onSpot, onPick, children }) {
  const element = useRef(null);
  const mapRef = useRef(null);
  const layers = useRef({});
  const markersRef = useRef([]);
  const handlers = useRef({});
  handlers.current = { onSelect, onSpot, onPick };
  const [status, setStatus] = useState('loading');
  const [zoom, setZoom] = useState(16);
  // Pad by what the sheet covers: the bottom on phones, the left side where it is a side panel on desktop.
  const fit = points => {
    const sheet = element.current.parentElement.querySelector('.route-sheet')?.getBoundingClientRect();
    const side = sheet && window.matchMedia('(min-width: 1000px)').matches;
    const left = side ? sheet.right - element.current.getBoundingClientRect().left + 24 : 24;
    const covered = sheet && !side ? window.innerHeight - sheet.top : 0;
    mapRef.current.fitBounds(points, { paddingTopLeft: [left, side ? 80 : 180], paddingBottomRight: [64, Math.max(48, covered + 24)], maxZoom: 17, animate: false });
  };
  const fitCampus = () => fit(campus.places.map(place => place.coords));

  useEffect(() => {
    let cancelled = false;
    let observer;
    loadLeaflet().then(L => {
      if (cancelled) return;
      const map = L.map(element.current, { zoomControl: false, attributionControl: false, minZoom: 15, maxZoom: 19, maxBounds: L.latLngBounds(campus.boundary).pad(1.5), maxBoundsViscosity: 1, scrollWheelZoom: false });
      mapRef.current = map;
      onMap?.(map);
      fitCampus();
      setZoom(map.getZoom());
      map.on('zoomend', () => setZoom(map.getZoom()));
      map.on('click', event => handlers.current.onPick?.([event.latlng.lat, event.latlng.lng]));
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
      tiles.on('tileerror', () => { if (!cancelled) setStatus('tiles-error'); });
      tiles.on('load', () => { if (!cancelled) setStatus(tiles._tiles && Object.values(tiles._tiles).some(t => t.el.naturalWidth) ? 'ready' : 'tiles-error'); });
      tiles.addTo(map);

      const tokens = getComputedStyle(document.documentElement);
      campus.paths.features.forEach(feature => {
        const line = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        const style = feature.properties.is_closed
          ? { color: tokens.getPropertyValue('--map-route').trim(), weight: 5, dashArray: '2 10', lineCap: 'round' }
          : { color: tokens.getPropertyValue('--map-marker').trim(), weight: 3, opacity: .3 };
        L.polyline(line, { ...style, interactive: false }).addTo(map);
      });
      campus.places.forEach((place, i) => {
        const marker = L.marker(place.coords, { keyboard: false, icon: L.divIcon({ className: 'campus-marker', html: `<button type="button" class="map-pin">${String.fromCharCode(65 + i)}</button><span class="pin-label"></span>`, iconSize: [48, 48], iconAnchor: [24, 24] }) }).addTo(map);
        const button = marker.getElement().querySelector('button');
        button.setAttribute('aria-label', `Route to ${place.name}`);
        marker.getElement().querySelector('.pin-label').textContent = place.name;
        button.addEventListener('click', event => { event.stopPropagation(); handlers.current.onSelect({ ...place, kind: 'place', place }); });
        markersRef.current.push({ marker, id: place.id });
      });
      campus.spots.forEach(spot => {
        const marker = L.marker([spot.lat, spot.lng], { keyboard: false, icon: L.divIcon({ className: 'spot-marker', html: `<button type="button" class="spot-pin">${STAR}</button>`, iconSize: [40, 40], iconAnchor: [20, 20] }) }).addTo(map);
        const button = marker.getElement().querySelector('button');
        button.setAttribute('aria-label', `Route through scenic spot ${spot.name}`);
        button.addEventListener('click', event => { event.stopPropagation(); handlers.current.onSpot(spot.id); });
        markersRef.current.push({ marker, id: spot.id });
      });
      observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(element.current);
      setStatus('ready');
    }).catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; observer?.disconnect(); mapRef.current?.remove(); mapRef.current = null; markersRef.current = []; layers.current = {}; };
  }, []);

  useEffect(() => {
    markersRef.current.forEach(({ marker, id }) => marker.getElement()?.classList.toggle('is-selected', id === selected?.place.id || id === spotId));
  }, [selected, spotId, status]);

  // Each overlay is rebuilt from its prop, so the map never shows a stale route or dot.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    const L = window.L;
    const tokens = getComputedStyle(document.documentElement);
    const dot = (className, html, size) => L.divIcon({ className, html, iconSize: size, iconAnchor: [size[1] / 2, size[1] / 2] });
    Object.values(layers.current).forEach(layer => layer.remove());
    layers.current = {};
    if (route) {
      layers.current.route = L.layerGroup([
        L.polyline(route.points, { color: tokens.getPropertyValue('--map-route-casing').trim(), weight: 9, lineCap: 'round', interactive: false }),
        L.polyline(route.points, { color: tokens.getPropertyValue('--map-route').trim(), weight: 4, lineCap: 'round', lineJoin: 'round', interactive: false }),
      ]).addTo(map);
    }
    if (position) layers.current.position = L.marker(position, { interactive: false, keyboard: false, icon: dot('you-dot', '', [22, 22]) }).addTo(map);
    if (testStart) layers.current.testStart = L.marker(testStart, { interactive: false, keyboard: false, icon: dot('sample-start', '<span>S</span><strong>Test start</strong>', [120, 36]) }).addTo(map);
  }, [route, position?.join(), testStart?.join(), status]);

  useEffect(() => { if (route && mapRef.current) fit(route.points); }, [route]);

  const enabled = status === 'ready' || status === 'tiles-error';
  return <div className="map-stage" id="campus-map" role="region" aria-label="Campus map">
    <div className="map-canvas" ref={element} />
    {status !== 'ready' && <div className="map-status" role="status"><Info size={16} aria-hidden="true" /><span>{status === 'loading' ? 'Loading the campus map…' : 'The map could not load. Check your connection and reload.'}</span></div>}
    <div className="map-controls"><button className="icon-button" aria-label="Reset map view" disabled={!enabled} onClick={fitCampus}><Compass size={20} aria-hidden="true" /></button><div className="zoom-controls"><button className="icon-button" disabled={!enabled || zoom >= 19} aria-label="Zoom in" onClick={() => mapRef.current.zoomIn()}><Plus size={20} aria-hidden="true" /></button><button className="icon-button" disabled={!enabled || zoom <= 15} aria-label="Zoom out" onClick={() => mapRef.current.zoomOut()}><Minus size={20} aria-hidden="true" /></button></div></div>
    {children}
  </div>;
}
