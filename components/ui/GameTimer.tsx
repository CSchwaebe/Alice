"use client";

import { useEffect, useState } from 'react';
import { Silkscreen } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

const silkscreen = Silkscreen({ 
  weight: '400',
  subsets: ['latin']
});

interface GameTimerProps {
  endTime: number; // Unix timestamp in seconds
  onExpired?: () => void;
}

export function GameTimer({ endTime, onExpired }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isGlitching, setIsGlitching] = useState(false);
  
  // Calculate and update time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const difference = endTime - now;
      setTimeLeft(Math.max(0, difference));
      
      // Call onExpired when timer reaches zero
      if (difference <= 0 && onExpired) {
        onExpired();
      }
    };
    
    // Initial calculation
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime, onExpired]);
  
  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.1) { // 90% chance to glitch
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 1000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;
  const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="relative">
      {/* Main timer display */}
      <div className={`text-5xl font-bold tracking-wider text-foreground ${silkscreen.className}`}>
        {timeString}
      </div>

      {/* Glitch effect overlay */}
      <AnimatePresence>
        {isGlitching && (
          <>
            {/* Main glitch layer */}
            <motion.div
              initial={{ opacity: 0, x: -2 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                x: [-4, 4, -4],
                scale: [1, 1.1, 0.9, 1],
                rotate: [-1, 1, -1],
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.2,
                times: [0, 0.5, 1]
              }}
              className={`absolute inset-0 text-5xl font-bold tracking-wider ${silkscreen.className} text-[var(--glitch-primary)] mix-blend-screen flex items-center justify-center`}
            >
              {timeString}
            </motion.div>
            
            {/* Echo layer for more intense effect */}
            <motion.div
              initial={{ opacity: 0, x: 2 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                x: [4, -4, 4],
                scale: [1, 0.9, 1.1, 1],
                rotate: [1, -1, 1],
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.2,
                times: [0, 0.5, 1]
              }}
              className={`absolute inset-0 text-5xl font-bold tracking-wider ${silkscreen.className} text-[var(--glitch-secondary)] mix-blend-screen flex items-center justify-center`}
            >
              {timeString}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 