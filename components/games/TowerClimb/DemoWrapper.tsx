"use client";

import { useState, useEffect, useMemo } from 'react';
import TowerLevels from './HelheimLevels';
import GameRules from './GameRules';
import HermodsDescent from './HermodsDescent';

// ===== Game Constants =====
const GAME_STATES = [
  'Uninitialized', 'Initialization', 'ReadyForRound', 
  'Submission', 'Processing', 'Ended'
] as const;

// Player capacity settings
const MAX_PLAYERS_PER_LEVEL = 166;     // Regular level capacity
const START_LEVEL_CAPACITY = 1000;     // Starting level capacity
const FINISH_LEVEL_CAPACITY = 500;     // Finish level capacity
const MAX_LEVEL = 21;                  // Maximum level number

/**
 * DemoWrapper - Demo/testing component for the Tower Climb game
 * Simulates game mechanics for demonstration purposes
 */
export default function DemoWrapper() {
  // ===== Component State =====
  const [demoPlayers, setDemoPlayers] = useState<Array<{address: string; level: number}>>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedMove, setSelectedMove] = useState<number | null>(null);
  const [gameState, setGameState] = useState<typeof GAME_STATES[number]>('Submission');
  const [isLoading, setIsLoading] = useState(true);
  const [gameLoaded, setGameLoaded] = useState(false);

  /**
   * Initialize the game with 1000 players at level 0
   */
  useEffect(() => {
    const players = Array.from({ length: 1000 }, () => ({
      address: `0x${Math.random().toString(16).slice(2, 42)}`, // Random ETH address
      level: 0,
    }));
    setDemoPlayers(players);
    setIsLoading(false);
    setGameLoaded(true);
  }, []);

  /**
   * Calculate player counts at each level (memoized for performance)
   */
  const levelCounts = useMemo(() => {
    return demoPlayers.reduce((counts, player) => {
      counts[player.level] = (counts[player.level] || 0) + 1;
      return counts;
    }, Array(MAX_LEVEL + 1).fill(0));
  }, [demoPlayers]);

  /**
   * Process a game round:
   * 1. Eliminate players on overcrowded levels
   * 2. Move remaining players 0-5 levels up
   * 3. Eliminate players from newly overcrowded levels
   */
  const processRound = () => {
    setGameState('Processing');

    // Calculate current player distribution
    const currentLevelCounts = demoPlayers.reduce((counts, player) => {
      counts[player.level] = (counts[player.level] || 0) + 1;
      return counts;
    }, Array(MAX_LEVEL + 1).fill(0));

    // Helper function to check if a level is overcrowded
    const isOvercrowded = (level: number, count: number) => {
      if (level === 0) return count > START_LEVEL_CAPACITY;      // Start level
      if (level === MAX_LEVEL) return count > FINISH_LEVEL_CAPACITY;  // Finish level
      return count > MAX_PLAYERS_PER_LEVEL;                      // Regular levels
    };

    // Phase 1: Eliminate players on overcrowded levels
    const survivingPlayers = demoPlayers.filter(player => 
      !isOvercrowded(player.level, currentLevelCounts[player.level])
    );

    // Phase 2: Move surviving players randomly 0-5 levels up
    const movedPlayers = survivingPlayers.map(player => ({
      ...player,
      level: Math.min(MAX_LEVEL, player.level + Math.floor(Math.random() * 6))
    }));

    // Calculate new player distribution after movement
    const newLevelCounts = movedPlayers.reduce((counts, player) => {
      counts[player.level] = (counts[player.level] || 0) + 1;
      return counts;
    }, Array(MAX_LEVEL + 1).fill(0));

    // Phase 3: Eliminate players on newly overcrowded levels
    const finalPlayers = movedPlayers.filter(player => 
      !isOvercrowded(player.level, newLevelCounts[player.level])
    );

    // Update game state
    setDemoPlayers(finalPlayers);
    
    // Return to submission state after processing delay
    setTimeout(() => setGameState('Submission'), 1000);
  };

  /**
   * Handle player move selection
   */
  const handleMoveSelect = (move: number) => {
    setSelectedMove(move);
  };

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="w-full bg-dark-700 p-4 rounded-lg border border-dark-400">
          <div className="text-neon-300 animate-pulse">Loading demo data...</div>
        </div>
      </div>
    );
  }

  // ===== Main Component Render =====
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-50">
          <GameRules />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {/* Tower visualization */}
        <TowerLevels 
          levelCounts={levelCounts}
          currentLevel={currentLevel}
          gameState={gameState}
          onMoveSelect={handleMoveSelect}
          maxLevel={MAX_LEVEL}
          unlimitedLevels={[0, MAX_LEVEL]}
        />
        
        {/* Demo Controls Panel */}
        <div className="bg-dark-700 p-4 rounded-lg border border-dark-400 space-y-4">
          <h3 className="text-neon-300 font-semibold mb-4">Demo Controls</h3>
          <div className="flex gap-4 flex-wrap">
            {/* Game State Selector */}
            <div>
              <label className="text-gray-300 block mb-2">Game State</label>
              <select 
                value={gameState}
                onChange={(e) => setGameState(e.target.value as typeof GAME_STATES[number])}
                className="bg-dark-600 text-gray-100 rounded p-2 border border-dark-400"
              >
                {GAME_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Player Level Selector */}
            <div>
              <label className="text-gray-300 block mb-2">Your Level</label>
              <input 
                type="number"
                min="0"
                max={MAX_LEVEL}
                value={currentLevel}
                onChange={(e) => setCurrentLevel(Number(e.target.value))}
                className="bg-dark-600 text-gray-100 rounded p-2 border border-dark-400 w-24"
              />
            </div>

            {/* Active Player Count */}
            <div>
              <label className="text-gray-300 block mb-2">Active Players</label>
              <div className="text-neon-400 font-mono p-2">
                {demoPlayers.length}
              </div>
            </div>
          </div>

          {/* End Round Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={processRound}
              className="bg-blood-600 text-white px-6 py-2 rounded-lg
                        hover:bg-blood-500 transition-colors duration-200
                        text-base uppercase tracking-wider"
              disabled={gameState !== 'Submission'}
            >
              End Round
            </button>
          </div>
        </div>
      </div>
      <div className="tower-climb-container">
        {gameLoaded ? (
          <HermodsDescent />
        ) : (
          <div className="loading-container">
            <div className="animate-spin h-10 w-10 border-4 border-neon-300 rounded-full border-t-transparent"></div>
            <p className="mt-4 text-neon-300">Loading game...</p>
          </div>
        )}
      </div>
    </div>
  );
} 