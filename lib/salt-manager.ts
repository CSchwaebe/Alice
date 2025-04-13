import { keccak256, stringToHex } from 'viem';
import { formatAsBytes32 } from './utils';

// Cache for storing salts
const saltCache = new Map<string, string>();

/**
 * Generates a deterministic salt for a specific game round
 * @param gameName The name of the game (e.g., 'descend', 'threes', 'bidding')
 * @param gameId The ID of the game instance
 * @param round The round number
 * @returns A bytes32 formatted salt
 */
export function generateSaltForGameRound(gameName: string, gameId: string | number, round: string | number): string {
  const key = `${gameName}_${gameId}_${round}`;
  
  // Check if we already have a salt for this game round
  if (saltCache.has(key)) {
    return saltCache.get(key)!;
  }

  // Get the master salt from environment
  const masterSalt = process.env.SUPER_SECRET_SALT;
  if (!masterSalt) {
    throw new Error('Server configuration error: Missing master salt');
  }

  // Generate a unique salt for this game round by hashing the master salt with the game info
  const uniqueSalt = keccak256(
    stringToHex(`${masterSalt}:${key}`)
  );

  // Format the salt as bytes32
  const formattedSalt = formatAsBytes32(uniqueSalt);
  
  // Cache the salt
  saltCache.set(key, formattedSalt);
  
  return formattedSalt;
}

/**
 * Clears the salt cache for testing or memory management
 */
export function clearSaltCache() {
  saltCache.clear();
} 