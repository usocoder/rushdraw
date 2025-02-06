import { useEffect } from "react";
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
import { ArrowLeft, X } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import { ImageUpload } from "@/components/ImageUpload";

interface FormData {
  name: string;
  value: number;
  odds: number;
  multiplier: number;
  rarity: string;
  image_url: string;
  case_id: string;
}

const AdminNewItem = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>();

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

  const onSubmit = async (data: FormData) => {
    // Convert odds from percentage to decimal
    const oddsDecimal = Number(data.odds) / 100;

    const { error } = await supabase
      .from('case_items')
      .insert({
        ...data,
        value: Number(data.value),
        odds: oddsDecimal, // Store as decimal in database
        multiplier: Number(data.multiplier),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create item",
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

  if (isCheckingRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="outline" onClick={() => navigate('/admin/items')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Items
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Label htmlFor="multiplier">Multiplier</Label>
              <Input 
                id="multiplier"
                type="number"
                step="0.01"
                {...register("multiplier", { 
                  required: "Multiplier is required",
                  min: { value: 0, message: "Multiplier must be positive" }
                })}
              />
              {errors.multiplier && (
                <p className="text-sm text-red-500">{errors.multiplier.message}</p>
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
              <ImageUpload onUploadComplete={(url) => setValue('image_url', url)} />
              {errors.image_url && (
                <p className="text-sm text-red-500">{errors.image_url.message}</p>
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

            <Button type="submit">Create Item</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewItem;