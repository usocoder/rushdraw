import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Gift, Trophy, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "@/hooks/use-toast";

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
  const [nextLevelXp, setNextLevelXp] = useState<number>(0);
  const [xpProgress, setXpProgress] = useState<number>(0);

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
        case: reward.case[0]
      })) as DailyReward[];
    },
  });

  useEffect(() => {
    if (userProgress && levels) {
      const currentLevel = levels.find(l => l.level_number === userProgress.current_level);
      const nextLevel = levels.find(l => l.level_number > userProgress.current_level);
      
      if (currentLevel && nextLevel) {
        const xpNeeded = nextLevel.xp_required - currentLevel.xp_required;
        const xpProgress = userProgress.current_xp - currentLevel.xp_required;
        setNextLevelXp(xpNeeded);
        setXpProgress((xpProgress / xpNeeded) * 100);
      }
    }
  }, [userProgress, levels]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Level {userProgress?.current_level || 1}</h2>
        </div>
        <div className="w-full max-w-md mb-2">
          <Progress value={xpProgress} className="h-2" />
        </div>
        <p className="text-sm text-muted-foreground">
          {userProgress?.current_xp || 0} / {nextLevelXp} XP to next level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyRewards?.map((reward) => (
          <div
            key={reward.case_id}
            className="bg-card rounded-lg p-6 flex flex-col items-center"
          >
            <div className="mb-4">
              <img
                src={reward.case.image_url}
                alt={reward.case.name}
                className="w-32 h-32 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{reward.case.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-primary" />
              <span>Level {reward.level_required} Required</span>
            </div>
            <Button
              onClick={handleClaimReward}
              disabled={userProgress?.current_level < reward.level_required}
            >
              <Gift className="mr-2" />
              Claim Daily Reward
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};