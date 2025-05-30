"use client";

import { motion } from "framer-motion";

interface GameProps {
  playerTeam: number;
  playerList: {
    playerAddress: string;
    playerNumber: bigint;
    team: number;
    isActive: boolean;
  }[];
  onSwitchTeam: (team: number) => void;
  disabled: boolean;
}

type Player = GameProps['playerList'][number];
type TeamNumber = 0 | 1 | 2 | 3;

const TeamIcons: Record<TeamNumber, string> = {
  0: "△",  // triangle
  1: "○",  // circle
  2: "□",  // square
  3: "✕",  // x
};

export type { GameProps };

export default function Game({
  playerTeam,
  playerList,
  onSwitchTeam,
  disabled
}: GameProps) {
  // Group players by team
  const teamPlayers: Record<TeamNumber, Player[]> = {
    0: playerList.filter(p => p.team === 0 && p.isActive),
    1: playerList.filter(p => p.team === 1 && p.isActive),
    2: playerList.filter(p => p.team === 2 && p.isActive),
    3: playerList.filter(p => p.team === 3 && p.isActive),
  };

  // Find the team with the most players to calculate relative heights
  const maxPlayers = Math.max(...Object.values(teamPlayers).map(team => team.length));
  const getBarHeight = (playerCount: number) => {
    return maxPlayers === 0 ? 100 : (playerCount / maxPlayers) * 300 + 100; // minimum height of 100px
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto px-4 pt-8">
      <div className="flex gap-4 w-full justify-center">
        {([0, 1, 2, 3] as const).map((teamNumber) => (
          <div key={teamNumber} className="flex flex-col items-center w-full max-w-[150px]">
            <div className="h-[400px] w-full relative flex items-end mb-4">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: getBarHeight(teamPlayers[teamNumber].length) }}
                transition={{ duration: 0.8, delay: teamNumber * 0.1 }}
                className={`w-full relative flex flex-col justify-between
                  rounded-t-lg border-2 transition-all duration-300 hover:brightness-110
                  ${playerTeam === teamNumber ? 'border-foreground shadow-[0_0_20px_var(--foreground)]' : 'border-border'}
                  ${disabled ? 'opacity-50' : ''}
                  after:absolute after:inset-0 after:rounded-t
                  after:bg-gradient-to-t after:from-transparent 
                  after:via-[var(--foreground)] after:via-40% 
                  after:to-[var(--foreground)] after:to-100%
                  after:opacity-40 after:pointer-events-none
                  before:absolute before:inset-0 before:rounded-t
                  before:bg-gradient-to-b before:from-[var(--foreground)]
                  before:to-transparent before:from-40% before:to-100%
                  before:opacity-100 before:pointer-events-none`}
              >
                <div className="absolute top-0 left-0 right-0 p-3 text-center">
                  <span className="text-md text-background">
                    {teamPlayers[teamNumber].length}
                  </span>
                </div>

                <div className="mt-auto p-3 w-full text-center">
                  <div className="text-5xl font-bold">{TeamIcons[teamNumber]}</div>
                </div>
              </motion.div>
            </div>

            {playerTeam !== undefined && !disabled && teamNumber !== playerTeam && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSwitchTeam(teamNumber)}
                className="w-full p-2 rounded-lg border border-border hover:bg-overlay-light text-sm"
              >
                Join {TeamIcons[teamNumber]}
              </motion.button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 