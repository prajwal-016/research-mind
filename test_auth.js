import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runDiagnostics() {
  console.log('VITE_SUPABASE_URL:', supabaseUrl);

  // 1. Create a temporary helper function to read auth.users
  console.log('\nCreating database diagnostic function...');
  const createFuncSQL = `
    CREATE OR REPLACE FUNCTION public.check_auth_users()
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      result JSONB;
    BEGIN
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', id,
        'email', email,
        'email_confirmed_at', email_confirmed_at,
        'encrypted_password', substring(encrypted_password from 1 for 15) || '...',
        'aud', aud,
        'role', role
      )), '[]'::jsonb) INTO result FROM auth.users;
      RETURN result;
    END;
    $$;
  `;

  // We can run this SQL via Supabase REST API since we don't have a direct postgres connection.
  // Wait, let's see if we can call a query. Actually, we can't run arbitrary SQL from the client anon key easily
  // unless we have a RPC helper already, or if we define it in the SQL Editor.
  // So instead, let's tell the user to run it in their SQL editor and share the output, OR we can test the login error shape.
  
  console.log('\n--- Diagnosing Login Error for ananya.rao@nitk.edu ---');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'ananya.rao@nitk.edu',
    password: 'Password123!'
  });

  if (error) {
    console.error('Error Object:', JSON.stringify(error, null, 2));
  } else {
    console.log('Login Succeeded! User:', data.user);
  }
}

runDiagnostics();
