"use client";

import { useState, useEffect } from 'react';
import { GameTimer } from '@/components/ui/GameTimer';
import Game from './Game';
import Rules from './Rules';
import { FormattedPlayerInfo } from '@/app/games/descend/hooks/useDescendGameData';
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
  onCommitMove: (move: number, gameId: string | number, round: string | number) => void;
  onRevealMove: (move: number, gameId: string | number, round: string | number) => void;
  onTimerExpired: () => void;
  playerList: FormattedPlayerInfo[];
  levelPopulations: Record<number, number>;
  levelCapacities: Record<number, number>;
  currentPhase: number;
  gameId: string | number;
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
  levelPopulations = {},
  levelCapacities = {},
  currentPhase,
  gameId
}: ContentProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMove, setSelectedMove] = useState<number | null>(null);

  // Log level data when it changes
  useEffect(() => {
    console.log('Content component level data:', { levelPopulations, levelCapacities });
  }, [levelPopulations, levelCapacities]);

  // Only scroll to top once on initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (gameState === 1) {
    return (
      <div className="relative">
        <Rules levelCapacities={levelCapacities} />
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
        onCommitMove(selectedMove, gameId, currentRound.toString());
      } else if (!hasRevealed) {
        onRevealMove(selectedMove, gameId, currentRound.toString());
      }
      setShowConfirmation(false);
      setSelectedMove(null);
    }
  };

  return (
    <div className="relative">
      {/* Timer and round info display */}
      <div className={`flex justify-center mb-8`}>
        <GameTimer endTime={roundEndTime} onExpired={onTimerExpired} />
      </div>

      {/* Round and Phase */}
      <div className="mb-4 flex justify-center items-center gap-4">
        <div className="text-2xl lg:text-3xl text-foreground font-bold tracking-wider">
          {currentPhase === 1 ? 'Commit' : 'Reveal'}
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
        levelCapacities={levelCapacities}
      />

      {/* Confirmation Dialog */}
      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirmClick={handleConfirm}
        title={!hasCommitted ? "Confirm Move Commitment" : "Confirm Move Reveal"}
        description={
          !hasCommitted 
            ? `Are you sure you want to commit to moving ${selectedMove} levels down?` 
            : `Are you sure you want to reveal moving ${selectedMove} levels down? Make sure this matches your committed move!`
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
} 