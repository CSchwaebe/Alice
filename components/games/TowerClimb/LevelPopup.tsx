import ViewportDrawer from '@/components/ui/ViewportDrawer';

/**
 * Props for LevelPopup component
 */
interface LevelPopupProps {
  level: number;                   // Level number being displayed
  currentPlayers: number;          // Current player count on this level
  potentialPlayers: number;        // Potential players that could move here
  onClose: () => void;             // Handler for closing the popup
  isReachable: boolean;            // Whether player can move to this level
  isCurrentLevel: boolean;         // Whether this is player's current level
  onMove: (targetLevel: number) => void;  // Handler for moving to this level
}

/**
 * LevelPopup - Displays detailed information about a level
 * Shows player counts and allows player to move to the level if reachable
 */
export default function LevelPopup({ 
  level, 
  currentPlayers, 
  potentialPlayers, 
  onClose,
  isReachable,
  isCurrentLevel,
  onMove
}: LevelPopupProps) {
  // Format level name based on position (Start, Level X, or Finish)
  const levelLabel = level === 0 ? 'Entrance' : level === 21 ? 'Finish' : `Level ${level}`;
  
  // Determine if potential player count is dangerous (>100)
  const isPotentialOvercrowded = potentialPlayers > 100;
  
  return (
    <ViewportDrawer isOpen={true} onClose={onClose}>
      {/* Handle for drawer UI */}
      <div className="w-12 h-1 bg-dark-400 rounded-full mx-auto mb-4" />
      
      {/* Header with level name and close button */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-neon-300 text-xl tracking-wider">{levelLabel}</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300 text-2xl"
        >
          ×
        </button>
      </div>
      
      {/* Level statistics */}
      <div className="space-y-4">
        {/* Current player count */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 tracking-wide">Current Players:</span>
          <span className="text-neon-300 text-lg">{currentPlayers}</span>
        </div>
        
        {/* Potential player count (with color warning) */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 tracking-wide">Potential Moves:</span>
          <span className={`text-lg ${isPotentialOvercrowded ? 'text-blood-300' : 'text-emerald-300'}`}>
            {potentialPlayers}
          </span>
        </div>
        
        {/* Move action button (only shown if level is reachable) */}
        {(isReachable || isCurrentLevel) && (
          <button
            className={`
              w-full mt-6 py-3 rounded-lg
              text-lg uppercase tracking-wider text-white
              transition-colors duration-200
              ${isCurrentLevel 
                ? 'bg-neon-600 hover:bg-neon-500' 
                : 'bg-emerald-600 hover:bg-emerald-500'
              }
            `}
            onClick={() => onMove(level)}
          >
            {isCurrentLevel ? `Stay on Level ${level}` : `Move to Level ${level}`}
          </button>
        )}
      </div>
    </ViewportDrawer>
  );
} 