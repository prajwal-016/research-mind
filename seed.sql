-- 0. Fix the log_activity trigger bug (plural table name to singular enum)
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_action     activity_action;
  v_entity     entity_type;
  v_lab_id     UUID;
  v_title      TEXT;
  v_entity_id  UUID;
  v_changes    JSONB := NULL;
BEGIN
  v_action := CASE TG_OP
    WHEN 'INSERT' THEN 'created'
    WHEN 'UPDATE' THEN 'updated'
    WHEN 'DELETE' THEN 'deleted'
  END::activity_action;

  -- Resolve entity type from table name (strip trailing 's' since table names are plural but enum is singular)
  v_entity := CASE TG_TABLE_NAME
    WHEN 'labs' THEN 'lab'
    WHEN 'projects' THEN 'project'
    WHEN 'experiments' THEN 'experiment'
    WHEN 'research_papers' THEN 'research_paper'
    WHEN 'datasets' THEN 'dataset'
    WHEN 'meetings' THEN 'meeting'
    WHEN 'research_decisions' THEN 'research_decision'
    WHEN 'publications' THEN 'publication'
    WHEN 'users' THEN 'user'
    ELSE TG_TABLE_NAME
  END::entity_type;

  IF TG_OP = 'DELETE' THEN
    v_entity_id := OLD.id;
    v_lab_id    := CASE WHEN TG_TABLE_NAME = 'labs' THEN OLD.id ELSE OLD.lab_id END;
    v_title     := CASE
      WHEN TG_TABLE_NAME = 'users' THEN to_jsonb(OLD)->>'full_name'
      WHEN TG_TABLE_NAME IN ('labs', 'datasets', 'projects') THEN to_jsonb(OLD)->>'name'
      ELSE to_jsonb(OLD)->>'title'
    END;
  ELSE
    v_entity_id := NEW.id;
    v_lab_id    := CASE WHEN TG_TABLE_NAME = 'labs' THEN NEW.id ELSE NEW.lab_id END;
    v_title     := CASE
      WHEN TG_TABLE_NAME = 'users' THEN to_jsonb(NEW)->>'full_name'
      WHEN TG_TABLE_NAME IN ('labs', 'datasets', 'projects') THEN to_jsonb(NEW)->>'name'
      ELSE to_jsonb(NEW)->>'title'
    END;
  END IF;

  INSERT INTO public.activity_logs (
    lab_id, actor_id, action, entity_type, entity_id, entity_title, changes
  )
  VALUES (
    v_lab_id, auth.uid(), v_action, v_entity, v_entity_id, v_title, v_changes
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 1. Create Users directly in auth.users (Bypasses email rate limits)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated', 'ananya.rao@nitk.edu',
    crypt('Password123!', gen_salt('bf')), NOW(), NULL, NULL,
    '{"provider":"email","providers":["email"]}', '{"full_name": "Dr. Ananya Rao", "institution": "NITK", "role": "Professor"}', NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated', 'rahul.sharma@nitk.edu',
    crypt('Password123!', gen_salt('bf')), NOW(), NULL, NULL,
    '{"provider":"email","providers":["email"]}', '{"full_name": "Rahul Sharma", "institution": "NITK", "role": "PhD Research Scholar"}', NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated', 'priya.nair@nitk.edu',
    crypt('Password123!', gen_salt('bf')), NOW(), NULL, NULL,
    '{"provider":"email","providers":["email"]}', '{"full_name": "Priya Nair", "institution": "NITK", "role": "PhD Research Scholar"}', NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated', 'arjun.patel@nitk.edu',
    crypt('Password123!', gen_salt('bf')), NOW(), NULL, NULL,
    '{"provider":"email","providers":["email"]}', '{"full_name": "Arjun Patel", "institution": "NITK", "role": "Research Assistant"}', NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated', 'sneha.kulkarni@nitk.edu',
    crypt('Password123!', gen_salt('bf')), NOW(), NULL, NULL,
    '{"provider":"email","providers":["email"]}', '{"full_name": "Sneha Kulkarni", "institution": "NITK", "role": "Master''s Student"}', NOW(), NOW(), '', '', '', ''
  );

