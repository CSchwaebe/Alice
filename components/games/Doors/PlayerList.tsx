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
    <div className="font-mono text-sm bg-black/50 border border-white/20 p-6 mt-8">
      <div className="text-white/70 mb-4 uppercase tracking-wider">Players</div>
      
      <div className="grid grid-cols-3 gap-4 text-xs mb-2 text-white/50 uppercase">
        <div>Player</div>
        <div>Status</div>
        <div>Doors Opened</div>
      </div>
      
      <div className="space-y-2">
        {playerList.map((player) => (
          <div 
            key={player.playerAddress}
            className={`grid grid-cols-3 gap-4 text-sm ${
              player.playerAddress.toLowerCase() === currentPlayerAddress?.toLowerCase()
                ? 'text-neon-300'
                : 'text-white/80'
            }`}
          >
            <div className="truncate">
              {player.playerNumber}
            </div>
            <div>
              {player.isActive ? (
                <span className="text-green-400">Active</span>
              ) : (
                <span className="text-red-400">Eliminated</span>
              )}
            </div>
            <div>{player.doorsOpened.toString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 