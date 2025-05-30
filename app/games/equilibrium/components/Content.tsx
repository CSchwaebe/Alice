import { GameTimer } from '@/components/ui/GameTimer';
import Game from './Game';
import Rules from './Rules';

interface ContentProps {
  gameState: number;
  roundEndTime: number;
  playerTeam: number;
  playerList: {
    playerAddress: string;
    playerNumber: bigint;
    team: number;
    isActive: boolean;
  }[];
  onSwitchTeam: (team: number) => void;
  isPending: boolean;
  isWaitingTx: boolean;
}

export default function Content({
  gameState,
  roundEndTime,
  playerTeam,
  playerList,
  onSwitchTeam,
  isPending,
  isWaitingTx
}: ContentProps) {
  if (gameState === 1) {
    // Pre-game state - show game rules
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Rules />
      </div>
    );
  }

  // Active game state
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Timer */}
      <div className="flex justify-center mb-8">
        <GameTimer endTime={roundEndTime} />
      </div>

      {/* Game interface */}
      <Game
        playerTeam={playerTeam}
        playerList={playerList}
        onSwitchTeam={onSwitchTeam}
        disabled={isPending || isWaitingTx}
      />
    </div>
  );
} 