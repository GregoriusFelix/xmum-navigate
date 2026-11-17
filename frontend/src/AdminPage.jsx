import { useState } from 'react';
import { adminToken, api, setAdminToken } from './api.js';

// [key, label, kind]. Kinds: text, number, place, setting, csv, lines, menu.
const COLLECTIONS = {
  stalls: ['Canteen stalls', [['name', 'Stall name', 'text'], ['placeId', 'Canteen location', 'place'], ['hours', 'Opening hours', 'text'], ['menu', 'Menu, one "item | price" per line', 'menu']]],
  venues: ['Venues', [['name', 'Venue name', 'text'], ['placeId', 'Building', 'place'], ['capacity', 'Capacity', 'number'], ['eventTypes', 'Event types, separated by commas', 'csv'], ['facilities', 'AV and facilities, separated by commas', 'csv'], ['setting', 'Indoor or outdoor', 'setting'], ['description', 'Description', 'text']]],
  offices: ['Office lookup', [['name', 'Office or department', 'text'], ['placeId', 'Building', 'place'], ['floor', 'Floor', 'number'], ['directions', 'Directions, one step per line', 'lines']]],
  spots: ['Scenic spots', [['name', 'Spot name', 'text'], ['lat', 'Latitude', 'number'], ['lng', 'Longitude', 'number'], ['photo', 'Photo URL', 'text'], ['score', 'Survey score, 0 to 5', 'number']]],
};
const WEIGHTS = [['capacity', 'Capacity'], ['eventType', 'Event type'], ['facilities', 'AV and facilities'], ['setting', 'Indoor or outdoor']];
const lines = value => value.split('\n').map(line => line.trim()).filter(Boolean);

const toField = (value, kind) => {
  if (kind === 'menu') return (value || []).map(item => `${item.name} | ${item.price}`).join('\n');
  if (kind === 'csv') return (value || []).join(', ');
  if (kind === 'lines') return (value || []).join('\n');
  return value ?? '';
};
const fromField = (value, kind) => {
  if (kind === 'menu') return lines(value).map(line => { const [name, price = ''] = line.split('|').map(part => part.trim()); return { name, price }; });
  if (kind === 'csv') return value.split(',').map(part => part.trim()).filter(Boolean);
  if (kind === 'lines') return lines(value);
  return value;
};

function ItemForm({ fields, item, places, onSave, onDelete }) {
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(([key, , kind]) => [key, toField(item?.[key], kind) || (kind === 'place' ? places[0].id : kind === 'setting' ? 'indoor' : '')])));
  const [error, setError] = useState('');
  const submit = async event => {
    event.preventDefault();
    setError('');
    try { await onSave(Object.fromEntries(fields.map(([key, , kind]) => [key, fromField(form[key], kind)]))); }
    catch (failure) { setError(failure.message); }
  };
  const id = key => `${item?.id || 'new'}-${fields[0][1]}-${key}`;
  return <form className="admin-form" onSubmit={submit}>
    {fields.map(([key, label, kind]) => <div key={key}><label htmlFor={id(key)}>{label}</label>
      {kind === 'place' ? <select id={id(key)} value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })}>{places.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}</select>
        : kind === 'setting' ? <select id={id(key)} value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })}><option value="indoor">Indoor</option><option value="outdoor">Outdoor</option></select>
        : kind === 'menu' || kind === 'lines' ? <textarea id={id(key)} rows="4" value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} />
        : <input id={id(key)} type={kind === 'number' ? 'number' : 'text'} step="any" value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} />}
    </div>)}
    {error && <p role="alert">{error}</p>}
    <div className="admin-actions"><button className="button primary" type="submit">{item ? 'Save changes' : 'Add'}</button>
      {onDelete && <button className="button secondary" type="button" onClick={() => { if (window.confirm(`Delete ${item.name}? This cannot be undone.`)) onDelete().catch(failure => setError(failure.message)); }}>Delete</button>}</div>
  </form>;
}

function Login({ onDone }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async event => {
    event.preventDefault();
    try { setAdminToken((await api('/admin/login', { method: 'POST', body: { password } })).token); onDone(); }
    catch (failure) { setError(failure.message); }
  };
  return <form className="admin-form admin-login" onSubmit={submit}>
    <label htmlFor="admin-password">Admin password</label>
    <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} />
    {error && <p role="alert">{error}</p>}
    <button className="button primary" type="submit">Log in</button>
  </form>;
}

