import { Checkbox } from "@/components/ui/checkbox";
import { Location } from '../types';
import { ScrollArea } from "@/components/ui/scroll-area";

interface LocationListProps {
  locations: Location[];
  selectedLocations: string[];
  onLocationToggle: (locationId: string, checked: boolean) => void;
}

export const LocationList = ({ locations, selectedLocations, onLocationToggle }: LocationListProps) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune ville trouvée
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      <div className="space-y-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className="flex items-center space-x-3 hover:bg-accent rounded-lg p-2 transition-colors"
          >
            <Checkbox
              id={location.id}
              checked={selectedLocations.includes(location.id)}
              onCheckedChange={(checked) => onLocationToggle(location.id, checked as boolean)}
            />
            <label
              htmlFor={location.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {location.city} ({location.postal_code})
            </label>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};