"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Iceland, Quantico } from "next/font/google";
import MatrixRain from "@/components/effects/MatrixRain";
import MatrixRainMobile from "@/components/effects/MatrixRainMobile";
import TypingText from "@/components/effects/TypingText";
import { useState, useEffect, useRef } from "react";

const iceland = Iceland({
  weight: "400",
  subsets: ["latin"],
});

const quantico = Quantico({
  weight: "400",
  subsets: ["latin"],
});

export default function LandingPage() {
  return (
    <div className="flex flex-col relative">
      {/* Main image section */}
      <div className="w-full relative aspect-[9/16]">
        {/* Gradient Overlay - Mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% via-black/70 via-80% to-black z-20 max-md:block hidden"></div>
        {/* Gradient Overlay - Desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% via-black/70 via-80% to-black z-20 md:block hidden"></div>
        <Image
          src="/images/landing_bg.png"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full opacity-100 object-top z-0"
          quality={100}
          onLoadingComplete={(img) => {
            if (img.complete) {
              img.style.height = "auto";
            }
          }}
        />

        {/* Matrix Rain Effect - Desktop */}
        <div className="hidden md:block absolute inset-0 z-10">
          <MatrixRain />
        </div>
        {/* Matrix Rain Effect - Mobile */}
        <div className="block md:hidden absolute inset-0 z-10">
          <MatrixRainMobile />
        </div>

      
        {/* Button Group container */}
        <div className="absolute top-[40%] left-0 right-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative w-full max-w-sm md:max-w-md lg:max-w-4xl flex flex-col gap-4"
          >
            <Link href="/" className="block group w-full">
              <div className="relative transform transition-transform duration-300 group-hover:scale-105 h-full flex items-center justify-center">
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative py-4 sm:py-4 md:py-6 xl:py-8 px-4">
                  <h2
                    className={`text-xl sm:text-2xl md:text-4xl 2xl:text-7xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground animate-text-shimmer ${iceland.className}`}
                  >
                    Enter Game
                  </h2>
                </div>
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </Link>

            <Link
              href="https://alice-3.gitbook.io/alice/season-0/token-info"
              className="block group w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative transform transition-transform duration-300 group-hover:scale-105 h-full flex items-center justify-center">
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative py-4 sm:py-4 md:py-6 xl:py-8 px-4">
                  <h2
                    className={`text-xl sm:text-2xl md:text-4xl xl:text-4xl 2xl:text-7xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground animate-text-shimmer ${iceland.className}`}
                  >
                    Token
                  </h2>
                </div>
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </Link>

            <Link
              href="https://alice-3.gitbook.io/alice/what-is-alice/quickstart"
              className="block group w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative transform transition-transform duration-300 group-hover:scale-105 h-full flex items-center justify-center">
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative py-4 sm:py-4 md:py-6 xl:py-8 px-4">
                  <h2
                    className={`text-xl sm:text-2xl md:text-4xl xl:text-4xl 2xl:text-7xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground animate-text-shimmer ${iceland.className}`}
                  >
                    Docs
                  </h2>
                </div>
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
      {/* Grid Section */}
      <div className="absolute top-[75%] sm:top-[65%] md:top-[65%] lg:top-[60%] xl:top-[60%] 2xl:top-[60%] left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <h1 className={`text-3xl md:text-4xl lg:text-5xl text-white text-center mb-8 ${iceland.className}`}>
            The On-Chain <span className="italic">Squid Game</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Box 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full"
            >
              <div className="relative bg-gradient-to-b from-overlay-dark to-background p-8 rounded-lg shadow-glow-sm backdrop-blur-sm w-full h-full flex flex-col">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-200"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary-200"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary-200"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-200"></div>
                
                <div className={`text-3xl md:text-3xl text-white text-center ${iceland.className} min-h-[4rem] flex items-center justify-center`}>
                  1,000 Players. One Survivor.
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent my-6"></div>
                <div className={`text-lg md:text-xl opacity-80 text-left flex-1 flex flex-col ${quantico.className}`}>
                  <div>
                    A live gaming experience made possible by Sonic's instant
                    finality and near-limitless throughput.
                    <br />
                    <br />
                    Real-time, fast paced games with just moments to make your
                    move. Only on Sonic.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Box 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full h-full"
            >
              <div className="relative bg-gradient-to-b from-overlay-dark to-background p-8 rounded-lg shadow-glow-sm backdrop-blur-sm w-full h-full flex flex-col">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-200"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary-200"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary-200"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-200"></div>
                
                <div className={`text-3xl md:text-3xl text-white text-center ${iceland.className} min-h-[4rem] flex items-center justify-center`}>
                  Season 0
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent my-6"></div>
                <div className={`text-lg md:text-xl opacity-80 text-left flex-1 flex flex-col ${quantico.className}`}>
                  <div>
                    The beta launch of Alice—our first 10 games where
                    early players help test, compete, and shape the game from
                    the ground up. But this isn't just early access—it's also
                    our token distribution event.
                    <br />
                    <br />
                    We are distributing <span className="italic">50%</span> of the total ALICE supply to our early
                    users. For now, everyone is a winner.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Box 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full h-full"
            >
              <div className="relative bg-gradient-to-b from-overlay-dark to-background p-8 rounded-lg shadow-glow-sm backdrop-blur-sm w-full h-full flex flex-col">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-200"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary-200"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary-200"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-200"></div>
                
                <div className={`text-3xl md:text-3xl text-white text-center ${iceland.className} min-h-[4rem] flex items-center justify-center`}>
                  Features
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent my-6"></div>
                <div className={`text-lg md:text-xl opacity-80 text-left flex-1 flex flex-col ${quantico.className}`}>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Wallet Gated Chatrooms</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Variety of Mini-Games</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Dynamic Grouping</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Secrecy ensured through Commit/Reveal Systems</span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
