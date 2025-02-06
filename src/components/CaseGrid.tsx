import { useState } from "react";
import { CaseCard } from "./CaseCard";
import { PriceFilter } from "./PriceFilter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Swords } from "lucide-react";

export const CaseGrid = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: cases, isLoading, error } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      console.log('Fetching cases from Supabase...');
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          case_items (*)
        `);
      
      if (error) {
        console.error('Error fetching cases:', error);
        throw error;
      }
      
      console.log('Cases fetched:', data);
      return data?.map(case_ => ({
        ...case_,
        category: 
          case_.price < 50 ? 'budget' :
          case_.price < 500 ? 'mid' :
          case_.price < 5000 ? 'high' : 'premium'
      }));
    },
  });

  const filteredCases = cases?.filter((case_) => {
    if (activeFilter === "all") return true;
    return case_.category === activeFilter;
  });

  if (error) {
    return (
      <div className="py-12 px-6 lg:px-8 text-center">
        <p className="text-red-500">Error loading cases. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <PriceFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <Button 
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
          onClick={() => {/* Battle functionality will be implemented later */}}
        >
          <Swords className="h-5 w-5" />
          Create Battle
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : (
          filteredCases?.map((case_) => (
            <CaseCard 
              key={case_.id} 
              id={case_.id}
              name={case_.name}
              price={case_.price}
              image={case_.image_url}
              bestDrop={case_.best_drop}
              category={case_.category}
              items={case_.case_items?.map(item => ({
                id: item.id,
                name: item.name,
                value: item.value,
                odds: item.odds,
                multiplier: item.multiplier,
                rarity: item.rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
                image: item.image_url
              })) || []}
            />
          ))
        )}
      </div>
    </div>
  );
};