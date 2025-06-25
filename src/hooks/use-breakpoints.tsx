import { useEffect, useState } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

function getBreakpointState(width: number) {
  return {
    isSM: width >= breakpoints.sm,
    isMD: width >= breakpoints.md,
    isLG: width >= breakpoints.lg,
    isXL: width >= breakpoints.xl,
    is2XL: width >= breakpoints.xxl,
  };
}

export function useBreakpoints() {
  const [state, setState] = useState(getBreakpointState(typeof window !== "undefined" ? window.innerWidth : 0));

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    const handleResize = throttle(() => {
      const state = getBreakpointState(window.innerWidth);
      setState(state);
    }, 100);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
}

function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let lastCall = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    func.apply(this, args);
  } as T;
}
