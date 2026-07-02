-- =============================================================================
-- ResearchMind — 7 Datasets Seeding Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script:
--   1. Locates the AI Research Lab, projects, and the research team.
--   2. Inserts the 7 datasets mapped to their respective projects, formats, sizes, and owners.
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
  uid_arjun    UUID;
  uid_rahul    UUID;
  uid_priya    UUID;
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
  SELECT id INTO uid_arjun   FROM public.users WHERE email = 'arjun.patel@nitk.edu' LIMIT 1;
  SELECT id INTO uid_rahul   FROM public.users WHERE email = 'rahul.sharma@nitk.edu' LIMIT 1;
  SELECT id INTO uid_priya   FROM public.users WHERE email = 'priya.nair@nitk.edu' LIMIT 1;
  SELECT id INTO uid_sneha   FROM public.users WHERE email = 'sneha.kulkarni@nitk.edu' LIMIT 1;
  SELECT id INTO uid_neha    FROM public.users WHERE email = 'neha.gupta@nitk.edu' LIMIT 1;
  SELECT id INTO uid_karthik FROM public.users WHERE email = 'karthik.reddy@nitk.edu' LIMIT 1;

  -- ---------------------------------------------------------------------------
  -- 4. Insert Datasets
  -- ---------------------------------------------------------------------------
  
  -- Dataset 1: AI Lab Meeting Transcripts
  INSERT INTO public.datasets (lab_id, project_id, name, description, dataset_type, version, size_bytes, tags, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'AI Lab Meeting Transcripts',
    'Collection of meeting transcripts from AI Lab research discussions used for institutional memory extraction and semantic indexing.',
    'text', '1.0', 1932735283,
    ARRAY['Meetings', 'Institutional Memory', 'NLP'],
    uid_arjun,
    '{"dataset_code": "DS-AI-001", "status": "active", "format": "TXT / PDF"}'
  );

  -- Dataset 2: Research Experiment Metadata
  INSERT INTO public.datasets (lab_id, project_id, name, description, dataset_type, version, size_bytes, tags, created_by, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Research Experiment Metadata',
    'Structured metadata of research experiments including objectives, methodology, observations, results, and researchers.',
    'csv', '2.1', 650117120,
    ARRAY['Experiments', 'Metadata', 'Knowledge Graph'],
    uid_rahul,
    '{"dataset_code": "DS-AI-002", "status": "recommended", "format": "CSV"}'
  );

  -- Dataset 3: Scientific Paper Repository
  INSERT INTO public.datasets (lab_id, project_id, name, description, dataset_type, version, size_bytes, tags, created_by, metadata)
  VALUES (
    v_lab_id, proj_rag,
    'Scientific Paper Repository',
    'Repository of AI, Machine Learning, Knowledge Graph, and Retrieval-Augmented Generation research papers.',
    'other', '3.0', 5583457484,
    ARRAY['Research Papers', 'LLMs', 'Knowledge Graph'],
    uid_priya,
    '{"dataset_code": "DS-AI-003", "status": "active", "format": "PDF"}'
  );

  -- Dataset 4: Embedding Benchmark Dataset
  INSERT INTO public.datasets (lab_id, project_id, name, description, dataset_type, version, size_bytes, tags, created_by, metadata)
  VALUES (
    v_lab_id, proj_hybrid,
    'Embedding Benchmark Dataset',
    'Benchmark dataset for evaluating embedding models and vector similarity performance.',
    'json', '1.4', 1027604480,
    ARRAY['Embeddings', 'Vector Search', 'FAISS'],
    uid_sneha,
    '{"dataset_code": "DS-AI-004", "status": "active", "format": "JSON"}'
  );

  -- Dataset 5: Knowledge Graph Nodes and Relationships
  INSERT INTO public.datasets (lab_id, project_id, name, description, dataset_type, version, size_bytes, tags, created_by, metadata)
  VALUES (
    v_lab_id, proj_viz,
    'Knowledge Graph Nodes and Relationships',
    'Node and edge information representing relationships among projects, experiments, meetings, researchers, papers, and publications.',
    'json', '1.0', 2791728742,
    ARRAY['Knowledge Graph', 'Visualization', 'React Flow'],
    uid_neha,
    '{"dataset_code": "DS-AI-005", "status": "in_review", "format": "JSON"}'
  );

  -- Dataset 6: Gemini Evaluation Dataset
  INSERT INTO public.datasets (lab_id, project_id, name, description, dataset_type, version, size_bytes, tags, created_by, metadata)
  VALUES (
    v_lab_id, proj_gemini,
    'Gemini Evaluation Dataset',
    'Question-answer benchmark dataset used to evaluate Gemini responses against institutional memory.',
    'json', '1.2', 471859200,
    ARRAY['Gemini', 'Evaluation', 'Question Answering'],
    uid_karthik,
    '{"dataset_code": "DS-AI-006", "status": "active", "format": "JSON"}'
  );

  -- Dataset 7: Hybrid Retrieval Evaluation Dataset
  INSERT INTO public.datasets (lab_id, project_id, name, description, dataset_type, version, size_bytes, tags, created_by, metadata)
  VALUES (
    v_lab_id, proj_hybrid,
    'Hybrid Retrieval Evaluation Dataset',
    'Evaluation dataset comparing GraphRAG, vector search, and hybrid retrieval strategies.',
    'csv', '2.0', 1288490188,
    ARRAY['Hybrid Retrieval', 'GraphRAG', 'Vector Search'],
    uid_rahul,
    '{"dataset_code": "DS-AI-007", "status": "recommended", "format": "CSV"}'
  );

END;
$$;
