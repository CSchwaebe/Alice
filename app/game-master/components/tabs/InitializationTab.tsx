"use client";

import PlayerStatusBar from '../shared/PlayerStatusBar';
import { ChangeEvent } from 'react';

interface InitializationTabProps {
  // Game state
  games: string[] | undefined;
  gameName: string;
  setGameName: (name: string) => void;
  
  // Player counts
  activePlayers: number;
  eliminatedPlayers: number;
  
  // Handlers
  handleGameSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleInitializeGame: () => Promise<void>;
  
  // Loading states
  isPending: boolean;
  txLoading: boolean;
  activeFunction: string | null;
}

export default function InitializationTab({
  games,
  gameName,
  setGameName,
  activePlayers,
  eliminatedPlayers,
  handleGameSelect,
  handleInitializeGame,
  isPending,
  txLoading,
  activeFunction
}: InitializationTabProps) {
  return (
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
  );
} 