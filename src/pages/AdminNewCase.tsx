
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/ImageUpload";

interface FormData {
  name: string;
  price: number;
  image_url: string;
  category: string;
}

const AdminNewCase = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>();
  
  // Watch the image_url value to show preview
  const imageUrl = watch('image_url');

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

  useEffect(() => {
    if (!isLoading && (!user || userRole?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, isLoading, navigate]);

  const onSubmit = async (data: FormData) => {
    // Make sure we have the image URL
    if (!data.image_url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image for the case",
      });
      return;
    }

    const { error } = await supabase
      .from('cases')
      .insert([{
        name: data.name,
        price: Number(data.price),
        image_url: data.image_url,
        category: data.category
      }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create case",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Case created successfully",
    });
    navigate('/admin/cases');
  };

  const handleImageUpload = (url: string) => {
    console.log("Image uploaded:", url);
    setUploadedImageUrl(url);
    setValue('image_url', url, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate('/admin/cases')} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cases
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Case</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price"
                type="number"
                {...register("price", { 
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label>Case Image</Label>
              <ImageUpload onUploadComplete={handleImageUpload} />
              
              {uploadedImageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-green-600 mb-2">Image uploaded successfully</p>
                  <div className="relative border border-gray-200 rounded-md p-2 bg-gray-50">
                    <img 
                      src={uploadedImageUrl} 
                      alt="Case preview" 
                      className="h-40 w-auto object-contain mx-auto" 
                    />
                  </div>
                </div>
              )}
              
              <input 
                type="hidden"
                {...register("image_url", { required: "Image URL is required" })}
              />
              {errors.image_url && (
                <p className="text-sm text-red-500">{errors.image_url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category"
                {...register("category", { required: "Category is required" })}
              />
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Case
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewCase;
