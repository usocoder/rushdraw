import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TransactionApprovals } from "@/components/admin/TransactionApprovals";
import { X } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();

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

      <TransactionApprovals />
    </div>
  );
};

export default Admin;