'use client';

import React, { useId } from 'react';

interface MascotProps {
  size?: number;
  className?: string;
  /** 'happy' is the default grin; 'sleepy' half-closed eyes for empty/idle states. */
  mood?: 'happy' | 'sleepy';
  /** Adds a soft bob animation (respects prefers-reduced-motion via CSS). */
  animate?: boolean;
  style?: React.CSSProperties;
}

/**
 * Taskit's flame mascot — a glossy, rounded flame character built entirely
 * in SVG (gradients + highlight blobs, no raster assets) so it stays crisp
 * at favicon size and at full hero size alike. Gradient ids are namespaced
 * per instance via useId so multiple copies on one page don't collide.
 */
export const Mascot: React.FC<MascotProps> = ({ size = 96, className, mood = 'happy', animate = false, style }) => {
  const uid = useId().replace(/[:]/g, '');
  const bodyGrad = `mascot-body-${uid}`;
  const headGrad = `mascot-head-${uid}`;
  const glow = `mascot-glow-${uid}`;
  const sheen = `mascot-sheen-${uid}`;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', animation: animate ? 'mascotBob 3.2s ease-in-out infinite' : undefined, ...style }}
      role="img"
      aria-label="Taskit flame mascot"
    >
      <defs>
        <linearGradient id={headGrad} x1="20%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#ffcb8a" />
          <stop offset="38%" stopColor="#ff8a3d" />
          <stop offset="75%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#c73f14" />
        </linearGradient>
        <linearGradient id={bodyGrad} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ff8a3d" />
          <stop offset="100%" stopColor="#d9481a" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={sheen} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow behind the character */}
      <ellipse cx="100" cy="120" rx="95" ry="95" fill={`url(#${glow})`} />

      {/* Ground contact shadow */}
      <ellipse cx="100" cy="204" rx="42" ry="8" fill="#000000" opacity="0.22" />

      {/* Stubby legs */}
      <ellipse cx="80" cy="196" rx="14" ry="10" fill={`url(#${bodyGrad})`} />
      <ellipse cx="120" cy="196" rx="14" ry="10" fill={`url(#${bodyGrad})`} />

      {/* Rounded body */}
      <ellipse cx="100" cy="172" rx="34" ry="30" fill={`url(#${bodyGrad})`} />
      <ellipse cx="88" cy="160" rx="9" ry="6" fill="#ffffff" opacity="0.22" />

      {/* Main flame head */}
      <path
        d="M100 172
           C 66 172 44 148 44 116
           C 44 92 56 78 50 60
           C 63 62 66 74 72 70
           C 68 44 78 18 103 4
           C 100 30 112 42 116 34
           C 128 40 122 56 132 58
           C 148 62 156 84 156 108
           C 156 146 132 172 100 172 Z"
        fill={`url(#${headGrad})`}
      />

      {/* Glossy highlight on the flame */}
      <ellipse cx="76" cy="52" rx="20" ry="30" fill={`url(#${sheen})`} transform="rotate(-16 76 52)" />

      {/* Small floating spark droplets, clear of the head silhouette */}
      <path d="M26 94c6 5 6 13 0 17-6-4-6-12 0-17Z" fill={`url(#${headGrad})`} opacity="0.9" />
      <path d="M172 76c5 4 5 11 0 15-5-4-5-11 0-15Z" fill={`url(#${headGrad})`} opacity="0.9" />

      {/* Face */}
      {mood === 'happy' ? (
        <>
          <g>
            <ellipse cx="80" cy="120" rx="10" ry="13" fill="#241206" />
            <ellipse cx="120" cy="120" rx="10" ry="13" fill="#241206" />
            <circle cx="83.5" cy="114" r="3" fill="#ffffff" />
            <circle cx="123.5" cy="114" r="3" fill="#ffffff" />
          </g>
          <path d="M84 138c6 8 26 8 32 0" stroke="#241206" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M71 119c5-4 14-4 19 0" stroke="#241206" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M110 119c5-4 14-4 19 0" stroke="#241206" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M90 136c4 5 16 5 20 0" stroke="#241206" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}

      <style>{`
        @keyframes mascotBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg { animation: none !important; }
        }
      `}</style>
    </svg>
  );
};
