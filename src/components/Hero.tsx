import { useState } from "react";
import { Button } from "./ui/button";
import { CryptoDeposit } from "./CryptoDeposit";
import { WithdrawModal } from "./WithdrawModal";
import { ArrowDown, ArrowUp, LogIn, LogOut, UserPlus, Wallet, Settings } from "lucide-react";
import { RegisterModal } from "./RegisterModal";
import { LoginModal } from "./LoginModal";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ReferralManager } from "./ReferralManager";

export const Hero = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useBrowserAuth();
  const { balance } = useBalance();
  const navigate = useNavigate();

  // Check if user is admin
  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Get user level
  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('current_level, current_xp')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data || { current_level: 1, current_xp: 0 };
    },
    enabled: !!user,
  });

  return (
    <div className="relative overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-16">
        <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 items-center max-w-full sm:flex-nowrap">
          {user ? (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <Wallet className="h-4 w-4 text-primary shrink-0" />
                <span className="text-lg font-semibold truncate">${balance.toFixed(2)}</span>
              </div>
              {userProgress && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm">Level {userProgress.current_level}</span>
                </div>
              )}
              <span className="text-muted-foreground self-center truncate">
                Welcome, {user.username}!
              </span>
              {userRole?.role === 'admin' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                  className="shrink-0"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={logout} className="shrink-0">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsRegisterOpen(true)} className="shrink-0">
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsLoginOpen(true)} className="shrink-0">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </>
          )}
        </div>

        <div className="text-center mt-16 sm:mt-0">
          <div className="mb-8 inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg animate-pulse">
            <h2 className="text-2xl font-bold text-white">🎉 Weekly Jackpot: $10,000 🎉</h2>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-600">
            RushDraw
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the thrill of opening cases and winning incredible rewards. Weekly $10,000 jackpot. support@rushdraw.com
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

          {user && (
            <div className="mt-8">
              <ReferralManager />
            </div>
          )}
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
    </div>
  );
};
