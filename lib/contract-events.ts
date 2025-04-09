"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { GameMasterABI } from '@/app/abis/GameMasterABI';
import { DoorsABI } from '@/app/abis/DoorsABI';
import { ThreesABI } from '@/app/abis/ThreesABI';
import { BiddingABI } from '@/app/abis/BiddingABI';
import { DescendABI } from '@/app/abis/DescendABI';
import { Log, decodeEventLog } from 'viem';

// Define contract names
export type ContractName = 'GameMaster' | 'Doors' | 'Threes' | 'Bidding' | 'Descend';

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
    | 'PlayerRevealed'
    
    // Bidding events
    | 'PointsDeducted'

    // Descend events
    | 'RoundStarted'
    | 'PlayerCommitted'
    | 'PlayerRevealed'
    | 'PlayerEliminated'
    | 'PlayerMoved'
    | 'LevelElimination'
    | 'GameCompleted';
};

// Event data structure
export interface ContractEvent {
  type: ContractEventType;
  data: any;
  timestamp: number;
  contractAddress: string;
}

// Add these types at the top with other type definitions
export interface EventHandlerConfig {
  gameId: bigint | null;
  address: `0x${string}` | undefined;
  onNotification?: (notification: GameNotification) => void;
  refetchGameInfo?: () => void;
  refetchPlayerInfo?: () => void;
  setCurrentRound?: (round: bigint) => void;
  setRoundEndTime?: (time: number) => void;
  setTxStatus?: (status: 'success' | 'error' | 'none' | 'pending') => void;
  setErrorMessage?: (message: string) => void;
  router?: any;
  setCurrentPhase?: (phase: number) => void;
}

export interface GameNotification {
  title: string;
  description: string;
  color: 'primary' | 'success' | 'danger';
  timeout?: number,
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
      const abi = contractType === 'GameMaster' ? GameMasterABI :
                  contractType === 'Doors' ? DoorsABI :
                  contractType === 'Threes' ? ThreesABI :
                  contractType === 'Bidding' ? BiddingABI :
                  contractType === 'Descend' ? DescendABI : null;
      
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
    const biddingAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_BIDDING as `0x${string}`;
    const descendAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAME_DESCEND as `0x${string}`;

    const setupSubscriptions = async () => {
      try {
        // Subscribe to GameMaster events
        const gameMasterUnsubscribes = await Promise.all([
          // Registration events
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: GameMasterABI,
            eventName: 'RegistrationFeeChanged',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'RegistrationFeeChanged'));
            }
          }),
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: GameMasterABI,
            eventName: 'PlayerRegistered',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'PlayerRegistered'));
            }
          }),
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: GameMasterABI,
            eventName: 'RegistrationClosed',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'RegistrationClosed'));
            }
          }),
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: GameMasterABI,
            eventName: 'GameRegistered',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, gameMasterAddress, 'GameMaster', 'GameRegistered'));
            }
          }),
          publicClient.watchContractEvent({
            address: gameMasterAddress,
            abi: GameMasterABI,
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

        // Subscribe to Bidding events
        const biddingUnsubscribes = await Promise.all([
          publicClient.watchContractEvent({
            address: biddingAddress,
            abi: BiddingABI,
            eventName: 'RoundStarted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, biddingAddress, 'Bidding', 'RoundStarted'));
            }
          }),
          publicClient.watchContractEvent({
            address: biddingAddress,
            abi: BiddingABI,
            eventName: 'PlayerCommitted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, biddingAddress, 'Bidding', 'PlayerCommitted'));
            }
          }),
          publicClient.watchContractEvent({
            address: biddingAddress,
            abi: BiddingABI,
            eventName: 'PlayerRevealed',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, biddingAddress, 'Bidding', 'PlayerRevealed'));
            }
          }),
          publicClient.watchContractEvent({
            address: biddingAddress,
            abi: BiddingABI,
            eventName: 'PlayerEliminated',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, biddingAddress, 'Bidding', 'PlayerEliminated'));
            }
          }),
          publicClient.watchContractEvent({
            address: biddingAddress,
            abi: BiddingABI,
            eventName: 'PointsDeducted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, biddingAddress, 'Bidding', 'PointsDeducted'));
            }
          }),
          publicClient.watchContractEvent({
            address: biddingAddress,
            abi: BiddingABI,
            eventName: 'GameCompleted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, biddingAddress, 'Bidding', 'GameCompleted'));
            }
          })
        ]);

        // Subscribe to Descend events
        const descendUnsubscribes = await Promise.all([
          publicClient.watchContractEvent({
            address: descendAddress,
            abi: DescendABI,
            eventName: 'RoundStarted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, descendAddress, 'Descend', 'RoundStarted'));
            }
          }),
          publicClient.watchContractEvent({
            address: descendAddress,
            abi: DescendABI,
            eventName: 'PlayerCommitted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, descendAddress, 'Descend', 'PlayerCommitted'));
            }
          }),
          publicClient.watchContractEvent({
            address: descendAddress,
            abi: DescendABI,
            eventName: 'PlayerRevealed',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, descendAddress, 'Descend', 'PlayerRevealed'));
            }
          }),
          publicClient.watchContractEvent({
            address: descendAddress,
            abi: DescendABI,
            eventName: 'PlayerEliminated',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, descendAddress, 'Descend', 'PlayerEliminated'));
            }
          }),
          publicClient.watchContractEvent({
            address: descendAddress,
            abi: DescendABI,
            eventName: 'PlayerMoved',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, descendAddress, 'Descend', 'PlayerMoved'));
            }
          }),
          publicClient.watchContractEvent({
            address: descendAddress,
            abi: DescendABI,
            eventName: 'LevelElimination',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, descendAddress, 'Descend', 'LevelElimination'));
            }
          }),
          publicClient.watchContractEvent({
            address: descendAddress,
            abi: DescendABI,
            eventName: 'GameCompleted',
            onLogs: (logs) => {
              logs.forEach(log => processLog(log, descendAddress, 'Descend', 'GameCompleted'));
            }
          })
        ]);

        // Store unsubscribe functions
        unsubscribeRef.current = [...gameMasterUnsubscribes, ...doorsUnsubscribes, ...threesUnsubscribes, ...biddingUnsubscribes, ...descendUnsubscribes];
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

