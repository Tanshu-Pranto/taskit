import { Task, Category, UserProfile, RoutineBlock } from '@/types/task';

// The app's simulated "today" — every seeded due date, sort and overdue check
// is anchored to this instead of the real clock, so the demo data stays coherent.
export const TODAY_DATE = '2026-09-26';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Product', color: '#2dd4bf', icon: 'Sparkles' },
  { id: 'cat-2', name: 'Design', color: '#38bdf8', icon: 'Palette' },
  { id: 'cat-3', name: 'Engineering', color: '#a78bfa', icon: 'Cpu' },
  { id: 'cat-4', name: 'Strategy', color: '#fbbf24', icon: 'Compass' },
  { id: 'cat-5', name: 'Personal', color: '#34d399', icon: 'User' },
];

export const INITIAL_USER: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@taskit.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  role: 'Product Lead',
  theme: 'dark',
  notificationsEnabled: true,
  emailRemindersEnabled: false,
  defaultPriority: 'medium',
  defaultCategory: 'Product',
};

export const DEFAULT_WAKE_TIME = '07:00';

export const INITIAL_ROUTINE_BLOCKS: RoutineBlock[] = [
  { id: 'rt-1', day: 'mon', startTime: '07:00', endTime: '07:30', title: 'Wake up & stretch', priority: 'low' },
  { id: 'rt-2', day: 'mon', startTime: '09:00', endTime: '10:30', title: 'Chemistry Lecture', priority: 'high' },
  { id: 'rt-3', day: 'mon', startTime: '14:00', endTime: '15:30', title: 'Study Group', priority: 'medium' },
  { id: 'rt-4', day: 'wed', startTime: '07:00', endTime: '07:30', title: 'Wake up & stretch', priority: 'low' },
  { id: 'rt-5', day: 'wed', startTime: '10:00', endTime: '11:30', title: 'Algorithms Lab', priority: 'urgent' },
  { id: 'rt-6', day: 'fri', startTime: '07:00', endTime: '07:30', title: 'Wake up & stretch', priority: 'low' },
  { id: 'rt-7', day: 'fri', startTime: '18:00', endTime: '19:00', title: 'Gym', priority: 'medium' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize Q4 Product Roadmap & Sprint Milestones',
    description: 'Synthesize engineering velocity metrics and align cross-functional teams for the upcoming core release.',
    status: 'in_progress',
    priority: 'urgent',
    category: 'Product',
    tags: ['Roadmap', 'Sprint', 'Leadership'],
    dueDate: '2026-09-26',
    reminder: '09:30 AM',
    createdAt: '2026-09-22',
    estimatedHours: 4,
    subtasks: [
      { id: 'sub-1', title: 'Synthesize customer interview feedback', completed: true },
      { id: 'sub-2', title: 'Review architecture RFC with tech leads', completed: true },
      { id: 'sub-3', title: 'Publish executive briefing summary', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Audit Design System & Contrast Ratios',
    description: 'Review dark mode elevation cards, neon focus rings, and WCAG AAA compliance across all desktop screens.',
    status: 'todo',
    priority: 'high',
    category: 'Design',
    tags: ['Design System', 'WCAG', 'Figma'],
    dueDate: '2026-09-26',
    reminder: '02:00 PM',
    createdAt: '2026-09-24',
    estimatedHours: 3,
    subtasks: [
      { id: 'sub-4', title: 'Audit primary and secondary neon CTA tokens', completed: false },
      { id: 'sub-5', title: 'Validate glassmorphic card backdrop blur', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: 'Deploy Production Cloud Infrastructure',
    description: 'Configure multi-region caching, edge redirects, and synthetic uptime monitors on Vercel.',
    status: 'in_progress',
    priority: 'high',
    category: 'Engineering',
    tags: ['DevOps', 'Next.js', 'Turbopack'],
    dueDate: '2026-09-28',
    reminder: '11:00 AM',
    createdAt: '2026-09-21',
    estimatedHours: 6,
    subtasks: [
      { id: 'sub-6', title: 'Set up edge middleware security headers', completed: true },
      { id: 'sub-7', title: 'Verify bundle size thresholds under 100KB', completed: false },
    ],
  },
  {
    id: 'task-4',
    title: 'Review Machine Learning Attention Paper',
    description: 'Summarize sparse attention breakthroughs and draft implementation notes for internal AI Co-pilot.',
    status: 'todo',
    priority: 'medium',
    category: 'Strategy',
    tags: ['Research', 'AI Co-pilot'],
    dueDate: '2026-09-27',
    reminder: '10:00 AM',
    createdAt: '2026-09-23',
    estimatedHours: 2.5,
    subtasks: [
      { id: 'sub-8', title: 'Analyze latency benchmark graphs', completed: false },
      { id: 'sub-9', title: 'Draft context-window scalability memo', completed: false },
    ],
  },
  {
    id: 'task-5',
    title: 'Weekly 5K Trail Run & Recovery Session',
    description: 'Endurance conditioning and mobility work to maintain focus, high stamina, and mental clarity.',
    status: 'completed',
    priority: 'low',
    category: 'Personal',
    tags: ['Fitness', 'Cardio', 'Health'],
    dueDate: '2026-09-26',
    completedAt: '2026-09-26',
    createdAt: '2026-09-25',
    estimatedHours: 1,
    subtasks: [
      { id: 'sub-10', title: 'Dynamic stretch & warm-up', completed: true },
      { id: 'sub-11', title: '5.2 km trail loop at target cadence', completed: true },
    ],
  },
  {
    id: 'task-6',
    title: 'Weekly Groceries & Organic Restock',
    description: 'Visit local farmers market for cold-pressed greens, sourdough, and single-origin roast coffee.',
    status: 'completed',
    priority: 'low',
    category: 'Personal',
    tags: ['Errands', 'Routine'],
    dueDate: '2026-09-25',
    completedAt: '2026-09-25',
    createdAt: '2026-09-24',
    estimatedHours: 1.5,
    subtasks: [
      { id: 'sub-12', title: 'Sourdough bread & farm eggs', completed: true },
      { id: 'sub-13', title: 'Fresh mint tea & roasted beans', completed: true },
    ],
  },
  {
    id: 'task-7',
    title: 'Quarterly Strategic Growth & Budget Review',
    description: 'Evaluate recurring tool stack ROI and optimize operational resource allocations for next quarter.',
    status: 'todo',
    priority: 'medium',
    category: 'Strategy',
    tags: ['Finance', 'Strategy'],
    dueDate: '2026-09-30',
    createdAt: '2026-09-24',
    estimatedHours: 2,
    subtasks: [],
  },
];
