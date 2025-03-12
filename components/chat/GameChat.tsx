"use client";

import { useState, useRef, useEffect } from 'react';
import { useGameChat, ChatMessage } from '@/hooks/useGameChat';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface GameChatProps {
  gameId: string;
  gameName: string;
}

export default function GameChat({ gameId, gameName }: GameChatProps) {
  const { messages, players, sendMessage, currentUser, loading } = useGameChat(gameId);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  return (
    <div className={`fixed bottom-0 right-4 ${isExpanded ? 'w-80 h-96' : 'w-56 h-12'} 
                     bg-dark-700 border border-dark-400 rounded-t-lg shadow-lg 
                     transition-all duration-300 ease-in-out z-20`}>
      {/* Chat Header */}
      <div 
        className="bg-dark-600 p-2 rounded-t-lg cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-2 h-2 bg-neon-300 rounded-full mr-2"></div>
          <span className="text-neon-100 font-medium truncate">
            {gameName} Chat ({players.length})
          </span>
        </div>
        {isExpanded && (
          <XMarkIcon 
            className="w-5 h-5 text-gray-400 hover:text-white" 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          />
        )}
      </div>
      
      {isExpanded && (
        <>
          {/* Messages Container */}
          <div className="h-72 overflow-y-auto p-3 bg-dark-800">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-6 w-6 border-2 border-neon-300 rounded-full border-t-transparent mb-2"></div>
                  <div className="text-sm text-gray-400">Loading chat...</div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-gray-400 text-center text-sm py-4">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble 
                  key={msg.id}
                  message={msg}
                  isCurrentUser={msg.sender === currentUser}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-2 border-t border-dark-500 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-dark-600 border border-dark-400 rounded-l-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-300"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className="bg-neon-600 hover:bg-neon-500 text-white px-3 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
        isCurrentUser 
          ? 'bg-neon-600 text-white' 
          : 'bg-dark-600 text-gray-200'
      }`}>
        {!isCurrentUser && (
          <div className="text-xs text-neon-300 font-medium mb-1">
            {message.senderName}
          </div>
        )}
        <div className="text-sm">{message.content}</div>
        <div className="text-xs text-right opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
} 