'use client';

import React, { useId } from 'react';

export type MascotPose = 'idle' | 'wave' | 'cheer' | 'point' | 'thinking' | 'holding';

interface MascotProps {
  size?: number;
  className?: string;
  /** 'happy' is the default grin; 'sleepy' half-closed eyes; 'confused' one raised brow. */
  mood?: 'happy' | 'sleepy' | 'confused';
  /** Arm posture — lets the same character read differently in different spots. */
  pose?: MascotPose;
  /** Adds a soft squash-stretch bounce (respects prefers-reduced-motion via CSS). */
  animate?: boolean;
  style?: React.CSSProperties;
}

// Right-arm rotation per pose, hanging straight down at 0°. The left arm
// mirrors it (negated) except for one-armed / symmetric-forward gestures.
const RIGHT_ARM_ANGLE: Record<MascotPose, number> = {
  idle: -20,
  wave: -165,
  cheer: -160,
  point: -70,
  thinking: -20,
  holding: -95,
};
const LEFT_ARM_ANGLE: Record<MascotPose, number> = {
  idle: 20,
  wave: 20,
  cheer: 160,
  point: 20,
  thinking: 20,
  holding: 95,
};

/**
 * Taskit's flame mascot — a glossy, rounded flame character built entirely
 * in SVG (gradients + highlight blobs, no raster assets) so it stays crisp
 * at favicon size and at full hero size alike. Gradient ids are namespaced
 * per instance via useId so multiple copies on one page don't collide.
 */
export const Mascot: React.FC<MascotProps> = ({ size = 96, className, mood = 'happy', pose = 'idle', animate = false, style }) => {
  const uid = useId().replace(/[:]/g, '');
  const bodyGrad = `mascot-body-${uid}`;
  const headGrad = `mascot-head-${uid}`;
  const glow = `mascot-glow-${uid}`;
  const sheen = `mascot-sheen-${uid}`;
  const faceGlow = `mascot-face-${uid}`;

  const rightArmAngle = RIGHT_ARM_ANGLE[pose];
  const leftArmAngle = LEFT_ARM_ANGLE[pose];

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 -20 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        transformOrigin: 'center',
        animation: animate ? 'mascotBob 3.2s ease-in-out infinite' : undefined,
        ...style,
      }}
      role="img"
      aria-label="Taskit flame mascot"
    >
      <defs>
        <linearGradient id={headGrad} x1="20%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="32%" stopColor="#ffb04d" />
          <stop offset="68%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#c22f0f" />
        </linearGradient>
        <linearGradient id={bodyGrad} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ffa24d" />
          <stop offset="100%" stopColor="#d9481a" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={sheen} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={faceGlow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff6d4" stopOpacity="0" />
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

      {/* Main flame head — three-peak crown */}
      <path
        d="M100 172
           C 64 172 42 148 42 114
           C 42 90 52 76 48 58
           C 60 60 64 72 70 68
           C 66 40 74 14 92 0
           C 90 24 98 34 104 28
           C 108 12 118 -4 130 -10
           C 126 16 134 30 140 26
           C 150 34 148 48 156 56
           C 164 62 158 84 158 108
           C 158 146 134 172 100 172 Z"
        fill={`url(#${headGrad})`}
      />

      {/* Soft warm glow behind the face */}
      <ellipse cx="100" cy="128" rx="48" ry="46" fill={`url(#${faceGlow})`} />

      {/* Glossy highlight on the flame */}
      <ellipse cx="76" cy="52" rx="20" ry="30" fill={`url(#${sheen})`} transform="rotate(-16 76 52)" />

      {/* Small floating spark droplets, clear of the head silhouette */}
      <path d="M20 90c6 5 6 13 0 17-6-4-6-12 0-17Z" fill={`url(#${headGrad})`} opacity="0.9" />
      <path d="M178 70c5 4 5 11 0 15-5-4-5-11 0-15Z" fill={`url(#${headGrad})`} opacity="0.9" />

      {/* Arms — a capsule limb plus a round hand, so a raised arm reads
          clearly as a hand rather than blending into the flame behind it.
          Rotated as one rigid group around the shoulder pivot. */}
      <g transform={`rotate(${leftArmAngle} 68 166)`}>
        <rect x="60" y="166" width="16" height="32" rx="8" fill={`url(#${bodyGrad})`} />
        <circle cx="68" cy="202" r="11" fill={`url(#${bodyGrad})`} />
      </g>
      <g transform={`rotate(${rightArmAngle} 132 166)`}>
        <rect x="124" y="166" width="16" height="32" rx="8" fill={`url(#${bodyGrad})`} />
        <circle cx="132" cy="202" r="11" fill={`url(#${bodyGrad})`} />
      </g>

      {/* Rosy cheeks */}
      <ellipse cx="65" cy="132" rx="9" ry="5.5" fill="#ff5a3c" opacity="0.5" />
      <ellipse cx="135" cy="132" rx="9" ry="5.5" fill="#ff5a3c" opacity="0.5" />

      {/* Eyebrows — give the face some attitude */}
      {mood === 'confused' ? (
        <>
          <path d="M69 98c4-3 13-1 17 4" stroke="#7a2e10" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M114 103c4-6 13-7 17-3" stroke="#7a2e10" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M69 101c4-6 13-6 17-1" stroke="#7a2e10" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M114 100c4-5 13-5 17 1" stroke="#7a2e10" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Face */}
      {mood === 'sleepy' ? (
        <>
          <path d="M71 119c5-4 14-4 19 0" stroke="#2a1608" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M110 119c5-4 14-4 19 0" stroke="#2a1608" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M90 136c4 5 16 5 20 0" stroke="#2a1608" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <g>
            <ellipse cx="80" cy="121" rx="12" ry="15" fill="#fff8ef" stroke="#7a2e10" strokeWidth="2" />
            <ellipse cx="120" cy="121" rx="12" ry="15" fill="#fff8ef" stroke="#7a2e10" strokeWidth="2" />
            <circle cx="81" cy="123" r="7" fill="#2a1608" />
            <circle cx="121" cy="123" r="7" fill="#2a1608" />
            <circle cx="84" cy="118" r="2.6" fill="#ffffff" />
            <circle cx="124" cy="118" r="2.6" fill="#ffffff" />
          </g>
          {mood === 'confused' ? (
            <ellipse cx="100" cy="140" rx="7" ry="6" fill="#2a1608" />
          ) : (
            <path d="M84 134c3 11 14 15 16 15s13-4 16-15c-6 8-26 8-32 0Z" fill="#2a1608" />
          )}
        </>
      )}

      <style>{`
        @keyframes mascotBob {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          30% { transform: translateY(-10px) scale(0.97, 1.05); }
          50% { transform: translateY(-13px) scale(1.02, 0.97); }
          72% { transform: translateY(-5px) scale(0.99, 1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg { animation: none !important; }
        }
      `}</style>
    </svg>
  );
};
