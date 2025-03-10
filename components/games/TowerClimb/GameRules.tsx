"use client";

import { useState, useRef, useEffect } from 'react';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function GameRules() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 p-2 rounded-full bg-dark-600 hover:bg-dark-500 
                   transition-colors duration-200 text-neon-300 hover:text-neon-200"
        title="How to Play"
      >
        <QuestionMarkCircleIcon className="w-6 h-6" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="bg-dark-700 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="relative p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 
                         transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-neon-300 mb-6">How to Play</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl text-neon-200 mb-2">Game Overview</h3>
                  <p className="text-gray-300">
                    Climb the tower of Helheim in this strategic game. Choose your moves carefully to reach the top while competing with other players.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-neon-200 mb-2">Rules</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Start at level 0 and climb to reach level 21</li>
                    <li>Each turn, you can move 1-5 levels up</li>
                    <li>Regular levels can hold up to 100 players</li>
                    <li>Start (0) and Finish (21) levels have higher capacity</li>
                    <li>If a level is full, you cannot move there</li>
                    <li>Plan your moves based on player distribution</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl text-neon-200 mb-2">Level Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Green highlight shows your current level</li>
                    <li>Purple glow indicates levels with players</li>
                    <li>Level fill indicates player count percentage</li>
                    <li>Click a level to see detailed information</li>
                  </ul>
                </section>

                <div className="mt-8 p-4 bg-dark-800 rounded-lg border border-dark-400">
                  <p className="text-blood-300 font-semibold">
                    Remember: Strategic movement and timing are key to reaching Helheim's summit!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 