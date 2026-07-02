-- =============================================================================
-- ResearchMind — 6 Publications Seeding Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script:
--   1. Locates the AI Research Lab, projects, research papers, and authors.
--   2. Inserts the 6 publications mapped to the publication pipeline with correct status, venue, and DOI.
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

  -- Research Paper IDs (fetched dynamically by code)
  paper_rm     UUID;
  paper_hybrid UUID;
  paper_rag    UUID;
  paper_gemini UUID;
  paper_viz    UUID;
  paper_meet   UUID;
  
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

  -- 3. Fetch Research Paper IDs
  SELECT id INTO paper_rm     FROM public.research_papers WHERE metadata->>'paper_code' = 'RP-AI-001' LIMIT 1;
  SELECT id INTO paper_hybrid FROM public.research_papers WHERE metadata->>'paper_code' = 'RP-AI-002' LIMIT 1;
  SELECT id INTO paper_rag    FROM public.research_papers WHERE metadata->>'paper_code' = 'RP-AI-003' LIMIT 1;
  SELECT id INTO paper_gemini FROM public.research_papers WHERE metadata->>'paper_code' = 'RP-AI-004' LIMIT 1;
  SELECT id INTO paper_viz    FROM public.research_papers WHERE metadata->>'paper_code' = 'RP-AI-005' LIMIT 1;
  SELECT id INTO paper_meet   FROM public.research_papers WHERE metadata->>'paper_code' = 'RP-AI-006' LIMIT 1;

  -- 4. Fetch User IDs
  SELECT id INTO uid_ananya  FROM public.users WHERE email = 'ananya.rao@nitk.edu' LIMIT 1;
  SELECT id INTO uid_vikram  FROM public.users WHERE email = 'vikram.iyer@nitk.edu' LIMIT 1;
  SELECT id INTO uid_priya   FROM public.users WHERE email = 'priya.nair@nitk.edu' LIMIT 1;
  SELECT id INTO uid_arjun   FROM public.users WHERE email = 'arjun.patel@nitk.edu' LIMIT 1;
  SELECT id INTO uid_sneha   FROM public.users WHERE email = 'sneha.kulkarni@nitk.edu' LIMIT 1;

  -- ---------------------------------------------------------------------------
  -- 5. Insert Publications
  -- ---------------------------------------------------------------------------
  
  -- Publication 1: ResearchMind
  INSERT INTO public.publications (lab_id, project_id, research_paper_id, title, authors, abstract, status, paper_type, target_venue, published_at, doi, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm, paper_rm,
    'ResearchMind: An Institutional Memory Platform for University Research Labs',
    ARRAY['Dr. Ananya Rao', 'Rahul Sharma', 'Priya Nair', 'Arjun Patel'],
    'ResearchMind introduces an institutional memory platform that combines relational databases, semantic memory, and AI reasoning to preserve and retrieve university research knowledge.',
    'published', 'conference_paper', 'IEEE International Conference on Artificial Intelligence',
    '2026-06-20 00:00:00+00', '10.1109/ICAI.2026.100001', uid_ananya,
    '{"publication_code": "PUB-AI-001", "related_experiments": ["EXP-AI-001", "EXP-AI-002", "EXP-AI-003"], "related_decisions": ["DEC-AI-001", "DEC-AI-003", "DEC-AI-006"], "related_meetings": ["MTG-AI-001", "MTG-AI-002", "MTG-AI-003"]}'
  );

  -- Publication 2: Hybrid Memory Systems
  INSERT INTO public.publications (lab_id, project_id, research_paper_id, title, authors, abstract, status, paper_type, target_venue, published_at, doi, created_by, metadata)
  VALUES (
    v_lab_id, proj_hybrid, paper_hybrid,
    'Hybrid Memory Systems for Large Language Models',
    ARRAY['Dr. Vikram Iyer', 'Rahul Sharma', 'Sneha Kulkarni'],
    'A comparative study of graph-based and vector-based long-term memory architectures for AI assistants.',
    'published', 'journal_article', 'Springer AI Journal',
    '2026-07-05 00:00:00+00', '10.1007/s00521-026-20002', uid_vikram,
    '{"publication_code": "PUB-AI-002", "related_experiments": ["EXP-AI-004", "EXP-AI-005"], "related_decisions": ["DEC-AI-002"], "related_meetings": ["MTG-AI-004"]}'
  );

  -- Publication 3: GraphRAG Optimization
  INSERT INTO public.publications (lab_id, project_id, research_paper_id, title, authors, abstract, status, paper_type, target_venue, published_at, doi, created_by, metadata)
  VALUES (
    v_lab_id, proj_rag, paper_rag,
    'GraphRAG Optimization for Scientific Knowledge Retrieval',
    ARRAY['Priya Nair', 'Neha Gupta'],
    'Performance optimization techniques for GraphRAG in scientific document retrieval systems.',
    'published', 'conference_paper', 'ACM Digital Library',
    '2026-08-18 00:00:00+00', '10.1145/3900001', uid_priya,
    '{"publication_code": "PUB-AI-003", "related_experiments": ["EXP-AI-006", "EXP-AI-007"], "related_decisions": ["DEC-AI-007"], "related_meetings": ["MTG-AI-005"]}'
  );

  -- Publication 4: Semantic Research Assistant
  INSERT INTO public.publications (lab_id, project_id, research_paper_id, title, authors, abstract, status, paper_type, target_venue, published_at, doi, created_by, metadata)
  VALUES (
    v_lab_id, proj_gemini, paper_gemini,
    'Semantic Research Assistant using Google Gemini',
    ARRAY['Arjun Patel', 'Karthik Reddy'],
    'An AI-powered semantic research assistant that combines Cognee and Gemini to answer laboratory research questions.',
    'under_review', 'journal_article', 'International Journal of AI Applications',
    '2026-12-01 00:00:00+00', 'Pending', uid_arjun,
    '{"publication_code": "PUB-AI-004", "related_experiments": ["EXP-AI-008", "EXP-AI-009"], "related_decisions": ["DEC-AI-005"], "related_meetings": ["MTG-AI-006"]}'
  );

  -- Publication 5: Interactive Knowledge Graph Visualization
  INSERT INTO public.publications (lab_id, project_id, research_paper_id, title, authors, abstract, status, paper_type, target_venue, published_at, doi, created_by, metadata)
  VALUES (
    v_lab_id, proj_viz, paper_viz,
    'Interactive Knowledge Graph Visualization for Institutional Memory',
    ARRAY['Sneha Kulkarni', 'Neha Gupta'],
    'Interactive visualization techniques for exploring institutional memory using knowledge graphs.',
    'accepted', 'conference_paper', 'IEEE VIS Conference',
    '2026-10-01 00:00:00+00', 'Pending', uid_sneha,
    '{"publication_code": "PUB-AI-005", "related_experiments": ["EXP-AI-010"], "related_decisions": ["DEC-AI-004"], "related_meetings": ["MTG-AI-007"]}'
  );

  -- Publication 6: Meeting Memory Extraction
  INSERT INTO public.publications (lab_id, project_id, research_paper_id, title, authors, abstract, status, paper_type, target_venue, published_at, doi, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm, paper_meet,
    'Meeting Memory Extraction using Large Language Models',
    ARRAY['Arjun Patel', 'Dr. Ananya Rao'],
    'Automatic extraction and preservation of institutional memory from research meetings using AI.',
    'published', 'journal_article', 'Elsevier Expert Systems with Applications',
    '2026-09-12 00:00:00+00', '10.1016/j.eswa.2026.130001', uid_arjun,
    '{"publication_code": "PUB-AI-006", "related_experiments": ["EXP-AI-003"], "related_decisions": ["DEC-AI-003"], "related_meetings": ["MTG-AI-003"]}'
  );

END;
$$;
