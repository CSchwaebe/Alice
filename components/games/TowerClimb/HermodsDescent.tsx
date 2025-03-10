"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import TowerLevels from './HelheimLevels';
import { TowerClimbABI } from '@/app/abis/TowerClimbABI';

// ===== Configuration Constants =====
const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';  // Replace with actual contract
const MAX_LEVEL = 21;                                      // Maximum level in game
const GAME_STATES = [
  'Uninitialized', 'Initialization', 'ReadyForRound', 
  'Submission', 'Processing', 'Ended'
];

/**
 * HermodsDescent - Main web3-connected component for Tower Climb game
 * Connects to smart contract for gameplay and state management
 */
export default function HermodsDescent() {
  // ===== Web3 Hooks =====
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // ===== Component State =====
  const [selectedMove, setSelectedMove] = useState<number | null>(null);
  const [gameState, setGameState] = useState<string>('Uninitialized');
  const [levelCounts, setLevelCounts] = useState<number[]>(new Array(MAX_LEVEL + 1).fill(0));

  // ===== Contract Data Fetching =====
  // Get current game state
  const { data: gameStateData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TowerClimbABI,
    functionName: 'gameState',
  });

  // Get player's current level
  const { data: currentLevel } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TowerClimbABI,
    functionName: 'getCurrentLevel',
    args: [address],
  });

  // Get all active players
  const { data: activePlayers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TowerClimbABI,
    functionName: 'getActivePlayers',
  });

  /**
   * Update local state based on contract data
   */
  useEffect(() => {
    // Update game state from contract
    if (gameStateData !== undefined) {
      setGameState(GAME_STATES[Number(gameStateData)]);
    }
    
    // Update level counts by fetching all player positions
    if (activePlayers && address) {
      const counts = new Array(MAX_LEVEL + 1).fill(0);
      const provider = ethers.getDefaultProvider();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TowerClimbABI, provider);
      
      // Create batch request to get each player's level
      Promise.all(
        (activePlayers as string[]).map(player => contract.getCurrentLevel(player))
      ).then(levels => {
        // Count players at each level
        levels.forEach((level: number) => {
          if (level <= MAX_LEVEL) counts[level]++;
        });
        setLevelCounts(counts);
      });
    }
  }, [gameStateData, activePlayers, address]);

  /**
   * Submit player's move to the contract
   */
  const handleSubmitMove = () => {
    // Validate input
    if (selectedMove === null || !address) {
      alert('Please connect your wallet and select a move.');
      return;
    }
    
    // Submit move to contract
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: TowerClimbABI,
      functionName: 'submitMove',
      args: [selectedMove],
    });
  };

  // ===== Main Component Render =====
  return (
    <div>
      <TowerLevels 
        levelCounts={levelCounts} 
        currentLevel={currentLevel ? Number(currentLevel) : undefined} 
        gameState={gameState}
        onMoveSelect={setSelectedMove}
        maxLevel={MAX_LEVEL}
        unlimitedLevels={[0, MAX_LEVEL]}
      />
    </div>
  );
} 