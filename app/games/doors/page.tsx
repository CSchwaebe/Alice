"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/auth/RouteGuard';
import GameChat from '@/components/chat/GameChat';
import { addToast } from '@heroui/toast';
import type { GameNotification } from '@/hooks/useDoorsGameEvents';

// Import custom hooks
import { useDoorsGameData } from '@/hooks/useDoorsGameData';
import { useDoorsGameEvents } from '@/hooks/useDoorsGameEvents';
import { useDoorsGameTransactions } from '@/hooks/useDoorsGameTransactions';
import { useGameRouteGuard } from '@/hooks/useGameRouteGuard';

// Import components
import GameContent from '@/components/games/Doors/GameContent';
import PlayerList from '@/components/games/Doors/PlayerList';
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
    txStatus,
    errorMessage,
    isPending,
    isWaitingTx,
    setTxStatus,
    setErrorMessage
  } = useDoorsGameTransactions(gameId, refetchPlayerInfo, refetchGameInfo);
  
  // Add notification handler
  const handleNotification = (notification: GameNotification) => {
    console.log('Doors: handleNotification called with:', notification);
    addToast({
      title: notification.title,
      description: notification.description,
      color: notification.color,
      duration: 5000 // Add explicit duration to make sure toasts are visible
    });
  };
  
  // Subscribe to game events and get notifications
  useDoorsGameEvents({
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    setTxStatus,
    setErrorMessage,
    onNotification: handleNotification
  });
  
  // Protect route - redirect if user is not in the correct game
  useGameRouteGuard({
    isConnected,
    playerInfo,
    expectedGameName: 'DOORS'
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Main content with responsive layout */}
      <div className="relative z-10 w-full p-4 md:flex md:flex-row md:gap-4 max-w-[1440px] mx-auto">
        {/* Game content - takes full width on mobile, shrinks on desktop to make room for chat */}
        <div className="w-full md:flex-1 pb-12 md:pb-0">
          {/* Game content (rules or active game) */}
          <GameContent 
            gameState={gameState}
            roundEndTime={roundEndTime}
            currentRound={currentRound}
            onDoorSelect={handleDoorSelect}
          />

          {/* Player List */}
          <PlayerList 
            playerList={playerList}
            currentPlayerAddress={address}
          />
        </div>
        
        {/* Game Chat - Only show for active players */}
        {isActivePlayer && gameId && (
          <GameChat 
            gameId={`doors_${gameId.toString()}`}
            gameName="DOORS"
            playerList={playerList}
          />
        )}
      </div>
    </div>
  );
}

export default function DoorsGamePage() {
  return (
    <RouteGuard>
      <DoorsGame />
    </RouteGuard>
  );
} 