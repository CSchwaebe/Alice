"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ViewportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ViewportDrawer({ isOpen, onClose, children }: ViewportDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="relative z-50">
      <div className="fixed inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="fixed bottom-0 inset-x-0 animate-slide-up">
        <div className="bg-dark-800 border-t border-dark-400 rounded-t-xl shadow-xl">
          <div className="max-w-lg mx-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
} 