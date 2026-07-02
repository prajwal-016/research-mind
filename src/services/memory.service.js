import { cogneeClient, isCogneeConfigured, CogneeApiError } from '@/lib/cognee';
import { supabase } from '@/lib/supabase';
import { memoryObjectBuilder } from '@/services/memory-objects.service';

/**
 * Memory Service — orchestrates the complete Cognee memory lifecycle.
 *
 * Responsibilities:
 *   - remember()  — Store new institutional memories
 *   - recall()    — Retrieve memories via natural language
 *   - improve()   — Strengthen validated knowledge
 *   - forget()    — Archive obsolete memories
 *   - Queue management for offline/retry scenarios
 *   - Activity logging for all memory operations
 */

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 10000]; // exponential backoff

/** Helper: sleep */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/** Helper: Generate a unique dataset name for an entity */
const datasetName = (entityType, entityId) => `rm_${entityType}_${entityId}`;

export const memoryService = {
  // ─── REMEMBER ─────────────────────────────────────────────────────────────
  /**
   * Store an entity as institutional memory in Cognee.
   * If Cognee is unavailable, queues the operation for retry.
   *
   * @param {string} entityType - One of: experiment, research_paper, dataset, meeting, research_decision, publication
   * @param {object} entityData - The full entity record from Supabase
   * @param {object} [context] - Additional context (project, lab, researcher info)
   * @returns {Promise<{ success: boolean, queued?: boolean }>}
   */
  async remember(entityType, entityData, context = {}) {
    if (!isCogneeConfigured()) {
      console.warn('[Memory] Cognee not configured, skipping remember()');
      return { success: false, reason: 'not_configured' };
    }

    const memoryObject = memoryObjectBuilder.build(entityType, entityData, context);
    const content = memoryObjectBuilder.toText(memoryObject);
    const dsName = datasetName(entityType, entityData.id);

    try {
      // 1. Ingest into Cognee
      await this._withRetry(() => cogneeClient.remember(content, dsName));

      // 2. Process into knowledge graph
      await this._withRetry(() => cogneeClient.cognify(dsName));

      // 3. Update the entity's cognee_node_id in Supabase
      await this._updateCogneeNodeId(entityType, entityData.id, dsName);

      // 4. Log the activity
      await this._logMemoryActivity('memory_created', entityType, entityData.id, entityData.title || entityData.name);

      console.log(`[Memory] Remembered: ${entityType} "${entityData.title || entityData.name}"`);
      return { success: true };
    } catch (error) {
      console.error(`[Memory] remember() failed for ${entityType} ${entityData.id}:`, error.message);

      // Queue for retry if transient error
      if (error instanceof CogneeApiError && error.isTransient) {
        await this._queueOperation('remember', entityType, entityData, context);
        return { success: false, queued: true };
      }

      return { success: false, error: error.message };
    }
  },

  // ─── RECALL ────────────────────────────────────────────────────────────────
  /**
   * Query institutional memory using natural language.
   *
   * @param {string} query - Natural language question
   * @param {object} [options] - Search options
   * @returns {Promise<object>} { answer, supportingEntities, confidence, memoryPath }
   */
  async recall(query, options = {}) {
    if (!isCogneeConfigured()) {
      return {
        answer: 'Memory service is not configured. Please set up Cognee credentials.',
        supportingExperiments: [],
        supportingPapers: [],
        supportingMeetings: [],
        supportingDecisions: [],
        confidence: 0,
        memoryPath: [],
      };
    }

    try {
      const results = await this._withRetry(() => cogneeClient.recall(query, options));

      // Parse and structure the response
      const parsed = this._parseRecallResults(results, query);

      // Log the query
      await this._logMemoryActivity('memory_recalled', 'query', null, query);

      return parsed;
    } catch (error) {
      console.error('[Memory] recall() failed:', error.message);
      return {
        answer: `Memory retrieval failed: ${error.message}. Please try again.`,
        supportingExperiments: [],
        supportingPapers: [],
        supportingMeetings: [],
        supportingDecisions: [],
        confidence: 0,
        memoryPath: [],
        error: error.message,
      };
    }
  },

  // ─── IMPROVE ───────────────────────────────────────────────────────────────
  /**
   * Strengthen validated institutional knowledge.
   * Called when a Professor approves an experiment, decision, or publication.
   *
   * @param {string} entityType
   * @param {object} entityData
   * @param {string} approvalContext - Why this was approved
   * @returns {Promise<{ success: boolean }>}
   */
  async improve(entityType, entityData, approvalContext = '') {
    if (!isCogneeConfigured()) {
      return { success: false, reason: 'not_configured' };
    }

    try {
      // Build an enriched memory with approval context
      const enrichedContent = [
        `[VALIDATED KNOWLEDGE — Professor Approved]`,
        `Entity Type: ${entityType}`,
        `Title: ${entityData.title || entityData.name}`,
        `Status: Approved and validated`,
        approvalContext ? `Approval Context: ${approvalContext}` : '',
        `This knowledge has been validated by faculty review and should be given higher confidence in future retrievals.`,
        `Validated At: ${new Date().toISOString()}`,
      ].filter(Boolean).join('\n');

      const dsName = datasetName(entityType, entityData.id);

      await this._withRetry(() => cogneeClient.remember(enrichedContent, dsName));
      await this._withRetry(() => cogneeClient.cognify(dsName));

      await this._logMemoryActivity('memory_improved', entityType, entityData.id, entityData.title || entityData.name);

      console.log(`[Memory] Improved: ${entityType} "${entityData.title || entityData.name}"`);
      return { success: true };
    } catch (error) {
      console.error(`[Memory] improve() failed:`, error.message);
      if (error instanceof CogneeApiError && error.isTransient) {
        await this._queueOperation('improve', entityType, entityData, { approvalContext });
        return { success: false, queued: true };
      }
      return { success: false, error: error.message };
    }
  },

  // ─── FORGET ────────────────────────────────────────────────────────────────
  /**
   * Archive obsolete institutional memories.
   * Called when a Professor archives a dataset, project, experiment, or publication.
   * Does NOT delete records from Supabase.
   *
   * @param {string} entityType
   * @param {object} entityData
   * @returns {Promise<{ success: boolean }>}
   */
  async forget(entityType, entityData) {
    if (!isCogneeConfigured()) {
      return { success: false, reason: 'not_configured' };
    }

    try {
      const dsName = datasetName(entityType, entityData.id);
      await this._withRetry(() => cogneeClient.forget(dsName));

      // Clear the cognee_node_id in Supabase
      await this._updateCogneeNodeId(entityType, entityData.id, null);

      await this._logMemoryActivity('memory_archived', entityType, entityData.id, entityData.title || entityData.name);

      console.log(`[Memory] Forgot: ${entityType} "${entityData.title || entityData.name}"`);
      return { success: true };
    } catch (error) {
      console.error(`[Memory] forget() failed:`, error.message);
      if (error instanceof CogneeApiError && error.isTransient) {
        await this._queueOperation('forget', entityType, entityData, {});
        return { success: false, queued: true };
      }
      return { success: false, error: error.message };
    }
  },

  // ─── QUEUE MANAGEMENT ──────────────────────────────────────────────────────

  /**
   * Queue a failed operation for later retry.
   * @private
   */
  async _queueOperation(operation, entityType, entityData, context) {
    try {
      const { error } = await supabase
        .from('memory_queue')
        .insert([{
          operation,
          entity_type: entityType,
          entity_id: entityData.id,
          payload: { entityData, context },
          status: 'pending',
          retry_count: 0,
          max_retries: MAX_RETRIES,
        }]);

      if (error) {
        console.error('[Memory] Failed to queue operation:', error);
      } else {
        console.log(`[Memory] Queued ${operation} for ${entityType} ${entityData.id}`);
      }
    } catch (err) {
      console.error('[Memory] Queue insert failed:', err);
    }
  },

  /**
   * Process pending items from the memory queue.
   * Call this periodically or on app startup.
   */
  async processQueue() {
    if (!isCogneeConfigured()) return;

    try {
      const { data: pendingItems, error } = await supabase
        .from('memory_queue')
        .select('*')
        .eq('status', 'pending')
        .lt('retry_count', MAX_RETRIES)
        .order('created_at', { ascending: true })
        .limit(10);

      if (error || !pendingItems?.length) return;

      for (const item of pendingItems) {
        try {
          // Mark as processing
          await supabase
            .from('memory_queue')
            .update({ status: 'processing' })
            .eq('id', item.id);

          const { entityData, context } = item.payload;

          // Execute the operation
          switch (item.operation) {
            case 'remember':
              await this.remember(item.entity_type, entityData, context);
              break;
            case 'improve':
              await this.improve(item.entity_type, entityData, context.approvalContext);
              break;
            case 'forget':
              await this.forget(item.entity_type, entityData);
              break;
          }

          // Mark as completed
          await supabase
            .from('memory_queue')
            .update({ status: 'completed', processed_at: new Date().toISOString() })
            .eq('id', item.id);

        } catch (err) {
          // Increment retry count
          await supabase
            .from('memory_queue')
            .update({
              status: item.retry_count + 1 >= MAX_RETRIES ? 'failed' : 'pending',
              retry_count: item.retry_count + 1,
              last_error: err.message,
            })
            .eq('id', item.id);
        }
      }
    } catch (err) {
      console.error('[Memory] Queue processing failed:', err);
    }
  },

  // ─── PRIVATE HELPERS ───────────────────────────────────────────────────────

  /**
   * Retry a function with exponential backoff.
   * @private
   */
  async _withRetry(fn, retries = MAX_RETRIES) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === retries - 1) throw error;
        if (error instanceof CogneeApiError && !error.isTransient) throw error;
        const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
        console.warn(`[Memory] Retry ${attempt + 1}/${retries} in ${delay}ms...`);
        await sleep(delay);
      }
    }
  },

  /**
   * Update the cognee_node_id column on the entity's table.
   * @private
   */
  async _updateCogneeNodeId(entityType, entityId, nodeId) {
    const tableMap = {
      experiment: 'experiments',
      research_paper: 'research_papers',
      dataset: 'datasets',
      meeting: 'meetings',
      research_decision: 'research_decisions',
      publication: 'publications',
    };

    const table = tableMap[entityType];
    if (!table) return;

    try {
      await supabase
        .from(table)
        .update({ cognee_node_id: nodeId })
        .eq('id', entityId);
    } catch (err) {
      console.warn(`[Memory] Failed to update cognee_node_id for ${entityType} ${entityId}:`, err);
    }
  },

  /**
   * Log a memory operation to the activity_logs table.
   * @private
   */
  async _logMemoryActivity(action, entityType, entityId, entityTitle) {
    try {
      // Insert into activity_logs via a lightweight approach.
      // The 'action' values like 'memory_created' aren't in the activity_action enum,
      // so we use the 'metadata' column to store the memory operation type.
      const { data: { user } } = await supabase.auth.getUser();

      await supabase
        .from('activity_logs')
        .insert([{
          actor_id: user?.id || null,
          action: 'created', // Use a valid enum value
          entity_type: entityType === 'query' ? 'lab' : entityType, // Use valid entity_type
          entity_id: entityId || '00000000-0000-0000-0000-000000000000',
          entity_title: entityTitle,
          metadata: { memory_operation: action },
        }]);
    } catch (err) {
      // Don't let logging failures break the main flow
      console.warn('[Memory] Activity log failed:', err);
    }
  },

  /**
   * Parse raw Cognee recall results into a structured response.
   * @private
   */
  _parseRecallResults(results, query) {
    // Cognee returns different formats based on query_type
    // For GRAPH_COMPLETION, results is typically an array of text responses
    const answer = Array.isArray(results)
      ? results.map(r => typeof r === 'string' ? r : r.text || r.content || JSON.stringify(r)).join('\n\n')
      : typeof results === 'string' ? results
      : results?.answer || results?.text || 'No specific answer found in institutional memory.';

    // Extract supporting entities from the response metadata
    const supportingExperiments = this._extractEntities(results, 'experiment');
    const supportingPapers = this._extractEntities(results, 'research_paper');
    const supportingMeetings = this._extractEntities(results, 'meeting');
    const supportingDecisions = this._extractEntities(results, 'research_decision');

    // Calculate confidence based on number of supporting entities
    const totalSupport = supportingExperiments.length + supportingPapers.length +
                         supportingMeetings.length + supportingDecisions.length;
    const confidence = Math.min(totalSupport > 0 ? 0.5 + (totalSupport * 0.1) : 0.3, 1.0);

    return {
      answer,
      supportingExperiments,
      supportingPapers,
      supportingMeetings,
      supportingDecisions,
      confidence,
      memoryPath: [`Query: "${query}"`, `Source: Cognee Knowledge Graph`, `Matches: ${totalSupport} entities`],
    };
  },

  /**
   * Extract entity references from Cognee results.
   * @private
   */
  _extractEntities(results, entityType) {
    if (!results || !Array.isArray(results)) return [];
    return results
      .filter(r => r && (r.entity_type === entityType || (r.metadata && r.metadata.entity_type === entityType)))
      .map(r => ({
        id: r.entity_id || r.id,
        title: r.title || r.entity_title || 'Unknown',
        relevance: r.score || r.relevance || 0,
      }));
  },
};
