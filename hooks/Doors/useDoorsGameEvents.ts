import { useContractEventSubscription, ContractEventType, createEventHandler, GameNotification } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

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

  // Create event handler using the factory
  const handleContractEvent = createEventHandler('Doors', {
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    setTxStatus,
    setErrorMessage,
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