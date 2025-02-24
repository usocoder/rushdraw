
import { useState, useEffect } from "react";
import { CaseItem } from "@/types/case";
import { generateClientSeed, calculateRoll, getItemFromRoll } from "@/utils/provablyFair";
import { supabase } from "@/integrations/supabase/client";

export const useSpinningLogic = (items: CaseItem[], isSpinning: boolean, onComplete: (item: CaseItem) => void) => {
  const [spinItems, setSpinItems] = useState<CaseItem[]>([]);
  const [rotation, setRotation] = useState(0);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      // Reset states
      setFinalItem(null);
      setIsRevealing(false);
      setRotation(0);
      
      const setupProvablyFair = async () => {
        try {
          const clientSeed = generateClientSeed();
          
          // Get next nonce and server seed from database
          const { data: openingData, error } = await supabase.rpc('create_case_opening', {
            client_seed: clientSeed
          });

          if (error) throw error;

          const { server_seed, nonce } = openingData;
          const roll = calculateRoll(server_seed, clientSeed, nonce);
          const winner = getItemFromRoll(roll, items);

          // Generate display items
          const displayItems = Array(20)
            .fill(null)
            .map(() => items[Math.floor(Math.random() * items.length)]);
          
          setSpinItems(displayItems);
          
          // Animate rotation
          let currentRotation = 0;
          const totalRotations = 5; // Number of full rotations before stopping
          const finalRotation = 360 * totalRotations;
          
          const startTime = performance.now();
          const duration = 8000; // 8 seconds
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth deceleration
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
            currentRotation = finalRotation * easeOut(progress);
            
            setRotation(currentRotation);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setFinalItem(winner);
              setIsRevealing(true);
              setTimeout(() => {
                onComplete(winner);
              }, 500);
            }
          };
          
          requestAnimationFrame(animate);
        } catch (error) {
          console.error("Error in provably fair setup:", error);
        }
      };

      setupProvablyFair();
    } else {
      // Reset states when not spinning
      setSpinItems([]);
      setRotation(0);
      setFinalItem(null);
      setIsRevealing(false);
    }
  }, [isSpinning, items, onComplete]);

  return { spinItems, rotation, finalItem, isRevealing };
};
