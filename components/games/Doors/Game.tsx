"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DoorChoiceProps {
  onDoorSelect: (door: "valhalla" | "hel") => void;
}

export default function DoorChoice({ onDoorSelect }: DoorChoiceProps) {
  const [hoveredDoor, setHoveredDoor] = useState<"valhalla" | "hel" | null>(null);

  return (
    <div className="flex flex-col items-center w-full mx-auto px-4">
      <motion.div
        className="text-foreground text-center font-serif italic text-2xl mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        "Choose your door..."
      </motion.div>
      
      <div className="flex flex-col sm:flex-row gap-16 sm:gap-32 w-full justify-center items-center">
        {/* White Door */}
        <motion.div
          className="relative cursor-pointer group"
          onClick={() => onDoorSelect("valhalla")}
          onHoverStart={() => setHoveredDoor("valhalla")}
          onHoverEnd={() => setHoveredDoor(null)}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Magical Glow */}
          <motion.div 
            className="absolute -inset-6 rounded-3xl bg-foreground opacity-0 blur-2xl transition-opacity duration-300"
            animate={{
              opacity: hoveredDoor === "valhalla" ? 0.2 : 0
            }}
          />
          
          {/* Door Frame */}
          <div className="relative">
            {/* Main Door */}
            <motion.div
              className="w-72 h-[28rem] rounded-t-xl relative overflow-hidden"
              style={{ 
                transformOrigin: "left",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)"
              }}
              animate={{
                rotateY: hoveredDoor === "valhalla" ? -8 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Door Design */}
              <div className="absolute inset-0 flex flex-col">
                {/* Top Panel */}
                <div className="h-1/3 border-b border-gray-200 p-6 flex items-center justify-center">
                  <motion.div
                    className="text-6xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ♠
                  </motion.div>
                </div>

                {/* Middle Panel */}
                <div className="flex-1 border-b border-gray-200 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          (Math.floor(i / 8) + i % 8) % 2 === 0
                            ? "bg-gray-100"
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-6xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      ♣
                    </motion.div>
                  </div>
                </div>

                {/* Bottom Panel */}
                <div className="h-1/3 p-6 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-16">
                      <div className="w-8 h-8 rounded-full border-4 border-gray-800 mx-auto" />
                      <div className="w-4 h-8 bg-gray-800 mx-auto" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-foreground/20"
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
                </div>

                {/* Door Handle */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-16 rounded-full bg-gray-800" />
                </div>
              </div>
            </motion.div>

            {/* Door Base */}
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-b-lg shadow-lg" />
          </div>

          {/* Door Label */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="font-serif text-lg text-foreground">White Door</div>
            <div className="text-sm text-foreground/60 italic mt-1">{"Spades & Clubs"}</div>
          </motion.div>
        </motion.div>

        {/* Black Door */}
        <motion.div
          className="relative cursor-pointer group"
          onClick={() => onDoorSelect("hel")}
          onHoverStart={() => setHoveredDoor("hel")}
          onHoverEnd={() => setHoveredDoor(null)}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Magical Glow */}
          <motion.div 
            className="absolute -inset-6 rounded-3xl bg-foreground opacity-0 blur-2xl transition-opacity duration-300"
            animate={{
              opacity: hoveredDoor === "hel" ? 0.2 : 0
            }}
          />
          
          {/* Door Frame */}
          <div className="relative">
            {/* Main Door */}
            <motion.div
              className="w-72 h-[28rem] rounded-t-xl relative overflow-hidden"
              style={{ 
                transformOrigin: "left",
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                boxShadow: "0 0 30px rgba(0, 0, 0, 0.4)"
              }}
              animate={{
                rotateY: hoveredDoor === "hel" ? -8 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Door Design */}
              <div className="absolute inset-0 flex flex-col">
                {/* Top Panel */}
                <div className="h-1/3 border-b border-gray-700 p-6 flex items-center justify-center">
                  <motion.div
                    className="text-6xl text-red-500"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ♥
                  </motion.div>
                </div>

                {/* Middle Panel */}
                <div className="flex-1 border-b border-gray-700 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          (Math.floor(i / 8) + i % 8) % 2 === 0
                            ? "bg-white/10"
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-6xl text-red-500"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      ♦
                    </motion.div>
                  </div>
                </div>

                {/* Bottom Panel */}
                <div className="h-1/3 p-6 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-16">
                      <div className="w-8 h-8 rounded-full border-4 border-gray-300 mx-auto" />
                      <div className="w-4 h-8 bg-gray-300 mx-auto" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-foreground/20"
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
                </div>

                {/* Door Handle */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-16 rounded-full bg-gray-300" />
                </div>
              </div>
            </motion.div>

            {/* Door Base */}
            <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-b-lg shadow-lg" />
          </div>

          {/* Door Label */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="font-serif text-lg text-foreground">Black Door</div>
            <div className="text-sm text-foreground/60 italic mt-1">{"Hearts & Diamonds"}</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
