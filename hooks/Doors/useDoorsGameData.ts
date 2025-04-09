import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { DoorsABI } from '@/app/abis/DoorsABI';

// Type for the player info returned from the contract
export type PlayerInfo = {
  playerAddress: `0x${string}`;
  playerNumber: string;
  isActive: boolean;
  doorsOpened: bigint;
};

// Define type for GameInfo
export type GameInfo = {
  state: number;
  currentRound: bigint;
  roundEndTime: bigint;
};

interface UseDoorsGameDataProps {
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export function useDoorsGameData({ address, isConnected }: UseDoorsGameDataProps) {
  const [playerList, setPlayerList] = useState<PlayerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameId, setGameId] = useState<bigint | null>(null);
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
  }) as { data: [string, bigint, boolean, number, bigint] | undefined };

  // Extract values from playerInfo
  const [playerGameName, playerGameId, isPlayerActive, playerGameState, playerNum] = playerInfo || ['', BigInt(0), false, 0, BigInt(0)];

  // Update gameId when playerInfo is fetched
  useEffect(() => {
    if (playerGameId) {
      setGameId(playerGameId);
    }
  }, [playerGameId]);

  // Get game info
  const { data: gameInfo, refetch: refetchGameInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS as `0x${string}`,
    abi: DoorsABI,
    functionName: 'getGameInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: GameInfo | undefined, refetch: () => void };

  // Get player list from Doors contract
  const { data: playerInfoList, refetch: refetchPlayerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS as `0x${string}`,
    abi: DoorsABI,
    functionName: 'getPlayerInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  });

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
    playerInfo,
    playerList,
    isLoading,
    roundEndTime,
    gameState,
    currentRound,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime
  };
} 