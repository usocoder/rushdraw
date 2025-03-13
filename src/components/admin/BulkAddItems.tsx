
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export const BulkAddItems = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('budget');
  const { toast } = useToast();

  const handleAddItems = async () => {
    setIsLoading(true);
    
    try {
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('id, name, price, category')
        .eq('category', selectedCategory);
        
      if (casesError) throw casesError;
      
      if (!cases || cases.length === 0) {
        toast({
          title: 'No cases found',
          description: `No cases found with category: ${selectedCategory}`,
          variant: 'destructive',
          duration: 5000,
        });
        return;
      }
      
      console.log(`Found ${cases.length} cases to add items to`);
      
      // Define items based on category
      let itemsToAdd = [];
      
      if (selectedCategory === 'premium') {
        itemsToAdd = [
          { name: "Rolex Cosmograph Daytona", value: 50000, odds: 0.0001, rarity: "legendary", image_url: "https://images.pexels.com/photos/9982457/pexels-photo-9982457.jpeg" },
          { name: "Patek Philippe Nautilus", value: 120000, odds: 0.00005, rarity: "legendary", image_url: "https://images.pexels.com/photos/9981637/pexels-photo-9981637.jpeg" },
          { name: "Ferrari 488 Pista", value: 400000, odds: 0.00001, rarity: "legendary", image_url: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" },
          { name: "Lamborghini Huracán EVO", value: 300000, odds: 0.00002, rarity: "legendary", image_url: "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg" },
          { name: "Rolex Submariner Watch", value: 10000, odds: 0.001, rarity: "epic", image_url: "https://images.pexels.com/photos/9982604/pexels-photo-9982604.jpeg" },
          { name: "Vintage Rolex Daytona", value: 20000, odds: 0.0005, rarity: "epic", image_url: "https://images.pexels.com/photos/9981902/pexels-photo-9981902.jpeg" },
          { name: "Cartier Love Bracelet", value: 6500, odds: 0.002, rarity: "epic", image_url: "https://images.pexels.com/photos/8112139/pexels-photo-8112139.jpeg" },
        ];
      } else if (selectedCategory === 'high') {
        itemsToAdd = [
          { name: "Omega Seamaster Watch", value: 5500, odds: 0.003, rarity: "epic", image_url: "https://images.pexels.com/photos/9982561/pexels-photo-9982561.jpeg" },
          { name: "Pokemon Charizard Card (1st Ed.)", value: 10000, odds: 0.001, rarity: "epic", image_url: "https://images.pexels.com/photos/1294439/pexels-photo-1294439.jpeg" },
          { name: "Diamond Stud Earrings", value: 2000, odds: 0.01, rarity: "rare", image_url: "https://images.pexels.com/photos/10912520/pexels-photo-10912520.jpeg" },
          { name: "Burberry Trench Coat", value: 2200, odds: 0.01, rarity: "rare", image_url: "https://images.pexels.com/photos/7691269/pexels-photo-7691269.jpeg" },
          { name: "Louis Vuitton Speedy Bag", value: 1500, odds: 0.015, rarity: "rare", image_url: "https://images.pexels.com/photos/5233271/pexels-photo-5233271.jpeg" },
          { name: "Canada Goose Parka", value: 1200, odds: 0.02, rarity: "rare", image_url: "https://images.pexels.com/photos/6310924/pexels-photo-6310924.jpeg" },
        ];
      } else if (selectedCategory === 'mid') {
        itemsToAdd = [
          { name: "LEGO Millennium Falcon Set", value: 850, odds: 0.04, rarity: "rare", image_url: "https://images.pexels.com/photos/1750187/pexels-photo-1750187.jpeg" },
          { name: "TaylorMade Stealth Driver", value: 600, odds: 0.06, rarity: "rare", image_url: "https://images.pexels.com/photos/848618/pexels-photo-848618.jpeg" },
          { name: "DJI Mini 4 Pro Drone", value: 760, odds: 0.05, rarity: "uncommon", image_url: "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg" },
          { name: "Apple iPhone 14", value: 800, odds: 0.04, rarity: "uncommon", image_url: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg" },
          { name: "Samsung Galaxy S24", value: 850, odds: 0.04, rarity: "uncommon", image_url: "https://images.pexels.com/photos/9390250/pexels-photo-9390250.jpeg" },
          { name: "PlayStation 5", value: 500, odds: 0.06, rarity: "uncommon", image_url: "https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg" },
        ];
      } else { // budget
        itemsToAdd = [
          { name: "Xbox Series X", value: 500, odds: 0.06, rarity: "uncommon", image_url: "https://images.pexels.com/photos/2820884/pexels-photo-2820884.jpeg" },
          { name: "Nintendo Switch OLED", value: 350, odds: 0.08, rarity: "uncommon", image_url: "https://images.pexels.com/photos/9072192/pexels-photo-9072192.jpeg" },
          { name: "Apple AirPods Pro", value: 250, odds: 0.1, rarity: "uncommon", image_url: "https://images.pexels.com/photos/1591/technology-music-sound-things.jpg" },
          { name: "GoPro HERO12 Black", value: 400, odds: 0.07, rarity: "uncommon", image_url: "https://images.pexels.com/photos/1051371/pexels-photo-1051371.jpeg" },
          { name: "Nike Air Jordan 1 Retro", value: 200, odds: 0.15, rarity: "common", image_url: "https://images.pexels.com/photos/4462781/pexels-photo-4462781.jpeg" },
          { name: "Adidas Yeezy Boost 350", value: 250, odds: 0.12, rarity: "common", image_url: "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg" },
          { name: "Bose QuietComfort Headphones", value: 330, odds: 0.09, rarity: "common", image_url: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg" },
          { name: "North Face Puffer Jacket", value: 250, odds: 0.12, rarity: "common", image_url: "https://images.pexels.com/photos/7149401/pexels-photo-7149401.jpeg" },
        ];
      }
      
      let totalItemsAdded = 0;
      const itemsAddedPerCase = {};
      
      // Add items to each case
      for (const caseData of cases) {
        // Skip if case already has items
        const { data: existingItems, error: existingItemsError } = await supabase
          .from('case_items')
          .select('id')
          .eq('case_id', caseData.id);
          
        if (existingItemsError) throw existingItemsError;
        
        if (existingItems && existingItems.length > 0) {
          console.log(`Skipping case ${caseData.name} as it already has ${existingItems.length} items`);
          itemsAddedPerCase[caseData.id] = 0;
          continue;
        }
        
        // Prepare items for insertion with the case_id
        const preparedItems = itemsToAdd.map(item => ({
          ...item,
          case_id: caseData.id
        }));
        
        // Insert items
        const { data: insertedItems, error: insertError } = await supabase
          .from('case_items')
          .insert(preparedItems)
          .select();
          
        if (insertError) {
          console.error(`Error adding items to case ${caseData.name}:`, insertError);
          continue;
        }
        
        console.log(`Added ${insertedItems?.length || 0} items to case ${caseData.name}`);
        
        totalItemsAdded += insertedItems?.length || 0;
        itemsAddedPerCase[caseData.id] = insertedItems?.length || 0;
        
        // Update best_drop for the case
        if (insertedItems && insertedItems.length > 0) {
          // Get the highest value item for this case
          const highestValueItem = insertedItems.reduce((prev, current) => 
            (prev.value > current.value) ? prev : current
          );
          
          // Update the case with the best item
          await supabase
            .from('cases')
            .update({ best_drop: highestValueItem.name })
            .eq('id', caseData.id);
            
          console.log(`Updated best_drop for case ${caseData.name} to ${highestValueItem.name}`);
        }
      }
      
      toast({
        title: 'Success',
        description: `Added ${totalItemsAdded} items across ${Object.keys(itemsAddedPerCase).filter(id => itemsAddedPerCase[id] > 0).length} cases.`,
        duration: 5000,
      });
      
    } catch (error) {
      console.error('Error adding items:', error);
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Case Category</Label>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="premium">Premium Cases</SelectItem>
            <SelectItem value="high">High-End Cases</SelectItem>
            <SelectItem value="mid">Mid-Range Cases</SelectItem>
            <SelectItem value="budget">Budget Cases</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleAddItems} 
        disabled={isLoading}
        className="flex items-center gap-2 w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding Items...
          </>
        ) : (
          `Add Items to ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Cases`
        )}
      </Button>
    </div>
  );
};
