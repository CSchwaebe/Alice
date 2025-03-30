"use client";

import { useState, useRef, useEffect, memo } from 'react';
import { useGameChat, ChatMessage } from '@/hooks/useGameChat';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

// Isolated input component to prevent re-render issues
const ChatInputForm = memo(({ onSendMessage, disabled }: { 
  onSendMessage: (message: string) => void;
  disabled: boolean;
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <div className="relative">
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <form onSubmit={handleSubmit} className="flex p-4 bg-background">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="ENTER MESSAGE..."
          className="flex-1 bg-background font-mono border border-border 
                    px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary-600
                    placeholder:text-primary-300"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || disabled}
          className="bg-background text-foreground border border-border 
                   border-l-0 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                   hover:bg-foreground/10"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
});

ChatInputForm.displayName = 'ChatInputForm';

interface LobbyChatProps {
  gameId: string;
  playerList: { playerAddress: string; playerNumber: string }[];
}

export default function LobbyChat({ gameId, playerList }: LobbyChatProps) {
  const { messages, sendMessage, currentUser, loading } = useGameChat(gameId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle auto-scrolling
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
    setAutoScroll(isAtBottom);
  };

  const getPlayerNumber = (address: string): string => {
    const player = playerList.find(p => 
      p.playerAddress.toLowerCase() === address.toLowerCase()
    );
    return player ? player.playerNumber : '???';
  };

  return (
    <div className="flex flex-col h-full bg-background/40 backdrop-blur-sm border border-border">
      {/* Chat Header */}
      <div className="relative">
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-primary-700 animate-pulse"></div>
            <span className="font-mono text-primary-700 text-sm tracking-wider">NEXUS_COMMS</span>
          </div>
          <div className="font-mono text-primary-400 text-xs">
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-300 
                   scrollbar-track-transparent p-4 space-y-4"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-content-3 border-t-primary-700"></div>
              <div className="text-xs font-mono text-primary-500">LOADING COMMS...</div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <div className="text-primary-500 font-mono text-sm">COMMS ONLINE</div>
            <div className="text-primary-400 font-mono text-xs">AWAITING TRANSMISSION</div>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.sender === currentUser ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 font-mono ${
                  msg.sender === currentUser
                    ? 'bg-content-2 border border-border'
                    : 'bg-content-1 border border-border'
                }`}>
                  {msg.sender !== currentUser && (
                    <div className="text-xs text-primary-700 mb-1">
                      #{getPlayerNumber(msg.sender)}
                    </div>
                  )}
                  <div className="text-sm text-foreground">{msg.content}</div>
                  <div className="text-xs text-primary-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <ChatInputForm onSendMessage={sendMessage} disabled={loading} />
    </div>
  );
} 