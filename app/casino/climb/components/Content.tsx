"use client";

import { useState, useEffect } from 'react';
import Game from './Game';
import { ClimbGameState } from '../hooks/useClimbGameData';

interface ClimbGameContentProps {
  gameState: ClimbGameState | null;
  allLevelInfo: {
    allOdds: number[];
    allSonicMultipliers: number[];
    allPointMultipliers: number[];
    minCashoutLevel: number;
    maxLevel: number;
  } | null;
  depositLimits: {
    minDeposit: bigint;
    maxDeposit: bigint;
  } | null;
  canClimb: boolean;
  canCashOut: boolean;
  isClimbing: boolean;
  isCashingOut: boolean;
  isStarting: boolean;
  onStartGame: (depositAmount: string) => void;
  onClimb: () => void;
  onCashOut: () => void;
}

export function Content({
  gameState,
  allLevelInfo,
  depositLimits,
  canClimb,
  canCashOut,
  isClimbing,
  isCashingOut,
  isStarting,
  onStartGame,
  onClimb,
  onCashOut
}: ClimbGameContentProps) {
  // Only scroll to top once on initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show rules if no game is active
  if (!gameState?.isActive) {
    return (
      <div className="w-full">
        <div className="mt-8">
          <Game
            gameState={gameState}
            allLevelInfo={allLevelInfo}
            depositLimits={depositLimits}
            canClimb={canClimb}
            canCashOut={canCashOut}
            isClimbing={isClimbing}
            isCashingOut={isCashingOut}
            isStarting={isStarting}
            onStartGame={onStartGame}
            onClimb={onClimb}
            onCashOut={onCashOut}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Game interface */}
      <Game
        gameState={gameState}
        allLevelInfo={allLevelInfo}
        depositLimits={depositLimits}
        canClimb={canClimb}
        canCashOut={canCashOut}
        isClimbing={isClimbing}
        isCashingOut={isCashingOut}
        isStarting={isStarting}
        onStartGame={onStartGame}
        onClimb={onClimb}
        onCashOut={onCashOut}
      />
    </div>
  );
} 