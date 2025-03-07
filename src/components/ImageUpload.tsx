import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      const formData = new FormData();
      formData.append('file', file);

      const { data: functionData } = await supabase.functions.invoke('upload-case-image', {
        body: formData,
      });

      if (functionData?.url) {
        onUploadComplete(functionData.url);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image",
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
      >
        {isUploading ? 'Uploading...' : 'Choose Image'}
      </Button>
    </div>
  );
};