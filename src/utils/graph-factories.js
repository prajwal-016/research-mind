/**
 * Graph Factories — Formats raw database entities into React Flow compatible
 * Node and Edge structures with custom styling, positioning, and relation mapping.
 */

const LEVEL_Y_COORDINATES = {
  researcher: 50,
  project: 200,
  meeting: 350,
  research_paper: 500,
  experiment: 650,
  dataset: 800,
  research_decision: 950,
  publication: 1100,
};

const NODE_STYLING = {
  researcher: {
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
    icon: 'Users',
  },
  project: {
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300',
    icon: 'FolderKanban',
  },
  meeting: {
    color: 'from-sky-500/20 to-blue-500/20 border-sky-500/40 text-sky-300',
    icon: 'MessageSquare',
  },
  research_paper: {
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    icon: 'FileText',
  },
  experiment: {
    color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/40 text-blue-300',
    icon: 'FlaskConical',
  },
  dataset: {
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300',
    icon: 'Database',
  },
  research_decision: {
    color: 'from-pink-500/20 to-fuchsia-500/20 border-pink-500/40 text-pink-300',
    icon: 'Lightbulb',
  },
  publication: {
    color: 'from-violet-500/20 to-purple-600/20 border-violet-500/40 text-violet-300',
    icon: 'Award',
  },
};

