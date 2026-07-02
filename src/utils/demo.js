import { toast } from 'sonner';

/**
 * Demo Mode Utility — Handles state management and mutator interceptors 
 * to disable write/delete mutations when Demo Mode is active.
 */
export const demoModeUtil = {
  /**
   * Check if Demo Mode is currently active in localStorage.
   * @returns {boolean}
   */
  isActive() {
    return localStorage.getItem('rm_demo_mode') === 'true';
  },

  /**
   * Set the Demo Mode state.
   * @param {boolean} value
   */
  setActive(value) {
    localStorage.setItem('rm_demo_mode', String(value));
    
    // Broadcast storage change event to sync other tabs/components
    window.dispatchEvent(new Event('storage'));
  },

  /**
   * Validates a mutation request. If Demo Mode is active, throws an error
   * and displays a warnings toast notification.
   *
   * @param {string} [actionName='Operation']
   * @throws {Error} If Demo Mode is enabled
   */
  checkMutation(actionName = 'Operation') {
    if (this.isActive()) {
      const errorMsg = `Destructive action "${actionName}" is disabled in Demo Mode.`;
      toast.warning(errorMsg, {
        description: 'Disable Demo Mode in Settings to make changes to your Supabase instance.',
        duration: 4000
      });
      
      const err = new Error(errorMsg);
      err.isDemoError = true;
      throw err;
    }
  }
};
export default demoModeUtil;
