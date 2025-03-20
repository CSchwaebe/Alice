"use client";

import { useState, useRef, useEffect, memo } from 'react';
import { useGameChat, ChatMessage } from '@/hooks/useGameChat';
import { PaperAirplaneIcon, XMarkIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

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
    <form onSubmit={handleSubmit} className="p-2 border-t border-dark-700 flex">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-black font-mono border-0 border-l border-t border-b border-neon-300/30 
                  px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-300/60"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!inputValue.trim() || disabled}
        className="bg-black text-neon-300 border border-neon-300/30 hover:border-neon-300 
                 border-l-0 px-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <PaperAirplaneIcon className="w-4 h-4" />
      </button>
    </form>
  );
});

ChatInputForm.displayName = 'ChatInputForm';

interface GameChatProps {
  gameId: string;
  gameName: string;
  playerList: { playerAddress: string; playerNumber: string }[];
}

export default function GameChat({ gameId, gameName, playerList }: GameChatProps) {
  const { messages, players, sendMessage, currentUser, loading } = useGameChat(gameId);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPlayerNumber = (address: string): string => {
    const player = playerList.find(p => 
      p.playerAddress.toLowerCase() === address.toLowerCase()
    );
    return player ? player.playerNumber : '???';
  };

  const MessageBubble = ({ message, isCurrentUser }: { message: ChatMessage; isCurrentUser: boolean }) => (
    <div className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 ${
        isCurrentUser 
          ? 'bg-black border border-neon-300/40 text-white' 
          : 'bg-dark-900 border border-dark-700 text-gray-200'
      }`}>
        {!isCurrentUser && (
          <div className="text-xs font-mono text-neon-300 font-medium mb-1">
            {message.senderName}
          </div>
        )}
        <div className="text-sm font-mono">{message.content}</div>
        <div className="text-xs font-mono text-right opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto p-3 bg-black overscroll-contain">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center">
            <div className="animate-pulse h-0.5 w-16 bg-neon-300 mb-2"></div>
            <div className="text-sm font-mono text-gray-400">LOADING DATA...</div>
            <div className="animate-pulse h-0.5 w-16 bg-neon-300 mt-2"></div>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-gray-400 text-center font-mono text-sm py-4">
          NO MESSAGES YET. INITIATE COMMUNICATION.
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble 
            key={msg.id}
            message={{
              ...msg,
              senderName: `${getPlayerNumber(msg.sender)}`
            }}
            isCurrentUser={msg.sender === currentUser}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <>
      {/* Desktop Chat */}
      <div className="hidden md:flex flex-col h-[calc(100vh-2rem)] w-80 bg-black border border-neon-300/30 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        {/* Chat Header with corner accents */}
        <div className="relative bg-black p-3 border-b border-dark-800 flex justify-between items-center">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-300/60"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neon-300/60"></div>
          
          <div className="flex items-center">
            <div className="w-2 h-2 bg-neon-300 mr-2"></div>
            <span className="text-neon-100 font-mono font-medium uppercase text-sm tracking-wider">
              {gameName}_COMMS [{players.length}]
            </span>
          </div>
        </div>
        
        {/* Messages */}
        {renderMessages()}
        
        {/* Input with bottom corner accents */}
        <div className="relative">
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neon-300/60"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-300/60"></div>
          <ChatInputForm onSendMessage={sendMessage} disabled={loading} />
        </div>
      </div>

      {/* Mobile Chat */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-black border-t border-neon-300/30 shadow-[0_-5px_15px_rgba(0,0,0,0.7)]"
            >
              <div className="max-h-[50vh] flex flex-col relative">
                {/* Corner accents for mobile expanded view */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-300/60 z-10"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neon-300/60 z-10"></div>
                
                {/* Make messages container flexible and scrollable */}
                <div className="flex-1 overflow-y-auto touch-auto -webkit-overflow-scrolling-touch">
                  {renderMessages()}
                </div>
                
                <div className="relative">
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neon-300/60"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-300/60"></div>
                  <ChatInputForm onSendMessage={sendMessage} disabled={loading} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile toggle button with glitch effect */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center py-2 bg-black border-t border-neon-300/30 
                    text-neon-100 uppercase tracking-wider font-mono text-sm"
        >
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-300/60"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neon-300/60"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neon-300/60"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-300/60"></div>
            
            <span className="mr-2">{gameName}_COMMS [{players.length}]</span>
            {isExpanded ? (
              <XMarkIcon className="w-4 h-4" />
            ) : (
              <ArrowUpIcon className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>
    </>
  );
} 