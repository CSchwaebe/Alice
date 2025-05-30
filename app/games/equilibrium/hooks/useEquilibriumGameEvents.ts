import { useContractEventSubscription, ContractEventType, createEventHandler, GameNotification } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

interface UseEquilibriumGameEventsProps {
  gameId: bigint | null;
  address: `0x${string}` | undefined;
  refetchGameInfo: () => void;
  refetchPlayerInfo: () => void;
  setGameEndTime: (time: number) => void;
  setTxStatus: (status: 'success' | 'error' | 'none' | 'pending') => void;
  setErrorMessage: (message: string) => void;
  onNotification?: (notification: GameNotification) => void;
}

export function useEquilibriumGameEvents({
  gameId,
  address,
  refetchGameInfo,
  refetchPlayerInfo,
  setGameEndTime: setRoundEndTime,
  setTxStatus,
  setErrorMessage,
  onNotification
}: UseEquilibriumGameEventsProps) {
  const router = useRouter();

  // Define events to subscribe to
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'Equilibrium', event: 'GameInitialized' },
    { contract: 'Equilibrium', event: 'GameStarted' },
    { contract: 'Equilibrium', event: 'PlayerEliminated' },
    { contract: 'Equilibrium', event: 'PlayerSwitchedTeam' },
    { contract: 'Equilibrium', event: 'TeamEliminated' },
    { contract: 'Equilibrium', event: 'GameCompleted' }
  ];

  // Create event handler using the factory
  const handleContractEvent = createEventHandler('Equilibrium', {
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
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