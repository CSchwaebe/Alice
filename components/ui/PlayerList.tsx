import { PlayerInfo } from '@/hooks/useThreesGameData';

interface PlayerListProps {
  players: PlayerInfo[];
}

export function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="bg-black/20 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Players</h2>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.playerAddress}
            className="flex items-center justify-between p-2 rounded bg-white/5"
          >
            <span className="font-mono text-white/80">#{player.playerNumber}</span>
            <span className={`px-2 py-1 rounded text-sm ${player.isActive ? 'bg-white/20' : 'bg-red-500/20'}`}>
              {player.isActive ? 'Active' : 'Eliminated'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 