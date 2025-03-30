import { NextResponse } from 'next/server';
import { keccak256, encodePacked, stringToHex } from 'viem';
import { formatAsBytes32 } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { choice, playerAddress } = await request.json();
    
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