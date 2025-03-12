import { database } from '@/config/firebase';
import { 
  ref, 
  onValue, 
  push, 
  set, 
  serverTimestamp, 
  query, 
  limitToLast, 
  orderByChild,
  DatabaseReference,
  off
} from 'firebase/database';

// Message type definition
export interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: number;
}

// Define the type for event callbacks
type MessageCallback = (messages: ChatMessage[]) => void;
type PlayersCallback = (players: string[]) => void;
type LoadingCallback = (loading: boolean) => void;

// Singleton class to manage chat connections
class ChatManager {
  private static instance: ChatManager;
  private messageCallbacks: Map<string, Set<MessageCallback>> = new Map();
  private playerCallbacks: Map<string, Set<PlayersCallback>> = new Map();
  private loadingCallbacks: Map<string, Set<LoadingCallback>> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();
  private players: Map<string, string[]> = new Map();
  private messagesRefs: Map<string, DatabaseReference> = new Map();
  private playersRefs: Map<string, DatabaseReference> = new Map();
  private active = false;
  
  private constructor() {
    // Private constructor to enforce singleton
  }
  
  // Get the singleton instance
  public static getInstance(): ChatManager {
    if (!ChatManager.instance) {
      ChatManager.instance = new ChatManager();
    }
    return ChatManager.instance;
  }
  
  // Start listening for a specific game chat
  public subscribe(
    gameId: string, 
    address: string | undefined,
    onMessages: MessageCallback,
    onPlayers: PlayersCallback,
    onLoading: LoadingCallback
  ): () => void {
    this.active = true;
    
    // Set initial loading state
    onLoading(true);
    
    // Initialize callbacks collections if needed
    if (!this.messageCallbacks.has(gameId)) {
      this.messageCallbacks.set(gameId, new Set());
    }
    if (!this.playerCallbacks.has(gameId)) {
      this.playerCallbacks.set(gameId, new Set());
    }
    if (!this.loadingCallbacks.has(gameId)) {
      this.loadingCallbacks.set(gameId, new Set());
    }
    
    // Add callbacks
    this.messageCallbacks.get(gameId)!.add(onMessages);
    this.playerCallbacks.get(gameId)!.add(onPlayers);
    this.loadingCallbacks.get(gameId)!.add(onLoading);
    
    // If we already have data, send it immediately
    if (this.messages.has(gameId)) {
      onMessages(this.messages.get(gameId)!);
    }
    if (this.players.has(gameId)) {
      onPlayers(this.players.get(gameId)!);
    }
    
    // If we haven't set up listeners yet, do so now
    if (!this.messagesRefs.has(gameId)) {
      this.setupListeners(gameId, address);
    } else if (address) {
      // If we already have listeners but user just connected, add them to players
      this.addPlayer(gameId, address);
    }
    
    // Return an unsubscribe function
    return () => {
      // Remove callbacks
      this.messageCallbacks.get(gameId)?.delete(onMessages);
      this.playerCallbacks.get(gameId)?.delete(onPlayers);
      this.loadingCallbacks.get(gameId)?.delete(onLoading);
      
      // If no more subscribers for this game, clean up listeners
      if (
        this.messageCallbacks.get(gameId)?.size === 0 &&
        this.playerCallbacks.get(gameId)?.size === 0
      ) {
        this.cleanupListeners(gameId);
      }
    };
  }
  
