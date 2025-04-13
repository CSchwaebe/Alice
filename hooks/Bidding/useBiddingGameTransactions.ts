import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { BiddingABI } from '@/app/abis/BiddingABI';
import { useCallback, useState, useEffect } from 'react';
import { addToast } from '@heroui/toast';

const BIDDING_GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_BIDDING as `0x${string}`;

export function useBiddingGameTransactions() {
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

  const handleCommitBid = useCallback(async (amount: number, gameId: string | number, round: string | number) => {
    try {
      setError(null);
      if (!address) {
        throw new Error('Wallet not connected');
      }
      if (amount <= 0) {
        throw new Error('Bid amount must be greater than 0');
      }

      const response = await fetch('/api/bidding/commitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bidAmount: amount,
          playerAddress: address,
          gameId,
          round
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate commitment');
      }

      const { commitment } = await response.json();
      
      const config = {
        address: BIDDING_GAME_ADDRESS,
        abi: BiddingABI,
        functionName: 'commitBid',
        args: [commitment],
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Commit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to commit bid');
    }
  }, [writeContract, address]);

  const handleRevealBid = useCallback(async (amount: number, gameId: string, round: string) => {
    try {
      setError(null);
      if (amount <= 0) {
        throw new Error('Bid amount must be greater than 0');
      }

      const response = await fetch(`/api/salt?gameType=bidding&gameId=${gameId}&round=${round}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to retrieve salt');
      }

      const { formattedSalt } = await response.json();

      const config = {
        address: BIDDING_GAME_ADDRESS,
        abi: BiddingABI,
        functionName: 'revealBid',
        args: [BigInt(amount), formattedSalt],
      } as const;

      writeContract(config);
    } catch (err) {
      console.error('Reveal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reveal bid');
    }
  }, [writeContract]);

  const handleEndExpiredGames = useCallback(async () => {
    try {
      setError(null);
      const config = {
        address: BIDDING_GAME_ADDRESS,
        abi: BiddingABI,
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
    handleCommitBid,
    handleRevealBid,
    handleEndExpiredGames,
    isLoading: isWaitingTx,
    isSuccess: isTxSuccess,
    isPending,
    error
  };
} 