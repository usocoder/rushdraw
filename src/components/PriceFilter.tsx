import { Button } from "@/components/ui/button";

interface PriceFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const PriceFilter = ({ activeFilter, onFilterChange }: PriceFilterProps) => {
  const filters = [
    { name: "All Cases", value: "all" },
    { name: "Budget (<$10)", value: "budget" },
    { name: "Mid-tier (<$100)", value: "mid" },
    { name: "High-roller (<$1000)", value: "high" },
    { name: "Premium (>$1000)", value: "premium" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          onClick={() => onFilterChange(filter.value)}
          className={`${
            activeFilter === filter.value
              ? "bg-primary text-white"
              : "text-secondary hover:text-primary"
          }`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};