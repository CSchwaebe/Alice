"use client";

// import { cookieStorage, createStorage, http } from '@wagmi/core'

import { ConnectButton } from "@/components/walletconnect/ConnectButton";
import GlitchTextBackground from "@/components/effects/GlitchTextBackground";
import GameStateRedirect from "@/components/auth/GameStateRedirect";

export default function Home() {
  return (
    <GameStateRedirect redirectUnregistered={true} redirectNoGame={true}>
      <div className="min-h-[100vh] flex flex-col items-center justify-center relative">
        {/* Matrix Code Effect */}
        <GlitchTextBackground />
        
        {/* Content */}
        <div className="z-10 flex flex-col items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </GameStateRedirect>
  );
}