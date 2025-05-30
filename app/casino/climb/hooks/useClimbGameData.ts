import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { ClimbABI } from '@/app/abis/ClimbABI';

// Type for the game state returned from the Climb contract
export type ClimbGameState = {
  currentLevel: number;
  isActive: boolean;
  pendingSequence: bigint;
  pendingType: number;
  startTime: bigint;
  depositAmount: bigint;
  gameId: bigint;
  targetLevel: number;
};

// Type for completed game data
export type CompletedGame = {
  gameId: bigint;
  player: `0x${string}`;
  finalLevel: number;
  success: boolean;
  finalMultiplier: number;
  depositAmount: bigint;
  payout: bigint;
  startTime: bigint;
  endTime: bigint;
  endReason: string;
  paidInPoints: boolean;
};

// Type for level info
export type LevelInfo = {
  oddsToReach: number;
  sonicMultiplier: number;
  pointMultiplier: number;
  canCashOut: boolean;
};

interface UseClimbGameDataProps {
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export function useClimbGameData({ address, isConnected }: UseClimbGameDataProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialData, setHasInitialData] = useState(false);
  const [gameState, setGameState] = useState<ClimbGameState | null>(null);
  const [allLevelInfo, setAllLevelInfo] = useState<{
    allOdds: number[];
    allSonicMultipliers: number[];
    allPointMultipliers: number[];
    minCashoutLevel: number;
    maxLevel: number;
  } | null>(null);
  const [depositLimits, setDepositLimits] = useState<{
    minDeposit: bigint;
    maxDeposit: bigint;
  } | null>(null);

  // Get player's current game state
  const { data: playerGame, refetch: refetchPlayerGame } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`,
    abi: ClimbABI,
    functionName: 'getPlayerGame',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      gcTime: 0
    }
  }) as { data: ClimbGameState | undefined, refetch: () => void };

  // Get all level information
  const { data: levelData, refetch: refetchLevelData } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`,
    abi: ClimbABI,
    functionName: 'getAllLevelInfo',
    args: [],
    query: {
      enabled: true,
      gcTime: 0
    }
  }) as { data: [number[], number[], number[], number, number] | undefined, refetch: () => void };

  // Get player stats
  const { data: playerStats, refetch: refetchPlayerStats } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`,
    abi: ClimbABI,
    functionName: 'getPlayerStats',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      gcTime: 0
    }
  }) as { data: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, number] | undefined, refetch: () => void };

  // Check if player can climb
  const { data: canClimb, refetch: refetchCanClimb } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`,
    abi: ClimbABI,
    functionName: 'canPlayerClimb',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      gcTime: 0
    }
  }) as { data: boolean | undefined, refetch: () => void };

  // Check if player can cash out
  const { data: canCashOut, refetch: refetchCanCashOut } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`,
    abi: ClimbABI,
    functionName: 'canPlayerCashOut',
    args: [address],
    query: {
      enabled: isConnected && !!address,
      gcTime: 0
    }
  }) as { data: boolean | undefined, refetch: () => void };

  // Get minimum deposit
  const { data: minDepositData, refetch: refetchMinDeposit } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`,
    abi: ClimbABI,
    functionName: 'MIN_DEPOSIT',
    args: [],
    query: {
      enabled: true,
      gcTime: 0
    }
  }) as { data: bigint | undefined, refetch: () => void };

  // Get maximum deposit
  const { data: maxDepositData, refetch: refetchMaxDeposit } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`,
    abi: ClimbABI,
    functionName: 'maxDeposit',
    args: [],
    query: {
      enabled: true,
      gcTime: 0
    }
  }) as { data: bigint | undefined, refetch: () => void };

  // Update game state when data is fetched
  useEffect(() => {
    if (playerGame !== undefined) {
      if (playerGame) {
        setGameState({
          currentLevel: Number(playerGame.currentLevel),
          isActive: playerGame.isActive,
          pendingSequence: playerGame.pendingSequence,
          pendingType: Number(playerGame.pendingType),
          startTime: playerGame.startTime,
          depositAmount: playerGame.depositAmount,
          gameId: playerGame.gameId,
          targetLevel: Number(playerGame.targetLevel)
        });
      } else {
        setGameState(null);
      }
      
      // Only set loading to false once we have initial data
      if (!hasInitialData) {
        setHasInitialData(true);
        setIsLoading(false);
      }
    }
  }, [playerGame, hasInitialData]);

  // Update level info when data is fetched
  useEffect(() => {
    if (levelData) {
      const [allOdds, allSonicMultipliers, allPointMultipliers, minCashoutLevel, maxLevel] = levelData;
      setAllLevelInfo({
        allOdds: allOdds.map(Number),
        allSonicMultipliers: allSonicMultipliers.map(Number),
        allPointMultipliers: allPointMultipliers.map(Number),
        minCashoutLevel: Number(minCashoutLevel),
        maxLevel: Number(maxLevel)
      });
    }
  }, [levelData]);

  // Update deposit limits when data is fetched
  useEffect(() => {
    if (minDepositData && maxDepositData) {
      setDepositLimits({
        minDeposit: minDepositData,
        maxDeposit: maxDepositData
      });
    }
  }, [minDepositData, maxDepositData]);

  const refetchAll = () => {
    refetchPlayerGame();
    refetchLevelData();
    refetchPlayerStats();
    refetchCanClimb();
    refetchCanCashOut();
    refetchMinDeposit();
    refetchMaxDeposit();
  };

  return {
    gameState,
    allLevelInfo,
    depositLimits,
    playerStats: playerStats ? {
      totalGames: Number(playerStats[0]),
      totalWins: Number(playerStats[1]),
      totalBusts: Number(playerStats[2]),
      totalDeposited: Number(playerStats[3]),
      netProfit: Number(playerStats[4]),
      totalAliceWon: Number(playerStats[5]),
      totalSonicWon: Number(playerStats[6]),
      highestLevelReached: Number(playerStats[7])
    } : null,
    canClimb: canClimb || false,
    canCashOut: canCashOut || false,
    isLoading,
    refetchPlayerGame,
    refetchLevelData,
    refetchPlayerStats,
    refetchCanClimb,
    refetchCanCashOut,
    refetchAll
  };
} 