-- Wait for the trigger to propagate to public.users before proceeding
-- Usually immediate. We will fetch the UUIDs.

DO $$
DECLARE
  v_pi_id UUID;
  v_rahul_id UUID;
  v_priya_id UUID;
  v_arjun_id UUID;
  v_sneha_id UUID;
  v_lab_id UUID;
  v_project_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO v_pi_id FROM auth.users WHERE email = 'ananya.rao@nitk.edu';
  SELECT id INTO v_rahul_id FROM auth.users WHERE email = 'rahul.sharma@nitk.edu';
  SELECT id INTO v_priya_id FROM auth.users WHERE email = 'priya.nair@nitk.edu';
  SELECT id INTO v_arjun_id FROM auth.users WHERE email = 'arjun.patel@nitk.edu';
  SELECT id INTO v_sneha_id FROM auth.users WHERE email = 'sneha.kulkarni@nitk.edu';

  -- Create Lab
  INSERT INTO public.labs (name, slug, institution, department, settings, created_by)
  VALUES (
    'Artificial Intelligence Research Lab', 'ai-research-lab-nitk', 'National Institute of Technology Karnataka (NITK), Surathkal', 'Computer Science and Engineering',
    '{"ai_insights": [{"id": 1, "title": "Insight", "content": "GraphRAG experiment is related to Hybrid Retrieval.", "priority": "info"}, {"id": 2, "title": "Recommendation", "content": "Dataset V3 is recommended for future experiments.", "priority": "success"}, {"id": 3, "title": "Connection", "content": "Three experiments are connected through Knowledge Graph Retrieval.", "priority": "info"}, {"id": 4, "title": "Influence", "content": "Meeting #2 influenced Publication #1.", "priority": "info"}, {"id": 5, "title": "Similarity", "content": "Experiment #5 is similar to Experiment #2.", "priority": "warning"}], "memory_health": {"health_score": 96, "experiments": 146, "publications": 28, "knowledge_nodes": 2584, "active_researchers": 18, "research_projects": 6, "connected_relationships": 8962, "knowledge_growth_percent": 14}}'::jsonb,
    v_pi_id
  ) RETURNING id INTO v_lab_id;

  -- Add members (PI is added automatically by DB trigger)
  INSERT INTO public.lab_members (lab_id, user_id, role) VALUES 
  (v_lab_id, v_rahul_id, 'admin'),
  (v_lab_id, v_priya_id, 'member'),
  (v_lab_id, v_arjun_id, 'member'),
  (v_lab_id, v_sneha_id, 'member');

  -- Create Project
  INSERT INTO public.projects (lab_id, name, description, status, start_date, created_by)
  VALUES (
    v_lab_id, 'Institutional Memory for AI Research Laboratories',
    'A platform that preserves research knowledge using graph-based memory and semantic retrieval. The system helps future researchers understand previous experiments, decisions, and publications.',
    'active', '2026-01-01', v_pi_id
  ) RETURNING id INTO v_project_id;

  -- Create Experiments
  INSERT INTO public.experiments (lab_id, project_id, title, hypothesis, methodology, results, notes, status, created_by) VALUES
  (v_lab_id, v_project_id, 'GraphRAG Retrieval Evaluation', 'Evaluate GraphRAG for long-term institutional memory retrieval.', 'Implemented GraphRAG using Neo4j and vector embeddings.', 'Accuracy improved by 18%.', 'Excellent contextual retrieval but high query latency.', 'completed', v_pi_id),
  (v_lab_id, v_project_id, 'Hybrid Vector Retrieval', 'Compare vector search with graph retrieval.', 'FAISS combined with graph traversal.', 'Recommended for production.', 'Lower latency than GraphRAG.', 'completed', v_pi_id),
  (v_lab_id, v_project_id, 'Meeting Memory Extraction', 'Automatically convert meeting notes into institutional memory.', 'Gemini summarization plus Cognee remember().', 'Meeting summaries successfully linked to experiments.', '', 'completed', v_pi_id),
  (v_lab_id, v_project_id, 'Dataset Version Comparison', 'Evaluate different dataset versions.', '', 'Dataset V3 improved model accuracy by 7%.', '', 'completed', v_pi_id),
  (v_lab_id, v_project_id, 'Knowledge Graph Visualization', 'Visualize relationships between papers and experiments.', '', 'React Flow produced interactive research graph.', '', 'running', v_pi_id);

  -- Create Research Papers
  INSERT INTO public.research_papers (lab_id, title, authors, abstract, published_date, tags, added_by) VALUES
  (v_lab_id, 'GraphRAG for Institutional Knowledge Retrieval', ARRAY['Rahul Sharma', 'Dr. Ananya Rao']::text[], 'This paper evaluates graph-based retrieval techniques for preserving long-term institutional knowledge.', '2026-01-01', ARRAY['GraphRAG', 'Knowledge Graph', 'LLM', 'Institutional Memory']::text[], v_pi_id),
  (v_lab_id, 'Hybrid Memory Systems for Research Laboratories', ARRAY['Priya Nair']::text[], '', '2026-01-01', ARRAY['Hybrid Retrieval', 'Vector Database', 'Knowledge Management']::text[], v_pi_id),
  (v_lab_id, 'Semantic Retrieval using FAISS', ARRAY['Arjun Patel']::text[], '', '2025-01-01', ARRAY['FAISS', 'Vector Search', 'Embeddings']::text[], v_pi_id);

  -- Create Datasets
  INSERT INTO public.datasets (lab_id, project_id, name, version, description, dataset_type, created_by) VALUES
  (v_lab_id, v_project_id, 'Research Meeting Dataset', '1.0', 'Collection of meeting transcripts from AI Lab.', 'text', v_pi_id),
  (v_lab_id, v_project_id, 'Experiment Metadata', '2.1', 'Historical experiment metadata from 2023–2026.', 'csv', v_pi_id),
  (v_lab_id, v_project_id, 'Publication Repository', '3.0', 'Metadata of all published research papers.', 'json', v_pi_id);

  -- Create Meetings
  INSERT INTO public.meetings (lab_id, project_id, title, scheduled_at, notes, created_by) VALUES
  (v_lab_id, v_project_id, 'Weekly Research Discussion', '2026-02-12', 'Agenda: Evaluate GraphRAG performance.
Discussion: Latency was significantly higher than expected.
Decision: Investigate Hybrid Retrieval.', v_pi_id),
  (v_lab_id, v_project_id, 'Dataset Review', '2026-03-18', 'Agenda: Compare Dataset V2 and Dataset V3.
Decision: Adopt Dataset V3.', v_pi_id);

  -- Create Decisions
  INSERT INTO public.research_decisions (lab_id, project_id, title, rationale, context, decision, made_by, created_by) VALUES
  (v_lab_id, v_project_id, 'Replace GraphRAG', 'High latency during large graph traversal.', 'Evidence: Experiment #1', 'Approved', v_pi_id, v_pi_id),
  (v_lab_id, v_project_id, 'Adopt Hybrid Retrieval', 'Improved retrieval speed while maintaining accuracy.', 'Evidence: Experiment #2', 'Approved', v_pi_id, v_pi_id),
  (v_lab_id, v_project_id, 'Standardize Meeting Templates', 'Improve automatic memory extraction.', '', 'Approved', v_pi_id, v_pi_id);

  -- Create Publications
  INSERT INTO public.publications (lab_id, project_id, title, target_venue, status, submitted_at, created_by) VALUES
  (v_lab_id, v_project_id, 'Institutional Memory for University Research Labs', 'IEEE International Conference on AI', 'published', '2026-06-20', v_pi_id),
  (v_lab_id, v_project_id, 'Hybrid Memory Systems', 'Springer', 'published', '2026-05-15', v_pi_id);

END $$;
