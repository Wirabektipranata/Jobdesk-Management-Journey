// ==================================================
// JOURNEYFX WORKSPACE
// Database & Authentication Service | V1.0.0
// ==================================================

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

interface SupabaseConfiguration {
  client: SupabaseClient | null;
  error: string | null;
}

// ==================================================
// VALIDATE SUPABASE URL
// ==================================================

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);

    const localDevelopment =
      import.meta.env.DEV &&
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]']
        .includes(url.hostname);

    return (
      (url.protocol === 'https:' || localDevelopment) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === '/'
    );

  } catch {
    return false;
  }
}

// ==================================================
// VALIDATE PUBLIC KEY FORMAT
// ==================================================

function isPublicKey(key: string): boolean {

  // Supabase Publishable Key
  if (key.startsWith('sb_publishable_')) {
    return key.length > 'sb_publishable_'.length;
  }

  // Legacy Supabase Anon JWT
  // Format check only, not signature verification.
  try {

    const parts = key.split('.');

    if (
      parts.length !== 3 ||
      parts.some(part => !part)
    ) {
      return false;
    }

    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const padded = payload.padEnd(
      Math.ceil(payload.length / 4) * 4,
      '='
    );

    const claims = JSON.parse(
      atob(padded)
    ) as { role?: unknown };

    return claims?.role === 'anon';

  } catch {
    return false;
  }
}

// ==================================================
// INITIALIZE SUPABASE CLIENT
// ==================================================

function initializeSupabase(): SupabaseConfiguration {

  if (!supabaseUrl || !supabaseKey) {
    return {
      client: null,
      error: 'Konfigurasi Supabase belum tersedia.',
    };
  }

  if (
    !isValidUrl(supabaseUrl) ||
    !isPublicKey(supabaseKey)
  ) {
    return {
      client: null,
      error: 'URL atau public key Supabase tidak valid.',
    };
  }

  try {

    const client = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      }
    );

    return {
      client,
      error: null,
    };

  } catch {

    return {
      client: null,
      error: 'Supabase client gagal diinisialisasi.',
    };

  }
}

// ==================================================
// GLOBAL DATABASE CLIENT
// ==================================================

const configuration = initializeSupabase();

export const supabase =
  configuration.client;

export const supabaseConfigError =
  configuration.error;

export const isSupabaseConfigured =
  supabase !== null;

// ==================================================
// REQUIRED DATABASE CLIENT
// ==================================================

export function requireSupabase(): SupabaseClient {

  if (!supabase) {
    throw new Error(
      supabaseConfigError ??
      'Supabase belum tersedia.'
    );
  }

  return supabase;
}

// ==================================================
// DEFAULT EXPORT
// ==================================================

export default supabase;

// ==================================================
// JOURNEYFX WORKSPACE
// One Team. One Workspace. One Direction.
// ==================================================
