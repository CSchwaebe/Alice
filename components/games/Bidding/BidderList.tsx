"use client";

import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface Bidder {
  address: string;
  lastBid: number;
  tokensRemaining: number;
}

// Helper function to shorten address
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Generate dummy bidders with random data
const dummyBidders: Bidder[] = Array.from({ length: 20 }, () => ({
  address: `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`,
  lastBid: Math.floor(Math.random() * 10_000_000) + 1_000_000,
  tokensRemaining: Math.floor(Math.random() * 100_000_000) + 10_000_000
}));

export default function BidderList() {
  const [bidders, setBidders] = useState<Bidder[]>(dummyBidders);
  const [sortField, setSortField] = useState<'lastBid' | 'tokensRemaining'>('lastBid');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleSort = (field: 'lastBid' | 'tokensRemaining') => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }

    setBidders(prev => [...prev].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (a[field] - b[field]) * multiplier;
    }));
  };

  return (
    <div className="w-full max-w-4xl mt-12">
      <h2 className="text-xl text-neon-300 font-bold mb-4 tracking-wider">Active Bidders</h2>
      <div className="bg-dark-700 rounded-lg border border-dark-400 p-4">
        <div className="w-full">
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 mb-2 px-3 text-sm text-gray-400 font-semibold">
            <div className="col-span-6">Address</div>
            <div 
              className="col-span-3 flex items-center justify-end gap-2 cursor-pointer" 
              onClick={() => toggleSort('lastBid')}
            >
              <span>Last Bid</span>
              {sortField === 'lastBid' && (
                sortDirection === 'asc' 
                  ? <ArrowUpIcon className="w-4 h-4" />
                  : <ArrowDownIcon className="w-4 h-4" />
              )}
            </div>
            <div 
              className="col-span-3 flex items-center justify-end gap-2 cursor-pointer"
              onClick={() => toggleSort('tokensRemaining')}
            >
              <span>Remaining</span>
              {sortField === 'tokensRemaining' && (
                sortDirection === 'asc' 
                  ? <ArrowUpIcon className="w-4 h-4" />
                  : <ArrowDownIcon className="w-4 h-4" />
              )}
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-1">
            {bidders.map((bidder, index) => (
              <div 
                key={index}
                className="grid grid-cols-12 gap-4 bg-dark-800 rounded p-3 items-center"
              >
                <div className="col-span-6 font-mono text-sm text-gray-300 truncate" title={bidder.address}>
                  <span className="hidden sm:inline">{bidder.address}</span>
                  <span className="sm:hidden">{shortenAddress(bidder.address)}</span>
                </div>
                <div className="col-span-3 font-mono text-sm text-gray-300 text-right">
                  {bidder.lastBid.toLocaleString()}
                </div>
                <div className="col-span-3 font-mono text-sm text-gray-300 text-right">
                  {bidder.tokensRemaining.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 