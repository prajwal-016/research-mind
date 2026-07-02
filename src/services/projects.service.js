import { supabase } from '@/lib/supabase';
import { memoryService } from '@/services/memory.service';

export const projectsService = {
  async getProjectsByLabId(labId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getProjectById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProject(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Store in institutional memory
    memoryService.remember('project', data).catch(err =>
      console.warn('[Projects] Memory remember failed:', err.message)
    );

    return data;
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Sync with institutional memory
    if (updates.status === 'archived') {
      memoryService.forget('project', data).catch(err =>
        console.warn('[Projects] Memory forget failed:', err.message)
      );
    } else {
      memoryService.remember('project', data).catch(err =>
        console.warn('[Projects] Memory update failed:', err.message)
      );
    }

    return data;
  },

  async deleteProject(id) {
    try {
      const project = await this.getProjectById(id);
      if (project) {
        memoryService.forget('project', project).catch(err =>
          console.warn('[Projects] Memory forget failed:', err.message)
        );
      }
    } catch (e) {
      console.warn('[Projects] Failed to fetch project before deletion:', e.message);
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ status: 'archived' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

