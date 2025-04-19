import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { ThreesABI } from '@/app/abis/ThreesABI';
import { useCallback, useState, useEffect } from 'react';
import { addToast } from '@heroui/toast';

const THREES_GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_THREES as `0x${string}`;

export function useThreesGameTransactions() {
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

  const handleCommit = useCallback(async (choice: number, gameId: string | number, round: string | number) => {
    try {
      setError(null);
      if (!address) {
        throw new Error('Wallet not connected');
      }
      if (choice < 1 || choice > 3) {
        throw new Error('Choice must be between 1 and 3');
      }

      console.log('🎮 Committing choice:', {
        choice,
        gameId,
        round,
        playerAddress: address
      });

      const response = await fetch('/api/threes/commitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice, playerAddress: address, gameId, round }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate commitment');
      }

      const { commitment } = await response.json();
      
      console.log('📝 Generated commitment:', {
        commitment,
        choice
      });

      const config = {
        address: THREES_GAME_ADDRESS,
        abi: ThreesABI,
        functionName: 'commitChoice',
        args: [commitment],
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Commit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to commit choice');
    }
  }, [writeContract, address]);

  const handleReveal = useCallback(async (choice: number, gameId: string, round: string) => {
    try {
      setError(null);
      if (choice < 1 || choice > 3) {
        throw new Error('Choice must be between 1 and 3');
      }

      console.log('🎮 Revealing choice:', {
        choice,
        gameId,
        round
      });

      const response = await fetch(`/api/salt?gameType=threes&gameId=${gameId}&round=${round}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to retrieve salt');
      }

      const { formattedSalt } = await response.json();

      console.log('🔑 Retrieved salt:', {
        formattedSalt,
        choice
      });

      const config = {
        address: THREES_GAME_ADDRESS,
        abi: ThreesABI,
        functionName: 'revealChoice',
        args: [BigInt(choice), formattedSalt],
      } as const;

      console.log('📝 Sending reveal transaction with args:', {
        choice: BigInt(choice),
        salt: formattedSalt
      });

      writeContract(config);
    } catch (err) {
      console.error('❌ Reveal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reveal choice');
    }
  }, [writeContract]);

  return {
    handleCommit,
    handleReveal,
    isLoading: isWaitingTx,
    isSuccess: isTxSuccess,
    isPending,
    error
  };
} 