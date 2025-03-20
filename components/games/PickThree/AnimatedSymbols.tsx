"use client";

import { motion, AnimatePresence } from "framer-motion";
import ViewportDrawer from "@/components/ui/ViewportDrawer";
import { useState, useEffect } from "react";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.5, type: "spring", duration: 1.5, bounce: 0 },
      opacity: { delay: i * 0.5, duration: 0.01 },
    },
  }),
};

interface AnimatedSymbolsProps {
  onSymbolClick?: (index: number) => void;
  className?: string;
}

export default function AnimatedSymbols({ onSymbolClick, className }: AnimatedSymbolsProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [hoveredSymbol, setHoveredSymbol] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // Key to force re-render

  const SYMBOL_HEIGHT = 160; // Consistent height for all symbols
  const BASE_Y = 120; // Y position where all symbols start
  const CLICK_PADDING = 40; // Extra padding around shapes for easier clicking

  // Periodic reanimation of all shapes
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Show glow if hovered OR selected
  const shouldShowGlow = (index: number) => 
    hoveredSymbol === index || selectedSymbol === index;

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.5, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay: i * 0.5, duration: 0.01 },
      },
    }),
  };

  const handleSymbolClick = (index: number) => {
    setSelectedSymbol(index);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedSymbol !== null && onSymbolClick) {
      onSymbolClick(selectedSymbol);
    }
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setSelectedSymbol(null);
    setShowConfirmation(false);
  };

  // Helper function to create triangle path
  const getTrianglePath = () => {
    const size = 180;
    const height = SYMBOL_HEIGHT;
    const x = 200; // Triangle in middle
    const y = BASE_Y;
    return `M ${x + size/2} ${y} L ${x + size} ${y + height} L ${x} ${y + height} Z`;
  };

  // Helper function to create square path
  const getSquarePath = () => {
    const size = SYMBOL_HEIGHT;
    const x = 410; // Square on right
    const y = BASE_Y;
    return `M ${x} ${y} h ${size} v ${size} h -${size} Z`;
  };

  return (
    <>
      <motion.svg
        width="600"
        height="400"
        viewBox="0 0 600 400"
        key={animationKey}
        className={className}
      >
        {/* Circle Group (index 0) - Left position */}
        <g 
          onClick={() => handleSymbolClick(0)} 
          onMouseEnter={() => setHoveredSymbol(0)}
          onMouseLeave={() => setHoveredSymbol(null)}
          className="cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {shouldShowGlow(0) && (
              <motion.circle
                cx="100"
                cy={BASE_Y + SYMBOL_HEIGHT/2}
                r={SYMBOL_HEIGHT/2 + 15}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                strokeWidth={20}
                className="stroke-[#ff0088]"
                style={{ filter: "blur(15px)" }}
              />
            )}
          </AnimatePresence>
          <rect
            x={100 - SYMBOL_HEIGHT/2 - CLICK_PADDING}
            y={BASE_Y - CLICK_PADDING}
            width={SYMBOL_HEIGHT + CLICK_PADDING * 2}
            height={SYMBOL_HEIGHT + CLICK_PADDING * 2}
            fill="transparent"
            pointerEvents="all"
          />
          <motion.circle
            cx="100"
            cy={BASE_Y + SYMBOL_HEIGHT/2}
            r={SYMBOL_HEIGHT/2}
            stroke="#ff0088"
            variants={variants}
            custom={0}
            initial="hidden"
            animate="visible"
            style={shape}
          />
        </g>

        {/* Triangle Group (index 1) - Middle position */}
        <g 
          onClick={() => handleSymbolClick(1)}
          onMouseEnter={() => setHoveredSymbol(1)}
          onMouseLeave={() => setHoveredSymbol(null)}
          className="cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {shouldShowGlow(1) && (
              <motion.path
                d={getTrianglePath()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                strokeWidth={20}
                className="stroke-[#4ff0b7]"
                style={{ filter: "blur(15px)" }}
              />
            )}
          </AnimatePresence>
          <rect
            x={200 - CLICK_PADDING}
            y={BASE_Y - CLICK_PADDING}
            width={180 + CLICK_PADDING * 2}
            height={SYMBOL_HEIGHT + CLICK_PADDING * 2}
            fill="transparent"
            pointerEvents="all"
          />
          <motion.path
            d={getTrianglePath()}
            stroke="#4ff0b7"
            variants={variants}
            custom={1}
            initial="hidden"
            animate="visible"
            style={shape}
          />
        </g>

        {/* Square Group (index 2) - Right position */}
        <g 
          onClick={() => handleSymbolClick(2)}
          onMouseEnter={() => setHoveredSymbol(2)}
          onMouseLeave={() => setHoveredSymbol(null)}
          className="cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {shouldShowGlow(2) && (
              <motion.path
                d={getSquarePath()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                strokeWidth={20}
                className="stroke-[#0d63f8]"
                style={{ filter: "blur(15px)" }}
              />
            )}
          </AnimatePresence>
          <rect
            x={410 - CLICK_PADDING}
            y={BASE_Y - CLICK_PADDING}
            width={SYMBOL_HEIGHT + CLICK_PADDING * 2}
            height={SYMBOL_HEIGHT + CLICK_PADDING * 2}
            fill="transparent"
            pointerEvents="all"
          />
          <motion.path
            d={getSquarePath()}
            stroke="#0d63f8"
            variants={variants}
            custom={2}
            initial="hidden"
            animate="visible"
            style={shape}
          />
        </g>
      </motion.svg>

      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={handleClose}
      >
        <div className="p-4 flex flex-col items-center">
          <h3 className="text-xl text-neon-300 mb-6">
            Confirm Symbol {selectedSymbol !== null ? selectedSymbol + 1 : ''}?
          </h3>
          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-lg bg-neon-600 text-white hover:bg-neon-500 transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </ViewportDrawer>
    </>
  );
}

const shape: React.CSSProperties = {
  strokeWidth: 10,
  strokeLinecap: "round",
  fill: "transparent",
  transformOrigin: "center",
  pointerEvents: "none"
}; 