import { useState } from "react";
import { CaseCard } from "./CaseCard";
import { PriceFilter } from "./PriceFilter";

const cases = [
  // Existing cases
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
  // Creator Cases
  {
    id: 5,
    name: "WGTV Exclusive",
    price: 2500,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$50,000 Value",
    category: "premium"
  },
  {
    id: 6,
    name: "ZOID Special",
    price: 1800,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$35,000 Value",
    category: "premium"
  },
  {
    id: 7,
    name: "XPOSED Mystery",
    price: 3000,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$60,000 Value",
    category: "premium"
  },
  {
    id: 8,
    name: "YASSUO Challenge",
    price: 2000,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$40,000 Value",
    category: "premium"
  },
  {
    id: 9,
    name: "Mr BEAST Mega",
    price: 5000,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$100,000 Value",
    category: "premium"
  },
  {
    id: 10,
    name: "WWE Legends",
    price: 1500,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$30,000 Value",
    category: "premium"
  },
  {
    id: 11,
    name: "Budget Gaming",
    price: 25,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$250 Value",
    category: "budget"
  },
  {
    id: 12,
    name: "Tech Essentials",
    price: 100,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$1,000 Value",
    category: "mid"
  },
  {
    id: 13,
    name: "Streamer's Choice",
    price: 750,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$7,500 Value",
    category: "high"
  },
  {
    id: 14,
    name: "Content Creator",
    price: 1200,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$12,000 Value",
    category: "premium"
  },
  {
    id: 15,
    name: "Pro Gamer",
    price: 2000,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$20,000 Value",
    category: "premium"
  },
  // New Additional Cases
  {
    id: 16,
    name: "Student Budget",
    price: 5,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$50 Value",
    category: "budget"
  },
  {
    id: 17,
    name: "Casual Gamer",
    price: 30,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$300 Value",
    category: "budget"
  },
  {
    id: 18,
    name: "Weekend Warrior",
    price: 75,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$750 Value",
    category: "mid"
  },
  {
    id: 19,
    name: "Enthusiast Pack",
    price: 150,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$1,500 Value",
    category: "mid"
  },
  {
    id: 20,
    name: "Pro Setup",
    price: 300,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$3,000 Value",
    category: "high"
  },
  {
    id: 21,
    name: "Elite Gaming",
    price: 600,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$6,000 Value",
    category: "high"
  },
  {
    id: 22,
    name: "NINJA Special",
    price: 2200,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$44,000 Value",
    category: "premium"
  },
  {
    id: 23,
    name: "POKIMANE Select",
    price: 1900,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$38,000 Value",
    category: "premium"
  },
  {
    id: 24,
    name: "SHROUD Elite",
    price: 2800,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$56,000 Value",
    category: "premium"
  },
  {
    id: 25,
    name: "TFUE Legend",
    price: 2300,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$46,000 Value",
    category: "premium"
  },
  {
    id: 26,
    name: "ASMONGOLD Gold",
    price: 2100,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$42,000 Value",
    category: "premium"
  },
  {
    id: 27,
    name: "SUMMIT1G Peak",
    price: 2600,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    bestDrop: "$52,000 Value",
    category: "premium"
  },
  {
    id: 28,
    name: "TIMTHETATMAN Time",
    price: 2400,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    bestDrop: "$48,000 Value",
    category: "premium"
  },
  {
    id: 29,
    name: "NICKMERCS Power",
    price: 2700,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    bestDrop: "$54,000 Value",
    category: "premium"
  },
  {
    id: 30,
    name: "DRLUPO Ultra",
    price: 2900,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    bestDrop: "$58,000 Value",
    category: "premium"
  }
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