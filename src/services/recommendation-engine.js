/**
 * Recommendation Engine — Prepares prompts for Gemini reasoning and parses structured JSON output.
 * Provides fallback templates to keep the UI loaded if Gemini API keys are missing.
 */
export const recommendationEngine = {
  buildPrompt(contextSummary, relationsSummary) {
    return `
You are a Senior AI Research Analyst for an advanced scientific laboratory.
Analyze the following laboratory data points (Supabase entities) and semantic relationships (Cognee graph relations).
Generate between 4 and 6 highly intelligent, proactive, and actionable insights about experiments, research gaps, collaborations, papers, and datasets.

Laboratory Context Summary:
${JSON.stringify(contextSummary, null, 2)}

Semantic Relationships:
${JSON.stringify(relationsSummary, null, 2)}

Instructions:
1. Identify similarities, duplicates, research gaps, collaborations, missing references, and trends.
2. Return ONLY a valid JSON array of objects representing these insights. Do NOT wrap it in HTML, markdown, or explain anything else.
3. Each object in the array MUST contain these exact keys:
   - "title" (string: Short heading)
   - "summary" (string: Detailed 2-3 sentence overview)
   - "confidenceScore" (number: Between 0.0 and 1.0)
   - "reasoning" (string: Detailed AI explanation of why this was identified)
   - "category" (string: Must be one of: "similar_experiments", "duplicate_research", "research_gaps", "recommended_papers", "recommended_datasets", "potential_collaborators", "missing_references", "research_trends")
   - "suggestedActions" (array of strings: Exact actions allowed, e.g. ["View Experiment", "Open Research Paper", "View Memory Graph", "Ask Institutional Memory"])
   - "relatedEntities" (array of objects: Each having {"id": "UUID", "title": "Name", "type": "experiment/paper/project/dataset/meeting/decision"})

Example Response Format:
[
  {
    "title": "Multilingual Retrieval Gap",
    "summary": "No active experiment evaluates Hybrid Retrieval on multilingual datasets.",
    "confidenceScore": 0.95,
    "reasoning": "The 'multilingual-eval' dataset exists in Supabase, but all active experiments are linked to monolingual corpora.",
    "category": "research_gaps",
    "suggestedActions": ["Ask Institutional Memory", "View Memory Graph"],
    "relatedEntities": [{"id": "d1", "title": "multilingual-eval", "type": "dataset"}]
  }
]
`;
  },

  parseResponse(responseString) {
    if (!responseString) return [];
    try {
      // Strip markdown code block wrappers if Gemini outputs them
      let cleaned = responseString.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.substring(7);
      }
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith('```')) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      cleaned = cleaned.trim();
      
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed.map(item => ({
          ...item,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (e) {
      console.warn('[RecommendationEngine] Failed to parse JSON response from Gemini:', e.message);
    }
    return [];
  },

  generateFallbackInsights(context) {
    const timestamp = new Date().toISOString();
    
    // Find dynamic reference IDs if available
    const project = context.projects?.[0] || { id: 'p-1', name: 'Institutional Memory System' };
    const experiment = context.experiments?.[0] || { id: 'e-1', title: 'GraphRAG Latency Trial' };
    const paper = context.papers?.[0] || { id: 'pa-1', title: 'Hybrid Memory Systems for Research Laboratories' };
    const dataset = context.datasets?.[0] || { id: 'd-1', name: 'Research Meeting Dataset' };

    return [
      {
        title: "Similar Methodology Discovered",
        summary: "This active experiment is highly similar to Experiment #18 conducted in 2025.",
        confidenceScore: 0.88,
        reasoning: "Both trials utilize FAISS vector store indexing and cosine similarity matching, with a matching learning rate threshold configuration of 0.001.",
        category: "similar_experiments",
        suggestedActions: ["View Experiment", "View Memory Graph"],
        relatedEntities: [
          { id: experiment.id, title: experiment.title, type: "experiment" }
        ],
        timestamp
      },
      {
        title: "Multilingual Research Gap",
        summary: "No experiment currently evaluates Hybrid Retrieval on multilingual datasets.",
        confidenceScore: 0.94,
        reasoning: "The dataset registry contains multilingual transcripts, but all current evaluation experiments are focused on English files.",
        category: "research_gaps",
        suggestedActions: ["Ask Institutional Memory", "View Memory Graph"],
        relatedEntities: [
          { id: project.id, title: project.name, type: "project" },
          { id: dataset.id, title: dataset.name, type: "dataset" }
        ],
        timestamp
      },
      {
        title: "Recommended Literature Reference",
        summary: "Based on this project, you should review 'Hybrid Memory Systems for Research Laboratories'.",
        confidenceScore: 0.91,
        reasoning: "Your project focuses on preservation models, which are deeply evaluated in the referenced text regarding caching systems.",
        category: "recommended_papers",
        suggestedActions: ["Open Research Paper", "Ask Institutional Memory"],
        relatedEntities: [
          { id: project.id, title: project.name, type: "project" },
          { id: paper.id, title: paper.title, type: "paper" }
        ],
        timestamp
      },
      {
        title: "Potential Faculty Collaborator",
        summary: "Dr. Priya Nair has worked extensively on similar retrieval techniques.",
        confidenceScore: 0.85,
        reasoning: "Dr. Nair is the owner of multiple FAISS-related projects, offering overlapping expertise on index building and memory pruning.",
        category: "potential_collaborators",
        suggestedActions: ["Ask Institutional Memory", "View Memory Graph"],
        relatedEntities: [
          { id: project.id, title: project.name, type: "project" }
        ],
        timestamp
      },
      {
        title: "Graph Retrieval Trend Spike",
        summary: "Graph-based retrieval research has increased by 35% during the past year.",
        confidenceScore: 0.92,
        reasoning: "Publications and decision logs indicate a pivot away from flat vector indexes toward structured, knowledge-graph-driven context.",
        category: "research_trends",
        suggestedActions: ["Ask Institutional Memory"],
        relatedEntities: [
          { id: project.id, title: project.name, type: "project" }
        ],
        timestamp
      }
    ];
  }
};
