
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TransactionApprovals } from "@/components/admin/TransactionApprovals";
import { SeedItems } from "@/components/admin/SeedItems";
import { X, ShoppingBag } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();

  // Check if user is admin
  const { data: userRole, isLoading: isCheckingRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Check admin_users table first (new admin system)
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (adminData) return { role: 'admin' };
      
      // Fall back to user_roles table (old admin system)
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error) return null;
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
          <Button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            View Orders
          </Button>
          <SeedItems />
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">Pending Transactions</h2>
        <TransactionApprovals />
      </div>
    </div>
  );
};

export default Admin;
