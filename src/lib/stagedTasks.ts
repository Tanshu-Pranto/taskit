import { Task, Category, Priority } from '@/types/task';
import { STORAGE_KEYS } from './storageKeys';
import { INITIAL_CATEGORIES, INITIAL_TASKS, TODAY_DATE } from './initialData';

// Tasks the visitor drafted and dropped into a priority box on the landing
// page, before they ever signed up. Held here until they reach the
// dashboard, then merged in and cleared — see promoteStagedTasks().
const STAGED_TASKS_KEY = 'taskit_staged_tasks_v1';

export interface StagedTask {
  title: string;
  priority: Priority;
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — staged tasks simply won't survive navigation
  }
}

export function stageTask(title: string, priority: Priority) {
  const staged = readJSON<StagedTask[]>(STAGED_TASKS_KEY, []);
  writeJSON(STAGED_TASKS_KEY, [...staged, { title, priority }]);
}

/**
 * Folds any landing-page staged tasks into the dashboard's task list and
 * clears the staging area. Pure localStorage read-modify-write, called
 * synchronously from a click handler (never a mount effect) right before
 * navigating to /dashboard — DashboardApp then just reads the updated
 * STORAGE_KEYS.TASKS entry on its normal first render.
 *
 * Returns how many tasks were imported, for an optional confirmation toast.
 */
export function promoteStagedTasks(): number {
  const staged = readJSON<StagedTask[]>(STAGED_TASKS_KEY, []);
  if (staged.length === 0) return 0;

  const categories = readJSON<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const currentTasks = readJSON<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  const defaultCategory = categories[0]?.name ?? 'Work';

  const newTasks: Task[] = staged.map((s, i) => ({
    id: `task-${Date.now()}-${i}`,
    title: s.title,
    description: '',
    status: 'todo',
    priority: s.priority,
    category: defaultCategory,
    tags: [],
    dueDate: '',
    subtasks: [],
    createdAt: TODAY_DATE,
  }));

  writeJSON(STORAGE_KEYS.TASKS, [...newTasks, ...currentTasks]);
  try {
    localStorage.removeItem(STAGED_TASKS_KEY);
  } catch {
    // ignore — worst case the same tasks import again next visit
  }
  return newTasks.length;
}
