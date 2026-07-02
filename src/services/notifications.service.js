import { supabase } from '@/lib/supabase';

export const notificationsService = {
  /**
   * Dispatches a notification to a specific user via the RPC function
   */
  async notifyUser(payload) {
    const {
      userId, labId, type, title, body, entityType, entityId, actionUrl, actorId
    } = payload;

    const { data, error } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_lab_id: labId,
      p_type: type,
      p_title: title,
      p_body: body || null,
      p_entity_type: entityType || null,
      p_entity_id: entityId || null,
      p_action_url: actionUrl || null,
      p_actor_id: actorId || null,
    });

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
    return data;
  },

  /**
   * Fans out a notification to all members of a lab (except the actor)
   */
  async notifyLabMembers(labId, actorId, notificationData) {
    try {
      // 1. Fetch all lab members
      const { data: members, error } = await supabase
        .from('lab_members')
        .select('user_id')
        .eq('lab_id', labId);

      if (error) throw error;

      // 2. Filter out the actor (so they don't notify themselves)
      const targetUsers = members.filter(m => m.user_id !== actorId);

      // 3. Dispatch to all targets in parallel
      await Promise.all(targetUsers.map(member => 
        this.notifyUser({
          ...notificationData,
          userId: member.user_id,
          labId,
          actorId
        })
      ));
    } catch (error) {
      console.error('Failed to notify lab members:', error);
    }
  },

  /**
   * Fetch a user's notifications
   */
  async getUserNotifications(userId, limit = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:users!notifications_actor_id_fkey(full_name, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    const { error } = await supabase
      .rpc('mark_all_notifications_read', { p_user_id: userId });

    if (error) {
      // Fallback if rpc is missing
      const { err2 } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);
      if (err2) throw err2;
    }
  }
};
