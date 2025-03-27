"use client";

import { useAccount, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RagnarokGameMasterABI } from '@/app/abis/RagnarokGameMasterABI';

export default function OwnerGuard({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if connected address is the owner
  const { data: ownerAddress } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`,
    abi: RagnarokGameMasterABI,
    functionName: 'owner',
    args: [],
    query: {
      enabled: isConnected && !!address
    }
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    // Check if the current address is the owner
    if (isConnected && ownerAddress) {
      const isOwner = address?.toLowerCase() === (ownerAddress as string).toLowerCase();
      setIsAuthorized(isOwner);
      setIsChecking(false);
      
      if (!isOwner) {
        // Redirect non-owners to home
        router.push('/');
      }
    }
  }, [isConnected, address, ownerAddress, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-neon-300 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="h-10 w-10 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">×</span>
          </div>
          <p className="text-red-400">Access denied</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 