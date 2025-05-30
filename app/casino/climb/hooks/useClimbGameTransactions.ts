import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { ClimbABI } from '@/app/abis/ClimbABI';
import { useCallback, useState, useEffect } from 'react';
import { addToast } from '@heroui/toast';
import { parseEther } from 'viem';

const CLIMB_GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDR_CASINO_CLIMB as `0x${string}`;

export function useClimbGameTransactions() {
  const [error, setError] = useState<string | null>(null);
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
      addToast({
        title: 'Transaction Failed',
        description: error,
        color: 'danger'
      });
    }
  }, [error]);

  // Handle transaction success notifications
  useEffect(() => {
    if (isTxSuccess && hash) {
      addToast({
        title: 'Transaction Successful',
        description: 'Your transaction has been confirmed!',
        color: 'success'
      });
    }
  }, [isTxSuccess, hash]);

  const handleStartGame = useCallback(async (depositAmount: string) => {
    try {
      setError(null);
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
    }
  }, [writeContract, address]);

  const handleCashOut = useCallback(async () => {
    try {
      setError(null);
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
    handleDepositFunds,
    isLoading: isWaitingTx,
    isSuccess: isTxSuccess,
    isPending,
    error
  };
} 