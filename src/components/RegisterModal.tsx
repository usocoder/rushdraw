import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "./ui/use-toast";

interface RegisterModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegisterModal = ({ isOpen, onOpenChange }: RegisterModalProps) => {
  const [username, setUsername] = useState("");
  const { login } = useBrowserAuth();
  const { toast } = useToast();

  const handleRegister = () => {
    if (username.length < 3) {
      toast({
        title: "Invalid username",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }
    login(username);
    onOpenChange(false);
    toast({
      title: "Welcome!",
      description: `You're now registered as ${username}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Registration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={handleRegister} className="w-full">
            Start Opening Cases
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};