/**
 * dashboard.data.js
 * Clean production parameters for Home Dashboard.
 */

// ─── Current user (mock) ─────────────────────────────────────────────────────
export const MOCK_USER = {
  full_name:   'Dr. Alice Chen',
  position:    'Associate Professor',
  institution: 'MIT CSAIL',
  avatar_url:  null,
  lab_name:    'AI & NLP Research Lab',
};

// ─── Memory Health Cards ──────────────────────────────────────────────────────
export const MEMORY_HEALTH_CARDS = [
  {
    id:       'experiments',
    label:    'Experiments',
    value:    0,
    change:   0,
    trend:    'neutral',
    period:   'this month',
    icon:     'FlaskConical',
    color:    'violet',
    subtext:  '0 running',
  },
  {
    id:       'papers',
    label:    'Research Papers',
    value:    0,
    change:   0,
    trend:    'neutral',
    period:   'this month',
    icon:     'FileText',
    color:    'blue',
    subtext:  '0 added',
  },
  {
    id:       'decisions',
    label:    'Key Decisions',
    value:    0,
    change:   0,
    trend:    'neutral',
    period:   'this month',
    icon:     'Lightbulb',
    color:    'amber',
    subtext:  '0 reviews',
  },
  {
    id:       'meetings',
    label:    'Meeting Notes',
    value:    0,
    change:   0,
    trend:    'neutral',
    period:   'this month',
    icon:     'Users',
    color:    'emerald',
    subtext:  '0 scheduled',
  },
  {
    id:       'datasets',
    label:    'Datasets',
    value:    0,
    change:   0,
    trend:    'neutral',
    period:   'this month',
    icon:     'Database',
    color:    'pink',
    subtext:  '0 Bytes stored',
  },
  {
    id:       'memory_score',
    label:    'Memory Score',
    value:    '0%',
    change:   0,
    trend:    'neutral',
    period:   'vs last month',
    icon:     'Brain',
    color:    'purple',
    subtext:  'Sync pending',
  },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────
export const RECENT_ACTIVITY = [];

// ─── AI Insights ──────────────────────────────────────────────────────────────
export const AI_INSIGHTS = [];

// ─── Quick Actions ────────────────────────────────────────────────────────────
export const QUICK_ACTIONS = [
  {
    id:       'qa-experiment',
    label:    'Log Experiment',
    icon:     'FlaskConical',
    color:    'violet',
    href:     '/experiments',
    shortcut: '⌘E',
  },
  {
    id:       'qa-paper',
    label:    'Add Paper',
    icon:     'FileText',
    color:    'blue',
    href:     '/papers',
    shortcut: '⌘P',
  },
  {
    id:       'qa-meeting',
    label:    'Record Meeting',
    icon:     'Users',
    color:    'emerald',
    href:     '/meetings',
    shortcut: '⌘M',
  },
  {
    id:       'qa-decision',
    label:    'Log Decision',
    icon:     'Lightbulb',
    color:    'amber',
    href:     '/knowledge-base',
    shortcut: '⌘D',
  },
  {
    id:       'qa-dataset',
    label:    'Upload Dataset',
    icon:     'Database',
    color:    'pink',
    href:     '/experiments',
    shortcut: '⌘U',
  },
  {
    id:       'qa-query',
    label:    'Ask AI',
    icon:     'MessageCircle',
    color:    'purple',
    href:     '/knowledge-base',
    shortcut: '⌘K',
  },
];

// ─── Sparkline chart data (last 7 days) ──────────────────────────────────────
export const SPARKLINE_DATA = {
  experiments: [0, 0, 0, 0, 0, 0, 0],
  papers:      [0, 0, 0, 0, 0, 0, 0],
  decisions:   [0, 0, 0, 0, 0, 0, 0],
  meetings:    [0, 0, 0, 0, 0, 0, 0],
};

// ─── Memory health ring chart ────────────────────────────────────────────────
export const MEMORY_BREAKDOWN = [
  { label: 'Experiments', value: 0, color: '#7c3aed' },
  { label: 'Papers',      value: 0, color: '#2563eb' },
  { label: 'Meetings',    value: 0, color: '#059669' },
  { label: 'Decisions',   value: 0, color: '#d97706' },
  { label: 'Datasets',    value: 0, color: '#db2777' },
];

// ─── Upcoming / scheduled ────────────────────────────────────────────────────
export const UPCOMING_EVENTS = [];
