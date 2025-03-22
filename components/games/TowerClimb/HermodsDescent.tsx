"use client";

import { useState, useEffect } from 'react';
import TowerLevels from './HelheimLevels';

// ===== Configuration Constants =====
const MAX_LEVEL = 21;                                      // Maximum level in game
const GAME_STATES = [
  'Uninitialized', 'Initialization', 'ReadyForRound', 
  'Submission', 'Processing', 'Ended'
];

/**
 * HermodsDescent - Main component for Tower Climb game
 * Uses local state for gameplay and state management
 */
export default function HermodsDescent() {
  // ===== Component State =====
  const [selectedMove, setSelectedMove] = useState<number | null>(null);
  const [gameState, setGameState] = useState<string>('ReadyForRound');
  const [levelCounts, setLevelCounts] = useState<number[]>(new Array(MAX_LEVEL + 1).fill(0));
  const [currentLevel, setCurrentLevel] = useState<number>(5); // Mock current player level

  // Generate mock data for level counts
  useEffect(() => {
    // Create mock player distribution
    const generateMockLevelCounts = () => {
      const counts = new Array(MAX_LEVEL + 1).fill(0);
      
      // Simulate some random distribution of players across levels
      for (let i = 0; i < 50; i++) {
        const level = Math.floor(Math.random() * (MAX_LEVEL + 1));
        counts[level]++;
      }
      
      // Ensure current player level is counted
      counts[currentLevel]++;
      
      return counts;
    };
    
    setLevelCounts(generateMockLevelCounts());
  }, [currentLevel]);

  // Simulate game state changes
  useEffect(() => {
    // Cycle through game states every 30 seconds for demo purposes
    const interval = setInterval(() => {
      const currentIndex = GAME_STATES.indexOf(gameState);
      const nextIndex = (currentIndex + 1) % GAME_STATES.length;
      setGameState(GAME_STATES[nextIndex]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [gameState]);

  // Log when move is selected
  useEffect(() => {
    if (selectedMove !== null) {
      console.log('Selected move:', selectedMove);
    }
  }, [selectedMove]);

  // ===== Main Component Render =====
  return (
    <div>
      <TowerLevels 
        levelCounts={levelCounts} 
        currentLevel={currentLevel} 
        gameState={gameState}
        onMoveSelect={setSelectedMove}
        maxLevel={MAX_LEVEL}
      />
    </div>
  );
} 