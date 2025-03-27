interface TransactionStatusProps {
  isPending: boolean;
  isWaitingTx: boolean;
  txStatus: 'none' | 'pending' | 'success' | 'error';
  errorMessage: string;
}

export default function TransactionStatus({
  isPending,
  isWaitingTx,
  txStatus,
  errorMessage
}: TransactionStatusProps) {
  return (
    <>
      {/* Transaction Status */}
      {(isPending || isWaitingTx) && (
        <div className="fixed bottom-4 right-4 font-mono text-xs bg-black/80 border border-white/20 p-4">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-2"></div>
            <span>Processing transaction...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {txStatus === 'error' && (
        <div className="fixed bottom-4 right-4 font-mono text-xs bg-red-900/20 border border-red-500/20 p-4">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </>
  );
} 