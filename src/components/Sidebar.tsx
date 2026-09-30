'use client';

import React from 'react';
import {
  CheckSquare,
  LayoutDashboard,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  CalendarDays,
  FolderTree,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  AlarmClock
} from 'lucide-react';
import { ActiveTab, ThemeMode, UserProfile, Category } from '@/types/task';
import { TaskitLogo } from './TaskitLogo';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  user: UserProfile;
  onLogout: () => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
  categories: Category[];
  taskCounts: {
    total: number;
    today: number;
    upcoming: number;
    completed: number;
  };
  onNewTaskClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  user,
  onLogout,
  theme,
  onThemeToggle,
  categories,
  taskCounts,
  onNewTaskClick,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'tasks', label: 'My Tasks', icon: <CheckSquare size={18} />, badge: taskCounts.total },
    { id: 'today', label: 'Today', icon: <Clock size={18} />, badge: taskCounts.today },
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays size={18} />, badge: taskCounts.upcoming },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={18} /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={18} />, badge: taskCounts.completed },
    { id: 'routine', label: 'Routine', icon: <AlarmClock size={18} /> },
    { id: 'categories', label: 'Categories', icon: <FolderTree size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const sidebarContent = (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        padding: collapsed ? '16px 10px' : '20px 16px',
        width: collapsed ? '72px' : '260px',
        transition: 'width var(--transition), padding var(--transition)',
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TaskitLogo size={30} showWordmark={!collapsed} />
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          className="btn btn-ghost hide-mobile"
          style={{ padding: '6px', color: 'var(--text-muted)' }}
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Close button on mobile */}
        {mobileOpen && (
          <button
            className="btn btn-ghost"
            style={{ padding: '6px' }}
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Quick Add Task Button */}
      <button
        id="sidebar-add-task-btn"
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: collapsed ? '10px 0' : '10px 16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'center',
        }}
        onClick={onNewTaskClick}
      >
        <Plus size={18} />
        {!collapsed && <span>New Task</span>}
      </button>

      {/* Main Navigation List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className="btn"
              style={{
                width: '100%',
                justifyContent: collapsed ? 'center' : 'space-between',
                padding: collapsed ? '10px 0' : '9px 12px',
                background: isActive ? 'var(--primary-subtle)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
              }}
              onClick={() => {
                onTabChange(item.id);
                if (mobileOpen) onCloseMobile();
              }}
              title={collapsed ? item.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: isActive ? 'var(--primary)' : 'inherit' }}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Categories Section in Sidebar */}
        {!collapsed && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px 8px 8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-muted)',
              }}
            >
              <span>Categories</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 12px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    onTabChange('tasks');
                    if (mobileOpen) onCloseMobile();
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: cat.color,
                      flexShrink: 0,
                    }}
                  />
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Profile & Theme Toggle */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Theme mode toggle */}
        <button
          className="btn btn-ghost"
          style={{
            width: '100%',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '8px 0' : '8px 12px',
            fontSize: '0.85rem',
          }}
          onClick={onThemeToggle}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </div>
        </button>

        {/* User Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '6px 0' : '6px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--border-color)',
              }}
            />
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              className="btn btn-ghost"
              style={{ padding: '6px', color: 'var(--text-muted)' }}
              title="Sign Out"
              onClick={onLogout}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hide-mobile" style={{ height: '100vh', position: 'sticky', top: 0, zIndex: 30 }}>
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 150,
            display: 'flex',
          }}
          onClick={onCloseMobile}
        >
          <div
            style={{ width: '280px', height: '100%', animation: 'slideInRight 0.2s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
