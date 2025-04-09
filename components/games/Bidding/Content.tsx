"use client";

import { useState, useEffect } from 'react';
import BidCard from './Game';
import BiddingGameRules from './Rules';
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
      <div className="relative">
        <BiddingGameRules />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timer and round info display */}
      <div className="flex justify-center mb-8">
        <GameTimer endTime={roundEndTime} onExpired={onTimerExpired} />
      </div>

      {/* Round Counter */}
      <div className="mb-8 flex justify-center">
        <div className="text-2xl lg:text-3xl text-foreground font-bold tracking-wider">
          Round {currentRound.toString()}
        </div>
      </div>
      
      {/* Bidding interface */}
      <BidCard
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