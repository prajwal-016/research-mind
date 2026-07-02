import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function seed() {
  console.log('Starting seed process...');

  const users = [
    { email: 'ananya.rao@nitk.edu', password: 'Password123!', meta: { full_name: 'Dr. Ananya Rao', institution: 'NITK', role: 'Professor' } },
    { email: 'rahul.sharma@nitk.edu', password: 'Password123!', meta: { full_name: 'Rahul Sharma', institution: 'NITK', role: 'PhD Research Scholar' } },
    { email: 'priya.nair@nitk.edu', password: 'Password123!', meta: { full_name: 'Priya Nair', institution: 'NITK', role: 'PhD Research Scholar' } },
    { email: 'arjun.patel@nitk.edu', password: 'Password123!', meta: { full_name: 'Arjun Patel', institution: 'NITK', role: 'Research Assistant' } },
    { email: 'sneha.kulkarni@nitk.edu', password: 'Password123!', meta: { full_name: 'Sneha Kulkarni', institution: 'NITK', role: 'Master\'s Student' } }
  ];

  const userIds = {};

  for (const u of users) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
      options: { data: u.meta }
    });
    if (authError) {
      console.log(`User ${u.email} already exists or error:`, authError.message);
      // Try to sign in to get the ID if already exists
      const { data: signInData } = await supabase.auth.signInWithPassword({ email: u.email, password: u.password });
      if (signInData?.user) {
        userIds[u.email] = signInData.user.id;
      }
    } else {
      console.log(`Created user: ${u.email}`);
      userIds[u.email] = authData.user.id;
    }
  }

  const PI_ID = userIds['ananya.rao@nitk.edu'];
  
  if (!PI_ID) {
    console.error('Failed to get PI ID. Exiting.');
    return;
  }

  // Auth Context: Need to act as PI for RLS
  await supabase.auth.signInWithPassword({ email: 'ananya.rao@nitk.edu', password: 'Password123!' });

  console.log('Creating Lab...');
  const { data: lab, error: labError } = await supabase.from('labs').insert([{
    name: 'Artificial Intelligence Research Lab',
    slug: 'ai-research-lab-nitk',
    institution: 'National Institute of Technology Karnataka (NITK), Surathkal',
    department: 'Computer Science and Engineering',
    metadata: {
      ai_insights: [
        { id: 1, title: 'Insight', content: 'GraphRAG experiment is related to Hybrid Retrieval.', priority: 'info' },
        { id: 2, title: 'Recommendation', content: 'Dataset V3 is recommended for future experiments.', priority: 'success' },
        { id: 3, title: 'Connection', content: 'Three experiments are connected through Knowledge Graph Retrieval.', priority: 'info' },
        { id: 4, title: 'Influence', content: 'Meeting #2 influenced Publication #1.', priority: 'info' },
        { id: 5, title: 'Similarity', content: 'Experiment #5 is similar to Experiment #2.', priority: 'warning' }
      ],
      memory_health: {
        health_score: 96,
        knowledge_nodes: 2584,
        connected_relationships: 8962,
        knowledge_growth_percent: 14,
        active_researchers: 18,
        research_projects: 6,
        experiments: 146,
        publications: 28
      }
    }
  }]).select().single();

  if (labError) {
    console.error('Error creating lab:', labError.message);
    return;
  }
  console.log('Lab created:', lab.name);

  console.log('Assigning members...');
  const memberRoles = [
    { email: 'ananya.rao@nitk.edu', role: 'owner' },
    { email: 'rahul.sharma@nitk.edu', role: 'admin' },
    { email: 'priya.nair@nitk.edu', role: 'member' },
    { email: 'arjun.patel@nitk.edu', role: 'member' },
    { email: 'sneha.kulkarni@nitk.edu', role: 'member' }
  ];

  for (const mr of memberRoles) {
    await supabase.from('lab_members').insert([{
      lab_id: lab.id,
      user_id: userIds[mr.email],
      role: mr.role
    }]);
  }

  console.log('Creating Project...');
  const { data: project } = await supabase.from('projects').insert([{
    lab_id: lab.id,
    name: 'Institutional Memory for AI Research Laboratories',
    description: 'A platform that preserves research knowledge using graph-based memory and semantic retrieval. The system helps future researchers understand previous experiments, decisions, and publications.',
    status: 'active',
    start_date: '2026-01-01',
    created_by: PI_ID
  }]).select().single();

  console.log('Creating Experiments...');
  const exps = [
    { title: 'GraphRAG Retrieval Evaluation', hypothesis: 'Evaluate GraphRAG for long-term institutional memory retrieval.', methodology: 'Implemented GraphRAG using Neo4j and vector embeddings.', results: 'Accuracy improved by 18%.', notes: 'Excellent contextual retrieval but high query latency.', status: 'completed' },
    { title: 'Hybrid Vector Retrieval', hypothesis: 'Compare vector search with graph retrieval.', methodology: 'FAISS combined with graph traversal.', results: 'Recommended for production.', notes: 'Lower latency than GraphRAG.', status: 'completed' },
    { title: 'Meeting Memory Extraction', hypothesis: 'Automatically convert meeting notes into institutional memory.', methodology: 'Gemini summarization plus Cognee remember().', results: 'Meeting summaries successfully linked to experiments.', status: 'completed' },
    { title: 'Dataset Version Comparison', hypothesis: 'Evaluate different dataset versions.', results: 'Dataset V3 improved model accuracy by 7%.', status: 'completed' },
    { title: 'Knowledge Graph Visualization', hypothesis: 'Visualize relationships between papers and experiments.', results: 'React Flow produced interactive research graph.', status: 'running' }
  ];
  
  for (const ex of exps) {
    await supabase.from('experiments').insert([{
      lab_id: lab.id,
      project_id: project.id,
      title: ex.title,
      hypothesis: ex.hypothesis,
      methodology: ex.methodology,
      results: ex.results,
      notes: ex.notes,
      status: ex.status,
      created_by: PI_ID
    }]);
  }

  console.log('Creating Papers...');
  const papers = [
    { title: 'GraphRAG for Institutional Knowledge Retrieval', authors: ['Rahul Sharma', 'Dr. Ananya Rao'], abstract: 'This paper evaluates graph-based retrieval techniques for preserving long-term institutional knowledge.', published_date: '2026-01-01', keywords: ['GraphRAG', 'Knowledge Graph', 'LLM', 'Institutional Memory'] },
    { title: 'Hybrid Memory Systems for Research Laboratories', authors: ['Priya Nair'], published_date: '2026-01-01', keywords: ['Hybrid Retrieval', 'Vector Database', 'Knowledge Management'] },
    { title: 'Semantic Retrieval using FAISS', authors: ['Arjun Patel'], published_date: '2025-01-01', keywords: ['FAISS', 'Vector Search', 'Embeddings'] }
  ];

  for (const p of papers) {
    await supabase.from('research_papers').insert([{
      lab_id: lab.id,
      title: p.title,
      authors: p.authors,
      abstract: p.abstract,
      published_date: p.published_date,
      tags: p.keywords,
      added_by: PI_ID
    }]);
  }

  console.log('Creating Datasets...');
  const datasets = [
    { name: 'Research Meeting Dataset', version: '1.0', description: 'Collection of meeting transcripts from AI Lab.', dataset_type: 'raw' },
    { name: 'Experiment Metadata', version: '2.1', description: 'Historical experiment metadata from 2023–2026.', dataset_type: 'processed' },
    { name: 'Publication Repository', version: '3.0', description: 'Metadata of all published research papers.', dataset_type: 'processed' }
  ];

  for (const d of datasets) {
    await supabase.from('datasets').insert([{
      lab_id: lab.id,
      project_id: project.id,
      name: d.name,
      version: d.version,
      description: d.description,
      dataset_type: d.dataset_type,
      created_by: PI_ID
    }]);
  }

  console.log('Creating Meetings...');
  await supabase.from('meetings').insert([
    { lab_id: lab.id, project_id: project.id, title: 'Weekly Research Discussion', date: '2026-02-12', notes: 'Agenda: Evaluate GraphRAG performance.\nDiscussion: Latency was significantly higher than expected.\nDecision: Investigate Hybrid Retrieval.', created_by: PI_ID },
    { lab_id: lab.id, project_id: project.id, title: 'Dataset Review', date: '2026-03-18', notes: 'Agenda: Compare Dataset V2 and Dataset V3.\nDecision: Adopt Dataset V3.', created_by: PI_ID }
  ]);

  console.log('Creating Decisions...');
  await supabase.from('research_decisions').insert([
    { lab_id: lab.id, project_id: project.id, title: 'Replace GraphRAG', rationale: 'High latency during large graph traversal.', context: 'Evidence: Experiment #1', decision: 'Approved', made_by: PI_ID, created_by: PI_ID },
    { lab_id: lab.id, project_id: project.id, title: 'Adopt Hybrid Retrieval', rationale: 'Improved retrieval speed while maintaining accuracy.', context: 'Evidence: Experiment #2', decision: 'Approved', made_by: PI_ID, created_by: PI_ID },
    { lab_id: lab.id, project_id: project.id, title: 'Standardize Meeting Templates', rationale: 'Improve automatic memory extraction.', decision: 'Approved', made_by: PI_ID, created_by: PI_ID }
  ]);

  console.log('Creating Publications...');
  await supabase.from('publications').insert([
    { lab_id: lab.id, project_id: project.id, title: 'Institutional Memory for University Research Labs', target_venue: 'IEEE International Conference on AI', status: 'published', submitted_date: '2026-06-20', created_by: PI_ID },
    { lab_id: lab.id, project_id: project.id, title: 'Hybrid Memory Systems', target_venue: 'Springer', status: 'published', submitted_date: '2026-05-15', created_by: PI_ID }
  ]);

  console.log('Seed Complete!');
}

seed();
