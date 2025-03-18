
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Star, ChevronRight, Check, X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useNavigate } from "react-router-dom";
import { getLevelColor, getProgressToNextLevel, getXpRequiredForLevel } from "@/utils/rewardUtils";

export const RewardsSection = () => {
  const { user } = useBrowserAuth();
  const navigate = useNavigate();
  const [progressPercent, setProgressPercent] = useState(0);

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data && user) {
        const { data: newProgress, error: insertError } = await supabase
          .from('user_progress')
          .insert([
            { 
              user_id: user.id,
              current_level: 1,
              current_xp: 0
            }
          ])
          .select()
          .single();
          
        if (insertError) throw insertError;
        return newProgress;
      }
      
      return data;
    },
    enabled: !!user,
  });

  const { data: nextLevel } = useQuery({
    queryKey: ['nextLevel', userProgress?.current_level],
    queryFn: async () => {
      if (!userProgress) return null;
      
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .eq('level_number', userProgress.current_level + 1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProgress,
  });

  useEffect(() => {
    if (userProgress && nextLevel) {
      const progress = getProgressToNextLevel(
        userProgress.current_xp, 
        userProgress.current_level, 
        nextLevel.xp_required
      );
      setProgressPercent(progress);
    } else if (userProgress) {
      const currentLevelXp = getXpRequiredForLevel(userProgress.current_level);
      const nextLevelXp = getXpRequiredForLevel(userProgress.current_level + 1);
      const progress = getProgressToNextLevel(
        userProgress.current_xp,
        userProgress.current_level,
        nextLevelXp
      );
      setProgressPercent(progress);
    }
  }, [userProgress, nextLevel]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please login to view rewards</p>
      </div>
    );
  }

  const currentLevel = userProgress?.current_level || 1;
  const currentXp = userProgress?.current_xp || 0;
  const nextLevelXp = nextLevel?.xp_required || getXpRequiredForLevel(currentLevel + 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className={`text-2xl font-bold ${getLevelColor(currentLevel)}`}>
            Level {currentLevel}
          </h2>
        </div>
      </div>

      <div className="bg-black/30 rounded-xl p-6 border border-accent/20 shadow-lg">
        <div className="w-full max-w-[400px] mx-auto space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">XP: {currentXp.toLocaleString()}</span>
            <span className="text-muted-foreground">Next: {nextLevelXp.toLocaleString()}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {Math.round(progressPercent)}% to Level {currentLevel + 1}
          </p>
        </div>
      </div>
    </div>
  );
};
