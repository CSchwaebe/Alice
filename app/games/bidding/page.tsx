"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import GameStateRedirect from '@/components/auth/GameStateRedirect';
import GameChat from '@/components/chat/GameChat';
import { addToast } from '@heroui/toast';
import type { GameNotification } from '@/lib/contract-events';
import ViewportDrawer from '@/components/ui/ViewportDrawer';

// Import custom hooks
import { useBiddingGameData } from '@/hooks/Bidding/useBiddingGameData';
import { useBiddingGameEvents } from '@/hooks/Bidding/useBiddingGameEvents';
import { useBiddingGameTransactions } from '@/hooks/Bidding/useBiddingGameTransactions';

// Import components
import { Content } from '@/components/games/Bidding/Content';
import PlayerList from '@/components/games/Bidding/PlayerList';
import { LoadingScreen } from '@/components/games/LoadingScreen';
import { GameCompletionScreen } from '@/components/games/GameCompletionScreen';


function BiddingGame() {
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
    playerPoints,
    isLoading,
    roundEndTime,
    gameState,
    currentRound,
    currentPhase,
    hasCommitted,
    hasRevealed,
    refetchGameInfo,
    refetchPlayerInfo,
    refetchAll,
    setCurrentRound,
    setRoundEndTime,
    setCurrentPhase
  } = useBiddingGameData({ address, isConnected });
  
  // Handle transactions
  const {
    handleCommitBid,
    handleRevealBid,
    handleEndExpiredGames,
    isLoading: isTxLoading,
    isPending: isTxPending,
    error,
    isSuccess
  } = useBiddingGameTransactions();
  
  // Add notification handler
  const handleNotification = (notification: GameNotification) => {
    console.log('Bidding: handleNotification called with:', notification);
    addToast(notification);
  };
  
  // Subscribe to game events
  useBiddingGameEvents({
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    refetchAll,
    setCurrentRound,
    setRoundEndTime,
    setCurrentPhase,
    onNotification: handleNotification
  });
  
  // Handle timer expiration
  const handleTimerExpired = useCallback(() => {
    if (gameState !== 1 && gameState !== 4) {
      setShowEndGameDialog(true);
    }
  }, [gameState]);

  // Handle ending expired games
  const handleEndGames = async () => {
    try {
      await handleEndExpiredGames();
    } catch (err) {}
  };

  // Handle transaction success/failure
  useEffect(() => {
    if (isSuccess) {
      setShowEndGameDialog(false);
      refetchAll();
    }
  }, [isSuccess, refetchAll]);

  useEffect(() => {
    if (error) {
    }
  }, [error]);
  
  // Wrap the handlers to include gameId and round
  const handleBidCommit = (amount: number) => {
    if (gameId && currentRound) {
      handleCommitBid(amount, gameId.toString(), currentRound.toString());
    }
  };

  const handleBidReveal = (amount: number) => {
    if (gameId && currentRound) {
      handleRevealBid(amount, gameId.toString(), currentRound.toString());
    }
  };
  
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
            gameName="BIDDING"
          />
        </div>
      </div>
    );
  }

  // Check if player is active in the game
  const isActivePlayer = playerInfo?.isActive || false;
  
  console.log('Game State:', {
    gameState,
    playerList,
    isActivePlayer
  });
  
  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <div className="relative z-10 w-full h-full p-4 lg:flex lg:flex-row lg:gap-4 max-w-[1440px] mx-auto">
        <div className="w-full lg:flex-1 flex flex-col items-center">
          <div className="mb-8 w-full">
            <Content 
              gameState={gameState}
              currentRound={currentRound}
              currentPhase={currentPhase}
              playerPoints={playerPoints}
              hasCommitted={hasCommitted}
              hasRevealed={hasRevealed}
              isCommitting={isTxPending}
              isRevealing={isTxLoading}
              roundEndTime={roundEndTime}
              onCommitBid={handleBidCommit}
              onRevealBid={handleBidReveal}
              onTimerExpired={handleTimerExpired}
            />
          </div>

          {/* Player List */}
          <div className="w-full max-w-4xl">
            <PlayerList 
              players={playerList}
              currentPlayerAddress={address}
            />
          </div>

          {error && (
            <div className="w-full max-w-4xl p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded">
              {error}
            </div>
          )}
        </div>

        {/* Game Chat */}
        {isActivePlayer && gameId && (
          <div className="w-full lg:w-96 mt-8 lg:mt-0 lg:sticky lg:top-4 h-[calc(100vh-2rem)]">
            <GameChat 
              gameId={`bidding_${gameId.toString()}`}
              gameName="BIDDING"
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
          currentPhase === 1 
            ? "Someone in your game did not commit their bid in time. Process the round to eliminate them and continue the game"
            : "Someone in your game did not reveal their bid in time. Process the round to eliminate them and continue the game"
        }
        confirmText={isTxPending ? "PROCESSING..." : "Process Round"}
        cancelText="Cancel"
      />
    </div>
  );
}

export default function BiddingPage() {
  return (
    <GameStateRedirect>
      <BiddingGame />
    </GameStateRedirect>
  );
}
