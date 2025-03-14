
export interface CaseItem {
  id: string;
  name: string;
  value: number;
  odds: number;
  multiplier?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image?: string;
  image_url?: string; // Added to support both field names
}

export interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  bestDrop: string;
  category: string;
  items: CaseItem[];
}
