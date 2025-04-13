"use client";

import { useState } from 'react';
import AnimatedSymbols from './AnimatedSymbols';
import ViewportDrawer from '@/components/ui/ViewportDrawer';
import { motion } from 'framer-motion';
import ThreesGameRules from './ThreesGameRules';

export interface ThreesGameContentProps {
  gameState: number;
  currentRound: bigint;
  hasCommitted: boolean;
  hasRevealed: boolean;
  isCommitting: boolean;
  isRevealing: boolean;
  onCommit: (choice: number, gameId: string | number, round: string | number) => void;
  onReveal: (choice: number, gameId: string, round: string) => void;
  gameId?: string | number;
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
  gameId
}: ThreesGameContentProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);

  if (gameState === 1) {
    return <ThreesGameRules />;
  }

  const canInteract = !isCommitting && !isRevealing && 
    ((currentRound?.toString() === '1' && !hasCommitted) || 
     (currentRound?.toString() === '2' && !hasRevealed));

  const handleSymbolSelect = (symbol: number) => {
    setSelectedSymbol(symbol);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedSymbol === null || !gameId) return;
    
    if (currentRound?.toString() === '1') {
      onCommit(selectedSymbol, gameId, currentRound.toString());
    } else {
      onReveal(selectedSymbol, gameId.toString(), currentRound.toString());
    }
    setShowConfirmation(false);
  };

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