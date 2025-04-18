"use client";

import { useState, useRef, useEffect, memo } from 'react';
import { useGameChat, ChatMessage } from '@/hooks/useGameChat';
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isMobileAtBottom, setIsMobileAtBottom] = useState(true);
  const lastMessageIdRef = useRef<string | null>(null);
  const messageHeightsRef = useRef<Map<string, number>>(new Map());

  const isScrolledToBottom = (container: HTMLDivElement) => {
    const { scrollHeight, scrollTop, clientHeight } = container;
    const atBottom = scrollHeight - scrollTop - clientHeight <= 50;
    return atBottom;
  };

  const scrollToBottom = (container: HTMLDivElement | null) => {
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
      setUnreadCount(0);
      if (container === chatContainerRef.current) {
        setIsAtBottom(true);
      } else if (container === mobileChatContainerRef.current) {
        setIsMobileAtBottom(true);
      }
    }
  };

  const handleScroll = (e: Event) => {
    const container = e.target as HTMLDivElement;
    if (container === chatContainerRef.current) {
      setIsAtBottom(isScrolledToBottom(container));
    } else if (container === mobileChatContainerRef.current) {
      setIsMobileAtBottom(isScrolledToBottom(container));
    }
  };

  // Track message heights for scroll adjustment
  useEffect(() => {
    const updateMessageHeights = () => {
      const container = chatContainerRef.current;
      const mobileContainer = mobileChatContainerRef.current;
      
      if (container || mobileContainer) {
        const messageElements = (container || mobileContainer)?.querySelectorAll('[data-message-id]');
        messageElements?.forEach((el) => {
          const messageId = el.getAttribute('data-message-id');
          if (messageId) {
            messageHeightsRef.current.set(messageId, el.getBoundingClientRect().height);
          }
        });
      }
    };

    updateMessageHeights();
  }, [messages]);

  // Handle new messages
  useEffect(() => {
    if (loading || isInitialLoad) return;

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) return;

    // Check if this is actually a new message
    if (latestMessage.id !== lastMessageIdRef.current) {
      const desktopContainer = chatContainerRef.current;
      const mobileContainer = mobileChatContainerRef.current;

      // Immediately adjust scroll before the new message is rendered
      const adjustScroll = (container: HTMLDivElement | null, isAtBottom: boolean) => {
        if (!container) return;
        
        if (isAtBottom) {
          scrollToBottom(container);
        } else {
          // Get the last message element to measure its height
          const messageElements = container.querySelectorAll('[data-message-id]');
          const lastMessageElement = messageElements[messageElements.length - 1];
          
          if (lastMessageElement) {
            // Get the computed styles to account for margins
            const computedStyle = window.getComputedStyle(lastMessageElement);
            const messageHeight = lastMessageElement.getBoundingClientRect().height;
            const marginBottom = parseFloat(computedStyle.marginBottom);
            
            // Instantly adjust scroll position including the margin
            container.scrollTo({
              top: container.scrollTop - (messageHeight + marginBottom),
              behavior: 'instant'
            });
          }
        }
      };

      // Adjust scroll for both containers
      adjustScroll(desktopContainer, isAtBottom);
      adjustScroll(mobileContainer, isMobileAtBottom);

      // Update unread count if not at bottom
      if (!isAtBottom || !isMobileAtBottom) {
        setUnreadCount(prev => prev + 1);
      }

      lastMessageIdRef.current = latestMessage.id;
    }
  }, [messages, loading, isInitialLoad, isAtBottom, isMobileAtBottom]);

  // Initial scroll and scroll event listeners
  useEffect(() => {
    if (isInitialLoad && !loading && messages.length > 0) {
      scrollToBottom(chatContainerRef.current);
      scrollToBottom(mobileChatContainerRef.current);
      setIsInitialLoad(false);
    }

    const desktopContainer = chatContainerRef.current;
    const mobileContainer = mobileChatContainerRef.current;

    if (desktopContainer) {
      desktopContainer.addEventListener('scroll', handleScroll);
    }
    if (mobileContainer) {
      mobileContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (desktopContainer) {
        desktopContainer.removeEventListener('scroll', handleScroll);
      }
      if (mobileContainer) {
        mobileContainer.removeEventListener('scroll', handleScroll);
      }
    };
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
    <div 
      data-message-id={message.id}
      className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
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
              senderName: `#${getPlayerNumber(msg.sender).padStart(3, '0')}`
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
      <div className="hidden min-[1000px]:flex flex-col h-[calc(100vh-2rem)] bg-background backdrop-blur-sm border border-border">
        {/* Chat Header with corner accents */}
        <div className="relative bg-background p-3 border-b border-border flex justify-between items-center flex-shrink-0">
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
        
        {/* Messages Container */}
        <div className="flex-1 min-h-0 relative">
          <div ref={chatContainerRef} className="absolute inset-0 overflow-y-auto scroll-smooth">
            {renderMessages()}
          </div>
          
          {/* New Messages Button */}
          <AnimatePresence>
            {unreadCount > 0 && !isAtBottom && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={() => scrollToBottom(chatContainerRef.current)}
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
        
        {/* Input with bottom corner accents */}
        <div className="relative flex-shrink-0">
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
              <div className="h-[50vh] flex flex-col relative">
                {/* Corner accents for mobile expanded view */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary-500 z-10"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary-500 z-10"></div>
                
                {/* Make messages container flexible and scrollable */}
                <div className="flex-1 min-h-0 relative">
                  <div ref={mobileChatContainerRef} className="absolute inset-0 overflow-y-auto scroll-smooth">
                    {renderMessages()}
                  </div>
                  
                  {/* Mobile New Messages Button */}
                  <AnimatePresence>
                    {unreadCount > 0 && !isMobileAtBottom && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50">
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          onClick={() => scrollToBottom(mobileChatContainerRef.current)}
                          className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg 
                                    flex items-center gap-2 hover:bg-foreground/90
                                    transition-colors font-mono text-sm"
                        >
                          <span>{unreadCount} NEW</span>
                          <ChevronDownIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative flex-shrink-0">
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