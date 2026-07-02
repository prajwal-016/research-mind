-- =============================================================================
-- ResearchMind — Users and Roles Seeding Script (Generated Column Fix)
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script inserts the 10 demo users with their exact metadata,
-- creates the "Computer Science & Engineering Lab", and maps their roles.
--
-- Password for all users: Password123!
-- =============================================================================

DO $$
DECLARE
  v_lab_id UUID := uuid_generate_v4();
  
  -- Generated User UUIDs
  uid_ananya  UUID := uuid_generate_v4();
  uid_vikram  UUID := uuid_generate_v4();
  uid_rahul   UUID := uuid_generate_v4();
  uid_priya   UUID := uuid_generate_v4();
  uid_arjun   UUID := uuid_generate_v4();
  uid_sneha   UUID := uuid_generate_v4();
  uid_neha    UUID := uuid_generate_v4();
  uid_karthik UUID := uuid_generate_v4();
  uid_aditi   UUID := uuid_generate_v4();
  uid_rohan   UUID := uuid_generate_v4();
BEGIN

  -- 1. Create Auth Users (auth.users)
  -- Dr. Ananya Rao (Owner)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_ananya, 'authenticated', 'authenticated', 'ananya.rao@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Dr. Ananya Rao","position":"PI","institution":"NITK","department":"Computer Science & Engineering"}', 
    now(), now()
  );

  -- Dr. Vikram Iyer (Admin)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_vikram, 'authenticated', 'authenticated', 'vikram.iyer@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Dr. Vikram Iyer","position":"PI","institution":"NITK","department":"Computer Science & Engineering"}', 
    now(), now()
  );

  -- Rahul Sharma (Member - PhD Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_rahul, 'authenticated', 'authenticated', 'rahul.sharma@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Rahul Sharma","position":"PhD Research Scholar","institution":"NITK"}', 
    now(), now()
  );

  -- Priya Nair (Member - PhD Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_priya, 'authenticated', 'authenticated', 'priya.nair@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Priya Nair","position":"PhD Research Scholar","institution":"NITK"}', 
    now(), now()
  );

  -- Arjun Patel (Member - Research Assistant)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_arjun, 'authenticated', 'authenticated', 'arjun.patel@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Arjun Patel","position":"Research Assistant","institution":"NITK"}', 
    now(), now()
  );

  -- Sneha Kulkarni (Member - Master's Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_sneha, 'authenticated', 'authenticated', 'sneha.kulkarni@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Sneha Kulkarni","position":"Master''s Student","institution":"NITK"}', 
    now(), now()
  );

  -- Neha Gupta (Member - Master's Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_neha, 'authenticated', 'authenticated', 'neha.gupta@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Neha Gupta","position":"Master''s Student","institution":"NITK"}', 
    now(), now()
  );

  -- Karthik Reddy (Member - Undergraduate Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_karthik, 'authenticated', 'authenticated', 'karthik.reddy@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Karthik Reddy","position":"Undergraduate Student","institution":"NITK"}', 
    now(), now()
  );

  -- Aditi Mehta (Guest)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_aditi, 'authenticated', 'authenticated', 'aditi.mehta@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Aditi Mehta","position":"Undergraduate Student","institution":"NITK"}', 
    now(), now()
  );

  -- Rohan Verma (Guest)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    uid_rohan, 'authenticated', 'authenticated', 'rohan.verma@nitk.edu', 
    crypt('Password123!', gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Rohan Verma","position":"Undergraduate Student","institution":"NITK"}', 
    now(), now()
  );

  -- 2. Create official Research Lab (Dr. Ananya Rao is creator)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by)
  VALUES (
    v_lab_id,
    'Computer Science & Engineering Lab',
    'cse-lab',
    'Specialized on Knowledge Graphs, Retrieval-Augmented Generation, and AI Memory Systems.',
    'NITK',
    'Computer Science & Engineering',
    ARRAY['knowledge-graphs', 'retrieval-augmented-generation', 'ai-memory-systems'],
    uid_ananya
  );

  -- 3. Alice is owner by default, let's insert lab members
  -- Note: Dr. Ananya is already Owner of cse-lab via public.labs insert trigger
  INSERT INTO public.lab_members (lab_id, user_id, role, title)
  VALUES
    (v_lab_id, uid_vikram, 'admin', 'Co-Principal Investigator'),
    (v_lab_id, uid_rahul,  'member', 'PhD Research Scholar'),
    (v_lab_id, uid_priya,  'member', 'PhD Research Scholar'),
    (v_lab_id, uid_arjun,  'member', 'Research Assistant'),
    (v_lab_id, uid_sneha,  'member', 'Master''s Student'),
    (v_lab_id, uid_neha,   'member', 'Master''s Student'),
    (v_lab_id, uid_karthik, 'member', 'Undergraduate Research Intern'),
    (v_lab_id, uid_aditi,   'guest',  'External Research Collaborator'),
    (v_lab_id, uid_rohan,   'guest',  'Undergraduate Observer')
  ON CONFLICT (lab_id, user_id) DO NOTHING;

END;
$$;
