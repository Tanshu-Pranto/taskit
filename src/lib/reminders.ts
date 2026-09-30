'use client';

import { useEffect, useRef } from 'react';
import { Task } from '@/types/task';

const CHECK_INTERVAL_MS = 60_000;

function addDays(dateStr: string, days: number): string {
  // Stay in local time throughout — new Date(...).toISOString() would jump
  // back a day here in any UTC+ timezone, since it re-serializes through UTC.
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface DeadlineReminder {
  id: string;
  taskId: string;
  taskTitle: string;
  kind: 'due-tomorrow' | 'due-today';
  firedAt: number;
}

/**
 * Polls high/urgent-priority tasks for deadline reminders while the app is
 * open, firing at most once per task per kind ("1 day left" / "due today").
 * This is a timer subscription, not state mirrored from props — a genuine
 * effect use case, not the set-state-in-effect anti-pattern.
 */
export function useDeadlineReminders(
  tasks: Task[],
  todayDate: string,
  enabled: boolean,
  onReminder: (reminder: DeadlineReminder) => void,
) {
  const firedRef = useRef<Set<string>>(new Set());
  const onReminderRef = useRef(onReminder);

  // Keep the ref pointed at the latest callback without adding it to the
  // interval effect's deps below, so the interval isn't torn down and
  // recreated on every render just because the caller passed a new closure.
  useEffect(() => {
    onReminderRef.current = onReminder;
  });

  useEffect(() => {
    if (!enabled) return undefined;

    const check = () => {
      const tomorrow = addDays(todayDate, 1);
      for (const task of tasks) {
        if (task.status === 'completed') continue;
        if (task.priority !== 'high' && task.priority !== 'urgent') continue;
        if (!task.dueDate) continue;

        let kind: DeadlineReminder['kind'] | null = null;
        if (task.dueDate === tomorrow) kind = 'due-tomorrow';
        else if (task.dueDate === todayDate) kind = 'due-today';
        if (!kind) continue;

        const key = `${task.id}-${kind}`;
        if (firedRef.current.has(key)) continue;
        firedRef.current.add(key);
        onReminderRef.current({
          id: `reminder-${Date.now()}-${task.id}`,
          taskId: task.id,
          taskTitle: task.title,
          kind,
          firedAt: Date.now(),
        });
      }
    };

    check();
    const intervalId = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [tasks, todayDate, enabled]);
}
