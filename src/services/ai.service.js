/**
 * AI service — stub for Cognee + Google Gemini integration.
 *
 * Replace the placeholder implementations with real API calls
 * once the backend endpoints are defined.
 */

const COGNEE_API_URL = import.meta.env.VITE_COGNEE_API_URL ?? 'http://localhost:8000';
const COGNEE_API_KEY = import.meta.env.VITE_COGNEE_API_KEY ?? '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

/** Common headers for Cognee requests */
const cogneeHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${COGNEE_API_KEY}`,
});

export const aiService = {
  /**
   * Ingest a document or text chunk into Cognee's memory layer.
   * @param {{ content: string, metadata: object }} payload
   * @returns {Promise<object>}
   */
  ingest: async (payload) => {
    const res = await fetch(`${COGNEE_API_URL}/api/v1/ingest`, {
      method: 'POST',
      headers: cogneeHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Cognee ingest failed: ${res.statusText}`);
    return res.json();
  },

  /**
   * Query the Cognee memory layer using natural language.
   * @param {string} query
   * @param {{ top_k?: number, filters?: object }} options
   * @returns {Promise<{ results: Array, answer: string }>}
   */
  query: async (query, options = {}) => {
    const res = await fetch(`${COGNEE_API_URL}/api/v1/query`, {
      method: 'POST',
      headers: cogneeHeaders(),
      body: JSON.stringify({ query, top_k: 10, ...options }),
    });
    if (!res.ok) throw new Error(`Cognee query failed: ${res.statusText}`);
    return res.json();
  },

  /**
   * Generate a summary or completion using Google Gemini.
   * @param {string} prompt
   * @param {{ model?: string, maxTokens?: number }} options
   * @returns {Promise<string>}
   */
  generate: async (prompt, options = {}) => {
    const model = options.model ?? 'gemini-1.5-pro';
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: options.maxTokens ?? 2048 },
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini generate failed: ${res.statusText}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  },
};
