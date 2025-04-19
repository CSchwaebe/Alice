import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DoorsABI } from '@/app/abis/DoorsABI';
import { addToast } from '@heroui/toast';

export function useDoorsGameTransactions(
  gameId: bigint | null,
  refetchPlayerInfo: () => void,
  refetchGameInfo: () => void
) {
  const [error, setError] = useState<string | null>(null);

  // Contract write hook
  const { writeContract, isPending, data: hash } = useWriteContract();

  // Transaction wait hook
  const { isLoading: isWaitingTx, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle door selection
  const handleDoorSelect = async () => {
    if (!gameId) return;

    try {
      setError(null);
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS as `0x${string}`,
        abi: DoorsABI,
        functionName: 'openDoor',
        args: [],
        gas: BigInt(3000000),
      });
    } catch (err) {
      console.error('Error opening door:', err);
      setError(err instanceof Error ? err.message : 'Failed to open door');
    }
  };

  // Handle transaction error notifications
  useEffect(() => {
    if (error) {
      addToast({
        title: 'Transaction Failed',
        description: error,
        color: 'danger',
        timeout: 1000,
      });
    }
  }, [error]);

  // Handle transaction success notifications
  useEffect(() => {
    if (isTxSuccess && hash) {
      setError(null);
      console.log('Transaction success, refetching data');
      refetchPlayerInfo();
      refetchGameInfo();
      
      addToast({
        title: 'Door Selection Successful',
        description: 'Your door has been selected!',
        color: 'success',
        timeout: 1000,
      });
    }
  }, [isTxSuccess, hash, refetchPlayerInfo, refetchGameInfo]);

  return {
    handleDoorSelect,
    error,
    isPending,
    isWaitingTx,
    isSuccess: isTxSuccess
  };
} 