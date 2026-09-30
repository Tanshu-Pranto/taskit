'use client';

import React from 'react';
import { Task, TaskStatus, Category } from '@/types/task';
import {
  CheckCircle,
  Circle,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { Mascot } from './Mascot';

interface ListViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (taskId: string) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onNewTaskClick: () => void;
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  categories,
  onToggleComplete,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onSelectTask,
  onNewTaskClick,
}) => {
  const getCategoryColor = (catName: string) => {
    const cat = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
    return cat ? cat.color : 'var(--primary)';
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    if (status === 'completed' || !dueDate) return false;
    const today = '2026-09-26';
    return dueDate < today;
  };

  if (tasks.length === 0) {
    return (
      <div
        className="card"
        style={{
          margin: '0 32px 32px 32px',
          padding: '64px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Mascot size={88} mood="sleepy" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
          No tasks yet
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '360px', marginBottom: '20px' }}>
          Create your first task and start organizing your day.
        </p>
        <button
          className="btn btn-primary"
          onClick={onNewTaskClick}
        >
          <Plus size={16} />
          <span>Create Task</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        margin: '0 32px 32px 32px',
        overflow: 'hidden',
        background: 'var(--bg-surface)',
      }}
    >
      {/* Below ~760px the fixed columns no longer fit — scroll the table
          horizontally instead of letting the title column collapse to 0
          and let its tags overflow onto the columns beside it. */}
      <div style={{ overflowX: 'auto' }}>
      {/* Table Header */}
      <div
        className="hide-mobile"
        style={{
          display: 'grid',
          gridTemplateColumns: '40px minmax(180px, 1fr) 130px 110px 140px 110px 90px',
          gap: '12px',
          padding: '12px 20px',
          background: 'var(--bg-subtle)',
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          minWidth: '760px',
        }}
      >
        <div></div>
        <div>Task & Tags</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Category</div>
        <div>Due Date</div>
        <div style={{ textAlign: 'right' }}>Actions</div>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map((task) => {
          const isDone = task.status === 'completed';
          const overdue = isOverdue(task.dueDate, task.status);
          const catColor = getCategoryColor(task.category);

          return (
            <div
              key={task.id}
              className="card-interactive"
              style={{
                display: 'grid',
                gridTemplateColumns: '40px minmax(180px, 1fr) 130px 110px 140px 110px 90px',
                gap: '12px',
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: '1px solid var(--border-color)',
                background: isDone ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                opacity: isDone ? 0.75 : 1,
                cursor: 'pointer',
                minWidth: '760px',
              }}
              onClick={() => onSelectTask(task)}
            >
              {/* Checkbox */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(task.id);
                }}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
              >
                {isDone ? (
                  <CheckCircle size={20} color="var(--status-completed)" />
                ) : (
                  <Circle size={20} color="var(--text-muted)" />
                )}
              </div>

              {/* Title, description & tags */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isDone ? 'var(--text-muted)' : 'var(--text-main)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '2px',
                  }}
                >
                  {task.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {task.description && (
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '240px',
                      }}
                    >
                      {task.description}
                    </span>
                  )}

                  {task.tags && task.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag-pill" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div onClick={(e) => e.stopPropagation()}>
                <select
                  value={task.status}
                  onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                  style={{
                    fontSize: '0.78rem',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    width: '100%',
                    textTransform: 'capitalize',
                  }}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>
              </div>

              {/* Category */}
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${catColor}15`,
                    color: catColor,
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: catColor }} />
                  {task.category}
                </span>
              </div>

              {/* Due Date */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: overdue ? '#ef4444' : 'var(--text-muted)',
                  fontWeight: overdue ? 600 : 400,
                }}
                title={overdue ? 'Task is overdue!' : undefined}
              >
                {overdue ? <AlertCircle size={14} color="#ef4444" /> : <Calendar size={13} />}
                <span>{task.dueDate || '—'}</span>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn btn-ghost"
                  style={{ padding: '6px' }}
                  title="Edit task"
                  onClick={() => onEditTask(task)}
                >
                  <Edit3 size={15} />
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '6px', color: '#ef4444' }}
                  title="Delete task"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};
