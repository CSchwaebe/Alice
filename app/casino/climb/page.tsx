"use client";

import { useAccount } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';
import { formatEther } from 'viem';

// Import custom hooks
import { useClimbGameData } from '@/app/casino/climb/hooks/useClimbGameData';
import { useClimbGameEvents } from '@/app/casino/climb/hooks/useClimbGameEvents';
import { useClimbGameTransactions } from '@/app/casino/climb/hooks/useClimbGameTransactions';

// Import components
import Game from '@/app/casino/climb/components/Game';
import { LoadingScreen } from '@/components/games/LoadingScreen';
import { WaitingOverlay } from '@/app/casino/climb/components/WaitingOverlay';

function ClimbGame() {
  const { address, isConnected } = useAccount();
  
  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch game data
  const {
    gameState,
    allLevelInfo,
    depositLimits,
    playerStats,
    canClimb,
    canCashOut,
    isLoading,
    refetchPlayerGame,
    refetchLevelData,
    refetchPlayerStats,
    refetchCanClimb,
    refetchCanCashOut,
    refetchAll
  } = useClimbGameData({ address, isConnected });
  
  // Handle transactions
  const {
    handleStartGame,
    handleClimb,
    handleCashOut,
    handleAutoClimb,
    isLoading: isTxLoading,
    isPending: isTxPending,
    error,
    isSuccess,
    waitingState,
    clearWaitingState,
    showResult
  } = useClimbGameTransactions();
  
  // Subscribe to game events
  useClimbGameEvents({
    address,
    refetchPlayerGame,
    refetchLevelData,
    refetchPlayerStats,
    refetchCanClimb,
    refetchCanCashOut,
    refetchAll,
    clearWaitingState,
    showResult
  });

  // Handle transaction success/failure
  useEffect(() => {
    if (isSuccess) {
      refetchAll();
    }
  }, [isSuccess, refetchAll]);

  useEffect(() => {
    if (error) {
      // Error is already handled in the transactions hook
    }
  }, [error]);
  
  // Wrap the handlers
  const handleGameStart = (depositAmount: string) => {
    handleStartGame(depositAmount);
  };

  const handleGameClimb = () => {
    handleClimb();
  };

  const handleGameCashOut = () => {
    handleCashOut();
  };

  const handleGameAutoClimb = (targetLevel: number) => {
    handleAutoClimb(targetLevel);
  };
  
  // Display loading screen until data is ready
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <div className="relative z-10 w-full h-full p-4 max-w-[1440px] mx-auto">
        <div className="w-full flex flex-col items-center">
          <div className="mb-8 w-full">
            <Game
              gameState={gameState}
              allLevelInfo={allLevelInfo}
              depositLimits={depositLimits}
              status={{
                canClimb,
                canCashOut,
                isClimbing: isTxPending,
                isCashingOut: isTxLoading,
                isStarting: isTxPending,
                waitingForEvent: waitingState
              }}
              actions={{
                onStartGame: handleGameStart,
                onClimb: handleGameClimb,
                onCashOut: handleGameCashOut,
                onAutoClimb: handleGameAutoClimb
              }}
              isConnected={isConnected}
            />
          </div>

          {/* Rules Section */}
          <div className="w-full max-w-4xl mb-8">
            <div className="bg-overlay-medium backdrop-blur-sm border border-border rounded-lg p-6">
              <h3 className="text-primary-800 font-mono mb-4">How To Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-primary-300 text-sm mb-1 font-mono">WAGER</div>
                    <div className="text-primary-700 font-mono text-xs">Choose a wager amount to start the game (1 Sonic for initial testing)</div>
                  </div>
                  <div>
                    <div className="text-primary-300 text-sm mb-1 font-mono">LEVELS</div>
                    <div className="text-primary-700 font-mono text-xs">There are 10 levels - the higher you go, the more you win</div>
                  </div>
                  <div>
                    <div className="text-primary-300 text-sm mb-1 font-mono">DECISIONS</div>
                    <div className="text-primary-700 font-mono text-xs">Climb one level at a time or click on a level to directly climb to that level</div>
                  </div>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-primary-300 text-sm mb-1 font-mono">PAYOUT</div>
                    <div className="text-primary-700 font-mono text-xs">When you cash out, you will be paid in either Sonic or ALICE (50/50 chance)</div>
                  </div>
                  <div>
                    <div className="text-primary-300 text-sm mb-1 font-mono">ODDS</div>
                    <div className="text-primary-700 font-mono text-xs">You will be shown your odds before you place your bet. Per level odds can also be found in the table below.</div>
                  </div>
                  <div>
                    <div className="text-primary-300 text-sm mb-1 font-mono">FAIRNESS</div>
                    <div className="text-primary-700 font-mono text-xs">We use Pyth Network for provably fair random number generation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level Info Table */}
          {allLevelInfo && (
            <div className="w-full max-w-4xl mb-8">
              <div className="bg-overlay-medium backdrop-blur-sm border border-border rounded-lg p-6">
                <h3 className="text-primary-800 font-mono mb-4">LEVEL INFORMATION</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm font-mono">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-primary-400 py-2 px-1 sm:px-2">LVL</th>
                        <th className="text-right text-primary-400 py-2 px-1 sm:px-2">ODDS</th>
                        <th className="text-right text-primary-400 py-2 px-1 sm:px-2">SONIC</th>
                        <th className="text-right text-primary-400 py-2 px-1 sm:px-2">ALICE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: allLevelInfo.maxLevel }, (_, i) => i + 1).map((level) => (
                        <tr key={level} className="border-b border-border">
                          <td className="py-2 px-1 sm:px-2 text-foreground text-left">{level}</td>
                          <td className="py-2 px-1 sm:px-2 text-foreground text-right">
                            {((allLevelInfo.allOdds[level] || 0) / 100).toFixed(2)}%
                          </td>
                          <td className="py-2 px-1 sm:px-2 text-foreground text-right">
                            {((allLevelInfo.allSonicMultipliers[level] || 0) / 100).toLocaleString(undefined, { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}x
                          </td>
                          <td className="py-2 px-1 sm:px-2 text-foreground text-right">
                            {(allLevelInfo.allPointMultipliers[level] || 0).toLocaleString()}x
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Player Stats */}
          {playerStats && (
            <div className="w-full max-w-4xl mb-8">
              <div className="bg-overlay-medium backdrop-blur-sm border border-border rounded-lg p-6">
                <h3 className="text-primary-800 font-mono mb-4">PLAYER STATISTICS</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-overlay-light rounded p-3">
                    <div className="text-primary-400 text-xs mb-1">TOTAL GAMES</div>
                    <div className="text-foreground font-mono">{playerStats.totalGames}</div>
                  </div>
                  <div className="bg-overlay-light rounded p-3">
                    <div className="text-primary-400 text-xs mb-1">WINS</div>
                    <div className="text-foreground font-mono">{playerStats.totalWins}</div>
                  </div>
                  <div className="bg-overlay-light rounded p-3">
                    <div className="text-primary-400 text-xs mb-1">SONIC WON</div>
                    <div className="text-foreground font-mono">{parseFloat(formatEther(BigInt(playerStats.totalSonicWon))).toFixed(2)} S</div>
                  </div>
                  <div className="bg-overlay-light rounded p-3">
                    <div className="text-primary-400 text-xs mb-1">ALICE WON</div>
                    <div className="text-foreground font-mono">{playerStats.totalAliceWon.toLocaleString()} ALICE</div>
                  </div>
                  <div className="bg-overlay-light rounded p-3">
                    <div className="text-primary-400 text-xs mb-1">HIGHEST LEVEL</div>
                    <div className="text-foreground font-mono">{playerStats.highestLevelReached}</div>
                  </div>
                  
                </div>
               
                  
               
              </div>
            </div>
          )}

          {error && (
            <div className="w-full max-w-4xl p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
      
      {/* Waiting overlay */}
      <WaitingOverlay 
        isVisible={waitingState.type !== null}
        message={waitingState.message}
        resultInfo={waitingState.resultInfo}
        onTimeout={clearWaitingState}
      />
    </div>
  );
}

export default function ClimbPage() {
  return <ClimbGame />;
}
