import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBalance } from "@/contexts/BalanceContext";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { Loader2 } from "lucide-react";

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

  // Spinning animation effect
  useEffect(() => {
    let spinInterval: NodeJS.Timeout;
    if (isSpinning) {
      const options = ["red", "black", "green", "red", "black", "red", "black", "green"];
      let currentIndex = 0;
      
      spinInterval = setInterval(() => {
        setCurrentSpinDisplay(options[currentIndex % options.length]);
        currentIndex++;
      }, 200); // Adjust speed of spinning here
    }

    return () => {
      if (spinInterval) {
        clearInterval(spinInterval);
      }
    };
  }, [isSpinning]);

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
          .insert([{ start_time: null }])
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
            // Stop spinning after a short delay to show the result
            setTimeout(() => {
              setIsSpinning(false);
              setSpinResult(game.result);
              setGameHistory(prev => [game.result, ...prev].slice(0, 10));
            }, 2000);

            // Start new game after showing result
            setTimeout(() => {
              fetchCurrentGame();
              setSpinResult(null);
            }, 5000);
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
      // Create transaction first
      const success = await createTransaction('case_open', amount);
      if (!success) throw new Error("Failed to create transaction");

      // Place bet and start game
      const { error: betError } = await supabase
        .from('roulette_bets')
        .insert({
          user_id: user.id,
          game_id: currentGame.id,
          bet_amount: amount,
          bet_color: selectedColor,
        });

      if (betError) throw betError;

      // Start spinning animation
      setIsSpinning(true);
      setSpinResult(null);

      // Update game start time
      const { error: startError } = await supabase
        .from('roulette_games')
        .update({ start_time: new Date().toISOString() })
        .eq('id', currentGame.id);

      if (startError) throw startError;

      toast({
        title: "Bet placed!",
        description: `You bet $${amount} on ${selectedColor}`,
      });

      setBetAmount("");
      setSelectedColor(null);
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
            {isSpinning ? (
              <div className={`text-2xl font-bold mb-2 animate-pulse ${
                currentSpinDisplay === 'green' ? 'text-green-600' : 
                currentSpinDisplay === 'red' ? 'text-red-600' : 'text-black'
              }`}>
                {currentSpinDisplay.toUpperCase()} {currentSpinDisplay === 'green' ? '14x' : '2x'}
              </div>
            ) : spinResult ? (
              <div className={`text-2xl font-bold mb-2 ${
                spinResult === 'green' ? 'text-green-600' : 
                spinResult === 'red' ? 'text-red-600' : 'text-black'
              }`}>
                {spinResult.toUpperCase()} {spinResult === 'green' ? '14x' : '2x'}!
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Place your bet to start the game
              </div>
            )}
          </div>

          {/* Game History */}
          <div className="flex gap-1 overflow-x-auto p-2 bg-black/10 rounded-lg">
            {gameHistory.map((result, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shrink-0
                  ${result === 'green' ? 'bg-green-600' : 
                    result === 'red' ? 'bg-red-600' : 'bg-black'}`}
              >
                {result === 'green' ? '14x' : '2x'}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setSelectedColor("red")}
              variant={selectedColor === "red" ? "default" : "outline"}
              disabled={isSpinning}
            >
              Red (2x)
            </Button>
            <Button
              className="bg-black hover:bg-gray-900"
              onClick={() => setSelectedColor("black")}
              variant={selectedColor === "black" ? "default" : "outline"}
              disabled={isSpinning}
            >
              Black (2x)
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setSelectedColor("green")}
              variant={selectedColor === "green" ? "default" : "outline"}
              disabled={isSpinning}
            >
              Green (14x)
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="betAmount">Bet Amount</Label>
            <Input
              id="betAmount"
              type="number"
              min="0"
              step="0.01"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter amount..."
              disabled={isSpinning}
            />
          </div>

          <Button
            onClick={handleBet}
            disabled={isProcessing || !selectedColor || !betAmount || isSpinning}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              `Place Bet on ${selectedColor || "..."}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};