"use client";

import { formatEther } from 'viem';

interface CasinoTabProps {
  // Contract balance
  climbContractBalance: bigint | undefined;
  
  // Deposit/Withdraw amounts
  climbDepositAmount: string;
  setClimbDepositAmount: (amount: string) => void;
  climbWithdrawAmount: string;
  setClimbWithdrawAmount: (amount: string) => void;
  
  // Settings
  newMaxDeposit: string;
  setNewMaxDeposit: (amount: string) => void;
  newPointsContract: string;
  setNewPointsContract: (address: string) => void;
  pointsWithdrawable: boolean;
  setPointsWithdrawable: (withdrawable: boolean) => void;
  newOwner: string;
  setNewOwner: (owner: string) => void;
  
  // Current settings
  currentMaxDeposit: bigint | undefined;
  currentPointsContract: string | undefined;
  currentPointsWithdrawable: boolean | undefined;
  currentOwner: string | undefined;
  
  // Handlers
  handleClimbDeposit: () => Promise<void>;
  handleClimbWithdraw: () => Promise<void>;
  handleSetMaxDeposit: () => Promise<void>;
  handleSetPointsContract: () => Promise<void>;
  handleSetPointsWithdrawable: () => Promise<void>;
  handleTransferOwnership: () => Promise<void>;
  handleRenounceOwnership: () => Promise<void>;
  refetchClimbBalance: () => void;
  
  // Loading states
  isPending: boolean;
  txLoading: boolean;
  activeFunction: string | null;
}

