import { formatEther } from 'viem';
import { ClimbGameState } from '../hooks/useClimbGameData';

export interface PayoutCalculation {
  sonicPayout: number;
  alicePayout: number;
}

export interface LevelCalculation extends PayoutCalculation {
  targetLevel: number;
  cumulativeOdds: number;
}

export interface LevelInfo {
  allOdds: number[];
  allSonicMultipliers: number[];
  allPointMultipliers: number[];
  minCashoutLevel: number;
  maxLevel: number;
}

// Calculate payouts for current level
export function calculateCurrentPayouts(
  gameState: ClimbGameState | null,
  allLevelInfo: LevelInfo | null
): PayoutCalculation {
  if (!gameState || !allLevelInfo) {
    return { sonicPayout: 0, alicePayout: 0 };
  }
  
  const depositAmountEth = parseFloat(formatEther(gameState.depositAmount));
  const currentLevel = gameState.currentLevel;
  
  const sonicMultiplier = (allLevelInfo.allSonicMultipliers[currentLevel] || 0) / 100;
  const aliceMultiplier = allLevelInfo.allPointMultipliers[currentLevel] || 0;
  
  return {
    sonicPayout: depositAmountEth * sonicMultiplier,
    alicePayout: depositAmountEth * aliceMultiplier
  };
}

// Calculate payouts and odds for target level
export function calculateTargetLevelData(
  gameState: ClimbGameState | null,
  allLevelInfo: LevelInfo | null,
  selectedLevel: number | null
): LevelCalculation {
  if (!gameState || !allLevelInfo) {
    return { targetLevel: 0, sonicPayout: 0, alicePayout: 0, cumulativeOdds: 0 };
  }
  
  const depositAmountEth = parseFloat(formatEther(gameState.depositAmount));
  const targetLevel = selectedLevel || (gameState.currentLevel + 1);
  
  // Get multipliers for target level
  const sonicMultiplier = (allLevelInfo.allSonicMultipliers[targetLevel] || 0) / 100;
  const aliceMultiplier = allLevelInfo.allPointMultipliers[targetLevel] || 0;
  
  const sonicPayout = depositAmountEth * sonicMultiplier;
  const alicePayout = depositAmountEth * aliceMultiplier;
  
  // Calculate cumulative odds from current level + 1 to target level
  let cumulativeOdds = 1;
  for (let level = gameState.currentLevel + 1; level <= targetLevel; level++) {
    const levelOdds = (allLevelInfo.allOdds[level] || 0) / 100;
    cumulativeOdds *= levelOdds / 100; // Convert percentage to decimal
  }
  
  return { 
    targetLevel, 
    sonicPayout, 
    alicePayout, 
    cumulativeOdds: cumulativeOdds * 100 // Convert back to percentage
  };
}

// Validate decimal input for deposit amount
export function isValidDecimalInput(value: string): boolean {
  return value === '' || /^\d*\.?\d*$/.test(value);
} 