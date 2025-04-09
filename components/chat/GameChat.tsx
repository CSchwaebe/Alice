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
    <form onSubmit={handleSubmit} className="p-2 border-border flex">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type a message..."
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
  );
});

ChatInputForm.displayName = 'ChatInputForm';

interface GameChatProps {
  gameId: string;
  gameName: string;
  playerList: { playerAddress: string; playerNumber: string }[];
}

export default function GameChat({ gameId, gameName, playerList }: GameChatProps) {
  const { messages, players, sendMessage, currentUser, loading, loadMore, loadingMore } = useGameChat(gameId);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mobileChatContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Scroll to bottom only on initial load
  useEffect(() => {
    if (isInitialLoad && !loading && messages.length > 0) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      if (mobileChatContainerRef.current) {
        mobileChatContainerRef.current.scrollTop = mobileChatContainerRef.current.scrollHeight;
      }
      setIsInitialLoad(false);
    }
  }, [loading, messages.length, isInitialLoad]);

  const handleLoadMore = async () => {
    if (!chatContainerRef.current && !mobileChatContainerRef.current) return;
    
    // Store current scroll height before loading more messages
    const desktopScrollHeight = chatContainerRef.current?.scrollHeight || 0;
    const mobileScrollHeight = mobileChatContainerRef.current?.scrollHeight || 0;
    
    await loadMore();
    
    // After messages load, adjust scroll position to maintain relative position
    requestAnimationFrame(() => {
      if (chatContainerRef.current) {
        const newScrollHeight = chatContainerRef.current.scrollHeight;
        const addedHeight = newScrollHeight - desktopScrollHeight;
        chatContainerRef.current.scrollTop += addedHeight;
      }
      if (mobileChatContainerRef.current) {
        const newScrollHeight = mobileChatContainerRef.current.scrollHeight;
        const addedHeight = newScrollHeight - mobileScrollHeight;
        mobileChatContainerRef.current.scrollTop += addedHeight;
      }
    });
  };

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
          ? 'bg-content-2 border border-border text-foreground' 
          : 'bg-content-1 border border-border text-foreground'
      }`}>
        {!isCurrentUser && (
          <div className="text-xs font-mono text-primary-700 font-medium mb-1">
            {message.senderName}
          </div>
        )}
        <div className="text-sm font-mono">{message.content}</div>
        <div className="text-xs font-mono text-primary-400 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto p-3 bg-background overscroll-contain">
      {/* Load More Button */}
      {messages.length >= 100 && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-4 py-2 bg-background border border-border text-primary-400 
                     hover:bg-foreground/10 font-mono text-sm flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                LOADING...
              </>
            ) : (
              'LOAD MORE'
            )}
          </button>
        </div>
      )}

      {/* Messages */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-5 w-5 border-2 border-content-3 border-t-primary-700"></div>
            <div className="text-xs font-mono text-primary-500">LOADING COMMS...</div>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-primary-500 text-center font-mono text-sm py-4">
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
    </div>
  );

  return (
    <>
      {/* Desktop Chat */}
      <div className="hidden min-[1000px]:flex flex-col h-full bg-background backdrop-blur-sm border border-border">
        {/* Chat Header with corner accents */}
        <div className="relative bg-background p-3 border-b border-border flex justify-between items-center">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-500"></div>
          
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary-700 animate-pulse mr-2"></div>
            <span className="text-primary-700 font-mono font-medium uppercase text-sm tracking-wider">
              {gameName}_COMMS [{players.length}]
            </span>
          </div>
        </div>
        
        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 bg-background overscroll-contain">
          {renderMessages()}
        </div>
        
        {/* Input with bottom corner accents */}
        <div className="relative">
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-500"></div>
          <ChatInputForm onSendMessage={sendMessage} disabled={loading} />
        </div>
      </div>

      {/* Mobile Chat */}
      <div className="min-[1000px]:hidden fixed bottom-0 left-0 right-0 z-30">
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-background border-t border-border shadow-[0_-5px_15px_rgba(0,0,0,0.7)]"
            >
              <div className="max-h-[50vh] flex flex-col relative">
                {/* Corner accents for mobile expanded view */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-500 z-10"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-500 z-10"></div>
                
                {/* Make messages container flexible and scrollable */}
                <div ref={mobileChatContainerRef} className="flex-1 overflow-y-auto touch-auto -webkit-overflow-scrolling-touch">
                  {renderMessages()}
                </div>
                
                <div className="relative">
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-500"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-500"></div>
                  <ChatInputForm onSendMessage={sendMessage} disabled={loading} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile toggle button with glitch effect */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center py-2 bg-background border-t border-border 
                    text-primary-700 uppercase tracking-wider font-mono text-sm"
        >
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-500"></div>
            
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