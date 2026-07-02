-- =============================================================================
-- ResearchMind — Seed Data (Development / Demo)
-- =============================================================================
-- Run AFTER schema.sql.
-- Creates two demo labs, three users, and sample content.
-- NOTE: The users below must first be created via Supabase Auth
--       (Auth > Users > Invite). Replace the UUIDs with real auth.users IDs.
-- =============================================================================

-- Demo UUIDs (replace with real auth.users IDs after creating them in Supabase Auth)
DO $$
DECLARE
  uid_alice  UUID := '00000000-0000-0000-0000-000000000001';
  uid_bob    UUID := '00000000-0000-0000-0000-000000000002';
  uid_carol  UUID := '00000000-0000-0000-0000-000000000003';

  lab_ml     UUID;
  lab_bio    UUID;

  proj_llm   UUID;
  proj_prot  UUID;

  exp_1      UUID;
  paper_1    UUID;
  meet_1     UUID;
BEGIN

  -- ─── Users ──────────────────────────────────────────────────────────────────
  INSERT INTO public.users (id, email, full_name, position, institution)
  VALUES
    (uid_alice, 'alice@university.edu', 'Alice Chen',    'Associate Professor',     'MIT'),
    (uid_bob,   'bob@university.edu',   'Bob Ramirez',   'PhD Student',             'MIT'),
    (uid_carol, 'carol@university.edu', 'Carol Williams','Postdoctoral Researcher', 'MIT')
  ON CONFLICT (id) DO NOTHING;

  -- ─── Labs ───────────────────────────────────────────────────────────────────
  INSERT INTO public.labs (id, name, slug, description, institution, department, research_areas, created_by)
  VALUES
    (uuid_generate_v4(), 'AI & NLP Research Lab',
     'ai-nlp-lab',
     'Advancing the frontiers of natural language processing and large language models.',
     'MIT', 'CSAIL',
     ARRAY['natural-language-processing','large-language-models','machine-learning'],
     uid_alice),
    (uuid_generate_v4(), 'Computational Biology Lab',
     'comp-bio-lab',
     'Applying machine learning to protein structure prediction and genomics.',
     'MIT', 'Biology',
     ARRAY['computational-biology','protein-structure','genomics'],
     uid_carol)
  RETURNING id INTO lab_ml;   -- Note: only last INSERT goes into lab_ml in this simplified seed

  -- Retrieve actual IDs for further inserts
  SELECT id INTO lab_ml  FROM public.labs WHERE slug = 'ai-nlp-lab'   LIMIT 1;
  SELECT id INTO lab_bio FROM public.labs WHERE slug = 'comp-bio-lab' LIMIT 1;

  -- ─── Lab members ────────────────────────────────────────────────────────────
  -- Alice is auto-added as owner of ai-nlp-lab via trigger
  -- Carol is auto-added as owner of comp-bio-lab via trigger
  INSERT INTO public.lab_members (lab_id, user_id, role, title)
  VALUES
    (lab_ml,  uid_bob,   'member', 'PhD Student'),
    (lab_ml,  uid_carol, 'member', 'Collaborator'),
    (lab_bio, uid_alice, 'member', 'Collaborator'),
    (lab_bio, uid_bob,   'member', 'Research Assistant')
  ON CONFLICT (lab_id, user_id) DO NOTHING;

  -- ─── Projects ───────────────────────────────────────────────────────────────
  INSERT INTO public.projects (id, lab_id, name, description, status, start_date, research_areas, created_by)
  VALUES
    (uuid_generate_v4(), lab_ml,
     'Long-Context LLM Benchmarking',
     'Systematic benchmarking of large language models on tasks requiring long-context reasoning.',
     'active', '2025-01-15',
     ARRAY['benchmarking','large-language-models','evaluation'],
     uid_alice),
    (uuid_generate_v4(), lab_bio,
     'AlphaFold3 Comparative Analysis',
     'Comparing AlphaFold3 predictions against experimental structures in novel protein families.',
     'planning', '2025-03-01',
     ARRAY['protein-structure','alphafold','structural-biology'],
     uid_carol)
  RETURNING id INTO proj_llm;

  SELECT id INTO proj_llm  FROM public.projects WHERE name = 'Long-Context LLM Benchmarking'    LIMIT 1;
  SELECT id INTO proj_prot FROM public.projects WHERE name = 'AlphaFold3 Comparative Analysis'  LIMIT 1;

  -- ─── Experiments ────────────────────────────────────────────────────────────
  INSERT INTO public.experiments (id, lab_id, project_id, title, hypothesis, status, created_by)
  VALUES
    (uuid_generate_v4(), lab_ml, proj_llm,
     'GPT-4o vs Claude 3.5 on NeedleBench',
     'GPT-4o will outperform Claude 3.5 Sonnet on retrieval tasks exceeding 100k tokens.',
     'running',
     uid_bob),
    (uuid_generate_v4(), lab_ml, proj_llm,
     'Positional Encoding Ablation Study',
     'Rotary positional embeddings degrade less than ALiBi beyond 128k token contexts.',
     'draft',
     uid_alice)
  RETURNING id INTO exp_1;

  SELECT id INTO exp_1 FROM public.experiments WHERE title LIKE 'GPT-4o%' LIMIT 1;

  -- ─── Research papers ────────────────────────────────────────────────────────
  INSERT INTO public.research_papers (lab_id, project_id, title, authors, abstract, paper_type, doi, keywords, added_by)
  VALUES
    (lab_ml, proj_llm,
     'Lost in the Middle: How Language Models Use Long Contexts',
     ARRAY['Nelson F. Liu','Kevin Lin','John Hewitt','Ashwin Paranjape','Michele Bevilacqua','Fabio Petroni','Percy Liang'],
     'We analyze how language models use long contexts and find that performance degrades when relevant information appears in the middle of the context.',
     'journal_article',
     '10.1162/tacl_a_00638',
     ARRAY['long-context','language-models','retrieval','attention'],
     uid_alice),
    (lab_bio, proj_prot,
     'Highly accurate protein structure prediction with AlphaFold',
     ARRAY['John Jumper','Richard Evans','Alexander Pritzel'],
     'AlphaFold produces highly accurate protein structure predictions that are competitive with experimental structures.',
     'journal_article',
     '10.1038/s41586-021-03819-2',
     ARRAY['protein-structure','deep-learning','alphafold'],
     uid_carol)
  RETURNING id INTO paper_1;

  -- ─── Meetings ───────────────────────────────────────────────────────────────
  INSERT INTO public.meetings (lab_id, project_id, title, meeting_type, scheduled_at, duration_mins, agenda, attendees, created_by)
  VALUES
    (lab_ml, proj_llm,
     'Weekly LLM Benchmarking Sync',
     'project_sync',
     NOW() + INTERVAL '2 days',
     60,
     E'1. NeedleBench run status update\n2. Positional encoding ablation design\n3. Paper submission timeline',
     ARRAY[uid_alice, uid_bob],
     uid_alice),
    (lab_bio, NULL,
     'Lab Meeting — Q3 Planning',
     'lab_meeting',
     NOW() + INTERVAL '7 days',
     90,
     E'1. Research roadmap review\n2. New student onboarding\n3. Grant deadline reminders',
     ARRAY[uid_carol, uid_bob, uid_alice],
     uid_carol)
  RETURNING id INTO meet_1;

  SELECT id INTO meet_1 FROM public.meetings WHERE title LIKE 'Weekly LLM%' LIMIT 1;

  -- ─── Research decisions ──────────────────────────────────────────────────────
  INSERT INTO public.research_decisions (lab_id, project_id, meeting_id, title, context, decision, rationale, priority, made_by, created_by)
  VALUES
    (lab_ml, proj_llm, meet_1,
     'Use NeedleBench as primary long-context benchmark',
     'We evaluated SCROLLS, LongBench, ZeroSCROLLS, and NeedleBench for long-context evaluation.',
     'Adopt NeedleBench as our primary benchmark for the Q1 study.',
     'NeedleBench offers the most granular token-position analysis and supports 1M+ token contexts, which aligns with our research goals.',
     'high',
     uid_alice,
     uid_alice),
    (lab_bio, proj_prot, NULL,
     'Limit initial study to prokaryotic proteins',
     'Eukaryotic proteins have more complex folding dynamics; comparative analysis would be confounded.',
     'Restrict Phase 1 to prokaryotic single-domain proteins under 500 residues.',
     'Reduces experimental variability and allows faster iteration. Eukaryotes will be Phase 2.',
     'medium',
     uid_carol,
     uid_carol);

  -- ─── Publications ────────────────────────────────────────────────────────────
  INSERT INTO public.publications (lab_id, project_id, title, authors, status, paper_type, target_venue, created_by)
  VALUES
    (lab_ml, proj_llm,
     'Benchmarking Long-Context Reasoning in State-of-the-Art LLMs',
     ARRAY['Bob Ramirez','Alice Chen'],
     'draft',
     'conference_paper',
     'NeurIPS 2025',
     uid_bob);

END $$;
