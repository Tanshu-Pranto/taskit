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
              <linearGradient id={`front-${priority.key}`} x1="0" y1="0" x2=".35" y2="1">
                <stop offset="0%" stopColor="var(--box-front-1)" />
                <stop offset="55%" stopColor="var(--box-front-2)" />
                <stop offset="100%" stopColor="var(--box-front-3)" />
              </linearGradient>
              <linearGradient id={`side-${priority.key}`} x1="0" y1="0" x2=".3" y2="1">
                <stop offset="0%" stopColor="var(--box-side-1)" />
                <stop offset="55%" stopColor="var(--box-side-2)" />
                <stop offset="100%" stopColor="var(--box-side-3)" />
              </linearGradient>
              <linearGradient id={`top-${priority.key}`} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--box-top-3)" />
                <stop offset="50%" stopColor="var(--box-top-2)" />
                <stop offset="100%" stopColor="var(--box-top-1)" />
              </linearGradient>
              <linearGradient id={`flap-${priority.key}`} x1="0" y1="0" x2=".8" y2="1">
                <stop offset="0%" stopColor="var(--box-top-1)" />
                <stop offset="60%" stopColor="var(--box-top-2)" />
                <stop offset="100%" stopColor="var(--box-top-3)" />
              </linearGradient>
              {/* Edge highlight catching the overhead light, and a soft AO line where faces meet */}
              <linearGradient id={`rim-${priority.key}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity=".55" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              {/* Soft two-layer contact shadow: a warm inner glow plus a broad neutral falloff */}
              <radialGradient id={`shadow-warm-${priority.key}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3a1c0c" stopOpacity=".32" />
                <stop offset="100%" stopColor="#3a1c0c" stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`shadow-soft-${priority.key}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" stopOpacity=".2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`dot-glow-${priority.key}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={priority.color} stopOpacity=".55" />
                <stop offset="100%" stopColor={priority.color} stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="paper-box-closed">
              <ellipse cx="150" cy="238" rx="82" ry="9" fill={`url(#shadow-warm-${priority.key})`} />
              <ellipse cx="150" cy="238" rx="128" ry="14" fill={`url(#shadow-soft-${priority.key})`} />
              <polygon points="50,100 195,100 250,65 105,65" fill={`url(#top-${priority.key})`} />
              <polygon points="195,100 250,65 250,195 195,230" fill={`url(#side-${priority.key})`} />
              <polygon points="50,100 195,100 195,230 50,230" fill={`url(#front-${priority.key})`} />
              <path d="M50 100 L195 100 L250 65 M195 100 L195 230" fill="none" stroke="rgba(30,18,9,.28)" strokeWidth="1.25" />
              {/* Highlight catching the overhead light along the lid's outer edge */}
              <path d="M250 65 L105 65 L50 100" fill="none" stroke={`url(#rim-${priority.key})`} strokeWidth="2" strokeLinecap="round" />
              {/* Fold-crease marks on the lid */}
              <path d="M150 78 L165 72 M172 76 L184 70" stroke="rgba(255,250,238,.55)" strokeWidth="2" strokeLinecap="round" />
              {/* Crumpled paper accent, bottom-right */}
              <path d="M212 210 q6 5 3 12 M223 206 q7 4 4 12" fill="none" stroke="rgba(40,26,14,.28)" strokeWidth="1.4" strokeLinecap="round" />
            </g>
            <g className="paper-box-open">
              <ellipse cx="150" cy="230" rx="80" ry="9" fill={`url(#shadow-warm-${priority.key})`} />
              <ellipse cx="150" cy="230" rx="124" ry="14" fill={`url(#shadow-soft-${priority.key})`} />
              <polygon points="50,100 195,100 250,65 105,65" fill="var(--box-interior)" />
              <polygon points="105,65 250,65 250,10 105,10" fill={`url(#flap-${priority.key})`} />
              <polygon points="195,100 250,65 320,20 265,55" fill={`url(#flap-${priority.key})`} />
              <polygon points="105,65 50,100 -20,55 35,20" fill={`url(#flap-${priority.key})`} />
              <polygon points="50,100 195,100 210,155 35,155" fill={`url(#flap-${priority.key})`} opacity=".94" />
              <polygon points="195,100 250,65 250,195 195,230" fill={`url(#side-${priority.key})`} />
              <polygon points="50,100 195,100 195,230 50,230" fill={`url(#front-${priority.key})`} />
              <path d="M50 100 L195 100 L250 65 M195 100 L195 230" fill="none" stroke="rgba(30,18,9,.28)" strokeWidth="1.25" />
              <path d="M50 100 L195 100" fill="none" stroke={`url(#rim-${priority.key})`} strokeWidth="2" strokeLinecap="round" />
              {/* Hand-hold die-cut */}
              <ellipse cx="184" cy="207" rx="7" ry="10" fill="rgba(20,10,5,.4)" />
            </g>
            {/* Priority dot, glowing, sitting clear above the label */}
            <circle cx="153" cy="141" r="16" fill={`url(#dot-glow-${priority.key})`} />
            <circle cx="153" cy="141" r="9.5" fill={priority.color} />
            {/* Torn-paper priority label, taped across most of the front face, near the bottom */}
            <g transform="translate(56 172) rotate(-2)">
              <polygon
                points="0,7 7,0 123,4 129,12 126,49 120,54 4,51 0,43"
                fill="var(--box-label)"
                stroke="rgba(40,26,14,.14)"
                strokeWidth=".75"
              />
              {/* Tape patches holding the paper down at each end */}
              <rect x="2" y="2" width="16" height="48" fill="#ffffff" opacity=".14" />
              <rect x="110" y="2" width="16" height="48" fill="#ffffff" opacity=".14" />
              <text x="10" y="27" fill="var(--box-label-text)" fontSize="12.5" fontWeight="800">
                {priority.label.toUpperCase()}
              </text>
              <text x="10" y="42" fill="var(--box-label-text)" fontSize="7.5" fontWeight="600" opacity=".6">
                {counts[priority.key]} task{counts[priority.key] === 1 ? '' : 's'}
              </text>
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
