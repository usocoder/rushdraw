import { Sparkles, Swords } from "lucide-react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface OpeningHeaderProps {
  name: string;
  isFreePlay: boolean;
  isBattleMode: boolean;
  hasRushDraw: boolean;
}

export const OpeningHeader = ({ name, isFreePlay, isBattleMode, hasRushDraw }: OpeningHeaderProps) => {
  return (
    <>
      <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        {isFreePlay ? "Free Play - " : ""}{name}
        {isBattleMode && <Swords className="h-6 w-6 text-primary" />}
        {hasRushDraw && (
          <span className="ml-2 inline-flex items-center text-yellow-500">
            <Sparkles className="w-6 h-6 animate-pulse" />
            Rush Draw Active!
          </span>
        )}
      </DialogTitle>
      <DialogDescription className="text-center text-muted-foreground">
        {isBattleMode ? "Battle Mode" : isFreePlay ? "See what you could win!" : "Opening your case..."}
      </DialogDescription>
    </>
  );
};