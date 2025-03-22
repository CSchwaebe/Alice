// app/providers.tsx
"use client"; // Required for client-side providers
import { cookieToInitialState, WagmiProvider, http, type Config, cookieStorage, createStorage } from 'wagmi'
import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
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
  syncConnectedChain: true,
  transports: {
    [sonicBlazeTestnet.id]: http('https://sonic-blaze.g.alchemy.com/v2/GdeOJcP1A5nVB4VsMm4KN0wDVA2yy6iL'),
    [sonic.id]: http('https://sonic-mainnet.g.alchemy.com/v2/GdeOJcP1A5nVB4VsMm4KN0wDVA2yy6iL'),
  },
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
  metadata,
  debug: true,
  
  // Use type assertion to bypass property check
  ...(({
    onConnectorInitialized: (connector: any) => {
      const originalConnect = connector.connect;
      connector.connect = async (...args: any[]) => {
        try {
          if (connector.isConnected) {
            return connector.connection;
          }
          return await originalConnect.apply(connector, args);
        } catch (error) {
          if (error && typeof error === 'object' && 'message' in error && 
              (error as {message: string}).message.includes('already connected')) {
            return connector.connection;
          }
          throw error;
        }
      };
      return connector;
    }
  } as any)),

  networks,
  defaultNetwork: sonicBlazeTestnet,
  defaultAccountTypes: {eip155:'smartAccount'},
  
  enableWalletConnect: false,
  siwx: new CloudAuthSIWX(),
  themeMode: 'dark',
  enableWalletGuide: false,
  allWallets: 'HIDE',

  featuredWalletIds: [
    '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1',
  ],
  includeWalletIds: [
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
  ],
  excludeWalletIds: [
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393'
  ],
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: true, // default to true
    emailShowWallets: false, 
    socials: ['x', 'google', 'apple', 'facebook'],
    connectMethodsOrder: ['email','social', 'wallet'],
  },
  
  
  themeVariables: {
    '--w3m-accent': 'black',
    "--w3m-font-family": "Courier New",
  }
});

const queryClient = new QueryClient();

export function Providers({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
