"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { RagnarokGameMasterABI } from '@/app/abis/RagnarokGameMasterABI';
import { DoorsABI } from '@/app/abis/DoorsABI';
import { ThreesABI } from '@/app/abis/ThreesABI';
import { Log, decodeEventLog } from 'viem';

// Define contract names
export type ContractName = 'GameMaster' | 'Doors' | 'Threes';

// Define all the possible event types we'll handle
export type ContractEventType = {
  contract: ContractName;
  event: 
    // GameMaster events
    | 'RegistrationFeeChanged'
    | 'PlayerRegistered'
    | 'RegistrationClosed'
    | 'GameRegistered'
    | 'GameStarted'
    | 'PlayersRegistered'
    | 'PlayerNumberAssigned'
    
    // Doors events
    | 'GameInitialized'
    | 'RoundStarted'
    | 'DoorOpened'
    | 'PlayerEliminated'
    | 'RoundEnded'
    | 'GameCompleted'
    
    // Threes events
    | 'PlayerCommitted'
    | 'PlayerRevealed';
};

// Event data structure
export interface ContractEvent {
  type: ContractEventType;
  data: any;
  timestamp: number;
  contractAddress: string;
}

// Context type definition
interface ContractEventsContextType {
  events: ContractEvent[];
  subscribe: (eventTypes: ContractEventType[], callback: (event: ContractEvent) => void) => () => void;
  clearEvents: () => void;
}

// Create the context
const ContractEventsContext = createContext<ContractEventsContextType | undefined>(undefined);

