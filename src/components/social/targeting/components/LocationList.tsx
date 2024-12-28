import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Location } from "../types";

interface LocationListProps {
  locations: Location[];
  selectedLocations: string[];
  onLocationToggle: (locationId: string, checked: boolean) => void;
}

export const LocationList = ({ locations, selectedLocations, onLocationToggle }: LocationListProps) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Aucune ville disponible</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4 space-y-2">
        {locations.map((location) => (
          <div
            key={location.id}
            className="flex items-center space-x-3 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Checkbox
              id={location.id}
              checked={selectedLocations.includes(location.id)}
              onCheckedChange={(checked) => onLocationToggle(location.id, checked as boolean)}
            />
            <div className="grid gap-1">
              <label
                htmlFor={location.id}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {location.city}
              </label>
              <p className="text-xs text-muted-foreground">
                {location.postal_code}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};