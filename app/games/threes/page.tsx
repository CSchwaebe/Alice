"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useThreesGameData } from '@/hooks/useThreesGameData';
import { useThreesGameEvents } from '@/hooks/useThreesGameEvents';
import { useThreesGameTransactions } from '@/hooks/useThreesGameTransactions';
import { GameTimer } from "@/components/ui/GameTimer";
import GameChat from "@/components/chat/GameChat";
import { PlayerList } from "@/components/games/Threes/PlayerList";
import { LoadingScreen } from "@/components/games/LoadingScreen";
import { ThreesGameContent } from "@/components/games/Threes/ThreesGameContent";
import { GameCompletionScreen } from "@/components/games/GameCompletionScreen";
import { Silkscreen } from 'next/font/google';
import RouteGuard from '@/components/auth/RouteGuard';
import GameStateRedirect from '@/components/auth/GameStateRedirect';
import { useEffect, useState } from 'react';
import { addToast } from "@heroui/toast";
import type { GameNotification } from '@/hooks/useThreesGameEvents';

const silkscreen = Silkscreen({ 
  weight: '400',
  subsets: ['latin']
});

function ThreesGame() {
  const { address, isConnected } = useAccount();

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
    setRoundEndTime
  } = useThreesGameData({ address, isConnected });

  const {
    handleCommit,
    handleReveal,
    isLoading: isTxLoading,
    isPending: isTxPending,
    error
  } = useThreesGameTransactions();

  // Add notification handler
  const handleNotification = (notification: GameNotification) => {
    addToast(notification);
  };

  useThreesGameEvents({
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    onNotification: handleNotification
  });

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
            gameName="THREES"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-[1000px]:flex-row w-full h-full">
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center p-4 space-y-8 w-full">
        {gameState !== 1 && (
          <div className={`text-4xl min-[1000px]:text-5xl font-bold mb-8 tracking-wider ${silkscreen.className}`}>
            <GameTimer endTime={roundEndTime} />
          </div>
        )}
        
        <ThreesGameContent
          gameState={gameState}
          currentRound={currentRound}
          hasCommitted={hasCommitted}
          hasRevealed={hasRevealed}
          isCommitting={isTxPending}
          isRevealing={isTxLoading}
          onCommit={handleCommit}
          onReveal={handleReveal}
        />

        {/* Player List */}
        <div className="w-full max-w-4xl">
          <PlayerList players={playerList} />
        </div>

        {error && (
          <div className="w-full max-w-4xl p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded">
            {error}
          </div>
        )}
      </div>

      {/* Right Sidebar - Chat */}
      <div className="w-full min-[1000px]:w-96 p-4">
        <GameChat 
          gameId={gameId?.toString() || ''} 
          playerList={playerList}
          gameName="threes"
        />
      </div>
    </div>
  );
}

export default function ThreesPage() {
  return (
    <RouteGuard>
      <GameStateRedirect>
        <ThreesGame />
      </GameStateRedirect>
    </RouteGuard>
  );
} 