'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Iceland } from 'next/font/google';
import MatrixRain from '@/components/effects/MatrixRain';
import { useState, useEffect, useRef } from 'react';

const iceland = Iceland({ 
  weight: '400',
  subsets: ['latin']
});

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Matrix Rain Effect */}
      <MatrixRain />

      {/* Main image section */}
      <div className="w-full relative min-h-screen aspect-[9/16]">
        <Image
          src="/images/bg_mobile.png"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full opacity-70 object-top max-md:block hidden z-0"
          quality={100}
          onLoadingComplete={(img) => {
            if (img.complete) {
              img.style.height = 'auto';
            }
          }}
        />
        <Image
          src="/images/bg_mobile.png"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full opacity-60 object-top md:block hidden z-0"
          quality={100}
          onLoadingComplete={(img) => {
            if (img.complete) {
              img.style.height = 'auto';
            }
          }}
        />

        {/* Enter Game Button - Overlay on bottom 1/16th of image */}
        <div className="absolute bottom-[0%] left-0 right-0 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative"
          >
            <Link href="/" className="block group">
              <div className="relative transform transition-transform duration-300 group-hover:scale-105">
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative py-4 px-4 backdrop-blur-sm">
                  <h2 className={`text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground animate-text-shimmer ${iceland.className}`}>
                    Enter Game
                  </h2>
                </div>
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
