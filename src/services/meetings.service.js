import { supabase } from '@/lib/supabase';

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
    return data;
  },

  async deleteMeeting(id) {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
