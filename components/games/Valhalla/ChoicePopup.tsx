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
        <h3 className={`text-2xl font-bold tracking-wider ${isValhalla ? 'text-neon-300' : 'text-blood-300'}`}>
          {isValhalla ? 'Enter Valhalla' : 'Descend to Hel'}
        </h3>
        
        <p className="text-gray-300">
          {isValhalla 
            ? "Join the einherjar in Odin's great hall?" 
            : "Venture into Helheim's cold embrace?" }
        </p>
        
        <button
          onClick={onConfirm}
          className={`
            w-full mt-6 py-3 rounded-lg
            text-lg uppercase tracking-wider text-white
            transition-colors duration-200
            ${isValhalla 
              ? 'bg-neon-600 hover:bg-neon-500' 
              : 'bg-blood-600 hover:bg-blood-500'
            }
          `}
        >
          Choose {isValhalla ? 'Valhalla' : 'Hel'}
        </button>
      </div>
    </ViewportDrawer>
  );
} 