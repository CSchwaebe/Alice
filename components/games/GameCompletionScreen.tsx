import { Silkscreen } from 'next/font/google';
import { useRouter } from 'next/navigation';
import  GlitchTextBackground  from '@/components/effects/GlitchTextBackground';
import { useState } from 'react';

const silkscreen = Silkscreen({ 
  weight: '400',
  subsets: ['latin']
});

const PLAYERS_PER_PAGE = 10;

interface Player {
  playerNumber: string;
  isActive: boolean;
}

interface GameCompletionScreenProps {
  playerList: Player[];
  gameName: string;
}

export function GameCompletionScreen({ playerList, gameName }: GameCompletionScreenProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sort players by number for consistent display
  const sortedPlayers = [...playerList].sort((a, b) => 
    parseInt(a.playerNumber) - parseInt(b.playerNumber)
  );

  // Pagination calculations
  const totalPages = Math.ceil(sortedPlayers.length / PLAYERS_PER_PAGE);
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  const endIndex = startIndex + PLAYERS_PER_PAGE;
  const currentPlayers = sortedPlayers.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Smooth scroll to top of grid
    document.getElementById('player-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative px-4">
      <GlitchTextBackground />
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-96 h-96 bg-primary-100/5 rounded-full blur-3xl -top-20 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-primary-100/5 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Title */}
      <div className="relative text-center mb-12 pt-8 pb-4 border-b border-primary-100/10">
        <h1 className={`text-5xl md:text-7xl font-bold text-foreground mb-2 ${silkscreen.className}`}>
          GAME COMPLETE
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary-100/30 to-transparent mx-auto my-4"></div>
        <p className="text-primary-100/70 text-lg font-mono">
          <span className="text-primary-100/90">[</span> System Alert: {gameName} Protocol Terminated <span className="text-primary-100/90">]</span>
        </p>
      </div>

      {/* Player Grid */}
      <div id="player-grid" className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {currentPlayers.map((player, index) => (
          <div 
            key={startIndex + index}
            className={`relative overflow-hidden backdrop-blur-sm bg-overlay-dark border ${
              player.isActive 
                ? 'border-primary-300/30' 
                : 'border-destructive/30'
            } p-4 rounded-lg transform transition-all duration-300 hover:scale-105`}
          >
            {/* Accent Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              player.isActive ? 'bg-primary-300' : 'bg-destructive'
            }`}></div>
            
            {/* Corner Decoration */}
            <div className="absolute top-0 right-0 w-8 h-8">
              <div className={`w-full h-full ${
                player.isActive 
                  ? 'bg-gradient-to-br from-primary-300/20 to-transparent' 
                  : 'bg-gradient-to-br from-destructive/20 to-transparent'
              }`}></div>
            </div>
            
            <div className="flex flex-col items-left relative">
              {/* Player Number */}
              <div className="text-2xl font-bold mb-2 text-foreground">#{player.playerNumber}</div>
              
              {/* Status Text */}
              <div className={`text-sm font-mono ${
                player.isActive ? 'text-primary-300' : 'text-destructive'
              }`}>
                {player.isActive ? 'SURVIVOR' : 'ELIMINATED'}
              </div>
              
              {/* Status Indicator */}
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  player.isActive 
                    ? 'bg-primary-300 animate-pulse' 
                    : 'bg-destructive'
                }`}></div>
                <div className={`h-px w-12 ${
                  player.isActive 
                    ? 'bg-gradient-to-r from-primary-300/50 to-transparent' 
                    : 'bg-gradient-to-r from-destructive/50 to-transparent'
                }`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls - Only show if more than 10 players */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 font-mono rounded-lg border ${
              currentPage === 1
                ? 'border-primary-100/10 text-primary-100/30 cursor-not-allowed'
                : 'border-primary-100/30 text-primary-100 hover:bg-primary-100/10'
            } transition-colors`}
          >
            Previous
          </button>
          <span className="font-mono text-primary-100">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 font-mono rounded-lg border ${
              currentPage === totalPages
                ? 'border-primary-100/10 text-primary-100/30 cursor-not-allowed'
                : 'border-primary-100/30 text-primary-100 hover:bg-primary-100/10'
            } transition-colors`}
          >
            Next
          </button>
        </div>
      )}

      {/* Return Button */}
      <div className="text-center mb-8 relative">
        <button 
          onClick={() => router.push('/lobby')}
          className="group relative overflow-hidden px-10 py-4 bg-overlay-dark
                    border border-primary-100/30 text-foreground hover:text-primary-100/90
                    transition-all duration-300 font-mono uppercase tracking-wider rounded-lg"
        >
          <span className="relative z-10">Return to Digital Nexus</span>
          <span className="absolute inset-0 bg-primary-100/10
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 transform -translate-y-1/2 -left-2 h-px w-16 bg-gradient-to-r from-primary-100/30 to-transparent"></div>
        <div className="absolute top-1/2 transform -translate-y-1/2 -right-2 h-px w-16 bg-gradient-to-l from-primary-100/30 to-transparent"></div>
      </div>
      
      {/* System Message */}
      <div className="font-mono text-center text-xs text-primary-100/50 mb-4">
        System deactivated // Game protocol closed // Return to base
      </div>
    </div>
  );
} 