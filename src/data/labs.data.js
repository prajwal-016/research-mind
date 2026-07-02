/**
 * labs.data.js
 * Dummy data for the Labs module.
 */

export const MOCK_LABS = [
  {
    id: 'lab-1',
    name: 'AI & NLP Research Lab',
    institution: 'MIT CSAIL',
    description: 'Advancing the frontiers of natural language processing and large language models.',
    pi: { name: 'Dr. Alice Chen', initials: 'AC' },
    memoryHealth: 94,
    stats: {
      projects: 4,
      researchers: 12,
      papers: 1083,
      experiments: 247,
    },
    tags: ['NLP', 'LLMs', 'Machine Learning'],
    isMember: true,
  },
  {
    id: 'lab-2',
    name: 'Computational Biology Lab',
    institution: 'Stanford University',
    description: 'Applying machine learning to protein structure prediction and genomics.',
    pi: { name: 'Dr. Carol Williams', initials: 'CW' },
    memoryHealth: 82,
    stats: {
      projects: 2,
      researchers: 8,
      papers: 450,
      experiments: 120,
    },
    tags: ['Bioinformatics', 'Genomics', 'AlphaFold'],
    isMember: false,
  },
  {
    id: 'lab-3',
    name: 'Quantum Computing Group',
    institution: 'Caltech',
    description: 'Researching quantum algorithms and error correction for next-generation computing.',
    pi: { name: 'Dr. Richard Feynman', initials: 'RF' },
    memoryHealth: 65,
    stats: {
      projects: 3,
      researchers: 15,
      papers: 320,
      experiments: 80,
    },
    tags: ['Quantum', 'Physics', 'Algorithms'],
    isMember: false,
  },
  {
    id: 'lab-4',
    name: 'Human-Computer Interaction Lab',
    institution: 'Carnegie Mellon University',
    description: 'Exploring novel interfaces, AR/VR, and accessibility technologies.',
    pi: { name: 'Dr. Sarah Connor', initials: 'SC' },
    memoryHealth: 88,
    stats: {
      projects: 5,
      researchers: 10,
      papers: 890,
      experiments: 405,
    },
    tags: ['HCI', 'AR/VR', 'Accessibility'],
    isMember: false,
  },
];
