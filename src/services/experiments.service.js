import { supabase } from '@/lib/supabase';
import { memoryService } from '@/services/memory.service';
import { demoModeUtil } from '@/utils/demo';

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
    demoModeUtil.checkMutation('Create Experiment');
    const { data, error } = await supabase
      .from('experiments')
      .insert([experimentData])
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Store in institutional memory
    memoryService.remember('experiment', data).catch(err =>
      console.warn('[Experiments] Memory remember failed:', err.message)
    );

    return data;
  },

  async updateExperiment(id, updates) {
    demoModeUtil.checkMutation('Update Experiment');
    const { data, error } = await supabase
      .from('experiments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Update institutional memory
    memoryService.remember('experiment', data).catch(err =>
      console.warn('[Experiments] Memory update failed:', err.message)
    );

    return data;
  },

  async deleteExperiment(id) {
    demoModeUtil.checkMutation('Delete Experiment');
    try {
      const experiment = await this.getExperimentById(id);
      if (experiment) {
        memoryService.forget('experiment', experiment).catch(err =>
          console.warn('[Experiments] Memory forget failed:', err.message)
        );
      }
    } catch (e) {
      console.warn('[Experiments] Failed to fetch experiment before deletion:', e.message);
    }

    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
