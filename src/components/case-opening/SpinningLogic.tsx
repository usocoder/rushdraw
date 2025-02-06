import { useState, useEffect } from "react";
import { CaseItem } from "@/types/case";

export const useSpinningLogic = (items: CaseItem[], isSpinning: boolean, onComplete: (item: CaseItem) => void) => {
  const [spinItems, setSpinItems] = useState<CaseItem[]>([]);
  const [spinSpeed, setSpinSpeed] = useState(20);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);

  useEffect(() => {
    if (isSpinning) {
      // Reset states
      setFinalItem(null);
      
      // Determine winning item based on odds
      const random = Math.random();
      let cumulative = 0;
      const winner = items.find((item) => {
        cumulative += item.odds;
        return random <= cumulative;
      }) || items[0];

      // Calculate the number of items to show before the winner
      const itemsBeforeWinner = Array(150)
        .fill(null)
        .map(() => items[Math.floor(Math.random() * items.length)]);

      // Add some items after the winner to ensure smooth animation
      const itemsAfterWinner = Array(40)
        .fill(null)
        .map(() => items[Math.floor(Math.random() * items.length)]);

      // Combine all items with winner in the correct position
      const allItems = [...itemsBeforeWinner, winner, ...itemsAfterWinner];
      setSpinItems(allItems);

      // Animation speed pattern
      const speedPattern = [
        { speed: 80, time: 0 },
        { speed: 60, time: 1000 },
        { speed: 40, time: 2000 },
        { speed: 20, time: 4000 },
        { speed: 10, time: 6000 },
        { speed: 5, time: 8000 },
        { speed: 2, time: 9000 }
      ];

      // Apply speed changes
      speedPattern.forEach(({ speed, time }) => {
        setTimeout(() => setSpinSpeed(speed), time);
      });

      // Set final item and trigger completion after animation ends
      const animationDuration = 9500;
      setTimeout(() => {
        setFinalItem(winner);
        onComplete(winner);
      }, animationDuration);
    } else {
      // Reset states when not spinning
      setSpinItems([]);
      setSpinSpeed(20);
      setFinalItem(null);
    }
  }, [isSpinning, items, onComplete]);

  return { spinItems, spinSpeed, finalItem };
};