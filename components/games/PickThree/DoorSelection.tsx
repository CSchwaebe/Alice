"use client";

import { useState } from 'react';
import ViewportDrawer from '@/components/ui/ViewportDrawer';

export default function DoorSelection() {
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDoorClick = (doorNumber: number) => {
    setSelectedDoor(doorNumber);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    console.log(`Door ${selectedDoor} confirmed`);
    setShowConfirmation(false);
    // TODO: Handle the actual door selection
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-dark-700 rounded-lg border border-dark-400 p-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((doorNumber) => (
            <button
              key={doorNumber}
              onClick={() => handleDoorClick(doorNumber)}
              className="aspect-square bg-dark-800 hover:bg-dark-600 
                       border-2 border-neon-400 rounded-lg
                       flex items-center justify-center
                       transition-all duration-200
                       hover:shadow-neon hover:scale-105"
            >
              <span className="text-4xl md:text-5xl font-bold text-neon-300">
                {doorNumber}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Popup */}
      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <div className="p-4 text-center">
          <h3 className="text-xl text-neon-300 mb-6">
            Choose Door {selectedDoor}?
          </h3>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 rounded-lg bg-dark-600 text-gray-300 
                       hover:bg-dark-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-lg bg-neon-600 text-white
                       hover:bg-neon-500 transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </ViewportDrawer>
    </div>
  );
} 