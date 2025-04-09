"use client";

import { FormattedPlayerInfo } from '@/hooks/Descend/useDescendGameData';

interface GameProps {
  currentLevel: number;
  allPlayers: FormattedPlayerInfo[];
  onLevelSelect: (move: number) => void;
  hasCommitted: boolean;
  hasRevealed: boolean;
  gameState: number;
  levelPopulations: Record<number, number>;
}

export default function Game({ 
  currentLevel, 
  allPlayers, 
  onLevelSelect, 
  hasCommitted,
  hasRevealed,
  gameState,
  levelPopulations
}: GameProps) {
  // Create an array of all levels from 0 to 21
  const levels = Array.from({ length: 22 }, (_, i) => i);
  
  // Calculate level caps
  const totalPlayers = allPlayers.length;
  const getLevelCap = (level: number): number => {
    if (level === 0) return totalPlayers;
    if (level === 21) return Math.ceil(totalPlayers / 2);
    return Math.ceil(totalPlayers / 10);
  };

  // Calculate fill percentage for a level
  const getLevelFillPercentage = (level: number): number => {
    const population = levelPopulations[level] || 0;
    const cap = getLevelCap(level);
    const percentage = Math.min((population / cap) * 100, 100);
    console.log(`Level ${level} - Population: ${population}, Cap: ${cap}, Fill: ${percentage}%`);
    return percentage;
  };

  // Get population info string
  const getPopulationInfo = (level: number): string => {
    const population = levelPopulations[level] || 0;
    const cap = getLevelCap(level);
    return `${population}/${cap} players`;
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

  // Debug log for level populations
  console.log('Level Populations:', levelPopulations);
  console.log('Total Players:', totalPlayers);

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
              const isClickable = isReachable;
              const isEndLevel = level === 0 || level === 21;
              const fillPercentage = getLevelFillPercentage(level);

              return (
                <div
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  className={`
                    group relative flex flex-col items-center justify-between p-4 rounded-lg border min-h-[100px]
                    transition-all duration-200 overflow-hidden
                    ${isCurrentLevel ? 'bg-overlay-medium border-primary-600 shadow-glow-md' : 
                      isClickable ? 'bg-overlay-light border-primary-400/50 cursor-pointer hover:border-primary-500 hover:shadow-glow-sm hover:bg-overlay-medium' : 
                      'bg-overlay-light border-border'}
                    ${isEndLevel ? 'col-span-5' : ''}
                  `}
                >
                  {/* Population Fill */}
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-primary-500/30 transition-all duration-300"
                    style={{ 
                      height: `${fillPercentage}%`,
                      minHeight: '2px'
                    }}
                  />

                  {/* Tooltip */}
                  <div 
                    className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-background/95 backdrop-blur-sm border border-primary-400 rounded-lg shadow-lg z-[100]"
                  >
                    <span className="font-mono text-sm text-foreground whitespace-nowrap">{getPopulationInfo(level)}</span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {/* Level Number */}
                    <div className="flex items-center justify-center">
                      <span className={`font-mono text-lg ${
                        isCurrentLevel ? 'text-primary-600' : 
                        isClickable ? 'text-primary-400 group-hover:text-primary-500' : 
                        'text-foreground'
                      }`}>
                        {level.toString().padStart(2, '0')}
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
