"use client";

import { useState, useEffect, useCallback } from 'react';

interface TimerOptions {
  initialSeconds: number;
  autoStart?: boolean;
  countDown?: boolean; // true for countdown, false for counting up
  onComplete?: () => void;
  interval?: number; // milliseconds, default 1000 (1 second)
}

export interface TimerResult {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  timeString: string;
  isRunning: boolean;
  isCompleted: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setTime: (seconds: number) => void;
  addTime: (seconds: number) => void;
}

export function useGameTimer({
  initialSeconds,
  autoStart = false,
  countDown = true,
  onComplete,
  interval = 1000
}: TimerOptions): TimerResult {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  const start = useCallback(() => {
    if (countDown && totalSeconds <= 0) {
      // Don't start if counting down and already at zero
      return;
    }
    setIsRunning(true);
  }, [countDown, totalSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTotalSeconds(initialSeconds);
    setIsRunning(autoStart);
    setIsCompleted(false);
  }, [initialSeconds, autoStart]);

  const setTime = useCallback((seconds: number) => {
    setTotalSeconds(seconds);
    setIsCompleted(countDown && seconds <= 0);
  }, [countDown]);

  const addTime = useCallback((seconds: number) => {
    setTotalSeconds(prev => {
      const newValue = prev + seconds;
      return countDown ? Math.max(0, newValue) : newValue;
    });
  }, [countDown]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTotalSeconds(prev => {
        const newValue = countDown ? prev - 1 : prev + 1;
        
        // Check for completion when counting down
        if (countDown && newValue <= 0) {
          setIsRunning(false);
          setIsCompleted(true);
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        
        return newValue;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isRunning, countDown, onComplete, interval]);

  // Calculate minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  // Format as MM:SS
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return {
    minutes,
    seconds,
    totalSeconds,
    timeString,
    isRunning,
    isCompleted,
    start,
    pause,
    reset,
    setTime,
    addTime
  };
} 