import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBalance } from "@/contexts/BalanceContext";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { SpinningDisplay } from "./roulette/SpinningDisplay";
import { GameHistory } from "./roulette/GameHistory";
import { BettingControls } from "./roulette/BettingControls";

interface RouletteGame {
  id: string;
  result: string | null;
  start_time: string;
  end_time: string | null;
}

export const RouletteBetting = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState<"red" | "black" | "green" | null>(null);
  const [currentGame, setCurrentGame] = useState<RouletteGame | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [currentSpinDisplay, setCurrentSpinDisplay] = useState<string>("red");
  const { toast } = useToast();
  const { balance, createTransaction } = useBalance();
  const { user } = useBrowserAuth();

  useEffect(() => {
    const fetchCurrentGame = async () => {
      const { data: game, error } = await supabase
        .from('roulette_games')
        .select('*')
        .is('result', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching game:', error);
        return;
      }

      if (!game) {
        const { data: newGame, error: createError } = await supabase
          .from('roulette_games')
          .insert([{ start_time: new Date().toISOString() }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating game:', createError);
          return;
        }
        
        setCurrentGame(newGame);
      } else {
        setCurrentGame(game);
      }
    };

    fetchCurrentGame();

    // Subscribe to game updates
    const channel = supabase
      .channel('roulette-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'roulette_games',
        },
        (payload) => {
          console.log('Game update:', payload);
          const game = payload.new as RouletteGame;
          
          if (game.result) {
            setSpinResult(game.result);
            
            // Add result to history
            setGameHistory(prev => [game.result, ...prev].slice(0, 10));
            
            // Stop spinning after showing the result
            setTimeout(() => {
              setIsSpinning(false);
              
              // Start new game after showing result
              setTimeout(() => {
                fetchCurrentGame();
                setSpinResult(null);
                setSelectedColor(null);
                setBetAmount("");
              }, 3000);
            }, 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleBet = async () => {
    if (!user || !selectedColor || !betAmount || !currentGame) return;

    const amount = Number(betAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      toast({
        title: "Invalid bet amount",
        description: "Please enter a valid amount that you can afford.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const success = await createTransaction('case_open', amount);
      if (!success) throw new Error("Failed to create transaction");

      const { error: betError } = await supabase
        .from('roulette_bets')
        .insert({
          user_id: user.id,
          game_id: currentGame.id,
          bet_amount: amount,
          bet_color: selectedColor,
        });

      if (betError) throw betError;

      setIsSpinning(true);
      setSpinResult(null);

      const { error: startError } = await supabase
        .from('roulette_games')
        .update({ start_time: new Date().toISOString() })
        .eq('id', currentGame.id);

      if (startError) throw startError;

      toast({
        title: "Bet placed!",
        description: `You bet $${amount} on ${selectedColor}`,
      });

    } catch (error: any) {
      console.error('Error placing bet:', error);
      toast({
        title: "Error placing bet",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      setIsSpinning(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Roulette</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="text-center">
            <SpinningDisplay
              isSpinning={isSpinning}
              spinResult={spinResult}
              currentSpinDisplay={currentSpinDisplay}
              setCurrentSpinDisplay={setCurrentSpinDisplay}
            />
          </div>

          <GameHistory gameHistory={gameHistory} />

          <BettingControls
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            isProcessing={isProcessing}
            isSpinning={isSpinning}
            handleBet={handleBet}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};