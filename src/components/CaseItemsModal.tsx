import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CaseItem } from "@/types/case";

interface CaseItemsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: CaseItem[];
  caseName: string;
}

export const CaseItemsModal = ({ isOpen, onOpenChange, items, caseName }: CaseItemsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{caseName} Items</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card p-4 rounded-lg">
              <img src={item.image} alt={item.name} className="w-full h-32 object-contain mb-2" />
              <h3 className="text-sm font-semibold truncate">{item.name}</h3>
              <p className="text-xs text-muted-foreground">Odds: {(item.odds * 100).toFixed(2)}%</p>
              <p className="text-xs text-primary">{item.multiplier}x</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};