import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideIcon } from 'lucide-react';

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

export const FilterSection = ({
  title,
  icon: Icon,
  filters,
  selectedFilters,
  onFilterChange,
}: FilterSectionProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <Label className="text-lg font-medium">{title}</Label>
      </div>
      
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-2">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center space-x-2 hover:bg-accent rounded-lg p-2 transition-colors"
            >
              <Checkbox
                id={filter.id}
                checked={selectedFilters.includes(filter.id)}
                onCheckedChange={() => onFilterChange(filter.id)}
              />
              <label
                htmlFor={filter.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {filter.label}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};