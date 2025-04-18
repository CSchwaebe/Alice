"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import GameStateRedirect from "@/components/auth/GameStateRedirect";
import GameChat from "@/components/chat/GameChat";
import { addToast } from "@heroui/toast";
import type { GameNotification } from "@/lib/contract-events";

// Import custom hooks
import { useEquilibriumGameData } from "@/hooks/Equilibrium/useEquilibriumGameData";
import { useEquilibriumGameEvents } from "@/hooks/Equilibrium/useEquilibriumGameEvents";
import { useEquilibriumGameTransactions } from "@/hooks/Equilibrium/useEquilibriumGameTransactions";

// Import components
import Content from "@/components/games/Equilibrium/Content";
import { LoadingScreen } from "@/components/games/LoadingScreen";
import { GameCompletionScreen } from "@/components/games/GameCompletionScreen";

function EquilibriumGame() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

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
    gameEndTime,
    roundEndTime,
    gameState,
    playerTeam,
    refetchGameInfo,
    refetchPlayerInfo,
    setGameEndTime,
    setRoundEndTime
  } = useEquilibriumGameData({ address, isConnected });

  // Handle transactions
  const {
    handleSwitchTeam,
    isPending,
    isWaitingTx,
    txStatus,
    setTxStatus,
    errorMessage,
    setErrorMessage
  } = useEquilibriumGameTransactions(gameId, refetchGameInfo, refetchPlayerInfo);

  // Add notification handler
  const handleNotification = (notification: GameNotification) => {
    console.log('Equilibrium: handleNotification called with:', notification);
    addToast(notification);
  };

  // Subscribe to game events
  useEquilibriumGameEvents({
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setGameEndTime,
    setTxStatus,
    setErrorMessage,
    onNotification: handleNotification
  });

  // Check if player is active in the game
  const isActivePlayer = playerList?.some(
    player => 
      player.playerAddress.toLowerCase() === address?.toLowerCase() && 
      player.isActive
  );

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
            playerList={playerList.map(player => ({
              playerNumber: player.playerNumber.toString(),
              isActive: player.isActive
            }))}
            gameName="EQUILIBRIUM"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <div className="relative z-10 w-full h-full p-4 lg:flex lg:flex-row lg:gap-4 max-w-[1440px] mx-auto">
        <div className="w-full lg:flex-1">
          <Content 
            gameState={gameState}
            roundEndTime={roundEndTime}
            playerTeam={playerTeam}
            playerList={playerList}
            onSwitchTeam={handleSwitchTeam}
            isPending={isPending}
            isWaitingTx={isWaitingTx}
          />
        </div>

        {/* Game Chat */}
        {isActivePlayer && gameId && (
          <div className="w-full lg:w-96 mt-8 lg:mt-0 lg:sticky lg:top-4 h-[calc(100vh-2rem)]">
            <GameChat 
              gameId={`equilibrium_${gameId.toString()}`}
              gameName="EQUILIBRIUM"
              playerList={playerList.map(player => ({
                playerAddress: player.playerAddress,
                playerNumber: player.playerNumber.toString()
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function EquilibriumPage() {
  return (
    <GameStateRedirect>
      <EquilibriumGame />
    </GameStateRedirect>
  );
} 