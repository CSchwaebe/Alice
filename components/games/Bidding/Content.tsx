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
      <div className="flex justify-center mb-8">
        <GameTimer endTime={roundEndTime} onExpired={onTimerExpired} />
      </div>

      {/* Round and Phase */}
      <div className="mb-8 flex justify-center items-center gap-4">
        <div className="text-2xl lg:text-3xl text-foreground font-bold tracking-wider">
          Round {currentRound.toString()}
        </div>
        <div className="text-2xl lg:text-3xl text-foreground font-bold tracking-wider">
          - {currentPhase === 1 ? 'Commit Phase' : 'Reveal Phase'}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-8">
        <p className="text-primary-800">
          {currentPhase === 1 
            ? !hasCommitted
              ? 'Enter your bid amount to commit...'
              : 'Waiting for other players to commit their bids...'
            : !hasCommitted
              ? 'You missed the commit phase! Wait for the next round...'
              : !hasRevealed
                ? 'Enter the same bid amount to reveal...'
                : 'Waiting for other players to reveal their bids...'}
        </p>
      </div>

    
      
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