
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Gift, Trophy, Star, Clock, Calendar, ChevronRight, Droplets, Check, X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { getLevelColor, getRewardSuccessChance, getProgressToNextLevel, getXpRequiredForLevel } from "@/utils/rewardUtils";
import { LiveDropsModal } from "@/components/LiveDropsModal";

export const RewardsSection = () => {
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showLiveDrops, setShowLiveDrops] = useState(false);
  const [isRewardsVisible, setIsRewardsVisible] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const { data: userProgress, refetch: refetchProgress } = useQuery({
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

  const toggleRewards = () => {
    setIsRewardsVisible(!isRewardsVisible);
  };

  const handleOpenLiveDrops = () => {
    setShowLiveDrops(true);
  };

  const getClaimProbabilityText = (level: number) => {
    const chance = getRewardSuccessChance(level) * 100;
    return `${Math.round(chance)}% success rate`;
  };

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
  const canClaimReward = !userProgress?.last_reward_claim || 
    new Date(userProgress.last_reward_claim).getTime() + 24 * 60 * 60 * 1000 < Date.now();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="w-full flex justify-between">
          <Button
            onClick={toggleRewards}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
          >
            <Gift className="h-5 w-5" /> Daily Rewards <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleOpenLiveDrops}
            variant="outline"
            className="flex items-center gap-2 border-teal-500 text-teal-500 hover:bg-teal-500/10"
          >
            <Droplets className="h-5 w-5" /> View Live Drops
          </Button>
        </div>
      </div>

      {isRewardsVisible && (
        <div className="mt-4 bg-black/30 rounded-xl p-6 border border-accent/20 shadow-lg animate-in fade-in-0 slide-in-from-top-5 duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-6 w-6 text-primary" />
                <h2 className={`text-2xl font-bold ${getLevelColor(currentLevel)}`}>
                  Level {currentLevel}
                </h2>
              </div>
              
              <div className="w-full max-w-[200px] space-y-2">
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

            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => navigate('/rewards')} 
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800"
              >
                <Gift className="h-5 w-5" /> View All Rewards & Cases <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="text-sm text-amber-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Visit Daily Rewards page for special tier rewards</span>
              </div>
              
              {!canClaimReward && userProgress?.last_reward_claim && (
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Next claim available in 24h</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => navigate('/rewards')}
              size="lg"
              variant="default"
              className="w-full md:w-auto px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Browse All Cases & Claim Daily Rewards
            </Button>
          </div>
        </div>
      )}

      <LiveDropsModal isOpen={showLiveDrops} onOpenChange={setShowLiveDrops} />
    </div>
  );
};
