"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

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