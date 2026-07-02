import { supabase } from '@/lib/supabase';

export const experimentsService = {
  async getExperimentsByLabId(labId) {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getExperimentsByProjectId(projectId) {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getExperimentById(id) {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createExperiment(experimentData) {
    const { data, error } = await supabase
      .from('experiments')
      .insert([experimentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateExperiment(id, updates) {
    const { data, error } = await supabase
      .from('experiments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteExperiment(id) {
    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
