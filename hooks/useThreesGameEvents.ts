import { useEffect } from 'react';
import { useContractEventSubscription, ContractEventType, ContractEvent } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

interface UseThreesGameEventsProps {
  gameId: bigint | null;
  address: `0x${string}` | undefined;
  refetchGameInfo: () => void;
  refetchPlayerInfo: () => void;
  setCurrentRound: (round: bigint) => void;
  setRoundEndTime: (time: number) => void;
  onNotification?: (notification: GameNotification) => void;
}

export interface GameNotification {
  title: string;
  description: string;
  color: 'primary' | 'success' | 'danger';
}

export function useThreesGameEvents({
  gameId,
  address,
  refetchGameInfo,
  refetchPlayerInfo,
  setCurrentRound,
  setRoundEndTime,
  onNotification
}: UseThreesGameEventsProps) {
  const router = useRouter();

  // Define events to subscribe to
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'Threes', event: 'RoundStarted' },
    { contract: 'Threes', event: 'PlayerCommitted' },
    { contract: 'Threes', event: 'PlayerRevealed' },
    { contract: 'Threes', event: 'PlayerEliminated' },
    { contract: 'Threes', event: 'GameCompleted' }
  ];

  // Format player address for display
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle contract events
  const handleContractEvent = (event: ContractEvent) => {
    console.log(`Threes game handling event: ${event.type.contract}.${event.type.event}`, {
      eventData: event.data,
      topics: event.data?.topics,
      gameId: event.data?.args?.gameId?.toString(),
      currentGameId: gameId?.toString()
    });
    
    // Only process events for our current game
    const eventGameId = event.data?.args?.gameId;
    if (eventGameId && gameId && BigInt(eventGameId.toString()) !== gameId) {
      console.log('Event is for a different game, ignoring');
      return;
    }
    
    // Take action based on event type
    switch (event.type.event) {
      case 'RoundStarted':
        const { roundNumber, endTime } = event.data?.args || {};
        
        if (roundNumber && endTime) {
          setCurrentRound(BigInt(roundNumber.toString()));
          setRoundEndTime(Number(endTime));
          refetchGameInfo();
          refetchPlayerInfo();
          
          onNotification?.({
            title: 'Round Started',
            description: `Round ${roundNumber.toString()} has started! ${
              roundNumber.toString() === '1' ? 'Time to commit your choice...' : 'Time to reveal your choice...'
            }`,
            color: 'primary'
          });
        }
        break;
        
      case 'PlayerCommitted':
        // Get player from nested args structure
        const committedPlayer = event.data?.args?.args?.player;
        
        console.log('Processing PlayerCommitted event:', {
          nestedArgs: event.data?.args?.args,
          player: committedPlayer,
          formattedPlayer: committedPlayer ? formatAddress(committedPlayer) : null
        });
        
        refetchGameInfo();
        refetchPlayerInfo();

        if (committedPlayer) {
          const formattedPlayer = formatAddress(committedPlayer);
            
          onNotification?.({
            title: 'Player Committed',
            description: `${formattedPlayer} has committed their choice!`,
            color: 'primary'
          });
        }
        break;
        
      case 'PlayerRevealed':
        // Get player from nested args structure
        const revealedPlayer = event.data?.args?.args?.player;
        const choice = event.data?.args?.args?.choice;
        
        console.log('Processing PlayerRevealed event:', {
          nestedArgs: event.data?.args?.args,
          player: revealedPlayer,
          formattedPlayer: revealedPlayer ? formatAddress(revealedPlayer) : null,
          choice: choice
        });
        
        refetchGameInfo();
        refetchPlayerInfo();

        if (revealedPlayer) {
          const formattedPlayer = formatAddress(revealedPlayer);
          
          onNotification?.({
            title: 'Player Revealed',
            description: `${formattedPlayer} revealed their choice${choice ? ` (${choice})` : ''}!`,
            color: 'primary'
          });
        }
        break;
        
      case 'PlayerEliminated':
        const eliminatedPlayer = event.data?.topics?.[2] ? 
          `0x${event.data.topics[2].slice(-40)}` : undefined;
        const eliminatedPlayerNumber = event.data?.args?.playerNumber;
        
        refetchGameInfo();
        refetchPlayerInfo();

        if (eliminatedPlayer) {
          const formattedPlayer = eliminatedPlayerNumber ? 
            `Player ${eliminatedPlayerNumber.toString()}` : 
            formatAddress(eliminatedPlayer);
          
          const isCurrentPlayer = eliminatedPlayer.toLowerCase() === address?.toLowerCase();
            
          onNotification?.({
            title: isCurrentPlayer ? 'You were eliminated!' : 'Player Eliminated',
            description: isCurrentPlayer ? 
              'You have been eliminated from the game!' :
              `${formattedPlayer} has been eliminated!`,
            color: 'danger'
          });

          // Redirect to gameover page if current player is eliminated
          if (isCurrentPlayer) {
            setTimeout(() => {
              router.push('/gameover');
            }, 2000); // Give time for the toast to be seen
          }
        }
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
    [gameId, address, refetchGameInfo, refetchPlayerInfo] // Dependencies
  );
} 