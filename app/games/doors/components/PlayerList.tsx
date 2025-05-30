import { useState } from 'react';

type PlayerInfo = {
  playerAddress: `0x${string}`;
  playerNumber: string;
  isActive: boolean;
  doorsOpened: bigint;
};

interface PlayerListProps {
  playerList: PlayerInfo[];
  currentPlayerAddress?: string;
}

export default function PlayerList({ playerList, currentPlayerAddress }: PlayerListProps) {
  return (
    <div className="bg-overlay-medium backdrop-blur-sm border border-border rounded-lg p-4 mt-8 max-w-4xl mx-auto w-full">
      <h2 className="text-primary-800 font-mono mb-4">ACTIVE PLAYERS</h2>
      <div className="space-y-2">
        {playerList.map((player) => (
          <div 
            key={player.playerAddress}
            className="flex items-center justify-between p-2 bg-overlay-light rounded border border-border"
          >
            <div className="flex items-center gap-3">
              <span className="text-foreground font-mono">#{player.playerNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-primary-400 font-mono text-sm">DOORS</span>
                <span className="text-foreground font-mono text-sm">{player.doorsOpened.toString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-400 font-mono text-sm">ACTIVE</span>
                <div className={`h-2 w-2 rounded-full ${player.isActive ? 'bg-foreground' : 'bg-primary-200'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 