import { useState } from "react";
import { Button } from "./ui/button";
import { CryptoDeposit } from "./CryptoDeposit";
import { WithdrawModal } from "./WithdrawModal";
import { ArrowDown, ArrowUp, LogIn, LogOut, UserPlus, Wallet } from "lucide-react";
import { RegisterModal } from "./RegisterModal";
import { LoginModal } from "./LoginModal";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useBalance } from "@/contexts/BalanceContext";

export const Hero = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useBrowserAuth();
  const { balance } = useBalance();

  return (
    <div className="relative overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-16">
        <div className="absolute top-4 right-4 flex gap-2 items-center">
          {user ? (
            <>
              <div className="flex items-center gap-4 mr-4">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-lg font-semibold">${balance.toFixed(2)}</span>
              </div>
              <span className="text-muted-foreground self-center mr-2">
                Welcome, {user.username}!
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsRegisterOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsLoginOpen(true)}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-600">
            Rushdraw
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the thrill of opening cases and winning incredible rewards. Start your journey now!
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <>
                <Button size="lg" onClick={() => setIsDepositOpen(true)}>
                  <ArrowUp className="mr-2" />
                  Deposit
                </Button>
                <Button size="lg" variant="outline" onClick={() => setIsWithdrawOpen(true)}>
                  <ArrowDown className="mr-2" />
                  Withdraw
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={() => setIsRegisterOpen(true)}>
                <UserPlus className="mr-2" />
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>

      <CryptoDeposit 
        isOpen={isDepositOpen}
        onOpenChange={setIsDepositOpen}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onOpenChange={setIsWithdrawOpen}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
      />
    </div>
  );
};