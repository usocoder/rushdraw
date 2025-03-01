import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Gift, Trophy, Star, Clock, Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface UserProgress {
  current_level: number;
  current_xp: number;
  last_reward_claim: string | null;
}

interface Level {
  level_number: number;
  xp_required: number;
}

interface DailyReward {
  level_required: number;
  case_id: string;
  case: {
    name: string;
    image_url: string;
  };
}

export const RewardsSection = () => {
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [nextLevelXp, setNextLevelXp] = useState<number>(0);
  const [xpProgress, setXpProgress] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

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
        return newProgress as UserProgress;
      }
      
      return data as UserProgress;
    },
    enabled: !!user,
  });

  const { data: levels } = useQuery({
    queryKey: ['levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('level_number', { ascending: true });
      
      if (error) throw error;
      return data as Level[];
    },
  });

  const { data: dailyRewards } = useQuery({
    queryKey: ['dailyRewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_rewards')
        .select(`
          level_required,
          case_id,
          case:cases (
            name,
            image_url
          )
        `)
        .order('level_required', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(reward => ({
        ...reward,
        case: reward.case || { name: "Unknown", image_url: "/placeholder.svg" }
      })) as DailyReward[];
    },
  });

  useEffect(() => {
    if (userProgress && levels && levels.length > 0) {
      const currentLevel = levels.find(l => l.level_number === userProgress.current_level);
      const nextLevel = levels.find(l => l.level_number === userProgress.current_level + 1);
      
      if (currentLevel && nextLevel) {
        const xpNeeded = nextLevel.xp_required - currentLevel.xp_required;
        const xpGained = userProgress.current_xp - currentLevel.xp_required;
        const calculatedProgress = (xpGained / xpNeeded) * 100;
        
        setNextLevelXp(xpNeeded);
        setXpProgress(Math.max(0, Math.min(100, calculatedProgress))); // Ensure between 0-100
      }
    }
  }, [userProgress, levels]);

  useEffect(() => {
    if (!userProgress?.last_reward_claim) {
      setTimeRemaining(null);
      return;
    }

    const calculateTimeRemaining = () => {
      const lastClaim = new Date(userProgress.last_reward_claim as string);
      const nextClaim = new Date(lastClaim.getTime() + 25 * 60 * 60 * 1000); // 25 hours
      const now = new Date();
      
      if (now >= nextClaim) {
        setTimeRemaining(null);
        return;
      }
      
      const diffMs = nextClaim.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(intervalId);
  }, [userProgress?.last_reward_claim]);

  const handleClaimReward = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('claim_daily_reward', {
          user_id: user.id
        });

      if (error) throw error;

      if (data[0].success) {
        toast({
          title: "Success!",
          description: data[0].message,
        });
        refetchProgress();
      } else {
        toast({
          title: "Cannot claim reward",
          description: data[0].message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim daily reward",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please login to view rewards</p>
      </div>
    );
  }

  const eligibleReward = dailyRewards?.find(reward => 
    reward.level_required <= (userProgress?.current_level || 1)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex flex-col items-center mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Level {userProgress?.current_level || 1}</h2>
          </div>
          <div className="w-full max-w-md mb-2">
            <Progress value={xpProgress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            {userProgress?.current_xp || 0} / {(userProgress?.current_xp || 0) + nextLevelXp} XP to next level
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button 
            onClick={() => navigate('/rewards')} 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
          >
            <Gift className="h-5 w-5" /> Claim Daily Rewards
          </Button>
          
          <div className="text-sm text-amber-500 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>New rewards every 24 hours</span>
          </div>
          
          {timeRemaining && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>Next claim in: {timeRemaining}</span>
            </div>
          )}
        </div>
      </div>

      {eligibleReward && (
        <div className="bg-card rounded-lg p-6 border border-accent/20 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <img
                src={eligibleReward.case.image_url}
                alt={eligibleReward.case.name}
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-2">Today's Reward: {eligibleReward.case.name}</h3>
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Unlocked at Level {eligibleReward.level_required}</span>
              </div>
              <div className="flex items-center gap-2 mb-4 justify-center md:justify-start text-amber-500">
                <Calendar className="h-4 w-4" />
                <span>Available once every 24 hours</span>
              </div>
              <Button
                onClick={handleClaimReward}
                disabled={!!timeRemaining}
                className="w-full md:w-auto"
              >
                {timeRemaining ? `Cooldown: ${timeRemaining}` : "Claim Daily Reward"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
