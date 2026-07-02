/**
 * Cognee Memory Layer — HTTP client singleton.
 * Communicates with the Cognee REST API for institutional memory operations.
 *
 * Environment variables:
 *   VITE_COGNEE_API_URL  — Base URL of the Cognee server (default: http://localhost:8000)
 *   VITE_COGNEE_API_KEY  — API key or Bearer token for authentication
 */

const COGNEE_API_URL = import.meta.env.VITE_COGNEE_API_URL ?? 'http://localhost:8000';
const COGNEE_API_KEY = import.meta.env.VITE_COGNEE_API_KEY ?? '';

/** Whether the Cognee integration is configured and available */
export const isCogneeConfigured = () => Boolean(COGNEE_API_URL && COGNEE_API_KEY && COGNEE_API_KEY !== 'your-cognee-api-key-here');

/** Common headers for Cognee requests */
const headers = () => ({
  'Content-Type': 'application/json',
  ...(COGNEE_API_KEY ? { Authorization: `Bearer ${COGNEE_API_KEY}` } : {}),
});

/**
 * Makes a request to the Cognee REST API with timeout and error handling.
 * @param {string} endpoint - API endpoint path (e.g. '/api/v1/remember')
 * @param {object} options - fetch options
 * @param {number} [timeoutMs=30000] - Request timeout in milliseconds
 * @returns {Promise<object>} Parsed JSON response
 */
async function cogneeRequest(endpoint, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${COGNEE_API_URL}${endpoint}`, {
      ...options,
      headers: { ...headers(), ...options.headers },
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      throw new CogneeApiError(
        `Cognee API error ${res.status}: ${res.statusText}`,
        res.status,
        errorBody
      );
    }

    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new CogneeApiError('Cognee API request timed out', 408, null);
    }
    if (error instanceof CogneeApiError) throw error;
    throw new CogneeApiError(
      `Cognee API network error: ${error.message}`,
      0,
      null
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Custom error class for Cognee API failures */
export class CogneeApiError extends Error {
  constructor(message, statusCode, responseBody) {
    super(message);
    this.name = 'CogneeApiError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }

  get isTransient() {
    return this.statusCode === 0 || this.statusCode === 408 ||
           this.statusCode === 429 || this.statusCode >= 500;
  }
}

/** The Cognee client object — all REST operations */
export const cogneeClient = {
  /**
   * remember() — Ingest content into Cognee's knowledge graph as permanent memory.
   * @param {string} content - Text content to remember
   * @param {string} [datasetName='researchmind'] - Dataset to store in
   * @returns {Promise<object>}
   */
  remember: async (content, datasetName = 'researchmind') => {
    return cogneeRequest('/api/v1/add', {
      method: 'POST',
      body: JSON.stringify({
        data: content,
        dataset_name: datasetName,
      }),
    });
  },

  /**
   * cognify() — Process ingested data into the knowledge graph.
   * @param {string} [datasetName='researchmind'] - Dataset to process
   * @returns {Promise<object>}
   */
  cognify: async (datasetName = 'researchmind') => {
    return cogneeRequest('/api/v1/cognify', {
      method: 'POST',
      body: JSON.stringify({ dataset_name: datasetName }),
    });
  },

  /**
   * recall() — Query the knowledge graph using natural language.
   * @param {string} query - Natural language question
   * @param {object} [options] - Search options
   * @param {string} [options.searchType='GRAPH_COMPLETION'] - Search type
   * @returns {Promise<object>}
   */
  recall: async (query, options = {}) => {
    return cogneeRequest('/api/v1/search', {
      method: 'POST',
      body: JSON.stringify({
        query_text: query,
        query_type: options.searchType ?? 'GRAPH_COMPLETION',
        ...(options.datasetName ? { dataset_name: options.datasetName } : {}),
      }),
    });
  },

  /**
   * forget() — Remove data from the knowledge graph.
   * @param {string} datasetName - Dataset to remove
   * @returns {Promise<object>}
   */
  forget: async (datasetName) => {
    return cogneeRequest('/api/v1/prune', {
      method: 'DELETE',
      body: JSON.stringify({ dataset_name: datasetName }),
    });
  },

  /**
   * Health check — verify Cognee server is reachable.
   * @returns {Promise<boolean>}
   */
  healthCheck: async () => {
    try {
      await cogneeRequest('/api/v1/settings', { method: 'GET' }, 5000);
      return true;
    } catch {
      return false;
    }
  },
};
