import { useContractEventSubscription, ContractEventType, createEventHandler } from '@/lib/contract-events';
import { useRouter } from 'next/navigation';

interface UseDescendGameEventsProps {
  gameId: bigint | null;
  address: `0x${string}` | undefined;
  refetchGameInfo: () => void;
  refetchPlayerInfo: () => void;
  setCurrentRound: (round: bigint) => void;
  setRoundEndTime: (time: number) => void;
  setCurrentPhase: (phase: number) => void;
  setLevelPopulations: (populations: Record<number, number>) => void;
  setLevelCapacities: (capacities: Record<number, number>) => void;
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
  setCurrentPhase,
  setLevelPopulations,
  setLevelCapacities,
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
    setCurrentPhase,
    // Only pass notifications for specific events
    onNotification: notification => {
      // Get the event type from the notification title
      const eventType = (() => {
        if (notification.title === 'Round Started') return 'RoundStarted';
        if (notification.title === 'Game Completed') return 'GameCompleted';
        if (notification.title === 'Level Elimination') return 'LevelElimination';
        return 'Other';
      })();

      // Only show notifications for specific events
      if (['RoundStarted', 'GameCompleted', 'LevelElimination'].includes(eventType)) {
        onNotification?.(notification);
      }
    },
    router
  });

  // Subscribe to events
  useContractEventSubscription(
    eventsToSubscribe,
    (event) => {
      handleContractEvent(event);
      
      // Additional event handling specific to Descend
      if (event.type.event === 'RoundStarted') {
        const { roundNumber, phase, endTime, levelPopulations, levelCapacities } = event.data?.args?.args || {};
        
        console.log('RoundStarted raw event data:', event.data?.args?.args);
        console.log('Extracted levelPopulations:', levelPopulations);
        console.log('Extracted levelCapacities:', levelCapacities);
        
        // Ensure we have valid data before processing
        if (!event.data?.args?.args) {
          console.error('Missing event args data');
          return;
        }
        
        // Process populations first
        if (levelPopulations && Array.isArray(levelPopulations)) {
          try {
            const newPopulations: Record<number, number> = {};
            levelPopulations.forEach((population, level) => {
              newPopulations[level] = Number(population);
            });
            console.log('Setting new populations:', newPopulations);
            setLevelPopulations(newPopulations);
          } catch (error) {
            console.error('Error processing level populations:', error);
          }
        } else {
          console.warn('Invalid or missing levelPopulations data');
        }
        
        // Process capacities next
        if (levelCapacities && Array.isArray(levelCapacities)) {
          try {
            const newCapacities: Record<number, number> = {};
            levelCapacities.forEach((capacity, level) => {
              newCapacities[level] = Number(capacity);
            });
            console.log('Setting new capacities:', newCapacities);
            setLevelCapacities(newCapacities);
          } catch (error) {
            console.error('Error processing level capacities:', error);
          }
        } else {
          console.warn('Invalid or missing levelCapacities data');
        }
        
        // Process other event data
        if (phase !== undefined) {
          setCurrentPhase(Number(phase));
        }
        if (roundNumber !== undefined) {
          setCurrentRound(roundNumber);
        }
        if (endTime !== undefined) {
          setRoundEndTime(Number(endTime));
        }
        
        refetchGameInfo();
        refetchPlayerInfo();
      } else if (event.type.event === 'PlayerMoved') {
        refetchGameInfo();
        refetchPlayerInfo();
      } else if (event.type.event === 'PlayerEliminated') {
        const eventArgs = event.data?.args?.args;
        if (!eventArgs) {
          console.error('Missing event args data for PlayerEliminated');
          return;
        }
        
        const { level, playerCount } = eventArgs;
        if (level === undefined || playerCount === undefined) {
          console.error('Invalid level or playerCount data:', { level, playerCount });
          return;
        }

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
    [gameId, address, refetchGameInfo, refetchPlayerInfo, onNotification, router, setLevelPopulations, setLevelCapacities]
  );
} 