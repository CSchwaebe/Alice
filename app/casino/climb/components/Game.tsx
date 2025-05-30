"use client";

import { useState, useEffect } from 'react';
import { ClimbGameState } from '../hooks/useClimbGameData';
import { formatEther } from 'viem';
import ViewportDrawer from '@/components/ui/ViewportDrawer';

interface ClimbGameProps {
  gameState: ClimbGameState | null;
  allLevelInfo: {
    allOdds: number[];
    allSonicMultipliers: number[];
    allPointMultipliers: number[];
    minCashoutLevel: number;
    maxLevel: number;
  } | null;
  depositLimits: {
    minDeposit: bigint;
    maxDeposit: bigint;
  } | null;
  canClimb: boolean;
  canCashOut: boolean;
  isClimbing: boolean;
  isCashingOut: boolean;
  isStarting: boolean;
  waitingForEvent?: {
    type: 'climbing' | 'cashingOut' | 'starting' | 'autoClimbing' | null;
    message: string;
  };
  onStartGame: (depositAmount: string) => void;
  onClimb: () => void;
  onCashOut: () => void;
  onAutoClimb: (targetLevel: number) => void;
}

export default function Game({
  gameState,
  allLevelInfo,
  depositLimits,
  canClimb,
  canCashOut,
  isClimbing,
  isCashingOut,
  isStarting,
  waitingForEvent,
  onStartGame,
  onClimb,
  onCashOut,
  onAutoClimb
}: ClimbGameProps) {
  const [depositAmount, setDepositAmount] = useState<string>('1');
  const [showCashOutDialog, setShowCashOutDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Auto-increment selected level when current level matches what was selected
  useEffect(() => {
    if (gameState && selectedLevel && gameState.currentLevel === selectedLevel && allLevelInfo) {
      // If we just climbed to the selected level, set the next level as selected
      if (gameState.currentLevel < allLevelInfo.maxLevel) {
        setSelectedLevel(gameState.currentLevel + 1);
      } else {
        setSelectedLevel(null); // Clear if at max level
      }
    }
  }, [gameState?.currentLevel, selectedLevel, allLevelInfo]);

  // Check if any waiting state is active
  const isWaitingForEvent = waitingForEvent?.type !== null;

  // Format number with proper decimal handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDepositAmount(value);
    }
  };

  const handleStartGame = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      onStartGame(depositAmount);
    }
  };

  const handleCashOutClick = () => {
    setShowCashOutDialog(true);
  };

  const handleConfirmCashOut = () => {
    setShowCashOutDialog(false);
    onCashOut();
  };

  // Calculate potential payouts
  const calculatePayouts = () => {
    if (!gameState || !allLevelInfo) return { sonicPayout: 0, alicePayout: 0 };
    
    const depositAmountEth = parseFloat(formatEther(gameState.depositAmount));
    const currentLevel = gameState.currentLevel;
    
    const sonicMultiplier = (allLevelInfo.allSonicMultipliers[currentLevel] || 0) / 100;
    const aliceMultiplier = allLevelInfo.allPointMultipliers[currentLevel] || 0;
    
    const sonicPayout = depositAmountEth * sonicMultiplier;
    const alicePayout = depositAmountEth * aliceMultiplier;
    
    return { sonicPayout, alicePayout };
  };

  const { sonicPayout, alicePayout } = calculatePayouts();

  // Calculate data for selected level or next level
  const calculateSelectedLevelData = () => {
    if (!gameState || !allLevelInfo) return { targetLevel: 0, sonicPayout: 0, alicePayout: 0, cumulativeOdds: 0 };
    
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
    
    return { targetLevel, sonicPayout, alicePayout, cumulativeOdds: cumulativeOdds * 100 }; // Convert back to percentage
  };

  const { targetLevel, sonicPayout: targetSonicPayout, alicePayout: targetAlicePayout, cumulativeOdds } = calculateSelectedLevelData();

  // If no game is active, show start game interface
  if (!gameState?.isActive) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="relative rounded-lg bg-overlay-medium backdrop-blur-sm border border-border p-6 w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b border-border pb-4 mb-6 relative">
            <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent"></div>
            <h2 className="text-2xl text-foreground font-bold text-center py-1 tracking-widest">
              START NEW GAME
            </h2>
          </div>

          {/* Deposit input */}
          <div className="mb-6">
            <label className="block text-primary-400 text-sm mb-2 flex items-center">
              <div className="w-1 h-4 bg-foreground mr-2"></div>
              DEPOSIT AMOUNT (S)
            </label>
            
            <div className="relative">
              <input
                type="text"
                value={depositAmount}
                onChange={handleInputChange}
                className="w-full bg-overlay-light border border-border rounded-lg
                         px-4 py-3 text-foreground font-mono text-lg tracking-wider
                         focus:outline-none focus:border-primary-400 focus:bg-overlay-medium
                         transition-colors duration-200
                         placeholder:text-primary-200"
                placeholder="1"
              />
              
              {/* Tech decorators */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-400 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-400 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-400 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-400 pointer-events-none" />
            </div>

            <div className="mt-2 text-xs font-mono text-primary-400 space-y-1">
              {depositLimits && (
                <>
                  <div>Minimum deposit: {formatEther(depositLimits.minDeposit)} S</div>
                  <div>Maximum deposit: {formatEther(depositLimits.maxDeposit)} S</div>
                </>
              )}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartGame}
            disabled={isStarting || !depositAmount || parseFloat(depositAmount) <= 0 || isWaitingForEvent}
            className="w-full bg-foreground text-background py-3 rounded-lg
                     font-mono tracking-widest text-lg
                     hover:bg-foreground transition-colors duration-200
                     disabled:bg-overlay-light disabled:text-primary-200"
          >
            {isStarting || (waitingForEvent?.type === 'starting') ? "STARTING..." : "START CLIMB"}
          </button>
        </div>
      </div>
    );
  }

  // Active game interface
  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative rounded-lg bg-overlay-medium backdrop-blur-sm border border-border p-6 w-full max-w-4xl mx-auto">
        {/* Game status */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 px-4 py-1 bg-background rounded-full border border-border text-xs font-mono tracking-wider text-foreground flex items-center">
          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${gameState.pendingSequence > 0 ? 'bg-primary-400' : 'bg-foreground'}`} />
          LEVEL {gameState.currentLevel}
        </div>
        
        {/* Header */}
        <div className="border-b border-border pb-4 mb-6 relative">
          <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent"></div>
          <h2 className="text-2xl text-foreground font-bold text-center py-1 tracking-widest">
            CLIMB
          </h2>
          
          {/* Game ID */}
          <div className="absolute -bottom-3 right-0 text-[8px] font-mono text-primary-400">
            GAME::{gameState.gameId.toString().padStart(6, '0')}
          </div>
        </div>

        {/* Game info */}
        <div className="bg-overlay-light grid grid-cols-2 gap-4 mb-6">
          <div className="rounded p-4">
            <div className="text-primary-400 text-sm mb-2">YOUR BALANCE</div>
            <div className="text-foreground text-sm font-mono">
              <div>{sonicPayout.toFixed(2)} S</div>
              <div className="text-primary-400 text-xs mt-1">or {alicePayout.toFixed(0)} ALICE</div>
            </div>
          </div>

        
          
          <div className="rounded p-4">
            <div className="text-primary-400 text-sm mb-2 text-right">CURRENT LEVEL</div>
            <div className="text-foreground text-sm font-mono text-right">
              {gameState.currentLevel}
            </div>
          </div>
        </div>

        {/* Level progression */}
        {allLevelInfo && (
          <div className="mb-6">
            <div className="text-primary-400 text-sm mb-3">SELECT LEVEL</div>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Array.from({ length: allLevelInfo.maxLevel }, (_, i) => i + 1).map((level) => (
                <div
                  key={level}
                  onClick={() => level !== gameState.currentLevel ? setSelectedLevel(level === selectedLevel ? null : level) : undefined}
                  className={`p-2 rounded text-center text-xs font-mono border transition-all duration-200 ${
                    selectedLevel === level
                      ? 'bg-primary-400 text-background border-primary-400'
                      : level <= gameState.currentLevel
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-overlay-light text-primary-400 border-border'
                  } ${
                    selectedLevel === level 
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' 
                      : ''
                  } ${
                    level === gameState.currentLevel 
                      ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background' 
                      : ''
                  } ${
                    level !== gameState.currentLevel 
                      ? 'cursor-pointer hover:border-foreground' 
                      : 'cursor-not-allowed'
                  }`}
                >
                  {level}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success odds and balance change */}
        {allLevelInfo && gameState.currentLevel < allLevelInfo.maxLevel && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            {/* Balance change preview */}
            <div className="rounded p-4">
              <div className="text-primary-400 text-sm mb-2">
                LEVEL {targetLevel} {selectedLevel ? 'PAYOUT' : 'PAYOUT'}
              </div>
              <div className="text-left">
                <div className="text-foreground font-mono text-lg">
                  {targetSonicPayout.toFixed(2)} S
                </div>
                <div className="text-primary-400 font-mono text-xs mt-1">
                  or {targetAlicePayout.toFixed(0)} ALICE
                </div>
              </div>
            </div>

            {/* Success odds */}
            <div className="rounded p-4">
              <div className="text-primary-400 text-sm mb-2 text-right">
                {selectedLevel ? 'ODDS' : 'ODDS'}
              </div>
              <div className="text-foreground font-mono text-lg text-right">
                {selectedLevel 
                  ? cumulativeOdds.toFixed(2)
                  : ((allLevelInfo.allOdds[gameState.currentLevel + 1] || 0) / 100).toFixed(2)
                }%
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleCashOutClick}
            disabled={!canCashOut || isCashingOut || gameState.pendingSequence > 0 || isWaitingForEvent}
            className="bg-overlay-light text-primary-400 py-3 rounded-lg
                     font-mono tracking-widest text-lg border border-border
                     hover:bg-overlay-medium transition-colors duration-200
                     disabled:bg-overlay-light disabled:text-primary-200"
          >
            {isCashingOut || (waitingForEvent?.type === 'cashingOut') ? "CASHING OUT..." : "CASH OUT"}
          </button>
          
          <button
            onClick={() => selectedLevel ? onAutoClimb(selectedLevel) : onClimb()}
            disabled={!canClimb || isClimbing || gameState.pendingSequence > 0 || isWaitingForEvent}
            className="bg-foreground text-background py-3 rounded-lg
                     font-mono tracking-widest text-lg
                     hover:bg-foreground transition-colors duration-200
                     disabled:bg-overlay-light disabled:text-primary-200"
          >
            {isClimbing || (waitingForEvent?.type === 'climbing') || (waitingForEvent?.type === 'autoClimbing')
              ? "CLIMBING..." 
              : selectedLevel 
                ? `CLIMB TO ${selectedLevel}` 
                : `CLIMB TO ${gameState.currentLevel + 1}`
            }
          </button>
        </div>
        
        {/* Tech decoration */}
        <div className="absolute bottom-2 left-2 text-[6px] font-mono text-primary-400">
          v1.0.0
        </div>
      </div>

      {/* Cash Out Confirmation Dialog */}
      <ViewportDrawer
        isOpen={showCashOutDialog}
        onClose={() => setShowCashOutDialog(false)}
        onConfirmClick={handleConfirmCashOut}
        title="Confirm Cash Out"
        description={`You will receive ${sonicPayout.toFixed(2)} S or ${alicePayout.toFixed(0)} ALICE.`}
        confirmText={isCashingOut ? "CASHING OUT..." : "CONFIRM CASH OUT"}
        cancelText="Cancel"
      />
    </div>
  );
} 