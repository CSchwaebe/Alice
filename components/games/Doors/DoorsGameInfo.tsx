import { PlayerInfo } from '@/hooks/useDoorsGameData';

interface DoorsGameInfoProps {
  address?: string;
  playerInfo?: [string, bigint, boolean, number, bigint] | undefined;
  gameId: bigint | null;
  playerList: PlayerInfo[];
  showDebug?: boolean;
}

export default function DoorsGameInfo({
  address,
  playerInfo,
  gameId,
  playerList,
  showDebug = false
}: DoorsGameInfoProps) {
  if (!showDebug) return null;
  
  return (
    <div className="bg-black/70 border border-white/10 p-4 text-xs font-mono text-gray-400 mt-8">
      <h3 className="text-white/70 uppercase tracking-wider mb-2">Debug Info</h3>
      <div className="space-y-1">
        <p>Connected Address: {address || 'Not connected'}</p>
        <p>Game ID: {gameId?.toString() || 'Not available'}</p>
        <p>Game Name: {playerInfo?.[0] || 'Not available'}</p>
        <p>Player Count: {playerList.length}</p>
      </div>
    </div>
  );
} 