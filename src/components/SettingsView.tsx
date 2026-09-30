'use client';

import React, { useState } from 'react';
import { UserProfile, ThemeMode, Priority, Category } from '@/types/task';
import { 
  User, 
  Palette, 
  Bell, 
  Sliders, 
  ShieldAlert, 
  Save, 
  Download, 
  RotateCcw, 
  Check, 
  Sun, 
  Moon 
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  categories: Category[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onResetData: () => void;
  onExportData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  categories,
  onUpdateUser,
  theme,
  onThemeChange,
  onResetData,
  onExportData,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [avatar, setAvatar] = useState(user.avatar);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled);
  const [emailRemindersEnabled, setEmailRemindersEnabled] = useState(user.emailRemindersEnabled);
  const [defaultPriority, setDefaultPriority] = useState<Priority>(user.defaultPriority || 'medium');
  const [defaultCategory, setDefaultCategory] = useState(user.defaultCategory || 'Work');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      role,
      avatar,
      notificationsEnabled,
      emailRemindersEnabled,
      defaultPriority,
      defaultCategory,
      theme,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 32px 48px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
          Settings & Preferences
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Manage your account profile, theme appearance, notifications, and default task attributes.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <User size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Profile Information</h3>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <img
              src={avatar}
              alt={name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border-color)',
              }}
            />
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Job Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Appearance & Theme Card */}
        <div className="card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Palette size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Appearance & Theme</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Dark Theme Option */}
            <div
              className="card"
              style={{
                padding: '16px',
                cursor: 'pointer',
                background: '#111827',
                border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#f8fafc',
              }}
              onClick={() => onThemeChange('dark')}
            >
              <Moon size={22} color={theme === 'dark' ? 'var(--primary)' : '#94a3b8'} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dark Theme</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Slate near-black background</div>
              </div>
            </div>

            {/* Light Theme Option */}
            <div
              className="card"
              style={{
                padding: '16px',
                cursor: 'pointer',
                background: '#ffffff',
                border: theme === 'light' ? '2px solid var(--primary)' : '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#0f172a',
              }}
              onClick={() => onThemeChange('light')}
            >
              <Sun size={22} color={theme === 'light' ? 'var(--primary)' : '#64748b'} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Light Theme</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>White & light-gray background</div>
              </div>
            </div>
          </div>
        </div>

        {/* Default Task Settings */}
        <div className="card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Sliders size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Default Task Settings</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Default Priority
              </label>
              <select
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value as Priority)}
                style={{ width: '100%' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                Default Category
              </label>
              <select
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value)}
                style={{ width: '100%' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Sound */}
        <div className="card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Bell size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Notifications</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>In-app reminders</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Get a notification and toast when a high-priority task is due tomorrow or today.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Email me too <span className="badge badge-todo" style={{ marginLeft: '6px' }}>Coming soon</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Also send these as email. This needs an email provider connected on the server, so it&apos;s off for now — your preference is saved and will take effect once that&apos;s wired up.
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailRemindersEnabled}
                onChange={(e) => setEmailRemindersEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Action button bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 600 }}>
            <Save size={18} />
            <span>Save Preferences</span>
          </button>
          {savedSuccess && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-completed)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Check size={16} /> Saved successfully!
            </span>
          )}
        </div>

        {/* Account & Data Management */}
        <div className="card" style={{ padding: '24px', background: 'var(--bg-surface)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <ShieldAlert size={20} color="#ef4444" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444' }}>Data & Account Management</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Export all your tasks as JSON for backup, or restore the original demo sample data.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onExportData}
            >
              <Download size={16} />
              <span>Export Tasks as JSON</span>
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={onResetData}
            >
              <RotateCcw size={16} />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
