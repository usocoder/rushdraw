
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { generateClientSeed } from "@/utils/provablyFair";
import { useToast } from "@/hooks/use-toast";

interface ProvablyFairSettingsProps {
  onSeedChange: (seed: string) => void;
  currentSeed: string | null;
}

export const ProvablyFairSettings = ({ onSeedChange, currentSeed }: ProvablyFairSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customSeed, setCustomSeed] = useState(currentSeed || "");
  const { toast } = useToast();

  const handleSaveCustomSeed = () => {
    if (customSeed.trim() === "") {
      toast({
        title: "Invalid seed",
        description: "Client seed cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    onSeedChange(customSeed);
    setIsOpen(false);
    
    toast({
      title: "Client seed updated",
      description: "Your custom client seed has been saved",
    });
  };

  const handleGenerateNewSeed = () => {
    const newSeed = generateClientSeed();
    setCustomSeed(newSeed);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          Provably Fair Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Provably Fair Settings</DialogTitle>
          <DialogDescription>
            Customize your client seed for provably fair case openings.
            You can verify the fairness of each roll after opening a case.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client-seed">Client Seed</Label>
            <div className="flex space-x-2">
              <Input 
                id="client-seed" 
                value={customSeed} 
                onChange={(e) => setCustomSeed(e.target.value)}
                placeholder="Enter custom client seed"
              />
              <Button 
                variant="outline" 
                onClick={handleGenerateNewSeed}
                title="Generate a new random seed"
              >
                Generate
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your client seed is combined with our server seed to determine case outcomes.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveCustomSeed}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
