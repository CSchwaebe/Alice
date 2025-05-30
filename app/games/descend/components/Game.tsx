"use client";

import { FormattedPlayerInfo } from '@/app/games/descend/hooks/useDescendGameData';
import { useEffect } from 'react';

interface GameProps {
  currentLevel: number;
  allPlayers: FormattedPlayerInfo[];
  onLevelSelect: (move: number) => void;
  hasCommitted: boolean;
  hasRevealed: boolean;
  gameState: number;
  levelPopulations: Record<number, number>;
  levelCapacities: Record<number, number>;
}

export default function Game({ 
  currentLevel, 
  allPlayers, 
  onLevelSelect, 
  hasCommitted,
  hasRevealed,
  gameState,
  levelPopulations = {},
  levelCapacities = {}
}: GameProps) {
  // Create an array of all levels from 0 to 21
  const levels = Array.from({ length: 22 }, (_, i) => i);
  
  // Calculate fill percentage for a level
  const getLevelFillPercentage = (level: number): number => {
    const population = levelPopulations?.[level] || 0;
    const cap = levelCapacities?.[level] || 0;
    return cap > 0 ? Math.min((population / cap) * 100, 100) : 0;
  };

  // Group players by level
  const playersByLevel = allPlayers.reduce((acc, player) => {
    if (!acc[player.level]) {
      acc[player.level] = [];
    }
    acc[player.level].push(player);
    return acc;
  }, {} as Record<number, FormattedPlayerInfo[]>);

  // Calculate which levels are reachable (0-5 moves away)
  const getReachableLevels = (currentLevel: number) => {
    const reachable: number[] = [];
    for (let move = 0; move <= 5; move++) {
      const targetLevel = currentLevel + move;
      if (targetLevel <= 21) {
        reachable.push(targetLevel);
      }
    }
    return reachable;
  };

  const reachableLevels = getReachableLevels(currentLevel);

  // Calculate move required to reach a level
  const getMoveForLevel = (targetLevel: number) => {
    return targetLevel - currentLevel;
  };

  // Handle level click
  const handleLevelClick = (level: number) => {
    if (!onLevelSelect || gameState === 1) return;
    
    // Only allow clicking reachable levels
    if (!reachableLevels.includes(level)) return;
    
    const move = getMoveForLevel(level);
    onLevelSelect(move);
  };

  // Split levels into rows (level 0 and 21 get their own rows)
  const rows: number[][] = [[0]];
  const middleLevels = levels.slice(1, -1);
  while (middleLevels.length > 0) {
    rows.push(middleLevels.splice(0, 5));
  }
  rows.push([21]); // Add level 21 as its own row

  // Only log in development and when debug is enabled
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_LEVEL === 'true') {
      Object.entries(levelPopulations).forEach(([level, population]) => {
        const cap = levelCapacities[Number(level)] || 0;
        const percentage = Math.min((population / cap) * 100, 100);
        console.log(`Level ${level} - Population: ${population}, Cap: ${cap}, Fill: ${percentage}%`);
      });
    }
  }, [levelPopulations, levelCapacities]);

  return (
    <div className="relative w-full max-w-[1000px] mx-auto p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-overlay-light to-transparent opacity-20" />
      
      {/* Level Grid */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-4">
            {row.map((level) => {
              const isCurrentLevel = level === currentLevel;
              const isReachable = reachableLevels.includes(level);
              const players = playersByLevel[level] || [];
              const isClickable = isReachable || isCurrentLevel;
              const isStartLevel = level === 0;
              const isEndLevel = level === 21;
              const fillPercentage = getLevelFillPercentage(level);

              return (
                <div
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  className={`
                    group relative flex flex-col items-center justify-between p-4 min-h-[100px]
                    bg-overlay-light
                    ${isCurrentLevel || isReachable ? 'border-2 border-transparent' : 'border border-border'}
                    ${isClickable ? 'cursor-pointer' : ''}
                    ${(isStartLevel || isEndLevel) ? 'col-span-5' : ''}
                  `}
                  style={isCurrentLevel || isReachable ? {
                    backgroundImage: 'linear-gradient(var(--background), var(--background))',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    borderImage: 'linear-gradient(45deg, var(--foreground), color-mix(in srgb, var(--foreground) 60%, transparent)) 1'
                  } : undefined}
                >
                  {/* Population Fill */}
                  <div 
                    className="absolute bottom-0 left-0 w-full transition-all duration-300"
                    style={{ 
                      height: `${fillPercentage}%`,
                      minHeight: '0px',
                      background: 'linear-gradient(45deg, color-mix(in srgb, var(--foreground) 50%, transparent), color-mix(in srgb, var(--foreground) 30%, transparent))'
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-1">
                    {/* Level Number */}
                    <div className="flex items-center justify-center">
                      <span className="font-mono text-lg text-foreground">
                        {level.toString().padStart(2, '0')}
                      </span>
                    </div>
                    {/* Player Count */}
                    <div className="flex items-center justify-center">
                      <span className="font-mono text-xs text-foreground">
                        {levelPopulations[level] || 0}/{levelCapacities[level] || 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
