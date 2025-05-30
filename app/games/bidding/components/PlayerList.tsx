"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { FormattedPlayerInfo } from '@/app/games/bidding/hooks/useBiddingGameData';

export interface PlayerListProps {
  players: FormattedPlayerInfo[];
  currentPlayerAddress?: `0x${string}` | undefined;
}

export default function PlayerList({ players, currentPlayerAddress }: PlayerListProps) {
  return (
    <div className="bg-overlay-medium backdrop-blur-sm border border-border rounded-lg p-4">
      <h2 className="text-primary-800 font-mono mb-4">ACTIVE PLAYERS</h2>
      <div className="space-y-2">
        {players.map((player) => {
          const isCurrentPlayer = currentPlayerAddress?.toLowerCase() === player.playerAddress.toLowerCase();
          
          return (
            <div 
              key={player.playerAddress}
              className={`flex items-center justify-between p-2 rounded border
                ${isCurrentPlayer 
                  ? 'bg-overlay-dark border-foreground' 
                  : 'bg-overlay-light border-border'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-foreground font-mono">#{player.playerNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-primary-400 font-mono text-sm">
                    <span className="hidden md:inline">COMMITTED</span>
                    <span className="md:hidden">C</span>
                  </span>
                  <div className={`h-2 w-2 rounded-full ${player.hasCommitted ? 'bg-foreground' : 'bg-primary-200'}`} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-400 font-mono text-sm">
                    <span className="hidden md:inline">REVEALED</span>
                    <span className="md:hidden">R</span>
                  </span>
                  <div className={`h-2 w-2 rounded-full ${player.hasRevealed ? 'bg-foreground' : 'bg-primary-200'}`} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-400 font-mono text-sm">
                    <span className="hidden md:inline">POINTS</span>
                    <span className="md:hidden">P</span>
                  </span>
                  <span className="text-foreground font-mono text-sm">{player.points.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-400 font-mono text-sm">
                    <span className="hidden md:inline">ACTIVE</span>
                    <span className="md:hidden">A</span>
                  </span>
                  <div className={`h-2 w-2 rounded-full ${player.isActive ? 'bg-foreground' : 'bg-primary-200'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 