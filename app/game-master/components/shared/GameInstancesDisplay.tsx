"use client";

import { useState } from 'react';

// Add this type definition
type GameInstanceInfo = {
  gameId: bigint;
  state: number;
  currentRound: bigint;
  activePlayerCount: bigint;
};

// Add this interface
interface GameState {
  id: number;
  label: string;
}

interface GameInstancesDisplayProps {
  gameTypes: string[];
  gameInstances: GameInstanceInfo[][];
}

export default function GameInstancesDisplay({ gameTypes, gameInstances }: GameInstancesDisplayProps) {
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