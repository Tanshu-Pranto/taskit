'use client';

import React, { useState } from 'react';
import { Search, Plus, Bell, Menu, AlertTriangle, Clock3 } from 'lucide-react';
import { DeadlineReminder } from '@/lib/reminders';

interface DashboardHeaderProps {
  userName: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewTask: () => void;
  onOpenMobileMenu: () => void;
  notifications: DeadlineReminder[];
  onClearNotifications: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  searchQuery,
  onSearchChange,
  onOpenNewTask,
  onOpenMobileMenu,
  notifications,
  onClearNotifications,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
        padding: '18px 32px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(var(--bg-app-rgb), 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
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
            <span>{getGreeting()}{userName ? `, ${userName.split(' ')[0]}` : ''}</span>
          </h1>
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
            placeholder="Search tasks"
            aria-label="Search tasks"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '36px',
              paddingRight: '48px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
            }}
          />
          {!searchQuery && (
            <kbd
              className="hide-mobile"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '1px 7px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-subtle)',
                fontFamily: 'inherit',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            >
              ⌘K
            </kbd>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '8px', borderRadius: 'var(--radius-full)' }}
            title="Reminders"
            aria-label={notifications.length > 0 ? `Reminders (${notifications.length})` : 'Reminders'}
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <Bell size={18} />
          </button>
          {notifications.length > 0 && (
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

          {notificationsOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setNotificationsOpen(false)} />
              <div
                className="card"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '320px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  background: 'var(--bg-modal)',
                  zIndex: 91,
                  padding: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 10px 8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Reminders</span>
                  {notifications.length > 0 && (
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                      onClick={onClearNotifications}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div style={{ padding: '18px 8px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    You&apos;re all caught up.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-subtle)',
                        }}
                      >
                        {n.kind === 'due-today' ? (
                          <AlertTriangle size={15} color="var(--priority-urgent)" style={{ marginTop: '1px', flexShrink: 0 }} />
                        ) : (
                          <Clock3 size={15} color="var(--primary)" style={{ marginTop: '1px', flexShrink: 0 }} />
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {n.taskTitle}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {n.kind === 'due-today' ? 'Due today' : 'Due tomorrow'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
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
