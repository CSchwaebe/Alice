"use client";

import ViewportDrawer from '@/components/ui/ViewportDrawer';

interface ChoicePopupProps {
  choice: 'valhalla' | 'hel';
  onClose: () => void;
  onConfirm: () => void;
}

export default function ChoicePopup({ choice, onClose, onConfirm }: ChoicePopupProps) {
  const isValhalla = choice === 'valhalla';
  
  return (
    <ViewportDrawer isOpen={true} onClose={onClose}>
      {/* Handle for drawer UI */}
      <div className="w-12 h-1 bg-dark-400 rounded-full mx-auto mb-4" />
      
      {/* Content */}
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold tracking-wider">
          {isValhalla ? 'Enter Valhalla?' : 'Descend to Hel?'}
        </h2>
        <p className="text-gray-300">
          {isValhalla 
            ? 'The gates of Valhalla stand before you...' 
            : 'The path to Hel beckons...'
          }
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-black border border-gray-800 text-gray-300 hover:border-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`
              px-6 py-2 rounded-lg text-white transition-colors duration-200
              ${isValhalla 
                ? 'bg-neon-600 hover:bg-neon-500' 
                : 'bg-blood-600 hover:bg-blood-500'
              }
            `}
          >
            Confirm
          </button>
        </div>
      </div>
    </ViewportDrawer>
  );
} 