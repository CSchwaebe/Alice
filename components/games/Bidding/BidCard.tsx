"use client";

import { useState, useEffect } from 'react';
import ViewportDrawer from '@/components/ui/ViewportDrawer';
import { motion, AnimatePresence } from 'framer-motion';

export default function BidCard() {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const [dataStream, setDataStream] = useState<string[]>([]);
  const userBalance = 100_000_000;

  // Random glitch effect timing
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
      
      // Randomly glitch text too
      if (Math.random() > 0.7) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 200);
      }
    }, Math.random() * 5000 + 2000);
    
    // Generate random data stream for decoration
    const streamInterval = setInterval(() => {
      const newData = Array.from({ length: 8 }, () => 
        Math.random().toString(16).substring(2, 6)
      );
      setDataStream(newData);
    }, 500);
    
    return () => {
      clearInterval(glitchInterval);
      clearInterval(streamInterval);
    };
  }, []);

  // Format number with commas
  const formatNumber = (num: string) => {
    // Remove any non-digits
    const cleanNum = num.replace(/[^\d]/g, '');
    // Add commas
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Remove commas and get raw number
  const getRawNumber = (formattedNum: string) => {
    return formattedNum.replace(/,/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = getRawNumber(e.target.value);
    if (!rawValue || /^\d+$/.test(rawValue)) {
      setBidAmount(formatNumber(rawValue));
      
      // Trigger mini glitch on input
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }
  };

  const handleBidSubmit = () => {
    const rawBid = getRawNumber(bidAmount);
    if (!rawBid || Number(rawBid) <= 0 || Number(rawBid) > userBalance) return;
    
    // Heavy glitch on submission
    setGlitchActive(true);
    setTimeout(() => {
      setGlitchActive(false);
      setShowConfirmation(true);
    }, 300);
  };

  const handleConfirm = () => {
    const rawBid = getRawNumber(bidAmount);
    console.log(`Bid confirmed: ${rawBid}`); // Raw number without commas
    setShowConfirmation(false);
    setBidAmount('');
    // TODO: Handle the actual bid submission
  };

  return (
    <div className="w-full max-w-4xl relative">
      {/* Ambient background animations */}
      <div className="absolute -inset-4 bg-black rounded-xl backdrop-blur-sm -z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>
      
      {/* Data streams in background */}
      <div className="absolute -right-3 top-0 bottom-0 w-6 overflow-hidden text-[8px] font-mono text-white/30 flex flex-col justify-between py-4">
        {dataStream.map((data, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: i * 0.2 }}
          >
            {data}
          </motion.div>
        ))}
      </div>
      
      {/* Main card with glitch effect */}
      <motion.div 
        className="bg-black rounded-lg bg-transparent p-6 relative overflow-hidden"
        animate={{
          x: glitchActive ? [0, -3, 5, -2, 0] : 0,
          opacity: glitchActive ? [1, 0.8, 1, 0.9, 1] : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        
        
        {/* Glitch overlay */}
        <AnimatePresence>
          {glitchActive && (
            <motion.div 
              className="absolute inset-0 bg-white/10 mix-blend-screen pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        
        {/* Futuristic header with animated border */}
        <div className="relative mb-8">
          <div className="absolute -inset-1">
            <div className="relative h-full w-full overflow-hidden">
              <motion.div 
                className="absolute inset-0 border border-white/30 rounded"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/80" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/80" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/80" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/80" />
            </div>
          </div>
          
          <h2 className={`text-2xl text-white font-bold text-center py-1 tracking-widest ${glitchText ? 'opacity-90' : ''}`}>
            <motion.span
              animate={{
                x: glitchText ? [0, 2, -1, 0] : 0,
                opacity: glitchText ? [1, 0.8, 1] : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              PLACE YOUR BID
            </motion.span>
          </h2>
          
          {/* System ID code */}
          <div className="absolute -bottom-3 right-0 text-[8px] font-mono text-white/50">
            SYS::{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
          </div>
        </div>

        {/* Balance display with tech elements */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 rounded bg-black/50 backdrop-blur-sm -z-10" />
          <div className="absolute h-full w-1 bg-white/20 left-0" />
          <div className="absolute h-full w-1 bg-white/20 right-0" />
          
          <div className="py-3 px-4">
            <div className="text-gray-400 text-sm mb-1 flex items-center">
              <motion.div 
                className="w-1.5 h-1.5 bg-white rounded-full mr-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              YOUR BALANCE
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-white text-xl font-mono tracking-wider">
                {userBalance.toLocaleString()}
              </div>
              
              {/* Animated credit bar */}
              <div className="h-1 w-16 bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white/70"
                  animate={{ width: ["60%", "90%", "60%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bid input with techy styling */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2 flex items-center">
            <div className="w-1 h-4 bg-white mr-2"></div>
            BID AMOUNT
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={bidAmount}
              onChange={handleInputChange}
              className="w-full bg-black/40 border border-white/20 rounded-lg
                       px-4 py-3 text-white font-mono text-lg tracking-wider
                       focus:outline-none focus:border-white/60 focus:bg-black/60
                       transition-colors duration-200
                       placeholder:text-white/20"
              placeholder="Enter amount"
            />
            
            {/* Tech decorators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/50 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/50 pointer-events-none" />
            
            {/* Input status indicator */}
            <motion.div 
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${bidAmount ? 'bg-white' : 'bg-white/30'}`}
              animate={{ opacity: bidAmount ? [0.7, 1, 0.7] : 0.3 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* Balance indicator */}
          <div className="mt-2 text-xs font-mono text-white/50 flex justify-between">
            <span>Available: {userBalance.toLocaleString()}</span>
            {bidAmount && (
              <span className={Number(getRawNumber(bidAmount)) > userBalance ? 'text-red-400' : 'text-white/50'}>
                Remaining: {(userBalance - Number(getRawNumber(bidAmount))).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Submit button with effects */}
        <motion.button
          onClick={handleBidSubmit}
          disabled={!bidAmount || Number(getRawNumber(bidAmount)) <= 0 || Number(getRawNumber(bidAmount)) > userBalance}
          className="w-full bg-white/80 text-black py-3 rounded-lg
                   font-mono tracking-widest text-lg
                   hover:bg-white transition-colors duration-200 relative
                   disabled:bg-black disabled:text-gray-500
                   overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">SUBMIT</span>
          
          {/* Button light effect */}
          <motion.div 
            className="absolute inset-0 bg-white/30"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
            style={{ transformOrigin: "left" }}
          />
          
          {/* Button glitch effect on hover */}
          <motion.div 
            className="absolute inset-y-0 w-1/6 bg-white/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: ["100%", "200%"] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.button>
        
        {/* Tech decoration */}
        <div className="absolute bottom-2 left-2 text-[6px] font-mono text-white/30">
          v2.4.7
        </div>
      </motion.div>

      {/* Enhanced Confirmation Popup */}
      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <div className="p-6 text-center relative overflow-hidden">
          {/* Scanline effect */}
          <motion.div 
            className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"
            animate={{ top: ["100%", "-10%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Confirmation frame */}
          <div className="relative border border-white/30 rounded-lg p-6 bg-black/80 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white" />
            
            <h3 className="text-xl text-white mb-2 font-mono tracking-wider">
              CONFIRM TRANSACTION
            </h3>
            
            <div className="mb-6 text-gray-300">
              <div className="text-sm opacity-70 mb-1">BID AMOUNT</div>
              <motion.div 
                className="text-2xl text-white font-mono"
                animate={{ 
                  textShadow: ["0 0 8px rgba(34, 211, 238, 0)", "0 0 8px rgba(34, 211, 238, 0.5)", "0 0 8px rgba(34, 211, 238, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {bidAmount}
              </motion.div>
              
              {/* System verification */}
              <div className="text-[10px] mt-2 font-mono text-white/50">
                <span>VERIFICATION: </span>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  VALIDATED
                </motion.span>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-3 rounded-lg bg-black text-gray-300 
                         hover:bg-black/80 transition-colors duration-200
                         border border-black"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                CANCEL
              </motion.button>
              
              <motion.button
                onClick={handleConfirm}
                className="px-6 py-3 rounded-lg bg-white text-black
                         hover:bg-white transition-colors duration-200
                         relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">CONFIRM</span>
                
                {/* Animated glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </ViewportDrawer>
    </div>
  );
} 