import { zconfig } from '@/config/config'
// import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

/*export const supabaseClient = createClient(
  zconfig.supabase.url,
  zconfig.supabase.anon
)*/



/**
 * This function creates a Supabase client intended for use 
 * ONLY in Client Components ("use client").
 */
export function createClient() {
  return createBrowserClient(
    zconfig.supabase.url,
    zconfig.supabase.anon,
    {
      cookieOptions: {
        name: 'sb-auth-token', // Standard name
        path: '/',
        sameSite: 'lax',
        secure: true, // Crucial for HTTPS/Vercel
      },
    }
  )
}

