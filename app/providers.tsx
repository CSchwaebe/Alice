// app/providers.tsx
"use client"; // Required for client-side providers
import { cookieToInitialState, WagmiProvider, type Config, cookieStorage, createStorage } from 'wagmi'
import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { sonic, sonicBlazeTestnet } from "wagmi/chains";
import type { AppKitNetwork } from '@reown/appkit/networks';
import { CloudAuthSIWX } from '@reown/appkit-siwx'

// AppKit Configuration
const projectId = "7f02c5df8e9d779de7cfa8d56660538f";
const networks = [
  { ...sonic, name: 'Sonic' },
  { ...sonicBlazeTestnet, name: 'Sonic Testnet' }
] as [AppKitNetwork, ...AppKitNetwork[]];

// Set up the Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
});

// Set up metadata for AppKit
const metadata = {
  name: 'Ragnarok Games',
  description: 'Norse-themed blockchain games',
  url: 'https://ragnarok-eight.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Create the AppKit modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  siwx: new CloudAuthSIWX(),
  themeMode: 'dark',
  features: {
    analytics: true
  },
  themeVariables: {
    '--w3m-accent': '#7B4FFF',
  }
});

const queryClient = new QueryClient();

export function Providers({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const [mounted, setMounted] = useState(false);
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>{mounted && children}</HeroUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
