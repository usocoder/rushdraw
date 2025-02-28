
import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import { CaseItem } from '@/types/case';

// Generate a cryptographically secure random client seed
export const generateClientSeed = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Calculate a roll between 0 and 1 based on seeds and nonce
export const calculateRoll = (serverSeed: string, clientSeed: string, nonce: number): number => {
  // Combine seeds and nonce for hash input
  const combinedSeed = `${serverSeed}-${clientSeed}-${nonce}`;
  const hash = SHA256(combinedSeed).toString(Hex);
  
  // Use first 8 characters of hash (32 bits) to generate a decimal between 0 and 1
  const roll = parseInt(hash.slice(0, 8), 16) / 0xffffffff;
  console.log('Calculated provably fair roll:', roll);
  return roll;
};

// Select an item from the available items based on the roll value
export const getItemFromRoll = (roll: number, items: CaseItem[]): CaseItem => {
  if (!items || items.length === 0) {
    throw new Error('No items available to select from');
  }
  
  // Sort items by rarity (optional, for more predictable results)
  const sortedItems = [...items].sort((a, b) => (a.odds || 0) - (b.odds || 0));
  
  // Use the roll to select an item based on cumulative probabilities
  let cumulative = 0;
  for (const item of sortedItems) {
    cumulative += (item.odds || 0);
    if (roll <= cumulative) {
      return item;
    }
  }
  
  // Fallback to last item if we somehow exceed cumulative probability
  return sortedItems[sortedItems.length - 1];
};

// Calculate the spinner position based on the roll and selected item
export const calculateSpinPosition = (
  roll: number, 
  itemWidth: number,
  visibleItems: number,
  totalItems: number,
  winningItemIndex: number
): { 
  finalOffset: number;
  rotations: number;
} => {
  // Calculate base rotations (between 4-6 full rotations)
  const baseRotations = 4;
  const extraRotations = roll * 2; // 0-2 extra rotations based on roll value
  const totalRotations = baseRotations + extraRotations;
  
  // Calculate the total spinner width
  const totalWidth = itemWidth * totalItems;
  
  // Calculate the base offset to center the winning item
  const baseOffset = -(winningItemIndex * itemWidth) + ((visibleItems * itemWidth) / 2) - (itemWidth / 2);
  
  // Calculate the rotation offset
  const rotationOffset = totalWidth * totalRotations;
  
  // Calculate the final position
  const finalOffset = -(rotationOffset + Math.abs(baseOffset));
  
  return {
    finalOffset,
    rotations: totalRotations
  };
};

// For verification, generate the same roll from given parameters
export const verifyRoll = (serverSeed: string, clientSeed: string, nonce: number): number => {
  return calculateRoll(serverSeed, clientSeed, nonce);
};
