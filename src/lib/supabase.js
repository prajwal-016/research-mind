import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[ResearchMind] Supabase environment variables are not set. ' +
      'Copy .env.example to .env.local and fill in your credentials.'
  );
}

const client = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Proxy handler to intercept Supabase mutations when Demo Mode is active.
 */
const proxyHandler = {
  get(target, prop) {
    if (prop === 'from') {
      return function(relation) {
        const queryBuilder = target.from(relation);

        // Wrap insert method
        const originalInsert = queryBuilder.insert;
        queryBuilder.insert = function(...args) {
          if (localStorage.getItem('rm_demo_mode') === 'true') {
            import('sonner').then(({ toast }) => {
              toast.warning('Destructive actions are disabled in Demo Mode.', {
                description: 'Disable Demo Mode in Settings to make changes.',
                id: 'demo-mode-warning'
              });
            });
            throw new Error('Insert mutations disabled in Demo Mode');
          }
          return originalInsert.apply(this, args);
        };

        // Wrap update method
        const originalUpdate = queryBuilder.update;
        queryBuilder.update = function(...args) {
          if (localStorage.getItem('rm_demo_mode') === 'true') {
            import('sonner').then(({ toast }) => {
              toast.warning('Destructive actions are disabled in Demo Mode.', {
                description: 'Disable Demo Mode in Settings to make changes.',
                id: 'demo-mode-warning'
              });
            });
            throw new Error('Update mutations disabled in Demo Mode');
          }
          return originalUpdate.apply(this, args);
        };

        // Wrap delete method
        const originalDelete = queryBuilder.delete;
        queryBuilder.delete = function(...args) {
          if (localStorage.getItem('rm_demo_mode') === 'true') {
            import('sonner').then(({ toast }) => {
              toast.warning('Destructive actions are disabled in Demo Mode.', {
                description: 'Disable Demo Mode in Settings to make changes.',
                id: 'demo-mode-warning'
              });
            });
            throw new Error('Delete mutations disabled in Demo Mode');
          }
          return originalDelete.apply(this, args);
        };

        return queryBuilder;
      };
    }

    const value = target[prop];
    return typeof value === 'function' ? value.bind(target) : value;
  }
};

export const supabase = new Proxy(client, proxyHandler);

