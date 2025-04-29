'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Iceland } from 'next/font/google';
import MatrixRain from '@/components/effects/MatrixRain';
import MatrixRainMobile from '@/components/effects/MatrixRainMobile';
import { useState, useEffect, useRef } from 'react';

const iceland = Iceland({ 
  weight: '400',
  subsets: ['latin']
});

export default function LandingPage() {
  return (
    <div className="flex flex-col relative">
      {/* Main image section */}
      <div className="w-full relative aspect-[9/16]">
        <Image
          src="/images/bg_mobile.png"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full opacity-100 object-top max-md:block hidden z-0"
          quality={100}
          onLoadingComplete={(img) => {
            if (img.complete) {
              img.style.height = 'auto';
            }
          }}
        />
        <Image
          src="/images/bg_desktop.png"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full opacity-100 object-top md:block hidden z-0"
          quality={100}
          onLoadingComplete={(img) => {
            if (img.complete) {
              img.style.height = 'auto';
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

        {/* Enter Game Button - Overlay on bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative w-full max-w-md h-12 sm:h-16 md:h-24 xl:h-32 2xl:h-40 pb-2 md:pb-8 xl:pb-16 2xl:pb-32 flex items-center justify-center"
          >
            <Link href="/" className="block group w-full h-full">
              <div className="relative transform transition-transform duration-300 group-hover:scale-105 h-full flex items-center justify-center">
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative py-4 sm:py-4 md:py-6 xl:py-12 2xl:py-32 px-4">
                  <h2 className={`text-xl sm:text-2xl md:text-4xl xl:text-5xl 2xl:text-7xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground animate-text-shimmer ${iceland.className}`}>
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
