interface RegistrationProgressBarProps {
  registeredPlayers: number;
}

export default function RegistrationProgressBar({ registeredPlayers }: RegistrationProgressBarProps) {
  const maxPlayers = 1000;
  const percentage = Math.min((registeredPlayers / maxPlayers) * 100, 100);
  
  return (
    <div className="font-mono text-xs mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-white/70">Registration Progress</span>
        <span className="text-neon-300">{registeredPlayers} / {maxPlayers} Players</span>
      </div>
      <div className="w-full bg-black/70 border border-white/30 h-4 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-neon-300"
          style={{ width: `${percentage}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-[10px] font-bold text-white drop-shadow-lg">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
} 