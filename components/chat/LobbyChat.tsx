"use client";

import { useState, useRef, useEffect, memo } from 'react';
import { useGameChat } from '@/hooks/useGameChat';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

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
  const { messages, sendMessage, currentUser, loading, loadMore, loadingMore } = useGameChat(gameId);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lastMessageIdRef = useRef<string | null>(null);

  const isScrolledToBottom = () => {
    if (!chatContainerRef.current) return true;
    const { scrollHeight, scrollTop, clientHeight } = chatContainerRef.current;
    return scrollHeight - scrollTop - clientHeight <= 50;
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setUnreadCount(0);
      setIsAtBottom(true);
    }
  };

  const handleScroll = () => {
    const atBottom = isScrolledToBottom();
    setIsAtBottom(atBottom);
    if (atBottom) {
      setUnreadCount(0);
    }
  };

  // Handle new messages
  useEffect(() => {
    if (loading || isInitialLoad) return;

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) return;

    if (latestMessage.id !== lastMessageIdRef.current) {
      const container = chatContainerRef.current;

      if (container) {
        if (isAtBottom) {
          scrollToBottom();
        } else {
          const messageElements = container.querySelectorAll('[data-message-id]');
          
          // Store the position of a reference message before adding new message
          const visibleMessages = Array.from(messageElements).filter(msg => {
            const rect = msg.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
          });
          
          if (visibleMessages.length > 0) {
            const referenceMessage = visibleMessages[0];
            const refRect = referenceMessage.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const initialOffset = refRect.top - containerRect.top;

            // If we're at or above the message limit, just maintain position
            if (messages.length >= 100 && messageElements.length >= 100) {
              container.scrollTo({
                top: container.scrollTop,
                behavior: 'instant'
              });
            } else {
              // Wait a tick for the new message to be rendered and measured
              requestAnimationFrame(() => {
                const newRefRect = referenceMessage.getBoundingClientRect();
                const newContainerRect = container.getBoundingClientRect();
                const newOffset = newRefRect.top - newContainerRect.top;
                const adjustment = newOffset - initialOffset;

                container.scrollTo({
                  top: container.scrollTop + adjustment,
                  behavior: 'instant'
                });
              });
            }
            setUnreadCount(prev => prev + 1);
          }
        }
      }

      lastMessageIdRef.current = latestMessage.id;
    }
  }, [messages, loading, isInitialLoad, isAtBottom]);

  // Initial scroll and scroll event listener
  useEffect(() => {
    if (isInitialLoad && !loading && messages.length > 0 && chatContainerRef.current) {
      scrollToBottom();
      setIsInitialLoad(false);
    }

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loading, messages.length, isInitialLoad]);

  const handleLoadMore = async () => {
    if (!chatContainerRef.current) return;
    
    // Store current scroll height before loading more messages
    const scrollHeight = chatContainerRef.current.scrollHeight;
    
    await loadMore();
    
    // After messages load, adjust scroll position to maintain relative position
    requestAnimationFrame(() => {
      if (chatContainerRef.current) {
        const newScrollHeight = chatContainerRef.current.scrollHeight;
        const addedHeight = newScrollHeight - scrollHeight;
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollTop + addedHeight,
          behavior: 'instant'
        });
      }
    });
  };

  const getPlayerNumber = (address: string): string => {
    const player = playerList.find(p => 
      p.playerAddress.toLowerCase() === address.toLowerCase()
    );
    return player ? player.playerNumber : '???';
  };

  return (
    <div className="flex flex-col h-[600px] bg-background/40 backdrop-blur-sm border border-border">
      {/* Chat Header */}
      <div className="relative flex-shrink-0">
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
      <div className="flex-1 min-h-0 relative">
        <div 
          ref={chatContainerRef}
          className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-300 
                     scrollbar-track-transparent p-4 space-y-4 scroll-smooth"
        >
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
                data-message-id={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.sender === currentUser ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 font-mono max-w-full break-word ${
                    msg.sender === currentUser
                      ? 'bg-content-2 border border-border'
                      : 'bg-content-1 border border-border'
                  }`}>
                    {msg.sender !== currentUser && (
                      <div className="text-xs text-primary-700 mb-1">
                        #{getPlayerNumber(msg.sender)}
                      </div>
                    )}
                    <div className="text-sm text-foreground break-word whitespace-pre-wrap">
                      {msg.content}
                    </div>
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
        </div>

        {/* New Messages Button */}
        <AnimatePresence>
          {!isAtBottom && unreadCount > 0 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={scrollToBottom}
                className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg 
                          flex items-center gap-2 hover:bg-foreground/90
                          transition-colors font-mono text-sm"
              >
                <span>{unreadCount} New Messages</span>
                <ChevronDownIcon className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Form */}
      <div className="flex-shrink-0">
        <ChatInputForm onSendMessage={sendMessage} disabled={loading} />
      </div>
    </div>
  );
} 