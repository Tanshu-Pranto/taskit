'use client';

import React from 'react';
import { Search, Plus, Bell, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewTask: () => void;
  onOpenMobileMenu: () => void;
  unreadCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  searchQuery,
  onSearchChange,
  onOpenNewTask,
  onOpenMobileMenu,
  unreadCount = 2,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '24px 32px 16px 32px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-app)',
      }}
    >
      {/* Greeting and Mobile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          className="btn btn-ghost"
          style={{ display: 'none', padding: '6px' }}
          id="mobile-menu-trigger"
          onClick={onOpenMobileMenu}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{getGreeting()}{userName ? `, ${userName.split(' ')[0]}` : ''} 👋</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            Here&apos;s what you need to accomplish today.
          </p>
        </div>
      </div>

      {/* Search Bar & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', justifyContent: 'flex-end' }}>
        {/* Search */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search tasks (⌘K)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '36px',
              paddingRight: '12px',
              height: '38px',
            }}
          />
        </div>

        {/* Notifications Icon */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
            title="Notifications"
          >
            <Bell size={18} />
          </button>
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--primary)',
                border: '2px solid var(--bg-app)',
              }}
            />
          )}
        </div>

        {/* Prominent Add Task Button */}
        <button
          id="header-add-task-btn"
          className="btn btn-primary"
          style={{ padding: '9px 18px', fontWeight: 600 }}
          onClick={onOpenNewTask}
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          #mobile-menu-trigger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};
