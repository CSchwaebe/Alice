"use client";

import { useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
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
    Home = '/portal',
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
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  // Get player info to check for active games and state
  const { data: playerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI as Abi,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint, boolean, GameState, bigint] | undefined };

  // Check if player is registered
  const { data: isRegistered } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI as Abi,
    functionName: 'isRegistered',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: boolean | undefined };

  useEffect(() => {
    // Helper function to perform redirect
    const redirect = (destination: string, reason: string) => {
      // Don't redirect if we're already on the target page
      if (currentPath === destination) {
        return;
      }
      console.log(`GameStateRedirect: Redirecting to ${destination} - ${reason}`);
      router.push(destination, { scroll: true });
    };

    // Redirect to home if wallet is not connected
    if (!isConnected) {
      return redirect(RedirectDestination.Home, 'Wallet not connected');
    }

    // Helper function to check if game is in active state
    const isGameActive = (gameState: GameState): boolean => {
      return gameState !== GameState.NotInitialized && 
             gameState !== GameState.Completed;
    };

    // Special handling for lobby page
    if (allowLobby && currentPath === RedirectDestination.Lobby) {
      // Only redirect away from lobby if we have all data
      if (address && playerInfo && isRegistered !== undefined) {
        if (!isRegistered) {
          return redirect(RedirectDestination.Register, 'Player not registered');
        }
        if (redirectInactive && !playerInfo[2]) { // playerInfo[2] is isActive
          return redirect(RedirectDestination.Home, 'Player not active');
        }
        // Check for active game and redirect if found
        const [gameName, , , gameState] = playerInfo;
        if (gameName && isGameActive(gameState)) {
          const gameRoute = `/games/${gameName.toLowerCase()}`;
          return redirect(gameRoute, 'Active game in progress');
        }
      }
      return;
    }

    // Wait for all data before making other redirect decisions
    if (!address || !playerInfo || isRegistered === undefined) {
      return;
    }

    // Extract player info
    const [gameName, gameId, isActive, gameState, playerNumber] = playerInfo;

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