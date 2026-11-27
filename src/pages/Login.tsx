// JourneyFX Workspace — Login | V1.0.0
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

interface LoginProps {
  client: SupabaseClient | null;
}

export default function Login({ client }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    document.title = 'Sign In | JourneyFX Workspace';
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    if (!client) {
      setError('Autentikasi belum dikonfigurasi. Hubungi administrator.');
      return;
    }
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      const { data, error: authError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError || !data.session || !data.user) {
        setError('Login gagal. Periksa email dan password atau hubungi administrator.');
        return;
      }
      setPassword('');
      navigate('/', { replace: true });
    } catch {
      setError('Login tidak dapat diproses. Periksa koneksi dan coba kembali.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <main className="login-layout relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dashboard-grid bg-[length:32px_32px] opacity-40" />
      <div className="relative w-full max-w-[420px] motion-safe:animate-fade-up">
        <div className="login-card mx-auto">
          <div className="login-logo" aria-hidden="true">J.</div>
          <div className="mb-8 text-center">
            <p className="eyebrow">Internal Management System</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">JourneyFX Workspace</h1>
            <p className="mt-2 text-sm text-workspace-muted">Masuk untuk mengakses workspace management.</p>
          </div>

          {!client && (
            <div role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-workspace-border bg-workspace-background p-3 text-xs text-workspace-muted">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>Autentikasi belum dikonfigurasi. Login belum tersedia.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="form-group" htmlFor="login-email">
              <span className="form-label">Email Address</span>
              <div className="relative">
                <Mail aria-hidden="true" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-workspace-muted" />
                <input id="login-email" name="email" type="email" autoComplete="username" required maxLength={254}
                  className="workspace-input !pl-10" placeholder="name@example.com" value={email} disabled={busy || !client}
                  onChange={event => { setEmail(event.target.value); setError(''); }} />
              </div>
            </label>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="relative">
                <LockKeyhole aria-hidden="true" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-workspace-muted" />
                <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                  className="workspace-input !pl-10 !pr-12" placeholder="Masukkan password" value={password} disabled={busy || !client}
                  onChange={event => { setPassword(event.target.value); setError(''); }} />
                <button type="button" className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-workspace-muted hover:text-white"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} aria-pressed={showPassword} disabled={busy || !client}
