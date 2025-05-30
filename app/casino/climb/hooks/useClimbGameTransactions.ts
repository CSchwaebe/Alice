import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { ClimbABI } from '@/app/abis/ClimbABI';
import { useCallback, useState, useEffect } from 'react';
import { parseEther } from 'viem';

const CLIMB_GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`;

export function useClimbGameTransactions() {
  const [error, setError] = useState<string | null>(null);
  const [waitingForEvent, setWaitingForEvent] = useState<{
    type: 'climbing' | 'cashingOut' | 'starting' | 'autoClimbing' | null;
    message: string;
    resultInfo?: {
      type: 'success' | 'bust' | 'cashout' | null;
      level?: number;
      newLevel?: number;
      payout?: string;
      currency?: 'S' | 'ALICE';
      aliceReward?: number;
    };
  }>({ type: null, message: '' });
  const [currentAction, setCurrentAction] = useState<'climbing' | 'cashingOut' | 'starting' | 'autoClimbing' | null>(null);
  
  const { address } = useAccount();

  // Contract write hook
  const { writeContract, isPending, data: hash } = useWriteContract();

  // Transaction wait hook
  const { isLoading: isWaitingTx, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction error notifications
  useEffect(() => {
    if (error) {
      // Clear waiting state when there's an error
      setWaitingForEvent({ type: null, message: '' });
      setCurrentAction(null);
    }
  }, [error]);

  // Handle transaction success - set waiting state when transaction is confirmed
  useEffect(() => {
    if (isTxSuccess && hash && currentAction) {
      // Set waiting state based on the current action
      switch (currentAction) {
        case 'climbing':
          setWaitingForEvent({ type: 'climbing', message: 'Climbing to the next level...' });
          break;
        case 'cashingOut':
          setWaitingForEvent({ type: 'cashingOut', message: 'Processing your cash out...' });
          break;
        case 'autoClimbing':
          setWaitingForEvent({ type: 'autoClimbing', message: 'Auto climbing to target level...' });
          break;
      }
    }
  }, [isTxSuccess, hash, currentAction]);

  // Functions to manage waiting states
  const clearWaitingState = useCallback(() => {
    setWaitingForEvent({ type: null, message: '' });
    setCurrentAction(null);
  }, []);

  // Function to show result and auto-clear after 5 seconds
  const showResult = useCallback((resultInfo: {
    type: 'success' | 'bust' | 'cashout';
    level?: number;
    newLevel?: number;
    payout?: string;
    currency?: 'S' | 'ALICE';
    aliceReward?: number;
  }) => {
    setWaitingForEvent(prev => ({
      type: prev.type, // Preserve the waiting type so overlay stays visible
      message: prev.message, // Keep original message
      resultInfo
    }));
  }, []);

  const handleStartGame = useCallback(async (depositAmount: string) => {
    try {
      setError(null);
      setCurrentAction('starting');
      if (!address) {
        throw new Error('Wallet not connected');
      }
      
      const depositValue = parseEther(depositAmount);
      
      const config = {
        address: CLIMB_GAME_ADDRESS,
        abi: ClimbABI,
        functionName: 'startGame',
        args: [],
        value: depositValue,
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Start game error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start game');
      setCurrentAction(null);
    }
  }, [writeContract, address]);

  const handleClimb = useCallback(async () => {
    try {
      setError(null);
      setCurrentAction('climbing');
      if (!address) {
        throw new Error('Wallet not connected');
      }

      const config = {
        address: CLIMB_GAME_ADDRESS,
        abi: ClimbABI,
        functionName: 'climb',
        args: [],
        value: parseEther('0.05'), // Required 0.05 ETH payment
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Climb error:', err);
      setError(err instanceof Error ? err.message : 'Failed to climb');
      setCurrentAction(null);
    }
  }, [writeContract, address]);

  const handleCashOut = useCallback(async () => {
    try {
      setError(null);
      setCurrentAction('cashingOut');
      if (!address) {
        throw new Error('Wallet not connected');
      }

      const config = {
        address: CLIMB_GAME_ADDRESS,
        abi: ClimbABI,
        functionName: 'cashOut',
        args: [],
        value: parseEther('0.05'), // Required 0.05 ETH payment
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Cash out error:', err);
      setError(err instanceof Error ? err.message : 'Failed to cash out');
      setCurrentAction(null);
    }
  }, [writeContract, address]);

  const handleAutoClimb = useCallback(async (targetLevel: number) => {
    try {
      setError(null);
      setCurrentAction('autoClimbing');
      if (!address) {
        throw new Error('Wallet not connected');
      }

      const config = {
        address: CLIMB_GAME_ADDRESS,
        abi: ClimbABI,
        functionName: 'autoClimb',
        args: [targetLevel],
        value: parseEther('0.05'), // Required 0.05 ETH payment
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Auto climb error:', err);
      setError(err instanceof Error ? err.message : 'Failed to auto climb');
      setCurrentAction(null);
    }
  }, [writeContract, address]);

  const handleDepositFunds = useCallback(async (amount: string) => {
    try {
      setError(null);
      if (!address) {
        throw new Error('Wallet not connected');
      }
      
      const depositValue = parseEther(amount);
      
      const config = {
        address: CLIMB_GAME_ADDRESS,
        abi: ClimbABI,
        functionName: 'depositFunds',
        args: [],
        value: depositValue,
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Deposit funds error:', err);
      setError(err instanceof Error ? err.message : 'Failed to deposit funds');
    }
  }, [writeContract, address]);

  return {
    handleStartGame,
    handleClimb,
    handleCashOut,
    handleAutoClimb,
    handleDepositFunds,
    isLoading: isWaitingTx,
    isSuccess: isTxSuccess,
    isPending,
    error,
    waitingForEvent,
    clearWaitingState,
    showResult
  };
} 