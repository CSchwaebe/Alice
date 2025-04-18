import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { EquilibriumABI } from '@/app/abis/EquilibriumABI';

// Type for the player info returned from the contract
export type PlayerInfo = {
  playerAddress: `0x${string}`;
  playerNumber: bigint;
  team: number;
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

interface UseEquilibriumGameDataProps {
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export function useEquilibriumGameData({ address, isConnected }: UseEquilibriumGameDataProps) {
  const [playerList, setPlayerList] = useState<PlayerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameId, setGameId] = useState<bigint | null>(null);
  const [gameEndTime, setGameEndTime] = useState<number>(0);
  const [roundEndTime, setRoundEndTime] = useState<number>(0);
  const [gameState, setGameState] = useState<number>(0);
  const [playerTeam, setPlayerTeam] = useState<number>(0);

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
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_EQUILIBRIUM as `0x${string}`,
    abi: EquilibriumABI,
    functionName: 'getGameInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  }) as { data: GameInfo | undefined, refetch: () => void };

  // Get player list from Equilibrium contract
  const { data: playerInfoList, refetch: refetchPlayerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_EQUILIBRIUM as `0x${string}`,
    abi: EquilibriumABI,
    functionName: 'getPlayerInfo',
    args: [gameId],
    query: {
      enabled: !!gameId
    }
  });

  // Update player list when data is fetched
  useEffect(() => {
    if (playerInfoList) {
      setPlayerList(playerInfoList as PlayerInfo[]);
      setIsLoading(false);

      // Update current player's team
      if (address) {
        const player = (playerInfoList as PlayerInfo[]).find(
          (p) => p.playerAddress.toLowerCase() === address.toLowerCase()
        );
        if (player) {
          setPlayerTeam(player.team);
        }
      }
    }
  }, [playerInfoList, address]);

  // Update game info when data is fetched
  useEffect(() => {
    if (gameInfo) {
      setGameEndTime(Number(gameInfo.gameEndTime));
      setRoundEndTime(Number(gameInfo.roundEndTime));
      setGameState(gameInfo.state);
    }
  }, [gameInfo]);

  return {
    gameId,
    playerInfo,
    playerList,
    isLoading,
    gameEndTime,
    roundEndTime,
    gameState,
    playerTeam,
    refetchGameInfo,
    refetchPlayerInfo,
    setGameEndTime,
    setRoundEndTime
  };
} 