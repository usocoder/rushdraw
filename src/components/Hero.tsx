import { useState } from "react";
import { Button } from "./ui/button";
import { CryptoDeposit } from "./CryptoDeposit";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserPlus, ArrowDown, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const Hero = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleAuth = async (action: 'login' | 'register') => {
    setAuthMode(action);
    setIsAuthOpen(true);
  };

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("Email not confirmed")) {
            return "Please verify your email before logging in.";
          }
          return "Invalid email or password. Please check your credentials.";
        case 422:
          return "Invalid email format.";
        default:
          return error.message;
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (authMode === 'register') {
        console.log('Starting registration process');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (signUpError) {
          console.error('Registration error:', signUpError);
          throw signUpError;
        }

        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: signUpData.user.id,
                username,
              },
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            throw profileError;
          }
        }

        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
      } else {
        console.log('Starting login process');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('Login error:', signInError);
          throw signInError;
        }

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }

      setIsAuthOpen(false);
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // ... keep existing code (JSX for the hero section and dialog)

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

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Login' : 'Register'}</DialogTitle>
            <DialogDescription>
              {authMode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Create a new account to get started'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            {authMode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              {authMode === 'login' ? 'Login' : 'Register'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <CryptoDeposit 
        isOpen={isDepositOpen && !!user}
        onOpenChange={setIsDepositOpen}
      />
    </div>
  );
};