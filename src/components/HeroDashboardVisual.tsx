'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  Sun,
  Moon,
  Bot,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { TaskitLogo } from './TaskitLogo';

interface HeroDashboardVisualProps {
  onEnterApp?: () => void;
}

const WEEK_DAYS = [
  { label: 'Mon', date: 22 },
  { label: 'Tue', date: 23 },
  { label: 'Wed', date: 24 },
  { label: 'Thu', date: 25 },
  { label: 'Fri', date: 26 },
  { label: 'Sat', date: 27 },
];

const GROWTH_POINTS = [
  { label: 'Strategy', pct: 88 },
  { label: 'Leadership', pct: 94 },
  { label: 'Efficiency', pct: 96 },
];

export const HeroDashboardVisual: React.FC<HeroDashboardVisualProps> = ({ onEnterApp }) => {
  const [internalTheme, setInternalTheme] = useState<'dark' | 'light'>('dark');
  const [mainTaskDone, setMainTaskDone] = useState(false);
  const [scoreCounter, setScoreCounter] = useState(1820);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2600);
  };

  const handleMainTaskDetails = () => {
    if (mainTaskDone) return;
    setMainTaskDone(true);
    setScoreCounter((s) => s + 180);
    triggerToast('Main task marked complete (+180 pts)');
  };

  const isLight = internalTheme === 'light';
  const surface = isLight ? '#ffffff' : 'rgba(13, 30, 22, 0.85)';
  const border = isLight ? 'rgba(16, 38, 26, 0.1)' : 'rgba(255, 255, 255, 0.08)';
  const textMain = isLight ? '#081710' : '#f1fbf5';
  const textMuted = isLight ? '#748c80' : '#8ea69b';
  const shell = isLight ? '#eef6f1' : '#060e0a';

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1140px', margin: '0 auto' }}>
      {/* Floating completion toast */}
      {showToast && (
        <div
          style={{
            position: 'absolute',
            top: '-22px',
            right: '24px',
            zIndex: 20,
            background: 'rgba(0, 245, 155, 0.95)',
            color: '#03150d',
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 10px 30px rgba(0, 245, 155, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          className="animate-pop"
        >
          <CheckCircle2 size={14} /> {showToast}
        </div>
      )}

      <div
        className="card"
        style={{
          display: 'flex',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          background: shell,
          border: `1px solid ${border}`,
        }}
      >
        {/* Icon rail */}
        <div
          style={{
            width: '58px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            padding: '18px 0',
            background: isLight ? '#ffffff' : 'rgba(6, 14, 10, 0.6)',
            borderRight: `1px solid ${border}`,
          }}
        >
          <TaskitLogo size={26} showWordmark={false} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {[Home, CheckSquare, Calendar, BarChart3].map((Icon, i) => (
              <div
                key={i}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: i === 0 ? 'var(--primary)' : 'transparent',
                  color: i === 0 ? '#03150d' : textMuted,
                  boxShadow: i === 0 ? 'var(--primary-glow-soft)' : 'none',
                }}
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, padding: '18px 22px' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <button
              className="theme-switch-pill"
              onClick={() => setInternalTheme(isLight ? 'dark' : 'light')}
              style={{ flexShrink: 0 }}
              title="Preview theme"
            >
              <span className={`theme-switch-pill-item ${!isLight ? 'active' : ''}`}><Moon size={13} /></span>
              <span className={`theme-switch-pill-item ${isLight ? 'active' : ''}`}><Sun size={13} /></span>
            </button>

            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                background: surface,
                border: `1px solid ${border}`,
                color: textMuted,
                fontSize: '0.8rem',
              }}
            >
              <Search size={14} />
              Search workspace or ask AI...
            </div>

            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: surface,
                border: `1px solid ${border}`,
                color: textMuted,
                flexShrink: 0,
              }}
            >
              <Bell size={15} />
            </div>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f59b 0%, #059669 100%)',
                flexShrink: 0,
              }}
            />
          </div>

          {/* Row 1: calendar + growth points */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(180px, 1fr)', gap: '14px', marginBottom: '14px' }}>
            <div className="card" style={{ padding: '14px 16px', background: surface, border: `1px solid ${border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="tag-pill" style={{ fontSize: '0.68rem' }}>Last Week</span>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: textMain }}>December 23</span>
                <span className="tag-pill" style={{ fontSize: '0.68rem' }}>Next Week</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', textAlign: 'center' }}>
                {WEEK_DAYS.map((d) => (
                  <div key={d.label}>
                    <div style={{ fontSize: '0.62rem', color: textMuted, fontWeight: 700 }}>{d.label}</div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: d.date === 23 ? 800 : 600,
                        color: d.date === 23 ? 'var(--primary)' : textMain,
                      }}
                    >
                      {d.date}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, padding: '6px 10px', borderRadius: '8px', background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
                  Design Sync <span style={{ fontWeight: 500, opacity: 0.8 }}>· Design workshop</span>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, padding: '6px 10px', borderRadius: '8px', background: 'var(--bg-subtle)', color: textMain }}>
                  Team Building <span style={{ fontWeight: 500, opacity: 0.7 }}>· Project update</span>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: '16px',
                background: 'var(--growth-gradient)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem', marginBottom: '12px' }}>Growth points</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {GROWTH_POINTS.map((g) => (
                  <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className="btn-pill"
                      style={{
                        flex: 1,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#fff',
                        background: 'rgba(3, 21, 13, 0.5)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        padding: '6px 12px',
                      }}
                    >
                      {g.label}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>{g.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: team, score/gauge, AI co-pilot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(140px, 0.8fr) minmax(0, 1.1fr)', gap: '14px' }}>
            <div className="card" style={{ padding: '14px', background: surface, border: `1px solid ${border}` }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: textMain }}>Team</div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ flex: 1, aspectRatio: '3/4', borderRadius: '6px', background: isLight ? '#f1f5f3' : 'rgba(255,255,255,0.06)', border: `1px solid ${border}` }} />
                ))}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', marginBottom: '4px' }}>Goal</div>
              <p style={{ fontSize: '0.72rem', color: textMuted, lineHeight: 1.5, margin: 0 }}>
                Driving a 50% revenue surge and securing high-impact partnerships through sustainable scaling.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '12px 14px', background: surface, border: `1px solid ${border}` }}>
                <div style={{ fontSize: '0.68rem', color: textMuted, fontWeight: 700, marginBottom: '4px' }}>Current Score</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: textMain }}>{scoreCounter}</div>
              </div>
              <div className="card" style={{ padding: '12px 14px', background: surface, border: `1px solid ${border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: textMuted, fontWeight: 700, textAlign: 'left', marginBottom: '2px' }}>Main task</div>
                <div style={{ position: 'relative', width: '96px', height: '56px', margin: '2px auto' }}>
                  <svg width="96" height="56" viewBox="0 0 96 56">
                    <path d="M 10 50 A 38 38 0 0 1 86 50" fill="none" stroke={isLight ? '#e3f0e8' : 'rgba(255,255,255,0.1)'} strokeWidth="8" strokeLinecap="round" />
                    <path
                      d="M 10 50 A 38 38 0 0 1 86 50"
                      fill="none"
                      stroke="url(#heroGaugeGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={119.4}
                      strokeDashoffset={mainTaskDone ? 0 : 30}
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                    <defs>
                      <linearGradient id="heroGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff7e36" />
                        <stop offset="60%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#00f59b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', bottom: '-2px', left: '50%', transform: 'translateX(-50%)' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1, color: textMain }}>{mainTaskDone ? '100' : '76'}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 700 }}>{mainTaskDone ? 'Complete' : 'Excellent'}</div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.72rem', padding: '6px 0', marginTop: '4px' }} onClick={handleMainTaskDetails}>
                  Details
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: '14px', background: surface, border: `1px solid ${border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Bot size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain }}>AI Co-pilot</span>
              </div>
              <p style={{ fontSize: '0.68rem', color: textMuted, lineHeight: 1.4, margin: '0 0 10px 0' }}>
                A strategic review of your performance metrics and milestones is ready.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: textMuted, fontWeight: 700 }}>Active goals</span>
                <span className="badge badge-medium" style={{ fontSize: '0.6rem' }}>48</span>
                <span style={{ marginLeft: 'auto', fontSize: '1.2rem', fontWeight: 800, color: textMain }}>84%</span>
                <span style={{ fontSize: '0.62rem', color: textMuted }}>this week</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  { label: 'Primary goal', title: 'Scalable Design Ops', badge: 'badge-completed', status: 'Done' },
                  { label: 'Goal 2', title: 'Streamline Delivery', badge: 'badge-in_progress', status: 'In Progress' },
                  { label: 'Goal 3', title: 'Cross-team Alignment', badge: 'badge-urgent', status: 'Closed' },
                ].map((g) => (
                  <div key={g.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: '6px', background: isLight ? '#f1f5f3' : 'rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: textMuted }}>{g.label}</span>
                    <span style={{ fontSize: '0.66rem', fontWeight: 600, color: textMain, flex: 1, margin: '0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</span>
                    <span className={`badge ${g.badge}`} style={{ fontSize: '0.55rem', padding: '2px 7px' }}>{g.status}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: '10px', fontSize: '0.68rem', padding: '2px 0', color: 'var(--primary)' }} onClick={onEnterApp}>
                Open dashboard <ArrowUpRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
