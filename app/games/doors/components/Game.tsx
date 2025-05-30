"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Symbol = "triangle" | "square" | "circle" | "x";
type DoorSymbols = [Symbol, Symbol]; // Tuple of two symbols for each round

interface DoorChoiceProps {
  onDoorSelect: (door: "door1" | "door2") => void;
  round: number;
}

// Define symbols for each round [door1 symbol, door2 symbol]
const ROUND_SYMBOLS: DoorSymbols[] = [
  ["circle", "x"],         // Round 1
  ["triangle", "square"],  // Round 2
  ["x", "triangle"],       // Round 3
  ["square", "circle"],    // Round 4
  ["circle", "triangle"],  // Round 5
  ["x", "square"],        // Round 6
  ["triangle", "x"],      // Round 7
  ["square", "triangle"], // Round 8
  ["circle", "square"],   // Round 9
  ["x", "circle"],       // Round 10
];

// Symbol components
const Symbols = {
  triangle: (
    <path 
      d="M65 20L110 100H20L65 20Z" 
      strokeWidth="8"
      fill="none"
    />
  ),
  square: (
    <rect 
      x="30" 
      y="30" 
      width="70" 
      height="70" 
      strokeWidth="8"
      fill="none"
    />
  ),
  circle: (
    <circle 
      cx="65" 
      cy="65" 
      r="40" 
      strokeWidth="8"
      fill="none"
    />
  ),
  x: (
    <path 
      d="M30 30L100 100M100 30L30 100" 
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
  ),
};

export default function DoorChoice({ onDoorSelect, round }: DoorChoiceProps) {
  const [hoveredDoor, setHoveredDoor] = useState<"door1" | "door2" | null>(null);
  
  // Get symbols for current round (fallback to first round if round is invalid)
  const [door1Symbol, door2Symbol] = ROUND_SYMBOLS[round - 1] || ROUND_SYMBOLS[0];

  return (
    <div className="flex flex-col items-center w-full mx-auto px-4">
      <div className="flex flex-row gap-8 sm:gap-12 md:gap-20 w-full justify-center items-center">
        {/* Door 1 */}
        <motion.div
          className="relative cursor-pointer w-[40vw] sm:w-[220px]"
          onClick={() => onDoorSelect("door1")}
          onHoverStart={() => setHoveredDoor("door1")}
          onHoverEnd={() => setHoveredDoor(null)}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Door Structure */}
          <div className="relative h-[22rem] w-full bg-foreground rounded-lg border border-foreground/20">
            {/* Hover Glow */}
            <motion.div 
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: hoveredDoor === "door1" ? "0 0 20px var(--foreground)" : "none"
              }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Symbol */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-12">
              <svg 
                width="130" 
                height="130" 
                viewBox="0 0 130 130" 
                fill="none" 
                className="stroke-background"
                xmlns="http://www.w3.org/2000/svg"
              >
                {Symbols[door1Symbol]}
              </svg>
            </div>
          </div>
        </motion.div>
        
        {/* Door 2 */}
        <motion.div
          className="relative cursor-pointer w-[40vw] sm:w-[220px]"
          onClick={() => onDoorSelect("door2")}
          onHoverStart={() => setHoveredDoor("door2")}
          onHoverEnd={() => setHoveredDoor(null)}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Door Structure */}
          <div className="relative h-[22rem] w-full bg-foreground rounded-lg border border-foreground/20">
            {/* Hover Glow */}
            <motion.div 
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: hoveredDoor === "door2" ? "0 0 20px var(--foreground)" : "none"
              }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Symbol */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-12">
              <svg 
                width="130" 
                height="130" 
                viewBox="0 0 130 130" 
                fill="none" 
                className="stroke-background"
                xmlns="http://www.w3.org/2000/svg"
              >
                {Symbols[door2Symbol]}
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
