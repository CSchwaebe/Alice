import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { EquilibriumABI } from '@/app/abis/EquilibriumABI';
import { addToast } from '@heroui/toast';

export function useEquilibriumGameTransactions(
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

  // Handle team switch
  const handleSwitchTeam = async (team: number) => {
    if (!gameId) return;

    try {
      setTxStatus('pending');
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_EQUILIBRIUM as `0x${string}`,
        abi: EquilibriumABI,
        functionName: 'switchTeam',
        args: [team],
      });
    } catch (error) {
      console.error('Error switching team:', error);
      setTxStatus('error');
      setErrorMessage('Failed to switch team. Please try again.');
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
        title: 'Team Switch Successful',
        description: 'You have switched teams!',
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
    handleSwitchTeam,
    txStatus,
    errorMessage,
    isPending,
    isWaitingTx,
    setTxStatus,
    setErrorMessage
  };
} 