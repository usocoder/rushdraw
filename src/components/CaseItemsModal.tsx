
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CaseItem } from "@/types/case";
import { AlertTriangle } from "lucide-react";

interface CaseItemsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: CaseItem[];
  caseName: string;
}

export const CaseItemsModal = ({ isOpen, onOpenChange, items, caseName }: CaseItemsModalProps) => {
  const hasItems = items && items.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{caseName} Items</DialogTitle>
          <DialogDescription>
            View all possible items you can win from this case
          </DialogDescription>
        </DialogHeader>
        
        {!hasItems ? (
          <div className="py-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items available</h3>
            <p className="text-muted-foreground">
              This case doesn't have any items yet or they couldn't be loaded.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card p-4 rounded-lg">
                <img 
                  src={item.image || item.image_url} 
                  alt={item.name} 
                  className="w-full h-32 object-contain mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/200x200/2a2a2a/white?text=Image+Unavailable";
                  }}
                />
                <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground">Odds: {(item.odds * 100).toFixed(2)}%</p>
                <p className="text-xs text-primary">{item.multiplier || (item.value / 100).toFixed(1)}x</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
