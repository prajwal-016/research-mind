import { supabase } from '@/lib/supabase';

export const labsService = {
  /**
   * Fetch all labs, optionally filtered by a search query.
   */
  async getLabs() {
    const { data, error } = await supabase
      .from('labs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch a single lab by ID.
   */
  async getLabById(id) {
    const { data, error } = await supabase
      .from('labs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new lab.
   */
  async createLab(labData) {
    const { data, error } = await supabase
      .from('labs')
      .insert([labData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing lab.
   */
  async updateLab(id, updates) {
    const { data, error } = await supabase
      .from('labs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a lab.
   */
  async deleteLab(id) {
    const { error } = await supabase
      .from('labs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
