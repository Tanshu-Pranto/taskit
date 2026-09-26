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
    setDropping(true); setActiveBox(null); setOpenedBox(priority);
    const cardRect = card.getBoundingClientRect(); const boxRect = box.getBoundingClientRect();
    const dx = boxRect.left + boxRect.width / 2 - (cardRect.left + cardRect.width / 2);
    const dy = boxRect.top + boxRect.height * 0.45 - (cardRect.top + cardRect.height / 2);
    card.classList.add('paper-card-dropping'); card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${priority === 'high' ? -8 : 7}deg) scale(.74)`; card.style.opacity = '0'; box.classList.add('paper-box-bounce');
    window.setTimeout(() => {
      setCounts((previous) => ({ ...previous, [priority]: previous[priority] + 1 })); setOrganized((previous) => previous + 1); setTitle(''); setStackCycle((previous) => previous + 1); setDropping(false); setToast('Task prioritized ✓');
      card.classList.remove('paper-card-dropping'); card.style.removeProperty('transform'); card.style.removeProperty('opacity'); box.classList.remove('paper-box-bounce');
      window.setTimeout(() => setOpenedBox(null), reducedMotion ? 0 : 520);
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
        {PRIORITIES.map((priority) => <div key={priority.key} ref={setBoxRef(priority.key)} className={`paper-box ${activeBox === priority.key ? 'paper-box-active' : ''} ${openedBox === priority.key ? 'paper-box-opened' : ''}`} style={{ '--box-color': priority.color } as React.CSSProperties}>
          <svg className="paper-box-illustration" viewBox="0 0 300 230" aria-hidden="true">
            <defs>
              <linearGradient id={`front-${priority.key}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--box-front-1)" /><stop offset="1" stopColor="var(--box-front-2)" /></linearGradient>
              <linearGradient id={`left-${priority.key}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--box-side-1)" /><stop offset="1" stopColor="var(--box-side-2)" /></linearGradient>
              <linearGradient id={`flap-${priority.key}`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="var(--box-flap-1)" /><stop offset="1" stopColor="var(--box-flap-2)" /></linearGradient>
              <radialGradient id={`shadow-${priority.key}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" stopOpacity=".32" />
                <stop offset="70%" stopColor="#000000" stopOpacity=".14" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              {/* Subtle corrugated-fiber texture, painted as a low-opacity overlay on top of each face */}
              <filter id={`fiber-${priority.key}`} x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.85 0.05" numOctaves="2" seed="7" result="noise" />
                <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.07  0 0 0 0 0.03  0 0 0 0.3 0" />
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>
            </defs>
            <g className="paper-box-closed">
              <ellipse cx="157" cy="228" rx="128" ry="14" fill={`url(#shadow-${priority.key})`} />
              <polygon points="48,81 151,52 269,83 160,117" fill={`url(#flap-${priority.key})`} stroke="#81502c" strokeWidth="1.25" />
              <polygon points="48,81 160,117 160,220 48,188" fill={`url(#left-${priority.key})`} stroke="#84502a" strokeWidth="1.25" />
              <polygon points="160,117 269,83 269,187 160,220" fill={`url(#front-${priority.key})`} stroke="#9b5e30" strokeWidth="1.25" />
              <polygon points="48,81 160,117 160,220 48,188" fill={`url(#front-${priority.key})`} filter={`url(#fiber-${priority.key})`} />
              <polygon points="160,117 269,83 269,187 160,220" fill={`url(#front-${priority.key})`} filter={`url(#fiber-${priority.key})`} />
              <path d="M48 81 L160 117 L269 83 M160 117 L160 220" fill="none" stroke="rgba(83,42,18,.52)" strokeWidth="1.15" />
              <path d="M76 73 L160 100 L238 77" fill="none" stroke="rgba(92,49,22,.42)" strokeWidth="1.1" />
              <path d="M49 80 L151 53 L268 83" fill="none" stroke="rgba(255,232,184,.44)" strokeWidth="1.2" />
            </g>
            <g className="paper-box-open">
              <ellipse cx="153" cy="213" rx="122" ry="15" fill={`url(#shadow-${priority.key})`} />
              <polygon points="80,104 139,72 237,104 218,120 105,120" fill="var(--box-interior)" />
              <polygon points="139,72 166,15 273,18 237,104" fill={`url(#flap-${priority.key})`} stroke="#81502c" strokeWidth="1.2" />
              <polygon points="15,48 85,48 139,72 80,104" fill={`url(#flap-${priority.key})`} stroke="#81502c" strokeWidth="1.2" />
              <polygon points="273,18 299,27 237,104 222,102" fill="var(--box-flap-1)" stroke="#81502c" strokeWidth="1.2" />
              <polygon points="48,94 80,104 80,204 48,190" fill={`url(#left-${priority.key})`} stroke="#84502a" strokeWidth="1.2" />
              <polygon points="80,104 237,104 237,203 80,204" fill={`url(#front-${priority.key})`} stroke="#9b5e30" strokeWidth="1.2" />
              <polygon points="48,94 80,104 80,204 48,190" fill={`url(#left-${priority.key})`} filter={`url(#fiber-${priority.key})`} />
              <polygon points="80,104 237,104 237,203 80,204" fill={`url(#front-${priority.key})`} filter={`url(#fiber-${priority.key})`} />
              {/* Hand-hold die-cut */}
              <rect x="150" y="172" width="16" height="26" rx="3" fill="rgba(0,0,0,.5)" />
              <path d="M158 105 L158 202" stroke="rgba(113,63,27,.16)" strokeWidth="1" />
              <path d="M80 104 L237 104" stroke="rgba(255,232,184,.5)" strokeWidth="1.4" />
            </g>
            <g className="paper-box-sticker" transform="translate(181 166)">
              <rect width="68" height="25" rx="1.5" fill="#f4e2b9" stroke="#d7bc87" strokeWidth=".7" />
              <circle cx="8" cy="9" r="3.8" fill={priority.color} />
              <text x="15" y="11.5" fill="#2b2015" fontSize="5.8" fontWeight="800" letterSpacing=".25">{priority.label.toUpperCase()}</text>
              <text x="15" y="19.3" fill="#6b5340" fontSize="5.2" fontWeight="650">{counts[priority.key]} task{counts[priority.key] === 1 ? '' : 's'}</text>
            </g>
          </svg>
          <div className="paper-box-opening"><span>{activeBox === priority.key ? 'Drop here' : 'Drag to sort'}</span></div>
        </div>)}
      </div>
    </div>
    {toast && <div className="paper-toast" role="status"><Check size={15} /> {toast}</div>}
    <div id="hero-task-help" className="paper-help">{title.trim() ? 'Drag the paper into a box, or set its priority here:' : 'The paper is your task input — no form required.'}{title.trim() && <span className="paper-priority-actions" role="group" aria-label="Set priority">{PRIORITIES.map((priority) => <button key={priority.key} onClick={() => prioritize(priority.key)}>{priority.label}</button>)}</span>}</div>
    <button className="paper-dashboard-button" onClick={() => onOpenAuth('signup')}>Open customized dashboard</button>
  </div>;
};
