"use client";

import { useState, useEffect } from 'react';
import DoorChoice from '@/components/games/Valhalla/DoorChoice';
import ChoicePopup from '@/components/games/Valhalla/ChoicePopup';
import { Silkscreen } from 'next/font/google';

const silkscreen = Silkscreen({ 
  weight: '400',
  subsets: ['latin']
});

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

export default function ValhallaPage() {
  const timer = useCountdown(120); // 2 minutes in seconds

  const [selectedDoor, setSelectedDoor] = useState<'valhalla' | 'hel' | null>(null);

  const handleConfirmChoice = () => {
    // TODO: Handle the player's choice
    console.log(`Player chose ${selectedDoor}`);
    setSelectedDoor(null);
  };


  
  return (
    <div className="p-4 flex flex-col items-center">
       <div className={`text-4xl md:text-5xl font-bold mb-8 tracking-wider ${silkscreen.className}
        ${timer.isFinished ? 'text-blood-300' : 'text-white'}`}>
        {timer.timeString}
      </div>

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