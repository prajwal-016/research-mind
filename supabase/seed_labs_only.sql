-- =============================================================================
-- ResearchMind — 5 Labs & Memberships Seeding Script (Labs Only)
-- =============================================================================
-- Run this in the Supabase SQL Editor AFTER running seed_users_api.js
-- and confirming emails.
-- =============================================================================

DO $$
DECLARE
  -- Lab IDs
  lab_ai       UUID := uuid_generate_v4();
  lab_cvr      UUID := uuid_generate_v4();
  lab_cyber    UUID := uuid_generate_v4();
  lab_dsa      UUID := uuid_generate_v4();
  lab_iot      UUID := uuid_generate_v4();
  
  -- User IDs (fetched dynamically from public.users)
  uid_ananya   UUID;
  uid_vikram   UUID;
  uid_rahul    UUID;
  uid_priya    UUID;
  uid_arjun    UUID;
  uid_sneha    UUID;
  uid_neha     UUID;
  uid_karthik  UUID;
  uid_aditi    UUID;
  uid_rohan    UUID;
  uid_meera    UUID;
  uid_rajesh   UUID;
  uid_shalini  UUID;
BEGIN

  -- 1. Fetch User IDs
  SELECT id INTO uid_ananya  FROM public.users WHERE email = 'ananya.rao@nitk.edu' LIMIT 1;
  SELECT id INTO uid_vikram  FROM public.users WHERE email = 'vikram.iyer@nitk.edu' LIMIT 1;
  SELECT id INTO uid_rahul   FROM public.users WHERE email = 'rahul.sharma@nitk.edu' LIMIT 1;
  SELECT id INTO uid_priya   FROM public.users WHERE email = 'priya.nair@nitk.edu' LIMIT 1;
  SELECT id INTO uid_arjun   FROM public.users WHERE email = 'arjun.patel@nitk.edu' LIMIT 1;
  SELECT id INTO uid_sneha   FROM public.users WHERE email = 'sneha.kulkarni@nitk.edu' LIMIT 1;
  SELECT id INTO uid_neha    FROM public.users WHERE email = 'neha.gupta@nitk.edu' LIMIT 1;
  SELECT id INTO uid_karthik FROM public.users WHERE email = 'karthik.reddy@nitk.edu' LIMIT 1;
  SELECT id INTO uid_aditi   FROM public.users WHERE email = 'aditi.mehta@nitk.edu' LIMIT 1;
  SELECT id INTO uid_rohan   FROM public.users WHERE email = 'rohan.verma@nitk.edu' LIMIT 1;
  SELECT id INTO uid_meera   FROM public.users WHERE email = 'meera.krishnan@nitk.edu' LIMIT 1;
  SELECT id INTO uid_rajesh  FROM public.users WHERE email = 'rajesh.kumar@nitk.edu' LIMIT 1;
  SELECT id INTO uid_shalini FROM public.users WHERE email = 'shalini.deshpande@nitk.edu' LIMIT 1;

  -- Verify all users exist
  IF uid_ananya IS NULL THEN
    RAISE EXCEPTION 'Dr. Ananya Rao was not found in public.users. Please run seed_users_api.js first.';
  END IF;

  -- 2. Create the 5 Research Labs
  -- Lab 1: AI Research Lab (PI: Dr. Ananya)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (lab_ai, 'Artificial Intelligence Research Lab', 'ai-lab', 'The Artificial Intelligence Research Lab focuses on advanced AI systems, long-term memory architectures, retrieval-augmented generation, knowledge graphs, and intelligent research assistants. The lab develops scalable AI solutions for academic and industrial research.', 'NITK', 'Computer Science & Engineering', ARRAY['large-language-models', 'knowledge-graphs', 'retrieval-augmented-generation', 'institutional-memory', 'multi-agent-systems', 'ai-assistants'], uid_ananya, '{"memory_health": 100, "ai_insights": []}');

  -- Lab 2: Computer Vision & Robotics Lab (PI: Dr. Vikram)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (lab_cvr, 'Computer Vision & Robotics Lab', 'cvr-lab', 'The lab conducts research in computer vision, robotic perception, autonomous navigation, image understanding, and intelligent robotic systems.', 'NITK', 'Computer Science & Engineering', ARRAY['computer-vision', 'image-processing', 'object-detection', 'autonomous-robotics', 'slam', 'edge-ai'], uid_vikram, '{"memory_health": 100, "ai_insights": []}');

  -- Lab 3: Cyber Security Research Lab (PI: Dr. Meera)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (lab_cyber, 'Cyber Security Research Lab', 'cyber-lab', 'The Cyber Security Research Lab investigates modern cyber threats, secure computing architectures, digital forensics, and privacy-preserving technologies.', 'NITK', 'Computer Science & Engineering', ARRAY['network-security', 'digital-forensics', 'malware-analysis', 'zero-trust-security', 'threat-intelligence'], uid_meera, '{"memory_health": 100, "ai_insights": []}');

  -- Lab 4: Data Science & Analytics Lab (PI: Dr. Rajesh)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (lab_dsa, 'Data Science & Analytics Lab', 'dsa-lab', 'The Data Science & Analytics Lab focuses on extracting insights from structured and unstructured data using advanced analytics and machine learning techniques.', 'NITK', 'Computer Science & Engineering', ARRAY['big-data', 'predictive-analytics', 'data-mining', 'machine-learning', 'data-visualization'], uid_rajesh, '{"memory_health": 100, "ai_insights": []}');

  -- Lab 5: Internet of Things Lab (PI: Dr. Shalini)
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by, settings)
  VALUES (lab_iot, 'Internet of Things & Embedded Systems Lab', 'iot-lab', 'The IoT Lab develops smart sensing systems, embedded platforms, and connected devices for industrial, healthcare, and environmental applications.', 'NITK', 'Electronics & Communication Engineering', ARRAY['iot', 'embedded-systems', 'wireless-sensor-networks', 'smart-agriculture', 'edge-computing'], uid_shalini, '{"memory_health": 100, "ai_insights": []}');

  -- 3. Add Memberships to the Primary Lab (AI Research Lab)
  -- Note: Lab creators are auto-added as Owner/PIs to their respective labs
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
