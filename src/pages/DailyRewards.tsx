import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useBalance } from "@/contexts/BalanceContext";
import { useNavigate } from "react-router-dom";
import { Gift, Trophy, Star, Clock, ArrowLeft, TrendingUp, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CaseGrid } from "@/components/CaseGrid";
import { 
  getMaxRewardValue, 
  getRewardTier, 
  getRewardTierClass, 
  formatRewardValue, 
  calculateRewardAmount,
  getProgressToNextLevel,
  getXpRequiredForLevel
} from "@/utils/rewardUtils";

const DailyRewards = () => {
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createTransaction } = useBalance();
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const { data: userProgress, refetch: refetchProgress } = useQuery({
    queryKey: ['userProgressRewards', user?.id],
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
          .insert([{ user_id: user.id, current_level: 1, current_xp: 0 }])
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

  const { data: dailyRewards } = useQuery({
    queryKey: ['dailyRewardsPage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_rewards')
        .select(`
          level_required,
          case_id,
          case:cases (
            name,
            image_url,
            price
          )
        `)
        .order('level_required', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
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

  useEffect(() => {
    if (!userProgress?.last_reward_claim) {
      setTimeRemaining(null);
      return;
    }

    const calculateTimeRemaining = () => {
      const lastClaim = new Date(userProgress.last_reward_claim);
      const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000); // 24 hours
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
        .rpc('claim_daily_reward', { user_id: user.id });

      if (error) throw error;

      if (data[0].success) {
        const currentLevel = userProgress?.current_level || 1;
        const rewardAmount = calculateRewardAmount(currentLevel);
        
        await createTransaction('level_reward', rewardAmount);
        
        toast({
          title: `${getRewardTier(currentLevel)} Reward Claimed!`,
          description: `You received a case and ${formatRewardValue(rewardAmount)} coins!`,
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
      <div className="container mx-auto p-8 text-center">
        <p className="text-lg text-muted-foreground">Please login to view rewards</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const currentLevel = userProgress?.current_level || 1;
  const currentXp = userProgress?.current_xp || 0;
  const nextLevelXp = nextLevel?.xp_required || getXpRequiredForLevel(currentLevel + 1);
  const eligibleRewards = dailyRewards?.filter(reward => reward.level_required <= currentLevel) || [];
  const highestReward = eligibleRewards.length > 0 
    ? eligibleRewards.reduce((prev, current) => 
        prev.level_required > current.level_required ? prev : current
      ) 
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <h1 className={`text-2xl font-bold ${getRewardTierClass(currentLevel)}`}>
            Level {currentLevel} - {getRewardTier(currentLevel)} Rewards
          </h1>
        </div>
        
        <div className="w-[80px]"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current XP: {currentXp.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">Next Level: {nextLevelXp.toLocaleString()} XP</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <p className="text-xs text-center mt-1 text-muted-foreground">
              {Math.round(progressPercent)}% to Level {currentLevel + 1}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg">
              <div className={`text-4xl font-bold mb-2 ${getRewardTierClass(currentLevel)}`}>
                {formatRewardValue(getMaxRewardValue(currentLevel))}
              </div>
              <div className="text-sm text-center text-muted-foreground mb-2">
                Maximum potential reward
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className={`h-4 w-4 ${getRewardTierClass(currentLevel)}`} />
                <span className={getRewardTierClass(currentLevel)}>
                  {getRewardTier(currentLevel)} Tier
                </span>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Daily Rewards
              </h2>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  Claim your daily reward once every 24 hours and receive:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                  <li>A free case based on your level</li>
                  <li>Coins reward scaled to your level tier ({getRewardTier(currentLevel)})</li>
                  <li>XP to help you level up faster</li>
                </ul>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {timeRemaining ? (
                    <div className="flex items-center text-amber-500 gap-1 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Next claim in: {timeRemaining}</span>
                    </div>
                  ) : (
                    <div className="text-green-500 text-sm mb-1">
                      Ready to claim!
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleClaimReward} 
                  disabled={!!timeRemaining || eligibleRewards.length === 0}
                  className={`${!timeRemaining && eligibleRewards.length > 0 ? 'bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800' : ''}`}
                  size="lg"
                >
                  {timeRemaining ? `Cooldown: ${timeRemaining}` : 
                   eligibleRewards.length === 0 ? "No rewards available" : 
                   "Claim Daily Reward"}
                </Button>
              </div>
              
              {eligibleRewards.length === 0 && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <p className="text-sm text-amber-500">
                    No rewards found for your level. Please contact an administrator to set up rewards.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {highestReward && (
          <div className="bg-card rounded-lg p-6 border border-accent/20 shadow-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Current Case Reward</h3>
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <img
                  src={highestReward.case.image_url}
                  alt={highestReward.case.name}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold mb-2">{highestReward.case.name}</h3>
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Unlocked at Level {highestReward.level_required}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Case Value: ${highestReward.case.price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-card rounded-lg p-6 border border-accent/20">
          <h3 className="text-lg font-semibold mb-4">Reward Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg border border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-amber-500" />
                <h4 className="font-medium text-amber-500">Legendary (Level 90+)</h4>
              </div>
              <p className="text-sm text-muted-foreground">Up to $80,000</p>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-purple-500" />
                <h4 className="font-medium text-purple-500">Epic (Level 70-89)</h4>
              </div>
              <p className="text-sm text-muted-foreground">Up to $70,000</p>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium text-blue-500">Rare (Level 50-69)</h4>
              </div>
              <p className="text-sm text-muted-foreground">Up to $50,000</p>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-green-500" />
                <h4 className="font-medium text-green-500">Uncommon (Level 30-49)</h4>
              </div>
              <p className="text-sm text-muted-foreground">Up to $30,000</p>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-gray-300" />
                <h4 className="font-medium text-gray-300">Common (Level 1-29)</h4>
              </div>
              <p className="text-sm text-muted-foreground">Up to $10,000</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-4">Browse All Cases</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore our premium collection of cases ranging from budget to exclusive. 
          Open cases to win fantastic rewards!
        </p>
        <CaseGrid />
      </div>
    </div>
  );
};

export default DailyRewards;
