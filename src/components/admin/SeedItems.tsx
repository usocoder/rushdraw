
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
      
      // Call the Supabase Edge Function with minimal configuration
      const { data, error } = await supabase.functions.invoke('seed-case-items');
      
      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }
      
      console.log('Seed result:', data);
      
      toast({
        title: 'Success',
        description: `Items added successfully.`,
      });
    } catch (error) {
      console.error('Error seeding items:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add items. This may be due to a Supabase project configuration issue.',
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
