"use client";

import { GameTimer } from "@/components/ui/GameTimer";
import PickThreeGame from "@/components/games/PickThree/PickThreeGame";
import { Silkscreen } from 'next/font/google';

const silkscreen = Silkscreen({ 
  weight: '400',
  subsets: ['latin']
});

export default function PickThreePage() {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className={`text-4xl md:text-5xl font-bold mb-8 tracking-wider ${silkscreen.className}`}>
        <GameTimer seconds={60} />
      </div>
      <PickThreeGame />
    </div>
  );
} 