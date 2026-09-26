'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FileText,
  Users,
  Palette,
  Dumbbell,
  Briefcase,
  ClipboardList,
  BookOpen,
  Presentation,
  MousePointer2,
  Check,
} from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

/**
 * Interactive hero: floating task blocks the visitor can drag (mouse, touch, or
 * keyboard) into one of three cardboard "priority" boxes. Dragging is done via
 * direct ref/DOM style mutation on pointermove (no React state per frame) so it
 * stays smooth without a 3D/WebGL dependency — see the `--cardboard-*` CSS
 * variables and `.priority-*` classes in globals.css for the visual side.
 */

type PriorityKey = 'high' | 'medium' | 'low';

interface TaskDef {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ size?: number }>;
  top: string;
  left: string;
  depth: number;
  rotate: number;
  /** Responsive visibility tier — kept on the task itself (not the render index) so it
   *  doesn't shift as tasks get sorted and removed from the unassigned list. */
  tier: 'always' | 'tablet-up' | 'desktop-only';
}

const TASKS: TaskDef[] = [
  { id: 't1', title: 'Submit Research', category: 'Strategy', icon: FileText, top: '4%', left: '8%', depth: 20, rotate: -6, tier: 'always' },
  { id: 't2', title: 'Team Meeting', category: 'Product', icon: Users, top: '10%', left: '66%', depth: -10, rotate: 5, tier: 'desktop-only' },
  { id: 't3', title: 'UI Design', category: 'Design', icon: Palette, top: '0%', left: '38%', depth: 30, rotate: 4, tier: 'tablet-up' },
  { id: 't4', title: 'Gym', category: 'Personal', icon: Dumbbell, top: '32%', left: '2%', depth: -20, rotate: -4, tier: 'always' },
  { id: 't5', title: 'Client Work', category: 'Product', icon: Briefcase, top: '20%', left: '82%', depth: 10, rotate: -5, tier: 'desktop-only' },
  { id: 't6', title: 'Assignment', category: 'Strategy', icon: ClipboardList, top: '36%', left: '52%', depth: -30, rotate: 6, tier: 'tablet-up' },
  { id: 't7', title: 'Read Paper', category: 'Strategy', icon: BookOpen, top: '8%', left: '22%', depth: 0, rotate: -3, tier: 'always' },
  { id: 't8', title: 'Project Demo', category: 'Engineering', icon: Presentation, top: '34%', left: '28%', depth: 15, rotate: 3, tier: 'desktop-only' },
];

const TIER_CLASS: Record<TaskDef['tier'], string> = {
  always: '',
  'tablet-up': 'hide-mobile',
  'desktop-only': 'hide-tablet',
};

const PRIORITIES: { key: PriorityKey; label: string; dot: string; intensity: string }[] = [
  { key: 'high', label: 'High Priority', dot: '#ff3b30', intensity: 'priority-intensity-high' },
  { key: 'medium', label: 'Medium Priority', dot: '#fbbf24', intensity: 'priority-intensity-medium' },
  { key: 'low', label: 'Low Priority', dot: '#22c55e', intensity: 'priority-intensity-low' },
];

const SETTLE_MS = 380;
const TOAST_MS = 1800;
const DROP_ZONE_PADDING = 26;
const TAP_THRESHOLD_PX = 6;

function baseTransform(task: TaskDef) {
  return `translate3d(0px, 0px, ${task.depth}px) rotate(${task.rotate}deg)`;
}

