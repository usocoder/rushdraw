
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ImageOff } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import { validateImageUrl, formatImageUrl, checkImageExists } from "@/utils/imageUtils";

interface FormData {
  name: string;
  value: number;
  odds: number;
  rarity: string;
  image_url: string;
  case_id: string;
}

const AdminNewItem = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>();
  
  // Watch the image_url to show preview
  const imageUrl = watch('image_url');

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

  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isCheckingRole && (!user || userRole?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, isCheckingRole, navigate]);

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
    // Format and validate the image URL
    const formattedUrl = formatImageUrl(data.image_url);
    
    // Log the image URL for debugging
    console.log("Submitting item with image URL:", formattedUrl);

    const { error } = await supabase
      .from('case_items')
      .insert({
        name: data.name,
        value: Number(data.value),
        odds: Number(data.odds) / 100, // Convert from percentage to decimal
        rarity: data.rarity,
        image_url: formattedUrl,
        case_id: data.case_id,
      });

    if (error) {
      console.error("Item creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create item: " + error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Item created successfully",
    });
    navigate('/admin/items');
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imageUrl);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl);
    setImageLoaded(false);
  };

  if (isCheckingRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate('/admin/items')} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Items
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Item</CardTitle>
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
              <Label htmlFor="value">Value</Label>
              <Input 
                id="value"
                type="number"
                step="0.01"
                {...register("value", { 
                  required: "Value is required",
                  min: { value: 0, message: "Value must be positive" }
                })}
              />
              {errors.value && (
                <p className="text-sm text-red-500">{errors.value.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="odds">Odds (%)</Label>
              <Input 
                id="odds"
                type="number"
                step="0.00001"
                {...register("odds", { 
                  required: "Odds are required",
                  min: { value: 0.00001, message: "Odds must be at least 0.00001%" },
                  max: { value: 100, message: "Odds cannot exceed 100%" }
                })}
              />
              {errors.odds && (
                <p className="text-sm text-red-500">{errors.odds.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rarity">Rarity</Label>
              <Controller
                name="rarity"
                control={control}
                rules={{ required: "Rarity is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.rarity && (
                <p className="text-sm text-red-500">{errors.rarity.message}</p>
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
                        alt="Item preview" 
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
              <Label htmlFor="case_id">Case</Label>
              <Controller
                name="case_id"
                control={control}
                rules={{ required: "Case is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case" />
                    </SelectTrigger>
                    <SelectContent>
                      {cases?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.case_id && (
                <p className="text-sm text-red-500">{errors.case_id.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Item
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewItem;
