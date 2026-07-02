import { supabase } from '@/lib/supabase';
import { memoryService } from '@/services/memory.service';

export const papersService = {
  async getPapersByLabId(labId) {
    const { data, error } = await supabase
      .from('research_papers')
      .select('*')
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPaperById(id) {
    const { data, error } = await supabase
      .from('research_papers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createPaper(paperData) {
    const { data, error } = await supabase
      .from('research_papers')
      .insert([paperData])
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Store in institutional memory
    memoryService.remember('research_paper', data).catch(err =>
      console.warn('[Papers] Memory remember failed:', err.message)
    );

    return data;
  },

  async updatePaper(id, updates) {
    const { data, error } = await supabase
      .from('research_papers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Update institutional memory
    memoryService.remember('research_paper', data).catch(err =>
      console.warn('[Papers] Memory update failed:', err.message)
    );

    return data;
  },

  async deletePaper(id) {
    try {
      const paper = await this.getPaperById(id);
      if (paper) {
        memoryService.forget('research_paper', paper).catch(err =>
          console.warn('[Papers] Memory forget failed:', err.message)
        );
      }
    } catch (e) {
      console.warn('[Papers] Failed to fetch paper before deletion:', e.message);
    }

    const { data, error } = await supabase
      .from('research_papers')
      .update({ is_archived: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
