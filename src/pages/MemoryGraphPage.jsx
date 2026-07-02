import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Brain, Search, Loader2, AlertCircle, RefreshCw, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GraphFilters } from '@/components/graph/GraphFilters';
import { GraphLegend } from '@/components/graph/GraphLegend';
import { NodeDetailsPanel } from '@/components/graph/NodeDetailsPanel';
import { ResearchNode } from '@/components/graph/ResearchNode';
import { graphService } from '@/services/graph.service';
import { toast } from 'sonner';

/**
 * MemoryGraphPage — Visual interactive knowledge graph using React Flow.
 * Merges Supabase schema connections with Cognee semantic relationships.
 */
export default function MemoryGraphPage() {
  const { labId } = useParams();

  // Nodes & Edges React Flow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Backup original nodes and edges for filtering and searching
  const [originalNodes, setOriginalNodes] = useState([]);
  const [originalEdges, setOriginalEdges] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([
    'researcher', 'project', 'meeting', 'research_paper', 'experiment', 'dataset', 'research_decision', 'publication'
  ]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedResearcher, setSelectedResearcher] = useState('');

  // Node references lists for filtering
  const [projects, setProjects] = useState([]);
  const [researchers, setResearchers] = useState([]);

  // Map custom Node Component
  const nodeTypes = useMemo(() => ({ researchNode: ResearchNode }), []);

  // Fetch graph data from backend
  const fetchGraph = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedNode(null);
    setSearchQuery('');

    try {
      const { nodes: fetchedNodes, edges: fetchedEdges } = await graphService.getGraphData(labId);

      setNodes(fetchedNodes);
      setEdges(fetchedEdges);
      setOriginalNodes(fetchedNodes);
      setOriginalEdges(fetchedEdges);

      // Populate filter option lists
      const projectList = fetchedNodes
        .filter(n => n.data.type === 'project')
        .map(n => ({ id: n.id, name: n.data.title }));
      setProjects(projectList);

      const researcherList = fetchedNodes
        .filter(n => n.data.type === 'researcher')
        .map(n => ({ id: n.id, full_name: n.data.title }));
      setResearchers(researcherList);

    } catch (err) {
      setError(err.message || 'Failed to load graph data');
      toast.error('Unable to fetch Memory Graph');
    } finally {
      setIsLoading(false);
    }
  }, [labId, setNodes, setEdges]);

  // Load on mount
  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  // Click node handler
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // ─── FILTER & SEARCH LOGIC ──────────────────────────────────────────────────

  useEffect(() => {
    if (originalNodes.length === 0) return;

    let filteredNodes = [...originalNodes];
    let filteredEdges = [...originalEdges];

    // 1. Filter by Selected Node Types
    filteredNodes = filteredNodes.filter(n => selectedTypes.includes(n.data.type));

    // 2. Filter by Active Project selection
    if (selectedProject) {
      const projectMatches = new Set([selectedProject]);
      
      // Find connected nodes
      originalEdges.forEach(e => {
        if (e.source === selectedProject) projectMatches.add(e.target);
        if (e.target === selectedProject) projectMatches.add(e.source);
      });

      filteredNodes = filteredNodes.filter(n => projectMatches.has(n.id));
    }

    // 3. Filter by Active Researcher selection
    if (selectedResearcher) {
      const researcherMatches = new Set([selectedResearcher]);

      originalEdges.forEach(e => {
        if (e.source === selectedResearcher) researcherMatches.add(e.target);
        if (e.target === selectedResearcher) researcherMatches.add(e.source);
      });

      filteredNodes = filteredNodes.filter(n => researcherMatches.has(n.id));
    }

    // Filter edges (only keep edges where both source and target nodes exist)
    const activeNodeIds = new Set(filteredNodes.map(n => n.id));
    filteredEdges = filteredEdges.filter(e => activeNodeIds.has(e.source) && activeNodeIds.has(e.target));

    // 4. Apply Search Highlighting
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchedNodeIds = new Set();

      // Find direct search matches
      filteredNodes.forEach(n => {
        const titleMatch = n.data.title?.toLowerCase().includes(q);
        const subtitleMatch = n.data.subtitle?.toLowerCase().includes(q);
        const descMatch = n.data.raw?.description?.toLowerCase().includes(q) || n.data.raw?.abstract?.toLowerCase().includes(q);

        if (titleMatch || subtitleMatch || descMatch) {
          matchedNodeIds.add(n.id);
        }
      });

      // Highlight matched nodes and dim others
      filteredNodes = filteredNodes.map(n => {
        const isMatch = matchedNodeIds.has(n.id);
        return {
          ...n,
          style: { ...n.style, opacity: isMatch ? 1 : 0.15 }
        };
      });

      // Highlight edges connecting matched nodes and dim others
      filteredEdges = filteredEdges.map(e => {
        const isConnected = matchedNodeIds.has(e.source) || matchedNodeIds.has(e.target);
        return {
          ...e,
          style: { ...e.style, opacity: isConnected ? 1 : 0.15 },
          animated: isConnected ? e.animated : false
        };
      });
    } else {
      // Clear highlight opacities
      filteredNodes = filteredNodes.map(n => ({
        ...n,
        style: { ...n.style, opacity: 1 }
      }));
      filteredEdges = filteredEdges.map(e => ({
        ...e,
        style: { ...e.style, opacity: 1 }
      }));
    }

    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [searchQuery, selectedTypes, selectedProject, selectedResearcher, originalNodes, originalEdges, setNodes, setEdges]);

  // Toggle Type Filters
  const handleToggleType = useCallback((type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setSelectedTypes([
      'researcher', 'project', 'meeting', 'research_paper', 'experiment', 'dataset', 'research_decision', 'publication'
    ]);
    setSelectedProject('');
    setSelectedResearcher('');
    setSearchQuery('');
  }, []);

  return (
    <div className="flex-1 flex h-full overflow-hidden relative select-none">
      
      {/* Main Graph Canvas Area */}
      <div className="flex-1 flex flex-col h-full bg-background relative min-w-0">
        
        {/* Top Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 space-y-3 flex flex-col items-center max-w-4xl mx-auto w-full pointer-events-none">
          
          {/* Header Title */}
          <div className="w-full flex items-center justify-between pointer-events-auto bg-card/65 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-border/30 shadow-lg shadow-black/5">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              <div>
                <h1 className="text-sm font-bold text-foreground leading-none">Memory Graph</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">Explore institutional knowledge traversals visually</p>
              </div>
            </div>

            {/* Custom Search bar */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes (e.g. GraphRAG)..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-muted/60 border border-border/40 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/40 transition-all placeholder:text-muted-foreground/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtering Toolbar */}
          <div className="w-full pointer-events-auto">
            <GraphFilters
              selectedTypes={selectedTypes}
              onToggleType={handleToggleType}
              onResetFilters={handleResetFilters}
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              researchers={researchers}
              selectedResearcher={selectedResearcher}
              onSelectResearcher={setSelectedResearcher}
            />
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <Brain className="w-14 h-14 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 w-14 h-14 rounded-full bg-purple-400/25 animate-ping" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground/80 animate-pulse mt-3">
              Constructing memory relationships...
            </p>
          </div>
        )}

        {/* Error Overlay */}
        {error && !isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive/80" />
            <h3 className="text-base font-bold text-destructive">Unable to load Memory Graph</h3>
            <p className="text-xs text-muted-foreground max-w-sm leading-normal">
              {error || 'The connection to the graph database node failed.'}
            </p>
            <Button variant="outline" size="sm" onClick={fetchGraph} className="mt-2 gap-2 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> Retry Load
            </Button>
          </div>
        )}

        {/* React Flow Canvas */}
        {!isLoading && !error && originalNodes.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-background">
            <Brain className="h-14 w-14 text-muted-foreground/35 mb-4 animate-pulse" />
            <h3 className="text-base font-semibold text-muted-foreground/80">No institutional memory available</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-normal">
              Seeded records or graph data points are missing. Add research papers or decisions to populate the graph.
            </p>
          </div>
        )}

        {/* Canvas Render */}
        {!isLoading && !error && originalNodes.length > 0 && (
          <div className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              attributionPosition="bottom-right"
              className="z-0"
            >
              {/* Controls */}
              <Controls className="!bg-card border !border-border/30 rounded-xl overflow-hidden shadow-lg !left-4" />
              
              {/* Minimap */}
              <MiniMap
                className="!bg-card/75 border border-border/30 rounded-xl overflow-hidden shadow-lg !right-4 !bottom-4"
                nodeColor={() => '#5b21b6'}
                maskColor="rgba(0, 0, 0, 0.4)"
              />

              {/* Grid Background */}
              <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#4b5563" />

              {/* Graph Legend Overlay */}
              <GraphLegend />
            </ReactFlow>
          </div>
        )}
      </div>

      {/* Slide-out details drawer */}
      <NodeDetailsPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
