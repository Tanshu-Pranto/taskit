'use client';

import React from 'react';
import { RoutineBlock, Weekday } from '@/types/task';
import { Plus } from 'lucide-react';

interface RoutineViewProps {
  blocks: RoutineBlock[];
  wakeTime: string;
  onWakeTimeChange: (time: string) => void;
  onAddBlock: (day: Weekday, startTime: string) => void;
  onEditBlock: (block: RoutineBlock) => void;
}

const DAYS: { value: Weekday; label: string }[] = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

const ROW_HEIGHT = 44;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function timeToDecimal(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

function formatHour(h: number): string {
  const period = h < 12 ? 'AM' : 'PM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${period}`;
}

const priorityColor = (p: RoutineBlock['priority']) => `var(--priority-${p})`;

export const RoutineView: React.FC<RoutineViewProps> = ({
  blocks,
  wakeTime,
  onWakeTimeChange,
  onAddBlock,
  onEditBlock,
}) => {
  const blocksByDay = (day: Weekday) => blocks.filter((b) => b.day === day);
  const wakeTop = timeToDecimal(wakeTime) * ROW_HEIGHT;

  return (
    <div style={{ margin: '0 32px 32px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Weekly Routine</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Click any hour to add a block. Click a block to edit it.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Wake-up time
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => onWakeTimeChange(e.target.value)}
            style={{ width: '130px' }}
          />
          <button className="btn btn-primary" style={{ padding: '9px 16px' }} onClick={() => onAddBlock('mon', wakeTime)}>
            <Plus size={16} /> Add Block
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <div className="dash-week-scroll">
          <div style={{ minWidth: '780px' }}>
            {/* Day header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(7, minmax(96px, 1fr))', gap: 0 }}>
              <div />
              {DAYS.map((d) => (
                <div key={d.value} style={{ textAlign: 'center', padding: '6px 0 10px 0', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {d.label}
                </div>
              ))}
            </div>

            {/* Body: time column + 7 scrollable day tracks */}
            <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(7, minmax(96px, 1fr))', gap: 0, maxHeight: '640px', overflowY: 'auto' }}>
              {/* Time labels */}
              <div>
                {HOURS.map((h) => (
                  <div key={h} style={{ height: `${ROW_HEIGHT}px`, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: '8px', fontSize: '0.68rem', color: 'var(--text-muted)', transform: 'translateY(-6px)' }}>
                    {h % 2 === 0 ? formatHour(h) : ''}
                  </div>
                ))}
              </div>

              {/* Day tracks */}
              {DAYS.map((d, dayIndex) => (
                <div key={d.value} style={{ position: 'relative', borderLeft: '1px solid var(--border-color)', height: `${24 * ROW_HEIGHT}px` }}>
                  {/* Hour gridlines, each clickable to add a block */}
                  {HOURS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      className="routine-hour-cell"
                      title={`Add block at ${formatHour(h)}`}
                      onClick={() => onAddBlock(d.value, `${String(h).padStart(2, '0')}:00`)}
                      style={{
                        position: 'absolute',
                        top: `${h * ROW_HEIGHT}px`,
                        left: 0,
                        right: 0,
                        height: `${ROW_HEIGHT}px`,
                        background: 'none',
                        border: 'none',
                        borderBottom: '1px solid var(--border-subtle)',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                    />
                  ))}

                  {/* Wake-up marker */}
                  <div
                    style={{
                      position: 'absolute',
                      top: `${wakeTop}px`,
                      left: 0,
                      right: 0,
                      borderTop: '2px dashed var(--primary)',
                      opacity: 0.6,
                      pointerEvents: 'none',
                    }}
                  >
                    {dayIndex === 0 && (
                      <span style={{ position: 'absolute', top: '-9px', left: '4px', fontSize: '0.6rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--bg-surface)', padding: '0 4px' }}>
                        WAKE
                      </span>
                    )}
                  </div>

                  {/* Blocks */}
                  {blocksByDay(d.value).map((block) => {
                    const top = timeToDecimal(block.startTime) * ROW_HEIGHT;
                    const height = Math.max(20, (timeToDecimal(block.endTime) - timeToDecimal(block.startTime)) * ROW_HEIGHT - 2);
                    const color = priorityColor(block.priority);
                    return (
                      <div
                        key={block.id}
                        onClick={() => onEditBlock(block)}
                        title={`${block.title} (${block.startTime}–${block.endTime})`}
                        style={{
                          position: 'absolute',
                          top: `${top}px`,
                          left: '3px',
                          right: '3px',
                          height: `${height}px`,
                          background: `color-mix(in srgb, ${color}, transparent 82%)`,
                          borderLeft: `3px solid ${color}`,
                          borderRadius: '6px',
                          padding: '3px 6px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          zIndex: 1,
                        }}
                      >
                        {block.title}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
