import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, Link, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useToast } from "./ui/use-toast";

export const ReferralManager = () => {
  const [referralCode, setReferralCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [referralStats, setReferralStats] = useState<{
    timesUsed: number;
    totalEarnings: number;
  } | null>(null);
  const { user } = useBrowserAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchReferralCode();
      fetchReferralStats();
    }
  }, [user]);

  const fetchReferralCode = async () => {
    const { data, error } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) {
      setReferralCode(data.code);
    }
  };

  const fetchReferralStats = async () => {
    const { data, error } = await supabase
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
    
    setIsGenerating(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Referral Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <Button 
            onClick={generateReferralCode} 
            disabled={isGenerating}
            className="w-full"
          >
            <Link className="mr-2 h-4 w-4" />
            Generate Referral Code
          </Button>
        )}
      </CardContent>
    </Card>
  );
};