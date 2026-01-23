import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { zconfig } from '@/config/config'

// 1. Make the function ASYNC
export async function createServerSupabase() {
  // 2. AWAIT the cookies
  const cookieStore = await cookies()

  return createServerClient(
    zconfig.supabase.url,
    zconfig.supabase.anon,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // This error is expected if called from a Server Component
          }
        },
      },
    }
  )
}