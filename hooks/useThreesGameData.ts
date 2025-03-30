import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { RagnarokGameMasterABI } from '@/app/abis/RagnarokGameMasterABI';
import { ThreesABI } from '@/app/abis/ThreesABI';
import { useRouter } from 'next/navigation';

// Type for the player info returned from the Threes contract
export type ThreesPlayerInfo = {
  playerAddress: `0x${string}`;
  playerNumber: bigint;
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
  hasCommitted: boolean;
  hasRevealed: boolean;
  isActive: boolean;
};

interface UseThreesGameDataProps {
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export function useThreesGameData({ address, isConnected }: UseThreesGameDataProps) {
  const router = useRouter();
  const [playerList, setPlayerList] = useState<FormattedPlayerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameId, setGameId] = useState<bigint | null>(null);
  const [roundEndTime, setRoundEndTime] = useState<number>(0);
  const [gameState, setGameState] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<bigint>(BigInt(0));
  const [hasCommitted, setHasCommitted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  // Get player info from GameMaster
  const { data: playerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: RagnarokGameMasterABI,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint, boolean, number, bigint] | undefined };

  // Extract values from playerInfo
  const [playerGameName, playerGameId, isPlayerActive, playerGameState, playerNum] = playerInfo || ['', BigInt(0), false, 0, BigInt(0)];

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
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_THREES as `0x${string}`,
    abi: ThreesABI,
    functionName: 'getGameInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: GameInfo | undefined, refetch: () => void };

  // Get all players info
  const { data: playersInfo, refetch: refetchPlayerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_THREES as `0x${string}`,
    abi: ThreesABI,
    functionName: 'getPlayerInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: ThreesPlayerInfo[] | undefined, refetch: () => void };

  // Update player info when data is fetched
  useEffect(() => {
    if (playersInfo) {
      // Format player list with three digit numbers and all status info
      const formattedPlayers = playersInfo.map(player => ({
        playerAddress: player.playerAddress,
        playerNumber: player.playerNumber.toString().padStart(3, '0'),
        hasCommitted: player.hasCommitted,
        hasRevealed: player.hasRevealed,
        isActive: player.isActive
      }));
      
      setPlayerList(formattedPlayers);
      
      // Find current player's info to set their commit/reveal status
      const currentPlayer = playersInfo.find(
        player => player.playerAddress.toLowerCase() === address?.toLowerCase()
      );
      
      if (currentPlayer) {
        setHasCommitted(currentPlayer.hasCommitted);
        setHasRevealed(currentPlayer.hasRevealed);
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

  return {
    gameId,
    playerInfo: playerList.find(p => p.playerAddress.toLowerCase() === address?.toLowerCase()),
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
  };
} 