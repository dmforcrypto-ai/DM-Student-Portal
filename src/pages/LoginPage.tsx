import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Field } from '../components/ui';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      // No navigate() needed — AppRoutes swaps to the portal once `user` is set.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign you in');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-full lg:grid-cols-2">
      <div className="hidden bg-(--ink) px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="display text-[26px] font-semibold">DM University Student Portal</p>
        <div>
          <p className="display max-w-[14ch] text-[52px] font-normal leading-[1.05]">
            Your courses, your marks, in one place.
          </p>
          <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-white/60">
            Enrolments, posted grades, and term averages update the moment your instructor
            records them.
          </p>
        </div>
        <p className="text-xs text-white/40">Developed by: Denmark</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-90">
          <h1 className="display text-[30px] font-semibold tracking-tight">
            {mode === 'login' ? 'Sign in' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-(--muted)">
            {mode === 'login'
              ? 'Use the email your school issued you.'
              : 'New accounts start with student access.'}
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            {mode === 'register' && (
              <Field
                label="Full name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                autoComplete="name"
                required
              />
            )}
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              autoComplete="email"
              required
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />

            {error && <p className="text-sm text-(--fail)">{error}</p>}

            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Working' : mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="mt-5 text-sm text-(--muted) underline underline-offset-4 hover:text-(--ink)"
          >
            {mode === 'login' ? 'I need an account' : 'I already have an account'}
          </button>
        </div>
      </div>
    </div>
  );
}
