"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import GameChat from '@/components/chat/GameChat';
import { addToast } from '@heroui/toast';
import type { GameNotification } from '@/lib/contract-events';
import { useEffect } from 'react';

// Import custom hooks
import { useDoorsGameData } from '@/app/games/doors/hooks/useDoorsGameData';
import { useDoorsGameEvents } from '@/app/games/doors/hooks/useDoorsGameEvents';
import { useDoorsGameTransactions } from '@/app/games/doors/hooks/useDoorsGameTransactions';
import GameStateRedirect from '@/components/auth/GameStateRedirect';

// Import components
import Content from '@/app/games/doors/components/Content';
import PlayerList from '@/app/games/doors/components/PlayerList';
import { LoadingScreen } from '@/components/games/LoadingScreen';
import { GameCompletionScreen } from '@/components/games/GameCompletionScreen';

function DoorsGame() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  // Fetch game data
  const {
    gameId,
    playerInfo,
    playerList,
    isLoading,
    roundEndTime,
    gameState,
    currentRound,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime
  } = useDoorsGameData({ address, isConnected });
  
  // Handle transactions
  const {
    handleDoorSelect,
    error,
    isPending,
    isWaitingTx,
    isSuccess
  } = useDoorsGameTransactions(gameId, refetchPlayerInfo, refetchGameInfo);
  
  // Add notification handler
  const handleNotification = (notification: GameNotification) => {
    console.log('Doors: handleNotification called with:', notification);
    addToast(notification);
  };
  
  // Handle transaction notifications
  useEffect(() => {
    if (error) {
      addToast({
        title: 'Transaction Failed',
        description: error,
        color: 'danger',
        timeout: 1000,
      });
    }
  }, [error]);

  // Handle transaction success
  useEffect(() => {
    if (!isPending && !isWaitingTx && !error) {
      if (isSuccess) {
        addToast({
          title: 'Door Selection Successful',
          description: 'Your door has been selected!',
          color: 'success',
          timeout: 1000,
        });
      }
    }
  }, [isPending, isWaitingTx, error, isSuccess]);
  
  // Subscribe to game events and get notifications
  useDoorsGameEvents({
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    onNotification: handleNotification
  });
  
  // Check if player is active in the game
  const isActivePlayer = playerList.some(
    player => 
      player.playerAddress.toLowerCase() === address?.toLowerCase() && 
      player.isActive
  );

  // Show loading screen until data is loaded
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check if game is completed (gameState === 4)
  const isGameCompleted = gameState === 4;

  // Show game completion screen if game is over
  if (isGameCompleted) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <GameCompletionScreen 
            playerList={playerList}
            gameName="DOORS"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <div className="relative z-10 w-full p-4 lg:flex lg:flex-row lg:gap-4 max-w-[1440px] mx-auto">
        <div className="w-full lg:flex-1 lg:flex lg:flex-col">
          <div>
            <Content 
              gameState={gameState}
              roundEndTime={roundEndTime}
              currentRound={currentRound}
              onDoorSelect={handleDoorSelect}
            />
          </div>

          {/* Player List */}
          <div className="w-full max-w-4xl mt-8">
            <PlayerList 
              playerList={playerList}
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
          <div className="w-full lg:w-96 mt-8 lg:mt-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
            <GameChat 
              gameId={`doors_${gameId.toString()}`}
              gameName="DOORS"
              playerList={playerList}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DoorsGamePage() {
  return (
    <GameStateRedirect>
      <DoorsGame />
    </GameStateRedirect>
  );
} 