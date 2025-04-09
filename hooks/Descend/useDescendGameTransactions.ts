import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { DescendABI } from '@/app/abis/DescendABI';
import { useCallback, useState, useEffect } from 'react';
import { addToast } from '@heroui/toast';

const DESCEND_GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`;

export function useDescendGameTransactions() {
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

  const handleCommitMove = useCallback(async (move: number) => {
    try {
      setError(null);
      if (!address) {
        throw new Error('Wallet not connected');
      }
      if (move < 0 || move > 5) {
        throw new Error('Move must be between 0 and 5');
      }

      const response = await fetch('/api/descend/commitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          move,
          playerAddress: address 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate commitment');
      }

      const { commitment } = await response.json();
      
      const config = {
        address: DESCEND_GAME_ADDRESS,
        abi: DescendABI,
        functionName: 'commitMove',
        args: [commitment],
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Commit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to commit move');
    }
  }, [writeContract, address]);

  const handleRevealMove = useCallback(async (move: number) => {
    try {
      setError(null);
      if (move < 0 || move > 5) {
        throw new Error('Move must be between 0 and 5');
      }

      const response = await fetch('/api/descend/salt', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to retrieve salt');
      }

      const { formattedSalt } = await response.json();

      const config = {
        address: DESCEND_GAME_ADDRESS,
        abi: DescendABI,
        functionName: 'revealMove',
        args: [BigInt(move), formattedSalt],
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Reveal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reveal move');
    }
  }, [writeContract]);

  const handleEndExpiredGames = useCallback(async () => {
    try {
      setError(null);
      const config = {
        address: DESCEND_GAME_ADDRESS,
        abi: DescendABI,
        functionName: 'endExpiredGames',
        args: [],
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Error ending expired games:', err);
      setError(err instanceof Error ? err.message : 'Failed to end expired games');
    }
  }, [writeContract]);

  return {
    handleCommitMove,
    handleRevealMove,
    handleEndExpiredGames,
    isLoading: isWaitingTx,
    isSuccess: isTxSuccess,
    isPending,
    error
  };
} 