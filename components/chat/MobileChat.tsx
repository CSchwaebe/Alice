"use client";

import { useState, useRef, useEffect, memo } from 'react';
import { useGameChat } from '@/hooks/useGameChat';
import { PaperAirplaneIcon, XMarkIcon, ArrowUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
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

interface MobileChatProps {
  gameId: string;
  gameName: string;
  playerList: { playerAddress: string; playerNumber: string }[];
}

export default function MobileChat({ gameId, gameName, playerList }: MobileChatProps) {
  const { messages, sendMessage, currentUser, loading, loadMore, loadingMore } = useGameChat(gameId);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lastMessageIdRef = useRef<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingMoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousScrollTopRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  const loadMoreScrollTopRef = useRef(0);
  const loadedMessagesRef = useRef<typeof messages>([]);

  const isScrolledToBottom = () => {
    if (!chatContainerRef.current) return true;
    const { scrollHeight, scrollTop, clientHeight } = chatContainerRef.current;
    const scrolledPosition = scrollHeight - scrollTop - clientHeight;
    console.log('Scroll values:', {
      scrollHeight,
      scrollTop,
      clientHeight,
      scrolledPosition,
      isAtBottom: scrolledPosition <= 2
    });
    return scrolledPosition <= 2; // Much smaller threshold
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      console.log('Scrolling to bottom');
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
    console.log('Scroll event - changing isAtBottom:', atBottom);
    if (atBottom !== isAtBottom) { // Only update if changed
      setIsAtBottom(atBottom);
      if (atBottom) {
        setUnreadCount(0);
        console.log('Scroll reached bottom - resetting unread count to 0');
      }
    }
  };

  // Handle initial load state
  useEffect(() => {
    if (isInitialLoad && !loading && messages.length > 0) {
      console.log('Initial messages loaded, setting isInitialLoad to false');
      setIsInitialLoad(false);
    }
  }, [loading, messages.length, isInitialLoad]);

  // Handle new messages
  useEffect(() => {
    if (loading) return;

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) return;

    // Skip new message handling during load more operation
    if (isLoadingMoreRef.current) {
      return;
    }

    if (latestMessage.id !== lastMessageIdRef.current) {
      const container = chatContainerRef.current;

      if (container) {
        if (isAtBottom) {
          requestAnimationFrame(() => {
            scrollToBottom();
          });
        } else {
          setUnreadCount(prev => prev + 1);
        }
      }

      lastMessageIdRef.current = latestMessage.id;
    }
  }, [messages, loading, isAtBottom]);

  // Reset unread count when expanding chat and ensure proper scroll position
  useEffect(() => {
    if (isExpanded) {
      setUnreadCount(0);
      // Use a slightly longer delay to ensure the expansion animation is complete
      const timer = setTimeout(() => {
        console.log('Chat expanded, scrolling to bottom');
        scrollToBottom();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Initial scroll and scroll event listener
  useEffect(() => {
    console.log('Effect running - chatContainerRef exists:', !!chatContainerRef.current);
    
    const setupScrollListener = () => {
      const container = chatContainerRef.current;
      if (!container) {
        console.log('Container not found, retrying in 100ms');
        setTimeout(setupScrollListener, 100);
        return;
      }

      console.log('Setting up scroll listener on container:', {
        height: container.clientHeight,
        scrollHeight: container.scrollHeight,
        className: container.className,
        style: container.style.cssText
      });

      const handleScroll = (e: Event) => {
        console.log('Raw scroll event fired from:', (e.target as HTMLElement).className);
        const container = e.target as HTMLElement;
        const { scrollHeight, scrollTop, clientHeight } = container;
        const scrolledPosition = scrollHeight - scrollTop - clientHeight;
        console.log('Scroll values:', {
          scrollHeight,
          scrollTop,
          clientHeight,
          scrolledPosition,
          isAtBottom: scrolledPosition <= 2
        });
        
        const atBottom = scrolledPosition <= 2;
        if (atBottom !== isAtBottom) {
          console.log('Updating isAtBottom to:', atBottom);
          setIsAtBottom(atBottom);
          if (atBottom) {
            setUnreadCount(0);
            console.log('Scroll reached bottom - resetting unread count to 0');
          }
        }
      };

      // Add scroll listener
      container.addEventListener('scroll', handleScroll, { passive: true });
      
      // Force an initial scroll event
      const event = new Event('scroll');
      container.dispatchEvent(event);
      
      return () => {
        console.log('Cleaning up scroll listener');
        container.removeEventListener('scroll', handleScroll);
      };
    };

    // Initial setup
    if (isExpanded) {
      console.log('Chat is expanded, setting up scroll listener');
      const cleanup = setupScrollListener();
      return () => cleanup?.();
    }
  }, [loading, messages.length, isInitialLoad, isAtBottom, isExpanded]);

  const handleLoadMore = async () => {
    if (!chatContainerRef.current) return;
    
    const container = chatContainerRef.current;
    const messageElements = container.querySelectorAll('[data-message-id]');
    
    // Find the first visible message as our reference point
    const visibleMessages = Array.from(messageElements).filter(msg => {
      const rect = msg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
    });
    
    if (visibleMessages.length === 0) return;
    
    const referenceMessage = visibleMessages[0];
    const referenceId = referenceMessage.getAttribute('data-message-id');
    const refRect = referenceMessage.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const initialOffset = refRect.top - containerRect.top;
    
    isLoadingMoreRef.current = true;
    await loadMore();
    loadedMessagesRef.current = messages;
    
    // After loading more, find our reference message and adjust scroll
    requestAnimationFrame(() => {
      if (!chatContainerRef.current || !isLoadingMoreRef.current) return;
      
      const newReferenceMessage = container.querySelector(`[data-message-id="${referenceId}"]`);
      if (!newReferenceMessage) return;
      
      const newRefRect = newReferenceMessage.getBoundingClientRect();
      const newContainerRect = container.getBoundingClientRect();
      const newOffset = newRefRect.top - newContainerRect.top;
      const adjustment = newOffset - initialOffset;
      
      container.scrollTo({
        top: container.scrollTop + adjustment,
        behavior: 'instant'
      });

      isLoadingMoreRef.current = false;
    });
  };

  const getPlayerNumber = (address: string): string => {
    const player = playerList.find(p => 
      p.playerAddress.toLowerCase() === address.toLowerCase()
    );
    return player ? player.playerNumber : '???';
  };

  // Add logging for expansion state
  useEffect(() => {
    console.log('Chat expansion state changed:', isExpanded);
  }, [isExpanded]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingMoreTimeoutRef.current) {
        clearTimeout(loadingMoreTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <AnimatePresence>
        {/* New Messages Button */}
        {!isAtBottom && unreadCount > 0 && isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-0 right-0 bottom-[20vh] flex justify-center z-[1000] pointer-events-auto"
          >
            <button
              onClick={scrollToBottom}
              className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg 
                       flex items-center gap-2 hover:bg-foreground/90
                       transition-colors font-mono text-sm cursor-pointer"
            >
              <span>{unreadCount} New Messages</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-background border-t border-border shadow-[0_-5px_15px_rgba(0,0,0,0.7)]"
            onAnimationComplete={() => {
              console.log('Animation completed, container ref exists:', !!chatContainerRef.current);
              if (chatContainerRef.current) {
                const { scrollHeight, clientHeight } = chatContainerRef.current;
                console.log('Container dimensions after animation:', { scrollHeight, clientHeight });
              }
            }}
          >
            <div className="h-[75vh] flex flex-col relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-500 z-10"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-500 z-10"></div>
              
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
                          <div className={`inline-block p-3 font-mono max-w-full break-all ${
                            msg.sender === currentUser
                              ? 'bg-content-2 border border-border'
                              : 'bg-content-1 border border-border'
                          }`}>
                            {msg.sender !== currentUser && (
                              <div className="text-xs text-primary-700 mb-1">
                                #{getPlayerNumber(msg.sender)}
                              </div>
                            )}
                            <div className="text-sm text-foreground break-all whitespace-pre-wrap">
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
              </div>
              
              {/* Input Form */}
              <div className="relative flex-shrink-0">
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-500"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-500"></div>
                <ChatInputForm onSendMessage={sendMessage} disabled={loading} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center py-2 bg-background border-t border-border 
                  text-primary-700 uppercase tracking-wider font-mono text-sm relative"
      >
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary-500"></div>
          
          <div className="flex items-center gap-2">
            <span>{gameName}_COMMS</span>
            {!isExpanded && unreadCount > 0 && (
              <span className="bg-primary-700 text-background px-2 py-0.5 text-xs rounded-full">
                {unreadCount}
              </span>
            )}
            {isExpanded ? (
              <XMarkIcon className="w-4 h-4" />
            ) : (
              <ArrowUpIcon className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>
    </div>
  );
} 