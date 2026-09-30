'use client';

import React, { useMemo, useState } from 'react';
import { Task, Category } from '@/types/task';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardOverviewProps {
  tasks: Task[];
  categories: Category[];
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

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  tasks,
  categories,
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

  const completed = tasks.filter((t) => t.status === 'completed');
  const activeHighPriority = tasks.filter((t) => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high'));
  const weeklyPct = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

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

  return (
    <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Weekly schedule strip */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => setWeekOffset((w) => w - 1)} title="Previous week">
            <ChevronLeft size={16} />
          </button>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{weekLabel}</h3>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={() => setWeekOffset((w) => w + 1)} title="Next week">
            <ChevronRight size={16} />
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

      {/* Focus, This Week, Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr)', gap: '20px' }}>
        {/* Focus — the single highest-priority open task */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '100%', textAlign: 'left', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Focus
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
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 'auto 0' }}>All clear — nice work!</p>
          )}
        </div>

        {/* This Week — completion rate at a glance */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>This Week</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{weeklyPct}%</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {completed.length} of {tasks.length} done
              </span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ height: '100%', width: `${weeklyPct}%`, background: 'var(--primary)', borderRadius: '999px', boxShadow: 'var(--primary-glow-soft)' }} />
            </div>
          </div>
          {activeHighPriority.length > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
              <strong style={{ color: 'var(--text-main)' }}>{activeHighPriority.length}</strong> high-priority task{activeHighPriority.length === 1 ? '' : 's'} open
            </div>
          )}
        </div>

        {/* Categories — completion by area, replaces a paragraph with a glance */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Categories</h3>
            <button className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '4px 8px' }} onClick={onViewAllTasks}>
              More
            </button>
          </div>

          {categoryStats.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>No categorized tasks yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categoryStats.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onFilterByCategory(cat.name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    font: 'inherit',
                    color: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                      {cat.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{cat.pct}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${cat.pct}%`, background: cat.color, borderRadius: '999px' }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
