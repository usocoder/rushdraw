
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TransactionApprovals } from "@/components/admin/TransactionApprovals";
import { SeedItems } from "@/components/admin/SeedItems";
import { X, ShoppingBag, Info, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const [adminChecked, setAdminChecked] = useState(false);

  // Check if user is admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: async () => {
      if (!user) return false;

      // Check admin_users table first (new admin system)
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (adminError) {
        console.error("Error checking admin status:", adminError);
        return false;
      }
      
      if (adminData) return true;
      
      // Fall back to user_roles table (old admin system)
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (roleError) {
        console.error("Error checking user role:", roleError);
        return false;
      }
      
      return roleData?.role === 'admin';
    },
    enabled: !!user,
    retry: false
  });

  // Set adminChecked to true when query completes
  useEffect(() => {
    if (!isCheckingAdmin) {
      setAdminChecked(true);
    }
  }, [isCheckingAdmin]);

  // Redirect non-admin users
  useEffect(() => {
    if (adminChecked && !isCheckingAdmin) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the admin panel",
          variant: "destructive",
        });
        navigate('/login');
      } else if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "You do not have administrator privileges",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, isCheckingAdmin, adminChecked, navigate, toast]);

  if (isCheckingAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Checking administrator access...</span>
      </div>
    );
  }

  if (!isAdmin || !user) {
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
        <AlertTitle>Admin Access</AlertTitle>
        <AlertDescription>
          This panel is only visible to users with admin privileges. To grant admin access to other users,
          add their user ID to the admin_users table in the database.
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
