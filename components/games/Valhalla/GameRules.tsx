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
        className="fixed top-20 right-4 z-10 p-2 rounded-full bg-dark-600 hover:bg-dark-500 
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
                    Choose between Valhalla and Hel in this strategic game of fate. Your choice affects not just you, but your entire team.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-neon-200 mb-2">Rules</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Each round, players must choose between two doors: Valhalla or Hel</li>
                    <li>You have 2 minutes to make your choice each round</li>
                    <li>The game consists of 10 rounds</li>
                    <li>Your team's performance is tracked by doors opened</li>
                    <li>Choose wisely - your fate depends on it!</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl text-neon-200 mb-2">Scoring</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Successfully opening a door increases your door count</li>
                    <li>Team members are ranked by doors opened</li>
                    <li>The more doors you open successfully, the higher your rank</li>
                  </ul>
                </section>

                <div className="mt-8 p-4 bg-dark-800 rounded-lg border border-dark-400">
                  <p className="text-blood-300 font-semibold">
                    Remember: Choose carefully between Valhalla and Hel - your eternal fate hangs in the balance!
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