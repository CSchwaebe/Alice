"use client";

import DemoWrapper from '@/components/games/TowerClimb/DemoWrapper';

export default function TowerClimbPage() {
  // This would ideally be fetched from your game state or contract
  const gameInstanceId = "tower-climb-instance-1";
  
  return (
    <div className="p-4">
      <DemoWrapper />
    </div>
  );
} 