"use client";

import Image from "next/image";
import Link from "next/link";
import { iceland } from "../../fonts";

// Border Corners UI element
export function BorderCorners() {
  return (
    <>
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary-200" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary-200" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary-200" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary-200" />
    </>
  );
}

// Simple Text Display
export function TextCard({ title }: { title: React.ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {title}
    </div>
  );
}

// List item with bullet
export function ListItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center">
      <span className="mr-2">•</span>
      <span>{text}</span>
    </div>
  );
}

// Image component with consistent styling
export function ImageCard({ src }: { src: string }) {
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] xl:h-[700px]">
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt="Game visual"
          fill
          sizes="100vw"
          priority
          className="object-contain rounded-lg opacity-80"
        />
      </div>
    </div>
  );
}

// Navigation button with hover effects
export function NavButton({ href, text, external = false }: { href: string; text: string; external?: boolean }) {
  const buttonContent = (
    <div className="relative transform transition-transform duration-300 group-hover:scale-105 h-full flex items-center justify-center">
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative py-4 sm:py-4 md:py-6 xl:py-8 px-4">
        <h2 className={`text-xl sm:text-2xl md:text-4xl 2xl:text-7xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground animate-text-shimmer ${iceland.className}`}>
          {text}
        </h2>
      </div>
      <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
    </div>
  );

  return (
    <Link 
      href={href} 
      className="block group w-full"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {buttonContent}
    </Link>
  );
}

// Card with border corners
export function InfoCard({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <div className="relative w-full h-full">
      <div className="relative bg-gradient-to-b from-overlay-dark to-background p-6 sm:p-8 rounded-lg shadow-glow-sm backdrop-blur-sm w-full h-full flex flex-col">
        <BorderCorners />
        <div className="text-lg text-white text-center font-mono min-h-[4rem] flex items-center justify-center">
          {title}
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent my-4 sm:my-6" />
        <div className="text-sm md:text-md opacity-80 text-left flex-1 flex flex-col font-mono break-words">
          {content}
        </div>
      </div>
    </div>
  );
} 