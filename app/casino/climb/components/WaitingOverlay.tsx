"use client";

import { useEffect } from 'react';

interface WaitingOverlayProps {
  isVisible: boolean;
  message: string;
  resultInfo?: {
    type: 'success' | 'bust' | 'cashout' | null;
    level?: number;
    newLevel?: number;
    payout?: string;
    currency?: 'S' | 'ALICE';
    aliceReward?: number;
  };
  onTimeout?: () => void;
}

export function WaitingOverlay({ isVisible, message, resultInfo, onTimeout }: WaitingOverlayProps) {
  const isShowingResult = resultInfo?.type !== null;

  const handleDismiss = () => {
    if (onTimeout) {
      onTimeout();
    }
  };

  if (!isVisible) return null;

  const getResultContent = () => {
    if (!isShowingResult || !resultInfo?.type) {
      return {
        title: "PROCESSING",
        message: message,
        icon: (
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-border rounded-full animate-pulse"></div>
            
            {/* Inner spinning ring */}
            <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"></div>
            
            {/* Center dot */}
            <div className="absolute inset-6 w-4 h-4 bg-foreground rounded-full animate-pulse"></div>
          </div>
        ),
        color: 'text-foreground'
      };
    }

    switch (resultInfo.type) {
      case 'success':
        return {
          title: "CLIMB SUCCESS!",
          message: `Successfully climbed to level ${resultInfo.newLevel}!`,
          icon: (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-400 rounded-full bg-green-400/20 flex items-center justify-center">
                <div className="text-green-400 text-2xl">✓</div>
              </div>
            </div>
          ),
          color: 'text-green-400'
        };
      
      case 'bust':
        return {
          title: "BUSTED!",
          message: `You busted but received ${resultInfo.aliceReward || 10} ALICE for playing!`,
          icon: (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-400 rounded-full bg-red-400/20 flex items-center justify-center">
                <div className="text-red-400 text-2xl">✗</div>
              </div>
            </div>
          ),
          color: 'text-red-400'
        };
      
      case 'cashout':
        return {
          title: "CASHED OUT!",
          message: `Successfully cashed out ${resultInfo.payout} ${resultInfo.currency}!`,
          icon: (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-yellow-400 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <div className="text-yellow-400 text-2xl">$</div>
              </div>
            </div>
          ),
          color: 'text-yellow-400'
        };
      
      default:
        return {
          title: "COMPLETE",
          message: message,
          icon: (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-400 rounded-full bg-primary-400/20 flex items-center justify-center">
                <div className="text-primary-400 text-2xl">!</div>
              </div>
            </div>
          ),
          color: 'text-primary-400'
        };
    }
  };

  const content = getResultContent();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 bg-overlay-dark border border-border rounded-lg p-8 mx-4 max-w-md w-full">
        <div className="text-center">
          {/* Icon/Animation */}
          <div className="mb-6 flex justify-center">
            {content.icon}
          </div>
          
          {/* Message */}
          <div className="space-y-2">
            <h3 className={`text-lg font-mono ${content.color} tracking-wider`}>
              {content.title}
            </h3>
            <p className="text-sm text-primary-400 font-mono">
              {content.message}
            </p>
            {!isShowingResult && (
              <div className="text-xs text-primary-200 font-mono mt-4">
                Waiting for blockchain confirmation...
              </div>
            )}
            {isShowingResult && (
              <div className="text-xs text-primary-200 font-mono mt-4">
                Click anywhere to dismiss
              </div>
            )}
          </div>
          
          {/* Tech decoration */}
          <div className="mt-6 flex justify-center space-x-1">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`w-1 h-1 bg-primary-400 rounded-full ${isShowingResult ? 'animate-pulse' : 'animate-pulse'}`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-400"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-400"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-400"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-400"></div>
      </div>
    </div>
  );
} 