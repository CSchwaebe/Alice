'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2024-05-01T00:00:00'); // Example date

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-black/30 p-4 rounded-lg">
          <div className="text-3xl font-bold text-red-500">{value}</div>
          <div className="text-xs uppercase tracking-wider text-gray-400">{unit}</div>
        </div>
      ))}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black z-10" />
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-50" />
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 glitch-text" data-text="1,000 Players. Only One Survives.">
            1,000 Players. Only One Survives.
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 animate-typewriter-slow">
            Enter a world of psychological warfare, strategy, and survival.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xl font-bold transition-all transform hover:scale-105">
              Join the Game
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white rounded-lg text-xl font-bold transition-all">
              Learn How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Quick Explanation Section */}
      <section className="py-20 bg-black/95">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Welcome to the Ultimate Test</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-red-500">The Stakes Are Real</h3>
              <p className="text-gray-300">
                Inspired by Squid Game, this is a real-time elimination tournament where psychology meets strategy. 
                Every decision counts, every alliance matters, and only the strongest mind will prevail.
              </p>
            </div>
            <div className="bg-gray-900/50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-red-500">Trust No One</h3>
              <p className="text-gray-300">
                Form alliances, betray opponents, and navigate through intense psychological challenges. 
                Your survival depends on your ability to read others while masking your own intentions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Game Features</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: "Live Competition",
                description: "Real-time battles with 1,000 players simultaneously",
                icon: "🎮"
              },
              {
                title: "Pure Strategy",
                description: "No pay-to-win. Your mind is your only weapon",
                icon: "🧠"
              },
              {
                title: "Multi-Platform",
                description: "Play on mobile, desktop, or VR devices",
                icon: "📱"
              },
              {
                title: "Fair Play",
                description: "Equal chances for all participants",
                icon: "⚖️"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-black/50 p-6 rounded-lg text-center hover:bg-gray-800/50 transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">How to Play</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 h-full w-0.5 bg-red-500"></div>
              {[
                {
                  step: "1",
                  title: "Register Your Spot",
                  description: "Secure your position among the 1,000 contestants"
                },
                {
                  step: "2",
                  title: "Survive the Rounds",
                  description: "Navigate through psychological challenges and strategic mini-games"
                },
                {
                  step: "3",
                  title: "Claim Victory",
                  description: "Be the last player standing to win the ultimate prize"
                }
              ].map((step, index) => (
                <div key={index} className="relative pl-12 pb-12">
                  <div className="absolute left-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Countdown & Prize Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Next Game Starts In</h2>
          <div className="max-w-2xl mx-auto mb-12">
            <CountdownTimer />
          </div>
          <div className="bg-red-900/30 p-8 rounded-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Prize Pool</h3>
            <div className="text-5xl font-bold mb-4 text-red-500">$100,000</div>
            <p className="text-gray-400">Plus exclusive NFT badges and eternal glory</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Important Links</h4>
              <ul className="space-y-2">
                <li><Link href="/rules" className="text-gray-400 hover:text-white">Rules</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">YouTube</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-lg font-bold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to get updates about upcoming games and exclusive content.</p>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500"
                />
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
