"use client";

import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface Player {
  address: string;
  lives: number;
}

// Helper function to shorten address
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Generate dummy players with random addresses and lives
const dummyPlayers: Player[] = Array.from({ length: 20 }, () => ({
  address: `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`,
  lives: Math.floor(Math.random() * 10) + 1 // Random number 1-10
}));

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>(dummyPlayers);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setPlayers(prev => [...prev].sort((a, b) => 
      newDirection === 'asc' 
        ? a.lives - b.lives 
        : b.lives - a.lives
    ));
  };

  return (
    <div className="w-full max-w-4xl mt-12">
      <h2 className="text-xl text-neon-300 font-bold mb-4 tracking-wider">Players</h2>
      <div className="bg-dark-700 rounded-lg border border-dark-400 p-4">
        <div className="w-full">
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 mb-2 px-3 text-sm text-gray-400 font-semibold">
            <div className="col-span-9">Address</div>
            <div className="col-span-3 flex items-center justify-end gap-2 cursor-pointer" onClick={toggleSort}>
              <span>Lives</span>
              {sortDirection === 'asc' 
                ? <ArrowUpIcon className="w-4 h-4" />
                : <ArrowDownIcon className="w-4 h-4" />
              }
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-1">
            {players.map((player, index) => (
              <div 
                key={index}
                className="grid grid-cols-12 gap-4 bg-dark-800 rounded p-3 items-center"
              >
                <div className="col-span-9 font-mono text-sm text-gray-300 truncate" title={player.address}>
                  <span className="hidden sm:inline">{player.address}</span>
                  <span className="sm:hidden">{shortenAddress(player.address)}</span>
                </div>
                <div className="col-span-3 font-mono text-sm text-gray-300 text-right pr-2">
                  {player.lives}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 