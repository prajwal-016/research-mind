import { supabase } from '@/lib/supabase';
import { aiService } from '@/services/ai.service';
import { isCogneeConfigured, cogneeClient } from '@/lib/cognee';
import { recommendationEngine } from './recommendation-engine';

/**
 * AI Insights Service — Coordinates fetching database state and semantic
 * graph relationships, and runs the Gemini reasoning engine to generate proactive recommendations.
 */
export const aiInsightsService = {
  /**
   * Generates structured research insights by feeding laboratory metadata and
   * graph relationships to Google Gemini.
   *
   * @param {string} labId - UUID of the laboratory
   * @returns {Promise<Array>} List of generated insight objects
   */
  async generateInsights(labId) {
    try {
      // 1. Fetch lab entities in parallel from Supabase
      const [
        { data: projects },
        { data: experiments },
        { data: papers },
        { data: datasets },
        { data: meetings },
        { data: decisions },
        { data: publications }
      ] = await Promise.all([
        supabase.from('projects').select('*').eq('lab_id', labId),
        supabase.from('experiments').select('*').eq('lab_id', labId),
        supabase.from('research_papers').select('*').eq('lab_id', labId),
        supabase.from('datasets').select('*').eq('lab_id', labId),
        supabase.from('meetings').select('*').eq('lab_id', labId),
        supabase.from('research_decisions').select('*').eq('lab_id', labId),
        supabase.from('publications').select('*').eq('lab_id', labId)
      ]);

      const contextSummary = {
        projects: (projects || []).map(p => ({ id: p.id, name: p.name, desc: p.description, status: p.status })),
        experiments: (experiments || []).map(e => ({ id: e.id, title: e.title, hypothesis: e.hypothesis, status: e.status })),
        papers: (papers || []).map(p => ({ id: p.id, title: p.title, venue: p.venue, abstract: p.abstract })),
        datasets: (datasets || []).map(d => ({ id: d.id, name: d.name, type: d.dataset_type, desc: d.description })),
        meetings: (meetings || []).map(m => ({ id: m.id, title: m.title, agenda: m.agenda })),
        decisions: (decisions || []).map(d => ({ id: d.id, title: d.title, priority: d.priority, decision: d.decision })),
        publications: (publications || []).map(p => ({ id: p.id, title: p.title, status: p.status }))
      };

      // 2. Fetch semantic relations from Cognee if configured
      let relationsSummary = [];
      if (isCogneeConfigured()) {
        try {
          const cogneeRes = await cogneeClient.recall('*', { searchType: 'INSIGHTS' });
          if (cogneeRes && Array.isArray(cogneeRes.results)) {
            relationsSummary = cogneeRes.results.map(r => `${r.source_title} -[${r.relationship_type}]-> ${r.target_title}`);
          }
        } catch (cErr) {
          console.warn('[AIInsightsService] Failed to load Cognee graph relations:', cErr.message);
        }
      }

      // 3. Generate structured recommendations via Gemini
      const prompt = recommendationEngine.buildPrompt(contextSummary, relationsSummary);
      
      try {
        const geminiResponse = await aiService.generate(prompt);
        const insights = recommendationEngine.parseResponse(geminiResponse);
        if (insights && insights.length > 0) {
          return insights;
        }
      } catch (geminiErr) {
        console.warn('[AIInsightsService] Gemini generation failed, falling back to static analytics engine:', geminiErr.message);
      }

      // Fallback: Generate template-based structured insights if Gemini fails
      return recommendationEngine.generateFallbackInsights(contextSummary);
    } catch (error) {
      console.error('[AIInsightsService] Failed to compile insights:', error);
      throw error;
    }
  }
};
export default aiInsightsService;
