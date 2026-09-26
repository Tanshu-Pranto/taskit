'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, GripHorizontal } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

type PriorityKey = 'high' | 'medium' | 'low';
const PRIORITIES: { key: PriorityKey; label: string; color: string }[] = [
  { key: 'high', label: 'High priority', color: '#ef4444' },
  { key: 'medium', label: 'Mid priority', color: '#f59e0b' },
  { key: 'low', label: 'Low priority', color: '#22c55e' },
];
const STACK_CARDS = [{ x: -12, y: 28, rotate: -5 }, { x: 13, y: 23, rotate: 4 }, { x: -7, y: 17, rotate: -2.5 }, { x: 8, y: 11, rotate: 3 }, { x: -3, y: 5, rotate: -1.3 }];
const DROP_DURATION = 620;

interface HeroPrioritySceneProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const HeroPriorityScene: React.FC<HeroPrioritySceneProps> = ({ onOpenAuth }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [title, setTitle] = useState('');
  const [organized, setOrganized] = useState(0);
  const [counts, setCounts] = useState<Record<PriorityKey, number>>({ high: 0, medium: 0, low: 0 });
  const [activeBox, setActiveBox] = useState<PriorityKey | null>(null);
  const [dropping, setDropping] = useState(false);
  const [stackCycle, setStackCycle] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const boxRefs = useRef<Map<PriorityKey, HTMLDivElement>>(new Map());
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; x: number; y: number; box: PriorityKey | null } | null>(null);

  const setBoxRef = (key: PriorityKey) => (element: HTMLDivElement | null) => { if (element) boxRefs.current.set(key, element); else boxRefs.current.delete(key); };
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 1800); return () => window.clearTimeout(timer); }, [toast]);
  const findBox = (x: number, y: number): PriorityKey | null => {
    for (const [key, element] of boxRefs.current) { const rect = element.getBoundingClientRect(); if (x >= rect.left - 18 && x <= rect.right + 18 && y >= rect.top - 22 && y <= rect.bottom + 18) return key; }
    return null;
  };
  const prioritize = (priority: PriorityKey) => {
    const card = cardRef.current; const box = boxRefs.current.get(priority);
    if (!card || !box || dropping || !title.trim()) return;
    setDropping(true); setActiveBox(null);
    const cardRect = card.getBoundingClientRect(); const boxRect = box.getBoundingClientRect();
    const dx = boxRect.left + boxRect.width / 2 - (cardRect.left + cardRect.width / 2);
    const dy = boxRect.top + boxRect.height * 0.45 - (cardRect.top + cardRect.height / 2);
    card.classList.add('paper-card-dropping'); card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${priority === 'high' ? -8 : 7}deg) scale(.74)`; card.style.opacity = '0'; box.classList.add('paper-box-bounce');
    window.setTimeout(() => {
      setCounts((previous) => ({ ...previous, [priority]: previous[priority] + 1 })); setOrganized((previous) => previous + 1); setTitle(''); setStackCycle((previous) => previous + 1); setDropping(false); setToast('Task prioritized ✓');
      card.classList.remove('paper-card-dropping'); card.style.removeProperty('transform'); card.style.removeProperty('opacity'); box.classList.remove('paper-box-bounce');
      window.setTimeout(() => inputRef.current?.focus(), reducedMotion ? 0 : 120);
    }, reducedMotion ? 100 : DROP_DURATION);
  };
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!title.trim() || dropping || !cardRef.current) { if (!title.trim()) inputRef.current?.focus(); return; }
    event.preventDefault(); cardRef.current.setPointerCapture(event.pointerId); dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: 0, y: 0, box: null }; cardRef.current.classList.add('paper-card-grabbed');
  };
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current; const card = cardRef.current; if (!drag || drag.pointerId !== event.pointerId || !card) return;
    drag.x = event.clientX - drag.startX; drag.y = event.clientY - drag.startY; const tilt = reducedMotion ? 0 : Math.max(-10, Math.min(10, drag.x * 0.08)); card.style.transform = `translate3d(${drag.x}px, ${drag.y - 14}px, 0) rotate(${tilt}deg) scale(1.035)`;
    const box = findBox(event.clientX, event.clientY); if (box !== drag.box) { drag.box = box; setActiveBox(box); }
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current; const card = cardRef.current; if (!drag || drag.pointerId !== event.pointerId || !card) return;
    card.classList.remove('paper-card-grabbed'); const moved = Math.hypot(drag.x, drag.y); const target = drag.box; dragRef.current = null; setActiveBox(null);
    if (target && moved > 6) prioritize(target); else { card.classList.add('paper-card-returning'); card.style.removeProperty('transform'); window.setTimeout(() => card.classList.remove('paper-card-returning'), 240); }
  };

  return <div className="paper-priority-scene" aria-label="Create and prioritize a task">
    <div className={`paper-stage ${stackCycle ? 'paper-stack-refresh' : ''}`}>
      <div className="paper-counter" aria-live="polite">{organized >= 8 ? 'Your priorities are clear ✓' : `${organized} / 8 tasks organized`}</div>
      <div className="paper-stack" aria-label="Task paper stack">
        {STACK_CARDS.map((paper, index) => <span key={`${stackCycle}-${index}`} className="paper-card paper-card-back" aria-hidden="true" style={{ '--paper-x': `${paper.x}px`, '--paper-y': `${paper.y}px`, '--paper-rotate': `${paper.rotate}deg`, zIndex: index + 1 } as React.CSSProperties} />)}
        <div ref={cardRef} className={`paper-card paper-card-active ${title.trim() ? 'paper-card-ready' : ''}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <span className="paper-clip" aria-hidden="true" /><span className="paper-grip" aria-hidden="true"><GripHorizontal size={17} /></span><label className="sr-only" htmlFor="hero-task-title">Name your task</label>
          <textarea ref={inputRef} id="hero-task-title" value={title} rows={3} maxLength={80} placeholder="NAME YOUR TASK" onChange={(event) => setTitle(event.target.value)} onPointerDown={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} aria-describedby="hero-task-help" />
          <span className="paper-card-footer">{title.trim() ? 'Grab the paper and sort it' : 'Write your tasks to prioritize'}</span>
        </div>
      </div>
      <div className="paper-boxes" aria-label="Priority drop zones">
        {PRIORITIES.map((priority) => <div key={priority.key} ref={setBoxRef(priority.key)} className={`paper-box ${activeBox === priority.key ? 'paper-box-active' : ''}`} style={{ '--box-color': priority.color } as React.CSSProperties}><span className="paper-box-flap paper-box-flap-left" /><span className="paper-box-flap paper-box-flap-right" /><div className="paper-box-opening"><span>{activeBox === priority.key ? 'Drop here' : 'Sort it here'}</span></div><div className="paper-box-face"><span className="paper-box-label">{priority.label}</span><span className="paper-box-count">{counts[priority.key]} task{counts[priority.key] === 1 ? '' : 's'}</span><i className="paper-box-dot" /></div></div>)}
      </div>
    </div>
    {toast && <div className="paper-toast" role="status"><Check size={15} /> {toast}</div>}
    <div id="hero-task-help" className="paper-help">{title.trim() ? 'Drag the paper into a box, or set its priority here:' : 'The paper is your task input — no form required.'}{title.trim() && <span className="paper-priority-actions" role="group" aria-label="Set priority">{PRIORITIES.map((priority) => <button key={priority.key} onClick={() => prioritize(priority.key)}>{priority.label}</button>)}</span>}</div>
    <button className="paper-dashboard-button" onClick={() => onOpenAuth('signup')}>Go to your Customized dashboard</button>
  </div>;
};
