"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Rules() {
  const [displayText, setDisplayText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const gameRulesText = [
    "BIDDING",
    "",
    "You must determine what your survival is worth to you.",
    "Each round, the player who values their life the least will be eliminated.",
    "",
    "Rules:",
    "• EACH PLAYER STARTS WITH 1,000 POINTS",
    "• EACH ROUND, ALL PLAYERS MUST PLACE A SECRET BID",
    "• THE PLAYER WITH THE LOWEST BID WILL BE ELIMINATED",
    "• IF MULTIPLE PLAYERS PLACE THE SAME LOWEST BID, ALL LOWEST BID PLAYERS ARE ELIMINATED",
    "• THE GAME ENDS WHEN ONLY ONE PLAYER REMAINS",
    "",
    "Game Phases:",
    "• COMMIT (2 MINUTES): Lock in your secret bid",
    "• REVEAL (1 MINUTES): Show your bid amount",
    "",
    "Warnings:",
    "• If you do not commit or reveal in time, you will be eliminated",
    "• Your bid will be deducted from your total points after reveal",
    "• You have 1000 points total, you will not get any more points",
    "• If you want to make it to the end, you must carefully ration your points",
    "",
    "The rules will not be repeated. Use the chat to coordinate or manipulate.",
  ];

  useEffect(() => {
    if (currentLine >= gameRulesText.length) return;
    
    const line = gameRulesText[currentLine];
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex <= line.length) {
        setDisplayText(prev => 
          prev.split('\n').slice(0, currentLine)
            .concat(line.substring(0, charIndex))
            .join('\n') + (currentLine < gameRulesText.length - 1 ? '\n' : '')
        );
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentLine(prev => prev + 1);
        }, currentLine === 0 ? 1500 : 500);
      }
    }, 60);
    
    return () => clearInterval(typingInterval);
  }, [currentLine]);

  useEffect(() => {
    const typingDuration = 2000;
    const timer = setTimeout(() => {
      setIsTypingComplete(true);
    }, typingDuration);
    
    return () => clearTimeout(timer);
  }, []);

  const styledText = displayText.split('\n').map((line, index) => {
    if (index === 0) {
      return `<span class="text-xl md:text-2xl font-bold text-foreground tracking-widest">${line}</span>`;
    } else if (line.startsWith("•")) {
      return `<span class="text-primary-800">${line}</span>`;
    } else if (line.startsWith("The rules")) {
      return `<span class="text-primary-600 font-semibold">${line}</span>`;
    } else if (line.startsWith("Rules:") || line.startsWith("Game Phases:") || line.startsWith("Warnings:")) {
      return `<span class="text-primary-900 font-semibold">${line}</span>`;
    }
    return `<span class="text-primary-700">${line}</span>`;
  }).join('\n');

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full"
      >
        <div 
          ref={containerRef}
          className="relative bg-gradient-to-b from-overlay-dark to-background p-8 rounded-lg 
                     shadow-glow-sm backdrop-blur-sm w-full"
        >
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-200"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary-200"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary-200"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-200"></div>
          
          <pre 
            className="font-mono text-sm text-primary-700 whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: styledText }}
          />
          
          {!isTypingComplete && (
            <motion.div
              animate={{ 
                opacity: [1, 0, 1], 
                height: ["20px", "5px", "20px"] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.2 
              }}
              className="inline-block ml-1 w-[3px] bg-foreground"
            />
          )}
          
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent mt-6"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 