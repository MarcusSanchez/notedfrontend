import React, { useEffect, useRef } from "react";

export function useThrottledEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList,
  interval: number
) {
  const lastRan = useRef(Date.now());
  const cleanupRef = useRef<ReturnType<React.EffectCallback> | void>();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRan.current;

    if (timeSinceLastRun >= interval) {
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
      }

      cleanupRef.current = effect();
      lastRan.current = now;
    }

    return () => {
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
  }, deps);
}