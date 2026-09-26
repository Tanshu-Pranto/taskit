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
    <div className="card" style={{ padding: '24px', margin: '0 32px 32px 32px' }}>
      {/* Calendar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
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
            }}
          >
            <CalendarIcon size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              {monthNames[month]} {year}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tasks by scheduled delivery dates
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary" style={{ padding: '6px 14px' }} onClick={handleToday}>
            Today
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={handlePrevMonth}>
            <ChevronLeft size={18} />
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={handleNextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '8px',
          marginBottom: '8px',
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
        }}
      >
        {calendarCells.map((cell, idx) => {
          const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr);

          return (
            <div
              key={`${cell.dateStr}-${idx}`}
              style={{
                minHeight: '110px',
                padding: '8px',
                background: cell.isCurrentMonth ? 'var(--bg-subtle)' : 'transparent',
                opacity: cell.isCurrentMonth ? 1 : 0.4,
                borderRadius: 'var(--radius-sm)',
                border: cell.isToday
                  ? '2px solid var(--primary)'
                  : '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'background var(--transition)',
              }}
            >
              {/* Day header inside cell */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: cell.isToday ? 800 : 600,
                    color: cell.isToday ? 'var(--primary)' : 'var(--text-main)',
                  }}
                >
                  {cell.dayNumber}
                </span>

                {cell.isCurrentMonth && (
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '2px', opacity: 0.5, borderRadius: '4px' }}
                    title={`Add task on ${cell.dateStr}`}
                    onClick={() => onAddTaskOnDate(cell.dateStr)}
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>

              {/* Task Chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
                {dayTasks.map((t) => {
                  const color = getCategoryColor(t.category);
                  const isDone = t.status === 'completed';

                  return (
                    <div
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      style={{
                        padding: '4px 6px',
                        background: 'var(--bg-surface)',
                        borderRadius: '4px',
                        borderLeft: `3px solid ${color}`,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        opacity: isDone ? 0.6 : 1,
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--text-muted)' : 'var(--text-main)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      title={`${t.title} (${t.priority})`}
                    >
                      {t.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
