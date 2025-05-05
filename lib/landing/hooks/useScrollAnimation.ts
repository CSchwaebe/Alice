"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

// Common animation timings
export const DEFAULT_TIMING = [0.2, 0.4, 0.9, 0.95];
export const ALTERNATE_TIMING = [0, 0.2, 0.5, 0.8];
export const TEXT_OVERLAY_TIMING = [0.1, 0.2, 0.9, 0.95];

type ViewportValue = "start" | "end" | "center" | `${number}%`;
type ScrollOffset = `${ViewportValue} ${ViewportValue}` | "start end" | "end start";

type ScrollAnimationProps = {
  customOffset?: [ScrollOffset, ScrollOffset];
  customTiming?: number[];
};

type ScrollAnimations = {
  ref: React.RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
  opacity: MotionValue<number>;
  y?: MotionValue<number>;
  x?: MotionValue<number>;
  scale?: MotionValue<number>;
};

export function useBasicAnimation({ 
  customOffset = ["start end", "end start"] as ["start end", "end start"],
  customTiming = DEFAULT_TIMING
}: ScrollAnimationProps = {}): ScrollAnimations {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: customOffset
  });

  const opacity = useTransform(
    scrollYProgress,
    customTiming,
    [0, 1, 1, 0]
  );

  return { ref, scrollYProgress, opacity } as ScrollAnimations;
}

export function useScrollFadeIn({ 
  customOffset, 
  customTiming 
}: ScrollAnimationProps = {}): ScrollAnimations {
  const { ref, scrollYProgress, opacity } = useBasicAnimation({ 
    customOffset, 
    customTiming 
  });
  
  const y = useTransform(
    scrollYProgress,
    customTiming || DEFAULT_TIMING,
    [100, 0, 0, -100]
  );
  
  const scale = useTransform(
    scrollYProgress,
    customTiming || DEFAULT_TIMING,
    [0.8, 1, 1, 0.8]
  );

  return { ref, scrollYProgress, opacity, y, scale };
}

export function useHorizontalSlide({ 
  isLeft, 
  customOffset, 
  customTiming 
}: ScrollAnimationProps & { isLeft?: boolean } = {}): ScrollAnimations {
  const { ref, scrollYProgress, opacity } = useBasicAnimation({ 
    customOffset, 
    customTiming 
  });
  
  const x = useTransform(
    scrollYProgress,
    customTiming || DEFAULT_TIMING,
    isLeft ? [-100, 0, 0, -100] : [100, 0, 0, 100]
  );

  return { ref, scrollYProgress, opacity, x };
}

export function useResponsiveAnimation({
  customOffset,
  customTiming
}: ScrollAnimationProps = {}): ScrollAnimations {
  const { ref, scrollYProgress, opacity } = useBasicAnimation({ 
    customOffset, 
    customTiming 
  });
  
  const scale = useTransform(
    scrollYProgress,
    customTiming || DEFAULT_TIMING,
    [0.95, 1, 1, 0.95]
  );
  
  const y = useTransform(
    scrollYProgress,
    customTiming || DEFAULT_TIMING,
    [50, 0, 0, -50]
  );
  
  const x = useTransform(
    scrollYProgress,
    customTiming || DEFAULT_TIMING,
    [-50, 0, 0, -50]
  );

  return { ref, scrollYProgress, opacity, scale, y, x };
} 