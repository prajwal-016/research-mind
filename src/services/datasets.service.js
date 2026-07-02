import { supabase } from '@/lib/supabase';

export const datasetsService = {
  async getDatasetsByLabId(labId) {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDatasetById(id) {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createDataset(datasetData) {
    const { data, error } = await supabase
      .from('datasets')
      .insert([datasetData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDataset(id, updates) {
    const { data, error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDataset(id) {
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
