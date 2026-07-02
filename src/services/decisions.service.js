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
  },

  async updateDecision(id, updates) {
    const { data, error } = await supabase
      .from('research_decisions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // If approved, trigger improve(), otherwise remember()
    if (updates.status === 'approved') {
      memoryService.improve('research_decision', data, 'Decision approved by faculty').catch(err =>
        console.warn('[Decisions] Memory improve failed:', err.message)
      );
    } else {
      memoryService.remember('research_decision', data).catch(err =>
        console.warn('[Decisions] Memory update failed:', err.message)
      );
    }

    return data;
  },

  async deleteDecision(id) {
    try {
      const { data: decision } = await supabase
        .from('research_decisions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (decision) {
        memoryService.forget('research_decision', decision).catch(err =>
          console.warn('[Decisions] Memory forget failed:', err.message)
        );
      }
    } catch (e) {
      console.warn('[Decisions] Failed to fetch decision before deletion:', e.message);
    }

    const { data, error } = await supabase
      .from('research_decisions')
      .update({ is_archived: true, status: 'archived' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
