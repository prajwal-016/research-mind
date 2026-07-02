/**
 * Milestone Service — Scans chronological events to identify major milestones 
 * accomplished in the research lifecycle.
 */
export const milestoneService = {
  /**
   * Scan list of events to detect completed milestones.
   *
   * @param {Array} events - Flat list of all journey events
   * @returns {Array<{ label: string, completed: boolean, date?: string }>} List of milestone items
   */
  getMilestones(events = []) {
    if (!events || events.length === 0) return this._getDefaultMilestones();

    const milestones = [
      { id: 'first_exp', label: 'First Experiment', completed: false },
      { id: 'dataset_created', label: 'Dataset Created', completed: false },
      { id: 'major_discovery', label: 'Major Discovery', completed: false },
      { id: 'decision_approved', label: 'Decision Approved', completed: false },
      { id: 'paper_submitted', label: 'Paper Submitted', completed: false },
      { id: 'pub_accepted', label: 'Publication Accepted', completed: false },
    ];

    // Scan backwards (oldest first) to find the completion date
    const sortedOldestFirst = [...events].reverse();

    sortedOldestFirst.forEach(e => {
      // 1. First Experiment
      if (e.type === 'experiment' && !milestones[0].completed) {
        milestones[0].completed = true;
        milestones[0].date = e.date;
      }
      // 2. Dataset Created
      if (e.type === 'dataset' && !milestones[1].completed) {
        milestones[1].completed = true;
        milestones[1].date = e.date;
      }
      // 3. Major Discovery (Experiment marked as completed/successful, or high priority decision)
      if (
        ((e.type === 'experiment' && (e.status === 'completed' || e.status === 'running')) ||
         (e.type === 'research_decision' && e.status === 'high')) &&
        !milestones[2].completed
      ) {
        milestones[2].completed = true;
        milestones[2].date = e.date;
      }
      // 4. Decision Approved (Approved decision status)
      if (e.type === 'research_decision' && !milestones[3].completed) {
        milestones[3].completed = true;
        milestones[3].date = e.date;
      }
      // 5. Paper Submitted
      if (e.type === 'research_paper' && !milestones[4].completed) {
        milestones[4].completed = true;
        milestones[4].date = e.date;
      }
      // 6. Publication Accepted
      if (e.type === 'publication' && (e.status === 'accepted' || e.status === 'published') && !milestones[5].completed) {
        milestones[5].completed = true;
        milestones[5].date = e.date;
      }
    });

    return milestones;
  },

  _getDefaultMilestones() {
    return [
      { id: 'first_exp', label: 'First Experiment', completed: false },
      { id: 'dataset_created', label: 'Dataset Created', completed: false },
      { id: 'major_discovery', label: 'Major Discovery', completed: false },
      { id: 'decision_approved', label: 'Decision Approved', completed: false },
      { id: 'paper_submitted', label: 'Paper Submitted', completed: false },
      { id: 'pub_accepted', label: 'Publication Accepted', completed: false },
    ];
  }
};
