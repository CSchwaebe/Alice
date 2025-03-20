"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [wasConnected, setWasConnected] = useState(false);

  useEffect(() => {
    // Check for disconnection (was connected but now isn't)
    if (wasConnected && !isConnected) {
      router.push('/');
      return;
    }

    // Update wasConnected state
    if (isConnected && !wasConnected) {
      setWasConnected(true);
    }

    // Initial connection check
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router, wasConnected]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-neon-300 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Please connect your wallet...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 