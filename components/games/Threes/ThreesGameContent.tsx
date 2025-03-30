import { useState, useEffect, useRef } from 'react';
import AnimatedSymbols from './AnimatedSymbols';
import ViewportDrawer from '@/components/ui/ViewportDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { addToast } from "@heroui/toast";
import type { GameNotification } from '@/hooks/useThreesGameEvents';

interface ThreesGameContentProps {
  gameState: number;
  currentRound: bigint;
  hasCommitted: boolean;
  hasRevealed: boolean;
  isCommitting: boolean;
  isRevealing: boolean;
  onCommit: (choice: number) => void;
  onReveal: (choice: number) => void;
}

export function ThreesGameContent({
  gameState,
  currentRound,
  hasCommitted,
  hasRevealed,
  isCommitting,
  isRevealing,
  onCommit,
  onReveal,
}: ThreesGameContentProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const gameRulesText = [
    "THREE'S",
    "",
    "You and your team must make a critical choice between three symbols.",
    "Your survival depends on coordination and strategy.",
    "",
    "Rules:",
    "• ALL PLAYERS CHOOSE SAME SYMBOL → NO ELIMINATIONS",
    "• TWO PLAYERS CHOOSE SAME SYMBOL, ONE PLAYER CHOOSES DIFFERENTLY → TWO ELIMINATED",
    "• ALL PLAYERS CHOOSE DIFFERENT SYMBOLS → ALL ELIMINATED",
    "",
    "Game Phases:",
    "• COMMIT (5 MINUTES): Lock in your choice",
    "• REVEAL (2 MINUTES): Show your symbol",
    "",
    "Warnings:",
    "• If you do not commit or reveal in time, you will be eliminated",
    "• In the event that a player does not commit or reveal, the rest of the team will be safe",
    "",
    "The rules will not be repeated. Use the chat to coordinate with your team.",
  ];

  useEffect(() => {
    if (!gameState || currentLine >= gameRulesText.length) return;
    
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
  }, [currentLine, gameState]);

  useEffect(() => {
    const typingDuration = 2000;
    const timer = setTimeout(() => {
      setIsTypingComplete(true);
    }, typingDuration);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSymbolSelect = (choice: number) => {
    if ((currentRound?.toString() === '1' && !hasCommitted) || 
        (currentRound?.toString() === '2' && !hasRevealed)) {
      setSelectedChoice(choice);
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    if (selectedChoice !== null) {
      const choice = selectedChoice + 1; // Convert 0-based to 1-based index
      if (currentRound?.toString() === '1') {
        onCommit(choice);
      } else {
        onReveal(choice);
      }
      setShowConfirmation(false);
      setSelectedChoice(null);
    }
  };

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

  if (gameState === 1) {
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
                       shadow-glow-sm backdrop-blur-sm w-full"
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-300"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary-300"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary-300"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-300"></div>
            
            <pre 
              className="font-mono text-sm whitespace-pre-wrap break-words overflow-hidden w-full"
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
                className="inline-block ml-1 w-[3px] bg-primary-600"
              />
            )}
            
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent mt-6"></div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const canInteract = (currentRound?.toString() === '1' && !hasCommitted) || 
                     (currentRound?.toString() === '2' && !hasRevealed);

  return (
    <div className="flex flex-col items-center w-full">
      {currentRound > BigInt(0) && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {currentRound?.toString() === '1' ? 'Commit Stage' : 'Reveal Stage'}
          </h2>
          <p className="text-primary-800">
            {currentRound?.toString() === '1' 
              ? hasCommitted 
                ? 'Waiting for other players to commit...'
                : 'Choose your symbol to commit...'
              : hasRevealed
                ? 'Waiting for other players to reveal...'
                : 'Choose your symbol to reveal...'}
          </p>
        </div>
      )}
      
      <div className="flex justify-center items-center w-full p-2">
        <AnimatedSymbols 
          onSymbolClick={canInteract ? handleSymbolSelect : undefined}
        />
      </div>

      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirmClick={handleConfirm}
        title={currentRound?.toString() === '1' ? "Confirm Commit" : "Confirm Reveal"}
        description={currentRound?.toString() === '1' 
          ? "Are you sure you want to commit to this symbol? This action cannot be undone."
          : "Are you sure you want to reveal this symbol? Make sure it matches your committed choice."
        }
      />
    </div>
  );
} 