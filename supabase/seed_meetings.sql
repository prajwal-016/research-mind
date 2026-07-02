-- =============================================================================
-- ResearchMind — 8 Meetings Seeding Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script:
--   1. Locates the AI Research Lab, projects, and the organizer users.
--   2. Inserts the 8 meetings with duration, type, agenda, notes, and metadata.
-- =============================================================================

DO $$
DECLARE
  v_lab_id     UUID;
  
  -- Project IDs (fetched dynamically by code)
  proj_rm      UUID;
  proj_hybrid  UUID;
  proj_rag     UUID;
  proj_gemini  UUID;
  proj_viz     UUID;
  
  -- User IDs (fetched dynamically by email)
  uid_ananya   UUID;
  uid_vikram   UUID;
  uid_priya    UUID;
  uid_arjun    UUID;
  uid_sneha    UUID;
BEGIN

  -- 1. Fetch AI Lab ID
  SELECT id INTO v_lab_id FROM public.labs WHERE slug = 'ai-lab' LIMIT 1;
  
  IF v_lab_id IS NULL THEN
    RAISE EXCEPTION 'Artificial Intelligence Research Lab (ai-lab) not found. Please run seed_labs.sql first.';
  END IF;

  -- 2. Fetch Project IDs
  SELECT id INTO proj_rm      FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-001' LIMIT 1;
  SELECT id INTO proj_hybrid  FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-002' LIMIT 1;
  SELECT id INTO proj_rag     FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-003' LIMIT 1;
  SELECT id INTO proj_gemini  FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-004' LIMIT 1;
  SELECT id INTO proj_viz     FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-005' LIMIT 1;

  -- 3. Fetch User IDs
  SELECT id INTO uid_ananya  FROM public.users WHERE email = 'ananya.rao@nitk.edu' LIMIT 1;
  SELECT id INTO uid_vikram  FROM public.users WHERE email = 'vikram.iyer@nitk.edu' LIMIT 1;
  SELECT id INTO uid_priya   FROM public.users WHERE email = 'priya.nair@nitk.edu' LIMIT 1;
  SELECT id INTO uid_arjun   FROM public.users WHERE email = 'arjun.patel@nitk.edu' LIMIT 1;
  SELECT id INTO uid_sneha   FROM public.users WHERE email = 'sneha.kulkarni@nitk.edu' LIMIT 1;

  -- ---------------------------------------------------------------------------
  -- 4. Insert Meetings
  -- ---------------------------------------------------------------------------
  
  -- Meeting 1: Weekly AI Lab Research Review
  INSERT INTO public.meetings (lab_id, project_id, title, description, meeting_type, scheduled_at, duration_mins, location, agenda, notes, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Weekly AI Lab Research Review',
    'Review initial GraphRAG retrieval results.',
    'project_sync', '2026-01-15 10:00:00+00', 90,
    'AI Lab Conference Room',
    'Review initial GraphRAG retrieval results.',
    'The team reviewed the first implementation of GraphRAG. Retrieval quality was excellent, but latency increased significantly as the knowledge graph grew.',
    uid_ananya,
    '{"meeting_code": "MTG-AI-001", "status": "completed", "organizer": "Dr. Ananya Rao", "participants": ["Dr. Ananya Rao", "Rahul Sharma", "Priya Nair", "Arjun Patel"], "action_items": ["Rahul Sharma will benchmark Hybrid Retrieval.", "Priya Nair will analyze graph optimization techniques."]}'
  );

  -- Meeting 2: Hybrid Retrieval Evaluation
  INSERT INTO public.meetings (lab_id, project_id, title, description, meeting_type, scheduled_at, duration_mins, location, agenda, notes, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Hybrid Retrieval Evaluation',
    'Compare Hybrid Retrieval with GraphRAG.',
    'project_sync', '2026-01-28 14:00:00+00', 120,
    'AI Lab Conference Room',
    'Compare Hybrid Retrieval with GraphRAG.',
    'Hybrid Retrieval achieved similar retrieval quality while reducing response latency by approximately 18%.',
    uid_ananya,
    '{"meeting_code": "MTG-AI-002", "status": "completed", "organizer": "Dr. Ananya Rao", "participants": ["Dr. Ananya Rao", "Rahul Sharma", "Priya Nair"], "action_items": ["Prepare recommendation report.", "Update retrieval architecture."]}'
  );

  -- Meeting 3: Meeting Memory Extraction Review
  INSERT INTO public.meetings (lab_id, project_id, title, description, meeting_type, scheduled_at, duration_mins, location, agenda, notes, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Meeting Memory Extraction Review',
    'Evaluate meeting transcript summarization.',
    'project_sync', '2026-02-10 11:00:00+00', 60,
    'Online (Google Meet)',
    'Evaluate meeting transcript summarization.',
    'Gemini-generated summaries preserved most important research discussions and decisions.',
    uid_vikram,
    '{"meeting_code": "MTG-AI-003", "status": "completed", "organizer": "Dr. Vikram Iyer", "participants": ["Arjun Patel", "Sneha Kulkarni", "Dr. Vikram Iyer"], "action_items": ["Integrate summaries with Cognee remember()."]}'
  );

  -- Meeting 4: Embedding Benchmark Discussion
  INSERT INTO public.meetings (lab_id, project_id, title, description, meeting_type, scheduled_at, duration_mins, location, agenda, notes, created_by, metadata)
  VALUES (
    v_lab_id, proj_hybrid,
    'Embedding Benchmark Discussion',
    'Review embedding benchmark results.',
    'project_sync', '2026-02-20 15:00:00+00', 60,
    'AI Lab Conference Room',
    'Review embedding benchmark results.',
    'The bge-large embedding model consistently outperformed the evaluated alternatives.',
    uid_vikram,
    '{"meeting_code": "MTG-AI-004", "status": "completed", "organizer": "Dr. Vikram Iyer", "participants": ["Rahul Sharma", "Sneha Kulkarni"], "action_items": ["Adopt bge-large for semantic indexing."]}'
  );

  -- Meeting 5: Scientific Knowledge Graph Review
  INSERT INTO public.meetings (lab_id, project_id, title, description, meeting_type, scheduled_at, duration_mins, location, agenda, notes, created_by, metadata)
  VALUES (
    v_lab_id, proj_rag,
    'Scientific Knowledge Graph Review',
    'Evaluate knowledge graph quality.',
    'project_sync', '2026-03-05 10:00:00+00', 75,
    'AI Lab Office Room 2',
    'Evaluate knowledge graph quality.',
    'Relationship extraction achieved over 90% accuracy with only minor inconsistencies.',
    uid_priya,
    '{"meeting_code": "MTG-AI-005", "status": "completed", "organizer": "Priya Nair", "participants": ["Priya Nair", "Neha Gupta"], "action_items": ["Improve entity disambiguation."]}'
  );

  -- Meeting 6: Research Assistant Prototype Review
  INSERT INTO public.meetings (lab_id, project_id, title, description, meeting_type, scheduled_at, duration_mins, location, agenda, notes, created_by, metadata)
  VALUES (
    v_lab_id, proj_gemini,
    'Research Assistant Prototype Review',
    'Evaluate AI assistant prototype.',
    'project_sync', '2026-03-18 14:00:00+00', 60,
    'AI Lab Conference Room',
    'Evaluate AI assistant prototype.',
    'Answer quality improved significantly when Gemini received context retrieved from Cognee.',
    uid_arjun,
    '{"meeting_code": "MTG-AI-006", "status": "completed", "organizer": "Arjun Patel", "participants": ["Arjun Patel", "Karthik Reddy", "Dr. Vikram Iyer"], "action_items": ["Improve prompt engineering."]}'
  );

  -- Meeting 7: Memory Graph UI Review
  INSERT INTO public.meetings (lab_id, project_id, title, description, meeting_type, scheduled_at, duration_mins, location, agenda, notes, created_by, metadata)
  VALUES (
    v_lab_id, proj_viz,
    'Memory Graph UI Review',
    'Review interactive graph visualization.',
    'project_sync', '2026-03-30 16:00:00+00', 45,
    'Online (Google Meet)',
    'Review interactive graph visualization.',
    'React Flow successfully displayed relationships between researchers, experiments, meetings, datasets, and publications.',
    uid_sneha,
    '{"meeting_code": "MTG-AI-007", "status": "completed", "organizer": "Sneha Kulkarni", "participants": ["Sneha Kulkarni", "Neha Gupta"], "action_items": ["Improve graph filtering."]}'
  );

  -- Meeting 8: Quarterly Research Progress Meeting
  INSERT INTO public.meetings (lab_id, project_id, title, description, meeting_type, scheduled_at, duration_mins, location, agenda, notes, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Quarterly Research Progress Meeting',
    'Review quarterly research progress.',
    'lab_meeting', '2026-04-15 09:30:00+00', 120,
    'CSE Seminar Hall',
    'Review quarterly research progress.',
    'The lab successfully completed multiple experiments and publications. Hybrid Retrieval was selected as the preferred architecture for future work.',
    uid_ananya,
    '{"meeting_code": "MTG-AI-008", "status": "completed", "organizer": "Dr. Ananya Rao", "participants": ["Entire AI Research Lab"], "action_items": ["Prepare conference submissions.", "Finalize ResearchMind MVP."]}'
  );

END;
$$;
