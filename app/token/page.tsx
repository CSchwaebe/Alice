"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PointsABI } from '@/app/abis/PointsABI';
import MatrixRain from "@/components/effects/GlitchTextBackground";
import { useEffect, useState, useRef } from 'react';
import { ConnectButton } from '@/components/walletconnect/ConnectButton';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { parseEther, formatEther } from 'ethers';
import ViewportDrawer from '@/components/ui/ViewportDrawer';
import DepositDrawer from '@/components/ui/DepositDrawer';
import { addToast } from '@heroui/toast';

// Copy to clipboard function
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    addToast({
      title: 'Copied!',
      description: 'Text copied to clipboard',
      color: 'success',
      timeout: 1000,
    });
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    addToast({
      title: 'Failed to copy',
      description: 'Please try again',
      color: 'danger',
      timeout: 1000,
    });
    return false;
  }
};

// Add truncateAddress helper function at the top level
const truncateAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function Points() {
  const [referralAddressToCheck, setReferralAddressToCheck] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [newReferralCode, setNewReferralCode] = useState('');
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [cashOutAmount, setCashOutAmount] = useState('');
  const [showCashOutDialog, setShowCashOutDialog] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { address: connectedAddress } = useAccount();
  const [txStatus, setTxStatus] = useState<'none' | 'pending' | 'success' | 'error'>('none');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [userRank, setUserRank] = useState<number | null>(null);
  const PAGE_SIZE = 10;
  const MAX_LEADERBOARD_SIZE = 100;

  // Get total points issued
  const { data: totalPointsIssued, refetch: refetchTotalPoints } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
    abi: PointsABI,
    functionName: 'totalPointsIssued',
    args: [],
  }) as { data: bigint | undefined, refetch: () => void };

  // Get max points
  const { data: maxPoints } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
    abi: PointsABI,
    functionName: 'MAX_POINTS',
    args: [],
  }) as { data: bigint | undefined };

  // Get points for connected address (includes total and withdrawable)
  const { data: pointsData, refetch: refetchPoints } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
    abi: PointsABI,
    functionName: 'getPoints',
    args: [connectedAddress || '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: connectedAddress !== undefined
    }
  }) as { data: [bigint, bigint] | undefined, refetch: () => void };

  // Get referral code for connected address
  const { data: currentReferralCode, refetch: refetchReferralCode } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
    abi: PointsABI,
    functionName: 'addressToReferralCode',
    args: [connectedAddress || '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: connectedAddress !== undefined
    }
  }) as { data: string | undefined, refetch: () => void };

  const { writeContract, isPending: isSettingCode, data: hash } = useWriteContract();

  const { isLoading: isWaitingTx, isSuccess: isTxSuccess, isError: isTxError } = useWaitForTransactionReceipt({
    hash,
  });

  // Glitch effect every few seconds
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  const handleReferralAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const validateRefCode = (code: string) => {
    if (code.length > 20) {
      setErrorMessage('Referral code must be 20 characters or less');
      return false;
    }
    if (!/^[a-zA-Z0-9\-_]+$/.test(code)) {
      setErrorMessage('Referral code can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleRefCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters, numbers, hyphens, and underscores
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\-_]/g, '');
    setNewReferralCode(sanitizedValue);
    if (sanitizedValue) {
      validateRefCode(sanitizedValue);
    } else {
      setErrorMessage('');
    }
  };

  const handleClearRefCode = () => {
    setNewReferralCode('');
    setErrorMessage('');
  };

  const handleSetReferralCode = async () => {
    if (!newReferralCode) return;
    
    // Validate referral code format
    if (!/^[a-zA-Z0-9_-]{1,20}$/.test(newReferralCode)) {
      setErrorMessage('Referral code can only contain letters, numbers, hyphens, and underscores (max 20 characters)');
      return;
    }
    
    try {
      setTxStatus('pending');
      setErrorMessage('');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
        abi: PointsABI,
        functionName: 'registerReferralCode',
        args: [newReferralCode],
      });
    } catch (error: any) {
      console.error('Set referral code error:', error);
      setTxStatus('error');
      // Handle specific contract errors
      if (error.message?.includes('ReferralCodeTaken')) {
        setErrorMessage('This referral code is already taken');
      } else if (error.message?.includes('ReferralCodeTooLong')) {
        setErrorMessage('Referral code is too long');
      } else if (error.message?.includes('InvalidReferralCode')) {
        setErrorMessage('Invalid referral code format');
      } else {
        setErrorMessage('Failed to set referral code. Please try again.');
      }
    }
  };

  const handleCashOut = async () => {
    if (withdrawablePoints <= 0) return;
    
    try {
      setTxStatus('pending');
      setErrorMessage('');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
        abi: PointsABI,
        functionName: 'cashOutReferralPoints',
        args: [withdrawablePoints],
      });
    } catch (error: any) {
      console.error('Cash out error:', error);
      setTxStatus('error');
      setErrorMessage('Failed to cash out ALICE. Please try again.');
    }
  };

  // Watch for transaction success/error
  useEffect(() => {
    if (isTxSuccess) {
      setTxStatus('success');
      refetchPoints();
      refetchReferralCode();
      refetchTotalPoints();
      setCashOutAmount('');
    } else if (isTxError) {
      setTxStatus('error');
    }
  }, [isTxSuccess, isTxError, refetchPoints, refetchReferralCode, refetchTotalPoints]);

  // Extract total and withdrawable points
  const [totalPoints, withdrawablePoints] = pointsData || [BigInt(0), BigInt(0)];

  // Get MIN_DEPOSIT
  const { data: minDeposit } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
    abi: PointsABI,
    functionName: 'MIN_DEPOSIT',
    args: [],
  }) as { data: bigint | undefined };

  // Get POINTS_PER_S
  const { data: pointsPerS } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
    abi: PointsABI,
    functionName: 'POINTS_PER_S',
    args: [],
  }) as { data: bigint | undefined };

  const [depositAmount, setDepositAmount] = useState('');
  const [depositError, setDepositError] = useState('');

  const handleDeposit = async (sonicAmount: number) => {    
    try {
      setTxStatus('pending');
      setDepositError('');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
        abi: PointsABI,
        functionName: 'deposit',
        value: parseEther(sonicAmount.toString()),
      });
      setShowDepositDialog(false);
    } catch (error: any) {
      console.error('Deposit error:', error);
      setTxStatus('error');
      if (error.message?.includes('InvalidDeposit')) {
        setDepositError(`Minimum deposit is ${formatEther(minDeposit || BigInt(0))} SONIC`);
      } else {
        setDepositError('Failed to deposit. Please try again.');
      }
    }
  };

  // Get leaderboard data (top 100)
  const { data: leaderboardData, refetch: refetchLeaderboard } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
    abi: PointsABI,
    functionName: 'getLeaderboard',
    args: [],
  }) as { data: [string[], bigint[], bigint[]] | undefined, refetch: () => void };

  // Get total address count for pagination
  const { data: totalAddresses } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_POINTS as `0x${string}`,
    abi: PointsABI,
    functionName: 'getAddressCount',
    args: [],
  }) as { data: bigint | undefined };

  // Find user's rank when connected
  useEffect(() => {
    if (!connectedAddress || !leaderboardData) return;
    
    const [addresses, balances] = leaderboardData;
    const userIndex = addresses.findIndex(addr => addr.toLowerCase() === connectedAddress.toLowerCase());
    if (userIndex !== -1) {
      setUserRank(userIndex + 1);
    }
  }, [connectedAddress, leaderboardData]);

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center relative overflow-hidden" ref={containerRef}>
      <MatrixRain />
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-b from-transparent to-transparent bg-[length:100%_2px] bg-repeat-y mix-blend-overlay opacity-10" 
           style={{ backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.1) 50%, transparent 50%)' }}></div>
      
      {/* Cross-lines */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute top-0 left-[10%] w-px h-full bg-content-1"></div>
        <div className="absolute top-0 left-[30%] w-px h-full bg-content-2"></div>
        <div className="absolute top-0 left-[50%] w-px h-full bg-content-3"></div>
        <div className="absolute top-0 left-[70%] w-px h-full bg-content-2"></div>
        <div className="absolute top-0 left-[90%] w-px h-full bg-content-1"></div>
        
        <div className="absolute left-0 top-[10%] w-full h-px bg-content-1"></div>
        <div className="absolute left-0 top-[30%] w-full h-px bg-content-2"></div>
        <div className="absolute left-0 top-[50%] w-full h-px bg-content-3"></div>
        <div className="absolute left-0 top-[70%] w-full h-px bg-content-2"></div>
        <div className="absolute left-0 top-[90%] w-full h-px bg-content-1"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 flex flex-col">
        {/* Top interface HUD */}
        <div className="flex items-center justify-between w-full mb-4 px-2">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-foreground animate-pulse"></div>
            <div className="ml-2 h-px w-10 bg-content-4"></div>
          </div>
          
          <div className="font-mono text-xs text-foreground/70 tracking-widest text-center">
            |..::ALICE::..|
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 h-px w-10 bg-content-4"></div>
            <div className="h-2 w-2 rounded-full bg-foreground animate-pulse"></div>
          </div>
        </div>

        {/* Points Distribution Panel */}
        <div className="font-mono bg-background border-2 border-foreground p-6 text-center mb-6
                       shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div className="text-foreground/70 mb-4 uppercase tracking-widest">Total ALICE Distributed</div>
          <div className="flex justify-center items-center pb-4">
            <div className="text-4xl md:text-5xl font-bold text-foreground tracking-wider">
              {totalPointsIssued ? Number(totalPointsIssued).toLocaleString() : '---'}
            </div>
          </div>
    
          
          <div className="mt-3 w-full bg-content-2 h-2 relative overflow-hidden border border-content-4">
            <div 
              className="absolute top-0 left-0 h-full bg-foreground transition-all duration-500"
              style={{
                width: `${totalPointsIssued && maxPoints ? 
                  (Number(totalPointsIssued) / Number(maxPoints) * 100) : 0}%`
              }}
            ></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-gradient-to-r from-transparent via-content-3/20 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Points Display Panel */}
        <div className="font-mono bg-background border border-border p-6 text-center mb-6">
          {!connectedAddress ? (
            <>
              <div className="text-foreground/70 mb-8">Connect wallet to view your ALICE and ref code</div>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </>
          ) : (
            <>
              <div className="text-foreground/70 mb-6 uppercase tracking-widest flex items-center">
                <div className="h-px w-4 bg-content-3 mr-2"></div>
                Your ALICE
                <div className="h-px flex-grow bg-content-3 ml-2"></div>
              </div>
              
              {pointsData && (
                <>
                  {/* Points Display Grid */}
                  <div className="space-y-4">
                    {/* Points List */}
                    <div className="border border-content-3 bg-background/30">
                      {/* Total Points Row */}
                      <div className="flex items-center justify-between p-4 border-b border-content-3">
                        <div className="text-sm text-foreground/70 font-mono uppercase tracking-wider">Total</div>
                        <div className="text-xl font-bold text-foreground font-mono">{totalPoints.toLocaleString()}</div>
                      </div>
                      {/* Referral Points Row */}
                      <div className="flex items-center justify-between p-4">
                        <div className="text-sm text-foreground/70 font-mono uppercase tracking-wider">From Referrals</div>
                        <div className="text-xl font-bold text-foreground font-mono">{withdrawablePoints.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {/* Cash Out Button */}
                      <button
                        onClick={() => setShowCashOutDialog(true)}
                        disabled={isSettingCode || isWaitingTx || withdrawablePoints <= 0}
                        className="w-full font-mono text-foreground bg-transparent 
                                 border border-content-3 py-3 px-4
                                 focus:outline-none hover:bg-white/10 hover:border-content-4
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors duration-300"
                      >
                        {isSettingCode || isWaitingTx ? 'PROCESSING...' : 'CASH OUT'}
                      </button>

                      {/* Buy ALICE Button */}
                      <button
                        onClick={() => setShowDepositDialog(true)}
                        disabled={isSettingCode || isWaitingTx}
                        className="w-full font-mono text-foreground bg-transparent 
                                 border border-content-3 py-3 px-4
                                 focus:outline-none hover:bg-white/10 hover:border-content-4
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors duration-300"
                      >
                        BUY ALICE
                      </button>
                    </div>
                  </div>

                  {/* Cash Out Confirmation Dialog */}
                  <ViewportDrawer
                    isOpen={showCashOutDialog}
                    onClose={() => setShowCashOutDialog(false)}
                    onConfirmClick={handleCashOut}
                    title="Cash Out"
                    description={`${withdrawablePoints.toLocaleString()} Referral ALICE = ${(Number(withdrawablePoints) / 75).toFixed(2)} SONIC`}
                    confirmText="Cash Out"
                    cancelText="Cancel"
                  />

                  {/* Deposit Dialog */}
                  <DepositDrawer
                    isOpen={showDepositDialog}
                    onClose={() => {
                      setShowDepositDialog(false);
                      setDepositError('');
                    }}
                    onConfirmClick={handleDeposit}
                    error={depositError}
                  />

                  {/* Transaction status */}
                  {(isSettingCode || isWaitingTx) && (
                    <div className="mt-4 font-mono text-xs">
                      <div className="flex justify-between text-foreground/70 mb-1">
                        <span>TX_STATUS</span>
                        <span className="animate-pulse">PENDING</span>
                      </div>
                      <div className="h-px w-full bg-content-2 mb-1">
                        <div className="h-full bg-foreground animate-[grow_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="mt-8 pt-8 border-t border-content-4">
                <div className="text-foreground/70 mb-4 uppercase tracking-widest">
                  {currentReferralCode ? "Your Referral Code" : "Create Your Referral Code"}
                </div>
                
                {currentReferralCode && (
                  <>
                    <div className="flex justify-center items-center gap-2 pb-4">
                      <div className="text-2xl font-bold text-foreground tracking-wider">
                        {currentReferralCode}
                      </div>
                      <button 
                        onClick={async () => {
                          const success = await copyToClipboard(currentReferralCode);
                          if (success) {
                            setGlitchEffect(true);
                            setTimeout(() => setGlitchEffect(false), 200);
                          }
                        }}
                        className="text-foreground hover:text-foreground/70 transition-colors p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs text-foreground/50 text-center">
                      <div className="mb-2">Your Referral Link:</div>
                      <div className="flex justify-center items-center gap-2">
                        <div className="font-mono text-foreground/70 break-all">
                          {`${process.env.NEXT_PUBLIC_BASE_URL || 'https://alice-wonderland.com'}/?ref=${currentReferralCode}`}
                        </div>
                        <button 
                          onClick={async () => {
                            const success = await copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://alice-wonderland.com'}/?ref=${currentReferralCode}`);
                            if (success) {
                              setGlitchEffect(true);
                              setTimeout(() => setGlitchEffect(false), 200);
                            }
                          }}
                          className="text-foreground hover:text-foreground/70 transition-colors p-1 flex-shrink-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {!currentReferralCode && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newReferralCode}
                        onChange={handleRefCodeChange}
                        placeholder="Enter referral code (max 20 chars)"
                        className="flex-1 bg-background border border-border p-2 text-foreground 
                                 font-mono text-sm focus:outline-none focus:border-foreground"
                        maxLength={20}
                      />
                      <button
                        onClick={handleSetReferralCode}
                        disabled={isSettingCode || isWaitingTx || !newReferralCode}
                        className="font-mono text-foreground bg-transparent 
                                 border border-border py-2 px-4
                                 focus:outline-none hover:bg-white/10
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSettingCode || isWaitingTx ? 'SETTING...' : 'SET'}
                      </button>
                    </div>
                    {errorMessage && (
                      <div className="text-xs text-red-500 mt-2">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                )} 
              </div>
            </>
          )}
        </div>

        {/* Info Panel */}
        <div className="font-mono text-xs bg-background/40 border border-border
                       px-3 py-4 text-foreground/90 mb-4 backdrop-blur-sm">
          <div className="text-foreground/50 mb-3 uppercase tracking-wider">INFO:</div>
          
          <div className="space-y-3 leading-loose">
          <p>Earn ALICE and Sonic by playing games and referring users.</p>
            <p>50% of the ALICE supply will be distributed in Season 0.</p>
            <p>The token will launch when all 50,000,000 ALICE are distributed.</p>
            <p className="text-foreground/40 text-[10px] mt-2">SYSTEM NOTE: To earn referral bonuses on ALICE buys, register for a game with the code first.</p>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="font-mono bg-background/40 border border-border
                       px-3 py-4 text-foreground/90 mb-4 backdrop-blur-sm w-full">
          <div className="text-foreground/50 mb-3 uppercase tracking-wider flex items-center">
            <div className="h-px w-4 bg-content-3 mr-2"></div>
            Leaderboard
            <div className="h-px flex-grow bg-content-3 ml-2"></div>
          </div>

          {/* User's Position */}
          {connectedAddress && userRank && (
            <div className="mb-4 p-3 border border-content-3 bg-background/30">
              <div className="text-sm text-foreground/50 mb-2">Your Position</div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-foreground/70">#{userRank}</span>
                  <span className="text-foreground">{truncateAddress(connectedAddress)}</span>
                </div>
                <div className="text-foreground">
                  {pointsData ? Number(pointsData[0]).toLocaleString() : '0'} ALICE
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="overflow-x-auto text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-foreground/50 text-xs uppercase">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">Address</th>
                  <th className="text-right py-2 px-3">Total ALICE</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData?.[0].slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((address, index) => (
                  <tr key={address} 
                      className={`border-t border-content-3 
                                ${address.toLowerCase() === connectedAddress?.toLowerCase() ? 
                                'bg-foreground/5' : ''}`}>
                    <td className="py-2 px-3 text-foreground/70">
                      #{(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="py-2 px-3 text-foreground">
                      {truncateAddress(address)}
                    </td>
                    <td className="py-2 px-3 text-right text-foreground">
                      {Number(leaderboardData[1][index + ((currentPage - 1) * PAGE_SIZE)]).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {leaderboardData && (
            <div className="mt-4 flex justify-between items-center text-sm">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-content-3 disabled:opacity-50
                         disabled:cursor-not-allowed hover:bg-white/10"
              >
                Previous
              </button>
              <span className="text-foreground/70">
                Page {currentPage} of {Math.min(Math.ceil(leaderboardData[0].length / PAGE_SIZE), Math.ceil(MAX_LEADERBOARD_SIZE / PAGE_SIZE))}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= Math.min(Math.ceil(leaderboardData[0].length / PAGE_SIZE), Math.ceil(MAX_LEADERBOARD_SIZE / PAGE_SIZE))}
                className="px-3 py-1 border border-content-3 disabled:opacity-50
                         disabled:cursor-not-allowed hover:bg-white/10"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Home Button */}
        <div className="mt-4 font-mono text-foreground text-sm">
          <div className="text-xs text-foreground/50 mb-1">[SYS::COMMAND]</div>
          
          <div className="relative">
            <button 
              onClick={() => router.push('/')}
              className="w-full font-mono text-foreground bg-transparent 
                        border border-border py-3 px-3 text-left
                        focus:outline-none hover:bg-white/10"
            >
              <span className="text-foreground/70">$</span> go --home
            </button>
          </div>
        </div>

        {/* Bottom Warning/Info */}
        <div className="mt-3 text-xs text-foreground/50 flex items-center">
          <div className="h-px flex-grow bg-content-2"></div>
          <div className="mx-2 uppercase font-mono">Every Point Counts</div>
          <div className="h-px flex-grow bg-content-2"></div>
        </div>
      </div>
    </div>
  );
}
