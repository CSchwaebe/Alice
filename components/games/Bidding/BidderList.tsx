"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Bidder {
  address: string;
  name: string;
  last_bid: number;
  tokens_remaining: number;
}

interface BidderListProps {
  bidders: Bidder[];
}

type SortField = 'last_bid' | 'tokens_remaining';
type SortDirection = 'asc' | 'desc';

export default function BidderList({ bidders }: BidderListProps) {
  const [sortField, setSortField] = useState<SortField>('last_bid');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedBidders = [...bidders].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/5 to-transparent p-4 border-b border-white/20">
        <div className="flex items-center">
          <motion.div 
            className="w-1.5 h-1.5 bg-white rounded-full mr-2"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <h3 className="text-sm font-mono text-white uppercase tracking-wider">
            Active Bidders
          </h3>
        </div>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 text-xs font-mono text-white/70 border-b border-white/10">
        <div className="col-span-5">Address</div>
        <button 
          className={`col-span-3 flex items-center gap-1 ${sortField === 'last_bid' ? 'text-white' : ''}`}
          onClick={() => handleSort('last_bid')}
        >
          Last Bid
          {sortField === 'last_bid' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? 
                <ArrowUpIcon className="w-3 h-3" /> : 
                <ArrowDownIcon className="w-3 h-3" />
              }
            </span>
          )}
        </button>
        <button 
          className={`col-span-4 flex items-center gap-1 ${sortField === 'tokens_remaining' ? 'text-white' : ''}`}
          onClick={() => handleSort('tokens_remaining')}
        >
          Tokens Remaining
          {sortField === 'tokens_remaining' && (
            <span className="ml-1">
              {sortDirection === 'asc' ? 
                <ArrowUpIcon className="w-3 h-3" /> : 
                <ArrowDownIcon className="w-3 h-3" />
              }
            </span>
          )}
        </button>
      </div>
      
      {/* Bidder List */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-black/20">
        {sortedBidders.length === 0 ? (
          <div className="text-center py-8 text-white/50 font-mono">
            No active bidders
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {sortedBidders.map((bidder, index) => (
              <motion.div
                key={bidder.address}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 p-4 text-sm font-mono hover:bg-white/5"
              >
                <div className="col-span-5 text-white/90">
                  <div className="truncate" title={bidder.address}>
                    {bidder.address}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {bidder.name}
                  </div>
                </div>
                <div className="col-span-3 text-white/90">
                  {bidder.last_bid.toLocaleString()}
                </div>
                <div className="col-span-4 text-white/90">
                  {bidder.tokens_remaining.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t border-white/20 p-3 bg-white/5">
        <div className="flex justify-between items-center text-[10px] font-mono text-white/50">
          <div>TOTAL BIDDERS: {bidders.length}</div>
          <motion.div 
            className="h-0.5 w-8 bg-gradient-to-r from-white/30 to-white/60 rounded-full"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
} 