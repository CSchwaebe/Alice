"use client";

import { useState } from 'react';
import AnimatedSymbols from './AnimatedSymbols';
import PlayerList from './PlayerList';

export default function PickThreeGame() {
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);

  const handleSymbolClick = (index: number) => {
    setSelectedDoor(index);
    // Add your door selection logic here
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <AnimatedSymbols 
        onSymbolClick={handleSymbolClick}
        className="max-w-4xl w-full"
      />
      {selectedDoor !== null && (
        <p className="mt-4 mb-8">You selected symbol {selectedDoor + 1}</p>
      )}
      <PlayerList />
    </div>
  );
} 