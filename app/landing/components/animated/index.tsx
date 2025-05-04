"use client";

import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  useBasicAnimation, 
  useScrollFadeIn, 
  useHorizontalSlide, 
  useResponsiveAnimation, 
  TEXT_OVERLAY_TIMING, 
  ALTERNATE_TIMING 
} from "../../../../lib/landing/hooks/useScrollAnimation";
import { ImageCard, TextCard } from "../ui";

// Basic section with fade-in and scale animation
export function ScrollSection({ children, className }: { children: React.ReactNode; className: string }) {
  const { ref, opacity, y, scale } = useScrollFadeIn();

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Side-by-side section with fade-in animation
export function SideBySideSection({ children, className }: { children: React.ReactNode; className: string }) {
  const { ref, opacity, scale } = useScrollFadeIn();

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Card with horizontal slide animation
export function AnimatedCard({ isLeft, children }: { isLeft: boolean; children: React.ReactNode }) {
  const { ref, opacity, x } = useHorizontalSlide({ isLeft });

  return (
    <motion.div
      ref={ref}
      style={{ x, opacity }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// Text overlay with custom timing
export function TextOverlay({ title, content }: { title: string; content: React.ReactNode }) {
  const { ref, scrollYProgress, opacity } = useBasicAnimation({ 
    customOffset: ["start 85%", "end start"],
    customTiming: TEXT_OVERLAY_TIMING
  });
  
  const y = useTransform(
    scrollYProgress, 
    TEXT_OVERLAY_TIMING, 
    [50, 0, 0, 50]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="relative"
    >
      <div className="p-8 rounded-lg">
        <div className="text-xl text-white text-center font-mono mb-4">
          {title}
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent mb-6" />
        <div className="text-sm md:text-md opacity-80 text-left font-mono">
          {content}
        </div>
      </div>
    </motion.div>
  );
}

// Simple content block with image and text side by side
export function ContentBlock({ 
  imageUrl, 
  title, 
  isImageFirst = true 
}: { 
  imageUrl: string; 
  title: string; 
  isImageFirst?: boolean;
}) {
  const { ref, scrollYProgress, opacity } = useBasicAnimation({ customTiming: ALTERNATE_TIMING });
  
  const x = useTransform(scrollYProgress, ALTERNATE_TIMING, [-50, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, ALTERNATE_TIMING, [0.95, 1, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, scale }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
    >
      {isImageFirst ? [
        <div key="image" className="w-full">
          <ImageCard src={imageUrl} />
        </div>,
        <div key="text" className="w-full">
          <TextCard title={title} />
        </div>
      ] : [
        <div key="text" className="w-full">
          <TextCard title={title} />
        </div>,
        <div key="image" className="w-full">
          <ImageCard src={imageUrl} />
        </div>
      ]}
    </motion.div>
  );
}

// Image with scroll animation
export function ImageWithScroll({ src, alt }: { src: string; alt: string }) {
  const { ref, opacity, scale } = useScrollFadeIn({ 
    customTiming: [0.2, 0.4, 0.8, 0.9] 
  });

  return (
    <div className="w-full overflow-hidden flex justify-center">
      <motion.div
        ref={ref}
        style={{ scale, opacity }}
        className="w-full max-w-4xl aspect-square relative mx-auto"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover rounded-lg"
            style={{ objectPosition: "center 10%" }}
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black rounded-lg" />
      </motion.div>
    </div>
  );
}

// Responsive content block with different layouts for mobile/desktop
export function ResponsiveContentBlock({
  imageUrl,
  title,
  desktopImageFirst = true,
  mobileImageFirst = true
}: {
  imageUrl: string;
  title: React.ReactNode;
  desktopImageFirst?: boolean;
  mobileImageFirst?: boolean;
}) {
  const { ref, opacity, y, scale, x } = useResponsiveAnimation();

  // Mobile Content
  const mobileContent = (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="md:hidden grid grid-cols-1 gap-6 w-full px-4"
    >
      {mobileImageFirst ? [
        <div key="image" className="w-full">
          <ImageCard src={imageUrl} />
        </div>,
        <div key="text" className="w-full">
          <TextCard title={title} />
        </div>
      ] : [
        <div key="text" className="w-full">
          <TextCard title={title} />
        </div>,
        <div key="image" className="w-full">
          <ImageCard src={imageUrl} />
        </div>
      ]}
    </motion.div>
  );

  // Desktop Content
  const desktopContent = (
    <div className="hidden md:block px-4">
      <SideBySideSection className="grid grid-cols-2 gap-6 max-w-7xl mx-auto">
        <AnimatedCard isLeft={true}>
          {desktopImageFirst ? (
            <ImageCard src={imageUrl} />
          ) : (
            <TextCard title={title} />
          )}
        </AnimatedCard>
        <AnimatedCard isLeft={false}>
          {desktopImageFirst ? (
            <TextCard title={title} />
          ) : (
            <ImageCard src={imageUrl} />
          )}
        </AnimatedCard>
      </SideBySideSection>
    </div>
  );

  return (
    <>
      {mobileContent}
      {desktopContent}
    </>
  );
}

// Call to action section with registration and social media options
export function CallToAction() {
  const { ref, opacity, scale } = useScrollFadeIn({
    customTiming: [0.2, 0.4, 0.8, 0.9]
  });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="w-full py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 text-center font-mono">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
          Ready to Join the Adventure?
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Be part of the next generation of gaming. Register now or follow us on X for the latest updates and exclusive content.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2"
          >
            <span>Register Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="https://x.com/ragnarokgame"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2 border border-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Follow on X</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 