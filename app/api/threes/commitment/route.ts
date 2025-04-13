import { NextResponse } from 'next/server';
import { keccak256, encodePacked } from 'viem';
import { generateSaltForGameRound } from '@/lib/salt-manager';

export async function POST(request: Request) {
  try {
    const { choice, playerAddress, gameId, round } = await request.json();
    
    // Validate input
    if (typeof choice !== 'number' || choice < 1 || choice > 3) {
      return NextResponse.json(
        { error: 'Invalid choice. Must be between 1 and 3.' },
        { status: 400 }
      );
    }

    if (!playerAddress || typeof playerAddress !== 'string' || !playerAddress.startsWith('0x')) {
      return NextResponse.json(
        { error: 'Invalid player address' },
        { status: 400 }
      );
    }

    if (!gameId || !round) {
      return NextResponse.json(
        { error: 'Missing gameId or round parameter' },
        { status: 400 }
      );
    }

    // Generate salt for this specific game round
    const formattedSalt = generateSaltForGameRound('threes', gameId, round) as `0x${string}`;

    // Generate commitment
    const encodedData = encodePacked(
      ['uint256', 'bytes32', 'address'],
      [BigInt(choice), formattedSalt, playerAddress as `0x${string}`]
    );

    const commitment = keccak256(encodedData);

    return NextResponse.json({ commitment });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate commitment' },
      { status: 500 }
    );
  }
} 