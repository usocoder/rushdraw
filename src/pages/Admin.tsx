
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TransactionApprovals } from "@/components/admin/TransactionApprovals";
import { SeedItems } from "@/components/admin/SeedItems";
import { X, ShoppingBag, Info, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the admin panel",
          variant: "destructive",
        });
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate, toast]);

  // Set loading to false after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading admin panel...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Admin Panel</AlertTitle>
        <AlertDescription>
          This panel is accessible to all logged-in users.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button onClick={() => navigate('/admin/cases')}>
          Manage Cases
        </Button>
        <Button onClick={() => navigate('/admin/items')}>
          Manage Items
        </Button>
        <Button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          View Orders
        </Button>
        <SeedItems />
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">Pending Transactions</h2>
        <TransactionApprovals />
      </div>
    </div>
  );
};

export default Admin;
