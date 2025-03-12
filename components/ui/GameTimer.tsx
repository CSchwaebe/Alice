"use client";

import { useEffect, useState } from 'react';
import { Silkscreen } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

const silkscreen = Silkscreen({ 
  weight: '400',
  subsets: ['latin']
});

interface GameTimerProps {
  seconds: number;
}

export function GameTimer({ seconds }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchValues, setGlitchValues] = useState({ scale: 1, rotate: 0 });
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (timeLeft <= 0) return; // Stop glitching at 0
      
      if (Math.random() > 0.1) { // 90% chance to glitch
        setGlitchValues({
          // Only apply scale/rotate under 10 seconds
          scale: timeLeft <= 10 ? 1 + (Math.random() * 0.25) : 1,
          rotate: timeLeft <= 10 ? Math.random() * 10 - 5 : 0
        });
        setIsGlitching(true);
        
        setTimeout(() => {
          setIsGlitching(false);
          setGlitchValues({ scale: 1, rotate: 0 });
        }, 150);
      }
    }, 1000);
    
    return () => clearInterval(glitchInterval);
  }, [timeLeft]);
  
  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;
  const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="relative">
      {/* Main timer display */}
      <motion.div 
        animate={{
          scale: timeLeft === 0 ? 1.25 : glitchValues.scale,
          rotate: glitchValues.rotate,
          color: timeLeft === 0 ? "#ef4444" : "white" // Change to red at 0
        }}
        transition={{
          duration: 0.15,
          ease: "anticipate"
        }}
        className={`text-4xl md:text-5xl font-bold tracking-wider ${silkscreen.className}`}
      >
        {timeString}
      </motion.div>

      {/* Glitch effect overlay */}
      <AnimatePresence>
        {isGlitching && timeLeft > 0 && (
          <>
            {/* Main glitch layer */}
            <motion.div
              initial={{ opacity: 0, x: -2 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                x: [-6, 6, -6],
                scale: [1, 1.2, 0.8],
                rotate: [-2, 2, -2],
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.15,
                times: [0, 0.5, 1],
                ease: "anticipate"
              }}
              className="absolute inset-0 text-[#ff0080] mix-blend-screen"
            >
              {timeString}
            </motion.div>
            
            {/* Echo layer for more intense effect */}
            <motion.div
              initial={{ opacity: 0, x: 2 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                x: [6, -6, 6],
                scale: [1, 0.8, 1.2],
                rotate: [2, -2, 2],
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.15,
                times: [0, 0.5, 1],
                ease: "anticipate"
              }}
              className="absolute inset-0 text-[#00ff00] mix-blend-screen"
            >
              {timeString}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 