"use client";

import BidCard from '@/components/games/Bidding/BidCard';
import BidderList from '@/components/games/Bidding/BidderList';
import { useState, useEffect } from 'react';
import { Silkscreen } from 'next/font/google';

const silkscreen = Silkscreen({ 
  weight: '400',
  subsets: ['latin']
});

// Custom hook for countdown timer
const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return {
    minutes,
    seconds: remainingSeconds,
    timeString: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`,
    isFinished: seconds === 0
  };
};

export default function BiddingWarPage() {
  const timer = useCountdown(60); // 1 minute in seconds

  return (
    <div className="p-4 flex flex-col items-center">
      <div className={`text-4xl md:text-5xl font-bold mb-8 tracking-wider ${silkscreen.className}
        ${timer.isFinished ? 'text-blood-300' : 'text-white'}`}>
        {timer.timeString}
      </div>
      <BidCard />
      <BidderList />
    </div>
  );
} 