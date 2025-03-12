"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSymbols from "./AnimatedSymbols";

interface DoorSelectionProps {
  onDoorSelect: (doorIndex: number) => void;
  selectedDoor: number | null;
  isSelectionEnabled: boolean;
}

export default function DoorSelection({
  onDoorSelect,
  selectedDoor,
  isSelectionEnabled,
}: DoorSelectionProps) {
  const handleSymbolClick = (index: number) => {
    if (!isSelectionEnabled) return;
    onDoorSelect(index);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <AnimatedSymbols 
        onSymbolClick={handleSymbolClick}
        className="max-w-2xl w-full"
      />
      {selectedDoor !== null && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xl text-neon-300"
        >
          You selected symbol {selectedDoor + 1}
        </motion.p>
      )}
    </div>
  );
} 