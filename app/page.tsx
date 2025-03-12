"use client";

// import { cookieStorage, createStorage, http } from '@wagmi/core'

import { InfoList } from "@/components/walletconnect/InfoList";
import { ConnectButton } from "@/components/walletconnect/ConnectButton";
import { useState } from 'react';

export default function Home() {
  const [showContent, setShowContent] = useState(true);
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative">
      {/* Content */}
      <div className="z-10">
        <h1 className="text-6xl font-bold mb-8 text-neon-300">
          RAGNAROK GAMES
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Connect your wallet to enter
        </p>
        <ConnectButton />
      </div>
    </div>
  );
}