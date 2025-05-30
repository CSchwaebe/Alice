"use client";

import { useState, useEffect } from 'react';
import Game from './Game';
import Rules from './Rules';
import { GameTimer } from '@/components/ui/GameTimer';

interface BiddingGameContentProps {
  gameState: number;
  currentRound: bigint;
  currentPhase: number;
  playerPoints: number;
  hasCommitted: boolean;
  hasRevealed: boolean;
  isCommitting: boolean;
  isRevealing: boolean;
  roundEndTime: number;
  onCommitBid: (amount: number) => void;
  onRevealBid: (amount: number) => void;
  onTimerExpired: () => void;
}

export function Content({
  gameState,
  currentRound,
  currentPhase,
  playerPoints,
  hasCommitted,
  hasRevealed,
  isCommitting,
  isRevealing,
  roundEndTime,
  onCommitBid,
  onRevealBid,
  onTimerExpired
}: BiddingGameContentProps) {
  // Only scroll to top once on initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (gameState === 1) {
    return (
      <div className="w-full">
        <Rules />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Timer and round info display */}
      {gameState !== 1 && (
        <div className="flex justify-center mb-12">
          <GameTimer endTime={roundEndTime} onExpired={onTimerExpired} />
        </div>
      )}

     

    
      
      {/* Bidding interface */}
      <Game
        playerPoints={playerPoints}
        phase={currentPhase}
        hasCommitted={hasCommitted}
        hasRevealed={hasRevealed}
        isCommitting={isCommitting}
        isRevealing={isRevealing}
        onCommitBid={onCommitBid}
        onRevealBid={onRevealBid}
      />
    </div>
  );
} 