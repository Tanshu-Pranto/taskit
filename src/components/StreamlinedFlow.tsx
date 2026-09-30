'use client';

import React, { useRef } from 'react';
import { Zap, Layers, CheckCircle2, Check, Clock, Tag } from 'lucide-react';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

interface StepDef {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  features: string[];
}

const STEPS: StepDef[] = [
  {
    step: '01',
    title: 'Create',
    desc: 'Add everything you need to accomplish.',
    icon: <Zap size={20} />,
    features: [
      'Type a task title in seconds',
      'No mandatory fields — just start',
      'Capture ideas before you lose them',
    ],
  },
  {
    step: '02',
    title: 'Organize',
    desc: 'Set priorities, deadlines, categories and reminders.',
    icon: <Layers size={20} />,
    features: [
      'Flag it High, Medium or Low priority',
      'Pin a deadline & reminder',
      'Tag it to a category',
    ],
  },
  {
    step: '03',
    title: 'Complete',
    desc: 'Track your progress and get things done.',
    icon: <CheckCircle2 size={20} />,
    features: [
      'Check it off with one click',
      'Watch your progress bar climb',
      'Get a clear daily win streak',
    ],
  },
];

const DEMO_TITLE = 'Design the landing page';
const RING_RADIUS = 15;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const StreamlinedFlow: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(scrollerRef);

  const totalSteps = STEPS.length;
  const scaled = progress * totalSteps;
  const activeIndex = Math.min(totalSteps - 1, Math.floor(scaled));
  const localProgress = Math.min(1, Math.max(0, scaled - activeIndex));

  const titleLength =
    activeIndex > 0 ? DEMO_TITLE.length : Math.ceil(localProgress * DEMO_TITLE.length);
  const isTyping = activeIndex === 0 && titleLength < DEMO_TITLE.length;

  const badgeVisible = (threshold: number) =>
    activeIndex > 1 || (activeIndex === 1 && localProgress >= threshold);
  const priorityVisible = badgeVisible(0.12);
  const deadlineVisible = badgeVisible(0.45);
  const categoryVisible = badgeVisible(0.78);

  const checked = activeIndex > 2 || (activeIndex === 2 && localProgress >= 0.5);
  const ringPercent = activeIndex === 2 ? Math.round(localProgress * 100) : activeIndex > 2 ? 100 : 0;
  const celebrate = activeIndex === 2 && localProgress >= 0.9;

  const statusBadge =
    activeIndex === 0
      ? { className: 'badge-todo', label: 'To Do' }
      : activeIndex === 1
        ? { className: 'badge-in_progress', label: 'In Progress' }
        : { className: 'badge-completed', label: 'Completed' };

  return (
    <div
      ref={scrollerRef}
      className="flow-scroller"
      style={{ height: `${totalSteps * 100}vh` }}
    >
      <div className="flow-sticky">
        <div className="flow-grid">
          <div className="flow-steps">
            <div className="flow-rail" aria-hidden="true">
              <div
                className="flow-rail-fill"
                style={{ height: `${progress * 100}%`, transition: reducedMotion ? 'none' : undefined }}
              />
            </div>

            {STEPS.map((s, i) => {
              const isActive = i === activeIndex;
              const isDone = i < activeIndex;
              const stepLocal = isActive ? localProgress : isDone ? 1 : 0;

              return (
                <div
                  key={s.step}
                  className={`flow-step ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                >
                  <div className="flow-step-dot">{s.icon}</div>
                  <div className="flow-step-body">
                    <div className="flow-step-index">{s.step}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <ul className="flow-feature-list">
                      {s.features.map((feature, fi) => {
                        const threshold = (fi + 0.4) / s.features.length;
                        const revealed = isDone || (isActive && stepLocal >= threshold);
                        return (
                          <li key={feature} className={revealed ? 'is-visible' : ''}>
                            <Check size={13} aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flow-visual" aria-hidden="true">
            <div className="flow-visual-glow" />
            <div className={`flow-demo-card ${checked ? 'is-checked' : ''} ${celebrate ? 'is-celebrating' : ''}`}>
              <div className="flow-demo-top">
                <span className={`badge ${statusBadge.className}`}>{statusBadge.label}</span>
                <svg className="flow-ring" viewBox="0 0 36 36" style={{ opacity: activeIndex >= 2 ? 1 : 0 }}>
                  <circle className="flow-ring-track" cx="18" cy="18" r={RING_RADIUS} />
                  <circle
                    className="flow-ring-fill"
                    cx="18"
                    cy="18"
                    r={RING_RADIUS}
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={RING_CIRCUMFERENCE * (1 - ringPercent / 100)}
                  />
                </svg>
              </div>

              <div className="flow-demo-title-row">
                <span className={`flow-checkbox ${checked ? 'is-checked' : ''}`}>
                  <Check size={13} />
                </span>
                <h4 className="flow-demo-title">
                  {DEMO_TITLE.slice(0, titleLength)}
                  {isTyping && <span className="flow-caret" />}
                </h4>
              </div>

              <div className="flow-demo-chips">
                <span className={`badge badge-high flow-chip ${priorityVisible ? 'is-visible' : ''}`}>
                  High priority
                </span>
                <span className={`tag-pill flow-chip ${deadlineVisible ? 'is-visible' : ''}`}>
                  <Clock size={12} /> Tomorrow, 5:00 PM
                </span>
                <span className={`tag-pill flow-chip ${categoryVisible ? 'is-visible' : ''}`}>
                  <Tag size={12} /> Design
                </span>
              </div>
            </div>
            <div className="flow-visual-caption">Live preview — mirrors what you&apos;ll see in your dashboard</div>
          </div>
        </div>
      </div>
    </div>
  );
};
