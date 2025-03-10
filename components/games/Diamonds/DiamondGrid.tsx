"use client";

import { useState } from 'react';
import ViewportDrawer from '@/components/ui/ViewportDrawer';

interface DiamondGridProps {
  onNumberSelect: (number: number) => void;
}

export default function DiamondGrid({ onNumberSelect }: DiamondGridProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
  };

  const handleConfirm = () => {
    if (selectedNumber !== null) {
      onNumberSelect(selectedNumber);
      setSelectedNumber(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Grid of numbers */}
      <div className="grid grid-cols-5 md:grid-cols-10">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            className="aspect-square bg-dark-700 hover:bg-dark-600 
                     border border-dark-400
                     flex items-center justify-center
                     text-sm sm:text-base text-gray-300
                     transition-colors duration-200"
          >
            {number}
          </button>
        ))}
      </div>

      {/* Selection Popup */}
      <ViewportDrawer
        isOpen={selectedNumber !== null}
        onClose={() => setSelectedNumber(null)}
      >
        <div className="p-4 text-center">
          <h3 className="text-xl text-neon-300 mb-6">
            Choose {selectedNumber}?
          </h3>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setSelectedNumber(null)}
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