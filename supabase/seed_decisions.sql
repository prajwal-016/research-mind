-- =============================================================================
-- ResearchMind — 7 Research Decisions Seeding Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script:
--   1. Locates the AI Research Lab, projects, meetings, and organizer users.
--   2. Inserts the 7 decisions with rationale, alternatives, impact, and metadata.
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

  -- Meeting IDs (fetched dynamically by code)
  meet_002     UUID;
  meet_003     UUID;
  meet_004     UUID;
  meet_006     UUID;
  meet_007     UUID;
  
  -- User IDs (fetched dynamically by email)
  uid_ananya   UUID;
  uid_vikram   UUID;
  uid_rahul    UUID;
  uid_priya    UUID;
  uid_arjun    UUID;
  uid_sneha    UUID;
  uid_neha     UUID;
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

  -- 3. Fetch Meeting IDs
  SELECT id INTO meet_002 FROM public.meetings WHERE metadata->>'meeting_code' = 'MTG-AI-002' LIMIT 1;
  SELECT id INTO meet_003 FROM public.meetings WHERE metadata->>'meeting_code' = 'MTG-AI-003' LIMIT 1;
  SELECT id INTO meet_004 FROM public.meetings WHERE metadata->>'meeting_code' = 'MTG-AI-004' LIMIT 1;
  SELECT id INTO meet_006 FROM public.meetings WHERE metadata->>'meeting_code' = 'MTG-AI-006' LIMIT 1;
  SELECT id INTO meet_007 FROM public.meetings WHERE metadata->>'meeting_code' = 'MTG-AI-007' LIMIT 1;

  -- 4. Fetch User IDs
  SELECT id INTO uid_ananya  FROM public.users WHERE email = 'ananya.rao@nitk.edu' LIMIT 1;
  SELECT id INTO uid_vikram  FROM public.users WHERE email = 'vikram.iyer@nitk.edu' LIMIT 1;
  SELECT id INTO uid_rahul   FROM public.users WHERE email = 'rahul.sharma@nitk.edu' LIMIT 1;
  SELECT id INTO uid_priya   FROM public.users WHERE email = 'priya.nair@nitk.edu' LIMIT 1;
  SELECT id INTO uid_arjun   FROM public.users WHERE email = 'arjun.patel@nitk.edu' LIMIT 1;
  SELECT id INTO uid_sneha   FROM public.users WHERE email = 'sneha.kulkarni@nitk.edu' LIMIT 1;
  SELECT id INTO uid_neha    FROM public.users WHERE email = 'neha.gupta@nitk.edu' LIMIT 1;

  -- ---------------------------------------------------------------------------
  -- 5. Insert Research Decisions
  -- ---------------------------------------------------------------------------
  
  -- Decision 1: Replace GraphRAG with Hybrid Retrieval
  INSERT INTO public.research_decisions (lab_id, project_id, meeting_id, title, context, decision, rationale, impact, priority, made_by, status, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm, meet_002,
    'Replace GraphRAG with Hybrid Retrieval',
    'GraphRAG produced excellent retrieval quality but unacceptable latency on large institutional knowledge graphs.',
    'Replace GraphRAG with Hybrid Retrieval as the default retrieval system.',
    'Hybrid Retrieval achieved similar semantic accuracy while reducing response time by approximately 18%.',
    'Hybrid Retrieval became the default retrieval architecture for ResearchMind.',
    'high', uid_rahul, 'approved', uid_rahul,
    '{"decision_code": "DEC-AI-001", "reviewed_by": "Dr. Vikram Iyer", "approved_by": "Dr. Ananya Rao", "related_experiments": ["EXP-AI-001", "EXP-AI-002"], "decision_date": "2026-01-30"}'
  );

  -- Decision 2: Adopt bge-large as Default Embedding Model
  INSERT INTO public.research_decisions (lab_id, project_id, meeting_id, title, context, decision, rationale, impact, priority, made_by, status, created_by, metadata)
  VALUES (
    v_lab_id, proj_hybrid, meet_004,
    'Adopt bge-large as Default Embedding Model',
    'Evaluate different embedding models to find the most accurate choice for semantic indexing.',
    'Adopt bge-large as the default embedding model for all future project retrieval.',
    'Benchmarking demonstrated superior semantic retrieval accuracy compared with the evaluated alternatives.',
    'All future experiments will use bge-large embeddings.',
    'medium', uid_sneha, 'approved', uid_sneha,
    '{"decision_code": "DEC-AI-002", "reviewed_by": "Dr. Vikram Iyer", "approved_by": "Dr. Vikram Iyer", "related_experiments": ["EXP-AI-005"], "decision_date": "2026-02-22"}'
  );

  -- Decision 3: Automatically Index Meeting Summaries
  INSERT INTO public.research_decisions (lab_id, project_id, meeting_id, title, context, decision, rationale, impact, priority, made_by, status, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm, meet_003,
    'Automatically Index Meeting Summaries',
    'Meeting discussions often contain valuable reasoning that is never documented elsewhere.',
    'Create an automated sync process that converts meeting summaries into graph memories.',
    'Summarizing transcript files before Cognee ingestion preserves critical meeting intelligence.',
    'Every meeting summary will automatically be indexed into Cognee.',
    'high', uid_arjun, 'approved', uid_arjun,
    '{"decision_code": "DEC-AI-003", "reviewed_by": "Dr. Vikram Iyer", "approved_by": "Dr. Ananya Rao", "related_experiments": ["EXP-AI-003"], "decision_date": "2026-02-12"}'
  );

  -- Decision 4: Use React Flow for Memory Graph Visualization
  INSERT INTO public.research_decisions (lab_id, project_id, meeting_id, title, context, decision, rationale, impact, priority, made_by, status, created_by, metadata)
  VALUES (
    v_lab_id, proj_viz, meet_007,
    'Use React Flow for Memory Graph Visualization',
    'Determine the best UI library for rendering interactive graph networks representing institutional memory.',
    'Use React Flow as the default visualization library for network components.',
    'React Flow provides interactive graph exploration with excellent customization and performance.',
    'React Flow adopted as the visualization framework.',
    'medium', uid_sneha, 'approved', uid_sneha,
    '{"decision_code": "DEC-AI-004", "reviewed_by": "Neha Gupta", "approved_by": "Dr. Vikram Iyer", "related_experiments": ["EXP-AI-010"], "decision_date": "2026-04-02"}'
  );

  -- Decision 5: Use Gemini for Answer Generation
  INSERT INTO public.research_decisions (lab_id, project_id, meeting_id, title, context, decision, rationale, impact, priority, made_by, status, created_by, metadata)
  VALUES (
    v_lab_id, proj_gemini, meet_006,
    'Use Gemini for Answer Generation',
    'Selecting the correct LLM model for the conversational research assistant.',
    'Select Gemini as the reasoning engine for ResearchMind.',
    'Gemini generated accurate and context-aware responses when provided with institutional memory retrieved from Cognee.',
    'Gemini selected as the reasoning engine for ResearchMind.',
    'high', uid_arjun, 'approved', uid_arjun,
    '{"decision_code": "DEC-AI-005", "reviewed_by": "Dr. Vikram Iyer", "approved_by": "Dr. Ananya Rao", "related_experiments": ["EXP-AI-008"], "decision_date": "2026-03-20"}'
  );

  -- Decision 6: Standardize Experiment Metadata
  INSERT INTO public.research_decisions (lab_id, project_id, title, context, decision, rationale, impact, priority, made_by, status, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Standardize Experiment Metadata',
    'Establish common practices for structuring research logs and outputs.',
    'Mandate a common metadata template for logging laboratory experiments.',
    'Standardized metadata improves search, traceability, and semantic indexing.',
    'All future experiments will follow a common metadata template.',
    'medium', uid_priya, 'approved', uid_priya,
    '{"decision_code": "DEC-AI-006", "reviewed_by": "Dr. Vikram Iyer", "approved_by": "Dr. Ananya Rao", "related_experiments": ["EXP-AI-001", "EXP-AI-002", "EXP-AI-003"], "decision_date": "2026-03-10"}'
  );

  -- Decision 7: Archive Legacy Retrieval Prototype
  INSERT INTO public.research_decisions (lab_id, project_id, title, context, decision, rationale, impact, priority, made_by, status, created_by, metadata)
  VALUES (
    v_lab_id, proj_rag,
    'Archive Legacy Retrieval Prototype',
    'Managing legacy prototypes that are no longer scalable.',
    'Archive the legacy GraphRAG prototype.',
    'The original GraphRAG prototype no longer meets current scalability requirements.',
    'Prototype archived and removed from active institutional memory while preserving historical records in Supabase.',
    'low', uid_priya, 'archived', uid_priya,
    '{"decision_code": "DEC-AI-007", "reviewed_by": "Dr. Vikram Iyer", "approved_by": "Dr. Ananya Rao", "related_experiments": ["EXP-AI-001"], "decision_date": "2026-04-15"}'
  );

END;
$$;
