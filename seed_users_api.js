import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const users = [
  {
    email: 'ananya.rao@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Dr. Ananya Rao',
      position: 'PI',
      institution: 'NITK',
      department: 'Computer Science & Engineering'
    }
  },
  {
    email: 'vikram.iyer@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Dr. Vikram Iyer',
      position: 'PI',
      institution: 'NITK',
      department: 'Computer Science & Engineering'
    }
  },
  {
    email: 'rahul.sharma@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Rahul Sharma',
      position: 'PhD Research Scholar',
      institution: 'NITK'
    }
  },
  {
    email: 'priya.nair@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Priya Nair',
      position: 'PhD Research Scholar',
      institution: 'NITK'
    }
  },
  {
    email: 'arjun.patel@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Arjun Patel',
      position: 'Research Assistant',
      institution: 'NITK'
    }
  },
  {
    email: 'sneha.kulkarni@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Sneha Kulkarni',
      position: 'Master\'s Student',
      institution: 'NITK'
    }
  },
  {
    email: 'neha.gupta@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Neha Gupta',
      position: 'Master\'s Student',
      institution: 'NITK'
    }
  },
  {
    email: 'karthik.reddy@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Karthik Reddy',
      position: 'Undergraduate Student',
      institution: 'NITK'
    }
  },
  {
    email: 'aditi.mehta@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Aditi Mehta',
      position: 'Undergraduate Student',
      institution: 'NITK'
    }
  },
  {
    email: 'rohan.verma@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Rohan Verma',
      position: 'Undergraduate Student',
      institution: 'NITK'
    }
  },
  {
    email: 'meera.krishnan@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Dr. Meera Krishnan',
      position: 'Professor',
      institution: 'NITK',
      department: 'Computer Science & Engineering'
    }
  },
  {
    email: 'rajesh.kumar@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Dr. Rajesh Kumar',
      position: 'Professor',
      institution: 'NITK',
      department: 'Computer Science & Engineering'
    }
  },
  {
    email: 'shalini.deshpande@nitk.edu',
    password: 'Password123!',
    meta: {
      full_name: 'Dr. Shalini Deshpande',
      position: 'Professor',
      institution: 'NITK',
      department: 'Electronics & Communication Engineering'
    }
  }
];

async function seedUsers() {
  console.log('Signing up users via Supabase client API...');
  
  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: u.meta
    });

    if (error) {
      console.log(`[-] Failed / Already exists: ${u.email} (${error.message})`);
    } else {
      console.log(`[+] Successfully signed up: ${u.email} (ID: ${data.user?.id})`);
    }
  }

  console.log('\n=============================================================');
  console.log('🎉 API Signups Completed via Admin API!');
  console.log('=============================================================');
  console.log('Next step:');
  console.log('All users are fully created and pre-confirmed. No verification email needed!');
  console.log('You can now run your SQL seeding scripts for labs, projects, etc.');
  console.log('=============================================================');
}

seedUsers();
