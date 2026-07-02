import { supabase } from '@/lib/supabase';
import { memoryService } from '@/services/memory.service';

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

    // Fire-and-forget: Store in institutional memory
    memoryService.remember('dataset', data).catch(err =>
      console.warn('[Datasets] Memory remember failed:', err.message)
    );

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

    // Fire-and-forget: Update institutional memory
    memoryService.remember('dataset', data).catch(err =>
      console.warn('[Datasets] Memory update failed:', err.message)
    );

    // If marked as recommended, improve memory
    if (updates.is_recommended || updates.metadata?.recommended === true) {
      memoryService.improve('dataset', data, 'Dataset version recommended by lab staff').catch(err =>
        console.warn('[Datasets] Memory improve failed:', err.message)
      );
    }

    return data;
  },

  async deleteDataset(id) {
    try {
      const dataset = await this.getDatasetById(id);
      if (dataset) {
        memoryService.forget('dataset', dataset).catch(err =>
          console.warn('[Datasets] Memory forget failed:', err.message)
        );
      }
    } catch (e) {
      console.warn('[Datasets] Failed to fetch dataset before deletion:', e.message);
    }

    const { data, error } = await supabase
      .from('datasets')
      .update({ is_archived: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
