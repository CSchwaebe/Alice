"use client";

import { useState, useEffect } from 'react';
import DiamondGrid from '@/components/games/Diamonds/DiamondGrid';
import PlayerList from '@/components/games/Diamonds/PlayerList';
import { GameTimer } from "@/components/ui/GameTimer";
import { Silkscreen } from 'next/font/google';

const silkscreen = Silkscreen({ 
  weight: '400',
  subsets: ['latin']
});

export default function DiamondsPage() {
  const [isFinished, setIsFinished] = useState(false);
  // This would ideally be fetched from your game state or contract
  const gameInstanceId = "diamonds-instance-1";

  const handleNumberSelect = (number: number) => {
    console.log(`Selected number: ${number}`);
    // TODO: Handle the selection
  };

  const handleTimeUp = () => {
    setIsFinished(true);
  };

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <div className={`text-4xl md:text-5xl font-bold mb-8 tracking-wider ${silkscreen.className}`}>
        <GameTimer endTime={60} />
      </div>

      <div className="flex justify-between w-full max-w-4xl mb-4">
        <div className="text-xl text-neon-200">
          Round <span className="text-neon-300 font-bold">1</span>
        </div>
        <div className="text-xl text-neon-200">
          Multiplier: <span className="text-neon-300 font-bold">0.8</span>
        </div>
        <div className="text-xl text-blood-200">
          Lives: <span className="text-blood-300 font-bold">10</span>
        </div>
      </div>

      <DiamondGrid onNumberSelect={handleNumberSelect} />
      <PlayerList />
    </div>
  );
} 