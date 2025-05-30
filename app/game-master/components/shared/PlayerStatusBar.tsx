interface PlayerStatusBarProps {
  activePlayers: number;
  eliminatedPlayers: number;
}

export default function PlayerStatusBar({ activePlayers, eliminatedPlayers }: PlayerStatusBarProps) {
  const totalPlayers = activePlayers + eliminatedPlayers;
  const activePercentage = totalPlayers > 0 ? (activePlayers / totalPlayers) * 100 : 0;
  const eliminatedPercentage = totalPlayers > 0 ? (eliminatedPlayers / totalPlayers) * 100 : 0;
  
  return (
    <div className="font-mono text-xs mb-6">
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-white/70">Active: {activePlayers}</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
            <span className="text-white/70">Eliminated: {eliminatedPlayers}</span>
          </div>
        </div>
        <span className="text-white/70">Total: {activePlayers + eliminatedPlayers}</span>
      </div>
      <div className="w-full h-4 bg-black/70 border border-white/30 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-green-500/50"
          style={{ width: `${activePercentage}%` }}
        ></div>
        <div 
          className="absolute top-0 right-0 h-full bg-red-500/50"
          style={{ width: `${eliminatedPercentage}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-[10px] font-bold text-white drop-shadow-lg">
            {activePercentage.toFixed(1)}% Active
          </span>
        </div>
      </div>
    </div>
  );
} 