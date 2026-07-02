-- =============================================================================
-- ResearchMind — Consolidated Users, Roles & 5 Labs Seeding Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script:
--   1. Creates all 13 users in auth.users (the original 10 + 3 new PIs).
--   2. Creates the 5 research labs with the correct creators and fields.
--   3. Maps lab membership (owners, admins, members, and guests).
--
-- Password for all users: Password123!
-- =============================================================================

DO $$
DECLARE
  -- Lab IDs
  lab_ai       UUID := uuid_generate_v4();
  lab_cvr      UUID := uuid_generate_v4();
  lab_cyber    UUID := uuid_generate_v4();
  lab_dsa      UUID := uuid_generate_v4();
  lab_iot      UUID := uuid_generate_v4();
  
  -- User IDs
  uid_ananya   UUID := uuid_generate_v4();
  uid_vikram   UUID := uuid_generate_v4();
  uid_rahul    UUID := uuid_generate_v4();
  uid_priya    UUID := uuid_generate_v4();
  uid_arjun    UUID := uuid_generate_v4();
  uid_sneha    UUID := uuid_generate_v4();
  uid_neha     UUID := uuid_generate_v4();
  uid_karthik  UUID := uuid_generate_v4();
  uid_aditi    UUID := uuid_generate_v4();
  uid_rohan    UUID := uuid_generate_v4();
  
  -- New PIs for the additional labs
  uid_meera    UUID := uuid_generate_v4();
  uid_rajesh   UUID := uuid_generate_v4();
  uid_shalini  UUID := uuid_generate_v4();

  -- Pre-computed bcrypt hash for 'Password123!' (cost factor 10)
  v_pass_hash  TEXT := '$2b$10$c9WFkOYThuCu5hq6lOh5iOXlXP5sqGn5CAFvhyNSU0L0YQkyEotOq';
