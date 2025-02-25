
import { useState, useEffect } from "react";
import { CaseItem } from "@/types/case";
import { generateClientSeed, calculateRoll, getItemFromRoll, calculateSpinPosition } from "@/utils/provablyFair";
import { supabase } from "@/integrations/supabase/client";

interface CaseOpeningResponse {
  server_seed: string;
  nonce: number;
}

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
          console.log('Generated client seed:', clientSeed);
          
          // Get next nonce and server seed from database
          const { data, error } = await supabase.functions.invoke<CaseOpeningResponse>('create-case-opening', {
            body: { client_seed: clientSeed }
          });

          if (error) throw error;
          if (!data) throw new Error('No data returned from case opening');

          const { server_seed, nonce } = data;
          console.log('Received server seed and nonce:', { server_seed, nonce });

          const roll = calculateRoll(server_seed, clientSeed, nonce);
          const winner = getItemFromRoll(roll, items);
          console.log('Selected winner:', winner);

          // Generate display items array with winner guaranteed to appear
          const displayCount = 100; // Larger number for smoother animation
          const displayItems = Array(displayCount)
            .fill(null)
            .map((_, index) => {
              // Place the winner at a specific position
              if (index === Math.floor(displayCount * 0.75)) {
                return winner;
              }
              // Random items for the rest
              return items[Math.floor(Math.random() * items.length)];
            });
          
          setSpinItems(displayItems);
          
          // Calculate final rotation based on the roll
          const finalRotation = calculateSpinPosition(roll, displayCount);
          console.log('Final rotation:', finalRotation);
          
          const startTime = performance.now();
          const duration = 8000; // 8 seconds
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for realistic deceleration
            const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
            const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            
            // Combine easing functions for more natural movement
            const combinedEase = progress < 0.7 
              ? easeOutExpo(progress / 0.7) 
              : easeOutCubic((progress - 0.7) / 0.3);
            
            // Apply rotation
            const currentRotation = finalRotation * combinedEase;
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
