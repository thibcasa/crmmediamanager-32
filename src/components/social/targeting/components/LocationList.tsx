import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Location } from "../types";

interface LocationListProps {
  locations: Location[];
  selectedLocations: string[];
  onLocationToggle: (locationId: string, checked: boolean) => void;
}

export const LocationList = ({ locations, selectedLocations, onLocationToggle }: LocationListProps) => {
  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-2">
        {locations.map((location) => (
          <div
            key={location.id}
            className="flex items-start space-x-3 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Checkbox
              id={location.id}
              checked={selectedLocations.includes(location.id)}
              onCheckedChange={(checked) => onLocationToggle(location.id, checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={location.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {location.city}
              </label>
              <p className="text-sm text-muted-foreground">
                {location.postal_code}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};