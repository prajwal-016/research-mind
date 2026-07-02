import { supabase } from '@/lib/supabase';

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
    return data;
  },

  async deletePaper(id) {
    const { error } = await supabase
      .from('research_papers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
