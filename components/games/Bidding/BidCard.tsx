"use client";

import { useState } from 'react';
import ViewportDrawer from '@/components/ui/ViewportDrawer';

export default function BidCard() {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const userBalance = 100_000_000;

  // Format number with commas
  const formatNumber = (num: string) => {
    // Remove any non-digits
    const cleanNum = num.replace(/[^\d]/g, '');
    // Add commas
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Remove commas and get raw number
  const getRawNumber = (formattedNum: string) => {
    return formattedNum.replace(/,/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = getRawNumber(e.target.value);
    if (!rawValue || /^\d+$/.test(rawValue)) {
      setBidAmount(formatNumber(rawValue));
    }
  };

  const handleBidSubmit = () => {
    const rawBid = getRawNumber(bidAmount);
    if (!rawBid || Number(rawBid) <= 0 || Number(rawBid) > userBalance) return;
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    const rawBid = getRawNumber(bidAmount);
    console.log(`Bid confirmed: ${rawBid}`); // Raw number without commas
    setShowConfirmation(false);
    setBidAmount('');
    // TODO: Handle the actual bid submission
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-dark-700 rounded-lg border border-dark-400 p-6">
        <h2 className="text-2xl text-neon-300 font-bold mb-6 text-center">
          Place your bid
        </h2>

        <div className="mb-6 text-center">
          <div className="text-gray-400 text-sm mb-1">Your Balance</div>
          <div className="text-neon-200 text-xl font-mono">
            {userBalance.toLocaleString()}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">
            Bid Amount
          </label>
          <input
            type="text"
            value={bidAmount}
            onChange={handleInputChange}
            className="w-full bg-dark-800 border border-dark-400 rounded-lg
                     px-4 py-2 text-gray-100 font-mono
                     focus:outline-none focus:border-neon-400
                     transition-colors duration-200"
            placeholder="Enter amount"
          />
        </div>

        <button
          onClick={handleBidSubmit}
          disabled={!bidAmount || Number(getRawNumber(bidAmount)) <= 0 || Number(getRawNumber(bidAmount)) > userBalance}
          className="w-full bg-neon-600 text-white py-3 rounded-lg
                   font-semibold tracking-wider
                   hover:bg-neon-500 transition-colors duration-200
                   disabled:bg-dark-600 disabled:text-gray-500"
        >
          Submit
        </button>
      </div>

      {/* Confirmation Popup */}
      <ViewportDrawer
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <div className="p-4 text-center">
          <h3 className="text-xl text-neon-300 mb-6">
            Submit bid of {bidAmount}?
          </h3>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-2 rounded-lg bg-dark-600 text-gray-300 
                       hover:bg-dark-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-lg bg-neon-600 text-white
                       hover:bg-neon-500 transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </ViewportDrawer>
    </div>
  );
} 