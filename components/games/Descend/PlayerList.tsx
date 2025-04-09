import { FormattedPlayerInfo } from '@/hooks/Descend/useDescendGameData';

interface PlayerListProps {
  players: FormattedPlayerInfo[];
}

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="bg-overlay-medium backdrop-blur-sm border border-border rounded-lg p-4">
      <h2 className="text-primary-800 font-mono mb-4">ACTIVE PLAYERS</h2>
      <div className="space-y-2">
        {players.map((player) => (
          <div 
            key={player.playerAddress}
            className="flex items-center justify-between p-2 bg-overlay-light rounded border border-border"
          >
            <div className="flex items-center gap-3">
              <span className="text-foreground font-mono">#{player.playerNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-primary-400 font-mono text-sm">LEVEL</span>
                <span className="text-foreground font-mono text-sm">{player.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-400 font-mono text-sm">COMMITTED</span>
                <div className={`h-2 w-2 rounded-full ${player.hasCommitted ? 'bg-foreground' : 'bg-primary-200'}`} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-400 font-mono text-sm">REVEALED</span>
                <div className={`h-2 w-2 rounded-full ${player.hasRevealed ? 'bg-foreground' : 'bg-primary-200'}`} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-400 font-mono text-sm">ACTIVE</span>
                <div className={`h-2 w-2 rounded-full ${player.isActive ? 'bg-foreground' : 'bg-primary-200'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 