// Add this function before the ContractEventsProvider
export function createEventHandler(
  contract: ContractName,
  config: EventHandlerConfig
) {
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (event: ContractEvent) => {
    const { gameId, address, onNotification, refetchGameInfo, refetchPlayerInfo, 
            setCurrentRound, setRoundEndTime, setTxStatus, setErrorMessage, router, setCurrentPhase } = config;

    // Log event details
    console.log(`${contract} game handling event: ${event.type.contract}.${event.type.event}`, {
      eventData: event.data,
      nestedArgs: event.data?.args?.args,
      gameId: event.data?.args?.args?.gameId?.toString(),
      currentGameId: gameId?.toString()
    });

    // Check if event belongs to current game
    const eventGameId = event.data?.args?.args?.gameId;
    if (eventGameId && gameId && BigInt(eventGameId.toString()) !== gameId) {
      console.log('Event is for a different game, ignoring');
      return;
    }

    // Common event handling
    const handleCommonEvent = () => {
      refetchGameInfo?.();
      refetchPlayerInfo?.();
    };

    // Handle player-specific events
    const handlePlayerEvent = (player: string, success?: boolean) => {
      const formattedPlayer = formatAddress(player);
      const isCurrentPlayer = player.toLowerCase() === address?.toLowerCase();

      if (isCurrentPlayer && setTxStatus) {
        setTxStatus(success ? 'success' : 'error');
        if (!success && setErrorMessage) {
          setErrorMessage('Action failed!');
        }
      }

      return { formattedPlayer, isCurrentPlayer };
    };

    // Event-specific handlers
    const handlers: Record<string, () => void> = {
      RoundStarted: () => {
        const { roundNumber, phase, endTime } = event.data?.args?.args || {};
        if (roundNumber && endTime) {
          setCurrentRound?.(BigInt(roundNumber.toString()));
          setRoundEndTime?.(Number(endTime));
          if (phase !== undefined) {
            setCurrentPhase?.(Number(phase));
          }
          handleCommonEvent();
          
          onNotification?.({
            title: 'Round Started',
            description: `Round ${roundNumber.toString()} has started! ${phase === 1 ? '(Commit Phase)' : '(Reveal Phase)'}`,
            color: 'primary',
            timeout: 1000,
          });
        }
      },

      PlayerCommitted: () => {
        const player = event.data?.args?.args?.player;
        if (player) {
          handleCommonEvent();
          const { formattedPlayer } = handlePlayerEvent(player);
          
          onNotification?.({
            title: 'Player Committed',
            description: `${formattedPlayer} has committed their choice!`,
            color: 'primary',
            timeout: 1000,
          });
        }
      },

      PlayerRevealed: () => {
        const { player, choice } = event.data?.args?.args || {};
        if (player) {
          handleCommonEvent();
          const { formattedPlayer } = handlePlayerEvent(player);
          
          onNotification?.({
            title: 'Player Revealed',
            description: `${formattedPlayer} revealed their choice${choice ? ` (${choice})` : ''}!`,
            color: 'primary',
            timeout: 1000,
          });
        }
      },

      DoorOpened: () => {
        const { player, success } = event.data?.args?.args || {};
        if (player) {
          handleCommonEvent();
          const { formattedPlayer } = handlePlayerEvent(player, success);
          
          onNotification?.({
            title: 'Door Opened',
            description: success ? 
              `${formattedPlayer} opened a door and survived!` :
              `${formattedPlayer} opened a door and was ELIMINATED!`,
            color: success ? 'success' : 'danger',
            timeout: 1000,
          });
        }
      },

      PlayerEliminated: () => {
        const player = event.data?.args?.args?.player;
        if (player) {
          handleCommonEvent();
          const { formattedPlayer, isCurrentPlayer } = handlePlayerEvent(player);
          
          onNotification?.({
            title: isCurrentPlayer ? 'You were eliminated!' : 'Player Eliminated',
            description: isCurrentPlayer ? 
              'You have been eliminated from the game!' :
              `${formattedPlayer} has been eliminated!`,
            color: 'danger',
            timeout: 1000,
          });
          
          if (isCurrentPlayer && router) {
            setTimeout(() => router.push('/gameover'), 2000);
          }
        }
      },

      RoundEnded: () => {
        handleCommonEvent();
        onNotification?.({
          title: 'Round Ended',
          description: 'Round ended. A new round will begin shortly...',
          color: 'primary',
          timeout: 1000,
        });
      },

      GameCompleted: () => {
        handleCommonEvent();
        onNotification?.({
          title: 'Game Completed',
          description: 'Game completed! Thanks for playing.',
          color: 'success',
          timeout: 1000,
        });
      }
    };

    // Execute the appropriate handler
    const handler = handlers[event.type.event];
    if (handler) {
      handler();
    }
  };
} 