import { useState, useEffect } from "react";
import { CaseItem } from "@/types/case";

export const useSpinningLogic = (
  items: CaseItem[],
  isSpinning: boolean,
  onComplete: (item: CaseItem) => void
) => {
  const [spinItems, setSpinItems] = useState<CaseItem[]>([]);
  const [spinSpeed, setSpinSpeed] = useState(20);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (isSpinning && items && items.length > 0) {
      // Reset states
      setFinalItem(null);
      setIsRevealing(false);
      
      // Determine winning item based on odds
      const random = Math.random();
      let cumulative = 0;
      const winner = items.find((item) => {
        cumulative += item.odds;
        return random <= cumulative;
      }) || items[0];

      // Calculate the number of items to show before the winner
      const itemsBeforeWinner = Array(100)
        .fill(null)
        .map(() => items[Math.floor(Math.random() * items.length)]);

      // Add some items after the winner to ensure smooth animation
      const itemsAfterWinner = Array(20)
        .fill(null)
        .map(() => items[Math.floor(Math.random() * items.length)]);

      // Combine all items with winner in the correct position
      const allItems = [...itemsBeforeWinner, winner, ...itemsAfterWinner];
      setSpinItems(allItems);

      // Animation speed pattern with smoother transitions
      const speedPattern = [
        { speed: 60, time: 0 },
        { speed: 40, time: 1000 },
        { speed: 20, time: 2000 },
        { speed: 10, time: 3000 },
        { speed: 5, time: 4000 }
      ];

      // Apply speed changes
      speedPattern.forEach(({ speed, time }) => {
        setTimeout(() => setSpinSpeed(speed), time);
      });

      // Set final item and trigger completion after animation ends
      const spinDuration = 4500;
      const revealDelay = 500;

      setTimeout(() => {
        setIsRevealing(true);
        setFinalItem(winner);
      }, spinDuration);

      setTimeout(() => {
        onComplete(winner);
      }, spinDuration + revealDelay);
    } else if (!isSpinning) {
      // Reset states when not spinning
      setSpinItems([]);
      setSpinSpeed(20);
      setFinalItem(null);
      setIsRevealing(false);
    }
  }, [isSpinning, items, onComplete]);

  return { spinItems, spinSpeed, finalItem, isRevealing };
};