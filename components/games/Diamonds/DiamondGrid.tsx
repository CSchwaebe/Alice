"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ViewportDrawer from "../../ui/ViewportDrawer";
import { motion, AnimatePresence } from "framer-motion";

interface DiamondGridProps {
  onNumberSelect?: (number: number) => void;
  className?: string;
}

export default function DiamondGrid({
  onNumberSelect,
  className,
}: DiamondGridProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [visibleSquares, setVisibleSquares] = useState<number[]>([]);
  
  // Generate and animate squares in random order
  useEffect(() => {
    const indexes = Array.from({ length: 100 }, (_, i) => i);
    const shuffled = indexes.sort(() => Math.random() - 0.5);
    
    // Show squares one by one
    shuffled.forEach((index, i) => {
      setTimeout(() => {
        setVisibleSquares(prev => [...prev, index]);
      }, i * 50); // 50ms between each square
    });
  }, []);
  
  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
    setShowDrawer(true);
  };
  
  const handleConfirm = () => {
    if (selectedNumber !== null && onNumberSelect) {
      onNumberSelect(selectedNumber);
    }
    setShowDrawer(false);
  };
  
  const handleClose = () => {
    setSelectedNumber(null);
    setShowDrawer(false);
  };
  
  // Generate numbers 1-100
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  
  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      <div className="grid grid-cols-10 gap-1 w-full max-w-3xl mb-4">
        {numbers.map((number, i) => (
          <motion.button
            key={number}
            initial={{ 
              opacity: 0,
              scale: 1.5,
            }}
            animate={{ 
              opacity: visibleSquares.includes(i) ? 1 : 0,
              scale: visibleSquares.includes(i) ? 1 : 4.5,
            }}
            transition={{
              duration: 1,
              ease: [0.19, 1, 0.22, 1], // Custom easing for a snappy feel
            }}
            onClick={() => handleNumberClick(number)}
            className="aspect-square flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-bold rounded transition-colors"
          >
            {number}
          </motion.button>
        ))}
      </div>
      
      {/* Use the existing ViewportDrawer */}
      <ViewportDrawer 
        isOpen={showDrawer} 
        onClose={handleClose}
        
      >
        <div className="p-4 flex flex-col items-center">
          <p className="text-white text-lg mb-4">
            Confirm selection: <span className="font-bold text-neon-300">{selectedNumber}</span>
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={handleConfirm}
              className="bg-neon-300 hover:bg-neon-400 text-black font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </ViewportDrawer>
    </div>
  );
} 