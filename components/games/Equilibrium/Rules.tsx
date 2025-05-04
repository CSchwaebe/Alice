"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Rules() {
  const [displayText, setDisplayText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const gameRulesText = [
    "EQUILIBRIUM",
    "",
    "A game of strategy, communication, and collective survival.",
    "Unity is strength, but time can force division.",
    "",
    "Rules:",
    "• There are 4 teams in the game",
    "• All players start on the same team",
    "• Players can switch between teams freely",
    "• Switch as many times as you want before time runs out",
    "",
    "Victory & Elimination:",
    "• When time expires, the team with the most players is eliminated and the game ends",
    "• In a tie for largest team, a random tied team is eliminated",
    "",
    "Everyone can survive if you work together",
    "",
    "The rules will not be repeated. Use the chat to coordinate with or deceive your opponents.",
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
    } else if (line.startsWith("Rules:") || line.startsWith("Warnings:")) {
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