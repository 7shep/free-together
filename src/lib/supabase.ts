import { createClient } from '@supabase/supabase-js';

function readEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

const supabaseUrl = readEnvValue(import.meta.env.VITE_SUPABASE_URL as string | undefined);
const supabasePublishableKey = readEnvValue(
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined,
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    'Supabase is not configured. Copy .env.example to .env.local, set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then restart Vite.',
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    );
  }

  return supabase;
}
