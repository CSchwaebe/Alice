import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string
 * Merges Tailwind CSS classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a string as a bytes32 value for Ethereum contract calls
 * @param value - The value to convert to bytes32 format
 * @returns A properly formatted bytes32 value (0x + 64 hex characters)
 */
export function formatAsBytes32(value: string): `0x${string}` {
  let hex = value;
  
  // If it doesn't start with 0x, add it
  if (!hex.startsWith('0x')) {
    hex = `0x${hex}`;
  }
  
  // Remove 0x for manipulation, will add back at the end
  hex = hex.slice(2);
  
  // Pad or truncate to 64 characters (32 bytes)
  if (hex.length < 64) {
    // If shorter than 64 chars, pad with zeros
    hex = hex.padEnd(64, '0');
  } else if (hex.length > 64) {
    // If longer than 64 chars, truncate
    hex = hex.slice(0, 64);
  }
  
  // Ensure all characters are valid hex
  hex = hex.replace(/[^0-9a-f]/gi, '0');
  
  // Return with 0x prefix
  return `0x${hex}` as `0x${string}`;
} 