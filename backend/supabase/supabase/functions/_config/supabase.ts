import {
  createClient,
  SupabaseClient,
  PostgrestError
} from 'https://esm.sh/@supabase/supabase-js@2'


/**
 * 
 * @param req 
 * @returns 
 * 
 * With anon key we can edit / select with logged user,
 * but if the table have policy for select, insert, edit, update.... we it will work too
 */
export function createEdgeSupabaseClient(req: Request): SupabaseClient {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
  // const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  // const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_SECRET_KEY')!;
  console.log("SUPABASE_URL:", SUPABASE_URL);
  console.log("SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY);

  const authHeader = req.headers.get('Authorization');
  console.log("authHeader:", authHeader);

  return createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    // SUPABASE_SERVICE_ROLE_KEY,
    // "example-key",
    {
      global: {
        headers: {
          Authorization: authHeader || '',
        },
      },
    }
  );
}

/**
 * 
 * @returns 
 * With this we can edit all table
 */
export function createEdgeSupabaseServiceClient(): SupabaseClient {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}