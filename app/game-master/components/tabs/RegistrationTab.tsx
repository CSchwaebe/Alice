"use client";

import RegistrationProgressBar from '../shared/RegistrationProgressBar';

interface RegistrationTabProps {
  // Game registration state
  gameName: string;
  setGameName: (name: string) => void;
  gameAddress: string;
  setGameAddress: (address: string) => void;
  
  // Registration settings
  newRegistrationFee: string;
  setNewRegistrationFee: (fee: string) => void;
  newMaxPlayers: string;
  setNewMaxPlayers: (max: string) => void;
  
  // Status
  registeredPlayers: number;
  isRegistrationClosed: boolean;
  
  // Handlers
  handleRegisterGame: () => Promise<void>;
  handleSetRegistrationFee: () => Promise<void>;
  handleCloseRegistration: () => Promise<void>;
  handleWithdraw: () => Promise<void>;
  handleSetMaxPlayers: () => Promise<void>;
  
  // Loading states
  isPending: boolean;
  txLoading: boolean;
  activeFunction: string | null;
}

export default function RegistrationTab({
  gameName,
  setGameName,
  gameAddress,
  setGameAddress,
  newRegistrationFee,
  setNewRegistrationFee,
  newMaxPlayers,
  setNewMaxPlayers,
  registeredPlayers,
  isRegistrationClosed,
  handleRegisterGame,
  handleSetRegistrationFee,
  handleCloseRegistration,
  handleWithdraw,
  handleSetMaxPlayers,
  isPending,
  txLoading,
  activeFunction
}: RegistrationTabProps) {
  return (
    <>
      {/* Registration Status */}
      <div className="font-mono text-xs mb-6 flex items-center justify-between bg-black border border-white/20 p-4">
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-2 ${isRegistrationClosed ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className="text-white/70 uppercase tracking-wider">Registration Status:</span>
        </div>
        <span className={`${isRegistrationClosed ? 'text-red-400' : 'text-green-400'}`}>
          {isRegistrationClosed ? 'CLOSED' : 'OPEN'}
        </span>
      </div>
      
      {/* Player Registration Progress Bar */}
      <RegistrationProgressBar registeredPlayers={registeredPlayers} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Register Game */}
        <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
          <div className="text-white/70 mb-3 uppercase tracking-wider">Register Game</div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 mb-1">Game Name</label>
              <input 
                type="text" 
                value={gameName} 
                onChange={(e) => setGameName(e.target.value)}
                className="w-full bg-black border border-white/30 px-3 py-2 text-white"
                placeholder="e.g. ALICE"
              />
            </div>
            
            <div>
              <label className="block text-white/60 mb-1">Game Address</label>
              <input 
                type="text" 
                value={gameAddress} 
                onChange={(e) => setGameAddress(e.target.value)}
                className="w-full bg-black border border-white/30 px-3 py-2 text-white"
                placeholder="0x..."
              />
            </div>
            
            <button 
              onClick={handleRegisterGame}
              disabled={isPending || txLoading || activeFunction !== null}
              className={`
                w-full font-mono text-white bg-transparent 
                border border-white/50 py-2 px-3 text-center
                focus:outline-none hover:bg-white/10
                ${activeFunction === 'registerGame' ? 'bg-white/20' : ''}
                ${(isPending || txLoading) ? 'animate-pulse' : ''}
              `}
            >
              {activeFunction === 'registerGame' ? 'Processing...' : 'Register Game'}
            </button>
          </div>
        </div>

        {/* ALICE Controls */}
        <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
          <div className="text-white/70 mb-3 uppercase tracking-wider">ALICE Controls</div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 mb-1">New Registration Fee (SONIC)</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  step="0.000000000000000001"
                  value={newRegistrationFee}
                  onChange={(e) => setNewRegistrationFee(e.target.value)}
                  className="flex-1 bg-black border border-white/30 px-3 py-2 text-white"
                  placeholder="0.1"
                />
                <button 
                  onClick={handleSetRegistrationFee}
                  disabled={isPending || txLoading || activeFunction !== null}
                  className={`
                    px-4 font-mono text-white bg-transparent 
                    border border-white/50 text-center
                    focus:outline-none hover:bg-white/10
                    ${activeFunction === 'setRegistrationFee' ? 'bg-white/20' : ''}
                    ${(isPending || txLoading) ? 'animate-pulse' : ''}
                  `}
                >
                  {activeFunction === 'setRegistrationFee' ? '...' : 'Set'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleCloseRegistration}
                disabled={isPending || txLoading || activeFunction !== null}
                className={`
                  font-mono text-white bg-transparent 
                  border border-white/50 py-2 px-3 text-center
                  focus:outline-none hover:bg-white/10
                  ${activeFunction === 'toggleRegistration' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'toggleRegistration' ? 'Processing...' : 'Toggle Registration'}
              </button>

              <button 
                onClick={handleWithdraw}
                disabled={isPending || txLoading || activeFunction !== null}
                className={`
                  font-mono text-white bg-transparent 
                  border border-white/50 py-2 px-3 text-center
                  focus:outline-none hover:bg-white/10
                  ${activeFunction === 'withdraw' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'withdraw' ? 'Processing...' : 'Withdraw Funds'}
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-white/60 mb-1">Max Players</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={newMaxPlayers}
                  onChange={(e) => setNewMaxPlayers(e.target.value)}
                  className="flex-1 bg-black border border-white/30 px-3 py-2 text-white"
                  placeholder="Enter max players..."
                />
                <button 
                  onClick={handleSetMaxPlayers}
                  disabled={!newMaxPlayers || isPending || txLoading || activeFunction !== null}
                  className={`
                    px-4 font-mono text-white bg-transparent 
                    border border-white/50 text-center
                    focus:outline-none hover:bg-white/10
                    ${!newMaxPlayers ? 'opacity-50 cursor-not-allowed' : ''}
                    ${activeFunction === 'setMaxPlayers' ? 'bg-white/20' : ''}
                    ${(isPending || txLoading) ? 'animate-pulse' : ''}
                  `}
                >
                  {activeFunction === 'setMaxPlayers' ? '...' : 'Set'}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90 mt-6">
            <div className="text-white/70 mb-3 uppercase tracking-wider">Registration Instructions</div>
            <ol className="list-decimal list-inside space-y-2 text-white/80">
              <li>Make sure all games are registered, should happen on contract deployment</li>
              <li>Manually close registration</li>
              <li>Register players with the game master contract</li>
              <li>Make sure to withdraw funds</li>
              <li>Make sure to clear firebase chats</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
} 