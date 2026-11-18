import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { api, setGuest, setUserToken } from './api.js';

export function Splash() {
  return <div className="splash" role="status">
    <img src="/logo.png" alt="" width="120" height="120" />
    <p className="splash-name">XMUM <span>Navigate</span></p>
    <span className="visually-hidden">Loading XMUM Navigate</span>
  </div>;
}

function Field({ id, label, icon: Icon, children }) {
  return <><label htmlFor={id}>{label}</label><div className="entry-field"><Icon size={18} aria-hidden="true" />{children}</div></>;
}

export default function Welcome({ onEnter }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const registering = mode === 'register';
  const field = key => event => setForm({ ...form, [key]: event.target.value });
  const submit = async event => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token, user } = await api(`/auth/${mode}`, { method: 'POST', body: { name: form.name, email: form.email, password: form.password } });
      setUserToken(token);
      setGuest(false);
      onEnter(user);
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  };
  const passwordType = showPassword ? 'text' : 'password';
  return <main className="entry">
    <div className="entry-card">
      <h1>{registering ? 'Create account' : 'Log in'}</h1>
      <p className="entry-sub">Find your way around XMUM.</p>
      <form className="entry-form" onSubmit={submit}>
        {registering && <Field id="entry-name" label="Name" icon={User}><input id="entry-name" name="name" autoComplete="name" enterKeyHint="next" required value={form.name} onChange={field('name')} /></Field>}
        {/* "username" (not "email") is what password managers key saved logins on. */}
        <Field id="entry-email" label="Email" icon={Mail}><input id="entry-email" name="email" type="email" autoComplete="username" spellCheck="false" enterKeyHint="next" placeholder="you@example.com" required value={form.email} onChange={field('email')} /></Field>
        <Field id="entry-password" label="Password" icon={Lock}>
          <input id="entry-password" name="password" type={passwordType} autoComplete={registering ? 'new-password' : 'current-password'} enterKeyHint="done" minLength={registering ? 8 : undefined} required value={form.password} onChange={field('password')} />
          <button type="button" className="entry-eye" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button>
        </Field>
        {error && <p role="alert">{error}</p>}
        <button className="button primary" type="submit" disabled={busy}>{registering ? 'Create account' : 'Log in'}</button>
        <p className="entry-or">or</p>
        <button className="button secondary" type="button" onClick={() => { setGuest(true); onEnter(null); }}>Continue as guest</button>
        <p className="entry-hint">For parents and visitors. Guests can still search, get routes and browse venues and canteens.</p>
      </form>
      <p className="entry-switch">{registering ? 'Already have an account?' : 'New to XMUM Navigate?'} <button type="button" onClick={() => { setMode(registering ? 'login' : 'register'); setError(''); }}>{registering ? 'Log in' : 'Create an account'}</button></p>
    </div>
    <p className="entry-logo"><img src="/logo.png" alt="" width="40" height="40" />XMUM <span>Navigate</span></p>
  </main>;
}
