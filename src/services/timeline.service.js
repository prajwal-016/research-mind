/**
 * Timeline Service — Handles filtering, query matching, and highlight
 * processing for Research Journey events.
 */
export const timelineService = {
  /**
   * Filter journey events list dynamically.
   *
   * @param {Array} events - Complete list of journey events
   * @param {string} searchQuery - Text input query
   * @param {Object} filters - Active selection filters
   * @param {string} filters.projectId - Target project ID to show
   * @param {string} filters.researcherName - Target researcher name to show
   * @param {string} filters.dateRange - Range selection ('month' | 'quarter' | 'all')
   * @param {Array<string>} filters.selectedTypes - Array of visible entity type strings
   * @returns {Array} Filtered and sorted events
   */
  filterEvents(events, searchQuery, filters) {
    if (!events || events.length === 0) return [];

    let filtered = [...events];
    const q = searchQuery?.toLowerCase().trim();

    // 1. Filter by Entity Types
    if (filters.selectedTypes && filters.selectedTypes.length > 0) {
      filtered = filtered.filter(e => filters.selectedTypes.includes(e.type));
    }

    // 2. Filter by Project ID
    if (filters.projectId) {
      filtered = filtered.filter(e => e.projectId === filters.projectId);
    }

    // 3. Filter by Researcher Name
    if (filters.researcherName) {
      filtered = filtered.filter(e => e.researcher.toLowerCase().includes(filters.researcherName.toLowerCase()));
    }

    // 4. Filter by Date Range
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let thresholdDate;

      if (filters.dateRange === 'month') {
        thresholdDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      } else if (filters.dateRange === 'quarter') {
        thresholdDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      }

      if (thresholdDate) {
        filtered = filtered.filter(e => new Date(e.date) >= thresholdDate);
      }
    }

    // 5. Apply Search Query matching (flags highlighted item matching the search)
    if (q) {
      filtered = filtered.map(event => {
        const titleMatch = event.title?.toLowerCase().includes(q);
        const descMatch = event.description?.toLowerCase().includes(q);
        const researcherMatch = event.researcher?.toLowerCase().includes(q);
        
        return {
          ...event,
          isHighlighted: Boolean(titleMatch || descMatch || researcherMatch)
        };
      });
    } else {
      // Clear highlight flags
      filtered = filtered.map(e => ({ ...e, isHighlighted: false }));
    }

    return filtered;
  }
};
