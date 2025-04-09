"use client";

import { useState, useEffect } from 'react';
import { GameTimer } from '@/components/ui/GameTimer';
import Game from './Game';
import Rules from './Rules';
import { FormattedPlayerInfo } from '@/hooks/Descend/useDescendGameData';
import ViewportDrawer from '@/components/ui/ViewportDrawer';

interface ContentProps {
  gameState: number;
  currentRound: bigint;
  playerLevel: number;
  hasCommitted: boolean;
  hasRevealed: boolean;
  isCommitting: boolean;
  isRevealing: boolean;
  roundEndTime: number;
  onCommitMove: (move: number) => void;
  onRevealMove: (move: number) => void;
  onTimerExpired: () => void;
  playerList: FormattedPlayerInfo[];
  levelPopulations: Record<number, number>;
}

export function Content({
  gameState,
  currentRound,
  playerLevel,
  hasCommitted,
  hasRevealed,
  isCommitting,
  isRevealing,
  roundEndTime,
  onCommitMove,
  onRevealMove,
  onTimerExpired,
  playerList,
  levelPopulations
}: ContentProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMove, setSelectedMove] = useState<number | null>(null);

  // Only scroll to top once on initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (gameState === 1) {
    return (
      <div className="relative">
        <Rules />
      </div>
    );
  }

  const handleMoveSelect = (move: number) => {
    setSelectedMove(move);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedMove !== null) {
      if (!hasCommitted) {
        onCommitMove(selectedMove);
      } else if (!hasRevealed) {
        onRevealMove(selectedMove);
      }
      setShowConfirmation(false);
      setSelectedMove(null);
    }
  };

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

      {/* Level info */}
      <div className="mb-8 flex justify-center">
        <div className="text-xl text-primary-800">
          Current Level: {playerLevel}
        </div>
      </div>
      
      {/* Game interface */}
      <Game 
        currentLevel={playerLevel}
        allPlayers={playerList}
        onLevelSelect={handleMoveSelect}
        hasCommitted={hasCommitted}
        hasRevealed={hasRevealed}
        gameState={gameState}
        levelPopulations={levelPopulations}
      />

      {/* Game Status */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-2">
          {!hasCommitted ? 'Commit Phase' : 'Reveal Phase'}
        </h2>
        <p className="text-primary-800">
          {!hasCommitted 
            ? 'Click on a highlighted level to commit your move...'
            : !hasRevealed
              ? 'Click on the same level to reveal your move...'
              : 'Waiting for other players...'}
        </p>
      </div>

      {/* Confirmation Dialog */}
      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirmClick={handleConfirm}
        title={!hasCommitted ? "Confirm Move Commit" : "Confirm Move Reveal"}
        description={!hasCommitted 
          ? `Are you sure you want to commit move ${selectedMove}? This action cannot be undone.`
          : `Are you sure you want to reveal move ${selectedMove}? Make sure it matches your committed choice.`
        }
        confirmText={isCommitting || isRevealing ? "Processing..." : "Confirm"}
        cancelText="Cancel"
      />
    </div>
  );
} 