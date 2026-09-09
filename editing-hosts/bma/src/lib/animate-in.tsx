'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

export type AnimateMotion =
  | 'fade-in'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'zoom-in';

export interface AnimateInProps {
  motion: AnimateMotion;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const MOTION_POOL: Record<AnimateMotion, AnimateMotion[]> = {
  'fade-in': ['fade-in', 'slide-in-up', 'zoom-in'],
  'slide-in-left': ['slide-in-left', 'slide-in-up', 'fade-in'],
  'slide-in-right': ['slide-in-right', 'slide-in-down', 'fade-in'],
  'slide-in-up': ['slide-in-up', 'slide-in-left', 'zoom-in'],
  'slide-in-down': ['slide-in-down', 'slide-in-right', 'fade-in'],
  'zoom-in': ['zoom-in', 'fade-in', 'slide-in-up'],
};

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function domSeed(el: HTMLElement): string {
  const parts: string[] = [];
  let node: HTMLElement | null = el;
  for (let i = 0; i < 4 && node; i += 1) {
    const idx = node.parentElement ? Array.from(node.parentElement.children).indexOf(node) : -1;
    parts.push(`${node.tagName}:${idx}`);
    node = node.parentElement;
  }
  return parts.join('|');
}

function pickMotion(preferred: AnimateMotion, seed: number): AnimateMotion {
  const options = MOTION_POOL[preferred] ?? [preferred];
  return options[seed % options.length] ?? preferred;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Runs entrance animation once when the element enters the viewport. */
export function AnimateIn({ motion, delay = 0, className = '', style, children }: AnimateInProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [resolvedMotion, setResolvedMotion] = useState<AnimateMotion>(motion);
  const [resolvedDurationMs, setResolvedDurationMs] = useState(860);
  const [resolvedDelayMs, setResolvedDelayMs] = useState(delay);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const seed = hash(`${motion}|${domSeed(el)}`);
    setResolvedMotion(pickMotion(motion, seed));
    setResolvedDurationMs(860 + (seed % 220));
    setResolvedDelayMs(delay + (seed % 3) * 35);

    if (prefersReducedMotion()) {
      setRun(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [motion, delay]);

  const classes = [
    'rai-animate',
    run ? `rai-animate--${resolvedMotion} rai-animate--run` : 'rai-animate--pending',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      style={
        run
          ? ({
              ...style,
              animationDelay: `${resolvedDelayMs}ms`,
              '--rai-anim-duration': `${resolvedDurationMs}ms`,
            } as CSSProperties)
          : style
      }
    >
      {children}
    </div>
  );
}

/** Optional wrapper — returns children unchanged when animate is false. */
export function maybeAnimate(
  animate: boolean,
  motion: AnimateMotion,
  delay: number,
  children: ReactNode,
  className?: string,
): ReactNode {
  if (!animate) return children;
  return (
    <AnimateIn motion={motion} delay={delay} className={className}>
      {children}
    </AnimateIn>
  );
}
