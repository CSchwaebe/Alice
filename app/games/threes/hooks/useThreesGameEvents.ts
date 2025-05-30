import { useContractEventSubscription, ContractEventType, createEventHandler } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

interface UseThreesGameEventsProps {
  gameId: bigint | null;
  address: `0x${string}` | undefined;
  refetchGameInfo: () => void;
  refetchPlayerInfo: () => void;
  setCurrentRound: (round: bigint) => void;
  setRoundEndTime: (time: number) => void;
  setCurrentPhase: (phase: number) => void;
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
  setCurrentPhase,
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

  // Create event handler using the factory
  const handleContractEvent = createEventHandler('Threes', {
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    setCurrentPhase,
    onNotification,
    router
  });

  // Subscribe to events
  useContractEventSubscription(
    eventsToSubscribe,
    handleContractEvent,
    [gameId, address, refetchGameInfo, refetchPlayerInfo, onNotification, router]
  );
} 