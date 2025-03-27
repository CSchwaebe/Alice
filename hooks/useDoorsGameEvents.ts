import { useEffect, useState } from 'react';
import { useContractEventSubscription, ContractEventType, ContractEvent } from '@/lib/contract-events';

interface UseDoorsGameEventsProps {
  gameId: bigint | null;
  address: `0x${string}` | undefined;
  refetchGameInfo: () => void;
  refetchPlayerInfo: () => void;
  setCurrentRound: (round: bigint) => void;
  setRoundEndTime: (time: number) => void;
  setTxStatus: (status: 'none' | 'pending' | 'success' | 'error') => void;
  setErrorMessage: (message: string) => void;
}

export interface GameNotification {
  message: string | null;
  type: 'success' | 'danger' | 'info';
}

export function useDoorsGameEvents({
  gameId,
  address,
  refetchGameInfo,
  refetchPlayerInfo,
  setCurrentRound,
  setRoundEndTime,
  setTxStatus,
  setErrorMessage
}: UseDoorsGameEventsProps) {
  const [notification, setNotification] = useState<GameNotification>({ 
    message: null, 
    type: 'info' 
  });

  // Define events to subscribe to
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'Doors', event: 'RoundStarted' },
    { contract: 'Doors', event: 'DoorOpened' },
    { contract: 'Doors', event: 'PlayerEliminated' },
    { contract: 'Doors', event: 'RoundEnded' },
    { contract: 'Doors', event: 'GameCompleted' }
  ];

  // Format player address for display
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle contract events
  const handleContractEvent = (event: ContractEvent) => {
    console.log(`Doors game handling event: ${event.type.contract}.${event.type.event}`, event);
    
    // Only process events for our current game
    const eventGameId = event.data[0]?.args?.gameId;
    if (eventGameId && gameId && BigInt(eventGameId.toString()) !== gameId) {
      console.log('Event is for a different game, ignoring');
      return;
    }
    
    // Take action based on event type
    switch (event.type.event) {
      case 'RoundStarted':
        const { roundNumber, endTime } = event.data[0]?.args || {};
        
        if (roundNumber && endTime) {
          setCurrentRound(BigInt(roundNumber.toString()));
          setRoundEndTime(Number(endTime));
          refetchGameInfo();
          refetchPlayerInfo();
          setNotification({
            message: `Round ${roundNumber.toString()} has started! Choose a door carefully...`,
            type: 'info'
          });
          console.log('Round started:', roundNumber.toString());
        }
        break;
        
      case 'DoorOpened':
        const { player, success, playerNumber } = event.data[0]?.args || {};
        
        refetchPlayerInfo();
        // Show notification for all players
        if (player) {
          const formattedPlayer = playerNumber ? 
            `Player ${playerNumber.toString()}` : 
            formatAddress(player.toString());
            
          if (success) {
            setNotification({
              message: `${formattedPlayer} opened a door and survived!`,
              type: 'success'
            });
          } else {
            setNotification({
              message: `${formattedPlayer} opened a door and was ELIMINATED!`,
              type: 'danger'
            });
          }
        }
        
        // Additional handling for the current player
        if (player && address && player.toLowerCase() === address.toLowerCase()) {
          setTxStatus(success ? 'success' : 'error');
          if (!success) {
            setErrorMessage('Door opening failed!');
          }
          console.log('Door opened by player:', player);
        }
        break;
        
      case 'PlayerEliminated':
        const eliminatedPlayer = event.data[0]?.args?.player;
        const playerNum = event.data[0]?.args?.playerNumber;
        
        refetchPlayerInfo();
        
        // Show notification for all players
        if (eliminatedPlayer) {
          const formattedPlayer = playerNum ? 
            `Player ${playerNum.toString()}` : 
            formatAddress(eliminatedPlayer.toString());
            
          setNotification({
            message: `${formattedPlayer} has been ELIMINATED!`,
            type: 'danger'
          });
        }
        
        // Additional handling for the current player
        if (eliminatedPlayer && address && eliminatedPlayer.toLowerCase() === address.toLowerCase()) {
          setTxStatus('error');
          setErrorMessage('You have been eliminated!');
          console.log('Player eliminated:', eliminatedPlayer);
        }
        break;
        
      case 'RoundEnded':
        refetchGameInfo();
        refetchPlayerInfo();
        setNotification({
          message: `Round ended. A new round will begin shortly...`,
          type: 'info'
        });
        console.log('Round ended');
        break;
        
      case 'GameCompleted':
        refetchGameInfo();
        refetchPlayerInfo();
        setNotification({
          message: `Game completed! Thanks for playing.`,
          type: 'success'
        });
        console.log('Game completed');
        break;
    }
  };

  // Subscribe to events
  useContractEventSubscription(
    eventsToSubscribe,
    handleContractEvent,
    [gameId, address, refetchGameInfo, refetchPlayerInfo] // Dependencies
  );
  
  // Return notification state for UI
  return { notification, setNotification };
} 