/**
 * Memory Object Builder — constructs structured memory objects
 * from different entity types for ingestion into Cognee.
 *
 * Every memory object contains:
 *   - Entity Type, Entity ID, Title, Summary, Description
 *   - Author, Research Project, Laboratory
 *   - Keywords, Timestamp, Related Entities, Metadata
 */

export const memoryObjectBuilder = {
  /**
   * Build a structured memory object from an entity.
   * @param {string} entityType
   * @param {object} entityData
   * @param {object} [context] - Additional context (project, lab, researcher)
   * @returns {object} Structured memory object
   */
  build(entityType, entityData, context = {}) {
    const base = {
      entity_type: entityType,
      entity_id: entityData.id,
      title: entityData.title || entityData.name || 'Untitled',
      laboratory: context.labName || 'Unknown Lab',
      research_project: context.projectName || 'Unknown Project',
      author: context.authorName || 'Unknown Researcher',
      timestamp: entityData.created_at || new Date().toISOString(),
      keywords: entityData.tags || entityData.keywords || [],
      metadata: entityData.metadata || {},
    };

    // Dispatch to entity-specific builder
    switch (entityType) {
      case 'experiment':
        return { ...base, ...this._buildExperiment(entityData) };
      case 'research_paper':
        return { ...base, ...this._buildResearchPaper(entityData) };
      case 'dataset':
        return { ...base, ...this._buildDataset(entityData) };
      case 'meeting':
        return { ...base, ...this._buildMeeting(entityData) };
      case 'research_decision':
        return { ...base, ...this._buildDecision(entityData) };
      case 'publication':
        return { ...base, ...this._buildPublication(entityData) };
      default:
        return { ...base, summary: entityData.description || '', description: '' };
    }
  },

  /**
   * Convert a memory object to a structured text block for Cognee ingestion.
   * @param {object} memoryObj
   * @returns {string}
   */
  toText(memoryObj) {
    const lines = [
      `=== ${memoryObj.entity_type.toUpperCase().replace('_', ' ')} ==="`,
      `Title: ${memoryObj.title}`,
      `Entity ID: ${memoryObj.entity_id}`,
      `Laboratory: ${memoryObj.laboratory}`,
      `Research Project: ${memoryObj.research_project}`,
      `Author: ${memoryObj.author}`,
    ];

    if (memoryObj.summary) lines.push(`Summary: ${memoryObj.summary}`);
    if (memoryObj.description) lines.push(`Description: ${memoryObj.description}`);
    if (memoryObj.objective) lines.push(`Objective: ${memoryObj.objective}`);
    if (memoryObj.methodology) lines.push(`Methodology: ${memoryObj.methodology}`);
    if (memoryObj.observations) lines.push(`Observations: ${memoryObj.observations}`);
    if (memoryObj.results) lines.push(`Results: ${memoryObj.results}`);
    if (memoryObj.conclusions) lines.push(`Conclusions: ${memoryObj.conclusions}`);
    if (memoryObj.status) lines.push(`Status: ${memoryObj.status}`);
    if (memoryObj.rationale) lines.push(`Rationale: ${memoryObj.rationale}`);
    if (memoryObj.decision_text) lines.push(`Decision: ${memoryObj.decision_text}`);
    if (memoryObj.impact) lines.push(`Impact: ${memoryObj.impact}`);
    if (memoryObj.abstract) lines.push(`Abstract: ${memoryObj.abstract}`);
    if (memoryObj.venue) lines.push(`Venue: ${memoryObj.venue}`);
    if (memoryObj.doi) lines.push(`DOI: ${memoryObj.doi}`);
    if (memoryObj.version) lines.push(`Version: ${memoryObj.version}`);
    if (memoryObj.agenda) lines.push(`Agenda: ${memoryObj.agenda}`);
    if (memoryObj.notes) lines.push(`Notes: ${memoryObj.notes}`);
    if (memoryObj.action_items) lines.push(`Action Items: ${memoryObj.action_items}`);

    if (memoryObj.authors?.length) lines.push(`Authors: ${memoryObj.authors.join(', ')}`);
    if (memoryObj.keywords?.length) lines.push(`Keywords: ${memoryObj.keywords.join(', ')}`);
    if (memoryObj.related_entities?.length) {
      lines.push(`Related Entities: ${memoryObj.related_entities.map(e => `${e.type}:${e.id}`).join(', ')}`);
    }

    lines.push(`Timestamp: ${memoryObj.timestamp}`);

    return lines.join('\n');
  },

  // ─── Entity-specific builders ─────────────────────────────────────────────

  _buildExperiment(data) {
    return {
      summary: data.description || data.hypothesis || '',
      description: data.description || '',
      objective: data.hypothesis || '',
      methodology: data.methodology || '',
      observations: data.notes || '',
      results: data.results || '',
      conclusions: data.conclusions || '',
      status: data.status || 'draft',
      related_entities: [
        data.project_id && { type: 'project', id: data.project_id },
      ].filter(Boolean),
    };
  },

  _buildResearchPaper(data) {
    return {
      summary: data.abstract || '',
      abstract: data.abstract || '',
      authors: data.authors || [],
      venue: data.venue || '',
      doi: data.doi || '',
      published_date: data.published_date || '',
      related_entities: [
        data.project_id && { type: 'project', id: data.project_id },
      ].filter(Boolean),
    };
  },

  _buildDataset(data) {
    return {
      summary: data.description || '',
      description: data.description || '',
      version: data.version || '1.0.0',
      dataset_format: data.dataset_type || 'other',
      size_bytes: data.size_bytes || 0,
      row_count: data.row_count || 0,
      related_entities: [
        data.project_id && { type: 'project', id: data.project_id },
        data.experiment_id && { type: 'experiment', id: data.experiment_id },
      ].filter(Boolean),
    };
  },

  _buildMeeting(data) {
    return {
      summary: data.summary || data.description || '',
      description: data.description || '',
      agenda: data.agenda || '',
      notes: data.notes || '',
      action_items: data.action_items ? JSON.stringify(data.action_items) : '',
      meeting_type: data.meeting_type || 'lab_meeting',
      scheduled_at: data.scheduled_at || '',
      related_entities: [
        data.project_id && { type: 'project', id: data.project_id },
      ].filter(Boolean),
    };
  },

  _buildDecision(data) {
    return {
      summary: data.context || '',
      description: data.context || '',
      decision_text: data.decision || '',
      rationale: data.rationale || '',
      impact: data.impact || '',
      priority: data.priority || 'medium',
      alternatives: data.alternatives ? JSON.stringify(data.alternatives) : '',
      related_entities: [
        data.project_id && { type: 'project', id: data.project_id },
        data.meeting_id && { type: 'meeting', id: data.meeting_id },
      ].filter(Boolean),
    };
  },

  _buildPublication(data) {
    return {
      summary: data.abstract || '',
      abstract: data.abstract || '',
      authors: data.authors || [],
      venue: data.target_venue || '',
      doi: data.doi || '',
      status: data.status || 'draft',
      submitted_at: data.submitted_at || '',
      published_at: data.published_at || '',
      related_entities: [
        data.project_id && { type: 'project', id: data.project_id },
        data.research_paper_id && { type: 'research_paper', id: data.research_paper_id },
      ].filter(Boolean),
    };
  },
};
