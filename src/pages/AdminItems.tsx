
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Pencil, Trash } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { BulkAddItems } from "@/components/admin/BulkAddItems";
import { SeedItems } from "@/components/admin/SeedItems";

const AdminItems = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const { toast } = useToast();

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

  // Fetch all items
  const { data: items, isLoading: isLoadingItems, refetch } = useQuery({
    queryKey: ['admin-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_items')
        .select('*, cases(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!isCheckingRole && (!user || userRole?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, isCheckingRole, navigate]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('case_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Item deleted successfully",
    });
    refetch();
  };

  if (isCheckingRole || isLoadingItems) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Button onClick={() => navigate('/admin/items/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Sample Items (Edge Function)</CardTitle>
          </CardHeader>
          <CardContent>
            <SeedItems />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bulk Add Items by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <BulkAddItems />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Items</h2>
      <div className="grid gap-6">
        {items?.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">{item.name}</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate(`/admin/items/${item.id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Value</p>
                  <p className="text-2xl font-bold">${item.value}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Odds</p>
                  <p className="text-2xl font-bold">{(item.odds * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rarity</p>
                  <p className="text-lg">{item.rarity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Case</p>
                  <p className="text-lg">{item.cases?.name || 'No case'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminItems;
