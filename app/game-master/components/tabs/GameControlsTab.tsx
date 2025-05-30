"use client";

import GameInstancesDisplay from '../shared/GameInstancesDisplay';
import { ChangeEvent } from 'react';

// Add this type definition
type GameInstanceInfo = {
  gameId: bigint;
  state: number;
  currentRound: bigint;
  activePlayerCount: bigint;
};

interface GameControlsTabProps {
  // Game data
  gamesData: [string[], GameInstanceInfo[][]] | undefined;
  games: string[] | undefined;
  gameName: string;
  setGameName: (name: string) => void;
  
  // Handlers
  handleGameSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleStartGames: () => Promise<void>;
  handleEndExpiredGames: () => Promise<void>;
  
  // Loading states
  isPending: boolean;
  txLoading: boolean;
  activeFunction: string | null;
}

export default function GameControlsTab({
  gamesData,
  games,
  gameName,
  setGameName,
  handleGameSelect,
  handleStartGames,
  handleEndExpiredGames,
  isPending,
  txLoading,
  activeFunction
}: GameControlsTabProps) {
  return (
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
  );
} 