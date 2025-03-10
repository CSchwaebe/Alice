"use client";

import DoorSelection from '@/components/games/PickThree/DoorSelection';
import PlayerList from '@/components/games/PickThree/PlayerList';

export default function PickThreePage() {
  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl text-neon-300 font-bold mb-8 tracking-wider">
        Pick Three
      </h1>
      <DoorSelection />
      <PlayerList />
    </div>
  );
} 