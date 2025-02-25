
import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import { CaseItem } from '@/types/case';

export const generateClientSeed = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const calculateRoll = (serverSeed: string, clientSeed: string, nonce: number): number => {
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

// Calculate the position for the spinning animation
export const calculateSpinPosition = (roll: number, totalItems: number): number => {
  // Ensure we do enough rotations for a satisfying spin (between 4-6 full rotations)
  const baseRotations = 4;
  const extraRotations = roll * 2; // Add 0-2 extra rotations based on roll
  const totalRotations = baseRotations + extraRotations;
  
  // Calculate final position
  const finalPosition = (roll * totalItems) | 0; // Integer position in the items array
  
  // Convert to degrees, adding full rotations
  return (totalRotations * 360) + (finalPosition * (360 / totalItems));
};
