import { GameTimer } from '@/components/ui/GameTimer';
import DoorChoice from './DoorChoice';
import GameRules from './GameRules';

interface GameContentProps {
  gameState: number;
  roundEndTime: number;
  currentRound: bigint;
  onDoorSelect: () => void;
}

export default function GameContent({ 
  gameState, 
  roundEndTime, 
  currentRound, 
  onDoorSelect 
}: GameContentProps) {
  
  if (gameState === 1) {
    // Pre-game state - show game rules
    return <GameRules />;
  }
  
  // Active game state
  return (
    <>
      {/* Timer */}
      <div className="flex justify-center mb-8">
        <GameTimer endTime={roundEndTime} />
      </div>

      {/* Round Counter */}
      <div className="mb-8 flex justify-center">
        <div className="text-2xl md:text-3xl text-foreground font-bold tracking-wider">
          Round {currentRound.toString()}/10
        </div>
      </div>

      {/* Door Choice Component */}
      <DoorChoice onDoorSelect={onDoorSelect} />
    </>
  );
} 