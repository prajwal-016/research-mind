-- =============================================================================
-- ResearchMind — 5 Projects Seeding Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script:
--   1. Locates the Artificial Intelligence Research Lab and team members.
--   2. Inserts the 5 requested projects with correct statuses, lead, and code.
--   3. Maps researcher memberships to each project.
-- =============================================================================

DO $$
DECLARE
  v_lab_id     UUID;
  
  -- Project IDs
  proj_rm      UUID := uuid_generate_v4();
  proj_hybrid  UUID := uuid_generate_v4();
  proj_rag     UUID := uuid_generate_v4();
  proj_gemini  UUID := uuid_generate_v4();
  proj_viz     UUID := uuid_generate_v4();
  
  -- User IDs (fetched dynamically by email)
  uid_ananya   UUID;
  uid_vikram   UUID;
  uid_rahul    UUID;
  uid_priya    UUID;
  uid_arjun    UUID;
  uid_sneha    UUID;
  uid_neha     UUID;
  uid_karthik  UUID;
BEGIN

  -- 1. Fetch AI Lab ID
  SELECT id INTO v_lab_id FROM public.labs WHERE slug = 'ai-lab' LIMIT 1;
  
  IF v_lab_id IS NULL THEN
    RAISE EXCEPTION 'Artificial Intelligence Research Lab (ai-lab) not found. Please run seed_labs.sql first.';
  END IF;

  -- 2. Fetch User IDs by email
  SELECT id INTO uid_ananya  FROM public.users WHERE email = 'ananya.rao@nitk.edu' LIMIT 1;
  SELECT id INTO uid_vikram  FROM public.users WHERE email = 'vikram.iyer@nitk.edu' LIMIT 1;
  SELECT id INTO uid_rahul   FROM public.users WHERE email = 'rahul.sharma@nitk.edu' LIMIT 1;
  SELECT id INTO uid_priya   FROM public.users WHERE email = 'priya.nair@nitk.edu' LIMIT 1;
  SELECT id INTO uid_arjun   FROM public.users WHERE email = 'arjun.patel@nitk.edu' LIMIT 1;
  SELECT id INTO uid_sneha   FROM public.users WHERE email = 'sneha.kulkarni@nitk.edu' LIMIT 1;
  SELECT id INTO uid_neha    FROM public.users WHERE email = 'neha.gupta@nitk.edu' LIMIT 1;
  SELECT id INTO uid_karthik FROM public.users WHERE email = 'karthik.reddy@nitk.edu' LIMIT 1;

  -- ---------------------------------------------------------------------------
  -- 3. Insert Projects
  -- ---------------------------------------------------------------------------
  
  -- Project 1: ResearchMind
  INSERT INTO public.projects (id, lab_id, name, description, status, start_date, end_date, research_areas, created_by, metadata)
  VALUES (
    proj_rm, v_lab_id,
    'ResearchMind – Institutional Memory for University Research Labs',
    'ResearchMind is an AI-powered institutional memory platform that preserves research knowledge by connecting experiments, papers, meetings, datasets, and decisions into a searchable memory graph using Cognee.',
    'active', '2026-01-01', '2026-12-31',
    ARRAY['institutional-memory', 'knowledge-graphs', 'retrieval-augmented-generation'],
    uid_ananya,
    '{"project_code": "AI-2026-001", "priority": "high", "domain": "Artificial Intelligence"}'
  );

  -- Project 2: Hybrid Memory Systems
  INSERT INTO public.projects (id, lab_id, name, description, status, start_date, research_areas, created_by, metadata)
  VALUES (
    proj_hybrid, v_lab_id,
    'Hybrid Memory Systems for Large Language Models',
    'This project explores hybrid memory architectures combining vector search and knowledge graphs to improve long-term memory for AI assistants.',
    'active', '2026-01-01',
    ARRAY['large-language-models', 'long-term-memory', 'semantic-retrieval'],
    uid_vikram,
    '{"project_code": "AI-2026-002", "priority": "high", "domain": "Artificial Intelligence"}'
  );

  -- Project 3: GraphRAG Optimization
  INSERT INTO public.projects (id, lab_id, name, description, status, start_date, research_areas, created_by, metadata)
  VALUES (
    proj_rag, v_lab_id,
    'GraphRAG Optimization for Scientific Knowledge Retrieval',
    'This project evaluates GraphRAG for scientific document retrieval and compares it against hybrid retrieval systems.',
    'completed', '2026-01-01',
    ARRAY['graphrag', 'knowledge-retrieval', 'scientific-search'],
    uid_priya,
    '{"project_code": "AI-2026-003", "priority": "medium", "domain": "Knowledge Graphs"}'
  );

  -- Project 4: Semantic Research Assistant using Gemini
  INSERT INTO public.projects (id, lab_id, name, description, status, start_date, research_areas, created_by, metadata)
  VALUES (
    proj_gemini, v_lab_id,
    'Semantic Research Assistant using Gemini',
    'Development of an AI-powered research assistant capable of summarizing papers, answering laboratory questions, and generating research insights using Gemini.',
    'active', '2026-01-01',
    ARRAY['natural-language-processing', 'generative-ai', 'research-assistants'],
    uid_arjun,
    '{"project_code": "AI-2026-004", "priority": "medium", "domain": "Artificial Intelligence"}'
  );

  -- Project 5: Knowledge Graph Visualization Platform
  INSERT INTO public.projects (id, lab_id, name, description, status, start_date, research_areas, created_by, metadata)
  VALUES (
    proj_viz, v_lab_id,
    'Knowledge Graph Visualization Platform',
    'Design and implementation of an interactive visualization platform for exploring institutional memory using graph-based interfaces.',
    'planning', '2026-01-01',
    ARRAY['knowledge-graphs', 'graph-analytics', 'interactive-visualization'],
    uid_sneha,
    '{"project_code": "AI-2026-005", "priority": "low", "domain": "Visualization"}'
  );

  -- ---------------------------------------------------------------------------
  -- 4. Map Researchers (project_members)
  -- ---------------------------------------------------------------------------
  
  -- Project 1 Researchers
  INSERT INTO public.project_members (project_id, user_id, role) VALUES
    (proj_rm, uid_ananya, 'owner'),
    (proj_rm, uid_rahul, 'contributor'),
    (proj_rm, uid_priya, 'contributor'),
    (proj_rm, uid_arjun, 'contributor');

  -- Project 2 Researchers
  INSERT INTO public.project_members (project_id, user_id, role) VALUES
    (proj_hybrid, uid_vikram, 'owner'),
    (proj_hybrid, uid_rahul, 'contributor'),
    (proj_hybrid, uid_sneha, 'contributor');

  -- Project 3 Researchers
  INSERT INTO public.project_members (project_id, user_id, role) VALUES
    (proj_rag, uid_priya, 'owner'),
    (proj_rag, uid_neha, 'contributor');

  -- Project 4 Researchers
  INSERT INTO public.project_members (project_id, user_id, role) VALUES
    (proj_gemini, uid_arjun, 'owner'),
    (proj_gemini, uid_karthik, 'contributor');

  -- Project 5 Researchers
  INSERT INTO public.project_members (project_id, user_id, role) VALUES
    (proj_viz, uid_sneha, 'owner'),
    (proj_viz, uid_neha, 'contributor');

END;
$$;
