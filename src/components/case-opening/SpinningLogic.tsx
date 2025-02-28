
import { useState, useEffect, useRef } from "react";
import { CaseItem } from "@/types/case";
import { generateClientSeed, calculateRoll, getItemFromRoll } from "@/utils/provablyFair";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Store game data for provably fair verification
  const [gameData, setGameData] = useState<{
    clientSeed: string;
    serverSeed: string;
    nonce: number;
    roll: number;
  } | null>(null);

  // Calculate item height based on mobile status
  const getItemHeight = () => {
    return isMobile ? 160 : 192; // height in pixels (matching the h-40/h-48 classes)
  };

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

          // Generate spinner items with duplicated sequences for smooth looping
          const displayCount = 50; // Total number of items to display
          const extraSpins = 4; // Number of full cycles before showing the winner
          const itemHeight = getItemHeight();
          
          // Create a pool of random items (excluding the winner to avoid duplicates)
          const itemPool = items.filter(item => item.id !== winner.id);
          
          // Create sequence of items with winner placed at a predetermined position
          const fullSequence: CaseItem[] = [];
          
          // Add enough random items to fill the sequence
          for (let i = 0; i < displayCount; i++) {
            // Winner at 75% through the sequence
            if (i === Math.floor(displayCount * 0.75)) {
              fullSequence.push(winner);
            } else {
              // Random item from pool
              const randomItem = itemPool[Math.floor(Math.random() * itemPool.length)];
              fullSequence.push(randomItem);
            }
          }
          
          setSpinItems(fullSequence);
          
          // Calculate final position to center the winning item
          const winnerIndex = Math.floor(displayCount * 0.75);
          const centerOffset = Math.floor(itemHeight / 2);
          const finalPosition = -(winnerIndex * itemHeight) + centerOffset;
          
          // Calculate total spin distance including extra spins
          const totalDistance = (extraSpins * displayCount * itemHeight) + Math.abs(finalPosition);
          
          // Set up the spin animation
          // Start by instantly moving up (negative value)
          setRotation(0);
          
          // Set a small timeout to ensure the initial position is rendered
          setTimeout(() => {
            // Then animate down to the final position
            setRotation(-totalDistance);
            
            // Set timeout for when animation completes
            setTimeout(() => {
              setFinalItem(winner);
              setIsRevealing(true);
              
              setTimeout(() => {
                onComplete(winner);
              }, 1000); // Delay before calling onComplete
            }, 5000); // Match the CSS transition duration (5s)
          }, 50); 
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
        const initialItems = Array(10).fill(null).map(() => items[Math.floor(Math.random() * items.length)]);
        setSpinItems(initialItems);
      }
    }
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isSpinning, items, onComplete, isMobile, toast]);

  return { 
    spinItems, 
    rotation, 
    finalItem, 
    isRevealing,
    gameData // Expose game data for verification
  };
};
