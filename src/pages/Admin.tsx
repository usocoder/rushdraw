import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TransactionApprovals } from "@/components/admin/TransactionApprovals";
import { X, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is admin
  const { data: userRole, isLoading: isCheckingRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!isCheckingRole && (!user || userRole?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, isCheckingRole, navigate]);

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      console.log('Looking up user with identifier:', identifier);
      
      // Check if the identifier is a UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const isUUID = uuidRegex.test(identifier);

      console.log('Is UUID?', isUUID);

      // First try to find the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq(isUUID ? 'id' : 'username', identifier)
        .maybeSingle();

      console.log('Profile lookup result:', { profileData, profileError });

      if (profileError) {
        console.error('Error checking profile:', profileError);
        throw new Error('Failed to verify user');
      }

      if (!profileData) {
        throw new Error('User not found. Please check the username or ID and try again.');
      }

      // Create a completed deposit transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: profileData.id,
          type: 'deposit',
          amount: Number(amount),
          status: 'completed'
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        throw new Error('Failed to process transaction');
      }

      toast({
        title: "Balance Added",
        description: `Successfully added $${amount} to ${profileData.username || profileData.id}'s balance`,
      });

      // Reset form
      setIdentifier("");
      setAmount("");
    } catch (error: any) {
      console.error('Error adding balance:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add balance",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCheckingRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigate('/admin/cases')}>
            Manage Cases
          </Button>
          <Button onClick={() => navigate('/admin/items')}>
            Manage Items
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Add Balance Form */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-2xl font-bold mb-4">Add Balance</h2>
        <form onSubmit={handleAddBalance} className="space-y-4">
          <div>
            <Label htmlFor="identifier">Username or User ID</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter username or user ID..."
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={isProcessing || !identifier || !amount}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Add Balance
              </>
            )}
          </Button>
        </form>
      </div>

      <TransactionApprovals />
    </div>
  );
};

export default Admin;