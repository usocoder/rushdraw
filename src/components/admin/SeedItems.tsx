
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export const SeedItems = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSeedItems = async () => {
    setIsLoading(true);
    
    try {
      console.log('Calling seed-case-items function...');
      
      const { data, error } = await supabase.functions.invoke('seed-case-items');
      
      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }
      
      console.log('Seed result:', data);
      
      if (data?.success) {
        toast({
          title: 'Success',
          description: `Added ${data.totalItemsAdded} items across ${Object.keys(data.itemsAddedPerCase || {}).length} cases.`,
          duration: 5000,
        });
      } else {
        throw new Error(data?.message || 'Failed to add items');
      }
    } catch (error) {
      console.error('Error seeding items:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add items. Check the console for details.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSeedItems} 
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding Items...
        </>
      ) : (
        'Add Sample Items'
      )}
    </Button>
  );
};
