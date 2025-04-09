"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import OwnerGuard from '@/components/auth/OwnerGuard';
import { parseEther } from 'viem';
import { useContractEventSubscription, ContractEventType, ContractEvent } from '@/lib/contract-events';

// Add this type definition at the top of the file
type GameInstanceInfo = {
  gameId: bigint;
  state: number;
  currentRound: bigint;
  activePlayerCount: bigint;
};

// Add this interface before GameInstancesDisplay
interface GameState {
  id: number;
  label: string;
}

// Component for the registration progress bar
function RegistrationProgressBar({ registeredPlayers }: { registeredPlayers: number }) {
  const maxPlayers = 1000;
  const percentage = Math.min((registeredPlayers / maxPlayers) * 100, 100);
  
  return (
    <div className="font-mono text-xs mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-white/70">Registration Progress</span>
        <span className="text-neon-300">{registeredPlayers} / {maxPlayers} Players</span>
      </div>
      <div className="w-full bg-black/70 border border-white/30 h-4 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-neon-300"
          style={{ width: `${percentage}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-[10px] font-bold text-white drop-shadow-lg">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// Component for the player status bar
function PlayerStatusBar({ activePlayers, eliminatedPlayers }: { activePlayers: number; eliminatedPlayers: number }) {
  const totalPlayers = activePlayers + eliminatedPlayers;
  const activePercentage = (activePlayers / totalPlayers) * 100;
  const eliminatedPercentage = (eliminatedPlayers / totalPlayers) * 100;
  
  return (
    <div className="font-mono text-xs mb-6">
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-white/70">Active: {activePlayers}</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
            <span className="text-white/70">Eliminated: {eliminatedPlayers}</span>
          </div>
        </div>
        <span className="text-white/70">Total: {activePlayers + eliminatedPlayers}</span>
      </div>
      <div className="w-full h-4 bg-black/70 border border-white/30 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-green-500/50"
          style={{ width: `${activePercentage}%` }}
        ></div>
        <div 
          className="absolute top-0 right-0 h-full bg-red-500/50"
          style={{ width: `${eliminatedPercentage}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-[10px] font-bold text-white drop-shadow-lg">
            {activePercentage.toFixed(1)}% Active
          </span>
        </div>
      </div>
    </div>
  );
}

// Add this component before GameMasterDashboard
function GameInstancesDisplay({ gameTypes, gameInstances }: { 
  gameTypes: string[]; 
  gameInstances: GameInstanceInfo[][] 
}) {
  const [selectedStates, setSelectedStates] = useState<number[]>([]);
  const [gameTypeFilter, setGameTypeFilter] = useState<string>('all');
  const [minActivePlayers, setMinActivePlayers] = useState<string>('');
  const [maxActivePlayers, setMaxActivePlayers] = useState<string>('');

  // Define available game states
  const gameStates: GameState[] = [
    { id: 0, label: 'Not Initialized' },
    { id: 1, label: 'Pregame' },
    { id: 2, label: 'Active' },
    { id: 3, label: 'Waiting' },
    { id: 4, label: 'Completed' }
  ];

  // Handle state checkbox changes
  const handleStateToggle = (stateId: number) => {
    setSelectedStates(prev => 
      prev.includes(stateId)
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
  };

  // Map game state number to string
  const getGameState = (state: number) => {
    const gameState = gameStates.find(s => s.id === state);
    return gameState ? gameState.label : 'Unknown';
  };

  // Filter instances based on current filters
  const getFilteredInstances = (instances: GameInstanceInfo[], gameType: string) => {
    return instances.filter(instance => {
      const stateMatch = selectedStates.length === 0 || selectedStates.includes(instance.state);
      const gameTypeMatch = gameTypeFilter === 'all' || gameType === gameTypeFilter;
      const activePlayersMatch = (
        (!minActivePlayers || Number(instance.activePlayerCount) >= Number(minActivePlayers)) &&
        (!maxActivePlayers || Number(instance.activePlayerCount) <= Number(maxActivePlayers))
      );
      return stateMatch && gameTypeMatch && activePlayersMatch;
    });
  };

  // Get total instances count after filtering
  const getTotalFilteredInstances = () => {
    return gameTypes.reduce((total, _, index) => {
      return total + getFilteredInstances(gameInstances[index], gameTypes[index]).length;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="font-mono text-xs bg-black border border-white/20 p-4">
        <div className="text-white/70 mb-4 uppercase tracking-wider">Filter Games</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Game Type Filter */}
          <div className="lg:col-span-3">
            <label className="block text-white/60 mb-2">Game Type</label>
            <select
              value={gameTypeFilter}
              onChange={(e) => setGameTypeFilter(e.target.value)}
              className="w-full bg-black border border-white/30 px-3 py-2 text-white"
            >
              <option value="all">All Games</option>
              {gameTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* State Filter Checkboxes */}
          <div className="lg:col-span-5">
            <label className="block text-white/60 mb-2">Game States</label>
            <div className="flex flex-wrap gap-3">
              {gameStates.map((state) => (
                <label key={state.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStates.includes(state.id)}
                    onChange={() => handleStateToggle(state.id)}
                    className="form-checkbox bg-black border-white/30 text-white rounded-sm"
                  />
                  <span className="text-white/80">{state.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active Players Range */}
          <div className="lg:col-span-2">
            <label className="block text-white/60 mb-2">Min Active Players</label>
            <input
              type="number"
              value={minActivePlayers}
              onChange={(e) => setMinActivePlayers(e.target.value)}
              placeholder="Min players..."
              className="w-full bg-black border border-white/30 px-3 py-2 text-white"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-white/60 mb-2">Max Active Players</label>
            <input
              type="number"
              value={maxActivePlayers}
              onChange={(e) => setMaxActivePlayers(e.target.value)}
              placeholder="Max players..."
              className="w-full bg-black border border-white/30 px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-white/60">
            Showing {getTotalFilteredInstances()} instance(s)
          </span>
          <button
            onClick={() => {
              setSelectedStates([]);
              setGameTypeFilter('all');
              setMinActivePlayers('');
              setMaxActivePlayers('');
            }}
            className="text-white/60 hover:text-white border border-white/30 px-3 py-1
                     hover:border-white/60 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Game Instances */}
      {gameTypes.map((gameType, index) => {
        const filteredInstances = getFilteredInstances(gameInstances[index], gameType);
        
        // Skip rendering if no instances match filters or game type doesn't match filter
        if ((gameTypeFilter !== 'all' && gameType !== gameTypeFilter) || filteredInstances.length === 0) {
          return null;
        }

        return (
          <div key={gameType} className="font-mono text-xs bg-black border border-white/20 p-4">
            <div className="text-white/70 mb-4 uppercase tracking-wider flex items-center justify-between">
              <span>{gameType}</span>
              <span className="text-white/40">{filteredInstances.length} Instance(s)</span>
            </div>
            
            <div className="space-y-3">
              {filteredInstances.map((instance) => (
                <div key={instance.gameId.toString()} 
                     className="border border-white/10 p-3 bg-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-white/60">Game ID</div>
                    <div className="text-right text-white">{instance.gameId.toString()}</div>
                    
                    <div className="text-white/60">State</div>
                    <div className="text-right text-white">{getGameState(instance.state)}</div>
                    
                  
                    
                    <div className="text-white/60">Active Players</div>
                    <div className="text-right text-white">{instance.activePlayerCount.toString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function GameMasterPage() {
  return (
    <OwnerGuard>
      <GameMasterDashboard />
    </OwnerGuard>
  );
}

function GameMasterDashboard(): ReactElement {
  const { address } = useAccount();
  
  // State for tabs
  const [activeTab, setActiveTab] = useState('registration');
  
  // State for form inputs
  const [gameName, setGameName] = useState('');
  const [gameAddress, setGameAddress] = useState('');
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [newRegistrationFee, setNewRegistrationFee] = useState('');
  
  // State for player counts
  const [registeredPlayers, setRegisteredPlayers] = useState<number>(0);
  const [activePlayers, setActivePlayers] = useState<number>(0);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<number>(0);
  
  // Get active players count from contract
  const { data: activePlayerCount } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getActivePlayerCount',
    args: [],
  }) as { data: bigint | undefined };

  // Get eliminated players count from contract
  const { data: eliminatedPlayerCount } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getEliminatedPlayerCount',
    args: [],
  }) as { data: bigint | undefined };

  // Update counts when they change
  useEffect(() => {
    if (activePlayerCount !== undefined && eliminatedPlayerCount !== undefined) {
      const activeCount = Number(activePlayerCount);
      const eliminatedCount = Number(eliminatedPlayerCount);
      setActivePlayers(activeCount);
      setEliminatedPlayers(eliminatedCount);
      setRegisteredPlayers(activeCount + eliminatedCount);
    }
  }, [activePlayerCount, eliminatedPlayerCount]);
  
  // Get registration status
  const { data: isRegistrationClosed } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'registrationClosed',
    args: [],
  });
  
  // Get registered games
  const { data: games, refetch: refetchGames } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getRegisteredGames',
    args: [],
  }) as { data: string[] | undefined, refetch: () => void };
  
  // Get player count from contract
  const { data: playerCount, refetch: refetchPlayerCount } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getPlayerCount',
    args: [],
  }) as { data: bigint | undefined, refetch: () => void };
  
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
      refetchPlayerCount();
      
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
  }, [txSuccess, refetchGames, refetchPlayerCount, reset]);

  // Subscribe to relevant events for the Game Master page
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'GameMaster', event: 'RegistrationFeeChanged' },
    { contract: 'GameMaster', event: 'PlayerRegistered' },
    { contract: 'GameMaster', event: 'RegistrationClosed' },
    { contract: 'GameMaster', event: 'GameRegistered' },
    { contract: 'GameMaster', event: 'GameStarted' },
    { contract: 'GameMaster', event: 'PlayersRegistered' }
  ];
  
  // Handle contract events
  const handleContractEvent = (event: ContractEvent) => {
    console.log(`Game Master handling event: ${event.type.contract}.${event.type.event}`, event);
    
    // Take action based on event type
    switch (event.type.event) {
      case 'RegistrationFeeChanged':
        // Update fee info
        refetchGames();
        setNotification({ 
          type: 'success', 
          message: 'Registration fee has been updated' 
        });
        break;
        
      case 'PlayerRegistered':
        // Update player count
        refetchPlayerCount();
        setRegisteredPlayers(prev => prev + 1); // Optimistic update
        setNotification({ 
          type: 'success', 
          message: 'A new player has registered' 
        });
        break;
        
      case 'GameRegistered':
        // Update games list
        refetchGames();
        setNotification({ 
          type: 'success', 
          message: 'Game has been registered' 
        });
        break;
        
      case 'GameStarted':
        // Update games in progress
        refetchGames();
        setNotification({ 
          type: 'success', 
          message: 'Game has started' 
        });
        break;
        
      // Add more event handlers as needed
    }
  };
  
  // Subscribe to relevant events
  useContractEventSubscription(
    eventsToSubscribe,
    handleContractEvent,
    [refetchGames, refetchPlayerCount] // Dependencies
  );
  
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
  const handleInitializeGame = async () => {
    if (!gameName) return;
    
    try {
      setActiveFunction('initializeGame');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'initializeGame',
        args: [gameName],
      });
    } catch (error) {
      console.error('Error initializing game:', error);
      setNotification({ type: 'error', message: 'Failed to initialize game' });
      setActiveFunction(null);
    }
  };
  
  
  // Function to start a game
  const handleStartGames = async () => {
    if (!gameName) return;
    
    try {
      setActiveFunction('startGames');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'startGames',
        args: [gameName],
      });
    } catch (error) {
      console.error('Error starting game:', error);
      setNotification({ type: 'error', message: 'Failed to start game' });
      setActiveFunction(null);
    }
  };
  
  // Function to end expired round
  const handleEndExpiredGames = async () => {
    if (!gameName) return;
    
    try {
      setActiveFunction('endExpiredGames');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'endExpiredGames',
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
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
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
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
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
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
        abi: GameMasterABI,
        functionName: 'withdraw',
        args: [],
      });
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      setNotification({ type: 'error', message: 'Failed to withdraw funds' });
      setActiveFunction(null);
    }
  };

  // Handle game selection from dropdown
  const handleGameSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameName(e.target.value);
  };
  
  // Add this new contract read
  const { data: gamesData } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getGames',
    args: [],
  }) as { data: [string[], GameInstanceInfo[][]] | undefined };
  
  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      {/* Content */}
      <div className="w-full max-w-5xl mx-auto p-4 my-8">
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
        <div className="font-mono text-xs bg-black border border-white/20 border-l-red-500
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
        
        {/* Tab Navigation */}
        <div className="font-mono text-sm border-b border-white/20 flex mb-6">
          <button 
            onClick={() => setActiveTab('registration')}
            className={`px-4 py-2 ${activeTab === 'registration' ? 'bg-white/10 border-t border-r border-l border-white/20 text-white' : 'text-white/60'}`}
          >
            Registration
          </button>
          <button 
            onClick={() => setActiveTab('initialization')}
            className={`px-4 py-2 ${activeTab === 'initialization' ? 'bg-white/10 border-t border-r border-l border-white/20 text-white' : 'text-white/60'}`}
          >
            Initialization
          </button>
          <button 
            onClick={() => setActiveTab('gamecontrols')}
            className={`px-4 py-2 ${activeTab === 'gamecontrols' ? 'bg-white/10 border-t border-r border-l border-white/20 text-white' : 'text-white/60'}`}
          >
            Game Controls
          </button>
        </div>

        {/* Registration Tab */}
        {activeTab === 'registration' && (
          <>
            {/* Registration Status */}
            <div className="font-mono text-xs mb-6 flex items-center justify-between bg-black border border-white/20 p-4">
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${isRegistrationClosed ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className="text-white/70 uppercase tracking-wider">Registration Status:</span>
              </div>
              <span className={`${isRegistrationClosed ? 'text-red-400' : 'text-green-400'}`}>
                {isRegistrationClosed ? 'CLOSED' : 'OPEN'}
              </span>
            </div>
            
            {/* Player Registration Progress Bar */}
            <RegistrationProgressBar registeredPlayers={registeredPlayers} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Register Game */}
              <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
                <div className="text-white/70 mb-3 uppercase tracking-wider">Register Game</div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 mb-1">Game Name</label>
                    <input 
                      type="text" 
                      value={gameName} 
                      onChange={(e) => setGameName(e.target.value)}
                      className="w-full bg-black border border-white/30 px-3 py-2 text-white"
                      placeholder="e.g. RAGNAROK"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/60 mb-1">Game Address</label>
                    <input 
                      type="text" 
                      value={gameAddress} 
                      onChange={(e) => setGameAddress(e.target.value)}
                      className="w-full bg-black border border-white/30 px-3 py-2 text-white"
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

              {/* Ragnarok Controls */}
              <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
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
                        className="flex-1 bg-black border border-white/30 px-3 py-2 text-white"
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

                {/* Instructions Panel */}
                <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90 mt-6">
                  <div className="text-white/70 mb-3 uppercase tracking-wider">Registration Instructions</div>
                  <ol className="list-decimal list-inside space-y-2 text-white/80">
                    <li>Make sure all games are registered, should happen on contract deployment</li>
                    <li>Manually close registration</li>
                    <li>Register players with the game master contract</li>
                    <li>Make sure to withdraw funds</li>
                    <li>Make sure to clear firebase chats</li>
                  </ol>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Initialization Tab */}
        {activeTab === 'initialization' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Player Status Bar */}
            <PlayerStatusBar 
              activePlayers={activePlayers}
              eliminatedPlayers={eliminatedPlayers}
            />
            
            {/* Games List */}
            <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
              <div className="text-white/50 mb-3 uppercase tracking-wider">Registered Games</div>
              
              {games && games.length > 0 ? (
                <div className="mb-4">
                  <label className="block text-white/60 mb-2">Select Game</label>
                  <select 
                    value={gameName}
                    onChange={handleGameSelect}
                    className="w-full bg-black border border-white/30 px-3 py-2 text-white"
                  >
                    <option value="">Select a game...</option>
                    {games.map((game: string, index: number) => (
                      <option key={index} value={game}>{game}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-white/60 italic mb-4">No games registered yet</div>
              )}
            </div>
      
            {/* Initialize Game */}
            <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
              <div className="text-white/70 mb-3 uppercase tracking-wider">Initialize Game</div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 mb-1">Selected Game</label>
                  <div className="w-full bg-black border border-white/30 px-3 py-2 text-white">
                    {gameName || 'No game selected'}
                  </div>
                </div>
                
                <button 
                  onClick={handleInitializeGame}
                  disabled={!gameName || isPending || txLoading || activeFunction !== null}
                  className={`
                    w-full font-mono text-white bg-transparent 
                    border border-white/50 py-2 px-3 text-center
                    focus:outline-none hover:bg-white/10
                    ${!gameName ? 'opacity-50 cursor-not-allowed' : ''}
                    ${activeFunction === 'initializeGame' ? 'bg-white/20' : ''}
                    ${(isPending || txLoading) ? 'animate-pulse' : ''}
                  `}
                >
                  {activeFunction === 'initializeGame' ? 'Processing...' : 'Initialize Game'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Controls Tab */}
        {activeTab === 'gamecontrols' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Active Games Overview */}
            {gamesData && (
              <GameInstancesDisplay 
                gameTypes={gamesData[0]} 
                gameInstances={gamesData[1]} 
              />
            )}
            
            {/* Game Selection */}
            <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
              <div className="text-white/50 mb-3 uppercase tracking-wider">Select Game to Control</div>
              
              {games && games.length > 0 ? (
                <div className="mb-4">
                  <label className="block text-white/60 mb-2">Select Game</label>
                  <select 
                    value={gameName}
                    onChange={handleGameSelect}
                    className="w-full bg-black border border-white/30 px-3 py-2 text-white"
                  >
                    <option value="">Select a game...</option>
                    {games.map((game: string, index: number) => (
                      <option key={index} value={game}>{game}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-white/60 italic mb-4">No games registered yet</div>
              )}
            </div>
            
            {/* Game Controls */}
            <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
              <div className="text-white/70 mb-3 uppercase tracking-wider">Game Controls</div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 mb-1">Selected Game</label>
                  <div className="w-full bg-black border border-white/30 px-3 py-2 text-white">
                    {gameName || 'No game selected'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleStartGames}
                    disabled={!gameName || isPending || txLoading || activeFunction !== null}
                    className={`
                      font-mono text-white bg-transparent 
                      border border-white/50 py-2 px-3 text-center
                      focus:outline-none hover:bg-white/10
                      ${!gameName ? 'opacity-50 cursor-not-allowed' : ''}
                      ${activeFunction === 'startGames' ? 'bg-white/20' : ''}
                      ${(isPending || txLoading) ? 'animate-pulse' : ''}
                    `}
                  >
                    {activeFunction === 'startGames' ? 'Processing...' : 'Start Games'}
                  </button>
                  
                  <button 
                    onClick={handleEndExpiredGames}
                    disabled={!gameName || isPending || txLoading || activeFunction !== null}
                    className={`
                      font-mono text-white bg-transparent 
                      border border-white/50 py-2 px-3 text-center
                      focus:outline-none hover:bg-white/10
                      ${!gameName ? 'opacity-50 cursor-not-allowed' : ''}
                      ${activeFunction === 'endExpiredGames' ? 'bg-white/20' : ''}
                      ${(isPending || txLoading) ? 'animate-pulse' : ''}
                    `}
                  >
                    {activeFunction === 'endExpiredGames' ? 'Processing...' : 'End Expired Games'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 