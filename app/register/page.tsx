"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { formatEther } from 'viem';
import MatrixRain from "@/components/effects/GlitchTextBackground";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import GameStateRedirect from '@/components/auth/GameStateRedirect';

export default function RegisterWithGuard() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [manualRefCode, setManualRefCode] = useState('');
  const [refCodeError, setRefCodeError] = useState('');
  const { address, isConnected } = useAccount();
  const containerRef = useRef<HTMLDivElement>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [interfaceReady, setInterfaceReady] = useState(false);
  const [txStatus, setTxStatus] = useState<'none' | 'pending' | 'success' | 'error'>('none');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Get player info from contract
  const { data: playerInfo, refetch: refetchPlayerInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getPlayerInfo',
    args: [address],
    query: {
      enabled: isConnected && !!address
    }
  }) as { data: [string, bigint, boolean, number, bigint] | undefined, refetch: () => void };

  // Get registration fee from contract
  const { data: registrationFee } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'registrationFee',
    args: [],
    query: {
      enabled: true
    }
  }) as { data: bigint | undefined };

  // Total player count
  const { data: playerCount, refetch: refetchPlayerCount } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'getPlayerCount',
    args: [],
    query: {
      enabled: true
    }
  }) as { data: bigint | undefined, refetch: () => void };

  // Max players
  const { data: maxPlayers } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'maxPlayers',
    args: [],
    query: {
      enabled: true
    }
  }) as { data: bigint | undefined };

  // Get registration status from contract
  const { data: registrationClosed } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: GameMasterABI,
    functionName: 'registrationClosed',
    args: [],
    query: {
      enabled: true
    }
  }) as { data: boolean | undefined };

  const { writeContract, isPending: isRegistering, data: hash } = useWriteContract();

  const { isLoading: isWaitingTx, isSuccess: isTxSuccess, isError: isTxError } = useWaitForTransactionReceipt({
    hash,
  });

  // Extract values from playerInfo
  const [gameName, gameId, isActive, gameState, playerNumber] = playerInfo || ['', BigInt(0), false, 0, BigInt(0)];
  const isRegistered = isActive;

  // Add debug logging
  useEffect(() => {
    console.log('Registration Status:', {
      playerInfo,
      gameName,
      gameId: gameId.toString(),
      isActive,
      gameState,
      playerNumber: playerNumber.toString(),
      isRegistered
    });
  }, [playerInfo, gameName, gameId, isActive, gameState, playerNumber, isRegistered]);

  // Format registration fee for display
  const formattedFee = registrationFee ? formatEther(registrationFee) : '...';

  // Calculate prize pool and protocol fee (5/6 and 1/6)
  const calculateFees = () => {
    if (!registrationFee) return { prizePool: '...', protocolFee: '...' };
    
    const feeValue = Number(formatEther(registrationFee));
    const prizePool = Math.round(feeValue * 5 / 6).toString();
    const protocolFee = Math.round(feeValue * 1 / 6).toString();
    
    return { prizePool, protocolFee };
  };

  const { prizePool, protocolFee } = calculateFees();

  // Format player number with leading zeros
  const formattedPlayerNumber = isActive
    ? Number(playerNumber).toString().padStart(3, '0') 
    : '---';
  const formattedPlayerCount = playerCount ? playerCount.toString().padStart(3, '0') : '---';

  // Glitch effect every few seconds
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // Terminal typing effect - single time only
  useEffect(() => {
    const fullText = isConnected ? "SCANNING SONIC FOR PLAYER DATA..." : "WALLET CONNECTION REQUIRED...";
    
    if (terminalIndex < fullText.length) {
      // Still typing the current message
      const typingTimer = setTimeout(() => {
        setTerminalText(prev => prev + fullText[terminalIndex]);
        setTerminalIndex(prev => prev + 1);
      }, 40 + Math.random() * 40);
      
      return () => clearTimeout(typingTimer);
    } else if (!interfaceReady) {
      // After typing is complete, wait 5 seconds then show full interface
      const interfaceTimer = setTimeout(() => {
        setInterfaceReady(true);
      }, 5000);
      
      return () => clearTimeout(interfaceTimer);
    }
  }, [terminalIndex, terminalText, isConnected, interfaceReady]);

  // Load referral code from localStorage on component mount
  useEffect(() => {
    const storedRefCode = localStorage.getItem('referralCode');
    if (storedRefCode) {
      setReferralCode(storedRefCode);
    }
  }, []);

  const validateRefCode = (code: string) => {
    if (code.length > 20) {
      setRefCodeError('Referral code must be 20 characters or less');
      return false;
    }
    if (!/^[a-zA-Z0-9\-_]+$/.test(code)) {
      setRefCodeError('Referral code can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    setRefCodeError('');
    return true;
  };

  const handleRefCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters, numbers, hyphens, and underscores
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\-_]/g, '');
    setManualRefCode(sanitizedValue);
    if (sanitizedValue) {
      validateRefCode(sanitizedValue);
    } else {
      setRefCodeError('');
    }
  };

  const handleSetRefCode = () => {
    if (validateRefCode(manualRefCode)) {
      localStorage.setItem('referralCode', manualRefCode);
      setReferralCode(manualRefCode);
      setManualRefCode('');
    }
  };

  const handleClearRefCode = () => {
    localStorage.removeItem('referralCode');
    setReferralCode(null);
  };

  const handleRegister = async () => {
    if (!registrationFee) return;
    
    // Validate manual ref code if it exists
    if (manualRefCode && !validateRefCode(manualRefCode)) {
      return;
    }
    
    try {
      setTxStatus('pending');
      setErrorMessage('');
      
      // Use registerWithReferral if there's a referral code (either from localStorage or manual input)
      if (referralCode || manualRefCode) {
        await writeContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
          abi: GameMasterABI,
          functionName: 'registerWithReferral',
          value: registrationFee,
          gas: BigInt(600000),
          args: [referralCode || manualRefCode]
        });
      } else {
        // Use regular register if no referral code
        await writeContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
          abi: GameMasterABI,
          functionName: 'register',
          value: registrationFee,
          gas: BigInt(600000)
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setTxStatus('error');
      setErrorMessage('Failed to submit transaction. Please try again.');
    }
  };

  // Watch for transaction success/error
  useEffect(() => {
    if (isTxSuccess) {
      setTxStatus('success');
      // Refetch both player info and player count after successful registration
      refetchPlayerInfo();
      refetchPlayerCount();
    } else if (isTxError) {
      setTxStatus('error');
      setErrorMessage('Transaction failed. Please try again.');
    }
  }, [isTxSuccess, isTxError, refetchPlayerInfo, refetchPlayerCount]);

  return (
      <GameStateRedirect allowRegistrationPage={true}>
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
            {/* Initial Terminal Phase */}
            {!interfaceReady && (
              <div className="font-mono text-foreground text-[13px] bg-background border border-border p-4 text-center">
                <div className="text-foreground/80 mb-2 text-center">[SYS::TERMINAL]</div>
                <div className="min-h-[24px] text-center">
                  <span className="text-foreground/50">$</span> {terminalText}
                  <span className="animate-blink">_</span>
                </div>
              </div>
            )}
            
            {/* Full Interface - Not Registered */}
            {interfaceReady && !isRegistered && (
              <div className="animate-interface-reveal">
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
                
                {/* Status panel */}
                <div className="font-mono text-xs bg-background border border-l-2 border-border border-l-content-4
                               pl-3 pr-2 py-3 text-foreground/90 mb-4">
                  <div className="text-foreground/50 mb-1 uppercase tracking-wider">System Status</div>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full ${registrationClosed ? 'bg-red-500' : 'bg-foreground animate-pulse'} mr-2`}></div>
                    <span className="text-foreground uppercase">
                      {registrationClosed ? 'REGISTRATION CLOSED' : 'REGISTRATION OPEN'}
                    </span>
                  </div>
                  <div className="mt-4 text-xs flex items-center">
                    <span className="text-foreground/50">YOUR ADDRESS: </span>
                    <span className="ml-1 truncate text-[10px]">
                      {address}
                    </span>
                  </div>
                </div>
                
                {/* Players panel */}
                <div className="font-mono text-xs bg-background border border-l-2 border-border border-l-content-4
                               pl-3 pr-2 py-3 text-foreground/90 mb-4">
                  <div className="text-foreground/50 uppercase tracking-wider">Registered Players</div>
                  <div className="mt-3 flex items-end">
                    <div className="text-3xl font-bold">{playerCount?.toString() || '0'}</div>
                  
                    <div className="text-foreground/60 ml-1 mb-1">/{maxPlayers?.toString() || '?'}</div>
                  </div>
                  <div className="mt-3 w-full bg-content-2 h-1">
                    <div 
                      className="bg-foreground h-full" 
                      style={{
                        width: `${playerCount && maxPlayers ? 
                          (Number(playerCount) / Number(maxPlayers) * 100) : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Referral Code Panel */}
                <div className="font-mono text-xs bg-background border border-l-2 border-border border-l-content-4
                               pl-3 pr-2 py-3 text-foreground/90 mb-4">
                  <div className="text-foreground/50 uppercase tracking-wider">Referral Code</div>
                  {referralCode ? (
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-foreground animate-pulse mr-2"></div>
                          <span className="text-foreground/80">CODE:</span>
                          <span className="ml-2 font-bold text-foreground">{referralCode}</span>
                        </div>
                        <button 
                          onClick={handleClearRefCode}
                          className="text-foreground/50 hover:text-foreground text-[10px]"
                        >
                          [CLEAR]
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-foreground animate-pulse mr-2"></div>
                        <span className="text-foreground/80">ENTER CODE:</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={manualRefCode}
                          onChange={handleRefCodeChange}
                          placeholder="Enter referral code..."
                          maxLength={20}
                          className={`flex-1 bg-background border ${refCodeError ? 'border-red-500' : 'border-border'} 
                                   px-3 py-2 text-foreground focus:outline-none focus:border-foreground/50 
                                   font-mono text-xs`}
                        />
                        <button
                          onClick={handleSetRefCode}
                          disabled={!manualRefCode || !!refCodeError}
                          className="px-3 py-2 border border-border text-foreground/70 hover:text-foreground
                                   disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs"
                        >
                          SET
                        </button>
                      </div>
                      {refCodeError && (
                        <div className="mt-2 text-red-500 text-[10px]">
                          {refCodeError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Registration panel */}
                <div className="font-mono text-xs bg-background border border-t-2 border-border border-t-content-4
                               px-3 py-4 text-foreground/90 mb-4">
                  <div className="text-foreground/50 mb-2 uppercase tracking-wider">Join Game</div>
                  <div className="grid grid-cols-[1fr_auto] gap-1 text-[11px]">
                    <div className="text-foreground/60 pl-2">TO PRIZE POOL</div>
                    <div className="text-right">
                      {prizePool}<span className="text-foreground/60 ml-1">S</span>
                    </div>
                    
                    <div className="text-foreground/60 pl-2">PLATFORM FEES (Token Sale)</div>
                    <div className="text-right">
                      {protocolFee}<span className="text-foreground/60 ml-1">S</span>
                    </div>

                    <div className="text-foreground/60 mt-2 font-bold">TOTAL ENTRY FEE</div>
                    <div className="text-right mt-2 font-bold">
                      {formattedFee}<span className="text-foreground/60 ml-1">S</span>
                    </div>
                  </div>
                </div>
                
                {/* Input command section */}
                <div className="mt-auto font-mono text-foreground text-sm">
                  <div className="text-xs text-foreground/50 mb-1">[SYS::COMMAND]</div>
                  
                  <div className="relative">
                    <button 
                      onClick={handleRegister}
                      disabled={isRegistering || isWaitingTx || !registrationFee}
                      className={`
                        w-full font-mono text-foreground bg-transparent 
                        border border-border py-3 px-3 text-left
                        focus:outline-none hover:bg-white/10
                        ${(isRegistering || isWaitingTx) ? 'bg-white/10' : ''}
                      `}
                    >
                      <span className="text-foreground/70">$</span> {isRegistering || isWaitingTx ? 
                        'PROCESSING...' : 
                        'initialize_registration --confirm'
                      }
                    </button>
                    
                    {/* Transaction indicators */}
                    {(isRegistering || isWaitingTx) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        <div className="h-2 w-2 bg-foreground rounded-full animate-pulse"></div>
                        <div className="ml-2 h-px w-4 bg-content-4"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Transaction status */}
                  {(isRegistering || isWaitingTx) && (
                    <div className="mt-3 font-mono text-xs">
                      <div className="flex justify-between text-foreground/70 mb-1">
                        <span>TX_STATUS</span>
                        <span className="animate-pulse">PENDING</span>
                      </div>
                      <div className="h-px w-full bg-content-2 mb-1">
                        <div className="h-full bg-foreground animate-[grow_2s_ease-in-out_infinite]"></div>
                      </div>
                      <div className="text-foreground/40 text-[10px] flex justify-between">
                        <span>INITIALIZING</span>
                        <span>VALIDATING</span>
                        <span>CONFIRMING</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Warning notice */}
                  <div className="mt-3 text-xs text-foreground/50 flex items-center">
                    <div className="h-px flex-grow bg-content-2"></div>
                    <div className="mx-2 uppercase">...Curiouser and Curiouser...</div>
                    <div className="h-px flex-grow bg-content-2"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Full Interface - Already Registered */}
            {interfaceReady && isRegistered && (
              <div className="animate-interface-reveal">
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
                
                {/* Player Number Panel - Glowing special highlight */}
                <div className="font-mono bg-background border-2 border-foreground p-6 text-center mb-6
                               shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <div className="text-foreground/70 mb-2 uppercase tracking-widest">Welcome, Player</div>
                  <div className="flex justify-center items-center">
                    <div className="text-7xl font-bold text-foreground tracking-widest" data-text={formattedPlayerNumber}>
                      {formattedPlayerNumber}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-foreground/70">
                    TOTAL REGISTRATIONS: {formattedPlayerCount} / {maxPlayers?.toString() || '???'}
                  </div>
                </div>
                
                {/* Game Information Panel */}
                <div className="font-mono text-xs bg-background border border-l-2 border-border border-l-content-4
                               pl-3 pr-2 py-4 text-foreground/90 mb-4">
                  <div className="text-foreground/50 mb-2 uppercase tracking-wider">Game Schedule</div>
                  
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                    <div className="text-foreground/80 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-foreground animate-pulse mr-2"></div>
                      <span>START TIME:</span>
                    </div>
                    <div className="text-foreground">17:00 UTC</div>
                    
                    <div className="text-foreground/80 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-foreground animate-pulse mr-2"></div>
                      <span>NOTIFICATION:</span>
                    </div>
                    <div className="text-foreground">24 HOURS PRIOR TO GAME START</div>
                    
                    <div className="text-foreground/80 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-foreground animate-pulse mr-2"></div>
                      <span>STATUS:</span>
                    </div>
                    <div className="text-foreground text-right font-bold animate-pulse">REGISTERED</div>
                  </div>
                </div>
                
                {/* Instructions Panel */}
                <div className="font-mono text-xs bg-background/40 border-t border-border
                               px-3 py-4 text-foreground/90 mb-4">
                  <div className="text-foreground/50 mb-3 uppercase tracking-wider">Protocol Instructions</div>
                  
                  <div className="space-y-3 leading-loose">
                    <p>Your registration has been confirmed.</p>
                    <p>Follow @AliceOnSonic on X for updates on game status.</p>
                    <p>Prepare accordingly. Your survival in the games depends on strategy and skill.</p>
                    <p className="text-foreground/40 text-[10px] mt-2">
                      SYSTEM NOTE: Participants who fail to appear for their scheduled game will be eliminated.
                    </p>
                  </div>
                </div>
                
                {/* Return to Dashboard */}
                <div className="mt-auto font-mono text-foreground text-sm">
                  <div className="text-xs text-foreground/50 mb-1">[SYS::COMMAND]</div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => router.push('/lobby')}
                      className="w-full font-mono text-foreground bg-transparent 
                                border border-border py-3 px-3 text-left
                                focus:outline-none hover:bg-white/10"
                    >
                      <span className="text-foreground/70">$</span> go --nexus
                    </button>
                  </div>
                  
                  {/* Warning/Info */}
                  <div className="mt-3 text-xs text-foreground/50 flex items-center">
                    <div className="h-px flex-grow bg-content-2"></div>
                    <div className="mx-2 uppercase">Stay Vigilant</div>
                    <div className="h-px flex-grow bg-content-2"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GameStateRedirect>
  );
} 