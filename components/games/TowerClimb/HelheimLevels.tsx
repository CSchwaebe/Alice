"use client";

import { Card, CardBody, CardHeader } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import LevelPopup from './LevelPopup';

/**
 * Props for the HelheimLevels component
 */
interface HelheimLevelsProps {
  levelCounts: number[];        // Array of player counts at each level
  currentLevel?: number;        // The player's current level (optional)
  gameState: string;            // Current state of the game
  onMoveSelect: (move: number) => void;  // Callback when player selects a move
  maxLevel: number;             // Maximum level in the game (typically 21)
}

// Game configuration constants
const MAX_CAPACITY = 100;        // Regular level player capacity
const START_CAPACITY = 1000;     // Starting level (0) player capacity
const FINISH_CAPACITY = 500;     // Finish level (21) player capacity
const CIRCLES_PER_ROW = 5;       // Number of level circles per row
const SPECIAL_LEVEL_SIZE = "w-24 h-24 md:w-32 md:h-32";  // Size for start/finish level circles
const NORMAL_LEVEL_SIZE = "w-16 h-16 md:w-20 md:h-20";   // Size for regular level circles

/**
 * HelheimLevels - Main component for displaying the tower with all levels
 * Visualizes player distribution and allows navigation between levels
 */
export default function HelheimLevels({ 
  levelCounts, 
  currentLevel, 
  gameState, 
  onMoveSelect,
  maxLevel,
}: HelheimLevelsProps) {
  // Component state
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  /**
   * Auto-scroll to current level when it changes
   */
  useEffect(() => {
    if (currentLevel !== undefined && containerRef.current) {
      const levelElement = document.getElementById(`level-${currentLevel}`);
      if (levelElement) {
        levelElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentLevel]);

  /**
   * Close level popup when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedLevel !== null && !(event.target as Element).closest('#level-popup')) {
        setSelectedLevel(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedLevel]);

  // ===== Helper Functions =====

  /**
   * Calculate total potential players that could move to a level
   * (Players from up to 5 levels below can move to this level)
   */
  const calculatePotentialPlayers = (targetLevel: number) => {
    let sum = 0;
    for (let i = Math.max(0, targetLevel - 5); i <= targetLevel; i++) {
      if (i <= maxLevel) sum += levelCounts[i] || 0;
    }
    return sum;
  };

  /**
   * Check if a level is reachable from current position
   * (Player can move 1-5 levels up)
   */
  const isReachableLevel = (level: number) => {
    if (currentLevel === undefined) return false;
    const distance = level - currentLevel;
    return distance > 0 && distance <= 5;
  };

  /**
   * Handle click on a level circle - open details popup
   */
  const handleLevelClick = (level: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedLevel(prev => prev === level ? null : level);
  };

  /**
   * Handle player move selection
   */
  const handleMoveSelection = (targetLevel: number) => {
    if (currentLevel === undefined) return;
    onMoveSelect(targetLevel - currentLevel);
    setSelectedLevel(null);
  };

  /**
   * Render a single level circle with all its styling and content
   */
  const renderLevel = (level: number) => {
    const count = levelCounts[level] || 0;
    const isCurrentLevel = currentLevel === level;
    const isSpecialLevel = level === 0 || level === maxLevel;
    
    // Calculate fill percentage based on level type and capacity
    const capacityPercentage = level === 0 
      ? Math.min((count / START_CAPACITY) * 50, 100)
      : level === maxLevel
        ? Math.min((count / FINISH_CAPACITY) * 50, 100)
        : Math.min((count / MAX_CAPACITY) * 100, 100);

    // Determine style classes based on level state
    const canReach = isReachableLevel(level) && !isCurrentLevel;
    const bgColor = isCurrentLevel 
      ? 'bg-emerald-900' 
      : count > 0 ? 'bg-dark-600' : 'bg-dark-800';
    const shadow = isCurrentLevel 
      ? 'shadow-emerald' 
      : canReach ? 'shadow-emerald' : count > 0 ? 'shadow-neon' : '';
    const fillColor = isCurrentLevel ? 'bg-emerald-600/50' : 'bg-neon-600/50';
    const textColor = isCurrentLevel ? 'text-emerald-300' : 'text-neon-300';
    const levelLabel = level === 0 ? 'Start' : level === maxLevel ? 'Finish' : level;

    return (
      <div 
        id={`level-${level}`}
        key={level}
        className={`relative transition-all duration-300 cursor-pointer ${isCurrentLevel ? 'scale-110 z-10' : 'z-0'}`}
        onClick={(e) => handleLevelClick(level, e)}
      >
        <div 
          className={`
            relative rounded-full flex flex-col items-center justify-center
            ${isSpecialLevel ? SPECIAL_LEVEL_SIZE : NORMAL_LEVEL_SIZE}
            ${bgColor} ${shadow} overflow-hidden
          `}
        >
          {/* Fill indicator showing capacity percentage */}
          <div 
            className={`absolute bottom-0 left-0 right-0 ${fillColor} transition-all duration-500`}
            style={{ height: `${capacityPercentage}%` }}
          />

          {/* Level number or label */}
          <span className={`
            relative text-lg md:text-xl font-bold mb-1 
            ${textColor}
            tracking-wider
          `}>
            {levelLabel}
          </span>
        </div>
      </div>
    );
  };

  // ===== Main Component Render =====
  return (
    <Card className="w-screen relative left-1/2 -translate-x-1/2 z-10">
      <CardHeader className="flex justify-center items-center">
        <h2 className="text-xl md:text-2xl text-neon-300 py-2">Hermods Descent</h2>
      </CardHeader>
      <CardBody>
        <div className="relative">
          {/* Scrollable tower visualization */}
          <div ref={containerRef} className="py-4 w-full">
            <div className="flex flex-col gap-8 md:gap-12">
              {/* Start Level (Level 0) */}
              <div className="flex justify-center">
                {renderLevel(0)}
              </div>

              {/* Regular Levels (1-20) */}
              {Array.from({ length: Math.ceil((maxLevel - 1) / CIRCLES_PER_ROW) }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-3 md:gap-4">
                  {Array.from({ length: CIRCLES_PER_ROW }).map((_, colIndex) => {
                    const level = 1 + (rowIndex * CIRCLES_PER_ROW + colIndex);
                    return level < maxLevel ? renderLevel(level) : null;
                  })}
                </div>
              ))}

              {/* Finish Level (Level 21) */}
              <div className="flex justify-center">
                {renderLevel(maxLevel)}
              </div>
            </div>
          </div>
          
          {/* Level details popup */}
          {selectedLevel !== null && (
            <LevelPopup
              level={selectedLevel}
              currentPlayers={levelCounts[selectedLevel] || 0}
              potentialPlayers={calculatePotentialPlayers(selectedLevel)}
              onClose={() => setSelectedLevel(null)}
              isReachable={isReachableLevel(selectedLevel)}
              isCurrentLevel={selectedLevel === currentLevel}
              onMove={handleMoveSelection}
            />
          )}
          
          {/* Game info footer */}
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-dark-800 rounded-lg text-sm md:text-base">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
              <div className="space-y-1">
                <p className="text-gray-300 tracking-wide">Game State: <span className="text-neon-300">{gameState}</span></p>
                <p className="text-gray-300 tracking-wide">Your Level: <span className="text-blood-400">{currentLevel?.toString() || 'N/A'}</span></p>
              </div>
              {currentLevel !== undefined && (
                <div className="bg-blood-600 text-white px-2 md:px-3 py-1 rounded-full text-sm md:text-base w-fit">
                  {currentLevel === maxLevel ? 'Finish!' : currentLevel === 0 ? 'Start' : `Level ${currentLevel}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}