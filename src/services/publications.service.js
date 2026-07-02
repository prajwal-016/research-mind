import { supabase } from '@/lib/supabase';
import { memoryService } from '@/services/memory.service';

export const publicationsService = {
  async getPublicationsByLabId(labId) {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPublicationById(id) {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createPublication(publicationData) {
    const { data, error } = await supabase
      .from('publications')
      .insert([publicationData])
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Store in institutional memory
    memoryService.remember('publication', data).catch(err =>
      console.warn('[Publications] Memory remember failed:', err.message)
    );

    return data;
  },

  async updatePublication(id, updates) {
    const { data, error } = await supabase
      .from('publications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Sync with memory
    if (updates.status === 'archived' || updates.status === 'withdrawn') {
      memoryService.forget('publication', data).catch(err =>
        console.warn('[Publications] Memory forget failed:', err.message)
      );
    } else if (updates.status === 'published' || updates.status === 'accepted') {
      memoryService.improve('publication', data, `Publication ${updates.status}`).catch(err =>
        console.warn('[Publications] Memory improve failed:', err.message)
      );
    } else {
      memoryService.remember('publication', data).catch(err =>
        console.warn('[Publications] Memory update failed:', err.message)
      );
    }

    return data;
  },

  async deletePublication(id) {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
