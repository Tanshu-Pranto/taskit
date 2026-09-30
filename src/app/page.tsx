'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeMode, UserProfile } from '@/types/task';
import { LandingPage } from '@/components/LandingPage';
import { AuthModal } from '@/components/AuthModal';
import { Toast } from '@/components/Toast';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { promoteStagedTasks } from '@/lib/stagedTasks';

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useLocalStorageState<ThemeMode>(STORAGE_KEYS.THEME, 'dark');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Carries any tasks staged in the hero's priority boxes into the
  // dashboard, then navigates. The merge is a synchronous localStorage
  // write in this click handler, not a mount effect.
  const goToDashboard = () => {
    const imported = promoteStagedTasks();
    if (imported > 0) {
      const id = `toast-${Date.now()}`;
      setToasts((prev) => [...prev, { id, type: 'success', message: `${imported} task${imported === 1 ? '' : 's'} added to your dashboard` }]);
      window.setTimeout(() => router.push('/dashboard'), 650);
    } else {
      router.push('/dashboard');
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    goToDashboard();
  };

  return (
    <>
      <LandingPage
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onEnterDashboard={goToDashboard}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Toast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </>
  );
}
