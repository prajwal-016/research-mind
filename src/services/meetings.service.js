import { supabase } from '@/lib/supabase';
import { memoryService } from '@/services/memory.service';

export const meetingsService = {
  async getMeetingsByLabId(labId) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('lab_id', labId)
      .order('scheduled_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getMeetingById(id) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createMeeting(meetingData) {
    const { data, error } = await supabase
      .from('meetings')
      .insert([meetingData])
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Store in institutional memory
    memoryService.remember('meeting', data).catch(err =>
      console.warn('[Meetings] Memory remember failed:', err.message)
    );

    return data;
  },

  async updateMeeting(id, updates) {
    const { data, error } = await supabase
      .from('meetings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget: Update institutional memory
    memoryService.remember('meeting', data).catch(err =>
      console.warn('[Meetings] Memory update failed:', err.message)
    );

    return data;
  },

  async deleteMeeting(id) {
    try {
      const meeting = await this.getMeetingById(id);
      if (meeting) {
        memoryService.forget('meeting', meeting).catch(err =>
          console.warn('[Meetings] Memory forget failed:', err.message)
        );
      }
    } catch (e) {
      console.warn('[Meetings] Failed to fetch meeting before deletion:', e.message);
    }

    const { data, error } = await supabase
      .from('meetings')
      .update({ is_archived: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
