"use client";

import { useState, useEffect } from 'react';
import DiamondGrid from '@/components/games/Diamonds/DiamondGrid';
import PlayerList from '@/components/games/Diamonds/PlayerList';

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

export default function DiamondsPage() {
  const timer = useCountdown(120); // 2 minutes in seconds

  const handleNumberSelect = (number: number) => {
    console.log(`Selected number: ${number}`);
    // TODO: Handle the selection
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl text-neon-300 font-bold mb-8 tracking-wider">
        Diamonds
      </h1>

      <div className="flex justify-between w-full max-w-4xl mb-4">
        <div className="text-xl text-neon-200">
          Round <span className="text-neon-300 font-bold">1</span>
        </div>
        <div className="text-xl text-blood-200">
          Lives: <span className="text-blood-300 font-bold">10</span>
        </div>
      </div>

      <div className="text-2xl md:text-3xl text-center text-neon-200 mb-4">
        Multiplier: <span className="text-neon-300 font-bold">0.8</span>x
      </div>

      <div className={`text-2xl md:text-3xl font-mono font-bold mb-8 tracking-wider
        ${timer.isFinished ? 'text-blood-300' : 'text-gray-300'}`}>
        {timer.timeString}
      </div>

      <DiamondGrid onNumberSelect={handleNumberSelect} />
      <PlayerList />
    </div>
  );
} 