"use client";

import { useState } from 'react';

// Generate dummy addresses
const dummyPlayers = Array.from({ length: 3 }, () => ({
  address: `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`
}));

// Helper function to shorten address
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function PlayerList() {
  const [players] = useState(dummyPlayers);

  return (
    <div className="w-full max-w-2xl mt-12">
      <h2 className="text-xl text-neon-300 font-bold mb-4 tracking-wider">Players</h2>
      <div className="bg-dark-700 rounded-lg border border-dark-400 p-4">
        <div className="w-full">
          {/* Table Header */}
          <div className="px-3 text-sm text-gray-400 font-semibold mb-2">
            Address
          </div>

          {/* Table Rows */}
          <div className="space-y-1">
            {players.map((player, index) => (
              <div 
                key={index}
                className="bg-dark-800 rounded p-3"
              >
                <div className="font-mono text-sm text-gray-300 truncate" title={player.address}>
                  <span className="hidden sm:inline">{player.address}</span>
                  <span className="sm:hidden">{shortenAddress(player.address)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 