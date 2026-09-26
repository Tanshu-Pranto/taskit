'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, Category } from '@/types/task';
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  AlertCircle
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  categories: Category[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onQuickAdd: (status: TaskStatus) => void;
}

const KANBAN_COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'var(--status-todo)' },
  { id: 'in_progress', title: 'In Progress', color: 'var(--status-inprogress)' },
  { id: 'completed', title: 'Completed', color: 'var(--status-completed)' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  categories,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onSelectTask,
  onQuickAdd,
}) => {
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'completed';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'completed') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  const getCategoryColor = (catName: string) => {
    const cat = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
    return cat ? cat.color : 'var(--primary)';
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    if (status === 'completed' || !dueDate) return false;
    const today = '2026-09-26';
    return dueDate < today;
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onUpdateStatus(taskId, colId);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        margin: '0 32px 32px 32px',
        alignItems: 'start',
      }}
    >
      {KANBAN_COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isDragTarget = dragOverCol === col.id;

        return (
          <div
            key={col.id}
            className="card"
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '440px',
              background: isDragTarget ? 'var(--primary-subtle)' : 'var(--bg-surface)',
              borderTop: `3px solid ${col.color}`,
              borderColor: isDragTarget ? 'var(--border-focus)' : undefined,
              transition: 'background var(--transition), border-color var(--transition)',
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '10px',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: col.color,
                  }}
                />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  {col.title}
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                className="btn btn-ghost"
                style={{ padding: '4px 6px', color: 'var(--text-muted)' }}
                onClick={() => onQuickAdd(col.id)}
                title={`Add task to ${col.title}`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Tasks Cards Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {columnTasks.length === 0 ? (
                <div
                  style={{
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '36px 16px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                  }}
                >
                  Drag tasks here or click + to add
                </div>
              ) : (
                columnTasks.map((task) => {
                  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
                  const totalSubtasks = task.subtasks.length;
                  const overdue = isOverdue(task.dueDate, task.status);
                  const catColor = getCategoryColor(task.category);

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="card card-interactive animate-fade"
                      style={{
                        padding: '14px',
                        background: 'var(--bg-card)',
                        cursor: 'grab',
                        borderLeft: `3px solid ${
                          task.priority === 'urgent'
                            ? 'var(--priority-urgent)'
                            : task.priority === 'high'
                            ? 'var(--priority-high)'
                            : 'transparent'
                        }`,
                      }}
                    >
                      {/* Top Badges */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}
                      >
                        <span className={`badge badge-${task.priority}`}>
                          {task.priority}
                        </span>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-sm)',
                            background: `${catColor}15`,
                            color: catColor,
                          }}
                        >
                          {task.category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div onClick={() => onSelectTask(task)}>
                        <h4
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            lineHeight: 1.4,
                            marginBottom: '4px',
                            color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)',
                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          }}
                        >
                          {task.title}
                        </h4>

                        {task.description && (
                          <p
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--text-secondary)',
                              marginBottom: '8px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                          {task.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag-pill" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Subtasks Progress */}
                      {totalSubtasks > 0 && (
                        <div style={{ marginBottom: '10px' }} onClick={() => onSelectTask(task)}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.72rem',
                              color: 'var(--text-muted)',
                              marginBottom: '4px',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> Subtasks
                            </span>
                            <span>{completedSubtasks}/{totalSubtasks}</span>
                          </div>
                          <div style={{ height: '4px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                                background: 'var(--primary)',
                                borderRadius: '999px',
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Card Footer: Due Date & Actions */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--border-color)',
                          fontSize: '0.75rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: overdue ? '#ef4444' : 'var(--text-muted)',
                            fontWeight: overdue ? 600 : 400,
                          }}
                        >
                          {overdue ? <AlertCircle size={13} color="#ef4444" /> : <Calendar size={13} />}
                          {task.dueDate || 'No date'}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {getPrevStatus(task.status) && (
                            <button
                              className="btn btn-ghost"
                              style={{ padding: '3px 4px' }}
                              title="Move back"
                              onClick={() => {
                                const prev = getPrevStatus(task.status);
                                if (prev) onUpdateStatus(task.id, prev);
                              }}
                            >
                              <ChevronLeft size={14} />
                            </button>
                          )}

                          <button
                            className="btn btn-ghost"
                            style={{ padding: '3px 4px' }}
                            title="Edit task"
                            onClick={() => onEditTask(task)}
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            className="btn btn-ghost"
                            style={{ padding: '3px 4px', color: '#ef4444' }}
                            title="Delete task"
                            onClick={() => onDeleteTask(task.id)}
                          >
                            <Trash2 size={13} />
                          </button>

                          {getNextStatus(task.status) && (
                            <button
                              className="btn btn-ghost"
                              style={{ padding: '3px 4px', color: 'var(--primary)' }}
                              title="Move forward"
                              onClick={() => {
                                const next = getNextStatus(task.status);
                                if (next) onUpdateStatus(task.id, next);
                              }}
                            >
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
