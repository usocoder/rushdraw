
import { useState, useEffect, useRef } from "react";
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
  const animationRef = useRef<number | null>(null);
  
  // Store game data for provably fair verification
  const [gameData, setGameData] = useState<{
    clientSeed: string;
    serverSeed: string;
    nonce: number;
    roll: number;
  } | null>(null);

  useEffect(() => {
    // Clean up any existing animation frame
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSpinning && items.length > 0) {
      // Reset states
      setFinalItem(null);
      setIsRevealing(false);
      setRotation(0);
      
      const setupSpinningProcess = async () => {
        try {
          // Generate client seed for provably fair algorithm
          let clientSeed = generateClientSeed();
          let serverSeed: string;
          let nonce: number;
          
          try {
            console.log('Generated client seed:', clientSeed);
            
            // Get server seed and nonce from edge function
            const { data, error } = await supabase.functions.invoke<CaseOpeningResponse>('create-case-opening', {
              body: { client_seed: clientSeed }
            });

            if (error || !data) {
              throw new Error(error?.message || "No data returned from case opening");
            }

            serverSeed = data.server_seed;
            nonce = data.nonce;
            console.log('Received server seed and nonce:', { serverSeed, nonce });
          } catch (invokeError) {
            console.warn("Edge function failed, using client-side fallback:", invokeError);
            // Client-side fallback when the Edge Function fails
            serverSeed = Array.from(crypto.getRandomValues(new Uint8Array(16)))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
            nonce = Date.now();
          }

          // Calculate the roll and determine the winning item
          const roll = calculateRoll(serverSeed, clientSeed, nonce);
          let winner = getItemFromRoll(roll, items);
          
          // Ensure the winner has a multiplier
          if (winner.multiplier === null || winner.multiplier === undefined) {
            // Find the case price to calculate multiplier
            const caseValue = items.reduce((sum, item) => sum + (item.value || 0), 0) / items.length;
            const estimatedCasePrice = caseValue / 1.5; // This is a rough estimate
            
            winner = {
              ...winner,
              multiplier: winner.value && estimatedCasePrice > 0 ? winner.value / estimatedCasePrice : 1
            };
          }
          
          console.log('Selected winner:', winner);
          
          // Store game data for provably fair verification
          setGameData({
            clientSeed,
            serverSeed,
            nonce,
            roll
          });

          // Generate display items
          const displayCount = 150;
          const winningIndex = Math.floor(displayCount * 0.75); // Place winning item at 75% mark
          
          // Create extended items array
          const extendedItems = Array.from({ length: displayCount }, (_, index) => {
            if (index === winningIndex) {
              return winner;
            }
            return items[Math.floor(Math.random() * items.length)];
          });
          
          setSpinItems(extendedItems);
          
          // Calculate dimensions for spinner
          const itemWidth = window.innerWidth < 768 ? 160 : 192;
          const visibleItems = 5;
          
          // Calculate spin position
          const { finalOffset } = calculateSpinPosition(
            roll,
            itemWidth,
            visibleItems,
            displayCount,
            winningIndex
          );
          
          // Use smooth animation with requestAnimationFrame
          let startTimestamp: number | null = null;
          const duration = 5000; // 5 seconds spin
          const startRotation = 0;
          const targetRotation = finalOffset;
          
          const animateSpinner = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function - cubic ease out for smooth deceleration
            const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
            const currentProgress = easeOutCubic(progress);
            
            const currentRotation = startRotation + (targetRotation - startRotation) * currentProgress;
            setRotation(currentRotation);
            
            // Continue animation until complete
            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animateSpinner);
            } else {
              // Animation complete
              setFinalItem(winner);
              setIsRevealing(true);
              
              setTimeout(() => {
                onComplete(winner);
              }, 500);
            }
          };
          
          // Start the animation
          animationRef.current = requestAnimationFrame(animateSpinner);
          
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
            // Ensure fallback item has a multiplier
            const fallbackItemWithMultiplier = fallbackItem.multiplier !== null && fallbackItem.multiplier !== undefined
              ? fallbackItem
              : {
                  ...fallbackItem,
                  multiplier: fallbackItem.value ? fallbackItem.value / 100 : 1 // Rough estimate
                };
                
            setTimeout(() => {
              onComplete(fallbackItemWithMultiplier);
            }, 500);
          }
        }
      };

      setupSpinningProcess();
    } else {
      // Not spinning, reset states
      if (spinItems.length === 0 && items.length > 0) {
        // Initialize with some items to avoid showing empty spinner
        setSpinItems(Array(20).fill(null).map(() => items[Math.floor(Math.random() * items.length)]));
      }
    }
    
    // Cleanup function to cancel animation frame when component unmounts or dependencies change
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isSpinning, items, onComplete]);

  return { 
    spinItems, 
    rotation, 
    finalItem, 
    isRevealing,
    gameData // Expose game data for verification
  };
};
