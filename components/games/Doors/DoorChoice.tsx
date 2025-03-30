"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import GameRules from "./GameRules";

interface DoorChoiceProps {
  onDoorSelect: (door: "valhalla" | "hel") => void;
}

export default function DoorChoice({ onDoorSelect }: DoorChoiceProps) {
  const [hoveredDoor, setHoveredDoor] = useState<"valhalla" | "hel" | null>(null);
  const [pulseValue, setPulseValue] = useState(0);

  // Animation pulse effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseValue((prev) => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full mx-auto px-4">
      
      
      {/* Door Container - Adjusted for better mobile alignment */}
      <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 w-full justify-center items-center">
        {/* Valhalla Door - White Theme */}
        <motion.div
          className="relative cursor-pointer"
          onClick={() => onDoorSelect("valhalla")}
          onHoverStart={() => setHoveredDoor("valhalla")}
          onHoverEnd={() => setHoveredDoor(null)}
          whileTap={{ scale: 0.98 }}
        >
          {/* Door Frame with Edge Effect */}
          <div className="relative" style={{ perspective: "1000px" }}>
            {/* Glow Effect */}
            <motion.div 
              className="absolute -inset-3 rounded-3xl opacity-0"
              animate={{
                opacity: hoveredDoor === "valhalla" ? [0.2, 0.4, 0.2] : 0,
                boxShadow: "0 0 40px 15px rgba(255, 255, 255, 0.7)"
              }}
              transition={{
                opacity: { duration: 2, repeat: Infinity }
              }}
            />
            
            {/* Glass Door with Opening Effect - Now opening outward */}
            <motion.div
              className="w-64 h-96 rounded-xl relative overflow-hidden border border-primary-200"
              style={{ 
                transformOrigin: "left",
                transformStyle: "preserve-3d"
              }}
              animate={{
                rotateY: hoveredDoor === "valhalla" ? -10 : 0,
                boxShadow: hoveredDoor === "valhalla"
                  ? "0 0 30px 8px rgba(255, 255, 255, 0.7), inset 0 0 20px 5px rgba(255, 255, 255, 0.5)"
                  : "0 0 20px 5px rgba(255, 255, 255, 0.4), inset 0 0 10px 2px rgba(255, 255, 255, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Door Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, rgba(20, 20, 25, 0.85) 0%, rgba(30, 30, 40, 0.85) 100%)",
                  backdropFilter: "blur(4px)",
                }}
              />
              
              {/* Futuristic Diamond Grid - Using theme colors */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="futuristicGridValhalla" width="40" height="40" patternUnits="userSpaceOnUse">
                      {/* Diamond Grid Structure */}
                      <path 
                        d="M0,20 L20,0 L40,20 L20,40 Z" 
                        fill="none" 
                        className="stroke-primary-400"
                        strokeWidth="0.5"
                      />
                      <path 
                        d="M20,0 L20,40 M0,20 L40,20" 
                        fill="none" 
                        className="stroke-primary-200"
                        strokeWidth="0.5"
                      />
                      
                      {/* Tech Detail Elements */}
                      <circle cx="20" cy="20" r="1" className="fill-foreground" />
                      <circle cx="20" cy="20" r="4" fill="none" className="stroke-primary-300" strokeWidth="0.5" />
                      
                      {/* Connection Nodes */}
                      <circle cx="20" cy="0" r="0.75" className="fill-primary-400" />
                      <circle cx="20" cy="40" r="0.75" className="fill-primary-400" />
                      <circle cx="0" cy="20" r="0.75" className="fill-primary-400" />
                      <circle cx="40" cy="20" r="0.75" className="fill-primary-400" />
                      
                      {/* Circuit Traces */}
                      <path 
                        d="M10,10 L15,15 M25,15 L30,10 M10,30 L15,25 M30,30 L25,25" 
                        className="stroke-primary-400"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#futuristicGridValhalla)" />
                </svg>
                
                {/* Animated Grid Pulse */}
                <motion.div 
                  className="absolute inset-0 bg-foreground/5"
                  animate={{ 
                    opacity: [0, 0.1, 0],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </div>
              
              {/* Door Inner Frame */}
              <motion.div
                className="absolute inset-2 rounded-lg border border-primary-200"
                animate={{
                  boxShadow: hoveredDoor === "valhalla"
                    ? "inset 0 0 15px 3px rgba(255, 255, 255, 0.25)"
                    : "inset 0 0 10px 2px rgba(255, 255, 255, 0.15)"
                }}
              />
              
              {/* Power Lines - Tech Elements */}
              <div className="absolute h-full w-1 left-8 bg-gradient-to-b from-primary-200/0 via-primary-200/20 to-primary-200/0"></div>
              <div className="absolute h-full w-1 right-8 bg-gradient-to-b from-primary-200/0 via-primary-200/20 to-primary-200/0"></div>
              
              {/* Data Flow Animation */}
              <motion.div 
                className="absolute w-px h-6 bg-primary-200"
                animate={{ 
                  top: ["-5%", "105%"],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  ease: "linear" 
                }}
              />
              <motion.div 
                className="absolute w-px h-6 bg-primary-200"
                animate={{ 
                  top: ["105%", "-5%"],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 2,
                  ease: "linear" 
                }}
              />
              
              {/* Door Hinges */}
              <div className="absolute left-0 top-10 w-1 h-8 bg-primary-200/30 rounded-r-sm"></div>
              <div className="absolute left-0 bottom-10 w-1 h-8 bg-primary-200/30 rounded-r-sm"></div>
              
              {/* Vertical Line Detail */}
              <div className="absolute h-full w-px bg-primary-200/30 left-1/2 transform -translate-x-1/2" />
              
              {/* Nordic Symbol - Brighter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative w-28 h-28"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {/* Symbol Glow - Enhanced */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)",
                    }}
                    animate={{
                      filter: hoveredDoor === "valhalla"
                        ? "blur(20px)" 
                        : "blur(15px)"
                    }}
                  />
                  
                  {/* Symbol - Brighter */}
                  <svg className="w-full h-full" viewBox="0 0 50 50">
                    <motion.path
                      d="M25 10 L25 40 M25 10 L15 25 M25 10 L35 25 M15 25 L35 25"
                      stroke="rgba(255,255,255,1)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))"
                      }}
                    />
                  </svg>
                </motion.div>
              </div>
              
              {/* Horizontal Line Details (door panels) */}
              <div className="absolute w-full h-px bg-primary-200/20 top-1/4" />
              <div className="absolute w-full h-px bg-primary-200/20 top-3/4" />
              
              {/* Scanline Effect */}
              <motion.div
                className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-primary-200/10 to-transparent pointer-events-none"
                style={{ top: "-20%" }}
                animate={{ top: ["100%", "-20%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Door Handle */}
              <div className="absolute right-3 top-1/2 w-2 h-20 bg-primary-200/20 rounded-full -translate-y-1/2 border border-primary-200/40">
                <motion.div
                  className="absolute inset-x-0 h-1/2 top-0 bg-primary-200/30 rounded-t-full"
                  animate={{
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Hel Door - Red Theme */}
        <motion.div
          className="relative cursor-pointer"
          onClick={() => onDoorSelect("hel")}
          onHoverStart={() => setHoveredDoor("hel")}
          onHoverEnd={() => setHoveredDoor(null)}
          whileTap={{ scale: 0.98 }}
        >
          {/* Door Frame with Edge Effect */}
          <div className="relative" style={{ perspective: "1000px" }}>
            {/* Glow Effect */}
            <motion.div 
              className="absolute -inset-3 rounded-3xl opacity-0"
              animate={{
                opacity: hoveredDoor === "hel" ? [0.2, 0.4, 0.2] : 0,
                boxShadow: "0 0 40px 15px rgba(220, 38, 38, 0.7)"
              }}
              transition={{
                opacity: { duration: 2, repeat: Infinity }
              }}
            />
            
            {/* Glass Door with Opening Effect - Now opening outward */}
            <motion.div
              className="w-64 h-96 rounded-xl relative overflow-hidden border border-red-500/50"
              style={{ 
                transformOrigin: "left",
                transformStyle: "preserve-3d"
              }}
              animate={{
                rotateY: hoveredDoor === "hel" ? -10 : 0,
                boxShadow: hoveredDoor === "hel"
                  ? "0 0 30px 8px rgba(220, 38, 38, 0.7), inset 0 0 20px 5px rgba(220, 38, 38, 0.5)"
                  : "0 0 20px 5px rgba(220, 38, 38, 0.4), inset 0 0 10px 2px rgba(220, 38, 38, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Door Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 10, 10, 0.85) 0%, rgba(50, 15, 15, 0.85) 100%)",
                  backdropFilter: "blur(4px)",
                }}
              />
              
              {/* Futuristic Diamond Grid - Red */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="futuristicGridHel" width="40" height="40" patternUnits="userSpaceOnUse">
                      {/* Diamond Grid Structure - Distorted for Hel */}
                      <path 
                        d="M0,20 L20,0 L40,20 L20,40 Z" 
                        fill="none" 
                        stroke="rgba(220,38,38,0.7)" 
                        strokeWidth="0.5"
                      />
                      <path 
                        d="M20,0 L20,40 M0,20 L40,20" 
                        fill="none" 
                        stroke="rgba(220,38,38,0.3)" 
                        strokeWidth="0.5"
                      />
                      
                      {/* Corrupted Tech Detail Elements */}
                      <path 
                        d="M18,18 L22,22 M18,22 L22,18" 
                        stroke="rgba(220,38,38,0.8)" 
                        strokeWidth="0.5"
                      />
                      <circle cx="20" cy="20" r="4" fill="none" stroke="rgba(220,38,38,0.5)" strokeWidth="0.5" strokeDasharray="1,1" />
                      
                      {/* Connection Nodes */}
                      <circle cx="20" cy="0" r="0.75" fill="rgba(220,38,38,0.6)" />
                      <circle cx="20" cy="40" r="0.75" fill="rgba(220,38,38,0.6)" />
                      <circle cx="0" cy="20" r="0.75" fill="rgba(220,38,38,0.6)" />
                      <circle cx="40" cy="20" r="0.75" fill="rgba(220,38,38,0.6)" />
                      
                      {/* Circuit Traces */}
                      <path 
                        d="M10,10 L15,15 M25,15 L30,10 M10,30 L15,25 M30,30 L25,25" 
                        stroke="rgba(220,38,38,0.6)" 
                        strokeWidth="0.5"
                        strokeDasharray="3,1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#futuristicGridHel)" />
                </svg>
                
                {/* Animated Grid Pulse */}
                <motion.div 
                  className="absolute inset-0 bg-red-500/5"
                  animate={{ 
                    opacity: [0, 0.15, 0],
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </div>
              
              {/* Door Inner Frame */}
              <motion.div
                className="absolute inset-2 rounded-lg border border-red-500/40"
                animate={{
                  boxShadow: hoveredDoor === "hel"
                    ? "inset 0 0 15px 3px rgba(220, 38, 38, 0.25)"
                    : "inset 0 0 10px 2px rgba(220, 38, 38, 0.15)"
                }}
              />
              
              {/* Power Lines - Tech Elements */}
              <div className="absolute h-full w-1 left-8 bg-gradient-to-b from-red-500/0 via-red-500/20 to-red-500/0"></div>
              <div className="absolute h-full w-1 right-8 bg-gradient-to-b from-red-500/0 via-red-500/20 to-red-500/0"></div>
              
              {/* Data Flow Animation */}
              <motion.div 
                className="absolute w-px h-6 bg-red-500/80 left-8"
                animate={{ 
                  top: ["-5%", "105%"],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatDelay: 1,
                  ease: "linear" 
                }}
              />
              <motion.div 
                className="absolute w-px h-6 bg-red-500/80 right-8"
                animate={{ 
                  top: ["105%", "-5%"],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatDelay: 2.5,
                  ease: "linear" 
                }}
              />
              
              {/* Door Hinges */}
              <div className="absolute left-0 top-10 w-1 h-8 bg-red-500/30 rounded-r-sm"></div>
              <div className="absolute left-0 bottom-10 w-1 h-8 bg-red-500/30 rounded-r-sm"></div>
              
              {/* Vertical Line Detail (like a door seam) */}
              <div className="absolute h-full w-px bg-red-500/30 left-1/2 transform -translate-x-1/2" />
              
              {/* Hel Symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative w-28 h-28"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {/* Symbol Glow - Fixed to be properly rounded */}
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      background: "radial-gradient(circle at center, rgba(220,38,38,0.35) 0%, rgba(220,38,38,0) 70%)",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%"
                    }}
                    animate={{
                      filter: hoveredDoor === "hel"
                        ? "blur(20px)" 
                        : "blur(15px)"
                    }}
                  />
                  
                  {/* Symbol */}
                  <svg className="w-full h-full" viewBox="0 0 50 50">
                    <motion.path
                      d="M25 15 A10 15 0 1 0 25 40 A10 15 0 1 0 25 15 Z M20 25 L22 28 M28 28 L30 25 M22 32 L28 32"
                      stroke="rgba(220,38,38,1)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(220,38,38,0.8))"
                      }}
                    />
                  </svg>
                </motion.div>
              </div>
              
              {/* Horizontal Line Details (door panels) */}
              <div className="absolute w-full h-px bg-red-500/20 top-1/4" />
              <div className="absolute w-full h-px bg-red-500/20 top-3/4" />
              
              {/* Scanline Effect */}
              <motion.div
                className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-red-500/10 to-transparent pointer-events-none"
                style={{ top: "-20%" }}
                animate={{ top: ["100%", "-20%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
              />
              
              {/* Door Handle */}
              <div className="absolute right-3 top-1/2 w-2 h-20 bg-red-500/20 rounded-full -translate-y-1/2 border border-red-500/40">
                <motion.div
                  className="absolute inset-x-0 h-1/2 top-0 bg-red-500/30 rounded-t-full"
                  animate={{
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
