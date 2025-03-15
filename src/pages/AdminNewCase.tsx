
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImageOff, ImagePlus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { validateImageUrl, formatImageUrl, checkImageExists, handleImageError } from "@/utils/imageUtils";
import { motion } from "framer-motion";

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
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>();
  
  // Watch the image_url value to show preview
  const imageUrl = watch('image_url');

  // Add animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

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
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to view this page.",
      });
    }
  }, [user, userRole, isLoading, navigate, toast]);

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

    const debounceTimeout = setTimeout(() => {
      checkImage();
    }, 500);

    return () => clearTimeout(debounceTimeout);
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

    try {
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
        className: "bg-accent text-white",
      });
      navigate('/admin/cases');
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/cases')} 
        className="mb-8 group flex items-center gap-2 hover:bg-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Cases
      </Button>

      <Card className="shadow-glow-sm border border-primary/20 glass-card">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-transparent rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ImagePlus className="h-6 w-6 text-primary" />
            Create New Case
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    Case Name
                  </Label>
                  <Input 
                    id="name"
                    className="bg-background/50 border-primary/20 focus:border-primary"
                    placeholder="Enter case name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium flex items-center gap-2">
                    Price
                  </Label>
                  <Input 
                    id="price"
                    type="number"
                    className="bg-background/50 border-primary/20 focus:border-primary"
                    placeholder="Enter price"
                    {...register("price", { 
                      required: "Price is required",
                      min: { value: 0, message: "Price must be positive" }
                    })}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                    Category
                  </Label>
                  <Input 
                    id="category"
                    className="bg-background/50 border-primary/20 focus:border-primary"
                    placeholder="Enter category"
                    {...register("category", { required: "Category is required" })}
                  />
                  {errors.category && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="text-sm font-medium flex items-center gap-2">
                    Image URL
                  </Label>
                  <Input 
                    id="image_url"
                    type="url"
                    className="bg-background/50 border-primary/20 focus:border-primary"
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
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.image_url.message}
                    </p>
                  )}
                </div>
                
                {imageUrl && (
                  <div className="mt-4">
                    <div className="relative border border-primary/20 rounded-md p-3 bg-background/30 backdrop-blur">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center">
                        {imageLoaded ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Image Preview
                          </>
                        ) : (
                          <>
                            {isCheckingImage ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                            )}
                            {isCheckingImage ? "Checking image..." : "Preview not available"}
                          </>
                        )}
                      </p>
                      
                      <div className="h-48 flex items-center justify-center">
                        {isCheckingImage ? (
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                            <p className="text-sm text-muted-foreground">Checking image...</p>
                          </div>
                        ) : imageLoaded ? (
                          <motion.img 
                            src={formatImageUrl(imageUrl)}
                            alt="Case preview" 
                            className="h-40 w-auto object-contain mx-auto rounded-md shadow-glow-sm"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            crossOrigin="anonymous"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <div className="text-center">
                            <ImageOff className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Image preview not available.
                              <br />Please check your URL.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Case</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminNewCase;