// Event Provider component
export function ContractEventsProvider({ children }: { children: React.ReactNode }) {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const eventsRef = useRef<ContractEvent[]>([]);
  const subscribersRef = useRef<Map<string, (event: ContractEvent) => void>>(new Map());
  const unsubscribeRef = useRef<(() => void)[]>([]);

  // Helper function to process logs
  const processLog = (log: Log, contractAddress: string, contractType: ContractName, eventName: ContractEventType['event']) => {
    let decodedData;
    try {
      const abi = contractType === 'GameMaster' ? RagnarokGameMasterABI :
                  contractType === 'Doors' ? DoorsABI :
                  contractType === 'Threes' ? ThreesABI : null;
      
      if (!abi) {
        console.error('Unknown contract type:', contractType);
        return;
      }

      decodedData = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics,
        eventName: eventName
      });
    } catch (error) {
      console.error('Error decoding event log:', error);
      return;
    }

    addEvent({
      type: {
        contract: contractType,
        event: eventName
      },
      data: {
        address: contractAddress,
        args: decodedData,
        blockNumber: log.blockNumber?.toString() ?? '0',
        transactionHash: log.transactionHash ?? '0x'
      },
      timestamp: Date.now(),
      contractAddress
    });
  };

  // Function to add a new event
  const addEvent = useCallback((event: ContractEvent) => {
    // Check if we already have this event (avoid duplicates)
    const existingEvent = eventsRef.current.find(
      e => 
        e.type.contract === event.type.contract && 
        e.type.event === event.type.event &&
        e.timestamp === event.timestamp
    );
    
    if (existingEvent) {
      return;
    }
    
    // Update the ref and state
    eventsRef.current = [...eventsRef.current, event];
    setEvents(eventsRef.current);
    
    // Notify subscribers
    subscribersRef.current.forEach((callback) => {
      if (callback) {
        callback(event);
      }
    });
    
    console.log(`Event received: ${event.type.contract}.${event.type.event}`, event.data);
  }, []);
  
  // Clear all events
  const clearEvents = useCallback(() => {
    eventsRef.current = [];
    setEvents([]);
  }, []);
  
  // Subscribe to events
  const subscribe = useCallback((eventTypes: ContractEventType[], callback: (event: ContractEvent) => void) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Create a filtered callback that only triggers for the specified event types
    const filteredCallback = (event: ContractEvent) => {
      if (eventTypes.some(type => 
        type.contract === event.type.contract && 
        type.event === event.type.event
      )) {
        callback(event);
      }
    };
    
    subscribersRef.current.set(id, filteredCallback);
    
    // Return unsubscribe function
    return () => {
      subscribersRef.current.delete(id);
    };
  }, []);

  // Set up WebSocket subscriptions
  useEffect(() => {
    if (!publicClient) return;

    const gameMasterAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as `0x${string}`;
    const doorsAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DOORS as `0x${string}`;
    const threesAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_THREES as `0x${string}`;

    const setupSubscriptions = async () => {
      try {
        // Subscribe to GameMaster events
        const gameMasterUnsubscribes = await Promise.all([
          // Registration events
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: RagnarokGameMasterABI,
            eventName: 'RegistrationFeeChanged',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'RegistrationFeeChanged'));
            }
          }),
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: RagnarokGameMasterABI,
            eventName: 'PlayerRegistered',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'PlayerRegistered'));
            }
          }),
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: RagnarokGameMasterABI,
            eventName: 'RegistrationClosed',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'RegistrationClosed'));
            }
          }),
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: RagnarokGameMasterABI,
            eventName: 'GameRegistered',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'GameRegistered'));
            }
          }),
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: RagnarokGameMasterABI,
            eventName: 'GameStarted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'GameStarted'));
            }
          })
        ]);

        // Subscribe to Doors events
        const doorsUnsubscribes = await Promise.all([
          publicClient.watchContractEvent({
            address: doorsAddress,
            abi: DoorsABI,
            eventName: 'GameInitialized',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, doorsAddress, 'Doors', 'GameInitialized'));
            }
          }),
          publicClient.watchContractEvent({
            address: doorsAddress,
            abi: DoorsABI,
            eventName: 'RoundStarted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, doorsAddress, 'Doors', 'RoundStarted'));
            }
          }),
          publicClient.watchContractEvent({
            address: doorsAddress,
            abi: DoorsABI,
            eventName: 'DoorOpened',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, doorsAddress, 'Doors', 'DoorOpened'));
            }
          }),
          publicClient.watchContractEvent({
            address: doorsAddress,
            abi: DoorsABI,
            eventName: 'PlayerEliminated',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, doorsAddress, 'Doors', 'PlayerEliminated'));
            }
          })
        ]);

        // Subscribe to Threes events
        const threesUnsubscribes = await Promise.all([
          publicClient.watchContractEvent({
            address: threesAddress,
            abi: ThreesABI,
            eventName: 'RoundStarted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, threesAddress, 'Threes', 'RoundStarted'));
            }
          }),
          publicClient.watchContractEvent({
            address: threesAddress,
            abi: ThreesABI,
            eventName: 'PlayerCommitted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, threesAddress, 'Threes', 'PlayerCommitted'));
            }
          }),
          publicClient.watchContractEvent({
            address: threesAddress,
            abi: ThreesABI,
            eventName: 'PlayerRevealed',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, threesAddress, 'Threes', 'PlayerRevealed'));
            }
          }),
          publicClient.watchContractEvent({
            address: threesAddress,
            abi: ThreesABI,
            eventName: 'PlayerEliminated',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, threesAddress, 'Threes', 'PlayerEliminated'));
            }
          }),
          publicClient.watchContractEvent({
            address: threesAddress,
            abi: ThreesABI,
            eventName: 'GameCompleted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, threesAddress, 'Threes', 'GameCompleted'));
            }
          })
        ]);

        // Store unsubscribe functions
        unsubscribeRef.current = [...gameMasterUnsubscribes, ...doorsUnsubscribes, ...threesUnsubscribes];
      } catch (error) {
        console.error('Error setting up event subscriptions:', error);
      }
    };

    setupSubscriptions();

    // Cleanup function
    return () => {
      unsubscribeRef.current.forEach((unsubscribe) => {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from event:', error);
        }
      });
      unsubscribeRef.current = [];
    };
  }, [publicClient, addEvent]);

  const contextValue = {
    events,
    subscribe,
    clearEvents,
  };

  return React.createElement(
    ContractEventsContext.Provider,
    { value: contextValue },
    children
  );
}

// Custom hook to use the contract events context
export function useContractEvents() {
  const context = useContext(ContractEventsContext);
  
  if (context === undefined) {
    throw new Error('useContractEvents must be used within a ContractEventsProvider');
  }
  
  return context;
}

// Custom hook to subscribe to specific events
export function useContractEventSubscription(
  eventTypes: ContractEventType[],
  callback: (event: ContractEvent) => void,
  dependencies: any[] = []
) {
  const { subscribe } = useContractEvents();
  
  useEffect(() => {
    const unsubscribe = subscribe(eventTypes, callback);
    return unsubscribe;
  }, [subscribe, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps
} 