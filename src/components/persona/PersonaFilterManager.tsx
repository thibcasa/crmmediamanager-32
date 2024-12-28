import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Target } from 'lucide-react';
import { FilterSection } from './filters/FilterSection';
import { filterSections } from './data/filterSections';

export const PersonaFilterManager = () => {
  const { toast } = useToast();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleApplyFilters = async () => {
    try {
      toast({
        title: "Filtres appliqués",
        description: `${selectedFilters.length} filtres sélectionnés`
      });
    } catch (error) {
      console.error('Error applying filters:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer les filtres",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterSections.map((section) => (
          <FilterSection
            key={section.title}
            title={section.title}
            icon={section.icon}
            filters={section.filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleApplyFilters}
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Appliquer les filtres ({selectedFilters.length})
        </Button>
      </div>
    </div>
  );
};