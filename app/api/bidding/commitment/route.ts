import { NextResponse } from 'next/server';
import { keccak256, encodePacked, stringToHex } from 'viem';
import { formatAsBytes32 } from '@/lib/utils';

// Route handler for POST /api/bidding/commitment
export async function POST(request: Request) {
  try {
    const { bidAmount, playerAddress } = await request.json();

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