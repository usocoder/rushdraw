
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

interface SpinningLogicProps {
  items: CaseItem[];
  isSpinning: boolean;
  onComplete: (item: CaseItem) => void;
  customClientSeed?: string | null;
}

export const useSpinningLogic = ({ 
  items, 
  isSpinning, 
  onComplete,
  customClientSeed = null 
}: SpinningLogicProps) => {
  const [spinItems, setSpinItems] = useState<CaseItem[]>([]);
  const [rotation, setRotation] = useState(0);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const animationRef = useRef<number | null>(null);
  const animationStartTimeRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Store game data for provably fair verification
  const [gameData, setGameData] = useState<{
    clientSeed: string;
    serverSeed: string;
    nonce: number;
    roll: number;
  } | null>(null);

  // Store the current client seed
  const [clientSeed, setClientSeed] = useState<string | null>(customClientSeed);

  // Update client seed when customClientSeed changes
  useEffect(() => {
    if (customClientSeed !== null) {
      setClientSeed(customClientSeed);
    }
  }, [customClientSeed]);

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

  // Animation frame function for smooth animation
  const animateSpinner = (timestamp: number, finalPosition: number, duration: number) => {
    if (animationStartTimeRef.current === null) {
      animationStartTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - animationStartTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    
    // Improved easing function for smoother deceleration
    // Cubic bezier approximation for a natural spin-down feeling
    const easeOutCubic = (t: number) => {
      const ts = t - 1;
      return ts * ts * ts + 1;
    };
    
    // Calculate current position based on easing
    const currentPosition = -finalPosition * easeOutCubic(progress);
    
    // Update rotation state
    setRotation(currentPosition);
    
    // Continue animation if not finished
    if (progress < 1) {
      animationRef.current = requestAnimationFrame((timestamp) => 
        animateSpinner(timestamp, finalPosition, duration)
      );
    } else {
      // Animation complete
      animationStartTimeRef.current = null;
      setIsRevealing(true);
      
      // Delay before calling onComplete to allow reveal animation
      setTimeout(() => {
        if (finalItem) {
          onComplete(finalItem);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (isSpinning && items.length > 0) {
      // Reset states
      setFinalItem(null);
      setIsRevealing(false);
      setRotation(0);
      
      const setupSpinningProcess = async () => {
        try {
          // Use provided client seed or generate a new one
          let usedClientSeed = clientSeed || generateClientSeed();
          if (!clientSeed) {
            setClientSeed(usedClientSeed);
          }
          
          let serverSeed: string;
          let nonce: number;
          
          try {
            // Get server seed and nonce from edge function
            const { data, error } = await supabase.functions.invoke<CaseOpeningResponse>('create-case-opening', {
              body: { client_seed: usedClientSeed }
            });

            if (error || !data) {
              throw new Error(error?.message || "No data returned from case opening");
            }

            serverSeed = data.server_seed;
            nonce = data.nonce;
          } catch (invokeError) {
            console.warn("Edge function failed, using client-side fallback:", invokeError);
            // Client-side fallback when the Edge Function fails
            serverSeed = Array.from(crypto.getRandomValues(new Uint8Array(16)))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
            nonce = Date.now();
          }

          // Calculate the roll and determine the winning item
          const roll = calculateRoll(serverSeed, usedClientSeed, nonce);
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
          
          // Store game data for provably fair verification
          setGameData({
            clientSeed: usedClientSeed,
            serverSeed,
            nonce,
            roll
          });

          // Store the final item for later completion
          setFinalItem(winner);

          // Generate spinner items with optimized sequence
          const itemHeight = getItemHeight();
          
          // Create a pool of random items for spinning (excluding the winner to avoid duplicates)
          const itemPool = items.filter(item => item.id !== winner.id);
          
          // Pre-compute a smaller set of items for better performance
          // Reduced number for smoother animation
          const displayCount = 20; 
          
          // Create sequence of items with winner placed at a specific position
          const fullSequence: CaseItem[] = [];
          
          // Add enough random items to fill the sequence
          for (let i = 0; i < displayCount; i++) {
            // Winner at 80% through the sequence for more predictable landing
            if (i === Math.floor(displayCount * 0.8)) {
              fullSequence.push(winner);
            } else {
              // Random item from pool
              const randomItem = itemPool[Math.floor(Math.random() * itemPool.length)];
              fullSequence.push(randomItem);
            }
          }
          
          setSpinItems(fullSequence);
          
          // Calculate final position to center the winning item
          const winnerIndex = Math.floor(displayCount * 0.8);
          const centerOffset = Math.floor(itemHeight / 2);
          const finalPosition = (winnerIndex * itemHeight) - centerOffset;
          
          // Use fewer spins for smoother animation
          const extraSpins = 2;
          const totalDistance = (extraSpins * displayCount * itemHeight) + Math.abs(finalPosition);
          
          // Start the animation with requestAnimationFrame for smoother performance
          animationRef.current = requestAnimationFrame((timestamp) => {
            const animationDuration = 5000; // 5 seconds total animation time
            animateSpinner(timestamp, totalDistance, animationDuration);
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
        // Initialize with fewer items to avoid showing empty spinner
        const initialItems = Array(5).fill(null).map(() => items[Math.floor(Math.random() * items.length)]);
        setSpinItems(initialItems);
      }
    }
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isSpinning, items, onComplete, isMobile, toast, clientSeed]);

  return { 
    spinItems, 
    rotation, 
    finalItem, 
    isRevealing,
    gameData, 
    clientSeed, 
    setClientSeed 
  };
};
