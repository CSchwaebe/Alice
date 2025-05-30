"use client";

import { motion, AnimatePresence } from "framer-motion";
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

export default function AnimatedSymbols({
  onSymbolClick,
  className,
}: AnimatedSymbolsProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [hoveredSymbol, setHoveredSymbol] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const SYMBOL_HEIGHT = 160;
  const BASE_Y = 120;
  const CLICK_PADDING = 60;
  const GLOW_PADDING = 20;
  const EDGE_PADDING = 50;
  const SVG_WIDTH = 600 + (EDGE_PADDING * 2);
  const SVG_HEIGHT = 400;
  const CIRCLE_X = 100 + EDGE_PADDING;
  const TRIANGLE_X = 300 + EDGE_PADDING;
  const SQUARE_X = 500 + EDGE_PADDING;

  // Periodic reanimation of all shapes
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
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
        pathLength: {
          delay: i * 0.5,
          type: "spring",
          duration: 1.5,
          bounce: 0,
        },
        opacity: { delay: i * 0.5, duration: 0.01 },
      },
    }),
  };

  const handleSymbolClick = (index: number) => {
    if (onSymbolClick) {
      onSymbolClick(index + 1);
    }
  };

  // Helper function to create triangle path
  const getTrianglePath = () => {
    const size = 180;
    const height = SYMBOL_HEIGHT;
    const x = TRIANGLE_X - size / 2; // Center the triangle at its fixed position
    const y = BASE_Y;
    return `M ${x + size / 2} ${y} L ${x + size} ${y + height} L ${x} ${
      y + height
    } Z`;
  };

  // Helper function to create square path
  const getSquarePath = () => {
    const size = SYMBOL_HEIGHT;
    const x = SQUARE_X - size / 2; // Center the square at its fixed position
    const y = BASE_Y;
    return `M ${x} ${y} h ${size} v ${size} h -${size} Z`;
  };

  // Helper function to create circle path
  const getCirclePath = () => {
    const radius = SYMBOL_HEIGHT / 2;
    const x = CIRCLE_X;
    const y = BASE_Y + SYMBOL_HEIGHT / 2;
    return `M ${x - radius} ${y} a ${radius} ${radius} 0 1 0 ${
      radius * 2
    } 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`;
  };

  const shape = {
    strokeWidth: 10,
    strokeLinecap: "round" as const,
    fill: "transparent",
    transformOrigin: "center",
  };

  return (
    <motion.svg
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      key={animationKey}
      className={`${className} mx-auto`}
      style={{ display: 'block' }}
    >
      {/* Circle Group (index 0) */}
      <g
        onClick={() => handleSymbolClick(0)}
        onMouseEnter={() => setHoveredSymbol(0)}
        onMouseLeave={() => setHoveredSymbol(null)}
        className="cursor-pointer"
      >
        <rect
          x={CIRCLE_X - SYMBOL_HEIGHT / 2 - CLICK_PADDING - GLOW_PADDING}
          y={BASE_Y - CLICK_PADDING - GLOW_PADDING}
          width={SYMBOL_HEIGHT + (CLICK_PADDING + GLOW_PADDING) * 2}
          height={SYMBOL_HEIGHT + (CLICK_PADDING + GLOW_PADDING) * 2}
          fill="transparent"
          pointerEvents="all"
        />
        <AnimatePresence mode="wait" initial={false}>
          {shouldShowGlow(0) && (
            <motion.path
              d={getCirclePath()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              strokeWidth={20}
              className="stroke-foreground"
              style={{ 
                filter: "blur(15px)",
                fill: "transparent",
                strokeLinecap: "round" as const
              }}
            />
          )}
        </AnimatePresence>
        <motion.circle
          cx={CIRCLE_X}
          cy={BASE_Y + SYMBOL_HEIGHT / 2}
          r={SYMBOL_HEIGHT / 2}
          className="stroke-foreground"
          variants={variants}
          custom={0}
          initial="hidden"
          animate="visible"
          style={shape}
        />
      </g>

      {/* Triangle Group (index 1) */}
      <g
        onClick={() => handleSymbolClick(1)}
        onMouseEnter={() => setHoveredSymbol(1)}
        onMouseLeave={() => setHoveredSymbol(null)}
        className="cursor-pointer"
      >
        <rect
          x={TRIANGLE_X - 90 - CLICK_PADDING - GLOW_PADDING}
          y={BASE_Y - CLICK_PADDING - GLOW_PADDING}
          width={180 + (CLICK_PADDING + GLOW_PADDING) * 2}
          height={SYMBOL_HEIGHT + (CLICK_PADDING + GLOW_PADDING) * 2}
          fill="transparent"
          pointerEvents="all"
        />
        <AnimatePresence mode="wait" initial={false}>
          {shouldShowGlow(1) && (
            <motion.path
              d={getTrianglePath()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              strokeWidth={20}
              className="stroke-foreground"
              style={{ 
                filter: "blur(15px)",
                fill: "transparent",
                strokeLinecap: "round" as const
              }}
            />
          )}
        </AnimatePresence>
        <motion.path
          d={getTrianglePath()}
          className="stroke-foreground"
          variants={variants}
          custom={1}
          initial="hidden"
          animate="visible"
          style={shape}
        />
      </g>

      {/* Square Group (index 2) */}
      <g
        onClick={() => handleSymbolClick(2)}
        onMouseEnter={() => setHoveredSymbol(2)}
        onMouseLeave={() => setHoveredSymbol(null)}
        className="cursor-pointer"
      >
        <rect
          x={SQUARE_X - SYMBOL_HEIGHT / 2 - CLICK_PADDING - GLOW_PADDING}
          y={BASE_Y - CLICK_PADDING - GLOW_PADDING}
          width={SYMBOL_HEIGHT + (CLICK_PADDING + GLOW_PADDING) * 2}
          height={SYMBOL_HEIGHT + (CLICK_PADDING + GLOW_PADDING) * 2}
          fill="transparent"
          pointerEvents="all"
        />
        <AnimatePresence mode="wait" initial={false}>
          {shouldShowGlow(2) && (
            <motion.path
              d={getSquarePath()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              strokeWidth={20}
              className="stroke-foreground"
              style={{ 
                filter: "blur(15px)",
                fill: "transparent",
                strokeLinecap: "round" as const
              }}
            />
          )}
        </AnimatePresence>
        <motion.path
          d={getSquarePath()}
          className="stroke-foreground"
          variants={variants}
          custom={2}
          initial="hidden"
          animate="visible"
          style={shape}
        />
      </g>
    </motion.svg>
  );
}
