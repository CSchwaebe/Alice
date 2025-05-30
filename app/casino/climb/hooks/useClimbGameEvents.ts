import { useContractEventSubscription, ContractEventType, createEventHandler } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

interface UseClimbGameEventsProps {
  address: `0x${string}` | undefined;
  refetchPlayerGame: () => void;
  refetchLevelData: () => void;
  refetchPlayerStats: () => void;
  refetchCanClimb: () => void;
  refetchCanCashOut: () => void;
  refetchAll: () => void;
  onNotification?: (notification: GameNotification) => void;
}

export interface GameNotification {
  title: string;
  description: string;
  color: 'primary' | 'success' | 'danger';
  timeout?: number;
}

export function useClimbGameEvents({
  address,
  refetchPlayerGame,
  refetchLevelData,
  refetchPlayerStats,
  refetchCanClimb,
  refetchCanCashOut,
  refetchAll,
  onNotification
}: UseClimbGameEventsProps) {
  const router = useRouter();

  // Define events to subscribe to
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'Climb', event: 'GameStarted' },
    { contract: 'Climb', event: 'ClimbResult' },
    { contract: 'Climb', event: 'PlayerCashedOut' },
    { contract: 'Climb', event: 'GameEnded' },
    { contract: 'Climb', event: 'EntropyReceived' },
    { contract: 'Climb', event: 'RequestAttempted' }
  ];

  // Create event handler using the factory
  const handleContractEvent = createEventHandler('Climb', {
    address,
    refetchPlayerGame,
    refetchLevelData,
    refetchPlayerStats,
    refetchCanClimb,
    refetchCanCashOut,
    onNotification,
    router
  });

  // Subscribe to events
  useContractEventSubscription(
    eventsToSubscribe,
    (event) => {
      // Call the generic handler first
      handleContractEvent(event);
      
      // Additional Climb-specific event handling
      if (event.type.event === 'GameStarted') {
        const { player, depositAmount } = event.data?.args || {};
        if (player?.toLowerCase() === address?.toLowerCase()) {
          onNotification?.({
            title: 'Game Started',
            description: `New climb game started with ${Number(depositAmount)} deposit!`,
            color: 'success',
            timeout: 3000,
          });
        }
        refetchAll();
      } else if (event.type.event === 'ClimbResult') {
        const { player, fromLevel, newLevel, success, gameEnded } = event.data?.args || {};
        if (player?.toLowerCase() === address?.toLowerCase()) {
          if (success) {
            onNotification?.({
              title: 'Climb Success!',
              description: `Successfully climbed from level ${fromLevel} to level ${newLevel}!`,
              color: 'success',
              timeout: 3000,
            });
          } else {
            onNotification?.({
              title: 'Climb Failed',
              description: `Failed to climb from level ${fromLevel}. ${gameEnded ? 'Game ended.' : ''}`,
              color: 'danger',
              timeout: 3000,
            });
          }
        }
        refetchAll();
      } else if (event.type.event === 'PlayerCashedOut') {
        const { player, level, payout, paidInPoints } = event.data?.args || {};
        if (player?.toLowerCase() === address?.toLowerCase()) {
          onNotification?.({
            title: 'Cashed Out!',
            description: `Successfully cashed out at level ${level} for ${Number(payout).toLocaleString()} ${paidInPoints ? 'points' : 'S'}!`,
            color: 'success',
            timeout: 3000,
          });
        }
        refetchAll();
      } else if (event.type.event === 'GameEnded') {
        const { player, finalLevel, success, endReason } = event.data?.args || {};
        if (player?.toLowerCase() === address?.toLowerCase()) {
          onNotification?.({
            title: 'Game Ended',
            description: `Game ended: ${endReason}. Final level: ${finalLevel}`,
            color: success ? 'success' : 'danger',
            timeout: 5000,
          });
        }
        refetchAll();
      }
    },
    [address, refetchAll, onNotification, router]
  );
} 