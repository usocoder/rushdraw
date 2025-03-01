
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Gift, Trophy, Star, Clock, Package, DollarSign, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useBalance } from "@/contexts/BalanceContext";

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

interface ItemReward {
  level: number;
  minAmount: number;
  maxAmount: number;
  description: string;
}

export const RewardsSection = () => {
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshBalance } = useBalance();
  const [nextLevelXp, setNextLevelXp] = useState<number>(0);
  const [xpProgress, setXpProgress] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [claimedRewards, setClaimedRewards] = useState<Set<number>>(new Set());

  // Define item rewards with increasing value by level
  const itemRewards: ItemReward[] = [
    { level: 5, minAmount: 0.1, maxAmount: 10, description: "Basic Reward" },
    { level: 10, minAmount: 0.5, maxAmount: 15, description: "Bronze Reward" },
    { level: 20, minAmount: 1, maxAmount: 25, description: "Silver Reward" },
    { level: 30, minAmount: 3, maxAmount: 40, description: "Gold Reward" },
    { level: 50, minAmount: 5, maxAmount: 60, description: "Platinum Reward" },
    { level: 70, minAmount: 10, maxAmount: 100, description: "Diamond Reward" },
    { level: 80, minAmount: 15, maxAmount: 150, description: "Master Reward" },
    { level: 90, minAmount: 25, maxAmount: 200, description: "Elite Reward" },
    { level: 100, minAmount: 50, maxAmount: 300, description: "Legendary Reward" },
  ];

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

  // Load claimed rewards from localStorage to persist between sessions
  useEffect(() => {
    if (user) {
      const savedClaims = localStorage.getItem(`claimed_rewards_${user.id}`);
      if (savedClaims) {
        try {
          const parsed = JSON.parse(savedClaims);
          setClaimedRewards(new Set(parsed));
        } catch (e) {
          console.error("Error parsing claimed rewards from localStorage:", e);
        }
      }
    }
  }, [user]);

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

  // Update time remaining every second for the cooldown timer
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

  const handleClaimItemReward = async (reward: ItemReward) => {
    if (!user) return;
    
    // Check if already claimed
    if (claimedRewards.has(reward.level)) {
      toast({
        title: "Already Claimed",
        description: `You've already claimed the Level ${reward.level} reward.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Generate a random reward amount between min and max
      const rewardAmount = Math.random() * (reward.maxAmount - reward.minAmount) + reward.minAmount;
      const roundedAmount = Math.round(rewardAmount * 100) / 100; // Round to 2 decimal places
      
      // Create a transaction to add the reward to user's balance
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'level_reward',
          amount: roundedAmount,
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Mark as claimed in local state and localStorage
      const newClaimedSet = new Set(claimedRewards);
      newClaimedSet.add(reward.level);
      setClaimedRewards(newClaimedSet);
      
      localStorage.setItem(
        `claimed_rewards_${user.id}`, 
        JSON.stringify([...newClaimedSet])
      );
      
      // Refresh the user's balance
      await refreshBalance();
      
      toast({
        title: "Reward Claimed!",
        description: `You received $${roundedAmount.toFixed(2)} for reaching Level ${reward.level}!`,
      });
    } catch (error) {
      console.error('Error claiming item reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim level reward",
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

  // Find eligible reward based on user level
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

        <div className="flex flex-col items-center">
          <Button 
            onClick={() => navigate('/rewards')} 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
          >
            <Gift className="h-5 w-5" /> Daily Rewards
          </Button>
          {timeRemaining && (
            <div className="mt-2 flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Next claim in: {timeRemaining}</span>
            </div>
          )}
        </div>
      </div>

      {eligibleReward && (
        <div className="bg-card rounded-lg p-6 border border-accent/20 shadow-lg">
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
              <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Unlocked at Level {eligibleReward.level_required}</span>
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

      <h2 className="text-2xl font-bold mt-10 mb-6 text-center">Level Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {itemRewards.map((reward) => {
          const isUnlocked = (userProgress?.current_level || 0) >= reward.level;
          const isClaimed = claimedRewards.has(reward.level);
          
          return (
            <div
              key={reward.level}
              className={`bg-card rounded-lg p-6 flex flex-col items-center border border-accent/20 ${isUnlocked ? 'hover:border-accent/40' : ''} transition-colors shadow-md ${isClaimed ? 'opacity-70' : ''}`}
            >
              <div className="mb-4 relative w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                {isUnlocked ? (
                  <DollarSign className={`h-12 w-12 ${isClaimed ? 'text-gray-400' : 'text-green-500'}`} />
                ) : (
                  <Lock className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{reward.description}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-primary" />
                <span>Level {reward.level} Required</span>
              </div>
              <p className="text-center text-muted-foreground mb-4">
                ${reward.minAmount.toFixed(2)} - ${reward.maxAmount.toFixed(0)} Cash Reward
              </p>
              <Button
                onClick={() => handleClaimItemReward(reward)}
                disabled={!isUnlocked || isClaimed}
                variant={isUnlocked && !isClaimed ? "default" : "outline"}
                className={isUnlocked && !isClaimed ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {!isUnlocked 
                  ? `Unlock at Level ${reward.level}` 
                  : isClaimed 
                    ? "Already Claimed" 
                    : "Claim Cash Reward"}
              </Button>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-6 text-center">Daily Case Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {dailyRewards?.map((reward) => {
          const isUnlocked = (userProgress?.current_level || 0) >= reward.level_required;
          return (
            <div
              key={reward.case_id}
              className="bg-card rounded-lg p-6 flex flex-col items-center border border-accent/20 hover:border-accent/40 transition-colors"
            >
              <div className="mb-4 relative">
                <img
                  src={reward.case.image_url}
                  alt={reward.case.name}
                  className="w-32 h-32 object-contain"
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                    <Lock className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{reward.case.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-primary" />
                <span>Level {reward.level_required} Required</span>
              </div>
              <Button
                onClick={handleClaimReward}
                disabled={!isUnlocked || !!timeRemaining}
                variant={isUnlocked ? "default" : "outline"}
              >
                <Gift className="mr-2 h-4 w-4" />
                {!isUnlocked 
                  ? `Unlock at Level ${reward.level_required}` 
                  : timeRemaining 
                    ? `Cooldown: ${timeRemaining}` 
                    : "Claim Daily Reward"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
