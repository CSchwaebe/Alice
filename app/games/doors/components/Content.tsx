import { GameTimer } from '@/components/ui/GameTimer';
import DoorChoice from './Game';
import GameRules from './Rules';

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
    return (
      <div className="flex flex-col items-center justify-start w-full">
        <GameRules />
      </div>
    );
  }
  
  // Active game state
  return (
    <div className="relative">
      {/* Timer */}
      <div className="flex justify-center mb-8">
        <GameTimer endTime={roundEndTime} />
      </div>

      {/* Round Counter */}
      <div className="mb-8 flex justify-center">
        <div className="text-2xl md:text-3xl text-foreground font-bold tracking-wider">
          Round {currentRound.toString()}/3
        </div>
      </div>

      {/* Door Choice Component */}
      <DoorChoice onDoorSelect={onDoorSelect} round={Number(currentRound)} />
    </div>
  );
} 