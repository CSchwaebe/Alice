import { NextResponse } from 'next/server';
import { generateSaltForGameRound } from '@/lib/salt-manager';

export async function GET(request: Request) {
  try {
    // Get parameters from URL
    const url = new URL(request.url);
    const gameType = url.searchParams.get('gameType');
    const gameId = url.searchParams.get('gameId');
    const round = url.searchParams.get('round');

    // Validate parameters
    if (!gameType || !gameId || !round) {
      return NextResponse.json(
        { error: 'Missing required parameters: gameType, gameId, or round' },
        { status: 400 }
      );
    }

    // Generate salt for this specific game round
    const formattedSalt = generateSaltForGameRound(gameType, gameId, round);

    return NextResponse.json({ formattedSalt });
  } catch (error) {
    console.error('Error retrieving salt:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve salt' },
      { status: 500 }
    );
  }
} 