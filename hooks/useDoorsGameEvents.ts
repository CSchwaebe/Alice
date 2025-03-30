import { useEffect } from 'react';
import { useContractEventSubscription, ContractEventType, ContractEvent } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

export interface GameNotification {
  title: string;
  description: string;
  color: 'primary' | 'success' | 'danger';
}

interface UseDoorsGameEventsProps {
  gameId: bigint | null;
  address: `0x${string}` | undefined;
  refetchGameInfo: () => void;
  refetchPlayerInfo: () => void;
  setCurrentRound: (round: bigint) => void;
  setRoundEndTime: (time: number) => void;
  setTxStatus: (status: 'success' | 'error' | 'none' | 'pending') => void;
  setErrorMessage: (message: string) => void;
  onNotification?: (notification: GameNotification) => void;
}

export function useDoorsGameEvents({
  gameId,
  address,
  refetchGameInfo,
  refetchPlayerInfo,
  setCurrentRound,
  setRoundEndTime,
  setTxStatus,
  setErrorMessage,
  onNotification
}: UseDoorsGameEventsProps) {
  const router = useRouter();

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
    console.log(`Doors game handling event: ${event.type.contract}.${event.type.event}`, {
      eventData: event.data,
      nestedArgs: event.data?.args?.args,
      gameId: event.data?.args?.args?.gameId?.toString(),
      currentGameId: gameId?.toString()
    });
    
    // Only process events for our current game
    const eventGameId = event.data?.args?.args?.gameId;
    if (eventGameId && gameId && BigInt(eventGameId.toString()) !== gameId) {
      console.log('Event is for a different game, ignoring');
      return;
    }
    
    // Take action based on event type
    switch (event.type.event) {
      case 'RoundStarted':
        const { roundNumber, endTime } = event.data?.args?.args || {};
        if (roundNumber && endTime) {
          setCurrentRound(BigInt(roundNumber.toString()));
          setRoundEndTime(Number(endTime));
          refetchGameInfo();
          refetchPlayerInfo();
          
          onNotification?.({
            title: 'Round Started',
            description: `Round ${roundNumber.toString()} has started! Choose a door carefully...`,
            color: 'primary'
          });
        }
        break;
        
      case 'DoorOpened':
        const { player, success } = event.data?.args?.args || {};
        if (player) {
          const formattedPlayer = formatAddress(player.toString());
          
          refetchGameInfo();
          refetchPlayerInfo();
          
          onNotification?.({
            title: 'Door Opened',
            description: success ? 
              `${formattedPlayer} opened a door and survived!` :
              `${formattedPlayer} opened a door and was ELIMINATED!`,
            color: success ? 'success' : 'danger'
          });

          // Additional handling for the current player
          if (address && player.toLowerCase() === address.toLowerCase()) {
            setTxStatus(success ? 'success' : 'error');
            if (!success) {
              setErrorMessage('Door opening failed!');
            }
          }
        }
        break;
        
      case 'PlayerEliminated':
        const eliminatedPlayer = event.data?.args?.args?.player;
        if (eliminatedPlayer) {
          const formattedPlayer = formatAddress(eliminatedPlayer.toString());
          const isCurrentPlayer = eliminatedPlayer.toLowerCase() === address?.toLowerCase();
          
          refetchGameInfo();
          refetchPlayerInfo();
          
          onNotification?.({
            title: isCurrentPlayer ? 'You were eliminated!' : 'Player Eliminated',
            description: isCurrentPlayer ? 
              'You have been eliminated from the game!' :
              `${formattedPlayer} has been eliminated!`,
            color: 'danger'
          });
          
          if (isCurrentPlayer) {
            setTxStatus('error');
            setErrorMessage('You have been eliminated!');
            setTimeout(() => router.push('/gameover'), 2000);
          }
        }
        break;
        
      case 'RoundEnded':
        refetchGameInfo();
        refetchPlayerInfo();
        onNotification?.({
          title: 'Round Ended',
          description: 'Round ended. A new round will begin shortly...',
          color: 'primary'
        });
        break;
        
      case 'GameCompleted':
        refetchGameInfo();
        refetchPlayerInfo();
        onNotification?.({
          title: 'Game Completed',
          description: 'Game completed! Thanks for playing.',
          color: 'success'
        });
        break;
    }
  };

  // Subscribe to events
  useContractEventSubscription(
    eventsToSubscribe,
    handleContractEvent,
    [gameId, address, refetchGameInfo, refetchPlayerInfo, onNotification, router] // Dependencies
  );
} 