"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDescendGameData } from '@/app/games/descend/hooks/useDescendGameData';

interface RulesProps {
  levelCapacities?: Record<number, number>;
}

export default function Rules({ levelCapacities = {} }: RulesProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCapacityText = () => {
    // Default values if contract data is not available
    const defaultCapacities = {
      0: Infinity,
      1: 100, // Default for levels 1-20
      21: 500
    };

    // Use contract values if available, otherwise use defaults
    const level0Cap = levelCapacities[0] || defaultCapacities[0];
    const level1To20Cap = levelCapacities[1] || defaultCapacities[1];
    const level21Cap = levelCapacities[21] || defaultCapacities[21];

    return [
      "• EACH LEVEL HAS A CAP.",
      `• LEVEL 0 - ${level0Cap === Infinity ? "UNLIMITED" : level0Cap} PLAYERS.`,
      `• LEVELS 1-20 - ${level1To20Cap} PLAYERS.`,
      `• LEVEL 21 - ${level21Cap} PLAYERS.`,
      `• THE FIRST ${level21Cap} PLAYERS TO REACH LEVEL 21 ADVANCE TO THE NEXT ROUND`
    ];
  };

  const gameRulesText = [
    "DESCEND",
    "",
    "You're alone in a world swallowed by shadow.",
    "The only way out… is down.",
    "",
    "You can't see them, but they're there—countless others, breathing, whispering, waiting.",
    "Every step echoes with someone else's fear. Or strategy. Or lie.",
    "",
    "Watch your footing.",
    "This descent isn't just perilous… it's crowded.",
    "",
    "Rules:",
    "• EACH PLAYER STARTS AT LEVEL 0",
    "• EACH ROUND, YOU MUST MOVE 0-5 LEVELS DOWN",
    "• IF YOU PLAY THE SAME MOVE TWICE IN A ROW, YOU WILL BE ELIMINATED",
    "",
    ...getCapacityText(),
    "",
    "***IF A LEVEL EXCEEDS CAPACITY, ALL PLAYERS ON THAT LEVEL WILL BE ELIMINATED***",
    "",
    "Game Phases:",
    "• COMMIT (2 MINUTES): Lock in your secret move",
    "• REVEAL (1 MINUTE): Show your chosen move",
    "",
    "Warnings:",
    "• You must reveal the same move you committed to",
    "• If you do not commit or reveal in time, you will be eliminated",
    "",
    "The rules will not be repeated. Use the chat to work with, or against, your opponents.",
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
        className="relative max-w-4xl mx-auto"
      >
        <div 
          ref={containerRef}
          className="relative bg-gradient-to-b from-overlay-dark to-background p-8 rounded-lg 
                     shadow-glow-sm backdrop-blur-sm"
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