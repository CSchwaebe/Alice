import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DoorsABI } from '@/app/abis/DoorsABI';
import { addToast } from '@heroui/toast';

export function useDoorsGameTransactions(
  gameId: bigint | null,
  refetchPlayerInfo: () => void,
  refetchGameInfo: () => void
) {
  const [txStatus, setTxStatus] = useState<'none' | 'pending' | 'success' | 'error'>('none');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Contract write hook
  const { writeContract, isPending, data: hash } = useWriteContract();

  // Transaction wait hook
  const { isLoading: isWaitingTx, isSuccess: isTxSuccess, isError: isTxError } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle door selection
  const handleDoorSelect = async () => {
    if (!gameId) return;

    try {
      setTxStatus('pending');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS as `0x${string}`,
        abi: DoorsABI,
        functionName: 'openDoor',
        args: [],
      });
    } catch (error) {
      console.error('Error opening door:', error);
      setTxStatus('error');
      setErrorMessage('Failed to open door. Please try again.');
    }
  };

  // Watch for transaction status and handle notifications
  useEffect(() => {
    if (isTxSuccess) {
      setTxStatus('success');
      console.log('Transaction success, refetching data');
      // Refetch player info and game info
      refetchPlayerInfo();
      refetchGameInfo();
      
      // Show success toast
      addToast({
        title: 'Door Selection Successful',
        description: 'Your door has been selected!',
        color: 'success',
        timeout: 1000,
      });
    } else if (isTxError) {
      setTxStatus('error');
      setErrorMessage('Transaction failed. Please try again.');
    }
  }, [isTxSuccess, isTxError, refetchPlayerInfo, refetchGameInfo]);

  // Handle error notifications
  useEffect(() => {
    if (errorMessage) {
      addToast({
        title: 'Transaction Failed',
        description: errorMessage,
        color: 'danger',
        timeout: 1000,
      });
    }
  }, [errorMessage]);

  return {
    handleDoorSelect,
    txStatus,
    errorMessage,
    isPending,
    isWaitingTx,
    setTxStatus,
    setErrorMessage
  };
} 