import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, Pencil, Trash, Save, X } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ImageUpload";

interface EditingCase {
  id: string;
  name: string;
  price: number;
  best_drop: string;
  category: string;
  image_url: string;
}

const AdminCases = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const [editingCase, setEditingCase] = useState<EditingCase | null>(null);

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

  // Fetch all cases
  const { data: cases, isLoading: isLoadingCases, refetch } = useQuery({
    queryKey: ['admin-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
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
      .from('cases')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete case",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Case deleted successfully",
    });
    refetch();
  };

  const handleEdit = (case_: any) => {
    setEditingCase({
      id: case_.id,
      name: case_.name,
      price: case_.price,
      best_drop: case_.best_drop,
      category: case_.category,
      image_url: case_.image_url,
    });
  };

  const handleCancelEdit = () => {
    setEditingCase(null);
  };

  const handleSaveEdit = async () => {
    if (!editingCase) return;

    const { error } = await supabase
      .from('cases')
      .update({
        name: editingCase.name,
        price: editingCase.price,
        best_drop: editingCase.best_drop,
        category: editingCase.category,
        image_url: editingCase.image_url,
      })
      .eq('id', editingCase.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update case",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Case updated successfully",
    });
    setEditingCase(null);
    refetch();
  };

  const handleImageUpload = (url: string) => {
    if (editingCase) {
      setEditingCase({ ...editingCase, image_url: url });
    }
  };

  if (isCheckingRole || isLoadingCases) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Button onClick={() => navigate('/admin/cases/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Case
        </Button>
      </div>

      <div className="grid gap-6">
        {cases?.map((case_) => (
          <Card key={case_.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {editingCase?.id === case_.id ? (
                <Input
                  value={editingCase.name}
                  onChange={(e) => setEditingCase({ ...editingCase, name: e.target.value })}
                  className="text-2xl font-bold"
                />
              ) : (
                <CardTitle className="text-2xl font-bold">{case_.name}</CardTitle>
              )}
              <div className="flex gap-2">
                {editingCase?.id === case_.id ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleSaveEdit}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEdit(case_)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(case_.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {editingCase?.id === case_.id ? (
                  <>
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <Input
                        type="number"
                        value={editingCase.price}
                        onChange={(e) => setEditingCase({ ...editingCase, price: parseFloat(e.target.value) })}
                        className="text-2xl font-bold"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Best Drop</p>
                      <Input
                        value={editingCase.best_drop}
                        onChange={(e) => setEditingCase({ ...editingCase, best_drop: e.target.value })}
                        className="text-2xl font-bold"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <Input
                        value={editingCase.category}
                        onChange={(e) => setEditingCase({ ...editingCase, category: e.target.value })}
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Image</p>
                      <ImageUpload onUploadComplete={handleImageUpload} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-2xl font-bold">${case_.price}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Best Drop</p>
                      <p className="text-2xl font-bold">{case_.best_drop}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-lg">{case_.category}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCases;