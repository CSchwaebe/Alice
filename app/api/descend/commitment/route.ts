import { NextResponse } from 'next/server';
import { keccak256, encodePacked } from 'viem';
import { generateSaltForGameRound } from '@/lib/salt-manager';

export async function POST(request: Request) {
  try {
    const { move, playerAddress, gameId, round } = await request.json();
    
    // Validate input
    if (typeof move !== 'number' || move < 0 || move > 5) {
      console.log('Invalid move:', move);
      return NextResponse.json(
        { error: 'Invalid move. Must be between 0 and 5.' },
        { status: 400 }
      );
    }

    // Validate and narrow the type in one step
    if (typeof playerAddress !== 'string' || !/^0x[0-9a-fA-F]{40}$/i.test(playerAddress)) {
      return NextResponse.json(
        { error: 'Invalid player address' },
        { status: 400 }
      );
    }
    const hexAddress = playerAddress as `0x${string}`;

    if (!gameId || !round) {
      return NextResponse.json(
        { error: 'Missing gameId or round parameter' },
        { status: 400 }
      );
    }

    // Generate salt for this specific game round
    const formattedSalt = generateSaltForGameRound('descend', gameId, round) as `0x${string}`;

    // Generate commitment
    const encodedData = encodePacked(
      ['uint256', 'bytes32', 'address'],
      [BigInt(move), formattedSalt, hexAddress]
    );

    const commitment = keccak256(encodedData);

    return NextResponse.json({ commitment });
  } catch (error) {
    console.error('Error creating descend commitment:', error);
    return NextResponse.json(
      { error: 'Failed to create descend commitment' },
      { status: 500 }
    );
  }
} 