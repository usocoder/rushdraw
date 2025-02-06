import { useState, useEffect } from "react";
import { CaseItem } from "@/types/case";

interface SpinningLogicProps {
  isSpinning: boolean;
  items: CaseItem[];
  onComplete: (item: CaseItem) => void;
}

export const useSpinningLogic = (items: CaseItem[], isSpinning: boolean, onComplete: (item: CaseItem) => void) => {
  const [spinItems, setSpinItems] = useState<CaseItem[]>([]);
  const [spinSpeed, setSpinSpeed] = useState(20);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);

  useEffect(() => {
    if (isSpinning) {
      // First determine the winning item based on odds
      const random = Math.random();
      let cumulative = 0;
      
      const winner = items.find((item) => {
        cumulative += item.odds;
        return random <= cumulative;
      }) || items[0];

      // Generate items array with the winner at a specific position
      const itemsBeforeWinner = Array(150)
        .fill(null)
        .map(() => items[Math.floor(Math.random() * items.length)]);
      
      // Place the winner at position 160 (this ensures it lands in the center)
      const itemsAfterWinner = Array(40)
        .fill(null)
        .map(() => items[Math.floor(Math.random() * items.length)]);
      
      const allItems = [...itemsBeforeWinner, winner, ...itemsAfterWinner];
      setSpinItems(allItems);
      
      // Speed pattern for smooth animation
      const speedPattern = [
        { speed: 100, time: 0 },
        { speed: 80, time: 500 },
        { speed: 60, time: 1500 },
        { speed: 40, time: 2500 },
        { speed: 20, time: 4000 },
        { speed: 10, time: 6000 },
        { speed: 5, time: 8000 },
        { speed: 2, time: 9000 },
        { speed: 1, time: 10000 }
      ];

      speedPattern.forEach(({ speed, time }) => {
        setTimeout(() => setSpinSpeed(speed), time);
      });

      // Set the final item and trigger completion after the animation
      setTimeout(() => {
        setFinalItem(winner);
        onComplete(winner);
      }, 10000);
    } else {
      setSpinItems([]);
      setFinalItem(null);
      setSpinSpeed(20);
    }
  }, [isSpinning, items, onComplete]);

  return { spinItems, spinSpeed, finalItem };
};