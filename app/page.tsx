"use client";

// import { cookieStorage, createStorage, http } from '@wagmi/core'

import { ConnectButton } from "@/components/walletconnect/ConnectButton";
import { useEffect } from 'react';
import MatrixRain from "@/components/effects/GlitchTextBackground";
import { useAccount, useReadContract } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  
  const { data: playerInfo, isError, isLoading } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint] | undefined, isError: boolean, isLoading: boolean };

  // Add console logging
  useEffect(() => {
    console.log('Home Page - Player Info:', {
      data: playerInfo,
      isError,
      isLoading,
      address,
      isConnected
    });
  }, [playerInfo, isError, isLoading, address, isConnected]);

  // Redirect to registration if connected but not registered
  useEffect(() => {
    if (isConnected && playerInfo && playerInfo[0] === '') {
      console.log('Redirecting to registration - No player info found');
      router.push('/register');
    }
  }, [isConnected, playerInfo, router]);

  // Check for active game
  useEffect(() => {
    if (playerInfo?.[0] && playerInfo[0] !== '') {
      const gameRoute = playerInfo[0].toLowerCase();
      console.log('Redirecting to active game:', gameRoute);
      router.push(`/games/${gameRoute}`);
    }
  }, [playerInfo, router]);

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center relative">
      {/* Matrix Code Effect */}
      <MatrixRain />
      
      {/* Content */}
      <div className="z-10 flex flex-col items-center gap-4">
        <ConnectButton />
        
        {isConnected && playerInfo && playerInfo[0] !== '' && (
          <div className="text-white bg-black/50 p-4 rounded-lg">
            <div>
              <h2 className="text-xl mb-2">Player Info:</h2>
              <p>Game Name: {playerInfo[0]}</p>
              <p>Game ID: {playerInfo[1]?.toString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}