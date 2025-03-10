"use client";

import { useState } from 'react';
import DoorChoice from '@/components/games/Valhalla/DoorChoice';
import ChoicePopup from '@/components/games/Valhalla/ChoicePopup';

export default function ValhallaPage() {
  const [selectedDoor, setSelectedDoor] = useState<'valhalla' | 'hel' | null>(null);

  const handleConfirmChoice = () => {
    // TODO: Handle the player's choice
    console.log(`Player chose ${selectedDoor}`);
    setSelectedDoor(null);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl text-blood-300 font-bold mb-8 tracking-wider">
        Valhalla or Hel?
      </h1>

      <DoorChoice onDoorSelect={setSelectedDoor} />

      {selectedDoor && (
        <ChoicePopup
          choice={selectedDoor}
          onClose={() => setSelectedDoor(null)}
          onConfirm={handleConfirmChoice}
        />
      )}
    </div>
  );
} 