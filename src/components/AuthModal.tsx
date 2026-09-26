'use client';

import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { UserProfile } from '@/types/task';
import { INITIAL_USER } from '@/lib/initialData';
import { TaskitLogo } from './TaskitLogo';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup' | 'forgot';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submittedForgot, setSubmittedForgot] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setSubmittedForgot(true);
      return;
    }
    // Authenticate user
    const loggedUser: UserProfile = {
      ...INITIAL_USER,
      name: name || INITIAL_USER.name,
      email: email || INITIAL_USER.email,
    };
    onLoginSuccess(loggedUser);
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess(INITIAL_USER);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-pop"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-surface)',
          padding: '32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="btn btn-ghost"
          style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px' }}
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Brand */}
        <div style={{ marginBottom: '20px' }}>
          <TaskitLogo size={32} />
        </div>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
            {mode === 'login' && 'Welcome back'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' && 'Sign in to access your task dashboard and team projects.'}
            {mode === 'signup' && 'Start organizing your workflow with a free 14-day trial.'}
            {mode === 'forgot' && "Enter your email address and we'll send a recovery link."}
          </p>
        </div>

        {/* Demo Fast Login Pill */}
        {mode !== 'forgot' && (
          <button
            type="button"
            className="btn card-interactive"
            onClick={handleDemoLogin}
            style={{
              width: '100%',
              marginBottom: '20px',
              padding: '10px 16px',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--border-focus)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            <Sparkles size={16} />
            <span>Instant Demo Access (1-Click)</span>
          </button>
        )}

        {submittedForgot ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: 'var(--status-completed)', fontWeight: 600, marginBottom: '12px' }}>
              Reset instructions sent to {email || 'your email'}!
            </p>
            <button className="btn btn-secondary" onClick={() => setMode('login')}>
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', paddingLeft: '36px' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="alex.rivera@taskflow.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '36px' }}
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer' }}
                      onClick={() => setMode('forgot')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', paddingLeft: '36px' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 16px', marginTop: '6px' }}
            >
              <span>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Free Account' : 'Send Reset Link'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Mode Switcher */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {mode === 'login' && (
            <span>
              Don&apos;t have an account?{' '}
              <button
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </span>
          )}
          {mode === 'signup' && (
            <span>
              Already have an account?{' '}
              <button
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setMode('login')}
              >
                Sign in
              </button>
            </span>
          )}
          {mode === 'forgot' && (
            <button
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => {
                setMode('login');
                setSubmittedForgot(false);
              }}
            >
              Back to Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
