
import { createHash } from 'crypto-js';
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
  return items[0]; // Fallback to first item if no match (shouldn't happen with proper odds)
};
