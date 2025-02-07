import { Case, CaseItem } from "@/types/case";
import { SpinningItems } from "./SpinningItems";
import { useState, useEffect } from "react";

interface BattleSpinnerProps {
  caseData: Case;
  isSpinning: boolean;
  onSpinComplete: (item: CaseItem) => void;
  playerName: string;
  isOpponent?: boolean;
}

export const BattleSpinner = ({ 
  caseData, 
  isSpinning, 
  onSpinComplete,
  playerName,
  isOpponent
}: BattleSpinnerProps) => {
  const [spinItems, setSpinItems] = useState<CaseItem[]>([]);
  const [spinSpeed, setSpinSpeed] = useState(20);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);

  useEffect(() => {
    if (isSpinning) {
      const items = Array(200)
        .fill(null)
        .map(() => caseData.items[Math.floor(Math.random() * caseData.items.length)]);
      setSpinItems(items);
      
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

      setTimeout(() => {
        const random = Math.random();
        let cumulative = 0;
        
        const winner = caseData.items.find((item) => {
          cumulative += item.odds;
          return random <= cumulative;
        }) || caseData.items[0];

        setFinalItem(winner);
        onSpinComplete(winner);
      }, 10000);
    } else {
      setSpinItems([]);
      setFinalItem(null);
      setSpinSpeed(20);
    }
  }, [isSpinning, caseData.items, onSpinComplete]);

  return (
    <div className="relative h-48 overflow-hidden rounded-lg bg-muted">
      <SpinningItems
        items={spinItems}
        isSpinning={isSpinning}
        spinSpeed={spinSpeed}
        finalItem={finalItem}
        hasRushDraw={false}
        isOpponent={isOpponent}
        playerName={playerName}
      />
    </div>
  );
};