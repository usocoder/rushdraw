import { useState } from "react";
import { Button } from "./ui/button";
import { CryptoDeposit } from "./CryptoDeposit";
import { ArrowDown, ArrowUp } from "lucide-react";

export const Hero = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-600">
          Open Cases, Win Big
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the thrill of opening cases and winning incredible rewards. Start your journey now!
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => setIsDepositOpen(true)}>
            <ArrowUp className="mr-2" />
            Deposit
          </Button>
          <Button size="lg" variant="outline">
            <ArrowDown className="mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      <CryptoDeposit 
        isOpen={isDepositOpen}
        onOpenChange={setIsDepositOpen}
      />
    </div>
  );
};