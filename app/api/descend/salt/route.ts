import { NextResponse } from 'next/server';
import { keccak256, encodePacked, stringToHex } from 'viem';
import { formatAsBytes32 } from '@/lib/utils';

export async function GET() {
  try {
    const salt = process.env.SUPER_SECRET_SALT;
    if (!salt) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    const saltHex = stringToHex(salt);
    const formattedSalt = formatAsBytes32(saltHex);

    return NextResponse.json({ formattedSalt });
  } catch (error) {
    console.error('Error retrieving salt:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve salt' },
      { status: 500 }
    );
  }
} 