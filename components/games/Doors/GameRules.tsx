"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameRules() {
  const [displayText, setDisplayText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const gameRulesText = [
    "DOORS",
    "",
    "You are trapped in a room with your team. You notice 2 doors on the wall.",
    "One leads to safety, the other to certain death.",
    "",
    "Rules:",
    "• Each round, 1 player on your team must open a door within the time limit.",
    "",
    "• If the player opens the wrong door, they will be eliminated but the team will progress to the next round.",
    "",
    "• If the player opens the correct door, they will be safe and will progress to the next round with the team.",
    "",
    "• If no one opens a door, the whole team will be eliminated.",
    "",
    "• The game consists of 10 rounds.",
    "",
    "The rules will not be repeated. Use the chat to coordinate with your team.",
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
    // Set typing to complete after your typing animation duration
    const typingDuration = 2000; // Adjust this to match your typing duration
    const timer = setTimeout(() => {
      setIsTypingComplete(true);
    }, typingDuration);
    
    return () => clearTimeout(timer);
  }, []);

  // Special styling for title and important phrases
  const styledText = displayText.split('\n').map((line, index) => {
    if (index === 0) {
      // Title styling
      return `<span class="text-xl md:text-2xl font-bold text-foreground tracking-widest">${line}</span>`;
    } else if (line.startsWith("•")) {
      // List items get a subtle highlight
      return `<span class="text-primary-800">${line}</span>`;
    } else if (line.startsWith("The rules")) {
      // Warning text
      return `<span class="text-primary-600 font-semibold">${line}</span>`;
    } else if (line.startsWith("Game Overview:") || line.startsWith("Rules:")) {
      // Section headers
      return `<span class="text-primary-900 font-semibold">${line}</span>`;
    }
    return line;
  }).join('\n');

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto"
      >
       

        {/* Main content container with glow effect */}
        <div 
          ref={containerRef}
          className="relative bg-gradient-to-b from-overlay-dark to-background p-8 rounded-lg 
                     shadow-glow-sm backdrop-blur-sm"
        >
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-200"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary-200"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary-200"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-200"></div>
          
          {/* Text content with HTML styling */}
          <pre 
            className="font-mono text-sm text-primary-700 whitespace-pre-wrap break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: styledText }}
          />
          
          {/* Animated cursor - only show while typing */}
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
          
          {/* Decorative horizontal line */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent mt-6"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 