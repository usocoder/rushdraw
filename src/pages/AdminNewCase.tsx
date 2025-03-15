
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImageOff } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { validateImageUrl, formatImageUrl, checkImageExists } from "@/utils/imageUtils";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  
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

  // Check image validity when URL changes
  useEffect(() => {
    if (!imageUrl) {
      setImageLoaded(false);
      return;
    }

    const checkImage = async () => {
      setIsCheckingImage(true);
      try {
        const formattedUrl = formatImageUrl(imageUrl);
        console.log("Checking image URL:", formattedUrl);
        const exists = await checkImageExists(formattedUrl);
        setImageLoaded(exists);
        if (exists && formattedUrl !== imageUrl) {
          setValue('image_url', formattedUrl);
        }
      } catch (error) {
        console.error("Error checking image:", error);
        setImageLoaded(false);
      } finally {
        setIsCheckingImage(false);
      }
    };

    checkImage();
  }, [imageUrl, setValue]);

  const onSubmit = async (data: FormData) => {
    // Make sure we have the image URL
    if (!data.image_url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide an image URL for the case",
      });
      return;
    }

    // Format and validate the image URL
    const formattedUrl = formatImageUrl(data.image_url);
    
    // Log the image URL for debugging
    console.log("Submitting case with image URL:", formattedUrl);

    const { error } = await supabase
      .from('cases')
      .insert([{
        name: data.name,
        price: Number(data.price),
        image_url: formattedUrl,
        category: data.category
      }]);

    if (error) {
      console.error("Case creation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create case: " + error.message,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Case created successfully",
    });
    navigate('/admin/cases');
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imageUrl);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl);
    setImageLoaded(false);
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
              <Label htmlFor="image_url">Image URL</Label>
              <Input 
                id="image_url"
                type="url"
                placeholder="https://example.com/image.png"
                {...register("image_url", { 
                  required: "Image URL is required",
                  pattern: {
                    value: /^(https?:\/\/)/i,
                    message: "Must be a valid URL starting with http:// or https://"
                  }
                })}
              />
              {errors.image_url && (
                <p className="text-sm text-red-500">{errors.image_url.message}</p>
              )}
              
              {imageUrl && (
                <div className="mt-4">
                  <div className="relative border border-gray-200 rounded-md p-2 bg-gray-50">
                    {isCheckingImage ? (
                      <div className="h-40 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Checking image...</p>
                        </div>
                      </div>
                    ) : imageLoaded ? (
                      <img 
                        src={formatImageUrl(imageUrl)}
                        alt="Case preview" 
                        className="h-40 w-auto object-contain mx-auto"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center">
                        <div className="text-center">
                          <ImageOff className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">
                            Image preview not available.
                            <br />Please check your URL.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
