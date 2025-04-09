"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { chatManager, ChatMessage } from '@/lib/chatManager';

export function useGameChat(gameId: string) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
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

  // Function to load more messages
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      await chatManager.loadMoreMessages(gameId, (success) => {
        setLoadingMore(false);
      });
    } catch (error) {
      console.error('Error loading more messages:', error);
      setLoadingMore(false);
    }
  };
  
  return {
    messages,
    players,
    sendMessage,
    loadMore,
    currentUser: address,
    loading,
    loadingMore
  };
}

export type { ChatMessage }; 