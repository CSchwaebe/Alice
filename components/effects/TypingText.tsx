"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Iceland } from 'next/font/google';

const iceland = Iceland({ 
  weight: '400',
  subsets: ['latin']
});

export default function TypingText() {
  const [displayText, setDisplayText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const textLines = [
    "Hello, Darling.",
    "",
    "I've been watching you.",
    "You know the symbols.", 
    "You know the games.",
    "",
    "Squid Game. Beast Games. Alice in Borderland.",
    "",
   
    "1000 players. One Survivor.",
    "A live, on-chain event unlike anything you've seen before.",
    "",
    "Trust is a currency.",
    "Betrayal is an art.",
    "Victory... is earned.",
    "",
    "Welcome to the Beginning."
    

  ];

  useEffect(() => {
    if (currentLine >= textLines.length) return;
    
    const line = textLines[currentLine];
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex <= line.length) {
        setDisplayText(prev => 
          prev.split('\n').slice(0, currentLine)
            .concat(line.substring(0, charIndex))
            .join('\n') + (currentLine < textLines.length - 1 ? '\n' : '')
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

  const renderText = () => {
    return displayText.split('\n').map((line, index) => {
      if (index === 0 || index === textLines.length - 1) {
        return <span key={index} className="text-3xl md:text-4xl tracking-widest">{line}</span>;
      } else if (line.startsWith('S')) {
        return <span key={index} className="italic md:text-2xl tracking-wider">{line}</span>;
      }
      return <span key={index} className="md:text-2xl tracking-wider">{line}</span>;
    }).map((element, index, array) => {
      return index < array.length - 1 ? [element, <br key={`br-${index}`} />] : element;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="relative bg-gradient-to-b from-overlay-dark to-background p-8 rounded-lg 
                     shadow-glow-sm backdrop-blur-sm w-full">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-200"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary-200"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary-200"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-200"></div>
        
        <div 
          className={`font-mono text-xl md:text-base text-white whitespace-pre-wrap break-words ${iceland.className}`}
        >
          {renderText()}
        </div>
        
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
  );
} 