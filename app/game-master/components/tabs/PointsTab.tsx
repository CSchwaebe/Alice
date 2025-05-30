"use client";

import { formatEther } from 'viem';

interface PointsTabProps {
  // Contract balance
  contractBalance: bigint | undefined;
  
  // Deposit amount
  pointsDepositAmount: string;
  setPointsDepositAmount: (amount: string) => void;
  
  // Handlers
  handlePointsDeposit: () => Promise<void>;
  handlePointsWithdraw: () => Promise<void>;
  refetchPointsBalance: () => void;
  
  // Loading states
  isPending: boolean;
  txLoading: boolean;
  activeFunction: string | null;
}

export default function PointsTab({
  contractBalance,
  pointsDepositAmount,
  setPointsDepositAmount,
  handlePointsDeposit,
  handlePointsWithdraw,
  refetchPointsBalance,
  isPending,
  txLoading,
  activeFunction
}: PointsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Points Contract Balance */}
      <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
        <div className="text-white/70 mb-3 uppercase tracking-wider">Points Contract</div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/60 mb-1">Contract Balance</label>
            <div className="w-full bg-black border border-white/30 px-3 py-2 text-white">
              {contractBalance ? formatEther(contractBalance) : '0'} SONIC
            </div>
          </div>
          
          {/* Deposit Section */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Deposit for Cashouts</div>
            <div className="flex gap-2">
              <input 
                type="number"
                step="0.000000000000000001"
                value={pointsDepositAmount}
                onChange={(e) => setPointsDepositAmount(e.target.value)}
                className="flex-1 bg-black border border-white/30 px-3 py-2 text-white"
                placeholder="Amount in SONIC..."
              />
              <button 
                onClick={handlePointsDeposit}
                disabled={!pointsDepositAmount || isPending || txLoading || activeFunction !== null}
                className={`
                  px-4 font-mono text-white bg-transparent 
                  border border-white/50 text-center
                  focus:outline-none hover:bg-white/10
                  ${!pointsDepositAmount ? 'opacity-50 cursor-not-allowed' : ''}
                  ${activeFunction === 'depositPoints' ? 'bg-white/20' : ''}
                  ${(isPending || txLoading) ? 'animate-pulse' : ''}
                `}
              >
                {activeFunction === 'depositPoints' ? 'Processing...' : 'Deposit'}
              </button>
            </div>
          </div>
          
          {/* Withdraw Section */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Withdraw Balance</div>
            <button 
              onClick={handlePointsWithdraw}
              disabled={isPending || txLoading || activeFunction !== null}
              className={`
                w-full font-mono text-white bg-transparent 
                border border-white/50 py-2 px-3 text-center
                focus:outline-none hover:bg-white/10
                ${activeFunction === 'withdrawPoints' ? 'bg-white/20' : ''}
                ${(isPending || txLoading) ? 'animate-pulse' : ''}
              `}
            >
              {activeFunction === 'withdrawPoints' ? 'Processing...' : 'Withdraw All Funds'}
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="border border-white/10 p-4 bg-white/5">
            <div className="text-white/70 mb-3 uppercase tracking-wider text-xs">Quick Actions</div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setPointsDepositAmount('1')}
                className="font-mono text-white bg-transparent border border-white/30 py-2 px-3 text-center
                         focus:outline-none hover:bg-white/10"
              >
                Deposit 1 SONIC
              </button>
              <button 
                onClick={() => setPointsDepositAmount('10')}
                className="font-mono text-white bg-transparent border border-white/30 py-2 px-3 text-center
                         focus:outline-none hover:bg-white/10"
              >
                Deposit 10 SONIC
              </button>
              <button 
                onClick={() => setPointsDepositAmount('100')}
                className="font-mono text-white bg-transparent border border-white/30 py-2 px-3 text-center
                         focus:outline-none hover:bg-white/10"
              >
                Deposit 100 SONIC
              </button>
              <button 
                onClick={() => refetchPointsBalance()}
                className="font-mono text-white bg-transparent border border-white/30 py-2 px-3 text-center
                         focus:outline-none hover:bg-white/10"
              >
                Refresh Balance
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Points Instructions */}
      <div className="font-mono text-xs bg-black border border-white/20 p-4 text-white/90">
        <div className="text-white/70 mb-3 uppercase tracking-wider">Points Management Instructions</div>
        <ol className="list-decimal list-inside space-y-2 text-white/80">
          <li>Deposit funds to ensure players can cash out referral points</li>
          <li>Monitor the contract balance regularly</li>
          <li>Withdraw excess funds to secure profits</li>
          <li>Use quick actions for common deposit amounts</li>
          <li>Always maintain sufficient balance for player cashouts</li>
        </ol>
      </div>
    </div>
  );
} 