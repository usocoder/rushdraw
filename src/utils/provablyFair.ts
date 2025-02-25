
import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import { CaseItem } from '@/types/case';

export const generateClientSeed = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const calculateRoll = (serverSeed: string, clientSeed: string, nonce: number): number => {
  // Combine seeds and nonce
  const combinedSeed = `${serverSeed}-${clientSeed}-${nonce}`;
  const hash = SHA256(combinedSeed).toString(Hex);
  
  // Use first 8 characters of hash to generate a number between 0 and 1
  const roll = parseInt(hash.slice(0, 8), 16) / 0xffffffff;
  console.log('Calculated roll:', roll);
  return roll;
};

export const getItemFromRoll = (roll: number, items: CaseItem[]): CaseItem => {
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.odds;
    if (roll <= cumulative) {
      return item;
    }
  }
  return items[0];
};

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
  // Base rotations (4-6 full rotations)
  const baseRotations = 4;
  const extraRotations = roll * 2; // 0-2 extra rotations based on roll
  const totalRotations = baseRotations + extraRotations;
  
  // Calculate the total distance needed to scroll
  const totalWidth = itemWidth * totalItems;
  const baseOffset = -(winningItemIndex * itemWidth) + ((visibleItems * itemWidth) / 2) - (itemWidth / 2);
  const rotationOffset = totalWidth * totalRotations;
  
  // Final position calculation
  const finalOffset = -(rotationOffset + Math.abs(baseOffset));
  
  return {
    finalOffset,
    rotations: totalRotations
  };
};
