"use client";

import { useState } from 'react';
import Game from './Game';
import ViewportDrawer from '@/components/ui/ViewportDrawer';
import { motion } from 'framer-motion';
import ThreesGameRules from './Rules';
import { GameTimer } from '@/components/ui/GameTimer';

export interface ThreesGameContentProps {
  gameState: number;
  currentRound: bigint;
  currentPhase: number;
  hasCommitted: boolean;
  hasRevealed: boolean;
  isCommitting: boolean;
  isRevealing: boolean;
  onCommit: (choice: number, gameId: string | number, round: string | number) => void;
  onReveal: (choice: number, gameId: string, round: string) => void;
  gameId?: string | number;
  roundEndTime: number;
}

export function Content({
  gameState,
  currentRound,
  currentPhase,
  hasCommitted,
  hasRevealed,
  isCommitting,
  isRevealing,
  onCommit,
  onReveal,
  gameId,
  roundEndTime
}: ThreesGameContentProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);

  console.log('currentPhase', currentPhase);
  if (gameState === 1) {
    return <ThreesGameRules />;
  }

  const canInteract = !isCommitting && !isRevealing && 
    ((currentPhase === 1 && !hasCommitted) || 
     (currentPhase === 2 && !hasRevealed));

  const handleSymbolSelect = (symbol: number) => {
    setSelectedSymbol(symbol);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedSymbol === null || !gameId) return;
    
    if (currentPhase === 1) {
      onCommit(selectedSymbol, gameId, currentRound.toString());
    } else {
      onReveal(selectedSymbol, gameId.toString(), currentRound.toString());
    }
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {gameState !== 1 && (
        <div className="flex justify-center mb-8">
          <GameTimer endTime={roundEndTime} />
        </div>
      )}

      {currentRound > BigInt(0) && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {currentPhase === 1 ? 'Commit' : 'Reveal'}
          </h2>
          <p className="text-primary-800">
            {currentPhase === 1
              ? hasCommitted 
                ? 'Waiting for other players...'
                : 'Choose your symbol'
              : hasRevealed
                ? 'Waiting for other players...'
                : 'Choose your symbol to reveal...'}
          </p>
        </div>
      )}
      
      <div className="flex justify-center items-center w-full p-2">
        <Game 
          onSymbolClick={canInteract ? handleSymbolSelect : undefined}
        />
      </div>

      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirmClick={handleConfirm}
        title={currentPhase === 1 ? "Confirm Commit" : "Confirm Reveal"}
        description={currentPhase === 1
          ? "Are you sure you want to commit to this symbol? This action cannot be undone."
          : "Are you sure you want to reveal this symbol? Make sure it matches your committed choice."
        }
      />
    </div>
  );
} 