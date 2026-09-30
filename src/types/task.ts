export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  tags: string[];
  dueDate: string; // YYYY-MM-DD
  reminder?: string; // e.g. "09:00 AM" or date-time
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
  estimatedHours?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type ViewMode = 'list' | 'kanban' | 'calendar';

export type ActiveTab =
  | 'dashboard'
  | 'tasks'
  | 'today'
  | 'upcoming'
  | 'calendar'
  | 'completed'
  | 'routine'
  | 'categories'
  | 'settings';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface RoutineBlock {
  id: string;
  day: Weekday;
  startTime: string; // "HH:MM", 24-hour
  endTime: string; // "HH:MM", 24-hour, after startTime on the same day
  title: string;
  priority: Priority;
  notes?: string;
}

export type ThemeMode = 'dark' | 'light';

export type SortOption = 'newest' | 'oldest' | 'priority' | 'deadline';

export interface TaskFilter {
  search: string;
  priority: Priority | 'all';
  category: string | 'all';
  status: TaskStatus | 'all';
  dueFilter: 'all' | 'today' | 'upcoming' | 'overdue';
  sortBy: SortOption;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  emailRemindersEnabled: boolean;
  defaultPriority: Priority;
  defaultCategory: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
