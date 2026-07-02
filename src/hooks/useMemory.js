import { useState, useCallback } from 'react';
import { memoryService } from '@/services/memory.service';

/**
 * useMemory — React hook for interacting with the institutional memory layer.
 *
 * @returns {{ recall, remember, isLoading, result, error, clearResult }}
 */
export function useMemory() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Query institutional memory with a natural language question.
   * @param {string} query
   * @param {object} [options]
   */
  const recall = useCallback(async (query, options = {}) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await memoryService.recall(query, options);
      setResult(response);
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Failed to query memory';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Store an entity in institutional memory.
   * @param {string} entityType
   * @param {object} entityData
   * @param {object} [context]
   */
  const remember = useCallback(async (entityType, entityData, context = {}) => {
    try {
      return await memoryService.remember(entityType, entityData, context);
    } catch (err) {
      console.warn('[useMemory] remember failed:', err.message);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Strengthen validated knowledge.
   * @param {string} entityType
   * @param {object} entityData
   * @param {string} [approvalContext]
   */
  const improve = useCallback(async (entityType, entityData, approvalContext = '') => {
    try {
      return await memoryService.improve(entityType, entityData, approvalContext);
    } catch (err) {
      console.warn('[useMemory] improve failed:', err.message);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Archive obsolete memory.
   * @param {string} entityType
   * @param {object} entityData
   */
  const forget = useCallback(async (entityType, entityData) => {
    try {
      return await memoryService.forget(entityType, entityData);
    } catch (err) {
      console.warn('[useMemory] forget failed:', err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    recall,
    remember,
    improve,
    forget,
    isLoading,
    result,
    error,
    clearResult,
  };
}
