import { useState, useEffect } from 'react';
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
  const [hasCommitted, setHasCommitted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [playerLevel, setPlayerLevel] = useState<number>(0);
  const [levelPopulations, setLevelPopulations] = useState<Record<number, number>>({});

  // Get player info from GameMaster
  const { data: playerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint, boolean, number, bigint] | undefined };

  // Extract values from playerInfo
  const [playerGameName, playerGameId, isPlayerActive, playerGameState, playerNum] = playerInfo || ['', BigInt(0), false, 0, BigInt(0)];

  // Get level populations
  const levelPopulationResults = Array.from({ length: 22 }, (_, i) => {
    return useReadContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`,
      abi: DescendABI,
      functionName: 'getLevelPopulation',
      args: [gameId, BigInt(i)],
      query: {
        enabled: !!gameId
      }
    });
  });

  // Update level populations when data changes
  useEffect(() => {
    if (!gameId) return;
    
    const newPopulations: Record<number, number> = {};
    levelPopulationResults.forEach((result, level) => {
      newPopulations[level] = Number(result.data || 0);
    });
    setLevelPopulations(newPopulations);
  }, [gameId, ...levelPopulationResults.map(r => r.data)]);

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

  // Get game info
  const { data: gameInfo, refetch: refetchGameInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`,
    abi: DescendABI,
    functionName: 'getGameInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: GameInfo | undefined, refetch: () => void };

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

  const refetchAll = () => {
    refetchGameInfo();
    refetchPlayerInfo();
  };

  return {
    gameId,
    playerInfo: playerList.find(p => p.playerAddress.toLowerCase() === address?.toLowerCase()),
    playerList,
    playerLevel,
    levelPopulations,
    isLoading,
    roundEndTime,
    gameState,
    currentRound,
    hasCommitted,
    hasRevealed,
    refetchGameInfo,
    refetchPlayerInfo,
    refetchAll,
    setCurrentRound,
    setRoundEndTime
  };
} 