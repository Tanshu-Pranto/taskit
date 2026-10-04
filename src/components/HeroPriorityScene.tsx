'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, GripHorizontal } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { stageTask } from '@/lib/stagedTasks';

type PriorityKey = 'high' | 'medium' | 'low';
const PRIORITIES: { key: PriorityKey; label: string }[] = [
  { key: 'high', label: 'High priority' },
  { key: 'medium', label: 'Mid priority' },
  { key: 'low', label: 'Low priority' },
];
const STACK_CARDS = [{ x: -12, y: 28, rotate: -5 }, { x: 13, y: 23, rotate: 4 }, { x: -7, y: 17, rotate: -2.5 }, { x: 8, y: 11, rotate: 3 }, { x: -3, y: 5, rotate: -1.3 }];
const DROP_DURATION = 620;
// Isometric cube in a 240×260 viewBox: top vertex, the two upper corners, the
// front vertical edge (centre → bottom) and the two lower corners.
const CUBE = { top: '120,12', lt: '20,70', rt: '220,70', c: '120,128', lb: '20,186', rb: '220,186', bottom: '120,244' };
const CUBE_MOUTH_Y = 70 / 260;
const MAX_VISIBLE_SHEETS = 6;

interface HeroPrioritySceneProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const HeroPriorityScene: React.FC<HeroPrioritySceneProps> = ({ onOpenAuth }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [title, setTitle] = useState('');
  const [organized, setOrganized] = useState(0);
  const [counts, setCounts] = useState<Record<PriorityKey, number>>({ high: 0, medium: 0, low: 0 });
  const [activeBox, setActiveBox] = useState<PriorityKey | null>(null);
  const [openedBox, setOpenedBox] = useState<PriorityKey | null>(null);
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
    stageTask(title.trim(), priority);
    setDropping(true); setActiveBox(null); setOpenedBox(priority);
    // Aim for the cube's lid opening (top face centre) and shrink the paper into it.
    const cardRect = card.getBoundingClientRect(); const boxRect = box.getBoundingClientRect();
    const dx = boxRect.left + boxRect.width / 2 - (cardRect.left + cardRect.width / 2);
    const dy = boxRect.top + boxRect.height * CUBE_MOUTH_Y - (cardRect.top + cardRect.height / 2);
    card.classList.add('paper-card-dropping'); card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${priority === 'high' ? -14 : 12}deg) scale(.14)`; card.style.opacity = '0';
    window.setTimeout(() => {
      setCounts((previous) => ({ ...previous, [priority]: previous[priority] + 1 })); setOrganized((previous) => previous + 1); setTitle(''); setStackCycle((previous) => previous + 1); setDropping(false); setToast('Task prioritized ✓');
      // Snap the paper back to the stack without a visible return trip, then deal a fresh sheet.
      card.classList.remove('paper-card-dropping'); card.style.transition = 'none'; card.style.removeProperty('transform'); card.style.removeProperty('opacity');
      void card.offsetWidth; card.style.removeProperty('transition');
      if (!reducedMotion) { card.classList.add('paper-card-entering'); window.setTimeout(() => card.classList.remove('paper-card-entering'), 420); }
      box.classList.add('paper-box-bounce'); window.setTimeout(() => box.classList.remove('paper-box-bounce'), 620);
      window.setTimeout(() => setOpenedBox(null), reducedMotion ? 0 : 160);
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
        {PRIORITIES.map((priority) => <div key={priority.key} ref={setBoxRef(priority.key)} aria-label={`${priority.label}: ${counts[priority.key]} task${counts[priority.key] === 1 ? '' : 's'}`} className={`paper-box ${activeBox === priority.key ? 'paper-box-active' : ''} ${openedBox === priority.key ? 'paper-box-opened' : ''}`}>
          <svg className="paper-box-illustration" viewBox="0 0 240 260" aria-hidden="true">
            <defs>
              {/* Key light from the upper left: top face brightest, left face mid, right face in shade */}
              <linearGradient id={`cube-top-${priority.key}`} gradientUnits="userSpaceOnUse" x1="20" y1="70" x2="220" y2="70">
                <stop offset="0%" stopColor="var(--cube-top-1)" />
                <stop offset="100%" stopColor="var(--cube-top-2)" />
              </linearGradient>
              <linearGradient id={`cube-left-${priority.key}`} gradientUnits="userSpaceOnUse" x1="70" y1="90" x2="70" y2="240">
                <stop offset="0%" stopColor="var(--cube-left-1)" />
                <stop offset="100%" stopColor="var(--cube-left-2)" />
              </linearGradient>
              <linearGradient id={`cube-right-${priority.key}`} gradientUnits="userSpaceOnUse" x1="130" y1="90" x2="220" y2="230">
                <stop offset="0%" stopColor="var(--cube-right-1)" />
                <stop offset="100%" stopColor="var(--cube-right-2)" />
              </linearGradient>
              {/* Faint subsurface warmth so the body reads as resin, not paint */}
              <radialGradient id={`cube-depth-${priority.key}`} gradientUnits="userSpaceOnUse" cx="112" cy="150" r="96">
                <stop offset="0%" stopColor="var(--cube-depth)" stopOpacity=".28" />
                <stop offset="100%" stopColor="var(--cube-depth)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`cube-sheen-${priority.key}`} gradientUnits="userSpaceOnUse" x1="40" y1="40" x2="140" y2="110">
                <stop offset="0%" stopColor="#ffffff" stopOpacity=".2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`cube-mouth-${priority.key}`} gradientUnits="userSpaceOnUse" x1="120" y1="12" x2="120" y2="128">
                <stop offset="0%" stopColor="var(--cube-interior)" />
                <stop offset="100%" stopColor="var(--cube-left-2)" />
              </linearGradient>
              <radialGradient id={`cube-shadow-${priority.key}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" stopOpacity=".55" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <filter id={`cube-grain-${priority.key}`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch" result="noise" />
                <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
                <feComposite in="mono" in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            <ellipse cx="120" cy="247" rx="96" ry="9" fill={`url(#cube-shadow-${priority.key})`} />
            <polygon points={`${CUBE.top} ${CUBE.rt} ${CUBE.rb} ${CUBE.bottom} ${CUBE.lb} ${CUBE.lt}`} fill="var(--cube-interior)" />
            {Array.from({ length: Math.min(counts[priority.key], MAX_VISIBLE_SHEETS) }, (_, index) => (
              <polygon key={`${priority.key}-sheet-${index}`} className={index === counts[priority.key] - 1 ? 'cube-sheet-new' : undefined} points="120,152 180,186 120,220 60,186" transform={`translate(${index % 2 ? 3 : -2} ${-index * 6})`} fill="var(--cube-paper)" stroke="rgba(40,20,8,.3)" strokeWidth=".8" />
            ))}
            <polygon points={`${CUBE.lt} ${CUBE.c} ${CUBE.bottom} ${CUBE.lb}`} fill={`url(#cube-left-${priority.key})`} opacity=".9" />
            <polygon points={`${CUBE.c} ${CUBE.rt} ${CUBE.rb} ${CUBE.bottom}`} fill={`url(#cube-right-${priority.key})`} opacity=".92" />
            <polygon points={`${CUBE.lt} ${CUBE.c} ${CUBE.bottom} ${CUBE.lb}`} fill={`url(#cube-depth-${priority.key})`} />
            <polygon points={`${CUBE.top} ${CUBE.rt} ${CUBE.rb} ${CUBE.bottom} ${CUBE.lb} ${CUBE.lt}`} fill="#fff" opacity=".06" filter={`url(#cube-grain-${priority.key})`} style={{ mixBlendMode: 'overlay' }} />
            <g transform="matrix(.866 -.5 0 1 120 128)" fill="var(--cube-label)" fontFamily="var(--font-family)">
              <text x="13" y="88" fontSize="10" fontWeight="700" letterSpacing="1.6">{priority.label.toUpperCase()}</text>
              <text x="13" y="103" fontSize="9.5" fontWeight="500" letterSpacing="1.2" opacity=".62">{counts[priority.key]} TASK{counts[priority.key] === 1 ? '' : 'S'}</text>
            </g>
            {/* Edges: a soft lit bevel on the front corner, everything else barely there */}
            <path d={`M${CUBE.lt} L${CUBE.lb} L${CUBE.bottom} L${CUBE.rb} L${CUBE.rt}`} fill="none" stroke="var(--cube-edge)" strokeOpacity=".16" strokeWidth="1" strokeLinejoin="round" />
            <path d={`M${CUBE.c} L${CUBE.bottom}`} stroke="var(--cube-edge)" strokeOpacity=".4" strokeWidth="1" />
            <polygon className="cube-opening" points={`${CUBE.top} ${CUBE.rt} ${CUBE.c} ${CUBE.lt}`} fill={`url(#cube-mouth-${priority.key})`} />
            <g className="cube-lid">
              <polygon points={`${CUBE.top} ${CUBE.rt} ${CUBE.c} ${CUBE.lt}`} fill={`url(#cube-top-${priority.key})`} />
              <polygon points={`${CUBE.top} ${CUBE.rt} ${CUBE.c} ${CUBE.lt}`} fill={`url(#cube-sheen-${priority.key})`} />
              <polygon points={`${CUBE.top} ${CUBE.rt} ${CUBE.c} ${CUBE.lt}`} fill="#fff" opacity=".06" filter={`url(#cube-grain-${priority.key})`} style={{ mixBlendMode: 'overlay' }} />
              <path d={`M${CUBE.lt} L${CUBE.top} L${CUBE.rt}`} fill="none" stroke="var(--cube-edge)" strokeOpacity=".22" strokeWidth="1" strokeLinejoin="round" />
              <path d={`M${CUBE.lt} L${CUBE.c} L${CUBE.rt}`} fill="none" stroke="var(--cube-edge)" strokeOpacity=".5" strokeWidth="1" strokeLinejoin="round" />
            </g>
            <polygon className="cube-flash" points={`${CUBE.top} ${CUBE.rt} ${CUBE.rb} ${CUBE.bottom} ${CUBE.lb} ${CUBE.lt}`} fill="#ffffff" />
          </svg>
          <span className="paper-box-hint">Drop here</span>
        </div>)}
      </div>
    </div>
    {toast && <div className="paper-toast" role="status"><Check size={15} /> {toast}</div>}
    <div id="hero-task-help" className="paper-help">{title.trim() ? 'Drag the paper into a box, or set its priority here:' : 'The paper is your task input — no form required.'}{title.trim() && <span className="paper-priority-actions" role="group" aria-label="Set priority">{PRIORITIES.map((priority) => <button key={priority.key} onClick={() => prioritize(priority.key)}>{priority.label}</button>)}</span>}</div>
    <button className="paper-dashboard-button" onClick={() => onOpenAuth('signup')}>Open customized dashboard</button>
  </div>;
};
