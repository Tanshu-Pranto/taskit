'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Cached = { raw: string | null; value: unknown };

const cache = new Map<string, Cached>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getSnapshot<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: T;
  try {
    value = raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    value = fallback;
  }
  cache.set(key, { raw, value });
  return value;
}

function writeValue<T>(key: string, value: T) {
  const raw = JSON.stringify(value);
  cache.set(key, { raw, value });
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // storage unavailable (e.g. private browsing quota) — in-memory cache still updates
  }
  listeners.forEach((listener) => listener());
}

/**
 * Reads/writes a JSON value in localStorage, kept in sync via useSyncExternalStore
 * so the client can safely differ from the server-rendered snapshot without a
 * setState-in-effect hydration step.
 */
export function useLocalStorageState<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => getSnapshot(key, fallback),
    () => fallback,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getSnapshot(key, fallback);
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
      writeValue(key, resolved);
    },
    [key, fallback],
  );

  return [value, setValue];
}