BEGIN

  -- ---------------------------------------------------------------------------
  -- 1. Create Auth Users (auth.users)
  -- ---------------------------------------------------------------------------
  
  -- Dr. Ananya Rao (Owner)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_ananya, 'authenticated', 'authenticated', 'ananya.rao@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Ananya Rao","position":"PI","institution":"NITK","department":"Computer Science & Engineering"}', now(), now());

  -- Dr. Vikram Iyer (Admin)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_vikram, 'authenticated', 'authenticated', 'vikram.iyer@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Vikram Iyer","position":"PI","institution":"NITK","department":"Computer Science & Engineering"}', now(), now());

  -- Rahul Sharma (Member - PhD Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_rahul, 'authenticated', 'authenticated', 'rahul.sharma@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Rahul Sharma","position":"PhD Research Scholar","institution":"NITK"}', now(), now());

  -- Priya Nair (Member - PhD Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_priya, 'authenticated', 'authenticated', 'priya.nair@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Priya Nair","position":"PhD Research Scholar","institution":"NITK"}', now(), now());

  -- Arjun Patel (Member - Research Assistant)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_arjun, 'authenticated', 'authenticated', 'arjun.patel@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Arjun Patel","position":"Research Assistant","institution":"NITK"}', now(), now());

  -- Sneha Kulkarni (Member - Master's Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_sneha, 'authenticated', 'authenticated', 'sneha.kulkarni@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sneha Kulkarni","position":"Master''s Student","institution":"NITK"}', now(), now());

  -- Neha Gupta (Member - Master's Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_neha, 'authenticated', 'authenticated', 'neha.gupta@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Neha Gupta","position":"Master''s Student","institution":"NITK"}', now(), now());

  -- Karthik Reddy (Member - Undergraduate Student)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_karthik, 'authenticated', 'authenticated', 'karthik.reddy@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Karthik Reddy","position":"Undergraduate Student","institution":"NITK"}', now(), now());

  -- Aditi Mehta (Guest)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_aditi, 'authenticated', 'authenticated', 'aditi.mehta@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Aditi Mehta","position":"Undergraduate Student","institution":"NITK"}', now(), now());

  -- Rohan Verma (Guest)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_rohan, 'authenticated', 'authenticated', 'rohan.verma@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Rohan Verma","position":"Undergraduate Student","institution":"NITK"}', now(), now());

  -- Dr. Meera Krishnan (Professor - Cyber Security PI)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_meera, 'authenticated', 'authenticated', 'meera.krishnan@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Meera Krishnan","position":"Professor","institution":"NITK","department":"Computer Science & Engineering"}', now(), now());

  -- Dr. Rajesh Kumar (Professor - Data Science PI)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_rajesh, 'authenticated', 'authenticated', 'rajesh.kumar@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Rajesh Kumar","position":"Professor","institution":"NITK","department":"Computer Science & Engineering"}', now(), now());

  -- Dr. Shalini Deshpande (Professor - IoT PI)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (uid_shalini, 'authenticated', 'authenticated', 'shalini.deshpande@nitk.edu', v_pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Shalini Deshpande","position":"Professor","institution":"NITK","department":"Electronics & Communication Engineering"}', now(), now());

  -- ---------------------------------------------------------------------------
  -- 2. Create the 5 Research Labs
  -- ---------------------------------------------------------------------------
  
  -- Lab 1: Artificial Intelligence Research Lab (PI: Dr. Ananya)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (
    lab_ai,
    'Artificial Intelligence Research Lab',
    'ai-lab',
    'The Artificial Intelligence Research Lab focuses on advanced AI systems, long-term memory architectures, retrieval-augmented generation, knowledge graphs, and intelligent research assistants. The lab develops scalable AI solutions for academic and industrial research.',
    'NITK',
    'Computer Science & Engineering',
    ARRAY['large-language-models', 'knowledge-graphs', 'retrieval-augmented-generation', 'institutional-memory', 'multi-agent-systems', 'ai-assistants'],
    uid_ananya,
    '{"memory_health": 100, "ai_insights": []}'
  );

  -- Lab 2: Computer Vision & Robotics Lab (PI: Dr. Vikram)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (
    lab_cvr,
    'Computer Vision & Robotics Lab',
    'cvr-lab',
    'The lab conducts research in computer vision, robotic perception, autonomous navigation, image understanding, and intelligent robotic systems.',
    'NITK',
    'Computer Science & Engineering',
    ARRAY['computer-vision', 'image-processing', 'object-detection', 'autonomous-robotics', 'slam', 'edge-ai'],
    uid_vikram,
    '{"memory_health": 100, "ai_insights": []}'
  );

  -- Lab 3: Cyber Security Research Lab (PI: Dr. Meera)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (
    lab_cyber,
    'Cyber Security Research Lab',
    'cyber-lab',
    'The Cyber Security Research Lab investigates modern cyber threats, secure computing architectures, digital forensics, and privacy-preserving technologies.',
    'NITK',
    'Computer Science & Engineering',
    ARRAY['network-security', 'digital-forensics', 'malware-analysis', 'zero-trust-security', 'threat-intelligence'],
    uid_meera,
    '{"memory_health": 100, "ai_insights": []}'
  );

  -- Lab 4: Data Science & Analytics Lab (PI: Dr. Rajesh)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (
    lab_dsa,
    'Data Science & Analytics Lab',
    'dsa-lab',
    'The Data Science & Analytics Lab focuses on extracting insights from structured and unstructured data using advanced analytics and machine learning techniques.',
    'NITK',
    'Computer Science & Engineering',
    ARRAY['big-data', 'predictive-analytics', 'data-mining', 'machine-learning', 'data-visualization'],
    uid_rajesh,
    '{"memory_health": 100, "ai_insights": []}'
  );

  -- Lab 5: Internet of Things & Embedded Systems Lab (PI: Dr. Shalini)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (
    lab_iot,
    'Internet of Things & Embedded Systems Lab',
    'iot-lab',
    'The IoT Lab develops smart sensing systems, embedded platforms, and connected devices for industrial, healthcare, and environmental applications.',
    'NITK',
    'Electronics & Communication Engineering',
    ARRAY['iot', 'embedded-systems', 'wireless-sensor-networks', 'smart-agriculture', 'edge-computing'],
    uid_shalini,
    '{"memory_health": 100, "ai_insights": []}'
  );

  -- ---------------------------------------------------------------------------
  -- 3. Add Memberships to the Primary Lab (AI Research Lab)
  -- ---------------------------------------------------------------------------
  -- NOTE: Lab creators are auto-added as Owner/PIs to their respective labs 
  -- via the database trigger handle_new_lab(). We register the rest of the team below.
  
  INSERT INTO public.lab_members (lab_id, user_id, role, title)
  VALUES
    (lab_ai, uid_vikram,   'admin',  'Co-Principal Investigator'),
    (lab_ai, uid_rahul,    'member', 'PhD Research Scholar'),
    (lab_ai, uid_priya,    'member', 'PhD Research Scholar'),
    (lab_ai, uid_arjun,    'member', 'Research Assistant'),
    (lab_ai, uid_sneha,    'member', 'Master''s Student'),
    (lab_ai, uid_neha,     'member', 'Master''s Student'),
    (lab_ai, uid_karthik,  'member', 'Undergraduate Research Intern'),
    (lab_ai, uid_aditi,    'guest',  'External Research Collaborator'),
    (lab_ai, uid_rohan,    'guest',  'Undergraduate Observer')
  ON CONFLICT (lab_id, user_id) DO NOTHING;

END;
$$;
