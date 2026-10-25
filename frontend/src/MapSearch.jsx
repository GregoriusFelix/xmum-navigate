import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { DESTINATIONS } from './campus.js';

export default function MapSearch({ selected, onSelect, onClear }) {
  const [query, setQuery] = useState(selected?.name || '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const area = useRef(null);
  const input = useRef(null);
  const term = query === selected?.name ? '' : query.trim().toLowerCase();
  const matches = DESTINATIONS.filter(item => `${item.name} ${item.place.name}`.toLowerCase().includes(term));
  useEffect(() => { setQuery(selected?.name || ''); }, [selected]);
  useEffect(() => {
    const close = e => { if (!area.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  useEffect(() => { if (active >= 0) document.getElementById(`map-result-${active}`)?.scrollIntoView({ block: 'nearest' }); }, [active]);
  const choose = item => { onSelect(item); setQuery(item.name); setOpen(false); setActive(-1); };
  return <div className="map-search" ref={area} role="search" aria-label="Campus destinations">
    <label className="visually-hidden" htmlFor="map-search-input">Search a building or office</label>
    <div className="search-field">
      <Search size={20} aria-hidden="true" />
      <input id="map-search-input" ref={input} placeholder="Search a building or office" autoComplete="off" value={query} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="map-search-results" aria-activedescendant={open && active >= 0 ? `map-result-${active}` : undefined}
        onFocus={e => { setOpen(true); setActive(-1); e.target.select(); }}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
        onBlur={e => { if (!area.current?.contains(e.relatedTarget)) setOpen(false); }}
        onKeyDown={e => {
          if (e.key === 'Escape') { setOpen(false); setActive(-1); }
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault(); setOpen(true);
            setActive(i => matches.length ? (i < 0 ? (e.key === 'ArrowDown' ? 0 : matches.length - 1) : (i + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length) : -1);
          }
          if (e.key === 'Enter' && open && matches.length) { e.preventDefault(); choose(matches[Math.max(0, active)]); }
        }} />
      {query && <button className="icon-button clear-search" aria-label="Clear search and route" onClick={() => { onClear(); setQuery(''); setActive(-1); input.current?.focus(); setOpen(true); }}><X size={18} aria-hidden="true" /></button>}
    </div>
    <ul id="map-search-results" className="suggestions" role="listbox" aria-label="Destinations" hidden={!open}>
      {matches.length ? matches.map((item, i) => <li key={item.id} id={`map-result-${i}`} role="option" aria-selected={active === i} onPointerDown={e => e.preventDefault()} onClick={() => choose(item)}>
        <span>{item.name}<small>{item.floor ? `${item.place.name}, Floor ${item.floor}` : item.type}</small></span>
      </li>) : <li role="option" aria-selected="false" aria-disabled="true">No destinations found. Try a building or office name.</li>}
    </ul>
  </div>;
}
