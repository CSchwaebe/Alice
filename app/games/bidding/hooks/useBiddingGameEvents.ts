import { useContractEventSubscription, ContractEventType, createEventHandler } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

interface UseBiddingGameEventsProps {
  gameId: bigint | null;
  address: `0x${string}` | undefined;
  refetchGameInfo: () => void;
  refetchPlayerInfo: () => void;
  refetchAll: () => void;
  setCurrentRound: (round: bigint) => void;
  setRoundEndTime: (time: number) => void;
  setCurrentPhase: (phase: number) => void;
  onNotification?: (notification: GameNotification) => void;
}

export interface GameNotification {
  title: string;
  description: string;
  color: 'primary' | 'success' | 'danger';
  timeout?: number;
}

export function useBiddingGameEvents({
  gameId,
  address,
  refetchGameInfo,
  refetchPlayerInfo,
  refetchAll,
  setCurrentRound,
  setRoundEndTime,
  setCurrentPhase,
  onNotification
}: UseBiddingGameEventsProps) {
  const router = useRouter();

  // Define events to subscribe to
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'Bidding', event: 'RoundStarted' },
    { contract: 'Bidding', event: 'PlayerCommitted' },
    { contract: 'Bidding', event: 'PlayerRevealed' },
    { contract: 'Bidding', event: 'PlayerEliminated' },
    { contract: 'Bidding', event: 'PointsDeducted' },
    { contract: 'Bidding', event: 'GameCompleted' }
  ];

  // Create event handler using the factory
  const handleContractEvent = createEventHandler('Bidding', {
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    onNotification,
    router
  });

  // Subscribe to events
  useContractEventSubscription(
    eventsToSubscribe,
    (event) => {
      handleContractEvent(event);
      
      // Additional event handling specific to Bidding
      if (event.type.event === 'RoundStarted') {
        const phase = event.data?.args?.args?.phase;
        if (phase !== undefined) {
          setCurrentPhase(Number(phase));
        }
        refetchAll();
      } else if (event.type.event === 'PointsDeducted') {
        // Handle points deduction event
        const { player, bid, remainingPoints } = event.data?.args?.args || {};
        if (player && player.toLowerCase() === address?.toLowerCase()) {
          onNotification?.({
            title: 'Your Bid',
            description: `Your bid of ${Number(bid).toLocaleString()} has been placed. You have ${Number(remainingPoints).toLocaleString()} points remaining.`,
            color: 'primary',
            timeout: 3000,
          });
        }
        refetchAll();
      }
    },
    [gameId, address, refetchGameInfo, refetchPlayerInfo, refetchAll, onNotification, router]
  );
} 