"use client";

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  
  return (
    <div className="p-4 max-w-2xl mx-auto mt-8">
      {isConnected ? (
        <div className="bg-dark-700 rounded-lg border border-dark-400 p-6">
          <h2 className="text-xl text-neon-300 mb-4">Your Profile</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 mb-1">Wallet Address</p>
              <p className="font-mono text-sm bg-dark-800 p-2 rounded">{address}</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">Game Statistics</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="bg-dark-600 p-3 rounded">
                  <p className="text-sm text-gray-300">Hermods Descent</p>
                  <p className="text-lg text-neon-300">Level 0</p>
                </div>
                <div className="bg-dark-600 p-3 rounded">
                  <p className="text-sm text-gray-300">Ragnarok Royale</p>
                  <p className="text-lg text-blood-300">Not played</p>
                </div>
                <div className="bg-dark-600 p-3 rounded">
                  <p className="text-sm text-gray-300">Freyas Fortune</p>
                  <p className="text-lg text-amber-300">Not played</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-dark-700 rounded-lg border border-dark-400">
          <h2 className="text-xl text-neon-300 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to view your profile and game statistics.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      )}
    </div>
  );
} 