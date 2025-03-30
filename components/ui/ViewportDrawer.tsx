"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface ViewportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClick: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ViewportDrawer({
  isOpen,
  onClose,
  onConfirmClick,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: ViewportDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/60"
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
            {title}
          </h2>

          <p className="text-primary-800 mb-6">
            {description}
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-primary-600 hover:text-foreground transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirmClick();
                onClose();
              }}
              className="px-4 py-2 bg-foreground text-background hover:bg-primary-800 hover:text-foreground transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
} 