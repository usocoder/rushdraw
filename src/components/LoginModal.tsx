import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "./ui/use-toast";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ isOpen, onOpenChange }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useBrowserAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setIsLoading(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        // Invalidate and refetch queries that depend on auth state
        await queryClient.invalidateQueries({ queryKey: ['userRole'] });
        await queryClient.invalidateQueries({ queryKey: ['balance'] });
        
        onOpenChange(false);
        resetForm();
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
      } else {
        // If login returns false but no error was thrown
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome Back</DialogTitle>
          <DialogDescription>
            Login to continue opening cases
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="w-full"
          />
          <Button 
            onClick={handleLogin} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};