import { supabase } from '@/lib/supabase';

const BUCKET = 'research-assets';

/**
 * Storage service — wraps Supabase Storage methods.
 */
export const storageService = {
  /**
   * Upload a file to Supabase Storage.
   * @param {string} path - Storage path (e.g. "papers/uuid.pdf")
   * @param {File} file
   * @param {{ cacheControl?: string, upsert?: boolean }} options
   */
  upload: (path, file, options = {}) =>
    supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      ...options,
    }),

  /**
   * Get a public URL for a stored asset.
   * @param {string} path
   * @returns {string}
   */
  getPublicUrl: (path) => {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Delete a file from storage.
   * @param {string[]} paths
   */
  remove: (paths) => supabase.storage.from(BUCKET).remove(paths),

  /**
   * List files in a folder.
   * @param {string} folder
   */
  list: (folder) => supabase.storage.from(BUCKET).list(folder),
};
