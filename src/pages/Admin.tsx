import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();

  // Check if user is admin
  const { data: userRole, isLoading } = useQuery({
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
    if (!isLoading && (!user || userRole?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-card rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Cases Management</h2>
          <div className="space-y-4">
            <Button className="w-full" onClick={() => navigate('/admin/cases/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Case
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/admin/cases')}
            >
              View All Cases
            </Button>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Items Management</h2>
          <div className="space-y-4">
            <Button className="w-full" onClick={() => navigate('/admin/items/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Item
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/admin/items')}
            >
              View All Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;