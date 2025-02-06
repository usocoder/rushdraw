import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";

interface BettingControlsProps {
  selectedColor: "red" | "black" | "green" | null;
  setSelectedColor: (color: "red" | "black" | "green") => void;
  betAmount: string;
  setBetAmount: (amount: string) => void;
  isProcessing: boolean;
  isSpinning: boolean;
  handleBet: () => void;
}

export const BettingControls = ({
  selectedColor,
  setSelectedColor,
  betAmount,
  setBetAmount,
  isProcessing,
  isSpinning,
  handleBet,
}: BettingControlsProps) => {
  return (
    <div className="grid gap-4">
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
  );
};