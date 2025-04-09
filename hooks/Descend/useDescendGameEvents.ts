import { useContractEventSubscription, ContractEventType, createEventHandler } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

interface UseDescendGameEventsProps {
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
  timeout?: number;
}

export function useDescendGameEvents({
  gameId,
  address,
  refetchGameInfo,
  refetchPlayerInfo,
  setCurrentRound,
  setRoundEndTime,
  onNotification
}: UseDescendGameEventsProps) {
  const router = useRouter();

  // Define events to subscribe to based on DescendABI
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'Descend', event: 'RoundStarted' },
    { contract: 'Descend', event: 'PlayerCommitted' },
    { contract: 'Descend', event: 'PlayerRevealed' },
    { contract: 'Descend', event: 'PlayerEliminated' },
    { contract: 'Descend', event: 'PlayerMoved' },
    { contract: 'Descend', event: 'LevelElimination' },
    { contract: 'Descend', event: 'GameCompleted' }
  ];

  // Create event handler using the factory
  const handleContractEvent = createEventHandler('Descend', {
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
      
      // Additional event handling specific to Descend
      if (event.type.event === 'PlayerMoved') {
        const { player, fromLevel, toLevel } = event.data?.args?.args || {};
        if (player && player.toLowerCase() === address?.toLowerCase()) {
          onNotification?.({
            title: 'Level Change',
            description: `You moved from level ${Number(fromLevel)} to level ${Number(toLevel)}`,
            color: 'primary',
            timeout: 3000,
          });
        }
        refetchGameInfo();
        refetchPlayerInfo();
      } else if (event.type.event === 'LevelElimination') {
        const { level, playerCount } = event.data?.args?.args || {};
        onNotification?.({
          title: 'Level Elimination',
          description: `Level ${Number(level)} eliminated ${Number(playerCount)} players`,
          color: 'danger',
          timeout: 3000,
        });
        refetchGameInfo();
        refetchPlayerInfo();
      }
    },
    [gameId, address, refetchGameInfo, refetchPlayerInfo, onNotification, router]
  );
} 