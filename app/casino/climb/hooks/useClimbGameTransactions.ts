import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { ClimbABI } from '@/app/abis/ClimbABI';
import { useCallback, useState, useEffect } from 'react';
import { parseEther } from 'viem';

const CLIMB_GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`;

type ActionType = 'climbing' | 'cashingOut' | 'autoClimbing' | null;

interface WaitingState {
  type: ActionType;
  message: string;
  resultInfo?: {
    type: 'success' | 'bust' | 'cashout' | null;
    level?: number;
    newLevel?: number;
    payout?: string;
    currency?: 'S' | 'ALICE';
    aliceReward?: number;
  };
}

export function useClimbGameTransactions() {
  const [error, setError] = useState<string | null>(null);
  const [waitingState, setWaitingState] = useState<WaitingState>({ type: null, message: '' });
  
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
      setWaitingState({ type: null, message: '' });
    }
  }, [error]);

  // Handle transaction success - set waiting state when transaction is confirmed
  useEffect(() => {
    if (isTxSuccess && hash && waitingState.type) {
      const actionMessages = {
        climbing: 'Climbing to the next level...',
        cashingOut: 'Processing your cash out...',
        autoClimbing: 'Auto climbing to target level...'
      };

      const message = actionMessages[waitingState.type] || 'Processing...';
      setWaitingState(prev => ({ ...prev, message }));
    }
  }, [isTxSuccess, hash, waitingState.type]);

  // Functions to manage waiting states
  const clearWaitingState = useCallback(() => {
    setWaitingState({ type: null, message: '' });
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
    setWaitingState(prev => ({
      ...prev,
      resultInfo
    }));
  }, []);

  const handleStartGame = useCallback(async (depositAmount: string) => {
    try {
      setError(null);
      // Don't set waiting state for starting games - no overlay should show
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
    }
  }, [writeContract, address]);

  const handleClimb = useCallback(async () => {
    try {
      setError(null);
      setWaitingState({ type: 'climbing', message: 'Climbing to the next level...' });
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
      setWaitingState({ type: null, message: '' });
    }
  }, [writeContract, address]);

  const handleCashOut = useCallback(async () => {
    try {
      setError(null);
      setWaitingState({ type: 'cashingOut', message: 'Processing your cash out...' });
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
      setWaitingState({ type: null, message: '' });
    }
  }, [writeContract, address]);

  const handleAutoClimb = useCallback(async (targetLevel: number) => {
    try {
      setError(null);
      setWaitingState({ type: 'autoClimbing', message: 'Auto climbing to target level...' });
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
      setWaitingState({ type: null, message: '' });
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
    waitingState,
    clearWaitingState,
    showResult
  };
} 