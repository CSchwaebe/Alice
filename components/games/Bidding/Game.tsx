"use client";

import { useState } from 'react';
import ViewportDrawer from '@/components/ui/ViewportDrawer';

interface BidCardProps {
  playerPoints: number;
  phase: number;  // 1 = commit, 2 = reveal
  hasCommitted: boolean;
  hasRevealed: boolean;
  isCommitting: boolean;
  isRevealing: boolean;
  onCommitBid: (amount: number) => void;
  onRevealBid: (amount: number) => void;
}

export default function BidCard({
  playerPoints,
  phase,
  hasCommitted,
  hasRevealed,
  isCommitting,
  isRevealing,
  onCommitBid,
  onRevealBid
}: BidCardProps) {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Format number with commas and handle input validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits
    if (value) {
      setBidAmount(Number(value).toLocaleString()); // Format with commas
    } else {
      setBidAmount('');
    }
  };

  const handleBidSubmit = () => {
    const rawBid = Number(bidAmount.replace(/,/g, ''));
    if (!rawBid || rawBid <= 0 || rawBid > playerPoints) return;
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    const rawBid = Number(bidAmount.replace(/,/g, ''));
    if (phase === 1) {
      onCommitBid(rawBid);
    } else {
      onRevealBid(rawBid);
    }
  };
  
  // Determine component states
  const isDisabled = (phase === 1 && hasCommitted) || (phase === 2 && hasRevealed);
  const isPending = (phase === 1 && isCommitting) || (phase === 2 && isRevealing);
  const buttonText = isPending ? "PROCESSING..." : 
                    isDisabled ? (phase === 1 ? "COMMITTED" : "REVEALED") :
                    phase === 1 ? "COMMIT BID" : "REVEAL BID";
  const rawBidAmount = bidAmount ? Number(bidAmount.replace(/,/g, '')) : 0;
  const isValidBid = rawBidAmount > 0 && rawBidAmount <= playerPoints;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative rounded-lg bg-overlay-medium backdrop-blur-sm border border-border p-6 w-full max-w-2xl mx-auto">
        {/* Phase indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 px-4 py-1 bg-background rounded-full border border-border text-xs font-mono tracking-wider text-foreground flex items-center">
          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isPending ? 'bg-primary-400' : (isDisabled ? 'bg-foreground' : 'bg-primary-200')}`} />
          {phase === 1 ? "COMMIT PHASE" : "REVEAL PHASE"}
        </div>
        
        {/* Header */}
        <div className="border-b border-border pb-4 mb-6 relative">
          <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent"></div>
          <h2 className="text-2xl text-foreground font-bold text-center py-1 tracking-widest">
            {phase === 1 ? "PLACE YOUR BID" : "REVEAL YOUR BID"}
          </h2>
          
          {/* System ID code */}
          <div className="absolute -bottom-3 right-0 text-[8px] font-mono text-primary-400">
            SYS::{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
          </div>
        </div>

        {/* Balance display */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 rounded bg-overlay-light backdrop-blur-sm -z-10" />
          <div className="absolute h-full w-1 bg-primary-200 left-0" />
          <div className="absolute h-full w-1 bg-primary-200 right-0" />
          <div className="py-3 px-4">
            <div className="text-primary-400 text-sm mb-1 flex items-center">
              <div className="w-1.5 h-1.5 bg-foreground rounded-full mr-2" />
              YOUR BALANCE
            </div>
            <div className="text-foreground text-xl font-mono tracking-wider">
              {playerPoints.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Bid input */}
        <div className="mb-6">
          <label className="block text-primary-400 text-sm mb-2 flex items-center">
            <div className="w-1 h-4 bg-foreground mr-2"></div>
            BID AMOUNT
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={bidAmount}
              onChange={handleInputChange}
              disabled={isDisabled || isPending}
              className="w-full bg-overlay-light border border-border rounded-lg
                       px-4 py-3 text-foreground font-mono text-lg tracking-wider
                       focus:outline-none focus:border-primary-400 focus:bg-overlay-medium
                       transition-colors duration-200
                       placeholder:text-primary-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter amount"
            />
            
            {/* Tech decorators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-400 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-400 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-400 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-400 pointer-events-none" />
            
            {/* Input status indicator */}
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${bidAmount ? 'bg-foreground' : 'bg-primary-200'}`} />
          </div>

          {/* Balance indicator */}
          <div className="mt-2 text-xs font-mono text-primary-400 flex justify-between">
            <span>Available: {playerPoints.toLocaleString()}</span>
            {bidAmount && (
              <span className={rawBidAmount > playerPoints ? 'text-red-400' : 'text-primary-400'}>
                Remaining: {(playerPoints - rawBidAmount).toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Phase-specific instructions */}
          <div className="mt-3 text-xs font-mono text-primary-400">
            {isDisabled ? (
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground mr-2" />
                <span>{phase === 1 ? "Bid committed. Wait for reveal phase." : "Bid revealed. Wait for round results."}</span>
              </div>
            ) : (
              phase === 1 ? "Enter the amount you want to bid. This will be kept secret until the reveal phase." :
                          "Reveal your bid. Make sure to use the same amount you committed!"
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleBidSubmit}
          disabled={isDisabled || isPending || !isValidBid}
          className="w-full bg-primary-400 text-background py-3 rounded-lg
                   font-mono tracking-widest text-lg
                   hover:bg-primary-200 transition-colors duration-200
                   disabled:bg-overlay-light disabled:text-primary-200"
        >
          {buttonText}
        </button>
        
        {/* Tech decoration */}
        <div className="absolute bottom-2 left-2 text-[6px] font-mono text-primary-400">
          v2.4.7
        </div>
      </div>

      {/* Confirmation Popup */}
      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirmClick={handleConfirm}
        title={phase === 1 ? "Confirm Bid Commitment" : "Confirm Bid Reveal"}
        description={
          phase === 1 
            ? `Are you sure you want to commit a bid of ${bidAmount}? This will be kept secret until the reveal phase.` 
            : `Are you sure you want to reveal a bid of ${bidAmount}? Make sure this matches your committed bid amount!`
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
} 