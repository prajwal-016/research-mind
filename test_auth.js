import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('\n--- Test 1: Sign in as Ananya Rao ---');
  const { data: data1, error: error1 } = await supabase.auth.signInWithPassword({
    email: 'ananya.rao@nitk.edu',
    password: 'Password123!'
  });
  if (error1) {
    console.error('Ananya Rao Login Failed:', error1.message);
  } else {
    console.log('Ananya Rao Login Succeeded! User ID:', data1.user?.id);
  }

  console.log('\n--- Test 2: Register a fresh temporary user ---');
  const tempEmail = `test-${Math.floor(Math.random() * 100000)}@nitk.edu`;
  const { data: data2, error: error2 } = await supabase.auth.signUp({
    email: tempEmail,
    password: 'Password123!'
  });
  if (error2) {
    console.error('Signup Failed:', error2.message);
    return;
  }
  console.log('Signup Succeeded! User ID:', data2.user?.id);
  console.log('Email Confirmed At:', data2.user?.email_confirmed_at);

  console.log('\n--- Test 3: Sign in as fresh temporary user ---');
  const { data: data3, error: error3 } = await supabase.auth.signInWithPassword({
    email: tempEmail,
    password: 'Password123!'
  });
  if (error3) {
    console.error('Temp User Login Failed:', error3.message);
  } else {
    console.log('Temp User Login Succeeded! User ID:', data3.user?.id);
  }
}

test();