export default function AdminPage({ campus, reload }) {
  const [loggedIn, setLoggedIn] = useState(Boolean(adminToken()));
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState(() => ({ weightVersion: campus.settings.weightVersion, elicited: campus.settings.weights.elicited || { capacity: '', eventType: '', facilities: '', setting: '' } }));
  if (!loggedIn) return <section className="admin container"><h1>Admin</h1><Login onDone={() => setLoggedIn(true)} /></section>;

  // A 401 means the backend restarted or the session was dropped, so return to the login form.
  const send = async (path, options, done) => {
    try { await api(path, options); await reload(); setNotice(done); }
    catch (failure) { if (failure.code === 'unauthorized') { setAdminToken(''); setLoggedIn(false); } throw failure; }
  };
  const hasElicited = WEIGHTS.every(([key]) => settings.elicited[key] !== '');
  return <section className="admin container">
    <div className="admin-heading"><h1>Admin</h1><button className="button secondary" onClick={() => { setAdminToken(''); setLoggedIn(false); }}>Log out</button></div>
    <p role="status" className="admin-notice">{notice}</p>

    {Object.entries(COLLECTIONS).map(([name, [title, fields]]) => <div className="admin-group" key={name}>
      <h2>{title}</h2>
      {campus[name].map(item => <details key={item.id}><summary>{item.name}</summary>
        <ItemForm fields={fields} item={item} places={campus.places} onSave={body => send(`/admin/${name}/${item.id}`, { method: 'PUT', body }, `Saved ${body.name}.`)} onDelete={() => send(`/admin/${name}/${item.id}`, { method: 'DELETE' }, `Deleted ${item.name}.`)} />
      </details>)}
      {/* Keyed by count so the form starts empty again after each add. */}
      <details key={campus[name].length}><summary>Add new</summary><ItemForm fields={fields} places={campus.places} onSave={body => send(`/admin/${name}`, { method: 'POST', body }, `Added ${body.name}.`)} /></details>
    </div>)}

    <div className="admin-group">
      <h2>Paths</h2>
      <p>A closed path is left out of every route straight away and is drawn as a dotted red line on the map.</p>
      <ul className="admin-paths">{campus.paths.features.map(({ properties: path }) => <li key={path.path_id}>
        <span><strong>{path.path_id}</strong> {path.source_node} to {path.target_node}, {path.length_m} m, {path.type.replace('_', ' ')}{path.is_closed && ' (closed)'}</span>
        <button className="button secondary" onClick={() => send(`/admin/paths/${path.path_id}`, { method: 'PATCH', body: { is_closed: !path.is_closed } }, `${path.path_id} is now ${path.is_closed ? 'open' : 'closed'}.`).catch(failure => setNotice(failure.message))}>{path.is_closed ? 'Reopen' : 'Close'}</button>
      </li>)}</ul>
    </div>

    <div className="admin-group">
      <h2>Venue weights</h2>
      <form className="admin-form" onSubmit={event => { event.preventDefault(); send('/admin/settings', { method: 'PUT', body: { weightVersion: settings.weightVersion, elicited: hasElicited ? settings.elicited : undefined } }, 'Venue weights saved.').catch(failure => setNotice(failure.message)); }}>
        <div><label htmlFor="weight-version">Weights used on the live site</label>
          <select id="weight-version" value={settings.weightVersion} onChange={event => setSettings({ ...settings, weightVersion: event.target.value })}><option value="literature">Literature-assumed (35 / 25 / 20 / 20)</option><option value="elicited">User-elicited (from the survey)</option></select></div>
        <fieldset><legend>User-elicited weights, in percent</legend>{WEIGHTS.map(([key, label]) => <div key={key}><label htmlFor={`weight-${key}`}>{label}</label><input id={`weight-${key}`} type="number" min="0" max="100" step="any" value={settings.elicited[key]} onChange={event => setSettings({ ...settings, elicited: { ...settings.elicited, [key]: event.target.value } })} /></div>)}</fieldset>
        <div className="admin-actions"><button className="button primary" type="submit">Save weights</button></div>
      </form>
    </div>
  </section>;
}
