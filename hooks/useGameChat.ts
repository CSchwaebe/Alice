"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { chatManager, ChatMessage } from '@/lib/chatManager';

export function useGameChat(gameId: string) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Subscribe to chat updates
    const unsubscribe = chatManager.subscribe(
      gameId,
      address,
      (newMessages) => setMessages(newMessages),
      (newPlayers) => setPlayers(newPlayers),
      (isLoading) => setLoading(isLoading)
    );
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, [gameId, address]);
  
  // Function to send a message
  const sendMessage = (content: string) => {
    if (address) {
      chatManager.sendMessage(gameId, address, content);
    }
  };
  
  return {
    messages,
    players,
    sendMessage,
    currentUser: address,
    loading
  };
}

export type { ChatMessage }; 