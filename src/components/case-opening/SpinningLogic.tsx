
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
          // For free play or when the Edge Function is failing, use a client-side fallback
          let server_seed: string;
          let nonce: number;
          let clientSeed = generateClientSeed();
          
          try {
            console.log('Generated client seed:', clientSeed);
            
            const { data, error } = await supabase.functions.invoke<CaseOpeningResponse>('create-case-opening', {
              body: { client_seed: clientSeed }
            });

            if (error || !data) {
              throw new Error(error?.message || "No data returned from case opening");
            }

            server_seed = data.server_seed;
            nonce = data.nonce;
            console.log('Received server seed and nonce:', { server_seed, nonce });
          } catch (invokeError) {
            console.warn("Edge function failed, using client-side fallback:", invokeError);
            // Client-side fallback when the Edge Function fails
            server_seed = Array.from(crypto.getRandomValues(new Uint8Array(16)))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
            nonce = Date.now();
          }

          // Calculate the winning item
          const roll = calculateRoll(server_seed, clientSeed, nonce);
          const winner = getItemFromRoll(roll, items);
          console.log('Selected winner:', winner);

          // Create extended items array with at least 1 item (avoid empty array errors)
          if (items.length === 0) {
            throw new Error("No items available");
          }

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
          
          // Still need to call onComplete to cleanup the spinning state
          if (items.length > 0) {
            // If we have items, pick a random one to complete
            const fallbackItem = items[Math.floor(Math.random() * items.length)];
            setTimeout(() => {
              onComplete(fallbackItem);
            }, 500);
          }
        }
      };

      setupProvablyFair();
    } else {
      // Not spinning, reset states
      if (spinItems.length === 0 && items.length > 0) {
        // Initialize with some items to avoid showing empty spinner
        setSpinItems(Array(20).fill(null).map(() => items[Math.floor(Math.random() * items.length)]));
      }
    }
  }, [isSpinning, items, onComplete]);

  return { spinItems, rotation, finalItem, isRevealing };
};
