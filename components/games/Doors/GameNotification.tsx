import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameNotificationProps {
  message: string | null;
  type: 'success' | 'danger' | 'info';
  duration?: number; // milliseconds
}

export default function GameNotification({ 
  message, 
  type, 
  duration = 4000 
}: GameNotificationProps) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (message) {
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration]);
  
  // Map type to style
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-900/20 text-green-400';
      case 'danger':
        return 'border-red-500 bg-red-900/20 text-red-400';
      case 'info':
      default:
        return 'border-blue-500 bg-blue-900/20 text-blue-400';
    }
  };
  
  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 
                     font-mono text-sm px-6 py-4 border ${getTypeStyles()}
                     shadow-lg max-w-md text-center`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 