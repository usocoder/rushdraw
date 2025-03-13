
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRewardSuccessChance } from "@/utils/rewardUtils";

const AdminRewards = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: levels } = useQuery({
    queryKey: ['levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('level_number', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: dailyRewards, refetch: refetchRewards } = useQuery({
    queryKey: ['adminDailyRewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_rewards')
        .select(`
          *,
          case:cases (
            name
          )
        `)
        .order('level_required', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddReward = async () => {
    if (!selectedCase || !selectedLevel) {
      toast({
        title: "Error",
        description: "Please select both a case and a level",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('daily_rewards')
        .insert({
          case_id: selectedCase,
          level_required: parseInt(selectedLevel),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Daily reward added successfully",
      });
      
      refetchRewards();
      setSelectedCase("");
      setSelectedLevel("");
    } catch (error) {
      console.error('Error adding reward:', error);
      toast({
        title: "Error",
        description: "Failed to add daily reward",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReward = async (levelRequired: number) => {
    try {
      const { error } = await supabase
        .from('daily_rewards')
        .delete()
        .eq('level_required', levelRequired);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Daily reward deleted successfully",
      });
      
      refetchRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast({
        title: "Error",
        description: "Failed to delete daily reward",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Daily Rewards</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 mb-8">
        <div className="flex gap-4">
          <select
            className="bg-background border rounded px-3 py-2"
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
          >
            <option value="">Select Case</option>
            {cases?.map((case_) => (
              <option key={case_.id} value={case_.id}>
                {case_.name}
              </option>
            ))}
          </select>

          <select
            className="bg-background border rounded px-3 py-2"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            {levels?.map((level) => (
              <option key={level.id} value={level.level_number}>
                Level {level.level_number}
              </option>
            ))}
          </select>

          <Button onClick={handleAddReward}>Add Reward</Button>
        </div>

        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Daily Rewards</h2>
          
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold">Reward System</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Rewards scale with user level. Higher levels unlock more valuable rewards.
            </p>
            <p className="text-sm text-amber-500 mb-4">
              Use this interface to customize rewards for different user levels
            </p>
          </div>
          
          <div className="space-y-4">
            {dailyRewards?.map((reward) => (
              <div
                key={reward.id}
                className="flex justify-between items-center p-4 bg-background rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">Level {reward.level_required}:</span>{" "}
                  {reward.case.name}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteReward(reward.level_required)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRewards;
