'use client';

import React, { useCallback, useEffect, useRef } from 'react';

export interface CarouselCardData {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
}

interface InfiniteCardCarouselProps {
  items: CarouselCardData[];
  /** Auto-drift speed in px per ~16.7ms frame. */
  speed?: number;
}

const CARD_WIDTH = 260;
const CARD_GAP = 24;
const COPIES = 3;

export const InfiniteCardCarousel: React.FC<InfiniteCardCarouselProps> = ({ items, speed = 0.5 }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const cycleWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastMoveXRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const hoveredRef = useRef(false);

  const applyTransform = useCallback(() => {
    const cycle = cycleWidthRef.current;
    const track = trackRef.current;
    if (!track || !cycle) return;
    let offset = offsetRef.current % cycle;
    if (offset < 0) offset += cycle;
    offsetRef.current = offset;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }, []);

  useEffect(() => {
    cycleWidthRef.current = items.length * (CARD_WIDTH + CARD_GAP);
  }, [items.length]);

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.01) {
          offsetRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.94, dt / 16.67);
        } else if (!hoveredRef.current) {
          offsetRef.current += speed * (dt / 16.67);
        }
        applyTransform();
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [applyTransform, speed]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    velocityRef.current = 0;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current - dx;
    applyTransform();

    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    if (dt > 0) {
      velocityRef.current = -(e.clientX - lastMoveXRef.current) / dt;
    }
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = now;
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  const renderedItems = Array.from({ length: COPIES }, (_, copyIndex) =>
    items.map((item, i) => (
      <div
        key={`${copyIndex}-${i}`}
        className="feature-card"
        style={{ padding: '24px', width: `${CARD_WIDTH}px`, flexShrink: 0 }}
      >
        <div
          className="feature-card-icon"
          style={{ color: item.color, background: `color-mix(in srgb, ${item.color}, transparent 84%)` }}
        >
          {item.icon}
        </div>
        <h3 style={{ position: 'relative', zIndex: 1, fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
        <p style={{ position: 'relative', zIndex: 1, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
      </div>
    ))
  );

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          overflow: 'hidden',
          cursor: 'grab',
          touchAction: 'pan-y',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={() => {
          endDrag();
          hoveredRef.current = false;
        }}
        onPointerCancel={endDrag}
        onPointerEnter={() => {
          hoveredRef.current = true;
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            width: 'max-content',
            userSelect: 'none',
          }}
        >
          {renderedItems}
        </div>
      </div>

      {/* Edge fade so the loop feels seamless rather than clipped */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '64px',
          background: 'linear-gradient(to right, var(--bg-app), transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '64px',
          background: 'linear-gradient(to left, var(--bg-app), transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
