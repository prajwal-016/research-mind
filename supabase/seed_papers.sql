-- =============================================================================
-- ResearchMind — 8 Research Papers Seeding Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script:
--   1. Locates the AI Research Lab, projects, and the research team.
--   2. Inserts the 8 research papers mapped to their projects, authors, abstracts, and metadata.
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

  -- 2. Fetch Project IDs
  SELECT id INTO proj_rm      FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-001' LIMIT 1;
  SELECT id INTO proj_hybrid  FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-002' LIMIT 1;
  SELECT id INTO proj_rag     FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-003' LIMIT 1;
  SELECT id INTO proj_gemini  FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-004' LIMIT 1;
  SELECT id INTO proj_viz     FROM public.projects WHERE metadata->>'project_code' = 'AI-2026-005' LIMIT 1;

  -- 3. Fetch User IDs
  SELECT id INTO uid_ananya  FROM public.users WHERE email = 'ananya.rao@nitk.edu' LIMIT 1;
  SELECT id INTO uid_vikram  FROM public.users WHERE email = 'vikram.iyer@nitk.edu' LIMIT 1;
  SELECT id INTO uid_rahul   FROM public.users WHERE email = 'rahul.sharma@nitk.edu' LIMIT 1;
  SELECT id INTO uid_priya   FROM public.users WHERE email = 'priya.nair@nitk.edu' LIMIT 1;
  SELECT id INTO uid_arjun   FROM public.users WHERE email = 'arjun.patel@nitk.edu' LIMIT 1;
  SELECT id INTO uid_sneha   FROM public.users WHERE email = 'sneha.kulkarni@nitk.edu' LIMIT 1;
  SELECT id INTO uid_neha    FROM public.users WHERE email = 'neha.gupta@nitk.edu' LIMIT 1;
  SELECT id INTO uid_karthik FROM public.users WHERE email = 'karthik.reddy@nitk.edu' LIMIT 1;

  -- ---------------------------------------------------------------------------
  -- 4. Insert Research Papers
  -- ---------------------------------------------------------------------------
  
  -- Paper 1: ResearchMind
  INSERT INTO public.research_papers (lab_id, project_id, title, abstract, authors, paper_type, published_date, keywords, added_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'ResearchMind: An Institutional Memory Platform for University Research Labs',
    'This paper presents ResearchMind, an institutional memory platform that combines relational databases, semantic memory, and large language models to preserve research knowledge for university laboratories.',
    ARRAY['Dr. Ananya Rao', 'Rahul Sharma', 'Priya Nair'],
    'technical_report', '2026-01-01',
    ARRAY['Institutional Memory', 'Cognee', 'Knowledge Graph', 'Research Management', 'LLM'],
    uid_ananya,
    '{"paper_code": "RP-AI-001", "status": "published", "publication_year": 2026, "related_experiments": ["EXP-AI-001", "EXP-AI-002", "EXP-AI-003"], "related_datasets": ["DS-AI-001", "DS-AI-002"], "research_area": ["Institutional Memory", "Knowledge Graphs", "Artificial Intelligence"]}'
  );

  -- Paper 2: Hybrid Memory Systems
  INSERT INTO public.research_papers (lab_id, project_id, title, abstract, authors, paper_type, published_date, keywords, added_by, metadata)
  VALUES (
    v_lab_id, proj_hybrid,
    'Hybrid Memory Systems for Large Language Models',
    'A comparative study of vector databases and graph-based memory systems for scalable long-term memory in AI assistants.',
    ARRAY['Dr. Vikram Iyer', 'Rahul Sharma'],
    'journal_article', '2026-01-01',
    ARRAY['Hybrid Memory', 'Vector Search', 'Knowledge Graph', 'FAISS'],
    uid_vikram,
    '{"paper_code": "RP-AI-002", "status": "published", "publication_year": 2026, "related_experiments": ["EXP-AI-004", "EXP-AI-005"], "related_datasets": ["DS-AI-004", "DS-AI-007"]}'
  );

  -- Paper 3: GraphRAG Optimization
  INSERT INTO public.research_papers (lab_id, project_id, title, abstract, authors, paper_type, published_date, keywords, added_by, metadata)
  VALUES (
    v_lab_id, proj_rag,
    'GraphRAG Optimization for Scientific Knowledge Retrieval',
    'Performance analysis and optimization of GraphRAG for retrieving scientific knowledge from institutional repositories.',
    ARRAY['Priya Nair', 'Neha Gupta'],
    'conference_paper', '2026-01-01',
    ARRAY['GraphRAG', 'Knowledge Retrieval', 'Scientific Search'],
    uid_priya,
    '{"paper_code": "RP-AI-003", "status": "published", "publication_year": 2026, "related_experiments": ["EXP-AI-006", "EXP-AI-007"], "related_datasets": ["DS-AI-003", "DS-AI-007"]}'
  );

  -- Paper 4: Semantic Research Assistant
  INSERT INTO public.research_papers (lab_id, project_id, title, abstract, authors, paper_type, published_date, keywords, added_by, metadata)
  VALUES (
    v_lab_id, proj_gemini,
    'Semantic Research Assistant using Google Gemini',
    'Development of an AI-powered research assistant that combines semantic memory with Gemini to answer laboratory questions.',
    ARRAY['Arjun Patel', 'Karthik Reddy'],
    'preprint', '2026-01-01',
    ARRAY['Gemini', 'Semantic Search', 'AI Assistant'],
    uid_arjun,
    '{"paper_code": "RP-AI-004", "status": "under_review", "publication_year": 2026, "related_experiments": ["EXP-AI-008", "EXP-AI-009"], "related_datasets": ["DS-AI-006"]}'
  );

  -- Paper 5: Visualizing Institutional Knowledge
  INSERT INTO public.research_papers (lab_id, project_id, title, abstract, authors, paper_type, published_date, keywords, added_by, metadata)
  VALUES (
    v_lab_id, proj_viz,
    'Visualizing Institutional Knowledge using Interactive Memory Graphs',
    'Interactive visualization of institutional knowledge using graph-based interfaces built with React Flow.',
    ARRAY['Sneha Kulkarni', 'Neha Gupta'],
    'preprint', '2026-01-01',
    ARRAY['Knowledge Graph', 'Visualization', 'React Flow'],
    uid_sneha,
    '{"paper_code": "RP-AI-005", "status": "draft", "publication_year": 2026, "related_experiments": ["EXP-AI-010"], "related_datasets": ["DS-AI-005"]}'
  );

  -- Paper 6: Meeting Memory Extraction
  INSERT INTO public.research_papers (lab_id, project_id, title, abstract, authors, paper_type, published_date, keywords, added_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Meeting Memory Extraction using Large Language Models',
    'Automatic extraction of institutional memory from laboratory meeting transcripts using Gemini and Cognee.',
    ARRAY['Arjun Patel', 'Dr. Ananya Rao'],
    'journal_article', '2026-01-01',
    ARRAY['Meeting Intelligence', 'LLM', 'Institutional Memory'],
    uid_arjun,
    '{"paper_code": "RP-AI-006", "status": "published", "publication_year": 2026, "related_experiments": ["EXP-AI-003"], "related_datasets": ["DS-AI-001"]}'
  );

  -- Paper 7: Embedding Model Benchmarking
  INSERT INTO public.research_papers (lab_id, project_id, title, abstract, authors, paper_type, published_date, keywords, added_by, metadata)
  VALUES (
    v_lab_id, proj_hybrid,
    'Embedding Model Benchmarking for Research Retrieval',
    'Evaluation of modern embedding models for semantic retrieval in academic research systems.',
    ARRAY['Sneha Kulkarni'],
    'journal_article', '2026-01-01',
    ARRAY['Embeddings', 'Vector Database', 'Retrieval'],
    uid_sneha,
    '{"paper_code": "RP-AI-007", "status": "published", "publication_year": 2026, "related_experiments": ["EXP-AI-005"], "related_datasets": ["DS-AI-004"]}'
  );

  -- Paper 8: Knowledge Graph Construction
  INSERT INTO public.research_papers (lab_id, project_id, title, abstract, authors, paper_type, published_date, keywords, added_by, metadata)
  VALUES (
    v_lab_id, proj_viz,
    'Knowledge Graph Construction for Research Laboratories',
    'A framework for automatically constructing institutional knowledge graphs from research artifacts and laboratory activities.',
    ARRAY['Neha Gupta'],
    'journal_article', '2026-01-01',
    ARRAY['Knowledge Graph', 'Research Data', 'Semantic Relationships'],
    uid_neha,
    '{"paper_code": "RP-AI-008", "status": "accepted", "publication_year": 2026, "related_experiments": ["EXP-AI-007", "EXP-AI-010"], "related_datasets": ["DS-AI-005"]}'
  );

END;
$$;
