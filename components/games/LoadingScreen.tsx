export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
        <p className="text-primary-600 font-mono">Loading game...</p>
      </div>
    </div>
  );
} 