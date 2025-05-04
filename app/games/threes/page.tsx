"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useThreesGameData } from '@/hooks/Threes/useThreesGameData';
import { useThreesGameEvents } from '@/hooks/Threes/useThreesGameEvents';
import { useThreesGameTransactions } from '@/hooks/Threes/useThreesGameTransactions';
import GameChat from "@/components/chat/GameChat";
import MobileChat from "@/components/chat/MobileChat";
import { PlayerList } from "@/components/games/Threes/PlayerList";
import { LoadingScreen } from "@/components/games/LoadingScreen";
import { Content } from "@/components/games/Threes/Content";
import { GameCompletionScreen } from "@/components/games/GameCompletionScreen";
import { Silkscreen } from 'next/font/google';
import GameStateRedirect from '@/components/auth/GameStateRedirect';
import { useEffect, useState } from 'react';
import { addToast } from "@heroui/toast";
import type { GameNotification } from '@/hooks/Threes/useThreesGameEvents';

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
    currentPhase,
    hasCommitted,
    hasRevealed,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    setCurrentPhase
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
    console.log('Threes: handleNotification called with:', notification);
    addToast(notification);
  };

  useThreesGameEvents({
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    setCurrentPhase,
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

  // Check if player is active in the game
  const isActivePlayer = playerInfo?.isActive || false;

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <div className="relative z-10 w-full p-4 lg:flex lg:flex-row lg:gap-4 max-w-[1440px] mx-auto">
        <div className="w-full lg:flex-1 lg:flex lg:flex-col">
          <Content
            gameState={gameState}
            currentRound={currentRound}
            currentPhase={currentPhase}
            hasCommitted={hasCommitted}
            hasRevealed={hasRevealed}
            isCommitting={isTxPending}
            isRevealing={isTxLoading}
            onCommit={handleCommit}
            onReveal={handleReveal}
            gameId={gameId?.toString()}
            roundEndTime={roundEndTime}
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

        {/* Game Chat - Only shown for active players */}
        {isActivePlayer && gameId && (
          <div className="w-full lg:w-96 mt-8 lg:mt-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
            <GameChat 
              gameId={`threes_${gameId.toString()}`}
              playerList={playerList}
              gameName="THREES"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ThreesPage() {
  return (
      <GameStateRedirect>
        <ThreesGame />
      </GameStateRedirect>
  );
} 