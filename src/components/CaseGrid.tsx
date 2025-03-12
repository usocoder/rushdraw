
import { useState } from "react";
import { CaseCard } from "./CaseCard";
import { PriceFilter } from "./PriceFilter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";
import { Pagination } from "./ui/pagination";

export const CaseGrid = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  // Calculate pagination
  const totalFilteredCases = filteredCases?.length || 0;
  const totalPages = Math.ceil(totalFilteredCases / itemsPerPage);
  
  // Get current page items
  const currentItems = filteredCases?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) {
    return (
      <div className="py-12 px-6 lg:px-8 text-center">
        <p className="text-red-500">Error loading cases. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 lg:px-8">
      <PriceFilter activeFilter={activeFilter} onFilterChange={(filter) => {
        setActiveFilter(filter);
        setCurrentPage(1); // Reset to first page when filter changes
      }} />
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
          currentItems?.map((case_) => (
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
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  isDisabled={currentPage === 1}
                />
              </Pagination.Item>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Pagination.Item key={index}>
                  <Pagination.Link 
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  isDisabled={currentPage === totalPages}
                />
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
};
