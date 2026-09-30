'use client';

import React, { useId } from 'react';

export type MascotPose = 'idle' | 'wave' | 'cheer' | 'point';

interface MascotProps {
  size?: number;
  className?: string;
  /** 'happy' is the default grin; 'sleepy' half-closed eyes for empty/idle states. */
  mood?: 'happy' | 'sleepy';
  /** Arm posture — lets the same character read differently in different spots. */
  pose?: MascotPose;
  /** Adds a soft bob animation (respects prefers-reduced-motion via CSS). */
  animate?: boolean;
  style?: React.CSSProperties;
}

// Right-arm rotation per pose, hanging straight down at 0°. The left arm
// mirrors it (negated) except in 'wave' and 'point', which are one-armed
// gestures and keep the left arm in its idle resting angle.
const RIGHT_ARM_ANGLE: Record<MascotPose, number> = {
  idle: -20,
  wave: -165,
  cheer: -160,
  point: -70,
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
  const leftArmAngle = pose === 'wave' || pose === 'point' ? 20 : -rightArmAngle;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 220"
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

      {/* Soft warm glow behind the face, like the reference's lighter face patch */}
      <ellipse cx="100" cy="128" rx="48" ry="46" fill={`url(#${faceGlow})`} />

      {/* Glossy highlight on the flame */}
      <ellipse cx="76" cy="52" rx="20" ry="30" fill={`url(#${sheen})`} transform="rotate(-16 76 52)" />

      {/* Small floating spark droplets, clear of the head silhouette */}
      <path d="M26 94c6 5 6 13 0 17-6-4-6-12 0-17Z" fill={`url(#${headGrad})`} opacity="0.9" />
      <path d="M172 76c5 4 5 11 0 15-5-4-5-11 0-15Z" fill={`url(#${headGrad})`} opacity="0.9" />

      {/* Trailing tail wisp, curling off the lower-right of the flame */}
      <path
        d="M140 130c14 4 20 18 12 32-6 10-4 20 4 26-16 2-28-10-28-26 0-12 4-24 12-32Z"
        fill={`url(#${headGrad})`}
        opacity="0.92"
      />

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
      <path d="M69 101c4-6 13-6 17-1" stroke="#7a2e10" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M114 100c4-5 13-5 17 1" stroke="#7a2e10" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Face */}
      {mood === 'happy' ? (
        <>
          <g>
            <ellipse cx="80" cy="121" rx="12" ry="15" fill="#fff8ef" stroke="#7a2e10" strokeWidth="2" />
            <ellipse cx="120" cy="121" rx="12" ry="15" fill="#fff8ef" stroke="#7a2e10" strokeWidth="2" />
            <circle cx="81" cy="123" r="7" fill="#2a1608" />
            <circle cx="121" cy="123" r="7" fill="#2a1608" />
            <circle cx="84" cy="118" r="2.6" fill="#ffffff" />
            <circle cx="124" cy="118" r="2.6" fill="#ffffff" />
          </g>
          <path d="M84 134c3 11 14 15 16 15s13-4 16-15c-6 8-26 8-32 0Z" fill="#2a1608" />
        </>
      ) : (
        <>
          <path d="M71 119c5-4 14-4 19 0" stroke="#2a1608" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M110 119c5-4 14-4 19 0" stroke="#2a1608" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M90 136c4 5 16 5 20 0" stroke="#2a1608" strokeWidth="5" strokeLinecap="round" fill="none" />
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
