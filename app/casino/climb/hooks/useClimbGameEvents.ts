import { useContractEventSubscription, ContractEventType, createEventHandler } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';
import { formatEther } from 'viem';

interface UseClimbGameEventsProps {
  address: `0x${string}` | undefined;
  refetchPlayerGame: () => void;
  refetchLevelData: () => void;
  refetchPlayerStats: () => void;
  refetchCanClimb: () => void;
  refetchCanCashOut: () => void;
  refetchAll: () => void;
  clearWaitingState?: () => void;
  showResult?: (resultInfo: {
    type: 'success' | 'bust' | 'cashout';
    level?: number;
    newLevel?: number;
    payout?: string;
    currency?: 'S' | 'ALICE';
    aliceReward?: number;
  }) => void;
}

export function useClimbGameEvents({
  address,
  refetchPlayerGame,
  refetchLevelData,
  refetchPlayerStats,
  refetchCanClimb,
  refetchCanCashOut,
  refetchAll,
  clearWaitingState,
  showResult
}: UseClimbGameEventsProps) {
  const router = useRouter();

  // Define events to subscribe to
  const eventsToSubscribe: ContractEventType[] = [
    { contract: 'Climb', event: 'GameStarted' },
    { contract: 'Climb', event: 'ClimbResult' },
    { contract: 'Climb', event: 'AutoClimbCompleted' },
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
        const eventArgs = event.data?.args?.args || event.data?.args || {};
        const { player } = eventArgs;
        
        if (player?.toLowerCase() === address?.toLowerCase()) {
          // Game started - no notification needed, overlay will handle feedback
        }
        refetchAll();
      } else if (event.type.event === 'ClimbResult') {
        const eventArgs = event.data?.args?.args || event.data?.args || {};
        const { player, fromLevel, newLevel, success } = eventArgs;
        
        if (player?.toLowerCase() === address?.toLowerCase()) {
          if (success) {
            showResult?.({
              type: 'success',
              level: fromLevel,
              newLevel: newLevel
            });
          } else {
            showResult?.({
              type: 'bust',
              level: fromLevel,
              aliceReward: 10
            });
          }
        }
        refetchAll();
      } else if (event.type.event === 'AutoClimbCompleted') {
        const eventArgs = event.data?.args?.args || event.data?.args || {};
        const { player, startLevel, finalLevel, reachedTarget } = eventArgs;
        
        if (player?.toLowerCase() === address?.toLowerCase()) {
          if (reachedTarget) {
            showResult?.({
              type: 'success',
              level: startLevel,
              newLevel: finalLevel
            });
          } else {
            showResult?.({
              type: 'bust',
              level: finalLevel,
              aliceReward: 10
            });
          }
        }
        refetchAll();
      } else if (event.type.event === 'PlayerCashedOut') {
        const eventArgs = event.data?.args?.args || event.data?.args || {};
        const { player, level, payout, paidInPoints } = eventArgs;
        
        if (player?.toLowerCase() === address?.toLowerCase()) {
          // Format payout based on currency type
          const formattedPayout = paidInPoints 
            ? Number(payout).toLocaleString() // ALICE as integer
            : parseFloat(formatEther(BigInt(payout))).toFixed(2); // Sonic as ether with 4 decimals
          
          showResult?.({
            type: 'cashout',
            level: level,
            payout: formattedPayout,
            currency: paidInPoints ? 'ALICE' : 'S'
          });
        }
        refetchAll();
      } else if (event.type.event === 'GameEnded') {
        const eventArgs = event.data?.args?.args || event.data?.args || {};
        const { player } = eventArgs;
        
        if (player?.toLowerCase() === address?.toLowerCase()) {
          // Game ended - no notification needed, overlay will handle feedback
        }
        refetchAll();
      } else {
        refetchAll();
      }
    },
    [address, refetchAll, clearWaitingState, showResult]
  );
} 