export const HeroPriorityScene: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  const [assignments, setAssignments] = useState<Record<string, PriorityKey>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [showTurnMessage, setShowTurnMessage] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const boxRefs = useRef<Map<PriorityKey, HTMLDivElement>>(new Map());
  const settlingRef = useRef<Set<string>>(new Set());
  const dragRef = useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    x: number;
    y: number;
    hoveredBox: PriorityKey | null;
  } | null>(null);

  const unassignedTasks = useMemo(() => TASKS.filter((t) => !assignments[t.id]), [assignments]);
  const totalAssigned = Object.keys(assignments).length;
  const allSorted = totalAssigned === TASKS.length;

  const acceptTask = (taskId: string, box: PriorityKey, elParam?: HTMLDivElement | null) => {
    const el = elParam ?? blockRefs.current.get(taskId) ?? null;
    const boxEl = boxRefs.current.get(box) ?? null;

    settlingRef.current.add(taskId);

    if (el && boxEl) {
      const blockRect = el.getBoundingClientRect();
      const boxRect = boxEl.getBoundingClientRect();
      const dx = boxRect.left + boxRect.width / 2 - (blockRect.left + blockRect.width / 2);
      const dy = boxRect.top + boxRect.height / 2 - (blockRect.top + blockRect.height / 2);
      el.classList.add('priority-task-settling');
      el.style.transform = `translate3d(${dx}px, ${dy}px, 60px) scale(0.3) rotate(8deg)`;
      el.style.opacity = '0';
    }

    if (boxEl) {
      boxEl.classList.add('priority-box-bounce');
      setTimeout(() => boxEl.classList.remove('priority-box-bounce'), 440);
    }

    setTimeout(() => {
      setAssignments((prev) => {
        const next = { ...prev, [taskId]: box };
        return next;
      });
      settlingRef.current.delete(taskId);
      setToast('Task prioritized ✓');
      setTimeout(() => setToast(null), TOAST_MS);
    }, SETTLE_MS);
  };

  // Idle floating motion for unassigned, non-dragged, non-settling task blocks.
  useEffect(() => {
    if (reducedMotion) return;
    let raf: number;
    const tick = (t: number) => {
      unassignedTasks.forEach((task, i) => {
        if (dragRef.current?.id === task.id) return;
        if (settlingRef.current.has(task.id)) return;
        const el = blockRefs.current.get(task.id);
        if (!el) return;
        const phase = t / 1100 + i * 1.3;
        const bobY = Math.sin(phase) * 7;
        const bobRotate = Math.sin(phase * 0.7) * 3;
        el.style.transform = `translate3d(0px, ${bobY}px, ${task.depth}px) rotate(${task.rotate + bobRotate}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, unassignedTasks]);

  // One-time entrance + demonstration sequence.
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const after = (fn: () => void, ms: number) => timeouts.push(setTimeout(fn, ms));

    if (reducedMotion) return;

    after(() => setEntered(true), 80);

    after(() => {
      const el = blockRefs.current.get('t1');
      const ghost = ghostRef.current;
      const stage = stageRef.current;
      if (el && ghost && stage) {
        const elRect = el.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        ghost.style.transform = `translate3d(${elRect.left - stageRect.left + elRect.width / 2 - 16}px, ${elRect.top - stageRect.top + elRect.height / 2 - 16}px, 80px)`;
        ghost.style.opacity = '1';
      }
    }, 1500);

    after(() => {
      const el = blockRefs.current.get('t1');
      const boxEl = boxRefs.current.get('high');
      if (el) {
        settlingRef.current.add('t1');
        el.classList.add('priority-task-grabbed', 'priority-task-settling');
        el.style.transform = `translate3d(0px, -14px, 70px) scale(1.08) rotate(-4deg)`;
      }
      boxEl?.classList.add('priority-box-active', 'priority-intensity-high');
    }, 2100);

    after(() => {
      const el = blockRefs.current.get('t1');
      const boxEl = boxRefs.current.get('high');
      const ghost = ghostRef.current;
      const stage = stageRef.current;
      if (el && boxEl && stage) {
        const blockRect = el.getBoundingClientRect();
        const boxRect = boxEl.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        const dx = boxRect.left + boxRect.width / 2 - (blockRect.left + blockRect.width / 2);
        const dy = boxRect.top - (blockRect.top + blockRect.height / 2);
        el.style.transform = `translate3d(${dx}px, ${dy}px, 70px) scale(1.08) rotate(-4deg)`;
        if (ghost) {
          ghost.style.transform = `translate3d(${boxRect.left - stageRect.left + boxRect.width / 2 - 16}px, ${boxRect.top - stageRect.top - 16}px, 80px)`;
        }
      }
    }, 2150);

    after(() => {
      const el = blockRefs.current.get('t1');
      el?.classList.remove('priority-task-grabbed');
      boxRefs.current.get('high')?.classList.remove('priority-box-active', 'priority-intensity-high');
      settlingRef.current.delete('t1');
      acceptTask('t1', 'high', el ?? undefined);
    }, 2850);

    after(() => {
      const ghost = ghostRef.current;
      if (ghost) ghost.style.opacity = '0';
    }, 3150);

    after(() => setShowTurnMessage(true), 3500);
    after(() => setShowTurnMessage(false), 6200);

    return () => timeouts.forEach(clearTimeout);
  }, [reducedMotion]);

  const setBlockRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) blockRefs.current.set(id, el);
    else blockRefs.current.delete(id);
  };

  const setBoxRef = (key: PriorityKey) => (el: HTMLDivElement | null) => {
    if (el) boxRefs.current.set(key, el);
    else boxRefs.current.delete(key);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, taskId: string) => {
    if (assignments[taskId] || settlingRef.current.has(taskId)) return;
    const el = blockRefs.current.get(taskId);
    if (!el) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    dragRef.current = { id: taskId, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, x: 0, y: 0, hoveredBox: null };
    el.classList.add('priority-task-grabbed');
    setSelectedTaskId(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    const task = TASKS.find((t) => t.id === drag.id);
    const el = blockRefs.current.get(drag.id);
    if (!task || !el) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    drag.x = dx;
    drag.y = dy;
    const tilt = Math.max(-18, Math.min(18, dx * 0.15));
    el.style.transform = `translate3d(${dx}px, ${dy}px, ${task.depth + 50}px) scale(1.08) rotate(${tilt}deg)`;

    let hovered: PriorityKey | null = null;
    boxRefs.current.forEach((boxEl, key) => {
      const rect = boxEl.getBoundingClientRect();
      if (
        e.clientX >= rect.left - DROP_ZONE_PADDING &&
        e.clientX <= rect.right + DROP_ZONE_PADDING &&
        e.clientY >= rect.top - DROP_ZONE_PADDING &&
        e.clientY <= rect.bottom + DROP_ZONE_PADDING
      ) {
        hovered = key;
      }
    });

    if (hovered !== drag.hoveredBox) {
      if (drag.hoveredBox) {
        const prevBoxEl = boxRefs.current.get(drag.hoveredBox);
        const prevConfig = PRIORITIES.find((p) => p.key === drag.hoveredBox);
        prevBoxEl?.classList.remove('priority-box-active', prevConfig?.intensity || '');
      }
      if (hovered) {
        const nextBoxEl = boxRefs.current.get(hovered);
        const nextConfig = PRIORITIES.find((p) => p.key === hovered);
        nextBoxEl?.classList.add('priority-box-active', nextConfig?.intensity || '');
      }
      drag.hoveredBox = hovered;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    const task = TASKS.find((t) => t.id === drag.id);
    const el = blockRefs.current.get(drag.id);
    el?.classList.remove('priority-task-grabbed');

    if (drag.hoveredBox) {
      const config = PRIORITIES.find((p) => p.key === drag.hoveredBox);
      boxRefs.current.get(drag.hoveredBox)?.classList.remove('priority-box-active', config?.intensity || '');
    }

    const moved = Math.hypot(drag.x, drag.y);
    if (moved < TAP_THRESHOLD_PX) {
      if (el && task) el.style.transform = baseTransform(task);
      setSelectedTaskId(drag.id);
      dragRef.current = null;
      return;
    }

    if (drag.hoveredBox) {
      acceptTask(drag.id, drag.hoveredBox, el);
    } else if (el && task) {
      settlingRef.current.add(drag.id);
      el.classList.add('priority-task-settling');
      el.style.transform = baseTransform(task);
      setTimeout(() => {
        el.classList.remove('priority-task-settling');
        settlingRef.current.delete(drag.id);
      }, SETTLE_MS);
    }
    dragRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedTaskId(taskId);
    } else if (e.key === 'Escape') {
      setSelectedTaskId(null);
    }
  };

  const selectedTask = selectedTaskId ? TASKS.find((t) => t.id === selectedTaskId) : null;

  return (
    <div className="priority-scene-wrapper">
      <div ref={stageRef} className="priority-stage">
        {unassignedTasks.map((task, i) => {
          const Icon = task.icon;
          return (
            <div
              key={task.id}
              ref={setBlockRef(task.id)}
              className={`priority-task ${entered || reducedMotion ? 'priority-task-entered' : ''} ${TIER_CLASS[task.tier]}`}
              style={{ top: task.top, left: task.left, transform: baseTransform(task), transitionDelay: `${i * 70}ms` }}
              onPointerDown={(e) => handlePointerDown(e, task.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={(e) => handleKeyDown(e, task.id)}
              role="button"
              tabIndex={0}
              aria-label={`${task.title}, ${task.category}. Press Enter to choose a priority.`}
            >
              <span className="priority-task-icon">
                <Icon size={13} />
              </span>
              <span>
                {task.title}
                <span className="priority-task-category">{task.category}</span>
              </span>
            </div>
          );
        })}

        <span ref={ghostRef} className="priority-ghost-cursor" aria-hidden="true">
          <MousePointer2 size={15} />
        </span>

        <div className="priority-boxes-row">
          {PRIORITIES.map((p) => {
            const count = TASKS.filter((t) => assignments[t.id] === p.key).length;
            return (
              <div key={p.key} ref={setBoxRef(p.key)} className="priority-box">
                <div className="priority-box-content">
                  <span className="priority-box-dot" style={{ background: p.dot, color: p.dot }} />
                  <div className="priority-box-label">{p.label}</div>
                  <div className="priority-box-count">{count} task{count === 1 ? '' : 's'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {toast && (
        <div className="priority-toast" role="status">
          <Check size={14} /> {toast}
        </div>
      )}

      <div className="priority-hint-row">
        <span>
          {showTurnMessage
            ? "Now it's your turn."
            : reducedMotion
            ? 'Select a task, then choose a priority.'
            : 'Drag a task into a priority box.'}
        </span>
        <span>
          {allSorted ? 'Your priorities are clear.' : `Tasks organized: ${totalAssigned} / ${TASKS.length}`}
        </span>
      </div>

      {selectedTask && (
        <div className="priority-select-bar" role="group" aria-label="Choose a priority">
          <span>
            Move <strong>&ldquo;{selectedTask.title}&rdquo;</strong> to:
          </span>
          {PRIORITIES.map((p) => (
            <button
              key={p.key}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              onClick={() => {
                acceptTask(selectedTask.id, p.key);
                setSelectedTaskId(null);
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            className="btn btn-ghost"
            style={{ fontSize: '0.78rem', padding: '6px 10px' }}
            onClick={() => setSelectedTaskId(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
