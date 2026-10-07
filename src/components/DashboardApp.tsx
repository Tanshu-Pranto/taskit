'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Task,
  Category,
  UserProfile,
  ActiveTab,
  ViewMode,
  ThemeMode,
  Priority,
  TaskStatus,
  SortOption,
  ToastMessage,
  RoutineBlock,
  Weekday,
} from '@/types/task';
import { INITIAL_TASKS, INITIAL_CATEGORIES, INITIAL_USER, INITIAL_ROUTINE_BLOCKS, DEFAULT_WAKE_TIME, TODAY_DATE } from '@/lib/initialData';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { useDeadlineReminders, DeadlineReminder } from '@/lib/reminders';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardOverview } from '@/components/DashboardOverview';
import { FilterControls } from '@/components/FilterControls';
import { ListView } from '@/components/ListView';
import { KanbanBoard } from '@/components/KanbanBoard';
import { CalendarView } from '@/components/CalendarView';
import { RoutineView } from '@/components/RoutineView';
import { RoutineBlockModal } from '@/components/RoutineBlockModal';
import { CategoriesView } from '@/components/CategoriesView';
import { SettingsView } from '@/components/SettingsView';
import { TaskModal } from '@/components/TaskModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Toast } from '@/components/Toast';

export function DashboardApp() {
  const router = useRouter();

  // App core state — persisted to localStorage, synced via useSyncExternalStore
  const [tasks, setTasks] = useLocalStorageState<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  const [categories, setCategories] = useLocalStorageState<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const [user, setUser] = useLocalStorageState<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
  const [theme, setTheme] = useLocalStorageState<ThemeMode>(STORAGE_KEYS.THEME, 'dark');
  const [routineBlocks, setRoutineBlocks] = useLocalStorageState<RoutineBlock[]>(STORAGE_KEYS.ROUTINE_BLOCKS, INITIAL_ROUTINE_BLOCKS);
  const [wakeTime, setWakeTime] = useLocalStorageState<string>(STORAGE_KEYS.WAKE_TIME, DEFAULT_WAKE_TIME);

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dueFilter, setDueFilter] = useState<'all' | 'today' | 'upcoming' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>('todo');
  const [defaultTaskDueDate, setDefaultTaskDueDate] = useState<string | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  // Bumped on every open so TaskModal remounts with fresh field state instead of syncing via effect
  const [taskModalKey, setTaskModalKey] = useState(0);

  const openNewTaskModal = (status: TaskStatus = 'todo', dueDate?: string) => {
    setEditingTask(null);
    setDefaultTaskStatus(status);
    setDefaultTaskDueDate(dueDate ?? null);
    setTaskModalKey((k) => k + 1);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setTaskModalKey((k) => k + 1);
    setIsTaskModalOpen(true);
  };

  // Routine block modal
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);
  const [defaultBlockDay, setDefaultBlockDay] = useState<Weekday>('mon');
  const [defaultBlockStart, setDefaultBlockStart] = useState('07:00');
  const [routineModalKey, setRoutineModalKey] = useState(0);

  const openNewRoutineBlock = (day: Weekday, startTime: string) => {
    setEditingBlock(null);
    setDefaultBlockDay(day);
    setDefaultBlockStart(startTime);
    setRoutineModalKey((k) => k + 1);
    setIsRoutineModalOpen(true);
  };

  const openEditRoutineBlock = (block: RoutineBlock) => {
    setEditingBlock(block);
    setRoutineModalKey((k) => k + 1);
    setIsRoutineModalOpen(true);
  };

  const handleSaveRoutineBlock = (data: Omit<RoutineBlock, 'id'>, blockId?: string) => {
    if (blockId) {
      setRoutineBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, ...data } : b)));
      addToast('Routine block updated');
    } else {
      setRoutineBlocks((prev) => [...prev, { ...data, id: `rt-${Date.now()}` }]);
      addToast('Added to your routine');
    }
  };

  const handleDeleteRoutineBlock = (blockId: string) => {
    setRoutineBlocks((prev) => prev.filter((b) => b.id !== blockId));
    addToast('Removed from your routine', 'info');
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Deadline reminders — in-app only (see Settings > Notifications for why
  // there's no real email yet: this app has no backend to send from).
  const [notifications, setNotifications] = useState<DeadlineReminder[]>([]);
  useDeadlineReminders(tasks, TODAY_DATE, user.notificationsEnabled, (reminder) => {
    setNotifications((prev) => [reminder, ...prev].slice(0, 20));
    addToast(
      `"${reminder.taskTitle}" is due ${reminder.kind === 'due-today' ? 'today' : 'tomorrow'}`,
      reminder.kind === 'due-today' ? 'warning' : 'info',
    );
  });

  // Keep the <html> element's data-theme attribute (used by the CSS design system) in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle Theme Toggle
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        setIsTaskModalOpen(false);
        setDetailTask(null);
        setTaskToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task Counts for Sidebar
  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      today: tasks.filter((t) => t.dueDate === TODAY_DATE && t.status !== 'completed').length,
      upcoming: tasks.filter((t) => t.dueDate > TODAY_DATE && t.status !== 'completed').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
  }, [tasks]);

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Tab-specific filters
        if (activeTab === 'today') {
          if (task.dueDate !== TODAY_DATE) return false;
        } else if (activeTab === 'upcoming') {
          if (task.dueDate <= TODAY_DATE || task.status === 'completed') return false;
        } else if (activeTab === 'completed') {
          if (task.status !== 'completed') return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description.toLowerCase().includes(q);
          const matchCat = task.category.toLowerCase().includes(q);
          const matchTags = task.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false;
        }

        // Category
        if (selectedCategory !== 'all' && task.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Priority
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
          return false;
        }

        // Status
        if (selectedStatus !== 'all' && task.status !== selectedStatus) {
          return false;
        }

        // Due Filter
        if (dueFilter === 'today') {
          if (task.dueDate !== TODAY_DATE) return false;
        } else if (dueFilter === 'upcoming') {
          if (task.dueDate <= TODAY_DATE) return false;
        } else if (dueFilter === 'overdue') {
          if (task.dueDate >= TODAY_DATE || task.status === 'completed') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
        if (sortBy === 'oldest') return (a.createdAt || '').localeCompare(b.createdAt || '');
        if (sortBy === 'deadline') return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        if (sortBy === 'priority') {
          const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return 0;
      });
  }, [tasks, activeTab, searchQuery, selectedCategory, selectedPriority, selectedStatus, dueFilter, sortBy]);

  // Task Operations
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt'>,
    taskId?: string
  ) => {
    if (taskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...taskData } : t))
      );
      if (detailTask && detailTask.id === taskId) {
        setDetailTask({ ...detailTask, ...taskData });
      }
      addToast('Task updated successfully');
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: TODAY_DATE,
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast('New task created');
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? TODAY_DATE : undefined,
          };
        }
        return t;
      })
    );
    if (detailTask && detailTask.id === taskId) {
      setDetailTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    addToast(`Task marked as ${newStatus.replace('_', ' ')}`);
  };

  const handleToggleComplete = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const nextStatus: TaskStatus = target.status === 'completed' ? 'todo' : 'completed';
    handleUpdateStatus(taskId, nextStatus);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
          };
        }
        return t;
      })
    );
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
    if (detailTask && detailTask.id === taskToDelete) {
      setDetailTask(null);
    }
    setTaskToDelete(null);
    addToast('Task removed from workspace', 'info');
  };

  // Categories Operations
  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const cat: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, cat]);
    addToast(`Category "${newCat.name}" added`);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    addToast('Category removed', 'info');
  };

  // User Profile
  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    addToast('Profile preferences updated');
  };

  const handleLogout = () => {
    router.push('/');
  };

  // Data Reset & Export
  const handleResetData = () => {
    if (confirm('Are you sure you want to restore default sample tasks and categories?')) {
      setTasks(INITIAL_TASKS);
      setCategories(INITIAL_CATEGORIES);
      setUser(INITIAL_USER);
      setRoutineBlocks(INITIAL_ROUTINE_BLOCKS);
      setWakeTime(DEFAULT_WAKE_TIME);
      localStorage.clear();
      addToast('Reset to default sample data', 'info');
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-export-${TODAY_DATE}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Tasks exported to JSON file');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-main)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        categories={categories}
        taskCounts={taskCounts}
        onNewTaskClick={() => openNewTaskModal()}
      />

      {/* Main App Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'clip' }}>
        {/* Header */}
        <DashboardHeader
          userName={user.name}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewTask={() => openNewTaskModal()}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
        />

        {/* Dynamic Tab Body */}
        <main style={{ flex: 1, padding: '24px 0' }}>
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              tasks={tasks}
              categories={categories}
              todayDate={TODAY_DATE}
              onSelectTask={(task) => setDetailTask(task)}
              onToggleComplete={handleToggleComplete}
              onViewAllTasks={() => setActiveTab('tasks')}
              onAddTaskOnDate={(dateStr) => openNewTaskModal('todo', dateStr)}
              onFilterByCategory={(catName) => {
                setSelectedCategory(catName);
                setActiveTab('tasks');
              }}
            />
          )}

          {/* TAB 2, 3, 4, 6: TASKS / TODAY / UPCOMING / COMPLETED */}
          {(activeTab === 'tasks' || activeTab === 'today' || activeTab === 'upcoming' || activeTab === 'completed') && (
            <div>
              {/* Filter controls */}
              <FilterControls
                viewMode={viewMode}
                onViewChange={setViewMode}
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                dueFilter={dueFilter}
                onDueFilterChange={setDueFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                categories={categories}
                hideStatusFilter={activeTab === 'completed'}
              />

              {/* Views */}
              {viewMode === 'list' && (
                <ListView
                  tasks={filteredTasks}
                  categories={categories}
                  onToggleComplete={handleToggleComplete}
                  onUpdateStatus={handleUpdateStatus}
                  onEditTask={openEditTaskModal}
                  onDeleteTask={(id) => setTaskToDelete(id)}
                  onSelectTask={(task) => setDetailTask(task)}
                  onNewTaskClick={() => openNewTaskModal()}
                />
              )}

              {viewMode === 'kanban' && (
                <KanbanBoard
                  tasks={filteredTasks}
                  categories={categories}
                  onUpdateStatus={handleUpdateStatus}
                  onEditTask={openEditTaskModal}
                  onDeleteTask={(id) => setTaskToDelete(id)}
                  onSelectTask={(task) => setDetailTask(task)}
                  onQuickAdd={(st) => openNewTaskModal(st)}
                />
              )}

              {viewMode === 'calendar' && (
                <CalendarView
                  tasks={tasks}
                  categories={categories}
                  onSelectTask={(task) => setDetailTask(task)}
                  onAddTaskOnDate={(dateStr) => openNewTaskModal('todo', dateStr)}
                />
              )}
            </div>
          )}

          {/* TAB 5: CALENDAR FULL TAB */}
          {activeTab === 'calendar' && (
            <CalendarView
              tasks={tasks}
              categories={categories}
              onSelectTask={(task) => setDetailTask(task)}
              onAddTaskOnDate={(dateStr) => openNewTaskModal('todo', dateStr)}
            />
          )}

          {/* TAB 6: WEEKLY ROUTINE */}
          {activeTab === 'routine' && (
            <RoutineView
              blocks={routineBlocks}
              wakeTime={wakeTime}
              onWakeTimeChange={setWakeTime}
              onAddBlock={openNewRoutineBlock}
              onEditBlock={openEditRoutineBlock}
            />
          )}

          {/* TAB 7: CATEGORIES */}
          {activeTab === 'categories' && (
            <CategoriesView
              categories={categories}
              tasks={tasks}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onFilterByCategory={(catName) => {
                setSelectedCategory(catName);
                setActiveTab('tasks');
              }}
            />
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView
              user={user}
              categories={categories}
              onUpdateUser={handleUpdateUser}
              theme={theme}
              onThemeChange={handleThemeChange}
              onResetData={handleResetData}
              onExportData={handleExportData}
            />
          )}
        </main>
      </div>

      {/* Task Creation & Editing Modal */}
      <TaskModal
        key={taskModalKey}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultStatus={defaultTaskStatus}
        defaultDueDate={defaultTaskDueDate}
        categories={categories}
      />

      {/* Routine Block Creation & Editing Modal */}
      <RoutineBlockModal
        key={routineModalKey}
        isOpen={isRoutineModalOpen}
        onClose={() => {
          setIsRoutineModalOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSaveRoutineBlock}
        onDelete={handleDeleteRoutineBlock}
        initialBlock={editingBlock}
        defaultDay={defaultBlockDay}
        defaultStartTime={defaultBlockStart}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={detailTask}
        onClose={() => setDetailTask(null)}
        onEdit={(task) => {
          setDetailTask(null);
          openEditTaskModal(task);
        }}
        onDelete={(id) => setTaskToDelete(id)}
        onToggleSubtask={handleToggleSubtask}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Destructive Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmText="Delete Task"
        cancelText="Keep Task"
        onConfirm={confirmDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
