import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseGameRouteGuardProps {
  isConnected: boolean;
  playerInfo: [string, bigint, boolean, number, bigint] | undefined;
  expectedGameName: string;
}

export function useGameRouteGuard({ 
  isConnected, 
  playerInfo, 
  expectedGameName 
}: UseGameRouteGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    if (playerInfo?.[0]) {
      const [gameName, gameId, isActive, gameState] = playerInfo;
      if (gameName !== expectedGameName) {
        router.push(`/games/${gameName.toLowerCase()}`);
      }
    } else {
      router.push('/');
    }
  }, [isConnected, playerInfo, router, expectedGameName]);
} 