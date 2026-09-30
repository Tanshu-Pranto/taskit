'use client';

import React, { useState } from 'react';
import { Priority, RoutineBlock, Weekday } from '@/types/task';
import { X, Trash2 } from 'lucide-react';

interface RoutineBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<RoutineBlock, 'id'>, blockId?: string) => void;
  onDelete?: (blockId: string) => void;
  initialBlock?: RoutineBlock | null;
  defaultDay: Weekday;
  defaultStartTime: string;
}

const DAY_OPTIONS: { value: Weekday; label: string }[] = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
];

function addOneHour(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const next = (h + 1) % 24;
  return `${String(next).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// The parent remounts this component (via a `key`) every time it opens, so
// all fields can be initialized once from props instead of synced through
// an effect — same pattern as TaskModal.
export const RoutineBlockModal: React.FC<RoutineBlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialBlock,
  defaultDay,
  defaultStartTime,
}) => {
  const [title, setTitle] = useState(initialBlock?.title ?? '');
  const [day, setDay] = useState<Weekday>(initialBlock?.day ?? defaultDay);
  const [startTime, setStartTime] = useState(initialBlock?.startTime ?? defaultStartTime);
  const [endTime, setEndTime] = useState(initialBlock?.endTime ?? addOneHour(defaultStartTime));
  const [priority, setPriority] = useState<Priority>(initialBlock?.priority ?? 'medium');
  const [notes, setNotes] = useState(initialBlock?.notes ?? '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (endTime <= startTime) {
      setError('End time must be after start time.');
      return;
    }
    onSave(
      { title: title.trim(), day, startTime, endTime, priority, notes: notes.trim() || undefined },
      initialBlock?.id,
    );
    onClose();
  };

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
          maxWidth: '440px',
          maxHeight: '92vh',
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
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {initialBlock ? 'Edit Block' : 'Add to Routine'}
          </h2>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '22px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                What is this? *
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Chemistry Lecture"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Day
              </label>
              <select value={day} onChange={(e) => setDay(e.target.value as Weekday)} style={{ width: '100%' }}>
                {DAY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Starts
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => { setStartTime(e.target.value); setError(''); }}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Ends
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => { setEndTime(e.target.value); setError(''); }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            {error && <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '-8px' }}>{error}</div>}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Priority
              </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} style={{ width: '100%' }}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Notes (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Room number, materials to bring, anything worth remembering..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: initialBlock && onDelete ? 'space-between' : 'flex-end',
              gap: '10px',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            {initialBlock && onDelete && (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ color: '#ef4444' }}
                onClick={() => { onDelete(initialBlock.id); onClose(); }}
              >
                <Trash2 size={15} /> Delete
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {initialBlock ? 'Save Changes' : 'Add Block'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
