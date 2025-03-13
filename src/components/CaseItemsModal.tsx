
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CaseItem } from "@/types/case";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface CaseItemsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: CaseItem[];
  caseName: string;
}

export const CaseItemsModal = ({ isOpen, onOpenChange, items, caseName }: CaseItemsModalProps) => {
  const [processedItems, setProcessedItems] = useState<CaseItem[]>([]);
  const hasItems = processedItems && processedItems.length > 0;
  
  // Process items when they change or modal opens
  useEffect(() => {
    if (items && items.length > 0) {
      const sortedItems = [...items].sort((a, b) => {
        // Sort by rarity first (legendary first)
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        const rarityA = rarityOrder[a.rarity] || 5;
        const rarityB = rarityOrder[b.rarity] || 5;
        
        if (rarityA !== rarityB) return rarityA - rarityB;
        
        // Then sort by multiplier/value (highest first)
        const multA = a.multiplier || (a.value / 100);
        const multB = b.multiplier || (b.value / 100);
        return multB - multA;
      });
      
      setProcessedItems(sortedItems);
    } else {
      setProcessedItems([]);
    }
  }, [items, isOpen]);

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
            {processedItems.map((item) => (
              <div 
                key={item.id} 
                className={`bg-card p-4 rounded-lg border ${
                  item.rarity === 'legendary' ? 'border-yellow-500/50' : 
                  item.rarity === 'epic' ? 'border-purple-500/50' : 
                  item.rarity === 'rare' ? 'border-blue-500/50' : 
                  'border-accent/20'
                }`}
              >
                <div className="relative aspect-square mb-2 bg-accent/10 rounded-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.image || item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x200/2a2a2a/white?text=Image+Unavailable";
                    }}
                  />
                </div>
                <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">Odds: {(item.odds * 100).toFixed(2)}%</p>
                  <p className={`text-xs font-semibold ${
                    item.rarity === 'legendary' ? 'text-yellow-500' : 
                    item.rarity === 'epic' ? 'text-purple-500' : 
                    item.rarity === 'rare' ? 'text-blue-500' : 
                    'text-primary'
                  }`}>
                    {item.multiplier ? Math.floor(item.multiplier) : Math.floor(item.value / 100)}x
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
