
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
}

export const ImageUpload = ({ onUploadComplete }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size must be less than 5MB",
      });
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File must be JPEG, PNG, or WebP",
      });
      return;
    }

    setIsUploading(true);

    try {
      // First attempt: Try using the edge function
      try {
        const formData = new FormData();
        formData.append('file', file);

        const { data: functionData, error } = await supabase.functions.invoke('upload-case-image', {
          body: formData,
        });

        if (error) {
          throw error;
        }

        if (functionData?.url) {
          onUploadComplete(functionData.url);
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
          setIsUploading(false);
          return;
        }
      } catch (edgeFunctionError) {
        console.error('Edge function upload error:', edgeFunctionError);
        // Continue to fallback upload method
      }

      // Fallback: Direct upload to storage bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('case-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('case-images')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully (direct storage)",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Case Image (Max 5MB, JPEG/PNG/WebP)</Label>
      <input
        type="file"
        id="image"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('image')?.click()}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Choose Image'
        )}
      </Button>
    </div>
  );
};
