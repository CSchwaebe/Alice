import { NextResponse } from 'next/server';
import { keccak256, encodePacked } from 'viem';
import { generateSaltForGameRound } from '@/lib/salt-manager';

// Route handler for POST /api/bidding/commitment
export async function POST(request: Request) {
  try {
    const { bidAmount, playerAddress, gameId, round } = await request.json();

    // Validate inputs
    if (typeof bidAmount !== 'number' || bidAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid bid amount: must be a positive number' },
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
    const formattedSalt = generateSaltForGameRound('bidding', gameId, round) as `0x${string}`;

    // Generate commitment
    const encodedData = encodePacked(
      ['uint256', 'bytes32', 'address'],
      [BigInt(bidAmount), formattedSalt, playerAddress as `0x${string}`]
    );

    const commitment = keccak256(encodedData);

    return NextResponse.json({ commitment });
  } catch (error) {
    console.error('Error creating bid commitment:', error);
    return NextResponse.json(
      { error: 'Failed to create bid commitment' },
      { status: 500 }
    );
  }
} 