'use client';

import React, { useState } from 'react';
import { Task, Category } from '@/types/task';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  categories: Category[];
  onSelectTask: (task: Task) => void;
  onAddTaskOnDate: (dateStr: string) => void;
}

const MAX_VISIBLE_CHIPS = 3;

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  categories,
  onSelectTask,
  onAddTaskOnDate,
}) => {
  // Current view month & year (defaulting to September 2026 or current)
  const [currentDate, setCurrentDate] = useState(() => {
    // Check if tasks have dates, default to 2026-09-01
    return new Date(2026, 8, 1);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 1));
  };

  const getCategoryColor = (catName: string) => {
    const cat = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
    return cat ? cat.color : 'var(--primary)';
  };

  // Build calendar matrix
  const calendarCells: { dayNumber: number; dateStr: string; isCurrentMonth: boolean; isToday: boolean }[] = [];

  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dayNumber: d, dateStr, isCurrentMonth: false, isToday: false });
  }

  // Current month days
  const todayStr = '2026-09-26';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dayNumber: d,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month padding to complete 35 or 42 grid cells
  const remainingCells = (calendarCells.length > 35 ? 42 : 35) - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const m = month + 2 > 12 ? 1 : month + 2;
    const y = month + 2 > 12 ? year + 1 : year;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dayNumber: d, dateStr, isCurrentMonth: false, isToday: false });
  }

  return (
    <div className="card" style={{ padding: '20px', margin: '0 32px 32px 32px' }}>
      {/* Calendar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CalendarIcon size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
              {monthNames[month]} {year}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Tasks by scheduled delivery date
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-pill" style={{ padding: '6px 14px', fontSize: '0.82rem' }} onClick={handleToday}>
            Today
          </button>
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <button className="btn btn-ghost" style={{ padding: '6px 8px', borderRadius: 0 }} onClick={handlePrevMonth} title="Previous month">
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-ghost" style={{ padding: '6px 8px', borderRadius: 0, borderLeft: '1px solid var(--border-color)' }} onClick={handleNextMonth} title="Next month">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Unified grid: weekday header + day cells share one bordered frame */}
      <div className="dash-week-scroll">
        <div style={{ minWidth: '700px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {/* Weekday headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              background: 'var(--bg-subtle)',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            {daysOfWeek.map((day) => (
              <div
                key={day}
                style={{
                  padding: '10px 0',
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
            {calendarCells.map((cell, idx) => {
              const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr);
              const visibleTasks = dayTasks.slice(0, MAX_VISIBLE_CHIPS);
              const hiddenCount = dayTasks.length - visibleTasks.length;
              const col = idx % 7;
              const isLastCol = col === 6;
              const isLastRow = idx >= calendarCells.length - 7;

              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  className={cell.isCurrentMonth ? 'calendar-cell' : undefined}
                  style={{
                    minHeight: '104px',
                    minWidth: 0,
                    padding: '7px',
                    background: cell.isToday ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                    opacity: cell.isCurrentMonth ? 1 : 0.42,
                    borderRight: isLastCol ? 'none' : '1px solid var(--border-color)',
                    borderBottom: isLastRow ? 'none' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    cursor: 'default',
                  }}
                >
                  {/* Day header inside cell */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        fontSize: '0.78rem',
                        fontWeight: cell.isToday ? 800 : 600,
                        color: cell.isToday ? 'var(--primary-text)' : 'var(--text-main)',
                        background: cell.isToday ? 'var(--primary)' : 'transparent',
                      }}
                    >
                      {cell.dayNumber}
                    </span>

                    {cell.isCurrentMonth && (
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '2px', opacity: 0.55, borderRadius: '4px' }}
                        title={`Add task on ${cell.dateStr}`}
                        onClick={() => onAddTaskOnDate(cell.dateStr)}
                      >
                        <Plus size={12} />
                      </button>
                    )}
                  </div>

                  {/* Task Chips */}
                  {visibleTasks.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {visibleTasks.map((t) => {
                        const color = getCategoryColor(t.category);
                        const isDone = t.status === 'completed';

                        return (
                          <div
                            key={t.id}
                            onClick={() => onSelectTask(t)}
                            style={{
                              padding: '3px 6px',
                              background: `color-mix(in srgb, ${color}, transparent 88%)`,
                              borderRadius: '4px',
                              borderLeft: `2px solid ${color}`,
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              opacity: isDone ? 0.55 : 1,
                              textDecoration: isDone ? 'line-through' : 'none',
                              color: isDone ? 'var(--text-muted)' : 'var(--text-main)',
                            }}
                            title={`${t.title} (${t.priority})`}
                          >
                            {t.title}
                          </div>
                        );
                      })}
                      {hiddenCount > 0 && (
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', paddingLeft: '4px', fontWeight: 600 }}>
                          +{hiddenCount} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
