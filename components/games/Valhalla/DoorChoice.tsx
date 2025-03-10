"use client";

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import GameRules from './GameRules';

interface DoorChoiceProps {
  onDoorSelect: (door: 'valhalla' | 'hel') => void;
}

// Custom hook for countdown timer
const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return {
    minutes,
    seconds: remainingSeconds,
    timeString: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`,
    isFinished: seconds === 0
  };
};

// Helper function to shorten address
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

interface Teammate {
  address: string;
  doorsOpened: number;
}

// Generate dummy addresses with door counts
const dummyTeammates: Teammate[] = Array.from({ length: 20 }, () => ({
  address: `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`,
  doorsOpened: Math.floor(Math.random() * 5) // Random number 0-4 for testing
}));

export default function DoorChoice({ onDoorSelect }: DoorChoiceProps) {
  const timer = useCountdown(120);
  const [teammates, setTeammates] = useState<Teammate[]>(dummyTeammates);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setTeammates(prev => [...prev].sort((a, b) => 
      newDirection === 'asc' 
        ? a.doorsOpened - b.doorsOpened 
        : b.doorsOpened - a.doorsOpened
    ));
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto px-4">
      <GameRules />

      {/* Round Counter */}
      <div className="mb-4 text-2xl md:text-3xl text-neon-300 font-bold tracking-wider">
        Round 1/10
      </div>

      {/* Timer */}
      <div className={`mb-8 text-xl md:text-2xl font-mono font-bold tracking-wider
        ${timer.isFinished ? 'text-blood-300' : 'text-gray-300'}`}>
        {timer.timeString}
      </div>

      {/* Doors Container */}
      <div className="flex flex-row gap-8 md:gap-24 lg:gap-32 items-center justify-center w-full">
        {/* Valhalla Door */}
        <button
          onClick={() => onDoorSelect('valhalla')}
          className="group relative w-[38%] max-w-[220px] aspect-[2/3] bg-dark-700 rounded-t-xl border-2 border-neon-600 
                     hover:border-neon-400 transition-colors duration-300 shadow-neon hover:shadow-lg"
        >
          <div className="absolute inset-0 flex flex-col items-center pt-12 sm:pt-16">
            <span className="text-lg sm:text-xl md:text-2xl text-neon-300 font-bold tracking-wider group-hover:text-neon-200">
              Valhalla
            </span>
          </div>
          {/* Door Handle */}
          <div className="absolute right-2 md:right-4 top-1/2 w-1.5 md:w-2 h-8 md:h-10 bg-neon-600 rounded-full 
                        group-hover:bg-neon-400 transition-colors duration-300" />
        </button>

        {/* Hel Door */}
        <button
          onClick={() => onDoorSelect('hel')}
          className="group relative w-[38%] max-w-[220px] aspect-[2/3] bg-dark-700 rounded-t-xl border-2 border-blood-600 
                     hover:border-blood-400 transition-colors duration-300 shadow-blood hover:shadow-lg"
        >
          <div className="absolute inset-0 flex flex-col items-center pt-12 sm:pt-16">
            <span className="text-lg sm:text-xl md:text-2xl text-blood-300 font-bold tracking-wider group-hover:text-blood-200">
              Hel
            </span>
          </div>
          {/* Door Handle */}
          <div className="absolute right-2 md:right-4 top-1/2 w-1.5 md:w-2 h-8 md:h-10 bg-blood-600 rounded-full 
                        group-hover:bg-blood-400 transition-colors duration-300" />
        </button>
      </div>

      {/* Team Members List */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-xl text-neon-300 font-bold mb-4 tracking-wider">Your Team</h2>
        <div className="bg-dark-700 rounded-lg border border-dark-400 p-4">
          {/* Table */}
          <div className="w-full">
            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-4 mb-2 px-3 text-sm text-gray-400 font-semibold">
              <div className="col-span-9">Address</div>
              <div className="col-span-3 flex items-center justify-end gap-2 cursor-pointer" onClick={toggleSort}>
                <span>Doors</span>
                {sortDirection === 'asc' 
                  ? <ArrowUpIcon className="w-4 h-4" />
                  : <ArrowDownIcon className="w-4 h-4" />
                }
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-1">
              {teammates.map((teammate, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-12 gap-4 bg-dark-800 rounded p-3 items-center"
                >
                  <div className="col-span-9 font-mono text-sm text-gray-300 truncate" title={teammate.address}>
                    <span className="hidden sm:inline">{teammate.address}</span>
                    <span className="sm:hidden">{shortenAddress(teammate.address)}</span>
                  </div>
                  <div className="col-span-3 font-mono text-sm text-gray-300 text-right pr-2">
                    {teammate.doorsOpened}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 