import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load local env variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clear() {
  console.log('Connecting to Supabase...');
  
  // Sign in as PI to get credentials context bypassing standard RLS limits
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'ananya.rao@nitk.edu',
    password: 'Password123!'
  });

  if (authError) {
    console.error('Failed to authenticate as lab manager:', authError.message);
    process.exit(1);
  }

  console.log('Clearing database tables...');
  
  const tables = [
    'memory_queue',
    'activity_logs',
    'publications',
    'research_decisions',
    'meetings',
    'datasets',
    'research_papers',
    'experiments',
    'projects',
    'labs'
  ];

  for (const table of tables) {
    console.log(`Truncating table: ${table}...`);
    const { error } = await supabase
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all records safely

    if (error) {
      console.warn(`Warning: failed to clear ${table}:`, error.message);
    } else {
      console.log(`Table ${table} cleared successfully.`);
    }
  }

  console.log('Database cleanup completed!');
}

clear();
