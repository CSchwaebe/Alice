"use client";

import { useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { RagnarokGameMasterABI } from '@/app/abis/RagnarokGameMasterABI';
import type { Abi } from 'viem';

// GameState enum matching the contract
enum GameState {
    NotInitialized = 0,
    Pregame = 1,
    Active = 2,
    Waiting = 3,
    Completed = 4
}

// Define possible redirect destinations
enum RedirectDestination {
    Home = '/',
    Register = '/register',
    Lobby = '/lobby',
    GameOver = '/gameover'
}

type GameStateRedirectProps = {
  children: React.ReactNode;
  // Where to redirect unregistered players
  redirectUnregistered?: boolean;
  // Where to redirect registered but inactive players
  redirectInactive?: boolean;
  // Where to redirect registered players with no active game
  redirectNoGame?: boolean;
  // If true, allows staying on registration page unless there's an active game or player is eliminated
  allowRegistrationPage?: boolean;
  // If true, allows staying on lobby page even if there's no active game
  allowLobby?: boolean;
};

export default function GameStateRedirect({
  children,
  redirectUnregistered = false,
  redirectInactive = false,
  redirectNoGame = false,
  allowRegistrationPage = false,
  allowLobby = false
}: GameStateRedirectProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // Get player info to check for active games and state
  const { data: playerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: RagnarokGameMasterABI as Abi,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint, boolean, GameState, bigint] | undefined };

  // Check if player is registered
  const { data: isRegistered } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: RagnarokGameMasterABI as Abi,
    functionName: 'isRegistered',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: boolean | undefined };

  useEffect(() => {
    // Helper function to perform redirect
    const redirect = (destination: string, reason: string) => {
      console.log(`GameStateRedirect: Redirecting to ${destination} - ${reason}`);
      router.push(destination);
    };

    // Helper function to check if game is in active state
    const isGameActive = (gameState: GameState): boolean => {
      return gameState !== GameState.NotInitialized && 
             gameState !== GameState.Completed;
    };

    // Log initial state
    console.log('GameStateRedirect: Initial State', {
      isConnected,
      address,
      playerInfo,
      isRegistered,
      currentPath: window.location.pathname,
      redirectFlags: {
        redirectUnregistered,
        redirectInactive,
        redirectNoGame,
        allowRegistrationPage,
        allowLobby
      }
    });

    // Early returns for special cases
    if (!isConnected || !address) {
      return redirect(RedirectDestination.Home, 'No wallet connection');
    }

    if (!playerInfo || isRegistered === undefined) {
      console.log('GameStateRedirect: Waiting for data...');
      return;
    }

    // Extract player info
    const [gameName, gameId, isActive, gameState, playerNumber] = playerInfo;
    const currentPath = window.location.pathname;

    // Log player state
    console.log('GameStateRedirect: Player State', {
      gameName,
      gameId: gameId.toString(),
      isActive,
      gameState: GameState[gameState],
      playerNumber: playerNumber.toString(),
      currentPath
    });

    // Redirect Priority System
    try {
      // 1. Handle eliminated players (highest priority)
      if (!isActive && isRegistered) {
        // Only redirect to game over if we're not already there
        if (currentPath !== RedirectDestination.GameOver) {
          return redirect(RedirectDestination.GameOver, 'Player eliminated');
        }
        return;
      }

      // 2. Handle active game redirects
      if (gameName && isGameActive(gameState)) {
        const gameRoute = `/games/${gameName.toLowerCase()}`;
        // Only redirect if we're not already on the game page
        if (currentPath !== gameRoute) {
          return redirect(gameRoute, 'Active game in progress');
        }
        return;
      }

      // 3. Special page allowances
      if (allowRegistrationPage && currentPath === RedirectDestination.Register) {
        return;
      }
      if (allowLobby && currentPath === RedirectDestination.Lobby) {
        return;
      }

      // 4. Handle unregistered players
      if (redirectUnregistered && !isRegistered) {
        return redirect(RedirectDestination.Register, 'Player not registered');
      }

      // 5. Handle registered players with no active game
      if (redirectNoGame && isRegistered && (!gameName || !isGameActive(gameState))) {
        return redirect(RedirectDestination.Lobby, 'No active game');
      }

      console.log('GameStateRedirect: No redirect needed', {
        currentPath,
        isRegistered,
        hasGame: !!gameName,
        gameState: GameState[gameState],
        isActive
      });

    } catch (error) {
      console.error('GameStateRedirect: Error during redirect logic', error);
      // On error, redirect to home for safety
      return redirect(RedirectDestination.Home, 'Error in redirect logic');
    }
  }, [
    isConnected,
    address,
    playerInfo,
    isRegistered,
    redirectUnregistered,
    redirectNoGame,
    redirectInactive,
    allowRegistrationPage,
    allowLobby,
    router
  ]);

  return <>{children}</>;
} 