import { NextResponse } from 'next/server';
import { keccak256, encodePacked, stringToHex } from 'viem';
import { formatAsBytes32 } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { move, playerAddress } = await request.json();
    
    // Validate input
    if (typeof move !== 'number' || move < 0 || move > 5) {
      console.log('Invalid move:', move);
      return NextResponse.json(
        { error: 'Invalid move. Must be between 0 and 5.' },
        { status: 400 }
      );
    }

    if (!playerAddress || typeof playerAddress !== 'string' || !playerAddress.startsWith('0x')) {
      return NextResponse.json(
        { error: 'Invalid player address' },
        { status: 400 }
      );
    }

    // Get salt from environment variable
    const salt = process.env.SUPER_SECRET_SALT;
    if (!salt) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Generate commitment
    const saltHex = stringToHex(salt);
    const formattedSalt = formatAsBytes32(saltHex);
    const encodedData = encodePacked(
      ['uint256', 'bytes32', 'address'],
      [BigInt(move), formattedSalt, playerAddress as `0x${string}`]
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