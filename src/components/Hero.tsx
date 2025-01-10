import { useState } from "react";
import { Button } from "./ui/button";
import { CryptoDeposit } from "./CryptoDeposit";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserPlus, ArrowDown, ArrowUp } from "lucide-react";
import { useToast } from "./ui/use-toast";

export const Hero = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleAuth = async (action: 'login' | 'register') => {
    try {
      // First show a toast to inform users that Google auth needs to be enabled
      toast({
        title: "Authentication Setup Required",
        description: "Please enable Google authentication in your Supabase project settings first.",
        variant: "destructive",
      });
      
      // Still provide the link in case it gets enabled
      window.location.href = "https://biczkhfnrmsenbejoshe.supabase.co/auth/v1/authorize?provider=google";
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Please try again later. If the problem persists, contact support.",
        variant: "destructive",
      });
    }
  };

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
          {user ? (
            <>
              <Button size="lg" onClick={() => setIsDepositOpen(true)}>
                <ArrowUp className="mr-2" />
                Deposit
              </Button>
              <Button size="lg" variant="outline">
                <ArrowDown className="mr-2" />
                Withdraw
              </Button>
              <Button size="lg" variant="secondary" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" onClick={() => handleAuth('login')}>
                <LogIn className="mr-2" />
                Login
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleAuth('register')}>
                <UserPlus className="mr-2" />
                Register
              </Button>
            </>
          )}
        </div>
      </div>

      <CryptoDeposit 
        isOpen={isDepositOpen && !!user}
        onOpenChange={setIsDepositOpen}
      />
    </div>
  );
};