'use client';

import React, { useMemo, useState } from 'react';
import { Task, Category, UserProfile } from '@/types/task';
import {
  Sparkles,
  Bot,
  Target,
  ArrowUpRight,
} from 'lucide-react';

interface DashboardOverviewProps {
  tasks: Task[];
  categories: Category[];
  user: UserProfile;
  todayDate: string;
  onSelectTask: (task: Task) => void;
  onViewAllTasks: () => void;
  onAddTaskOnDate: (dateStr: string) => void;
  onFilterByCategory: (categoryName: string) => void;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const PRIORITY_WEIGHT: Record<Task['priority'], number> = { urgent: 4, high: 3, medium: 2, low: 1 };

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfWeek(dateStr: string, weekOffset: number) {
  const d = new Date(`${dateStr}T00:00:00`);
  const dow = d.getDay(); // 0 = Sunday
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + mondayOffset + weekOffset * 7);
  return d;
}

// Lights up a proportion of a 4x4 matrix-dot grid (see .matrix-grid in globals.css)
const MatrixDots: React.FC<{ pct: number; variant?: 'orange' }> = ({ pct, variant }) => {
  const litCount = Math.round((pct / 100) * 16);
  return (
    <div className="matrix-grid">
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className={`matrix-dot ${i < litCount ? variant || '' : 'inactive'}`} />
      ))}
    </div>
  );
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  tasks,
  categories,
  user,
  todayDate,
  onSelectTask,
  onViewAllTasks,
  onAddTaskOnDate,
  onFilterByCategory,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDays = useMemo(() => {
    const monday = startOfWeek(todayDate, weekOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { date: d, dateStr: toDateStr(d) };
    });
  }, [todayDate, weekOffset]);

  const weekLabel = useMemo(() => {
    const first = weekDays[0]?.date;
    return first ? `${MONTH_NAMES[first.getMonth()]} ${first.getDate()}` : '';
  }, [weekDays]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const day of weekDays) {
      map.set(day.dateStr, tasks.filter((t) => t.dueDate === day.dateStr));
    }
    return map;
  }, [tasks, weekDays]);

  const categoryColor = (name: string) => categories.find((c) => c.name === name)?.color || 'var(--primary)';

  // Category focus: top categories by active task volume, used for the Growth Points panel
  const categoryStats = useMemo(() => {
    return categories
      .map((cat) => {
        const catTasks = tasks.filter((t) => t.category === cat.name);
        const done = catTasks.filter((t) => t.status === 'completed').length;
        const pct = catTasks.length > 0 ? Math.round((done / catTasks.length) * 100) : 0;
        return { ...cat, taskCount: catTasks.length, pct };
      })
      .filter((c) => c.taskCount > 0)
      .sort((a, b) => b.taskCount - a.taskCount);
  }, [tasks, categories]);

  const topCategories = categoryStats.slice(0, 3);

  // Score, main task & insights — all computed from real task data
  const completed = tasks.filter((t) => t.status === 'completed');
  const inProgress = tasks.filter((t) => t.status === 'in_progress');
  const todo = tasks.filter((t) => t.status === 'todo');
  const currentScore = completed.length * 120 + inProgress.length * 40 + todo.length * 10;

  const mainTask = useMemo(() => {
    const active = tasks.filter((t) => t.status !== 'completed');
    return [...active].sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority])[0] || null;
  }, [tasks]);

  const mainTaskProgress = useMemo(() => {
    if (!mainTask) return 0;
    if (mainTask.subtasks.length === 0) return mainTask.status === 'in_progress' ? 55 : 20;
    const done = mainTask.subtasks.filter((s) => s.completed).length;
    return Math.round((done / mainTask.subtasks.length) * 100);
  }, [mainTask]);

  const mainTaskRating = mainTaskProgress >= 80 ? 'Excellent' : mainTaskProgress >= 50 ? 'Good' : 'Needs Focus';

  const activeGoals = tasks.filter((t) => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high'));
  const weeklyPct = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  const insightGoals = useMemo(() => {
    const active = tasks.filter((t) => t.status !== 'completed');
    return [...active].sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]).slice(0, 3);
  }, [tasks]);

  const statusLabel: Record<Task['status'], string> = { todo: 'To Do', in_progress: 'In Progress', completed: 'Done' };
  const statusBadgeClass: Record<Task['status'], string> = {
    todo: 'badge-todo',
    in_progress: 'badge-in_progress',
    completed: 'badge-completed',
  };

  return (
    <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Row 1: Weekly schedule + Growth Points */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(260px, 1fr)', gap: '20px' }}>
        {/* Weekly schedule strip */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <button className="btn btn-secondary btn-pill" style={{ fontSize: '0.78rem', padding: '6px 14px' }} onClick={() => setWeekOffset((w) => w - 1)}>
              Last Week
            </button>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{weekLabel}</h3>
            <button className="btn btn-secondary btn-pill" style={{ fontSize: '0.78rem', padding: '6px 14px' }} onClick={() => setWeekOffset((w) => w + 1)}>
              Next Week
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {weekDays.map((day, i) => {
              const isToday = day.dateStr === todayDate;
              const dayTasks = tasksByDay.get(day.dateStr) || [];
              return (
                <div key={day.dateStr} style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => onAddTaskOnDate(day.dateStr)}
                    title={`Add task on ${day.dateStr}`}
                    style={{
                      flexDirection: 'column',
                      gap: '2px',
                      width: '100%',
                      background: isToday ? 'var(--primary-subtle)' : 'transparent',
                      border: isToday ? '1px solid var(--border-focus)' : '1px solid transparent',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 4px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {DAY_LABELS[i]}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--primary)' : 'var(--text-main)' }}>
                      {day.date.getDate()}
                    </div>
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '54px' }}>
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 600,
                          padding: '4px 6px',
                          borderRadius: '6px',
                          background: t.status === 'completed' ? 'var(--bg-subtle)' : 'var(--primary-subtle)',
                          color: t.status === 'completed' ? 'var(--text-muted)' : 'var(--primary)',
                          textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          borderLeft: `2px solid ${categoryColor(t.category)}`,
                        }}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', paddingLeft: '4px' }}>
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Points — top categories by focus */}
        <div
          className="card"
          style={{
            padding: '22px',
            background: 'var(--growth-gradient)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 18px 0' }}>
            Growth Points
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            {topCategories.length === 0 && (
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>Add tasks to a category to see focus areas.</span>
            )}
            {topCategories.map((cat, i) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="btn btn-pill"
                  onClick={() => onFilterByCategory(cat.name)}
                  style={{
                    background: 'rgba(3, 21, 13, 0.55)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '9px 18px',
                    border: '1px solid rgba(255,255,255,0.14)',
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'left',
                  }}
                >
                  {cat.name}
                </button>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff', minWidth: '32px', textAlign: 'right' }}>
                  {cat.pct}%
                </span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === 0 ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    flexShrink: 0,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Categories, Score/Main task, AI Co-pilot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(200px, 0.8fr) minmax(0, 1.1fr)', gap: '20px' }}>
        {/* Categories */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Categories</h3>
            <button className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '4px 8px' }} onClick={onViewAllTasks}>
              More
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
            {categoryStats.map((cat) => (
              <button
                key={cat.id}
                className="tag-pill"
                onClick={() => onFilterByCategory(cat.name)}
                style={{ cursor: 'pointer', border: `1px solid ${cat.color}55` }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cat.color }} />
                {cat.name}
                <span style={{ color: 'var(--text-muted)' }}>· {cat.taskCount}</span>
              </button>
            ))}
          </div>

          <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Weekly Focus
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {topCategories[0]
                ? `Most of your effort this week is going into ${topCategories[0].name}, at ${topCategories[0].pct}% complete. Keep the momentum going, ${user.name.split(' ')[0]}.`
                : `Add a few tasks to your categories to see your weekly focus here, ${user.name.split(' ')[0]}.`}
            </p>
          </div>
        </div>

        {/* Score + Main Task */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '10px' }}>
              Current Score
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{currentScore}</div>
              <MatrixDots pct={Math.min(100, (currentScore / 1000) * 100)} />
            </div>
          </div>

          <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
            <div style={{ width: '100%', textAlign: 'left', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Main Task
            </div>
            {mainTask ? (
              <>
                <div style={{ position: 'relative', width: '132px', height: '76px', marginTop: '4px' }}>
                  <svg width="132" height="76" viewBox="0 0 132 76">
                    <path d="M 14 70 A 52 52 0 0 1 118 70" fill="none" stroke="var(--bg-subtle)" strokeWidth="11" strokeLinecap="round" />
                    <path
                      d="M 14 70 A 52 52 0 0 1 118 70"
                      fill="none"
                      stroke="url(#mainTaskGaugeGradient)"
                      strokeWidth="11"
                      strokeLinecap="round"
                      strokeDasharray={163.36}
                      strokeDashoffset={163.36 * (1 - mainTaskProgress / 100)}
                    />
                    <defs>
                      <linearGradient id="mainTaskGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff7e36" />
                        <stop offset="60%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#00f59b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1 }}>{mainTaskProgress}%</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--primary)', fontWeight: 700 }}>{mainTaskRating}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, margin: '8px 0 12px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                  {mainTask.title}
                </div>
                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => onSelectTask(mainTask)}>
                  Details
                </button>
              </>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No active tasks — nice work!</p>
            )}
          </div>
        </div>

        {/* AI Co-pilot */}
        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Bot size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>AI Co-pilot</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            A strategic review of your performance metrics and milestones is ready.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Target size={13} color="var(--text-muted)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Goals</span>
            <span className="badge badge-medium">{activeGoals.length}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 10px 0' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: 800 }}>{weeklyPct}%</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>this week</span>
          </div>

          <MatrixDots pct={weeklyPct} variant="orange" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' }}>
            {insightGoals.length === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>All goals complete. <Sparkles size={12} style={{ verticalAlign: '-1px' }} /></span>
            )}
            {insightGoals.map((t, i) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, flexShrink: 0 }}>
                  {i === 0 ? 'Primary' : `Goal ${i + 1}`}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {t.title}
                </span>
                <span className={`badge ${statusBadgeClass[t.status]}`} style={{ flexShrink: 0 }}>
                  {statusLabel[t.status]}
                </span>
              </div>
            ))}
          </div>

          <button
            className="btn btn-ghost"
            style={{ marginTop: '14px', fontSize: '0.78rem', padding: '4px 0', color: 'var(--primary)' }}
            onClick={onViewAllTasks}
          >
            View all tasks <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
