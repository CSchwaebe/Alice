import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { BiddingABI } from '@/app/abis/BiddingABI';
import { useRouter } from 'next/navigation';

// Type for the player info returned from the Bidding contract
export type BiddingPlayerInfo = {
  playerAddress: `0x${string}`;
  playerNumber: bigint;
  points: bigint;
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
  points: number;
  hasCommitted: boolean;
  hasRevealed: boolean;
  isActive: boolean;
};

interface UseBiddingGameDataProps {
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export function useBiddingGameData({ address, isConnected }: UseBiddingGameDataProps) {
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
  const [playerPoints, setPlayerPoints] = useState<number>(0);

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
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_BIDDING as `0x${string}`,
    abi: BiddingABI,
    functionName: 'getGameInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: GameInfo | undefined, refetch: () => void };

  // Get current phase (commit or reveal)
  const { data: phase, refetch: refetchPhase } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_BIDDING as `0x${string}`,
    abi: BiddingABI,
    functionName: 'getCurrentPhase',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  });

  // Get all players info
  const { data: playersInfo, refetch: refetchPlayerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_BIDDING as `0x${string}`,
    abi: BiddingABI,
    functionName: 'getPlayerInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: BiddingPlayerInfo[] | undefined, refetch: () => void };

  // Update game info when data is fetched
  useEffect(() => {
    if (gameInfo) {
      console.log('Game Info received:', {
        state: gameInfo.state,
        currentRound: gameInfo.currentRound.toString(),
        roundEndTime: new Date(Number(gameInfo.roundEndTime) * 1000).toLocaleString(),
        rawEndTime: gameInfo.roundEndTime.toString()
      });
      setRoundEndTime(Number(gameInfo.roundEndTime));
      setGameState(gameInfo.state);
      setCurrentRound(gameInfo.currentRound);
    }
  }, [gameInfo]);

  // Update phase
  useEffect(() => {
    if (phase !== undefined) {
      console.log('Current Phase:', Number(phase));
      setCurrentPhase(Number(phase));
    }
  }, [phase]);

  // Update player info when data is fetched
  useEffect(() => {
    if (playersInfo) {
      // Format player list with three digit numbers and all status info
      const formattedPlayers = playersInfo.map(player => ({
        playerAddress: player.playerAddress,
        playerNumber: player.playerNumber.toString().padStart(3, '0'),
        points: Number(player.points),
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
        setPlayerPoints(currentPlayer.points);
      }
      
      setIsLoading(false);
    }
  }, [playersInfo, address]);

  const refetchAll = () => {
    refetchGameInfo();
    refetchPlayerInfo();
    refetchPhase();
  };

  return {
    gameId,
    playerInfo: playerList.find(p => p.playerAddress.toLowerCase() === address?.toLowerCase()),
    playerList,
    playerPoints,
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
    setCurrentPhase
  };
} 