"use client";

import { useState, useEffect } from "react";
import BidCard from "@/components/games/Bidding/BidCard";
import BidderList from "@/components/games/Bidding/BidderList";
import { motion, AnimatePresence } from "framer-motion";
import { GameTimer } from "@/components/ui/GameTimer";
import { Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({
  weight: "400",
  subsets: ["latin"],
});

interface Bidder {
  address: string;
  name: string;
  last_bid: number;
  tokens_remaining: number;
}

export default function BiddingPage() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [dataFlickers, setDataFlickers] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [bidders, setBidders] = useState<Bidder[]>([]);

  // Game timer end time (5 minutes from now)
  const endTime = new Date(Date.now() + 5 * 60 * 1000).getTime();

  // Mock bidder data
  useEffect(() => {
    // Generate some mock bidders
    const mockBidders: Bidder[] = [
      {
        address: "0x1a2b",
        name: "CyberBidder_42",
        last_bid: 5000000,
        tokens_remaining: 90000000,
      },
    ];

    setBidders(mockBidders);

    return () => {};
  }, []);

  // Random glitch effect timing
  useEffect(() => {
    const loadSequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoaded(true);

      await new Promise((resolve) => setTimeout(resolve, 300));
      setGridVisible(true);

      generateCodeLines();
    };

    loadSequence();

    // Set up glitch intervals
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, Math.random() * 6000 + 2000);

    // Set up data flicker intervals
    const flickerInterval = setInterval(() => {
      const newFlickers = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 20)
      );
      setDataFlickers(newFlickers);
    }, 500);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(flickerInterval);
    };
  }, []);

  // Generate mock code lines for ambient background
  const generateCodeLines = () => {
    const functions = [
      "function calculateBid()",
      "async verifyTransaction()",
      "const deploySmartContract = () =>",
      "function encryptionProtocol()",
      "initializeBlockchain()",
      "async function secureConnection()",
    ];

    const vars = [
      "let totalValue = 0x1a2b3c4d",
      "const blockHeight = 7912442",
      "transactionPool.push(newTx)",
      "await validateSignature(tx)",
      "gasEstimate *= 1.2",
      "verified = await proofOfWork()",
    ];

    const keywords = [
      "if (bidValue > previousBid)",
      "while (mining)",
      "for (let i=0; i<txPool.length; i++)",
      "try { validateBid() }",
      "if (timestamp < deadline)",
      "switch (transactionStatus)",
    ];

    const comments = [
      "// Secure bidding mechanism",
      "// Encryption protocol v3.2",
      "// Handle transaction failures",
      "// Verify wallet signature",
      "// Zero-knowledge proof",
      "// Prevent frontrunning",
    ];

    const generatedLines = [];
    for (let i = 0; i < 15; i++) {
      const category = Math.floor(Math.random() * 4);
      const lineIndex = Math.floor(Math.random() * 6);
      switch (category) {
        case 0:
          generatedLines.push(functions[lineIndex]);
          break;
        case 1:
          generatedLines.push(vars[lineIndex]);
          break;
        case 2:
          generatedLines.push(keywords[lineIndex]);
          break;
        case 3:
          generatedLines.push(comments[lineIndex]);
          break;
      }
    }

    setCodeLines(generatedLines);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex flex-col items-center justify-center">

     

      {/* Background Grid */}
      <AnimatePresence>
        {gridVisible && (
          <motion.div
            className="absolute inset-0 z-0 opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(20, 230, 200, 0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                backgroundPosition: "-19px -19px",
              }}
            />

            {/* Grid data points - these flicker */}
            {dataFlickers.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white"
                style={{
                  top: `${(pos * 5) % 100}%`,
                  left: `${(pos * 7 + i * 15) % 100}%`,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

  {/* Game Timer Component */}
  <div
          className={`text-4xl md:text-5xl font-bold mb-8 tracking-wider ${silkscreen.className}`}
        >
          <GameTimer endTime={60} />
        </div>

      {/* Code snippet background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-10 top-20 w-60 opacity-10">
          <div className="font-mono text-white text-xs leading-tight">
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.8, x: 0 }}
                transition={{ delay: i * 0.1 + 0.5 }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute -right-10 bottom-20 w-60 opacity-10">
          <div className="font-mono text-white text-xs leading-tight">
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.8, x: 0 }}
                transition={{ delay: i * 0.1 + 0.8 }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content container with glitch effect */}
      <motion.div
        className="relative z-10 min-h-screen pt-20 pb-16 flex flex-col items-center"
        animate={
          glitchActive
            ? {
                x: [0, -3, 5, -2, 0],
                filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
              }
            : {}
        }
        transition={{ duration: 0.2 }}
      >
       

        {/* Status indicators */}
        <div className="w-full max-w-4xl mb-8 flex justify-between px-4">
          <motion.div
            className="text-xs font-mono text-white flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              className="w-2 h-2 bg-white rounded-full mr-2"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            STATUS: ACTIVE
          </motion.div>

          <motion.div
            className="text-xs font-mono text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            PROTOCOL::BID_OR_DIE
          </motion.div>
        </div>

        {/* Loading sequence */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <motion.div
                  className="mb-6 relative"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-16 h-16 rounded-full border-2 border-neon-400/20 border-t-neon-400" />
                </motion.div>

                <div className="text-sm font-mono text-neon-300/80">
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    INITIALIZING BIDDING PROTOCOL...
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 px-4">
          {/* Main bidding card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative lg:w-2/3"
          >
            {/* Tech Frame */}
            <div className="absolute -inset-3 -z-10">
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-neon-400/70" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-neon-400/70" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-neon-400/70" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-neon-400/70" />
            </div>

            {/* Card component */}
            <BidCard />
          </motion.div>

          {/* Bidder list with futuristic styling */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative lg:w-1/3 h-fit"
          >
            <BidderList bidders={bidders} />
          </motion.div>
        </div>

        {/* Digital artifacts - random squares that appear and disappear */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="fixed w-2 h-2 bg-neon-300/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.7, 0],
              x: [0, Math.random() * 10 - 5, 0],
              y: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              repeatDelay: Math.random() * 5,
            }}
          />
        ))}

       

        {/* Footer tech elements */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
          <div className="flex justify-between items-center opacity-50">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-neon-500/30 to-transparent" />

            <div className="px-4 text-[8px] font-mono text-neon-300">
              NEXUS PROTOCOL • VER 2.4.701 • SECURE
            </div>

            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-neon-500/30 to-transparent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
