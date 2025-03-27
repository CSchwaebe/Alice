import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { RagnarokGameMasterABI } from '@/app/abis/RagnarokGameMasterABI';

export const dynamic = 'force-dynamic'; // Always run on server

export async function GET(request: Request) {
  try {
    // Get player address from query string
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    if (!address) {
      return NextResponse.json({
        success: false,
        error: 'Missing player address'
      }, { status: 400 });
    }
    
    // Connect to provider
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
    
    // Initialize contract
    const gameMasterContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDR_GAMEMASTER as string,
      RagnarokGameMasterABI,
      provider
    );
    
    // Get player number
    const playerNumber = await gameMasterContract.playerNumbers(address);
    
    return NextResponse.json({
      success: true,
      playerNumber: playerNumber.toString()
    });
    
  } catch (error: any) {
    console.error('Error getting player number:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get player number',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
} 