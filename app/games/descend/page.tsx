"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GameStateRedirect from '@/components/auth/GameStateRedirect';
import GameChat from '@/components/chat/GameChat';
import { addToast } from '@heroui/toast';
import type { GameNotification } from '@/lib/contract-events';
import ViewportDrawer from '@/components/ui/ViewportDrawer';

// Import custom hooks
import { useDescendGameData } from '@/hooks/Descend/useDescendGameData';
import { useDescendGameEvents } from '@/hooks/Descend/useDescendGameEvents';
import { useDescendGameTransactions } from '@/hooks/Descend/useDescendGameTransactions';

// Import components
import { Content } from '@/components/games/Descend/Content';
import PlayerList from '@/components/games/Descend/PlayerList';
import { LoadingScreen } from '@/components/games/LoadingScreen';
import { GameCompletionScreen } from '@/components/games/GameCompletionScreen';

function DescendGame() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  
  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch game data
  const {
    gameId,
    playerInfo,
    playerList,
    isLoading,
    roundEndTime,
    gameState,
    currentRound,
    hasCommitted,
    hasRevealed,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    levelPopulations,
  } = useDescendGameData({ address, isConnected });
  
  // Handle transactions
  const {
    handleCommitMove,
    handleRevealMove,
    handleEndExpiredGames,
    isLoading: isTxLoading,
    isPending: isTxPending,
    error,
    isSuccess
  } = useDescendGameTransactions();
  
  // Add notification handler
  const handleNotification = (notification: GameNotification) => {
    console.log('Descend: handleNotification called with:', notification);
    addToast(notification);
  };
  
  // Subscribe to game events
  useDescendGameEvents({
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    onNotification: handleNotification
  });
  
  // Handle timer expiration
  const handleTimerExpired = () => {
    if (gameState !== 1 && gameState !== 4) {
      setShowEndGameDialog(true);
    }
  };

  // Handle ending expired games
  const handleEndGames = async () => {
    try {
      await handleEndExpiredGames();
      setShowEndGameDialog(false);
    } catch (err) {
      console.error('Error ending expired games:', err);
    }
  };

  // Handle transaction success
  useEffect(() => {
    if (isSuccess) {
      setShowEndGameDialog(false);
      refetchGameInfo();
      refetchPlayerInfo();
    }
  }, [isSuccess, refetchGameInfo, refetchPlayerInfo]);
  
  // Display loading screen until data is ready
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Show game completion screen if game is over (gameState === 4)
  if (gameState === 4) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <GameCompletionScreen 
            playerList={playerList}
            gameName="DESCEND"
          />
        </div>
      </div>
    );
  }
  
  // Check if player is active in the game
  const isActivePlayer = playerInfo?.isActive || false;
  
  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <div className="relative z-10 w-full p-4 lg:flex lg:flex-row lg:gap-4 max-w-[1440px] mx-auto">
        <div className="w-full lg:flex-1">
          {/* Game content (rules or active game) */}
          <div className="mb-8">
            <Content 
              gameState={gameState}
              currentRound={currentRound}
              playerLevel={playerInfo?.level || 0}
              hasCommitted={hasCommitted}
              hasRevealed={hasRevealed}
              isCommitting={isTxPending}
              isRevealing={isTxLoading}
              roundEndTime={roundEndTime}
              onCommitMove={handleCommitMove}
              onRevealMove={handleRevealMove}
              onTimerExpired={handleTimerExpired}
              playerList={playerList}
              levelPopulations={levelPopulations}
            />
          </div>

          {/* Player List */}
          <div className="mt-8">
            <PlayerList players={playerList} />
          </div>
        </div>
        
        {/* Game Chat */}
        {isActivePlayer && gameId && (
          <div className="w-full lg:w-96 mt-8 lg:mt-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
            <GameChat 
              gameId={`descend_${gameId.toString()}`}
              gameName="DESCEND"
              playerList={playerList}
            />
          </div>
        )}
      </div>

      {/* End Expired Games Dialog */}
      <ViewportDrawer
        isOpen={showEndGameDialog}
        onClose={() => setShowEndGameDialog(false)}
        onConfirmClick={handleEndGames}
        title="Finish Him"
        description={
          !hasCommitted 
            ? "Someone in your game did not commit their move in time. Process the round to eliminate them and continue the game"
            : "Someone in your game did not reveal their move in time. Process the round to eliminate them and continue the game"
        }
        confirmText={isTxPending ? "PROCESSING..." : "Process Round"}
        cancelText="Cancel"
      />
    </div>
  );
}

export default function GamePage() {
  return (
    <GameStateRedirect>
      <DescendGame />
    </GameStateRedirect>
  );
} 