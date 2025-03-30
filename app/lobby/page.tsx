"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { RagnarokGameMasterABI } from '@/app/abis/RagnarokGameMasterABI';
import LobbyChat from '@/components/chat/LobbyChat';
import GlitchBackground from '@/components/effects/GlitchTextBackground';
import RouteGuard from '@/components/auth/RouteGuard';
import { useContractEventSubscription, ContractEventType } from '@/lib/contract-events';
import type { Abi } from 'viem';
import GameStateRedirect from '@/components/auth/GameStateRedirect';

function LobbyPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [playerList, setPlayerList] = useState<{ playerAddress: string; playerNumber: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivePlayer, setIsActivePlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get player info to check for active games
  const { data: playerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: RagnarokGameMasterABI as Abi,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint, boolean, number, bigint] | undefined };

  // Extract values from playerInfo
  const [gameName, gameId, isActive, gameState, playerNumber] = playerInfo || ['', BigInt(0), false, 0, BigInt(0)];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update active status when it changes
  useEffect(() => {
    setIsActivePlayer(isActive);
  }, [isActive]);

  // Remove unused contract reads since we get this info from playerInfo now
  // Get all active players and their numbers in a single call
  const { data: activePlayersData, refetch: refetchActivePlayers } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: RagnarokGameMasterABI as Abi,
    functionName: 'getActivePlayersAndNumbers',
    args: [],
  });

  // Format player numbers for the player list (needed for chat)
  useEffect(() => {
    if (!activePlayersData || !Array.isArray(activePlayersData)) {
      setPlayerList([]);
      setIsLoading(false);
      return;
    }

    try {
      const [players, numbers] = activePlayersData as [`0x${string}`[], bigint[]];
      const formattedPlayers = players.map((playerAddress, index) => ({
        playerAddress,
        playerNumber: String(numbers[index] || 0).padStart(3, '0')
      }));
      setPlayerList(formattedPlayers);
    } catch (error) {
      console.error('Error formatting player data:', error);
      setPlayerList([]);
    } finally {
      setIsLoading(false);
    }
  }, [activePlayersData]);

  // Listen for player elimination/registration events
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'GameMaster', event: 'PlayerRegistered' },
    { contract: 'GameMaster', event: 'PlayerEliminated' },
  ];

  useContractEventSubscription(
    eventsToSubscribe,
    () => {
      refetchActivePlayers();
    },
    [refetchActivePlayers]
  );

  // Redirect non-active players to home
  useEffect(() => {
    if (isConnected && isActive === false) {
      router.push('/');
    }
  }, [isConnected, isActive, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-neon-300/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-t-neon-300 rounded-full animate-spin"></div>
          </div>
          <p className="text-neon-300 mt-4 font-mono animate-pulse">INITIALIZING NEXUS...</p>
        </div>
      </div>
    );
  }

  return (
    <GameStateRedirect redirectInactive={true} allowLobby={true}>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <GlitchBackground />
        
        {/* Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-accent-1 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-accent-1 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-accent-1 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-accent-1 to-transparent animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto p-4 my-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="relative mb-8">
              <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent"></div>
              <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent"></div>
              <div className="relative py-6 px-8 bg-background backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-5xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground animate-text-shimmer">
                      THE NEXUS
                    </h1>
                    <p className="text-foreground mt-2 font-mono tracking-wider">SURVIVOR INTERFACE v1.0</p>
                  </div>
                  <div className="font-mono text-right">
                    <div className="text-foreground/60">SYSTEM TIME</div>
                    <div className="text-foreground tabular-nums">
                      {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Player Status Card */}
              <div className="relative group">
                <div className="absolute inset-0 from-accent-1 via-content-2 to-accent-1 opacity-50 blur-xl group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-background/40 backdrop-blur-sm  border border-content-3 p-6 h-full">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent-3 animate-pulse"></div>
                      <span className="text-accent-3 font-mono text-sm">CONNECTED</span>
                    </div>
                  </div>
                  <h2 className="text-accent-3 font-mono mb-6">SURVIVOR STATUS</h2>
                  <div className="text-6xl font-bold text-accent-4 font-mono mb-4 tracking-wider">
                    #{isActive ? String(playerNumber).padStart(3, '0') : '---'}
                  </div>
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between text-sm">
                      <span className="text-accent-2">STATUS</span>
                      <span className="text-accent-3">ACTIVE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-accent-2">PROTOCOL</span>
                      <span className="text-accent-3">SURVIVAL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-accent-2">ACTIVE SURVIVORS</span>
                      <span className="text-accent-3">{playerList.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Section - Takes up 2/3 of the grid */}
              <div className="lg:col-span-2 h-[600px]">
                <LobbyChat 
                  gameId="ragnarok-nexus"
                  playerList={playerList}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameStateRedirect>
  );
}

export default function LobbyWithGuard() {
  return (
    <RouteGuard>
      <LobbyPage />
    </RouteGuard>
  );
} 