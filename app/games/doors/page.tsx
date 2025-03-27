"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import CyberscapeBackground from '@/components/effects/CyberscapeBackground';
import RouteGuard from '@/components/auth/RouteGuard';
import GameChat from '@/components/chat/GameChat';
import './styles.css';

// Import custom hooks
import { useDoorsGameData } from '@/hooks/useDoorsGameData';
import { useDoorsGameEvents } from '@/hooks/useDoorsGameEvents';
import { useDoorsGameTransactions } from '@/hooks/useDoorsGameTransactions';
import { useGameRouteGuard } from '@/hooks/useGameRouteGuard';

// Import components
import GameContent from '@/components/games/Doors/GameContent';
import PlayerList from '@/components/games/Doors/PlayerList';
import TransactionStatus from '@/components/games/Doors/TransactionStatus';
import LoadingScreen from '@/components/games/Doors/LoadingScreen';
import DoorsGameInfo from '@/components/games/Doors/DoorsGameInfo';
import GameNotification from '@/components/games/Doors/GameNotification';

// Game completion screen component
function GameCompletionScreen({ playerList, router }: { 
  playerList: any[], 
  router: any 
}) {
  // Sort players by number for consistent display
  const sortedPlayers = [...playerList].sort((a, b) => a.playerNumber - b.playerNumber);

  return (
    <div className="w-full max-w-4xl mx-auto relative px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-20 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute w-full h-full bg-grid-pattern opacity-10"></div>
      </div>

      {/* Title */}
      <div className="relative text-center mb-12 pt-8 pb-4 border-b border-white/10">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
          GAME COMPLETE
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto my-4"></div>
        <p className="text-white/70 text-lg font-mono">
          <span className="text-white/90">[</span> System Alert: Door Protocol Terminated <span className="text-white/90">]</span>
        </p>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
        {sortedPlayers.map((player, index) => (
          <div 
            key={index}
            className={`relative overflow-hidden backdrop-blur-sm bg-black/80 border ${
              player.isActive 
                ? 'border-green-500/30' 
                : 'border-red-500/30'
            } p-4 rounded-lg transform transition-all duration-300 hover:scale-105`}
          >
            {/* Accent Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              player.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            
            {/* Corner Decoration */}
            <div className="absolute top-0 right-0 w-8 h-8">
              <div className={`w-full h-full ${
                player.isActive 
                  ? 'bg-gradient-to-br from-green-500/20 to-transparent' 
                  : 'bg-gradient-to-br from-red-500/20 to-transparent'
              }`}></div>
            </div>
            
            <div className="flex flex-col items-center relative">
              {/* Player Number */}
              <div className="text-2xl font-bold mb-2 text-white">#{player.playerNumber}</div>
              
              {/* Status Text */}
              <div className={`text-sm font-mono ${
                player.isActive ? 'text-green-400' : 'text-red-400'
              }`}>
                {player.isActive ? 'SURVIVOR' : 'ELIMINATED'}
              </div>
              
              {/* Status Indicator */}
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  player.isActive 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-red-500'
                }`}></div>
                <div className={`h-px w-12 ${
                  player.isActive 
                    ? 'bg-gradient-to-r from-green-500/50 to-transparent' 
                    : 'bg-gradient-to-r from-red-500/50 to-transparent'
                }`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Return Button */}
      <div className="text-center mb-8 relative">
        <button 
          onClick={() => router.push('/lobby')}
          className="group relative overflow-hidden cyberpunk-button px-10 py-4 bg-black/60
                    border border-white/30 text-white hover:text-white/90
                    transition-all duration-300 font-mono uppercase tracking-wider"
        >
          <span className="relative z-10">Return to Digital Nexus</span>
          <span className="absolute inset-0 bg-white/10
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 transform -translate-y-1/2 -left-2 h-px w-16 bg-gradient-to-r from-white/30 to-transparent"></div>
        <div className="absolute top-1/2 transform -translate-y-1/2 -right-2 h-px w-16 bg-gradient-to-l from-white/30 to-transparent"></div>
      </div>
      
      {/* System Message */}
      <div className="font-mono text-center text-xs text-white/50 mb-4">
        System deactivated // Game protocol closed // Return to base
      </div>
    </div>
  );
}

export default function DoorsGamePage() {
  return (
    <RouteGuard>
      <DoorsGame />
    </RouteGuard>
  );
}

function DoorsGame() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  // Fetch game data
  const {
    gameId,
    playerInfo,
    playerList,
    isLoading,
    roundEndTime,
    gameState,
    currentRound,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime
  } = useDoorsGameData({ address, isConnected });
  
  // Handle transactions
  const {
    handleDoorSelect,
    txStatus,
    errorMessage,
    isPending,
    isWaitingTx,
    setTxStatus,
    setErrorMessage
  } = useDoorsGameTransactions(gameId, refetchPlayerInfo, refetchGameInfo);
  
  // Subscribe to game events and get notifications
  const { notification } = useDoorsGameEvents({
    gameId,
    address,
    refetchGameInfo,
    refetchPlayerInfo,
    setCurrentRound,
    setRoundEndTime,
    setTxStatus,
    setErrorMessage
  });
  
  // Protect route - redirect if user is not in the correct game
  useGameRouteGuard({
    isConnected,
    playerInfo,
    expectedGameName: 'DOORS'
  });
  
  // Check if player is active in the game
  const isActivePlayer = playerList.some(
    player => 
      player.playerAddress.toLowerCase() === address?.toLowerCase() && 
      player.isActive
  );

  // Show loading screen until data is loaded
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check if game is completed (gameState === 4)
  const isGameCompleted = gameState === 4;

  // Show game completion screen if game is over
  if (isGameCompleted) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
        <CyberscapeBackground />
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <GameCompletionScreen playerList={playerList} router={router} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      <CyberscapeBackground />
      
      {/* Game Notification */}
      <GameNotification 
        message={notification.message} 
        type={notification.type} 
      />
      
      {/* Main content with responsive layout */}
      <div className="relative z-10 w-full p-4 md:flex md:flex-row md:gap-4 max-w-[1440px] mx-auto">
        {/* Game content - takes full width on mobile, shrinks on desktop to make room for chat */}
        <div className="w-full md:flex-1 pb-12 md:pb-0">
          {/* Game content (rules or active game) */}
          <GameContent 
            gameState={gameState}
            roundEndTime={roundEndTime}
            currentRound={currentRound}
            onDoorSelect={handleDoorSelect}
          />

          {/* Player List */}
          <PlayerList 
            playerList={playerList}
            currentPlayerAddress={address}
          />
          
          {/* Debug Info - set showDebug to true to see */}
          <DoorsGameInfo
            address={address}
            playerInfo={playerInfo}
            gameId={gameId}
            playerList={playerList}
            showDebug={false}
          />
        </div>
        
        {/* Game Chat - Only show for active players */}
        {isActivePlayer && gameId && (
          <GameChat 
            gameId={`doors_${gameId.toString()}`}
            gameName="DOORS"
            playerList={playerList}
          />
        )}

        {/* Transaction Status */}
        <TransactionStatus
          isPending={isPending}
          isWaitingTx={isWaitingTx}
          txStatus={txStatus}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
} 