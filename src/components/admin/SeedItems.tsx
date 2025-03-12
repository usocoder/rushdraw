
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
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('seed-case-items', {
        method: 'POST'
      });
      
      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Items have been added to the database.',
      });
      
      console.log('Seed result:', data);
      
      // Reload the page after 2 seconds to see new items
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error seeding items:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add items to the database. Check the console for details.',
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
