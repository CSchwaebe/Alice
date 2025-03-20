"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { RagnarokABI } from '@/app/abis/RagnarokABI';
import { useState, useEffect } from 'react';
import OwnerGuard from '@/components/auth/OwnerGuard';
import MatrixRain from "@/components/effects/GlitchTextBackground";
import { parseEther } from 'viem';

export default function GameMasterPage() {
  return (
    <OwnerGuard>
      <GameMasterDashboard />
    </OwnerGuard>
  );
}

function GameMasterDashboard() {
  const { address } = useAccount();
  
  // State for form inputs
  const [gameName, setGameName] = useState('');
  const [gameAddress, setGameAddress] = useState('');
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [newRegistrationFee, setNewRegistrationFee] = useState('');
  
  // Get registered games
  const { data: games, refetch: refetchGames } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getRegisteredGames',
    args: [],
  }) as { data: string[] | undefined, refetch: () => void };
  
  // Write contract function
  const { writeContract, data: txHash, isPending, reset } = useWriteContract();
  
  // Wait for transaction
  const { isLoading: txLoading, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  
  // Listen for transaction success and show notification
  useEffect(() => {
    if (txSuccess) {
      setNotification({ type: 'success', message: 'Transaction successful' });
      refetchGames();
      
      // Clear form inputs
      setGameName('');
      setGameAddress('');
      setActiveFunction(null);
      
      // Clear notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
        reset();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [txSuccess, refetchGames, reset]);
  
  // Function to register a new game
  const handleRegisterGame = async () => {
    if (!gameName || !gameAddress) return;
    
    try {
      setActiveFunction('registerGame');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'registerGame',
        args: [gameName, gameAddress as `0x${string}`],
      });
    } catch (error) {
      console.error('Error registering game:', error);
      setNotification({ type: 'error', message: 'Failed to register game' });
      setActiveFunction(null);
    }
  };
  
  // Function to start a game
  const handleStartGame = async () => {
    if (!gameName) return;
    
    try {
      setActiveFunction('startGame');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'startGame',
        args: [gameName],
      });
    } catch (error) {
      console.error('Error starting game:', error);
      setNotification({ type: 'error', message: 'Failed to start game' });
      setActiveFunction(null);
    }
  };
  
  // Function to register players
  const handleRegisterPlayers = async () => {
    try {
      setActiveFunction('registerPlayers');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'registerPlayers',
        args: [],
      });
    } catch (error) {
      console.error('Error registering players:', error);
      setNotification({ type: 'error', message: 'Failed to register players' });
      setActiveFunction(null);
    }
  };
  
  // Function to start a round
  const handleStartRound = async () => {
    if (!gameName) return;
    
    try {
      setActiveFunction('startRound');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'startRound',
        args: [gameName],
      });
    } catch (error) {
      console.error('Error starting round:', error);
      setNotification({ type: 'error', message: 'Failed to start round' });
      setActiveFunction(null);
    }
  };
  
  // Function to end expired round
  const handleEndExpiredRound = async () => {
    if (!gameName) return;
    
    try {
      setActiveFunction('endExpiredRound');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'endExpiredRound',
        args: [gameName],
      });
    } catch (error) {
      console.error('Error ending expired round:', error);
      setNotification({ type: 'error', message: 'Failed to end expired round' });
      setActiveFunction(null);
    }
  };

  const handleSetRegistrationFee = async () => {
    if (!newRegistrationFee) return;
    
    try {
      setActiveFunction('setRegistrationFee');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_RAGNAROK as `0x${string}`,
        abi: RagnarokABI,
        functionName: 'setRegistrationFee',
        args: [parseEther(newRegistrationFee)],
      });
    } catch (error) {
      console.error('Error setting registration fee:', error);
      setNotification({ type: 'error', message: 'Failed to set registration fee' });
      setActiveFunction(null);
    }
  };

  const handleCloseRegistration = async () => {
    try {
      setActiveFunction('closeRegistration');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_RAGNAROK as `0x${string}`,
        abi: RagnarokABI,
        functionName: 'closeRegistration',
        args: [],
      });
    } catch (error) {
      console.error('Error closing registration:', error);
      setNotification({ type: 'error', message: 'Failed to close registration' });
      setActiveFunction(null);
    }
  };

  const handleWithdraw = async () => {
    try {
      setActiveFunction('withdraw');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_RAGNAROK as `0x${string}`,
        abi: RagnarokABI,
        functionName: 'withdraw',
        args: [],
      });
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      setNotification({ type: 'error', message: 'Failed to withdraw funds' });
      setActiveFunction(null);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      <MatrixRain />
      
      {/* Cross-lines */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute top-0 left-[10%] w-px h-full bg-white/5"></div>
        <div className="absolute top-0 left-[30%] w-px h-full bg-white/10"></div>
        <div className="absolute top-0 left-[50%] w-px h-full bg-white/15"></div>
        <div className="absolute top-0 left-[70%] w-px h-full bg-white/10"></div>
        <div className="absolute top-0 left-[90%] w-px h-full bg-white/5"></div>
        
        <div className="absolute left-0 top-[10%] w-full h-px bg-white/5"></div>
        <div className="absolute left-0 top-[30%] w-full h-px bg-white/10"></div>
        <div className="absolute left-0 top-[50%] w-full h-px bg-white/15"></div>
        <div className="absolute left-0 top-[70%] w-full h-px bg-white/10"></div>
        <div className="absolute left-0 top-[90%] w-full h-px bg-white/5"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-8 px-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
            <div className="ml-2 h-px w-20 bg-white/40"></div>
          </div>
          
          <div className="font-mono text-lg text-white/90 tracking-widest text-center">
            |..::GAME MASTER CONTROL::..|
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 h-px w-20 bg-white/40"></div>
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
          </div>
        </div>
        
        {/* Notification */}
        {notification && (
          <div className={`mb-6 font-mono text-sm px-4 py-3 border ${
            notification.type === 'success' 
              ? 'border-green-500 bg-green-900/20 text-green-400' 
              : 'border-red-500 bg-red-900/20 text-red-400'
          }`}>
            {notification.message}
          </div>
        )}
        
        {/* Admin info panel */}
        <div className="font-mono text-xs bg-black/50 border border-white/20 border-l-red-500
                         pl-3 pr-2 py-3 text-white/90 mb-6">
          <div className="text-white/50 mb-1 uppercase tracking-wider">Admin Access</div>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <span className="text-white uppercase">AUTHORIZED</span>
          </div>
          <div className="mt-2 text-xs flex items-center">
            <span className="text-white/50">ADMIN ADDRESS: </span>
            <span className="ml-1 truncate text-[10px]">
              {address}
            </span>
          </div>
        </div>
        
        {/* Games List */}
        <div className="font-mono text-xs bg-black/50 border border-white/20
                         p-4 text-white/90 mb-6">
          <div className="text-white/50 mb-3 uppercase tracking-wider">Registered Games</div>
          
          {games && games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game: string, index: number) => (
                <div key={index} className="border border-white/20 p-3 bg-black/50">
                  <div className="text-neon-300 mb-1">{game}</div>
                  <button 
                    onClick={() => setGameName(game)} 
                    className="text-white/70 hover:text-white text-[10px] mt-1 underline"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/60 italic">No games registered yet</div>
          )}
        </div>
        
        {/* Game Master Functions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Register Game */}
          <div className="font-mono text-xs bg-black/50 border border-white/20
                         p-4 text-white/90">
            <div className="text-white/70 mb-3 uppercase tracking-wider">Register Game</div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 mb-1">Game Name</label>
                <input 
                  type="text" 
                  value={gameName} 
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full bg-black/70 border border-white/30 px-3 py-2 text-white"
                  placeholder="e.g. RAGNAROK"
                />
              </div>
              
              <div>
                <label className="block text-white/60 mb-1">Game Address</label>
                <input 
                  type="text" 
                  value={gameAddress} 
                  onChange={(e) => setGameAddress(e.target.value)}
                  className="w-full bg-black/70 border border-white/30 px-3 py-2 text-white"
                  placeholder="0x..."
                />
              </div>
              
              <button 
                onClick={handleRegisterGame}
                disabled={isPending || txLoading || activeFunction !== null}
                className={`
                  w-full font-mono text-white bg-transparent 
                  border border-white/50 py-2 px-3 text-center
                  focus:outline-none hover:bg-white/10
                  ${activeFunction === 'registerGame' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'registerGame' ? 'Processing...' : 'Register Game'}
              </button>
            </div>
          </div>
          
          {/* Start Game */}
          <div className="font-mono text-xs bg-black/50 border border-white/20
                         p-4 text-white/90">
            <div className="text-white/70 mb-3 uppercase tracking-wider">Start Game</div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 mb-1">Game Name</label>
                <input 
                  type="text" 
                  value={gameName} 
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full bg-black/70 border border-white/30 px-3 py-2 text-white"
                  placeholder="e.g. RAGNAROK"
                />
              </div>
              
              <button 
                onClick={handleStartGame}
                disabled={isPending || txLoading || activeFunction !== null}
                className={`
                  w-full font-mono text-white bg-transparent 
                  border border-white/50 py-2 px-3 text-center
                  focus:outline-none hover:bg-white/10
                  ${activeFunction === 'startGame' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'startGame' ? 'Processing...' : 'Start Game'}
              </button>
            </div>
          </div>
          
          {/* Register Players */}
          <div className="font-mono text-xs bg-black/50 border border-white/20
                         p-4 text-white/90">
            <div className="text-white/70 mb-3 uppercase tracking-wider">Register Players</div>
            
            <div className="space-y-4">
              <div className="text-white/60 mb-3">
                Register all players who have signed up through the Ragnarok contract.
              </div>
              
              <button 
                onClick={handleRegisterPlayers}
                disabled={isPending || txLoading || activeFunction !== null}
                className={`
                  w-full font-mono text-white bg-transparent 
                  border border-white/50 py-2 px-3 text-center
                  focus:outline-none hover:bg-white/10
                  ${activeFunction === 'registerPlayers' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'registerPlayers' ? 'Processing...' : 'Register All Players'}
              </button>
            </div>
          </div>
          
          {/* Round Controls */}
          <div className="font-mono text-xs bg-black/50 border border-white/20
                         p-4 text-white/90">
            <div className="text-white/70 mb-3 uppercase tracking-wider">Round Controls</div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 mb-1">Game Name</label>
                <input 
                  type="text" 
                  value={gameName} 
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full bg-black/70 border border-white/30 px-3 py-2 text-white"
                  placeholder="e.g. RAGNAROK"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleStartRound}
                  disabled={isPending || txLoading || activeFunction !== null}
                  className={`
                    font-mono text-white bg-transparent 
                    border border-white/50 py-2 px-3 text-center
                    focus:outline-none hover:bg-white/10
                    ${activeFunction === 'startRound' ? 'bg-white/20' : ''}
                    ${(isPending || txLoading) ? 'animate-pulse' : ''}
                  `}
                >
                  {activeFunction === 'startRound' ? 'Processing...' : 'Start Round'}
                </button>
                
                <button 
                  onClick={handleEndExpiredRound}
                  disabled={isPending || txLoading || activeFunction !== null}
                  className={`
                    font-mono text-white bg-transparent 
                    border border-white/50 py-2 px-3 text-center
                    focus:outline-none hover:bg-white/10
                    ${activeFunction === 'endExpiredRound' ? 'bg-white/20' : ''}
                    ${(isPending || txLoading) ? 'animate-pulse' : ''}
                  `}
                >
                  {activeFunction === 'endExpiredRound' ? 'Processing...' : 'End Expired Round'}
                </button>
              </div>
            </div>
          </div>

          {/* Ragnarok Controls */}
          <div className="font-mono text-xs bg-black/50 border border-white/20
                         p-4 text-white/90">
            <div className="text-white/70 mb-3 uppercase tracking-wider">Ragnarok Controls</div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 mb-1">New Registration Fee (SONIC)</label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    step="0.000000000000000001"
                    value={newRegistrationFee}
                    onChange={(e) => setNewRegistrationFee(e.target.value)}
                    className="flex-1 bg-black/70 border border-white/30 px-3 py-2 text-white"
                    placeholder="0.1"
                  />
                  <button 
                    onClick={handleSetRegistrationFee}
                    disabled={isPending || txLoading || activeFunction !== null}
                    className={`
                      px-4 font-mono text-white bg-transparent 
                      border border-white/50 text-center
                      focus:outline-none hover:bg-white/10
                      ${activeFunction === 'setRegistrationFee' ? 'bg-white/20' : ''}
                      ${(isPending || txLoading) ? 'animate-pulse' : ''}
                    `}
                  >
                    {activeFunction === 'setRegistrationFee' ? '...' : 'Set'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleCloseRegistration}
                  disabled={isPending || txLoading || activeFunction !== null}
                  className={`
                    font-mono text-white bg-transparent 
                    border border-white/50 py-2 px-3 text-center
                    focus:outline-none hover:bg-white/10
                    ${activeFunction === 'closeRegistration' ? 'bg-white/20' : ''}
                    ${(isPending || txLoading) ? 'animate-pulse' : ''}
                  `}
                >
                  {activeFunction === 'closeRegistration' ? 'Processing...' : 'Close Registration'}
                </button>

                <button 
                  onClick={handleWithdraw}
                  disabled={isPending || txLoading || activeFunction !== null}
                  className={`
                    font-mono text-white bg-transparent 
                    border border-white/50 py-2 px-3 text-center
                    focus:outline-none hover:bg-white/10
                    ${activeFunction === 'withdraw' ? 'bg-white/20' : ''}
                    ${(isPending || txLoading) ? 'animate-pulse' : ''}
                  `}
                >
                  {activeFunction === 'withdraw' ? 'Processing...' : 'Withdraw Funds'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 