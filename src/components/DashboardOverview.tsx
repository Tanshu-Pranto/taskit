'use client';

import React, { useMemo } from 'react';
import { Task, Category, Priority } from '@/types/task';
import { AlertTriangle, ArrowRight, CalendarClock, CalendarDays, Check, Loader, Plus } from 'lucide-react';

interface DashboardOverviewProps {
  tasks: Task[];
  categories: Category[];
  todayDate: string;
  onSelectTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onViewAllTasks: () => void;
  onOpenCalendar: () => void;
  onAddTaskOnDate: (dateStr: string) => void;
  onFilterByCategory: (categoryName: string) => void;
}

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PRIORITY_WEIGHT: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
const PRIORITY_LABEL: Record<Priority, string> = { urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low' };
const PRIORITY_ORDER: Priority[] = ['urgent', 'high', 'medium', 'low'];
const DAY_MS = 24 * 60 * 60 * 1000;
const AGENDA_DAYS = 7;

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

function dueLabel(dueDate: string, todayDate: string): { text: string; overdue: boolean } {
  if (!dueDate) return { text: 'No due date', overdue: false };
  const diff = Math.round((parseDate(dueDate).getTime() - parseDate(todayDate).getTime()) / DAY_MS);
  if (diff < 0) return { text: `Overdue by ${-diff} day${diff === -1 ? '' : 's'}`, overdue: true };
  if (diff === 0) return { text: 'Due today', overdue: false };
  if (diff === 1) return { text: 'Due tomorrow', overdue: false };
  const d = parseDate(dueDate);
  return { text: `Due ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`, overdue: false };
}

/** Reminders are free text like "09:30 AM"; normalise to 24h "09:30", or null when there's no usable time. */
function toTime24(reminder?: string): string | null {
  const m = reminder?.match(/^\s*(\d{1,2}):(\d{2})\s*([ap]m)?/i);
  if (!m) return null;
  let h = Number(m[1]);
  const meridiem = m[3]?.toLowerCase();
  if (meridiem === 'pm' && h < 12) h += 12;
  if (meridiem === 'am' && h === 12) h = 0;
  return h > 23 ? null : `${String(h).padStart(2, '0')}:${m[2]}`;
}

interface AgendaItem {
  task: Task;
  time: string | null;
}

interface AgendaGroup {
  key: string;
  dateStr: string | null; // null for the overdue group, which spans several dates
  label: string;
  sublabel: string;
  tone?: 'today' | 'danger';
  items: AgendaItem[];
}

function byTime(a: AgendaItem, b: AgendaItem) {
  // Untimed (all-day) tasks lead the day, then chronological.
  return (a.time ?? '').localeCompare(b.time ?? '');
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  tasks,
  categories,
  todayDate,
  onSelectTask,
  onToggleComplete,
  onViewAllTasks,
  onOpenCalendar,
  onAddTaskOnDate,
  onFilterByCategory,
}) => {
  const categoryColor = (name: string) => categories.find((c) => c.name === name)?.color || 'var(--text-muted)';

  const agenda = useMemo<AgendaGroup[]>(() => {
    const groups: AgendaGroup[] = [];

    const overdue = tasks
      .filter((t) => t.status !== 'completed' && t.dueDate && t.dueDate < todayDate)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .map((task) => ({ task, time: toTime24(task.reminder) }));
    if (overdue.length > 0) {
      groups.push({ key: 'overdue', dateStr: null, label: 'Overdue', sublabel: `${overdue.length} open`, tone: 'danger', items: overdue });
    }

    const start = parseDate(todayDate);
    for (let i = 0; i < AGENDA_DAYS; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = toDateStr(d);
      const items = tasks
        .filter((t) => t.dueDate === dateStr)
        .map((task) => ({ task, time: toTime24(task.reminder) }))
        .sort(byTime);
      if (items.length === 0) continue;
      groups.push({
        key: dateStr,
        dateStr,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY_SHORT[d.getDay()],
        sublabel: `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`,
        tone: i === 0 ? 'today' : undefined,
        items,
      });
    }
    return groups;
  }, [tasks, todayDate]);

  const categoryStats = useMemo(() => {
    return categories
      .map((cat) => {
        const catTasks = tasks.filter((t) => t.category === cat.name);
        const done = catTasks.filter((t) => t.status === 'completed').length;
        const pct = catTasks.length > 0 ? Math.round((done / catTasks.length) * 100) : 0;
        return { ...cat, taskCount: catTasks.length, done, pct };
      })
      .filter((c) => c.taskCount > 0)
      .sort((a, b) => b.taskCount - a.taskCount);
  }, [tasks, categories]);

  const open = tasks.filter((t) => t.status !== 'completed');
  const counts = {
    dueToday: open.filter((t) => t.dueDate === todayDate).length,
    overdue: open.filter((t) => t.dueDate && t.dueDate < todayDate).length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    completed: tasks.length - open.length,
  };
  const openByPriority = Object.fromEntries(
    PRIORITY_ORDER.map((p) => [p, open.filter((t) => t.priority === p).length])
  ) as Record<Priority, number>;
  const completionPct = tasks.length > 0 ? Math.round((counts.completed / tasks.length) * 100) : 0;

  // The one task worth doing next: most urgent first, then soonest due.
  const nextTask = useMemo(() => {
    return (
      [...tasks.filter((t) => t.status !== 'completed')].sort(
        (a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority] || (a.dueDate || '9999').localeCompare(b.dueDate || '9999')
      )[0] || null
    );
  }, [tasks]);

  const nextDue = nextTask ? dueLabel(nextTask.dueDate, todayDate) : null;
  const nextSubtasksDone = nextTask ? nextTask.subtasks.filter((s) => s.completed).length : 0;

  const glance = [
    { label: 'Due today', value: counts.dueToday, icon: <CalendarClock size={16} />, tone: undefined },
    { label: 'Overdue', value: counts.overdue, icon: <AlertTriangle size={16} />, tone: counts.overdue > 0 ? 'danger' : undefined },
    { label: 'In progress', value: counts.inProgress, icon: <Loader size={16} />, tone: undefined },
  ];

  const statusSegments = [
    { key: 'completed', label: 'Done', value: counts.completed, color: 'var(--status-completed)' },
    { key: 'in_progress', label: 'In progress', value: counts.inProgress, color: 'var(--status-inprogress)' },
    { key: 'todo', label: 'To do', value: counts.todo, color: 'var(--status-todo)' },
  ];

  return (
    <div className="dash-overview">
      <div className="dash-layout">
        <div className="dash-main">
          {/* Up next + today at a glance */}
          <section className="dash-panel dash-hero dash-rise">
            <div className="dash-next">
              <span className="dash-eyebrow">Up next</span>
              {nextTask && nextDue ? (
                <>
                  <h2 className="dash-next-title">{nextTask.title}</h2>
                  <div className="dash-meta">
                    <span className="dash-meta-item">
                      <span className="dash-dot" style={{ background: `var(--priority-${nextTask.priority})` }} />
                      {PRIORITY_LABEL[nextTask.priority]} priority
                    </span>
                    {nextTask.category && (
                      <span className="dash-meta-item">
                        <span className="dash-dot" style={{ background: categoryColor(nextTask.category) }} />
                        {nextTask.category}
                      </span>
                    )}
                    <span className={`dash-meta-item${nextDue.overdue ? ' is-danger' : ''}`}>
                      {nextDue.overdue && <AlertTriangle size={13} />}
                      {nextDue.text}
                    </span>
                  </div>

                  {nextTask.subtasks.length > 0 ? (
                    <div className="dash-next-progress">
                      <div className="dash-bar">
                        <div className="dash-bar-fill" style={{ width: `${(nextSubtasksDone / nextTask.subtasks.length) * 100}%` }} />
                      </div>
                      <span>
                        {nextSubtasksDone} of {nextTask.subtasks.length} steps
                      </span>
                    </div>
                  ) : (
                    nextTask.description && <p className="dash-next-desc">{nextTask.description}</p>
                  )}

                  <div className="dash-next-actions">
                    <button className="btn btn-primary" onClick={() => onToggleComplete(nextTask.id)}>
                      <Check size={16} />
                      Mark complete
                    </button>
                    <button className="btn btn-secondary" onClick={() => onSelectTask(nextTask)}>
                      Open task
                    </button>
                  </div>
                </>
              ) : (
                <div className="dash-empty">
                  <h2 className="dash-next-title">You&apos;re all caught up.</h2>
                  <p className="dash-next-desc">Nothing open right now. Plan the next thing while it&apos;s quiet.</p>
                  <div className="dash-next-actions">
                    <button className="btn btn-primary" onClick={() => onAddTaskOnDate(todayDate)}>
                      <Plus size={16} />
                      Add a task
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="dash-glance">
              <span className="dash-eyebrow is-muted">Today at a glance</span>
              <ul>
                {glance.map((g) => (
                  <li key={g.label} className={g.tone === 'danger' ? 'is-danger' : undefined}>
                    <span className="dash-glance-icon">{g.icon}</span>
                    <span className="dash-glance-label">{g.label}</span>
                    <span className="dash-glance-value">{g.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Progress + categories */}
          <div className="dash-split">
            <section className="dash-panel dash-rise" style={{ animationDelay: '60ms' }}>
              <header className="dash-panel-head">
                <div>
                  <span className="dash-eyebrow is-muted">Progress</span>
                  <h3 className="dash-panel-title">
                    <span className="dash-big-number">{completionPct}%</span> of tasks done
                  </h3>
                </div>
              </header>

              {tasks.length === 0 ? (
                <p className="dash-muted">Add tasks to see how your work splits across stages.</p>
              ) : (
                <>
                  <div className="dash-stacked" role="img" aria-label={statusSegments.map((s) => `${s.label}: ${s.value}`).join(', ')}>
                    {statusSegments.map((s) =>
                      s.value > 0 ? <span key={s.key} style={{ flexGrow: s.value, background: s.color }} /> : null
                    )}
                  </div>
                  <ul className="dash-legend">
                    {statusSegments.map((s) => (
                      <li key={s.key}>
                        <span className="dash-dot" style={{ background: s.color }} />
                        <span>{s.label}</span>
                        <strong>{s.value}</strong>
                      </li>
                    ))}
                  </ul>

                  <div className="dash-priority">
                    <span className="dash-eyebrow is-muted">Still open, by priority</span>
                    <div className="dash-priority-grid">
                      {PRIORITY_ORDER.map((p) => (
                        <div key={p} className="dash-priority-cell">
                          <span className="dash-priority-label">
                            <span className="dash-dot" style={{ background: `var(--priority-${p})` }} />
                            {PRIORITY_LABEL[p]}
                          </span>
                          <span className="dash-priority-value">{openByPriority[p]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>

            <section className="dash-panel dash-rise" style={{ animationDelay: '120ms' }}>
              <header className="dash-panel-head">
                <div>
                  <span className="dash-eyebrow is-muted">Categories</span>
                  <h3 className="dash-panel-title">Where your work lives</h3>
                </div>
                <button className="dash-link" onClick={onViewAllTasks}>
                  All tasks <ArrowRight size={14} />
                </button>
              </header>

              {categoryStats.length === 0 ? (
                <p className="dash-muted">Give tasks a category to track each area separately.</p>
              ) : (
                <div className="dash-cats">
                  {categoryStats.slice(0, 4).map((cat) => (
                    <button key={cat.id} className="dash-cat" onClick={() => onFilterByCategory(cat.name)}>
                      <span className="dash-cat-row">
                        <span className="dash-cat-name">
                          <span className="dash-dot" style={{ background: cat.color }} />
                          {cat.name}
                        </span>
                        <span className="dash-cat-count">
                          {cat.done}/{cat.taskCount}
                        </span>
                      </span>
                      <span className="dash-bar is-thin">
                        <span className="dash-bar-fill" style={{ width: `${cat.pct}%`, background: cat.color }} />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Agenda — the next 7 days as a timeline, grouped by date */}
        <aside className="dash-panel dash-agenda dash-rise" style={{ animationDelay: '90ms' }} aria-label="Upcoming tasks">
          <header className="dash-panel-head">
            <div>
              <span className="dash-eyebrow is-muted">Calendar</span>
              <h3 className="dash-panel-title">Next {AGENDA_DAYS} days</h3>
            </div>
            <button className="dash-agenda-open" onClick={onOpenCalendar} aria-label="Open calendar" title="Open calendar">
              <CalendarDays size={17} />
            </button>
          </header>

          {agenda.length === 0 ? (
            <div className="dash-agenda-empty">
              <p className="dash-muted">Nothing scheduled for the next {AGENDA_DAYS} days.</p>
              <button className="btn btn-secondary" onClick={() => onAddTaskOnDate(todayDate)}>
                <Plus size={15} />
                Schedule a task
              </button>
            </div>
          ) : (
            <div className="dash-agenda-groups">
              {agenda.map((group) => (
                <section key={group.key} className={`dash-agenda-group${group.tone ? ` is-${group.tone}` : ''}`}>
                  <header className="dash-agenda-date">
                    <span>
                      <strong>{group.label}</strong>
                      <span>{group.sublabel}</span>
                    </span>
                    {group.dateStr && (
                      <button
                        className="dash-agenda-add"
                        onClick={() => onAddTaskOnDate(group.dateStr!)}
                        aria-label={`Add task on ${group.label}, ${group.sublabel}`}
                        title="Add task"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </header>

                  <ul>
                    {group.items.map(({ task, time }) => {
                      const due = group.tone === 'danger' ? parseDate(task.dueDate) : null;
                      return (
                        <li key={task.id}>
                          <button
                            className={`dash-agenda-item${task.status === 'completed' ? ' is-done' : ''}`}
                            onClick={() => onSelectTask(task)}
                          >
                            <span className={`dash-agenda-time${time ? '' : ' is-allday'}`}>
                              {due ? `${due.getDate()} ${MONTH_SHORT[due.getMonth()]}` : time ?? 'All day'}
                            </span>
                            <span className="dash-agenda-bar" style={{ background: categoryColor(task.category) }} />
                            <span className="dash-agenda-text">
                              <span className="dash-agenda-cat">{task.category || 'Uncategorized'}</span>
                              <span className="dash-agenda-title">{task.title}</span>
                            </span>
                            {task.status === 'completed' && <Check size={14} className="dash-agenda-check" aria-label="Completed" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