export default function CasinoTab({
  climbContractBalance,
  climbDepositAmount,
  setClimbDepositAmount,
  climbWithdrawAmount,
  setClimbWithdrawAmount,
  newMaxDeposit,
  setNewMaxDeposit,
  newPointsContract,
  setNewPointsContract,
  pointsWithdrawable,
  setPointsWithdrawable,
  newOwner,
  setNewOwner,
  currentMaxDeposit,
  currentPointsContract,
  currentPointsWithdrawable,
  currentOwner,
  handleClimbDeposit,
  handleClimbWithdraw,
  handleSetMaxDeposit,
  handleSetPointsContract,
  handleSetPointsWithdrawable,
  handleTransferOwnership,
  handleRenounceOwnership,
  refetchClimbBalance,
  isPending,
  txLoading,
  activeFunction
}: CasinoTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Climb Game Controls */}
      <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
        <div className="text-white/70 mb-3 uppercase tracking-wider">Climb Game</div>
        
        <div className="space-y-4">
          {/* Contract Balance Display */}
          <div>
            <label className="block text-white/60 mb-1">Contract Balance</label>
            <div className="w-full bg-black border border-white/30 px-3 py-2 text-white">
              {climbContractBalance ? formatEther(climbContractBalance) : '0'} SONIC
            </div>
          </div>
          
          {/* Deposit Section */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Deposit Funds</div>
            <div className="flex gap-2">
              <input 
                type="number"
                step="0.000000000000000001"
                value={climbDepositAmount}
                onChange={(e) => setClimbDepositAmount(e.target.value)}
                className="flex-1 bg-black border border-white/30 px-3 py-2 text-white"
                placeholder="Amount in SONIC..."
              />
              <button 
                onClick={handleClimbDeposit}
                disabled={!climbDepositAmount || isPending || txLoading || activeFunction !== null}
                className={`
                  px-4 font-mono text-white bg-transparent 
                  border border-white/50 text-center
                  focus:outline-none hover:bg-white/10
                  ${!climbDepositAmount ? 'opacity-50 cursor-not-allowed' : ''}
                  ${activeFunction === 'depositClimb' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'depositClimb' ? 'Processing...' : 'Deposit'}
              </button>
            </div>
          </div>
          
          {/* Withdraw Section */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Withdraw Funds</div>
            <div className="flex gap-2">
              <input 
                type="number"
                step="0.000000000000000001"
                value={climbWithdrawAmount}
                onChange={(e) => setClimbWithdrawAmount(e.target.value)}
                className="flex-1 bg-black border border-white/30 px-3 py-2 text-white"
                placeholder="Amount in SONIC..."
              />
              <button 
                onClick={handleClimbWithdraw}
                disabled={!climbWithdrawAmount || isPending || txLoading || activeFunction !== null}
                className={`
                  px-4 font-mono text-white bg-transparent 
                  border border-white/50 text-center
                  focus:outline-none hover:bg-white/10
                  ${!climbWithdrawAmount ? 'opacity-50 cursor-not-allowed' : ''}
                  ${activeFunction === 'withdrawClimb' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'withdrawClimb' ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Quick Actions</div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setClimbDepositAmount('1')}
                className="font-mono text-white bg-transparent border border-white/30 py-2 px-3 text-center
                         focus:outline-none hover:bg-white/10"
              >
                Deposit 1 SONIC
              </button>
              <button 
                onClick={() => setClimbDepositAmount('10')}
                className="font-mono text-white bg-transparent border border-white/30 py-2 px-3 text-center
                         focus:outline-none hover:bg-white/10"
              >
                Deposit 10 SONIC
              </button>
              <button 
                onClick={() => climbContractBalance && setClimbWithdrawAmount(formatEther(climbContractBalance))}
                className="font-mono text-white bg-transparent border border-white/30 py-2 px-3 text-center
                         focus:outline-none hover:bg-white/10"
              >
                Withdraw All
              </button>
              <button 
                onClick={() => refetchClimbBalance()}
                className="font-mono text-white bg-transparent border border-white/30 py-2 px-3 text-center
                         focus:outline-none hover:bg-white/10"
              >
                Refresh Balance
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Climb Contract Settings */}
      <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
        <div className="text-white/70 mb-3 uppercase tracking-wider">Contract Settings (Owner Only)</div>
        
        <div className="space-y-4">
          {/* Current Settings Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs col-span-full">Current Settings</div>
            
            <div>
              <label className="block text-white/60 mb-1">Max Deposit</label>
              <div className="bg-black border border-white/30 px-3 py-2 text-white">
                {currentMaxDeposit ? formatEther(currentMaxDeposit) : '0'} SONIC
              </div>
            </div>
            
            <div>
              <label className="block text-white/60 mb-1">Points Contract</label>
              <div className="bg-black border border-white/30 px-3 py-2 text-white text-xs">
                {currentPointsContract || 'Not Set'}
              </div>
            </div>
            
            <div>
              <label className="block text-white/60 mb-1">Points Withdrawable</label>
              <div className="bg-black border border-white/30 px-3 py-2 text-white">
                {currentPointsWithdrawable ? 'Yes' : 'No'}
              </div>
            </div>
            
            <div>
              <label className="block text-white/60 mb-1">Contract Owner</label>
              <div className="bg-black border border-white/30 px-3 py-2 text-white text-xs">
                {currentOwner || 'Loading...'}
              </div>
            </div>
          </div>
          
          {/* Set Max Deposit */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Set Max Deposit</div>
            <div className="flex gap-2">
              <input 
                type="number"
                step="0.000000000000000001"
                value={newMaxDeposit}
                onChange={(e) => setNewMaxDeposit(e.target.value)}
                className="flex-1 bg-black border border-white/30 px-3 py-2 text-white"
                placeholder="Max deposit in SONIC..."
              />
              <button 
                onClick={handleSetMaxDeposit}
                disabled={!newMaxDeposit || isPending || txLoading || activeFunction !== null}
                className={`
                  px-4 font-mono text-white bg-transparent 
                  border border-white/50 text-center
                  focus:outline-none hover:bg-white/10
                  ${!newMaxDeposit ? 'opacity-50 cursor-not-allowed' : ''}
                  ${activeFunction === 'setMaxDeposit' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'setMaxDeposit' ? 'Processing...' : 'Set Max Deposit'}
              </button>
            </div>
          </div>
          
          {/* Set Points Contract */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Set Points Contract</div>
            <div className="flex gap-2">
              <input 
                type="text"
                value={newPointsContract}
                onChange={(e) => setNewPointsContract(e.target.value)}
                className="flex-1 bg-black border border-white/30 px-3 py-2 text-white"
                placeholder="0x... Points contract address"
              />
              <button 
                onClick={handleSetPointsContract}
                disabled={!newPointsContract || isPending || txLoading || activeFunction !== null}
                className={`
                  px-4 font-mono text-white bg-transparent 
                  border border-white/50 text-center
                  focus:outline-none hover:bg-white/10
                  ${!newPointsContract ? 'opacity-50 cursor-not-allowed' : ''}
                  ${activeFunction === 'setPointsContract' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'setPointsContract' ? 'Processing...' : 'Set Contract'}
              </button>
            </div>
          </div>
          
          {/* Points Withdrawable Toggle */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Points Withdrawable Setting</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={pointsWithdrawable}
                  onChange={(e) => setPointsWithdrawable(e.target.checked)}
                  className="form-checkbox bg-black border-white/30 text-white rounded-sm"
                />
                <span className="text-white/80">Allow points withdrawals</span>
              </div>
              <button 
                onClick={handleSetPointsWithdrawable}
                disabled={isPending || txLoading || activeFunction !== null}
                className={`
                  px-4 font-mono text-white bg-transparent 
                  border border-white/50 py-2 text-center
                  focus:outline-none hover:bg-white/10
                  ${activeFunction === 'setPointsWithdrawable' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'setPointsWithdrawable' ? 'Processing...' : 'Update Setting'}
              </button>
            </div>
          </div>
          
          {/* Ownership Functions */}
          <div className="border border-red-500/30 p-4 bg-red-900/10">
            <div className="text-red-400 mb-3 uppercase tracking-wider text-xs">⚠️ Ownership Functions</div>
            
            {/* Transfer Ownership */}
            <div className="mb-4">
              <div className="text-white/70 mb-2 text-xs">Transfer Ownership</div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="flex-1 bg-black border border-red-500/30 px-3 py-2 text-white"
                  placeholder="0x... New owner address"
                />
                <button 
                  onClick={handleTransferOwnership}
                  disabled={!newOwner || isPending || txLoading || activeFunction !== null}
                  className={`
                    px-4 font-mono text-white bg-transparent 
                    border border-red-500 text-center
                    focus:outline-none hover:bg-red-900/20
                    ${!newOwner ? 'opacity-50 cursor-not-allowed' : ''}
                    ${activeFunction === 'transferOwnership' ? 'bg-red-900/20' : ''}
                    ${(isPending || txLoading) ? 'animate-pulse' : ''}
                  `}
                >
                  {activeFunction === 'transferOwnership' ? 'Processing...' : 'Transfer'}
                </button>
              </div>
            </div>
            
            {/* Renounce Ownership */}
            <div>
              <div className="text-white/70 mb-2 text-xs">Renounce Ownership (Irreversible!)</div>
              <button 
                onClick={handleRenounceOwnership}
                disabled={isPending || txLoading || activeFunction !== null}
                className={`
                  w-full font-mono text-white bg-transparent 
                  border border-red-500 py-2 px-3 text-center
                  focus:outline-none hover:bg-red-900/20
                  ${activeFunction === 'renounceOwnership' ? 'bg-red-900/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'renounceOwnership' ? 'Processing...' : 'Renounce Ownership'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Casino Instructions */}
      <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
        <div className="text-white/70 mb-3 uppercase tracking-wider">Casino Management Instructions</div>
        <ol className="list-decimal list-inside space-y-2 text-white/80">
          <li>Monitor the Climb contract balance regularly</li>
          <li>Deposit funds to ensure players can receive payouts</li>
          <li>Withdraw excess funds to secure profits</li>
          <li>Use quick actions for common deposit amounts</li>
          <li>Always maintain sufficient balance for player withdrawals</li>
          <li>Configure max deposit limits to control risk exposure</li>
          <li>Update points contract address if needed</li>
          <li>Toggle points withdrawability based on game economy needs</li>
          <li>⚠️ Use ownership functions with extreme caution</li>
        </ol>
      </div>
    </div>
  );
} 