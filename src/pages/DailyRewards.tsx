
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Gift, Trophy, Star, Clock, ArrowLeft, Lock } from "lucide-react";
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

const REWARD_LEVELS = [5, 10, 20, 30, 50, 70, 80, 90, 100];

const DailyRewards = () => {
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshBalance } = useBalance();
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [nextLevelXp, setNextLevelXp] = useState<number>(0);
  const [xpProgress, setXpProgress] = useState<number>(0);
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
      <div className="container mx-auto px-4 py-8 text-center">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        <p className="text-muted-foreground">Please login to view rewards</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 py-8">
      <div className="container mx-auto px-4">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Daily Rewards</h1>
          
          <div className="w-full max-w-lg bg-card p-6 rounded-lg shadow-lg border border-accent/30 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <h2 className="text-2xl font-bold">Level {userProgress?.current_level || 1}</h2>
                <p className="text-sm text-muted-foreground">
                  {userProgress?.current_xp || 0} / {(userProgress?.current_xp || 0) + nextLevelXp} XP
                </p>
              </div>
            </div>
            
            <Progress value={xpProgress} className="h-2 mb-4" />
            
            {timeRemaining && (
              <div className="flex items-center gap-2 bg-accent/20 p-3 rounded-md">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Cooldown Active</p>
                  <p className="text-sm text-muted-foreground">Next reward in: {timeRemaining}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Display today's reward */}
        {dailyRewards?.find(reward => reward.level_required <= (userProgress?.current_level || 1)) && (
          <div className="bg-card rounded-lg p-6 border border-accent/20 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">Today's Reward</h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <img
                  src={dailyRewards.find(reward => reward.level_required <= (userProgress?.current_level || 1))?.case.image_url}
                  alt={dailyRewards.find(reward => reward.level_required <= (userProgress?.current_level || 1))?.case.name}
                  className="w-40 h-40 object-contain"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold mb-2">
                  {dailyRewards.find(reward => reward.level_required <= (userProgress?.current_level || 1))?.case.name}
                </h3>
                <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Unlocked at Level {dailyRewards.find(reward => 
                    reward.level_required <= (userProgress?.current_level || 1))?.level_required}</span>
                </div>
                <Button
                  onClick={handleClaimReward}
                  disabled={!!timeRemaining}
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Gift className="mr-2 h-5 w-5" />
                  {timeRemaining ? 'Claim in ' + timeRemaining : "Claim Daily Reward"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-6 text-center">Level Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {itemRewards.map((reward) => {
            const isUnlocked = (userProgress?.current_level || 1) >= reward.level;
            const isClaimed = claimedRewards.has(reward.level);
            
            return (
              <div
                key={reward.level}
                className={`bg-card rounded-lg p-6 flex flex-col items-center border transition-all ${
                  isUnlocked ? 'border-accent/40 hover:border-accent/60 shadow-md' : 'border-accent/10 opacity-80'
                } ${isClaimed ? 'opacity-70' : ''}`}
              >
                <div className="mb-4 relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <Star className={`h-16 w-16 ${isClaimed ? 'text-gray-400' : 'text-yellow-500'}`} />
                  </div>
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                      <Lock className="h-12 w-12 text-muted-foreground" />
                    </div>
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
                  className={isUnlocked && !isClaimed ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" : ""}
                >
                  <Gift className="mr-2 h-4 w-4" />
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
        
        <h2 className="text-2xl font-bold mb-6 text-center">Daily Case Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dailyRewards?.map((reward) => {
            const isUnlocked = (userProgress?.current_level || 1) >= reward.level_required;
            
            return (
              <div
                key={reward.level_required}
                className={`bg-card rounded-lg p-6 flex flex-col items-center border transition-all ${
                  isUnlocked ? 'border-accent/40 hover:border-accent/60 shadow-md' : 'border-accent/10 opacity-80'
                }`}
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
                <h3 className="text-lg font-semibold mb-2">
                  {reward.case.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Level {reward.level_required} Required</span>
                </div>
                <Button
                  onClick={handleClaimReward}
                  disabled={!isUnlocked || !!timeRemaining}
                  variant={isUnlocked ? "default" : "outline"}
                  className={isUnlocked ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  {!isUnlocked 
                    ? `Unlock at Level ${reward.level_required}` 
                    : timeRemaining 
                      ? "Cooldown Active" 
                      : "Claim Reward"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyRewards;
