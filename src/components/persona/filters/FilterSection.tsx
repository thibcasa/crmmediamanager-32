import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  title: string;
  icon: LucideIcon;
  filters: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  icon: Icon,
  filters,
  selectedFilters,
  onFilterChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "px-3 py-2 text-sm rounded-lg transition-colors text-left",
              selectedFilters.includes(filter.id)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};