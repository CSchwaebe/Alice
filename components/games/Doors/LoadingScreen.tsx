export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-neon-300 rounded-full border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-300">Loading game data...</p>
      </div>
    </div>
  );
} 