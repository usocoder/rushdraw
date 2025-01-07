import { useState } from "react";
import { CaseCard } from "./CaseCard";
import { PriceFilter } from "./PriceFilter";

const cases = [
  {
    id: 1,
    name: "Starter Case",
    price: 1,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$20 Value",
    category: "budget"
  },
  {
    id: 2,
    name: "Premium Tech",
    price: 1200,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$24,000 Value",
    category: "premium"
  },
  {
    id: 3,
    name: "Future Drop",
    price: 50,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$500 Value",
    category: "mid"
  },
  {
    id: 4,
    name: "Developer's Dream",
    price: 500,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$5,000 Value",
    category: "high"
  },
  // ... Add more cases here with varying prices and categories
];

export const CaseGrid = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredCases = cases.filter((case_) => {
    if (activeFilter === "all") return true;
    return case_.category === activeFilter;
  });

  return (
    <div className="py-12 px-6 lg:px-8">
      <PriceFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCases.map((case_) => (
          <CaseCard key={case_.id} {...case_} />
        ))}
      </div>
    </div>
  );
};