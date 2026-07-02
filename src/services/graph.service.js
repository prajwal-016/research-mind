import { supabase } from '@/lib/supabase';
import { graphFactories } from '@/utils/graph-factories';
import { cogneeClient, isCogneeConfigured } from '@/lib/cognee';

/**
 * Graph Service — Handles fetching all entities and relations from Supabase
 * and merging them with semantic Cognee graph relationships.
 */
export const graphService = {
  /**
   * Fetch all nodes and edges for a given laboratory.
   *
   * @param {string} labId - UUID of the laboratory
   * @returns {Promise<{ nodes: Array, edges: Array }>} React Flow nodes and edges
   */
  async getGraphData(labId) {
    try {
      // 1. Fetch all entity types in parallel
      const [
        { data: projects },
        { data: experiments },
        { data: papers },
        { data: datasets },
        { data: meetings },
        { data: decisions },
        { data: publications },
        membersResult
      ] = await Promise.all([
        supabase.from('projects').select('*').eq('lab_id', labId),
        supabase.from('experiments').select('*').eq('lab_id', labId),
        supabase.from('research_papers').select('*').eq('lab_id', labId),
        supabase.from('datasets').select('*').eq('lab_id', labId),
        supabase.from('meetings').select('*').eq('lab_id', labId),
        supabase.from('research_decisions').select('*').eq('lab_id', labId),
        supabase.from('publications').select('*').eq('lab_id', labId),
        supabase.from('lab_members').select('role, user_id, user:users(id, full_name, avatar_url)').eq('lab_id', labId)
      ]);

      const researchers = (membersResult.data || []).map(m => ({
        id: m.user_id,
        full_name: m.user?.full_name || 'Anonymous Researcher',
        avatar_url: m.user?.avatar_url,
        role: m.role
      }));

      const rawData = {
        projects: projects || [],
        experiments: experiments || [],
        papers: papers || [],
        datasets: datasets || [],
        meetings: meetings || [],
        decisions: decisions || [],
        publications: publications || [],
        researchers
      };

      // 2. Fetch Cognee graph relationships (if configured)
      let cogneeRelations = [];
      if (isCogneeConfigured()) {
        try {
          // Query Cognee for all insights or relationships
          const searchRes = await cogneeClient.recall('*', { searchType: 'INSIGHTS' });
          if (searchRes && Array.isArray(searchRes.results)) {
            cogneeRelations = searchRes.results;
          }
        } catch (cogneeErr) {
          console.warn('[GraphService] Cognee recall failed, relying on Supabase metadata schema:', cogneeErr.message);
        }
      }

      // 3. Generate Nodes and Edges using Factories
      const { nodes, edges } = graphFactories.createGraph(rawData, cogneeRelations);

      return { nodes, edges };
    } catch (error) {
      console.error('[GraphService] Failed to load graph data:', error);
      throw error;
    }
  }
};
