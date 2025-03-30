"use client";

import { useAccount, useReadContract } from 'wagmi';
import { RagnarokGameMasterABI } from '@/app/abis/RagnarokGameMasterABI';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RouteGuard from '@/components/auth/RouteGuard';
import GlitchTextBackground from '@/components/effects/GlitchTextBackground';
import './styles.css';

function GameOverContent() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Get player info from contract
  const { data: playerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: RagnarokGameMasterABI,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint, boolean, number, bigint] | undefined };

  // Get player's final placement
  const { data: finalPlacement } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: RagnarokGameMasterABI,
    functionName: 'getPlayerFinalPlacement',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: bigint | undefined };

  // Extract values from playerInfo
  const [gameName, gameId, isActive, gameState, playerNumber] = playerInfo || ['', BigInt(0), false, 0, BigInt(0)];

  // Add debug logs
  useEffect(() => {
    console.log('Debug - Player Info:', {
      address,
      isConnected,
      rawPlayerInfo: playerInfo,
      extractedInfo: {
        gameName,
        gameId: gameId.toString(),
        isActive,
        gameState,
        playerNumber: playerNumber.toString()
      },
      finalPlacement: finalPlacement ? finalPlacement.toString() : 'undefined'
    });
  }, [address, isConnected, playerInfo, gameName, gameId, isActive, gameState, playerNumber, finalPlacement]);

  // Format player number with leading zeros - handle 0 as valid value
  const formattedPlayerNumber = typeof playerNumber !== 'undefined' ? playerNumber.toString().padStart(3, '0') : '---';
  const formattedPlacement = finalPlacement ? finalPlacement.toString() : '---';

  // Determine placement suffix (1st, 2nd, 3rd, etc.)
  const getPlacementSuffix = (placement: string) => {
    if (placement === '---') return '';
    const num = parseInt(placement);
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
  };

  // Animation timing
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <GlitchTextBackground />
      
      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-scanlines opacity-5"></div>
      
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center font-mono animate-pulse">
              <div className="text-2xl text-primary-700">ANALYZING FINAL RESULTS...</div>
            </div>
          ) : (
            <div className={`space-y-8 transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Game Over Title */}
              <div className="text-center mb-12">
                <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-4 tracking-wider glitch-text">
                  GAME OVER
                </h1>
                <div className="h-px w-48 md:w-64 bg-gradient-to-r from-transparent via-primary-500 to-transparent mx-auto"></div>
              </div>

              {/* Player Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Player Number Card */}
                <div className="bg-content-1 border border-border p-6 backdrop-blur-sm">
                  <div className="text-primary-600 text-sm font-mono mb-2">PLAYER ID</div>
                  <div className="text-4xl font-bold text-foreground font-mono">#{formattedPlayerNumber}</div>
                  <div className="mt-2 h-px w-full bg-gradient-to-r from-primary-200 to-transparent"></div>
                </div>

                {/* Final Placement Card */}
                <div className="bg-content-1 border border-border p-6 backdrop-blur-sm">
                  <div className="text-primary-600 text-sm font-mono mb-2">FINAL PLACEMENT</div>
                  <div className="text-4xl font-bold text-foreground font-mono">
                    {formattedPlacement}<span className="text-2xl text-primary-700">{getPlacementSuffix(formattedPlacement)}</span>
                  </div>
                  <div className="mt-2 h-px w-full bg-gradient-to-r from-primary-200 to-transparent"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GameOverPage() {
  return (
    <RouteGuard>
      <GameOverContent />
    </RouteGuard>
  );
} 