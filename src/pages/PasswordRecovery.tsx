import {useState} from 'react';
import type {FormEvent} from 'react';
import {createClient} from '@supabase/supabase-js';
import {ArrowLeft, ShieldCheck} from 'lucide-react';
import {supabase, supabaseConfigError} from '../services/supabase';

function recoveryMessage(error: unknown, fallback: string): string {
  const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
  if (status === 401) return 'Konfigurasi autentikasi tidak valid. Hubungi administrator.';
  if (status === 429) return 'Terlalu banyak percobaan. Tunggu sebelum mencoba lagi.';
  return fallback;
}

export default function PasswordRecovery({initialEmail, onBack}: {initialEmail: string; onBack: (email: string, notice?: string) => void}) {
  const [email, setEmail] = useState(initialEmail);
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function requestCode(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    const address = email.trim();
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await supabase.auth.resetPasswordForEmail(address, {redirectTo: `${window.location.origin}/login`});
      if (result.error) throw result.error;
      setEmail(address); setCode(''); setPassword(''); setConfirmation(''); setStep('reset');
      setMessage('Jika akun memenuhi syarat, kode pemulihan akan dikirim. Periksa inbox dan spam.');
    } catch (e) {
      setError(recoveryMessage(e, 'Kode belum dapat diminta. Coba lagi atau hubungi administrator.'));
    } finally { setBusy(false); }
  }

  async function reset(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    setError('');
    if (!/^\d{6,10}$/.test(code.trim())) {setError('Masukkan kode numerik sesuai email pemulihan.'); return;}
    if (password.length < 12 || new TextEncoder().encode(password).length > 72) {setError('Gunakan minimal 12 karakter dan maksimal 72 byte.'); return;}
    if (password !== confirmation) {setError('Konfirmasi password tidak sama.'); return;}
    const recoveryUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
    const recoveryKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';
    if (!recoveryUrl || !recoveryKey) {
      setError('Konfigurasi Supabase belum tersedia. Hubungi administrator.');
      return;
    }
    setBusy(true);
    // Isolated, in-memory session: recovery must not sign the main workspace in.
    let client: ReturnType<typeof createClient> | undefined;
    let verified = false;
    let changed = false;
    let revoked = false;
    try {
      client = createClient(recoveryUrl, recoveryKey, {
        auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'journeyfx-recovery-ephemeral'}
      });
      const result = await client.auth.verifyOtp({email: email.trim(), token: code.trim(), type: 'recovery'});
      if (result.error || !result.data.session || !result.data.user) throw result.error ?? new Error('Recovery session missing');
      verified = true;
      const update = await client.auth.updateUser({password});
      if (update.error) throw update.error;
      changed = true;
      // Invalidate refresh tokens of other sessions where possible.
      try { const out = await client.auth.signOut({scope: 'global'}); revoked = !out.error; } catch { /* report separately */ }
    } catch (e) {
      setError(recoveryMessage(e, verified ? 'Password belum diubah. Minta kode baru dan coba kembali; pastikan password memenuhi kebijakan Supabase.' : 'Kode tidak valid atau sudah kedaluwarsa. Periksa kode atau minta kode baru.'));
      if (verified) { setStep('request'); setMessage(''); }
    } finally {
      if (client && verified && !revoked) { try { await client.auth.signOut({scope: 'local'}); } catch { /* ephemeral session is not persisted */ } }
      setCode(''); setPassword(''); setConfirmation(''); setBusy(false);
    }
    if (changed) onBack(email, revoked ? 'Password berhasil diubah. Silakan masuk dengan password baru.' : 'Password berhasil diubah. Silakan masuk kembali. Pencabutan sesi lain belum dapat dikonfirmasi.');
  }

  return <>
    <h1>{step === 'request' ? 'Forgot your password?' : 'Reset your password'}</h1>
    <p>{step === 'request' ? 'Masukkan email akun internal Anda untuk meminta kode pemulihan.' : 'Masukkan kode dari email dan tentukan password baru.'}</p>
    {message && <p role="status" className="small">{message}</p>}
    {step === 'request' ? <form onSubmit={requestCode}>
      <label>Email<input type="email" autoComplete="email" required value={email} disabled={busy} onChange={e => setEmail(e.target.value)}/></label>
      <button className="primary" type="submit" disabled={busy || !supabase}>{busy ? 'Sending…' : 'Send recovery code'}<ShieldCheck size={16}/></button>
    </form> : <form onSubmit={reset}>
      <label>Email<input type="email" readOnly value={email}/></label>
      <label>Recovery code<input type="text" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6,10}" maxLength={10} value={code} disabled={busy} onChange={e => setCode(e.target.value)}/></label>
      <label>New password<input type="password" autoComplete="new-password" required minLength={12} maxLength={72} value={password} disabled={busy} onChange={e => setPassword(e.target.value)}/></label>
      <label>Confirm new password<input type="password" autoComplete="new-password" required minLength={12} maxLength={72} value={confirmation} disabled={busy} onChange={e => setConfirmation(e.target.value)}/></label>
      <button className="primary" type="submit" disabled={busy || !supabase}>{busy ? 'Resetting…' : 'Reset password'}<ShieldCheck size={16}/></button>
    </form>}
    {(error || supabaseConfigError) && <p className="errorbox" role="alert">{error || supabaseConfigError}</p>}
    {step === 'reset' && <button type="button" disabled={busy} onClick={() => {setStep('request'); setCode(''); setPassword(''); setConfirmation(''); setError(''); setMessage('');}}>Request a new code / Change email</button>}
    <button className="ghost" type="button" disabled={busy} onClick={() => onBack(email)}><ArrowLeft size={16}/> Back to sign in</button>
  </>;
}
