"use client";

import { cn } from "@/lib/utils";

interface DiamondProps {
  number: number;
  onClick: () => void;
  className?: string;
}

export default function Diamond({
  number,
  onClick,
  className
}: DiamondProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "aspect-square rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold flex items-center justify-center transition-colors",
        className
      )}
    >
      {number}
    </button>
  );
} 