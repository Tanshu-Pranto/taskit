'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeMode, UserProfile } from '@/types/task';
import { LandingPage } from '@/components/LandingPage';
import { AuthModal } from '@/components/AuthModal';
import { Toast } from '@/components/Toast';
import { useLocalStorageState } from '@/lib/useLocalStorageState';

const STORAGE_KEYS = {
  THEME: 'taskflow_saas_theme_v2',
  USER: 'taskflow_saas_user_v2',
};

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

  const handleLoginSuccess = (user: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    router.push('/dashboard');
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
        onEnterDashboard={() => {
          router.push('/dashboard');
        }}
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
