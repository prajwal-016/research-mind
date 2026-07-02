import { supabase } from '@/lib/supabase';
import { memoryService } from '@/services/memory.service';

export const decisionsService = {
  async getDecisionsByLabId(labId) {
    const { data, error } = await supabase
      .from('research_decisions')
      .select(`
        *,
        made_by_user:users!research_decisions_made_by_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('lab_id', labId)
      .order('made_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createDecision(decisionData) {
    const { data, error } = await supabase
      .from('research_decisions')
      .insert([decisionData])
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Store in institutional memory
    memoryService.remember('research_decision', data).catch(err =>
      console.warn('[Decisions] Memory remember failed:', err.message)
    );

    return data;
  }
};
