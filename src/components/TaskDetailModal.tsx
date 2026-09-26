'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Bell
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleSubtask,
  onUpdateStatus,
}) => {
  if (!task) return null;

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPct = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-pop"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          background: 'var(--bg-modal)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge badge-${task.priority}`}>{task.priority}</span>
            <span className="tag-pill">{task.category}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="btn btn-ghost"
              style={{ padding: '6px' }}
              title="Edit Task"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Edit3 size={17} />
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '6px', color: '#ef4444' }}
              title="Delete Task"
              onClick={() => {
                onClose();
                onDelete(task.id);
              }}
            >
              <Trash2 size={17} />
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '6px' }}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              lineHeight: 1.4,
              marginBottom: '12px',
              color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)',
              textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </h2>

          {task.description && (
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '20px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {task.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              padding: '14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>
                {task.status.replace('_', ' ')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Date</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> {task.dueDate || 'None'}
              </div>
            </div>

            {task.reminder && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reminder</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bell size={13} /> {task.reminder}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimate</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {task.estimatedHours || 0} hrs
              </div>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Checklist & Subtasks</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {completedSubtasks} of {totalSubtasks} ({progressPct}%)
              </span>
            </div>

            {totalSubtasks > 0 && (
              <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--primary)', borderRadius: '999px', transition: 'width 0.3s ease' }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {task.subtasks.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No subtasks created for this item.</p>
              ) : (
                task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => onToggleSubtask(task.id, sub.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {sub.completed ? (
                      <CheckCircle2 size={18} color="var(--status-completed)" />
                    ) : (
                      <Circle size={18} color="var(--text-muted)" />
                    )}
                    <span
                      style={{
                        fontSize: '0.88rem',
                        color: sub.completed ? 'var(--text-muted)' : 'var(--text-main)',
                        textDecoration: sub.completed ? 'line-through' : 'none',
                      }}
                    >
                      {sub.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Status Buttons */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Set Status:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((st) => (
                <button
                  key={st}
                  className="btn"
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                    background: task.status === st ? 'var(--primary)' : 'var(--bg-subtle)',
                    color: task.status === st ? '#fff' : 'var(--text-secondary)',
                  }}
                  onClick={() => onUpdateStatus(task.id, st)}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