  // Send a message
  public sendMessage(gameId: string, address: string, content: string): void {
    if (!address || !content.trim() || !this.active) return;
    
    try {
      const chatRoomRef = ref(database, `chats/${gameId}/messages`);
      const newMessageRef = push(chatRoomRef);
      
      set(newMessageRef, {
        sender: address,
        senderName: this.shortenAddress(address),
        content: content.trim(),
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  
  // Add a player to the game
  private addPlayer(gameId: string, address: string): void {
    if (!address) return;
    
    try {
      const playerRef = ref(database, `chats/${gameId}/players/${address}`);
      set(playerRef, {
        address,
        lastActive: serverTimestamp(),
        name: this.shortenAddress(address),
      });
      
      // Also add test player
      const testAddress = "0x9e1Ef95b0CDAb7e3C9c28dD5e700A280bb7Bd202";
      const testPlayerRef = ref(database, `chats/${gameId}/players/${testAddress}`);
      set(testPlayerRef, {
        address: testAddress,
        lastActive: serverTimestamp(),
        name: this.shortenAddress(testAddress),
      });
    } catch (error) {
      console.error("Error adding player:", error);
    }
  }
  
  // Setup Firebase listeners
  private setupListeners(gameId: string, address: string | undefined): void {
    let messagesLoaded = false;
    let playersLoaded = false;
    
    const updateLoadingState = () => {
      if (messagesLoaded && playersLoaded) {
        this.loadingCallbacks.get(gameId)?.forEach(callback => callback(false));
      }
    };
    
    // Messages listener
    const chatRoomRef = ref(database, `chats/${gameId}/messages`);
    const messagesQuery = query(
      chatRoomRef,
      orderByChild('timestamp'),
      limitToLast(10)
    );
    
    // Store refs for cleanup
    this.messagesRefs.set(gameId, chatRoomRef);
    
    onValue(messagesQuery, (snapshot) => {
      try {
        const messageData = snapshot.val();
        const messageList: ChatMessage[] = [];
        
        if (messageData) {
          Object.keys(messageData).forEach((key) => {
            messageList.push({
              id: key,
              ...messageData[key],
            });
          });
          
          messageList.sort((a, b) => a.timestamp - b.timestamp);
        }
        
        // Update internal state
        this.messages.set(gameId, messageList);
        
        // Notify subscribers
        this.messageCallbacks.get(gameId)?.forEach(callback => callback(messageList));
        
        messagesLoaded = true;
        updateLoadingState();
      } catch (error) {
        console.error("Error processing messages:", error);
        messagesLoaded = true;
        updateLoadingState();
      }
    });
    
    // Players listener
    const playersRef = ref(database, `chats/${gameId}/players`);
    this.playersRefs.set(gameId, playersRef);
    
    // Add current player if available
    if (address) {
      this.addPlayer(gameId, address);
    }
    
    onValue(playersRef, (snapshot) => {
      try {
        const testAddress = "0x9e1Ef95b0CDAb7e3C9c28dD5e700A280bb7Bd202";
        const playerData = snapshot.val();
        let playerList: string[] = [];
        
        if (playerData) {
          playerList = Object.keys(playerData);
          if (!playerList.includes(testAddress)) {
            playerList.push(testAddress);
          }
        } else {
          playerList = address ? [address, testAddress] : [testAddress];
        }
        
        // Update internal state
        this.players.set(gameId, playerList);
        
        // Notify subscribers
        this.playerCallbacks.get(gameId)?.forEach(callback => callback(playerList));
        
        playersLoaded = true;
        updateLoadingState();
      } catch (error) {
        console.error("Error processing players:", error);
        playersLoaded = true;
        updateLoadingState();
      }
    });
  }
  
  // Clean up listeners
  private cleanupListeners(gameId: string): void {
    const messagesRef = this.messagesRefs.get(gameId);
    const playersRef = this.playersRefs.get(gameId);
    
    if (messagesRef) {
      off(messagesRef);
      this.messagesRefs.delete(gameId);
    }
    
    if (playersRef) {
      off(playersRef);
      this.playersRefs.delete(gameId);
    }
    
    this.messageCallbacks.delete(gameId);
    this.playerCallbacks.delete(gameId);
    this.loadingCallbacks.delete(gameId);
    this.messages.delete(gameId);
    this.players.delete(gameId);
  }
  
  // Shutdown all connections
  public shutdown(): void {
    this.active = false;
    
    // Clean up all game connections
    for (const gameId of this.messagesRefs.keys()) {
      this.cleanupListeners(gameId);
    }
  }
  
  // Helper function to shorten addresses
  private shortenAddress(address: string): string {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}

// Export the singleton instance
export const chatManager = ChatManager.getInstance();

// Clean up when the module is hot reloaded in development
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    chatManager.shutdown();
  });
} 