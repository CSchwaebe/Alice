"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface DepositDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClick: (sonicAmount: number) => void;
  error?: string;
}

export default function DepositDrawer({
  isOpen,
  onClose,
  onConfirmClick,
  error
}: DepositDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [sonicAmount, setSonicAmount] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleConfirm = () => {
    const amount = Number(sonicAmount);
    if (!sonicAmount || isNaN(amount) || amount <= 0) {
      setLocalError('Please enter a valid amount of SONIC');
      return;
    }
    onConfirmClick(amount);
    setSonicAmount('');
    setLocalError('');
  };

  const handleAmountChange = (value: string) => {
    setSonicAmount(value);
    setLocalError('');
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-background border border-primary-200 p-6 max-w-md w-full mx-4 shadow-lg"
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-400"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-400"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-400"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-400"></div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            Buy ALICE
          </h2>

          <p className="text-primary-800 mb-6">
            1 SONIC = 50 ALICE
          </p>

          <div className="mb-6">
            <input
              type="number"
              value={sonicAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount of SONIC"
              className="w-full bg-background border border-content-3 p-2 text-foreground 
                       font-mono text-sm focus:outline-none focus:border-foreground
                       focus:ring-1 focus:ring-content-3/30"
              min="0"
              step="0.02"
            />
            {(localError || error) && (
              <div className="text-red-500 text-sm mt-2">{localError || error}</div>
            )}
            {sonicAmount && !localError && (
              <div className="text-foreground/70 text-sm mt-2">
                = {(Number(sonicAmount) * 50).toLocaleString()} ALICE
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-primary-600 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-foreground text-background transition-colors"
            >
              Buy ALICE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
} 