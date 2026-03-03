'use client';

import { useCallback, useEffect, useRef } from 'react';

const DEFAULT_DELAY_MS = 2500;

export type DelayedAction = {
  schedule: (action: () => void, delayMs?: number) => void;
  cancel: () => void;
};

export const useDelayedAction = (defaultDelayMs: number = DEFAULT_DELAY_MS): DelayedAction => {
  const timerRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current === null) {
      return;
    }

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const schedule = useCallback(
    (action: () => void, delayMs?: number) => {
      cancel();
      const resolvedDelay = delayMs ?? defaultDelayMs;

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        action();
      }, resolvedDelay);
    },
    [cancel, defaultDelayMs]
  );

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return { schedule, cancel };
};
