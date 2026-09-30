'use client';

import React from 'react';
import { Mascot } from './Mascot';

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
      <Mascot size={size} style={{ flexShrink: 0 }} />

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
