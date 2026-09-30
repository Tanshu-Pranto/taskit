'use client';

import React from 'react';
import {
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  CheckSquare,
  Calendar,
  Search,
  Clock,
  TrendingUp,
  FolderPlus,
  Target,
  ChevronRight
} from 'lucide-react';
import { ThemeMode } from '@/types/task';
import { TaskitLogo } from './TaskitLogo';
import { Mascot } from './Mascot';
import { HeroPriorityScene } from './HeroPriorityScene';
import { InfiniteCardCarousel } from './InfiniteCardCarousel';
import { StreamlinedFlow } from './StreamlinedFlow';

interface LandingPageProps {
  theme: ThemeMode;
  onThemeToggle: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  theme,
  onThemeToggle,
  onOpenAuth,
  onEnterDashboard,
}) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      {/* Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(var(--bg-surface), 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '14px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <TaskitLogo size={34} />

          {/* Nav Links */}
          <nav
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            <a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color var(--transition)' }}>
              Features
            </a>
            <a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none', transition: 'color var(--transition)' }}>
              How It Works
            </a>
            <a href="#productivity" style={{ color: 'inherit', textDecoration: 'none', transition: 'color var(--transition)' }}>
              Productivity
            </a>
            <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none', transition: 'color var(--transition)' }}>
              Pricing
            </a>
          </nav>

          {/* Actions & Theme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn btn-ghost"
              style={{ padding: '8px', borderRadius: '50%' }}
              onClick={onThemeToggle}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="btn btn-ghost hide-mobile"
              onClick={() => onOpenAuth('login')}
            >
              Login
            </button>

            <button
              className="btn btn-primary"
              onClick={() => onOpenAuth('signup')}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '90px 24px 70px 24px',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Background Glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="mascot-grid" style={{ maxWidth: '1140px', margin: '0 auto 60px auto', position: 'relative', zIndex: 1 }}>
          <div className="mascot-text">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '24px',
                border: '1px solid var(--border-focus)',
              }}
            >
              <Sparkles size={14} />
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Your Productivity, Your Way
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.6rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
              }}
            >
              Turn Your Tasks<br />
              Into <span style={{ color: 'var(--primary)' }}>Progress.</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '480px',
                margin: '0 0 36px 0',
              }}
            >
              Organize your workload and take control of your day.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              <button
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 600 }}
                onClick={onEnterDashboard}
              >
                Get Started — It&apos;s Free
                <ArrowRight size={18} />
              </button>
              <a
                href="#features"
                className="btn btn-secondary"
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                Explore Taskit
              </a>
            </div>
          </div>

          {/* Mascot scene — the character mid-task, with floating UI bits */}
          <div className="mascot-visual">
            <div style={{ position: 'relative', width: '340px', height: '340px' }}>
              <Mascot size={260} pose="holding" animate style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />

              <div
                className="card floating-card"
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '-10px',
                  width: '172px',
                  padding: '12px 14px',
                  zIndex: 2,
                  ['--float-rotate' as string]: '-6deg',
                }}
              >
                {['Plan my day', 'Study for exam', 'Build Taskit'].map((item, i) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '0.78rem', fontWeight: 600 }}>
                    <span
                      style={{
                        width: '15px',
                        height: '15px',
                        borderRadius: '5px',
                        border: i === 0 ? 'none' : '1.5px solid var(--border-color)',
                        background: i === 0 ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {i === 0 && <CheckCircle2 size={11} color="#fff" strokeWidth={3} />}
                    </span>
                    <span style={{ textDecoration: i === 0 ? 'line-through' : 'none', color: i === 0 ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <span
                className="handwritten-note"
                style={{ position: 'absolute', top: '20px', right: '-8px', transform: 'rotate(6deg)' }}
              >
                Small steps.<br />Big goals!
              </span>
            </div>
          </div>
        </div>

        {/* Animated Product Visualization */}
        <div
          style={{
            maxWidth: '1140px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <HeroPriorityScene onOpenAuth={onOpenAuth} />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          padding: '80px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div className="mascot-grid" style={{ marginBottom: '56px' }}>
          <div className="mascot-text">
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--primary)',
              }}
            >
              Powerful Features
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Everything you need to stay on track.
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px' }}>
              From daily to-dos to long-term goals, Taskit keeps you organized, focused, and motivated — all in one place.
            </p>
          </div>

          {/* Mascot peeking over a mini priority board */}
          <div className="mascot-visual">
            <div style={{ position: 'relative', width: '300px', height: '260px' }}>
              <Mascot size={190} pose="wave" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }} />

              <div
                className="card"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '280px',
                  padding: '14px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '8px',
                  zIndex: 2,
                }}
              >
                {[
                  { label: 'High', color: '#ef4444', items: ['Finish project'] },
                  { label: 'Medium', color: '#f59e0b', items: ['Read a book'] },
                  { label: 'Low', color: '#9ca3af', items: ['Clean room'] },
                ].map((col) => (
                  <div key={col.label}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '999px',
                        marginBottom: '6px',
                        color: col.color,
                        background: `color-mix(in srgb, ${col.color}, transparent 85%)`,
                      }}
                    >
                      {col.label}
                    </span>
                    {col.items.map((item) => (
                      <div key={item} style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <span
                className="handwritten-note"
                style={{ position: 'absolute', top: '-6px', left: '-10px', fontSize: '1.15rem', transform: 'rotate(-6deg)' }}
              >
                Prioritize like a pro!
              </span>
            </div>
          </div>
        </div>

        <InfiniteCardCarousel
          items={[
            {
              icon: <CheckSquare size={28} />,
              color: 'var(--primary)',
              title: 'Smart Task Management',
              desc: 'Create, organize, edit and complete tasks effortlessly.',
            },
            {
              icon: <Target size={28} />,
              color: '#fbbf24',
              title: 'Priorities That Matter',
              desc: 'Set priority levels and focus on important work.',
            },
            {
              icon: <Clock size={28} />,
              color: '#ff5757',
              title: 'Deadlines & Reminders',
              desc: 'Never miss an important deadline.',
            },
            {
              icon: <Calendar size={28} />,
              color: '#0ea5e9',
              title: 'Calendar Planning',
              desc: 'See your tasks across days and weeks.',
            },
            {
              icon: <TrendingUp size={28} />,
              color: '#10b981',
              title: 'Progress Tracking',
              desc: 'Understand how much you’ve accomplished.',
            },
            {
              icon: <Search size={28} />,
              color: '#8b5cf6',
              title: 'Powerful Search',
              desc: 'Find any task instantly.',
            },
            {
              icon: <FolderPlus size={28} />,
              color: '#ec4899',
              title: 'Categories & Tags',
              desc: 'Organize tasks around projects, work, university, and personal goals.',
            },
            {
              icon: (
                <span style={{ display: 'inline-flex', gap: '4px' }}>
                  <Sun size={24} />
                  <Moon size={24} />
                </span>
              ),
              color: 'var(--primary)',
              title: 'Dark & Light Mode',
              desc: 'A beautiful experience in any environment.',
            },
          ]}
        />
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        style={{
          padding: '80px 24px',
          background: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--primary)',
              }}
            >
              Streamlined Flow
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '12px auto 0 auto' }}>
              Three simple steps to get things done.
            </p>
          </div>

          <StreamlinedFlow />
        </div>
      </section>

      {/* Productivity Section */}
      <section
        id="productivity"
        style={{
          padding: '80px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--primary)',
              }}
            >
              Actionable Intelligence
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', marginBottom: '16px' }}>
              Real-time insights on what gets done
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              See how deadlines, priorities, and subtasks connect, at a glance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Live progress tracking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Overdue warnings before deadlines slip</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Tags and categories for every project</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ padding: '10px 20px' }}
              onClick={onEnterDashboard}
            >
              Launch Dashboard Demo
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Productivity Dashboard Card */}
          <div
            className="card"
            style={{
              padding: '24px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This Week</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your productivity, at a glance.</div>
              </div>
              <span className="badge badge-completed">84% on track</span>
            </div>

            {/* Weekly Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Weekly Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>84%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '84%', background: 'var(--primary)', borderRadius: '999px', boxShadow: 'var(--primary-glow-soft)' }} />
              </div>
            </div>

            {/* Quick stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Tasks</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>24</div>
              </div>
              <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Progress</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>8</div>
              </div>
              <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>12</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        style={{
          padding: '80px 24px',
          background: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--primary)',
            }}
          >
            Transparent Plans
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px' }}>
            Choose the plan that fits you
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '12px auto 48px auto' }}>
            Start for free. Upgrade when you need team collaboration or advanced analytics.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              textAlign: 'left',
            }}
          >
            {/* Starter */}
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>Starter</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                For individual builders and students.
              </p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>
                $0 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ forever</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Unlimited tasks & subtasks</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Kanban and List views</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Local storage sync</li>
              </ul>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onEnterDashboard}>
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div
              className="card"
              style={{
                padding: '32px',
                background: 'var(--bg-surface)',
                border: '2px solid var(--primary)',
                position: 'relative',
                boxShadow: 'var(--primary-glow)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                MOST POPULAR
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>Professional</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                For power users managing complex projects.
              </p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>
                $8 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Everything in Starter</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Interactive Calendar view</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Custom categories & tags</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Velocity & productivity charts</li>
              </ul>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onOpenAuth('signup')}>
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Team */}
            <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>Team</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                For teams shipping fast, together.
              </p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>
                $16 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ seat / mo</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Everything in Pro</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Shared workspaces & projects</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--primary)" /> Audit logs & SAML SSO</li>
              </ul>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => onOpenAuth('signup')}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            position: 'relative',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            padding: '48px 40px',
          }}
        >
          <div className="mascot-grid" style={{ position: 'relative', zIndex: 1 }}>
            <div className="mascot-visual">
              <Mascot size={180} pose="wave" animate />
            </div>

            <div className="mascot-text" style={{ position: 'relative' }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Ready to be more productive?
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
                Join Taskit today and turn your goals into progress.
              </p>
              <button
                className="btn btn-primary"
                style={{ padding: '14px 32px', fontSize: '1.05rem', fontWeight: 600 }}
                onClick={onEnterDashboard}
              >
                Get Started Free
                <ArrowRight size={20} />
              </button>
              <span
                className="handwritten-note hide-mobile"
                style={{ position: 'absolute', top: '-6px', right: '6px', transform: 'rotate(5deg)' }}
              >
                Let&apos;s do this!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-color)',
          padding: '60px 24px 32px 24px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand info */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <TaskitLogo size={30} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '320px' }}>
              Plan Better. Do More.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
              <a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>Workflow</a>
              <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
              <a href="#productivity" style={{ color: 'inherit', textDecoration: 'none' }}>Productivity</a>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          © {new Date().getFullYear()} Taskit. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
