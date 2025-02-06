import { useEffect } from "react";

interface SpinningDisplayProps {
  isSpinning: boolean;
  spinResult: string | null;
  currentSpinDisplay: string;
  setCurrentSpinDisplay: (color: string) => void;
}

export const SpinningDisplay = ({
  isSpinning,
  spinResult,
  currentSpinDisplay,
  setCurrentSpinDisplay,
}: SpinningDisplayProps) => {
  useEffect(() => {
    let spinInterval: NodeJS.Timeout;
    if (isSpinning) {
      const options = ["red", "black", "green", "red", "black", "red", "black", "green"];
      let currentIndex = 0;
      
      spinInterval = setInterval(() => {
        setCurrentSpinDisplay(options[currentIndex % options.length]);
        currentIndex++;
      }, 150);
    }

    return () => {
      if (spinInterval) {
        clearInterval(spinInterval);
      }
    };
  }, [isSpinning, setCurrentSpinDisplay]);

  if (isSpinning) {
    return (
      <div className={`text-2xl font-bold mb-2 animate-pulse ${
        currentSpinDisplay === 'green' ? 'text-green-600' : 
        currentSpinDisplay === 'red' ? 'text-red-600' : 'text-black'
      }`}>
        {currentSpinDisplay.toUpperCase()} {currentSpinDisplay === 'green' ? '14x' : '2x'}
      </div>
    );
  }

  if (spinResult) {
    return (
      <div className={`text-2xl font-bold mb-2 ${
        spinResult === 'green' ? 'text-green-600' : 
        spinResult === 'red' ? 'text-red-600' : 'text-black'
      }`}>
        {spinResult.toUpperCase()} {spinResult === 'green' ? '14x' : '2x'}!
      </div>
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      Place your bet to start the game
    </div>
  );
};