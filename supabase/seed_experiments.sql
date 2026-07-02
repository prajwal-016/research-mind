-- =============================================================================
-- ResearchMind — 10 Experiments Seeding Script
-- =============================================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This script:
--   1. Locates the AI Research Lab, the 5 projects, and the research team.
--   2. Inserts the 10 experiments mapped to their respective projects with objectives, methodology, and results.
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
  SELECT id INTO uid_rahul   FROM public.users WHERE email = 'rahul.sharma@nitk.edu' LIMIT 1;
  SELECT id INTO uid_priya   FROM public.users WHERE email = 'priya.nair@nitk.edu' LIMIT 1;
  SELECT id INTO uid_arjun   FROM public.users WHERE email = 'arjun.patel@nitk.edu' LIMIT 1;
  SELECT id INTO uid_sneha   FROM public.users WHERE email = 'sneha.kulkarni@nitk.edu' LIMIT 1;
  SELECT id INTO uid_neha    FROM public.users WHERE email = 'neha.gupta@nitk.edu' LIMIT 1;
  SELECT id INTO uid_karthik FROM public.users WHERE email = 'karthik.reddy@nitk.edu' LIMIT 1;

  -- ---------------------------------------------------------------------------
  -- 4. Insert Experiments
  -- ---------------------------------------------------------------------------
  
  -- Experiment 1: Evaluating GraphRAG for Institutional Memory Retrieval
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, methodology, status, start_date, end_date, results, conclusions, notes, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Evaluating GraphRAG for Institutional Memory Retrieval',
    'Evaluate GraphRAG as a retrieval mechanism for institutional research knowledge.',
    'GraphRAG will improve the recall of complex multi-hop research queries over standard vector search.',
    'Implemented GraphRAG over a knowledge graph and measured retrieval relevance and latency.',
    'completed', '2026-01-10 09:00:00+00', '2026-01-25 18:00:00+00',
    'GraphRAG achieved high retrieval accuracy but failed scalability requirements.',
    'GraphRAG alone is unsuitable for large institutional memory systems.',
    'Excellent contextual retrieval but high latency on large knowledge graphs.',
    uid_rahul, uid_rahul,
    '{"experiment_code": "EXP-AI-001", "priority": "high", "supervisor": "Dr. Ananya Rao"}'
  );

  -- Experiment 2: Hybrid Retrieval using Vector Search and Knowledge Graphs
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, methodology, status, results, conclusions, notes, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Hybrid Retrieval using Vector Search and Knowledge Graphs',
    'Compare Hybrid Retrieval against GraphRAG.',
    'A hybrid architecture combining vector lookup with small graph traversals will balance speed and accuracy.',
    'Combined vector similarity search with graph traversal.',
    'completed',
    '18% faster retrieval while maintaining semantic accuracy.',
    'Hybrid Retrieval recommended for production deployment.',
    'Lower latency with comparable retrieval quality.',
    uid_priya, uid_priya,
    '{"experiment_code": "EXP-AI-002", "priority": "high", "supervisor": "Dr. Ananya Rao"}'
  );

  -- Experiment 3: Meeting Memory Extraction
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, methodology, status, results, conclusions, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_rm,
    'Meeting Memory Extraction',
    'Automatically convert meeting discussions into institutional memory.',
    'LLM-based summaries of transcripts can extract actionable decisions and log them into the knowledge graph.',
    'Meeting transcripts summarized using Gemini before indexing into Cognee.',
    'completed',
    'Meeting knowledge successfully linked to experiments and research decisions.',
    'Meeting-based institutional memory significantly improves knowledge preservation.',
    uid_arjun, uid_arjun,
    '{"experiment_code": "EXP-AI-003", "priority": "medium", "supervisor": "Dr. Ananya Rao"}'
  );

  -- Experiment 4: Vector Database Benchmarking
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, status, results, conclusions, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_hybrid,
    'Vector Database Benchmarking',
    'Compare FAISS, ChromaDB, and pgvector.',
    'Find the vector database that performs best on indexing and matching speed.',
    'completed',
    'FAISS provided the fastest similarity search.',
    'FAISS selected for prototype evaluation.',
    uid_rahul, uid_rahul,
    '{"experiment_code": "EXP-AI-004", "priority": "high"}'
  );

  -- Experiment 5: Embedding Model Comparison
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, status, results, conclusions, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_hybrid,
    'Embedding Model Comparison',
    'Evaluate different embedding models.',
    'Identify which embeddings are best for encoding scientific and academic research domains.',
    'completed',
    'bge-large produced the highest retrieval quality.',
    'Selected for semantic indexing.',
    uid_sneha, uid_sneha,
    '{"experiment_code": "EXP-AI-005", "priority": "high"}'
  );

  -- Experiment 6: Graph Traversal Optimization
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, status, results, conclusions, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_rag,
    'Graph Traversal Optimization',
    'Reduce traversal latency in GraphRAG.',
    'Optimizing relational indexing on the knowledge graph will minimize search latency.',
    'completed',
    'Latency reduced by 15%.',
    'Still slower than Hybrid Retrieval.',
    uid_priya, uid_priya,
    '{"experiment_code": "EXP-AI-006", "priority": "medium"}'
  );

  -- Experiment 7: Scientific Paper Relationship Extraction
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, status, results, conclusions, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_rag,
    'Scientific Paper Relationship Extraction',
    'Automatically detect relationships among research papers.',
    'Entity-relationship models can accurately extract citations and dependencies between scientific texts.',
    'completed',
    'Knowledge graph generated with 91% relationship accuracy.',
    'Suitable for institutional memory.',
    uid_neha, uid_neha,
    '{"experiment_code": "EXP-AI-007", "priority": "medium"}'
  );

  -- Experiment 8: Gemini-based Research Question Answering
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, status, notes, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_gemini,
    'Gemini-based Research Question Answering',
    'Generate context-aware answers using Cognee memories and Gemini.',
    'Supplying GraphRAG contexts to Gemini will reduce hallucinations in laboratory question answering.',
    'running',
    'Answer quality significantly improved when semantic memory was provided.',
    uid_arjun, uid_arjun,
    '{"experiment_code": "EXP-AI-008", "priority": "medium"}'
  );

  -- Experiment 9: Research Paper Summarization
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, status, results, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_gemini,
    'Research Paper Summarization',
    'Generate concise summaries for uploaded research papers.',
    'Using custom prompting on Gemini will extract key highlights from PDFs reliably.',
    'completed',
    'Average summary accuracy 94%.',
    uid_karthik, uid_karthik,
    '{"experiment_code": "EXP-AI-009", "priority": "medium"}'
  );

  -- Experiment 10: Interactive Memory Graph Rendering
  INSERT INTO public.experiments (lab_id, project_id, title, description, hypothesis, status, notes, created_by, assigned_to, metadata)
  VALUES (
    v_lab_id, proj_viz,
    'Interactive Memory Graph Rendering',
    'Visualize institutional memory using React Flow.',
    'Interactive graph nodes representing research components will allow natural exploration of memory.',
    'running',
    'Interactive graph successfully displays relationships among projects, experiments, papers, and researchers.',
    uid_sneha, uid_sneha,
    '{"experiment_code": "EXP-AI-010", "priority": "low"}'
  );

END;
$$;
