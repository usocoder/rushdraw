
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
import { getLevelColor } from "@/utils/rewardUtils";
import { LiveDropsModal } from "@/components/LiveDropsModal";

export const RewardsSection = () => {
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showLiveDrops, setShowLiveDrops] = useState(false);
  const [isRewardsVisible, setIsRewardsVisible] = useState(false);

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

  const toggleRewards = () => {
    setIsRewardsVisible(!isRewardsVisible);
  };

  const handleOpenLiveDrops = () => {
    setShowLiveDrops(true);
  };

  const rewardTiers = [
    { name: "Legendary", level: 90, maxAmount: 80000, color: "text-amber-500" },
    { name: "Epic", level: 70, maxAmount: 70000, color: "text-purple-500" },
    { name: "Rare", level: 50, maxAmount: 50000, color: "text-blue-500" },
    { name: "Uncommon", level: 30, maxAmount: 30000, color: "text-green-500" },
    { name: "Common", level: 10, maxAmount: 10000, color: "text-gray-300" },
    { name: "Starter", level: 1, maxAmount: 1000, color: "text-gray-400" }
  ];

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please login to view rewards</p>
      </div>
    );
  }

  const currentLevel = userProgress?.current_level || 1;
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
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button 
                onClick={() => navigate('/rewards')} 
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800"
              >
                <Gift className="h-5 w-5" /> View All Rewards <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="text-sm text-amber-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>New rewards every 24 hours</span>
              </div>
              
              {!canClaimReward && userProgress?.last_reward_claim && (
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Next claim available in 24h</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {rewardTiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`p-4 bg-black/20 rounded-lg border border-${tier.color}/30 flex items-center justify-between`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Star className={`h-4 w-4 ${tier.color}`} />
                    <h4 className={`font-medium ${tier.color}`}>{tier.name} (Level {tier.level}+)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Up to ${tier.maxAmount.toLocaleString()}</p>
                </div>
                <div className="flex items-center">
                  {currentLevel >= tier.level ? (
                    canClaimReward ? (
                      <div className="flex items-center bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs">
                        <Check className="h-3 w-3 mr-1" /> Claimable
                      </div>
                    ) : (
                      <div className="flex items-center bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs">
                        <Clock className="h-3 w-3 mr-1" /> Cooldown
                      </div>
                    )
                  ) : (
                    <div className="flex items-center bg-gray-500/20 text-gray-500 px-3 py-1 rounded-full text-xs">
                      <X className="h-3 w-3 mr-1" /> Locked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <LiveDropsModal isOpen={showLiveDrops} onOpenChange={setShowLiveDrops} />
    </div>
  );
};
