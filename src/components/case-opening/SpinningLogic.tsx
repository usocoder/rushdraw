
import { useState, useEffect } from "react";
import { CaseItem } from "@/types/case";
import { generateClientSeed, calculateRoll, getItemFromRoll, calculateSpinPosition } from "@/utils/provablyFair";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
    if (isSpinning && items.length > 0) {
      // Reset states
      setFinalItem(null);
      setIsRevealing(false);
      setRotation(0);
      
      const setupProvablyFair = async () => {
        try {
          const clientSeed = generateClientSeed();
          console.log('Generated client seed:', clientSeed);
          
          const { data, error } = await supabase.functions.invoke<CaseOpeningResponse>('create-case-opening', {
            body: { client_seed: clientSeed }
          });

          if (error) {
            console.error("Supabase function error:", error);
            toast({
              title: "Error opening case",
              description: "Please try again",
              variant: "destructive",
            });
            return;
          }

          if (!data) {
            console.error("No data returned from case opening");
            toast({
              title: "Error opening case",
              description: "Please try again",
              variant: "destructive",
            });
            return;
          }

          const { server_seed, nonce } = data;
          console.log('Received server seed and nonce:', { server_seed, nonce });

          const roll = calculateRoll(server_seed, clientSeed, nonce);
          const winner = getItemFromRoll(roll, items);
          console.log('Selected winner:', winner);

          // Generate display items
          const displayCount = 150;
          const winningIndex = Math.floor(displayCount * 0.75);
          
          // Create extended items array
          const extendedItems = Array.from({ length: displayCount }, (_, index) => {
            if (index === winningIndex) {
              return winner;
            }
            return items[Math.floor(Math.random() * items.length)];
          });
          
          setSpinItems(extendedItems);
          
          // Calculate dimensions
          const itemWidth = window.innerWidth < 768 ? 160 : 192;
          const visibleItems = 5;
          
          const { finalOffset } = calculateSpinPosition(
            roll,
            itemWidth,
            visibleItems,
            displayCount,
            winningIndex
          );
          
          // Start animation
          requestAnimationFrame(() => {
            setRotation(finalOffset);
            
            setTimeout(() => {
              setFinalItem(winner);
              setIsRevealing(true);
              
              setTimeout(() => {
                onComplete(winner);
              }, 500);
            }, 5000);
          });

        } catch (error) {
          console.error("Error in provably fair setup:", error);
          toast({
            title: "Error opening case",
            description: "Please try again",
            variant: "destructive",
          });
        }
      };

      setupProvablyFair();
    } else {
      setSpinItems([]);
      setRotation(0);
      setFinalItem(null);
      setIsRevealing(false);
    }
  }, [isSpinning, items, onComplete]);

  return { spinItems, rotation, finalItem, isRevealing };
};
