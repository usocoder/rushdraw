import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Users, Link, DollarSign, Percent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "./ui/use-toast";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReferralStatsModal = ({ isOpen, onOpenChange }: Props) => {
  const [referralCode, setReferralCode] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [referralStats, setReferralStats] = useState<{
    timesUsed: number;
    totalEarnings: number;
  } | null>(null);
  const [commissionTiers, setCommissionTiers] = useState<{
    wager_requirement: number;
    commission_rate: number;
  }[]>([]);
  const [userWagered, setUserWagered] = useState(0);
  const { user } = useBrowserAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchReferralCode();
      fetchReferralStats();
      fetchCommissionTiers();
      fetchUserWagered();
    }
  }, [user]);

  const fetchUserWagered = async () => {
    if (!user) return;

    try {
      // First try to get existing profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('total_wagered')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (profile) {
        setUserWagered(profile.total_wagered || 0);
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            total_wagered: 0
          }])
          .select('total_wagered')
          .single();
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }

        if (newProfile) {
          setUserWagered(newProfile.total_wagered || 0);
        }
      }
    } catch (error) {
      console.error('Error managing profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wagering information",
        variant: "destructive",
      });
    }
  };

  const fetchCommissionTiers = async () => {
    const { data } = await supabase
      .from('commission_tiers')
      .select('*')
      .order('wager_requirement', { ascending: true });
    
    if (data) {
      setCommissionTiers(data);
    }
  };

  const fetchReferralCode = async () => {
    const { data } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) {
      setReferralCode(data.code);
    }
  };

  const fetchReferralStats = async () => {
    const { data } = await supabase
      .from('referral_codes')
      .select('times_used, total_earnings')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) {
      setReferralStats({
        timesUsed: data.times_used,
        totalEarnings: data.total_earnings,
      });
    }
  };

  const generateReferralCode = async () => {
    if (!user) return;
    
    if (customCode) {
      // Check if custom code already exists
      const { data: existingCode } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('code', customCode.toUpperCase())
        .maybeSingle();

      if (existingCode) {
        toast({
          title: "Error",
          description: "This code is already taken. Please try another one.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsGenerating(true);
    try {
      const code = customCode ? customCode.toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { error } = await supabase
        .from('referral_codes')
        .insert({
          user_id: user.id,
          code,
        });

      if (error) throw error;

      setReferralCode(code);
      toast({
        title: "Success!",
        description: "Your referral code has been generated.",
      });
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast({
        title: "Error",
        description: "Failed to generate referral code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const getCurrentCommissionRate = () => {
    const tier = commissionTiers
      .filter(tier => tier.wager_requirement <= userWagered)
      .sort((a, b) => b.wager_requirement - a.wager_requirement)[0];
    return tier ? tier.commission_rate : 0.10;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Referral Program</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {referralCode ? (
            <>
              <div className="flex gap-2">
                <Input value={referralCode} readOnly className="font-mono" />
                <Button onClick={copyToClipboard}>Copy</Button>
              </div>
              {referralStats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Used {referralStats.timesUsed} times
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Earned ${referralStats.totalEarnings.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Input
                  placeholder="Enter custom code (optional)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  maxLength={8}
                />
              </div>
              <Button 
                onClick={generateReferralCode} 
                disabled={isGenerating}
                className="w-full"
              >
                <Link className="mr-2 h-4 w-4" />
                Generate Referral Code
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Commission Tiers</h3>
            <div className="space-y-2">
              {commissionTiers.map((tier) => (
                <div
                  key={tier.wager_requirement}
                  className={`flex items-center justify-between p-2 rounded ${
                    tier.wager_requirement <= userWagered
                      ? 'bg-primary/10'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    <span>
                      {(tier.commission_rate * 100).toFixed(0)}% Commission
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Wager ${tier.wager_requirement.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Current commission rate: {(getCurrentCommissionRate() * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Total wagered: ${userWagered.toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};