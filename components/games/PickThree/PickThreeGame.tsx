"use client";

import { useState } from 'react';
import AnimatedSymbols from './AnimatedSymbols';

export default function PickThreeGame() {
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);

  const handleSymbolClick = (index: number) => {
    setSelectedDoor(index);
    // Add your door selection logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AnimatedSymbols 
        onSymbolClick={handleSymbolClick}
        className="max-w-2xl w-full"
      />
      {selectedDoor !== null && (
        <p className="mt-4">You selected symbol {selectedDoor + 1}</p>
      )}
    </div>
  );
} 