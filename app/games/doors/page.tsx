"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { DoorsABI } from '@/app/abis/DoorsABI';
import GlitchTextBackground from "@/components/effects/GlitchTextBackground";
import CyberscapeBackground from '@/components/effects/CyberscapeBackground';
import RouteGuard from '@/components/auth/RouteGuard';
import DoorChoice from '@/components/games/Doors/DoorChoice';
import ChoicePopup from '@/components/games/Doors/ChoicePopup';
import { GameTimer } from '@/components/ui/GameTimer';
import GameChat from '@/components/chat/GameChat';
import GameRules from '@/components/games/Doors/GameRules';
import { Log } from 'viem';

// Type for the player info returned from the contract
type PlayerInfo = {
  playerAddress: `0x${string}`;
  playerNumber: string;
  isActive: boolean;
  doorsOpened: bigint;
};

// Define proper type for GameInfo
type GameInfo = {
  state: number;
  currentRound: bigint;
  roundEndTime: bigint;
};

export default function DoorsGamePage() {
  return (
    <RouteGuard>
      <DoorsGame />
    </RouteGuard>
  );
}

function DoorsGame() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [playerList, setPlayerList] = useState<PlayerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameId, setGameId] = useState<bigint | null>(null);
  const [txStatus, setTxStatus] = useState<'none' | 'pending' | 'success' | 'error'>('none');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [roundEndTime, setRoundEndTime] = useState<number>(0);
  const [gameState, setGameState] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<bigint>(BigInt(0));

  // Get player info from GameMaster
  const { data: playerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint] | undefined };

  // Add debug logs for playerInfo
  useEffect(() => {
    console.log('Connected Address:', address);
    console.log('Player Info:', playerInfo);
    if (playerInfo) {
      console.log('Game Name:', playerInfo[0]);
      console.log('Game ID:', playerInfo[1]?.toString());
    }
  }, [playerInfo, address]);

  // Update to get game info using getGameInfo instead of getRoundInfo
  const { data: gameInfo, refetch: refetchGameInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS as `0x${string}`,
    abi: DoorsABI,
    functionName: 'getGameInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: GameInfo | undefined, refetch: () => void };

  // Get player list from Doors contract using getPlayerInfo instead of getInfo
  const { data: playerInfoList, refetch: refetchPlayerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS as `0x${string}`,
    abi: DoorsABI,
    functionName: 'getPlayerInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  });

  // Add debug logs for player list
  useEffect(() => {
    console.log('Game ID for query:', gameId?.toString());
    console.log('Raw Player Info List:', playerInfoList);
    if (playerInfoList) {
      console.log('Processed Player List:', playerList);
    }
  }, [gameId, playerInfoList, playerList]);

  // Update gameId when playerInfo is fetched
  useEffect(() => {
    if (playerInfo?.[1]) {
      setGameId(playerInfo[1]);
    }
  }, [playerInfo]);

  // Update player list when data is fetched
  useEffect(() => {
    if (playerInfoList) {
      const formattedPlayerList = (playerInfoList as any[]).map(player => ({
        ...player,
        // Convert bigint playerNumber to padded string
        playerNumber: player.playerNumber.toString().padStart(3, '0')
      }));
      setPlayerList(formattedPlayerList);
      setIsLoading(false);
    }
  }, [playerInfoList]);

  // Verify player is in the correct game
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    if (playerInfo?.[0]) {
      if (playerInfo[0] !== 'DOORS') {
        router.push(`/games/${playerInfo[0].toLowerCase()}`);
      }
    } else {
      router.push('/');
    }
  }, [isConnected, playerInfo, router]);

  // Add contract write hook
  const { writeContract, isPending, data: hash } = useWriteContract();

  // Add transaction wait hook
  const { isLoading: isWaitingTx, isSuccess: isTxSuccess, isError: isTxError } = useWaitForTransactionReceipt({
    hash,
  });

  // Update game info when data is fetched
  useEffect(() => {
    if (gameInfo) {
      setRoundEndTime(Number(gameInfo.roundEndTime));
      setGameState(gameInfo.state);
      setCurrentRound(gameInfo.currentRound);
    }
  }, [gameInfo]);

  // Add event listeners after other hooks

  // Handle door selection
  const handleDoorSelect = async () => {
    if (!gameId) return;

    try {
      setTxStatus('pending');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS as `0x${string}`,
        abi: DoorsABI,
        functionName: 'openDoor',
        args: [],
      });
    } catch (error) {
      console.error('Error opening door:', error);
      setTxStatus('error');
      setErrorMessage('Failed to open door. Please try again.');
    }
  };

  // Watch for transaction status
  useEffect(() => {
    if (isTxSuccess) {
      setTxStatus('success');
      console.log('transaction success refetch');
      // Refetch player info and game info
      refetchPlayerInfo();
      refetchGameInfo();
    } else if (isTxError) {
      setTxStatus('error');
      setErrorMessage('Transaction failed. Please try again.');
    }
  }, [isTxSuccess, isTxError, refetchPlayerInfo, refetchGameInfo]);

  // Check if player is active in the game
  const isActivePlayer = playerList.some(
    player => 
      player.playerAddress.toLowerCase() === address?.toLowerCase() && 
      player.isActive
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-neon-300 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Loading game data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      <CyberscapeBackground />
      
      {/* Main content with responsive layout */}
      <div className="relative z-10 w-full p-4 md:flex md:flex-row md:gap-4 max-w-[1440px] mx-auto">
        {/* Game content - takes full width on mobile, shrinks on desktop to make room for chat */}
        <div className="w-full md:flex-1 pb-12 md:pb-0">
          {gameState === 1 ? (
            // Pre-game state - show game rules
            <GameRules />
          ) : (
            // Active game state - show timer, round counter, and door choice
            <>
              {/* Timer */}
              <div className="flex justify-center mb-8">
                <GameTimer endTime={roundEndTime} />
              </div>

              {/* Round Counter */}
              <div className="mb-8 flex justify-center">
                <div className="text-2xl md:text-3xl text-white font-bold tracking-wider">
                  Round {currentRound.toString()}/10
                </div>
              </div>

              {/* Door Choice Component */}
              <DoorChoice onDoorSelect={handleDoorSelect} />
            </>
          )}

          {/* Player List */}
          <div className="font-mono text-sm bg-black/50 border border-white/20 p-6 mt-8">
            <div className="text-white/70 mb-4 uppercase tracking-wider">Players</div>
            
            <div className="grid grid-cols-3 gap-4 text-xs mb-2 text-white/50 uppercase">
              <div>Player</div>
              <div>Status</div>
              <div>Doors Opened</div>
            </div>
            
            <div className="space-y-2">
              {playerList.map((player) => (
                <div 
                  key={player.playerAddress}
                  className={`grid grid-cols-3 gap-4 text-sm ${
                    player.playerAddress.toLowerCase() === address?.toLowerCase()
                      ? 'text-neon-300'
                      : 'text-white/80'
                  }`}
                >
                  <div className="truncate">
                    {player.playerNumber}
                  </div>
                  <div>
                    {player.isActive ? (
                      <span className="text-green-400">Active</span>
                    ) : (
                      <span className="text-red-400">Eliminated</span>
                    )}
                  </div>
                  <div>{player.doorsOpened.toString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Game Chat - Only show for active players (now positioned in layout) */}
        {isActivePlayer && gameId && (
          <GameChat 
            gameId={`doors_${gameId.toString()}`}
            gameName="DOORS"
            playerList={playerList}
          />
        )}

        {/* Transaction Status */}
        {(isPending || isWaitingTx) && (
          <div className="fixed bottom-4 right-4 font-mono text-xs bg-black/80 border border-white/20 p-4">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-2"></div>
              <span>Processing transaction...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {txStatus === 'error' && (
          <div className="fixed bottom-4 right-4 font-mono text-xs bg-red-900/20 border border-red-500/20 p-4">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 