export const graphFactories = {
  /**
   * Generates React Flow nodes and edges from Supabase lists and Cognee relations.
   */
  createGraph(rawData, cogneeRelations = []) {
    const nodes = [];
    const edges = [];
    const nodeMap = new Map(); // Keep track of inserted node IDs

    const addNode = (id, type, title, subtitle, status, dataObject) => {
      if (nodeMap.has(id)) return;

      const style = NODE_STYLING[type] || { color: 'from-muted to-muted border-border', icon: 'Brain' };

      const node = {
        id,
        type: 'researchNode',
        data: {
          title,
          subtitle,
          type,
          status,
          icon: style.icon,
          colorClasses: style.color,
          raw: dataObject
        },
        position: { x: 0, y: LEVEL_Y_COORDINATES[type] || 0 }
      };

      nodes.push(node);
      nodeMap.set(id, node);
    };

    // 1. Add Researcher Nodes
    rawData.researchers.forEach(r => {
      addNode(r.id, 'researcher', r.full_name, `Role: ${r.role}`, 'online', r);
    });

    // 2. Add Project Nodes
    rawData.projects.forEach(p => {
      addNode(p.id, 'project', p.name, `Status: ${p.status}`, p.status, p);
    });

    // 3. Add Meeting Nodes
    rawData.meetings.forEach(m => {
      addNode(m.id, 'meeting', m.title, new Date(m.scheduled_at).toLocaleDateString(), 'completed', m);
    });

    // 4. Add Research Paper Nodes
    rawData.papers.forEach(p => {
      addNode(p.id, 'research_paper', p.title, p.venue || 'Preprint', 'published', p);
    });

    // 5. Add Experiment Nodes
    rawData.experiments.forEach(e => {
      addNode(e.id, 'experiment', e.title, `Status: ${e.status}`, e.status, e);
    });

    // 6. Add Dataset Nodes
    rawData.datasets.forEach(d => {
      addNode(d.id, 'dataset', d.name, `Ver: ${d.version}`, d.dataset_type, d);
    });

    // 7. Add Research Decision Nodes
    rawData.decisions.forEach(d => {
      addNode(d.id, 'research_decision', d.title, d.decision, d.priority, d);
    });

    // 8. Add Publication Nodes
    rawData.publications.forEach(p => {
      addNode(p.id, 'publication', p.title, p.target_venue || 'Journal', p.status, p);
    });

    // Calculate layout positioning (distribute nodes horizontally per level)
    const typeGroups = {};
    nodes.forEach(node => {
      const type = node.data.type;
      if (!typeGroups[type]) typeGroups[type] = [];
      typeGroups[type].push(node);
    });

    const CANVAS_CENTER_X = 600;
    const HORIZONTAL_SPACING = 300;

    Object.keys(typeGroups).forEach(type => {
      const groupNodes = typeGroups[type];
      const count = groupNodes.length;
      groupNodes.forEach((node, index) => {
        const offset = (index - (count - 1) / 2) * HORIZONTAL_SPACING;
        node.position.x = CANVAS_CENTER_X + offset;
      });
    });

    // ─── STAGE EDGES ─────────────────────────────────────────────────────────

    const addEdge = (source, target, label, animated = false, style = {}) => {
      if (!nodeMap.has(source) || !nodeMap.has(target)) return;

      edges.push({
        id: `e-${source}-${target}-${label.toLowerCase().replace(' ', '-')}`,
        source,
        target,
        label,
        animated,
        style: { stroke: '#6366f1', strokeWidth: 1.5, ...style },
        labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 600 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#1e1b4b', fillOpacity: 0.8 }
      });
    };

    // 1. Researcher relationships
    rawData.experiments.forEach(e => {
      if (e.created_by) addEdge(e.created_by, e.id, 'Created', false);
    });
    rawData.projects.forEach(p => {
      if (p.created_by) addEdge(p.created_by, p.id, 'Created', false);
    });
    rawData.papers.forEach(p => {
      if (p.added_by) addEdge(p.added_by, p.id, 'Created', false);
    });
    rawData.datasets.forEach(d => {
      if (d.created_by) addEdge(d.created_by, d.id, 'Created', false);
    });
    rawData.meetings.forEach(m => {
      if (m.created_by) addEdge(m.created_by, m.id, 'Created', false);
    });
    rawData.decisions.forEach(d => {
      if (d.created_by) addEdge(d.created_by, d.id, 'Created', false);
      if (d.made_by && d.made_by !== d.created_by) addEdge(d.made_by, d.id, 'Made', false);
    });
    rawData.publications.forEach(p => {
      if (p.created_by) addEdge(p.created_by, p.id, 'Created', false);
    });

    // 2. Project relationships
    rawData.experiments.forEach(e => {
      if (e.project_id) addEdge(e.project_id, e.id, 'Belongs To', false);
    });
    rawData.papers.forEach(p => {
      if (p.project_id) addEdge(p.project_id, p.id, 'Belongs To', false);
    });
    rawData.datasets.forEach(d => {
      if (d.project_id) addEdge(d.project_id, d.id, 'Belongs To', false);
    });
    rawData.meetings.forEach(m => {
      if (m.project_id) addEdge(m.project_id, m.id, 'Belongs To', false);
    });
    rawData.decisions.forEach(d => {
      if (d.project_id) addEdge(d.project_id, d.id, 'Belongs To', false);
    });
    rawData.publications.forEach(p => {
      if (p.project_id) addEdge(p.project_id, p.id, 'Belongs To', false);
    });

    // 3. Experiment & Dataset relationships
    rawData.datasets.forEach(d => {
      if (d.experiment_id) addEdge(d.experiment_id, d.id, 'Uses', true, { stroke: '#ec4899', strokeWidth: 1.8 });
    });

    // 4. Meeting & Decision relationships
    rawData.decisions.forEach(d => {
      if (d.meeting_id) addEdge(d.meeting_id, d.id, 'Resulted In', true, { stroke: '#eab308' });
    });

    // 5. Paper & Publication relationships
    rawData.publications.forEach(p => {
      if (p.research_paper_id) addEdge(p.research_paper_id, p.id, 'Led To', true, { stroke: '#a855f7' });
    });

    // ─── MERGE COGNEE RELATIONSHIPS ──────────────────────────────────────────
    cogneeRelations.forEach(r => {
      if (r.source_id && r.target_id && r.relationship_type) {
        addEdge(r.source_id, r.target_id, r.relationship_type, true, {
          stroke: '#a855f7',
          strokeWidth: 2,
          strokeDasharray: '5,5'
        });
      }
    });

    return { nodes, edges };
  }
};
