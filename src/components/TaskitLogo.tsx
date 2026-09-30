'use client';

import React from 'react';

interface TaskitLogoProps {
  size?: number;
  showWordmark?: boolean;
  tagline?: boolean;
  className?: string;
}

export const TaskitLogo: React.FC<TaskitLogoProps> = ({
  size = 32,
  showWordmark = true,
  tagline = false,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size > 28 ? '10px' : '8px' }}>
      {/* Geometric Multi-Tier Growth Canopy Icon */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${Math.max(8, Math.round(size * 0.3))}px`,
          background: 'linear-gradient(135deg, #ff8a3d 0%, #ff4d2e 100%)',
          boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#fffaf7',
        }}
      >
        <svg
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.5L16 6.5H8L12 2.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
          <path d="M12 6.5L18.5 12H5.5L12 6.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" opacity="0.95" />
          <path d="M12 11.5L21 18H3L12 11.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" opacity="0.9" />
          <rect x="10.8" y="18" width="2.4" height="3.5" rx="1" fill="currentColor" />
        </svg>
      </div>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: `${Math.max(16, Math.round(size * 0.62))}px`,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
                lineHeight: 1.1,
              }}
            >
              Taskit
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '999px',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                border: '1px solid rgba(255, 107, 53, 0.25)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              PRO
            </span>
          </div>
          {tagline && (
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              Plan Better. Do More.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
