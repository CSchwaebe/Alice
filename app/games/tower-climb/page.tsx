"use client";

import DemoWrapper from '@/components/games/TowerClimb/DemoWrapper';
import GameChat from '@/components/chat/GameChat';

export default function TowerClimbPage() {
  // This would ideally be fetched from your game state or contract
  const gameInstanceId = "tower-climb-instance-1";
  
  return (
    <div className="p-4">
      <DemoWrapper />
      <GameChat gameId={gameInstanceId} gameName="Tower Climb" />
    </div>
  );
} 