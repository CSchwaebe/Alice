import { useState, useEffect, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { DescendABI } from '@/app/abis/DescendABI';
import { useRouter } from 'next/navigation';

// Type for the player info returned from the Descend contract
export type DescendPlayerInfo = {
  playerAddress: `0x${string}`;
  playerNumber: bigint;
  level: bigint;
  lastMove: bigint;
  hasCommitted: boolean;
  hasRevealed: boolean;
  isActive: boolean;
};

// Define type for GameInfo
export type GameInfo = {
  state: number;
  currentRound: bigint;
  roundEndTime: bigint;
  gameStartTime: bigint;
  gameEndTime: bigint;
};

// Type for the formatted player info we'll use in the UI
export type FormattedPlayerInfo = {
  playerAddress: `0x${string}`;
  playerNumber: string; // Three digit string format
  level: number;
  lastMove: number;
  hasCommitted: boolean;
  hasRevealed: boolean;
  isActive: boolean;
};

interface UseDescendGameDataProps {
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export function useDescendGameData({ address, isConnected }: UseDescendGameDataProps) {
  const router = useRouter();
  const [playerList, setPlayerList] = useState<FormattedPlayerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameId, setGameId] = useState<bigint | null>(null);
  const [roundEndTime, setRoundEndTime] = useState<number>(0);
  const [gameState, setGameState] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<bigint>(BigInt(0));
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [hasCommitted, setHasCommitted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [playerLevel, setPlayerLevel] = useState<number>(0);
  const [levelPopulations, setLevelPopulations] = useState<Record<number, number>>({});
  const [levelCapacities, setLevelCapacities] = useState<Record<number, number>>({});

  // Get player info from GameMaster
  const { data: playerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      gcTime: 0 // Don't garbage collect this data
    }
  }) as { data: [string, bigint, boolean, number, bigint] | undefined };

  // Extract values from playerInfo
  const [playerGameName, playerGameId, isPlayerActive, playerGameState, playerNum] = playerInfo || ['', BigInt(0), false, 0, BigInt(0)];

  // Get level populations in a single call
  const { data: levelPopulationsData } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`,
    abi: DescendABI,
    functionName: 'getLevelPopulations',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: bigint[] | undefined };

  // Get level capacities from contract
  const { data: levelCapacitiesData } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`,
    abi: DescendABI,
    functionName: 'getLevelCapacities',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: bigint[] | undefined };

  // Update level populations and capacities when data changes
  useEffect(() => {
    if (!levelPopulationsData || !levelCapacitiesData) return;
    
    const newPopulations: Record<number, number> = {};
    const newCapacities: Record<number, number> = {};

    levelPopulationsData.forEach((population, level) => {
      newPopulations[level] = Number(population);
    });

    levelCapacitiesData.forEach((capacity, level) => {
      newCapacities[level] = Number(capacity);
    });

    setLevelPopulations(newPopulations);
    setLevelCapacities(newCapacities);
  }, [levelPopulationsData, levelCapacitiesData]);

  // Add effect to check player's active status
  useEffect(() => {
    if (isConnected && !isPlayerActive && playerGameId !== BigInt(0)) {
      router.push('/gameover');
    }
  }, [isConnected, isPlayerActive, playerGameId, router]);

  // Update gameId when playerInfo is fetched
  useEffect(() => {
    if (playerGameId) {
      setGameId(playerGameId);
    }
  }, [playerGameId]);

  // Get game info and phase in a single call
  const { data: gameInfo, refetch: refetchGameInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`,
    abi: DescendABI,
    functionName: 'getGameInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: GameInfo | undefined, refetch: () => void };

  // Get current phase
  const { data: phase } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`,
    abi: DescendABI,
    functionName: 'getCurrentPhase',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: bigint | undefined };

  // Update phase when data changes
  useEffect(() => {
    if (phase !== undefined) {
      setCurrentPhase(Number(phase));
    }
  }, [phase]);

  // Get all players info
  const { data: playersInfo, refetch: refetchPlayerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`,
    abi: DescendABI,
    functionName: 'getPlayerInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: DescendPlayerInfo[] | undefined, refetch: () => void };

  // Update player info when data is fetched
  useEffect(() => {
    if (playersInfo) {
      // Format player list with three digit numbers and all status info
      const formattedPlayers = playersInfo.map(player => ({
        playerAddress: player.playerAddress,
        playerNumber: player.playerNumber.toString().padStart(3, '0'),
        level: Number(player.level),
        lastMove: Number(player.lastMove),
        hasCommitted: player.hasCommitted,
        hasRevealed: player.hasRevealed,
        isActive: player.isActive
      }));
      
      setPlayerList(formattedPlayers);
      
      // Find current player's info to set their status
      const currentPlayer = formattedPlayers.find(
        player => player.playerAddress.toLowerCase() === address?.toLowerCase()
      );
      
      if (currentPlayer) {
        setHasCommitted(currentPlayer.hasCommitted);
        setHasRevealed(currentPlayer.hasRevealed);
        setPlayerLevel(currentPlayer.level);
      }
      
      setIsLoading(false);
    }
  }, [playersInfo, address]);

  // Update game info when data is fetched
  useEffect(() => {
    if (gameInfo) {
      setRoundEndTime(Number(gameInfo.roundEndTime));
      setGameState(gameInfo.state);
      setCurrentRound(gameInfo.currentRound);
    }
  }, [gameInfo]);

  // Memoize refetch functions
  const refetchAll = useCallback(() => {
    refetchGameInfo();
    refetchPlayerInfo();
  }, [refetchGameInfo, refetchPlayerInfo]);

  return {
    gameId,
    playerInfo: playerList.find(p => p.playerAddress.toLowerCase() === address?.toLowerCase()),
    playerList,
    playerLevel,
    levelPopulations,
    levelCapacities,
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
    setCurrentPhase,
    setLevelPopulations,
    setLevelCapacities
  };
} 