"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

interface GameLink {
  name: string;
  path: string;
  description?: string;
}

const games: GameLink[] = [
  {
    name: "Hermods Descent",
    path: "/games/tower-climb",
    description: "A strategic tower climbing game"
  },
  {
    name: "Valhalla",
    path: "/games/valhalla",
    description: "Valhalla or Helheim?"
  },
  {
    name: "Diamonds",
    path: "/games/diamonds",
    description: "Find the hidden treasures"
  },
  {
    name: "Bidding War",
    path: "/games/bidding",
    description: "Outbid your opponents"
  },
  {
    name: "Pick Three",
    path: "/games/pick-three",
    description: "Choose wisely, win big"
  },
  {
    name: "Battle Royale",
    path: "/games/battle-royale",
    description: "Fight for glory"
  }
];

const pages: GameLink[] = [
  {
    name: "Profile",
    path: "/profile",
    description: "Your gaming profile"
  },
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div ref={menuRef} className="relative z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 pr-0"
        aria-label="Menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-neon-300" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-neon-300" />
        )}
      </button>

      {/* Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-dark-900/80 backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-dark-700 shadow-lg transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="pt-16 px-4 pb-6 h-full flex flex-col">
          <h2 className="text-neon-300 text-xl mb-6 tracking-wider">Games</h2>
          
          <nav className="space-y-2 flex-1">
            {games.map((game) => (
              <Link 
                key={game.path} 
                href={game.path}
                className={`block p-3 rounded-lg transition-colors duration-200
                          ${pathname === game.path 
                            ? 'bg-neon-600/20 text-neon-300 shadow-sm shadow-neon-600/30' 
                            : 'hover:bg-dark-600 text-gray-200'}`}
              >
                <div className="font-medium">{game.name}</div>
                {game.description && (
                  <div className="text-sm text-gray-400 mt-1">{game.description}</div>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="border-t border-dark-500 pt-4 mt-auto">
            {pages.map((page) => (
              <Link 
                key={page.path}
                href={page.path}
                className="block p-3 rounded-lg hover:bg-dark-600 transition-colors duration-200"
              >
                <div className="font-medium text-blood-400">{page.name}</div>
                {page.description && (
                  <div className="text-sm text-gray-400 mt-1">{page.description}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 