import { useState } from "react";
import { CaseCard } from "./CaseCard";
import { PriceFilter } from "./PriceFilter";
import { cases } from "../data/cases";

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